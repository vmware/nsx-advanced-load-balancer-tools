FROM avinetworks/avitools-base:bionic-20190515

ARG tf_version="0.12.5"
ARG avi_sdk_version
ARG avi_version

RUN echo "export ANSIBLE_LIBRARY=$HOME/.ansible/roles/avinetworks.avisdk/library" >> /etc/bash.bashrc && \
    export GOROOT=/usr/lib/go && \
    echo "export GOROOT=/usr/lib/go" >> /etc/bash.bashrc && \
    echo "export GOPATH=$HOME" >> /etc/bash.bashrc && \
    echo "export GOBIN=$HOME/bin" >> /etc/bash.bashrc && \
    echo "export ANSIBLE_FORCE_COLOR=True" >> /etc/bash.bashrc && \
    export PATH=$PATH:/usr/lib/go/bin:$HOME/bin && \
    echo "export PATH=$PATH:/usr/lib/go/bin:$HOME/bin:/opt/avi/scripts" >> /etc/bash.bashrc && \
    echo '"\e[A":history-search-backward' >> /root/.inputrc && \
    echo '"\e[B":history-search-forward' >> /root/.inputrc

RUN apt-get update && apt-get install -y \
    apache2-utils \
    apt-transport-https \
    lsb-release \
    gnupg \
    curl \
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
    python \
    python-cffi \
    python-dev \
    python-pip \
    python-virtualenv \
    slowhttptest \
    sshpass \
    tree \
    unzip \
    jq \
    vim && \
    pip install -U ansible==2.8.3 \
    appdirs==1.4.3 \
    aws-google-auth \
    awscli \
    bigsuds \
    ConfigParser==3.5.0 \
    ecdsa==0.13 \
    f5-sdk \
    flask==0.12.2 \
    jinja2==2.10 \
    jsondiff \
    kubernetes \
    netaddr \
    networkx==2.0 \
    nose-html-reporting==0.2.3 \
    nose-testconfig==0.10 \
    openpyxl==2.4.9 \
    openstacksdk \
    pandas==0.21.0 \
    paramiko==2.4.1 \
    pexpect==4.3.0 \
    pycrypto==2.6.1 \
    pyOpenssl==17.5.0 \
    pyparsing==2.2.0 \
    pytest-cov==2.5.1 \
    pytest-xdist==1.22.0 \
    pytest==3.2.5 \
    pyvmomi \
    pyyaml==3.12 \
    requests-toolbelt==0.8.0 \
    requests==2.18.4 \
    unittest2==1.1.0 \
    vcrpy==1.11.1 \
    xlrd==1.1.0 \
    xlsxwriter \
    urllib3==1.23 \
    yq \
    avisdk==${avi_sdk_version} \
    avimigrationtools==${avi_sdk_version} && \
    ansible-galaxy -c install avinetworks.aviconfig \
    avinetworks.avicontroller \
    avinetworks.avicontroller-azure \
    avinetworks.avicontroller_csp \
    avinetworks.avicontroller_vmware \
    avinetworks.avisdk \
    avinetworks.avise  \
    avinetworks.avise_csp \
    avinetworks.docker \
    avinetworks.network_interface \
    avinetworks.avimigrationtools \
    avinetworks.avise_vmware

RUN curl -sL https://packages.microsoft.com/keys/microsoft.asc |   gpg --dearmor | tee /etc/apt/trusted.gpg.d/microsoft.asc.gpg && \
    AZ_REPO=$(lsb_release -cs) && \
    echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ $AZ_REPO main" | tee /etc/apt/sources.list.d/azure-cli.list && \
    apt-get update && \
    apt-get install -y azure-cli

RUN curl https://releases.hashicorp.com/terraform/${tf_version}/terraform_${tf_version}_linux_amd64.zip -o terraform_${tf_version}_linux_amd64.zip &&  \
    unzip terraform_${tf_version}_linux_amd64.zip -d /usr/local/bin && \
    rm -rf terraform_${tf_version}_linux_amd64.zip

RUN curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add - && \
    touch /etc/apt/sources.list.d/kubernetes.list && \
    echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" | tee -a /etc/apt/sources.list.d/kubernetes.list && \
    apt-get update && apt-get install -y kubectl

RUN cd $HOME && \
    git clone https://github.com/avinetworks/avitools && \
    mkdir -p /opt/scripts && \
    cp -r avitools/scripts/* /opt/scripts && \
    rm -rf $HOME/avitools

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

RUN for script in $(ls /opt/scripts); do echo $script >> avitools-list; done;

RUN chmod +x avitools-list && \
    cp avitools-list /usr/local/bin/ && \
    echo "alias avitools-list=/usr/local/bin/avitools-list" >> ~/.bashrc

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* $HOME/.cache $HOME/go/src $HOME/src

ENV cmd cmd_to_run
CMD eval $cmd
