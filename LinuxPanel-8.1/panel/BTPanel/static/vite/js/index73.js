import{_ as t}from"./index77.js?v=1714377894636";import{_ as o}from"./preload-helper.js?v=1714377894636";import{e,b as p,j as m}from"./vue-lib.js?v=1714377894636";import i from"./DomainManage.js?v=1714377894636";import{n as r}from"./main.js?v=1714377894636";import"./element-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./index42.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./index85.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./index53.js?v=1714377894636";import"./index39.js?v=1714377894636";import"./index59.js?v=1714377894636";import"./confirm.js?v=1714377894636";import"./config.js?v=1714377894636";import"./site.store.js?v=1714377894636";import"./check.js?v=1714377894636";import"./site.popup.js?v=1714377894636";import"./index38.js?v=1714377894636";import"./index45.js?v=1714377894636";import"./element-ui.common.js?v=1714377894636";import"./date-util.js?v=1714377894636";import"./vdom.js?v=1714377894636";import"./index62.js?v=1714377894636";import"./cascader-panel.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";const a=r(e({__name:"index",props:{compData:{default:{row:()=>{},name:""}}},setup(t){const e=t,{proxy:r}=m();return{__sfc:!0,vm:r,props:e,defaultActive:p(e.compData.name||"domain"),tabComponent:p([{title:"域名管理",type:"domain",compData:{...e.compData.row,project_type:"phpasync"},component:i},{title:"SSL",type:"ssl",compData:e.compData.row,component:()=>o((()=>import("./index122.js?v=1714377894636")),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]),import.meta.url)},{title:"反向代理",type:"proxy",compData:{...e.compData.row,project_type:"phpasync"},component:()=>o((()=>import("./ReverseProxy.js?v=1714377894636")),__vite__mapDeps([25,1,2,3,4,5,6,7,8,9,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,16,17,24,23,42,15,18,19,20,21,22]),import.meta.url)},{title:"项目管理",type:"project",compData:e.compData.row,component:()=>o((()=>import("./ProjectManage.js?v=1714377894636")),__vite__mapDeps([43,1,2,3,4,5,6,7,8,9,29,38,28,30,31,32,33,17,44,40,41,24,23]),import.meta.url)},{title:"版本管理",type:"version",compData:e.compData.row,component:()=>o((()=>import("./index125.js?v=1714377894636")),__vite__mapDeps([45,28,1,2,3,4,5,6,7,8,9,29,33,36,37,46,47,17,39,48,21,49,35,16,24,23]),import.meta.url)},{title:"伪静态",type:"pseudoStatic",compData:{...e.compData.row,project_type:"phpasync"},component:()=>o((()=>import("./PseudoStatic2.js?v=1714377894636")),__vite__mapDeps([50,28,1,2,3,4,5,6,7,8,9,29,33,27,26,38,24,23]),import.meta.url)},{title:"配置文件",type:"configurationFile",compData:e.compData.row,component:()=>o((()=>import("./index126.js?v=1714377894636")),__vite__mapDeps([51,12,9,4,3,8,1,2,5,6,7,11,13,24,23]),import.meta.url)},{title:"计划任务",type:"crontab",compData:e.compData.row,component:()=>o((()=>import("./index127.js?v=1714377894636")),__vite__mapDeps([52,34,9,4,3,8,1,2,5,6,7,35,36,37,38,46,47,17,39,16,15,18,19,20,21,22,23,24,42]),import.meta.url)},{title:"日志",type:"log",compData:e.compData.row,component:()=>o((()=>import("./index128.js?v=1714377894636")),__vite__mapDeps([53,12,9,4,3,8,1,2,5,6,7,11,13]),import.meta.url)}])}}}),(function(){var o=this._self._c,e=this._self._setupProxy;return o(t,{staticClass:"w-full h-full",attrs:{type:"left",config:e.tabComponent},model:{value:e.defaultActive,callback:function(t){e.defaultActive=t},expression:"defaultActive"}})}),[],!1,null,"55ee3c09",null,null).exports;export{a as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./index122.js?v=1714377894636","./main.js?v=1714377894636","./modulepreload-polyfill.js?v=1714377894636","./vue-lib.js?v=1714377894636","./__commonjsHelpers__.js?v=1714377894636","./preload-helper.js?v=1714377894636","./request-lib.js?v=1714377894636","./locales-lib.js?v=1714377894636","./public-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./index43.js?v=1714377894636","./element-lib.js?v=1714377894636","./index77.js?v=1714377894636","./index42.js?v=1714377894636","./element-lib.js?v=1714377894636","./site.popup.js?v=1714377894636","./index38.js?v=1714377894636","./index45.js?v=1714377894636","./element-ui.common.js?v=1714377894636","./date-util.js?v=1714377894636","./vdom.js?v=1714377894636","./index62.js?v=1714377894636","./cascader-panel.js?v=1714377894636","./check.js?v=1714377894636","./site.store.js?v=1714377894636","./ReverseProxy.js?v=1714377894636","./index120.js?v=1714377894636","./index118.js?v=1714377894636","./index85.js?v=1714377894636","./element-lib.js?v=1714377894636","./index46.js?v=1714377894636","./element-lib.js?v=1714377894636","./index.vue_vue_type_style_index_0_lang.js?v=1714377894636","./element-lib.js?v=1714377894636","./index53.js?v=1714377894636","./element-lib.js?v=1714377894636","./index39.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./index59.js?v=1714377894636","./confirm.js?v=1714377894636","./config.js?v=1714377894636","./index61.js?v=1714377894636","./ProjectManage.js?v=1714377894636","./ServiceStatus.js?v=1714377894636","./index125.js?v=1714377894636","./index58.js?v=1714377894636","./element-lib.js?v=1714377894636","./upload.js?v=1714377894636","./index119.js?v=1714377894636","./PseudoStatic2.js?v=1714377894636","./index126.js?v=1714377894636","./index127.js?v=1714377894636","./index128.js?v=1714377894636"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
