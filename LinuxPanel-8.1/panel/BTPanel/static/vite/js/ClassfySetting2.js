import{_ as a}from"./index85.js?v=1714377894636";import{L as e,w as s,x as t}from"./element-lib.js?v=1714377894636";import{a as o,n as l,q as r,b as n}from"./main.js?v=1714377894636";import{_ as i}from"./index39.js?v=1714377894636";import{_ as m}from"./index59.js?v=1714377894636";import"./index45.js?v=1714377894636";import{e as c,b as p,v as d,H as u,h as f,j as b}from"./vue-lib.js?v=1714377894636";import{V as v,m as y,W as j,X as x}from"./crontab.api.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";const _=l(c({__name:"ClassfySetting",props:{compData:{default:{}}},setup(a){const s=a,{proxy:t}=b(),l=p(!1),r=d({name:"",id:0}),n=p(),i=p(!1),m=p(!1),c=p([{label:"分类名称",prop:"name"},{label:"操作",align:"right",render:a=>a.id?u("div",[u(o,{on:{click:()=>{r.id=a.id,r.name=a.name,i.value=!0}}},["编辑"]),u(e,{attrs:{direction:"vertical"}}),u(o,{on:{click:async()=>{try{await t.$confirm({title:"提示",icon:"warning",message:"确认删除该分类吗？该分类下的计划任务将会被移动至默认分类下，是否继续？"});const e=await v({id:a.id});t.$message.request(e),C(),s.compData.refreshEvent()}catch(e){}}}},["删除"])]):"不可操作"}]),_=p([]),C=async()=>{try{m.value=!0;const a=await y();_.value=a.data.value,_.value.unshift({name:"全部"},{name:"系统分类"},{name:"默认分类"}),m.value=!1}catch(a){}finally{m.value=!1}},h=()=>{r.id=0,r.name=""};return f((()=>{C()})),{__sfc:!0,props:s,vm:t,formDisabled:l,classForm:r,crontabClassForm:n,addClassPopup:i,tableLoading:m,tableColumns:c,tableData:_,getClassfyList:C,addClassEvent:async()=>{let a,e;try{a=t.$load(t.$t("正在操作分类，请稍后...")),e=r.id?await x({...r}):await j({name:r.name}),h(),t.$message.request(e),i.value=!1,C(),s.compData.refreshEvent()}catch(o){}finally{a&&a.close()}},onCancel:h}}}),(function(){var e=this,o=e._self._c,l=e._self._setupProxy;return o("div",{staticClass:"p-20x"},[o(m,{scopedSlots:e._u([{key:"header-left",fn:function(){return[o(r,{on:{click:function(a){l.addClassPopup=!0}}},[e._v("添加分类")])]},proxy:!0},{key:"content",fn:function(){return[o(i,{directives:[{name:"loading",rawName:"v-loading",value:l.tableLoading,expression:"tableLoading"}],attrs:{"max-height":400,column:l.tableColumns,data:l.tableData}})]},proxy:!0},{key:"popup",fn:function(){return[o(n,{attrs:{visible:l.addClassPopup,area:40,showFooter:"",title:"添加分类"},on:{"update:visible":function(a){l.addClassPopup=a},cancel:l.onCancel,confirm:l.addClassEvent}},[o("div",{staticClass:"p-20x"},[o(s,{ref:"crontabClassForm",attrs:{model:l.classForm,disabled:l.formDisabled}},[o(t,{attrs:{label:"分类名称",prop:"name"}},[o(a,{attrs:{placeholder:"请输入分类名称"},model:{value:l.classForm.name,callback:function(a){e.$set(l.classForm,"name",a)},expression:"classForm.name"}})],1)],1)],1)])]},proxy:!0}])})],1)}),[],!1,null,"c61a8752",null,null).exports;export{_ as default};
