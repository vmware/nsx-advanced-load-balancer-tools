import {
  AfterViewInit,
  ChangeDetectorRef,
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
  public rightSectionConfig: object | undefined;

  @Input()
  public disableAccept = false;

  public isConfigEditorValid = false;

  @Output()
  public onClose = new EventEmitter<object>();

  @ViewChild('jsonEditorContainerNsxAlbConfig', { static: false })
  private jsonEditorContainerNsxAlbConfig!: ElementRef;

  public jsonEditor: JSONEditor;

  public dictionary = dictionary;

  private options: JSONEditorOptions = {
    mode: 'text',
    onValidationError: (errors) => {
      this.isConfigEditorValid = !errors.length;
      this.cdr.detectChanges();
    },
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    const { options, jsonEditorContainerNsxAlbConfig } = this;

    this.jsonEditor = new JSONEditor(
      jsonEditorContainerNsxAlbConfig.nativeElement,
      options,
      this.rightSectionConfig,
    );
  }

  public closeModal(saveConfiguration: boolean): void {
    let validConfig;

    if (saveConfiguration) {
      validConfig = this.jsonEditor.get();
    }

    this.onClose.emit(validConfig);
  }
}
