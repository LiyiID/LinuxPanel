System.register(["./vue-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./echarts-legacy.js?v=1714377894636"],(function(e,t){"use strict";var n,i,c,s,r,u,o,l,a,f,d,v,h,p,m,_,y,g,x,z,j,w,E,O,b,q;return{setters:[function(e){n=e.N,i=e.e,c=e.h,s=e.l,r=e.i},function(e){u=e.Z,o=e.n},function(e){l=e.u,a=e.i,f=e.a,d=e.b,v=e.c,h=e.d,p=e.e,m=e.f,_=e.g,y=e.h,g=e.j,x=e.k,z=e.l,j=e.m,w=e.n,E=e.o,O=e.p,b=e.q,q=e.r}],execute:function(){e("c",(function(e){return n(e)})),l([a,f,d,v,h,p,m,_,y,g,x,z,j,w,E,O]),e("_",o(i({__name:"index",emits:["accept-echarts-id"],setup:function(e,t){var n=t.expose,i=t.emit,o=u("chart"),l=null,a=function(){var e=document.querySelector("#".concat(o));null==(l=b(e))&&(l=q(e))},f=function(e){var t;null===(t=l)||void 0===t||t.setOption(e)},d=function(){var e;null===(e=l)||void 0===e||e.resize()};return c((function(){a(),i("accept-echarts-id",o),s((function(){window.addEventListener("resize",d)}))})),r((function(){window.removeEventListener("resize",d)})),n({setOption:f,resize:d,id:o}),{__sfc:!0,emits:i,id:o,chart:l,initEcharts:a,setOption:f,resize:d}}}),(function(){return(0,this._self._c)("div",{staticClass:"h-full",attrs:{id:this._self._setupProxy.id}})}),[],!1,null,null,null,null).exports)}}}));