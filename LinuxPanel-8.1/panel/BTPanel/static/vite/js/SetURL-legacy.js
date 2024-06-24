!function(){function t(r){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(r)}function r(t){return function(t){if(Array.isArray(t))return e(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,r){if(!t)return;if("string"==typeof t)return e(t,r);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return e(t,r)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function e(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=new Array(r);e<r;e++)n[e]=t[e];return n}function n(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */n=function(){return e};var r,e={},o=Object.prototype,a=o.hasOwnProperty,i=Object.defineProperty||function(t,r,e){t[r]=e.value},c="function"==typeof Symbol?Symbol:{},l=c.iterator||"@@iterator",s=c.asyncIterator||"@@asyncIterator",u=c.toStringTag||"@@toStringTag";function f(t,r,e){return Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}),t[r]}try{f({},"")}catch(r){f=function(t,r,e){return t[r]=e}}function h(t,r,e,n){var o=r&&r.prototype instanceof b?r:b,a=Object.create(o.prototype),c=new C(n||[]);return i(a,"_invoke",{value:O(t,e,c)}),a}function p(t,r,e){try{return{type:"normal",arg:t.call(r,e)}}catch(t){return{type:"throw",arg:t}}}e.wrap=h;var y="suspendedStart",v="suspendedYield",m="executing",g="completed",d={};function b(){}function w(){}function _(){}var x={};f(x,l,(function(){return this}));var j=Object.getPrototypeOf,L=j&&j(j(N([])));L&&L!==o&&a.call(L,l)&&(x=L);var E=_.prototype=b.prototype=Object.create(x);function S(t){["next","throw","return"].forEach((function(r){f(t,r,(function(t){return this._invoke(r,t)}))}))}function k(r,e){function n(o,i,c,l){var s=p(r[o],r,i);if("throw"!==s.type){var u=s.arg,f=u.value;return f&&"object"==t(f)&&a.call(f,"__await")?e.resolve(f.__await).then((function(t){n("next",t,c,l)}),(function(t){n("throw",t,c,l)})):e.resolve(f).then((function(t){u.value=t,c(u)}),(function(t){return n("throw",t,c,l)}))}l(s.arg)}var o;i(this,"_invoke",{value:function(t,r){function a(){return new e((function(e,o){n(t,r,e,o)}))}return o=o?o.then(a,a):a()}})}function O(t,e,n){var o=y;return function(a,i){if(o===m)throw new Error("Generator is already running");if(o===g){if("throw"===a)throw i;return{value:r,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var l=P(c,n);if(l){if(l===d)continue;return l}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=g,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=m;var s=p(t,e,n);if("normal"===s.type){if(o=n.done?g:v,s.arg===d)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=g,n.method="throw",n.arg=s.arg)}}}function P(t,e){var n=e.method,o=t.iterator[n];if(o===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=r,P(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),d;var a=p(o,t.iterator,e.arg);if("throw"===a.type)return e.method="throw",e.arg=a.arg,e.delegate=null,d;var i=a.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,d):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,d)}function F(t){var r={tryLoc:t[0]};1 in t&&(r.catchLoc=t[1]),2 in t&&(r.finallyLoc=t[2],r.afterLoc=t[3]),this.tryEntries.push(r)}function A(t){var r=t.completion||{};r.type="normal",delete r.arg,t.completion=r}function C(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(F,this),this.reset(!0)}function N(e){if(e||""===e){var n=e[l];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function t(){for(;++o<e.length;)if(a.call(e,o))return t.value=e[o],t.done=!1,t;return t.value=r,t.done=!0,t};return i.next=i}}throw new TypeError(t(e)+" is not iterable")}return w.prototype=_,i(E,"constructor",{value:_,configurable:!0}),i(_,"constructor",{value:w,configurable:!0}),w.displayName=f(_,u,"GeneratorFunction"),e.isGeneratorFunction=function(t){var r="function"==typeof t&&t.constructor;return!!r&&(r===w||"GeneratorFunction"===(r.displayName||r.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,_):(t.__proto__=_,f(t,u,"GeneratorFunction")),t.prototype=Object.create(E),t},e.awrap=function(t){return{__await:t}},S(k.prototype),f(k.prototype,s,(function(){return this})),e.AsyncIterator=k,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new k(h(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},S(E),f(E,u,"Generator"),f(E,l,(function(){return this})),f(E,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var r=Object(t),e=[];for(var n in r)e.push(n);return e.reverse(),function t(){for(;e.length;){var n=e.pop();if(n in r)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=N,C.prototype={constructor:C,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(A),!t)for(var e in this)"t"===e.charAt(0)&&a.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,o){return c.type="throw",c.arg=t,e.next=n,o&&(e.method="next",e.arg=r),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],c=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var l=a.call(i,"catchLoc"),s=a.call(i,"finallyLoc");if(l&&s){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(l){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,r){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc<=this.prev&&a.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=r&&r<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=t,i.arg=r,o?(this.method="next",this.next=o.finallyLoc,d):this.complete(i)},complete:function(t,r){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&r&&(this.next=r),d},finish:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.finallyLoc===t)return this.complete(e.completion,e.afterLoc),A(e),d}},catch:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.tryLoc===t){var n=e.completion;if("throw"===n.type){var o=n.arg;A(e)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:N(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),d}},e}function o(t,r,e,n,o,a,i){try{var c=t[a](i),l=c.value}catch(s){return void e(s)}c.done?r(l):Promise.resolve(l).then(n,o)}function a(t){return function(){var r=this,e=arguments;return new Promise((function(n,a){var i=t.apply(r,e);function c(t){o(i,n,a,c,l,"next",t)}function l(t){o(i,n,a,c,l,"throw",t)}c(void 0)}))}}System.register(["./element-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./select-legacy.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./form-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./docker.api-legacy.js?v=1714377894636","./docker.store-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636"],(function(t,e){"use strict";var o,i,c,l,s,u,f,h,p,y,v,m,g,d,b;return{setters:[function(t){o=t.w,i=t.x,c=t.q,l=t.s},function(t){s=t.n},null,null,null,function(t){u=t.e,f=t.A,h=t.v,p=t.b,y=t.h,v=t.j},function(t){m=t.ai,g=t.J,d=t.aj},function(t){b=t.u},null,null,null,null,null,null,null],execute:function(){var e=u({__name:"SetURL",props:{compData:{default:function(){return{}}}},setup:function(t,e){var o=e.expose,i=t,c=v().proxy,l=b(),s=f(l).settingData,u=l.getSet,w=h({registry_mirrors_address:""}),_=p([]),x=function(){var t=a(n().mark((function t(r){var e,o,a;return n().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,m({data:JSON.stringify({registry_mirrors_address:r})});case 3:if(!(e=t.sent).status){t.next=14;break}return c.$message.success(e.msg),t.next=8,g();case 8:o=t.sent,a=[],Object.entries(o.data.com_reg_mirrors).forEach((function(t){a.push({label:"".concat(t[0],"(").concat(t[1],")"),value:t[0]})})),_.value=a,t.next=15;break;case 14:c.$message.error(e.msg);case 15:t.next=20;break;case 17:t.prev=17,t.t0=t.catch(0);case 20:case"end":return t.stop()}}),t,null,[[0,17]])})));return function(r){return t.apply(this,arguments)}}();y((function(){w.registry_mirrors_address=i.compData.url,_.value=[].concat(r(s.value.options),[{label:"不使用加速",value:""}])}));var j=function(){var t=a(n().mark((function t(){var r;return n().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,d({data:JSON.stringify(w)});case 3:(r=t.sent).status?(c.$emit("close"),u(),c.$message.success(r.msg)):c.$message.error(r.msg),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0);case 10:case"end":return t.stop()}}),t,null,[[0,7]])})));return function(){return t.apply(this,arguments)}}();return o({onConfirm:j}),{__sfc:!0,vm:c,store:l,settingData:s,getSet:u,props:i,urlForm:w,options:_,deleteUrl:x,onConfirm:j}}});t("default",s(e,(function(){var t=this,r=t._self._c,e=t._self._setupProxy;return r("div",{staticClass:"flex flex-col p-16x lib-box"},[r(o,{ref:"urlFormRef",staticClass:"relative w-full text-[1.2rem]",attrs:{size:"small",model:e.urlForm,"label-position":"right"},nativeOn:{submit:function(t){t.preventDefault()}}},[r(i,{staticClass:"check mb-[1.2rem] text-[1.2rem]",attrs:{prop:"registry_mirrors_address",label:"加速URL"}},[r(c,{staticClass:"w-[47rem] h-[3.2rem]",attrs:{filterable:"","allow-create":"",placeholder:"请输入加速URL"},model:{value:e.urlForm.registry_mirrors_address,callback:function(r){t.$set(e.urlForm,"registry_mirrors_address",r)},expression:"urlForm.registry_mirrors_address"}},t._l(e.options,(function(n){return r(l,{key:n.value,attrs:{label:n.label,value:n.value}},[r("span",{staticStyle:{float:"left"}},[t._v(t._s(n.label))]),""!==n.value?r("span",{staticClass:"float-right text-[#ef0808] hover:text-[#c9302c]",on:{click:function(t){return t.stopPropagation(),e.deleteUrl(n.value)}}},[t._v("删除")]):t._e()])})),1)],1)],1),t._m(0)],1)}),[function(){var t=this,r=t._self._c;return t._self._setupProxy,r("div",{staticClass:"tips mt-[1.5rem]"},[r("ul",{staticClass:"help-info-text c7 list-disc text-[#777] ml-[11.7rem]"},[r("li",[t._v("优先使用加速URL执行操作，请求超时将跳过使用默认加速方式")]),r("li",[t._v("设置加速后需要手动重启docker")]),r("li",[t._v("关闭加速请设置为空")])])])}],!1,null,"90118016",null,null).exports)}}}))}();