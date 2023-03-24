import { Component, ElementRef, Injectable, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, pairwise, startWith, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { EventService } from './event.service';
import { Event } from 'app/models/event.model';
import { Business } from 'app/models/business.model';
import { Customer } from 'app/models/customer.model';
import { EventType } from 'app/models/eventType.model';
import { EventStatus } from 'app/models/eventStatus.model';
import { MyBusinessesService } from 'app/main/mybusiness/mybusinesses/mybusinesses.service';
import { CustomersService } from 'app/main/customersmanager/customers/customers.service';
import { EventTypesService } from 'app/main/eventtypesmanager/eventtypes/eventtypes.service';
import { MatAutocompleteTrigger, MatCheckboxChange, MatListOption, MatTabChangeEvent, TooltipPosition } from '@angular/material';
import { Vendor } from 'app/models/vendor.model';
import { VendorsService } from 'app/main/vendorsmanager/vendors/vendors.service';
import { Config } from 'app/app.config';
import { MatFabMenu } from '@angular-material-extensions/fab-menu';

import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import { PaymentType } from 'app/models/paymentType.model';
import { PaymentMethod } from 'app/models/paymentMethod.model';
import { ResourcesService } from 'app/main/resourcesmanager/resources/resources.service';
import { ResourceType } from 'app/models/resourceType.model';
import { Category } from 'app/models/category.model';
import { Skill } from 'app/models/skill.model';
import { Resource } from 'app/models/resource.model';
import { CategoriesService } from 'app/main/categoriesmanager/categories/categories.service';
import { SkillsService } from 'app/main/skillsmanager/skills/skills.service';
import { ResourceService } from 'app/main/resourcesmanager/resource/resource.service';
import { EventDetail } from 'app/models/eventDetail.model';
import { DatePipe } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { Attribute } from 'app/models/attribute.model';
import { element } from 'protractor';
import { V } from '@angular/cdk/keycodes';
import { Package } from 'app/models/package.model';
import { PackagesService } from 'app/main/packagemanager/packages/packages.service';
import { ThemeService } from 'ng2-charts';
// import { ConsoleReporter } from 'jasmine';



@Component({
    selector: 'eventsmanager',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class EventComponent implements OnInit, OnDestroy {
    oldPackages: Package[] = [];
    isDisabled: boolean = true;
    isNewCustomerDisabled: boolean = false;
    isSelectCustomerDisabled: boolean = false;
    event: Event
    pageType: string;
    eventForm: FormGroup;
    businesses: Business[];
    customers: Customer[];
    eventTypes: EventType[];
    eventStatuses: EventStatus[];
    paymentTypes: PaymentType[];
    paymentMethods: PaymentMethod[];
    vendors: Vendor[];
    resourceTypes: ResourceType[];
    categories: Category[];
    skills: Skill[];
    resources: Resource[];
    resourcesNoShow: Resource[] = [];
    extras: any[];
    pkgs: Package[];
    logoSrc: string = '';
    fileSrc: string = '';
    disabledUploadBtn: boolean = true;
    positionOptions: TooltipPosition[] = ['below'];
    fabButtonsRandom: MatFabMenu[] = [
        {
            id: 1,
            icon: 'print',
            tooltip: 'Stampa',
            tooltipPosition: this.positionOptions[0],
            color: 'accent'
        },
        {
            id: 2,
            icon: 'cloud_download',
            tooltip: 'Scarica',
            tooltipPosition: this.positionOptions[0],
            color: 'accent'
        },
        {
            id: 3,
            icon: 'email',
            tooltip: 'Invia per Email',
            tooltipPosition: this.positionOptions[0],
            color: 'accent'
        },
        {
            id: 4,
            icon: 'message',
            tooltip: 'Invia per WhatsApp',
            tooltipPosition: this.positionOptions[0],
            color: 'accent'
        }
    ];


    public filteredBusinesses: ReplaySubject<Business[]> = new ReplaySubject<Business[]>(1);
    public businessFilterCtrl: FormControl = new FormControl();


    public filteredCustomers: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
    public customerFilterCtrl: FormControl = new FormControl();

    public filteredEventTypes: ReplaySubject<EventType[]> = new ReplaySubject<EventType[]>(1);
    public eventTypeFilterCtrl: FormControl = new FormControl();

    public filteredEventStatuses: ReplaySubject<EventStatus[]> = new ReplaySubject<EventStatus[]>(1);
    public eventStatusFilterCtrl: FormControl = new FormControl();


    public filteredVendors: ReplaySubject<Vendor[]> = new ReplaySubject<Vendor[]>(1);
    public vendorsFilterCtrl: FormControl = new FormControl();


    public filteredPaymentTypes: ReplaySubject<PaymentType[]> = new ReplaySubject<PaymentType[]>(1);
    public paymentTypesFilterCtrl: FormControl = new FormControl();

    public filteredPaymentMethods: ReplaySubject<PaymentMethod[]> = new ReplaySubject<PaymentMethod[]>(1);
    public paymentMethodsFilterCtrl: FormControl = new FormControl();


    public filteredResourceTypes: ReplaySubject<ResourceType[]> = new ReplaySubject<ResourceType[]>(1);
    public resourceTypesFilterCtrl: FormControl = new FormControl();

    public filteredCategories: ReplaySubject<Category[]> = new ReplaySubject<Category[]>(1);
    public categoriesFilterCtrl: FormControl = new FormControl();

    public filteredSkills: ReplaySubject<Skill[]> = new ReplaySubject<Skill[]>(1);
    public skillsFilterCtrl: FormControl = new FormControl();

    public filteredResources: ReplaySubject<Resource[]> = new ReplaySubject<Resource[]>(1);
    public resourcesFilterCtrl: FormControl = new FormControl();


    public filteredExtras: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
    public extrasFilterCtrl: FormControl = new FormControl();

    public filteredPackages: ReplaySubject<Package[]> = new ReplaySubject<Package[]>(1);
    public packagesFilterCtrl: FormControl = new FormControl();

    @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
    // logoSrc: string = '';
    attSrc: string = '';
    logo: File;
    attFile: File;
    imageError: string;

    displayedColumnsAttr = ['name', 'value', 'actions'];

    attributes: Attribute[];

    dataSource: any;
    dataSourceAttr: any;
    dataSourceExtra: any;
    dataSourceVendor: any;
    dataSourcePayment: any;
    dataSourcePackage: any;

    hours;
    minutes;

    tabIndex = 0;
    displayedColumns = ["resourceType", "category", "skill", "resource", "qta", "hours", "days", "price", "pricebt", "total_price", "note", "delete"];
    displayedColumnsExtra = ["extra_descr", "qta", "price", "total_price", "note", "delete"];
    displayedColumnsPackage = ["package", "descr", "total_price", "delete"];
    displayedColumnsVendors = ["vendorAssoc", "contatti", "delete"];
    displayedColumnsPayments = ["paymentType", "paymentMethod", "amount", "paymentDate", "paymentNote", "delete"];
    displayedColumnsSummary = ["avatar", "category", "skill", "name", "qta", "hours", "days", "note"];
    displayedColumnsSummaryExtra = ["descr", "qta", "note"];
    //
    disabledDate = new Date('2023-03-21');

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
        private _eventService: EventService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private _businessService: MyBusinessesService,
        private _customerService: CustomersService,
        private _eventTypesService: EventTypesService,
        private _vendorService: VendorsService,
        private _resourceTypeService: ResourceService,
        private _categoriesService: CategoriesService,
        private _skillsService: SkillsService,
        private _resourcesService: ResourcesService,
        private _packagesService: PackagesService,
        public datepipe: DatePipe,
        private route: ActivatedRoute
    ) {
        // Set the default
        this.event = new Event();

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
        let customerId = this.route.snapshot.queryParamMap.get('customerId');
        this._businessService.getBusinesses().subscribe((businesses: Business[]) => {
            this.businesses = businesses;
            this.filteredBusinesses.next(this.businesses.slice());
            if (this.businesses && this.businesses.length == 1) {
                this.eventForm.get('business').setValue(this.businesses[0]);
            }
            this._eventService.getAttributes().subscribe((attributes: Attribute[]) => {
                this.attributes = attributes;
                if (this.pageType == 'new') {
                    if (!this.eventForm)
                        this.eventForm = this.createEventForm();
                    this.attributes.forEach(attr => {
                        if (!attr.business) {
                            attr.value = '';
                            this.addAttributeInit(attr);
                        }
                        if (this.businesses.length == 1 && attr.business && attr.business.oid == this.businesses[0].oid) {
                            attr.value = '';
                            this.addAttributeInit(attr);
                        }
                    });
                    //this.customerForm = this.createCustomerForm();
                }
                if (this.pageType == 'edit') {
                    if (!this.eventForm)
                        this.eventForm = this.createEventForm();
                    this.attributes.forEach(attr => {
                        let found = this.event.attribute_assoc.find(elem => elem.name == attr.name);
                        if (!found && !attr.business) {
                            attr.value = '';
                            this.addAttributeInit(attr);
                        }
                        if (!found && this.event && this.event.business && attr.business && attr.business.oid == this.event.business.oid) {
                            attr.value = '';
                            this.addAttributeInit(attr);
                        }
                    });
                    //this.customerForm = this.createCustomerForm();
                }
            }, error => console.error(error));
        }, error => console.error(error));

        /*this._eventService.getAttributes().subscribe((attributes: Attribute[]) => {
            this.attributes = attributes;
            if (this.pageType == 'new') {
                if (!this.eventForm )
                    this.eventForm = this.createEventForm();
                this.attributes.forEach(attr => {
                    if (!attr.business) {
                        attr.value = '';
                        this.addAttributeInit(attr);
                    }
                });
                //this.customerForm = this.createCustomerForm();
            }
            if (this.pageType == 'edit') {
                if (!this.eventForm )
                    this.eventForm = this.createEventForm();
                this.attributes.forEach(attr => {
                    let found = this.event.attribute_assoc.find(elem => elem.name == attr.name);
                    if (!found && !attr.business) {
                        attr.value = '';
                        this.addAttributeInit(attr);
                    }
                });
                //this.customerForm = this.createCustomerForm();
            }
            
        }, error => console.error(error));*/

        if (!customerId) {
            this._customerService.getCustomers().subscribe((customers: Customer[]) => {
                this.customers = customers;
                this.filteredCustomers.next(this.customers.slice());
            }, error => console.error(error));
        }

        this._eventTypesService.getEventTypes().subscribe((eventTypes: EventType[]) => {
            this.eventTypes = eventTypes;
            this.filteredEventTypes.next(this.eventTypes.slice());
        }, error => console.error(error));

        this._eventService.getEventStatus().subscribe((eventStatuses: EventStatus[]) => {
            this.eventStatuses = eventStatuses;
            this.filteredEventStatuses.next(this.eventStatuses.slice());
        }, error => console.error(error));

        this._vendorService.getVendors().subscribe((vendors: Vendor[]) => {
            this.vendors = vendors;
            this.filteredVendors.next(this.vendors.slice());
        }, error => console.error(error));


        this._eventService.getPaymentTypes().subscribe((paymentTypes: PaymentType[]) => {
            this.paymentTypes = paymentTypes;
            this.filteredPaymentTypes.next(this.paymentTypes.slice());
        }, error => console.error(error));


        this._eventService.getPaymentMethods().subscribe((paymentMethods: PaymentMethod[]) => {
            this.paymentMethods = paymentMethods;
            this.filteredPaymentMethods.next(this.paymentMethods.slice());
        }, error => console.error(error));


        this._resourceTypeService.getResourceTypes().subscribe((resourceTypes: ResourceType[]) => {
            this.resourceTypes = resourceTypes;
            this.filteredResourceTypes.next(this.resourceTypes.slice());
        }, error => console.error(error));


        this._categoriesService.getCategories().subscribe((categories: Category[]) => {
            this.categories = categories;
            this.filteredCategories.next(this.categories.slice());
        }, error => console.error(error));

        this._skillsService.getSkills().subscribe((skills: Skill[]) => {
            this.skills = skills;
            this.filteredSkills.next(this.skills.slice());
        }, error => console.error(error));

        this._resourcesService.getResources().subscribe((resources: Resource[]) => {
            this.resources = resources.filter(res => Number(res.available) == 1);
            if (this.resourcesNoShow && this.resourcesNoShow.length > 0) {
                this.resourcesNoShow.forEach((res) => { this.resources.push(res) });
            }
            this.filteredResources.next(this.resources.slice());
        }, error => console.error(error));

        this._eventService.getExtras().subscribe((extras: any[]) => {
            this.extras = extras;
            this.filteredExtras.next(this.extras.slice());
        }, error => console.error(error));

        this._packagesService.getPackage().subscribe((packages: Package[]) => {
            this.pkgs = packages;
            this.filteredPackages.next(this.pkgs.slice());
        }, error => console.error(error));

        // Subscribe to update product on changes
        this._eventService.onRoleChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(event => {
                if (event) {
                  
                    if (this.eventForm) {
                        this.eventForm.controls['customer'].enable();
                        this._customerService.getCustomers().subscribe((customers: Customer[]) => {
                            this.customers = customers;
                            this.filteredCustomers.next(this.customers.slice());
                        }, error => console.error(error));
                    }
                    this.event = new Event(event);
                    if (this.event.business.logo) {
                        this.logoSrc = Config.prop.urlImages + "/business/" + this.event.business.oid + "/" + this.event.business.logo;
                    }
                    //GESTIONE DELLE RISORSE NON PIU' DISPONIBILI
                    if (this.event.event_details) {
                        this.event.event_details.forEach((det) => {
                            if (Number(det.resource.available) == 0) {
                                this.resourcesNoShow.push(det.resource);
                            }
                        })
                    }
                    if (this.event.attach_file) {
                      this.attSrc = Config.prop.urlDocs + "/events/" + this.event.oid + "/" + this.event.attach_file;
                    }

                    this.dataSourceVendor = this.event.vendor_assoc;
                    this.dataSourcePayment = this.event.payment_assoc;
                    this.dataSource = this.event.event_details;
                    this.dataSourceExtra = this.event.extra_details;
                    this.dataSourceAttr = this.event.attribute_assoc;
                    this.dataSourcePackage = this.event.packages_assoc;
                    this.pageType = 'edit';
                    this.eventForm = this.createEventForm();
                }
                else {
                    this.pageType = 'new';
                    this.event = new Event();
                    let dataFrom = this.route.snapshot.queryParamMap.get('data');
                    if (dataFrom) {
                        this.event.from = new Date(dataFrom.replace(/\s/g, "T"));
                    }

                    if (customerId) {
                        this._customerService.getCustomers().subscribe((customers: Customer[]) => {
                            this.customers = customers;
                            let selectedCustomer = this.customers.filter(cust => cust.oid == Number(customerId));
                            this.event.customer = selectedCustomer[0];
                            //this.eventForm = this.createEventForm();
                            this.eventForm.get('customer').setValue(selectedCustomer[0]);
                            this.filteredCustomers.next(this.customers.slice());
                        }, error => console.error(error));
                    }
                }

                if (!this.eventForm)
                    this.eventForm = this.createEventForm();
            });

        this.businessFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filteredBusiness();
            });
        this.customerFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filteredCustomer();
            });
        this.eventTypeFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filteredEventType();
            });
        this.eventStatusFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filteredEventStatus();
            });
        this.vendorsFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filteredVendor();
            });
        this.paymentTypesFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filteredPaymentType();
            });

        this.paymentMethodsFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filteredPaymentMethod();
            });

        this.resourceTypesFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filteredResourceType();
            });


        this.categoriesFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filteredCategory();
            });

        this.skillsFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filteredSkill();
            });

        this.resourcesFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filteredResource();
            });


        this.extrasFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filteredExtra();
            });

        this.packagesFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filteredPackage();
            });

        var allMinutes = '00, 15, 30, 45';
        this.minutes = allMinutes.split(/, +/g).map(function (min) {
            return {
                value: min.toUpperCase(),
                display: min
            };
        });
        var allHours = '00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23';
        this.hours = allHours.split(/, +/g).map(function (hour) {
            return {
                value: hour.toUpperCase(),
                display: hour
            };
        });
    }

    ngAfterViewInit() {
        const controlArray = <FormArray>this.eventForm.get('event_details');
        let index = 0;
        controlArray.controls.forEach(ctrl => {
            let res: Resource = ctrl.get("resource").value;
            if (res) {
                this.checkAvail(res, index);
            }
            index = index + 1;
        });


    }

    checkMin(event, name) {
        // console.log(event.target.value);
        let found = false;
        if (event.target.value && event.target.value.length == 2) {
            this.minutes.forEach(min => {
                if (min.display == event.target.value) {
                    found = true;
                }
            });
            if (!found) {
                this.eventForm.get(name).setValue(null);
            }
        }
    }

    checkHour(event, name) {
        // console.log(event.target.value);
        let found = false;
        if (event.target.value && event.target.value.length == 2) {
            this.hours.forEach(hour => {
                if (hour.display == event.target.value) {
                    found = true;
                }
            });
            if (!found) {
                this.eventForm.get(name).setValue(null);
            }
        }
    }


    onSelectedOptionsChange(value, index) {
        // console.log(value.replace('.', ','));
        const controlArray = <FormArray>this.eventForm.get('event_details');
        controlArray.controls[index].get('price').setValue(value.replace('.', ','));
        this.updateTotal(value);
    }

    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.tabIndex = tabChangeEvent.index;
        //console.log(tabChangeEvent);
    }

    getVendorName(vendor: Vendor): string {
        if (vendor.business_name != null && vendor.business_name != '') {
            return vendor.business_name;
        }
        if (vendor.name != null && vendor.name != '' && vendor.surname != null && vendor.surname != '') {
            return vendor.name + '-' + vendor.surname;
        }
    }

    getResourceName(res: Resource): string {
        if (res.descr != null && res.descr != '') {
            return res.descr;
        }
        if (res.name != null && res.name != '' && res.surname != null && res.surname != '') {
            return res.name + '-' + res.surname;
        }
    }

    getResourceImage(res: Resource) {
        return Config.prop.urlImages + "/resources/" + res.oid + "/" + res.image;
    }

    onChangeCategory(cat: Category, index) {
        //let filterResources = this.resources.filter(r => r.categories_assoc.filter(c => c.oid == cat.oid));
        //let filterResources = this.resources.filter(r => r.oid == 118);
        /*let filterResources = this.resources.filter(r => r.categories_assoc.some(c => c.oid == cat.oid))
        this.filteredResources.next(filterResources.slice());*/
        this.resourcesFilterCtrl.setValue(cat.acronym);
    }

    onChangeBusiness(business: Business) {
        const controlArray = this.attributeEventAssoc;
        let idx = 0;
        controlArray.controls.forEach(ctrl => {
            let business: Business = ctrl.get("business").value;
            if (business) {
                this.attributeEventAssoc.removeAt(idx);
            }
            idx = idx + 1;
        })
        this.attributes.forEach(attr => {
            if (attr.business && attr.business.oid == business.oid) {
                attr.value = '';
                this.addAttributeInit(attr);
            }
        });
    }


    onChangePackage(pkg: Package, index) {


        if (this.oldPackages && this.oldPackages != null) {

            const controlArray = <FormArray>this.eventForm.get('event_details');
            const controlArrayEtra = <FormArray>this.eventForm.get('extra_details');

            this.oldPackages.forEach(oldPkg => {
                let pkg: Package = this.pkgs.find(ele => ele.oid == oldPkg.oid);


                if (pkg.package_details && pkg.package_details.length > 0) {
                    pkg.package_details.forEach(element => {
                        let resource = this.resources.filter(el => el.oid == element.resource.oid);
                        let i = 0;
                        controlArray.controls.forEach(ctrl => {
                            let rs: Resource = ctrl.get('resource').value;
                            if (rs.oid == resource[0].oid && ctrl.get('oid_package') && ctrl.get('oid_package').value == pkg.oid) {
                                //this.eventDetails.removeAt(i);
                                this.deleteResource(i);
                            }
                            i = i + 1;
                        });
                    });
                }

                if (pkg.extra_details && pkg.extra_details.length > 0) {
                    pkg.extra_details.forEach(element => {
                        let i = 0;
                        controlArrayEtra.controls.forEach(ctrl => {
                            if (ctrl.get('oid_package') && ctrl.get('oid_package').value == pkg.oid) {
                                //this.eventDetails.removeAt(i);
                                this.deleteExtra(i);
                            }
                            i = i + 1;
                        });
                    });
                }
            })
            this.oldPackages = [];

        }

        const controlArray = <FormArray>this.eventForm.get('packages_assoc');
        /*controlArray.controls[index].get("oid").setValue(pkg.oid);*/
        controlArray.controls[index].get("descr").setValue(pkg.descr);
        controlArray.controls[index].get("total_price").setValue(pkg.total_price.replace(".", ","));

        if (pkg.package_details && pkg.package_details.length > 0) {
            pkg.package_details.forEach(element => {
                this.eventDetails.push(new FormGroup({
                    resourceType: new FormControl(element.resourceType),
                    category: new FormControl(element.category),
                    skill: new FormControl(element.skill),
                    resource: new FormControl(element.resource),
                    is_extra: new FormControl(false),
                    price: new FormControl(element.price),
                    qta: new FormControl(element.qta),
                    note: new FormControl(element.note),
                    /*hours: new FormControl(this.event.total_hours),
                    days: new FormControl(this.event.total_days),*/
                    hours: new FormControl(element.hours),
                    days: new FormControl(element.days),
                    total_price: new FormControl(element.total_price),
                    oid_package: new FormControl(pkg.oid)
                }));
            })
            this.dataSource = this.eventDetails.value;
            this.updateTotal(this.eventDetails.value);
        }

        if (pkg.extra_details && pkg.extra_details.length > 0) {
            pkg.extra_details.forEach(element => {
                this.extraDetails.push(new FormGroup({
                    is_extra: new FormControl(true),
                    price: new FormControl(element.price),
                    qta: new FormControl(element.qta),
                    extra_descr: new FormControl(element.extra_descr),
                    note: new FormControl(element.note),
                    total_price: new FormControl(element.total_price),
                    oid_package: new FormControl(pkg.oid)
                }));

            })
            this.dataSourceExtra = this.extraDetails.value;
            this.updateTotal(this.extraDetails.value);
        }


    }

    onChangeResource(res: Resource, index) {

        let i = 0;
        const controlArray = <FormArray>this.eventForm.get('event_details');
        controlArray.controls.forEach(ctrl => {
            let resource: Resource = ctrl.get("resource").value;
            if (resource.oid == res.oid && i != index) {
                this._matSnackBar.open('Attenzione: Risorsa già selezionata!', 'OK', {
                    verticalPosition: 'top',
                    duration: 3000
                });
            }
            i = + 1;
        });

        this.checkAvail(res, index);

        if (res.prices && res.prices.length > 0) {
            res.prices.forEach(element => {
                if (element.default == 1) {
                    //const controlArray = <FormArray>this.eventForm.get('event_details');
                    this.eventDetails.controls[index].get('price').setValue(element.price.replace('.', ','));
                }
            })
        }
        let idx = index;
        if (res.resources_assoc && res.resources_assoc.length > 0) {
            res.resources_assoc.forEach(element => {
                let resource = this.resources.filter(el => el.oid == element.resourceAssoc.oid);
                if (resource[0]) {
                    this.eventDetails.push(new FormGroup({
                        resourceType: new FormControl(null),
                        category: new FormControl(null),
                        skill: new FormControl(null),
                        resource: new FormControl(resource[0]),
                        is_extra: new FormControl(false),
                        price: new FormControl(0),
                        qta: new FormControl(element.qta),
                        note: new FormControl(null),
                        /*hours: new FormControl(this.event.total_hours),
                        days: new FormControl(this.event.total_days),*/
                        hours: new FormControl(this.eventForm.get('total_hours').value),
                        days: new FormControl(this.eventForm.get('total_days').value),
                        total_price: new FormControl(0)
                    }));
                    idx = idx + 1;
                    this.checkAvail(resource[0], idx);
                }
            });
            this.dataSource = this.eventDetails.value;
        }
        this.updateTotal(this.eventDetails.value);

    }

    showWarn(i) {
        const controlArray = <FormArray>this.eventForm.get('event_details');
        let res: Resource = controlArray.controls[i].get('resource').value;
        return res.warning;
    }

    checkAvail(res: Resource, index) {
        res.warning = false;
        if (this.eventForm.get('to').value &&
            this.eventForm.get('from_ts_hh').value &&
            this.eventForm.get('to_ts_hh').value &&
            this.eventForm.get('to_ts_mi').value && res.oid) {
            const data = this.eventForm.getRawValue();
            data.from = data.from + " " + data.from_ts_hh + ":" + data.from_ts_mi + ":" + "00";
            data.to = data.to + " " + data.to_ts_hh + ":" + data.to_ts_mi + ":" + "00";
            let oidEvent = this.eventForm.get("oid").value;
            this._eventService.checkAvail(res.oid, data.from, data.to, oidEvent).then((result) => {
                // console.log(result);
                if (result > 0) {
                    if (res.resourceType.acronym == "HUMAN") {
                        //non disponibile
                        res.warning = true;
                        console.log("NON disponibile");
                        this._matSnackBar.open('Attenzione: Risorsa ' + res.descr + ' non disponibile!', 'OK', {
                            verticalPosition: 'top',
                            duration: 4000
                        });
                    } else {
                        let delta = res.avail_qta - result;
                        if (delta <= 0) {
                            //non disponibile
                            res.warning = true;
                            console.log("NON disponibile");
                            this._matSnackBar.open('Attenzione: Risorsa ' + res.descr + ' non disponibile!', 'OK', {
                                verticalPosition: 'top',
                                duration: 4000
                            });
                        }
                        else {
                            const controlArray = <FormArray>this.eventForm.get('event_details');
                            let currentQta = controlArray.controls[index].get('qta').value;
                            if (currentQta > delta) {
                                //non disponibile
                                res.warning = true;
                                this._matSnackBar.open('Attenzione: Risorsa ' + res.descr + ' non disponibile!', 'OK', {
                                    verticalPosition: 'top',
                                    duration: 4000
                                });
                                console.log("NON disponibile");
                            }
                            else {
                                // disponibile
                                const controlArray = <FormArray>this.eventForm.get('event_details');
                                let currentQta = controlArray.controls[index].get('qta').value;
                                let dispo = delta - currentQta;
                                res.warning = false;
                                /*this._matSnackBar.open('Attenzione: Risorsa '+res.descr+' quantità disponibile '+dispo, 'OK', {
                                    verticalPosition: 'top',
                                    duration: 4000
                                });*/
                                console.log("Disponibile");
                            }
                        }
                    }
                }
                else {
                    const controlArray = <FormArray>this.eventForm.get('event_details');
                    let currentQta = controlArray.controls[index].get('qta').value;
                    if (currentQta > res.avail_qta) {
                        res.warning = true;
                        this._matSnackBar.open('Attenzione: Risorsa ' + res.descr + ' non disponibile!', 'OK', {
                            verticalPosition: 'top',
                            duration: 4000
                        });
                        console.log("NON disponibile");
                    }
                    else {
                        let dispo = res.avail_qta - currentQta;
                        res.warning = false;
                        /*this._matSnackBar.open('Attenzione: Risorsa '+res.descr+' quantità disponibile '+dispo, 'OK', {
                            verticalPosition: 'top',
                            duration: 4000
                        });*/
                        console.log("Disponibile");
                    }
                }
            }, error => {
                this._matSnackBar.open('Errore verifica disponibilità!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error checkAvail " + error);
            });
        } else {
            if (res.oid) {
                this._matSnackBar.open('Per sapere la disponibilità occorre impostare inizio e fine evento!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
            }
        }
    }


    onSelected(event, elem) {
        // console.log(event)
        // console.log(elem)
        if (event == 1) {//print
            this.print(elem);
            // this.print_other(elem)
        }
        if (event == 2) {//download
            //this.download();
            this.download(elem);
        }
        if (event == 3) {//email
            this.sendInvoiceEmail();

        }
        if (event == 4) {//whatsapp
            this.sendPdfWP();
        }
    }

    sendPdfWP() {
        let mail = document.createElement("a");
        mail.target = "_blank";
        mail.href = 'https://wa.me/' + this.getWACell(this.event.customer.cell) + "?text=";
        mail.click();
    }

    sendInvoiceEmail() {
        let mail = document.createElement("a");
        let email = this.event.customer.email;
        // Using es6 template literals add the html innerText property and anchor element created to mailto body parameter
        mail.href = 'mailto:' + email + '?subject=Titolo';
        mail.click();
    }

    // print_other(elem) {
    //   var divContents = document.getElementById(elem).innerHTML;
    //   var a = window.open('', '', '');
    //   a.document.write('<html>');
    //   a.document.write('<body>');
    //   a.document.write(divContents);
    //   a.document.write('</body></html>');
    //   a.document.close();
    //   a.print();
    // }


    print(elem) {
      // console.log("here is elem");
        /*let divToPrint = document.getElementById('invoice').innerHTML;
        let newWindow = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        newWindow.document.open();
        newWindow.document.write(`
        <html>
        
            <head>
              <title>Print Invoice</title>
              <style>
              
              </style>
            </head>
            <body onload="window.print();window.close()">${divToPrint}   
            </body>
          </html>
        `);
        newWindow.document.close();*/
        let result: any;
        let DATA = document.getElementById(elem);
        if (elem == 'card') {
          DATA.style.border = "none";   
        }
        else {
          result = DATA.cloneNode(true);
          result.insertAdjacentElement('beforebegin', document.getElementById("head"))
        }
        // console.log(DATA)

        var element = document.getElementById(elem);
        var opt = {
          margin:       1,
          filename:     `${this.event.status.descr}${'_'}${this.event.customer.name}${'_'}${this.event.customer.surname}${'_'}${this.event.oid}${'.pdf'}`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        // New Promise-based usage:
        html2pdf().from(element).set(opt).save();

        // html2canvas(result, { allowTaint: true, useCORS: true }).then(canvas => {

        //     let fileWidth = 208;
        //     let fileHeight = canvas.height * fileWidth / canvas.width;

        //     const FILEURI = canvas.toDataURL('image/png')
        //     let PDF = new jspdf('p', 'mm', 'a4');
        //     let position = 0;
        //     PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)

        //     PDF.autoPrint();

        //     if (elem == 'card') {
        //         DATA.style.border = "1px solid";
        //         PDF.save(this.event.status.descr + "_" + this.event.customer.name + "_" + this.event.customer.surname + "_" + this.event.oid + ".pdf");
        //     }
        //     if (elem == 'summary') {
        //         PDF.save("RIEPILOGO_" + this.event.customer.name + "_" + this.event.customer.surname + "_" + this.event.oid + ".pdf");
        //     }
        // });
    }



    public download(elem): void {

        let result;
        let DATA = document.getElementById(elem);
        if (elem == 'card') {
            DATA.style.border = "none";
        }
        else {
            result = DATA.cloneNode(true);
            result.insertAdjacentElement('beforebegin', document.getElementById("head"))
        }


        html2canvas(result, { allowTaint: true, useCORS: true }).then(canvas => {

            let fileWidth = 208;
            let fileHeight = canvas.height * fileWidth / canvas.width;

            const FILEURI = canvas.toDataURL('image/png')
            let PDF = new jspdf('p', 'mm', 'a4');
            let position = 0;
            PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)

            if (elem == 'card') {
                DATA.style.border = "1px solid";
                PDF.save(this.event.status.descr + "_" + this.event.customer.name + "_" + this.event.customer.surname + "_" + this.event.oid + ".pdf");
            }
            if (elem == 'summary') {
                PDF.save("RIEPILOGO_" + this.event.customer.name + "_" + this.event.customer.surname + "_" + this.event.oid + ".pdf");
            }
        });
    }


    compareObjects(o1: any, o2: any): boolean {
        return o1 && o2 ? o1.oid === o2.oid : false;
    }

    private filteredBusiness() {
        if (!this.businesses) {
            return;
        }
        // get the search keyword
        let search = this.businessFilterCtrl.value;
        if (!search) {
            this.filteredBusinesses.next(this.businesses.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredBusinesses.next(
            this.businesses.filter(business => JSON.stringify(business).toLowerCase().indexOf(search) > -1)
        );
    }


    private filteredCustomer() {
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


    private filteredEventType() {
        if (!this.eventTypes) {
            return;
        }
        // get the search keyword
        let search = this.eventTypeFilterCtrl.value;
        if (!search) {
            this.filteredEventTypes.next(this.eventTypes.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredEventTypes.next(
            this.eventTypes.filter(eventType => JSON.stringify(eventType).toLowerCase().indexOf(search) > -1)
        );
    }


    private filteredEventStatus() {
        if (!this.eventStatuses) {
            return;
        }
        // get the search keyword
        let search = this.eventStatusFilterCtrl.value;
        if (!search) {
            this.filteredEventStatuses.next(this.eventStatuses.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredEventStatuses.next(
            this.eventStatuses.filter(eventStatus => JSON.stringify(eventStatus).toLowerCase().indexOf(search) > -1)
        );
    }

    private filteredVendor() {
        if (!this.vendors) {
            return;
        }
        // get the search keyword
        let search = this.vendorsFilterCtrl.value;
        if (!search) {
            this.filteredVendors.next(this.vendors.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredVendors.next(
            this.vendors.filter(vendor => JSON.stringify(vendor).toLowerCase().indexOf(search) > -1)
        );
    }


    private filteredPaymentType() {
        if (!this.paymentTypes) {
            return;
        }
        // get the search keyword
        let search = this.paymentTypesFilterCtrl.value;
        if (!search) {
            this.filteredPaymentTypes.next(this.paymentTypes.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredPaymentTypes.next(
            this.paymentTypes.filter(paymentType => JSON.stringify(paymentType).toLowerCase().indexOf(search) > -1)
        );
    }

    private filteredPaymentMethod() {
        if (!this.paymentMethods) {
            return;
        }
        // get the search keyword
        let search = this.paymentMethodsFilterCtrl.value;
        if (!search) {
            this.filteredPaymentMethods.next(this.paymentMethods.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredPaymentMethods.next(
            this.paymentMethods.filter(paymentMethod => JSON.stringify(paymentMethod).toLowerCase().indexOf(search) > -1)
        );
    }


    private filteredResourceType() {
        if (!this.resourceTypes) {
            return;
        }
        // get the search keyword
        let search = this.resourceTypesFilterCtrl.value;
        if (!search) {
            this.filteredResourceTypes.next(this.resourceTypes.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredResourceTypes.next(
            this.resourceTypes.filter(resourceType => JSON.stringify(resourceType).toLowerCase().indexOf(search) > -1)
        );
    }

    private filteredCategory() {
        if (!this.categories) {
            return;
        }
        // get the search keyword
        let search = this.categoriesFilterCtrl.value;
        if (!search) {
            this.filteredCategories.next(this.categories.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredCategories.next(
            this.categories.filter(category => JSON.stringify(category).toLowerCase().indexOf(search) > -1)
        );
    }

    private filteredSkill() {
        if (!this.skills) {
            return;
        }
        // get the search keyword
        let search = this.skillsFilterCtrl.value;
        if (!search) {
            this.filteredSkills.next(this.skills.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredSkills.next(
            this.skills.filter(skill => JSON.stringify(skill).toLowerCase().indexOf(search) > -1)
        );
    }

    private filteredResource() {
        if (!this.resources) {
            return;
        }
        // get the search keyword
        let search = this.resourcesFilterCtrl.value;
        if (!search) {
            this.filteredResources.next(this.resources.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredResources.next(
            this.resources.filter(resource => JSON.stringify(resource).toLowerCase().indexOf(search) > -1)
        );
    }


    private filteredExtra() {
        if (!this.extras) {
            return;
        }
        // get the search keyword
        let search = this.extrasFilterCtrl.value;
        if (!search) {
            this.filteredExtras.next(this.extras.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredExtras.next(
            this.extras.filter(el => JSON.parse(el).extra_descr.toLowerCase().indexOf(search) > -1)
        );
    }


    private filteredPackage() {
        if (!this.pkgs) {
            return;
        }
        // get the search keyword
        let search = this.packagesFilterCtrl.value;
        if (!search) {
            this.filteredPackages.next(this.pkgs.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredPackages.next(
            this.pkgs.filter(pkg => JSON.stringify(pkg).toLowerCase().indexOf(search) > -1)
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
    createEventForm(): FormGroup {
        this.eventForm = this._formBuilder.group({
            oid: [this.event.oid],
            business: this.event.business,
            customer: this.event.customer,
            type: new FormControl(this.event.type, [Validators.required]),
            status: this.event.status,
            /*from: this.event.from,
            to: this.event.to,*/
            from: this.event.from_dt,
            to: this.event.to_dt,
            from_ts_hh: this.event.from_ts_hh,
            from_ts_mi: this.event.from_ts_mi,
            to_ts_hh: this.event.to_ts_hh,
            to_ts_mi: this.event.to_ts_mi,
            address: this.event.address,
            info_event: this.event.info_event,
            total: this.event.total,
            total_real: this.event.total_real,
            total_taxable: this.event.total_taxable,
            vat: this.event.vat,
            note: this.event.note,
            total_days: this.event.total_days,
            total_hours: this.event.total_hours,
            packages_assoc: this.getPackages(),
            event_details: this.getEventDetails(),
            extra_details: this.getExtraDetails(),
            vendor_assoc: this.getVendors(),
            payment_assoc: this.getPayments(),
            all_day: this.event.all_day,
            new_customer: "",
            customer_name: "",
            customer_surname: "",
            customer_cell: "",
            attribute_assoc: this.getAttribute(),
            attach_file: this.event.attach_file
        });

        this.eventForm.get('from').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.calculateDiff();
            });

        this.eventForm.get('from_ts_hh').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.calculateDiff();
            });

        this.eventForm.get('from_ts_mi').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.calculateDiff();
            });

        this.eventForm.get('to').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.calculateDiff();
            });

        this.eventForm.get('to_ts_hh').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.calculateDiff();
            });

        this.eventForm.get('to_ts_mi').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.calculateDiff();
            });

        this.eventForm.get('packages_assoc').valueChanges.pipe(
            startWith(this.eventForm.get('packages_assoc').value),
            pairwise()
        ).subscribe(
            ([old, value]) => {
                if (old.length > 0 && old.length == value.length && JSON.stringify(old) != JSON.stringify(value)) {
                    let i = 0;
                    old.forEach(element => {
                        if (element && element.package && element.package.oid && value[i].package && value[i].package.oid != element.package.oid)
                            this.oldPackages.push(element.package);
                        i = + 1;
                    });

                }
            }
        )


        return this.eventForm;
    }



    getDiscount(event): number {
        return ((event.total - event.total_real) / event.total) * 100;
    }

    getDiscountValue(event): number {
        return (event.total - event.total_real);
    }

    getAttribute(): FormArray {
        return new FormArray(this.event.attribute_assoc.map(item => new FormGroup({
            name: new FormControl(item.name),
            business: new FormControl(item.business),
            value: new FormControl(item.value)
        })));
    }

    get attributeEventAssoc() {
        return this.eventForm.get('attribute_assoc') as FormArray;
    }

    addAttribute() {
        this.attributeEventAssoc.push(new FormGroup({
            name: new FormControl(null),
            business: new FormControl(null),
            value: new FormControl(null)
        }));
        this.dataSourceAttr = this.attributeEventAssoc.value;
    }

    addAttributeInit(attr: Attribute) {
        this.attributeEventAssoc.push(new FormGroup({
            oid: new FormControl(attr.oid),
            name: new FormControl(attr.name),
            business: new FormControl(attr.business),
            value: new FormControl(attr.value)
        }));
        this.dataSourceAttr = this.attributeEventAssoc.value;
    }

    deleteAttribute(idx: number) {
        this.attributeEventAssoc.removeAt(idx);
        this.dataSourceAttr = this.attributeEventAssoc.value;
        this.eventForm.markAsDirty();
    }




    filter(val: string) {
        this.filteredExtras.next(
            this.extras.filter(el => el.extra_descr.indexOf(val) > -1)
        );
    }



    updateTotal(event) {

        let total: number = 0;
        let idx = 0;
        //let index = 0;
        this.eventDetails.value.forEach(element => {
            let price = 0;
            this.checkAvail(element.resource, idx);
            if (element.price) {
                if (element.price.indexOf(".") > -1 && element.price.indexOf(",") > -1) {
                    price = +(element.price.replace(".", "").replace(",", ".")) * element.qta;
                    total += price;
                }
                else if (element.price.indexOf(".") === -1 && element.price.indexOf(",") > -1) {
                    price = +(element.price.replace(",", ".")) * element.qta;
                    total += price;
                }
                else {
                    price = +element.price * element.qta;
                    total += price;
                }
                const controlArray = <FormArray>this.eventForm.get('event_details');
                let priceStr = (Math.round((price + Number.EPSILON) * 100) / 100 + "").replace(".", ",");
                controlArray.controls[idx].get('total_price').patchValue(priceStr);
                //
            }
            idx = idx + 1;
        });
        idx = 0;
        this.extraDetails.value.forEach(element => {
            let price = 0;
            if (element.price) {
                if (element.price.indexOf(".") > -1 && element.price.indexOf(",") > -1) {
                    price = +(element.price.replace(".", "").replace(",", ".")) * element.qta;
                    total += price;
                }
                else if (element.price.indexOf(".") === -1 && element.price.indexOf(",") > -1) {
                    price = +(element.price.replace(",", ".")) * element.qta;
                    total += price;
                }
                else {
                    price = +element.price * element.qta;
                    total += price;
                }
                const controlArray = <FormArray>this.eventForm.get('extra_details');
                let priceStr = (Math.round((price + Number.EPSILON) * 100) / 100 + "").replace(".", ",");
                controlArray.controls[idx].get('total_price').patchValue(priceStr);
                idx = idx + 1;
            }
        });
        let totalStr = (Math.round((total + Number.EPSILON) * 100) / 100 + "").replace(".", ",");

        if (!this.eventForm.get('total_real').value || this.eventForm.get('total').value == this.eventForm.get('total_real').value) {
            this.event.total_real = totalStr;
            this.eventForm.get('total_real').patchValue(totalStr);
        }
        this.event.total = totalStr;
        this.eventForm.get('total').patchValue(totalStr);

    }


    updateTotalVat(event) {
        if (this.eventForm.get('total').value && this.eventForm.get('vat').value) {
            let total = this.eventForm.get('total').value;
            let vat = this.eventForm.get('vat').value;
            let totalTaxStr = (Math.round((Number(total) + Number.EPSILON) * vat) / 100 + "").replace(".", ",");
            this.eventForm.get('total_taxable').patchValue(totalTaxStr);
            let taxable = this.eventForm.get('total_taxable').value.replace(",", ".");
            let total_real = this.eventForm.get('total').value.replace(",", ".");
            let gran_total = ((Number(taxable) + Number(total_real)) + "").replace(".", ",");
            this.eventForm.get('total_real').patchValue(gran_total);
        }
        if (!this.eventForm.get('vat').value) {
            this.eventForm.get('total_real').patchValue(this.eventForm.get('total').value);
            this.eventForm.get('total_taxable').patchValue("");
        }
    }


    getVendors(): FormArray {
        return new FormArray(this.event.vendor_assoc.map(item => new FormGroup({
            vendor: new FormControl(item.vendor)
        })));
    }


    get vendorAssoc() {
        return this.eventForm.get('vendor_assoc') as FormArray;
    }

    getVendorData(idx: number) {
        if (this.vendorAssoc.at(idx)) {
            return this.vendorAssoc.at(idx).value.vendor
        }
        else {
            return null;
        }
    }



    addVendorAssoc() {
        this.vendorAssoc.push(new FormGroup({
            vendor: new FormControl(null)
        }));
        this.dataSourceVendor = this.vendorAssoc.value;
    }

    deleteVendorAssoc(idx: number) {
        this.vendorAssoc.removeAt(idx);
        this.dataSourceVendor = this.vendorAssoc.value;
        this.eventForm.markAsDirty();
    }



    getPayments(): FormArray {
        return new FormArray(this.event.payment_assoc.map(item => new FormGroup({
            paymentType: new FormControl(item.paymentType),
            paymentMethod: new FormControl(item.paymentMethod),
            amount: new FormControl(item.amount),
            paymentDate: new FormControl(item.paymentDate),
            paymentNote: new FormControl(item.paymentNote)
        })));
    }


    get paymentsAssoc() {
        return this.eventForm.get('payment_assoc') as FormArray;
    }



    addPaymentAssoc() {
        this.paymentsAssoc.push(new FormGroup({
            paymentType: new FormControl(null),
            paymentMethod: new FormControl(null),
            amount: new FormControl(null),
            paymentDate: new FormControl(null),
            paymentNote: new FormControl(null)
        }));
        this.dataSourcePayment = this.paymentsAssoc.value;
    }

    deletePaymentAssoc(idx: number) {
        this.paymentsAssoc.removeAt(idx);
        this.dataSourcePayment = this.paymentsAssoc.value;
        this.eventForm.markAsDirty();
    }


    getPackages(): FormArray {
        return new FormArray(this.event.packages_assoc.map(item => new FormGroup({
            package: new FormControl(item),
            descr: new FormControl(item.descr),
            total_price: new FormControl(item.total_price)
        })));
    }


    get packagesAssoc() {
        return this.eventForm.get('packages_assoc') as FormArray;
    }



    addPackage() {
        this.packagesAssoc.push(new FormGroup({
            package: new FormControl(null),
            descr: new FormControl(null),
            total_price: new FormControl(null)
        }));
        this.dataSourcePackage = this.packagesAssoc.value;
    }

    deletePackage(idx: number) {
        const controlArrayPkg = <FormArray>this.eventForm.get('packages_assoc');
        let pkg: Package = controlArrayPkg.controls[idx].value.package;
        const controlArray = <FormArray>this.eventForm.get('event_details');
        const controlArrayEtra = <FormArray>this.eventForm.get('extra_details');

        if (pkg && pkg != null) {
            let copyPkg = this.pkgs.find(ele => ele.oid == pkg.oid);
            pkg = copyPkg;

            if (pkg.package_details && pkg.package_details.length > 0) {
                pkg.package_details.forEach(element => {
                    let resource = this.resources.filter(el => el.oid == element.resource.oid);
                    let i = 0;
                    controlArray.controls.forEach(ctrl => {
                        let rs: Resource = ctrl.get('resource').value;
                        if (rs.oid == resource[0].oid && ctrl.get('oid_package') && ctrl.get('oid_package').value == pkg.oid) {
                            //this.eventDetails.removeAt(i);
                            this.deleteResource(i);
                        }
                        i = i + 1;
                    });
                });
            }

            if (pkg.extra_details && pkg.extra_details.length > 0) {
                pkg.extra_details.forEach(element => {
                    let i = 0;
                    controlArrayEtra.controls.forEach(ctrl => {
                        if (ctrl.get('oid_package') && ctrl.get('oid_package').value == pkg.oid) {
                            //this.eventDetails.removeAt(i);
                            this.deleteExtra(i);
                        }
                        i = i + 1;
                    });
                });
            }
        }


        this.packagesAssoc.removeAt(idx);
        this.dataSourcePackage = this.packagesAssoc.value;
        this.eventForm.markAsDirty();
    }



    getEventDetails(): FormArray {
        return new FormArray(this.event.event_details.map(item => new FormGroup({
            resourceType: new FormControl(item.resourceType),
            category: new FormControl(item.category),
            skill: new FormControl(item.skill),
            resource: new FormControl(item.resource),
            price: new FormControl(item.price),
            qta: new FormControl(item.qta),
            note: new FormControl(item.note),
            hours: new FormControl(item.hours),
            days: new FormControl(item.days),
            total_price: new FormControl(item.total_price),
            oid_package: new FormControl(item.oid_package)
        })));
    }


    get eventDetails() {
        return this.eventForm.get('event_details') as FormArray;
    }



    addResource() {
        this.eventDetails.push(new FormGroup({
            resourceType: new FormControl(null),
            category: new FormControl(null),
            skill: new FormControl(null),
            resource: new FormControl(new Resource()),
            is_extra: new FormControl(false),
            price: new FormControl(null),
            qta: new FormControl(1),
            note: new FormControl(null),
            //hours: new FormControl(this.event.total_hours),
            //days: new FormControl(this.event.total_days),
            hours: new FormControl(this.eventForm.get('total_hours').value),
            days: new FormControl(this.eventForm.get('total_days').value),
            total_price: new FormControl(null),
            oid_package: new FormControl(null)
        }));
        this.dataSource = this.eventDetails.value;
    }

    deleteResource(idx: number) {
        const controlArray = <FormArray>this.eventForm.get('event_details');
        let res = controlArray.controls[idx].get('resource').value;

        this.eventDetails.removeAt(idx);
        if (res.resources_assoc && res.resources_assoc.length > 0) {
            res.resources_assoc.forEach(element => {
                let resource = this.resources.filter(el => el.oid == element.resourceAssoc.oid);
                let i = 0;
                controlArray.controls.forEach(ctrl => {
                    let rs: Resource = ctrl.get('resource').value;
                    if (rs.oid == resource[0].oid) {
                        this.eventDetails.removeAt(i);
                    }
                    i = i + 1;
                });
            });
        }
        this.dataSource = this.eventDetails.value;
        this.updateTotal(this.eventDetails.value);
        this.eventForm.markAsDirty();
    }



    getExtraDetails(): FormArray {
        return new FormArray(this.event.extra_details.map(item => new FormGroup({
            is_extra: new FormControl(item.is_extra),
            price: new FormControl(item.price),
            qta: new FormControl(item.qta),
            extra_descr: new FormControl(item.extra_descr),
            note: new FormControl(item.note),
            total_price: new FormControl(item.total_price),
            oid_package: new FormControl(item.oid_package)
        })));
    }


    get extraDetails() {
        return this.eventForm.get('extra_details') as FormArray;
    }



    addExtra() {
        this.extraDetails.push(new FormGroup({
            is_extra: new FormControl(true),
            price: new FormControl(null),
            qta: new FormControl(1),
            extra_descr: new FormControl(null),
            note: new FormControl(null),
            total_price: new FormControl(null),
            oid_package: new FormControl(null)
        }));
        this.dataSourceExtra = this.extraDetails.value;
    }

    deleteExtra(idx: number) {
        this.extraDetails.removeAt(idx);
        this.dataSourceExtra = this.extraDetails.value;
        this.updateTotal(this.extraDetails.value);
        this.eventForm.markAsDirty();
    }

    onCheckAllDay(ob: MatCheckboxChange) {
        //console.log("PQR checked: " + ob.checked);
        if (ob.checked) {
            this.eventForm.get('to').setValue(this.eventForm.get('from').value);
            this.eventForm.get('from_ts_hh').setValue("00");
            this.eventForm.get('from_ts_mi').setValue("00");
            this.eventForm.get('to_ts_hh').setValue("23");
            this.eventForm.get('to_ts_mi').setValue("59");
        } else {
            this.eventForm.get('to').setValue(null);
            this.eventForm.get('from_ts_hh').setValue(null);
            this.eventForm.get('from_ts_mi').setValue(null);
            this.eventForm.get('to_ts_hh').setValue(null);
            this.eventForm.get('to_ts_mi').setValue(null);
        }
    }

    onChangeDurationDay(val) {
      // console.log(this.eventForm.get('from').value);
      // console.log(this.eventForm.get('from').value.replace(/\s/g, "T"));
        if (this.eventForm.get('from').value) {
            var date1 = new Date(this.eventForm.get('from').value.replace(/\s/g, "T"));
            date1.setDate(date1.getDate() + Number(val));
            this.eventForm.get('to').setValue(date1.toISOString().substring(0, 10));
        }
        this.refreshDetails();
    }



    onChangeDurationHour(val) {
      // console.log(this.eventForm.get('from_ts_hh').value)
        if (this.eventForm.get('from_ts_hh').value) {
            var now = new Date();
            now.setHours(Number(this.eventForm.get('from_ts_hh').value));
            let copyOf = new Date(now.valueOf())
            now.setHours(now.getHours() + Number(val));
            this.eventForm.get('to_ts_hh').setValue((now.getHours() + "").padStart(2, "0"));
            this.eventForm.get('to_ts_mi').setValue(this.eventForm.get('from_ts_mi').value);
            if (now.getDay() != copyOf.getDay()) {
                var date1 = new Date(this.eventForm.get('from').value.replace(/\s/g, "T"));
                date1.setDate(date1.getDate() + 1);
                this.eventForm.get('to').setValue(date1.toISOString().substring(0, 10));
            }
            else {
                this.eventForm.get('to').setValue(this.eventForm.get('from').value);
            }
        }
        this.refreshDetails();
    }

    refreshDetails() {
        const controlArray = <FormArray>this.eventForm.get('event_details');
        controlArray.controls.forEach(ctrl => {
            ctrl.get('hours').setValue(this.eventForm.get('total_hours').value);
            ctrl.get('days').setValue(this.eventForm.get('total_days').value);
        });
    }

    calculateDiff() {
      // console.log(this.eventForm.get('from').value);
      // console.log(this.datepipe.transform(this.eventForm.get('from').value, 'yyyy-MM-dd'))
      let dateFrom = this.datepipe.transform(this.eventForm.get('from').value, 'yyyy-MM-dd');
      let dateTo = this.datepipe.transform(this.eventForm.get('to').value, 'yyyy-MM-dd')
        if (this.eventForm.get('from').value) {
            this.isDisabled = false;
        }
        else {
            this.isDisabled = true;
        }
        if (dateFrom && dateTo) {
            if (this.eventForm.get('from_ts_hh').value && this.eventForm.get('from_ts_mi').value &&
                this.eventForm.get('to_ts_hh').value && this.eventForm.get('to_ts_mi').value) {
                var date1: any = new Date(dateFrom + "T" + this.eventForm.get('from_ts_hh').value + ":" + this.eventForm.get('from_ts_mi').value);
                var date2: any = new Date(dateTo + "T" + this.eventForm.get('to_ts_hh').value + ":" + this.eventForm.get('to_ts_mi').value);
            }
            else {
                var date1: any = new Date(dateFrom);
                var date2: any = new Date(dateTo);
            }

            if (date2 < date1) {
                this._matSnackBar.open('La data di fine deve essere maggiore o uguale della data di inizio!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                this.eventForm.get('to').setValue(null);
                return;
            }
            var diffDays: any = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
            var diffHours: any = Math.floor((date2 - date1) / (1000 * 60 * 60));
            if (diffDays > 0) {
                diffHours = diffHours - (diffDays * 24);
            }

            this.eventForm.get('total_days').setValue(diffDays);
            this.eventForm.get('total_hours').setValue(diffHours);
        }
        else {
            this.eventForm.get('total_days').setValue(0);
            this.eventForm.get('total_hours').setValue(0);
        }
        this.refreshDetails();
    }

    normalizeCurrency(evt: Event) {

        if (evt.event_details) {
            evt.event_details.forEach(det => {
                det.price = (det.price + "").replace('.', '').replace(',', '.');
            });
        }

        if (evt.extra_details) {
            evt.extra_details.forEach(ex => {
                ex.price = (ex.price + "").replace('.', '').replace(',', '.');
            });
        }


        if (evt.payment_assoc) {
            evt.payment_assoc.forEach(pay => {
                pay.amount = (pay.amount + "").replace('.', '').replace(',', '.');
            });
        }
    }


    saveEvent(): void {

        const data = this.eventForm.getRawValue();

        console.log(data.oid);

        let arrayPkg = [];
        if (data.packages_assoc && data.packages_assoc.length > 0) {
            data.packages_assoc.forEach(element => {
                delete element.descr;
                delete element.total_price;
                arrayPkg.push(element.package);
            });
        }
        data.packages_assoc = arrayPkg;
        data.from = this.datepipe.transform(data.from, 'yyyy-MM-dd') + " " + data.from_ts_hh + ":" + data.from_ts_mi + ":" + "00";
        data.to = this.datepipe.transform(data.to, 'yyyy-MM-dd') + " " + data.to_ts_hh + ":" + data.to_ts_mi + ":" + "00";
        //this.normalizeCurrency(data);
        this._eventService.saveEvent(data, this.attFile)
            .then(() => {
                // Trigger the subscription with new data
                //this._eventService.onRoleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Evento aggiornato', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
            }, error => {
                this._matSnackBar.open('Errore aggiornamento evento!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error saveEvent " + error);
            });
    }


    async addEvent(): Promise<void> {
        const data = this.eventForm.getRawValue();
        let arrayPkg = [];
        if (data.packages_assoc && data.packages_assoc.length > 0) {
            data.packages_assoc.forEach(element => {
                delete element.descr;
                delete element.total_price;
                arrayPkg.push(element.package);
            });
        }
        data.packages_assoc = arrayPkg;

        //this.normalizeCurrency(data);
        if (!data.customer) {
            data.customer = new Customer();
        }
        data.from = this.datepipe.transform(data.from, 'yyyy-MM-dd') + " " + data.from_ts_hh + ":" + data.from_ts_mi + ":" + "00";
        data.to = this.datepipe.transform(data.to, 'yyyy-MM-dd') + " " + data.to_ts_hh + ":" + data.to_ts_mi + ":" + "00";
        this._eventService.addEvent(data)
            .then(() => {

                // Trigger the subscription with new data
                //this._eventService.onRoleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Evento aggiunto', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });

                // Change the location with new one
                //this._location.go('apps/e-commerce/products/' + this.user.oid + '/' + this.user.handle);
            }, error => {
                this._matSnackBar.open('Errore aggiunta Evento!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error addEvent " + error);
            });
    }


    getWACell(cell: string): string {
        if (cell.startsWith("+39"))
            return cell;
        else
            return "+39" + cell;
    }


    getHumans() {
        return this.event.event_details.filter(detail => detail.resourceType ? detail.resourceType.acronym == "HUMAN" : detail.resource.resourceType.acronym == "HUMAN");
    }

    getMaterials() {
        return this.event.event_details.filter(detail => detail.resourceType ? detail.resourceType.acronym == "MATERIAL" : detail.resource.resourceType.acronym == "MATERIAL");
    }

    getServices() {
        return this.event.event_details.filter(detail => detail.resourceType ? detail.resourceType.acronym == "IMMATERIAL" : detail.resource.resourceType.acronym == "IMMATERIAL");
    }

    getAssets() {
        return this.event.event_details.filter(detail => detail.resourceType ? detail.resourceType.acronym == "ASSETS" : detail.resource.resourceType.acronym == "ASSETS");
    }

    getInvTitle(detail: EventDetail) {
        let title = "";
        if (detail.category) {
            title = title + detail.category.descr;
        }
        if (detail.skill) {
            title = title + "/" + detail.skill.descr;
        }
        if (detail.resource) {
            title = title + "/" + this.getResourceName(detail.resource)
        }
        return title;
    }

    getResourceImg(detail: EventDetail): string {
        if (detail.resource.image) {
            return detail.resource.image;
        }
        else {
            return "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg";
        }
    }

    onChangeCustomer(value) {
        if (value) {
            this.isNewCustomerDisabled = true;
        }
        else {
            this.isNewCustomerDisabled = false;
        }
    }

    onCheckNewCustomer(ob: MatCheckboxChange) {
        if (ob.checked) {
            this.eventForm.controls['customer'].disable();
            this.isSelectCustomerDisabled = true;
        }
        else {
            this.isSelectCustomerDisabled = false;
            this.eventForm.controls['customer'].enable();
        }
    }

    myHolidayDates = [
      new Date("01/01/" + new Date().getFullYear()), // New Year's Day
      new Date("03/06/" + new Date().getFullYear()), // Epiphany
      new Date("04/09/" + new Date().getFullYear()), // Easter
      new Date("04/10/" + new Date().getFullYear()), // Easter monday
      new Date("04/25/" + new Date().getFullYear()), // Liberation Day
      new Date("05/01/" + new Date().getFullYear()), // Labour Day
      new Date("06/02/" + new Date().getFullYear()), // Republic Day
      new Date("08/15/" + new Date().getFullYear()), // Feast of Assumption
      new Date("08/15/" + new Date().getFullYear()), // Ferragosto
      new Date("11/01/" + new Date().getFullYear()), // All Saints'Day
      new Date("12/08/" + new Date().getFullYear()), // Feast of the Immaculate Conception
      new Date("12/25/" + new Date().getFullYear()), // Chrismas
      new Date("12/25/" + new Date().getFullYear()), // Chrismas in Italy
      new Date("12/26/" + new Date().getFullYear()), // Saint Stephen's Day
    ];

    myHolidayFilter = (d: Date): boolean => {

      const time=d.getTime();

      return !this.myHolidayDates.find(x=>x.getTime()==time);

    }

    onDateSelected(event: any) {
      const formattedDate = this.datepipe.transform(event.value, 'yyyy-MM-dd');
      // console.log(formattedDate); // Outputs the selected date in 'yyyy-MM-dd' string format
      return formattedDate;
    }
    
    fileChangeEvent(fileInput: any) {
      console.log(fileInput.target.files);
      if (fileInput.target.files && fileInput.target.files[0]) {
          const max_size = 10485760;
          // const allowed_types = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg', 'image/pjpeg'];

          if (fileInput.target.files[0].size > max_size) {
              this.imageError =
                  'Maximum size allowed is ' + max_size / 1000 + 'Mb';

              return false;
          }

          this.eventForm.get("attach_file").setValue('');
          this.attFile = fileInput.target.files;
          this.disabledUploadBtn = false;
          Array.from(fileInput.target.files).forEach((file: File) => {
              console.log(file);
              this.event.attach_file = file.name;
              this.eventForm.get("attach_file").setValue(file.name);
              this.eventForm.get("attach_file").markAsDirty();
              this.attFile = file;
          });

          // const reader = new FileReader();
          // reader.onload = (e: any) => {
          //     const image = new Image();
          //     image.src = e.target.result;
          //     image.onload = rs => {

          //         // Return Base64 Data URL
          //         const imgBase64Path = e.target.result;
          //         this.fileSrc = imgBase64Path;

          //     };
          // };
          // reader.readAsDataURL(fileInput.target.files[0]);

          // Reset File Input to Select Same file again
          this.uploadFileInput.nativeElement.value = "";
      } else {
          this.eventForm.get("attach_file").setValue('');
          this.attFile = null;
      }
      console.log("attach_file");
  }

  attachUpload() {
    console.log("UPload>>>>>>>>>go");
    const oid = this.eventForm.getRawValue().oid;
    const attFile = this.attFile;

    this._eventService.uploadAttFile(oid, attFile)
      .then(() => {

        // Trigger the subscription with new data
        //this._eventService.onRoleChanged.next(data);

        // Show the success message
        this._matSnackBar.open('Evento aggiunto', 'OK', {
            verticalPosition: 'top',
            duration: 2000
        });

        // Change the location with new one
        //this._location.go('apps/e-commerce/products/' + this.user.oid + '/' + this.user.handle);
    }, error => {
        this._matSnackBar.open('Errore aggiunta Evento!', 'OK', {
            verticalPosition: 'top',
            duration: 2000
        });
        console.log("Error addEvent " + error);
    });
  }

}


