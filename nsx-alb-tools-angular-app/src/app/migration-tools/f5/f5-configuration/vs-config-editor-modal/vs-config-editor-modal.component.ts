import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { incompleteVsMigration, vsFlaggedObject } from '../f5-configuration.types';

@Component({
  selector: 'vs-config-editor-modal',
  templateUrl: './vs-config-editor-modal.component.html',
  styleUrls: ['./vs-config-editor-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VsConfigEditorModalComponent implements OnInit {

  public isOpen = true;

  public isOpenChildConfigEditorModal = false;

  public isVsConfigEditorValid = true;

  public childConfigEditorConfig: vsFlaggedObject;

  @Input()
  public vsConfig: incompleteVsMigration;

  @Output()
  public onCloseVsConfigEditorModal = new EventEmitter<void>();

  constructor(
  ) { }

  /** @override */
  public async ngOnInit(): Promise<void> {
  }

  public handleCloseChildConfigEditorModal(saveConfiguration: boolean) {
    this.isOpenChildConfigEditorModal = false;

    if (saveConfiguration) {
      // If saveConfiguration is true then send request to server and update the flagged object array of VS
      this.vsConfig.flaggedObjects = this.vsConfig.flaggedObjects.filter((element: vsFlaggedObject) => {
        return element.objectName !== this.childConfigEditorConfig?.objectName;
      });
    }

    this.setChildConfigEditorConfig();
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

  public setChildConfigEditorConfig(config?: vsFlaggedObject): void {
    if (config) {
      this.childConfigEditorConfig = config;
    }
  }

  public closeModal(): void {
    this.isOpen = false;

    this.onCloseVsConfigEditorModal.emit();
  }
}
