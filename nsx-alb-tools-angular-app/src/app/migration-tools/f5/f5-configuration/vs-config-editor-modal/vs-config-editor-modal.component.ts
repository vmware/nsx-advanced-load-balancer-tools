import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import {
  incompleteVsMigration,
  vsFlaggedObject
} from '../f5-configuration.types';

import { ConfigurationService } from 'src/app/shared/configuration.service';
import { MigrationMetricsService } from 'src/app/shared/components/migration-metrics/migration-metrics.service';

import { lastValueFrom } from 'rxjs';
import * as l10n from './vs-config-editor-modal.l10n';

const { ENGLISH: dictionary } = l10n;

const SUCCESSFUL_STATUS = 'SUCCESSFUL';

const enum ConfigurationTypes {
  SINGLE_OBJECT = 'singleObject',
  VIRTUAL_SERVICE = 'virtualService',
};
@Component({
  selector: 'vs-config-editor-modal',
  templateUrl: './vs-config-editor-modal.component.html',
  styleUrls: ['./vs-config-editor-modal.component.less'],
})
export class VsConfigEditorModalComponent {
  @Input()
  public vsConfig: incompleteVsMigration;

  @Output()
  public onCloseVsConfigEditorModal = new EventEmitter<boolean>();

  public hasChildConfigEditorError = false;

  public hasVSConfigEditorError = false;

  public isOpen = true;

  public isOpenChildConfigEditorModal = false;

  public isVsConfigEditorValid = true;

  public childConfigEditorConfigIndex: number = 0;

  public dictionary = dictionary;

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly migrationMetricsService: MigrationMetricsService
  ) { }

  public async handleCloseChildConfigEditorModal(acceptedConfiguration: vsFlaggedObject): Promise<void> {
    this.hasChildConfigEditorError = false;

    if (acceptedConfiguration) {
      const { F5_type: vsType, F5_SubType: vsSubType, F5_ID: vsId } = this.vsConfig;

      const result = {
        type: ConfigurationTypes.SINGLE_OBJECT,
        config: {
          F5_type: vsType,
          F5_SubType: vsSubType,
          F5_ID: vsId,
          Vs_Mapping: acceptedConfiguration,
        },
      }

      try {
        const updateMigrationData$ = this.configurationService.acceptConfiguration(result);
        await lastValueFrom(updateMigrationData$);

        if (this.childConfigEditorConfigIndex !== -1) {
          this.vsConfig.flaggedObjects.splice(this.childConfigEditorConfigIndex, 1);
          this.childConfigEditorConfigIndex = 0;
        }

        const mappingObjectIndex = this.vsConfig.Vs_Mappings.findIndex(object => {
          return object.F5_ID === acceptedConfiguration.F5_ID && object.F5_SubType === acceptedConfiguration.F5_SubType && object.F5_type === acceptedConfiguration.F5_type
        });

        if (mappingObjectIndex !== -1) {
          this.vsConfig.Vs_Mappings[mappingObjectIndex].Status = SUCCESSFUL_STATUS;
        }

        this.isOpenChildConfigEditorModal = false;
      } catch (errors) {
        this.hasChildConfigEditorError = true;
      }
    }
    else {
      this.isOpenChildConfigEditorModal = false;
    }
  }

  public openChildConfigEditorModal(index: number): void {
    this.childConfigEditorConfigIndex = index;

    this.isOpenChildConfigEditorModal = true;
  }

  public trackByIndex(index: number): number {
    return index;
  }

  public async closeModal(acceptedConfiguration): Promise<void> {
    const isAcceptedConfiguration = Boolean(acceptedConfiguration);
    this.hasVSConfigEditorError = false;

    if (isAcceptedConfiguration) {
      try {
        const tempConfig = { ...this.vsConfig };

        tempConfig.Status = SUCCESSFUL_STATUS;
        tempConfig.Avi_Object = acceptedConfiguration;

        tempConfig.flaggedObjects.forEach(object => {
          delete object.F5_Object;

          object.avi_objects.forEach(object => delete object.Avi_Object);
        });

        const result = {
          type: ConfigurationTypes.VIRTUAL_SERVICE,
          config: tempConfig,
        }
        const updateMigrationData$ = this.configurationService.acceptConfiguration(result);
        await lastValueFrom(updateMigrationData$);
        this.migrationMetricsService.refreshSubject.next();

        this.onCloseVsConfigEditorModal.emit(isAcceptedConfiguration);
      } catch (errors) {
        this.hasVSConfigEditorError = true;
      }
    }
    else {
      this.onCloseVsConfigEditorModal.emit(isAcceptedConfiguration);
    }
  }
}
