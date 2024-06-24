import{_ as e}from"./preload-helper.js?v=1714377894636";import{l as t}from"./main.js?v=1714377894636";const s=s=>{var r;t({isAsync:!0,title:s.titleType,area:["40"],btn:["确认","取消"],component:()=>e((()=>import("./bachDialog.js?v=1714377894636")),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]),import.meta.url),compData:{title:s.title,dataList:s.dataList,requestFun:s.requestFun,isRecurrence:s.isRecurrence,isCloseRes:null==(r=s.isCloseRes)||r,diyRes:s.diyRes,tableColumn:s.tableColumn||[{prop:"name",label:"名称"},{prop:"status",label:"状态"}],resDescription:s.resDescription||{success:"处理成功",wait:"等待处理",error:"处理失败"},resDescriptionColor:s.resDescriptionColor||{success:"text-primary",error:"text-danger",wait:"text-warning"},isReturnResult:s.isReturnResult||!1,callback:s.callback}})};export{s as o};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./bachDialog.js?v=1714377894636","./element-lib.js?v=1714377894636","./__commonjsHelpers__.js?v=1714377894636","./vue-lib.js?v=1714377894636","./public-lib.js?v=1714377894636","./main.js?v=1714377894636","./modulepreload-polyfill.js?v=1714377894636","./preload-helper.js?v=1714377894636","./request-lib.js?v=1714377894636","./locales-lib.js?v=1714377894636","./index39.js?v=1714377894636","./element-lib.js?v=1714377894636"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
