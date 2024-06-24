import{a as t}from"./index53.js?v=1714377894636";import{_ as e}from"./index39.js?v=1714377894636";import{_ as a}from"./index59.js?v=1714377894636";import{a9 as s}from"./element-lib.js?v=1714377894636";import{l as i,n as l}from"./main.js?v=1714377894636";import{_ as r}from"./preload-helper.js?v=1714377894636";import{e as o,b as n,v as m,h as p,j as c}from"./vue-lib.js?v=1714377894636";import{g as u}from"./index28.js?v=1714377894636";import{m as d,D as b,F as f,i as v}from"./mysql.store.js?v=1714377894636";import{f as y}from"./database.table.js?v=1714377894636";import{c as h}from"./check.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./index77.js?v=1714377894636";import"./index42.js?v=1714377894636";import"./index38.js?v=1714377894636";import"./index45.js?v=1714377894636";import"./index.vue_vue_type_style_index_0_lang.js?v=1714377894636";const _=l(o({__name:"DatabaseDelete",props:{compData:{default:()=>{}}},emits:["handle-complete"],setup(t,{expose:e,emit:a}){const s=t,{proxy:l}=c(),{refs:{textTemp:o,tabActive:_,dbRecycle:j},getDatabase:g}=u(),{getDatabase:x}=d(),D=n([]),C=n(!0),w=y(),T=m({title:"警告",titleType:"warning",description:"删除数据库后，数据库内的所有数据将被清空，且不可恢复。"}),q=n(!1),S=m({batchStatus:2,isRecurrence:!1,batchVisible:!1,list:[],batchSelect:"",describe:{th:"数据库名称",title:"批量删除数据库",message:"批量删除数据库已完成，共个任务，成功个，失败个。",propsValue:"name"}}),A=async t=>{o.value=!1,await l.$confirm({type:"input",width:50,title:"二次验证信息-删除数据库",message:"删除后如需彻底删除请前往数据库回收站，是否继续操作？",isCalc:!0,icon:"warning",inputText:"删除数据库"});let e=[];const a=l.$load("正在删除...");try{D.value.forEach((async(t,a)=>{let{id:o,name:n}=t;const m="mysql"===_.value?await b({id:o,name:n}):await b({data:JSON.stringify({id:o,name:n})},_.value);"isMult"!==s.compData.type&&l.$message.request(m),e.push({id:o,name:n,status:m.status}),a===D.value.length-1&&("mysql"===_.value?x():g(),i({title:"批量删除数据库结果",area:42,component:()=>r((()=>import("./index63.js?v=1714377894636")),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]),import.meta.url),compData:{resultData:e,resultTitle:"删除数据库"}}))})),t()}catch(n){}finally{a.close()}},O=async()=>{try{let t={};t="mysql"===_.value?await f({ids:JSON.stringify(s.compData.arrList)}):await v({data:JSON.stringify({ids:JSON.stringify(s.compData.arrList)})},_.value),D.value=h(t.data,"array",[]),D.value.forEach((t=>{t.sid&&(q.value=!0)})),q.value||"mysql"!==_.value?(C.value=!1,q.value&&(C.value=!0),T.titleType="error",T.description="当前列表存在彻底删除后无法恢复的数据库，请仔细查看列表，以防误删，是否继续操作？"):C.value=!1}catch(t){}};return p((()=>{O()})),e({onConfirm:A}),{__sfc:!0,vm:l,textTemp:o,tabActive:_,dbRecycle:j,getDatabase:g,getMysqlDatabase:x,props:s,tableData:D,cloudDBserver:C,deleteTableColumn:w,titleAlert:T,emits:a,isCloudFlag:q,batchConfig:S,handleComplete:t=>{a("handle-complete",t,t.length)},confirmDelete:A,onOpen:O}}}),(function(){var i=this,l=i._self._c,r=i._self._setupProxy;return l("div",{staticClass:"p-28x"},[l(s,{attrs:{title:"警告",type:r.titleAlert.titleType,"show-icon":"",closable:!1,description:r.titleAlert.description}}),l(a,{scopedSlots:i._u([{key:"content",fn:function(){return[l(e,{ref:"mysqlDelete",staticClass:"max-h-[30rem] overflow-auto",attrs:{data:r.tableData,column:r.deleteTableColumn}})]},proxy:!0}])}),r.cloudDBserver?l("p",{staticClass:"text-danger"},[i._v(" 注意：远程数据库暂不支持数据库回收站，选中的数据库将彻底删除 ")]):i._e(),l("p",{staticClass:"text-danger"},[i._v(i._s(i.$t("DataBase.DeleteConfirmTip")))]),r.dbRecycle||r.cloudDBserver?i._e():l("p",{staticClass:"text-danger mt-4x"},[i._v(" 当前数据库回收站尚未开启,请谨慎操作! ")]),l(t,{attrs:{batchStatus:r.batchConfig.batchStatus,visible:r.batchConfig.batchVisible,describe:r.batchConfig.describe,data:r.batchConfig.list},on:{"update:visible":function(t){return i.$set(r.batchConfig,"batchVisible",t)},complete:r.handleComplete}})],1)}),[],!1,null,null,null,null).exports;export{_ as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./index63.js?v=1714377894636","./index39.js?v=1714377894636","./element-lib.js?v=1714377894636","./__commonjsHelpers__.js?v=1714377894636","./vue-lib.js?v=1714377894636","./public-lib.js?v=1714377894636","./main.js?v=1714377894636","./modulepreload-polyfill.js?v=1714377894636","./preload-helper.js?v=1714377894636","./request-lib.js?v=1714377894636","./locales-lib.js?v=1714377894636","./element-lib.js?v=1714377894636"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
