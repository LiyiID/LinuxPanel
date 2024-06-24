!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return r};var n,r={},o=Object.prototype,i=o.hasOwnProperty,a=Object.defineProperty||function(t,e,n){t[e]=n.value},c="function"==typeof Symbol?Symbol:{},u=c.iterator||"@@iterator",l=c.asyncIterator||"@@asyncIterator",s=c.toStringTag||"@@toStringTag";function f(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(n){f=function(t,e,n){return t[e]=n}}function d(t,e,n,r){var o=e&&e.prototype instanceof w?e:w,i=Object.create(o.prototype),c=new C(r||[]);return a(i,"_invoke",{value:S(t,n,c)}),i}function h(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}r.wrap=d;var v="suspendedStart",p="suspendedYield",y="executing",m="completed",g={};function w(){}function b(){}function x(){}var _={};f(_,u,(function(){return this}));var O=Object.getPrototypeOf,j=O&&O(O(D([])));j&&j!==o&&i.call(j,u)&&(_=j);var L=x.prototype=w.prototype=Object.create(_);function k(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function E(e,n){function r(o,a,c,u){var l=h(e[o],e,a);if("throw"!==l.type){var s=l.arg,f=s.value;return f&&"object"==t(f)&&i.call(f,"__await")?n.resolve(f.__await).then((function(t){r("next",t,c,u)}),(function(t){r("throw",t,c,u)})):n.resolve(f).then((function(t){s.value=t,c(s)}),(function(t){return r("throw",t,c,u)}))}u(l.arg)}var o;a(this,"_invoke",{value:function(t,e){function i(){return new n((function(n,o){r(t,e,n,o)}))}return o=o?o.then(i,i):i()}})}function S(t,e,r){var o=v;return function(i,a){if(o===y)throw new Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:n,done:!0}}for(r.method=i,r.arg=a;;){var c=r.delegate;if(c){var u=A(c,r);if(u){if(u===g)continue;return u}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(o===v)throw o=m,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o=y;var l=h(t,e,r);if("normal"===l.type){if(o=r.done?m:p,l.arg===g)continue;return{value:l.arg,done:r.done}}"throw"===l.type&&(o=m,r.method="throw",r.arg=l.arg)}}}function A(t,e){var r=e.method,o=t.iterator[r];if(o===n)return e.delegate=null,"throw"===r&&t.iterator.return&&(e.method="return",e.arg=n,A(t,e),"throw"===e.method)||"return"!==r&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+r+"' method")),g;var i=h(o,t.iterator,e.arg);if("throw"===i.type)return e.method="throw",e.arg=i.arg,e.delegate=null,g;var a=i.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=n),e.delegate=null,g):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,g)}function P(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function T(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function C(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(P,this),this.reset(!0)}function D(e){if(e||""===e){var r=e[u];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function t(){for(;++o<e.length;)if(i.call(e,o))return t.value=e[o],t.done=!1,t;return t.value=n,t.done=!0,t};return a.next=a}}throw new TypeError(t(e)+" is not iterable")}return b.prototype=x,a(L,"constructor",{value:x,configurable:!0}),a(x,"constructor",{value:b,configurable:!0}),b.displayName=f(x,s,"GeneratorFunction"),r.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===b||"GeneratorFunction"===(e.displayName||e.name))},r.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,s,"GeneratorFunction")),t.prototype=Object.create(L),t},r.awrap=function(t){return{__await:t}},k(E.prototype),f(E.prototype,l,(function(){return this})),r.AsyncIterator=E,r.async=function(t,e,n,o,i){void 0===i&&(i=Promise);var a=new E(d(t,e,n,o),i);return r.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},k(L),f(L,s,"Generator"),f(L,u,(function(){return this})),f(L,"toString",(function(){return"[object Generator]"})),r.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},r.values=D,C.prototype={constructor:C,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=n,this.done=!1,this.delegate=null,this.method="next",this.arg=n,this.tryEntries.forEach(T),!t)for(var e in this)"t"===e.charAt(0)&&i.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=n)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(r,o){return c.type="throw",c.arg=t,e.next=r,o&&(e.method="next",e.arg=n),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],c=a.completion;if("root"===a.tryLoc)return r("end");if(a.tryLoc<=this.prev){var u=i.call(a,"catchLoc"),l=i.call(a,"finallyLoc");if(u&&l){if(this.prev<a.catchLoc)return r(a.catchLoc,!0);if(this.prev<a.finallyLoc)return r(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return r(a.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return r(a.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&i.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var o=r;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),T(n),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;T(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:D(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=n),g}},r}function n(t,e,n,r,o,i,a){try{var c=t[i](a),u=c.value}catch(l){return void n(l)}c.done?e(u):Promise.resolve(u).then(r,o)}function r(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?r(Object(n),!0).forEach((function(e){i(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function i(e,n,r){var o;return o=function(e,n){if("object"!=t(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,n||"default");if("object"!=t(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===n?String:Number)(e)}(n,"string"),(n="symbol"==t(o)?o:String(o))in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}System.register(["./main-legacy.js?v=1714377894636","./index-legacy76.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./xterm-lib-legacy.js?v=1714377894636","./xterm-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636"],(function(t,r){"use strict";var i,a,c,u,l,s,f,d,h,v,p,y,m,g,w,b,x,_,O,j;return{setters:[function(t){i=t.Q,a=t.bI,c=t.n,u=t.q},function(t){l=t._},function(t){s=t.e,f=t.b,d=t.v,h=t.f,v=t.l,p=t.h,y=t.i,m=t.I,g=t.j},function(t){w=t.x,b=t.a,x=t.b,_=t.c},function(t){O=t.X,j=t.x},null],execute:function(){var r=s({__name:"index",props:{url:{default:"/ws_model"},id:{default:""},active:{type:Boolean,default:!0},hostInfo:{default:function(){return{model_index:"btdocker",mod_name:"compose",def_name:"get_pull_log",ws_callback:111}}},destroy:{type:Boolean,default:!0},immediately:{type:Boolean,default:!1},reConnect:{type:Function,default:function(){}},notInit:{type:Boolean,default:!1}},emits:["close","complete"],setup:function(t,r){var c,u,l=r.expose,s=r.emit,L=t,k=g().proxy,E=f(),S=f("success"),A=f(!1),P=f(!1),T=f(),C=d({isEditHostView:!0,isLocal:!0,rowsData:{host:"127.0.0.1",port:22,username:"root",password:"",pkey:"",pkey_passwd:"",ps:""}}),D=null;h((function(){return P.value}),(function(t){t&&v((function(){var t;return null===(t=T.value)||void 0===t?void 0:t.onOpen()}))})),h((function(){return D}),(function(t){}));var N=function(){D=i({route:L.url,onMessage:I})},F=!0,G=0,I=function(t,e){try{!0===F&&(F=!1);var n,r,o,i,a=e.data;if(a.includes("bt_successful"))k.$message.success("拉取成功"),null===(n=D)||void 0===n||n.close(),s("complete");if(a.includes("bt_failed"))k.$message.error("拉取失败"),null===(r=D)||void 0===r||r.close(),s("complete");if(a.includes("bt_successful")&&s("close"),a.indexOf("Authentication timeout.")>-1&&(A.value=!0),(-1!=a.indexOf("@127.0.0.1:")||-1!=a.indexOf("@localhost:"))&&-1!=a.indexOf("Authentication failed"))return null===(o=D)||void 0===o||o.close(),D=null,W(),S.value="danger",P.value=!0,!1;if("\r\n登出\r\n"==a||"登出\r\n"==a||"\r\nlogout\r\n"==a||"logout\r\n"==a||a.search(/logout[\r\n]+$/)>-1)return null===(i=D)||void 0===i||i.close(),D=null,W(),setTimeout((function(){c.write("\r连接已断开,按回车将尝试重新连接!\r")}),500),S.value="danger",!1;if("warning"===S.value?setTimeout((function(){S.value="success"}),500):S.value="success",!L.active&&G>3&&(S.value="warning"),L.active)return G=0,!1;setTimeout((function(){G+=1}),500)}catch(u){}},B=function(){c=new w.Terminal({cursorBlink:!0,fontSize:12,fontFamily:"Monaco, Menlo, Consolas, 'Courier New', monospace",theme:{background:"#333",foreground:"#ececec"}}),u=new b.FitAddon,H(),q(),L.immediately&&X(),u.fit()},H=function(){D&&D.socket.ws.value&&(c.loadAddon(u),c.loadAddon(new j.CanvasAddon),c.loadAddon(new x.WebLinksAddon),c.loadAddon(new _.AttachAddon(D.socket.ws.value)))},M=!1,V=function(){M=!0},W=function(){M=!1},X=function(t,e){var n,r,i,u=o({},L.hostInfo);null!=t&&t.reconnect&&(null===(r=D)||void 0===r||r.send({id:a(6),host:t.host,port:t.port,ps:t.ps,sort:0}));(null===(n=D)||void 0===n||n.send(u),"/webssh"===L.url)&&(null===(i=D)||void 0===i||i.send("\r\n"));e&&L.reConnect(D),c.focus(),c.onData((function(t){"\r"===t&&A.value&&(A.value=!1,c.write("\r\n"),$()),null!==D||"\r"!==t||M||(S.value="danger",V(),c.write("\r\n正在尝试重新连接!\r\n"),$())}))},$=function(t){if(N(),X(o(o({},t||{}),{},{reconnect:!0}),!0),D){var e=D.socket.ws.value;e&&c.loadAddon(new _.AttachAddon(e))}},q=function(){D&&c.open(E.value)},Y=function(){var t,r=(t=e().mark((function t(){var n;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,null===(n=T.value)||void 0===n?void 0:n.onConfirm();case 2:t.sent.status&&(P.value=!1,c.focus(),c.write("\r\n"));case 4:case"end":return t.stop()}}),t)})),function(){var e=this,r=arguments;return new Promise((function(o,i){var a=t.apply(e,r);function c(t){n(a,o,i,c,u,"next",t)}function u(t){n(a,o,i,c,u,"throw",t)}c(void 0)}))});return function(){return r.apply(this,arguments)}}(),z=function(){var t;null===(t=D)||void 0===t||t.close(),D=null,L.destroy||c.dispose()},Q=function(){try{var t;N();var e,n=null===(t=D)||void 0===t?void 0:t.socket.ws.value;if(n)null===(e=c)||void 0===e||e.clear(),c.loadAddon(new _.AttachAddon(n))}catch(r){}},R=function(){try{N(),B()}catch(t){}};return p((function(){v((function(){R()}))})),y((function(){if(L.destroy)try{var t;null===(t=D)||void 0===t||t.close(),D=null,c.dispose()}catch(e){}})),m((function(){var t,e=document.querySelector('div[style*="position: absolute; top: -50000px;"]');e&&(null===(t=e.parentNode)||void 0===t||t.removeChild(e))})),l({useSocket:function(){return D},useTerminal:function(){return c},useStatus:function(){return S},init:R,socketSend:X,useDestroy:z,refreshTerminal:Q}),{__sfc:!0,props:L,vm:k,emit:s,terminalDom:E,isStatus:S,isEnter:A,isLocalVerify:P,xtermAddHost:T,loacalDefault:C,useSocket:D,xterm:c,fitAddon:u,createWebSocket:N,first:F,lastsTime:G,onWSReceive:I,createTerminal:B,loadTerminal:H,lock:M,locked:V,unLock:W,socketSend:X,reconnectTerminal:$,openTerminal:q,saveConfig:Y,useDestroy:z,refreshTerminal:Q,init:R,XtermAddHost:O}}});t("_",c(r,(function(){var t=this,e=t._self._c,n=t._self._setupProxy;return e("div",{staticClass:"flex relative w-full h-full"},[e("div",{ref:"terminalDom",staticClass:"w-full h-full"}),n.isLocalVerify?e("div",{staticClass:"terminal-add-host"},[e("div",{staticClass:"w-[50rem] bg-white rounded-4x flex flex-col items-center"},[e("div",{staticClass:"text-[1.8rem] pt-[2rem] pb-10x flex items-center w-full px-20x"},[e(l,{attrs:{type:"warning",closable:!1},scopedSlots:t._u([{key:"title",fn:function(){return[e("span",[t._v("无法自动认证，请填写本地服务器的登录信息!")])]},proxy:!0}],null,!1,3540643488)})],1),e(n.XtermAddHost,{ref:"xtermAddHost",attrs:{"comp-data":n.loacalDefault},on:{success:n.reconnectTerminal}}),e("div",{staticClass:"flex w-full mb-40x pl-[12rem]"},[e(u,{on:{click:n.saveConfig}},[t._v("保存配置")])],1)],1)]):t._e()])}),[],!1,null,null,null,null).exports)}}}))}();