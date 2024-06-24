!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return n};var r,n={},o=Object.prototype,i=o.hasOwnProperty,a=Object.defineProperty||function(t,e,r){t[e]=r.value},c="function"==typeof Symbol?Symbol:{},u=c.iterator||"@@iterator",s=c.asyncIterator||"@@asyncIterator",f=c.toStringTag||"@@toStringTag";function l(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(r){l=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var o=e&&e.prototype instanceof b?e:b,i=Object.create(o.prototype),c=new N(n||[]);return a(i,"_invoke",{value:P(t,r,c)}),i}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}n.wrap=h;var y="suspendedStart",v="suspendedYield",g="executing",d="completed",m={};function b(){}function w(){}function x(){}var _={};l(_,u,(function(){return this}));var k=Object.getPrototypeOf,j=k&&k(k(T([])));j&&j!==o&&i.call(j,u)&&(_=j);var L=x.prototype=b.prototype=Object.create(_);function O(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function E(e,r){function n(o,a,c,u){var s=p(e[o],e,a);if("throw"!==s.type){var f=s.arg,l=f.value;return l&&"object"==t(l)&&i.call(l,"__await")?r.resolve(l.__await).then((function(t){n("next",t,c,u)}),(function(t){n("throw",t,c,u)})):r.resolve(l).then((function(t){f.value=t,c(f)}),(function(t){return n("throw",t,c,u)}))}u(s.arg)}var o;a(this,"_invoke",{value:function(t,e){function i(){return new r((function(r,o){n(t,e,r,o)}))}return o=o?o.then(i,i):i()}})}function P(t,e,n){var o=y;return function(i,a){if(o===g)throw new Error("Generator is already running");if(o===d){if("throw"===i)throw a;return{value:r,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=S(c,n);if(u){if(u===m)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=d,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=g;var s=p(t,e,n);if("normal"===s.type){if(o=n.done?d:v,s.arg===m)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=d,n.method="throw",n.arg=s.arg)}}}function S(t,e){var n=e.method,o=t.iterator[n];if(o===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=r,S(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var i=p(o,t.iterator,e.arg);if("throw"===i.type)return e.method="throw",e.arg=i.arg,e.delegate=null,m;var a=i.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,m):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,m)}function C(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function G(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(C,this),this.reset(!0)}function T(e){if(e||""===e){var n=e[u];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function t(){for(;++o<e.length;)if(i.call(e,o))return t.value=e[o],t.done=!1,t;return t.value=r,t.done=!0,t};return a.next=a}}throw new TypeError(t(e)+" is not iterable")}return w.prototype=x,a(L,"constructor",{value:x,configurable:!0}),a(x,"constructor",{value:w,configurable:!0}),w.displayName=l(x,f,"GeneratorFunction"),n.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,l(t,f,"GeneratorFunction")),t.prototype=Object.create(L),t},n.awrap=function(t){return{__await:t}},O(E.prototype),l(E.prototype,s,(function(){return this})),n.AsyncIterator=E,n.async=function(t,e,r,o,i){void 0===i&&(i=Promise);var a=new E(h(t,e,r,o),i);return n.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},O(L),l(L,f,"Generator"),l(L,u,(function(){return this})),l(L,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},n.values=T,N.prototype={constructor:N,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(G),!t)for(var e in this)"t"===e.charAt(0)&&i.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,o){return c.type="throw",c.arg=t,e.next=n,o&&(e.method="next",e.arg=r),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],c=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var u=i.call(a,"catchLoc"),s=i.call(a,"finallyLoc");if(u&&s){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return n(a.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&i.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,m):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),G(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;G(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:T(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),m}},n}function r(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function n(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?r(Object(n),!0).forEach((function(e){o(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function o(e,r,n){var o;return o=function(e,r){if("object"!=t(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var o=n.call(e,r||"default");if("object"!=t(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(e)}(r,"string"),(r="symbol"==t(o)?o:String(o))in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function i(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(s){return void r(s)}c.done?e(u):Promise.resolve(u).then(n,o)}function a(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function c(t){i(a,n,o,c,u,"next",t)}function u(t){i(a,n,o,c,u,"throw",t)}c(void 0)}))}}System.register(["./main-legacy.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./checkbox-group-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./config-legacy.js?v=1714377894636"],(function(t,r){"use strict";var o,i,c,u,s,f,l,h,p,y,v,g,d;return{setters:[function(t){o=t.g,i=t.a5,c=t.n,u=t.D,s=t.a},function(t){f=t.Q},null,function(t){l=t.e,h=t.b,p=t.f,y=t.h,v=t.j},function(t){g=t.g,d=t.a}],execute:function(){var r=l({__name:"index",props:{value:{default:function(){return[]}},name:{default:"give"},prop:null,limitType:{default:function(){return["sms"]}}},emits:["input","change"],setup:function(t,r){var c=r.expose,u=r.emit,s=t,f=v().proxy,l=o(),m=l.refs,b=m.checkedLoad,w=m.pushConfigInfo,x=l.getPushConfigInfo,_=h([]);p((function(){return s.value}),(function(t){_.value=t}),{immediate:!0}),p(_,(function(t){f.$emit("input",t)}),{immediate:!0});var k=function(){var t=a(e().mark((function t(r){var o,a,c,u;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:o={title:"",type:""},a=null,t.t0=r.name,t.next="dingding"===t.t0?5:"feishu"===t.t0?7:"mail"===t.t0?9:"weixin"===t.t0?11:"wx_account"===t.t0?13:45;break;case 5:return o={title:"钉钉机器人配置",type:"dingding"},t.abrupt("break",45);case 7:return o={title:"飞书机器人配置",type:"feishu"},t.abrupt("break",45);case 9:return o={title:"发送者配置",type:"mail"},t.abrupt("break",45);case 11:return o={title:"企业微信机器人配置",type:"weixin"},t.abrupt("break",45);case 13:if(r.setup){t.next=43;break}return t.prev=14,a=f.$load(f.$t("正在安装微信公众号模块，请稍后...")),t.next=18,g();case 18:if(c=t.sent,c.data.wx_account.setup){t.next=33;break}return t.next=23,d("wx_account");case 23:if(u=t.sent,u.status){t.next=30;break}return f.$message.error("微信公众号模块安装失败"),t.abrupt("return");case 30:return t.next=32,j();case 32:o={title:"微信公众号",type:"wx_account"};case 33:t.next=38;break;case 35:t.prev=35,t.t1=t.catch(14);case 38:return t.prev=38,a&&a.close(),t.finish(38);case 41:t.next=44;break;case 43:o={title:"微信公众号",type:"wx_account"};case 44:return t.abrupt("break",45);case 45:i(n(n({},o),{},{callback:j}));case 46:case"end":return t.stop()}}),t,null,[[14,35,38,41]])})));return function(e){return t.apply(this,arguments)}}(),j=function(){var t=a(e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return b.value=!0,t.next=3,x();case 3:b.value=!1;case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return y((function(){w.length||j()})),c({renderPushConfig:j}),{__sfc:!0,props:s,emit:u,vm:f,checkedLoad:b,pushConfigInfo:w,getPushConfigInfo:x,giveGroupModel:_,checkChange:function(t){f.$emit("change",t)},configMessageChannels:k,renderPushConfig:j}}});t("_",c(r,(function(){var t=this,e=t._self._c,r=t._self._setupProxy;return e(f,{directives:[{name:"bt-loading",rawName:"v-bt-loading",value:r.checkedLoad,expression:"checkedLoad"}],ref:"checkboxRef",model:{value:r.giveGroupModel,callback:function(t){r.giveGroupModel=t},expression:"giveGroupModel"}},t._l(r.pushConfigInfo,(function(n,o){return t.limitType.includes(n.name)?t._e():e(u,{key:o,attrs:{name:t.name,label:n.name,disabled:!n.setup||!n.isConfig},on:{change:function(t){return r.checkChange(n)}}},[e("div",[e("span",[t._v(t._s(n.title))]),n.setup&&n.isConfig?t._e():e("span",[t._v(" ["),e(s,{attrs:{type:"danger"},on:{click:function(t){return r.configMessageChannels(n)}}},[n.isConfig&&n.setup?t._e():[t._v("未配置")]],2),t._v("] ")],1)])])})),1)}),[],!1,null,"63ff2b73",null,null).exports)}}}))}();
