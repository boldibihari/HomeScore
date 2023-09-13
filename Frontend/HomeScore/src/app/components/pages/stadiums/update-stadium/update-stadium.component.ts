import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Stadium } from 'src/app/models/entities/stadium/stadium';
import { StadiumService } from 'src/app/services/backend/stadium/stadium.service';

@Component({
  selector: 'update-stadium',
  templateUrl: './update-stadium.component.html',
  styleUrls: ['./update-stadium.component.scss'],
})
export class UpdateStadiumComponent implements OnInit {
  public isLoading: boolean = false;
  public updateForm!: UntypedFormGroup;
  public stadium!: Stadium;
  public errorMessage!: string;
  public showError!: boolean;

  constructor(
    private stadiumService: StadiumService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateForm = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required]),
      completed: new UntypedFormControl('', [
        Validators.required,
        Validators.min(1800),
        Validators.max(2023)
      ]),
      capacity: new UntypedFormControl('', [
        Validators.required,
        Validators.min(1000),
        Validators.max(100000)
      ]),
      location: new UntypedFormControl('', [Validators.required])
    });

    this.route.queryParams.subscribe((params) => {
      if (params['stadiumId'] !== null && params['stadiumId'] !== undefined) {
        this.stadiumService
          .getOneStadium(params['stadiumId'])
          .subscribe((stadium: Stadium) => {
            this.stadium = stadium;
            this.setFormData(this.stadium);
          });
      }
    });
  }

  private setFormData(stadium: Stadium) {
    this.updateForm.patchValue({
      name: stadium.stadiumName,
      completed: stadium.completed,
      capacity: stadium.capacity,
      location: stadium.location
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

  public updateStadium(updateFormValue: any): void {
    this.isLoading = true;

    const formValues = { ...updateFormValue };
    const stadiumToUpdate: Stadium = {
      stadiumId: this.stadium.stadiumId,
      stadiumName: formValues.name,
      completed: formValues.completed,
      capacity: formValues.capacity,
      location: formValues.location,
      clubId: this.stadium.clubId
    };

    this.stadiumService
      .updateStadium(this.stadium.stadiumId, stadiumToUpdate)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The stadium has been modified.'
          });
          this.router.navigate(['stadiums/stadium'], {
            queryParams: {
              stadiumId: this.stadium.stadiumId,
              clubId: this.stadium.clubId
            },
          });
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'The modification failed.';
          this.showError = true;
        }
      });
  }
}
