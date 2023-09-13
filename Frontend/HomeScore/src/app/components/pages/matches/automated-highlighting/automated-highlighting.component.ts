import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AutomatedHighlighting } from 'src/app/models/authentication/user/automated-highlighting';
import { UserService } from 'src/app/services/backend/user/user.service';

@Component({
  selector: 'automated-highlighting',
  templateUrl: './automated-highlighting.component.html',
  styleUrls: ['./automated-highlighting.component.scss']
})
export class AutomatedHighlightingComponent implements OnInit {
  public automatedHighlightingForm!: UntypedFormGroup;
  public activeIndex = 0;

  public steps: any[] = [
    { label: 'Information' },
    { label: 'Add stream url' },
    { label: 'Choose the type' }
  ];

  public types = [
    { name: 'Goals', value: 'goal'},
    { name: 'Foults', value: 'card'}
  ];

  constructor(private userService: UserService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.automatedHighlightingForm = new UntypedFormGroup({
      link: new UntypedFormControl("", [Validators.required]),
      type: new UntypedFormControl("", [Validators.required])
    })
  }

  public validateControl(controlName: string) {
    return (
      this.automatedHighlightingForm.get(controlName)?.invalid &&
      this.automatedHighlightingForm.get(controlName)?.touched
    );
  }

  public hasError(controlName: string, errorName: string) {
    return this.automatedHighlightingForm.get(controlName)?.hasError(errorName);
  }

  public onActiveIndexChange(event: any) {
    this.activeIndex = event;
  }

  public addAutomatedHighlighting(streamForm: any) {
    this.userService.deleteAutomatedHighlighting();
    const formValues = {...streamForm};

    const automatedHighlighting: AutomatedHighlighting = {
      isTurnedOn: true,
      stream: formValues.link,
      type: formValues.type.value
    }

    this.userService.addAutomatedHighlighting(automatedHighlighting);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'The automated highlighting turned on.'
    });
  }  
}
