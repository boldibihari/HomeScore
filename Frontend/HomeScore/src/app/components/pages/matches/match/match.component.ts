import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Data, ActivatedRoute } from '@angular/router';
import { Subject, Subscription, mergeMap, tap, timer } from 'rxjs';
import { AuthenticationResponse } from 'src/app/models/authentication/authentication-response/authentication-response';
import { Club } from 'src/app/models/entities/club/club';
import { AuthenticationService } from 'src/app/services/backend/authentication/authentication.service';
import { ClubService } from 'src/app/services/backend/club/club.service';
import { StatusType, MatchService } from 'src/app/services/backend/match/match.service';
import { UserService } from 'src/app/services/backend/user/user.service';

export enum MatchStatus{
  NotStarted = 'Not started',
  FirstHalf = 'First half',
  HalfTime = 'Half time',
  SecondHalf = 'Second half',
  FullTime = 'Full time'
}

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit, OnDestroy  {
  public isLoading: boolean = true;
  private subscriptions: Subscription[] = [];
  public authenticationResponse!: AuthenticationResponse;
  public match!: any;
  public statistics!: any[];
  public startDate: Date = new Date();
  public matchTime!: number;
  public actualDate!: Data;
  public lineups!: any[];
  public incidents: any[] = [];
  public homeLineup!: any;
  public awayLineup!: any;
  public homeClub!: Club;
  public awayClub!: Club;
  public homeClubImage!: SafeUrl | null;
  public awayClubImage!: SafeUrl | null;
  public interval!: any;
  public status!: StatusType;
  public matchStatus!: MatchStatus;
  public addedTime1: number = 0;
  public addedTime2: number = 0;
  private matchChangeSub = new Subject<MatchStatus>();
  public matchChanged = this.matchChangeSub.asObservable();
  public previousLength: number = 0; 

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private clubService: ClubService,
    private matchService: MatchService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
    ) {  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      if (params['matchId'] !== null || params['matchId'] !== undefined) {
        this.authenticationResponse = this.authenticationService.isUserAuthenticated();

        this.getMatch(params['matchId']);

        this.subscriptions.push(timer(0, 15000).subscribe(() => {
          this.matchService.checkDate(this.startDate, this.matchStatus);
          if(this.status === StatusType.NotStarted) {
            let now = new Date();
            if (this.startDate <= now) {
              this.getMatch(params['matchId']);
            }
          }
        }));

        this.subscriptions.push(this.matchService.matchChanged.subscribe((status: StatusType) => {
          this.status = status;
          // Ha az állapot inprogress vagy notstarted, elindítjuk a timert
          if (this.status === StatusType.Inprogress) {
            this.interval = timer(0, 60000).pipe(
              mergeMap(() => this.matchService.getMatchIncident(params['matchId'])),
              tap((data: any) => {
                if (this.previousLength !== data.incidents.length) {
                  const automatedHighlighting = this.userService.getAutomatedHighlighting();  
                  if(automatedHighlighting?.isTurnedOn === true) {
                    const newIncidents = data.incidents.slice(0, (data.incidents.length - this.previousLength) + 1);
                    newIncidents.forEach((x: any) => {
                      if(x.incidentType === automatedHighlighting.type) {
                        window.open(automatedHighlighting.stream, '_blank');
                      }
                    })
                  }
                  this.previousLength = data.incidents.length;
                  this.checkMatchStatus(data.incidents[0].text);
                  this.incidents = data.incidents.reverse();
                  let addedTime = data.incidents.find((incident: any) => incident.incidentType === 'injuryTime');
                  if(addedTime !== undefined) {
                    this.getElapsedMinutes(addedTime.length);
                  }
                  else {
                    this.getElapsedMinutes();
                  }
                }
                else {
                  this.previousLength = data.incidents.length;
                  this.checkMatchStatus(data.incidents[0].text);
                  this.getElapsedMinutes();
                }
              })
            ).subscribe();
          }
          // Ha az állapot finished, leállítjuk a timert
          else if (this.status === StatusType.Finished) {
            if (this.interval) {
              this.interval.unsubscribe();
            }
          }
        }));
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private getMatch(matchId: number): void {
    this.matchService.getMatch(matchId).subscribe(match => {
      this.match = match.event;
      this.checkMatchStatus(match.event.status.description);
      this.startDate = new Date(match.event.startTimestamp * 1000);
      this.getMatchLineup(matchId);
      this.getHomeClubImage(match.event.homeTeam.id);
      this.getAwayClubImage(match.event.awayTeam.id);

      if(this.matchStatus !== MatchStatus.NotStarted){
        this.getMatchIncident(matchId);
        this.getMatchStatistics(matchId);
      }
      if(this.matchStatus === MatchStatus.FirstHalf || this.matchStatus === MatchStatus.SecondHalf) {
        if(match.event.time.hasOwnProperty('injuryTime1')){
          this.getElapsedMinutes(match.event.time.injuryTime1);
        }
        else {
          this.getElapsedMinutes();
        }
      }
      this.isLoading = false;
    });
  }

  private getMatchLineup(matchId: number): void {
    this.matchService.getMatchLineup(matchId).subscribe(lineups => {
      this.lineups = lineups;
      this.homeLineup = lineups.home;
      this.awayLineup = lineups.away;
    });
  }

   private getMatchIncident(matchId: number): void {
    this.matchService.getMatchIncident(matchId).subscribe(event => {
      this.incidents = event.incidents.reverse();
      this.previousLength = event.incidents.length;
      console.log(this.incidents);
    });
  } 

  private getMatchStatistics(matchId: number): void {
    this.matchService.getMatchStatistics(matchId).subscribe(event => {
      this.statistics = event.statistics[0].groups;
    });
  }

  public getElapsedMinutes(addedTime: number = 0): void {
    const now = new Date();
    const elapsedSeconds = (now.getTime() - this.startDate.getTime()) / 1000;
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    if (this.matchStatus === MatchStatus.FirstHalf) {
      this.matchTime = elapsedMinutes;
    } else if (this.matchStatus === MatchStatus.SecondHalf) {
      this.matchTime = elapsedMinutes - (15 + addedTime + 1);
    }
  }

  private checkMatchStatus(status: string): void {
    if(status === 'Not started') {
      this.matchStatus = MatchStatus.NotStarted;
    }
    else if (status === '1st half' || status === 'First half') {
      this.matchStatus = MatchStatus.FirstHalf;
    }
    else if (status === '2nd half' || status === 'Second half') {
      this.matchStatus = MatchStatus.SecondHalf;
    }
    else if (status === 'Halftime' || status === 'HT') {
      this.matchStatus = MatchStatus.HalfTime;
    }
    else {
      this.matchStatus = MatchStatus.FullTime;
    }
  } 

  private getHomeClubImage(clubId: number): void {
    this.clubService.getClubImage(clubId).subscribe({
      next: (image: Blob) => {
        let data = image;
        let objectURL = URL.createObjectURL(data);
        this.homeClubImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: () => {
        this.homeClubImage = null;
      }
    });
  }

  private getAwayClubImage(clubId: number): void {
    this.clubService.getClubImage(clubId).subscribe({
      next: (image: Blob) => {
        let data = image;
        let objectURL = URL.createObjectURL(data);
        this.awayClubImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: () => {
        this.awayClubImage = null;
      }
    });
  }
}
