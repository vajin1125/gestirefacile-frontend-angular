import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { Skill } from 'app/models/skill.model';

@Injectable()
export class SkillsService {



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {

    }


    getSkills(): Observable<Skill[]> {
        return this._httpClient.get<Skill[]>(Config.prop.apiEndpoint + "skills/search.php");
    }
}
