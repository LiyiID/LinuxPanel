import{_ as e}from"./index118.js?v=1714377894636";import{n as s,q as t,D as a,r as l}from"./main.js?v=1714377894636";import{w as r,x as i,y as o,z as n,q as c,s as d,Q as u,_ as m,o as p}from"./element-lib.js?v=1714377894636";import{e as v,b as f,v as x,c as h,h as _,j as y}from"./vue-lib.js?v=1714377894636";import{g as C,ez as b,cs as w,bF as g,bG as j}from"./site.store.js?v=1714377894636";import{a2 as k,a5 as S,a8 as L}from"./site.popup.js?v=1714377894636";import"./modulepreload-polyfill.js?v=1714377894636";import"./preload-helper.js?v=1714377894636";import"./request-lib.js?v=1714377894636";import"./__commonjsHelpers__.js?v=1714377894636";import"./locales-lib.js?v=1714377894636";import"./public-lib.js?v=1714377894636";import"./check.js?v=1714377894636";import"./index38.js?v=1714377894636";import"./index45.js?v=1714377894636";import"./element-ui.common.js?v=1714377894636";import"./date-util.js?v=1714377894636";import"./vdom.js?v=1714377894636";import"./index62.js?v=1714377894636";import"./cascader-panel.js?v=1714377894636";const D=s(v({__name:"LetsEncryptList",setup(e){var s,t;const{proxy:a}=y(),{refs:{siteInfo:l,sslInfo:r,sslDnsApiInfo:i},getSslDnsApiInfo:o,applyLetResult:n,renewalCert:c,closeCert:d,getPhpModulesList:u,getModulesList:m,renewalLetCert:p}=C(),v=[{text:"注意：请勿将SSL证书用于非法网站",color:"text-danger"},{text:"使用【DnsPod/阿里云DNS】等接口前您需要先在弹出的窗口中设置对应接口的API"}],D=f([{text:"Let's Encrypt 证书申请和续签限制 点击查看"},{text:"申请之前，请确保域名已解析，如未解析会导致审核失败"},{text:"Let's Encrypt免费证书，有效期3个月，支持多域名。默认会自动续签"},{text:"若您的站点使用了CDN或301重定向会导致续签失败"},{text:"在未指定SSL默认站点时,未开启SSL的站点使用HTTPS会直接访问到已开启SSL的站点"}]),I=f([{text:"如开启后无法使用HTTPS访问，请检查安全组是否正确放行443端口"},{text:"在DNS验证中，我们提供了多种自动化DNS-API，并提供了手动模式"},{text:"使用DNS接口申请证书可自动续期，手动模式下证书到期后需重新申请"}]),A=f([{text:"已为您自动生成Let's Encrypt免费证书"},{text:"如需使用其他SSL,请切换其他证书后粘贴您的KEY以及PEM内容，然后保存即可"},{text:"如开启后无法使用HTTPS访问，请检查安全组是否正确放行443端口"}]),N=f(!1),E=f(null==(s=r.value)?void 0:s.key),P=f(null==(t=r.value)?void 0:t.csr),H=f("dns"),$=x({resource:"0",autoWildcard:!1,checkAll:!1,domain:[],checkList:[]}),K=h((()=>{const e="0"===$.resource?D.value:I.value,s=v.concat([]);return s.splice(1,0,...e),s}));return _((async()=>{const{data:e}=await b({id:l.value.id});$.domain=e.domains.map((e=>e.name)),await o()})),{__sfc:!0,vm:a,siteInfo:l,sslInfo:r,sslDnsApiInfo:i,getSslDnsApiInfo:o,applyLetResult:n,renewalCert:c,closeCert:d,getPhpModulesList:u,getModulesList:m,renewalLetCert:p,defalutHelpList:v,letsEncryptHelpFileList:D,letsEncryptHelpDnsList:I,letSslHelp:A,isIndeterminate:N,certKey:E,certCsr:P,dnsVerify:H,form:$,letsEncryptHelpList:K,handleCheckAllChange:e=>{$.checkList=e?$.domain:[],N.value=!1},handleCheckedDomainChange:e=>{const s=e.length;$.checkAll=s===$.domain.length,N.value=s>0&&s<$.domain.length},setSslDnsApi:e=>{var s;const t=H.value;if("dns"!==t){const a=null==(s=i.value)?void 0:s.find((e=>e.value===t)),l=!a.data;(!e||e&&l)&&k({title:"设置".concat(a.info.title,"接口"),row:a.info})}},renewalCurrentCert:async()=>{if(3===r.value.type)c(r.value.oid,r.value.type);else if(32===r.value.length&&-1===r.value.indexOf("/")){const e=await S();p(r.value.index),null==e||e.close()}else{const{data:e}=await w({siteName:l.value.name,pem_file:r.value.index});L(e)}},onSubmit:async()=>{var e;if(0===$.checkList.length)return void a.$message.error("请选择一个域名");if("1"===$.resource&&$.autoWildcard&&$.checkList.some((e=>-1!==e.indexOf("*"))))return void a.$message.error("开启自动组合泛域名时不能选择泛域名");let s={domains:JSON.stringify($.checkList),auth_type:"1"==$.resource?"dns":"http",auth_to:"1"==$.resource?"dns":l.value.id,auto_wildcard:$.autoWildcard?"1":"0",id:l.value.id};if("1"==$.resource&&"dns"!==H.value){const{data:t,info:{data:l}}=null==(e=i.value)?void 0:e.find((e=>e.value===H.value));if(!t)return void a.$message.error("指定dns接口没有设置密钥信息");s.auth_to="".concat(H.value,"|").concat(l[0].value,"|").concat(l[1].value)}const t=await S(),{data:r}="proxy"==l.value.project_type||"nginx"==l.value.project_type?await g({...s,site_name:l.value.name}):await j(s);null==t||t.close(),n(r,s)}}}}),(function(){var s=this,v=s._self._c,f=s._self._setupProxy;return v("div",{staticClass:"py-16x"},[1!==f.sslInfo.type?[v(r,{staticClass:"mb-20x"},[v(i,{attrs:{label:"验证方法"}},[v(o,{model:{value:f.form.resource,callback:function(e){s.$set(f.form,"resource",e)},expression:"form.resource"}},[v(n,{attrs:{label:"0",value:"0"}},[s._v("文件验证")]),v(n,{attrs:{label:"1",value:"1"}},[s._v("DNS验证(支持通配符)")])],1)],1),v(i,{directives:[{name:"show",rawName:"v-show",value:"1"==f.form.resource,expression:"form.resource == '1'"}],attrs:{label:"选择DNS接口"}},[v(c,{staticClass:"mr-16x",attrs:{placeholder:"请选择"},on:{change:function(e){return f.setSslDnsApi(!0)}},model:{value:f.dnsVerify,callback:function(e){f.dnsVerify=e},expression:"dnsVerify"}},s._l(f.sslDnsApiInfo,(function(e){return v(d,{key:e.value,attrs:{label:e.label,value:e.value}},[v("span",{staticClass:"flex justify-between"},[v("span",[s._v(s._s(e.label))]),v("span",{directives:[{name:"show",rawName:"v-show",value:e.config,expression:"item.config"}],class:e.data?"text-primary":"text-orange"},[s._v(" "+s._s(e.data?"[已配置]":"[未配置]")+" ")])])])})),1),v(t,{directives:[{name:"show",rawName:"v-show",value:"dns"!==f.dnsVerify,expression:"dnsVerify !== 'dns'"}],staticClass:"ml-8x",attrs:{type:"defalut"},on:{click:function(e){return f.setSslDnsApi(!1)}}},[s._v(" 配置 ")])],1),v(i,{directives:[{name:"show",rawName:"v-show",value:"1"==f.form.resource,expression:"form.resource == '1'"}],attrs:{label:" "}},[v(a,{model:{value:f.form.autoWildcard,callback:function(e){s.$set(f.form,"autoWildcard",e)},expression:"form.autoWildcard"}},[s._v(" 自动组合泛域名")]),v("div",{staticClass:"text-[1.2rem]"},[s._v(" * 如需申请通配符域名请勾选此项，且不要在下方域名列表中选中泛域名 ")])],1),v(i,{attrs:{label:"域名"}},[v("div",{staticClass:"p-12x border-[1px] w-[50rem] h-[22rem] flex flex-col overflow-auto rounded-default border-[#ececec]"},[v(a,{staticClass:"w-full !mx-0 mb-4x",attrs:{indeterminate:f.isIndeterminate,border:""},on:{change:f.handleCheckAllChange},model:{value:f.form.checkAll,callback:function(e){s.$set(f.form,"checkAll",e)},expression:"form.checkAll"}},[s._v(" 全选 ")]),v(u,{staticClass:"flex flex-col",on:{change:f.handleCheckedDomainChange},model:{value:f.form.checkList,callback:function(e){s.$set(f.form,"checkList",e)},expression:"form.checkList"}},s._l(f.form.domain,(function(e){return v(a,{key:e,staticClass:"w-full !mx-0 mb-4x overflow-hidden",attrs:{label:e,border:""}},[v(l,{attrs:{placement:"top",trigger:"hover",content:e}},[v("span",{attrs:{slot:"reference"},slot:"reference"},[s._v(s._s(e))])])],1)})),1)],1)]),v(i,{attrs:{label:" "}},[v(m,{attrs:{type:"primary"},on:{click:f.onSubmit}},[s._v("申请证书")])],1)],1),v(e,{staticClass:"ml-20x",attrs:{list:f.letsEncryptHelpList,listStyle:"disc"}})]:[v("div",{staticClass:"ssl-status-info"},[v("div",{staticClass:"left flex-1"},[s._m(0),v("div",[v("span",[s._v("认证域名：")]),v("span",[s._v(s._s(f.sslInfo.subject))])])]),v("div",{staticClass:"right flex-1"},[v("div",[v("span",[s._v("证书品牌：")]),v("span",[s._v(s._s(f.sslInfo.issuer))])]),v("div",[v("span",[s._v("到期时间：")]),v("span",[s._v(" "+s._s(f.sslInfo.endtime>0?f.sslInfo.notAfter:"")+" "),v("span",{directives:[{name:"show",rawName:"v-show",value:f.sslInfo.endtime<0,expression:"sslInfo.endtime < 0"}],staticClass:"text-danger"},[s._v("证书已过期")])])])])]),v("div",{staticClass:"flex flex-1 justify-start"},[v("div",{staticClass:"flex-1 mr-20x"},[v("div",{staticClass:"mb-4x"},[s._v("密钥(KEY)")]),v(p,{attrs:{type:"textarea",rows:"15",disabled:""},model:{value:f.certKey,callback:function(e){f.certKey=e},expression:"certKey"}})],1),v("div",{staticClass:"flex-1"},[v("div",{staticClass:"mb-4x"},[s._v("证书(PEM格式)")]),v(p,{attrs:{type:"textarea",rows:"15",disabled:""},model:{value:f.certCsr,callback:function(e){f.certCsr=e},expression:"certCsr"}})],1)]),v("div",{staticClass:"my-16x"},[v(t,{on:{click:f.closeCert}},[s._v("关闭SSL")]),v(t,{staticClass:"mr-4x",on:{click:f.renewalCurrentCert}},[s._v(" 续签证书 ")])],1),v(e,{staticClass:"ml-20x",attrs:{list:f.letSslHelp,listStyle:"disc"}})]],2)}),[function(){var e=this,s=e._self._c;return e._self._setupProxy,s("div",[s("span",[e._v("已部署成功:")]),s("span",[e._v("将在距离到期时间1个月内尝试自动续签")])])}],!1,null,"1cc2c72a",null,null).exports;export{D as default};
