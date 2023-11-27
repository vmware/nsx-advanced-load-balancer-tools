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
  public incompleteMigrationsData: incompleteVsMigration[] = [];

  public selectedMigrationIndex = 0;

  public completedVSMigrationsCount = 0;

  public hasError = false;

  public isLoadingMigrationsData = false;

  public isOpenVsConfigEditorModal = false;

  public openEditControllerConfig = false;

  public readonly verticalLayout = ClrFormLayout.VERTICAL;

  public dictionary = dictionary;

  constructor(public readonly configurationService: ConfigurationService) { }


  /** @override */
  public async ngOnInit(): Promise<void> {
    try {
      this.isLoadingMigrationsData = true;

      await this.getIncompleteMigrationsData();
    } catch (error) {
      this.hasError = true;
    } finally {
      this.isLoadingMigrationsData = false;
    }
  }

  public handleCloseVsConfigEditor(isConfigurationAccepted: boolean): void {
    if (isConfigurationAccepted) {
      this.handleVSAccept(this.selectedMigrationIndex);
    } else {
      this.isOpenVsConfigEditorModal = false;
    }
  }

  public async handleVSAccept(index: number): Promise<void> {
    try {
      await this.removeVsMigrationData(index);

      this.isOpenVsConfigEditorModal = false;
    } catch (error) {
      this.hasError = true;
    }
  }

  public async removeVsMigrationData(index: number): Promise<void> {
    if (index !== -1) {
      this.incompleteMigrationsData.splice(index, 1);
    }
  }

  public handleLabControllerError(): void {
    this.hasError = true;
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
      await this.getIncompleteMigrationsData();

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

  private async getIncompleteMigrationsData(): Promise<void> {
    const data$ = this.configurationService.getIncompleteMigrationsData();
    const data: incompleteVsMigrationsData = await lastValueFrom(data$);

    this.incompleteMigrationsData = data.incompleteVSMigrationsData || [];
    this.completedVSMigrationsCount = data.completedVSMigrationsCount || 0;
  }
}
