import{_ as e}from"./index85.js?v=1714377894636";import{L as t,w as a,x as s,z as r}from"./element-lib.js?v=1714377894636";import{o,n as l,a as n,b as i,q as u}from"./main.js?v=1714377894636";import{_ as m}from"./ServiceStatus.js?v=1714377894636";import{e as c,b as p,h as v,j as d}from"./vue-lib.js?v=1714377894636";import{a as f}from"./confirm.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import{dL as _,dM as g,y as h,x as y,w as x,v as w,u as b,t as j,dN as F,dO as D,B as C}from"./site.store.js?v=1714377894636";import{_ as S}from"./index40.js?v=1714377894636";import{_ as k}from"./index46.js?v=1714377894636";import"./index45.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./config.js?v=1714377894636";import"./check.js?v=1714377894636";import"./index.vue_vue_type_style_index_0_lang.js?v=1714377894636";const $=l(c({__name:"StatusComponent",props:{msgPush:{default:{}},siteType:{default:""}},setup(e){const t=e,{proxy:a}=d(),s=p(!1),r=p(),l=p(t.msgPush),n=p({status:!1}),i=p(),u=p([]),m=p({give:[],status:n.value.status,interval:1,count:1,push_count:1}),c=p(!1),f={interval:[{required:!0,message:"请输入间隔时间",trigger:["blur","change"]},{validator:(e,t,a)=>{!/^[1-9]\d*$/.test(t)||t<=0?a(new Error("请输入大于0的整数")):a()}}],push_count:[{required:!0,message:"请输入发送次数",trigger:["blur","change"]},{validator:(e,t,a)=>{!/^[1-9]\d*$/.test(t)||t<=0?a(new Error("请输入大于0的整数")):a()}}]},h=async()=>{try{const e=await _();if(e.data.site_push)for(let t in e.data.site_push)if("project_status"===e.data.site_push[t].type){if(e.data.site_push[t].project===l.value.id){m.value=e.data.site_push[t],m.value.id=t,u.value=e.data.site_push[t].module.split(",");break}}else m.value={status:!1,type:"project_status",title:"项目停止告警",project:l.value.id,tid:"site_push@9",interval:600,count:1,push_count:1},u.value=[]}catch(e){}};return v((async()=>{await h()})),{__sfc:!0,props:t,vm:a,formDisabled:s,checkboxRef:r,msgPush:l,msgData:n,scanForm:i,give:u,msgForm:m,stopPopup:c,rules:f,refreshCheckBox:async()=>{await r.value.renderPushConfig(),a.$message.success("刷新成功")},openPopup:()=>{h(),c.value=!0},getPushConfig:h,changeStatus:async e=>{let t=a.$load("正在"+(e?"开启":"关闭")+"，请稍后...");try{if(!m.value.id)return await h(),n.value.status=!1,m.value.status=!1,void(c.value=!0);let e={...m.value,push_count:Number(m.value.push_count),interval:Number(m.value.interval)};delete e.id;const t=await g({id:m.value.id,name:"site_push",data:JSON.stringify(e)});a.$message.request(t),t.status||(c.value=!0)}catch(s){}finally{t.close()}},savePushData:async()=>{0!==u.value.length?(m.value.count=0,"java"===t.siteType&&(m.value.cycle=1),"node"===t.siteType&&(m.value.cycle=2),"python"===t.siteType&&(m.value.cycle=4),a.$refs.scanForm.validate((async e=>{if(!e)return!1;{let e=a.$load("正在保存中，请稍后..."),s=(new Date).getTime();try{m.value.module=u.value.join(",");const e=await g({id:m.value.id||s,name:"site_push",data:JSON.stringify({...m.value,interval:Number(m.value.interval),push_count:Number(m.value.push_count)})});a.$message.request(e),h(),c.value=!1}catch(t){}finally{e.close()}}}))):a.$message.error("请选择告警方式")},cancelPopup:()=>{c.value=!1,i.value.clearValidate()},isRelease:o}}}),(function(){var o=this,l=o._self._c,u=o._self._setupProxy;return l("div",[l(t),l("span",{staticClass:"flex items-center"},[o._v("项目异常停止时提醒我: "),l(k,{staticClass:"mx-4x",on:{change:u.changeStatus},model:{value:u.msgForm.status,callback:function(e){o.$set(u.msgForm,"status",e)},expression:"msgForm.status"}}),l(n,{on:{click:u.openPopup}},[o._v("告警设置")])],1),l(i,{attrs:{title:u.msgData.title||"项目异常停止告警设置",visible:u.stopPopup,area:60,showFooter:""},on:{"update:visible":function(e){u.stopPopup=e},cancel:u.cancelPopup,confirm:u.savePushData}},[l("div",{staticClass:"p-20x"},[l(a,{ref:"scanForm",attrs:{model:u.msgForm,disabled:u.formDisabled,rules:u.rules}},[l(s,{attrs:{label:"停止告警"}},[l(k,{model:{value:u.msgForm.status,callback:function(e){o.$set(u.msgForm,"status",e)},expression:"msgForm.status"}})],1),u.isRelease?o._e():l(s,{attrs:{label:"自动重启"}},[l(r,{attrs:{label:1},model:{value:u.msgForm.count,callback:function(e){o.$set(u.msgForm,"count",e)},expression:"msgForm.count"}},[o._v("自动尝试重启项目")]),l(r,{attrs:{label:2},model:{value:u.msgForm.count,callback:function(e){o.$set(u.msgForm,"count",e)},expression:"msgForm.count"}},[o._v("不做重启尝试")])],1),l(s,{attrs:{label:"间隔时间",prop:"interval"}},[l("div",{staticClass:"flex items-center"},[l(e,{attrs:{textType:"秒",width:"12rem",type:"number",min:1},model:{value:u.msgForm.interval,callback:function(e){o.$set(u.msgForm,"interval",e)},expression:"msgForm.interval"}}),l("span",{staticClass:"text-[1.2rem] text-[#666] ml-12x"},[o._v("后再次监控检测条件 ")])],1)]),l(s,{attrs:{label:"每天发送",prop:"push_count"}},[l("div",{staticClass:"flex items-center"},[l(e,{attrs:{textType:"次",width:"12rem",type:"number",min:1},model:{value:u.msgForm.push_count,callback:function(e){o.$set(u.msgForm,"push_count",e)},expression:"msgForm.push_count"}}),l("span",{staticClass:"text-[1.2rem] text-[#666] ml-12x"},[o._v("后，当日不再发送，次日恢复 ")])],1)]),l(s,{attrs:{label:"告警方式"}},[l(S,{ref:"checkboxRef",model:{value:u.give,callback:function(e){u.give=e},expression:"give"}})],1),l("ul",{staticClass:"list-disc mt-20x ml-20x leading-10"},[l("li",[o._v(" 点击安装后状态未更新，尝试点击【"),l(n,{on:{click:u.refreshCheckBox}},[o._v("手动刷新")]),o._v("】 ")],1)])],1)],1)])],1)}),[],!1,null,null,null,null).exports;const P=l(c({__name:"ServiceState",props:{compData:{default:{}}},setup(e){var t;const a=e,{proxy:s}=d(),r=p(null==(t=a.compData.project_type)?void 0:t.toLowerCase()),o=p({status:!1,time:0,where_hour:0,where_minute:0}),l=p(a.compData),n=p(!1),i=p(!1),u=async()=>{i.value=!0;try{let e=r.value;"node"===r.value&&(e="nodejs");const t=await F({model_name:e,project_name:l.value.name});o.value=t.data,o.value.status=!!t.data.status}catch(e){}finally{i.value=!1}},m=async()=>{i.value=!0;let e=r.value;"node"===e&&(e="nodejs");try{let t={project_name:a.compData.name};"python"===e&&(t.name=a.compData.name,delete t.project_name);const s=await C({data:JSON.stringify(t)},e);l.value=s.data}catch(t){}finally{i.value=!1}},c=p(),_=p(!1);return v((async()=>{var e;let t=null==(e=a.compData.project_type)?void 0:e.toLowerCase();r.value=t,l.value=a.compData,m(),_.value&&c.value.$options.mounted[1](),_.value=!0})),{__sfc:!0,props:a,vm:s,siteType:r,restartForm:o,rowData:l,restartPopup:n,viewLoading:i,serviceManageEvent:async e=>{let t=r.value;"node"===r.value&&(t="nodejs"),f({confirm:{title:"设置项目状态",message:"确定要"+("restart"===e?"重启":"stop"===e?"停止":"启动")+"项目吗？",icon:"warning"},loading:"正在设置状态，请稍后...",request:async()=>{let r;if("python"===t){let t={name:a.compData.name};"restart"===e?r=await h({data:JSON.stringify(t)}):"stop"===e?r=await y({data:JSON.stringify(t)}):"start"===e&&(r=await x({data:JSON.stringify(t)}))}else"restart"===e?r=await w({data:JSON.stringify({project_name:a.compData.name})},t):"stop"===e?r=await b({data:JSON.stringify({project_name:a.compData.name})},t):"start"===e&&(r=await j({data:JSON.stringify({project_name:a.compData.name})},t));return s.$message.msg({dangerouslyUseHTMLString:!0,message:r.data.status?r.data.msg||r.data.data:r.data.error_msg||r.data.msg,type:r.data.status?"success":"error",duration:r.data.status?2e3:0,showClose:!r.data.status}),m(),null},complete:m})},getRestartEvent:u,setRestartStatus:async e=>{let t=s.$load("正在设置状态，请稍后...");try{let t=r.value;"node"===r.value&&(t="nodejs");const a=await D({model_name:t,project_name:l.value.name,status:e?1:0,hour:o.value.where_hour,minute:o.value.where_minute});s.$message.request(a),n.value=!1,u()}catch(a){}finally{t.close()}},getInfoEvent:m,StatusComponentRef:c,refreshStatus:_,StatusComponent:$}}}),(function(){var t=this,r=t._self._c,o=t._self._setupProxy;return r("div",{directives:[{name:"loading",rawName:"v-loading",value:o.viewLoading,expression:"viewLoading"}]},[r("div",{staticClass:"flex flex-col text-[#666]"},[r("span",{staticClass:"mb-12x flex items-center"},[t._v("当前状态："),r(m,{attrs:{status:o.rowData.run}})],1),r("div",{staticClass:"flex items-center"},[o.rowData.run?t._e():r(u,{attrs:{type:"default"},on:{click:function(e){return o.serviceManageEvent("start")}}},[t._v("启动")]),o.rowData.run?r(u,{attrs:{type:"default"},on:{click:function(e){return o.serviceManageEvent("stop")}}},[t._v("停止")]):t._e(),r(u,{attrs:{type:"default"},on:{click:function(e){return o.serviceManageEvent("restart")}}},[t._v("重启")])],1)]),"java"===o.siteType||"node"===o.siteType||"python"===o.siteType?r(o.StatusComponent,{ref:"StatusComponentRef",attrs:{msgPush:t.compData,siteType:o.siteType}}):t._e(),r(i,{attrs:{title:"项目重启设置",visible:o.restartPopup,area:48,showFooter:""},on:{"update:visible":function(e){o.restartPopup=e},confirm:function(e){return o.setRestartStatus(!0)}}},[r("div",{staticClass:"p-20x"},[r(a,{attrs:{"label-position":"right",model:o.restartForm}},[r(s,{attrs:{label:"项目名称"}},[r(e,{attrs:{disabled:""},model:{value:o.rowData.name,callback:function(e){t.$set(o.rowData,"name",e)},expression:"rowData.name"}})],1),r(s,{attrs:{label:"执行周期"}},[r("div",{staticClass:"flex items-center"},[r(e,{attrs:{"prepend-text":"每天",type:"number",width:"18.6rem","text-type":"时"},model:{value:o.restartForm.where_hour,callback:function(e){t.$set(o.restartForm,"where_hour",e)},expression:"restartForm.where_hour"}}),r(e,{attrs:{type:"number",width:"12rem","text-type":"分"},model:{value:o.restartForm.where_minute,callback:function(e){t.$set(o.restartForm,"where_minute",e)},expression:"restartForm.where_minute"}})],1)])],1)],1)])],1)}),[],!1,null,"3068c8d0",null,null).exports;export{P as default};
