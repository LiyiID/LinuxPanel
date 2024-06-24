!function(){function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */t=function(){return r};var n,r={},o=Object.prototype,a=o.hasOwnProperty,i=Object.defineProperty||function(e,t,n){e[t]=n.value},c="function"==typeof Symbol?Symbol:{},s=c.iterator||"@@iterator",l=c.asyncIterator||"@@asyncIterator",u=c.toStringTag||"@@toStringTag";function f(e,t,n){return Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{f({},"")}catch(n){f=function(e,t,n){return e[t]=n}}function h(e,t,n,r){var o=t&&t.prototype instanceof b?t:b,a=Object.create(o.prototype),c=new O(r||[]);return i(a,"_invoke",{value:T(e,n,c)}),a}function d(e,t,n){try{return{type:"normal",arg:e.call(t,n)}}catch(e){return{type:"throw",arg:e}}}r.wrap=h;var p="suspendedStart",v="suspendedYield",y="executing",g="completed",m={};function b(){}function x(){}function j(){}var w={};f(w,s,(function(){return this}));var _=Object.getPrototypeOf,k=_&&_(_(G([])));k&&k!==o&&a.call(k,s)&&(w=k);var L=j.prototype=b.prototype=Object.create(w);function S(e){["next","throw","return"].forEach((function(t){f(e,t,(function(e){return this._invoke(t,e)}))}))}function P(t,n){function r(o,i,c,s){var l=d(t[o],t,i);if("throw"!==l.type){var u=l.arg,f=u.value;return f&&"object"==e(f)&&a.call(f,"__await")?n.resolve(f.__await).then((function(e){r("next",e,c,s)}),(function(e){r("throw",e,c,s)})):n.resolve(f).then((function(e){u.value=e,c(u)}),(function(e){return r("throw",e,c,s)}))}s(l.arg)}var o;i(this,"_invoke",{value:function(e,t){function a(){return new n((function(n,o){r(e,t,n,o)}))}return o=o?o.then(a,a):a()}})}function T(e,t,r){var o=p;return function(a,i){if(o===y)throw new Error("Generator is already running");if(o===g){if("throw"===a)throw i;return{value:n,done:!0}}for(r.method=a,r.arg=i;;){var c=r.delegate;if(c){var s=E(c,r);if(s){if(s===m)continue;return s}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(o===p)throw o=g,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o=y;var l=d(e,t,r);if("normal"===l.type){if(o=r.done?g:v,l.arg===m)continue;return{value:l.arg,done:r.done}}"throw"===l.type&&(o=g,r.method="throw",r.arg=l.arg)}}}function E(e,t){var r=t.method,o=e.iterator[r];if(o===n)return t.delegate=null,"throw"===r&&e.iterator.return&&(t.method="return",t.arg=n,E(e,t),"throw"===t.method)||"return"!==r&&(t.method="throw",t.arg=new TypeError("The iterator does not provide a '"+r+"' method")),m;var a=d(o,e.iterator,t.arg);if("throw"===a.type)return t.method="throw",t.arg=a.arg,t.delegate=null,m;var i=a.arg;return i?i.done?(t[e.resultName]=i.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=n),t.delegate=null,m):i:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,m)}function C(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function N(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function O(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(C,this),this.reset(!0)}function G(t){if(t||""===t){var r=t[s];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,i=function e(){for(;++o<t.length;)if(a.call(t,o))return e.value=t[o],e.done=!1,e;return e.value=n,e.done=!0,e};return i.next=i}}throw new TypeError(e(t)+" is not iterable")}return x.prototype=j,i(L,"constructor",{value:j,configurable:!0}),i(j,"constructor",{value:x,configurable:!0}),x.displayName=f(j,u,"GeneratorFunction"),r.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===x||"GeneratorFunction"===(t.displayName||t.name))},r.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,j):(e.__proto__=j,f(e,u,"GeneratorFunction")),e.prototype=Object.create(L),e},r.awrap=function(e){return{__await:e}},S(P.prototype),f(P.prototype,l,(function(){return this})),r.AsyncIterator=P,r.async=function(e,t,n,o,a){void 0===a&&(a=Promise);var i=new P(h(e,t,n,o),a);return r.isGeneratorFunction(t)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},S(L),f(L,u,"Generator"),f(L,s,(function(){return this})),f(L,"toString",(function(){return"[object Generator]"})),r.keys=function(e){var t=Object(e),n=[];for(var r in t)n.push(r);return n.reverse(),function e(){for(;n.length;){var r=n.pop();if(r in t)return e.value=r,e.done=!1,e}return e.done=!0,e}},r.values=G,O.prototype={constructor:O,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=n,this.done=!1,this.delegate=null,this.method="next",this.arg=n,this.tryEntries.forEach(N),!e)for(var t in this)"t"===t.charAt(0)&&a.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=n)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function r(r,o){return c.type="throw",c.arg=e,t.next=r,o&&(t.method="next",t.arg=n),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],c=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var s=a.call(i,"catchLoc"),l=a.call(i,"finallyLoc");if(s&&l){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(s){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&a.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var o=r;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=t&&t<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=e,i.arg=t,o?(this.method="next",this.next=o.finallyLoc,m):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),m},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.finallyLoc===e)return this.complete(n.completion,n.afterLoc),N(n),m}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.tryLoc===e){var r=n.completion;if("throw"===r.type){var o=r.arg;N(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,r){return this.delegate={iterator:G(e),resultName:t,nextLoc:r},"next"===this.method&&(this.arg=n),m}},r}function n(e,t,n,r,o,a,i){try{var c=e[a](i),s=c.value}catch(l){return void n(l)}c.done?t(s):Promise.resolve(s).then(r,o)}function r(e){return function(){var t=this,r=arguments;return new Promise((function(o,a){var i=e.apply(t,r);function c(e){n(i,o,a,c,s,"next",e)}function s(e){n(i,o,a,c,s,"throw",e)}c(void 0)}))}}System.register(["./index-legacy52.js?v=1714377894636","./index-legacy53.js?v=1714377894636","./main-legacy.js?v=1714377894636","./index-legacy39.js?v=1714377894636","./index-legacy54.js?v=1714377894636","./index-legacy55.js?v=1714377894636","./index-legacy57.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./select-legacy.js?v=1714377894636","./index-legacy43.js?v=1714377894636","./index-legacy58.js?v=1714377894636","./index-legacy59.js?v=1714377894636","./index-legacy60.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./site.store-legacy.js?v=1714377894636","./site.popup-legacy.js?v=1714377894636","./software-legacy2.js?v=1714377894636","./site.method-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./progress-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./empty-legacy.js?v=1714377894636","./dropdown-legacy.js?v=1714377894636","./autocomplete-legacy.js?v=1714377894636","./index-legacy45.js?v=1714377894636","./check-legacy.js?v=1714377894636","./index-legacy38.js?v=1714377894636","./element-ui.common-legacy.js?v=1714377894636","./date-util-legacy.js?v=1714377894636","./vdom-legacy.js?v=1714377894636","./index-legacy62.js?v=1714377894636","./cascader-panel-legacy.js?v=1714377894636","./confirm-legacy.js?v=1714377894636","./config-legacy.js?v=1714377894636"],(function(e,n){"use strict";var o,a,i,c,s,l,u,f,h,d,p,v,y,g,m,b,x,j,w,_,k,L,S,P,T,E,C,N,O,G,V,M,B,D;return{setters:[function(e){o=e._},function(e){a=e._},function(e){i=e.o,c=e.n,s=e.a},function(e){l=e._},function(e){u=e._},function(e){f=e._},function(e){h=e._},function(e){d=e.q,p=e.s},null,function(e){v=e._},function(e){y=e._},function(e){g=e._},function(e){m=e._},function(e){b=e.e,x=e.b,j=e.v,w=e.h,_=e.j},function(e){k=e.g,L=e.p,S=e.i,P=e.q},function(e){T=e.q,E=e.t,C=e.N,N=e.c,O=e.f,G=e.g,V=e.i,M=e.v},function(e){B=e.o},function(e){D=e.s},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],execute:function(){var n=b({__name:"index",setup:function(e){var n,o,a=_().proxy,c=k(),s=c.refs.modulesTableParams,l=c.getModulesList,u=c.getModulesTypeList,f=x(!1),h=x([]),d=x("0"),p=x([]),v=x(!1),y=j({isRecurrence:!1,describe:{title:"",th:"",message:"",propsValue:""}}),g=[{content:"添加Node项目",active:!0,event:(o=r(t().mark((function e(){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:try{h.value.length?E():R()}catch(t){}case 1:case"end":return e.stop()}}),e)}))),function(){return o.apply(this,arguments)})},{content:"Node版本管理器",event:(n=r(t().mark((function e(){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:R();case 1:case"end":return e.stop()}}),e)}))),function(){return n.apply(this,arguments)})}],m=x([{label:"部署证书",value:"setCertificates",isRefBatch:!0},{label:"删除项目",value:"delNodeSite",isRefBatch:!0}]),b=T({changeTaskTopEvent:function(e){},changeStatusEvent:function(e){D.setProject(e,e.run?"stop":"start","nodejs",(function(){return l("nodejs")}))},setQuotaEvent:function(e){},openBackupEvent:function(e){},deleteEvent:function(e){D.delProject(e,{},"nodejs",!1)},setSiteTime:function(e){V(e,!1,"nodejs")},openPlugin:function(e){},openTotalFlow:function(e){},openSetting:function(e,t){try{h.value.length?M(e,t):R()}catch(n){}}}),F=function(){var e=r(t().mark((function e(){var n;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,L();case 3:if(n=e.sent,h.value=[],n.status){e.next=8;break}return v.value=!0,e.abrupt("return");case 8:n.data.forEach((function(e){e.setup&&h.value.push({label:e.version,value:e.version}),1===e.is_default&&(d.value=e.version)})),h.value.unshift({label:"未设置",value:"0"}),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(0);case 15:case"end":return e.stop()}}),e,null,[[0,12]])})));return function(){return e.apply(this,arguments)}}(),R=function(){var e=r(t().mark((function e(){var n,r;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,S({sName:"nodejs"});case 3:return n=e.sent,r=n.data,e.next=7,B({name:"nodejs",softData:r});case 7:e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0);case 12:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(){return e.apply(this,arguments)}}(),I=function(){var e=r(t().mark((function e(){var n;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,P({version:d.value});case 3:(n=e.sent).data.status?a.$message.success(n.data.data):a.$message.error(n.data.error_msg),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(){return e.apply(this,arguments)}}();return w(r(t().mark((function e(){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l("nodejs");case 2:return e.next=4,F();case 4:case"end":return e.stop()}}),e)})))),{__sfc:!0,vm:a,modulesTableParams:s,getModulesList:l,getModulesTypeList:u,hovering:f,nodeVersion:h,currentVersion:d,checkedList:p,maskLayer:v,batchConfig:y,tableBtnGroup:g,batchGroup:m,handleSelectionChange:function(e){p.value=e},handleBatch:function(e){switch(e){case"settingClass":G(p.value,"nodejs");break;case"delNodeSite":D.delProject({},p.value,"nodejs",!0);break;case"setCertificates":O(p.value)}},handleSerach:function(e){s.value.search=e,void 0===e&&(s.value.search=""),l("nodejs")},tableColumns:b,getNodeVersion:F,openVersionManger:R,changePage:function(e){s.value.p=e,l("nodejs")},changeSize:function(e){var t;s.value.limit=e;var n=JSON.parse(null!==(t=localStorage.getItem("siteOtherPageLimit"))&&void 0!==t?t:"{}");n.nodejs=e,localStorage.setItem("siteOtherPageLimit",JSON.stringify(n)),l("nodejs")},setVersion:I,nodeAddSiteDialog:E,NPSDialog:C,classSettingDialog:N,isRelease:i}}}),F=function(){var e=this,t=e._self._c,n=e._self._setupProxy;return t("div",{staticClass:"relative"},[t(m,{attrs:{visible:n.maskLayer,width:"32rem"}},[e._v(" 未安装Node版本管理器，"),t(s,{staticClass:"!text-[1.4rem]",on:{click:n.openVersionManger}},[e._v("点击安装")])],1),t(g,{scopedSlots:e._u([{key:"header-left",fn:function(){return[t("div",{staticClass:"flex items-center"},[t(y,{attrs:{group:n.tableBtnGroup}}),n.isRelease?e._e():t("div",{staticClass:"flex items-center mx-12x"},[t("span",{staticClass:"mr-4x"},[e._v("命令行版本")]),t(d,{staticClass:"w-[10rem]",on:{change:n.setVersion},model:{value:n.currentVersion,callback:function(e){n.currentVersion=e},expression:"currentVersion"}},e._l(n.nodeVersion,(function(e){return t(p,{key:e.value,attrs:{label:e.label,value:e.value}})})),1)],1),t(v,{staticClass:"ml-12x inline-block",attrs:{icon:"demand",iconClass:"text-1.6rem",content:"需求反馈"},on:{click:function(e){return n.NPSDialog()}}})],1)]},proxy:!0},{key:"header-right",fn:function(){return[n.isRelease?e._e():t("div",{staticClass:"flex items-center"},[t(d,{staticClass:"mr-8x w-[12rem]",on:{change:function(e){return n.getModulesList("nodejs")}},model:{value:n.modulesTableParams.type_id,callback:function(t){e.$set(n.modulesTableParams,"type_id",t)},expression:"modulesTableParams.type_id"}},[t("div",{staticClass:"max-h-[20rem] overflow-auto",class:{"no-hover":n.hovering}},e._l(n.modulesTableParams.typeList,(function(e,n){return t(p,{key:n,attrs:{label:e.name,value:e.id}})})),1),t("div",{staticClass:"classify-item",on:{click:function(e){return n.classSettingDialog("nodejs")},mouseover:function(e){n.hovering=!0},mouseout:function(e){n.hovering=!1}}},[e._v(" 分类设置 ")])])],1),t("div",{staticClass:"relative mr-8x"},[t(h,{attrs:{placeholder:e.$t("SitePhpModel.TableSearch"),width:"40rem"},on:{search:n.handleSerach,clear:n.handleSerach},model:{value:n.modulesTableParams.search,callback:function(t){e.$set(n.modulesTableParams,"search",t)},expression:"modulesTableParams.search"}})],1),t(f,{attrs:{refresh:function(){n.getModulesList("nodejs")}}}),t(u,{staticClass:"ml-8x",attrs:{name:"siteNodeTable",column:n.tableColumns}})]},proxy:!0},{key:"content",fn:function(){return[t(l,{directives:[{name:"loading",rawName:"v-loading",value:n.modulesTableParams.loading,expression:"modulesTableParams.loading"}],ref:"siteNodeTable",attrs:{"element-loading-text":"正在加载中...",data:n.modulesTableParams.list,column:n.tableColumns},on:{"selection-change":n.handleSelectionChange},scopedSlots:e._u([{key:"empty",fn:function(){return[t("div",{staticClass:"flex items-center justify-center"},[e._v(" 您的列表为空，您可以 "),t(s,{on:{click:function(e){return n.nodeAddSiteDialog()}}},[e._v("添加一个项目")])],1)]},proxy:!0}])})]},proxy:!0},{key:"footer-left",fn:function(){return[t(a,{attrs:{data:n.batchGroup,config:n.batchConfig,"batch-fn":function(){}},on:{"handle-batch":n.handleBatch}})]},proxy:!0},{key:"footer-right",fn:function(){return[t(o,{attrs:{total:n.modulesTableParams.total,"current-page":n.modulesTableParams.p,"page-size":n.modulesTableParams.limit},on:{"current-change":n.changePage,"size-change":n.changeSize}})]},proxy:!0}])})],1)};e("default",c(n,F,[],!1,null,"6c4c247e",null,null).exports)}}}))}();