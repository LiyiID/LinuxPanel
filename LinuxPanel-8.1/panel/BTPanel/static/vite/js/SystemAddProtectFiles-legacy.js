!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return n};var r,n={},o=Object.prototype,a=o.hasOwnProperty,i=Object.defineProperty||function(t,e,r){t[e]=r.value},c="function"==typeof Symbol?Symbol:{},l=c.iterator||"@@iterator",u=c.asyncIterator||"@@asyncIterator",s=c.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(r){f=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var o=e&&e.prototype instanceof w?e:w,a=Object.create(o.prototype),c=new G(n||[]);return i(a,"_invoke",{value:k(t,r,c)}),a}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}n.wrap=h;var y="suspendedStart",m="suspendedYield",d="executing",v="completed",g={};function w(){}function b(){}function _(){}var x={};f(x,l,(function(){return this}));var j=Object.getPrototypeOf,L=j&&j(j(N([])));L&&L!==o&&a.call(L,l)&&(x=L);var E=_.prototype=w.prototype=Object.create(x);function F(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function P(e,r){function n(o,i,c,l){var u=p(e[o],e,i);if("throw"!==u.type){var s=u.arg,f=s.value;return f&&"object"==t(f)&&a.call(f,"__await")?r.resolve(f.__await).then((function(t){n("next",t,c,l)}),(function(t){n("throw",t,c,l)})):r.resolve(f).then((function(t){s.value=t,c(s)}),(function(t){return n("throw",t,c,l)}))}l(u.arg)}var o;i(this,"_invoke",{value:function(t,e){function a(){return new r((function(r,o){n(t,e,r,o)}))}return o=o?o.then(a,a):a()}})}function k(t,e,n){var o=y;return function(a,i){if(o===d)throw new Error("Generator is already running");if(o===v){if("throw"===a)throw i;return{value:r,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var l=O(c,n);if(l){if(l===g)continue;return l}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=v,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var u=p(t,e,n);if("normal"===u.type){if(o=n.done?v:m,u.arg===g)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(o=v,n.method="throw",n.arg=u.arg)}}}function O(t,e){var n=e.method,o=t.iterator[n];if(o===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=r,O(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=p(o,t.iterator,e.arg);if("throw"===a.type)return e.method="throw",e.arg=a.arg,e.delegate=null,g;var i=a.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,g):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,g)}function S(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function $(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function G(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(S,this),this.reset(!0)}function N(e){if(e||""===e){var n=e[l];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function t(){for(;++o<e.length;)if(a.call(e,o))return t.value=e[o],t.done=!1,t;return t.value=r,t.done=!0,t};return i.next=i}}throw new TypeError(t(e)+" is not iterable")}return b.prototype=_,i(E,"constructor",{value:_,configurable:!0}),i(_,"constructor",{value:b,configurable:!0}),b.displayName=f(_,s,"GeneratorFunction"),n.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===b||"GeneratorFunction"===(e.displayName||e.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,_):(t.__proto__=_,f(t,s,"GeneratorFunction")),t.prototype=Object.create(E),t},n.awrap=function(t){return{__await:t}},F(P.prototype),f(P.prototype,u,(function(){return this})),n.AsyncIterator=P,n.async=function(t,e,r,o,a){void 0===a&&(a=Promise);var i=new P(h(t,e,r,o),a);return n.isGeneratorFunction(e)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},F(E),f(E,s,"Generator"),f(E,l,(function(){return this})),f(E,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},n.values=N,G.prototype={constructor:G,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach($),!t)for(var e in this)"t"===e.charAt(0)&&a.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,o){return c.type="throw",c.arg=t,e.next=n,o&&(e.method="next",e.arg=r),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],c=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var l=a.call(i,"catchLoc"),u=a.call(i,"finallyLoc");if(l&&u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(l){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&a.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=t,i.arg=e,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),$(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;$(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:N(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),g}},n}function r(t,e,r,n,o,a,i){try{var c=t[a](i),l=c.value}catch(u){return void r(u)}c.done?e(l):Promise.resolve(l).then(n,o)}function n(t){return function(){var e=this,n=arguments;return new Promise((function(o,a){var i=t.apply(e,n);function c(t){r(i,o,a,c,l,"next",t)}function l(t){r(i,o,a,c,l,"throw",t)}c(void 0)}))}}System.register(["./index-legacy85.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./index-legacy41.js?v=1714377894636","./form-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./confirm-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./select-legacy.js?v=1714377894636","./config-legacy.js?v=1714377894636"],(function(t,r){"use strict";var o,a,i,c,l,u,s,f,h,p,y,m;return{setters:[function(t){o=t._},function(t){a=t.w,i=t.x},function(t){c=t.eg,l=t.aS,u=t.n},null,function(t){s=t._},null,function(t){f=t.e,h=t.b,p=t.f,y=t.j},function(t){m=t.o},null,null,null,null,null,null,null,null],execute:function(){var r=f({__name:"SystemAddProtectFiles",props:{compData:{default:function(){}}},setup:function(t,r){var o=r.expose,a=t,i=y().proxy,u=h({chattr:"i",path:"",d_mode:""}),s=h([{title:"只读",key:"i"},{title:"追加",key:"a"}]),f=h(),d=h(!1),v=h(a.compData);p((function(){return a.compData}),(function(t){v.value=t}));var g={path:[{validator:function(t,e,r){if(!(e.length>0))return r(new Error(i.$t("system.pathPlaceHolder")));r()},trigger:["blur","change"]}],d_mode:[{validator:function(t,e,r){if(!(e.length>0))return r(new Error(i.$t("system.s_modePlaceHolder")));r()},trigger:["blur","change"]}]},w=function(){var t=n(e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:m({$refs:f.value,loading:d,request:function(){var t=n(e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=3,c({path:u.value.path,chattr:u.value.chattr,d_mode:u.value.d_mode,s_key:a.compData.key});case 3:return t.abrupt("return",t.sent);case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),complete:a.compData.refreshEvent});case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return o({onConfirm:w}),{__sfc:!0,props:a,vm:i,ruleForm:u,chattrOptions:s,addProtectFiles:f,formDisabled:d,key:v,rules:g,submitFrom:w,onPathChange:function(){l({type:"all",path:"",change:function(t){u.value.path=t}})}}}});t("default",u(r,(function(){var t=this,e=t._self._c,r=t._self._setupProxy;return e(a,{ref:"addProtectFiles",staticClass:"p-[2rem] addfrom",attrs:{rules:r.rules,disabled:r.formDisabled,model:r.ruleForm,"label-width":"5rem"}},[e(i,{attrs:{label:r.vm.$t("system.path"),prop:"path"}},[e(o,{attrs:{width:"28rem",placeholder:t.$t("system.pathSearchPlaceHolder"),clearable:"",iconType:"folder"},on:{folder:r.onPathChange},model:{value:r.ruleForm.path,callback:function(e){t.$set(r.ruleForm,"path",e)},expression:"ruleForm.path"}})],1),e(i,{attrs:{label:t.$t("system.chattr")}},[e(s,{staticClass:"w-[28rem]",attrs:{options:r.chattrOptions},model:{value:r.ruleForm.chattr,callback:function(e){t.$set(r.ruleForm,"chattr",e)},expression:"ruleForm.chattr"}})],1),e(i,{attrs:{label:r.vm.$t("system.s_mode"),prop:"d_mode"}},[e(o,{attrs:{width:"28rem",placeholder:t.$t("system.s_modePlaceHolder"),clearable:""},model:{value:r.ruleForm.d_mode,callback:function(e){t.$set(r.ruleForm,"d_mode",e)},expression:"ruleForm.d_mode"}})],1)],1)}),[],!1,null,null,null,null).exports)}}}))}();
