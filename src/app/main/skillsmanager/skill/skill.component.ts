import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';



import { SkillService } from './skill.service';
import { Skill } from 'app/models/skill.model';



@Component({
    selector     : 'skillsmanager',
    templateUrl  : './skill.component.html',
    styleUrls    : ['./skill.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class SkillComponent implements OnInit, OnDestroy
{
    skill: Skill;
    pageType: string;
    skillForm: FormGroup;

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
        private _skillService: SkillService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar
    )
    {
        // Set the default
        this.skill = new Skill();
        
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
        this._skillService.onRoleChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(skill => {

                if ( skill )
                {
                    this.skill = new Skill(skill);
                    this.pageType = 'edit';
                }
                else
                {
                    this.pageType = 'new';
                    this.skill = new Skill();
                }

                this.skillForm = this.createSkillForm();
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
    createSkillForm(): FormGroup
    {
        this.skillForm =  this._formBuilder.group({
            oid              : [this.skill.oid],
            acronym             : [this.skill.acronym, Validators.required],
            descr          : [this.skill.descr, Validators.required]
            
        });


        

        return this.skillForm;
    }




    /**
     * Save skill
     */
    saveSkill(): void
    {
    
        const data = this.skillForm.getRawValue();

        this._skillService.saveSkill(data)
            .then(() => {

                // Trigger the subscription with new data
                this._skillService.onRoleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Mansione aggiornata', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });
            }, error => {
                this._matSnackBar.open('Errore aggiornamento mansione!', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });
                console.log("Error saveSkill "+error);
            });
    }

    /**
     * Add skill
     */
    async addSkill(): Promise<void>
    {
        

        const data = this.skillForm.getRawValue();
        
        this._skillService.addSkill(data)
            .then(() => {

                // Trigger the subscription with new data
                //this._skillService.onRoleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Mansione aggiunta', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });

                // Change the location with new one
                //this._location.go('apps/e-commerce/products/' + this.user.oid + '/' + this.user.handle);
            }, error => {
                this._matSnackBar.open('Errore aggiunta mansione!', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });
                console.log("Error addSkill "+error);
            });
    }


    
  



}

