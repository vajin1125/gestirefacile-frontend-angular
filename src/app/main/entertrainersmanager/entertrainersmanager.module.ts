import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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
import { TranslateModule } from '@ngx-translate/core';
import { MatFabMenuModule } from '@angular-material-extensions/fab-menu';
import { DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { AuthGuard } from 'app/security/guards/auth.guard';
import { EntertrainersComponent } from './entertrainers/entertrainers.component';
import { EntertrainerComponent } from './entertrainer/entertrainer.component';
import { ModalformComponent } from './modalform/modalform.component';
// import { CalendarService } from './calendar.service';
import { EntertrainersService } from './entertrainers/entertrainers.service';

const routes = [
  {
      path: 'entertrainersmanager',
      component: EntertrainersComponent,
      canActivate: [AuthGuard]
  },
  // {
  //     path     : 'entertrainersmanager/:id',
  //     component: EntertrainerComponent,
  //     canActivate: [AuthGuard],
  //     // resolve  : {
  //     //     data: EventService
  //     // }
  // },
];

@NgModule({
  declarations: [EntertrainersComponent, EntertrainerComponent, ModalformComponent],
  imports: [
    RouterModule.forChild(routes),
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatTooltipModule,
    ColorPickerModule,
    AngularCalendarModule.forRoot({
      provide   : DateAdapter,
      useFactory: adapterFactory
    }),
    TranslateModule,
    MatFabMenuModule,
    MatListModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
  ],
  exports: [
    EntertrainerComponent,
    EntertrainersComponent
  ],
  providers: [
    DatePipe,
    EntertrainersService
  ],
  entryComponents: [
    ModalformComponent
  ]
})
export class EntertrainersmanagerModule { }
