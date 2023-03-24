import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { ToDoService } from './todo.service';
import { ToDo } from 'app/models/todo.model';



@Component({
    selector: 'todolistmanager',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ToDoComponent implements OnInit, OnDestroy {
    todo: ToDo;
    pageType: string;
    toDoForm: FormGroup;

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
        private _toDoService: ToDoService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar
    ) {
        // Set the default
        this.todo = new ToDo();

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
        this._toDoService.onRoleChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(toDo => {

                if (toDo) {
                    this.todo = new ToDo(toDo);
                    this.pageType = 'edit';
                }
                else {
                    this.pageType = 'new';
                    this.todo = new ToDo();
                }

                this.toDoForm = this.createToDoForm();
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
    createToDoForm(): FormGroup {
        this.toDoForm = this._formBuilder.group({
            oid: [this.todo.oid],
            title: [this.todo.title, Validators.required],
            descr: [this.todo.descr, Validators.required],
            datetime: [this.todo.datetime, Validators.required],
            completed: [this.todo.completed, Validators.required]
        });
        return this.toDoForm;
    }


    


    saveToDo(): void {

        const data = this.toDoForm.getRawValue();

        this._toDoService.saveTodo(data)
            .then(() => {

                // Trigger the subscription with new data
                this._toDoService.onRoleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('To Do aggiornato', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
            }, error => {
                this._matSnackBar.open('Errore aggiornamento to do!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error todo " + error);
            });
    }


    async addToDo(): Promise<void> {


        const data = this.toDoForm.getRawValue();

        this._toDoService.addToDo(data)
            .then(() => {

                // Trigger the subscription with new data
                this._toDoService.onRoleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('To do aggiunto', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });

                // Change the location with new one
                //this._location.go('apps/e-commerce/products/' + this.user.oid + '/' + this.user.handle);
            }, error => {
                this._matSnackBar.open('Errore aggiunta to do!', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
                console.log("Error todo " + error);
            });
    }







}

