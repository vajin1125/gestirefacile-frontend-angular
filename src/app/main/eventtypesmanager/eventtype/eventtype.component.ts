import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { EventTypeService } from './eventtype.service';
import { EventType } from 'app/models/eventType.model';



@Component({
    selector: 'eventtypesmanager',
    templateUrl: './eventtype.component.html',
    styleUrls: ['./eventtype.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class EventTypeComponent implements OnInit, OnDestroy {
    eventType: EventType;
    pageType: string;
    eventTypeForm: FormGroup;

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
        private _eventTypeService: EventTypeService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar
    ) {
        // Set the default
        this.eventType = new EventType();

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        // Subscribe to update product on changes
        this._eventTypeService.onRoleChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(eventType => {

                if (eventType) {
                    this.eventType = new EventType(eventType);
                    this.pageType = 'edit';
                }
                else {
                    this.pageType = 'new';
                    this.eventType = new EventType();
                }

                this.eventTypeForm = this.createEventTypeForm();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
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
    createEventTypeForm(): FormGroup {
        this.eventTypeForm = this._formBuilder.group({
            oid: [this.eventType.oid],
            acronym: [this.eventType.acronym, Validators.required],
            descr: [this.eventType.descr, Validators.required]
        });
        return this.eventTypeForm;
    }


    


    saveEventType(): void {

        const data = this.eventTypeForm.getRawValue();

        this._eventTypeService.saveEventType(data)
            .then(() => {

                // Trigger the subscription with new data
                this._eventTypeService.onRoleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Tipo di evento aggiornato', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
            }, error => {
                this._matSnackBar.open('Errore aggiornamento tipo di evento!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error saveCategory " + error);
            });
    }


    async addEventType(): Promise<void> {


        const data = this.eventTypeForm.getRawValue();

        this._eventTypeService.addEventType(data)
            .then(() => {

                // Trigger the subscription with new data
                this._eventTypeService.onRoleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Tipo di evento aggiunto', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });

                // Change the location with new one
                //this._location.go('apps/e-commerce/products/' + this.user.oid + '/' + this.user.handle);
            }, error => {
                this._matSnackBar.open('Errore aggiunta tipo di evento!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error addCategory " + error);
            });
    }







}

