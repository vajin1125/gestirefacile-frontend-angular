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

import { EventTypesComponent } from './eventtypes/eventtypes.component';
import { EventTypeComponent } from './eventtype/eventtype.component';
import { EventTypeService } from './eventtype/eventtype.service';
import { EventTypesService } from './eventtypes/eventtypes.service';


const routes = [
    {
        path: 'eventtypesmanager',
        component: EventTypesComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'eventtypesmanager/:id',
        component: EventTypeComponent,
        canActivate: [AuthGuard],
        resolve  : {
            data: EventTypeService
        }
    },
];

@NgModule({
    declarations: [
        EventTypesComponent,
        EventTypeComponent
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
        EventTypesComponent,
        EventTypeComponent,
        MatSortModule
    ],
    providers   : [
        EventTypesService, 
        EventTypeService
    ]
})

export class EventtypesmanagerModule
{
}
