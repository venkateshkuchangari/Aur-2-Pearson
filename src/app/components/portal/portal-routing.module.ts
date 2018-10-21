import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../../services/authGuard.service';
import { PortalComponent } from './portal.component';
//import { RequirementsComponent } from './requirements/requirements.component'
import { ReqComponent } from './req/req.component';
import { TestreqComponent } from './testreq/testreq.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'req',
                component: ReqComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'testreq',
                component: TestreqComponent,
                canActivate: [AuthGuard]
            },
           /*  {
                path: 'requirements',
                component: RequirementsComponent,
                canActivate: [AuthGuard]
            }, */
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

export class PortalRoutingModule { }

export const routingComponents = [
    PortalComponent
   /*  ,ReqComponent */
];
