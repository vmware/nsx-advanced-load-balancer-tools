import { Injectable } from '@angular/core';
import { HttpService } from './http/http.service';
import { Observable } from 'rxjs/internal/Observable';

import {
  incompleteVsMigration,
  incompleteVsMigrationsData,
  labController,
} from 'src/app/migration-tools/f5/f5-configuration/f5-configuration.types';

@Injectable({providedIn: 'root'})
export class ConfigurationService {
  public showCompletedMigrationsCountAlert = false;

  constructor(
    private http: HttpService,
  ) { }

  public getAllIncompleteVSMigrationsData(): Observable<incompleteVsMigrationsData> {
    return this.http.get('configuration/getConfiguration');
  }

  public getLabControllerDetails(): Observable<labController> {
    return this.http.get('core/getAviLabDetails');
  }

  public acceptConfiguration(data: any): Observable<void> {
    return this.http.post(`configuration/acceptConfiguration?type=${data.type}`, data.config);
  }

  public updateMigrationData(data: incompleteVsMigration): Observable<incompleteVsMigration> {
    return this.http.post('configuration/updateMigrationData', data);
  }

  public startMigration(data: any): Observable<any> {
    return this.http.post('configuration/startMigration', data);
  }

  public fetchFromController(): Observable<incompleteVsMigrationsData> {
    return this.http.get('configuration/fetchConfiguration');
  }

  public setLabControllerDetails(data: labController): Observable<labController> {
    return this.http.post('core/saveAviLabDetails', data);
  }

  public getMigrationOverviewData(): Observable<any> {
    return this.http.get('configuration/getMigrationOverview');
  }
}

