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
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { ConfigurationService } from '../../../shared/configuration.service';
import { lastValueFrom } from 'rxjs';
import * as l10n from './start-migration-wizard.l10n';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/shared/http/http.service';

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

  destinationCtrlForm: FormGroup;
  mapDestinationForm: FormGroup;
  loadingFlag: boolean;
  f5LoginError = '';
  f5DestinationData: any;

  constructor(
    private formBuilder: FormBuilder,
    private readonly configurationService: ConfigurationService,
    private router: Router,
    private http: HttpService,
  ) {
    const groupMembers = {
      f5_ssh_user: ['', [Validators.required]],
      f5_ssh_password: ['', [Validators.required]],
      f5_host_ip: ['', [Validators.required, Validators.pattern("(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)")]],
    };

    this.certsAndKeysForm = this.formBuilder.group(groupMembers);
    this.labControllerForm = this.formBuilder.group({
      avi_lab_user: ['', [Validators.required]],
      avi_lab_password: ['', [Validators.required]],
      avi_lab_ip: ['', [Validators.required, Validators.pattern("(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)")]],
    });

    this.destinationCtrlForm = new FormGroup({
      avi_destination_ip: new FormControl('', [Validators.required,
          Validators.pattern('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')]),
      avi_destination_user: new FormControl('', Validators.required),
      avi_destination_password: new FormControl('', Validators.required),
    });
    this.mapDestinationForm = new FormGroup({
      avi_mapped_tenant: new FormControl('', Validators.required),
      avi_mapped_cloud: new FormControl('', Validators.required),
      avi_mapped_vrf: new FormControl('', Validators.required),
      avi_mapped_segroup: new FormControl('', Validators.required),
    });

  }

  ngOnInit(): void {
  }

  public async onFinalizeLoad(): Promise<void> {
    try {
      const data$ = this.configurationService.startMigration({});
      await lastValueFrom(data$);

      this.finished = true;
      this.configurationService.showCompletedMigrationsCountAlert = true;

      this.closeWizard();
      this.router.navigate(['f5-migration', 'configuration'])
    } catch (error) {
      this.errorMessage = dictionary.generalErrorMessage;
      this.finished = true;
    }
  }

  pageCustomNext(): void {
    this.loadingFlag = true;
    const payload = this.destinationCtrlForm.value;
    payload.avi_destination_version = '1';
    this.http.post('core/getAviDestinationMappings', payload).subscribe((data)=> {
        this.loadingFlag = false;

        this.f5DestinationData = data;
        // this.mapDestinationForm.patchValue({
          // tenant: this.f5DestinationData?.tenants[0]?.tenant,
          // cloud: this.f5DestinationData.cloud[0],
          // vrf: this.f5DestinationData.vrf[0],
          // seGroup: this.f5DestinationData.seGroup[0],
        // });
        this.wizard.forceNext();

    }, (error) => {
        this.loadingFlag = false;
        this.f5LoginError = error.error.message;
    });
  }

  get currentTenant() {
    return this.f5DestinationData?.tenants?.filter((data)=> {
      return data.tenant === this.mapDestinationForm.value.avi_mapped_tenant
    })[0];
  }

  get currentCloud() {
    return this.currentTenant?.clouds?.filter((data)=> {
      return data.cloud_name === this.mapDestinationForm.value.avi_mapped_cloud
    })[0];
  }

  public closeWizard(): void {
    if (this.finished) {
      this.wizard.finish();
      this.onClose.emit();
      this.isWizardOpen = false;
    }
  }

  submit() {
    this.errorMessage = '';
    this.wizard.forceNext();
    const payload = {...this.destinationCtrlForm.value, ...this.certsAndKeysForm.value, ...this.labControllerForm.value, ...this.mapDestinationForm.value, avi_destination_version: '30.2.1' }
    this.http.post('configuration/generateConfiguration', payload).subscribe((data)=> {
      this.closeWizard();
      this.router.navigate(['f5-migration', 'configuration'])
      this.loadingFlag = false;
    }, (error) => {
        this.errorMessage = error?.error?.message || dictionary.startMigrationErrorMessage;
        this.loadingFlag = false;
    });
  }

}