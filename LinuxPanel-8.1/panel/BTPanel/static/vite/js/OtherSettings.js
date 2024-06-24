import{_ as e}from"./index85.js?v=1714377894636";import{u as a,w as o,x as s,q as t,s as r,Q as l}from"./element-lib.js?v=1714377894636";import{g as m,o as c,aS as i,n,q as p,a as d,b as u,D as v}from"./main.js?v=1714377894636";import{_}from"./index39.js?v=1714377894636";import{_ as h}from"./index55.js?v=1714377894636";import{_ as f}from"./index59.js?v=1714377894636";import{_ as b}from"./index46.js?v=1714377894636";import{_ as g}from"./index60.js?v=1714377894636";import{_ as x}from"./index77.js?v=1714377894636";import{e as w,b as y,v as C,h as F,i as k,j}from"./vue-lib.js?v=1714377894636";import{a as P}from"./confirm.js?v=1714377894636";import{c as $}from"./check.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import{o as D}from"./software2.js?v=1714377894636";import{e as L}from"./index38.js?v=1714377894636";import{dm as T,dn as q,dp as H,dq as S,dr as N,ds as O,dt as V,du as A,dv as E,dw as I,bC as M,dx as R,i as z}from"./site.store.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./index.vue_vue_type_style_index_0_lang.js?v=1714377894636";import"./index42.js?v=1714377894636";import"./config.js?v=1714377894636";import"./index45.js?v=1714377894636";const J=n(w({__name:"OtherSettings",props:{compData:{default:{}}},setup(e){const a=e,{proxy:o}=j(),{refs:{webServerType:s}}=m(),t=y("composer"),r=C({tomcat:!1}),l=y(!1),n=y(!1),p=y(!1),d=y({path:a.compData.path,user:"www",php:"auto",otherCommand:"",mirror:"https://mirrors.aliyun.com/composer/",command:"install",composerVersion:"install",version:"",help_tips:"",comp_json:"",comp_lock:"",phpVersion:[],commandOptions:[{label:"install",value:"install"},{label:"update",value:"update"},{label:"require",value:"require"},{label:"create-project",value:"create-project"},{label:"自定义",value:""}]}),u=y("正在执行..."),v=y(!1),_=y(),h=y(""),f=y([{help:"阻止浏览器上下文中执行恶意JavaScript代码",value:!1,field:"x_xss_protection"},{help:"阻止浏览器的内容嗅探",value:!1,field:"x_content_type_options"},{help:"让浏览器跳转时不携带referrer",value:!1,field:"referrer_policy"},{help:"让浏览器加载内容时只加载自己网站的内容",value:!1,field:"content_security_policy"},{help:"防止浏览器进行用户行为跟踪",value:!1,field:"permissions_policy"}]),b=y([]),g=y(!1),x=y(!1),w=y({allowed_origins:"",allowed_methods:[],allowed_headers:"",exposed_headers:"",max_age:""}),J=async e=>{l.value=!0;try{const s=await T({path:e||a.compData.path});s.data.status?(n.value=!1,d.value.version=s.data.msg,d.value.phpVersion=s.data.php_versions.filter((e=>"00"!==e.version)),d.value.phpVersion.unshift({name:"自动选择",version:"auto"}),d.value.comp_json=!1,d.value.comp_lock=!1,"string"==typeof s.data.comp_json&&(d.value.comp_json=s.data.comp_json),"string"==typeof s.data.comp_lock&&(d.value.comp_lock=s.data.comp_lock)):(n.value=!0,o.$message.request(s))}catch(s){}finally{l.value=!1}},U=async()=>{try{l.value=!0;const e=await q({siteName:a.compData.name});r.tomcat=e.data.tomcat>0,e.data.tomcatversion?p.value=!1:p.value=!0,h.value=e.data.tomcatversion}catch(e){}finally{l.value=!1}},G=async()=>{try{l.value=!0;const e=await S({site_name:a.compData.name});f.value.forEach((a=>{e.data[a.field]&&(a.value=e.data[a.field])}))}catch(e){}finally{l.value=!1}},Q=async()=>{try{g.value=!0;const e=await O({path:"/www/server/panel/vhost/".concat(s.value,"/").concat(a.compData.name,".conf")});b.value=e.data.value}catch(e){}finally{g.value=!1}},B=async e=>{P({confirm:{icon:"warning",title:"删除【"+e.allowed_origins+"】",message:"删除跨域配置后，该网站将无法进行跨域访问，是否继续操作？"},loading:"正在删除，请稍后...",request:async()=>await V({path:"/www/server/panel/vhost/".concat(s.value,"/").concat(a.compData.name,".conf"),encoding:"utf-8"}),complete:Q})},K=e=>{if(x.value=!0,null==e?void 0:e.allowed_origins){w.value=e;const a=$(e.allowed_methods,"string","");w.value.allowed_methods=a.split(", ")}else w.value={allowed_origins:"",allowed_methods:[],allowed_headers:"",exposed_headers:"",max_age:""}},W=async()=>{_.value=setInterval((async()=>{try{const e=await M({filename:"/tmp/composer.log",num:30});u.value=e.data.msg+"\n"+u.value}catch(e){clearInterval(_.value)}}),2e3)},X=y([{label:"来源",prop:"allowed_origins"},{label:"请求方法",prop:"allowed_methods"},{label:"请求头",prop:"allowed_headers"},{label:"响应头",prop:"exposed_headers"},{label:"缓存时间",prop:"max_age"},L([{onClick:K,title:"编辑"},{onClick:B,title:"删除"}])]);return F((()=>{J()})),k((()=>{clearInterval(_.value)})),{__sfc:!0,props:a,vm:o,webServerType:s,tabActive:t,formData:r,viewLoading:l,maskLayer:n,maskLayer_tomcat:p,composerForm:d,cmdMsg:u,cmdPopup:v,cmdTimer:_,tomcatVersion:h,nginxForm:f,tableData:b,tableLoading:g,corsPopup:x,corsForm:w,handleClickTab:e=>{"tomcat"===e.name?U():"nginx"===e.name?G():"cors"===e.name?Q():J()},getComposer:J,getMessage:U,setTomcat:async()=>{let e=o.$load("正在设置，请稍后...");try{const e=await H({siteName:a.compData.name});o.$message.request(e),U()}catch(s){}finally{e.close()}},getHeader:G,setHeader:async()=>{let e=o.$load("正在设置，请稍后...");try{let e={};f.value.forEach((a=>{e[a.field]=a.value}));let s={site_name:a.compData.name,security_info:JSON.stringify(e)};const t=await N(s);o.$message.request(t)}catch(s){}finally{e.close()}},getCors:Q,deleteCors:B,addCors:async()=>{let e=o.$load("正在设置，请稍后...");try{const e=await A({...w.value,encoding:"utf-8",allow_methods:w.value.allowed_methods.join(", "),path:"/www/server/panel/vhost/".concat(s.value,"/").concat(a.compData.name,".conf")});o.$message.request(e),Q(),x.value=!1}catch(t){}finally{e.close()}},openAddCors:K,handleUpdateComposer:async()=>{let e=o.$load("正在升级，请稍后...");try{const e=await E({repo:d.value.mirror});o.$message.request(e)}catch(a){}finally{e.close()}},onPathChange:()=>{i({type:"dir",path:d.value.path,change:e=>{d.value.path=e,J(d.value.path)}})},deleteComposer:async()=>{let e=o.$load("正在删除，请稍后...");try{const e=await I({path:d.value.path+"/composer.lock"});o.$message.request(e),J(d.value.path)}catch(a){}finally{e.close()}},getLine:W,execComposerEvent:async()=>{let e={php_version:d.value.php,composer_args:d.value.command,composer_cmd:d.value.otherCommand,repo:d.value.mirror,path:d.value.path,user:d.value.user};P({confirm:{icon:"warning",title:"执行composer命令",message:"即将执行设定的composer命令，继续吗？"},loading:"正在执行，请稍后...",request:async()=>await R(e),async complete(){v.value=!0,W()}})},cancelCmdPopup:()=>{clearInterval(_.value),v.value=!1,u.value=""},openPlugin:async()=>{try{const{data:e}=await z({sName:"tomcat"});await D({name:"tomcat",softData:e})}catch(e){}},tableColumns:X,isRelease:c}}}),(function(){var m=this,c=m._self._c,i=m._self._setupProxy;return c("div",[c(x,{attrs:{type:"navtwo"},on:{"tab-click":i.handleClickTab},model:{value:i.tabActive,callback:function(e){i.tabActive=e},expression:"tabActive"}},[c(a,{directives:[{name:"loading",rawName:"v-loading",value:i.viewLoading,expression:"viewLoading"}],attrs:{name:"composer",label:"Composer"}},[c(g,{attrs:{visible:i.maskLayer,width:"28rem"}},[m._v(" 没有找到可用的composer版本")]),c("div",{staticClass:"p-20x"},[c(o,{attrs:{model:i.composerForm}},[c(s,{attrs:{label:"Composer版本"}},[c("div",{staticClass:"flex items-center"},[c(e,{attrs:{disabled:""},model:{value:i.composerForm.version,callback:function(e){m.$set(i.composerForm,"version",e)},expression:"composerForm.version"}}),c(p,{staticClass:"!ml-8x",attrs:{type:"default"},on:{click:i.handleUpdateComposer}},[m._v(m._s(i.composerForm.version?"升级Composer":"安装Composer"))])],1)]),c(s,{attrs:{label:"PHP版本"}},[c(t,{model:{value:i.composerForm.php,callback:function(e){m.$set(i.composerForm,"php",e)},expression:"composerForm.php"}},m._l(i.composerForm.phpVersion,(function(e,a){return c(r,{key:a,attrs:{label:e.name,value:e.version}})})),1)],1),c(s,{attrs:{label:"执行参数"}},[c(t,{model:{value:i.composerForm.command,callback:function(e){m.$set(i.composerForm,"command",e)},expression:"composerForm.command"}},m._l(i.composerForm.commandOptions,(function(e,a){return c(r,{key:a,attrs:{label:e.label,value:e.value}})})),1)],1),c(s,{attrs:{label:"补充命令"}},[c(e,{attrs:{placeholder:"请输入补充命令"},model:{value:i.composerForm.otherCommand,callback:function(e){m.$set(i.composerForm,"otherCommand",e)},expression:"composerForm.otherCommand"}})],1),c(s,{attrs:{label:"镜像源"}},[c(t,{staticClass:"w-[24rem]",model:{value:i.composerForm.mirror,callback:function(e){m.$set(i.composerForm,"mirror",e)},expression:"composerForm.mirror"}},[c(r,{attrs:{label:"阿里源(mirrors.aliyun.com)",value:"https://mirrors.aliyun.com/composer/"}}),c(r,{attrs:{label:"官方源(packagist.org)",value:"repos.packagist"}}),c(r,{attrs:{label:"腾讯源(mirrors.cloud.tencent.com)",value:"https://mirrors.cloud.tencent.com/composer/"}})],1)],1),c(s,{attrs:{label:"执行用户",prop:"command"}},[c(t,{model:{value:i.composerForm.user,callback:function(e){m.$set(i.composerForm,"user",e)},expression:"composerForm.user"}},[c(r,{attrs:{label:"www(推荐)",value:"www"}}),c(r,{attrs:{label:"root(不推荐)",value:"root"}})],1)],1),c(s,{attrs:{label:"执行目录",prop:"composerVersion"}},[c(e,{attrs:{width:"32rem","icon-type":"folder"},on:{folder:i.onPathChange},model:{value:i.composerForm.path,callback:function(e){m.$set(i.composerForm,"path",e)},expression:"composerForm.path"}})],1),c(s,{attrs:{label:" ",prop:"composerVersion"}},[c("div",[i.composerForm.comp_lock?c("span",{staticClass:"text-danger"},[m._v(m._s(i.composerForm.comp_lock)+" "),c(d,{on:{click:i.deleteComposer}},[m._v("[点击删除]")])],1):m._e(),i.composerForm.comp_json?c("span",{staticClass:"text-danger text-[1.2rem]"},[m._v(m._s(i.composerForm.comp_json))]):m._e()])]),c(s,{attrs:{label:" "}},[c(p,{attrs:{disabled:!!("boolean"!=typeof i.composerForm.comp_json&&i.composerForm.comp_json||"boolean"!=typeof i.composerForm.comp_lock&&i.composerForm.comp_lock)},on:{click:i.execComposerEvent}},[m._v("执行")])],1)],1),c("ul",{staticClass:"mt-8x leading-8 text-[1.2rem] list-disc ml-20x"},[c("li",[m._v(" Composer是PHP主流依赖包管理器，若您的项目使用Composer管理依赖包，可在此处对依赖进行升级或安装 ")]),c("li",[m._v("执行目录：默认为当前网站根目录")]),c("li",[m._v(" 执行用户：默认为www用户，除非您的网站以root权限运行，否则不建议使用root用户执行composer ")]),c("li",[m._v(" 镜像源：提供【阿里源】和【官方源】，建议国内服务器使用【阿里源】，海外服务器使用【官方源】 ")]),c("li",[m._v("执行参数：按需选择执行参数,可配合补充命令使用")]),c("li",[m._v(" 补充命令：若此处为空，则按composer.json中的配置执行，此处支持填写完整composer命令 ")]),c("li",[m._v(" PHP版本：用于执行composer的PHP版本，无特殊要求，默认即可，如安装出错，可尝试选择其它PHP版本 ")]),c("li",[m._v(" Composer版本：当前安装的Composer版本，可点击右侧的【升级Composer】将Composer升级到最新稳定版 ")])])],1),c(u,{attrs:{title:"请执行完毕确认结果无误后关闭此窗口",visible:i.cmdPopup,area:[50,42]},on:{cancel:i.cancelCmdPopup,"update:visible":function(e){i.cmdPopup=e}}},[c("div",{staticClass:"p-12x bg-[#333] text-white h-full overflow-auto"},[c("pre",{domProps:{innerHTML:m._s(i.cmdMsg)}})])])],1),c(a,{directives:[{name:"loading",rawName:"v-loading",value:i.viewLoading,expression:"viewLoading"}],attrs:{name:"tomcat",label:"Tomcat"}},[c(g,{attrs:{visible:i.maskLayer_tomcat,width:"28rem"}},[m._v(" 请先安装tomcat，"),c(d,{staticClass:"!text-[1.4rem]",on:{click:i.openPlugin}},[m._v("立即安装")])],1),c("div",{staticClass:"p-20x relative"},[c(v,{on:{change:i.setTomcat},model:{value:i.formData.tomcat,callback:function(e){m.$set(i.formData,"tomcat",e)},expression:"formData.tomcat"}},[m._v("启用Tomcat")]),c("ul",{staticClass:"mt-8x leading-8 text-[1.2rem] list-disc ml-20x"},[c("li",[m._v(" 当前版本为Tomcat"+m._s(i.tomcatVersion)+" ,若您需要其它版本,请到软件商店- 所有软件 中切换； ")]),c("li",[m._v("部署顺序: 安装Tomcat >> 创建站点 >> 上传并配置项目 >> 启用Tomcat")]),c("li",[m._v("若您的tomcat应用中有php脚本,访问时请添加.php扩展名")]),c("li",[m._v("开启成功后,大概需要1-5分钟时间生效!")])])],1)],1),i.isRelease?m._e():c(a,{directives:[{name:"loading",rawName:"v-loading",value:i.viewLoading,expression:"viewLoading"}],attrs:{name:"nginx",label:"Nginx安全请求头"}},[c("div",{staticClass:"flex flex-col p-20x"},m._l(i.nginxForm,(function(e,a){return c("div",{staticClass:"flex items-center mb-12x"},[c(b,{on:{change:i.setHeader},model:{value:e.value,callback:function(a){m.$set(e,"value",a)},expression:"item.value"}}),c("span",{staticClass:"ml-8x"},[m._v(m._s(e.help))])],1)})),0)]),i.isRelease?m._e():c(a,{attrs:{name:"cors",label:"跨域访问CORS配置"}},[c(f,{staticClass:"py-20x",scopedSlots:m._u([{key:"header-left",fn:function(){var e;return[(null==(e=i.tableData)?void 0:e.length)?m._e():c(p,{on:{click:i.openAddCors}},[m._v("添加跨域")])]},proxy:!0},{key:"header-right",fn:function(){return[c(h,{attrs:{refresh:i.getCors}})]},proxy:!0},{key:"content",fn:function(){return[c(_,{directives:[{name:"loading",rawName:"v-loading",value:i.tableLoading,expression:"tableLoading"}],attrs:{column:i.tableColumns,data:i.tableData}})]},proxy:!0},{key:"popup",fn:function(){return[c(u,{attrs:{title:"跨域配置",visible:i.corsPopup,area:50,showFooter:""},on:{"update:visible":function(e){i.corsPopup=e},confirm:i.addCors}},[c("div",{staticClass:"p-20x"},[c(o,{attrs:{"label-width":"130px","label-position":"right",model:i.corsForm}},[c(s,{attrs:{label:"来源（Origins）"}},[c(e,{attrs:{type:"textarea",resize:"none",rows:4},model:{value:i.corsForm.allowed_origins,callback:function(e){m.$set(i.corsForm,"allowed_origins",e)},expression:"corsForm.allowed_origins"}})],1),c(s,{attrs:{label:"请求方法（Methods）"}},[c(l,{model:{value:i.corsForm.allowed_methods,callback:function(e){m.$set(i.corsForm,"allowed_methods",e)},expression:"corsForm.allowed_methods"}},[c(v,{attrs:{label:"GET"}}),c(v,{attrs:{label:"POST"}}),c(v,{attrs:{label:"OPTIONS"}})],1)],1),c(s,{attrs:{label:"请求头（Headers）"}},[c(e,{attrs:{type:"textarea",resize:"none",rows:4},model:{value:i.corsForm.allowed_headers,callback:function(e){m.$set(i.corsForm,"allowed_headers",e)},expression:"corsForm.allowed_headers"}})],1),c(s,{attrs:{label:"响应头（Headers）"}},[c(e,{attrs:{type:"textarea",resize:"none",rows:4},model:{value:i.corsForm.exposed_headers,callback:function(e){m.$set(i.corsForm,"exposed_headers",e)},expression:"corsForm.exposed_headers"}})],1),c(s,{attrs:{label:"缓存时间（Seconds）"}},[c(e,{model:{value:i.corsForm.max_age,callback:function(e){m.$set(i.corsForm,"max_age",e)},expression:"corsForm.max_age"}})],1)],1)],1)])]},proxy:!0}],null,!1,368967780)})],1)],1)],1)}),[],!1,null,"2ac7efb2",null,null).exports;export{J as default};