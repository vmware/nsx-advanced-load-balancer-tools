import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'NSX Advanced Load Balancer Tools';

  public responseMessage: string = '';

  constructor(private http: HttpClient) { }

  public handleClick() {
    this.http.get('/button-click').subscribe(
      (data) => {
        // This callback will be triggered for both successful responses and 304 responses.
        console.log('Data received:', data);
        this.responseMessage = data as string;
      },
      (error) => {
        // This callback will not be triggered for a 304 response.
        console.error('Error:', error);
      }
    );
  }
}
