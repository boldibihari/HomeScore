import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { UsersComponent } from './users/users.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { UserGuard } from 'src/app/services/guards/user.guard';
import { AdminGuard } from 'src/app/services/guards/admin.guard';

const routes: Routes = [
  {
    path: 'user',
    component: UserComponent, canActivate: [UserGuard]
  },
  {
    path: 'favourites',
    component: FavouritesComponent, canActivate: [UserGuard]
  },
  {
    path: '',
    component: UsersComponent, canActivate: [AdminGuard]
  },
  {
    path: 'update',
    component: UpdateUserComponent, canActivate: [UserGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
