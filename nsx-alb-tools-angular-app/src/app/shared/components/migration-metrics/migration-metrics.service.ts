import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

import {
  IRuleMigration,
  IRuleMigrationOverview,
  labController,
} from 'src/app/migration-tools/f5/f5-irule/f5-irule.types';

@Injectable({
  providedIn: 'root',
})

export class MigrationMetricsService {
  public refreshSubject: Subject<void> = new Subject<void>();
}
