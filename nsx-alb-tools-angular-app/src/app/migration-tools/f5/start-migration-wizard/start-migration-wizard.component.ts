import {
  Component,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';

import {
  ClrFormLayout,
  ClrWizard,
} from '@clr/angular';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { ConfigurationTabService } from '../../../shared/configuration-tab-response-data/configuration-tab-response-data.service';
import { lastValueFrom } from 'rxjs';
import * as l10n from './start-migration-wizard.l10n';
import { Router } from '@angular/router';

const { ENGLISH: dictionary } = l10n;

@Component({
  selector: 'start-migration-wizard',
  templateUrl: './start-migration-wizard.component.html',
  styleUrls: ['./start-migration-wizard.component.less']
})
export class StartMigrationWizardComponent {
  @ViewChild('wizard') wizard: ClrWizard;

  @Output()
  public onClose = new EventEmitter<void>();

  public certsAndKeysForm: FormGroup;

  public labControllerForm: FormGroup;

  public isWizardOpen = true;

  public finished = false;

  public errorMessage = '';

  public dictionary = dictionary;

  public readonly verticalLayout = ClrFormLayout.VERTICAL;

  constructor(
    private formBuilder: FormBuilder,
    private readonly configurationTabService: ConfigurationTabService,
    private router: Router,
  ) {
    const groupMembers = {
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      ipAddress: ['', [Validators.required, Validators.pattern("(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)")]],
    };

    this.certsAndKeysForm = this.formBuilder.group(groupMembers);
    this.labControllerForm = this.formBuilder.group(groupMembers);
  }

  public async onFinalizeLoad(): Promise<void> {
    try {
      const data$ = this.configurationTabService.startMigration({});
      await lastValueFrom(data$);

      this.finished = true;
      this.configurationTabService.showCompletedMigrationsCountAlert = true;

      this.closeWizard();
      this.router.navigate(['f5-migration', 'configuration'])
    } catch (error) {
      this.errorMessage = dictionary.generalErrorMessage;
      this.finished = true;
    }
  }

  public closeWizard(): void {
    if (this.finished) {
      this.wizard.finish();
      this.onClose.emit();
      this.isWizardOpen = false;
    }
  }
}
