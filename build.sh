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
    while getopts "v:b:hg:a:" OPTION
    do
        case $OPTION in
            v)
                AVI_VERSION="$OPTARG"
                ;;
            b)
                BRANCH="$OPTARG"
                ;;
            g)
                GOLANG_VERSION="$OPTARG"
                ;;
            a)
                AKO_BRANCH="$OPTARG"
                ;;
            h)
                echo "-v  string   specify AVI_VERSION, default value: $AVI_VERSION"
                echo "-b  string   specify SDK branch name, default value: $AVI_VERSION"
                echo "-g  string   specify Golang version, default value: $GOLANG_VERSION"
                echo "-a  string   specify AKO branch name, default value: $AKO_BRANCH"
                exit 0
                ;;
        esac
    done
    cd $(git rev-parse --show-toplevel)
    TOOLS_BRANCH=$AVI_VERSION
    if [ ! -n "$BRANCH" ]; then
        BRANCH=$AVI_VERSION
    fi

    docker build -t avinetworks/avitools:$AVI_VERSION --build-arg tools_branch=$TOOLS_BRANCH --build-arg avi_sdk_branch=$BRANCH --build-arg avi_version=$AVI_VERSION --build-arg golang_version=$GOLANG_VERSION --build-arg ako_branch=$AKO_BRANCH -f Dockerfile .
}
