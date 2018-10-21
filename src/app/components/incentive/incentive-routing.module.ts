import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../../services/authGuard.service';
import { IncentiveComponent } from './incentive.component';
import { BasepaypageComponent } from './basepaypage/basepaypage.component';
//import { AddEditSitePaymentAllocationComponent } from './add-edit-site-payment-allocation/add-edit-site-payment-allocation.component';
//import { SiteRateListComponent } from './site-rate-list/site-rate-list.component';
import { ExaminerSiteRateComponent } from './examiner-site-rate/examiner-site-rate.component';
import { DemographicPayRateCreateEditComponent } from './demographic-pay-rate-create-edit/demographic-pay-rate-create-edit.component';
import { SiteRateListComponent } from './site-rate-list/site-rate-list.component';
import { SitePaymentAllocationListComponent } from './site-payment-allocation-list/site-payment-allocation-list.component';
import { AddEditSitePaymentAllocationComponent } from './add-edit-site-payment-allocation/add-edit-site-payment-allocation.component';
/*  */

//import { Routes, RouterModule } from '@angular/router';
//import { NgModule } from '@angular/core';
//import { AuthGuard } from '../../services/authGuard.service';
//import { PortalComponent } from './portal.component';
//import { ReqComponent } from './req/req.component';
//import { IncentiveComponent } from './incentive.component';
//import { BasepayComponent } from './basepay/basepay.component';
//import { BasePayCreateEditComponent } from './base-pay-create-edit/base-pay-create-edit.component';
import { MaterialModule } from '../../shared/modules/material.module';
import { MatFormFieldModule } from '@angular/material';
//import { ExaminerSiteRateComponent } from './examiner-site-rate/examiner-site-rate.component';
//import { DemographicPayRateCreateEditComponent } from './demographic-pay-rate-create-edit/demographic-pay-rate-create-edit.component';
//import { SiteRateListComponent } from './site-rate-list/site-rate-list.component';
//import { SitePaymentAllocationListComponent } from './site-payment-allocation-list/site-payment-allocation-list.component';
//import { AddEditSitePaymentAllocationComponent } from './add-edit-site-payment-allocation/add-edit-site-payment-allocation.component';

/*  */
const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'basepay',
                component: BasepaypageComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'siteRateList',
                component: SiteRateListComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'createExaminerSiteRate',
                component: ExaminerSiteRateComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'sitePaymenAllocationList',
                component: SitePaymentAllocationListComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'createEditSitePaymentAllocation',
                component: AddEditSitePaymentAllocationComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'createDemographicPayRate',
                component: DemographicPayRateCreateEditComponent,
                canActivate: [AuthGuard]
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class IncentiveRoutingModule {

}
export const routingComponents = [
    IncentiveComponent
    /*  PortalComponent */
    /*  ,ReqComponent */
];
