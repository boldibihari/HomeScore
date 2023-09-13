import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPlayerComponent } from './add-player/add-player.component';
import { PlayersComponent } from './players/players.component';
import { UpdatePlayerComponent } from './update-player/update-player.component';
import { PlayerComponent } from './player/player.component';
import { AdminGuard } from 'src/app/services/guards/admin.guard';

const routes: Routes = [
  {
    path: 'add',
    component: AddPlayerComponent, canActivate: [AdminGuard]
  },
  {
    path: 'player',
    component: PlayerComponent
  },
  {
    path: '',
    component: PlayersComponent
  },
  {
    path: 'update',
    component: UpdatePlayerComponent, canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayerRoutingModule { }
