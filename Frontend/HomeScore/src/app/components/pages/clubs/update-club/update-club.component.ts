import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Club } from 'src/app/models/entities/club/club';
import { ClubService } from 'src/app/services/backend/club/club.service';

@Component({
  selector: 'update-club',
  templateUrl: './update-club.component.html',
  styleUrls: ['./update-club.component.scss'],
})
export class UpdateClubComponent implements OnInit {
  public isLoading: boolean = false;
  public updateForm!: UntypedFormGroup;
  public club!: Club;
  public errorMessage!: string;
  public showError!: boolean;

  constructor(
    private clubService: ClubService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateForm = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required]),
      colour: new UntypedFormControl('', [Validators.required]),
      city: new UntypedFormControl('', [Validators.required]),
      founded: new UntypedFormControl('', [
        Validators.required,
        Validators.min(1600),
        Validators.max(2022),
      ]),
      rating: new UntypedFormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(5),
      ]),
    });

    this.route.queryParams.subscribe((params) => {
      if (params['clubId'] !== null && params['clubId'] !== undefined) {
        this.clubService
          .getOneClub(params['clubId'])
          .subscribe((club: Club) => {
            this.club = club;
            this.setFormData(this.club);
          });
      }
    });
  }

  private setFormData(club: Club) {
    this.updateForm.patchValue({
      name: club.clubName,
      colour: club.clubColour,
      city: club.clubCity,
      founded: club.clubFounded,
      rating: club.clubRating,
    });
  }

  public validateControl(controlName: string) {
    return (
      this.updateForm.get(controlName)?.invalid &&
      this.updateForm.get(controlName)?.touched
    );
  }

  public hasError(controlName: string, errorName: string) {
    return this.updateForm.get(controlName)?.hasError(errorName);
  }

  public updateClub(updateFormValue: any): void {
    this.isLoading = true;

    const formValues = { ...updateFormValue };
    const clubToUpdate: Club = {
      clubId: this.club.clubId,
      clubName: formValues.name,
      clubColour: formValues.colour,
      clubCity: formValues.city,
      clubFounded: formValues.founded,
      clubRating: formValues.rating,
      players: this.club.players,
      stadium: this.club.stadium,
      manager: this.club.manager,
    };

    this.clubService.updateClub(this.club.clubId, clubToUpdate).subscribe({
      next: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The club has been modified.',
        });
        this.router.navigate(['clubs/club'], {
          queryParams: { clubId: this.club.clubId },
        });
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = error.message;
        this.showError = true;
      },
    });
  }
}
