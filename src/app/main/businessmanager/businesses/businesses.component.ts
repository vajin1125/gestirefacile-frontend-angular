import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Business } from 'app/models/business.model';


import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { BusinessesService } from './businesses.service';

@Component({
    selector: 'businessesmanager',
    templateUrl: './businesses.component.html',
    styleUrls: ['./businesses.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class BusinessesComponent implements OnInit, OnDestroy {
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    private businesses: Business[];
    displayedColumns = ['oid', 'name', 'descr']; 
    dataSource: MatTableDataSource<Business>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;
    

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _businessesmanagerService: BusinessesService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, italian);
    }


    ngOnInit(): void {
        this._businessesmanagerService.getBusinesses().subscribe((businesses: Business[]) => {
            this.businesses = businesses;
            this.dataSource = new MatTableDataSource(this.businesses);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        }, error => console.error(error));
        //setTimeout(() => this.dataSource.paginator = this.paginator)
    }

    public doFilter = (value: string) => {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
      }

    ngOnDestroy(): void {

    }


}
