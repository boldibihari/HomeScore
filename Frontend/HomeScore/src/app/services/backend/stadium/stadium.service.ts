import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Stadium } from "src/app/models/entities/stadium/stadium";
import { getBackendUrl } from "../backend-url.def";

@Injectable({
  providedIn: 'root'
})
export class StadiumService {
  private url: string = getBackendUrl() + "Stadium/";

  constructor(private http: HttpClient) { }

  public addStadium(clubId: number, stadium: Stadium): Observable<any> {
    return this.http.post<any>(this.url + clubId, stadium);
  }

  public uploadStadiumImage(stadiumId: number, formData: FormData): Observable<any> {
    return this.http.post<any>(this.url + 'Image/' + stadiumId, formData);
  }

  public deleteStadium(stadiumId: number): Observable<any> {
    return this.http.delete<any>(this.url + stadiumId);
  }

  public deleteStadiumImage(stadiumId: number): Observable<any> {
    return this.http.delete<any>(this.url + 'Image/' + stadiumId);
  }

  public updateStadium(stadiumId: number, stadium: Stadium): Observable<any> {
    return this.http.put<any>(this.url + stadiumId, stadium);
  }

  public getOneStadium(stadiumId: number): Observable<Stadium> {
    return this.http.get<Stadium>(this.url + stadiumId);
  }

  public getStadiumImage(stadiumId: number): Observable<Blob> {
    return this.http.get<Blob>(this.url + "Image/" + stadiumId, {responseType: 'blob' as 'json'});
  }

  public getStadiumDefaultImage(): Observable<Blob> {
    return this.http.get('assets/images/unknown.png', { responseType: 'blob' });
  }

  public getAllStadium(): Observable<Stadium[]> {
    return this.http.get<Stadium[]>(this.url);
  }
}
