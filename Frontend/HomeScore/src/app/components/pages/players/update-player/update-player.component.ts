import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Player } from 'src/app/models/entities/player/player';
import { PlayerPosition } from 'src/app/models/entities/player/player-position';
import { PreferredFoot } from 'src/app/models/entities/player/preferred-foot';
import { PlayerService } from 'src/app/services/backend/player/player.service';

@Component({
  selector: 'update-player',
  templateUrl: './update-player.component.html',
  styleUrls: ['./update-player.component.scss'],
})
export class UpdatePlayerComponent implements OnInit {
  public isLoading: boolean = false;
  public updateForm!: UntypedFormGroup;
  public player!: Player;
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
    this.updateForm = new UntypedFormGroup({
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
      club: new UntypedFormControl('', [Validators.required]),
      captain: new UntypedFormControl('', [Validators.required])
    });

    this.route.queryParams.subscribe((params) => {
      if (params['playerId'] !== null && params['playerId'] !== undefined) {
        this.playerService
          .getOnePlayer(params['playerId'])
          .subscribe((player: Player) => {
            this.player = player;
            this.setFormData(this.player);
            console.log(this.player);
          });
      }
    });
  }

  private setFormData(player: Player) {
    this.updateForm.patchValue({
      name: player.playerName,
      code: player.countryCode,
      country: player.playerCountry,
      birthdate: new Date(player.playerBirthdate),
      position: player.playerPosition,
      number: player.shirtNumber,
      height: player.height,
      foot: player.preferredFoot,
      value: player.playerValue,
      club: player.clubId,
      captain: player.captain
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

  public updatePlayer(updateFormValue: any): void {
    this.isLoading = true;

    const formValues = { ...updateFormValue };
    const playerToUpdate: Player = {
      playerId: this.player.playerId,
      playerName: formValues.name,
      countryCode: formValues.code,
      playerCountry: formValues.country,
      playerBirthdate: formValues.birthdate,
      playerPosition: formValues.position,
      shirtNumber: formValues.number,
      height: formValues.height,
      preferredFoot: formValues.foot,
      playerValue: formValues.value,
      captain: formValues.captain,
      clubId: this.player.clubId
    };

    this.playerService
      .updatePlayer(this.player.playerId, playerToUpdate)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The player has been modified.',
          });
          this.router.navigate(['players/player'], {
            queryParams: {
              playerId: this.player.playerId,
              clubId: this.player.clubId,
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
