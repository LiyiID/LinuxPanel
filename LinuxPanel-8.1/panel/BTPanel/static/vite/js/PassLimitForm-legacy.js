!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return n};var r,n={},o=Object.prototype,a=o.hasOwnProperty,i=Object.defineProperty||function(t,e,r){t[e]=r.value},s="function"==typeof Symbol?Symbol:{},c=s.iterator||"@@iterator",u=s.asyncIterator||"@@asyncIterator",l=s.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(r){f=function(t,e,r){return t[e]=r}}function p(t,e,r,n){var o=e&&e.prototype instanceof b?e:b,a=Object.create(o.prototype),s=new N(n||[]);return i(a,"_invoke",{value:k(t,r,s)}),a}function m(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}n.wrap=p;var h="suspendedStart",y="suspendedYield",d="executing",v="completed",g={};function b(){}function w(){}function x(){}var j={};f(j,c,(function(){return this}));var _=Object.getPrototypeOf,O=_&&_(_(G([])));O&&O!==o&&a.call(O,c)&&(j=O);var L=x.prototype=b.prototype=Object.create(j);function E(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function P(e,r){function n(o,i,s,c){var u=m(e[o],e,i);if("throw"!==u.type){var l=u.arg,f=l.value;return f&&"object"==t(f)&&a.call(f,"__await")?r.resolve(f.__await).then((function(t){n("next",t,s,c)}),(function(t){n("throw",t,s,c)})):r.resolve(f).then((function(t){l.value=t,s(l)}),(function(t){return n("throw",t,s,c)}))}c(u.arg)}var o;i(this,"_invoke",{value:function(t,e){function a(){return new r((function(r,o){n(t,e,r,o)}))}return o=o?o.then(a,a):a()}})}function k(t,e,n){var o=h;return function(a,i){if(o===d)throw new Error("Generator is already running");if(o===v){if("throw"===a)throw i;return{value:r,done:!0}}for(n.method=a,n.arg=i;;){var s=n.delegate;if(s){var c=F(s,n);if(c){if(c===g)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===h)throw o=v,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var u=m(t,e,n);if("normal"===u.type){if(o=n.done?v:y,u.arg===g)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(o=v,n.method="throw",n.arg=u.arg)}}}function F(t,e){var n=e.method,o=t.iterator[n];if(o===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=r,F(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=m(o,t.iterator,e.arg);if("throw"===a.type)return e.method="throw",e.arg=a.arg,e.delegate=null,g;var i=a.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,g):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,g)}function D(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function S(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(D,this),this.reset(!0)}function G(e){if(e||""===e){var n=e[c];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function t(){for(;++o<e.length;)if(a.call(e,o))return t.value=e[o],t.done=!1,t;return t.value=r,t.done=!0,t};return i.next=i}}throw new TypeError(t(e)+" is not iterable")}return w.prototype=x,i(L,"constructor",{value:x,configurable:!0}),i(x,"constructor",{value:w,configurable:!0}),w.displayName=f(x,l,"GeneratorFunction"),n.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,l,"GeneratorFunction")),t.prototype=Object.create(L),t},n.awrap=function(t){return{__await:t}},E(P.prototype),f(P.prototype,u,(function(){return this})),n.AsyncIterator=P,n.async=function(t,e,r,o,a){void 0===a&&(a=Promise);var i=new P(p(t,e,r,o),a);return n.isGeneratorFunction(e)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},E(L),f(L,l,"Generator"),f(L,c,(function(){return this})),f(L,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},n.values=G,N.prototype={constructor:N,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(S),!t)for(var e in this)"t"===e.charAt(0)&&a.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,o){return s.type="throw",s.arg=t,e.next=n,o&&(e.method="next",e.arg=r),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],s=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var c=a.call(i,"catchLoc"),u=a.call(i,"finallyLoc");if(c&&u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&a.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=t,i.arg=e,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),S(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;S(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:G(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),g}},n}function r(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function n(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?r(Object(n),!0).forEach((function(e){o(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function o(e,r,n){var o;return o=function(e,r){if("object"!=t(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var o=n.call(e,r||"default");if("object"!=t(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(e)}(r,"string"),(r="symbol"==t(o)?o:String(o))in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function a(t,e,r,n,o,a,i){try{var s=t[a](i),c=s.value}catch(u){return void r(u)}s.done?e(c):Promise.resolve(c).then(n,o)}function i(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function s(t){a(i,n,o,s,c,"next",t)}function c(t){a(i,n,o,s,c,"throw",t)}s(void 0)}))}}System.register(["./index-legacy85.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./form-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./site.store-legacy.js?v=1714377894636","./confirm-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636","./config-legacy.js?v=1714377894636"],(function(t,r){"use strict";var o,a,s,c,u,l,f,p,m,h,y,d;return{setters:[function(t){o=t._},function(t){a=t.w,s=t.x},function(t){c=t.n},null,null,function(t){u=t.e,l=t.v,f=t.b,p=t.j},function(t){m=t.ej,h=t.ek},function(t){y=t.o,d=t.a},null,null,null,null,null,null,null,null],execute:function(){var r=u({__name:"PassLimitForm",props:{compData:{default:function(){return{}}}},setup:function(t,r){var o=r.expose,a=t,s=p().proxy,c=l({site_dir:a.compData.site_dir||"",name:a.compData.name||"",username:a.compData.username||"",password:a.compData.password||""}),u=f(!1),v=f(),g=l({site_dir:[{required:!0,message:"请输入需要加密访问的目录",trigger:"blur"}],name:[{required:!0,message:"请输入名称",trigger:"blur"},{min:3,message:"名称必须大于三位",trigger:"blur"}],username:[{required:!0,message:"请输入用户名",trigger:"blur"},{min:3,message:"用户名必须大于三位",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{min:3,message:"密码必须大于三位",trigger:"blur"}]}),b=function(){var t=i(e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:y({$refs:v.value,loading:{disable:u,text:"提交中，请稍候..."},request:function(){var t=i(e().mark((function t(){var r,o;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!a.compData.name){t.next=4;break}return t.next=3,m(n({id:a.compData.id},c));case 3:return t.abrupt("return",t.sent);case 4:return t.next=6,h(n({id:a.compData.id},c));case 6:if(r=t.sent,void 0===(o=r.data).tip){t.next=11;break}return d({confirm:{title:"添加须知",message:o.tip,icon:"warning"},loading:"正在添加，请稍后...",request:function(){var t=i(e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,h(n(n({id:a.compData.id},c),{},{force:!0}));case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),complete:function(){return i(e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:s.$emit("close"),a.compData.refresh();case 2:case"end":return t.stop()}}),t)})))()}}),t.abrupt("return",null);case 11:return t.abrupt("return",o);case 12:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),complete:function(){return i(e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:a.compData.refresh();case 1:case"end":return t.stop()}}),t)})))()}});case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return o({onConfirm:b}),{__sfc:!0,vm:s,props:a,passForm:c,formDisabled:u,passwordSiteForm:v,passRules:g,savePassConfig:b}}});t("default",c(r,(function(){var t=this,e=t._self._c,r=t._self._setupProxy;return e("div",{staticClass:"p-20x"},[e(a,{ref:"passwordSiteForm",attrs:{rules:r.passRules,model:r.passForm,disabled:r.formDisabled}},[e(s,{attrs:{label:"加密访问",prop:"site_dir"}},[e(o,{attrs:{disabled:t.compData.name,placeholder:"输入需要加密访问的目录，如：/text/"},model:{value:r.passForm.site_dir,callback:function(e){t.$set(r.passForm,"site_dir",e)},expression:"passForm.site_dir"}})],1),e(s,{attrs:{label:"名称",prop:"name"}},[e(o,{attrs:{disabled:t.compData.name},model:{value:r.passForm.name,callback:function(e){t.$set(r.passForm,"name",e)},expression:"passForm.name"}})],1),e(s,{attrs:{label:"用户名",prop:"username"}},[e(o,{attrs:{placeholder:"请输入大于三位的用户名"},model:{value:r.passForm.username,callback:function(e){t.$set(r.passForm,"username",e)},expression:"passForm.username"}})],1),e(s,{attrs:{label:"密码",prop:"password"}},[e(o,{attrs:{type:"password",placeholder:"请输入大于三位的密码"},model:{value:r.passForm.password,callback:function(e){t.$set(r.passForm,"password",e)},expression:"passForm.password"}})],1),e("ul",{staticClass:"ml-6 mt-8 list-disc leading-10"},[e("li",{staticClass:"text-medium"},[t._v("目录设置加密访问后，会导致目录及子目录下的“反向代理”失效")]),e("li",{staticClass:"text-medium"},[t._v("目录设置加密访问后，访问时需要输入账号密码才能访问")]),e("li",{staticClass:"text-medium"},[t._v(" 例如我设置了加密访问 /test/ ,那我访问 http://aaa.com/test/ 时就要输入账号密码才能访问 ")])])],1)],1)}),[],!1,null,"17dea6ae",null,null).exports)}}}))}();
