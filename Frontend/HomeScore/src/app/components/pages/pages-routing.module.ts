import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'clubs',
    loadChildren: () =>
      import('./clubs/club.module').then((m) => m.ClubModule)
  },
  {
    path: 'managers',
    loadChildren: () =>
      import('./managers/manager.module').then((m) => m.ManagerModule)
  },
  {
    path: 'players',
    loadChildren: () =>
      import('./players/player.module').then((m) => m.PlayerModule)
  },
  {
    path: 'stadiums',
    loadChildren: () =>
      import('./stadiums/stadium.module').then((m) => m.StadiumModule)
  },
  {
    path: 'matches',
    loadChildren: () =>
      import('./matches/match.module').then((m) => m.MatchModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
