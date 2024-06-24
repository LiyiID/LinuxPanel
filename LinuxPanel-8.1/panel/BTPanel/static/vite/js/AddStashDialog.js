import{_ as e}from"./index85.js?v=1714377894636";import{w as r,x as a}from"./element-lib.js?v=1714377894636";import{n as s}from"./main.js?v=1714377894636";import{e as t,b as m,v as o,h as l,j as c}from"./vue-lib.js?v=1714377894636";import{a2 as i,a3 as n}from"./docker.api.js?v=1714377894636";import{u as p}from"./docker.store.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./check.js?v=1714377894636";const d=s(t({__name:"AddStashDialog",props:{compData:{default:()=>({})}},setup(e,{expose:r}){const a=e,{proxy:s}=c(),{getStash:t}=p(),d=m("add"),u=o({registry:"",name:"",username:"",password:"",namespace:"",remark:"",id:""}),f=m(),w={registry:[{validator:(e,r,a)=>{""===r?a(new Error("请输入仓库地址")):a()},trigger:["blur"]}],name:[{validator:(e,r,a)=>{""===r?a(new Error("请输入仓库名")):a()},trigger:["blur"]}],username:[{validator:(e,r,a)=>{""===r?a(new Error("请输入用户")):a()},trigger:["blur"]}],password:[{validator:(e,r,a)=>{""===r?a(new Error("请输入密码")):a()},trigger:["blur"]}],namespace:[{validator:(e,r,a)=>{""===r?a(new Error("请输入命名空间")):a()},trigger:["blur"]}]},g=async()=>{try{await s.$refs.cmdFormRef.validate((async e=>{if(e)if("add"==d.value){const e=await i({data:JSON.stringify({registry:u.registry,name:u.name,username:u.username,password:u.password,namespace:u.namespace,remark:u.remark})});e.status?(s.$emit("close"),t(),s.$message.success(e.msg)):s.$message.error(e.msg)}else{const e=await n({data:JSON.stringify(u)});e.status?(s.$emit("close"),t(),s.$message.success(e.msg)):s.$message.error(e.msg)}}))}catch(e){}};return l((()=>{a.compData.row.id?(u.registry=a.compData.row.url,u.name=a.compData.row.name,u.username=a.compData.row.username,u.password=a.compData.row.password,u.namespace=a.compData.row.namespace,u.remark=a.compData.row.remark,u.id=a.compData.row.id,d.value="edit"):d.value="add"})),r({onConfirm:g}),{__sfc:!0,vm:s,props:a,getStash:t,type:d,cmdForm:u,cmdFormRef:f,cmdRules:w,onConfirm:g}}}),(function(){var s=this,t=s._self._c,m=s._self._setupProxy;return t("div",{staticClass:"flex flex-col p-16x lib-box"},[t(r,{ref:"cmdFormRef",staticClass:"relative w-full",attrs:{size:"small",model:m.cmdForm,rules:m.cmdRules,"label-position":"right"},nativeOn:{submit:function(e){e.preventDefault()}}},[t(a,{staticStyle:{"margin-bottom":"1.5rem"},attrs:{prop:"registry",label:"仓库地址"}},[t(e,{attrs:{width:"35rem",placeholder:"例：ccr.ccs.tencentyun.com"},model:{value:m.cmdForm.registry,callback:function(e){s.$set(m.cmdForm,"registry",e)},expression:"cmdForm.registry"}})],1),t(a,{attrs:{prop:"name",label:"仓库名"}},[t(e,{attrs:{width:"35rem",placeholder:"例：testtest"},model:{value:m.cmdForm.name,callback:function(e){s.$set(m.cmdForm,"name",e)},expression:"cmdForm.name"}})],1),t("div",{staticClass:"flex items-center",attrs:{id:"netInfo"}},[t(a,{attrs:{prop:"username",label:"用户"}},[t(e,{attrs:{width:"15rem",placeholder:"请输入仓库用户"},model:{value:m.cmdForm.username,callback:function(e){s.$set(m.cmdForm,"username",e)},expression:"cmdForm.username"}})],1),t(a,{attrs:{prop:"password",label:"密码","label-width":"3rem",id:"two"}},[t(e,{attrs:{width:"15rem",placeholder:"请输入仓库密码"},model:{value:m.cmdForm.password,callback:function(e){s.$set(m.cmdForm,"password",e)},expression:"cmdForm.password"}})],1)],1),t(a,{staticClass:"mt-[1.5rem]",attrs:{prop:"namespace",label:"命名空间"}},[t(e,{attrs:{width:"35rem",placeholder:"例：testname"},model:{value:m.cmdForm.namespace,callback:function(e){s.$set(m.cmdForm,"namespace",e)},expression:"cmdForm.namespace"}})],1),t(a,{attrs:{prop:"remark",label:"备注"}},[t(e,{attrs:{width:"35rem",placeholder:"备注"},model:{value:m.cmdForm.remark,callback:function(e){s.$set(m.cmdForm,"remark",e)},expression:"cmdForm.remark"}})],1)],1)],1)}),[],!1,null,"7b6f3acc",null,null).exports;export{d as default};
