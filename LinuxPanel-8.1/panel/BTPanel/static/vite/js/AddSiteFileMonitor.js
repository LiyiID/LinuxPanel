import{_ as e}from"./index118.js?v=1714377894636";import{aS as t,eh as o,n as a,D as r}from"./main.js?v=1714377894636";import{w as i,x as s,Q as l}from"./element-lib.js?v=1714377894636";import{_ as n}from"./index85.js?v=1714377894636";import{e as p,v as c,c as m,b as d,h as f,j as u}from"./vue-lib.js?v=1714377894636";import{o as h}from"./confirm.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./config.js?v=1714377894636";const b=a(p({__name:"AddSiteFileMonitor",props:{compData:{default:()=>{}}},setup(e,{expose:a}){const r=e,{proxy:i}=u(),s=c({path:"",type:"dir",domain:r.compData.name,actions:[]}),l=m((()=>"dir"===s.type)),n=d(null),p=d(!1),b=async e=>{let t={...s};if(""===s.path)return void i.$message.error("请选择监测路径");if(0==s.actions.length)return void i.$message.error("请选择告警操作");let a=[0,0,0,0];s.actions.includes("read")&&(a[0]=1),s.actions.includes("del")&&(a[1]=1),s.actions.includes("reit")&&(a[2]=1,a[3]=1),t.actions=a.join(","),t.type=s.type,h({$refs:n.value,loading:p,request:async()=>await o(!!r.compData.row,{...t}),complete:async()=>{r.compData.refresh&&r.compData.refresh()}})},j=()=>{if(r.compData.path&&(s.path=r.compData.path.replace("//","/")),r.compData.row){const e=["del","read","reit"],t=[];Object.entries(r.compData.row).forEach((([o,a])=>{e.includes(o)&&Number(a)&&t.push(o)})),s.actions=t}};return f((()=>{j()})),a({onConfirm:b}),{__sfc:!0,props:r,vm:i,fileMonitorForm:s,isDirs:l,alertType:[{name:"read",title:"读取"},{name:"del",title:"删除"},{name:"reit",title:"修改/增加"}],addFileMonitorRef:n,formDisabled:p,openFile:()=>{r.compData.row||t({type:"all",path:s.path,change:(e,t)=>{s.path=e,s.type=t,s.actions="dir"===t?["read"]:["read","del","reit"]}})},clearSpace:e=>{s.path=s.path.replace(/\s+/g,"")},checkFileType:e=>{if(e.endsWith("/"))return"dir";{const t=e.lastIndexOf("/");return e.substring(t+1).includes(".")?"file":"dir"}},onConfirm:b,init:j}}}),(function(){var t=this,o=t._self._c,a=t._self._setupProxy;return o("div",{staticClass:"p-20x"},[o(i,{ref:"addFileMonitorRef",attrs:{disabled:a.formDisabled,model:a.fileMonitorForm}},[o(s,{attrs:{prop:"path",label:"监测路径"}},[o(n,{staticClass:"w-[24rem]",attrs:{"icon-type":"folder",disabled:!!a.props.compData.row,placeholder:"请选择文件目录"},on:{folder:a.openFile,"&change":function(e){return a.clearSpace("path")}},model:{value:a.fileMonitorForm.path,callback:function(e){t.$set(a.fileMonitorForm,"path",e)},expression:"fileMonitorForm.path"}})],1),o(s,{attrs:{label:"告警操作"}},[o(l,{model:{value:a.fileMonitorForm.actions,callback:function(e){t.$set(a.fileMonitorForm,"actions",e)},expression:"fileMonitorForm.actions"}},t._l(a.alertType,(function(e,i){return o(r,{key:i,attrs:{label:e.name,disabled:a.isDirs&&i>0}},[o("div",[o("span",[t._v(t._s(e.title))])])])})),1)],1)],1),o(e,{staticClass:"ml-20x mt-20x",attrs:{list:[{text:"目录暂时只支持读取告警操作"}],"list-style":"disc"}})],1)}),[],!1,null,null,null,null).exports;export{b as default};
