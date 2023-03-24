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
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { EventsComponent } from './events/events.component';
import { EventComponent } from './event/event.component';
import { EventService } from './event/event.service';
import { EventsService } from './events/events.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatAutocompleteModule, MatListModule, MatMenuModule, MatToolbarModule } from '@angular/material';
import { MatCurrencyFormatModule } from 'mat-currency-format';
import { MatFabMenuModule } from '@angular-material-extensions/fab-menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { FuseWidgetModule } from '@fuse/components';
import { ToolTipModule } from 'app/tooltip/tooltip.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

const routes = [
    {
        path: 'eventsmanager',
        component: EventsComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'eventsmanager/:id',
        component: EventComponent,
        canActivate: [AuthGuard],
        resolve  : {
            data: EventService
        }
    },
];

@NgModule({
    declarations: [
        EventsComponent,
        EventComponent
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
        NgxMatSelectSearchModule,
        MatAutocompleteModule,
        MatCurrencyFormatModule,
        MatFabMenuModule,
        BrowserAnimationsModule,    
        OverlayModule,
        MatToolbarModule,
        FuseWidgetModule,
        MatMenuModule,
        MatListModule,
        ToolTipModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    exports     : [
        EventsComponent,
        EventComponent,
        MatSortModule
    ],
    providers   : [
        EventsService, 
        EventService,
        MatSelect
    ]
})

export class EventsmanagerModule
{
}
