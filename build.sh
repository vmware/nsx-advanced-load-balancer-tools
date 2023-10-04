#!/usr/bin/env bash
############################################################################
#
# AVI CONFIDENTIAL
# __________________
#
# [2013] - [2018] Avi Networks Incorporated
# All Rights Reserved.
#
# NOTICE: All information contained herein is, and remains the property
# of Avi Networks Incorporated and its suppliers, if any. The intellectual
# and technical concepts contained herein are proprietary to Avi Networks
# Incorporated, and its suppliers and are covered by U.S. and Foreign
# Patents, patents in process, and are protected by trade secret or
# copyright law, and other laws. Dissemination of this information or
# reproduction of this material is strictly forbidden unless prior written
# permission is obtained from Avi Networks Incorporated.
###
{
    AVI_VERSION=22.1.4
    GOLANG_VERSION=1.20.6
    AKO_BRANCH=master
    while getopts "v:hg:a:" OPTION
    do
        case $OPTION in
            v)
                AVI_VERSION="$OPTARG"
                ;;
            g)
                GOLANG_VERSION="$OPTARG"
                ;;
            a)
                AKO_BRANCH="$OPTARG"
                ;;
            h)
                echo "-v  string   specify AVI_VERSION, default value: $AVI_VERSION"
                echo "-g  string   specify Golang version, default value: $GOLANG_VERSION"
                echo "-a  string   specify AKO branch name, default value: $AKO_BRANCH"
                exit 0
                ;;
        esac
    done
    if [ $AVI_VERSION == "30.2.1" ]
    then
        BRANCH="eng"
    else
        BRANCH=$AVI_VERSION
    fi
    cd $(git rev-parse --show-toplevel)
    docker build -t avinetworks/avitools:$AVI_VERSION --build-arg branch=$BRANCH --build-arg golang_version=$GOLANG_VERSION --build-arg ako_branch=$AKO_BRANCH -f Dockerfile .
}
