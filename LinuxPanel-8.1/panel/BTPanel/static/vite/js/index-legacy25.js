!function(){function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */t=function(){return r};var n,r={},a=Object.prototype,o=a.hasOwnProperty,i=Object.defineProperty||function(e,t,n){e[t]=n.value},c="function"==typeof Symbol?Symbol:{},u=c.iterator||"@@iterator",l=c.asyncIterator||"@@asyncIterator",s=c.toStringTag||"@@toStringTag";function f(e,t,n){return Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{f({},"")}catch(n){f=function(e,t,n){return e[t]=n}}function h(e,t,n,r){var a=t&&t.prototype instanceof b?t:b,o=Object.create(a.prototype),c=new A(r||[]);return i(o,"_invoke",{value:E(e,n,c)}),o}function p(e,t,n){try{return{type:"normal",arg:e.call(t,n)}}catch(e){return{type:"throw",arg:e}}}r.wrap=h;var y="suspendedStart",d="suspendedYield",m="executing",g="completed",v={};function b(){}function x(){}function w(){}var j={};f(j,u,(function(){return this}));var _=Object.getPrototypeOf,S=_&&_(_(N([])));S&&S!==a&&o.call(S,u)&&(j=S);var L=w.prototype=b.prototype=Object.create(j);function P(e){["next","throw","return"].forEach((function(t){f(e,t,(function(e){return this._invoke(t,e)}))}))}function k(t,n){function r(a,i,c,u){var l=p(t[a],t,i);if("throw"!==l.type){var s=l.arg,f=s.value;return f&&"object"==e(f)&&o.call(f,"__await")?n.resolve(f.__await).then((function(e){r("next",e,c,u)}),(function(e){r("throw",e,c,u)})):n.resolve(f).then((function(e){s.value=e,c(s)}),(function(e){return r("throw",e,c,u)}))}u(l.arg)}var a;i(this,"_invoke",{value:function(e,t){function o(){return new n((function(n,a){r(e,t,n,a)}))}return a=a?a.then(o,o):o()}})}function E(e,t,r){var a=y;return function(o,i){if(a===m)throw new Error("Generator is already running");if(a===g){if("throw"===o)throw i;return{value:n,done:!0}}for(r.method=o,r.arg=i;;){var c=r.delegate;if(c){var u=T(c,r);if(u){if(u===v)continue;return u}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(a===y)throw a=g,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);a=m;var l=p(e,t,r);if("normal"===l.type){if(a=r.done?g:d,l.arg===v)continue;return{value:l.arg,done:r.done}}"throw"===l.type&&(a=g,r.method="throw",r.arg=l.arg)}}}function T(e,t){var r=t.method,a=e.iterator[r];if(a===n)return t.delegate=null,"throw"===r&&e.iterator.return&&(t.method="return",t.arg=n,T(e,t),"throw"===t.method)||"return"!==r&&(t.method="throw",t.arg=new TypeError("The iterator does not provide a '"+r+"' method")),v;var o=p(a,e.iterator,t.arg);if("throw"===o.type)return t.method="throw",t.arg=o.arg,t.delegate=null,v;var i=o.arg;return i?i.done?(t[e.resultName]=i.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=n),t.delegate=null,v):i:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,v)}function C(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function O(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function A(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(C,this),this.reset(!0)}function N(t){if(t||""===t){var r=t[u];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var a=-1,i=function e(){for(;++a<t.length;)if(o.call(t,a))return e.value=t[a],e.done=!1,e;return e.value=n,e.done=!0,e};return i.next=i}}throw new TypeError(e(t)+" is not iterable")}return x.prototype=w,i(L,"constructor",{value:w,configurable:!0}),i(w,"constructor",{value:x,configurable:!0}),x.displayName=f(w,s,"GeneratorFunction"),r.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===x||"GeneratorFunction"===(t.displayName||t.name))},r.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,w):(e.__proto__=w,f(e,s,"GeneratorFunction")),e.prototype=Object.create(L),e},r.awrap=function(e){return{__await:e}},P(k.prototype),f(k.prototype,l,(function(){return this})),r.AsyncIterator=k,r.async=function(e,t,n,a,o){void 0===o&&(o=Promise);var i=new k(h(e,t,n,a),o);return r.isGeneratorFunction(t)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},P(L),f(L,s,"Generator"),f(L,u,(function(){return this})),f(L,"toString",(function(){return"[object Generator]"})),r.keys=function(e){var t=Object(e),n=[];for(var r in t)n.push(r);return n.reverse(),function e(){for(;n.length;){var r=n.pop();if(r in t)return e.value=r,e.done=!1,e}return e.done=!0,e}},r.values=N,A.prototype={constructor:A,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=n,this.done=!1,this.delegate=null,this.method="next",this.arg=n,this.tryEntries.forEach(O),!e)for(var t in this)"t"===t.charAt(0)&&o.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=n)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function r(r,a){return c.type="throw",c.arg=e,t.next=r,a&&(t.method="next",t.arg=n),!!a}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var u=o.call(i,"catchLoc"),l=o.call(i,"finallyLoc");if(u&&l){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&o.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var a=r;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=e,i.arg=t,a?(this.method="next",this.next=a.finallyLoc,v):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),v},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.finallyLoc===e)return this.complete(n.completion,n.afterLoc),O(n),v}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.tryLoc===e){var r=n.completion;if("throw"===r.type){var a=r.arg;O(n)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,r){return this.delegate={iterator:N(e),resultName:t,nextLoc:r},"next"===this.method&&(this.arg=n),v}},r}function n(e,t,n,r,a,o,i){try{var c=e[o](i),u=c.value}catch(l){return void n(l)}c.done?t(u):Promise.resolve(u).then(r,a)}function r(e){return function(){var t=this,r=arguments;return new Promise((function(a,o){var i=e.apply(t,r);function c(e){n(i,a,o,c,u,"next",e)}function u(e){n(i,a,o,c,u,"throw",e)}c(void 0)}))}}System.register(["./index-legacy52.js?v=1714377894636","./index-legacy53.js?v=1714377894636","./main-legacy.js?v=1714377894636","./index-legacy39.js?v=1714377894636","./index-legacy54.js?v=1714377894636","./index-legacy55.js?v=1714377894636","./index-legacy57.js?v=1714377894636","./index-legacy43.js?v=1714377894636","./index-legacy58.js?v=1714377894636","./index-legacy59.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./site.store-legacy.js?v=1714377894636","./site.popup-legacy.js?v=1714377894636","./confirm-legacy.js?v=1714377894636","./index-legacy61.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./progress-legacy.js?v=1714377894636","./select-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./empty-legacy.js?v=1714377894636","./dropdown-legacy.js?v=1714377894636","./autocomplete-legacy.js?v=1714377894636","./index-legacy45.js?v=1714377894636","./check-legacy.js?v=1714377894636","./index-legacy38.js?v=1714377894636","./element-ui.common-legacy.js?v=1714377894636","./date-util-legacy.js?v=1714377894636","./vdom-legacy.js?v=1714377894636","./index-legacy62.js?v=1714377894636","./cascader-panel-legacy.js?v=1714377894636","./config-legacy.js?v=1714377894636"],(function(e,n){"use strict";var a,o,i,c,u,l,s,f,h,p,y,d,m,g,v,b,x,w,j,_,S,L,P,k,E,T,C,O;return{setters:[function(e){a=e._},function(e){o=e._},function(e){i=e.n,c=e.a},function(e){u=e._},function(e){l=e._},function(e){s=e._},function(e){f=e._},function(e){h=e._},function(e){p=e._},function(e){y=e._},function(e){d=e.e,m=e.b,g=e.v,v=e.H,b=e.h,x=e.j},function(e){w=e.g,j=e.C,_=e.D},function(e){S=e.r,L=e.L,P=e.M,k=e.N,E=e.O,T=e.P},function(e){C=e.a},function(e){O=e.o},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],execute:function(){var n=d({__name:"index",setup:function(e){var n=w(),a=n.refs.modulesTableParams,o=n.getModulesList,i=x().proxy,c=m([]),u=g({isRecurrence:!0,describe:{title:"",th:"",message:"",propsValue:""},tableDisplayConfig:{label:"状态",prop:"status",render:function(e){return v("span",{})}}}),l=[{content:"添加PHP动态项目",active:!0,event:function(){P()}},{content:"项目编排",event:function(){E()}}],s=m([{label:"启动项目",value:"startSite",diyBatch:function(){y("start")}},{label:"停用项目",value:"stopSite",diyBatch:function(){y("stop")}},{label:"删除项目",value:"delSite",diyBatch:function(){h(c.value,!0)}}]),f=m([{label:"名称",prop:"name"},{label:"结果",render:function(e){return v("span",{class:e.status?"text-primary":"text-danger"},e.msg)}}]),h=function(e,n){var a;C({confirm:{icon:"warning",title:n?"批量删除项目":"删除PHP动态项目-"+e.name,message:n?"批量删除选中的项目后，项目将无法恢复，是否继续操作？":"风险操作，此操作不可逆，删除【"+e.name+"】项目后您将无法管理该项目，是否继续操作？",type:"input",inputText:n?"批量删除项目":"删除项目"},loading:"正在删除，请稍后...",request:(a=r(t().mark((function a(){var i,c;return t().wrap((function(a){for(;;)switch(a.prev=a.next){case 0:if(!n){a.next=8;break}return i=e.map((function(e){return{name:e.name,id:e.id}})),c=[],a.next=5,i.forEach(function(){var e=r(t().mark((function e(n,r){var a;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,j({id:n.id,webname:n.name});case 2:if(a=e.sent,c.push({name:n.name,status:a.status,msg:a.msg}),r!==i.length-1){e.next=9;break}return e.next=7,S({resultData:c,resultTitle:"删除项目",resultColumn:f.value});case 7:return e.next=9,o("phpAsync");case 9:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}());case 5:return a.abrupt("return",null);case 8:return a.next=10,j({id:e.id,webname:e.name});case 10:return a.abrupt("return",a.sent);case 11:case"end":return a.stop()}}),a)}))),function(){return a.apply(this,arguments)}),complete:function(){return r(t().mark((function e(){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:o("phpAsync");case 1:case"end":return e.stop()}}),e)})))()}})},p=function(){var e=r(t().mark((function e(n){var r;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i.$confirm({title:"提示",message:n.run?"停用站点【".concat(n.name,"】后，用户访问会显示当前网站停用后的提示页，是否继续操作？"):"启动站点【".concat(n.name,"】后，用户可以正常访问网站内容，是否继续操作？"),icon:"warning"});case 3:return e.next=5,_({sitename:n.name,project_action:n.run?"stop":"start"});case 5:r=e.sent,i.$message.request(r),o("phpAsync"),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(0);case 13:case"end":return e.stop()}}),e,null,[[0,10]])})));return function(t){return e.apply(this,arguments)}}(),y=function(){var e=r(t().mark((function e(n){var a;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:O({title:(a="start"===n)?"批量启用选中的项目后，项目将恢复正常访问，是否继续操作？":"批量停用选中的项目后，项目将无法正常访问，用户访问会显示当前项目停用后的提示页，是否继续操作？",dataList:c.value,titleType:a?"批量启用选中的项目":"批量停用选中的项目",requestFun:function(){var e=r(t().mark((function e(r){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,_({sitename:r.name,project_action:n});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),isRecurrence:!0,tableColumn:[{prop:"name",label:"项目名"},{prop:"result",label:"状态"}],isReturnResult:!0,callback:function(){o("phpAsync")}});case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),d=L({openSetting:function(e){T(e)},changeStatusEvent:p,deleteEvent:h});return b(r(t().mark((function e(){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o("phpAsync");case 2:case"end":return e.stop()}}),e)})))),{__sfc:!0,modulesTableParams:a,getModulesList:o,vm:i,checkedList:c,batchConfig:u,tableBtnGroup:l,batchGroup:s,handleSelectionChange:function(e){c.value=e},handleBatch:function(e){},handleSerach:function(e){a.value.search=e,void 0===e&&(a.value.search=""),o("phpAsync")},changePage:function(e){a.value.p=e,o("phpAsync")},changeSize:function(e){var t;a.value.limit=e;var n=JSON.parse(null!==(t=localStorage.getItem("siteOtherPageLimit"))&&void 0!==t?t:"{}");n.phpAsync=e,localStorage.setItem("siteOtherPageLimit",JSON.stringify(n)),o("phpAsync")},resultColumn:f,deleteEvent:h,changeStatusEvent:p,multStatusEvent:y,tableColumns:d,refresh:function(){o("phpAsync")},addPhpAsyncDialog:P,NPSDialog:k}}});e("default",i(n,(function(){var e=this,t=e._self._c,n=e._self._setupProxy;return t("div",[t(y,{scopedSlots:e._u([{key:"header-left",fn:function(){return[t("div",{staticClass:"flex items-center"},[t(p,{attrs:{group:n.tableBtnGroup}}),t(h,{staticClass:"ml-12x inline-block",attrs:{icon:"demand",iconClass:"text-1.6rem",content:"需求反馈"},on:{click:function(e){return n.NPSDialog()}}})],1)]},proxy:!0},{key:"header-right",fn:function(){return[t("div",{staticClass:"relative mr-8x"},[t(f,{attrs:{placeholder:e.$t("SitePhpModel.TableSearch"),width:"40rem"},on:{search:n.handleSerach,clear:n.handleSerach},model:{value:n.modulesTableParams.search,callback:function(t){e.$set(n.modulesTableParams,"search",t)},expression:"modulesTableParams.search"}})],1),t(s,{staticClass:"!mr-8x",attrs:{refresh:n.refresh}}),t(l,{attrs:{name:"phpAsyncTableColumn",column:n.tableColumns,"is-request":!0}})]},proxy:!0},{key:"content",fn:function(){return[t(u,{directives:[{name:"loading",rawName:"v-loading",value:n.modulesTableParams.loading,expression:"modulesTableParams.loading"}],ref:"siteHtmlTable",attrs:{"element-loading-text":"正在加载中...",data:n.modulesTableParams.list,column:n.tableColumns},on:{"selection-change":n.handleSelectionChange},scopedSlots:e._u([{key:"empty",fn:function(){return[t("div",{staticClass:"flex items-center justify-center"},[e._v(" 您的列表为空，您可以 "),t(c,{on:{click:n.addPhpAsyncDialog}},[e._v("添加一个项目")])],1)]},proxy:!0}])})]},proxy:!0},{key:"footer-left",fn:function(){return[t(o,{attrs:{data:n.batchGroup,config:n.batchConfig,"batch-fn":function(){}},on:{"handle-batch":n.handleBatch}})]},proxy:!0},{key:"footer-right",fn:function(){return[t(a,{attrs:{total:n.modulesTableParams.total,"current-page":n.modulesTableParams.p,"page-size":n.modulesTableParams.limit},on:{"current-change":n.changePage,"size-change":n.changeSize}})]},proxy:!0}])})],1)}),[],!1,null,null,null,null).exports)}}}))}();
