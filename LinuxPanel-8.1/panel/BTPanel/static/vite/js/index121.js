import{_ as a}from"./index120.js?v=1714377894636";import{e,c as o,b as t,f as i,j as l}from"./vue-lib.js?v=1714377894636";import{n as s}from"./main.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./element-lib.js?v=1714377894636";const r=s(e({__name:"index",props:{compData:null},setup(a){const e=a,{proxy:s}=l(),r=o((()=>window.innerHeight-44)),n=t(e.compData.data),p=t({mode:"ace/mode/nginx",theme:"ace/theme/chrome",wrap:!0,showInvisibles:!1,showFoldWidgets:!1,useSoftTabs:!0,tabSize:2,showPrintMargin:!1,readOnly:!1,fontSize:"12px"});return i((()=>e.compData),(()=>{var a;n.value=e.compData.data,(null==(a=e.compData)?void 0:a.readOnly)&&(p.value.readOnly=e.compData.readOnly)})),i((()=>n.value),(()=>{var a;"function"==typeof(null==(a=e.compData)?void 0:a.updata)&&e.compData.updata(n.value)})),{__sfc:!0,props:e,vm:s,windowHeight:r,data:n,config:p}}}),(function(){var e=this._self._c,o=this._self._setupProxy;return e(a,{ref:"aceEditor",style:{height:o.windowHeight+"px !important"},attrs:{id:"zoom-file",config:o.config,isRequest:!1,"is-zoom":!1},model:{value:o.data,callback:function(a){o.data=a},expression:"data"}})}),[],!1,null,null,null,null).exports;export{r as default};