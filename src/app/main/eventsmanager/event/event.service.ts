import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { Event } from 'app/models/event.model';
import { PaymentType } from 'app/models/paymentType.model';
import { PaymentMethod } from 'app/models/paymentMethod.model';
import { EventStatus } from 'app/models/eventStatus.model';
import { Attribute } from 'app/models/attribute.model';


@Injectable()
export class EventService implements Resolve<any>
{
    routeParams: any;
    onRoleChanged: BehaviorSubject<any>;
    event: Event;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onRoleChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.routeParams = route.params;

        return new Promise<void>((resolve, reject) => {

            Promise.all([
                this.getEvent()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }


    getEvent(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onRoleChanged.next(false);
                resolve(false);
            }
            else {
              console.log("asdfasdfasdf");
                this._httpClient.get(Config.prop.apiEndpoint + "events/search.php?oid=" + this.routeParams.id)
                    .subscribe((response: any) => {
                      console.log(response);
                        this.event = response[0];
                        this.onRoleChanged.next(this.event);
                        resolve(response);
                    }, reject);
            }
        });
    }

    getEventById(oid): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.get(Config.prop.apiEndpoint + "events/search.php?oid=" + oid)
                .subscribe((response: any) => {
                    this.event = response[0];
                    resolve(response);
                }, reject);
        });
    }

    // getEventsByCustomerId(): Promise<any> {
    //   console.log(">>>>>", this.routeParams.id);
    //   return new Promise((resolve, reject) => {
    //     this._httpClient.get(Config.prop.apiEndpoint + "events/search.php?oid_customer=" + this.routeParams.id)
    //         .subscribe((response: any) => {
    //             this.event = response[0];
    //             this.onRoleChanged.next(this.event);
    //             resolve(response);
    //         }, reject);
    //   });
    // }

    getAttributes(): Observable<Attribute[]> {
        return this._httpClient.get<Attribute[]>(Config.prop.apiEndpoint + "attributes/search.php?oidType=2");
    }



    saveEvent(evt, attFile: File): Promise<any> {
      // console.log(">>>>>>>>>>>", evt);
      const formData = this.toFormData(evt);
      formData.append('attch_file', attFile);
      // console.log(formData);

        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint + "events/update.php", formData)
                .subscribe((response: any) => {

                    this.event = response;
                    this.onRoleChanged.next(this.event);
                    resolve(response);
                }, reject);
        });
    }

    // saveEvent(evt): Promise<any> {
    //   console.log(">>>>>>>>>>>", evt);

    //     return new Promise((resolve, reject) => {
    //         this._httpClient.post(Config.prop.apiEndpoint + "events/update.php", evt)
    //             .subscribe((response: any) => {

    //                 this.event = response;
    //                 this.onRoleChanged.next(this.event);
    //                 resolve(response);
    //             }, reject);
    //     });
    // }


    addEvent(evt): Promise<any> {
        console.log(">>>>>>>>>>>", evt);
        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint + "events/insert.php", evt)
                .subscribe((response: any) => {
                    this.event = response;
                    this.onRoleChanged.next(this.event);
                    resolve(response);
                }, reject);
        });
    }

    checkAvail(oid, start, end, oidEvent): Promise<any>  {
        return new Promise((resolve, reject) => {

            this._httpClient.get(Config.prop.apiEndpoint + "resources/checkAvail.php?oid=" + oid+"&start="+start+"&end="+end+"&oidEvent="+oidEvent)
                .subscribe((response: any) => {
                    this.event = response
                    resolve(response);
                }, reject);
        });
    }


    getEventStatus(): Observable<EventStatus[]> {
        return this._httpClient.get<EventStatus[]>(Config.prop.apiEndpoint + "eventstatus/search.php");
    }

    getPaymentTypes(): Observable<PaymentType[]> {
        return this._httpClient.get<PaymentType[]>(Config.prop.apiEndpoint + "paymenttype/search.php");
    }

    getPaymentMethods(): Observable<PaymentMethod[]> {
        return this._httpClient.get<PaymentMethod[]>(Config.prop.apiEndpoint + "paymentmethod/search.php");
    }

    getExtras(): Observable<string[]> {
        return this._httpClient.get<string[]>(Config.prop.apiEndpoint + "extra/search.php");
    }

    uploadAttFile(oid, attFile: File): Promise<any> {
      const formData = this.toFormData(oid);
      formData.append('attch_file', attFile);
      console.log(">>>>>>>>>>>", formData);

        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint + "events/update.php", formData)
                .subscribe((response: any) => {

                    this.event = response;
                    this.onRoleChanged.next(this.event);
                    resolve(response);
                }, reject);
        });
    }

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
}
