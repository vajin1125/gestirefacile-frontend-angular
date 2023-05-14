import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Config } from 'app/app.config';
import { Firstnote } from 'app/models/firstnote.model';

@Injectable()
export class FirstnoteService {

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */

  constructor(
    private _httpClient: HttpClient
  ) { }

  getFirstnoteList(): Observable<Firstnote[]> {
    return this._httpClient.get<Firstnote[]>(Config.prop.apiEndpoint + "firstnote/search.php");
  }
}
