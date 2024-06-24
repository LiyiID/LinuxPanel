!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return n};var r,n={},a=Object.prototype,o=a.hasOwnProperty,i=Object.defineProperty||function(t,e,r){t[e]=r.value},c="function"==typeof Symbol?Symbol:{},l=c.iterator||"@@iterator",u=c.asyncIterator||"@@asyncIterator",s=c.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(r){f=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var a=e&&e.prototype instanceof b?e:b,o=Object.create(a.prototype),c=new N(n||[]);return i(o,"_invoke",{value:C(t,r,c)}),o}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}n.wrap=h;var y="suspendedStart",v="suspendedYield",d="executing",g="completed",m={};function b(){}function x(){}function w(){}var j={};f(j,l,(function(){return this}));var _=Object.getPrototypeOf,L=_&&_(_(P([])));L&&L!==a&&o.call(L,l)&&(j=L);var E=w.prototype=b.prototype=Object.create(j);function D(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function S(e,r){function n(a,i,c,l){var u=p(e[a],e,i);if("throw"!==u.type){var s=u.arg,f=s.value;return f&&"object"==t(f)&&o.call(f,"__await")?r.resolve(f.__await).then((function(t){n("next",t,c,l)}),(function(t){n("throw",t,c,l)})):r.resolve(f).then((function(t){s.value=t,c(s)}),(function(t){return n("throw",t,c,l)}))}l(u.arg)}var a;i(this,"_invoke",{value:function(t,e){function o(){return new r((function(r,a){n(t,e,r,a)}))}return a=a?a.then(o,o):o()}})}function C(t,e,n){var a=y;return function(o,i){if(a===d)throw new Error("Generator is already running");if(a===g){if("throw"===o)throw i;return{value:r,done:!0}}for(n.method=o,n.arg=i;;){var c=n.delegate;if(c){var l=O(c,n);if(l){if(l===m)continue;return l}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(a===y)throw a=g,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);a=d;var u=p(t,e,n);if("normal"===u.type){if(a=n.done?g:v,u.arg===m)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(a=g,n.method="throw",n.arg=u.arg)}}}function O(t,e){var n=e.method,a=t.iterator[n];if(a===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=r,O(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var o=p(a,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,m;var i=o.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,m):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,m)}function k(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function T(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(k,this),this.reset(!0)}function P(e){if(e||""===e){var n=e[l];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,i=function t(){for(;++a<e.length;)if(o.call(e,a))return t.value=e[a],t.done=!1,t;return t.value=r,t.done=!0,t};return i.next=i}}throw new TypeError(t(e)+" is not iterable")}return x.prototype=w,i(E,"constructor",{value:w,configurable:!0}),i(w,"constructor",{value:x,configurable:!0}),x.displayName=f(w,s,"GeneratorFunction"),n.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===x||"GeneratorFunction"===(e.displayName||e.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,w):(t.__proto__=w,f(t,s,"GeneratorFunction")),t.prototype=Object.create(E),t},n.awrap=function(t){return{__await:t}},D(S.prototype),f(S.prototype,u,(function(){return this})),n.AsyncIterator=S,n.async=function(t,e,r,a,o){void 0===o&&(o=Promise);var i=new S(h(t,e,r,a),o);return n.isGeneratorFunction(e)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},D(E),f(E,s,"Generator"),f(E,l,(function(){return this})),f(E,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},n.values=P,N.prototype={constructor:N,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(T),!t)for(var e in this)"t"===e.charAt(0)&&o.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,a){return c.type="throw",c.arg=t,e.next=n,a&&(e.method="next",e.arg=r),!!a}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var l=o.call(i,"catchLoc"),u=o.call(i,"finallyLoc");if(l&&u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(l){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&o.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var a=n;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,m):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),T(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var a=n.arg;T(r)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:P(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),m}},n}function r(t,e,r,n,a,o,i){try{var c=t[o](i),l=c.value}catch(u){return void r(u)}c.done?e(l):Promise.resolve(l).then(n,a)}function n(t){return function(){var e=this,n=arguments;return new Promise((function(a,o){var i=t.apply(e,n);function c(t){r(i,a,o,c,l,"next",t)}function l(t){r(i,a,o,c,l,"throw",t)}c(void 0)}))}}System.register(["./index-legacy53.js?v=1714377894636","./index-legacy39.js?v=1714377894636","./index-legacy59.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./alert-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./index-legacy28.js?v=1714377894636","./mysql.store-legacy.js?v=1714377894636","./database.table-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636","./progress-legacy.js?v=1714377894636","./select-legacy.js?v=1714377894636","./empty-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./index-legacy77.js?v=1714377894636","./tabs-legacy.js?v=1714377894636","./index-legacy42.js?v=1714377894636","./index-legacy38.js?v=1714377894636","./index-legacy45.js?v=1714377894636","./switch-legacy.js?v=1714377894636","./index.vue_vue_type_style_index_0_lang-legacy.js?v=1714377894636"],(function(t,r){"use strict";var a,o,i,c,l,u,s,f,h,p,y,v,d,g,m,b,x,w,j;return{setters:[function(t){a=t.a},function(t){o=t._},function(t){i=t._},function(t){c=t.a9},function(t){l=t.l,u=t.n},null,function(t){s=t._},function(t){f=t.e,h=t.b,p=t.v,y=t.h,v=t.j},function(t){d=t.g},function(t){g=t.m,m=t.D,b=t.F,x=t.i},function(t){w=t.f},function(t){j=t.c},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],execute:function(){var _=f({__name:"DatabaseDelete",props:{compData:{default:function(){}}},emits:["handle-complete"],setup:function(t,a){var o=a.expose,i=a.emit,c=t,u=v().proxy,f=d(),_=f.refs,L=_.textTemp,E=_.tabActive,D=_.dbRecycle,S=f.getDatabase,C=g().getDatabase,O=h([]),k=h(!0),T=w(),N=p({title:"警告",titleType:"warning",description:"删除数据库后，数据库内的所有数据将被清空，且不可恢复。"}),P=h(!1),q=p({batchStatus:2,isRecurrence:!1,batchVisible:!1,list:[],batchSelect:"",describe:{th:"数据库名称",title:"批量删除数据库",message:"批量删除数据库已完成，共个任务，成功个，失败个。",propsValue:"name"}}),G=function(){var t=n(e().mark((function t(a){var o,i;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return L.value=!1,t.next=3,u.$confirm({type:"input",width:50,title:"二次验证信息-删除数据库",message:"删除后如需彻底删除请前往数据库回收站，是否继续操作？",isCalc:!0,icon:"warning",inputText:"删除数据库"});case 3:o=[],i=u.$load("正在删除...");try{O.value.forEach(function(){var t=n(e().mark((function t(n,a){var i,f,h;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(i=n.id,f=n.name,"mysql"!==E.value){t.next=7;break}return t.next=4,m({id:i,name:f});case 4:t.t0=t.sent,t.next=10;break;case 7:return t.next=9,m({data:JSON.stringify({id:i,name:f})},E.value);case 9:t.t0=t.sent;case 10:h=t.t0,"isMult"!==c.compData.type&&u.$message.request(h),o.push({id:i,name:f,status:h.status}),a===O.value.length-1&&("mysql"===E.value?C():S(),l({title:"批量删除数据库结果",area:42,component:function(){return s((function(){return r.import("./index-legacy63.js?v=1714377894636")}),void 0,r.meta.url)},compData:{resultData:o,resultTitle:"删除数据库"}}));case 14:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}()),a()}catch(f){}finally{i.close()}case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),A=function(){var t=n(e().mark((function t(){var r;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,r={},"mysql"!==E.value){t.next=8;break}return t.next=5,b({ids:JSON.stringify(c.compData.arrList)});case 5:r=t.sent,t.next=11;break;case 8:return t.next=10,x({data:JSON.stringify({ids:JSON.stringify(c.compData.arrList)})},E.value);case 10:r=t.sent;case 11:O.value=j(r.data,"array",[]),O.value.forEach((function(t){t.sid&&(P.value=!0)})),P.value||"mysql"!==E.value?(k.value=!1,P.value&&(k.value=!0),N.titleType="error",N.description="当前列表存在彻底删除后无法恢复的数据库，请仔细查看列表，以防误删，是否继续操作？"):k.value=!1,t.next=19;break;case 16:t.prev=16,t.t0=t.catch(0);case 19:case"end":return t.stop()}}),t,null,[[0,16]])})));return function(){return t.apply(this,arguments)}}();return y((function(){A()})),o({onConfirm:G}),{__sfc:!0,vm:u,textTemp:L,tabActive:E,dbRecycle:D,getDatabase:S,getMysqlDatabase:C,props:c,tableData:O,cloudDBserver:k,deleteTableColumn:T,titleAlert:N,emits:i,isCloudFlag:P,batchConfig:q,handleComplete:function(t){i("handle-complete",t,t.length)},confirmDelete:G,onOpen:A}}});t("default",u(_,(function(){var t=this,e=t._self._c,r=t._self._setupProxy;return e("div",{staticClass:"p-28x"},[e(c,{attrs:{title:"警告",type:r.titleAlert.titleType,"show-icon":"",closable:!1,description:r.titleAlert.description}}),e(i,{scopedSlots:t._u([{key:"content",fn:function(){return[e(o,{ref:"mysqlDelete",staticClass:"max-h-[30rem] overflow-auto",attrs:{data:r.tableData,column:r.deleteTableColumn}})]},proxy:!0}])}),r.cloudDBserver?e("p",{staticClass:"text-danger"},[t._v(" 注意：远程数据库暂不支持数据库回收站，选中的数据库将彻底删除 ")]):t._e(),e("p",{staticClass:"text-danger"},[t._v(t._s(t.$t("DataBase.DeleteConfirmTip")))]),r.dbRecycle||r.cloudDBserver?t._e():e("p",{staticClass:"text-danger mt-4x"},[t._v(" 当前数据库回收站尚未开启,请谨慎操作! ")]),e(a,{attrs:{batchStatus:r.batchConfig.batchStatus,visible:r.batchConfig.batchVisible,describe:r.batchConfig.describe,data:r.batchConfig.list},on:{"update:visible":function(e){return t.$set(r.batchConfig,"batchVisible",e)},complete:r.handleComplete}})],1)}),[],!1,null,null,null,null).exports)}}}))}();