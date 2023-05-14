import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Firstnote } from '../../models/firstnote.model';
import { FirstnoteService } from './firstnote.service';
import { locale as english } from './i18n/en';
import { locale as italian } from './i18n/it';

@Component({
  selector: 'app-firstnote',
  templateUrl: './firstnote.component.html',
  styleUrls: ['./firstnote.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class FirstnoteComponent implements OnInit, OnDestroy {

  /**
   * Constructor
   *
   * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
   */

  private firstnote: Firstnote[];
  displayedColumns = ['auto-num', 'income', 'expenses', 'category', 'datetime', 'description'];
  dataSource: MatTableDataSource<Firstnote>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _firstnoteService: FirstnoteService,
    public datepipe: DatePipe
  ) { 
    this._fuseTranslationLoaderService.loadTranslations(english, italian);
  }

  ngOnInit() {
    this._firstnoteService.getFirstnoteList().subscribe((firstnote: Firstnote[]) => {
      this.firstnote = firstnote;
      console.log(firstnote);
      this.dataSource = new MatTableDataSource(this.firstnote);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, error => console.log(error))
  }

  ngOnDestroy(): void {
    
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
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

  public getSequenceNumber(index: number): number {
    return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
  }

  public getDSequenceNumber(index: number): number {
    const totalRows = this.dataSource.data.length;
    return totalRows - (index + (this.paginator.pageIndex * this.paginator.pageSize));
  }

}
