import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { MyUsersComponent } from './myusers/myusers.component'
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
import { MyUserComponent } from './myuser/myuser.component';
import { MyUsersService } from './myusers/myusers.service';
import { MyUserService } from './myuser/myuser.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const routes = [
    {
        path: 'myusermanager',
        component: MyUsersComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'myusermanager/:id',
        component: MyUserComponent,
        canActivate: [AuthGuard],
        resolve  : {
            data: MyUserService
        }
    },
];

@NgModule({
    declarations: [
        MyUsersComponent,
        MyUserComponent
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
        MatCheckboxModule,
        MatToolbarModule,
        NgxMatSelectSearchModule
    ],
    exports     : [
        MyUsersComponent,
        MyUserComponent,
        MatSortModule
    ],
    providers   : [
        MyUsersService, 
        MyUserService
    ]
})

export class MyUsermanagerModule
{
}
