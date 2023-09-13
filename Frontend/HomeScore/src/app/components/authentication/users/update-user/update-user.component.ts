import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/authentication/user/user';
import { AuthenticationService } from 'src/app/services/backend/authentication/authentication.service';
import { Registration } from 'src/app/models/authentication/registration/registration';
import { PasswordValidator } from 'src/app/services/validators/password-validator.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit {
  public isLoading: boolean = false;
  public updateForm!: UntypedFormGroup;
  public user!: User;
  public errorMessage: Message[] = [];
  public showError!: boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private passConfValidator: PasswordValidator,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateForm = new UntypedFormGroup({
      firstName: new UntypedFormControl('', [Validators.required]),
      lastName: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl(''),
      confirmPassword: new UntypedFormControl('')
    });
    this.updateForm
      .get('confirmPassword')
      ?.setValidators([
        this.passConfValidator.validateConfirmPassword(
          this.updateForm.get('password') as UntypedFormArray
        )
      ]);

    this.route.queryParams.subscribe((params) => {
      if (params['userId'] !== null && params['userId'] !== undefined) {
        this.authenticationService
          .getOneUser(params['userId'])
          .subscribe((user: User) => {
            this.user = user;
            this.setFormData(this.user);
          });
      }
    });
  }

  private setFormData(user: User) {
    this.updateForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName
    });
  }

  public validateControl(controlName: string) {
    return (
      this.updateForm.get(controlName)?.invalid &&
      this.updateForm.get(controlName)?.touched
    );
  }

  public hasError(controlName: string, errorName: string) {
    return this.updateForm.get(controlName)?.hasError(errorName);
  }

  public updateUser(updateFormValue: any): void {
    this.isLoading = true;

    const formValues = { ...updateFormValue };
    const userToUpdate: Registration = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: this.user.email,
      password: formValues.password,
      confirmPassword: formValues.confirmPassword,
      clientURI: ''
    };

    this.authenticationService.updateUser(userToUpdate).subscribe({
      next: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The user has been updated.'
        });
        this.router.navigate(['users/user'], {
          queryParams: { userId: this.user.userId }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        let messages = error.message.split('&');
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
