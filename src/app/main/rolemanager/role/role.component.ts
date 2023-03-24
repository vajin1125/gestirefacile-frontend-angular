import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';



import { RoleService } from './role.service';
import { Role } from 'app/models/role.model';



@Component({
    selector     : 'rolemanager',
    templateUrl  : './role.component.html',
    styleUrls    : ['./role.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class RoleComponent implements OnInit, OnDestroy
{
    role: Role;
    pageType: string;
    roleForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {EcommerceProductService} _ecommerceProductService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _roleService: RoleService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar
    )
    {
        // Set the default
        this.role = new Role();
        
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to update product on changes
        this._roleService.onRoleChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(role => {

                if ( role )
                {
                    this.role = new Role(role);
                    this.pageType = 'edit';
                }
                else
                {
                    this.pageType = 'new';
                    this.role = new Role();
                }

                this.roleForm = this.createRoleForm();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create product form
     *
     * @returns {FormGroup}
     */
    createRoleForm(): FormGroup
    {
        this.roleForm =  this._formBuilder.group({
            oid              : [this.role.oid],
            acronym             : [this.role.acronym, Validators.required],
            descr          : [this.role.descr, Validators.required]
            
        });


        

        return this.roleForm;
    }




    /**
     * Save role
     */
    saveRole(): void
    {
    
        const data = this.roleForm.getRawValue();

        this._roleService.saveRole(data)
            .then(() => {

                // Trigger the subscription with new data
                this._roleService.onRoleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Ruolo aggiornato', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });
            }, error => {
                this._matSnackBar.open('Errore aggiornamento ruolo!', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });
                console.log("Error saveRole "+error);
            });
    }

    /**
     * Add role
     */
    async addRole(): Promise<void>
    {
        

        const data = this.roleForm.getRawValue();
        
        this._roleService.addRole(data)
            .then(() => {

                // Trigger the subscription with new data
                this._roleService.onRoleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Ruolo aggiunto', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });

                // Change the location with new one
                //this._location.go('apps/e-commerce/products/' + this.user.oid + '/' + this.user.handle);
            }, error => {
                this._matSnackBar.open('Errore aggiunta ruolo!', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });
                console.log("Error addRole "+error);
            });
    }


    
  



}

