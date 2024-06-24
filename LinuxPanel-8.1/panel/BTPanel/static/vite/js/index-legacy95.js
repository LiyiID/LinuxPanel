!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return r};var n,r={},o=Object.prototype,i=o.hasOwnProperty,a=Object.defineProperty||function(t,e,n){t[e]=n.value},c="function"==typeof Symbol?Symbol:{},u=c.iterator||"@@iterator",l=c.asyncIterator||"@@asyncIterator",s=c.toStringTag||"@@toStringTag";function f(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(n){f=function(t,e,n){return t[e]=n}}function h(t,e,n,r){var o=e&&e.prototype instanceof w?e:w,i=Object.create(o.prototype),c=new T(r||[]);return a(i,"_invoke",{value:S(t,n,c)}),i}function p(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}r.wrap=h;var y="suspendedStart",v="suspendedYield",d="executing",m="completed",g={};function w(){}function b(){}function x(){}var j={};f(j,u,(function(){return this}));var L=Object.getPrototypeOf,_=L&&L(L(A([])));_&&_!==o&&i.call(_,u)&&(j=_);var E=x.prototype=w.prototype=Object.create(j);function P(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function I(e,n){function r(o,a,c,u){var l=p(e[o],e,a);if("throw"!==l.type){var s=l.arg,f=s.value;return f&&"object"==t(f)&&i.call(f,"__await")?n.resolve(f.__await).then((function(t){r("next",t,c,u)}),(function(t){r("throw",t,c,u)})):n.resolve(f).then((function(t){s.value=t,c(s)}),(function(t){return r("throw",t,c,u)}))}u(l.arg)}var o;a(this,"_invoke",{value:function(t,e){function i(){return new n((function(n,o){r(t,e,n,o)}))}return o=o?o.then(i,i):i()}})}function S(t,e,r){var o=y;return function(i,a){if(o===d)throw new Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:n,done:!0}}for(r.method=i,r.arg=a;;){var c=r.delegate;if(c){var u=O(c,r);if(u){if(u===g)continue;return u}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(o===y)throw o=m,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o=d;var l=p(t,e,r);if("normal"===l.type){if(o=r.done?m:v,l.arg===g)continue;return{value:l.arg,done:r.done}}"throw"===l.type&&(o=m,r.method="throw",r.arg=l.arg)}}}function O(t,e){var r=e.method,o=t.iterator[r];if(o===n)return e.delegate=null,"throw"===r&&t.iterator.return&&(e.method="return",e.arg=n,O(t,e),"throw"===e.method)||"return"!==r&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+r+"' method")),g;var i=p(o,t.iterator,e.arg);if("throw"===i.type)return e.method="throw",e.arg=i.arg,e.delegate=null,g;var a=i.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=n),e.delegate=null,g):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,g)}function k(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function N(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function T(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(k,this),this.reset(!0)}function A(e){if(e||""===e){var r=e[u];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function t(){for(;++o<e.length;)if(i.call(e,o))return t.value=e[o],t.done=!1,t;return t.value=n,t.done=!0,t};return a.next=a}}throw new TypeError(t(e)+" is not iterable")}return b.prototype=x,a(E,"constructor",{value:x,configurable:!0}),a(x,"constructor",{value:b,configurable:!0}),b.displayName=f(x,s,"GeneratorFunction"),r.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===b||"GeneratorFunction"===(e.displayName||e.name))},r.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,s,"GeneratorFunction")),t.prototype=Object.create(E),t},r.awrap=function(t){return{__await:t}},P(I.prototype),f(I.prototype,l,(function(){return this})),r.AsyncIterator=I,r.async=function(t,e,n,o,i){void 0===i&&(i=Promise);var a=new I(h(t,e,n,o),i);return r.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},P(E),f(E,s,"Generator"),f(E,u,(function(){return this})),f(E,"toString",(function(){return"[object Generator]"})),r.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},r.values=A,T.prototype={constructor:T,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=n,this.done=!1,this.delegate=null,this.method="next",this.arg=n,this.tryEntries.forEach(N),!t)for(var e in this)"t"===e.charAt(0)&&i.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=n)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(r,o){return c.type="throw",c.arg=t,e.next=r,o&&(e.method="next",e.arg=n),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],c=a.completion;if("root"===a.tryLoc)return r("end");if(a.tryLoc<=this.prev){var u=i.call(a,"catchLoc"),l=i.call(a,"finallyLoc");if(u&&l){if(this.prev<a.catchLoc)return r(a.catchLoc,!0);if(this.prev<a.finallyLoc)return r(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return r(a.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return r(a.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&i.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var o=r;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),N(n),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;N(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:A(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=n),g}},r}function n(t,e,n,r,o,i,a){try{var c=t[i](a),u=c.value}catch(l){return void n(l)}c.done?e(u):Promise.resolve(u).then(r,o)}System.register(["./index-legacy51.js?v=1714377894636","./index-legacy77.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./firewall.store-legacy.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./tabs-legacy.js?v=1714377894636","./index-legacy42.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636"],(function(t,r){"use strict";var o,i,a,c,u,l,s,f,h,p,y,v;return{setters:[function(t){o=t._},function(t){i=t._},function(t){a=t._},function(t){c=t.e,u=t.b,l=t.v,s=t.f,f=t.h,h=t.j},function(t){p=t.ao,y=t.n},function(t){v=t.getFirewallStore},null,null,null,null,null,null,null,null,null],execute:function(){var d=c({__name:"index",setup:function(t){var o=v().refs.phpChildrenTabActive,i=h().proxy,c=u(!1),y=u({}),d=l({title:"PHP网站安全-功能介绍",ps:"基于PHP内核的监控工具，实时监控网站木马、漏洞等其他入侵行为，发现木马支持自动隔离，（不支持32位系统和arm平台和PHP5.2）",source:112,desc:["PHP内核实时监控","实时监控网站木马、漏洞","支持自动隔离"],tabImgs:[],isInstall:!1,productSrc:"https://www.bt.cn/bbs/thread-109515-1-1.html",pluginInfo:{}}),m=u("home"),g=u([{title:"首页",type:"home",component:function(){return a((function(){return r.import("./InitHome-legacy.js?v=1714377894636")}),void 0,r.meta.url)}},{title:"网站管理",type:"siteList",component:function(){return a((function(){return r.import("./InitSiteList-legacy.js?v=1714377894636")}),void 0,r.meta.url)}},{title:"木马隔离箱",type:"isolationList",component:function(){return a((function(){return r.import("./InitIsolationList-legacy.js?v=1714377894636")}),void 0,r.meta.url)}},{title:"白名单",type:"whiteList",component:function(){return a((function(){return r.import("./InitWhiteList-legacy.js?v=1714377894636")}),void 0,r.meta.url)}},{title:"PHP模块",type:"phpList",component:function(){return a((function(){return r.import("./InitPhpList-legacy.js?v=1714377894636")}),void 0,r.meta.url)}},{title:"告警设置",type:"setting",component:function(){return a((function(){return r.import("./InitSet-legacy.js?v=1714377894636")}),void 0,r.meta.url)}}]),w=function(){var t,r=(t=e().mark((function t(){var n,r;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,c.value=!0,t.next=4,p({sName:"security_notice"});case 4:n=t.sent,r=n.data,d.pluginInfo=r,y.value=r,d.isInstall=!y.value.setup&&y.value.endtime>0,y.value.introduction.split(";").forEach((function(t,e){d.tabImgs.push({title:t.split("|")[0],imgSrc:"https://www.bt.cn/Public/new/plugin/introduce/firewall/php_site_".concat(t.split("|")[1])})})),c.value=!1,t.next=17;break;case 14:t.prev=14,t.t0=t.catch(0);case 17:case"end":return t.stop()}}),t,null,[[0,14]])})),function(){var e=this,r=arguments;return new Promise((function(o,i){var a=t.apply(e,r);function c(t){n(a,o,i,c,u,"next",t)}function u(t){n(a,o,i,c,u,"throw",t)}c(void 0)}))});return function(){return r.apply(this,arguments)}}();return s(o,(function(t){m.value=t})),f((function(){o.value?m.value=o.value:m.value="home",w()})),{__sfc:!0,phpChildrenTabActive:o,vm:i,loading:c,pluginInfo:y,productData:d,tabActive:m,tabComponent:g,cutTabs:function(t){var e=t.name;t.$children[0]&&t.$children[0].init(),o.value=e},getFind:w}}});t("default",y(d,(function(){var t=this._self._c,e=this._self._setupProxy;return t("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}]},[e.pluginInfo.setup&&e.pluginInfo.endtime>0?t(i,{attrs:{type:"navtwo",config:e.tabComponent},on:{"tab-click":e.cutTabs},model:{value:e.tabActive,callback:function(t){e.tabActive=t},expression:"tabActive"}}):t(o,{staticClass:"px-[20%] my-[8rem]",attrs:{data:e.productData}})],1)}),[],!1,null,null,null,null).exports)}}}))}();