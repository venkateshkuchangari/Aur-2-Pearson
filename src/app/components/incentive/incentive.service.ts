import { ApiEndpoints } from './../../services/apiendpoints';
import { Injectable } from '@angular/core';
import { ApiCallComponent } from '../../services/apicall.component';

@Injectable()
export class IncentiveService {

  constructor(private apiCall: ApiCallComponent) { }
  getTestList() {
    return this.apiCall.get(ApiEndpoints.incentiveTestListSitePayRate, '');
  }
  getIncentiveTypeList() {
    return this.apiCall.get(ApiEndpoints.incentiveTypeListSitePayRate, '');
  }
  getPayeeTypeList() {
    return this.apiCall.get(ApiEndpoints.incentivePayeeTypeSitePayRate, '');
  }
  getStatusTypeList() {
    return this.apiCall.get(ApiEndpoints.incentiveStatusListSitePayRate, '');
  }
  getExaminerList() {
    return this.apiCall.get(ApiEndpoints.incentiveExaminerListSitePayRate, '');
  }
  savePayRate(jsonData) {
    return this.apiCall.post(ApiEndpoints.incentiveSitePayRateSave, jsonData);
  }
  getSiteRateList(phaseId) {
    return this.apiCall.get(ApiEndpoints.incentiveSitePayRateList(phaseId), '');
  }
  getSitePaymentAllocationList(phaseId: string) {
    return this.apiCall.get(ApiEndpoints.incentiveSitePaymentAllocationList(phaseId), '');
  }
  getSitePaymentAllocationPayeeTypeList() {
    return this.apiCall.get(ApiEndpoints.incentiveSitePaymentAllocationPayeeTypeList, '');
  }
  getSitePaymentAllocationPaymentAllocationList() {
    return this.apiCall.get(ApiEndpoints.incentiveSitePaymentAllocationPaymentAllocationList, '');
  }
  deleteSitePaymentAllocation(id: string) {
    return this.apiCall.delete(ApiEndpoints.incentiveSitePaymentAllocationDelete(id), '');
  }
  fetchSitePaymentAllocationDetails(id: string) {
    return this.apiCall.get(ApiEndpoints.incentiveFetchSitePaymentAllocationDetails(id), '');
  }
  saveSitePaymentAllocation(postData) {
    return this.apiCall.post(ApiEndpoints.saveSitePaymentAllocation(), postData);
  }
  updatePaymentAllocation(postData) {
    return this.apiCall.put(ApiEndpoints.updateSitePaymentAllocation(), postData);
  }
  getProjectList(countryId) {
    return this.apiCall.get(ApiEndpoints.getProjectList(countryId), '');
  }
  getPhaseList(projectId) {
    return this.apiCall.get(ApiEndpoints.getPhaseList(projectId), '');
  }
  deleteExaminerSiteRate(phaseId) {
    return this.apiCall.delete(ApiEndpoints.deleteExaminerSiteRate(phaseId), '');
  }
  fetchExaminerSiteRate(examinerSiterateId) {
   return this.apiCall.get(ApiEndpoints.fetchexaminerSiteRate(examinerSiterateId), '');
  }
  updateExaminerSitePayRate(postData) {
    return this.apiCall.put(ApiEndpoints.updateExaminerSitePayrate(), postData);
  }
  getCommentListForExaminerSiteRate(payrateexaminersiteid) {
    return this.apiCall.get(ApiEndpoints.examinerSiteNotes(payrateexaminersiteid), '');
  }
  getCommentsForSPARate(id) {
    return this.apiCall.get(ApiEndpoints.fetchCmmentsForSPArate(id), '');
  }
}
