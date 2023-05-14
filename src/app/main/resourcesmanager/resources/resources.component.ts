import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatFabMenu } from '@angular-material-extensions/fab-menu';
import { Location } from '@angular/common';
import { includes } from 'lodash';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Resource } from 'app/models/resource.model';
import { AuthService } from 'app/security/services/auth.service';
import { ExcelService } from 'app/services/excel.service';

import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { ResourceService } from '../resource/resource.service';
import { ResourcesService } from './resources.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'resourcesmanager',
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ResourcesComponent implements OnInit, OnDestroy, AfterViewInit {
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    private resources: Resource[];
    displayedColumns = ['num-auto', 'oid', 'code', 'name', 'type', 'available', 'qta', 'eventCount', 'status'];

    //dataSource: MatTableDataSource<Resource>;
    dataSource = new MatTableDataSource<Resource>();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true })
    sort: MatSort;
    isTrash:string = '';

    @ViewChild('filter', { static: true })
    filter: ElementRef;
    isExcelFile: boolean;
    @ViewChild('fileInput', { static: true }) inputFile: ElementRef;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _resourcesService: ResourcesService,
        private excelService: ExcelService,
        private _authService: AuthService,
        private _resourceService: ResourceService,
        private _matSnackBar: MatSnackBar,
        private location: Location
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, italian);
    }



    ngOnInit(): void {
      const currentUrl = this.location.path();
      // console.log(currentUrl);
      this.isTrash = includes(currentUrl, 'trash') ? 'trash' : '';
        this._resourcesService.getResources(this.isTrash).subscribe((resources: Resource[]) => {
            // console.log(resources);
            this.resources = resources;
            this.dataSource.data = this.resources;
            //this.dataSource.sort = this.sort;
            //this.dataSource.paginator = this.paginator
        }, error => console.error(error));
        //setTimeout(() => this.dataSource.paginator = this.paginator)
    }

    ngAfterViewInit(): void {
        //throw new Error('Method not implemented.');
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator
        this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
                case 'name': {
                    console.log(property);
                    if (item.descr) {
                        return item.descr;
                    }
                    if (item.name) {
                        return item.name + " " + item.surname;
                    }
                }

                default: {
                    console.log('Inside default sort');
                    return item[property];
                }
            }
        };
    }


    public doFilter = (value: string) => {
        this.dataSource.filterPredicate = (data, filter) => {
            const matchFilter = [];
            const filterArray = filter.split(';');
            filterArray.forEach(filter => {
                const customFilter = [];
                customFilter.push(JSON.stringify(data).toLocaleLowerCase().includes(filter));
                matchFilter.push(customFilter.some(Boolean)); // OR
            });
            return matchFilter.every(Boolean); // AND
        }
        this.dataSource.filter = value.trim().toLocaleLowerCase();


    }

    public getSequenceNumber(index: number): number {
      return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
    }

    public getDSequenceNumber(index: number): number {
      const totalRows = this.dataSource.data.length;
      return totalRows - (index + (this.paginator.pageIndex * this.paginator.pageSize));
    }

    ngOnDestroy(): void {

    }


    getResourceName(resource: Resource) {
        if (resource.descr) {
            return resource.descr;
        }
        else {
            return resource.name + " " + resource.surname;
        }
    }


    public exportExcel() {
        let data = this.dataSource.filteredData ? this.dataSource.filteredData : this.dataSource.data;
        let resourcesExcel = JSON.parse(JSON.stringify(this.dataSource.filteredData));
        resourcesExcel.forEach(resource => {
            delete resource.oid;

        })
        console.log(resourcesExcel);
        this.excelService.exportAsExcelFile(resourcesExcel, 'risorse');
    }


    onChange(evt) {
        return;
        let data;
        const target: DataTransfer = <DataTransfer>(evt.target);
        this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
        if (target.files.length > 1) {
            this.inputFile.nativeElement.value = '';
        }
        if (this.isExcelFile) {
            const reader: FileReader = new FileReader();
            reader.onload = (e: any) => {
                /* read workbook */
                const bstr: string = e.target.result;

                /* save data */
                data = this.excelService.importFromExcelFile(bstr);
            };

            reader.readAsBinaryString(target.files[0]);

            reader.onloadend = (e) => {
                console.log(data);
                let oid_user = this._authService.getLoggedUser().oid;
                new Promise((resolve, reject) => {
                    data.data.forEach(element => {
                        let res: Resource = element;

                        this._resourceService.addResource(res, null);
                    });
                    resolve(data);
                }).then(() => {
                    this._matSnackBar.open('Import Risorse completato!', 'OK', {
                        verticalPosition: 'top',
                        duration: 2000
                    });
                })
            }

        } else {
            this.inputFile.nativeElement.value = '';
        }
    }

    resetFile() {
        this.inputFile.nativeElement.value = '';
    }


}
