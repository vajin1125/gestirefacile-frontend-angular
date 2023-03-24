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


import { PackagesComponent } from './packages/packages.component';
import { PackageComponent } from './package/package.component';
import { PackageService } from './package/package.service';
import { PackagesService } from './packages/packages.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatAutocompleteModule, MatListModule, MatMenuModule, MatTooltipModule } from '@angular/material';
import { MatCurrencyFormatModule } from 'mat-currency-format';

import { ToolTipModule } from 'app/tooltip/tooltip.module';

import { QRCodeModule } from 'angularx-qrcode';


const routes = [
    {
        path: 'packagesmanager',
        component: PackagesComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'packagesmanager/:id',
        component: PackageComponent,
        canActivate: [AuthGuard],
        resolve  : {
            data: PackageService
        }
    }
];

@NgModule({
    declarations: [
        PackagesComponent,
        PackageComponent
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
        NgxMatSelectSearchModule,
        NgxMatSelectSearchModule,
        MatAutocompleteModule,
        MatCurrencyFormatModule,
        MatMenuModule,
        MatListModule,
        MatTooltipModule,
        ToolTipModule,
        QRCodeModule
    ],
    exports     : [
        PackagesComponent,
        PackageComponent,
        MatSortModule
    ],
    providers   : [
        PackagesService, 
        PackageService
    ]
})

export class PackagesmanagerModule
{
}
