import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { EventType } from 'app/models/eventType.model';


import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { EventTypesService } from './eventtypes.service';

@Component({
    selector: 'eventtypesmanager',
    templateUrl: './eventtypes.component.html',
    styleUrls: ['./eventtypes.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EventTypesComponent implements OnInit, OnDestroy {
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    private eventTypes: EventType[];
    displayedColumns = ['num-auto', 'oid', 'acronym', 'descr']; 
    dataSource: MatTableDataSource<EventType>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _eventTypesService: EventTypesService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, italian);
    }


    ngOnInit(): void {
        this._eventTypesService.getEventTypes().subscribe((eventTypes: EventType[]) => {
            this.eventTypes = eventTypes;
            this.dataSource = new MatTableDataSource(this.eventTypes);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator
        }, error => console.error(error));
        //setTimeout(() => this.dataSource.paginator = this.paginator)
    }

    public doFilter = (value: string) => {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
      }

    ngOnDestroy(): void {

    }


}
