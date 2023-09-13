import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStadiumComponent } from './add-stadium/add-stadium.component';
import { StadiumComponent } from './stadium/stadium.component';
import { StadiumsComponent } from './stadiums/stadiums.component';
import { UpdateStadiumComponent } from './update-stadium/update-stadium.component';
import { AdminGuard } from 'src/app/services/guards/admin.guard';

const routes: Routes = [
  {
    path: 'add',
    component: AddStadiumComponent, canActivate: [AdminGuard]
  },
  {
    path: 'stadium',
    component: StadiumComponent
  },
  {
    path: '',
    component: StadiumsComponent
  },
  {
    path: 'update',
    component: UpdateStadiumComponent, canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StadiumRoutingModule { }
