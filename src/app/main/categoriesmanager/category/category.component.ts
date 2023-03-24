import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';



import { CategoryService } from './category.service';
import { Category } from 'app/models/category.model';
import { ResourceType } from 'app/models/resourceType.model';
import { MatDialog, MatDialogRef } from '@angular/material';



@Component({
    selector: 'categoriesmanager',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CategoryComponent implements OnInit, OnDestroy {
    category: Category;
    pageType: string;
    categoryForm: FormGroup;
    resourceTypes: ResourceType[];
    public filteredResourceTypes: ReplaySubject<ResourceType[]> = new ReplaySubject<ResourceType[]>(1);
    public resourceTypesFilterCtrl: FormControl = new FormControl();
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

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
        private _categoryService: CategoryService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _matDialog: MatDialog,
        private router: Router
    ) {
        // Set the default
        this.category = new Category();

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
        this._categoryService.getResourceTypes().subscribe((resourceTypes: ResourceType[]) => {
            this.resourceTypes = resourceTypes;
            this.filteredResourceTypes.next(this.resourceTypes.slice());
        }, error => console.error(error));
        // Subscribe to update product on changes
        this._categoryService.onRoleChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(category => {

                if (category) {
                    this.category = new Category(category);
                    this.pageType = 'edit';
                }
                else {
                    this.pageType = 'new';
                    this.category = new Category();
                }

                this.categoryForm = this.createCategoryForm();
            });
        this.resourceTypesFilterCtrl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filterResourceTypes();
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
    createCategoryForm(): FormGroup {
        this.categoryForm = this._formBuilder.group({
            oid: [this.category.oid],
            acronym: [this.category.acronym, Validators.required],
            descr: [this.category.descr, Validators.required],
            resourceType: [this.category.resourceType, Validators.required]
        });
        return this.categoryForm;
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

    compareObjects(o1: any, o2: any): boolean {
        return o1 && o2 ? o1.oid === o2.oid : false;
    }

    /**
     * Save category
     */
    saveCategory(): void {

        const data = this.categoryForm.getRawValue();

        this._categoryService.saveCategory(data)
            .then(() => {

                // Trigger the subscription with new data
                this._categoryService.onRoleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Categoria aggiornata', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
            }, error => {
                this._matSnackBar.open('Errore aggiornamento categoria!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error saveCategory " + error);
            });
    }

    deleteCategory() : void {
        const data = this.categoryForm.getRawValue();
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmTitle = 'Cancellazione Categoria';
        this.confirmDialogRef.componentInstance.confirmButtonTitle = "OK";
        this.confirmDialogRef.componentInstance.cancellButtonTitle = "Annulla";
        this.confirmDialogRef.componentInstance.confirmMessage = 'Cancellando la categoria verrà rimossa da tutte le risorse. Sei sicuro di volerla cancellare?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._categoryService.deleteCategory(data)
                    .then(() => {

                        // Trigger the subscription with new data
                        //this._resourceService.onUserChanged.next(data);

                        // Show the success message
                        this._matSnackBar.open('Categoria Rimossa', 'OK', {
                            verticalPosition: 'top',
                            duration: 2000
                        }).afterDismissed().subscribe(()=>{
                            this.router.navigate(['/categoriesmanager'])
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
     * Add category
     */
    async addCategory(): Promise<void> {


        const data = this.categoryForm.getRawValue();

        this._categoryService.addCategory(data)
            .then(() => {

                // Trigger the subscription with new data
                this._categoryService.onRoleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Categoria aggiunta', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });

                // Change the location with new one
                //this._location.go('apps/e-commerce/products/' + this.user.oid + '/' + this.user.handle);
            }, error => {
                this._matSnackBar.open('Errore aggiunta categoria!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error addCategory " + error);
            });
    }







}

