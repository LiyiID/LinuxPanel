import{l as e,g as t,O as a,K as s,s as r,j as n,n as o,a as i,q as l}from"./main.js?v=1714377894636";import{_ as c}from"./index84.js?v=1714377894636";import{j as m,M as p,N as u,O as d}from"./element-lib.js?v=1714377894636";import{_ as f}from"./index85.js?v=1714377894636";import{_ as v}from"./preload-helper.js?v=1714377894636";import{e as g,b as h,K as _,h as w,i as y,j as x}from"./vue-lib.js?v=1714377894636";import{g as k}from"./docker.store.js?v=1714377894636";import{s as b,N as D}from"./docker.popup.js?v=1714377894636";import{o as C}from"./software2.js?v=1714377894636";import{i as j}from"./locales-lib.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./docker.api.js?v=1714377894636";import"./check.js?v=1714377894636";const M=o(g({__name:"DockerDeployMenu",setup(o){const{proxy:i}=x(),l=h(!1),{refs:{deployMenuData:c,loading:m},getAppList:p}=k(),{refs:{mainHeight:u}}=t(),d=h(null),f=h(!1),g=h(!1),M=async e=>{a({name:e.name,type:"u",softData:{...e,callback:p}})},P=async t=>{var a;a=t,e({isAsync:!0,title:j.t("Soft.repairPlugin",{title:a.title,version:a.version}),area:50,component:()=>v((()=>import("./repairDialog.js?v=1714377894636")),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]),import.meta.url),compData:{softData:a},showClose:!0})},S=t=>{var a;a={...t,callback:p},e({isAsync:!0,title:j.t("Soft.unInstall"),area:45,btn:!1,component:()=>v((()=>import("./UnInstallDialog.js?v=1714377894636")),__vite__mapDeps([17,4,5,2,3,6,7,8,9,10,15,16]),import.meta.url),compData:{softData:a},showClose:!0})};_(d,(()=>{E()}),{distance:15});const E=async()=>{f.value||(f.value=!0,g.value=!0,c.value.list.length<c.value.total&&(c.value.p++,await p(),g.value=!1),f.value=!1)},L=async()=>{try{l.value=!0,await p()}catch(e){}finally{l.value=!1}};return w((()=>{L()})),y((()=>{c.value.list=[],c.value.p=1})),{__sfc:!0,vm:i,regionLoad:l,deployMenuData:c,loading:m,getAppList:p,mainHeight:u,scrollContainerRef:d,scrollLoading:f,noMore:g,btnText:(e,t)=>{if(e.setup&&"1"==e.task)return"uninstall"==t||"fix"==t||"更新";if("-1"!=e.task&&"0"!=e.task&&"-2"!=e.task)return"安装";switch(e.task){case"-1":return"正在安装";case"0":return"等待安装";case"-2":return"正在更新"}},renderSoftImages:e=>"".concat("/static/img/soft_ico","/ico-").concat(e.replace(/-+[{0-9},\.,]+$/,""),".png"),titleEvent:e=>e.setup?C({name:e.name,softData:e}):a({name:e.name,type:"i",softData:{...e,callback:p}}),handleCommand:(e,t)=>{switch(e){case"fix":return P(t);case"set":return void C({name:t.name,softData:t});case"uninstall":return S(t)}},isShowUpdate:e=>{if(!s(e.versions)||!e.setup)return!1;const t=e.versions[0],a=t.m_version+"."+t.version;return e.version!==a},openEvent:async e=>{if(e.setup&&"1"==e.task){if("1"==e.task)return M(e)}else{if("-1"==e.task||"0"==e.task||"-2"==e.task){let t="";switch(e.task){case"-1":t="正在安装";break;case"0":t="等待安装";break;case"-2":t="正在更新"}return i.$message.load({message:t,type:"info"})}a({name:e.name,type:"i",softData:{...e,callback:p}})}},updateSoftEvent:M,repairSoftEvent:P,unInstallEvent:S,scrollLoad:E,refreshList:e=>{c.value.p=1,i.$refs.scrollContainerRef.scrollTop=0,p(e)},changePageLimit:e=>{c.value.row=e,c.value.p=1,i.$refs.scrollContainerRef.scrollTop=0,p()},changePageSize:e=>{c.value.p=e,i.$refs.scrollContainerRef.scrollTop=0,p()},pluginPathEvent:async e=>{await v((()=>import("./main.js?v=1714377894636").then((e=>e.ek))),__vite__mapDeps([4,5,2,3,6,7,8,9,10]),import.meta.url),r("Path",e.uninsatll_checks),n("/files")},init:L,serviceCodeDialog:b,NPSDialog:D,openPluginDialog:C}}}),(function(){var e=this,t=e._self._c,a=e._self._setupProxy;return t("div",{staticClass:"w-full p-[2px]",style:"min-height:".concat(a.mainHeight-140,"px;")},[t("div",{staticClass:"flex justify-between items-center pb-[1.5rem] border-b-1 border-dashed border-[#f1f1f1]"},[t("div",{staticClass:"flex items-center"},[t(f,{staticClass:"flex justify-center docker-input",attrs:{width:"40rem",iconType:"search",placeholder:"支持应用名称、字段模糊搜索",clearable:""},on:{clear:a.refreshList,submit:a.refreshList},model:{value:a.deployMenuData.search,callback:function(t){e.$set(a.deployMenuData,"search",t)},expression:"deployMenuData.search"}}),t("span",{staticClass:"text-[1.4rem] text-[#666] leading-[2rem] mx-[2rem]"},[e._v(" 如果您希望添加其它Docker应用，请 "),t(i,{domProps:{textContent:e._s("联系客服")},on:{click:function(e){return a.serviceCodeDialog()}}}),e._v(" ,或进行 "),t(i,{domProps:{textContent:e._s("需求反馈")},on:{click:function(e){return a.NPSDialog()}}})],1)],1),t(l,{attrs:{type:"default"},on:{click:function(e){return a.refreshList(!0)}}},[e._v("更新应用列表")])],1),t("div",{directives:[{name:"bt-loading",rawName:"v-bt-loading",value:a.loading,expression:"loading"},{name:"bt-loading",rawName:"v-bt-loading:title",value:"正在加载应用列表，请稍候...",expression:"'正在加载应用列表，请稍候...'",arg:"title"}],staticClass:"flex flex-wrap"},[t("div",{staticClass:"menu-con"},[t("div",{staticStyle:{margin:"0 auto"}},[t("div",{ref:"scrollContainerRef",staticClass:"soft-con",style:"max-height:".concat(a.mainHeight-280,"px;min-height:").concat(a.mainHeight-280,"px;")},[e._l(a.deployMenuData.list,(function(s){return t("div",{staticClass:"soft-card w-[40%] min-w-[51rem] mr-[2rem] h-[10rem]"},[t("div",{staticClass:"soft justify-between"},[t("div",{staticClass:"flex items-center",class:a.isShowUpdate(s)?"w-[50%]":"w-[68%]"},[t("img",{staticClass:"dk-fast-project-icon w-[3rem] h-[3rem] mr-[1.2rem] text-center flex justify-center items-center cursor-pointer",attrs:{src:a.renderSoftImages(s.name),alt:""},on:{error:e=>{e.target.src.includes("icon_plug")?e.target.style.display="none":e.target.src="/static/img/soft_ico/icon_plug.svg"},click:function(e){return a.titleEvent(s)}}}),t("div",{staticClass:"soft-msg w-full"},[t("div",{staticClass:"text-[1.6rem] text-[#333] leading-[1.4] cursor-pointer",on:{click:function(e){return a.titleEvent(s)}}},[e._v(" "+e._s("".concat(s.title.replace("(Docker应用)","")).concat(""!==s.version?"    v".concat(s.version):""))+" ")]),t(m,{attrs:{content:s.ps,placement:"top","open-delay":500}},[t("div",{staticClass:"text-[1.4rem] text-[#666] leading-[1.4] mt-[1rem] w-full truncate",domProps:{innerHTML:e._s(s.ps)}})])],1)]),t("div",{staticClass:"btn-group"},[a.isShowUpdate(s)?t(l,{staticClass:"!border-primary !text-primary !hover:text-white !hover:bg-primary text-[1.4rem] w-[8rem] h-[3.1rem] mt-[1.5rem] !ml-8x",attrs:{type:"default"},on:{click:function(e){return a.updateSoftEvent(s)}}},[e._v("更新")]):e._e(),s.setup?e._e():t(l,{staticClass:"text-[1.4rem] w-[8rem] h-[3.1rem] mt-[1.5rem] !ml-[2rem]",on:{click:function(e){return a.openEvent(s)}}},[e._v(e._s(a.btnText(s)))]),s.setup?t(p,{staticClass:"!ml-[2rem]",attrs:{"split-button":""},on:{click:function(e){return a.openPluginDialog({name:s.name,softData:s})},command:e=>a.handleCommand(e,s)}},[e._v(" 管理 "),t(u,{attrs:{slot:"dropdown"},slot:"dropdown"},[t(d,{attrs:{command:"fix"}},[e._v("修复")]),t(d,{attrs:{command:"uninstall"}},[e._v("卸载")])],1)],1):e._e()],1)])])})),t("div",{directives:[{name:"show",rawName:"v-show",value:a.deployMenuData.list.length%2!=0,expression:"deployMenuData.list.length % 2 !== 0"}],staticClass:"soft-card w-[40%] min-w-[51rem] mr-[2rem] h-[14rem] opacity-0"}),a.deployMenuData.list.length?e._e():t(c,{staticClass:"w-[100%]",attrs:{description:" "},scopedSlots:e._u([{key:"default",fn:function(s){return[t("span",[e._v("未查询到搜索内容,"),t(i,{on:{click:a.NPSDialog}},[e._v("提交需求反馈")])],1)]}}],null,!1,2174207188)}),t("div",{directives:[{name:"show",rawName:"v-show",value:a.noMore&&0!==a.deployMenuData.list.length,expression:"noMore && deployMenuData.list.length !== 0"},{name:"bt-loading",rawName:"v-bt-loading",value:a.scrollLoading,expression:"scrollLoading"},{name:"bt-loading",rawName:"v-bt-loading:title",value:"正在加载更多，请稍候...",expression:"'正在加载更多，请稍候...'",arg:"title"}],staticClass:"scroll-load"},[t("span",[e._v("没有更多了,如没有想要的应用可"),t(i,{on:{click:a.NPSDialog}},[e._v("提交需求反馈")])],1)]),t("div",{directives:[{name:"show",rawName:"v-show",value:!a.noMore,expression:"!noMore"}],staticClass:"w-full h-[10rem]"})],2)])])])])}),[],!1,null,"acb12f9e",null,null).exports;export{M as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./repairDialog.js?v=1714377894636","./index118.js?v=1714377894636","./vue-lib.js?v=1714377894636","./__commonjsHelpers__.js?v=1714377894636","./main.js?v=1714377894636","./modulepreload-polyfill.js?v=1714377894636","./preload-helper.js?v=1714377894636","./request-lib.js?v=1714377894636","./locales-lib.js?v=1714377894636","./public-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./index41.js?v=1714377894636","./element-lib.js?v=1714377894636","./index76.js?v=1714377894636","./element-lib.js?v=1714377894636","./soft.store.js?v=1714377894636","./soft.api.js?v=1714377894636","./UnInstallDialog.js?v=1714377894636"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
