import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { Customer } from 'app/models/customer.model';

@Injectable()
export class CustomersService {



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {

    }


    getCustomers(): Observable<Customer[]> {
        return this._httpClient.get<Customer[]>(Config.prop.apiEndpoint + "customers/search.php");
    }

    addCustomer(customer): Promise<any> {
        const formData = this.toFormData(customer);
        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint + "customers/insert.php", formData)
                .subscribe((response: any) => {
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
