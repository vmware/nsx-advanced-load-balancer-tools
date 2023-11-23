/**
 *  Common shared module containing shared components, pipes & services which can be used across
 *  different fearture modules in the application.
 */

import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MigrationMetricsComponent } from './components/migration-metrics/migration-metrics.component';

@NgModule({
  declarations: [
    MigrationMetricsComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    ClarityModule,
  ],
  exports: [
    MigrationMetricsComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
  ],
})
export class SharedModule { }
