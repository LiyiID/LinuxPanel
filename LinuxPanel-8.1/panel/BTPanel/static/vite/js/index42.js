import{g as e,p as a,n as s,a as t}from"./main.js?v=1714377894636";import{e as o}from"./vue-lib.js?v=1714377894636";const i=s(o({__name:"index",props:{disablePro:{type:Boolean,default:!1},isHome:{type:Boolean,default:!1}},setup(s){const t=s,{refs:{authType:o,recommendAuth:i,getDaysRemaining:r,getAuthExpirationTime:n,authExpirationTime:p}}=e();return{__sfc:!0,authType:o,recommendAuth:i,getDaysRemaining:r,getAuthExpirationTime:n,authExpirationTime:p,props:t,openProductPayView:()=>{const e={disablePro:!0};t.isHome&&"ltd"!==o.value&&(e.disablePro=!1),a({disablePro:e.disablePro,sourceId:27})}}}}),(function(){var e=this,a=e._self._c,s=e._self._setupProxy;return a("div",{staticClass:"flex items-center"},[a("div",{staticClass:"flex items-center px-[1rem] rounded-2x opacity-80",class:{"recom-bg":"free"===s.authType&&!s.props.isHome}},[a("span",{class:("free"!==s.authType||s.props.isHome?"icon-end-time-free ":"icon-end-time ")+"icon-"+("free"===s.authType?"un":"")+"paid-"+("free"===s.authType?s.recommendAuth:s.authType)+" pb-[.2rem]",on:{click:s.openProductPayView}},["free"!==s.authType?[a("span",{staticClass:"leading-[1.6rem]"},[e._v(" "+e._s(e.$t("HomeHeader.DueDate"))+"："),a("span",{staticClass:"font-bold !mr-2",class:{"text-danger":s.getDaysRemaining<7,"text-[#fc6d26]":s.getDaysRemaining>=7}},[e._v(" "+e._s(s.getAuthExpirationTime)+" ")])]),0!==s.authExpirationTime?a(t,{directives:[{name:"t",rawName:"v-t",value:"HomeHeader.Renew",expression:"`HomeHeader.Renew`"}],staticClass:"!align-top",staticStyle:{"font-weight":"bold",color:"#20a53a"}}):e._e()]:e._e(),a("span",{directives:[{name:"show",rawName:"v-show",value:"free"===s.authType&&!s.props.isHome,expression:"authType === 'free' && !props.isHome"}],staticClass:"ml-4x font-bold text-[#ef9f00]"},[e._v(" 安全、高效、让您更安心 ")])],2)]),a("span",{directives:[{name:"show",rawName:"v-show",value:"free"===s.authType&&s.props.isHome,expression:"authType === 'free' && props.isHome"}],staticClass:"mr-1rem ml-[-1.5rem]",on:{click:s.openProductPayView}},[e._v(" 免费版 ")]),a("button",{directives:[{name:"show",rawName:"v-show",value:"free"===s.authType&&!s.props.isHome,expression:"authType === 'free' && !props.isHome"}],staticClass:"recom-btn",on:{click:s.openProductPayView}},[e._v(" 立即体验 ")])])}),[],!1,null,null,null,null).exports;export{i as _};
