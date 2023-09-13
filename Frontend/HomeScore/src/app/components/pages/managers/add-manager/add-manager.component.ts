import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Manager } from 'src/app/models/entities/manager/manager';
import { ManagerService } from 'src/app/services/backend/manager/manager.service';

@Component({
  selector: 'add-manager',
  templateUrl: './add-manager.component.html',
  styleUrls: ['./add-manager.component.scss'],
})
export class AddManagerComponent implements OnInit {
  public isLoading: boolean = false;
  public addForm!: UntypedFormGroup;
  public manager: Manager = new Manager();
  public clubId!: number;
  public errorMessage!: string;
  public showError!: boolean;

  constructor(
    private managerService: ManagerService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addForm = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required]),
      code: new UntypedFormControl('', [
        Validators.required,
        Validators.maxLength(5)
      ]),
      country: new UntypedFormControl('', [Validators.required]),
      birthdate: new UntypedFormControl('', [Validators.required]),
      formation: new UntypedFormControl('', [Validators.required]),
      year: new UntypedFormControl('', [
        Validators.required,
        Validators.min(1600),
        Validators.max(2022)
      ]),
      championship: new UntypedFormControl(false, [Validators.required])
    });

    this.route.queryParams.subscribe((params) => {
      if (params['clubId'] !== null && params['clubId'] !== undefined) {
        this.clubId = params['clubId'];
        console.log(this.clubId);
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

  public addManager(addFormValue: any): void {
    this.isLoading = true;

    const formValues = { ...addFormValue };
    const managerToAdd: Manager = {
      managerId: this.manager.managerId,
      managerName: formValues.name,
      managerCountry: formValues.country,
      managerBirthdate: formValues.birthdate,
      managerStartYear: formValues.year,
      countryCode: formValues.code,
      preferredFormation: formValues.formation,
      wonChampionship: formValues.championship,
      clubId: this.clubId
    };

    this.managerService.addManager(this.clubId, managerToAdd).subscribe({
      next: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The manager has been created.'
        });
        this.router.navigate(['clubs/club'], {
          queryParams: { clubId: this.clubId }
        });
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'The addition failed.';
        this.showError = true;
      }
    });
  }
}
