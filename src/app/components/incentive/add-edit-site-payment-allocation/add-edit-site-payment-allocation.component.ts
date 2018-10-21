import { Dock, DockControl, KeyValuePair } from './../../common/dock.controls';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as buttonconstants from '../../common/app.buttonconstants';
import { IncentiveService } from '../incentive.service';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { SimpleDockComponent } from '../../common/simple-dock/simple-dock.component';
import { Router } from '@angular/router';
import { UserInfoComponent } from '../../../shared/userinfo.component';


@Component({
  selector: 'app-add-edit-site-payment-allocation',
  templateUrl: './add-edit-site-payment-allocation.component.html',
  styleUrls: ['./add-edit-site-payment-allocation.component.css']
})
export class AddEditSitePaymentAllocationComponent implements OnInit {
  public sitePaymentAllocationForm: FormGroup;
  public dock: Dock;
  public dockControl: DockControl;
  public payeeTypeList: any;
  public paymentAllocationList: any;
  public loading = false;
  public editData: any;
  public phaseId: string;
  public projectId: string;
  public commentList: any[];
  public pageTitle: string;
  @ViewChild(SimpleDockComponent) simpleDock: SimpleDockComponent;
  constructor(public _fb: FormBuilder, public _incentiveService: IncentiveService, public _router: Router, public userInfo: UserInfoComponent) {
    this.dock = new Dock();
    this.setDockControls();
    this.editData = null;
    this.loading = false;
    this.pageTitle = 'Add';
  }

  ngOnInit() {
    this.sitePaymentAllocationForm = this._fb.group({
      name: ['', Validators.required],
      payeeType: ['', Validators.required],
      paymentAllocation: ['', Validators.required],
      notes: ['', Validators.required]
    });
    this.onChanges();
    this.phaseId = localStorage.getItem('phaseId');
    localStorage.removeItem('phaseId');
    this.projectId = localStorage.getItem('projectId');
    localStorage.removeItem('projectId');
    this.loading = true;
    Observable.combineLatest(
      this._incentiveService.getSitePaymentAllocationPayeeTypeList(),
      this._incentiveService.getSitePaymentAllocationPaymentAllocationList()).subscribe(data => {
        this.payeeTypeList = data[0].json().Data;
        this.paymentAllocationList = data[1].json().Data;
        this.editData = JSON.parse(localStorage.getItem('paymentAllocationEdit'));
        localStorage.removeItem('paymentAllocationEdit');
        this.loading = false;
        if (this.editData != null && this.editData != undefined) {
          this.pageTitle = 'Edit';
          this.loading = true;
          this._incentiveService.fetchSitePaymentAllocationDetails(this.editData.id).subscribe(data => {
            this.editData = data.json().Data[0];
            console.log(this.editData);
            this.sitePaymentAllocationForm.patchValue({
              name: this.editData.name,
              payeeType: this.editData.payeeTypeId,
              paymentAllocation: this.editData.paymentAllocationId
            });
            if (localStorage.getItem('itemCopy')) {
              this.sitePaymentAllocationForm.patchValue({
                name: this.editData.name + '_copy'
              });

            }
            this.loading = false;
          });
          this._incentiveService.getCommentsForSPARate(this.editData.id).subscribe(data => {
            console.log(data);
            if (data.json().ack == 'success') {
              this.commentList = data.json();
            }
          });
        }
      });
  }
  onChanges() {
  }
  setDockControls() {
    this.dock.dockControls = [];
    this.dock.backgroundcolor = '#343a40';
    this.addButtonToList(buttonconstants.Save, true);
    this.addButtonToList(buttonconstants.Cancel, true);
  }

  addButtonToList(buttonType: any, enable: boolean) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'button';
    this.dockControl.label = buttonType;
    this.dockControl.enable = enable;
    this.dock.dockControls.push(this.dockControl);
  }

  handleDocEvent(event: any) {
    const eventType = event.eventInfo.toLowerCase();
    switch (eventType) {
      case 'save':
        let control: any;
        for (control in this.sitePaymentAllocationForm.controls) {
          this.sitePaymentAllocationForm.controls[control].markAsTouched();
        }
        if (this.sitePaymentAllocationForm.valid) {
          if ((this.editData == null || this.editData == undefined) || localStorage.getItem('itemCopy')) {
            localStorage.removeItem('itemCopy');
            const postData = {
              siteId: '11',
              payeeTypeId: this.sitePaymentAllocationForm.get('payeeType').value,
              paymentAllocationId: this.sitePaymentAllocationForm.get('paymentAllocation').value,
              phaseId: this.phaseId,
              name: this.sitePaymentAllocationForm.get('name').value,
              notes: this.sitePaymentAllocationForm.get('notes').value,
              userName: this.userInfo.getUserName()
            };
            this.loading = true;
            this._incentiveService.saveSitePaymentAllocation(postData).subscribe(data => {
              this.loading = false;
              localStorage.setItem('phaseIdAfterCreate', this.phaseId);
              localStorage.setItem('projectId', this.projectId);
              this._router.navigate(['/home/incentive/sitePaymenAllocationList']);
            });
          } else {
            console.log(this.editData);
            const postData = {
              paymentSiteAllocId: this.editData.paymentSiteAllocId,
              siteId: this.editData.siteId,
              payeeTypeId: this.sitePaymentAllocationForm.get('payeeType').value,
              paymentAllocationId: this.sitePaymentAllocationForm.get('paymentAllocation').value,
              phaseId: this.editData.phaseId,
              name: this.sitePaymentAllocationForm.get('name').value,
              notes: this.sitePaymentAllocationForm.get('notes').value,
              userName: this.userInfo.getUserName()

            };
            this.loading = true;
            this._incentiveService.updatePaymentAllocation(postData).subscribe(data => {
              this.loading = false;
              localStorage.setItem('phaseIdAfterCreate', this.editData.phaseId);
              localStorage.setItem('projectId', this.projectId);
              this._router.navigate(['/home/incentive/sitePaymenAllocationList']);
            });
          }
        }

        break;
      case 'cancel':
        localStorage.setItem('projectId', this.projectId);
        if (this.editData == null || this.editData == undefined) {
          localStorage.setItem('phaseIdAfterCreate', this.phaseId);
        } else {
          localStorage.setItem('phaseIdAfterCreate', this.editData.phaseId);
        }
        this._router.navigate(['home/incentive/sitePaymenAllocationList']);
        break;
      default:
        break;
    }
  }

}
