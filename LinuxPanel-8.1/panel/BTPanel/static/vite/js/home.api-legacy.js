System.register(["./main-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636"],(function(t,e){"use strict";var n;return{setters:[function(t){n=t.I},null],execute:function(){t("l",(function(){return n.post("plugin/get_index_list")})),t("i",(function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return n.post("plugin/get_soft_list",{data:t})})),t("j",(function(t){return n.post("plugin?action=add_index",{data:{sName:t},customType:"model",check:"msg"})})),t("r",(function(t){return n.post("plugin?action=remove_index",{data:{sName:t},customType:"model",check:"msg"})})),t("v",(function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return n.post("warning/get_list",{data:t})})),t("q",(function(t){return n.post("safe/security/set_security",{data:t,customType:"model",check:"msg"})})),t("w",(function(t){return n.post("warning/set_ignore",{data:t,check:"msg"})})),t("m",(function(t){return n.post("plugin/sort_index",{data:t})})),t("c",(function(){return n.post("system/ReMemory")})),t("k",(function(t){return n.post("monitor/process_management/kill_process_all",{data:t,customType:"model",check:"msg"})})),t("p",(function(){return n.post("warning/get_scan_bar",{check:"msg"})})),t("t",(function(){return n.post("safe/security/get_repair_bar",{check:"msg",customType:"model"})})),t("s",(function(t){return n.post("panel/overview/SetOverview",{data:t,check:"msg",customType:"model"})})),t("o",(function(){return n.post("warning/get_tmp_result")})),t("n",(function(){return n.post("warning/kill_get_list")})),t("a",(function(){return n.post("tencent/get_config",{check:"msg",customType:"plugin"})})),t("b",(function(){return n.post("tencent/get_local_lighthouse",{check:"msg",customType:"plugin"})})),t("d",(function(){return n.post("tencent/get_request_pack",{check:"msg",customType:"plugin"})})),t("e",(function(){return n.post("tencent/get_snapshots_list",{check:"msg",customType:"plugin"})})),t("f",(function(t){return n.post("tencent/create_snapshots",{data:t,check:"msg",customType:"plugin"})})),t("x",(function(t){return n.post("tencent/set_config",{data:t,check:"msg",customType:"plugin"})})),t("h",(function(t){return n.post("tencent/delete_snapshots",{data:t,check:"msg",customType:"plugin"})})),t("u",(function(){return n.post("tencent/update_tencent",{check:"msg",customType:"plugin"})})),t("y",(function(){return n.post("tencent/cancel_config",{check:"msg",customType:"plugin"})})),t("g",(function(t,e){return n.post("plugin/get_soft_find",{data:t,check:"string"})})),t("z",(function(t){return n.post("system/set_rname",{data:t,check:"msg"})}))}}}));
