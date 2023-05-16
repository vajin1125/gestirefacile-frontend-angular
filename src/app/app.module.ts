import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { DashboardModule } from 'app/main/dashboard/dashboard.module';
import { LoginModule } from 'app/main/login/login.module';
import { LoginComponent } from './main/login/login.component';
import { AuthService } from './security/services/auth.service';
import { httpInterceptorProviders } from './security/interceptors';
import { AuthGuard } from './security/guards/auth.guard';
import { UsermanagerModule } from './main/usermanager/usermanager.module';
import {  registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { RolemanagerModule } from './main/rolemanager/rolemanager.module';
import { BusinessesmanagerModule } from './main/businessmanager/businessmanager.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { MessagesmanagerModule } from './main/messagemanager/messagemanager.module';
import { AccessesModule } from './main/accesses/accesses.module';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from 'app/fake-db/fake-db.service';
import { CategoriesmanagerModule } from './main/categoriesmanager/categoriesmanager.module';
import { SkillsmanagerModule } from './main/skillsmanager/skillsmanager.module';
import { ResourcesmanagerModule } from './main/resourcesmanager/resourcesmanager.module';
import { ForgotPasswordComponent } from './main/forgot-password/forgot-password.component';
import { ForgotPasswordModule } from './main/forgot-password/forgot-password.module';
import { ResetPasswordComponent } from './main/reset-password/reset-password.component';
import { ResetPasswordModule } from './main/reset-password/reset-password.module';
import { ProfileModule } from './main/myprofile/profile.module';
import { EventtypesmanagerModule } from './main/eventtypesmanager/eventtypesmanager.module';
import { CustomersmanagerModule } from './main/customersmanager/customersmanager.module';
import { VendorsmanagerModule } from './main/vendorsmanager/vendorsmanager.module';
import { CirclesmanagerModule } from './main/circlesmanager/circlesmanager.module';
//import {NgcCookieConsentModule, NgcCookieConsentConfig} from 'ngx-cookieconsent';
import { Config } from './app.config';
import { MyBusinessesmanagerModule } from './main/mybusiness/mybusinessmanager.module';
import { MyUsermanagerModule } from './main/myusers/myusermanager.module';
import { MyAccessesModule } from './main/myaccesses/myaccesses.module';
import { WarehousesmanagerModule } from './main/warehousemanager/warehousemanager.module';

import { EventsmanagerModule } from './main/eventsmanager/eventsmanager.module';
import { PlansmanagerModule } from './main/plansmanager/plansmanager.module';
import { PackagesmanagerModule } from './main/packagemanager/packagemanager.module';
import { TodolistmanagerModule } from './main/todomanager/todomanager.module';
import { FirstnoteModule } from './main/firstnote/firstnote.module';
import { EntertrainersmanagerModule } from './main/entertrainersmanager/entertrainersmanager.module';



/*const cookieConfig:NgcCookieConsentConfig = {
  cookie: {
    domain: Config.prop.domain// it is recommended to set your domain, for cookies to work properly
  },
  palette: {
    popup: {
      background: '#000'
    },
    button: {
      background: '#f1d600'
    }
  },
  theme: 'edgeless',
  type: 'opt-out',
  layout: 'my-custom-layout',
  layouts: {
    "my-custom-layout": '{{messagelink}}{{compliance}}'
  },
  elements:{
    messagelink: Config.prop.messageLink,
  },
  content:{
    message: Config.prop.cookieMessage,

    cookiePolicyLink: Config.prop.cookiePolicyLink,
    cookiePolicyHref: Config.prop.cookiePolicyHref,

    privacyPolicyLink:  Config.prop.privacyPolicyLink,
    privacyPolicyHref: Config.prop.privacyPolicyHref,

    tosLink: Config.prop.tosLink,
    tosHref: Config.prop.tosHref,
  }
};*/

registerLocaleData(localeIt);

const appRoutes: Routes = [
    
    
    {
        path      : '**',
        redirectTo: 'home'
    },
    {
        path     : 'auth/login',
        component: LoginComponent
    },
    {
        path     : 'auth/forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path     : 'auth/reset-password',
        component: ResetPasswordComponent
    },
    {
        path     : 'home',
        loadChildren: './main/home/home.module#AnalyticsDashboardModule'
    },
    {
        path        : 'dashboard',
        loadChildren: './main/dashboard/dashboard.module#DashboardModule'
    },
    {
        path        : 'usermanager',
        loadChildren: './main/usermanager/usermanager.module#UsermanagerModule'
    },
    {
        path        : 'rolemanager',
        loadChildren: './main/rolemanager/rolemanager.module#RolemanagerModule'
    },
    {
        path        : 'businessesmanager',
        loadChildren: './main/businessmanager/businessmanager.module#BusinessesmanagerModule'
    },
    {
        path        : 'messagemanager',
        loadChildren: './main/messagemanager/messagemanager.module#MessagesmanagerModule'
    },
    {
        path        : 'accesses',
        loadChildren: './main/accesses/accesses.module#AccessesModule'
    },
    {
        path        : 'categoriesmanager',
        loadChildren: './main/categoriesmanager/categoriesmanager.module#CategoriesmanagerModule'
    },
    {
        path        : 'skillsmanager',
        loadChildren: './main/skillsmanager/skillsmanager.module#SkillsmanagerModule'
    },
    {
        path        : 'resourcesmanager',
        loadChildren: './main/resourcesmanager/resourcesmanager.module#ResourcesmanagerModule'
    },
    {
        path        : 'myprofile',
        loadChildren: './main/myprofile/profile.module#ProfileModule'
    },
    {
        path        : 'eventtypesmanager',
        loadChildren: './main/eventtypesmanager/eventtypesmanager.module#EventtypesmanagerModule'
    },
    {
        path        : 'customersmanager',
        loadChildren: './main/customersmanager/customersmanager.module#CustomersmanagerModule'
    },
    {
        path        : 'vendorsmanager',
        loadChildren: './main/vendorsmanager/vendorsmanager.module#VendorsmanagerModule'
    },
    {
        path        : 'circlesmanager',
        loadChildren: './main/circlesmanager/circlesmanager.module#CirclesmanagerModule'
    },
    {
        path        : 'mybusiness',
        loadChildren: './main/mybusiness/mybusinessmanager.module#MyBusinessesmanagerModule'
    },
    {
        path        : 'myusermanager',
        loadChildren: './main/myusers/myusermanager.module#MyUsermanagerModule'
    },
    {
        path        : 'warehousemanager',
        loadChildren: './main/warehousemanager/warehousemanager.module#WarehousesmanagerModule'
    },
    {
        path     : 'eventsmanager',
        loadChildren: './main/eventsmanager/eventsmanager.module#EventsmanagerModule'
    },
    {
        path     : 'plansmanger',
        loadChildren: './main/plansmanager/plansmanager.module#PlansmanagerModule'
    },
    {
        path     : 'packagesmanager',
        loadChildren: './main/packagemanager/packagemanager.module#PackagesmanagerModule'
    },
    {
        path     : 'todolistmanager',
        loadChildren: './main/todomanager/todomanager.module#TodolistmanagerModule'
    },
    {
      path     : 'firstnote',
      loadChildren: './main/firstnote/firstnote.module#FirstnoteModule'
    },
    {
      path     : 'entertrainersmanager',
      loadChildren: './main/entertrainersmanager/entertrainersmanager.module#EntertrainersmanagerModule'
    }
    
];

export class BaluHammerConfig extends HammerGestureConfig {
    overrides = {
        pan: {
            direction: 6
        },
        pinch: {
            enable: false
        },
        rotate: {
            enable: false
        }
    };
  }

  export class CustomHammerConfig extends HammerGestureConfig  {
    overrides = <any>{
        'pinch': { enable: false },
        'rotate': { enable: false }
    }
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        

        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay             : 0,
            passThruUnknownUrl: true
        }),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        DashboardModule,
        UsermanagerModule,
        RolemanagerModule,
        BusinessesmanagerModule,
        MessagesmanagerModule,
        AccessesModule,
        LoginModule,
        ForgotPasswordModule,
        ResetPasswordModule,
        ProfileModule,
        CategoriesmanagerModule,
        SkillsmanagerModule,
        ResourcesmanagerModule,
        EventtypesmanagerModule,
        CustomersmanagerModule,
        VendorsmanagerModule,
        CirclesmanagerModule,
        MyBusinessesmanagerModule,
        MyUsermanagerModule,
        MyAccessesModule,
        WarehousesmanagerModule,
        EventsmanagerModule,
        PlansmanagerModule,
        PackagesmanagerModule,
        TodolistmanagerModule,
        ServiceWorkerModule.register('combined-sw.js', { enabled: environment.production }),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireMessagingModule,
        //NgcCookieConsentModule.forRoot(cookieConfig),
        FirstnoteModule,
        EntertrainersmanagerModule
    ],
    providers: [AuthService, httpInterceptorProviders, AuthGuard,{provide: LOCALE_ID, useValue: 'it'},
    {
        provide: HAMMER_GESTURE_CONFIG,
        useClass: CustomHammerConfig
    }],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
