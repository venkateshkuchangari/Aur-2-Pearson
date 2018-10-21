import { Injectable } from '@angular/core';
import { ApiCallComponent } from '../../services/apicall.component';
import { ApiEndpoints } from '../../services/apiendpoints';

@Injectable()
export class AccountService {

  constructor(public _apiCall: ApiCallComponent) { }

  fetchUserList() {
    return this._apiCall.get(ApiEndpoints.fetchUserList(), '');
  }
  deleteUser(userId) {
    return this._apiCall.delete(ApiEndpoints.deleteUser(), '');
  }
  getCountryList() {
    return this._apiCall.get(ApiEndpoints.countryList(), '');
  }
  getRolesList() {
    return this._apiCall.get(ApiEndpoints.roleList(), '');
  }
  addUser(postData) {
    return this._apiCall.post(ApiEndpoints.addUser(), postData);
  }
  fetchUserDetails(username) {
    return this._apiCall.get(ApiEndpoints.fetchUserDetails(username), '');
  }
  updateUser(postData) {
    return this._apiCall.post(ApiEndpoints.updateUserUrl(), postData);
  }
  getModulesList(userName) {
    return this._apiCall.get(ApiEndpoints.getModulesList(userName), '');
  }
  updateUserpreferences(postData) {
    return this._apiCall.post(ApiEndpoints.updateUserPreferences(), postData);
  }
  getColorList() {
    return this._apiCall.get(ApiEndpoints.getUserPreferencesColorList(), '');
  }

}
