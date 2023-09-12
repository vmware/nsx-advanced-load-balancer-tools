import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ClrFormLayout } from '@clr/angular';
import * as l10n from './landing-page.l10n';
import { HttpService } from 'src/app/shared/http/http.service';
import { ClrWizard } from "@clr/angular";


const { ENGLISH: dictionary, ...l10nKeys } = l10n;

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.html',
})
export class LandingPageComponent implements OnInit {

    dictionary = dictionary;

    open = false;

    constructor(
        private http: HttpService,
    ) {}

    ngOnInit(): void {
    }

    onClick(): void {
      this.open = true;
    }

    onCancel(event: any): void {
      this.open = false;
    }

}
