import{w as e,x as t,o as s}from"./element-lib.js?v=1714377894636";import{dm as r,n as a}from"./main.js?v=1714377894636";import{_ as o}from"./index41.js?v=1714377894636";import{e as l,Q as i,b as m,v as n,h as p,j as c}from"./vue-lib.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import{Y as d}from"./config.api.js?v=1714377894636";import{getConfigStore as u}from"./config.store.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";const f=a(l({__name:"webhook",props:{compData:null},setup(e,{expose:t}){const s=e,{getAlarmSettings:a}=u(),{compData:o}=i(s),{proxy:l}=c(),f=m(!1),y=m(!1),b=m();let v=n({title:"",url:"",method:"GET",ssl_verify:1,headers:"",body_type:"json",custom_parameter:"",query:""});const h=async e=>{var t;let s=l.$load("正在保存WebHook配置，请稍候...");try{await(null==(t=b.value)?void 0:t.validate());let s=r(v);s.name=s.title,delete s.title;["custom_parameter","query","headers"].forEach((e=>{s[e]=""==s[e]?{}:new Function("return "+s[e])()}));const o=await d({hook_data:JSON.stringify(s),test_or_save:0});o.status&&(await a(),e()),l.$message.request(o)}catch(o){}finally{null==s||s.close()}};return p((()=>{if(!s.compData.isAdd){const{name:e,url:t,method:r,ssl_verify:a,headers:o,body_type:l,custom_parameter:i,query:m}=s.compData.row.data;v.title=e,v.url=t,v.method=r,v.ssl_verify="number"!=typeof a?1:a,v.headers=JSON.stringify(o),v.body_type=l,v.custom_parameter=JSON.stringify(i),v.query=JSON.stringify(m)}})),t({onConfirm:h}),{__sfc:!0,getAlarmSettings:a,props:s,compData:o,vm:l,isAdv:f,methodList:[{title:"GET",key:"GET"},{title:"POST",key:"POST"},{title:"PUT",key:"PUT"},{title:"PATCH",key:"PATCH"}],bodyList:[{title:"JSON",key:"json"},{title:"form data",key:"form_data"},{title:"null",key:"null"}],load:y,formRef:b,form:v,changeMethod:e=>{v.method=e},changeSsl:e=>{v.ssl_verify=e},changeBodyType:e=>{v.body_type=e},rules:{title:[{required:!0,message:"请输入名称",trigger:"blur"}],url:[{required:!0,message:"请输入自定义的Webhook URL",trigger:"blur"}]},onConfirm:h}}}),(function(){var r=this,a=r._self._c,l=r._self._setupProxy;return a("div",{directives:[{name:"bt-loading",rawName:"v-bt-loading",value:l.load,expression:"load"},{name:"bt-loading",rawName:"v-bt-loading:title",value:"正在获取配置信息，请稍候...",expression:"'正在获取配置信息，请稍候...'",arg:"title"}],staticClass:"w-[520px] px-16px py-24px"},[a(e,{ref:"formRef",attrs:{size:"small",model:l.form,rules:l.rules}},[a(t,{attrs:{label:"名称",prop:"title"}},[a("div",{staticClass:"w-[32rem]"},[a(s,{attrs:{placeholder:"请输入名称"},model:{value:l.form.title,callback:function(e){r.$set(l.form,"title",e)},expression:"form.title"}})],1)]),a(t,{attrs:{label:"URL",prop:"url"}},[a("div",{staticClass:"w-[32rem]"},[a(s,{attrs:{type:"textarea",resize:"none",autosize:{minRows:5,maxRows:5},placeholder:"请输入自定义的Webhook URL"},model:{value:l.form.url,callback:function(e){r.$set(l.form,"url",e)},expression:"form.url"}})],1)]),a("div",{staticClass:"more flex items-center cursor-pointer pl-[10rem] my-[2rem] px-[2rem]",on:{click:function(e){l.isAdv=!l.isAdv}}},[a("i",{class:l.isAdv?"el-icon-arrow-down":"el-icon-arrow-right"}),a("div",{staticClass:"ml-[1rem] text-[#20a53a] w-[16rem] select-none"},[r._v(" "+r._s("更多设置，".concat(l.isAdv?"点击收回":"点击查看"))+" ")])]),a("div",{directives:[{name:"show",rawName:"v-show",value:l.isAdv,expression:"isAdv"}],staticClass:"py-[2rem] pt-[0]"},[a(t,{attrs:{label:"请求方式",prop:"method"}},[a("div",{staticClass:"flex items-center"},[a(o,{staticClass:"w-[12rem]",attrs:{options:l.methodList,change:l.changeMethod},model:{value:l.form.method,callback:function(e){r.$set(l.form,"method",e)},expression:"form.method"}}),a("span",{staticClass:"el-form-item__label"},[r._v("SSL验证")]),a(o,{staticClass:"w-[10rem]",attrs:{change:l.changeSsl,options:[{title:"开启",key:1},{title:"关闭",key:0}]},model:{value:l.form.ssl_verify,callback:function(e){r.$set(l.form,"ssl_verify",e)},expression:"form.ssl_verify"}})],1)]),a(t,{attrs:{label:"headers",prop:"headers"}},[a("div",{staticClass:"w-[32rem]"},[a(s,{attrs:{type:"textarea",resize:"none",autosize:{minRows:2,maxRows:2},placeholder:"非必填，可输入JSON格式的字符串，例如：{aa:bb}"},model:{value:l.form.headers,callback:function(e){r.$set(l.form,"headers",e)},expression:"form.headers"}})],1)]),a(t,{attrs:{label:"body",prop:"body_type"}},[a(o,{attrs:{options:l.bodyList,change:l.changeBodyType},model:{value:l.form.body_type,callback:function(e){r.$set(l.form,"body_type",e)},expression:"form.body_type"}})],1),a(t,{attrs:{label:"自定义参数",prop:"custom_parameter"}},[a("div",{staticClass:"w-[32rem]"},[a(s,{attrs:{type:"textarea",resize:"none",autosize:{minRows:2,maxRows:2},placeholder:"非必填，可输入JSON格式的字符串，例如：{aa:bb}"},model:{value:l.form.custom_parameter,callback:function(e){r.$set(l.form,"custom_parameter",e)},expression:"form.custom_parameter"}})],1)]),a(t,{attrs:{label:"query",prop:"query"}},[a("div",{staticClass:"w-[32rem]"},[a(s,{attrs:{type:"textarea",resize:"none",autosize:{minRows:2,maxRows:2},placeholder:"非必填，可输入JSON格式的字符串，例如：{aa:bb}"},model:{value:l.form.query,callback:function(e){r.$set(l.form,"query",e)},expression:"form.query"}})],1)])],1)],1)],1)}),[],!1,null,null,null,null).exports;export{f as default};