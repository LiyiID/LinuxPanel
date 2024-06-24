import{_ as e}from"./index52.js?v=1714377894636";import{_ as t}from"./index53.js?v=1714377894636";import{o as a,n as s,a as o}from"./main.js?v=1714377894636";import{_ as r}from"./index39.js?v=1714377894636";import{_ as n}from"./index54.js?v=1714377894636";import{_ as i}from"./index55.js?v=1714377894636";import{_ as l}from"./index57.js?v=1714377894636";import{q as c,s as m}from"./element-lib.js?v=1714377894636";import{_ as d}from"./index43.js?v=1714377894636";import{_ as u}from"./index58.js?v=1714377894636";import{_ as p}from"./index59.js?v=1714377894636";import{_ as f}from"./index60.js?v=1714377894636";import{e as h,b as v,v as g,h as j,j as b}from"./vue-lib.js?v=1714377894636";import{g as x,p as y,i as _,q as P}from"./site.store.js?v=1714377894636";import{q as S,t as C,N as k,c as T,f as w,g as N,i as L,v as V}from"./site.popup.js?v=1714377894636";import{o as M}from"./software2.js?v=1714377894636";import{s as B}from"./site.method.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./index45.js?v=1714377894636";import"./check.js?v=1714377894636";import"./index38.js?v=1714377894636";import"./element-ui.common.js?v=1714377894636";import"./date-util.js?v=1714377894636";import"./vdom.js?v=1714377894636";import"./index62.js?v=1714377894636";import"./cascader-panel.js?v=1714377894636";import"./confirm.js?v=1714377894636";import"./config.js?v=1714377894636";const D=s(h({__name:"index",setup(e){const{proxy:t}=b(),{refs:{modulesTableParams:s},getModulesList:o,getModulesTypeList:r}=x(),n=v(!1),i=v([]),l=v("0"),c=v([]),m=v(!1),d=g({isRecurrence:!1,describe:{title:"",th:"",message:"",propsValue:""}}),u=[{content:"添加Node项目",active:!0,event:async()=>{try{i.value.length?C():D()}catch(e){}}},{content:"Node版本管理器",event:async()=>{D()}}],p=v([{label:"部署证书",value:"setCertificates",isRefBatch:!0},{label:"删除项目",value:"delNodeSite",isRefBatch:!0}]),f=S({changeTaskTopEvent:e=>{},changeStatusEvent:e=>{B.setProject(e,e.run?"stop":"start","nodejs",(()=>o("nodejs")))},setQuotaEvent:e=>{},openBackupEvent:e=>{},deleteEvent:e=>{B.delProject(e,{},"nodejs",!1)},setSiteTime:e=>{L(e,!1,"nodejs")},openPlugin:e=>{},openTotalFlow:e=>{},openSetting:(e,t)=>{try{i.value.length?V(e,t):D()}catch(a){}}}),h=async()=>{try{const e=await y();if(i.value=[],!e.status)return void(m.value=!0);e.data.forEach((e=>{e.setup&&i.value.push({label:e.version,value:e.version}),1===e.is_default&&(l.value=e.version)})),i.value.unshift({label:"未设置",value:"0"})}catch(e){}},D=async()=>{try{const{data:e}=await _({sName:"nodejs"});await M({name:"nodejs",softData:e})}catch(e){}};return j((async()=>{await o("nodejs"),await h()})),{__sfc:!0,vm:t,modulesTableParams:s,getModulesList:o,getModulesTypeList:r,hovering:n,nodeVersion:i,currentVersion:l,checkedList:c,maskLayer:m,batchConfig:d,tableBtnGroup:u,batchGroup:p,handleSelectionChange:e=>{c.value=e},handleBatch:e=>{switch(e){case"settingClass":N(c.value,"nodejs");break;case"delNodeSite":B.delProject({},c.value,"nodejs",!0);break;case"setCertificates":w(c.value)}},handleSerach:e=>{s.value.search=e,void 0===e&&(s.value.search=""),o("nodejs")},tableColumns:f,getNodeVersion:h,openVersionManger:D,changePage:e=>{s.value.p=e,o("nodejs")},changeSize:e=>{var t;s.value.limit=e;let a=JSON.parse(null!=(t=localStorage.getItem("siteOtherPageLimit"))?t:"{}");a.nodejs=e,localStorage.setItem("siteOtherPageLimit",JSON.stringify(a)),o("nodejs")},setVersion:async()=>{try{const e=await P({version:l.value});e.data.status?t.$message.success(e.data.data):t.$message.error(e.data.error_msg)}catch(e){}},nodeAddSiteDialog:C,NPSDialog:k,classSettingDialog:T,isRelease:a}}}),(function(){var a=this,s=a._self._c,h=a._self._setupProxy;return s("div",{staticClass:"relative"},[s(f,{attrs:{visible:h.maskLayer,width:"32rem"}},[a._v(" 未安装Node版本管理器，"),s(o,{staticClass:"!text-[1.4rem]",on:{click:h.openVersionManger}},[a._v("点击安装")])],1),s(p,{scopedSlots:a._u([{key:"header-left",fn:function(){return[s("div",{staticClass:"flex items-center"},[s(u,{attrs:{group:h.tableBtnGroup}}),h.isRelease?a._e():s("div",{staticClass:"flex items-center mx-12x"},[s("span",{staticClass:"mr-4x"},[a._v("命令行版本")]),s(c,{staticClass:"w-[10rem]",on:{change:h.setVersion},model:{value:h.currentVersion,callback:function(e){h.currentVersion=e},expression:"currentVersion"}},a._l(h.nodeVersion,(function(e){return s(m,{key:e.value,attrs:{label:e.label,value:e.value}})})),1)],1),s(d,{staticClass:"ml-12x inline-block",attrs:{icon:"demand",iconClass:"text-1.6rem",content:"需求反馈"},on:{click:function(e){return h.NPSDialog()}}})],1)]},proxy:!0},{key:"header-right",fn:function(){return[h.isRelease?a._e():s("div",{staticClass:"flex items-center"},[s(c,{staticClass:"mr-8x w-[12rem]",on:{change:function(e){return h.getModulesList("nodejs")}},model:{value:h.modulesTableParams.type_id,callback:function(e){a.$set(h.modulesTableParams,"type_id",e)},expression:"modulesTableParams.type_id"}},[s("div",{staticClass:"max-h-[20rem] overflow-auto",class:{"no-hover":h.hovering}},a._l(h.modulesTableParams.typeList,(function(e,t){return s(m,{key:t,attrs:{label:e.name,value:e.id}})})),1),s("div",{staticClass:"classify-item",on:{click:function(e){return h.classSettingDialog("nodejs")},mouseover:function(e){h.hovering=!0},mouseout:function(e){h.hovering=!1}}},[a._v(" 分类设置 ")])])],1),s("div",{staticClass:"relative mr-8x"},[s(l,{attrs:{placeholder:a.$t("SitePhpModel.TableSearch"),width:"40rem"},on:{search:h.handleSerach,clear:h.handleSerach},model:{value:h.modulesTableParams.search,callback:function(e){a.$set(h.modulesTableParams,"search",e)},expression:"modulesTableParams.search"}})],1),s(i,{attrs:{refresh:()=>{h.getModulesList("nodejs")}}}),s(n,{staticClass:"ml-8x",attrs:{name:"siteNodeTable",column:h.tableColumns}})]},proxy:!0},{key:"content",fn:function(){return[s(r,{directives:[{name:"loading",rawName:"v-loading",value:h.modulesTableParams.loading,expression:"modulesTableParams.loading"}],ref:"siteNodeTable",attrs:{"element-loading-text":"正在加载中...",data:h.modulesTableParams.list,column:h.tableColumns},on:{"selection-change":h.handleSelectionChange},scopedSlots:a._u([{key:"empty",fn:function(){return[s("div",{staticClass:"flex items-center justify-center"},[a._v(" 您的列表为空，您可以 "),s(o,{on:{click:function(e){return h.nodeAddSiteDialog()}}},[a._v("添加一个项目")])],1)]},proxy:!0}])})]},proxy:!0},{key:"footer-left",fn:function(){return[s(t,{attrs:{data:h.batchGroup,config:h.batchConfig,"batch-fn":()=>{}},on:{"handle-batch":h.handleBatch}})]},proxy:!0},{key:"footer-right",fn:function(){return[s(e,{attrs:{total:h.modulesTableParams.total,"current-page":h.modulesTableParams.p,"page-size":h.modulesTableParams.limit},on:{"current-change":h.changePage,"size-change":h.changeSize}})]},proxy:!0}])})],1)}),[],!1,null,"6c4c247e",null,null).exports;export{D as default};