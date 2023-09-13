import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = this.handleError(error);
        console.log(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private handleError(error: HttpErrorResponse): string {
    if(error.status === 404){
      return this.handleNotFound(error);
    }
    else if(error.status === 400){
      return this.handleBadRequest(error);
    }
    else if(error.status === 401) {
      return this.handleUnauthorized(error);
    }
    else if(error.status === 403) {
      return this.handleForbidden(error);
    }
    else if(error.status === 500) {
      return this.handleInternalServerError(error);
    }
    else {
      return 'Bad request!';
    }
  }

  private handleForbidden(error: HttpErrorResponse): string {
    this.router.navigate(['/forbidden'], { queryParams: { returnUrl: this.router.url }});
    return 'Forbidden: ' + error.message;
  }

  private handleNotFound(error: HttpErrorResponse): string {
    this.router.navigate(['/404']);
    return error.message;
  }

  private handleUnauthorized(error: HttpErrorResponse): string {
    if(this.router.url === '/login') {
      return error.error.error;
    }
    else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});
      return error.message;
    }
  }

  private handleBadRequest(error: HttpErrorResponse): string {
    if(this.router.url === '/registration' || this.router.url.startsWith('/resetpassword')){
      return error.error.message;
    }
    else{
      return error.error ? error.error.message : error.error.message;
    }
  }

  private handleInternalServerError(error: HttpErrorResponse): string {
    return error.error;
  }
}
