import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { Registration } from 'src/app/models/authentication/registration/registration';
import { AuthenticationService } from 'src/app/services/backend/authentication/authentication.service';
import { PasswordValidator } from 'src/app/services/validators/password-validator.service';

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  public isLoading: boolean = false;
  public registrationForm!: UntypedFormGroup;
  public newUser: Registration = new Registration();
  public errorMessage: Message[] = [];
  public showError!: boolean;
  public hide: boolean = true;

  constructor(
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private passConfValidator: PasswordValidator,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registrationForm = new UntypedFormGroup({
      firstName: new UntypedFormControl('', [Validators.required]),
      lastName: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new UntypedFormControl('', [Validators.required]),
      confirmPassword: new UntypedFormControl('')
    });
    this.registrationForm
      .get('confirmPassword')
      ?.setValidators([
        Validators.required,
        this.passConfValidator.validateConfirmPassword(
          this.registrationForm.get('password') as UntypedFormArray
        ),
      ]);
  }

  public validateControl(controlName: string) {
    return (
      this.registrationForm.get(controlName)?.invalid &&
      this.registrationForm.get(controlName)?.touched
    );
  }

  public hasError(controlName: string, errorName: string) {
    return this.registrationForm.get(controlName)?.hasError(errorName);
  }

  public registerUser(registerFormValue: any): void {
    this.isLoading = true;
    this.showError = false;

    const formValues = { ...registerFormValue };
    const userForRegistration: Registration = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirmPassword,
      clientURI: 'http://localhost:4200/emailconfirmation'
    };

    this.authenticationService.registration(userForRegistration).subscribe({
      next: (_) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'warn',
          summary: 'Successful registration',
          detail: 'Please confirm your account!',
          sticky: true
        });
        this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        let messages = error.message.split(',');
        messages.forEach((error) => {
          this.errorMessage.push({
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
