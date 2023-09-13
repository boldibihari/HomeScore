export enum AutomatedHighlightingType {
  Goals = 'goal',
  Foults = 'card'
}

export class AutomatedHighlighting {
  isTurnedOn!: boolean;
  stream!: string;
  type!: AutomatedHighlightingType;
}
