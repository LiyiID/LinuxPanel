!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return n};var r,n={},a=Object.prototype,o=a.hasOwnProperty,i=Object.defineProperty||function(t,e,r){t[e]=r.value},c="function"==typeof Symbol?Symbol:{},l=c.iterator||"@@iterator",u=c.asyncIterator||"@@asyncIterator",s=c.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(r){f=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var a=e&&e.prototype instanceof b?e:b,o=Object.create(a.prototype),c=new O(n||[]);return i(o,"_invoke",{value:S(t,r,c)}),o}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}n.wrap=h;var y="suspendedStart",g="suspendedYield",d="executing",v="completed",m={};function b(){}function x(){}function w(){}var j={};f(j,l,(function(){return this}));var L=Object.getPrototypeOf,k=L&&L(L(N([])));k&&k!==a&&o.call(k,l)&&(j=k);var _=w.prototype=b.prototype=Object.create(j);function E(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function D(e,r){function n(a,i,c,l){var u=p(e[a],e,i);if("throw"!==u.type){var s=u.arg,f=s.value;return f&&"object"==t(f)&&o.call(f,"__await")?r.resolve(f.__await).then((function(t){n("next",t,c,l)}),(function(t){n("throw",t,c,l)})):r.resolve(f).then((function(t){s.value=t,c(s)}),(function(t){return n("throw",t,c,l)}))}l(u.arg)}var a;i(this,"_invoke",{value:function(t,e){function o(){return new r((function(r,a){n(t,e,r,a)}))}return a=a?a.then(o,o):o()}})}function S(t,e,n){var a=y;return function(o,i){if(a===d)throw new Error("Generator is already running");if(a===v){if("throw"===o)throw i;return{value:r,done:!0}}for(n.method=o,n.arg=i;;){var c=n.delegate;if(c){var l=T(c,n);if(l){if(l===m)continue;return l}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(a===y)throw a=v,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);a=d;var u=p(t,e,n);if("normal"===u.type){if(a=n.done?v:g,u.arg===m)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(a=v,n.method="throw",n.arg=u.arg)}}}function T(t,e){var n=e.method,a=t.iterator[n];if(a===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=r,T(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var o=p(a,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,m;var i=o.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,m):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,m)}function P(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function C(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function O(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(P,this),this.reset(!0)}function N(e){if(e||""===e){var n=e[l];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,i=function t(){for(;++a<e.length;)if(o.call(e,a))return t.value=e[a],t.done=!1,t;return t.value=r,t.done=!0,t};return i.next=i}}throw new TypeError(t(e)+" is not iterable")}return x.prototype=w,i(_,"constructor",{value:w,configurable:!0}),i(w,"constructor",{value:x,configurable:!0}),x.displayName=f(w,s,"GeneratorFunction"),n.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===x||"GeneratorFunction"===(e.displayName||e.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,w):(t.__proto__=w,f(t,s,"GeneratorFunction")),t.prototype=Object.create(_),t},n.awrap=function(t){return{__await:t}},E(D.prototype),f(D.prototype,u,(function(){return this})),n.AsyncIterator=D,n.async=function(t,e,r,a,o){void 0===o&&(o=Promise);var i=new D(h(t,e,r,a),o);return n.isGeneratorFunction(e)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},E(_),f(_,s,"Generator"),f(_,l,(function(){return this})),f(_,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},n.values=N,O.prototype={constructor:O,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(C),!t)for(var e in this)"t"===e.charAt(0)&&o.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,a){return c.type="throw",c.arg=t,e.next=n,a&&(e.method="next",e.arg=r),!!a}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var l=o.call(i,"catchLoc"),u=o.call(i,"finallyLoc");if(l&&u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(l){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&o.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var a=n;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,m):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),C(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var a=n.arg;C(r)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:N(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),m}},n}function r(t,e,r,n,a,o,i){try{var c=t[o](i),l=c.value}catch(u){return void r(u)}c.done?e(l):Promise.resolve(l).then(n,a)}function n(t){return function(){var e=this,n=arguments;return new Promise((function(a,o){var i=t.apply(e,n);function c(t){r(i,a,o,c,l,"next",t)}function l(t){r(i,a,o,c,l,"throw",t)}c(void 0)}))}}System.register(["./index-legacy52.js?v=1714377894636","./index-legacy53.js?v=1714377894636","./index-legacy39.js?v=1714377894636","./index-legacy54.js?v=1714377894636","./index-legacy58.js?v=1714377894636","./index-legacy59.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./docker.table-legacy.js?v=1714377894636","./docker.popup-legacy.js?v=1714377894636","./docker.api-legacy.js?v=1714377894636","./docker.store-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./progress-legacy.js?v=1714377894636","./select-legacy.js?v=1714377894636","./empty-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./dropdown-legacy.js?v=1714377894636","./index-legacy45.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./index-legacy38.js?v=1714377894636","./element-ui.common-legacy.js?v=1714377894636","./date-util-legacy.js?v=1714377894636","./vdom-legacy.js?v=1714377894636","./index-legacy62.js?v=1714377894636","./cascader-panel-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636"],(function(t,r){"use strict";var a,o,i,c,l,u,s,f,h,p,y,g,d,v,m,b,x,w,j,L,k,_,E,D,S,T,P;return{setters:[function(t){a=t._},function(t){o=t._},function(t){i=t._},function(t){c=t._},function(t){l=t._},function(t){u=t._},function(t){s=t.e,f=t.b,h=t.v,p=t.L,y=t.h,g=t.j,d=t.H},function(t){v=t.g,m=t.P,b=t.n},function(t){x=t.a},function(t){w=t.p,j=t.h,L=t.i,k=t.S,_=t.j,E=t.N,D=t.k,S=t.l},function(t){T=t.e},function(t){P=t.g},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],execute:function(){var r=s({__name:"DockerImages",setup:function(t){var r,a=g().proxy,o=f(),i=f(JSON.parse(null!==(r=localStorage.getItem("dockerMirrorTableColumn"))&&void 0!==r?r:"[]")||[]),c=P(),l=c.refs.mirrorTableData,u=c.getMList,s=v().refs.mainHeight,b=h({selectList:[]}),C=f("");p("mirrorRowData",(function(){return l.value.rowData})),p("selectList",(function(){return b.selectList}));var O,N=f([{label:"批量删除",value:"delete",event:function(){}}]),G=f([{active:!0,content:a.$t("Docker.stashPull"),event:function(){w()}},{active:!1,content:a.$t("Docker.importMirror"),event:function(){j()}},{active:!1,content:a.$t("Docker.buildMirror"),event:function(){L()}},{active:!1,content:"线上镜像",event:function(){k()}},{active:!1,content:a.$t("Docker.clearMirror"),event:(O=n(e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:_();case 1:case"end":return t.stop()}}),t)}))),function(){return O.apply(this,arguments)})}]),$=[],B=!1,M=0,I=h({isRecurrence:!1,describe:{title:"",th:"",message:"",propsValue:"name"},tableDisplayConfig:{label:"状态",prop:"status",render:function(t){return d("span",{class:0!==$.length||B?$.includes(t.id)?"text-primary":"text-danger":"text-warning"},function(){if(0!==$.length||B){var e=$.includes(t.id)?"执行成功":"执行失败";return M++,e}return"等待执行"}())}}}),F=function(){var t=n(e().mark((function t(r){var n,o,i;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n={id:r.id,name:r.name,force:"0"},t.prev=1,t.next=4,a.$confirm({type:"calc",title:"删除镜像【".concat(r.name,"】"),width:"35rem",message:"您真的要删除镜像【".concat(r.name,"】吗？")});case 4:return t.next=6,T({data:JSON.stringify(n)});case 6:o=t.sent,(i=o.data).status?(a.$message.success(i.msg),u()):a.$message.error(i.msg),t.next=14;break;case 11:t.prev=11,t.t0=t.catch(1);case 14:case"end":return t.stop()}}),t,null,[[1,11]])})));return function(e){return t.apply(this,arguments)}}(),H=function(t){D(t)},z=function(t){S(t)},J=function(){var t=n(e().mark((function t(r){var n,a,o,i,c;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=r.id,a=r.name,t.prev=1,o={id:n,name:a,force:"0"},t.next=5,T({data:JSON.stringify(o)});case 5:if(i=t.sent,!(c=i.data).status){t.next=12;break}return $.push(n),t.abrupt("return",c);case 12:return t.abrupt("return",Promise.reject(c));case 13:t.next=18;break;case 15:return t.prev=15,t.t0=t.catch(1),t.abrupt("return",Promise.reject(!1));case 18:return t.prev=18,t.finish(18);case 21:case"end":return t.stop()}}),t,null,[[1,15,18,21]])})));return function(e){return t.apply(this,arguments)}}(),R=x({pushDataEvent:H,exportDataEvent:z,deleteDataEvent:F});return y(n(e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:u(),R.value=m(i.value,R.value);case 2:case"end":return t.stop()}}),t)})))),{__sfc:!0,vm:a,Table:o,dockerMirrorTableColumnLocal:i,mirrorTableData:l,getMList:u,mainHeight:s,select:b,batchType:C,tableBatchData:N,tableBtnGroup:G,list:$,isComplete:B,index:M,batchConfig:I,batchEvent:function(t,e,r){if("delete"===t)return J(e)},handleBathComplete:function(t){B=!0,u()},changePageLimit:function(t){l.value.limit=t,l.value.p=1,u("page")},changePageSize:function(t){l.value.p=t,u("page")},deleteDataEvent:F,pushDataEvent:H,exportDataEvent:z,batchDeleteData:J,handleBatch:function(t){B=!1,$=[],M=0;var e=[];if("delete"===t)e=["删除","彻底失去访问和操作权限"];C.value=t,I.isRecurrence=!0,I.describe.th="镜像名",I.describe.title="批量".concat(e[0],"镜像"),I.describe.message="批量".concat(e[0],"已选的镜像，是否继续操作！")},handleSelectionChange:function(t){b.selectList=t},tableColumn:R,NPSDialog:E}}});t("default",b(r,(function(){var t=this,e=t._self._c,r=t._self._setupProxy;return e("div",{staticClass:"relative"},[e(u,{scopedSlots:t._u([{key:"header-left",fn:function(){return[e("div",{staticClass:"flex items-center"},[e(l,{attrs:{group:r.tableBtnGroup}}),e("a",{staticClass:"cursor-pointer ml-[1rem] text-[#20a53a] hover:text-[#1d9534]",on:{click:function(t){return r.NPSDialog()}}},[t._v("需求反馈")])],1)]},proxy:!0},{key:"header-right",fn:function(){return[e(c,{attrs:{name:"dockerMirrorTableColumn",column:r.tableColumn}})]},proxy:!0},{key:"content",fn:function(){return[e(i,{directives:[{name:"loading",rawName:"v-loading",value:r.mirrorTableData.loading,expression:"mirrorTableData.loading"}],key:"ImageTable",ref:"Table",attrs:{column:r.tableColumn,"max-height":r.mainHeight-220,data:r.mirrorTableData.showList,description:"镜像列表为空","element-loading-text":"正在加载镜像列表，请稍后..."},on:{"selection-change":r.handleSelectionChange}})]},proxy:!0},{key:"footer-left",fn:function(){return[e(o,{attrs:{data:r.tableBatchData,config:r.batchConfig,"batch-fn":r.batchEvent},on:{"handle-batch":r.handleBatch,"handle-complete":r.handleBathComplete}})]},proxy:!0},{key:"footer-right",fn:function(){return[e(a,{attrs:{total:r.mirrorTableData.total,"current-page":r.mirrorTableData.p,"page-size":r.mirrorTableData.limit},on:{"update:currentPage":function(e){return t.$set(r.mirrorTableData,"p",e)},"update:current-page":function(e){return t.$set(r.mirrorTableData,"p",e)},"size-change":r.changePageLimit,"current-change":r.changePageSize}})]},proxy:!0},{key:"popup",fn:function(){},proxy:!0}])})],1)}),[],!1,null,"59953820",null,null).exports)}}}))}();
