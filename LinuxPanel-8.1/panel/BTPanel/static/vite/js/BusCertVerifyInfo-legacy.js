!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return n};var r,n={},a=Object.prototype,i=a.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},s="function"==typeof Symbol?Symbol:{},l=s.iterator||"@@iterator",c=s.asyncIterator||"@@asyncIterator",u=s.toStringTag||"@@toStringTag";function m(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{m({},"")}catch(r){m=function(t,e,r){return t[e]=r}}function f(t,e,r,n){var a=e&&e.prototype instanceof x?e:x,i=Object.create(a.prototype),s=new N(n||[]);return o(i,"_invoke",{value:j(t,r,s)}),i}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}n.wrap=f;var d="suspendedStart",v="suspendedYield",h="executing",y="completed",b={};function x(){}function w(){}function g(){}var _={};m(_,l,(function(){return this}));var C=Object.getPrototypeOf,k=C&&C(C(L([])));k&&k!==a&&i.call(k,l)&&(_=k);var A=g.prototype=x.prototype=Object.create(_);function D(t){["next","throw","return"].forEach((function(e){m(t,e,(function(t){return this._invoke(e,t)}))}))}function S(e,r){function n(a,o,s,l){var c=p(e[a],e,o);if("throw"!==c.type){var u=c.arg,m=u.value;return m&&"object"==t(m)&&i.call(m,"__await")?r.resolve(m.__await).then((function(t){n("next",t,s,l)}),(function(t){n("throw",t,s,l)})):r.resolve(m).then((function(t){u.value=t,s(u)}),(function(t){return n("throw",t,s,l)}))}l(c.arg)}var a;o(this,"_invoke",{value:function(t,e){function i(){return new r((function(r,a){n(t,e,r,a)}))}return a=a?a.then(i,i):i()}})}function j(t,e,n){var a=d;return function(i,o){if(a===h)throw new Error("Generator is already running");if(a===y){if("throw"===i)throw o;return{value:r,done:!0}}for(n.method=i,n.arg=o;;){var s=n.delegate;if(s){var l=E(s,n);if(l){if(l===b)continue;return l}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(a===d)throw a=y,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);a=h;var c=p(t,e,n);if("normal"===c.type){if(a=n.done?y:v,c.arg===b)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(a=y,n.method="throw",n.arg=c.arg)}}}function E(t,e){var n=e.method,a=t.iterator[n];if(a===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=r,E(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),b;var i=p(a,t.iterator,e.arg);if("throw"===i.type)return e.method="throw",e.arg=i.arg,e.delegate=null,b;var o=i.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,b):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,b)}function O(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function T(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(O,this),this.reset(!0)}function L(e){if(e||""===e){var n=e[l];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,o=function t(){for(;++a<e.length;)if(i.call(e,a))return t.value=e[a],t.done=!1,t;return t.value=r,t.done=!0,t};return o.next=o}}throw new TypeError(t(e)+" is not iterable")}return w.prototype=g,o(A,"constructor",{value:g,configurable:!0}),o(g,"constructor",{value:w,configurable:!0}),w.displayName=m(g,u,"GeneratorFunction"),n.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,g):(t.__proto__=g,m(t,u,"GeneratorFunction")),t.prototype=Object.create(A),t},n.awrap=function(t){return{__await:t}},D(S.prototype),m(S.prototype,c,(function(){return this})),n.AsyncIterator=S,n.async=function(t,e,r,a,i){void 0===i&&(i=Promise);var o=new S(f(t,e,r,a),i);return n.isGeneratorFunction(e)?o:o.next().then((function(t){return t.done?t.value:o.next()}))},D(A),m(A,u,"Generator"),m(A,l,(function(){return this})),m(A,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},n.values=L,N.prototype={constructor:N,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(T),!t)for(var e in this)"t"===e.charAt(0)&&i.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,a){return s.type="throw",s.arg=t,e.next=n,a&&(e.method="next",e.arg=r),!!a}for(var a=this.tryEntries.length-1;a>=0;--a){var o=this.tryEntries[a],s=o.completion;if("root"===o.tryLoc)return n("end");if(o.tryLoc<=this.prev){var l=i.call(o,"catchLoc"),c=i.call(o,"finallyLoc");if(l&&c){if(this.prev<o.catchLoc)return n(o.catchLoc,!0);if(this.prev<o.finallyLoc)return n(o.finallyLoc)}else if(l){if(this.prev<o.catchLoc)return n(o.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return n(o.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&i.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var a=n;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var o=a?a.completion:{};return o.type=t,o.arg=e,a?(this.method="next",this.next=a.finallyLoc,b):this.complete(o)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),b},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),T(r),b}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var a=n.arg;T(r)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:L(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),b}},n}function r(t,e,r,n,a,i,o){try{var s=t[i](o),l=s.value}catch(c){return void r(c)}s.done?e(l):Promise.resolve(l).then(n,a)}function n(t){return function(){var e=this,n=arguments;return new Promise((function(a,i){var o=t.apply(e,n);function s(t){r(o,a,i,s,l,"next",t)}function l(t){r(o,a,i,s,l,"throw",t)}s(void 0)}))}}function a(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function i(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?a(Object(r),!0).forEach((function(e){o(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function o(e,r,n){var a;return a=function(e,r){if("object"!=t(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,r||"default");if("object"!=t(a))return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(e)}(r,"string"),(r="symbol"==t(a)?a:String(a))in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}System.register(["./index-legacy118.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./form-legacy.js?v=1714377894636","./radio-legacy.js?v=1714377894636","./radio-group-legacy.js?v=1714377894636","./index-legacy130.js?v=1714377894636","./index-legacy45.js?v=1714377894636","./select-legacy.js?v=1714377894636","./index-legacy85.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./site.store-legacy.js?v=1714377894636","./site.popup-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./index-legacy38.js?v=1714377894636","./element-ui.common-legacy.js?v=1714377894636","./date-util-legacy.js?v=1714377894636","./vdom-legacy.js?v=1714377894636","./index-legacy62.js?v=1714377894636","./cascader-panel-legacy.js?v=1714377894636"],(function(t,r){"use strict";var a,o,s,l,c,u,m,f,p,d,v,h,y,b,x,w,g,_,C,k,A,D,S,j,E,O,T,N,L,H;return{setters:[function(t){a=t._},function(t){o=t.w,s=t.x,l=t.y,c=t.j,u=t.z,m=t.q,f=t.s,p=t.L,d=t.o},function(t){v=t.a3,h=t.n,y=t.r,b=t.q,x=t.a,w=t.b},null,null,null,null,function(t){g=t._},null,null,function(t){_=t._},function(t){C=t.e,k=t.b,A=t.c,D=t.h,S=t.j},function(t){j=t.g,E=t.bs,O=t.bt,T=t.bu},function(t){N=t.a2,L=t.a3},function(t){H=t.f},null,null,null,null,null,null,null,null,null,null,null,null],execute:function(){var r=C({__name:"BusCertVerifyInfo",props:{compData:{default:{orderInfo:{}}}},setup:function(t){var r=t,a=j(),o=a.refs,s=o.sslApplicationInfo,l=o.sslDnsApiInfo,c=o.certVerifyInfo,u=a.getSslDnsApiInfo,m=a.verifyBusCert,f=[{text:"OV/EV证书申请流程条件："},{text:"1、填写网站验证信息(文件验证或DNS验证)"},{text:"2、完成邮箱认证，根据CA发送的邮件完善邮件内容(中文填写即可)"},{text:"3、企查查或者爱企查、百度地图、114best能查询到相关企业信息，且公司名和公司地址完全匹配"},{text:"4、企查查或其他平台留下的电话能保证周一到周五(7:00 - 15:00)能接听到CA的认证电话，电话号码归属地来自美国，请留意接听。"}],p=[{text:"https或者http验证，必须保证网站能通过http/https访问"},{text:"域名前缀是www,提醒用户解析上级根域名，如申请www.bt.cn，请确保解析bt.cn"},{useHtml:!0,content:'<a class="text-primary" href="https://www.bt.cn/bbs/thread-85379-1-1.html" target="_blank">如何验证商用证书?</a>'}],d=S().proxy,h=[{text:"通配符证书只支持DNS验证"}],y=[{text:"多域名只支持DNS验证"}],b=k(!1),x=k(!1),w=k(""),g=k(""),_=k([]),C=k([]),P=k(!1),I=k({domain:""}),$=k({pid:0,oid:0,title:"",limit:1,type:"dv",install:!1,isWildcard:!1,isMulti:!1}),M=k({domains:"",dcvMethod:"",auth_to:"",Administrator:{address:"",city:"",country:"",email:"",firstName:"",lastName:"",job:"",name:"",mobile:"",organation:"",postCode:"",state:""}}),V=k([{value:"CNAME_CSR_HASH",label:"DNS验证(CNAME解析)",tips:"如网站还未备案完成，可选【DNS验证】",isCheck:"",checkTips:[]},{value:"HTTP_CSR_HASH",label:"文件验证(HTTP)",tips:"如网站未开启301、302、强制HTTPS、反向代理功能，请选择HTTP",isCheck:"",checkTips:[]},{value:"HTTPS_CSR_HASH",label:"文件验证(HTTPS)",tips:"如网站开启【强制HTTPS】，请选【HTTPS验证】",isCheck:"",checkTips:[]}]),F=k("CNAME_CSR_HASH"),B=k(!0),R=k("dns"),G=k(!1),W=k(!1),q=A((function(){var t=[];return W.value&&t.push.apply(t,h),G.value&&t.push.apply(t,y),t.push.apply(t,p),"dv"!==$.value.type&&t.push.apply(t,f),t})),z=A((function(){var t=W.value?"*":"www";return G.value?"多域名".concat(W.value?"通配符":"","证书，每行一个域名，支持").concat($.value.limit,"个域名，必填项,例如：\r").concat(t,".bt.cn\r").concat(t,".bttest.cn"):"请输入需要申请证书的域名（单域名".concat(W.value?"通配符":"","证书），必填项，例如：").concat(t,".bt.cn")})),U=A((function(){return M.value.Administrator.lastName+M.value.Administrator.firstName})),Y=function(){M.value.Administrator=i(i({},s.value),{},{name:""}),M.value.Administrator.name=U.value;var t=r.compData.orderInfo,e=t.pid,n=t.oid,a=t.title,o=t.limit,l=t.install,c=t.code,u=c.indexOf("ev")>-1?"ev":c.indexOf("ov")>-1?"ov":"dv";G.value=c.indexOf("multi")>-1,W.value=c.indexOf("wildcard")>-1,$.value={pid:e,oid:n,title:a,limit:o,install:l,isMulti:G.value,isWildcard:W.value,type:u}},J=function(){var t=n(e().mark((function t(){var r,n,a;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=null,t.prev=1,r=d.$load("正在获取域名列表,请稍后..."),t.next=5,E();case 5:n=t.sent,a=n.data.data,b.value=!0,_.value=a,g.value=a[0].name,C.value=a,t.next=16;break;case 13:t.prev=13,t.t0=t.catch(1);case 16:return t.prev=16,r&&r.close(),t.finish(16);case 19:case"end":return t.stop()}}),t,null,[[1,13,16,19]])})));return function(){return t.apply(this,arguments)}}(),K=function(){var t=n(e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:M.value.domains=g.value,b.value=!1,W.value||Q();case 3:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),Q=function(){var t=n(e().mark((function t(){var r,n;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return P.value=!0,t.next=3,O(g.value);case 3:r=t.sent,n=r.data,P.value=!1,V.value.forEach((function(t){var e=v(n[t.value]);t.isCheck="number"===e&&!!n[t.value],t.checkTips="number"===e?!!n[t.value]:n[t.value]}));case 7:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),X=function(){var t=n(e().mark((function t(){var n,a,i,o,s,l,u,f,p,v,h,y,b,x,w;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=null,M.value.domains){t.next=3;break}return t.abrupt("return",d.$message.error("域名不能为空"));case 3:if(M.value.Administrator.state||M.value.Administrator.city){t.next=5;break}return t.abrupt("return",d.$message.error("所在地区不能为空"));case 5:if(M.value.Administrator.address||"dv"===$.value.type){t.next=7;break}return t.abrupt("return",d.$message.error("公司详细地址不能为空"));case 7:if(M.value.Administrator.organation){t.next=9;break}return t.abrupt("return",d.$message.error("公司名称不能为空"));case 9:if(M.value.Administrator.name){t.next=11;break}return t.abrupt("return",d.$message.error("姓名不能为空"));case 11:if(M.value.Administrator.email){t.next=13;break}return t.abrupt("return",d.$message.error("邮箱不能为空"));case 13:if(M.value.Administrator.mobile){t.next=15;break}return t.abrupt("return",d.$message.error("手机不能为空"));case 15:return t.prev=15,n=d.$load("正在提交证书信息，请稍后..."),i=M.value.Administrator,o=i.job,s=i.postCode,l=i.country,i.firstName,i.lastName,u=i.name,f=i.state,p=i.city,v=i.address,h=i.organation,y=i.email,b=i.mobile,t.next=20,T(JSON.stringify({pid:$.value.pid,oid:$.value.oid,domains:null===(a=M.value.domains)||void 0===a?void 0:a.split("\n").filter((function(t){return t.trim()})),dcvMethod:F.value,auth_to:R.value,Administrator:{job:o,postCode:s,country:l,lastName:u,state:f,city:p,address:v,organation:h,email:y,mobile:b}}));case 20:if(x=t.sent,w=x.data,d.$message.request(w),!w.status){t.next=29;break}return d.$emit("close"),r.compData.refreshEvent(),t.next=28,m($.value.oid);case 28:L(c.value.isCNAME);case 29:t.next=34;break;case 31:t.prev=31,t.t0=t.catch(15);case 34:return t.prev=34,n&&n.close(),t.finish(34);case 37:case"end":return t.stop()}}),t,null,[[15,31,34,37]])})));return function(){return t.apply(this,arguments)}}();return D((function(){Y(),u()})),{__sfc:!0,props:r,sslApplicationInfo:s,sslDnsApiInfo:l,certVerifyInfo:c,getSslDnsApiInfo:u,verifyBusCert:m,isNotDvHelp:f,defalutHelp:p,vm:d,addDomainHelp:[{text:"申请之前，请确保域名已解析，如未解析会导致审核失败(包括根域名)"},{text:"申请www.bt.cn这种以www为二级域名的证书，需绑定并解析顶级域名(bt.cn)，否则将验证失败"},{text:"SSL证书可选名称赠送规则："},{text:"1、申请根域名(如：bt.cn),赠送下一级为www的域名(如：www.bt.cn)"},{text:"2、申请当前host为www的域名（如：www.bt.cn）,赠送上一级域名，(如: bt.cn)"},{text:"3、申请其它二级域名，(如：app.bt.cn)，赠送下一级为www的域名 (如：www.app.bt.cn)"}],isWildcardHelp:h,isMultiHelp:y,selectExistDomainPopup:b,customDomainPopup:x,existDomainSerach:w,existDomainActive:g,existDomainList:_,existDomainBackupList:C,checkDomainMethod:P,customDomainForm:I,orderInfo:$,form:M,sslVerifyTypeList:V,sslVerifyType:F,userBaseShow:B,dnsVerify:R,isMulti:G,isWildcard:W,sslVerifyHelp:q,sslDomainsTips:z,adminName:U,cutCretUserBase:function(){B.value=!B.value},sslInfoHandle:Y,selectExistDomain:J,serachExistDomain:function(t){_.value=[],C.value.forEach((function(e){e.name.indexOf(t)>-1&&_.value.push(e)})),_.value.length||(_.value=C.value)},selectExistDomainConfirm:K,showCheckResult:function(t){d.$message.msg({customClass:"el-error-html-message",dangerouslyUseHTMLString:!0,message:t.join("<br>"),type:"error"})},reanderDomainCheck:Q,selectCustomDomain:function(){x.value=!0},submitCustomDomain:function(){return I.value.domain?H(I.value.domain)?!W.value&&I.value.domain.indexOf("*")>-1?d.$message.error("当前为单域名证书，不支持通配符申请"):(M.value.domains=I.value.domain,x.value=!1,void(W.value||Q())):d.$message.error("域名格式错误，请重新输入"):d.$message.error("域名不能为空")},setSslDnsApi:function(t){var e=R.value;if("dns"!==e){var r=l.value.find((function(t){return t.value===e})),n=!r.data;(!t||t&&n)&&N({title:"设置".concat(r.info.title,"接口"),row:r.info})}},sslInfoSubmit:X}}});t("default",h(r,(function(){var t=this,e=t._self._c,r=t._self._setupProxy;return e("div",{staticClass:"px-3rem py-3rem"},[e(o,{ref:"form",attrs:{model:r.form,"label-width":"80px"}},[e(s,{attrs:{label:"证书信息"}},[e("span",{staticClass:"text-primary"},[e("span",[t._v(t._s(r.orderInfo.title))]),r.orderInfo.limit>1?e("span",[t._v("，包含"+t._s(r.orderInfo.limit)+"个域名")]):t._e()])]),e(s,{attrs:{label:"域名",prop:"domains"}},[e("div",{staticClass:"flex flex-col"},[e(y,{ref:"popover",attrs:{placement:"top-start","popper-class":"green-tips-popover",title:"",width:"200",disabled:!r.isMulti,trigger:"focus"}},[e("div",{staticClass:"!p-12x bg-[#20a53a] text-white"},[t._v(t._s(r.sslDomainsTips))]),e(_,{staticClass:"disabled-input",attrs:{slot:"reference",disabled:!r.isMulti,width:"42rem",resize:"none",type:r.isMulti?"textarea":"text",placeholder:r.sslDomainsTips},slot:"reference",model:{value:r.form.domains,callback:function(e){t.$set(r.form,"domains",e)},expression:"form.domains"}})],1),e("div",{directives:[{name:"show",rawName:"v-show",value:!r.isMulti,expression:"!isMulti"}]},[e(b,{attrs:{size:"mini"},on:{click:r.selectExistDomain}},[t._v("选择已有域名")]),e(b,{attrs:{size:"mini",type:"defalut"},on:{click:r.selectCustomDomain}},[t._v("自定义域名")])],1)],1)]),e(s,{attrs:{label:"验证方式"}},[e(l,{staticClass:"!leading-[2.4rem]",model:{value:r.sslVerifyType,callback:function(t){r.sslVerifyType=t},expression:"sslVerifyType"}},t._l(r.sslVerifyTypeList,(function(n){return e(c,{key:n.value,staticClass:"item",attrs:{effect:"dark",enterable:!1,content:n.tips,placement:"top-start"}},[r.isWildcard&&"CNAME_CSR_HASH"===n.value||!r.isWildcard?[e(u,{attrs:{label:n.value}},[e("span",{staticClass:"mr-[2px]"},[t._v(t._s(n.label))]),e(x,{directives:[{name:"show",rawName:"v-show",value:""!==n.isCheck,expression:"item.isCheck !== ''"}],class:n.isCheck?"!text-primary":"!text-danger",on:{click:function(t){return r.showCheckResult(n.checkTips)}}},[t._v(" ["+t._s(n.isCheck?"正常":"异常")+"] ")]),r.checkDomainMethod?e("span",{staticClass:"!caret-medium"},[t._v(" ["),e("i",{staticClass:"el-icon-loading"}),t._v("检测中] ")]):t._e()],1)]:t._e()],2)})),1)],1),e(s,{directives:[{name:"show",rawName:"v-show",value:"CNAME_CSR_HASH"===r.sslVerifyType,expression:"sslVerifyType === 'CNAME_CSR_HASH'"}],attrs:{label:"选择DNS接口"}},[e(m,{staticClass:"mr-16x",attrs:{placeholder:"请选择"},on:{change:function(t){return r.setSslDnsApi(!0)}},model:{value:r.dnsVerify,callback:function(t){r.dnsVerify=t},expression:"dnsVerify"}},t._l(r.sslDnsApiInfo,(function(r){return e(f,{key:r.value,attrs:{label:r.label,value:r.value}},[e("span",{staticClass:"flex justify-between"},[e("span",[t._v(t._s(r.label))]),e("span",{directives:[{name:"show",rawName:"v-show",value:r.config,expression:"item.config"}],class:r.data?"text-primary":"text-orange"},[t._v(" "+t._s(r.data?"[已配置]":"[未配置]")+" ")])])])})),1),e(b,{directives:[{name:"show",rawName:"v-show",value:"dns"!==r.dnsVerify,expression:"dnsVerify !== 'dns'"}],staticClass:"ml-8x",attrs:{type:"defalut"},on:{click:function(t){return r.setSslDnsApi(!1)}}},[t._v(" 配置 ")])],1),e("div",{staticClass:"px-40x"},[e(p,[e("span",{staticClass:"text-primary cursor-pointer",on:{click:r.cutCretUserBase}},[e("i",{class:"el-icon-arrow-".concat(r.userBaseShow?"up":"down")}),e("span",{staticClass:"text-[1.2rem] ml-4x"},[t._v(t._s(r.userBaseShow?"收起":"展开")+"证书用户信息")])])])],1),e("div",{directives:[{name:"show",rawName:"v-show",value:r.userBaseShow,expression:"userBaseShow"}],staticClass:"pb-16x"},[e(s,{attrs:{label:"所在地区"}},[e("div",{staticClass:"flex flex-row"},[e(g,{attrs:{"custom-class":"mr-16x !w-[20rem]","placeholder-tips":"请输入所在省份，必填项"},model:{value:r.form.Administrator.state,callback:function(e){t.$set(r.form.Administrator,"state",e)},expression:"form.Administrator.state"}}),e(g,{attrs:{"custom-class":"!w-[20rem]","placeholder-tips":"请输入所在市/县，必填项"},model:{value:r.form.Administrator.city,callback:function(e){t.$set(r.form.Administrator,"city",e)},expression:"form.Administrator.city"}})],1)]),e(s,{directives:[{name:"show",rawName:"v-show",value:"dv"!==r.orderInfo.type,expression:"orderInfo.type !== 'dv'"}],attrs:{label:"公司详细地址"}},[e(g,{attrs:{"custom-class":"!w-[42rem]","placeholder-tips":"请输入公司详细地址，具体要求见说明，必填项"},model:{value:r.form.Administrator.address,callback:function(e){t.$set(r.form.Administrator,"address",e)},expression:"form.Administrator.address"}})],1),e(s,{attrs:{label:"公司名称"}},[e(g,{attrs:{"custom-class":"!w-[42rem]","placeholder-tips":"请输入公司名称，如为个人申请请输入个人姓名，必填项"},model:{value:r.form.Administrator.organation,callback:function(e){t.$set(r.form.Administrator,"organation",e)},expression:"form.Administrator.organation"}})],1),e(s,{attrs:{label:"姓名"}},[e(g,{attrs:{"custom-class":"!w-[42rem]","placeholder-tips":"请输入姓名，必填项"},model:{value:r.form.Administrator.name,callback:function(e){t.$set(r.form.Administrator,"name",e)},expression:"form.Administrator.name"}})],1),e(s,{attrs:{label:"邮箱"}},[e(g,{attrs:{"custom-class":"!w-[42rem]","placeholder-tips":"请输入邮箱地址，必填项"},model:{value:r.form.Administrator.email,callback:function(e){t.$set(r.form.Administrator,"email",e)},expression:"form.Administrator.email"}})],1),e(s,{attrs:{label:"手机"}},[e(g,{attrs:{"custom-class":"!w-[42rem]","placeholder-tips":"请输入手机号码，若为空，则使用当前绑定手机号"},model:{value:r.form.Administrator.mobile,callback:function(e){t.$set(r.form.Administrator,"mobile",e)},expression:"form.Administrator.mobile"}})],1)],1),e(s,{attrs:{label:" "}},[e(b,{on:{click:r.sslInfoSubmit}},[t._v("提交资料")])],1),e(s,[e(a,{staticClass:"mt-20x pl-20x text-left text-[1.2rem]",attrs:{list:r.sslVerifyHelp,listStyle:"disc"}})],1)],1),e(w,{attrs:{title:"选择域名",visible:r.selectExistDomainPopup,area:57,"show-footer":!0},on:{"update:visible":function(t){r.selectExistDomainPopup=t},confirm:r.selectExistDomainConfirm}},[e("div",{staticClass:"p-20x"},[e(d,{staticClass:"!w-[53rem] mb-16x",attrs:{placeholder:"支持字段模糊搜索",clearable:""},on:{input:r.serachExistDomain},model:{value:r.existDomainSerach,callback:function(t){r.existDomainSerach=t},expression:"existDomainSerach"}}),e("div",{staticClass:"mb-8x border-light"},[e("div",{staticClass:"flex justify-between items-center bg-[#f6f6f6] py-[1rem] pl-[1rem]"},[t._v("域名")]),e(l,{staticClass:"custom-radio-group 1111 py-2x",model:{value:r.existDomainActive,callback:function(t){r.existDomainActive=t},expression:"existDomainActive"}},t._l(r.existDomainList,(function(r){return e(u,{attrs:{label:r.name}},[t._v(t._s(r.name))])})),1)],1),e(a,{staticClass:"ml-20x",attrs:{list:r.addDomainHelp,listStyle:"disc"}})],1)]),e(w,{attrs:{title:"自定义域名",visible:r.customDomainPopup,area:57,"show-footer":!0},on:{"update:visible":function(t){r.customDomainPopup=t},confirm:r.submitCustomDomain}},[e("div",{staticClass:"p-20x"},[e(o,{staticClass:"mb-16x",model:{value:r.customDomainForm,callback:function(t){r.customDomainForm=t},expression:"customDomainForm"}},[e(s,{attrs:{label:"自定义域名",prop:"domain"}},[e(d,{staticClass:"!w-[40rem] mb-8x",attrs:{autofocus:"",placeholder:"请输入需要申请证书的域名（单域名证书），必填项，例如：www.bt.cn"},model:{value:r.customDomainForm.domain,callback:function(e){t.$set(r.customDomainForm,"domain",e)},expression:"customDomainForm.domain"}})],1)],1),e(a,{staticClass:"ml-20x",attrs:{list:r.addDomainHelp,listStyle:"disc"}})],1)])],1)}),[],!1,null,"8d24f1cb",null,null).exports)}}}))}();