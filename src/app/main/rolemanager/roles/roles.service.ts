import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { Role } from 'app/models/role.model';

@Injectable()
export class RolesService {



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {

    }


    getRoles(): Observable<Role[]> {
        return this._httpClient.get<Role[]>(Config.prop.apiEndpoint + "roles/search.php");
    }
}
