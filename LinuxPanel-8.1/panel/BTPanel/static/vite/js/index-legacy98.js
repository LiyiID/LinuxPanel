System.register(["./main-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636"],(function(e,t){"use strict";var r,c,s;return{setters:[function(e){r=e.n,c=e.a},function(e){s=e.e}],execute:function(){e("_",r(s({__name:"index",props:{limit:{default:10},p:{default:1},num:{default:10}},emits:["click"],setup:function(e){return{__sfc:!0}}}),(function(){var e=this,t=e._self._c;return e._self._setupProxy,t("div",{staticClass:"flex items-center h-[2.8rem]"},[e.p>1?t(c,{staticClass:"border-solid border-1 border-[#ececec] p-[1rem] h-[2.8rem]",attrs:{type:"default"},on:{click:function(t){return e.$emit("click",1,t)}}},[e._v(" "+e._s(e.$t("page.homePage"))+" ")]):e._e(),e.p>1?t(c,{staticClass:"border-solid border-1 border-[#ececec] p-[1rem] h-[2.8rem]",attrs:{type:"default"},on:{click:function(t){return e.$emit("click",e.p-1,t)}}},[e._v(" "+e._s(e.$t("page.prevPage"))+" ")]):e._e(),e.num>=e.limit?t(c,{staticClass:"border-solid border-1 border-[#ececec] p-[1rem] h-[2.8rem]",attrs:{type:"default"},on:{click:function(t){return e.$emit("click",e.p+1,t)}}},[e._v(" "+e._s(e.$t("page.nextPage"))+" ")]):e._e(),t("span",{staticClass:"border-solid border-1 border-[#ececec] leading-2 p-[1rem] h-[2.8rem]"},[e._v("第 "+e._s(e.p)+" 页")])],1)}),[],!1,null,"04c5d4b8",null,null).exports)}}}));
