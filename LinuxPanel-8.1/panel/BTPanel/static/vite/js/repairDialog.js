import{_ as s}from"./index118.js?v=1714377894636";import{e,O as t,n as a,q as i}from"./main.js?v=1714377894636";import{_ as r}from"./index41.js?v=1714377894636";import{_ as o}from"./index76.js?v=1714377894636";import{e as n,v as l,c as m,h as p,j as c}from"./vue-lib.js?v=1714377894636";import{g as u}from"./soft.store.js?v=1714377894636";import{c as f,r as v}from"./soft.api.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./element-lib.js?v=1714377894636";const _=a(n({__name:"repairDialog",props:{compData:{default:()=>({})}},setup(s){const a=s,{proxy:i}=c(),{softData:r}=a.compData,{getSoftTableList:o}=u(),n=l({upgrades:[],version:"",options:[],info:{}}),_=m((()=>{const s=r.name;return"total"===s||"rsync"===s||"syssafe"===s||"tamper_proof"===s})),d=async()=>{var s;const e=await f({plugin_name:r.name,show:1});if(e.status){n.upgrades=e.data;const t=n.upgrades.at(-1)||{beta:!1},a=t.beta?t:{},i=n.upgrades.at(0);if(n.info=r.is_beta?a:i,!n.info){const s=r.version;n.info={beta:2,m_version:s.split[0],update_msg:0,update_time:0,version:s.split[1]}}_&&(n.options=n.upgrades.map((s=>({title:s.m_version+"."+s.version+(s.beta?"bate":"Stable"),key:s.m_version+"."+s.version}))),n.version=(null==(s=n.options.at(0))?void 0:s.key)||"")}else i.$message.error(e.msg)};return p((()=>{d()})),{__sfc:!0,vm:i,props:a,softData:r,getSoftTableList:o,plugin:n,changeVersion:s=>{n.version=s},helpList:[{text:"无法修复？请尝试切换下版本。"}],isSpecial:_,getPlugin:d,setVersion:async()=>{const s=await f({plugin_name:r.name,show:1});if(s.status){n.upgrades=s.data;const t=n.upgrades.at(-1)||{beta:!1},a=t.beta?t:{},i=n.upgrades.at(0);if(n.info=r.is_beta?a:i,!n.info){const s=r.version;n.info={beta:2,m_version:s.split[0],update_msg:0,update_time:0,version:s.split[1]}}e({name:r.name,type:"i",softData:n.upgrades})}else i.$message.error(s.msg)},repair:async()=>{const s=await v({version:n.info.m_version,min_version:n.info.version,plugin_name:r.name});s.status?(i.$emit("close"),t({name:s.data.name,type:"r",softData:{...s.data,callback:r.callback}})):i.$message.error(s.msg)}}}}),(function(){var e=this,t=e._self._c,a=e._self._setupProxy;return t("div",{staticClass:"w-full p-[2rem] text-[1.2rem]"},[t("div",{staticClass:"flex items-center"},[t("div",{staticClass:"message flex-1 py-[.3rem] leading-[2.4rem]"},[t(o,{attrs:{icon:!1,closable:!1},scopedSlots:e._u([{key:"title",fn:function(){return[t("div",{staticClass:"leading-[2.5rem] flex items-center"},[e._v(" 提示：如果当前插件出现"),t("span",{staticClass:"text-[red]"},[e._v("异常错误")]),e._v("或"),t("span",{staticClass:"text-[red]"},[e._v("无法使用")]),e._v("，请尝试点击 "),t(i,{staticClass:"!ml-[.5rem]",attrs:{title:"修复插件"},on:{click:a.repair}},[e._v("修复插件")])],1)]},proxy:!0}])}),a.isSpecial?t("div",[t("div",{staticClass:"flex items-center justify-center mt-[2rem]"},[t("div",[e._v("选择版本")]),t(r,{staticClass:"w-[24rem] ml-[2rem] mr-[1rem]",attrs:{options:a.plugin.options,change:a.changeVersion},model:{value:a.plugin.version,callback:function(s){e.$set(a.plugin,"version",s)},expression:"plugin.version"}}),t(i,{staticClass:"!ml-[.5rem]",attrs:{title:"切换版本"},on:{click:a.setVersion}},[e._v("切换版本")])],1),t(s,{staticClass:"mt-[2rem] ml-[2rem]",attrs:{list:a.helpList,"list-style":"disc"}})],1):e._e()],1)])])}),[],!1,null,"0e732eb6",null,null).exports;export{_ as default};