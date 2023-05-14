import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { Event } from 'app/models/event.model';
import { Location } from '@angular/common';
import { includes } from 'lodash';

@Injectable()
export class EventsService {



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private route: ActivatedRoute,
        private location: Location
    ) {

    }


    getEvents(isTrash=null): Observable<Event[]> {
      // let trash_param = this.route.snapshot.;
      // const currentUrl = this.location.path();
      // console.log(currentUrl);
      // let trash_param = includes(currentUrl, 'trash') ? 'trash' : null;
      
      // console.log(trash_param);

      if (isTrash === "trash") {
        return this._httpClient.get<Event[]>(Config.prop.apiEndpoint + "events/search.php?trashed=" + 1);
      } else {
        return this._httpClient.get<Event[]>(Config.prop.apiEndpoint + "events/search.php");
      }
    }

    getCustomerEvents(customer_id): Observable<Event[]> {
      return this._httpClient.get<Event[]>(Config.prop.apiEndpoint + "events/search.php?oid_customer=" + customer_id);
    }

    getBackup(): Observable<any> {
      return this._httpClient.get<any>(Config.prop.apiEndpoint + "events/backup.php");
    }
}
