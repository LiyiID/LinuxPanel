var t=Object.defineProperty,e=(e,n,i)=>(((e,n,i)=>{n in e?t(e,n,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[n]=i})(e,"symbol"!=typeof n?n+"":n,i),i);function n(){import.meta.url,import("_").catch((()=>1)),async function*(){}().next()}import"./modulepreload-polyfill.js?v=1714377894636";new class{constructor(){e(this,"trackings",0),e(this,"elementMount",!1),e(this,"dragElement",(t=>{let e=0,n=0,i=0,o=0;const s=t.querySelector(".layui-layer-title"),l=document.documentElement;function a(s){s.preventDefault(),e=i-s.clientX,n=o-s.clientY,i=s.clientX,o=s.clientY;let a=t.offsetLeft-e,c=t.offsetTop-n;const p=l.getBoundingClientRect(),r=t.getBoundingClientRect();a<p.left?a=p.left:a+r.width>p.right&&(a=p.right-r.width),c<p.top?c=p.top:c+r.height>p.bottom&&(c=p.bottom-r.height),t.style.left="".concat(a,"px"),t.style.top="".concat(c,"px")}function c(){document.onmouseup=null,document.onmousemove=null}s.onmousedown=function(t){t.preventDefault(),i=t.clientX,o=t.clientY,document.onmouseup=c,document.onmousemove=a}})),e(this,"centerModal",(t=>{const e=document.documentElement,n=t.getBoundingClientRect(),i=e.getBoundingClientRect(),o=i.left+(i.width-n.width)/2,s=i.top+(i.height-n.height)/2;t.style.left="".concat(o,"px"),t.style.top="".concat(s,"px")})),e(this,"closeModal",(t=>{t.querySelector(".layui-layer-close").onclick=()=>{window.parent.postMessage("closePlugin","*")}})),e(this,"trackingsFun",(t=>{this.trackings=setInterval((()=>{const e=document.querySelector(t);e&&(this.elementMount=!0),this.elementMount&&!e&&(clearInterval(this.trackings),window.parent.postMessage("closePlugin","*"))}),500)})),this.init()}init(){const{paymentId:t}=this.getUrlParams(),e=sessionStorage.getItem("pluginViewInfo");if(e){const{id:n,name:i,built:o}=JSON.parse(e),s=sessionStorage.getItem(n),l="1"===o;if("string"==typeof t)return window.product_recommend.pay_product_sign("ltd",t),!1;"webssh"===n&&this.trackingsFun(".term_box_all"),l?this.renderBuiltPlugin(n):this.renderPluginView({pluginId:n,pluginName:i,pluginHtml:s}),setTimeout((()=>{sessionStorage.removeItem(n),sessionStorage.removeItem("pluginId")}),2e3)}}renderBuiltPlugin(t){const e=window.bt.load();window.bt.soft.get_soft_find(t,(n=>{e.close(),!0!==n.setup&&window.bt.msg({status:!1,msg:"".concat(n.title,"未安装，请先安装。")}),"mysql"===t&&(t="mysqld"),this.renderPluginView({pluginId:t,pluginName:n.title+window.lan.soft.admin,pluginHtml:'<div class="bt-w-main" style="width:640px;"><div class="bt-w-menu bt-soft-menu"></div><div id="webEdit-con" class="bt-w-con pd15" style="height:555px;overflow:auto"><div class="soft-man-con bt-form"></div></div></div>'});const i=window.jQuery(".bt-soft-menu").data("data",n);setTimeout((function(){if(i.append(window.jQuery('<p class="bgw bt_server" onclick="soft.get_tab_contents(\'service\',this)">'.concat(window.lan.soft.service,"</p>"))),n.version_coexist){const e=t.split("-")[1].replace(".",""),n=[{type:"set_php_config",val:e,title:window.lan.soft.php_main5},{type:"config_edit",val:e,title:window.lan.soft.config_edit},{type:"set_upload_limit",val:e,title:window.lan.soft.php_main2},{type:"set_timeout_limit",val:e,title:window.lan.soft.php_main3,php53:!0},{type:"config",val:e,title:window.lan.soft.php_main4},{type:"fpm_config",val:e,title:"FPM配置文件"},{type:"set_dis_fun",val:e,title:window.lan.soft.php_main6},{type:"set_fpm_config",val:e,title:window.lan.soft.php_main7,apache24:!0,php53:!0},{type:"get_php_status",val:e,title:window.lan.soft.php_main8,apache24:!0,php53:!0},{type:"get_php_session",val:e,title:window.lan.soft.php_main9,apache24:!0,php53:!0},{type:"get_fpm_logs",val:e,title:window.lan.soft.log,apache24:!0,php53:!0},{type:"get_slow_logs",val:e,title:window.lan.public.slow_log,apache24:!0,php53:!0},{type:"get_phpinfo",val:e,title:"phpinfo"}],o=[0,1,2,3,4,5,6,7,8,9,10,11,12],s="openlitespeed"===window.bt.get_cookie("serverType");for(let l=0;l<o.length;l++){const e=n[l];if(e&&(void 0===e.os||e.os===window.bt.os)){if(t.indexOf("5.2")>=0&&e.php53)continue;if(s&&("set_fpm_config"===e.type||"fpm_config"===e.type||"get_php_status"===e.type))continue;const n=e.apache24?'class="apache24"':"";i.append(window.jQuery('<p data-id="'.concat(l,'" ').concat(n," onclick=\"soft.get_tab_contents('").concat(e.type,"',this)\" >").concat(e.title,"</p>")).data("item",e))}}}else i.append(window.soft.get_config_menu(t));window.jQuery(".bt-w-menu p").click((function(){window.jQuery(this).addClass("bgw").siblings().removeClass("bgw")})),window.jQuery(".bt-w-menu p:eq(0)").trigger("click"),-1===t.indexOf("php-")&&-1===t.indexOf("apache")||window.bt.soft.get_soft_find("apache",(function(e){e.setup&&e.version.indexOf("2.2")>=0&&(-1!==t.indexOf("php-")&&(window.jQuery(".apache24").hide(),window.jQuery(".bt_server").remove(),window.jQuery(".bt-w-menu p:eq(0)").trigger("click")),-1!==t.indexOf("apache")&&(window.jQuery(".bt-soft-menu p:eq(3)").remove(),window.jQuery(".bt-soft-menu p:eq(3)").remove()))}))}),100)}))}renderPluginView(t){var e;const n=document.querySelector("#app");n.innerHTML='\n\t\t\t\t<div class="flex" style="'.concat("webssh"===t.pluginId?"dispaly:none;":"",'">\n\t\t\t\t\t<div class="layui-layer-shade"\t\n\t\t\t\t\t\tstyle="z-index:1989001; background-color:#000; opacity:0.3; filter:alpha(opacity=30);"></div>\n\t\t\t\t\t<div class="layui-layer layui-layer-page  layer-anim-05" id="plugin-view" type="page" times="2" showtime="0"\n\t\t\t\t\t\tcontype="string" style="z-index:1989001;width:640px;">\n\t\t\t\t\t\t<div class="layui-layer-title" style="cursor: move;">\n\t\t\t\t\t\t\t<span class="flex item-center">\n\t\t\t\t\t\t\t\t<img class="plugin-icon" src="/static/img/soft_ico/ico-').concat(-1!==(null==(e=t.pluginId)?void 0:e.indexOf("php-"))?"php":"mysqld"===t.pluginId?"mysql":t.pluginId,'.png" />\n\t\t\t\t\t\t\t\t<span class="plugin-name">').concat(t.pluginName,'</span>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="layui-layer-content">').concat(t.pluginHtml,'</div>\n\t\t\t\t\t\t<span class="layui-layer-setwin">\n\t\t\t\t\t\t\t<a class="layui-layer-ico layui-layer-close layui-layer-close2" href="javascript:;"></a>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>');const i=null==n?void 0:n.querySelector("#plugin-view");t.pluginHtml&&this.executeScripts(t.pluginHtml),this.dragElement(i),this.centerModal(i),this.closeModal(i)}runSrcipt(t){const e=document.createElement("script");e.innerHTML=t.innerHTML;const n=t.getAttribute("src");n&&e.setAttribute("src",n),document.body.appendChild(e),document.body.removeChild(e)}isDev(){return!1}async loadScripts(t,e){await Promise.all(t.map((t=>this.loadScript(t)))),e.forEach((t=>{eval.call(window,t)}))}loadScript(t){return new Promise(((e,n)=>{var i;const o=document.createElement("script");o.src=t,o.onload=()=>{e()},o.onerror=()=>{n()},null==(i=document.querySelector("#app"))||i.appendChild(o)}))}executeScripts(t){if(!t)return;const e=[],n=[],i=/<script\b([^>]*)>([\s\S]*?)<\/script>/gi;let o;for(;null!==(o=i.exec(t));){const t=o[1].match(/src="([^"]*)"/i);if(t){const n=t[1];e.push(n)}else{if(!(o[1].match(/type="text\/javascript"/i)||o[1].match(/type="module"/i)||o[1].match(/type="javascript\/text"/i)||!o[1].match(/type="text\/html"/i)))continue;const t=o[2];try{n.push(t)}catch(s){}}}this.loadScripts(e,n)}getUrlParams(){const t={},e=new URL(window.location.href);for(const[n,i]of e.searchParams.entries()){t[n.replace("?","")]=i}return t}};export{n as __vite_legacy_guard};
