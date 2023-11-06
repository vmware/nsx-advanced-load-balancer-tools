import {
  Component,
  Input,
  EventEmitter,
  Output
} from '@angular/core';

import { incompleteVsMigration } from '../f5-configuration.types';
import * as l10n from './incomplete-migrations-grid.l10n';

const { ENGLISH: dictionary } = l10n;

@Component({
  selector: 'incomplete-migrations-grid',
  templateUrl: './incomplete-migrations-grid.component.html',
  styleUrls: ['./incomplete-migrations-grid.component.less']
})
export class IncompleteMigrationsGridComponent {
  @Input()
  public incompleteMigrationsData: incompleteVsMigration[] = [];

  @Output()
  public onCloseVsConfigEditor = new EventEmitter<void>();

  @Input()
  public isOpenVsConfigEditorModal = false;

  @Input()
  public selectedMigrationIndex: number;

  public dictionary = dictionary;

  public handleOpenVsConfigEditorModal(index: number): void {
    this.selectedMigrationIndex = index;
    this.isOpenVsConfigEditorModal = true;
  }

  public handleCloseVsConfigEditorModal(isConfigurationAccepted: boolean): void {
    if (isConfigurationAccepted) {
      if (this.selectedMigrationIndex !== -1) {
        this.incompleteMigrationsData.splice(this.selectedMigrationIndex, 1);
      }
    }

    this.isOpenVsConfigEditorModal = false;

    this.onCloseVsConfigEditor.emit();
  }

  public get isLoading(): boolean {
    return Boolean(!this.incompleteMigrationsData?.length);
  }

  public trackByIndex(index: number): number {
    return index;
  }
}
