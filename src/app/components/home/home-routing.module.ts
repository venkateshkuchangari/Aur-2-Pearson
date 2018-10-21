import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { AuthGuard } from '../../services/authGuard.service';
import { StatusComponent } from './status/status.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'status',
                component: StatusComponent,
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
export class HomeRoutingModule { }
