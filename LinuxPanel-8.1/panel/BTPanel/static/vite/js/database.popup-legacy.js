!function(){function t(r){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(r)}function r(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */r=function(){return n};var e,n={},o=Object.prototype,i=o.hasOwnProperty,a=Object.defineProperty||function(t,r,e){t[r]=e.value},c="function"==typeof Symbol?Symbol:{},u=c.iterator||"@@iterator",s=c.asyncIterator||"@@asyncIterator",f=c.toStringTag||"@@toStringTag";function l(t,r,e){return Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}),t[r]}try{l({},"")}catch(e){l=function(t,r,e){return t[r]=e}}function p(t,r,e,n){var o=r&&r.prototype instanceof w?r:w,i=Object.create(o.prototype),c=new k(n||[]);return a(i,"_invoke",{value:S(t,e,c)}),i}function h(t,r,e){try{return{type:"normal",arg:t.call(r,e)}}catch(t){return{type:"throw",arg:t}}}n.wrap=p;var y="suspendedStart",m="suspendedYield",v="executing",d="completed",g={};function w(){}function b(){}function j(){}var O={};l(O,u,(function(){return this}));var x=Object.getPrototypeOf,L=x&&x(x(N([])));L&&L!==o&&i.call(L,u)&&(O=L);var E=j.prototype=w.prototype=Object.create(O);function A(t){["next","throw","return"].forEach((function(r){l(t,r,(function(t){return this._invoke(r,t)}))}))}function D(r,e){function n(o,a,c,u){var s=h(r[o],r,a);if("throw"!==s.type){var f=s.arg,l=f.value;return l&&"object"==t(l)&&i.call(l,"__await")?e.resolve(l.__await).then((function(t){n("next",t,c,u)}),(function(t){n("throw",t,c,u)})):e.resolve(l).then((function(t){f.value=t,c(f)}),(function(t){return n("throw",t,c,u)}))}u(s.arg)}var o;a(this,"_invoke",{value:function(t,r){function i(){return new e((function(e,o){n(t,r,e,o)}))}return o=o?o.then(i,i):i()}})}function S(t,r,n){var o=y;return function(i,a){if(o===v)throw new Error("Generator is already running");if(o===d){if("throw"===i)throw a;return{value:e,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=P(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=d,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=v;var s=h(t,r,n);if("normal"===s.type){if(o=n.done?d:m,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=d,n.method="throw",n.arg=s.arg)}}}function P(t,r){var n=r.method,o=t.iterator[n];if(o===e)return r.delegate=null,"throw"===n&&t.iterator.return&&(r.method="return",r.arg=e,P(t,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=h(o,t.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,g;var a=i.arg;return a?a.done?(r[t.resultName]=a.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,g):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function F(t){var r={tryLoc:t[0]};1 in t&&(r.catchLoc=t[1]),2 in t&&(r.finallyLoc=t[2],r.afterLoc=t[3]),this.tryEntries.push(r)}function _(t){var r=t.completion||{};r.type="normal",delete r.arg,t.completion=r}function k(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(F,this),this.reset(!0)}function N(r){if(r||""===r){var n=r[u];if(n)return n.call(r);if("function"==typeof r.next)return r;if(!isNaN(r.length)){var o=-1,a=function t(){for(;++o<r.length;)if(i.call(r,o))return t.value=r[o],t.done=!1,t;return t.value=e,t.done=!0,t};return a.next=a}}throw new TypeError(t(r)+" is not iterable")}return b.prototype=j,a(E,"constructor",{value:j,configurable:!0}),a(j,"constructor",{value:b,configurable:!0}),b.displayName=l(j,f,"GeneratorFunction"),n.isGeneratorFunction=function(t){var r="function"==typeof t&&t.constructor;return!!r&&(r===b||"GeneratorFunction"===(r.displayName||r.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,j):(t.__proto__=j,l(t,f,"GeneratorFunction")),t.prototype=Object.create(E),t},n.awrap=function(t){return{__await:t}},A(D.prototype),l(D.prototype,s,(function(){return this})),n.AsyncIterator=D,n.async=function(t,r,e,o,i){void 0===i&&(i=Promise);var a=new D(p(t,r,e,o),i);return n.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},A(E),l(E,f,"Generator"),l(E,u,(function(){return this})),l(E,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var r=Object(t),e=[];for(var n in r)e.push(n);return e.reverse(),function t(){for(;e.length;){var n=e.pop();if(n in r)return t.value=n,t.done=!1,t}return t.done=!0,t}},n.values=N,k.prototype={constructor:k,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(_),!t)for(var r in this)"t"===r.charAt(0)&&i.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function n(n,o){return c.type="throw",c.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],c=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var u=i.call(a,"catchLoc"),s=i.call(a,"finallyLoc");if(u&&s){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return n(a.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc)}}}},abrupt:function(t,r){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc<=this.prev&&i.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=r&&r<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=r,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(a)},complete:function(t,r){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&r&&(this.next=r),g},finish:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.finallyLoc===t)return this.complete(e.completion,e.afterLoc),_(e),g}},catch:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.tryLoc===t){var n=e.completion;if("throw"===n.type){var o=n.arg;_(e)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:N(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),g}},n}function e(t,r,e,n,o,i,a){try{var c=t[i](a),u=c.value}catch(s){return void e(s)}c.done?r(u):Promise.resolve(u).then(n,o)}function n(t){return function(){var r=this,n=arguments;return new Promise((function(o,i){var a=t.apply(r,n);function c(t){e(a,o,i,c,u,"next",t)}function u(t){e(a,o,i,c,u,"throw",t)}c(void 0)}))}}function o(t,r){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable}))),e.push.apply(e,n)}return e}function i(t){for(var r=1;r<arguments.length;r++){var e=null!=arguments[r]?arguments[r]:{};r%2?o(Object(e),!0).forEach((function(r){a(t,r,e[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):o(Object(e)).forEach((function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(e,r))}))}return t}function a(r,e,n){var o;return o=function(r,e){if("object"!=t(r)||!r)return r;var n=r[Symbol.toPrimitive];if(void 0!==n){var o=n.call(r,e||"default");if("object"!=t(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(r)}(e,"string"),(e="symbol"==t(o)?o:String(o))in r?Object.defineProperty(r,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):r[e]=n,r}System.register(["./preload-helper-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./index-legacy28.js?v=1714377894636"],(function(t,e){"use strict";var o,a,c,u,s;return{setters:[function(t){o=t._},function(t){a=t.l,c=t.G,u=t.H},function(t){s=t.g}],execute:function(){t("d",(function(t,r){return a({isAsync:!0,component:function(){return o((function(){return e.import("./DatabaseDelete-legacy.js?v=1714377894636")}),void 0,e.meta.url)},title:"删除数据库",area:76,compData:{arrList:t,type:r},confirmBtnType:"danger",showFooter:!0})})),t("u",(function(t){return a({isAsync:!0,component:function(){return o((function(){return e.import("./UploadFile-legacy.js?v=1714377894636")}),void 0,e.meta.url)},title:"上传文件到",area:80,compData:{refreshEvent:t},btn:["开始上传","取消"]})})),t("e",(function(){return a({isAsync:!0,component:function(){return o((function(){return e.import("./AddSqlite-legacy.js?v=1714377894636")}),void 0,e.meta.url)},title:"添加数据库文件",area:48,showFooter:!0})})),t("f",(function(t){return a({isAsync:!0,component:function(){return o((function(){return e.import("./SqliteBackup-legacy.js?v=1714377894636")}),void 0,e.meta.url)},title:"数据库备份详情【"+t.name+"】",area:70,compData:t,showFooter:!1})})),t("M",(function(t){return a({isAsync:!0,component:function(){return o((function(){return e.import("./index-legacy132.js?v=1714377894636")}),void 0,e.meta.url)},title:"管理",area:[114,65],compData:t,showFooter:!1})})),t("h",(function(t,r,n){return a({isAsync:!0,component:function(){return o((function(){return e.import("./insertData-legacy.js?v=1714377894636")}),void 0,e.meta.url)},title:t,area:48,compData:i(i({},r),{},{refresh:n}),showFooter:!0})}));var f=s().refs.tabActive;t("a",(function(t){return a({isAsync:!0,component:function(){return o((function(){return e.import("./AddDatabase-legacy.js?v=1714377894636")}),void 0,e.meta.url)},title:"添加数据库",area:56,compData:t,showFooter:!0})})),t("r",(function(t){return a({isAsync:!0,component:function(){return o((function(){return e.import("./RootPwd-legacy.js?v=1714377894636")}),void 0,e.meta.url)},title:"修改root密码",area:40,compData:t,showFooter:!0})})),t("p",(function(){return a({isAsync:!0,component:function(){return o((function(){return e.import("./PhpManger-legacy.js?v=1714377894636")}),void 0,e.meta.url)},title:"phpMyAdmin",area:74})})),t("g",(function(t,r){return a({isAsync:!0,component:function(){return o((function(){return e.import("./AddCloudServer-legacy.js?v=1714377894636")}),void 0,e.meta.url)},title:null!=r&&r.id?"修改"+f.value+"远程数据库":"添加"+f.value+"远程数据库",area:42,compData:{formData:r,refreshEvent:t},showFooter:!0})})),t("A",(function(t){return a({isAsync:!0,component:function(){return o((function(){return e.import("./AdvancedSettings-legacy.js?v=1714377894636")}),void 0,e.meta.url)},title:"高级设置",area:[96,62],compData:t,showFooter:!1})})),t("b",(function(t){return a({isAsync:!0,component:function(){return o((function(){return e.import("./AcquireToServer-legacy.js?v=1714377894636")}),void 0,e.meta.url)},title:"从服务器获取",area:46,showFooter:!0,compData:t})})),t("i",(function(t){return a({isAsync:!0,component:function(){return o((function(){return e.import("./InputOnLocal-legacy.js?v=1714377894636")}),void 0,e.meta.url)},title:"导入本地备份",area:84,compData:t})})),t("t",(function(t){return a({isAsync:!0,component:function(){return o((function(){return e.import("./MysqlBackup-legacy.js?v=1714377894636")}),void 0,e.meta.url)},title:"【"+t.name+"】数据库备份",area:92,compData:t})})),t("q",(function(t,r){return a({isAsync:!0,component:function(){return o((function(){return e.import("./DatabaseQuota-legacy.js?v=1714377894636")}),void 0,e.meta.url)},title:"【".concat(t,"】数据库配额容量"),area:50,compData:{quota:r,name:t},showFooter:!0})})),t("j",(function(t,r,n,i,c){return a({isAsync:!0,component:function(){return o((function(){return e.import("./IncrementForm-legacy.js?v=1714377894636")}),void 0,e.meta.url)},title:"添加备份任务",area:64,compData:{selectOptions:t,tableInnerBack:r,databaseName:i,refreshEvent:n,rowData:c},showFooter:!0})})),t("c",(function(){return a({isAsync:!0,title:"分类设置",area:56,component:function(){return o((function(){return e.import("./ClassfySetting-legacy3.js?v=1714377894636")}),void 0,e.meta.url)}})})),t("N",n(r().mark((function t(){var n,i;return r().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,c({version:-1,product_type:12});case 2:if(n=t.sent,0!=(i=n.data).value.length){t.next=6;break}return t.abrupt("return",u.error("请求失败，请稍候重试"));case 6:a({isAsync:!0,component:function(){return o((function(){return e.import("./index-legacy9.js?v=1714377894636")}),void 0,e.meta.url)},area:52,compData:{name:"数据库",type:12,id:i.value[0].id,description:i.value[0].question}});case 7:case"end":return t.stop()}}),t)}))))}}}))}();
