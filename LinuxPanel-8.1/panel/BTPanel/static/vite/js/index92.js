import{_ as s}from"./index77.js?v=1714377894636";import{aP as t,n as e,a,c2 as o,c3 as n,c4 as i,c5 as l,ao as r,e as c,c6 as m,c7 as u,c8 as p,q as h}from"./main.js?v=1714377894636";import{_ as f}from"./index46.js?v=1714377894636";import{e as d,j as v,b as g,f as S,h as y,l as _,I as w}from"./vue-lib.js?v=1714377894636";import{a as x}from"./confirm.js?v=1714377894636";import{getFirewallStore as b}from"./firewall.store.js?v=1714377894636";import{_ as C}from"./preload-helper.js?v=1714377894636";import{w as I,x as P}from"./element-lib.js?v=1714377894636";import{_ as H}from"./index85.js?v=1714377894636";import{_ as j}from"./index41.js?v=1714377894636";import{b as k}from"./check.js?v=1714377894636";import{d as A,f as L,g as $,h as D,a as B}from"./firewall.popup.js?v=1714377894636";import"./index42.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./index.vue_vue_type_style_index_0_lang.js?v=1714377894636";import"./config.js?v=1714377894636";const F=e(d({__name:"SshHeader",setup(s){const{proxy:e}=v(),{refs:{sshInfo:a,isSsh:o},loginDetailsClick:n,getSshInfoEvent:i}=b();return{__sfc:!0,vm:e,sshInfo:a,isSsh:o,loginDetailsClick:n,getSshInfoEvent:i,onChangeSsh:async s=>{x({confirm:{icon:"warning",title:"SSH服务开关",message:s?"确定启用SSH服务吗？":"停用SSH服务后您将无法使用终端工具连接服务器，继续吗？"},loading:"正在"+(s?"启用SSH服务":"禁用SSH服务")+"，请稍后...",request:async()=>await t({status:s?"0":"1"}),complete:i})},clickLoginDetails:s=>{n(s)}}}}),(function(){var s,t,e,o,n,i=this,l=i._self._c,r=i._self._setupProxy;return l("div",{staticClass:"tab-header-operate"},[l("div",{staticClass:"mr-4"},[i._v("SSH开关")]),l("div",[l(f,{attrs:{width:36},on:{change:r.onChangeSsh},model:{value:r.isSsh,callback:function(s){r.isSsh=s},expression:"isSsh"}})],1),l("div",{directives:[{name:"loading",rawName:"v-loading",value:!(null==(s=r.sshInfo.error)?void 0:s.hasOwnProperty("success")),expression:"!sshInfo.error?.hasOwnProperty('success')"}],staticClass:"flex items-center"},[l("div",{staticClass:"bg-[#ccc] w-[1px] h-2rem mx-8"}),l("div",{staticClass:"mr-4"},[i._v("SSH登录详情：")]),l(a,{on:{click:function(s){return r.clickLoginDetails("success")}}},[i._v(" 成功总数："+i._s((null==(t=r.sshInfo.error)?void 0:t.hasOwnProperty("success"))?r.sshInfo.error.success:"查询中..")+"（今日新增："+i._s((null==(e=r.sshInfo.error)?void 0:e.hasOwnProperty("today_success"))?r.sshInfo.error.today_success:"查询中..")+"） ")]),l("span",{staticClass:"mx-4"},[i._v("/")]),l(a,{attrs:{type:"danger"},on:{click:function(s){return r.clickLoginDetails("error")}}},[i._v(" 失败："+i._s((null==(o=r.sshInfo.error)?void 0:o.hasOwnProperty("error"))?r.sshInfo.error.error:"查询中..")+"（今日新增："+i._s((null==(n=r.sshInfo.error)?void 0:n.hasOwnProperty("today_error"))?r.sshInfo.error.today_error:"查询中..")+"） ")])],1)])}),[],!1,null,null,null,null).exports;const R=e(d({__name:"BasicSetup",setup(s){var t,e;const{refs:{sshInfo:a,isSshPwd:h,isSshKey:f,longinAlarmInfo:d,sshInfo:w,sshRootOption:x,firewallTabActive:C,sshRuleForm:I},getSshLoginAlarmInfo:P,getConfigInfo:H,getMsgPushListEvent:j}=b(),F=g(!!(null==(e=null==(t=a.value)?void 0:t.fail2ban)?void 0:e.status)),{proxy:R}=v(),E=g([]),O={port:[{validator:(s,t,e)=>{k(t)?e():e(new Error(R.$t("safety.portPlaceHolder")))},trigger:["blur","change"]}]};return S((()=>a.value),(s=>{var t;F.value=!!(null==(t=null==s?void 0:s.fail2ban)?void 0:t.status)}),{deep:!0}),y((async()=>{H(),await j(),P()})),{__sfc:!0,sshInfo:a,isSshPwd:h,isSshKey:f,longinAlarmInfo:d,ruleForm:w,sshRootOption:x,firewallTabActive:C,sshRuleForm:I,getSshLoginAlarmInfo:P,getConfigInfo:H,getMsgPushListEvent:j,isSSHBlast:F,vm:R,rowData:E,rules:O,downloadSshKey:async s=>{let t=null;try{t=R.$load("正在获取密钥信息，请稍后...");const e=await o();if(t.close(),s){if(!e.status)return await R.$message.request(e);E.value=e.msg,L(e.msg)}else{if(!e.msg)return R.$message.msg({type:"warning",message:"请重新开启SSH密钥登录再下载密钥！"});window.open("/ssh_security?action=download_key")}}catch(e){}},saveSshPort:async()=>{var s,t,e;try{if(!k(null!=(t=null==(s=w.value)?void 0:s.port)?t:""))return await R.$message.error(R.$t("safety.portPlaceHolder"));const a=await n(null==(e=w.value)?void 0:e.port);await R.$message.request(a)}catch(a){}},onChangeSshPaw:async s=>{let t;try{t=R.$load("正在"+(s?"开启":"关闭")+"SSH密码登录，请稍后...");const e=await i(s);t&&t.close(),await R.$message.request(e)}catch(e){}finally{t&&t.close()}},onChangeSshPubkey:async s=>{let t;try{if(t=R.$load("正在"+(s?"开启":"关闭")+"SSH密钥登录，请稍后..."),s)$((()=>{_((()=>f.value=!1))}));else{const s=await l();await R.$message.request(s),await H()}t&&t.close()}catch(e){}finally{t&&t.close()}},openAntiBlastDialog:async()=>{try{const{data:s}=await r({sName:"fail2ban"});s.setup?await D():(c({name:s.name,type:s.type,pluginInfo:s}),R.$message.warn("请先安装防爆破插件"))}catch(s){}},openAutiBlastList:async()=>{try{const{data:s}=await r({sName:"fail2ban"});s.setup?await B("antiBlast"):(c({name:s.name,type:s.type,pluginInfo:s}),R.$message.warn("请先安装防爆破插件"))}catch(s){}},rootLoginChange:async s=>{try{const t=R.$load("正在设置root登录，请稍后..."),e=await m({p_type:s});t.close(),await R.$message.request(e)}catch(t){}},setRootPwd:async()=>{const s=R.$load("正在设置root密码，请稍后...");try{await R.$confirm({title:"提示",message:"重置root密码后，之前的密码将失效，是否继续操作？",icon:"warning"});const s=await u({username:"root",password:w.value.rootPwd});await R.$message.request(s)}catch(t){}finally{s.close()}},openPlugin:async()=>{C.value="system"},onChangeSshBlast:async s=>{let t;try{const{data:e}=await r({sName:"fail2ban"});if(e.setup){t=R.$load("正在"+(s?"开启":"关闭")+"防爆破，请稍后...");const e=await p({act:s});R.$message.request(e)}else F.value=!1,c({name:e.name,type:e.type,pluginInfo:e})}catch(e){}finally{t&&t.close()}},setSshLoginAlarmDialog:A}}}),(function(){var s=this,t=s._self._c,e=s._self._setupProxy;return t("div",{staticClass:"p-20x"},[t(I,{ref:"editBasicSetup",staticClass:"py-4",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"5rem"}},[t(P,{attrs:{label:"SSH端口",prop:"port"}},[t("div",{staticClass:"bt-line"},[t(H,{staticClass:"max-w-[20rem]",attrs:{width:"20rem",placeholder:"请输入SSH端口"},model:{value:e.ruleForm.port,callback:function(t){s.$set(e.ruleForm,"port",t)},expression:"ruleForm.port"}}),t(h,{staticClass:"!ml-4x",on:{click:function(s){return e.saveSshPort()}}},[s._v("保存")]),t("span",{staticClass:"text-[#999] ml-4 text-[1.2rem]"},[s._v("当前SSH协议所使用的的端口，默认为22")])],1)]),t(P,{attrs:{label:"root登录设置",prop:"rootLogin"}},[t(j,{staticClass:"w-[26rem]",attrs:{options:e.sshRootOption,change:e.rootLoginChange},model:{value:e.sshRuleForm.rootLogin,callback:function(t){s.$set(e.sshRuleForm,"rootLogin",t)},expression:"sshRuleForm.rootLogin"}})],1),t(P,{attrs:{label:"SSH密码登录"}},[t(f,{attrs:{size:"mini",width:36},on:{change:e.onChangeSshPaw},model:{value:e.isSshPwd,callback:function(s){e.isSshPwd=s},expression:"isSshPwd"}}),t("span",{staticClass:"text-[#999] ml-4 text-[1.2rem]"},[s._v("SSH的默认登录方式")])],1),t(P,{attrs:{label:"重置root密码"}},[t("div",{staticClass:"bt-line"},[t(H,{attrs:{width:"20rem",iconType:"refresh",isNull:!0,placeholder:"请输入新密码"},model:{value:e.ruleForm.rootPwd,callback:function(t){s.$set(e.ruleForm,"rootPwd",t)},expression:"ruleForm.rootPwd"}}),t(h,{staticClass:"!ml-4x",on:{click:e.setRootPwd}},[s._v("重置")]),t("span",{staticClass:"text-[#999] ml-4 text-[1.2rem]"},[s._v("建议使用复杂度高的密码，修改后请及时保存，刷新页面会清空密码框")])],1)]),t(P,{attrs:{label:"SSH密钥登录"}},[t("div",{staticClass:"bt-line"},[t(f,{attrs:{size:"mini",width:36},on:{change:e.onChangeSshPubkey},model:{value:e.isSshKey,callback:function(s){e.isSshKey=s},expression:"isSshKey"}}),t(h,{staticClass:"!ml-8x",attrs:{size:"mini"},on:{click:function(s){return e.downloadSshKey(!0)}}},[s._v("查看密钥")]),t(h,{attrs:{size:"mini",type:"defalut"},on:{click:function(s){return e.downloadSshKey(!1)}}},[s._v("下载")]),t("span",{staticClass:"text-[#999] ml-4 text-[1.2rem]"},[s._v("推荐使用密钥登录，关闭密码，安全性更高")])],1)]),t(P,{attrs:{label:"SSH登录告警"}},[t("div",{staticClass:"bt-line"},[t(a,{staticClass:"!text-[1.2rem]",attrs:{type:e.longinAlarmInfo.type?"primary":"warning"},on:{click:function(s){return e.setSshLoginAlarmDialog()}}},[s._v(s._s(e.longinAlarmInfo.text))]),t(h,{staticClass:"!ml-4x",attrs:{size:"mini"},on:{click:function(s){return e.setSshLoginAlarmDialog()}}},[s._v("设置登陆告警")]),t("span",{staticClass:"text-[#999] ml-4 text-[1.2rem]"},[s._v("推荐使用密钥登录，关闭密码，安全性更高")])],1)]),t(P,{attrs:{label:"SSH防爆破"}},[t("div",{staticClass:"bt-line"},[t(f,{attrs:{size:"mini",width:36},on:{change:e.onChangeSshBlast},model:{value:e.isSSHBlast,callback:function(s){e.isSSHBlast=s},expression:"isSSHBlast"}}),t(h,{staticClass:"!ml-8x",attrs:{size:"mini"},on:{click:e.openAntiBlastDialog}},[s._v("配置SSH防爆破")]),t(h,{attrs:{size:"mini",type:"defalut"},on:{click:e.openAutiBlastList}},[s._v("查看")]),t("span",{staticClass:"text-[#999] ml-4 text-[1.2rem]"},[s._v("设置SSH防爆破，防止主机被恶意爆破，首次安装后，请手动刷新页面")])],1)]),t(P,[t("span",{staticClass:"text-[1.2rem] text-[#999]"},[s._v(" 更多SSH安全设置请使用系统加固模块"),t(a,{on:{click:e.openPlugin}},[s._v(">> 系统加固")])],1)])],1)],1)}),[],!1,null,"20665401",null,null).exports;const E=e(d({__name:"index",setup(s){const{refs:{sshTabAvtive:t,sshDataInfo:e},getSshInfoEvent:a}=b(),o=g([{title:"基础设置",type:"basicSetup",component:R},{title:"SSH系统账号管理",type:"systemAccount",component:()=>C((()=>import("./SystemAccount.js?v=1714377894636")),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)},{title:"SSH登录日志",type:"loginLog",component:()=>C((()=>import("./LoginLog.js?v=1714377894636")),__vite__mapDeps([28,13,2,3,4,5,6,7,8,9,10,29,15,16,30,31,32,33,17,18,19,20,34,26,21,22,23,24,25,27]),import.meta.url)}]);return w((()=>{e.value={type:"all",index:0,active:!1}})),y((()=>{a()})),{__sfc:!0,sshTabAvtive:t,sshDataInfo:e,getSshInfoEvent:a,tabComponent:o}}}),(function(){var t=this._self._c,e=this._self._setupProxy;return t("div",{staticClass:"flex flex-col"},[t(F),t(s,{attrs:{type:"navtwo",config:e.tabComponent},model:{value:e.sshTabAvtive,callback:function(s){e.sshTabAvtive=s},expression:"sshTabAvtive"}})],1)}),[],!1,null,null,null,null).exports;export{E as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./SystemAccount.js?v=1714377894636","./index85.js?v=1714377894636","./main.js?v=1714377894636","./modulepreload-polyfill.js?v=1714377894636","./vue-lib.js?v=1714377894636","./__commonjsHelpers__.js?v=1714377894636","./preload-helper.js?v=1714377894636","./request-lib.js?v=1714377894636","./locales-lib.js?v=1714377894636","./public-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./index51.js?v=1714377894636","./index118.js?v=1714377894636","./index39.js?v=1714377894636","./element-lib.js?v=1714377894636","./index58.js?v=1714377894636","./element-lib.js?v=1714377894636","./index45.js?v=1714377894636","./index59.js?v=1714377894636","./firewall.table.js?v=1714377894636","./index46.js?v=1714377894636","./element-lib.js?v=1714377894636","./index.vue_vue_type_style_index_0_lang.js?v=1714377894636","./firewall.popup.js?v=1714377894636","./check.js?v=1714377894636","./index38.js?v=1714377894636","./LoginLog.js?v=1714377894636","./index98.js?v=1714377894636","./index117.js?v=1714377894636","./radio-button.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./firewall.store.js?v=1714377894636"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
