import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';


import { Vendor } from 'app/models/vendor.model';
import { VendorService } from './vendor.service';
import * as _ from 'lodash';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';



@Component({
    selector: 'vendorsmanager',
    templateUrl: './vendor.component.html',
    styleUrls: ['./vendor.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class VendorComponent implements OnInit, OnDestroy {
    vendor: Vendor;
    pageType: string;
    vendorForm: FormGroup;


    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true })
    sort: MatSort;
    tabIndex = 0;

    // Private
    private _unsubscribeAll: Subject<any>;


    constructor(
        private _vendorService: VendorService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
    ) {
        // Set the default
        this.vendor= new Vendor();

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
        this._vendorService.onUserChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {

                if (user) {
                    this.vendor = new Vendor(user);
                    
                    this.pageType = 'edit';
                }
                else {
                    this.pageType = 'new';
                    this.vendor = new Vendor();
                }
                this.vendorForm = this.createVendorForm();
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
    createVendorForm(): FormGroup {
        this.vendorForm = this._formBuilder.group({
            oid: [this.vendor.oid],
            name: [this.vendor.name, Validators.required],
            surname: [this.vendor.surname, Validators.required],
            email: [this.vendor.email, [Validators.required, Validators.email]],
            business_name: [this.vendor.business_name, Validators.required],
            address: [this.vendor.address, Validators.required],
            tel: [this.vendor.tel],
            cell: [this.vendor.cell],
            piva: [this.vendor.piva],
            iban: [this.vendor.iban],
            pec: [this.vendor.pec]
        });

        return this.vendorForm;
    }

    

  
    saveVendor(): void {
      
        const data = this.vendorForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);
        // console.log(">>>>>>>>>", data);

        this._vendorService.saveVendor(data)
            .then(() => {

                // Trigger the subscription with new data
                this._vendorService.onUserChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Fornitore aggiornato', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
            }, error => {
                this._matSnackBar.open('Errore aggiornamento fornitore!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error saveVendor " + error);
            });
    }


    async addVendor(): Promise<void> {
        let errors: boolean = false;
        const data = this.vendorForm.getRawValue();
        // console.log(">>>>>>>>>", data);

        this._vendorService.addVendor(data)
            .then(() => {

                // Trigger the subscription with new data
                this._vendorService.onUserChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Fornitore aggiunto', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });

                // Change the location with new one
                //this._location.go('apps/e-commerce/products/' + this.user.oid + '/' + this.user.handle);
            }, error => {
                this._matSnackBar.open('Errore aggiunta fornitore!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error addVendor " + error);
            });
    }

    getWACell(cell:string): string {
        if (cell.startsWith("+39"))
            return cell;
        else
            return "+39"+cell;
    }







}





