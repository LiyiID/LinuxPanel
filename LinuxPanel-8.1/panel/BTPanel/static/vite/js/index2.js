import{g as e,bw as t,aW as a,Q as s,bx as l,aj as o,n as i,F as n,a as r,aM as u,l as c,by as m,J as p,ae as g,bz as d,aZ as f}from"./main.js?v=1714377894636";import{P as v,u as k}from"./element-lib.js?v=1714377894636";import{_ as x}from"./index77.js?v=1714377894636";import{e as b,b as _,f as L,l as y,I as h,j as T,v as C,H as j}from"./vue-lib.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import{_ as w}from"./index45.js?v=1714377894636";import{g as B,r as P}from"./files.js?v=1714377894636";import{_ as N}from"./index52.js?v=1714377894636";import{_ as $}from"./index39.js?v=1714377894636";import{_ as M}from"./index59.js?v=1714377894636";import{M as R}from"./index116.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./index42.js?v=1714377894636";import"./descriptions.js?v=1714377894636";import"./config.api.js?v=1714377894636";const S=i(b({__name:"TaskList",setup(i,{expose:n}){const{refs:{routerActive:r,msgBoxTaskCount:u},getPublicConfigInfo:c}=e(),{proxy:m}=T(),p=_(!0),g=_(!0),d=_([]),f=_(""),v=_(!1),k=_(null);let x=[],b=null;L((()=>f.value),(e=>{y((()=>{t("#taskRealTimeLogs")}))})),L((()=>u.value),(e=>{e!==C&&j()}));let C=0;const j=async(e=!0)=>{try{e&&(p.value=!0);const{data:t}=await B();if(a(t)){const{task:e,msg:a}=t;if(u.value=e.length,C=e.length,d.value=e||[],e.length>0){if(g.value=!0,0===e.length)return!1;let{type:t,status:s}=e[0];"execshell"===t?"-1"===s?(N(),f.value="",f.value=a,v.value=!0):(setTimeout((()=>{j()}),2e3),v.value=!0):v.value=!1}}else u.value=0,g.value=!1}catch(t){}finally{p.value=!1}},w=async()=>{0!==u.value&&j(!1)},N=async()=>{var e;let t=null;k.value&&(null==(e=k.value)||e.close()),k.value=s({route:"/sock_shell",onMessage:async(e,a)=>{t&&clearTimeout(t),t=setTimeout((()=>w()),5e3);const{data:s}=a;if(s.indexOf("|-Successify --- 命令已执行! ---")>-1){["/ftp","/site","/database"].includes(r.value)&&c(),await j(),setTimeout((()=>{var e;if(v.value)return!1;null==(e=k.value)||e.close(),k.value=null,f.value=""}),2e3)}else if(l(s)){if(x.push(s),x.length>50&&x.shift(),o(b))return!1;b=setTimeout((()=>{f.value=x.join(""),b=null}),500)}}}),k.value.send("tail -n 100 -f /tmp/panelExec.log")},$=async()=>{await j()};return h((()=>{var e;null==(e=k.value)||e.close()})),n({init:$}),{__sfc:!0,routerActive:r,msgBoxTaskCount:u,getPublicConfigInfo:c,vm:m,taskLogsloading:p,realTimeTask:g,taskRealTimeList:d,taskLogs:f,taskActualSocket:v,sockShell:k,taskActualNum:x,tackTimeout:b,taskNum:C,getTasksRealTimeList:j,taskPolling:w,softwareInstallDetails:N,deleteCurrentTask:async e=>{var t;let a;try{await m.$confirm({icon:"warning",title:"删除任务",message:"删除当前选中任务，删除后将取消任务执行，是否继续操作？"}),a=m.$load("正在删除任务，请稍后...");const s=await P({id:e});m.$message.request(s),s.status&&j(),null==(t=k.value)||t.close()}catch(s){}finally{null==a||a.close()}},init:$}}}),(function(){var e=this,t=e._self._c,a=e._self._setupProxy;return t("div",{directives:[{name:"loading",rawName:"v-loading",value:a.taskLogsloading,expression:"taskLogsloading"}],staticClass:"w-full h-full flex flex-col justify-center content-center"},[a.realTimeTask?t("div",{staticClass:"taskList pr-[1rem] mb-[1rem]"},e._l(a.taskRealTimeList,(function(s,l){return t("div",{key:l,staticClass:"taskItem"},["execshell"===s.type?[t("div",{staticClass:"taskItemHeader"},[t("span",{staticClass:"taskItemName"},[e._v(e._s(s.name))]),t("span",[t("span",{class:{leaveOut:"-1"===s.status}},[e._v(" "+e._s("0"===s.status?e.$t("LayoutMessage.await"):e.$t("LayoutMessage.installing"))+" ")]),t(w),t(r,{on:{click:function(e){return a.deleteCurrentTask(s.id)}}},[e._v(e._s(e.$t("LayoutMessage.delete")))])],1)]),"-1"===s.status&&"execshell"===s.type?t("pre",{directives:[{name:"scroll-bottom",rawName:"v-scroll-bottom"}],staticClass:"taskRealTimeLog",attrs:{id:"taskRealTimeLogs"}},[e._v(e._s(a.taskLogs))]):e._e()]:e._e()],2)})),0):t("div",{staticClass:"h-full"},[t("div",{staticClass:"flex align-middle justify-center h-full"},[t(v,{attrs:{description:""},scopedSlots:e._u([{key:"image",fn:function(){return[t(n,{staticClass:"text-lighter",attrs:{size:"7",name:"empty"}})]},proxy:!0},{key:"description",fn:function(){return[t("span",{staticClass:"text-[1.6rem] text-medium"},[e._v("当前没有任务执行")])]},proxy:!0}],null,!1,2062436371)})],1)]),a.taskRealTimeList.length>0?t("div",{staticClass:"taskTips"},[e._v(" "+e._s(e.$t("BtMagBox.TaskListTips"))+" ")]):e._e()])}),[],!1,null,"6c7c8679",null,null).exports;const z=i(b({__name:"CompletedList",setup(e,{expose:t}){const{proxy:a}=T(),s=C({list:[],total:0,loading:!1}),l=C({p:1,limit:10,search:"1",table:"tasks"}),o=_([{label:a.$t("BtMagBox.Name"),prop:"name"},{label:"创建时间",prop:"addtime",width:160},{label:"任务耗时",width:80,render:(e,t)=>j("span",{},u(e.end-e.start))},{label:"操作",align:"right",width:55,render:e=>null!==e.msg_info?j("span",{class:"text-primary cursor-pointer",on:{click:()=>{c({title:"当前状态：".concat(e.msg_info.title),area:[75],compData:e.msg_info,component:R})}}},"详情"):""}]),i=async()=>{try{s.loading=!0;const{data:{data:e,page:t}}=await m({...l});s.list=e,s.total=p(t)}catch(e){}finally{s.loading=!1}};return t({init:i}),{__sfc:!0,vm:a,tableData:s,tableParam:l,tableColumn:o,getCompletedList:i,changePageSize:e=>{l.p=e,i()},changePageLimit:e=>{i()}}}}),(function(){var e=this,t=e._self._c,a=e._self._setupProxy;return t(M,{scopedSlots:e._u([{key:"content",fn:function(){return[t($,{directives:[{name:"loading",rawName:"v-loading",value:a.tableData.loading,expression:"tableData.loading"}],attrs:{column:a.tableColumn,data:a.tableData.list,"element-loading-text":"加载中，请稍后..."}})]},proxy:!0},{key:"footer-right",fn:function(){return[t(N,{attrs:{layout:"prev, pager, next, total, jumper",total:a.tableData.total,"current-page":a.tableParam.p,"page-size":a.tableParam.limit,"pager-count":5},on:{"update:currentPage":function(t){return e.$set(a.tableParam,"p",t)},"update:current-page":function(t){return e.$set(a.tableParam,"p",t)},"size-change":a.changePageLimit,"current-change":a.changePageSize}})]},proxy:!0}])})}),[],!1,null,"fcb040c9",null,null).exports;var I=(e=>(e.taskList="taskList",e.completedList="completedList",e.performLog="performLog",e))(I||{});const D=i(b({__name:"index",setup(t,{expose:a}){const{refs:{msgBoxTaskCount:s,msgBoxSockShell:l,msgBosViewTabs:o}}=e(),{proxy:i}=T(),n=_(0),r=_(i.$t("BtMagBox.ExecutionLogContent")),u=_(!1);L((()=>o.value),(e=>{y((()=>{var t,a;switch(e){case"taskList":c(),null==(t=i.$refs.taskListRef)||t.init();break;case"completedList":null==(a=i.$refs.completedListRef)||a.init();break;case"performLog":m()}}))}));const c=async()=>{try{const{data:e}=await g({table:"tasks",search:"1",limit:11});n.value=p(e.page)}catch(e){}},m=async()=>{const{data:e}=await d();r.value=e},f=async()=>{o.value&&(o.value="taskList")},v=()=>{var e;o.value="",l.value&&(null==(e=l.value)||e.close(),l.value=null)};return a({onOpen:f,onCancel:v,getTaskNumber:c}),{__sfc:!0,msgBoxTaskCount:s,msgBoxSockShell:l,msgBosViewTabs:o,vm:i,tabsName:I,completedTotal:n,logContent:r,logLoading:u,getTaskNumber:c,getExecLogInfo:m,onOpen:f,onCancel:v,taskList:S,completedList:z}}}),(function(){var e=this,t=e._self._c,a=e._self._setupProxy;return t(x,{attrs:{type:"left"},model:{value:a.msgBosViewTabs,callback:function(e){a.msgBosViewTabs=e},expression:"msgBosViewTabs"}},[t(k,{attrs:{label:e.$t("BtMagBox.TaskList",{taskNumber:a.msgBoxTaskCount}),name:a.tabsName.taskList}},[t(a.taskList,{ref:"taskListRef"})],1),t(k,{attrs:{label:e.$t("BtMagBox.NewsList",{completedTotal:a.completedTotal}),name:a.tabsName.completedList,lazy:!0}},[t(a.completedList,{ref:"completedListRef"})],1),t(k,{attrs:{label:e.$t("BtMagBox.ExecutionLog"),name:a.tabsName.performLog,lazy:!0}},[t(f,{directives:[{name:"loading",rawName:"v-loading",value:a.logLoading,expression:"logLoading"}],attrs:{content:a.logContent}})],1)],1)}),[],!1,null,null,null,null).exports;export{D as default};