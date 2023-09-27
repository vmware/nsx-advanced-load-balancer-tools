import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import JSONEditor, { JSONEditorOptions } from 'jsoneditor';

@Component({
  selector: 'config-editor',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.less']
})
export class ConfigEditorComponent implements AfterViewInit {
  @Input()
  public leftSectionConfig: string = '';

  @Input()
  public rightSectionConfig: any;

  private options: JSONEditorOptions = {
    mode: 'text',
    onValidationError: (errors) => {
      this.isConfigEditorValid.emit(!errors.length);
    }
  }

  @Output()
  public isConfigEditorValid = new EventEmitter<boolean>();

  @ViewChild('jsonEditorContainerNsxAlbConfig', { static: false })
  private jsonEditorContainerNsxAlbConfig!: ElementRef;

  constructor() { }

  ngAfterViewInit() {
    const { options, jsonEditorContainerNsxAlbConfig } = this;
    //const data = JSON.parse(this.rightSectionConfig);

    const jsonEditor = new JSONEditor(
      jsonEditorContainerNsxAlbConfig.nativeElement,
      options,
      this.rightSectionConfig,
    );
  }
}
