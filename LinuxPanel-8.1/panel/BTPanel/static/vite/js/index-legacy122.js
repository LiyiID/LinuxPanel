!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return r};var n,r={},o=Object.prototype,i=o.hasOwnProperty,a=Object.defineProperty||function(t,e,n){t[e]=n.value},l="function"==typeof Symbol?Symbol:{},s=l.iterator||"@@iterator",c=l.asyncIterator||"@@asyncIterator",u=l.toStringTag||"@@toStringTag";function f(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(n){f=function(t,e,n){return t[e]=n}}function p(t,e,n,r){var o=e&&e.prototype instanceof x?e:x,i=Object.create(o.prototype),l=new O(r||[]);return a(i,"_invoke",{value:k(t,n,l)}),i}function v(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}r.wrap=p;var h="suspendedStart",y="suspendedYield",m="executing",d="completed",g={};function x(){}function b(){}function w(){}var _={};f(_,s,(function(){return this}));var L=Object.getPrototypeOf,j=L&&L(L(N([])));j&&j!==o&&i.call(j,s)&&(_=j);var S=w.prototype=x.prototype=Object.create(_);function C(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function E(e,n){function r(o,a,l,s){var c=v(e[o],e,a);if("throw"!==c.type){var u=c.arg,f=u.value;return f&&"object"==t(f)&&i.call(f,"__await")?n.resolve(f.__await).then((function(t){r("next",t,l,s)}),(function(t){r("throw",t,l,s)})):n.resolve(f).then((function(t){u.value=t,l(u)}),(function(t){return r("throw",t,l,s)}))}s(c.arg)}var o;a(this,"_invoke",{value:function(t,e){function i(){return new n((function(n,o){r(t,e,n,o)}))}return o=o?o.then(i,i):i()}})}function k(t,e,r){var o=h;return function(i,a){if(o===m)throw new Error("Generator is already running");if(o===d){if("throw"===i)throw a;return{value:n,done:!0}}for(r.method=i,r.arg=a;;){var l=r.delegate;if(l){var s=I(l,r);if(s){if(s===g)continue;return s}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(o===h)throw o=d,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o=m;var c=v(t,e,r);if("normal"===c.type){if(o=r.done?d:y,c.arg===g)continue;return{value:c.arg,done:r.done}}"throw"===c.type&&(o=d,r.method="throw",r.arg=c.arg)}}}function I(t,e){var r=e.method,o=t.iterator[r];if(o===n)return e.delegate=null,"throw"===r&&t.iterator.return&&(e.method="return",e.arg=n,I(t,e),"throw"===e.method)||"return"!==r&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+r+"' method")),g;var i=v(o,t.iterator,e.arg);if("throw"===i.type)return e.method="throw",e.arg=i.arg,e.delegate=null,g;var a=i.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=n),e.delegate=null,g):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,g)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function A(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function O(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function N(e){if(e||""===e){var r=e[s];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function t(){for(;++o<e.length;)if(i.call(e,o))return t.value=e[o],t.done=!1,t;return t.value=n,t.done=!0,t};return a.next=a}}throw new TypeError(t(e)+" is not iterable")}return b.prototype=w,a(S,"constructor",{value:w,configurable:!0}),a(w,"constructor",{value:b,configurable:!0}),b.displayName=f(w,u,"GeneratorFunction"),r.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===b||"GeneratorFunction"===(e.displayName||e.name))},r.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,w):(t.__proto__=w,f(t,u,"GeneratorFunction")),t.prototype=Object.create(S),t},r.awrap=function(t){return{__await:t}},C(E.prototype),f(E.prototype,c,(function(){return this})),r.AsyncIterator=E,r.async=function(t,e,n,o,i){void 0===i&&(i=Promise);var a=new E(p(t,e,n,o),i);return r.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},C(S),f(S,u,"Generator"),f(S,s,(function(){return this})),f(S,"toString",(function(){return"[object Generator]"})),r.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},r.values=N,O.prototype={constructor:O,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=n,this.done=!1,this.delegate=null,this.method="next",this.arg=n,this.tryEntries.forEach(A),!t)for(var e in this)"t"===e.charAt(0)&&i.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=n)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(r,o){return l.type="throw",l.arg=t,e.next=r,o&&(e.method="next",e.arg=n),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],l=a.completion;if("root"===a.tryLoc)return r("end");if(a.tryLoc<=this.prev){var s=i.call(a,"catchLoc"),c=i.call(a,"finallyLoc");if(s&&c){if(this.prev<a.catchLoc)return r(a.catchLoc,!0);if(this.prev<a.finallyLoc)return r(a.finallyLoc)}else if(s){if(this.prev<a.catchLoc)return r(a.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return r(a.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&i.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var o=r;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),A(n),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;A(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:N(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=n),g}},r}function n(t,e,n,r,o,i,a){try{var l=t[i](a),s=l.value}catch(c){return void n(c)}l.done?e(s):Promise.resolve(s).then(r,o)}function r(t){return function(){var e=this,r=arguments;return new Promise((function(o,i){var a=t.apply(e,r);function l(t){n(a,o,i,l,s,"next",t)}function s(t){n(a,o,i,l,s,"throw",t)}l(void 0)}))}}System.register(["./main-legacy.js?v=1714377894636","./index-legacy43.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./tabs-legacy.js?v=1714377894636","./index-legacy77.js?v=1714377894636","./alert-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./site.popup-legacy.js?v=1714377894636","./site.store-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./index-legacy42.js?v=1714377894636","./index-legacy38.js?v=1714377894636","./index-legacy45.js?v=1714377894636","./element-ui.common-legacy.js?v=1714377894636","./date-util-legacy.js?v=1714377894636","./vdom-legacy.js?v=1714377894636","./index-legacy62.js?v=1714377894636","./cascader-panel-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636"],(function(t,n){"use strict";var o,i,a,l,s,c,u,f,p,v,h,y,m,d,g,x,b,w,_,L,j,S;return{setters:[function(t){o=t.y,i=t.n,a=t.q,l=t.a},function(t){s=t._},function(t){c=t.a9,u=t.u},null,function(t){f=t._},null,function(t){p=t._},function(t){v=t.e,h=t.c,y=t.b,m=t.f,d=t.L,g=t.h,x=t.j},function(t){b=t.a7,w=t.a5,_=t.a8,L=t.a9},function(t){j=t.g,S=t.cs},null,null,null,null,null,null,null,null,null,null,null,null,null,null],execute:function(){var C=v({__name:"index",props:{compData:{default:{row:function(){}}}},setup:function(t){var i=t,a=x().proxy,l=j(),s=l.refs,c=s.sslInfo,u=s.sslTabsActive,f=s.sslAlertState,v=s.siteTabActiveList,C=s.siteInfo,E=s.letApplyInfo,k=l.getSslInfoConfig,I=l.renewalCert,T=l.renewalLetCert,A=h((function(){return'当前证书 -<span class="'.concat(c.value.isStart?"text-primary":"text-danger",'">[').concat(c.value.isStart?"已部署SSL":"未部署SSL","]</span>")})),O=y(!1),N=y("");m((function(){return c.value}),(function(t){t.isStart?u.value="currentCertInfo":u.value="busSslList"}));var P=function(){var t,e,n,r=null!==(t=null===(e=C.value.project_type)||void 0===e?void 0:e.toLowerCase())&&void 0!==t?t:"";N.value=r,null!==(n=C.value.project_config)&&void 0!==n&&n.bind_extranet&&(O.value=!!C.value.project_config.bind_extranet);-1!==["php","html","phpasync","nginx","proxy"].indexOf(N.value)&&(O.value=!0),O.value&&z()};d("mountEvent",P);var F=y([{title:A.value,customLabel:!0,name:"currentCertInfo",component:function(){return p((function(){return n.import("./CurrentCertInfo-legacy.js?v=1714377894636")}),void 0,n.meta.url)}},{title:"商用SSL证书",name:"busSslList",component:function(){return p((function(){return n.import("./BusSslList-legacy.js?v=1714377894636")}),void 0,n.meta.url)}},{title:"测试证书",name:"trustAsiaList",component:function(){return p((function(){return n.import("./TrustAsiaList-legacy.js?v=1714377894636")}),void 0,n.meta.url)}},{title:"Let's Encrypt",name:"letsEncryptList",component:function(){return p((function(){return n.import("./LetsEncryptList-legacy.js?v=1714377894636")}),void 0,n.meta.url)}},{title:"证书夹",name:"certFolderList",component:function(){return p((function(){return n.import("./CertFolderList-legacy.js?v=1714377894636")}),void 0,n.meta.url)}}]),G=function(){var t=r(e().mark((function t(){var n,r,o;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(3!==c.value.type){t.next=4;break}I(c.value.oid,c.value.type),t.next=17;break;case 4:if(32!==c.value.length||-1!==c.value.indexOf("/")){t.next=12;break}return t.next=7,w();case 7:n=t.sent,T(c.value.index),n.close(),t.next=17;break;case 12:return t.next=14,S({siteName:C.value.name,pem_file:c.value.index});case 14:r=t.sent,o=r.data,_(o);case 17:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),z=function(){var t=r(e().mark((function t(){var n;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=a.$load("正在获取站点证书部署信息，请稍候..."),t.prev=1,t.next=4,k();case 4:n.close(),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(1);case 10:return t.prev=10,n.close(),t.finish(10);case 13:case"end":return t.stop()}}),t,null,[[1,7,10,13]])})));return function(){return t.apply(this,arguments)}}();return m((function(){return E.value.verifyDialog}),(function(t){t&&b()})),g((function(){P()})),{__sfc:!0,props:i,vm:a,sslInfo:c,sslTabsActive:u,sslAlertState:f,siteTabActiveList:v,siteInfo:C,letApplyInfo:E,getSslInfoConfig:k,renewalCert:I,renewalLetCert:T,currentCertTitle:A,isBindExtranet:O,siteType:N,mountEvent:P,tabComponent:F,handleClickTab:function(t){u.value=t},renewalCurrentCert:G,applyBusSsl:function(){u.value="busSslList",L()},openNps:function(){o({title:"SSL证书需求反馈收集",type:28,isNoRate:!0,softName:"1",isCard:!1,id:993})},jumpPath:function(){v.value.moduleSettingsAct="mapping",v.value.isJump=!0},init:z}}}),E=function(){var t=this,e=t._self._c,n=t._self._setupProxy;return e("div",{staticClass:"relative h-full"},[n.isBindExtranet?e("div",{staticClass:"relative"},[n.sslAlertState?e("div",{staticClass:"mb-16x"},[e(c,{staticClass:"mb-16x",attrs:{type:"error",closable:!1},scopedSlots:t._u([{key:"title",fn:function(){return[e("div",{staticClass:"flex items-center justify-between w-full"},[n.sslInfo.isStart?t._e():[e("div",{staticClass:"mr-32x text-[1.2rem]"},[t._v(" 温馨提示：当前站点未开启SSL证书访问，站点访问可能存在风险。 ")]),e(a,{attrs:{size:"mini"},on:{click:n.applyBusSsl}},[t._v("申请证书")])],n.sslInfo.isSupportRenewal&&n.sslInfo.isStart?[e("div",{staticClass:"mr-32x text-[1.2rem] flex items-center"},[t._v(" 温馨提示：当前[ "),e("span",{staticClass:"flex max-w-[20rem] truncate",attrs:{title:n.sslInfo.dns.join("、")}},[t._v(" "+t._s(n.sslInfo.dns.join("、"))+" ")]),t._v(" ]证书"+t._s(n.sslInfo.endtime<0?"已过期":"即将过期")+" ")]),e(a,{attrs:{size:"mini"},on:{click:n.renewalCurrentCert}},[t._v(" 续签证书 ")])]:t._e(),e(s,{staticClass:"absolute top-1.2rem z-10 right-1.2rem",attrs:{icon:"demand",iconClass:"text-1.6rem",content:"需求反馈"},on:{click:n.openNps}})],2)]},proxy:!0}],null,!1,3777009194)})],1):t._e(),e(f,{staticClass:"w-full h-full",attrs:{type:"navtwo"},on:{change:n.handleClickTab},model:{value:n.sslTabsActive,callback:function(t){n.sslTabsActive=t},expression:"sslTabsActive"}},t._l(n.tabComponent,(function(r,o){return e(u,{key:o,staticClass:"h-0",attrs:{name:r.name,lazy:!0,label:r.title},scopedSlots:t._u([{key:"label",fn:function(){return[0===o?e("div",{domProps:{innerHTML:t._s(n.currentCertTitle)}}):"busSslList"===r.name?e("div",{staticClass:"z-9999"},[e("span",{staticClass:"recommend-icon"}),e("span",[t._v(" "+t._s(r.title)+" ")])]):e("div",[t._v(t._s(r.title))])]},proxy:!0}],null,!0)},[e(r.component,{tag:"component",attrs:{compData:t.compData}})],1)})),1),n.sslAlertState?t._e():e(s,{staticClass:"absolute top-1rem z-10 right-0",attrs:{icon:"demand",iconClass:"text-1.6rem",content:"需求反馈"},on:{click:n.openNps}})],1):e("div",{staticClass:"bg-[#7F7F7F] flex items-center justify-center h-full"},[e("div",{staticClass:"bg-white px-48x py-16x text-[#333]"},[t._v(" 请开启 "),e(l,{on:{click:n.jumpPath}},[t._v("外网映射")]),t._v(" 后查看配置信息 ")],1)])])};t("default",i(C,E,[],!1,null,"f25b6654",null,null).exports)}}}))}();