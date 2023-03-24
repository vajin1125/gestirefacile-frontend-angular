import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { Config } from 'app/app.config';
import { Role } from 'app/models/role.model';


@Injectable()
export class RoleService implements Resolve<any>
{
    routeParams: any;
    role: Role;
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
                this.getRole()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get role
     *
     * @returns {Promise<any>}
     */
    getRole(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if ( this.routeParams.id === 'new' )
            {
                this.onRoleChanged.next(false);
                resolve(false);
            }
            else
            {
                this._httpClient.get(Config.prop.apiEndpoint + "roles/search.php?oid=" + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.role = response[0];
                        this.onRoleChanged.next(this.role);
                        resolve(response);
                    }, reject);
            }
        });
    }

    /**
     * Save role
     *
     * @param role
     * @returns {Promise<any>}
     */
    saveRole(role): Promise<any>
    {
        
        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint+"roles/update.php", role)
                .subscribe((response: any) => {
                    
                    this.role = response[0];
                        this.onRoleChanged.next(this.role);
                        resolve(response);
                }, reject);
        });
    }

    /**
     * Add role
     *
     * @param role
     * @returns {Promise<any>}
     */
    addRole(role): Promise<any>
    {  

        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint+"roles/insert.php", role)
                .subscribe((response: any) => {
                    this.role = response[0];
                        this.onRoleChanged.next(this.role);
                        resolve(response);
                }, reject);
        });
    }



    
}
