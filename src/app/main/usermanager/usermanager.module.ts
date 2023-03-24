import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { UsersComponent } from './users/users.component'
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
import { UserComponent } from './user/user.component';
import { UsersService } from './users/users.service';
import { UserService } from './user/user.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const routes = [
    {
        path: 'usermanager',
        component: UsersComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'usermanager/:id',
        component: UserComponent,
        canActivate: [AuthGuard],
        resolve  : {
            data: UserService
        }
    },
];

@NgModule({
    declarations: [
        UsersComponent,
        UserComponent
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
        UsersComponent,
        UserComponent,
        MatSortModule
    ],
    providers   : [
        UsersService, 
        UserService
    ]
})

export class UsermanagerModule
{
}
