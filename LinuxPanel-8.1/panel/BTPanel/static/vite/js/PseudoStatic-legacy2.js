!function(){function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */t=function(){return n};var r,n={},a=Object.prototype,o=a.hasOwnProperty,i=Object.defineProperty||function(e,t,r){e[t]=r.value},c="function"==typeof Symbol?Symbol:{},u=c.iterator||"@@iterator",s=c.asyncIterator||"@@asyncIterator",l=c.toStringTag||"@@toStringTag";function f(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{f({},"")}catch(r){f=function(e,t,r){return e[t]=r}}function p(e,t,r,n){var a=t&&t.prototype instanceof x?t:x,o=Object.create(a.prototype),c=new O(n||[]);return i(o,"_invoke",{value:P(e,r,c)}),o}function h(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}n.wrap=p;var v="suspendedStart",m="suspendedYield",y="executing",d="completed",g={};function x(){}function w(){}function b(){}var _={};f(_,u,(function(){return this}));var j=Object.getPrototypeOf,L=j&&j(j(N([])));L&&L!==a&&o.call(L,u)&&(_=L);var k=b.prototype=x.prototype=Object.create(_);function E(e){["next","throw","return"].forEach((function(t){f(e,t,(function(e){return this._invoke(t,e)}))}))}function S(t,r){function n(a,i,c,u){var s=h(t[a],t,i);if("throw"!==s.type){var l=s.arg,f=l.value;return f&&"object"==e(f)&&o.call(f,"__await")?r.resolve(f.__await).then((function(e){n("next",e,c,u)}),(function(e){n("throw",e,c,u)})):r.resolve(f).then((function(e){l.value=e,c(l)}),(function(e){return n("throw",e,c,u)}))}u(s.arg)}var a;i(this,"_invoke",{value:function(e,t){function o(){return new r((function(r,a){n(e,t,r,a)}))}return a=a?a.then(o,o):o()}})}function P(e,t,n){var a=v;return function(o,i){if(a===y)throw new Error("Generator is already running");if(a===d){if("throw"===o)throw i;return{value:r,done:!0}}for(n.method=o,n.arg=i;;){var c=n.delegate;if(c){var u=C(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(a===v)throw a=d,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);a=y;var s=h(e,t,n);if("normal"===s.type){if(a=n.done?d:m,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(a=d,n.method="throw",n.arg=s.arg)}}}function C(e,t){var n=t.method,a=e.iterator[n];if(a===r)return t.delegate=null,"throw"===n&&e.iterator.return&&(t.method="return",t.arg=r,C(e,t),"throw"===t.method)||"return"!==n&&(t.method="throw",t.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var o=h(a,e.iterator,t.arg);if("throw"===o.type)return t.method="throw",t.arg=o.arg,t.delegate=null,g;var i=o.arg;return i?i.done?(t[e.resultName]=i.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=r),t.delegate=null,g):i:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,g)}function T(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function F(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function O(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(T,this),this.reset(!0)}function N(t){if(t||""===t){var n=t[u];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var a=-1,i=function e(){for(;++a<t.length;)if(o.call(t,a))return e.value=t[a],e.done=!1,e;return e.value=r,e.done=!0,e};return i.next=i}}throw new TypeError(e(t)+" is not iterable")}return w.prototype=b,i(k,"constructor",{value:b,configurable:!0}),i(b,"constructor",{value:w,configurable:!0}),w.displayName=f(b,l,"GeneratorFunction"),n.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===w||"GeneratorFunction"===(t.displayName||t.name))},n.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,b):(e.__proto__=b,f(e,l,"GeneratorFunction")),e.prototype=Object.create(k),e},n.awrap=function(e){return{__await:e}},E(S.prototype),f(S.prototype,s,(function(){return this})),n.AsyncIterator=S,n.async=function(e,t,r,a,o){void 0===o&&(o=Promise);var i=new S(p(e,t,r,a),o);return n.isGeneratorFunction(t)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},E(k),f(k,l,"Generator"),f(k,u,(function(){return this})),f(k,"toString",(function(){return"[object Generator]"})),n.keys=function(e){var t=Object(e),r=[];for(var n in t)r.push(n);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},n.values=N,O.prototype={constructor:O,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(F),!e)for(var t in this)"t"===t.charAt(0)&&o.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=r)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function n(n,a){return c.type="throw",c.arg=e,t.next=n,a&&(t.method="next",t.arg=r),!!a}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var u=o.call(i,"catchLoc"),s=o.call(i,"finallyLoc");if(u&&s){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&o.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var a=n;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=e,i.arg=t,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),F(r),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var a=n.arg;F(r)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,n){return this.delegate={iterator:N(e),resultName:t,nextLoc:n},"next"===this.method&&(this.arg=r),g}},n}function r(e,t,r,n,a,o,i){try{var c=e[o](i),u=c.value}catch(s){return void r(s)}c.done?t(u):Promise.resolve(u).then(n,a)}function n(e){return function(){var t=this,n=arguments;return new Promise((function(a,o){var i=e.apply(t,n);function c(e){r(i,a,o,c,u,"next",e)}function u(e){r(i,a,o,c,u,"throw",e)}c(void 0)}))}}System.register(["./index-legacy85.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./form-legacy.js?v=1714377894636","./index-legacy118.js?v=1714377894636","./index-legacy120.js?v=1714377894636","./select-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./site.store-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636"],(function(e,r){"use strict";var a,o,i,c,u,s,l,f,p,h,v,m,y,d,g,x,w,b,_,j,L,k;return{setters:[function(e){a=e._},function(e){o=e.q,i=e.s,c=e.w,u=e.x},function(e){s=e.g,l=e.n,f=e.a,p=e.q,h=e.b},null,null,function(e){v=e._},function(e){m=e._},null,function(e){y=e.e,d=e.b,g=e.v,x=e.h,w=e.j},function(e){b=e.g,_=e.cm,j=e.ai,L=e.al,k=e.cn},null,null,null,null,null,null,null],execute:function(){var r=y({__name:"PseudoStatic",props:{compData:{default:function(){return{}}}},setup:function(e){var r=e,a=w().proxy,o=d(""),i=d(""),c=d([]),u=d(!1),l=d(!1),f=d(!1),p=d(["php","proxy","html","phpasync","nginx"]),h=s().refs.webServerType,v=b().refs,m=v.modulesTableParams,y=v.siteTabActiveList,E=v.siteInfo,S=g({name:""}),P=d({mode:"ace/mode/nginx",theme:"ace/theme/chrome",wrap:!0,showInvisibles:!1,showFoldWidgets:!1,useSoftTabs:!0,tabSize:2,showPrintMargin:!1,readOnly:!1,fontSize:"12px"}),C=d(""),T=d([{text:"请选择您的应用，若设置伪静态后，网站无法正常访问，请尝试设置回default"},{text:"您可以对伪静态规则进行修改，修改完后保存即可。"}]),F=d(""),O=function(){var e=n(t().mark((function e(){var r;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u.value=!0,e.prev=1,e.next=4,_({siteName:("php"===F.value||"proxy"===F.value?"":F.value+"_")+E.value.name});case 4:r=e.sent,c.value=r.data.rewrite,C.value=r.data.sitePath+"/.htaccess","nginx"===h.value&&(C.value="/www/server/panel/vhost/rewrite/".concat(("php"===F.value||"proxy"===F.value?"":F.value+"_")+E.value.name,".conf")),i.value=r.data.rewrite[0],e.next=14;break;case 11:e.prev=11,e.t0=e.catch(1);case 14:return e.prev=14,u.value=!1,e.finish(14);case 17:case"end":return e.stop()}}),e,null,[[1,11,14,17]])})));return function(){return e.apply(this,arguments)}}(),N=function(){var e=n(t().mark((function e(r){var n,a;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,u.value=!0,e.next=4,j({path:r||"".concat(C.value)});case 4:n=e.sent,a=n.data,o.value=a.data,u.value=!1,e.next=13;break;case 10:e.prev=10,e.t0=e.catch(0);case 13:return e.prev=13,u.value=!1,e.finish(13);case 16:case"end":return e.stop()}}),e,null,[[0,10,13,16]])})));return function(t){return e.apply(this,arguments)}}(),$=function(){var e=n(t().mark((function e(){var r,n;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=a.$load("正在保存伪静态内容，请稍候..."),e.prev=1,e.next=4,L({data:o.value,encoding:"utf-8",path:"".concat(C.value)});case 4:n=e.sent,a.$message.msg({dangerouslyUseHTMLString:!0,message:n.msg,type:n.status?"success":"error",duration:n.status?2e3:0,showClose:!n.status}),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(1);case 11:return e.prev=11,r.close(),e.finish(11);case 14:case"end":return e.stop()}}),e,null,[[1,8,11,14]])})));return function(){return e.apply(this,arguments)}}(),D=function(){var e=n(t().mark((function e(){var r,i;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a.$refs.tempFormRef.validate(function(){var e=n(t().mark((function e(r){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r){e.next=2;break}return e.abrupt("return");case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),S.name=S.name.trim(),!S.name.includes(" ")){e.next=4;break}return e.abrupt("return",a.$message.error("模板名称不能包含空格"));case 4:if(""!==S.name){e.next=6;break}return e.abrupt("return",a.$message.error("模板名称不能为空"));case 6:if(!c.value.includes(S.name)){e.next=8;break}return e.abrupt("return",a.$message.error("模板名称不能和已有的模板名称重复且不可为空"));case 8:return r=a.$load("正在设置模板，请稍候..."),e.prev=9,e.next=12,k({data:o.value,name:S.name});case 12:return i=e.sent,a.$message.request(i),l.value=!1,S.name="",e.next=18,O();case 18:return e.next=20,N();case 20:e.next=25;break;case 22:e.prev=22,e.t0=e.catch(9);case 25:return e.prev=25,r.close(),e.finish(25);case 28:case"end":return e.stop()}}),e,null,[[9,22,25,28]])})));return function(){return e.apply(this,arguments)}}();return x(n(t().mark((function e(){var r,n,a;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=null===(r=E.value.project_type)||void 0===r?void 0:r.toLowerCase(),F.value=a,f.value=!(null===(n=E.value)||void 0===n||null===(n=n.project_config)||void 0===n||!n.bind_extranet),p.value.includes(F.value)&&(f.value=!0),e.next=6,O();case 6:return e.next=8,N();case 8:case"end":return e.stop()}}),e)})))),{__sfc:!0,vm:a,props:r,staticContent:o,textValue:i,optionData:c,textLoading:u,otherSavePopup:l,isBindExtranet:f,specialData:p,webServerType:h,modulesTableParams:m,siteTabActiveList:y,siteInfo:E,tempForm:S,templateRules:{name:[{required:!0,message:"请输入模板名称",trigger:"blur"}]},config:P,sitePath:C,helpList:T,siteType:F,getReWriteData:O,getReWriteBody:N,handleChange:function(e){var t="/www/server/panel/rewrite/".concat(h.value,"/").concat(e,".conf");N("0.当前"===e?"":t)},saveData:$,setSave:D,onCancel:function(){l.value=!1,S.name="",a.$refs.tempFormRef.clearValidate()},jumpPath:function(){y.value.moduleSettingsAct="mapping",y.value.isJump=!0}}}});e("default",l(r,(function(){var e=this,t=e._self._c,r=e._self._setupProxy;return t("div",{staticClass:"h-full"},[r.isBindExtranet?t("div",["php"===r.siteType||"proxy"===r.siteType||"phpasync"===r.siteType?t("div",{staticClass:"flex items-center justify-between"},[t(o,{on:{change:r.handleChange},model:{value:r.textValue,callback:function(e){r.textValue=e},expression:"textValue"}},e._l(r.optionData,(function(e,r){return t(i,{key:r,attrs:{value:e,label:e}})})),1),t("span",{staticClass:"flex items-center"},[e._v("规则转换工具： "),t(f,{attrs:{href:"https://www.bt.cn/Tools"}},[e._v("Apache转Nginx "),t("i",{staticClass:"el-icon-paperclip"})])],1)],1):e._e(),t(m,{directives:[{name:"loading",rawName:"v-loading",value:r.textLoading,expression:"textLoading"}],staticClass:"!h-[40rem] !w-full my-12x border border-[#DCDFE6] rounded-4x",attrs:{id:"staticContentRef","file-path":"".concat(r.sitePath),config:r.config},model:{value:r.staticContent,callback:function(e){r.staticContent=e},expression:"staticContent"}}),t("div",[t(p,{on:{click:r.saveData}},[e._v("保存")]),"php"===r.siteType||"proxy"===r.siteType?t(p,{on:{click:function(e){r.otherSavePopup=!0}}},[e._v("另存为模板")]):e._e()],1),t(v,{staticClass:"ml-20x mt-20x",attrs:{list:r.helpList,"list-style":"disc"}})],1):t("div",{staticClass:"bg-[#7F7F7F] flex items-center justify-center h-full"},[t("div",{staticClass:"bg-white px-48x py-16x text-[#333]"},[e._v(" 请开启 "),t(f,{on:{click:r.jumpPath}},[e._v("外网映射")]),e._v(" 后查看配置信息 ")],1)]),t(h,{attrs:{title:"另存为模板",visible:r.otherSavePopup,area:42,showFooter:""},on:{"update:visible":function(e){r.otherSavePopup=e},confirm:r.setSave,cancel:r.onCancel}},[t("div",{staticClass:"p-20x"},[t(c,{ref:"tempFormRef",attrs:{"label-position":"right",model:r.tempForm,rules:r.templateRules}},[t(u,{attrs:{label:"模板名称",prop:"name"}},[t(a,{attrs:{placeholder:"请输入模板名称"},model:{value:r.tempForm.name,callback:function(t){e.$set(r.tempForm,"name",t)},expression:"tempForm.name"}})],1)],1)],1)])],1)}),[],!1,null,"bf7091af",null,null).exports)}}}))}();
