!function(){function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function r(e){for(var r=1;r<arguments.length;r++){var a=null!=arguments[r]?arguments[r]:{};r%2?t(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):t(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function n(t,r,n){var a;return a=function(t,r){if("object"!=e(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var a=n.call(t,r||"default");if("object"!=e(a))return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(r,"string"),(r="symbol"==e(a)?a:String(a))in t?Object.defineProperty(t,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[r]=n,t}function a(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */a=function(){return r};var t,r={},n=Object.prototype,o=n.hasOwnProperty,i=Object.defineProperty||function(e,t,r){e[t]=r.value},l="function"==typeof Symbol?Symbol:{},s=l.iterator||"@@iterator",c=l.asyncIterator||"@@asyncIterator",u=l.toStringTag||"@@toStringTag";function d(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{d({},"")}catch(t){d=function(e,t,r){return e[t]=r}}function f(e,t,r,n){var a=t&&t.prototype instanceof b?t:b,o=Object.create(a.prototype),l=new D(n||[]);return i(o,"_invoke",{value:P(e,r,l)}),o}function p(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}r.wrap=f;var m="suspendedStart",h="suspendedYield",v="executing",g="completed",y={};function b(){}function x(){}function w(){}var _={};d(_,s,(function(){return this}));var k=Object.getPrototypeOf,j=k&&k(k(S([])));j&&j!==n&&o.call(j,s)&&(_=j);var F=w.prototype=b.prototype=Object.create(_);function T(e){["next","throw","return"].forEach((function(t){d(e,t,(function(e){return this._invoke(t,e)}))}))}function O(t,r){function n(a,i,l,s){var c=p(t[a],t,i);if("throw"!==c.type){var u=c.arg,d=u.value;return d&&"object"==e(d)&&o.call(d,"__await")?r.resolve(d.__await).then((function(e){n("next",e,l,s)}),(function(e){n("throw",e,l,s)})):r.resolve(d).then((function(e){u.value=e,l(u)}),(function(e){return n("throw",e,l,s)}))}s(c.arg)}var a;i(this,"_invoke",{value:function(e,t){function o(){return new r((function(r,a){n(e,t,r,a)}))}return a=a?a.then(o,o):o()}})}function P(e,r,n){var a=m;return function(o,i){if(a===v)throw new Error("Generator is already running");if(a===g){if("throw"===o)throw i;return{value:t,done:!0}}for(n.method=o,n.arg=i;;){var l=n.delegate;if(l){var s=C(l,n);if(s){if(s===y)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(a===m)throw a=g,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);a=v;var c=p(e,r,n);if("normal"===c.type){if(a=n.done?g:h,c.arg===y)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(a=g,n.method="throw",n.arg=c.arg)}}}function C(e,r){var n=r.method,a=e.iterator[n];if(a===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,C(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),y;var o=p(a,e.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,y;var i=o.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,y):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,y)}function L(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function E(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function D(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(L,this),this.reset(!0)}function S(r){if(r||""===r){var n=r[s];if(n)return n.call(r);if("function"==typeof r.next)return r;if(!isNaN(r.length)){var a=-1,i=function e(){for(;++a<r.length;)if(o.call(r,a))return e.value=r[a],e.done=!1,e;return e.value=t,e.done=!0,e};return i.next=i}}throw new TypeError(e(r)+" is not iterable")}return x.prototype=w,i(F,"constructor",{value:w,configurable:!0}),i(w,"constructor",{value:x,configurable:!0}),x.displayName=d(w,u,"GeneratorFunction"),r.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===x||"GeneratorFunction"===(t.displayName||t.name))},r.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,w):(e.__proto__=w,d(e,u,"GeneratorFunction")),e.prototype=Object.create(F),e},r.awrap=function(e){return{__await:e}},T(O.prototype),d(O.prototype,c,(function(){return this})),r.AsyncIterator=O,r.async=function(e,t,n,a,o){void 0===o&&(o=Promise);var i=new O(f(e,t,n,a),o);return r.isGeneratorFunction(t)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},T(F),d(F,u,"Generator"),d(F,s,(function(){return this})),d(F,"toString",(function(){return"[object Generator]"})),r.keys=function(e){var t=Object(e),r=[];for(var n in t)r.push(n);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},r.values=S,D.prototype={constructor:D,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(E),!e)for(var r in this)"t"===r.charAt(0)&&o.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function n(n,a){return l.type="throw",l.arg=e,r.next=n,a&&(r.method="next",r.arg=t),!!a}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],l=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var s=o.call(i,"catchLoc"),c=o.call(i,"finallyLoc");if(s&&c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(s){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&o.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var a=n;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=e,i.arg=t,a?(this.method="next",this.next=a.finallyLoc,y):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),y},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),E(r),y}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var a=n.arg;E(r)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:S(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),y}},r}function o(e,t,r,n,a,o,i){try{var l=e[o](i),s=l.value}catch(c){return void r(c)}l.done?t(s):Promise.resolve(s).then(n,a)}function i(e){return function(){var t=this,r=arguments;return new Promise((function(n,a){var i=e.apply(t,r);function l(e){o(i,n,a,l,s,"next",e)}function s(e){o(i,n,a,l,s,"throw",e)}l(void 0)}))}}System.register(["./index-legacy39.js?v=1714377894636","./main-legacy.js?v=1714377894636","./index-legacy40.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./index-legacy85.js?v=1714377894636","./select-legacy.js?v=1714377894636","./radio-button-legacy.js?v=1714377894636","./radio-group-legacy.js?v=1714377894636","./form-legacy.js?v=1714377894636","./alert-legacy.js?v=1714377894636","./index-legacy52.js?v=1714377894636","./index-legacy55.js?v=1714377894636","./index-legacy59.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./index-legacy46.js?v=1714377894636","./confirm-legacy.js?v=1714377894636","./software-legacy2.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./index-legacy38.js?v=1714377894636","./site.store-legacy.js?v=1714377894636","./empty-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./checkbox-group-legacy.js?v=1714377894636","./config-legacy.js?v=1714377894636","./switch-legacy.js?v=1714377894636","./index.vue_vue_type_style_index_0_lang-legacy.js?v=1714377894636","./index-legacy45.js?v=1714377894636","./check-legacy.js?v=1714377894636"],(function(e,t){"use strict";var n,o,l,s,c,u,d,f,p,m,h,v,g,y,b,x,w,_,k,j,F,T,O,P,C,L,E,D,S,$,z,N,q,A,G,R,I,B,H,M;return{setters:[function(e){n=e._},function(e){o=e.c,l=e.f,s=e.J,c=e.n,u=e.q,d=e.b,f=e.F,p=e.a},function(e){m=e._},function(e){h=e.a9,v=e.w,g=e.x,y=e.q,b=e.s,x=e.y,w=e.ab},null,function(e){_=e._},null,null,null,null,null,function(e){k=e._},function(e){j=e._},function(e){F=e._},function(e){T=e.e,O=e.b,P=e.v,C=e.H,L=e.h,E=e.j},function(e){D=e._},function(e){S=e.a},function(e){$=e.o},null,function(e){z=e.e},function(e){N=e.df,q=e.cQ,A=e.dg,G=e.dh,R=e.di,I=e.dj,B=e.dk,H=e.dl,M=e.i},null,null,null,null,null,null,null,null,null,null,null,null],execute:function(){var t=T({__name:"DialingTestAlarm",props:{compData:{default:{}}},setup:function(e){var t=e,n=E().proxy,c=O([]),u=O(!1),d=O(null),f=O(!1),p=P({url:"",channel:[],name:"",cycle:10,method:"",alarm_count:5,address:"localhost",methodData:""}),m=P({p:1,limit:10,total:0}),h=O([]),v=O([]),g=O([{label:"ISP",prop:"isp"},{label:"解析IP",prop:"primary_ip"},{label:"状态",prop:"http_code"},{label:"总耗时",prop:"total_time",render:function(e){return x(1e3,500,e.total_time,"ms")}},{label:"解析耗时",prop:"namelookup_time",render:function(e){return x(500,100,e.namelookup_time,"ms")}},{label:"连接耗时",prop:"connect_time",render:function(e){return x(500,100,e.connect_time,"ms")}},{label:"处理耗时",prop:"starttransfer_time",render:function(e){return x(1e3,500,e.starttransfer_time,"ms")}},{label:"响应大小",prop:"size_download",render:function(e){return o(e.size_download)}},{label:"传输速度",prop:"speed_download",render:function(e){return o(e.speed_download)}},{label:"响应头",prop:"header",width:280,render:function(e){return C(_,{attrs:{type:"textarea",readOnly:!0,rows:6,value:e.header},class:"!w-full"})}}]),y=O([]),b=O(!1),x=function(e,t,r,n){var a="";return r>e?a="text-[#FF5722]":r>t&&(a="text-[#FFB800]"),C("span",{class:a},[r.toFixed(2)+n])},w=function(){var e=i(a().mark((function e(){var t,r;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,j();case 2:delete p.id,p.name="".concat(null===(t=v.value)||void 0===t||null===(t=t.find((function(e){return"status_code"===e.id})))||void 0===t?void 0:t.name," 【").concat(null===(r=h.value[0])||void 0===r?void 0:r.name,"】"),f.value=!0;case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),k=function(){var e=i(a().mark((function e(){var t,r;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u.value=!0,e.prev=1,e.next=4,N();case 4:r=e.sent,v.value=[],Object.keys(r.data).forEach((function(e){v.value.push({id:e,name:r.data[e]})})),v.value=null===(t=v.value)||void 0===t?void 0:t.filter((function(e){return"sensitive"!==e.id&&"similarity"!==e.id})),p.method="status_code",e.next=14;break;case 11:e.prev=11,e.t0=e.catch(1);case 14:u.value=!1;case 15:case"end":return e.stop()}}),e,null,[[1,11]])})));return function(){return e.apply(this,arguments)}}(),j=function(){var e=i(a().mark((function e(){var r,n,o;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u.value=!0,e.prev=1,e.next=4,q({table:"domain",list:"True",search:t.compData.id});case 4:o=e.sent,h.value=[],null===(r=o.data)||void 0===r||r.forEach((function(e){h.value.push({name:"http://"+e.name,id:e.id}),h.value.push({name:"https://"+e.name,id:e.id})})),p.url=null===(n=h.value[0])||void 0===n?void 0:n.name,e.next=13;break;case 10:e.prev=10,e.t0=e.catch(1);case 13:u.value=!1;case 14:case"end":return e.stop()}}),e,null,[[1,10]])})));return function(){return e.apply(this,arguments)}}(),F=function(){var e=i(a().mark((function e(){var r;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u.value=!0,e.prev=1,e.next=4,A({sid:t.compData.id,p:m.p,row:m.limit});case 4:r=e.sent,c.value=r.data.data,m.total=s(r.data.page.page),m.limit=Number(r.data.row),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(1);case 13:u.value=!1;case 14:case"end":return e.stop()}}),e,null,[[1,10]])})));return function(){return e.apply(this,arguments)}}(),T=function(){var e=i(a().mark((function e(){return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(p.channel.length){e.next=2;break}return e.abrupt("return",n.$message.error("请选择告警方式"));case 2:if("delay"!==p.method&&"keyword"!==p.method||""!==p.methodData){e.next=4;break}return e.abrupt("return",n.$message.error("请输入告警条件"));case 4:n.$refs.boceFormRef.validate(function(){var e=i(a().mark((function e(t){var o,i,l;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t){e.next=2;break}return e.abrupt("return");case 2:if(o=n.$load("正在提交,请稍候..."),e.prev=3,i=r(r({},p),{},{channel:p.channel.join(",")}),"delay"===p.method&&(i.delay=p.methodData),"keyword"===p.method&&(i.keyword=p.methodData),"size"===p.method&&(i.size=1),"status_code"===p.method&&(i.status_code=1),delete i.methodData,!p.id){e.next=16;break}return e.next=13,G(i);case 13:l=e.sent,e.next=19;break;case 16:return e.next=18,R(i);case 18:l=e.sent;case 19:l.status?n.$message.success(l.msg):n.$message.error({msg:l.msg,time:5e3}),F(),K(),e.next=27;break;case 24:e.prev=24,e.t0=e.catch(3);case 27:return e.prev=27,o.close(),e.finish(27);case 30:case"end":return e.stop()}}),e,null,[[3,24,27,30]])})));return function(t){return e.apply(this,arguments)}}());case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),V=function(){var e=i(a().mark((function e(t){var r,o;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.$load("正在执行,请稍候..."),e.prev=1,e.next=4,I({id:t.id});case 4:(o=e.sent).status?(b.value=!0,y.value=o.data,F()):n.$message.request(o),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(1);case 11:return e.prev=11,r.close(),e.finish(11);case 14:case"end":return e.stop()}}),e,null,[[1,8,11,14]])})));return function(t){return e.apply(this,arguments)}}(),Y=function(){var e=i(a().mark((function e(t){var r,o;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.$load("正在删除,请稍候..."),e.prev=1,e.next=4,B({id:t.id,action:"del"});case 4:return o=e.sent,n.$message.request(o),e.next=8,F();case 8:e.next=13;break;case 10:e.prev=10,e.t0=e.catch(1);case 13:return e.prev=13,r.close(),e.finish(13);case 16:case"end":return e.stop()}}),e,null,[[1,10,13,16]])})));return function(t){return e.apply(this,arguments)}}(),J=function(){var e=i(a().mark((function e(t){var r;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.$load("正在获取日志,请稍候..."),e.prev=1,e.next=4,H({id:t.id,p:1});case 4:e.sent.data.length||n.$message.success("暂无日志"),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(1);case 11:return e.prev=11,r.close(),e.finish(11);case 14:case"end":return e.stop()}}),e,null,[[1,8,11,14]])})));return function(t){return e.apply(this,arguments)}}(),Q=function(){var e=i(a().mark((function e(t){return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(p.address="localhost","node"!==t){e.next=7;break}return e.next=5,U();case 5:e.sent&&(p.address="node");case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),U=function(){var e=i(a().mark((function e(){var t,r;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,M({sName:"bt_boce"});case 3:if(t=e.sent,!(r=t.data).status){e.next=7;break}return e.abrupt("return",!0);case 7:return e.next=9,$({name:"bt_boce",softData:r});case 9:return e.abrupt("return",!1);case 12:e.prev=12,e.t0=e.catch(0);case 15:case"end":return e.stop()}}),e,null,[[0,12]])})));return function(){return e.apply(this,arguments)}}(),K=function(){f.value=!1,n.$refs.boceFormRef.resetFields(),n.$refs.boceFormRef.clearValidate()},W=function(){var e=i(a().mark((function e(t){return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:S({confirm:{icon:"warning",title:t.status?"停用拨测告警":"启用拨测告警",width:"40rem",iconColor:"#E6A23C",message:t.status?"停用后,检测到问题时将不会发送告警通知，是否继续？":"启用后,检测到问题时将会发送告警通知，是否继续？"},loading:"正在设置，请稍后...",request:function(){var e=i(a().mark((function e(){return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,G({id:t.id,status:t.status?0:1});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),complete:F});case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),X=O([{label:"任务名称",prop:"name"},{label:"监控频率",render:function(e){return"".concat(e.cycle,"分钟")}},{label:"触发条件",prop:"trigger_condition"},{label:"最后执行时间",width:136,render:function(e){return l(e.last_run_time)||"--"}},{label:"状态\t",prop:"method",width:40,render:function(e){return C(D,{attrs:{value:!!e.status,size:"mini"},on:{change:function(){return W(e)}}})}},z([{onClick:V,title:"执行"},{onClick:function(e){var t;f.value=!0,p.id=e.id,p.name=e.name,p.url=e.url,p.cycle=e.cycle,p.method=e.status_code?"status_code":e.size?"size":e.delay?"delay":"keyword",p.methodData=e.delay||e.size||e.keyword||e.status_code,p.channel=null===(t=e.channel)||void 0===t?void 0:t.split(",")},title:"编辑"},{onClick:J,title:"日志"},{onClick:Y,title:"删除"}])]);return L((function(){F(),k()})),{__sfc:!0,vm:n,props:t,tableData:c,tableLoading:u,pushCheckBoxRef:d,dialingTestPopup:f,dialingTestForm:p,tableParams:m,domainOptions:h,typeOptions:v,resultColumn:g,resultData:y,resultPopup:b,rules:{name:[{required:!0,message:"请输入任务名称",trigger:"blur"}],cycle:[{required:!0,message:"请输入监控频率",trigger:"blur"}],alarm_count:[{required:!0,message:"请输入告警次数",trigger:"blur"}],channel:[{required:!0,message:"请选择告警方式",trigger:"blur"}],methodData:[{required:!0,message:"请输入告警条件",trigger:["blur","change"]}]},set_time_limit:x,addAlert:w,getAlarmOption:k,getDomain:j,getAlarmListEvent:F,onConfirm:T,startTaskEvent:V,deleteDataEvent:Y,getLogs:J,handleChangeMethod:Q,handleChangeType:function(e){n.$nextTick((function(){var t;n.$refs.boceFormRef.clearValidate("methodData"),p.methodData="status_code"===e||"size"===e?"1":"",p.name="".concat(null===(t=v.value)||void 0===t||null===(t=t.find((function(t){return t.id===e})))||void 0===t?void 0:t.name," 【").concat(p.url,"】")}))},getPluginState:U,cancelForm:K,handleChangeStatus:W,changePage:function(e){m.p=e,F()},changeSize:function(e){m.limit=e,F()},handleChangeName:function(e){var t;p.name="".concat(null===(t=v.value[0])||void 0===t?void 0:t.name," 【").concat(e,"】")},refreshPushForm:function(){d.value.renderPushConfig()},tableColumns:X}}});e("default",c(t,(function(){var e=this,t=e._self._c,r=e._self._setupProxy;return t("div",[t(F,{scopedSlots:e._u([{key:"header-left",fn:function(){return[t(u,{on:{click:r.addAlert}},[e._v("添加拨测告警")])]},proxy:!0},{key:"header-right",fn:function(){return[t(j,{attrs:{refresh:r.getAlarmListEvent}})]},proxy:!0},{key:"content",fn:function(){return[t(n,{directives:[{name:"loading",rawName:"v-loading",value:r.tableLoading,expression:"tableLoading"}],attrs:{column:r.tableColumns,data:r.tableData}})]},proxy:!0},{key:"footer-left",fn:function(){},proxy:!0},{key:"footer-right",fn:function(){return[t(k,{attrs:{total:r.tableParams.total,"current-page":r.tableParams.p,"page-size":r.tableParams.limit},on:{"current-change":r.changePage,"size-change":r.changeSize}})]},proxy:!0},{key:"popup",fn:function(){return[t(d,{attrs:{title:"拨测告警",visible:r.dialingTestPopup,area:54,showFooter:""},on:{"update:visible":function(e){r.dialingTestPopup=e},cancel:r.cancelForm,confirm:r.onConfirm}},[t("div",{staticClass:"p-20x"},[t(h,{attrs:{type:"success",closable:!1},scopedSlots:e._u([{key:"title",fn:function(){return[t("div",{staticClass:"text-[#666] text-[1.2rem] py-8x"},[t("div",{staticClass:"mb-8x"},[t("b",[e._v("本地测试")]),e._v("：本机发送请求，可能导致测试结果不准确等结果 ")]),t("div",[t("b",[e._v("多节点测试")]),e._v("（推荐）：通过宝塔部署在全国的多个节点上来实现更全面的覆盖和测试 ")])])]},proxy:!0}])}),t(v,{ref:"boceFormRef",staticClass:"mt-16x",attrs:{"label-position":"right",model:r.dialingTestForm,rules:r.rules}},[t(g,{attrs:{label:"监控网站URL",prop:"url"}},[t(y,{staticClass:"w-[32rem]",on:{change:r.handleChangeName},model:{value:r.dialingTestForm.url,callback:function(t){e.$set(r.dialingTestForm,"url",t)},expression:"dialingTestForm.url"}},e._l(r.domainOptions,(function(e,r){return t(b,{key:r,attrs:{label:e.name,value:e.name}})})),1)],1),t(g,{attrs:{label:"任务名称",prop:"name"}},[t(_,{attrs:{width:"32rem"},model:{value:r.dialingTestForm.name,callback:function(t){e.$set(r.dialingTestForm,"name",t)},expression:"dialingTestForm.name"}})],1),t(g,{attrs:{label:"检测节点",prop:"address"}},[t(x,{attrs:{size:"small"},on:{change:r.handleChangeMethod},model:{value:r.dialingTestForm.address,callback:function(t){e.$set(r.dialingTestForm,"address",t)},expression:"dialingTestForm.address"}},[t(w,{attrs:{label:"localhost",disabled:!!r.dialingTestForm.id}},[e._v("本地测试")]),t(w,{attrs:{label:"node",disabled:!!r.dialingTestForm.id}},[t("div",{staticClass:"flex items-center justify-center h-[3.2rem]"},[t(f,{staticClass:"mr-4x mt-2x",attrs:{name:"icon-ltd",size:"1.8"}}),e._v(" 多节点测试 ")],1)])],1)],1),t(g,{attrs:{label:"监控频率",prop:"cycle"}},[t(_,{attrs:{"text-type":"分钟",type:"number",min:10},model:{value:r.dialingTestForm.cycle,callback:function(t){e.$set(r.dialingTestForm,"cycle",t)},expression:"dialingTestForm.cycle"}})],1),t(g,{attrs:{label:"告警类型",prop:"method"}},[t(y,{staticClass:"w-[32rem]",attrs:{disabled:!!r.dialingTestForm.id},on:{change:r.handleChangeType},model:{value:r.dialingTestForm.method,callback:function(t){e.$set(r.dialingTestForm,"method",t)},expression:"dialingTestForm.method"}},e._l(r.typeOptions,(function(e,r){return t(b,{key:r,attrs:{label:e.name,value:e.id}})})),1)],1),"delay"===r.dialingTestForm.method||"keyword"===r.dialingTestForm.method?t(g,{attrs:{label:" ",prop:"methodData"}},[t("div",{staticClass:"flex items-center"},[t("span",{staticClass:"inline-block text-[#666] text-[1.2rem] mr-4x"},[e._v(" "+e._s("delay"===r.dialingTestForm.method?"平均响应延迟大于":"当响应内容不包含")+" ")]),t(_,{attrs:{disabled:!!r.dialingTestForm.id,width:"18rem",placeholder:"请输入关键词,分割",remarks:"delay"===r.dialingTestForm.method?"ms":"内容,触发告警"},model:{value:r.dialingTestForm.methodData,callback:function(t){e.$set(r.dialingTestForm,"methodData",t)},expression:"dialingTestForm.methodData"}})],1)]):e._e(),"size"===r.dialingTestForm.method||"status_code"===r.dialingTestForm.method?t(g,{attrs:{label:" "}},["size"===r.dialingTestForm.method?t("span",{staticClass:"inline-block text-[#666] text-[1.2rem] mr-4x"},[e._v("网站大小变化告警 当网站响应内容大小发生变化达到20%时，将触发告警")]):e._e(),"status_code"===r.dialingTestForm.method?t("span",{staticClass:"inline-block text-[#666] text-[1.2rem] mr-4x"},[e._v("当网站响应状态不为正常状态(200、300、302)，将触发告警")]):e._e()]):e._e(),t(g,{attrs:{label:"告警次数",prop:"alarm_count"}},[t("div",{staticClass:"flex items-center"},[t("span",{staticClass:"inline-block text-[#666] text-[1.2rem] mr-4x"},[e._v("每日最多触发")]),t(_,{attrs:{remarks:"次告警",width:"12rem",type:"number",min:1},model:{value:r.dialingTestForm.alarm_count,callback:function(t){e.$set(r.dialingTestForm,"alarm_count",t)},expression:"dialingTestForm.alarm_count"}})],1)]),t(g,{attrs:{label:"告警方式",prop:"channel"}},[t(m,{ref:"pushCheckBoxRef",model:{value:r.dialingTestForm.channel,callback:function(t){e.$set(r.dialingTestForm,"channel",t)},expression:"dialingTestForm.channel"}})],1)],1),t("ul",{staticClass:"mt-20x list-disc ml-20x"},[t("li",[e._v(" 点击配置后状态未更新，尝试点击【 "),t(p,{on:{click:r.refreshPushForm}},[e._v("手动刷新")]),e._v(" 】 ")],1)])],1)]),t(d,{attrs:{title:"查看扫描拨测结果-"+e.compData.name,visible:r.resultPopup,area:120},on:{"update:visible":function(e){r.resultPopup=e}}},[t("div",{staticClass:"p-20x"},[t(n,{attrs:{column:r.resultColumn,data:r.resultData}})],1)])]},proxy:!0}])})],1)}),[],!1,null,"ba64df28",null,null).exports)}}}))}();