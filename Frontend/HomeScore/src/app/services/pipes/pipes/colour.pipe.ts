import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'colour' })
export class ColourPipe implements PipeTransform {
  transform(clubColour: string, styleType: string = 'primaryColour'): string {
    switch (clubColour) {
      case 'green-white':
        return styleType === 'primaryColour' ? 'bg-green-400' : 'bg-white';
      case 'red-blue':
        return styleType === 'primaryColour' ? 'bg-red-400' : 'bg-blue';
      case 'blue-yellow':
        return styleType === 'primaryColour' ? 'bg-blue-400' : 'bg-yellow';
      case 'red-black':
        return styleType === 'primaryColour' ? 'bg-red-400' : 'bg-black';
      case 'purple-white':
        return styleType === 'primaryColour' ? 'bg-purple-400' : 'bg-white';
      case 'red-white':
        return styleType === 'primaryColour' ? 'bg-red-400' : 'bg-white';
      case 'blue-white':
        return styleType === 'primaryColour' ? 'bg-blue-400' : 'bg-white';
      default:
        return '';
    }
  }
}
