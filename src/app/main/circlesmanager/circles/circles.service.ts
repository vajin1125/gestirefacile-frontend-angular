import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { Circle } from 'app/models/circle.model';

@Injectable()
export class CirclesService {



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {

    }


    getCircles(): Observable<Circle[]> {
        return this._httpClient.get<Circle[]>(Config.prop.apiEndpoint + "circles/search.php");
    }
}
