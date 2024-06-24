import{k as e,n as t,X as n,g as i,$ as a,a8 as r,h as s,b as o}from"./element-lib.js?v=1714377894636";import{r as c}from"./index62.js?v=1714377894636";var l,u={};function h(){if(l)return u;l=1,u.__esModule=!0;var e=e||{};return e.Utils=e.Utils||{},e.Utils.focusFirstDescendant=function(t){for(var n=0;n<t.childNodes.length;n++){var i=t.childNodes[n];if(e.Utils.attemptFocus(i)||e.Utils.focusFirstDescendant(i))return!0}return!1},e.Utils.focusLastDescendant=function(t){for(var n=t.childNodes.length-1;n>=0;n--){var i=t.childNodes[n];if(e.Utils.attemptFocus(i)||e.Utils.focusLastDescendant(i))return!0}return!1},e.Utils.attemptFocus=function(t){if(!e.Utils.isFocusable(t))return!1;e.Utils.IgnoreUtilFocusChanges=!0;try{t.focus()}catch(n){}return e.Utils.IgnoreUtilFocusChanges=!1,document.activeElement===t},e.Utils.isFocusable=function(e){if(e.tabIndex>0||0===e.tabIndex&&null!==e.getAttribute("tabIndex"))return!0;if(e.disabled)return!1;switch(e.nodeName){case"A":return!!e.href&&"ignore"!==e.rel;case"INPUT":return"hidden"!==e.type&&"file"!==e.type;case"BUTTON":case"SELECT":case"TEXTAREA":return!0;default:return!1}},e.Utils.triggerEvent=function(e,t){var n=void 0;n=/^mouse|click/.test(t)?"MouseEvents":/^key/.test(t)?"KeyboardEvent":"HTMLEvents";for(var i=document.createEvent(n),a=arguments.length,r=Array(a>2?a-2:0),s=2;s<a;s++)r[s-2]=arguments[s];return i.initEvent.apply(i,[t].concat(r)),e.dispatchEvent?e.dispatchEvent(i):e.fireEvent("on"+t,i),e},e.Utils.keys={tab:9,enter:13,space:32,left:37,up:38,right:39,down:40,esc:27},u.default=e.Utils,u}var d,f={exports:{}};function p(){return d||(d=1,f.exports=function(e){var t={};function n(i){if(t[i])return t[i].exports;var a=t[i]={i:i,l:!1,exports:{}};return e[i].call(a.exports,a,a.exports,n),a.l=!0,a.exports}return n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(i,a,function(t){return e[t]}.bind(null,a));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/dist/",n(n.s=61)}({0:function(e,t,n){function i(e,t,n,i,a,r,s,o){var c,l="function"==typeof e?e.options:e;if(t&&(l.render=t,l.staticRenderFns=n,l._compiled=!0),i&&(l.functional=!0),r&&(l._scopeId="data-v-"+r),s?(c=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),a&&a.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(s)},l._ssrRegister=c):a&&(c=o?function(){a.call(this,this.$root.$options.shadowRoot)}:a),c)if(l.functional){l._injectStyles=c;var u=l.render;l.render=function(e,t){return c.call(t),u(e,t)}}else{var h=l.beforeCreate;l.beforeCreate=h?[].concat(h,c):[c]}return{exports:e,options:l}}n.d(t,"a",(function(){return i}))},15:function(t,n){t.exports=e()},18:function(e,n){e.exports=t()},21:function(e,t){e.exports=n()},26:function(e,t){e.exports=c()},3:function(e,t){e.exports=i()},31:function(e,t){e.exports=a()},41:function(e,t){e.exports=h()},52:function(e,t){e.exports=r()},6:function(e,t){e.exports=s()},61:function(e,t,n){n.r(t);var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{class:["el-cascader-panel",e.border&&"is-bordered"],on:{keydown:e.handleKeyDown}},e._l(e.menus,(function(e,t){return n("cascader-menu",{key:t,ref:"menu",refInFor:!0,attrs:{index:t,nodes:e}})})),1)};i._withStripped=!0;var a=n(26),r=n.n(a),s=n(15),o=n.n(s),c=n(18),l=n.n(c),u=n(52),h=n.n(u),d=n(3),f=function(e){return e.stopPropagation()},p={inject:["panel"],components:{ElCheckbox:l.a,ElRadio:h.a},props:{node:{required:!0},nodeId:String},computed:{config:function(){return this.panel.config},isLeaf:function(){return this.node.isLeaf},isDisabled:function(){return this.node.isDisabled},checkedValue:function(){return this.panel.checkedValue},isChecked:function(){return this.node.isSameNode(this.checkedValue)},inActivePath:function(){return this.isInPath(this.panel.activePath)},inCheckedPath:function(){var e=this;return!!this.config.checkStrictly&&this.panel.checkedNodePaths.some((function(t){return e.isInPath(t)}))},value:function(){return this.node.getValueByOption()}},methods:{handleExpand:function(){var e=this,t=this.panel,n=this.node,i=this.isDisabled,a=this.config,r=a.multiple;!a.checkStrictly&&i||n.loading||(a.lazy&&!n.loaded?t.lazyLoad(n,(function(){var t=e.isLeaf;if(t||e.handleExpand(),r){var i=!!t&&n.checked;e.handleMultiCheckChange(i)}})):t.handleExpand(n))},handleCheckChange:function(){var e=this.panel,t=this.value,n=this.node;e.handleCheckChange(t),e.handleExpand(n)},handleMultiCheckChange:function(e){this.node.doCheck(e),this.panel.calculateMultiCheckedValue()},isInPath:function(e){var t=this.node;return(e[t.level-1]||{}).uid===t.uid},renderPrefix:function(e){var t=this.isLeaf,n=this.isChecked,i=this.config,a=i.checkStrictly;return i.multiple?this.renderCheckbox(e):a?this.renderRadio(e):t&&n?this.renderCheckIcon(e):null},renderPostfix:function(e){var t=this.node,n=this.isLeaf;return t.loading?this.renderLoadingIcon(e):n?null:this.renderExpandIcon(e)},renderCheckbox:function(e){var t=this.node,n=this.config,i=this.isDisabled,a={on:{change:this.handleMultiCheckChange},nativeOn:{}};return n.checkStrictly&&(a.nativeOn.click=f),e("el-checkbox",r()([{attrs:{value:t.checked,indeterminate:t.indeterminate,disabled:i}},a]))},renderRadio:function(e){var t=this.checkedValue,n=this.value,i=this.isDisabled;return Object(d.isEqual)(n,t)&&(n=t),e("el-radio",{attrs:{value:t,label:n,disabled:i},on:{change:this.handleCheckChange},nativeOn:{click:f}},[e("span")])},renderCheckIcon:function(e){return e("i",{class:"el-icon-check el-cascader-node__prefix"})},renderLoadingIcon:function(e){return e("i",{class:"el-icon-loading el-cascader-node__postfix"})},renderExpandIcon:function(e){return e("i",{class:"el-icon-arrow-right el-cascader-node__postfix"})},renderContent:function(e){var t=this.panel,n=this.node,i=t.renderLabelFn;return e("span",{class:"el-cascader-node__label"},[(i?i({node:n,data:n.data}):null)||n.label])}},render:function(e){var t=this,n=this.inActivePath,i=this.inCheckedPath,a=this.isChecked,s=this.isLeaf,o=this.isDisabled,c=this.config,l=this.nodeId,u=c.expandTrigger,h=c.checkStrictly,d=c.multiple,f=!h&&o,p={on:{}};return"click"===u?p.on.click=this.handleExpand:(p.on.mouseenter=function(e){t.handleExpand(),t.$emit("expand",e)},p.on.focus=function(e){t.handleExpand(),t.$emit("expand",e)}),!s||o||h||d||(p.on.click=this.handleCheckChange),e("li",r()([{attrs:{role:"menuitem",id:l,"aria-expanded":n,tabindex:f?null:-1},class:{"el-cascader-node":!0,"is-selectable":h,"in-active-path":n,"in-checked-path":i,"is-active":a,"is-disabled":f}},p]),[this.renderPrefix(e),this.renderContent(e),this.renderPostfix(e)])}},v=n(0),y=Object(v.a)(p,void 0,void 0,!1,null,null,null);y.options.__file="packages/cascader-panel/src/cascader-node.vue";var g=y.exports,m=n(6),k={name:"ElCascaderMenu",mixins:[n.n(m).a],inject:["panel"],components:{ElScrollbar:o.a,CascaderNode:g},props:{nodes:{type:Array,required:!0},index:Number},data:function(){return{activeNode:null,hoverTimer:null,id:Object(d.generateId)()}},computed:{isEmpty:function(){return!this.nodes.length},menuId:function(){return"cascader-menu-"+this.id+"-"+this.index}},methods:{handleExpand:function(e){this.activeNode=e.target},handleMouseMove:function(e){var t=this.activeNode,n=this.hoverTimer,i=this.$refs.hoverZone;if(t&&i)if(t.contains(e.target)){clearTimeout(n);var a=this.$el.getBoundingClientRect().left,r=e.clientX-a,s=this.$el,o=s.offsetWidth,c=s.offsetHeight,l=t.offsetTop,u=l+t.offsetHeight;i.innerHTML='\n          <path style="pointer-events: auto;" fill="transparent" d="M'+r+" "+l+" L"+o+" 0 V"+l+' Z" />\n          <path style="pointer-events: auto;" fill="transparent" d="M'+r+" "+u+" L"+o+" "+c+" V"+u+' Z" />\n        '}else n||(this.hoverTimer=setTimeout(this.clearHoverZone,this.panel.config.hoverThreshold))},clearHoverZone:function(){var e=this.$refs.hoverZone;e&&(e.innerHTML="")},renderEmptyText:function(e){return e("div",{class:"el-cascader-menu__empty-text"},[this.t("el.cascader.noData")])},renderNodeList:function(e){var t=this.menuId,n=this.panel.isHoverMenu,i={on:{}};n&&(i.on.expand=this.handleExpand);var a=this.nodes.map((function(n,a){var s=n.hasChildren;return e("cascader-node",r()([{key:n.uid,attrs:{node:n,"node-id":t+"-"+a,"aria-haspopup":s,"aria-owns":s?t:null}},i]))}));return[].concat(a,[n?e("svg",{ref:"hoverZone",class:"el-cascader-menu__hover-zone"}):null])}},render:function(e){var t=this.isEmpty,n=this.menuId,i={nativeOn:{}};return this.panel.isHoverMenu&&(i.nativeOn.mousemove=this.handleMouseMove),e("el-scrollbar",r()([{attrs:{tag:"ul",role:"menu",id:n,"wrap-class":"el-cascader-menu__wrap","view-class":{"el-cascader-menu__list":!0,"is-empty":t}},class:"el-cascader-menu"},i]),[t?this.renderEmptyText(e):this.renderNodeList(e)])}},b=Object(v.a)(k,void 0,void 0,!1,null,null,null);b.options.__file="packages/cascader-panel/src/cascader-menu.vue";var C=b.exports,x=n(21),N=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),E=0,S=function(){function e(t,n,i){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.data=t,this.config=n,this.parent=i||null,this.level=this.parent?this.parent.level+1:1,this.uid=E++,this.initState(),this.initChildren()}return e.prototype.initState=function(){var e=this.config,t=e.value,n=e.label;this.value=this.data[t],this.label=this.data[n],this.pathNodes=this.calculatePathNodes(),this.path=this.pathNodes.map((function(e){return e.value})),this.pathLabels=this.pathNodes.map((function(e){return e.label})),this.loading=!1,this.loaded=!1},e.prototype.initChildren=function(){var t=this,n=this.config,i=n.children,a=this.data[i];this.hasChildren=Array.isArray(a),this.children=(a||[]).map((function(i){return new e(i,n,t)}))},e.prototype.calculatePathNodes=function(){for(var e=[this],t=this.parent;t;)e.unshift(t),t=t.parent;return e},e.prototype.getPath=function(){return this.path},e.prototype.getValue=function(){return this.value},e.prototype.getValueByOption=function(){return this.config.emitPath?this.getPath():this.getValue()},e.prototype.getText=function(e,t){return e?this.pathLabels.join(t):this.label},e.prototype.isSameNode=function(e){var t=this.getValueByOption();return this.config.multiple&&Array.isArray(e)?e.some((function(e){return Object(d.isEqual)(e,t)})):Object(d.isEqual)(e,t)},e.prototype.broadcast=function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),i=1;i<t;i++)n[i-1]=arguments[i];var a="onParent"+Object(d.capitalize)(e);this.children.forEach((function(t){t&&(t.broadcast.apply(t,[e].concat(n)),t[a]&&t[a].apply(t,n))}))},e.prototype.emit=function(e){var t=this.parent,n="onChild"+Object(d.capitalize)(e);if(t){for(var i=arguments.length,a=Array(i>1?i-1:0),r=1;r<i;r++)a[r-1]=arguments[r];t[n]&&t[n].apply(t,a),t.emit.apply(t,[e].concat(a))}},e.prototype.onParentCheck=function(e){this.isDisabled||this.setCheckState(e)},e.prototype.onChildCheck=function(){var e=this.children.filter((function(e){return!e.isDisabled})),t=!!e.length&&e.every((function(e){return e.checked}));this.setCheckState(t)},e.prototype.setCheckState=function(e){var t=this.children.length,n=this.children.reduce((function(e,t){return e+(t.checked?1:t.indeterminate?.5:0)}),0);this.checked=e,this.indeterminate=n!==t&&n>0},e.prototype.syncCheckState=function(e){var t=this.getValueByOption(),n=this.isSameNode(e,t);this.doCheck(n)},e.prototype.doCheck=function(e){this.checked!==e&&(this.config.checkStrictly?this.checked=e:(this.broadcast("check",e),this.setCheckState(e),this.emit("check")))},N(e,[{key:"isDisabled",get:function(){var e=this.data,t=this.parent,n=this.config,i=n.disabled,a=n.checkStrictly;return e[i]||!a&&t&&t.isDisabled}},{key:"isLeaf",get:function(){var e=this.data,t=this.loaded,n=this.hasChildren,i=this.children,a=this.config,r=a.lazy,s=a.leaf;if(r){var o=Object(x.isDef)(e[s])?e[s]:!!t&&!i.length;return this.hasChildren=!o,o}return!n}}]),e}(),V=S,_=function e(t,n){return t.reduce((function(t,i){return i.isLeaf?t.push(i):(!n&&t.push(i),t=t.concat(e(i.children,n))),t}),[])},O=function(){function e(t,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.config=n,this.initNodes(t)}return e.prototype.initNodes=function(e){var t=this;e=Object(d.coerceTruthyValueToArray)(e),this.nodes=e.map((function(e){return new V(e,t.config)})),this.flattedNodes=this.getFlattedNodes(!1,!1),this.leafNodes=this.getFlattedNodes(!0,!1)},e.prototype.appendNode=function(e,t){var n=new V(e,this.config,t);(t?t.children:this.nodes).push(n)},e.prototype.appendNodes=function(e,t){var n=this;(e=Object(d.coerceTruthyValueToArray)(e)).forEach((function(e){return n.appendNode(e,t)}))},e.prototype.getNodes=function(){return this.nodes},e.prototype.getFlattedNodes=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=e?this.leafNodes:this.flattedNodes;return t?n:_(this.nodes,e)},e.prototype.getNodeByValue=function(e){var t=this.getFlattedNodes(!1,!this.config.lazy).filter((function(t){return Object(d.valueEquals)(t.path,e)||t.value===e}));return t&&t.length?t[0]:null},e}(),P=O,T=n(9),j=n.n(T),L=n(41),w=n.n(L),M=n(31),$=n.n(M),A=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},I=w.a.keys,F={expandTrigger:"click",multiple:!1,checkStrictly:!1,emitPath:!0,lazy:!1,lazyLoad:d.noop,value:"value",label:"label",children:"children",leaf:"leaf",disabled:"disabled",hoverThreshold:500},U=function(e){return!e.getAttribute("aria-owns")},D=function(e,t){var n=e.parentNode;if(n){var i=n.querySelectorAll('.el-cascader-node[tabindex="-1"]');return i[Array.prototype.indexOf.call(i,e)+t]||null}return null},q=function(e,t){if(e){var n=e.id.split("-");return Number(n[n.length-2])}},B=function(e){e&&(e.focus(),!U(e)&&e.click())},z={name:"ElCascaderPanel",components:{CascaderMenu:C},props:{value:{},options:Array,props:Object,border:{type:Boolean,default:!0},renderLabel:Function},provide:function(){return{panel:this}},data:function(){return{checkedValue:null,checkedNodePaths:[],store:[],menus:[],activePath:[],loadCount:0}},computed:{config:function(){return j()(A({},F),this.props||{})},multiple:function(){return this.config.multiple},checkStrictly:function(){return this.config.checkStrictly},leafOnly:function(){return!this.checkStrictly},isHoverMenu:function(){return"hover"===this.config.expandTrigger},renderLabelFn:function(){return this.renderLabel||this.$scopedSlots.default}},watch:{value:function(){this.syncCheckedValue(),this.checkStrictly&&this.calculateCheckedNodePaths()},options:{handler:function(){this.initStore()},immediate:!0,deep:!0},checkedValue:function(e){Object(d.isEqual)(e,this.value)||(this.checkStrictly&&this.calculateCheckedNodePaths(),this.$emit("input",e),this.$emit("change",e))}},mounted:function(){this.isEmptyValue(this.value)||this.syncCheckedValue()},methods:{initStore:function(){var e=this.config,t=this.options;e.lazy&&Object(d.isEmpty)(t)?this.lazyLoad():(this.store=new P(t,e),this.menus=[this.store.getNodes()],this.syncMenuState())},syncCheckedValue:function(){var e=this.value,t=this.checkedValue;Object(d.isEqual)(e,t)||(this.activePath=[],this.checkedValue=e,this.syncMenuState())},syncMenuState:function(){var e=this.multiple,t=this.checkStrictly;this.syncActivePath(),e&&this.syncMultiCheckState(),t&&this.calculateCheckedNodePaths(),this.$nextTick(this.scrollIntoView)},syncMultiCheckState:function(){var e=this;this.getFlattedNodes(this.leafOnly).forEach((function(t){t.syncCheckState(e.checkedValue)}))},isEmptyValue:function(e){var t=this.multiple,n=this.config.emitPath;return!(!t&&!n)&&Object(d.isEmpty)(e)},syncActivePath:function(){var e=this,t=this.store,n=this.multiple,i=this.activePath,a=this.checkedValue;if(Object(d.isEmpty)(i))if(this.isEmptyValue(a))this.activePath=[],this.menus=[t.getNodes()];else{var r=n?a[0]:a,s=((this.getNodeByValue(r)||{}).pathNodes||[]).slice(0,-1);this.expandNodes(s)}else{var o=i.map((function(t){return e.getNodeByValue(t.getValue())}));this.expandNodes(o)}},expandNodes:function(e){var t=this;e.forEach((function(e){return t.handleExpand(e,!0)}))},calculateCheckedNodePaths:function(){var e=this,t=this.checkedValue,n=this.multiple?Object(d.coerceTruthyValueToArray)(t):[t];this.checkedNodePaths=n.map((function(t){var n=e.getNodeByValue(t);return n?n.pathNodes:[]}))},handleKeyDown:function(e){var t=e.target;switch(e.keyCode){case I.up:var n=D(t,-1);B(n);break;case I.down:var i=D(t,1);B(i);break;case I.left:var a=this.$refs.menu[q(t)-1];if(a){var r=a.$el.querySelector('.el-cascader-node[aria-expanded="true"]');B(r)}break;case I.right:var s=this.$refs.menu[q(t)+1];if(s){var o=s.$el.querySelector('.el-cascader-node[tabindex="-1"]');B(o)}break;case I.enter:!function(e){if(e){var t=e.querySelector("input");t?t.click():U(e)&&e.click()}}(t);break;case I.esc:case I.tab:this.$emit("close");break;default:return}},handleExpand:function(e,t){var n=this.activePath,i=e.level,a=n.slice(0,i-1),r=this.menus.slice(0,i);if(e.isLeaf||(a.push(e),r.push(e.children)),this.activePath=a,this.menus=r,!t){var s=a.map((function(e){return e.getValue()})),o=n.map((function(e){return e.getValue()}));Object(d.valueEquals)(s,o)||(this.$emit("active-item-change",s),this.$emit("expand-change",s))}},handleCheckChange:function(e){this.checkedValue=e},lazyLoad:function(e,t){var n=this,i=this.config;e||(e=e||{root:!0,level:0},this.store=new P([],i),this.menus=[this.store.getNodes()]),e.loading=!0,i.lazyLoad(e,(function(i){var a=e.root?null:e;if(i&&i.length&&n.store.appendNodes(i,a),e.loading=!1,e.loaded=!0,Array.isArray(n.checkedValue)){var r=n.checkedValue[n.loadCount++],s=n.config.value,o=n.config.leaf;if(Array.isArray(i)&&i.filter((function(e){return e[s]===r})).length>0){var c=n.store.getNodeByValue(r);c.data[o]||n.lazyLoad(c,(function(){n.handleExpand(c)})),n.loadCount===n.checkedValue.length&&n.$parent.computePresentText()}}t&&t(i)}))},calculateMultiCheckedValue:function(){this.checkedValue=this.getCheckedNodes(this.leafOnly).map((function(e){return e.getValueByOption()}))},scrollIntoView:function(){this.$isServer||(this.$refs.menu||[]).forEach((function(e){var t=e.$el;if(t){var n=t.querySelector(".el-scrollbar__wrap"),i=t.querySelector(".el-cascader-node.is-active")||t.querySelector(".el-cascader-node.in-active-path");$()(n,i)}}))},getNodeByValue:function(e){return this.store.getNodeByValue(e)},getFlattedNodes:function(e){var t=!this.config.lazy;return this.store.getFlattedNodes(e,t)},getCheckedNodes:function(e){var t=this.checkedValue;return this.multiple?this.getFlattedNodes(e).filter((function(e){return e.checked})):this.isEmptyValue(t)?[]:[this.getNodeByValue(t)]},clearCheckedNodes:function(){var e=this.config,t=this.leafOnly,n=e.multiple,i=e.emitPath;n?(this.getCheckedNodes(t).filter((function(e){return!e.isDisabled})).forEach((function(e){return e.doCheck(!1)})),this.calculateMultiCheckedValue()):this.checkedValue=i?[]:null}}},H=Object(v.a)(z,i,[],!1,null,null,null);H.options.__file="packages/cascader-panel/src/cascader-panel.vue";var R=H.exports;R.install=function(e){e.component(R.name,R)},t.default=R},9:function(e,t){e.exports=o()}})),f.exports}export{p as a,h as r};