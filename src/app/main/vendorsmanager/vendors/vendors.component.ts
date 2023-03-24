import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Vendor } from 'app/models/vendor.model';

import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { VendorsService } from './vendors.service';

@Component({
    selector: 'vendorsmanager',
    templateUrl: './vendors.component.html',
    styleUrls: ['./vendors.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class VendorsComponent implements OnInit, OnDestroy {
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    private vendors: Vendor[];
    displayedColumns = ['num-auto', 'oid', 'name', 'surname','business_name', 'email'];
    dataSource: MatTableDataSource<Vendor>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _vendorsmanagerService: VendorsService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, italian);
    }


    ngOnInit(): void {
        this._vendorsmanagerService.getVendors().subscribe((vendors: Vendor[]) => {
            this.vendors = vendors;
            this.dataSource = new MatTableDataSource(this.vendors);
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
