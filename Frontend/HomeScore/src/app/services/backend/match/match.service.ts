import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MatchStatus } from 'src/app/components/pages/matches/match/match.component';

export enum StatusType{
  NotStarted = 'Not started',
  Inprogress = 'Inprogress',
  Finished = 'Finished'
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private matchChangeSub = new Subject<StatusType>();
  public matchChanged = this.matchChangeSub.asObservable();
  private previousStatus!: MatchStatus;

  constructor(private http: HttpClient) { }

  public sendMatchStateChangeNotification(status: StatusType) {
    this.matchChangeSub.next(status);
  }

  public checkDate(startDate: Date, status: MatchStatus): void {
    let now = new Date();
    if(status !== this.previousStatus) {
      if (now < startDate && status === MatchStatus.NotStarted) {
        this.sendMatchStateChangeNotification(StatusType.NotStarted);   
      } else if (now >= startDate &&  (status === MatchStatus.FirstHalf || status === MatchStatus.HalfTime || status === MatchStatus.SecondHalf)) {
        this.sendMatchStateChangeNotification(StatusType.Inprogress);
      } else {
        this.sendMatchStateChangeNotification(StatusType.Finished);
      }
      this.previousStatus = status;
    }
  }

  public getMatch(matchId: number): Observable<any>{
    return  this.http.get<any>('https://divanscore.p.rapidapi.com/matches/detail?matchId=' + matchId, {
      headers: {
        'x-rapidapi-host': 'divanscore.p.rapidapi.com',
        'x-rapidapi-key': '716582a09bmsh915846cbbbe2ad7p1a0b6ejsn83fb3d28ec49'
    }});
  }

  public getNearEvents(clubId: number): Observable<any>{
    return  this.http.get<any>('https://divanscore.p.rapidapi.com/teams/get-near-events?teamId=' + clubId, {
      headers: {
        'x-rapidapi-host': 'divanscore.p.rapidapi.com',
        'x-rapidapi-key': '716582a09bmsh915846cbbbe2ad7p1a0b6ejsn83fb3d28ec49'
    }});
  }

  public getMatchLineup(matchId: number): Observable<any>{
    return  this.http.get<any>('https://divanscore.p.rapidapi.com/matches/get-lineups?matchId=' + matchId, {
      headers: {
        'x-rapidapi-host': 'divanscore.p.rapidapi.com',
        'x-rapidapi-key': '716582a09bmsh915846cbbbe2ad7p1a0b6ejsn83fb3d28ec49'
    }});
  }

  public getMatchIncident(matchId: number): Observable<any>{
    return  this.http.get<any>('https://divanscore.p.rapidapi.com/matches/get-incidents?matchId=' + matchId, {
      headers: {
        'x-rapidapi-host': 'divanscore.p.rapidapi.com',
        'x-rapidapi-key': '716582a09bmsh915846cbbbe2ad7p1a0b6ejsn83fb3d28ec49'
    }});
  }

  public getMatchStatistics(matchId: number): Observable<any>{
    return  this.http.get<any>('https://divanscore.p.rapidapi.com/matches/get-statistics?matchId=' + matchId, {
      headers: {
        'x-rapidapi-host': 'divanscore.p.rapidapi.com',
        'x-rapidapi-key': '716582a09bmsh915846cbbbe2ad7p1a0b6ejsn83fb3d28ec49'
    }});
  }

  public getAllVideoHighlight(): Observable<any>{
    return  this.http.get<any>('https://divanscore.p.rapidapi.com/tournaments/get-media?tournamentId=' + 187, {
      headers: {
        'x-rapidapi-host': 'divanscore.p.rapidapi.com',
        'x-rapidapi-key': '716582a09bmsh915846cbbbe2ad7p1a0b6ejsn83fb3d28ec49'
    }});
  }
}
