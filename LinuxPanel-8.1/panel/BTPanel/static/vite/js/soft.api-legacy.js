System.register(["./main-legacy.js?v=1714377894636"],(function(t,e){"use strict";var u;return{setters:[function(t){u=t.I}],execute:function(){t("g",(function(t){return u.post("plugin/get_soft_list",{data:t,customType:"default",check:"msg"})})),t("d",(function(t){return u.post("plugin/uninstall_plugin",{data:t,loading:"正在卸载，请稍候...",customType:"default",check:"msg"})})),t("s",(function(t){return u.post("plugin/save_plugin_settings",{data:t,customType:"default",check:"msg"})})),t("c",(function(t){return u.post("plugin/get_plugin_upgrades",{data:t,customType:"default",check:"msg"})})),t("r",(function(t){return u.post("plugin/repair_plugin",{data:t,loading:"正在获取最新版本，请稍候...",customType:"default",check:"msg"})})),t("a",(function(t){return u.post("deployment/GetList",{data:t,customType:"default",check:"msg"})})),t("b",(function(){return u.post("site/GetPHPVersion",{customType:"default",check:"msg"})})),t("e",(function(){return u.post("push/get_push_list",{check:"msg"})}))}}}));