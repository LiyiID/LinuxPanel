import{be as e,l as a,n as t,q as s,b as l}from"./main.js?v=1714377894636";import{_ as i}from"./index39.js?v=1714377894636";import{q as r,s as n,y as o,ab as c}from"./element-lib.js?v=1714377894636";import"./radio-button.js?v=1714377894636";import{_ as m}from"./index57.js?v=1714377894636";import{_ as p}from"./index59.js?v=1714377894636";import{_ as u}from"./preload-helper.js?v=1714377894636";import{e as d,b as f,v as h,h as y,j as g,l as v,H as b}from"./vue-lib.js?v=1714377894636";import{c as _}from"./check.js?v=1714377894636";import{g as x,eA as j,aq as S,eB as C,ar as P,as as w,at as L,au as k}from"./site.store.js?v=1714377894636";import{g as q}from"./index38.js?v=1714377894636";import{ae as D,r as R}from"./site.popup.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./index45.js?v=1714377894636";import"./element-ui.common.js?v=1714377894636";import"./date-util.js?v=1714377894636";import"./vdom.js?v=1714377894636";import"./index62.js?v=1714377894636";import"./cascader-panel.js?v=1714377894636";const T=t(d({__name:"CertFolderList",setup(t){const{proxy:s}=g(),{refs:{siteInfo:l},getPhpModulesList:i,getModulesList:r,getSslInfoConfig:n}=x(),o=f(!1);let c=f({});const m=h({loading:!1,list:[],type:0,search:""}),p=f([]),d=h({typeValue:"全部",btnText:"部署证书",search:"",data:{all:[],site:[]},siteList:[]}),T=async e=>{try{await s.$confirm({title:"上传云端证书",message:"将会上传证书信息至云端进行替换，是否继续操作？",icon:"warning",type:"calc"});const a=await S({ssl_hash:e.hash});s.$message.request(a),await E()}catch(a){}},$=async a=>{let t={},i=!0;void 0!==a&&(t={cert_list:JSON.stringify(a.dns)},i=!1,c.value=a);try{const{data:a}=await C(t);d.data={all:a.all.map((e=>({name:e}))),site:a.site.map((e=>({name:e})))},i||(o.value=!0,v((()=>{d.data.all.forEach(((e,a)=>{e.name===l.value.name&&(e.current=!0,d.data.all.unshift(d.data.all.splice(a,1)[0]))})),e(s.$refs.deploySiteTable).toggleRowSelection(d.data.all.find((e=>e.name===l.value.name)),!0)})))}catch(r){}},N=async e=>{try{await s.$confirm({title:"删除证书",message:"删除后该证书将不会显示在证书夹，是否继续操作？",icon:"warning"});const a=await P({local:e.cloud_id>0?0:1,ssl_hash:e.hash});s.$message.request(a),await E()}catch(a){}},E=async(e=!1)=>{m.loading=!0;try{const a=await w({search_limit:m.type,search_name:m.search});m.list=_(a.data,"array",[]),e&&s.$message.success("获取成功")}catch(a){}finally{m.loading=!1}},I=D({uploadCloud:T,certDeploy:$,deleteEvent:N}),V=f([{label:"批量删除",value:"delete",diyBatch:async()=>{try{await s.$confirm({title:"批量删除",message:"删除云端证书后域名将不会于证书关联，是否继续？",type:"check",icon:"warning",checkText:"同时删除当前本地证书",checkEvent:async e=>{let a=[],t=p.value.map((e=>(a.push(e.dns.join("\n")),e.id)));const s=await j({ssl_id_list:JSON.stringify(t),local:e?1:0});let l=[];await s.forEach(((e,t)=>{l.push({name:a[t],msg:e.msg,status:e.status})})),await R({resultData:l,resultTitle:"删除"}),E()}})}catch(e){}}}]),O=[q(),{label:"站点名称",prop:"name",render:e=>e.current?e.name+"(当前站点)":e.name}];return y((()=>{E()})),{__sfc:!0,vm:s,siteInfo:l,getPhpModulesList:i,getModulesList:r,getSslInfoConfig:n,setPopup:o,certData:c,pathData:[{title:"所有",value:0},{title:"未过期",value:1},{title:"即将过期",value:2},{title:"已过期",value:3}],certReqParams:m,checkedList:p,handleSelectionChange:e=>{p.value=e},deploySSLParams:d,uploadCloud:T,certDeploy:$,deleteEvent:N,getList:E,handleConfirm:async()=>{var e,t;if(0===d.siteList.length)return void s.$message.error("请选择站点");let m;try{await s.$confirm({title:"部署证书",message:"批量部署证书后，原有证书将被覆盖，是否继续？",icon:"warning"}),m=s.$load("正在部署证书，请稍候...");let p=[];null==(e=d.siteList)||e.forEach((e=>{p.push({ssl_hash:c.value.hash,siteName:e.name,certName:c.value.subject})}));const f="proxy"==l.value.project_type||"nginx"==l.value.project_type?await L({BatchInfo:JSON.stringify(p),site_name:l.value.name}):await k({BatchInfo:JSON.stringify(p)});if("PHP"===l.value.project_type)i();else{let e=null==(t=l.value.project_type)?void 0:t.toLowerCase();"node"===e&&(e="nodejs"),r(e)}n(),await a({title:"批量部署结果",area:42,component:()=>u((()=>import("./index63.js?v=1714377894636")),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]),import.meta.url),compData:{resultData:[...f.data.faildList,...f.data.successList],resultTitle:"部署证书操作",resultColumn:[{label:"站点名称",prop:"siteName"},{label:"操作结果",render:e=>b("span",{class:e.status?"text-primary":"text-danger"},e.status?"操作成功":"操作失败")}]}}),o.value=!1}catch(p){}finally{m&&m.close()}},tableColumns:I,handleSerach:e=>{m.search=e||"",E()},batchGroup:V,changeWebType:e=>{d.typeValue=e},handleDeploySiteListSearch:e=>{d.search=e,$(!0)},deployTableColumns:O,handleDeploySelectionChange:e=>{d.siteList=e,e.length<=0?d.btnText="部署证书":d.btnText="部署证书[已选择".concat(e.length,"项]")}}}}),(function(){var e=this,a=e._self._c,t=e._self._setupProxy;return a("div",{staticClass:"pt-16x"},[a(p,{scopedSlots:e._u([{key:"header-left",fn:function(){return[a(s,{attrs:{type:"default"},on:{click:function(e){return t.getList(!0)}}},[e._v("从云端同步")])]},proxy:!0},{key:"header-right",fn:function(){return[a(r,{staticClass:"w-[10rem] mr-[.4rem]",attrs:{filterable:""},on:{change:function(e){return t.getList()}},model:{value:t.certReqParams.type,callback:function(a){e.$set(t.certReqParams,"type",a)},expression:"certReqParams.type"}},e._l(t.pathData,(function(e,t){return a(n,{key:t,attrs:{value:e.value,label:e.title}})})),1),a(m,{attrs:{placeholder:"请输入域名搜索",width:"18rem"},on:{search:t.handleSerach,clear:function(e){return t.handleSerach("")}},model:{value:t.certReqParams.search,callback:function(a){e.$set(t.certReqParams,"search",a)},expression:"certReqParams.search"}})]},proxy:!0},{key:"content",fn:function(){return[a(i,{directives:[{name:"loading",rawName:"v-loading",value:t.certReqParams.loading,expression:"certReqParams.loading"}],attrs:{"element-loading-text":"正在加载中...","max-height":"400",data:t.certReqParams.list,column:t.tableColumns},on:{"selection-change":t.handleSelectionChange}})]},proxy:!0},{key:"footer-left",fn:function(){},proxy:!0},{key:"popup",fn:function(){var r;return[a(l,{attrs:{title:"部署当前证书",visible:t.setPopup,area:[52,45]},on:{"update:visible":function(e){t.setPopup=e}}},[a("div",{staticClass:"relative h-full"},[a("div",{staticClass:"p-20x"},[a("div",{staticClass:"flex flex-col p-12x bg-[#f5faf2]"},[a("span",{staticClass:"mb-4x"},[e._v("认证域名："+e._s(t.certData.subject))]),a("span",{staticClass:"mb-4x"},[e._v("证书类型："+e._s(null==(r=t.certData.info)?void 0:r.issuer))]),a("span",{staticClass:"mb-4x"},[e._v("到期时间："+e._s(t.certData.not_after))])]),a("span",{staticClass:"!mt-24x !mb-4x inline-block"},[e._v("如下是需要批量部署证书的站点：")]),a("div",{staticClass:"flex justify-between mb-[1rem]"},[a(o,{staticClass:"mr-12x",attrs:{size:"mini"},on:{change:t.changeWebType},model:{value:t.deploySSLParams.typeValue,callback:function(a){e.$set(t.deploySSLParams,"typeValue",a)},expression:"deploySSLParams.typeValue"}},[a(c,{attrs:{label:"全部"}}),a(c,{attrs:{label:"匹配站点"}})],1)],1),a(i,{directives:[{name:"loading",rawName:"v-loading",value:t.certReqParams.loading,expression:"certReqParams.loading"}],ref:"deploySiteTable",attrs:{"element-loading-text":"正在加载中...",data:t.deploySSLParams.data["全部"===t.deploySSLParams.typeValue?"all":"site"],column:t.deployTableColumns,"max-height":180},on:{"selection-change":t.handleDeploySelectionChange}})],1),a("div",{staticClass:"absolute bottom-0 w-full bg-[#f6f8f8] flex items-center justify-end p-12x"},[a(s,{attrs:{type:"cancel"},on:{click:function(e){t.setPopup=!1}}},[e._v("取消")]),a(s,{on:{click:t.handleConfirm}},[e._v(e._s(t.deploySSLParams.btnText))])],1)])])]},proxy:!0}])})],1)}),[],!1,null,"f7022c8a",null,null).exports;export{T as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./index63.js?v=1714377894636","./index39.js?v=1714377894636","./element-lib.js?v=1714377894636","./__commonjsHelpers__.js?v=1714377894636","./vue-lib.js?v=1714377894636","./public-lib.js?v=1714377894636","./main.js?v=1714377894636","./modulepreload-polyfill.js?v=1714377894636","./preload-helper.js?v=1714377894636","./request-lib.js?v=1714377894636","./locales-lib.js?v=1714377894636","./element-lib.js?v=1714377894636"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
