import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { vsFlaggedObject } from '../f5-configuration.types';

@Component({
  selector: 'generic-config-editor-modal',
  templateUrl: './generic-config-editor-modal.component.html',
  styleUrls: ['./generic-config-editor-modal.component.less']
})
export class GenericConfigEditorModalComponent {

  public isOpen = true;

  @Input()
  public vsName: string = "";

  @Input()
  public config: vsFlaggedObject;

  public isConfigEditorValid = true;

  @Output()
  public onCloseGeneralConfigEditorModal = new EventEmitter<boolean>();

  constructor(
  ) {}

  public closeModal(saveConfiguration: boolean): void {
    this.isOpen = false;

    this.onCloseGeneralConfigEditorModal.emit(saveConfiguration);
  }

  public handleConfigEditorValidationChange(isConfigEditorValid: boolean) {
    this.isConfigEditorValid = isConfigEditorValid;
  }
}
