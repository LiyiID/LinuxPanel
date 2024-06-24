import{_ as t}from"./index77.js?v=1714377894636";import{_ as e}from"./preload-helper.js?v=1714377894636";import{e as a,b as s,h as o,z as i,A as l,v as n,M as r,f as c,l as d,c as p,j as u}from"./vue-lib.js?v=1714377894636";import{_ as m}from"./index91.js?v=1714377894636";import{n as y,I as h,q as v,l as f,a as g,c as b,aj as x,f as w}from"./main.js?v=1714377894636";import{aa as k,q as _,s as D,p as C,j as T,P as S,v as I,A}from"./element-lib.js?v=1714377894636";import{_ as V}from"./date-picker.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import{_ as P}from"./index85.js?v=1714377894636";import{_ as O}from"./index46.js?v=1714377894636";const z=y(a({__name:"PercentageData",props:{unitVisible:{type:Boolean,default:!1}},setup(t,{expose:e}){const a=t,i=s(),l=t=>{var e;i.value&&(null==(e=i.value)||e.setOption(t))},n=()=>{var t;i.value&&"function"==typeof i.value.resize&&(null==(t=i.value)||t.resize())};return o((()=>{var t;null==(t=i.value)||t.resize()})),e({setConfig:l,echartResize:n}),{__sfc:!0,props:a,echartRef:i,setConfig:l,echartResize:n}}}),(function(){var t=this,e=t._self._c,a=t._self._setupProxy;return e("div",{staticClass:"percentage w-full",staticStyle:{position:"relative"}},[e(m,t._g({ref:"echartRef"},t.$listeners)),a.props.unitVisible?e("div",{staticClass:"show"},[t._v(" 单位： "),t._m(0)]):t._e()],1)}),[function(){var t=this,e=t._self._c;return t._self._setupProxy,e("div",{staticClass:"bt-crontab-select-button"},[e("div",{staticClass:"bt-select-full only-one disk-unit"},[e("div",{staticClass:"select-picker-search"},[e("span",{staticClass:"picker-text-list"},[t._v("KB/s")]),e("span",{staticClass:"down-select-full"})]),e("div",{staticClass:"select-list-item",staticStyle:{display:"none"}},[e("ul",{staticClass:"active",staticStyle:{width:"auto","max-height":"auto"}},[e("li",{staticClass:"active",attrs:{"data-attr":"KB/s"}},[e("span",{staticClass:"select-name-full active"},[t._v("KB/s")])]),e("li",{attrs:{"data-attr":"MB/s"}},[e("span",{staticClass:"select-name-full"},[t._v("MB/s")])]),e("li",{staticStyle:{display:"none"},attrs:{"data-attr":"GB/s"}},[e("span",{staticClass:"select-name-full"},[t._v("GB/s")])])])])])])}],!1,null,"223518fa",null,null).exports,L=t=>h.post("config/SetControl",{data:t,check:"msg"}),M=t=>h.post("daily/get_daily_data",{data:t}),N=()=>h.post("daily/get_daily_list"),j=t=>h.post("monitor/soft/sever_admin",{data:t,customType:"model"}),B=t=>h.post("monitor/soft/get_status",{data:t,customType:"model"}),F=i("CONTROL-STORE",{state:()=>({diskUnitType:"KB/s",networkUnitType:"KB/s",networkIoKey:"",networkParams:{loading:!1,list:[]},days:7}),actions:{async getNetWorkIoByDay(t){try{this.networkParams.loading=!0;const{data:e}=await(t=>h.post("ajax/GetNetWorkIoByDay",{data:t}))({day:t});this.networkParams.list=e}catch(e){}finally{this.networkParams.loading=!1}}}}),R=()=>{const t=F();return{refs:l(t),...t}};const E=y(a({__name:"ControlDay",emits:["cut-day","cut-day-click"],setup(t,{emit:e}){const{refs:{days:a}}=R(),o=s(""),i=s(1),l=s(),r=s([{content:"昨天",active:!1,event:()=>{i.value=0,e("cut-day",1)}},{content:"今天",active:!0,event:t=>{i.value=1,e("cut-day",0)}},{content:"最近七天",active:!1,event:t=>{i.value=2,o.value="最近七天",e("cut-day",7)}},{content:"自定义时间",active:!1,event:()=>{i.value=3,l.value.focus(),p()}}]),c=s(""),d=n({disabledDate:t=>{const e=new Date;e.setHours(23,59,59,999);const s=e.getTime(),o=new Date(e.getTime()-24*a.value*3600*1e3);return t.getTime()<o.getTime()||t.getTime()>s}}),p=()=>{e("cut-day-click")};return{__sfc:!0,days:a,emits:e,status:o,btnActive:i,player:l,btnGroup:r,customTime:c,pickerOptions:d,cutDayClick:p,selectTime:t=>{o.value="自定义时间",e("cut-day",t)}}}}),(function(){var t=this,e=t._self._c,a=t._self._setupProxy;return e("div",{staticClass:"time flex"},[e(k,{staticClass:"control-btn"},t._l(a.btnGroup,(function(s,o){return e(v,{attrs:{type:a.btnActive===o?"primary":""},on:{click:s.event}},[t._v(" "+t._s(s.content)+" ")])})),1),e(V,{ref:"player",staticClass:"!absolute right-0 top-0 opacity-0 !w-0 !h-0",attrs:{align:"right",type:"daterange","range-separator":"","start-placeholder":"开始日期","end-placeholder":"结束日期","default-time":["00:00:00","23:59:59"],"picker-options":a.pickerOptions},on:{change:a.selectTime},model:{value:a.customTime,callback:function(t){a.customTime=t},expression:"customTime"}})],1)}),[],!1,null,"5bed03ff",null,null).exports;const G=y(a({__name:"ControlTitle",props:{title:null,active:{type:Boolean},selectList:null},emits:["cut-select","cut-click"],setup(t,{emit:e}){const a=t,{refs:{networkIoKey:o}}=R(),i=s(o.value);return{__sfc:!0,networkIoKey:o,props:a,emits:e,selectVal:i,onselectionchange:()=>{e("cut-select",i.value)},onCLick:()=>{e("cut-click")}}}}),(function(){var t=this,e=t._self._c,a=t._self._setupProxy;return e("div",[e("span",[t._v(t._s(t.title))]),e(_,{directives:[{name:"show",rawName:"v-show",value:t.active,expression:"active"}],staticClass:"2xl:w-[10rem] <2xl:w-[6rem] <lg:w-[10rem]",attrs:{size:"mini",placeholder:t.$t("HomeMonitor.Placeholder")},on:{change:a.onselectionchange},nativeOn:{click:function(t){return a.onCLick.apply(null,arguments)}},model:{value:a.selectVal,callback:function(t){a.selectVal=t},expression:"selectVal"}},t._l(a.props.selectList,(function(t){return e(D,{key:t.value,attrs:{label:t.label,value:t.value}})})),1)],1)}),[],!1,null,"a4691115",null,null).exports,q=()=>f({isAsync:!0,title:"网络IO总流量统计",area:[70,50],component:()=>e((()=>import("./NetworkDayDialog.js?v=1714377894636")),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]),import.meta.url)});const U=y(a({__name:"ControlData",props:{title:{default:"默认"},active:{type:Boolean,default:!1},compData:{default:()=>{}},controlValue:{type:Boolean,default:!1},type:{default:""}},emits:["cut-day","accept-echarts-id","cut-select","refresh","update:controlValue"],setup(t,{emit:e}){const a=t,i=r(),l=s(),n=s(),u=s(!1),m=s("34rem"),y=()=>{let t=34;if(u.value){t=(window.screen.height-60)/10}return"".concat(t,"rem")};c(u,(t=>{t?m.value=y():(m.value="34rem",d((()=>{n.value.echartResize()})))}));const h=()=>{let t=!!document.fullscreenElement;return null==t&&(t=!1),t},v=p((()=>Object.keys(a.compData).includes("series")&&void 0===a.compData.series[0].data));return c((()=>a.compData),(()=>{try{n.value.setConfig(a.compData),n.value.echartResize()}catch(t){}})),o((()=>{try{d((()=>{n.value.setConfig(a.compData)})),window.addEventListener("fullscreenchange",(()=>{var t;h()||(u.value=!1,document.fullscreenElement&&(null==(t=document.exitFullscreen())||t.catch(console.error)))}))}catch(t){}})),{__sfc:!0,attrs:i,emits:e,chartModulesRef:l,dataRef:n,props:a,isFullScreen:u,fullHeight:m,setFullHeight:y,updateEvent:()=>{e("update:controlValue",!0)},refresh:()=>{e("refresh",a.type)},setFullScreen:()=>{u.value=!0,d((()=>{var t,e;(null==(t=l.value.$el)?void 0:t.requestFullscreen)&&(null==(e=l.value.$el)||e.requestFullscreen())}))},setExitScreen:()=>{u.value=!1,null==document||document.exitFullscreen()},checkFull:h,showElement:()=>{h()&&d((async()=>{document.querySelector(".el-select-dropdown.el-popper")&&d((()=>{l.value.$el.appendChild(document.querySelector(".el-select-dropdown.el-popper"))})),document.querySelector(".el-picker-panel.el-popper")&&l.value.$el.appendChild(document.querySelector(".el-picker-panel"))}))},openPopup:()=>{h()?d((async()=>{await q(),document.querySelector(".el-dialog")&&(l.value.$el.appendChild(document.querySelector(".el-dialog__wrapper")),l.value.$el.appendChild(document.querySelector(".v-modal")))})):q()},isInfo:v}}}),(function(){var t=this,e=t._self._c,a=t._self._setupProxy;return e("div",[e(C,{ref:"chartModulesRef",staticClass:"relative module-box",attrs:{shadow:"never","body-style":{padding:0,display:"flex"}}},[e("template",{slot:"header"},[e("div",{staticClass:"flex items-center"},[e(G,t._g(t._b({attrs:{title:a.props.title,active:a.props.active},on:{"cut-click":a.showElement}},"control-title",t.$attrs,!1),t.$listeners)),a.isFullScreen||a.isInfo?t._e():e("span",{staticClass:"full-icon cursor-pointer",attrs:{title:"全屏展示"},on:{click:a.setFullScreen}})],1),a.isInfo?t._e():e("div",{staticClass:"flex items-center"},["网络IO："===a.props.title?e(v,{staticClass:"<2xl:hidden 2xl:inline-block",attrs:{type:"default"},on:{click:a.openPopup}},[t._v("统计 ")]):t._e(),e(T,{staticClass:"item",attrs:{effect:"dark",content:"网络IO统计",placement:"top-start"}},["网络IO："===a.props.title?e("i",{staticClass:"el-icon-s-data cursor-pointer text-[#666] hover:text-[#20a53a] <2xl:inline-block 2xl:hidden",attrs:{title:"网络IO统计"},on:{click:a.openPopup}}):t._e()]),e("div",{staticClass:"flex items-center ml-[1rem]"},[e(E,t._g({staticClass:"mr-[1rem]",on:{"cut-day-click":a.showElement}},t.$listeners)),e(T,{staticClass:"item",attrs:{effect:"dark",content:"点击刷新数据",placement:"top-start"}},[e(v,{staticClass:"<2xl:hidden 2xl:inline-block",attrs:{type:"default",icon:"el-icon-refresh"},on:{click:a.refresh}})],1),a.isFullScreen?e("span",{staticClass:"select-none el-icon-close cursor-pointer ml-[.5rem]",attrs:{title:"退出全屏"},on:{click:a.setExitScreen}}):t._e()],1)],1)]),a.isInfo?[a.props.controlValue||void 0!==a.props.compData.series[0].data?e(S,{staticClass:"w-[100%]",attrs:{description:"我们正在努力为您收集数据，请耐心等待1-2分钟后再尝试查看。"}}):[e(S,{staticClass:"w-[100%]",attrs:{description:"未开启监控，暂无数据"}},[e(g,{on:{click:a.updateEvent}},[t._v("点击开启监控 ")])],1)]]:t._e(),e(z,t._g(t._b({directives:[{name:"show",rawName:"v-show",value:!a.isInfo,expression:"!isInfo"}],ref:"dataRef",style:{height:a.fullHeight}},"percentage-data",t.$attrs,!1),t.$listeners))],2)],1)}),[],!1,null,null,null,null).exports;const $=y(a({__name:"ControlMonitor",setup(t){const{refs:{diskUnitType:e,networkUnitType:a,networkIoKey:i,days:l}}=R(),{proxy:r}=u(),c=s(!1),d=s(0),p=s(null),m=s([]),y=n({day:0,title:"CPU",active:!1,unitVisible:!1,echartsId:"",echartsPramas:{},echartsOption:{},cpuTopData:{}}),v=n({day:0,title:"内存",active:!1,unitVisible:!1,echartsId:"",echartsPramas:{},echartsOption:{},memTopData:{}}),f=n({day:0,title:"磁盘IO",active:!1,unitVisible:!0,echartsId:"",echartsPramas:{},echartsOption:{},diskTopData:{}}),g=n({day:0,title:"网络IO：",active:!0,unitVisible:!0,echartsId:"",echartsPramas:{},echartsOption:{},networkTopData:{},selectVal:"",selectList:[{label:"全部",value:""}]}),k=n({day:0,title:"平均负载",active:!1,unitVisible:!1,echartsId:"",echartsPramas:{},echartsOption:{},loadCpuTopData:{}}),_=async()=>{try{const{data:t}=await L({type:"-1"});c.value=t.status,d.value=t.day,l.value=t.day}catch(t){}},D=t=>{var e=t.time,a=t.legend,s="",o="";void 0===t.data&&(t.data=[]),void 0===t.table&&(t.table=[{title:"PID",width:"40px",index:1},{title:"进程名",index:2},{title:"CPU占用",index:0,unit:"%"},{title:"启动用户",index:4}]);for(var i=0;i<t.data.length;i++){var l=t.data[i];0===i&&(s+="<tr>"),o+="<tr>";for(var n=0;n<t.table.length;n++){var r=t.table[n];0===i&&(s+='<th style="width:'+(r.width||"auto")+'">'+r.title+"</th>");var c=l[r.index];o+="<td >"+("function"==typeof r.unit?r.unit(c):c+(r.unit||""))+"</td>"}0===i&&(s+="</tr>"),o+="</tr>"}return'<div class="echarts-tooltip" style="width:'+(t.width||"40rem")+'">        <div class="formatter-header">          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABHNCSVQICAgIfAhkiAAAAgBJREFUWIXtWN1xgzAMlkQ3YoCaYaJji8AWPjJM3AEYCasPNT3XZ2xBk17b43uCiy190b8AOHHixN8GPkpQ3/cmfrfWukfIPUyw73vjvTci8oqIJndGRBwivk3TNPwoQWYeAOC689p4hOgugsFq971KYhBRt8f9pD3IzEOOnIg4ABiJqCOibpomBIARAMbw2xd47+/BAyqoLJiznIi4pmnGmjW2rK615IuGYEbBeLvdBs3dQALTuA0yqwZqageCYBOTOxLs8zy7tm0xltW2Lc7z7Er3qv+AmSV+DzF2GJfL5R6XpZqri0mSBjMRdd8hBwDQNM0Yv3vvTel8kaCIvEbPTpMQaUdJYa11cXbHOnIoJknsCkR8KxFbluW6WoOZi64LskyqI4dNC9YsEcN7f08VLcuy2WmIyGl1qQv1VuZuCUfEqrs1UBN8hLIVT2l1JWW5llYisqfVbRJMhZfKQVo6RMTtKUklixazOMxzJjxvloO1na1hUHNhmCE/dZTOFl0clxZN0FtrVbVSW76qBNNyUCodWqSDR62vFwkGa3zGFyKaPQGeInN3zJ2LoWr86cAAByaa3JqgGTxU8yARdYlrrsx81QydaxuEryObevBQj05bi9K6uQF8xNOaSJWNT+2BX780/a+1MwUzD5rFnYiq9fEpBGM869PHiRMn/jreAZxNPtSJHlfLAAAAAElFTkSuQmCC" alt="path" />          <span>日期：'+e+'</span>        </div>          <div class="formatter-body">'+a+'<div class="process-top5 '+(0===t.data.length?"hide":"")+'">            <div class="process-header"></div>            <table>              <thead>              <tr>'+s+"</tr>              </thead>              <tbody>"+o+"</tbody>            </table>          </div>        </div>      </div>"},C=(t,e)=>{var a,s=e.size.contentSize[0],o=e.size.contentSize[1],i=window.innerWidth,l=window.innerHeight,n=null==(a=document.getElementById(t))?void 0:a.getBoundingClientRect(),r=e.pos[0]+(null==n?void 0:n.left),c=e.pos[1]+(null==n?void 0:n.top),d=0,p=0;return p=r+s+80<i?e.pos[0]+20:e.pos[0]-s-20,d=c+o+80<l?e.pos[1]+20:e.pos[1]-o-20,c-o<0&&(d=0-(null==n?void 0:n.top)+10),[p,d]},T=(t,e)=>({tooltip:{trigger:"axis",axisPointer:{type:"cross"},formatter(t){},padding:0,backgroundColor:"rgba(255,255,255,0.95)",borderColor:"#eee"},grid:{bottom:80},xAxis:{type:"time",boundaryGap:["1%","0%"],minInterval:(e-t)/3*1e3,axisLine:{lineStyle:{color:"#666"}},axisLabel:{formatter:function(t){return S(t/1e3)}}},yAxis:{type:"value",boundaryGap:[0,"100%"],splitLine:{lineStyle:{color:"#ddd"}},axisLine:{lineStyle:{color:"#666"}}},dataZoom:[{type:"inside",start:0,end:100,zoomLock:!0},{bottom:10,start:0,end:100,handleIcon:"M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",handleSize:"80%",handleStyle:{color:"#fff",shadowBlur:3,shadowColor:"rgba(0, 0, 0, 0.6)",shadowOffsetX:2,shadowOffsetY:2}}],series:[{}]}),S=t=>{const e=new Date(1e3*t),a=e.getMonth()+1,s=e.getDate(),o=e.getHours(),i=e.getMinutes();return"".concat(a.toString().padStart(2,"0"),"-").concat(s.toString().padStart(2,"0"),"\n").concat(o.toString().padStart(2,"0"),":").concat(i.toString().padStart(2,"0"))},I=async(t,e)=>{try{const{data:a}=await(t=>h.post("ajax/GetCpuIo",{data:t}))({start:t,end:e});m.value=a}catch(a){}},A=async(t,e,a)=>{try{let c=[];if(await I(t,e),c=m.value,0===c.length)return void("CPU"===a?y.echartsPramas={startTime:0,endTime:0,yData:[]}:v.echartsPramas={startTime:0,endTime:0,zData:[]});if(Q(c,t,e),j(c[c.length-1].addtime/1e3,t),"CPU"===a){var s=[];if(c.length>0){for(var o=0;o<c.length;o++){var i=c[o];s.push([i.addtime,i.pro]),void 0===y.cpuTopData&&(y.cpuTopData={}),y.cpuTopData[i.addtime]=i.cpu_top}var l=c[0].addtime,n=c[c.length-1].addtime;y.echartsPramas={startTime:l,endTime:n,yData:s}}}else{var r=[];if(c.length>0){for(o=0;o<c.length;o++){i=c[o];r.push([i.addtime,i.mem]),void 0===v.memTopData&&(v.memTopData={}),v.memTopData[i.addtime]=i.memory_top.map((t=>(t[0]=b(t[0]),t)))}l=c[0].addtime,n=c[c.length-1].addtime;v.echartsPramas={startTime:l,endTime:n,zData:r}}}}catch(c){}},V=(t,e,a)=>{var s=n(T(t,e));return s.tooltip.formatter=function(t){for(var e="",a=0;a<t.length;a++){var s=t[a];e+='<div class="select-data"><span class="status" style="background-color: '+s.color+'"></span><span>'+s.seriesName+"："+(x(s.data[1])?s.data[1].toFixed(2):0)+"%</span></div>"}return D({time:t[0].axisValueLabel,data:y.cpuTopData[t[0].axisValue],legend:e})},s.tooltip.padding=0,s.tooltip.backgroundColor="rgba(255,255,255,0.95)",s.tooltip.borderColor="#eee",s.yAxis.name="百分比",s.yAxis.min=0,s.yAxis.max=100,s.series=[{name:"CPU",type:"line",smooth:!0,symbol:"circle",showSymbol:!1,itemStyle:{normal:{color:"rgb(0, 153, 238)"}},data:a}],s.tooltip.position=function(t,e,a,s,o){return C(y.echartsId,{pos:t,size:o})},s},P=t=>{y.echartsOption=V(t.startTime,t.endTime,t.yData)},O=async t=>{const{b:e,e:a}=tt(t);await A(e,a,"CPU"),P(y.echartsPramas)},z=(t,e,a)=>{var s=n(T(t,e));return s.tooltip.formatter=function(t){for(var e="",a=0;a<t.length;a++){var s=t[a];e+='<div class="select-data"><span class="status" style="background-color: '+s.color+'"></span><span>'+s.seriesName+"："+(x(s.data[1])?s.data[1].toFixed(2):0)+"%</span></div>"}return D({time:t[0].axisValueLabel,data:v.memTopData[t[0].axisValue],table:[{title:"PID",width:"40px",index:1},{title:"进程名",width:"50px",index:2},{title:"内存占用",index:0},{title:"启动用户",index:4}],legend:e})},s.tooltip.className="mem-tooltip",s.tooltip.padding=0,s.tooltip.backgroundColor="rgba(255,255,255,0.95)",s.tooltip.borderColor="#eee",s.tooltip.position=function(t,e,a,s,o){return C(v.echartsId,{pos:t,size:o})},s.yAxis.name="百分比",s.yAxis.min=0,s.yAxis.max=100,s.series=[{name:"内存",type:"line",smooth:!0,symbol:"circle",showSymbol:!1,itemStyle:{normal:{color:"rgb(0, 153, 238)"}},data:a}],s},M=t=>{v.echartsOption=z(t.startTime,t.endTime,t.zData)},N=async t=>{const{b:e,e:a}=tt(t);await A(e,a,"内存"),M(v.echartsPramas)},j=(t,e)=>S(t).slice(0,5)!==S(e).slice(0,5),B=async(t,a)=>{try{const{data:w}=await(t=>h.post("ajax/GetDiskIo",{data:t}))({start:t,end:a});if(0===w.length)return void(f.echartsPramas={_unit:e.value,startTime:0,endTime:0,rData:[],wData:[],zData:[],yData:[]});Q(w,t,a),j(w[w.length-1].addtime/1e3,t);var s=[],o=[],i=[],l=[],n=1,r=e.value;switch(r){case"MB/s":n=1024;break;case"GB/s":n=1048576;break;default:n=1}for(var c=!1,d=!1,p=0;p<w.length;p++){var u=w[p],m=(u.read_bytes/1024).toFixed(3),y=(u.write_bytes/1024).toFixed(3);s.push([u.addtime,m/n]),o.push([u.addtime,y/n]),l.push([u.addtime,u.read_count+u.write_count]),i.push([u.addtime,u.read_time+u.write_time]),void 0===f.diskTopData&&(f.diskTopData={}),f.diskTopData[u.addtime]=u.disk_top;var v=m/1024,g=y/1024;if((v>=1||g>=1)&&!c&&(c=!0),c)(v/1024>=1||g/1024>=1)&&!d&&(d=!0)}if(w.length>0){var b=w[0].addtime/1e3,x=w[w.length-1].addtime/1e3;f.echartsPramas={_unit:r,startTime:b,endTime:x,rData:s,wData:o,zData:i,yData:l}}}catch(w){}},F=(t,e,a,s,o,i,l)=>{var r=n(T(e,a));return r.tooltip.formatter=function(e){for(var a="",s=0;s<e.length;s++){var o=e[s],i="";"读写次数"===o.seriesName&&(i="次/s"),"读写延迟"===o.seriesName&&(i="ms"),"读取"!==o.seriesName&&"写入"!==o.seriesName||(i=t),a+='<div class="select-data"><span class="status" style="background-color: '+o.color+'"></span><span>'+o.seriesName+"："+(x(o.data[1])?o.data[1].toFixed(2):0)+" "+i+"</span></div>"}return D({time:e[0].axisValueLabel,data:f.diskTopData[e[0].axisValue],width:"470px",table:[{title:"PID",width:"40px",index:3},{title:"进程名",width:"50px",index:4},{title:"磁盘占用",index:0,unit:function(t){return b(t)}},{title:"读取",index:1,unit:function(t){return b(t)}},{title:"写入",index:2,unit:function(t){return b(t)}},{title:"启动用户",index:6}],legend:a})},r.tooltip.padding=0,r.tooltip.backgroundColor="rgba(255,255,255,0.95)",r.tooltip.borderColor="#eee",r.tooltip.position=function(t,e,a,s,o){return C(f.echartsId,{pos:t,size:o})},r.legend={top:"18px",data:["读取","写入","读写次数","读写延迟"]},r.series=[{name:"读取",type:"line",smooth:!0,symbol:"circle",showSymbol:!1,itemStyle:{normal:{color:"rgb(255, 70, 131)"}},data:s},{name:"写入",type:"line",smooth:!0,symbol:"circle",showSymbol:!1,itemStyle:{normal:{color:"rgba(46, 165, 186, .7)"}},data:o},{name:"读写次数",type:"line",smooth:!0,symbol:"circle",showSymbol:!1,itemStyle:{normal:{color:"rgba(30, 144, 255)"}},data:l},{name:"读写延迟",type:"line",smooth:!0,symbol:"circle",showSymbol:!1,itemStyle:{normal:{color:"rgba(255, 140, 0)"}},data:i}],r},E=t=>{f.echartsOption=F(t._unit,t.startTime,t.endTime,t.rData,t.wData,t.zData,t.yData)},G=async t=>{const{b:e,e:a}=tt(t);await B(e,a),E(f.echartsPramas)},q=async(t,e)=>{try{const{data:b}=await(t=>h.post("ajax/GetNetWorkIo",{data:t}))({start:t,end:e});if(0===b.length)return void(g.echartsPramas={_unit:a.value,startTime:0,endTime:0,yData:[],zData:[]});1===g.selectList.length&&Object.keys(b[0].down_packets).forEach((t=>{g.selectList.push({title:t,value:t})})),Q(b,t,e),j(b[b.length-1].addtime/1e3,t);var s=[],o=[],l=1,n=a.value,r=i.value||"";switch(n){case"MB/s":l=1024;break;case"GB/s":l=1048576;break;default:l=1}for(var c=!1,d=!1,p=0;p<b.length;p++){var u=b[p];if("object"==typeof u.down_packets){void 0!==r&&""!=r?"object"==typeof u.down_packets?o.push([u.addtime,u.down_packets[r]/l]):o.push([u.addtime,0]):o.push([u.addtime,u.down/l]),void 0!==r&&""!=r?"object"==typeof u.up_packets?s.push([u.addtime,u.up_packets[r]/l]):s.push([u.addtime,0]):s.push([u.addtime,u.up/l]);var m=u.up/1024,y=u.down/1024;if((m>=1||y>=1)&&!c&&(c=!0),c)(m/1024>=1||y/1024>=1)&&!d&&(d=!0)}if(b.length>0){var v=b[0].addtime/1e3,f=b[b.length-1].addtime/1e3;g.echartsPramas={_unit:n,startTime:v,endTime:f,yData:s,zData:o}}}}catch(b){}},U=(t,e,a,s,o)=>{var i=n(T(e,a));return i.tooltip.formatter=function(e){var a=e[0].data[0];w(a/1e3);for(var s="",o=0;o<e.length;o++){var i=e[o];s+='<div class="select-data"><span class="status" style="background-color: '+i.color+'"></span><span>'+i.seriesName+"："+(x(i.data[1])?i.data[1].toFixed(3):0)+" "+t+"</span></div>"}return D({width:"280px",time:e[0].axisValueLabel,legend:s})},i.tooltip.padding=0,i.tooltip.backgroundColor="rgba(255,255,255,0.95)",i.tooltip.borderColor="#eee",i.tooltip.position=function(t,e,a,s,o){return C(g.echartsId,{pos:t,size:o})},i.legend={top:"18px",data:["上行","下行"]},i.series=[{name:"上行",type:"line",smooth:!0,symbol:"circle",showSymbol:!1,itemStyle:{normal:{color:"rgb(255, 70, 131)"}},data:s},{name:"下行",type:"line",smooth:!0,symbol:"circle",showSymbol:!1,itemStyle:{normal:{color:"rgba(46, 165, 186, .7)"}},data:o}],i},$=t=>{g.echartsOption=U(t._unit,t.startTime,t.endTime,t.yData,t.zData)},W=async t=>{const{b:e,e:a}=tt(t);await q(e,a),$(g.echartsPramas)},K=async(t,e)=>{try{const{data:c}=await(t=>h.post("ajax/get_load_average",{data:t}))({start:t,end:e});if(0===c.length)return void(k.echartsPramas={startTime:0,endTime:0,yData:[],zData:[],aData:[],bData:[]});Q(c,t,e),j(c[c.length-1].addtime/1e3,t);var a=[],s=[],o=[],i=[];if(void 0===c)return;for(var l=0;l<c.length;l++)i.push([c[l].addtime,c[l].one]),o.push([c[l].addtime,c[l].pro]),a.push([c[l].addtime,c[l].five]),s.push([c[l].addtime,c[l].fifteen]),void 0===k.loadCpuTopData&&(k.loadCpuTopData={}),k.loadCpuTopData[c[l].addtime]=c[l].cpu_top;if(c.length>0){var n=c[0].addtime/1e3,r=c[c.length-1].addtime/1e3;k.echartsPramas={startTime:n,endTime:r,yData:o,zData:i,aData:a,bData:s}}}catch(c){}},H=(t,e,a,s,o,i)=>{var l=n(T(t,e)),r=(e-t)/3*1e3;return l.tooltip.formatter=function(t){for(var e="",a="",s=0;s<t.length;s++){var o=t[s];switch(o.seriesName){case"1分钟":case"5分钟":case"15分钟":e+='<div class="select-data"><span class="status" style="background-color: '+o.color+'"></span><span>'+o.seriesName+"："+(x(o.data[1])?o.data[1].toFixed(2):0)+"%</span></div>";break;case"资源使用率":a=x(o.data[1])?o.data[1].toFixed(2):"0"}}return D({time:t[0].axisValueLabel,data:k.loadCpuTopData[t[0].axisValue],legend:'<div class="select-data"><span class="status"></span><span>资源使用率：'+a+'%</span></div><div class="'+("资源使用率"===t[0].seriesName?"hide":"")+'">'+e+"</div>"})},l.tooltip.padding=0,l.tooltip.backgroundColor="rgba(255,255,255,0.95)",l.tooltip.borderColor="#eee",l.tooltip.position=function(t,e,a,s,o){return C(k.echartsId,{pos:t,size:o})},l.legend={data:["1分钟","5分钟","15分钟"],right:"16%",top:"10px"},l.axisPointer={link:{xAxisIndex:"all"},lineStyle:{color:"#aaaa",width:1}},l.grid=[{left:"5%",bottom:80,right:"55%",width:"40%",height:"auto"},{bottom:80,left:"55%",width:"40%",height:"auto"}],l.xAxis=[{type:"time",boundaryGap:["1%","0%"],minInterval:r,axisLine:{lineStyle:{color:"#666"}},axisLabel:{formatter:function(t){return S(t/1e3)}}},{type:"time",gridIndex:1,boundaryGap:["1%","0%"],minInterval:r,axisLine:{lineStyle:{color:"#666"}},axisLabel:{formatter:function(t){return S(t/1e3)}}}],l.yAxis=[{scale:!0,name:"资源使用率",min:0,max:function(t){return t.max>=100?Math.ceil(t.max):t.max>=80?100:parseInt((t.max+10).toString().slice(0,1)+"0")},splitLine:{show:!0,lineStyle:{color:"#ddd"}},nameTextStyle:{color:"#666",fontSize:12,align:"left"},axisLine:{lineStyle:{color:"#666"}}},{scale:!0,name:"负载详情",gridIndex:1,splitLine:{show:!0,lineStyle:{color:"#ddd"}},nameTextStyle:{color:"#666",fontSize:12,align:"left"},axisLine:{lineStyle:{color:"#666"}}}],l.dataZoom[0].xAxisIndex=[0,1],l.dataZoom[1].type="slider",l.dataZoom[1].left="5%",l.dataZoom[1].right="5%",l.dataZoom[1].xAxisIndex=[0,1],l.series=[{name:"资源使用率",type:"line",smooth:!0,symbol:"circle",showSymbol:!1,lineStyle:{normal:{width:2,color:"rgb(255, 140, 0)"}},itemStyle:{normal:{color:"rgb(255, 140, 0)"}},data:a},{xAxisIndex:1,yAxisIndex:1,name:"1分钟",type:"line",smooth:!0,symbol:"circle",showSymbol:!1,lineStyle:{normal:{width:2,color:"rgb(30, 144, 255)"}},itemStyle:{normal:{color:"rgb(30, 144, 255)"}},data:s},{xAxisIndex:1,yAxisIndex:1,name:"5分钟",type:"line",smooth:!0,symbol:"circle",showSymbol:!1,lineStyle:{normal:{width:2,color:"rgb(0, 178, 45)"}},itemStyle:{normal:{color:"rgb(0, 178, 45)"}},data:o},{xAxisIndex:1,yAxisIndex:1,name:"15分钟",type:"line",smooth:!0,symbol:"circle",showSymbol:!1,lineStyle:{normal:{width:2,color:"rgb(147, 38, 255)"}},itemStyle:{normal:{color:"rgb(147, 38, 255)"}},data:i}],l.textStyle={color:"#666",fontSize:12},l},J=t=>{k.echartsOption=H(t.startTime,t.endTime,t.yData,t.zData,t.aData,t.bData)},Y=async t=>{const{b:e,e:a}=tt(t);await K(e,a),J(k.echartsPramas)},Z=async t=>{try{if((!t||"cpu"===t||"mem"===t)&&y.day==v.day){const{b:t,e:e}=tt(y.day);await I(t,e)}t&&"cpu"!==t||await O(y.day),t&&"mem"!==t||await N(v.day),t&&"disk"!==t||await G(f.day),t&&"network"!==t||await W(g.day),t&&"load"!==t||await Y(k.day),t&&r.$message.success("刷新成功")}catch(e){}},Q=(t,e,a)=>{if(void 0!==t&&t.length>0){let e;for(let a=0;a<t.length;a++)"number"!=typeof t[a].addtime&&(e=X(t[a].addtime,t[t.length-1].addtime),t[a].addtime=e)}},X=(t,e)=>{var a=e.split(" ")[0].split("/");a=parseInt(a);var s=new Date,o=t.split(" "),i=o[0].split("/"),l=o[1].split(":"),n=parseInt(i[0]),r=s.getFullYear();return(n>s.getMonth()+1||12==n&&n==a)&&(r-=1),new Date(r,n-1,i[1],l[0],l[1]).getTime()},tt=t=>{var e=0,a=Math.floor((new Date).getTime()/1e3);return 0==t?e=new Date(et()+" 00:00:00").getTime()/1e3:1==t?(e=new Date(at(t)+" 00:00:00").getTime()/1e3,a=new Date(at(t)+" 23:59:59").getTime()/1e3):e=new Date(at(t-1)+" 00:00:00").getTime()/1e3,{b:e=Math.floor(e),e:a=Math.floor(a)}},et=()=>w((new Date).getTime()/1e3,"yyyy/MM/dd"),at=t=>{var e=new Date(et()).getTime();return w((e-24*t*3600*1e3)/1e3,"yyyy/MM/dd")};return o((async()=>{await _(),await Z()})),{__sfc:!0,diskUnitType:e,networkUnitType:a,networkIoKey:i,days:l,vm:r,controlValue:c,dayAll:d,setDayRef:p,cpuAndMemData:m,cpu:y,mem:v,disk:f,network:g,load:k,GetStatus:_,SetControl:async()=>{let t=null;try{let e=d.value,a=c.value?"1":"0";if(e<1)return void r.$message.error("保存天数不合法");if(!/^-?\d+$/.test(e+""))return void r.$message.error("保存天数必须为整数");t=r.$load("正在设置监控状态，请稍后...");const{data:s}=await L({type:a,day:e});await Z(),s.status?(r.$message.success(s.msg),l.value=e):r.$message.error(s.msg),t&&t.close()}catch(e){}finally{t&&t.close()}},CloseControl:async()=>{try{await r.$confirm({type:"calc",title:"清空记录",width:"35rem",message:"您真的要清空所有监控记录吗？"});const t=await L({type:"del"});r.$message.request(t),window.location.reload()}catch(t){}},echartsFormatter:D,echartsPositon:C,getDefaultOption:T,formatTime_up:S,acceptCpuId:t=>{y.echartsId=t},getCpuAndMenData:I,getCpuAndMemInfo:A,getCpuOption:V,generateCpuOption:P,setCpuData:O,changeCpuDay:async t=>{y.day=t,"object"==typeof t?(await A(t[0].getTime()/1e3,t[1].getTime()/1e3,"CPU"),P(y.echartsPramas)):await O(y.day)},acceptMemId:t=>{v.echartsId=t},getMemOption:z,generateMemOption:M,setMemData:N,changeMemDay:async t=>{v.day=t,"object"==typeof t?(await A(t[0].getTime()/1e3,t[1].getTime()/1e3,"内存"),M(v.echartsPramas)):await N(v.day)},acceptDiskId:t=>{f.echartsId=t},timeCompare:j,getDiskControlInfo:B,getDsikOption:F,generateDiskOption:E,setDiskData:G,changeDiskDay:async t=>{f.day=t,"object"==typeof t?(await B(t[0].getTime()/1e3,t[1].getTime()/1e3),E(f.echartsPramas)):G(f.day)},acceptNetworkId:t=>{g.echartsId=t},getNetworkControlInfo:q,getNetworkOption:U,generateNetworkOption:$,setNetworkData:W,changeNetworkDay:async t=>{g.day=t,"object"==typeof t?(await q(t[0].getTime()/1e3,t[1].getTime()/1e3),$(g.echartsPramas)):W(g.day)},changeNetworkUnit:t=>{i.value=t,W(g.day)},acceptLoadId:t=>{k.echartsId=t},getLoadControlInfo:K,getLoadOption:H,generateLoadOption:J,setLoadData:Y,changeLoadDay:async t=>{k.day=t,"object"==typeof t?(await K(t[0].getTime()/1e3,t[1].getTime()/1e3),J(k.echartsPramas)):Y(k.day)},initAllData:Z,SetData:Q,GetTime:X,getData:tt,getToday:et,getBeforeData:at}}}),(function(){var t=this,e=t._self._c,a=t._self._setupProxy;return e("section",[e(I,{staticClass:"set_top",attrs:{span:24}},[e(A,{staticClass:"flex",attrs:{span:24}},[e("div",{staticClass:"top_all"},[e("div",{staticClass:"monitor"},[e("em",{staticClass:"open_monitor",staticStyle:{"vertical-align":"middle"}},[t._v("开启监控")]),e(O,{attrs:{checked:""},on:{change:function(t){return a.SetControl()}},model:{value:a.controlValue,callback:function(t){a.controlValue=t},expression:"controlValue"}})],1),e("div",{staticClass:"day"},[e("div",{staticClass:"save_day"},[e("em",[t._v("保存天数：")]),e(P,{attrs:{"controls-position":"right",size:"small",type:"number"},model:{value:a.dayAll,callback:function(t){a.dayAll=t},expression:"dayAll"}}),e("div",{staticClass:"set"},[e(v,{ref:"setDayRef",staticClass:"btn-sm",attrs:{type:""},on:{click:function(t){return a.SetControl()}}},[t._v("更改")])],1)],1)]),e("div",{staticClass:"parting_line"}),e("div",{staticClass:"clear"},[e(v,{attrs:{type:""},on:{click:function(t){return a.CloseControl()}}},[t._v("清空记录")])],1)])])],1),[e(I,[e(A,{attrs:{span:24}},[e(U,{attrs:{controlValue:a.controlValue,title:a.load.title,active:a.load.active,compData:a.load.echartsOption,unitVisible:a.load.unitVisible,type:"load"},on:{"update:controlValue":function(t){a.controlValue=t},"update:control-value":function(t){a.controlValue=t},refresh:a.initAllData,"cut-day":a.changeLoadDay,"accept-echarts-id":a.acceptLoadId}})],1)],1),e(I,{attrs:{gutter:15,span:24,"mt-10":""}},[e(A,{attrs:{md:12,sm:24,span:12,xs:24}},[e(U,{attrs:{controlValue:a.controlValue,title:a.cpu.title,active:a.cpu.active,compData:a.cpu.echartsOption,unitVisible:a.cpu.unitVisible,type:"cpu"},on:{"update:controlValue":function(t){a.controlValue=t},"update:control-value":function(t){a.controlValue=t},"cut-day":a.changeCpuDay,refresh:a.initAllData,"accept-echarts-id":a.acceptCpuId}})],1),e(A,{attrs:{md:12,sm:24,span:12,xs:24}},[e(U,{attrs:{controlValue:a.controlValue,title:a.mem.title,active:a.mem.active,compData:a.mem.echartsOption,unitVisible:a.mem.unitVisible,type:"mem"},on:{"update:controlValue":function(t){a.controlValue=t},"update:control-value":function(t){a.controlValue=t},"cut-day":a.changeMemDay,refresh:a.initAllData,"accept-echarts-id":a.acceptMemId}})],1)],1),e(I,{attrs:{gutter:15,span:24,"mt-10":""}},[e(A,{attrs:{md:24,sm:24,lg:12,span:12,xs:24}},[e(U,{attrs:{controlValue:a.controlValue,title:a.disk.title,active:a.disk.active,compData:a.disk.echartsOption,unitVisible:a.disk.unitVisible,type:"disk"},on:{"update:controlValue":function(t){a.controlValue=t},"update:control-value":function(t){a.controlValue=t},"cut-day":a.changeDiskDay,refresh:a.initAllData,"accept-echarts-id":a.acceptDiskId}})],1),e(A,{attrs:{md:24,lg:12,sm:24,span:12,xs:24}},[e(U,{attrs:{controlValue:a.controlValue,title:a.network.title,active:a.network.active,compData:a.network.echartsOption,unitVisible:a.network.unitVisible,selectList:a.network.selectList,type:"network"},on:{"update:controlValue":function(t){a.controlValue=t},"update:control-value":function(t){a.controlValue=t},"cut-day":a.changeNetworkDay,"cut-select":a.changeNetworkUnit,refresh:a.initAllData,"accept-echarts-id":a.acceptNetworkId}})],1)],1)]],2)}),[],!1,null,null,null,null).exports;const W=y(a({__name:"index",setup(t){const{proxy:a}=u();return{__sfc:!0,vm:a,tabActive:s("Monitor"),tabComponent:s([{title:"系统监控",type:"Monitor",component:$},{title:"面板日报",type:"PanelReport",component:()=>e((()=>import("./RapidDeployment.js?v=1714377894636")),__vite__mapDeps([27,28,6,7,4,3,8,9,10,5,2,11,1,29,20,13,14,15,16,17,18,19,21,22,23,12,24,25,26]),import.meta.url)}])}}}),(function(){var e=this._self._c,a=this._self._setupProxy;return e("section",{staticClass:"top"},[e(t,{attrs:{type:"nav2",config:a.tabComponent},model:{value:a.tabActive,callback:function(t){a.tabActive=t},expression:"tabActive"}})],1)}),[],!1,null,"a0e685d8",null,null).exports,K=Object.freeze(Object.defineProperty({__proto__:null,default:W},Symbol.toStringTag,{value:"Module"}));export{B as G,j as S,M as a,N as b,R as g,K as i};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./NetworkDayDialog.js?v=1714377894636","./index39.js?v=1714377894636","./element-lib.js?v=1714377894636","./__commonjsHelpers__.js?v=1714377894636","./vue-lib.js?v=1714377894636","./public-lib.js?v=1714377894636","./main.js?v=1714377894636","./modulepreload-polyfill.js?v=1714377894636","./preload-helper.js?v=1714377894636","./request-lib.js?v=1714377894636","./locales-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./index85.js?v=1714377894636","./index77.js?v=1714377894636","./element-lib.js?v=1714377894636","./index42.js?v=1714377894636","./index91.js?v=1714377894636","./echarts.js?v=1714377894636","./date-picker.js?v=1714377894636","./date-util.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./element-lib.js?v=1714377894636","./index46.js?v=1714377894636","./element-lib.js?v=1714377894636","./index.vue_vue_type_style_index_0_lang.js?v=1714377894636","./RapidDeployment.js?v=1714377894636","./index51.js?v=1714377894636","./index41.js?v=1714377894636"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
