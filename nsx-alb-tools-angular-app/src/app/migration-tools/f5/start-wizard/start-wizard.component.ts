import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ClrFormLayout } from '@clr/angular';
import * as l10n from './start-wizrd.l10n';
import { HttpService } from 'src/app/shared/http/http.service';
import {ActivatedRoute, Router} from "@angular/router"
import { ClrWizard } from "@clr/angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";

const { ENGLISH: dictionary, ...l10nKeys } = l10n;

@Component({
  selector: 'start-wizard',
  templateUrl: './start-wizard.html',
  styleUrls: ['./start-wizard.less'],
})
export class StartWizardComponent implements OnInit {
    @Input()
    open = false;

    @Output()
    onCancel = new EventEmitter<boolean>();

    @ViewChild("wizard") wizard: ClrWizard;

    f5LoginError: string;

    loadingFlag: boolean;

    dictionary = dictionary;
    form: FormGroup;

    constructor(
        private http: HttpService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.form = new FormGroup({
            ipAddr: new FormControl('', [Validators.required,
                Validators.pattern('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')]),
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        });
    }

    ngOnInit(): void {}

    pageCustomNext(): void {
        this.loadingFlag = true;
        this.http.post('f5login', this.form.value).subscribe((data)=> {
            this.loadingFlag = false;
            this.wizard.forceNext();
            setTimeout(()=> {
                this.router.navigate(['f5-migration'])
            }, 4000)
        }, (error) => {
            this.loadingFlag = false;
            this.f5LoginError = error.error.message;
        });
    }

    doCancel() {
        this.onCancel.emit(false);
    }

}
