(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{Ki2j:function(e,t,n){"use strict";n.r(t);var l=n("3xsP"),o=function(){},d=n("mhOz"),a=n("1FVJ"),i=n("n2nD"),s=n("jbyM"),c=n("ZaAB"),r=n("Eo4b"),u=n("vARd"),p=n("iC9n"),m=n("qB2l"),h=n("XATm"),g=n("eYbH"),b=n("13/Y"),f=n("AQEj"),C=n("NBLY"),v=n("cdEC"),k=n("qc/P"),D=n("PjPJ"),y=(n("f7VI"),n("/4r5")),I=n("N/GL"),E=n("z6DQ"),T=n("5lHt"),L=n("HSo0"),N=function(){function e(e,t,n,l,o,d,a,i,s,c){this.apicall=e,this.router=t,this.auth=n,this.http=l,this.userInfo=o,this.snackBar=d,this.translate=a,this.candidatePageInfo=i,this.pageIdComponent=s,this.errorComponent=c,this.displayedColumns=["userName"],this.isDesc=!1,this.userData=new f.a,this.selectedUser=new f.a,this.users=[],this.animate="right",this.headerColumns=[],this.usersList=[],this.dloList=[],this.showEntryPage=!1,this.id=null,this.dockControl=new C.b,this.dock=new C.a,this.dynamicObject=[],this.isAnyEdited=!1,this.isComponentloaded=!1,this.saveCalled=!1,this.pageSize=100,this.pageIndexList=[],this.pageIndex=1,this.selectedIndex=-1,this.sortColumn="",this.dataFiltered=!1,this.headerSelected=!1,this.searchText="",this.selectedData=[],this.setDockControls()}return e.prototype.ngOnInit=function(){this.countryId=this.userInfo.getCountryId(),this.candidatePageInfo=this.pageIdComponent.candidatepage_id,this.translate.use("en"),this.loadDetails(),this.currentUser=this.userInfo.getUserName()},e.prototype.setDockControlsForSave=function(){this.dock.dockControls=[],this.dock.backgroundcolor="#343a40",this.addButtonToList(E.C,!0),this.addButtonToList(E.m,!0)},e.prototype.setDockControls=function(){this.dock.dockControls=[],this.dock.backgroundcolor="#343a40",this.addButtonToList(E.k,!0),this.addButtonToList(E.q,!1),this.addButtonToList(E.z,!0)},e.prototype.addButtonToList=function(e,t){this.dockControl=new C.b,this.dockControl.type="button",this.dockControl.label=e,this.dockControl.enable=t,this.dock.dockControls.push(this.dockControl)},e.prototype.handleDocEvent=function(e){switch(e.eventInfo.toLowerCase()){case"add/edit":this.getTemplateData();break;case"save":this.saveTemplateData();break;case"delete":confirm(L.a.msg_confirm)&&this.deleteTemplate();break;case"refresh":$("#txtSearch").val(""),this.ngOnInit();break;case"cancel":this.cancelEvent();break;default:alert("not implimented")}},e.prototype.cancelEvent=function(){$("#example tr.selected").removeClass("selected"),$("input:checkbox").prop("checked",!1),this.isComponentloaded&&this.toggleClick(1),this.setDockControls(),this.dynamicObject=[],this.isAnyEdited=!1,this.isComponentloaded=!1,this.id="",this.selectedIndex=-1,this.headerSelected=!1},e.prototype.deleteTemplate=function(){if($("input[name='chkSelect']:checked"),0==this.id.length)this.snackBar.open(L.a.error_selectfordelete,"Error",{duration:2e3});else for(var e=0;e<this.selectedData.length;e++)this.deleteRecordById(this.selectedData[e].ID),e+1==this.selectedData.length&&(this.isComponentloaded=!1,this.selectedData=[],this.id=null,this.cancelEvent(),this.loadDetails())},e.prototype.deleteRecordById=function(e){var t=this;this.apicall.post(T.a.deleteCandidateDetails+e,null).subscribe(function(e){t.loadDetails(),"201"==e.status?t.snackBar.open(L.a.msg_deletesuccess,"Success",{duration:2e3}):t.snackBar.open(e.json().error_description,"Error",{duration:2e3})},function(e){t.snackBar.open(e,"Error",{duration:2e3})})},e.prototype.getTemplateData=function(){var e=this;this.saveCalled=!1,""!=this.id&&null!=this.id||(this.id=0),this.apicall.get(T.a.getCandidateDetails,this.countryId+"/candidate/"+this.id).subscribe(function(t){1!=e.isComponentloaded&&(e.isComponentloaded=!0,e.toggleClick(1)),null!=t.json().error?e.snackBar.open(t.json().error_description,"Error",{duration:2e3}):e.dynamicObject=t.json()},function(t){e.errorComponent.handleError(t)})},e.prototype.saveTemplateData=function(){var e=this;if(!this.isComponentloaded)return!1;var t=T.a.saveCandidateDetails;this.id>0&&(t=T.a.updateCandidateDetails);var n=this.childComponent.getDynamicFarmValue();n&&(this.saveCalled=!0,console.log(n),this.apicall.post(t,n).subscribe(function(t){e.saveCalled=!1,"201"==t.status?(e.snackBar.open(L.a.msg_savesuccess,"Success",{duration:2e3}),e.cancelEvent(),e.loadDetails()):(e.saveCalled=!1,e.snackBar.open(t.json().error_description,"Error",{duration:2e3}))},function(t){e.saveCalled=!1,e.errorComponent.handleError(t)}))},e.prototype.loadDetails=function(){var e=this;new Date,this.details=[],this.headerColumns=[],this.usersList=[],this.apicall.get(T.a.getdetails,this.candidatePageInfo.templatedId+"/0").subscribe(function(t){null!=t.json().error?e.snackBar.open(t.json().error_description,"Error",{duration:2e3}):e.details=t.json()},function(t){e.errorComponent.handleError(t)})},e.prototype.onItemSelect=function(e){console.log("Selected Item:"),console.log(e)},e.prototype.OnItemDeSelect=function(e){console.log("De-Selected Item:"),console.log(e)},e.prototype.getDloList=function(){var e=this;this.apicall.get(T.a.getdloList,"9").subscribe(function(t){null!=t.json().error?e.snackBar.open(t.json().error_description,"Error",{duration:2e3}):e.dloList=t.json()},function(t){e.snackBar.open(t,"Error",{duration:2e3})})},e.prototype.init=function(){},e.prototype.toggleClick=function(e){this.showEntryPage=!0,$("#divTest").toggle(500),$("#divTable").toggle(500),$("#divButtons").toggle(500),1==e&&(this.selectedUser=new f.a,this.selectedId=null,this.pageInfo=new i.FormGroup({id:new i.FormControl(this.selectedId)})),this.isComponentloaded?this.setDockControlsForSave():this.setDockControls()},e.prototype.handleTableEvent=function(e){switch(this.id=0,this.selectedData=e.value,this.selectedData.length>0&&(this.id=this.selectedData[0].ID,this.isComponentloaded=!1),console.log("id="+this.id),e.eventInfo.toLowerCase()){case"headerselected":case"rowselected":this.id>0&&(this.isComponentloaded=!1);break;default:alert("not implimented")}},e.prototype.clearSelectedRow=function(){this.selectedUser=new f.a,this.selectedId=null,this.selectedIndex=-1,this.id=""},e.prototype.getSelectedRowAll=function(){this.headerSelected=$("#chkAllSelect").prop("checked"),this.id="",this.selectedIndex=-1,this.selectedId=null,$("#example").find("input:checkbox").prop("checked",$("#chkAllSelect").prop("checked"))},e.prototype.getSelectedRow=function(e,t){this.headerSelected=!1,$("#example").find("input:checkbox").prop("checked",!1),console.log("selectedRow="+t.ID),this.id!=t.ID?(this.id=t.ID,this.selectedIndex=e,$("input[data_id="+e+"]").prop("checked",!0)):(this.id="",this.selectedIndex=-1,this.selectedId=null,$("input[data_id="+e+"]").prop("checked",!1))},e.prototype.selectUser=function(e){this.selectedId=e.memberId,this.selectedUser=e,this.pageInfo.controls.id.setValue(this.selectedId)},e.prototype.isEditdisabled=function(){var e=!0;return null!=this.selectedId&&(e=!1),e},e}(),w=l["\u0275crt"]({encapsulation:0,styles:[[""]],data:{}});function O(e){return l["\u0275vid"](0,[l["\u0275qud"](402653184,1,{childComponent:0}),(e()(),l["\u0275eld"](1,0,null,null,9,"div",[["class","col-md-6"],["style","background-color: rgb(245,245,245)"]],null,null,null,null,null)),(e()(),l["\u0275ted"](-1,null,["\n    "])),(e()(),l["\u0275eld"](3,0,null,null,6,"div",[["class","breadcrumbs"]],null,null,null,null,null)),(e()(),l["\u0275ted"](-1,null,["\n        "])),(e()(),l["\u0275eld"](5,0,null,null,2,"a",[["routerLink","/"]],[[1,"target",0],[8,"href",4]],[[null,"click"]],function(e,t,n){var o=!0;return"click"===t&&(o=!1!==l["\u0275nov"](e,6).onClick(n.button,n.ctrlKey,n.metaKey,n.shiftKey)&&o),o},null,null)),l["\u0275did"](6,671744,null,0,d.m,[d.l,d.a,a.LocationStrategy],{routerLink:[0,"routerLink"]},null),(e()(),l["\u0275ted"](-1,null,["Home"])),(e()(),l["\u0275ted"](-1,null,[" /\n        "])),(e()(),l["\u0275ted"](-1,null,["Assignments - Candidates "])),(e()(),l["\u0275ted"](-1,null,["\n"])),(e()(),l["\u0275ted"](-1,null,["\n \n"])),(e()(),l["\u0275eld"](12,0,null,null,0,"div",[["class","clearfix"]],null,null,null,null,null)),(e()(),l["\u0275ted"](-1,null,["\n\n"])),(e()(),l["\u0275eld"](14,0,null,null,24,"form",[["class","page-container"],["novalidate",""]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"submit"],[null,"reset"]],function(e,t,n){var o=!0;return"submit"===t&&(o=!1!==l["\u0275nov"](e,16).onSubmit(n)&&o),"reset"===t&&(o=!1!==l["\u0275nov"](e,16).onReset()&&o),o},null,null)),l["\u0275did"](15,16384,null,0,i["\u0275bf"],[],null,null),l["\u0275did"](16,4210688,null,0,i.NgForm,[[8,null],[8,null]],null,null),l["\u0275prd"](2048,null,i.ControlContainer,null,[i.NgForm]),l["\u0275did"](18,16384,null,0,i.NgControlStatusGroup,[i.ControlContainer],null,null),(e()(),l["\u0275ted"](-1,null,["\n    "])),(e()(),l["\u0275eld"](20,0,null,null,4,"div",[["class","row col-lg-12 col-md-12"]],null,null,null,null,null)),(e()(),l["\u0275ted"](-1,null,["\n        "])),(e()(),l["\u0275eld"](22,0,null,null,1,"simple-dock",[],null,[[null,"onDocEvent"]],function(e,t,n){var l=!0;return"onDocEvent"===t&&(l=!1!==e.component.handleDocEvent(n)&&l),l},s.b,s.a)),l["\u0275did"](23,638976,null,0,c.a,[r.i,u.b,p.a],{dock:[0,"dock"],isComponentLoaded:[1,"isComponentLoaded"],isRowSelected:[2,"isRowSelected"]},{onDocEvent:"onDocEvent"}),(e()(),l["\u0275ted"](-1,null,["\n    "])),(e()(),l["\u0275ted"](-1,null,["\n\n    "])),(e()(),l["\u0275eld"](26,0,null,null,5,"div",[["class","col-lg-12 dock-after"],["id","divTest"],["style","display:none;"]],null,null,null,null,null)),(e()(),l["\u0275ted"](-1,null,["\n\n         "])),(e()(),l["\u0275eld"](28,0,null,null,2,"dynamic-form",[],null,null,null,m.b,m.a)),l["\u0275prd"](512,null,a.DatePipe,a.DatePipe,[l.LOCALE_ID]),l["\u0275did"](30,638976,[[1,4]],0,h.a,[a.DatePipe,p.a],{dataObject:[0,"dataObject"]},null),(e()(),l["\u0275ted"](-1,null,[" \n    "])),(e()(),l["\u0275ted"](-1,null,["\n\n    "])),(e()(),l["\u0275eld"](33,0,null,null,4,"div",[["class","col-lg-12 col-md-12 dock-after"],["id","divTable"]],null,null,null,null,null)),(e()(),l["\u0275ted"](-1,null,["\n        "])),(e()(),l["\u0275eld"](35,0,null,null,1,"dynamic-table",[],[[8,"hidden",0]],[[null,"onTableEvent"]],function(e,t,n){var l=!0;return"onTableEvent"===t&&(l=!1!==e.component.handleTableEvent(n)&&l),l},g.b,g.a)),l["\u0275did"](36,573440,null,0,b.a,[p.a,u.b,a.Location],{details:[0,"details"],key:[1,"key"]},{onTableEvent:"onTableEvent"}),(e()(),l["\u0275ted"](-1,null,["\n    "])),(e()(),l["\u0275ted"](-1,null,["\n"]))],function(e,t){var n=t.component;e(t,6,0,"/"),e(t,23,0,n.dock,n.isComponentloaded,!!(n.id>0||n.headerSelected)),e(t,30,0,n.dynamicObject),e(t,36,0,n.details,"ID")},function(e,t){var n=t.component;e(t,5,0,l["\u0275nov"](t,6).target,l["\u0275nov"](t,6).href),e(t,14,0,l["\u0275nov"](t,18).ngClassUntouched,l["\u0275nov"](t,18).ngClassTouched,l["\u0275nov"](t,18).ngClassPristine,l["\u0275nov"](t,18).ngClassDirty,l["\u0275nov"](t,18).ngClassValid,l["\u0275nov"](t,18).ngClassInvalid,l["\u0275nov"](t,18).ngClassPending),e(t,35,0,!n.details)})}var j=l["\u0275ccf"]("candidate",N,function(e){return l["\u0275vid"](0,[(e()(),l["\u0275eld"](0,0,null,null,1,"candidate",[],null,null,null,O,w)),l["\u0275did"](1,114688,null,0,N,[v.a,d.l,k.a,D.e,p.a,u.b,r.i,y.b,y.a,I.a],null,null)],function(e,t){e(t,1,0)},null)},{},{},[]),S=n("t68o"),B=n("zbXB"),P=n("xYTU"),M=n("NcP4"),A=n("Fzqc"),F=n("dWZg"),x=n("qAlS"),R=n("eDkP"),U=n("4tE/"),_=n("lLAP"),q=n("YlbQ"),Z=n("M2Lx"),z=n("Wf4p"),V=n("o3x0"),Y=n("jQLj"),H=n("SMsm"),G=n("53Q5"),Q=n("OTqP"),J=n("mVsa"),W=n("uGex"),X=n("vGXY"),K=n("v9Dh"),ee=n("OzfB"),te=n("f67T"),ne=function(){},le=n("oj8r"),oe=n("4c35"),de=n("UodH"),ae=n("u7R8"),ie=n("FVSy"),se=n("de3e"),ce=n("/dO6"),re=n("YhbO"),ue=n("jlZm"),pe=n("r43C"),me=n("seP3"),he=n("b716"),ge=n("LC5p"),be=n("0/Q6"),fe=n("Z+uX"),Ce=n("Blfk"),ve=n("9It4"),ke=n("Nsh5"),De=n("kWGw"),ye=n("w+lc"),Ie=n("La40"),Ee=n("y4qS"),Te=n("BHnd"),Le=n("8mMr"),Ne=n("NA4g"),we=n("TY0b"),Oe=n("21Lb"),je=n("hUWP"),Se=n("V9q+"),Be=n("WbAX"),Pe=n("NpAJ");n.d(t,"AssignmentsModuleNgFactory",function(){return Me});var Me=l["\u0275cmf"](o,[],function(e){return l["\u0275mod"]([l["\u0275mpd"](512,l.ComponentFactoryResolver,l["\u0275CodegenComponentFactoryResolver"],[[8,[j,S.a,B.a,P.a,P.b,M.a]],[3,l.ComponentFactoryResolver],l.NgModuleRef]),l["\u0275mpd"](4608,i["\u0275i"],i["\u0275i"],[]),l["\u0275mpd"](4608,i.FormBuilder,i.FormBuilder,[]),l["\u0275mpd"](4608,a.NgLocalization,a.NgLocaleLocalization,[l.LOCALE_ID,[2,a["\u0275a"]]]),l["\u0275mpd"](6144,A.b,null,[a.DOCUMENT]),l["\u0275mpd"](4608,A.c,A.c,[[2,A.b]]),l["\u0275mpd"](4608,F.a,F.a,[]),l["\u0275mpd"](5120,x.c,x.a,[[3,x.c],l.NgZone,F.a]),l["\u0275mpd"](5120,x.f,x.e,[[3,x.f],F.a,l.NgZone]),l["\u0275mpd"](4608,R.i,R.i,[x.c,x.f,l.NgZone,a.DOCUMENT]),l["\u0275mpd"](5120,R.e,R.j,[[3,R.e],a.DOCUMENT]),l["\u0275mpd"](4608,R.h,R.h,[x.f,a.DOCUMENT]),l["\u0275mpd"](5120,R.f,R.m,[[3,R.f],a.DOCUMENT]),l["\u0275mpd"](4608,R.c,R.c,[R.i,R.e,l.ComponentFactoryResolver,R.h,R.f,l.ApplicationRef,l.Injector,l.NgZone,a.DOCUMENT]),l["\u0275mpd"](5120,R.k,R.l,[R.c]),l["\u0275mpd"](5120,U.a,U.b,[R.c]),l["\u0275mpd"](4608,_.k,_.k,[F.a]),l["\u0275mpd"](4608,_.j,_.j,[_.k,l.NgZone,a.DOCUMENT]),l["\u0275mpd"](136192,_.d,_.b,[[3,_.d],a.DOCUMENT]),l["\u0275mpd"](5120,_.n,_.m,[[3,_.n],[2,_.l],a.DOCUMENT]),l["\u0275mpd"](5120,_.i,_.g,[[3,_.i],l.NgZone,F.a]),l["\u0275mpd"](5120,q.c,q.d,[[3,q.c]]),l["\u0275mpd"](4608,Z.b,Z.b,[]),l["\u0275mpd"](4608,z.d,z.d,[]),l["\u0275mpd"](5120,V.c,V.d,[R.c]),l["\u0275mpd"](4608,V.e,V.e,[R.c,l.Injector,[2,a.Location],[2,V.b],V.c,[3,V.e],R.e]),l["\u0275mpd"](4608,Y.h,Y.h,[]),l["\u0275mpd"](5120,Y.a,Y.b,[R.c]),l["\u0275mpd"](5120,H.c,H.a,[[3,H.c],[2,G.c],Q.c,[2,a.DOCUMENT]]),l["\u0275mpd"](5120,J.b,J.d,[R.c]),l["\u0275mpd"](5120,W.a,W.b,[R.c]),l["\u0275mpd"](4608,Q.f,z.e,[[2,z.i],[2,z.n]]),l["\u0275mpd"](4608,X.d,X.d,[F.a]),l["\u0275mpd"](135680,X.a,X.a,[X.d,l.NgZone]),l["\u0275mpd"](4608,u.b,u.b,[R.c,_.n,l.Injector,X.a,[3,u.b]]),l["\u0275mpd"](5120,K.b,K.c,[R.c]),l["\u0275mpd"](6144,z.h,null,[l.LOCALE_ID]),l["\u0275mpd"](4608,z.c,z.y,[[2,z.h]]),l["\u0275mpd"](5120,ee.d,ee.e,[[3,ee.d],[2,ee.c],[2,ee.k],[2,ee.b]]),l["\u0275mpd"](5120,ee.h,ee.v,[[3,ee.h],ee.d]),l["\u0275mpd"](5120,ee.m,ee.w,[[3,ee.m],l.NgZone,l.PLATFORM_ID,a.DOCUMENT]),l["\u0275mpd"](4608,ee.n,ee.n,[ee.h,ee.m]),l["\u0275mpd"](5120,ee.p,ee.o,[[3,ee.p],ee.m,ee.h]),l["\u0275mpd"](5120,ee.t,ee.r,[[3,ee.t]]),l["\u0275mpd"](4608,ee.s,ee.s,[[2,ee.t],[2,ee.q],l.PLATFORM_ID,[2,ee.l]]),l["\u0275mpd"](5120,l.APP_BOOTSTRAP_LISTENER,function(e,t){return[ee.u(e,t)]},[a.DOCUMENT,l.PLATFORM_ID]),l["\u0275mpd"](512,d.n,d.n,[[2,d.s],[2,d.l]]),l["\u0275mpd"](512,ne,ne,[]),l["\u0275mpd"](512,i["\u0275ba"],i["\u0275ba"],[]),l["\u0275mpd"](512,i.FormsModule,i.FormsModule,[]),l["\u0275mpd"](512,i.ReactiveFormsModule,i.ReactiveFormsModule,[]),l["\u0275mpd"](512,a.CommonModule,a.CommonModule,[]),l["\u0275mpd"](512,le.b,le.b,[]),l["\u0275mpd"](512,A.a,A.a,[]),l["\u0275mpd"](256,z.f,!0,[]),l["\u0275mpd"](512,z.n,z.n,[[2,z.f]]),l["\u0275mpd"](512,F.b,F.b,[]),l["\u0275mpd"](512,z.x,z.x,[]),l["\u0275mpd"](512,z.v,z.v,[]),l["\u0275mpd"](512,z.t,z.t,[]),l["\u0275mpd"](512,oe.g,oe.g,[]),l["\u0275mpd"](512,x.b,x.b,[]),l["\u0275mpd"](512,R.g,R.g,[]),l["\u0275mpd"](512,U.c,U.c,[]),l["\u0275mpd"](512,_.a,_.a,[]),l["\u0275mpd"](512,de.c,de.c,[]),l["\u0275mpd"](512,ae.a,ae.a,[]),l["\u0275mpd"](512,ie.c,ie.c,[]),l["\u0275mpd"](512,Z.c,Z.c,[]),l["\u0275mpd"](512,se.c,se.c,[]),l["\u0275mpd"](512,ce.a,ce.a,[]),l["\u0275mpd"](512,V.i,V.i,[]),l["\u0275mpd"](512,Y.i,Y.i,[]),l["\u0275mpd"](512,re.c,re.c,[]),l["\u0275mpd"](512,ue.a,ue.a,[]),l["\u0275mpd"](512,z.o,z.o,[]),l["\u0275mpd"](512,pe.a,pe.a,[]),l["\u0275mpd"](512,H.b,H.b,[]),l["\u0275mpd"](512,me.d,me.d,[]),l["\u0275mpd"](512,he.c,he.c,[]),l["\u0275mpd"](512,ge.a,ge.a,[]),l["\u0275mpd"](512,be.a,be.a,[]),l["\u0275mpd"](512,J.c,J.c,[]),l["\u0275mpd"](512,fe.a,fe.a,[]),l["\u0275mpd"](512,Ce.a,Ce.a,[]),l["\u0275mpd"](512,ve.c,ve.c,[]),l["\u0275mpd"](512,W.d,W.d,[]),l["\u0275mpd"](512,ke.b,ke.b,[]),l["\u0275mpd"](512,De.b,De.b,[]),l["\u0275mpd"](512,ye.a,ye.a,[]),l["\u0275mpd"](512,X.c,X.c,[]),l["\u0275mpd"](512,u.d,u.d,[]),l["\u0275mpd"](512,Ie.a,Ie.a,[]),l["\u0275mpd"](512,Ee.k,Ee.k,[]),l["\u0275mpd"](512,Te.a,Te.a,[]),l["\u0275mpd"](512,Le.a,Le.a,[]),l["\u0275mpd"](512,K.d,K.d,[]),l["\u0275mpd"](512,z.z,z.z,[]),l["\u0275mpd"](512,z.q,z.q,[]),l["\u0275mpd"](512,Ne.a,Ne.a,[]),l["\u0275mpd"](512,we.a,we.a,[]),l["\u0275mpd"](512,ee.j,ee.j,[]),l["\u0275mpd"](512,Oe.b,Oe.b,[]),l["\u0275mpd"](512,je.a,je.a,[]),l["\u0275mpd"](512,Se.a,Se.a,[[2,ee.q],l.PLATFORM_ID]),l["\u0275mpd"](512,Be.a,Be.a,[]),l["\u0275mpd"](512,Pe.a,Pe.a,[]),l["\u0275mpd"](512,o,o,[]),l["\u0275mpd"](1024,d.j,function(){return[[{path:"",children:[{path:"candidate",component:N,canActivate:[te.a]}]}]]},[]),l["\u0275mpd"](256,J.a,{overlapTrigger:!0,xPosition:"after",yPosition:"below"},[]),l["\u0275mpd"](256,ke.a,!1,[]),l["\u0275mpd"](256,K.a,{showDelay:0,hideDelay:0,touchendHideDelay:1500},[]),l["\u0275mpd"](256,z.g,z.k,[])])})}}]);