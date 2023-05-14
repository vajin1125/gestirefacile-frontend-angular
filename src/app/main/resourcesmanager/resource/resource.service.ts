import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Resource } from 'app/models/resource.model';
import { Config } from 'app/app.config';
import { ResourceType } from 'app/models/resourceType.model';


@Injectable()
export class ResourceService implements Resolve<any>
{
    routeParams: any;
    resource: Resource;
    onUserChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onUserChanged = new BehaviorSubject({});
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
                this.getResource()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get resource
     *
     * @returns {Promise<any>}
     */
    getResource(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onUserChanged.next(false);
                resolve(false);
            }
            else {
                this._httpClient.get(Config.prop.apiEndpoint + "resources/search.php?oid=" + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.resource = response[0];
                        console.log(this.resource);
                        this.onUserChanged.next(this.resource);
                        resolve(response);
                    }, reject);
            }
        });
    }


    

    getResourceTypes(): Observable<ResourceType[]> {
        return this._httpClient.get<ResourceType[]>(Config.prop.apiEndpoint + "resourcetypes/search.php");
    }

    /**
     * Save resource
     *
     * @param resource
     * @returns {Promise<any>}
     */
    saveResource(resource, logo: File): Promise<any> {

        const formData = this.toFormData(resource);
        formData.append('logo', logo);
        // console.log(formData);
        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint + "resources/update.php", formData)
                .subscribe((response: any) => {

                    //this.user = response[0];
                    this.resource = resource;
                    // console.log(this.resource);
                    this.onUserChanged.next(this.resource);
                    resolve(response);
                }, reject);
        });
    }

    deleteResource(resource, logo: File): Promise<any> {

        const formData = this.toFormData(resource);
        formData.append('logo', logo);

        // console.log(formData);

        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint + "resources/delete.php", formData)
                .subscribe((response: any) => {
                  // console.log(response);
                    //this.user = response[0];
                    //this.resource = response;
                    //this.onUserChanged.next(this.resource);
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

    /**
     * Add resource
     *
     * @param resource
     * @returns {Promise<any>}
     */
    addResource(resource, logo: File): Promise<any> {

        const formData = this.toFormData(resource);
        formData.append('logo', logo);
        // console.log(resource);
        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint + "resources/insert.php", formData)
                .subscribe((response: any) => {
                    this.resource = resource;
                    this.onUserChanged.next(this.resource);
                    resolve(response);
                }, reject);
        });
    }


    emailCheckUnique(email): Observable<Resource[]> {
        return this._httpClient.get<Resource[]>(Config.prop.apiEndpoint + "users/checkUnique.php?email=" + email);
    }

    usernameCheckUnique(username): Observable<Resource[]> {
        return this._httpClient.get<Resource[]>(Config.prop.apiEndpoint + "users/checkUnique.php?username=" + username);
    }


    moveToTrash(resourceOid): Promise<any> {
      let data = {
        oid: resourceOid
      };
      return new Promise((resolve, reject) => {
        this._httpClient.post(Config.prop.apiEndpoint + "resources/trash.php", data)
          .subscribe((response:any) => {
            // console.log(response)
            // console.log(event_data)
            // this.event = event_data
            // this.onUserChanged.next(this.resource.is_trash = 1)
            resolve(this.resource.is_trash = 1)
          }, reject)
      })
    }

    restoreFromTrash(resourceOid): Promise<any> {
      let data = {
        oid: resourceOid
      };
      return new Promise((resolve, reject) => {
        this._httpClient.post(Config.prop.apiEndpoint + "resources/restore.php", data)
          .subscribe((response:any) => {
            // console.log(response)
            // console.log(event_data)
            // this.event = event_data
            // this.onUserChanged.next(this.resource.is_trash = 0)
            resolve(this.resource.is_trash = 0)
          }, reject)
      })
    }

}
