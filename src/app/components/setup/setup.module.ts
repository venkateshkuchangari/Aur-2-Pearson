// Angular Imports
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// This Module's Components
import { SetupComponent } from './setup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SetupRoutingModule } from './setup-routing.module';
import { SimpleDockModule } from '../common/simple-dock/simple-dock.module';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '../../shared/modules/material.module';
import { DynamicTableModule } from '../common/dynamic-table/dynamic-table.module';
import { TestComponent } from './test/test.component';
import { ListComponent } from './list/list.component';
import { ConsentformComponent } from './consentform/consentform.component';
import { StudyComponent } from './study/study.component';
import { PhaseComponent } from './phase/phase.component';
import { ProjectComponent } from './project/project.component';
import { PhasetestComponent } from './phasetest/phasetest.component';
import { ConsentFormEmailTemplateComponent } from './consent-form-email-template/consent-form-email-template.component';
import { MessageTemplateComponent } from './message-template/message-template.component';
import { SetupService } from './setup.service';
//import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
//import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { LoaderModule } from '../loader/loader.module';
import { StudytestComponent } from './studytest/studytest.component';
import { DigitalTestEmailTemplateComponent } from './digital-test-email-template/digital-test-email-template.component';
import { VariableListComponent } from './variable-list/variable-list.component';
import { AddEditVariablesComponent } from './add-edit-variables/add-edit-variables.component';
import { AddEditVariableOptionsComponent } from './add-edit-variable-options/add-edit-variable-options.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/multiselect.component';
import { FlexModule } from '@angular/flex-layout';
import { PhaseTrackingComponent } from './phase-tracking/phase-tracking.component';
import { AddEditTrackingComponent } from './add-edit-tracking/add-edit-tracking.component';
import { AddMemberToPhaseComponent } from './add-member-to-phase/add-member-to-phase.component';
import { PhaseStatusManagementComponent } from './phase-status-management/phase-status-management.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { AddEditPhaseVariableCalculationsComponent } from './add-edit-phase-variable-calculations/add-edit-phase-variable-calculations.component';
import { VariableMapCalculationsComponent } from './variable-map-calculations/variable-map-calculations.component';
//import { CKEditorSettings } from '../common/app.buttonconstants';
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
    imports: [
        SetupRoutingModule,
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
        SetupComponent,
        TestComponent,
        ListComponent,
        ConsentformComponent,
        StudyComponent,
        PhaseComponent,
        ProjectComponent,
        PhasetestComponent,
        StudytestComponent,
        MessageTemplateComponent,
        ConsentFormEmailTemplateComponent,
        DigitalTestEmailTemplateComponent,
        VariableListComponent,
        AddEditVariablesComponent,
        AddEditVariableOptionsComponent,
        VariableMapCalculationsComponent,
        AddEditPhaseVariableCalculationsComponent,
        SendMessageComponent,
        PhaseStatusManagementComponent,
        AddMemberToPhaseComponent,
        AddEditTrackingComponent,
        PhaseTrackingComponent
    ],
    providers: [SetupService],
    exports: [
        SetupComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SetupModule {

}
