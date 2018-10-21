import { environment } from '../../environments/environment';

export class ApiEndpoints {

    public static get api_basicurl(): string {
        // console.log("window.location.pathname="+window.location.pathname);
        return 'http://localhost:8080/';
        //  return '/';
        // return environment.apiURL;
    }
    public static get api_endpoint(): string {
        return this.api_basicurl + 'aurora2/';
    }
    public static get endpointwithapi(): string {
        //  return this.api_basicurl+'api/';
        return this.api_endpoint + 'api/';
    }
    public static get getAuthorization(): string {
        return 'Basic ' + btoa('clientapp' + ':' + '123456');
    }
    public static get login(): string {
        return this.api_endpoint + 'oauth/token?grant_type=password&';
        //return this.api_basicurl + 'oauth/token?grant_type=password&';
    }
    public static get getRoles(): string {
        return this.endpointwithapi + 'getroles';
    }
    public static get getCountries(): string {
        return this.endpointwithapi + 'getcountries';
    }
    public static get getLoginUserInfo(): string {
        return this.endpointwithapi + 'getuser/';
    }
    public static get createUser(): string {
        return this.endpointwithapi + 'createuser';
    }
    public static get updateUser(): string {
        return this.endpointwithapi + 'updateuser';
    }
    public static get getuserslist(): string {
        return this.endpointwithapi + 'getuserslist';
    }
    public static get getdloList(): string {
        return this.endpointwithapi + 'dlo/getlist/';
    }
    public static get getdetails(): string {
        return this.endpointwithapi + 'dlo/getdetails/';
    }
    public static get getRecord(): string {
        return this.endpointwithapi + 'dlo/getdetails/67/';
    }
    public static get gettemplatedetails(): string {
        return this.endpointwithapi + 'dlo/getuitemplatedetails/';
    }
    public static get getfruigenericdetails(): string {
        return this.endpointwithapi + 'dlo/getfruigenericdetails/';
    }
    public static get addfruigenericdetails(): string {
        return this.endpointwithapi + 'dlo/addfruigenericdetails/';
    }
    public static get updatefruigenericdetails(): string {
        return this.endpointwithapi + 'dlo/updatefruigenericdetails/';
    }
    public static get deletefruigenericdetails(): string {
        return this.endpointwithapi + 'dlo/deletefruigenericdetails/';
    }
    public static get getCandidateDetails(): string {
        return this.endpointwithapi + 'registration/getregtemplate/';
    }

    public static get getMemberDetails(): string {
        return this.endpointwithapi + 'registration/getregtemplate/';
    }

    public static get saveCandidateDetails(): string {
        return this.endpointwithapi + 'registration/saveregistrationdata';
    }

    public static get saveMemberDetails(): string {
        return this.endpointwithapi + 'memberreg/savememberregdata';
    }

    public static get updateCandidateDetails(): string {
        return this.endpointwithapi + 'registration/updateregistrationdata';
    }

    public static get updateMemberDetails(): string {
        return this.endpointwithapi + 'memberreg/updatememberregdata';
    }

    public static get deleteCandidateDetails(): string {
        return this.endpointwithapi + 'registration/deleteregistrationdata/fr_candidate/';
    }

    public static get deleteMemberDetails(): string {
        return this.endpointwithapi + 'memberreg/deletememberregdata/fr_member/';
    }

    public static get getcountryid(): string {
        return this.endpointwithapi + 'getcountryidbyusername/';
    }
    public static get getMembersDetails(): string {
        return this.endpointwithapi + 'registration/getregtemplate/';
    }
    public static get saveTest(): string {
        return this.endpointwithapi + 'test/savetest';
    }
    public static get updateTest(): string {
        return this.endpointwithapi + 'test/updatetest';
    }
    public static get deleteTest(): string {
        return this.endpointwithapi + 'test/deletetest/';
    }
    public static get saveList(): string {
        return this.endpointwithapi + 'lookupvalues/savedatacolvaropt';
    }
    public static get updateList(): string {
        return this.endpointwithapi + 'lookupvalues/updatedatacolvaropt';
    }
    public static get deleteList(): string {
        return this.endpointwithapi + 'lookupvalues/deletedatacolvaropt/';
    }
    public static get saveProject(): string {
        return this.endpointwithapi + 'project/saveproject';
    }
    public static get updateProject(): string {
        return this.endpointwithapi + 'project/updateproject';
    }
    public static get deleteProject(): string {
        return this.endpointwithapi + 'project/deleteproject';
    }
    public static get savePhase(): string {
        return this.endpointwithapi + 'phase/savephase';
    }
    public static get updatePhase(): string {
        return this.endpointwithapi + 'phase/updatephase';
    }
    public static get deletePhase(): string {
        return this.endpointwithapi + 'phase/deletephase/';
    }
    public static get saveBasePay(): string {
        return this.endpointwithapi + 'payrate/savepayratebase/';
    }
    public static get updateBasePay(): string {
        return this.endpointwithapi + 'payrate/updatepayratebase/';
    }
    public static get deleteBasePay(): string {
        return this.endpointwithapi + 'payrate/deletepayratebase/';
    }
    public static get getBasePay(): string {
        return this.endpointwithapi + 'dlo/getdetails/';
    }
    public static get saveStudy(): string {
        return this.endpointwithapi + 'study/savestudy';
    }
    public static get incentiveTestListSitePayRate(): string {
        return this.endpointwithapi + 'dlo/getdetails/65/242';
    }
    public static get incentiveTypeListSitePayRate(): string {
        return this.endpointwithapi + 'dlo/getdetails/79/242';
    }
    public static get incentivePayeeTypeSitePayRate(): string {
        return this.endpointwithapi + 'dlo/getdetails/78/0';
    }
    public static get incentiveStatusListSitePayRate(): string {
        return this.endpointwithapi + 'dlo/getdetails/63/1';
    }
    public static get incentiveExaminerListSitePayRate(): string {
        return this.endpointwithapi + 'dlo/getdetails/70/242';
    }
    public static get incentiveSitePayRateSave(): string {
        return this.endpointwithapi + 'payrate/savepayrateexaminersite';
    }
    public static incentiveSitePayRateList(phaseId): string {
        return this.endpointwithapi + 'dlo/getdetails/82/' + phaseId;
    }
    public static incentiveSitePaymentAllocationList(phaseId): string {
        return this.endpointwithapi + 'dlo/getdetails/83/' + phaseId;
    }
    public static get incentiveSitePaymentAllocationPayeeTypeList(): string {
        return this.endpointwithapi + 'dlo/getdetails/78/0';
    }
    public static get incentiveSitePaymentAllocationPaymentAllocationList(): string {
        return this.endpointwithapi + 'dlo/getdetails/80/242';
    }
    public static incentiveSitePaymentAllocationDelete(id: string): string {
        return this.endpointwithapi + 'payrate/deletepaysitealloc/' + id;
    }
    public static incentiveFetchSitePaymentAllocationDetails(id: string) {
        return this.endpointwithapi + 'dlo/getdetails/88/' + id;
    }
    public static saveSitePaymentAllocation() {
        return this.endpointwithapi + 'payrate/savepaysitealloc';
    }
    public static updateSitePaymentAllocation() {
        return this.endpointwithapi + 'payrate/updatepaysitealloc';
    }
    public static getProjectList(countryId: string) {
        return this.endpointwithapi + 'dlo/getdetails/60/' + countryId;
    }
    public static getPhaseList(projectId: string) {
        return this.endpointwithapi + 'dlo/getdetails/57/' + projectId;
    }
    public static deleteExaminerSiteRate(phaseId) {
        return this.endpointwithapi + 'payrate/deletepayrateexaminersite/' + phaseId;
    }
    public static fetchexaminerSiteRate(id) {
        return this.endpointwithapi + 'dlo/getdetails/87/' + id;
    }
    public static updateExaminerSitePayrate() {
        return this.endpointwithapi + 'payrate/updatepayrateexaminersite';
    }
    public static fetchUserList() {
        return this.endpointwithapi + 'getuserslist';
    }
    public static deleteUser() {
        return this.endpointwithapi + '';
    }
    public static roleList() {
        return this.endpointwithapi + 'getroles';
    }
    public static countryList() {
        return this.endpointwithapi + 'getcountries';
    }
    public static addUser() {
        return this.endpointwithapi + 'createuser';
    }
    public static fetchUserDetails(userName) {
        return this.endpointwithapi + 'getuser/' + userName;
    }
    public static updateUserUrl() {
        return this.endpointwithapi + 'updateuser';
    }
    public static fetchCmmentsForSPArate(id) {
        return this.endpointwithapi + 'dlo/getdetails/84/' + id;
    }
    public static getModulesList(userName) {
        return this.endpointwithapi + 'dlo/getdetails/110/' + userName;
    }
    public static updateUserPreferences() {
        return this.endpointwithapi + 'updateuserpreference';
    }
    public static examinerSiteNotes(payrateexaminersiteid) {
        return this.endpointwithapi + 'dlo/getdetails/90/' + payrateexaminersiteid;
    }
    public static get updatePhaseTest(): string {
        return this.endpointwithapi + 'phasetest/updatephasetest';
    }
    public static get savePhaseTest(): string {
        return this.endpointwithapi + 'phasetest/savephasetest';
    }
    public static get deletePhaseTest(): string {
        return this.endpointwithapi + 'phasetest/deletephasetest/';
    }
    public static getConsentTypeList() {
        return this.endpointwithapi + 'dlo/getdetails/111/0';
    }
    public static getConsenTypeEmailTemplate(formtypeid) {
        return this.endpointwithapi + 'dlo/getdetails/105/' + formtypeid;
    }
    public static addConsentTypeTemplate() {
        return this.endpointwithapi + 'templates/savecftemplate';
    }
    public static updateConsentTypeTemplate() {
        return this.endpointwithapi + 'templates/updatecftemplate';
    }
    public static deleteConsentTemplate(formTypeEmailTemplateId) {
        return this.endpointwithapi + 'templates/deletecftemplate/' + formTypeEmailTemplateId;
    }
    public static messageTypeList() {
        return this.endpointwithapi + 'dlo/getdetails/113/0';
    }
    public static saveMessageTemplate() {
        return this.endpointwithapi + 'templates/savemsgtemplate';
    }
    public static fetchMessageTypeTemplate(messagetypeid) {
        return this.endpointwithapi + 'dlo/getdetails/106/' + messagetypeid;
    }
    public static updateMessageTemplate() {
        return this.endpointwithapi + 'templates/updatemsgtemplate';
    }
    public static deleteMessageTemplate(id) {
        return this.endpointwithapi + 'templates/deletemsgtemplate/' + id;
    }
    public static get saveStudyTest(): string {
        return this.endpointwithapi + 'study/savestudytest';
    }
    public static get deleteStudyTest(): string {
        return this.endpointwithapi + 'study/deletestudytest/';
    }
    public static get updateStudy(): string {
        return this.endpointwithapi + 'study/updatestudy';
    }
    public static getTestList(countryId) {
        return this.endpointwithapi + 'dlo/getdetails/65/' + countryId;
    }
    public static updateDigitalTestEmailTemplate() {
        return this.endpointwithapi + 'templates/updatetsttemplate';
    }
    public static saveDigitalTestEmailTemplate() {
        return this.endpointwithapi + 'templates/savetsttemplate';
    }
    public static deleteDigitalTestEmailTemplate(templateId) {
        return this.endpointwithapi + 'templates/deletetsttemplate/' + templateId;
    }
    public static fetchDigitalTestEmailTemplate(testId) {
        return this.endpointwithapi + 'dlo/getdetails/104/' + testId;
    }
    public static getUserPreferencesColorList() {
        return this.endpointwithapi + 'dlo/getdetails/116/0';
    }
    public static gridApiForVariables(countryId) {
        return this.endpointwithapi + 'dlo/getdetails/98/' + countryId;
    }
    public static deleteVariable(datacollectionvariableid) {
        return this.endpointwithapi + 'lookupvalues/deletedatacolvar/' + datacollectionvariableid;
    }
    public static saveVariable() {
        return this.endpointwithapi + 'lookupvalues/savedatacolvar';
    }
    public static fetchVariable(datacollectionvariableid) {
        return this.endpointwithapi + 'dlo/getdetails/99/' + datacollectionvariableid;
    }
    public static updateVariable() {
        return this.endpointwithapi + 'lookupvalues/updatedatacolvar';
    }
    public static getOptionsGrid(datacollectionvariableid) {
        return this.endpointwithapi + 'dlo/getdetails/100/' + datacollectionvariableid;
    }
    public static getParentVariableList(countryId) {
        return this.endpointwithapi + 'dlo/getdetails/68/' + countryId;
    }
    public static updateOptionVariable() {
        return this.endpointwithapi + 'lookupvalues/updatedatacolvaropt';
    }
    public static deleteOptionVariable(datacolvaroptid) {
        return this.endpointwithapi + 'lookupvalues/deletedatacolvaropt/' + datacolvaroptid;
    }
    public static saveOptionVariable() {
        return this.endpointwithapi + 'lookupvalues/savedatacolvaropt';
    }

    public static get savephasetestreq() {
        return this.endpointwithapi + 'phasetestreq/savephasetestreq';
    }

    public static get updatephasetestreq() {
        return this.endpointwithapi + 'phasetestreq/updatephasetestreq';
    }

    public static get savestudyreq() {
        return this.endpointwithapi + 'studyreq/savestudyreq';
    }

    public static get updatestudyreq() {
        return this.endpointwithapi + 'studyreq/updatestudyreq';
    }
    public static getvariablesByPhaseId(phaseId, variableId) {
        return this.endpointwithapi + 'dlo/getdetails/125/' + phaseId + ',' + variableId;
    }

    public static getVariablesByCountryId(countryId) {
        return this.endpointwithapi + 'dlo/getdetails/123/' + countryId;
    }

    public static variableMapCalculationList(datacollectionvariableid) {
        return this.endpointwithapi + 'dlo/getdetails/124/' + datacollectionvariableid;
    }
    public static mappedOptiondropdown(datacollectionvariableid) {
        return this.endpointwithapi + 'dlo/getdetails/102/' + datacollectionvariableid;
    }
    public static deleteVariableMap(dataVariableId) {
        return this.endpointwithapi + 'lookupvalues/deletedatacolvaroptcalc/' + dataVariableId;
    }
    public static selectTestDropdown(phaseId) {
        return this.endpointwithapi + 'dlo/getdetails/115/' + phaseId;
    }
    public static selectTypedropdown() {
        return this.endpointwithapi + 'dlo/getdetails/141/0';
    }
    public static updateTrackingdata() {
        return this.endpointwithapi + 'memberreg/updatememberphasetracking';
    }
    public static saveTrackingDaa() {
        return this.endpointwithapi + 'memberreg/savememberphasetracking';
    }
    public static addMembersToPhaseGrid(phaseId) {
        return this.endpointwithapi + 'dlo/getdetails/148/' + phaseId;
    }
    public static savePhaseStatusManagement() {
        return this.endpointwithapi + 'memberreg/savememberphase';
    }
    public static updateMemberPhase() {
        return this.endpointwithapi + 'memberreg/updatememberphase';
    }
    public static getPhaseTrackingGrid(phaseId) {
        return this.endpointwithapi + 'dlo/getdetails/140/' + phaseId;
    }
    public static deleteTracking(id) {
        return this.endpointwithapi + 'memberreg/deletememberphasetracking/' + id;
    }
    public static phaseVariableCalculationsave() {
        return this.endpointwithapi + 'lookupvalues/savephasedatacolvaroptcalc';
    }
    public static statusList() {
        return this.endpointwithapi + 'dlo/getdetails/64/7';
    }
    public static phaseStatusManagementGrid(phaseId) {
        return this.endpointwithapi + 'dlo/getdetails/139/' + phaseId;
    }
    public static listType(countryId) {
        return this.endpointwithapi + 'dlo/getdetails/131/' + countryId;
    }
    public static messageType(countryid) {
        return this.endpointwithapi + 'dlo/getdetails/132/' + countryid;
    }
    public static sendMessage() {
        return this.endpointwithapi + 'message/sendmessage';
    }
    public static messagesGridSendMessages(countryid, messagelistid) {
        return this.endpointwithapi + 'dlo/getdetails/133/' + countryid + ',' + messagelistid;
    }
    public static get updatemessage() {
        return this.endpointwithapi + 'message/updatemessage';
    }
    public static get savemessage() {
        return this.endpointwithapi + 'message/savemessage';
    }
    public static savedatacolvaroptcalc() {
        return this.endpointwithapi + 'lookupvalues/savedatacolvaroptcalc';
    }
    //#endregion
}
