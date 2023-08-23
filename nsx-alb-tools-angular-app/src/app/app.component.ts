import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { finalize } from 'rxjs/operators';
import { dataToInsert } from './app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'NSX Advanced Load Balancer Tools';

  public responseMessage: any;

  private isLoading = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  public handleGetData() {
    this.showLoading();

    this.responseMessage = undefined;

    this.http.get('/migrationTools/getData').pipe(
      finalize(() => this.hideLoading())).subscribe({
      next: (data) => {
        // This callback will be triggered for both successful responses and 304 responses.
        console.log('Data received:', data);
        this.responseMessage = data;
      },
      error: (error) => {
        // This callback will not be triggered for a 304 response.
        console.error('Error:', error);
      }
    });
  }

  public handleClearData() {
    this.showLoading();

    this.responseMessage = undefined;

    this.http.delete('/migrationTools/clearData').pipe(
      finalize(() => this.hideLoading())).subscribe({
        next: (data:any) => {
          // This callback will be triggered for both successful responses and 304 responses.
          console.log('Cleared Data:', data);
          this.responseMessage = data['message'];
        },
        error: (error) => {
          // This callback will not be triggered for a 304 response.
          console.error('Error:', error);
        }
      });
  }

  public async handleStorerData() {
    this.showLoading();
    await this.handleClearData();

    this.responseMessage = undefined;

    this.http.post('/migrationTools/storeData', dataToInsert).pipe(
      finalize(() => this.hideLoading())).subscribe({
        next: (data: any) => {
          // This callback will be triggered for both successful responses and 304 responses.
          console.log('stored Data:', data);
          this.responseMessage = data.message;
        },
        error: (error) => {
          // This callback will not be triggered for a 304 response.
          console.error('Error:', error);
        }
      });
  }

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
