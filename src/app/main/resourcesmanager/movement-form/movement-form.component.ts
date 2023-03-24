import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Movement } from 'app/models/movement.model';

@Component({
    selector     : 'calendar-event-form-dialog',
    templateUrl  : './movement-form.component.html',
    styleUrls    : ['./movement-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class MovementFormDialogComponent
{

    movement: Movement;
    movementForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<CalendarEventFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<MovementFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    )
    {
        this.dialogTitle = 'Nuovo Movimento';

        this.movement = new Movement();

        this.movementForm = this.createMovementForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the event form
     *
     * @returns {FormGroup}
     */
    createMovementForm(): FormGroup
    {
        return new FormGroup({
            qta : new FormControl(this.movement.qta),
            reason : new FormControl(this.movement.reason),
           
        });
    }
}
