import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { ConfigurationService } from 'src/app/shared/configuration.service';

import {
  incompleteVsMigration,
  incompleteVsMigrationsData,
} from './f5-configuration.types';

import { ClrFormLayout } from '@clr/angular';
import { lastValueFrom } from 'rxjs';
import * as l10n from './f5-configuration.l10n';

const { ENGLISH: dictionary } = l10n;

@Component({
  selector: 'f5-configuration',
  templateUrl: './f5-configuration.component.html',
  styleUrls: ['./f5-configuration.component.less'],
})
export class F5ConfigurationComponent implements OnInit, OnDestroy {
  public incompleteVSMigrationsData: incompleteVsMigration[] = [];

  public selectedMigrationIndex = 0;

  public completedVSMigrationsCount = 0;

  public hasError = false;

  public isLoadingMigrationsData = false;

  public isOpenVsConfigEditorModal = false;

  public openEditControllerConfig = false;

  public readonly verticalLayout = ClrFormLayout.VERTICAL;

  public migrationOverviewData;

  public dictionary = dictionary;

  constructor(public readonly configurationService: ConfigurationService) { }


  /** @override */
  public async ngOnInit(): Promise<void> {
      await this.getAllIncompleteVSMigrationsData();
      await this.getMigrationOverviewData();
  }

  public handleCloseVsConfigEditor(isConfigurationAccepted: boolean): void {
    if (isConfigurationAccepted) {
      this.removeVsMigrationData(this.selectedMigrationIndex);
    }

    this.isOpenVsConfigEditorModal = false;
  }

  public async removeVsMigrationData(selectedMigrationIndex: number): Promise<void> {
    if (selectedMigrationIndex !== -1) {
      this.incompleteVSMigrationsData.splice(selectedMigrationIndex, 1);

      await this.getMigrationOverviewData();
    }
  }

  public handleSkip(): void {
    this.selectedMigrationIndex += 1;
  }

  public handleStart(): void {
    this.isOpenVsConfigEditorModal = true;
  }

  public async handleFetch(): Promise<void> {
    try {
      this.isLoadingMigrationsData = true;

      const fetchFromController$ = this.configurationService.fetchFromController();

      await lastValueFrom(fetchFromController$);
      await this.getAllIncompleteVSMigrationsData();
      await this.getMigrationOverviewData();

      this.configurationService.showCompletedMigrationsCountAlert = true;
    } catch (error) {
      this.hasError = true;
    } finally {
      this.isLoadingMigrationsData = false;
    }
  }

  public onErrorAlertClose(): void {
    this.hasError = false;
  }

  public onSuccessAlertClose(): void {
    this.configurationService.showCompletedMigrationsCountAlert = false;
  }

  /** * @override */
  public ngOnDestroy(): void {
    this.configurationService.showCompletedMigrationsCountAlert = false;
  }

  private async getMigrationOverviewData(): Promise<void> {
    const migrationOverviewData$ = this.configurationService.getMigrationOverviewData();
    this.migrationOverviewData = await lastValueFrom(migrationOverviewData$);
  }

  private async getAllIncompleteVSMigrationsData(): Promise<void> {
    try {
      this.isLoadingMigrationsData = true;

      const data$ = this.configurationService.getAllIncompleteVSMigrationsData();
      const data: incompleteVsMigrationsData = await lastValueFrom(data$);

      this.incompleteVSMigrationsData = data.incompleteVSMigrationsData || [];
      this.completedVSMigrationsCount = data.completedVSMigrationsCount || 0;
    } catch (error) {
      this.hasError = true;
    } finally {
      this.isLoadingMigrationsData = false;
    }
  }
}
