!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,o,i,a,c=[],l=!0,u=!1;try{if(i=(n=n.call(t)).next,0===e){if(Object(n)!==n)return;l=!1}else for(;!(l=(r=i.call(n)).done)&&(c.push(r.value),c.length!==e);l=!0);}catch(t){u=!0,o=t}finally{try{if(!l&&null!=n.return&&(a=n.return(),Object(a)!==a))return}finally{if(u)throw o}}return c}}(t,e)||n(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function n(t,e){if(t){if("string"==typeof t)return r(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(t,e):void 0}}function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function o(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */o=function(){return n};var e,n={},r=Object.prototype,i=r.hasOwnProperty,a=Object.defineProperty||function(t,e,n){t[e]=n.value},c="function"==typeof Symbol?Symbol:{},l=c.iterator||"@@iterator",u=c.asyncIterator||"@@asyncIterator",s=c.toStringTag||"@@toStringTag";function f(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(e){f=function(t,e,n){return t[e]=n}}function p(t,e,n,r){var o=e&&e.prototype instanceof w?e:w,i=Object.create(o.prototype),c=new q(r||[]);return a(i,"_invoke",{value:O(t,n,c)}),i}function h(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}n.wrap=p;var d="suspendedStart",y="suspendedYield",v="executing",m="completed",g={};function w(){}function b(){}function _(){}var x={};f(x,l,(function(){return this}));var S=Object.getPrototypeOf,j=S&&S(S(M([])));j&&j!==r&&i.call(j,l)&&(x=j);var E=_.prototype=w.prototype=Object.create(x);function L(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function k(e,n){function r(o,a,c,l){var u=h(e[o],e,a);if("throw"!==u.type){var s=u.arg,f=s.value;return f&&"object"==t(f)&&i.call(f,"__await")?n.resolve(f.__await).then((function(t){r("next",t,c,l)}),(function(t){r("throw",t,c,l)})):n.resolve(f).then((function(t){s.value=t,c(s)}),(function(t){return r("throw",t,c,l)}))}l(u.arg)}var o;a(this,"_invoke",{value:function(t,e){function i(){return new n((function(n,o){r(t,e,n,o)}))}return o=o?o.then(i,i):i()}})}function O(t,n,r){var o=d;return function(i,a){if(o===v)throw new Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:e,done:!0}}for(r.method=i,r.arg=a;;){var c=r.delegate;if(c){var l=P(c,r);if(l){if(l===g)continue;return l}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(o===d)throw o=m,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o=v;var u=h(t,n,r);if("normal"===u.type){if(o=r.done?m:y,u.arg===g)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(o=m,r.method="throw",r.arg=u.arg)}}}function P(t,n){var r=n.method,o=t.iterator[r];if(o===e)return n.delegate=null,"throw"===r&&t.iterator.return&&(n.method="return",n.arg=e,P(t,n),"throw"===n.method)||"return"!==r&&(n.method="throw",n.arg=new TypeError("The iterator does not provide a '"+r+"' method")),g;var i=h(o,t.iterator,n.arg);if("throw"===i.type)return n.method="throw",n.arg=i.arg,n.delegate=null,g;var a=i.arg;return a?a.done?(n[t.resultName]=a.value,n.next=t.nextLoc,"return"!==n.method&&(n.method="next",n.arg=e),n.delegate=null,g):a:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,g)}function I(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function T(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function q(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(I,this),this.reset(!0)}function M(n){if(n||""===n){var r=n[l];if(r)return r.call(n);if("function"==typeof n.next)return n;if(!isNaN(n.length)){var o=-1,a=function t(){for(;++o<n.length;)if(i.call(n,o))return t.value=n[o],t.done=!1,t;return t.value=e,t.done=!0,t};return a.next=a}}throw new TypeError(t(n)+" is not iterable")}return b.prototype=_,a(E,"constructor",{value:_,configurable:!0}),a(_,"constructor",{value:b,configurable:!0}),b.displayName=f(_,s,"GeneratorFunction"),n.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===b||"GeneratorFunction"===(e.displayName||e.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,_):(t.__proto__=_,f(t,s,"GeneratorFunction")),t.prototype=Object.create(E),t},n.awrap=function(t){return{__await:t}},L(k.prototype),f(k.prototype,u,(function(){return this})),n.AsyncIterator=k,n.async=function(t,e,r,o,i){void 0===i&&(i=Promise);var a=new k(p(t,e,r,o),i);return n.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},L(E),f(E,s,"Generator"),f(E,l,(function(){return this})),f(E,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},n.values=M,q.prototype={constructor:q,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(T),!t)for(var n in this)"t"===n.charAt(0)&&i.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var n=this;function r(r,o){return c.type="throw",c.arg=t,n.next=r,o&&(n.method="next",n.arg=e),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],c=a.completion;if("root"===a.tryLoc)return r("end");if(a.tryLoc<=this.prev){var l=i.call(a,"catchLoc"),u=i.call(a,"finallyLoc");if(l&&u){if(this.prev<a.catchLoc)return r(a.catchLoc,!0);if(this.prev<a.finallyLoc)return r(a.finallyLoc)}else if(l){if(this.prev<a.catchLoc)return r(a.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return r(a.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&i.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var o=r;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),T(n),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;T(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,n,r){return this.delegate={iterator:M(t),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=e),g}},n}function i(t,e,n,r,o,i,a){try{var c=t[i](a),l=c.value}catch(u){return void n(u)}c.done?e(l):Promise.resolve(l).then(r,o)}function a(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,l(r.key),r)}}function c(t,e,n){return(e=l(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function l(e){var n=function(e,n){if("object"!=t(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,n||"default");if("object"!=t(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===n?String:Number)(e)}(e,"string");return"symbol"==t(n)?n:String(n)}System.register(["./modulepreload-polyfill-legacy.js?v=1714377894636"],(function(t,r){"use strict";return{setters:[null],execute:function(){var t=function(){function t(){var e=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),c(this,"trackings",0),c(this,"elementMount",!1),c(this,"dragElement",(function(t){var e=0,n=0,r=0,o=0,i=t.querySelector(".layui-layer-title"),a=document.documentElement;function c(i){i.preventDefault(),e=r-i.clientX,n=o-i.clientY,r=i.clientX,o=i.clientY;var c=t.offsetLeft-e,l=t.offsetTop-n,u=a.getBoundingClientRect(),s=t.getBoundingClientRect();c<u.left?c=u.left:c+s.width>u.right&&(c=u.right-s.width),l<u.top?l=u.top:l+s.height>u.bottom&&(l=u.bottom-s.height),t.style.left="".concat(c,"px"),t.style.top="".concat(l,"px")}function l(){document.onmouseup=null,document.onmousemove=null}i.onmousedown=function(t){t.preventDefault(),r=t.clientX,o=t.clientY,document.onmouseup=l,document.onmousemove=c}})),c(this,"centerModal",(function(t){var e=document.documentElement,n=t.getBoundingClientRect(),r=e.getBoundingClientRect(),o=r.left+(r.width-n.width)/2,i=r.top+(r.height-n.height)/2;t.style.left="".concat(o,"px"),t.style.top="".concat(i,"px")})),c(this,"closeModal",(function(t){t.querySelector(".layui-layer-close").onclick=function(){window.parent.postMessage("closePlugin","*")}})),c(this,"trackingsFun",(function(t){e.trackings=setInterval((function(){var n=document.querySelector(t);n&&(e.elementMount=!0),e.elementMount&&!n&&(clearInterval(e.trackings),window.parent.postMessage("closePlugin","*"))}),500)})),this.init()}var r,l,u,s,f;return r=t,l=[{key:"init",value:function(){var t=this.getUrlParams().paymentId,e=sessionStorage.getItem("pluginViewInfo");if(e){var n=JSON.parse(e),r=n.id,o=n.name,i=n.built,a=sessionStorage.getItem(r),c="1"===i;if("string"==typeof t)return window.product_recommend.pay_product_sign("ltd",t),!1;"webssh"===r&&this.trackingsFun(".term_box_all"),c?this.renderBuiltPlugin(r):this.renderPluginView({pluginId:r,pluginName:o,pluginHtml:a}),setTimeout((function(){sessionStorage.removeItem(r),sessionStorage.removeItem("pluginId")}),2e3)}}},{key:"renderBuiltPlugin",value:function(t){var e=this,n=window.bt.load();window.bt.soft.get_soft_find(t,(function(r){n.close(),!0!==r.setup&&window.bt.msg({status:!1,msg:"".concat(r.title,"未安装，请先安装。")}),"mysql"===t&&(t="mysqld"),e.renderPluginView({pluginId:t,pluginName:r.title+window.lan.soft.admin,pluginHtml:'<div class="bt-w-main" style="width:640px;"><div class="bt-w-menu bt-soft-menu"></div><div id="webEdit-con" class="bt-w-con pd15" style="height:555px;overflow:auto"><div class="soft-man-con bt-form"></div></div></div>'});var o=window.jQuery(".bt-soft-menu").data("data",r);setTimeout((function(){if(o.append(window.jQuery('<p class="bgw bt_server" onclick="soft.get_tab_contents(\'service\',this)">'.concat(window.lan.soft.service,"</p>"))),r.version_coexist)for(var e=t.split("-")[1].replace(".",""),n=[{type:"set_php_config",val:e,title:window.lan.soft.php_main5},{type:"config_edit",val:e,title:window.lan.soft.config_edit},{type:"set_upload_limit",val:e,title:window.lan.soft.php_main2},{type:"set_timeout_limit",val:e,title:window.lan.soft.php_main3,php53:!0},{type:"config",val:e,title:window.lan.soft.php_main4},{type:"fpm_config",val:e,title:"FPM配置文件"},{type:"set_dis_fun",val:e,title:window.lan.soft.php_main6},{type:"set_fpm_config",val:e,title:window.lan.soft.php_main7,apache24:!0,php53:!0},{type:"get_php_status",val:e,title:window.lan.soft.php_main8,apache24:!0,php53:!0},{type:"get_php_session",val:e,title:window.lan.soft.php_main9,apache24:!0,php53:!0},{type:"get_fpm_logs",val:e,title:window.lan.soft.log,apache24:!0,php53:!0},{type:"get_slow_logs",val:e,title:window.lan.public.slow_log,apache24:!0,php53:!0},{type:"get_phpinfo",val:e,title:"phpinfo"}],i=[0,1,2,3,4,5,6,7,8,9,10,11,12],a="openlitespeed"===window.bt.get_cookie("serverType"),c=0;c<i.length;c++){var l=n[c];if(l&&(void 0===l.os||l.os===window.bt.os)){if(t.indexOf("5.2")>=0&&l.php53)continue;if(a&&("set_fpm_config"===l.type||"fpm_config"===l.type||"get_php_status"===l.type))continue;var u=l.apache24?'class="apache24"':"";o.append(window.jQuery('<p data-id="'.concat(c,'" ').concat(u," onclick=\"soft.get_tab_contents('").concat(l.type,"',this)\" >").concat(l.title,"</p>")).data("item",l))}}else o.append(window.soft.get_config_menu(t));window.jQuery(".bt-w-menu p").click((function(){window.jQuery(this).addClass("bgw").siblings().removeClass("bgw")})),window.jQuery(".bt-w-menu p:eq(0)").trigger("click"),-1===t.indexOf("php-")&&-1===t.indexOf("apache")||window.bt.soft.get_soft_find("apache",(function(e){e.setup&&e.version.indexOf("2.2")>=0&&(-1!==t.indexOf("php-")&&(window.jQuery(".apache24").hide(),window.jQuery(".bt_server").remove(),window.jQuery(".bt-w-menu p:eq(0)").trigger("click")),-1!==t.indexOf("apache")&&(window.jQuery(".bt-soft-menu p:eq(3)").remove(),window.jQuery(".bt-soft-menu p:eq(3)").remove()))}))}),100)}))}},{key:"renderPluginView",value:function(t){var e,n=document.querySelector("#app");n.innerHTML='\n\t\t\t\t<div class="flex" style="'.concat("webssh"===t.pluginId?"dispaly:none;":"",'">\n\t\t\t\t\t<div class="layui-layer-shade"\t\n\t\t\t\t\t\tstyle="z-index:1989001; background-color:#000; opacity:0.3; filter:alpha(opacity=30);"></div>\n\t\t\t\t\t<div class="layui-layer layui-layer-page  layer-anim-05" id="plugin-view" type="page" times="2" showtime="0"\n\t\t\t\t\t\tcontype="string" style="z-index:1989001;width:640px;">\n\t\t\t\t\t\t<div class="layui-layer-title" style="cursor: move;">\n\t\t\t\t\t\t\t<span class="flex item-center">\n\t\t\t\t\t\t\t\t<img class="plugin-icon" src="/static/img/soft_ico/ico-').concat(-1!==(null===(e=t.pluginId)||void 0===e?void 0:e.indexOf("php-"))?"php":"mysqld"===t.pluginId?"mysql":t.pluginId,'.png" />\n\t\t\t\t\t\t\t\t<span class="plugin-name">').concat(t.pluginName,'</span>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="layui-layer-content">').concat(t.pluginHtml,'</div>\n\t\t\t\t\t\t<span class="layui-layer-setwin">\n\t\t\t\t\t\t\t<a class="layui-layer-ico layui-layer-close layui-layer-close2" href="javascript:;"></a>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>');var r=null==n?void 0:n.querySelector("#plugin-view");t.pluginHtml&&this.executeScripts(t.pluginHtml),this.dragElement(r),this.centerModal(r),this.closeModal(r)}},{key:"runSrcipt",value:function(t){var e=document.createElement("script");e.innerHTML=t.innerHTML;var n=t.getAttribute("src");n&&e.setAttribute("src",n),document.body.appendChild(e),document.body.removeChild(e)}},{key:"isDev",value:function(){return!1}},{key:"loadScripts",value:(s=o().mark((function t(e,n){var r=this;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Promise.all(e.map((function(t){return r.loadScript(t)})));case 2:n.forEach((function(t){eval.call(window,t)}));case 3:case"end":return t.stop()}}),t)})),f=function(){var t=this,e=arguments;return new Promise((function(n,r){var o=s.apply(t,e);function a(t){i(o,n,r,a,c,"next",t)}function c(t){i(o,n,r,a,c,"throw",t)}a(void 0)}))},function(t,e){return f.apply(this,arguments)})},{key:"loadScript",value:function(t){return new Promise((function(e,n){var r,o=document.createElement("script");o.src=t,o.onload=function(){e()},o.onerror=function(){n()},null===(r=document.querySelector("#app"))||void 0===r||r.appendChild(o)}))}},{key:"executeScripts",value:function(t){if(t){for(var e,n=[],r=[],o=/<script\b([^>]*)>([\s\S]*?)<\/script>/gi;null!==(e=o.exec(t));){var i=e[1].match(/src="([^"]*)"/i);if(i){var a=i[1];n.push(a)}else{if(!(e[1].match(/type="text\/javascript"/i)||e[1].match(/type="module"/i)||e[1].match(/type="javascript\/text"/i)))continue;var c=e[2];try{r.push(c)}catch(l){}}}this.loadScripts(n,r)}}},{key:"getUrlParams",value:function(){var t,r={},o=function(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=n(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var o=0,i=function(){};return{s:i,n:function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,c=!0,l=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return c=t.done,t},e:function(t){l=!0,a=t},f:function(){try{c||null==r.return||r.return()}finally{if(l)throw a}}}}(new URL(window.location.href).searchParams.entries());try{for(o.s();!(t=o.n()).done;){var i=e(t.value,2),a=i[0],c=i[1];r[a.replace("?","")]=c}}catch(l){o.e(l)}finally{o.f()}return r}}],l&&a(r.prototype,l),u&&a(r,u),Object.defineProperty(r,"prototype",{writable:!1}),t}();new t}}}))}();