import {
  Component,
  OnInit
} from '@angular/core';

import { ConfigurationTabService } from 'src/app/shared/configuration-tab-response-data/configuration-tab-response-data.service';
import { incompleteVsMigration } from './f5-configuration.types';
import { ClrFormLayout } from '@clr/angular';
import * as l10n from './f5-configuration.l10n';

import { lastValueFrom } from 'rxjs';
import { HttpService } from '../../../shared/http/http.service';
const { ENGLISH: dictionary, ...l10nKeys } = l10n;

@Component({
  selector: 'f5-configuration',
  templateUrl: './f5-configuration.component.html',
  styleUrls: ['./f5-configuration.component.less'],
})
export class F5ConfigurationComponent implements OnInit {
  public incompleteMigrationsData: incompleteVsMigration[] = [];

  public selectedMigrationData: incompleteVsMigration;

  public selectedMigrationIndex: number = 0;

  public isOpenVsConfigEditorModal = false;

  public openEditControllerConfig = false;

  public readonly verticalLayout = ClrFormLayout.VERTICAL;

  data;

  dictionary = dictionary;

  constructor(
    private readonly configurationTabService: ConfigurationTabService,
    private http: HttpService,
  ) {
    this.http.get('f5ready').subscribe((data)=> {
      this.data = data;
    });
  }

  /** @override */
  public async ngOnInit(): Promise<void> {
    await this.getAllIncompleteVSMigrationsData();
  }

  public handleRefreshIncompleteMigrationsData(): void {
    // this.getAllIncompleteVSMigrationsData();
  }

  public handleCloseStartMigrationWizard(): void {
    this.openEditControllerConfig = false
  }

  public handleSkip(): void {
    this.selectedMigrationIndex += 1;
    this.selectedMigrationData = this.incompleteMigrationsData[this.selectedMigrationIndex];
  }

  public handleStart(): void {
    this.isOpenVsConfigEditorModal = true;
  }

  public handleLabControllerEdit(): void {
    this.openEditControllerConfig = true;
  }

  public async handleCloseVsConfigEditorModal(saveConfiguration: boolean): Promise<void> {
    if (saveConfiguration) {
      const updateMigrationData$ = this.configurationTabService.updateMigrationData(this.selectedMigrationData);
      await lastValueFrom(updateMigrationData$);
    }

    this.isOpenVsConfigEditorModal = false;
  }

  private async getAllIncompleteVSMigrationsData(): Promise<void> {
    const incompleteMigrationsData$ = this.configurationTabService.getAllIncompleteVSMigrationsData();
    this.incompleteMigrationsData = await lastValueFrom(incompleteMigrationsData$);
    this.selectedMigrationData = this.incompleteMigrationsData[this.selectedMigrationIndex];
  }
}
