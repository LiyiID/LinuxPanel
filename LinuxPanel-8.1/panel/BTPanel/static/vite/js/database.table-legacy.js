System.register(["./vue-lib-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636","./index-legacy38.js?v=1714377894636","./main-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636","./mysql.store-legacy.js?v=1714377894636","./element-lib-legacy.js?v=1714377894636","./index-legacy39.js?v=1714377894636","./empty-legacy.js?v=1714377894636","./switch-legacy.js?v=1714377894636","./index.vue_vue_type_style_index_0_lang-legacy.js?v=1714377894636","./index-legacy45.js?v=1714377894636","./index-legacy28.js?v=1714377894636"],(function(e,t){"use strict";var n,a,l,i,r,o,s,c,u,p,d,b,v,m,f,k,C,h,E,y;return{setters:[function(e){n=e.A,a=e.b,l=e.H,i=e.X},function(e){r=e.i},function(e){o=e.g,s=e.o,c=e.e,u=e.h,p=e.c,d=e.k,b=e.d,v=e.f},function(e){m=e.a,f=e.c,k=e.o,C=e.f},function(e){h=e.c},function(e){E=e.m},null,null,null,null,null,null,function(e){y=e.g}],execute:function(){var t=n(E()).mysqlData;E();var D=function(e,t,n){var a="本地数据库";return(e=h(e,"array",[])).forEach((function(e){e.id===n.sid&&(a="mysql"===t?e.db_host:e.ps,"127.0.0.1"===e.db_host&&(a="本地数据库"))})),a},w=y().refs,g=w.tableParam,B=w.tabActive,_=(e("e",(function(e){var t=e.sqliteBackup,n=e.manageDabase,i=e.deleteDataEvent;return a([o(),{label:r.t("DataBase.TableColumn.DataBaseName"),prop:"name"},{label:"备份",prop:"backup_count",minWidth:180,isCustom:!0,render:function(e){return l("span",{class:e.backup_count>0?"text-[#20a53a] cursor-pointer":"text-[#f0ad4e] cursor-pointer",on:{click:function(){t(e)}}},[e.backup_count>0?"有备份(".concat(e.backup_count,")"):"点击备份"])}},{label:"路径",prop:"path",minWidth:200,isCustom:!0,render:function(e){return l(m,{class:"w-full overflow-hidden overflow-ellipsis whitespace-nowrap inline-block",on:{click:function(){return s(e)}},attrs:{title:r.t("ClickOpenPath")}},[e.path])}},{label:"大小",prop:"size",render:function(e){return l("span",f(e.size))}},c([{onClick:n,title:"管理"},{onClick:i,title:"删除"}])])})),e("g",(function(e){var t=e.downBackEvent,n=e.delBackEvent;return a([{label:"名称",prop:"name"},{label:"时间",prop:"mtime",width:140,render:function(e){return l("span",C(e.mtime))}},{label:"大小",prop:"size",width:100,render:function(e){return l("span",f(e.size))}},c([{onClick:t,title:"下载"},{onClick:n,title:"删除"}])])})),e("i",(function(){return a([o(),{label:"数据库名称",prop:"name",width:200},{label:"表数量",prop:"table_num"},{label:"数据库位置",prop:"sid",render:function(e){var n="本地数据库";return t.value.serverList.forEach((function(t){t.id===e.sid&&(n=t.db_host,"0"==t.db_host&&(n="本地数据库"))})),l("span",n)}},{label:"大小",prop:"size"}])})),e("h",(function(e){var t=e.restoreBackEvent,n=e.downloadBackEvent,r=e.detailBackEvent,o=e.delBackEvent;return a([{label:"文件名称",prop:"name",width:250},{label:"备份时间",prop:"mtime",width:200,render:function(e){var t=new Date(1e3*e.mtime);return l("span",i(t,"YYYY-MM-DD HH:mm:ss"))}},v({prop:"size"}),c([{onClick:r,title:"详情"},{onClick:t,title:"恢复"},{onClick:n,title:"下载"},{onClick:o,title:"删除"}])])})),e("j",(function(e){var t=e.importDbFileEvent,n=e.delDatabaseFileEvent;return a([{label:"文件名",prop:"name",width:360},{label:"修改时间",width:200,render:function(e){var t=new Date(Math.floor(1e3*e.mtime));return l("span",i(t,"YYYY-MM-DD HH:mm:ss"))}},v({prop:"size"}),c([{onClick:t,title:"导入"},{onClick:n,title:"删除"}])])})),e("u",(function(e){var n=e.changePermissionEvent,i=e.editPasswordEvent,s=e.openToolsEvent,v=e.openPhpAdmin,m=e.deleteDataEvent,f=e.setBackupEvents,k=e.setQuotaEvent;return a([o(),{label:r.t("DataBase.TableColumn.DataBaseName"),prop:"name",sortable:"custom",minWidth:110},{label:r.t("Username"),prop:"username",minWidth:100,sortable:"custom"},u(),p({isCustom:!0,event:k}),d({event:f}),{label:r.t("DataBase.TableColumn.DatabasePosition"),render:function(e){var n="mysql"===B.value?t.value.serverList:g.value.serverList;return l("span",D(n,B.value,e))}},b({table:"databases"}),c([{isHide:function(e){return!!e.sid},onClick:v,title:"管理"},{onClick:n,title:"权限"},{onClick:i,title:"改密"},{onClick:s,title:"工具"},{onClick:m,title:"删除"}])])})),e("d",(function(e){var t=e.editPasswordEvent,n=e.changePermissionEvent,i=e.deleteDataEvent,s=e.setBackupEvents;return a([o(),{label:r.t("DataBase.TableColumn.DataBaseName"),prop:"name"},{label:r.t("Username"),prop:"username",minWidth:100},u(),d({event:s}),{label:r.t("DataBase.TableColumn.DatabasePosition"),render:function(e){var t="本地数据库";return g.value.serverList.forEach((function(n){n.id===e.sid&&(t=n.ps,"127.0.0.1"===n.db_host&&(t="本地数据库"))})),l("span",t)}},b({table:"databases"}),c([{onClick:n,title:"权限",isHide:k},{onClick:t,title:"改密"},{onClick:i,title:"删除"}])])})),e("b",(function(e){var t=e.editPasswordEvent,n=e.deleteDataEvent,i=e.setBackupEvents,s=e.toolEvents,p=e.permissionEvent;return a([o(),{label:r.t("DataBase.TableColumn.DataBaseName"),prop:"name",sortable:!0},{label:r.t("Username"),prop:"username",minWidth:100,sortable:!0},u(),d({event:i}),{label:r.t("DataBase.TableColumn.DatabasePosition"),render:function(e){var t="本地数据库";return g.value.serverList.forEach((function(n){n.id===e.sid&&(t=n.ps,"127.0.0.1"===n.db_host&&(t="本地数据库"))})),l("span",t)}},b({table:"databases"}),c([{onClick:p,title:"权限"},{onClick:s,title:"工具"},{onClick:t,title:"改密"},{onClick:n,title:"删除"}])])})),e("a",(function(e){var t=e.editPasswordEvent,n=e.deleteDataEvent;return a([o(),{label:r.t("DataBase.TableColumn.DataBaseName"),prop:"name"},{label:r.t("Username"),prop:"username",minWidth:100},u(),{label:r.t("DataBase.TableColumn.DatabasePosition"),render:function(e){var t="本地数据库";return g.value.serverList.forEach((function(n){n.id===e.sid&&(t=n.ps,"127.0.0.1"===n.db_host&&(t="本地数据库"))})),t}},b({table:"databases"}),c([{onClick:t,title:"改密"},{onClick:n,title:"删除"}])])})),e("l",(function(e){var t=e.executeEvent,n=e.editEvent,l=e.logEvent,i=e.delInBackEvent,r=e.recordsEvent;return a([{prop:"db_name",label:"数据库名"},{prop:"tb_name",label:"表名"},{prop:"full_size",label:"备份大小"},{prop:"last_backup_time",label:"备份时间"},c([{onClick:t,title:"执行"},{onClick:n,title:"编辑"},{onClick:l,title:"日志"},{onClick:r,title:"记录"},{onClick:i,title:"删除"}])])})),{alioss:"阿里云OSS",ftp:"FTP",sftp:"SFTP",msonedrive:"微软OneDrive",qiniu:"七牛云",txcos:"腾讯COS",upyun:"又拍云",jdcloud:"京东云",aws_s3:"亚马逊存储","Google Cloud":"谷歌云","Google Drive":"谷歌网盘",bos:"百度云",obs:"华为云"});e("k",(function(e){var t=e.restoreBackEvent,n=e.downBackEvent,i=e.delBackEvent;return a([o(),{label:"文件名称",prop:"name",width:200},{label:"存储对象",render:function(e){var t=!1,n="";return!Array.isArray(e.filename)&&"string"!=typeof e.filename||-1===e.filename.indexOf("|")?t=!1:(t=!0,n=e.filename.match(/\|(.+)\|/,"$1")),l("span",t?_[h(n,"array",[])[1]]:"本地")}},v({prop:"size"}),{width:120,prop:"addtime",label:"备份时间"},b({table:"backup"}),c([{onClick:t,title:"恢复"},{onClick:n,title:"下载"},{onClick:i,title:"删除"}])])})),e("c",(function(e){var t=e.setPsEvent,n=e.exportTableStructureEvent,i=e.repairEvent,r=e.optimizationEvent,s=e.conversionEngineEvent,u=[{onClick:n,title:"导出表结构",width:60},{onClick:function(e){return i(e)},title:"修复"},{onClick:function(e){return r(e)},title:"优化"},{onClick:function(e){return s(e)},title:"转换引擎",width:70}];return u=u.slice(1),a([o(),{label:"表名",prop:"table_name"},{label:"备注",prop:"comment",minWidth:100,isCustom:!0,render:function(e){var n={lt:"<",gt:">",nbsp:" ",amp:"&",quot:'"'};return e.comment=e.comment.replace(/&(lt|gt|nbsp|amp|quot);/gi,(function(e,t){return n[t]})),l("input",{attrs:{type:"text",placeholder:"点击编辑备注"},domProps:{value:e.comment},class:"bt-table-input w-full",on:{blur:function(n){if(e.comment===n.target.value)return!1;e.comment=n.target.value,t(e)},keyup:function(e){13===e.keyCode&&e.target.blur()}}})}},{label:"引擎",prop:"type",width:80},{label:"字符集",prop:"collation"},{label:"行数",align:"center",width:60,prop:"rows_count"},{label:"大小",prop:"data_size"},c(u)])})),e("f",(function(){var e=y().refs,n=e.tableParam,i=e.tabActive,r=e.dbRecycle;return a([{label:"数据库名称",prop:"name"},{label:"数据库大小",prop:"total",render:function(e){return l("span",f(e.total,!0,2))}},{label:"数据库位置",prop:"db_type",width:120,render:function(e){var a="mysql"===i.value?t.value.serverList:n.value.serverList;return l("span",D(a,i.value,e))}},{width:160,label:"创建时间",prop:"addtime"},{width:100,label:"删除结果",render:function(e){var a=l("span","移至回收站"),o="mysql"===i.value?t.value.serverList:n.value.serverList;return"本地数据库"!==D(o,i.value,e)?a=l("span",{style:"color: red"},"彻底删除"):(a=l("span",{style:"color: red"},"彻底删除"),r.value&&"mysql"===i.value&&(a=l("span","移至回收站"))),a}}])}))}}}));
