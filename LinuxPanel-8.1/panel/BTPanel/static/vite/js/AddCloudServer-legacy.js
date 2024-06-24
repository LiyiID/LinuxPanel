!function(){function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */t=function(){return n};var r,n={},o=Object.prototype,a=o.hasOwnProperty,i=Object.defineProperty||function(e,t,r){e[t]=r.value},s="function"==typeof Symbol?Symbol:{},u=s.iterator||"@@iterator",l=s.asyncIterator||"@@asyncIterator",c=s.toStringTag||"@@toStringTag";function f(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{f({},"")}catch(r){f=function(e,t,r){return e[t]=r}}function p(e,t,r,n){var o=t&&t.prototype instanceof b?t:b,a=Object.create(o.prototype),s=new q(n||[]);return i(a,"_invoke",{value:k(e,r,s)}),a}function v(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}n.wrap=p;var h="suspendedStart",d="suspendedYield",y="executing",m="completed",g={};function b(){}function w(){}function _(){}var x={};f(x,u,(function(){return this}));var j=Object.getPrototypeOf,L=j&&j(j(N([])));L&&L!==o&&a.call(L,u)&&(x=L);var O=_.prototype=b.prototype=Object.create(x);function S(e){["next","throw","return"].forEach((function(t){f(e,t,(function(e){return this._invoke(t,e)}))}))}function E(t,r){function n(o,i,s,u){var l=v(t[o],t,i);if("throw"!==l.type){var c=l.arg,f=c.value;return f&&"object"==e(f)&&a.call(f,"__await")?r.resolve(f.__await).then((function(e){n("next",e,s,u)}),(function(e){n("throw",e,s,u)})):r.resolve(f).then((function(e){c.value=e,s(c)}),(function(e){return n("throw",e,s,u)}))}u(l.arg)}var o;i(this,"_invoke",{value:function(e,t){function a(){return new r((function(r,o){n(e,t,r,o)}))}return o=o?o.then(a,a):a()}})}function k(e,t,n){var o=h;return function(a,i){if(o===y)throw new Error("Generator is already running");if(o===m){if("throw"===a)throw i;return{value:r,done:!0}}for(n.method=a,n.arg=i;;){var s=n.delegate;if(s){var u=F(s,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===h)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=y;var l=v(e,t,n);if("normal"===l.type){if(o=n.done?m:d,l.arg===g)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(o=m,n.method="throw",n.arg=l.arg)}}}function F(e,t){var n=t.method,o=e.iterator[n];if(o===r)return t.delegate=null,"throw"===n&&e.iterator.return&&(t.method="return",t.arg=r,F(e,t),"throw"===t.method)||"return"!==n&&(t.method="throw",t.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=v(o,e.iterator,t.arg);if("throw"===a.type)return t.method="throw",t.arg=a.arg,t.delegate=null,g;var i=a.arg;return i?i.done?(t[e.resultName]=i.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=r),t.delegate=null,g):i:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,g)}function P(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function D(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function q(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(P,this),this.reset(!0)}function N(t){if(t||""===t){var n=t[u];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,i=function e(){for(;++o<t.length;)if(a.call(t,o))return e.value=t[o],e.done=!1,e;return e.value=r,e.done=!0,e};return i.next=i}}throw new TypeError(e(t)+" is not iterable")}return w.prototype=_,i(O,"constructor",{value:_,configurable:!0}),i(_,"constructor",{value:w,configurable:!0}),w.displayName=f(_,c,"GeneratorFunction"),n.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===w||"GeneratorFunction"===(t.displayName||t.name))},n.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,_):(e.__proto__=_,f(e,c,"GeneratorFunction")),e.prototype=Object.create(O),e},n.awrap=function(e){return{__await:e}},S(E.prototype),f(E.prototype,l,(function(){return this})),n.AsyncIterator=E,n.async=function(e,t,r,o,a){void 0===a&&(a=Promise);var i=new E(p(e,t,r,o),a);return n.isGeneratorFunction(t)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},S(O),f(O,c,"Generator"),f(O,u,(function(){return this})),f(O,"toString",(function(){return"[object Generator]"})),n.keys=function(e){var t=Object(e),r=[];for(var n in t)r.push(n);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},n.values=N,q.prototype={constructor:q,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(D),!e)for(var t in this)"t"===t.charAt(0)&&a.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=r)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function n(n,o){return s.type="throw",s.arg=e,t.next=n,o&&(t.method="next",t.arg=r),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],s=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var u=a.call(i,"catchLoc"),l=a.call(i,"finallyLoc");if(u&&l){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&a.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=t&&t<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=e,i.arg=t,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),D(r),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;D(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,n){return this.delegate={iterator:N(e),resultName:t,nextLoc:n},"next"===this.method&&(this.arg=r),g}},n}function r(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function n(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(t,r,n){var o;return o=function(t,r){if("object"!=e(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var o=n.call(t,r||"default");if("object"!=e(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(r,"string"),(r="symbol"==e(o)?o:String(o))in t?Object.defineProperty(t,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[r]=n,t}function a(e,t,r,n,o,a,i){try{var s=e[a](i),u=s.value}catch(l){return void r(l)}s.done?t(u):Promise.resolve(u).then(n,o)}function i(e){return function(){var t=this,r=arguments;return new Promise((function(n,o){var i=e.apply(t,r);function s(e){a(i,n,o,s,u,"next",e)}function u(e){a(i,n,o,s,u,"throw",e)}s(void 0)}))}}System.register(["./index-legacy118.js?v=1714377894636","./index-legacy85.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./form-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./mysql.store-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./index-legacy28.js?v=1714377894636","./confirm-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./index-legacy77.js?v=1714377894636","./tabs-legacy.js?v=1714377894636","./index-legacy42.js?v=1714377894636","./config-legacy.js?v=1714377894636"],(function(e,r){"use strict";var o,a,s,u,l,c,f,p,v,h,d,y,m,g,b,w,_,x,j,L,O;return{setters:[function(e){o=e._},function(e){a=e._},function(e){s=e.w,u=e.x},function(e){l=e.c1,c=e.n},null,null,function(e){f=e.e,p=e.b,v=e.w,h=e.h,d=e.j},function(e){y=e.m,m=e.a1,g=e.a2,b=e.a3,w=e.a4},function(e){_=e.h,x=e.a},null,function(e){j=e.g,L=e.r},function(e){O=e.o},null,null,null,null,null,null,null,null,null],execute:function(){var r=f({__name:"AddCloudServer",props:{compData:{default:{}}},setup:function(e,r){var o=r.expose,a=e,s=y().getServerList,u=j(),c=u.refs.tabActive,f=u.getServerList,S=L().getServerList,E=d().proxy,k=l(E).loading,F=p(null),P=p(!1),D=p({mysql:{port:3306,db_user:"root"},mongodb:{port:27017,db_user:"root"},sqlserver:{port:1433,db_user:"sa"},pgsql:{port:5432,db_user:"postgres"},redis:{port:6379,db_user:""}}),q=p({db_host:"",db_port:D.value[c.value].port,db_user:D.value[c.value].db_user,db_password:"",ps:"",type:c.value}),N=p([{text:"支持MySQL5.5、MariaDB10.1及以上版本"},{text:"支持阿里云、腾讯云等云厂商的云数据库"},{text:"注意1：请确保本服务器有访问数据库的权限"},{text:"注意2：请确保填写的管理员帐号具备足够的权限"},{text:"注意3：通过宝塔安装的数据库root默认不支持远程权限"}]),C={db_host:[{required:!0,message:"请输入服务器地址",trigger:["blur","change"]},{validator:function(e,t,r){""===t?r(new Error("请输入服务器地址")):_(t)||x(t)?r():r(new Error("请输入正确的服务器地址"))},trigger:["blur","change"]}],db_password:[{required:!0,message:"请输入服务器密码",trigger:["blur","change"]}],db_user:[{required:!0,message:"请输入管理员名称",trigger:["blur","change"]}],db_port:[{required:!0,message:"请输入服务器端口",trigger:["blur","change"]}]},$=function(){var e=i(t().mark((function e(r){var o,s,u;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null===(o=a.compData.formData)||void 0===o||!o.db_host){e.next=11;break}return e.next=3,T();case 3:if(null!=(s=e.sent)&&s.status){e.next=7;break}return E.$message.msg({customClass:"bt-message-error-html",dangerouslyUseHTMLString:!0,message:(null==s?void 0:s.msg)||"修改失败",type:"error",duration:0,showClose:!0}),e.abrupt("return");case 7:return E.$message.request(s),a.compData.refreshEvent(),r(),e.abrupt("return");case 11:O({$refs:F.value,loading:P.value,request:function(){var e=i(t().mark((function e(){var r,o;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("mysql"!=c.value){e.next=6;break}return e.next=3,m(n(n({},q.value),{},{db_ps:q.value.ps}));case 3:u=e.sent,e.next=9;break;case 6:return e.next=8,g({data:JSON.stringify(n(n({},q.value),{},{db_ps:q.value.ps}))},c.value);case 8:u=e.sent;case 9:if(null!==(r=u)&&void 0!==r&&r.status){e.next=12;break}return E.$message.msg({customClass:"bt-message-error-html",dangerouslyUseHTMLString:!0,message:(null===(o=u)||void 0===o?void 0:o.msg)||"添加失败",type:"error",duration:0,showClose:!0}),e.abrupt("return",null);case 12:return e.abrupt("return",u);case 13:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),complete:function(){return i(t().mark((function e(){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a.compData.refreshEvent();case 1:case"end":return e.stop()}}),e)})))()}});case 12:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),T=function(){var e=i(t().mark((function e(){var r,o,a;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=null,e.prev=1,r=E.$load(P.value,"修改中..."),"mysql"!==c.value){e.next=10;break}return e.next=6,b(n(n({},q.value),{},{db_ps:q.value.ps}));case 6:return o=e.sent,e.abrupt("return",o);case 10:return e.next=12,w({data:JSON.stringify(n(n({},q.value),{},{db_ps:q.value.ps,type:c.value}))},c.value);case 12:return a=e.sent,e.abrupt("return",a);case 14:e.next=19;break;case 16:e.prev=16,e.t0=e.catch(1);case 19:return e.prev=19,r&&r.close(),e.finish(19);case 22:case"end":return e.stop()}}),e,null,[[1,16,19,22]])})));return function(){return e.apply(this,arguments)}}();return v((function(){var e;null!==(e=a.compData.formData)&&void 0!==e&&e.db_host&&(q.value=n({},a.compData.formData))})),h((function(){"redis"===c.value&&(N.value.shift(),N.value.pop())})),o({onConfirm:$}),{__sfc:!0,getServerList:s,tabActive:c,getModulesServeList:f,getRedisServer:S,props:a,vm:E,loading:k,cloudForm:F,formDisabled:P,placeholderData:D,serverForm:q,helpList:N,rules:C,getChange:function(e){q.value.ps=e},addServer:$,openNps:function(){},editServer:T}}});e("default",c(r,(function(){var e=this,t=e._self._c,r=e._self._setupProxy;return t("div",{staticClass:"p-24x"},[t(s,{ref:"cloudForm",attrs:{disabled:r.formDisabled,model:r.serverForm,rules:r.rules},nativeOn:{submit:function(e){e.preventDefault()}}},[t(u,{attrs:{label:"服务器地址",prop:"db_host"}},[t(a,{directives:[{name:"focus",rawName:"v-focus"}],attrs:{placeholder:"请输入服务器地址"},on:{input:r.getChange},model:{value:r.serverForm.db_host,callback:function(t){e.$set(r.serverForm,"db_host",t)},expression:"serverForm.db_host"}})],1),t(u,{attrs:{label:"数据库端口",prop:"db_port"}},[t(a,{attrs:{type:"number"},model:{value:r.serverForm.db_port,callback:function(t){e.$set(r.serverForm,"db_port",t)},expression:"serverForm.db_port"}})],1),"redis"!=r.tabActive?t(u,{attrs:{label:"管理员名称",prop:"db_user"}},[t(a,{attrs:{placeholder:"请输入管理员名称"},model:{value:r.serverForm.db_user,callback:function(t){e.$set(r.serverForm,"db_user",t)},expression:"serverForm.db_user"}})],1):e._e(),t(u,{attrs:{label:"管理员密码",prop:"db_password"}},[t(a,{attrs:{placeholder:"请输入管理员密码"},model:{value:r.serverForm.db_password,callback:function(t){e.$set(r.serverForm,"db_password",t)},expression:"serverForm.db_password"}})],1),t(u,{attrs:{label:"备注"}},[t(a,{attrs:{placeholder:"服务器备注"},model:{value:r.serverForm.ps,callback:function(t){e.$set(r.serverForm,"ps",t)},expression:"serverForm.ps"}})],1)],1),t(o,{staticClass:"ml-20x mt-12x",attrs:{list:r.helpList,"list-style":"disc"}})],1)}),[],!1,null,null,null,null).exports)}}}))}();