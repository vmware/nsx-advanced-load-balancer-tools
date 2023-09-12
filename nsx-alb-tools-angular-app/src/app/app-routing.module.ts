import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './migration-tools/landing-page/landing-page.component';
import { F5MigrationComponent } from './migration-tools/f5/f5-migration/f5-migration.component';
import { F5ReportComponent } from './migration-tools/f5/f5-report/f5-report.component';
import { F5ConfigurationComponent } from './migration-tools/f5/f5-configuration/f5-configuration.component';
import { F5ReadyComponent } from './migration-tools/f5/f5-ready/f5-ready.component';
import { F5CompletedComponent } from './migration-tools/f5/f5-completed/f5-completed.component';

const routes: Routes = [
  { path: '', redirectTo: '/migration-tools', pathMatch: 'full' },
  { path: 'migration-tools', component: LandingPageComponent },
  {
    path:'f5-migration',
    component: F5MigrationComponent,
    children: [
      {
        path:'',
        redirectTo: 'report',
        pathMatch: 'full' 
      },
      {
        path: 'report',
        component: F5ReportComponent,
      },
      {
        path: 'configuration',
        component: F5ConfigurationComponent,
      },
      {
        path: 'ready',
        component: F5ReadyComponent,
      },
      {
        path: 'completed',
        component: F5CompletedComponent,
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
