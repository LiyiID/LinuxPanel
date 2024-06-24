import{q as e,s as t,x as a,o as l,w as s,_ as i}from"./element-lib.js?v=1714377894636";import{n as u,a as n,aj as o,g as r,a_ as c,k as m}from"./main.js?v=1714377894636";import{e as p,Q as d,b as v,c as f,h as _,S as y,L as h,l as g,v as x,j as b}from"./vue-lib.js?v=1714377894636";import{_ as j}from"./index40.js?v=1714377894636";import{_ as C}from"./index117.js?v=1714377894636";import{_ as R}from"./cascader.js?v=1714377894636";import{getConfigStore as w}from"./config.store.js?v=1714377894636";import{ab as k}from"./config.api.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./config.js?v=1714377894636";import"./radio-button.js?v=1714377894636";import"./cascader-panel.js?v=1714377894636";import"./index62.js?v=1714377894636";const T=u(p({__name:"attrSelect",props:{tid:null,value:null,data:null,cycles:null},emits:["update:value"],setup(e,{emit:t}){const a=e,{refs:{processConfig:l},getProcessConfig:s}=w(),{tid:i,data:u}=d(a),n=v(!1),o=v(!1);let r=f({get:()=>a.value,set(e){t("update:value",e)}});const c={lazy:!0,async lazyLoad(e,t){var a;const{level:l}=e;if(null==(a=null==u?void 0:u.value)?void 0:a.items[l].url){let a={};if(l>=1)for(let t=0;t<l;t++)a[u.value.items[l].data[t]]=t===l-1?e.value:e.parent.value;const{data:s}=await k(u.value.items[l].url,a);t(s.map((e=>({value:e.value,label:e.title,leaf:l===u.value.items.length-1?u.value.items.length:void 0}))))}}};return _((async()=>{if("select"===u.value.type&&"object"==typeof u.value.items&&"url"in u.value.items){n.value=!0;try{0===l.value.length?(o.value=!0,await s(u),o.value=!1,r.value=l.value[0].value):""===r.value&&(r.value=l.value[0].value)}catch(e){}}})),{__sfc:!0,processConfig:l,getProcessConfig:s,props:a,tid:i,data:u,loadSelect:n,loadShow:o,emit:t,valueRef:r,refresh:async()=>{o.value=!0,await s(u),o.value=!1},cascaderProps:c}}}),(function(){var a=this,l=a._self._c,s=a._self._setupProxy;return l("div",[a.cycles.includes(s.tid||"")&&"cycle"===s.data.attr?[l("div",{staticClass:"flex items-center"},[l(e,{attrs:{disabled:!0},model:{value:s.valueRef,callback:function(e){s.valueRef=e},expression:"valueRef"}},a._l(s.data.items,(function(e){return l(t,{key:e.value,attrs:{label:e.title+"分钟",value:e.value}})})),1),s.data.suffix?l("div",{staticClass:"ml-[1rem]",domProps:{innerHTML:a._s(s.data.suffix)}}):a._e()],1)]:"cascader"===s.data.type?[l(R,{attrs:{props:s.cascaderProps},model:{value:s.valueRef,callback:function(e){s.valueRef=e},expression:"valueRef"}})]:s.loadSelect?[l(e,{directives:[{name:"loading",rawName:"v-loading",value:s.loadShow,expression:"loadShow"}],staticClass:"w-[24.8rem]",attrs:{"element-loading-spinner":"el-icon-loading","element-loading-text":"正在加载，请稍后...",filterable:""},model:{value:s.valueRef,callback:function(e){s.valueRef=e},expression:"valueRef"}},a._l(s.processConfig,(function(e){return l(t,{key:e.value,attrs:{label:e.title,value:e.value}})})),1),l(n,{staticClass:"ml-[1rem]",on:{click:s.refresh}},[a._v("刷新"),l("i",{staticClass:"el-icon-refresh-right"})])]:[l(e,{staticClass:"w-[24.8rem]",model:{value:s.valueRef,callback:function(e){s.valueRef=e},expression:"valueRef"}},a._l(s.data.items,(function(e){return l(t,{key:e.value,attrs:{label:e.title,value:e.value}})})),1)]],2)}),[],!1,null,"d63baaba",null,null).exports;const D=u(p({model:{prop:"value",event:"change"},__name:"attr",props:{tid:{default:""},value:{default:""},data:null},emits:["update:value"],setup(e,{emit:t}){const a=e,{tid:l,data:s}=d(a),i=f({get:()=>a.value,set(e){t("update:value",e)}}),u={"site_push@5":["cycle","count"],"system_push@1":["cycle","count"],"system_push@2":["cycle","count"],"system_push@3":["cycle","count"]},n=f((()=>{const e=Object.entries(u);for(let t=0;t<e.length;t++){const[a,i]=e[t];if(a===l.value&&i.includes(s.value.attr))return"inline"}return""})),r={"system_push@0":["interval"],"system_push@1":["interval"],"system_push@2":["interval"],"system_push@3":["interval"]},{fields:c}=y("alarm-list-form"),m=f((()=>{const e=Object.entries(r);for(let t=0;t<e.length;t++){const[a,i]=e[t];if(a===l.value&&i.includes(s.value.attr))return!1}return!0}));return{__sfc:!0,props:a,tid:l,data:s,emit:t,valueRef:i,inlineMap:u,cycles:["system_push@1","system_push@2","system_push@3"],itemClass:n,showMap:r,validateNum:e=>{(!/^[0-9]*$/.test(String(e))||e<=0)&&(i.value=1)},setDefaultNum:()=>{""===i.value&&(i.value=1)},fields:c,onChangeSelect:e=>{if("site_push@9"===l.value&&"cycle"===s.value.attr&&o(e)){const t=c.value[1].all_items[e-1];c.value[1].items=t,c.value[1].value=""}},onInputRadio:e=>{if("system_push@0"===l.value)switch(e){case 1:c.value[2].unit="GB",c.value[2].name="占用超过";break;case 2:c.value[2].unit="%",c.value[2].name="占用率超过"}},show:m,AttrSelect:T}}}),(function(){var e=this,t=e._self._c,s=e._self._setupProxy;return s.show?t(a,{class:s.itemClass,attrs:{label:s.data.name}},["number"===s.data.type?[t(l,{staticClass:"w-[1.5rem]",attrs:{type:"number"},on:{input:s.validateNum,blur:s.setDefaultNum},model:{value:s.valueRef,callback:function(t){s.valueRef=e._n(t)},expression:"valueRef"}},[t("template",{slot:"append"},[e._v(e._s(s.data.unit))])],2),s.data.suffix?t("div",{staticClass:"ml-[1rem]",domProps:{innerHTML:e._s(s.data.suffix)}}):e._e()]:e._e(),"select"===s.data.type||"cascader"===s.data.type?[t(s.AttrSelect,{attrs:{data:s.data,tid:s.tid,value:s.valueRef,cycles:s.cycles},on:{"update:value":[function(e){s.valueRef=e},s.onChangeSelect]}})]:e._e(),"help"===s.data.type?[t("ul",{staticClass:"help-info-text c7",style:s.data.style},e._l(s.data.list,(function(a){return t("li",{key:a},[e._v(e._s(a))])})),0)]:e._e(),"radio"===s.data.type?[t(C,{attrs:{options:s.data.items},on:{input:s.onInputRadio},model:{value:s.valueRef,callback:function(e){s.valueRef=e},expression:"valueRef"}})]:e._e()],2):e._e()}),[],!1,null,"6f4b147f",null,null).exports;const P=u(p({__name:"index",props:{isEdit:{type:Boolean,default:!1},isDiy:{type:Boolean,default:!1},templateTid:{default:()=>[]},form:null},setup(e,{expose:t}){const a=e,l=v([]),s=["dingding","mail","sms","wx_account","feishu","weixin"],{form:i}=d(a),{refs:{template:u}}=r(),n=v(""),o=(e,t)=>(0===t&&(n.value=e.tid,x()),{label:e.title,value:e.tid}),m=f((()=>a.isDiy&&a.templateTid.length>0?u.value.filter((e=>a.templateTid.includes(e.tid))).map(o):u.value.map(o))),p=f((()=>{const e={};return u.value.forEach((t=>{e[t.tid]=t})),e})),_=f((()=>p.value[n.value])),y=v([]),x=()=>{g((()=>{_.value&&(l.value=s.filter((e=>{if(!_.value.module.includes(e))return e})),y.value=_.value.field.map((e=>{var t;let a=e.default;return"select"!==e.type||e.default||(a=(null==(t=e.items[0])?void 0:t.value)||""),{...e,value:a}})))}))},b=()=>y.value,j=()=>_.value,C=()=>{n.value=m.value[0].value,x()},R=e=>{n.value=e.tid,x(),g((()=>{y.value.map((t=>{c(e,t.attr)&&(t.value=e[t.attr])}))}))};return h("alarm-list-form",{fields:y}),t({reset:C,getFields:b,getCurrentTemplate:j,setForm:R}),{__sfc:!0,props:a,limitType:l,types:s,form:i,template:u,tid:n,mapFunction:o,taskOptions:m,templateMap:p,currentTemplate:_,fields:y,onChangeType:()=>{x()},generateFields:x,getFields:b,getCurrentTemplate:j,reset:C,setForm:R,FieldAttr:D}}}),(function(){var l=this,s=l._self._c,i=l._self._setupProxy;return s("div",{staticClass:"mb-24px"},[s(a,{attrs:{label:"任务类型"}},[s(e,{staticClass:"w-[248px]",on:{change:i.onChangeType},model:{value:i.tid,callback:function(e){i.tid=e},expression:"tid"}},l._l(i.taskOptions,(function(e){return s(t,{key:e.value,attrs:{label:e.label,value:e.value}})})),1),"site_push@8"===i.tid?s("span",{staticClass:"ml-10px text-12px text-[#666]"},[l._v(" * 当检测到新的版本时发送一次通知 ")]):l._e()],1),l._l(i.fields,(function(e){return s(i.FieldAttr,{key:i.tid+"_"+e.name+"_"+e.attr,attrs:{value:e.value,tid:i.tid,data:e},on:{"update:value":function(t){return l.$set(e,"value",t)}}})})),s(a,{attrs:{label:"告警方式"}},[s(j,{attrs:{"limit-type":i.limitType},model:{value:i.form.method,callback:function(e){l.$set(i.form,"method",e)},expression:"form.method"}})],1)],2)}),[],!1,null,null,null,null).exports;const S=u(p({__name:"index",props:{compData:null},setup(e,{expose:t}){const a=e,{refs:{pushConfigInfo:l}}=r(),{compData:s}=d(a),{proxy:i}=b(),u=x({method:["wx_account"]}),n=v(),o=()=>{const e=n.value.getCurrentTemplate(),{isEdit:t,row:a}=s.value;return{id:t?a.time:Date.now(),name:e.name,data:c()}},c=()=>{const e={},t=n.value.getCurrentTemplate();e.tid=t.tid,e.type=t.type,e.title=t.title,e.status=!0,e.count=0,e.interval=600,e.project="";return n.value.getFields().forEach((t=>{e[t.attr]=t.value})),e.module=u.method.join(","),JSON.stringify(e)},p=()=>{n.value.reset(),u.method=["wx_account"]},f=()=>{const{isEdit:e,row:t}=s.value;if(e){const e=[];t.module.split(",").forEach((t=>{const a=l.value.find((e=>e.name===t));(null==a?void 0:a.setup)&&e.push(t)})),u.method=e,g((()=>{n.value.setForm(t)}))}},_=async e=>{var t;const a=i.$load("正在编辑告警任务，请稍候...");try{const a=o(),{data:l}=await m(a);i.$message.request(l),l.status&&(s.value.getList&&(null==(t=s.value)||t.getList()),null==e||e())}finally{a.close()}};return f(),t({onConfirm:_}),{__sfc:!0,props:a,pushConfigInfo:l,compData:s,vm:i,form:u,fieldRef:n,getParams:o,getData:c,reset:p,onAdd:async()=>{var e;const t=i.$load("正在添加告警任务，请稍候...");try{const t=o(),{data:a}=await m(t);i.$message.request(a),a.status&&(p(),s.value.getList?(null==(e=s.value)||e.getList(),i.$emit("close")):i.$emit("close"))}finally{t.close()}},init:f,onConfirm:_,AlarmField:P}}}),(function(){var e=this,t=e._self._c,l=e._self._setupProxy;return t("div",{staticClass:"px-45px py-16px"},[t(s,[t(l.AlarmField,{ref:"fieldRef",attrs:{"is-edit":l.compData.isEdit,"is-diy":l.compData.diyProcessTemplate||!1,"template-tid":l.compData.diyProcessTemplateTid||[],form:l.form},on:{"update:form":function(e){l.form=e}}}),l.compData.isEdit?e._e():t(a,{attrs:{label:" "}},[t(i,{attrs:{type:"primary"},on:{click:l.onAdd}},[e._v("添加任务")])],1)],1)],1)}),[],!1,null,null,null,null).exports;export{S as default};
