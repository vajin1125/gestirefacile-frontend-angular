import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'app/models/user.model';
import { Config } from 'app/app.config';

import { SHA256 } from "crypto-js";
import { AuthService } from 'app/security/services/auth.service';
import { AttributeType } from 'app/models/attributeType.model';

@Injectable()
export class ProfileService implements Resolve<any>
{
    routeParams: any;
    user: User;
    onUserChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private authService: AuthService
    ) {
        // Set the defaults
        this.onUserChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getUser()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get user
     *
     * @returns {Promise<any>}
     */
    getUser(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(Config.prop.apiEndpoint + "myprofile/search.php")
                .subscribe((response: any) => {
                    this.user = response[0];
                    this.onUserChanged.next(this.user);
                    resolve(response);
                }, reject);

        });
    }

    getAttributeTypes(): Observable<AttributeType[]> {
        return this._httpClient.get<AttributeType[]>(Config.prop.apiEndpoint + "attributes/searchTypes.php");
    }

    /**
     * Save user
     *
     * @param user
     * @returns {Promise<any>}
     */
    saveUser(user, changePassword: boolean, logo: File): Promise<any> {
        if (changePassword) {
            let pwdEncrypt = SHA256(user.password) + "";
            user.password = pwdEncrypt;
            user.passwordConfirm = pwdEncrypt;
            changePassword = false;
        }
        const formData = this.toFormData(user);
        formData.append('logo', logo);

        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint + "myprofile/update.php", formData)
                .subscribe((response: any) => {

                    //this.user = response[0];
                    this.user = response;
                    this.onUserChanged.next(this.user);
                    let currentUser = this.authService.getLoggedUser();
                    currentUser.name = this.user.name;
                    currentUser.surname = this.user.surname;
                    currentUser.email = this.user.email;
                    currentUser.tel = this.user.tel;
                    currentUser.cell = this.user.cell;
                    currentUser.image = this.user.image;
                    this.authService.setLoggedUser(currentUser);
                    resolve(response);
                }, reject);
        });
    }

    public toFormData<T>(formValue: T) {
        const formData = new FormData();

        for (const key of Object.keys(formValue)) {
            const value = formValue[key];
            if (value instanceof Array) {
                formData.append(key, JSON.stringify(value));
            }
            else {
                formData.append(key, value);
            }
        }
        return formData;
    }




    emailCheckUnique(email): Observable<User[]> {
        return this._httpClient.get<User[]>(Config.prop.apiEndpoint + "users/checkUnique.php?email=" + email);
    }

    usernameCheckUnique(username): Observable<User[]> {
        return this._httpClient.get<User[]>(Config.prop.apiEndpoint + "users/checkUnique.php?username=" + username);
    }




}
