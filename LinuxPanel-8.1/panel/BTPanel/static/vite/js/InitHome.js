import{f as s,dE as e,dF as t,dG as i,n as a,a as l,q as r}from"./main.js?v=1714377894636";import{_ as o}from"./index46.js?v=1714377894636";import{e as n,b as v,h as c,j as m}from"./vue-lib.js?v=1714377894636";import{getFirewallStore as d}from"./firewall.store.js?v=1714377894636";import{s as p}from"./firewall.table.js?v=1714377894636";import{x as u}from"./firewall.popup.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./element-lib.js?v=1714377894636";import"./index.vue_vue_type_style_index_0_lang.js?v=1714377894636";import"./check.js?v=1714377894636";import"./index38.js?v=1714377894636";import"./index45.js?v=1714377894636";const h=a(n({__name:"InitHome",setup(a,{expose:l}){const{refs:{phpChildrenTabActive:r}}=d(),{proxy:o}=m(),n=v(!1),h=v(!1),_=v(!1),w=v(!1),f=v([]),g=v(!1),C=async()=>{try{const s=await e();n.value=s.data.status,_.value=s.data.send,w.value=s.data.php_status,_.value&&w.value?g.value=!1:g.value=!0}catch(s){}},x=async()=>{try{h.value=!0;const s=await t();s.status&&(f.value=s.data.logs,p.forEach((e=>{e.value=s.data[e.name]})))}catch(s){}finally{h.value=!1}},S=()=>{C(),x()};return c((()=>{S()})),l({init:S}),{__sfc:!0,phpChildrenTabActive:r,vm:o,isPhpSiteStatus:n,loading:h,sendSwitch:_,phpSwitch:w,dataList:f,switchDisable:g,getStatus:C,test:()=>{},getNoticeList:x,changeStatus:async s=>{let e=null;try{if(!_.value||!w.value)return n.value=!1,void o.$message.error("请先开启PHP模块设置");e=o.$load("正在"+(s?"开启":"关闭")+"监控，请稍后...");const t=await i({status:s?"start":"stop"});e.close(),o.$message.request(t),t.status?n.value=!n.value:n.value=n.value,C()}catch(t){}finally{e&&e.close()}},goPhpModules:()=>{r.value="phpList"},init:S,riskLevelsOverview:p,formatTime:s,phpSiteAttackDialog:u}}}),(function(){var s=this,e=s._self._c,t=s._self._setupProxy;return e("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"sn-home py-20x"},[e("div",{staticClass:"sn-home-switch"},[e("div",{staticClass:"flex"},[e("div",{staticClass:"mr-4"},[s._v("监控开关")]),e(o,{attrs:{width:36,disabled:t.switchDisable},on:{change:t.changeStatus},model:{value:t.isPhpSiteStatus,callback:function(s){t.isPhpSiteStatus=s},expression:"isPhpSiteStatus"}})],1),t.switchDisable?e("div",{staticClass:"sn-home-note"},[e("i",{staticClass:"el-icon-warning-outline text-[1.6rem]"}),s._v(" 无法使用PHP安全告警，请开启 "),t.phpSwitch?s._e():e(l,{staticClass:"underline",attrs:{title:"点击跳转PHP模块页面",type:"danger"},on:{click:t.goPhpModules}},[s._v(" PHP模块 ")]),t.phpSwitch||t.sendSwitch?s._e():e("span",[s._v("、")]),t.sendSwitch?s._e():e(l,{staticClass:"underline",attrs:{title:"点击跳转告警设置页面",type:"danger"}},[s._v(" 设置告警 ")])],1):s._e(),t.sendSwitch&&t.phpSwitch?e(r,{on:{click:function(s){return t.phpSiteAttackDialog(t.init)}}},[s._v("模拟攻击")]):s._e()],1),e("div",{staticClass:"sn-home-overview",class:t.riskLevelsOverview[0].value?"sn-home-overview-red":t.riskLevelsOverview[1].value?"sn-home-overview-yellow":"sn-home-overview-green"},[e("div",{staticClass:"text-[#666] text-[1.4rem]"},[s._v("风险等级概览")]),e("div",{staticClass:"mt-[2rem]"},s._l(t.riskLevelsOverview,(function(t,i){return e("div",{key:i,staticClass:"sn-home-overview-item",class:i<3?"line-border":""},[e("div",{staticClass:"sn-home-overview-item-title"},[s._v(s._s(t.title))]),e("div",{staticClass:"sn-home-overview-item-num",class:t.class},[s._v(s._s(t.value))])])})),0)]),e("div",{staticClass:"sn-home-list"},s._l(t.dataList,(function(i,a){return e("div",{key:a,staticClass:"sn-home-list-item"},[e("div",[e("span",{staticClass:"sn-home-list-item-type",class:1===i.risk?"green":2===i.risk?"org":"red"},[e("i",{staticClass:"el-icon-warning-outline text-[1.6rem]"}),e("span",{staticClass:"ml-[0.4rem]"},[s._v(s._s(i.intercept))])])]),e("div",[s._v("攻击者IP："+s._s(i.address))]),e("div",[s._v("网站："+s._s(i.domain))]),e("div",[s._v("路径："+s._s(i.url))]),e("div",{staticClass:"text-right"},[s._v("触发时间："+s._s(t.formatTime(i.addtime)))])])})),0),e("div",{staticClass:"text-[#C1C1C1] mt-[1rem]"},[s._v("以上仅提供最新的前100条风险数据")])])}),[],!1,null,"a92fd3bf",null,null).exports;export{h as default};
