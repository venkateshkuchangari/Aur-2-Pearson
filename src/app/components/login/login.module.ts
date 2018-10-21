// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { LoginComponent } from './login.component';
import { ApiCallComponent } from '../../services/apicall.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/modules/material.module';
import { LoginService } from './login.service';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    declarations: [
        LoginComponent,
    ],
    exports: [
        LoginComponent,
    ],
    providers: [LoginService
    ]
})
export class LoginModule {

}
