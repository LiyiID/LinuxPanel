System.register(["./vue-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636"],(function(t,e){"use strict";var l,s,a,r;return{setters:[function(t){l=t.e,s=t.j},function(t){a=t.f,r=t.n},null,null,null,null,null,null,null],execute:function(){t("default",r(l({__name:"XtermDetail",props:{compData:{default:function(){return{}}}},setup:function(t){var e=t;return{__sfc:!0,vm:s().proxy,props:e,formatTime:a}}}),(function(){var t=this,e=t._self._c,l=t._self._setupProxy;return e("div",{staticClass:"flex flex-col p-16x lib-box"},[e("table",{staticClass:"border-[#ddd] border-1"},[e("tbody",[e("tr",[e("th",[t._v("登录用户")]),e("td",[t._v(t._s(t.compData.ssh_user))])]),e("tr",[e("th",[t._v("主机IP")]),e("td",[t._v(t._s(t.compData.server_ip))]),e("th",[t._v("客户端IP")]),e("td",[t._v(t._s(t.compData.addr))])]),e("tr",[e("th",[t._v("连接时间")]),e("td",[t._v(t._s(l.formatTime(t.compData.login_time)))]),e("th",[t._v("关闭时间")]),e("td",[t._v(t._s(l.formatTime(t.compData.close_time)))])])])]),e("div",{staticClass:"mt-20x"},[e("div",{staticClass:"font-bold"},[t._v("User-Agent")]),e("div",{staticClass:"lib-con"},[t._v(t._s(t.compData.user_agent))])])])}),[],!1,null,"5cc9414c",null,null).exports)}}}));
