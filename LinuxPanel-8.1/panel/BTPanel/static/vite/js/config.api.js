import{I as s}from"./main.js?v=1714377894636";const a=a=>s.post("config/setUsername",{data:a,check:"msg"}),e=()=>s.post("config/ClosePanel",{check:"msg"}),t=()=>s.post("config/set_ipv6_status",{check:"msg"}),o=()=>s.post("config/get_token"),c=a=>s.post("config/set_token",{data:a,check:"msg"}),g=()=>s.post("config/set_local",{check:"msg"}),n=()=>s.post("config/set_debug",{check:"msg"}),_=()=>s.post("config/show_workorder",{check:"msg"}),p=a=>s.post("config/set_improvement",{data:a,check:"msg"}),m=a=>s.post("config/setPanel",{data:a,check:"msg"}),i=a=>s.post("config/set_left_title",{data:a,check:"msg"}),d=()=>s.post("config/syncDate",{check:"msg"}),f=a=>s.post("config/setPassword",{data:a,check:"msg"}),h=()=>s.post("ssl/DelToken",{check:"msg"}),l=()=>s.post("config/get_menu_list"),k=()=>s.post("config/get_limit_ua"),u=a=>s.post("config/set_ua",{data:a,check:"msg"}),r=a=>s.post("config/modify_ua",{data:a,check:"msg"}),y=a=>s.post("config/delete_ua",{data:a,check:"msg"}),w=a=>s.post("config/set_request_type",{data:a,check:"msg"}),T=a=>s.post("config/set_request_iptype",{data:a,check:"msg"}),b=()=>s.post("config/get_node_config"),v=a=>s.post("config/set_node_config",{data:a,check:"msg"}),S=()=>s.post("config/GetPanelSSL"),x=a=>s.post("config/SavePanelSSL",{data:a,check:"msg"}),P=()=>s.post("config/get_cert_source"),q=a=>s.post("config/SetPanelSSL",{data:a,check:"msg"}),L=a=>s.post("config/set_basic_auth",{data:a,check:"msg"}),j=a=>s.post("config/get_qrcode_data",{data:a,check:"ignore"}),D=()=>s.post("config/check_two_step",{check:"msg"}),G=()=>s.post("config/get_key"),A=a=>s.post("config/set_two_step_auth",{data:a,check:"msg"}),B=()=>s.post("config/get_ssl_verify"),C=a=>s.post("config/set_ssl_verify",{data:a,check:"msg"}),F=()=>s.post("config/get_password_config"),I=()=>s.post("config/set_password_safe",{check:"msg"}),R=a=>s.post("config/set_admin_path",{data:a,check:"msg"}),U=a=>s.post("config/set_not_auth_status",{data:a,check:"msg"}),W=a=>s.post("config/set_password_expire",{data:a,check:"msg"}),z=a=>s.post("config/get_temp_login",{data:a,check:"ignore"}),E=a=>s.post("config/set_temp_login",{data:a,check:"msg"}),H=a=>s.post("config/remove_temp_login",{data:a,check:"msg"}),J=a=>s.post("config/get_temp_login_logs",{data:a}),K=a=>s.post("config/set_msg_config&name=mail",{data:a,check:"msg"}),M=a=>s.post("config/set_msg_config&name=mail",{data:a,check:"msg"}),N=(a,e)=>s.post("config/set_msg_config&name=".concat(a),{data:e,check:"msg"}),O=()=>s.post("config/get_msg_configs"),Q=a=>s.post("push/get_push_config",{data:a,check:"ignore"}),V=a=>s.post("config/install_msg_module&name=".concat(a),{check:"msg"}),X=a=>s.post("config/uninstall_msg_module&name=".concat(a,"&is_del=1"),{check:"msg"}),Y=()=>s.post("config/get_msg_fun",{data:{module_name:"wx_account",fun_name:"get_web_info"}}),Z=a=>s.post("config/get_msg_fun",{check:"msg",data:{module_name:a,fun_name:"push_data",msg:"发送测试信息"}}),$=()=>s.post("config/get_msg_fun",{check:"msg",data:{module_name:"wx_account",fun_name:"get_auth_url"}}),ss=a=>s.post("panel/push/set_webhook_config",{data:a,check:"msg",customType:"model"}),as=a=>s.post("panel/push/remove_hook",{data:a,check:"msg",customType:"model"}),es=()=>s.post("push/get_push_list"),ts=a=>s.post("push/get_push_logs",{data:a}),os=a=>s.post("push/set_push_status",{data:a,check:"msg"}),cs=a=>s.post("push/set_push_config",{data:a,check:"msg"}),gs=a=>s.post("panel/msgbox/get_msg_list",{data:a,customType:"model"}),ns=()=>s.post("panel/msgbox/read_all",{customType:"model",check:"msg"}),_s=()=>s.post("panel/msgbox/delete_all",{customType:"model",check:"msg"}),ps=a=>s.post("panel/msgbox/get_msg_info",{data:a,customType:"model"}),ms=a=>s.post("push/del_push_config",{data:a,check:"msg"}),is=()=>s.post("panel/panel_reverse_generation/get_panel_generation",{check:"ignore",customType:"model"}),ds=a=>s.post("/panel/panel_reverse_generation/AddSite",{data:a,check:"msg",customType:"model"}),fs=()=>s.post("/panel/panel_reverse_generation/del_panel_generation",{check:"msg",customType:"model"}),hs=()=>s.post("ssl/get_cert_list",{check:"msg"}),ls=a=>s.post("ssl/get_cert_info",{data:a,check:"ignore"}),ks=(a,e)=>s.post(a,{data:e,check:"msg",customType:"model"}),us=()=>s.post("config/get_limit_area"),rs=a=>s.post("config/set_limit_area",{data:a,check:"msg"}),ys=()=>s.post("system/ReWeb",{check:"msg"}),ws=a=>s.post("files/GetFileBody",{data:a});export{ns as $,P as A,q as B,fs as C,L as D,A as E,B as F,C as G,ys as H,I,m as J,R as K,U as L,F as M,W as N,J as O,E as P,H as Q,rs as R,r as S,ms as T,os as U,es as V,X as W,as as X,ss as Y,ts as Z,gs as _,g as a,_s as a0,k as a1,l as a2,b as a3,D as a4,is as a5,ds as a6,hs as a7,ls as a8,Q as a9,us as aa,ks as ab,z as ac,ps as ad,ws as ae,o as af,G as ag,j as ah,y as ai,u as aj,n as b,e as c,c as d,_ as e,p as f,i as g,d as h,a as i,f as j,h as k,w as l,T as m,v as n,cs as o,Y as p,Z as q,$ as r,t as s,O as t,V as u,K as v,M as w,N as x,x as y,S as z};
