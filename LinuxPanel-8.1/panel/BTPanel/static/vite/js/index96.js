import{_ as t}from"./index51.js?v=1714377894636";import{_ as e}from"./index77.js?v=1714377894636";import{_ as s}from"./index46.js?v=1714377894636";import{_ as a}from"./preload-helper.js?v=1714377894636";import{e as i,b as n,h as o,j as l,v as r}from"./vue-lib.js?v=1714377894636";import{cb as c,cc as p,cd as m,ce as u,l as d,n as _,cf as v,ao as f}from"./main.js?v=1714377894636";import{getFirewallStore as g}from"./firewall.store.js?v=1714377894636";import{_ as w}from"./index118.js?v=1714377894636";import{_ as y}from"./index39.js?v=1714377894636";import{_ as h}from"./index59.js?v=1714377894636";import{c as b}from"./firewall.table.js?v=1714377894636";import{c as x}from"./check.js?v=1714377894636";import"./element-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./index42.js?v=1714377894636";import"./index.vue_vue_type_style_index_0_lang.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./firewall.popup.js?v=1714377894636";import"./index38.js?v=1714377894636";import"./index45.js?v=1714377894636";const j=_(i({__name:"OverviewList",setup(t){const{proxy:e}=l(),s=n(!1),i=n([]),r=n({}),_=n([]),v=n([{text:"开启防提权，系统会针对该用户操作命令进行限制，并记录跟踪"},{text:"不开启防提权，系统只针对该用户操作过的命令做记录跟踪"},{text:"目前防提权默认只针对www,redis,mysql操作引起的提权问题进行处理"},{color:"text-[#FF6500]",text:"消息推送需要更新至最新面板的版本(2020-06-17日之后安装的版本|或者2020-06-17日之后点击过修复面板)"}]),f=async()=>{try{s.value=!0;const{data:t}=await c();i.value=x(t.system_user,"array",[])}catch(t){}finally{s.value=!1}},g=async(t,s)=>{const a=e.$load("正在"+(s?"开启":"关闭")+"防入侵，请稍后...");try{const s=await p(!t[3],{user:t[0]});await e.$message.request(s),f(),a.close()}catch(i){}finally{a.close()}},w=async(t,s,a)=>{const i=e.$load("正在"+(a?"开启":"关闭")+"日志状态，请稍后...");try{const s=await m(!t[5],{uid:t[1]});await e.$message.request(s),f(),i.close()}catch(n){}finally{i.close()}},y=async t=>{try{const{data:s}=await u({user:t[0]});if(0==s.length)return e.$message.error("暂无命令日志");_.value=[];for(let t=0;t<s.length;t++)_.value.push({title:s[t],key:s[t]});r.value={user:t[0],dateTime:s[0],dateOptions:_.value},d({title:"命令日志",area:72,isAsync:!0,component:()=>a((()=>import("./IntrusionOpenCommandLog.js?v=1714377894636")),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]),import.meta.url),compData:r.value})}catch(s){}},h=b({changeIntrusion:g,changeOpen:w,getLogs:y});return o((()=>{f()})),{__sfc:!0,vm:e,loading:s,getData:i,rowData:r,dateOptions:_,help_list:v,currentListPage:f,changeIntrusion:g,changeOpen:w,getLogs:y,tableColumn:h}}}),(function(){var t=this,e=t._self._c,s=t._self._setupProxy;return e("div",[e(h,{scopedSlots:t._u([{key:"content",fn:function(){return[e(y,{directives:[{name:"loading",rawName:"v-loading",value:s.loading,expression:"loading"}],ref:"table",attrs:{column:s.tableColumn,data:s.getData,height:"620",description:"概览列表为空","element-loading-text":"正在加载概览列表，请稍后..."}})]},proxy:!0},{key:"popup",fn:function(){},proxy:!0}])}),e(w,{staticClass:"mx-[1.6rem] my-[0.6rem]",attrs:{list:s.help_list,listStyle:"disc"}})],1)}),[],!1,null,null,null,null).exports;const I=_(i({__name:"index",setup(t){const{proxy:e}=l(),{refs:{isIntrusion:s}}=g(),i=n(0),p=n(0),m=n({}),u=r({title:"入侵防御-功能介绍",ps:"原防提权, 防御大多数的入侵提权攻击造成的挂马和被挖矿,有效拦截webshell执行提权,并及时告警通知",source:105,desc:["违规词内容检测","网页内容修改检测","输出检测报告"],tabImgs:[{title:"概览",imgSrc:"https://www.bt.cn/Public/new/plugin/introduce/firewall/intrusion_1.png"},{title:"进程白名单",imgSrc:"https://www.bt.cn/Public/new/plugin/introduce/firewall/intrusion_2.png"},{title:"操作日志",imgSrc:"https://www.bt.cn/Public/new/plugin/introduce/firewall/intrusion_3.png"}],isInstall:!1,productSrc:"https://www.bt.cn/bbs/thread-50998-1-1.html",pluginInfo:{}}),d=n("overviewList"),_=n([{title:"概览",type:"overviewList",component:j},{title:"进程白名单",type:"processWhiteList",component:()=>a((()=>import("./ProcessWhiteList.js?v=1714377894636")),__vite__mapDeps([15,11,10,5,4,9,2,3,6,7,8,12,14,16,17,18,19,20,21,22,23]),import.meta.url)},{title:"操作日志",type:"operationLog",component:()=>a((()=>import("./OperationLog.js?v=1714377894636")),__vite__mapDeps([24,25,5,10,4,9,2,3,6,7,8,11,12,14,18,19,20,21,16,17,22,23]),import.meta.url)}]),w=async()=>{try{const{data:t}=await c();s.value=t.open,i.value=t.totla_times,p.value=t.totla_days}catch(t){}},y=async()=>{try{const{data:t}=await f({sName:"bt_security"});m.value=t,u.pluginInfo=t,u.isInstall=!m.value.setup&&m.value.endtime>0}catch(t){}};return o((()=>{y(),w()})),{__sfc:!0,vm:e,isIntrusion:s,totlaTimes:i,totlaDays:p,pluginInfo:m,productData:u,tabAvtive:d,tabComponent:_,cutTabs:t=>{"overviewList"===t.name&&w()},onChangeIntrusion:async t=>{let s=e.$load("正在"+(t?"开启":"关闭")+"入侵防御，请稍后...");try{const a=await v(t);await e.$message.request(a),s.close()}catch(a){}finally{s.close()}},getIntrusionInfo:w,getFind:y}}}),(function(){var a=this,i=a._self._c,n=a._self._setupProxy;return i("div",[n.pluginInfo.setup&&n.pluginInfo.endtime>0?i("div",{staticClass:"flex flex-col"},[i("div",{staticClass:"tab-header-operate"},[i("div",{staticClass:"mr-4"},[a._v("入侵防御开关")]),i("div",[i(s,{attrs:{width:36},on:{change:n.onChangeIntrusion},model:{value:n.isIntrusion,callback:function(t){n.isIntrusion=t},expression:"isIntrusion"}})],1),i("div",{staticClass:"bg-[#ccc] w-[1px] h-2rem mx-8"}),i("div",[a._v(" 总拦截次数: "),i("span",{class:n.totlaTimes>0?"text-danger":""},[a._v(a._s(n.totlaTimes))])]),i("div",{staticClass:"bg-[#ccc] w-[1px] h-2rem mx-8"}),i("div",[a._v("保护天数: "+a._s(n.totlaDays))])]),i(e,{attrs:{type:"navtwo",config:n.tabComponent},on:{"tab-click":n.cutTabs},model:{value:n.tabAvtive,callback:function(t){n.tabAvtive=t},expression:"tabAvtive"}})],1):i(t,{staticClass:"px-[20%] my-[8rem]",attrs:{data:n.productData}})],1)}),[],!1,null,null,null,null).exports;export{I as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./IntrusionOpenCommandLog.js?v=1714377894636","./index98.js?v=1714377894636","./main.js?v=1714377894636","./modulepreload-polyfill.js?v=1714377894636","./vue-lib.js?v=1714377894636","./__commonjsHelpers__.js?v=1714377894636","./preload-helper.js?v=1714377894636","./request-lib.js?v=1714377894636","./locales-lib.js?v=1714377894636","./public-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./index39.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./index59.js?v=1714377894636","./ProcessWhiteList.js?v=1714377894636","./firewall.popup.js?v=1714377894636","./check.js?v=1714377894636","./firewall.table.js?v=1714377894636","./index46.js?v=1714377894636","./element-lib.js?v=1714377894636","./index.vue_vue_type_style_index_0_lang.js?v=1714377894636","./index38.js?v=1714377894636","./index45.js?v=1714377894636","./OperationLog.js?v=1714377894636","./index52.js?v=1714377894636"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
