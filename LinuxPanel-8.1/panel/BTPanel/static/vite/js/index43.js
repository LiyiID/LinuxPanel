import{n as t,R as s,a as e}from"./main.js?v=1714377894636";import{e as o}from"./vue-lib.js?v=1714377894636";const a=t(o({__name:"index",props:{icon:{default:""},iconClass:{default:""},iconPath:{default:""},type:{default:"primary"},text:{type:Boolean,default:!1},href:{default:null},target:{default:"_blank"},custom:{type:Boolean,default:!1},content:{default:""}},emits:["click"],setup:t=>({__sfc:!0,props:t})}),(function(){var t=this,o=t._self._c,a=t._self._setupProxy;return o("div",[a.props.custom?o("div",{staticClass:"flex items-center"},[t._t("default")],2):o("div",{staticClass:"flex items-center"},[a.props.icon?o("i",{class:"iconfont mr-4x icon-"+a.props.icon+" "+a.props.iconClass}):t._e(),a.props.iconPath?o(s,{class:"iconfont mr-4x "+a.props.iconClass,attrs:{src:a.props.iconPath}}):t._e(),!a.props.href&&a.props.text?o("span",{staticClass:"text-medium"},[t._v(" "+t._s(t.content)+" "),t._t("default")],2):o(e,{attrs:{href:a.props.href,type:a.props.type},on:{click:function(s){return t.$emit("click",s)}}},[t._v(" "+t._s(t.content)+" "),t._t("default")],2)],1)])}),[],!1,null,null,null,null).exports;export{a as _};