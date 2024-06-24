!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return n};var r,n={},a=Object.prototype,o=a.hasOwnProperty,i=Object.defineProperty||function(t,e,r){t[e]=r.value},s="function"==typeof Symbol?Symbol:{},l=s.iterator||"@@iterator",c=s.asyncIterator||"@@asyncIterator",u=s.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(r){f=function(t,e,r){return t[e]=r}}function p(t,e,r,n){var a=e&&e.prototype instanceof b?e:b,o=Object.create(a.prototype),s=new N(n||[]);return i(o,"_invoke",{value:P(t,r,s)}),o}function m(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}n.wrap=p;var h="suspendedStart",v="suspendedYield",d="executing",y="completed",g={};function b(){}function _(){}function x(){}var w={};f(w,l,(function(){return this}));var k=Object.getPrototypeOf,S=k&&k(k(T([])));S&&S!==a&&o.call(S,l)&&(w=S);var j=x.prototype=b.prototype=Object.create(w);function $(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function C(e,r){function n(a,i,s,l){var c=m(e[a],e,i);if("throw"!==c.type){var u=c.arg,f=u.value;return f&&"object"==t(f)&&o.call(f,"__await")?r.resolve(f.__await).then((function(t){n("next",t,s,l)}),(function(t){n("throw",t,s,l)})):r.resolve(f).then((function(t){u.value=t,s(u)}),(function(t){return n("throw",t,s,l)}))}l(c.arg)}var a;i(this,"_invoke",{value:function(t,e){function o(){return new r((function(r,a){n(t,e,r,a)}))}return a=a?a.then(o,o):o()}})}function P(t,e,n){var a=h;return function(o,i){if(a===d)throw new Error("Generator is already running");if(a===y){if("throw"===o)throw i;return{value:r,done:!0}}for(n.method=o,n.arg=i;;){var s=n.delegate;if(s){var l=E(s,n);if(l){if(l===g)continue;return l}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(a===h)throw a=y,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);a=d;var c=m(t,e,n);if("normal"===c.type){if(a=n.done?y:v,c.arg===g)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(a=y,n.method="throw",n.arg=c.arg)}}}function E(t,e){var n=e.method,a=t.iterator[n];if(a===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=r,E(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var o=m(a,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,g;var i=o.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,g):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,g)}function L(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function O(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(L,this),this.reset(!0)}function T(e){if(e||""===e){var n=e[l];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,i=function t(){for(;++a<e.length;)if(o.call(e,a))return t.value=e[a],t.done=!1,t;return t.value=r,t.done=!0,t};return i.next=i}}throw new TypeError(t(e)+" is not iterable")}return _.prototype=x,i(j,"constructor",{value:x,configurable:!0}),i(x,"constructor",{value:_,configurable:!0}),_.displayName=f(x,u,"GeneratorFunction"),n.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===_||"GeneratorFunction"===(e.displayName||e.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,u,"GeneratorFunction")),t.prototype=Object.create(j),t},n.awrap=function(t){return{__await:t}},$(C.prototype),f(C.prototype,c,(function(){return this})),n.AsyncIterator=C,n.async=function(t,e,r,a,o){void 0===o&&(o=Promise);var i=new C(p(t,e,r,a),o);return n.isGeneratorFunction(e)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},$(j),f(j,u,"Generator"),f(j,l,(function(){return this})),f(j,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},n.values=T,N.prototype={constructor:N,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(O),!t)for(var e in this)"t"===e.charAt(0)&&o.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,a){return s.type="throw",s.arg=t,e.next=n,a&&(e.method="next",e.arg=r),!!a}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],s=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var l=o.call(i,"catchLoc"),c=o.call(i,"finallyLoc");if(l&&c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(l){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&o.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var a=n;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),O(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var a=n.arg;O(r)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:T(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),g}},n}function r(t,e,r,n,a,o,i){try{var s=t[o](i),l=s.value}catch(c){return void r(c)}s.done?e(l):Promise.resolve(l).then(n,a)}function n(t){return function(){var e=this,n=arguments;return new Promise((function(a,o){var i=t.apply(e,n);function s(t){r(i,a,o,s,l,"next",t)}function l(t){r(i,a,o,s,l,"throw",t)}s(void 0)}))}}System.register(["./vue-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./form-legacy.js?v=1714377894636","./index-legacy44.js?v=1714377894636","./card-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636"],(function(r,a){"use strict";var o,i,s,l,c,u,f,p,m,h,v,d,y,g,b,_,x,w;return{setters:[function(t){o=t.e,i=t.v,s=t.j,l=t.b,c=t.h},function(t){u=t.n,f=t.q,p=t.bD,m=t.a,h=t.bE,v=t.r,d=t._},function(t){y=t.w,g=t.x,b=t.o,_=t.p},null,null,function(t){x=t._},null,function(t){w=t.g},null,null,null,null,null],execute:function(){var a=u({},(function(){var t=this,e=t._self._c;return e("div",{staticClass:"bt-msg-config"},[e("div",{staticClass:"p-4rem"},[e("div",{staticClass:"from"},[t._t("from")],2),e("div",{staticClass:"mt-2rem ml-2rem"},[t._t("tip")],2)]),e("div",[e("div",{staticClass:"el-dialog__footer"},[e("div",{staticClass:"footer"},[e(f,{attrs:{type:"cancel"},on:{click:function(e){return t.$emit("close")}}},[t._v("取消")]),e(f,{on:{click:function(e){return t.$emit("save")}}},[t._v("保存")])],1)])])])}),[],!1,null,null,null,null).exports,k=o({__name:"RobotBase",props:["tipName","tipUrl","placeholder","type"],setup:function(t){var r=t,o=s().proxy,l=i({name:"",url:""}),c=function(){var t=n(e().mark((function t(){var n,a;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,n=o.$load(o.$t("正在设置".concat(r.type,"信息配置，请稍后..."))),t.next=4,p(r.type,{title:l.name,url:l.url,atall:"True"});case 4:a=t.sent,o.$message.request(a),o.$emit("callback"),o.$emit("close"),t.next=13;break;case 10:t.prev=10,t.t0=t.catch(0);case 13:return t.prev=13,n&&n.close(),t.finish(13);case 16:case"end":return t.stop()}}),t,null,[[0,10,13,16]])})));return function(){return t.apply(this,arguments)}}();return{__sfc:!0,props:r,vm:o,form:l,save:c,MsgBase:a}}}),S=u(k,(function(){var t=this,e=t._self._c,r=t._self._setupProxy;return e(r.MsgBase,{on:{save:r.save,close:function(e){return t.$emit("close")}},scopedSlots:t._u([{key:"from",fn:function(){return[e(y,[e(g,{attrs:{label:"名称"}},[e(b,{attrs:{autofocus:"",placeholder:"机器人名称或备注"},model:{value:r.form.name,callback:function(e){t.$set(r.form,"name",e)},expression:"form.name"}})],1),e(g,{attrs:{label:"URL"}},[e(b,{staticClass:"url",attrs:{type:"textarea",rows:4,placeholder:"请输入".concat(t.placeholder,"机器人URL")},model:{value:r.form.url,callback:function(e){t.$set(r.form,"url",e)},expression:"form.url"}})],1)],1)]},proxy:!0},{key:"tip",fn:function(){return[e("ul",{staticStyle:{"list-style":"disc"}},[e("li",[e(m,{attrs:{href:t.tipUrl}},[t._v("如何创建"+t._s(t.tipName)+"机器人")])],1)])]},proxy:!0}])})}),[],!1,null,"d2efcdf2",null,null).exports,j=o({__name:"Mail",setup:function(t){var r=s().proxy,o=i({emailName:"",emailPass:"",emailHost:"",emailPort:"465"});return{__sfc:!0,vm:r,email:o,rules:{emailName:[{required:!0,message:"请输入发送人邮箱",trigger:"blur"},{type:"email",message:"请输入正确的邮箱地址",trigger:["blur","change"]}],emailPass:[{required:!0,message:"请输入SMTP密码",trigger:"blur"}],emailHost:[{required:!0,message:"请输入SMTP服务器",trigger:"blur"}],emailPort:[{required:!0,message:"请输入端口",trigger:"blur"}]},save:function(){r.$refs.emailRef.validate(function(){var t=n(e().mark((function t(n){var a,i;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!n){t.next=17;break}return t.prev=1,a=r.$load(r.$t("正在设置邮件信息配置，请稍后...")),t.next=5,p("mail",{send:"1",qq_mail:o.emailName,qq_stmp_pwd:o.emailPass,hosts:o.emailHost,port:o.emailPort});case 5:i=t.sent,r.$message.request(i),r.$emit("callback"),r.$emit("close"),t.next=14;break;case 11:t.prev=11,t.t0=t.catch(1);case 14:return t.prev=14,a&&a.close(),t.finish(14);case 17:case"end":return t.stop()}}),t,null,[[1,11,14,17]])})));return function(e){return t.apply(this,arguments)}}())},MsgBase:a}}}),$=u(j,(function(){var t=this,e=t._self._c,r=t._self._setupProxy;return e(r.MsgBase,{on:{save:r.save,close:function(e){return t.$emit("close")}},scopedSlots:t._u([{key:"from",fn:function(){return[e(y,{ref:"emailRef",attrs:{model:r.email,rules:r.rules}},[e(g,{attrs:{label:"发送人邮箱",prop:"emailName"}},[e(b,{directives:[{name:"focus",rawName:"v-focus"}],model:{value:r.email.emailName,callback:function(e){t.$set(r.email,"emailName",e)},expression:"email.emailName"}})],1),e(g,{attrs:{label:"SMTP密码",prop:"emailPass"}},[e(b,{attrs:{type:"password"},model:{value:r.email.emailPass,callback:function(e){t.$set(r.email,"emailPass",e)},expression:"email.emailPass"}})],1),e(g,{attrs:{label:"SMTP服务器",prop:"emailHost"}},[e(b,{model:{value:r.email.emailHost,callback:function(e){t.$set(r.email,"emailHost",e)},expression:"email.emailHost"}})],1),e(g,{attrs:{label:"端口",prop:"emailPort"}},[e(b,{model:{value:r.email.emailPort,callback:function(e){t.$set(r.email,"emailPort",e)},expression:"email.emailPort"}})],1)],1)]},proxy:!0},{key:"tip",fn:function(){return[e("ul",{staticStyle:{"list-style":"disc"}},[e("li",[t._v("推荐使用465端口，协议为SSL/TLS")]),e("li",[t._v("25端口为SMTP协议，587端口为STARTTLS协议")]),e("li",[e(m,{attrs:{href:"https://www.bt.cn/bbs/thread-108097-1-1.html"}},[t._v("配置教程")])],1)])]},proxy:!0}])})}),[],!1,null,null,null,null).exports,C={exports:{}};!function(e){e.exports=function(e){var r={};function n(t){if(r[t])return r[t].exports;var a=r[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,n),a.l=!0,a.exports}return n.m=e,n.c=r,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(e,r){if(1&r&&(e=n(e)),8&r)return e;if(4&r&&"object"===t(e)&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var o in e)n.d(a,o,function(t){return e[t]}.bind(null,o));return a},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/dist/",n(n.s=135)}({0:function(t,e,r){function n(t,e,r,n,a,o,i,s){var l,c="function"==typeof t?t.options:t;if(e&&(c.render=e,c.staticRenderFns=r,c._compiled=!0),n&&(c.functional=!0),o&&(c._scopeId="data-v-"+o),i?(l=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),a&&a.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(i)},c._ssrRegister=l):a&&(l=s?function(){a.call(this,this.$root.$options.shadowRoot)}:a),l)if(c.functional){c._injectStyles=l;var u=c.render;c.render=function(t,e){return l.call(e),u(t,e)}}else{var f=c.beforeCreate;c.beforeCreate=f?[].concat(f,l):[l]}return{exports:t,options:c}}r.d(e,"a",(function(){return n}))},135:function(t,e,r){r.r(e);var n={name:"ElAvatar",props:{size:{type:[Number,String],validator:function(t){return"string"==typeof t?["large","medium","small"].includes(t):"number"==typeof t}},shape:{type:String,default:"circle",validator:function(t){return["circle","square"].includes(t)}},icon:String,src:String,alt:String,srcSet:String,error:Function,fit:{type:String,default:"cover"}},data:function(){return{isImageExist:!0}},computed:{avatarClass:function(){var t=this.size,e=this.icon,r=this.shape,n=["el-avatar"];return t&&"string"==typeof t&&n.push("el-avatar--"+t),e&&n.push("el-avatar--icon"),r&&n.push("el-avatar--"+r),n.join(" ")}},methods:{handleError:function(){var t=this.error;!1!==(t?t():void 0)&&(this.isImageExist=!1)},renderAvatar:function(){var t=this.$createElement,e=this.icon,r=this.src,n=this.alt,a=this.isImageExist,o=this.srcSet,i=this.fit;return a&&r?t("img",{attrs:{src:r,alt:n,srcSet:o},on:{error:this.handleError},style:{"object-fit":i}}):e?t("i",{class:e}):this.$slots.default}},render:function(){var t=arguments[0],e=this.avatarClass,r=this.size;return t("span",{class:e,style:"number"==typeof r?{height:r+"px",width:r+"px",lineHeight:r+"px"}:{}},[this.renderAvatar()])}},a=n,o=r(0),i=Object(o.a)(a,undefined,undefined,!1,null,null,null);i.options.__file="packages/avatar/src/main.vue";var s=i.exports;s.install=function(t){t.component(s.name,s)},e.default=s}})}(C);var P=w(C.exports),E=o({__name:"WeChatAccount",setup:function(t){var r=s().proxy,o=i({circleUrl:"",visible:!1,weChatAccount:!1,nickname:""}),u=i({nonce:0,res:{is_bound:0,is_subscribe:0,head_img:"",nickname:"",remaining:0},success:!1,status:!1}),f=l(""),p=function(){var t=n(e().mark((function t(){var n,a,o;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,n=r.$load(r.$t("正在获取信息配置，请稍后...")),t.next=4,h("wx_account","get_web_info");case 4:a=t.sent,o=a.data,u=Object.assign(u,o),t.next=12;break;case 9:t.prev=9,t.t0=t.catch(0);case 12:return t.prev=12,n&&n.close(),t.finish(12);case 15:case"end":return t.stop()}}),t,null,[[0,9,12,15]])})));return function(){return t.apply(this,arguments)}}(),m=function(){var t=n(e().mark((function t(){var r,n;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,!o.weChatAccount||""===f.value){t.next=3;break}return t.abrupt("return");case 3:return t.next=5,h("wx_account","get_auth_url");case 5:r=t.sent,n=r.data,f.value=n.res,t.next=13;break;case 10:t.prev=10,t.t0=t.catch(0);case 13:return t.prev=13,t.finish(13);case 15:case"end":return t.stop()}}),t,null,[[0,10,13,15]])})));return function(){return t.apply(this,arguments)}}(),v=function(){var t=n(e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o.visible=!1,o.weChatAccount=!1,f.value="",t.next=5,p();case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),d=function(){var t=n(e().mark((function t(){var n,a;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,n=r.$load(r.$t("正在发送测试消息，请稍后...")),t.next=4,h("wx_account","push_data","发送测试消息");case 4:a=t.sent,r.$message.request(a),t.next=11;break;case 8:t.prev=8,t.t0=t.catch(0);case 11:return t.prev=11,n&&n.close(),t.finish(11);case 14:case"end":return t.stop()}}),t,null,[[0,8,11,14]])})));return function(){return t.apply(this,arguments)}}();return c(n(e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,p();case 2:case"end":return t.stop()}}),t)})))),{__sfc:!0,vm:r,form:o,msgData:u,qrCode:f,getMsgFunData:p,getQrCode:m,ok:v,setMsgFun:d,MsgBase:a}}}),L=u(E,(function(){var t=this,e=t._self._c,r=t._self._setupProxy;return e("div",[e(r.MsgBase,{on:{save:function(e){return t.$emit("close")}},scopedSlots:t._u([{key:"from",fn:function(){return[e(y,{attrs:{"label-position":"right","label-width":"100px"}},[e(g,{attrs:{label:"绑定微信公众号"}},[e("div",{staticStyle:{display:"flex","flex-direction":"row","flex-wrap":"nowrap","justify-content":"flex-start","align-items":"center"}},[1===r.msgData.res.is_subscribe?e("span",{staticStyle:{color:"#20a53a"}},[t._v("已绑定")]):t._e(),0===r.msgData.res.is_subscribe?e("span",{staticStyle:{color:"red"}},[t._v("未绑定")]):t._e(),e(v,{attrs:{width:"160","popper-class":"white-popover"},model:{value:r.form.visible,callback:function(e){t.$set(r.form,"visible",e)},expression:"form.visible"}},[e(_,{staticStyle:{"box-shadow":"rgb(0 0 0 / 46%) 0px 0 2rem 0px"},attrs:{shadow:"always"}},[e("span",{staticStyle:{"font-size":"12px"}},[t._v("请扫码，进行绑定")]),e(d,{attrs:{src:"https://www.bt.cn/Public/img/bt_wx.jpg",custom:!0}}),e(f,{on:{click:r.ok}},[t._v("已扫码并完成绑定")])],1),e(f,{staticClass:"!ml-1.6rem",attrs:{slot:"reference"},slot:"reference"},[t._v("立即绑定")])],1)],1)]),e(g,{attrs:{label:"绑定微信帐号"}},[e("div",{staticStyle:{display:"flex","flex-direction":"row","flex-wrap":"nowrap","justify-content":"flex-start","align-items":"center"}},[1===r.msgData.res.is_bound&&""===r.msgData.res.nickname?e("span",{staticStyle:{color:"#20a53a"}},[t._v("已绑定")]):t._e(),1===r.msgData.res.is_bound?e("div",{staticStyle:{display:"flex","flex-direction":"row","justify-content":"flex-start","align-items":"center"}},[e(P,{attrs:{size:"small",src:r.msgData.res.head_img}}),e("span",{staticClass:"ml-1.5rem"},[t._v(t._s(r.msgData.res.nickname))])],1):t._e(),0===r.msgData.res.is_bound?e("span",{staticStyle:{color:"red"}},[t._v("未绑定")]):t._e(),e(v,{attrs:{width:"190","popper-class":"white-popover"},model:{value:r.form.weChatAccount,callback:function(e){t.$set(r.form,"weChatAccount",e)},expression:"form.weChatAccount"}},[e(_,{staticStyle:{"box-shadow":"rgb(0 0 0 / 46%) 0px 0 2rem 0px"},attrs:{shadow:"always"}},[e("div",{staticStyle:{display:"flex","flex-direction":"column","align-items":"center"}},[e("span",{staticStyle:{"font-size":"12px"}},[t._v("请扫码，进行绑定")]),e(x,{directives:[{name:"bt-loading",rawName:"v-bt-loading",value:""===r.qrCode,expression:"qrCode === ''"},{name:"bt-loading",rawName:"v-bt-loading:title",value:"正在获取二维码，请稍后....",expression:"'正在获取二维码，请稍后....'",arg:"title"},{name:"show",rawName:"v-show",value:""!==r.qrCode,expression:"qrCode !== ''"}],attrs:{value:r.qrCode,size:150}}),e(f,{on:{click:r.ok}},[t._v("已扫码并完成绑定")])],1)]),e(f,{staticClass:"!ml-1.6rem",attrs:{slot:"reference"},on:{click:r.getQrCode},slot:"reference"},[t._v(" "+t._s(1===r.msgData.res.is_bound?"更换微信账号":"立即绑定")+" ")])],1)],1)]),e(g,{attrs:{label:"今日剩余发送次数"}},[e("span",[t._v(t._s(r.msgData.res.remaining))]),e(f,{staticClass:"!ml-1.6rem",on:{click:r.setMsgFun}},[t._v("发送测试消息")])],1)],1)]},proxy:!0},{key:"tip",fn:function(){return[e("ul",{staticStyle:{"list-style":"disc"}},[e("li",[t._v("没有绑定微信公众号无法接收面板告警消息")]),e("li",[t._v("当前为体验版,限制每个宝塔账号发送频率100条/天")])])]},proxy:!0}])})],1)}),[],!1,null,"408a7938",null,null).exports;r("default",u(o({__name:"index",props:{compData:{default:function(){return{}}}},setup:function(t){var e=t,r=e.compData;return{__sfc:!0,props:e,type:r.type,callback:r.callback,RobotBase:S,Mail:$,WeChatAccount:L}}}),(function(){var t=this,e=t._self._c,r=t._self._setupProxy;return e("div",["dingding"===r.type?e(r.RobotBase,{staticClass:"dingding",attrs:{placeholder:"钉钉","tip-name":"钉钉","tip-url":"https://www.bt.cn/bbs/thread-108081-1-1.html",type:"dingding"},on:{close:function(e){return t.$emit("close")},callback:r.callback}}):t._e(),"feishu"===r.type?e(r.RobotBase,{staticClass:"feishu",attrs:{placeholder:"飞书","tip-name":"飞书","tip-url":"https://www.bt.cn/bbs/thread-108274-1-1.html",type:"feishu"},on:{close:function(e){return t.$emit("close")},callback:r.callback}}):t._e(),"weixin"===r.type?e(r.RobotBase,{staticClass:"weixin",attrs:{placeholder:"企业微信","tip-name":"企业微信","tip-url":"https://www.bt.cn/bbs/thread-108116-1-1.html",type:"weixin"},on:{close:function(e){return t.$emit("close")},callback:r.callback}}):t._e(),"mail"===r.type?e(r.Mail,{on:{callback:r.callback,close:function(e){return t.$emit("close")}}}):t._e(),"wx_account"===r.type?e(r.WeChatAccount,{on:{save:function(e){return t.$emit("close")}}}):t._e()],1)}),[],!1,null,null,null,null).exports)}}}))}();
