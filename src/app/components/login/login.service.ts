import { Injectable } from '@angular/core';
import { ApiCallComponent } from '../../services/apicall.component';
import { ApiEndpoints } from '../../services/apiendpoints';

@Injectable()
export class LoginService {

  constructor(public _api: ApiCallComponent) { }
  fetchUserDetails(userName) {
    return this._api.get(ApiEndpoints.fetchUserDetails(userName), '');
  }
  fetchColorList() {
    return this._api.get(ApiEndpoints.getUserPreferencesColorList(), '');
  }
  fetchModuleList(userName) {
    return this._api.get(ApiEndpoints.getModulesList(userName), '');
  }
  roleList() {
    return this._api.get(ApiEndpoints.roleList(),'');
  }
}
