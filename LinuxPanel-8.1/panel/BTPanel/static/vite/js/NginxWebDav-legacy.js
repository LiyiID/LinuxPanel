!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return r};var n,r={},a=Object.prototype,o=a.hasOwnProperty,i=Object.defineProperty||function(t,e,n){t[e]=n.value},s="function"==typeof Symbol?Symbol:{},c=s.iterator||"@@iterator",u=s.asyncIterator||"@@asyncIterator",l=s.toStringTag||"@@toStringTag";function f(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(n){f=function(t,e,n){return t[e]=n}}function p(t,e,n,r){var a=e&&e.prototype instanceof x?e:x,o=Object.create(a.prototype),s=new O(r||[]);return i(o,"_invoke",{value:E(t,n,s)}),o}function h(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}r.wrap=p;var v="suspendedStart",m="suspendedYield",d="executing",y="completed",g={};function x(){}function b(){}function w(){}var _={};f(_,c,(function(){return this}));var j=Object.getPrototypeOf,L=j&&j(j(P([])));L&&L!==a&&o.call(L,c)&&(_=L);var k=w.prototype=x.prototype=Object.create(_);function F(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function C(e,n){function r(a,i,s,c){var u=h(e[a],e,i);if("throw"!==u.type){var l=u.arg,f=l.value;return f&&"object"==t(f)&&o.call(f,"__await")?n.resolve(f.__await).then((function(t){r("next",t,s,c)}),(function(t){r("throw",t,s,c)})):n.resolve(f).then((function(t){l.value=t,s(l)}),(function(t){return r("throw",t,s,c)}))}c(u.arg)}var a;i(this,"_invoke",{value:function(t,e){function o(){return new n((function(n,a){r(t,e,n,a)}))}return a=a?a.then(o,o):o()}})}function E(t,e,r){var a=v;return function(o,i){if(a===d)throw new Error("Generator is already running");if(a===y){if("throw"===o)throw i;return{value:n,done:!0}}for(r.method=o,r.arg=i;;){var s=r.delegate;if(s){var c=D(s,r);if(c){if(c===g)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(a===v)throw a=y,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);a=d;var u=h(t,e,r);if("normal"===u.type){if(a=r.done?y:m,u.arg===g)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(a=y,r.method="throw",r.arg=u.arg)}}}function D(t,e){var r=e.method,a=t.iterator[r];if(a===n)return e.delegate=null,"throw"===r&&t.iterator.return&&(e.method="return",e.arg=n,D(t,e),"throw"===e.method)||"return"!==r&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+r+"' method")),g;var o=h(a,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,g;var i=o.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=n),e.delegate=null,g):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,g)}function S(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function $(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function O(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(S,this),this.reset(!0)}function P(e){if(e||""===e){var r=e[c];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,i=function t(){for(;++a<e.length;)if(o.call(e,a))return t.value=e[a],t.done=!1,t;return t.value=n,t.done=!0,t};return i.next=i}}throw new TypeError(t(e)+" is not iterable")}return b.prototype=w,i(k,"constructor",{value:w,configurable:!0}),i(w,"constructor",{value:b,configurable:!0}),b.displayName=f(w,l,"GeneratorFunction"),r.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===b||"GeneratorFunction"===(e.displayName||e.name))},r.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,w):(t.__proto__=w,f(t,l,"GeneratorFunction")),t.prototype=Object.create(k),t},r.awrap=function(t){return{__await:t}},F(C.prototype),f(C.prototype,u,(function(){return this})),r.AsyncIterator=C,r.async=function(t,e,n,a,o){void 0===o&&(o=Promise);var i=new C(p(t,e,n,a),o);return r.isGeneratorFunction(e)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},F(k),f(k,l,"Generator"),f(k,c,(function(){return this})),f(k,"toString",(function(){return"[object Generator]"})),r.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},r.values=P,O.prototype={constructor:O,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=n,this.done=!1,this.delegate=null,this.method="next",this.arg=n,this.tryEntries.forEach($),!t)for(var e in this)"t"===e.charAt(0)&&o.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=n)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(r,a){return s.type="throw",s.arg=t,e.next=r,a&&(e.method="next",e.arg=n),!!a}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],s=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var c=o.call(i,"catchLoc"),u=o.call(i,"finallyLoc");if(c&&u){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&o.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var a=r;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),$(n),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var a=r.arg;$(n)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:P(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=n),g}},r}function n(t,e,n,r,a,o,i){try{var s=t[o](i),c=s.value}catch(u){return void n(u)}s.done?e(c):Promise.resolve(c).then(r,a)}function r(t){return function(){var e=this,r=arguments;return new Promise((function(a,o){var i=t.apply(e,r);function s(t){n(i,a,o,s,c,"next",t)}function c(t){n(i,a,o,s,c,"throw",t)}s(void 0)}))}}System.register(["./index-legacy85.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./form-legacy.js?v=1714377894636","./index-legacy46.js?v=1714377894636","./index-legacy45.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./site.store-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./switch-legacy.js?v=1714377894636","./index.vue_vue_type_style_index_0_lang-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636"],(function(t,n){"use strict";var a,o,i,s,c,u,l,f,p,h,v,m,d,y,g,x,b,w;return{setters:[function(t){a=t._},function(t){o=t.L,i=t.w,s=t.x},function(t){c=t.n,u=t.q,l=t.b},null,null,function(t){f=t._},null,function(t){p=t.e,h=t.b,v=t.h,m=t.j},function(t){d=t.ed,y=t.ee,g=t.ef,x=t.eg,b=t.eh,w=t.ei},null,null,null,null,null,null,null,null,null],execute:function(){var n=p({__name:"NginxWebDav",props:{compData:{default:function(){return{}}}},setup:function(t){var n=t,a=m().proxy,o=h(!1),i=h(!1),s=h({auth:!1,site_name:"",site_path:"",domain:"",status:!1,user:"",pass:""}),c=h({domain:""}),u=function(){var t=r(e().mark((function t(){var r,a;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,d({site_name:n.compData.name});case 3:if(r=t.sent,a=r.data){t.next=9;break}return i.value=!1,t.abrupt("return");case 9:i.value=!0,s.value=Object.assign(s.value,a),s.value.auth=!!a.auth,a.auth&&(s.value.user=a.auth.auth_name,s.value.pass=a.auth.auth_value),t.next=18;break;case 15:t.prev=15,t.t0=t.catch(0);case 18:case"end":return t.stop()}}),t,null,[[0,15]])})));return function(){return t.apply(this,arguments)}}(),l=function(){var t=r(e().mark((function t(r){var o,i;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(s.value.auth=r,t.prev=1,r){t.next=11;break}return o=a.$load("正在设置状态,请稍后..."),s.value.user="",s.value.pass="",t.next=8,y({site_name:n.compData.name});case 8:i=t.sent,a.$message.request(i),o.close();case 11:t.next=16;break;case 13:t.prev=13,t.t0=t.catch(1);case 16:return t.prev=16,o.close(),t.finish(16);case 19:case"end":return t.stop()}}),t,null,[[1,13,16,19]])})));return function(e){return t.apply(this,arguments)}}(),f=function(){var t=r(e().mark((function t(){var r;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,g({site_name:n.compData.name,auth_name:s.value.user,auth_value:s.value.pass});case 3:r=t.sent,a.$message.request(r),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0);case 10:case"end":return t.stop()}}),t,null,[[0,7]])})));return function(){return t.apply(this,arguments)}}(),p=function(){var t=r(e().mark((function t(r){var o,i;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o=a.$load("正在设置状态,请稍后..."),s.value.status=r,t.prev=2,t.next=5,x({site_name:n.compData.name,option:r?1:0});case 5:i=t.sent,a.$message.request(i),o.close(),t.next=13;break;case 10:t.prev=10,t.t0=t.catch(2);case 13:return t.prev=13,o.close(),t.finish(13);case 16:case"end":return t.stop()}}),t,null,[[2,10,13,16]])})));return function(e){return t.apply(this,arguments)}}(),_=function(){var t=r(e().mark((function t(){var r,o;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=a.$load("正在删除,请稍后..."),t.prev=1,t.next=4,a.$confirm({title:"删除【".concat(n.compData.name,"】webdav"),message:"是否删除【".concat(n.compData.name,"】webdav，删除后将不再对域名进行限制?"),icon:"warning"});case 4:return t.next=6,b({site_name:n.compData.name});case 6:o=t.sent,a.$message.request(o),u(),t.next=14;break;case 11:t.prev=11,t.t0=t.catch(1);case 14:return t.prev=14,r.close(),t.finish(14);case 17:case"end":return t.stop()}}),t,null,[[1,11,14,17]])})));return function(){return t.apply(this,arguments)}}(),j=function(){var t=r(e().mark((function t(){var r,o;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=a.$load("正在添加,请稍后..."),t.prev=1,t.next=4,w({domain:c.value.domain,site_id:n.compData.id});case 4:o=t.sent,L(),a.$message.request(o),u(),t.next=13;break;case 10:t.prev=10,t.t0=t.catch(1);case 13:return t.prev=13,r.close(),t.finish(13);case 16:case"end":return t.stop()}}),t,null,[[1,10,13,16]])})));return function(){return t.apply(this,arguments)}}(),L=function(){o.value=!1,c.value.domain=""};return v(r(e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u();case 2:case"end":return t.stop()}}),t)})))),{__sfc:!0,vm:a,props:n,addPopup:o,webDavStatus:i,nginxForm:s,addForm:c,getNginxWebData:u,handleChangeAuth:l,saveNginxAuth:f,handleChangeStatus:p,delWebDev:_,onConfirmAdd:j,handleCancelAdd:L}}});t("default",c(n,(function(){var t=this,e=t._self._c,n=t._self._setupProxy;return e("div",{staticClass:"p-12x"},[n.webDavStatus?e("div",[e("div",{staticClass:"formItem"},[e("span",{staticClass:"formLabel"},[t._v("WebDav状态")]),e(f,{staticClass:"mr-12x",on:{change:n.handleChangeStatus},model:{value:n.nginxForm.status,callback:function(e){t.$set(n.nginxForm,"status",e)},expression:"nginxForm.status"}}),e(u,{attrs:{type:"default"},on:{click:n.delWebDev}},[t._v("删除WebDav")])],1),e(o),e("div",{staticClass:"formItem"},[e("span",{staticClass:"formLabel"},[t._v("域名")]),e(a,{staticClass:"mr-12x",attrs:{disabled:""},model:{value:n.nginxForm.domain,callback:function(e){t.$set(n.nginxForm,"domain",e)},expression:"nginxForm.domain"}})],1),e("div",{staticClass:"formItem"},[e("span",{staticClass:"formLabel"},[t._v("auth状态")]),e(f,{staticClass:"mr-12x",on:{change:n.handleChangeAuth},model:{value:n.nginxForm.auth,callback:function(e){t.$set(n.nginxForm,"auth",e)},expression:"nginxForm.auth"}})],1),n.nginxForm.auth?e("div",[e("div",{staticClass:"formItem"},[e("span",{staticClass:"formLabel"},[t._v("用户名")]),e(a,{staticClass:"mr-12x",model:{value:n.nginxForm.user,callback:function(e){t.$set(n.nginxForm,"user",e)},expression:"nginxForm.user"}})],1),e("div",{staticClass:"formItem"},[e("span",{staticClass:"formLabel"},[t._v("密码")]),e(a,{staticClass:"mr-12x",model:{value:n.nginxForm.pass,callback:function(e){t.$set(n.nginxForm,"pass",e)},expression:"nginxForm.pass"}})],1),e(u,{on:{click:n.saveNginxAuth}},[t._v("保存")])],1):t._e()],1):e("div",[e(u,{on:{click:function(t){n.addPopup=!0}}},[t._v("创建WebDav")]),e("br"),e("p",{staticClass:"mt-20x"},[t._v("WebDAV是一种用于在Web服务器上进行文件管理和协作的扩展协议。")]),e("p",[t._v(" WebDAV允许用户通过HTTP协议对远程服务器上的文件和目录进行读写操作。它提供了类似于本地文件系统的操作方式，使用户能够通过WebDAV客户端访问远程服务器上的文件 ")]),e(l,{attrs:{title:"创建WebDav",visible:n.addPopup,area:42,showFooter:""},on:{"update:visible":function(t){n.addPopup=t},cancel:n.handleCancelAdd,confirm:n.onConfirmAdd}},[e("div",{staticClass:"p-20x"},[e(i,{attrs:{model:n.addForm}},[e(s,{attrs:{label:"域名"}},[e(a,{attrs:{placeholder:"请输入域名"},model:{value:n.addForm.domain,callback:function(e){t.$set(n.addForm,"domain",e)},expression:"addForm.domain"}})],1)],1),e("ul",{staticClass:"mt-12x leading-8 text-[1.2rem] list-disc ml-20x"},[e("li",[t._v("域名格式为 www.domain.com:88,如未传端口信息,默认为80")])])],1)])],1)])}),[],!1,null,"864a1f6e",null,null).exports)}}}))}();
