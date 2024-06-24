import{$ as s,cz as e,c2 as t,n as o,q as r}from"./main.js?v=1714377894636";import{w as a,x as l}from"./element-lib.js?v=1714377894636";import{_ as n}from"./index85.js?v=1714377894636";import{e as m,b as i,S as p,j as c}from"./vue-lib.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./public-lib.js?v=1714377894636";const u=o(m({__name:"FirewallOpenSshKeyView",props:{compData:{default:()=>{}}},setup(o){const r=o,{proxy:a}=c(),l=i({ssh_key:r.compData}),n={ssh_key:[{validator:(s,e,t)=>{e.length>0?t():t(new Error("请输入SSH密钥！"))},trigger:["blur","change"]}]},m=p("getConfigInfo",(()=>{}));return{__sfc:!0,vm:a,props:r,ruleForm:l,rules:n,download:()=>{window.open("/ssh_security?action=download_key")},copySshPaw:e=>{s({value:e})},getConfigInfo:m,set_ssh_key:async()=>{try{const s=a.$load("正在重新生成SSH登录密钥，请稍后..."),o=await e({ssh:"yes",type:"ed25519"}),r=await t();if(s.close(),!r.msg)return a.$message.msg({type:"warning",message:"请重新开启SSH密钥登录再查看密钥！"});o.status&&a.$message.success("重新生成密钥成功！"),l.value.ssh_key=r.msg,m()}catch(s){}}}}}),(function(){var s=this,e=s._self._c,t=s._self._setupProxy;return e(a,{ref:"openSshKeyForm",staticClass:"p-[2rem] addfrom",attrs:{rules:t.rules,model:t.ruleForm,"label-width":"5rem"}},[e(l,[e(n,{staticClass:"sshKey h-[20rem]",attrs:{type:"textarea",width:"36rem"},model:{value:t.ruleForm.ssh_key,callback:function(e){s.$set(t.ruleForm,"ssh_key",e)},expression:"ruleForm.ssh_key"}})],1),e(l,[e(r,{staticClass:"copySshPaw",domProps:{textContent:s._s(s.$t("safety.copy"))},on:{click:function(s){return t.copySshPaw(t.ruleForm.ssh_key)}}}),e(r,{staticClass:"copy",domProps:{textContent:s._s(s.$t("safety.download"))},on:{click:t.download}}),e(r,{staticClass:"copy",attrs:{type:"default"},domProps:{textContent:s._s(s.$t("safety.regenerate"))},on:{click:t.set_ssh_key}})],1)],1)}),[],!1,null,"b3775ff9",null,null).exports;export{u as default};
