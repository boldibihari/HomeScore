import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'city'})
export class CityPipe implements PipeTransform {
  transform(address: string): string {
    const parts = address.split(',');
    return parts[0].trim();
  }
}
