import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, forkJoin, map, switchMap } from 'rxjs';
import { Stadium } from 'src/app/models/entities/stadium/stadium';
import { StadiumService } from 'src/app/services/backend/stadium/stadium.service';
import { DataView } from 'primeng/dataview';
import { AuthenticationService } from 'src/app/services/backend/authentication/authentication.service';
import { MessageService } from 'primeng/api';
import { AuthenticationResponse } from 'src/app/models/authentication/authentication-response/authentication-response';

@Component({
  selector: 'stadiums',
  templateUrl: './stadiums.component.html',
  styleUrls: ['./stadiums.component.scss'],
})
export class StadiumsComponent implements OnInit {
  public isLoading: boolean = true;
  public authenticationResponse!: AuthenticationResponse;
  public stadiums: any[] = [];

  constructor(
    private stadiumService: StadiumService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.authenticationResponse = this.authenticationService.isUserAuthenticated();
    this.getAllStadium();
  }

  public onFilter(event: Event, dv: DataView) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  public deleteStadium(stadiumId: number): void {
    this.stadiumService.deleteStadium(stadiumId).subscribe(() => {
      this.getAllStadium();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'The stadium has been deleted.'
      });
    });
  }

  private getAllStadium(): void {
    this.stadiumService
      .getAllStadium()
      .pipe(
        switchMap((stadiums) => {
          const observables = stadiums.map((stadium) =>
            this.stadiumService
              .getStadiumImage(stadium.stadiumId)
              .pipe(
                catchError(() => this.stadiumService.getStadiumDefaultImage())
              )
          );
          return forkJoin(observables).pipe(
            map((blobs) => {
              const map = new Map<Stadium, SafeUrl>();
              for (let i = 0; i < stadiums.length; i++) {
                const objectUrl = URL.createObjectURL(blobs[i]);
                const safeUrl =
                  this.sanitizer.bypassSecurityTrustUrl(objectUrl);
                map.set(stadiums[i], safeUrl);
              }
              return map;
            })
          );
        })
      )
      .subscribe((map) => {
        this.stadiums = Array.from(map.keys()).map((stadium) => {
          return {
            stadium: stadium,
            image: map.get(stadium)
          };
        });
        this.isLoading = false;
      });
  }
}
