import { Pipe, PipeTransform } from '@angular/core';
import { PlayerPosition } from 'src/app/models/entities/player/player-position';

@Pipe({name: 'playerPosition'})
export class PlayerPositionPipe implements PipeTransform {
  transform(playerPosition: PlayerPosition): string {
    if (playerPosition === PlayerPosition.Goalkeeper) {
      return 'Goalkeeper';
    }
    else if (playerPosition === PlayerPosition.Defender) {
      return 'Defender';
    }
    else if (playerPosition === PlayerPosition.Midfielder) {
      return 'Midfielder';
    }
    else {
      return 'Forward';
    }
  }
}
