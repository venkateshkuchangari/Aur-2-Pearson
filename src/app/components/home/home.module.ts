// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_CONFIG, AppConfig } from '../../config/app.config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProgressInterceptor } from '../../shared/interceptors/progress.interceptor';
import { ProgressBarService } from '../../core/progress-bar.service';
import { TimingInterceptor } from '../../shared/interceptors/timing.interceptor';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app.translate.factory';
import { HttpClient } from 'selenium-webdriver/http';
import { ApiCallComponent } from '../../services/apicall.component';
import { ApiEndpoints } from '../../services/apiendpoints';
import { UserInfoComponent } from '../../shared/userinfo.component';
import { AuthGuard } from '../../services/authGuard.service';
import { Auth } from '../../services/Auth';
import { StatusComponent } from './status/status.component';
import { MaterialModule } from '../../shared/modules/material.module';
//import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
    imports: [
        HomeRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MaterialModule,
       // AngularFontAwesomeModule
    ],
    declarations: [
        HomeComponent,
        StatusComponent
    ],
    exports: [
        HomeComponent,
    ],
    providers: [
        // {provide: APP_CONFIG, useValue: AppConfig},
        // {provide: HTTP_INTERCEPTORS, useClass: ProgressInterceptor, multi: true, deps: [ProgressBarService]},
        // {provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true}
        // , ApiCallComponent, ApiEndpoints, UserInfoComponent, AuthGuard , Auth
        // , ApiCallComponent, ApiEndpoints, UserInfoComponent, AuthGuard , Auth, ObjectOrderrByPipe, DatePipe
        // , DynamicTableComponent
    ],
})
export class HomeModule {

}
