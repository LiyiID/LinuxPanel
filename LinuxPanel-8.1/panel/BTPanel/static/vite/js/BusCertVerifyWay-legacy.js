!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return n};var r,n={},o=Object.prototype,a=o.hasOwnProperty,i=Object.defineProperty||function(t,e,r){t[e]=r.value},l="function"==typeof Symbol?Symbol:{},s=l.iterator||"@@iterator",c=l.asyncIterator||"@@asyncIterator",u=l.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(r){f=function(t,e,r){return t[e]=r}}function p(t,e,r,n){var o=e&&e.prototype instanceof b?e:b,a=Object.create(o.prototype),l=new T(n||[]);return i(a,"_invoke",{value:S(t,r,l)}),a}function y(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}n.wrap=p;var h="suspendedStart",m="suspendedYield",v="executing",d="completed",g={};function b(){}function w(){}function x(){}var _={};f(_,s,(function(){return this}));var C=Object.getPrototypeOf,j=C&&C(C(P([])));j&&j!==o&&a.call(j,s)&&(_=j);var L=x.prototype=b.prototype=Object.create(_);function k(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function E(e,r){function n(o,i,l,s){var c=y(e[o],e,i);if("throw"!==c.type){var u=c.arg,f=u.value;return f&&"object"==t(f)&&a.call(f,"__await")?r.resolve(f.__await).then((function(t){n("next",t,l,s)}),(function(t){n("throw",t,l,s)})):r.resolve(f).then((function(t){u.value=t,l(u)}),(function(t){return n("throw",t,l,s)}))}s(c.arg)}var o;i(this,"_invoke",{value:function(t,e){function a(){return new r((function(r,o){n(t,e,r,o)}))}return o=o?o.then(a,a):a()}})}function S(t,e,n){var o=h;return function(a,i){if(o===v)throw new Error("Generator is already running");if(o===d){if("throw"===a)throw i;return{value:r,done:!0}}for(n.method=a,n.arg=i;;){var l=n.delegate;if(l){var s=N(l,n);if(s){if(s===g)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===h)throw o=d,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=v;var c=y(t,e,n);if("normal"===c.type){if(o=n.done?d:m,c.arg===g)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(o=d,n.method="throw",n.arg=c.arg)}}}function N(t,e){var n=e.method,o=t.iterator[n];if(o===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=r,N(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=y(o,t.iterator,e.arg);if("throw"===a.type)return e.method="throw",e.arg=a.arg,e.delegate=null,g;var i=a.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,g):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,g)}function V(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function H(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function T(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(V,this),this.reset(!0)}function P(e){if(e||""===e){var n=e[s];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function t(){for(;++o<e.length;)if(a.call(e,o))return t.value=e[o],t.done=!1,t;return t.value=r,t.done=!0,t};return i.next=i}}throw new TypeError(t(e)+" is not iterable")}return w.prototype=x,i(L,"constructor",{value:x,configurable:!0}),i(x,"constructor",{value:w,configurable:!0}),w.displayName=f(x,u,"GeneratorFunction"),n.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,u,"GeneratorFunction")),t.prototype=Object.create(L),t},n.awrap=function(t){return{__await:t}},k(E.prototype),f(E.prototype,c,(function(){return this})),n.AsyncIterator=E,n.async=function(t,e,r,o,a){void 0===a&&(a=Promise);var i=new E(p(t,e,r,o),a);return n.isGeneratorFunction(e)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},k(L),f(L,u,"Generator"),f(L,s,(function(){return this})),f(L,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},n.values=P,T.prototype={constructor:T,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(H),!t)for(var e in this)"t"===e.charAt(0)&&a.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,o){return l.type="throw",l.arg=t,e.next=n,o&&(e.method="next",e.arg=r),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],l=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var s=a.call(i,"catchLoc"),c=a.call(i,"finallyLoc");if(s&&c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(s){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&a.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=t,i.arg=e,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),H(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;H(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:P(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),g}},n}function r(t,e,r,n,o,a,i){try{var l=t[a](i),s=l.value}catch(c){return void r(c)}l.done?e(s):Promise.resolve(s).then(n,o)}function n(t){return function(){var e=this,n=arguments;return new Promise((function(o,a){var i=t.apply(e,n);function l(t){r(i,o,a,l,s,"next",t)}function s(t){r(i,o,a,l,s,"throw",t)}l(void 0)}))}}System.register(["./main-legacy.js?v=1714377894636","./index-legacy118.js?v=1714377894636","./index-legacy39.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./form-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./index-legacy45.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./site.popup-legacy.js?v=1714377894636","./site.store-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./empty-legacy.js?v=1714377894636","./index-legacy38.js?v=1714377894636","./element-ui.common-legacy.js?v=1714377894636","./date-util-legacy.js?v=1714377894636","./vdom-legacy.js?v=1714377894636","./index-legacy62.js?v=1714377894636","./cascader-panel-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636"],(function(t,r){"use strict";var o,a,i,l,s,c,u,f,p,y,h,m,v,d,g,b,w,x,_;return{setters:[function(t){o=t.a,a=t.$,i=t.n,l=t.q},function(t){s=t._},function(t){c=t._},function(t){u=t.w,f=t.x,p=t.o},null,null,function(t){y=t.e,h=t.b,m=t.v,v=t.H,d=t.h,g=t.j},function(t){b=t._},null,function(t){w=t.a4},function(t){x=t.g,_=t.bv},null,null,null,null,null,null,null,null,null,null,null,null,null],execute:function(){var r=y({__name:"BusCertVerifyWay",setup:function(t,r){var i=r.expose,l=x(),s=l.refs,c=s.certVerifyInfo,u=s.isRefreshSSL,f=l.verifyBusCert,p=g().proxy,y=h(""),C=h(""),j=m({dnsHost:"",dnsType:"",dnsValue:"",filePath:"/.well-known/pki-validation/",fileName:"",fileContent:""}),L=h([]),k=h([{label:"URL",prop:"url"},{label:"验证结果",prop:"status",width:100,render:function(t){return 1==t.status?v("span",{class:"text-[#20a53a]"},["通过"]):v("span",{class:"text-[red]"},["失败[",t.status,"]",v("a",{attrs:{href:"https://www.bt.cn/bbs/thread-56802-1-1.html",target:"_blank"},class:"el-icon-question text-warning"})])}},{label:"操作",align:"right",width:150,render:function(t,e){return[v("div",{class:"flex items-center justify-end"},[v(o,{on:{click:function(){return V(t.url)}}},["复制"]),v(b),v(o,{attrs:{href:t.url,target:"_blank"}},["打开"]),v(b),v(o,{on:{click:function(){return N(t,e)}}},["重新验证"])])]}}]),E=h([{text:"本次验证结果是由【本服务器验证】，实际验证将由【CA服务器】进行验证，请耐心等候"},{text:"请确保以上列表所有项都验证成功后点击【验证域名】重新提交验证"},{text:"如长时间验证不通过，请通过【修改验证方式】更改为【DNS验证】"},{useHtml:!0,content:'如何添加域名解析，《<a href="https://cloud.tencent.com/document/product/302/3446" class="text-primary" target="__blink">点击查看教程</a>》，和咨询服务器运营商'}]),S=function(){var t=n(e().mark((function t(){var r;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,f(c.value.oid);case 2:return t.next=4,T();case 4:"PENDING"===(null===(r=c.value)||void 0===r?void 0:r.data.certStatus)&&p.$message.success("验证中，请耐心等待！"),p.$emit("close"),u.value=!0;case 7:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),N=function(){var t=n(e().mark((function t(r,n){var o,a,i;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o=null,t.prev=1,o=p.$load("正在验证商用证书，请稍后..."),t.next=5,_({url:r.url,content:r.content});case 5:a=t.sent,i=a.data,L.value[n].status=i,t.next=12;break;case 10:t.prev=10,t.t0=t.catch(1);case 12:return t.prev=12,o&&o.close(),t.finish(12);case 15:case"end":return t.stop()}}),t,null,[[1,10,12,15]])})));return function(e,r){return t.apply(this,arguments)}}(),V=function(t){a({value:t}),p.$message.success("复制成功")},H=function(){p.$emit("close")},T=function(){var t;if(null!==(t=c.value)&&void 0!==t&&t.data){var e=c.value.data,r=e.data,n=r.dcvList,o=r.DCVdnsHost,a=r.DCVdnsType,i=r.DCVdnsValue,l=r.DCVfileName,s=r.DCVfileContent,u=e.paths;y.value=null==n?void 0:n.map((function(t){return t.domainName})).join(","),C.value=n[0].dcvMethod,j.dnsHost=o,j.dnsType=a,j.dnsValue=i,j.fileName=l,j.fileContent=s,"CNAME_CSR_HASH"!==C.value&&(L.value=null==u?void 0:u.map((function(t){return{url:t.url,status:t.status,content:s}})),E.value.splice(3,1,{useHtml:!0,content:'SSL添加文件验证方式 ->> <a href="https://www.bt.cn/bbs/thread-56802-1-1.html" target="_blank" class="text-primary" >查看教程</a>'}))}};return d((function(){T()})),i({onCancel:H}),{__sfc:!0,certVerifyInfo:c,isRefreshSSL:u,verifyBusCert:f,vm:p,domains:y,type:C,form:j,urlTableData:L,tableColumn:k,helpList:E,verifyDomain:S,resultsVerify:N,setVerifyType:function(){p.$emit("close"),w({oid:c.value.oid,type:C.value})},copyResult:V,onCancel:H,initCertData:T}}});t("default",i(r,(function(){var t=this,e=t._self._c,r=t._self._setupProxy;return e("div",{staticClass:"p-[5rem]"},[e("div",{staticClass:"text-[1.4rem] mb-[2rem]"},[t._v(" 请给以下域名【 "),e("span",{staticClass:"text-primary"},[t._v(t._s(r.domains))]),t._v(" 】 "),"CNAME_CSR_HASH"===r.type?[t._v("添加“"+t._s(r.form.dnsType)+"”解析，解析参数如下： ")]:[t._v("添加验证文件，验证信息如下：")]],2),"CNAME_CSR_HASH"===r.type?[e(u,{staticClass:"mb-20x"},[e(f,{attrs:{label:"主机记录："}},[e(p,{staticClass:"!w-[36rem] mr-[1rem]",attrs:{type:"text",readonly:""},model:{value:r.form.dnsHost,callback:function(e){t.$set(r.form,"dnsHost",e)},expression:"form.dnsHost"}}),e(l,{on:{click:function(t){return r.copyResult(r.form.dnsHost)}}},[t._v("复制")])],1),e(f,{attrs:{label:"记录类型："}},[e(p,{staticClass:"!w-[42rem]",attrs:{type:"text",readonly:""},model:{value:r.form.dnsType,callback:function(e){t.$set(r.form,"dnsType",e)},expression:"form.dnsType"}})],1),e(f,{attrs:{label:"记录值："}},[e(p,{staticClass:"!w-[36rem] mr-[1rem]",attrs:{type:"textarea",rows:3,readonly:""},model:{value:r.form.dnsValue,callback:function(e){t.$set(r.form,"dnsValue",e)},expression:"form.dnsValue"}}),e(l,{staticClass:"align-top",on:{click:function(t){return r.copyResult(r.form.dnsValue)}}},[t._v("复制")])],1)],1)]:[e(u,{staticClass:"mb-20x"},[e(f,{attrs:{label:"文件位置："}},[e(p,{staticClass:"!w-[36rem] mr-[1rem]",attrs:{type:"text",readonly:""},model:{value:r.form.filePath,callback:function(e){t.$set(r.form,"filePath",e)},expression:"form.filePath"}}),e(l,{on:{click:function(t){return r.copyResult(r.form.filePath)}}},[t._v("复制")])],1),e(f,{attrs:{label:"文件名："}},[e(p,{staticClass:"!w-[36rem] mr-[1rem]",attrs:{type:"text",readonly:""},model:{value:r.form.fileName,callback:function(e){t.$set(r.form,"fileName",e)},expression:"form.fileName"}}),e(l,{on:{click:function(t){return r.copyResult(r.form.fileName)}}},[t._v("复制")])],1),e(f,{attrs:{label:"记录值："}},[e(p,{staticClass:"!w-[36rem] mr-[1rem]",attrs:{type:"textarea",rows:3,readonly:""},model:{value:r.form.fileContent,callback:function(e){t.$set(r.form,"fileContent",e)},expression:"form.fileContent"}}),e(l,{staticClass:"align-top",on:{click:function(t){return r.copyResult(r.form.fileContent)}}},[t._v("复制")])],1)],1),e(c,{attrs:{column:r.tableColumn,data:r.urlTableData}})],e(s,{staticClass:"ml-20x mt-12x",attrs:{list:r.helpList,"list-style":"disc"}}),e("div",{staticClass:"mt-20x"},[e(l,{on:{click:function(t){return r.verifyDomain()}}},[t._v("验证域名")]),e(l,{attrs:{type:"defalut"},on:{click:r.setVerifyType}},[t._v("修改验证方式")]),e(l,{attrs:{type:"defalut"},on:{click:r.onCancel}},[t._v("返回列表")])],1)],2)}),[],!1,null,null,null,null).exports)}}}))}();
