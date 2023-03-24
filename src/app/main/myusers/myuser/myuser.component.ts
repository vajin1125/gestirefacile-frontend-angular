import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';


import { User } from 'app/models/user.model';
import { MyUserService } from './myuser.service';
import { Role } from 'app/models/role.model';
import { RolesService } from 'app/main/rolemanager/roles/roles.service';
import { Business } from 'app/models/business.model';
import * as _ from 'lodash';
import { Config } from 'app/app.config';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTabChangeEvent } from '@angular/material';
import { RoleUserAssoc } from 'app/models/role-user-assoc.model';
import { MyBusinessesService } from 'app/main/mybusiness/mybusinesses/mybusinesses.service';


@Component({
    selector: 'myusermanager',
    templateUrl: './myuser.component.html',
    styleUrls: ['./myuser.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class MyUserComponent implements OnInit, OnDestroy {
    user: User;
    pageType: string;
    userForm: FormGroup;
    roles: Role[];
    businesses: Business[];
    @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
    logoSrc: string = '';
    logo: File;
    imageError: string;

    public roleFilterCtrl: FormControl = new FormControl();
    public filteredRoles: ReplaySubject<Role[]> = new ReplaySubject<Role[]>(1);
    public businessFilterCtrl: FormControl = new FormControl();
    public filteredBusinesses: ReplaySubject<Business[]> = new ReplaySubject<Business[]>(1);

    displayedColumns = ['business', 'role', 'delete'];

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
        private _userService: MyUserService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _rolemanagerService: RolesService,
        private _businessesmanagerService: MyBusinessesService
    ) {
        // Set the default
        this.user = new User();

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
        this._businessesmanagerService.getBusinesses().subscribe((businesses: Business[]) => {
            this.businesses = businesses;
            this.filteredBusinesses.next(this.businesses.slice());
        }, error => console.error(error));
        // Subscribe to update product on changes
        this._userService.onUserChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {

                if (user) {
                    this.user = new User(user);
                    if (this.user.superuser) {
                        this.logoSrc = "assets/images/avatars/superuser.jpg";
                    }
                    else {
                        this.logoSrc = "";
                    }
                    if (this.user.image && !this.user.superuser) {
                        this.logoSrc = Config.prop.urlImages + "/users/" + this.user.oid + "/" + this.user.image;
                    }

                    this.pageType = 'edit';
                    this.dataSource = this.user.role_user_assoc;
                }
                else {
                    this.pageType = 'new';
                    this.user = new User();
                }
                this.userForm = this.createUserForm();
            });

        this.roleFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filterRoles();
            });

        this.businessFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filterBusiness();
            });
    }


    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.tabIndex = tabChangeEvent.index;
        //console.log(tabChangeEvent);
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

            this.userForm.get("image").setValue('');
            this.logo = null;
            Array.from(fileInput.target.files).forEach((file: File) => {
                console.log(file);
                this.user.image = file.name;
                this.userForm.get("image").setValue(file.name);
                this.userForm.get("image").markAsDirty();
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

            // Reset File Input to Select Same file again
            this.uploadFileInput.nativeElement.value = "";
        } else {
            this.userForm.get("image").setValue('');
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
    createUserForm(): FormGroup {
        this.userForm = this._formBuilder.group({
            oid: [this.user.oid],
            name: [this.user.name, Validators.required],
            surname: [this.user.surname, Validators.required],
            email: [this.user.email, [Validators.required, Validators.email]],
            username: [this.user.username, [Validators.required]],
            password: [this.user.password, Validators.required],
            passwordConfirm: [this.user.password, [Validators.required, confirmPasswordValidator]],
            max_business_num: [this.user.max_business_num, Validators.required],
            enabled: [this.user.enabled, Validators.required],
            tel: [this.user.tel],
            cell: [this.user.cell],
            image: [{ value: this.user.image, disabled: true }],
            role_user_assoc: this.getRoles()
        });


        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.userForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.userForm.get('passwordConfirm').updateValueAndValidity();
            });




        return this.userForm;
    }

    compareObjects(o1: any, o2: any): boolean {
        return o1 && o2 ? o1.oid === o2.oid : false;
    }


    getRoles(): FormArray {
        return new FormArray(this.user.role_user_assoc.map(item => new FormGroup({
            business: new FormControl(item.business),
            role: new FormControl(item.role)
        })));
    }

    get roleUserAssoc() {
        return this.userForm.get('role_user_assoc') as FormArray;
    }

    addRole() {
        this.roleUserAssoc.push(new FormGroup({
            business: new FormControl(null),
            role: new FormControl(null)
        }));
        this.dataSource = this.roleUserAssoc.value;
    }

    deleteRole(idx: number) {
        this.roleUserAssoc.removeAt(idx);
        this.dataSource = this.roleUserAssoc.value;
        this.userForm.markAsDirty();
    }





    /**
     * Save user
     */
    saveUser(): void {
        let changePassword = false;
        if (this.user.password != this.userForm.get('password').value) {
            changePassword = true;
        }

        const data = this.userForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);

        this._userService.saveUser(data, changePassword, this.logo)
            .then(() => {

                // Trigger the subscription with new data
                this._userService.onUserChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Utente aggiornato', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
            }, error => {
                this._matSnackBar.open('Errore aggiornamento utente!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error saveUser " + error);
            });
    }

    /**
     * Add user
     */
    async addUser(): Promise<void> {
        let errors: boolean = false;
        const data = this.userForm.getRawValue();

        await this._userService.emailCheckUnique(this.userForm.controls['email'].value).toPromise().then(users => {
            if (users.length > 0) {
                this._matSnackBar.open('Errore Email già esistente', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                errors = true;
            }
        });

        if (errors) {
            return null;
        }


        await this._userService.usernameCheckUnique(this.userForm.controls['username'].value).toPromise().then(users => {
            if (users.length > 0) {
                this._matSnackBar.open('Errore Username già esistente', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                errors = true;
            }
        });

        if (errors) {
            return null;
        }




        this._userService.addUser(data, this.logo)
            .then(() => {

                // Trigger the subscription with new data
                this._userService.onUserChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Utente aggiunto', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });

                // Change the location with new one
                //this._location.go('apps/e-commerce/products/' + this.user.oid + '/' + this.user.handle);
            }, error => {
                this._matSnackBar.open('Errore aggiunta utente!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error addUser " + error);
            });
    }

    getWACell(cell:string): string {
        if (cell.startsWith("+39"))
            return cell;
        else
            return "+39"+cell;
    }







}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent || !control) {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if (!password || !passwordConfirm) {
        return null;
    }

    if (passwordConfirm.value === '') {
        return null;
    }

    if (password.value === passwordConfirm.value) {
        return null;
    }

    return { passwordsNotMatching: true };
};




