import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ClrFormLayout } from '@clr/angular';
import * as l10n from './start-wizrd.l10n';
import { HttpService } from 'src/app/shared/http/http.service';
import { ActivatedRoute, Router } from "@angular/router"
import { ClrWizard } from "@clr/angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";

const { ENGLISH: dictionary, ...l10nKeys } = l10n;

@Component({
    selector: 'start-wizard',
    templateUrl: './start-wizard.html',
    styleUrls: ['./start-wizard.less'],
})
export class StartWizardComponent {
    @Input()
    open = false;

    @Output()
    onClose = new EventEmitter<boolean>();

    @ViewChild("wizard") wizard: ClrWizard;

    public errMessage: string = '';

    public isGeneratingReport: boolean = false;

    dictionary = dictionary;

    form: FormGroup;

    constructor(
        private http: HttpService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.form = new FormGroup({
            f5_host_ip: new FormControl('', [Validators.required,
            Validators.pattern('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')]),
            f5_ssh_user: new FormControl('', Validators.required),
            f5_ssh_password: new FormControl('', Validators.required),
        });
    }

    public onGenerateReport(): void {
        this.isGeneratingReport = true;
        this.errMessage = '';

        this.http.post(
            'discovery/generateReport',
            this.form.value,
        ).subscribe({
            next: () => {
                this.isGeneratingReport = false;

                this.wizard.finish();
                this.onClose.emit();
                this.router.navigate(['f5-migration'])
            },
            error: (error) => {
                this.isGeneratingReport = false;
                this.errMessage = error.error.message;
            },
        });
    }
}
