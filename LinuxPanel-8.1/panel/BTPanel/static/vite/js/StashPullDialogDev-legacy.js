!function(){function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */t=function(){return n};var r,n={},o=Object.prototype,a=o.hasOwnProperty,i=Object.defineProperty||function(e,t,r){e[t]=r.value},l="function"==typeof Symbol?Symbol:{},c=l.iterator||"@@iterator",u=l.asyncIterator||"@@asyncIterator",s=l.toStringTag||"@@toStringTag";function f(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{f({},"")}catch(r){f=function(e,t,r){return e[t]=r}}function m(e,t,r,n){var o=t&&t.prototype instanceof b?t:b,a=Object.create(o.prototype),l=new T(n||[]);return i(a,"_invoke",{value:F(e,r,l)}),a}function p(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}n.wrap=m;var d="suspendedStart",h="suspendedYield",y="executing",v="completed",g={};function b(){}function x(){}function w(){}var _={};f(_,c,(function(){return this}));var k=Object.getPrototypeOf,j=k&&k(k(N([])));j&&j!==o&&a.call(j,c)&&(_=j);var L=w.prototype=b.prototype=Object.create(_);function E(e){["next","throw","return"].forEach((function(t){f(e,t,(function(e){return this._invoke(t,e)}))}))}function C(t,r){function n(o,i,l,c){var u=p(t[o],t,i);if("throw"!==u.type){var s=u.arg,f=s.value;return f&&"object"==e(f)&&a.call(f,"__await")?r.resolve(f.__await).then((function(e){n("next",e,l,c)}),(function(e){n("throw",e,l,c)})):r.resolve(f).then((function(e){s.value=e,l(s)}),(function(e){return n("throw",e,l,c)}))}c(u.arg)}var o;i(this,"_invoke",{value:function(e,t){function a(){return new r((function(r,o){n(e,t,r,o)}))}return o=o?o.then(a,a):a()}})}function F(e,t,n){var o=d;return function(a,i){if(o===y)throw new Error("Generator is already running");if(o===v){if("throw"===a)throw i;return{value:r,done:!0}}for(n.method=a,n.arg=i;;){var l=n.delegate;if(l){var c=O(l,n);if(c){if(c===g)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===d)throw o=v,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=y;var u=p(e,t,n);if("normal"===u.type){if(o=n.done?v:h,u.arg===g)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(o=v,n.method="throw",n.arg=u.arg)}}}function O(e,t){var n=t.method,o=e.iterator[n];if(o===r)return t.delegate=null,"throw"===n&&e.iterator.return&&(t.method="return",t.arg=r,O(e,t),"throw"===t.method)||"return"!==n&&(t.method="throw",t.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=p(o,e.iterator,t.arg);if("throw"===a.type)return t.method="throw",t.arg=a.arg,t.delegate=null,g;var i=a.arg;return i?i.done?(t[e.resultName]=i.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=r),t.delegate=null,g):i:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,g)}function S(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function P(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function T(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(S,this),this.reset(!0)}function N(t){if(t||""===t){var n=t[c];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,i=function e(){for(;++o<t.length;)if(a.call(t,o))return e.value=t[o],e.done=!1,e;return e.value=r,e.done=!0,e};return i.next=i}}throw new TypeError(e(t)+" is not iterable")}return x.prototype=w,i(L,"constructor",{value:w,configurable:!0}),i(w,"constructor",{value:x,configurable:!0}),x.displayName=f(w,s,"GeneratorFunction"),n.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===x||"GeneratorFunction"===(t.displayName||t.name))},n.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,w):(e.__proto__=w,f(e,s,"GeneratorFunction")),e.prototype=Object.create(L),e},n.awrap=function(e){return{__await:e}},E(C.prototype),f(C.prototype,u,(function(){return this})),n.AsyncIterator=C,n.async=function(e,t,r,o,a){void 0===a&&(a=Promise);var i=new C(m(e,t,r,o),a);return n.isGeneratorFunction(t)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},E(L),f(L,s,"Generator"),f(L,c,(function(){return this})),f(L,"toString",(function(){return"[object Generator]"})),n.keys=function(e){var t=Object(e),r=[];for(var n in t)r.push(n);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},n.values=N,T.prototype={constructor:T,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(P),!e)for(var t in this)"t"===t.charAt(0)&&a.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=r)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function n(n,o){return l.type="throw",l.arg=e,t.next=n,o&&(t.method="next",t.arg=r),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],l=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var c=a.call(i,"catchLoc"),u=a.call(i,"finallyLoc");if(c&&u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&a.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=t&&t<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=e,i.arg=t,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),P(r),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;P(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,n){return this.delegate={iterator:N(e),resultName:t,nextLoc:n},"next"===this.method&&(this.arg=r),g}},n}function r(e,t,r,n,o,a,i){try{var l=e[a](i),c=l.value}catch(u){return void r(u)}l.done?t(c):Promise.resolve(c).then(n,o)}function n(e){return function(){var t=this,n=arguments;return new Promise((function(o,a){var i=e.apply(t,n);function l(e){r(i,o,a,l,c,"next",e)}function c(e){r(i,o,a,l,c,"throw",e)}l(void 0)}))}}System.register(["./index-legacy133.js?v=1714377894636","./main-legacy.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./form-legacy.js?v=1714377894636","./tabs-legacy.js?v=1714377894636","./index-legacy41.js?v=1714377894636","./index-legacy77.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./docker.api-legacy.js?v=1714377894636","./docker.store-legacy.js?v=1714377894636","./index-legacy76.js?v=1714377894636","./alert-legacy.js?v=1714377894636","./xterm-lib-legacy.js?v=1714377894636","./xterm-legacy.js?v=1714377894636","./index-legacy109.js?v=1714377894636","./index-legacy85.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./radio-button-legacy.js?v=1714377894636","./radio-group-legacy.js?v=1714377894636","./index-legacy110.js?v=1714377894636","./check-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./select-legacy.js?v=1714377894636","./index-legacy42.js?v=1714377894636"],(function(e,r){"use strict";var o,a,i,l,c,u,s,f,m,p,d,h,y,v,g,b,x;return{setters:[function(e){o=e._},function(e){a=e.n,i=e.q},function(e){l=e.u,c=e.w,u=e.x,s=e.o},null,null,null,function(e){f=e._},function(e){m=e._},function(e){p=e.e,d=e.b,h=e.v,y=e.h,v=e.j},function(e){g=e.H,b=e.M},function(e){x=e.u},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],execute:function(){var r=p({__name:"StashPullDialogDev",props:{compData:{default:function(){return{}}}},setup:function(e,r){var o=r.expose,a=e,i=x().getMList,l=v().proxy,c=d("common"),u=h({name:"",image:"",cmd:""}),s=d(!1),f=d(),m=d(),p=h({model_index:"btdocker",mod_name:"image",def_name:"pull_from_some_registry",ws_callback:111,name:"",image:""}),w=d(),_={image:[{validator:function(e,t,r){""===t?r(new Error("请输入镜像名")):r()},trigger:["blur"]}]},k=d([]);y(n(t().mark((function e(){var r;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,g();case 3:e.sent.data.forEach((function(e){k.value.push({key:e.name,title:e.name})})),u.name=null===(r=k.value[0])||void 0===r?void 0:r.key,e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])}))));var j=function(){var e=n(t().mark((function e(){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,""!==u.cmd){e.next=4;break}return l.$message.error("请输入命令"),e.abrupt("return");case 4:return s.value=!0,p.name="",p.image="",p.def_name="get_cmd_log",e.next=10,b({cmd:u.cmd},"image");case 10:e.sent,m.value.refreshTerminal(),setTimeout((function(){m.value.socketSend()}),500),e.next=18;break;case 15:e.prev=15,e.t0=e.catch(0);case 18:return e.prev=18,e.finish(18);case 20:case"end":return e.stop()}}),e,null,[[0,15,18,20]])})));return function(){return e.apply(this,arguments)}}(),L=function(){var e=n(t().mark((function e(){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,"cmd"!==c.value){e.next=4;break}return j(),e.abrupt("return");case 4:if(""!==u.name){e.next=7;break}return l.$message.error("请选择仓库名"),e.abrupt("return");case 7:return s.value=!0,e.next=10,l.$refs.cmdFormRef.validate(function(){var e=n(t().mark((function e(r){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r?(p.name=u.name,p.image=u.image,p.def_name="pull_from_some_registry",f.value.refreshTerminal(),setTimeout((function(){f.value.socketSend()}),500)):s.value=!1;case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 10:e.next=15;break;case 12:e.prev=12,e.t0=e.catch(0);case 15:return e.prev=15,e.finish(15);case 17:case"end":return e.stop()}}),e,null,[[0,12,15,17]])})));return function(){return e.apply(this,arguments)}}();return o({onConfirm:L,onCancel:function(){var e,t=f.value.useSocket();null===(e=t)||void 0===e||e.close(),t=null,i()}}),{__sfc:!0,getMList:i,vm:l,props:a,menu:c,cmdForm:u,disabled:s,terminal:f,terminalCmd:m,param:p,cmdFormRef:w,cmdRules:_,options:k,changeName:function(e){u.name=e},completePull:function(){try{s.value=!1,u.image="",u.cmd=""}catch(e){}},onCmdConfirm:j,onConfirm:L}}}),w=function(){var e=this,t=e._self._c,r=e._self._setupProxy;return t("div",{staticClass:"flex flex-col p-16x lib-box"},[t(m,{attrs:{type:"navtwo"},model:{value:r.menu,callback:function(e){r.menu=e},expression:"menu"}},[t(l,{attrs:{name:"common",label:"常规拉取"}},[t(c,{ref:"cmdFormRef",staticClass:"relative w-full mt-[1.6rem]",attrs:{size:"small",model:r.cmdForm,rules:r.cmdRules,disabled:r.disabled,"label-position":"right"},nativeOn:{submit:function(e){e.preventDefault()}}},[t(u,{attrs:{prop:"name",label:"仓库名"}},[t(f,{staticClass:"w-[32rem]",attrs:{options:r.options,change:r.changeName},model:{value:r.cmdForm.name,callback:function(t){e.$set(r.cmdForm,"name",t)},expression:"cmdForm.name"}})],1),t(u,{attrs:{prop:"image",label:"镜像名"}},[t(s,{staticClass:"!w-[32rem]",attrs:{placeholder:"请输入镜像名，按回车拉取,如:image:v1"},nativeOn:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:r.onConfirm.apply(null,arguments)}},model:{value:r.cmdForm.image,callback:function(t){e.$set(r.cmdForm,"image",t)},expression:"cmdForm.image"}},[t("template",{slot:"append"},[t(i,{attrs:{type:"default"},on:{click:r.onConfirm}},[e._v("拉取")])],1)],2)],1),t("div",{staticClass:"resultTitle px-[.2rem] py-[.4rem] mt-16x"},[e._v("拉取结果：")]),t("div",{staticClass:"rounded-default bg-[#333] h-[45.6rem]"},[t(o,{ref:"terminal",attrs:{url:"/ws_model","host-info":r.param,notInit:!0,destroy:!1},on:{complete:r.completePull}})],1)],1)],1),t(l,{attrs:{name:"cmd",label:"命令拉取"}},[t(c,{ref:"cmdRef",staticClass:"relative w-full mt-[1.6rem]",attrs:{size:"large",model:r.cmdForm,rules:r.cmdRules,disabled:r.disabled,"label-position":"right"},nativeOn:{submit:function(e){e.preventDefault()}}},[t(u,{attrs:{prop:"cmd"}},[t(s,{attrs:{autofocus:"",placeholder:"请输入需要执行的命令,docker pull redis:latest，按回车执行"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:r.onConfirm.apply(null,arguments)}},model:{value:r.cmdForm.cmd,callback:function(t){e.$set(r.cmdForm,"cmd",t)},expression:"cmdForm.cmd"}},[t("template",{slot:"append"},[t(i,{attrs:{type:"default"},on:{click:r.onConfirm}},[e._v("执行命令")])],1)],2)],1),t("div",{staticClass:"resultTitle px-[.2rem] py-[.4rem] mt-16x"},[e._v("拉取结果：")]),t("div",{staticClass:"rounded-default bg-[#333] h-[45.6rem]"},[t(o,{ref:"terminalCmd",attrs:{url:"/ws_model","host-info":r.param,notInit:!0,destroy:!1},on:{complete:r.completePull}})],1)],1)],1)],1)],1)};e("default",a(r,w,[],!1,null,"83e7f44d",null,null).exports)}}}))}();