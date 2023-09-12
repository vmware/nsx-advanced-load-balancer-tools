import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import * as l10n from './app.l10n';

const { ENGLISH: dictionary, ...l10nKeys } = l10n;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  title = 'NSX Advanced Load Balancer Tools';

  dictionary = dictionary;

  public responseMessage: any;

  private isLoading = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  public showLoading() {
    this.isLoading.next(true);
  }

  public get loading$() {
    return this.isLoading.asObservable();
  }

  public hideLoading() {
    this.isLoading.next(false);
  }
}
