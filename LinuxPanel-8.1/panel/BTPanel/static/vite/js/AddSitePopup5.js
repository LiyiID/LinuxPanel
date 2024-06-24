import{_ as e}from"./index85.js?v=1714377894636";import{w as t,x as a,q as s,s as r}from"./element-lib.js?v=1714377894636";import{g as o,bI as l,aS as i,n as p,r as m}from"./main.js?v=1714377894636";import{e as n,b as d,h as c,j as u}from"./vue-lib.js?v=1714377894636";import{g as f,b5 as w}from"./site.store.js?v=1714377894636";import{r as v}from"./site.rules.js?v=1714377894636";import{o as b}from"./confirm.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./check.js?v=1714377894636";import"./config.js?v=1714377894636";const h=p(n({__name:"AddSitePopup",setup(e,{expose:t}){const{getModulesList:a}=f();o();const{proxy:s}=u(),r=d({webname:"",path:"/www/wwwroot",ftp:!1,ps:"",port:80,ftp_username:"",ftp_password:""}),p=d(!1),m=d(),n=d(!1),h=async e=>{let t=Object.assign({},r.value);-1!==t.webname.split("\n")[0].indexOf(":")&&(t.port=t.webname.split("\n")[0].split(":")[1]);let o=t.webname.split("\n").slice(1);t.webname=JSON.stringify({domain:t.webname.split("\n")[0],domainlist:o,count:o.length}),t.ftp||(delete t.ftp_username,delete t.ftp_password),b({$refs:m.value,loading:{disable:p},request:async()=>{const r=await w({...t},"html");r.data.siteStatus?(s.$message.success("添加成功"),e()):s.$message.msg({customClass:"el-error-html-message",dangerouslyUseHTMLString:!0,message:r.msg,type:"error"}),a("html")}})},g=async()=>{var e;const t=JSON.parse(null!=(e=sessionStorage.getItem("BT-CONFIG"))?e:"{}").sites_path;t&&(m.value.path=t)};return c((()=>{g()})),t({onConfirm:h}),{__sfc:!0,getModulesList:a,vm:s,addSiteForm:r,formDisabled:p,htmlAddFormRef:m,formLoading:n,handleInputName:e=>{var t,a,s,o;r.value.webname=e,r.value.ps=e.split("\n")[0],r.value.path="/www/wwwroot/"+(null==(a=null==(t=e.split("\n")[0])?void 0:t.replace(/:/g,"_"))?void 0:a.trim()),r.value.ftp_username=null==(o=null==(s=e.split("\n")[0])?void 0:s.toString())?void 0:o.replace(/\./g,"_"),r.value.ftp_password=l(12)},onPathChange:()=>{i({type:"dir",path:r.value.path,change:e=>{r.value.path=e}})},onConfirm:h,onOpen:g,rules:v}}}),(function(){var o=this,l=o._self._c,i=o._self._setupProxy;return l("div",{staticClass:"p-20x"},[l(t,{directives:[{name:"loading",rawName:"v-loading",value:i.formLoading,expression:"formLoading"}],ref:"htmlAddFormRef",attrs:{model:i.addSiteForm,rules:i.rules,disabled:i.formDisabled}},[l(a,{attrs:{label:"域名",prop:"webname"}},[l(m,{ref:"popover",attrs:{placement:"top-start","popper-class":"green-tips-popover",title:"",width:"400",trigger:"focus"}},[l("div",{staticClass:"!p-12x bg-[#20a53a] text-white"},[o._v(" 如需填写多个域名，请换行填写，每行一个域名，默认为80端口"),l("br"),o._v(" IP地址格式：192.168.1.199"),l("br"),o._v(" 泛解析添加方法 *.domain.com"),l("br"),o._v(" 如另加端口格式为 www.domain.com:88 ")]),l(e,{directives:[{name:"popover",rawName:"v-popover:popover",arg:"popover"}],attrs:{slot:"reference",type:"textarea",width:"42rem",rows:6,resize:"none",placeholder:"如需填写多个域名，请换行填写，每行一个域名，默认为80端口\nIP地址格式：192.168.1.199\n泛解析添加方法 *.domain.com\n如另加端口格式为 www.domain.com:88"},on:{input:i.handleInputName},slot:"reference",model:{value:i.addSiteForm.webname,callback:function(e){o.$set(i.addSiteForm,"webname",e)},expression:"addSiteForm.webname"}})],1)],1),l(a,{attrs:{label:"备注"}},[l(e,{attrs:{placeholder:"请输入备注,可为空",width:"42rem"},model:{value:i.addSiteForm.ps,callback:function(e){o.$set(i.addSiteForm,"ps",e)},expression:"addSiteForm.ps"}})],1),l(a,{attrs:{label:"根目录",prop:"path"}},[l(e,{attrs:{placeholder:"请输入根目录",iconType:"folder",width:"42rem"},on:{folder:i.onPathChange},model:{value:i.addSiteForm.path,callback:function(e){o.$set(i.addSiteForm,"path",e)},expression:"addSiteForm.path"}})],1),l(a,{attrs:{label:"FTP"}},[l(s,{model:{value:i.addSiteForm.ftp,callback:function(e){o.$set(i.addSiteForm,"ftp",e)},expression:"addSiteForm.ftp"}},[l(r,{attrs:{label:"不创建",value:!1}}),l(r,{attrs:{label:"创建",value:!0}})],1)],1),i.addSiteForm.ftp?l(a,{attrs:{label:"FTP账号"}},[l("div",{staticClass:"flex items-center"},[l(e,{attrs:{placeholder:"创建FTP账号",width:"16rem"},model:{value:i.addSiteForm.ftp_username,callback:function(e){o.$set(i.addSiteForm,"ftp_username",e)},expression:"addSiteForm.ftp_username"}}),l(a,{attrs:{label:"密码"}},[l(e,{attrs:{width:"16rem",placeholder:"FTP密码"},model:{value:i.addSiteForm.ftp_password,callback:function(e){o.$set(i.addSiteForm,"ftp_password",e)},expression:"addSiteForm.ftp_password"}})],1)],1),l("span",{staticClass:"text-[#999] text-[1.2rem]"},[o._v(" 创建站点的同时，为站点创建一个对应FTP帐户，并且FTP目录指向站点所在目录。 ")])]):o._e()],1)],1)}),[],!1,null,"f7307a5e",null,null).exports;export{h as default};
