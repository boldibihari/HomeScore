import { Component, OnInit } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthenticationResponse } from 'src/app/models/authentication/authentication-response/authentication-response';
import { Club } from 'src/app/models/entities/club/club';
import { Country } from 'src/app/models/entities/country/country';
import { AuthenticationService } from 'src/app/services/backend/authentication/authentication.service';
import { ClubService } from 'src/app/services/backend/club/club.service';
import { ManagerService } from 'src/app/services/backend/manager/manager.service';
import { MatchService } from 'src/app/services/backend/match/match.service';
import { PlayerService } from 'src/app/services/backend/player/player.service';
import { StadiumService } from 'src/app/services/backend/stadium/stadium.service';

@Component({
  selector: 'club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss'],
})
export class ClubComponent implements OnInit {
  public isLoading: boolean = true;
  public authenticationResponse!: AuthenticationResponse;
  public club!: Club;
  public clubs: Club[] = [];
  public country: Country[] = [];
  public nextMatch: any;
  public nearEvents: any[] = [];
  public date!: Date;
  public clubValue!: number;
  public averageAge!: number;
  public averageValue!: number;
  public size!: number;
  public hungarians!: number;
  public foreigners!: number;
  public isAdmin!: boolean;
  public isAuthenticated!: boolean;
  public clubImage!: SafeUrl | null;
  public managerImage!: SafeUrl | null;
  public stadiumImage!: SafeUrl | null;
  public stadiumMap!: SafeUrl;
  public data: any;
  public options: any;

  constructor(
    private authenticationService: AuthenticationService,
    private clubService: ClubService,
    private managerService: ManagerService,
    private playerService: PlayerService,
    private stadiumService: StadiumService,
    private matchService: MatchService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.authenticationResponse = this.authenticationService.isUserAuthenticated();
    this.route.queryParams.subscribe((params) => {
      if (params['clubId'] !== null && params['clubId'] !== undefined) {
        this.getOneClub(params['clubId']);
        this.getValue(params['clubId']);
        this.getAverageAge(params['clubId']);
      }
    });
  }

  private getOneClub(clubId: number): void {
    this.clubService.getOneClub(clubId).subscribe((club: Club) => {
      this.club = club;
      this.club.players.sort((a, b) => a.playerPosition - b.playerPosition);
      this.size = this.club.players.length;
      this.clubs.push(club);
      this.getClubImage(clubId);
      this.getValue(clubId);
      this.getCountry(clubId);
      this.getNearEvents(clubId);
      console.log('MANAGER');
      console.log(this.club.manager);
      if (club.manager !== null) {
        this.getManagerImage(club.manager.managerId);
      }
      if (club.stadium !== null) {
        this.getStadiumImage(club.stadium.stadiumId);
        this.getStadiumMap(club.stadium.stadiumName);
      }
      setTimeout(() => {
        this.isLoading = false;
      }, 1500);
    });
  }

  public uploadClubImage(event: any): void {
    if (this.club !== null) {
      const formData = new FormData();
      formData.append('file', event.files[0], this.club.clubId.toString());
      this.clubService
        .uploadClubImage(this.club.clubId, formData)
        .subscribe(() => {
          if (this.club !== null) {
            this.getClubImage(this.club.clubId);
          }
        });
    }
  }

  public uploadManagerImage(event: any): void {
    if (this.club.manager !== null) {
      const formData = new FormData();
      formData.append('file', event.files[0], this.club.manager.managerId.toString());
      this.managerService
        .uploadManagerImage(this.club.manager.managerId, formData)
        .subscribe(() => {
          if (this.club.manager !== null) {
            this.getManagerImage(this.club.manager.managerId);
          }
        });
    }
  }

  public uploadStadiumImage(event: any): void {
    if (this.club.stadium !== null) {
      const formData = new FormData();
      formData.append('file', event.files[0], this.club.stadium.stadiumId.toString());
      this.stadiumService
        .uploadStadiumImage(this.club.stadium.stadiumId, formData)
        .subscribe(() => {
          if (this.club.stadium !== null) {
            this.getStadiumImage(this.club.stadium.stadiumId);
          }
        });
    }
  }

  private getNearEvents(clubId: number): void {
    this.matchService.getNearEvents(clubId).subscribe((matches: any) => {
      let events: any[] = [];
      events.push(matches.previousEvent);
      events.push(matches.nextEvent);
      this.nearEvents = events;
      console.log(this.nearEvents);
    });
  }

  public getStatus(statusType: string): string {
    if (statusType === 'finished') {
      return 'Previous match';
    }
    else if (statusType === 'inprogress') {
      return 'Live match';
    } 
    else {
      return 'Next match';
    }
  }

  private getValue(clubId: number): void {
    this.clubService.getValue(clubId).subscribe((value: number) => {
      this.clubValue = value;
    });
  }

  private getCountry(clubId: number): void {
    this.clubService.getCountry(clubId).subscribe((countries: Country[]) => {
      countries.forEach((x) => {
        if (x.playerCountry === 'Hungary') {
          this.hungarians = x.count;
        }
      });
      this.foreigners = this.club.players.length - this.hungarians;
      const labels = countries.map((country) => country.playerCountry);
      const data = countries.map((country) => country.count);

      this.data = {
        labels: labels,
        datasets: [{ data: data }],
      };
      this.options = {
        plugins: { legend: { display: false } },
      };
    });
  }

  private getAverageAge(clubId: number): void {
    this.clubService.getAverageAge(clubId).subscribe((age: number) => {
      this.averageAge = age;
    });
  }

  private getClubImage(clubId: number): void {
    this.clubService.getClubImage(clubId).subscribe({
      next: (image: Blob) => {
        let objectURL = URL.createObjectURL(image);
        this.clubImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: () => {
        this.clubImage = null;
      },
    });
  }

  private getManagerImage(managerId: number): void {
    this.managerService.getManagerImage(managerId).subscribe({
      next: (image: Blob) => {
        let data = image;
        let objectURL = URL.createObjectURL(data);
        this.managerImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: () => {
        this.managerImage = null;
      },
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
      },
    });
  }

  private getStadiumMap(stadiumName: string): void {
    let map =
      'https://www.google.com/maps/embed/v1/place?key=AIzaSyCSm4yQYNC6mY6YkNosxhMEPEUs7XayazM&q=' +
      stadiumName;
    this.stadiumMap = this.sanitizer.bypassSecurityTrustResourceUrl(map);
  }

  public urlCreator(code: string): string {
    if (code !== null) {
      return 'https://flagcdn.com/h24/' + code.toLowerCase() + '.png';
    }
    return '';
  }

  public deleteClub(clubId: number): void {
    this.clubService.deleteClub(clubId).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'The club has been deleted.',
      });
      this.router.navigate(['clubs']);
    });
  }

  public deletePlayer(playerId: number): void {
    this.playerService.deletePlayer(playerId).subscribe(() => {
      this.getOneClub(this.club.clubId);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'The player has been deleted.',
      });
    });
  }

  public deleteManager(managerId: number): void {
    this.managerService.deleteManagerImage(managerId).subscribe();
    this.managerService.deleteManager(managerId).subscribe(() => {
      this.getOneClub(this.club.clubId);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'The manager has been deleted.',
      });
    });
  }

  public deleteClubImage(clubId: number): void {
    this.clubService.deleteClubImage(clubId).subscribe(() => {
      this.getClubImage(clubId);
    });
  }

  public deleteManagerImage(managerId: number): void {
    this.managerService.deleteManagerImage(managerId).subscribe(() => {
      this.getManagerImage(managerId);
    });
  }

  public deleteStadium(stadiumId: number): void {
    this.stadiumService.deleteStadium(stadiumId).subscribe(() => {
      this.getOneClub(this.club.clubId);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'The stadium has been deleted.',
      });
    });
  }

  public deleteStadiumImage(stadiumId: number): void {
    this.stadiumService.deleteStadiumImage(stadiumId).subscribe(() => {
      this.getStadiumImage(stadiumId);
    });
  }
}
