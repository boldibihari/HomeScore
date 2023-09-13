import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Player } from 'src/app/models/entities/player/player';
import { PlayerPosition } from 'src/app/models/entities/player/player-position';
import { PreferredFoot } from 'src/app/models/entities/player/preferred-foot';
import { PlayerService } from 'src/app/services/backend/player/player.service';

@Component({
  selector: 'add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.scss'],
})
export class AddPlayerComponent implements OnInit {
  public isLoading: boolean = false;
  public addForm!: UntypedFormGroup;
  public player: Player = new Player();
  public clubId!: number;
  public errorMessage!: string;
  public showError!: boolean;
  public positions: any[] = [
    { label: 'Goalkeeper', value: PlayerPosition.Goalkeeper },
    { label: 'Defender', value: PlayerPosition.Defender },
    { label: 'Midfielder', value: PlayerPosition.Midfielder },
    { label: 'Forward', value: PlayerPosition.Forward },
  ];
  public foots: any[] = [
    { label: 'Left', value: PreferredFoot.Left },
    { label: 'Right', value: PreferredFoot.Right },
    { label: 'Both', value: PreferredFoot.Both },
  ];

  constructor(
    private playerService: PlayerService,
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
      position: new UntypedFormControl('', [Validators.required]),
      number: new UntypedFormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(99)
      ]),
      height: new UntypedFormControl('', [Validators.required]),
      foot: new UntypedFormControl('', [Validators.required]),
      value: new UntypedFormControl('', [
        Validators.required,
        Validators.min(0)
      ]),
      captain: new UntypedFormControl(false, [Validators.required])
    });

    this.route.queryParams.subscribe((params) => {
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

  public addPlayer(addFormValue: any): void {
    this.isLoading = true;

    const formValues = { ...addFormValue };
    const playerToAdd: Player = {
      playerId: this.generatePlayerId(),
      playerName: formValues.name,
      countryCode: formValues.code,
      playerCountry: formValues.country,
      playerBirthdate: formValues.birthdate,
      playerPosition: formValues.position.value,
      shirtNumber: formValues.number,
      height: formValues.height,
      preferredFoot: formValues.foot.value,
      playerValue: formValues.value,
      captain: formValues.captain,
      clubId: this.clubId,
    };

    this.playerService.addPlayer(this.clubId, playerToAdd).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The player has been created.'
        });
        this.router.navigate(['clubs/club'], {
          queryParams: { clubId: this.clubId },
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'The addition failed.';
        this.showError = true;
      }
    });
  }

  public generatePlayerId(): number {
    let ids: number[] = [];
    let observable: Observable<number[]> = this.playerService.getAllPlayerId();
    observable.subscribe((x) => {
      x.forEach((x) => { ids.push(x); });
    });
    let id: number = 0;
    do {
      id = Math.floor(Math.random() * (999999 - 10000 + 1)) + 10000;
    } while (ids.includes(id));
    return id;
  }
}
