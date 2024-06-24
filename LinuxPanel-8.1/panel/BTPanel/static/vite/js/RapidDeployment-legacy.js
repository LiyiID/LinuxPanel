!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return r};var a,r={},n=Object.prototype,o=n.hasOwnProperty,s=Object.defineProperty||function(t,e,a){t[e]=a.value},i="function"==typeof Symbol?Symbol:{},l=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function p(t,e,a){return Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{p({},"")}catch(a){p=function(t,e,a){return t[e]=a}}function f(t,e,a,r){var n=e&&e.prototype instanceof g?e:g,o=Object.create(n.prototype),i=new D(r||[]);return s(o,"_invoke",{value:E(t,a,i)}),o}function d(t,e,a){try{return{type:"normal",arg:t.call(e,a)}}catch(t){return{type:"throw",arg:t}}}r.wrap=f;var h="suspendedStart",v="suspendedYield",m="executing",y="completed",_={};function g(){}function b(){}function x(){}var w={};p(w,l,(function(){return this}));var j=Object.getPrototypeOf,k=j&&j(j(M([])));k&&k!==n&&o.call(k,l)&&(w=k);var L=x.prototype=g.prototype=Object.create(w);function C(t){["next","throw","return"].forEach((function(e){p(t,e,(function(t){return this._invoke(e,t)}))}))}function S(e,a){function r(n,s,i,l){var c=d(e[n],e,s);if("throw"!==c.type){var u=c.arg,p=u.value;return p&&"object"==t(p)&&o.call(p,"__await")?a.resolve(p.__await).then((function(t){r("next",t,i,l)}),(function(t){r("throw",t,i,l)})):a.resolve(p).then((function(t){u.value=t,i(u)}),(function(t){return r("throw",t,i,l)}))}l(c.arg)}var n;s(this,"_invoke",{value:function(t,e){function o(){return new a((function(a,n){r(t,e,a,n)}))}return n=n?n.then(o,o):o()}})}function E(t,e,r){var n=h;return function(o,s){if(n===m)throw new Error("Generator is already running");if(n===y){if("throw"===o)throw s;return{value:a,done:!0}}for(r.method=o,r.arg=s;;){var i=r.delegate;if(i){var l=T(i,r);if(l){if(l===_)continue;return l}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===h)throw n=y,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=m;var c=d(t,e,r);if("normal"===c.type){if(n=r.done?y:v,c.arg===_)continue;return{value:c.arg,done:r.done}}"throw"===c.type&&(n=y,r.method="throw",r.arg=c.arg)}}}function T(t,e){var r=e.method,n=t.iterator[r];if(n===a)return e.delegate=null,"throw"===r&&t.iterator.return&&(e.method="return",e.arg=a,T(t,e),"throw"===e.method)||"return"!==r&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+r+"' method")),_;var o=d(n,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,_;var s=o.arg;return s?s.done?(e[t.resultName]=s.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=a),e.delegate=null,_):s:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,_)}function P(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function O(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function D(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(P,this),this.reset(!0)}function M(e){if(e||""===e){var r=e[l];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var n=-1,s=function t(){for(;++n<e.length;)if(o.call(e,n))return t.value=e[n],t.done=!1,t;return t.value=a,t.done=!0,t};return s.next=s}}throw new TypeError(t(e)+" is not iterable")}return b.prototype=x,s(L,"constructor",{value:x,configurable:!0}),s(x,"constructor",{value:b,configurable:!0}),b.displayName=p(x,u,"GeneratorFunction"),r.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===b||"GeneratorFunction"===(e.displayName||e.name))},r.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,p(t,u,"GeneratorFunction")),t.prototype=Object.create(L),t},r.awrap=function(t){return{__await:t}},C(S.prototype),p(S.prototype,c,(function(){return this})),r.AsyncIterator=S,r.async=function(t,e,a,n,o){void 0===o&&(o=Promise);var s=new S(f(t,e,a,n),o);return r.isGeneratorFunction(e)?s:s.next().then((function(t){return t.done?t.value:s.next()}))},C(L),p(L,u,"Generator"),p(L,l,(function(){return this})),p(L,"toString",(function(){return"[object Generator]"})),r.keys=function(t){var e=Object(t),a=[];for(var r in e)a.push(r);return a.reverse(),function t(){for(;a.length;){var r=a.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},r.values=M,D.prototype={constructor:D,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=a,this.done=!1,this.delegate=null,this.method="next",this.arg=a,this.tryEntries.forEach(O),!t)for(var e in this)"t"===e.charAt(0)&&o.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=a)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(r,n){return i.type="throw",i.arg=t,e.next=r,n&&(e.method="next",e.arg=a),!!n}for(var n=this.tryEntries.length-1;n>=0;--n){var s=this.tryEntries[n],i=s.completion;if("root"===s.tryLoc)return r("end");if(s.tryLoc<=this.prev){var l=o.call(s,"catchLoc"),c=o.call(s,"finallyLoc");if(l&&c){if(this.prev<s.catchLoc)return r(s.catchLoc,!0);if(this.prev<s.finallyLoc)return r(s.finallyLoc)}else if(l){if(this.prev<s.catchLoc)return r(s.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<s.finallyLoc)return r(s.finallyLoc)}}}},abrupt:function(t,e){for(var a=this.tryEntries.length-1;a>=0;--a){var r=this.tryEntries[a];if(r.tryLoc<=this.prev&&o.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var n=r;break}}n&&("break"===t||"continue"===t)&&n.tryLoc<=e&&e<=n.finallyLoc&&(n=null);var s=n?n.completion:{};return s.type=t,s.arg=e,n?(this.method="next",this.next=n.finallyLoc,_):this.complete(s)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),_},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var a=this.tryEntries[e];if(a.finallyLoc===t)return this.complete(a.completion,a.afterLoc),O(a),_}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var a=this.tryEntries[e];if(a.tryLoc===t){var r=a.completion;if("throw"===r.type){var n=r.arg;O(a)}return n}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:M(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=a),_}},r}function a(t,e,a,r,n,o,s){try{var i=t[o](s),l=i.value}catch(c){return void a(c)}i.done?e(l):Promise.resolve(l).then(r,n)}function r(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var s=t.apply(e,r);function i(t){a(s,n,o,i,l,"next",t)}function l(t){a(s,n,o,i,l,"throw",t)}i(void 0)}))}}System.register(["./index-legacy51.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./empty-legacy.js?v=1714377894636","./index-legacy39.js?v=1714377894636","./index-legacy41.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./index-legacy30.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./select-legacy.js?v=1714377894636","./index-legacy77.js?v=1714377894636","./tabs-legacy.js?v=1714377894636","./index-legacy42.js?v=1714377894636","./index-legacy91.js?v=1714377894636","./echarts-legacy.js?v=1714377894636","./date-picker-legacy.js?v=1714377894636","./date-util-legacy.js?v=1714377894636","./card-legacy.js?v=1714377894636","./col-legacy.js?v=1714377894636","./row-legacy.js?v=1714377894636","./index-legacy85.js?v=1714377894636","./index-legacy46.js?v=1714377894636","./switch-legacy.js?v=1714377894636","./index.vue_vue_type_style_index_0_lang-legacy.js?v=1714377894636"],(function(t,a){"use strict";var n,o,s,i,l,c,u,p,f,d,h,v,m,y,_;return{setters:[function(t){n=t._},function(t){o=t.P},function(t){s=t.g,i=t.f,l=t.n,c=t.r},null,function(t){u=t._},function(t){p=t._},function(t){f=t.e,d=t.v,h=t.b},function(t){v=t.G,m=t.S,y=t.a,_=t.b},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],execute:function(){var a=f({__name:"RapidDeployment",setup:function(t){var a=s().refs.authType,n=d({title:"日报-功能介绍",ps:"能够对服务器运行情况进行监测，分析服务器异常的信息进行行为记录，协助管理员进行服务器分析。",source:22,desc:["服务器运行情况监测","异常信息记录","服务器分析"],tabImgs:[{title:"概览",imgSrc:"https://www.bt.cn/Public/new/plugin/introduce/control/daily.png"}]}),o=h([]),l=h(),c=h(),u=h(),p=h(),f=h(),g=h([]),b=h([]),x=h([]),w=function(){var t=r(e().mark((function t(){return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,v({type:"memcached",p:1,limit:10});case 2:return t.next=4,m({option:2,name:"memcached"});case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),j=function(){var t=r(e().mark((function t(a){var r,n,s;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,y({date:a});case 2:r=t.sent,n=r.data,c.value=n.evaluate,"正常"===n.evaluate?u.value="#20a53a":"良好"===n.evaluate?u.value="#2034a5":u.value="#ffa700",s=n.date.toString(),p.value=s.substr(0,4)+"-"+s.substr(4,2)+"-"+s.substr(6,2)+" 00:00:00 - 23:59:59",f.value=n.summary,o.value=[{name:"资源",value:"过载次数(五分钟内平均使用率超过80%)"},{name:"CPU",is_status:!0,data:n.data.cpu},{name:"内存",is_status:!0,data:n.data.ram},{name:"磁盘",is_status:!0,data:n.data.disk},{name:"常用服务",value:"异常次数(服务出现停止运行的次数)"},{name:"Nginx",is_status:!0,data:n.data.server.nginx},{name:"Mysql",is_status:!0,data:n.data.server.mysql},{name:"Apache",is_status:!0,data:n.data.server.apache},{name:"PHP",is_status:!0,data:n.data.server.php},{name:"Ftpd",is_status:!0,data:n.data.server.ftpd},{name:"Redis",is_status:!0,data:n.data.server.redis},{name:"Tomcat",is_status:!0,data:n.data.server.tomcat},{name:"Memcached",is_status:!0,data:n.data.server.memcached},{name:"备份类型",value:"备份失败",excess:"未开启备份",is_excess:!0},{name:"数据库",is_status:!0,data:n.data.backup.database.backup,data_excess:n.data.backup.database.no_backup,have_data_excess:!0},{name:"网站",is_status:!0,data:n.data.backup.site.backup,data_excess:n.data.backup.site.no_backup,have_data_excess:!0},{name:"异常类型",value:"次数"},{name:"面板异常登录",is_status:!0,data:n.data.exception.panel},{name:"SSH异常登录",is_status:!0,data:n.data.exception.ssh}];case 10:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),k=function(){var t=r(e().mark((function t(){var a,r;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,_();case 3:a=t.sent,r=a.data,g.value=r.map((function(t){return{title:t.time_key.toString().substr(0,4)+"-"+t.time_key.toString().substr(4,2)+"-"+t.time_key.toString().substr(6,2),key:t.time_key,is_status:"正常"==t.evaluate?"success":"error"}})),l.value=g.value.length?g.value[0].key:"",l.value&&j(l.value),t.next=12;break;case 10:t.prev=10,t.t0=t.catch(0);case 12:case"end":return t.stop()}}),t,null,[[0,10]])})));return function(){return t.apply(this,arguments)}}();return k(),{__sfc:!0,authType:a,productData:n,tableList:o,select_value:l,top_status:c,top_status_color:u,wach_time:p,summary:f,selectData:g,tableColumn:b,data_list:x,getInfo:w,filterType:function(t){return"数据库"==t.name||"网站"==t.name?t.data.length>0:t.data.detail.length>0},goDetail:function(t,e){"数据库"==e||"网站"==e?t[0].target?b.value=[{label:"名称",showOverflowTooltip:!0,prop:"name"},{label:"时间",prop:"time",render:function(t,e){return i(t.time,"yyyy-MM-dd hh:mm:ss")}}]:b.value=[{label:"名称",showOverflowTooltip:!0,prop:"name"}]:"面板异常登录"==e||"SSH异常登录"==e?b.value=[{label:"时间",prop:"time",showOverflowTooltip:!0,render:function(t,e){return i(t.time,"yyyy-MM-dd hh:mm:ss")}},{label:"用户",prop:"username"},{label:"详情",prop:"desc"}]:"磁盘"==e?b.value=[{label:"路径",showOverflowTooltip:!0,prop:"name"},{label:"占用",prop:"percent",render:function(t,e){return t.percent+"%"}}]:"CPU"==e||"内存"==e?b.value=[{label:"过载时间",prop:"time",width:130,showOverflowTooltip:!0,render:function(t,e){return i(t.time,"yyyy-MM-dd hh:mm:ss")}},{label:"PID",prop:"pid",width:60},{label:"进程",prop:"name",showOverflowTooltip:!0},{label:"占用",width:45,prop:"percent",render:function(t,e){return t.percent+"%"}}]:"Nginx"!=e&&"Mysql"!=e&&"Apache"!=e&&"PHP"!=e&&"Ftpd"!=e&&"Redis"!=e&&"Tomcat"!=e&&"Memcached"!=e||(b.value=[{label:"停止时间",prop:"time",render:function(t,e){return i(t.time,"yyyy-MM-dd hh:mm:ss")}}]),b.value.unshift({prop:"index",width:30,render:function(t,e){return e+1}}),x.value="数据库"==e||"网站"==e?t:t.detail},getPanelDailyDatas:j,getPanelDailyInfoLists:k,handleTimeChange:function(t){j(t)}}}});t("default",l(a,(function(){var t=this,e=t._self._c,a=t._self._setupProxy;return e("div",{staticClass:"content_box"},["free"!==a.authType?e("div",[a.selectData.length?[e("div",{staticClass:"box-select"},[e("span",[t._v("选择日期：")]),e(p,{staticClass:"w-[12.02rem]",attrs:{options:a.selectData,change:a.handleTimeChange},on:{click:function(t){t.stopPropagation()}},model:{value:a.select_value,callback:function(t){a.select_value=t},expression:"select_value"}})],1),e("div",{staticClass:"box-body"},[e("div",{staticClass:"body_top"},[e("span",{staticClass:"top_status",style:{color:a.top_status_color}},[t._v(t._s(a.top_status))]),e("span",{staticClass:"wach_time"},[t._v("监测时间："+t._s(a.wach_time))]),e("span",{staticClass:"msg_title"},[t._v("健康信息提醒：")]),e("div",{staticClass:"msg_box"},t._l(a.summary,(function(a,r){return e("span",{key:r},[t._v("●"+t._s(a))])})),0)]),e("div",{staticClass:"body_bottom"},[t._l(a.tableList,(function(r,n){return e("div",{key:n,staticClass:"bottom_item"},[e("div",{staticClass:"item_name"},[r.is_status?e("span",{staticClass:"mr-[.5rem]",style:{background:"数据库"==r.name||"网站"==r.name?0==r.data.length&&0==r.data_excess.length?"#20a53a":"red":0==r.data.ex?"#20a53a":"red"}}):t._e(),t._v(t._s(r.name)+" ")]),r.is_status?e("div",{staticClass:"item_value",style:{width:r.have_data_excess?"24rem":"auto"}},[t._v(" "+t._s("数据库"==r.name||"网站"==r.name?0==r.data.length?"未监测到异常":r.data.length+"次":0==r.data.ex?"未监测到异常":r.data.ex+"次")+" "),a.filterType(r)?e(c,{attrs:{width:"360",placement:"bottom",trigger:"hover","popper-class":"max_over"}},[e(u,{ref:"menuTable1",refInFor:!0,attrs:{data:a.data_list,column:a.tableColumn}}),e("span",{staticStyle:{color:"#20a53a",cursor:"pointer"},attrs:{slot:"reference"},on:{mouseover:function(t){return a.goDetail(r.data,r.name)}},slot:"reference"},[t._v("  查看详情")])],1):t._e()],1):e("div",{staticClass:"item_value",style:{width:r.is_excess?"24rem":"auto"}},[t._v(" "+t._s(r.value)+" ")]),r.is_excess?e("div",{staticClass:"item_excess"},[t._v(t._s(r.excess))]):t._e(),r.is_status&&r.data_excess?e("div",{staticClass:"item_excess"},[t._v(" "+t._s(r.have_data_excess&&r.data_excess.length?r.data_excess.length+"次":"未监测到异常")+" "),r.have_data_excess&&r.data_excess.length?e(c,{attrs:{width:"350",placement:"bottom",trigger:"hover","popper-class":"max_over"}},[e(u,{ref:"menuTable2",refInFor:!0,attrs:{data:a.data_list,column:a.tableColumn}}),e("span",{staticStyle:{color:"#20a53a",cursor:"pointer"},attrs:{slot:"reference"},on:{mouseover:function(t){return a.goDetail(r.data_excess,r.name)}},slot:"reference"},[t._v("  查看详情")])],1):t._e()],1):t._e()])})),e("span",{staticClass:"bottom_tips"},[t._v("在系统监控开启的情况下，日报会记录服务器每天运行的异常信息，协助管理员分析服务器前一天是否运行正常。")])],2)])]:e(o,{attrs:{"image-size":200,description:"面板日报暂无数据"}})],2):e(n,{staticClass:"px-[20%] my-[8rem]",attrs:{data:a.productData}})],1)}),[],!1,null,"9ea9cfa4",null,null).exports)}}}))}();
