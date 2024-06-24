!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return n};var r,n={},o=Object.prototype,a=o.hasOwnProperty,i=Object.defineProperty||function(t,e,r){t[e]=r.value},l="function"==typeof Symbol?Symbol:{},c=l.iterator||"@@iterator",s=l.asyncIterator||"@@asyncIterator",u=l.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(r){f=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var o=e&&e.prototype instanceof x?e:x,a=Object.create(o.prototype),l=new G(n||[]);return i(a,"_invoke",{value:S(t,r,l)}),a}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}n.wrap=h;var g="suspendedStart",v="suspendedYield",d="executing",y="completed",m={};function x(){}function _(){}function w(){}var b={};f(b,c,(function(){return this}));var j=Object.getPrototypeOf,L=j&&j(j(N([])));L&&L!==o&&a.call(L,c)&&(b=L);var k=w.prototype=x.prototype=Object.create(b);function E(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function F(e,r){function n(o,i,l,c){var s=p(e[o],e,i);if("throw"!==s.type){var u=s.arg,f=u.value;return f&&"object"==t(f)&&a.call(f,"__await")?r.resolve(f.__await).then((function(t){n("next",t,l,c)}),(function(t){n("throw",t,l,c)})):r.resolve(f).then((function(t){u.value=t,l(u)}),(function(t){return n("throw",t,l,c)}))}c(s.arg)}var o;i(this,"_invoke",{value:function(t,e){function a(){return new r((function(r,o){n(t,e,r,o)}))}return o=o?o.then(a,a):a()}})}function S(t,e,n){var o=g;return function(a,i){if(o===d)throw new Error("Generator is already running");if(o===y){if("throw"===a)throw i;return{value:r,done:!0}}for(n.method=a,n.arg=i;;){var l=n.delegate;if(l){var c=C(l,n);if(c){if(c===m)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===g)throw o=y,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var s=p(t,e,n);if("normal"===s.type){if(o=n.done?y:v,s.arg===m)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=y,n.method="throw",n.arg=s.arg)}}}function C(t,e){var n=e.method,o=t.iterator[n];if(o===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=r,C(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var a=p(o,t.iterator,e.arg);if("throw"===a.type)return e.method="throw",e.arg=a.arg,e.delegate=null,m;var i=a.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,m):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,m)}function O(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function G(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(O,this),this.reset(!0)}function N(e){if(e||""===e){var n=e[c];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function t(){for(;++o<e.length;)if(a.call(e,o))return t.value=e[o],t.done=!1,t;return t.value=r,t.done=!0,t};return i.next=i}}throw new TypeError(t(e)+" is not iterable")}return _.prototype=w,i(k,"constructor",{value:w,configurable:!0}),i(w,"constructor",{value:_,configurable:!0}),_.displayName=f(w,u,"GeneratorFunction"),n.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===_||"GeneratorFunction"===(e.displayName||e.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,w):(t.__proto__=w,f(t,u,"GeneratorFunction")),t.prototype=Object.create(k),t},n.awrap=function(t){return{__await:t}},E(F.prototype),f(F.prototype,s,(function(){return this})),n.AsyncIterator=F,n.async=function(t,e,r,o,a){void 0===a&&(a=Promise);var i=new F(h(t,e,r,o),a);return n.isGeneratorFunction(e)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},E(k),f(k,u,"Generator"),f(k,c,(function(){return this})),f(k,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},n.values=N,G.prototype={constructor:G,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(P),!t)for(var e in this)"t"===e.charAt(0)&&a.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,o){return l.type="throw",l.arg=t,e.next=n,o&&(e.method="next",e.arg=r),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],l=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var c=a.call(i,"catchLoc"),s=a.call(i,"finallyLoc");if(c&&s){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&a.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=t,i.arg=e,o?(this.method="next",this.next=o.finallyLoc,m):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),P(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;P(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:N(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),m}},n}function r(t,e,r,n,o,a,i){try{var l=t[a](i),c=l.value}catch(s){return void r(s)}l.done?e(c):Promise.resolve(c).then(n,o)}function n(t){return function(){var e=this,n=arguments;return new Promise((function(o,a){var i=t.apply(e,n);function l(t){r(i,o,a,l,c,"next",t)}function c(t){r(i,o,a,l,c,"throw",t)}l(void 0)}))}}System.register(["./index-legacy118.js?v=1714377894636","./index-legacy46.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./form-legacy.js?v=1714377894636","./index-legacy45.js?v=1714377894636","./index-legacy85.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./site.store-legacy.js?v=1714377894636","./switch-legacy.js?v=1714377894636","./index.vue_vue_type_style_index_0_lang-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636"],(function(t,r){"use strict";var o,a,i,l,c,s,u,f,h,p,g,v,d,y,m,x,_,w,b,j,L;return{setters:[function(t){o=t._},function(t){a=t._},function(t){i=t.w,l=t.x,c=t.L},function(t){s=t.o,u=t.l,f=t.aS,h=t.n,p=t.q},null,null,null,function(t){g=t._},function(t){v=t._},function(t){d=t.e,y=t.b,m=t.v,x=t.H,_=t.h,w=t.j},function(t){b=t.dG,j=t.dH,L=t.dI},null,null,null,null,null,null,null,null],execute:function(){var k=d({__name:"GlobalSetting",setup:function(t){var o=w().proxy,a=y(!1),i=m({log_split:!1,log_path:""}),l=m({page_index:!1,page_404:!1}),c=m({path:[{required:!0,message:"请选择日志路径",trigger:"change"}]}),h=y([{label:"名称1",prop:"site_name"},{label:"结果",render:function(t){return x("span",{class:t.status?"text-primary":"text-danger"},t.status?"操作成功":"操作失败")}}]),p=function(){var t=n(e().mark((function t(){var r,n;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a.value=!0,t.prev=1,t.next=4,b();case 4:r=t.sent,n=r.data,i.log_path=n.log_path,i.log_split=n.log_split,l.page_index=n.page_index,l.page_404=n.page_404,t.next=15;break;case 12:t.prev=12,t.t0=t.catch(1);case 15:return t.prev=15,a.value=!1,t.finish(15);case 18:case"end":return t.stop()}}),t,null,[[1,12,15,18]])})));return function(){return t.apply(this,arguments)}}(),g=function(){var t=n(e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,o.$confirm({title:"修改日志路径",message:"是否修改日志预设路径,继续执行?",type:"check",icon:"warning",checkText:"更改已有网站日志",checkEvent:function(){var t=n(e().mark((function t(n){var a;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=1,t.next=4,j({mv_log:"1",change_sites:n?"1":"0",log_path:i.log_path});case 4:a=t.sent,n?u({title:"修改日志路径结果",area:42,component:function(){return v((function(){return r.import("./index-legacy63.js?v=1714377894636")}),void 0,r.meta.url)},compData:{resultColumn:h.value,resultData:a.data,resultTitle:"修改日志路径"}}):o.$message.request(a),t.next=12;break;case 9:t.prev=9,t.t0=t.catch(1);case 12:case"end":return t.stop()}}),t,null,[[1,9]])})));return function(e){return t.apply(this,arguments)}}()});case 3:t.next=8;break;case 5:t.prev=5,t.t0=t.catch(0);case 8:case"end":return t.stop()}}),t,null,[[0,5]])})));return function(){return t.apply(this,arguments)}}(),d=function(){var t=n(e().mark((function t(){var r,n;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=o.$load("正在设置中，请稍候..."),t.prev=1,t.next=4,L({log_split:i.log_split,page_index:l.page_index,page_404:l.page_404});case 4:n=t.sent,o.$message.request(n),r.close(),t.next=12;break;case 9:t.prev=9,t.t0=t.catch(1);case 12:return t.prev=12,r.close(),t.finish(12);case 15:case"end":return t.stop()}}),t,null,[[1,9,12,15]])})));return function(){return t.apply(this,arguments)}}();return _((function(){p()})),{__sfc:!0,vm:o,viewLoading:a,logForm:i,defalutForm:l,rules:c,resultColumn:h,getGloalData:p,handleSave:g,onPathChange:function(){f({type:"dir",path:i.log_path,change:function(t){i.log_path=t}})},handleChangeStatus:d,isRelease:s}}});t("default",h(k,(function(){var t=this,e=t._self._c,r=t._self._setupProxy;return e("div",{directives:[{name:"loading",rawName:"v-loading",value:r.viewLoading,expression:"viewLoading"}],staticClass:"flex flex-col site-globa-setting-module"},[e("div",[e(i,{attrs:{model:r.logForm,rule:r.rules}},[e(l,{attrs:{label:"日志切割"}},[e("div",{staticClass:"flex items-center"},[e(a,{on:{change:r.handleChangeStatus},model:{value:r.logForm.log_split,callback:function(e){t.$set(r.logForm,"log_split",e)},expression:"logForm.log_split"}}),e("span",{staticClass:"text-[#999] ml-4x"},[t._v(" *提示：开启该选项将自动创建网站日志切割任务，当存在所有网站日志切割任务时不会新建")])],1)]),r.isRelease?t._e():e(l,{attrs:{label:"预设日志路径"}},[e("div",{staticClass:"flex items-center"},[e(g,{attrs:{iconType:"folder"},on:{folder:r.onPathChange},model:{value:r.logForm.log_path,callback:function(e){t.$set(r.logForm,"log_path",e)},expression:"logForm.log_path"}}),e(p,{staticClass:"!ml-4x",on:{click:r.handleSave}},[t._v("保存")])],1)])],1)],1),e(c),e(i,{attrs:{model:r.defalutForm}},[e(l,{attrs:{label:"默认页面设置"}},[e("div",{staticClass:"flex items-center"},[e(a,{on:{change:r.handleChangeStatus},model:{value:r.defalutForm.page_index,callback:function(e){t.$set(r.defalutForm,"page_index",e)},expression:"defalutForm.page_index"}}),e("span",{staticClass:"ml-4x mb-2x"},[t._v(" 自动生成index.html(默认首页)")])],1)]),e(l,{attrs:{label:" "}},[e("div",{staticClass:"flex items-center"},[e(a,{on:{change:r.handleChangeStatus},model:{value:r.defalutForm.page_404,callback:function(e){t.$set(r.defalutForm,"page_404",e)},expression:"defalutForm.page_404"}}),e("span",{staticClass:"ml-4x mb-2x"},[t._v(" 自动生成404.html(默认404页面)")])],1)])],1),e(o,{staticClass:"ml-20x mt-20x",attrs:{list:[{text:"请注意，仅对后续创建的PHP网站生效。"}],"list-style":"disc"}})],1)}),[],!1,null,"ee3c898c",null,null).exports)}}}))}();