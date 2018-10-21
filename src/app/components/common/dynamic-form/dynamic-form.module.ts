// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { DynamicFormComponent } from './dynamic-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/material.module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MaterialModule
    ],
    declarations: [
        DynamicFormComponent,
    ],
    exports: [
        DynamicFormComponent,
    ]
})
export class DynamicFormModule {

}
