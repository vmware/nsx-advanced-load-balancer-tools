import {
  Component,
  EventEmitter,
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
  public onEdit = new EventEmitter<void>();

  @Output()
  public onFetch = new EventEmitter<void>();

  public labControllerDetails: labController | undefined;

  public readonly verticalLayout = ClrFormLayout.VERTICAL;

  public dictionary = dictionary;

  constructor(private readonly configurationTabService: ConfigurationTabService) { }

  /** @override */
  public async ngOnInit(): Promise<void> {
    const labControllerDetails$ = this.configurationTabService.getLabControllerDetails();
    this.labControllerDetails = await lastValueFrom(labControllerDetails$);
  }

  public handleEdit(): void {
    this.onEdit.emit();
  }

  public handleFetch(): void {
    this.onFetch.emit();
  }
}
