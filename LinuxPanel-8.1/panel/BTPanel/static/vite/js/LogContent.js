import{_ as t}from"./index120.js?v=1714377894636";import{e,c as a,b as s,f as o,h as i}from"./vue-lib.js?v=1714377894636";import{eO as n,eP as l,dd as r,eQ as m}from"./site.store.js?v=1714377894636";import{n as p}from"./main.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./check.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./element-lib.js?v=1714377894636";const c=p(e({__name:"LogContent",props:{compData:{default:()=>({})}},setup(t,{expose:e}){const p=t,c=a((()=>p.compData.type)),d=s(!1),g=s(""),u=s({mode:"ace/mode/nginx",theme:"ace/theme/monokai",wrap:!0,showInvisibles:!1,showFoldWidgets:!1,useSoftTabs:!0,tabSize:2,showPrintMargin:!1,readOnly:!0,fontSize:"12px"}),f=async()=>{try{let t;switch(c.value){case"nginxLogs":t=await m({siteName:p.compData.name});break;case"nginxErrorLogs":t=await r({siteName:p.compData.name});break;case"projectLogs":t=await l({sitename:p.compData.name});break;case"installLogs":t=await n({sitename:p.compData.name,type:"install"})}g.value=t.data||t.msg}catch(t){}};return o((()=>c.value),(t=>{f()})),e({getLogContent:f}),i((()=>{f()})),{__sfc:!0,props:p,type:c,textLoading:d,staticContent:g,config:u,getLogContent:f}}}),(function(){var e=this._self._c,a=this._self._setupProxy;return e("div",{staticClass:"h-full"},[e("div",[e(t,{directives:[{name:"loading",rawName:"v-loading",value:a.textLoading,expression:"textLoading"}],staticClass:"!h-[60rem] !w-full",attrs:{id:"logContent".concat(a.props.compData.type),config:a.config},model:{value:a.staticContent,callback:function(t){a.staticContent=t},expression:"staticContent"}})],1)])}),[],!1,null,"74e88a5a",null,null).exports;export{c as default};
