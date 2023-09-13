import { Manager } from '../manager/manager';
import { Player } from '../player/player';
import { Stadium } from '../stadium/stadium';

export class Club {
  clubId!: number;
  clubName!: string;
  clubColour!: string;
  clubCity!: string;
  clubFounded!: number;
  clubRating!: number;
  players!: Array<Player>;
  stadium!: Stadium | null;
  manager!: Manager | null;
}
