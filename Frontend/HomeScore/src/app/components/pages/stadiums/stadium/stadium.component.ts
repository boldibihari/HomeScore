import { Component, OnInit } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Club } from 'src/app/models/entities/club/club';
import { Stadium } from 'src/app/models/entities/stadium/stadium';
import { ClubService } from 'src/app/services/backend/club/club.service';
import { StadiumService } from 'src/app/services/backend/stadium/stadium.service';

@Component({
  selector: 'stadium',
  templateUrl: './stadium.component.html',
  styleUrls: ['./stadium.component.scss'],
})
export class StadiumComponent implements OnInit {
  public isLoading: boolean = true;
  public stadium!: Stadium;
  public stadiumImage!: SafeUrl | null;
  public stadiumMap!: SafeUrl;
  public club!: Club;
  public clubImage!: SafeUrl | null;

  constructor(
    private stadiumService: StadiumService,
    private clubService: ClubService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (
        params['stadiumId'] !== null &&
        params['stadiumId'] !== undefined &&
        params['clubId'] !== null &&
        params['clubId'] !== undefined
      ) {
        this.getOneStadium(params['stadiumId'], params['clubId']);
      }
    });
  }

  private getOneStadium(stadiumId: number, clubId: number): void {
    this.stadiumService
      .getOneStadium(stadiumId)
      .subscribe((stadium: Stadium) => {
        this.stadium = stadium;
        this.getStadiumImage(stadiumId);
        this.getStadiumMap(stadium.stadiumName);
        this.getOneClub(clubId);
        this.getClubImage(clubId);
        this.isLoading = false;
      });
  }

  private getOneClub(clubId: number): void {
    this.clubService.getOneClub(clubId).subscribe((club: Club) => {
      this.club = club;
    });
  }

  private getStadiumImage(stadiumId: number): void {
    this.stadiumService.getStadiumImage(stadiumId).subscribe({
      next: (image: Blob) => {
        let data = image;
        let objectURL = URL.createObjectURL(data);
        this.stadiumImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: () => {
        this.stadiumImage = null;
      }
    });
  }

  private getClubImage(clubId: number): void {
    this.clubService.getClubImage(clubId).subscribe({
      next: (image: Blob) => {
        let data = image;
        let objectURL = URL.createObjectURL(data);
        this.clubImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: () => {
        this.clubImage = null;
      }
    });
  }

  private getStadiumMap(stadiumName: string): void {
    let map = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyCSm4yQYNC6mY6YkNosxhMEPEUs7XayazM&q=' + stadiumName;
    this.stadiumMap = this.sanitizer.bypassSecurityTrustResourceUrl(map);
  }
}
