System.register(["./main-legacy.js?v=1714377894636","./index-legacy77.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./site.store-legacy.js?v=1714377894636","./modulepreload-polyfill-legacy.js?v=1714377894636","./preload-helper-legacy.js?v=1714377894636","./request-lib-legacy.js?v=1714377894636","./__commonjsHelpers__-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./public-lib-legacy.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./tabs-legacy.js?v=1714377894636","./index-legacy42.js?v=1714377894636","./check-legacy.js?v=1714377894636"],(function(e,t){"use strict";var l,a,n,s,i,c,u,r,o,f,p;return{setters:[function(e){l=e.n,a=e.R,n=e.a,s=e.q},function(e){i=e._},function(e){c=e.e,u=e.b,r=e.f,o=e.h,f=e.j},function(e){p=e.g},null,null,null,null,null,null,null,null,null,null],execute:function(){e("default",l(c({__name:"OtherTemplate",props:{compData:{default:function(){}}},setup:function(e){var t=e,l=p().refs.templateId,a=f().proxy,n=u(""),s=u(),i=u(t.compData.list),c=u(!1);return r((function(){return l.value}),(function(){}),{immediate:!0}),o((function(){c.value=!0,s.value=t.compData.dep_type.map((function(e){return{title:e.title,type:String(e.tid)}})),s.value.unshift({title:"全部",type:"all"}),s.value.unshift({title:"精选推荐",type:""}),n.value=String(s.value[0].type),i.value=t.compData.list.filter((function(e){return 0===e.is_many})),c.value=!1})),{__sfc:!0,props:t,templateId:l,vm:a,defaultActive:n,tabComponent:s,contentList:i,loading:c,handleTabClick:function(e){"all"===e.name?i.value=t.compData.list:""===e.name?i.value=t.compData.list.filter((function(e){return 0===e.is_many})):i.value=t.compData.list.filter((function(t){return String(t.type)===e.name}))},selectTemplate:function(e){l.value=e.id,a.$emit("close")}}}}),(function(){var e=this,t=e._self._c,l=e._self._setupProxy;return t("div",{directives:[{name:"loading",rawName:"v-loading",value:l.loading,expression:"loading"}],staticClass:"flex h-[46rem]"},[t("div",[t(i,{staticClass:"w-full !h-full",attrs:{type:"left",config:l.tabComponent},on:{"tab-click":l.handleTabClick},model:{value:l.defaultActive,callback:function(e){l.defaultActive=e},expression:"defaultActive"}})],1),t("div",{staticClass:"p-20x pl-0 grid grid-cols-2 gap-x-4 w-full h-[46rem] overflow-auto"},e._l(l.contentList,(function(i,c){return t("div",{key:i.id,staticClass:"mb-8x flex p-20x rounded-4x h-[18rem] template-hover",class:{"template-focus":l.templateId===i.id}},[t(a,{staticClass:"!h-[3.6rem] !w-[4rem] mr-8x",attrs:{src:"/static/vite/images/site_dep_ico/".concat(i.name,".png")}}),t("div",{staticClass:"flex flex-col items-start leading-10 w-full"},[t("span",{staticClass:"text-[1.6rem] mb-4x"},[e._v(e._s(i.title))]),t("span",{staticClass:"truncate inline-block w-[80%]"},[e._v(" 简介："),t("span",{domProps:{innerHTML:e._s(i.ps)}})]),t("span",{staticClass:"truncate inline-block w-[80%]"},[e._v(" 版本："+e._s(i.version)+" ")]),t("span",{staticClass:"truncate inline-block w-[80%]"},[e._v(" 评分："+e._s(i.score)+" ")]),t("div",{staticClass:"flex items-center"},[t("span",{staticClass:"truncate inline-block"},[e._v(" 官网："),t(n,{staticClass:"!truncate w-[12rem]",attrs:{href:i.official}},[e._v(e._s(i.official))])],1),t(s,{staticClass:"!ml-12x",attrs:{size:"mini"},on:{click:function(e){return l.selectTemplate(i)}}},[e._v("选择模板")])],1)])],1)})),0)])}),[],!1,null,"ba21d695",null,null).exports)}}}));
