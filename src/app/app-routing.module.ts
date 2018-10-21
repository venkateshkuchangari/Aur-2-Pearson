// import {NgModule} from '@angular/core';
// import {RouterModule, Routes} from '@angular/router';

// import {HeroTopComponent} from './heroes/hero-top/hero-top.component';
// import {AppConfig} from './config/app.config';
// import {Error404Component} from './core/error404/error-404.component';
// import { LoginComponent } from './components/login/login.component';

// const routes: Routes = [

//   {path: '', redirectTo: 'login', pathMatch: 'full'},
//   { path: 'login', component: LoginComponent },
//   // { path: 'logout', component: LogoutComponent }
//   {path: '', component: HeroTopComponent},
//   {path: AppConfig.routes.heroes, loadChildren: 'app/heroes/heroes.module#HeroesModule'},
//   {path: AppConfig.routes.error404, component: Error404Component},

//   // otherwise redirect to 404
//   {path: '**', redirectTo: '/' + AppConfig.routes.error404}
// ];

// @NgModule({
//   imports: [
//     RouterModule.forRoot(routes)
//   ],
//   exports: [
//     RouterModule
//   ]
// })

// export class AppRoutingModule {
// }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/authGuard.service';
import { HomeComponent } from './components/home/home.component';

// Layouts
// import { CommonLayoutComponent } from './common/common-layout.component';
// import { AuthGuard } from './guards/auth.guard';
// import { AuthenticationComponent } from './authentication/authentication.component';
// import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
// import { LogoutComponent } from './logout/logout.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'status',
        loadChildren: './components/home/home.module#HomeModule', canActivate: [AuthGuard]
      },
      {
        path: 'setup',
        loadChildren: './components/setup/setup.module#SetupModule', canActivate: [AuthGuard]
      },
      {
        path: 'assignments',
        loadChildren: './components/assignments/assignments.module#AssignmentsModule', canActivate: [AuthGuard]
      },
      {
        path: 'members',
        loadChildren: './components/members/members.module#MembersModule', canActivate: [AuthGuard]
      },
      {
        path: 'portal',
        loadChildren: './components/portal/portal.module#PortalModule', canActivate: [AuthGuard]
      },
      {
        path: 'incentive',
        loadChildren: './components/incentive/incentive.module#IncentiveModule', canActivate: [AuthGuard]
      },
      {
        path: 'account',
        loadChildren: './components/account/account.module#AccountModule'
      },
      {
        path: 'messages',
        loadChildren: './components/messages/messages.module#MessagesModule'
      }
      /* {
        path: 'settings',
        loadChildren: './components/settings/settings.module#SettingsModule'
      } */
    ]

    // children: [
    //   {
    //     path: '', redirectTo: 'status', pathMatch: 'full' },
    //     {
    //         path: 'status',
    //         loadChildren: './components/home/home.module#HomeModule', canActivate: [AuthGuard]
    //     },
    //     {
    //         path: 'portal',
    //         loadChildren: './components/portal/portal.module#PortalModule', canActivate: [AuthGuard]
    //     }
    // ]
  },
  //   {
  //     path: 'portal',
  //     component: PortalComponent,
  //     children: [
  //       {
  //         path: '', redirectTo: 'portal', pathMatch: 'full' },
  //         {
  //             path: 'portal',
  //             loadChildren: './components/portal/portal.module#PortalModule', canActivate: [AuthGuard]
  //         },
  //         // {
  //         //     path: 'portal',
  //         //     loadChildren: './components/portal/portal.module#PortalModule', canActivate: [AuthGuard]
  //         // }
  //     ]
  // },
  // { path: 'id_token', component: AuthenticationComponent },
  // { path: 'auth', component: AuthenticationComponent },
  // { path: 'Unauthorized', component: UnauthorizedComponent },
  { path: 'login', component: LoginComponent }
  // { path: 'logout', component: LogoutComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}

