import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'app/app.config';
// import { Event } from 'app/models/event.model';
import { EntertrainerAvailability } from 'app/models/entertrainerAvailability.model';
import { Location } from '@angular/common';
import { includes } from 'lodash';
import { ok } from 'assert';
import { resolve } from 'url';

@Injectable()
export class EntertrainersService {



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


    getEntertrainers(user_oid=null): Observable<EntertrainerAvailability[]> {
      // let trash_param = this.route.snapshot.;
      // const currentUrl = this.location.path();
      // console.log(currentUrl);
      // let trash_param = includes(currentUrl, 'trash') ? 'trash' : null;
      
      // console.log(trash_param);
      
      if (user_oid !== null) { // entertrainer
        return this._httpClient.get<EntertrainerAvailability[]>(Config.prop.apiEndpoint + "entertrainers/search.php?oid=" + user_oid);
      } else { // manager
        return this._httpClient.get<EntertrainerAvailability[]>(Config.prop.apiEndpoint + "entertrainers/search.php");
      }
    }

    // getCustomerEvents(customer_id): Observable<Event[]> {
    //   return this._httpClient.get<Event[]>(Config.prop.apiEndpoint + "events/search.php?oid_customer=" + customer_id);
    // }

    // getBackup(): Observable<any> {
    //   return this._httpClient.get<any>(Config.prop.apiEndpoint + "events/backup.php");
    // }

    // deleteAvailability(): Observable<EntertrainerAvailability[]> {
    //   return this._httpClient.post<EntertrainerAvailability[]>;
    // }

    public toFormData<T>(formValue: T) {
      const formData = new FormData();
      for (const key of Object.keys(formValue)) {
          const value = formValue[key];
          if (value instanceof Array) {
              formData.append(key, JSON.stringify(value));
          }
          else  if (value instanceof Object) {
              formData.append(key, JSON.stringify(value));
          }
          else {
              formData.append(key, value);
          }
      }
      return formData;
  }

  public toJsonStringData(objectData: any): any {
    // console.log(objectData.start.toDateString());
    // objectData.start = new Date(objectData.start.toLocaleString()).toISOString();
    // objectData.end = new Date(objectData.end.toLocaleString()).toISOString();
    objectData.start = this.extractDate(objectData.start) + 'T' + objectData.startTime;
    objectData.end = this.extractDate(objectData.end) + 'T' + objectData.endTime;
    const jsonString = JSON.stringify(objectData);
    return jsonString;
  }

  deleteAvailability(event): Promise<any> {
    const data = this.toJsonStringData(event);
    // console.log(JSON.stringify(event));
    return new Promise((resolve, reject) => {
        this._httpClient.post(Config.prop.apiEndpoint + "entertrainers/delete.php", data)
            .subscribe((response: any) => {
              // console.log(response);
                //this.user = response[0];
                //this.resource = response;
                //this.onUserChanged.next(this.resource);
                resolve(response);
            }, reject);
    });
  }

  addAvailability(event): Promise<any> {
    // console.log(event);
    const data = this.toJsonStringData(event);
    // console.log(data);

    // console.log(this.extractDate(event.start))

    return new Promise((resolve, reject) => {
      this._httpClient.post(Config.prop.apiEndpoint + "entertrainers/insert.php", data)
        .subscribe((response: any) => {
          // console.log(response);
          resolve(response);
        }, reject);
    });
  }

  updatevAilability(event): Promise<any> {
    // console.log(event);
    const data = this.toJsonStringData(event);
    return new Promise((resolve, reject) => {
      this._httpClient.post(Config.prop.apiEndpoint + "entertrainers/update.php", data)
        .subscribe((response: any) => {
          // console.log(response);
          resolve(response);
        }, reject);
    });
  }

  extractDate(d: Date): any {

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1 and pad with leading zeros
    const day = String(d.getDate()).padStart(2, '0'); // Pad with leading zeros

    const dateString = `${year}-${month}-${day}`;
    return dateString;
  }
}
