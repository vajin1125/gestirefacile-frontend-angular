import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Config } from 'app/app.config';
import { Movement } from 'app/models/movement.model';
import { Resource } from 'app/models/resource.model';


import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { MovementsService } from './movements.service';

@Component({
    selector: 'movements',
    templateUrl: './movements.component.html',
    styleUrls: ['./movements.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class MovementsComponent implements OnInit, OnDestroy {
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    private movements: Movement[];
    displayedColumns = ['oid', 'resource', 'qta', 'reason', 'time', 'actions']; 
    dataSource: MatTableDataSource<Movement>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _movementsService: MovementsService,
        public datepipe: DatePipe
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, italian);
    }


    getFormatDate(date) {
        let dt = new Date(date.replace(/\s/g, "T"));
        return this.datepipe.transform(dt, 'dd/MM/yyyy HH:mm');
    }

    getResourceImage(res: Resource) {
        return Config.prop.urlImages + "/resources/" + res.oid + "/" + res.image;
    }


    ngOnInit(): void {
        this._movementsService.getMovements().subscribe((movements: Movement[]) => {
            this.movements = movements;
            this.dataSource = new MatTableDataSource(this.movements);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator
        }, error => console.error(error));
        //setTimeout(() => this.dataSource.paginator = this.paginator)
    }

    public doFilter = (value: string) => {
        this.dataSource.filterPredicate = (data, filter) =>{
            // console.log(JSON.stringify(data))
            return JSON.stringify(data).toLocaleLowerCase().indexOf(filter) != -1;
        } 
        this.dataSource.filter = value.trim().toLocaleLowerCase();
        //this.dataSource.filter = value.trim().toLocaleLowerCase();
      }

    ngOnDestroy(): void {

    }


}
