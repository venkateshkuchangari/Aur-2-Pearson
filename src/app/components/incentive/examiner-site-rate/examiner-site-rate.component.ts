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
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-examiner-site-rate',
  templateUrl: './examiner-site-rate.component.html',
  styleUrls: ['./examiner-site-rate.component.css']
})
export class ExaminerSiteRateComponent implements OnInit {
  public examinerSitePayrate: FormGroup;
  public dock: Dock;
  public dockControl: DockControl;
  public testList: any;
  public incentiveType: any;
  public payeeTypeList: any;
  public statusList: any;
  public examinerList: any;
  public loading = false;
  public phaseId: string;
  public projectId: string;
  public editData = null;
  public pageTitle: string;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  public commentList: any[];
  @ViewChild(SimpleDockComponent) simpleDock: SimpleDockComponent;

  constructor(public _fb: FormBuilder, public _incentiveService: IncentiveService, public _router: Router, public userInfo: UserInfoComponent) {
    this.dock = new Dock();
    this.dockControl = new DockControl();
    this.setDockControls();
    this.loading = false;
    this.pageTitle = 'Add';
  }

  ngOnInit() {
    this.phaseId = localStorage.getItem('phaseId');
    localStorage.removeItem('phaseId');
    this.projectId = localStorage.getItem('projectId');
    localStorage.removeItem('projectId');
    this.examinerSitePayrate = this._fb.group({
      name: ['', Validators.required],
      test: ['', Validators.required],
      incentiveType: ['', Validators.required],
      payeeType: ['', Validators.required],
      status: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      amount: ['', Validators.required],
      active: [false, Validators.required],
      notes: ['', Validators.required],
      examiner: [[], Validators.required]
    });
    this.onChanges();
    this.loading = true;
    Observable.combineLatest(
      this._incentiveService.getTestList(),
      this._incentiveService.getIncentiveTypeList(),
      this._incentiveService.getPayeeTypeList(),
      this._incentiveService.getStatusTypeList(),
      this._incentiveService.getExaminerList()
    ).subscribe(data => {
      this.testList = data[0].json().Data;
      this.incentiveType = data[1].json().Data;
      this.payeeTypeList = data[2].json().Data;
      this.statusList = data[3].json().Data;
      this.examinerList = data[4].json().Data;
      let kvpair: KeyValuePair;
      let i: number;
      const tempControls: any[] = [];
      this.dropdownList = this.examinerList;
      this.dropdownSettings = {
        singleSelection: true,
        text: 'Select Examiner',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        lazyLoading: true,
        primaryKey: 'lkp_lookup_value_id',
        labelKey: 'value_description',
        maxHeight: 100
      };
      // for (i = 0; i < this.examinerList.length; i++) {
      //   kvpair = new KeyValuePair();
      //   kvpair.ID = this.examinerList[i].lkp_lookup_value_id;
      //   kvpair.Description = this.examinerList[i].value_description;
      //   tempControls.push(kvpair);
      // }
      //this.simpleDock.dock.dockControls[2].controlOptions = tempControls;
      this.loading = false;
      this.editData = JSON.parse(localStorage.getItem('examinerSiteRateEdit'));
      if (this.editData != null && this.editData != undefined) {
        this.pageTitle = 'Edit';
        this.loading = true;
        this._incentiveService.fetchExaminerSiteRate(this.editData.id).subscribe(data => {
          this.editData = data.json().Data[0];
          this.examinerSitePayrate.patchValue({
            name: this.editData.name,
            test: this.editData.testId,
            incentiveType: this.editData.incentiveTypeId,
            payeeType: this.editData.payeeTypeId,
            status: this.editData.statusId,
            effectiveDate: new Date(this.editData.effectiveDate),
            amount: this.editData.amount,
            active: this.parseBoolean(this.editData.active)
          });
          if (localStorage.getItem('itemCopy')) {
            this.examinerSitePayrate.patchValue({
              name: this.editData.name + '_copy'
            });
            localStorage.removeItem('itemCopy');
          }
          console.log(this.editData);
          this.loading = false;
          this._incentiveService.getCommentListForExaminerSiteRate(this.editData.payRateExaminerSiteId).subscribe(data => {
            if (data.json().ack == 'success') {
             // this.commentList=data.json().Data;
             this.commentList = data.json();
            }
          });
        });
      }
    });
  }
  onChanges() {
    this.examinerSitePayrate.valueChanges.subscribe(value => {

    });
  }
  setDockControls() {
    this.dock.dockControls = [];
    this.dock.backgroundcolor = '#343a40';
    this.addButtonToList(buttonconstants.Save, true);
    this.addButtonToList(buttonconstants.Cancel, true);
    //this.addSelectToList(true);
  }

  addButtonToList(buttonType: any, enable: boolean) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'button';
    this.dockControl.label = buttonType;
    this.dockControl.enable = enable;
    this.dock.dockControls.push(this.dockControl);
  }
  addSelectToList(enable: boolean) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'select';
    this.dockControl.label = '';
    this.dockControl.enable = enable;
    this.dockControl.key = 'Examiner @Site';
    this.dock.dockControls.push(this.dockControl);
  }
  handleDocEvent(event: any) {
    const eventType = event.eventInfo.toLowerCase();
    switch (eventType) {
      case 'save':
        let control: any;
        for (control in this.examinerSitePayrate.controls) {
          this.examinerSitePayrate.controls[control].markAsTouched();
        }
        if (this.examinerSitePayrate.valid) {
          if (this.editData == null || this.editData == undefined) {

            const postBody = {
              payRateTemplateId: '3',
              phaseId: this.phaseId,
              name: this.examinerSitePayrate.get('name').value,
              memberAssocId: this.examinerSitePayrate.get('examiner').value[0].lkp_lookup_value_id,
              testId: this.examinerSitePayrate.get('test').value,
              statusId: this.examinerSitePayrate.get('status').value,
              active: this.examinerSitePayrate.get('active').value,
              incentiveTypeId: this.examinerSitePayrate.get('incentiveType').value,
              payeeTypeId: this.examinerSitePayrate.get('payeeType').value,
              effectiveDate: this.formatDate(this.examinerSitePayrate.get('effectiveDate').value),
              testEventIdCount: '',
              useAllPhaseTestEventId: '',
              iterateCount: '',
              amount: parseFloat(this.examinerSitePayrate.get('amount').value).toFixed(2),
              isSpecialPayRate: '',
              requestedByUserId: '',
              requestedDate: '',
              lastUpdatedUserId: '',
              lastUpdatedDateTime: '',
              notes: this.examinerSitePayrate.get('notes').value,
              userName: this.userInfo.getUserName()
            };
            this.loading = true;
            this._incentiveService.savePayRate(postBody).subscribe(res => {
              this.loading = false;
              localStorage.setItem('phaseIdAfterCreate', this.phaseId);
              localStorage.setItem('projectId', this.projectId);
              this._router.navigate(['home/incentive/siteRateList']);
            });
          } else {
            const postBody = {
              payRateExaminerSiteId: this.editData.payRateExaminerSiteId,
              payRateTemplateId: this.editData.payRateTemplateId,
              phaseId: this.editData.phaseId,
              name: this.examinerSitePayrate.get('name').value,
              memberAssocId: this.examinerSitePayrate.get('examiner').value[0].lkp_lookup_value_id,
              testId: this.examinerSitePayrate.get('test').value,
              statusId: this.examinerSitePayrate.get('status').value,
              active: this.examinerSitePayrate.get('active').value,
              incentiveTypeId: this.examinerSitePayrate.get('incentiveType').value,
              payeeTypeId: this.examinerSitePayrate.get('payeeType').value,
              effectiveDate: this.formatDate(this.examinerSitePayrate.get('effectiveDate').value),
              testEventIdCount: '',
              useAllPhaseTestEventId: '',
              iterateCount: '',
              amount: parseFloat(this.examinerSitePayrate.get('amount').value).toFixed(2),
              isSpecialPayRate: '',
              requestedByUserId: '',
              requestedDate: '',
              lastUpdatedUserId: '',
              lastUpdatedDateTime: '',
              notes: this.examinerSitePayrate.get('notes').value,
              userName: this.userInfo.getUserName()
            };
            this.loading = true;
            this._incentiveService.updateExaminerSitePayRate(postBody).subscribe(data => {
              this.loading = false;
              localStorage.setItem('phaseIdAfterCreate', this.editData.phaseId);
              localStorage.setItem('projectId', this.projectId);
              this._router.navigate(['/home/incentive/siteRateList']);
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
        this._router.navigate(['home/incentive/siteRateList']);
        break;
      default:
        break;
    }
  }
  formatDate(date: string) {
    const tmp = new Date(date);
    return (tmp.getMonth() + 1) + '/' + tmp.getDate() + '/' + tmp.getFullYear();
  }
  onItemSelect(item: any) {
  }
  OnItemDeSelect(item: any) {
  }
  onSelectAll(items: any) {
  }
  onDeSelectAll(items: any) {
  }
  parseBoolean(data) {
    if (data == null || data == undefined || data == '') {
      return false;
    } else if (data == 'true') {
      return true;
         } else if (data == 'false') {
      return false;
         }
  }
}
