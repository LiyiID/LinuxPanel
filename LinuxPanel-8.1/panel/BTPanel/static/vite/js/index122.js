import{y as t,n as e,q as s,a}from"./main.js?v=1714377894636";import{_ as l}from"./index43.js?v=1714377894636";import{a9 as i,u as n}from"./element-lib.js?v=1714377894636";import{_ as r}from"./index77.js?v=1714377894636";import{_ as o}from"./preload-helper.js?v=1714377894636";import{e as p,c as m,b as c,f as u,L as v,h as _,j as f}from"./vue-lib.js?v=1714377894636";import{a7 as d,a5 as x,a8 as C,a9 as j}from"./site.popup.js?v=1714377894636";import{g as b,cs as y}from"./site.store.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./index42.js?v=1714377894636";import"./index38.js?v=1714377894636";import"./index45.js?v=1714377894636";import"./element-ui.common.js?v=1714377894636";import"./date-util.js?v=1714377894636";import"./vdom.js?v=1714377894636";import"./index62.js?v=1714377894636";import"./cascader-panel.js?v=1714377894636";import"./check.js?v=1714377894636";const S=e(p({__name:"index",props:{compData:{default:{row:()=>{}}}},setup(e){const s=e,{proxy:a}=f(),{refs:{sslInfo:l,sslTabsActive:i,sslAlertState:n,siteTabActiveList:r,siteInfo:p,letApplyInfo:S},getSslInfoConfig:L,renewalCert:I,renewalLetCert:h}=b(),A=m((()=>'当前证书 -<span class="'.concat(l.value.isStart?"text-primary":"text-danger",'">[').concat(l.value.isStart?"已部署SSL":"未部署SSL","]</span>"))),g=c(!1),T=c("");u((()=>l.value),(t=>{t.isStart?i.value="currentCertInfo":i.value="busSslList"}));const w=()=>{var t,e,s;let a=null!=(e=null==(t=p.value.project_type)?void 0:t.toLowerCase())?e:"";T.value=a,(null==(s=p.value.project_config)?void 0:s.bind_extranet)&&(g.value=!!p.value.project_config.bind_extranet);-1!==["php","html","phpasync","nginx","proxy"].indexOf(T.value)&&(g.value=!0),g.value&&k()};v("mountEvent",w);const E=c([{title:A.value,customLabel:!0,name:"currentCertInfo",component:()=>o((()=>import("./CurrentCertInfo.js?v=1714377894636")),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]),import.meta.url)},{title:"商用SSL证书",name:"busSslList",component:()=>o((()=>import("./BusSslList.js?v=1714377894636")),__vite__mapDeps([25,1,2,3,4,5,6,7,8,9,10,26,27,28,29,16,17,18,19,20,21,23,22,14,15]),import.meta.url)},{title:"测试证书",name:"trustAsiaList",component:()=>o((()=>import("./TrustAsiaList.js?v=1714377894636")),__vite__mapDeps([30,1,2,3,4,5,6,7,8,9,10,26,27,29,31,16,23,22,14,15,17,18,19,20,21]),import.meta.url)},{title:"Let's Encrypt",name:"letsEncryptList",component:()=>o((()=>import("./LetsEncryptList.js?v=1714377894636")),__vite__mapDeps([32,1,2,3,4,5,6,7,8,9,10,33,34,35,36,37,38,23,22,14,15,16,17,18,19,20,21]),import.meta.url)},{title:"证书夹",name:"certFolderList",component:()=>o((()=>import("./CertFolderList.js?v=1714377894636")),__vite__mapDeps([39,4,5,2,3,6,7,8,9,10,26,27,40,37,41,42,35,29,22,23,15,16,14,17,18,19,20,21]),import.meta.url)}]),k=async()=>{const t=a.$load("正在获取站点证书部署信息，请稍候...");try{await L(),t.close()}catch(e){}finally{t.close()}};return u((()=>S.value.verifyDialog),(t=>{t&&d()})),_((()=>{w()})),{__sfc:!0,props:s,vm:a,sslInfo:l,sslTabsActive:i,sslAlertState:n,siteTabActiveList:r,siteInfo:p,letApplyInfo:S,getSslInfoConfig:L,renewalCert:I,renewalLetCert:h,currentCertTitle:A,isBindExtranet:g,siteType:T,mountEvent:w,tabComponent:E,handleClickTab:t=>{i.value=t},renewalCurrentCert:async()=>{if(3===l.value.type)I(l.value.oid,l.value.type);else if(32===l.value.length&&-1===l.value.indexOf("/")){const t=await x();h(l.value.index),t.close()}else{const{data:t}=await y({siteName:p.value.name,pem_file:l.value.index});C(t)}},applyBusSsl:()=>{i.value="busSslList",j()},openNps:()=>{t({title:"SSL证书需求反馈收集",type:28,isNoRate:!0,softName:"1",isCard:!1,id:993})},jumpPath:()=>{r.value.moduleSettingsAct="mapping",r.value.isJump=!0},init:k}}}),(function(){var t=this,e=t._self._c,o=t._self._setupProxy;return e("div",{staticClass:"relative h-full"},[o.isBindExtranet?e("div",{staticClass:"relative"},[o.sslAlertState?e("div",{staticClass:"mb-16x"},[e(i,{staticClass:"mb-16x",attrs:{type:"error",closable:!1},scopedSlots:t._u([{key:"title",fn:function(){return[e("div",{staticClass:"flex items-center justify-between w-full"},[o.sslInfo.isStart?t._e():[e("div",{staticClass:"mr-32x text-[1.2rem]"},[t._v(" 温馨提示：当前站点未开启SSL证书访问，站点访问可能存在风险。 ")]),e(s,{attrs:{size:"mini"},on:{click:o.applyBusSsl}},[t._v("申请证书")])],o.sslInfo.isSupportRenewal&&o.sslInfo.isStart?[e("div",{staticClass:"mr-32x text-[1.2rem] flex items-center"},[t._v(" 温馨提示：当前[ "),e("span",{staticClass:"flex max-w-[20rem] truncate",attrs:{title:o.sslInfo.dns.join("、")}},[t._v(" "+t._s(o.sslInfo.dns.join("、"))+" ")]),t._v(" ]证书"+t._s(o.sslInfo.endtime<0?"已过期":"即将过期")+" ")]),e(s,{attrs:{size:"mini"},on:{click:o.renewalCurrentCert}},[t._v(" 续签证书 ")])]:t._e(),e(l,{staticClass:"absolute top-1.2rem z-10 right-1.2rem",attrs:{icon:"demand",iconClass:"text-1.6rem",content:"需求反馈"},on:{click:o.openNps}})],2)]},proxy:!0}],null,!1,3777009194)})],1):t._e(),e(r,{staticClass:"w-full h-full",attrs:{type:"navtwo"},on:{change:o.handleClickTab},model:{value:o.sslTabsActive,callback:function(t){o.sslTabsActive=t},expression:"sslTabsActive"}},t._l(o.tabComponent,(function(s,a){return e(n,{key:a,staticClass:"h-0",attrs:{name:s.name,lazy:!0,label:s.title},scopedSlots:t._u([{key:"label",fn:function(){return[0===a?e("div",{domProps:{innerHTML:t._s(o.currentCertTitle)}}):"busSslList"===s.name?e("div",{staticClass:"z-9999"},[e("span",{staticClass:"recommend-icon"}),e("span",[t._v(" "+t._s(s.title)+" ")])]):e("div",[t._v(t._s(s.title))])]},proxy:!0}],null,!0)},[e(s.component,{tag:"component",attrs:{compData:t.compData}})],1)})),1),o.sslAlertState?t._e():e(l,{staticClass:"absolute top-1rem z-10 right-0",attrs:{icon:"demand",iconClass:"text-1.6rem",content:"需求反馈"},on:{click:o.openNps}})],1):e("div",{staticClass:"bg-[#7F7F7F] flex items-center justify-center h-full"},[e("div",{staticClass:"bg-white px-48x py-16x text-[#333]"},[t._v(" 请开启 "),e(a,{on:{click:o.jumpPath}},[t._v("外网映射")]),t._v(" 后查看配置信息 ")],1)])])}),[],!1,null,"f25b6654",null,null).exports;export{S as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./CurrentCertInfo.js?v=1714377894636","./index118.js?v=1714377894636","./vue-lib.js?v=1714377894636","./__commonjsHelpers__.js?v=1714377894636","./main.js?v=1714377894636","./modulepreload-polyfill.js?v=1714377894636","./preload-helper.js?v=1714377894636","./request-lib.js?v=1714377894636","./locales-lib.js?v=1714377894636","./public-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./index46.js?v=1714377894636","./element-lib.js?v=1714377894636","./index.vue_vue_type_style_index_0_lang.js?v=1714377894636","./site.popup.js?v=1714377894636","./index38.js?v=1714377894636","./index45.js?v=1714377894636","./element-ui.common.js?v=1714377894636","./date-util.js?v=1714377894636","./vdom.js?v=1714377894636","./index62.js?v=1714377894636","./cascader-panel.js?v=1714377894636","./check.js?v=1714377894636","./site.store.js?v=1714377894636","./soft.api.js?v=1714377894636","./BusSslList.js?v=1714377894636","./index39.js?v=1714377894636","./element-lib.js?v=1714377894636","./index129.js?v=1714377894636","./index59.js?v=1714377894636","./TrustAsiaList.js?v=1714377894636","./element-lib.js?v=1714377894636","./LetsEncryptList.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./CertFolderList.js?v=1714377894636","./radio-button.js?v=1714377894636","./index57.js?v=1714377894636","./element-lib.js?v=1714377894636"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
