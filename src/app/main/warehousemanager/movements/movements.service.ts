import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { Movement } from 'app/models/movement.model';

@Injectable()
export class MovementsService {



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {

    }


    getMovements(): Observable<Movement[]> {
        return this._httpClient.get<Movement[]>(Config.prop.apiEndpoint + "movements/search.php");
    }
}
