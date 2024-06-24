!function(){function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */t=function(){return n};var r,n={},a=Object.prototype,o=a.hasOwnProperty,s=Object.defineProperty||function(e,t,r){e[t]=r.value},i="function"==typeof Symbol?Symbol:{},c=i.iterator||"@@iterator",u=i.asyncIterator||"@@asyncIterator",l=i.toStringTag||"@@toStringTag";function f(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{f({},"")}catch(r){f=function(e,t,r){return e[t]=r}}function p(e,t,r,n){var a=t&&t.prototype instanceof b?t:b,o=Object.create(a.prototype),i=new E(n||[]);return s(o,"_invoke",{value:q(e,r,i)}),o}function v(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}n.wrap=p;var h="suspendedStart",d="suspendedYield",m="executing",y="completed",g={};function b(){}function x(){}function w(){}var k={};f(k,c,(function(){return this}));var S=Object.getPrototypeOf,_=S&&S(S(O([])));_&&_!==a&&o.call(_,c)&&(k=_);var L=w.prototype=b.prototype=Object.create(k);function C(e){["next","throw","return"].forEach((function(t){f(e,t,(function(e){return this._invoke(t,e)}))}))}function P(t,r){function n(a,s,i,c){var u=v(t[a],t,s);if("throw"!==u.type){var l=u.arg,f=l.value;return f&&"object"==e(f)&&o.call(f,"__await")?r.resolve(f.__await).then((function(e){n("next",e,i,c)}),(function(e){n("throw",e,i,c)})):r.resolve(f).then((function(e){l.value=e,i(l)}),(function(e){return n("throw",e,i,c)}))}c(u.arg)}var a;s(this,"_invoke",{value:function(e,t){function o(){return new r((function(r,a){n(e,t,r,a)}))}return a=a?a.then(o,o):o()}})}function q(e,t,n){var a=h;return function(o,s){if(a===m)throw new Error("Generator is already running");if(a===y){if("throw"===o)throw s;return{value:r,done:!0}}for(n.method=o,n.arg=s;;){var i=n.delegate;if(i){var c=j(i,n);if(c){if(c===g)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(a===h)throw a=y,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);a=m;var u=v(e,t,n);if("normal"===u.type){if(a=n.done?y:d,u.arg===g)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(a=y,n.method="throw",n.arg=u.arg)}}}function j(e,t){var n=t.method,a=e.iterator[n];if(a===r)return t.delegate=null,"throw"===n&&e.iterator.return&&(t.method="return",t.arg=r,j(e,t),"throw"===t.method)||"return"!==n&&(t.method="throw",t.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var o=v(a,e.iterator,t.arg);if("throw"===o.type)return t.method="throw",t.arg=o.arg,t.delegate=null,g;var s=o.arg;return s?s.done?(t[e.resultName]=s.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=r),t.delegate=null,g):s:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,g)}function D(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function A(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function E(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(D,this),this.reset(!0)}function O(t){if(t||""===t){var n=t[c];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var a=-1,s=function e(){for(;++a<t.length;)if(o.call(t,a))return e.value=t[a],e.done=!1,e;return e.value=r,e.done=!0,e};return s.next=s}}throw new TypeError(e(t)+" is not iterable")}return x.prototype=w,s(L,"constructor",{value:w,configurable:!0}),s(w,"constructor",{value:x,configurable:!0}),x.displayName=f(w,l,"GeneratorFunction"),n.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===x||"GeneratorFunction"===(t.displayName||t.name))},n.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,w):(e.__proto__=w,f(e,l,"GeneratorFunction")),e.prototype=Object.create(L),e},n.awrap=function(e){return{__await:e}},C(P.prototype),f(P.prototype,u,(function(){return this})),n.AsyncIterator=P,n.async=function(e,t,r,a,o){void 0===o&&(o=Promise);var s=new P(p(e,t,r,a),o);return n.isGeneratorFunction(t)?s:s.next().then((function(e){return e.done?e.value:s.next()}))},C(L),f(L,l,"Generator"),f(L,c,(function(){return this})),f(L,"toString",(function(){return"[object Generator]"})),n.keys=function(e){var t=Object(e),r=[];for(var n in t)r.push(n);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},n.values=O,E.prototype={constructor:E,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(A),!e)for(var t in this)"t"===t.charAt(0)&&o.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=r)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function n(n,a){return i.type="throw",i.arg=e,t.next=n,a&&(t.method="next",t.arg=r),!!a}for(var a=this.tryEntries.length-1;a>=0;--a){var s=this.tryEntries[a],i=s.completion;if("root"===s.tryLoc)return n("end");if(s.tryLoc<=this.prev){var c=o.call(s,"catchLoc"),u=o.call(s,"finallyLoc");if(c&&u){if(this.prev<s.catchLoc)return n(s.catchLoc,!0);if(this.prev<s.finallyLoc)return n(s.finallyLoc)}else if(c){if(this.prev<s.catchLoc)return n(s.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<s.finallyLoc)return n(s.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&o.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var a=n;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var s=a?a.completion:{};return s.type=e,s.arg=t,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(s)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),A(r),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var a=n.arg;A(r)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,n){return this.delegate={iterator:O(e),resultName:t,nextLoc:n},"next"===this.method&&(this.arg=r),g}},n}function r(e,t,r,n,a,o,s){try{var i=e[o](s),c=i.value}catch(u){return void r(u)}i.done?t(c):Promise.resolve(c).then(n,a)}function n(e){return function(){var t=this,n=arguments;return new Promise((function(a,o){var s=e.apply(t,n);function i(e){r(s,a,o,i,c,"next",e)}function c(e){r(s,a,o,i,c,"throw",e)}i(void 0)}))}}System.register(["./element-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./select-legacy.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./form-legacy.js?v=1714377894636","./index-legacy85.js?v=1714377894636","./index-legacy52.js?v=1714377894636","./index-legacy53.js?v=1714377894636","./index-legacy39.js?v=1714377894636","./index-legacy57.js?v=1714377894636","./index-legacy54.js?v=1714377894636","./index-legacy56.js?v=1714377894636","./index-legacy43.js?v=1714377894636","./index-legacy58.js?v=1714377894636","./index-legacy59.js?v=1714377894636","./index-legacy45.js?v=1714377894636","./index-legacy60.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./database.popup-legacy.js?v=1714377894636","./mysql.store-legacy.js?v=1714377894636","./index-legacy28.js?v=1714377894636","./check-legacy.js?v=1714377894636"],(function(e,r){"use strict";var a,o,s,i,c,u,l,f,p,v,h,d,m,y,g,b,x,w,k,S,_,L,C,P,q,j,D,A,E,O,T,B,N,V,F,G,$,R,H,M,I,z,J,Y,K,Q,U,W,X,Z,ee,te,re,ne,ae;return{setters:[function(e){a=e.q,o=e.s,s=e.w,i=e.x},function(e){c=e.g,u=e.K,l=e.l,f=e.o,p=e.d,v=e.e,h=e.n,d=e.a,m=e.b},null,null,null,function(e){y=e._},function(e){g=e._},function(e){b=e._},function(e){x=e._},function(e){w=e._},function(e){k=e._},function(e){S=e._},function(e){_=e._},function(e){L=e._},function(e){C=e._},function(e){P=e._},function(e){q=e._},function(e){j=e._},function(e){D=e.e,A=e.A,E=e.b,O=e.f,T=e.v,B=e.c,N=e.H,V=e.w,F=e.I,G=e.j,$=e.l},function(e){R=e.a,H=e.r,M=e.b,I=e.N,z=e.c,J=e.d},function(e){Y=e.m,K=e.d,Q=e.M,U=e.S,W=e.e,X=e.B,Z=e.f,ee=e.h,te=e.b,re=e.s},function(e){ne=e.g},function(e){ae=e.c}],execute:function(){var oe=D({__name:"index",props:{databaseType:{default:""},tableBtnGroup:{default:function(){}},tableBtnGroupRight:{default:function(){}},tableColumn:{default:function(){}},tableData:{default:!1},tableBatch:{default:function(){}},recomList:{default:function(){return[]}},maskLayer:{type:Boolean}},setup:function(e){var a=e,o=ne(),s=o.refs,i=s.tabActive,h=s.tableParam,d=s.timer,m=s.textTimer,y=s.mongodbPwd,g=s.mysqlNotLocal,b=o.getDatabase,x=A(Y()),w=x.mysqlData,k=x.sid,S=Y().getDatabase,_=c().refs,L=_.mainHeight,C=_.pageSerachVal,P=G().proxy,q=E(!1);O((function(){return C.value}),(function(e){h.value.search=C.value}));var D,oe,se,ie,ce=P.$slots.empty,ue=T({}),le=E(!1),fe=E("mysql"===i.value?k.value:h.value.sid),pe=E(ae("mysql"==i.value?w.value.serverList:h.value.serverList,"array",[])),ve=E(ae("mysql"==i.value?w.value.typeList:h.value.serverList,"array",[])),he=B((function(){return u(ve.value)&&ve.value.filter((function(e){return e.id<0}))})),de=E(!1),me=E(""),ye=E(!1),ge=E(""),be=E(!1),xe=E(),we=T({allClassValue:""}),ke=T({p:1,limit:10,type:1,search:"",total:"mysql"===i.value?w.value.total:h.value.total,list:[],index:0}),Se=[],_e=0,Le=T({isRecurrence:!1,describe:{title:"",th:"",message:"",propsValue:"name"},tableDisplayConfig:{label:"状态",prop:"status",render:function(e){return N("span",{class:0===Se.length?"text-warning":Se.includes(e.id)?"text-primary":"text-danger"},function(){if(0===Se.length)return"等待执行";var t=Se.includes(e.id)?"执行成功":"执行失败";return _e===2*Se.length?(Se=[],_e=0):_e++,t}())}}}),Ce=E(!1),Pe=E([{active:!0,content:P.$t("BtnGroup.AddDataBase"),event:(se=n(t().mark((function e(){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:R(pe);case 1:case"end":return e.stop()}}),e)}))),function(){return se.apply(this,arguments)})},{content:P.$t("BtnGroup.RootPassword"),hide:"Mysql"!==a.databaseType&&"MongoDB"!==a.databaseType,event:(oe=n(t().mark((function e(){var r,n;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,"Mysql"!=a.databaseType){e.next=9;break}return e.next=4,K({table:"config",key:"mysql_root",id:1});case 4:r=e.sent,n=r.data,H(n),e.next=14;break;case 9:if("MongoDB"!=a.databaseType){e.next=14;break}if("enabled"===y.value.authorization){e.next=13;break}return P.$message.error("请先开启安全认证"),e.abrupt("return");case 13:H(y.value.root);case 14:e.next=19;break;case 16:e.prev=16,e.t0=e.catch(0);case 19:case"end":return e.stop()}}),e,null,[[0,16]])}))),function(){return oe.apply(this,arguments)})},{content:P.$t("BtnGroup.AdminPassword"),hide:"PgSql"!=a.databaseType,event:(D=n(t().mark((function e(){var r,n;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Q("pgsql");case 2:r=e.sent,n=r.data,me.value=n.msg||"",le.value=!0;case 6:case"end":return e.stop()}}),e)}))),function(){return D.apply(this,arguments)})},{content:"远程数据库",event:function(){l({title:a.databaseType+"远程数据库",area:86,isAsync:!0,component:function(){return j((function(){return r.import("./CloudServer-legacy.js?v=1714377894636")}),void 0,r.meta.url)},compData:pe.value,showFooter:!1})}}]),qe=E([{content:"同步数据库",dropdown:!0,splitButton:!1,settingList:[{label:"从面板同步到服务器",name:"syncAll",description:"将面板的数据库同步到本地服务器中"},{label:"从服务器同步到面板",name:"acquireToServer",description:"从服务器获取所有数据库，并同步到面板中<br>（数据库密码无法同步，需在面板重新配置）"}],event:(ie=n(t().mark((function e(r){var n,a;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("syncAll"!==r){e.next=23;break}if(n=P.$load("正在同步..."),e.prev=2,"mysql"!==i.value){e.next=9;break}return e.next=6,U({type:"0",ids:[]});case 6:a=e.sent,e.next=12;break;case 9:return e.next=11,W({data:JSON.stringify({type:"0",ids:[]})},i.value);case 11:a=e.sent;case 12:P.$message.request(a),e.next=18;break;case 15:e.prev=15,e.t0=e.catch(2);case 18:return e.prev=18,n.close(),e.finish(18);case 21:e.next=26;break;case 23:if("acquireToServer"!==r){e.next=26;break}return e.next=26,M(pe.value);case 26:case"end":return e.stop()}}),e,null,[[2,15,18,21]])}))),function(e){return ie.apply(this,arguments)})}]),je=function(){var e=n(t().mark((function e(r){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Ae(n(t().mark((function e(){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return k.value=r,e.next=3,S();case 3:case"end":return e.stop()}}),e)}))),n(t().mark((function e(){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return h.value.sid=r,e.next=3,b();case 3:case"end":return e.stop()}}),e)}))));case 2:ke.p=1;case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),De=function(){var e=n(t().mark((function e(r){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return null==r&&(r=""),e.next=3,Ae(n(t().mark((function e(){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return w.value.search=r,e.next=3,S();case 3:case"end":return e.stop()}}),e)}))),n(t().mark((function e(){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return h.value.search=r,e.next=3,b();case 3:case"end":return e.stop()}}),e)}))));case 3:ke.p=1;case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),Ae=function(){var e=n(t().mark((function e(){var r,n,a=arguments;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=a.length>0&&void 0!==a[0]?a[0]:function(){},n=a.length>1&&void 0!==a[1]?a[1]:function(){},"mysql"!==i.value){e.next=8;break}return e.next=5,r();case 5:return e.abrupt("return","mysql");case 8:return e.next=10,n();case 10:return e.abrupt("return","other");case 11:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Ee=function(){var e=n(t().mark((function e(r,n,a){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:e.t0=r,e.next="Synchronization"===e.t0?3:"BackDatabase"===e.t0?6:"delete"===e.t0?9:"settingPermisstion"===e.t0?12:15;break;case 3:return e.next=5,Oe(n);case 5:case 8:case 11:case 14:return e.abrupt("return",e.sent);case 6:return e.next=8,Be(n);case 9:return e.next=11,Ne(n);case 12:return e.next=14,Te(n);case 15:return e.abrupt("return",Promise.resolve());case 16:case"end":return e.stop()}}),e)})));return function(t,r,n){return e.apply(this,arguments)}}(),Oe=function(){var e=n(t().mark((function e(r){var a;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=r.id,e.prev=1,e.next=4,Ae(n(t().mark((function e(){var r,n;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,U({ids:JSON.stringify([a])},"1");case 2:return r=e.sent,(n=r.data).status&&Se.push(a),e.abrupt("return",n);case 6:case"end":return e.stop()}}),e)}))),n(t().mark((function e(){var r,n;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,W({data:JSON.stringify({ids:JSON.stringify([a]),type:"1"})},i.value);case 2:return r=e.sent,(n=r.data).status&&Se.push(a),e.abrupt("return",n);case 6:case"end":return e.stop()}}),e)}))));case 4:e.next=9;break;case 6:e.prev=6,e.t0=e.catch(1);case 9:case"end":return e.stop()}}),e,null,[[1,6]])})));return function(t){return e.apply(this,arguments)}}(),Te=function(e){return l({title:"设置数据库权限",area:42,isAsync:!0,component:function(){return j((function(){return r.import("./SetMysqlPermession-legacy.js?v=1714377894636")}),void 0,r.meta.url)},compData:{data:e,type:"multlples"},showFooter:!0}),Promise.resolve()},Be=function(){var e=n(t().mark((function e(r){var a;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=r.id,e.prev=1,e.next=4,Ae(n(t().mark((function e(){var r,n;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,X({id:a});case 2:return r=e.sent,(n=r.data).status&&Se.push(a),e.abrupt("return",n);case 6:case"end":return e.stop()}}),e)}))),n(t().mark((function e(){var r,n;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Z({data:JSON.stringify({id:a})},i.value);case 2:return r=e.sent,(n=r.data).status&&Se.push(a),e.abrupt("return",n);case 6:case"end":return e.stop()}}),e)}))));case 4:e.next=9;break;case 6:e.prev=6,e.t0=e.catch(1);case 9:case"end":return e.stop()}}),e,null,[[1,6]])})));return function(t){return e.apply(this,arguments)}}(),Ne=function(){var e=n(t().mark((function e(r){var n;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=[],(r=ae(r,"array",[])).forEach((function(e){n.push(e.id)})),e.next=5,J(n,"isMult");case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),Ve=T({loading:!1,list:[],selection:[],historySearch:[],rowData:{},total:0}),Fe=function(){var e=n(t().mark((function e(){var r,n;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,ee({data:JSON.stringify({status:"1",password:me.value})},"pgsql");case 3:r=e.sent,n=r.data,P.$message.request(n),n.status&&(le.value=!1),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0);case 12:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(){return e.apply(this,arguments)}}(),Ge=function(){var e=n(t().mark((function e(){var r,n;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,te({sName:"pgsql"==i.value?"pgsql_manager":i.value});case 2:r=e.sent,n=r.data,"pgsql"==i.value?n.versions.forEach((function(e){return e.setup?void p({pluginInfo:n}):void v({name:n.name,type:n.type,pluginInfo:n})})):v({name:n.name,type:n.type,pluginInfo:n});case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),$e=function(){var e=n(t().mark((function e(){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:xe.value.validate(function(){var e=n(t().mark((function e(r){var n,a;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!r){e.next=14;break}return n=Ve.list.map((function(e){return e.name})),e.prev=2,e.next=5,re({database_names:n.join(","),id:we.allClassValue,db_type:i.value});case 5:a=e.sent,P.$message.request(a),Ae((function(){S()}),(function(){b()})),be.value=!1,e.next=14;break;case 11:e.prev=11,e.t0=e.catch(2);case 14:case"end":return e.stop()}}),e,null,[[2,11]])})));return function(t){return e.apply(this,arguments)}}());case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return O((function(){return w.value.total}),(function(){ke.total=w.value.total,ke.limit=w.value.limit}),{immediate:!0}),O((function(){return h.value.total}),(function(){ke.total=h.value.total,ke.limit=h.value.limit}),{immediate:!0}),O((function(){return i.value}),(function(e,t){var r=ae(h.value.serverList,"array",[]);"mysql"===i.value?(ye.value=a.maskLayer||!1,Pe.value[1].hide=function(){return g.value}):(ae(r,"array",[]).every((function(e){return 0!==e.id}))&&(Ce.value=!0),h.value.unLocalDb.includes(i.value)?ye.value=!0:ye.value=!1)}),{immediate:!0}),O((function(){return a.maskLayer}),(function(){"mysql"===i.value&&(ye.value=a.maskLayer||!1)}),{immediate:!0}),V(n(t().mark((function e(){var r,n,a,o,s;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return pe.value=ae("mysql"==i.value?w.value.serverList:h.value.serverList,"array",[]),Array.isArray(pe.value)&&""!==(null===(r=pe.value[0])||void 0===r?void 0:r.id)&&(null===(n=pe.value)||void 0===n||n.unshift({id:"",ps:"全部",db_host:"全部"})),ve.value=ae("mysql"==i.value?w.value.typeList:h.value.serverList,"array",[]),Array.isArray(ve.value)&&""!==(null===(a=ve.value[0])||void 0===a?void 0:a.id)&&(null===(o=ve.value)||void 0===o||o.unshift({id:"",ps:"全部"})),e.next=6,Ae();case 6:s=e.sent,fe.value="mysql"==s?k.value:h.value.sid,ke.total=("mysql"==i.value?w:h).value.total,ke.limit=("mysql"==i.value?w:h).value.limit;case 10:case"end":return e.stop()}}),e)})))),F((function(){clearInterval(m.value),clearTimeout(d.value)})),{__sfc:!0,tabActive:i,tableParam:h,timer:d,textTimer:m,mongodbPwd:y,mysqlNotLocal:g,getModulesDatabase:b,mysqlData:w,sid:k,getDatabase:S,mainHeight:L,pageSerachVal:C,vm:P,props:a,showSearchHistory:q,closeSearchHistory:function(){$((function(){q.value=!1}))},hasEmpty:ce,form:ue,rootPwdPopup:le,selectValue:fe,selectOptions:pe,dbTypeOptions:ve,filteredDbTypeOptions:he,hovering:de,rootPwd:me,maskLayer:ye,allClassValue:ge,classPopup:be,setClassFormRef:xe,setClassForm:we,rules:{allClassValue:[{required:!0,message:"请选择分类",trigger:"change"}]},tableParamData:ke,resList:Se,index:_e,batchConfig:Le,isNotLocal:Ce,tableBtnGroup:Pe,tableBtnGroupRight:qe,searchValue:function(e){h.value.search=e},selectSubmit:je,openClassify:function(){z()},searchSubmit:De,changePageLimit:function(e){Ae((function(){w.value.limit=e,S()}),(function(){h.value.limit=e,b()}))},judgeType:Ae,handleBathComplete:function(e){Ae((function(){S()}),(function(){b()}))},changePageSize:function(e){ke.p=e,Ae((function(){S(e)}),(function(){b(e)}))},batchEvent:Ee,batchSync:Oe,batchSettingPermisstion:Te,batchBack:Be,batchDelete:Ne,tableList:Ve,handleSelectionChange:function(e){Ve.list=e},handleBatch:function(e){if("setClassify"!=e){var t=[];switch(e){case"Synchronization":t=["同步"],Le.describe.message="批量".concat(t[0],"已选的数据库，").concat(t[0],"过程中存在风险，请在闲置时间进行").concat(t[0],"，是否继续操作？");break;case"BackDatabase":t=["备份"],Le.describe.message="批量".concat(t[0],"已选的数据库，是否继续操作？");break;case"delete":t=["删除"],Ne(Ve.list);break;case"settingPermisstion":t=["设置"],Te(Ve.list)}Le.isRecurrence=!0,Le.describe.th="数据库",Le.describe.title="批量".concat(t[0]||"操作","数据库")}else be.value=!0},onSubmitRootPwd:Fe,openAddServer:function(){l({title:"远程数据库",area:86,isAsync:!0,component:function(){return j((function(){return r.import("./CloudServer-legacy.js?v=1714377894636")}),void 0,r.meta.url)},compData:pe.value,showFooter:!1})},installLocal:Ge,sortChange:function(e){e.column;var t=e.prop,r=e.order;t&&(w.value.order=r?t+("ascending"===r?" asc":" desc"):"",Ae((function(){S(ke.p)}),(function(){b(ke.p)})),ke.total=("mysql"==i.value?w:h).value.total,ke.limit=("mysql"==i.value?w:h).value.limit)},setAllClass:$e,addMysqlDialog:R,NPSDialog:I,isRelease:f}}});e("D",h(oe,(function(){var e,t=this,r=t._self._c,n=t._self._setupProxy;return r("div",{staticClass:"flex flex-col"},[r(q,{attrs:{visible:n.maskLayer,width:"sqlserver"!==n.tabActive?"58rem":"38rem"}},[r("span",{staticClass:"mr-8x"},[t._v(t._s("sqlserver"==n.tabActive?"当前未配置远程数据库，":"当前未安装"+n.tabActive+"环境".concat((null===(e=n.selectOptions)||void 0===e?void 0:e.length)>1?"":"/远程数据库")))]),r(d,{staticClass:"!text-[1.4rem]",on:{click:n.openAddServer}},[t._v("添加远程数据库")]),"sqlserver"!=n.tabActive?r(P):t._e(),"sqlserver"!=n.tabActive?r(d,{staticClass:"!text-[1.4rem]",on:{click:n.installLocal}},[t._v(" 安装"+t._s(n.tabActive)+"环境")]):t._e()],1),r(C,{scopedSlots:t._u([{key:"header-left",fn:function(){return[r("div",{staticClass:"flex items-center"},[r(L,{staticClass:"mr-12x",attrs:{group:n.tableBtnGroup}}),t._t("btn-left"),r("div",{staticClass:"bg-[#ececec] w-[0.1rem] h-10 mx-[0.8rem]"}),r(L,{staticClass:"mr-120x",attrs:{group:n.tableBtnGroupRight}}),t._t("btn-right"),r(_,{staticClass:"ml-12x inline-block",attrs:{icon:"demand",iconClass:"text-1.6rem",content:"需求反馈"},on:{click:function(e){return n.NPSDialog()}}})],2)]},proxy:!0},{key:"header-right",fn:function(){return["mysql"!==n.tabActive||n.isRelease?r(a,{staticClass:"w-[12rem] mr-8x",on:{change:n.selectSubmit},model:{value:n.selectValue,callback:function(e){n.selectValue=e},expression:"selectValue"}},t._l(n.selectOptions,(function(e,t){return r(o,{key:t,attrs:{label:e.ps,value:e.id}})})),1):r(a,{staticClass:"mr-8x",attrs:{placeholder:"请选择分类"},on:{change:n.selectSubmit},model:{value:n.selectValue,callback:function(e){n.selectValue=e},expression:"selectValue"}},[r("div",{staticClass:"max-h-[20rem] overflow-auto",class:{"no-hover":n.hovering}},t._l(n.dbTypeOptions,(function(e,t){return r(o,{key:t,attrs:{label:e.ps,value:e.id}})})),1),r("div",{staticClass:"classify-item",on:{click:n.openClassify,mouseover:function(e){n.hovering=!0},mouseout:function(e){n.hovering=!1}}},[t._v(" 分类设置 ")])]),"mysql"==n.tabActive?[r("div",{staticClass:"relative"},[r(w,{staticClass:"mr-12x",attrs:{placeholder:t.$t("FtpContent.FtpSearchPlaceHolder")},on:{focus:function(e){n.showSearchHistory=!0},blur:n.closeSearchHistory,clear:n.searchSubmit,search:n.searchSubmit},model:{value:n.tableParam.search,callback:function(e){t.$set(n.tableParam,"search",e)},expression:"tableParam.search"}}),r(S,{directives:[{name:"show",rawName:"v-show",value:n.showSearchHistory,expression:"showSearchHistory"}],attrs:{compData:{historySearch:n.mysqlData.historySearch,recomList:t.recomList,name:"databases",key:"mysql"}},on:{"updata:searchValue":n.searchValue}})],1),r(k,{attrs:{name:"mysqlTableColumn",column:t.tableColumn}})]:r(w,{attrs:{placeholder:"请输入数据库名称/备注"},on:{clear:n.searchSubmit,search:n.searchSubmit},model:{value:n.tableParam.search,callback:function(e){t.$set(n.tableParam,"search",e)},expression:"tableParam.search"}})]},proxy:!0},{key:"content",fn:function(){return[r(x,{attrs:{"max-height":n.mainHeight-340,column:t.tableColumn,data:t.tableData},on:{"selection-change":n.handleSelectionChange,"sort-change":n.sortChange},scopedSlots:t._u(["redis"!==n.tabActive?{key:"empty",fn:function(){return[r("div",{staticClass:"flex items-center justify-center"},[t._v(" 您的数据库列表为空，您可以 "),r(d,{on:{click:function(e){return n.addMysqlDialog(n.selectOptions)}}},[t._v("添加一个数据库")])],1)]},proxy:!0}:null],null,!0)})]},proxy:!0},{key:"footer-left",fn:function(){return[r(b,{attrs:{data:t.tableBatch,config:n.batchConfig,"batch-fn":n.batchEvent},on:{"handle-batch":n.handleBatch,"handle-complete":n.handleBathComplete}})]},proxy:!0},{key:"footer-right",fn:function(){return[r(g,{attrs:{total:n.tableParamData.total,"current-page":n.tableParamData.p,"page-size":n.tableParamData.limit},on:{"size-change":n.changePageLimit,"current-change":n.changePageSize}})]},proxy:!0},{key:"popup",fn:function(){return[r(m,{attrs:{title:"管理员密码",visible:n.rootPwdPopup,area:38,showFooter:""},on:{"update:visible":function(e){n.rootPwdPopup=e},confirm:n.onSubmitRootPwd}},[r("div",{staticClass:"p-20x"},[r(s,{attrs:{model:n.form,"label-position":"right"}},[r(i,{attrs:{label:"管理员密码",prop:"password",rules:[{required:!0,message:"请输入管理员密码",trigger:"blur"}]}},[r(y,{attrs:{iconType:"refresh"},model:{value:n.rootPwd,callback:function(e){n.rootPwd=e},expression:"rootPwd"}})],1)],1)],1)]),r(m,{attrs:{title:"设置数据库分类",showFooter:"",area:40,visible:n.classPopup},on:{"update:visible":function(e){n.classPopup=e},confirm:n.setAllClass}},[r(s,{ref:"setClassFormRef",staticClass:"p-[2rem]",attrs:{rules:n.rules,model:n.setClassForm}},[r(i,{attrs:{label:"数据库分类",prop:"allClassValue"}},[r(a,{staticClass:"w-[22rem]",attrs:{placeholder:"请选择您的分类"},model:{value:n.setClassForm.allClassValue,callback:function(e){t.$set(n.setClassForm,"allClassValue",e)},expression:"setClassForm.allClassValue"}},t._l(n.filteredDbTypeOptions,(function(e,t){return r(o,{key:t,attrs:{label:e.ps,value:e.id}})})),1)],1)],1)],1)]},proxy:!0}],null,!0)})],1)}),[],!1,null,"76b7a577",null,null).exports)}}}))}();
