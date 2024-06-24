!function(){function t(r){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(r)}function r(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */r=function(){return n};var e,n={},o=Object.prototype,i=o.hasOwnProperty,a=Object.defineProperty||function(t,r,e){t[r]=e.value},s="function"==typeof Symbol?Symbol:{},c=s.iterator||"@@iterator",l=s.asyncIterator||"@@asyncIterator",u=s.toStringTag||"@@toStringTag";function f(t,r,e){return Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}),t[r]}try{f({},"")}catch(e){f=function(t,r,e){return t[r]=e}}function p(t,r,e,n){var o=r&&r.prototype instanceof b?r:b,i=Object.create(o.prototype),s=new N(n||[]);return a(i,"_invoke",{value:S(t,e,s)}),i}function h(t,r,e){try{return{type:"normal",arg:t.call(r,e)}}catch(t){return{type:"throw",arg:t}}}n.wrap=p;var m="suspendedStart",y="suspendedYield",g="executing",v="completed",d={};function b(){}function w(){}function _(){}var x={};f(x,c,(function(){return this}));var j=Object.getPrototypeOf,O=j&&j(j(C([])));O&&O!==o&&i.call(O,c)&&(x=O);var E=_.prototype=b.prototype=Object.create(x);function L(t){["next","throw","return"].forEach((function(r){f(t,r,(function(t){return this._invoke(r,t)}))}))}function F(r,e){function n(o,a,s,c){var l=h(r[o],r,a);if("throw"!==l.type){var u=l.arg,f=u.value;return f&&"object"==t(f)&&i.call(f,"__await")?e.resolve(f.__await).then((function(t){n("next",t,s,c)}),(function(t){n("throw",t,s,c)})):e.resolve(f).then((function(t){u.value=t,s(u)}),(function(t){return n("throw",t,s,c)}))}c(l.arg)}var o;a(this,"_invoke",{value:function(t,r){function i(){return new e((function(e,o){n(t,r,e,o)}))}return o=o?o.then(i,i):i()}})}function S(t,r,n){var o=m;return function(i,a){if(o===g)throw new Error("Generator is already running");if(o===v){if("throw"===i)throw a;return{value:e,done:!0}}for(n.method=i,n.arg=a;;){var s=n.delegate;if(s){var c=P(s,n);if(c){if(c===d)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===m)throw o=v,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=g;var l=h(t,r,n);if("normal"===l.type){if(o=n.done?v:y,l.arg===d)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(o=v,n.method="throw",n.arg=l.arg)}}}function P(t,r){var n=r.method,o=t.iterator[n];if(o===e)return r.delegate=null,"throw"===n&&t.iterator.return&&(r.method="return",r.arg=e,P(t,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),d;var i=h(o,t.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,d;var a=i.arg;return a?a.done?(r[t.resultName]=a.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,d):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,d)}function k(t){var r={tryLoc:t[0]};1 in t&&(r.catchLoc=t[1]),2 in t&&(r.finallyLoc=t[2],r.afterLoc=t[3]),this.tryEntries.push(r)}function D(t){var r=t.completion||{};r.type="normal",delete r.arg,t.completion=r}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(k,this),this.reset(!0)}function C(r){if(r||""===r){var n=r[c];if(n)return n.call(r);if("function"==typeof r.next)return r;if(!isNaN(r.length)){var o=-1,a=function t(){for(;++o<r.length;)if(i.call(r,o))return t.value=r[o],t.done=!1,t;return t.value=e,t.done=!0,t};return a.next=a}}throw new TypeError(t(r)+" is not iterable")}return w.prototype=_,a(E,"constructor",{value:_,configurable:!0}),a(_,"constructor",{value:w,configurable:!0}),w.displayName=f(_,u,"GeneratorFunction"),n.isGeneratorFunction=function(t){var r="function"==typeof t&&t.constructor;return!!r&&(r===w||"GeneratorFunction"===(r.displayName||r.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,_):(t.__proto__=_,f(t,u,"GeneratorFunction")),t.prototype=Object.create(E),t},n.awrap=function(t){return{__await:t}},L(F.prototype),f(F.prototype,l,(function(){return this})),n.AsyncIterator=F,n.async=function(t,r,e,o,i){void 0===i&&(i=Promise);var a=new F(p(t,r,e,o),i);return n.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},L(E),f(E,u,"Generator"),f(E,c,(function(){return this})),f(E,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var r=Object(t),e=[];for(var n in r)e.push(n);return e.reverse(),function t(){for(;e.length;){var n=e.pop();if(n in r)return t.value=n,t.done=!1,t}return t.done=!0,t}},n.values=C,N.prototype={constructor:N,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(D),!t)for(var r in this)"t"===r.charAt(0)&&i.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function n(n,o){return s.type="throw",s.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],s=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var c=i.call(a,"catchLoc"),l=i.call(a,"finallyLoc");if(c&&l){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return n(a.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc)}}}},abrupt:function(t,r){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc<=this.prev&&i.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=r&&r<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=r,o?(this.method="next",this.next=o.finallyLoc,d):this.complete(a)},complete:function(t,r){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&r&&(this.next=r),d},finish:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.finallyLoc===t)return this.complete(e.completion,e.afterLoc),D(e),d}},catch:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.tryLoc===t){var n=e.completion;if("throw"===n.type){var o=n.arg;D(e)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:C(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),d}},n}function e(t,r){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable}))),e.push.apply(e,n)}return e}function n(t){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?e(Object(n),!0).forEach((function(r){o(t,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):e(Object(n)).forEach((function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))}))}return t}function o(r,e,n){var o;return o=function(r,e){if("object"!=t(r)||!r)return r;var n=r[Symbol.toPrimitive];if(void 0!==n){var o=n.call(r,e||"default");if("object"!=t(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(r)}(e,"string"),(e="symbol"==t(o)?o:String(o))in r?Object.defineProperty(r,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):r[e]=n,r}function i(t,r,e,n,o,i,a){try{var s=t[i](a),c=s.value}catch(l){return void e(l)}s.done?r(c):Promise.resolve(c).then(n,o)}function a(t){return function(){var r=this,e=arguments;return new Promise((function(n,o){var a=t.apply(r,e);function s(t){i(a,n,o,s,c,"next",t)}function c(t){i(a,n,o,s,c,"throw",t)}s(void 0)}))}}System.register(["./index-legacy118.js?v=1714377894636","./index-legacy85.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./index-legacy120.js?v=1714377894636","./select-legacy.js?v=1714377894636","./form-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./confirm-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./crontab.api-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./config-legacy.js?v=1714377894636"],(function(t,e){"use strict";var o,i,s,c,l,u,f,p,h,m,y,g,v,d,b,w;return{setters:[function(t){o=t._},function(t){i=t._},function(t){s=t.w,c=t.x,l=t.q,u=t.s},function(t){f=t.n},null,function(t){p=t._},null,null,function(t){h=t.e,m=t.b,y=t.v,g=t.w,v=t.j},function(t){d=t.o},null,function(t){b=t.F,w=t.G},null,null,null,null,null,null],execute:function(){var e=h({__name:"ScriptForm",props:{compData:{default:{}}},setup:function(t,e){var o=e.expose,i=t,s=v().proxy,c=m(!1),l=m(),u=y({args_title:"",args_ps:""}),f=y({name:"",return_type:"string",is_args:"0",ps:"",script:"",type_id:i.compData.type_id}),p=m([{text:"当前仅支持Python和Shell脚本"},{text:"请根据返回类型在脚本执行结束时输出符合预期的值"},{text:"如果选择需要脚本参数，试用当前脚本时需传递一个参数，在脚本中的第一个参数中接收"}]),h=m(),_=m({mode:"ace/mode/nginx",theme:"ace/theme/chrome",wrap:!0,showInvisibles:!1,showFoldWidgets:!1,useSoftTabs:!0,tabSize:2,showPrintMargin:!1,readOnly:!1,fontSize:"12px"}),x=function(){var t=a(r().mark((function t(e){var o;return r().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:o=n({},f),"1"==f.is_args&&(o=n(n({},f),u)),d({$refs:l.value,loading:c,request:function(){var t=a(r().mark((function t(){return r().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!i.compData.rowData){t.next=5;break}return o.script_id=i.compData.rowData.script_id,t.next=4,b({data:JSON.stringify(o)});case 4:case 7:return t.abrupt("return",t.sent);case 5:return t.next=7,w({data:JSON.stringify(o)});case 8:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),complete:function(){return a(r().mark((function t(){return r().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:i.compData.refreshEvent();case 1:case"end":return t.stop()}}),t)})))()}});case 3:case"end":return t.stop()}}),t)})));return function(r){return t.apply(this,arguments)}}();return g((function(){if(i.compData.rowData){var t=i.compData.rowData,r=t.name,e=t.return_type,n=t.is_args,o=t.ps,a=t.script,s=t.type_id,c=t.args_title,l=t.args_ps;Object.assign(f,{name:r,return_type:e,is_args:String(n),ps:o,script:a,type_id:s}),"1"==n&&Object.assign(u,{args_title:c,args_ps:l})}})),o({onConfirm:x}),{__sfc:!0,props:i,vm:s,formDisabled:c,scriptFormRef:l,args_form:u,scriptForm:f,helpList:p,scriptAceEditor:h,config:_,onConfirm:x}}});t("default",f(e,(function(){var t=this,r=t._self._c,e=t._self._setupProxy;return r("div",{staticClass:"p-20x"},[r(s,{ref:"scriptFormRef",attrs:{disabled:e.formDisabled,model:e.scriptForm,"label-width":"80px"}},[r(c,{attrs:{label:"名称"}},[r(i,{attrs:{placeholder:"请输入脚本名称",width:"36rem"},model:{value:e.scriptForm.name,callback:function(r){t.$set(e.scriptForm,"name",r)},expression:"scriptForm.name"}})],1),r(c,{attrs:{label:"返回类型"}},[r(l,{model:{value:e.scriptForm.return_type,callback:function(r){t.$set(e.scriptForm,"return_type",r)},expression:"scriptForm.return_type"}},[r(u,{attrs:{label:"字符串",value:"string"}}),r(u,{attrs:{label:"整数",value:"int"}}),r(u,{attrs:{label:"浮点数",value:"float"}})],1)],1),r(c,{attrs:{label:"脚本参数"}},[r("div",{staticClass:"flex items-center"},[r(l,{staticClass:"w-[8.2rem]",model:{value:e.scriptForm.is_args,callback:function(r){t.$set(e.scriptForm,"is_args",r)},expression:"scriptForm.is_args"}},[r(u,{attrs:{label:"需要",value:"1"}}),r(u,{attrs:{label:"不需要",value:"0"}})],1),"1"==e.scriptForm.is_args?r("div",{staticClass:"flex items-center"},[r(i,{staticClass:"mx-8x",attrs:{width:"10rem",placeholder:"参数标题"},model:{value:e.args_form.args_title,callback:function(r){t.$set(e.args_form,"args_title",r)},expression:"args_form.args_title"}}),r(i,{attrs:{width:"16rem",placeholder:"参数说明"},model:{value:e.args_form.args_ps,callback:function(r){t.$set(e.args_form,"args_ps",r)},expression:"args_form.args_ps"}})],1):t._e()],1)]),r(c,{attrs:{label:"内容"}},[r("div",{staticClass:"h-[16rem]"},[r(p,{ref:"scriptAceEditor",staticClass:"!h-[16rem] !w-[36rem]",attrs:{id:"scriptEditor","is-zoom":!0,config:e.config},model:{value:e.scriptForm.script,callback:function(r){t.$set(e.scriptForm,"script",r)},expression:"scriptForm.script"}})],1)]),r(c,{attrs:{label:"备注"}},[r(i,{attrs:{placeholder:"备注",width:"36rem"},model:{value:e.scriptForm.ps,callback:function(r){t.$set(e.scriptForm,"ps",r)},expression:"scriptForm.ps"}})],1)],1),r(o,{staticClass:"ml-24x mt-20x",attrs:{list:e.helpList,"list-style":"disc"}})],1)}),[],!1,null,null,null,null).exports)}}}))}();