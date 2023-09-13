import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { PrimeNgModule } from './prime-ng.module';
import { LoaderComponent } from './loader/loader.component';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LoaderComponent,
    HomeComponent,
    SearchComponent,
  ],
  imports: [
    PrimeNgModule, 
    CommonModule
  ],
  exports: [
    HeaderComponent, 
    LoaderComponent,
    SearchComponent
  ]
})
export class MainModule {}
