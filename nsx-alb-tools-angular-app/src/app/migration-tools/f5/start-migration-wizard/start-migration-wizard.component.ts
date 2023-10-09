import {
  Component,
  ViewChild,
  AfterViewInit,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';

import {
  ClrFormLayout,
  ClrWizard,
  ClrWizardPage
} from '@clr/angular';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { ConfigurationTabService } from '../../../shared/configuration-tab-response-data/configuration-tab-response-data.service';
import { lastValueFrom } from 'rxjs';
import * as l10n from './start-migration-wizard.l10n';

const { ENGLISH: dictionary } = l10n;

@Component({
  selector: 'start-migration-wizard',
  templateUrl: './start-migration-wizard.component.html',
  styleUrls: ['./start-migration-wizard.component.less']
})
export class StartMigrationWizardComponent implements AfterViewInit {
  @ViewChild('wizard') wizard: ClrWizard;

  @ViewChild('pageTwo') pageTwo: ClrWizardPage;

  @Input()
  isEditLabControllerDetails: boolean = false;

  @Output()
  public onClose = new EventEmitter<void>();

  certsAndKeysForm: FormGroup;

  labControllerForm: FormGroup;

  isWizardOpen: boolean = true;

  finished: boolean = false;

  public dictionary = dictionary;

  public readonly verticalLayout = ClrFormLayout.VERTICAL;

  constructor(
    private formBuilder: FormBuilder,
    private readonly configurationTabService: ConfigurationTabService,
  ) {
    const groupMembers = {
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      ipAddress: ['', [Validators.required, Validators.pattern("(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)")]],
    };

    this.certsAndKeysForm = this.formBuilder.group(groupMembers);
    this.labControllerForm = this.formBuilder.group(groupMembers);
  }

  /** @override */
  public ngAfterViewInit(): void {
    if (this.isEditLabControllerDetails) {
      this.jumpTo(this.pageTwo);
      //setTimeout(() =>this.jumpTo(this.pageTwo), 0);
    }
  }

  public async onFinalizeLoad(): Promise<void> {
    try {
      const data$ = this.configurationTabService.startMigration({});
      await lastValueFrom(data$);

      this.finished = true;

      this.closeWizard();
    } catch (errors) {
      this.finished = true;
    }
  }

  public closeWizard(): void {
    if (this.finished) {
      this.wizard.finish();
      this.onClose.emit();
    }
  }

  public jumpTo(page: ClrWizardPage) {
    if (page) {
      this.wizard.navService.currentPage = page;
    } else {
      this.wizard.navService.setLastEnabledPageCurrent();
    }
    this.wizard.open();
  }
}
