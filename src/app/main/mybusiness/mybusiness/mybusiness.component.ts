import { Component, ElementRef, OnDestroy, OnInit, Pipe, PipeTransform, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { MyBusinessService } from './mybusiness.service';
import { Business } from 'app/models/business.model';
import * as _ from 'lodash';
import { Config } from 'app/app.config';
import { User } from 'app/models/user.model';
import { MatPaginator, MatSort, MatTabChangeEvent } from '@angular/material';
import { RolesService } from 'app/main/rolemanager/roles/roles.service';
import { Role } from 'app/models/role.model';
import { MyUsersService } from 'app/main/myusers/myusers/myusers.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';



@Component({
    selector: 'mybusinessesmanager',
    templateUrl: './mybusiness.component.html',
    styleUrls: ['./mybusiness.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class MyBusinessComponent implements OnInit, OnDestroy {
    business: Business;
    pageType: string;
    businessForm: FormGroup;
    @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
    logoSrc: string = '';
    logo: File;
    imageError: string;
    roles: Role[];
    users: User[];
    

    public roleFilterCtrl: FormControl = new FormControl();
    public filteredRoles: ReplaySubject<Role[]> = new ReplaySubject<Role[]>(1);
    public usersFilterCtrl: FormControl = new FormControl();
    public filteredUsers: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);

    displayedColumns = ['user', 'role', 'delete'];

    dataSource: any;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true })
    sort: MatSort;
    tabIndex = 0;
    currentColor;
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
        private _businessService: MyBusinessService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _rolemanagerService: RolesService,
        private _usermanagerService: MyUsersService,
        private sanitizer: DomSanitizer
    ) {
        // Set the default
        this.business = new Business();

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

        this._rolemanagerService.getRoles().subscribe((roles: Role[]) => {
            this.roles = roles;
            this.filteredRoles.next(this.roles.slice());
        }, error => console.error(error));
        this._usermanagerService.getUsers().subscribe((users: User[]) => {
            this.users = users;
            this.filteredUsers.next(this.users.slice());
        }, error => console.error(error));
        // Subscribe to update product on changes
        this._businessService.onBusinessChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(business => {

                if (business) {
                    this.business = new Business(business);

                    if (this.business.logo) {
                        this.logoSrc = Config.prop.urlImages + "/business/" + this.business.oid + "/" + this.business.logo;
                    }
                    if (this.business.color) {
                        this.currentColor = this.business.color;
                    }
                    this.pageType = 'edit';
                    this.dataSource = this.business.role_user_assoc;
                }
                else {
                    this.pageType = 'new';
                    this.business = new Business();
                }

                this.businessForm = this.createBusinessForm();
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
    }

    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.tabIndex = tabChangeEvent.index;
        //console.log(tabChangeEvent);
    }

    sanitizeStyle(unsafeStyle: string): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(unsafeStyle);
    }

    getCurrentColor() {
        return this.currentColor ? this.currentColor : "#039be5";
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


    fileChangeEvent(fileInput: any) {

        if (fileInput.target.files && fileInput.target.files[0]) {
            const max_size = 10485760;
            const allowed_types = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg', 'image/pjpeg'];

            if (fileInput.target.files[0].size > max_size) {
                this.imageError =
                    'Maximum size allowed is ' + max_size / 1000 + 'Mb';

                return false;
            }

            if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
                this.imageError = 'Only Images are allowed ( JPG | PNG | GIF | PJPEG )';
                return false;
            }

            this.businessForm.get("logo").setValue('');
            this.logo = null;
            Array.from(fileInput.target.files).forEach((file: File) => {
                console.log(file);
                //this.myfilename = file.name;
                this.business.logo = file.name;
                this.businessForm.get("logo").setValue(file.name);
                this.businessForm.get("logo").markAsDirty();
                this.logo = file;
            });

            const reader = new FileReader();
            reader.onload = (e: any) => {
                const image = new Image();
                image.src = e.target.result;
                image.onload = rs => {

                    // Return Base64 Data URL
                    const imgBase64Path = e.target.result;
                    this.logoSrc = imgBase64Path;
                };
            };
            reader.readAsDataURL(fileInput.target.files[0]);

            // Reset File Input to Selct Same file again
            this.uploadFileInput.nativeElement.value = "";
        } else {
            this.businessForm.get("logo").setValue('');
            this.logo = null;
        }
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
    createBusinessForm(): FormGroup {
        this.businessForm = this._formBuilder.group({
            oid: [this.business.oid],
            name: [this.business.name, Validators.required],
            descr: [this.business.descr, Validators.required],
            email: [this.business.email, [Validators.required, Validators.email]],
            logo: [{ value: this.business.logo, disabled: true }],
            address: [this.business.address],
            piva: [this.business.piva],
            tel: [this.business.tel],
            cell: [this.business.cell],
            color: [this.business.color],
            role_user_assoc: this.getRoles()
        });




        return this.businessForm;
    }

    compareObjects(o1: any, o2: any): boolean {
        return o1 && o2 ? o1.oid === o2.oid : false;
    }


    colorChanged(event) {
        this.businessForm.get("color").setValue(event.bg);
        this.currentColor = event.bg;
        this.businessForm.markAsDirty();
    }

    getRoles(): FormArray {
        return new FormArray(this.business.role_user_assoc.map(item => new FormGroup({
            user: new FormControl(item.user),
            role: new FormControl(item.role)
        })));
    }

    get roleUserAssoc() {
        return this.businessForm.get('role_user_assoc') as FormArray;
    }

    addRole() {
        this.roleUserAssoc.push(new FormGroup({
            user: new FormControl(null),
            role: new FormControl(null)
        }));
        this.dataSource = this.roleUserAssoc.value;
    }

    deleteRole(idx: number) {
        this.roleUserAssoc.removeAt(idx);
        this.dataSource = this.roleUserAssoc.value;
        this.businessForm.markAsDirty();
    }


    /**
     * Save business
     */
    saveBusiness(): void {

        const data = this.businessForm.getRawValue();

        this._businessService.saveBusiness(data, this.logo)
            .then(() => {

                // Trigger the subscription with new data
                this._businessService.onBusinessChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Attività aggiornata', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
            }, error => {
                this._matSnackBar.open('Errore aggiornamento attività!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error saveBusiness " + error);
            });
    }

    /**
     * Add business
     */
    async addBusiness(): Promise<void> {


        const data = this.businessForm.getRawValue();

        

        this._businessService.addBusiness(data, this.logo)
            .then(() => {

                // Trigger the subscription with new data
                this._businessService.onBusinessChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Attività aggiunta', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });

                // Change the location with new one
                //this._location.go('apps/e-commerce/products/' + this.user.oid + '/' + this.user.handle);
            }, error => {
                this._matSnackBar.open('Errore aggiunta attività!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error addBusiness " + error);
            });
    }







}



