import {NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {APP_CONFIG, AppConfig} from './config/app.config';

import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from './shared/modules/shared.module';
import {CoreModule} from './core/core.module';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from './app.translate.factory';
// import {HeroTopComponent} from './heroes/hero-top/hero-top.component';
import {ProgressBarService} from './core/progress-bar.service';
import {ProgressInterceptor} from './shared/interceptors/progress.interceptor';
import {TimingInterceptor} from './shared/interceptors/timing.interceptor';
import {SampleModule} from 'angular-example-library';

import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from './shared/modules/material.module';
import { ApiCallComponent } from './services/apicall.component';
import { ApiEndpoints } from './services/apiendpoints';
import { UserInfoComponent } from './shared/userinfo.component';
import { HttpModule } from '@angular/http';
import { AuthGuard } from './services/authGuard.service';
import { Auth } from './services/Auth';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ErrorComponent } from './services/error.component';
import { PageInfoComponent, PageIdComponent } from './components/common/pageid.component';
import { HomeModule } from './components/home/home.module';
import { LoginModule } from './components/login/login.module';
import { AccountModule} from './components/account/account.module';
// import { SettingsModule } from './components/settings/settings.module';
import { TimerComponent } from './shared/timer.component';
// import { SetupModule } from './components/setup/setup.module';

// import { AngularFontAwesomeModule } from 'angular-font-awesome';
// import { IncentiveComponent } from './components/incentive/incentive.component';

// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }
import { RoleGuardService } from './services/role-guard.service';

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    BrowserAnimationsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SharedModule.forRoot(),
    SampleModule.forRoot({
      config: {
        say: 'hello'
      }
    }),
    CoreModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    HttpModule,
    HomeModule,
    LoginModule,
    AccountModule
    // SetupModule

   // AngularFontAwesomeModule
  ],
  declarations: [
    AppComponent,
    // HeroTopComponent,
   // IncentiveComponent,
  ],
  providers: [
    {provide: APP_CONFIG, useValue: AppConfig},
    {provide: HTTP_INTERCEPTORS, useClass: ProgressInterceptor, multi: true, deps: [ProgressBarService]},
    {provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true}
    , ApiCallComponent, ApiEndpoints, UserInfoComponent, AuthGuard , Auth, DatePipe, ErrorComponent
     , PageInfoComponent, PageIdComponent, DecimalPipe, TimerComponent, RoleGuardService
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
]
})

export class AppModule {
}
