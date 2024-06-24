import{aU as e,a$ as r,i as s,b0 as t,aQ as a,n,r as o,q as i,a as d}from"./main.js?v=1714377894636";import{_ as l}from"./index45.js?v=1714377894636";import{w as u,x as c,o as p}from"./element-lib.js?v=1714377894636";import{e as m,b as f,v as B,j as v}from"./vue-lib.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./public-lib.js?v=1714377894636";const b=n(m({__name:"index",setup(n,{expose:o}){const{proxy:i,emit:d}=v(),l=f(!1),u=f(i.$t("BtBindUser.GetVerifyCode")),c=B({username:"",password:"",code:""}),p=B({username:!1,password:!1,code:!1}),m=f(""),b=f(0),w=f(),g=f({username:[{required:!0,message:i.$t("BtBindUser.InputUser"),trigger:["blur","change"]},{validator:(e,r,s)=>{/^1[3456789]\d{9}$/.test(r)?s():s(new Error(i.$t("BtBindUser.InputCorrectUser")))},trigger:["blur","change"]}],password:[{required:!0,message:i.$t("BtBindUser.InputPassword"),trigger:["blur","change"]},{validator:(e,r,s)=>{r.length>=8?s():s(new Error(i.$t("BtBindUser.InputCorrectPassword")))},trigger:["blur","change"]}],token:[{required:!1,message:i.$t("BtBindUser.InputVerifyCode"),trigger:["blur","change"]},{validator:(e,r,s)=>{l.value||s(),6===r.length?s():s(new Error(i.$t("BtBindUser.InputCorrectVerifyCode")))},trigger:["blur","change"]}]}),y=e=>{b.value&&clearInterval(b.value);const r=()=>{if(--e<=0)return clearInterval(b.value),u.value=i.$t("BtBindUser.GetVerifyCode"),void(p.code=!1);u.value=i.$t("BtBindUser.AgainGetVerifyCode")+"(".concat(e,"s)")};r(),b.value=setInterval(r,1e3),p.code=!0},U=()=>{a(i.$el,"username")},k=()=>{w.value.clearValidate()};return o({onOpen:U,onCancel:k}),{__sfc:!0,vm:i,emit:d,isCheck:l,tipsText:u,userInfo:c,formDisabled:p,userToken:m,clearIntervalVal:b,bindUserInfo:w,rules:g,bindBtUser:()=>{i.$refs.bindUserInfo.validate((async t=>{if(!t)return!1;{const t={...c};if(l.value){if(!c.code)return i.$message.error(i.$t("BtBindUser.InputVerifyCode"));t.token=m.value,delete t.password}else delete t.code;const n=i.$load(i.$t("BtBindUser.DindUserLoad"));try{t.username=e(t.username),t.password=e(t.password);const a=await r({...t});if(i.$message.request(a),a.status)return window.location.reload(),i.$listeners.close();if(s(a.data))return!1;if(!a.status&&"[]"===JSON.stringify(a.data))return i.$message.request(a);-1===a.data.code&&(m.value=a.data.token,l.value=!0)}catch(a){}finally{n.close()}}}))},countDown:y,getVerifyCode:async()=>{if(!c.username||!c.password)return i.$message.error("请先输入手机号和密码");p.username=!0,p.password=!0,y(60);const e=await t({username:c.username,token:m.value});i.$message.request(e)},onOpen:U,onCancel:k}}}),(function(){var e=this,r=e._self._c,s=e._self._setupProxy;return r(u,{ref:"bindUserInfo",staticClass:"bind-user-info",attrs:{size:"medium",rules:s.rules,model:s.userInfo}},[r(c,{staticClass:"text-center !mb-5 flex justify-center"},[r("h3",{staticClass:"text-[2rem] text-dark inline-block mr-2 font-bold mt-12x"},[e._v(" "+e._s(e.$t("BtBindUser.BindBtUser"))+" ")]),r(o,{staticClass:"inline-block relative -top-1.5",attrs:{placement:"top-start",width:"200",trigger:"hover",content:e.$t("BtBindUser.BindUserDescribe")},scopedSlots:e._u([{key:"reference",fn:function(){return[r("a",{staticClass:"bt-ico-ask align-middle",attrs:{href:"javascript:;"}},[e._v("?")])]},proxy:!0}])})],1),r(c,{key:1,attrs:{prop:"username"}},[r(p,{directives:[{name:"focus",rawName:"v-focus"}],attrs:{clearable:"",required:"",name:"username",placeholder:e.$t("BtBindUser.Phone"),disabled:s.formDisabled.username},nativeOn:{keyup:function(r){return!r.type.indexOf("key")&&e._k(r.keyCode,"enter",13,r.key,"Enter")?null:s.bindBtUser()}},model:{value:s.userInfo.username,callback:function(r){e.$set(s.userInfo,"username",r)},expression:"userInfo.username"}})],1),r(c,{key:2,attrs:{prop:"password"}},[r(p,{attrs:{clearable:"",required:"",type:"password",name:"password",placeholder:e.$t("BtBindUser.Password"),"show-password":!0,disabled:s.formDisabled.password},nativeOn:{keyup:function(r){return!r.type.indexOf("key")&&e._k(r.keyCode,"enter",13,r.key,"Enter")?null:s.bindBtUser()}},model:{value:s.userInfo.password,callback:function(r){e.$set(s.userInfo,"password",r)},expression:"userInfo.password"}})],1),r(c,{directives:[{name:"show",rawName:"v-show",value:s.isCheck,expression:"isCheck"}],attrs:{prop:"code"}},[r(p,{attrs:{clearable:"",placeholder:e.$t("BtBindUser.VerifyCode"),type:"text"},nativeOn:{keyup:function(r){return!r.type.indexOf("key")&&e._k(r.keyCode,"enter",13,r.key,"Enter")?null:s.bindBtUser()}},scopedSlots:e._u([{key:"append",fn:function(){return[r(i,{staticClass:"relative top-0 rounded-none rounded-r-[3px]",attrs:{size:"default",disabled:s.formDisabled.code,plain:""},on:{click:s.getVerifyCode}},[e._v(e._s(s.tipsText))])]},proxy:!0}]),model:{value:s.userInfo.code,callback:function(r){e.$set(s.userInfo,"code",r)},expression:"userInfo.code"}})],1),r(i,{directives:[{name:"t",rawName:"v-t",value:"BtBindUser.BindUser",expression:"'BtBindUser.BindUser'"}],staticClass:"w-[100%] mt-[1.2rem]",attrs:{size:"default"},on:{click:function(e){return s.bindBtUser()}}}),r("div",{staticClass:"flex justify-end items-center mt-8 text-[1.2rem]"},[r(d,{directives:[{name:"t",rawName:"v-t",value:"BtBindUser.SignUp",expression:"'BtBindUser.SignUp'"}],attrs:{href:"https://www.bt.cn/register"}}),r(l),r(d,{directives:[{name:"t",rawName:"v-t",value:"BtBindUser.ForgotPassword",expression:"'BtBindUser.ForgotPassword'"}],attrs:{href:"https://www.bt.cn/login.html?page=reset"}}),r(l),r(d,{directives:[{name:"t",rawName:"v-t",value:"BtBindUser.ProblemFeedback",expression:"'BtBindUser.ProblemFeedback'"}],attrs:{href:"https://www.bt.cn/bbs"}})],1)],1)}),[],!1,null,"72e31de9",null,null).exports;export{b as default};