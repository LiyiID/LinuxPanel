import{w as e,x as r,q as l,s}from"./element-lib.js?v=1714377894636";import{b6 as o,n as a}from"./main.js?v=1714377894636";import{e as t,A as c,v as i,b as u,h as m,j as n}from"./vue-lib.js?v=1714377894636";import{au as p}from"./docker.api.js?v=1714377894636";import{u as d}from"./docker.store.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./check.js?v=1714377894636";const b=a(t({__name:"SetInstallURL",props:{compData:{default:()=>({})}},setup(e,{expose:r}){const l=e,{proxy:s}=n(),a=d(),{settingData:t}=c(a),{getSet:b}=a,v=i({installType:"default",url:""}),k=u([{label:"mirrors.aliyun.com/docker-ce(阿里云镜像)",value:"mirrors.aliyun.com/docker-ce"},{label:"mirrors.tencent.com/docker-ce(腾讯云镜像)",value:"mirrors.tencent.com/docker-ce"},{label:"repo.huaweicloud.com/docker-ce(华为云镜像)",value:"repo.huaweicloud.com/docker-ce"},{label:"mirror.azure.cn/docker-ce(微软 Azure 镜像)",value:"mirror.azure.cn/docker-ce"},{label:"mirrors.163.com/docker-ce(网易云镜像)",value:"mirrors.163.com/docker-ce"},{label:"mirrors.tuna.tsinghua.edu.cn/docker-ce(清华大学 TUNA 镜像)",value:"mirrors.tuna.tsinghua.edu.cn/docker-ce"},{label:"mirrors.pku.edu.cn/docker-ce(北京大学镜像)",value:"mirrors.pku.edu.cn/docker-ce"},{label:"mirrors.nju.edu.cn/docker-ce(南京大学镜像)",value:"mirrors.nju.edu.cn/docker-ce"},{label:"mirror.sjtu.edu.cn/docker-ce(上海交通大学镜像)",value:"mirror.sjtu.edu.cn/docker-ce"},{label:"mirrors.ustc.edu.cn/docker-ce(中国科技大学镜像)",value:"mirrors.ustc.edu.cn/docker-ce"},{label:"mirror.iscas.ac.cn/docker-ce(中国科学院计算技术研究所镜像)",value:"mirror.iscas.ac.cn/docker-ce"},{label:"download.docker.com(Docker 官方镜像)",value:"download.docker.com"}]);m((()=>{}));const f=async()=>{try{if(""===v.url&&"custom"==v.installType)return void s.$message.error("请选择镜像源");const e={type:"binary"===v.installType?1:0};"custom"==v.installType&&(e.url=v.url);const r=await p(e);t.value.installing=1,r.status?(o(),s.$emit("close"),b(),s.$message.success(r.msg)):s.$message.error(r.msg)}catch(e){}};return r({onConfirm:f}),{__sfc:!0,vm:s,store:a,settingData:t,getSet:b,props:l,urlForm:v,typeOptions:[{label:"默认",value:"default"},{label:"自定义",value:"custom"},{label:"二进制安装",value:"binary"}],options:k,onConfirm:f}}}),(function(){var o=this,a=o._self._c,t=o._self._setupProxy;return a("div",{staticClass:"flex flex-col p-16x lib-box"},[a(e,{ref:"urlFormRef",staticClass:"relative w-full text-[1.2rem]",attrs:{size:"small",model:t.urlForm,"label-position":"right"},nativeOn:{submit:function(e){e.preventDefault()}}},[a(r,{staticClass:"check mb-[1.2rem] text-[1.2rem]",attrs:{prop:"installType",label:"安装方式"}},[a(l,{staticClass:"w-[47rem] h-[3.2rem]",attrs:{placeholder:"请选择镜像源"},model:{value:t.urlForm.installType,callback:function(e){o.$set(t.urlForm,"installType",e)},expression:"urlForm.installType"}},o._l(t.typeOptions,(function(e){return a(s,{key:e.value,attrs:{label:e.label,value:e.value}},[a("span",{staticStyle:{float:"left"}},[o._v(o._s(e.label))])])})),1)],1),a(r,{directives:[{name:"show",rawName:"v-show",value:"custom"==t.urlForm.installType,expression:"urlForm.installType == 'custom'"}],staticClass:"check mb-[1.2rem] text-[1.2rem]",attrs:{prop:"registry_mirrors_address",label:"镜像源"}},[a(l,{staticClass:"w-[47rem] h-[3.2rem]",attrs:{placeholder:"请选择镜像源"},model:{value:t.urlForm.url,callback:function(e){o.$set(t.urlForm,"url",e)},expression:"urlForm.url"}},o._l(t.options,(function(e){return a(s,{key:e.value,attrs:{label:e.label,value:e.value}},[a("span",{staticStyle:{float:"left"}},[o._v(o._s(e.label))])])})),1)],1)],1)],1)}),[],!1,null,"58851269",null,null).exports;export{b as default};
