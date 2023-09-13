import { Component, OnInit } from '@angular/core';
import { forkJoin, map, switchMap } from 'rxjs';
import { Player } from 'src/app/models/entities/player/player';
import { PlayerService } from 'src/app/services/backend/player/player.service';
import { DataView } from 'primeng/dataview';
import { AuthenticationService } from 'src/app/services/backend/authentication/authentication.service';
import { MessageService } from 'primeng/api';
import { AuthenticationResponse } from 'src/app/models/authentication/authentication-response/authentication-response';

@Component({
  selector: 'players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
})
export class PlayersComponent implements OnInit {
  public isLoading: boolean = true;
  public players: any = [];
  public authenticationResponse!: AuthenticationResponse;

  constructor(
    private playerService: PlayerService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.authenticationResponse = this.authenticationService.isUserAuthenticated();
    this.getAllPlayer();
  }

  public deletePlayer(playerId: number): void {
    this.playerService.deletePlayer(playerId).subscribe(() => {
      this.getAllPlayer();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'The player has been deleted.'
      });
    });
  }

  public onFilter(event: Event, dv: DataView) {
    console.log('VALUE:');
    console.log((event.target as HTMLInputElement).value);
    dv.filter((event.target as HTMLInputElement).value);
  }

  private getAllPlayer(): void {
    this.playerService
      .getAllPlayer()
      .pipe(
        switchMap((players) => {
          const observables = players.map((player) =>
            this.playerService.getFlag(player.countryCode)
          );
          return forkJoin(observables).pipe(
            map((flags) => {
              const map = new Map<Player, string>();
              for (let i = 0; i < players.length; i++) {
                map.set(players[i], flags[i]);
              }
              return map;
            })
          );
        })
      )
      .subscribe((map) => {
        this.players = Array.from(map.keys()).map((player) => {
          return {
            player: player,
            flag: map.get(player)
          };
        });
        this.isLoading = false;
      });
  }
}
