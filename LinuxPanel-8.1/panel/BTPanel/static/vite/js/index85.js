import{ai as e,n as t,q as l}from"./main.js?v=1714377894636";import{o as n}from"./element-lib.js?v=1714377894636";import{e as s,b as i,f as a,h as r}from"./vue-lib.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";const u=t(s({__name:"index",props:{value:{default:""},width:{default:"24rem"},iconType:{type:[String,Boolean],default:!1},iconTitle:null,isNull:{type:Boolean,default:!1},textType:{type:[String,Boolean],default:!1},remarks:{type:[String,Boolean],default:!1},prependText:{default:""}},emits:["folder","refresh","search","submit","input"],setup(t,{emit:l}){const n=t,s=i(n.value),u=i();a((()=>n.value),(()=>{s.value=n.value})),a((()=>s.value),(e=>{l("input",e)}));return r((()=>{"refresh"!==n.iconType||n.value||n.isNull||(s.value=e())})),{__sfc:!0,props:n,emit:l,inputValue:s,inputRef:u,iconClick:t=>{if(n.iconType)switch(n.iconType){case"folder":l("folder",s.value,u,t);break;case"refresh":s.value=e(),l("refresh",s.value,t);break;case"search":l("submit",s.value,t)}},onKeyup:e=>{l("submit",s.value,e)}}}}),(function(){var e=this,t=e._self._c,s=e._self._setupProxy;return t("div",{staticClass:"flex flex-row items-center bt-input-custom"},[t(n,e._g(e._b({ref:"inputRef",style:"width:"+s.props.width,nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:s.onKeyup.apply(null,arguments)}},scopedSlots:e._u([e.textType||e.iconType?{key:"append",fn:function(){return[e.iconType?t(l,{staticClass:"!flex",attrs:{icon:"el-icon-"+e.iconType,title:e.iconTitle},on:{click:s.iconClick}}):e._e(),e.textType?t("span",[e._v(e._s(e.textType))]):e._e()]},proxy:!0}:null,e.prependText?{key:"prepend",fn:function(){return[t("span",[e._v(e._s(e.prependText))])]},proxy:!0}:null],null,!0),model:{value:s.inputValue,callback:function(e){s.inputValue=e},expression:"inputValue"}},"el-input",e.$attrs,!1),e.$listeners)),e.remarks?[t("span",{staticClass:"text-[1.2rem] ml-[1rem]",domProps:{innerHTML:e._s(e.remarks)}})]:e._e()],2)}),[],!1,null,null,null,null).exports;export{u as _};