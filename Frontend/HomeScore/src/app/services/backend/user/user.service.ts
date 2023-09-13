import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Club } from "src/app/models/entities/club/club";
import { getBackendUrl } from "../backend-url.def";
import { AutomatedHighlighting } from "src/app/models/authentication/user/automated-highlighting";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url: string = getBackendUrl() + 'User/';

  constructor(private http: HttpClient) { }

  public addFavouriteClub(userId: string, club: Club): Observable<any> {
    return this.http.post<any>(this.url + userId, club);
  }

  public deleteFavouriteClub(userId: string, clubId: number): Observable<any> {
    return this.http.delete<any>(this.url + userId + '/' + clubId);
  }

  public getAllFavouriteClub(userId: string): Observable<Club[]> {
    return this.http.get<Club[]>(this.url + userId);
  }

  public isFavourite(userId: string, clubId: number): Observable<boolean> {
    return this.http.get<boolean>(this.url + userId + '/' + clubId);
  }

  public search(text: string): Observable<Array<Array<any>>> {
    return this.http.get<Array<Array<any>>>(this.url + 'Search/' + text);
  }

  public addAutomatedHighlighting(automatedHighlighting: AutomatedHighlighting): void {
    sessionStorage.setItem('automatedHighlighting', JSON.stringify(automatedHighlighting));
  }

  public deleteAutomatedHighlighting(): void {
    sessionStorage.removeItem('automatedHighlighting');
  }

  public getAutomatedHighlighting(): AutomatedHighlighting | null {
    const storedAutomatedHighlighting = sessionStorage.getItem('automatedHighlighting');
    if(storedAutomatedHighlighting !== null)
    {  
      return JSON.parse(storedAutomatedHighlighting);
    }
    else {
      return null;
    }
  }
}
