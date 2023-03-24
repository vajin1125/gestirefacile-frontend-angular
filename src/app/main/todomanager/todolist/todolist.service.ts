import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { ToDo } from 'app/models/todo.model';

@Injectable()
export class ToDoListService {



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {

    }


    getToDoList(): Observable<ToDo[]> {
        return this._httpClient.get<ToDo[]>(Config.prop.apiEndpoint + "todo/search.php");
    }
}
