System.register(["./element-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636"],(function(e,t){"use strict";var u,l,n,s,a,i;return{setters:[function(e){u=e.j,l=e.o},function(e){n=e.n},function(e){s=e.e,a=e.b,i=e.f}],execute:function(){e("_",n(s({__name:"index",props:{placeholderTips:{default:""},offset:{default:0},value:{default:""},customClass:{default:"!w-[20rem]"}},emits:["input"],setup:function(e,t){var u=t.emit,l=e,n=a(!1),s=a(!0),o=a(l.value);return i((function(){return o.value}),(function(e){u("input",e)})),i((function(){return l.value}),(function(e){o.value=e})),{__sfc:!0,props:l,emit:u,isShow:n,isDisabled:s,inputValue:o,inputFocus:function(){""===o.value&&(s.value=!1,n.value=!0)},inputBlur:function(){n.value=!1,s.value=!0}}}}),(function(){var e=this,t=e._self._c,n=e._self._setupProxy;return t("div",{staticClass:"relative"},[t(u,{staticClass:"item",attrs:{effect:"dark",trigger:"manual",content:e.placeholderTips,offset:e.offset,placement:"top-start"},model:{value:n.isShow,callback:function(e){n.isShow=e},expression:"isShow"}},[t("span",{staticClass:"w-[10rem] absolute"})]),t(l,e._g(e._b({ref:"input",class:e.customClass,attrs:{placeholder:e.placeholderTips},on:{focus:n.inputFocus,blur:n.inputBlur},model:{value:n.inputValue,callback:function(e){n.inputValue=e},expression:"inputValue"}},"el-input",e.$attrs,!1),e.$listeners))],1)}),[],!1,null,"1e19fd37",null,null).exports)}}}));
