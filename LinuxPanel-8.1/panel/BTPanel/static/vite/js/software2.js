import{A as a}from"./vue-lib.js?v=1714377894636";import{a1 as e,H as l,m as n,a2 as o,d as t,e as s,p as i}from"./main.js?v=1714377894636";const u=async({name:u,softData:c=!1,source:p=22,plugin:f=!1,limitLtd:r=!1,function:d})=>{const m=e(),{authType:g}=a(m),y=l.load("正在获取软件信息,请稍候...");let I=c;try{if(!n(u,"undefined")&&!c){const{data:a}=await o({sName:u});I=a}const{name:a,endtime:e,setup:l,type:m}=I;if(5===m||7===m||13===m)return void(l?(await t({pluginInfo:I,callback:d}),y&&y.close()):(y&&y.close(),s({name:a,type:m,pluginInfo:I})));8===m&&(r=!1),r?"ltd"===g.value?l?(await t({pluginInfo:I,callback:d}),y&&y.close(),d&&d()):s({name:a,type:m,pluginInfo:I}):i({disablePro:!0,sourceId:p,plugin:f}):"ltd"===g.value||"pro"===g.value&&8===m||"free"===g.value&&e>=0?l?(await t({pluginInfo:I,callback:d}),y&&y.close(),d&&d()):s({name:a,type:m,pluginInfo:I}):"free"===g.value&&e<=-1&&i({disablePro:8!==m,sourceId:p,plugin:f})}catch(v){}finally{null==y||y.close()}};export{u as o};
