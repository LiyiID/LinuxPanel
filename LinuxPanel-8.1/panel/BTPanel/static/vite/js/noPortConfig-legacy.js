!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return r};var n,r={},o=Object.prototype,i=o.hasOwnProperty,a=Object.defineProperty||function(t,e,n){t[e]=n.value},l="function"==typeof Symbol?Symbol:{},c=l.iterator||"@@iterator",s=l.asyncIterator||"@@asyncIterator",u=l.toStringTag||"@@toStringTag";function f(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(n){f=function(t,e,n){return t[e]=n}}function y(t,e,n,r){var o=e&&e.prototype instanceof x?e:x,i=Object.create(o.prototype),l=new G(r||[]);return a(i,"_invoke",{value:E(t,n,l)}),i}function h(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}r.wrap=y;var p="suspendedStart",g="suspendedYield",v="executing",d="completed",m={};function x(){}function j(){}function b(){}var w={};f(w,c,(function(){return this}));var _=Object.getPrototypeOf,C=_&&_(_(N([])));C&&C!==o&&i.call(C,c)&&(w=C);var P=b.prototype=x.prototype=Object.create(w);function L(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function k(e,n){function r(o,a,l,c){var s=h(e[o],e,a);if("throw"!==s.type){var u=s.arg,f=u.value;return f&&"object"==t(f)&&i.call(f,"__await")?n.resolve(f.__await).then((function(t){r("next",t,l,c)}),(function(t){r("throw",t,l,c)})):n.resolve(f).then((function(t){u.value=t,l(u)}),(function(t){return r("throw",t,l,c)}))}c(s.arg)}var o;a(this,"_invoke",{value:function(t,e){function i(){return new n((function(n,o){r(t,e,n,o)}))}return o=o?o.then(i,i):i()}})}function E(t,e,r){var o=p;return function(i,a){if(o===v)throw new Error("Generator is already running");if(o===d){if("throw"===i)throw a;return{value:n,done:!0}}for(r.method=i,r.arg=a;;){var l=r.delegate;if(l){var c=S(l,r);if(c){if(c===m)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(o===p)throw o=d,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o=v;var s=h(t,e,r);if("normal"===s.type){if(o=r.done?d:g,s.arg===m)continue;return{value:s.arg,done:r.done}}"throw"===s.type&&(o=d,r.method="throw",r.arg=s.arg)}}}function S(t,e){var r=e.method,o=t.iterator[r];if(o===n)return e.delegate=null,"throw"===r&&t.iterator.return&&(e.method="return",e.arg=n,S(t,e),"throw"===e.method)||"return"!==r&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+r+"' method")),m;var i=h(o,t.iterator,e.arg);if("throw"===i.type)return e.method="throw",e.arg=i.arg,e.delegate=null,m;var a=i.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=n),e.delegate=null,m):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,m)}function O(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function $(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function G(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(O,this),this.reset(!0)}function N(e){if(e||""===e){var r=e[c];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function t(){for(;++o<e.length;)if(i.call(e,o))return t.value=e[o],t.done=!1,t;return t.value=n,t.done=!0,t};return a.next=a}}throw new TypeError(t(e)+" is not iterable")}return j.prototype=b,a(P,"constructor",{value:b,configurable:!0}),a(b,"constructor",{value:j,configurable:!0}),j.displayName=f(b,u,"GeneratorFunction"),r.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===j||"GeneratorFunction"===(e.displayName||e.name))},r.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,b):(t.__proto__=b,f(t,u,"GeneratorFunction")),t.prototype=Object.create(P),t},r.awrap=function(t){return{__await:t}},L(k.prototype),f(k.prototype,s,(function(){return this})),r.AsyncIterator=k,r.async=function(t,e,n,o,i){void 0===i&&(i=Promise);var a=new k(y(t,e,n,o),i);return r.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},L(P),f(P,u,"Generator"),f(P,c,(function(){return this})),f(P,"toString",(function(){return"[object Generator]"})),r.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},r.values=N,G.prototype={constructor:G,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=n,this.done=!1,this.delegate=null,this.method="next",this.arg=n,this.tryEntries.forEach($),!t)for(var e in this)"t"===e.charAt(0)&&i.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=n)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(r,o){return l.type="throw",l.arg=t,e.next=r,o&&(e.method="next",e.arg=n),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],l=a.completion;if("root"===a.tryLoc)return r("end");if(a.tryLoc<=this.prev){var c=i.call(a,"catchLoc"),s=i.call(a,"finallyLoc");if(c&&s){if(this.prev<a.catchLoc)return r(a.catchLoc,!0);if(this.prev<a.finallyLoc)return r(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return r(a.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return r(a.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&i.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var o=r;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,m):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),$(n),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;$(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:N(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=n),m}},r}function n(t,e,n,r,o,i,a){try{var l=t[i](a),c=l.value}catch(s){return void n(s)}l.done?e(c):Promise.resolve(c).then(r,o)}System.register(["./main-legacy.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./radio-legacy.js?v=1714377894636","./radio-group-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./config.store-legacy.js?v=1714377894636","./index-legacy36.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./config.api-legacy.js?v=1714377894636","./tabs-legacy.js?v=1714377894636","./index-legacy85.js?v=1714377894636","./index-legacy77.js?v=1714377894636","./index-legacy42.js?v=1714377894636","./switch-legacy.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./form-legacy.js?v=1714377894636","./select-legacy.js?v=1714377894636","./index-legacy40.js?v=1714377894636","./checkbox-group-legacy.js?v=1714377894636","./config-legacy.js?v=1714377894636","./index-legacy41.js?v=1714377894636","./alert-legacy.js?v=1714377894636","./index-legacy44.js?v=1714377894636","./index-legacy109.js?v=1714377894636","./check-legacy.js?v=1714377894636","./index-legacy39.js?v=1714377894636","./empty-legacy.js?v=1714377894636","./index-legacy59.js?v=1714377894636","./index-legacy52.js?v=1714377894636","./radio-button-legacy.js?v=1714377894636","./index-legacy45.js?v=1714377894636","./index-legacy53.js?v=1714377894636","./progress-legacy.js?v=1714377894636","./index-legacy115.js?v=1714377894636","./index-legacy117.js?v=1714377894636","./cascader-legacy.js?v=1714377894636","./cascader-panel-legacy.js?v=1714377894636","./index-legacy62.js?v=1714377894636","./index-legacy38.js?v=1714377894636","./index-legacy61.js?v=1714377894636","./index-legacy55.js?v=1714377894636","./index-legacy116.js?v=1714377894636","./descriptions-legacy.js?v=1714377894636"],(function(t,r){"use strict";var o,i,a,l,c,s,u,f,y,h,p;return{setters:[function(t){o=t.n,i=t.a},function(t){a=t.o,l=t.y,c=t.z,s=t._},null,null,function(t){u=t.e,f=t.b,y=t.j},function(t){h=t.getConfigStore},function(t){p=t.s},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],execute:function(){var r=u({__name:"noPortConfig",emits:["close"],setup:function(t,r){var o=r.emit,i=y().proxy,a=h().refs.noPortConfig,l=f("auto"),c=function(){var t,r=(t=e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,a.value.domain){t.next=4;break}return i.$message.error("域名不能为空"),t.abrupt("return");case 4:if("no"===l.value){t.next=8;break}if(a.value.key&&a.value.cert){t.next=8;break}return i.$message.error("请填写证书内容"),t.abrupt("return");case 8:return t.next=10,h().setPanelGenerationEvent({domain:a.value.domain,privateKey:a.value.key,certPem:a.value.cert});case 10:o("close"),t.next=15;break;case 13:t.prev=13,t.t0=t.catch(0);case 15:case"end":return t.stop()}}),t,null,[[0,13]])})),function(){var e=this,r=arguments;return new Promise((function(o,i){var a=t.apply(e,r);function l(t){n(a,o,i,l,c,"next",t)}function c(t){n(a,o,i,l,c,"throw",t)}l(void 0)}))});return function(){return r.apply(this,arguments)}}();return{__sfc:!0,vm:i,noPortConfig:a,emit:o,sslValue:l,sslOption:[{title:"自定义证书",value:"auto"},{title:"不部署证书",value:"no"},{title:"选择已有证书",value:"select"}],onChange:function(t){l.value=t,"select"===t&&p()},savaConfig:c}}});t("default",o(r,(function(){var t=this,e=t._self._c,n=t._self._setupProxy;return e("div",{staticClass:"p-24x"},[e("div",{staticClass:"flex items-center"},[e("span",[t._v("绑定域名：")]),e("div",{staticClass:"w-[20rem] flex ml-[1rem]"},[e(a,{attrs:{placeholder:"请输入绑定域名"},model:{value:n.noPortConfig.domain,callback:function(e){t.$set(n.noPortConfig,"domain",e)},expression:"noPortConfig.domain"}})],1)]),e("div",{staticClass:"my-6 flex items-center leading-[3rem]"},[e("span",[t._v("SSL证书：")]),e("div",{staticClass:"flex ml-[1rem]"},[e(l,{attrs:{size:"mini"},model:{value:n.sslValue,callback:function(t){n.sslValue=t},expression:"sslValue"}},t._l(n.sslOption,(function(r,o){return e(c,{key:o,attrs:{label:r.value}},[e("span",{on:{click:function(t){return n.onChange(r.value)}}},[t._v(t._s(r.title))])])})),1)],1)]),"no"!==n.sslValue?e("div",{staticClass:"flex mt-12x"},[e("div",{staticClass:"flex-1 mr-20x"},[e("div",{staticClass:"text-[1.2rem] mb-8x"},[t._v(t._s(t.$t("Config.PanelSsl.Key")))]),e(a,{staticClass:"text-[1.2rem]",attrs:{type:"textarea",rows:13,size:"mini"},model:{value:n.noPortConfig.key,callback:function(e){t.$set(n.noPortConfig,"key",e)},expression:"noPortConfig.key"}})],1),e("div",{staticClass:"flex-1"},[e("div",{staticClass:"text-[1.2rem] mb-8x"},[t._v(t._s(t.$t("Config.PanelSsl.Pem")))]),e(a,{attrs:{type:"textarea",rows:13,size:"mini"},model:{value:n.noPortConfig.cert,callback:function(e){t.$set(n.noPortConfig,"cert",e)},expression:"noPortConfig.cert"}})],1)]):t._e(),e(s,{staticClass:"mt-4",attrs:{type:"primary"},on:{click:n.savaConfig}},[t._v(t._s(t.$t("Config.Save")))]),e("ul",{staticClass:"list-disc text-[#777] px-20x pt-12x"},[e("li",[t._v("配置此域名的证书到面板，浏览器即可信任访问")]),e("li",[t._v(" "+t._s(t.$t("Config.PanelSsl.PopupInfo1"))+" "),e(i,{attrs:{href:"https://www.bt.cn/bbs/thread-105443-1-1.html"}},[t._v(t._s(t.$t("Config.Help")))])],1),e("li",[t._v(t._s(t.$t("Config.PanelSsl.PopupInfo2")))]),e("li",[t._v(t._s(t.$t("Config.PanelSsl.PopupInfo3")))])])],1)}),[],!1,null,"1f83a516",null,null).exports)}}}))}();
