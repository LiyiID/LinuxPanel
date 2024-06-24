import{a as t,l as a,n as e,q as s,b as l}from"./main.js?v=1714377894636";import{_ as o}from"./index39.js?v=1714377894636";import{_ as i}from"./index55.js?v=1714377894636";import{_ as n}from"./index59.js?v=1714377894636";import{_ as r}from"./preload-helper.js?v=1714377894636";import{e as c,b as p,H as u,h as f,j as m}from"./vue-lib.js?v=1714377894636";import{g as d,aq as _,ar as v,as as y,at as b,au as h}from"./site.store.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./element-lib.js?v=1714377894636";import"./check.js?v=1714377894636";const x=e(c({__name:"CertificationSettings",props:{compData:{default:()=>({})}},setup(e){const s=e,{refs:{siteInfo:l},getPhpModulesList:o,getModulesList:i,getSslInfoConfig:n}=d(),{proxy:c}=m(),x=p(!1),g=p({}),j=p([{label:"域名",prop:"subject"},{label:"到期时间",prop:"not_after"},{label:"品牌",prop:"info.issuer"},{label:"位置",render:t=>u("span",[t.cloud_id>0?"云端":"本地"])},{label:"操作",align:"right",width:180,render:a=>u("span",[u(t,{class:a.cloud_id>0?"hidden":"",on:{click:async()=>{try{await c.$confirm({title:"上传云端证书",message:"将会上传证书信息至云端进行替换，是否继续操作？",icon:"warning",type:"calc"});const t=await _({ssl_hash:a.hash});c.$message.request(t),await k()}catch(t){}}}},"上传云端"),u(t,{class:"ml-8x",on:{click:async()=>{g.value=a,x.value=!0}}},"部署"),u(t,{class:"ml-8x",on:{click:async()=>{try{await c.$confirm({title:"删除证书",message:"删除后该证书将不会显示在证书夹，是否继续操作？",icon:"warning"});const t=await v({local:a.cloud_id>0?0:1,ssl_hash:a.hash});c.$message.request(t),await k()}catch(t){}}}},"删除")])}]),w=p([]),C=p(!1),k=async()=>{try{C.value=!0;const t=await y();w.value=t.data,C.value=!1}catch(t){}};return f((async()=>{await k()})),{__sfc:!0,siteInfo:l,getPhpModulesList:o,getModulesList:i,getSslInfoConfig:n,props:s,vm:c,setPopup:x,certData:g,tableColumns:j,tableData:w,tableLoad:C,getList:k,handleConfirm:async()=>{var t;let e;try{await c.$confirm({title:"部署证书",message:"批量部署证书后，原有证书将被覆盖，是否继续？",icon:"warning"}),e=c.$load("正在部署证书，请稍后...");let p=[];s.compData.forEach((t=>{p.push({ssl_hash:g.value.hash,siteName:t.name,certName:g.value.subject})}));const f="proxy"==l.value.project_type||"nginx"==l.value.project_type?await b({BatchInfo:JSON.stringify(p),site_name:l.value.name}):await h({BatchInfo:JSON.stringify(p)});if("PHP"===l.value.project_type)o();else{let a=null==(t=l.value.project_type)?void 0:t.toLowerCase();"node"===a&&(a="nodejs"),i(a)}(null==l?void 0:l.name)&&n(),await a({title:"批量部署结果",area:42,component:()=>r((()=>import("./index63.js?v=1714377894636")),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]),import.meta.url),compData:{resultData:[...f.data.faildList,...f.data.successList],resultTitle:"结果",resultColumn:[{label:"站点名称",prop:"siteName"},{label:"结果",render:t=>u("span",{class:t.status?"text-primary":"text-danger"},t.status?"操作成功":"操作失败")}]}}),x.value=!1,c.$emit("close")}catch(p){}finally{e.close()}}}}}),(function(){var t=this,a=t._self._c,e=t._self._setupProxy;return a("div",{staticClass:"p-20x"},[a(n,{scopedSlots:t._u([{key:"header-left",fn:function(){return[a(s,{attrs:{type:"default"},on:{click:e.getList}},[t._v("从云端同步")])]},proxy:!0},{key:"header-right",fn:function(){return[a(i,{attrs:{refresh:e.getList}})]},proxy:!0},{key:"content",fn:function(){return[a(o,{directives:[{name:"loading",rawName:"v-loading",value:e.tableLoad,expression:"tableLoad"}],attrs:{column:e.tableColumns,data:e.tableData,"element-loading-text":"正在加载中..."}})]},proxy:!0},{key:"footer-left",fn:function(){},proxy:!0},{key:"footer-right",fn:function(){},proxy:!0},{key:"popup",fn:function(){var o;return[a(l,{attrs:{title:"部署当前证书",visible:e.setPopup,area:[52,36]},on:{"update:visible":function(t){e.setPopup=t}}},[a("div",{staticClass:"relative h-full"},[a("div",{staticClass:"p-20x"},[a("div",{staticClass:"flex flex-col p-12x bg-[#f5faf2]"},[a("span",{staticClass:"mb-4x"},[t._v("认证域名："+t._s(e.certData.subject))]),a("span",{staticClass:"mb-4x"},[t._v("证书类型："+t._s(null==(o=e.certData.info)?void 0:o.issuer))]),a("span",{staticClass:"mb-4x"},[t._v("到期时间："+t._s(e.certData.not_after))])]),a("span",{staticClass:"!mt-24x !mb-4x inline-block"},[t._v("如下是需要批量部署证书的站点：")]),a("div",{staticClass:"overflow-auto h-[12rem] border border-[#efefef] p-12x"},t._l(t.compData,(function(e,s){return a("div",{key:s,staticClass:"p-4x w-full"},[t._v(" "+t._s(e.name)+" ")])})),0)]),a("div",{staticClass:"absolute bottom-0 w-full bg-[#f6f8f8] flex items-center justify-end p-12x"},[a(s,{attrs:{type:"cancel"},on:{click:function(t){e.setPopup=!1}}},[t._v("取消")]),a(s,{on:{click:e.handleConfirm}},[t._v("部署("+t._s(t.compData.length)+"项目) ")])],1)])])]},proxy:!0}])})],1)}),[],!1,null,"dcb05420",null,null).exports;export{x as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./index63.js?v=1714377894636","./index39.js?v=1714377894636","./element-lib.js?v=1714377894636","./__commonjsHelpers__.js?v=1714377894636","./vue-lib.js?v=1714377894636","./public-lib.js?v=1714377894636","./main.js?v=1714377894636","./modulepreload-polyfill.js?v=1714377894636","./preload-helper.js?v=1714377894636","./request-lib.js?v=1714377894636","./locales-lib.js?v=1714377894636","./element-lib.js?v=1714377894636"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
