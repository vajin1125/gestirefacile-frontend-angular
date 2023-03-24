import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { Business } from 'app/models/business.model';

@Injectable()
export class MyBusinessesService {



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {

    }



    getBusinesses(): Observable<Business[]> {
        return this._httpClient.get<Business[]>(Config.prop.apiEndpoint + "mybusiness/search.php");
    }
}
