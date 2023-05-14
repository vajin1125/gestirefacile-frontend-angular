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
import { MatMenuModule } from '@angular/material/menu';

import { ResourcesComponent } from './resources/resources.component';
import { ResourceComponent } from './resource/resource.component';
import { ResourceService } from './resource/resource.service';
import { ResourcesService } from './resources/resources.service';
import { MatAutocompleteModule, MatDatepickerModule, MatDialogModule, MatSlideToggleModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import  {MatCurrencyFormatModule} from 'mat-currency-format';
import { FuseConfirmDialogModule, FuseWidgetModule } from '@fuse/components';
import { MovementFormDialogComponent } from './movement-form/movement-form.component';
import { MatFabMenuModule } from '@angular-material-extensions/fab-menu';
import { ColorPickerModule } from 'ngx-color-picker';
import { ExcelService } from 'app/services/excel.service';
import { ToolTipModule } from 'app/tooltip/tooltip.module';

// QR
import { QRCodeModule } from 'angularx-qrcode';




const routes = [
    {
        path: 'resourcesmanager',
        component: ResourcesComponent,
        canActivate: [AuthGuard]
    },
    {
      path: 'resourcesmanager/trash/all',
      component: ResourcesComponent,
      canActivate: [AuthGuard]
    },
    {
        path     : 'resourcesmanager/:id',
        component: ResourceComponent,
        canActivate: [AuthGuard],
        resolve  : {
            data: ResourceService
        }
    },
];

@NgModule({
    declarations: [
        ResourcesComponent,
        ResourceComponent,
        MovementFormDialogComponent
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
        MatAutocompleteModule,
        MatCurrencyFormatModule,
        FuseWidgetModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatToolbarModule,
        MatTooltipModule,
        MatFabMenuModule,
        ToolTipModule,
        ColorPickerModule,
        MatMenuModule,
        FuseSharedModule,
        FuseConfirmDialogModule,

        // For QR code
        QRCodeModule
        
    ],
    exports     : [
        ResourcesComponent,
        ResourceComponent,
        MatSortModule,
        MatAutocompleteModule
    ],
    providers   : [
        ResourcesService, 
        ResourceService,
        ExcelService
    ],
    entryComponents: [
        MovementFormDialogComponent
    ]
})

export class ResourcesmanagerModule
{
}
