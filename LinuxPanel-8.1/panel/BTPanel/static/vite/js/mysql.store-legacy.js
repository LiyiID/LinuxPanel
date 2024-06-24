!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return n};var a,n={},r=Object.prototype,o=r.hasOwnProperty,c=Object.defineProperty||function(t,e,a){t[e]=a.value},s="function"==typeof Symbol?Symbol:{},u=s.iterator||"@@iterator",i=s.asyncIterator||"@@asyncIterator",d=s.toStringTag||"@@toStringTag";function p(t,e,a){return Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{p({},"")}catch(a){p=function(t,e,a){return t[e]=a}}function l(t,e,a,n){var r=e&&e.prototype instanceof v?e:v,o=Object.create(r.prototype),s=new O(n||[]);return c(o,"_invoke",{value:q(t,a,s)}),o}function f(t,e,a){try{return{type:"normal",arg:t.call(e,a)}}catch(t){return{type:"throw",arg:t}}}n.wrap=l;var h="suspendedStart",m="suspendedYield",g="executing",y="completed",b={};function v(){}function k(){}function _(){}var w={};p(w,u,(function(){return this}));var T=Object.getPrototypeOf,x=T&&T(T(P([])));x&&x!==r&&o.call(x,u)&&(w=x);var S=_.prototype=v.prototype=Object.create(w);function L(t){["next","throw","return"].forEach((function(e){p(t,e,(function(t){return this._invoke(e,t)}))}))}function j(e,a){function n(r,c,s,u){var i=f(e[r],e,c);if("throw"!==i.type){var d=i.arg,p=d.value;return p&&"object"==t(p)&&o.call(p,"__await")?a.resolve(p.__await).then((function(t){n("next",t,s,u)}),(function(t){n("throw",t,s,u)})):a.resolve(p).then((function(t){d.value=t,s(d)}),(function(t){return n("throw",t,s,u)}))}u(i.arg)}var r;c(this,"_invoke",{value:function(t,e){function o(){return new a((function(a,r){n(t,e,a,r)}))}return r=r?r.then(o,o):o()}})}function q(t,e,n){var r=h;return function(o,c){if(r===g)throw new Error("Generator is already running");if(r===y){if("throw"===o)throw c;return{value:a,done:!0}}for(n.method=o,n.arg=c;;){var s=n.delegate;if(s){var u=D(s,n);if(u){if(u===b)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(r===h)throw r=y,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r=g;var i=f(t,e,n);if("normal"===i.type){if(r=n.done?y:m,i.arg===b)continue;return{value:i.arg,done:n.done}}"throw"===i.type&&(r=y,n.method="throw",n.arg=i.arg)}}}function D(t,e){var n=e.method,r=t.iterator[n];if(r===a)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=a,D(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),b;var o=f(r,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,b;var c=o.arg;return c?c.done?(e[t.resultName]=c.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=a),e.delegate=null,b):c:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,b)}function E(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function G(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function O(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(E,this),this.reset(!0)}function P(e){if(e||""===e){var n=e[u];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var r=-1,c=function t(){for(;++r<e.length;)if(o.call(e,r))return t.value=e[r],t.done=!1,t;return t.value=a,t.done=!0,t};return c.next=c}}throw new TypeError(t(e)+" is not iterable")}return k.prototype=_,c(S,"constructor",{value:_,configurable:!0}),c(_,"constructor",{value:k,configurable:!0}),k.displayName=p(_,d,"GeneratorFunction"),n.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===k||"GeneratorFunction"===(e.displayName||e.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,_):(t.__proto__=_,p(t,d,"GeneratorFunction")),t.prototype=Object.create(S),t},n.awrap=function(t){return{__await:t}},L(j.prototype),p(j.prototype,i,(function(){return this})),n.AsyncIterator=j,n.async=function(t,e,a,r,o){void 0===o&&(o=Promise);var c=new j(l(t,e,a,r),o);return n.isGeneratorFunction(e)?c:c.next().then((function(t){return t.done?t.value:c.next()}))},L(S),p(S,d,"Generator"),p(S,u,(function(){return this})),p(S,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var e=Object(t),a=[];for(var n in e)a.push(n);return a.reverse(),function t(){for(;a.length;){var n=a.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},n.values=P,O.prototype={constructor:O,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=a,this.done=!1,this.delegate=null,this.method="next",this.arg=a,this.tryEntries.forEach(G),!t)for(var e in this)"t"===e.charAt(0)&&o.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=a)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,r){return s.type="throw",s.arg=t,e.next=n,r&&(e.method="next",e.arg=a),!!r}for(var r=this.tryEntries.length-1;r>=0;--r){var c=this.tryEntries[r],s=c.completion;if("root"===c.tryLoc)return n("end");if(c.tryLoc<=this.prev){var u=o.call(c,"catchLoc"),i=o.call(c,"finallyLoc");if(u&&i){if(this.prev<c.catchLoc)return n(c.catchLoc,!0);if(this.prev<c.finallyLoc)return n(c.finallyLoc)}else if(u){if(this.prev<c.catchLoc)return n(c.catchLoc,!0)}else{if(!i)throw new Error("try statement without catch or finally");if(this.prev<c.finallyLoc)return n(c.finallyLoc)}}}},abrupt:function(t,e){for(var a=this.tryEntries.length-1;a>=0;--a){var n=this.tryEntries[a];if(n.tryLoc<=this.prev&&o.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var r=n;break}}r&&("break"===t||"continue"===t)&&r.tryLoc<=e&&e<=r.finallyLoc&&(r=null);var c=r?r.completion:{};return c.type=t,c.arg=e,r?(this.method="next",this.next=r.finallyLoc,b):this.complete(c)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),b},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var a=this.tryEntries[e];if(a.finallyLoc===t)return this.complete(a.completion,a.afterLoc),G(a),b}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var a=this.tryEntries[e];if(a.tryLoc===t){var n=a.completion;if("throw"===n.type){var r=n.arg;G(a)}return r}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:P(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=a),b}},n}function a(t,e,a,n,r,o,c){try{var s=t[o](c),u=s.value}catch(i){return void a(i)}s.done?e(u):Promise.resolve(u).then(n,r)}function n(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var c=t.apply(e,n);function s(t){a(c,r,o,s,u,"next",t)}function u(t){a(c,r,o,s,u,"throw",t)}s(void 0)}))}}System.register(["./vue-lib-legacy.js?v=1714377894636","./main-legacy.js?v=1714377894636","./check-legacy.js?v=1714377894636","./locales-lib-legacy.js?v=1714377894636"],(function(t,a){"use strict";var r,o,c,s,u,i,d,p,l,f,h,m;return{setters:[function(t){r=t.z,o=t.b,c=t.v,s=t.c},function(t){u=t.I,i=t.o,d=t.ae,p=t.af,l=t.J,f=t.ag,h=t.ah},function(t){m=t.c},null],execute:function(){t("az",(function(t){return u.post("database/add_database_types",{data:t,check:"msg"})})),t("ay",(function(t){return u.post("database/delete_database_types",{data:t,check:"msg"})})),t("aA",(function(t){return u.post("database/update_database_types",{data:t,check:"msg"})})),t("s",(function(t){return u.post("database/set_database_type_by_name",{data:t,check:"msg"})})),t("T",(function(t){return u.post("database/AddDatabase",{data:t,check:"msg"})})),t("W",(function(t){return u.post("database/SetupPassword",{data:t,check:"msg"})})),t("E",(function(t){return u.post("database/GetDatabaseAccess",{data:t,check:"msg"})})),t("k",(function(t,e){return u.post("database/".concat(e,"/GetDatabaseAccess"),{data:t,check:"msg",customType:"model"})})),t("C",(function(t){return u.post("database/SetDatabaseAccess",{data:t,check:"msg"})})),t("x",(function(t){return u.post("/database/pgsql/modify_pgsql_listen_ip",{data:t,check:"msg",customType:"model"})})),t("l",(function(t,e){return u.post("database/".concat(e,"/SetDatabaseAccess"),{data:t,check:"msg",customType:"model"})})),t("t",(function(t){return u.post("database/GetInfo",{data:t,check:"ignore"})})),t("r",(function(t){return u.post("database/ReTable",{data:t,check:"msg"})})),t("p",(function(t){return u.post("database/OpTable",{data:t,check:"msg"})})),t("q",(function(t){return u.post("database/AlTable",{data:t,check:"msg"})})),t("R",(function(t){return u.post("database/ResDatabasePassword",{data:t,check:"msg"})})),t("F",(function(t){return u.post("database/check_del_data",{data:t,check:"ignore"})})),t("B",(function(t){return u.post("database/ToBackup",{data:t,check:"msg"})})),t("ai",(function(t){return u.post("database/DelBackup",{data:t,check:"msg"})})),t("S",(function(t,e){return u.post("database/SyncToDatabases&type=".concat(e),{data:t,check:"msg"})})),t("ab",(function(t){return u.post("database/SyncGetDatabases",{data:t,check:"msg"})})),t("D",(function(t,e){return e?u.post("database/".concat(e,"/DeleteDatabase"),{data:t,check:"msg",customType:"model"}):u.post("database/DeleteDatabase",{data:t,check:"msg"})})),t("af",(function(t){return u.post("database/InputSql",{data:t,check:"msg"})})),t("ad",(function(t){return u.post("/database/mongodb/InputSql",{data:t,check:"msg",customType:"model"})})),t("ae",(function(t){return u.post("/database/pgsql/InputSql",{data:t,check:"msg",customType:"model"})})),t("ar",(function(){return u.post("project/binlog/get_binlog_status",{customType:"model",check:"ignore"})})),t("aq",(function(t){return u.post("project/binlog/get_backup",{data:t,customType:"model",check:"ignore"})})),t("an",(function(t){return u.post("project/binlog/export_time_database",{data:t,customType:"model",check:"ignore"})})),t("ao",(function(t){return u.post("crontab/StartTask",{data:t,check:"msg"})})),t("am",(function(t){return u.post("project/binlog/restore_time_database",{data:t,customType:"model",check:"ignore"})})),t("al",(function(t){return u.post("crontab/GetLogs",{data:t,check:"msg"})})),t("at",(function(t){return u.post("project/binlog/get_increment_crontab",{data:t,check:"ignore",customType:"model"})})),t("ap",(function(t){return u.post("crontab/DelCrontab",{data:t,check:"msg"})})),t("d",(function(t){return u.post("data/getKey",{data:t,check:"string"})})),t("a1",(function(t){return u.post("database/AddCloudServer",{data:t,check:"msg"})})),t("z",(function(t){return u.post("database/RemoveCloudServer",{data:t,check:"msg"})})),t("a3",(function(t){return u.post("database/ModifyCloudServer",{data:t,check:"msg"})})),t("as",(function(){return u.post("project/binlog/get_databases",{customType:"model",check:"ignore"})})),t("a",(function(t,e){return u.post("database/".concat(e,"/GetCloudServer"),{customType:"model",data:t})})),t("g",(function(t,e){return u.post("database/".concat(e,"/get_list"),{customType:"model",data:t,check:"ignore"})})),t("u",(function(t,e){return u.post("database/".concat(e,"/GetInfo"),{customType:"model",data:t,check:"ignore"})})),t("v",(function(t){return u.post("database/ModifyTableComment",{data:t,check:"msg"})})),t("w",(function(t){return u.post("database/export_table_structure",{data:t,check:"msg"})})),t("e",(function(t,e){return u.post("database/".concat(e,"/SyncToDatabases"),{customType:"model",data:t,check:"msg"})})),t("j",(function(t,e){return u.post("database/".concat(e,"/ResDatabasePassword"),{customType:"model",data:t,check:"msg"})})),t("G",(function(t,e){return u.post("database/".concat(e,"/AddDatabase"),{customType:"model",data:{data:JSON.stringify(t)},check:"msg"})})),t("i",(function(t,e){return u.post("database/".concat(e,"/check_del_data"),{data:t,customType:"model",check:"ignore"})})),t("ac",(function(t,e){return u.post("database/".concat(e,"/SyncGetDatabases"),{customType:"model",data:t,check:"msg"})})),t("M",(function(t){return u.post("database/".concat(t,"/get_root_pwd"),{customType:"model",check:"msg"})})),t("h",(function(t,e){return u.post("database/".concat(e,"/set_root_pwd"),{customType:"model",data:t,check:"msg"})})),t("a2",(function(t,e){return u.post("database/".concat(e,"/AddCloudServer"),{customType:"model",data:t,check:"msg"})})),t("A",(function(t,e){return u.post("database/".concat(e,"/RemoveCloudServer"),{customType:"model",data:t,check:"msg"})})),t("a4",(function(t,e){return u.post("database/".concat(e,"/ModifyCloudServer"),{customType:"model",data:t,check:"msg"})})),t("o",(function(){return u.post("database/mongodb/get_root_pwd",{customType:"model"})})),t("n",(function(t){return u.post("database/mongodb/set_auth_status",{customType:"model",data:t,check:"msg"})})),t("U",(function(t){return u.post("database/CheckDatabaseStatus",{data:t,check:"msg"})})),t("V",(function(t,e){return u.post("database/".concat(e,"/CheckDatabaseStatus"),{customType:"model",data:t,check:"msg"})})),t("f",(function(t,e){return u.post("database/".concat(e,"/ToBackup"),{customType:"model",data:t,check:"msg"})})),t("X",(function(){return u.post("site/GetPHPVersion")})),t("Z",(function(){return u.post("ajax/get_phpmyadmin_ssl",{check:"ignore"})})),t("a0",(function(t){return u.post("ajax/set_phpmyadmin_ssl",{data:t,check:"msg"})})),t("_",(function(t){return u.post("ajax/change_phpmyadmin_ssl_port",{data:t,check:"msg"})})),t("Y",(function(t){return u.post("ajax/setPHPMyAdmin",{data:t,check:"msg"})})),t("I",(function(t){return u.post("database/sqlite/get_backup_list",{data:t,customType:"model",check:"msg"})})),t("y",(function(t){return u.post("database/sqlite/ToBackup",{data:t,customType:"model",check:"msg"})})),t("H",(function(t){return u.post("database/sqlite/DelBackup",{data:t,customType:"model",check:"msg"})})),t("L",(function(t){return u.post("database/sqlite/get_table_list",{data:t,customType:"model",check:"msg"})})),t("K",(function(t){return u.post("database/sqlite/get_table_info",{data:t,customType:"model",check:"msg"})})),t("N",(function(t){return u.post("database/sqlite/get_keys_bytable",{data:t,customType:"model",check:"msg"})})),t("Q",(function(t){return u.post("database/sqlite/create_table_data",{data:t,customType:"model",check:"msg"})})),t("P",(function(t){return u.post("database/sqlite/update_table_info",{data:t,customType:"model",check:"msg"})})),t("J",(function(t){return u.post("database/sqlite/delete_table_data",{data:t,customType:"model",check:"msg"})})),t("O",(function(t){return u.post("database/sqlite/query_sql",{data:t,customType:"model",check:"msg"})})),t("a8",(function(t){return u.post("database/InputSqlAll",{data:t,check:"msg"})})),t("a7",(function(t){return u.post("files/DeleteFile",{data:t,check:"msg"})})),t("aa",(function(t){return u.post("database/ToBackupAll",{data:t,check:"msg"})})),t("a9",(function(t){return u.post("database/GetAllBackup",{data:t,check:"ignore"})})),t("a5",(function(t){return u.post("database/GetBackupDatabase",{data:t,check:"ignore"})})),t("a6",(function(t){return u.post("database/GetBackupInfo",{data:t,check:"ignore"})})),t("b",(function(t){return u.post("plugin/get_soft_find",{data:t,check:"string"})})),t("au",(function(t){return u.post("project/quota/modify_database_quota",{data:{data:t},customType:"model",check:"msg"})})),t("av",(function(t){return u.post("project/quota/recover_database_insert_accept",{customType:"model",data:t,check:"msg"})})),t("$",(function(t){return u.post("system/ServiceAdmin",{data:t,check:"msg"})})),t("ax",(function(t){return u.post("project/binlog/add_mysql_increment_crontab",{data:t,customType:"model",check:"msg"})})),t("aw",(function(t){return u.post("project/binlog/modify_mysql_increment_crontab",{data:t,customType:"model",check:"msg"})})),t("ah",(function(t){return u.post("crontab/cloud_backup_download",{data:t})})),t("aj",(function(t){return u.post("data/getData",{data:t})})),t("ak",(function(t){return u.post("crontab/DelLogs",{data:t,check:"msg"})})),t("ag",(function(t,e){return u.post("database/".concat(e,"/InputSql"),{data:t,check:"msg",customType:"model"})})),t("c",(function(){return u.post("database/get_mysql_status",{check:"msg"})}));var a=t("m",r("MYSQL-STORE",(function(){var t=o(!1),a="databases",r=c({search:"",total:0,limit:10,order:"",serverList:[],databaseList:[],historySearch:[],typeList:[]}),g=o([]),y=o(""),b=c({type:"day",week:"1",hour:"1",minute:"30",where1:"1"}),v=c({notice:0,notice_channel:"all"}),k=function(){var t=n(e().mark((function t(){var n,o,c,s,u=arguments;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=u.length>0&&void 0!==u[0]?u[0]:1,t.prev=1,o={p:n,limit:r.limit,table:a,search:r.search,order:r.order},"number"==typeof y.value?o.sid=y.value:delete o.sid,!i){t.next=11;break}return t.next=8,d(o);case 8:t.t0=t.sent,t.next=14;break;case 11:return t.next=13,p(o);case 13:t.t0=t.sent;case 14:c=t.t0,s=c.data,r.databaseList=s.data,r.total=l(s.page),r.historySearch=s.search_history.map((function(t){var e=t.val;return{label:e,value:e}})),t.next=24;break;case 21:t.prev=21,t.t1=t.catch(1);case 24:case"end":return t.stop()}}),t,null,[[1,21]])})));return function(){return t.apply(this,arguments)}}(),_=function(){var t=n(e().mark((function t(a){var n;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e={db_type:a},u.post("database/view_database_types",{data:e,check:"ignore"});case 3:n=t.sent,r.typeList=m(n.msg,"array",[]),t.next=9;break;case 7:t.prev=7,t.t0=t.catch(0);case 9:case"end":return t.stop()}var e}),t,null,[[0,7]])})));return function(e){return t.apply(this,arguments)}}(),w=function(){var t=n(e().mark((function t(){var a;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,f();case 3:a=t.sent,r.serverList=m(a,"array",[]),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0);case 10:case"end":return t.stop()}}),t,null,[[0,7]])})));return function(){return t.apply(this,arguments)}}(),T=s((function(){var t,e=[];r.serverList.length&&(null===(t=r.serverList)||void 0===t||t.forEach((function(t){""===t.id?e.all=t.db_host:e[t.id]="127.0.0.1"===t.db_host?"本地数据库":t.db_host})));return e})),x=function(){var t=n(e().mark((function t(){var a,n,r;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,h();case 3:for(r in a=t.sent,n=[],a.data)n.push(a.data[r]);n.unshift({name:"all",title:"全部",data:{name:"all"}}),g.value=n,t.next=13;break;case 10:t.prev=10,t.t0=t.catch(0);case 13:case"end":return t.stop()}}),t,null,[[0,10]])})));return function(){return t.apply(this,arguments)}}();return{mysqlSetup:t,tableName:a,mysqlData:r,getDatabaseType:_,initMysql:function(){Promise.all([_("mysql"),w(),k()])},getDatabase:k,getServerList:w,mysqlServerType:T,sid:y,timeForm:b,noticeForm:v,msgData:g,getMsgConfig:x}}),{persist:{storage:sessionStorage,paths:["mysqlData"]}})),g=Object.freeze(Object.defineProperty({__proto__:null,mysqlStore:a},Symbol.toStringTag,{value:"Module"}));t("aB",g)}}}))}();
