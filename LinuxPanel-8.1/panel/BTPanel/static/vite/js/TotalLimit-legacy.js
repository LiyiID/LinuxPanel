!function(){function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function r(e){for(var r=1;r<arguments.length;r++){var i=null!=arguments[r]?arguments[r]:{};r%2?t(Object(i),!0).forEach((function(t){n(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):t(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}function n(t,r,n){var i;return i=function(t,r){if("object"!=e(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var i=n.call(t,r||"default");if("object"!=e(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(r,"string"),(r="symbol"==e(i)?i:String(i))in t?Object.defineProperty(t,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[r]=n,t}function i(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */i=function(){return r};var t,r={},n=Object.prototype,a=n.hasOwnProperty,o=Object.defineProperty||function(e,t,r){e[t]=r.value},l="function"==typeof Symbol?Symbol:{},u=l.iterator||"@@iterator",c=l.asyncIterator||"@@asyncIterator",s=l.toStringTag||"@@toStringTag";function p(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{p({},"")}catch(t){p=function(e,t,r){return e[t]=r}}function f(e,t,r,n){var i=t&&t.prototype instanceof b?t:b,a=Object.create(i.prototype),l=new S(n||[]);return o(a,"_invoke",{value:P(e,r,l)}),a}function m(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}r.wrap=f;var v="suspendedStart",h="suspendedYield",y="executing",d="completed",g={};function b(){}function x(){}function w(){}var _={};p(_,u,(function(){return this}));var L=Object.getPrototypeOf,j=L&&L(L(N([])));j&&j!==n&&a.call(j,u)&&(_=j);var k=w.prototype=b.prototype=Object.create(_);function O(e){["next","throw","return"].forEach((function(t){p(e,t,(function(e){return this._invoke(t,e)}))}))}function E(t,r){function n(i,o,l,u){var c=m(t[i],t,o);if("throw"!==c.type){var s=c.arg,p=s.value;return p&&"object"==e(p)&&a.call(p,"__await")?r.resolve(p.__await).then((function(e){n("next",e,l,u)}),(function(e){n("throw",e,l,u)})):r.resolve(p).then((function(e){s.value=e,l(s)}),(function(e){return n("throw",e,l,u)}))}u(c.arg)}var i;o(this,"_invoke",{value:function(e,t){function a(){return new r((function(r,i){n(e,t,r,i)}))}return i=i?i.then(a,a):a()}})}function P(e,r,n){var i=v;return function(a,o){if(i===y)throw new Error("Generator is already running");if(i===d){if("throw"===a)throw o;return{value:t,done:!0}}for(n.method=a,n.arg=o;;){var l=n.delegate;if(l){var u=F(l,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(i===v)throw i=d,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);i=y;var c=m(e,r,n);if("normal"===c.type){if(i=n.done?d:h,c.arg===g)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(i=d,n.method="throw",n.arg=c.arg)}}}function F(e,r){var n=r.method,i=e.iterator[n];if(i===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,F(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=m(i,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,g;var o=a.arg;return o?o.done?(r[e.resultName]=o.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):o:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function C(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function D(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function S(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(C,this),this.reset(!0)}function N(r){if(r||""===r){var n=r[u];if(n)return n.call(r);if("function"==typeof r.next)return r;if(!isNaN(r.length)){var i=-1,o=function e(){for(;++i<r.length;)if(a.call(r,i))return e.value=r[i],e.done=!1,e;return e.value=t,e.done=!0,e};return o.next=o}}throw new TypeError(e(r)+" is not iterable")}return x.prototype=w,o(k,"constructor",{value:w,configurable:!0}),o(w,"constructor",{value:x,configurable:!0}),x.displayName=p(w,s,"GeneratorFunction"),r.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===x||"GeneratorFunction"===(t.displayName||t.name))},r.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,w):(e.__proto__=w,p(e,s,"GeneratorFunction")),e.prototype=Object.create(k),e},r.awrap=function(e){return{__await:e}},O(E.prototype),p(E.prototype,c,(function(){return this})),r.AsyncIterator=E,r.async=function(e,t,n,i,a){void 0===a&&(a=Promise);var o=new E(f(e,t,n,i),a);return r.isGeneratorFunction(t)?o:o.next().then((function(e){return e.done?e.value:o.next()}))},O(k),p(k,s,"Generator"),p(k,u,(function(){return this})),p(k,"toString",(function(){return"[object Generator]"})),r.keys=function(e){var t=Object(e),r=[];for(var n in t)r.push(n);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},r.values=N,S.prototype={constructor:S,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(D),!e)for(var r in this)"t"===r.charAt(0)&&a.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function n(n,i){return l.type="throw",l.arg=e,r.next=n,i&&(r.method="next",r.arg=t),!!i}for(var i=this.tryEntries.length-1;i>=0;--i){var o=this.tryEntries[i],l=o.completion;if("root"===o.tryLoc)return n("end");if(o.tryLoc<=this.prev){var u=a.call(o,"catchLoc"),c=a.call(o,"finallyLoc");if(u&&c){if(this.prev<o.catchLoc)return n(o.catchLoc,!0);if(this.prev<o.finallyLoc)return n(o.finallyLoc)}else if(u){if(this.prev<o.catchLoc)return n(o.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return n(o.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&a.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var i=n;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var o=i?i.completion:{};return o.type=e,o.arg=t,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(o)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),D(r),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var i=n.arg;D(r)}return i}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:N(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},r}function a(e,t,r,n,i,a,o){try{var l=e[a](o),u=l.value}catch(c){return void r(c)}l.done?t(u):Promise.resolve(u).then(n,i)}function o(e){return function(){var t=this,r=arguments;return new Promise((function(n,i){var o=e.apply(t,r);function l(e){a(o,n,i,l,u,"next",e)}function u(e){a(o,n,i,l,u,"throw",e)}l(void 0)}))}}System.register(["./main-legacy.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./index-legacy85.js?v=1714377894636","./select-legacy.js?v=1714377894636","./form-legacy.js?v=1714377894636","./index-legacy60.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./site.store-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636"],(function(e,t){"use strict";var n,a,l,u,c,s,p,f,m,v,h,y,d,g,b,x,w,_,L,j,k,O,E,P;return{setters:[function(e){n=e.l,a=e.n,l=e.D,u=e.q},function(e){c=e.w,s=e.x,p=e.q,f=e.s},null,function(e){m=e._},null,null,function(e){v=e._},function(e){h=e._},function(e){y=e.e,d=e.b,g=e.v,b=e.h,x=e.j},function(e){w=e.g,_=e.aA,L=e.aB,j=e.aC,k=e.aD,O=e.aE,E=e.aF,P=e.aG},null,null,null,null,null,null],execute:function(){var F=y({__name:"TotalLimit",props:{compData:{default:function(){}},isConfig:{type:Boolean,default:!1},siteData:null},setup:function(e,a){var l,u=a.expose,c=e,s=x().proxy,p=w(),f=p.refs.siteInfo,m=p.getPhpModulesList,v=d([{title:"论坛/博客",value:0,items:{perserver:300,perip:25,limit_rate:512}},{title:"图片站",value:1,items:{perserver:200,perip:10,limit_rate:1024}},{title:"下载站",value:2,items:{perserver:50,perip:3,limit_rate:2048}},{title:"商城",value:3,items:{perserver:500,perip:10,limit_rate:2048}},{title:"门户",value:4,items:{perserver:400,perip:15,limit_rate:1024}},{title:"企业",value:5,items:{perserver:60,perip:10,limit_rate:512}},{title:"视频",value:6,items:{perserver:150,perip:4,limit_rate:1024}},{title:"自定义",value:7,items:{perserver:"",perip:"",limit_rate:""}}]),y=d(!1),F=d(""),C=g({value:!0,perserver:300,perip:25,limit_rate:512,type:0}),D=d(!1),S=d(null===(l=c.compData.project_type)||void 0===l?void 0:l.toLowerCase()),N=function(){var e=o(i().mark((function e(t){var r,n;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!c.isConfig&&!c.compData.isConfig){e.next=25;break}if(e.prev=1,!C.value){e.next=6;break}T(),e.next=20;break;case 6:if(r=s.$load("正在关闭流量限制，请稍后..."),"html"!==S.value){e.next=13;break}return e.next=10,_({site_id:Number(c.compData.id)},S.value);case 10:n=e.sent,e.next=16;break;case 13:return e.next=15,L({id:c.compData.id});case 15:n=e.sent;case 16:return r.close(),s.$message.request(n),e.next=20,G();case 20:e.next=25;break;case 22:e.prev=22,e.t0=e.catch(1);case 25:case"end":return e.stop()}}),e,null,[[1,22]])})));return function(t){return e.apply(this,arguments)}}(),T=function(){var e=o(i().mark((function e(a){return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:s.$refs.totalLimitFormRef.validate(function(){var e=o(i().mark((function e(o){var l,u,p,f;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(o){e.next=2;break}return e.abrupt("return");case 2:if(l=s.$load("正在设置流量，请稍后..."),e.prev=3,!c.isConfig&&!c.compData.isConfig){e.next=17;break}if("php"===S.value||"proxy"===S.value){e.next=11;break}return e.next=8,j({perserver:C.perserver,perip:C.perip,limit_rate:C.limit_rate,site_id:c.compData.id},"nginx"===S.value?"proxy":S.value);case 8:u=e.sent,e.next=14;break;case 11:return e.next=13,k({id:c.compData.id,perserver:C.perserver,perip:C.perip,limit_rate:C.limit_rate});case 13:u=e.sent;case 14:return s.$message.request(u),G(),e.abrupt("return");case 17:return e.next=19,O(r(r({},C),{},{close_limit_net:C.value?0:1,site_ids:JSON.stringify(c.compData.map((function(e){return e.id})))}));case 19:return p=e.sent,f=[],e.next=23,p.data.errors.forEach((function(e){f.push(r(r({},e),{},{name:c.compData.find((function(t){return t.id===e.id})).name}))}));case 23:return e.next=25,p.data.succeed.forEach((function(e){f.push(r(r({},e),{},{name:c.compData.find((function(t){return t.id===e.id})).name}))}));case 25:return e.next=27,n({title:"批量设置结果",area:42,component:function(){return h((function(){return t.import("./index-legacy63.js?v=1714377894636")}),void 0,t.meta.url)},compData:{resultData:f,resultTitle:"结果"}});case 27:m(),a(),e.next=34;break;case 31:e.prev=31,e.t0=e.catch(3);case 34:return e.prev=34,l.close(),e.finish(34);case 37:case"end":return e.stop()}}),e,null,[[3,31,34,37]])})));return function(t){return e.apply(this,arguments)}}());case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),$=function(e){C.perserver=v.value[e].items.perserver,C.perip=v.value[e].items.perip,C.limit_rate=v.value[e].items.limit_rate},G=function(){var e=o(i().mark((function e(){var t;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(D.value=!0,e.prev=1,"php"===S.value||"proxy"===S.value){e.next=9;break}return e.next=6,E({site_id:c.compData.id},"nginx"===S.value?"proxy":S.value);case 6:t=e.sent,e.next=12;break;case 9:return e.next=11,P({id:c.compData.id});case 11:t=e.sent;case 12:if(t.data.hasOwnProperty("limit_rate")){e.next=15;break}return y.value=!0,e.abrupt("return",F.value=t.data.msg);case 15:C.value=!!t.data.value,C.limit_rate=t.data.limit_rate,C.perip=t.data.perip,C.perserver=t.data.perserver,Object.values(t.data).every((function(e){return 0===e}))?(C.value=!1,C.type=0,$(0)):(C.type=t.data.value-1,C.value=!0),-1===C.type&&(C.type=7),e.next=26;break;case 23:e.prev=23,e.t0=e.catch(1);case 26:return e.prev=26,D.value=!1,e.finish(26);case 29:case"end":return e.stop()}}),e,null,[[1,23,26,29]])})));return function(){return e.apply(this,arguments)}}();return u({getLimitRate:G}),b(o(i().mark((function e(){var t,r;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("node"===(r=null===(t=f.value.project_type)||void 0===t?void 0:t.toLowerCase())&&(r="nodejs"),S.value=r,!c.isConfig&&!c.compData.isConfig){e.next=8;break}return e.next=6,G();case 6:e.next=10;break;case 8:return e.next=10,$(0);case 10:case"end":return e.stop()}}),e)})))),{__sfc:!0,vm:s,props:c,siteInfo:f,getPhpModulesList:m,planList:v,rules:{perserver:[{required:!0,message:"请输入并发限制",trigger:"blur"}],perip:[{required:!0,message:"请输入单IP限制",trigger:"blur"}],limit_rate:[{required:!0,message:"请输入流量限制",trigger:"blur"}]},maskLayer:y,maskTip:F,totalLimitForm:C,viewLoading:D,siteType:S,handleCheckChange:N,onConfirm:T,handleChange:$,getLimitRate:G}}});e("default",a(F,(function(){var e=this,t=e._self._c,r=e._self._setupProxy;return t("div",{staticClass:"p-20x"},[t(v,{attrs:{visible:r.maskLayer,width:"36rem"}},[e._v(" "+e._s(r.maskTip)+" ")]),t(c,{directives:[{name:"loading",rawName:"v-loading",value:r.viewLoading,expression:"viewLoading"}],ref:"totalLimitFormRef",attrs:{model:r.totalLimitForm,rules:r.rules}},[t(s,{attrs:{label:"是否启用"}},[t(l,{on:{change:r.handleCheckChange},model:{value:r.totalLimitForm.value,callback:function(t){e.$set(r.totalLimitForm,"value",t)},expression:"totalLimitForm.value"}},[e._v("启用流量控制")])],1),t(s,{attrs:{label:"限制方案"}},[t(p,{staticClass:"w-[24rem]",on:{change:r.handleChange},model:{value:r.totalLimitForm.type,callback:function(t){e.$set(r.totalLimitForm,"type",t)},expression:"totalLimitForm.type"}},e._l(r.planList,(function(e){return t(f,{key:e.value,attrs:{label:e.title,value:e.value}})})),1)],1),t(s,{attrs:{label:"并发限制",prop:"perserver"}},[t(m,{attrs:{type:"number",min:0},model:{value:r.totalLimitForm.perserver,callback:function(t){e.$set(r.totalLimitForm,"perserver",t)},expression:"totalLimitForm.perserver"}}),t("span",{staticClass:"text-[#999] text-[1.2rem]"},[e._v("* 限制当前站点最大并发数")])],1),t(s,{attrs:{label:"单IP限制",prop:"perip"}},[t(m,{attrs:{type:"number",min:0},model:{value:r.totalLimitForm.perip,callback:function(t){e.$set(r.totalLimitForm,"perip",t)},expression:"totalLimitForm.perip"}}),t("span",{staticClass:"text-[#999] text-[1.2rem]"},[e._v("* 限制单个IP访问最大并发数")])],1),t(s,{attrs:{label:"流量限制",prop:"limit_rate"}},[t(m,{attrs:{type:"number",min:0},model:{value:r.totalLimitForm.limit_rate,callback:function(t){e.$set(r.totalLimitForm,"limit_rate",t)},expression:"totalLimitForm.limit_rate"}}),t("span",{staticClass:"text-[#999] text-[1.2rem]"},[e._v("* 限制每个请求的流量上限（单位：KB）")])],1),e.isConfig||e.compData.isConfig?t(s,{attrs:{label:" "}},[t(u,{on:{click:r.onConfirm}},[e._v(e._s(r.totalLimitForm.value?"保存":"保存并启用"))])],1):e._e()],1)],1)}),[],!1,null,"a0489b65",null,null).exports)}}}))}();