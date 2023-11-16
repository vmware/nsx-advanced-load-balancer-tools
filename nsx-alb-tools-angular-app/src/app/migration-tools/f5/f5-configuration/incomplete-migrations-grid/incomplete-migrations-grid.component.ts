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

  @Input()
  public isLoading = false;

  @Output()
  public onAcceptVsConfig = new EventEmitter<number>();

  public isOpenVsConfigEditorModal = false;

  public selectedMigrationData: incompleteVsMigration | undefined;

  public dictionary = dictionary;

  public handleOpenVsConfigEditorModal(data: incompleteVsMigration): void {
    this.selectedMigrationData = data;
    this.isOpenVsConfigEditorModal = true;
  }

  public handleCloseVsConfigEditorModal(isConfigurationAccepted: boolean): void {
    if (isConfigurationAccepted) {
      const { F5_ID: id, F5_SubType: subtype, F5_type: type } = this.selectedMigrationData || {};

      const index = this.incompleteMigrationsData.findIndex(data => {
        return data.F5_ID === id && data.F5_SubType === subtype && data.F5_type === type;
      });

      this.onAcceptVsConfig.emit(index);
    }

    delete this.selectedMigrationData;
    this.isOpenVsConfigEditorModal = false;
  }

  public trackByIndex(index: number): number {
    return index;
  }
}
