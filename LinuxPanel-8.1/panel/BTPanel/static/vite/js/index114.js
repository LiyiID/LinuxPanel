import{_ as e}from"./index39.js?v=1714377894636";import{l as t,n as a,q as o}from"./main.js?v=1714377894636";import{_ as s}from"./index59.js?v=1714377894636";import{_ as i}from"./preload-helper.js?v=1714377894636";import{e as r,h as n,j as l}from"./vue-lib.js?v=1714377894636";import{ai as m}from"./config.api.js?v=1714377894636";import{a as p}from"./config.table.js?v=1714377894636";import{getConfigStore as c}from"./config.store.js?v=1714377894636";import"./element-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./index38.js?v=1714377894636";import"./index45.js?v=1714377894636";const u=a(r({__name:"index",emits:["close"],setup(e,{emit:a}){const{proxy:o}=l(),{refs:{uaTableData:s},getLimitUaInfo:r}=c(),u=async e=>{t({title:e?"编辑User-Agent":"添加User-Agent",component:()=>i((()=>import("./editUa.js?v=1714377894636")),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]),import.meta.url),isAsync:!0,area:50,showFooter:!0,compData:e||""})},f=async e=>{try{const t=await m({id:e.id});o.$message.request(t),r()}catch(t){}},d=p({editRow:u,deleteRow:f});return n((()=>{r()})),{__sfc:!0,vm:o,uaTableData:s,getLimitUaInfo:r,emit:a,editRow:u,deleteRow:f,tableColumn:d}}}),(function(){var t=this,a=t._self._c,i=t._self._setupProxy;return a("div",{staticClass:"px-[2rem]"},[a(s,{staticClass:"py-20x",scopedSlots:t._u([{key:"header-left",fn:function(){return[a(o,{on:{click:function(e){return i.editRow()}}},[t._v("添加User-Agent")])]},proxy:!0},{key:"content",fn:function(){return[a(e,{directives:[{name:"loading",rawName:"v-loading",value:i.uaTableData.loading,expression:"uaTableData.loading"}],ref:"uaTable",attrs:{column:i.tableColumn,data:i.uaTableData.list,description:"User-Agent列表为空","max-height":400,"element-loading-text":"正在加载User-Agent列表，请稍后..."}})]},proxy:!0}])})],1)}),[],!1,null,"ee5faef3",null,null).exports;export{u as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./editUa.js?v=1714377894636","./index85.js?v=1714377894636","./main.js?v=1714377894636","./modulepreload-polyfill.js?v=1714377894636","./vue-lib.js?v=1714377894636","./__commonjsHelpers__.js?v=1714377894636","./preload-helper.js?v=1714377894636","./request-lib.js?v=1714377894636","./locales-lib.js?v=1714377894636","./public-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./config.api.js?v=1714377894636","./confirm.js?v=1714377894636","./config.js?v=1714377894636","./config.store.js?v=1714377894636"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
