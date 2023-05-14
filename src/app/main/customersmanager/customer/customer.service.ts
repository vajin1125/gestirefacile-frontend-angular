import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from 'app/models/customer.model';
import { Config } from 'app/app.config';
import { Attribute } from 'app/models/attribute.model';



@Injectable()
export class CustomerService implements Resolve<any>
{
    routeParams: any;
    customer: Customer;
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
                this.getCustomer()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getCustomer(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onUserChanged.next(false);
                resolve(false);
            }
            else {
                this._httpClient.get(Config.prop.apiEndpoint + "customers/search.php?oid=" + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.customer = response[0];
                        this.onUserChanged.next(this.customer);
                        resolve(response);
                    }, reject);
            }
        });
    }

    getAttributes(): Observable<Attribute[]> {
        return this._httpClient.get<Attribute[]>(Config.prop.apiEndpoint + "attributes/search.php?oidType=1");
    }

    saveCustomer(customer): Promise<any> {
        const formData = this.toFormData(customer);
        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint + "customers/update.php", formData)
                .subscribe((response: any) => {
                    //this.user = response[0];
                    this.customer = response;
                    this.onUserChanged.next(this.customer);
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

    addCustomer(customer): Promise<any> {
        const formData = this.toFormData(customer);
        // console.log(formData);
        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint + "customers/insert.php", formData)
                .subscribe((response: any) => {
                    //this.user = response[0];
                    this.customer = response;
                    this.onUserChanged.next(this.customer);
                    resolve(response);
                }, reject);
        });
    }
}
