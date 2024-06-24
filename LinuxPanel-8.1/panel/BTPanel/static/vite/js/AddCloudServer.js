import{_ as e}from"./index118.js?v=1714377894636";import{_ as r}from"./index85.js?v=1714377894636";import{w as s,x as t}from"./element-lib.js?v=1714377894636";import{c1 as a,n as o}from"./main.js?v=1714377894636";import{e as l,b as i,w as m,h as p,j as u}from"./vue-lib.js?v=1714377894636";import{m as d,a1 as n,a2 as v,a3 as b,a4 as c}from"./mysql.store.js?v=1714377894636";import{h as g,a as _}from"./check.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import{g as f,r as h}from"./index28.js?v=1714377894636";import{o as x}from"./confirm.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./index77.js?v=1714377894636";import"./index42.js?v=1714377894636";import"./config.js?v=1714377894636";const y=o(l({__name:"AddCloudServer",props:{compData:{default:{}}},setup(e,{expose:r}){const s=e,{getServerList:t}=d(),{refs:{tabActive:o},getServerList:l}=f(),{getServerList:y}=h(),{proxy:j}=u(),{loading:F}=a(j),w=i(null),D=i(!1),S=i({mysql:{port:3306,db_user:"root"},mongodb:{port:27017,db_user:"root"},sqlserver:{port:1433,db_user:"sa"},pgsql:{port:5432,db_user:"postgres"},redis:{port:6379,db_user:""}}),q=i({db_host:"",db_port:S.value[o.value].port,db_user:S.value[o.value].db_user,db_password:"",ps:"",type:o.value}),C=i([{text:"支持MySQL5.5、MariaDB10.1及以上版本"},{text:"支持阿里云、腾讯云等云厂商的云数据库"},{text:"注意1：请确保本服务器有访问数据库的权限"},{text:"注意2：请确保填写的管理员帐号具备足够的权限"},{text:"注意3：通过宝塔安装的数据库root默认不支持远程权限"}]),L={db_host:[{required:!0,message:"请输入服务器地址",trigger:["blur","change"]},{validator:(e,r,s)=>{""===r?s(new Error("请输入服务器地址")):g(r)||_(r)?s():s(new Error("请输入正确的服务器地址"))},trigger:["blur","change"]}],db_password:[{required:!0,message:"请输入服务器密码",trigger:["blur","change"]}],db_user:[{required:!0,message:"请输入管理员名称",trigger:["blur","change"]}],db_port:[{required:!0,message:"请输入服务器端口",trigger:["blur","change"]}]},$=async e=>{var r;if(null==(r=s.compData.formData)?void 0:r.db_host){const r=await k();return(null==r?void 0:r.status)?(j.$message.request(r),s.compData.refreshEvent(),void e()):void j.$message.msg({customClass:"bt-message-error-html",dangerouslyUseHTMLString:!0,message:(null==r?void 0:r.msg)||"修改失败",type:"error",duration:0,showClose:!0})}let t;x({$refs:w.value,loading:D.value,request:async()=>(t="mysql"==o.value?await n({...q.value,db_ps:q.value.ps}):await v({data:JSON.stringify({...q.value,db_ps:q.value.ps})},o.value),(null==t?void 0:t.status)?t:(j.$message.msg({customClass:"bt-message-error-html",dangerouslyUseHTMLString:!0,message:(null==t?void 0:t.msg)||"添加失败",type:"error",duration:0,showClose:!0}),null)),async complete(){s.compData.refreshEvent()}})},k=async()=>{let e=null;try{if(e=j.$load(D.value,"修改中..."),"mysql"===o.value){return await b({...q.value,db_ps:q.value.ps})}return await c({data:JSON.stringify({...q.value,db_ps:q.value.ps,type:o.value})},o.value)}catch(r){}finally{e&&e.close()}};return m((()=>{var e;(null==(e=s.compData.formData)?void 0:e.db_host)&&(q.value={...s.compData.formData})})),p((()=>{"redis"===o.value&&(C.value.shift(),C.value.pop())})),r({onConfirm:$}),{__sfc:!0,getServerList:t,tabActive:o,getModulesServeList:l,getRedisServer:y,props:s,vm:j,loading:F,cloudForm:w,formDisabled:D,placeholderData:S,serverForm:q,helpList:C,rules:L,getChange:e=>{q.value.ps=e},addServer:$,openNps:()=>{},editServer:k}}}),(function(){var a=this,o=a._self._c,l=a._self._setupProxy;return o("div",{staticClass:"p-24x"},[o(s,{ref:"cloudForm",attrs:{disabled:l.formDisabled,model:l.serverForm,rules:l.rules},nativeOn:{submit:function(e){e.preventDefault()}}},[o(t,{attrs:{label:"服务器地址",prop:"db_host"}},[o(r,{directives:[{name:"focus",rawName:"v-focus"}],attrs:{placeholder:"请输入服务器地址"},on:{input:l.getChange},model:{value:l.serverForm.db_host,callback:function(e){a.$set(l.serverForm,"db_host",e)},expression:"serverForm.db_host"}})],1),o(t,{attrs:{label:"数据库端口",prop:"db_port"}},[o(r,{attrs:{type:"number"},model:{value:l.serverForm.db_port,callback:function(e){a.$set(l.serverForm,"db_port",e)},expression:"serverForm.db_port"}})],1),"redis"!=l.tabActive?o(t,{attrs:{label:"管理员名称",prop:"db_user"}},[o(r,{attrs:{placeholder:"请输入管理员名称"},model:{value:l.serverForm.db_user,callback:function(e){a.$set(l.serverForm,"db_user",e)},expression:"serverForm.db_user"}})],1):a._e(),o(t,{attrs:{label:"管理员密码",prop:"db_password"}},[o(r,{attrs:{placeholder:"请输入管理员密码"},model:{value:l.serverForm.db_password,callback:function(e){a.$set(l.serverForm,"db_password",e)},expression:"serverForm.db_password"}})],1),o(t,{attrs:{label:"备注"}},[o(r,{attrs:{placeholder:"服务器备注"},model:{value:l.serverForm.ps,callback:function(e){a.$set(l.serverForm,"ps",e)},expression:"serverForm.ps"}})],1)],1),o(e,{staticClass:"ml-20x mt-12x",attrs:{list:l.helpList,"list-style":"disc"}})],1)}),[],!1,null,null,null,null).exports;export{y as default};
