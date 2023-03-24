import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Package } from 'app/models/package.model';


import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { PackagesService } from './packages.service';

@Component({
    selector: 'packagesmanager',
    templateUrl: './packages.component.html',
    styleUrls: ['./packages.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class PackagesComponent implements OnInit, OnDestroy {
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    private packages: Package[];
    displayedColumns = ['num-auto', 'oid', 'name', 'descr', 'enabled']; 
    dataSource: MatTableDataSource<Package>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;
    

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _packagesmanagerService: PackagesService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, italian);
    }


    ngOnInit(): void {
        this._packagesmanagerService.getPackage().subscribe((packages: Package[]) => {
            this.packages = packages;
            this.dataSource = new MatTableDataSource(this.packages);
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
