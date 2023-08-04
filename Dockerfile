# Global build time Args
ARG BASE_IMAGE=projects.registry.vmware.com/photon/photon4:latest

FROM ${BASE_IMAGE}

# Terraform version parameter.
ARG tf_version="1.5.4"
# Go version parameter.
ARG golang_version
# This parameter include avi_version e.g 30.2.1
ARG avi_version
# Branch name to build on specific branch
ARG branch
# AKO branch version
ARG ako_branch

# Set the locale
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Set up env variables for Go and Terraform
ENV GOROOT "/usr/local/go"
ENV GOPATH $HOME
ENV GOBIN "$HOME/bin"
ENV PATH "$PATH:/usr/local/go/bin:$HOME/bin:/avi/scripts"
ENV TF_PLUGIN_CACHE_DIR "$HOME/.terraform.d/plugin-cache"

# Install dependencies
RUN tdnf check-update && \
    tdnf install -qq -y \
    build-essential \
    python3 \
    git \
    sshpass \
    sshfs \
    wget \
    sudo \
    python3-devel \
    python3-pip \
    libffi-devel && tdnf clean all

RUN git clone --branch ${branch}  https://github.com/vmware/alb-sdk /alb-sdk

# Update pycrypto in migrationtools for python3
WORKDIR /alb-sdk/python/avi/migrationtools
RUN sed -i "s/pycrypto/pycryptodome/g" setup.py

# This will install tar bundle for avisdk and migrationtools.
WORKDIR /alb-sdk/python/
RUN bash create_sdk_pip_packages.sh sdk
# Install migrationtools bundle
RUN bash create_sdk_pip_packages.sh migrationtools

# Install dependencies
WORKDIR /
RUN tdnf install -y \
    nodejs \
    gnupg \
    iproute2 \
    make \
    netcat \
    nmap \
    tree \
    unzip \
    jq \
    gcc \
    vim && \
    pip install ansible==2.9.13 && \
    pip install ansible-lint \
    f5-sdk \
    flask \
    jinja2 \
    jsondiff \
    networkx \
    openpyxl \
    netaddr \
    pandas \
    paramiko \
    pexpect \
    pycryptodome \ 
    pyOpenssl \
    pyparsing \
    pytest \
    pyvmomi \
    pyyaml \
    requests-toolbelt \
    xlsxwriter \
    hvac \
    ansible_runner \
    vcrpy \
    wheel \
    parameterized \
    /alb-sdk/python/dist/avisdk-${avi_version}.tar.gz \
    /alb-sdk/python/dist/avimigrationtools-${avi_version}.tar.gz

# This script will install nsx dependencies.
WORKDIR /alb-sdk/python/avi/migrationtools/nsxt_converter/
RUN python3 install_nsx_dependencies.py

# Install terraform
WORKDIR /
RUN curl https://releases.hashicorp.com/terraform/${tf_version}/terraform_${tf_version}_linux_amd64.zip -o terraform_${tf_version}_linux_amd64.zip &&  \
    unzip terraform_${tf_version}_linux_amd64.zip -d /usr/local/bin && \
    rm -rf terraform_${tf_version}_linux_amd64.zip

# Clone avitools and devops repositories
RUN cd $HOME && \
    git clone https://github.com/avinetworks/devops && \
    git clone https://github.com/vmware/nsx-advanced-load-balancer-tools avitools && \
    mkdir -p /avi/scripts && \
    cp -r avitools/scripts/* /avi/scripts && \
    rm -rf $HOME/avitools

# Install go 
RUN curl -L https://go.dev/dl/go${golang_version}.linux-amd64.tar.gz -o go${golang_version}.linux-amd64.tar.gz && \
    rm -rf /usr/local/go && tar -C /usr/local -xzf go${golang_version}.linux-amd64.tar.gz && \
    go version && \
    rm go${golang_version}.linux-amd64.tar.gz

# Ako and infra binaries
RUN mkdir -p $HOME/src/github.com/vmware && \
    cd $HOME/src/github.com/vmware && \
    git clone -b ${ako_branch} --single-branch https://github.com/vmware/load-balancer-and-ingress-services-for-kubernetes && \
    cd load-balancer-and-ingress-services-for-kubernetes && \
    make build-local && make build-local-infra && cp -r bin/* $HOME/ && \
    chmod +x $HOME/ako $HOME/ako-infra

# Clone terraform provider repository and build provider locally.
RUN cd $HOME && \
    git clone --branch ${branch} https://github.com/vmware/terraform-provider-avi && \
    cd ~/terraform-provider-avi && \
    make fmt . && \
    go mod tidy && \
    make build13 && \
    cd ~/terraform-provider-avi/examples/aws/cluster_stages/1_aws_resources && \
    terraform init

# # Clone ansible repo and install ansible collections.
RUN cd $HOME && \
    git clone --branch ${branch} https://github.com/vmware/ansible-collection-alb && \
    cd ~/ansible-collection-alb && \
    ansible-galaxy collection build && \
    ansible-galaxy collection install vmware-alb-*.tar.gz && \
    pip3 install -r ~/.ansible/collections/ansible_collections/vmware/alb/requirements.txt

# Verify all converters files.
RUN touch list && \
    echo '#!/bin/bash' > avitools-list && \
    echo "echo "f5_converter.py"" >> avitools-list && \
    echo "echo "netscaler_converter.py"" >> avitools-list && \
    echo "echo "gss_convertor.py"" >> avitools-list && \
    echo "echo "f5_discovery.py"" >> avitools-list && \
    echo "echo "avi_config_to_ansible.py"" >> avitools-list && \
    echo "echo "ace_converter.py"" >> avitools-list && \
    echo "echo "virtualservice_examples_api.py"" >> avitools-list && \
    echo "echo "config_patch.py"" >> avitools-list && \
    echo "echo "vs_filter.py"" >> avitools-list && \
    echo "echo "nsxt_converter.py"" >> avitools-list \
    echo "echo "v2avi_converter.py"" >> avitools-list

# Verify all script in avitools-list
RUN for script in $(ls /avi/scripts); do echo "echo $script" >> avitools-list; done;

# make executables
RUN chmod +x avitools-list && \
    cp avitools-list /usr/local/bin/ && \
    echo "alias avitools-list=/usr/local/bin/avitools-list" >> ~/.bashrc

# Clean out the cache
RUN tdnf clean all && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* $HOME/.cache $HOME/go/src $HOME/src ${GOPATH}/pkg

RUN apt-get update && \
    apt-get install -y curl && \
    curl -s https://deb.nodesource.com/setup_18.x | bash && \
    apt-get install -y nodejs

WORKDIR /app

# Copy the Angular project files to the container
COPY /nsx-alb-tools-angular-app/dist ./dist

# Copy the server files to the container
WORKDIR /app/server
COPY /nsx-alb-tools-angular-app/server/package.json /nsx-alb-tools-angular-app/server/package-lock.json ./
COPY /nsx-alb-tools-angular-app/server/server.js ./
RUN npm ci

# Expose the necessary port (e.g., 3000 for backend)
EXPOSE 3000

# Set the command to run when the container starts
CMD [ "node", "server.js"]
