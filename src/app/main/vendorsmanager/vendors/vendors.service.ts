import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { Vendor } from 'app/models/vendor.model';

@Injectable()
export class VendorsService {



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {

    }


    getVendors(): Observable<Vendor[]> {
        return this._httpClient.get<Vendor[]>(Config.prop.apiEndpoint + "vendors/search.php");
    }
}
