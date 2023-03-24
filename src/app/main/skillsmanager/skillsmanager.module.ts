import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';


import { AuthGuard } from 'app/security/guards/auth.guard';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { SkillsComponent } from './skills/skills.component';
import { SkillComponent } from './skill/skill.component';
import { SkillService } from './skill/skill.service';
import { SkillsService } from './skills/skills.service';

const routes = [
    {
        path: 'skillsmanager',
        component: SkillsComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'skillsmanager/:id',
        component: SkillComponent,
        canActivate: [AuthGuard],
        resolve  : {
            data: SkillService
        }
    },
];

@NgModule({
    declarations: [
        SkillsComponent,
        SkillComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        TranslateModule,
        FuseSharedModule,
        MatSortModule,
        MatCheckboxModule
    ],
    exports     : [
        SkillsComponent,
        SkillComponent,
        MatSortModule
    ],
    providers   : [
        SkillsService, 
        SkillService
    ]
})

export class SkillsmanagerModule
{
}
