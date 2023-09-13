import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityPipe } from './pipes/city.pipe';
import { AgePipe } from './pipes/age.pipe';
import { ColourPipe } from './pipes/colour.pipe';
import { PlayerPositionPipe } from './pipes/player-position.pipe';
import { PrefferedFootPipe } from './pipes/preffered-foot.pipe';
import { StartDatePipe } from './pipes/start-date.pipe';

@NgModule({
  declarations: [
    AgePipe,
    PlayerPositionPipe,
    PrefferedFootPipe,
    CityPipe,
    ColourPipe,
    StartDatePipe
  ],
  imports: [CommonModule],
  exports: [
    AgePipe,
    PlayerPositionPipe,
    PrefferedFootPipe,
    CityPipe,
    ColourPipe,
    StartDatePipe
  ]
})
export class PipeModule { }
