import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { Message } from 'app/models/message.model';

@Injectable()
export class PlansService {



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {

    }



    getMessages(): Observable<Message[]> {
        return this._httpClient.get<Message[]>(Config.prop.apiEndpoint + "messages/search.php");
    }
}
