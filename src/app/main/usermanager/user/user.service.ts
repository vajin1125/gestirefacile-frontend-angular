import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'app/models/user.model';
import { Config } from 'app/app.config';

import { SHA256 } from "crypto-js";

@Injectable()
export class UserService implements Resolve<any>
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
        private _httpClient: HttpClient
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
            if (this.routeParams.id === 'new') {
                this.onUserChanged.next(false);
                resolve(false);
            }
            else {
                this._httpClient.get(Config.prop.apiEndpoint + "users/search.php?oid=" + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.user = response[0];
                        this.onUserChanged.next(this.user);
                        resolve(response);
                    }, reject);
            }
        });
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
            this._httpClient.post(Config.prop.apiEndpoint + "users/update.php", formData)
                .subscribe((response: any) => {

                    //this.user = response[0];
                    this.user = response;
                    this.onUserChanged.next(this.user);
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

    /**
     * Add user
     *
     * @param user
     * @returns {Promise<any>}
     */
    addUser(user, logo: File): Promise<any> {
        let pwdEncrypt = SHA256(user.password) + "";
        user.password = pwdEncrypt;
        user.passwordConfirm = pwdEncrypt;

        const formData = this.toFormData(user);
        formData.append('logo', logo);


        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint + "users/insert.php", formData)
                .subscribe((response: any) => {
                    //this.user = response[0];
                    this.user = response;
                    this.onUserChanged.next(this.user);
                    resolve(response);
                }, reject);
        });
    }


    emailCheckUnique(email): Observable<User[]> {
        return this._httpClient.get<User[]>(Config.prop.apiEndpoint + "users/checkUnique.php?email=" + email);
    }

    usernameCheckUnique(username): Observable<User[]> {
        return this._httpClient.get<User[]>(Config.prop.apiEndpoint + "users/checkUnique.php?username=" + username);
    }




}
