import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { switchMap, forkJoin, catchError, of, map } from 'rxjs';
import { AuthenticationResponse } from 'src/app/models/authentication/authentication-response/authentication-response';
import { Club } from 'src/app/models/entities/club/club';
import { AuthenticationService } from 'src/app/services/backend/authentication/authentication.service';
import { ClubService } from 'src/app/services/backend/club/club.service';
import { UserService } from 'src/app/services/backend/user/user.service';

@Component({
  selector: 'favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
})
export class FavouritesComponent implements OnInit {
  public isLoading: boolean = true;
  public authenticationResponse!: AuthenticationResponse;
  public clubs: any[] = [];

  constructor(
    private userService: UserService,
    private clubService: ClubService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.authenticationResponse =
      this.authenticationService.isUserAuthenticated();
    this.route.queryParams.subscribe((params) => {
      if (params['userId'] !== null && params['userId'] !== undefined) {
        this.getAllFavouriteClub(params['userId']);
      }
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
              detail: 'The team has been successfully added to favourites.'
            });
            this.getAllFavouriteClub(this.authenticationResponse.userId);
          });
      } else {
        this.userService
          .deleteFavouriteClub(this.authenticationResponse.userId, club.clubId)
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'The team has been successfully deleted from favourites.'
            });
            this.getAllFavouriteClub(this.authenticationResponse.userId);
          });
      }
    }
  }

  private getAllFavouriteClub(userId: string): void {
    this.userService
      .getAllFavouriteClub(userId)
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
                  : of(null)
            })
          );
          if (
            observables.length === 0 ||
            observables.some((obs) => obs == null)
          ) {
            return of(null);
          }
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
                  isFavourite: results[i].isFavourite
                });
              }
              return map;
            })
          );
        })
      )
      .subscribe((map) => {
        if (map == null) {
          this.clubs = [];
        } else {
          this.clubs = Array.from(map.keys()).map((club) => {
            return {
              club: club,
              image: map.get(club)?.image,
              isFavourite: map.get(club)?.isFavourite
            };
          });
        }
        this.isLoading = false;
      });
  }
}
