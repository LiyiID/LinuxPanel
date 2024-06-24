/*
 * @Author: 立夫
 * @Date: 2022-04-02 14:50:32
 * @LastEditTime: 2022-04-20 15:14:58
 * @Description: 
 * @FilePath: \198\BTPanel\static\js\docker.js
 * 可以输入预定的版权声明、个性签名、空行等
 */

$('#cutMode .tabs-item').on('click', function () {
	var type = $(this).data('type'),
			index = $(this).index();

	$(this).addClass('active').siblings().removeClass('active');
	$('.tab-con').find('.tab-con-block').eq(index).removeClass('hide').siblings().addClass('hide');

	docker.initTabConfig(type)//初始化tab，获取内容
	bt.set_cookie('docker_model',type)  //Cookie保存当前tab位置
	$('.mask_layer .prompt_description').css('top','50%')
});

var docker = {
	tabName:'container',//当前所处tab位置
	global_api:'/project/docker/model',
	global:{
			url:'unix:///var/run/docker.sock',
			dk_model_name:'',
			dk_def_name:'',
	},
	dk_container:[], //容器列表
	dk_compose:[],  //容器编排列表
	dk_images:[],   //镜像列表》容器页面专用
	dk_volumes:[],  //卷列表  》容器页面专用
	dk_template:[], //模板列表》容器编排页面专用
	dk_network:[],  //网络列表
	dk_registry:[], //仓库列表》镜像页面专用
	cont_chart:{    //容器图表数据
			cpu_list:[],
			mem_list:{
					usage:[],
					cache:[]
			},
			disk_list:{
					read:[],
					write:[]
			},
			network_list:{
					tx:[],
					rx:[]
			},
			time_list:[]
	},
	cont_chart_id:{  //容器图表dom
			cpu:null,
			mem:null,
			disk:null,
			network:null
	},
	cont_setInterval:null,  //图表定时器
	log_file_setInterval:null, //日志定时器
	log_layer_open:null,    //日志弹窗
	/**
	 * @description 获取容器列表
	 */
	get_container:function(){
			var that = this;
			var _config = $.extend({},this.global,{dk_def_name:'get_list'})
			var dk_container_table = bt_tools.table({
					el:'#dk_container_table',
					load: true,
					url:this.global_api,
					minWidth: '1340px',
					height:750,
					param: {data:JSON.stringify(_config)},
					dataFilter: function (res) {
							if(!res.msg.installed || !res.msg.service_status) that.stop_user_operation(res.msg.installed,res.msg.service_status)
							that.dk_images = res['msg']['images']
							that.dk_volumes = res['msg']['volumes']
							that.dk_template = res['msg']['template']
							docker.dk_container = res['msg']['container_list']
							return { data: res['msg']['container_list'] };
					},
					default:"容器列表为空",
					column:[{
							type: 'checkbox',
							class: '',
							width: 20
					},{
							fid: 'name',
							title: '容器名',
							width:146,
							template:function(row){
									return '<span class="btlink size_ellipsis" style="width:130px" title="'+row.name+'">'+row.name+'</span>'
							},
							event: function (row) {
									that.open_container_config(row)
							}
					},{
							title: '状态',
							width: 80,
							template:function(row){
									var _class = '',_icon = '',text = ''
									switch(row.status){
											case 'running':
													_class = 'bt_success'
													_icon = 'glyphicon-play'
													text ='已启动'
													break;
											case 'paused':
													_class = 'bt_warning'
													_icon = 'glyphicon-pause'
													text ='已暂停'
													break;
											default:
													_class = 'bt_danger'
													_icon = 'glyphicon-pause'
													text ='已停止'
													break;
									}
									return '<a class="btlink '+_class+'">'+text+'<span class="glyphicon '+_icon+'"></span></a>'
							},
							event:function(row){
									if($('.dk_status_select_list').length == 0){
											$('.dk_status_select').append('<ul class="dk_status_select_list"><li data-key="start">启动</li><li data-key="stop">停止</li><li data-key="pause">暂停</li><li data-key="unpause">取消暂停</li><li data-key="restart">重启</li><li data-key="reload">重载</li></ul>')

											//事件
											$('.dk_status_select_list li').click(function(){
													var _type = $(this).data('key')
													that.container_status_setting(_type,row.detail.Id,dk_container_table)
											})

											//下拉定位
											var thLeft = $('#dk_container_table .divtable').scrollLeft(), //当前滚动条位置
													thTop = $('#dk_container_table .divtable').scrollTop(),   //当前滚动条位置
													domScrollTop = $(document).scrollTop(),
													_thSpan = $('.dk_status_select')[0]

											$('.dk_status_select_list').css({'left':_thSpan.offsetLeft+210-thLeft,'top':(_thSpan.offsetTop+153-domScrollTop-thTop)})
									}
							}
					},{
							fid: 'image',
							width:160,
							title: '镜像',
							template:function(row){
									return '<span class="size_ellipsis" style="width:144px" title="'+row.image+'">'+row.image+'</span>'
							}
					},{
							fid:'ip',
							title:'IP',
					},{
							fid:'cpu_usage',
							width:80,
							title:'CPU使用率',
							template:function(row){
									return '<span">'+(row.cpu_usage !== ''?row.cpu_usage+'%':'')+'</span>'
							}
					},{
							fid:'port',
							title:'端口 (主机-->容器)',
							template:function(row){
									var _port = []
									$.each(row.ports,function(index,item){
											if(item != null){
													_port.push(item[0]['HostPort']+'-->'+index)
											}
									})
									return '<span><span title="点击查看详情" class="event_details size_ellipsis" style="width:350px">'+ _port.join() +'</span><textarea class="event_textarea" style="display: none;width: 350px;max-width: 350px;min-height: 24px;height: 100px;resize: auto;border: 1px solid #ddd;" readonly>'+_port.join()+'</textarea></span>'
							}
					},{
							width:150,
							title:'启动时间',
							template:function(row){
									return '<span>'+that.utc2beijing(row.time)+'</span>'
							}
					},{
							title: '操作',
							type: 'group',
							width: 235,
							align: 'right',
							group: [{
									title:'实时监控',
									event:function(row){
											bt_tools.open({
													type: 1,
													title: '【'+row.name+'】实时监控',
													area: '1100px',
													btn: false,
													content: '<div class="pd15 cont-chart-dialog">\
															<div class="cont_chart_line"><div class="cont_chart_child_title">基础信息</div>\
																	<div class="">\
																			<div class="cont_chart_basis"><strong>内存限额：</strong><span>-</span></div>\
																			<div class="cont_chart_basis"><strong>流量情况：</strong><span>- / -</span></div>\
																	</div>\
															</div>\
															<div class="cont_chart_block"><div class="cont_chart_child_title">CPU</div><div class=""><div id="cont_cpu" style="width:100%;height:240px"></div></div></div>\
															<div class="cont_chart_block"><div class="cont_chart_child_title">内存</div><div class=""><div id="cont_mem" style="width:100%;height:240px"></div></div></div>\
															<div class="cont_chart_block"><div class="cont_chart_child_title">磁盘IO</div><div class=""><div id="cont_disk" style="width:100%;height:240px"></div></div></div>\
															<div class="cont_chart_block"><div class="cont_chart_child_title">网络IO</div><div class=""><div id="cont_network" style="width:100%;height:240px"></div></div></div>\
													</div>',
													success:function(){
															// 先初始化数据
															that.remove_cont_chart_data()
															//加载图表文件
															jQuery.ajax({
																	url: "/static/js/echarts.min.js",
																	dataType: "script",
																	cache: true
															}).done(function() {
																	that.render_cont_chart(row); //默认渲染
																	that.cont_setInterval = setInterval(function(){
																			that.transform_cont_chart_data(row);
																	},3000)//默认三秒获取一次数据
															});
													},
													cancel: function () {
															that.remove_cont_chart_data()
													}
											})
									}
							},{
									title:'终端',
									event:function(row){
											that.open_container_shell_view(row);
									}
							},{
									title:'目录',
									event:function(row){
											if(row.merged == '') return layer.msg('目录不存在',{icon:0})
											openPath(row.merged);
									}
							},{
									title:'日志',
									event:function(row){
										that.logs_manager(row.id)
										return
											that.ajax_task_method('get_logs',{data:{id:row.detail.Id},tips:'获取容器日志'},function(res){
													layer.open({
															title:'【'+row.name+'】容器日志',
															type:1,
                                area: '700px',
															shadeClose: false,
															closeBtn: 2,
															btn:false,
                                content: '<div class="setchmod bt-form ">'
                                    + '<pre class="dk-container-log" style="overflow: auto; border: 0px none; line-height:23px;padding: 15px; margin: 0px; white-space: pre-wrap; height: 405px; background-color: rgb(51,51,51);color:#f1f1f1;border-radius:0px;font-family: \"微软雅黑\"">' + (res.msg == '' ? '当前日志为空' : res.msg) + '</pre>'
                                    +'</div>',
															success:function(){
                                    $('.dk-container-log').scrollTop(100000000000)
															}
													})
											})
									}
							},{
									title:'删除',
									event:function(row){
											var extractName = row.name.length > 25 ?(row.name.substring(0,20) + '...'):row.name
											bt.confirm({
													title: '删除容器【' + extractName + '】',
													msg: '您真的要从列表中删除这个容器吗？'
											}, function () {
													that.ajax_task_method('del_container',{data:{id:row.detail.Id},tips:'删除容器'},function(res){
															if(res.status) that.initTabConfig('container')  //刷新列表
															bt_tools.msg(res)
													})
											});
									}
							}]
					}],
					tootls:[{
							type: 'group',
							positon: ['left', 'top'],
							list: [{
									title: '添加容器',
									active: true,
									event: function () {
											that.add_container();
									}
							},{
								title: '日志管理',
								event: function () {
									that.logs_manager()
								}
							}]
					},{ // 批量操作
							type: 'batch', //batch_btn
							positon: ['left', 'bottom'],
							placeholder: '请选择批量操作',
							buttonValue: '批量操作',
							disabledSelectValue: '请选择需要批量操作的容器!',
							selectList: [{
									title: "启动容器",
									url: that.global_api,
									load: true,
									param:function(crow){
											return {data:that.batch_param_convert('start',{id:crow.id})}
									},
									refresh: true,
									callback: function (thatc) {
											thatc.start_batch({}, function (list) {
													var html = ''
													for (var i = 0; i < list.length; i++) {
															var item = list[i];
															html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + (item.request.status ? '成功' : '失败') + '</span></div></td></tr>';
													}
													dk_container_table.$batch_success_table({
															title: '批量启动容器',
															th: '启动容器',
															html: html
													});
													dk_container_table.$refresh_table_list(true);
											});
									}
							},{
									title: "停止容器",
									url: that.global_api,
									load: true,
									param:function(crow){
											return {data:that.batch_param_convert('stop',{id:crow.id})}
									},
									refresh: true,
									callback: function (thatc) {
											thatc.start_batch({}, function (list) {
													var html = ''
													for (var i = 0; i < list.length; i++) {
															var item = list[i];
															html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + (item.request.status ? '成功' : '失败') + '</span></div></td></tr>';
													}
													dk_container_table.$batch_success_table({
															title: '批量停止容器',
															th: '停止容器',
															html: html
													});
													dk_container_table.$refresh_table_list(true);
											});
									}
							},{
									title: "暂停容器",
									url: that.global_api,
									load: true,
									param:function(crow){
											return {data:that.batch_param_convert('pause',{id:crow.id})}
									},
									refresh: true,
									callback: function (thatc) {
											thatc.start_batch({}, function (list) {
													var html = ''
													for (var i = 0; i < list.length; i++) {
															var item = list[i];
															html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + (item.request.status ? '成功' : '失败') + '</span></div></td></tr>';
													}
													dk_container_table.$batch_success_table({
															title: '批量暂停容器',
															th: '暂停容器',
															html: html
													});
													dk_container_table.$refresh_table_list(true);
											});
									}
							},{
									title: "取消暂停容器",
									url: that.global_api,
									load: true,
									param:function(crow){
											return {data:that.batch_param_convert('unpause',{id:crow.id})}
									},
									refresh: true,
									callback: function (thatc) {
											thatc.start_batch({}, function (list) {
													var html = ''
													for (var i = 0; i < list.length; i++) {
															var item = list[i];
															html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + (item.request.status ? '成功' : '失败') + '</span></div></td></tr>';
													}
													dk_container_table.$batch_success_table({
															title: '批量取消暂停容器',
															th: '取消暂停',
															html: html
													});
													dk_container_table.$refresh_table_list(true);
											});
									}
							},{
									title: "重启容器",
									url: that.global_api,
									load: true,
									param:function(crow){
											return {data:that.batch_param_convert('restart',{id:crow.id})}
									},
									refresh: true,
									callback: function (thatc) {
											thatc.start_batch({}, function (list) {
													var html = ''
													for (var i = 0; i < list.length; i++) {
															var item = list[i];
															html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + (item.request.status ? '成功' : '失败') + '</span></div></td></tr>';
													}
													dk_container_table.$batch_success_table({
															title: '批量重启容器',
															th: '重启容器',
															html: html
													});
													dk_container_table.$refresh_table_list(true);
											});
									}
							},{
									title: "重载容器",
									url: that.global_api,
									load: true,
									param:function(crow){
											return {data:that.batch_param_convert('reload',{id:crow.id})}
									},
									refresh: true,
									callback: function (thatc) {
											thatc.start_batch({}, function (list) {
													var html = ''
													for (var i = 0; i < list.length; i++) {
															var item = list[i];
															html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + (item.request.status ? '成功' : '失败') + '</span></div></td></tr>';
													}
													dk_container_table.$batch_success_table({
															title: '批量重载容器',
															th: '重载容器',
															html: html
													});
													dk_container_table.$refresh_table_list(true);
											});
									}
							},{
									title: "删除容器",
									url: that.global_api,
									load: true,
									param:function(crow){
											return {data:that.batch_param_convert('del_container',{id:crow.id})}
									},
									refresh: true,
									callback: function (thatc) {
											bt.show_confirm("批量删除容器", "<span style='color:red'>同时删除选中的容器，是否继续？</span>", function () {
													thatc.start_batch({}, function (list) {
															var html = ''
															for (var i = 0; i < list.length; i++) {
																	var item = list[i];
																	html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + (item.request.status ? '成功' : '失败') + '</span></div></td></tr>';
															}
															dk_container_table.$batch_success_table({
																	title: '批量删除容器',
																	th: '删除容器',
																	html: html
															});
															dk_container_table.$refresh_table_list(true);
													});
											});
									}
							}]
					}],
					success:function(){
						bt.newDotTips([{el: '#dk_container_table .tootls_top .pull-left button:eq(1)',name: 'dockerlog',style: 'top: -3px;margin-left: 5px;'}])
						
						if(!$('#dk_container_table .pull-left .dividing-line').length) $('#dk_container_table .pull-left button').eq(1).before('<div class="inlineBlock dividing-line" style="margin: 0 10px 0 5px;"></div>')
						// 在左上方按钮组后增加一个文字"需求反馈"按钮
						if(!$('#dk_container_table').find('.feedback_docker').length){
							$('#dk_container_table .tootls_top').find('.pull-left').append('<span class="btlink feedback_docker ml10">需求反馈</span>')
							$('.feedback_docker').click(function(){
								that.openFeedback()
							})
						}
						
						if(!$('#dk_container_table .pull-left .dividing-line').length) $('#dk_container_table .pull-left button').eq(1).before('<div class="inlineBlock dividing-line" style="margin: 0 10px 0 5px;"></div>')
							$('.event_details').unbind('click').on('click',function (e) {
									$('.event_details').show()
									$('.event_textarea').hide()
									$(this).hide().siblings().show()
									$(document).click(function (ev) {
											if(ev.target.innerHTML.indexOf('event_textarea') === -1){
													$('.event_details').show()
													$('.event_textarea').hide()
											}
											ev.stopPropagation();
											ev.preventDefault();
									});
									e.stopPropagation();
									e.preventDefault();
							})
							$('#dk_container_table tbody td').unbind('mouseenter').mouseenter(function(e){
									var _tdSPAN = $(this).find('span:first-child').not('.glyphicon')
									if(e.target.cellIndex == 2){
											_tdSPAN.addClass('dk_status_select')
									}else{
											_tdSPAN.removeClass('dk_status_select')
											$('.dk_status_select_list').remove()
									}
							})
							$('#dk_container_table tbody td').unbind('mouseleave').mouseleave(function(e){
									var _tdSPAN = $(this).find('span:first-child').not('.glyphicon')
									_tdSPAN.removeClass('dk_status_select')
									$('.dk_status_select_list').remove()
							})
					}
			})
	},
	/**
	 * @description 获取容器编排列表
	 */
	get_compose:function(){
			var that = this;
			var _config = $.extend({},this.global,{dk_def_name:'compose_project_list'})
			var dk_compose_table = bt_tools.table({
					el:'#dk_compose_table',
					load: true,
					url:this.global_api,
					minWidth: '820px',
					height:750,
					param: {data:JSON.stringify(_config)},
					dataFilter: function (res) {
						docker.compose_ps = res.msg.template
							if(!res.msg.installed || !res.msg.service_status) that.stop_user_operation(res.msg.installed,res.msg.service_status)
							that.dk_template = res['msg']['template']
							docker.dk_compose = res['msg']['project_list']
							return { data: res['msg']['project_list'] };
					},
					default:"compose列表为空",
					column:[{
							type: 'checkbox',
							class: '',
							width: 20
					},{
							width:266,
							title: 'Compose项目名称',
							template:function(row){
									return '<span class="size_ellipsis" style="width:250px" title="'+row.name+'">'+row.name+'</span>'
							}
					},{
							title: '容器数量',
							template:function(row){
									return '<span>'+row.container.length+'</span>'
							},

					},{
							title:'启动时间',
							template:function(row){
									return '<span>'+bt.format_data(row.time)+'</span>'
							}
					},
							{
									fid: 'remark',
									title: '备注',
									type: 'input',
									blur: function (row, index, ev, key, thatc) {
											if (row.remark == ev.target.value) return false;
											that.ajax_task_method('edit_project_remark',{data:{project_id:row.id,remark:ev.target.value}})
									},
									keyup: function (row, index, ev) {
											if (ev.keyCode === 13) {
													$(this).blur();
											}
									}
							},{
									title: '操作',
									type: 'group',
									width: 120,
									align: 'right',
									group: [{
											title:'容器列表',
											event:function(dk_cont,index){
													if(dk_cont.container.length == 0) return layer.msg('没有容器',{icon:0});
													bt_tools.open({
															title:'【'+dk_cont.name+'】容器列表',
															area:'930px',
															content:'<div class="pd20" id="project_compose_table"></div>',
															success:function(){
																	var project_compose_table = bt_tools.table({
																			el:'#project_compose_table',
																			url:that.global_api,
																			param: {data:JSON.stringify(_config)},
																			dataFilter: function (res) {
																					return { data: res['msg']['project_list'][index]['container'] };
																			},
																			column:[
																					{
																							fid: 'name',
																							title: '容器名',
																							template:function(row){
																									return '<span class="size_ellipsis" style="width:124px" title="'+row.name+'">'+row.name+'</span>'
																							}
																					},{
																							title: '状态',
																							width: 80,
																							template:function(row){
																									var _class = '',_icon = '',text = ''
																									switch(row.status){
																											case 'running':
																													_class = 'bt_success'
																													_icon = 'glyphicon-play'
																													text ='已启动'
																													break;
																											case 'paused':
																													_class = 'bt_warning'
																													_icon = 'glyphicon-pause'
																													text ='已暂停'
																													break;
																											default:
																													_class = 'bt_danger'
																													_icon = 'glyphicon-pause'
																													text ='已停止'
																													break;
																									}
																									return '<a class="btlink '+_class+'">'+text+'<span class="glyphicon '+_icon+'"></span></a>'
																							},
																							event:function(row){
																									if($('.dk_status_select_list').length == 0){
																											$('.dk_status_select').append('<ul class="dk_status_select_list"><li data-key="start">启动</li><li data-key="stop">停止</li><li data-key="pause">暂停</li><li data-key="unpause">取消暂停</li><li data-key="restart">重启</li><li data-key="reload">重载</li></ul>')

																											//事件
																											$('.dk_status_select_list li').click(function(){
																													var _type = $(this).data('key')
																													that.container_status_setting(_type,row.detail.Id,project_compose_table,'project')
																											})

																											//下拉定位
																											var thLeft = $('#project_compose_table .divtable').scrollLeft(), //当前滚动条位置
																													_thSpan = $('.dk_status_select')[0]
																											$('.dk_status_select_list').css({'left':_thSpan.offsetLeft+20-thLeft,'top':_thSpan.offsetTop+120})
																									}
																							}
																					},{
																							fid: 'image',
																							width:100,
																							title: '镜像',
																							template:function(row){
																									return '<span class="size_ellipsis" style="width:84px" title="'+row.image+'">'+row.image+'</span>'
																							}
																					},{
																							width:150,
																							title:'启动时间',
																							template:function(row){
																									return '<span>'+that.utc2beijing(row.time)+'</span>'
																							}
																					},{
																							fid:'ip',
																							width:116,
																							title:'IP',
																							template:function(row){
																									return '<span class="size_ellipsis" style="width:100px" title="'+row.ip+'">'+row.ip+'</span>'
																							}
																					},{
																							fid:'port',
																							width:108,
																							title:'端口 (主机-->容器)',
																							template:function(row){
																									var _port = []
																									$.each(row.ports,function(index,item){
																											if(item != null){
																													_port.push(item[0]['HostPort']+'-->'+index)
																											}
																									})
																									return '<span class="size_ellipsis" style="width:92px" title="'+_port.join()+'">'+_port.join()+'</span>'
																							}
																					},{
																							title: '操作',
																							type: 'group',
																							width: 170,
																							align: 'right',
																							group: [{
																									title:'终端',
																									event:function(row){
																											that.open_container_shell_view(row);
																									}
																							},{
																									title:'日志',
																									event:function(row){
																											that.ajax_task_method('get_logs',{data:{id:row.detail.Id},tips:'获取容器日志',model_name:{dk_model_name:'container'}},function(res){
																													layer.open({
																															title:'【'+row.name+'】容器日志',
																															area: '700px',
																															shadeClose: false,
																															closeBtn: 2,
																															btn:false,
																															content: '<div class="setchmod bt-form ">'
																																	+ '<pre class="dk-container-log" style="overflow: auto; border: 0px none; line-height:23px;padding: 15px; margin: 0px; white-space: pre-wrap; height: 405px; background-color: rgb(51,51,51);color:#f1f1f1;border-radius:0px;font-family: \"微软雅黑\"">' + (res.msg == '' ? '当前日志为空' : res.msg) + '</pre>'
																																	+'</div>',
																															success:function(){
																																	$('.dk-container-log').scrollTop(100000000000)
																															}
																													})
																											})
																									}
																							},{
																									title:'目录',
																									event:function(row){
																											if(row.merged == '') return layer.msg('目录不存在',{icon:0})
																											openPath(row.merged);
																									}
																							},{
																									title:'删除',
																									event:function(row){
																											var extractName = row.name.length > 25 ?(row.name.substring(0,20) + '...'):row.name
																											bt.confirm({
																													title: '删除容器【' + extractName + '】',
																													msg: '您真的要从列表中删除这个容器吗？'
																											}, function () {
																													that.ajax_task_method('del_container',{data:{id:row.detail.Id},tips:'删除容器',model_name:{dk_model_name:'container'}},function(res){
																															if(res.status) project_compose_table.$refresh_table_list(true)  //刷新列表
																															bt_tools.msg(res)
																													})
																											});
																									}
																							}]
																					}],
																			tootls:false,
																			success:function(){
																					$('#project_compose_table tbody td').unbind('mouseenter').mouseenter(function(e){
																							var _tdSPAN = $(this).find('span:first-child').not('.glyphicon')
																							if(e.target.cellIndex == 1){
																									_tdSPAN.addClass('dk_status_select')
																							}else{
																									_tdSPAN.removeClass('dk_status_select')
																									$('.dk_status_select_list').remove()
																							}
																					})
																					$('#project_compose_table tbody td').unbind('mouseleave').mouseleave(function(e){
																							var _tdSPAN = $(this).find('span:first-child').not('.glyphicon')
																							_tdSPAN.removeClass('dk_status_select')
																							$('.dk_status_select_list').remove()
																					})
																					if($('#project_compose_table .tootls_group.tootls_top').length == 0){
																							var $select = $('<div class="tootls_group tootls_top">\
																						<div class="pull-left">\
																							<span>Compose操作：<span>\
																							<select class="bt-input-text ml5" style="width:130px" name="set_project_status" placeholder="请选择">\
																								<option style="display: none">请选择状态</option>\
																								<option value="start">启动Compose</option>\
																								<option value="stop">停止Compose</option>\
																								<option value="pause">暂停Compose</option>\
																								<option value="unpause">取消暂停</option>\
																								<option value="restart">重启Compose</option>\
																							</select>\
																						</div>\
																					</div>');
																							$select.prependTo($('#project_compose_table'));

																							$select.find('[name=set_project_status]').change(function(){
																									var val = $(this).val();
																									that.ajax_task_method(val,{data:{project_id:dk_cont.id},tips:$('[name=set_project_status]').find('option:selected').text()},function(res){
																											if (res.status) project_compose_table.$refresh_table_list(true)
																											bt_tools.msg(res)
																									})
																							});
																					}
																			}
																	})
															}
													})
											}
									},{
											title:'删除',
											event:function(row){
													bt.confirm({
															title: '删除Compose【' + row.name + '】',
															msg: '您真的要从列表中删除这个Compose吗？'
													}, function () {
															that.ajax_task_method('remove',{data:{project_id:row.id},tips:'删除Compose'},function(res){
																	if(res.status)that.initTabConfig('compose')  //刷新列表
																	bt_tools.msg(res);
															})
													});
											}
									}]
							}],
					tootls:[{
							type: 'group',
							positon: ['left', 'top'],
							list: [{
									title: '添加Compose项目',
									active: true,
									event: function () {
											that.add_project();
									}
							}]
					},{ // 批量操作
							type: 'batch', //batch_btn
							positon: ['left', 'bottom'],
							placeholder: '请选择批量操作',
							buttonValue: '批量操作',
							disabledSelectValue: '请选择需要批量操作的compose!',
							selectList: [{
									title: "删除compose",
									url: that.global_api,
									load: true,
									param:function(crow){
											return {data:that.batch_param_convert('remove',{project_id:crow.id})}
									},
									refresh: true,
									callback: function (thatc) {
											bt.show_confirm("批量删除compose", "<span style='color:red'>同时删除选中的compose，是否继续？</span>", function () {
													thatc.start_batch({}, function (list) {
															var html = ''
															for (var i = 0; i < list.length; i++) {
																	var item = list[i];
																	html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + (item.request.status ? '成功' : '失败') + '</span></div></td></tr>';
															}
															dk_compose_table.$batch_success_table({
																	title: '批量删除compose',
																	th: 'compose',
																	html: html
															});
															dk_compose_table.$refresh_table_list(true);
													});
											});
									}
							}]
					}],success:function(){
						// 在左上方按钮组后增加一个文字"需求反馈"按钮
						if(!$('#dk_compose_table').find('.feedback_docker').length){
							$('#dk_compose_table .tootls_top').find('.pull-left').append('<span class="btlink feedback_docker ml10">需求反馈</span>')
							$('.feedback_docker').click(function(){
								that.openFeedback()
							})
						}
					}
			})
	},
	/**
	 * @description 获取compose模板列表
	 */
	get_model:function(){
			var that = this;
			var _config = $.extend({},this.global,{dk_def_name:'template_list'})
			var dk_model_table = bt_tools.table({
					el:'#dk_model_table',
					load: true,
					url:this.global_api,
					minWidth: '980px',
					height:750,
					param: {data:JSON.stringify(_config)},
					dataFilter: function (res) {
							if(!res.msg.installed || !res.msg.service_status) that.stop_user_operation(res.msg.installed,res.msg.service_status)
							return { data: res['msg']['template'] };
					},
					default:"Compose列表为空",
					column:[{
							type: 'checkbox',
							class: '',
							width: 20
					},
							{
									fid:'name',
									width:266,
									title: '模板名',
									template:function(row){
											return '<span class="size_ellipsis" style="width:250px" title="'+row.name+'">'+row.name+'</span>'
									}
							},
							{
									width:266,
									title: '路径',
									template:function(row){
											return '<a class="btlink size_ellipsis" style="width:250px" title="'+row.path+'">'+row.path+'</a>'
									},
									event: function (row) {
											openEditorView(0,row.path)
									}
							},
							{
									fid: 'remark',
									title: '备注',
									type: 'input',
									blur: function (row, index, ev, key, thatc) {
											if (row.remark == ev.target.value) return false;
											that.ajax_task_method('edit_template_remark',{data:{templates_id:row.id,remark:ev.target.value}})
									},
									keyup: function (row, index, ev) {
											if (ev.keyCode === 13) {
													$(this).blur();
											}
									}
							},
							{
									title: '操作',
									type: 'group',
									width: 180,
									align: 'right',
									group: [{
											title:'编辑',
											event:function(row){
													that.ajax_task_method('get_template',{data:{id:row.id},tips:'获取模板'},function(res){
															if(res.status){
																	that.edit_model_view($.extend({content:res['msg']},row))
															}
													})
											}
									},{
											title:'拉取镜像',
											event:function(row){
													that.get_log_situation()
													that.ajax_task_method('pull',{data:{template_id:row.id},tips:false},function(res){
															that.remove_log_clearinterval();
															bt_tools.msg(res);
													})
											}
									},{
											title:'删除',
											event:function(row){
													bt.confirm({
															title: '删除模板【' + row.name + '】',
															msg: '您真的要从列表中删除这个模板吗？'
													}, function () {
															that.ajax_task_method('remove_template',{data:{template_id:row.id},tips:'删除模板'},function(res){
																	bt_tools.msg(res);
																	that.initTabConfig('model')  //刷新列表
															})
													});
											}
									}]
							}],
					tootls:[{
							type: 'group',
							positon: ['left', 'top'],
							list: [{
									title: '添加',
									active: true,
									event: function (ev) {
											that.add_model_view();
									}
							}]
					},{ // 批量操作
							type: 'batch', //batch_btn
							positon: ['left', 'bottom'],
							placeholder: '请选择批量操作',
							buttonValue: '批量操作',
							disabledSelectValue: '请选择需要批量操作的模板!',
							selectList: [{
									title: "删除模板",
									url: that.global_api,
									load: true,
									param:function(crow){
											return {data:that.batch_param_convert('remove_template',{template_id:crow.id})}
									},
									refresh: true,
									callback: function (thatc) {
											bt.show_confirm("批量删除模板", "<span style='color:red'>同时删除选中的模板，是否继续？</span>", function () {
													thatc.start_batch({}, function (list) {
															var html = ''
															for (var i = 0; i < list.length; i++) {
																	var item = list[i];
																	html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + (item.request.status ? '成功' : '失败') + '</span></div></td></tr>';
															}
															dk_model_table.$batch_success_table({
																	title: '批量删除模板',
																	th: '模板名',
																	html: html
															});
															dk_model_table.$refresh_table_list(true);
													});
											});
									}
							}]
					}],success:function(){
						// 在左上方按钮组后增加一个文字"需求反馈"按钮
						if(!$('#dk_model_table').find('.feedback_docker').length){
							$('#dk_model_table .tootls_top').find('.pull-left').append('<span class="btlink feedback_docker ml10">需求反馈</span>')
							$('.feedback_docker').click(function(){
								that.openFeedback()
							})
						}
					}
			})
	},
	/**
	 * @description 获取网络列表
	 */
	get_network:function(){
			var that = this;
			var _config = $.extend({},this.global,{dk_def_name:'get_host_network'})
			var dk_network_table = bt_tools.table({
					el:'#dk_network_table',
					load: true,
					url:this.global_api,
					param: {data:JSON.stringify(_config)},
					height:750,
					dataFilter: function (res) {
							if(!res.msg.installed || !res.msg.service_status) that.stop_user_operation(res.msg.installed,res.msg.service_status)
							docker.dk_network = res['msg']['network']
							return { data: res['msg']['network'] };
					},
					default:"网络列表为空",
					column:[{
							type: 'checkbox',
							class: '',
							width: 20
					},
							{
									width:266,
									title: '网络名',
									template:function(row){
											return '<span class="size_ellipsis" style="width:250px" title="'+row.name+'">'+row.name+'</span>'
									}
							},
							{fid:'driver',title: '设备'},
							{fid:'subnet',title: '网络号'},
							{fid:'gateway',title: '网关'},
							{
									width:226,
									title:'标签',
									template:function(row){
											var _label = []
											if(!$.isEmptyObject(row.labels)){
													$.each(row.labels,function(index,item){
															_label.push(index+'-'+item)
													})
											}
											return '<span class="size_ellipsis" style="width:210px">'+_label.join() +'</span>'
									}
							},
							{
									width:150,
									title:'创建时间',
									template:function(row){
											return '<span>'+that.utc2beijing(row.time)+'</span>'
									}
							},
							{
									title: '操作',
									type: 'group',
									width: 60,
									align: 'right',
									group: [{
											title:'删除',
											event:function(row){
													bt.confirm({
															title: '删除网络【' + row.name + '】',
															msg: '您真的要从列表中删除这个网络吗？'
													}, function () {
															that.ajax_task_method('del_network',{data:{id:row.id},tips:'删除网络'},function(res){
																	if(res.status) that.initTabConfig('network')  //刷新列表
																	bt_tools.msg(res);
															})
													});
											}
									}]
							}],
					tootls:[{
							type: 'group',
							positon: ['left', 'top'],
							list: [{
									title: '添加网络',
									active: true,
									event: function (ev) {
											that.add_network();
									}
							}]
					},{ // 批量操作
							type: 'batch', //batch_btn
							positon: ['left', 'bottom'],
							placeholder: '请选择批量操作',
							buttonValue: '批量操作',
							disabledSelectValue: '请选择需要批量操作的网络!',
							selectList: [{
									title: "删除网络",
									url: that.global_api,
									load: true,
									param:function(crow){
											return {data:that.batch_param_convert('del_network',{id:crow.id})}
									},
									refresh: true,
									callback: function (thatc) {
											bt.show_confirm("批量删除网络", "<span style='color:red'>同时删除选中的网络，是否继续？</span>", function () {
													thatc.start_batch({}, function (list) {
															var html = ''
															for (var i = 0; i < list.length; i++) {
																	var item = list[i];
																	html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + (item.request.status ? '成功' : '失败') + '</span></div></td></tr>';
															}
															dk_network_table.$batch_success_table({
																	title: '批量删除网络',
																	th: '网络名',
																	html: html
															});
															dk_network_table.$refresh_table_list(true);
													});
											});
									}
							}]
					}],success:function(){
						// 在左上方按钮组后增加一个文字"需求反馈"按钮
						if(!$('#dk_network_table').find('.feedback_docker').length){
							$('#dk_network_table .tootls_top').find('.pull-left').append('<span class="btlink feedback_docker ml10">需求反馈</span>')
							$('.feedback_docker').click(function(){
								that.openFeedback()
							})
						}
					}
			})
	},
	/**
	 * @description 获取存储卷列表
	 */
	get_volume:function(){
			var that = this;
			var _config = $.extend({},this.global,{dk_def_name:'get_volume_list'})
			var dk_volume_table = bt_tools.table({
					el:'#dk_volume_table',
					load: true,
					url:this.global_api,
					minWidth: '1020px',
					height:750,
					param: {data:JSON.stringify(_config)},
					dataFilter: function (res) {
							if(!res.msg.installed || !res.msg.service_status) that.stop_user_operation(res.msg.installed,res.msg.service_status)
							docker.dk_volumes = res['msg']['volume']
							return { data: res['msg']['volume'] };
					},
					default:"存储卷列表为空",
					column:[{
							type: 'checkbox',
							class: '',
							width: 20
					},
							{fid:'Name',width:216,title: '存储卷',template:function(row){
											return '<span class="size_ellipsis" style="width:200px" title="'+row.Name+'">'+row.Name+'</span>'
									}},
							{
									type: 'link',
									title: '挂载点',
									template:function(row){
											return '<a class="btlink size_ellipsis" style="width:250px" title="'+row.Mountpoint+'">'+row.Mountpoint+'</a>'
									},
									event: function (row) {
											openPath(row.Mountpoint);
									}
							},
							{
									fid:'container',
									title:'所属容器'
							},
							{fid: 'Driver',title: '设备'},
							{
									fid:'CreatedAt',
									width:150,
									title:'创建时间',
									template:function(row){
											return '<span>'+that.utc2beijing(row.CreatedAt)+'</span>'
									}
							},
							{
									width:206,
									title:'标签',
									template:function(row){
											var _label = []
											if(!$.isEmptyObject(row.Labels)){
													$.each(row.Labels,function(index,item){
															_label.push(index+'-'+item)
													})
											}
											return '<span class="size_ellipsis" style="width:190px">'+_label.join() +'</span>'
									}
							},
							{
									title: '操作',
									type: 'group',
									width: 60,
									align: 'right',
									group: [{
											title:'删除',
											event:function(row){
													bt.confirm({
															title: '删除存储卷【' + row.Name + '】',
															msg: '您真的要从列表中删除这个存储卷吗？'
													}, function () {
															that.ajax_task_method('remove',{data:{name:row.Name},tips:'删除存储卷'},function(res){
																	if(res.status)that.initTabConfig('volume')  //刷新列表
																	bt_tools.msg(res);

															})
													});
											}
									}]
							}],
					tootls:[{
							type: 'group',
							positon: ['left', 'top'],
							list: [{
									title: '添加存储卷',
									active: true,
									event: function (ev) {
											that.add_volume();
									}
							}]
					},{ // 批量操作
							type: 'batch', //batch_btn
							positon: ['left', 'bottom'],
							placeholder: '请选择批量操作',
							buttonValue: '批量操作',
							disabledSelectValue: '请选择需要批量操作的存储卷!',
							selectList: [{
									title: "删除存储卷",
									url: that.global_api,
									load: true,
									param:function(crow){
											return {data:that.batch_param_convert('remove',{name:crow.Name})}
									},
									refresh: true,
									callback: function (thatc) {
											bt.show_confirm("批量删除存储卷", "<span style='color:red'>同时删除选中的存储卷，是否继续？</span>", function () {
													thatc.start_batch({}, function (list) {
															var html = ''
															for (var i = 0; i < list.length; i++) {
																	var item = list[i];
																	html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + (item.request.status ? '成功' : '失败') + '</span></div></td></tr>';
															}
															dk_volume_table.$batch_success_table({
																	title: '批量删除存储卷',
																	th: '存储卷名',
																	html: html
															});
															dk_volume_table.$refresh_table_list(true);
													});
											});
									}
							}]
					}],success:function(){
						// 在左上方按钮组后增加一个文字"需求反馈"按钮
						if(!$('#dk_volume_table').find('.feedback_docker').length){
							$('#dk_volume_table .tootls_top').find('.pull-left').append('<span class="btlink feedback_docker ml10">需求反馈</span>')
							$('.feedback_docker').click(function(){
								that.openFeedback()
							})
						}
					}
			})
	},
	/**
	 * @description 获取仓库列表
	 */
	get_registry:function(){
			var that = this;
			var _config = $.extend({},this.global,{dk_def_name:'registry_list'})
			var dk_registry_table = bt_tools.table({
					el:'#dk_registry_table',
					load: true,
					url:this.global_api,
					height:750,
					param: {data:JSON.stringify(_config)},
					dataFilter: function (res) {
							if(!res.msg.installed || !res.msg.service_status) that.stop_user_operation(res.msg.installed,res.msg.service_status)
							docker.dk_registry = res['msg']['registry']
							return { data: res['msg']['registry'] };
					},
					default:"仓库列表为空",
					column:[{
							type: 'checkbox',
							class: '',
							width: 20
					},
							{width:266,title: 'URL',template:function(row){
											return '<span class="size_ellipsis" style="width:250px">'+row.url+'</span>'
									}},
							{fid: 'username',title: '用户'},
							{fid: 'name',title: '仓库名'},
							{
									fid: 'remark',
									title: '备注',
									type: 'input',
									blur: function (row, index, ev, key, thatc) {
											if (row.remark == ev.target.value) return false;
											row['remark'] = ev.target.value
											row['registry'] = row.url
											that.ajax_task_method('edit',{data:row})
									},
									keyup: function (row, index, ev) {
											if (ev.keyCode === 13) {
													$(this).blur();
											}
									}
							},
							{
									title: '操作',
									type: 'group',
									width: 100,
									align: 'right',
									group: [{
											title:'编辑',
											event:function(row){
													that.render_registry_view(row);
											}
									},{
											title:'删除',
											event:function(row){
													bt.confirm({
															title: '删除仓库【' + row.name + '】',
															msg: '您真的要从列表中删除这个仓库吗？'
													}, function () {
															that.ajax_task_method('remove',{data:{id:row.id},tips:'删除仓库'},function(res){
																	bt_tools.msg(res);
																	that.initTabConfig('registry')  //刷新列表
															})
													});
											}
									}]
							}],
					tootls:[{
							type: 'group',
							positon: ['left', 'top'],
							list: [{
									title: '添加仓库',
									active: true,
									event: function (ev) {
											that.render_registry_view();
									}
							}]
					},{ // 批量操作
							type: 'batch', //batch_btn
							positon: ['left', 'bottom'],
							placeholder: '请选择批量操作',
							buttonValue: '批量操作',
							disabledSelectValue: '请选择需要批量操作的仓库!',
							selectList: [{
									title: "删除仓库",
									url: that.global_api,
									load: true,
									param:function(crow){
											return {data:that.batch_param_convert('remove',{id:crow.id})}
									},
									refresh: true,
									callback: function (thatc) {
											bt.show_confirm("批量删除仓库", "<span style='color:red'>同时删除选中的仓库，是否继续？</span>", function () {
													thatc.start_batch({}, function (list) {
															var html = ''
															for (var i = 0; i < list.length; i++) {
																	var item = list[i];
																	html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + (item.request.status ? '成功' : '失败') + '</span></div></td></tr>';
															}
															dk_registry_table.$batch_success_table({
																	title: '批量删除仓库',
																	th: '仓库名',
																	html: html
															});
															dk_registry_table.$refresh_table_list(true);
													});
											});
									}
							}]
					}],success:function(){
						// 在左上方按钮组后增加一个文字"需求反馈"按钮
						if(!$('#dk_registry_table').find('.feedback_docker').length){
							$('#dk_registry_table .tootls_top').find('.pull-left').append('<span class="btlink feedback_docker ml10">需求反馈</span>')
							$('.feedback_docker').click(function(){
								that.openFeedback()
							})
						}
					}
			})
	},
	/**
	 * @description 获取镜像列表
	 */
	get_image:function(){
			var that = this;
			var _config = $.extend({},this.global,{dk_def_name:'image_list'})
			var dk_image_table = bt_tools.table({
					el:'#dk_image_table',
					load: true,
					url:this.global_api,
					minWidth: '1020px',
					height:750,
					param: {data:JSON.stringify(_config)},
					dataFilter: function (res) {
							if(!res.msg.installed || !res.msg.service_status) that.stop_user_operation(res.msg.installed,res.msg.service_status)
							that.dk_registry = res['msg']['registry_list']
							return { data: res['msg']['images_list'] };
					},
					default:"镜像列表为空",
					column:[{
							type: 'checkbox',
							class: '',
							width: 20
					},
							{
									width:200,
									title: 'ID',
									template:function(row){
											return '<span class="size_ellipsis" style="width:184px" title="'+row.id+'">'+row.id+'</span>'
									}
							},
							{
									fid:'name',
									title: '镜像名'
							},
							{
									width:86,
									title: '大小',
									template: function (row) {
											return '<span>'+bt.format_size(row.size)+'</span>'
									}
							},
							{
									width:150,
									title:'创建时间',
									template:function(row){
											return '<span>'+that.utc2beijing(row.time)+'</span>'
									}
							},
							{
									title: '操作',
									type: 'group',
									width: 140,
									align: 'right',
									group: [{
											title:'推送',
											event:function(row){
													var _registry = []
													if(that.dk_registry.length > 0){
															$.each(that.dk_registry,function(index,item){
																	_registry.push({title:item.name+'['+item.url+'/'+item.namespace+']',value:item.name})
															})
													}else{
															_registry = [{title:'请选择仓库',value:'dk_registry_false'}]
													}
													bt_tools.open({
															type: 1,
															title: '推送【'+row.name+'】到仓库',
															area: '560px',
															btn: ['确认', '关闭'],
															content: {
																	'class': "pd20",
																	form: [{
																			label:'仓库名',
																			group: {
																					name:'name',
																					type:'select',
																					width: "400px",
																					list:_registry
																			}
																	},{
																			label: "标签",
																			group: {
																					name: "tag",
																					type: "text",
																					value: '',
																					width: "400px",
																					placeholder:'请输入标签,如：image:v1'
																			}
																	}]
															},
															yes: function (formD,indexs) {
																	if (formD.name === 'dk_registry_false') return bt_tools.msg('请先创建仓库!', 2)
																	if (formD.tag === '') return bt_tools.msg('标签不能为空!', 2)
																	formD['id'] = row.id
																	that.get_log_situation()
																	that.ajax_task_method('push',{data:formD,tips:false},function(res){
																			that.remove_log_clearinterval();
																			if(res.status){
																					layer.closeAll();
																					that.initTabConfig('image')  //刷新列表
																			}
																			bt_tools.msg(res)
																	})
															}
													})
											}
									},{
											title:'导出',
											event:function(row){
													bt_tools.open({
															type: 1,
															title: '导出【'+row.name+'】镜像',
															area: '430px',
															btn: ['导出', '关闭'],
															content: {
																	'class': "pd20",
																	form: [{
																			label: "路径",
																			group: {
																					name: "path",
																					type: "text",
																					value: '',
																					width: "240px",
																					placeholder:'请输入镜像路径',
																					icon: {
																							type: 'glyphicon-folder-open',
																							event:function(){}
																					}
																			}
																	},{
																			label: "文件名",
																			group: {
																					name: "name",
																					type: "text",
																					value: '',
																					width: "240px",
																					placeholder:'请输入导出的文件名',
																					unit:'.tar'
																			}
																	}]
															},
															yes: function (formD,indexs) {
																	if (formD.path === '') return bt_tools.msg('路径不能为空!', 2)
																	if (formD.name === '') return bt_tools.msg('导出文件名不能为空!', 2)
																	formD['id'] = row.id

																	that.ajax_task_method('save',{data:formD,tips:'导出镜像'},function(res){
																			if(res.status){
																					layer.close(indexs);
																					that.initTabConfig('image')  //刷新列表
																			}
																			bt_tools.msg(res)
																	})
															}
													})
											}
									},{
											title:'删除',
											event:function(row){
													bt.confirm({
															title: '删除镜像【' + row.name + '】',
															msg: '您真的要从列表中删除这个镜像吗？'
													}, function () {
															that.ajax_task_method('remove',{data:{id:row.id,force:0,name:row.name},tips:'删除镜像'},function(res){
																	if(res.status) that.initTabConfig('image')  //刷新列表
																	bt_tools.msg(res);
															})
													});
											}
									}]
							}],
					tootls:[{
							type: 'group',
							positon: ['left', 'top'],
							list: [{
									title:'从仓库中拉取',
									active: true,
									event:function(ev){
											var _registry = []
											if(that.dk_registry.length > 0){
													$.each(that.dk_registry,function(index,item){
															_registry.push({title:item.name+'['+item.url+'/'+item.namespace+']',value:item.name})
													})
											}else{
													_registry = [{title:'请选择仓库',value:'dk_registry_false'}]
											}
											bt_tools.open({
													type: 1,
													title: '仓库拉取镜像',
													area: '560px',
													btn: ['确认', '关闭'],
													content: {
															'class': "pd20",
															form: [{
																	label:'仓库名',
																	group: {
																			name:'name',
																			type:'select',
																			width: "400px",
																			list:_registry
																	}
															},{
																	label: "镜像名",
																	group: {
																			name: "image",
																			type: "text",
																			value: '',
																			width: "400px",
																			placeholder:'请输入镜像名,如:image:v1'
																	}
															}]
													},
													yes: function (formD, indexs) {
															if (formD.name === 'dk_registry_false') return bt_tools.msg('请先创建仓库!', 2)
															if (formD.image === '') return bt_tools.msg('镜像名不能为空!', 2)
															that.get_log_situation()
															that.ajax_task_method('pull_from_some_registry',{data:formD,tips:false},function(res){
																	that.remove_log_clearinterval()
																	if(res.status){
																			layer.close(indexs);
																			that.initTabConfig('image')  //刷新列表
																	}
																	bt_tools.msg(res)
															})
													}
											})
									}
							},{
									title:'导入镜像',
									event:function(ev){
											bt_tools.open({
													type: 1,
													title: '导入镜像',
													area: '430px',
													btn: ['导入', '关闭'],
													content: {
															'class': "pd20",
															form: [{
																	label: "路径",
																	group: {
																			name: "path",
																			type: "text",
																			value: '',
																			width: "240px",
																			placeholder:'请输入镜像路径',
																			icon: {
																					type: 'glyphicon-folder-open',
																					select:'file',
																					event:function(){}
																			}
																	}
															}]
													},
													yes: function (formD, indexs) {
															if (formD.path === '') return bt_tools.msg('路径不能为空!', 2);
															that.ajax_task_method('load',{data:formD,tips:'导入镜像'},function(res){
																	if(res.status){
																			layer.close(indexs);
																			that.initTabConfig('image')  //刷新列表
																	}
																	bt_tools.msg(res)
															})
													}
											})
									}
							},{
									title: '构建镜像',
									event: function () {
											that.construction_image();
									}
							}]
					},{ // 批量操作
							type: 'batch', //batch_btn
							positon: ['left', 'bottom'],
							placeholder: '请选择批量操作',
							buttonValue: '批量操作',
							disabledSelectValue: '请选择需要批量操作的镜像!',
							selectList: [{
									title: "删除镜像",
									url: that.global_api,
									load: true,
									param:function(crow){
											return {data:that.batch_param_convert('remove',{id:crow.id,force:0,name:crow.name})}
									},
									refresh: true,
									callback: function (thatc) {
											bt.show_confirm("批量删除镜像", "<span style='color:red'>同时删除选中的镜像，是否继续？</span>", function () {
													thatc.start_batch({}, function (list) {
															var html = ''
															for (var i = 0; i < list.length; i++) {
																	var item = list[i];
																	html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + (item.request.status ? '成功' : '失败') + '</span></div></td></tr>';
															}
															dk_image_table.$batch_success_table({
																	title: '批量删除镜像',
																	th: '镜像名',
																	html: html
															});
															dk_image_table.$refresh_table_list(true);
													});
											});
									}
							}]
					}],success:function(){
						// 在左上方按钮组后增加一个文字"需求反馈"按钮
						if(!$('#dk_image_table').find('.feedback_docker').length){
							$('#dk_image_table .tootls_top').find('.pull-left').append('<span class="btlink feedback_docker ml10">需求反馈</span>')
							$('.feedback_docker').click(function(){
								that.openFeedback()
							})
						}
					}
			})
	},
	/**
	 * @description 获取设置页面
	 */
	get_setup:function(){
			var _html = '',that = this;
			this.ajax_task_method('get_config',{},function(res){
					var info = res.msg;
					var status_info = info.service_status ? ['开启', '#20a53a', 'play'] : ['停止', 'red', 'pause'];

					_html = '<div class="bt-form">\
							<div class="line">\
									<span class="tname">Docker服务：</span>\
									<div class="info-r"><div style="height: 33px;line-height: 33px;display: inline-block;">当前状态：<span>' + status_info[0] + '</span><span style="color:' + status_info[1] + '; margin-left: 3px;" class="glyphicon glyphicon glyphicon-' + status_info[2] + '"></span></div><div style="display: inline-block;margin-left: 49px;">\
											<button class="btn btn-default btn-sm serveSetup" data-setup="'+(info.service_status?'stop':'start')+'">'+(info.service_status?'停止':'开启')+'</button>\
											<button class="btn btn-default btn-sm serveSetup" data-setup="restart">重启</button>\
									</div></div>\
							</div>\
							<div class="line">\
									<span class="tname">容器监控：</span>\
									<div class="info-r">\
											<div class="inlineBlock mr50" style="margin-top: 5px;vertical-align: -6px;">\
													<input class="btswitch btswitch-ios" id="monitor_status" type="checkbox" name="monitor">\
													<label class="btswitch-btn" for="monitor_status" style="margin-bottom: 0;"></label>\
											</div>\
											<span class="unit">*设置容器页面监控开关,关闭后CPU使用率将不再监控</span>\
									</div>\
							</div>\
							<div class="line">\
									<span class="tname">监控天数：</span>\
									<div class="info-r">\
											<input class="bt-input-text" type="number" name="monitor_save_day" value="'+info.monitor_save_date+'" style="width:310px" placeholder="监控保存天数">\
											<button class="btn btn-success btn-sm mr10 monitorSubmit">保存</button>\
											<span class="unit">*设置容器页面监控保存天数</span>\
									</div>\
							</div>\
							<div class="line">\
									<span class="tname">加速URL：</span>\
									<div class="info-r">\
											<input class="bt-input-text" readonly disabled value="'+bt.htmlEncode.htmlEncodeByRegExp(info.registry_mirrors[0])+'" style="width:310px" placeholder="未设置加速URL">\
											<button class="btn btn-success btn-sm editSpeed">修改</button>\
									</div>\
							</div>\
					</div>'
					$('#dk_setup_form').html(_html)
					$('#monitor_status').prop('checked',info.monitor_status)  //监控状态
					//服务按钮
					$('.serveSetup').click(function(){
							var _set = $(this).data('setup');
							that.ajax_task_method('docker_service',{data:{act:_set},tips:'设置docker服务状态'},function(ress){
									if(ress.status) that.initTabConfig('setup')
									bt_tools.msg(ress)
							})
					})
					//容器监控开关
					$("#monitor_status").change(function(){
							var _status = $(this).prop('checked');
							that.ajax_task_method('set_docker_monitor',{data:{act:_status?'start':'stop'},tips:'设置容器监控配置'},function(res){
									if(res.status) that.initTabConfig('setup')
									bt_tools.msg(res)
							})
					})
					//容器监控天数
					$('.monitorSubmit').click(function(){
							var save_num = $('[name=monitor_save_day]').val();
							if(save_num <= 0)return layer.msg('监控保存天数不能小于0',{icon:2})

							that.ajax_task_method('set_monitor_save_date',{data:{save_date:save_num},tips:'设置容器监控配置'},function(res){
									if(res.status) that.initTabConfig('setup')
									bt_tools.msg(res)
							})
					})
					//设置加速url
					$('.editSpeed').click(function(){
							bt_tools.open({
									title:'设置加速URL',
									type:1,
									shadeClose: false,
									closeBtn: 2,
									area:'520px',
									content:{
											'class':'pd20',
											form:[{
													label:'加速URL',
													group:{
															type:'text',
															name:'registry_mirrors_address',
															value:bt.htmlEncode.htmlEncodeByRegExp(info.registry_mirrors[0]),
															width:'360px',
															placeholder:'请输入加速URL'
													}
											},{
													label:'',
													group:{
															type:'help',
															style:{'margin-top':'0'},
															list:[
																	'优先使用加速URL执行操作，请求超时将跳过使用默认加速方式',
																	'设置加速后需要手动重启docker',
																	'关闭加速请设置为空'
															]
													}
											}]
									},yes:function(formD,index){
											that.ajax_task_method('set_registry_mirrors',{data:formD,tips:false},function(uRes){
													if(uRes.status){
															layer.close(index)
															that.initTabConfig('setup')
													}
													bt_tools.msg(uRes)
											})
									}
							})
					})
			})
	},
	/**
	 * @description 快速部署项目
	 */
	get_fast_project:function(){
			var that = this,_html = '';
			this.ajax_task_method('get_project_list',{tips:'获取列表',model_name:{dk_model_name:'project'}},function(fList){
					if(!fList.installed || !fList.service_status){
							that.stop_user_operation(fList.installed,fList.service_status)
					}
					$.each(fList.project_info,function(i,item){
							_html+= '<div class="dk_fast_project_block">\
									<div class="dk_fp_header">\
											<p class="dk_fast_project_icon">'+item.icon+'</p>\
											<span>\
													<div class="dk_template_name">'+item.server_name+'</div>\
													<div class="dk_template_title">'+item.title+'</div>\
											</span>\
									</div>\
									<div class="dk_fp_centent">\
											<div class="dk_fp_template-introduce" title="'+item.ps+'">'+item.ps+'</div>\
									</div>\
									<a class="btlink" href="'+item.home+'" rel="noreferrer noopener"  style="display:block;margin-top: 10px;" target="_blank">前往官网></a>\
									<button type="button" class="btn btn-success btn-sm deployment_project" data-project="'+item.server_name+'">一键部署</button>\
							</div>'
					})
					$('#dk_fast_project_box').html(_html)
					//一键部署
					$('.deployment_project').click(function(){
							that.one_click_deployment($(this).data('project'))
					})
					//未安装或开启docker时
					$('.mask_layer .prompt_description').css('top','200px')
			})
	},
	/**
	 * @description 一键部署配置
	 */
	one_click_deployment:function(name){
			var that = this;
			this.ajax_task_method('get_project',{data:{server_name:name,dk_model_name:'project',dk_def_name:'get_project'},tips:'获取列表',model_name:{dk_model_name:'project'}},function(config){
					var fTable = null,dTable = null,_port = null,projectPh = '',pathPlaceholder = '',diyForm = [],initParam = {},contList = [];
					//排序
					config = config.sort(function(a,b){
							return a.sort-b.sort;
					})
					$.each(config,function(i,item){
							// 渲染表单
							var tItem = {
									label:item.ps,
									formLabelWidth:'110px',
									group:{
											width:'320px',
											type:item.type == 'string'?'text':item.type,
											name:item.key,
											value:item.value,
											placeholder:item.placeholder,
									}
							}
							// 给PROJECT_NAME添加输入事件
							if(item.key == 'PROJECT_NAME'){
									tItem['group']['input'] = function(value, form, that){
											var initPath = '/www/dk_project/projects/'
											that.$set_find_value({'REMARK': value.PROJECT_NAME,'VOLUME_PATH':initPath+value.PROJECT_NAME})
									}
									projectPh = item.placeholder
							}
							//跳过list类型
							if(item.type == 'list' || item.key == 'SERVER_NAME'){
									contList.push({key:item.key,value:item.value})
									return true;
							}
							if(item.key == 'PORT'){
									_port = item.value;  //获取端口
							}
							if(item.key == 'VOLUME_PATH'){              //获取数据存储目录
									pathPlaceholder = item.placeholder;
									tItem['group']['icon'] = {
											type: 'glyphicon-folder-open',
											select: 'dir',
											defaultPath:$('[name=VOLUME_PATH]').val(),
											event: function (ev) {},
									}
									tItem['group']['width'] = '320px';
									tItem['group']['value'] = '/www/dk_project/projects/'
							}
							initParam[item.key] = item.value;

							diyForm.push(tItem)
							// 端口后面增加系统防火墙放行
							if(item.key == 'PORT'){
									diyForm.push({label: '',formLabelWidth: '110px',group: {type: 'checkbox',name: 'is_open_port',title: '允许该端口从外部访问',event:function(row,el,dthat){
															var _index = $('[name=is_open_port]').parents('.line').index()
															if(dthat.config.form[_index].group.value == 1){
																	renderPortLine(_index,0,dthat)
																	return false;
															}
															layer.confirm('若允许该端口对外访问，将在系统防火墙放行此端口，为了您的安全起见，请在项目创建成功后尽快初始化项目。',{ title:'端口外部访问',icon: 3, closeBtn: 2,cancel:function(){
																			renderPortLine(_index,0,dthat)
																	}}, function (index) {
																	dthat.config.form[_index].group.value = 1;
																	layer.close(index)
															},function(){
																	renderPortLine(_index,0,dthat)
															});
													}},})
							}
					})

					//添加备注
					diyForm.push({label:'备注',formLabelWidth:'110px',group:{type:'text',name:'REMARK',width:'320px',placeholder:'项目备注'}})

            var tabs = [{
                title:'快速部署',
                callback:function(robj){
                    robj.html('<div id="fastMethod"></div>')
                    fTable = bt_tools.form({
                        el:'#fastMethod',
								form:[{
										label:'项目名称',
										formLabelWidth:'110px',
										group:{
												type:'text',
												name:'PROJECT_NAME',
												width:'320px',
												placeholder:projectPh,
												input:function(value, form, that){
														var initPath = '/www/dk_project/projects/'
														that.$set_find_value({'REMARK': value.PROJECT_NAME,'VOLUME_PATH':initPath+value.PROJECT_NAME})
												}
										}
								},{
										label:'端口',
										formLabelWidth:'110px',
										group:{
												type:'number',
												name:'PORT',
												width:'320px',
												value:_port,
												placeholder:'服务器端口'
										}
								},{
										label: '',
										formLabelWidth: '110px',
										group: {
												type: 'checkbox',
												name: 'is_open_port',
												title: '允许该端口从外部访问',
												event:function(row,el,dthat){
														var _index = $('[name=is_open_port]').parents('.line').index()
														if(dthat.config.form[_index].group.value == 1){
																renderPortLine(_index,0,dthat)
																return false;
														}
														layer.confirm('若允许该端口对外访问，将在系统防火墙放行此端口，为了您的安全起见，请在项目创建成功后尽快初始化项目。',{ title:'端口外部访问',icon: 3, closeBtn: 2,cancel:function(){
																		renderPortLine(_index,0,dthat)
																}}, function (index) {
																dthat.config.form[_index].group.value = 1;
																layer.close(index)
														},function(){
																renderPortLine(_index,0,dthat)
														});
												}
										},
								},{
										label:'数据存储目录',
										formLabelWidth:'110px',
										group:{
												type: 'text',
												width: '320px',
												name:'VOLUME_PATH',
												placeholder:pathPlaceholder,
												value:'/www/dk_project/projects/',
												icon: {
														type: 'glyphicon-folder-open',
														select: 'dir',
														defaultPath:$('[name=VOLUME_PATH]').val(),
														event: function (ev) {},
												}
										}
								},{
										label:'备注',
										formLabelWidth:'110px',
										group:{
												type:'text',
												name:'REMARK',
												width:'320px',
												placeholder:'项目备注'
										}
                        }]
                    })
                }
								},{
                title:'自定义部署',
                callback:function(robj){
                    robj.html('<div id="diyMethod"></div>')
                    dTable = bt_tools.form({
                        el:'#diyMethod',
                        form:diyForm
                    })
													}
            }]
            // 设置端口放行样式/行内刷新
            function renderPortLine(index,isOpen,dConfig){
                if(typeof dConfig != 'undefined'){
                    dConfig.config.form[index].group.value = isOpen;
                    dConfig.$replace_render_content(index)
											}
                // 设置端口放行样式
                $('[name=is_open_port]').parents('.line').css('padding-top','0').find('.tname,.form-checkbox-label').css({'height':'16px','line-height':'16px','margin':'0'})
            }
            bt_tools.open({
                type:1,
                title:'一键部署'+name,
                skin:'layer-fast-deployment-view',
                area:'530px',
                btn:['一键部署','取消'],
                content: '<div class="pd15"><div id="createFastProject" class="tab-nav"></div><div class="tab-con"></div></div>',
							success:function(){
                    bt.render_tab('createFastProject', tabs)
                    $('#createFastProject span:eq(0)').click();
									$('.layer-fast-deployment-view').css('top', (($(window).height() - $('.layer-fast-deployment-view').height()) / 2) + 'px')
									// 设置端口放行样式
									renderPortLine()
                    $('#createFastProject span').click(function(){
                        $('.layer-fast-deployment-view').css('top', (($(window).height() - $('.layer-fast-deployment-view').height()) / 2) + 'px')
                        // 设置端口放行样式
                        renderPortLine()
                    })
							},yes:function(layers){
									var tabIndex = $('#createFastProject span.on').index(),getConfig = null,sumbitStatus = true,setOpenPort = false;
									if(tabIndex == 0){
											getConfig = fTable.$get_form_value()
									}else{
											getConfig = dTable.$get_form_value()
									}
									// 是否端口放行
									if(getConfig.is_open_port){
											setOpenPort = true;
									}
									delete getConfig.is_open_port;   //删除放行判断字段
									// 循环判断是否有空值
									$.each(getConfig,function(item){
											if(getConfig[item] == '' && (item != 'VOLUME_PATH' && item != 'REMARK')) {
													layer.msg($('[name='+item+']').parents('.line').find('.tname').text()+'不能为空',{icon:2})
													sumbitStatus = false;
													return false;
											}
									})
									// 判断是否可提交
									if(!sumbitStatus) return false;
									// 整合提交参数
									var _newConfig = $.extend(initParam,getConfig),_param = []
									$.each(_newConfig,function(key,item){
											_param.push({key:key,value:item})
									})
									_param = _param.concat(contList)
									// 提交数据
									that.get_log_situation(true)  //获取日志
									that.ajax_task_method('create_project',{data:{ project_conf:_param,dk_model_name:'project',dk_def_name:'create_project'},tips:false,model_name:{dk_model_name:'project'}},function(res){
											that.remove_log_clearinterval(); //移除日志
											if(res.status){
													layer.closeAll()
													if(setOpenPort){
															bt_tools.send({url:'/safe/firewall/create_rules',data:{data:JSON.stringify({protocol:"tcp",ports:getConfig.PORT,choose:"all",address:"",domain:"",types:"accept",brief:"Docker项目端口",source:""})}},function(){
																	that.visit_info_view(name,res)
															},{load:'添加放行端口'})
													}else{
															that.visit_info_view(name,res)
													}
											}else{
													layer.msg(res.msg,{icon:2})
											}
									})
							}
					})
			})
	},
	openFeedback: function () {
    var openFeed = bt_tools.open({
			area:['570px','380px'],
			btn:false,
			content:'<div id="feedback">\
			<div class="nps_survey_banner">\
			<span class="Ftitle"> <i></i> <span style="vertical-align:4px;">宝塔面板docker需求反馈收集</span> </span>\
		</div>\
		<div style="padding: 25px 0 0 40px">\
			<div class="flex flex-col items-center">\
				<div id="feedForm"></div>\
			</div>\
		</div>\
		</div>',
			success:function(that){
					//打开弹窗后执行的事件
					that.find('.layui-layer-title').remove()
					bt_tools.form({
						el:'#feedForm',
						form:[
								{
								group: {
										type: 'textarea',
										name: 'feed',
										style: {
												'width': '500px',
												'min-width': '500px',
												'min-height': '130px',
												'line-height': '22px',
												'padding-top': '10px',
												'resize': 'none'
										},
										tips: { //使用hover的方式显示提示
											text: '<span>如果您在使用过程中遇到任何问题或功能不完善，请将您的问题或需求详细描述给我们，</span><br>我们将尽力为您解决或完善。',
											style: { top: '126px', left: '50px' },
										},
								}
								},
								{
									group:{
											name: 'tips',
											type: 'other',
											boxcontent:'<div style="color:#20a53a;margin-left:30px;">我们特别重视您的需求反馈，我们会定期每周进行需求评审。希望能更好的帮到您</div>'
									}
								},
								{
									group: {
											type: 'button',
											size: '',
											name: 'submitForm',
											class:'feedBtn',
											style:'margin:6px auto 0;padding:6px 40px;',
											title: '提交',
											event: function (formData, element, that) {
													// 触发submit
													if(formData.feed == '') {
														return bt.msg({status:false,msg:'请填写反馈内容'})
													}
													bt_tools.send({url:'config?action=write_nps_new',data:{questions:JSON.stringify({'998':formData.feed}),software_name:1,rate:0,product_type:10}},function(ress){
														if(ress.status){
															openFeed.close()
															layer.open({
																title: false,
																btn: false,
																shadeClose: true,
																shade:0.1,
																closeBtn: 0,
																skin:'qa_thank_dialog',
																area: '230px',
																content: '<div class="qa_thank_box" style="background-color:#F1F9F3;text-align: center;padding: 20px 0;"><img src="/static/img/feedback/QA_like.png" style="width: 55px;"><p style="margin-top: 15px;">感谢您的参与!</p></div>',
																success: function (layero,index) {
																	$(layero).find('.layui-layer-content').css({'padding': '0','border-radius': '5px'})
																	$(layero).css({'border-radius': '5px','min-width': '230px'})
					
																	setTimeout(function(){layer.close(index)},3000)
																}
															})
														}
												},'提交反馈')
													
											}
									}
								}
						]
				})
			},
			yes:function(){
					//点击确定时,如果btn:false,当前事件将无法使用
			},
			cancel: function () {
					//点击右上角关闭时,如果btn:false,当前事件将无法使用
			}
	})
  },
	/**
	 * @description 访问项目信息界面
	 * @param {String} name   项目名称
	 * @param {Object} info   项目信息
	 */
	visit_info_view:function(name,info){
			var _info = info.msg,deploymentInfo = '<p class="p1">访问地址</p>\
			<p><span>外网地址：</span><strong><a class="btlink" rel="noreferrer noopener" target="_blank" href="'+_info.protocol+'://'+_info.server_ip+':'+_info.port+'">'+_info.protocol+'://'+_info.server_ip+':'+_info.port+'</a></strong></p>\
			<p><span>内网地址：</span><strong><a class="btlink" rel="noreferrer noopener" target="_blank" href="'+_info.protocol+'://'+_info.local_ip+':'+_info.port+'">'+_info.protocol+'://'+_info.local_ip+':'+_info.port+'</a></strong></p>'
			bt_tools.open({
					type:1,
					title:'已成功部署【'+name+'】',
					skin:'layer-fast-deployment-result-view',
					area:'530px',
					btn:false,
					content: "<div class='success-msg'>\
							<div class='pic'><img src='/static/img/success-pic.png'></div>\
							<div class='suc-con'>\
									" + deploymentInfo + "\
							</div>\
					</div>",
					success:function(){
							if ($(".success-msg").height() < 150) {
									$(".success-msg").find("img").css({
											"width": "120px",
											"margin-top": "45px"
									});
							}
					}
			})

	},
	/**
	 * @description 更新项目列表
	 */
	update_project_list:function(){
			var that = this;
			this.ajax_task_method('sync_item',{data:{dk_model_name:'project',dk_def_name:'sync_item'},tips:'更新项目列表',model_name:{dk_model_name:'project'}},function(newRes){
					var resultHTML = '',_num = 0
					$.each(newRes[0].server_name, function (index, item) {
							_num++
							resultHTML += '<tr><td><span class="text-overflow" title="' + item + '">' + item + '</span></td><td><div style="float:right;" class="size_ellipsis"><span style="color:#20a53a">更新成功</span></div></td></tr>';
					});
					$.each(newRes[1].server_name, function (key, item) {
							_num++
							resultHTML += '<tr><td><span class="text-overflow" title="' + item + '">' + item + '</span/></td><td><div style="float:right;" class="size_ellipsis"><span style="color:red">更新失败</span></div></td></tr>';
					});
					bt.open({
							type: 1,
							title: '更新项目列表',
							area:['350px', '350px'],
							shadeClose: false,
							closeBtn: 2,
							content: '<div class="batch_title"><span class><span class="batch_icon"></span><span class="batch_text">更新项目列表完成！</span></span></div><div class="' + (_num > 4 ? 'fiexd_thead' : '') + ' batch_tabel divtable" style="margin: 15px 30px 15px 30px;overflow: auto;height: 200px;"><table class="table table-hover"><thead><tr><th>项目名称</th><th style="text-align:right;width:120px;">操作结果</th></tr></thead><tbody>' + resultHTML + '</tbody></table></div>',
							success: function () {
									if (_num > 4){
											$('.fiexd_thead').scroll(function () {
													var scrollTop = this.scrollTop;
													this.querySelector('thead').style.transform = 'translateY(' + (scrollTop-1) + 'px)';
											});
									}
							}
					});

					that.get_fast_project();
			})
	},
	/**
	 * @description 日志管理
	 */
	logs_manager: function (listId) {
		bt_tools.open({
			title: '容器日志',
			area: ['1000px','700px'],
			btn: false,
			content: '<div id="docker-container-log">\
				<div class="log-left-box">\
					<ul>\
					</ul>\
				</div>\
				<div class="log-right-box">\
					<div class="log-cutting">\
						<div>\
							<span class="mr4" style="vertical-align: middle;">日志切割</span>\
							<div class="log-cutting-item mr20" style="display: inline-block;vertical-align: middle;">\
								<input class="btswitch btswitch-ios" id="isLogCutting" type="checkbox">\
								<label class="btswitch-btn isLogCutting mb0" for="isLogCutting"></label>\
							</div>\
							<span class="unit">开启后<span>每天2点0分</span>进行切割日志文件，如需修改请点击<a href="javascript:;" class="btlink edit-log-config">编辑配置</a></span>\
						</div>\
					</div>\
					<div class="log-content-box">\
						<div class="log-content-group">\
							<div>\
								<button type="button" title="刷新日志" class="btn btn-default btn-sm refresh-log"><span>刷新日志</span></button>\
								<div class="inlineBlock dividing-line" style="margin: 0 10px"></div>\
								<button type="button" title="下载日志" class="btn btn-default btn-sm download-log"><span>下载日志</span></button>\
								<button type="button" title="清空日志" class="btn btn-default btn-sm clear-log"><span>清空日志</span></button>\
							</div>\
							<div class="searcTime mt0">\
								<span class="gt on" data-type="all">全部</span>\
								<span class="gt" data-type="7">最近7天</span>\
								<span class="gt" data-type="30">最近30天</span>\
								<span class="last-span" data-type="custom">\
									<input id="time_choose" autocomplete="off" placeholder="自定义时间" type="text">\
								</span>\
							</div>\
							<div class="bt-search ml10 hide">\
								<input type="text" class="search-input" placeholder="请输入需要搜索的日志">\
								<span class="glyphicon glyphicon-search" aria-hidden="true"></span>\
							</div>\
						</div>\
						<div class="log-content">\
							<div class="bt-form" id="docker_log" style="height: 100%;"></div>\
							<div class="c6 mt10">提示：支持Ctrl + F，快捷搜索日志内容</div>\
							<span class="icon-full full" title="全屏展示"></span>\
						</div>\
					</div>\
				</div>\
			</div>',
			success: function () {
				var configInfo = {}, // 选中容器信息
						configData = [] // 所有容器信息列表

				get_logs_all()
				// 获取所有日志状态
				function get_logs_all() {
					bt_tools.send({url: '/project/docker/model?action=get_logs_all',data: {url:"unix:///var/run/docker.sock",dk_model_name:"container",dk_def_name:"get_logs_all"}},function (res) {
						configData = res
						render_log_menu(res)
					})
				}
				// 渲染左侧菜单
				function render_log_menu (data) {
					var _li = ''
					for (var i = 0; i < data.length; i++) {
						var item = data[i]
						_li += '<li title="容器：'+ item.name +'\n日志大小：'+ bt.format_size(item.size) +'" data-index="'+ i +'" >'+ item.name+ '（'+ bt.format_size(item.size) +'）' +'</li>'
					}
					$('.log-left-box ul').html(_li)

					$('.log-left-box ul li').click(function () {
						var i = $(this).data('index')
						configInfo = configData[i] // 配置信息
						$(this).addClass('active').siblings().removeClass('active')
						$('.searcTime span:eq(0)').addClass('on').siblings().removeClass('on')
						$('#docker-container-log .search-input').val('')
						get_logs({id: configInfo.id,name: configInfo.name})
						$('#isLogCutting').prop('checked', configInfo.split_status)
						$('.log-cutting .unit span').text((configInfo.split_type === 'day' ? '每天' + configInfo.split_hour  +'点' + configInfo.split_minute+'分' : '日志文件大小超过'+ bt.format_size(configInfo.split_size)))
					})
					var num = 0
					if(listId) {
						for (var i = 0; i < configData.length; i++) {
							if(configData[i].id === listId) {
								num = i
							}							
						}
					}
					$('.log-left-box ul li').eq(num).click()
				}

				// 获取指定日志内容
				function get_logs(obj) {
					bt_tools.send({url: '/project/docker/model?action=container-get_logs',data: {id: obj.id,search: obj.search,time_search: obj.time_search,url:"unix:///var/run/docker.sock",dk_model_name:"container",dk_def_name:"get_logs"}},function (res) {
						var msg = res.msg ? res.msg : '暂无日志数据'
						var docker_log_obj = {
							el:'docker_log',
							mode:'dockerfile',
							content: msg,
							readOnly: true,
							theme:'ace/theme/monokai'
						}
						var aEditor = bt.aceEditor(docker_log_obj)
						setTimeout(function () {
							aEditor.ACE.getSession().setScrollTop(aEditor.ACE.renderer.scrollBar.scrollHeight)
						},50)
						bt.site.fullScreenLog($('<div>'+ msg +'</div>'),{name: obj.name},'容器',true)
					}, '获取指定容器日志')
				}

				// 日志切割开关
				$('#isLogCutting').unbind('change').change(function () {
					var $this = $(this)
					var checked = $this.prop('checked'),param = {}
					if(checked) {
						param = {
							pid: configInfo.id,log_path: configInfo.log_path,split_type: "day",split_size: '',split_hour: configInfo.split_hour,split_minute: configInfo.split_minute,save: configInfo.save
						}
					}else {
						param = {
							pid: configInfo.id,
						}
					}
					var params = Object.assign(param,{url:"unix:///var/run/docker.sock",dk_model_name:"container",dk_def_name:"docker_split",type: checked ? 'add' : 'del'})
					bt.simple_confirm({title: (checked ? '开启' : '关闭')+'日志切割',msg: (checked ? '开启后对该容器日志进行切割，是否继续操作？' : '关闭后将无法对该容器日志进行切割，是否继续操作？')},function () {
						bt_tools.send({
							url: '/project/docker/model?action=container-docker_split',
							data: params
						}, function (rdata) {
							bt_tools.msg(rdata);
							if(rdata.status) {
								bt_tools.send({url: '/project/docker/model?action=get_logs_all',data: {url:"unix:///var/run/docker.sock",dk_model_name:"container",dk_def_name:"get_logs_all"}},function (res) {
									configData = res
									$('.log-left-box li.active').click()
								})
							}
						}, checked ? '开启日志切割' : '关闭日志切割')
					},function () {
						$this.prop('checked',!checked)
					})
				});

				// 时间筛选
				$('.searcTime .gt').click(function () {
					$(this).addClass('on').siblings().removeClass('on')
					timeSearch()
				})

				$('#docker-container-log .search-input').on('input',function () {
					setTimeout(function() {
						timeSearch()
					},200)
				})
				// 自定义日期
				$('#time_choose').removeAttr("lay-key")
				laydate.render({
					elem: '#time_choose',
					range: true,
					value:'',
					max: bt.format_data(new Date().getTime(), 'yyyy-MM-dd'),
					done: function(value, startdate, endDate){
						var timeA  = value.split(' - ')
						$("#time_choose").val(value);
						if(timeA[0] == '') timeA[0] = dateList[0];
						$(".last-span").addClass("on").siblings().removeClass("on")
						timeSearch()
					}
				});

				// 时间筛选搜索
				function timeSearch() {
					var type = $('.searcTime .on').data('type'),
							val = $('#docker-container-log .search-input').val(),
							startTime = 0,
							endTime = 0
					if(type === 'all') {
						get_logs({id: configInfo.id,name: configInfo.name,search: val})
					}else if(type === 'custom') {
						var time = $("#time_choose").val().split(' - ')
						startTime = new Date(time[0] + ' 00:00:00').getTime() / 1000
						endTime = new Date(time[1] + ' 23:59:59').getTime() / 1000
						get_logs({id: configInfo.id,name: configInfo.name,time_search: JSON.stringify([startTime,endTime]),search: val})
					}else {
						startTime = new Date(bt.get_date(-type)).getTime() / 1000
						endTime = new Date(bt.get_date(0) + ' 23:59:59').getTime() / 1000
						get_logs({id: configInfo.id,name: configInfo.name,time_search: JSON.stringify([startTime,endTime]),search: val})
					}
				}

				// 编辑配置
				$('.edit-log-config').click(function(){
					bt_tools.open({
						type: 1,
						area: '460px',
						title: '配置日志切割任务',
						closeBtn: 2,
						btn: ['提交', '取消'],
						content: {
							'class': 'pd20 mamger_log_split_box',
							form: [{
								label: '执行时间',
								group: [{
									type: 'text',
									name: 'day',
									width: '44px',
									value: '每天',
									disabled: true
								},{
									type: 'number',
									name: 'split_hour',
									'class': 'group',
									width: '70px',
									value: configInfo.split_hour || '2',
									unit: '时',
									min: 0,
									max: 23
								}, {
									type: 'number',
									name: 'split_minute',
									'class': 'group',
									width: '70px',
									min: 0,
									max: 59,
									value: configInfo.split_minute || '0',
									unit: '分'
								}]
							},{
								label: '日志大小',
								group:{
									type: 'text',
									name: 'split_size',
									width: '220px',
									value: configInfo.split_size ? bt.format_size(configInfo.split_size,true,2,'MB').replace(' MB','') : '',
									unit: 'MB',
									placeholder: '请输入日志大小',
								}
							}, {
								label: '保留最新',
								group:{
									type: 'number',
									name: 'save',
									'class': 'group',
									width: '70px',
									min: 1,
									value: configInfo.save || '180',
									unit: '份'
								}
							}]
						},
						success: function (layero, index) {
							$(layero).find('.mamger_log_split_box .bt-form').prepend('<div class="line"><span class="tname">切割路径</span><div class="info-r" style="line-height: 32px;">/var/lib/docker/containers/history_logs<a onclick="openPath(`/var/lib/docker/containers/history_logs`)" class="btlink ml10">打开目录</a></div></div><div class="line">\
							<span class="tname">切割方式</span>\
							<div class="info-r">\
								<div class="replace_content_view" style="line-height: 32px;">\
									<div class="checkbox_config">\
										<i class="file_find_radio '+ (configInfo.split_type === 'size' ? 'active' : '') +'"></i>\
										<span class="laberText" style="font-size: 12px;">按日志大小</span>\
									</div>\
									<div class="checkbox_config">\
										<i class="file_find_radio '+ (configInfo.split_type === 'size' ? '' : 'active') +'"></i>\
										<span class="laberText" style="font-size: 12px;">按执行时间</span>\
									</div>\
								</div>\
							</div>')
							$(layero).find('.mamger_log_split_box .bt-form').append('<div class="line"><div class=""><div class="inlineBlock  "><ul class="help-info-text c7"><li>每5分钟执行一次</li><li>【日志大小】：日志文件大小超过指定大小时进行切割日志文件</li><li>【保留最新】：保留最新的日志文件，超过指定数量时，将自动删除旧的日志文件</li></ul></div></div></div>')
							$(layero).find('.replace_content_view .checkbox_config').click(function(){
								var index = $(this).index()
								$(this).find('i').addClass('active').parent().siblings().find('i').removeClass('active')
								if(index){
									$(layero).find('[name=split_hour]').parent().parent().parent().show()
									$(layero).find('[name=split_size]').parent().parent().parent().hide()
									$(layero).find('.help-info-text li').eq(0).hide().next().hide()
								}else{
									$(layero).find('[name=split_hour]').parent().parent().parent().hide()
									$(layero).find('[name=split_size]').parent().parent().parent().show()
									$(layero).find('.help-info-text li').eq(0).show().next().show()
								}
							})
							if(configInfo.split_type === 'size') {
								$(layero).find('[name=split_hour]').parent().parent().parent().hide()
							}else{
								$(layero).find('[name=split_size]').parent().parent().parent().hide()
								$(layero).find('.help-info-text li').eq(0).hide().next().hide()
							}
							$(layero).find('[name=split_size]').on('input', function(){
								layer.closeAll('tips');
								if($(this).val() < 1 || !bt.isInteger(parseFloat($(this).val()))) {
									layer.tips('请输入日志大小大于0的的整数', $(this), { tips: [1, 'red'], time: 2000 })
								}
							})
							$(layero).find('[name=split_hour]').on('input', function(){
								layer.closeAll('tips');
								if($(this).val() > 23 || $(this).val() < 0 || !bt.isInteger(parseFloat($(this).val()))) {
									layer.tips('请输入小时范围0-23的整数时', $(this), { tips: [1, 'red'], time: 2000 })
								}
								$(layero).find('.split_hour').text($(this).val())
							})
							$(layero).find('[name=split_minute]').on('input', function(){
								layer.closeAll('tips');
								if($(this).val() > 59 || $(this).val() < 0 || !bt.isInteger(parseFloat($(this).val()))) {
									layer.tips('请输入正确分钟范围0-59分的整数', $(this), { tips: [1, 'red'], time: 2000 })
								}
								$(layero).find('.split_minute').text($(this).val())
							})
							$(layero).find('[name=num]').on('input', function(){
								layer.closeAll('tips');
								if($(this).val() < 1 || $(this).val() > 1800 || !bt.isInteger(parseFloat($(this).val()))) {
									layer.tips('请输入保留最新范围1-1800的整数', $(this), { tips: [1, 'red'], time: 2000 })
								}
							})
						},
						yes: function (formD,indexs) {
							formD['pid'] = configInfo.id
							formD['log_path'] = configInfo.log_path
							formD['type'] = 'add'
							delete formD['day']
							formD['split_type'] = $('.mamger_log_split_box .file_find_radio.active').parent().index() ? 'day' : 'size'
							if($('.mamger_log_split_box .file_find_radio.active').parent().index()) {
								if (formD.split_hour < 0 || formD.split_hour > 23 || isNaN(formD.split_hour) || formD.split_hour === '' || !bt.isInteger(parseFloat(formD.split_hour))) return layer.msg('请输入小时范围0-23时的整数')
								if (formD.split_minute < 0 || formD.split_minute > 59 || isNaN(formD.split_minute) || formD.split_minute === '' || !bt.isInteger(parseFloat(formD.split_minute))) return layer.msg('请输入正确分钟范围0-59分的整数')
								formD['split_size'] = ''
							}else{
								if(formD.split_size == '' || !bt.isInteger(parseFloat(formD.split_size))) return layer.msg('请输入日志大小大于0的的整数')
								formD.split_size = formD.split_size * 1024 *1024
							}
							if(formD.save < 1 || formD.save > 1800 || !bt.isInteger(parseFloat(formD.save))) return layer.msg('请输入保留最新范围1-1800的整数')
							var params = Object.assign(formD,{url:"unix:///var/run/docker.sock",dk_model_name:"container",dk_def_name:"docker_split"})
							bt_tools.send({url: '/project/docker/model?action=container-docker_split',data: params},function (res) {
								bt_tools.msg(res)
								if(res.status) {
									layer.close(indexs)
									bt_tools.send({url: '/project/docker/model?action=get_logs_all',data: {url:"unix:///var/run/docker.sock",dk_model_name:"container",dk_def_name:"get_logs_all"}},function (res) {
										configData = res
										$('.log-left-box li.active').click()
									})
								}
							})
						}
					})
				})

				$('.refresh-log').click(function () {
					$('.log-left-box li.active').click()
				})
				// 日志清空
				$('.clear-log').click(function () {
					bt.compute_confirm({title: '清空容器【'+ configInfo.name +'】日志',msg: '清空该日志后，将无法查询容器以往的日志信息，是否继续操作？'},function () {
						bt_tools.send({url: '/project/docker/model?action=container-clear_log',data:{url:"unix:///var/run/docker.sock",dk_model_name:"container",dk_def_name:"clear_log",log_path: configInfo.log_path}},function (res) {
							bt_tools.msg(res)
							if(res.status) $('.log-left-box li.active').click()
						})
					})
				})

				// 下载日志
				$('.download-log').click(function () {
					window.open('/download?filename='+ configInfo.log_path)
				})
			}
		})
	},
	/**
	 * @description 添加容器
	 */
	add_container:function(){
			var that = this,_imageList = '',_volumesList = '',add_pro = null;
			if(this.dk_images.length > 0){
					$.each(this.dk_images,function(index,item){
							_imageList += '<option value="'+item.name+'">'+item.name+'</option>'
					})
			}
			if(this.dk_volumes.length > 0){
					$.each(this.dk_volumes,function(index,item){
							_volumesList +='<li data-key="'+item.Name+'" title="'+item.Name+'">'+item.Name+'</li>'
					})
			}

			layer.open({
					type: 1,
					closeBtn: 2,
					title:'添加容器',
					area:['570px','630px'],
					skin:'add_container',
					btn:['添加','取消'],
					shadeClose: false,
					content:'<div class="pd20">\
							<div class="tab-nav mb15">\
									<span class="on">创建容器</span><span>容器编排</span>\
							</div>\
							<div class="tabs_content">\
									<div class="tabpanel">\
											<div class="bt-form" style="height: 450px;overflow: overlay;">\
													<div class="line"><span class="tname">容器</span>\
															<div class="info-r">\
																	<input class="bt-input-text" name="dk_container_name" style="width:160px" placeholder="请输入容器名,如：docker_1">\
																	<span class="line-tname">镜像</span>\
																	<select class="bt-input-text" name="dk_image" style="width:160px">'+_imageList+'</select>\
															</div>\
													</div>\
													<div class="line"><span class="tname">端口</span>\
															<div class="info-r">\
																	<select class="bt-input-text" name="dk_port" style="width:160px">\
																			<option value="0">暴露端口</option>\
																			<option value="1">暴露所有</option>\
																	</select>\
																	<div class="mt10 dk_port_setting">\
																			<input class="bt-input-text" name="dk_port_map" style="width:160px" placeholder="容器端口">\
                                        <span class="minus">-</span>\
																			<input class="bt-input-text" name="dk_server_map" style="width:160px" placeholder="服务器端口">\
                                        <span class="plus" data-type="port">+</span>\
																			<div class="divtable dk_port_table mt10">\
																					<table class="table table-hover">\
																							<thead><tr><th>容器端口</th><th>服务器端口</th><th width="40" style="text-align: right;">操作</th></tr></thead>\
																							<tbody></tbody>\
																					</table>\
																			</div>\
																	</div>\
															</div>\
													</div>\
													<div class="line"><span class="tname">启动命令</span>\
															<div class="info-r">\
																	<input class="bt-input-text" name="dk_start_cmd" style="width:393px" placeholder="请输入启动命令">\
															</div>\
													</div>\
													<div class="line"><span class="tname"></span>\
															<div class="info-r">\
																	<span class="shop_container_del cu-pointer">\
																			<i class="cust—checkbox form-checkbox" style="margin-right:5px"></i>容器停止后自动删除容器\
																			<input type="checkbox" class="hide">\
																	</span>\
															</div>\
													</div>\
													<div class="line"><span class="tname">限制CPU</span>\
															<div class="info-r">\
																	<input class="bt-input-text" value="1" type="number" name="dk_cpu_num" style="width:130px;border-top-right-radius: 0;border-bottom-right-radius: 0;"><span class="unit">个</span>\
																	<span class="line-tname">内存</span>\
																	<input class="bt-input-text" value="100" type="number" name="dk_cpu_size" style="width:98px">\
																	<select class="bt-input-text" name="dk_cpu_unit" style="width:60px">\
																			<option value="k">KB</option>\
																			<option value="MB" selected>MB</option>\
																			<option value="g">GB</option>\
																	</select>\
															</div>\
													</div>\
													<div class="line"><span class="tname">挂载卷</span>\
															<div class="info-r">\
																	<div class="">\
																			<div class="dk_volumes_box">\
																					<input class="bt-input-text" name="dk_server_path" style="width:153px" placeholder="服务器目录">\
																					<ul class="dk_volumes">'+_volumesList+'</ul>\
																					<select class="bt-input-text" name="volumes_type" style="width:60px"><option value="rw">读写</option><option value="ro">只读</option></select>\
																					<input class="bt-input-text" name="dk_volumes_path" style="width:153px" placeholder="容器目录">\
                                            <span class="plus" data-type="path">+</span>\
																					<div class="divtable dk_path_table mt10">\
																							<table class="table table-hover">\
																									<thead><tr><th>服务器目录</th><th>权限</th><th>容器目录</th><th width="40" style="text-align: right;">操作</th></tr></thead>\
																									<tbody></tbody>\
																							</table>\
																					</div>\
																			</div>\
																	</div>\
															</div>\
													</div>\
													<div class="line"><span class="tname">标签</span>\
															<div class="info-r">\
																	<textarea placeholder="容器标签，一行一个，例：key=value" name="dk_tag" class="bt-input-text" style="width: 393px; height: 70px; resize: auto; line-height: 20px;"></textarea>\
															</div>\
													</div>\
													<div class="line"><span class="tname" style="height: auto;line-height: 20px;">环境变量</br>(每行一个)</span>\
															<div class="info-r">\
																	<textarea placeholder="添加环境变量格式如下，有多个请换行添加：JAVA_HOME=/usr/local/java8&#10;HOSTNAME=master" class="bt-input-text" name="dk_config" style="width: 393px; height: 70px; resize: auto; line-height: 20px;"></textarea>\
															</div>\
													</div>\
													<div class="line"><span class="tname">重启规则</span>\
															<div class="info-r">\
																	<select class="bt-input-text" name="dk_reset" style="width:160px">\
																			<option value="always">关闭后马上重启</option>\
																			<option value="on-failure">错误时重启(默认重启5次)</option>\
																			<option value="" selected>不重启</option>\
																	</select>\
																	<span class="c9">*手动关闭的将不会自动启动</span>\
															</div>\
													</div>\
											</div>\
									</div>\
									<div class="tabpanel" style="display:none;">\
											<div id="add_project_form"></div>\
									</div>\
							</div>\
					</div>',
            success:function(){
							$(".add_container").on('click', '.tab-nav span', function () {
									var index = $(this).index();
									$(this).addClass('on').siblings().removeClass('on');
									$('.tabs_content .tabpanel').eq(index).removeAttr('style').siblings().attr('style','display:none')
							});
							// <----------容器----------->
							//服务器目录事件
							$('[name=dk_server_path]').click(function(e){
									var _ul = $(this).siblings('ul')
									if(_ul.hasClass('show')){
											_ul.removeClass('show')
									}else{
											_ul.addClass('show')
									}
									$(document).one('click',function(){
											_ul.removeClass('show');
									})
									e.stopPropagation();
							})
							// 服务器目录ul
							$('.dk_volumes li').click(function(){
									$('[name=dk_server_path]').val($(this).data('key'))
							})
							// 端口类型触发
							$('[name=dk_port]').change(function(){
									$(this).val() == 1 ? $('.dk_port_setting').hide() : $('.dk_port_setting').show();
							})
							//添加端口、目录tbody
							$('.plus').click(function(){
									var _Arrinput = $(this).siblings('input'),
											_val_one = $(_Arrinput[0]).val(),
											_val_two = $(_Arrinput[1]).val(),
											THbody = $(this).siblings('.divtable').find('tbody'),
											_td = '';
									var isPort = $(this).parent().hasClass('dk_port_setting');
									if(_val_one == '')return layer.msg('请输入'+$(_Arrinput[0]).attr('placeholder'),{icon:2});
									if (isPort && !bt.check_port(_val_one)) return layer.msg('容器端口格式错误，可用范围：1-65535, <br />请避免使用以下端口【22,80,443,8080,8443,8888】', { icon: 2 });
									if(_val_two == '')return layer.msg('请输入'+$(_Arrinput[1]).attr('placeholder'),{icon:2});
									if (isPort && !bt.check_port(_val_two)) return layer.msg('服务器端口格式错误，可用范围：1-65535, <br />请避免使用以下端口【22,80,443,8080,8443,8888】', { icon: 2 });
									switch($(this).data('type')){
											case 'port':
													_td = '<tr>'
															+'<td>'+_val_one+'</td>'
															+'<td>'+_val_two+'</td>'
															+'<td><a class="btlink pull-right del-change-td">删除</a></td>'
															+'</tr>'
													break;
											case 'path':
													var pess_type = $('[name=volumes_type]').val();
													_td = '<tr>'
															+'<td><span class="size_ellipsis" style="width:150px" title="'+_val_one+'">'+_val_one+'</span></td>'
															+'<td>'+pess_type+'</span></td>'
															+'<td><span class="size_ellipsis" style="width:150px" title="'+_val_two+'">'+_val_two+'</span></td>'
															+'<td><a class="btlink pull-right del-change-td">删除</a></td>'
															+'</tr>'
													break;
									}

									$(THbody).append(_td)

									//清空输入框内容
									$(_Arrinput[0]).val('')
									$(_Arrinput[1]).val('')
							})
							//端口、目录删除
							$('.add_container').on('click','.del-change-td',function(){
									$(this).parents('tr').remove()
							})
							//停止后自动删除容器事件
							$('.add_container .shop_container_del').click(function(){
									if($(this).find('i').hasClass('active')){
											$(this).find('i').removeClass('active').siblings('input').prop('checked',false)
									}else{
											$(this).find('i').addClass('active').siblings('input').prop('checked',true)
									}
							})


							// <-----------------容器编排------------------->
							var modelList = []
							render_model_list()
							add_pro = bt_tools.form({
									el:'#add_project_form',
									form: [{
											label: 'Compose模板',
											group:[{
													type: 'select',
													name:'template_id',
													width:'380px',
													list:modelList
											},{
													type:'link',
													'class': 'mr5',
													title:'创建',
													event:function(){
															that.add_model_view(function(resolve){
																	if(resolve){
																			that.ajax_task_method('template_list',{tips:'获取模板',model_name:{dk_model_name:'compose'}},function(model_list){
																					that.dk_template = model_list['msg']['template']
																					render_model_list()
																					add_pro['config']['form'][0]['group'][0]['list'] = modelList;  //模板列表
																					add_pro.$local_refresh("template_id", add_pro['config']['form'][0]['group'][0])  //刷新局部数据

																			})
																	}
															})
													}
											}]
									},{
											label: '名称',
											group: {
													type: 'text',
													name: 'project_name',
													width: '380px',
													placeholder: '请输入Compose'
											}
									},{
											label: '备注',
											group: {
													type: 'textarea',
													name: 'remark',
													style: {
															'width': '380px',
															'min-width': '380px',
															'min-height': '130px',
															'line-height': '22px',
															'padding-top': '5px',
															'resize': 'both'
													},
                            placeholder: '备注'
											}
									}]
							})
							function render_model_list(){
									if(that.dk_template.length > 0){
											$.each(that.dk_template,function(index,item){
													modelList.push({title:item.name,value:item.id})
											})
									}else{
											modelList = [{value:'dk_project_false',title:'请选择Compose模板'}]
									}
							}
					},yes:function(indexs){
							//创建容器
							if($('.add_container .tab-nav span.on').index() == 0){
									var _name = $('[name=dk_container_name]').val(),
											_image = $('[name=dk_image]').val(),
											_port = $('[name=dk_port]').val(),
											_start_cmd = $('[name=dk_start_cmd]').val(),
											auto_remove = $('.form-checkbox').siblings('input').prop('checked')?1:0,
											_cpus = $('[name=dk_cpu_num]').val(),
											_size = $('[name=dk_cpu_size]').val(),
											_unit = $('[name=dk_cpu_unit]').val(),
											_tag = $('[name=dk_tag]').val(),
											_config = $('[name=dk_config]').val(),
											_reset = $('[name=dk_reset]').val();

									//验证
									if(_name == '') return layer.msg('容器名不能为空',{icon:2})
									if(_image == '') return layer.msg('请选择镜像',{icon:2})
									if(_cpus != '' && _cpus < 0)return layer.msg('CPU不能小于0',{icon:2})
									if(_size != '' && _size < 0)return layer.msg('内存不能小于0',{icon:2})

									var _form = {
											name: _name,
											image:_image,
											publish_all_ports:_port,
											command:_start_cmd,
											auto_remove:auto_remove,
											environment:_config,
											cpuset_cpus:_cpus,
											mem_limit:_size+_unit,
											labels:_tag,
											restart_policy:{Name:_reset,MaximumRetryCount:5}
									}
									var port_array = {},path_array = {}
									//端口
									if($('.dk_port_table tbody tr').length > 0){
											$.each($('.dk_port_table tbody tr'),function(index,item){
													port_array[$(item).find('td').eq(0).text()+'/tcp'] = $(item).find('td').eq(1).text()
											})
											_form['ports'] = port_array
									}
									//路径
									if($('.dk_path_table tbody tr').length > 0){
											$.each($('.dk_path_table tbody tr'),function(index,item){
													path_array[$(item).find('td').eq(0).text()] = {bind:$(item).find('td').eq(2).text(),mode:$(item).find('td').eq(1).text()}
											})
											_form['volumes'] = path_array
									}
									//接口参数
									that.ajax_task_method('run',{data:$.extend(_form,that.global),tips:'添加容器'},function(res){
											if(res.status){
													layer.close(indexs);
													that.initTabConfig('container')  //刷新列表
											}
											bt_tools.msg(res)
									})
							}else{
									var formValue = add_pro.$get_form_value()
									if (formValue.template_id === 'dk_project_false') return bt_tools.msg('请先创建Compose模板!', 2)
									if(formValue.project_name == '')return layer.msg('请输入名称',{icon:2})

									that.get_log_situation()
									that.ajax_task_method('create',{data:formValue,tips:false,model_name:{dk_model_name:'compose'}},function(res){
											that.remove_log_clearinterval();
											if(res.status){
													layer.closeAll();
													$('#cutMode .tabs-item').eq(2).click()  //跳转到容器编排
											}
											bt_tools.msg(res)
									})
							}

					}
			})
	},
	/**
	 * @description 添加Compose
	 */
	add_project:function(){
        var that = this,add_pro = null
			bt_tools.open({
					title:'添加Compose项目',
					btn:['添加','取消'],
					area:'490px',
					content: '<div class="pd20" id="add_project_form"></div>',
					success: function () {
							var modelList = []
							render_model_list()
							add_pro = bt_tools.form({
									el:'#add_project_form',
									form: [{
											label: 'Compose模板',
											group:[{
													type: 'select',
													name:'template_id',
													width:'300px',
                            list:modelList
											},{
													type:'link',
													'class': 'mr5',
													title:'创建',
													event:function(){
															that.add_model_view(function(resolve){
																	if(resolve){
																			that.ajax_task_method('template_list',{tips:'获取模板',model_name:{dk_model_name:'compose'}},function(model_list){
																					that.dk_template = model_list['msg']['template']
																					render_model_list()
																					add_pro['config']['form'][0]['group'][0]['list'] = modelList;  //模板列表
																					add_pro.$local_refresh("template_id", add_pro['config']['form'][0]['group'][0])  //刷新局部数据

																			})
																	}
															})
													}
											}]
									},{
											label: '名称',
											group: {
													type: 'text',
													name: 'project_name',
													width: '300px',
													placeholder: '请输入Compose'
											}
									},{
											label: '备注',
											group: {
													type: 'textarea',
													name: 'remark',
													style: {
															'width': '300px',
															'min-width': '300px',
															'min-height': '130px',
															'line-height': '22px',
															'padding-top': '5px',
															'resize': 'both'
													},
                            placeholder: '备注'
											}
									}]
							})
							function render_model_list(){
									if(that.dk_template.length > 0){
											$.each(that.dk_template,function(index,item){
													modelList.push({title:item.name,value:item.id})
											})
									}else{
											modelList = [{value:'dk_project_false',title:'请选择Compose模板'}]
									}
							}
					},
					yes:function(indexs){
							var formValue = add_pro.$get_form_value()
							if (formValue.template_id === 'dk_project_false') return bt_tools.msg('请先创建Compose模板!', 2)
							if(formValue.project_name == '')return layer.msg('请输入名称',{icon:2})
							that.get_log_situation()
							that.ajax_task_method('create',{data:formValue,tips:false},function(res){
									that.remove_log_clearinterval();
									if(res.status){
											layer.closeAll();
											that.initTabConfig('compose')  //刷新列表
									}
									bt_tools.msg(res)
							})
					}
			})
	},
	/**
	 * @description 添加Compose模板
	 */
	add_model_view:function(callback){
			var that = this,loca_compose = null,search_list = []
			var model_tabl = bt_tools.tab({
					class:'pd20',
					type:0,
					active:1,
					theme: { nav: 'yaml' },
					list:[{
							title:'添加Compose模板',
							name:"addCompose",
							content: '<div class="bt-form">\
									<div class="line"><span class="tname">创建模板</span>\
											<div class="info-r">\
													<input class="bt-input-text" name="model_name" style="width:350px" placeholder="请输入模板名">\
											</div>\
									</div>\
									<div class="line"><span class="tname">备注</span>\
											<div class="info-r">\
													<input class="bt-input-text" name="model_desc" style="width:350px" placeholder="备注">\
											</div>\
									</div>\
									<div class="line"><span class="tname">内容</span>\
											<div class="info-r">\
													<div class="bt-input-text" style="width:470px;height: 350px;min-height:300px;line-height:18px;" id="dkContntBody"></div>\
											</div>\
									</div>\
							</div>',
							success:function(){
									_aceEditor = bt.aceEditor({ el: 'dkContntBody', content: '' });
							}
					},{
							title:'搜索本地模板',
							name:'searchCompose',
							content:'<div class="bt-form ptb15 loca_compose_box">\
									<div class="model_sc_top">\
											<input class="bt-input-text" style="width:480px;padding-right: 95px;" id="model_sc_path" placeholder="请输入或选择Compose所在文件夹">\
											<div class="model_sc_child"><i class="cust—checkbox form-checkbox"></i><input type="checkbox" class="hide"></div>\
											<i class="glyphicon glyphicon-folder-open ml5 mr20 cu-pointer" onclick="bt.select_path(\'model_sc_path\',\'dir\')"></i>\
											<button type="button" class="btn btn-success btn-sm model_search_btn">搜索</button>\
									</div>\
									<div id="model_sc_table"></div>\
							</div>',
							success:function(){
									var one = 0;
									loca_compose = bt_tools.table({
											el:'#model_sc_table',
											data:search_list,
											height: '330px',
											column:[{
													type: 'checkbox',
													class: '',
													width: 20
											},{
													width:180,
													title: 'Compose模板名',
													template:function(row){
															return '<span class="size_ellipsis" style="width:164px" title="'+row.project_name+'">'+row.project_name+'</span>'
													}
											},{
													width:180,
													title: '路径',
													template:function(row){
															return '<span class="size_ellipsis" style="width:164px" title="'+row.conf_file+'">'+row.conf_file+'</span>'
													}
											},{
													fid: 'remark',
													title: '备注',
													type: 'input',
													blur: function (row, index, ev, key, thatc) {
															row.remark = ev.target.value
													},
													keyup: function (row, index, ev) {
															if (ev.keyCode === 13) {
																	$(this).blur();
															}
													}
											}],
											success:function(){
													if(one == 0){
															one++
															$('#model_sc_table').on('click', '.cust—checkbox', function (e) {
																	var len = loca_compose.checkbox_list
																	$('.lc_select').html(len.length+'个')
															})
															$('.loca_compose_box').append('<ul class="help-info-text red"><li>选中需要添加的Compose 【已选中：<span class="lc_select">0个</span>】</li></ul>')
													}
											}
									})
									//停止后自动删除容器事件
									$('.model_sc_child').click(function(){
											if($(this).find('i').hasClass('active')){
													$(this).find('i').removeClass('active').siblings('input').prop('checked',false)
											}else{
													$(this).find('i').addClass('active').siblings('input').prop('checked',true)
											}
									})
									//模板搜索按钮
									$('.model_search_btn').click(function(){
											var _val = $('#model_sc_path').val(),
													_child = $('.form-checkbox').siblings('input').prop('checked')?1:0
											if(_val == '')return bt_tools.msg('请输入或选择所在文件夹路径',2)
											that.ajax_task_method('get_compose_project',{data:{path:_val,sub_dir:_child},tips:'获取Compose',model_name:{dk_model_name:'compose'}},function(mlist){
													if(mlist.status == false)return bt_tools.msg(mlist.msg,2)
													if(mlist.length == 0)return bt_tools.msg('没有搜索到Compose文件,请检查路径',0)
													loca_compose.$reader_content(mlist)
											})
									})
							}
					}]
			})

			bt_tools.open({
					title:'添加Yaml模板',
					btn:['添加','取消'],
					skin:'model_sc_view',
					content:model_tabl.$reader_content(),
					success:function(){
							model_tabl.$init();
					},
					yes:function(layers){
							if(model_tabl.active == 0){
									var _mName = $('[name=model_name]').val(),
											_mDesc = $('[name=model_desc]').val(),
											_Con = _aceEditor.ACE.getValue();

									if(_mName == '') return layer.msg('模板名不能为空',{icon:2})
									if(_Con == '') return layer.msg('模板内容不能为空',{icon:2})

									var _param = {name:_mName,remark:_mDesc,data:_Con}
									that.ajax_task_method('add_template',{data:_param,tips:'添加模板',model_name:{dk_model_name:'compose'}},function(res){
											if(res.status){
													layer.close(layers)
													if(callback){
															callback(res.status)
													}else{
															that.initTabConfig('model')  //刷新列表
													}
											}
											var entry = { "'": "&apos;", '"': '&quot;', '<': '&lt;', '>': '&gt;' };
											res.msg = res.msg.replace(/(['")-><&\\\/\.])/g, function ($0) { return entry[$0] || $0; });
											bt_tools.msg(res);
									})
							}else{
									var check_len = loca_compose.checkbox_list.length,
											array = []
									$.each(loca_compose.data,function(index,item){
											if($.inArray(index,loca_compose.checkbox_list) != -1){
													array.push(item);
											}
									})
									if(check_len == 0) return layer.msg('请选择Compose文件',{icon:2})

									layer.confirm('是否将选中的'+check_len+'个Compose添加到模板中，是否继续？',{ title:'添加模板',icon: 3, closeBtn: 2 }, function () {
											that.ajax_task_method('add_template_in_path',{data:{template_list:array},tips:'添加模板',model_name:{dk_model_name:'compose'}},function(res){
													if(res.status){
															layer.close(layers)
															if(callback){
																	callback(res.status)
															}else{
																	that.initTabConfig('model')  //刷新列表
															}
													}
													bt_tools.msg(res)
											})
									});
							}
					}
			})
	},
	/**
	 * @description 模板添加、编辑界面
	 * @param {Object} edit 编辑数据
	 * @param callback 成功后回调
	 */
	edit_model_view:function(edit){
			var that = this,_aceEditor = null;
			layer.open({
					type: 1,
					title:'编辑模板',
					btn:['保存','取消'],
					area:'630px',
					shadeClose: false,
					closeBtn: 2,
					content: '<div class="pd20 bt-form">\
							<div class="line"><span class="tname">模板名</span>\
									<div class="info-r">\
											<input class="bt-input-text" name="model_name" style="width:350px" placeholder="请输入模板名" value="'+edit.name+'">\
									</div>\
							</div>\
							<div class="line"><span class="tname">备注</span>\
									<div class="info-r">\
											<input class="bt-input-text" name="model_desc" style="width:350px" placeholder="备注" value="'+edit.remark+'">\
									</div>\
							</div>\
							<div class="line"><span class="tname">内容</span>\
									<div class="info-r">\
											<div class="bt-input-text" style="width:470px;height: 350px;min-height:300px;line-height:18px;" id="dkContntBody"></div>\
									</div>\
							</div>\
					</div>',
					success:function(){
							_aceEditor = bt.aceEditor({ el: 'dkContntBody', content: edit.content });
					},
					yes:function(layers){
							var _mName = $('[name=model_name]').val(),
									_mDesc = $('[name=model_desc]').val(),
									_Con = _aceEditor.ACE.getValue();

							if(_mName == '') return layer.msg('请输入模板名',{icon:2})
							if(_mDesc == '') return layer.msg('请输入备注',{icon:2})
							if(_Con == '') return layer.msg('请输入模板内容',{icon:2})

							var _param = {name:_mName,remark:_mDesc,data:_Con}
							if(edit) _param['id'] = edit.id
							that.ajax_task_method('edit_template',{data:_param,tips:'保存模板',model_name:{dk_model_name:'compose'}},function(res){
									if(res.status){
											layer.close(layers)
											that.initTabConfig('model')  //刷新列表
									}
									bt_tools.msg(res)
							})
					}
			})
	},
	/**
	 * @description 添加网络
	 */
	add_network:function(){
			var that = this,add_network = null
			bt_tools.open({
					title:'添加网络',
					btn:['添加','取消'],
					area:['500px','500px'],
					content: '<div class="ptb20" id="add_network_form"></div>',
					success: function (layers) {
							add_network = bt_tools.form({
									el:'#add_network_form',
									form: [{
											label: '网络名',
											group: {
													type: 'text',
													name: 'name',
													width: '358px',
													placeholder: '请输入网络名'
											}
									},{
											label: '设备',
											group:{
													type: 'select',
													name:'driver',
													width:'160px',
													list:[
															{title:'bridge',value:'bridge'},
															{title:'ipvlan',value:'ipvlan'},
															{title:'macvlan',value:'macvlan'},
															{title:'overlay',value:'overlay'}
													]
											}
									},{
											label: '参数',
											group: {
													type: 'textarea',
													name: 'options',
													style: {
															'width': '358px',
															'min-width': '358px',
															'min-height': '70px',
															'line-height': '22px',
															'padding-top': '5px',
															'resize': 'both'
													},
													placeholder: '参数，一行一个，例：key=value'
											}
									},{
											label:'子网',
											group:[{
													type: 'text',
													name: 'subnet',
													width: '160px',
													placeholder: '例：124.42.0.0/16'
											},{
													label:'网关',
													type: 'text',
													name: 'gateway',
													width: '160px',
													placeholder: '例：124.42.0.254'
											}]
									},{
											label: 'IP范围',
											group: {
													type: 'text',
													name: 'iprange',
													width: '358px',
													placeholder: '例：124.42.0.0/24'
											}
									},{
											label: '标签',
											group: {
													type: 'textarea',
													name: 'labels',
													style: {
															'width': '358px',
															'min-width': '358px',
															'min-height': '70px',
															'line-height': '22px',
															'padding-top': '5px',
															'resize': 'both'
													},
													placeholder: '网络标签，一行一个，例：key=value'
											}
									}]
							})
					},
					yes:function(layers){
							var formValue = add_network.$get_form_value()
							if(formValue.name == '')return layer.msg('网络名不能为空',{icon:2})
							if(formValue.subnet == '')return layer.msg('子网不能为空',{icon:2})
							if(formValue.gateway == '')return layer.msg('网关不能为空',{icon:2})
							if(formValue.iprange == '')return layer.msg('IP地址范围不能为空',{icon:2})

							that.ajax_task_method('add',{data:formValue,tips:'添加网络'},function(res){
									if(res.status){
											layer.close(layers)
											that.initTabConfig('network')  //刷新列表
									}
									bt_tools.msg(res)
							})
					}
			})
	},
	/**
	 * @description 添加存储卷
	 */
	add_volume:function(){
			var that = this,add_volume = null
			bt_tools.open({
					title:'添加存储卷',
					btn:['添加','取消'],
					area:['500px','410px'],
					content: '<div class="ptb20" id="add_volume_form"></div>',
					success: function (layers) {
							add_volume = bt_tools.form({
									el:'#add_volume_form',
									form: [{
											label: '卷名',
											group: {
													type: 'text',
													name: 'name',
													width: '358px',
													placeholder: '请输入卷名'
											}
									},{
											label: '设备',
											group:{
													type: 'select',
													name:'driver',
													width:'160px',
													list:[
															{title:'local',value:'local'}
													]
											}
									},{
											label: '选项',
											group: {
													type: 'textarea',
													name: 'driver_opts',
													style: {
															'width': '358px',
															'min-width': '358px',
															'min-height': '70px',
															'line-height': '22px',
															'padding-top': '5px',
															'resize': 'both'
													},
													placeholder: '选项'
											}
									},{
											label: '标签',
											group: {
													type: 'textarea',
													name: 'labels',
													style: {
															'width': '358px',
															'min-width': '358px',
															'min-height': '70px',
															'line-height': '22px',
															'padding-top': '5px',
															'resize': 'both'
													},
													placeholder: '存储卷标签，一行一个，例：key=value'
											}
									}]
							})
					},
					yes:function(indexs){
							var formValue = add_volume.$get_form_value()
							if(formValue.name == '')return layer.msg('网络名不能为空',{icon:2})

							that.ajax_task_method('add',{data:formValue,tips:'添加存储卷'},function(res){
									if(res.status){
											layer.close(indexs);
											that.initTabConfig('volume')  //刷新列表
									}
									bt_tools.msg(res)
							})
					}
			})
	},
	/**
	 * @description 仓库添加、编辑界面
	 * @param {Object} edit 编辑数据
	 */
	render_registry_view:function(edit){
			var that = this,add_registry = null,is_edit = false
			if(edit){
					edit['registry'] = edit['url']
					is_edit = true
			}
			bt_tools.open({
					title:(is_edit?'编辑':'添加')+'仓库',
					btn:[is_edit?'保存':'添加','取消'],
					area:['500px','370px'],
					content: '<div class="ptb20" id="add_registry_form"></div>',
					success: function (layers) {
							add_registry = bt_tools.form({
									el:'#add_registry_form',
									form: [{
											label: '仓库地址',
											group: {
													type: 'text',
													name: 'registry',
													width: '358px',
													placeholder: '例：ccr.ccs.tencentyun.com'
											}
									},{
											label: '仓库名',
											group: {
													type: 'text',
													name: 'name',
													width: '358px',
													placeholder: '例：testtest'
											}
									},{
											label:'用户',
											group:[{
													type: 'text',
													name: 'username',
													width: '160px',
													placeholder: '请输入仓库用户'
											},{
													label:'密码',
													type: 'text',
													name: 'password',
													width: '160px',
													placeholder: '请输入仓库密码'
											}]
									},{
											label: '命名空间',
											group: [{
													type: 'text',
													name: 'namespace',
													width: '328px',
													placeholder: '例：testname'
											},{
													type:'link',
													title: '?',
													class:'bt-ico-ask',
													event:function(){
															window.open('https://www.bt.cn/bbs/thread-80965-1-1.html')
													}
											}]
									},{
											label: '备注',
											group: {
													type: 'text',
													name: 'remark',
													width: '358px',
													placeholder: '备注'
											}
									}],
									data:edit?edit:{}
							})
					},
					yes:function(indexs){
							var formValue = add_registry.$get_form_value()
							if(formValue.registry == '')return layer.msg('仓库地址不能为空',{icon:2})
							if(formValue.name == '')return layer.msg('仓库名不能为空',{icon:2})
							if(formValue.username == '')return layer.msg('仓库用户不能为空',{icon:2})
							if(formValue.password == '')return layer.msg('仓库密码不能为空',{icon:2})
							if(formValue.namespace == '')return layer.msg('命名空间不能为空',{icon:2})

							if(edit) formValue['id'] = edit['id']
							that.ajax_task_method(is_edit?'edit':'add',{data:formValue,tips:(edit?'编辑':'添加')+'仓库'},function(res){
									if(res.status){
											layer.close(indexs);
											that.initTabConfig('registry')  //刷新列表
									}
									bt_tools.msg(res)
							})
					}
			})
	},
	/**
	 * @description 构建镜像
	 */
	construction_image:function(){
			var that = this,_aceEditor = null;
			layer.open({
					type: 1,
					title:'构建镜像',
					btn:['提交','取消'],
					area:'580px',
					content: '<div class="bt-form pd20 constr_image">\
							<div class="line"><span class="tname">Dockerfile</span>\
									<div class="info-r">\
											<select class="bt-input-text" name="dockerfile_type" style="width:100px">\
													<option value="0">路径</option>\
													<option value="1">内容</option>\
											</select>\
											<div class="df_type" style="display: inline-block;">\
													<input class="bt-input-text" name="df_path" style="width:288px" id="df_path" placeholder="请输入或选择dockerfile文件">\
													<i class="glyphicon glyphicon-folder-open ml5 cu-pointer" onclick="bt.select_path(\'df_path\',\'file\')"></i>\
											</div>\
											<div class="df_type" style="display:none">\
													<div class="bt-input-text" style="margin-top:7px; width:393px;height: 230px;min-height:200px;line-height:18px;" id="dkFileBody"></div>\
											</div>\
									</div>\
							</div>\
							<div class="line"><span class="tname">标签</span>\
									<div class="info-r">\
											<textarea placeholder="容器标签，一行一个，例：key=value" name="dk_tag" class="bt-input-text" style="width: 393px; height: 70px; resize: auto; line-height: 20px;"></textarea>\
									</div>\
							</div>\
					</div>',
					success:function(){
							_aceEditor = bt.aceEditor({ el: 'dkFileBody', content:'' });
							$('[name=dockerfile_type]').change(function(){
									switch($(this).val()){
											case '0':
													$('.constr_image .df_type:eq(0)').show();
													$('.constr_image .df_type:eq(1)').hide();
													$('[name=df_path]').val('');
													break;
											case '1':
													$('.constr_image .df_type:eq(1)').show();
													$('.constr_image .df_type:eq(0)').hide();
													_aceEditor.ACE.setValue('')
													break;
									}
							})
					},
					yes:function(layers){
							var _mType = $('[name=dockerfile_type]').val(),
									_mDesc = $('[name=dk_tag]').val(),
									_Con = _aceEditor.ACE.getValue(),
									param = {tag:_mDesc}
							if(_mType == '0'){
									param['path'] = $('[name=df_path]').val()
							}else{
									param['data'] = _Con
							}
							that.get_log_situation()
							that.ajax_task_method('build',{data:param,tips:false},function(res){
									that.remove_log_clearinterval();
									if(res.status){
											layer.closeAll()
											that.initTabConfig('model')  //刷新列表
									}
									bt_tools.msg(res)
							})
					}
			})
	},
	/**
	 * @description 容器监控【获取并整理实时数据，刷新图表】
	 * @param {Object} row 容器信息
	 */
	transform_cont_chart_data:function(row){
			var that = this,_time = new Date().getTime();
			this.ajax_task_method('stats',{data:{ id: row.id, dk_status: row.status },tips:false,model_name:{dk_model_name:'status'}},function(res){
					var _data = res.msg;
					if(!res.status){
							that.remove_cont_chart_data();
							bt_tools.msg(res);
							return false
					}
					//基础信息
					$('.cont_chart_basis').eq(0).find('span').html(bt.format_size(_data.limit))
					$('.cont_chart_basis').eq(1).find('span').html('上行:'+bt.format_size(_data.tx_total)+' - '+'下行:'+bt.format_size(_data.rx_total))
					that.cont_chart.time_list.push(_time)
					that.cont_chart.mem_list['usage'].push([_time, bt.format_size(_data.usage,false,null,'MB')])
					that.cont_chart.mem_list['cache'].push([_time,bt.format_size(_data.cache,false,null,'MB')])
					that.cont_chart.cpu_list.push([_time,_data.cpu_usage])
					that.cont_chart.disk_list['read'].push([_time, bt.format_size(_data.read_total,false,null,'MB')])
					that.cont_chart.disk_list['write'].push([_time, bt.format_size(_data.write_total,false,null,'MB')])
					that.cont_chart.network_list['tx'].push([_time, bt.format_size(_data.tx,false,null,'KB')])
					that.cont_chart.network_list['rx'].push([_time, bt.format_size(_data.rx,false,null,'KB')])
					// console.log(that.cont_chart_id.cpu.getOption());
					//实时更新图表数据
					that.cont_chart_id.cpu && that.cont_chart_id.cpu.setOption({
							series:[
									{
											name: 'CPU',
											data: that.cont_chart.cpu_list
									}
							],
							xAxis:that.cont_chart.time_list
					})
					that.cont_chart_id.mem && that.cont_chart_id.mem.setOption({
							series: [
									{
											name: '内存',
											data: that.cont_chart.mem_list['usage']
									},
									{
											name: '缓存',
											data: that.cont_chart.mem_list['cache']
									}
							]
					})
					that.cont_chart_id.disk && that.cont_chart_id.disk.setOption({
							series: [
									{
											name: '读取',
											data: that.cont_chart.disk_list['read']
									},
									{
											name: '写入',
											data: that.cont_chart.disk_list['write']
									}
							]
					})
					that.cont_chart_id.network && that.cont_chart_id.network.setOption({
							series: [
									{
											name: '上行',
											data: that.cont_chart.network_list['tx']
									},
									{
											name: '下行',
											data: that.cont_chart.network_list['rx']
									}
							]
					})
			})
	},
	/**
	 * @description 容器监控【图表配置处理】
	 * @param {String} type 图表类型【CPU/内存/磁盘/网络】
	 * @return 返回处理好的图表配置
	 */
	transform_cont_chart_option:function(type){
			var _unit = '/MB'
			var _option = this.get_default_option();
			switch(type){
					case 'cpu':
							_option.tooltip.formatter = function (config) {
									var data = config[0];
									return bt.format_data(data.data[0]) + '<br>' + data.seriesName + ': ' + data.data[1] + '%';
							};
							_option.yAxis.min = 0;
							_option.series = [
									{
											name: 'CPU',
											type: 'line',
											symbol: 'none',
											smooth: true,
											itemStyle: {
													normal: {
															color: 'rgb(0, 153, 238)'
													}
											}
									}
							]
							break;
					case 'network':
							_unit = '/KB'
					case 'mem':
					case 'disk':
							var third = {
									mem:['内存', '缓存'],
									disk:['读取','写入'],
									network:['上行','下行'],
									color:[
											{
													mem:['rgb(185, 220, 253)','rgb(185, 220, 253,0.6)','rgb(185, 220, 253,0.3)','rgba(229,147,187)','rgba(229,147,187,0.6)','rgba(229,147,187,0.3)'],
													disk:['rgb(255, 70, 131)','rgb(255, 70, 131,0.6)','rgb(255, 70, 131,0.3)','rgba(46, 165, 186)','rgba(46, 165, 186,0.6)','rgba(46, 165, 186,0.3)'],
													network:['rgb(255, 140, 0)','rgb(255, 140, 0,0.6)','rgb(255, 140, 0,0.3)','rgb(30, 144, 255)','rgb(30, 144, 255,0.6)','rgb(30, 144, 255,0.3)']
											}
									]
							}
							_option.tooltip.formatter = function (config) {
									var data = config[0];
									var time = data.data[0];
									var date = bt.format_data(time / 1000);
									var _tips = '';
									var _style = '<span style="display: inline-block; width: 10px; height: 10px; margin-rigth:10px; border-radius: 50%; background: ';
									for (var i = 0; i < config.length; i++) {
											_tips +=  _style + config[i].color + ';"></span>  ' + config[i].seriesName + '：'
											_tips += config[i].data[1] + _unit + (config.length - 1 !== i ? '<br />' : '');
									}
									return "时间：" + date + "<br />" + _tips;
							};
							_option.legend = {
									top: '18px',
									data: third[type]
							};
							_option.series = [
									{
											name: third[type][0],
											type: 'line',
											symbol: 'none',
											itemStyle: {
													normal: {
															color: third['color'][0][type][0],
															areaStyle: {
																	color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
																			offset: 0,
																			color: third['color'][0][type][1]
																	}, {
																			offset: 1,
																			color: third['color'][0][type][2]
																	}])
															}
													}
											}
									},
									{
											name: third[type][1],
											type: 'line',
											symbol: 'none',
											itemStyle: {
													normal: {
															color: third['color'][0][type][4],
															areaStyle: {
																	color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
																			offset: 0,
																			color: third['color'][0][type][4]
																	}, {
																			offset: 1,
																			color: third['color'][0][type][5]
																	}])
															}
													}
											}
									}
							];
							break;
			}
			return _option
	},
	/**
	 * @description 渲染容器监控图表
	 * @param {Object} row 容器信息
	 */
	render_cont_chart:function(row){
			var that = this;
			this.cont_chart_id.cpu = echarts.init(document.getElementById('cont_cpu'))
			this.cont_chart_id.mem = echarts.init(document.getElementById('cont_mem'))
			this.cont_chart_id.disk = echarts.init(document.getElementById('cont_disk'))
			this.cont_chart_id.network = echarts.init(document.getElementById('cont_network'))

			$.each(['cpu','mem','disk','network'],function(index,item){
					that.cont_chart_id[item].setOption(that.transform_cont_chart_option(item))
			})
			this.transform_cont_chart_data(row) //默认加载数据
	},
	/**
	 * @description 获取默认图表配置
	 * @return 返回默认图表配置
	 */
	get_default_option:function(){
			return {
					tooltip: {
							trigger: 'axis',
							axisPointer: {
									type: 'cross'
							}
					},
					grid: {
							x: 50, //左
							y: 50, //上
							x2: 30,//右
							y2: 30 //下
					},
					xAxis: {
							type: 'time',
							scale:true,
							splitNumber:4,
							boundaryGap: true,
							axisLine: {
									lineStyle: {
											color: "#666"
									}
							},
							axisLabel: {
									// interval:0,
									formatter: function (value) {
											return bt.format_data(value / 1000, 'hh:mm:ss');
									}
							},
					},
					yAxis: {
							type: 'value',
							boundaryGap: [0, '100%'],
							splitLine: {
									lineStyle: {
											color: "#ddd"
									}
							},
							axisLine: {
									lineStyle: {
											color: "#666"
									}
							}
					}
			}
	},
	/**
	 * @description 容器详情配置
	 * @param {Object} row 容器信息
	 */
	open_container_config:function(obj){
			var that = this;
			layer.open({
					type:1,
					title:'容器['+obj.name+']',
					area:['780px','720px'],
					shadeClose: false,
					closeBtn: 2,
					btn:false,
					content:'<div class="bt-tabs">\
							<div class="bt-w-menu cn_menu pull-left" style="height:100%">\
									<p class="bgw" data-type="config">容器配置</p>\
									<p data-type="create_image">生成镜像</p>\
							</div>\
							<div id="container_box" class="bt-w-con pd15"></div>\
					</div>',
					success:function(){
							that.set_cont_config(obj);
							// 菜单事件
							$('.cn_menu p').click(function () {
									$('#container_box').html('').removeAttr('style');
									$(this).addClass('bgw').siblings().removeClass('bgw');
									that['set_cont_'+$(this).data('type')](obj);
							})
					}
			})
	},
	/**
	 * @description 容器终端
	 * @param {Object} row 容器信息
	 */
	open_container_shell_view:function(row){
			var that = this;
			web_shell();
			var shell = setInterval(function(){
					if($('.term-box').length == 0){
							pdata_socket['data'] = 'exit\n'
							socket.emit('webssh',pdata_socket);
							setTimeout(function(){socket.emit('webssh',pdata_socket['data']);},1000);
							clearInterval(shell);
					}
			},500);
			setTimeout(function(){
					that.ajax_task_method('docker_shell',{data:{container_id:row.id},tips:'执行容器命令',model_name:{dk_model_name:'container'}},function(res){
							if(res.status){
									pdata_socket['data'] = 'clear && ' + res.msg +'\n'
									socket.emit('webssh',pdata_socket);
									setTimeout(function(){socket.emit('webssh',pdata_socket['data']);},1000);
							}else{
									bt_tools.msg(res)
							}
					})
			});
	},
	/**
	 * @description 容器配置
	 * @param {Object} row 容器信息
	 */
	set_cont_config:function(row){
			$('#container_box').css({'padding-right':'25px','overflow':'overlay'});
			var wrapper = document.getElementById("container_box")
			jsonTree.create(row.detail,wrapper)
	},
	/**
	 * @description 容器生成镜像 【可导出文件】
	 * @param {Object} row 容器信息
	 */
	set_cont_create_image:function(row){
			var that = this;
			bt_tools.form({
					el:'#container_box',
					form:[{
							label:'镜像名',
							group:{
									name:'repository',
									type: 'text',
									placeholder: '请输入镜像名',
									width:'350px'
							}
					},{
							label:'标签',
							group:{
									name:'tag',
									type: 'text',
									placeholder: '请输入标签',
									width:'350px'
							}
					},{
							label:'提交描述',
							group:{
									name:'message',
									type: 'text',
									placeholder: '提交前描述',
									width:'350px'
							}
					},{
							label:'作者',
							group:{
									name:'author',
									type: 'text',
									placeholder: '请输入作者',
									width:'350px'
							}
					},{
							label: '',
							group: [{
									type: 'button',
									size: '',
									name: 'cont_caimage_btn',
									title: '生成镜像',
									event: function (formData) {
											if(
													formData.repository == '' ||
													formData.tag == ''        ||
													formData.message == ''    ||
													formData.author == ''
											){
													return layer.msg('请先填写生成镜像信息',{icon:2})
											}
											formData['id'] = row.id
											submitImage(formData)
									}
							},{
									type: 'button',
									size: '',
									name: 'cont_caimage_export_btn',
									style: { 'margin-left': '6px' },
									title: '生成镜像后导出压缩包',
									event: function (formData) {
											if(
													formData.repository == '' ||
													formData.tag == ''        ||
													formData.message == ''    ||
													formData.author == ''
											){
													return layer.msg('请先填写生成镜像信息',{icon:2})
											}
											bt_tools.open({
													type: 1,
													title: '导出【'+row.name+'】镜像',
													area: '430px',
													btn: ['导出', '关闭'],
													content: {
															'class': "pd20",
															form: [{
																	label: "路径",
																	group: {
																			name: "path",
																			type: "text",
																			value: '',
																			width: "240px",
																			placeholder:'请输入镜像路径',
																			icon: {
																					type: 'glyphicon-folder-open',
																					event:function(){}
																			}
																	}
															},{
																	label: "文件名",
																	group: {
																			name: "name",
																			type: "text",
																			value: formData.repository,
																			width: "240px",
																			disabled:true,
																			placeholder:'请输入导出的文件名',
																			unit:'.tar'
																	}
															}]
													},
													yes: function (formD,indexs) {
															if (formD.path === '') return bt_tools.msg('路径不能为空!', 2)
															if (formD.name === '') return bt_tools.msg('导出文件名不能为空!', 2)

															formData['id'] = row.id
															formData['path'] = formD.path
															formData['name'] = formD.name
															submitImage(formData,indexs)
													}
											})
									}
							}]
					}]
			})
			// 生成镜像   --导出文件
			function submitImage(form,closeView){
					that.ajax_task_method('commit',{data:form,tips:'生成镜像'},function(res){
							if(res.status){
									if(closeView) layer.close(closeView)
							}
							bt_tools.msg(res)
					})
			}
	},
	/**
	 * @description 容器状态设置
	 * @param {String} type 设置状态
	 * @param {String} id 容器id
	 * @param {Object} table 需要重新渲染的表格
	 */
	container_status_setting:function(type,id,table,is_compose){
			var config = {id:id},
					tips = {start:'启动',stop:'停止',pause:'暂停',unpause:'取消暂停',restart:'重启',reload:'重载'},
					param = {tips:tips[type]+'容器'}
			if(is_compose){
					param['model_name'] = {dk_model_name:'container'}
			}
			param['data'] = config;

			this.ajax_task_method(type,param,function(res){
					if(res.status){
							table.$refresh_table_list(true)  //刷新列表
					}
					layer.msg(res.msg,{icon:res.status?1:2})
			})
	},
	/**
	 * @description 获取日志窗口状态
	 */
	get_log_situation:function(isFast){
			var that = this;
			that.log_layer_open = layer.open({
					title: '正在执行中，请稍候...',
					type: 1,
					closeBtn: false,
					maxmin: true,
					skin: 'dockertmp',
					area: ["730px", '450px'],
					content:"<pre style='width:100%;margin-bottom: 0px;height:100%;border-radius:0px; text-align: left;background-color: #000;color: #fff;white-space: pre-wrap;' id='dockertmp_pre'></pre>",
					success:function(){
							that.log_file_setInterval = setInterval(function(){isFast?that.get_fast_project_log() : that.get_log_speed()},1500)
					}
			})
	},
	/**
	 * @description 获取日志进度
	 */
	get_log_speed:function(){
			this.ajax_task_method('get_logs',{data:{logs_file:'/tmp/dockertmp.log'},tips:false,model_name:{dk_model_name:"image"}},function(ires){
					$("#dockertmp_pre").text(ires.msg);
					$('#dockertmp_pre').animate({
							scrollTop: $('#dockertmp_pre').prop("scrollHeight")
					}, 400);
			})
	},
	/**
	 * @description 快速获取日志
	 */
	get_fast_project_log:function(){
			this.ajax_task_method('get_logs',{tips:false,model_name:{dk_model_name:"project"}},function(ires){
					$("#dockertmp_pre").text(ires.msg);
					$('#dockertmp_pre').animate({
							scrollTop: $('#dockertmp_pre').prop("scrollHeight")
					}, 400);
			})
	},
	/**
	 * @description 删除容器监控数据和图表dom
	 */
	remove_cont_chart_data:function(){
			clearInterval(this.cont_setInterval)
			this.cont_chart = {
					cpu_list:[],
					mem_list:{
							usage:[],
							cache:[]
					},
					disk_list:{
							read:[],
							write:[]
					},
					network_list:{
							tx:[],
							rx:[]
					},
					time_list:[]
			}
			this.cont_chart_id = {
					cpu:null,
					mem:null,
					disk:null,
					network:null
			}
	},
	//删除日志定时器
	remove_log_clearinterval:function(){
			layer.close(layer.index)   //最新的弹层
			clearInterval(this.log_file_setInterval)
	},
	/**
	 * @description 停止用户操作
	 * @param {Boolean} is_install 是否docker安装
	 * @param {Boolean} is_service 是否启动docker
	 */
	stop_user_operation:function(is_install,is_service){
			var that = this;
			var tips = '当前未启动docker服务,请在<a class="btlink link_setting">【docker设置】</a>中开启';
			if(!is_install) tips = '当前未安装docker或docker-compose,<a class="btlink install_docker">点击安装</a>'
			$('.mask_layer').removeAttr('style');
			$('.prompt_description').html(tips)
			//跳转到设置页
			$('.link_setting').click(function(){ $('#cutMode .tabs-item[data-type=setup]').trigger('click') })
			//安装docker
			$('.install_docker').click(function(){
					that.ajax_task_method('install_docker_program',{model_name:{dk_model_name:'setup'}},function(res){
							bt_tools.msg(res)
							messagebox()
					})
			})
	},
	/**
	 * @description docker请求方式转换
	 * @param {String} action 请求方法
	 * @param {Object} param data填写请求所需参数，tips填写请求时展示文字
	 * @param {any} callback 数据回调
	 */
	ajax_task_method:function(action,param,callback){
			var _config = $.extend({},param['data'] || {},this.global,{dk_def_name:action},param['model_name'] || {})
			bt_tools.send({
					url:this.global_api+'?action='+_config.dk_model_name+'-'+_config.dk_def_name+'',
					data:{data:JSON.stringify(_config)}
			},function(res){
					if(callback)callback(res)
			},{load:param['tips'],verify: false})
	},
	/**
	 * @description docker批量操作参数处理
	 * @param {String} action 请求方法
	 * @param {Object} param 请求所需参数
	 * @return 返回JSON格式参数
	 */
	batch_param_convert:function(action,param){
			return JSON.stringify($.extend({},this.global,{dk_def_name:action},param || {}))
	},
	/**
	 * @description UTC时间转换
	 * @param {Object} utc_datetime utc时间
	 * @return 返回处理后的时间
	 */
	utc2beijing:function(utc_datetime) {
			if (utc_datetime === null || typeof utc_datetime === 'undefined') {
				return '格式错误'
			}
			// 转为正常的时间格式 年-月-日 时:分:秒
			var T_pos = utc_datetime.indexOf('T');
			var Z_pos = utc_datetime.indexOf('Z');
			var year_month_day = utc_datetime.substr(0,T_pos);
			var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
			var new_datetime = year_month_day+" "+hour_minute_second;

			// 处理成为时间戳
			timestamp = new Date(Date.parse(new_datetime));
			timestamp = timestamp.getTime();
			timestamp = timestamp/1000;

			// 增加8个小时，北京时间比utc时间多八个时区
			var timestamp = timestamp+8*60*60;
			return bt.format_data(timestamp)
	},
	initTabConfig:function(type){
			this.tabName = type;
			this.global.dk_model_name = type
			if(type == 'model') this.global.dk_model_name = 'compose'
			$('.mask_layer').hide();          //隐藏未安装或未启动提醒
			$('#dk_'+type+'_table').empty();  //清除Table
			this['get_'+type]();
	}
}
//默认触发
$('#cutMode .tabs-item[data-type="' + (bt.get_cookie('docker_model') || 'fast_project') + '"]').trigger('click');
