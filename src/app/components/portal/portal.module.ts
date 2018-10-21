// Angular Imports
import { NgModule } from '@angular/core';
// This Module's Components
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_CONFIG, AppConfig } from '../../config/app.config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProgressInterceptor } from '../../shared/interceptors/progress.interceptor';
import { ProgressBarService } from '../../core/progress-bar.service';
import { TimingInterceptor } from '../../shared/interceptors/timing.interceptor';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app.translate.factory';
import { HttpClient } from 'selenium-webdriver/http';
import { PortalComponent } from './portal.component';
import { PortalRoutingModule } from './portal-routing.module';
import { SimpleDockModule } from '../common/simple-dock/simple-dock.module';
import { MaterialModule } from '../../shared/modules/material.module';
import { DynamicTableModule } from '../common/dynamic-table/dynamic-table.module';
import { DynamicFormModule } from '../common/dynamic-form/dynamic-form.module';
import { ReqComponent } from './req/req.component';
/*  */
//import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { CKEditorModule } from 'ng2-ckeditor';
import { SetupService } from '.././setup/setup.service';
import { PortalService } from '.././portal/portal.service';
import { SharedModule } from '../../shared/modules/shared.module';
import { TestreqComponent } from './testreq/testreq.component';

/*  */
@NgModule({
    imports: [
        PortalRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SimpleDockModule,
        MaterialModule,
        DynamicTableModule,
        DynamicFormModule,
        CKEditorModule
        /*  */
        //FroalaEditorModule.forRoot(),
        //FroalaViewModule.forRoot()
        /*  */
    ],
    declarations: [
        PortalComponent,
        ReqComponent,
        TestreqComponent
    ],
    exports: [
        PortalComponent,
    ],
    providers: [
        /*  */
        //SetupService
        PortalService
        /*  */
    ],
})

export class PortalModule {

}
