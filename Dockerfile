FROM ubuntu:focal-20200925

ARG tf_version="0.14.5"
ARG avi_sdk_version
ARG avi_version

RUN echo "export GOROOT=/usr/lib/go" >> /etc/bash.bashrc && \
    echo "export TF_PLUGIN_CACHE_DIR=$HOME/.terraform.d/plugin-cache"  >> /etc/bash.bashrc && \
    echo "export GOROOT=/usr/lib/go" >> /etc/bash.bashrc && \
    echo "export GOPATH=$HOME" >> /etc/bash.bashrc && \
    echo "export GOBIN=$HOME/bin" >> /etc/bash.bashrc && \
    echo "export ANSIBLE_FORCE_COLOR=True" >> /etc/bash.bashrc && \
    export PATH=$PATH:/usr/lib/go/bin:$HOME/bin:/avi/scripts && \
    echo "export PATH=$PATH:/usr/lib/go/bin:$HOME/bin:/avi/scripts" >> /etc/bash.bashrc && \
    echo '"\e[A":history-search-backward' >> /root/.inputrc && \
    echo '"\e[B":history-search-forward' >> /root/.inputrc

RUN apt-get update && \
    apt install -y software-properties-common && \
    add-apt-repository -y ppa:deadsnakes/ppa && \
    apt update && \
    apt install -y python3.8 \
    python3.8-dev \
    python3.8-distutils \
    python2.7 \
    python2.7-dev \
    curl && \
    cd /tmp && curl -O https://bootstrap.pypa.io/get-pip.py && \
    curl -o get-pip-27.py https://bootstrap.pypa.io/pip/2.7/get-pip.py && \
    python2.7 /tmp/get-pip-27.py && \
    python3.8 /tmp/get-pip.py && \
    ln -s /usr/bin/python2.7 /usr/bin/python && \
    rm -rf /usr/local/bin/pip

RUN apt-get update && \ 
    apt-get install -y \
    apache2-utils \
    apt-transport-https \
    lsb-release \
    gnupg \
    dnsutils \
    git \
    httpie \
    inetutils-ping \
    iproute2 \
    libffi-dev \
    libssl-dev \
    lua5.3 \
    make \
    netcat \
    nmap \
    slowhttptest \
    sshpass \
    tree \
    unzip \
    jq \
    gcc \
    vim && \
    pip2 install -U appdirs \
    aws-google-auth \
    awscli \
    bigsuds \
    ConfigParser \
    ecdsa \
    f5-sdk \
    flask \
    jinja2 \
    jsondiff \
    kubernetes \
    netaddr \
    networkx \
    nose-html-reporting \
    nose-testconfig \
    openpyxl \
    openstacksdk \
    pandas \
    paramiko \
    pexpect \
    pyOpenssl \
    pyparsing \
    pytest-cov \
    pytest-xdist \
    pytest \
    pyvmomi \
    pyyaml \
    requests-toolbelt \
    requests \
    unittest2 \
    vcrpy \
    xlrd \
    xlsxwriter \
    urllib3 \
    hvac \
    yq \
    avisdk==${avi_sdk_version} \
    avimigrationtools==${avi_sdk_version} && \
    pip3 install setuptools==57.5.0 && \
    pip3 uninstall ansible-core -y \
    pip3 install ansible==2.9.13 && \
    pip3 install ansible-lint \
    awscli \
    bigsuds \
    f5-sdk \
    flask \
    jinja2 \
    jsondiff \
    kubernetes \
    openstacksdk \
    netaddr \
    pandas \
    paramiko \
    pexpect \
    pycrypto \
    pyOpenssl \
    pyparsing \
    pyvmomi \
    pyyaml \
    requests-toolbelt \
    requests \
    xlsxwriter \
    urllib3 \
    hvac \
    yq \
    avisdk==${avi_sdk_version} \
    avimigrationtools==${avi_sdk_version} && \
    ansible-galaxy install -c avinetworks.avicontroller \
    avinetworks.avicontroller-azure \
    avinetworks.avicontroller_csp \
    avinetworks.avicontroller_vmware \
    avinetworks.avise  \
    avinetworks.avise_csp \
    avinetworks.docker \
    avinetworks.network_interface \
    avinetworks.avimigrationtools \
    avinetworks.avise_vmware && \
    ansible-galaxy collection install community.network \
    vmware.alb

RUN cd /tmp && curl -O https://raw.githubusercontent.com/avinetworks/avitools/master/files/VMware-ovftool-4.4.0-16360108-lin.x86_64.bundle
RUN /bin/bash /tmp/VMware-ovftool-4.4.0-16360108-lin.x86_64.bundle --eulas-agreed --required --console
RUN rm -f /tmp/VMware-ovftool-4.4.0-16360108-lin.x86_64.bundle

RUN curl -sL https://packages.microsoft.com/keys/microsoft.asc |   gpg --dearmor | tee /etc/apt/trusted.gpg.d/microsoft.asc.gpg && \
    AZ_REPO=$(lsb_release -cs) && \
    echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ $AZ_REPO main" | tee /etc/apt/sources.list.d/azure-cli.list && \
    apt-get update && \
    apt-get install -y azure-cli

RUN curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash

RUN curl https://releases.hashicorp.com/terraform/${tf_version}/terraform_${tf_version}_linux_amd64.zip -o terraform_${tf_version}_linux_amd64.zip &&  \
    unzip terraform_${tf_version}_linux_amd64.zip -d /usr/local/bin && \
    rm -rf terraform_${tf_version}_linux_amd64.zip

RUN curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add - && \
    touch /etc/apt/sources.list.d/kubernetes.list && \
    echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" | tee -a /etc/apt/sources.list.d/kubernetes.list && \
    apt-get update && apt-get install -y kubectl

RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt \
    cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && curl \
    https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg  \
    add - && apt-get update -y && apt-get install google-cloud-sdk -y

RUN curl -L https://github.com/vmware/govmomi/releases/download/v0.22.1/govc_linux_amd64.gz \ | gunzip > /usr/local/bin/govc && \
    chmod +x /usr/local/bin/govc

RUN cd $HOME && \
    git clone https://github.com/avinetworks/devops && \
    git clone https://github.com/as679/power-beaver && \
    git clone https://github.com/vmware/terraform-provider-avi && \
    git clone https://github.com/avinetworks/avitools && \
    mkdir -p /avi/scripts && \
    cp -r avitools/scripts/* /avi/scripts && \
    rm -rf $HOME/avitools && \
    mkdir $HOME/.terraform.d/ && \
    mkdir $HOME/.terraform.d/plugin-cache && \
    cd ~/terraform-provider-avi/examples/aws/cluster_stages/1_aws_resources && \
    export TF_PLUGIN_CACHE_DIR=$HOME/.terraform.d/plugin-cache && \
    sed -i 's/version = ".*\..*\..*"/version =  "'${avi_version}'"/g' versions.tf && \
    terraform init

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
    echo "echo "vs_filter.py"" >> avitools-list

RUN for script in $(ls /avi/scripts); do echo "echo $script" >> avitools-list; done;

RUN chmod +x avitools-list && \
    cp avitools-list /usr/local/bin/ && \
    echo "alias avitools-list=/usr/local/bin/avitools-list" >> ~/.bashrc

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* $HOME/.cache $HOME/go/src $HOME/src

ENV cmd cmd_to_run
CMD eval $cmd
