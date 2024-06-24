!function(){function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */t=function(){return n};var r,n={},a=Object.prototype,o=a.hasOwnProperty,i=Object.defineProperty||function(e,t,r){e[t]=r.value},c="function"==typeof Symbol?Symbol:{},l=c.iterator||"@@iterator",u=c.asyncIterator||"@@asyncIterator",s=c.toStringTag||"@@toStringTag";function f(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{f({},"")}catch(r){f=function(e,t,r){return e[t]=r}}function h(e,t,r,n){var a=t&&t.prototype instanceof g?t:g,o=Object.create(a.prototype),c=new N(n||[]);return i(o,"_invoke",{value:j(e,r,c)}),o}function p(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}n.wrap=h;var v="suspendedStart",b="suspendedYield",d="executing",m="completed",y={};function g(){}function x(){}function w(){}var _={};f(_,l,(function(){return this}));var S=Object.getPrototypeOf,k=S&&S(S(F([])));k&&k!==a&&o.call(k,l)&&(_=k);var O=w.prototype=g.prototype=Object.create(_);function C(e){["next","throw","return"].forEach((function(t){f(e,t,(function(e){return this._invoke(t,e)}))}))}function T(t,r){function n(a,i,c,l){var u=p(t[a],t,i);if("throw"!==u.type){var s=u.arg,f=s.value;return f&&"object"==e(f)&&o.call(f,"__await")?r.resolve(f.__await).then((function(e){n("next",e,c,l)}),(function(e){n("throw",e,c,l)})):r.resolve(f).then((function(e){s.value=e,c(s)}),(function(e){return n("throw",e,c,l)}))}l(u.arg)}var a;i(this,"_invoke",{value:function(e,t){function o(){return new r((function(r,a){n(e,t,r,a)}))}return a=a?a.then(o,o):o()}})}function j(e,t,n){var a=v;return function(o,i){if(a===d)throw new Error("Generator is already running");if(a===m){if("throw"===o)throw i;return{value:r,done:!0}}for(n.method=o,n.arg=i;;){var c=n.delegate;if(c){var l=E(c,n);if(l){if(l===y)continue;return l}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(a===v)throw a=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);a=d;var u=p(e,t,n);if("normal"===u.type){if(a=n.done?m:b,u.arg===y)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(a=m,n.method="throw",n.arg=u.arg)}}}function E(e,t){var n=t.method,a=e.iterator[n];if(a===r)return t.delegate=null,"throw"===n&&e.iterator.return&&(t.method="return",t.arg=r,E(e,t),"throw"===t.method)||"return"!==n&&(t.method="throw",t.arg=new TypeError("The iterator does not provide a '"+n+"' method")),y;var o=p(a,e.iterator,t.arg);if("throw"===o.type)return t.method="throw",t.arg=o.arg,t.delegate=null,y;var i=o.arg;return i?i.done?(t[e.resultName]=i.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=r),t.delegate=null,y):i:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,y)}function L(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function P(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function N(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(L,this),this.reset(!0)}function F(t){if(t||""===t){var n=t[l];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var a=-1,i=function e(){for(;++a<t.length;)if(o.call(t,a))return e.value=t[a],e.done=!1,e;return e.value=r,e.done=!0,e};return i.next=i}}throw new TypeError(e(t)+" is not iterable")}return x.prototype=w,i(O,"constructor",{value:w,configurable:!0}),i(w,"constructor",{value:x,configurable:!0}),x.displayName=f(w,s,"GeneratorFunction"),n.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===x||"GeneratorFunction"===(t.displayName||t.name))},n.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,w):(e.__proto__=w,f(e,s,"GeneratorFunction")),e.prototype=Object.create(O),e},n.awrap=function(e){return{__await:e}},C(T.prototype),f(T.prototype,u,(function(){return this})),n.AsyncIterator=T,n.async=function(e,t,r,a,o){void 0===o&&(o=Promise);var i=new T(h(e,t,r,a),o);return n.isGeneratorFunction(t)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},C(O),f(O,s,"Generator"),f(O,l,(function(){return this})),f(O,"toString",(function(){return"[object Generator]"})),n.keys=function(e){var t=Object(e),r=[];for(var n in t)r.push(n);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},n.values=F,N.prototype={constructor:N,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(P),!e)for(var t in this)"t"===t.charAt(0)&&o.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=r)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function n(n,a){return c.type="throw",c.arg=e,t.next=n,a&&(t.method="next",t.arg=r),!!a}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var l=o.call(i,"catchLoc"),u=o.call(i,"finallyLoc");if(l&&u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(l){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&o.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var a=n;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=e,i.arg=t,a?(this.method="next",this.next=a.finallyLoc,y):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),y},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),P(r),y}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var a=n.arg;P(r)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,n){return this.delegate={iterator:F(e),resultName:t,nextLoc:n},"next"===this.method&&(this.arg=r),y}},n}function r(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function n(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(t,r,n){var a;return a=function(t,r){if("object"!=e(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var a=n.call(t,r||"default");if("object"!=e(a))return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(r,"string"),(r="symbol"==e(a)?a:String(a))in t?Object.defineProperty(t,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[r]=n,t}function o(e,t,r,n,a,o,i){try{var c=e[o](i),l=c.value}catch(u){return void r(u)}c.done?t(l):Promise.resolve(l).then(n,a)}function i(e){return function(){var t=this,r=arguments;return new Promise((function(n,a){var i=e.apply(t,r);function c(e){o(i,n,a,c,l,"next",e)}function l(e){o(i,n,a,c,l,"throw",e)}c(void 0)}))}}System.register(["./element-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./progress-legacy.js?v=1714377894636","./index-legacy39.js?v=1714377894636","./vue-lib-legacy.js?v=1714377894636","./select-legacy.js?v=1714377894636"],(function(e,r){"use strict";var a,o,c,l,u,s,f,h,p,v,b,d,m,y,g,x,w,_,S;return{setters:[function(e){a=e.F,o=e.q,c=e.s},function(e){l=e.n,u=e.b,s=e.r,f=e.D,h=e.q},null,function(e){p=e._},function(e){v=e.e,b=e.H,d=e.b,m=e.f,y=e.w,g=e.c,x=e.v,w=e.h,_=e.l,S=e.j},null],execute:function(){var r=v({__name:"index",props:{batchStatus:{default:0},describe:{default:function(){return{title:"",th:"",message:"",propsValue:""}}},isRecurrence:{type:Boolean,default:!1},visible:{type:Boolean,default:!1},type:{default:""},data:{default:function(){return[]}},batch:{default:function(){return{}}},tableDisplayConfig:{default:function(){return{label:"操作结果",prop:"status",render:function(e){return b("span",{class:e.status?1===e.status?"text-primary":"text-danger":"text-warning"},function(){switch(e.status){case 0:return"等待执行";case 1:return"已完成";case 2:return"操作失败"}return"-"}())}}}}},emits:["update:visible","confirm","cancel","complete"],setup:function(e,r){var a=r.emit,o=e,c=d(),l=d(o.visible),u=d(!0),s=d(JSON.parse(JSON.stringify(o.data))),f=d(o.describe.title),h=d(o.describe.message),p=d(o.describe.th),v=d(o.describe.propsValue),b=d(o.type),x=d(0),w=d(0),_=d(o.data.length),S=d([{label:p,prop:v,width:250},o.tableDisplayConfig]),k=d(!1);m((function(){return l.value}),(function(e){a("update:visible",e)})),m((function(){return x.value}),(function(e){0===e?c.value.showFooterFun(!0):c.value.showFooterFun(!1)})),y((function(){if(o.data.length&&(s.value=JSON.parse(JSON.stringify(o.data)),_.value=o.data.length,2===x.value&&k.value)){w.value=0;for(var e=0;e<s.value.length;e++)1===s.value[e].status&&w.value++;h.value="".concat(f.value,"已完成，共").concat(_.value,"个任务，成功").concat(w.value,"个，失败").concat(_.value-w.value,"个。")}})),m((function(){return o.visible}),(function(e){l.value=e,e&&(f.value=o.describe.title,h.value=o.describe.message,p.value=o.describe.th,v.value=o.describe.propsValue?o.describe.propsValue:"name",b.value=o.type)}));var O=g((function(){var e=Number(w.value/_.value)||0;return Number((100*e).toFixed(0))})),C=function(){var e=i(t().mark((function e(){var r,i,c=arguments;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=c.length>0&&void 0!==c[0]?c[0]:0,i=null,!o.isRecurrence){e.next=25;break}if(r!==s.value.length){e.next=8;break}return x.value=2,h.value="".concat(f.value,"已完成，共").concat(_.value,"个任务，成功").concat(w.value,"个，失败").concat(_.value-w.value,"个。"),a("complete",s.value),e.abrupt("return");case 8:return e.prev=8,e.next=11,o.batch(b.value,s.value[r]);case 11:i=e.sent,w.value++,e.next=18;break;case 15:e.prev=15,e.t0=e.catch(8),i=!1;case 18:return e.prev=18,s.value.splice(r,1,n(n({},s.value[r]),{},{status:i?1:2})),e.next=22,C(r+1);case 22:return e.finish(18);case 23:e.next=28;break;case 25:return e.next=27,o.batch(b.value,s.value);case 27:x.value=2;case 28:case"end":return e.stop()}}),e,null,[[8,15,18,23]])})));return function(){return e.apply(this,arguments)}}();return{__sfc:!0,props:o,emits:a,popup:c,show:l,showFooter:u,list:s,batchTitle:f,batchMsg:h,batchTh:p,batchProps:v,batchType:b,batchStatus:x,batchCompletedTaskNumber:w,batchTaskNumber:_,tableColumn:S,isResult:k,bathRate:O,onConfirm:function(){2===x.value?c.value.close():(x.value=1,C())},onCancel:function(){a("cancel")},onOpen:function(){x.value=0!==o.batchStatus?o.batchStatus:0,w.value=0,2===x.value&&(k.value=!0)},batchRequest:C}}}),k=e("a",l(r,(function(){var e=this,t=e._self._c,r=e._self._setupProxy;return t(u,{ref:"popup",attrs:{title:r.batchTitle,area:40,visible:r.show,"show-footer":!0},on:{"update:visible":function(e){r.show=e},open:r.onOpen,confirm:r.onConfirm,cancel:r.onCancel}},[1!==r.batchStatus?[t("div",{staticClass:"flex py-[3.2rem] px-[2.4rem] flex-col"},[t("div",{staticClass:"flex items-center mb-20x"},[t("i",{staticClass:"text-[4rem]",class:0===r.batchStatus?"el-icon-warning text-warning":"el-icon-success text-primary"}),t("div",{staticClass:"pl-2x text-[1.5rem] leading-8 ml-4x"},[e._v(" "+e._s(r.batchMsg)+" ")])]),t(p,{ref:"batchTable",attrs:{column:r.tableColumn,data:r.list,"max-height":170}})],1)]:[t("div",{staticClass:"fle flex-col p-[3rem]"},[t("div",{staticClass:"mb-16x text-[1.4rem]"},[t("span",{staticClass:"mr-4x"},[e._v("正在"+e._s(r.props.describe.title)+"，当前进度:")]),t("span",[e._v(e._s(r.batchCompletedTaskNumber)+"/"+e._s(r.batchTaskNumber))])]),t(a,{staticClass:"bath-progress",attrs:{"text-inside":!0,"stroke-width":24,percentage:r.bathRate,status:"success"}})],1)]],2)}),[],!1,null,null,null,null).exports),O=v({__name:"index",props:{data:{default:function(){return[]}},batchFn:null,config:{default:function(){return{isRecurrence:!1,describe:{th:"表头",title:"批量操作",message:"确定要批量操作吗？"},tableDisplayConfig:{label:"表头",prop:"prop",render:function(e){return b("span",{class:e.status?1===e.status?"text-primary":"text-danger":"text-warning"},function(){switch(!0===e.status&&(e.status=1),e.status){case 0:return"等待执行";case 1:return"已完成";case 2:return"操作失败"}return"-"}())}}}}}},emits:["handle-select","handle-change","handle-batch","handle-complete","batch"],setup:function(e,r){var n=r.emit,a=e,o=S().proxy,c=x({list:[],num:0,limit:0}),l=d({tableSelectNumber:0}),u=d(""),s=d(!(c.num>0)),f=d(!1),h=d(!1),p=d(!1),v=d(!1),b=d(0),y=d(!1);m((function(){return l.value.tableSelectNumber}),(function(e){c.num=e,c.list=l.value.tableSelectList,c.limit=l.value.tablselimit,0===e?(h.value=!1,f.value=!1,u.value=""):e===c.limit?(h.value=!0,f.value=!1):f.value=e>0&&e<c.limit,s.value=!(e>0)}));var g=function(){clearTimeout(b.value),p.value=!0,b.value=setTimeout((function(){p.value=!1}),2e3)},k=function(){return new Promise((function(e){o.$parent.$children.length>0&&o.$parent.$children.forEach((function(t){(null==t?void 0:t._vnode.tag.indexOf("ElTable"))>-1&&e(t)}))}))},O=function(){var e=i(t().mark((function e(r){var n,a;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,k();case 2:n=e.sent,a=n.$children[0],r?a.toggleAllSelection():a.clearSelection(),r||(u.value="");case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return w((function(){_(i(t().mark((function e(){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,k();case 2:l.value=e.sent;case 3:case"end":return e.stop()}}),e)}))))})),{__sfc:!0,props:a,vm:o,emits:n,tableSelect:c,table:l,batchSelect:u,disabled:s,isIndeterminate:f,checkbox:h,batchTips:p,batchCheckboxTips:v,batchTipsTimeout:b,batchVisible:y,showCheckboxTips:g,showBatchTips:function(){s.value&&(clearTimeout(b.value),v.value=!0,b.value=setTimeout((function(){v.value=!1}),2e3))},getTableData:k,handleChange:O,handleSelect:function(e){n("handle-select",e),e||(u.value="")},handleBatch:function(){""!==u.value?(a.data.forEach((function(e){if(e.value===u.value){if(e.diyBatch)return n("handle-batch",u.value),void e.diyBatch();y.value=!e.isRefBatch&&!y.value}})),n("handle-batch",u.value)):g()},handleComplete:function(e){n("handle-complete",e,e.length)}}}});e("_",l(O,(function(){var e=this,t=e._self._c,r=e._self._setupProxy;return t("div",{staticClass:"flex items-center"},[t(s,{attrs:{trigger:"manual","popper-class":"popper-danger",placement:"top-start",content:"请选择需要批量操作的数据!"},scopedSlots:e._u([{key:"reference",fn:function(){return[t(f,{staticClass:"px-[1.1rem]",attrs:{indeterminate:r.isIndeterminate},on:{change:r.handleChange},model:{value:r.checkbox,callback:function(e){r.checkbox=e},expression:"checkbox"}})]},proxy:!0}]),model:{value:r.batchCheckboxTips,callback:function(e){r.batchCheckboxTips=e},expression:"batchCheckboxTips"}}),t("div",{staticClass:"flex relative items-center",on:{click:r.showBatchTips}},[t("div",{staticClass:"absolute w-full h-full z-999 cursor-not-allowed",class:r.disabled?"":"hidden"}),t(s,{attrs:{trigger:"manual","popper-class":"popper-danger",placement:"top-start",content:"请选择需要批量操作的类型!"},scopedSlots:e._u([{key:"reference",fn:function(){return[t(o,{staticClass:"mr-2 w-52",attrs:{placeholder:"请选择批量操作",disabled:r.disabled},on:{change:r.handleSelect},model:{value:r.batchSelect,callback:function(e){r.batchSelect=e},expression:"batchSelect"}},e._l(e.data,(function(e){return t(c,{key:e.value,attrs:{label:e.label,value:e.value}})})),1)]},proxy:!0}]),model:{value:r.batchTips,callback:function(e){r.batchTips=e},expression:"batchTips"}}),t(h,{staticClass:"h-[3rem]",attrs:{disabled:r.disabled},on:{click:r.handleBatch}},[e._v(" 批量操作 "+e._s(r.disabled?"":"(已选中"+r.tableSelect.num+"项)")+" ")])],1),t(k,{attrs:{"is-recurrence":r.props.config.isRecurrence,visible:r.batchVisible,describe:r.props.config.describe,data:r.tableSelect.list,type:r.batchSelect,"table-display-config":r.props.config.tableDisplayConfig,batch:r.props.batchFn},on:{"update:visible":function(e){r.batchVisible=e},complete:r.handleComplete}})],1)}),[],!1,null,null,null,null).exports)}}}))}();