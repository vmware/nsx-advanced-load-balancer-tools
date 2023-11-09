#!/usr/bin/env bash
{
    CMD=avitools-list
    DIR=$(pwd)/avi
    CONTAINER_HOSTNAME=migrationTools
    while getopts "c:d:h" OPTION
    do
        case $OPTION in
            c)
                CMD="$OPTARG"
                ;;
            d)
                DIR="$OPTARG"
                ;;
            h)
                echo "-c string    specify CMD to execute, in this mode container will be created and destroyed on command run, default value: $CMD"
                echo "-d string    specify working directory, where configuration files will exist, default value: $DIR"
                exit 0
                ;;
        esac
    done
    if [ ! -d "$DIR" ]; then
        echo  "$DIR directory not found. If you want to run the configurations please create a directory name as $DIR and put your configuration files into it. "
        exit 1
    fi
    output=$( docker ps -q -f status=running -f name=$CONTAINER_HOSTNAME )
    if [[ -z ${output} ]]; then 
        echo "A container with a name: $CONTAINER_HOSTNAME is not running."
        exit 1
    else
        echo "Using Avitools docker container: $CONTAINER_HOSTNAME with args: ${@}"
        docker exec -it -w /opt/avi "$CONTAINER_HOSTNAME" bash -c "$CMD"
        exit 0
    fi
}
