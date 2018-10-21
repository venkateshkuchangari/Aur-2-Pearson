import { AccountService} from '../account.service';
// import { SettingService } from '../settings.service';


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { SetupService } from '../setup.service';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { UserInfoComponent } from '../../../shared/userinfo.component';
import { Dock, DockControl } from '../../common/dock.controls';
import * as buttonconstants from '../../common/app.buttonconstants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  public formGroup: FormGroup;
  public loading: boolean;
  public moduleList: any[];
  public dock: Dock;
  public dockControl: DockControl;
  public fetchData: any;
  public colorList: any[];

  constructor(public _fb: FormBuilder,
    public service: AccountService,
    public userInfo: UserInfoComponent,
    public router: Router) {
    this.loading = false;
    this.dock = new Dock();
    this.setDockControls();
  }

  ngOnInit() {
    this.formGroup = this._fb.group({
      color: ['', Validators.required],
      autoHide: [false, Validators.required],
      pinToolBar: [false, Validators.required],
      iconsOnly: [false, Validators.required],
      homeModule: ['', Validators.required]
    });
    this.loading = true;
    Observable.combineLatest(
      this.service.getModulesList(this.userInfo.getUserName()),
      this.service.fetchUserDetails(this.userInfo.getUserName()),
      this.service.getColorList()
    ).subscribe(data => {
      this.moduleList = data[0].json().Data;
      this.fetchData = data[1].json().frUserPreferenceRequest;
      this.colorList = data[2].json().Data;
      this.formGroup.patchValue({
        color: data[1].json().frUserPreferenceRequest.hexColorId,
        autoHide: data[1].json().frUserPreferenceRequest.autoHideMenu,
        pinToolBar: data[1].json().frUserPreferenceRequest.pinTinBar,
        homeModule: data[1].json().frUserPreferenceRequest.homeModuleId
      });
      this.loading = false;
    });

  }
  savePrefrences() {
    const postData = {
      'userPrefId': this.fetchData.userPrefId,
      'frUserPref': this.fetchData.userId,
      'homeModuleId': this.formGroup.get('homeModule').value,
      'autoHideMenu': this.formGroup.get('autoHide').value,
      'pinTinBar': this.formGroup.get('pinToolBar').value,
      'hexColorId': this.formGroup.get('color').value
    };
    this.loading = true;
    this.service.updateUserpreferences(postData).subscribe(data => {
      this.loading = false;
      this.router.navigate(['home']);
    });
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
        // tslint:disable-next-line:forin
        for (control in this.formGroup.controls) {
          this.formGroup.controls[control].markAsTouched();
        }
        if (this.formGroup.valid) {
          this.savePrefrences();
        }
        break;
      case 'cancel':
        this.router.navigate(['home']);
        break;
      default:
        break;
    }
  }
  selectColor(colorId) {
    this.formGroup.patchValue({
      color: colorId
    });
  }
}
