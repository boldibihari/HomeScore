import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Stadium } from 'src/app/models/entities/stadium/stadium';
import { StadiumService } from 'src/app/services/backend/stadium/stadium.service';

@Component({
  selector: 'add-stadium',
  templateUrl: './add-stadium.component.html',
  styleUrls: ['./add-stadium.component.scss'],
})
export class AddStadiumComponent implements OnInit {
  public isLoading: boolean = false;
  public addForm!: UntypedFormGroup;
  public stadium: Stadium = new Stadium();
  public clubId!: number;
  public errorMessage!: string;
  public showError!: boolean;

  constructor(
    private stadiumService: StadiumService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addForm = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required]),
      completed: new UntypedFormControl('', [
        Validators.required,
        Validators.min(1900),
        Validators.max(2023)
      ]),
      capacity: new UntypedFormControl('', [
        Validators.required,
        Validators.min(1000),
        Validators.max(100000)
      ]),
      location: new UntypedFormControl('', [Validators.required])
    });

    this.route.queryParams.subscribe(async (params) => {
      if (params['clubId'] !== null && params['clubId'] !== undefined) {
        this.clubId = params['clubId'];
      }
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

  public addStadium(addFormValue: any): void {
    this.isLoading = true;

    const formValues = { ...addFormValue };
    const stadiumToAdd: Stadium = {
      stadiumId: this.stadium.stadiumId,
      stadiumName: formValues.name,
      completed: formValues.completed,
      capacity: formValues.capacity,
      location: formValues.location,
      clubId: this.clubId
    };

    this.stadiumService.addStadium(this.clubId, stadiumToAdd).subscribe({
      next: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The stadium has been created.'
        });
        this.router.navigate(['clubs/club'], {
          queryParams: { clubId: this.clubId }
        });
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'The addition failed.';
        this.showError = true;
      },
    });
  }
}
