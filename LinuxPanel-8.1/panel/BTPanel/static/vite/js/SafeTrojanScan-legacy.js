!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return r};var n,r={},a=Object.prototype,o=a.hasOwnProperty,i=Object.defineProperty||function(t,e,n){t[e]=n.value},c="function"==typeof Symbol?Symbol:{},s=c.iterator||"@@iterator",l=c.asyncIterator||"@@asyncIterator",u=c.toStringTag||"@@toStringTag";function f(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(n){f=function(t,e,n){return t[e]=n}}function p(t,e,n,r){var a=e&&e.prototype instanceof x?e:x,o=Object.create(a.prototype),c=new T(r||[]);return i(o,"_invoke",{value:S(t,n,c)}),o}function h(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}r.wrap=p;var v="suspendedStart",d="suspendedYield",y="executing",g="completed",m={};function x(){}function b(){}function w(){}var _={};f(_,s,(function(){return this}));var j=Object.getPrototypeOf,L=j&&j(j(F([])));L&&L!==a&&o.call(L,s)&&(_=L);var k=w.prototype=x.prototype=Object.create(_);function E(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function C(e,n){function r(a,i,c,s){var l=h(e[a],e,i);if("throw"!==l.type){var u=l.arg,f=u.value;return f&&"object"==t(f)&&o.call(f,"__await")?n.resolve(f.__await).then((function(t){r("next",t,c,s)}),(function(t){r("throw",t,c,s)})):n.resolve(f).then((function(t){u.value=t,c(u)}),(function(t){return r("throw",t,c,s)}))}s(l.arg)}var a;i(this,"_invoke",{value:function(t,e){function o(){return new n((function(n,a){r(t,e,n,a)}))}return a=a?a.then(o,o):o()}})}function S(t,e,r){var a=v;return function(o,i){if(a===y)throw new Error("Generator is already running");if(a===g){if("throw"===o)throw i;return{value:n,done:!0}}for(r.method=o,r.arg=i;;){var c=r.delegate;if(c){var s=D(c,r);if(s){if(s===m)continue;return s}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(a===v)throw a=g,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);a=y;var l=h(t,e,r);if("normal"===l.type){if(a=r.done?g:d,l.arg===m)continue;return{value:l.arg,done:r.done}}"throw"===l.type&&(a=g,r.method="throw",r.arg=l.arg)}}}function D(t,e){var r=e.method,a=t.iterator[r];if(a===n)return e.delegate=null,"throw"===r&&t.iterator.return&&(e.method="return",e.arg=n,D(t,e),"throw"===e.method)||"return"!==r&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+r+"' method")),m;var o=h(a,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,m;var i=o.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=n),e.delegate=null,m):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,m)}function O(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function T(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(O,this),this.reset(!0)}function F(e){if(e||""===e){var r=e[s];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,i=function t(){for(;++a<e.length;)if(o.call(e,a))return t.value=e[a],t.done=!1,t;return t.value=n,t.done=!0,t};return i.next=i}}throw new TypeError(t(e)+" is not iterable")}return b.prototype=w,i(k,"constructor",{value:w,configurable:!0}),i(w,"constructor",{value:b,configurable:!0}),b.displayName=f(w,u,"GeneratorFunction"),r.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===b||"GeneratorFunction"===(e.displayName||e.name))},r.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,w):(t.__proto__=w,f(t,u,"GeneratorFunction")),t.prototype=Object.create(k),t},r.awrap=function(t){return{__await:t}},E(C.prototype),f(C.prototype,l,(function(){return this})),r.AsyncIterator=C,r.async=function(t,e,n,a,o){void 0===o&&(o=Promise);var i=new C(p(t,e,n,a),o);return r.isGeneratorFunction(e)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},E(k),f(k,u,"Generator"),f(k,s,(function(){return this})),f(k,"toString",(function(){return"[object Generator]"})),r.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},r.values=F,T.prototype={constructor:T,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=n,this.done=!1,this.delegate=null,this.method="next",this.arg=n,this.tryEntries.forEach(P),!t)for(var e in this)"t"===e.charAt(0)&&o.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=n)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(r,a){return c.type="throw",c.arg=t,e.next=r,a&&(e.method="next",e.arg=n),!!a}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var s=o.call(i,"catchLoc"),l=o.call(i,"finallyLoc");if(s&&l){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(s){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&o.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var a=r;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,m):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),P(n),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var a=r.arg;P(n)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:F(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=n),m}},r}function n(t,e,n,r,a,o,i){try{var c=t[o](i),s=c.value}catch(l){return void n(l)}c.done?e(s):Promise.resolve(s).then(r,a)}function r(t){return function(){var e=this,r=arguments;return new Promise((function(a,o){var i=t.apply(e,r);function c(t){n(i,a,o,c,s,"next",t)}function s(t){n(i,a,o,c,s,"throw",t)}c(void 0)}))}}System.register(["./index-legacy120.js?v=1714377894636","./main-legacy.js?v=1714377894636","./index-legacy53.js?v=1714377894636","./index-legacy39.js?v=1714377894636","./index-legacy59.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./index-legacy45.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./firewall.table-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./progress-legacy.js?v=1714377894636","./select-legacy.js?v=1714377894636","./empty-legacy.js?v=1714377894636","./index-legacy46.js?v=1714377894636","./switch-legacy.js?v=1714377894636","./index.vue_vue_type_style_index_0_lang-legacy.js?v=1714377894636","./firewall.popup-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636","./index-legacy38.js?v=1714377894636"],(function(t,n){"use strict";var a,o,i,c,s,l,u,f,p,h,v,d,y,g,m,x,b,w,_,j;return{setters:[function(t){a=t._},function(t){o=t.Q,i=t.d0,c=t.d2,s=t.c_,l=t.d3,u=t.n,f=t.F,p=t.q,h=t.b},function(t){v=t._},function(t){d=t._},function(t){y=t._},function(t){g=t.L},null,function(t){m=t.e,x=t.b,b=t.v,w=t.h,_=t.j},function(t){j=t.k},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],execute:function(){var n=m({__name:"SafeTrojanScan",props:{compData:{default:function(){}}},setup:function(t){var n,a,u=t,f=_().proxy,p=x("loading"),h=x(!1),v=x(""),d=x({}),y=null,g=b({scanInfo:"",scanCount:0,scanningCount:0,scanningText:"进行中"}),m=x([]),L=b({isRecurrence:!0,describe:{title:"批量删除文件",th:"文件路径",message:"批量删除已选文件，删除文件将移动至回收站，是否继续？"}}),k=function(){y=o({route:"/ws_panel",onMessage:E})},E=function(t,e){var n;if("token error"===e.data)return f.$message.error("token error"),void(null===(n=y)||void 0===n||n.close());var r,a=JSON.parse(e.data);(g.scanInfo=a.info,a.is_count&&(g.scanCount=a.count,g.scanningCount=a.is_count),a.path&&m.value.push({path:a.path,name:a.path.substring(a.path.lastIndexOf("/")+1)}),a.result)&&(p.value="success",g.scanningText="已完成",g.scanInfo="扫描已完成",g.scanningCount=g.scanCount,a.result.length>0&&(p.value="danger"),null===(r=y)||void 0===r||r.close())},C=function(){var t=r(e().mark((function t(){var n;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:m.value=[],k(),p.value="loading",g.scanningText="进行中",null===(n=y)||void 0===n||n.send({def_name:"ws_webshell_check",mod_name:"files",path:u.compData.row.path,ws_callback:"1"});case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),S=function(){var t=r(e().mark((function t(){var n;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,f.$confirm({title:"提示",message:"查杀正在进行中，确定要停止扫描吗？",icon:"warning"});case 2:g.scanningText="已取消",p.value="success",null===(n=y)||void 0===n||n.close();case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),D=function(){var t=r(e().mark((function t(){var n;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,i({path:d.value.path,data:v.value,encoding:"utf-8"});case 3:n=t.sent,f.$message.request(n),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0);case 10:case"end":return t.stop()}}),t,null,[[0,7]])})));return function(){return t.apply(this,arguments)}}(),O=function(){var t=r(e().mark((function t(n){var r,a,o=arguments;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=o.length>1&&void 0!==o[1]&&o[1],t.prev=1,!r&&f.$confirm({title:"提示",message:"确定删除文件【"+n.path+"】?删除后文件将移至回收站，是否继续操作?",icon:"warning",type:"calc"}),t.next=5,c({path:n.path,type:"File"});case 5:a=t.sent,!r&&f.$message.request(a),m.value=m.value.filter((function(t){return t.path!==n.path})),t.next=13;break;case 10:t.prev=10,t.t0=t.catch(1);case 13:case"end":return t.stop()}}),t,null,[[1,10]])})));return function(e){return t.apply(this,arguments)}}(),P=j({openFileEvent:(a=r(e().mark((function t(n){var r;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,s({path:n.path});case 3:r=t.sent,v.value=r.data.data,h.value=!0,t.next=12;break;case 9:t.prev=9,t.t0=t.catch(0);case 12:case"end":return t.stop()}}),t,null,[[0,9]])}))),function(t){return a.apply(this,arguments)}),falseAlarmEvent:(n=r(e().mark((function t(n){var r;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,f.$confirm({title:"提示",message:"是否确定提交误报反馈",icon:"warning",type:"calc"}),t.next=4,l({filename:n.path});case 4:r=t.sent,f.$message.request(r),m.value=m.value.filter((function(t){return t.path!==n.path})),t.next=12;break;case 9:t.prev=9,t.t0=t.catch(0);case 12:case"end":return t.stop()}}),t,null,[[0,9]])}))),function(t){return n.apply(this,arguments)}),deleteEvent:O});return w((function(){C()})),{__sfc:!0,props:u,vm:f,scanLoad:p,editorPopup:h,editorValue:v,rowData:d,useSocket:y,scanningData:g,tableData:m,tableBatch:[{value:"delete",label:"删除"}],batchConfig:L,batchEvent:function(t,e,n){return O(e,!0)},createWebSocket:k,onWSReceive:E,scanData:C,cancelScan:S,saveFile:D,deleteEvent:O,tableColumns:P}}});t("default",u(n,(function(){var t=this,e=t._self._c,n=t._self._setupProxy;return e("div",{staticClass:"p-20x"},[e("div",{staticClass:"title-box flex items-center justify-between"},[e("div",{staticClass:"flex items-center"},["loading"==n.scanLoad?e("div",{staticClass:"scan-icon relative h-[8rem] w-[8rem]"},[e("div",{staticClass:"animate-spin absolute top-0 border-primary border-b-2 rounded-full h-full w-full bg-#cccccc00"}),e(f,{staticClass:"absolute top-0 left-0 right-0 bottom-0 m-[auto]",attrs:{name:"scanning-scan",size:"5"}})],1):t._e(),"success"==n.scanLoad?e(f,{attrs:{name:"scanning-success",size:"6"}}):t._e(),"danger"==n.scanLoad?e(f,{attrs:{name:"scanning-danger",size:"6"}}):t._e(),e("div",{staticClass:"scan-title flex flex-col items-start ml-20x"},[e("span",{staticClass:"font-bold text-[1.8rem] text-[#444]"},[t._v("查杀"+t._s(n.scanningData.scanningText)+" ，已扫描文件 "+t._s(n.scanningData.scanningCount)+" /"+t._s(n.scanningData.scanCount)+" 个；发现木马文件 "),e("span",{staticClass:"text-danger"},[t._v(t._s(n.tableData.length))]),t._v("个")]),e("span",{staticClass:"text-[1.2rem] text-[#666] mt-12x"},[t._v(t._s(n.scanningData.scanInfo.length>70?"..."+n.scanningData.scanInfo.substring(n.scanningData.scanInfo.length-70):n.scanningData.scanInfo))])])],1),e("div",{staticClass:"flex items-center ml-12x"},["loading"===n.scanLoad?e(p,{attrs:{type:"default"},on:{click:n.cancelScan}},[t._v("取消")]):t._e(),"loading"!=n.scanLoad?e(p,{on:{click:function(t){return n.scanData()}}},[t._v("重新查杀")]):t._e()],1)]),e(g),e(y,{scopedSlots:t._u([{key:"content",fn:function(){return[e(d,{attrs:{column:n.tableColumns,data:n.tableData}})]},proxy:!0},{key:"footer-left",fn:function(){return[e(v,{attrs:{config:n.batchConfig,data:n.tableBatch,"batch-fn":n.batchEvent}})]},proxy:!0},{key:"popup",fn:function(){return[e(h,{attrs:{title:"在线编辑",showFooter:"",visible:n.editorPopup,area:70},on:{"update:visible":function(t){n.editorPopup=t},confirm:n.saveFile}},[e("div",{staticClass:"p-20x"},[e(a,{staticClass:"!h-[40rem]",model:{value:n.editorValue,callback:function(t){n.editorValue=t},expression:"editorValue"}})],1)])]},proxy:!0}])})],1)}),[],!1,null,"51fafeea",null,null).exports)}}}))}();
