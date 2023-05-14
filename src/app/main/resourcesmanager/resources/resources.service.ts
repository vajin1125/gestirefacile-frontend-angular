import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { Resource } from 'app/models/resource.model';

@Injectable()
export class ResourcesService {



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {

    }


    getResources(isTrash=null): Observable<Resource[]> {
      if (isTrash === "trash") {
        return this._httpClient.get<Resource[]>(Config.prop.apiEndpoint + "resources/search.php?trashed=" + 1);
      } else {
        return this._httpClient.get<Resource[]>(Config.prop.apiEndpoint + "resources/search.php");
      }
        
    }
}
