import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router'
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { AuthService } from '../../security/services/auth.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  latitude: number = 0.00000000;
  longitude: number = 0.00000000;
  token: string = "";
  constructor(
    private inj: Injector,
    private afMessaging: AngularFireMessaging,
    private _matDialog: MatDialog
  ) {

  }
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let authService: AuthService = this.inj.get(AuthService); //authservice is an angular service

    console.log("intercepted request ... ");

    const authToken: string = authService.getToken();

    // cloned headers, updated with the authorization header.
    //const authReq = req.clone({ setHeaders: {'Authorization': `Bearer ${authToken}`}  });


    

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        }/*, (error)=> {console.log("error position:"+error)},{maximumAge: 0,timeout: 100,enableHighAccuracy:true}*/ )
    }
    this.requestPushNotificationsPermission();
    const authReq = req.clone({
      headers: new HttpHeaders({
        'Authorization': `Bearer ${authToken}`,
        'Latitude': this.latitude.toFixed(8) + "",
        'Longitude': this.longitude.toFixed(8) + "",
        'Token': this.token != null ? this.token : ""
      })
    });

    /*forkJoin([this.getLocation(), this.requestPushNotificationsPermission()]).pipe(
      catchError(_ => [])
    ).subscribe(combined => {
      // results[0] is our character
      // results[1] is our character homeworld
      const authReq = req.clone({
        headers: new HttpHeaders({
          'Authorization': `Bearer ${authToken}`,
          'Latitude': this.latitude.toFixed(8) + "",
          'Longitude': this.longitude.toFixed(8) + "",
          'Token': this.token
        })
      });
  
  
  
  
      // send cloned request with header to the next handler.
      return next.handle(authReq)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            let router = this.inj.get(Router);
            console.log("Interceptor error ... " + JSON.stringify(error));
            if (error.status === 401) {
              console.log("Interceptor code 401 ... ");
              //logout users, redirect to login page
              authService.logout();
              //redirect to the signin page or show login modal here
              router.navigate(['auth/login']);
              return throwError(error);
            }
  
            return throwError(error);
  
          })
        );
    });*/
    return next.handle(authReq)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            let router = this.inj.get(Router);
            // console.log("Interceptor error ... " + JSON.stringify(error));
            if (error.status === 401) {
              // console.log("Interceptor code 401 ... ");
              //logout users, redirect to login page
              authService.logout();
              //redirect to the signin page or show login modal here
              router.navigate(['auth/login']);
              return throwError(error);
            }
  
            return throwError(error);
  
          })
        );
    
  }

  getLocation(): Observable<any> {
    return Observable.create(observer => {
      if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            observer.next(position);
            observer.complete();
          },
          (error) => observer.error(error)
        );
      } else {
        observer.error('Unsupported Browser');
      }
    });
  }

  requestPushNotificationsPermission() { // requesting permission
      if (!this.token) {
        this.afMessaging.requestToken // getting tokens
        .subscribe(
          (token) => { // USER-REQUESTED-TOKEN
            // console.log('Permission granted! Save to the server!', token);
            this.token = token;
            this.receiveMessage();
          },
          (error) => {
            console.error(error);
          }
        );
      }
      
  }

  receiveMessage() {
    this.afMessaging.messages.subscribe(
      (message) => {
        console.log('Message received:', message);
      },
      (error) => { console.log("failed to subscribe to firebase messaging") }
    );
  }

  onReceiveMsg(event) {
    // console.log(event.data.notification);
    this.showMessage(event.data.notification.title, event.data.notification.body);
  }

  showMessage(title, msg) {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmTitle = title;
    this.confirmDialogRef.componentInstance.confirmMessage = msg;
    this.confirmDialogRef.componentInstance.confirmButtonTitle = "OK";
    this.confirmDialogRef.componentInstance.cancellButtonTitle = "Annulla";

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result)

        this.confirmDialogRef = null;
    });
  }
}