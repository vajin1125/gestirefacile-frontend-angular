import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Message } from 'app/models/message.model';


import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { MessagesService } from './messages.service';

@Component({
    selector: 'messagesmanager',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class MessagesComponent implements OnInit, OnDestroy {
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    private messages: Message[];
    displayedColumns = ['oid', 'title', 'text', 'user_sent', 'business', 'role', 'creation_ts', 'sent_ts']; 
    dataSource: MatTableDataSource<Message>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;
    

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _messagesmanagerService: MessagesService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, italian);
    }


    ngOnInit(): void {
        this._messagesmanagerService.getMessages().subscribe((messages: Message[]) => {
            this.messages = messages;
            this.dataSource = new MatTableDataSource(this.messages);
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
