function CreateWebsiteModel(config) {
	this.type = config.type;
	this.tips = config.tips;
	this.methods = {
		createProject: ['create_project', '创建' + config.tips + '项目'],
		modifyProject: ['modify_project', '修改' + config.tips + '项目'],
		removeProject: ['remove_project', '删除' + config.tips + '项目'],
		startProject: ['start_project', '启动' + config.tips + '项目'],
		stopProject: ['stop_project', '停止' + config.tips + '项目'],
		restartProject: ['restart_project', '重启' + config.tips + '项目'],
		getProjectInfo: ['get_project_info', '获取' + config.tips + '项目信息'],
		getProjectDomain: ['project_get_domain', '获取' + config.tips + '项目域名'],
		addProjectDomain: ['project_add_domain', '添加' + config.tips + '项目域名'],
		removeProjectDomain: [
			'project_remove_domain',
			'删除' + config.tips + '项目域名',
		],
		getProjectLog: ['get_project_log', '获取' + config.tips + '项目日志'],
		change_log_path: ['change_log_path', '修改' + config.tips + '项目日志路径'],
		get_log_split: ['get_log_split', '获取' + config.tips + '项目日志切割任务'],
		mamger_log_split: ['mamger_log_split', '设置' + config.tips + '项目日志切割任务'],
		set_log_split: ['set_log_split', '设置' + config.tips + '项目日志切割状态'],
		bindExtranet: ['bind_extranet', '开启外网映射'],
		unbindExtranet: ['unbind_extranet', '关闭外网映射'],
	};
	this.bindHttp(); //将请求映射到对象
	this.reanderProjectList(); // 渲染列表
}
/**
 * @description 渲染获取项目列表
 */
CreateWebsiteModel.prototype.reanderProjectList = function () {
	var _that = this;
	$('#bt_' + this.type + '_table').empty();
	site.model_table = bt_tools.table({
		el: '#bt_' + this.type + '_table',
		url: '/project/' + _that.type + '/get_project_list',
		minWidth: '1000px',
		autoHeight: true,
		default: '项目列表为空', //数据为空时的默认提示\
		load: '正在获取' + _that.tips + '项目列表，请稍候...',
		pageName: 'nodejs',
		beforeRequest: function (params) {
			if (params.hasOwnProperty('data') && typeof params.data === 'string') {
				var oldParams = JSON.parse(params['data']);
				delete params['data'];
				return { data: JSON.stringify($.extend(oldParams, params)) };
			}
			return { data: JSON.stringify(params) };
		},
		sortParam: function (data) {
			return { order: data.name + ' ' + data.sort };
		},
		column: [
			{ type: 'checkbox', class: '', width: 20 },
			{
				fid: 'name',
				title: '项目名称',
				type: 'link',
				event: function (row, index, ev) {
					_that.reanderProjectInfoView(row);
				},
			},
			{
				fid: 'run',
				title: '服务状态',
				width: 80,
				// config: {
				// 	icon: true,
				// 	list: [
				// 		[true, '运行中', 'bt_success', 'glyphicon-play'],
				// 		[false, '未启动', 'bt_danger', 'glyphicon-pause'],
				// 	],
				// },
				// type: 'status',
				template: function (row) {
					return '<a class="btlink '+ (row.run ? 'bt_success':'bt_danger') +' status_tips" data-project="'+ row.id +'" data-name="'+ row.name +'" data-type="'+ _that.tips.toLowerCase() +'" data-status="'+ row.run +'" href="javascript:;">\
						<span>'+ (row.run ? '运行中':'未启动') +'</span>\
						<span class="glyphicon '+ (row.run ? 'glyphicon-play':'glyphicon-pause') +'"></span>\
					</a>'
				},
				event: function (row, index, ev, key, that) {
					var status = row.run;
					bt.confirm(
						{
							title: status ? '停止项目' : '启动项目',
							msg: status
								? '停止项目后，当前项目服务将停止运行，继续吗？'
								: '启用' + _that.tips + '项目[' + row.name + '],继续操作?',
						},
						function (index) {
							layer.close(index);
							_that[status ? 'stopProject' : 'startProject'](
								{ project_name: row.name },
								function (res) {
									bt.msg({
										status: res.status,
										msg: res.data || res.error_msg,
									});
									that.$refresh_table_list(true);
								}
							);
						}
					);
				},
			},
			{
				fid: 'run_port',
				title: '运行端口',
				template: function (row) {
					return '<span>' + (row.listen.join('、') || '--') + '<span>';
				},
			},
			{
				fid: 'path',
				title: '根目录',
			 width:220,
				type: 'link',
				event:function(row,index,ev){
						openPath(row.path)
				},
			},{
				// title: '<span style="display:flex"><span onclick="bt.soft.product_pay_view({ totalNum: 67, limit: \'ltd\', closePro: true })" class="firwall_place_of_attribution"></span>目录详情</span>',
				title: '目录详情',
				width:120,
				type: 'text',
				template:function(row,index,ev){
          return bt.files.dir_details_span(row.path);
				},
			},
			{
				fid: 'ps',
				title: '备注',
				type: 'input',
				blur: function (row, index, ev, key, that) {
					if (row.ps == ev.target.value) return false;
					bt.pub.set_data_ps(
						{ id: row.id, table: 'sites', ps: ev.target.value },
						function (res) {
							bt_tools.msg(res, { is_dynamic: true });
						}
					);
				},
				keyup: function (row, index, ev) {
					if (ev.keyCode === 13) {
						$(this).blur();
					}
				},
			},
			{
				fid: 'ssl',
				title: 'SSL证书',
				tips: '部署证书',
				width: 100,
				type: 'text',
				template: function (row, index) {
					var _ssl = row.ssl,
						_info = '',
						_arry = [
							['issuer', '证书品牌'],
							['notAfter', '到期日期'],
							['notBefore', '申请日期'],
							['dns', '可用域名'],
						];
					try {
						if (typeof row.ssl.endtime != 'undefined') {
							if (row.ssl.endtime < 1) {
								return '<a class="btlink bt_danger" href="javascript:;">已过期</a>';
							}
						}
					} catch (error) {}
					for (var i = 0; i < _arry.length; i++) {
						var item = _ssl[_arry[i][0]];
						_info +=
							_arry[i][1] + ':' + item + (_arry.length - 1 != i ? '\n' : '');
					}
					return row.ssl === -1
						? '<a class="btlink bt_warning" href="javascript:;">未部署</a>'
						: '<a class="btlink ' +
								(row.ssl.endtime < 7 ? 'bt_danger' : '') +
								'" href="javascript:;" title="' +
								_info +
								'">剩余' +
								row.ssl.endtime +
								'天</a>';
				},
				event: function (row) {
					_that.reanderProjectInfoView(row);
					setTimeout(function () {
						$('.site-menu p:eq(5)').click();
					}, 500);
				},
			},
			{
				title: '操作',
				type: 'group',
				width: 100,
				align: 'right',
				group: [
					{
						title: '设置',
						event: function (row, index, ev, key, that) {
							_that.reanderProjectInfoView(row);
						},
					},
					{
						title: '删除',
						event: function (row, index, ev, key, that) {
							bt.prompt_confirm(
								'删除项目',
								'您正在删除' + _that.tips + '项目-[' + row.name + ']，继续吗？',
								function () {
									_that.removeProject(
										{ project_name: row.name },
										function (res) {
											bt.msg({
												status: res.status,
												msg: res.data || res.error_msg,
											});
											site.model_table.$refresh_table_list(true);
										}
									);
								}
							);
						},
					},
				],
			},
		],
		// 渲染完成
		tootls: [
			{
				// 按钮组
				type: 'group',
				positon: ['left', 'top'],
				list: [
					{
						title: '添加' + _that.tips + '项目',
						active: true,
						event: function (ev) {
							_that.reanderAddProject(function () {
								site.model_table.$refresh_table_list(true);
							});
						},
					},
				],
			},
			{
				// 搜索内容
				type: 'search',
				positon: ['right', 'top'],
				placeholder: '请输入项目名称或备注',
				searchParam: 'search', //搜索请求字段，默认为 search
				value: '', // 当前内容,默认为空
			},
			{
				// 批量操作
				type: 'batch', //batch_btn
				positon: ['left', 'bottom'],
				placeholder: '请选择批量操作',
				buttonValue: '批量操作',
				disabledSelectValue: '请选择需要批量操作的站点!',
				selectList: [
					{
						title: "部署证书",
						callback: function (that) {
						  site.set_ssl_cert(that)
						}
					},{
						title: '删除项目',
						url: '/project/' + _that.type + '/remove_project',
						param: function (row) {
							return {
								data: JSON.stringify({ project_name: row.name }),
							};
						},
						refresh: true,
						callback: function (that) {
							bt.prompt_confirm(
								'批量删除项目',
								'您正在删除选中的' + _that.tips + '项目，继续吗？',
								function () {
									that.start_batch({}, function (list) {
										var html = '';
										for (var i = 0; i < list.length; i++) {
											var item = list[i];
											html +=
												'<tr><td><span>' +
												item.name +
												'</span></td><td><div style="float:right;"><span style="color:' +
												(item.requests.status ? '#20a53a' : 'red') +
												'">' +
												(item.requests.status
													? item.requests.data
													: item.requests.error_msg) +
												'</span></div></td></tr>';
										}
										site.model_table.$batch_success_table({
											title: '批量删除项目',
											th: '项目名称',
											html: html,
										});
										site.model_table.$refresh_table_list(true);
									});
								}
							);
						},
					},
				],
			},
			{
				//分页显示
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
			},
		],
		success: function () {
			if(site.model_table){
				var elTable = site.model_table.config.el
				if($(elTable+' .tootls_top .pull-left .bt-desired').length === 0){
					$(elTable+' .tootls_top .pull-left').append('<span class="bt-desired ml10" style="background-size:contain;"><a href="javascript:;" class="btlink ml5 npsFeedback">需求反馈</a></span>')
					// 网站nps入口
					$('.npsFeedback').on('click',function(){
						bt_tools.nps({name:'网站',type:14})
					})
				}
			}
			// 服务状态事件
			site.server_status_event()
			// 详情事件
			bt.files.dir_details()
		}
	});
};

/**
 * @description 获取添加项目配置
 */
CreateWebsiteModel.prototype.getAddProjectConfig = function (data) {
	var that = this,
		data = data || {},
		config = [
			{
				label: '项目执行文件',
				formLabelWidth: '110px',
				must: '*',
				group: {
					type: 'text',
					width: '400px',
					value: '',
					name: 'project_exe',
					placeholder: '请选择项目可执行文件',
					icon: {
						type: 'glyphicon-folder-open',
						select: 'file',
						event: function (ev) {},
						callback: function (path) {
							var pathList = path.split('/');
							var filename = pathList[pathList.length - 2];
							var project_command_config = this.config.form[3],
								project_name_config = this.config.form[1],
								project_ps_config = this.config.form[6];
							project_name_config.group.value = filename;
							project_command_config.group.value = path;
							if (data.type != 'edit') {
								project_ps_config.group.value = filename;
								this.$replace_render_content(6);
							}
							this.$replace_render_content(3);
							this.$replace_render_content(1);
						},
					},
					verify: function (val) {
						if (val === '') {
							bt.msg({ msg: '请选择项目可执行文件', status: false });
							return false;
						}
					},
				},
			},
			{
				label: '项目名称',
				formLabelWidth: '110px',
				must: '*',
				group: {
					type: 'text',
					name: 'project_name',
					width: '400px',
					placeholder: '请输' + that.tips + '项目名称',
					disabled: data.type != 'edit' ? false : true,
					input: function (formData, formElement, formConfig) {
						var project_ps_config = formConfig.config.form[6];
						project_ps_config.group.value = formData.project_name;
						formConfig.$replace_render_content(6);
					},
					verify: function (val) {
						if (val === '') {
							bt.msg({ msg: '请输入项目名称', status: false });
							return false;
						}
					},
				},
			},
			{
				label: '项目端口',
				formLabelWidth: '110px',
				must: '*',
				group: [{
					type: 'number',
					name: 'port',
					class: 'port_input',
					width: '220px',
					placeholder: '请输入项目的真实端口',
					verify: function (val) {
						if (val === '') {
							bt.msg({ msg: '请输入项目端口', status: false });
							return false;
						}
					},
					change: function (form, value, val, field) {
						setTimeout(function () {//延迟校验端口,解决点击放行端口无效问题
							if(form.port !== '') {
								bt_tools.send({url:'/project/'+ that.type + '/' + 'advance_check_port',data:{port:form.port}},function(res){
									if (!res.status){
										$('.port_input').val('')
										bt_tools.msg({status:false,msg:res.msg})
									}
								},{load:'正在校验端口',verify:false})
							}
						},500)
					}
				},{
					type: 'checkbox',
					class: 'port_check',
					name: 'release_firewall',
					width: '220px',
					display: data.type == 'edit' ? false : true,
					title: '放行端口<a class="bt-ico-ask">?</a>'
				}],
			},
			{
				label: '执行命令',
				formLabelWidth: '110px',
				must: '*',
				group: {
					type: 'text',
					name: 'project_cmd',
					width: '400px',
					placeholder: '请输入项目执行的命令',
					value: '',
					verify: function (val) {
						if (val === '') {
							bt.msg({ msg: '请输入执行命令', status: false });
							return false;
						}
					},
				},
			},
			{
				label: '运行用户',
				formLabelWidth: '110px',
				group: {
					type: 'select',
					name: 'run_user',
					width: '150px',
					unit: '* 无特殊需求请选择www用户',
					list: [
						{ title: 'www', value: 'www' },
						{ title: 'root', value: 'root' },
					],
					tips: '',
				},
			},
			{
				label: '开机启动',
				formLabelWidth: '110px',
				group: {
					type: 'checkbox',
					name: 'is_power_on',
					title: '是否开启启动项目'+(this.tips === 'Go' ? '（默认自带守护进程每120秒检测一次）':''),
				},
			},
			{
				label: '备注',
				formLabelWidth: '110px',
				group: {
					type: 'text',
					name: 'project_ps',
					width: '400px',
					placeholder: '请输入项目备注',
					value: '',
				},
			},
			{
				label: '绑定域名',
				formLabelWidth: '110px',
				group: {
					type: 'textarea', //当前表单的类型 支持所有常规表单元素、和复合型的组合表单元素
					name: 'domains', //当前表单的name
					style: { width: '400px', height: '120px', 'line-height': '22px' },
					tips: {
						//使用hover的方式显示提示
						text: '<span>如果需要绑定外网，请输入需要绑定的域名，该选项可为空</span><br>如需填写多个域名，请换行填写，每行一个域名，默认为80端口<br>泛解析添加方法 *.domain.com<br>如另加端口格式为 www.domain.com:88',
						style: { top: '10px', left: '15px' },
					},
				},
			},
			{
				formLabelWidth: '25px',
				group: {
					type: 'help',
					list: [
						'执行命令：请输入项目需要携带的参数，默认请输入执行文件名',
						'项目教程可参考：<a href="https://www.bt.cn/bbs/thread-93034-1-1.html" target="_blank" class="btlink">https://www.bt.cn/bbs/thread-93034-1-1.html</a>',
					],
				},
			},
		];

	if (data.type == 'edit') {
		config.splice(7, 2);
		config.push({
			formLabelWidth: '110px',
			group: {
				type: 'button',
				name: 'submitForm',
				title: '保存配置',
				event: function (fromData) {
					// 编辑项目
					fromData.is_power_on = fromData.is_power_on ? 1 : 0;
					if (parseInt(fromData.port) < 0 || parseInt(fromData.port) > 65535) return layer.msg('项目端口号应为[0-65535]',{icon:2})
					that.modifyProject(fromData, function (res) {
						bt.msg({ status: res.status, msg: res.data });
						that.simulatedClick(0);
					});
				},
			},
		});
	}
	return config;
};

/**
 * @description 渲染添加项目表单
 */
CreateWebsiteModel.prototype.reanderAddProject = function (callback) {
	var that = this;
	var modelForm = bt_tools.open({
		title: '添加' + this.tips + '项目',
		area: '620px',
		btn: ['提交', '取消'],
		content: {
			class: 'pd30',
			formLabelWidth: '120px',
			form: (function () {
				return that.getAddProjectConfig();
			})(),
		},
		yes: function (formData, indexs, layero) {
			if (formData.domains !== '') {
				var arry = formData.domains.replace('\n', '').split('\r'),
					newArry = [];
				for (var i = 0; i < arry.length; i++) {
					var item = arry[i];
					if (bt.check_domain_port(item)) {
						newArry.push(item.indexOf(':') > -1 ? item : item + ':80');
					} else {
						bt.msg({ status: false, msg: '【' + item + '】 绑定域名格式错误' });
						return false;
					}
				}
				formData.bind_extranet = 1;
				formData.domains = newArry;
			} else {
				formData.bind_extranet = 0;
				delete formData.domains;
			}
			formData.is_power_on = formData.is_power_on ? 1 : 0;
			if (parseInt(formData.port) < 0 || parseInt(formData.port) > 65535) return layer.msg('项目端口格式错误，可用范围：1-65535',{icon:2})
			that.createProject(formData, function (res) {
				if (res.status) {
					layer.close(indexs);
					if (callback) callback(res);
				}
				layer.msg(res.data, { icon: res.status ? 1 : 2,shade: [0.3, '#000'],shadeClose: true,time: 0 });
			});
		},
	});
	layer.ready(function () {
		$('.port_check .bt-ico-ask').hover(function () {
			layer.tips('选中将在防火墙安全组放行监听端口，放行后该项目可在外网访问', $(this), { tips: [2, '#20a53a'],time: 0})
		},function () {
			layer.closeAll('tips')
		})
	})
	return modelForm;
};

/**
 * @description 模拟点击
 */
CreateWebsiteModel.prototype.simulatedClick = function (num) {
	$('.bt-w-menu p:eq(' + num + ')').click();
};

/**
 * @description
 * @param {string} name 站点名称
 */
CreateWebsiteModel.prototype.reanderProjectInfoView = function (row) {
	var that = this;
	bt.open({
		type: 1,
		title:
			this.tips + '项目管理-[' + row.name + ']，添加时间[' + row.addtime + ']',
		skin: 'model_project_dialog',
		area: ['780px', '740px'],
		content:
			'<div class="bt-tabs">' +
			'<div class="bt-w-menu site-menu pull-left"></div>' +
			'<div id="webedit-con" class="bt-w-con pd15" style="height:100%">' +
			'</div>' +
			'<div class="mask_module hide" style="left:110px;"><div class="node_mask_module_text">请开启<a href="javascript:;" class="btlink mapExtranet" onclick="site.node.simulated_click(2)"> 外网映射 </a>后查看配置信息</div></div>' +
			'</div>',
		btn: false,
		success: function (layers) {
			var $layers = $(layers),
				$content = $layers.find('#webedit-con');

			function reander_tab_list(config) {
				for (var i = 0; i < config.list.length; i++) {
					var item = config.list[i],
						tab = $(
							'<p class="' + (i === 0 ? 'bgw' : '') + '">' + item.title + '</p>'
						);
					$(config.el).append(tab);
					(function (i, item) {
						tab.on('click', function (ev) {
							$('.mask_module').addClass('hide');
							$(this).addClass('bgw').siblings().removeClass('bgw');
							if ($(this).hasClass('bgw')) {
								that.getProjectInfo({ project_name: row.name }, function (res) {
									config.list[i].event.call(that, $content, res, ev);
								});
							}
						});
						if (item.active) tab.click();
					})(i, item);
				}
			}
			reander_tab_list(
				{
					el: $layers.find('.bt-w-menu'),
					list: [
						{
							title: '项目配置',
							active: true,
							event: that.reanderProjectConfigView,
						},
						{
							title: '域名管理',
							event: that.reanderDomainManageView,
						},
						{
							title: '外网映射',
							event: that.reanderProjectMapView,
						},
						{
							title: '伪静态',
							event: that.reanderProjectRewriteView,
						},
						{
							title: '配置文件',
							event: that.reanderFileConfigView,
						},
						{
							title: 'SSL',
							event: that.reanderProjectSslView,
						},
						{
							title: '负载状态',
							event: that.reanderServiceCondition,
						},
						{
							title: '服务状态',
							event: that.reanderServiceStatusView,
						},
						{
							title: '项目日志',
							event: that.reanderProjectLogsView,
						},
						{
							title: '网站日志',
							event: that.reanderSiteLogsView,
						},
					],
				},
				function (config, i, ev) {}
			);
		},
	});
};

/**
 * @description 绑定请求
 */
CreateWebsiteModel.prototype.bindHttp = function () {
	var that = this;
	for (const item in this.methods) {
		if (Object.hasOwnProperty.call(this.methods, item)) {
			const element = that.methods[item];
			(function (element) {
				CreateWebsiteModel.prototype[item] = function (param, callback) {
					bt_tools.send(
						{
							url: '/project/' + that.type + '/' + element[0],
							data: { data: JSON.stringify(param) },
						},
						function (data) {
							if (callback) callback(data);
						},
						{ load: element[1] }
					);
				};
			})(element);
		}
	}
};

/**
 * @description 项目配置
 * @param {object} row 项目信息
 */
CreateWebsiteModel.prototype.reanderProjectConfigView = function (el, row) {
	var that = this,
		projectConfig = row.project_config,
		param = $.extend(projectConfig, { project_ps: row.ps, listen:row.listen });
	bt_tools.form({
		el: '#webedit-con',
		data: param,
		class: 'ptb15',
		form: that.getAddProjectConfig({ type: 'edit' }),
	});
	setTimeout(function () {
		$('[name="project_cmd"]').val(param.project_cmd);
	},50)
	if (row.listen.length && !(row.listen.indexOf(parseInt($('input[name=port]').val())) > -1)) {
		$('.error_port').remove()
		$('input[name=port]').next().after('<div class="error_port" style="margin-top: 10px;color: red;">项目端口可能有误，检测到当前项目监听了以下端口'+ row.listen +'</div>')
	}
};

/**
 * @description 域名管理
 * @param {object} row 项目信息
 */
CreateWebsiteModel.prototype.reanderDomainManageView = function (el, row) {
	var that = this,
		list = [
			{
				class: 'mb0',
				items: [
					{
						name: 'modeldomain',
						width: '340px',
						type: 'textarea',
						placeholder:
							'如果需要绑定外网，请输入需要映射的域名，该选项可为空<br>多个域名，请换行填写，每行一个域名，默认为80端口<br>泛解析添加方法 *.domain.com<br>如另加端口格式为 www.domain.com:88',
					},
					{
						name: 'btn_model_submit_domain',
						text: '添加',
						type: 'button',
						callback: function (sdata) {
							var arrs = sdata.modeldomain.split('\n');
							var domins = [];
							for (var i = 0; i < arrs.length; i++) domins.push(arrs[i]);
							if (domins[0] == '')
								return layer.msg('域名不能为空', { icon: 0 });
							that.addProjectDomain(
								{ project_name: row.name, domains: domins },
								function (res) {
									if (typeof res.status == 'undefined') {
										$('[name=modeldomain]').val('');
										$('.placeholder').css('display', 'block');
										site.render_domain_result_table(res)
										project_domian.$refresh_table_list(true);
									}else{
										bt.msg({
											status: res.status,
											msg: res.msg || res.error_msg,
										});
									}
								}
							);
						},
					},
				],
			},
		];
	var _form_data = bt.render_form_line(list[0]),
		loadT = null,
		placeholder = null;
	el.html(_form_data.html + '<div id="project_domian_list"></div>');
	bt.render_clicks(_form_data.clicks);
	// domain样式
	$('.btn_model_submit_domain')
		.addClass('pull-right')
		.css('margin', '30px 35px 0 0');
	$('textarea[name=modeldomain]').css('height', '120px');
	placeholder = $('.placeholder');
	placeholder
		.click(function () {
			$(this).hide();
			$('.modeldomain').focus();
		})
		.css({
			width: '340px',
			heigth: '120px',
			left: '0px',
			top: '0px',
			'padding-top': '10px',
			'padding-left': '15px',
		});
	$('.modeldomain')
		.focus(function () {
			placeholder.hide();
			loadT = layer.tips(placeholder.html(), $(this), {
				tips: [1, '#20a53a'],
				time: 0,
				area: $(this).width(),
			});
		})
		.blur(function () {
			if ($(this).val().length == 0) placeholder.show();
			layer.close(loadT);
		});
	var project_domian = bt_tools.table({
		el: '#project_domian_list',
		url: '/project/' + that.type + '/project_get_domain',
		default: '暂无域名列表',
		param: { project_name: row.name },
		height: 375,
		beforeRequest: function (params) {
			if (params.hasOwnProperty('data') && typeof params.data === 'string')
				return params;
			return { data: JSON.stringify(params) };
		},
		column: [
			{ type: 'checkbox', class: '', width: 20 },
			{
				fid: 'name',
				title: '域名',
				type: 'text',
				template: function (row) {
					return (
						'<a href="http://' +
						row.name +
						':' +
						row.port +
						'" target="_blank" class="btlink">' +
						row.name +
						'</a>'
					);
				},
			},
			{
				fid: 'port',
				title: '端口',
				type: 'text',
			},
			{
				title: '操作',
				type: 'group',
				width: '100px',
				align: 'right',
				group: [
					{
						title: '删除',
						template: function (row, that) {
							return that.data.length === 1 ? '<span>不可操作</span>' : '删除';
						},
						event: function (rowc, index, ev, key, rthat) {
							if (ev.target.tagName == 'SPAN') return;
							if (rthat.data.length === 1) {
								return bt.msg({ status: false, msg: '最后一个域名不能删除!' });
							}
							that.removeProjectDomain(
								{ project_name: row.name, domain: rowc.name + ':' + rowc.port },
								function (res) {
									bt.msg({
										status: res.status,
										msg: res.data || res.error_msg,
									});
									rthat.$refresh_table_list(true);
								}
							);
						},
					},
				],
			},
		],
		tootls: [
			{
				// 批量操作
				type: 'batch',
				positon: ['left', 'bottom'],
				placeholder: '请选择批量操作',
				buttonValue: '批量操作',
				disabledSelectValue: '请选择需要批量操作的站点!',
				selectList: [
					{
						title: '删除域名',
						load: true,
						url: '/project/' + that.type + '/project_remove_domain',
						param: function (crow) {
							return {
								data: JSON.stringify({
									project_name: row.name,
									domain: crow.name + ':' + crow.port,
								}),
							};
						},
						callback: function (that) {
							// 手动执行,data参数包含所有选中的站点
							bt.show_confirm(
								'批量删除域名',
								"<span style='color:red'>同时删除选中的域名，是否继续？</span>",
								function () {
									var param = {};
									that.start_batch(param, function (list) {
										var html = '';
										for (var i = 0; i < list.length; i++) {
											var item = list[i];
											html +=
												'<tr><td>' +
												item.name +
												'</td><td><div style="float:right;"><span style="color:' +
												(item.request.status ? '#20a53a' : 'red') +
												'">' +
												(item.request.status ? '成功' : '失败') +
												'</span></div></td></tr>';
										}
										project_domian.$batch_success_table({
											title: '批量删除',
											th: '删除域名',
											html: html,
										});
										project_domian.$refresh_table_list(true);
									});
								}
							);
						},
					},
				],
			},
		],
	});
	setTimeout(function () {
		$(el).append(
			'<ul class="help-info-text c7">' +
				'<li>如果您的是HTTP项目，且需要映射到外网，请至少绑定一个域名</li>' +
				'<li>建议所有域名都使用默认的80端口</li>' +
				'</ul>'
		);
	}, 100);
};

/**
 * @description 渲染项目外网映射
 * @param el {object} 当前element节点
 * @param row {object} 当前项目数据
 */
CreateWebsiteModel.prototype.reanderProjectMapView = function (el, row) {
	var that = this;
	el.html(
		'<div class="pd15"><div class="ss-text mr50" style="display: block;height: 35px;">' +
			'   <em title="外网映射">外网映射</em>' +
			'       <div class="ssh-item">' +
			'           <input class="btswitch btswitch-ios" id="model_project_map" type="checkbox">' +
			'           <label class="btswitch-btn" for="model_project_map" name="model_project_map"></label>' +
			'       </div>' +
			'</div><ul class="help-info-text c7"><li>如果您的是HTTP项目，且需要外网通过80/443访问，请开启外网映射</li><li>开启外网映射前，请到【域名管理】中至少添加1个域名</li></ul></div>'
	);
	$('#model_project_map').attr(
		'checked',
		row['project_config']['bind_extranet'] ? true : false
	);
	$('[name=model_project_map]').click(function () {
		var _check = $('#model_project_map').prop('checked'),
			param = { project_name: row.name };
		if (!_check) param['domains'] = row['project_config']['domains'];
		layer.confirm(
			'是否确认' + (!_check ? '开启' : '关闭') + '外网映射！,是否继续',
			{
				title: '外网映射',
				icon: 0,
				closeBtn: 2,
				cancel: function () {
					$('#model_project_map').attr('checked', _check);
				},
			},
			function () {
				that[_check ? 'unbindExtranet' : 'bindExtranet'](param, function (res) {
					if (!res.status) $('#model_project_map').attr('checked', _check);
					bt.msg({
						status: res.status,
						msg: typeof res.data != 'string' ? res.error_msg : res.data,
					});
					row['project_config']['bind_extranet'] = _check ? 0 : 1;
				});
			},
			function () {
				$('#model_project_map').attr('checked', _check);
			}
		);
	});
};

/**
 * @description 渲染项目伪静态视图
 * @param el {object} 当前element节点
 * @param row {object} 当前项目数据
 */
CreateWebsiteModel.prototype.reanderProjectRewriteView = function (el, row) {
	el.empty();
	if (row.project_config.bind_extranet === 0) {
		$('.mask_module')
			.removeClass('hide')
			.find('.node_mask_module_text:eq(1)')
			.hide()
			.prev()
			.show();
		return false;
	}
	site.edit.get_rewrite_list({ name: this.type + '_' + row.name }, function () {
		$('.webedit-box .line:first').remove();
		$('[name=btn_save_to]').remove();
		$('.webedit-box .help-info-text li:first').remove();
	});
};

/**
 * @description 渲染项目配置文件
 * @param el {object} 当前element节点
 * @param row {object} 当前项目数据
 */
CreateWebsiteModel.prototype.reanderFileConfigView = function (el, row) {
	el.empty();
	if (row.project_config.bind_extranet === 0) {
		$('.mask_module')
			.removeClass('hide')
			.find('.node_mask_module_text:eq(1)')
			.hide()
			.prev()
			.show();
		return false;
	}
	site.edit.set_config({ name: this.type + '_' + row.name });
};

/**
 * @description 渲染项目使用情况
 * @param el {object} 当前element节点
 * @param row {object} 当前项目数据
 */
CreateWebsiteModel.prototype.reanderServiceCondition = function (el, row) {
	CreateWebsiteModel.prototype.getProjectInfo({ project_name: row.name,has_load_info:1 }, function (res) {
		if (!row.run) {
			el.html('').next().removeClass('hide');
			if (el.next().find('.node_mask_module_text').length === 1) {
				el.next()
					.find('.node_mask_module_text')
					.hide()
					.parent()
					.append(
						'<div class="node_mask_module_text">请先启动服务后重新尝试，<a href="javascript:;" class="btlink" onclick="site.node.simulated_click(7)">设置服务状态</a></div'
					);
			} else {
				el.next().find('.node_mask_module_text:eq(1)').show().prev().hide();
			}
			return false;
		}
		el.html(
			'<div class="line" style="padding-top: 0;"><span class="tname" style="width: 30px;text-align:left;padding-right: 5px;">PID</span><div class="info-r"><select class="bt-input-text mr5" name="node_project_pid"></select></div></div><div class="node_project_pid_datail"></div>'
		);
		var _option = '',
			tabelCon = '';
		for (var load in res.load_info) {
			if (res.load_info.hasOwnProperty(load)) {
				_option += '<option value="' + load + '">' + load + '</option>';
			}
		}
		var node_pid = $('[name=node_project_pid]');
		node_pid.html(_option);
		node_pid
			.change(function () {
				var _pid = $(this).val(),
					rdata = res['load_info'][_pid],
					fileBody = '',
					connectionsBody = '';
				for (var i = 0; i < rdata.open_files.length; i++) {
					var itemi = rdata.open_files[i];
					fileBody +=
						'<tr>' +
						'<td>' +
						itemi['path'] +
						'</td>' +
						'<td>' +
						itemi['mode'] +
						'</td>' +
						'<td>' +
						itemi['position'] +
						'</td>' +
						'<td>' +
						itemi['flags'] +
						'</td>' +
						'<td>' +
						itemi['fd'] +
						'</td>' +
						'</tr>';
				}
				for (var k = 0; k < rdata.connections.length; k++) {
					var itemk = rdata.connections[k];
					connectionsBody +=
						'<tr>' +
						'<td>' +
						itemk['client_addr'] +
						'</td>' +
						'<td>' +
						itemk['client_rport'] +
						'</td>' +
						'<td>' +
						itemk['family'] +
						'</td>' +
						'<td>' +
						itemk['fd'] +
						'</td>' +
						'<td>' +
						itemk['local_addr'] +
						'</td>' +
						'<td>' +
						itemk['local_port'] +
						'</td>' +
						'<td>' +
						itemk['status'] +
						'</td>' +
						'</tr>';
				}

				//     tabelCon = reand_table_config([
				//         [{"名称":rdata.name},{"PID":rdata.pid},{"状态":rdata.status},{"父进程":rdata.ppid}],
				//         [{"用户":rdata.user},{"Socket":rdata.connects},{"CPU":rdata.cpu_percent},{"线程":rdata.threads}],
				//         [{"内存":rdata.user},{"io读":rdata.connects},{"io写":rdata.cpu_percent},{"启动时间":rdata.threads}],
				//         [{"启动命令":rdata.user}],
				//     ])
				//     function reand_table_config(conifg){
				//         var html = '';
				//         for (var i = 0; i < conifg.length; i++) {
				//             var item = conifg[i];
				//             html += '<tr>';
				//             for (var j = 0; j < item; j++) {
				//                 var items = config[j],name = Object.keys(items)[0];
				//                 html += '<td>'+  name +'</td><td>'+ items[name] +'</td>'
				//             }
				//             html += '</tr>'
				//         }
				//         return '<div class="divtable"><table class="table"><tbody>'+ html  +'</tbody></tbody></table></div>';
				//     }

				tabelCon =
					'<div class="divtable">' +
					'<table class="table">' +
					'<tbody>' +
					'<tr>' +
					'<th width="50">名称</th><td  width="100">' +
					rdata.name +
					'</td>' +
					'<th width="50">状态</th><td  width="90">' +
					rdata.status +
					'</td>' +
					'<th width="60">用户</th><td width="100">' +
					rdata.user +
					'</td>' +
					'<th width="80">启动时间</th><td width="150">' +
					getLocalTime(rdata.create_time) +
					'</td>' +
					'</tr>' +
					'<tr>' +
					'<th>PID</th><td  >' +
					rdata.pid +
					'</td>' +
					'<th>PPID</th><td >' +
					rdata.ppid +
					'</td>' +
					'<th>线程</th><td>' +
					rdata.threads +
					'</td>' +
					'<th>Socket</th><td>' +
					rdata.connects +
					'</td>' +
					'</tr>' +
					'<tr>' +
					'<th>CPU</th><td>' +
					rdata.cpu_percent +
					'%</td>' +
					'<th>内存</th><td>' +
					ToSize(rdata.memory_used) +
					'</td>' +
					'<th>io读</th><td>' +
					ToSize(rdata.io_read_bytes) +
					'</td>' +
					'<th>io写</th><td>' +
					ToSize(rdata.io_write_bytes) +
					'</td>' +
					'</tr>' +
					'<tr>' +
					'</tr>' +
					'<tr>' +
					'<th width="50">命令</th><td colspan="7" style="word-break: break-word;width: 570px">' +
					rdata.exe +
					'</td>' +
					'</tr>' +
					'</tbody>' +
					'</table>' +
					'</div>' +
					'<h3 class="tname">网络</h3>' +
					'<div class="divtable" >' +
					'<div style="height:160px;overflow:auto;border:#ddd 1px solid" id="nodeNetworkList">' +
					'<table class="table table-hover" style="border:none">' +
					'<thead>' +
					'<tr>' +
					'<th>客户端地址</th>' +
					'<th>客户端端口</th>' +
					'<th>协议</th>' +
					'<th>FD</th>' +
					'<th>本地地址</th>' +
					'<th>本地端口</th>' +
					'<th>状态</th>' +
					'</tr>' +
					'</thead>' +
					'<tbody>' +
					connectionsBody +
					'</tbody>' +
					'</table>' +
					'</div>' +
					'</div>' +
					'<h3 class="tname">打开的文件列表</h3>' +
					'<div class="divtable" >' +
					'<div style="height:160px;overflow:auto;border:#ddd 1px solid" id="nodeFileList">' +
					'<table class="table table-hover" style="border:none">' +
					'<thead>' +
					'<tr>' +
					'<th>文件</th>' +
					'<th>mode</th>' +
					'<th>position</th>' +
					'<th>flags</th>' +
					'<th>fd</th>' +
					'</tr>' +
					'</thead>' +
					'<tbody>' +
					fileBody +
					'</tbody>' +
					'</table>' +
					'</div>' +
					'</div>';
				$('.node_project_pid_datail').html(tabelCon);
				bt_tools.$fixed_table_thead('#nodeNetworkList');
				bt_tools.$fixed_table_thead('#nodeFileList');
			})
			.change()
			.html(_option);
	});
};

/**
 * @description 项目SSL
 * @param el {object} 当前element节点
 * @param row {object} 当前项目数据
 */
CreateWebsiteModel.prototype.reanderProjectSslView = function (el, row) {
	el.empty();
	if (row.project_config.bind_extranet === 0) {
		$('.mask_module')
			.removeClass('hide')
			.find('.node_mask_module_text:eq(1)')
			.hide()
			.prev()
			.show();
		return false;
	}
	site.set_ssl({ name: row.name, ele: el, id: row.id });
	site.ssl.reload();
};

/**
 * @description 渲染项目服务状态
 * @param el {object} 当前element节点
 * @param row {object} 当前项目数据
 */
CreateWebsiteModel.prototype.reanderServiceStatusView = function (el, row) {
	var _this = this
	var arry = [
			{ title: '启动', event: this.startProject },
			{ title: '停止', event: this.stopProject },
			{ title: '重启', event: this.restartProject },
		],
		that = this,
		html = $(
			'<div class="soft-man-con bt-form"><p class="status"></p><div class="sfm-opt"></div></div>'
		);
	function reander_service(status) {
		var status_info = status
			? ['开启', '#20a53a', 'play']
			: ['停止', 'red', 'pause'];
		return (
			'当前状态：<span>' +
			status_info[0] +
			'</span><span style="color:' +
			status_info[1] +
			'; margin-left: 3px;" class="glyphicon glyphicon glyphicon-' +
			status_info[2] +
			'"></span>'
		);
	}
	html.find('.status').html(reander_service(row.run));
	el.html(html);
	for (var i = 0; i < arry.length; i++) {
		var item = arry[i],
			btn = $('<button class="btn btn-default btn-sm"></button>');
		(function (btn, item, indexs) {
			!(row.run && indexs === 0) || btn.addClass('hide');
			!(!row.run && indexs === 1) || btn.addClass('hide');
			btn
				.on('click', function () {
					bt.confirm(
						{
							title: item.title + '项目-[' + row.name + ']',
							msg:
								'您确定要' +
								item.title +
								'项目吗，' +
								(row.run ? '当前项目可能会受到影响，' : '') +
								'是否继续?',
						},
						function (index) {
							layer.close(index);
							item.event.call(that, { project_name: row.name }, function (res) {
								row.run = indexs === 0 ? true : indexs === 1 ? false : row.run;
								html.find('.status').html(reander_service(row.run));
								$('.sfm-opt button').eq(0).addClass('hide');
								$('.sfm-opt button').eq(1).addClass('hide');
								$('.sfm-opt button')
									.eq(row.run ? 1 : 0)
									.removeClass('hide');
								bt.msg({ status: res.status, msg: res.data || res.error_msg });
							});
						}
					);
				})
				.text(item.title);
		})(btn, item, i);
		el.find('.sfm-opt').append(btn);
	}
};
/**
 * @description 渲染项目日志
 * @param el {object} 当前element节点
 * @param row {object} 当前项目数据
 */
CreateWebsiteModel.prototype.reanderProjectLogsView = function (el, row) {
	el.html('<div class="model_project_log"></div>');
	var that = this;
	this.getProjectLog({ project_name: row.name }, function (res) {
		$('#webedit-con .model_project_log').html(
			'<pre class="command_output_pre" style="height:640px;">' +
				(typeof res == 'object' ? res.msg : res) +'</pre>');
				$('#webedit-con .model_project_log').html(
					'<div class="mb10">日志路径<input type="text" name="model_log_path" id="model_log_path" value="'+res.path+'" placeholder="日志路径" class="ml10 bt-input-text mr10" style="width:350px" />\
					<span class="glyphicon glyphicon-folder-open cursor mr10" onclick="bt.select_path(\'model_log_path\',\'dir\')"></span>\
					<button class="btn btn-success btn-sm" name="submitLogConfig">保存</button>\</div>\
					<div class="mb10" style="line-height: 32px;">日志大小<span class="ml10">'+ res.size +'</span></div><pre class="command_output_pre" style="height:500px;">' +
						res.data +
				'</pre>'
		);
				$.post({url: '/project/'+ that.type +'/get_log_split', data: { name: row.name }}, function (rdata) {
					var html = '',configInfo = {}
					if(rdata.status) configInfo = rdata.data
					html = '开启后' + (rdata.status ? rdata.data.log_size ? '日志文件大小超过'+ bt.format_size(rdata.data.log_size,true,2,'MB') +'时进行切割日志文件' : '每天'+ rdata.data.hour +'点' + rdata.data.minute + '分进行切割日志文件' : '默认每天2点0分进行切割日志文件')
					$('#webedit-con .model_project_log .command_output_pre').before('<div class="inlineBlock log-split mb20" style="line-height: 32px;">\
					<label>\
						<div class="bt-checkbox '+ (rdata.status && rdata.data.status ? 'active':'') +'"></div>\
						<span>日志切割</span>\
					</label>\
					<span class="unit">'+html+'，如需修改请点击<a href="javascript:;" class="btlink mamger_log_split">编辑配置</a></span>\
					</div>')
					$('#webedit-con .model_project_log .log-split').hover(function(){
						layer.tips('当日志文件过大时，读取和搜索时间会增加，同时也会占用存储空间，因此需要对日志进行切割以方便管理和维护。', $(this), {tips: [3, '#20a53a'], time: 0});
					},function(){
						layer.closeAll('tips');
					})
					$('#webedit-con .model_project_log label').click(function(){
						if(rdata['is_old']){
							bt_tools.msg(rdata)
							return;
						}
						bt.confirm({title:'设置日志切割任务',msg: !rdata.status || (rdata.status && !rdata.data.status) ? '开启后对该项目日志进行切割，是否继续操作？' : '关闭后将无法对该项目日志进行切割，是否继续操作？'},function(){
							if(rdata.status){
								that.set_log_split({name: row.name},function(res){
									bt_tools.msg(res)
									if(res.status) {
										that.reanderProjectLogsView(el, row);
									}
								})
							}else{
								that.mamger_log_split({name: row.name},function(res){
									bt_tools.msg(res)
									if(res.status) {
										that.reanderProjectLogsView(el, row);
									}
								})
							}
						})
					})
					$('.mamger_log_split').click(function(){
						if(rdata['is_old']){
							bt_tools.msg(rdata)
							return;
						}
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
										name: 'hour',
										'class': 'group',
										width: '70px',
										value: configInfo.hour || '2',
										unit: '时',
										min: 0,
										max: 23
									}, {
										type: 'number',
										name: 'minute',
										'class': 'group',
										width: '70px',
										min: 0,
										max: 59,
										value: configInfo.minute || '0',
										unit: '分'
									}]
								},{
									label: '日志大小',
									group:{
										type: 'text',
										name: 'log_size',
										width: '220px',
										value: configInfo.log_size ? bt.format_size(configInfo.log_size,true,2,'MB').replace(' MB','') : '',
										unit: 'MB',
										placeholder: '请输入日志大小',
									}
								}, {
									label: '保留最新',
									group:{
										type: 'number',
										name: 'num',
										'class': 'group',
										width: '70px',
										min: 1,
										value: configInfo.num || '180',
										unit: '份'
									}
								}]
							},
							success: function (layero, index) {
								$(layero).find('.mamger_log_split_box .bt-form').prepend('<div class="line">\
								<span class="tname">切割方式</span>\
								<div class="info-r">\
									<div class="replace_content_view" style="line-height: 32px;">\
										<div class="checkbox_config">\
											<i class="file_find_radio '+ (configInfo.log_size ? 'active' : '') +'"></i>\
											<span class="laberText" style="font-size: 12px;">按日志大小</span>\
										</div>\
										<div class="checkbox_config">\
											<i class="file_find_radio '+ (configInfo.log_size ? '' : 'active') +'"></i>\
											<span class="laberText" style="font-size: 12px;">按执行时间</span>\
										</div>\
									</div>\
								</div>')
								$(layero).find('.mamger_log_split_box .bt-form').append('<div class="line"><div class=""><div class="inlineBlock  "><ul class="help-info-text c7"><li>每5分钟执行一次</li><li>【日志大小】：日志文件大小超过指定大小时进行切割日志文件</li><li>【保留最新】：保留最新的日志文件，超过指定数量时，将自动删除旧的日志文件</li></ul></div></div></div>')
								$(layero).find('.replace_content_view .checkbox_config').click(function(){
									var index = $(this).index()
									$(this).find('i').addClass('active').parent().siblings().find('i').removeClass('active')
									if(index){
										$(layero).find('[name=hour]').parent().parent().parent().show()
										$(layero).find('[name=log_size]').parent().parent().parent().hide()
										$(layero).find('.help-info-text li').eq(0).hide().next().hide()
									}else{
										$(layero).find('[name=hour]').parent().parent().parent().hide()
										$(layero).find('[name=log_size]').parent().parent().parent().show()
										$(layero).find('.help-info-text li').eq(0).show().next().show()
									}
								})
								if(configInfo.log_size) {
									$(layero).find('[name=hour]').parent().parent().parent().hide()
								}else{
									$(layero).find('[name=log_size]').parent().parent().parent().hide()
									$(layero).find('.help-info-text li').eq(0).hide().next().hide()
								}
								$(layero).find('[name=log_size]').on('input', function(){
									if($(this).val() < 1 || !bt.isInteger(parseFloat($(this).val()))) {
										layer.tips('请输入日志大小大于0的的整数', $(this), { tips: [1, 'red'], time: 2000 })
									}
								})
								$(layero).find('[name=hour]').on('input', function(){
									if($(this).val() > 23 || $(this).val() < 0 || !bt.isInteger(parseFloat($(this).val()))) {
										layer.tips('请输入小时范围0-23的整数时', $(this), { tips: [1, 'red'], time: 2000 })
									}
									$(layero).find('.hour').text($(this).val())
								})
								$(layero).find('[name=minute]').on('input', function(){
									if($(this).val() > 59 || $(this).val() < 0 || !bt.isInteger(parseFloat($(this).val()))) {
										layer.tips('请输入正确分钟范围0-59分的整数', $(this), { tips: [1, 'red'], time: 2000 })
									}
									$(layero).find('.minute').text($(this).val())
								})
								$(layero).find('[name=num]').on('input', function(){
									if($(this).val() < 1 || $(this).val() > 1800 || !bt.isInteger(parseFloat($(this).val()))) {
										layer.tips('请输入保留最新范围1-1800的整数', $(this), { tips: [1, 'red'], time: 2000 })
									}
								})
							},
							yes: function (formD,indexs) {
								formD['name'] = row.name
								delete formD['day']
								if($('.mamger_log_split_box .file_find_radio.active').parent().index()) {
									if (formD.hour < 0 || formD.hour > 23 || isNaN(formD.hour) || formD.hour === '' || !bt.isInteger(parseFloat(formD.hour))) return layer.msg('请输入小时范围0-23时的整数')
									if (formD.minute < 0 || formD.minute > 59 || isNaN(formD.minute) || formD.minute === '' || !bt.isInteger(parseFloat(formD.minute))) return layer.msg('请输入正确分钟范围0-59分的整数')
									formD['log_size'] = 0
								}else{
									if(formD.log_size == '' || !bt.isInteger(parseFloat(formD.log_size))) return layer.msg('请输入日志大小大于0的的整数')
								}
								if(formD.num < 1 || formD.num > 1800 || !bt.isInteger(parseFloat(formD.num))) return layer.msg('请输入保留最新范围1-1800的整数')
								if(!rdata.status || (rdata.status && !rdata.data.status)) {
									if(rdata.status){
										that.set_log_split({name: row.name},function(res){
											if(res.status) {
												pub_open()
											}
										})
									}else{
										pub_open()
									}
								}else{
									pub_open()
								}
								function pub_open() {
									that.mamger_log_split(formD,function(res){
										bt.msg(res)
										if(res.status) {
											that.reanderProjectLogsView(el, row);
											layer.close(indexs)
										}
									})
								}
							}
						})
					})
				})
				// 保存按钮
				$('[name="submitLogConfig"]').unbind('click').click(function () {
					var path = $('#model_log_path').val();
					if (!path) {
						bt.msg({ status: false, msg: '日志路径不能为空' });
						return;
					}
					that.change_log_path({ project_name: row.name, path: path }, function (res) {
						bt.msg(res);
						that.reanderProjectLogsView(el, row);
					});
				})
		$('.command_output_pre').scrollTop(
			$('.command_output_pre').prop('scrollHeight')
		);
	});
};

/**
 * @description 渲染项目日志
 * @param el {object} 当前element节点
 * @param row {object} 当前项目数据
 */
CreateWebsiteModel.prototype.reanderSiteLogsView = function (el, row) {
	el.empty();
	if (row.project_config.bind_extranet === 0) {
		$('.mask_module')
			.removeClass('hide')
			.find('.node_mask_module_text:eq(1)')
			.hide()
			.prev()
			.show();
		return false;
	}
	site.edit.get_site_logs({ name: row.name });
};
