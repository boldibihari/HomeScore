import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatchComponent } from './match/match.component';
import { MatchRoutingModule } from './match-routing.module';
import { PrimeNgModule } from '../../main/prime-ng.module';
import { PipeModule } from 'src/app/services/pipes/pipe.module';
import { AutomatedHighlightingComponent } from './automated-highlighting/automated-highlighting.component';
import { MainModule } from '../../main/main.module';
import { VideosComponent } from './videos/videos.component';

@NgModule({
  declarations: [
    MatchComponent,
    AutomatedHighlightingComponent,
    VideosComponent
  ],
  imports: [
    CommonModule,
    MatchRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    PipeModule,
    MainModule
  ]
})
export class MatchModule { }
