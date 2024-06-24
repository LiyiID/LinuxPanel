import{_ as t}from"./index77.js?v=1714377894636";import{_ as o}from"./preload-helper.js?v=1714377894636";import{e,b as p,h as m,j as i}from"./vue-lib.js?v=1714377894636";import r from"./DomainManage.js?v=1714377894636";import{g as s}from"./site.store.js?v=1714377894636";import{n as a}from"./main.js?v=1714377894636";import"./element-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./index42.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./index85.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./index53.js?v=1714377894636";import"./index39.js?v=1714377894636";import"./index59.js?v=1714377894636";import"./confirm.js?v=1714377894636";import"./config.js?v=1714377894636";import"./site.popup.js?v=1714377894636";import"./index38.js?v=1714377894636";import"./index45.js?v=1714377894636";import"./element-ui.common.js?v=1714377894636";import"./date-util.js?v=1714377894636";import"./vdom.js?v=1714377894636";import"./index62.js?v=1714377894636";import"./cascader-panel.js?v=1714377894636";import"./check.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";const l=a(e({__name:"index",props:{compData:{default:{row:()=>{},name:""}}},setup(t){const e=t,{html:a}=i(),{refs:{siteInfo:l}}=s(),n=p(e.compData.name||"domain"),c=p([{title:"域名管理",type:"domain",compData:{...e.compData.row,project_type:"html"},component:r},{title:"流量限制",type:"limit",compData:{...e.compData.row,isConfig:!0,project_type:"html"},component:()=>o((()=>import("./TotalLimit.js?v=1714377894636")),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]),import.meta.url)},{title:"伪静态",type:"pseudo",compData:{...e.compData.row,project_type:"html"},component:()=>o((()=>import("./PseudoStatic2.js?v=1714377894636")),__vite__mapDeps([17,11,1,2,3,4,5,6,7,8,9,10,13,18,19,12,15,16]),import.meta.url)},{title:"配置文件",type:"configFile",compData:{...e.compData.row,project_type:"html"},component:()=>o((()=>import("./ConfigurationFile.js?v=1714377894636")),__vite__mapDeps([20,19,5,6,4,3,1,2,7,8,9,21,22,18,23,15,16,24,25]),import.meta.url)},{title:"重定向",type:"redirect",compData:{...e.compData.row,project_type:"html"},component:()=>o((()=>import("./RedirectSite.js?v=1714377894636")),__vite__mapDeps([26,1,2,3,4,5,6,7,8,9,11,10,12,27,28,29,13,19,30,31,21,22,32,33,34,23,15,16,35,24,25]),import.meta.url)},{title:"SSL",type:"ssl",compData:{...e.compData.row,project_type:"html"},component:()=>o((()=>import("./index122.js?v=1714377894636")),__vite__mapDeps([36,1,2,3,4,5,6,7,8,9,37,38,39,40,41,42,34,23,43,44,45,46,47,16,15]),import.meta.url)},{title:"网站日志",type:"siteLogs",compData:{...e.compData.row,project_type:"html"},component:()=>o((()=>import("./SiteLogs.js?v=1714377894636")),__vite__mapDeps([48,1,2,3,4,5,6,7,8,9,49,18,50,21,22,33,51,38,52,53,54,25,10,11,13,27,28,29,31,39,40,15,16,24]),import.meta.url)}]);return m((()=>{l.value={...e.compData.row,project_type:"html"}})),{__sfc:!0,vm:a,props:e,siteInfo:l,defaultActive:n,tabComponent:c}}}),(function(){var o=this._self._c,e=this._self._setupProxy;return o(t,{staticClass:"w-full h-full",attrs:{type:"left",config:e.tabComponent},model:{value:e.defaultActive,callback:function(t){e.defaultActive=t},expression:"defaultActive"}})}),[],!1,null,"1997de69",null,null).exports;export{l as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./TotalLimit.js?v=1714377894636","./main.js?v=1714377894636","./modulepreload-polyfill.js?v=1714377894636","./vue-lib.js?v=1714377894636","./__commonjsHelpers__.js?v=1714377894636","./preload-helper.js?v=1714377894636","./request-lib.js?v=1714377894636","./locales-lib.js?v=1714377894636","./public-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./index85.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./index60.js?v=1714377894636","./site.store.js?v=1714377894636","./check.js?v=1714377894636","./PseudoStatic2.js?v=1714377894636","./index118.js?v=1714377894636","./index120.js?v=1714377894636","./ConfigurationFile.js?v=1714377894636","./index39.js?v=1714377894636","./element-lib.js?v=1714377894636","./index45.js?v=1714377894636","./confirm.js?v=1714377894636","./config.js?v=1714377894636","./RedirectSite.js?v=1714377894636","./index46.js?v=1714377894636","./element-lib.js?v=1714377894636","./index.vue_vue_type_style_index_0_lang.js?v=1714377894636","./index53.js?v=1714377894636","./element-lib.js?v=1714377894636","./index55.js?v=1714377894636","./index59.js?v=1714377894636","./index38.js?v=1714377894636","./index61.js?v=1714377894636","./index122.js?v=1714377894636","./index43.js?v=1714377894636","./element-lib.js?v=1714377894636","./index77.js?v=1714377894636","./index42.js?v=1714377894636","./element-lib.js?v=1714377894636","./site.popup.js?v=1714377894636","./element-ui.common.js?v=1714377894636","./date-util.js?v=1714377894636","./vdom.js?v=1714377894636","./index62.js?v=1714377894636","./cascader-panel.js?v=1714377894636","./SiteLogs.js?v=1714377894636","./WebLogAnalysis.js?v=1714377894636","./index52.js?v=1714377894636","./logs.table.js?v=1714377894636","./index135.js?v=1714377894636","./index40.js?v=1714377894636","./element-lib.js?v=1714377894636"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
