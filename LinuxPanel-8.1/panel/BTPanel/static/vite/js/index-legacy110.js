System.register(["./main-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636"],(function(r,e){"use strict";var t,n,i;return{setters:[function(r){t=r.m},function(r){n=r.a,i=r.b},null],execute:function(){r("a",(function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=r.message,n=r.complex,i=r.prefix,o=r.trigger;return t(e,"Object")||(e={}),t(i,"string")||(i=""),{validator:function(r,t,o){""===(t=t.trim())?o(new Error(e.value||"密码不能为空")):n.length&&t.length<n.length?o(new Error(e.length||"密码长度必须大于等于".concat(n.length,"位"))):n?o():n.small&&!/[a-z]/.test(t)?o(new Error(e.small||"".concat(i,"密码至少包含一个小写字母"))):n.big&&!/[A-Z]/.test(t)?o(new Error(e.big||"".concat(i,"密码至少包含一个大写字母"))):n.number&&!/[0-9]/.test(t)?o(new Error(e.number||"".concat(i,"密码至少包含一个数字"))):n.special&&!/[~!@#$%^&*()_+<>?:"{},.\/;'[\]]/.test(t)&&o(new Error(e.special||"".concat(i,"密码至少包含一个特殊字符")))},trigger:o||["blur","change"]}})),r("i",(function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=r.message,i=r.trigger;return t(e,"Object")||(e={}),{validator:function(r,t,i){""===(t=t.trim())?i(new Error(e.value||"IP地址不能为空")):n(t)?i():i(new Error(e.ip||"IP地址格式错误"))},trigger:i||["blur","change"]}})),r("b",(function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=r.message,n=r.trigger;return t(e,"Object")||(e={}),{validator:function(r,t,n){var i=Array.from(new Set(["/","/www","/bin","/boot","/dev","/etc","/lib","/media","/mnt","/opt","/proc","/root","/run","/sbin","/srv","/sys","/tmp","/usr","/var"]));""===(t=t.trim())?n(new Error(e.value||"目录不能为空")):i.includes(t)?n(new Error("目录为系统保留目录, 请重新选择")):n()},trigger:n||["blur","change"]}})),r("p",(function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=r.message,n=r.trigger;return t(e,"Object")||(e={}),{validator:function(r,t,n){""===t?n(new Error(e.value||"端口不能为空")):i(t)?n():n(new Error(e.port||"端口格式错误, 请填写1-65535之间的数字"))},trigger:n||["blur","change"]}}))}}}));
