import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../../services/authGuard.service';
import { SetupComponent } from './setup.component';
import { TestComponent } from './test/test.component';
import { ListComponent } from './list/list.component';
import { ConsentformComponent } from './consentform/consentform.component';
import { PhaseComponent } from './phase/phase.component';
import { StudyComponent } from './study/study.component';
import { ProjectComponent } from './project/project.component';
import { PhasetestComponent } from './phasetest/phasetest.component';
import { ConsentFormEmailTemplateComponent } from './consent-form-email-template/consent-form-email-template.component';
import { MessageTemplateComponent } from './message-template/message-template.component';
import { StudytestComponent } from './studytest/studytest.component';
import { DigitalTestEmailTemplateComponent } from './digital-test-email-template/digital-test-email-template.component';
import { VariableListComponent } from './variable-list/variable-list.component';
import { AddEditVariablesComponent } from './add-edit-variables/add-edit-variables.component';
import { AddEditVariableOptionsComponent } from './add-edit-variable-options/add-edit-variable-options.component';
import { VariableMapCalculationsComponent } from './variable-map-calculations/variable-map-calculations.component';
import { AddEditPhaseVariableCalculationsComponent } from './add-edit-phase-variable-calculations/add-edit-phase-variable-calculations.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { PhaseStatusManagementComponent } from './phase-status-management/phase-status-management.component';
import { AddEditTrackingComponent } from './add-edit-tracking/add-edit-tracking.component';
import { AddMemberToPhaseComponent } from './add-member-to-phase/add-member-to-phase.component';
import { PhaseTrackingComponent } from './phase-tracking/phase-tracking.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'test',
                component: TestComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'list',
                component: ListComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'consentform',
                component: ConsentformComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'phase',
                component: PhaseComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'phase/:id',
                component: PhaseComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'study',
                component: StudyComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'project',
                component: ProjectComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'phasetest/:id',
                component: PhasetestComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'studytest/:id',
                component: StudytestComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'consentFormEmailTemplate',
                component: ConsentFormEmailTemplateComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'messageTemplate',
                component: MessageTemplateComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'digitalTestEmailTemplate',
                component: DigitalTestEmailTemplateComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'variablelist',
                component: VariableListComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'addEditVariables',
                component: AddEditVariablesComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'addeditVariableOptions/:id/:variablename',
                component: AddEditVariableOptionsComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'variableMapCalculations/:id',
                component: VariableMapCalculationsComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'phaseVariableCalculationList',
                component: AddEditPhaseVariableCalculationsComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'sendMessage',
                component: SendMessageComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'phaseStausManagement',
                component: PhaseStatusManagementComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'addMemberToPhase',
                component: AddMemberToPhaseComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'phaseTracking',
                component: PhaseTrackingComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'addEditTracking/:phaseId/:optype',
                component: AddEditTrackingComponent,
                canActivate: [AuthGuard]
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SetupRoutingModule {
    TestpageComponent;
 }

