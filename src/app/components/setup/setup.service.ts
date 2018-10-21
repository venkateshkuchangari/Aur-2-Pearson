import { Injectable } from '@angular/core';
import { ApiCallComponent } from '../../services/apicall.component';
import { ApiEndpoints } from '../../services/apiendpoints';

@Injectable()
export class SetupService {

  constructor(public _api: ApiCallComponent) { }
  //ConsentForm API
  getConsentTypeList() {
    return this._api.get(ApiEndpoints.getConsentTypeList(), '');
  }
  getConsenTypeEmailTemplate(consentType) {
    return this._api.get(ApiEndpoints.getConsenTypeEmailTemplate(consentType), '');
  }
  addConsentTypeTemplate(postData) {
    return this._api.post(ApiEndpoints.addConsentTypeTemplate(), postData);
  }
  updateConsentTypeTemplate(postData) {
    return this._api.put(ApiEndpoints.updateConsentTypeTemplate(), postData);
  }
  deleteConsentTemplate(formTypeEmailTemplateId) {
    return this._api.delete(ApiEndpoints.deleteConsentTemplate(formTypeEmailTemplateId), '');
  }
  //MessageTemplate API
  messageTypeList() {
    return this._api.get(ApiEndpoints.messageTypeList(), '');
  }
  saveMessageTemplate(postData) {
    return this._api.post(ApiEndpoints.saveMessageTemplate(), postData);
  }
  fetchMessageTypeTemplate(messagetypeid) {
    return this._api.get(ApiEndpoints.fetchMessageTypeTemplate(messagetypeid), '');
  }
  updateMessageTemplate(postData) {
    return this._api.put(ApiEndpoints.updateMessageTemplate(), postData);
  }
  deleteMessageTemplate(id) {
    return this._api.delete(ApiEndpoints.deleteMessageTemplate(id), '');
  }
  getTestList(countryId) {
    return this._api.get(ApiEndpoints.getTestList(countryId), '');
  }
  updateDigitalTestEmailTemplate(postData) {
    return this._api.put(ApiEndpoints.updateDigitalTestEmailTemplate(), postData);
  }
  saveDigitalTestEmailTemplate(postData) {
    return this._api.post(ApiEndpoints.saveDigitalTestEmailTemplate(), postData);
  }
  deleteDigitalTestEmailTemplate(templateId) {
    return this._api.delete(ApiEndpoints.deleteDigitalTestEmailTemplate(templateId), '');
  }
  fetchDigitalTestEmailTemplate(projectId) {
    return this._api.get(ApiEndpoints.fetchDigitalTestEmailTemplate(projectId), '');
  }
  gridApiForVariables(countryId) {
    return this._api.get(ApiEndpoints.gridApiForVariables(countryId), '');
  }
  deleteVariable(id) {
    return this._api.delete(ApiEndpoints.deleteVariable(id), '');
  }
  saveVariable(postData) {
    return this._api.post(ApiEndpoints.saveVariable(), postData);
  }
  fetchVariableDetails(variableDetails) {
    return this._api.get(ApiEndpoints.fetchVariable(variableDetails), '');
  }
  updateVariable(putData) {
    return this._api.put(ApiEndpoints.updateVariable(), putData);
  }
  getVariableOptionsGrid(dataVariableId) {
    return this._api.get(ApiEndpoints.getOptionsGrid(dataVariableId), '');
  }
  getParentVariableList(countryId) {
    return this._api.get(ApiEndpoints.getParentVariableList(countryId), '');
  }
  updateOptionVariable(data) {
    return this._api.put(ApiEndpoints.updateOptionVariable(), data);
  }
  deleteOptionVariable(id) {
    return this._api.delete(ApiEndpoints.deleteOptionVariable(id), '');
  }
  saveOptionVariable(postData) {
    return this, this._api.post(ApiEndpoints.saveOptionVariable(), postData);
  }
  projectList(countryId) {
    return this._api.get(ApiEndpoints.getProjectList(countryId), '');
  }
  getVariables(countryId) {
    return this._api.get(ApiEndpoints.getVariablesByCountryId(countryId), '');
  }
  getPhaseList(projectId) {
    return this._api.get(ApiEndpoints.getPhaseList(projectId), '');
  }
  getList(phaseId, countryId) {
    return this._api.get(ApiEndpoints.getvariablesByPhaseId(phaseId, countryId), '');
  }
  fetchListVariableMapCaliculations(id) {
    return this._api.get(ApiEndpoints.variableMapCalculationList(id), '');
  }
  mappedOptionDropdown(datacollectionvariableid) {
    return this._api.get(ApiEndpoints.mappedOptiondropdown(datacollectionvariableid), '');
  }
  deleteVariableMap(variableId) {
    return this._api.delete(ApiEndpoints.deleteVariableMap(variableId), '');
  }
  selectTestDropdown(phaseId) {
    return this._api.get(ApiEndpoints.selectTestDropdown(phaseId), '');
  }
  selectTypedropdown() {
    return this._api.get(ApiEndpoints.selectTypedropdown(), '');
  }
  updateTrackingData(postData) {
    return this._api.put(ApiEndpoints.updateTrackingdata(), postData);
  }
  saveTrackingData(postData) {
    return this._api.post(ApiEndpoints.saveTrackingDaa(), postData);
  }
  //
  addMembersToPhaseGrid(phaseId) {
    return this._api.get(ApiEndpoints.addMembersToPhaseGrid(phaseId), '');
  }
  savePhaseStatusManagement(postdata) {
    return this._api.post(ApiEndpoints.savePhaseStatusManagement(), postdata);
  }
  updateMemberPhase(postData) {
    return this._api.put(ApiEndpoints.updateMemberPhase(), postData);
  }
  getPhaseTrackingGrid(phaseId) {
    return this._api.get(ApiEndpoints.getPhaseTrackingGrid(phaseId), '');
  }
  deleteTracking(id) {
    return this._api.delete(ApiEndpoints.deleteTracking(id), '');
  }
  phaseVariableCalculationsave(postData) {
    return this._api.post(ApiEndpoints.phaseVariableCalculationsave(), postData);
  }
  getStatusList() {
    return this._api.get(ApiEndpoints.statusList(), '');
  }
  phaseStatusManagementGrid(phaseId) {
    return this._api.get(ApiEndpoints.phaseStatusManagementGrid(phaseId), '');
  }
  //send Messages
  listType(countryId) {
    return this._api.get(ApiEndpoints.listType(countryId), '');
  }
  messageType(countryId) {
    return this._api.get(ApiEndpoints.messageType(countryId), '');
  }
  fetchUserDetails(username) {
    return this._api.get(ApiEndpoints.fetchUserDetails(username), '');
  }
  sendMessage(postData) {
    return this._api.post(ApiEndpoints.sendMessage(), postData);
  }
  messagesGridSendMessages(countryId, messageListId) {
    return this._api.get(ApiEndpoints.messagesGridSendMessages(countryId, messageListId), '');
  }
  savedatacolvaroptcalc(postData) {
    return this._api.post(ApiEndpoints.savedatacolvaroptcalc(), postData);
  }
}
