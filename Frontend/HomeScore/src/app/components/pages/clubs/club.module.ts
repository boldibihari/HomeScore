import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddClubComponent } from './add-club/add-club.component';
import { ClubRoutingModule } from './club-routing.module';
import { ClubComponent } from './club/club.component';
import { ClubsComponent } from './clubs/clubs.component';
import { UpdateClubComponent } from './update-club/update-club.component';
import { PipeModule } from 'src/app/services/pipes/pipe.module';
import { PrimeNgModule } from '../../main/prime-ng.module';
import { MainModule } from '../../main/main.module';

@NgModule({
  declarations: [
    AddClubComponent,
    ClubComponent,
    ClubsComponent,
    UpdateClubComponent
  ],
  imports: [
    CommonModule, 
    ClubRoutingModule, 
    FormsModule, 
    ReactiveFormsModule,
    PipeModule,
    PrimeNgModule,
    MainModule
  ]
})
export class ClubModule {}
