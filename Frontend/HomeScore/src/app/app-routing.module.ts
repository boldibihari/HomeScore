import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/main/home/home.component';

const routes: Routes = [
  { 
    path: 'home', 
    component: HomeComponent 
  },
  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () =>
      import('./components/authentication/authentication.module').then((m) => m.AuthenticationModule)
  },
  {
    path: '',
    loadChildren: () =>
      import('./components/pages/pages.module').then((m) => m.PagesModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
