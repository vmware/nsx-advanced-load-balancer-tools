import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ClrFormLayout } from '@clr/angular';
import * as l10n from './f5-configuration.l10n';
import { HttpService } from 'src/app/shared/http/http.service';
import { ClrWizard } from "@clr/angular";


const { ENGLISH: dictionary, ...l10nKeys } = l10n;

@Component({
  selector: 'f5-configuration',
  templateUrl: './f5-configuration.html',
})
export class F5ConfigurationComponent implements OnInit {

    dictionary = dictionary;

    constructor(
        private http: HttpService,
    ) {}

    ngOnInit(): void {
    }

}
