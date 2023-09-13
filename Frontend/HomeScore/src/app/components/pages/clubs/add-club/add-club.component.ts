import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Club } from 'src/app/models/entities/club/club';
import { ClubService } from 'src/app/services/backend/club/club.service';

@Component({
  selector: 'app-add-club',
  templateUrl: './add-club.component.html',
  styleUrls: ['./add-club.component.scss'],
})
export class AddClubComponent implements OnInit {
  public isLoading: boolean = false;
  public addForm!: UntypedFormGroup;
  public club: Club = new Club();
  public errorMessage!: string;
  public showError!: boolean;

  constructor(
    private clubService: ClubService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addForm = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required]),
      colour: new UntypedFormControl('', [Validators.required]),
      city: new UntypedFormControl('', [Validators.required]),
      founded: new UntypedFormControl('', [
        Validators.required,
        Validators.min(1600),
        Validators.max(2022)
      ]),
      rating: new UntypedFormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.max(5)
      ])
    });
  }

  public validateControl(controlName: string) {
    return (
      this.addForm.get(controlName)?.invalid &&
      this.addForm.get(controlName)?.touched
    );
  }

  public hasError(controlName: string, errorName: string) {
    return this.addForm.get(controlName)?.hasError(errorName);
  }

  public addClub(addFormValue: any): void {
    this.isLoading = true;

    const formValues = { ...addFormValue };
    const clubToAdd: Club = {
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

    this.clubService.addClub(clubToAdd).subscribe({
      next: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The club has been created.'
        });
        this.router.navigate(['clubs']);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = error.message;
        this.showError = true;
      },
    });
  }
}
