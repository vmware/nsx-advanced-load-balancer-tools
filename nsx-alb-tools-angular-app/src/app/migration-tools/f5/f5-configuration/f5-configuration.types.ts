
export interface incompleteVsMigration {
  index: number,
  Complexity_Level: string,
  F5_ID: string,
  F5_Object: string,
  F5_SubType: string,
  F5_type: string,
  Indirect_mapping: string,
  Needs_Review: string,
  Not_Applicable: string,
  Skipped_for_defaults: string,
  Skipped_settings: string,
  Status: string,
  User_Ignored: string,
  Vs_Mappings: [vsFlaggedObject],
  flaggedObjects: [vsFlaggedObject],
  Avi_Object: object,
  }

  export interface incompleteVsMigrationsData {
    incompleteVSMigrationsData: incompleteVsMigration[],
    completedVSMigrationsCount: number,
  }

  export interface vsFlaggedObject {
    F5_ID: string,
    F5_Object?: string,
    F5_SubType: string,
    F5_type: string,
    Status: string,
    avi_objects: [{
      Avi_Object?: object,
      avi_name: string,
      avi_type: string
    }],
  }

  export interface labController {
    avi_lab_user: string,
    avi_lab_password: string,
    avi_lab_ip: string
  }
