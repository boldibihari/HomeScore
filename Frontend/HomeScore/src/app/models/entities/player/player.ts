import { PlayerPosition } from './player-position';
import { PreferredFoot } from './preferred-foot';

export class Player {
  playerId!: number;
  playerName!: string;
  countryCode!: string;
  playerCountry!: string;
  playerBirthdate: Date = new Date();
  playerPosition!: PlayerPosition;
  shirtNumber!: number;
  height!: number;
  preferredFoot!: PreferredFoot;
  playerValue!: number;
  captain!: boolean;
  clubId!: number;
}
