import { Component } from '@angular/core';
import { AuthenticationService } from './services/backend/authentication/authentication.service';
import { AuthenticationResponse } from './models/authentication/authentication-response/authentication-response';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'HomeScore';
 
  constructor(private authenticationService: AuthenticationService){}

  ngOnInit(): void {
    const isUserAuthenticated = this.authenticationService.isUserAuthenticated();

    if(isUserAuthenticated.isUserAuthenticated) {
      this.authenticationService.sendAuthStateChangeNotification(new AuthenticationResponse(isUserAuthenticated.isUserAuthenticated, isUserAuthenticated.isUserAdmin, isUserAuthenticated.userId, isUserAuthenticated.userName));
    }
  }
}
