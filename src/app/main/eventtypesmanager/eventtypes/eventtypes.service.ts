import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { EventType } from 'app/models/eventType.model';

@Injectable()
export class EventTypesService {



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {

    }


    getEventTypes(): Observable<EventType[]> {
        return this._httpClient.get<EventType[]>(Config.prop.apiEndpoint + "eventtypes/search.php");
    }
}
