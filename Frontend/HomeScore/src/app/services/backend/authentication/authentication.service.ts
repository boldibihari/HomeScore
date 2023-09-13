import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Subject, Observable } from "rxjs";
import { ForgotPassword } from "src/app/models/authentication/forgot-password/forgot-password";
import { Login } from "src/app/models/authentication/login/login";
import { LoginResponse } from "src/app/models/authentication/login/login-response";
import { Registration } from "src/app/models/authentication/registration/registration";
import { RegistrationResponse } from "src/app/models/authentication/registration/registration-response";
import { ResetPassword } from "src/app/models/authentication/reset-password/reset-password";
import { Encoder } from "../../encoders/encoder";
import { getBackendUrl } from "../backend-url.def";
import { User } from "src/app/models/authentication/user/user";
import { AuthenticationResponse } from "src/app/models/authentication/authentication-response/authentication-response";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private url: string = getBackendUrl() + 'Authentication/';
  private authChangeSub = new Subject<AuthenticationResponse>();
  public authChanged = this.authChangeSub.asObservable();
  public loginResponse!: LoginResponse;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  public sendAuthStateChangeNotification(authenticationResponse: AuthenticationResponse) {
    this.authChangeSub.next(authenticationResponse);
  }

  public isUserAuthenticated(): AuthenticationResponse {
    const admin = this.isUserAdmin();
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const userName = localStorage.getItem('userName');
    if(token !== null && id !== null && userName !== null && !this.jwtHelper.isTokenExpired(token)) {
      return new AuthenticationResponse(true, admin, id, userName);
    }
    else {
      return new AuthenticationResponse(false, false, '', '');
    }
  }

  public isUserAdmin(): boolean {
    const token = localStorage.getItem('token');
    console.log('TOKEN:');
    console.log(token);
    if (token !== null && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return role.includes('Admin');
    }
    else {
      return false;
    }
  }

  public login(login: Login): Observable<LoginResponse> {
    const result = this.http.post<LoginResponse>(this.url, login);
    result.subscribe(x => {
      this.loginResponse = x;
      localStorage.setItem('id', this.loginResponse.userId);
      localStorage.setItem('userName', this.loginResponse.userName);
      localStorage.setItem('token', this.loginResponse.token);
      localStorage.setItem('expiration', this.loginResponse.expiration.toString());
    });
    return result;
  }

  public logout(): void {
    localStorage.removeItem('id');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    sessionStorage.removeItem('automatedHighlighting');
    this.sendAuthStateChangeNotification(new AuthenticationResponse(false, false, '', ''));
  }

  public registration(registration: Registration): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(this.url + 'Registration', registration);
  }

  public emailConfirmation(email: string, token: string): Observable<any> {
    let params = new HttpParams({ encoder: new Encoder() })
    params = params.append('email', email);
    params = params.append('token', token);
    return this.http.get<any>(this.url + 'EmailConfirmation', { params: params });
  }

  public forgotPassword(forgotPassword: ForgotPassword): Observable<any> {
    return this.http.post<any>(this.url + 'ForgotPassword', forgotPassword);
  }

  public resetPassword(resetPassword: ResetPassword): Observable<any> {
    return this.http.post<any>(this.url + 'ResetPassword', resetPassword);
  }

  public deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(this.url + id);
  }

  public updateUser(registration: Registration): Observable<any> {
    return this.http.put<any>(this.url, registration);
  }

  public getOneUser(id: string): Observable<User> {
    return this.http.get<User>(this.url + id);
  }

  public getAllUser(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  public getToken(): string|null {
    return localStorage.getItem('token');
  }
}
