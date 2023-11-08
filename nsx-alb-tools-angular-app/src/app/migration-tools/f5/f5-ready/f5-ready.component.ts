import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ClrFormLayout } from '@clr/angular';
import * as l10n from './f5-ready.l10n';
import * as FileSaver from 'file-saver';
import { HttpService } from 'src/app/shared/http/http.service';
import { ClrWizard } from "@clr/angular";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


const { ENGLISH: dictionary, ...l10nKeys } = l10n;

@Component({
  selector: 'f5-ready',
  templateUrl: './f5-ready.html',
  styleUrls: ['./f5-ready.less'],
})
export class F5ReadyComponent implements OnInit {

  dictionary = dictionary;
  f5LoginError = '';
  @ViewChild("wizard") wizard: ClrWizard;

  loadingFlag: boolean;
  data;
  vsStatusGridData;
  playbooksGridData;
  destinationCtrlForm: FormGroup;
  mapDestinationForm: FormGroup;
  playbookForm: FormGroup;

  f5DestinationData: any;
  selected;

  showToaster = false;
  toasterMessage: string;

  open = false;
  playbookModalOpened = false;
  openMappingEditModal = false;
  openDestinationEditModal = false;

  constructor(
      private http: HttpService,
      private router: Router,
  ) {
    this.destinationCtrlForm = new FormGroup({
      ipAddr: new FormControl('', [Validators.required,
          Validators.pattern('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')]),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
    this.mapDestinationForm = new FormGroup({
      tenant: new FormControl('', Validators.required),
      cloud: new FormControl('', Validators.required),
      vrf: new FormControl('', Validators.required),
      seGroup: new FormControl('', Validators.required),
    });
    this.playbookForm = new FormGroup({
      playbookName: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.open = true;
    this.http.get('f5ready').subscribe((data)=> {
      this.data = data;
    });
    this.http.get('f5destination').subscribe((data)=> {
      this.f5DestinationData = data;
      this.mapDestinationForm.patchValue({
        tenant: this.f5DestinationData.tenant[0],
        cloud: this.f5DestinationData.cloud[0],
        vrf: this.f5DestinationData.vrf[0],
        seGroup: this.f5DestinationData.seGroup[0],
      });
    });

    // Fetch the list of ready Virtuals.
    this.http.get('configuration/getReadyVirtuals').subscribe((data) => {
      const readyVirtuals = data.result.ready;

      this.vsStatusGridData = readyVirtuals.map((virtualItem) => {
        return {
          ...virtualItem,
          // 'name': virtualItem.F5_ID,
          'status': virtualItem.isReviewed ? 'Reviewed' : 'Auto Converted',
        };
      });
    });

    this.fetchPlaybooks();
  }

  // Fetch the list of Playbooks.
  fetchPlaybooks(): void {
    this.http.get('playbook/getPlaybooks' ).subscribe((data) => {
      const playbooks = data.result;

      this.playbooksGridData = playbooks.map((playbookItem) => {
        return {
          ...playbookItem,
          'status': 'Ready',
        };
      });
    });
  }

  doCancel(): void {
    this.open = false;
  }

  doFinish(): void {
    this.wizard.close();
  }

  editMappingDetails(): void {
    this.setCurrentModalValues();
    this.openMappingEditModal = true;
  }

  saveMappingDetails(): void {
    this.openMappingEditModal = false;
  }

  editDestinationControllerDetails(): void {
    this.setCurrentModalValues();
    this.openDestinationEditModal = true;
  }

  saveDestinationControllerDetails(): void {
    this.openDestinationEditModal = false;
  }

  setCurrentModalValues(): void {
    this.mapDestinationForm.patchValue({
      tenant: this.data?.mapping?.tenant,
      cloud: this.data?.mapping?.cloud,
      vrf: this.data?.mapping?.vrf,
      seGroup: this.data?.mapping?.seGroup,
    });
    this.destinationCtrlForm.patchValue({
      ipAddr: this.data?.destinationController?.ipAddr,
      username: this.data?.destinationController?.username,
      password: this.data?.destinationController?.password,
    });
  }

  // markComplete(playbook): void {
  //   this.http.post('f5pbmarkcomplete', this.playbookForm.value).subscribe((data)=> {
  //     console.log('completed');
  //     this.showToaster = true;
  //     this.toasterMessage = dictionary.readyPagePlaybookMarkedSuccessMessage;
  //   }, (error) => {
  //       console.log('error');
  //   });
  // }

  generatePlaybook(): void {
    this.http.post('playbook/generatePlaybook', this.playbookForm.value).subscribe((data)=> {
        this.playbookModalOpened = false;
        this.showToaster = true;
        this.toasterMessage = dictionary.readyPagePlaybookGeneratedSuccessMessage;

        // Update the list of Playbooks.
        this.fetchPlaybooks();
      }, (error) => {
          console.log('error');
          this.playbookModalOpened = false;
      });
  }

  public downloadPlaybook(): void {
    const fileName = "avi_config.yml";

    this.http.get(
      `playbook/downloadPlaybook?fileName=${fileName}`,
      { responseType: "blob" },
    ).subscribe((data: Blob) => {
      FileSaver.saveAs(data, fileName);
    });
  }

  generateSinglePlaybook(vs): void {
    this.selected = vs;
    this.playbookModalOpened = true;
  }

  pageCustomNext(): void {
    this.loadingFlag = true;
    this.http.post('f5login', this.destinationCtrlForm.value).subscribe((data)=> {
        setTimeout(()=> {
            this.loadingFlag = false;
            this.wizard.forceNext();
        }, 1000)
    }, (error) => {
        this.loadingFlag = false;
        this.f5LoginError = error.error.message;
    });
  }

}
