!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,a)}return r}function r(t){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?e(Object(n),!0).forEach((function(e){a(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):e(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function a(e,r,a){var n;return n=function(e,r){if("object"!=t(e)||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var n=a.call(e,r||"default");if("object"!=t(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(e)}(r,"string"),(r="symbol"==t(n)?n:String(n))in e?Object.defineProperty(e,r,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[r]=a,e}function n(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */n=function(){return r};var e,r={},a=Object.prototype,o=a.hasOwnProperty,i=Object.defineProperty||function(t,e,r){t[e]=r.value},s="function"==typeof Symbol?Symbol:{},c=s.iterator||"@@iterator",l=s.asyncIterator||"@@asyncIterator",u=s.toStringTag||"@@toStringTag";function p(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{p({},"")}catch(e){p=function(t,e,r){return t[e]=r}}function f(t,e,r,a){var n=e&&e.prototype instanceof y?e:y,o=Object.create(n.prototype),s=new P(a||[]);return i(o,"_invoke",{value:O(t,r,s)}),o}function h(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}r.wrap=f;var d="suspendedStart",v="suspendedYield",m="executing",g="completed",b={};function y(){}function D(){}function w(){}var T={};p(T,c,(function(){return this}));var L=Object.getPrototypeOf,_=L&&L(L(C([])));_&&_!==a&&o.call(_,c)&&(T=_);var k=w.prototype=y.prototype=Object.create(T);function x(t){["next","throw","return"].forEach((function(e){p(t,e,(function(t){return this._invoke(e,t)}))}))}function j(e,r){function a(n,i,s,c){var l=h(e[n],e,i);if("throw"!==l.type){var u=l.arg,p=u.value;return p&&"object"==t(p)&&o.call(p,"__await")?r.resolve(p.__await).then((function(t){a("next",t,s,c)}),(function(t){a("throw",t,s,c)})):r.resolve(p).then((function(t){u.value=t,s(u)}),(function(t){return a("throw",t,s,c)}))}c(l.arg)}var n;i(this,"_invoke",{value:function(t,e){function o(){return new r((function(r,n){a(t,e,r,n)}))}return n=n?n.then(o,o):o()}})}function O(t,r,a){var n=d;return function(o,i){if(n===m)throw new Error("Generator is already running");if(n===g){if("throw"===o)throw i;return{value:e,done:!0}}for(a.method=o,a.arg=i;;){var s=a.delegate;if(s){var c=S(s,a);if(c){if(c===b)continue;return c}}if("next"===a.method)a.sent=a._sent=a.arg;else if("throw"===a.method){if(n===d)throw n=g,a.arg;a.dispatchException(a.arg)}else"return"===a.method&&a.abrupt("return",a.arg);n=m;var l=h(t,r,a);if("normal"===l.type){if(n=a.done?g:v,l.arg===b)continue;return{value:l.arg,done:a.done}}"throw"===l.type&&(n=g,a.method="throw",a.arg=l.arg)}}}function S(t,r){var a=r.method,n=t.iterator[a];if(n===e)return r.delegate=null,"throw"===a&&t.iterator.return&&(r.method="return",r.arg=e,S(t,r),"throw"===r.method)||"return"!==a&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+a+"' method")),b;var o=h(n,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,b;var i=o.arg;return i?i.done?(r[t.resultName]=i.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,b):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,b)}function E(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function A(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function P(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(E,this),this.reset(!0)}function C(r){if(r||""===r){var a=r[c];if(a)return a.call(r);if("function"==typeof r.next)return r;if(!isNaN(r.length)){var n=-1,i=function t(){for(;++n<r.length;)if(o.call(r,n))return t.value=r[n],t.done=!1,t;return t.value=e,t.done=!0,t};return i.next=i}}throw new TypeError(t(r)+" is not iterable")}return D.prototype=w,i(k,"constructor",{value:w,configurable:!0}),i(w,"constructor",{value:D,configurable:!0}),D.displayName=p(w,u,"GeneratorFunction"),r.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===D||"GeneratorFunction"===(e.displayName||e.name))},r.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,w):(t.__proto__=w,p(t,u,"GeneratorFunction")),t.prototype=Object.create(k),t},r.awrap=function(t){return{__await:t}},x(j.prototype),p(j.prototype,l,(function(){return this})),r.AsyncIterator=j,r.async=function(t,e,a,n,o){void 0===o&&(o=Promise);var i=new j(f(t,e,a,n),o);return r.isGeneratorFunction(e)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},x(k),p(k,u,"Generator"),p(k,c,(function(){return this})),p(k,"toString",(function(){return"[object Generator]"})),r.keys=function(t){var e=Object(t),r=[];for(var a in e)r.push(a);return r.reverse(),function t(){for(;r.length;){var a=r.pop();if(a in e)return t.value=a,t.done=!1,t}return t.done=!0,t}},r.values=C,P.prototype={constructor:P,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(A),!t)for(var r in this)"t"===r.charAt(0)&&o.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function a(a,n){return s.type="throw",s.arg=t,r.next=a,n&&(r.method="next",r.arg=e),!!n}for(var n=this.tryEntries.length-1;n>=0;--n){var i=this.tryEntries[n],s=i.completion;if("root"===i.tryLoc)return a("end");if(i.tryLoc<=this.prev){var c=o.call(i,"catchLoc"),l=o.call(i,"finallyLoc");if(c&&l){if(this.prev<i.catchLoc)return a(i.catchLoc,!0);if(this.prev<i.finallyLoc)return a(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return a(i.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return a(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var a=this.tryEntries[r];if(a.tryLoc<=this.prev&&o.call(a,"finallyLoc")&&this.prev<a.finallyLoc){var n=a;break}}n&&("break"===t||"continue"===t)&&n.tryLoc<=e&&e<=n.finallyLoc&&(n=null);var i=n?n.completion:{};return i.type=t,i.arg=e,n?(this.method="next",this.next=n.finallyLoc,b):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),b},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),A(r),b}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var a=r.completion;if("throw"===a.type){var n=a.arg;A(r)}return n}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,a){return this.delegate={iterator:C(t),resultName:r,nextLoc:a},"next"===this.method&&(this.arg=e),b}},r}function o(t){return function(t){if(Array.isArray(t))return i(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return i(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return i(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,a=new Array(e);r<e;r++)a[r]=t[r];return a}function s(t,e,r,a,n,o,i){try{var s=t[o](i),c=s.value}catch(l){return void r(l)}s.done?e(c):Promise.resolve(c).then(a,n)}function c(t){return function(){var e=this,r=arguments;return new Promise((function(a,n){var o=t.apply(e,r);function i(t){s(o,a,n,i,c,"next",t)}function c(t){s(o,a,n,i,c,"throw",t)}i(void 0)}))}}System.register(["./vue-lib-legacy.js?v=1714377894636","./docker.api-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636"],(function(t,e){"use strict";var a,i,s,l,u,p,f,h,d,v,m,g,b,y,D,w,T,L,_,k,x;return{setters:[function(t){a=t.z,i=t.V,s=t.A},function(t){l=t.v,u=t.w,p=t.x,f=t.y,h=t.z,d=t.A,v=t.B,m=t.C,g=t.D,b=t.E,y=t.F,D=t.G,w=t.H,T=t.I,L=t.J},function(t){_=t.J,k=t.c},function(t){x=t.c},null],execute:function(){var e=t("u",a("DOCKER-STORE",{state:function(){return{tabActive:"deployment",refreshServerTable:!1,refreshCommonTable:!1,refreshMirrorTable:!1,containerLogTab:"",quickListData:[],currentConDetail:{},maxCPU:0,maxMem:0,loading:!1,firstLoad:{app:!0,container:!0,item:!0,template:!0,mirror:!0,net:!0,storage:!0,stash:!0},deployMenuData:{loading:!1,list:[],search:"",total:0,p:1,row:20},containerTableData:{loading:!1,list:[],showList:[],grouped:{},selection:[],historySearch:[],rowData:{},topList:[],total:0,p:1,limit:20,usedList:[]},itemTableData:{loading:!1,list:[],showList:[],selection:[],historySearch:[],rowData:{},total:0,p:1,limit:20},projectGroupData:{loading:!1,list:[]},templateTableData:{loading:!1,list:[],showList:[],selection:[],historySearch:[],rowData:{},total:0,p:1,limit:20},mirrorTableData:{loading:!1,list:[],showList:[],selection:[],historySearch:[],rowData:{},total:0,p:1,limit:20},netTableData:{loading:!1,list:[],showList:[],selection:[],historySearch:[],rowData:{},total:0,p:1,limit:20},storageTableData:{loading:!1,list:[],showList:[],selection:[],historySearch:[],rowData:{},total:0,p:1,limit:20},stashTableData:{loading:!1,list:[],showList:[],selection:[],historySearch:[],rowData:{},total:0,p:1,limit:20},settingData:{service_status:!0,docker_installed:!1,docker_compose_installed:!1,docker_compose_path:"/usr/bin/docker-compose",monitor_status:!1,monitor_save_date:0,url:"11",options:[],daemon_path:"/etc/docker/daemon.json",installing:0}}},actions:{chunkArray:function(t){for(var e=[],r=0;r<t.list.length;r+=t.limit)e.push(t.list.slice(r,r+t.limit));return e},getAppList:function(t){var e=this;return c(n().mark((function r(){var a,i;return n().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,e.firstLoad.app&&(e.loading=!0),a={p:e.deployMenuData.p,row:e.deployMenuData.row,query:e.deployMenuData.search},!0===t&&(a.force=1),r.next=6,l(a);case 6:(i=r.sent).status&&(""!==e.deployMenuData.search?e.deployMenuData.list=i.data.data:e.deployMenuData.list=[].concat(o(e.deployMenuData.list),o(i.data.data)),e.firstLoad.app=!1,e.deployMenuData.total=_(i.data.page)),r.next=13;break;case 10:r.prev=10,r.t0=r.catch(0);case 13:return r.prev=13,e.loading=!1,r.finish(13);case 16:case"end":return r.stop()}}),r,null,[[0,10,13,16]])})))()},getQuickList:function(){var t=this;return c(n().mark((function e(){var r;return n().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,0===t.quickListData.length&&(t.loading=!0),e.next=4,u();case 4:r=e.sent,t.quickListData=r.data,e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0);case 11:return e.prev=11,t.loading=!1,e.finish(11);case 14:case"end":return e.stop()}}),e,null,[[0,8,11,14]])})))()},getCList:function(){var t=this;return c(n().mark((function e(){var r,a,o,i;return n().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t.firstLoad.container&&(t.containerTableData.loading=!0),e.next=4,p();case 4:return a=e.sent,t.firstLoad.container=!1,o=x(null===(r=a.data)||void 0===r?void 0:r.container_list,"array",[]),t.containerTableData.list=t.sortContainerList(o),t.containerTableData.topList=a.data.container_to_top,t.containerTableData.total=a.data.container_list.length,t.containerTableData.showList=t.chunkArray(t.containerTableData)[t.containerTableData.p-1]||[],t.containerTableData.grouped=a.data.grouped_by_status,t.maxCPU=a.data.online_cpus,t.maxMem=Number(k(Number(a.data.mem_total),!1,0,"MB")),e.next=16,f();case 16:i=e.sent,t.setContainerInfo(t.containerTableData.list,x(i.data,"array",[])),t.containerTableData.showList=t.chunkArray(t.containerTableData)[t.containerTableData.p-1]||[],e.next=24;break;case 21:e.prev=21,e.t0=e.catch(0);case 24:return e.prev=24,t.containerTableData.loading=!1,e.finish(24);case 27:case"end":return e.stop()}}),e,null,[[0,21,24,27]])})))()},setContainerInfo:function(t,e){t.forEach((function(t,r){var a=e.find((function(e){return e.id===t.id}));a&&(i.set(t,"backup_count",a.backup_count),i.set(t,"remark",a.remark))}))},sortContainerList:function(t){return t.sort((function(t,e){return 1==t.is_top&&1!=e.is_top?-1:1!=t.is_top&&1==e.is_top?1:t.name.localeCompare(e.name)}))},setTopContainerList:function(){this.containerTableData.list=this.sortContainerList(this.containerTableData.list),this.containerTableData.showList=this.chunkArray(this.containerTableData)[this.containerTableData.p-1]||[]},getCurrentCon:function(t){var e=this;return c(n().mark((function r(){var a;return n().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,h({data:JSON.stringify({id:t})});case 3:(a=r.sent).status&&(e.currentConDetail=a.data),r.next=10;break;case 7:r.prev=7,r.t0=r.catch(0);case 10:return r.prev=10,r.finish(10);case 12:case"end":return r.stop()}}),r,null,[[0,7,10,12]])})))()},getIList:function(){var t=this;return c(n().mark((function e(){var a;return n().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t.firstLoad.item&&(t.itemTableData.loading=!0),e.next=4,d();case 4:return a=e.sent,t.firstLoad.item=!1,t.itemTableData.list=a.data,t.itemTableData.total=a.data.length,t.itemTableData.showList=t.chunkArray(t.itemTableData)[t.itemTableData.p-1]||[],e.next=11,v();case 11:e.sent.data.forEach((function(e,a){var n=t.itemTableData.list[a];t.itemTableData.list.splice(a,1,r(r({},n),{num:e}))})),t.itemTableData.showList=t.chunkArray(t.itemTableData)[t.itemTableData.p-1]||[],e.next=19;break;case 16:e.prev=16,e.t0=e.catch(0);case 19:return e.prev=19,t.itemTableData.loading=!1,e.finish(19);case 22:case"end":return e.stop()}}),e,null,[[0,16,19,22]])})))()},getProjectGroup:function(){var t=this;return c(n().mark((function e(){var r,a,o;return n().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,0===t.projectGroupData.list.length&&(t.projectGroupData.loading=!0),e.next=4,m();case 4:r=e.sent,a=r.data,o=x(a.value,"array",[]),t.projectGroupData.list=o,e.next=12;break;case 10:e.prev=10,e.t0=e.catch(0);case 12:return e.prev=12,t.projectGroupData.loading=!1,e.finish(12);case 15:case"end":return e.stop()}}),e,null,[[0,10,12,15]])})))()},getTList:function(){var t=this;return c(n().mark((function e(){var r;return n().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t.firstLoad.template&&(t.templateTableData.loading=!0),e.next=4,g();case 4:r=e.sent,t.firstLoad.template=!1,t.templateTableData.list=r.data,t.templateTableData.total=r.data.length,t.templateTableData.showList=t.chunkArray(t.templateTableData)[t.templateTableData.p-1]||[],e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0);case 14:return e.prev=14,t.templateTableData.loading=!1,e.finish(14);case 17:case"end":return e.stop()}}),e,null,[[0,11,14,17]])})))()},getMList:function(t){var e=this;return c(n().mark((function r(){var a;return n().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:if(r.prev=0,e.firstLoad.mirror&&(e.mirrorTableData.loading=!0),"page"!==t){r.next=5;break}return e.mirrorTableData.showList=e.chunkArray(e.mirrorTableData)[e.mirrorTableData.p-1]||[],r.abrupt("return");case 5:return r.next=7,b();case 7:a=r.sent,e.firstLoad.mirror=!1,e.mirrorTableData.list=a.data,e.mirrorTableData.total=a.data.length,e.mirrorTableData.showList=e.chunkArray(e.mirrorTableData)[e.mirrorTableData.p-1]||[],r.next=17;break;case 14:r.prev=14,r.t0=r.catch(0);case 17:return r.prev=17,e.mirrorTableData.loading=!1,r.finish(17);case 20:case"end":return r.stop()}}),r,null,[[0,14,17,20]])})))()},getNList:function(){var t=this;return c(n().mark((function e(){var r;return n().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t.firstLoad.net&&(t.netTableData.loading=!0),e.next=4,y();case 4:r=e.sent,t.firstLoad.net=!1,t.netTableData.list=r.data,t.netTableData.total=r.data.length,t.netTableData.showList=t.chunkArray(t.netTableData)[t.netTableData.p-1]||[],e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0);case 14:return e.prev=14,t.netTableData.loading=!1,e.finish(14);case 17:case"end":return e.stop()}}),e,null,[[0,11,14,17]])})))()},getSList:function(){var t=this;return c(n().mark((function e(){var r;return n().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t.firstLoad.storage&&(t.storageTableData.loading=!0),e.next=4,D();case 4:r=e.sent,t.firstLoad.storage=!1,t.storageTableData.list=r.data,t.storageTableData.total=r.data.length,t.storageTableData.showList=t.chunkArray(t.storageTableData)[t.storageTableData.p-1]||[],e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0);case 14:return e.prev=14,t.storageTableData.loading=!1,e.finish(14);case 17:case"end":return e.stop()}}),e,null,[[0,11,14,17]])})))()},getStash:function(){var t=this;return c(n().mark((function e(){var r;return n().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t.firstLoad.stash&&(t.stashTableData.loading=!0),e.next=4,w();case 4:r=e.sent,t.firstLoad.stash=!1,t.stashTableData.list=r.data,t.stashTableData.total=r.data.length,t.stashTableData.showList=t.chunkArray(t.stashTableData)[t.stashTableData.p-1]||[],e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0);case 14:return e.prev=14,t.stashTableData.loading=!1,e.finish(14);case 17:case"end":return e.stop()}}),e,null,[[0,11,14,17]])})))()},getSet:function(t){var e=this;return c(n().mark((function r(){var a,o,i,s;return n().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:if(r.prev=0,e.loading=!0,!1===t){r.next=14;break}return r.next=5,T();case 5:a=r.sent,o=a.data,e.settingData.service_status=o.service_status,e.settingData.docker_installed=o.docker_installed,e.settingData.docker_compose_installed=o.docker_compose_installed,e.settingData.docker_compose_path=o.docker_compose_path,e.settingData.monitor_status=o.monitor_status,e.settingData.monitor_save_date=o.monitor_save_date,e.settingData.daemon_path=o.daemon_path;case 14:return r.next=16,L();case 16:0===(i=r.sent).data.registry_mirrors.length?e.settingData.url="未设置加速URL":e.settingData.url=i.data.registry_mirrors[0],s=[],Object.entries(i.data.com_reg_mirrors).forEach((function(t){s.push({label:"".concat(t[0],"(").concat(t[1],")"),value:t[0]})})),e.settingData.options=s,e.loading=!1,r.next=28;break;case 24:r.prev=24,r.t0=r.catch(0),e.loading=!1;case 28:case"end":return r.stop()}}),r,null,[[0,24]])})))()},getDockerState:function(){var t=this;return c(n().mark((function e(){var r,a;return n().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t.loading=!0,e.next=4,T();case 4:r=e.sent,a=r.data,t.settingData.service_status=a.service_status,t.settingData.docker_installed=a.docker_installed,t.settingData.docker_compose_installed=a.docker_compose_installed,t.settingData.docker_compose_path=a.docker_compose_path,t.settingData.monitor_status=a.monitor_status,t.settingData.monitor_save_date=a.monitor_save_date,t.settingData.daemon_path=a.daemon_path,t.loading=!1,e.next=20;break;case 16:e.prev=16,e.t0=e.catch(0),t.loading=!1;case 20:case"end":return e.stop()}}),e,null,[[0,16]])})))()}}}));t("g",(function(){var t=e();return r({refs:s(t)},t)}))}}}))}();