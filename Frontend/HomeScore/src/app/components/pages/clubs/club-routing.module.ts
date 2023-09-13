import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from 'src/app/services/guards/admin.guard';
import { AddClubComponent } from './add-club/add-club.component';
import { ClubComponent } from './club/club.component';
import { ClubsComponent } from './clubs/clubs.component';
import { UpdateClubComponent } from './update-club/update-club.component';

const routes: Routes = [
  {
    path: 'add',
    component: AddClubComponent, canActivate: [AdminGuard]
  },
  {
    path: 'club',
    component: ClubComponent
  },
  {
    path: '',
    component: ClubsComponent
  },
  {
    path: 'update',
    component: UpdateClubComponent, canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClubRoutingModule { }
