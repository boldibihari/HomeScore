import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { User } from 'src/app/models/authentication/user/user';
import { AuthenticationService } from 'src/app/services/backend/authentication/authentication.service';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  public isLoading: boolean = true;
  public users: Array<User> = [];
  public newlyRegistered!: number;

  constructor(
    private authenticationService: AuthenticationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllUser();
  }

  private getAllUser(): void {
    this.authenticationService.getAllUser().subscribe((users: User[]) => {
      this.users = users;
      this.newlyRegistered = users.filter((user) => {
        const registrationDate = new Date(user.createdDate);
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return registrationDate >= oneWeekAgo && registrationDate <= now;
      }).length;

      this.isLoading = false;
    });
  }

  public deleteUser(userId: string): void {
    this.authenticationService.deleteUser(userId).subscribe(() => {
      this.getAllUser();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'The user has been deleted.'
      });
    });
  }

  public onFilter(event: Event, field: string, table: Table) {
    table.filter((event.target as HTMLInputElement).value, field, 'contains');
  }
}
