!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}function n(t){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?e(Object(r),!0).forEach((function(e){o(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):e(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function o(e,n,o){var r;return r=function(e,n){if("object"!=t(e)||!e)return e;var o=e[Symbol.toPrimitive];if(void 0!==o){var r=o.call(e,n||"default");if("object"!=t(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===n?String:Number)(e)}(n,"string"),(n="symbol"==t(r)?r:String(r))in e?Object.defineProperty(e,n,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[n]=o,e}System.register(["./index-legacy77.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./site.store-legacy.js?v=1714377894636","./DomainManage-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./tabs-legacy.js?v=1714377894636","./index-legacy42.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./index-legacy85.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./form-legacy.js?v=1714377894636","./index-legacy53.js?v=1714377894636","./progress-legacy.js?v=1714377894636","./index-legacy39.js?v=1714377894636","./empty-legacy.js?v=1714377894636","./select-legacy.js?v=1714377894636","./index-legacy59.js?v=1714377894636","./confirm-legacy.js?v=1714377894636","./config-legacy.js?v=1714377894636","./site.popup-legacy.js?v=1714377894636","./index-legacy38.js?v=1714377894636","./index-legacy45.js?v=1714377894636","./element-ui.common-legacy.js?v=1714377894636","./date-util-legacy.js?v=1714377894636","./vdom-legacy.js?v=1714377894636","./index-legacy62.js?v=1714377894636","./cascader-panel-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636"],(function(t,e){"use strict";var o,r,c,a,i,l,u,m,p;return{setters:[function(t){o=t._},function(t){r=t._},function(t){c=t.e,a=t.b,i=t.h,l=t.j},function(t){u=t.g},function(t){m=t.default},function(t){p=t.n},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],execute:function(){t("default",p(c({__name:"index",props:{compData:{default:{row:function(){},name:""}}},setup:function(t){var o=t,c=l().proxy,p=u().refs.siteInfo,s=a(o.compData.name||"domain"),y=a([{title:"域名管理",type:"domain",compData:o.compData.row,component:m},{title:"子目录绑定",type:"subdirectory",compData:o.compData.row,component:function(){return r((function(){return e.import("./SubdirectoryBind-legacy.js?v=1714377894636")}),void 0,e.meta.url)}},{title:"网站目录",type:"siteDirectory",compData:n(n({},o.compData.row),{},{tabName:o.compData.childrenName}),component:function(){return r((function(){return e.import("./SiteCataluge-legacy.js?v=1714377894636")}),void 0,e.meta.url)}},{title:"访问限制",type:"accessRestriction",compData:o.compData.row,component:function(){return r((function(){return e.import("./AccessRestriction-legacy.js?v=1714377894636")}),void 0,e.meta.url)}},{title:"流量限制",type:"limit",compData:n(n({},o.compData.row),{},{tabName:o.compData.childrenName}),component:function(){return r((function(){return e.import("./SiteFlowLimit-legacy.js?v=1714377894636")}),void 0,e.meta.url)}},{title:"伪静态",type:"pseudoStatic",compData:o.compData.row,component:function(){return r((function(){return e.import("./PseudoStatic-legacy2.js?v=1714377894636")}),void 0,e.meta.url)}},{title:"默认文档",type:"defaultDocument",compData:o.compData.row,component:function(){return r((function(){return e.import("./DefaultContent-legacy.js?v=1714377894636")}),void 0,e.meta.url)}},{title:"配置文件",type:"configurationFile",compData:o.compData.row,component:function(){return r((function(){return e.import("./ConfigurationFile-legacy.js?v=1714377894636")}),void 0,e.meta.url)}},{title:"SSL",type:"ssl",compData:o.compData.row,component:function(){return r((function(){return e.import("./index-legacy122.js?v=1714377894636")}),void 0,e.meta.url)}},{title:"PHP",type:"php",compData:o.compData.row,component:function(){return r((function(){return e.import("./index-legacy123.js?v=1714377894636")}),void 0,e.meta.url)}},{title:"重定向",type:"redirect",compData:o.compData.row,component:function(){return r((function(){return e.import("./RedirectSite-legacy.js?v=1714377894636")}),void 0,e.meta.url)}},{title:"反向代理",type:"proxy",compData:o.compData.row,component:function(){return r((function(){return e.import("./ReverseProxy-legacy.js?v=1714377894636")}),void 0,e.meta.url)}},{title:"防盗链",type:"antiLeech",compData:o.compData.row,component:function(){return r((function(){return e.import("./HotlinkProtection-legacy.js?v=1714377894636")}),void 0,e.meta.url)}},{title:"防篡改",type:"antiTamper",compData:o.compData.row,component:function(){return r((function(){return e.import("./TamperProof-legacy.js?v=1714377894636")}),void 0,e.meta.url)}},{title:"网站安全",type:"siteSecurity",compData:o.compData.row,component:function(){return r((function(){return e.import("./index-legacy124.js?v=1714377894636")}),void 0,e.meta.url)}},{title:"网站日志",type:"siteLog",compData:n(n({},o.compData.row),{},{tabName:o.compData.childrenName}),component:function(){return r((function(){return e.import("./SiteLogs-legacy.js?v=1714377894636")}),void 0,e.meta.url)}},{title:"网站告警",type:"siteAlarm",compData:o.compData.row,component:function(){return r((function(){return e.import("./DialingTestAlarm-legacy.js?v=1714377894636")}),void 0,e.meta.url)}},{title:"其他设置",type:"otherSettings",compData:o.compData.row,component:function(){return r((function(){return e.import("./OtherSettings-legacy.js?v=1714377894636")}),void 0,e.meta.url)}}]);return i((function(){p.value=o.compData.row})),{__sfc:!0,vm:c,props:o,siteInfo:p,defaultActive:s,tabComponent:y}}}),(function(){var t=this._self._c,e=this._self._setupProxy;return t(o,{staticClass:"w-full h-full",attrs:{type:"left",config:e.tabComponent},model:{value:e.defaultActive,callback:function(t){e.defaultActive=t},expression:"defaultActive"}})}),[],!1,null,"7db57aa2",null,null).exports)}}}))}();
