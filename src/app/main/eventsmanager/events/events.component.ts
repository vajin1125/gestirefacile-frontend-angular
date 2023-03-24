import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Event } from 'app/models/event.model';
// import { ConsoleReporter } from 'jasmine';

import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { EventsService } from './events.service';

@Component({
    selector: 'eventsmanager',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EventsComponent implements OnInit, OnDestroy {
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    private events: Event[];
    displayedColumns = ['num-auto', 'oid', 'cliente', 'tipo', 'orari', 'stato', 'business']; 
    dataSource: MatTableDataSource<Event>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true})
    sort: MatSort;
    
    @ViewChild('filter', {static: true})
    filter: ElementRef;
    
    constructor(
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private _eventsService: EventsService,
      public datepipe: DatePipe
      ) {
        this._fuseTranslationLoaderService.loadTranslations(english, italian);
      }
      
      
      ngOnInit(): void {
        
        this._eventsService.getEvents().subscribe((events: Event[]) => {
          this.events = events;
          // console.log(events)
          // oid, customer.name, customer.surname, type.descr, from, to, status.descr, business.descr
          let extractData = []
          events.map((item:any) => {
            extractData.push({ 
              oid: item.oid, 
              cliente: item.customer.name + ' ' + item.customer.surname,
              tipo: item.type.descr,
              orari: item.from + '\n' + item.to,
              stato: item.status.descr,
              business: item.business.descr
            })
          });
          // console.log(extractData)
          this.dataSource = new MatTableDataSource(extractData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator
          // console.log(this.dataSource)
        }, error => console.error(error));
        //setTimeout(() => this.dataSource.paginator = this.paginator)
      }
      
      public doFilter = (value: string) => {
        /*this.dataSource.filterPredicate = (data, filter) =>{
            console.log(JSON.stringify(data))
            return JSON.stringify(data).toLocaleLowerCase().indexOf(filter) != -1;
        } 
        this.dataSource.filter = value.trim().toLocaleLowerCase();*/
        // this.dataSource.filterPredicate = (data, filter) => {
        //     const matchFilter = [];
        //     const filterArray = filter.split(';');
        //     filterArray.forEach(filter => {
        //         const customFilter = [];
        //         customFilter.push(JSON.stringify(data).toLocaleLowerCase().includes(filter));
        //         matchFilter.push(customFilter.some(Boolean)); // OR
        //     });
        //     return matchFilter.every(Boolean); // AND
        // }
        this.dataSource.filter = value.trim().toLocaleLowerCase();
    }

    getFormatDate(date) {
        /*let dt = new Date(date.replace(/\s/g, "T"));
        return this.datepipe.transform(dt, 'dd/MM/yyyy HH:mm');*/
        if (date) {
            let dt = new Date(date);
            return this.datepipe.transform(dt, 'dd/MM/yyyy HH:mm');
        }else {
            return '';
        }
        
    }

    ngOnDestroy(): void {

    }


}
