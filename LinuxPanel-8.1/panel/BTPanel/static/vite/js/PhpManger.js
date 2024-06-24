import{a2 as e,n as t,D as n,q as o}from"./main.js?v=1714377894636";import{Z as s,d as i,c as r,a,q as l,s as c,w as u,x as p,o as d}from"./element-lib.js?v=1714377894636";import{_ as h}from"./index46.js?v=1714377894636";import{_ as m}from"./index85.js?v=1714377894636";import{_ as f}from"./index118.js?v=1714377894636";import{e as v,b,j as x,v as y,w as g,h as _}from"./vue-lib.js?v=1714377894636";import{g as S}from"./__commonjsHelpers__.js?v=1714377894636";import{X as C,Y as M,Z as k,_ as w,$,a0 as P,b as I}from"./mysql.store.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./index.vue_vue_type_style_index_0_lang.js?v=1714377894636";import"./check.js?v=1714377894636";const E=t(v({__name:"PhpMyAdmin",setup(t){const{proxy:n}=x(),o=b([{text:"面板访问需要登录面板后，才能通过面板访问phpMyAdmin"},{text:"若通过面板为phpMyAdmin开启了密码访问，请使用【通过公共访问】"},{text:"关闭公共访问权限可提升安全性，可到软件商店->phpMyAdmin中关闭",color:"text-danger"}]);return{__sfc:!0,vm:n,phpHelpList:o,goPhpAdmin:async t=>{try{const o=await e({sName:"phpmyadmin"});if("panel"===t){if(o.data.ext.auth)return void n.$message.error("当前phpMyAdmin已开启密码访问，请使用【通过公共访问");if("false"===o.data.setup)return void n.$message.error("当前phpMyAdmin未安装，请先安装phpMyAdmin");window.open("/phpmyadmin/index.php?lang=zh_cn")}else o.status?window.open(o.data.ext.url):n.$message.error("未开启公共访问权限，请开启后再访问")}catch(o){}}}}}),(function(){var e=this,t=e._self._c,n=e._self._setupProxy;return t("div",{staticClass:"p-16x"},[t("div",{staticClass:"flex items-center w-full mb-16x"},[t("div",{staticClass:"relative w-[14rem] bg-#e6e6e6 h-[4.2rem] mr-24x rounded-2x"},[t("div",{staticClass:"h-[4rem] leading-[4rem] text-center w-full cursor-pointer link-hover",on:{click:function(e){return n.goPhpAdmin("panel")}}},[e._v(" 通过面板访问 ")]),t("span",{staticClass:"bg-contain inline-block recommend-bg absolute -top-[0.1rem] -left-[0.1rem]"})]),t("div",{staticClass:"relative w-[14rem] bg-#e6e6e6 h-[4.2rem] rounded-2x"},[t("div",{staticClass:"h-[4rem] leading-[4rem] text-center w-full cursor-pointer link-hover",on:{click:function(e){return n.goPhpAdmin()}}},[e._v(" 通过公共访问 ")])])]),t(f,{staticClass:"ml-20x",attrs:{list:n.phpHelpList,"list-style":"disc"}})],1)}),[],!1,null,"8a6bac58",null,null).exports;var j={exports:{}};const O=S(j.exports=function(e){var t={};function n(o){if(t[o])return t[o].exports;var s=t[o]={i:o,l:!1,exports:{}};return e[o].call(s.exports,s,s.exports,n),s.l=!0,s.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)n.d(o,s,function(t){return e[t]}.bind(null,s));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/dist/",n(n.s=85)}({0:function(e,t,n){function o(e,t,n,o,s,i,r,a){var l,c="function"==typeof e?e.options:e;if(t&&(c.render=t,c.staticRenderFns=n,c._compiled=!0),o&&(c.functional=!0),i&&(c._scopeId="data-v-"+i),r?(l=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),s&&s.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(r)},c._ssrRegister=l):s&&(l=a?function(){s.call(this,this.$root.$options.shadowRoot)}:s),l)if(c.functional){c._injectStyles=l;var u=c.render;c.render=function(e,t){return l.call(t),u(e,t)}}else{var p=c.beforeCreate;c.beforeCreate=p?[].concat(p,l):[l]}return{exports:e,options:c}}n.d(t,"a",(function(){return o}))},29:function(e,t){e.exports=s},37:function(e,t,n){t.a={inject:["rootMenu"],computed:{indexPath:function(){for(var e=[this.index],t=this.$parent;"ElMenu"!==t.$options.componentName;)t.index&&e.unshift(t.index),t=t.$parent;return e},parentMenu:function(){for(var e=this.$parent;e&&-1===["ElMenu","ElSubmenu"].indexOf(e.$options.componentName);)e=e.$parent;return e},paddingStyle:function(){if("vertical"!==this.rootMenu.mode)return{};var e=20,t=this.$parent;if(this.rootMenu.collapse)e=20;else for(;t&&"ElMenu"!==t.$options.componentName;)"ElSubmenu"===t.$options.componentName&&(e+=20),t=t.$parent;return{paddingLeft:e+"px"}}}}},4:function(e,t){e.exports=i()},85:function(e,t,n){n.r(t);var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("li",{staticClass:"el-menu-item",class:{"is-active":e.active,"is-disabled":e.disabled},style:[e.paddingStyle,e.itemStyle,{backgroundColor:e.backgroundColor}],attrs:{role:"menuitem",tabindex:"-1"},on:{click:e.handleClick,mouseenter:e.onMouseEnter,focus:e.onMouseEnter,blur:e.onMouseLeave,mouseleave:e.onMouseLeave}},["ElMenu"===e.parentMenu.$options.componentName&&e.rootMenu.collapse&&e.$slots.title?n("el-tooltip",{attrs:{effect:"dark",placement:"right"}},[n("div",{attrs:{slot:"content"},slot:"content"},[e._t("title")],2),n("div",{staticStyle:{position:"absolute",left:"0",top:"0",height:"100%",width:"100%",display:"inline-block","box-sizing":"border-box",padding:"0 20px"}},[e._t("default")],2)]):[e._t("default"),e._t("title")]],2)};o._withStripped=!0;var s=n(37),i=n(29),r=n.n(i),a=n(4),l=n.n(a),c={name:"ElMenuItem",componentName:"ElMenuItem",mixins:[s.a,l.a],components:{ElTooltip:r.a},props:{index:{default:null,validator:function(e){return"string"==typeof e||null===e}},route:[String,Object],disabled:Boolean},computed:{active:function(){return this.index===this.rootMenu.activeIndex},hoverBackground:function(){return this.rootMenu.hoverBackground},backgroundColor:function(){return this.rootMenu.backgroundColor||""},activeTextColor:function(){return this.rootMenu.activeTextColor||""},textColor:function(){return this.rootMenu.textColor||""},mode:function(){return this.rootMenu.mode},itemStyle:function(){var e={color:this.active?this.activeTextColor:this.textColor};return"horizontal"!==this.mode||this.isNested||(e.borderBottomColor=this.active?this.rootMenu.activeTextColor?this.activeTextColor:"":"transparent"),e},isNested:function(){return this.parentMenu!==this.rootMenu}},methods:{onMouseEnter:function(){("horizontal"!==this.mode||this.rootMenu.backgroundColor)&&(this.$el.style.backgroundColor=this.hoverBackground)},onMouseLeave:function(){("horizontal"!==this.mode||this.rootMenu.backgroundColor)&&(this.$el.style.backgroundColor=this.backgroundColor)},handleClick:function(){this.disabled||(this.dispatch("ElMenu","item-click",this),this.$emit("click",this))}},mounted:function(){this.parentMenu.addItem(this),this.rootMenu.addItem(this)},beforeDestroy:function(){this.parentMenu.removeItem(this),this.rootMenu.removeItem(this)}},u=n(0),p=Object(u.a)(c,o,[],!1,null,null,null);p.options.__file="packages/menu/src/menu-item.vue";var d=p.exports;d.install=function(e){e.component(d.name,d)},t.default=d}}));var F={exports:{}};const L=S(F.exports=function(e){var t={};function n(o){if(t[o])return t[o].exports;var s=t[o]={i:o,l:!1,exports:{}};return e[o].call(s.exports,s,s.exports,n),s.l=!0,s.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)n.d(o,s,function(t){return e[t]}.bind(null,s));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/dist/",n(n.s=72)}({0:function(e,t,n){function o(e,t,n,o,s,i,r,a){var l,c="function"==typeof e?e.options:e;if(t&&(c.render=t,c.staticRenderFns=n,c._compiled=!0),o&&(c.functional=!0),i&&(c._scopeId="data-v-"+i),r?(l=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),s&&s.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(r)},c._ssrRegister=l):s&&(l=a?function(){s.call(this,this.$root.$options.shadowRoot)}:s),l)if(c.functional){c._injectStyles=l;var u=c.render;c.render=function(e,t){return l.call(t),u(e,t)}}else{var p=c.beforeCreate;c.beforeCreate=p?[].concat(p,l):[l]}return{exports:e,options:c}}n.d(t,"a",(function(){return o}))},11:function(e,t){e.exports=r()},2:function(e,t){e.exports=a()},4:function(e,t){e.exports=i()},72:function(e,t,n){n.r(t);var o=n(4),s=n.n(o),i=n(11),r=n.n(i),a=a||{};a.Utils=a.Utils||{},a.Utils.focusFirstDescendant=function(e){for(var t=0;t<e.childNodes.length;t++){var n=e.childNodes[t];if(a.Utils.attemptFocus(n)||a.Utils.focusFirstDescendant(n))return!0}return!1},a.Utils.focusLastDescendant=function(e){for(var t=e.childNodes.length-1;t>=0;t--){var n=e.childNodes[t];if(a.Utils.attemptFocus(n)||a.Utils.focusLastDescendant(n))return!0}return!1},a.Utils.attemptFocus=function(e){if(!a.Utils.isFocusable(e))return!1;a.Utils.IgnoreUtilFocusChanges=!0;try{e.focus()}catch(t){}return a.Utils.IgnoreUtilFocusChanges=!1,document.activeElement===e},a.Utils.isFocusable=function(e){if(e.tabIndex>0||0===e.tabIndex&&null!==e.getAttribute("tabIndex"))return!0;if(e.disabled)return!1;switch(e.nodeName){case"A":return!!e.href&&"ignore"!==e.rel;case"INPUT":return"hidden"!==e.type&&"file"!==e.type;case"BUTTON":case"SELECT":case"TEXTAREA":return!0;default:return!1}},a.Utils.triggerEvent=function(e,t){var n=void 0;n=/^mouse|click/.test(t)?"MouseEvents":/^key/.test(t)?"KeyboardEvent":"HTMLEvents";for(var o=document.createEvent(n),s=arguments.length,i=Array(s>2?s-2:0),r=2;r<s;r++)i[r-2]=arguments[r];return o.initEvent.apply(o,[t].concat(i)),e.dispatchEvent?e.dispatchEvent(o):e.fireEvent("on"+t,o),e},a.Utils.keys={tab:9,enter:13,space:32,left:37,up:38,right:39,down:40,esc:27};var l=a.Utils,c=function(e,t){this.domNode=t,this.parent=e,this.subMenuItems=[],this.subIndex=0,this.init()};c.prototype.init=function(){this.subMenuItems=this.domNode.querySelectorAll("li"),this.addListeners()},c.prototype.gotoSubIndex=function(e){e===this.subMenuItems.length?e=0:e<0&&(e=this.subMenuItems.length-1),this.subMenuItems[e].focus(),this.subIndex=e},c.prototype.addListeners=function(){var e=this,t=l.keys,n=this.parent.domNode;Array.prototype.forEach.call(this.subMenuItems,(function(o){o.addEventListener("keydown",(function(o){var s=!1;switch(o.keyCode){case t.down:e.gotoSubIndex(e.subIndex+1),s=!0;break;case t.up:e.gotoSubIndex(e.subIndex-1),s=!0;break;case t.tab:l.triggerEvent(n,"mouseleave");break;case t.enter:case t.space:s=!0,o.currentTarget.click()}return s&&(o.preventDefault(),o.stopPropagation()),!1}))}))};var u=c,p=function(e){this.domNode=e,this.submenu=null,this.init()};p.prototype.init=function(){this.domNode.setAttribute("tabindex","0");var e=this.domNode.querySelector(".el-menu");e&&(this.submenu=new u(this,e)),this.addListeners()},p.prototype.addListeners=function(){var e=this,t=l.keys;this.domNode.addEventListener("keydown",(function(n){var o=!1;switch(n.keyCode){case t.down:l.triggerEvent(n.currentTarget,"mouseenter"),e.submenu&&e.submenu.gotoSubIndex(0),o=!0;break;case t.up:l.triggerEvent(n.currentTarget,"mouseenter"),e.submenu&&e.submenu.gotoSubIndex(e.submenu.subMenuItems.length-1),o=!0;break;case t.tab:l.triggerEvent(n.currentTarget,"mouseleave");break;case t.enter:case t.space:o=!0,n.currentTarget.click()}o&&n.preventDefault()}))};var d=p,h=function(e){this.domNode=e,this.init()};h.prototype.init=function(){var e=this.domNode.childNodes;[].filter.call(e,(function(e){return 1===e.nodeType})).forEach((function(e){new d(e)}))};var m=h,f=n(2),v={name:"ElMenu",render:function(e){var t=e("ul",{attrs:{role:"menubar"},key:+this.collapse,style:{backgroundColor:this.backgroundColor||""},class:{"el-menu--horizontal":"horizontal"===this.mode,"el-menu--collapse":this.collapse,"el-menu":!0}},[this.$slots.default]);return this.collapseTransition?e("el-menu-collapse-transition",[t]):t},componentName:"ElMenu",mixins:[s.a,r.a],provide:function(){return{rootMenu:this}},components:{"el-menu-collapse-transition":{functional:!0,render:function(e,t){return e("transition",{props:{mode:"out-in"},on:{beforeEnter:function(e){e.style.opacity=.2},enter:function(e){Object(f.addClass)(e,"el-opacity-transition"),e.style.opacity=1},afterEnter:function(e){Object(f.removeClass)(e,"el-opacity-transition"),e.style.opacity=""},beforeLeave:function(e){e.dataset||(e.dataset={}),Object(f.hasClass)(e,"el-menu--collapse")?(Object(f.removeClass)(e,"el-menu--collapse"),e.dataset.oldOverflow=e.style.overflow,e.dataset.scrollWidth=e.clientWidth,Object(f.addClass)(e,"el-menu--collapse")):(Object(f.addClass)(e,"el-menu--collapse"),e.dataset.oldOverflow=e.style.overflow,e.dataset.scrollWidth=e.clientWidth,Object(f.removeClass)(e,"el-menu--collapse")),e.style.width=e.scrollWidth+"px",e.style.overflow="hidden"},leave:function(e){Object(f.addClass)(e,"horizontal-collapse-transition"),e.style.width=e.dataset.scrollWidth+"px"}}},t.children)}}},props:{mode:{type:String,default:"vertical"},defaultActive:{type:String,default:""},defaultOpeneds:Array,uniqueOpened:Boolean,router:Boolean,menuTrigger:{type:String,default:"hover"},collapse:Boolean,backgroundColor:String,textColor:String,activeTextColor:String,collapseTransition:{type:Boolean,default:!0}},data:function(){return{activeIndex:this.defaultActive,openedMenus:this.defaultOpeneds&&!this.collapse?this.defaultOpeneds.slice(0):[],items:{},submenus:{}}},computed:{hoverBackground:function(){return this.backgroundColor?this.mixColor(this.backgroundColor,.2):""},isMenuPopup:function(){return"horizontal"===this.mode||"vertical"===this.mode&&this.collapse}},watch:{defaultActive:function(e){this.items[e]||(this.activeIndex=null),this.updateActiveIndex(e)},defaultOpeneds:function(e){this.collapse||(this.openedMenus=e)},collapse:function(e){e&&(this.openedMenus=[]),this.broadcast("ElSubmenu","toggle-collapse",e)}},methods:{updateActiveIndex:function(e){var t=this.items[e]||this.items[this.activeIndex]||this.items[this.defaultActive];t?(this.activeIndex=t.index,this.initOpenedMenu()):this.activeIndex=null},getMigratingConfig:function(){return{props:{theme:"theme is removed."}}},getColorChannels:function(e){if(e=e.replace("#",""),/^[0-9a-fA-F]{3}$/.test(e)){e=e.split("");for(var t=2;t>=0;t--)e.splice(t,0,e[t]);e=e.join("")}return/^[0-9a-fA-F]{6}$/.test(e)?{red:parseInt(e.slice(0,2),16),green:parseInt(e.slice(2,4),16),blue:parseInt(e.slice(4,6),16)}:{red:255,green:255,blue:255}},mixColor:function(e,t){var n=this.getColorChannels(e),o=n.red,s=n.green,i=n.blue;return t>0?(o*=1-t,s*=1-t,i*=1-t):(o+=(255-o)*t,s+=(255-s)*t,i+=(255-i)*t),"rgb("+Math.round(o)+", "+Math.round(s)+", "+Math.round(i)+")"},addItem:function(e){this.$set(this.items,e.index,e)},removeItem:function(e){delete this.items[e.index]},addSubmenu:function(e){this.$set(this.submenus,e.index,e)},removeSubmenu:function(e){delete this.submenus[e.index]},openMenu:function(e,t){var n=this.openedMenus;-1===n.indexOf(e)&&(this.uniqueOpened&&(this.openedMenus=n.filter((function(e){return-1!==t.indexOf(e)}))),this.openedMenus.push(e))},closeMenu:function(e){var t=this.openedMenus.indexOf(e);-1!==t&&this.openedMenus.splice(t,1)},handleSubmenuClick:function(e){var t=e.index,n=e.indexPath;-1!==this.openedMenus.indexOf(t)?(this.closeMenu(t),this.$emit("close",t,n)):(this.openMenu(t,n),this.$emit("open",t,n))},handleItemClick:function(e){var t=this,n=e.index,o=e.indexPath,s=this.activeIndex,i=null!==e.index;i&&(this.activeIndex=e.index),this.$emit("select",n,o,e),("horizontal"===this.mode||this.collapse)&&(this.openedMenus=[]),this.router&&i&&this.routeToItem(e,(function(e){t.activeIndex=s,!e||e.name}))},initOpenedMenu:function(){var e=this,t=this.activeIndex,n=this.items[t];n&&"horizontal"!==this.mode&&!this.collapse&&n.indexPath.forEach((function(t){var n=e.submenus[t];n&&e.openMenu(t,n.indexPath)}))},routeToItem:function(e,t){var n=e.route||e.index;try{this.$router.push(n,(function(){}),t)}catch(o){}},open:function(e){var t=this,n=this.submenus[e.toString()].indexPath;n.forEach((function(e){return t.openMenu(e,n)}))},close:function(e){this.closeMenu(e)}},mounted:function(){this.initOpenedMenu(),this.$on("item-click",this.handleItemClick),this.$on("submenu-click",this.handleSubmenuClick),"horizontal"===this.mode&&new m(this.$el),this.$watch("items",this.updateActiveIndex)}},b=n(0),x=Object(b.a)(v,void 0,void 0,!1,null,null,null);x.options.__file="packages/menu/src/menu.vue";var y=x.exports;y.install=function(e){e.component(y.name,y)},t.default=y}}));const T=t(v({__name:"PhpManger",props:{compData:{default:{}}},setup(e){const t=e,{proxy:n}=x(),o=b(!1),s=b([]),i=b(""),r=b("phpService"),a=y({phpPort:8888,onSSL:!0,phpSSL:"",phpPass:!0}),l=y({username:"",password:"",repass:""}),c=async()=>{try{const e=await C();s.value=e.data}catch(e){}},u=async()=>{try{const{auth:e,port:t,status:n}=await k();a.onSSL=n,a.phpSSL=t,a.phpPass=e}catch(e){}},p=async()=>{try{const{data:e}=await I({sName:"phpmyadmin"});o.value=e.status,i.value=e.ext.phpversion,a.phpPort=Number(e.ext.port)}catch(e){}};return g((()=>{"string"==typeof t.compData&&(r.value=t.compData)})),_((()=>{p()})),{__sfc:!0,vm:n,props:t,onPhpService:o,options:s,phpVersionSelect:i,defaultActive:r,phpForm:a,passForm:l,handleOpen:(e,t)=>{r.value=e,"phpService"==e?p():"phpVersion"==e?c():"phpSafety"==e&&u()},getPHPVersion:c,savePHPPass:async()=>{if(l.password.length<3||l.username.length<3)return void n.$message.error("输入的账号密码需要大于三位");if(l.password!==l.repass)return void n.$message.error("两次输入的密码不一致");let e=n.$load("正在保存密码...");try{const e=await M({...l,siteName:"phpmyadmin"});n.$message.request(e)}catch(t){}finally{e.close()}},getPhpSsl:u,setSSLPort:async()=>{let e=n.$load("正在保存SSL端口...");try{const t=await w({port:a.phpSSL});n.$message.request(t),e.close()}catch(t){}finally{e.close()}},changePHPStatus:async e=>{await n.$confirm({title:"提示",icon:"warning",width:"35rem",message:"您真的要".concat(e?"启动":"停止","phpmyadmin服务吗？")});let t=n.$load("正在"+(e?"启动":"停止")+"phpmyadmin服务...");try{const t=await $({name:"phpmyadmin",type:e?"start":"stop"});n.$message.request(t)}catch(o){}finally{t.close()}},setPhpSSL:async e=>{let t=n.$load("正在"+(e?"开启":"关闭")+"SSL...");try{const e=await P({v:a.onSSL?1:0});n.$message.request(e),u(),t&&t.close()}catch(o){}finally{t&&t.close()}},savePhpVersion:async e=>{let t;try{t=n.$load("正在调整php配置...");const o=await M(e);n.$message.request(o)}catch(o){}finally{t.close()}},onOpen:p,changePassword:async e=>{}}}}),(function(){var e=this,t=e._self._c,s=e._self._setupProxy;return t("div",{staticClass:"flex items-start"},[t("div",{staticClass:"recycle-bin-content flex h-[58rem]"},[t(L,{staticClass:"el-menu-vertical-demo w-[14rem]",attrs:{"default-active":s.defaultActive,"background-color":"#f0f0f1"},on:{select:s.handleOpen}},[t(O,{attrs:{index:"phpService"}},[t("span",[e._v("服务")])]),t(O,{attrs:{index:"phpVersion"}},[t("span",[e._v("php版本")])]),t(O,{attrs:{index:"phpSafety"}},[t("span",[e._v("安全设置")])])],1)],1),t("div",{staticClass:"recycle-type-table w-[96%] h-full"},["phpService"==s.defaultActive?t("div",[t("div",{staticClass:"php-bottom mb-12x"},[t(n,{on:{change:s.changePHPStatus},model:{value:s.onPhpService,callback:function(e){s.onPhpService=e},expression:"onPhpService"}},[e._v("启用公共访问权限")])],1),t(E)],1):e._e(),"phpVersion"==s.defaultActive?t("div",{staticClass:"p-20x"},[t("span",[e._v("php版本")]),t(l,{staticClass:"mx-12x",attrs:{placeholder:"请选择"},model:{value:s.phpVersionSelect,callback:function(e){s.phpVersionSelect=e},expression:"phpVersionSelect"}},e._l(s.options,(function(e){return t(c,{key:e.version,attrs:{label:e.name,value:e.version}})})),1),t(o,{attrs:{type:"primary"},on:{click:function(e){return s.savePhpVersion({phpversion:s.phpVersionSelect})}}},[e._v("保存")])],1):e._e(),"phpSafety"==s.defaultActive?t("div",[t("div",{staticClass:"php-bottom flex items-center"},[t("span",{staticClass:"mr-12x"},[e._v("访问端口")]),t(m,{staticClass:"!mb-0 mr-12x",attrs:{width:"14rem",type:"number"},model:{value:s.phpForm.phpPort,callback:function(t){e.$set(s.phpForm,"phpPort",t)},expression:"phpForm.phpPort"}}),t(o,{attrs:{type:"primary"},on:{click:function(e){return s.savePhpVersion({port:s.phpForm.phpPort})}}},[e._v("保存")])],1),t("div",{staticClass:"php-bottom flex flex-col"},[t("div",[t("span",{staticClass:"mr-12x"},[e._v("开启SSL")]),t(h,{attrs:{"active-color":"#20a53a","inactive-color":"#cdcdcd"},on:{change:s.setPhpSSL},model:{value:s.phpForm.onSSL,callback:function(t){e.$set(s.phpForm,"onSSL",t)},expression:"phpForm.onSSL"}})],1),t("div",[t("span",{staticClass:"mr-12x"},[e._v("SSL端口")]),t(m,{staticClass:"!mb-0 mr-12x",attrs:{width:"14rem",type:"number"},model:{value:s.phpForm.phpSSL,callback:function(t){e.$set(s.phpForm,"phpSSL",t)},expression:"phpForm.phpSSL"}}),t(o,{attrs:{type:"primary"},on:{click:s.setSSLPort}},[e._v("保存")])],1)]),t("div",{staticClass:"php-bottom flex-col"},[t("div",[t("span",{staticClass:"mr-12x"},[e._v("密码访问")]),t(h,{attrs:{"active-color":"#20a53a","inactive-color":"#cdcdcd",change:s.changePassword},model:{value:s.phpForm.phpPass,callback:function(t){e.$set(s.phpForm,"phpPass",t)},expression:"phpForm.phpPass"}})],1),t("div",[s.phpForm.phpPass?t(u,{attrs:{"label-position":"left","label-width":"60px",model:s.passForm}},[t(p,{attrs:{label:"授权账号"}},[t(d,{attrs:{placeholder:"不修改请留空"},model:{value:s.passForm.username,callback:function(t){e.$set(s.passForm,"username",t)},expression:"passForm.username"}})],1),t(p,{attrs:{label:"访问密码"}},[t(d,{attrs:{type:"password",placeholder:"不修改请留空"},model:{value:s.passForm.password,callback:function(t){e.$set(s.passForm,"password",t)},expression:"passForm.password"}})],1),t(p,{attrs:{label:"重复密码"}},[t(d,{attrs:{type:"password",placeholder:"不修改请留空"},model:{value:s.passForm.repass,callback:function(t){e.$set(s.passForm,"repass",t)},expression:"passForm.repass"}})],1),t(p,[t(o,{attrs:{type:"primary"},on:{click:s.savePHPPass}},[e._v("保存")])],1)],1):e._e()],1)])]):e._e()])])}),[],!1,null,"61da3709",null,null).exports;export{T as default};