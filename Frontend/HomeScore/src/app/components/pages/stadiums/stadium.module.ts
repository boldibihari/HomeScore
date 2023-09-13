import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StadiumRoutingModule } from './stadium-routing.module';
import { AddStadiumComponent } from './add-stadium/add-stadium.component';
import { StadiumComponent } from './stadium/stadium.component';
import { StadiumsComponent } from './stadiums/stadiums.component';
import { UpdateStadiumComponent } from './update-stadium/update-stadium.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../main/prime-ng.module';
import { PipeModule } from 'src/app/services/pipes/pipe.module';
import { MainModule } from '../../main/main.module';

@NgModule({
  declarations: [
    AddStadiumComponent,
    StadiumComponent,
    StadiumsComponent,
    UpdateStadiumComponent
  ],
  imports: [
    CommonModule,
    StadiumRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    PipeModule,
    MainModule
  ]
})
export class StadiumModule { }
