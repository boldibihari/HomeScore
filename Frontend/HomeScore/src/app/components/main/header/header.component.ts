import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthenticationResponse } from 'src/app/models/authentication/authentication-response/authentication-response';
import { AuthenticationService } from 'src/app/services/backend/authentication/authentication.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public items!: MenuItem[];
  public authenticationResponse!: AuthenticationResponse;
  public userName!: string;
  public userId: string | null = null;
  public visible: boolean = false;

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.authenticationResponse =
      this.authenticationService.isUserAuthenticated();

    this.getMenu();

    this.authenticationService.authChanged.subscribe(
      (res: AuthenticationResponse) => {
        this.authenticationResponse = res;
        this.getMenu();
      }
    );
  }

  public getMenu() {
    this.items = [
      {
        label: 'Clubs',
        routerLink: 'clubs',
      },
      {
        label: 'Managers',
        routerLink: 'managers',
      },
      {
        label: 'Players',
        routerLink: 'players',
      },
      {
        label: 'Stadiums',
        routerLink: 'stadiums',
      },
      {
        label: 'Videos',
        routerLink: '/matches/videos',
      },
      {
        label: 'Favourites',
        routerLink: '/users/favourites',
        queryParams: { userId: this.authenticationResponse.userId },
        visible: this.authenticationResponse.isUserAuthenticated,
      },
      {
        label: 'Login',
        icon: 'pi pi-user',
        routerLink: 'login',
        style: {'margin-left': 'auto'},
        visible: !this.authenticationResponse.isUserAuthenticated,
      },
      {
        label: this.authenticationResponse.userName,
        style: {'margin-left': 'auto'},
        visible: this.authenticationResponse.isUserAuthenticated,
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-user',
            routerLink: '/users/user',
            queryParams: { userId: this.authenticationResponse.userId },
          },
          {
            label: 'Sign out',
            icon: 'pi pi-sign-out',
            routerLink: 'logout',
          },
        ],
      },
    ];
  }

  public onVisibleChange(visible: boolean): void {
    this.visible = visible;
  }

  public showDialog(): void {
    this.visible = true;
  }
}
