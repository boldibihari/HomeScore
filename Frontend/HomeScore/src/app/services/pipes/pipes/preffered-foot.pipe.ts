import { Pipe, PipeTransform } from '@angular/core';
import { PreferredFoot } from 'src/app/models/entities/player/preferred-foot';

@Pipe({name: 'prefferedFoot'})
export class PrefferedFootPipe implements PipeTransform {
  transform(preferredFoot: PreferredFoot): string {
    if (preferredFoot === PreferredFoot.Left) {
      return "Left";
    }
    else if (preferredFoot === PreferredFoot.Right) {
      return "Right";
    }
    return "Both";
  }
}
