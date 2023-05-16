import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AuthService } from 'app/security/services/auth.service';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { locale as english } from './i18n/en';
import { locale as italian } from './i18n/it';

import { Subject } from 'rxjs';
import { startOfDay, isSameDay, isSameMonth, isThisHour } from 'date-fns';
import { CalendarService } from 'app/main/dashboard/calendar.service';
import { CalendarEventModel } from 'app/main/dashboard/event.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CalendarEventFormDialogComponent } from 'app/main/dashboard/event-form/event-form.component';
import { FormGroup } from '@angular/forms';
import { MatFabMenu } from '@angular-material-extensions/fab-menu';
import { ThemePalette, TooltipPosition } from '@angular/material';
import { Router, RouterModule } from '@angular/router';
import { EventsService } from '../eventsmanager/events/events.service';

import { ToDoListService } from '../todomanager/todolist/todolist.service';
import { Event } from 'app/models/event.model';
import { DatePipe } from '@angular/common';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Business } from 'app/models/business.model';
import { ToDo } from 'app/models/todo.model';



@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DashboardComponent implements OnInit, OnDestroy {
    public isSuperUser: boolean = false;
    actions: CalendarEventAction[];
    actionsTodo: CalendarEventAction[];
    activeDayIsOpen: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    dialogRef: any;
    allEvents: Event[];
    allTodo: ToDo[];
    events: CalendarEvent[] = [];
    refresh: Subject<any> = new Subject();
    selectedDay: any;
    view: string;
    viewDate: Date;
    positionOptions: TooltipPosition[] = ['below'];
    fabButtonsRandom: MatFabMenu[] = [
        {
            id: 1,
            icon: 'event',
            tooltip: 'Aggiungi Evento',
            tooltipPosition: this.positionOptions[0],
            color: 'accent'
        },
        {
            id: 2,
            icon: 'schedule',
            tooltip: 'Aggiungi ToDo',
            tooltipPosition: this.positionOptions[0],
            color: 'accent'
        },
        {
            id: 3,
            icon: 'contact_phone',
            tooltip: 'Aggiungi Appuntamento',
            tooltipPosition: this.positionOptions[0],
            color: 'accent'
        }
    ];
    

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private authService: AuthService,
        private _calendarService: CalendarService,
        private _matDialog: MatDialog,
        private router: Router,
        private _eventsService: EventsService,
        private _todoListService : ToDoListService,
        public datepipe: DatePipe,
        private _fuseSidebarService: FuseSidebarService

    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, italian);
        // Set the defaults
        this.view = 'month';
        this.viewDate = new Date();
        this.activeDayIsOpen = true;
        this.selectedDay = { date: startOfDay(new Date()) };

        this.actions = [
            {
                label: '<i class="material-icons s-16">edit</i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                    this.editEvent('edit', event);
                }
            }/*,
            {
                label: '<i class="material-icons s-16">delete</i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                    this.deleteEvent(event);
                }
            }*/
        ];
        this.actionsTodo = [
            {
                label: '<i class="material-icons s-16">edit</i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                    this.editEventTodo('edit', event);
                }
            }/*,
            {
                label: '<i class="material-icons s-16">delete</i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                    this.deleteEvent(event);
                }
            }*/
        ];
        this.setEvents();
        this.setTodo();
    }

    ngOnInit(): void {
        this.isSuperUser = this.authService.isSuperUser();
        //this.requestPushNotificationsPermission();
        //this.geolocalization();
        /*if (navigator && navigator.serviceWorker) {
            navigator.serviceWorker.removeEventListener('message', this.onReceiveMsg.bind(this));
            navigator.serviceWorker.addEventListener('message', this.onReceiveMsg.bind(this));
        }*/

        /**
         * Watch re-render-refresh for updating db
         */

        /*setTimeout(() => {
            this._calendarService.keepAlive();
        }, 2000);
        this.refresh.subscribe(updateDB => {
            if (updateDB) {
                this._calendarService.updateEvents(this.events);
            }
        });*/

        this._calendarService.onEventsUpdated.subscribe(events => {
            this.setEvents();
            this.setTodo();
            this.refresh.next();
        });
    }

    ngOnDestroy(): void {
        console.log("DESTROY");
    }

    filterEventByStatus(status:any, business:Business[]) {
        console.log('Filtro per status', status);
        this.events = [];
        status.forEach(st => {
            this.allEvents.forEach(element => {
                if (element.status.oid == st.id) {
                    business.forEach(b => {
                        if (element.business.oid == b.oid) {
                            let evt = new CalendarEventModel();
                            evt.id = element.oid;
                            evt.actions = this.actions;
                            evt.start = new Date((element.from+"").replace(/\s/g, "T"));
                            evt.end = new Date( (element.to+"").replace(/\s/g, "T"));
                            evt.title = element.customer.name + " " + element.customer.surname+" - "+element.address +" - INIZIO: "+this.datepipe.transform(evt.start, 'dd/MM/yyyy HH:mm')+ " FINE: "+this.datepipe.transform(evt.end, 'dd/MM/yyyy HH:mm');
                            evt.color = { primary: element.business.color, secondary: element.business.color };
                            evt.warning = element.warning;
                            evt.meta.type = 0;
                            this.events.push(evt);
                        }
                    })
                }
            });
        });
        this.refresh.next();
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
    
    countTodo(day: CalendarMonthViewDay): number {
        let count = 0;
        day.events.filter(event => {
            if (event.meta.type === 1) {
                count++;
            }
        })
        return count;
    }

    filterEventByBusiness(business:Business[], status:any,) {
        console.log('Filtro per business', business);
        this.events = [];
        business.forEach(b => {
            this.allEvents.forEach(element => {
                if (element.business.oid == b.oid) {
                    status.forEach(st => {
                        if (element.status.oid == st.id) {
                            let evt = new CalendarEventModel();
                            evt.id = element.oid;
                            evt.actions = this.actions;
                            evt.start = new Date((element.from+"").replace(/\s/g, "T"));
                            evt.end = new Date( (element.to+"").replace(/\s/g, "T"));
                            evt.title = element.customer.name + " " + element.customer.surname+" - "+element.address +" - INIZIO: "+this.datepipe.transform(evt.start, 'dd/MM/yyyy HH:mm')+ " FINE: "+this.datepipe.transform(evt.end, 'dd/MM/yyyy HH:mm');
                            evt.color = { primary: element.business.color, secondary: element.business.color };
                            evt.warning = element.warning;
                            evt.meta.type = 0;
                            this.events.push(evt);
                        }
                    });
                }
            });
        });
        this.refresh.next();
    }


    filterTodo(status:any) {
      console.log("<<<<<< Click event");
        
        if (status.length == 1) {
            this.allTodo.forEach(element => {
                let evt = new CalendarEventModel();
                evt.id = element.oid;
                evt.actions = this.actionsTodo;
                evt.start = new Date((element.datetime+"").replace(/\s/g, "T"));
                evt.end = new Date( (element.datetime+"").replace(/\s/g, "T"));
                let status = "";
                if (element.completed == Boolean(Number(1))) {
                    status = "Completato"
                }
                else {
                    status = "Non Completato"
                }
                evt.title = "TODO: "+element.title + " " + element.descr+" - Data/ora: "+this.datepipe.transform(evt.start, 'dd/MM/yyyy HH:mm') + " - Stato: "+status;
                evt.color = { primary: 'red', secondary: 'red' };
                evt.warning = false;
                evt.meta.type = 1;
                this.events.push(evt);
            });
            this.refresh.next();
        }
        else {
            this.events = this.events.filter(function( obj ) {
                return !obj.title.startsWith("TODO:");
            });
        }
        this.refresh.next();
        
    }


    setEvents(): void {
      /*this.events = this._calendarService.events.map(item => {
        item.actions = this.actions;
        return new CalendarEventModel(item);
      });*/
      this._eventsService.getEvents().subscribe((events: Event[]) => {
        this.allEvents = events;
        console.log("<<<<<< Load available events:", events);
            events.forEach(element => {
                if (element.status.oid == 2) {// SOLO CONFERMATI
                  let evt = new CalendarEventModel();
                  evt.id = element.oid;
                  evt.actions = this.actions;
                  evt.start = new Date((element.from+"").replace(/\s/g, "T"));
                  evt.end = new Date( (element.to+"").replace(/\s/g, "T"));
                  // evt.title = element.customer.name + " " + element.customer.surname + " - " + element.address + " - INIZIO: "+this.datepipe.transform(evt.start, 'dd/MM/yyyy HH:mm')+ " FINE: "+this.datepipe.transform(evt.end, 'dd/MM/yyyy HH:mm');
                  evt.title = `<b>Address</b>: ` + element.address + `<br>`;
                  evt.title +=`<b>Info</b>: ` + element.info_event+ `<br>`;
                  evt.title +=`<b>Note</b>: ` + element.note + `<br>`;
                  evt.title +=`<b>Time</b>: ` + element.from + `~` + element.to + `<br>`;
                  evt.title +=`<hr/>`;
                  evt.title +=`<b>Business</b>: ` + element.business.name + `<br>`;
                  evt.title +=`<hr/>`;
                  evt.title +=`<b>Customer</b>: ` + element.customer.name + ` ` + element.customer.surname + ` `;
                  evt.title +=`<b>Tel</b>: ` + element.customer.tel + ` ` + `<b>Cell</b>: ` + element.customer.cell + ` ` + `<b>Email</b>: ` + element.customer.email;
                  evt.color = { primary: element.business.color, secondary: element.business.color };
                  evt.warning = element.warning;
                  evt.meta.type = 0;
                  this.events.push(evt);
                  this.refresh.next();
                }
            });
          console.log(this.events);
        }, error => console.error(error));
    }


    setTodo(): void {
        /*this.events = this._calendarService.events.map(item => {
            item.actions = this.actions;
            return new CalendarEventModel(item);
        });*/
        this._todoListService.getToDoList().subscribe((todolist: ToDo[]) => {
            this.allTodo = todolist;
            todolist.forEach(element => {
                let evt = new CalendarEventModel();
                evt.id = element.oid;
                evt.actions = this.actionsTodo;
                evt.start = new Date((element.datetime+"").replace(/\s/g, "T"));
                evt.end = new Date( (element.datetime+"").replace(/\s/g, "T"));
                let status = "";
                if (element.completed == Boolean(Number(1))) {
                    status = "Completato"
                }
                else {
                    status = "Non Completato"
                }
                evt.title = "TODO: "+element.title + " " + element.descr+" - Data/ora: "+this.datepipe.transform(evt.start, 'dd/MM/yyyy HH:mm') + " - Stato: "+status;
                evt.color = { primary: 'red', secondary: 'red' };
                evt.warning = false;
                evt.meta.type = 1;
                this.events.push(evt);
                this.refresh.next();
            });
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


    onSelected(event) {
        console.log(event)
        if (event == 1) {
            //this.addEvent();
            //this.router.navigateByUrl('/eventsmanager/new');
            this.router.navigateByUrl('/eventsmanager/new?data='+this.datepipe.transform(this.selectedDay.date, 'yyyy-MM-dd'));
        }
        if (event == 2) {//appuntamento
            //this.router.navigateByUrl('/eventsmanager/new');
        }
        if (event == 3) {//appuntamento
            this.router.navigateByUrl('/todolistmanager/new');
        }
    }

    /*onReceiveMsg(event) {
        console.log(event.data.notification);
        this.showMessage(event.data.notification.title, event.data.notification.body );
    }

    showMessage(title, msg) {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmTitle = title;
        this.confirmDialogRef.componentInstance.confirmMessage = msg;
        this.confirmDialogRef.componentInstance.confirmButtonTitle = "OK";
        this.confirmDialogRef.componentInstance.cancellButtonTitle = "Annulla";

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            
            this.confirmDialogRef = null;
        });
    }*/

    /*geolocalization() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position: Position) => {
                const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                console.log(pos);
            })
        }
    }*/

    /*requestPushNotificationsPermission() { // requesting permission
        this.afMessaging.requestToken // getting tokens
            .subscribe(
                (token) => { // USER-REQUESTED-TOKEN
                    console.log('Permission granted! Save to the server!', token);
                    this.receiveMessage();
                },
                (error) => {
                    console.error(error);
                }
            );
    }

    receiveMessage() {
        this.afMessaging.messages.subscribe(
            (message) => {
                console.log('Message received:', message);
            },
            (error) => { console.log("failed to subscribe to firebase messaging") }
        );
    }*/


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


    deleteEvent(event): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
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
    editEvent(action: string, event: CalendarEvent): void {
        if (event.meta.type === 0) {
            this.router.navigateByUrl('/eventsmanager/'+event.id);
        }
        if (event.meta.type === 1) {
            this.router.navigateByUrl('/todolistmanager/'+event.id);
        }
        /*const eventIndex = this.events.indexOf(event);

        this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
            panelClass: 'event-form-dialog',
            data: {
                event: event,
                action: action
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch (actionType) {

                    case 'save':

                        this.events[eventIndex] = Object.assign(this.events[eventIndex], formData.getRawValue());
                        this.refresh.next(true);

                        break;

                    case 'delete':

                        this.deleteEvent(event);

                        break;
                }
            });*/
            
    }

    editEventTodo(action: string, event: CalendarEvent): void {
        this.router.navigateByUrl('/todolistmanager/'+event.id);
    }

    /**
     * Add Event
     */
    addEvent(): void {
      // console.log(">>>>>>calendar event click");
        this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
            panelClass: 'event-form-dialog',
            data: {
                action: 'new',
                date: this.selectedDay.date
            }
        });
        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }
                const newEvent = response.getRawValue();
                newEvent.actions = this.actions;
                this.events.push(newEvent);
                this.refresh.next(true);
            });
    }

}
