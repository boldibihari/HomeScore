import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Club } from 'src/app/models/entities/club/club';
import { AuthenticationService } from 'src/app/services/backend/authentication/authentication.service';
import { ClubService } from 'src/app/services/backend/club/club.service';
import { UserService } from 'src/app/services/backend/user/user.service';
import { DataView } from 'primeng/dataview';
import { MessageService } from 'primeng/api';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { AuthenticationResponse } from 'src/app/models/authentication/authentication-response/authentication-response';

@Component({
  selector: 'clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.scss'],
})
export class ClubsComponent implements OnInit {
  public isLoading: boolean = true;
  public clubs: any[] = [];
  public authenticationResponse!: AuthenticationResponse;

  constructor(
    private clubService: ClubService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.authenticationResponse =
      this.authenticationService.isUserAuthenticated();
    this.getAllClub();
  }

  public onFilter(event: Event, dv: DataView) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  public deleteClub(clubId: number): void {
    this.clubService.deleteClub(clubId).subscribe(() => {
      this.getAllClub();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'The club has been deleted.',
      });
    });
  }

  public onChangeFavourite(event: any, club: Club) {
    let isChecked = event.checked;
    if (this.authenticationResponse.userId !== null) {
      if (isChecked) {
        this.userService
          .addFavouriteClub(this.authenticationResponse.userId, club)
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'The team has been successfully added to favourites.',
            });
          });
      } else {
        this.userService
          .deleteFavouriteClub(this.authenticationResponse.userId, club.clubId)
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'The team has been successfully deleted from favourites.',
            });
          });
      }
    }
  }

  public isFavourite(club: Club): void {
    if (this.authenticationResponse.userId !== '') {
      this.userService.addFavouriteClub(
        this.authenticationResponse.userId,
        club
      );
    }
  }

  private getAllClub(): void {
    this.clubService
      .getAllClub()
      .pipe(
        switchMap((clubs) => {
          const observables = clubs.map((club) =>
            forkJoin({
              image: this.clubService
                .getClubImage(club.clubId)
                .pipe(catchError(() => this.clubService.getClubDefaultImage())),
              isFavourite:
                this.authenticationResponse.isUserAuthenticated !== false
                  ? this.userService
                      .isFavourite(
                        this.authenticationResponse.userId,
                        club.clubId
                      )
                      .pipe(switchMap((isFavourite) => of(isFavourite)))
                  : of(null),
            })
          );
          return forkJoin(observables).pipe(
            map((results) => {
              const map = new Map<
                Club,
                { image: SafeUrl; isFavourite: boolean | null }
              >();
              for (let i = 0; i < clubs.length; i++) {
                const objectUrl = URL.createObjectURL(results[i].image);
                const safeUrl =
                  this.sanitizer.bypassSecurityTrustUrl(objectUrl);
                map.set(clubs[i], {
                  image: safeUrl,
                  isFavourite: results[i].isFavourite,
                });
              }
              return map;
            })
          );
        })
      )
      .subscribe((map) => {
        this.clubs = Array.from(map.keys()).map((club) => {
          return {
            club: club,
            image: map.get(club)?.image,
            isFavourite: map.get(club)?.isFavourite,
          };
        });
        this.isLoading = false;
      });
  }
}
