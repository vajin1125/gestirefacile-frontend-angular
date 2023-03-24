import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AccessLog } from 'app/models/access.model';


import { locale as english } from './i18n/en';
import { locale as italian } from './i18n/it';
import { AccessesService } from './accesses.service';

@Component({
    selector: 'accesses',
    templateUrl: './accesses.component.html',
    styleUrls: ['./accesses.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class AccessesComponent implements OnInit, OnDestroy {
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    private accesses: AccessLog[];
    displayedColumns = ['user', 'ipaddress', 'data', 'position']; 
    dataSource: MatTableDataSource<AccessLog>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _accessesService: AccessesService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, italian);
    }


    ngOnInit(): void {
        this._accessesService.getAccesses().subscribe((accesses: AccessLog[]) => {
            this.accesses = accesses;
            this.dataSource = new MatTableDataSource(this.accesses);
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
