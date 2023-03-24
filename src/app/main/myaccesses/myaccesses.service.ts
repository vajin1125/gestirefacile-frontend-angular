import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { AccessLog } from 'app/models/access.model';

@Injectable()
export class MyAccessesService {



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {

    }


    getAccesses(): Observable<AccessLog[]> {
        return this._httpClient.get<AccessLog[]>(Config.prop.apiEndpoint + "myaccess/search.php");
    }
}
