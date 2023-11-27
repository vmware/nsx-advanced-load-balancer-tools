export interface MigrationMetric {
  title: string;
  reviewed: number;
  incomplete: number;
  incompleteLabel?: string;
  percentCompleted: number;
  index?: number;
}
