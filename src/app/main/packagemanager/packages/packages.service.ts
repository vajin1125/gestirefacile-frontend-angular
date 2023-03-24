import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { Package } from 'app/models/package.model';

@Injectable()
export class PackagesService {



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {

    }


    getPackage(): Observable<Package[]> {
        return this._httpClient.get<Package[]>(Config.prop.apiEndpoint + "package/search.php");
    }
}
