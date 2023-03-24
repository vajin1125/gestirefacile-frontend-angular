import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Config } from 'app/app.config';

import { Vendor } from 'app/models/vendor.model';

@Injectable()
export class VendorService implements Resolve<any>
{
    routeParams: any;
    vendor: Vendor;
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

        return new Promise<void>((resolve, reject) => {

            Promise.all([
                this.getVendor()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }


    getVendor(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onUserChanged.next(false);
                resolve(false);
            }
            else {
                this._httpClient.get(Config.prop.apiEndpoint + "vendors/search.php?oid=" + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.vendor = response[0];
                        this.onUserChanged.next(this.vendor);
                        resolve(response);
                    }, reject);
            }
        });
    }


    saveVendor(vendor): Promise<any> {

        const formData = this.toFormData(vendor);

        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint + "vendors/update.php", formData)
                .subscribe((response: any) => {

                    //this.user = response[0];
                    this.vendor = response;
                    this.onUserChanged.next(this.vendor);
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


    addVendor(vendor): Promise<any> {


        const formData = this.toFormData(vendor);


        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint + "vendors/insert.php", formData)
                .subscribe((response: any) => {
                    //this.user = response[0];
                    this.vendor = response;
                    this.onUserChanged.next(this.vendor);
                    resolve(response);
                }, reject);
        });
    }






}
