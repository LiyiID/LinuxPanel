import{_ as a}from"./index120.js?v=1714377894636";import{g as e,f as t,a as s,n as i,q as o,b as l}from"./main.js?v=1714377894636";import{_ as n}from"./index39.js?v=1714377894636";import{_ as r}from"./index118.js?v=1714377894636";import{L as c}from"./element-lib.js?v=1714377894636";import"./index45.js?v=1714377894636";import{e as u,b as v,H as p,f as m,h as d,j as f}from"./vue-lib.js?v=1714377894636";import{g as h,cq as g,cr as y,ai as x,al as b}from"./site.store.js?v=1714377894636";import{a as w}from"./confirm.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./check.js?v=1714377894636";import"./config.js?v=1714377894636";const _=i(u({__name:"ConfigurationFile",props:{compData:{default:()=>({})}},setup(a){const i=a,{proxy:o}=f(),{refs:{siteInfo:l,siteTabActiveList:n}}=h(),{refs:{webServerType:r}}=e(),u=v(!1),_=v(""),j=v(!1),C=v(!1),L=v(!1),S=v(""),P=v(!1),T=v({}),D=v(!1),F=v([]),k=v([{label:"文件名",render:a=>p("span",[t(a)])},{label:"操作",align:"right",render:a=>p("div",[p(s,{on:{click:async()=>{try{const e=await g({filename:B.value,history:a});S.value=e.data.data||"文件不存在",T.value=a,L.value=!0}catch(e){}}}},["查看"]),p(c,{attrs:{direction:"vertical"}}),p(s,{on:{click:async()=>{M(a)}}},["恢复"])])}]),q=v(["php","proxy","html","nginx"]),A=v({mode:"ace/mode/nginx",theme:"ace/theme/chrome",wrap:!0,showInvisibles:!1,showFoldWidgets:!1,useSoftTabs:!0,tabSize:2,showPrintMargin:!1,readOnly:!1,fontSize:"12px"}),z=v({mode:"ace/mode/nginx",theme:"ace/theme/chrome",wrap:!0,showInvisibles:!1,showFoldWidgets:!1,useSoftTabs:!0,tabSize:2,showPrintMargin:!1,readOnly:!0,fontSize:"12px"}),H=v([{text:"此处为站点主配置文件,若您不了解配置规则,请勿随意修改."}]),I=v(""),B=v("/www/server/panel/vhost/".concat(r.value,"/").concat("php"!==I.value&&"proxy"!==I.value&&"nginx"!==I.value?"".concat(I.value,"_"):"").concat(l.value.name,".conf")),E=async()=>{var a;try{j.value=!0;const{data:e}=await x({path:B.value});_.value=null!=(a=e.data)?a:e.msg,j.value=!1,F.value=e.historys,L.value=!1}catch(e){}finally{j.value=!1}},M=async a=>{w({confirm:{title:"恢复历史文件",message:"是否恢复历史文件 ".concat(t(a)),icon:"warning"},loading:"正在恢复，请稍后...",request:async()=>{const e=await y({filename:B.value,history:a});return e.data.status&&(e.msg="恢复成功"),e},complete:E})};return m((()=>l.value),(a=>{var e,t;(null==(e=l.value.project_config)?void 0:e.bind_extranet)&&(u.value=!!(null==(t=l.value.project_config)?void 0:t.bind_extranet))}),{immediate:!0}),d((async()=>{var a,e;let t=null==(a=l.value.project_type)?void 0:a.toLowerCase();I.value=t,u.value=!!(null==(e=l.value.project_config)?void 0:e.bind_extranet),q.value.includes(I.value)&&(u.value=!0),B.value="/www/server/panel/vhost/".concat(r.value,"/").concat("php"!==I.value&&"proxy"!==I.value&&"nginx"!==I.value?"".concat(I.value,"_"):"").concat(l.value.name,".conf"),await E()})),{__sfc:!0,vm:o,props:i,siteInfo:l,siteTabActiveList:n,webServerType:r,isBindExtranet:u,staticContent:_,textLoading:j,otherSavePopup:C,historyPopup:L,historyText:S,historyLoading:P,itemData:T,tableLoad:D,tableData:F,tableColumn:k,specialData:q,config:A,historyConfig:z,helpList:H,siteType:I,pathAll:B,getConfigData:E,getReWriteBody:async a=>{try{j.value=!0;const{data:e}=await x({path:a||B.value});_.value=e.data,j.value=!1}catch(e){}finally{j.value=!1}},saveData:async()=>{let a=o.$load("正在保存内容，请稍候...");try{const a=await b({data:_.value,encoding:"utf-8",path:B.value});o.$message.msg({dangerouslyUseHTMLString:!0,message:a.msg,type:a.status?"success":"error",duration:a.status?2e3:0,showClose:!a.status}),E()}catch(e){}finally{a.close()}},recoverFile:M,jumpPath:()=>{n.value.moduleSettingsAct="mapping",n.value.isJump=!0}}}}),(function(){var e=this,t=e._self._c,i=e._self._setupProxy;return t("div",{staticClass:"h-full"},[i.isBindExtranet?t("div",[t("span",{staticClass:"my-4x text-[#666]"},[e._v("提示：Ctrl+F 搜索关键字，Ctrl+S 保存，Ctrl+H 查找替换")]),t(a,{directives:[{name:"loading",rawName:"v-loading",value:i.textLoading,expression:"textLoading"}],staticClass:"!h-[54rem] !w-[64rem] my-12x border border-[#DCDFE6] rounded-4x",attrs:{id:"configContent",isRequest:!1,"file-path":i.pathAll,config:i.config},model:{value:i.staticContent,callback:function(a){i.staticContent=a},expression:"staticContent"}}),t("div",[t(o,{on:{click:i.saveData}},[e._v("保存")]),t(o,{attrs:{type:"default"},on:{click:function(a){i.otherSavePopup=!0}}},[e._v("历史文件")])],1),t(r,{staticClass:"ml-20x mt-20x",attrs:{list:i.helpList}})],1):t("div",{staticClass:"bg-[#7F7F7F] flex items-center justify-center h-full"},[t("div",{staticClass:"bg-white px-48x py-16x text-[#333]"},[e._v(" 请开启 "),t(s,{on:{click:i.jumpPath}},[e._v("外网映射")]),e._v(" 后查看配置信息 ")],1)]),t(l,{attrs:{title:"配置文件历史版本",visible:i.otherSavePopup,area:42},on:{"update:visible":function(a){i.otherSavePopup=a}}},[t("div",{staticClass:"p-20x"},[t(n,{directives:[{name:"loading",rawName:"v-loading",value:i.tableLoad,expression:"tableLoad"}],attrs:{column:i.tableColumn,data:i.tableData}})],1)]),t(l,{attrs:{title:"查看文件历史版本",visible:i.historyPopup,area:62},on:{"update:visible":function(a){i.historyPopup=a}}},[t("div",{staticClass:"p-20x"},[t(o,{on:{click:function(a){return i.recoverFile(i.itemData)}}},[e._v("恢复文件")]),t(a,{directives:[{name:"loading",rawName:"v-loading",value:i.historyLoading,expression:"historyLoading"}],staticClass:"!h-[54rem] !w-full my-12x",attrs:{id:"history",config:i.historyConfig},model:{value:i.historyText,callback:function(a){i.historyText=a},expression:"historyText"}})],1)])],1)}),[],!1,null,"fbf405ae",null,null).exports;export{_ as default};
