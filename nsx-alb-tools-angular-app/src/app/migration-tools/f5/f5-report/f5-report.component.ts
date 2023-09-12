import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ClrFormLayout } from '@clr/angular';
import * as l10n from './f5-report.l10n';
import { HttpService } from 'src/app/shared/http/http.service';
import { ClrWizard } from "@clr/angular";


const { ENGLISH: dictionary, ...l10nKeys } = l10n;

@Component({
  selector: 'f5-report',
  templateUrl: './f5-report.html',
})
export class F5ReportComponent implements OnInit {

    dictionary = dictionary;

    constructor(
        private http: HttpService,
    ) {}

    ngOnInit(): void {
      
    }

}
