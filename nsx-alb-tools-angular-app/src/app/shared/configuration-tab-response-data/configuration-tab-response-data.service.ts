import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs/internal/Observable';
import { incompleteVsMigration } from 'src/app/migration-tools/f5/f5-configuration/f5-configuration.types';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationTabService {
  constructor(
    private http: HttpService,
  ) {}

  public getAllIncompleteVSMigrationData(): Observable<incompleteVsMigration[]> {
    return this.http.get('configTab/getAllIncompleteVSMigrationData');

  }
}

