import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import JSONEditor, { JSONEditorOptions } from 'jsoneditor';
import * as l10n from './config-editor.l10n';

const { ENGLISH: dictionary } = l10n;


@Component({
  selector: 'config-editor',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.less']
})
export class ConfigEditorComponent implements AfterViewInit {
  @Input()
  public leftSectionConfig: string | undefined = '';

  @Input()
  public rightSectionConfig: any;

  @Output()
  public isConfigEditorValid = new EventEmitter<boolean>();

  @ViewChild('jsonEditorContainerNsxAlbConfig', { static: false })
  private jsonEditorContainerNsxAlbConfig!: ElementRef;

  public dictionary = dictionary;

  private options: JSONEditorOptions = {
    mode: 'text',
    onValidationError: (errors) => {
      this.isConfigEditorValid.emit(!errors.length);
    }
  }

  ngAfterViewInit() {
    const { options, jsonEditorContainerNsxAlbConfig } = this;

    const jsonEditor = new JSONEditor(
      jsonEditorContainerNsxAlbConfig.nativeElement,
      options,
      this.rightSectionConfig,
    );
  }
}
