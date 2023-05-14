import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';


import { Customer } from 'app/models/customer.model';
import { CustomerService } from './customer.service';
import * as _ from 'lodash';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTabChangeEvent } from '@angular/material';
import { Circle } from 'app/models/circle.model';
import { CirclesService } from 'app/main/circlesmanager/circles/circles.service';
import { Attribute } from 'app/models/attribute.model';
import { MatTableDataSource } from '@angular/material/table';
import { EventsService } from '../../eventsmanager/events/events.service';
import { Event } from 'app/models/event.model';


@Component({
    selector: 'customersmanager',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CustomerComponent implements OnInit, OnDestroy {
    customer: Customer;
    pageType: string;
    customerForm: FormGroup;
    circles: Circle[];

    public circleFilterCtrl: FormControl = new FormControl();
    public filteredCircles: ReplaySubject<Circle[]> = new ReplaySubject<Circle[]>(1);


    displayedColumns = ['circle', 'delete'];

    displayedColumnsAttr = ['name', 'value', 'actions'];

    displayedColumnsEvent = ['num-auto', 'oid', 'cliente', 'tipo', 'orari', 'stato', 'business'];

    attributes: Attribute[];

    dataSource: any;
    dataSourceAttr: any;
    dataSourceEvent: MatTableDataSource<Event>;
    dataSourceEventNew: MatTableDataSource<Event>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true })
    sort: MatSort;
    tabIndex = 0;
    @ViewChild('filter', {static: true})
    filter: ElementRef;
    customer_id: any;

    // Private
    private _unsubscribeAll: Subject<any>;
    private events: Event[];

    /**
     * Constructor
     *
     * 
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _customerService: CustomerService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private _circlemanagerService: CirclesService,
        private _eventsService: EventsService,
        private route: ActivatedRoute
    ) {
        // Set the default
        this.customer = new Customer();

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
        this.route.params.subscribe(params => {
          this.customer_id = params['id']; // get the value of the 'id' parameter
          // console.log(this.customer_id);
        });
        this._circlemanagerService.getCircles().subscribe((circles: Circle[]) => {
            this.circles = circles;
            this.filteredCircles.next(this.circles.slice());
        }, error => console.error(error));

        this._customerService.getAttributes().subscribe((attributes: Attribute[]) => {
            this.attributes = attributes;
            if (this.pageType == 'new') {
                this.customerForm = this.createCustomerForm();
                this.attributes.forEach(attr => {
                    attr.value = '';
                    this.addAttributeInit(attr);
                });
                //this.customerForm = this.createCustomerForm();
            }
            if (this.pageType == 'edit') {
                this.customerForm = this.createCustomerForm();
                this.attributes.forEach(attr => {
                    let found = this.customer.attribute_assoc.find(elem => elem.name == attr.name);
                    if (!found) {
                        attr.value = '';
                        this.addAttributeInit(attr);
                    }
                });
                //this.customerForm = this.createCustomerForm();
            }
            
        }, error => console.error(error));


        // Subscribe to update product on changes
        this._customerService.onUserChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(customer => {

                if (customer) {
                    this.customer = new Customer(customer);
                    this.dataSource = this.customer.circle_customer_assoc;
                    this.dataSourceAttr = this.customer.attribute_assoc;
                    this.pageType = 'edit';
                }
                else {
                    this.pageType = 'new';
                    this.customer = new Customer();
                }
                this.customerForm = this.createCustomerForm();
            });

            this.circleFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filterCircles();
            });

        
        this._eventsService.getEvents().subscribe((events: Event[]) => {
          this.events = events;
          // console.log(events)
          // oid, customer.name, customer.surname, type.descr, from, to, status.descr, business.descr
          let extractData = []
          events.map((item:any) => {
            extractData.push({ 
              oid: item.oid, 
              cliente: item.customer.name + ' ' + item.customer.surname,
              tipo: item.type.descr,
              orari: item.from + '\n' + item.to,
              stato: item.status.descr,
              business: item.business.descr
            })
          });
          // console.log(extractData)
          this.dataSourceEvent = new MatTableDataSource(extractData);
          this.dataSourceEvent.sort = this.sort;
          this.dataSourceEvent.paginator = this.paginator
          // console.log(this.dataSourceEvent)
        }, error => console.error(error));
        //setTimeout(() => this.dataSourceEvent.paginator = this.paginator)

        // Get customer events new
        this._eventsService.getCustomerEvents(this.customer_id).subscribe((events: Event[]) => {
          this.events = events;
          // console.log(events)
          // oid, customer.name, customer.surname, type.descr, from, to, status.descr, business.descr
          let extractData = []
          events.map((item:any) => {
            extractData.push({ 
              oid: item.oid, 
              cliente: item.customer.name + ' ' + item.customer.surname,
              tipo: item.type.descr,
              orari: item.from + '\n' + item.to,
              stato: item.status.descr,
              business: item.business.descr
            })
          });
          // console.log(extractData)
          this.dataSourceEventNew = new MatTableDataSource(extractData);
          this.dataSourceEventNew.sort = this.sort;
          this.dataSourceEventNew.paginator = this.paginator
          // console.log(this.dataSourceEventNew)
        }, error => console.error(error));
    }

    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.tabIndex = tabChangeEvent.index;
        //console.log(tabChangeEvent);
    }

    private filterCircles() {
        if (!this.circles) {
            return;
        }
        // get the search keyword
        let search = this.circleFilterCtrl.value;
        if (!search) {
            this.filteredCircles.next(this.circles.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredCircles.next(
            this.circles.filter(circle => JSON.stringify(circle).toLowerCase().indexOf(search) > -1)
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
    createCustomerForm(): FormGroup {
        this.customerForm = this._formBuilder.group({
            oid: [this.customer.oid],
            oid_customer_by_user: [this.customer.oid_customer_by_user],
            name: [this.customer.name, Validators.required],
            surname: [this.customer.surname, Validators.required],
            address: [this.customer.address, Validators.required],
            desc: [this.customer.desc],
            email: [this.customer.email, [Validators.required, Validators.email]],
            tel: [this.customer.tel],
            cell: [this.customer.cell],
            piva: [this.customer.piva],
            circle_customer_assoc: this.getCircles(),
            attribute_assoc: this.getAttribute()
        });
        return this.customerForm;
    }


    compareObjects(o1: any, o2: any): boolean {
        return o1 && o2 ? o1.oid === o2.oid : false;
    }


    getAttribute(): FormArray {
        return new FormArray(this.customer.attribute_assoc.map(item => new FormGroup({
            name: new FormControl(item.name),
            value: new FormControl(item.value)
        })));
    }

    get attributeCustomerAssoc() {
        return this.customerForm.get('attribute_assoc') as FormArray;
    }

    addAttribute() {
        this.attributeCustomerAssoc.push(new FormGroup({
            name: new FormControl(null),
            value: new FormControl(null)
        }));
        this.dataSourceAttr = this.attributeCustomerAssoc.value;
    }

    addAttributeInit(attr:Attribute) {
        this.attributeCustomerAssoc.push(new FormGroup({
            oid: new FormControl(attr.oid),
            name: new FormControl(attr.name),
            value: new FormControl(attr.value)
        }));
        this.dataSourceAttr = this.attributeCustomerAssoc.value;
    }

    deleteAttribute(idx: number) {
        this.attributeCustomerAssoc.removeAt(idx);
        this.dataSourceAttr = this.attributeCustomerAssoc.value;
        this.customerForm.markAsDirty();
    }


    getCircles(): FormArray {
        return new FormArray(this.customer.circle_customer_assoc.map(item => new FormGroup({
            circle: new FormControl(item.circle)
        })));
    }

    get circleCustomerAssoc() {
        return this.customerForm.get('circle_customer_assoc') as FormArray;
    }

    addCircle() {
        this.circleCustomerAssoc.push(new FormGroup({
            circle: new FormControl(null)
        }));
        this.dataSource = this.circleCustomerAssoc.value;
    }

    deleteCircle(idx: number) {
        this.circleCustomerAssoc.removeAt(idx);
        this.dataSource = this.circleCustomerAssoc.value;
        this.customerForm.markAsDirty();
    }



    saveCustomer(): void {
        const data = this.customerForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);

        this._customerService.saveCustomer(data)
            .then(() => {

                // Trigger the subscription with new data
                this._customerService.onUserChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Cliente aggiornato', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
            }, error => {
                this._matSnackBar.open('Errore aggiornamento cliente!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error saveCustomer " + error);
            });
    }


    async addCustomer(): Promise<void> {
        const data = this.customerForm.getRawValue();

        this._customerService.addCustomer(data)
            .then(() => {

                // Trigger the subscription with new data
                //this._customerService.onUserChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Cliente aggiunto', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });

                // Change the location with new one
                //this._location.go('apps/e-commerce/products/' + this.user.oid + '/' + this.user.handle);
            }, error => {
                this._matSnackBar.open('Errore aggiunta cliente!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error addCustomer " + error);
            });
    }

    getWACell(cell: string): string {
        if (cell.startsWith("+39"))
            return cell;
        else
            return "+39" + cell;
    }

}




