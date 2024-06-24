import{g as e,n as t,q as a,b as r,a as i}from"./main.js?v=1714377894636";import{_ as l}from"./index85.js?v=1714377894636";import{w as o,x as s,q as n,s as c}from"./element-lib.js?v=1714377894636";import{_ as p}from"./index46.js?v=1714377894636";import{_ as d}from"./index120.js?v=1714377894636";import{_ as m}from"./index53.js?v=1714377894636";import{_ as u}from"./index39.js?v=1714377894636";import{_ as v}from"./index55.js?v=1714377894636";import{_ as h}from"./index59.js?v=1714377894636";import{e as f,b as y,v as b,h as g,j as x}from"./vue-lib.js?v=1714377894636";import{g as _,a as w,e as F}from"./index38.js?v=1714377894636";import{g as j,cE as C,cF as R,cG as k,cH as $,cI as L,cJ as P,cK as S,cL as T,cM as D,cN as E,cO as q,cP as U,cQ as z,O as N,Q as A,R as B,cR as I,cS as O,ai as J,al as G,cT as H}from"./site.store.js?v=1714377894636";import{o as M}from"./index61.js?v=1714377894636";import{a as Q}from"./confirm.js?v=1714377894636";import{c as K}from"./check.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./index.vue_vue_type_style_index_0_lang.js?v=1714377894636";import"./index45.js?v=1714377894636";import"./config.js?v=1714377894636";const V=t(f({__name:"RedirectSite",props:{compData:{default:{}}},setup(t){var a;const r=t,{refs:{webServerType:i}}=e(),{refs:{siteTabActiveList:l,siteInfo:o}}=j(),{proxy:s}=x(),n=y(!1),c=y("添加重定向"),p=y(!1),d=y([]),m=y(!1),u=y(!1),v=y(null==(a=o.value.project_type)?void 0:a.toLowerCase()),h=y(""),f=b({type:!0,holdpath:!0,domainorpath:"domain",redirecttype:"301",redirectpath:"",tourl:"http://",redirectdomain:[]}),V=y(),W=y({}),X=y(!1),Y=y(""),Z=y({mode:"ace/mode/nginx",theme:"ace/theme/chroGetFileBodyme",wrap:!0,showInvisibles:!1,showFoldWidgets:!1,useSoftTabs:!0,tabSize:2,showPrintMargin:!1,readOnly:!1,fontSize:"12px"}),ee=y([]),te={tourl:[{required:!0,message:"请输入目标URL",trigger:"blur"},{vaildator:(e,t,a)=>{if("http://"===t||"https://"===t)a(new Error("请输入目标URL"));else{new RegExp("^((https|http|ftp|rtsp|mms)?://)?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\\.[a-z]{2,6})(:[0-9]{1,4})?((/?)|(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$").test(t)?a():a(new Error("请输入正确的URL"))}}}]},ae=y(!1),re=b({type:!0,errorpage:"1",redirecttype:"301",topath:"/",tourl:""}),ie=y(),le=y([]),oe=b({isRecurrence:!1,describe:{title:"",th:"",message:"",propsValue:""}}),se=async()=>{m.value=!0;try{let e;e="php"===v.value?await R({sitename:o.value.name}):await k({sitename:o.value.name},v.value),d.value=e.data}catch(e){}finally{m.value=!1}},ne=e=>{c.value=e?"编辑重定向":"添加重定向",n.value=!0,e&&(f.type=1===e.type,f.holdpath=1===e.holdpath,f.domainorpath=e.domainorpath,f.redirecttype=e.redirecttype,f.redirectpath=e.redirectpath,f.tourl=e.tourl,f.redirectdomain=e.redirectdomain,f.redirectname=e.redirectname),ue()},ce=e=>{e?(re.type=1===e.type,re.redirecttype=e.redirecttype,re.topath=e.topath,re.tourl=e.tourl):d.value.forEach((e=>{e.errorpage&&(re.type=1===e.type,re.redirecttype=e.redirecttype,re.topath=e.topath,re.tourl=e.tourl)})),ae.value=!0},pe=async e=>{Q({confirm:{title:"删除重定向规则【".concat(e.sitename,"】"),message:"删除选中的规则后，配置的重定向域名/目录将指向源地址，是否继续操作？",icon:"warning",type:"calc"},loading:"正在删除，请稍后...",request:async()=>"php"===v.value?await $({sitename:o.value.name,redirectname:e.redirectname}):"proxy"===v.value?await L({site_name:r.compData.name,redirectname:e.redirectname}):await P({sitename:o.value.name,redirectname:e.redirectname},v.value),complete:se})},de=()=>{n.value=!1,f.type=!0,f.holdpath=!0,f.domainorpath="domain",f.redirectdomain=[],f.redirecttype="301",f.redirectname="",f.redirectpath="",f.tourl="http://"},me=e=>{W.value=e,X.value=!0,he(e)},ue=async()=>{try{let e;e="php"===v.value||"html"===v.value?await z({table:"domain",list:"True",search:o.value.id}):"python"===v.value?await N({data:JSON.stringify({name:o.value.name})}):"proxy"===v.value?await A({id:r.compData.id,site_name:r.compData.name}):await B({data:JSON.stringify({project_name:o.value.name})},v.value);let t=e.data;if("proxy"===v.value&&(t=e.data.domain_list),f.redirectname)ee.value=t;else if(d.value.length){let e=d.value.map((e=>e.redirectdomain)).flat();ee.value=t.filter((t=>!e.includes(t.name)))}else ee.value=t}catch(e){}},ve=async(e,t)=>{let a;t||(a=s.$load("正在处理中,请稍后..."));try{let a,i={...e,type:e.type?"0":"1",redirectdomain:JSON.stringify(e.redirectdomain)};return delete i.redirect_conf_file,"php"===v.value?a=await S(i):"proxy"===v.value?(i.site_name=r.compData.name,delete i.sitename,a=await T(i)):a=await D(i,v.value),t||(s.$message.request(a),se()),a}catch(i){}finally{null==a||a.close()}},he=async e=>{try{let t;if(p.value=!0,"php"===v.value||"html"===v.value)t=await I({webserver:i.value,sitename:o.value.name,redirectname:e.redirectname}),t.status?(X.value=!0,Y.value=t.data[0].data,h.value=t.data[1]):(s.$message.error(t.msg),X.value=!1);else if("proxy"===v.value){if(t=await O({path:e.redirect_conf_file}),!t.status)return s.$message.error(t.msg),void(X.value=!1);h.value=e.redirect_conf_file,Y.value=t.data.data}else{if(t=await J({path:e.redirect_conf_file}),!t.status)return X.value=!1,void s.$message.error(t.msg);h.value=e.redirect_conf_file,Y.value=t.data.data}}catch(t){}finally{p.value=!1}},fe=y([{label:"启用重定向规则",value:"startRules",diyBatch:()=>{ye("start")}},{label:"停用重定向规则",value:"stopRules",diyBatch:()=>{ye("stop")}},{label:"删除重定向规则",value:"delRules",diyBatch:()=>{M({title:"批量删除当前选中的规则后，配置的重定向域名/目录将会彻底失效，是否继续操作？",dataList:le.value,isRecurrence:!0,titleType:"批量删除",requestFun:async e=>await C({site_id:o.value.id,redirectnames:e.redirectname}),tableColumn:[{label:"规则名称",render:e=>{var t;return e.errorpage?"404错误页面":"domain"===e.domainorpath?null==(t=K(e.redirectdomain,"array",[]))?void 0:t.join("、"):e.redirectpath}},{prop:"result",label:"状态"}],callback:()=>{se()}})}}]),ye=async e=>{M({title:"批量"+("stop"===e?"停止":"启动")+"当前选中的规则后,配置的重定向域名/目录将"+("stop"===e?"不再":"重新")+"指向目标地址，是否继续操作？",dataList:le.value,isRecurrence:!0,titleType:"批量"+("stop"===e?"停止":"启动")+"项目",requestFun:async e=>await ve(e,!0),tableColumn:[{label:"分组名称",render:e=>{var t;return e.errorpage?"404错误页面":"domain"===e.domainorpath?null==(t=K(e.redirectdomain,"array",[]))?void 0:t.join("、"):e.redirectpath}},{prop:"result",label:"状态"}],callback:()=>{se()}})},be=y([_(),{label:"被重定向",render:e=>{var t;return e.errorpage?"404错误页面":"domain"===e.domainorpath?null==(t=K(e.redirectdomain,"array",[]))?void 0:t.join("、"):e.redirectpath}},{label:"重定向类型",prop:"domainorpath",render:e=>e.errorpage?"错误":"domain"===e.domainorpath?"域名":"路径"},{label:"重定向到",render:e=>e.topath?e.topath:e.tourl},w({prop:"type",event:e=>{ve(e)},data:["已停止","运行中"]}),F([{width:70,title:"配置文件",onClick:e=>{me(e)}},{title:"编辑",onClick:e=>{e.errorpage?ce(e):ne(e)}},{onClick:e=>{pe(e)},title:"删除"}])]);return g((()=>{var e,t;let a=null==(e=o.value.project_type)?void 0:e.toLowerCase();"node"===a&&(a="nodejs"),"nginx"===a&&(a="proxy"),v.value=a,(null==(t=o.value.project_config)?void 0:t.bind_extranet)&&(u.value=!!o.value.project_config.bind_extranet),"php"!==v.value&&"html"!==v.value&&"proxy"!==v.value||(u.value=!0),se()})),{__sfc:!0,props:r,webServerType:i,siteTabActiveList:l,siteInfo:o,vm:s,redirectPopup:n,redirectPopupTitle:c,contentLoading:p,tableData:d,tableLoading:m,isBindExtranet:u,siteType:v,configPath:h,redirectForm:f,aceEditor:V,rowData:W,configPopup:X,configContent:Y,config:Z,damainData:ee,rules:te,errorPopup:ae,errForm:re,redirectPopupRef:ie,checkedList:le,batchConfig:oe,handleSelectionChange:e=>{le.value=e},getRedirectList:se,addRedirect:ne,addErrRedirect:ce,jumpPath:()=>{l.value.moduleSettingsAct="mapping",l.value.isJump=!0},delRedirect:pe,onConfirm:async()=>{s.$refs.redirectPopupRef.validate((async e=>{if(e){let e=s.$load("正在设置中,请稍后...");try{let e,t={...f,sitename:o.value.name,holdpath:f.holdpath?"1":"0",type:f.type?"1":"0",redirectdomain:JSON.stringify(f.redirectdomain)};if(t.redirectname)"php"===v.value?e=await S(t):"proxy"===v.value?(t.site_name=r.compData.name,delete t.sitename,e=await T(t)):e=await D(t,v.value);else{let a=(new Date).getTime();t.redirectname=a,"php"===v.value?e=await E(t):"proxy"===v.value?(t.site_name=r.compData.name,delete t.sitename,e=await q(t)):e=await U(t,v.value)}s.$message.request(e),e.status&&de(),se()}catch(t){}finally{e.close()}}}))},cancelPopup:de,openConfigPopup:me,selectAll:e=>{f.redirectdomain=ee.value.map((e=>e.name))},unAll:e=>{f.redirectdomain=[]},getDomain:ue,changeStatus:ve,getFileBodyEvent:he,saveFile:async()=>{let e=s.$load("正在保存，请稍后...");try{const e=await G({path:h.value,data:Y.value,encoding:"utf-8"});s.$message.request(e)}catch(t){}finally{e.close()}},onErrorRedirect:async()=>{let e=s.$load("正在保存，请稍后...");try{let e,t=!1,a={...re,sitename:o.value.name,type:re.type?1:0};if(d.value.forEach((e=>{e.errorpage&&(t=e.redirectname)})),"html"===v.value&&(a.domainorpath="path",a.holdpath=999,a.redirectpath=""),t||"html"===v.value)e="php"===v.value?await S({...a,redirectname:t}):await D({...a,redirectname:t},v.value);else{let t=(new Date).getTime();e=await H({...a,redirectname:t})}s.$message.request(e),e.status&&(ae.value=!1),se()}catch(t){}finally{e.close()}},batchGroup:fe,handleMult:ye,tableColumns:be}}}),(function(){var e=this,t=e._self._c,f=e._self._setupProxy;return t("div",{staticClass:"h-full"},[f.isBindExtranet?t(h,{scopedSlots:e._u([{key:"header-left",fn:function(){return[t(a,{on:{click:function(e){return f.addRedirect(!1)}}},[e._v("添加重定向")]),"php"===f.siteType||"html"===f.siteType?t(a,{attrs:{type:"default"},on:{click:function(e){return f.addErrRedirect(!1)}}},[e._v("404重定向")]):e._e()]},proxy:!0},{key:"header-right",fn:function(){return[t(v,{attrs:{refresh:f.getRedirectList}})]},proxy:!0},{key:"content",fn:function(){return[t(u,{directives:[{name:"loading",rawName:"v-loading",value:f.tableLoading,expression:"tableLoading"}],attrs:{"max-height":"460",column:f.tableColumns,data:f.tableData},on:{"selection-change":f.handleSelectionChange}})]},proxy:!0},{key:"footer-left",fn:function(){return[t("div",{staticClass:"flex flex-col"},["php"===f.siteType?t(m,{attrs:{data:f.batchGroup,config:f.batchConfig,"batch-fn":()=>{}}}):e._e(),t("ul",{staticClass:"mt-8x leading-8 text-[1.2rem] list-disc ml-20x"},[t("li",[e._v("设置域名重定向后，该域名的404重定向将失效")])])],1)]},proxy:!0},{key:"popup",fn:function(){return[t(r,{attrs:{title:f.redirectPopupTitle,visible:f.redirectPopup,area:68,confirmText:e.$t("Config.Submit"),showFooter:""},on:{"update:visible":function(e){f.redirectPopup=e},confirm:f.onConfirm,cancel:f.cancelPopup}},[t("div",{staticClass:"p-20x"},[t(o,{ref:"redirectPopupRef",attrs:{"label-position":"right",model:f.redirectForm,rules:f.rules}},[t(s,{attrs:{label:"开启重定向"}},[t("div",{staticClass:"flex items-center"},[t(p,{model:{value:f.redirectForm.type,callback:function(t){e.$set(f.redirectForm,"type",t)},expression:"redirectForm.type"}}),t(s,{staticClass:"ml-[4rem]",attrs:{label:"保留URL参数"}},[t(p,{model:{value:f.redirectForm.holdpath,callback:function(t){e.$set(f.redirectForm,"holdpath",t)},expression:"redirectForm.holdpath"}})],1)],1)]),t(s,{attrs:{label:"重定向类型"}},[t("div",{staticClass:"flex items-center"},[t(n,{model:{value:f.redirectForm.domainorpath,callback:function(t){e.$set(f.redirectForm,"domainorpath",t)},expression:"redirectForm.domainorpath"}},[t(c,{attrs:{label:"域名",value:"domain"}}),t(c,{attrs:{label:"路径",value:"path"}})],1),t(s,{attrs:{label:"重定向方式"}},[t(n,{model:{value:f.redirectForm.redirecttype,callback:function(t){e.$set(f.redirectForm,"redirecttype",t)},expression:"redirectForm.redirecttype"}},[t(c,{attrs:{label:"301（永久重定向）",value:"301"}}),t(c,{attrs:{label:"302（临时重定向）",value:"302"}})],1)],1)],1)]),t(s,{attrs:{label:"重定向".concat("domain"===f.redirectForm.domainorpath?"域名":"路径")}},[t("div",{staticClass:"flex items-center"},["domain"===f.redirectForm.domainorpath?t(n,{attrs:{"collapse-tags":"",multiple:""},model:{value:f.redirectForm.redirectdomain,callback:function(t){e.$set(f.redirectForm,"redirectdomain",t)},expression:"redirectForm.redirectdomain"}},[t("div",{staticClass:"flex items-center justify-center mb-8x checked-button px-8x"},[t(a,{attrs:{type:"default"},on:{click:f.selectAll}},[e._v("全选")]),t(a,{attrs:{type:"default"},on:{click:f.unAll}},[e._v("取消全选")])],1),e._l(f.damainData,(function(e,a){return t(c,{key:a,attrs:{value:e.name,label:e.name}})}))],2):t(l,{attrs:{width:"17.1rem",placeholder:"如：http://b.com"},model:{value:f.redirectForm.redirectpath,callback:function(t){e.$set(f.redirectForm,"redirectpath",t)},expression:"redirectForm.redirectpath"}}),t(s,{attrs:{label:"目标url",prop:"tourl"}},[t(l,{model:{value:f.redirectForm.tourl,callback:function(t){e.$set(f.redirectForm,"tourl",t)},expression:"redirectForm.tourl"}})],1)],1)]),t("ul",{staticClass:"mt-20x leading-8 text-[1.2rem] list-disc ml-20x"},[t("li",[e._v("重定向类型：表示访问选择的“域名”或输入的“路径”时将会重定向到指定URL")]),t("li",[e._v(" 目标URL：可以填写你需要重定向到的站点，目标URL必须为可正常访问的URL，否则将返回错误 ")]),t("li",[e._v("重定向方式：使用301表示永久重定向，使用302表示临时重定向")]),t("li",[e._v(" 保留URI参数：表示重定向后访问的URL是否带有子路径或参数如设置访问http://b.com ")]),t("li",[e._v(" 重定向到http://a.com 保留URI参数： http://b.com/1.html ---\x3e http://a.com/1.html ")]),t("li",[e._v("不保留URI参数：http://b.com/1.html ---\x3e http://a.com")])])],1)],1)]),t(r,{attrs:{title:"编辑配置文件",visible:f.configPopup,area:54},on:{"update:visible":function(e){f.configPopup=e}}},[t("div",{staticClass:"p-20x"},[e._v(" 提示：Ctrl+F 搜索关键字，Ctrl+S 保存，Ctrl+H 查找替换 "),t(d,{directives:[{name:"loading",rawName:"v-loading",value:f.contentLoading,expression:"contentLoading"}],ref:"aceEditor",staticClass:"!h-[36rem] my-8x",attrs:{"file-path":f.configPath,"is-request":!1,config:f.config},model:{value:f.configContent,callback:function(e){f.configContent=e},expression:"configContent"}}),t(a,{on:{click:f.saveFile}},[e._v("保存")]),t("ul",{staticClass:"mt-8x leading-8 text-[1.2rem] list-disc ml-20x"},[t("li",[e._v("此处为该负载均衡的配置文件，若您不了解配置规则,请勿随意修改。")])])],1)]),t(r,{attrs:{title:"404重定向设置",visible:f.errorPopup,area:42,showFooter:""},on:{confirm:f.onErrorRedirect,"update:visible":function(e){f.errorPopup=e}}},[t("div",{staticClass:"p-20x"},[t(o,{attrs:{"label-position":"right",model:f.errForm}},[t(s,{attrs:{label:"开启重定向"}},[t(p,{model:{value:f.errForm.type,callback:function(t){e.$set(f.errForm,"type",t)},expression:"errForm.type"}})],1),t(s,{attrs:{label:"错误类型"}},[t(n,{model:{value:f.errForm.errorpage,callback:function(t){e.$set(f.errForm,"errorpage",t)},expression:"errForm.errorpage"}},[t(c,{attrs:{label:"页面404",value:"1"}})],1)],1),t(s,{attrs:{label:"重定向方式"}},[t(n,{model:{value:f.errForm.redirecttype,callback:function(t){e.$set(f.errForm,"redirecttype",t)},expression:"errForm.redirecttype"}},[t(c,{attrs:{label:"301（永久重定向）",value:"301"}}),t(c,{attrs:{label:"302（临时重定向）",value:"302"}})],1)],1),t(s,{attrs:{label:"404错误重定向"}},[t(n,{model:{value:f.errForm.topath,callback:function(t){e.$set(f.errForm,"topath",t)},expression:"errForm.topath"}},[t(c,{attrs:{label:"首页",value:"/"}}),t(c,{attrs:{label:"自定义",value:""}})],1)],1),t(s,{directives:[{name:"show",rawName:"v-show",value:""===f.errForm.topath,expression:"errForm.topath === ''"}],attrs:{label:"404错误重定向"}},[t(l,{attrs:{placeholder:"例:http://www.bt.cn"},model:{value:f.errForm.tourl,callback:function(t){e.$set(f.errForm,"tourl",t)},expression:"errForm.tourl"}})],1)],1)],1)])]},proxy:!0}],null,!1,284208398)}):t("div",{staticClass:"bg-[#7F7F7F] flex items-center justify-center h-full"},[t("div",{staticClass:"bg-white px-48x py-16x text-[#333]"},[e._v(" 请开启 "),t(i,{on:{click:f.jumpPath}},[e._v("外网映射")]),e._v(" 后查看配置信息 ")],1)])],1)}),[],!1,null,"53a11bb4",null,null).exports;export{V as default};
