import{_ as e}from"./index47.js?v=1714377894636";import{e as t,b as s,h as a,I as l,j as i}from"./vue-lib.js?v=1714377894636";import{C as o,j as r,n as u}from"./main.js?v=1714377894636";import{g as m}from"./site.store.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./index42.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./element-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./check.js?v=1714377894636";const n=u(t({__name:"index",setup(e){var t,u;const{proxy:n}=i(),{refs:{modulesTableParams:p,siteTabActive:v,siteInfo:c}}=m(),d=s("/site-php"),b=s(null),j=s(null!=(u=null==(t=o[1])?void 0:t.children)?u:[]);return a((()=>{var e;d.value=null==(e=n.$route)?void 0:e.name;let t=localStorage.getItem("siteTabActive");t&&""!==t&&(j.value.some((e=>e.path===t&&!1!==(null==e?void 0:e.isReleaseDis)))||(t="php"),t!==d.value&&r("/site/"+t),d.value=t,v.value=t,c.value.project_type="node"===t?"nodejs":null==t?void 0:t.replace("-",""))})),l((()=>{clearTimeout(b.value)})),{__sfc:!0,vm:n,modulesTableParams:p,siteTabActive:v,siteInfo:c,tabAvtive:d,checkTimer:b,tabList:j,cutTabs:e=>{d.value=e,v.value=e,localStorage.setItem("siteTabActive",e),r("/site/"+e),c.value.project_type="node"===e?"nodejs":null==e?void 0:e.replace("-",""),p.value.type_id="",p.value.search=""}}}}),(function(){var t=this._self._c,s=this._self._setupProxy;return t("div",{staticClass:"flex flex-col"},[t(e,{attrs:{tab:s.tabList,tabActive:s.tabAvtive,"is-set-show":!0},on:{cutTab:s.cutTabs}}),t("div",{staticClass:"bg-white p-16x mt-16x relative"},[t("transition",{attrs:{name:"fade",mode:"out-in"}},[t("router-view")],1)],1)],1)}),[],!1,null,"f6a65cd8",null,null).exports;export{n as default};