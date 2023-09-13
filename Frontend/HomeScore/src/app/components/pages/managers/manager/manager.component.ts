import { Component, OnInit } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Club } from 'src/app/models/entities/club/club';
import { Manager } from 'src/app/models/entities/manager/manager';
import { ClubService } from 'src/app/services/backend/club/club.service';
import { ManagerService } from 'src/app/services/backend/manager/manager.service';

@Component({
  selector: 'manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
})
export class ManagerComponent implements OnInit {
  public isLoading: boolean = true;
  public manager!: Manager;
  public managerImage!: SafeUrl | null;
  public club!: Club;
  public clubImage!: SafeUrl | null;

  constructor(
    private managerService: ManagerService,
    private clubService: ClubService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (
        params['managerId'] !== null &&
        params['managerId'] !== undefined &&
        params['clubId'] !== null &&
        params['clubId'] !== undefined
      ) {
        this.getOneManager(params['managerId'], params['clubId']);
      }
    });
  }

  private getOneManager(managerId: number, clubId: number): void {
    this.managerService
      .getOneManager(managerId)
      .subscribe((manager: Manager) => {
        this.manager = manager;
        this.getManagerImage(managerId);
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

  private getClubImage(clubId: number): void {
    this.clubService.getClubImage(clubId).subscribe({
      next: (image: Blob) => {
        let data = image;
        let objectURL = URL.createObjectURL(data);
        this.clubImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: () => {
        this.clubImage = null;
      },
    });
  }

  public getFlag(code: string): string {
    if (code !== null) {
      return 'https://flagcdn.com/h24/' + code.toLowerCase() + '.png';
    }
    return '';
  }
}
