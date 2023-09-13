import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { AuthenticationResponse } from 'src/app/models/authentication/authentication-response/authentication-response';
import { Login } from 'src/app/models/authentication/login/login';
import { LoginResponse } from 'src/app/models/authentication/login/login-response';
import { AuthenticationService } from 'src/app/services/backend/authentication/authentication.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public isLoading: boolean = false;
  public loginForm!: UntypedFormGroup;
  public errorMessage: Message[] = [];
  public showError!: boolean;
  public hide: boolean = true;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new UntypedFormControl('', [Validators.required])
    });
  }

  public validateControl(controlName: string) {
    return (
      this.loginForm.get(controlName)?.invalid &&
      this.loginForm.get(controlName)?.touched
    );
  }

  public hasError(controlName: string, errorName: string) {
    return this.loginForm.get(controlName)?.hasError(errorName);
  }

  public loginUser(loginFormValue: any): void {
    this.isLoading = true;
    this.showError = false;

    const formValues = { ...loginFormValue };
    const userForLogin: Login = {
      email: formValues.email,
      password: formValues.password
    };

    this.authenticationService.login(userForLogin).subscribe({
      next: (res: LoginResponse) => {
        this.isLoading = false;
        const admin = this.authenticationService.isUserAdmin();
        this.authenticationService.sendAuthStateChangeNotification(
          new AuthenticationResponse(true, admin, res.userId, res.userName)
        );
        this.router.navigate(['']);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = [
          { severity: 'error', summary: 'Error', detail: error.message }
        ];
        this.showError = true;
      }
    });
  }
}
