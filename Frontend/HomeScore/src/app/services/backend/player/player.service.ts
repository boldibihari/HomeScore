import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, of } from "rxjs";
import { Country } from "src/app/models/entities/country/country";
import { Player } from "src/app/models/entities/player/player";
import { Position } from "src/app/models/entities/position/position";
import { getBackendUrl } from "../backend-url.def";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private url: string = getBackendUrl() + 'Player/';

  constructor(private http: HttpClient) { }

  public addPlayer(clubId: number, player: Player): Observable<any> {
    return this.http.post<any>(this.url + clubId, player);
  }

  public deletePlayer(playerId: number): Observable<any> {
    return this.http.delete<any>(this.url + playerId);
  }

  public updatePlayer(playerId: number, player: Player): Observable<any> {
    return this.http.put<any>(this.url + playerId, player);
  }

  public getOnePlayer(playerId: number): Observable<Player> {
    return this.http.get<Player>(this.url + playerId);
  }

  public getPlayerImage(playerId: number): Observable<Blob>{
    return  this.http.get<Blob>('https://divanscore.p.rapidapi.com/players/get-image?playerId=' + playerId, {
      headers: {
        'x-rapidapi-host': 'divanscore.p.rapidapi.com',
        'x-rapidapi-key': 'f8851bba3dmsh986ba52b8331dcdp1747bcjsn652430e5a0f5'
      },
      responseType: 'blob' as 'json'
    }).pipe(
      map(response => {
        if (response) {
          return response;
        } else {
          throw new Error('No image found!');
        }
      }),
      catchError(() => this.http.get('assets/images/unknown.png', { responseType: 'blob' }))
    );
  }

  public getFlag(code: string): Observable<string> {
    return code !== null
      ? of(`https://flagcdn.com/h24/${code.toLowerCase()}.png`)
      : of('');
  }

  public getAllPlayer(): Observable<Player[]> {
    return this.http.get<Player[]>(this.url);
  }

  public getAllCaptain(): Observable<Player[]> {
    return this.http.get<Player[]>(this.url + 'GetAllCaptain');
  }

  public getAllPlayerId(): Observable<number[]> {
    return this.http.get<number[]>(this.url + 'GetAllPlayerId');
  }

  public getAllPlayerCount(): Observable<number> {
    return this.http.get<number>(this.url + 'Count');
  }

  public getAllAverageAge(): Observable<number> {
    return this.http.get<number>(this.url + 'AverageAge');
  }

  public getAllValue(): Observable<number> {
    return this.http.get<number>(this.url + 'Value');
  }
  
  public getAveragePlayerValue(): Observable<number> {
    return this.http.get<number>(this.url + 'AverageValue');
  }

  public getAllCountry(): Observable<Country[]> {
    return this.http.get<Country[]>(this.url + 'Country');
  }

  public getAllPosition(): Observable<Position[]> {
    return this.http.get<Position[]>(this.url + 'Position');
  }
}
