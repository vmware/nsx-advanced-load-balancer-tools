import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ClrFormLayout } from '@clr/angular';
import * as l10n from './f5-migration.l10n';
import { HttpService } from 'src/app/shared/http/http.service';
import { ClrWizard } from "@clr/angular";


const { ENGLISH: dictionary, ...l10nKeys } = l10n;

@Component({
  selector: 'f5-migration',
  templateUrl: './f5-migration.html',
})
export class F5MigrationComponent implements OnInit {

    dictionary = dictionary;

    open = false;

    migrationCountData: any;

    constructor(
        private http: HttpService,
    ) {}

    ngOnInit(): void {
      this.http.get('f5migrationcount').subscribe((data)=> {
        this.migrationCountData = data;
      });
    }

    onClick(): void {
      this.open = true;
    }

    onCancel(event: any): void {
      this.open = false;
    }

}
