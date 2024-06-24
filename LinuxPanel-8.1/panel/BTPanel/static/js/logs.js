var logs = {
	event: function() {
	  var that = this, name = bt.get_cookie('logs_type');
	  that.get_logs_info();
	  // 切换主菜单
	  $('#cutTab').unbind().on('click', '.tabs-item', function () {
			var index = $(this).index(), name = $(this).data('name')
			if(name == 'siteLogs'){
				$('#siteMenu').show()
				$('.siteSelected').find('.search-icon').remove()
			}else{
				$('#siteMenu').hide()
			}
			var parent = $(this).parent().parent().nextAll('.tab-view-box').children('.tab-con').eq(index)
			$(this).addClass('active').siblings().removeClass('active');
			parent.addClass('show w-full').removeClass('hide').siblings().removeClass('show w-full').addClass('hide');
			that[name].event();
			bt.set_cookie('logs_type',name)
	  })
	  $('[data-name="'+ (name || 'panelLogs') +'"]').trigger('click')
		var arr =[]
		$('.bt-checkbox').click(function (){
			$(this).toggleClass('active')
			if($(this).hasClass('active')){
				arr.push($(this).attr('data-name'))
			}else {
				arr.splice(arr.indexOf($(this).attr('data-name')),1)
			}
			logs.chooseStr=''

			for(var i=0;i<arr.length;i++){
				logs.chooseStr+=arr[i]+','
				if(i==arr.length-1){
					logs.chooseStr=logs.chooseStr.substring(0,logs.chooseStr.length-1)
				}
			}
			if (arr.length==0){
				logs.softwareLogs.getMysqlErrorLogsRequest('all')
				return
			}
			logs.softwareLogs.getMysqlErrorLogsRequest(logs.chooseStr)
		})
	},
	get_logs_info: function () {
		bt_tools.send({url: '/logs/panel/get_logs_info'}, function (rdata) {

		})
	},
    // 面板日志
	panelLogs:{
		crontabId: '',
		crontabName: '',
        /**
		 * @description 事件绑定
		 */
		event:function (){
			var that = this;
			$('.state-content').hide()
			$('.Catalogue_show').click(function () {
				$(this).addClass('btn-success').removeClass('btn-default').siblings().removeClass('btn-success').addClass('btn-default');
			});
			$('#panelLogs').unbind('click').on('click','.tab-nav-border span',function(){
			  var index = $(this).index();
			  $(this).addClass('on').siblings().removeClass('on');
			  $(this).parent().next().find('.tab-block').eq(index).addClass('on').siblings().removeClass('on');
			  that.cutLogsTab(index)
			})
			$(window).unbind('resize').resize(function (){
				that.heightResize()
			})
			$('#panelLogs .tab-nav-border span').eq(0).trigger('click');
			$('.refresh_log').unbind('click').on('click',function (){
				that.getLogs(1)
			})
			$('.close_log').unbind('click').on('click',function (){
				that.delLogs()
			})
			$('#panelCrontab .Tab').on('click','.Item',function(){
				var id = $(this).data('id');
				var type = $(this).data('type');
				$('#Catalogue_show_left').addClass('btn-success').removeClass('btn-default').siblings().removeClass('btn-success').addClass('btn-default');
				$('#time_choose').val('');
				typeLog = 'all';
				time = [];
				if (type !== 'webshell') {
					$('.clearLogs').hide();
					$('.deriveLogs').hide();
					$('.Catalogue_show').hide();
					$('#time_choose').hide();
					$('.separation').hide();
				} else {
					$('.clearLogs').show();
					$('.deriveLogs').show();
					$('.Catalogue_show').show();
					$('#time_choose').show();
					$('.separation').show();
				}
				$(this).addClass('active').siblings().removeClass('active');
				that.crontabId = id;
				that.crontabName = $(this).prop('title');
				that.get_crontab_logs(id, typeLog, JSON.stringify(time));
			})
			//计划任务日志刷新
			$('.refreshCrontabLogs').unbind('click').click(function (){
				if (!that.crontabId) return layer.msg('暂无计划任务，不支持刷新日志', { icon: 2 });
					that.get_crontab_logs(that.crontabId, typeLog, JSON.stringify(time));
			})
			//计划任务搜索
			$('#panelLogs .search-input').keyup(function (e) {
				var value = $(this).val()
				if(e.keyCode == 13) that.crontabLogs(value)
			})
			$('#panelLogs').on('click','.glyphicon-search',function(){
				var value = $('#panelLogs .search-input').val()
				that.crontabLogs(value)
			})
			$('.clearLogs').click(function () {
				var delForm;
				bt_tools.open({
					title: '清理日志',
					area: ['420px', '220px'],
					btn: ['确定', '取消'],
					content: '<div id="clearForm"></div>',
					success: function (layero, index) {
						$(layero).find('.layui-layer-content').css('overflow', 'inherit');
						delForm = bt_tools.form({
							el: '#clearForm',
							class: 'pd20',
							form: [
								{
									group: {
										name: 'script_body',
										type: 'other',
										display: true,
										boxcontent:
											'<div style="width:346px;height:34px;line-height:50px;background-color:rgba(240, 173, 78, 0.1);color:#F0AD4E;display:flex;flex-direction:row;align-items:center;margin-left:30px"><span class="glyphicon glyphicon-alert" style="margin:0 12px"></span>注意：关闭回收站，将永久删除的文件，不滞留在回收站</div>',
									},
								},
								{
									label: '清理范围',
									group: {
										type: 'select',
										name: 'cSelect',
										width: '150px',
										value: '',
										list: [
											{ title: '所有日志', value: '' },
											{ title: '仅保留近7天日志', value: '7' },
											{ title: '仅保留近30天日志', value: '30' },
										],
									},
								},
							],
						});
					},
					yes: function (data, indexs) {
						var dLoad = layer.msg('正在清理中...', { icon: 16, time: 0, shade: [0.3, '#000'] });
						bt_tools.send({ url: '/crontab?action=clear_logs', data: { id: that.crontabId, day: delForm.$get_form_value().cSelect } }, function (ress) {
							layer.close(dLoad);
							layer.msg(ress.msg, { icon: ress.status ? 1 : 2 });
						});
						that.get_crontab_logs(that.crontabId, typeLog, JSON.stringify(time));
						layer.close(data);
					},
				});
			});
			$('.deriveLogs').click(function () {
				var typeDay = '';
				var deriveLogsForm;
				bt_tools.open({
					title: '导出日志',
					area: ['420px', '220px'],
					btn: ['确定', '取消'],
					content: '<div id="clearForm"></div>',
					success: function (layero) {
						$(layero).find('.layui-layer-content').css('overflow', 'inherit');
						deriveLogsForm = bt_tools.form({
							el: '#clearForm',
							class: 'pd20',
							form: [
								{
									label: '导出范围',
									group: {
										name: 'script_body',
										type: 'other',
										display: true,
										boxcontent:
											'<div>\
										<button class="btn btn-sm btn-success Catalogue_shows"\
													id="Catalogue_show_all">全部</button>\
												<button style="margin-left:-5px" class="btn btn-sm btn-default Catalogue_shows"\
													id="Catalogue_show_seven">近7天</button>\
										<button style="margin-left:-5px" class="btn btn-sm btn-default Catalogue_shows"\
													id="Catalogue_show_thirty">近30天</button>\
										</div>',
									},
								},
								{
									label: '',
									group: {
										type: 'checkbox',
										name: 'isError',
										title: '仅导出异常日志',
										event: function (row, el, dthat) {},
									},
								},
							],
						});
					},
					yes: function (formD, indexs) {
						var Eload = layer.msg('正在导出中...', { icon: 16, time: 0, shade: [0.3, '#000'] });
						bt_tools.send({ url: '/crontab?action=download_logs', data: { id: that.crontabId, day: typeDay, type: deriveLogsForm.$get_form_value().isError ? 'warring' : '' } }, function (ress) {
							layer.close(Eload);
							window.open('/download?filename=' + ress.msg);
							layer.msg(ress.status ? '导出成功！' : ress.msg, { icon: ress.status ? 1 : 2 });
						});
						layer.close(formD);
					},
				});
				$('.Catalogue_shows').click(function () {
					$(this).addClass('btn-success').removeClass('btn-default').siblings().removeClass('btn-success').addClass('btn-default');
				});
				$('#Catalogue_show_all').click(function () {
					typeDay = '';
				});
				$('#Catalogue_show_seven').click(function () {
					typeDay = 7;
				});
				$('#Catalogue_show_thirty').click(function () {
					typeDay = 30;
				});
			});
			$('#Catalogue_show_left').click(function () {
				that.get_crontab_logs(that.crontabId, 'all', JSON.stringify(time));
				typeLog = 'all';
			});
			$('#Catalogue_show_right').click(function () {
				typeLog = 'warring';
				that.get_crontab_logs(that.crontabId, 'warring', JSON.stringify(time));
			});
			laydate.render({
				elem: '#time_choose',
				range: true,
				value: '',
				max: bt.format_data(new Date().getTime(), 'yyyy-MM-dd'),
				done: function (value, startdate, endDate) {
					var timeA = value.split(' - ');
					timeA[0] = timeA[0] + ' 00:00:00';
					timeA[1] = timeA[1] + ' 23:59:59';
					$('#time_choose').val(value);
					$('.last-span').addClass('on').siblings().removeClass('on');
					var list = [];
					timeA.forEach(function (time) {
						list.push(Date.parse(time) / 1000);
					});
					if (isNaN(list[0])) {
						list = [];
					}
					time = list;
					that.get_crontab_logs(that.crontabId, typeLog, JSON.stringify(time));
				},
			});
		},
		heightResize: function(){
			$('#errorLog .crontab-log').height((window.innerHeight - 310) +'px')
			$('#panelCrontab .crontab-log').height((window.innerHeight - 310) +'px')
			$('#panelCrontab .Tab').css('max-height',(window.innerHeight - 290) +'px')
			$('#panelCrontab').height((window.innerHeight - 240) +'px')
		},
		/**
		 * @description 切换日志菜单
		 * @param {number} index 索引
		 */
		cutLogsTab:function(index){
			switch (index) {
				case 0:
					this.getLogs(1)
					break;
				case 1:
					this.errorLog()
					break;
				case 2:
					this.heightResize()
					$('#panelCrontab').find('.search-icon').remove()
					this.crontabLogs('',function() {
						$('#panelCrontab .Tab .Item').eq(0).trigger('click');
					})
					break;
			}
		},
		/**
		* @description 获取计划任务执行日志
		* @param {object} id 参数
		*/
		get_crontab_logs: function (id, type, time_search) {
			var that = this;
			that.getCrontabLogs({ id: id, type: type, time_search: time_search }, function (rdata) {
				var htmlCode = bt.htmlEncode.htmlEncodeByRegExp(rdata.msg);
				if (rdata.msg == '') {
					rdata.msg = '<span>当前日志为空!</span>';
				}
				$('#panelCrontab .crontab-log').html('<div>' + rdata.msg + '</div>');
				var div = $('#panelCrontab .crontab-log');
				div.height(window.innerHeight - 310 + 'px');
				div.scrollTop(div.prop('scrollHeight'));
			});
		},
		/**
		 * @description 计划任务日志
		 */
		crontabLogs: function (search, callback) {
			var _that = this;
			$('#panelCrontab .Tab').empty();
			bt_tools.send({ url: '/data?action=getData&table=crontab', data: { search: search ? search : '', p: 1, limit: 9999 } }, function (rdata) {
				$('#panelCrontab .Tab').empty();
				$.each(rdata.data, function (index, item) {
					$('#panelCrontab .Tab').append(
						$(
							'<div class="Item ' +
								(_that.crontabId && _that.crontabId === item.id ? 'active' : '') +
								'" title="' +
								bt.htmlEncode.htmlEncodeByRegExp(item.name) +
								'" data-type="' +
								item.sType +
								'" data-id="' +
								item.id +
								'">' +
								item.name +
								'</div>'
						)
					);
				});
				if (callback) callback(rdata);
			});
		},
		/**
		 * @description 获取计划任务执行日志
		 * @param {object} param 参数对象
		 * @param {function} callback 回调函数
		 */
		getCrontabLogs: function (param, callback) {
			var loadT = bt.load('正在获取执行日志，请稍后...')
			$.post('/crontab?action=GetLogs', { id: param.id, type: param.type, time_search: param.time_search }, function (res) {
				loadT.close()
				if (callback) callback(res)
			})
		},
		/**
		 * @description 错误日志
		 */
		errorLog:function (){
			var that = this;
			bt_tools.send({
				url:'/config?action=get_panel_error_logs'},{},function(res){
				log = res.msg
				if(res.data == '') log = '当前没有日志'
				$('#errorLog').html('<div>\
					<button type="button" title="刷新日志" class="btn btn-success btn-sm mr5 refreshRunLogs" ><span>刷新日志</span></button>\
					<span class="bt-desired ml10" style="background-size: 16px;background-position: left;"><a href="javascript:;" class="btlink ml5 npsFeedback">需求反馈</a></span>\
					<pre class="crontab-log"><code>'+ bt.htmlEncode.htmlEncodeByRegExp(log) +'</code></pre>\
				</div>');
				//渲染内容搜索框
				// renderRunningSearch();
				$('.refreshRunLogs').click(function () {
					that.errorLog();
				});
				// 日志nps入口
				$('.npsFeedback').on('click',function(){
					bt_tools.nps({name:'日志',type:22})
				})
				var div = $('#errorLog .crontab-log')
				div.height((window.innerHeight - 310) +'px')
				div.scrollTop(div.prop('scrollHeight'))
			},'面板错误日志')
		},
		/**
		* 取回数据
		* @param {Int} page  分页号
		*/
		getLogs:function(page,search) {
			var that = this
			search = search == undefined ? '':search;
			bt_tools.send({url:'/data?action=getData&table=logs&tojs=getLogs&limit=20&p=' + page+"&search="+search}, function(data) {
				$('#operationLog').empty()
				bt_tools.table({
					el:'#operationLog',
					data: data.data,
                    height: $(window).height() - 330+'px',
                    default: '操作列表为空', // 数据为空时的默认提示
					tootls: [
						{ // 按钮组
							type: 'group',
							positon: ['left', 'top'],
							list: [{
								title: '刷新日志',
								active: true,
								event: function (ev,_that) {
									that.getLogs(1)
								}
							}, {
								title: '清空日志',
								event: function (ev,_that) {
									that.delLogs()
								}
						},{
							title: 'IP操作统计',
							event: function (ev, _that) {
									renderIPQueryTable(ev, that);
								},
							},]
						}
					],
					column:[
						{ fid: 'username', title: "用户",width: 100 },
						{ fid: 'type', title: "操作类型",width: 100 },
						{ fid: 'log', title: "详情",template: function (row) {
							return '<span>'+ (row.log.indexOf('alert') > -1 ? $('<div></div>').text(row.log).html() : row.log) +'</span>'
						}},
						{ fid: 'addtime', title: "操作时间",width: 150}
					],
					success: function () {
						if(!$('#operationLog .search_input').length){
							$('#operationLog .tootls_top').append('<div class="pull-right">\
								<div class="bt_search">\
								<input type="text" class="search_input" style="" placeholder="搜索用户/IP/详情内容" value="'+ search +'">\
									<span class="glyphicon glyphicon-search" aria-hidden="true"></span>\
								</div>\
							</div>')
							$('#operationLog .search_input').keydown(function (e) {
								var value = $(this).val()
								if(e.keyCode == 13) that.getLogs(1,value)
							})
							$('#operationLog .glyphicon-search').click(function () {
								var value = $('#operationLog .search_input').val()
								that.getLogs(1,value)
							})
							$('#operationLog .tootls_top .pull-left').append('<span class="bt-desired ml10" style="background-size: 16px;background-position: left;"><a href="javascript:;" class="btlink ml5 npsFeedback">需求反馈</a></span>')
							// 日志nps入口
							$('.npsFeedback').on('click',function(){
								bt_tools.nps({name:'日志',type:22})
							})
						}
					}
				})
				$('.operationLog').html(data.page);
			},'获取面板操作日志')
		},
		//清理面板日志
		delLogs: function(){
			var that = this
			bt.firewall.clear_logs(function(rdata){
				layer.msg(rdata.msg,{icon:rdata.status?1:2});
				that.getLogs(1);
			})
		},
    },
    // 网站日志
	siteLogs:{
		siteName: '',
		siteList: [],
		day: '',
		type: 'access',
		time: [],
		search: '',
		timer: null,
    event: function() {
			var that = this
			this.getSiteList('',function(rdata){
				$('#siteLogs .Tab .Item').eq(0).trigger('click');
				$('.siteSelected .mt_select_list li').eq(0).trigger('click');
			})
			that.heightResize()

			$(window).unbind('resize').resize(function (){
				that.heightResize()
			})

			$('#siteLogs .Tab').unbind().on('click','.Item',function(){
				that.siteName = $(this).data('name')
				$(this).addClass('active').siblings().removeClass('active')
				var index = $('#siteLogs .tab-nav-border span.on').index()
				$('#siteLogs .tab-nav-border span').eq(index).trigger('click');
			})

			$('.logsAction button').off('click').on('click',function(){
				var type = $(this).data('value');
				that.getLogAction(type)
			})

			$('#siteLogs').unbind().on('click','.tab-nav-border span',function(){
				var index = $(this).index()
					var value = $(this).data('value');
					$('.logsAction').hide();
					if(value == 'log'){
						$('.logsAction').show();
					}
					$(this).addClass('on').siblings().removeClass('on');
					$(this).parent().next().find('.tab-block').eq(index).addClass('on').siblings().removeClass('on');
					$('.firwall_place_of_attribution').removeClass('on');
					that.cutLogsTab(index);
			})
			$('#siteMenu .siteSelected').off('click').on('click', function (e) {
				// $(this).find('.mt_select_content').focus()
				var _ul = $('#siteMenu .mt_select_list');
				if($(e.target).hasClass('no_match')){

				}else if(!$(e.target).hasClass('active')){
					$('#siteMenu .mt_select_list').show();
				} else{
					$('#siteMenu .mt_select_list').hide();
				}

				setTimeout(function(){
					$(document).one('click',function(ev){
					if(!$(ev.target).hasClass('.no_match')){
						_ul.find('.no_match').remove()
						_ul.find('li').removeAttr('style')
						$('#siteMenu .siteSelected .mt_select_content').val(_ul.find('.active').data('name'))
						_ul.hide()
					}
					// $('#siteMenu .mt_select_value .mt_select_content').val(_ul.find('li .active').data('name'))
					// _ul.hide()
				})
				},200)

			})
			$('#siteMenu .siteSelected .mt_select_content').off('focus').on('focus', function () {
				$('#siteMenu .mt_select_list').show();
				$('.mt_select_content').val('')
			})
			$('#siteMenu .mt_select_value .mt_select_content').off('input propertychange').on('input propertychange', function (e) {
				var _ul = $('#siteMenu .mt_select_list');
				_ul.show();
				var val = $(this).val(),existNum = 0;
				$.each(that.siteList,function(index,item){
					_ul.find('.no_match').remove()
					if(item.name.indexOf(val) != -1 && val != ''){
						_ul.find('li').eq(index).show()
						existNum++;
					}else{
						_ul.find('li').eq(index).hide()
						if(val == ''){
							_ul.find('li').show()
						}else if(existNum == 0){
							_ul.append('<li class="no_match">无匹配项</li>')
						}
					}
				})
			})
    },
		heightResize: function(){
			$('#siteLogs .Tab').css('max-height', window.innerHeight - 290 + 'px');
			// $('#siteLogs').height(window.innerHeight - 275 + 'px');
			$('#siteOnesite .divtable').css('max-height', $(window).height() - 350 + 'px');
			$('#siteRun .crontab-log').height(window.innerHeight - 330 + 'px');
			$('#siteError .crontab-log').height(window.innerHeight - 330 + 'px');
		},
		/**
		 * @description 获取网站列表
		*/
		getSiteList:function(search,callback){
			var that = this
			$('.siteSelected .mt_select_list').empty();
			bt_tools.send('/data?action=getData&table=sites',{limit: 999999,p:1,search: search ? search : '',type: -1},function(rdata){
				var _html = ''
				that.siteList = rdata.data;
				$.each(rdata.data, function (index, item) {
					_html +=
					'<li class="' +
					(that.siteName && that.siteName === item.name ? 'active' : '') +
					'"  title="'+ (item.name) +'" data-name="'+ (item.name) +'">'+ (item.name) +'</li>';
				});
				$('.siteSelected .mt_select_list').html(_html);
				$('.siteSelected .mt_select_list li').off('click').on('click',function(e){
					var name = $(this).data('name');
					$('.siteSelected .mt_select_content').val(name)
					$('#siteMenu .mt_select_list').hide()
					that.siteName = name;
					$(this).addClass('active').siblings().removeClass('active');
					var index = $('#siteLogs .tab-nav-border span.on').index();
					var arr = $('#siteLogs .tab-nav-border span')
					var newArr = arr.filter(function(index,item){
						return !$(item).hasClass('firwall_place_of_attribution')
					})
					$(newArr[index]).trigger('click');
					e.stopPropagation()
				})
				if(callback) callback(rdata)
			})
		},
		/**
		 * @description 切换日志菜单
		 * @param {number} index 索引
		*/
		cutLogsTab:function(index){
			var that = this;
			switch (index) {
				case 0: //网站运行日志
				that.getSiteRun();
					break;
				case 1: //日志统计
				that.getLoStatistics();
					break;
				case 2: //网站操作日志
					that.getSiteOnesite();
					break;
				case 3: //WEB日志分析
					that.getSiteWeb();
					break;
			}
		},
		/**
		 * @description 清理、导出网站日志
		 */
		getLogAction: function (type) {
			var that = this;
			var clearArr = [],inputArr = [];
			var timestamp = parseInt(new Date().getTime() / 1000);
			var timeList = ['',7,30,180]
			$.each(timeList,function(index,item){
				if(item == ''){
					clearArr.push({title:'全部日志',value:JSON.stringify([])})
					inputArr.push({title:'全部日志',value:JSON.stringify([])})
				}else{
					var currentDate = new Date(); // 获取当前时间
					currentDate.setDate(currentDate.getDate() - item); // 减去7天
					currentDate.setHours(0, 0, 0, 0); // 设置时间为午夜
					var sevenDaysAgoTimestamp = currentDate.getTime() / 1000;
					clearArr.push({title:'近'+ item +'天日志',value:JSON.stringify([sevenDaysAgoTimestamp,timestamp])})
					inputArr.push({title:'仅保留近'+ item +'天日志',value:JSON.stringify([sevenDaysAgoTimestamp,timestamp])})
				}
			})
			bt_tools.open({
				title:type=='clear' ? '清理日志':'导出日志',
				area:['420px',type=='clear' ? '290px':'238px'],
				btn:['确定','取消'],
				content:{//配置请查看表单form方法中的类型
						class:'pd20',
						form:[{
							label: '类型',
							group:{
									type: 'select',
									name: 'type',
									width: '150px',
									list: [{title:'运行日志',value:'access'},{title:'错误日志',value:'error'}],
									change: function (formData, element, that) {
											// 选中下拉项后
									}
							}
						},{
							label: type=='clear' ? '清理范围':'导出范围',
							group:{
									type: 'select',
									name: 'time',
									width: '150px',
									list: type=='clear' ? inputArr:clearArr,
									change: function (formData, element, that) {
											// 选中下拉项后
									}
							}
					}]
				},
				success:function(){
						//打开弹窗后执行的事件
						$('.layui-layer-content').css('overflow','inherit')
						if(type=='clear'){
							$('.layui-layer-content .pd20').prepend('\
									<div class="info-title-tips" style="background:#FDF6EC;">\
            			<p style="color:#E6A23C;"><span class="glyphicon glyphicon-alert" style="color: #f39c12; margin-right: 10px;"></span> 清理相关日志可能会导致故障排查困难，请谨慎操作</p>\
          				</div>'
							)

						}
				},
				yes:function(formD,indexs){
						//formD会获取配置中name的集合数据
						bt_tools.send({ url: type =='clear' ? '/logs/site/clear_logs':'/logs/site/download_logs' }, { siteName: that.siteName,time_search:formD.time,logType:formD.type }, function (res) {
							if(res.status){
								if(type=='input'){
									window.open('/download?filename=' + res.msg);
								}
								if(type=='clear') that.getSiteRun() //清理后刷新日志
								layer.close(indexs)
								layer.msg(type=='clear'? '清理成功':'导出成功', { icon: 1 })

							}
						},type=='clear'? '清理日志':'导出日志')
						//indexs可用于完成操作后关闭弹窗layer.close(indexs)
				}
		})
		},
		/**
		 * @description 获取网站日志统计
		 */
		getLoStatistics: function (day) {
			var that = this;
			$('#siteOnesit').empty();
			var _html = '<div class="log-introduce-new daily-thumbnail domain" style="display: flex;flex-direction: column;flex-wrap: wrap;">\
              <div class="thumbnail-introduce-title-new" style="width: 90%;flex-direction: column;">\
                  <div class="thumbnail-title-left-new">\
                      <div class="thumbnail-title-text-new">\
                          <p>日志统计-功能介绍</p>\
                          <p>记录IP的访问次数并分析访问类型，可以更好地了解访问行为，及时发现并解决潜在问题，保障网络的稳定性和安全性</p>\
                      </div>\
                  </div>\
                  <div class="thumbnail-title-button-new daily-product-buy"  style="    margin: 16px 0 0 0;">\
                  	<a href="javascript:;" class="btn btn-success va0 installIntrusion">立即安装</a>\
										<a title="购买专业/企业版" href="javascript:;" class="btn btn-success va0 buyIntrusion" onclick="product_recommend.pay_product_sign(\'ltd\',132,\'ltd\')">立即购买</a>\
                  </div>\
              </div>\
              <div class="thumbnail-introduce-hr" style="margin:28px 0"></div>\
              <div class="thumbnail-introduce-ul-new" style="margin-bottom:20px">\
                  <ul>\
                      <li><span class="li-icon"></span>访问统计</li>\
                      <li><span class="li-icon"></span>访问类型分析</li>\
                  </ul>\
              </div>\
              <div class="thumbnail-box special-on">\
								<ul class="thumbnail-tab">\
									<li class="on" >访问统计</li>\
								</ul>\
								<div class="thumbnail-item show">\
									<div class="pluginTipsGg" style="height: 352px;background-image: url(https://www.bt.cn/Public/new/plugin/introduce/logs/siteLogTotal.png)">\
									</div>\
								</div>\
							</div>\
            </div>'
			bt.soft.get_soft_find('total', function (rdata) {
				// 判断插件未安装 && 插件是否过期
				var ltdEnd = bt.get_cookie('ltd_end');
				if (rdata.setup && ltdEnd > -1) {
					var mask = '<div class="mask_layer" ><div class="prompt_description" style="width: 426px;">当前网站监控报表插件版本过低，请确保插件版本大于7.6.0<a class="btlink update_server ml10" >点击更新</a></div></div>'

					var table = bt_tools.table({
						el: '#siteStatistics',
						url: '/logs/total/get_totle',
						height: $(window).height() - 350,
						beforeRequest: function () {
							var par = JSON.stringify({
								siteName: that.siteName,
								day: that.day,
							})
							return {data:par}
						},
						dataFilter: function (res) {
							var arr = [],ip = '';
							for (var i = 0; i < res.length; i++) {
								$.each(res[i], function (index, item) {
									if(index != 0){
										arr.push({
											ip: ip,
											country: item.country,
											request: item.request,
											is_spider: item.is_spider,
											time: item.time,
										});
									}else{
										ip = item;
									}
								})
							}
							return { data: arr };
						},
						tootls: [
							{
								// 按钮组
								type: 'group',
								positon: ['left', 'top'],
								list: [
									{
										title: '刷新日志',
										event: function (ev, _that) {
											_that.$refresh_table_list(true);
										},
									},
								],
							},
						],
						column: [
							{ fid: 'ip', title: 'IP', type: 'text', width: 150 },
							{ fid: 'country', title: '归属地', type: 'text', width: 150 },
							{ fid: 'request', title: '访问次数', type: 'text', width: 300 },
							{ fid: 'is_spider', title: '蜘蛛类型', type: 'text', width: 150 },
							{ fid: 'time', title: '最后一次访问时间', type: 'text', width: 150,template:function(row){
									var time = bt.format_data(row.time, 'yyyy-MM-dd')
									return time == '1970/01/01' ? '-' : time
								} },
						],
						success:function(){
						}
					});
					$('#siteStatistics .tootls_top .pull-left').html('' +
						'<button class="w-60px btn btn-sm '+ (that.day == '' ? 'btn-success':'btn-default') +' Statistics_shows"\
						id="showAll" data-value="">全部</button>\
						<button style="margin-left:-5px" class="w-60px btn btn-sm '+ (that.day == '0' ? 'btn-success':'btn-default') +' Statistics_shows"\
						id="showToday" data-value="0">今日</button>\
						<button style="margin-left:-5px" class="w-60px btn btn-sm '+ (that.day == '7' ? 'btn-success':'btn-default') +' Statistics_shows"\
						id="showWeek" data-value="7">近7天</button>\
						<button style="margin-left:-5px" class="w-60px btn btn-sm '+ (that.day == '30' ? 'btn-success':'btn-default') +' Statistics_shows"\
						id="showMonth" data-value="30">近30天</button>'
					)
					$('.Statistics_shows').off('click').on('click',function () {
						var day1 = $(this).data('value');
						that.day = (String(day1));
						that.getLoStatistics()
						$(this).addClass('btn-success').removeClass('btn-default').siblings().removeClass('btn-success').addClass('btn-default');
					});
					if(!(rdata.version.split('.')[1] >=6 && rdata.version.split('.')[0] >= 7)){
						$('#siteStatistics').append(mask);
						$('.update_server').off('click').on('click',function () {
							bt.soft.update_soft(rdata.name ,rdata.title , rdata.versions[0].m_version ,rdata.versions[0].version,rdata.versions[0].update_msg.replace(/\n/g, "_bt_") ,rdata.type)
						})
					}
				}else {
					$('#siteStatistics').html(_html);
					if(ltdEnd > -1 && !rdata.setup) {
						$('.installIntrusion').show();
						$('.buyIntrusion').hide();
					}
					if (ltdEnd == -1){
						$('.installIntrusion').hide();
						$('.buyIntrusion').show();
					}
					if(ltdEnd > -1 && rdata.setup && (rdata.version.split('.')[1] <6 || rdata.version.split('.')[0] < 7)){
						$('.installIntrusion').hide();
						$('.buyIntrusion').hide();
					}
					$('.installIntrusion ').unbind('click').on('click',function (){
						bt.soft.install('total',function (rdata) {
							location.reload()
						},'6.0')
					})
				}
			})
		},
		/**
		 * @description 获取网站操作日志
		*/
		getSiteOnesite: function(p) {

			var that = this;
			$('#siteOnesite').empty()
			bt_tools.table({
				el: '#siteOnesite',
				url: '/logs/panel/get_logs_bytype',
				param: {
					data: JSON.stringify({
						stype: '网站管理',
						search: that.siteName,
						limit: 20,
						p: p || 1
				})
				},
				height: $(window).height() - 350,
				dataFilter: function(res) {
					$('#siteOnesite .tootls_bottom').remove()
					$('#siteOnesite').append('<div class="tootls_group tootls_bottom"><div class="pull-right"></div></div>')
					$('#siteOnesite .tootls_bottom .pull-right').append($(res.page).addClass('page'))
					$('#siteOnesite .tootls_bottom .pull-right .page').on('click','a',function(e){
						var num = $(this).prop('href').split('p=')[1]
						that.getSiteOnesite(num)
						e.preventDefault();
					})
					return {data: res.data}
				},
				tootls: [
					{ // 按钮组
					  type: 'group',
					  positon: ['left', 'top'],
					  list: [{
						title: '刷新日志',
						active: true,
						event: function (ev,_that) {
							_that.$refresh_table_list(true)
						}
					  }]
					}
				],
				column: [
					{fid: 'username', title: '用户', type: 'text', width: 150},
					{fid: 'type', title: '操作类型', type: 'text', width: 150},
					{fid: 'log', title: '日志', type: 'text', width: 300},
					{fid: 'addtime', title: '操作时间', type: 'text', width: 150},
				]
			})
		},
		/**
		 * @description 网站运行日志
		*/
		getSiteRun: function (search, p) {
			var that = this;
			var loadT = bt.load('正在获取日志,请稍候...');
			$.post({ url: that.type =='access' ? '/logs/site/get_site_access_logs':'/logs/site/get_site_error_logs' }, { siteName: that.siteName }, function (rdata) {
				loadT.close();
				$('#siteRun').html(
					'<div style="margin-bottom: 5px; position: relative; height:30px;line-height:30px;display: flex;justify-content: space-between;">\
					<div>\
					<button type="button" title="刷新设置" class="btn btn-default btn-sm mr15 refreshSiteSunLogs relative" >\
					<span>刷新设置</span>\
					<div class="refreshMenu"></div>\
					</button>\
					</div>\
					<div class="flex">\
					<div style="margin-right:10px;">\
					<button class="w-60px btn btn-sm '+ (that.type == 'access' ? 'btn-success':'btn-default') +' Catalogue_shows"\
								id="runAll" data-value="access">运行</button>\
					<button style="margin-left:-5px" class="w-60px btn btn-sm '+ (that.type == 'error' ? 'btn-success':'btn-default') +' Catalogue_shows"\
						id="runError" data-value="error">错误</button>\
					</div>\
					<span style="margin-right:10px;" class="last-span"><input id="site_time_choose" autocomplete="off" placeholder="选择时间范围" type="text"></span>\
					<div class="order_search">\
						<input type="text" class="search_input" placeholder="请输入你要搜索的内容" />\
						<span class="glyphicon glyphicon-search" aria-hidden="true"></span>\
					</div>\
					</div>\
				</div>\
				<div style="font-size: 0;">\
					<pre class="crontab-log"><code>' +
						bt.htmlEncode.htmlEncodeByRegExp(rdata.msg === '' ? '当前没有日志.' : rdata.msg) +
						'</code></pre>\
				</div>'
				);
				bt_tools.form({
					el:'.refreshMenu',
					class:'mt10',
					form:[
						{
							label: '定时刷新',
							group:{
									name: 'timeRefresh',
									type: 'other',
									class:'mt5 refreshMenuFix',
									boxcontent:'<input class="btswitch btswitch-ios" id="setTimeRefresh" type="checkbox"><label style="margin-left:6px;margin-right:6px" class="btswitch-btn phpmyadmin-btn" for="setTimeRefresh" ></label>'
							}
						},
						{
							label:'间隔',
							group:{
									type:'number',
									name:'time',
									style:'margin-left:-22px; color:#333;',
									width:'50px',
									value:5,
									unit:'秒',
							}
						}
					]
			})
			$('.refreshMenu .line').css('padding','0px')
			$('.refreshMenu .tname').css('width','90px')
			$('.refreshMenu .tname').css('padding-right','10px')
			$('.refreshMenu .tname').css('color','black')
			$('.refreshMenu').append('<div class="arrow_b" style=""></div><div class="arrow" style=""></div>')
			if(bt.get_cookie('siteLogsIsRefresh') == 'true'){
				$('#setTimeRefresh').prop('checked',bt.get_cookie('siteLogsIsRefresh'))
				$('.refreshMenu [name=time]').val(bt.get_cookie('siteLogsRefreshTime')/1000)
				clearInterval(that.timer)
				that.timer = setInterval(function(){
					that.refreshLogs()
				},bt.get_cookie('siteLogsRefreshTime'))
			}
			// 刷新设置
				$('.refreshSiteSunLogs').off('click').on('click',function (e) {
					$($('.refreshMenu .line')[1]).show()
					$('.refreshMenu').show()
					if($('#setTimeRefresh').prop('checked')){
						$('#setTimeRefresh').off('change').on('change',function(){
							that.setRefreshLogs()
						})
						$('.refreshMenu [name=time]').off('blur').on('blur',function(){
						    if($(this).val() < 1){
						        layer.msg('刷新时间不能小于1',{icon:0})
						        $('.refreshMenu [name=time]').val(bt.get_cookie('siteLogsRefreshTime')/1000)
						        return false
						    }
							that.setRefreshLogs()
						})

					}else {
						$($('.refreshMenu .line')[1]).hide()
					}
					$(document).one('click',function(){
						$('.refreshMenu').hide()
					})

					e.stopPropagation();
				});
				// 按钮组
				$('.Catalogue_shows').off('click').on('click',function () {
					that.type = $(this).data('value');
					that.refreshLogs()
					$(this).addClass('btn-success').removeClass('btn-default').siblings().removeClass('btn-success').addClass('btn-default');
				});
				// 时间选择
				laydate.render({
					elem: '#site_time_choose',
					range: true,
					value: '',
					max: bt.format_data(new Date().getTime(), 'yyyy-MM-dd'),
					done: function (value, startdate, endDate) {
						var timeA = value.split(' - ');
						$('#time_choose').val(value);
						timeA[0] = timeA[0] + ' 00:00:00';
						timeA[1] = timeA[1] + ' 23:59:59';
						// if (timeA[0] == '') timeA[0] = dateList[0];
						$('.last-span').addClass('on').siblings().removeClass('on');
						var list = [];
						timeA.forEach(function (time) {
							list.push(Date.parse(time) / 1000);
						});
						if (isNaN(list[0])) {
							list = [];
						}
						that.time = list;
						that.refreshLogs()
						// getList({ id: row.id, type: typeLog, time_search: time });
					},
				});
				// 任务列表搜索事件绑定
				$('.order_search .glyphicon-search')
					.off('click')
					.on('click', function () {
						that.search = $('.order_search .search_input').val();
						that.refreshLogs()
					});
				$('.order_search .search_input')
					.off('focus')
					.on('focus', function () {
						$(document)
							.off('keydown')
							.on('keydown', function (e) {
								if (e.keyCode === 13) {
									that.search = $('.order_search .search_input').val();
									that.refreshLogs()
								}
							});
					});
				$('.order_search .search_input')
					.off('blur')
					.on('blur', function () {
						$(document).off('keydown');
					});
				var div = $('#siteRun .crontab-log');
				div.height(window.innerHeight - 330 + 'px');
				div.scrollTop(div.prop('scrollHeight'));
			});
		},
				/**
		 * @description 刷新网站运行日志
		 */
				refreshLogs: function () {
					var that = this;
					$.post({ url: that.type =='access' ? '/logs/site/get_site_access_logs':'/logs/site/get_site_error_logs' }, { siteName: that.siteName,time_search:JSON.stringify(that.time || []),search:that.search || '' }, function (res) {
						$('.crontab-log code').html(bt.htmlEncode.htmlEncodeByRegExp(res.msg === '' ? '当前没有日志.' : res.msg))
					})
				},
				/**
				 * @description 刷新网站日志设置
				 */
				setRefreshLogs: function () {
					var that = this;
					if($('#setTimeRefresh').prop('checked')){
						if(Number($('.refreshMenu [name=time]').val()) > 0){
						clearInterval(that.timer)
							that.timer = setInterval(function(){
							that.refreshLogs()
						},$('.refreshMenu [name=time]').val()*1000)
						bt.set_cookie('siteLogsIsRefresh', $('#setTimeRefresh').prop('checked'))
						bt.set_cookie('siteLogsRefreshTime', $('.refreshMenu [name=time]').val()*1000)
						layer.msg('设置成功', { icon: 1 })
						}else{
							layer.msg('请输入正确的间隔', { icon: 2 })
						}
					}else{
						clearInterval(that.timer)
						bt.set_cookie('siteLogsIsRefresh', $('#setTimeRefresh').prop('checked'))
						layer.msg('取消成功', { icon: 1 })
					}
				},
		/**
		 * @description 网站错误日志
		*/
		getSiteError: function() {
			var that = this;
			bt.site.get_site_error_logs(that.siteName, function (rdata) {
				$('#siteError').html('<div style="font-size: 0;">\
					<button type="button" title="刷新日志" class="btn btn-success btn-sm mr5 refreshSiteErrorLogs" ><span>刷新日志</span></button>\
					<pre class="crontab-log"><code>'+ bt.htmlEncode.htmlEncodeByRegExp(rdata.msg) +'</code></pre>\
				</div>');

				$('.refreshSiteErrorLogs').click(function (){
					that.getSiteError()
				})

				var div = $('#siteError .crontab-log')
				div.height((window.innerHeight - 330) +'px')
				div.scrollTop(div.prop('scrollHeight'))
			})
		},
		/**
		 * @description WEB日志分析
		*/
		getSiteWeb: function() {
			var that = this,robj = $('#siteWeb')
			var progress = '';  //扫描进度
			robj.empty()
			var loadT = bt.load('正在获取日志分析数据，请稍候...');
			$.post('/ajax?action=get_result&path=/www/wwwlogs/' + that.siteName+'.log', function (rdata) {
				loadT.close();
				//1.扫描按钮
				var analyes_log_btn = '<button type="button" title="日志扫描" class="btn btn-success analyes_log btn-sm mr5"><span>日志扫描</span></button>'

				//2.功能介绍
				var analyse_help = '<ul class="help-info-text c7">\
					<li>日志安全分析：扫描网站(.log)日志中含有攻击类型的请求(类型包含：<em style="color:red">xss,sql,san,php</em>)</li>\
					<li>分析的日志数据包含已拦截的请求</li>\
					<li>默认展示上一次扫描数据(如果没有请点击日志扫描）</li>\
					<li>如日志文件过大，扫描可能等待时间较长，请耐心等待</li>\
					</ul>'

				robj.append(analyes_log_btn+'<div class="analyse_log_table"></div>'+analyse_help)
				render_analyse_list(rdata);

				//事件
				$(robj).find('.analyes_log').click(function(){
					bt.confirm({
						title:'扫描网站日志',
						msg:'建议在服务器负载较低时进行安全分析，本次将对【'+that.siteName+'.log】文件进行扫描，可能等待时间较长，是否继续？'
					}, function(index){
						layer.close(index)
						progress = layer.open({
							type: 1,
							closeBtn: 2,
							title: false,
							shade: 0,
							area: '400px',
							content: '<div class="pro_style" style="padding: 20px;"><div class="progress-head" style="padding-bottom: 10px;">正在扫描中，扫描进度...</div>\
									<div class="progress">\
										<div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 0%">0%</div>\
									</div>\
								</div>',
							success:function(){
								// 开启扫描并且持续获取进度
								$.post('/ajax?action=log_analysis&path=/www/wwwlogs/' + that.siteName+'.log', function (rdata) {
									if(rdata.status){
										detect_progress();
									}else{
										layer.close(progress);
										layer.msg(rdata.msg, { icon: 2, time: 0, shade: 0.3, shadeClose: true });
									}
								})
							}
						})
					})
				})
			})
			// 渲染分析日志列表
			function render_analyse_list(rdata){
				var numTotal = rdata.xss+rdata.sql+rdata.san+rdata.php+rdata.ip+rdata.url
				var analyse_list = '<div class="divtable" style="margin-top: 10px;"><table class="table table-hover">\
					<thead><tr><th width="142">扫描时间</th><th>耗时</th><th>XSS</th><th>SQL</th><th>扫描</th><th>PHP攻击</th><th>IP(top100)</th><th>URL(top100)</th><th>合计</th></tr></thead>\
					<tbody class="analyse_body">'
				if(rdata.is_status){   //检测是否有扫描数据
					analyse_list +='<tr>\
							<td>'+rdata.start_time+'</td>\
							<td>'+rdata.time.substring(0,4)+'秒</td>\
							<td class="onChangeLogDatail" '+(rdata.xss>0?'style="color:red"':'')+' name="xss">'+rdata.xss+'</td>\
							<td class="onChangeLogDatail" '+(rdata.sql>0?'style="color:red"':'')+' name="sql">'+rdata.sql+'</td>\
							<td class="onChangeLogDatail" '+(rdata.san>0?'style="color:red"':'')+' name="san">'+rdata.san+'</td>\
							<td class="onChangeLogDatail" '+(rdata.php>0?'style="color:red"':'')+' name="php">'+rdata.php+'</td>\
							<td class="onChangeLogDatail" '+(rdata.ip>0?'style="color:#20a53a"':'')+' name="ip">'+rdata.ip+'</td>\
							<td class="onChangeLogDatail" '+(rdata.url>0?'style="color:#20a53a"':'')+' name="url">'+rdata.url+'</td>\
							<td>'+numTotal+'</td>\
						</tr>'
				}else{
					analyse_list+='<tr><td colspan="9" style="text-align: center;">没有扫描数据</td></tr>'
				}
				analyse_list += '</tbody></table></div>'
				$('.analyse_log_table').html(analyse_list)
				$('.onChangeLogDatail').css('cursor','pointer').attr('title','点击查看详情')
				//查看详情
				$('.onChangeLogDatail').on('click',function(){
					get_analysis_data_datail($(this).attr('name'))
				})
			}
			// 扫描进度
			function detect_progress(){
				$.post('/ajax?action=speed_log&path=/www/wwwlogs/' + that.siteName+'.log', function (res) {
					var pro = res.msg
					if(pro !== 100){
						if (pro > 100) pro = 100;
						if (pro !== NaN) {
							$('.pro_style .progress-bar').css('width', pro + '%').html(pro + '%');
						}
						setTimeout(function () {
							detect_progress();
						}, 1000);
					}else{
						layer.msg('扫描完成',{icon:1,timeout:4000})
						layer.close(progress);
						get_analysis_data();
					}
				})
			}
			// 获取扫描结果
			function get_analysis_data(){
				var loadTGA = bt.load('正在获取日志分析数据，请稍候...');
				$.post('/ajax?action=get_result&path=/www/wwwlogs/' + that.siteName+'.log', function (rdata) {
					loadTGA.close();
					render_analyse_list(rdata,true)
				})
			}
			// 获取扫描结果详情日志
			function get_analysis_data_datail(name){
				layer.open({
					type: 1,
					closeBtn: 2,
					shadeClose: false,
					title: '【'+name+'】日志详情',
					area: '650px',
					content:'<pre id="analysis_pre" style="background-color: #333;color: #fff;height: 545px;margin: 0;white-space: pre-wrap;border-radius: 0;"></pre>',
					success: function () {
						var loadTGD = bt.load('正在获取日志详情数据，请稍候...');
						$.post('/ajax?action=get_detailed&path=/www/wwwlogs/' + that.siteName+'.log&type='+name+'', function (logs) {
							loadTGD.close();
							$('#analysis_pre').html((name == 'ip' || name == 'url'?'&nbsp;&nbsp;[次数]&nbsp;&nbsp;['+name+']</br>':'')+logs)
						})
					}
				})
			}
		},
		check_log_time: function () {
            bt.confirm({
                msg: "是否立即校对IIS日志时间，校对后日志统一使用北京时间记录？",
                title: '提示'
            }, function () {
                var loading = bt.load()
                bt.send("check_log_time", 'site/check_log_time', {}, function (rdata) {
                    loading.close();
                    if (rdata.status) {
                        site.reload();
                    }
                    bt.msg(rdata);
                })
            })
        },
    },
	// 日志审计
  logAudit:{

    data:{},
    /**
     * @description SSH管理列表
     */
    event:function (){
      var that = this;
      $('#logAudit .logAuditTab').empty()
      this.getLogFiles()
      $('.state-content').hide()
			var ltd = parseInt(bt.get_cookie('ltd_end'))
			if(ltd < 0) {
				$('#logAudit .installSoft').show().prevAll().hide()
			}else{
				$('#logAudit').height($(window).height() - 180)
				$(window).unbind('resize').on('resize', function () {
					var height = $(window).height() - 180;
					$('#logAudit').height(height)
					$('#logAuditTable .divtable').css('max-height', height - 150)
				})
			}
      $('.logAuditTab').unbind('click').on('click', '.logAuditItem',function (){
        var data = $(this).data(), list = []
        $.each(data.list, function (key, val){
          list.push(val.log_file)
        })
        $(this).addClass('active').siblings().removeClass('active')
        that.getSysLogs({log_name: data.log_file, list: list, p:1})
      })

      $('#logAuditPages').unbind('click').on('click', 'a', function (){
        var page = $(this).data('page')
        that.getSysLogs({log_name: that.data.log_name, list: that.data.list, p: page})
        return false
      })
    },

    /**
     * @description 获取日志审计类型
     */
    getLogFiles: function () {
      var that = this;
      bt_tools.send({
        url: '/safe/syslog/get_sys_logfiles'
      }, function (rdata) {
        if(rdata.hasOwnProperty('status') ){
          if(!rdata.status && rdata.msg.indexOf('企业版用户') > -1){
            $('.logAuditTabContent').hide();
            $('#logAudit .installSoft').show()
            return false
          }
        }
        var initData = rdata[0], list = []
        $.each(rdata, function (i, v) {
          var logSize = 0;
          $.each(v.list,function (key, val){
            logSize += val.size;
          })
          $('#logAudit .logAuditTab').append($('<div class="logAuditItem" title="'+ (v.name + ' - '+ v.title +'('+ ToSize(v.size)) +'" data-file="'+ v.log_file +'">' + v.name + ' - '+ v.title +'('+ ToSize(v.size + logSize) +')</div>').data(v))
        })
        $('#logAudit .logAuditTab .logAuditItem:eq(0)').trigger('click')
      }, {load:'获取日志审计类型',verify:false})
    },

    /**
     * @description 获取日志审计类型列表
     */
    getSysLogs: function (param) {
      var that = this;
      var page = param.p || 1;
      that.data = { log_name: param.log_name, list: param.list, limit: 20, p: page }
      bt_tools.send({
        url: '/safe/syslog/get_sys_log',
        data: {data:JSON.stringify(that.data)}
      }, function (rdata) {
        if(typeof rdata[0] === 'string'){
          $('#logAuditPre').show().siblings().hide()
          that.renderLogsAuditCommand(rdata)
        }else{
          $('#logAuditTable,#logAuditPages').show()
          $('#logAuditPre').hide()
          that.renderLogsAuditTable({ p:page }, rdata)
        }
      }, {
        load: '获取日志审计类型列表',
        verify: false
      })
    },

    /**
     * @description 渲染日志审计命令
     * @param {Object} rdata 参数
     */
    renderLogsAuditCommand: function (rdata) {
      var logAuditLogs = $('#logAuditPre');
      var str = rdata.join('\r').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      logAuditLogs.html('<pre style="height: 600px; background-color: #333; color: #fff; overflow-x: hidden; word-wrap:break-word; white-space:pre-wrap;"><code>' + str + '</code></pre>');
      logAuditLogs.find('pre').scrollTop(9999999999999).css({height: $(window).height() - 180})
    },

    /**
     * @description 渲染日志审计表格
     * @param {object} param 参数
     */
    renderLogsAuditTable: function (param, rdata){
      var that = this;
      var column = [], data = rdata[0] ? rdata[0] : { 时间: '--', '角色': '--', '事件': '--' }, i = 0;
      $.each(data, function (key) {
        // console.log(key === '时间',i)
        column.push({ title: key, fid: key,width: (key === '时间' &&  i === 0) ? '200px' : (key === '时间'?'300px':'') })
        i++;
      })
      $('#logAuditTable').empty()
      return bt_tools.table({
        el: '#logAuditTable',
        url:'/safe/syslog/get_sys_log',
        load: '获取日志审计内容',
        default: '日志为空', // 数据为空时的默认提示
        column: column,
        dataFilter: function (data) {
          if(typeof data.status === "boolean" && !data.status){
            $('.logAuditTabContent').hide().next().show();
            return { data: [] }
          }
          if(typeof data[0] === 'string'){
            $('#logAuditPre').show().siblings().hide()
            that.renderLogsAuditCommand(rdata)
          }else{
            $('#logAuditTable,#logAuditPages').show()
            $('#logAuditPre').hide()
            return {data:data}
          }
        },
        beforeRequest: function (param) {
          delete  param.data
          return {data:JSON.stringify($.extend(that.data,param))}
        },
        tootls: [{ // 按钮组
          type: 'group',
          list: [{
            title: '刷新列表',
            active: true,
            event: function (ev) {
              that.getSysLogs(that.data)
            }
          }]
        },{ // 搜索内容
          type: 'search',
          placeholder: '请输入来源/端口/角色/事件',
          searchParam: 'search', //搜索请求字段，默认为 search
        },{
          type:'page',
          number:20
        }],
        success:function (config){
          $('#logAuditTable .divtable').css('max-height', $(window).height()  - 280)
			if($('#logAuditTable .tootls_top .pull-left .bt-desired').length === 0){
				$('#logAuditTable .tootls_top .pull-left').append('<span class="bt-desired ml10" style="background-size: 16px;background-position: left;"><a href="javascript:;" class="btlink ml5 npsFeedback">需求反馈</a></span>')
				// 日志nps入口
				$('.npsFeedback').on('click',function(){
					bt_tools.nps({name:'日志',type:22})
				})
			}
        }
      })
    }
  },
	// SSH登录日志
	loginLogs:{
    event: function() {
			var that = this;
			var ltd = parseInt(bt.get_cookie('ltd_end'))
			if(ltd < 0) {
        return $('#loginLogsContent').hide().next().show();
      }
			var type = $('.cutLoginLogsType button.btn-success').data('type')
			this.loginLogsTable({p:1, type: type? type : 0});
			 // 切换登录日志类型
			$('#loginLogsContent').unbind('click').on('click','.cutLoginLogsType button',function(){
				var type = $(this).data('type');
				$(this).addClass('btn-success').removeClass('btn-default').siblings().addClass('btn-default').removeClass('btn-success');
				// $('#loginLogsContent>div:eq('+ type +')').show().siblings().hide();
				that.loginLogsTable({p:1,type: Number(type)});
			})
        },
		/**
     * @description 登录日志
     */
    loginLogsTable:function(param){
      if(!param) param = { p:1, type:0 };
      var logsArr = [['ALL','日志'],['Accepted','成功日志'],['Failed','失败日志']];
      var type = logsArr[param.type][0] , tips = logsArr[param.type][1];
			param.type = type;
      var that = this;
      $('#loginAllLogs').empty();
      var arry = ['全部','登录成功','登录失败'];
			var html = $('<div class="btn-group mr10 cutLoginLogsType"></div>');
      $.each(arry,function (i,v){
        html.append('<button type="button" class="btn btn-sm btn-'+ (logsArr[i][0] === param.type ?'success':'default') +'" data-type="'+ i +'">'+ v +'</button>')
      })
			param['select'] = param.type
			delete param.type
      return bt_tools.table({
        el: '#loginAllLogs',
				url: '/safe/syslog/get_ssh_list',
        load: '获取SSH登录' + tips,
        default: 'SSH登录'+ tips +'为空', // 数据为空时的默认提示
        autoHeight: true,
        param:param,
        dataVerify:false,
        tootls: [
          { // 按钮组
            type: 'group',
            list: [{
              title: '刷新列表',
              active: true,
              event: function (ev,that) {
                that.$refresh_table_list(true)
              }
            }]
          },
          { // 搜索内容
            type: 'search',
            placeholder: '请输入登录IP/用户名',
            searchParam: 'search', //搜索请求字段，默认为 search
          },{ //分页显示
            type: 'page',
            positon: ['right', 'bottom'], // 默认在右下角
            pageParam: 'p', //分页请求字段,默认为 : p
            page: 1, //当前分页 默认：1
            numberParam: 'limit',
            //分页数量请求字段默认为 : limit
            number: 20,
            //分页数量默认 : 20条
            numberList: [10, 20, 50, 100, 200], // 分页显示数量列表
            numberStatus: true, //　是否支持分页数量选择,默认禁用
            jump: true, //是否支持跳转分页,默认禁用
          }
        ],
        beforeRequest: function (data) {
					if(typeof data.data === "string"){
						var data_return = JSON.parse(data.data)
						data_return.search = data.search
						data_return.p = data.p
						return {data:JSON.stringify(data_return)}
					}
          return {data: JSON.stringify(data)}
        },
        column: [
          {title: 'IP地址:端口',fid: 'address',width:'150px', template:function (row){
              return '<span>'+ row.address +':' + row.port + '</span>';
            }},
          // {title: '登录端口',fid: 'port'},
          {title: '归属地',template:function (row){
              return '<span>'+ (row.area?'' + row.area.info + '':'-') +'</span>';
            }},
          {title: '用户',fid: 'user'},
          {title: '状态', template: function (item) {
              var status = Boolean(item.status);
              return '<span style="color:'+ (status?'#20a53a;':'red') +'">'+ (status ? '登录成功' : '登录失败') +'</span>';
            }},
          {title: '操作时间', fid: 'time', width:150}
        ],
        success:function (config){
          $('#loginAllLogs' + ' .tootls_top .pull-right').prepend(html)
			if($('#loginAllLogs .tootls_top .pull-left .bt-desired').length === 0){
				$('#loginAllLogs .tootls_top .pull-left').append('<span class="bt-desired ml10" style="background-size: 16px;background-position: left;"><a href="javascript:;" class="btlink ml5 npsFeedback">需求反馈</a></span>')
				// 日志nps入口
				$('.npsFeedback').on('click',function(){
					bt_tools.nps({name:'日志',type:22})
				})
			}
        }
      })
    },
  },
	//软件日志
	softwareLogs: {
		username: '',
		thatPlugname: '', //当前点击的插件
		/**
		 * @description 事件绑定
		 */
		event: function () {
			var that = this;
			// 数据库的选项卡
			$('#softwareLogs')
				.unbind('click')
				.on('click', '.tab-nav-border>span', function () {
			  var index = $(this).index();
			  $(this).addClass('on').siblings().removeClass('on');
			  $(this).parent().next().find('.tab-block').eq(index).addClass('on').siblings().removeClass('on');
					that.cutLogsTab(index);
				});
			that.initSoft();
			//右边的 消息信息搜索框
			$('#softwareLogs .Content .search-input').keyup(function (e) {
				var value = $(this).val();
				if (e.keyCode == 13) that.getFtpLogs(value);
			});
			//右边的 消息信息搜索框
			$('#softwareLogs .Content').on('click', '.glyphicon-search', function () {
				var value = $('#softwareLogs .Content .search-input').val();
				that.getFtpLogs(value);
			});
			//点击左侧插件列表
			$('#softwareLogs .Tab')
				.unbind()
				.on('click', '.Item', function () {
					that.thatPlugname = $(this).data('pluginname');
					$(this).addClass('active').siblings().removeClass('active');
					if ($(this).data('pluginname') !== 'FTP' && $(this).data('pluginname') !== 'MySql' && $(this).data('pluginname') !== 'Php') {
						that.getPlugLogs($(this).data('pluginname'));
						$('.tabContent').find('.tab-show').hide();
						$('#softwarePlugLogs').show();
					}
					if ($(this).data('pluginname') == 'FTP') {
						$('.tabContent').find('.tab-show').hide();
						$('#softftp').show();
						var ltd = parseInt(bt.get_cookie('ltd_end'));
						if (ltd < 0) {
							$('#softwareFtp .daily-thumbnail').show();
							$('#ftpLogsTable').hide();
							$('.mask_layer').hide()
							return
						}
						$('#softwareFtp .daily-thumbnail').hide();
						$('#ftpLogsTable').show();
						that.getFtpLogsStatus('getlog');
						that.getFtpLogs(that.ftpParam, that.username);
					}
					if ($(this).data('pluginname') == 'Mysql') {
						$('.tabContent').find('.tab-show').hide();
						$('#softMysql').show();
						$('#softwareLogs .tab-nav-border span').eq(0).trigger('click');
					}
					if ($(this).data('pluginname') == 'Php') {
						$('.tabContent').find('.tab-show').hide();
						$('#softPhp').show();
						that.getPlugLogs($(this).data('pluginname'));
					}
					if ($(this).data('pluginname') == 'Docker') {
						$('.tabContent').find('.tab-show').hide();
						$('#DockerLogsTable').show();
						that.getDocker();
					}
				});
			$('.refreshFtpLogs').click(function () {
				that.getFtpLogs();
			});
			//mysql 慢日志的右边的搜索
			$('#softwareMysqlSlow .search-input').keyup(function (e) {
				var value = $(this).val();
				if (e.keyCode == 13) that.getMysqlSlowLogs(value);
			});
			$('#softwareMysqlSlow').on('click', '.glyphicon-search', function () {
				var value = $('#softwareMysqlSlow .search-input').val();
				that.getMysqlSlowLogs(value);
			});
			//mysql 慢日志的刷新日志
			$('.refreshMysqlSlow').click(function () {
				that.getMysqlSlowLogs();
			});
			//mysql 错误日志的刷新日志
			$('.refreshMysqlError').click(function () {
				that.getMysqlErrorLogs();
			});
			//其余插件  除特殊的 刷新
			$('.refreshPlugLogs').click(function () {
				that.getPlugLogs(that.thatPlugname);
			});
			//其余插件的右边的搜索
			$('#softwarePlugLogs .search-input').keyup(function (e) {
				var value = $(this).val();
				if (e.keyCode == 13) that.getPlugLogs(that.thatPlugname, value);
			});
			$('#softwarePlugLogs').on('click', '.glyphicon-search', function () {
				var value = $('#softwarePlugLogs .search-input').val();
				that.getPlugLogs(that.thatPlugname, value);
			});
				//其余插件右边的搜索 end

			//PHP插件的右边的搜索
			$('#softPhp .search-input').keyup(function (e) {
				var value = $(this).val();
				if (e.keyCode == 13) that.getPlugLogs(that.thatPlugname, value);
			});
			$('#softPhp').on('click', '.glyphicon-search', function () {
				var value = $('#softPhp .search-input').val();
				that.getPlugLogs(that.thatPlugname, value);
			});
			//其余插件右边的搜索 end
			$(window)
				.unbind('resize')
				.resize(function () {
					that.heightResize();
				});
			that.heightResize();
			// 切换日志类型
			$('#ftpLogsTable')
				.unbind('click')
				.on('click', '.cutFtpLogsType button', function () {
				var type = $(this).data('type');
				$(this).addClass('btn-success').removeClass('btn-default').siblings().addClass('btn-default').removeClass('btn-success');
					that.ftpParam = { p: 1, type: Number(type) };
					that.getFtpLogs(that.ftpParam, that.username);
				});
		},
		heightResize: function () {
			$('#softwareFtp .Tab').css('max-height', window.innerHeight - 300 + 'px');
				// $('#softwareLogs').height(window.innerHeight - 200 + 'px');
			$('#softwareLogs .crontab-log').height(window.innerHeight - 330 + 'px');
		},
		/**
		 * @description 切换日志菜单
		 * @param {number} index 索引
		 */
		cutLogsTab: function (index) {
			var that = this;
			switch (index) {
				case 0: //MySql慢日志
					that.getMysqlSlowLogs();
					break;
				case 1: //MySql错误日志
					that.getMysqlErrorLogs();
					break;
			}
		},
		//进入软件日志初始化
		initSoft: function () {
			var that = this;
			var ltd = parseInt(bt.get_cookie('ltd_end'));
			if (ltd < 0) {
				$('#softwareFtp .daily-thumbnail').show();
				$('#ftpLogsTable').hide();
			}
			that.getFtpList();
			that.getSoftLogList(function (rdata) {
				$('#softwareLogs .Tab .Item').eq(0).trigger('click');
			});
		},
		/**
		 * @description MySql慢日志
		*/
		getMysqlSlowLogs: function (search, limit) {
			limit = limit || 5000;
			var loadT = bt.load('正在获取MySql慢日志，请稍后...');
			$.post('/logs/panel/get_slow_logs', { data: JSON.stringify({ search: search, limit: limit }) }, function (rdata) {
				loadT.close();
				$('#softwareMysqlSlow .crontab-log').html('<code>' + bt.htmlEncode.htmlEncodeByRegExp(rdata['msg'] ? rdata.msg : (rdata.length ? rdata.join('\n') : '当前没有日志.') + '</code>'));
				var div = $('#softwareMysqlSlow .crontab-log');
				div.height(window.innerHeight - 330 + 'px');
				div.scrollTop(div.prop('scrollHeight'));
			});
		},
		/**
		 * @description MySql错误日志
		*/
		getMysqlErrorLogsRequest: function (screening) {
			$.post('/database?action=GetErrorLog', { screening: screening }, function (rdata) {
				$('#softwareMysqlError .crontab-log').html('<code>' + bt.htmlEncode.htmlEncodeByRegExp(rdata ? rdata : '当前没有日志.') + '</code>');
				var div = $('#softwareMysqlError .crontab-log');
				div.height(window.innerHeight - 330 + 'px');
				div.scrollTop(div.prop('scrollHeight'));
			});
		},
		chooseLogType: '',
		getMysqlErrorLogs: function () {
			logs.softwareLogs.getMysqlErrorLogsRequest(logs.chooseStr);
		},
		ftpParam: '',
		/**
		 * @description 获取FTP日志
		 * @param {string} param 搜索内容 传递that.ftpParam 用来判断调用是登录日志/操作日志
		 * @param {string} ftptype 搜索内容 传递的是 ftp 的用户名 that.username
		 */
		getFtpLogs: function (param, ftptype) {
			var that = this;
			if (!param) param = { p: 3, type: 0 };
			var logs_ftp_html =
				'<span style="border-left: 1px solid #ccc;margin: 0 15px;"></span><span style="margin: 0 10px ">FTP用户名</span>\
									<div class="fz-wrapper">\
											<div class="fz-select-btn">\
												<span></span>\
												<i class="glyphicon glyphicon-menu-down"></i>\
											</div>\
											<div class="fz-content">\
												<div class="fz-search">\
													<i class=""></i>\
													<input type="text" placeholder="请输入FTP" class="fz-input"></input>\
												</div>\
												<ul class="fz-options">\
														<li></li>\
												</ul>\
											</div>\
									</div>';
			var logsArr = [
				['登录日志', 'get_login_logs'],
				['操作日志', 'get_action_logs'],
			];
      $('#ftpLogsTable').empty();
			var arry = ['登录日志', '操作日志'];
			var span = $('<span style="border-left: 1px solid #ccc;margin: 0 15px;"></span><span class="mr5">日志类型：</span>');
      var html = $('<div class="btn-group mr10 cutFtpLogsType" style="top: -2px;"></div>');
			$.each(arry, function (i, v) {
				html.append('<button type="button" class="btn btn-sm btn-' + (i === param.type ? 'success' : 'default') + '" data-type="' + i + '">' + v + '</button>');
			});
			if (param.type == 0) {
				if (ftptype) {
					table_logsOpera(ftptype);
				} else {
					table_logsOpera(that.username);
				}
				function table_logsOpera(type) {
					$('#ftpLogsTable').empty();
					bt_tools.table({
					el: '#ftpLogsTable',
						url: '/ftp?action=' + logsArr[param.type][1],
					default: '暂无日志信息',
					height: 390,
					param: {
							user_name: type,
					},
					column: [
							{
								title: '用户名',
								type: 'text',
								width: 100,
								template: function () {
									return '<span>' + type + '</span>';
								},
							},
							{ fid: 'ip', title: '登录IP', type: 'text', width: 110 },
							{
								fid: 'status',
								title: '状态',
								type: 'text',
								width: 75,
						template: function (rowc, index, ev) {
									var status = rowc.status.indexOf('登录成功') > -1;
									return '<span class="' + (status ? 'btlink' : 'bterror') + '">' + (status ? '登录成功' : '登录失败') + '<span>';
								},
							},
						{ fid: 'in_time', title: '登录时间', type: 'text', width: 150 },
							{ fid: 'out_time', title: '登出时间', type: 'text', width: 200 },
					],
					tootls: [
						{
								type: 'group',
								positon: ['left', 'top'],
								list: [
									{
										title: '刷新日志',
										active: true,
										event: function (ev, ethat) {
											$('.search_input').val('');
											ethat.config.search.value = '';
											ethat.$refresh_table_list(true);
											// that.getSoftLogList();
										},
									},
								],
						},
						{
							type: 'search',
							positon: ['right', 'top'],
							placeholder: '请输入登录IP/状态/时间',
							searchParam: 'search', //搜索请求字段，默认为 search
								value: '', // 当前内容,默认为空
						},
						{
							type: 'page',
							positon: ['right', 'bottom'], // 默认在右下角
							pageParam: 'p', //分页请求字段,默认为 : p
							page: 1, //当前分页 默认：1
							},
					],
						success: function () {
							// ie兼容样式
							$('#ftpLogsTable').find('.pull-left').css('display','flex')
							$('#ftpLogsTable .pull-left').find('button').css('align-self','flex-start')
							$('#ftpLogsTable .pull-left').find('button').next().css({
									'height': '16px',
									'align-self': 'center',
							})
							$('#ftpLogsTable .divtable').css('width','100%')

							if (!$('#ftpLogsTable .fz-wrapper').length) {
								$('#ftpLogsTable .tootls_top .pull-left').append(logs_ftp_html);
								$('#ftpLogsTable .tootls_top .pull-right').append(span).append(html);
								$('.fz-select-btn').click(function () {
									$('.fz-wrapper').toggleClass('fz-active');
									that.addFruit();
								});
								$('.fz-select-btn').find('span').text(that.username);
								$('.fz-input').on('keyup', function () {
									var arr = [];
									var searchWord = $(this).val().toLowerCase();
									arr = that.FTPList.filter(function (data) {
										return data.name.toLowerCase().startsWith(searchWord);
									})
										.map(function (data) {
											var isSelected = data.name == $('.fz-select-btn').find('span').text() ? 'selected' : ' ';
											return '<li onclick="logs.softwareLogs.updateName(this)"" class=' + isSelected + '>' + data.name + '</li>';
										}).join('');
									$('.fz-options').html(arr ? arr : '<p style="margin-left:10px;color:#ccc">很抱歉 没有找到</p>');
								});
							}
							$('#ftpLogsTable .tootls_top .pull-right').append(span).append(html);
						},
					});
				}
			} else {
				var typeList = [
					{ title: '全部', value: 'all' },
					{ title: '上传', value: 'upload' },
					{ title: '下载', value: 'download' },
					{ title: '删除', value: 'delete' },
					{ title: '重命名', value: 'rename' },
				];
				table_logsOperation('all');

				function table_logsOperation(type) {
					$('#ftpLogsTable').empty();
					bt_tools.table({
						el: '#ftpLogsTable',
						default: '暂无日志信息',
						height: 350,
						url: '/ftp?action=' + logsArr[param.type][1],
						param: {
							user_name: that.username,
							type: type,
						},
						column: [
							{
								title: '用户名',
								type: 'text',
								width: 100,
								template: function () {
								return '<span>' + that.username + '</span>';
								},
							},
							{ fid: 'ip', title: '操作IP', type: 'text', width: 110 },
							{ fid: 'file', title: '文件', type: 'text', width: 240, fixed: true },
							{ fid: 'type', title: '操作类型', type: 'text', width: 75 },
							{ fid: 'time', title: '操作时间', type: 'text', width: 100 },
						],
						tootls: [
							{
								type: 'group',
								positon: ['left', 'top'],
								list: [
									{
										title: '刷新日志',
										active: true,
										event: function () {
											table_logsOperation(type);
										},
									},
								],
							},
							{
								type: 'search',
								positon: ['right', 'top'],
								placeholder: '请输入操作IP/文件/类型/时间',
								searchParam: 'search', //搜索请求字段，默认为 search
								value: '', // 当前内容,默认为空
							},
							{
								type: 'page',
								positon: ['right', 'bottom'], // 默认在右下角
								pageParam: 'p', //分页请求字段,默认为 : p
								page: 1, //当前分页 默认：1
							},
						],
						success: function () {
							if (!$('#ftpLogsTable .log_type').length) {
								var _html = '';
								$.each(typeList, function (index, item) {
									_html += '<option value="' + item.value + '">' + item.title + '</option>';
								});
								$('#ftpLogsTable .bt_search').before('<select class="bt-input-text mr5 log_type" style="width:110px" name="log_type">' + _html + '</select>');
								$('#ftpLogsTable .tootls_top .pull-right').append(span).append(html);
								$('#ftpLogsTable .log_type').val(type);
								$('#ftpLogsTable .log_type').change(function () {
									table_logsOperation($(this).val());
								});
						}
							if (!$('#ftpLogsTable .fz-wrapper').length) {
								$('#ftpLogsTable .tootls_top .pull-left').before(logs_ftp_html);
								$('#ftpLogsTable .tootls_top .pull-right').append(span).append(html);
								$('.fz-select-btn').click(function () {
									$('.fz-wrapper').toggleClass('fz-active');
									that.addFruit();
								});
								$('.fz-select-btn').find('span').text(that.username);
								$('.fz-input').on('keyup', function () {
									// console.log($(this).val());
									var arr = [];
									var searchWord = $(this).val().toLowerCase();
									arr = that.FTPList.filter(function (data) {
										return data.name.toLowerCase().startsWith(searchWord);
									})
										.map(function (data) {
											var isSelected = data.name == $('.fz-select-btn').find('span').text() ? 'selected' : ' ';
											return '<li onclick="logs.softwareLogs.updateName(this)"" class=' + isSelected + '>' + data.name + '</li>';
					})
										.join('');

									$('.fz-options').html(arr ? arr : '<p style="margin-top:10px">很抱歉 没有找到</p>');
								});
							}
						},
					});
				}
			}
		},
		/**
		 * @description 添加ftp搜索下拉选项
		 */
		addFruit: function () {
			var that = this;
			$('.fz-options').empty();
			that.FTPList.forEach(function (fruit) {
				var isSelected = fruit.name == that.username ? 'selected' : '';
				var li = '<li onclick="logs.softwareLogs.updateName(this)"" class=' + isSelected + '>' + fruit.name + '</li>';
				$('.fz-options').append(li);
			});
		},
		/**
		 * @description ftp搜索下拉选项的点击事件
		 */
		updateName: function (selectedLi) {
			var that = this;
			$('.fz-input').empty();
			that.addFruit();
			$('.fz-wrapper').removeClass('fz-active');
			that.username = $(selectedLi).text(); //将当前选择的ftp 用户名保存好
			that.getFtpLogs(that.ftpParam, that.username);
		},
		/**
		 * @description 存放获取的网站列表
		 */
		FTPList: '',
		/**
		 * @description 获取网站列表
		*/
		getFtpList: function (search, callback) {
			var that = this;
			$('#softwareFtp .Tab').empty();
			bt_tools.send(
				'/data?action=getData&table=ftps',
				{
					limit: 999999,
					p: 1,
					search: search ? search : '',
				},
				function (rdata) {
					that.FTPList = rdata.data;
						that.username = (rdata.data.length?rdata.data[0].name:'');
						// that.username = rdata.data[0].name;
				}
			);
		},
		pluginName: '', //左侧插件列表的
		/**
		 * @description 获取插件列表
		 */
		getSoftLogList: function (callback) {
			var that = this;
			$('#softwareFtp .Tab').empty();
			bt_tools.send({url:'/monitor/soft/soft_log_list'}, function (rdata) {
				if (rdata) {
					var _html_soft = '';
					$.each(rdata, function (index, item) {
						_html_soft += '<div class="Item' + (that.pluginName && that.pluginName === item ? 'active' : '') + '" title="' + item + '" data-pluginName="' + item + '">' + item + '</div>';
					});
					$('#softwareFtp .Tab').html(_html_soft);
					if (callback) callback(rdata);
				} else {
					$('#softwareLogs').append('<div data-v-b4c5b219="" class="software-mask"><div class="prompt_description">当前未安装任何软件,请添加软件</div></div>');
				}
			});
		},
		/**
		 * @description 用来存放php的是数据
		 */
		softPhp: '',
		_phpIndex: 0,
		/**
		 * @description 获取插件日志 nginx | php | mongodb | memcached | redis | apache
		 */
		getPlugLogs: function (name, search) {
			var that = this;
			var loadT = bt.load('正在获取日志，请稍后...');
			$.post('/monitor/soft/get_log', { data: JSON.stringify({ name: name, search: search }) }, function (rdata) {
				loadT.close();
				// 判断是否点击的是php  php 数据不同
				if (name == 'Php') {
					that.softPhp = rdata;
					if (!$('#softPhp .php_type').length) {
						var _phphtml = '';
						$.each(rdata, function (index, item) {
							_phphtml += '<option value="'+index+'">'+item.version+'</option>';
						});
						$('.phpselect').append('<select required style="width: 110px" name="log_type" class="bt-input-text mr5 php_type"></select>');
						$('#softPhp .php_type').append(_phphtml);
						$('#softPhp .php_type').change(function () {
							that._phpIndex = $(this).val();
							$('#softPhp .crontab-log').html('<code>' + bt.htmlEncode.htmlEncodeByRegExp(that.softPhp[that._phpIndex].msg ? that.softPhp[that._phpIndex].msg : '当前没有日志.'));
							var div = $('#softPhp .crontab-log');
							div.height(window.innerHeight - 330 + 'px');
							div.scrollTop(div.prop('scrollHeight'));
						});
						$('#softPhp .php_type').val(0).change();
					}
					$('#softPhp .crontab-log').html('<code>' + bt.htmlEncode.htmlEncodeByRegExp(that.softPhp[that._phpIndex].msg ? that.softPhp[that._phpIndex].msg : '当前没有日志.'));
					var div = $('#softPhp .crontab-log');
					div.height(window.innerHeight - 330 + 'px');
					div.scrollTop(div.prop('scrollHeight'));
				} else {
					$('#softwarePlugLogs .crontab-log').html('<code>' + bt.htmlEncode.htmlEncodeByRegExp(rdata['msg'] ? rdata.msg : rdata.length ? rdata.join('\n') : '当前没有日志.'));
					var div = $('#softwarePlugLogs .crontab-log');
					div.height(window.innerHeight - 330 + 'px');
					div.scrollTop(div.prop('scrollHeight'));
					$('#softwarePlugLogs .search-input').val('');
				}
			});
		},
		/**
		 * @description 获取Docker
		 */
		getDocker: function () {
			var that = this;
			bt_tools.table({
				el: '#DockerLogsTable',
				default: '暂无日志信息',
				height: 748,
				url: '/monitor/soft/get_docker_log?name=Docker',
				column: [
					{ fid: 'username', title: '用户', type: 'text', width: 110 },
					{ fid: 'log', title: '详情', type: 'text', width: 240 },
					{ fid: 'addtime', title: '操作时间', type: 'text', width: 100 },
				],
				tootls: [
					{
						type: 'group',
						positon: ['left', 'top'],
						list: [
							{
								title: '刷新日志',
								active: true,
								event: function () {
									that.getDocker();
								},
							},
						],
					},
					{
						type: 'search',
						positon: ['right', 'top'],
						placeholder: '请输入用户/时间',
						searchParam: 'search', //搜索请求字段，默认为 search
						value: '', // 当前内容,默认为空
					},
					{
						type: 'page',
						positon: ['right', 'bottom'], // 默认在右下角
						pageParam: 'p', //分页请求字段,默认为 : p
						page: 1, //当前分页 默认：1
					},
				],
				success: function () {},
			});
		},
		/**
		 * @description: 获取ftp日志开启状态
		 * @return {string} config
		 */
		getFtpLogsStatus: function (config) {
			var _that = this;
			bt_tools.send({ url: '/logs/ftp/set_ftp_log', data: { exec_name: config } }, function (res) {
				if (res.msg == 'stop') {
					//出现遮盖层
					$('.mask_layer').show().html('<div class="prompt_description"><i class="prompt-note">!</i>当前未开启FTP日志功能<a href="javascript:;" class="btlink open_ftp_log">点击开启</a></div>');
					$('.open_ftp_log').click(function () {
						_that.getFtpLogsStatus('start');
					})
				} else {
					$('.mask_layer').hide();
					if(config == 'start'){
						bt_tools.msg('开启成功', 1);
					}
				}
			});
		},
	},
	/**
	 * @description 渲染日志分页
	 * @param pages
	 * @param p
	 * @param num
	 * @returns {string}
	*/
	renderLogsPages:function(pages,p,num){
		return (num >= pages?'<a class="nextPage" data-page="1">首页</a>':'') + (p !== 1?'<a class="nextPage" data-page="'+ (p-1) +'">上一页</a>':'') + (pages <= num?'<a class="nextPage" data-page="'+ (p+1) +'">下一页</a>':'')+'<span class="Pcount">第 '+ p +' 页</span>';
	}
}
logs.event();

//面板操作日志分页切换
function getLogs(page) {
	logs.panelLogs.getLogs(page, $('#operationLog .search_input').val());
}

//渲染运行日志的输入款搜索模块
function renderRunningSearch() {
	$('.search-icon').remove();
	var input = document.createElement('input');
	input.classList.add('input-search');
	input.setAttribute('type', 'text');
	input.setAttribute('placeholder', '请输入你要搜索的内容');
	// $(input).css({ width: '230px', height: '30px',"font-size":"12px","line-height": "30px","border-radius": "2px","border": "1px solid #DCDFE6",outline:"none" ,"padding-left": "8px","vertical-align": "top",float:'right'});
	$(input).insertAfter('.refreshRunLogs');
	var span = document.createElement('span');
	span.classList.add('search-icon');
	$(span).insertAfter('input');
	$(input).keydown(eventHandle);
	$('.search-icon')[1].onclick = eventHandle;
}

//关键字搜索事件处理函数
function eventHandle(e) {
	var val = $('.input-search').val().trim();

	if (!e.target.classList.contains('search-icon')) {
		if ( e.keyCode !== 13) return;
	}

	var loadT = layer.msg('正在过滤搜索，请稍侯...', {
		icon: 16,
		time: 0,
		shade: 0.3,
	});
	bt_tools.send({ url: '/logs/panel/get_error_logs_by_search', data: { search: val } }, function (data) {
		data = data.join('\n');
		layer.close(loadT);
		$('#errorLog .crontab-log').empty();
		$('#errorLog .crontab-log').html('<code>' + bt.htmlEncode.htmlEncodeByRegExp(data) + '</code>');
	});
}

/**
 * ip属地查询渲染的表格
 * @param {Object} event 当前的事件对象
 * @param {Object} that  全局的that实例（上面有开发者编写的代码）
 */
function renderIPQueryTable(event, that) {
	var loadT = layer.msg('正在查询，请稍侯...', {
		icon: 16,
		time: 0,
		shade: 0.3,
	});
	$.get('/logs/panel/IP_geolocation', function (res) {
		//降序排序
		res.sort(function (a,b) {return b["operation_num"]-a["operation_num"]})
		layer.close(loadT);
		bt_tools.open({
			title: 'IP操作统计',
			area: ["620px", "380px"],
			btn: false,
			content:'<div class="pd15"><div id="ipConfigInfo"></div></div>',
			success: function () {
				// console.log('res>>>',res);
				bt_tools.table({
					el: '#ipConfigInfo',
					data: res,
					default: '暂无数据',
					height:"284px",
					column: [
						{ fid: 'ip', title: 'IP地址' },
						{ fid: 'info', title: 'IP属地' },
						{ fid: 'operation_num', title: '操作次数' ,align:'center'},
					],
				});
			},
		});
	});
}
