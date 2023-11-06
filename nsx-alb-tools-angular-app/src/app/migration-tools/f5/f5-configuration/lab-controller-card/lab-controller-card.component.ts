import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { labController } from '../f5-configuration.types';
import { ClrFormLayout } from '@clr/angular';
import { ConfigurationTabService } from 'src/app/shared/configuration-tab-response-data/configuration-tab-response-data.service';
import { lastValueFrom } from 'rxjs';
import * as l10n from './lab-controller-card.l10n';

const { ENGLISH: dictionary } = l10n;

@Component({
  selector: 'lab-controller-card',
  templateUrl: './lab-controller-card.component.html',
  styleUrls: ['./lab-controller-card.component.less']
})
export class LabControllerCardComponent implements OnInit {
  @Output()
  public onFetch = new EventEmitter<void>();

  public labControllerDetails: labController = {
    avi_lab_user: '',
    avi_lab_password: '',
    avi_lab_ip: ''
  };

  public openEditModal = false;

  public readonly verticalLayout = ClrFormLayout.VERTICAL;

  public dictionary = dictionary;

  constructor(private readonly configurationTabService: ConfigurationTabService) { }

  /** @override */
  public async ngOnInit(): Promise<void> {
    const labControllerDetails$ = this.configurationTabService.getLabControllerDetails();
    this.labControllerDetails = await lastValueFrom(labControllerDetails$);
  }

  public async handleCloseEditModal(getDetails: boolean): Promise<void> {
    if (getDetails) {
      const labControllerDetails$ = this.configurationTabService.getLabControllerDetails();
      this.labControllerDetails = await lastValueFrom(labControllerDetails$);
    }

    this.openEditModal = false;
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
