import{_ as e}from"./index53.js?v=1714377894636";import{_ as a}from"./index39.js?v=1714377894636";import{a9 as t,u as s,y as l,ab as n}from"./element-lib.js?v=1714377894636";import{cY as i,cs as r,cZ as o,a as c,n as u}from"./main.js?v=1714377894636";import"./radio-button.js?v=1714377894636";import{_ as p}from"./index59.js?v=1714377894636";import{_ as d}from"./index77.js?v=1714377894636";import{e as m,b as h,v as y,H as b,h as f,j as g}from"./vue-lib.js?v=1714377894636";import{o as v}from"./index61.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./index42.js?v=1714377894636";const _=u(m({__name:"FirewallSyncPort",props:{compData:{default:()=>({})}},setup(e){const a=e,{proxy:t}=g(),s=h([]),l=h(),n=y({sysNum:0,panelNum:0}),u=h("0"),p=h("未同步"),d=h([{type:"selection"},{label:"端口",prop:"ports"},{label:"协议",prop:"protocol"},{label:"策略",prop:"type",render:e=>b("span",["accept"===e.types?"允许":"拒绝"])},{label:"来源",prop:"address",render:e=>b("span",[""===e.address?"所有ip":e.address])}]),m=()=>{d.value.pop(),"忽略项"===p.value?d.value.push({label:"操作",align:"right",render:e=>b("span",[b(c,{class:"ml-8x",on:{click:async()=>{await A(e,!1)}}},"取消忽略")])}):d.value.push({label:"操作",align:"right",render:e=>b("span",[b(c,{on:{click:async()=>{C(e,!1)}}},["同步到","0"==u.value?"面板":"系统"]),b(c,{class:"ml-8x",on:{click:async()=>{await w(e,!1)}}},"忽略")])})};m();const _=h([{label:"忽略",value:"ignore",isRefBatch:!1,event:()=>{},diyBatch:()=>{w(null,!0)}},{label:"取消忽略",value:"unIgnore",isRefBatch:!1,event:()=>{},diyBatch:()=>{A(null,!0)}},{label:"同步到"+("0"==u.value?"面板":"系统"),value:"sync",isRefBatch:!0,event:()=>{},diyBatch:()=>{v({title:"同步到"+("0"==u.value?"面板":"系统")+"可对端口进行统一管理，是否同步？",dataList:s.value,titleType:"同步到"+("0"==u.value?"面板":"系统"),requestFun:async e=>await C(e,!0),isRecurrence:!0,tableColumn:[{prop:"ports",label:"端口"},{prop:"status",label:"状态"}],callback:()=>{k()}})}}]),x=y({isRecurrence:!1,describe:{title:"",th:"",message:"",propsValue:"ports"},diyBatch:null}),j=h(!1),w=async(e,a)=>{try{!a&&await t.$confirm({title:"忽略端口",message:"端口将会被移入到忽略列表，是否忽略？",icon:"question",iconColor:"#E6A23C"});let l=a?s.value:e;const n=await i({data:JSON.stringify({panel_exclude:"1"===u.value?Array.isArray(l)?l:[l]:[],sys_exclude:"0"===u.value?Array.isArray(l)?l:[l]:[],status:"add"})});t.$message.request(n),k()}catch(l){}},C=async(e,s)=>{let l;try{!s&&await t.$confirm({title:"同步端口",message:"同步到面板可对端口进行统一管理，是否同步？",icon:"question",iconColor:"#E6A23C"}),s||(l=t.$load("正在同步端口..."));let n=e;const i=await r({data:JSON.stringify({...n,brief:"",source:"",choose:"all",domain:""})});if(s)return i;!s&&t.$message.request(i),!s&&k(),!s&&a.compData.refreshEvent()}catch(n){}finally{l&&l.close()}},k=async()=>{try{j.value=!0;const e=await o();"0"===u.value?(l.value=e.data.sys_not_in_panel_fw_diff_list,"未同步"!==p.value&&(l.value=e.data.sys_exclude)):(l.value=e.data.panel_not_in_sys_fw_diff_list,"未同步"!==p.value&&(l.value=e.data.panel_exclude)),n.sysNum=e.data.sys_not_in_panel_fw_diff_list.length,n.panelNum=e.data.panel_not_in_sys_fw_diff_list.length}catch(e){}finally{j.value=!1}},A=async(e,a)=>{try{!a&&await t.$confirm({title:"取消忽略端口",message:"端口将会被移出忽略列表，是否取消忽略？",icon:"question",iconColor:"#E6A23C"});let l=a?s.value:e;const{data:n}=await i({data:JSON.stringify({panel_exclude:"1"===u.value?Array.isArray(l)?l:[l]:[],sys_exclude:"0"===u.value?Array.isArray(l)?l:[l]:[],status:"del"})});t.$message.request(n),k()}catch(l){}};return f((()=>{k()})),{__sfc:!0,props:a,vm:t,checkedList:s,tableData:l,tableNum:n,tabActive:u,headerRight:p,tableColumn:d,mix:m,tableBatchData:_,batchConfig:x,loading:j,handleBatchClick:e=>{let a=[];switch(e){case"ignore":a=["忽略","端口将会被移入到忽略列表"],x.isRecurrence=!1;break;case"sync":a=["同步","端口将会被同步到"+("0"==u.value?"面板":"系统")],x.isRecurrence=!1;break;case"unIgnore":a=["取消忽略","端口将会被移出忽略列表"],x.isRecurrence=!0}x.describe.th="端口",x.describe.title="批量".concat(a[0],"端口"),x.describe.message="批量".concat(a[0],"已选的端口，").concat(a[1],"是否继续操作！")},batchEvent:(e,a,t)=>{if("sync"===e)return C(a,!0)},changeTab:e=>{u.value=e.name,k()},changeRadio:e=>{p.value=e,m(),k()},ignorePort:w,syncPort:C,getPortConfigList:k,handleSelectionChange:e=>{s.value=e},unIgnorePort:A}}}),(function(){var i=this,r=i._self._c,o=i._self._setupProxy;return r("div",{staticClass:"p-20x"},[r(t,{attrs:{title:"检测到面板的端口配置与系统防火墙的端口配置存在差异，请选择同步或忽略",type:"warning","show-icon":"",closable:!1}}),r(d,{staticClass:"my-[1rem]",attrs:{type:"navtwo"},on:{"tab-click":o.changeTab},model:{value:o.tabActive,callback:function(e){o.tabActive=e},expression:"tabActive"}},[r(s,{attrs:{label:"系统配置未同步项："+o.tableNum.sysNum,name:"0"}}),r(s,{attrs:{label:"面板配置未同步项："+o.tableNum.panelNum,name:"1"}})],1),r(p,{scopedSlots:i._u([{key:"header-right",fn:function(){return[r(l,{attrs:{size:"small"},on:{change:o.changeRadio},model:{value:o.headerRight,callback:function(e){o.headerRight=e},expression:"headerRight"}},[r(n,{attrs:{label:"未同步"}}),r(n,{attrs:{label:"忽略项"}})],1)]},proxy:!0},{key:"content",fn:function(){return[r(a,{directives:[{name:"loading",rawName:"v-loading",value:o.loading,expression:"loading"}],attrs:{height:"380",column:o.tableColumn,data:o.tableData,"element-loading-text":"正在加载..."},on:{"selection-change":o.handleSelectionChange}})]},proxy:!0},{key:"footer-left",fn:function(){return[r(e,{attrs:{data:o.tableBatchData,config:o.batchConfig,"batch-fn":o.batchEvent},on:{"handle-complete":o.getPortConfigList,"handle-batch":o.handleBatchClick}})]},proxy:!0}])})],1)}),[],!1,null,"687da81d",null,null).exports;export{_ as default};
