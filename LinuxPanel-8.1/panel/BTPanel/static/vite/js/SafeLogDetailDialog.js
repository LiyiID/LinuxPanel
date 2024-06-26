import{f as t,n as s,a}from"./main.js?v=1714377894636";import{e as i,b as l,h as e}from"./vue-lib.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./element-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";const o=s(i({__name:"SafeLogDetailDialog",props:{compData:{default:()=>({data:{},addIPWhite:()=>{},addURLWhite:()=>{}})}},setup(s){const a=s,i=l({});return e((()=>{i.value=a.compData.data})),{__sfc:!0,props:a,logDetail:i,formatTime:t}}}),(function(){var t,s,i,l,e,o,d,r,v,c,n=this,_=n._self._c,m=n._self._setupProxy;return _("div",{staticClass:"p-16x"},[_("div",{staticClass:"flex flex-col border border-[#dddddd]"},[_("div",{staticClass:"flex h-[3rem] items-center border-[#dddddd] border-b px-[1rem]"},[_("div",{staticClass:"item"},[_("div",{staticClass:"title"},[n._v("时间")]),_("div",{staticClass:"w-[22rem]"},[n._v(n._s(m.formatTime(m.logDetail.addtime||0)))])]),_("div",{staticClass:"item"},[_("div",{staticClass:"title"},[n._v("用户IP")]),_(a,{attrs:{title:"加入白名单"},on:{click:function(t){return m.props.compData.addIPWhite(m.props.compData.data)}}},[n._v(n._s(m.logDetail.address))])],1)]),_("div",{staticClass:"flex h-[3rem] items-center px-[1rem]"},[_("div",{staticClass:"item"},[_("div",{staticClass:"title"},[n._v("触发函数")]),_("div",{staticClass:"w-[22rem]"},[n._v(n._s(m.logDetail.fun_name||""))])]),_("div",{staticClass:"item"},[_("div",{staticClass:"title"},[n._v("过滤器")]),_("div",[n._v(n._s(m.logDetail.intercept||""))])])])]),_("div",{staticClass:"s-title"},[n._v("URL地址")]),_("div",{staticClass:"con-box"},[n._v(n._s(m.logDetail.url))]),_("div",{staticClass:"s-title"},[n._v("User-Agent")]),_("div",{staticClass:"con-box"},[n._v(" "+n._s((null==(i=null==(s=null==(t=m.logDetail.data_info)?void 0:t.data)?void 0:s.request)?void 0:i.headers["user-agent"])||"")+" ")]),_("div",{staticClass:"s-title"},[n._v(" 传入值 "),_(a,{on:{click:function(t){return m.props.compData.addURLWhite(m.props.compData.data)}}},[n._v("URL加白")])],1),_("div",{staticClass:"con-box"},[n._v(n._s((null==(o=null==(e=null==(l=m.logDetail.data_info)?void 0:l.data)?void 0:e.args)?void 0:o.join("\n"))||""))]),_("div",{staticClass:"s-title"},[n._v("调用栈")]),_("div",{staticClass:"con-box"},[n._v(n._s((null==(v=null==(r=null==(d=m.logDetail.data_info)?void 0:d.data)?void 0:r.stack_trace)?void 0:v.join("\n"))||""))]),"move_uploaded_file"===m.logDetail.fun_name?[_("div",{staticClass:"s-title"},[n._v("风险文件")]),_("div",{staticClass:"con-box"},[n._v(n._s((null==(c=m.logDetail.data_info)?void 0:c.filename)||""))])]:n._e()],2)}),[],!1,null,"ccd727fd",null,null).exports;export{o as default};
