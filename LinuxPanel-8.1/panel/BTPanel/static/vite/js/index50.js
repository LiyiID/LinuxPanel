import{_ as t}from"./index77.js?v=1714377894636";import{_ as o}from"./preload-helper.js?v=1714377894636";import{e,b as m,h as p,j as i}from"./vue-lib.js?v=1714377894636";import{g as a}from"./site.store.js?v=1714377894636";import r from"./DomainManage.js?v=1714377894636";import{n as s}from"./main.js?v=1714377894636";import"./element-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./index42.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./check.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./index85.js?v=1714377894636";import"./index53.js?v=1714377894636";import"./index39.js?v=1714377894636";import"./index59.js?v=1714377894636";import"./confirm.js?v=1714377894636";import"./config.js?v=1714377894636";import"./site.popup.js?v=1714377894636";import"./index38.js?v=1714377894636";import"./index45.js?v=1714377894636";import"./element-ui.common.js?v=1714377894636";import"./date-util.js?v=1714377894636";import"./vdom.js?v=1714377894636";import"./index62.js?v=1714377894636";import"./cascader-panel.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";const c=s(e({__name:"index",props:{compData:{default:{row:()=>{},name:""}}},setup(t){const e=t,{proxy:s}=i(),{refs:{siteInfo:c}}=a(),n=m(e.compData.name||"domain"),_=m([{title:"域名管理",type:"domain",compData:e.compData.row,component:r},{title:"子目录绑定",type:"subdirectory",compData:e.compData.row,component:()=>o((()=>import("./SubdirectoryBind.js?v=1714377894636")),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]),import.meta.url)},{title:"网站目录",type:"siteDirectory",compData:{...e.compData.row,tabName:e.compData.childrenName},component:()=>o((()=>import("./SiteCataluge.js?v=1714377894636")),__vite__mapDeps([31,32,10,3,2,9,4,5,6,7,8,33,34,11,18,35,36,37,25,12,19,20,21,22,38]),import.meta.url)},{title:"访问限制",type:"accessRestriction",compData:e.compData.row,component:()=>o((()=>import("./AccessRestriction.js?v=1714377894636")),__vite__mapDeps([39,1,2,3,4,5,6,7,8,9,10,33,40,32,34,41,18,35,36,15,16,42,43,44,45,46,37,47,17,21,22,19,20,13,14,12,48,23,24,25,26,27,28,29,30]),import.meta.url)},{title:"流量限制",type:"limit",compData:{...e.compData.row,tabName:e.compData.childrenName},component:()=>o((()=>import("./SiteFlowLimit.js?v=1714377894636")),__vite__mapDeps([49,4,5,2,3,6,7,8,9,10,50,51,20,35,18,12,52,45,36,53,15,16,17,25,40,33,32,34,37,21,22,54,19]),import.meta.url)},{title:"伪静态",type:"pseudoStatic",compData:e.compData.row,component:()=>o((()=>import("./PseudoStatic2.js?v=1714377894636")),__vite__mapDeps([55,18,4,5,2,3,6,7,8,9,10,35,36,1,11,12,21,22]),import.meta.url)},{title:"默认文档",type:"defaultDocument",compData:e.compData.row,component:()=>o((()=>import("./DefaultContent.js?v=1714377894636")),__vite__mapDeps([56,1,2,3,4,5,6,7,8,9,10,18,21,22]),import.meta.url)},{title:"配置文件",type:"configurationFile",compData:e.compData.row,component:()=>o((()=>import("./ConfigurationFile.js?v=1714377894636")),__vite__mapDeps([57,11,6,7,3,2,4,5,8,9,10,15,16,1,25,21,22,19,20]),import.meta.url)},{title:"SSL",type:"ssl",compData:e.compData.row,component:()=>o((()=>import("./index122.js?v=1714377894636")),__vite__mapDeps([58,4,5,2,3,6,7,8,9,10,59,33,32,34,53,23,24,25,26,27,28,29,30,22,21]),import.meta.url)},{title:"PHP",type:"php",compData:e.compData.row,component:()=>o((()=>import("./index123.js?v=1714377894636")),__vite__mapDeps([60,4,5,2,3,6,7,8,9,10,40,1,61,53,37,18,62,12,21,22,38]),import.meta.url)},{title:"重定向",type:"redirect",compData:e.compData.row,component:()=>o((()=>import("./RedirectSite.js?v=1714377894636")),__vite__mapDeps([63,4,5,2,3,6,7,8,9,10,18,35,12,46,37,47,36,11,13,14,15,16,64,17,24,25,21,22,48,19,20]),import.meta.url)},{title:"反向代理",type:"proxy",compData:e.compData.row,component:()=>o((()=>import("./ReverseProxy.js?v=1714377894636")),__vite__mapDeps([65,4,5,2,3,6,7,8,9,10,11,1,18,35,46,37,47,36,13,14,15,16,12,17,19,20,24,25,21,22,48,23,26,27,28,29,30]),import.meta.url)},{title:"防盗链",type:"antiLeech",compData:e.compData.row,component:()=>o((()=>import("./HotlinkProtection.js?v=1714377894636")),__vite__mapDeps([66,1,2,3,4,5,6,7,8,9,10,21,22,67,35,18,36]),import.meta.url)},{title:"防篡改",type:"antiTamper",compData:e.compData.row,component:()=>o((()=>import("./TamperProof.js?v=1714377894636")),__vite__mapDeps([68,4,5,2,3,6,7,8,9,10,40,38,21,22]),import.meta.url)},{title:"网站安全",type:"siteSecurity",compData:e.compData.row,component:()=>o((()=>import("./index124.js?v=1714377894636")),__vite__mapDeps([69,32,10,3,2,9,4,5,6,7,8,33,34,41,25,21,22]),import.meta.url)},{title:"网站日志",type:"siteLog",compData:{...e.compData.row,tabName:e.compData.childrenName},component:()=>o((()=>import("./SiteLogs.js?v=1714377894636")),__vite__mapDeps([70,4,5,2,3,6,7,8,9,10,71,1,72,15,16,17,73,33,74,50,51,20,35,18,36,46,37,47,14,32,34,21,22,19]),import.meta.url)},{title:"网站告警",type:"siteAlarm",compData:e.compData.row,component:()=>o((()=>import("./DialingTestAlarm.js?v=1714377894636")),__vite__mapDeps([75,15,10,3,2,9,4,5,6,7,8,16,50,51,20,35,18,12,44,45,36,53,72,64,17,46,37,47,19,38,24,25,21,22]),import.meta.url)},{title:"其他设置",type:"otherSettings",compData:e.compData.row,component:()=>o((()=>import("./OtherSettings.js?v=1714377894636")),__vite__mapDeps([76,18,4,5,2,3,6,7,8,9,10,35,51,36,15,16,64,17,33,46,37,47,40,12,32,34,19,20,22,38,24,25,21]),import.meta.url)}]);return p((()=>{c.value=e.compData.row})),{__sfc:!0,vm:s,props:e,siteInfo:c,defaultActive:n,tabComponent:_}}}),(function(){var o=this._self._c,e=this._self._setupProxy;return o(t,{staticClass:"w-full h-full",attrs:{type:"left",config:e.tabComponent},model:{value:e.defaultActive,callback:function(t){e.defaultActive=t},expression:"defaultActive"}})}),[],!1,null,"7db57aa2",null,null).exports;export{c as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./SubdirectoryBind.js?v=1714377894636","./index118.js?v=1714377894636","./vue-lib.js?v=1714377894636","./__commonjsHelpers__.js?v=1714377894636","./main.js?v=1714377894636","./modulepreload-polyfill.js?v=1714377894636","./preload-helper.js?v=1714377894636","./request-lib.js?v=1714377894636","./locales-lib.js?v=1714377894636","./public-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./index120.js?v=1714377894636","./element-lib.js?v=1714377894636","./index53.js?v=1714377894636","./element-lib.js?v=1714377894636","./index39.js?v=1714377894636","./element-lib.js?v=1714377894636","./index59.js?v=1714377894636","./index85.js?v=1714377894636","./confirm.js?v=1714377894636","./config.js?v=1714377894636","./site.store.js?v=1714377894636","./check.js?v=1714377894636","./site.popup.js?v=1714377894636","./index38.js?v=1714377894636","./index45.js?v=1714377894636","./element-ui.common.js?v=1714377894636","./date-util.js?v=1714377894636","./vdom.js?v=1714377894636","./index62.js?v=1714377894636","./cascader-panel.js?v=1714377894636","./SiteCataluge.js?v=1714377894636","./index77.js?v=1714377894636","./element-lib.js?v=1714377894636","./index42.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./software2.js?v=1714377894636","./AccessRestriction.js?v=1714377894636","./index60.js?v=1714377894636","./index51.js?v=1714377894636","./index57.js?v=1714377894636","./element-lib.js?v=1714377894636","./radio-button.js?v=1714377894636","./element-lib.js?v=1714377894636","./index46.js?v=1714377894636","./index.vue_vue_type_style_index_0_lang.js?v=1714377894636","./index61.js?v=1714377894636","./SiteFlowLimit.js?v=1714377894636","./index40.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./TotalLimit.js?v=1714377894636","./PseudoStatic2.js?v=1714377894636","./DefaultContent.js?v=1714377894636","./ConfigurationFile.js?v=1714377894636","./index122.js?v=1714377894636","./index43.js?v=1714377894636","./index123.js?v=1714377894636","./index76.js?v=1714377894636","./index41.js?v=1714377894636","./RedirectSite.js?v=1714377894636","./index55.js?v=1714377894636","./ReverseProxy.js?v=1714377894636","./HotlinkProtection.js?v=1714377894636","./HotlinkProtectionForm.js?v=1714377894636","./TamperProof.js?v=1714377894636","./index124.js?v=1714377894636","./SiteLogs.js?v=1714377894636","./WebLogAnalysis.js?v=1714377894636","./index52.js?v=1714377894636","./logs.table.js?v=1714377894636","./index135.js?v=1714377894636","./DialingTestAlarm.js?v=1714377894636","./OtherSettings.js?v=1714377894636"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
