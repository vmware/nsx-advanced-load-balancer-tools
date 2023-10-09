import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { vsFlaggedObject } from '../f5-configuration.types';
import * as l10n from './generic-config-editor-modal.l10n';

const { ENGLISH: dictionary } = l10n;

@Component({
  selector: 'generic-config-editor-modal',
  templateUrl: './generic-config-editor-modal.component.html',
  styleUrls: ['./generic-config-editor-modal.component.less']
})
export class GenericConfigEditorModalComponent {
  @Input()
  public vsName: string;

  @Input()
  public config: vsFlaggedObject | undefined;

  @Output()
  public onCloseGeneralConfigEditorModal = new EventEmitter<boolean>();

  public isOpen = true;

  public isConfigEditorValid = true;

  public dictionary = dictionary;

  public closeModal(saveConfiguration: boolean): void {
    this.onCloseGeneralConfigEditorModal.emit(saveConfiguration);
  }

  public handleConfigEditorValidationChange(isConfigEditorValid: boolean) {
    this.isConfigEditorValid = isConfigEditorValid;
  }
}
