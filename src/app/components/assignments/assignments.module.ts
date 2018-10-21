// Angular Imports
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// This Module's Components
import { AssignmentsComponent } from './assignments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AssignmentsRoutingModule } from './assignments-routing.module';
import { CandidateComponent } from './candidate/candidate.component';
import { SimpleDockModule } from '../common/simple-dock/simple-dock.module';
import { MaterialModule } from '../../shared/modules/material.module';
import { DynamicTableModule } from '../common/dynamic-table/dynamic-table.module';
import { DynamicFormModule } from '../common/dynamic-form/dynamic-form.module';

@NgModule({
    imports: [
        AssignmentsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SimpleDockModule,
        MaterialModule,
        DynamicTableModule,
        DynamicFormModule
    ],
    declarations: [
        AssignmentsComponent,
        CandidateComponent
    ],
    exports: [
        AssignmentsComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AssignmentsModule {

}
