#!/usr/bin/env bash
{
    AVI_VERSION=18.1.4
    CMD=avitools-list
    DIR=$(pwd)/avi
    # Use Docker Daemon Default network
    NET=""
    CONTAINER_HOSTNAME=avitools
    while getopts "c:d:hnv:ub" OPTION
    do
        case $OPTION in
            v)
                AVI_VERSION="$OPTARG"
                ;;
            c)
                CMD="$OPTARG"
                ;;
            d)
                DIR="$OPTARG"
                ;;
            n)
                #Use host networking, the host networking driver only works on Linux hosts
                NET="--net=host"
                ;;
            u)
                PULL_IMAGE=true
                ;;
            b)
                RUN_IN_BACKGROUND=true
                ;;
            h)
                echo "-v string    specify AVI_VERSION, default value: $AVI_VERSION"
                echo "-c string    specify CMD to execute, in this mode container will be created and destroyed on command run, default value: $CMD"
                echo "-d string    specify working directory, where configuration files will exist, default value: $DIR"
                echo "-u           update docker image, i.e. try to pull docker image again"
                echo "-b           run in background, other words create avitools container and retain it, container can be accessible after script execution, for example as \"docker exec -it avitools bash\", default value: $CMD"
                echo "-n           use host networking instead of docker daemon default network, i.e. "docker run --net=host""
                exit 0
                ;;
        esac
    done
    AVITOOLS_DOCKER_IMAGE="avinetworks/avitools:$AVI_VERSION"
    if [ $PULL_IMAGE ]; then
        docker pull "$AVITOOLS_DOCKER_IMAGE"
        exit 0
    fi
    if [ ! -d "$DIR" ]; then
        echo  "$DIR directory not found. If you want to run the configurations please create a directory name as $DIR and put your configuration files into it. "
        exit 1
    fi
    echo "Using Avitools docker image: $AVITOOLS_DOCKER_IMAGE with args: ${@}"
    if [ $RUN_IN_BACKGROUND ]; then
        docker run -td --hostname $CONTAINER_HOSTNAME --name $CONTAINER_HOSTNAME -w /opt/avi -v $DIR:/opt/avi $NET "$AVITOOLS_DOCKER_IMAGE" $CMD
        exit 0
    else
        docker run --rm -w /opt/avi -v $DIR:/opt/avi $NET "$AVITOOLS_DOCKER_IMAGE" $CMD
        exit 0
    fi
}