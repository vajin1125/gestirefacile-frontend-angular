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


import { WarehousesComponent } from './warehouses/warehouses.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { WarehousesService } from './warehouses/warehouses.service';
import { WarehouseService } from './warehouse/warehouse.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MovementsComponent } from './movements/movements.component';
import { MovementComponent } from './movement/movement.component';
import { MovementService } from './movement/movement.service';
import { MovementsService } from './movements/movements.service';
import { ToolTipModule } from 'app/tooltip/tooltip.module';


const routes = [
    {
        path: 'warehousemanager',
        component: WarehousesComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'warehousemanager/:id',
        component: WarehouseComponent,
        canActivate: [AuthGuard],
        resolve  : {
            data: WarehouseService
        }
    },
    {
        path: 'movements',
        component: MovementsComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'movements/:id',
        component: MovementComponent,
        canActivate: [AuthGuard],
        resolve  : {
            data: MovementService
        }
    },
];

@NgModule({
    declarations: [
        WarehousesComponent,
        WarehouseComponent,
        MovementsComponent,
        MovementComponent
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
        ToolTipModule
    ],
    exports     : [
        WarehousesComponent,
        WarehouseComponent,
        MovementsComponent,
        MovementComponent,
        MatSortModule
    ],
    providers   : [
        WarehousesService, 
        WarehouseService,
        MovementsService, 
        MovementService
    ]
})

export class WarehousesmanagerModule
{
}
