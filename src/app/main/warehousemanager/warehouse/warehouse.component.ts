import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from 'app/models/warehouse.model';
import { Business } from 'app/models/business.model';
import { MyBusinessesService } from 'app/main/mybusiness/mybusinesses/mybusinesses.service';



@Component({
    selector: 'warehousemanager',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WarehouseComponent implements OnInit, OnDestroy {
    warehouse: Warehouse;
    pageType: string;
    warehouseForm: FormGroup;
    businesses: Business[];
    public filteredBusiness: ReplaySubject<Business[]> = new ReplaySubject<Business[]>(1);
    public businessesFilterCtrl: FormControl = new FormControl();
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
        private _warehouseService: WarehouseService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private _businessService: MyBusinessesService
    ) {
        // Set the default
        this.warehouse = new Warehouse();

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
        this._businessService.getBusinesses().subscribe((businesses: Business[]) => {
            this.businesses = businesses;
            this.filteredBusiness.next(this.businesses.slice());
        }, error => console.error(error));
        // Subscribe to update product on changes
        this._warehouseService.onRoleChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(warehouse => {

                if (warehouse) {
                    this.warehouse = new Warehouse(warehouse);
                    this.pageType = 'edit';
                }
                else {
                    this.pageType = 'new';
                    this.warehouse = new Warehouse();
                }

                this.warehouseForm = this.createWarehouseForm();
            });
            this.businessesFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filterBusinesses();
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
    createWarehouseForm(): FormGroup {
        this.warehouseForm = this._formBuilder.group({
            oid: [this.warehouse.oid],
            acronym: [this.warehouse.acronym, Validators.required],
            descr: [this.warehouse.descr, Validators.required],
            address: [this.warehouse.address],
            tel: [this.warehouse.tel],
            business: [this.warehouse.business, Validators.required]
        });
        return this.warehouseForm;
    }

    private filterBusinesses() {
        if (!this.businesses) {
            return;
        }
        // get the search keyword
        let search = this.businessesFilterCtrl.value;
        if (!search) {
            this.filteredBusiness.next(this.businesses.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredBusiness.next(
            this.businesses.filter(business => business.descr.toLowerCase().indexOf(search) > -1)
        );
    }

    compareObjects(o1: any, o2: any): boolean {
        return o1 && o2 ? o1.oid === o2.oid : false;
    }


    


    saveWarehouse(): void {

        const data = this.warehouseForm.getRawValue();

        this._warehouseService.saveWarehouse(data)
            .then(() => {

                // Trigger the subscription with new data
                this._warehouseService.onRoleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Magazzino aggiornato', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
            }, error => {
                this._matSnackBar.open('Errore aggiornamento magazzino!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error saveWarehouse " + error);
            });
    }


    async addWarehouse(): Promise<void> {


        const data = this.warehouseForm.getRawValue();

        this._warehouseService.addWarehouse(data)
            .then(() => {

                // Trigger the subscription with new data
                this._warehouseService.onRoleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Magazzino aggiunto', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });

                // Change the location with new one
                //this._location.go('apps/e-commerce/products/' + this.user.oid + '/' + this.user.handle);
            }, error => {
                this._matSnackBar.open('Errore aggiunta magazzino!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error addWarehouse " + error);
            });
    }







}

