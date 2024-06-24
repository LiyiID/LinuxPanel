import{I as e,l as t,n as a,b as s,q as i}from"./main.js?v=1714377894636";import{_ as l}from"./index120.js?v=1714377894636";import{q as o,s as n,L as r}from"./element-lib.js?v=1714377894636";import"./index45.js?v=1714377894636";import{_ as c}from"./preload-helper.js?v=1714377894636";import{e as m,b as p,h as d,j as u}from"./vue-lib.js?v=1714377894636";import{av as f,aw as v}from"./site.store.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./check.js?v=1714377894636";const _=a(m({__name:"PseudoStatic",props:{compData:{default:()=>{}}},setup(a,{expose:s}){const i=a,{proxy:l}=u(),o=p(""),n=p(!1),r=p({mode:"ace/mode/nginx",theme:"ace/theme/chrome",wrap:!0,showInvisibles:!1,showFoldWidgets:!1,useSoftTabs:!0,tabSize:2,showPrintMargin:!1,readOnly:!1,fontSize:"12px"}),m=p([]),_=p([]),h=p(),b=p(),x=async()=>{try{const e=await f({site_ids:JSON.stringify(i.compData.map((e=>e.id))),site_type:"PHP"});m.value=e.data.site_rewrites,_.value=e.data.template_rewrites}catch(e){}},y=async t=>{try{const{data:a}=await(t=>e.post("files/GetFileBody",{data:t}))({path:t});o.value=a.data}catch(a){}},C=()=>{h.value||b.value?n.value=!0:l.$message.error("请选择一种伪静态规则")};return s({onConfirm:C}),d((async()=>{await x()})),{__sfc:!0,props:i,vm:l,editorContent:o,setPopup:n,config:r,siteRewrites:m,templateRewrites:_,siteData:h,templateData:b,getSelectData:x,handleChangeSite:async e=>{await y(e),b.value=""},handleChangeOther:async e=>{await y(e),h.value=""},getBody:y,handleConfirm:async()=>{let e;try{e=l.$load("正在部署，请稍后...");let a=[];i.compData.forEach((e=>{let t;t=m.value.find((t=>t.id===e.id)),a.push({id:e.id,name:e.name,file:t.file})}));const s=await v({sites:JSON.stringify(a),rewrite_data:o.value});await t({title:"批量部署结果",area:42,component:()=>c((()=>import("./index63.js?v=1714377894636")),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]),import.meta.url),compData:{resultData:s.data,resultTitle:"结果"}}),n.value=!1,l.$emit("close")}catch(a){}finally{e.close()}},onConfirm:C}}}),(function(){var e=this,t=e._self._c,a=e._self._setupProxy;return t("div",{staticClass:"p-20x"},[t("div",{staticClass:"flex items-center"},[e._v(" 站点已有伪静态规则： "),t(o,{staticClass:"mx-12x",on:{change:a.handleChangeSite},model:{value:a.siteData,callback:function(e){a.siteData=e},expression:"siteData"}},e._l(a.siteRewrites,(function(e){return t(n,{key:e.id,attrs:{label:e.name+"站点的伪静态配置",value:e.file}})})),1),e._v(" 模板伪静态规则： "),t(o,{staticClass:"mx-12x",on:{change:a.handleChangeOther},model:{value:a.templateData,callback:function(e){a.templateData=e},expression:"templateData"}},e._l(a.templateRewrites,(function(e){return t(n,{key:e.id,attrs:{label:e.name+"模板的伪静态配置",value:e.file}})})),1)],1),t(r),t(l,{staticClass:"!h-[52rem]",attrs:{config:a.config},model:{value:a.editorContent,callback:function(e){a.editorContent=e},expression:"editorContent"}}),t(s,{attrs:{title:"部署当前伪静态",visible:a.setPopup,area:[52,26]},on:{"update:visible":function(e){a.setPopup=e}}},[t("div",{staticClass:"relative h-full"},[t("div",{staticClass:"p-20x"},[t("span",{staticClass:"!mb-4x inline-block"},[e._v("如下是需要批量部署证书的站点：")]),t("div",{staticClass:"overflow-auto h-[12rem] border border-[#efefef] p-12x"},e._l(e.compData,(function(a,s){return t("div",{key:s,staticClass:"p-4x w-full"},[e._v(" "+e._s(a.name)+" ")])})),0),t("span",{staticClass:"text-danger mt-4x"},[e._v("注意：批量设置站点伪静态后，原有站点伪静态配置将被覆盖。")])]),t("div",{staticClass:"absolute bottom-0 w-full bg-[#f6f8f8] flex items-center justify-end p-12x"},[t(i,{attrs:{type:"cancel"},on:{click:function(e){a.setPopup=!1}}},[e._v("取消")]),t(i,{on:{click:a.handleConfirm}},[e._v("部署("+e._s(e.compData.length)+"项) ")])],1)])])],1)}),[],!1,null,"bff27bc7",null,null).exports;export{_ as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./index63.js?v=1714377894636","./index39.js?v=1714377894636","./element-lib.js?v=1714377894636","./__commonjsHelpers__.js?v=1714377894636","./vue-lib.js?v=1714377894636","./public-lib.js?v=1714377894636","./main.js?v=1714377894636","./modulepreload-polyfill.js?v=1714377894636","./preload-helper.js?v=1714377894636","./request-lib.js?v=1714377894636","./locales-lib.js?v=1714377894636","./element-lib.js?v=1714377894636"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
