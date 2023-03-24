import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { Config } from 'app/app.config';
import { Skill } from 'app/models/skill.model';


@Injectable()
export class SkillService implements Resolve<any>
{
    routeParams: any;
    skill: Skill;
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
                this.getSkill()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get skill
     *
     * @returns {Promise<any>}
     */
    getSkill(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if ( this.routeParams.id === 'new' )
            {
                this.onRoleChanged.next(false);
                resolve(false);
            }
            else
            {
                this._httpClient.get(Config.prop.apiEndpoint + "skills/search.php?oid=" + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.skill = response[0];
                        this.onRoleChanged.next(this.skill);
                        resolve(response);
                    }, reject);
            }
        });
    }

    /**
     * Save skill
     *
     * @param skill
     * @returns {Promise<any>}
     */
    saveSkill(skill): Promise<any>
    {
        
        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint+"skills/update.php", skill)
                .subscribe((response: any) => {
                    
                    this.skill = response[0];
                        this.onRoleChanged.next(this.skill);
                        resolve(response);
                }, reject);
        });
    }

    /**
     * Add skill
     *
     * @param skill
     * @returns {Promise<any>}
     */
    addSkill(skill): Promise<any>
    {  

        return new Promise((resolve, reject) => {
            this._httpClient.post(Config.prop.apiEndpoint+"skills/insert.php", skill)
                .subscribe((response: any) => {
                    this.skill = response;
                        this.onRoleChanged.next(this.skill);
                        resolve(response);
                }, reject);
        });
    }



    
}
