import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Manager } from 'src/app/models/entities/manager/manager';
import { ManagerService } from 'src/app/services/backend/manager/manager.service';

@Component({
  selector: 'update-manager',
  templateUrl: './update-manager.component.html',
  styleUrls: ['./update-manager.component.scss'],
})
export class UpdateManagerComponent implements OnInit {
  public isLoading: boolean = false;
  public updateForm!: UntypedFormGroup;
  public manager!: Manager;
  public errorMessage!: string;
  public showError!: boolean;

  constructor(
    private managerService: ManagerService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateForm = new UntypedFormGroup({
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
      championship: new UntypedFormControl('', [Validators.required])
    });

    this.route.queryParams.subscribe((params) => {
      if (params['managerId'] !== null && params['managerId'] !== undefined) {
        this.managerService
          .getOneManager(params['managerId'])
          .subscribe((manager: Manager) => {
            this.manager = manager;
            this.setFormData(this.manager);
          });
      }
    });
  }

  private setFormData(manager: Manager) {
    this.updateForm.patchValue({
      name: manager.managerName,
      code: manager.countryCode,
      country: manager.managerCountry,
      birthdate: new Date(manager.managerBirthdate),
      formation: manager.preferredFormation,
      year: manager.managerStartYear,
      championship: manager.wonChampionship
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

  public updateManager(updateFormValue: any): void {
    this.isLoading = true;

    const formValues = { ...updateFormValue };
    const managerToUpdate: Manager = {
      managerId: this.manager.managerId,
      managerName: formValues.name,
      managerCountry: formValues.country,
      managerBirthdate: formValues.birthdate,
      managerStartYear: formValues.year,
      countryCode: formValues.code,
      preferredFormation: formValues.formation,
      wonChampionship: formValues.championship,
      clubId: this.manager.clubId,
    };

    this.managerService
      .updateManager(this.manager.managerId, managerToUpdate)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The manager has been modified.'
          });
          this.router.navigate(['managers/manager'], {
            queryParams: {
              managerId: this.manager.managerId,
              clubId: this.manager.clubId
            }
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
