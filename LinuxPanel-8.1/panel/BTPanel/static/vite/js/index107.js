import{_ as a}from"./index51.js?v=1714377894636";import{_ as e}from"./index52.js?v=1714377894636";import{_ as t}from"./index39.js?v=1714377894636";import{q as s,s as l,y as r,ab as o,u as n,Q as i}from"./element-lib.js?v=1714377894636";import{g as c,J as u,n as p,q as m,D as f,y as g}from"./main.js?v=1714377894636";import"./radio-button.js?v=1714377894636";import{_ as d}from"./index57.js?v=1714377894636";import{_ as v}from"./index59.js?v=1714377894636";import{e as h,v as y,b,h as _,j as x}from"./vue-lib.js?v=1714377894636";import{m as k,s as T,n as P,o as D,p as S,a as j,q as w,r as C,g as W,t as q,v as L,w as A,x as F,y as M}from"./logs.table.js?v=1714377894636";import{_ as O}from"./index77.js?v=1714377894636";import{_ as E}from"./index43.js?v=1714377894636";import{_ as H}from"./index33.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./index42.js?v=1714377894636";import"./date-picker.js?v=1714377894636";import"./date-util.js?v=1714377894636";import"./check.js?v=1714377894636";import"./index58.js?v=1714377894636";import"./index45.js?v=1714377894636";const z=p(h({__name:"FtpLogs",setup(a,{expose:e}){const{refs:{authType:t}}=c(),{proxy:s}=x(),l=y({p:1,limit:10,search:"",total:0,user_name:""}),r=b([]),o=b([]),n=b("登录日志"),i=b(k({})),p=y({title:"FTP日志-功能介绍",ps:"记录FTP登录记录，FTP上传、下载、重命名和删除记录.",source:131,desc:["FTP登录记录","FTP上传记录","FTP重命名记录","FTP删除记录"],tabImgs:[{title:"FTP日志",imgSrc:"https://www.bt.cn/Public/new/plugin/introduce/logs/ftp-logs.png"}]}),m=async()=>{try{i.value=k({});const a=await T({exec_name:"getlog"});if("start"!=a.msg)return s.$message.request(a);delete l.total;const e=await P(l);o.value=e.data.data,l.total=u(e.data.page)}catch(a){}},f=async()=>{try{i.value=D();const a=await S({...l,type:"all"});o.value=a.data,l.total=u(a.page)}catch(a){}},g=async()=>{var a;try{const e=await j({p:1,limit:99999,search:"",table:"ftps"});r.value=e.data.data,l.user_name=(null==(a=r.value[0])?void 0:a.name)||""}catch(e){}},d=()=>{"登录日志"==n.value?m():f()},v=async()=>{await g(),await m()};return _((async()=>{await g(),await m()})),e({cutTab:v}),{__sfc:!0,authType:t,vm:s,ftpParams:l,ftpList:r,ftpData:o,ftpType:n,ftpColumn:i,productData:p,getFtpLogData:m,changeFtpLogsType:a=>{n.value=a,l.p=1,d()},getFtpActionLog:f,getFtpMenu:g,changePage:a=>{l.p=a,d()},changeSize:a=>{l.limit=a,d()},changeFtpName:a=>{l.user_name=a,d()},searchFtp:a=>{l.search=a||"",d()},checkRouter:d,cutTab:v}}}),(function(){var n=this,i=n._self._c,c=n._self._setupProxy;return i("div",["ltd"===c.authType?i(v,{scopedSlots:n._u([{key:"header-left",fn:function(){return[i("div",[i(m,{staticClass:"!mr-12x"},[n._v("刷新日志")]),n._v(" ftp用户名："),i(s,{attrs:{filterable:""},on:{change:c.changeFtpName},model:{value:c.ftpParams.user_name,callback:function(a){n.$set(c.ftpParams,"user_name",a)},expression:"ftpParams.user_name"}},n._l(c.ftpList,(function(a){return i(l,{key:a.id,attrs:{label:a.name,value:a.name}})})),1)],1)]},proxy:!0},{key:"header-right",fn:function(){return[i("div",{staticClass:"flex items-center"},[i(d,{staticClass:"ml-12x",attrs:{placeholder:"请输入搜索关键字"},on:{search:c.searchFtp,clear:c.searchFtp},model:{value:c.ftpParams.search,callback:function(a){n.$set(c.ftpParams,"search",a)},expression:"ftpParams.search"}}),i("div",{staticClass:"flex items-center mx-12x"},[n._v(" 日志类型："),i(r,{attrs:{size:"small"},on:{change:c.changeFtpLogsType},model:{value:c.ftpType,callback:function(a){c.ftpType=a},expression:"ftpType"}},[i(o,{attrs:{label:"登录日志"}}),i(o,{attrs:{label:"操作日志"}})],1)],1)],1)]},proxy:!0},{key:"content",fn:function(){return[i(t,{attrs:{column:c.ftpColumn,data:c.ftpData}})]},proxy:!0},{key:"footer-right",fn:function(){return[i(e,{attrs:{total:c.ftpParams.total,"current-page":c.ftpParams.p,"page-size":c.ftpParams.limit},on:{"size-change":c.changeSize,"current-change":c.changePage}})]},proxy:!0}],null,!1,2422044690)}):i(a,{staticClass:"px-[20%] my-[8rem]",attrs:{data:c.productData}})],1)}),[],!1,null,null,null,null).exports;const N=p(h({__name:"LogsPre",props:{msg:{type:String,default:""},logpath:{type:String,default:""},isMysqlError:{type:Boolean,default:!1},loading:{type:Boolean,default:!1},softType:{type:String,default:""}},emits:["search","refresh"],setup(a,{emit:e}){const t=a,{refs:{mainHeight:s}}=c(),{proxy:l}=x(),r=b("");return{__sfc:!0,props:t,mainHeight:s,vm:l,emits:e,searchValue:r,serachSubmit:a=>{e("search",a)},refreshValue:()=>{e("refresh","")},outSoftSite:()=>{window.open("/download?filename="+t.logpath)}}}}),(function(){var a=this,e=a._self._c,t=a._self._setupProxy;return e("div",[e("div",{staticClass:"flex items-center mb-12x justify-between"},[e("div",{staticClass:"flex items-center"},[e(m,{staticClass:"!mr-8x",attrs:{loading:t.props.loading},on:{click:t.refreshValue}},[a._v("刷新日志")]),"Mysql"!=a.softType?e(m,{staticClass:"!m-0 !mr-8x",attrs:{type:"defalut"},on:{click:t.outSoftSite}},[a._v("导出日志")]):a._e(),a._t("leftHtml")],2),a.isMysqlError?a._e():e(d,{staticClass:"ml-12x",attrs:{placeholder:"请输入搜索关键字"},on:{search:t.serachSubmit},model:{value:t.searchValue,callback:function(a){t.searchValue=a},expression:"searchValue"}})],1),e("pre",{staticClass:"bt-logs-pre",style:"height:".concat(t.mainHeight-176,"px"),domProps:{innerHTML:a._s(a.msg)}})])}),[],!1,null,null,null,null).exports;const R=p(h({__name:"MysqlSoftWare",setup(a,{expose:e}){const t=b("mysqlSlow"),s=b(""),l=b(!1),r=b([{label:"Mysql慢日志",value:"mysqlSlow"},{label:"Mysql错误日志",value:"mysqlError"}]),o=b([]),n=async a=>{try{l.value=!0;const e=await w({data:JSON.stringify({limit:"5000",search:a})});l.value=!1,s.value=e.msg}catch(e){}finally{l.value=!1}},i=async()=>{try{0===o.value.length&&(o.value=["all"]);let a={"警告":"warning","错误":"error","记录":"note"},e=o.value.map((e=>a[e]));l.value=!0;const t=await C({screening:e.join(",")});l.value=!1,s.value=t}catch(a){}finally{l.value=!1}},c=async()=>{await n()};return _((()=>{n()})),e({cutTab:c}),{__sfc:!0,tabActive:t,logsMsg:s,buttonLoading:l,tabData:r,checkList:o,getLogsData:n,getErrorData:i,tabClick:a=>{"mysqlSlow"===a.name?n():i()},searchMysqlData:a=>{"mysqlSlow"===t.value?n(a):i()},cutTab:c}}}),(function(){var a=this,e=a._self._c,t=a._self._setupProxy;return e(O,{attrs:{type:"card"},on:{"tab-click":t.tabClick},model:{value:t.tabActive,callback:function(a){t.tabActive=a},expression:"tabActive"}},a._l(t.tabData,(function(s,l){return e(n,{key:l,attrs:{label:s.label,name:s.value}},[e(N,{attrs:{msg:t.logsMsg,softType:"Mysql",loading:t.buttonLoading,"is-mysql-error":"mysqlError"==s.value},on:{search:t.searchMysqlData,refresh:t.searchMysqlData},scopedSlots:a._u([{key:"leftHtml",fn:function(){return["mysqlError"==s.value?e("div",{staticClass:"flex items-center"},[a._v(" 级别："),e(i,{staticClass:"ml-12x",on:{change:t.getErrorData},model:{value:t.checkList,callback:function(a){t.checkList=a},expression:"checkList"}},[e(f,{attrs:{label:"警告"}}),e(f,{attrs:{label:"错误"}}),e(f,{attrs:{label:"记录"}})],1)],1):a._e()]},proxy:!0}],null,!0)})],1)})),1)}),[],!1,null,"c52552d5",null,null).exports;const V=p(h({__name:"index",setup(a,{expose:e}){const{refs:{softWareTabActive:t}}=W(),{refs:{mainHeight:s}}=c(),l=b(0),r=b([]),o=b([]),n=b(""),i=b(""),p=b([{label:"用户",prop:"username"},{label:"详情",prop:"log"},{label:"操作时间",prop:"addtime",align:"right"}]),m=b([{label:"详情",prop:"log"},{label:"操作时间",prop:"addtime",align:"right"}]),f=b([]),d=y({p:1,ROWS:10,search:"",total:0}),v=b(""),h=b(!1),x=b(""),k=async()=>{try{h.value=!0,r.value=[];const a=await q();h.value=!1,a.forEach((a=>{r.value.push({name:a,id:a})}))}catch(a){}finally{h.value=!1}},T=async()=>{try{const a=await L({data:JSON.stringify({name:t.value,search:v.value})});if(D.value=!1,x.value=a.file,"Php"==t.value)return o.value=a,""===n.value&&(n.value=a[0].version),void P(n.value);i.value=a.msg}catch(a){}finally{D.value=!1}},P=a=>{o.value.forEach((e=>{e.version==a&&(i.value=e.msg,x.value=e.file)}))},D=b(!1),S=async()=>{try{let a={...d};delete a.total,D.value=!0;let e={};e="堡塔防入侵"==t.value?await A({data:JSON.stringify({name:"bt_security",search:v.value,ROWS:d.ROWS})}):"宝塔系统加固"==t.value?await F({data:JSON.stringify({name:"syssafe",search:v.value,ROWS:d.ROWS})}):await M({...a}),D.value=!1,f.value="Docker"==t.value?e.data:e.msg.data,d.total="Docker"==t.value?u(e.page):u(e.msg.page)}catch(a){}finally{D.value=!1}},j=a=>{"Docker"==a||"堡塔防入侵"==a||"宝塔系统加固"==a?S():"FTP"==a||(v.value="",l.value++,T())},w=async()=>{await k()};return _((async()=>{var a,e;await k(),t.value=null==(a=r.value[0])?void 0:a.name,j((null==(e=r.value[0])?void 0:e.name)||"")})),e({cutTab:w}),{__sfc:!0,softWareTabActive:t,mainHeight:s,key:l,menuOptions:r,phpData:o,phpChecked:n,logsMsg:i,dockerColumn:p,syssafeColumn:m,dockerData:f,dockerParams:d,allSearech:v,loading:h,logpath:x,getMenuData:k,beforeClick:a=>{t.value=a.name,d.p=1,d.ROWS=10,j(null==a?void 0:a.name)},getSoftLogData:T,changePhpVersion:P,buttonLoading:D,getDockerLogData:S,changePage:a=>{d.p=a,S()},changeSize:a=>{d.ROWS=a,S()},judgeMenu:j,serachDataEvent:a=>{v.value=a,T()},cutTab:w,desiredNpsDialog:g}}}),(function(){var a=this,r=a._self._c,o=a._self._setupProxy;return r("div",{staticClass:"items-start flex"},[r(H,{directives:[{name:"loading",rawName:"v-loading",value:o.loading,expression:"loading"}],style:"height:".concat(o.mainHeight-132,"px"),attrs:{"menu-options":o.menuOptions,"logs-type":"soft"},on:{tabClick:o.beforeClick}}),r("div",{staticClass:"ml-24x w-full"},["Mysql"!=o.softWareTabActive&&"FTP"!=o.softWareTabActive&&"Docker"!=o.softWareTabActive&&"宝塔系统加固"!=o.softWareTabActive&&"堡塔防入侵"!=o.softWareTabActive?r("div",[r(N,{key:o.key,attrs:{msg:o.logsMsg,logpath:o.logpath,loading:o.buttonLoading},on:{refresh:o.getSoftLogData,search:o.serachDataEvent},scopedSlots:a._u([{key:"leftHtml",fn:function(){return["Php"==o.softWareTabActive?r("div",{staticClass:"flex items-center"},[a._v(" php版本："),r(s,{on:{change:o.changePhpVersion},model:{value:o.phpChecked,callback:function(a){o.phpChecked=a},expression:"phpChecked"}},a._l(o.phpData,(function(a,e){return r(l,{key:e,attrs:{label:a.version,value:a.version}})})),1)],1):a._e(),r(E,{staticClass:"flex items-center",attrs:{icon:"demand",iconClass:"text-1.6rem",content:"需求反馈"},on:{click:function(a){return o.desiredNpsDialog({name:"日志",type:22})}}})]},proxy:!0}],null,!1,2794905529)})],1):a._e(),"Mysql"==o.softWareTabActive?r("div",[r(R)],1):a._e(),"Docker"==o.softWareTabActive||"堡塔防入侵"==o.softWareTabActive||"宝塔系统加固"==o.softWareTabActive?r("div",[r(v,{scopedSlots:a._u([{key:"header-left",fn:function(){return[r("div",[r(m,{attrs:{loading:o.buttonLoading},on:{click:o.getDockerLogData}},[a._v("刷新日志")])],1)]},proxy:!0},{key:"header-right",fn:function(){return[r(d,{staticClass:"ml-12x",attrs:{placeholder:"请输入搜索关键字"},on:{search:o.getDockerLogData,clear:o.getDockerLogData},model:{value:o.dockerParams.search,callback:function(e){a.$set(o.dockerParams,"search",e)},expression:"dockerParams.search"}})]},proxy:!0},{key:"content",fn:function(){return["Docker"==o.softWareTabActive||"堡塔防入侵"==o.softWareTabActive||"宝塔系统加固"==o.softWareTabActive?r(t,{attrs:{column:"宝塔系统加固"==o.softWareTabActive?o.syssafeColumn:o.dockerColumn,data:o.dockerData}}):a._e()]},proxy:!0},{key:"footer-right",fn:function(){return[r(e,{attrs:{total:o.dockerParams.total,"current-page":o.dockerParams.p,"page-size":o.dockerParams.ROWS},on:{"current-change":o.changePage,"size-change":o.changeSize}})]},proxy:!0}],null,!1,3531780712)})],1):a._e(),"FTP"==o.softWareTabActive?r("div",[r(z)],1):a._e()])],1)}),[],!1,null,null,null,null).exports;export{V as default};
