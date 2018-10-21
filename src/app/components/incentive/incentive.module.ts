// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { IncentiveComponent } from './incentive.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SimpleDockModule } from '../common/simple-dock/simple-dock.module';
import { MaterialModule } from '../../shared/modules/material.module';
import { DynamicTableModule } from '../common/dynamic-table/dynamic-table.module';
import { IncentiveRoutingModule } from './incentive-routing.module';
import { BasepaypageComponent } from './basepaypage/basepaypage.component';

/*  */
// This Module's Components
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_CONFIG, AppConfig } from '../../config/app.config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProgressInterceptor } from '../../shared/interceptors/progress.interceptor';
import { ProgressBarService } from '../../core/progress-bar.service';
import { TimingInterceptor } from '../../shared/interceptors/timing.interceptor';
//import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app.translate.factory';
import { HttpClient } from 'selenium-webdriver/http';

//import { PortalComponent } from './portal.component';
//import { PortalRoutingModule } from './portal-routing.module';

//import { IncentiveComponent } from './incentive.component';
//import { IncentiveRoutingModule } from './incentive-routing.module';
//import { BasePayCreateEditComponent } from './base-pay-create-edit/base-pay-create-edit.component';
import { RouterModule } from '@angular/router';
//import { BasepaypageComponent } from './basepaypage/basepaypage.component';
//import { SimpleDockModule } from '../common/simple-dock/simple-dock.module';
//import { MaterialModule } from '../../shared/modules/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ExaminerSiteRateComponent } from './examiner-site-rate/examiner-site-rate.component';
import { DemographicPayRateCreateEditComponent } from './demographic-pay-rate-create-edit/demographic-pay-rate-create-edit.component';
import { IncentiveService } from './incentive.service';
import { SiteRateListComponent } from './site-rate-list/site-rate-list.component';
//import { DynamicTableModule } from '../common/dynamic-table/dynamic-table.module';
import { SitePaymentAllocationListComponent } from './site-payment-allocation-list/site-payment-allocation-list.component';
import { AddEditSitePaymentAllocationComponent } from './add-edit-site-payment-allocation/add-edit-site-payment-allocation.component';
import { DialogComponent } from './dialog/dialog.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { LoaderModule } from '../loader/loader.module';
import { DialogModule } from '../dialog/dialog.module';
/*  */

@NgModule({
    imports: [
        IncentiveRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SimpleDockModule,
        MaterialModule,
        DynamicTableModule,
        FlexLayoutModule,
        AngularMultiSelectModule,
        LoaderModule,
        DialogModule
    ],
    declarations: [
        IncentiveComponent,
        BasepaypageComponent,
        ExaminerSiteRateComponent,
        DemographicPayRateCreateEditComponent,
        SiteRateListComponent,
        SitePaymentAllocationListComponent,
        AddEditSitePaymentAllocationComponent,
        DialogComponent
    ],
    entryComponents: [DialogComponent],
    exports: [
        IncentiveComponent,
        BasepaypageComponent
    ],
    providers: [IncentiveService]
})
export class IncentiveModule {

}
