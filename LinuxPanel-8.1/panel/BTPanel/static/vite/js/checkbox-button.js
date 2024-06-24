import{g as e}from"./__commonjsHelpers__.js?v=1714377894636";import{d as t}from"./element-lib.js?v=1714377894636";var o={exports:{}};const i=e(o.exports=function(e){var t={};function o(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,o),r.l=!0,r.exports}return o.m=e,o.c=t,o.d=function(e,t,i){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(o.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(i,r,function(t){return e[t]}.bind(null,r));return i},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/dist/",o(o.s=92)}({0:function(e,t,o){function i(e,t,o,i,r,s,n,l){var c,a="function"==typeof e?e.options:e;if(t&&(a.render=t,a.staticRenderFns=o,a._compiled=!0),i&&(a.functional=!0),s&&(a._scopeId="data-v-"+s),n?(c=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),r&&r.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(n)},a._ssrRegister=c):r&&(c=l?function(){r.call(this,this.$root.$options.shadowRoot)}:r),c)if(a.functional){a._injectStyles=c;var u=a.render;a.render=function(e,t){return c.call(t),u(e,t)}}else{var d=a.beforeCreate;a.beforeCreate=d?[].concat(d,c):[c]}return{exports:e,options:a}}o.d(t,"a",(function(){return i}))},4:function(e,o){e.exports=t()},92:function(e,t,o){o.r(t);var i=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("label",{staticClass:"el-checkbox-button",class:[e.size?"el-checkbox-button--"+e.size:"",{"is-disabled":e.isDisabled},{"is-checked":e.isChecked},{"is-focus":e.focus}],attrs:{role:"checkbox","aria-checked":e.isChecked,"aria-disabled":e.isDisabled}},[e.trueLabel||e.falseLabel?o("input",{directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],staticClass:"el-checkbox-button__original",attrs:{type:"checkbox",name:e.name,disabled:e.isDisabled,"true-value":e.trueLabel,"false-value":e.falseLabel},domProps:{checked:Array.isArray(e.model)?e._i(e.model,null)>-1:e._q(e.model,e.trueLabel)},on:{change:[function(t){var o=e.model,i=t.target,r=i.checked?e.trueLabel:e.falseLabel;if(Array.isArray(o)){var s=e._i(o,null);i.checked?s<0&&(e.model=o.concat([null])):s>-1&&(e.model=o.slice(0,s).concat(o.slice(s+1)))}else e.model=r},e.handleChange],focus:function(t){e.focus=!0},blur:function(t){e.focus=!1}}}):o("input",{directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],staticClass:"el-checkbox-button__original",attrs:{type:"checkbox",name:e.name,disabled:e.isDisabled},domProps:{value:e.label,checked:Array.isArray(e.model)?e._i(e.model,e.label)>-1:e.model},on:{change:[function(t){var o=e.model,i=t.target,r=!!i.checked;if(Array.isArray(o)){var s=e.label,n=e._i(o,s);i.checked?n<0&&(e.model=o.concat([s])):n>-1&&(e.model=o.slice(0,n).concat(o.slice(n+1)))}else e.model=r},e.handleChange],focus:function(t){e.focus=!0},blur:function(t){e.focus=!1}}}),e.$slots.default||e.label?o("span",{staticClass:"el-checkbox-button__inner",style:e.isChecked?e.activeStyle:null},[e._t("default",[e._v(e._s(e.label))])],2):e._e()])};i._withStripped=!0;var r=o(4),s={name:"ElCheckboxButton",mixins:[o.n(r).a],inject:{elForm:{default:""},elFormItem:{default:""}},data:function(){return{selfModel:!1,focus:!1,isLimitExceeded:!1}},props:{value:{},label:{},disabled:Boolean,checked:Boolean,name:String,trueLabel:[String,Number],falseLabel:[String,Number]},computed:{model:{get:function(){return this._checkboxGroup?this.store:void 0!==this.value?this.value:this.selfModel},set:function(e){this._checkboxGroup?(this.isLimitExceeded=!1,void 0!==this._checkboxGroup.min&&e.length<this._checkboxGroup.min&&(this.isLimitExceeded=!0),void 0!==this._checkboxGroup.max&&e.length>this._checkboxGroup.max&&(this.isLimitExceeded=!0),!1===this.isLimitExceeded&&this.dispatch("ElCheckboxGroup","input",[e])):void 0!==this.value?this.$emit("input",e):this.selfModel=e}},isChecked:function(){return"[object Boolean]"==={}.toString.call(this.model)?this.model:Array.isArray(this.model)?this.model.indexOf(this.label)>-1:null!==this.model&&void 0!==this.model?this.model===this.trueLabel:void 0},_checkboxGroup:function(){for(var e=this.$parent;e;){if("ElCheckboxGroup"===e.$options.componentName)return e;e=e.$parent}return!1},store:function(){return this._checkboxGroup?this._checkboxGroup.value:this.value},activeStyle:function(){return{backgroundColor:this._checkboxGroup.fill||"",borderColor:this._checkboxGroup.fill||"",color:this._checkboxGroup.textColor||"","box-shadow":"-1px 0 0 0 "+this._checkboxGroup.fill}},_elFormItemSize:function(){return(this.elFormItem||{}).elFormItemSize},size:function(){return this._checkboxGroup.checkboxGroupSize||this._elFormItemSize||(this.$ELEMENT||{}).size},isLimitDisabled:function(){var e=this._checkboxGroup,t=e.max,o=e.min;return!(!t&&!o)&&this.model.length>=t&&!this.isChecked||this.model.length<=o&&this.isChecked},isDisabled:function(){return this._checkboxGroup?this._checkboxGroup.disabled||this.disabled||(this.elForm||{}).disabled||this.isLimitDisabled:this.disabled||(this.elForm||{}).disabled}},methods:{addToStore:function(){Array.isArray(this.model)&&-1===this.model.indexOf(this.label)?this.model.push(this.label):this.model=this.trueLabel||!0},handleChange:function(e){var t=this;if(!this.isLimitExceeded){var o=void 0;o=e.target.checked?void 0===this.trueLabel||this.trueLabel:void 0!==this.falseLabel&&this.falseLabel,this.$emit("change",o,e),this.$nextTick((function(){t._checkboxGroup&&t.dispatch("ElCheckboxGroup","change",[t._checkboxGroup.value])}))}}},created:function(){this.checked&&this.addToStore()}},n=o(0),l=Object(n.a)(s,i,[],!1,null,null,null);l.options.__file="packages/checkbox/src/checkbox-button.vue";var c=l.exports;c.install=function(e){e.component(c.name,c)},t.default=c}}));export{i as _};