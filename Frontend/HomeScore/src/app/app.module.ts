import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './components/pages/pages.module';
import { MainModule } from './components/main/main.module';
import { PrimeNgModule } from './components/main/prime-ng.module';
import { AuthenticationModule } from './components/authentication/authentication.module';
import { ErrorHandlerService } from './services/interceptor/error-handler.service';
import { MessageService } from 'primeng/api';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AuthenticationModule,
    PagesModule,
    MainModule,
    PrimeNgModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:7241'],
        disallowedRoutes: []
      }
    })
  ],
  providers: [ 
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerService,
      multi: true
    }
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
