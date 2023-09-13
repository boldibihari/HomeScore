import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../backend/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard {

  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  canActivate(state: RouterStateSnapshot) {
    if (this.authenticationService.isUserAuthenticated().isUserAuthenticated) {
      return true;
    } 
    else {
      this.router.navigate(['/login'], {queryParams: { returnUrl: state.url }});
      return false;
    }
  } 
}
