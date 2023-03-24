import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';


import { User } from 'app/models/user.model';
import { ProfileService } from './profile.service';
import * as _ from 'lodash';
import { Config } from 'app/app.config';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AttributeType } from 'app/models/attributeType.model';
import { Attribute } from 'app/models/attribute.model';
import { Business } from 'app/models/business.model';
import { MyBusinessesService } from '../mybusiness/mybusinesses/mybusinesses.service';
import { MatTabChangeEvent } from '@angular/material';



@Component({
    selector: 'myprofile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ProfileComponent implements OnInit, OnDestroy {
    user: User;
    pageType: string;
    userForm: FormGroup;
    @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
    logoSrc: string = '';
    logo: File;
    imageError: string;
    businesses: Business[];
    attributeTypes: AttributeType[];
    public typeFilterCtrl: FormControl = new FormControl();
    public filteredTypes: ReplaySubject<AttributeType[]> = new ReplaySubject<AttributeType[]>(1);
    public businessFilterCtrl: FormControl = new FormControl();
    public filteredBusinesses: ReplaySubject<Business[]> = new ReplaySubject<Business[]>(1);

    displayedColumns = ['type', 'name', 'business', 'delete'];

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
        private _profileService: ProfileService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
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

        this._businessesmanagerService.getBusinesses().subscribe((businesses: Business[]) => {
            this.businesses = businesses;
            this.filteredBusinesses.next(this.businesses.slice());
        }, error => console.error(error));
        this._profileService.getAttributeTypes().subscribe((attributeTypes: AttributeType[]) => {
            this.attributeTypes = attributeTypes;
            this.filteredTypes.next(this.attributeTypes.slice());
        }, error => console.error(error));

        // Subscribe to update product on changes
        this._profileService.onUserChanged
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
                    this.dataSource = this.user.attribute_assoc;
                }
                this.userForm = this.createUserForm();
            });

        this.businessFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filterBusiness();
            });
        this.typeFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filterType();
            });
    }

    private filterType() {
        if (!this.attributeTypes) {
            return;
        }
        // get the search keyword
        let search = this.typeFilterCtrl.value;
        if (!search) {
            this.filteredTypes.next(this.attributeTypes.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the roles
        this.filteredTypes.next(
            this.attributeTypes.filter(attrType => attrType.descr.toLowerCase().indexOf(search) > -1)
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


    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.tabIndex = tabChangeEvent.index;
        //console.log(tabChangeEvent);
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
            tel: [this.user.tel],
            cell: [this.user.cell],
            image: [{ value: this.user.image, disabled: true }],
            attribute_assoc: this.getAttributes()
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



    getAttributes(): FormArray {
        return new FormArray(this.user.attribute_assoc.map(item => new FormGroup({
            oid: new FormControl(item.oid),
            business: new FormControl(item.business),
            type: new FormControl(item.attributeType),
            name: new FormControl(item.name)
        })));
    }

    get attributeAssoc() {
        return this.userForm.get('attribute_assoc') as FormArray;
    }

    addAttribute() {
        this.attributeAssoc.push(new FormGroup({
            oid: new FormControl(null),
            business: new FormControl(null),
            type: new FormControl(null),
            name: new FormControl(null)
        }));
        this.dataSource = this.attributeAssoc.value;
    }

    deleteAttribute(idx: number) {
        this.attributeAssoc.removeAt(idx);
        this.dataSource = this.attributeAssoc.value;
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

        this._profileService.saveUser(data, changePassword, this.logo)
            .then(() => {

                // Trigger the subscription with new data
                this._profileService.onUserChanged.next(data);

                // Show the success message
                let snack = this._matSnackBar.open('Profilo aggiornato', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });

                snack.onAction().subscribe(() => { location.reload() });
                snack.afterDismissed().subscribe(() => { location.reload() });
            }, error => {
                this._matSnackBar.open('Errore aggiornamento profilo!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error saveUser " + error);
            });
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




