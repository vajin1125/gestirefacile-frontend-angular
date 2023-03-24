import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColorPickerModule } from 'ngx-color-picker';
import { CalendarModule as AngularCalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';


import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from 'app/security/guards/auth.guard';
import { CalendarService } from './calendar.service';
import { CalendarEventFormDialogComponent } from './event-form/event-form.component';
import { MatFabMenuModule } from '@angular-material-extensions/fab-menu';
import { DatePipe } from '@angular/common';
import { FileManagerMainSidebarComponent } from './sidebars/main/main.component';
import { MatListModule } from '@angular/material';

const routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children : [],
        resolve  : {
            chat: CalendarService
        }
    }
];

@NgModule({
    declarations: [
        DashboardComponent,
        CalendarEventFormDialogComponent,
        FileManagerMainSidebarComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        MatButtonModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatToolbarModule,
        MatTooltipModule,
        MatFabMenuModule,
        AngularCalendarModule.forRoot({
            provide   : DateAdapter,
            useFactory: adapterFactory
        }),
        ColorPickerModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatListModule
    ],
    exports     : [
        DashboardComponent
    ],
    providers      : [
        CalendarService,
        DatePipe
    ],
    entryComponents: [
        CalendarEventFormDialogComponent
    ]
})

export class DashboardModule
{
}
