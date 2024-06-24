!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return n};var r,n={},o=Object.prototype,i=o.hasOwnProperty,a=Object.defineProperty||function(t,e,r){t[e]=r.value},s="function"==typeof Symbol?Symbol:{},c=s.iterator||"@@iterator",l=s.asyncIterator||"@@asyncIterator",u=s.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(r){f=function(t,e,r){return t[e]=r}}function p(t,e,r,n){var o=e&&e.prototype instanceof x?e:x,i=Object.create(o.prototype),s=new G(n||[]);return a(i,"_invoke",{value:T(t,r,s)}),i}function h(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}n.wrap=p;var m="suspendedStart",v="suspendedYield",d="executing",y="completed",g={};function x(){}function b(){}function w(){}var _={};f(_,c,(function(){return this}));var L=Object.getPrototypeOf,C=L&&L(L(N([])));C&&C!==o&&i.call(C,c)&&(_=C);var j=w.prototype=x.prototype=Object.create(_);function E(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function k(e,r){function n(o,a,s,c){var l=h(e[o],e,a);if("throw"!==l.type){var u=l.arg,f=u.value;return f&&"object"==t(f)&&i.call(f,"__await")?r.resolve(f.__await).then((function(t){n("next",t,s,c)}),(function(t){n("throw",t,s,c)})):r.resolve(f).then((function(t){u.value=t,s(u)}),(function(t){return n("throw",t,s,c)}))}c(l.arg)}var o;a(this,"_invoke",{value:function(t,e){function i(){return new r((function(r,o){n(t,e,r,o)}))}return o=o?o.then(i,i):i()}})}function T(t,e,n){var o=m;return function(i,a){if(o===d)throw new Error("Generator is already running");if(o===y){if("throw"===i)throw a;return{value:r,done:!0}}for(n.method=i,n.arg=a;;){var s=n.delegate;if(s){var c=O(s,n);if(c){if(c===g)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===m)throw o=y,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var l=h(t,e,n);if("normal"===l.type){if(o=n.done?y:v,l.arg===g)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(o=y,n.method="throw",n.arg=l.arg)}}}function O(t,e){var n=e.method,o=t.iterator[n];if(o===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=r,O(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=h(o,t.iterator,e.arg);if("throw"===i.type)return e.method="throw",e.arg=i.arg,e.delegate=null,g;var a=i.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,g):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,g)}function P(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function S(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function G(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(P,this),this.reset(!0)}function N(e){if(e||""===e){var n=e[c];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function t(){for(;++o<e.length;)if(i.call(e,o))return t.value=e[o],t.done=!1,t;return t.value=r,t.done=!0,t};return a.next=a}}throw new TypeError(t(e)+" is not iterable")}return b.prototype=w,a(j,"constructor",{value:w,configurable:!0}),a(w,"constructor",{value:b,configurable:!0}),b.displayName=f(w,u,"GeneratorFunction"),n.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===b||"GeneratorFunction"===(e.displayName||e.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,w):(t.__proto__=w,f(t,u,"GeneratorFunction")),t.prototype=Object.create(j),t},n.awrap=function(t){return{__await:t}},E(k.prototype),f(k.prototype,l,(function(){return this})),n.AsyncIterator=k,n.async=function(t,e,r,o,i){void 0===i&&(i=Promise);var a=new k(p(t,e,r,o),i);return n.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},E(j),f(j,u,"Generator"),f(j,c,(function(){return this})),f(j,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},n.values=N,G.prototype={constructor:G,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(S),!t)for(var e in this)"t"===e.charAt(0)&&i.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,o){return s.type="throw",s.arg=t,e.next=n,o&&(e.method="next",e.arg=r),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],s=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var c=i.call(a,"catchLoc"),l=i.call(a,"finallyLoc");if(c&&l){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return n(a.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&i.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),S(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;S(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:N(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),g}},n}function r(t,e,r,n,o,i,a){try{var s=t[i](a),c=s.value}catch(l){return void r(l)}s.done?e(c):Promise.resolve(c).then(n,o)}function n(t){return function(){var e=this,n=arguments;return new Promise((function(o,i){var a=t.apply(e,n);function s(t){r(a,o,i,s,c,"next",t)}function c(t){r(a,o,i,s,c,"throw",t)}s(void 0)}))}}System.register(["./main-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636"],(function(t,r){"use strict";var o,i,a,s,c,l,u,f,p,h;return{setters:[function(t){o=t.f,i=t.bT,a=t.n,s=t.D,c=t.q},function(t){l=t.e,u=t.b,f=t.c,p=t.h,h=t.j},null,null,null,null,null,null,null],execute:function(){var r=l({__name:"HomeApplyBeta",props:{compData:{default:function(){return{}}}},setup:function(t,r){var a=r.expose,s=t,c=s.compData.updateVersion,l=h().proxy,m=u(!1),v=u(5),d=u(""),y=u('<span class="text-danger">1、注意，请不要在正式商用网站及自己生产环境的面板申请测试版。</span><br>\n2、所有新功能做完内部初审后都会第一时间向所有测试版用户推送。<br>\n3、测试版存在诸多小BUG，如遇到可以直接通过论坛或QQ联系我们。<br>\n4、更新测试版或在论坛提供BUG可获得宝塔币，宝塔币可用于兑换礼品。'),g=u(!1),x=u([]),b=null,w=f((function(){return v.value>0})),_=function(){v.value=5,b=setInterval((function(){v.value--,0==v.value&&L()}),1e3)},L=function(){b&&clearInterval(b)},C=function(){var t=n(e().mark((function t(){var r,n;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,g.value=!0,t.next=4,i();case 4:r=t.sent,n=r.data,d.value=n.beta_ps,n.list.forEach((function(t){return x.value.push(t)})),g.value=!1,t.next=14;break;case 11:t.prev=11,t.t0=t.catch(0);case 14:case"end":return t.stop()}}),t,null,[[0,11]])})));return function(){return t.apply(this,arguments)}}(),j=function(){L(),l.$emit("close")},E=function(){var t=n(e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(m.value){t.next=2;break}return t.abrupt("return",l.$message.warn("请查看并勾选“申请测试版须知”"));case 2:return t.next=4,c(!0);case 4:l.$emit("close");case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return a({onCancel:j,onConfirm:E}),p(n(e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,C();case 2:_();case 3:case"end":return t.stop()}}),t)})))),{__sfc:!0,props:s,updateVersion:c,vm:l,checked:m,time:v,tips:d,tips1:y,loading:g,logList:x,timer:b,showTips:w,initTimer:_,clearTimer:L,initLog:C,onCancel:j,onConfirm:E,formatTime:o}}});t("default",a(r,(function(){var t=this,e=t._self._c,r=t._self._setupProxy;return e("div",{directives:[{name:"loading",rawName:"v-loading",value:r.loading,expression:"loading"}],staticClass:"flex flex-col px-20x bg-[#E7F7EA] beta-bg relative rounded-4x"},[e("div",{staticClass:"leading-[4rem] text-white text-[1.4rem]"},[t._v("申请Linux测试版")]),e("div",{staticClass:"bg-white mb-[2.8rem] rounded-[6px] card-shadow px-[4.6rem] py-[4rem] beta-title-bg"},[t._m(0),e("div",{staticClass:"text-[1.4rem] leading-[3.6rem] text-[#555]",domProps:{innerHTML:t._s(r.tips1)}})]),e("div",{staticClass:"beta-con h-[6.8rem] w-[45.4rem] absolute ml-[50px] mt-[30.6rem]"}),e("div",{staticClass:"bg-white mb-20x rounded-[6px] card-shadow px-[4.6rem] py-[2.6rem] pb-[3.6rem]"},[t._m(1),r.logList.length?e("div",{staticClass:"flex flex-col bg-[#f6f6f6] p-8 rounded-4x mb-[1.2rem]"},[e("div",{staticClass:"flex text-[1.4rem] pl-8x text-[#555]"},[e("div",[e("span",[t._v("最新测试版：")]),e("span",{staticClass:"text-primary"},[t._v(t._s(r.logList[0].version))])]),e("div",{staticClass:"ml-16x"},[e("span",[t._v("更新时间：")]),e("span",[t._v(t._s(r.formatTime(r.logList[0].uptime,"yyyy/MM/dd")))])])]),e("div",{staticClass:"border-[#e6e6e6] border-b-1 my-20x flex-1"}),e("div",{staticClass:"flex-1 text-[1.3rem] max-h-[13.6rem] w-[100%] overflow-auto leading-[2.8rem] text-[#666]",domProps:{innerHTML:t._s(r.logList[0].upmsg)}})]):t._e(),e("div",{staticClass:"flex items-center mb-[3.6rem]"},[e(s,{attrs:{disabled:r.showTips},model:{value:r.checked,callback:function(t){r.checked=t},expression:"checked"}},[e("div",{staticClass:"text-[1.3rem] text-[#666]"},[e("span",[t._v(t._s(t.$t("HomeApplyBeta.Viewed"))+"“")]),e("b",{staticClass:"text-[#555]"},[t._v("《"+t._s(t.$t("HomeApplyBeta.Instructions"))+"》")]),e("span",[t._v("”")])])]),r.showTips?e("span",{staticClass:"ml-4 text-[1.3rem] leading-[1.4] text-danger"},[t._v(" "+t._s(t.$t("HomeApplyBeta.ViewRemainingTime",{time:r.time}))+" ")]):t._e()],1),e("div",{staticClass:"text-center"},[e(c,{staticClass:"mr-[6rem] w-[9rem] h-[3.4rem] text-[1.4rem] rounded-[5rem]",attrs:{type:"cancel"},on:{click:r.onCancel}},[t._v(" 取消 ")]),e(c,{staticClass:"rounded-[5rem] w-[10.4rem] h-[3.4rem] text-[1.4rem]",attrs:{type:"primary",disabled:r.showTips},on:{click:r.onConfirm}},[t._v(" 立即更新 ")])],1)])])}),[function(){var t=this._self._c;return this._self._setupProxy,t("div",{staticClass:"flex justify-center mb-[2.6rem]"},[t("div",{staticClass:"beta-title w-[35.4rem] h-[3.6rem]"})])},function(){var t=this._self._c;return this._self._setupProxy,t("div",{staticClass:"flex justify-center mb-[2.6rem]"},[t("div",{staticClass:"beta-log-title w-[37rem] h-[3.6rem]"})])}],!1,null,null,null,null).exports)}}}))}();