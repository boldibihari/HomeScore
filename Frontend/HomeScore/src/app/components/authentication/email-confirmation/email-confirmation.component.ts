import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/api';
import { AuthenticationService } from 'src/app/services/backend/authentication/authentication.service';

@Component({
  selector: 'email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss'],
})
export class EmailConfirmationComponent implements OnInit {
  public isLoading: boolean = false;
  public showSuccess: boolean = false;
  public showError: boolean = false;
  public messages: Message[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.emailConfirmation();
  }

  private emailConfirmation(): void {
    this.isLoading = true;
    this.showError = this.showSuccess = false;

    const email = this.router.snapshot.queryParams['email'];
    const token = this.router.snapshot.queryParams['token'];

    this.authenticationService.emailConfirmation(email, token).subscribe({
      next: (_) => {
        this.isLoading = false;
        this.showSuccess = true;
        this.messages = [
          {
            severity: 'success',
            summary: 'Successful confirmation',
            detail:
              'Your email has been successfully confirmed. Please log in.'
          }
        ];
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.showError = true;
        this.messages = [
          { severity: 'error', summary: 'Error', detail: error.message }
        ];
      }
    });
  }
}
