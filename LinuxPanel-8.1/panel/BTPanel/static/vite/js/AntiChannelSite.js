import{_ as e}from"./index118.js?v=1714377894636";import{_ as s}from"./index46.js?v=1714377894636";import{e as t,b as a,h as l,j as i}from"./vue-lib.js?v=1714377894636";import{dC as o,dD as n}from"./site.store.js?v=1714377894636";import{n as r}from"./main.js?v=1714377894636";import"./element-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./index.vue_vue_type_style_index_0_lang.js?v=1714377894636";import"./check.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";const p=r(t({__name:"AntiChannelSite",setup(e){const{proxy:s}=i(),t=a([{text:"开启后可以解决HTTPS窜站的问题"},{text:"不支持IP证书的防窜，直接使用IP访问的勿开"}]),r=a(),p=a(!1),m=async()=>{p.value=!0;try{const{data:e}=await o();r.value=e}catch(e){}finally{p.value=!1}};return l((()=>{m()})),{__sfc:!0,vm:s,helpList:t,httpsValue:r,viewLoading:p,getHttpsData:m,handleChange:async e=>{let t=s.$load("正在设置，请稍后...");try{const t=await n();s.$message.request(t),r.value=e}catch(a){}finally{t.close()}}}}}),(function(){var t=this,a=t._self._c,l=t._self._setupProxy;return a("div",{directives:[{name:"loading",rawName:"v-loading",value:l.viewLoading,expression:"viewLoading"}],staticClass:"p-20x"},[a("span",{staticClass:"mr-12x"},[t._v("HTTPS防窜站")]),a(s,{on:{change:l.handleChange},model:{value:l.httpsValue,callback:function(e){l.httpsValue=e},expression:"httpsValue"}}),a(e,{staticClass:"ml-20x my-20x",attrs:{"list-style":"disc",list:l.helpList}})],1)}),[],!1,null,"de9a4acd",null,null).exports;export{p as default};