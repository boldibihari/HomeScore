import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'startDate'})
export class StartDatePipe implements PipeTransform {
  transform(startTimestamp: number): Date {
    return new Date(startTimestamp * 1000);
  }
}
