import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../../services/authGuard.service';
import { AssignmentsComponent } from './assignments.component';
import { CandidateComponent } from './candidate/candidate.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'candidate',
                component: CandidateComponent,
                canActivate: [AuthGuard]
            },
            // {
            //     path: 'create',
            //     component: NewSurveyComponent,
            //     canActivate: [AuthGuard]
            // },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssignmentsRoutingModule { }


export const routingComponents = [
    AssignmentsComponent,
];
