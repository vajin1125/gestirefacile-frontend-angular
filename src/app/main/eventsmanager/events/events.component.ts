import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TooltipPosition } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatFabMenu } from '@angular-material-extensions/fab-menu';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { includes } from 'lodash';

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
    displayedColumns = ['num-auto', 'oid', 'cliente', 'tipo', 'orari', 'stato', 'business', 'status']; 
    dataSource: MatTableDataSource<Event>;
    tmpDataSource: MatTableDataSource<Event>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true})
    sort: MatSort;
    
    @ViewChild('filter', {static: true})
    filter: ElementRef;

    searchInput: string = '';
    isTrash:string = '';
    // positionOptions: TooltipPosition[] = ['below'];
    fabButtonsRandom: MatFabMenu[] = [
        {
            id: 1,
            icon: 'print',
            // tooltip: 'Stampa',
            // tooltipPosition: this.positionOptions[0],
            color: 'accent'
        },
        {
            id: 2,
            icon: 'cloud_download',
            // tooltip: 'Scarica',
            // tooltipPosition: this.positionOptions[0],
            color: 'accent'
        }
    ];
    
    constructor(
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private _eventsService: EventsService,
      public datepipe: DatePipe,
      private route: ActivatedRoute,
      private location: Location
      ) {
        this._fuseTranslationLoaderService.loadTranslations(english, italian);
      }
      
      
      ngOnInit(): void {
        const currentUrl = this.location.path();
        // console.log(currentUrl);
        this.isTrash = includes(currentUrl, 'trash') ? 'trash' : '';
        // console.log(this.isTrash);
        this._eventsService.getEvents(this.isTrash).subscribe((events: Event[]) => {
          this.events = events;
          // console.log(events)
          // oid, customer.name, customer.surname, type.descr, from, to, status.descr, business.descr
          let extractData = []
          events.map((item:any) => {
            extractData.push({ 
              oid: item.oid, 
              cliente: item.customer.name + ' ' + item.customer.surname,
              tipo: item.type.descr,
              // orari: item.from + '\n' + item.to,
              from: item.from,
              to: item.to,
              stato: item.status.descr,
              business: item.business.descr,
              is_trash: item.is_trash
            })
          });
          // console.log(extractData)
          this.dataSource = new MatTableDataSource(extractData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator

          this.tmpDataSource = new MatTableDataSource(extractData);
          this.tmpDataSource.sort = this.sort;
          this.tmpDataSource.paginator = this.paginator
          // console.log(this.dataSource)
        }, error => console.error(error));
        //setTimeout(() => this.dataSource.paginator = this.paginator)
      }
      
      public doFilter = (value: any) => {
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
        // console.log(typeof(this.dataSource.data[0].from));
        this.dataSource.data = this.tmpDataSource.data;
        this.dataSource.filter = value.trim().toLocaleLowerCase();
      }

      public doFilterDate = (date1: any) => {
        let searchDate = '';
        let searchBeginDate = '';
        let searchEndDate = '';
        if (date1) {
          let mm = date1.begin.getMonth() + 1;
          let dd = date1.begin.getDate();
          mm = mm > 9 ? mm : "0" + mm;
          dd = dd > 9 ? dd : "0" + dd;
          searchDate += date1.begin.getFullYear() + "-" + mm + "-" + dd;
          searchBeginDate = date1.begin.getFullYear() + "-" + mm + "-" + dd + " " + "00:00:00";

          let mm1 = date1.end.getMonth() + 1;
          let dd1 = date1.end.getDate();
          mm1 = mm1 > 9 ? mm1 : "0" + mm1;
          dd1 = dd1 > 9 ? dd1 : "0" + dd1;
          searchDate += ' ~ ' + date1.end.getFullYear() + "-" + mm1 + "-" + dd1;
          searchEndDate = date1.end.getFullYear() + "-" + mm1 + "-" + dd1 + " " + "23:59:59";

          this.searchInput = searchDate;

        }
        this.dataSource.data = this.tmpDataSource.data.filter(e => new Date(e.from) >= new Date(searchBeginDate) && new Date(e.to) <= new Date(searchEndDate));
      }

      public getSequenceNumber(index: number): number {
        return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
      }
  
      public getDSequenceNumber(index: number): number {
        const totalRows = this.dataSource.data.length;
        return totalRows - (index + (this.paginator.pageIndex * this.paginator.pageSize));
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

    getBackup() {
      this._eventsService.getBackup().subscribe(() => {
        console.log("downloaded")
      })
    }

    ngOnDestroy(): void {

    }

    onSelected(event, elem) {
      // console.log(event)
      // console.log(elem)
      console.log("asdfasdf")
      if (event == 1) {//print
          // this.print(elem);
          // this.print_other(elem)
      }
      if (event == 2) {//download
          //this.download();
          // this.download(elem);
      }
      if (event == 3) {//email
          // this.sendInvoiceEmail();

      }
      if (event == 4) {//whatsapp
          // this.sendPdfWP();
      }
  }

}
