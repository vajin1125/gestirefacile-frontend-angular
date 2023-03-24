import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from 'app/models/category.model';
import { Config } from 'app/app.config';
import { ResourceType } from 'app/models/resourceType.model';


@Injectable()
export class CategoryService implements Resolve<any>
{
    routeParams: any;
    category: Category;
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
                this.getCategory()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get category
     *
     * @returns {Promise<any>}
     */
    getCategory(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if ( this.routeParams.id === 'new' )
            {
                this.onRoleChanged.next(false);
                resolve(false);
            }
            else
            {
                this._httpClient.get(Config.prop.apiEndpoint + "categories/search.php?oid=" + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.category = response[0];
                        this.onRoleChanged.next(this.category);
                        resolve(response);
                    }, reject);
            }
        });
    }

    /**
     * Save category
     *
     * @param category
     * @returns {Promise<any>}
     */
    saveCategory(category): Promise<any>
    {
        
        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint+"categories/update.php", category)
                .subscribe((response: any) => {
                    
                    this.category = response[0];
                        this.onRoleChanged.next(this.category);
                        resolve(response);
                }, reject);
        });
    }

    deleteCategory(category): Promise<any>
    {
        
        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint+"categories/delete.php", category)
                .subscribe((response: any) => {
                    
                    this.category = response[0];
                        this.onRoleChanged.next(this.category);
                        resolve(response);
                }, reject);
        });
    }

    /**
     * Add category
     *
     * @param category
     * @returns {Promise<any>}
     */
    addCategory(category): Promise<any>
    {  

        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint+"categories/insert.php", category)
                .subscribe((response: any) => {
                    this.category = response[0];
                        this.onRoleChanged.next(this.category);
                        resolve(response);
                }, reject);
        });
    }


    getResourceTypes(): Observable<ResourceType[]> {
        return this._httpClient.get<ResourceType[]>(Config.prop.apiEndpoint + "resourcetypes/search.php");
    }

    
}
