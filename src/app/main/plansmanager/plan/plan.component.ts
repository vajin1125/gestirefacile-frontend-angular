import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { PlanService } from './plan.service';
import { Message } from 'app/models/message.model';
import * as _ from 'lodash';
import { Config } from 'app/app.config';
import { RolesService } from 'app/main/rolemanager/roles/roles.service';
import { UsersService } from 'app/main/usermanager/users/users.service';
import { User } from 'app/models/user.model';
import { Role } from 'app/models/role.model';
import { BusinessesService } from 'app/main/businessmanager/businesses/businesses.service';
import { Business } from 'app/models/business.model';



@Component({
    selector: 'planmanager',
    templateUrl: './plan.component.html',
    styleUrls: ['./plan.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class PlanComponent implements OnInit, OnDestroy {
    message: Message;
    pageType: string;
    messageForm: FormGroup;
    roles: Role[];
    users: User[];
    businesses: Business[];

    public roleFilterCtrl: FormControl = new FormControl();
    public filteredRoles: ReplaySubject<Role[]> = new ReplaySubject<Role[]>(1);
    public usersFilterCtrl: FormControl = new FormControl();
    public filteredUsers: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);
    public businessFilterCtrl: FormControl = new FormControl();
    public filteredBusinesses: ReplaySubject<Business[]> = new ReplaySubject<Business[]>(1);

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
        private _planService: PlanService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _rolemanagerService: RolesService,
        private _usermanagerService: UsersService,
        private _businessesmanagerService: BusinessesService
    ) {
        // Set the default
        this.message = new Message();

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
        this._rolemanagerService.getRoles().subscribe((roles: Role[]) => {
            this.roles = roles;
            this.filteredRoles.next(this.roles.slice());
        }, error => console.error(error));
        this._businessesmanagerService.getBusinesses().subscribe((businesses: Business[]) => {
            this.businesses = businesses;
            this.filteredBusinesses.next(this.businesses.slice());
        }, error => console.error(error));
        this._usermanagerService.getUsers().subscribe((users: User[]) => {
            this.users = users;
            this.filteredUsers.next(this.users.slice());
        }, error => console.error(error));
        this._planService.onMessageChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(message => {

                if (message) {
                    this.message = new Message(message);


                    this.pageType = 'edit';
                }
                else {
                    this.pageType = 'new';
                    this.message = new Message();
                }

                this.messageForm = this.createMessageForm();
            });
        this.roleFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filterRoles();
            });

        this.usersFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filterUser();
            });
        this.businessFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filterBusiness();
            });
    }

    private filterRoles() {
        if (!this.roles) {
            return;
        }
        // get the search keyword
        let search = this.roleFilterCtrl.value;
        if (!search) {
            this.filteredRoles.next(this.roles.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredRoles.next(
            this.roles.filter(role => role.descr.toLowerCase().indexOf(search) > -1)
        );
    }

    private filterUser() {
        if (!this.users) {
            return;
        }
        // get the search keyword
        let search = this.usersFilterCtrl.value;
        if (!search) {
            this.filteredUsers.next(this.users.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredUsers.next(
            this.users.filter(user => JSON.stringify(user).toLowerCase().indexOf(search) > -1)
        );
    }


    private filterBusiness() {
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
            this.businesses.filter(business => business.descr.toLowerCase().indexOf(search) > -1)
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
    createMessageForm(): FormGroup {
        this.messageForm = this._formBuilder.group({
            oid: [this.message.oid],
            title: [this.message.title],
            text: [this.message.text],
            url: [this.message.url],
            business: [this.message.business],
            role: [this.message.role],
            user_sent: [this.message.user_sent]
        });




        return this.messageForm;
    }


    compareObjects(o1: any, o2: any): boolean {
        return o1 && o2 ? o1.oid === o2.oid : false;
    }

    /**
     * Add message
     */
    async addMessage(): Promise<void> {


        const data = this.messageForm.getRawValue();
        
        data.oid_user_create = 1;

        this._planService.addMessage(data)
            .then(() => {

                // Trigger the subscription with new data
                this._planService.onMessageChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Messaggio aggiunto', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });

                // Change the location with new one
                //this._location.go('apps/e-commerce/products/' + this.user.oid + '/' + this.user.handle);
            }, error => {
                this._matSnackBar.open('Errore aggiunta messaggio!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error addMessage " + error);
            });
    }







}

