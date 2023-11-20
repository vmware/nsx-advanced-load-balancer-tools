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

@Component({
  selector: 'lab-controller-card',
  templateUrl: './lab-controller-card.component.html',
  styleUrls: ['./lab-controller-card.component.less']
})
export class LabControllerCardComponent implements OnInit {
  @Input()
  public isFetchInProgress = false;

  @Output()
  public onFetch = new EventEmitter<void>();

  public labControllerDetails: labController = {
    avi_lab_user: '',
    avi_lab_password: '',
    avi_lab_ip: ''
  };

  public openEditModal = false;

  public isLabControllerDetailsValid = false;

  public emptyValue = EMPTY_VALUE;

  public readonly verticalLayout = ClrFormLayout.VERTICAL;

  public dictionary = dictionary;

  constructor(private readonly configurationService: ConfigurationService) { }

  /** @override */
  public async ngOnInit(): Promise<void> {
    await this.fetchLabControllerDetails();
    this.validateLabControllerDetails();
  }

  public async handleCloseEditModal(getDetails: boolean): Promise<void> {
    if (getDetails) {
      await this.fetchLabControllerDetails();
      this.validateLabControllerDetails();
    }

    this.openEditModal = false;
  }

  public async fetchLabControllerDetails(): Promise<void> {
    const labControllerDetails$ = this.configurationService.getLabControllerDetails();

    this.labControllerDetails = await lastValueFrom(labControllerDetails$);
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
