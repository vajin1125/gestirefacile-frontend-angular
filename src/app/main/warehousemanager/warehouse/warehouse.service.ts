import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Config } from 'app/app.config';
import { Warehouse } from 'app/models/warehouse.model';


@Injectable()
export class WarehouseService implements Resolve<any>
{
    routeParams: any;
    warehouse: Warehouse;
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
                this.getWarehouse()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }


    getWarehouse(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if ( this.routeParams.id === 'new' )
            {
                this.onRoleChanged.next(false);
                resolve(false);
            }
            else
            {
                this._httpClient.get(Config.prop.apiEndpoint + "warehouses/search.php?oid=" + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.warehouse = response[0];
                        this.onRoleChanged.next(this.warehouse);
                        resolve(response);
                    }, reject);
            }
        });
    }


    saveWarehouse(warehouse): Promise<any>
    {
        
        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint+"warehouses/update.php", warehouse)
                .subscribe((response: any) => {
                    
                    this.warehouse = response[0];
                        this.onRoleChanged.next(this.warehouse);
                        resolve(response);
                }, reject);
        });
    }


    addWarehouse(warehouse): Promise<any>
    {  

        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint+"warehouses/insert.php", warehouse)
                .subscribe((response: any) => {
                    this.warehouse = response[0];
                        this.onRoleChanged.next(this.warehouse);
                        resolve(response);
                }, reject);
        });
    }


    

    
}
