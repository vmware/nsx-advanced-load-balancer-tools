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

import { ConfigurationTabService } from 'src/app/shared/configuration-tab-response-data/configuration-tab-response-data.service';
import { lastValueFrom } from 'rxjs';
import * as l10n from './vs-config-editor-modal.l10n';
import { Unary } from '@angular/compiler';

const { ENGLISH: dictionary } = l10n;

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

  public isOpen = true;

  public isOpenChildConfigEditorModal = false;

  public isVsConfigEditorValid = true;

  public childConfigEditorConfigIndex: number;

  public dictionary = dictionary;

  constructor(
    private readonly configurationTabService: ConfigurationTabService,
  ) { }

  public async handleCloseChildConfigEditorModal(acceptedConfiguration: vsFlaggedObject): Promise<void> {
    if (acceptedConfiguration) {
      const { F5_type: vsType, F5_SubType: vsSubType, F5_ID: vsId } = this.vsConfig;

      const result = {
        type: 'singleObject',
        config: {
          F5_type: vsType,
          F5_SubType: vsSubType,
          F5_ID: vsId,
          Vs_Mapping: acceptedConfiguration,
        },
      }

      try {
        const updateMigrationData$ = this.configurationTabService.acceptConfiguration(result);
        await lastValueFrom(updateMigrationData$);

        if (this.childConfigEditorConfigIndex !== -1) {
          this.vsConfig.flaggedObjects.splice(this.childConfigEditorConfigIndex, 1);
        }

        const mappingObjectIndex = this.vsConfig.Vs_Mappings.findIndex(object => {
          return object.F5_ID === acceptedConfiguration.F5_ID && object.F5_SubType === acceptedConfiguration.F5_SubType && object.F5_type === acceptedConfiguration.F5_type
        });

        if (mappingObjectIndex !== -1) {
          this.vsConfig.Vs_Mappings[mappingObjectIndex].Status = 'SUCCESSFUL';
        }


        this.isOpenChildConfigEditorModal = false;
      } catch (errors) {
        console.log("Accepted flagged object configuration was not saved");
      }
    }
    else {
      this.isOpenChildConfigEditorModal = false;
    }
  }

  public handleVsConfigEditorValidationChange(isConfigEditorValid: boolean) {
    this.isVsConfigEditorValid = isConfigEditorValid;
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

    if (isAcceptedConfiguration) {
      const tempConfig = { ...this.vsConfig };

      tempConfig.Status = 'SUCCESSFUL';
      tempConfig.Avi_Object = acceptedConfiguration;

      tempConfig.flaggedObjects.forEach(object => {
        delete object.F5_Object;

        object.avi_objects.forEach(object => delete object.Avi_Object);
      });

      const result = {
        type: 'virtualService',
        config: tempConfig,
      }

      try {
        const updateMigrationData$ = this.configurationTabService.acceptConfiguration(result);
        await lastValueFrom(updateMigrationData$);

        this.onCloseVsConfigEditorModal.emit(isAcceptedConfiguration);
      } catch (errors) {
        console.log("Accepted VS configuration was not saved");
      }
    }
    else {
      this.onCloseVsConfigEditorModal.emit(isAcceptedConfiguration);
    }
  }
}
