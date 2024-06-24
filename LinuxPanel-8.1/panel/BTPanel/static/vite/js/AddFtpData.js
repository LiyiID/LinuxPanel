import{_ as r}from"./index85.js?v=1714377894636";import{w as e,x as t}from"./element-lib.js?v=1714377894636";import{g as a,ai as o,aS as s,n as m}from"./main.js?v=1714377894636";import{e as n,b as l,v as i,f as p}from"./vue-lib.js?v=1714377894636";import{g as u,c as f}from"./ftp.store.js?v=1714377894636";import{o as d}from"./confirm.js?v=1714377894636";import{a as c,b as h}from"./index110.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./config.js?v=1714377894636";import"./check.js?v=1714377894636";const b=m(n({__name:"AddFtpData",setup(r,{expose:e}){const{getFtpList:t}=u(),{refs:{sitePath:m}}=a(),n=l(),b=l(!1),w=l(m),F=i({name:"",password:o(16),path:w.value}),j={name:[{validator:(r,e,t)=>{0===e.length?t(new Error("FTP用户名不能为空！")):/^[a-zA-Z0-9_]+$/g.test(e)?e.length<=3?t(new Error("FTP用户名长度错误，不能少于3个字符！")):t():t(new Error("FTP用户名只能包含字母、数字和下划线！"))},trigger:["blur","change"]}],password:[c({complex:{length:6}})],path:[h()]};p((()=>F.name),(r=>{r.length>0?F.path=w.value+"/"+r:F.path=w.value}));const v=()=>{d({$refs:n.value,loading:{disable:b,text:"提交中，请稍候..."},request:async()=>{const{name:r,password:e,path:t}=F;return await f({ftp_username:r,ftp_password:e,path:t,ps:r})},complete:t})};return e({onConfirm:v}),{__sfc:!0,getFtpList:t,sitePath:m,addFtpInfo:n,formDisabled:b,defaultPath:w,ruleForm:F,rules:j,onPathChange:()=>{s({type:"dir",change:r=>{F.path=r}})},onConfirm:v}}}),(function(){var a=this,o=a._self._c,s=a._self._setupProxy;return o(e,{ref:"addFtpInfo",staticClass:"bt-custom-form",attrs:{rules:s.rules,model:s.ruleForm,disabled:s.formDisabled,"label-width":"4rem"}},[o(t,{attrs:{label:a.$t("Username"),prop:"name"}},[o(r,{directives:[{name:"focus",rawName:"v-focus"},{name:"trim",rawName:"v-trim"}],attrs:{name:"name",width:"32rem"},on:{"&submit":function(r){return s.onConfirm()}},model:{value:s.ruleForm.name,callback:function(r){a.$set(s.ruleForm,"name",r)},expression:"ruleForm.name"}})],1),o(t,{attrs:{label:a.$t("Password"),prop:"password"}},[o(r,{directives:[{name:"trim",rawName:"v-trim"}],attrs:{iconType:"refresh",name:"password",width:"32rem"},on:{"&submit":function(r){return s.onConfirm()}},model:{value:s.ruleForm.password,callback:function(r){a.$set(s.ruleForm,"password",r)},expression:"ruleForm.password"}})],1),o(t,{attrs:{label:a.$t("RootDirectory"),prop:"path"}},[o(r,{directives:[{name:"trim",rawName:"v-trim"}],attrs:{name:"path",iconType:"folder",width:"32rem"},on:{folder:s.onPathChange,"&submit":function(r){return s.onConfirm()}},model:{value:s.ruleForm.path,callback:function(r){a.$set(s.ruleForm,"path",r)},expression:"ruleForm.path"}})],1)],1)}),[],!1,null,null,null,null).exports;export{b as default};