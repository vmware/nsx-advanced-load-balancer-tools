import { Component, OnInit } from '@angular/core';
import * as l10n from './f5-configuration.l10n';
import { ConfigurationTabService } from 'src/app/shared/configuration-tab-response-data/configuration-tab-response-data.service';
import { incompleteVsMigration } from './f5-configuration.types';

const { ENGLISH: dictionary, ...l10nKeys } = l10n;

@Component({
  selector: 'f5-configuration',
  templateUrl: './f5-configuration.component.html',
  styleUrls: ['./f5-configuration.component.less'],
})
export class F5ConfigurationComponent implements OnInit {

  dictionary = dictionary;

  public isOpenVsConfigEditorModal = false;

  public selectedVsForEditing: incompleteVsMigration;

  public incompleteMigrationData: incompleteVsMigration[] = [];

  constructor(
    private readonly configurationTabService: ConfigurationTabService,
  ) { }

  /** @override */
  public async ngOnInit(): Promise<void> {
    this.configurationTabService.getAllIncompleteVSMigrationData().subscribe((data)=> {
      this.incompleteMigrationData = data;
    });
  }

  public refreshInIncompleteVSData(): void {

  }

  public openVsConfigEditorModal(index: number): void {
    this.selectedVsForEditing = this.incompleteMigrationData[index];
    this.isOpenVsConfigEditorModal = true;
  }

  public closeVsConfigEditorModal(): void {
    this.isOpenVsConfigEditorModal = false;
  }

  public trackByIndex(index: number): number {
    return index;
  }
}
