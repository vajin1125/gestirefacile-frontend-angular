import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { MatColors } from '@fuse/mat-colors';
import { CalendarEntertrainerAvailiabilityModel } from 'app/main/entertrainersmanager/entertraineravailability.model';

@Component({
  selector: 'app-modalform',
  templateUrl: './modalform.component.html',
  styleUrls: ['./modalform.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalformComponent {

  action: string;
  event: CalendarEvent;
  eventForm: FormGroup;
  dialogTitle: string;
  presetColors = MatColors.presets;

  /**
     * Constructor
     *
     * @param {MatDialogRef<ModalformComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
  constructor(
    public matDialogRef: MatDialogRef<ModalformComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
  ) { 
    this.event = _data.event;
    this.action = _data.action;

    if ( this.action === 'edit' )
    {
      this.dialogTitle = this.event.title;
    }
    else
    {
      this.dialogTitle = 'New Event';
      this.event = new CalendarEntertrainerAvailiabilityModel({
        start: _data.date,
        end  : _data.date
      });
    }

    this.eventForm = this.createEventForm();
    // console.log(this.eventForm);
  }

  ngOnInit() {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
 * Create the event form
 *
 * @returns {FormGroup}
 */
  createEventForm(): FormGroup
  {
    return new FormGroup({
      title : new FormControl(this.event.title),
      start : new FormControl(this.event.start),
      end   : new FormControl(this.event.end),
      allDay: new FormControl(this.event.allDay),
      color : this._formBuilder.group({
        primary  : new FormControl(this.event.color.primary),
        secondary: new FormControl(this.event.color.secondary)
      }),
      meta  :
        this._formBuilder.group({
          location: new FormControl(this.event.meta.location),
          notes   : new FormControl(this.event.meta.notes)
        })
    });
  }

}
