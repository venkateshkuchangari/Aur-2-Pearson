// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { MessagesComponent } from './messages.component';
import { MessagesRoutingModule } from './messages-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SimpleDockModule } from '../common/simple-dock/simple-dock.module';
import { MaterialModule } from '../../shared/modules/material.module';
import { FlexModule } from '@angular/flex-layout';
import { DynamicTableModule } from '../common/dynamic-table/dynamic-table.module';
//import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { LoaderModule } from '../loader/loader.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/multiselect.component';
import { MessagetemplateComponent } from './messagetemplate/messagetemplate.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { CKEditorSettings } from '../common/app.buttonconstants';

@NgModule({
    imports: [
        MessagesRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SimpleDockModule,
        MaterialModule,
        FlexModule,
        DynamicTableModule,
        //FroalaEditorModule.forRoot(),
        //FroalaViewModule.forRoot(),
        LoaderModule,
        AngularMultiSelectModule,
        CKEditorModule
    ],
    declarations: [
        MessagesComponent,
        MessagetemplateComponent
    ],
    exports: [
        MessagesComponent,
        MessagetemplateComponent
    ]
})
export class MessagesModule {

}
