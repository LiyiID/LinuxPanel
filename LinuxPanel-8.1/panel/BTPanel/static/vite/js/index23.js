import{_ as e}from"./index52.js?v=1714377894636";import{_ as t}from"./index53.js?v=1714377894636";import{n as a,a as s}from"./main.js?v=1714377894636";import{_ as o}from"./index39.js?v=1714377894636";import{_ as n}from"./index54.js?v=1714377894636";import{_ as i}from"./index55.js?v=1714377894636";import{_ as r}from"./index57.js?v=1714377894636";import{q as l,s as m}from"./element-lib.js?v=1714377894636";import{_ as c}from"./index43.js?v=1714377894636";import{_ as u}from"./index58.js?v=1714377894636";import{_ as d}from"./index59.js?v=1714377894636";import{e as p,b as f,v as h,h as g,j as v}from"./vue-lib.js?v=1714377894636";import{g as b,i as j}from"./site.store.js?v=1714377894636";import{F as x,G as y,N as _,c as P,g as S,H as T}from"./site.popup.js?v=1714377894636";import{o as C}from"./software2.js?v=1714377894636";import{s as k}from"./site.method.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./index45.js?v=1714377894636";import"./check.js?v=1714377894636";import"./index38.js?v=1714377894636";import"./element-ui.common.js?v=1714377894636";import"./date-util.js?v=1714377894636";import"./vdom.js?v=1714377894636";import"./index62.js?v=1714377894636";import"./cascader-panel.js?v=1714377894636";import"./confirm.js?v=1714377894636";import"./config.js?v=1714377894636";const N=a(p({__name:"index",setup(e){const{proxy:t}=v(),{refs:{modulesTableParams:a},getModulesList:s,getModulesTypeList:o}=b(),n=f(!1),i=h({isRecurrence:!1,describe:{title:"",th:"",message:"",propsValue:""}}),r=[{content:"添加.Net项目",active:!0,event:()=>{y()}},{content:".Net环境管理",event:async e=>{try{const{data:e}=await j({sName:"dotnet"});await C({name:"dotnet",softData:e})}catch(t){}}}],l=f([]),m=f([{label:"设置分类",value:"settingClass",isRefBatch:!0},{label:"删除项目",value:"delNetSite",isRefBatch:!0}]),c=x({changeTaskTopEvent:e=>{},changeStatusEvent:e=>{k.setProject(e,e.run?"stop":"start","net",(()=>s("net")))},setQuotaEvent:e=>{},openBackupEvent:e=>{},deleteEvent:e=>{k.delProject(e,{},"net",!1)},openPlugin:e=>{},openTotalFlow:e=>{},openSetting:e=>{T(e)}});return g((async()=>{await s("net"),await o("net")})),{__sfc:!0,vm:t,modulesTableParams:a,getModulesList:s,getModulesTypeList:o,hovering:n,batchConfig:i,tableBtnGroup:r,checkedList:l,batchGroup:m,handleSelectionChange:e=>{l.value=e},handleBatch:e=>{switch(e){case"settingClass":S(l.value,"net");break;case"delNetSite":k.delProject({},l.value,"net",!0)}},tableColumns:c,changePage:e=>{a.value.p=e,s("net")},changeSize:e=>{var t;a.value.limit=e;let o=JSON.parse(null!=(t=localStorage.getItem("siteOtherPageLimit"))?t:"{}");o.net=e,localStorage.setItem("siteOtherPageLimit",JSON.stringify(o)),s("net")},handleSerach:e=>{a.value.search=e,void 0===e&&(a.value.search=""),s("net")},netAddSiteDialog:y,NPSDialog:_,classSettingDialog:P}}}),(function(){var a=this,p=a._self._c,f=a._self._setupProxy;return p("div",[p(d,{scopedSlots:a._u([{key:"header-left",fn:function(){return[p("div",{staticClass:"flex items-center"},[p(u,{attrs:{group:f.tableBtnGroup}}),p(c,{staticClass:"ml-12x inline-block",attrs:{icon:"demand",iconClass:"text-1.6rem",content:"需求反馈"},on:{click:function(e){return f.NPSDialog()}}})],1)]},proxy:!0},{key:"header-right",fn:function(){return[p("div",{staticClass:"flex items-center"},[p(l,{staticClass:"mr-8x w-[12rem]",on:{change:function(e){return f.getModulesList("net")}},model:{value:f.modulesTableParams.type_id,callback:function(e){a.$set(f.modulesTableParams,"type_id",e)},expression:"modulesTableParams.type_id"}},[p("div",{staticClass:"max-h-[20rem] overflow-auto",class:{"no-hover":f.hovering}},a._l(f.modulesTableParams.typeList,(function(e,t){return p(m,{key:t,attrs:{label:e.name,value:e.id}})})),1),p("div",{staticClass:"classify-item",on:{click:function(e){return f.classSettingDialog("net")},mouseover:function(e){f.hovering=!0},mouseout:function(e){f.hovering=!1}}},[a._v(" 分类设置 ")])])],1),p("div",{staticClass:"relative"},[p(r,{attrs:{placeholder:a.$t("SitePhpModel.TableSearch"),width:"40rem"},on:{search:f.handleSerach,clear:f.handleSerach},model:{value:f.modulesTableParams.search,callback:function(e){a.$set(f.modulesTableParams,"search",e)},expression:"modulesTableParams.search"}})],1),p(i,{staticClass:"!ml-8x",attrs:{refresh:()=>{f.getModulesList("net")}}}),p(n,{staticClass:"ml-8x",attrs:{name:"siteNetTable",column:f.tableColumns}})]},proxy:!0},{key:"content",fn:function(){return[p(o,{directives:[{name:"loading",rawName:"v-loading",value:f.modulesTableParams.loading,expression:"modulesTableParams.loading"}],ref:"siteNetTable",attrs:{"element-loading-text":"正在加载中...",data:f.modulesTableParams.list,column:f.tableColumns},on:{"selection-change":f.handleSelectionChange},scopedSlots:a._u([{key:"empty",fn:function(){return[p("div",{staticClass:"flex items-center justify-center"},[a._v(" 您的列表为空，您可以 "),p(s,{on:{click:function(e){return f.netAddSiteDialog()}}},[a._v("添加一个项目")])],1)]},proxy:!0}])})]},proxy:!0},{key:"footer-left",fn:function(){return[p(t,{attrs:{data:f.batchGroup,config:f.batchConfig,"batch-fn":()=>{}},on:{"handle-batch":f.handleBatch}})]},proxy:!0},{key:"footer-right",fn:function(){return[p(e,{attrs:{total:f.modulesTableParams.total,"current-page":f.modulesTableParams.p,"page-size":f.modulesTableParams.limit},on:{"current-change":f.changePage,"size-change":f.changeSize}})]},proxy:!0}])})],1)}),[],!1,null,"5c88197c",null,null).exports;export{N as default};