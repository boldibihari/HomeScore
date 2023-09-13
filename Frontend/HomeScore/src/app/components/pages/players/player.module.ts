import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerRoutingModule } from './player-routing.module';
import { AddPlayerComponent } from './add-player/add-player.component';
import { PlayerComponent } from './player/player.component';
import { PlayersComponent } from './players/players.component';
import { UpdatePlayerComponent } from './update-player/update-player.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/services/pipes/pipe.module';
import { PrimeNgModule } from '../../main/prime-ng.module';
import { MainModule } from '../../main/main.module';

@NgModule({
  declarations: [
    AddPlayerComponent,
    PlayerComponent,
    PlayersComponent,
    UpdatePlayerComponent
  ],
  imports: [
    CommonModule,
    PlayerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    PipeModule,
    MainModule
  ]
})
export class PlayerModule { }
