import{_ as e}from"./index85.js?v=1714377894636";import{a9 as a,w as t,x as l}from"./element-lib.js?v=1714377894636";import{c as n,aS as s,n as o,b as r}from"./main.js?v=1714377894636";import{_ as i}from"./index118.js?v=1714377894636";import{_ as c}from"./index53.js?v=1714377894636";import{_ as m}from"./index39.js?v=1714377894636";import{_ as p}from"./index59.js?v=1714377894636";import{e as u,b,v as d,h as v,j as f}from"./vue-lib.js?v=1714377894636";import{r as y,p as _,q as h,t as x,u as g,v as j,w as T}from"./mysql.store.js?v=1714377894636";import{c as C}from"./database.table.js?v=1714377894636";import{g as S}from"./index28.js?v=1714377894636";import{o as w}from"./index61.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./check.js?v=1714377894636";import"./index38.js?v=1714377894636";import"./index45.js?v=1714377894636";import"./index.vue_vue_type_style_index_0_lang.js?v=1714377894636";import"./index77.js?v=1714377894636";import"./index42.js?v=1714377894636";const q=o(u({__name:"MysqlTool",props:{compData:{default:{}}},setup(e){const a=e,{proxy:t}=f(),{refs:{tabActive:l}}=S(),o=b(!1),r=b(""),i=b([]),c=b(!1),m=b(),p=d({db_name:"",table_name:"",filename:""}),u=d({filename:[{required:!0,message:"请输入导出文件路径",trigger:["blur","input"]}]}),q=b([{text:t.$t("DataBase.ButtonTip.Optimization")},{text:t.$t("DataBase.ButtonTip.Repair")},{text:t.$t("DataBase.ButtonTip.Temp")}]),B=b(),D=b([{label:"修复",value:"Repair",diyBatch:()=>{w({title:"批量修复已选数据库表，是否继续？",dataList:B.value,titleType:"批量修复数据库表",requestFun:async e=>await M(e,!0),isRecurrence:!0,tableColumn:[{prop:"table_name",label:"表名"},{prop:"status",label:"状态"}],callback:()=>{A()}})}},{label:"优化",value:"Optimization",diyBatch:()=>{w({title:"批量优化已选数据库表，将回收未释放的磁盘空间，是否继续？",dataList:B.value,titleType:"批量优化数据库表",requestFun:async e=>await R(e,!0),isRecurrence:!0,tableColumn:[{prop:"table_name",label:"表名"},{prop:"status",label:"状态"}],callback:()=>{A()}})}},{label:"转为InnoDB",value:"ConversionInnoDB",diyBatch:()=>{w({title:"批量转换数据库表引擎为【InnoDB】，是否继续？",dataList:B.value,titleType:"批量转换数据库表",requestFun:async e=>await z(e,!0,"InnoDB"),isRecurrence:!0,tableColumn:[{prop:"table_name",label:"表名"},{prop:"status",label:"状态"}],callback:()=>{A()}})}},{label:"转为MyISAM",value:"ConversionMyISAM",diyBatch:()=>{w({title:"批量转换数据库表引擎为【MyISAM】，是否继续？",dataList:B.value,titleType:"批量转换数据库表",requestFun:async e=>await z(e,!0,"MyISAM"),isRecurrence:!0,tableColumn:[{prop:"table_name",label:"表名"},{prop:"status",label:"状态"}],callback:()=>{A()}})}}]),E=b([{label:"集合名称",prop:"collection_name"},{label:"文档数量",prop:"count"},{label:"内存中的大小",render:e=>n(e.size)},{label:"对象平均大小",render:e=>n(e.avg_obj_size)},{label:"存储大小",render:e=>n(e.storage_size)},{label:"索引数量",prop:"nindexes"},{label:"索引大小",render:e=>n(e.total_index_size)}]),I=d({isRecurrence:!1,describe:{title:"",th:"",message:"",propsValue:""}}),M=async(e,a)=>{let l={db_name:i.value.database,tables:JSON.stringify([e.table_name])};try{let e=null;a||(e=t.$load("正在修复中，请稍候..."));const n=await y(l);if(a)return n;e.close(),A(),t.$message.request(n)}catch(n){}},R=async(e,a)=>{let l={db_name:i.value.database,tables:JSON.stringify([e.table_name])};try{let e=null;a||(e=t.$load("正在优化中，请稍候..."));const n=await _(l);if(a)return n;e.close(),A(),t.$message.request(n)}catch(n){}},z=async(e,a,l)=>{l||(l="InnoDB"==e.type?"MyISAM":"InnoDB");let n={db_name:i.value.database,tables:JSON.stringify([e.table_name]),table_type:l};try{let e=null;a||(e=t.$load("正在转换中，请稍候..."));const l=await h(n);if(a)return l.data;e.close(),await A(),t.$message.request(l)}catch(s){}},A=async()=>{try{if(r.value="获取中...",o.value=!0,"mysql"==l.value){const e=await x({db_name:a.compData.name});i.value=e,r.value="数据库名称: ".concat(e.database," 大小: ").concat(e.data_size)}else{const e=await g({data:JSON.stringify({db_name:a.compData.name})},l.value);i.value=e.data.collection_list,r.value="数据库名称: ".concat(e.data.db," 集合数量: ").concat(e.data.collections," 存储大小: ").concat(n(e.data.totalSize)," 索引大小: ").concat(n(e.data.indexSize))}o.value=!1}catch(e){}finally{o.value=!1}},$=async e=>{try{const l=await j({db_name:a.compData.name,table_name:e.table_name,comment:e.comment});t.$message.request(l),l.status&&A()}catch(l){}},k=e=>{p.db_name=a.compData.name,p.table_name=e.table_name,c.value=!0},O=C({setPsEvent:$,exportTableStructureEvent:k,repairEvent:M,optimizationEvent:R,conversionEngineEvent:z});return v((()=>{A()})),{__sfc:!0,vm:t,props:a,tabActive:l,tableLoading:o,toolsTop:r,toolsDataValue:i,isExportTableStructure:c,exportTableForm:m,exportTableRow:p,rules:u,tipList:q,checkedList:B,handleSelectionChange:e=>{B.value=e},onPathChange:()=>{s({type:"dir",change:e=>{p.filename=e+"/"+p.db_name+"_"+p.table_name+".sql"}})},batchGroup:D,modeulesTableColumn:E,batchConfig:I,batchEvent:(e,a,t)=>{switch(e){case"Repair":return M(a,!0);case"Optimization":return R(a,!0);case"ConversionInnoDB":return z(a,!0,"InnoDB");case"ConversionMyISAM":return z(a,!0,"MyISAM")}},handleBatch:e=>{let a="操作";switch(e){case"Repair":I.describe.message="批量修复已选数据库表，是否继续？";break;case"Optimization":I.describe.message="批量优化已选数据库表，将回收未释放的磁盘空间，是否继续？";break;case"ConversionMyISAM":case"ConversionInnoDB":let a=e.replace("Conversion","");I.describe.message="批量转换数据库表引擎为【".concat(a,"】，是否继续？")}a="Repair"===e?"修复":"Optimization"===e?"优化":"转换",I.isRecurrence=!0,I.describe.th="表名",I.describe.propsValue="table_name",I.describe.title="批量".concat(a,"数据库表")},repairEvent:M,optimizationEvent:R,conversionEngineEvent:z,onOpen:A,setPsEvent:$,exportTableStructureEvent:k,exportTableStructureConfirm:async()=>{try{m.value.validate((async e=>{if(!e)return!1;const a=t.$load("正在导出中，请稍候..."),l=await T(p);a.close(),t.$message.request(l),l.status&&(p.table_name="",p.filename="",m.value.clearValidate(),c.value=!1)}))}catch(e){}},exportTableStructureCancel:()=>{c.value=!1,p.table_name="",p.filename="",m.value.clearValidate()},toolsTableColumn:O}}}),(function(){var n=this,s=n._self._c,o=n._self._setupProxy;return s("div",{staticClass:"p-16x"},[s(p,{scopedSlots:n._u([{key:"header-left",fn:function(){return[s(a,{staticClass:"font-bold",attrs:{title:o.toolsTop,type:"info",closable:!1}})]},proxy:!0},{key:"content",fn:function(){return["mysql"===o.tabActive?s(m,{directives:[{name:"loading",rawName:"v-loading",value:o.tableLoading,expression:"tableLoading"}],ref:"mysqlTools",attrs:{"max-height":"300","element-loading-text":"正在查询中，请稍后...",column:o.toolsTableColumn,data:o.toolsDataValue.tables},on:{"selection-change":o.handleSelectionChange}}):n._e(),"mysql"!==o.tabActive?s(m,{ref:"mysqlTools",attrs:{"max-height":"300",column:o.modeulesTableColumn,data:o.toolsDataValue},on:{"selection-change":o.handleSelectionChange}}):n._e()]},proxy:!0},"mysql"==o.tabActive?{key:"footer-left",fn:function(){return[s(c,{attrs:{data:o.batchGroup,config:o.batchConfig,"batch-fn":o.batchEvent},on:{"handle-complete":o.onOpen,"handle-batch":o.handleBatch}})]},proxy:!0}:null],null,!0)}),"mysql"===o.tabActive?s(i,{staticClass:"mt-8x ml-16x",attrs:{list:o.tipList,listStyle:"disc"}}):n._e(),s(r,{attrs:{title:"导出表【".concat(o.exportTableRow.table_name,"】结构"),visible:o.isExportTableStructure,area:[50,10],"show-footer":!0},on:{"update:visible":function(e){o.isExportTableStructure=e},confirm:function(e){return o.exportTableStructureConfirm()},cancel:o.exportTableStructureCancel}},[s(t,{ref:"exportTableForm",staticClass:"px-2rem py-3rem",attrs:{model:o.exportTableRow,rules:o.rules}},[s(l,{attrs:{label:"导出文件路径",prop:"filename"}},[s(e,{directives:[{name:"trim",rawName:"v-trim"}],attrs:{name:"filename",iconType:"folder",width:"32rem"},on:{folder:o.onPathChange},model:{value:o.exportTableRow.filename,callback:function(e){n.$set(o.exportTableRow,"filename",e)},expression:"exportTableRow.filename"}})],1)],1)],1)],1)}),[],!1,null,null,null,null).exports;export{q as default};
