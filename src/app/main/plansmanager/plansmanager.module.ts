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


import { PlansComponent } from './plans/plans.component';
import { PlanComponent } from './plan/plan.component';
import { PlanService } from './plan/plan.service';
import { PlansService } from './plans/plans.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const routes = [
    {
        path: 'plansmanager',
        component: PlansComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'plansmanager/:id',
        component: PlanComponent,
        canActivate: [AuthGuard],
        resolve  : {
            data: PlanService
        }
    }
];

@NgModule({
    declarations: [
        PlansComponent,
        PlanComponent
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
        MatCheckboxModule,
        MatToolbarModule,
        NgxMatSelectSearchModule
    ],
    exports     : [
        PlansComponent,
        PlanComponent,
        MatSortModule
    ],
    providers   : [
        PlansService, 
        PlanService
    ]
})

export class PlansmanagerModule
{
}
