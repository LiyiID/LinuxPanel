!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return n};var r,n={},o=Object.prototype,i=o.hasOwnProperty,a=Object.defineProperty||function(t,e,r){t[e]=r.value},c="function"==typeof Symbol?Symbol:{},u=c.iterator||"@@iterator",l=c.asyncIterator||"@@asyncIterator",s=c.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(r){f=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var o=e&&e.prototype instanceof b?e:b,i=Object.create(o.prototype),c=new N(n||[]);return a(i,"_invoke",{value:O(t,r,c)}),i}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}n.wrap=h;var v="suspendedStart",y="suspendedYield",g="executing",d="completed",m={};function b(){}function w(){}function x(){}var L={};f(L,u,(function(){return this}));var k=Object.getPrototypeOf,_=k&&k(k(G([])));_&&_!==o&&i.call(_,u)&&(L=_);var j=x.prototype=b.prototype=Object.create(L);function S(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function E(e,r){function n(o,a,c,u){var l=p(e[o],e,a);if("throw"!==l.type){var s=l.arg,f=s.value;return f&&"object"==t(f)&&i.call(f,"__await")?r.resolve(f.__await).then((function(t){n("next",t,c,u)}),(function(t){n("throw",t,c,u)})):r.resolve(f).then((function(t){s.value=t,c(s)}),(function(t){return n("throw",t,c,u)}))}u(l.arg)}var o;a(this,"_invoke",{value:function(t,e){function i(){return new r((function(r,o){n(t,e,r,o)}))}return o=o?o.then(i,i):i()}})}function O(t,e,n){var o=v;return function(i,a){if(o===g)throw new Error("Generator is already running");if(o===d){if("throw"===i)throw a;return{value:r,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=T(c,n);if(u){if(u===m)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===v)throw o=d,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=g;var l=p(t,e,n);if("normal"===l.type){if(o=n.done?d:y,l.arg===m)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(o=d,n.method="throw",n.arg=l.arg)}}}function T(t,e){var n=e.method,o=t.iterator[n];if(o===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=r,T(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var i=p(o,t.iterator,e.arg);if("throw"===i.type)return e.method="throw",e.arg=i.arg,e.delegate=null,m;var a=i.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,m):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,m)}function P(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function A(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(P,this),this.reset(!0)}function G(e){if(e||""===e){var n=e[u];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function t(){for(;++o<e.length;)if(i.call(e,o))return t.value=e[o],t.done=!1,t;return t.value=r,t.done=!0,t};return a.next=a}}throw new TypeError(t(e)+" is not iterable")}return w.prototype=x,a(j,"constructor",{value:x,configurable:!0}),a(x,"constructor",{value:w,configurable:!0}),w.displayName=f(x,s,"GeneratorFunction"),n.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,s,"GeneratorFunction")),t.prototype=Object.create(j),t},n.awrap=function(t){return{__await:t}},S(E.prototype),f(E.prototype,l,(function(){return this})),n.AsyncIterator=E,n.async=function(t,e,r,o,i){void 0===i&&(i=Promise);var a=new E(h(t,e,r,o),i);return n.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},S(j),f(j,s,"Generator"),f(j,u,(function(){return this})),f(j,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},n.values=G,N.prototype={constructor:N,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(A),!t)for(var e in this)"t"===e.charAt(0)&&i.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,o){return c.type="throw",c.arg=t,e.next=n,o&&(e.method="next",e.arg=r),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],c=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var u=i.call(a,"catchLoc"),l=i.call(a,"finallyLoc");if(u&&l){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return n(a.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&i.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,m):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),A(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;A(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:G(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),m}},n}function r(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(l){return void r(l)}c.done?e(u):Promise.resolve(u).then(n,o)}function n(t){return function(){var e=this,n=arguments;return new Promise((function(o,i){var a=t.apply(e,n);function c(t){r(a,o,i,c,u,"next",t)}function u(t){r(a,o,i,c,u,"throw",t)}c(void 0)}))}}System.register(["./index-legacy47.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./docker.store-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./index-legacy42.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./docker.api-legacy.js?v=1714377894636"],(function(t,r){"use strict";var o,i,a,c,u,l,s,f,h,p,v;return{setters:[function(t){o=t._},function(t){i=t.e,a=t.b,c=t.h,u=t.j},function(t){l=t.g,s=t.j,f=t.C,h=t.n},function(t){p=t.g},function(t){v=t.c},null,null,null,null,null,null,null,null,null],execute:function(){var r=i({__name:"index",setup:function(t){var r,o=u().proxy,i=a(!0),h=l().refs.mainWidth,y=p(),g=y.refs,d=g.tabActive,m=g.settingData,b=y.getQuickList,w=y.getCList,x=y.getIList,L=y.getTList,k=y.getMList,_=y.getNList,j=y.getSList,S=y.getStash,E=y.getSet,O=y.getDockerState,T=y.getAppList,P=a(null===(r=v(f,"array",[]))||void 0===r||null===(r=r.find((function(t){return"docker"===t.name})))||void 0===r?void 0:r.children),A=function(){var t=n(e().mark((function t(){var r,n,i,a;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,O();case 2:if(null!==(r=m.value)&&void 0!==r&&r.docker_installed&&null!==(n=m.value)&&void 0!==n&&n.service_status&&null!==(i=m.value)&&void 0!==i&&i.docker_compose_installed){t.next=12;break}if(-1!=o.$route.fullPath.indexOf("docker")){t.next=5;break}return t.abrupt("return");case 5:if(m.value.service_status||o.$message.error("请先启动Docker服务"),"setting"!==(null===(a=o.$route)||void 0===a?void 0:a.name)){t.next=8;break}return t.abrupt("return");case 8:d.value="setting",s("/docker/setting"),t.next=13;break;case 12:return t.abrupt("return",!0);case 13:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),N=function(){var t=h.value;i.value=t>=1280},G=function(){var t=n(e().mark((function t(r){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,A();case 2:if(t.sent){t.next=5;break}return t.abrupt("return");case 5:d.value=r,localStorage.setItem("dockerTabActive",r),s("/docker/"+r),N();case 9:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}();return c(n(e().mark((function t(){var r,n;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:d.value=null===(r=o.$route)||void 0===r?void 0:r.name,o.$dockerSocket=null,(n=localStorage.getItem("dockerTabActive"))&&""!==n&&(P.value.some((function(t){return t.path===n&&!1!==(null==t?void 0:t.isReleaseDis)}))||(n="deployment"),n!==d.value&&s("/docker/"+n),d.value=n),A(),N();case 6:case"end":return t.stop()}}),t)})))),{__sfc:!0,vm:o,adShow:i,mainWidth:h,tabActive:d,settingData:m,getQuickList:b,getCList:w,getIList:x,getTList:L,getMList:k,getNList:_,getSList:j,getStash:S,getSet:E,getDockerState:O,getAppList:T,tabList:P,judgeStatus:A,widthResize:N,tabToggle:G}}});t("default",h(r,(function(){var t=this._self._c,e=this._self._setupProxy;return t("div",{staticClass:"flex flex-col"},[t(o,{attrs:{tab:e.tabList,tabActive:e.tabActive},on:{cutTab:e.tabToggle}}),t("div",{staticClass:"bg-white p-20x mt-16x relative"},[t("transition",{attrs:{name:"fade",mode:"out-in"}},[t("router-view")],1)],1)],1)}),[],!1,null,null,null,null).exports)}}}))}();