!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function r(t){for(var r=1;r<arguments.length;r++){var a=null!=arguments[r]?arguments[r]:{};r%2?e(Object(a),!0).forEach((function(e){n(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):e(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function n(e,r,n){var a;return a=function(e,r){if("object"!=t(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,r||"default");if("object"!=t(a))return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(e)}(r,"string"),(r="symbol"==t(a)?a:String(a))in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function a(t){return function(t){if(Array.isArray(t))return o(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return o(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function i(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */i=function(){return r};var e,r={},n=Object.prototype,a=n.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},c="function"==typeof Symbol?Symbol:{},s=c.iterator||"@@iterator",u=c.asyncIterator||"@@asyncIterator",l=c.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(e){f=function(t,e,r){return t[e]=r}}function p(t,e,r,n){var a=e&&e.prototype instanceof b?e:b,i=Object.create(a.prototype),c=new N(n||[]);return o(i,"_invoke",{value:L(t,r,c)}),i}function h(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}r.wrap=p;var m="suspendedStart",d="suspendedYield",v="executing",y="completed",g={};function b(){}function w(){}function x(){}var j={};f(j,s,(function(){return this}));var k=Object.getPrototypeOf,_=k&&k(k(F([])));_&&_!==n&&a.call(_,s)&&(j=_);var O=x.prototype=b.prototype=Object.create(j);function P(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function E(e,r){function n(o,i,c,s){var u=h(e[o],e,i);if("throw"!==u.type){var l=u.arg,f=l.value;return f&&"object"==t(f)&&a.call(f,"__await")?r.resolve(f.__await).then((function(t){n("next",t,c,s)}),(function(t){n("throw",t,c,s)})):r.resolve(f).then((function(t){l.value=t,c(l)}),(function(t){return n("throw",t,c,s)}))}s(u.arg)}var i;o(this,"_invoke",{value:function(t,e){function a(){return new r((function(r,a){n(t,e,r,a)}))}return i=i?i.then(a,a):a()}})}function L(t,r,n){var a=m;return function(o,i){if(a===v)throw new Error("Generator is already running");if(a===y){if("throw"===o)throw i;return{value:e,done:!0}}for(n.method=o,n.arg=i;;){var c=n.delegate;if(c){var s=S(c,n);if(s){if(s===g)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(a===m)throw a=y,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);a=v;var u=h(t,r,n);if("normal"===u.type){if(a=n.done?y:d,u.arg===g)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(a=y,n.method="throw",n.arg=u.arg)}}}function S(t,r){var n=r.method,a=t.iterator[n];if(a===e)return r.delegate=null,"throw"===n&&t.iterator.return&&(r.method="return",r.arg=e,S(t,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var o=h(a,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,g;var i=o.arg;return i?i.done?(r[t.resultName]=i.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,g):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function C(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function D(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(C,this),this.reset(!0)}function F(r){if(r||""===r){var n=r[s];if(n)return n.call(r);if("function"==typeof r.next)return r;if(!isNaN(r.length)){var o=-1,i=function t(){for(;++o<r.length;)if(a.call(r,o))return t.value=r[o],t.done=!1,t;return t.value=e,t.done=!0,t};return i.next=i}}throw new TypeError(t(r)+" is not iterable")}return w.prototype=x,o(O,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=f(x,l,"GeneratorFunction"),r.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},r.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,l,"GeneratorFunction")),t.prototype=Object.create(O),t},r.awrap=function(t){return{__await:t}},P(E.prototype),f(E.prototype,u,(function(){return this})),r.AsyncIterator=E,r.async=function(t,e,n,a,o){void 0===o&&(o=Promise);var i=new E(p(t,e,n,a),o);return r.isGeneratorFunction(e)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},P(O),f(O,l,"Generator"),f(O,s,(function(){return this})),f(O,"toString",(function(){return"[object Generator]"})),r.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},r.values=F,N.prototype={constructor:N,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(D),!t)for(var r in this)"t"===r.charAt(0)&&a.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function n(n,a){return c.type="throw",c.arg=t,r.next=n,a&&(r.method="next",r.arg=e),!!a}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],c=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var s=a.call(i,"catchLoc"),u=a.call(i,"finallyLoc");if(s&&u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(s){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&a.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=t,i.arg=e,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),D(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var a=n.arg;D(r)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:F(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),g}},r}function c(t,e,r,n,a,o,i){try{var c=t[o](i),s=c.value}catch(u){return void r(u)}c.done?e(s):Promise.resolve(s).then(n,a)}function s(t){return function(){var e=this,r=arguments;return new Promise((function(n,a){var o=t.apply(e,r);function i(t){c(o,n,a,i,s,"next",t)}function s(t){c(o,n,a,i,s,"throw",t)}i(void 0)}))}}System.register(["./index-legacy85.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./form-legacy.js?v=1714377894636","./select-legacy.js?v=1714377894636","./index-legacy53.js?v=1714377894636","./index-legacy39.js?v=1714377894636","./index-legacy58.js?v=1714377894636","./index-legacy59.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./site.popup-legacy.js?v=1714377894636","./site.store-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./progress-legacy.js?v=1714377894636","./empty-legacy.js?v=1714377894636","./dropdown-legacy.js?v=1714377894636","./index-legacy45.js?v=1714377894636","./index-legacy38.js?v=1714377894636","./element-ui.common-legacy.js?v=1714377894636","./date-util-legacy.js?v=1714377894636","./vdom-legacy.js?v=1714377894636","./index-legacy62.js?v=1714377894636","./cascader-panel-legacy.js?v=1714377894636"],(function(t,e){"use strict";var n,o,c,u,l,f,p,h,m,d,v,y,g,b,w,x,j,k,_,O,P,E,L,S,C,D,N,F;return{setters:[function(t){n=t._},function(t){o=t.j,c=t.w,u=t.x,l=t.q,f=t.s},function(t){p=t.n,h=t.q,m=t.b},null,null,null,function(t){d=t._},function(t){v=t._},function(t){y=t._},function(t){g=t._},function(t){b=t.e,w=t.b,x=t.v,j=t.H,k=t.h,_=t.j},function(t){O=t.S},function(t){P=t.Z},function(t){E=t.g,L=t.aL,S=t.aM,C=t.D,D=t.aN,N=t.aO},function(t){F=t.c},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],execute:function(){var e=b({__name:"editGroup",props:{compData:null},setup:function(t){var e,n=t,o=_().proxy,c=w(),u=E(),l=u.refs,f=l.projectGroupData,p=l.modulesTableParams,h=u.getProjectGroup,m=u.getModulesList,d=x({list:[],loading:!1}),v=w(!1),y=w(),g=x({projectName:""}),b=x({projectName:[{required:!0,message:"请选择项目",trigger:"change"}]}),G=w(!1),A=w(),T=x({interval:n.compData.interval}),$=x({interval:[{validator:function(t,e,r){e<5||e>60||""===e||e%1!=0?r(new Error("请输入5-60之间的整数")):r()},trigger:["input","change"]}]}),q=w([{active:!0,content:"添加项目",event:function(){v.value=!0}},{content:"启动间隔",event:(e=s(i().mark((function t(){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:G.value=!0;case 1:case"end":return t.stop()}}),t)}))),function(){return e.apply(this,arguments)})}]),R=function(){var t=s(i().mark((function t(){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:y.value.validate(function(){var t=s(i().mark((function t(e){var r,a;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!e){t.next=18;break}return t.prev=1,r=o.$load("正在添加项目，请稍后..."),t.next=5,L({group_name:n.compData.name,sitename:g.projectName});case 5:if(a=t.sent,r.close(),o.$message.request(a),!a.status){t.next=14;break}return v.value=!1,t.next=12,m("phpAsync");case 12:nt(),g.projectName="";case 14:t.next=18;break;case 16:t.prev=16,t.t0=t.catch(1);case 18:case"end":return t.stop()}}),t,null,[[1,16]])})));return function(e){return t.apply(this,arguments)}}());case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),B=function(){var t=s(i().mark((function t(){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:A.value.validate(function(){var t=s(i().mark((function t(e){var r,a;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!e){t.next=13;break}return t.prev=1,r=o.$load("正在设置启动间隔，请稍后..."),t.next=5,S({group_name:n.compData.name,interval:T.interval});case 5:a=t.sent,r.close(),o.$message.request(a),a.status&&(G.value=!1,h()),t.next=13;break;case 11:t.prev=11,t.t0=t.catch(1);case 13:case"end":return t.stop()}}),t,null,[[1,11]])})));return function(e){return t.apply(this,arguments)}}());case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),I=x({selectList:[]}),M=w(""),H=w([{label:"启动项目",value:"start",event:function(){}},{label:"停止项目",value:"stop",event:function(){}},{label:"删除项目",value:"delete",event:function(){}}]),J=[],Y=!1,U=0,V=x({isRecurrence:!1,describe:{title:"",th:"",message:"",propsValue:"sitename"},tableDisplayConfig:{label:"状态",prop:"status",render:function(t){return j("span",{class:0!==J.length||Y?J.find((function(e){return e.sitename===t.sitename})).status?"text-primary":"text-danger":"text-warning"},function(){if(0!==J.length||Y){var e=J.find((function(e){return e.sitename===t.sitename})).msg;return U++,e}return"等待执行"}())}}}),Z=function(){var t=s(i().mark((function t(e){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(Y=!0,"delete"===M.value){t.next=4;break}return t.next=4,m("phpAsync");case 4:nt();case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),z=function(){var t=s(i().mark((function t(e){var r,n;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r={sitename:e.sitename,project_action:e.status?"stop":"start"},f.value.loading=!0,t.next=4,C({data:JSON.stringify(r)});case 4:n=t.sent,f.value.loading=!1,n.status?(nt(),m("phpAsync"),o.$message.success(n.msg)):o.$message.error(n.msg);case 7:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),K=function(){var t=s(i().mark((function t(e){var r;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o.$confirm({type:"calc",title:"删除项目名称【".concat(e.sitename,"】"),width:"35rem",message:"您真的要删除项目名称【".concat(e.sitename,"】吗？")});case 2:return t.next=4,D({group_name:n.compData.name,sitename:e.sitename});case 4:r=t.sent,o.$message.request(r),r.status&&nt();case 7:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),Q=function(){var t=s(i().mark((function t(e){var r,a,o;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.sitename,e.project_id,t.prev=1,t.next=4,D({group_name:n.compData.name,sitename:r});case 4:if(a=t.sent,o=a.data,J.push({sitename:r,msg:o.msg,status:o.status}),!o.status){t.next=11;break}return t.abrupt("return",o);case 11:return t.abrupt("return",Promise.reject(o));case 12:t.next=17;break;case 14:return t.prev=14,t.t0=t.catch(1),t.abrupt("return",Promise.reject(!1));case 17:return t.prev=17,t.finish(17);case 20:case"end":return t.stop()}}),t,null,[[1,14,17,20]])})));return function(e){return t.apply(this,arguments)}}(),W=function(){var t=s(i().mark((function t(e,r){var n;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,C({data:JSON.stringify({sitename:e.sitename,project_action:e.status?"stop":"start"})});case 3:if(n=t.sent,J.push({sitename:e.sitename,msg:n.msg,status:n.status}),!n.status){t.next=9;break}return t.abrupt("return",n);case 9:return t.abrupt("return",Promise.reject(n));case 10:t.next=15;break;case 12:return t.prev=12,t.t0=t.catch(0),t.abrupt("return",Promise.reject(!1));case 15:return t.prev=15,t.finish(15);case 18:case"end":return t.stop()}}),t,null,[[0,12,15,18]])})));return function(e,r){return t.apply(this,arguments)}}(),X=function(){var t=s(i().mark((function t(e){var r;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,D({group_name:n.compData.name,sitename:e.sitename});case 3:r=t.sent,o.$message.request(r),r.status&&nt(),t.next=10;break;case 8:t.prev=8,t.t0=t.catch(0);case 10:case"end":return t.stop()}}),t,null,[[0,8]])})));return function(e){return t.apply(this,arguments)}}(),tt=P({changeStatusEvent:z,deleteGroupEvent:X}),et=function(){var t=s(i().mark((function t(){var e,r;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:try{d.loading=!0,d.list=[],e=f.value.list.find((function(t){return t.name===n.compData.name})),r=e.project_list,d.list=F(r,"array",[])}catch(a){}finally{d.loading=!1}case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),rt=function(){var t,e=document.querySelector(".project-table .el-table__body-wrapper tbody");O.create(e,{animation:500,onEnd:(t=s(i().mark((function t(e){var c,s,u,l;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return c=a(d.list),s=c.splice(e.oldIndex,1)[0],c.splice(e.newIndex,0,s),u=c.map((function(t){return t.sitename})),d=r({},d),t.next=7,N({group_name:n.compData.name,project_list:u.join(",")});case 7:l=t.sent,o.$message.request(l);case 9:case"end":return t.stop()}}),t)}))),function(e){return t.apply(this,arguments)})})},nt=function(){var t=s(i().mark((function t(){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,h();case 2:return t.next=4,et();case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return k(s(i().mark((function t(){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:et(),rt();case 2:case"end":return t.stop()}}),t)})))),{__sfc:!0,props:n,vm:o,Table:c,projectGroupData:f,modulesTableParams:p,getProjectGroup:h,getModulesList:m,projectData:d,showAddPopup:v,addFromRef:y,addForm:g,addRules:b,showConfigPopup:G,configFormRef:A,configForm:T,configRules:$,tableBtnGroup:q,onConfirmAdd:R,onConfirmConfig:B,select:I,batchType:M,tableBatchData:H,list:J,isComplete:Y,index:U,batchConfig:V,batchEvent:function(t,e,r){switch(t){case"start":case"stop":return W(e);case"delete":return Q(e)}},handleBathComplete:Z,changeStatusEvent:z,deleteDataEvent:K,batchDeleteData:Q,batchStatusData:W,handleBatch:function(t){Y=!1,J=[],U=0;var e=[];switch(t){case"start":e=["启动","启动已选的项目"];break;case"stop":e=["停止","停止已选的项目"];break;case"delete":e=["删除","彻底失去访问和操作权限"]}M.value=t,V.isRecurrence=!0,V.describe.th="项目名称",V.describe.title="批量".concat(e[0],"项目"),V.describe.message="批量".concat(e[0],"已选的项目，是否继续操作！")},handleSelectionChange:function(t){I.selectList=t},deleteGroupEvent:X,tableColumn:tt,getGroupProject:et,rowDrop:rt,refresh:nt}}});t("default",p(e,(function(){var t=this,e=t._self._c,r=t._self._setupProxy;return e("div",{staticClass:"p-[2rem]"},[e(g,{scopedSlots:t._u([{key:"header-left",fn:function(){return[e("div",{staticClass:"flex items-center"},[e(y,{attrs:{group:r.tableBtnGroup}})],1)]},proxy:!0},{key:"header-right",fn:function(){return[e(o,{staticClass:"item",attrs:{effect:"dark",content:"点击刷新数据",placement:"top-start"}},[e(h,{attrs:{type:"default",icon:"el-icon-refresh"},on:{click:r.refresh}})],1)]},proxy:!0},{key:"content",fn:function(){return[e(v,{directives:[{name:"loading",rawName:"v-loading",value:r.projectData.loading,expression:"projectData.loading"}],ref:"Table",staticClass:"project-table",attrs:{"row-key":"project_id",column:r.tableColumn,"max-height":340,data:r.projectData.list,description:"项目列表为空","element-loading-text":"正在加载项目列表，请稍后..."},on:{"selection-change":r.handleSelectionChange}})]},proxy:!0},{key:"footer-left",fn:function(){return[e(d,{attrs:{data:r.tableBatchData,config:r.batchConfig,"batch-fn":r.batchEvent},on:{"handle-batch":r.handleBatch,"handle-complete":r.handleBathComplete}})]},proxy:!0},{key:"popup",fn:function(){return[e(m,{staticClass:"overflow-hidden",attrs:{title:"添加项目",visible:r.showAddPopup,area:42,"show-footer":!0},on:{"update:visible":function(t){r.showAddPopup=t},confirm:r.onConfirmAdd}},[e("div",{staticClass:"p-20x"},[e(c,{ref:"addFromRef",attrs:{model:r.addForm,rules:r.addRules}},[e(u,{attrs:{label:"项目",prop:"projectName"}},[e(l,{staticClass:"w-[20rem]",attrs:{placeholder:"请选择项目"},model:{value:r.addForm.projectName,callback:function(e){t.$set(r.addForm,"projectName",e)},expression:"addForm.projectName"}},t._l(r.modulesTableParams.list,(function(t,r){return e(f,{key:r,attrs:{label:t.name,value:t.name}})})),1)],1)],1)],1)]),e(m,{staticClass:"overflow-hidden",attrs:{title:"设置启动间隔",visible:r.showConfigPopup,area:42,"show-footer":!0},on:{"update:visible":function(t){r.showConfigPopup=t},confirm:r.onConfirmConfig}},[e("div",{staticClass:"p-20x"},[e(c,{ref:"configFormRef",attrs:{model:r.configForm,rules:r.configRules}},[e(u,{attrs:{label:"项目启动间隔",prop:"interval"}},[e(n,{attrs:{placeholder:"请输入项目启动时间间隔",textType:"秒",max:"60",min:"5",type:"number"},model:{value:r.configForm.interval,callback:function(e){t.$set(r.configForm,"interval",e)},expression:"configForm.interval"}})],1)],1)],1)])]},proxy:!0}])})],1)}),[],!1,null,"7498f9b4",null,null).exports)}}}))}();