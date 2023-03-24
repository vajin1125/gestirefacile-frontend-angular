import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Customer } from 'app/models/customer.model';

import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { CustomersService } from './customers.service';
import { ExcelService } from '../../../services/excel.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'app/security/services/auth.service';

@Component({
    selector: 'customersmanager',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class CustomersComponent implements OnInit, OnDestroy {
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    private customers: Customer[];
    displayedColumns = ['num-auto', 'oid', 'name', 'surname', 'email', 'actions'];
    dataSource: MatTableDataSource<Customer>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true })
    sort: MatSort;
    @ViewChild('fileInput', { static: true }) inputFile: ElementRef;
    isExcelFile: boolean;

    @ViewChild('filter', { static: true })
    filter: ElementRef;
    

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _customersmanagerService: CustomersService,
        private excelService: ExcelService,
        private _matSnackBar: MatSnackBar,
        private _authService: AuthService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, italian);
    }


    ngOnInit(): void {
        this._customersmanagerService.getCustomers().subscribe((customers: Customer[]) => {
            this.customers = customers;
            this.dataSource = new MatTableDataSource(this.customers);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator
        }, error => console.error(error));
        //setTimeout(() => this.dataSource.paginator = this.paginator)
    }

    public doFilter = (value: string) => {
        /*this.dataSource.filterPredicate = (data, filter) =>{
            console.log(JSON.stringify(data))
            return JSON.stringify(data).toLocaleLowerCase().indexOf(filter) != -1;
        } 
        this.dataSource.filter = value.trim().toLocaleLowerCase();*/
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



    public exportExcel() {
        let customersExcel = JSON.parse(JSON.stringify(this.customers));
        customersExcel.forEach( customer => {
            delete customer.oid;
            delete customer.oid_user;
            delete customer.oid_user_cust;
        })
        this.excelService.exportAsExcelFile(customersExcel, 'clienti');
    }


    onChange(evt) {
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
                        let cust:Customer = element;
                        cust.oid_user = oid_user;
                        this._customersmanagerService.addCustomer(cust);
                    });
                    resolve(data);
                }).then(()=> {
                    this._matSnackBar.open('Import Clienti completato!', 'OK', {
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

    ngOnDestroy(): void {

    }


}
