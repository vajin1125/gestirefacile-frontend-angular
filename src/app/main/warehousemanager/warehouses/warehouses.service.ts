import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { Warehouse } from 'app/models/warehouse.model';

@Injectable()
export class WarehousesService {



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {

    }


    getWarehouses(): Observable<Warehouse[]> {
        return this._httpClient.get<Warehouse[]>(Config.prop.apiEndpoint + "warehouses/search.php");
    }
}
