import{_ as t}from"./index47.js?v=1714377894636";import{e,b as s,h as i,j as a}from"./vue-lib.js?v=1714377894636";import{g as l,j as o,C as r,n}from"./main.js?v=1714377894636";import{g as c}from"./docker.store.js?v=1714377894636";import{c as u}from"./check.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./index42.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./element-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./docker.api.js?v=1714377894636";const d=n(e({__name:"index",setup(t){var e,n;const{proxy:d}=a(),m=s(!0),{refs:{mainWidth:g}}=l(),{refs:{tabActive:v,settingData:p},getQuickList:b,getCList:f,getIList:k,getTList:j,getMList:L,getNList:_,getSList:h,getStash:S,getSet:x,getDockerState:y,getAppList:A}=c(),T=s(null==(n=null==(e=u(r,"array",[]))?void 0:e.find((t=>"docker"===t.name)))?void 0:n.children),w=async()=>{var t,e,s,i;if(await y(),(null==(t=p.value)?void 0:t.docker_installed)&&(null==(e=p.value)?void 0:e.service_status)&&(null==(s=p.value)?void 0:s.docker_compose_installed))return!0;-1!=d.$route.fullPath.indexOf("docker")&&(p.value.service_status||d.$message.error("请先启动Docker服务"),"setting"!==(null==(i=d.$route)?void 0:i.name)&&(v.value="setting",o("/docker/setting")))},D=()=>{const t=g.value;m.value=t>=1280};return i((async()=>{var t;v.value=null==(t=d.$route)?void 0:t.name,d.$dockerSocket=null;let e=localStorage.getItem("dockerTabActive");e&&""!==e&&(T.value.some((t=>t.path===e&&!1!==(null==t?void 0:t.isReleaseDis)))||(e="deployment"),e!==v.value&&o("/docker/"+e),v.value=e),w(),D()})),{__sfc:!0,vm:d,adShow:m,mainWidth:g,tabActive:v,settingData:p,getQuickList:b,getCList:f,getIList:k,getTList:j,getMList:L,getNList:_,getSList:h,getStash:S,getSet:x,getDockerState:y,getAppList:A,tabList:T,judgeStatus:w,widthResize:D,tabToggle:async t=>{await w()&&(v.value=t,localStorage.setItem("dockerTabActive",t),o("/docker/"+t),D())}}}}),(function(){var e=this._self._c,s=this._self._setupProxy;return e("div",{staticClass:"flex flex-col"},[e(t,{attrs:{tab:s.tabList,tabActive:s.tabActive},on:{cutTab:s.tabToggle}}),e("div",{staticClass:"bg-white p-20x mt-16x relative"},[e("transition",{attrs:{name:"fade",mode:"out-in"}},[e("router-view")],1)],1)],1)}),[],!1,null,null,null,null).exports;export{d as default};