import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../main/prime-ng.module';
import { MainModule } from '../main/main.module';
import { LogoutComponent } from './logout/logout.component';

@NgModule({
  declarations: [
    EmailConfirmationComponent,
    ForgotPasswordComponent,
    LoginComponent,
    RegistrationComponent,
    ResetPasswordComponent,
    LogoutComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    MainModule
  ]
})
export class AuthenticationModule { }
