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
  public onRefreshIncompleteMigrationsData = new EventEmitter<boolean>();

  public isOpenVsConfigEditorModal = false;

  public selectedMigrationForEditing: incompleteVsMigration;

  public dictionary = dictionary;

  public handleOpenVsConfigEditorModal(incompleteVsMigration: incompleteVsMigration): void {
    this.selectedMigrationForEditing = incompleteVsMigration;
    this.isOpenVsConfigEditorModal = true;
  }

  public handleCloseVsConfigEditorModal(): void {
    this.isOpenVsConfigEditorModal = false;

    this.onRefreshIncompleteMigrationsData.emit();
  }

  public trackByIndex(index: number): number {
    return index;
  }
}
