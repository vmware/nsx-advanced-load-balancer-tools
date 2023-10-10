import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { vsFlaggedObject } from '../f5-configuration.types';
import * as l10n from './edit-lab-controller-modal.l10n';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClrFormLayout } from '@clr/angular';
import { lastValueFrom } from 'rxjs';
import { ConfigurationTabService } from 'src/app/shared/configuration-tab-response-data/configuration-tab-response-data.service';

const { ENGLISH: dictionary } = l10n;

@Component({
  selector: 'edit-lab-controller-modal',
  templateUrl: './edit-lab-controller-modal.component.html',
  styleUrls: ['./edit-lab-controller-modal.component.less']
})
export class EditLabControllerModalComponent implements OnInit {
  @Input()
  public config: vsFlaggedObject | undefined;

  @Output()
  public onClose = new EventEmitter<boolean>();

  public labControllerForm: FormGroup;

  public isOpen = true;

  public errorMessage: string = '';

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

    this.labControllerForm = this.formBuilder.group(groupMembers);
  }

  /** @override */
  public async ngOnInit(): Promise<void> {
    try {
      const labControllerDetails$ = this.configurationTabService.getLabControllerDetails();
      const labControllerDetails = await lastValueFrom(labControllerDetails$);

      this.labControllerForm.setValue(labControllerDetails);
    } catch (error) {
      this.errorMessage = dictionary.generalErrorMessage;
    }
  }

  public async closeModal(saveConfiguration: boolean): Promise<void> {
    try {
      if (saveConfiguration) {
        const labControllerDetails$ = this.configurationTabService.setLabControllerDetails(this.labControllerForm.value);
        await lastValueFrom(labControllerDetails$);
      }

      this.onClose.emit(saveConfiguration);
      this.isOpen = false;
    } catch (error) {
      this.errorMessage = 'Try closing this alert';
    }
  }
}
