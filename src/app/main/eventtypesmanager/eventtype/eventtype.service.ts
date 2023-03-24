import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventType } from 'app/models/eventType.model';
import { Config } from 'app/app.config';



@Injectable()
export class EventTypeService implements Resolve<any>
{
    routeParams: any;
    event: EventType;
    onRoleChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getEventType()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }


    getEventType(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if ( this.routeParams.id === 'new' )
            {
                this.onRoleChanged.next(false);
                resolve(false);
            }
            else
            {
                this._httpClient.get(Config.prop.apiEndpoint + "eventtypes/search.php?oid=" + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.event = response[0];
                        this.onRoleChanged.next(this.event);
                        resolve(response);
                    }, reject);
            }
        });
    }


    saveEventType(eventType): Promise<any>
    {
        
        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint+"eventtypes/update.php", eventType)
                .subscribe((response: any) => {
                    
                    this.event = response[0];
                        this.onRoleChanged.next(this.event);
                        resolve(response);
                }, reject);
        });
    }


    addEventType(eventType): Promise<any>
    {  

        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint+"eventtypes/insert.php", eventType)
                .subscribe((response: any) => {
                    this.event = response[0];
                        this.onRoleChanged.next(this.event);
                        resolve(response);
                }, reject);
        });
    }


    

    
}
