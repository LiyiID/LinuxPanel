System.register(["./main-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636"],(function(t,l){"use strict";var a,i,s,e,d,o;return{setters:[function(t){a=t.f,i=t.n,s=t.a},function(t){e=t.e,d=t.b,o=t.h},null,null,null,null,null,null,null],execute:function(){t("default",i(e({__name:"SafeLogDetailDialog",props:{compData:{default:function(){return{data:{},addIPWhite:function(){},addURLWhite:function(){}}}}},setup:function(t){var l=t,i=d({});return o((function(){i.value=l.compData.data})),{__sfc:!0,props:l,logDetail:i,formatTime:a}}}),(function(){var t,l,a,i,e=this,d=e._self._c,o=e._self._setupProxy;return d("div",{staticClass:"p-16x"},[d("div",{staticClass:"flex flex-col border border-[#dddddd]"},[d("div",{staticClass:"flex h-[3rem] items-center border-[#dddddd] border-b px-[1rem]"},[d("div",{staticClass:"item"},[d("div",{staticClass:"title"},[e._v("时间")]),d("div",{staticClass:"w-[22rem]"},[e._v(e._s(o.formatTime(o.logDetail.addtime||0)))])]),d("div",{staticClass:"item"},[d("div",{staticClass:"title"},[e._v("用户IP")]),d(s,{attrs:{title:"加入白名单"},on:{click:function(t){return o.props.compData.addIPWhite(o.props.compData.data)}}},[e._v(e._s(o.logDetail.address))])],1)]),d("div",{staticClass:"flex h-[3rem] items-center px-[1rem]"},[d("div",{staticClass:"item"},[d("div",{staticClass:"title"},[e._v("触发函数")]),d("div",{staticClass:"w-[22rem]"},[e._v(e._s(o.logDetail.fun_name||""))])]),d("div",{staticClass:"item"},[d("div",{staticClass:"title"},[e._v("过滤器")]),d("div",[e._v(e._s(o.logDetail.intercept||""))])])])]),d("div",{staticClass:"s-title"},[e._v("URL地址")]),d("div",{staticClass:"con-box"},[e._v(e._s(o.logDetail.url))]),d("div",{staticClass:"s-title"},[e._v("User-Agent")]),d("div",{staticClass:"con-box"},[e._v(" "+e._s((null===(t=o.logDetail.data_info)||void 0===t||null===(t=t.data)||void 0===t||null===(t=t.request)||void 0===t?void 0:t.headers["user-agent"])||"")+" ")]),d("div",{staticClass:"s-title"},[e._v(" 传入值 "),d(s,{on:{click:function(t){return o.props.compData.addURLWhite(o.props.compData.data)}}},[e._v("URL加白")])],1),d("div",{staticClass:"con-box"},[e._v(e._s((null===(l=o.logDetail.data_info)||void 0===l||null===(l=l.data)||void 0===l||null===(l=l.args)||void 0===l?void 0:l.join("\n"))||""))]),d("div",{staticClass:"s-title"},[e._v("调用栈")]),d("div",{staticClass:"con-box"},[e._v(e._s((null===(a=o.logDetail.data_info)||void 0===a||null===(a=a.data)||void 0===a||null===(a=a.stack_trace)||void 0===a?void 0:a.join("\n"))||""))]),"move_uploaded_file"===o.logDetail.fun_name?[d("div",{staticClass:"s-title"},[e._v("风险文件")]),d("div",{staticClass:"con-box"},[e._v(e._s((null===(i=o.logDetail.data_info)||void 0===i?void 0:i.filename)||""))])]:e._e()],2)}),[],!1,null,"ccd727fd",null,null).exports)}}}));
