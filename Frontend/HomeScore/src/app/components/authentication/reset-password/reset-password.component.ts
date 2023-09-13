import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/api';
import { ResetPassword } from 'src/app/models/authentication/reset-password/reset-password';
import { AuthenticationService } from 'src/app/services/backend/authentication/authentication.service';
import { PasswordValidator } from 'src/app/services/validators/password-validator.service';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  public isLoading: boolean = false;
  public resetPasswordForm!: UntypedFormGroup;
  public showSuccess!: boolean;
  public messages: Message[] = [];
  public showError!: boolean;
  private token!: string;
  private email!: string;

  constructor(
    private authenticationService: AuthenticationService,
    private passwordValidator: PasswordValidator,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = new UntypedFormGroup({
      password: new UntypedFormControl('', [Validators.required]),
      confirmPassword: new UntypedFormControl('')
    });

    this.resetPasswordForm
      .get('confirmPassword')
      ?.setValidators([
        Validators.required,
        this.passwordValidator.validateConfirmPassword(
          this.resetPasswordForm.get('password') as UntypedFormArray
        )
      ]);

    this.token = this.route.snapshot.queryParams['token'];
    this.email = this.route.snapshot.queryParams['email'];
  }

  public validateControl(controlName: string) {
    return (
      this.resetPasswordForm.get(controlName)?.invalid &&
      this.resetPasswordForm.get(controlName)?.touched
    );
  }

  public hasError(controlName: string, errorName: string) {
    return this.resetPasswordForm.get(controlName)?.hasError(errorName);
  }

  public resetPassword(resetPasswordFormValue: any) {
    this.isLoading = true;
    this.showError = this.showSuccess = false;

    const formValues = { ...resetPasswordFormValue };
    const resetPassword: ResetPassword = {
      password: formValues.password,
      confirmPassword: formValues.confirmPassword,
      token: this.token,
      email: this.email
    };

    this.authenticationService.resetPassword(resetPassword).subscribe({
      next: (_) => {
        this.isLoading = false;
        this.messages.push({
          severity: 'success',
          summary: 'Success',
          detail: 'Your password has been reset.'
        });
        this.showSuccess = true;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        let messages = error.message.split('&');
        messages.forEach((error) => {
          this.messages.push({
            severity: 'error',
            summary: 'Error',
            detail: error
          });
        });
        this.showError = true;
      }
    });
  }
}
