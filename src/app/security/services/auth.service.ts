

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';


import { map, catchError } from 'rxjs/operators';


import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, throwError } from 'rxjs';
import { Config } from 'app/app.config';
import { User } from 'app/models/user.model';

const jwtHelper = new JwtHelperService();

@Injectable()
export class AuthService {


  private loginUrl: string = Config.prop.apiEndpoint + 'users/login.php';
  private headers: HttpHeaders = new HttpHeaders();
  private loggedUser: User;

  constructor(private http: HttpClient) {
    this.headers = this.headers.set("Content-Type", "application/json");
    this.headers = this.headers.set('Accept', 'application/json');
  }



  login(username: string, password: string, recaptcha: string, rememberMe: boolean): Observable<boolean> {

    return this.http.post(this.loginUrl, { username: username, password: password, recaptcha: recaptcha }, { headers: this.headers, observe: 'response' })
      .pipe(
        map((response: HttpResponse<any>) => {
          // login successful if there's a jwt token in the response
          // console.log(response.body);
          this.loggedUser = response.body;
          // console.log(this.loggedUser);
          let token = this.loggedUser.token;
          let superuser = this.loggedUser.superuser;
          //let refreshToken = response.body.refreshToken;
          //this.loggedUser.username = "";
          this.loggedUser.password = "";

          if (token) {
            // store username and jwt token in local storage to keep user logged in between page refreshes
            if (rememberMe) {
              localStorage.setItem('loggedUser', JSON.stringify(this.loggedUser));
            }
            else {
              sessionStorage.setItem('loggedUser', JSON.stringify(this.loggedUser));
            }


            // return true to indicate successful login
            return true;
          } else {
            // return false to indicate failed login
            return false;
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    localStorage.removeItem('loggedUser');
    sessionStorage.removeItem('loggedUser');
  }

  forgot(email): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(Config.prop.apiEndpoint + "users/resetRequest.php?email=" + email)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);

    });
  }


  resetPassword(token, email, password): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(Config.prop.apiEndpoint + "users/resetPassword.php?token=" + token + "&email=" + email + "&password=" + password)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }


  getLoggedUser(): User {
    let loggedUser;
    if (localStorage.getItem('loggedUser')) {
      loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    }
    if (sessionStorage.getItem('loggedUser')) {
      loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
    }
    //return this.loggedUser;
    return loggedUser;
  }

  setLoggedUser(user:User) {
    if (localStorage.getItem('loggedUser')) {
      localStorage.setItem('loggedUser', JSON.stringify(user));
      this.loggedUser = user
    }
    if (sessionStorage.getItem('loggedUser')) {
      sessionStorage.setItem('loggedUser', JSON.stringify(user));
    }
    this.loggedUser = user;
  }

  getToken(): string {
    let loggedUser;
    if (localStorage.getItem('loggedUser')) {
      loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    }
    if (sessionStorage.getItem('loggedUser')) {
      loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
    }
    let token = loggedUser && loggedUser.token;
    return token ? token : "";
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    // Check whether the token is expired or not
    // return true or false
    return token != "" ? !jwtHelper.isTokenExpired(token) : false;
  }

  isSuperUser(): boolean {
    let loggedUser;
    if (localStorage.getItem('loggedUser')) {
      loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    }
    if (sessionStorage.getItem('loggedUser')) {
      loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
    }
    return loggedUser.superuser;
  }

  isManager(): boolean {
    let isManager: boolean = false;
    let loggedUser:User;
    if (localStorage.getItem('loggedUser')) {
      loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    }
    if (sessionStorage.getItem('loggedUser')) {
      loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
    }
    loggedUser.role_user_assoc.forEach((roleassoc)=> {
      if (roleassoc.role.acronym == "MANAGER") {
        isManager = true;
      }
    })
    return isManager;
  }

  isEditor(): boolean {
    let isEditor: boolean = false;
    let loggedUser:User;
    if (localStorage.getItem('loggedUser')) {
      loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    }
    if (sessionStorage.getItem('loggedUser')) {
      loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
    }
    loggedUser.role_user_assoc.forEach((roleassoc)=> {
      if (roleassoc.role.acronym == "EDITOR") {
        isEditor = true;
      }
    })
    return isEditor;
  }

  isEntertrainer(): boolean {
    let isEntertrainer: boolean = false;
    let loggedUser:User;
    if (localStorage.getItem('loggedUser')) {
      loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    }
    if (sessionStorage.getItem('loggedUser')) {
      loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
    }
    loggedUser.role_user_assoc.forEach((roleassoc)=> {
      if (roleassoc.role.acronym == "ENTERTRAINER") {
        isEntertrainer = true;
      }
    })
    return isEntertrainer;
  }

  isResource(): boolean {
    let isResource: boolean = false;
    let loggedUser:User;
    if (localStorage.getItem('loggedUser')) {
      loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    }
    if (sessionStorage.getItem('loggedUser')) {
      loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
    }
    loggedUser.role_user_assoc.forEach((roleassoc)=> {
      if (roleassoc.role.acronym == "RESOURCE") {
        isResource = true;
      }
    })
    return isResource;
  }

  isCustomer(): boolean {
    let isCustomer: boolean = false;
    let loggedUser:User;
    if (localStorage.getItem('loggedUser')) {
      loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    }
    if (sessionStorage.getItem('loggedUser')) {
      loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
    }
    loggedUser.role_user_assoc.forEach((roleassoc)=> {
      if (roleassoc.role.acronym == "CUSTOMER") {
        isCustomer = true;
      }
    })
    return isCustomer;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return throwError(error);
  }

}
