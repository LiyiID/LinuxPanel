import{n as t,a as e}from"./main.js?v=1714377894636";import{_ as a}from"./index109.js?v=1714377894636";import{w as s,x as i,B as l,o as n,_ as o}from"./element-lib.js?v=1714377894636";import{e as r,v as m,b as p,j as c}from"./vue-lib.js?v=1714377894636";import{d as f,af as d}from"./config.api.js?v=1714377894636";import{getConfigStore as u}from"./config.store.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";const v=t(r({__name:"config",setup(t){const{proxy:e}=c(),{refs:{panelConfig:a}}=u(),s=m({token:"",limit_addr:""}),i=p(!1),l=p("正在获取API配置，请稍候..."),n=async()=>{i.value=!0,l.value="正在重置密钥，请稍候...";try{const{data:t}=await f({t_type:1});t.status?s.token=t.msg:e.$message.request(t)}finally{i.value=!1}},o=async()=>{i.value=!0;try{const{data:t}=await d();s.token=t.token,s.limit_addr=t.limit_addr,i.value=!1}finally{i.value=!1}};return o(),{__sfc:!0,vm:e,panelConfig:a,form:s,load:i,loadTitle:l,onChange:async()=>{i.value=!0,l.value="正在设置API配置，请稍候...";try{const{data:t}=await f({t_type:2});e.$message.request(t),t.status&&(a.value.apiInterface=!a.value.apiInterface)}finally{i.value=!1}},onReset:async()=>{try{await e.$confirm({icon:"warning",title:"重置密钥",useHtml:!0,message:'\n\t\t\t<p class="text-[1.4rem] leading-10">'.concat(e.$t("Config.Api.ResetKey"),'</p>\n\t\t\t<p class="text-[1.4rem] leading-10 text-danger">\n\t\t\t\t').concat(e.$t("Config.Api.ResetKeyReminder"),"\n\t\t\t</p>\n\t\t")}),n()}catch(t){}},resetKey:n,onSave:async()=>{i.value=!0,l.value="正在设置API配置，请稍候...";try{const{data:t}=await f({t_type:3,limit_addr:s.limit_addr});e.$message.request(t)}finally{i.value=!1}},getConfig:o}}}),(function(){var t=this,r=t._self._c,m=t._self._setupProxy;return r("div",{directives:[{name:"bt-loading",rawName:"v-bt-loading",value:m.load,expression:"load"},{name:"bt-loading",rawName:"v-bt-loading:title",value:m.loadTitle,expression:"loadTitle",arg:"title"}],staticClass:"p-[2.5rem]"},[r(s,[r(i,{attrs:{label:t.$t("Config.Api.ApiInterface")}},[r(l,{attrs:{value:m.panelConfig.apiInterface},on:{change:m.onChange}})],1),r(i,{attrs:{label:t.$t("Config.Api.InterfaceKey")}},[r("div",{staticClass:"w-[30rem]"},[r(n,{attrs:{type:"text",readOnly:!0},scopedSlots:t._u([{key:"suffix",fn:function(){return[r(o,{attrs:{type:"primary",size:"mini"},on:{click:m.onReset}},[t._v(" "+t._s(t.$t("Config.reset"))+" ")])]},proxy:!0}]),model:{value:m.form.token,callback:function(e){t.$set(m.form,"token",e)},expression:"form.token"}})],1)]),r(i,{scopedSlots:t._u([{key:"label",fn:function(){return[r("div",{staticClass:"py-8px leading-[1.4]"},[r("div",{staticClass:"pr-6px"},[t._v(t._s(t.$t("Config.Api.IPWhiteList")))]),r("div",[t._v("(每行一个)")])])]},proxy:!0}])},[r("div",{staticClass:"w-[30rem]"},[r(n,{attrs:{type:"textarea",resize:"none",autosize:{minRows:4,maxRows:4}},model:{value:m.form.limit_addr,callback:function(e){t.$set(m.form,"limit_addr",e)},expression:"form.limit_addr"}})],1)]),r(i,{attrs:{label:" "}},[r(o,{attrs:{type:"primary"},on:{click:m.onSave}},[t._v("保存")])],1)],1),r(a,{staticClass:"mt-20px"},[r("li",{staticClass:"text-medium h-[2.4rem]"},[t._v(t._s(t.$t("Config.Api.Info1")))]),r("li",{staticClass:"text-danger h-[2.4rem]"},[t._v(t._s(t.$t("Config.Api.Info2")))]),r("li",{staticClass:"text-medium h-[2.4rem]"},[t._v(" "+t._s(t.$t("Config.Api.Info3"))+" "),r(e,{attrs:{href:"https://www.bt.cn/bbs/thread-20376-1-1.html"}},[t._v(" https://www.bt.cn/bbs/thread-20376-1-1.html ")])],1)])],1)}),[],!1,null,null,null,null).exports;export{v as default};