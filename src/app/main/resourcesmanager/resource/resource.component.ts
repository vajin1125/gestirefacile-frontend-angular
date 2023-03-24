import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation, Renderer2 } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';


import { Resource } from 'app/models/resource.model';
import { ResourceService } from './resource.service';

import * as _ from 'lodash';
import { Config } from 'app/app.config';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MatTabChangeEvent, MatTableDataSource } from '@angular/material';
import { ResourceType } from 'app/models/resourceType.model';
import { ResourcesService } from '../resources/resources.service';
import { Category } from 'app/models/category.model';
import { CategoriesService } from 'app/main/categoriesmanager/categories/categories.service';
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
    MatAutocompleteSelectedEvent,
    MatAutocomplete
} from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Skill } from 'app/models/skill.model';
import { SkillsService } from 'app/main/skillsmanager/skills/skills.service';

import { MovementFormDialogComponent } from '../movement-form/movement-form.component';
import { Movement } from 'app/models/movement.model';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';




@Component({
    selector: 'resourcesmanager',
    templateUrl: './resource.component.html',
    styleUrls: ['./resource.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ResourceComponent implements OnInit, OnDestroy {
    resource: Resource;
    pageType: string;
    resourceForm: FormGroup;
    resourceTypes: ResourceType[];
    resources: Resource[];
    categories: Category[];
    skills: Skill[];
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    public filteredResourceTypes: ReplaySubject<ResourceType[]> = new ReplaySubject<ResourceType[]>(1);
    public resourceTypesFilterCtrl: FormControl = new FormControl();

    public filteredResources: ReplaySubject<Resource[]> = new ReplaySubject<Resource[]>(1);
    public resourcesFilterCtrl: FormControl = new FormControl();


    public filteredCategories: ReplaySubject<Category[]> = new ReplaySubject<Category[]>(1);
    public categoriesFilterCtrl: FormControl = new FormControl();


    public filteredSkills: ReplaySubject<Skill[]> = new ReplaySubject<Skill[]>(1);
    public skillsFilterCtrl: FormControl = new FormControl();

    @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
    @ViewChild("categoryInput", { static: false }) categoryInput: ElementRef<HTMLInputElement>;
    @ViewChild("auto", { static: false }) matAutocomplete: MatAutocomplete;

    @ViewChild("skillInput", { static: false }) skillInput: ElementRef<HTMLInputElement>;
    logoSrc: string = '';
    logo: File;
    imageError: string;

    dataSource: any;
    dataSourceMov: any;
    dataSourcePrice: any;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true })
    sort: MatSort;
    tabIndex = 0;
    

    showHuman = false;
    showMaterial = false;
    showOther = false;
    showAssets = false;

    selectable = true;
    removable = true;
    addOnBlur = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];

    displayedColumns = ['resourceAssoc', 'qta', 'delete'];
    displayedColumnsMov = ['oid', 'qta', 'reason', 'time'];
    displayedColumnsPrice = ['descr', 'price', 'default', 'delete'];

    @ViewChild('qrCodeElement', {static: false}) qrCodeElement: ElementRef;
    qrData: string;
    qrWidth = "300";
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
        private _resourceService: ResourceService,
        private _resourcesService: ResourcesService,
        private _categoriesService: CategoriesService,
        private _skillsService: SkillsService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        public datepipe: DatePipe,
        private _matDialog: MatDialog,
        private router: Router,
        private renderer: Renderer2
    ) {
        // Set the default
        this.resource = new Resource();

        // Set the private defaults
        this._unsubscribeAll = new Subject();


    }

    changeSelection(val, index) {
        (<FormArray>this.resourceForm.get("prices")).controls.forEach((element, i) => {
            if (index == i)
                element.patchValue({
                    default: val
                })
            else
                element.patchValue({
                    default: false
                })

        });

    }

    downloadQRCode(qrCodeElement) {
      // debugger;
      const link = this.renderer.createElement('a');
      link.download = 'qrcode.png';
      console.log(qrCodeElement)
      link.href = qrCodeElement.qrcElement.nativeElement.children[0].toDataURL();
      this.renderer.appendChild(document.body, link);
      link.click();
      this.renderer.removeChild(document.body, link);
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this._skillsService.getSkills().subscribe((skills: Skill[]) => {
            this.skills = skills;
            this.filteredSkills.next(this.skills.slice());
        }, error => console.error(error));
        this._categoriesService.getCategories().subscribe((categories: Category[]) => {
            this.categories = categories;
            this.filteredCategories.next(this.categories.slice());
        }, error => console.error(error));
        this._resourceService.getResourceTypes().subscribe((resourceTypes: ResourceType[]) => {
            this.resourceTypes = resourceTypes;
            this.filteredResourceTypes.next(this.resourceTypes.slice());
          }, error => console.error(error));
          
          this._resourcesService.getResources().subscribe((resources: Resource[]) => {
            this.resources = resources;
            this.filteredResources.next(this.resources.slice());
          }, error => console.error(error));
          
          
          // Subscribe to update product on changes
          this._resourceService.onUserChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(resource => {
                if (resource) {
                    this.resource = new Resource(resource);
                    this.logoSrc = "";

                    if (this.resource.image) {
                        this.logoSrc = Config.prop.urlImages + "/resources/" + this.resource.oid + "/" + this.resource.image;
                    }

                    if (this.resource.resourceType.acronym == "HUMAN") {
                        this.showHuman = true;
                        this.showOther = false;
                        this.showMaterial = false;
                        this.showAssets = false;
                    }
                    else if (this.resource.resourceType.acronym == "MATERIAL") {
                        this.showHuman = false;
                        this.showOther = true;
                        this.showMaterial = true;
                        this.showAssets = false;
                    }
                    else if (this.resource.resourceType.acronym == "ASSETS") {
                        this.showHuman = false;
                        this.showOther = true;
                        this.showMaterial = false;
                        this.showAssets = true;
                    } else {
                        this.showHuman = false;
                        this.showMaterial = false;
                        this.showOther = true;
                        this.showAssets = false;
                    }

                    if (this.resource.user_resource) {
                        this.resource.create_user = true;
                    }
                    else {
                        this.resource.create_user = false;
                    }

                    this.pageType = 'edit';
                    this.dataSource = this.resource.resources_assoc;
                    this.dataSourceMov = this.resource.movements;
                    this.dataSourcePrice = this.resource.prices;
                }
                else {
                    this.pageType = 'new';
                    this.resource = new Resource();
                }
                this.resourceForm = this.createResourceForm();
            });
        this.resourceTypesFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filterResourceTypes();
            });

        this.resourcesFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filterResources();
            });

        this.categoriesFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filterCategories();
            });
        this.skillsFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filterSkills();
            });

            // console.log(">>>", this.resource);
      // this.qrData = `
      //   Seleziona un Tipo di Risorsa: ${this.resource.resourceType.descr}\n
      //   Risorse ID: ${this.resource.oid} \n
      //   Codice: ${this.resource.code} \n
      //   Descrizione: ${this.resource.descr} \n
      //   Larqhezza in cm: ${this.resource.width} \n
      //   Altezza in cm: ${this.resource.height} \n
      //   Profondita in cm: ${this.resource.deep} \n
      //   peso in Kq: ${this.resource.weight}\n
      //   Image: ${this.resource.image} \n
      //   Note" ${this.resource.note} \n
      //   `;
      // console.log(this.router.url);
      this.qrData="https://www.gestirefacile.it" + this.router.url;
      
    }


    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.tabIndex = tabChangeEvent.index;
        //console.log(tabChangeEvent);
    }

    getFormatDate(date) {
        if (date) {
            let dt = new Date(date.replace(/\s/g, "T"));
            return this.datepipe.transform(dt, 'dd/MM/yyyy HH:mm');
        } else {
            return "";
        }

    }


    private filterResourceTypes() {
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
            this.resourceTypes.filter(resourceType => resourceType.descr.toLowerCase().indexOf(search) > -1)
        );
    }


    getResourceName(res: Resource): string {
        if (res.descr != null && res.descr != '') {
            return res.descr;
        }
        if (res.name != null && res.name != '' && res.surname != null && res.surname != '') {
            return res.name + '-' + res.surname;
        }
    }

    private filterResources() {
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
        this.filteredResources.next(
            this.resources.filter(resource => resource.descr.toLowerCase().indexOf(search) > -1
                || resource.name.toLowerCase().indexOf(search) > -1
                || resource.surname.toLowerCase().indexOf(search) > -1)
        );
    }

    private filterCategories() {
        if (!this.categories) {
            return;
        }
        // get the search keyword
        let search = this.categoriesFilterCtrl.value;
        if (!search) {
            this.filteredCategories.next(this.categories.slice());
            return;
        } else {
            if (search.descr) {
                search = search.descr.toLowerCase();
            }
            else {
                search = search.toLowerCase();
            }

        }
        this.filteredCategories.next(
            this.categories.filter(category => category.descr.toLowerCase().indexOf(search) === 0)
        );
    }


    private filterSkills() {
        if (!this.skills) {
            return;
        }
        // get the search keyword
        let search = this.skillsFilterCtrl.value;
        if (!search) {
            this.filteredSkills.next(this.skills.slice());
            return;
        } else {
            if (search.descr) {
                search = search.descr.toLowerCase();
            }
            else {
                search = search.toLowerCase();
            }

        }
        this.filteredSkills.next(
            this.skills.filter(skill => skill.descr.toLowerCase().indexOf(search) === 0)
        );
    }




    changeType(event) {
        if (event.value.acronym == "HUMAN") {
            this.showHuman = true;
            this.showOther = false;
            this.showMaterial = false;
            this.showAssets = false;
        }
        else if (event.value.acronym == "MATERIAL") {
            this.showHuman = false;
            this.showOther = true;
            this.showMaterial = true;
            this.showAssets = false;
        }
        else if (event.value.acronym == "ASSETS") {
            this.showHuman = false;
            this.showOther = true;
            this.showMaterial = true;
            this.showAssets = true;
        
        } else {
            this.showHuman = false;
            this.showMaterial = false;
            this.showOther = true;
            this.showAssets = false;
        }
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

            this.resourceForm.get("image").setValue('');
            this.logo = null;
            Array.from(fileInput.target.files).forEach((file: File) => {
                console.log(file);
                this.resource.image = file.name;
                this.resourceForm.get("image").setValue(file.name);
                this.resourceForm.get("image").markAsDirty();
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
            this.resourceForm.get("image").setValue('');
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
    createResourceForm(): FormGroup {
        this.resourceForm = this._formBuilder.group({
            oid: [this.resource.oid],
            code: [this.resource.code],
            name: this.resource.name,
            surname: this.resource.surname,
            email: [this.resource.email, Validators.email],
            gender: [this.resource.gender],
            tel: [this.resource.tel],
            cell: [this.resource.cell],
            image: [{ value: this.resource.image, disabled: true }],
            own_car: this.resource.own_car,
            resourceType: this.resource.resourceType,
            descr: this.resource.descr,
            note: this.resource.note,
            width: this.resource.width,
            height: this.resource.height,
            deep: this.resource.deep,
            weight: this.resource.weight,
            capacity: this.resource.capacity,
            position: this.resource.position,
            available: this.resource.available,
            avail_qta: this.resource.avail_qta,
            create_user: this.resource.create_user,
            consumable: this.resource.consumable,
            resources_assoc: this.getResources(),
            categories_assoc: this.getCategories(),
            skills_assoc: this.getSkills(),
            movements: this.resource.movements,
            prices: this.getPrices()
        });

        return this.resourceForm;
    }

    compareObjects(o1: any, o2: any): boolean {
        return o1 && o2 ? o1.oid === o2.oid : false;
    }


    getResources(): FormArray {
        return new FormArray(this.resource.resources_assoc.map(item => new FormGroup({
            resourceAssoc: new FormControl(item.resourceAssoc),
            qta: new FormControl(item.qta)
        })));
    }



    get resourcesAssoc() {
        return this.resourceForm.get('resources_assoc') as FormArray;
    }

    addResourceAssoc() {
        this.resourcesAssoc.push(new FormGroup({
            resourceAssoc: new FormControl(null),
            qta: new FormControl(null)
        }));
        this.dataSource = this.resourcesAssoc.value;
    }

    deleteResourceAssoc(idx: number) {
        this.resourcesAssoc.removeAt(idx);
        this.dataSource = this.resourcesAssoc.value;
        this.resourceForm.markAsDirty();
    }


    getPrices(): FormArray {
        return new FormArray(this.resource.prices.map(item => new FormGroup({
            descr: new FormControl(item.descr),
            price: new FormControl(item.price),
            default: new FormControl(item.default == 1 ? true : false)
        })));
    }



    get prices() {
        return this.resourceForm.get('prices') as FormArray;
    }

    addPrice() {
        this.prices.push(new FormGroup({
            descr: new FormControl(null),
            price: new FormControl(null),
            default: new FormControl(false)
        }));
        this.dataSourcePrice = this.prices.value;
    }

    deletePrice(idx: number) {
        this.prices.removeAt(idx);
        this.dataSourcePrice = this.prices.value;
        this.resourceForm.markAsDirty();
    }


    /*getCategories(): FormArray {
        return new FormArray(this.resource.categories_assoc.map(item => new FormGroup({
            category: new FormControl(item)
        })));
    }*/

    getCategories(): FormArray {
        return new FormArray(this.resource.categories_assoc.map(item =>
            new FormControl(item)
        ));
    }

    get categoriesAssoc() {
        return this.resourceForm.get('categories_assoc') as FormArray;
    }

    addCategory(event: MatChipInputEvent): void {
        console.log("addCategory chip")
        /*const input = event.input;
        const value = event.value;

        // Add our fruit
        if ((value || "").trim()) {
            this.categoriesAssoc.push(this._formBuilder.control(value));
        }

        // Reset the input value
        if (input) {
            input.value = "";
        }*/
    }

    removeCategory(category: string): void {
        const index = this.categoriesAssoc.value.indexOf(category);
        if (index >= 0) {
            this.categoriesAssoc.removeAt(index);
        }
    }

    selectedCategory(event: MatAutocompleteSelectedEvent): void {
        this.categoriesAssoc.push(this._formBuilder.control(event.option.value));
        this.categoryInput.nativeElement.value = "";
        this.categoriesFilterCtrl.setValue(null);
    }



    getSkills(): FormArray {
        return new FormArray(this.resource.skills_assoc.map(item =>
            new FormControl(item)
        ));
    }



    get skillsAssoc() {
        return this.resourceForm.get('skills_assoc') as FormArray;
    }

    addSkill(event: MatChipInputEvent): void {
        /*const input = event.input;
        const value = event.value;

        // Add our fruit
        if ((value || "").trim()) {
            this.categoriesAssoc.push(this._formBuilder.control(value));
        }

        // Reset the input value
        if (input) {
            input.value = "";
        }*/
    }

    removeSkill(skill: string): void {
        const index = this.skillsAssoc.value.indexOf(skill);
        if (index >= 0) {
            this.skillsAssoc.removeAt(index);
        }
    }

    selectedSkill(event: MatAutocompleteSelectedEvent): void {
        this.skillsAssoc.push(this._formBuilder.control(event.option.value));
        this.skillInput.nativeElement.value = "";
        this.skillsFilterCtrl.setValue(null);
    }

    

    async deleteResource(): Promise<void> {
        const data = this.resourceForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmTitle = 'Cancellazione Risorsa';
        this.confirmDialogRef.componentInstance.confirmButtonTitle = "OK";
        this.confirmDialogRef.componentInstance.cancellButtonTitle = "Annulla";
        this.confirmDialogRef.componentInstance.confirmMessage = 'Cancellando la risorsa verrà rimossa da tutti gli eventi. Sei sicuro di volerla cancellare?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._resourceService.deleteResource(data, this.logo)
                    .then(() => {

                        // Trigger the subscription with new data
                        //this._resourceService.onUserChanged.next(data);

                        // Show the success message
                        this._matSnackBar.open('Risorsa Rimossa', 'OK', {
                            verticalPosition: 'top',
                            duration: 2000
                        }).afterDismissed().subscribe(()=>{
                            this.router.navigate(['/resourcesmanager'])
                        });
                        
                    }, error => {
                        this._matSnackBar.open("ERROR " + error.error, 'OK', {
                            verticalPosition: 'top',
                            duration: 2000
                        })
                        console.log("Error delete " + error);
                    });
            }
            this.confirmDialogRef = null;
        });
    }
    
    /**
     * Save resource
     */
    async saveResource(): Promise<void> {
        let errors: boolean = false;
        const data = this.resourceForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);
        if (this.resource.user_resource) {
            data.user_resource = this.resource.user_resource
        }
        if (this.resource.movements) {
            data.movements = this.resource.movements;
        }
        if (this.resourceForm.controls['create_user'].value && !this.resource.user_resource) {
            await this._resourceService.emailCheckUnique(this.resourceForm.controls['email'].value).toPromise().then(users => {
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

            // come username uso l'email
            await this._resourceService.usernameCheckUnique(this.resourceForm.controls['email'].value).toPromise().then(users => {
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
        }


        //this.normalizeCurrency(data);
        this._resourceService.saveResource(data, this.logo)
            .then(() => {

                // Trigger the subscription with new data
                //this._resourceService.onUserChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Risorsa aggiornata', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
            }, error => {
                this._matSnackBar.open("ERROR " + error.error, 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error saveResource " + error);
            });
    }

    /**
     * Add resource
     */
    async addResource(): Promise<void> {
        let errors: boolean = false;
        const data = this.resourceForm.getRawValue();
        data.movements = [];
        if (this.resourceForm.controls['create_user'].value) {
            await this._resourceService.emailCheckUnique(this.resourceForm.controls['email'].value).toPromise().then(users => {
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

            // come username uso l'email
            await this._resourceService.usernameCheckUnique(this.resourceForm.controls['email'].value).toPromise().then(users => {
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
        }



        //this.normalizeCurrency(data);
        this._resourceService.addResource(data, this.logo)
            .then(() => {

                // Trigger the subscription with new data
                //this._resourceService.onUserChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Risorsa aggiunta', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });

                // Change the location with new one
                //this._location.go('apps/e-commerce/products/' + this.user.oid + '/' + this.user.handle);
            }, error => {
                this._matSnackBar.open("ERROR " + error.error, 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error addResource " + error.error);
            });
    }


    getWACell(cell: string): string {
        if (cell.startsWith("+39"))
            return cell;
        else
            return "+39" + cell;
    }


    addMovement(): void {
        this.dialogRef = this._matDialog.open(MovementFormDialogComponent, {
            panelClass: 'event-form-dialog'
        });
        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }
                const newMovement = response.getRawValue();
                if (newMovement) {
                    let mov = new Movement();

                    mov.qta = newMovement.qta;
                    mov.reason = newMovement.reason;

                    this.resource.movements.push(mov);
                    this.dataSourceMov = new MatTableDataSource(this.resource.movements);
                    this.resourceForm.markAsDirty();
                }


            });
    }

}






