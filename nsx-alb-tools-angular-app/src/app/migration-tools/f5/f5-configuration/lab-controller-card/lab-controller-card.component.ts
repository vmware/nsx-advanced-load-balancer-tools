import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { labController } from '../f5-configuration.types';
import { ClrFormLayout } from '@clr/angular';
import { ConfigurationService } from 'src/app/shared/configuration.service';
import { lastValueFrom } from 'rxjs';
import * as l10n from './lab-controller-card.l10n';
import { EMPTY_VALUE } from 'src/app/shared/constants';

const { ENGLISH: dictionary } = l10n;

const DEFAULT_LAB_CONTROLLER_DETAILS: labController = {
  avi_lab_user: '',
  avi_lab_password: '',
  avi_lab_ip: ''
}
@Component({
  selector: 'lab-controller-card',
  templateUrl: './lab-controller-card.component.html',
  styleUrls: ['./lab-controller-card.component.less']
})
export class LabControllerCardComponent implements OnInit {
  @Input()
  public isFetchInProgress = false;

  @Input()
  public hideActions = false;

  @Output()
  public onFetch = new EventEmitter<void>();

  @Output()
  public onError = new EventEmitter<void>();

  public labControllerDetails: labController = DEFAULT_LAB_CONTROLLER_DETAILS;

  public openEditModal = false;

  public isLabControllerDetailsValid = false;

  public emptyValue = EMPTY_VALUE;

  public readonly verticalLayout = ClrFormLayout.VERTICAL;

  public dictionary = dictionary;

  constructor(private readonly configurationService: ConfigurationService) { }

  /** @override */
  public async ngOnInit(): Promise<void> {
    try {
      await this.getLabControllerDetails();
      this.validateLabControllerDetails();
    } catch (err) {
      this.onError.emit();
    }
  }

  public async handleCloseEditModal(getDetails: boolean): Promise<void> {
    try {
      if (getDetails) {
        await this.getLabControllerDetails();
        this.validateLabControllerDetails();
      }

      this.openEditModal = false;
    } catch (err) {
      this.onError.emit();
    }
  }

  public async getLabControllerDetails(): Promise<void> {
    try {
      this.labControllerDetails = DEFAULT_LAB_CONTROLLER_DETAILS;
      const labControllerDetails$ = this.configurationService.getLabControllerDetails();
      const labControllerDetails = await lastValueFrom(labControllerDetails$);

      if (Object.keys(labControllerDetails).length) {
        this.labControllerDetails = labControllerDetails;
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  }

  public validateLabControllerDetails(): void {
    const { avi_lab_user, avi_lab_password, avi_lab_ip } = this.labControllerDetails;

    this.isLabControllerDetailsValid = Boolean(avi_lab_user && avi_lab_password && avi_lab_ip);
  }


  public handleEdit(): void {
    if (this.labControllerDetails) {
      this.openEditModal = true;
    }
  }

  public handleFetch(): void {
    this.onFetch.emit();
  }
}
