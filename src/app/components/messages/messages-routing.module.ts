import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../../services/authGuard.service';
import { MessagesComponent } from './messages.component';
import { MessagetemplateComponent } from './messagetemplate/messagetemplate.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'test',
                component: MessagesComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'temp',
                component: MessagetemplateComponent,
                canActivate: [AuthGuard]
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MessagesRoutingModule {
    MessagesComponent;
 }

