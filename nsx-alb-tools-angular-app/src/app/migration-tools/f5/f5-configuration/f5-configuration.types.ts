
export interface incompleteVsMigration {
    vsName: string,
    F5Obj: string,
    aviObj: incompleteVsMigrationAviObject,
    status: string,
    flaggedObjects: vsFlaggedObject[],
  }
export interface incompleteVsMigrationAviObject {
    name: string,
    description: string,
    type: string,
    enabled: boolean,
    traffic_enabled: boolean,
    cloud_ref: String,
    services: vsAviObjectService[],
    application_profile_ref: string,
    vs_datascripts: [],
    tenant_ref: string,
    vh_type: string,
    vrf_context_ref: string,
    vsvip_ref: string,
    pool_ref: string,
    network_profile_ref: string,
    ssl_profile_ref: string,
    ssl_key_and_certificate_refs: string[]
}

export interface vsAviObjectService {
    port: number,
    enable_ssl: boolean
  }

  export interface vsFlaggedObject {
    objectName: string,
    needReview: boolean,
    type: string,
    F5Obj: string,
    aviObj: any,
  }

  export interface labController {
    username: string,
    password: string,
    ipAddress: string
  }
