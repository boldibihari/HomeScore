import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Club } from 'src/app/models/entities/club/club';
import { Player } from 'src/app/models/entities/player/player';
import { ClubService } from 'src/app/services/backend/club/club.service';
import { PlayerService } from 'src/app/services/backend/player/player.service';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  public isLoading: boolean = true;
  public player!: Player;
  public club!: Club;
  public playerImage!: SafeUrl;
  public clubImage!: SafeUrl;

  constructor(
    private playerService: PlayerService,
    private clubService: ClubService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      if (
        params['playerId'] !== null &&
        params['playerId'] !== undefined &&
        params['clubId'] !== null &&
        params['clubId'] !== undefined
      ) {
        this.getOnePlayer(params['playerId'], params['clubId']);
      }
    });
  }

  private getOnePlayer(playerId: number, clubId: number): void {
    this.playerService.getOnePlayer(playerId).subscribe((player: Player) => {
      this.player = player;
      this.getOneClub(clubId);
      this.getPlayerImage(playerId);
      this.getClubImage(clubId);

      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    });
  }

  private getOneClub(clubId: number): void {
    this.clubService.getOneClub(clubId).subscribe((club: Club) => {
      this.club = club;
    });
  }

  private getPlayerImage(playerId: number): void {
    let data;
    this.playerService.getPlayerImage(playerId).subscribe((image: Blob) => {
      data = image;
      if (data !== null) {
        let objectURL = URL.createObjectURL(data);
        this.playerImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }
    });
  }

  private getClubImage(clubId: number): void {
    let data;
    this.clubService.getClubImage(clubId).subscribe((image: Blob) => {
      data = image;
      if (data != null) {
        let objectURL = URL.createObjectURL(data);
        this.clubImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }
    });
  }

  public getFlag(code: string): string {
    if (code !== null) {
      return 'https://flagcdn.com/h24/' + code.toLowerCase() + '.png';
    }
    return '';
  }
}
