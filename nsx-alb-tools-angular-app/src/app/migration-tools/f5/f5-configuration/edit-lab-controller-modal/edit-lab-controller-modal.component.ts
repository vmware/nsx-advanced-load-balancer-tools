import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { labController } from '../f5-configuration.types';
import * as l10n from './edit-lab-controller-modal.l10n';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClrFormLayout } from '@clr/angular';
import { lastValueFrom } from 'rxjs';
import { ConfigurationService } from 'src/app/shared/configuration.service';

const { ENGLISH: dictionary } = l10n;

@Component({
  selector: 'edit-lab-controller-modal',
  templateUrl: './edit-lab-controller-modal.component.html',
  styleUrls: ['./edit-lab-controller-modal.component.less']
})
export class EditLabControllerModalComponent implements OnInit {
  @Input()
  public labControllerDetails: labController;

  @Output()
  public onClose = new EventEmitter<boolean>();

  public labControllerForm: FormGroup;

  public isOpen = true;

  public errorMessage: string = '';

  public dictionary = dictionary;

  public readonly verticalLayout = ClrFormLayout.VERTICAL;

  constructor(
    private formBuilder: FormBuilder,
    private readonly configurationService: ConfigurationService,
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
    this.setFormValue(this.labControllerDetails);
  }

  public setFormValue(config) {
    const { avi_lab_user: username, avi_lab_password: password, avi_lab_ip: ipAddress } = config;

    this.labControllerForm.setValue({
      username,
      password,
      ipAddress,
    });
  }

  public async closeModal(saveConfiguration: boolean): Promise<void> {
    try {
      if (saveConfiguration) {
        const { username: avi_lab_user, password: avi_lab_password, ipAddress: avi_lab_ip } = this.labControllerForm.value;
        const payload = {
          avi_lab_user,
          avi_lab_password,
          avi_lab_ip,
        }

        const labControllerDetails$ = this.configurationService.setLabControllerDetails(payload);
        await lastValueFrom(labControllerDetails$);
      }

      this.onClose.emit(saveConfiguration);
    } catch (error) {
      this.errorMessage = 'Error while saving data';
    }
  }
}
