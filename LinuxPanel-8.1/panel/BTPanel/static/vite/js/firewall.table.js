import{v as e,b as t,H as a}from"./vue-lib.js?v=1714377894636";import{_ as l}from"./index46.js?v=1714377894636";import{g as r,a as p,aL as n,aM as s,f as i,p as o}from"./main.js?v=1714377894636";import{b as d,k as c}from"./firewall.popup.js?v=1714377894636";import{c as b}from"./check.js?v=1714377894636";import{g as u,a as m,e as k}from"./index38.js?v=1714377894636";const h=e({3306:"MySQL服务默认端口",888:"phpMyAdmin默认端口",22:"SSH远程服务",20:"FTP主动模式数据端口",21:"FTP协议默认端口","39000-40000":"FTP被动模端口范围","30000-40000":"FTP被动模端口范围",11211:"Memcached服务端口",873:"rsync数据同步服务",8888:"宝塔Linux面板默认端口"}),_=e({title:"标题",body:"网页内",keywords:"关键词",descriptions:"描述",title_update:"标题更新",keywords_update:"关键词更新",description_update:"描述更新",tail_hash_update:"尾部script代码块更新",title_hash_update:"头部head代码块更新"}),y=e({1:"全站扫描",2:"快速扫描",3:"单URL"}),v=[{title:"高风险",value:0,class:"text-[#F50606]",name:"risk_high"},{title:"中危",value:0,class:"text-[#FF9900]",name:"risk_mod"},{title:"低危",value:0,class:"text-[#DDC400]",name:"risk_low"},{title:"网站数量",value:0,class:"text-[#333]",name:"site_count"},{title:"告警次数",value:0,class:"text-[#333]",name:"risk_count"}],{refs:{authType:w,tencentDataG:g,tencentCVM:C,panelType:f}}=r(),x=({updatePolicy:e,updataEvent:l,deleteRow:r,showPortDetails:n,openTencentPort:s})=>t([u(),{label:"协议",prop:"protocol"},{label:"端口",prop:"ports",width:300,render:(e,t)=>{e.brief=h[e.ports]||e.brief;const l=e.type||"";return a("div",[a("span",{class:"mr-[1rem]"},[e.ports]),"tencent"!=l&&Object.keys(g).length>0&&f.value.includes("tencent")?a(p,{on:{click:()=>{s(e)}}},["点击放行，腾讯轻量云防火墙端口"]):""])}},{label:"状态",renderHeader:()=>a("div",[a("span",["状态"]),a(p,{class:"ml-4x bt-ico-ask",on:{click:()=>{window.open("https://www.bt.cn/bbs/thread-4708-1-1.html")}}},["?"])]),prop:"status",render:(e,t)=>a("div",[a("span",[0===e.status?"未使用":1===e.status?"外网不通":"正常"]),a(p,{class:2!==e.status?"!hidden":"",on:{click:()=>{n(e)}}},["（详情）"])])},{label:"策略",prop:"types",render:(t,l)=>a(p,{attrs:{type:"accept"===t.types?"primary":"danger"},on:{click:()=>{e(t)}}},["accept"==t.types?"允许":"拒绝"])},{label:"来源",prop:"address",render:(e,t)=>a("div",[e.sid>0?a("span",{attrs:{title:e.domain}},[e.domain]):""===e.address?a("span",["所有IP"]):a("span",{attrs:{title:e.address}},[e.address])])},{label:"备注",prop:"brief",render:e=>a("span",[h[e.ports]||e.brief])},{label:"时间",prop:"addtime"},k([{onClick:l,title:"修改"},{onClick:r,title:"删除"}])]),P=({updatePolicy:e,updataEvent:l,deleteRow:r})=>t([u(),{label:"IP地址",prop:"address"},{label:"IP归属地",prop:"area",render:e=>{if("ltd"!=w.value)return a(p,{on:{click:()=>{o({sourceId:116})}}},["点击查看"]);const t=e.area;return a("span",[(t.continent||"")+(t.info||"--")])}},{label:"策略",prop:"types",render:t=>a(p,{attrs:{type:"accept"===t.types?"primary":"danger"},on:{click:()=>{e(t)}}},["accept"==t.types?"放行":"屏蔽"])},{label:"备注",prop:"brief"},{label:"时间",prop:"addtime"},k([{onClick:l,title:"修改"},{onClick:r,title:"删除"}])]),R=({updataEvent:e,deleteRow:l})=>t([u(),{label:"协议",prop:"protocol"},{label:"源端口",prop:"start_port"},{label:"目标IP",prop:"ended_ip",render:e=>(""==e.ended_ip&&(e.ended_ip="127.0.0.1"),a("span",[e.ended_ip]))},{label:"目标端口",prop:"ended_port"},{label:"时间",prop:"addtime"},k([{onClick:e,title:"修改"},{onClick:l,title:"删除"}])]),E=({updataEvent:e,deleteRow:l})=>t([u(),{label:"地区",prop:"country",render:e=>a("span",[e.country+"("+e.brief+")"])},{label:"策略",prop:"types",render:e=>a(p,{attrs:{type:"accept"===e.types?"primary":"danger"},class:"cursor-default"},["accept"==e.types?"放行":"屏蔽"])},{label:"端口",prop:"ports",render:e=>a("span",[e.ports?e.ports:"全部"])},{label:"时间",prop:"addtime"},k([{onClick:e,title:"修改"},{onClick:l,title:"删除"}])]),I=({changeIpStatus:e})=>t([{label:"IP地址:端口",prop:"address",render:t=>a(p,{on:{click:()=>e(t)},class:t.deny_status?"!text-[#999] line-through":""},[t.address,":",a("span",{class:"text-[#666] cursor-default !no-underline"},t.port)])},{label:"归属地",prop:"area",render:e=>{const t=e.area;return a("span",[t.info||"--"])}},{label:"用户",prop:"user"},{label:"状态",prop:"status",render:(e,t)=>a(p,{props:{type:e.status?"primary":"danger"}},e.status?"登录成功":"登录失败")},{label:"操作时间",prop:"time"}]),S=({changeStatus:e,setPsEvent:l,scanRow:r,deleteRow:p})=>t([u(),{label:"目录",prop:"path"},m({prop:"open",event:e,data:["已停止","运行中"]}),{label:"备注",prop:"ps",minWidth:200,isCustom:!0,render:e=>{var t;const r={lt:"<",gt:">",nbsp:" ",amp:"&",quot:'"'};return e.ps=null==(t=e.ps)?void 0:t.replace(/&(lt|gt|nbsp|amp|quot);/gi,(function(e,t){return r[t]})),a("input",{attrs:{type:"text",placeholder:"点击编辑备注"},domProps:{value:e.ps},class:"bt-table-input w-full",on:{blur:t=>{if(e.ps===t.target.value)return!1;e.ps=t.target.value,l(e)}}})}},k([{onClick:r,title:"扫描"},{onClick:p,title:"删除"}])]),F=({showRiskDetails:e})=>t([{label:"巡检时间",prop:"time",render:e=>{const t=b(e.time,"number",0);return a("span",[i(t)])}},{label:"检测域名",prop:"site_name"},{label:"检测方式",prop:"method",render:e=>y[e.method]},{label:"检测页面数",prop:"scans"},{label:"巡检结果",render:t=>[0===t.risks?a("span",{class:"text-[#20a53a]"},["无风险 "]):a(p,{attrs:{type:"danger"},on:{click:()=>{e(t)}}},[t.risks])]}]),L=({showFileEvent:e})=>t([{label:"巡检时间",prop:"time",width:"150px",render:e=>{const t=b(e.time,"number",0);return a("span",[i(t)])}},{label:"URL",prop:"url",render:e=>[a(p,{attrs:{title:e.url},on:{click:()=>{window.open(e.url)}}},[e.url])]},{label:"关键词",prop:"content",width:"200px",render:e=>a("span",{class:"flex"},[a("span",{class:"min-w-[13rem] flex-1",attrs:{title:e.content}},[e.content])])},{label:"类型",prop:"risk_content",width:"200px",render:e=>a("span",[e.risk_content])},{label:"风险位置",prop:"risk_type",width:"150px",render:e=>a("span",[_[e.risk_type]])},k([{onClick:e,title:"详情"}])]),T=({getScanEvent:e,updataRow:l,deleteRow:r})=>t([{label:"监控名",prop:"name"},{label:"网站/URL",prop:"url"},{label:"监控方式",prop:"method",render:e=>a("span",[y[e.method]])},{label:"上一次检测时间",prop:"last_scan_time",render:e=>[e.last_scan_time>0?a("span",[n(e.last_scan_time)]):a("span",["未检测"])]},{label:"上一次风险",prop:"last_risk_count",render:e=>[e.last_risk_count>0?a(p,{attrs:{type:"danger"},on:{click:()=>{d(e)}}},[e.last_risk_count]):a("span",["无风险"])]},{label:"计划任务状态",prop:"crontab_status",render:e=>[1===e.crontab_status?a("span",["正常"]):a(p,{attrs:{type:"warning",title:"点击设置"},on:{click:()=>{c(e)}}},["未设置"])]},{label:"发送告警",prop:"send_msg",render:e=>a(p,{attrs:{type:1===e.send_msg?"primary":"warning"},on:{click:()=>{l(e)}}},[1===e.send_msg?"已开启":"未开启"])},{label:"检测频率",prop:"crontab_info",render:e=>e.crontab_info?e.crontab_info.cycle:e.crontab_info},k([{onClick:e,title:"立即检测",width:70},{onClick:l,title:"编辑"},{onClick:r,title:"删除"}])]),j=({showHistoryDetails:e,openHistoryReport:l})=>t([{label:"网站列表",prop:"site_name"},{label:"扫描URL总数",prop:"scans"},{label:"扫描耗时",prop:"time",render:e=>[e.end_time<=1||e.end_time-e.start_time<=0?a("span",["0秒"]):a("span",[s(e.end_time-e.start_time)])]},{label:"风险次数",prop:"risks",render:t=>[0==t.risks?a("span",["无风险"]):a(p,{attrs:{type:"danger"},on:{click:()=>{e(t)}}},[t.risks])]},{label:"状态",prop:"status",render:e=>[0===e.is_status&&0===e.end_time||1===e.end_time?a("span",{class:"text-red"},["扫描未完成"]):1===e.is_status&&0===e.end_time?a("span",{class:"text-[#fc6d26]"},["扫描中"]):a("span",["扫描完成"])]},{label:"扫描时间",prop:"start_time",render:e=>{const t=b(e.start_time,"number",0);return a("span",[i(t)])}},{label:"操作",align:"right",width:200,render:e=>[0===e.is_status&&0===e.end_time||1===e.end_time||1===e.is_status&&0===e.end_time?a("div",{class:"flex items-center justify-end"},[a("span",{class:"text-[#c8c9cc] cursor-not-allowed"},["扫描未完成"])]):a("div",{class:"flex items-center justify-end"},[a(p,{on:{click:()=>{l(e)}}},["查看报告"])])]}]),D=({changeIntrusion:e,changeOpen:r,getLogs:p})=>t([{label:"用户",prop:"0"},{label:"总次数",prop:"4",render:e=>a("span",{class:e[4].totla>0?"!text-danger":""},e[4].totla)},{label:"当日次数",prop:"4",render:e=>a("span",{class:e[4].day_totla>0?"!text-danger":""},e[4].day_totla)},{label:"防入侵",prop:"3",render:t=>a(l,{props:{value:t[3],size:"mini",change:a=>e(t,a)}})},{label:"日志状态",prop:"5",render:(e,t)=>a(l,{props:{value:e[5],size:"mini",change:a=>r(e,t,a)}})},{label:"描述",prop:"6"},k([{onClick:p,title:"命令日志",width:70}])]),A=({deleteRow:e})=>t([{label:"进程名",prop:"",render:(e,t)=>a("span",[e])},k([{onClick:e,title:"删除"}])]),H=()=>t([{label:"操作",prop:"log"},{label:"时间",prop:"addtime"}]),z=({changeOpen:e,updateRow:r})=>t([{label:"名称",prop:"name"},{label:"描述",prop:"ps"},{label:"状态",prop:"open",render:t=>a(l,{props:{value:t.open,size:"mini",change:a=>e(t,a)}})},k([{onClick:r,title:"配置"}])]),M=({removeSshLimitEvent:e})=>t([{label:"名称",prop:"address"},{label:"封锁时间",prop:"end",render:e=>0==e.end?a("span","永久封禁"):a("span",s(e.end-e.start))},k([{onClick:e,title:"立即解封",width:70}])]),U=()=>t([{label:"时间",prop:"addtime"},{label:"详情",prop:"log"}]),O=({deleteRow:e})=>t([{label:"IP地址",prop:"ip"},k([{onClick:e,title:"删除"}])]),W=({deleteRow:e})=>t([u(),{label:"路径",prop:"path"},{label:"类型",prop:"typeTitle"},k([{onClick:e,title:"删除"}])]),B=({deleteRow:e})=>t([{label:"关键词\t",prop:"0",render:e=>a("span",{class:"text-blue-500"},[e])},k([{onClick:e,title:"删除"}])]),q=({setFileMonitor:e,lookSiteSafeLog:r,changeOpen:p})=>t([{label:"网站名称",prop:"site_name"},{label:"防护状态",prop:"open",render:e=>a(l,{props:{value:e.open,change:t=>p(e.site_name,t),size:"mini"}})},{label:"今日触发",prop:"total.day_total"},{label:"触发总数",prop:"total.total"},{label:"PHP版本",prop:"version",render:e=>e.version.includes("不兼容")?a("span",{class:"!text-warning"},e.version):a("span",e.version)},k([{onClick:e,title:"设置"},{onClick:r,title:"日志"}])]),G=()=>t([{label:"路径",prop:"path",render:e=>a(p,e.path)},{label:"类型",prop:"type",render:e=>"".concat("dir"===e.type?"文件夹":"文件")},{label:"告警操作",render:e=>{let t=[];return parseInt(e.read)&&t.push("读取"),parseInt(e.del)&&t.push("写入"),parseInt(e.reit)&&(t.push("修改"),t.push("增加")),"".concat(t.join("/"))}}]),Q=({fileEditorOpen:e,recycleBinRecover:t,recycleBinDelete:l})=>[{label:"文件名",prop:"name"},{label:"原路径",prop:"dname",render:t=>a(p,{on:{click:()=>e(t)}},t.dname)},{label:"被隔离时间",prop:"time",width:150,render:e=>a("span",{},i(e.time))},k([{onClick:t,title:"恢复"},{onClick:l,title:"永久删除"}])],V=({deleteWhite:e})=>[{label:"起始IP",prop:"start",render:e=>a("span",{},e.at(0))},{label:"结束IP",prop:"end",render:e=>a("span",{},e.at(1))},k([{onClick:e,title:"删除"}])],J=({deleteWhite:e})=>[{label:"URL",render:e=>a("span",{},e)},k([{onClick:e,title:"删除"}])],K=({toggleState:e})=>[{label:"版本",prop:"version"},{label:"站点数量",prop:"site_count"},{label:"防护状态",prop:"state",render:t=>a(l,{props:{value:1==t.state,change:a=>e(t,a),size:"mini"}})}],N=({logEvent:e,setPassEvent:r,deleteEvent:p,changeStatusEvent:n})=>t([{label:"用户名",render:e=>a("span",{},e[0])},{label:"防入侵",width:100,render:e=>a(l,{props:{value:e[3],size:"mini",change:t=>n(t,e,3)}})},{label:"记录日志",width:100,render:e=>a(l,{props:{value:e[5],size:"mini",change:t=>n(t,e,5)}})},{label:"备注",render:e=>a("span",e[6])},k([{onClick:e,title:"命令日志",width:70},{onClick:r,title:"重置密码",width:70},{onClick:p,title:"删除"}])]),X=({urlWhiteEvent:e,detailEvent:l,HttpEvent:r,addIpWhiteEvent:n})=>t([{label:"时间",render:e=>a("span",{},i(e.addtime))},{label:"用户IP",render:e=>a(p,{on:{click:()=>n(e)}},e.address)},{label:"恶意类型",prop:"intercept"},{label:"URL地址",prop:"url"},k([{onClick:e,title:"URL加白",width:70},{onClick:l,title:"详情"},{onClick:r,title:"HTTP"}])]),Y=({openFileEvent:e,falseAlarmEvent:a,deleteEvent:l})=>t([u(),{label:"文件名",prop:"name",width:160},{label:"文件路径",prop:"path"},k([{onClick:a,title:"误报"},{onClick:e,title:"打开文件",width:70},{onClick:l,title:"删除"}])]),Z=({optFileResult:e,getResultDetails:l})=>t([{label:"所在目录",prop:"File"},{label:"描述",prop:"Describe"},{label:"状态",prop:"Status",render:e=>a("span",{class:1!==e.Status?"text-primary":"text-warning"},1!==e.Status?"正常":"异常")},{label:"最后一次修改时间",prop:"Mtime"},k([{onClick:e,title:"已处理"},{onClick:l,title:"详情"}])]),$=({deleteRow:e})=>t([{label:"所在目录",prop:"path"},k([{onClick:e,title:"删除",isHide:e=>["/bin/","/sbin/","/usr/bin/","/usr/sbin/"].includes(e.path)}])]),ee=({deleteRow:e})=>t([{label:"应用类型",prop:"AppType"},{label:"来源",prop:"CidrBlock"},{label:"协议",prop:"Protocol"},{label:"端口",prop:"Port"},{label:"策略",prop:"Action",render:(e,t)=>a(p,{attrs:{type:"ACCEPT"===e.Action?"primary":"danger"}},["ACCEPT"==e.Action?"允许":"拒绝"])},k([{onClick:e,title:"删除"}])]);export{H as A,M as B,U as C,O as D,G as E,X as F,F as a,L as b,D as c,z as d,P as e,R as f,E as g,W as h,B as i,j,Y as k,$ as l,ee as m,N as n,I as o,S as p,Z as q,T as r,v as s,q as t,x as u,Q as v,V as w,J as x,K as y,A as z};