import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movement } from 'app/models/movement.model';
import { Config } from 'app/app.config';


@Injectable()
export class MovementService implements Resolve<any>
{
    routeParams: any;
    movement: Movement;
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

        return new Promise<void>((resolve, reject) => {

            Promise.all([
                this.getMovement()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }


    getMovement(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if ( this.routeParams.id === 'new' )
            {
                this.onRoleChanged.next(false);
                resolve(false);
            }
            else
            {
                this._httpClient.get(Config.prop.apiEndpoint + "movements/search.php?oid=" + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.movement = response[0];
                        this.onRoleChanged.next(this.movement);
                        resolve(response);
                    }, reject);
            }
        });
    }





    addMovement(movement): Promise<any>
    {  

        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint+"movements/insert.php", movement)
                .subscribe((response: any) => {
                    this.movement = response;
                        this.onRoleChanged.next(this.movement);
                        resolve(response);
                }, reject);
        });
    }


    

    
}
