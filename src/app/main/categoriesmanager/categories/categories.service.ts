import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { Category } from 'app/models/category.model';

@Injectable()
export class CategoriesService {



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {

    }


    getCategories(): Observable<Category[]> {
        return this._httpClient.get<Category[]>(Config.prop.apiEndpoint + "categories/search.php");
    }
}
