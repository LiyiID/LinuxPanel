import{e as t,j as s}from"./vue-lib.js?v=1714377894636";import{f as o,n as e}from"./main.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./element-lib.js?v=1714377894636";const a=e(t({__name:"XtermDetail",props:{compData:{default:()=>({})}},setup(t){const e=t,{proxy:a}=s();return{__sfc:!0,vm:a,props:e,formatTime:o}}}),(function(){var t=this,s=t._self._c,o=t._self._setupProxy;return s("div",{staticClass:"flex flex-col p-16x lib-box"},[s("table",{staticClass:"border-[#ddd] border-1"},[s("tbody",[s("tr",[s("th",[t._v("登录用户")]),s("td",[t._v(t._s(t.compData.ssh_user))])]),s("tr",[s("th",[t._v("主机IP")]),s("td",[t._v(t._s(t.compData.server_ip))]),s("th",[t._v("客户端IP")]),s("td",[t._v(t._s(t.compData.addr))])]),s("tr",[s("th",[t._v("连接时间")]),s("td",[t._v(t._s(o.formatTime(t.compData.login_time)))]),s("th",[t._v("关闭时间")]),s("td",[t._v(t._s(o.formatTime(t.compData.close_time)))])])])]),s("div",{staticClass:"mt-20x"},[s("div",{staticClass:"font-bold"},[t._v("User-Agent")]),s("div",{staticClass:"lib-con"},[t._v(t._s(t.compData.user_agent))])])])}),[],!1,null,"5cc9414c",null,null).exports;export{a as default};
