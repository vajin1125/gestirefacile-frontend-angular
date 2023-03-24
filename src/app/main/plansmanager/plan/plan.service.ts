import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { Message } from 'app/models/message.model';


@Injectable()
export class PlanService implements Resolve<any>
{
    routeParams: any;
    message: Message;
    onMessageChanged: BehaviorSubject<any>;

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
        this.onMessageChanged = new BehaviorSubject({});
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
                this.getMessage()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get messages
     *
     * @returns {Promise<any>}
     */
    getMessage(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if ( this.routeParams.id === 'new' )
            {
                this.onMessageChanged.next(false);
                resolve(false);
            }
            else
            {
                this._httpClient.get(Config.prop.apiEndpoint + "messages/search.php?oid=" + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.message = response[0];
                        this.onMessageChanged.next(this.message);
                        resolve(response);
                    }, reject);
            }
        });
    }

    

    /**
     * Add message
     *
     * @param business
     * @returns {Promise<any>}
     */
    addMessage(message): Promise<any>
    {  
        //const formData = this.toFormData(message);


        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint+"messages/insert.php", message)
                .subscribe((response: any) => {
                    this.message = response;
                        this.onMessageChanged.next(this.message);
                        resolve(response);
                }, reject);
        });
    }

    /**
     * Save skill
     *
     * @param skill
     * @returns {Promise<any>}
     */
     saveMessage(skill): Promise<any>
     {
         
         return new Promise((resolve, reject) => {
             this._httpClient.post(Config.prop.apiEndpoint+"messages/update.php", skill)
                 .subscribe((response: any) => {
                     
                     this.message = response[0];
                         this.onMessageChanged.next(this.message);
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
            else {
                formData.append(key, value);
            }
        }

        return formData;
    }



    
}
