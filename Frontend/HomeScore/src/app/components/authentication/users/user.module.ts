import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/services/pipes/pipe.module';
import { PrimeNgModule } from '../../main/prime-ng.module';
import { MainModule } from '../../main/main.module';
import { UserComponent } from './user/user.component';
import { UsersComponent } from './users/users.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { UserRoutingModule } from './user-routing.module';
import { FavouritesComponent } from './favourites/favourites.component';

@NgModule({
  declarations: [
    UserComponent,
    FavouritesComponent,
    UsersComponent,
    UpdateUserComponent
  ],
  imports: [
    CommonModule, 
    FormsModule, 
    UserRoutingModule,
    ReactiveFormsModule,
    PipeModule,
    PrimeNgModule,
    MainModule
  ]
})
export class UserModule {}
