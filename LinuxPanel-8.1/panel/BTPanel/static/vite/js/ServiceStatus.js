import{e as t,b as s,f as a,j as e}from"./vue-lib.js?v=1714377894636";import{n as u}from"./main.js?v=1714377894636";const n=u(t({__name:"ServiceStatus",props:{status:{type:[Boolean,String],default:!1},statusData:null},setup(t){const u=t,{proxy:n}=e(),o=s(["开启","停止"]);return a((()=>u.statusData),(()=>{u.statusData&&(o.value=u.statusData)}),{immediate:!0}),{__sfc:!0,vm:n,props:u,statusData:o}}}),(function(){var t=this,s=t._self._c,a=t._self._setupProxy;return s("div",{staticClass:"flex items-center"},[s("span",[t._v(t._s(t.status?a.statusData[0]:a.statusData[1]))]),s("span",{class:"icon-"+(t.status?"start":"stop")+" iconfont"})])}),[],!1,null,"b55e4f21",null,null).exports;export{n as _};
