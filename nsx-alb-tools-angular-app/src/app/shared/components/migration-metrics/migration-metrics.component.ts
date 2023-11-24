import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { forkJoin } from 'rxjs';

import { EMPTY_VALUE } from 'src/app/shared/constants';
import { MigrationMetric } from './migration-metrics.types';
import { ConfigurationService } from '../../configuration.service';
import { IRuleDataService } from '../../irule-data-service/irule-data.service';
import { MigrationMetricsService } from './migration-metrics.service';


import * as l10n from './migration-metrics.l10n';
const { ENGLISH: dictionary } = l10n;

@Component({
  selector: 'migration-metrics',
  templateUrl: './migration-metrics.component.html',
  styleUrls: ['./migration-metrics.component.less']
})
export class MigrationMetricsComponent implements OnInit {
  @Input()
  public metricsData: MigrationMetric[] = [];

  @Output()
  public onRefreshReq = new EventEmitter<void>();

  public emptyValue = EMPTY_VALUE;
  public dictionary = dictionary;
  private refreshSubsription;

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly iRuleDataService: IRuleDataService,
    private readonly migrationMetricsService: MigrationMetricsService,
  ) { }

  /** @override */
  public ngOnInit() {
    this.refreshSubsription =  this.migrationMetricsService.refreshSubject.subscribe((refresh) => {
      this.fetchOverview();
    })
    this.fetchOverview();
  }

  public fetchOverview() {
    this.metricsData = [];
    const combinedResponse = forkJoin([
      this.configurationService.getMigrationOverviewData(),
      this.iRuleDataService.getIRuleMigrationOverview()
    ]);

    combinedResponse.subscribe((data) => {
      const configOverviewResponse = data[0];
      const iRuleOverviewResponse = data[1];

      if (configOverviewResponse?.result) {
        const configOverview: MigrationMetric  = {
          title: dictionary.configMigrationTitle,
          reviewed: configOverviewResponse.result.reviewedVirtuals,
          incomplete: configOverviewResponse.result.incompleteVirtuals,
          percentCompleted: configOverviewResponse.result.migrationCompletedPercentage,
          index: 1,
        }
        this.metricsData.push(configOverview);
      }

      if (iRuleOverviewResponse?.reviewedIRules >= 0) {
        const iRuleOverview: MigrationMetric  = {
          title: dictionary.iRuleMigrationTitle,
          reviewed: iRuleOverviewResponse.reviewedIRules,
          incomplete: iRuleOverviewResponse.incompleteIRules,
          percentCompleted: iRuleOverviewResponse.migrationCompletedPercentage,
          index: 2,
        }
        this.metricsData.push(iRuleOverview);
      }
    })
  }

  public ngOnDestroy(): void {
    this.refreshSubsription.unsubscribe();
  }
}
