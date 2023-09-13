import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagersComponent } from './managers/managers.component';
import { AddManagerComponent } from './add-manager/add-manager.component';
import { ManagerComponent } from './manager/manager.component';
import { UpdateManagerComponent } from './update-manager/update-manager.component';
import { AdminGuard } from 'src/app/services/guards/admin.guard';

const routes: Routes = [
  {
    path: 'add',
    component: AddManagerComponent, canActivate: [AdminGuard]
  },
  {
    path: 'manager',
    component: ManagerComponent
  },
  {
    path: '',
    component: ManagersComponent
  },
  {
    path: 'update',
    component: UpdateManagerComponent, canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
