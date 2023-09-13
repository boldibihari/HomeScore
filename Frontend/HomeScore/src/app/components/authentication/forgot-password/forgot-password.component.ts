import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { ForgotPassword } from 'src/app/models/authentication/forgot-password/forgot-password';
import { AuthenticationService } from 'src/app/services/backend/authentication/authentication.service';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  public isLoading: boolean = false;
  public forgotPasswordForm!: UntypedFormGroup;
  public message: Message[] = [];
  public showSuccess!: boolean;
  public showError!: boolean;

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.forgotPasswordForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.email
      ])
    });
  }

  public validateControl(controlName: string) {
    return (
      this.forgotPasswordForm.get(controlName)?.invalid &&
      this.forgotPasswordForm.get(controlName)?.touched
    );
  }

  public hasError(controlName: string, errorName: string) {
    return this.forgotPasswordForm.get(controlName)?.hasError(errorName);
  }

  public forgotPassword(forgotPasswordFormValue: any): void {
    this.isLoading = true;
    this.showError = this.showSuccess = false;

    const formValues = { ...forgotPasswordFormValue };
    const forgotPassword: ForgotPassword = {
      email: formValues.email,
      clientURI: 'http://localhost:4200/resetpassword'
    };

    this.authenticationService.forgotPassword(forgotPassword).subscribe({
      next: (_) => {
        this.isLoading = false;
        this.showSuccess = true;
        this.message = [
          {
            severity: 'success',
            summary: 'Success',
            detail:
              'The link has been sent, please check your email to reset your password.'
          }
        ];
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.showError = true;
        this.message = [
          { severity: 'error', summary: 'Error', detail: error.message }
        ];
      }
    });
  }
}
