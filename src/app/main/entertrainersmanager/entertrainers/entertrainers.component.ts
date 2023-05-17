import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AuthService } from 'app/security/services/auth.service';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DatePipe } from '@angular/common';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
// import { locale as english } from './i18n/en';
// import { locale as italian } from './i18n/it';
import { Subject } from 'rxjs';
import { startOfDay, isSameDay, isSameMonth, isThisHour } from 'date-fns';
import { CalendarService } from 'app/main/dashboard/calendar.service';
import { CalendarEventModel } from 'app/main/dashboard/event.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalformComponent } from '../modalform/modalform.component';
import { FormGroup } from '@angular/forms';
import { MatFabMenu } from '@angular-material-extensions/fab-menu';
import { ThemePalette, TooltipPosition } from '@angular/material';
import { Router, RouterModule } from '@angular/router';
// import { EventsService } from '../../eventsmanager/events/events.service';
import { EntertrainersService } from './entertrainers.service';
// import { Event } from 'app/models/event.model';
import { EntertrainerAvailability } from 'app/models/entertrainerAvailability.model';
import { Business } from 'app/models/business.model';
// import { ToDo } from 'app/models/todo.model';

@Component({
  selector: 'app-entertrainers',
  templateUrl: './entertrainers.component.html',
  styleUrls: ['./entertrainers.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EntertrainersComponent implements OnInit, OnDestroy {
  public isSuperUser: boolean = false;
  public loggeduserInfo: any;
  public isEntertrainer: boolean = false;
    actions: CalendarEventAction[];
    activeDayIsOpen: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    dialogRef: any;
    allEntertrainers: EntertrainerAvailability[];
    events: CalendarEvent[] = [];
    refresh: Subject<any> = new Subject();
    selectedDay: any;
    view: string;
    viewDate: Date;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private authService: AuthService,
    private _calendarService: CalendarService,
    private _matDialog: MatDialog,
    private router: Router,
    private _entertrainersService: EntertrainersService,
    public datepipe: DatePipe,
    private _fuseSidebarService: FuseSidebarService,
    private _matSnackBar: MatSnackBar,
  ) { 
    this._fuseTranslationLoaderService.loadTranslations();
    // Set the defaults
    this.view = 'month';
    this.viewDate = new Date();
    this.activeDayIsOpen = false;
    this.selectedDay = { date: startOfDay(new Date()) };

    this.actions = [
        {
            label: '<i class="material-icons s-16">edit</i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.editAvailability('edit', event);
            }
        },
        {
            label: '<i class="material-icons s-16">delete</i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.deleteAvailability(event);
            }
        }
    ];

    this.loggeduserInfo = this.authService.getLoggedUser();
    this.isEntertrainer = this.authService.isEntertrainer();
    if (this.isEntertrainer) {
      this.setEntertrainers(this.loggeduserInfo.oid);
    } else {
      this.setEntertrainers();
    }
  }

  ngOnInit():void {
    this.isSuperUser = this.authService.isSuperUser();
    this.loggeduserInfo = this.authService.getLoggedUser();
    this.isEntertrainer = this.authService.isEntertrainer();
    // console.log(this.authService.getLoggedUser());
    this._calendarService.onEventsUpdated.subscribe(events => {
      if (this.isEntertrainer) {
        this.setEntertrainers(this.loggeduserInfo.oid);
      } else {
        this.setEntertrainers();
      }
      // this.setTodo();
      this.refresh.next();
  });
  }

  ngOnDestroy(): void {
    console.log("DESTROY");
  }

  countEvents(day: CalendarMonthViewDay): number {
    let count = 0;
    day.events.filter(event => {
      if (event.meta.type === 0) {
        count++;
      }
    })
    return count;
  }

filterEventByBusiness(business:Business[], status:any,) {
    // console.log('Filtro per business', business);
    this.events = [];
    business.forEach(b => {
        this.allEntertrainers.forEach(element => {
            if (element.business.oid == b.oid) {
                status.forEach(st => {
                    if (element.business.oid == st.id) {
                        let evt = new CalendarEventModel();
                        evt.id = element.oid;
                        evt.actions = this.actions;
                        evt.start = new Date((element.start_date+"").replace(/\s/g, "T"));
                        evt.end = new Date( (element.end_date+"").replace(/\s/g, "T"));
                        evt.title = element.title;
                        evt.color = { primary: element.primary_color, secondary: element.secondary_color };
                        this.events.push(evt);
                    }
                });
            }
        });
    });
    this.refresh.next();
}

setEntertrainers(user_oid=null): void {
  /*this.events = this._calendarService.events.map(item => {
    item.actions = this.actions;
    return new CalendarEventModel(item);
  });*/
  this._entertrainersService.getEntertrainers(user_oid).subscribe((events: EntertrainerAvailability[]) => {
    this.allEntertrainers = events;
    // console.log("<<<<<< Load available events:", events);
        events.forEach(element => {
          // if (element.oid == 2) {// SOLO CONFERMATI
            let evt = new CalendarEventModel();
            evt.id = element.oid;
            evt.actions = this.actions;
            evt.start = new Date((element.start_date+"").replace(/\s/g, "T"));
            evt.end = new Date( (element.end_date+"").replace(/\s/g, "T"));
            evt.title = element.title;
            evt.color = { primary: element.primary_color, secondary: element.secondary_color };
            evt.meta.type = 0;
            evt.meta.location = element.location;
            evt.meta.notes = element.note;
            this.events.push(evt);
            this.refresh.next();
            // console.log(this.events)
          // }
        });
        // console.log(this.events)
    }, error => console.error(error));
}

toggleSidebar(name): void
{
    this._fuseSidebarService.getSidebar(name).toggleOpen();
}

haveWarn(events:CalendarEventModel[]) {
    let warn = false;
    events.forEach((evt)=> {
        if (evt.warning) {
            warn = true;
        }
    })
    return warn;
}

beforeMonthViewRender({ header, body }): void {
  /**
   * Get the selected day
   */
  const _selectedDay = body.find((_day) => {
      return _day.date.getTime() === this.selectedDay.date.getTime();
  });

  if (_selectedDay) {
      /**
       * Set selected day style
       * @type {string}
       */
      _selectedDay.cssClass = 'cal-selected';
  }

  body.forEach(cell => {
      const groups: any = {};
      cell.events.forEach((event: CalendarEvent<{ type: string }>) => {
        groups[event.color.primary] = groups[event.color.primary] || [];
        groups[event.color.primary].push(event);
      });
      cell['eventGroups'] = Object.entries(groups);
    });

}

dayClicked(day: CalendarMonthViewDay): void {
  const date: Date = day.date;
  const events: CalendarEvent[] = day.events;

  if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
          this.activeDayIsOpen = false;
      }
      else {
          this.activeDayIsOpen = true;
          this.viewDate = date;
      }
  }
  this.selectedDay = day;
  this.refresh.next();
}

eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
  event.start = newStart;
  event.end = newEnd;
  // console.warn('Dropped or resized', event);
  this.refresh.next(true);
}


async deleteAvailability(event): Promise<void> {

  // console.log(event);
  this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
  });

  this.confirmDialogRef.componentInstance.confirmTitle = 'Delete';
  this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
  this.confirmDialogRef.componentInstance.confirmButtonTitle = "OK";
  this.confirmDialogRef.componentInstance.cancellButtonTitle = "Annulla";

  this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._entertrainersService.deleteAvailability(event)
          .then(() => {
            this._matSnackBar.open('Deleted Availability', 'OK', {
              verticalPosition: 'top',
              duration: 2000
            });
          }, error => {
            this._matSnackBar.open("ERROR " + error.error, 'OK', {
              verticalPosition: 'top',
              duration: 2000
            })
          })

        const eventIndex = this.events.indexOf(event);
        this.events.splice(eventIndex, 1);
        this.refresh.next(true);
      }
      this.confirmDialogRef = null;
  });

}

/**
* Edit Event
*
* @param {string} action
* @param {CalendarEvent} event
*/
async editAvailability(action: string, event): Promise<void> {
  const eventIndex = this.events.indexOf(event);
  // console.log(event);
  this.dialogRef = this._matDialog.open(ModalformComponent, {
      panelClass: 'event-form-dialog',
      data: {
          event: event,
          action: action
      }
  });

  await this.dialogRef.afterClosed()
      .subscribe( async (response: FormGroup) => {
          if (!response) {
              return;
          }
          const actionType: string = response[0];
          const formData: FormGroup = response[1];
          switch (actionType) {

              case 'save':
                formData.value.id = event.id;
                // console.log(formData.value);

                await this._entertrainersService.updatevAilability(formData.value)
                  .then((response) => {

                    // console.log(response)
                    
                    let evt = new CalendarEventModel();
                    evt.id = response.id;
                    evt.actions = this.actions;
                    evt.start = new Date(response.start);
                    evt.end = new Date(response.end);
                    evt.title = response.title;
                    evt.color = { primary: response.color.primary, secondary: response.color.secondary };
                    evt.meta.type = 0;
                    evt.meta.location = response.meta.location;
                    evt.meta.notes = response.meta.notes;

                    const eventIndex = this.events.findIndex(event => event.id === formData.value.id);
                    // console.log(eventIndex);
                    // console.log(evt);
                    // this.events.push(evt);
                    this.events.splice(eventIndex, 1, evt);
                    // console.log(this.events);
                    this.refresh.next(true);

                    this._matSnackBar.open('Updated Availability', 'OK', {
                      verticalPosition: 'top',
                      duration: 2000
                    });
                  }, error => {
                    this._matSnackBar.open("ERROR " + error.error, 'OK', {
                      verticalPosition: 'top',
                      duration: 2000
                    })
                  })

                // this.events[eventIndex] = Object.assign(this.events[eventIndex], formData.getRawValue());
                // this.refresh.next(true);

                break;

              case 'delete':

                  this.deleteAvailability(event);

                  break;
          }
      });
      
}

/**
* Add Event
*/
async addAvailability(): Promise<void> {
  // console.log(">>>>>>calendar event click");
  this.dialogRef = this._matDialog.open(ModalformComponent, {
      panelClass: 'event-form-dialog',
      data: {
          action: 'new',
          date: this.selectedDay.date
      }
  });
  await this.dialogRef.afterClosed()
    .subscribe(async (response: FormGroup) => {
        if (!response) {
            return;
        }
        const newEvent = response.getRawValue();
        newEvent.actions = this.actions;

        await this._entertrainersService.addAvailability(newEvent)
        .then(response => {
          // console.log(response)
          
            let evt = new CalendarEventModel();
            evt.id = response.id;
            evt.actions = this.actions;
            evt.start = new Date(response.start);
            evt.end = new Date(response.end);
            evt.title = response.title;
            evt.color = { primary: response.color.primary, secondary: response.color.secondary };
            evt.meta.type = 0;
            evt.meta.location = response.meta.location;
            evt.meta.notes = response.meta.notes;
            
            // console.log(evt);
            this.events.push(evt);
            this.refresh.next(true);

            this._matSnackBar.open('Added Availability', 'OK', {
              verticalPosition: 'top',
              duration: 2000
            });
          }, error => {
            this._matSnackBar.open("ERROR " + error.error, 'OK', {
              verticalPosition: 'top',
              duration: 2000
            })
          })
    });
}

}
