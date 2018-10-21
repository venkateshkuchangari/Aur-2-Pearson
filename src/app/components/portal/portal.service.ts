import { Injectable } from '@angular/core';
import { ApiCallComponent } from '../../services/apicall.component';
import { ApiEndpoints } from '../../services/apiendpoints';

@Injectable()
export class PortalService {

    constructor(public _api: ApiCallComponent) { }

    //For template - Need to remove
    messageTypeList() {
        return this._api.get(ApiEndpoints.messageTypeList(), '');
    }

    getProjectList() {
        return this._api.get(ApiEndpoints.getProjectList, '');
    }
}
