import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs/internal/Observable';
import { incompleteVsMigration, labController } from 'src/app/migration-tools/f5/f5-configuration/f5-configuration.types';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationTabService {
  constructor(
    private http: HttpService,
  ) {}

  public getAllIncompleteVSMigrationsData(): Observable<incompleteVsMigration[]> {
    return this.http.get('migration/getConfiguration');
  }

  public getLabControllerDetails(): Observable<labController> {
    return this.http.get('configTab/getLabControllerDetails');
  }

  public updateMigrationData(data: incompleteVsMigration): Observable<incompleteVsMigration> {
    return this.http.post('configTab/updateMigrationData', data);
  }

  public startMigration(data: any): Observable<any> {
    return this.http.post('configTab/startMigration', data);
  }
}

