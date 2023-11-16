import { Component, EventEmitter, Input, Output } from '@angular/core';
import { incompleteVsMigration } from '../f5-configuration.types';
import { ClrFormLayout } from '@clr/angular';
import * as l10n from './next-conversion-card.l10n';
import { EMPTY_VALUE } from 'src/app/shared/constants';

const { ENGLISH: dictionary } = l10n;

@Component({
  selector: 'next-conversion-card',
  templateUrl: './next-conversion-card.component.html',
  styleUrls: ['./next-conversion-card.component.less']
})
export class NextConversionCardComponent {
  @Input()
  public selectedMigrationData: incompleteVsMigration | undefined;

  @Input()
  public isFetchInProgress = false;

  @Output()
  public onSkip = new EventEmitter<void>();

  @Output()
  public onStart = new EventEmitter<void>();

  public emptyValue = EMPTY_VALUE;

  public dictionary = dictionary;

  public readonly verticalLayout = ClrFormLayout.VERTICAL;

  public handleSkip(): void {
    this.onSkip.emit();
  }

  public handleStart(): void {
    this.onStart.emit();
  }
}
