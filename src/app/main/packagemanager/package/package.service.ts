import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Config } from 'app/app.config';

import { Package } from 'app/models/package.model';


@Injectable()
export class PackageService implements Resolve<any>
{
    routeParams: any;
    package: Package;
    onMessageChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onMessageChanged = new BehaviorSubject({});
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
                this.getPackage()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get messages
     *
     * @returns {Promise<any>}
     */
    getPackage(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onMessageChanged.next(false);
                resolve(false);
            }
            else {
                this._httpClient.get(Config.prop.apiEndpoint + "package/search.php?oid=" + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.package = response[0];
                        this.onMessageChanged.next(this.package);
                        resolve(response);
                    }, reject);
            }
        });
    }



    /**
     * Add Package
     *
     * @param business
     * @returns {Promise<any>}
     */
    addPackage(pkg, logo: File): Promise<any> {
        const formData = this.toFormData(pkg);
        formData.append('logo', logo);

        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint + "package/insert.php", formData)
                .subscribe((response: any) => {
                    this.package = response;
                    this.onMessageChanged.next(this.package);
                    resolve(response);
                }, reject);
        });
    }



    

    /**
    * Save package
    *
    * @param pkg
    * @returns {Promise<any>}
    */
    savePackage(pkg, logo: File): Promise<any> {
      const formData = this.toFormData(pkg);
        formData.append('logo', logo);

        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint + "package/update.php", formData)
                .subscribe((response: any) => {

                    this.package = response;
                    this.onMessageChanged.next(this.package);
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




}
