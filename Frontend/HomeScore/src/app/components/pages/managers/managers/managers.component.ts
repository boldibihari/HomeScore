import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { switchMap, forkJoin, map, catchError, of } from 'rxjs';
import { DataView } from 'primeng/dataview';
import { Manager } from 'src/app/models/entities/manager/manager';
import { AuthenticationService } from 'src/app/services/backend/authentication/authentication.service';
import { ManagerService } from 'src/app/services/backend/manager/manager.service';
import { AuthenticationResponse } from 'src/app/models/authentication/authentication-response/authentication-response';

@Component({
  selector: 'managers',
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.scss'],
})
export class ManagersComponent implements OnInit {
  public isLoading: boolean = true;
  public managers: any[] = [];
  public authenticationResponse!: AuthenticationResponse;

  constructor(
    private managerService: ManagerService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.authenticationResponse = this.authenticationService.isUserAuthenticated();
    this.getAllManager();
  }

  public onFilter(event: Event, dv: DataView) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  private getAllManager(): void {
    this.managerService
      .getAllManager()
      .pipe(
        switchMap((managers) => {
          const observables = managers.map((manager) =>
            forkJoin({
              image: this.managerService
                .getManagerImage(manager.managerId)
                .pipe(
                  catchError(() => this.managerService.getManagerDefaultImage())
                ),
              flag: this.managerService.getFlag(manager.countryCode)
            })
          );
          return forkJoin(observables).pipe(
            map((results) => {
              const map = new Map<Manager, { image: SafeUrl; flag: string }>();
              for (let i = 0; i < managers.length; i++) {
                const objectUrl = URL.createObjectURL(results[i].image);
                const safeUrl =
                  this.sanitizer.bypassSecurityTrustUrl(objectUrl);
                map.set(managers[i], { image: safeUrl, flag: results[i].flag });
              }
              return map;
            })
          );
        })
      )
      .subscribe((map) => {
        this.managers = Array.from(map.keys()).map((manager) => {
          return {
            manager: manager,
            image: map.get(manager)?.image,
            flag: map.get(manager)?.flag
          };
        });
        this.isLoading = false;
      });
  }

  public deleteManager(managerId: number): void {
    this.managerService.deleteManager(managerId).subscribe(() => {
      this.getAllManager();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'The manager has been deleted.'
      });
    });
  }
}
