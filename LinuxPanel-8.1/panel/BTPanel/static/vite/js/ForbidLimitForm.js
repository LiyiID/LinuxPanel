import{_ as e}from"./index85.js?v=1714377894636";import{w as r,x as s}from"./element-lib.js?v=1714377894636";import{n as o}from"./main.js?v=1714377894636";import{e as i,v as a,b as t,j as m}from"./vue-lib.js?v=1714377894636";import{el as l}from"./site.store.js?v=1714377894636";import{o as d}from"./confirm.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./check.js?v=1714377894636";import"./config.js?v=1714377894636";const n=o(i({__name:"ForbidLimitForm",props:{compData:{default:()=>({})}},setup(e,{expose:r}){const s=e,{proxy:o}=m(),i=a({suffix:s.compData.suffix||"php|jsp",deny_name:s.compData.name||"",dir:s.compData.dir||""}),n=t(!1),p=t(),f=a({site_dir:[{required:!0,message:"请输入需要加密访问的目录",trigger:"blur"}],name:[{required:!0,message:"请输入名称",trigger:"blur"},{min:3,message:"名称必须大于三位",trigger:"blur"}],username:[{required:!0,message:"请输入用户名",trigger:"blur"},{min:3,message:"用户名必须大于三位",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{min:3,message:"密码必须大于三位",trigger:"blur"}]}),u=async()=>{d({$refs:p.value,loading:{disable:n,text:"提交中，请稍候..."},request:async()=>{const e=await l({website:s.compData.website,...i,act:s.compData.name?"edit":"add"});return s.compData.name&&(e.msg="修改成功"),e},fail:async e=>{o.$message.msg({customClass:"bt-message-error-html",dangerouslyUseHTMLString:!0,message:e.msg,type:"error",duration:0,showClose:!0})},async complete(){s.compData.refresh()}})};return r({onConfirm:u}),{__sfc:!0,vm:o,props:s,forbidForm:i,formDisabled:n,forbidSiteForm:p,forbidRules:f,savePassConfig:u}}}),(function(){var o=this,i=o._self._c,a=o._self._setupProxy;return i("div",{staticClass:"p-20x"},[i(r,{ref:"forbidSiteForm",attrs:{rules:a.forbidRules,model:a.forbidForm,disabled:a.formDisabled}},[i(s,{attrs:{label:"名称",prop:"deny_name"}},[i(e,{attrs:{disabled:o.compData.name},model:{value:a.forbidForm.deny_name,callback:function(e){o.$set(a.forbidForm,"deny_name",e)},expression:"forbidForm.deny_name"}})],1),i(s,{attrs:{label:"后缀",prop:"suffix"}},[i(e,{model:{value:a.forbidForm.suffix,callback:function(e){o.$set(a.forbidForm,"suffix",e)},expression:"forbidForm.suffix"}})],1),i(s,{attrs:{label:"目录"}},[i(e,{attrs:{placeholder:"禁止访问的目录"},model:{value:a.forbidForm.dir,callback:function(e){o.$set(a.forbidForm,"dir",e)},expression:"forbidForm.dir"}})],1),i("ul",{staticClass:"ml-6 mt-8 list-disc leading-10"},[i("li",{staticClass:"text-medium"},[o._v("后缀：禁止访问的文件后缀")]),i("li",{staticClass:"text-medium"},[o._v("目录：规则会在这个目录内生效")])])],1)],1)}),[],!1,null,"059d7b7a",null,null).exports;export{n as default};
