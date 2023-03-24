import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { Business } from 'app/models/business.model';


@Injectable()
export class BusinessService implements Resolve<any>
{
    routeParams: any;
    business: Business;
    onBusinessChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onBusinessChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getBusiness()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get business
     *
     * @returns {Promise<any>}
     */
    getBusiness(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if ( this.routeParams.id === 'new' )
            {
                this.onBusinessChanged.next(false);
                resolve(false);
            }
            else
            {
                this._httpClient.get(Config.prop.apiEndpoint + "business/search.php?oid=" + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.business = response[0];
                        this.onBusinessChanged.next(this.business);
                        resolve(response);
                    }, reject);
            }
        });
    }

    /**
     * Save business
     *
     * @param business
     * @returns {Promise<any>}
     */
    saveBusiness(business, logo:File): Promise<any>
    {
        const formData = this.toFormData(business);
        formData.append('file', logo);

        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint+"business/update.php", formData)
                .subscribe((response: any) => {
                    //this.business = response[0];
                    this.business = response;
                        this.onBusinessChanged.next(this.business);
                        resolve(response);
                }, reject);
        });
    }

    /**
     * Add business
     *
     * @param business
     * @returns {Promise<any>}
     */
    addBusiness(business, logo:File): Promise<any>
    {  
        const formData = this.toFormData(business);
        formData.append('file', logo);

        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint+"business/insert.php", formData)
                .subscribe((response: any) => {
                    //this.business = response[0];
                    this.business = response;
                        this.onBusinessChanged.next(this.business);
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
