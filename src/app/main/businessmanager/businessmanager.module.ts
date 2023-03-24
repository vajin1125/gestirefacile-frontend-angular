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


import { BusinessesComponent } from './businesses/businesses.component';
import { BusinessComponent } from './business/business.component';
import { BusinessesService } from './businesses/businesses.service';
import { BusinessService } from './business/business.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const routes = [
    {
        path: 'businessesmanager',
        component: BusinessesComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'businessesmanager/:id',
        component: BusinessComponent,
        canActivate: [AuthGuard],
        resolve  : {
            data: BusinessService
        }
    }
];

@NgModule({
    declarations: [
        BusinessesComponent,
        BusinessComponent
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
        BusinessesComponent,
        BusinessComponent,
        MatSortModule
    ],
    providers   : [
        BusinessesService, 
        BusinessService
    ]
})

export class BusinessesmanagerModule
{
}
