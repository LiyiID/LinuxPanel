!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function r(t){for(var r=1;r<arguments.length;r++){var o=null!=arguments[r]?arguments[r]:{};r%2?e(Object(o),!0).forEach((function(e){n(t,e,o[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):e(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}function n(e,r,n){var o;return o=function(e,r){if("object"!=t(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var o=n.call(e,r||"default");if("object"!=t(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(e)}(r,"string"),(r="symbol"==t(o)?o:String(o))in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function o(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */o=function(){return r};var e,r={},n=Object.prototype,i=n.hasOwnProperty,a=Object.defineProperty||function(t,e,r){t[e]=r.value},s="function"==typeof Symbol?Symbol:{},c=s.iterator||"@@iterator",u=s.asyncIterator||"@@asyncIterator",l=s.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(e){f=function(t,e,r){return t[e]=r}}function p(t,e,r,n){var o=e&&e.prototype instanceof b?e:b,i=Object.create(o.prototype),s=new N(n||[]);return a(i,"_invoke",{value:P(t,r,s)}),i}function h(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}r.wrap=p;var v="suspendedStart",y="suspendedYield",m="executing",g="completed",d={};function b(){}function w(){}function _(){}var x={};f(x,c,(function(){return this}));var j=Object.getPrototypeOf,O=j&&j(j(T([])));O&&O!==n&&i.call(O,c)&&(x=O);var L=_.prototype=b.prototype=Object.create(x);function E(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function S(e,r){function n(o,a,s,c){var u=h(e[o],e,a);if("throw"!==u.type){var l=u.arg,f=l.value;return f&&"object"==t(f)&&i.call(f,"__await")?r.resolve(f.__await).then((function(t){n("next",t,s,c)}),(function(t){n("throw",t,s,c)})):r.resolve(f).then((function(t){l.value=t,s(l)}),(function(t){return n("throw",t,s,c)}))}c(u.arg)}var o;a(this,"_invoke",{value:function(t,e){function i(){return new r((function(r,o){n(t,e,r,o)}))}return o=o?o.then(i,i):i()}})}function P(t,r,n){var o=v;return function(i,a){if(o===m)throw new Error("Generator is already running");if(o===g){if("throw"===i)throw a;return{value:e,done:!0}}for(n.method=i,n.arg=a;;){var s=n.delegate;if(s){var c=k(s,n);if(c){if(c===d)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===v)throw o=g,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=m;var u=h(t,r,n);if("normal"===u.type){if(o=n.done?g:y,u.arg===d)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(o=g,n.method="throw",n.arg=u.arg)}}}function k(t,r){var n=r.method,o=t.iterator[n];if(o===e)return r.delegate=null,"throw"===n&&t.iterator.return&&(r.method="return",r.arg=e,k(t,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),d;var i=h(o,t.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,d;var a=i.arg;return a?a.done?(r[t.resultName]=a.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,d):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,d)}function C(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function D(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(C,this),this.reset(!0)}function T(r){if(r||""===r){var n=r[c];if(n)return n.call(r);if("function"==typeof r.next)return r;if(!isNaN(r.length)){var o=-1,a=function t(){for(;++o<r.length;)if(i.call(r,o))return t.value=r[o],t.done=!1,t;return t.value=e,t.done=!0,t};return a.next=a}}throw new TypeError(t(r)+" is not iterable")}return w.prototype=_,a(L,"constructor",{value:_,configurable:!0}),a(_,"constructor",{value:w,configurable:!0}),w.displayName=f(_,l,"GeneratorFunction"),r.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},r.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,_):(t.__proto__=_,f(t,l,"GeneratorFunction")),t.prototype=Object.create(L),t},r.awrap=function(t){return{__await:t}},E(S.prototype),f(S.prototype,u,(function(){return this})),r.AsyncIterator=S,r.async=function(t,e,n,o,i){void 0===i&&(i=Promise);var a=new S(p(t,e,n,o),i);return r.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},E(L),f(L,l,"Generator"),f(L,c,(function(){return this})),f(L,"toString",(function(){return"[object Generator]"})),r.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},r.values=T,N.prototype={constructor:N,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(D),!t)for(var r in this)"t"===r.charAt(0)&&i.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function n(n,o){return s.type="throw",s.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],s=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var c=i.call(a,"catchLoc"),u=i.call(a,"finallyLoc");if(c&&u){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return n(a.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&i.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,d):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),d},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),D(r),d}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;D(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:T(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),d}},r}function i(t,e,r,n,o,i,a){try{var s=t[i](a),c=s.value}catch(u){return void r(u)}s.done?e(c):Promise.resolve(c).then(n,o)}function a(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function s(t){i(a,n,o,s,c,"next",t)}function c(t){i(a,n,o,s,c,"throw",t)}s(void 0)}))}}System.register(["./index-legacy118.js?v=1714377894636","./main-legacy.js?v=1714377894636","./index-legacy41.js?v=1714377894636","./index-legacy76.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./soft.store-legacy.js?v=1714377894636","./soft.api-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./select-legacy.js?v=1714377894636","./alert-legacy.js?v=1714377894636"],(function(t,e){"use strict";var n,i,s,c,u,l,f,p,h,v,y,m,g,d,b;return{setters:[function(t){n=t._},function(t){i=t.e,s=t.O,c=t.n,u=t.q},function(t){l=t._},function(t){f=t._},function(t){p=t.e,h=t.v,v=t.c,y=t.h,m=t.j},function(t){g=t.g},function(t){d=t.c,b=t.r},null,null,null,null,null,null,null,null,null],execute:function(){var e=p({__name:"repairDialog",props:{compData:{default:function(){return{}}}},setup:function(t){var e=t,n=m().proxy,c=e.compData.softData,u=g().getSoftTableList,l=h({upgrades:[],version:"",options:[],info:{}}),f=v((function(){var t=c.name;return"total"===t||"rsync"===t||"syssafe"===t||"tamper_proof"===t})),p=function(){var t=a(o().mark((function t(){var e,r,i,a,s,u;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,d({plugin_name:c.name,show:1});case 2:(e=t.sent).status?(l.upgrades=e.data,r=l.upgrades.at(-1)||{beta:!1},i=r.beta?r:{},a=l.upgrades.at(0),l.info=c.is_beta?i:a,l.info||(s=c.version,l.info={beta:2,m_version:s.split[0],update_msg:0,update_time:0,version:s.split[1]}),f&&(l.options=l.upgrades.map((function(t){return{title:t.m_version+"."+t.version+(t.beta?"bate":"Stable"),key:t.m_version+"."+t.version}})),l.version=(null===(u=l.options.at(0))||void 0===u?void 0:u.key)||"")):n.$message.error(e.msg);case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),w=function(){var t=a(o().mark((function t(){var e,r,a,s,u;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,d({plugin_name:c.name,show:1});case 2:(e=t.sent).status?(l.upgrades=e.data,r=l.upgrades.at(-1)||{beta:!1},a=r.beta?r:{},s=l.upgrades.at(0),l.info=c.is_beta?a:s,l.info||(u=c.version,l.info={beta:2,m_version:u.split[0],update_msg:0,update_time:0,version:u.split[1]}),i({name:c.name,type:"i",softData:l.upgrades})):n.$message.error(e.msg);case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),_=function(){var t=a(o().mark((function t(){var e;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,b({version:l.info.m_version,min_version:l.info.version,plugin_name:c.name});case 2:(e=t.sent).status?(n.$emit("close"),s({name:e.data.name,type:"r",softData:r(r({},e.data),{},{callback:c.callback})})):n.$message.error(e.msg);case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return y((function(){p()})),{__sfc:!0,vm:n,props:e,softData:c,getSoftTableList:u,plugin:l,changeVersion:function(t){l.version=t},helpList:[{text:"无法修复？请尝试切换下版本。"}],isSpecial:f,getPlugin:p,setVersion:w,repair:_}}});t("default",c(e,(function(){var t=this,e=t._self._c,r=t._self._setupProxy;return e("div",{staticClass:"w-full p-[2rem] text-[1.2rem]"},[e("div",{staticClass:"flex items-center"},[e("div",{staticClass:"message flex-1 py-[.3rem] leading-[2.4rem]"},[e(f,{attrs:{icon:!1,closable:!1},scopedSlots:t._u([{key:"title",fn:function(){return[e("div",{staticClass:"leading-[2.5rem] flex items-center"},[t._v(" 提示：如果当前插件出现"),e("span",{staticClass:"text-[red]"},[t._v("异常错误")]),t._v("或"),e("span",{staticClass:"text-[red]"},[t._v("无法使用")]),t._v("，请尝试点击 "),e(u,{staticClass:"!ml-[.5rem]",attrs:{title:"修复插件"},on:{click:r.repair}},[t._v("修复插件")])],1)]},proxy:!0}])}),r.isSpecial?e("div",[e("div",{staticClass:"flex items-center justify-center mt-[2rem]"},[e("div",[t._v("选择版本")]),e(l,{staticClass:"w-[24rem] ml-[2rem] mr-[1rem]",attrs:{options:r.plugin.options,change:r.changeVersion},model:{value:r.plugin.version,callback:function(e){t.$set(r.plugin,"version",e)},expression:"plugin.version"}}),e(u,{staticClass:"!ml-[.5rem]",attrs:{title:"切换版本"},on:{click:r.setVersion}},[t._v("切换版本")])],1),e(n,{staticClass:"mt-[2rem] ml-[2rem]",attrs:{list:r.helpList,"list-style":"disc"}})],1):t._e()],1)])])}),[],!1,null,"0e732eb6",null,null).exports)}}}))}();
