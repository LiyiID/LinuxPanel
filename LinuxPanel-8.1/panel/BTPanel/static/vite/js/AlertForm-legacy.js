System.register(["./index-legacy85.js?v=1714377894636","./main-legacy.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./form-item-legacy.js?v=1714377894636","./index-legacy134.js?v=1714377894636","./index-legacy41.js?v=1714377894636","./select-legacy.js?v=1714377894636","./form-legacy.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./mysql.store-legacy.js?v=1714377894636"],(function(e,t){"use strict";var a,l,r,i,s,o,n,m,u,c,p,v,y,h,w,f,d,b,x;return{setters:[function(e){a=e._},function(e){l=e.g,r=e.o,i=e.n,s=e.D,o=e.r},function(e){n=e.w,m=e.x,u=e.q,c=e.s},null,function(e){p=e._},function(e){v=e._},null,null,function(e){y=e.b,h=e.e,w=e.w,f=e.h,d=e.j},function(e){b=e.i},function(e){x=e.m}],execute:function(){y([{title:"全部",key:"all"},{title:"数据库",key:"databases"},{title:"表",key:"tables"}]),y([{title:"服务器磁盘",key:"localhost"},{title:"阿里云OSS",key:"alioss"},{title:"腾讯云OSS",key:"txcos"},{title:"七牛云存储",key:"qiniu"},{title:"华为云存储",key:"obs"},{title:"百度云存储",key:"bos"},{title:"天翼云存储",key:"tianyiyun"}]);var t=y([{title:"不接收任何消息通知",key:0},{title:"任务执行失败接收通知",key:1}]);y([{value:"Synchronization",label:b.t("BtnGroup.Synchronization"),event:function(){}},{value:"BackDatabase",label:b.t("BtnGroup.BackDatabase"),event:function(){}},{value:"delete",label:b.t("BtnGroup.DeleteDatabase"),isRefBatch:!0,event:function(){}}]);var g=h({__name:"AlertForm",props:{isCronTab:{type:Boolean,default:!1},isEdit:{type:Boolean,default:!1},showKeyword:{type:Boolean,default:!1},showNotice:{type:Boolean,default:!0},needAll:{type:Boolean,default:!1}},setup:function(e,a){var i=a.expose,s=e,o=d().proxy,n=l(),m=n.refs,u=m.timeForm,c=m.noticeForm,p=m.msgData,v=m.timeFormRules,h=n.clearTimeForm,b=y(),g=x().getMsgConfig,F=y(0),C=y([{type:"day",text:"每天",showDay:!1,showHour:!0,showMinute:!0},{type:"day-n",text:"N天",showDay:!0,showHour:!0,showMinute:!0},{type:"hour",text:"每小时",showDay:!1,showHour:!1,showMinute:!0},{type:"hour-n",text:"N小时",showDay:!1,showHour:!0,showMinute:!0},{type:"minute-n",text:"N分钟",showDay:!1,showHour:!1,showMinute:!0},{type:"week",text:"每周",showDay:!1,showHour:!0,showMinute:!0},{type:"month",text:"每月",showDay:!0,showHour:!0,showMinute:!0}]),k={where1:[{validator:function(e,t,a){"day-n"===u.value.type||"month"===u.value.type?Number.parseInt(t)>31||Number.parseInt(t)<1?a(new Error("请输入1-31的整数")):""===t?a(new Error("请输入天数")):a():a()},trigger:"blur"}],hour:[{validator:function(e,t,a){"minute-n"!==u.value.type&&"hour"!==u.value.type||a(),Number.parseInt(t)>23||Number.parseInt(t)<0?a(new Error("请输入0-23的整数")):""===t?a(new Error("请输入小时")):"hour-n"===u.value.type&&0===Number.parseInt(t)&&0===Number.parseInt(u.value.minute)?a(new Error("小时和分钟不能同时为0")):a()},trigger:"blur"}],minute:[{validator:function(e,t,a){Number.parseInt(t)>59||Number.parseInt(t)<0?a(new Error("请输入0-59的整数")):""===t?a(new Error("请输入分钟")):"hour-n"===u.value.type&&0===Number.parseInt(t)&&0===Number.parseInt(u.value.hour)?a(new Error("小时和分钟不能同时为0")):"minute-n"===u.value.type&&Number.parseInt(t)<1?a(new Error("请输入1-59的整数")):a()},trigger:"blur"}],timeSet:[{validator:function(e,t,a){"sweek"!==u.value.type||t.length?a():a(new Error("请选择时间"))},trigger:"change"}],specialHour:[{validator:function(e,t,a){"sweek"!==u.value.type||t.length?a():a(new Error("请选择小时"))},trigger:"change"}],specialMinute:[{validator:function(e,t,a){"sweek"!==u.value.type||t.length?a():a(new Error("请选择分钟"))},trigger:"change"}]},_=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];s.isEdit||(c.value.notice=0,t&&h()),u.value.type=e,F.value=C.value.findIndex((function(t){return t.type===e})),"minute-n"===u.value.type&&(u.value.where1=u.value.minute),"hour-n"===u.value.type&&(u.value.where1=u.value.hour),b.value&&b.value.clearValidate()};return w((function(){_(u.value.type)})),f((function(){_(u.value.type,!0),s.isCronTab&&!r&&C.value.push({type:"sweek",text:"自定义",showDay:!1,showHour:!0,showMinute:!0})})),i({form:b}),{__sfc:!0,vm:o,props:s,timeForm:u,noticeForm:c,msgData:p,timeFormRules:v,clearTimeForm:h,form:b,getMsgConfig:g,cycleTime:F,timeType:C,rule:k,onGiveSelect:function(e){c.value.noticeChannel=e},timeTypeChange:function(e){b.value.clearValidate()},handleChange:function(e){c.value.notice=e,1===e&&(g(),c.value.noticeChannel="all")},handleTypeChange:_,noticeOptions:t,isRelease:r}}});e("_",i(g,(function(){var e,t,l,r=this,i=r._self._c,y=r._self._setupProxy;return i("div",[i(n,{ref:"form",staticClass:"demo-form-inline",attrs:{rules:y.rule,inline:!0,model:y.timeForm}},[i(m,{staticClass:"!w-full"},[i(m,{attrs:{label:"执行周期"}},[i("div",{staticClass:"flex items-center"},[i(u,{staticClass:"w-[8rem] mr-4x",on:{change:function(e){return y.handleTypeChange(y.timeForm.type,!0)}},model:{value:y.timeForm.type,callback:function(e){r.$set(y.timeForm,"type",e)},expression:"timeForm.type"}},r._l(y.timeType,(function(e,t){return i(c,{key:t,attrs:{label:e.text,value:e.type}})})),1),r.isCronTab&&!y.isRelease&&"sweek"==y.timeForm.type?[i(u,{staticClass:"ml-8x mr-4x !w-[8rem]",on:{change:y.timeTypeChange},model:{value:y.timeForm.timeType,callback:function(e){r.$set(y.timeForm,"timeType",e)},expression:"timeForm.timeType"}},[i(c,{attrs:{label:"每天",value:"sday"}}),i(c,{attrs:{label:"每周",value:"sweek"}}),i(c,{attrs:{label:"每月",value:"smonth"}})],1),i(m,{staticClass:"el-form-item-item",attrs:{prop:"timeSet"}},["sweek"===y.timeForm.timeType?i(u,{staticClass:"ml-8x mr-4x !w-[20rem]",attrs:{multiple:""},model:{value:y.timeForm.timeSet,callback:function(e){r.$set(y.timeForm,"timeSet",e)},expression:"timeForm.timeSet"}},[i(c,{attrs:{label:"周一",value:"1"}}),i(c,{attrs:{label:"周二",value:"2"}}),i(c,{attrs:{label:"周三",value:"3"}}),i(c,{attrs:{label:"周四",value:"4"}}),i(c,{attrs:{label:"周五",value:"5"}}),i(c,{attrs:{label:"周六",value:"6"}}),i(c,{attrs:{label:"周日",value:"7"}})],1):r._e()],1),"smonth"===y.timeForm.timeType?i(m,{staticClass:"el-form-item-item",attrs:{prop:"timeSet"}},[i(u,{staticClass:"ml-8x mr-4x !w-[11rem]",attrs:{multiple:"","collapse-tags":""},model:{value:y.timeForm.timeSet,callback:function(e){r.$set(y.timeForm,"timeSet",e)},expression:"timeForm.timeSet"}},r._l(30,(function(e,t){return i(c,{key:e,attrs:{label:e,value:"".concat(e)}})})),1),i("span",[r._v("号")])],1):r._e(),i(m,{staticClass:"el-form-item-item",attrs:{prop:"specialHour"}},[i(u,{staticClass:"ml-8x mr-4x !w-[12rem]",attrs:{textType:"点",multiple:"","collapse-tags":""},model:{value:y.timeForm.specialHour,callback:function(e){r.$set(y.timeForm,"specialHour",e)},expression:"timeForm.specialHour"}},r._l(24,(function(e,t){return i(c,{key:t,attrs:{label:t,value:t}})})),1),i("span",[r._v("点")])],1),i(m,{staticClass:"el-form-item-item",attrs:{prop:"specialMinute"}},[i(u,{staticClass:"ml-8x mr-4x !w-[12rem]",attrs:{multiple:"","collapse-tags":""},model:{value:y.timeForm.specialMinute,callback:function(e){r.$set(y.timeForm,"specialMinute",e)},expression:"timeForm.specialMinute"}},[r._l(60,(function(e,t){return[t%5==0?i(c,{key:t,attrs:{label:t,value:t}}):r._e()]}))],2),i("span",[r._v("分")])],1)]:["week"==y.timeForm.type?i(m,{staticClass:"el-form-item-item"},[i(u,{staticClass:"ml-8x mr-4x !w-[8rem]",model:{value:y.timeForm.week,callback:function(e){r.$set(y.timeForm,"week",e)},expression:"timeForm.week"}},[i(c,{attrs:{label:"周一",value:"1"}}),i(c,{attrs:{label:"周二",value:"2"}}),i(c,{attrs:{label:"周三",value:"3"}}),i(c,{attrs:{label:"周四",value:"4"}}),i(c,{attrs:{label:"周五",value:"5"}}),i(c,{attrs:{label:"周六",value:"6"}}),i(c,{attrs:{label:"周日",value:"7"}})],1)],1):r._e(),i(m,{staticClass:"el-form-item-item",attrs:{prop:"where1"}},[null!==(e=y.timeType[y.cycleTime])&&void 0!==e&&e.showDay?i(a,{staticClass:"mr-4x ml-8x",attrs:{min:1,width:"9.2rem",textType:"天",type:"number"},model:{value:y.timeForm.where1,callback:function(e){r.$set(y.timeForm,"where1",e)},expression:"timeForm.where1"}}):r._e()],1),i(m,{staticClass:"el-form-item-item",attrs:{prop:"hour"}},[null!==(t=y.timeType[y.cycleTime])&&void 0!==t&&t.showHour?i(a,{staticClass:"mr-4x ml-8x",attrs:{width:"10rem",textType:"小时",max:"23",min:"0",type:"number"},model:{value:y.timeForm.hour,callback:function(e){r.$set(y.timeForm,"hour",e)},expression:"timeForm.hour"}}):r._e()],1),i(m,{staticClass:"el-form-item-item",attrs:{prop:"minute"}},[null!==(l=y.timeType[y.cycleTime])&&void 0!==l&&l.showMinute?i(a,{staticClass:"mr-4x ml-8x",attrs:{width:"10rem",textType:"分钟",max:"59",min:"0",type:"number"},model:{value:y.timeForm.minute,callback:function(e){r.$set(y.timeForm,"minute",e)},expression:"timeForm.minute"}}):r._e()],1)]],2)]),r.isCronTab&&!y.isRelease?i(m,{staticClass:"!mt-0",attrs:{label:" "}},[i("div",{staticClass:"flex items-center"},[i(s,{attrs:{disabled:r.isEdit},model:{value:y.noticeForm.flock,callback:function(e){r.$set(y.noticeForm,"flock",e)},expression:"noticeForm.flock"}},[r._v(" 开启进程锁")]),i(o,{attrs:{placement:"right-start",width:"440","popper-class":"white-tips-popover",trigger:"hover",content:""}},[i("div",{staticClass:"p-12x"},[i("span",{staticClass:"text-[#666]"},[r._v(" 在同一时间内只用一个进程在执行，若上一个进程未执行结束，下一次不执行 ")])]),i("i",{staticClass:"el-icon-question text-warning ml-12x",attrs:{slot:"reference"},slot:"reference"})])],1)]):r._e()],1),r.showNotice?i(m,{attrs:{label:"备份提醒",prop:"notice"}},[i("div",{staticClass:"flex items-center"},[i(v,{staticClass:"w-[20rem]",attrs:{options:y.noticeOptions,change:y.handleChange},model:{value:y.noticeForm.notice,callback:function(e){r.$set(y.noticeForm,"notice",e)},expression:"noticeForm.notice"}}),i(m,{directives:[{name:"show",rawName:"v-show",value:1===y.noticeForm.notice,expression:"noticeForm.notice === 1"}],attrs:{label:"消息通道"}},[i(p,{attrs:{needAll:r.needAll},on:{change:y.onGiveSelect},model:{value:y.noticeForm.noticeChannel,callback:function(e){r.$set(y.noticeForm,"noticeChannel",e)},expression:"noticeForm.noticeChannel"}})],1),y.isRelease?r._e():i(m,{directives:[{name:"show",rawName:"v-show",value:r.showKeyword&&1===y.noticeForm.notice,expression:"showKeyword && noticeForm.notice === 1"}],staticClass:"!mt-0",attrs:{label:"关键词匹配"}},[i("div",{staticClass:"flex items-center"},[i(o,{attrs:{placement:"top-start",width:"290","popper-class":"white-tips-popover",trigger:"focus",content:""}},[i("div",{staticClass:"p-12x"},[i("div",[r._v(" 1、在shell程序中不要"),i("span",{staticClass:"text-danger"},[r._v("中断")]),r._v("执行如（exit等） ")]),i("div",[r._v(" 2、输出"),i("span",{staticClass:"text-danger"},[r._v("关键词")]),r._v("（建议5位且程序中不会出现） ")]),i("div",[r._v("3、匹配到关键词"),i("span",{staticClass:"text-danger"},[r._v("发送告警")])])]),i(a,{staticClass:"mr-4x",attrs:{slot:"reference",disabled:r.isEdit,width:"16rem",placeholder:"请输入关键词",type:"text"},slot:"reference",model:{value:y.noticeForm.keyword,callback:function(e){r.$set(y.noticeForm,"keyword",e)},expression:"noticeForm.keyword"}})],1)],1)])],1)]):r._e()],1)],1)}),[],!1,null,"a00a6be7",null,null).exports)}}}));