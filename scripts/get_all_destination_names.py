#!/usr/bin/env python3

############################################################################
# ========================================================================
# Copyright 2021 VMware, Inc.  All rights reserved. VMware Confidential
# ========================================================================
###

# Copyright 2021 VMware, Inc.
# SPDX-License-Identifier: Apache License 2.0
from avi.sdk.avi_api import ApiSession 
import json
import urllib3
import sys
import argparse
urllib3.disable_warnings()

# Getting Required Args
parser = argparse.ArgumentParser(description="AVI SDK based Script to get all destination")
parser.add_argument("-u", "--username", required=True, help="Login Source username")
parser.add_argument("-p", "--password", required=True, help="Login Source password")
parser.add_argument("-c", "--controller", required=True, help="Source Controller IP address")
parser.add_argument("-a", "--api_version", required=False, default=None, help="Api Version")
args = parser.parse_args()

if  args.api_version:
    session = ApiSession.get_session(args.controller, args.username, args.password, api_version=args.api_version,max_api_retries=3)
    api_version = session.remote_api_version['Version']
else:
    session = ApiSession.get_session(args.controller, args.username, args.password, max_api_retries=3)
    api_version = session.remote_api_version['Version']
    session.avi_credentials.api_version = api_version
# determine Avi version automaticall

""" 
results = 
{
    "se_in_provider_context": False,
    "tenants":[
        "hugo",
        "tenant-A",
        "tenant-B"
    ],
    "clouds": [
            {
                "cloud_name":"vcenter",
                "vrf":[
                    {"name": "abc"
                    "tenant" 'admin'
                        },
                     {"name": "xyz"
                    "tenant" 'admin'
                        },
                    {"name": "tenant-based-A"
                    "tenant" 'tenant-A'
                    }
                    ,
                    {"name": "tenant-based-B"
                    "tenant" 'tenant-B'
                        
                    }
                    
                ],
                "seg":[
                    {"name": "tenant-based-B"
                    "tenant" 'tenant-B'
                    }
                ]
        },
        {
            "cloud_name":"",
            "vrf":[

            ],
            "seg":[

            ]
        }
    ]
}
"""

cloud_list =[]
seg_list = []
tenant_list = []
vrf_list = []


def check_se_in_provider_context(avi_session):

    resp = avi_session.get("systemconfiguration",tenant='*')
    if resp == None or resp.status_code != 200:
        print(f"Failed to get system configuration. Please validate your connection or the status of your Avi controller!")    
        sys.exit(1)
    else:
        resp = resp.json()
        
        return resp['global_tenant_config']['se_in_provider_context']

    
def get_cloud_list(avi_session):
    cloud_list = []
    page = 1
    page_end = False
    while page_end is not True:
        resp = avi_session.get(f'cloud?fields=name&page_size=200&page={page}',tenant='*')
        
        if resp == None or resp.status_code != 200:
            print(f"Failed to get cloud. Please validate your connection or the status of your Avi controller!")    
            sys.exit(1)
        else:
            resp = resp.json()
            for result in resp['results']:
                cloud_list.append(result['name'])
            
        if "next" in resp.keys():
            page +=1
        else:
            page_end = True
        return cloud_list    

def get_tenant_list(avi_session):
    tenant_list = []
    page=1
    page_end = False
    while page_end is not True:
        resp = avi_session.get(f'tenant?fields=name&page_size=200&page={page}', tenant="*")

        if resp == None or resp.status_code != 200:
            print("Failed to collect tenant list. Please validate your connection or the status of your Avi controller!")    
            sys.exit(1)
        else:
            resp = resp.json()
            for result in resp['results']:
                tenant_list.append(result['name'])
            
        if "next" in resp.keys():
            page +=1
        else:
            page_end = True
        
    return tenant_list
    
def get_cloud_vrf(avi_session,cloud):
    vrf_list = []
    page = 1
    page_end = False
    while page_end is not True:
        resp = avi_session.get(f'vrfcontext?include_name=true&fields=name,tenant_ref&cloud_ref.name={cloud}&page_size=200&page={page}',tenant='*')
        
        if resp == None or resp.status_code != 200:
            print(f"Failed to get cloud VRF. Please validate your connection or the status of your Avi controller!")    
            sys.exit(1)
        else:
            resp = resp.json()
            for result in resp['results']:
                if result['name'].lower() != "management": 
                    vrf = {
                        "name": "",
                        "tenant": ""
                        }
                    vrf['name'] = result['name']
                    vrf['tenant'] = result['tenant_ref'].split('#')[-1]
                    vrf_list.append(vrf)
            
        if "next" in resp.keys():
            page +=1
        else:
            page_end = True
        return vrf_list      
    
def get_cloud_seg(avi_session,cloud):
    seg_list = []
    page = 1
    page_end = False
    while page_end is not True:
        resp = avi_session.get(f'serviceenginegroup?include_name=true&fields=name,tenant_ref&cloud_ref.name={cloud}&page_size=200&page={page}',tenant='*')
        
        if resp == None or resp.status_code != 200:
            print(f"Failed to get cloud SEG. Please validate your connection or the status of your Avi controller!")    
            sys.exit(1)
        else:
            resp = resp.json()
            for result in resp['results']:
                seg = {
                    "name": "",
                    "tenant": ""
                    }
                seg['name'] = result['name']
                seg['tenant'] = result['tenant_ref'].split('#')[-1]
                seg_list.append(seg)
            
        if "next" in resp.keys():
            page +=1
        else:
            page_end = True
        return seg_list     

results = {
    "avi_version": api_version,
    "se_in_provider_context": check_se_in_provider_context(avi_session=session),
    "tenants": get_tenant_list(avi_session=session),
    "clouds": [
    ]
}    

cloudlist = get_cloud_list(avi_session=session)

for cloud_name in get_cloud_list(avi_session=session):
    cloud_detail={
        "cloud_name": cloud_name,
        "vrf": get_cloud_vrf(avi_session=session,cloud=cloud_name),
        "seg": get_cloud_seg(avi_session=session,cloud=cloud_name)
    }
    results['clouds'].append(cloud_detail)

with open("controller_info.json",'w') as f:
    f.write(json.dumps(results, indent=4))
    f.close()
