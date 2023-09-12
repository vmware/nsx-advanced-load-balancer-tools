

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from "@clr/angular";

import './shared/clarity-icons';
import { LandingPageComponent } from './migration-tools/landing-page/landing-page.component';
import { HttpService } from './shared/http/http.service';
import { StartWizardComponent } from './migration-tools/f5/start-wizard/start-wizard.component';
import { F5MigrationComponent } from './migration-tools/f5/f5-migration/f5-migration.component';
import { F5ReportComponent } from './migration-tools/f5/f5-report/f5-report.component';
import { F5ConfigurationComponent } from './migration-tools/f5/f5-configuration/f5-configuration.component';
import { F5ReadyComponent } from './migration-tools/f5/f5-ready/f5-ready.component';
import { F5CompletedComponent } from './migration-tools/f5/f5-completed/f5-completed.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    F5ConfigurationComponent,
    F5MigrationComponent,
    F5CompletedComponent,
    F5ReadyComponent,
    F5ReportComponent,
    StartWizardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ClarityModule,
    ReactiveFormsModule,
  ],
  providers: [
    HttpService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
