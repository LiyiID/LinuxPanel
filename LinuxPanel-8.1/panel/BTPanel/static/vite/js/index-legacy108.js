!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return r};var n,r={},o=Object.prototype,i=o.hasOwnProperty,a=Object.defineProperty||function(t,e,n){t[e]=n.value},u="function"==typeof Symbol?Symbol:{},c=u.iterator||"@@iterator",l=u.asyncIterator||"@@asyncIterator",s=u.toStringTag||"@@toStringTag";function f(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(n){f=function(t,e,n){return t[e]=n}}function v(t,e,n,r){var o=e&&e.prototype instanceof w?e:w,i=Object.create(o.prototype),u=new C(r||[]);return a(i,"_invoke",{value:S(t,n,u)}),i}function h(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}r.wrap=v;var d="suspendedStart",p="suspendedYield",y="executing",m="completed",g={};function w(){}function b(){}function x(){}var O={};f(O,c,(function(){return this}));var _=Object.getPrototypeOf,L=_&&_(_(D([])));L&&L!==o&&i.call(L,c)&&(O=L);var j=x.prototype=w.prototype=Object.create(O);function k(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function E(e,n){function r(o,a,u,c){var l=h(e[o],e,a);if("throw"!==l.type){var s=l.arg,f=s.value;return f&&"object"==t(f)&&i.call(f,"__await")?n.resolve(f.__await).then((function(t){r("next",t,u,c)}),(function(t){r("throw",t,u,c)})):n.resolve(f).then((function(t){s.value=t,u(s)}),(function(t){return r("throw",t,u,c)}))}c(l.arg)}var o;a(this,"_invoke",{value:function(t,e){function i(){return new n((function(n,o){r(t,e,n,o)}))}return o=o?o.then(i,i):i()}})}function S(t,e,r){var o=d;return function(i,a){if(o===y)throw new Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:n,done:!0}}for(r.method=i,r.arg=a;;){var u=r.delegate;if(u){var c=A(u,r);if(c){if(c===g)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(o===d)throw o=m,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o=y;var l=h(t,e,r);if("normal"===l.type){if(o=r.done?m:p,l.arg===g)continue;return{value:l.arg,done:r.done}}"throw"===l.type&&(o=m,r.method="throw",r.arg=l.arg)}}}function A(t,e){var r=e.method,o=t.iterator[r];if(o===n)return e.delegate=null,"throw"===r&&t.iterator.return&&(e.method="return",e.arg=n,A(t,e),"throw"===e.method)||"return"!==r&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+r+"' method")),g;var i=h(o,t.iterator,e.arg);if("throw"===i.type)return e.method="throw",e.arg=i.arg,e.delegate=null,g;var a=i.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=n),e.delegate=null,g):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,g)}function P(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function T(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function C(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(P,this),this.reset(!0)}function D(e){if(e||""===e){var r=e[c];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function t(){for(;++o<e.length;)if(i.call(e,o))return t.value=e[o],t.done=!1,t;return t.value=n,t.done=!0,t};return a.next=a}}throw new TypeError(t(e)+" is not iterable")}return b.prototype=x,a(j,"constructor",{value:x,configurable:!0}),a(x,"constructor",{value:b,configurable:!0}),b.displayName=f(x,s,"GeneratorFunction"),r.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===b||"GeneratorFunction"===(e.displayName||e.name))},r.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,s,"GeneratorFunction")),t.prototype=Object.create(j),t},r.awrap=function(t){return{__await:t}},k(E.prototype),f(E.prototype,l,(function(){return this})),r.AsyncIterator=E,r.async=function(t,e,n,o,i){void 0===i&&(i=Promise);var a=new E(v(t,e,n,o),i);return r.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},k(j),f(j,s,"Generator"),f(j,c,(function(){return this})),f(j,"toString",(function(){return"[object Generator]"})),r.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},r.values=D,C.prototype={constructor:C,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=n,this.done=!1,this.delegate=null,this.method="next",this.arg=n,this.tryEntries.forEach(T),!t)for(var e in this)"t"===e.charAt(0)&&i.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=n)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(r,o){return u.type="throw",u.arg=t,e.next=r,o&&(e.method="next",e.arg=n),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],u=a.completion;if("root"===a.tryLoc)return r("end");if(a.tryLoc<=this.prev){var c=i.call(a,"catchLoc"),l=i.call(a,"finallyLoc");if(c&&l){if(this.prev<a.catchLoc)return r(a.catchLoc,!0);if(this.prev<a.finallyLoc)return r(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return r(a.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return r(a.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&i.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var o=r;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),T(n),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;T(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:D(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=n),g}},r}function n(t,e,n,r,o,i,a){try{var u=t[i](a),c=u.value}catch(l){return void n(l)}u.done?e(c):Promise.resolve(c).then(r,o)}function r(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?r(Object(n),!0).forEach((function(e){i(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function i(e,n,r){var o;return o=function(e,n){if("object"!=t(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,n||"default");if("object"!=t(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===n?String:Number)(e)}(n,"string"),(n="symbol"==t(o)?o:String(o))in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}System.register(["./main-legacy.js?v=1714377894636","./index-legacy76.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./xterm-lib-legacy.js?v=1714377894636","./xterm-legacy.js?v=1714377894636"],(function(t,r){"use strict";var i,a,u,c,l,s,f,v,h,d,p,y,m,g,w,b,x,O,_,L,j;return{setters:[function(t){i=t.Q,a=t.n,u=t.q},function(t){c=t._},function(t){l=t.e,s=t.b,f=t.v,v=t.f,h=t.l,d=t.h,p=t.i,y=t.I,m=t.j,g=t.x,w=t.O},function(t){b=t.x,x=t.a,O=t.b,_=t.c},function(t){L=t.X,j=t.x}],execute:function(){var r=l({__name:"index",props:{url:{default:"/webssh"},id:{default:""},active:{type:Boolean,default:!0},hostInfo:{default:function(){return{}}}},emits:["close"],setup:function(t,r){var a,u,c=r.expose,l=r.emit,k=t,E=m().proxy,S=s(),A=s("success"),P=s(),T=s(!1),C=s(!1),D=s(),N=f({isEditHostView:!0,isLocal:!0,rowsData:{host:"127.0.0.1",port:22,username:"root",password:"",pkey:"",pkey_passwd:"",ps:""}}),G=null;v((function(){return k.active}),(function(t){t&&Q()})),v((function(){return C.value}),(function(t){t&&h((function(){var t;return null===(t=D.value)||void 0===t?void 0:t.onOpen()}))}));var I=function(){G=i({route:k.url,onMessage:q,noInit:!0})},F=!0,H=0,q=function(t,e){!0===F&&(F=!1,$());var n,r,o=e.data;return o.indexOf("支持的身份验证类型"),o.indexOf("Authentication timeout.")>-1&&(T.value=!0),-1==o.indexOf("@127.0.0.1:")&&-1==o.indexOf("@localhost:")||-1==o.indexOf("Authentication failed")?"\r\n登出\r\n"==o||"登出\r\n"==o||"\r\nlogout\r\n"==o||"logout\r\n"==o||o.search(/logout[\r\n]+$/)>-1?(null===(r=G)||void 0===r||r.close(),G=null,X(),setTimeout((function(){a.write("\r连接已断开,按回车将尝试重新连接!\r")}),500),A.value="danger",!1):("warning"===A.value?setTimeout((function(){A.value="success"}),500):A.value="success",!k.active&&H>3&&(A.value="warning"),k.active?(H=0,!1):void setTimeout((function(){H+=1}),500)):(null===(n=G)||void 0===n||n.close(),G=null,X(),A.value="danger",C.value=!0,!1)},z=function(){a=new b.Terminal({cursorBlink:!0,fontSize:14,fontFamily:"Monaco, Menlo, Consolas, 'Courier New', monospace",theme:{background:"#111",foreground:"#fff"}}),u=new x.FitAddon,M(),Y(),B(),Q()},M=function(){G&&G.socket.ws.value&&(a.loadAddon(u),a.loadAddon(new j.CanvasAddon),a.loadAddon(new O.WebLinksAddon),a.loadAddon(new _.AttachAddon(G.socket.ws.value)))},V=!1,W=function(){V=!0},X=function(){V=!1},B=function(){var t,e,n=o({id:k.id,"x-http-token":window.vite_public_request_token},k.hostInfo);"/pyenv_webssh"===k.url&&(n=o({},k.hostInfo),null===(e=G)||void 0===e||e.send({"x-http-token":window.vite_public_request_token}));null===(t=G)||void 0===t||t.send(n),a.focus(),a.onData((function(t){"\r"===t&&T.value&&(T.value=!1,a.write("\r\n"),R()),null!==G||"\r"!==t||V||(A.value="danger",W(),a.write("\r\n正在尝试重新连接!\r\n"),R())}))},R=function(){if(I(),B(),G){var t=G.socket.ws.value;t&&a.loadAddon(new _.AttachAddon(t))}},Y=function(){G&&a.open(S.value)},Q=function(){if(G&&(u.fit(),!G.isStatus("CLOSED"))){var t=a,e=t.cols,n=t.rows;G.send({cols:e,rows:n,resize:1})}},$=function(){P.value=g(S.value,w((function(){Q()}),200))},J=function(){var t,r=(t=e().mark((function t(){var n;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,null===(n=D.value)||void 0===n?void 0:n.onConfirm();case 2:t.sent.status&&(C.value=!1,a.focus(),a.write("\r\n"),R());case 4:case"end":return t.stop()}}),t)})),function(){var e=this,r=arguments;return new Promise((function(o,i){var a=t.apply(e,r);function u(t){n(a,o,i,u,c,"next",t)}function c(t){n(a,o,i,u,c,"throw",t)}u(void 0)}))});return function(){return r.apply(this,arguments)}}();return d((function(){h((function(){I(),z()}))})),p((function(){try{var t,e;if(null===(t=G)||void 0===t||t.close(),G=null,a.dispose(),P.value instanceof ResizeObserver)null===(e=P.value)||void 0===e||e.disconnect()}catch(n){}})),y((function(){var t,e=document.querySelector('div[style*="position: absolute; top: -50000px;"]');e&&(null===(t=e.parentNode)||void 0===t||t.removeChild(e))})),c({useSocket:function(){return G},useTerminal:function(){return a},useStatus:function(){return A}}),{__sfc:!0,vm:E,props:k,emit:l,terminalDom:S,isStatus:A,termObserver:P,isEnter:T,isLocalVerify:C,xtermAddHost:D,loacalDefault:N,useSocket:G,terminal:a,fitAddon:u,createWebSocket:I,first:F,lastsTime:H,onWSReceive:q,createTerminal:z,loadTerminal:M,lock:V,locked:W,unLock:X,socketSend:B,reconnectTerminal:R,openTerminal:Y,fitTerminal:Q,resizeTerminal:$,saveConfig:J,XtermAddHost:L}}});t("_",a(r,(function(){var t=this,e=t._self._c,n=t._self._setupProxy;return e("div",{staticClass:"flex relative"},[e("div",{ref:"terminalDom",staticClass:"w-full h-full"}),n.isLocalVerify?e("div",{staticClass:"terminal-add-host"},[e("div",{staticClass:"w-[50rem] bg-white rounded-4x flex flex-col items-center"},[e("div",{staticClass:"text-[1.8rem] pt-[2rem] pb-10x flex items-center w-full px-20x"},[e(c,{attrs:{type:"warning",closable:!1},scopedSlots:t._u([{key:"title",fn:function(){return[e("span",[t._v("无法自动认证，请填写本地服务器的登录信息!")])]},proxy:!0}],null,!1,3540643488)})],1),e(n.XtermAddHost,{ref:"xtermAddHost",attrs:{"comp-data":n.loacalDefault}}),e("div",{staticClass:"flex w-full mb-40x pl-[12rem]"},[e(u,{on:{click:n.saveConfig}},[t._v("保存配置")])],1)],1)]):t._e()])}),[],!1,null,null,null,null).exports)}}}))}();