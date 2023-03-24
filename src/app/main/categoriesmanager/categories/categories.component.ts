import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Category } from 'app/models/category.model';


import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { CategoriesService } from './categories.service';

@Component({
    selector: 'categoriesmanager',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class CategoriesComponent implements OnInit, OnDestroy {
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    private categories: Category[];
    displayedColumns = ['num-auto', 'oid', 'acronym', 'descr']; 
    dataSource: MatTableDataSource<Category>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _categoriesService: CategoriesService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, italian);
    }


    ngOnInit(): void {
        this._categoriesService.getCategories().subscribe((categories: Category[]) => {
            this.categories = categories;
            // console.log(categories)
            this.dataSource = new MatTableDataSource(this.categories);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator
            // console.log(this.dataSource)
        }, error => console.error(error));
        //setTimeout(() => this.dataSource.paginator = this.paginator)
    }

    public doFilter = (value: string) => {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
      }

    ngOnDestroy(): void {

    }


}
