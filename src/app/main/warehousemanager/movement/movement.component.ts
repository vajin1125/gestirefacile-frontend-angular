import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { MovementService } from './movement.service';
import { Resource } from 'app/models/resource.model';

import { Movement } from 'app/models/movement.model';
import { ResourcesService } from 'app/main/resourcesmanager/resources/resources.service';




@Component({
    selector: 'movements',
    templateUrl: './movement.component.html',
    styleUrls: ['./movement.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class MovementComponent implements OnInit, OnDestroy {
    movement: Movement;
    pageType: string;
    movementForm: FormGroup;
    resources: Resource[];
    public filteredResource: ReplaySubject<Resource[]> = new ReplaySubject<Resource[]>(1);
    public resourcesFilterCtrl: FormControl = new FormControl();
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
        private _movementService: MovementService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private _resourceService: ResourcesService
    ) {
        // Set the default
        this.movement = new Movement();

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
        this._resourceService.getResources().subscribe((resources: Resource[]) => {
            this.resources = resources.filter(res => res.resourceType.oid == 2);
            this.filteredResource.next(this.resources.slice());
        }, error => console.error(error));
        // Subscribe to update product on changes
        this._movementService.onRoleChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(movement => {

                if (movement) {
                    this.movement = new Movement(movement);
                    this.pageType = 'edit';
                }
                else {
                    this.pageType = 'new';
                    this.movement = new Movement();
                }

                this.movementForm = this.createMovementForm();
            });
            this.resourcesFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filterResources();
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
    createMovementForm(): FormGroup {
        this.movementForm = this._formBuilder.group({
            oid: [this.movement.oid],
            resource: this.movement.resource,
            qta: this.movement.qta,
            reason: this.movement.reason
        });
        return this.movementForm;
    }

    private filterResources() {
        if (!this.resources) {
            return;
        }
        // get the search keyword
        let search = this.resourcesFilterCtrl.value;
        if (!search) {
            this.filteredResource.next(this.resources.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredResource.next(
            this.resources.filter(resource => JSON.stringify(resource).toLowerCase().indexOf(search) > -1)
        );
    }

    compareObjects(o1: any, o2: any): boolean {
        return o1 && o2 ? o1.oid === o2.oid : false;
    }





    /*saveMovement(): void {

        const data = this.movementForm.getRawValue();

        this._movementService.saveMovement(data)
            .then(() => {

                // Trigger the subscription with new data
                this._movementService.onRoleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Movimento aggiornato', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
            }, error => {
                this._matSnackBar.open('Errore aggiornamento movimento!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error saveMovement " + error);
            });
    }*/


    async addMovement(): Promise<void> {


        const data = this.movementForm.getRawValue();

        this._movementService.addMovement(data)
            .then(() => {

                // Trigger the subscription with new data
                //this._movementService.onRoleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Movimento aggiunto', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });

                // Change the location with new one
                //this._location.go('apps/e-commerce/products/' + this.user.oid + '/' + this.user.handle);
            }, error => {
                this._matSnackBar.open('Errore aggiunta movimento!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error addMovement " + error);
            });
    }








}

