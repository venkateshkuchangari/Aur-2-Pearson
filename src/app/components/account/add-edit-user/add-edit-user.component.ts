import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import * as buttonconstants from '../../common/app.buttonconstants';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
// import { SetupService } from '../setup.service';
// import { SettingService } from '../settings.service';
import { AccountService} from '../account.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css']
})
export class AddEditUserComponent implements OnInit {
  public formGroup: FormGroup;
  public roleList: any[];
  public selectedCountries: any[];
  public dropDownSettings: any;
  public loading: boolean;
  public countryList: any[];
  public editUserData: any;
  public pageTitle: string;
  public genPasswordClicked: boolean;
  constructor(public _fb: FormBuilder, public service: AccountService, public route: Router, public _snackbar: MatSnackBar) {
    this.dropDownSettings = {
      singleSelection: false,
      text: 'Select Roles',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      lazyLoading: true,
      primaryKey: 'lkp_lookup_value_id',
      labelKey: 'value_description',
      maxHeight: 200
    };
    this.roleList = [];
    this.countryList = [];
    this.selectedCountries = [];
    this.loading = false;
    this.pageTitle = 'Create';
    this.genPasswordClicked = false;
  }

  ngOnInit() {
    this.formGroup = this._fb.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), containsUppercaseLetter, containsNumber, containSpecialCharacter, containsLowerCaseLetter]],
      roles: [[], Validators.required],
      country: ['', Validators.required],
      email: ['', [emailValidator , Validators.required]],
      isPearsonemployee: [false, Validators.required]
    });
    this.loading = true;
    this.editUserData = JSON.parse(localStorage.getItem('editUser'));
    localStorage.removeItem('editUser');
    Observable.combineLatest(this.service.getCountryList(),
      this.service.getRolesList()).subscribe(data => {
        this.countryList = data[0].json();
        this.roleList = data[1].json();
        this.loading = false;
        if (this.editUserData != null && this.editUserData !== undefined) {
          this.pageTitle = 'Edit';
          this.loading = true;
          this.service.fetchUserDetails(this.editUserData.userName).subscribe(data => {
            this.editUserData = data.json();
            console.log(this.editUserData);
            this.formGroup.addControl('memberId', new FormControl('', Validators.required));
            this.formGroup.addControl('isLocked', new FormControl(false, Validators.required));
            this.formGroup.patchValue({
              userName: this.editUserData.userName,
              password: this.editUserData.pwd,
              country: this.editUserData.countryId,
              isPearsonemployee: this.nullToFalse(this.editUserData.isInternal),
              roles: this.formatRolesId(this.editUserData.frUserRoleRequest),
              email: this.editUserData.email,
              memberId: this.editUserData.frUserMemberRequest.userMemberId,
              isLocked: this.nullToFalse(this.editUserData.locked)
            });
            this.loading = false;
          });
        }
      });
  }
  cancel() {
    this.route.navigate(['home/account/userList']);
  }
  saveUser() {
    let postBody = {};
    console.log(this.formGroup.value);
    if (this.editUserData == null) {
      postBody = {
        'userName': this.formGroup.get('userName').value,
        'pwd': this.formGroup.get('password').value,
        'passwordSalt': '',
        'countryId': this.formGroup.get('country').value,
        'lastLoginDate': '',
        'loginExpires': null,
        'numOfAttemptsAllowed': 0,
        'locked': '',
        'pwdResetRequired': null,
        'dateCreated': null,
        'isInternal': this.formGroup.get('isPearsonemployee').value,
        'email': this.formGroup.get('email').value,
        'lastPasswordChangeDate': null,
        'frUserRoleRequest': this.formatRolesList(this.formGroup.get('roles').value)
      };
      this.loading = true;
      this.service.addUser(postBody).subscribe(data => {
        this.loading = false;
        this.route.navigate(['home/account/userList']);
      }, error => {
        this.loading = false;
      });
    } else {
      postBody = {
        'userId': this.editUserData.userId,
        'userName': this.formGroup.get('userName').value,
        'pwd': this.formGroup.get('password').value,
        'passwordSalt': '',
        'countryId': this.formGroup.get('country').value,
        'lastLoginDate': '',
        'loginExpires': '',
        'numOfAttemptsAllowed': 0,
        'locked': this.formGroup.get('isLocked').value,
        'pwdResetRequired': true,
        'dateCreated': '',
        'isInternal': this.formGroup.get('isPearsonemployee').value,
        'email': this.formGroup.get('email').value,
        'lastPasswordChangeDate': '',
        'frUserRoleRequest': this.formatRolesListForUpdate(this.formGroup.get('roles').value),
        'frUserMemberRequest': {
          'memberId': this.editUserData.frUserMemberRequest.memberId,
          'userId': this.editUserData.frUserMemberRequest.userId
        }

      };
      this.loading = true;
      this.service.updateUser(postBody).subscribe(data => {
        this.loading = false;
        console.log(data);
        this.route.navigate(['home/account/userList']);
      });
    }

  }
  formatRolesList(rolesArray: any[]) {

    let tmpObj = {};
    let i = 0;
    const array = [];
    for (i = 0; i < rolesArray.length; i++) {
      tmpObj = {
        roleId: rolesArray[i]
      };
      array.push(tmpObj);
    }
    return array;
  }
  formatRolesId(rolesArray: any[]) {
    let i = 0;
    const array = [];
    for (i = 0; i < rolesArray.length; i++) {
      array.push(parseInt(rolesArray[i].roleId));
    }
    return array;
  }
  nullToFalse(data) {
    if (data == null || data === undefined) {
      return false;
    } else {
      return data;
    }
  }
  formatRolesListForUpdate(rolesArray: any[]) {
    console.log(rolesArray);
    let i = 0;
    let tempObj = {};
    const array = [];
    for (i = 0; i < rolesArray.length; i++) {
      tempObj = {
        roleId: parseInt(rolesArray[i]),
        userRoleId: parseInt(rolesArray[i]),
        isActive: true,
        userId: this.editUserData.userId
      };
      array.push(tempObj);
    }
    return array;
  }
  prettyJson(data) {
    console.log(data);
  }
  generatePassword() {
    this.genPasswordClicked=true;
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 8; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    if (!/[a-z]/.test(text)) {
      text += 'a';
    }
    if (!/[A-Z]/.test(text)) {
      text += 'A';
    }
    if (!/\d/.test(text)) {
      text += '1';
    }
    if (!/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(text)) {
      text += '!';
    }
    this.formGroup.patchValue({
      password: text
    });
  }
}
export function containsLowerCaseLetter(control: AbstractControl) {
  if (!/[a-z]/.test(control.value)) {
    return { containsLowerCase: true };
  }
  return null;
}
export function containsUppercaseLetter(control: AbstractControl) {
  if (!/[A-Z]/.test(control.value)) {
    return { containsUpperCase: true };
  }
  return null;
}
export function containsNumber(control: AbstractControl) {
  if (!/\d/.test(control.value)) {
    return { containsNumber: true };
  }
  return null;
}
export function containSpecialCharacter(control: AbstractControl) {
  if (!/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(control.value)) {
    return { containSpecialCharacter: true };
  }
  return null;
}
export function emailValidator(control: AbstractControl) {
  if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(control.value))
    return { emailError: true }
  return null;
}
