import{n as e,D as s}from"./main.js?v=1714377894636";import{w as t,x as a,Q as i}from"./element-lib.js?v=1714377894636";import{e as r,A as l,b as o,c as m,j as n}from"./vue-lib.js?v=1714377894636";import{r as c,c as p}from"./index28.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./index77.js?v=1714377894636";import"./index42.js?v=1714377894636";import"./check.js?v=1714377894636";import"./mysql.store.js?v=1714377894636";const u=e(r({__name:"ClearRedis",setup(e,{expose:s}){const{tableParam:t}=l(c()),{initTable:a}=c(),{proxy:i}=n(),r=o(Array.isArray(t.value.keyList)?t.value.keyList.map((e=>e.name)):[]),u=o(),d=m((()=>r.value.length>0&&r.value.length<t.value.keyList.length)),f=async e=>{try{await i.$confirm({icon:"warning",title:"提示",message:"此操作将清空选中的数据库, 是否继续?"});const s=t.value.keyList.filter((e=>r.value.includes(e.name))).map((e=>e.id)),l=await p({data:JSON.stringify({ids:JSON.stringify(s),sid:t.value.sid})});i.$message.request(l),a(),e()}catch(s){}};return s({onConfirm:f}),{__sfc:!0,tableParam:t,initTable:a,vm:i,checkedList:r,checkAll:u,isIndeterminate:d,onClear:f}}}),(function(){var e=this,r=e._self._c,l=e._self._setupProxy;return r("div",{staticClass:"p-20x"},[r(t,[r(a,{attrs:{label:"选择数据库"}},[r("div",{staticClass:"border border-[#ececec] p-16x w-[22rem] max-h-[20rem] overflow-auto"},[r(i,{model:{value:l.checkedList,callback:function(e){l.checkedList=e},expression:"checkedList"}},e._l(l.tableParam.keyList,(function(e,t){return r(s,{key:t,staticClass:"w-full !mr-0",attrs:{label:e.name}})})),1)],1)])],1)],1)}),[],!1,null,null,null,null).exports;export{u as default};