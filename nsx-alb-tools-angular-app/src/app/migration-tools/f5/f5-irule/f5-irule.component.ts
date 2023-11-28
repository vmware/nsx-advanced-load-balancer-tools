import {
  Component,
  OnInit
} from '@angular/core';

import { IRuleDataService } from '../../../shared/irule-data-service/irule-data.service';
import { ConfigurationService } from 'src/app/shared/configuration.service';


import {
  IRuleMigration,
} from './f5-irule.types';

import { ClrFormLayout } from '@clr/angular';
import { lastValueFrom } from 'rxjs';
import * as l10n from './f5-irule.l10n';

const { ENGLISH: dictionary } = l10n;

@Component({
  selector: 'f5-irule',
  templateUrl: './f5-irule.component.html',
  styleUrls: ['./f5-irule.component.less'],
})
export class F5IRuleComponent implements OnInit {

  public readonly verticalLayout = ClrFormLayout.VERTICAL;

  public iRuleOverviewData;

  public dictionary = dictionary;

  public isLoading = false;

  public hasError = false;

  public isLoadingLabControllerData = false;

  constructor(
    public readonly iRuleDataService: IRuleDataService,
    public readonly configurationTabService: ConfigurationService
  ) { }


  /** @override */
  public async ngOnInit(): Promise<void> {
    await this.getIRuleOverviewData();
  }

  public async getIRuleOverviewData(): Promise<void> {
    this.isLoading = true;
    this.iRuleDataService.getSkippedIRules().subscribe({
      next: (data) => {
        this.iRuleOverviewData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
        this.hasError = true;
      }
    })
  }

  public async fetchLabControllerDetails(): Promise<void> {
    try {
      this.isLoadingLabControllerData = true;

      const fetchFromController$ = this.configurationTabService.fetchFromController();

      await lastValueFrom(fetchFromController$);

      this.configurationTabService.showCompletedMigrationsCountAlert = true;
    } catch (error) {
      this.hasError = true;
    } finally {
      this.isLoadingLabControllerData = false;
    }
  }

  public onErrorAlertClose(): void {
    this.hasError = false;
  }

  public trackByIndex(index: number): number {
    return index;
  }
}
