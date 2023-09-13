import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Manager } from 'src/app/models/entities/manager/manager';
import { getBackendUrl } from '../backend-url.def';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  private url: string = getBackendUrl() + 'Manager/';

  constructor(private http: HttpClient) {}

  public addManager(clubId: number, manager: Manager): Observable<any> {
    return this.http.post<any>(this.url + clubId, manager);
  }

  public uploadManagerImage(managerId: number, formData: FormData): Observable<any> {
    return this.http.post<any>(this.url + 'Image/' + managerId, formData);
  }

  public deleteManager(managerId: number): Observable<any> {
    return this.http.delete<any>(this.url + managerId);
  }

  public deleteManagerImage(managerId: number): Observable<any> {
    return this.http.delete<any>(this.url + 'Image/' + managerId);
  }

  public updateManager(managerId: number, manager: Manager): Observable<any> {
    return this.http.put<any>(this.url + managerId, manager);
  }

  public getOneManager(managerId: number): Observable<Manager> {
    return this.http.get<Manager>(this.url + managerId);
  }

  public getManagerImage(managerId: number): Observable<Blob> {
    return this.http.get<Blob>(this.url + 'Image/' + managerId, { responseType: 'blob' as 'json' });
  }

  public getManagerDefaultImage(): Observable<Blob> {
    return this.http.get('assets/images/unknown.png', { responseType: 'blob' });
  }

  public getFlag(code: string): Observable<string> {
    return code !== null
      ? of(`https://flagcdn.com/h24/${code.toLowerCase()}.png`)
      : of('');
  }

  public getAllManager(): Observable<Manager[]> {
    return this.http.get<Manager[]>(this.url);
  }
}
