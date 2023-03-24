import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Skill } from 'app/models/skill.model';


import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { SkillsService } from './skills.service';

@Component({
    selector: 'skillsmanager',
    templateUrl: './skills.component.html',
    styleUrls: ['./skills.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class SkillsComponent implements OnInit, OnDestroy {
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    private skills: Skill[];
    displayedColumns = ['num-auto', 'oid', 'acronym', 'descr']; 
    dataSource: MatTableDataSource<Skill>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _skillsService: SkillsService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, italian);
    }


    ngOnInit(): void {
        this._skillsService.getSkills().subscribe((skills: Skill[]) => {
            this.skills = skills;
            this.dataSource = new MatTableDataSource(this.skills);
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
