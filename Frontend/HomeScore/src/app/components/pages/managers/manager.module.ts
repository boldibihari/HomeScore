import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerRoutingModule } from './manager-routing.module';
import { ManagersComponent } from './managers/managers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/services/pipes/pipe.module';
import { PrimeNgModule } from '../../main/prime-ng.module';
import { ManagerComponent } from './manager/manager.component';
import { AddManagerComponent } from './add-manager/add-manager.component';
import { UpdateManagerComponent } from './update-manager/update-manager.component';
import { MainModule } from '../../main/main.module';

@NgModule({
  declarations: [
    AddManagerComponent,
    ManagerComponent,
    ManagersComponent,
    ManagerComponent,
    AddManagerComponent,
    UpdateManagerComponent,
    UpdateManagerComponent
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
    PrimeNgModule,
    MainModule
  ]
})
export class ManagerModule { }
