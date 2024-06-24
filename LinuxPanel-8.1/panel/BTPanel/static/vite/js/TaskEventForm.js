import{_ as r}from"./index85.js?v=1714377894636";import{w as t,x as a,q as s,s as e}from"./element-lib.js?v=1714377894636";import{n as o}from"./main.js?v=1714377894636";import{_ as i}from"./cascader.js?v=1714377894636";import{e as l,v as p,b as n,w as m,j as c}from"./vue-lib.js?v=1714377894636";import{o as d}from"./confirm.js?v=1714377894636";import{g as _}from"./index35.js?v=1714377894636";import{D as g,E as u}from"./crontab.api.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./cascader-panel.js?v=1714377894636";import"./index62.js?v=1714377894636";import"./config.js?v=1714377894636";import"./index77.js?v=1714377894636";import"./index42.js?v=1714377894636";import"./index39.js?v=1714377894636";import"./index53.js?v=1714377894636";import"./index57.js?v=1714377894636";import"./index43.js?v=1714377894636";import"./upload.js?v=1714377894636";import"./index59.js?v=1714377894636";import"./index38.js?v=1714377894636";import"./index45.js?v=1714377894636";import"./index61.js?v=1714377894636";const v=o(l({__name:"TaskEventForm",props:{compData:{default:{}}},setup(r,{expose:t}){const a=r,{proxy:s}=c(),e=p({op_value:[{required:!0,message:"请输入比较值",trigger:"blur"}],args:[{required:!0,message:"请输入参数",trigger:"blur"}]}),o=p({on:"script",run_script_id:"",operator:"in",op_value:"",run_script:"",trigger_id:a.compData.trigger_id,args:""}),i=p({is_args:"",args_holder:"",args_title:""}),l=n(!1),v=n(),{refs:{scriptLibraryData:f}}=_(),j=r=>{d({$refs:v.value,loading:l,request:async()=>{let t={...o,run_script_id:o.run_script_id[1]};delete t.on;let e={};a.compData.rowData?(a.compData.rowData,delete t.trigger_id,t.where_id=a.compData.rowData.where_id,e=await g({data:JSON.stringify(t)})):e=await u({data:JSON.stringify(t)}),s.$message.request(e),r(),a.compData.refreshEvent()}})};return m((()=>{if(a.compData.rowData){const{operator:r,op_value:t,trigger_id:s,run_script_id:e,args:l,run_script:p}=a.compData.rowData;if(Object.assign(o,{operator:r,op_value:t,trigger_id:s,run_script_id:e,args:l,run_script:p}),t){const{args_ps:r,args_title:t,is_args:s}=a.compData.rowData.script_info;i.args_holder=r,i.args_title=t,i.is_args=!!s}}})),t({onConfirm:j}),{__sfc:!0,props:a,vm:s,rules:e,taskEventForm:o,argsForm:i,propsData:{label:"name",value:"script_id",children:"script_list"},formDisabled:l,taskEvent:v,scriptLibraryData:f,changeScriptType:r=>{},onConfirm:j,changeScript:r=>{let t=s.$refs.scriptCascader.getCheckedNodes()[0].data;1===t.is_args?(i.is_args=!0,i.args_holder=t.args_ps,i.args_title=t.args_title):i.is_args=!1}}}}),(function(){var o=this,l=o._self._c,p=o._self._setupProxy;return l("div",{staticClass:"p-20x"},[l(t,{ref:"taskEvent",attrs:{disabled:p.formDisabled,"label-width":"80px",model:p.taskEventForm,rules:p.rules}},[l(a,{attrs:{label:"当执行结果"}},[l("div",{staticClass:"flex items-center"},[l(s,{model:{value:p.taskEventForm.operator,callback:function(r){o.$set(p.taskEventForm,"operator",r)},expression:"taskEventForm.operator"}},[l(e,{attrs:{label:"包含",value:"in"}}),l(e,{attrs:{label:"不包含",value:"not in"}}),l(e,{attrs:{label:"等于",value:"="}}),l(e,{attrs:{label:"不等于",value:"！="}})],1),l(a,{attrs:{label:"",prop:"op_value"}},[l(r,{staticClass:"ml-12x",attrs:{width:"23rem",placeholder:"请输入比较值"},model:{value:p.taskEventForm.op_value,callback:function(r){o.$set(p.taskEventForm,"op_value",r)},expression:"taskEventForm.op_value"}})],1)],1)]),l(a,{attrs:{label:"运行"}},[l("div",{staticClass:"flex items-center"},[l(s,{staticClass:"mr-12x",on:{change:p.changeScriptType},model:{value:p.taskEventForm.on,callback:function(r){o.$set(p.taskEventForm,"on",r)},expression:"taskEventForm.on"}},[l(e,{attrs:{label:"脚本库",value:"script"}}),l(e,{attrs:{label:"自定义脚本",value:"0"}})],1),l(i,{ref:"scriptCascader",attrs:{"show-all-levels":!1,props:p.propsData,options:p.scriptLibraryData,placeholder:"请选择脚本,支持搜索",filterable:""},on:{change:p.changeScript},model:{value:p.taskEventForm.run_script_id,callback:function(r){o.$set(p.taskEventForm,"run_script_id",r)},expression:"taskEventForm.run_script_id"}})],1)]),p.argsForm.is_args?l(a,{attrs:{label:p.argsForm.args_title,prop:"args"}},[l(r,{attrs:{placeholder:p.argsForm.args_holder,width:"32.2rem"},model:{value:p.taskEventForm.args,callback:function(r){o.$set(p.taskEventForm,"args",r)},expression:"taskEventForm.args"}})],1):o._e()],1)],1)}),[],!1,null,"da791161",null,null).exports;export{v as default};
