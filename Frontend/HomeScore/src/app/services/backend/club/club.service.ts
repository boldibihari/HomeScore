import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Club } from "src/app/models/entities/club/club";
import { Country } from "src/app/models/entities/country/country";
import { Position } from "src/app/models/entities/position/position";
import { getBackendUrl } from "../backend-url.def";

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  private url: string = getBackendUrl() + 'Club/';

  constructor(private http: HttpClient) { }

  public addClub(club: Club): Observable<any>  {
    return this.http.post<any>(this.url, club);
  }

  public uploadClubImage(clubId: number, formData: FormData): Observable<any> {
    return this.http.post<any>(this.url + 'Image/' + clubId, formData);
  }

  public deleteClub(clubId: number): Observable<any> {
    return this.http.delete<any>(this.url + clubId);
  }

  public deleteClubImage(clubId: number): Observable<any> {
    return this.http.delete<any>(this.url + 'Image/' + clubId);
  }

  public deleteImageClub(clubId: number): Observable<any> {
    return this.http.delete<any>(this.url + clubId);
  }

  public updateClub(clubId: number, club: Club): Observable<any> {
    return this.http.put<any>(this.url + clubId, club);
  }

  public getOneClub(clubId: number): Observable<Club> {
    return this.http.get<Club>(this.url + clubId);
  }

  public getClubImage(clubId: number): Observable<Blob> {
    return this.http.get<Blob>(this.url + 'Image/' + clubId, {responseType: 'blob' as 'json'});
  }

  public getClubDefaultImage(): Observable<Blob> {
    return this.http.get('assets/images/unknown.png', { responseType: 'blob' });
  }

  public getAllClub(): Observable<Club[]> {
    return this.http.get<Club[]>(this.url);
  }

  public getAverageAge(clubId: number): Observable<number> {
    return this.http.get<number>(this.url + 'AverageAge/' + clubId);
  }

  public getAverageValue(): Observable<number> {
    return this.http.get<number>(this.url + 'AverageValue');
  }

  public getValue(clubId: number): Observable<number> {
    return this.http.get<number>(this.url + 'Value/' + clubId);
  }

  public getAveragePlayerValue(clubId: number): Observable<number> {
    return this.http.get<number>(this.url + 'AveragePlayerValue/' + clubId);
  }

  public getCountry(clubId: number): Observable<Country[]> {
    return this.http.get<Country[]>(this.url + 'Country/' + clubId);
  }

  public getPosition(clubId: number): Observable<Position[]> {
    return this.http.get<Position[]>(this.url + 'Position/' + clubId);
  }
}
