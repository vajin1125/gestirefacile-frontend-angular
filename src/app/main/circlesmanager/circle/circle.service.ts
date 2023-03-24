import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Circle } from 'app/models/circle.model';
import { Config } from 'app/app.config';

import { SHA256 } from "crypto-js";

@Injectable()
export class CircleService implements Resolve<any>
{
    routeParams: any;
    circle: Circle;
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
                this.getCircle()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

 
    getCircle(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onUserChanged.next(false);
                resolve(false);
            }
            else {
                this._httpClient.get(Config.prop.apiEndpoint + "circles/search.php?oid=" + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.circle = response[0];
                        this.onUserChanged.next(this.circle);
                        resolve(response);
                    }, reject);
            }
        });
    }


    saveCircle(circle): Promise<any> {

        const formData = this.toFormData(circle);

        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint + "circles/update.php", formData)
                .subscribe((response: any) => {

                    //this.user = response[0];
                    this.circle = response;
                    this.onUserChanged.next(this.circle);
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


    addCircle(circle): Promise<any> {


        const formData = this.toFormData(circle);



        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint + "circles/insert.php", formData)
                .subscribe((response: any) => {
                    //this.user = response[0];
                    this.circle = response;
                    this.onUserChanged.next(this.circle);
                    resolve(response);
                }, reject);
        });
    }





}
