import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'age'})
export class AgePipe implements PipeTransform {
  transform(birthdate: Date): number {
    const timeDiff = Math.abs(Date.now() - new Date(birthdate).getTime());
    const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    return age;
  }
}
