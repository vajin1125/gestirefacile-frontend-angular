import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { User } from 'app/models/user.model';

@Injectable()
export class UsersService {



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {

    }


    getUsers(): Observable<User[]> {
        return this._httpClient.get<User[]>(Config.prop.apiEndpoint + "users/search.php");
    }
}
