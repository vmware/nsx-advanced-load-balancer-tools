export interface IRuleMigration {
  Irule: string;
  vs_count: number;
  Vs: string[];
  Status: string;
}

export interface labController {
  avi_lab_user: string,
  avi_lab_password: string,
  avi_lab_ip: string
}

export interface IRuleMigrationOverview {
  reviewedIRules: number;
  skippedIRules: number;
  migrationCompletedPercentage: number;
}
