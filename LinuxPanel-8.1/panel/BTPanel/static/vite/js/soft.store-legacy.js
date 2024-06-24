!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return n};var r,n={},o=Object.prototype,a=o.hasOwnProperty,i=Object.defineProperty||function(t,e,r){t[e]=r.value},c="function"==typeof Symbol?Symbol:{},s=c.iterator||"@@iterator",u=c.asyncIterator||"@@asyncIterator",l=c.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(r){f=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var o=e&&e.prototype instanceof m?e:m,a=Object.create(o.prototype),c=new N(n||[]);return i(a,"_invoke",{value:P(t,r,c)}),a}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}n.wrap=h;var y="suspendedStart",v="suspendedYield",d="executing",g="completed",b={};function m(){}function w(){}function T(){}var L={};f(L,s,(function(){return this}));var x=Object.getPrototypeOf,O=x&&x(x(G([])));O&&O!==o&&a.call(O,s)&&(L=O);var j=T.prototype=m.prototype=Object.create(L);function D(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function E(e,r){function n(o,i,c,s){var u=p(e[o],e,i);if("throw"!==u.type){var l=u.arg,f=l.value;return f&&"object"==t(f)&&a.call(f,"__await")?r.resolve(f.__await).then((function(t){n("next",t,c,s)}),(function(t){n("throw",t,c,s)})):r.resolve(f).then((function(t){l.value=t,c(l)}),(function(t){return n("throw",t,c,s)}))}s(u.arg)}var o;i(this,"_invoke",{value:function(t,e){function a(){return new r((function(r,o){n(t,e,r,o)}))}return o=o?o.then(a,a):a()}})}function P(t,e,n){var o=y;return function(a,i){if(o===d)throw new Error("Generator is already running");if(o===g){if("throw"===a)throw i;return{value:r,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var s=S(c,n);if(s){if(s===b)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=g,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var u=p(t,e,n);if("normal"===u.type){if(o=n.done?g:v,u.arg===b)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(o=g,n.method="throw",n.arg=u.arg)}}}function S(t,e){var n=e.method,o=t.iterator[n];if(o===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=r,S(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),b;var a=p(o,t.iterator,e.arg);if("throw"===a.type)return e.method="throw",e.arg=a.arg,e.delegate=null,b;var i=a.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,b):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,b)}function k(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function _(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(k,this),this.reset(!0)}function G(e){if(e||""===e){var n=e[s];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function t(){for(;++o<e.length;)if(a.call(e,o))return t.value=e[o],t.done=!1,t;return t.value=r,t.done=!0,t};return i.next=i}}throw new TypeError(t(e)+" is not iterable")}return w.prototype=T,i(j,"constructor",{value:T,configurable:!0}),i(T,"constructor",{value:w,configurable:!0}),w.displayName=f(T,l,"GeneratorFunction"),n.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,T):(t.__proto__=T,f(t,l,"GeneratorFunction")),t.prototype=Object.create(j),t},n.awrap=function(t){return{__await:t}},D(E.prototype),f(E.prototype,u,(function(){return this})),n.AsyncIterator=E,n.async=function(t,e,r,o,a){void 0===a&&(a=Promise);var i=new E(h(t,e,r,o),a);return n.isGeneratorFunction(e)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},D(j),f(j,l,"Generator"),f(j,s,(function(){return this})),f(j,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},n.values=G,N.prototype={constructor:N,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(_),!t)for(var e in this)"t"===e.charAt(0)&&a.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,o){return c.type="throw",c.arg=t,e.next=n,o&&(e.method="next",e.arg=r),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],c=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var s=a.call(i,"catchLoc"),u=a.call(i,"finallyLoc");if(s&&u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(s){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&a.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=t,i.arg=e,o?(this.method="next",this.next=o.finallyLoc,b):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),b},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),_(r),b}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;_(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:G(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),b}},n}function r(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function n(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?r(Object(n),!0).forEach((function(e){o(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function o(e,r,n){var o;return o=function(e,r){if("object"!=t(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var o=n.call(e,r||"default");if("object"!=t(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(e)}(r,"string"),(r="symbol"==t(o)?o:String(o))in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function a(t,e,r,n,o,a,i){try{var c=t[a](i),s=c.value}catch(u){return void r(u)}c.done?e(s):Promise.resolve(s).then(n,o)}function i(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function c(t){a(i,n,o,c,s,"next",t)}function s(t){a(i,n,o,c,s,"throw",t)}c(void 0)}))}}System.register(["./vue-lib-legacy.js?v=1714377894636","./soft.api-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636"],(function(t,r){"use strict";var o,a,c,s,u;return{setters:[function(t){o=t.z,a=t.A},function(t){c=t.g,s=t.a},function(t){u=t.J}],execute:function(){var r=o("SOFT-STORE",{state:function(){return{tabActive:"shop",deployTab:"0",inputZipFlag:!1,speedInstallView:!1,softTabList:[{name:"shop",label:"软件商店"}],softTableParams:{p:1,type:0,tojs:"soft.get_list",force:"0",query:"",row:10},softTableData:{list:[],Mlist:[],loading:!1,total:0,searchHistory:[]},deployTableData:{list:[],showList:[],search:"",loading:!1,total:0,p:1,limit:10},searchContent:""}},actions:{chunkArray:function(t){for(var e=[],r=0;r<t.list.length;r+=t.limit)e.push(t.list.slice(r,r+t.limit));return e},getSoftTableList:function(t,r){var o=this;return i(e().mark((function a(){var i,s,l;return e().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,o.softTableData.loading=!0,o.softTableParams.force=t?"1":"0",e.next=5,c(o.softTableParams);case 5:(i=e.sent).status&&(s=i.data,o.softTableData.list=s.list.data,o.softTableData.Mlist=s.m_list,o.softTableData.searchHistory=s.search_history,o.softTableData.Mlist.length>0&&(l=n(n({},o.softTableData.Mlist[0]),{},{name:"docker",version:""}),o.softTableData.list.unshift(l)),o.softTableData.total=u(s.list.page),t&&!s.is_force&&void 0!==r&&r.$message.msg({dangerouslyUseHTMLString:!0,message:"云端连接失败，暂时无法获取最新的软件列表，请检查网络情况或等待5-10分钟后重试",type:"warning",duration:2e3})),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0);case 12:return e.prev=12,o.softTableData.loading=!1,e.finish(12);case 15:case"end":return e.stop()}}),a,null,[[0,9,12,15]])})))()},getDeployTableList:function(t){var r=this;return i(e().mark((function n(){var o,a,i;return e().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,r.deployTableData.loading=!0,!t){e.next=11;break}return o={type:r.deployTab},""!==r.deployTableData.search&&(o.search=r.deployTableData.search),e.next=7,s(o);case 7:(a=e.sent).status&&(i=a.data,r.deployTableData.list=i.list,r.deployTableData.showList=r.chunkArray(r.deployTableData)[r.deployTableData.p-1]||[],r.deployTableData.total=i.list.length),e.next=12;break;case 11:r.deployTableData.showList=r.chunkArray(r.deployTableData)[r.deployTableData.p-1]||[];case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(0);case 17:return e.prev=17,r.deployTableData.loading=!1,e.finish(17);case 20:case"end":return e.stop()}}),n,null,[[0,14,17,20]])})))()}}});t("g",(function(){var t=r();return n({refs:a(t)},t)}))}}}))}();
