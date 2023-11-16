import {
  Component,
  EventEmitter,
  Input,
  OnInit,
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
export class GenericConfigEditorModalComponent implements OnInit {
  @Input()
  public config: vsFlaggedObject;

  @Input()
  public error: string;

  @Output()
  public onCloseGeneralConfigEditorModal = new EventEmitter<vsFlaggedObject>();

  public aviConfig = {};

  public isOpen = true;

  public isConfigEditorValid = true;

  public dictionary = dictionary;

  /** @override */
  public ngOnInit(): void {
    // We should do this because we can have 1 F5 object getting converted to multiple avi cofig objects.
    this.config.avi_objects.forEach(element => {
      this.aviConfig[element.avi_name] = element.Avi_Object;
    });
  }

  public closeModal(acceptedConfiguration: object): void {
    const config = { ...this.config };

    if (acceptedConfiguration) {
      config.Status = 'SUCCESSFUL';

       // We should do this because we can have 1 F5 object getting converted to multiple avi cofig objects.
      config.avi_objects.forEach(element => {
        element.Avi_Object = acceptedConfiguration[element.avi_name]
      });
    }

    this.onCloseGeneralConfigEditorModal.emit(acceptedConfiguration ? config : undefined);
  }
}
