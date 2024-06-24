!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return n};var r,n={},o=Object.prototype,a=o.hasOwnProperty,i=Object.defineProperty||function(t,e,r){t[e]=r.value},c="function"==typeof Symbol?Symbol:{},u=c.iterator||"@@iterator",s=c.asyncIterator||"@@asyncIterator",l=c.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(r){f=function(t,e,r){return t[e]=r}}function p(t,e,r,n){var o=e&&e.prototype instanceof w?e:w,a=Object.create(o.prototype),c=new N(n||[]);return i(a,"_invoke",{value:S(t,r,c)}),a}function h(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}n.wrap=p;var v="suspendedStart",y="suspendedYield",d="executing",m="completed",g={};function w(){}function x(){}function b(){}var _={};f(_,u,(function(){return this}));var j=Object.getPrototypeOf,L=j&&j(j(G([])));L&&L!==o&&a.call(L,u)&&(_=L);var k=b.prototype=w.prototype=Object.create(_);function C(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function E(e,r){function n(o,i,c,u){var s=h(e[o],e,i);if("throw"!==s.type){var l=s.arg,f=l.value;return f&&"object"==t(f)&&a.call(f,"__await")?r.resolve(f.__await).then((function(t){n("next",t,c,u)}),(function(t){n("throw",t,c,u)})):r.resolve(f).then((function(t){l.value=t,c(l)}),(function(t){return n("throw",t,c,u)}))}u(s.arg)}var o;i(this,"_invoke",{value:function(t,e){function a(){return new r((function(r,o){n(t,e,r,o)}))}return o=o?o.then(a,a):a()}})}function S(t,e,n){var o=v;return function(a,i){if(o===d)throw new Error("Generator is already running");if(o===m){if("throw"===a)throw i;return{value:r,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var u=O(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===v)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var s=h(t,e,n);if("normal"===s.type){if(o=n.done?m:y,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=m,n.method="throw",n.arg=s.arg)}}}function O(t,e){var n=e.method,o=t.iterator[n];if(o===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=r,O(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=h(o,t.iterator,e.arg);if("throw"===a.type)return e.method="throw",e.arg=a.arg,e.delegate=null,g;var i=a.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,g):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,g)}function P(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function D(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(P,this),this.reset(!0)}function G(e){if(e||""===e){var n=e[u];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function t(){for(;++o<e.length;)if(a.call(e,o))return t.value=e[o],t.done=!1,t;return t.value=r,t.done=!0,t};return i.next=i}}throw new TypeError(t(e)+" is not iterable")}return x.prototype=b,i(k,"constructor",{value:b,configurable:!0}),i(b,"constructor",{value:x,configurable:!0}),x.displayName=f(b,l,"GeneratorFunction"),n.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===x||"GeneratorFunction"===(e.displayName||e.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,b):(t.__proto__=b,f(t,l,"GeneratorFunction")),t.prototype=Object.create(k),t},n.awrap=function(t){return{__await:t}},C(E.prototype),f(E.prototype,s,(function(){return this})),n.AsyncIterator=E,n.async=function(t,e,r,o,a){void 0===a&&(a=Promise);var i=new E(p(t,e,r,o),a);return n.isGeneratorFunction(e)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},C(k),f(k,l,"Generator"),f(k,u,(function(){return this})),f(k,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},n.values=G,N.prototype={constructor:N,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(D),!t)for(var e in this)"t"===e.charAt(0)&&a.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,o){return c.type="throw",c.arg=t,e.next=n,o&&(e.method="next",e.arg=r),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],c=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var u=a.call(i,"catchLoc"),s=a.call(i,"finallyLoc");if(u&&s){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&a.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=t,i.arg=e,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),D(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;D(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:G(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),g}},n}function r(t,e,r,n,o,a,i){try{var c=t[a](i),u=c.value}catch(s){return void r(s)}c.done?e(u):Promise.resolve(u).then(n,o)}function n(t){return function(){var e=this,n=arguments;return new Promise((function(o,a){var i=t.apply(e,n);function c(t){r(i,o,a,c,u,"next",t)}function u(t){r(i,o,a,c,u,"throw",t)}c(void 0)}))}}System.register(["./main-legacy.js?v=1714377894636","./index-legacy120.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./index-legacy45.js?v=1714377894636","./select-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./site.store-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636"],(function(t,r){"use strict";var o,a,i,c,u,s,l,f,p,h,v,y,d,m,g,w;return{setters:[function(t){o=t.I,a=t.l,i=t.n,c=t.b,u=t.q},function(t){s=t._},function(t){l=t.q,f=t.s,p=t.L},null,null,function(t){h=t._},function(t){v=t.e,y=t.b,d=t.h,m=t.j},function(t){g=t.av,w=t.aw},null,null,null,null,null,null],execute:function(){var x=function(t){return o.post("files/GetFileBody",{data:t})},b=v({__name:"PseudoStatic",props:{compData:{default:function(){}}},setup:function(t,o){var i=o.expose,c=t,u=m().proxy,s=y(""),l=y(!1),f=y({mode:"ace/mode/nginx",theme:"ace/theme/chrome",wrap:!0,showInvisibles:!1,showFoldWidgets:!1,useSoftTabs:!0,tabSize:2,showPrintMargin:!1,readOnly:!1,fontSize:"12px"}),p=y([]),v=y([]),b=y(),_=y(),j=function(){var t=n(e().mark((function t(){var r;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,g({site_ids:JSON.stringify(c.compData.map((function(t){return t.id}))),site_type:"PHP"});case 3:r=t.sent,p.value=r.data.site_rewrites,v.value=r.data.template_rewrites,t.next=11;break;case 8:t.prev=8,t.t0=t.catch(0);case 11:case"end":return t.stop()}}),t,null,[[0,8]])})));return function(){return t.apply(this,arguments)}}(),L=function(){var t=n(e().mark((function t(r){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,C(r);case 2:_.value="";case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),k=function(){var t=n(e().mark((function t(r){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,C(r);case 2:b.value="";case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),C=function(){var t=n(e().mark((function t(r){var n,o;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,x({path:r});case 3:n=t.sent,o=n.data,s.value=o.data,t.next=11;break;case 8:t.prev=8,t.t0=t.catch(0);case 11:case"end":return t.stop()}}),t,null,[[0,8]])})));return function(e){return t.apply(this,arguments)}}(),E=function(){var t=n(e().mark((function t(){var n,o,i;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,n=u.$load("正在部署，请稍后..."),o=[],c.compData.forEach((function(t){var e;e=p.value.find((function(e){return e.id===t.id})),o.push({id:t.id,name:t.name,file:e.file})})),t.next=6,w({sites:JSON.stringify(o),rewrite_data:s.value});case 6:return i=t.sent,t.next=9,a({title:"批量部署结果",area:42,component:function(){return h((function(){return r.import("./index-legacy63.js?v=1714377894636")}),void 0,r.meta.url)},compData:{resultData:i.data,resultTitle:"结果"}});case 9:l.value=!1,u.$emit("close"),t.next=16;break;case 13:t.prev=13,t.t0=t.catch(0);case 16:return t.prev=16,n.close(),t.finish(16);case 19:case"end":return t.stop()}}),t,null,[[0,13,16,19]])})));return function(){return t.apply(this,arguments)}}(),S=function(){b.value||_.value?l.value=!0:u.$message.error("请选择一种伪静态规则")};return i({onConfirm:S}),d(n(e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,j();case 2:case"end":return t.stop()}}),t)})))),{__sfc:!0,props:c,vm:u,editorContent:s,setPopup:l,config:f,siteRewrites:p,templateRewrites:v,siteData:b,templateData:_,getSelectData:j,handleChangeSite:L,handleChangeOther:k,getBody:C,handleConfirm:E,onConfirm:S}}});t("default",i(b,(function(){var t=this,e=t._self._c,r=t._self._setupProxy;return e("div",{staticClass:"p-20x"},[e("div",{staticClass:"flex items-center"},[t._v(" 站点已有伪静态规则： "),e(l,{staticClass:"mx-12x",on:{change:r.handleChangeSite},model:{value:r.siteData,callback:function(t){r.siteData=t},expression:"siteData"}},t._l(r.siteRewrites,(function(t){return e(f,{key:t.id,attrs:{label:t.name+"站点的伪静态配置",value:t.file}})})),1),t._v(" 模板伪静态规则： "),e(l,{staticClass:"mx-12x",on:{change:r.handleChangeOther},model:{value:r.templateData,callback:function(t){r.templateData=t},expression:"templateData"}},t._l(r.templateRewrites,(function(t){return e(f,{key:t.id,attrs:{label:t.name+"模板的伪静态配置",value:t.file}})})),1)],1),e(p),e(s,{staticClass:"!h-[52rem]",attrs:{config:r.config},model:{value:r.editorContent,callback:function(t){r.editorContent=t},expression:"editorContent"}}),e(c,{attrs:{title:"部署当前伪静态",visible:r.setPopup,area:[52,26]},on:{"update:visible":function(t){r.setPopup=t}}},[e("div",{staticClass:"relative h-full"},[e("div",{staticClass:"p-20x"},[e("span",{staticClass:"!mb-4x inline-block"},[t._v("如下是需要批量部署证书的站点：")]),e("div",{staticClass:"overflow-auto h-[12rem] border border-[#efefef] p-12x"},t._l(t.compData,(function(r,n){return e("div",{key:n,staticClass:"p-4x w-full"},[t._v(" "+t._s(r.name)+" ")])})),0),e("span",{staticClass:"text-danger mt-4x"},[t._v("注意：批量设置站点伪静态后，原有站点伪静态配置将被覆盖。")])]),e("div",{staticClass:"absolute bottom-0 w-full bg-[#f6f8f8] flex items-center justify-end p-12x"},[e(u,{attrs:{type:"cancel"},on:{click:function(t){r.setPopup=!1}}},[t._v("取消")]),e(u,{on:{click:r.handleConfirm}},[t._v("部署("+t._s(t.compData.length)+"项) ")])],1)])])],1)}),[],!1,null,"bff27bc7",null,null).exports)}}}))}();