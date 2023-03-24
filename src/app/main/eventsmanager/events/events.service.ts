import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { Event } from 'app/models/event.model';

@Injectable()
export class EventsService {



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private route: ActivatedRoute
    ) {

    }


    getEvents(): Observable<Event[]> {
        return this._httpClient.get<Event[]>(Config.prop.apiEndpoint + "events/search.php");
    }

    getCustomerEvents(customer_id): Observable<Event[]> {
      return this._httpClient.get<Event[]>(Config.prop.apiEndpoint + "events/search.php?oid_customer=" + customer_id);
    }
}
