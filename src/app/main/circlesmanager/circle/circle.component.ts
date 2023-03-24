import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';


import { Circle } from 'app/models/circle.model';
import { CircleService } from './circle.service';
import * as _ from 'lodash';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTabChangeEvent } from '@angular/material';
import { Customer } from 'app/models/customer.model';
import { CustomersService } from 'app/main/customersmanager/customers/customers.service';


@Component({
    selector: 'circlesmanager',
    templateUrl: './circle.component.html',
    styleUrls: ['./circle.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class UserComponent implements OnInit, OnDestroy {
    circle: Circle;
    pageType: string;
    circleForm: FormGroup;
    customers: Customer[];

    public customerFilterCtrl: FormControl = new FormControl();
    public filteredCustomers: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);


    displayedColumns = ['customer', 'delete', 'link'];

    dataSource: any;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true })
    sort: MatSort;
    tabIndex = 0;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * 
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _circleService: CircleService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private _customermanagerService: CustomersService,

    ) {
        // Set the default
        this.circle = new Circle();

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

        this._customermanagerService.getCustomers().subscribe((customers: Customer[]) => {
            this.customers = customers;
            this.filteredCustomers.next(this.customers.slice());
        }, error => console.error(error));

        // Subscribe to update product on changes
        this._circleService.onUserChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(circle => {

                if (circle) {
                    this.circle = new Circle(circle);
                    

                    this.pageType = 'edit';
                    this.dataSource = this.circle.circle_customer_assoc;
                }
                else {
                    this.pageType = 'new';
                    this.circle = new Circle();
                }
                this.circleForm = this.createCircleForm();
            });

        this.customerFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filterCustomers();
            });

       
    }


    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.tabIndex = tabChangeEvent.index;
        //console.log(tabChangeEvent);
    }

    private filterCustomers() {
        if (!this.customers) {
            return;
        }
        // get the search keyword
        let search = this.customerFilterCtrl.value;
        if (!search) {
            this.filteredCustomers.next(this.customers.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredCustomers.next(
            this.customers.filter(customer => JSON.stringify(customer).toLowerCase().indexOf(search) > -1)
        );
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
    createCircleForm(): FormGroup {
        this.circleForm = this._formBuilder.group({
            oid: [this.circle.oid],
            acronym: [this.circle.acronym, Validators.required],
            descr: [this.circle.descr, Validators.required],
            circle_customer_assoc: this.getCustomers()
        });

        return this.circleForm;
    }

    compareObjects(o1: any, o2: any): boolean {
        return o1 && o2 ? o1.oid === o2.oid : false;
    }


    getCustomers(): FormArray {
        return new FormArray(this.circle.circle_customer_assoc.map(item => new FormGroup({
            customer: new FormControl(item.customer)
        })));
    }

    get circleCustomerAssoc() {
        return this.circleForm.get('circle_customer_assoc') as FormArray;
    }

    addCustomer() {
        this.circleCustomerAssoc.push(new FormGroup({
            customer: new FormControl(null)
        }));
        this.dataSource = this.circleCustomerAssoc.value;
    }

    deleteCustomer(idx: number) {
        this.circleCustomerAssoc.removeAt(idx);
        this.dataSource = this.circleCustomerAssoc.value;
        this.circleForm.markAsDirty();
    }

    getOidCustomer(idx: number): number{
        return this.circleCustomerAssoc.value[idx].customer.oid
    }





    saveCircle(): void {


        const data = this.circleForm.getRawValue();

        this._circleService.saveCircle(data)
            .then(() => {

                // Trigger the subscription with new data
                this._circleService.onUserChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Cerchia aggiornata', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
            }, error => {
                this._matSnackBar.open('Errore aggiornamento cerchia!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error saveCircle " + error);
            });
    }


    async addCircle(): Promise<void> {
        const data = this.circleForm.getRawValue();

        this._circleService.addCircle(data)
            .then(() => {

                // Trigger the subscription with new data
                this._circleService.onUserChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Cerchia aggiunta', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });

                // Change the location with new one
                //this._location.go('apps/e-commerce/products/' + this.user.oid + '/' + this.user.handle);
            }, error => {
                this._matSnackBar.open('Errore aggiunta cerchia!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error addCircle " + error);
            });
    }








}