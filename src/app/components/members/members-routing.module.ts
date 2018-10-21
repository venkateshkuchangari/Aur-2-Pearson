import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../../services/authGuard.service';
import { MembersComponent } from './members.component';
import { MemberspageComponent } from './memberspage/memberspage.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'memberspage',
                component: MemberspageComponent,
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
export class MemebersRoutingModule { }


export const routingComponents = [
    MembersComponent,
    MemberspageComponent
];
