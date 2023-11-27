import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs/internal/Observable';

import {
  IRuleMigration,
  IRuleMigrationOverview,
  labController,
} from 'src/app/migration-tools/f5/f5-irule/f5-irule.types';

@Injectable({
  providedIn: 'root',
})
export class IRuleDataService {
  public showCompletedMigrationsCountAlert = false;

  constructor(
    private http: HttpService,
  ) { }

  public getSkippedIRules(): Observable<IRuleMigration[]> {
    return this.http.get('irule/getSkippedIRules');
  }

  public getIRuleMigrationOverview(): Observable<IRuleMigrationOverview> {
    return this.http.get('irule/getIRulesOverview');
  }

}
