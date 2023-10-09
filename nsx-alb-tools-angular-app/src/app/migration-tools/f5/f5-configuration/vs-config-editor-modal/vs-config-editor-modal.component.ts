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

  public childConfigEditorConfig: vsFlaggedObject | undefined;

  public dictionary = dictionary;

  constructor(
    private readonly configurationTabService: ConfigurationTabService,
  ) { }

  public async handleCloseChildConfigEditorModal(saveConfiguration: boolean): Promise<void> {
    if (saveConfiguration) {
      this.vsConfig.flaggedObjects = this.vsConfig.flaggedObjects.filter((element: vsFlaggedObject) => {
        return element.objectName !== this.childConfigEditorConfig?.objectName;
      });

      const updateMigrationData$ = this.configurationTabService.updateMigrationData(this.vsConfig);
      await lastValueFrom(updateMigrationData$);
    }

    this.isOpenChildConfigEditorModal = false;
  }

  public handleVsConfigEditorValidationChange(isConfigEditorValid: boolean) {
    this.isVsConfigEditorValid = isConfigEditorValid;
  }

  public openChildConfigEditorModal(flaggedConfig: vsFlaggedObject): void {
    this.isOpenChildConfigEditorModal = true;

    this.setChildConfigEditorConfig(flaggedConfig);
  }

  public trackByIndex(index: number): number {
    return index;
  }

  private setChildConfigEditorConfig(config: vsFlaggedObject): void {
    this.childConfigEditorConfig = config;
  }

  public closeModal(saveConfiguration: boolean): void {
    this.onCloseVsConfigEditorModal.emit(saveConfiguration);
  }
}
