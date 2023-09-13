import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthenticationResponse } from 'src/app/models/authentication/authentication-response/authentication-response';
import { User } from 'src/app/models/authentication/user/user';
import { AuthenticationService } from 'src/app/services/backend/authentication/authentication.service';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  public isLoading: boolean = true;
  public user!: User;
  public authenticationResponse!: AuthenticationResponse;

  constructor(
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authenticationResponse =
      this.authenticationService.isUserAuthenticated();
    this.route.queryParams.subscribe((params) => {
      if (params['userId'] !== null && params['userId'] !== undefined) {
        this.getOneUser(params['userId']);
      }
    });
  }

  private getOneUser(userId: string): void {
    this.authenticationService.getOneUser(userId).subscribe((user: User) => {
      this.user = user;
      console.log(this.user);
      this.isLoading = false;
    });
  }

  public deleteUser(userId: string): void {
    this.authenticationService.deleteUser(userId).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'The user has been deleted.',
        sticky: true
      });
      this.authenticationService.logout();
      this.router.navigate(['login']);
    });
  }

  public confirmDelete() {
    this.messageService.add({
      key: 'confirm',
      severity: 'warn',
      summary: 'Are you sure you want to delete this account?',
      detail: 'Confirm to deleted',
      sticky: true,
      closable: false
    });
  }

  public onReject() {
    this.messageService.clear('confirm');
  }
}
