import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { EventType } from 'app/models/eventType.model';
import { ToDo } from 'app/models/todo.model';


import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { ToDoListService } from './todolist.service';

@Component({
    selector: 'todolistmanager',
    templateUrl: './todolist.component.html',
    styleUrls: ['./todolist.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ToDoListComponent implements OnInit, OnDestroy {
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    private todolist: ToDo[];
    displayedColumns = ['auto-num', 'oid', 'title', 'descr', 'datetime', 'completed']; 
    dataSource: MatTableDataSource<ToDo>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _toDoListService: ToDoListService,
        public datepipe: DatePipe
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, italian);
    }


    ngOnInit(): void {
        this._toDoListService.getToDoList().subscribe((todolist: ToDo[]) => {
            this.todolist = todolist;
            this.dataSource = new MatTableDataSource(this.todolist);
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
        


}
