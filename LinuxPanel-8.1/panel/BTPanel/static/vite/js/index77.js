import{t,u as e}from"./element-lib.js?v=1714377894636";import{n as o}from"./main.js?v=1714377894636";import{_ as s}from"./index42.js?v=1714377894636";import{e as n,b as a,c as l,t as i,j as r}from"./vue-lib.js?v=1714377894636";const c=o(n({__name:"index",props:{type:{default:"left"},config:{default:()=>[]},compData:null,component:null,ADShow:{type:Boolean,default:!0}},setup(t){const e=t,{proxy:o}=r(),s=a(),n=l((()=>"left"===e.type?"left":"top")),c=!!i().suffix;return{__sfc:!0,props:e,vm:o,compRef:s,position:n,handleClick:async t=>{const e=t.$children[0];o.$emit("change",t.name);try{if(e._isMounted){const o=document.querySelector("#pane-".concat(t.name," .el-tabs__item.is-active"));o?o.click():e.$options.mounted[1]()}}catch(s){}},slotSuffix:c}}}),(function(){var o=this,n=o._self._c,a=o._self._setupProxy;return n("div",{staticClass:"relative",staticStyle:{height:"inherit"}},["nav"===o.type&&!a.slotSuffix&&a.props.ADShow?n(s,{staticClass:"absolute right-[1.2rem] top-[1.5rem] z-999"}):o._e(),"nav"===o.type&&a.slotSuffix?o._t("suffix"):o._e(),n(t,o._g(o._b({staticClass:"bt-tabs",class:"bt-tabs-".concat(o.type),attrs:{type:"border-card","tab-position":a.position},on:{"tab-click":a.handleClick}},"el-tabs",o.$attrs,!1),o.$listeners),[o._t("default"),0!==o.config.length?o._l(o.config,(function(t,s){return n(e,{key:s,attrs:{label:t.title,name:t.type,lazy:!0},scopedSlots:o._u([t.customLabel?{key:"label",fn:function(){return[n("div",{domProps:{innerHTML:o._s(t.title)}})]},proxy:!0}:null],null,!0)},[n(t.component,{ref:"compRef",refInFor:!0,tag:"component",attrs:{"comp-data":t.compData}})],1)})):o._e()],2)],2)}),[],!1,null,null,null,null).exports;export{c as _};