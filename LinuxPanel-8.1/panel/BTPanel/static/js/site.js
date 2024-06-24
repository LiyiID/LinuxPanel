var initTab = [];
var click = true;
$('#cutMode .tabs-item').on('click', function () {
	var type = $(this).data('type'),
		index = $(this).index();
	$(this).addClass('active').siblings().removeClass('active');
	$('.tab-con').find('.tab-con-block').eq(index).removeClass('hide').siblings().addClass('hide');
	switch (type) {
		case 'php':
			$('#bt_site_table').empty();
			// if (!isSetup) $('.site_table_view .mask_layer').removeClass('hide').find('.prompt_description.web-model').html('未安装Web服务器，<a href="javascript:;" class="btlink" onclick="bt.soft.install(\'nginx\')">安装Nginx</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:;" class="btlink" onclick="bt.soft.install(\'apache\')">安装Apache</a>');
			product_recommend.init(function () {
				site.get_scan_list();
				site.php_table_view();
				site.get_types();
			});
			break;
		case 'nodejs':
			$('#bt_node_table').empty();
			$('.site_class_type').remove();
			$.get(
				'/plugin?action=getConfigHtml',
				{
					name: 'nodejs',
				},
				function (res) {
					if (typeof res !== 'string')
						$('#bt_node_table+.mask_layer')
							.removeClass('hide')
							.find('.prompt_description.node-model')
							.html('未安装Node版本管理器，<a href="javascript:;" class="btlink" onclick="bt.soft.install(\'nodejs\')">点击安装</a>');
				}
			);
			site.node_porject_view();
			break;
		case 'java':
			$('.site_class_type').remove();
			if (initTab.length > 0) {
				site.javaModle.get_project_list();
			} else {
				dynamic.require(['vue.min.js', 'polyfill.min.js', 'vue-components.js', 'java-model.js'], function () {
					initTab.push(index);
				});
			}
			break;
		case 'go':
			if (typeof goModel == 'undefined') {
				$.getScript('/static/js/siteModel.js', function (ev) {
					window.goModel = new CreateWebsiteModel({ type: 'go', tips: 'Go' });
				});
			} else {
				goModel.reanderProjectList();
			}

			break;
		case 'python':
			var flag_python = false;
			site.node.get_cloud_python(function (rdata) {
				for (var i = 0; i < rdata.data.length; i++) {
					if (rdata.data[i].installed != '0') {
						flag_python = true;
						break;
					}
				}
				if (typeof pythonModel == 'undefined') {
					$.getScript('/static/js/sitePython.js', function (ev) {
						window.pythonModel = new CreateWebsiteModel({ type: 'python', tips: 'Python' });
						if (!flag_python)
							$('#bt_python_table .mask_layer')
								.removeClass('hide')
								.find('.prompt_description.python-model')
								.html('未安装Python版本，<a href="javascript:;" class="btlink" onclick="pythonModel.getVersionManagement()">点击安装</a>');
					});
				} else {
					pythonModel.renderProjectList();
					if (!flag_python)
						$('#bt_python_table .mask_layer')
							.removeClass('hide')
							.find('.prompt_description.python-model')
							.html('未安装Python版本，<a href="javascript:;" class="btlink" onclick="pythonModel.getVersionManagement()">点击安装</a>');
				}
			});
			break;
		case 'other':
			if (typeof otherModel == 'undefined') {
				$.getScript('/static/js/siteModel.js', function (ev) {
					window.otherModel = new CreateWebsiteModel({ type: 'other', tips: '通用' });
				});
			} else {
				otherModel.reanderProjectList();
			}
			break;
	}
	bt.set_cookie('site_model', type);
});
var node_table = null;
var site_table = null;
var site = {
	model_table: null,
	javaModle: null,
	scan_list: [], //漏洞扫描
	scan_num: 0,
	span_time: '',
	is_pay: true,
	node: {
		/**
		 * @description 选择路径配置
		 * @return config {object} 选中文件配置
		 *
		 */
		get_project_select_path: function (path) {
			var that = this;
			return {
				type: 'text',
				width: '420px',
				name: 'project_script',
				value: path,
				placeholder: '请选择项目启动文件/输入启动命令，不可为空',
				icon: {
					type: 'glyphicon-folder-open',
					select: 'file',
					event: function (ev) {},
				},
			};
		},
		get_project_select: function (path) {
			var that = this;
			return {
				type: 'select',
				name: 'project_script',
				width: '220px',
				disabled: true,
				unit: '* 自动获取package.json文件中的启动模式',
				placeholder: '请选择项目目录继续操作',
				list: path
					? function (configs) {
							that.get_project_script_list(path, configs[2], this);
					  }
					: [],
				change: function (formData, elements, formConfig) {
					var project_script = $("[data-name='project_script']");
					if (formData.project_script === '') {
						if ($('#project_script_two').length === 0) {
							project_script
								.parent()
								.after(
									'<div class="inlineBlock"><input type="text" name="project_script_two" id="project_script_two" placeholder="请选择项目启动文件和启动命令，不可为空" class="mt5 bt-input-text mr10 " style="width:420px;" value="" /><span class="glyphicon glyphicon-folder-open cursor" onclick="bt.select_path(\'project_script_two\',\'file\',null,\'' +
										'/' +
										path +
										"'" +
										')" style="margin-right: 18px;"></span></div>'
								);
						}
					} else {
						project_script.parent().next().remove();
					}
				},
			};
		},
		/**
		 * @description 获取python版本安装信息
		 * @param callback {function} 回调函数
		 */
		get_cloud_python: function (callback) {
			$.post('project/python/GetCloudPython', {}, function (rdata) {
				if (callback) callback(rdata);
			});
		},
		/**
		 * @description 选择启动脚本配置
		 * @param path {string} 项目目录
		 * @param form {object} 表单元素
		 * @param formObject {object} 表单对象
		 * @return config {object} 选中文件配置
		 */
		get_project_script_list: function (path, form, formObject) {
			var that = this;
			that.get_start_command(
				{ project_cwd: path },
				function (res) {
					var arry = [],
						is_show_script = false;
					for (var resKey in res) {
						arry.push({ title: resKey + ' 【' + res[resKey] + '】', value: resKey });
					}
					arry.push({ title: '自定义启动命令', value: '' });
					if (arry.length === 1) {
						formObject.data.project_script = '';
					}
					arry.forEach(function (item, index) {
						if (formObject.data.project_script == '') {
							if (item.value === formObject.data.project_script) {
								is_show_script = true;
							}
						}
					});
					form.group = that.get_project_select(path);
					form.group.list = arry;
					form.group.disabled = false;
					formObject.$replace_render_content(2);
					if (arry.length === 1 || is_show_script) {
						var project_script = $("[data-name='project_script']");
						// form.group.value = '';
						project_script
							.parent()
							.after(
								'<div class="inlineBlock"><input type="text" name="project_script_two" id="project_script_two" placeholder="请选择项目启动文件和启动命令，不可为空" class="mt5 bt-input-text mr10 " style="width:420px;" value="" /><span class="glyphicon glyphicon-folder-open cursor" onclick="bt.select_path(\'project_script_two\',\'file\',null,\'' +
									path +
									'\')" style="margin-right: 18px;"></span></div>'
							);
					}
				},
				function () {
					form.label = '启动文件/命令';
					form.group = that.get_project_select_path(path);
					formObject.$replace_render_content(2);
				}
			);
			return [];
		},

		/**
		 *
		 * @description 获取Node版本列表
		 * @return {{dataFilter: (function(*): *[]), url: string}}
		 */
		get_node_version_list: function () {
			return {
				url: '/project/nodejs/get_nodejs_version',
				dataFilter: function (res) {
					if (res.length === 0) {
						layer.closeAll();
						bt.soft.set_lib_config('nodejs', 'Node.js版本管理器');
						bt.msg({ status: false, msg: '请至少安装一个Node版本，才可以继续添加Node项目' });
						return;
					}
					var arry = [];
					for (var i = 0; i < res.length; i++) {
						arry.push({ title: res[i], value: res[i] });
					}
					return arry;
				},
			};
		},

		/**
		 * @description 获取Node通用Form配置
		 * @param config {object} 获取配置参数
		 * @return form模板
		 */
		get_node_general_config: function (config) {
			config = config || {};
			var that = this,
				formLineConfig = [
					{
						label: '项目目录',
						must: '*',
						group: {
							type: 'text',
							width: '420px',
							name: 'project_cwd',
							readonly: true,
							icon: {
								type: 'glyphicon-folder-open',
								event: function (ev) {},
								callback: function (path) {
									var filename = path.split('/');
									var project_script_config = this.config.form[2],
										project_name_config = this.config.form[1],
										project_ps_config = this.config.form[6];
									project_name_config.group.value = filename[filename.length - 1];
									project_ps_config.group.value = filename[filename.length - 1];
									project_script_config.group.disabled = false;
									this.$replace_render_content(1);
									this.$replace_render_content(6);
									that.get_project_script_list(path, project_script_config, this);
								},
							},
							value: bt.get_cookie('sites_path') ? bt.get_cookie('sites_path') : '/www/wwwroot',
							placeholder: '请选择项目目录',
						},
					},
					{
						label: '项目名称',
						must: '*',
						group: {
							type: 'text',
							name: 'project_name',
							width: '420px',
							placeholder: '请输入Node项目名称',
							input: function (formData, formElement, formConfig) {
								var project_ps_config = formConfig.config.form[6];
								project_ps_config.group.value = formData.project_name;
								formConfig.$replace_render_content(6);
							},
						},
					},
					{
						label: '启动选项',
						must: '*',
						group: (function () {
							return that.get_project_select(config.path);
						})(),
					},
					{
						label: '项目端口',
						must: '*',
						group: [
							{
								type: 'number',
								name: 'port',
								class: 'port_input',
								width: '220px',
								placeholder: '请输入项目的真实端口',
								change: function (form, value, val, field) {
									setTimeout(function () {
										//延迟校验端口,解决点击放行端口无效问题
										if (form.port !== '') {
											bt_tools.send(
												{ url: 'project/nodejs/advance_check_port', data: { port: form.port } },
												function (res) {
													if (!res.status) {
														$('.port_input').val('');
														bt_tools.msg({ status: false, msg: res.msg });
													}
												},
												{ load: '正在校验端口', verify: false }
											);
										}
									}, 500);
								},
							},
							{
								type: 'checkbox',
								class: 'port_check',
								name: 'release_firewall',
								width: '220px',
								display: config.path ? false : true,
								title: '放行端口<a class="bt-ico-ask">?</a>',
							},
						],
					},
					{
						label: '运行用户',
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
						label: '包管理器',
						group: {
							type: 'select',
							name: 'pkg_manager',
							width: '150px',
							unit: '* 请选择项目的包管理器',
							list: [
								{ title: 'yarn', value: 'yarn' },
								{ title: 'npm', value: 'npm' },
								{ title: 'pnpm', value: 'pnpm' },
							],
						},
					},
					{
						label: 'Node版本',
						group: {
							type: 'select',
							name: 'nodejs_version',
							width: '150px',
							unit: '* 请根据项目选择合适的Node版本，<a href="javascript:;" class="btlink" onclick="bt.soft.set_lib_config(\'nodejs\',\'Node.js版本管理器\')">安装其他版本</a>',
							list: (function () {
								return that.get_node_version_list();
							})(),
						},
					},
					{
						label: '备注',
						group: {
							type: 'text',
							name: 'project_ps',
							width: '420px',
							placeholder: '请输入项目备注',
							value: config.ps,
						},
					},
					{
						label: '绑定域名',
						group: {
							type: 'textarea', //当前表单的类型 支持所有常规表单元素、和复合型的组合表单元素
							name: 'domains', //当前表单的name
							style: { width: '420px', height: '120px', 'line-height': '22px' },
							tips: {
								//使用hover的方式显示提示
								text: '<span>如果需要绑定外网，请输入需要绑定的域名，该选项可为空</span><br>如需填写多个域名，请换行填写，每行一个域名，默认为80端口<br>泛解析添加方法 *.domain.com<br>如另加端口格式为 www.domain.com:88',
								style: { top: '10px', left: '15px' },
							},
						},
					},
					{
						group: {
							type: 'help',
							list: [
								'【启动选项】：默认读取package.json中的scripts列表，也可以选择[自定义启动命令]选项来手动输入启动命令',
								'【自定义启动命令】：可以选择启动文件，或直接输入启动命令，支持的启动方式：npm/node/pm2/yarn',
								'【项目端口】：错误的端口会导致访问502，若不知道端口，可先随意填写，启动项目后再改为正确端口',
								'【运行用户】：为了安全考虑，默认使用www用户运行，root用户运行可能带来安全风险',
							],
						},
					},
				];

			if (config.path) {
				formLineConfig.splice(-1, 1);
				return formLineConfig.concat([
					{
						label: '开机启动',
						group: {
							type: 'checkbox',
							name: 'is_power_on',
							width: '220px',
							title: '跟随系统启动服务',
						},
					},
					{
						label: '',
						group: {
							type: 'button',
							name: 'saveNodeConfig',
							title: '保存配置',
							event: function (data, form, that) {
								if (data.project_cwd === '') {
									bt.msg({ status: false, msg: '项目目录不能为空' });
									return false;
								}
								var project_script_two = $('[name="project_script_two"]');
								if ((data.project_script === '' && project_script_two.length < 1) || (project_script_two.length > 1 && project_script_two.val() === '')) {
									bt.msg({ status: false, msg: '启动文件/命令不能为空' });
									return false;
								}
								if (data.port === '') {
									bt.msg({ status: false, msg: '项目端口不能为空' });
									return false;
								}
								if (parseInt(data.port) < 0 || parseInt(data.port) > 65535) return layer.msg('项目端口号应为[0-65535]', { icon: 2 });
								if (data.project_script === '') {
									data.project_script = project_script_two.val();
									delete data.project_script_two;
								}
								config.callback(data, form, that);
							},
						},
					},
				]);
			}
			return formLineConfig;
		},

		/**
		 * @description 添加node项目表单
		 * @returns {{form: 当前实例对象, close: function(): void}}
		 */
		add_node_form: function (callback) {
			var that = this;
			var add_node_project = bt_tools.open({
				title: '添加Node项目',
				area: '700px',
				btn: ['提交', '取消'],
				content: {
					class: 'pd30',
					form: (function () {
						return that.get_node_general_config({
							form: add_node_project,
						});
					})(),
				},
				yes: function (form, indexs, layers) {
					var defaultParam = {
						bind_extranet: 0,
						is_power_on: 1,
						max_memory_limit: 4096,
						project_env: '',
					};
					if (form.domains !== '') {
						var arry = form.domains.replace('\n', '').split('\r'),
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
						defaultParam.bind_extranet = 1;
						defaultParam.domains = newArry;
					}
					if (form.project_name === '') {
						bt.msg({ status: false, msg: '项目名称不能为空' });
						return false;
					}
					var project_script_two = $('[name="project_script_two"]');
					if (project_script_two.length && project_script_two.val() === '') {
						bt.msg({ status: false, msg: '请输入自定义启动命令，不能为空！' });
						return false;
					}
					if (form.port === '') {
						bt.msg({ status: false, msg: '项目端口不能为空' });
						return false;
					}
					if (parseInt(form.port) < 0 || parseInt(form.port) > 65535) return layer.msg('端口格式错误，可用范围：1-65535', { icon: 2 });
					if (form.project_script === null) {
						bt.msg({ status: false, msg: '请选择项目目录，获取启动命令！' });
						return false;
					}
					form = $.extend(form, defaultParam);
					if (project_script_two.length) {
						form.project_script = project_script_two.val();
						delete form.project_script_two;
					}
					if (!click) {
						bt.msg({ status: false, msg: '请勿重复提交！' });
						return false;
					} else {
						click = false;
					}
					var _command = null;
					setTimeout(function () {
						if (_command < 0) return false;
						_command = that.request_module_log_command({ shell: 'tail -f /www/server/panel/logs/npm-exec.log' });
					}, 500);
					site.node.add_node_project(form, function (res) {
						if (!res.status) _command = -1;
						if (_command > 0) layer.close(_command);
						click = true;
						if (callback) callback(res, indexs);
					});
				},
			});
			layer.ready(function () {
				$('.port_check .bt-ico-ask').hover(
					function () {
						layer.tips('选中将在防火墙安全组放行监听端口，放行后该项目可在外网访问', $(this), { tips: [2, '#20a53a'], time: 0 });
					},
					function () {
						layer.closeAll('tips');
					}
				);
			});
			return add_node_project;
		},

		/**
		 * @description 添加node项目请求
		 * @param param {object} 请求参数
		 * @param callback {function} 回调函数
		 */
		add_node_project: function (param, callback) {
			this.http({ create_project: false, verify: false }, param, callback);
		},

		/**
		 * @description 获取Node环境
		 * @param callback {function} 回调函数
		 */
		get_node_environment: function (callback) {
			bt_tools.send(
				{
					url: '/project/nodejs/is_install_nodejs',
				},
				function (res) {
					if (callback) callback(res);
				},
				{ load: '获取Node项目环境' }
			);
		},

		/**
		 * @description 编辑Node项目请求
		 * @param param {object} 请求参数
		 * @param callback {function} 回调函数
		 */
		modify_node_project: function (param, callback) {
			this.http({ modify_project: '修改Node项目配置' }, param, callback);
		},

		/**
		 * @description 删除Node项目请求
		 * @param param {object} 请求参数
		 * @param callback {function} 回调函数
		 */
		remove_node_project: function (param, callback) {
			this.http({ remove_project: '删除Node项目' }, param, callback);
		},

		/**
		 * @description 获取node项目域名
		 * @param callback {function} 回调行数
		 */
		get_node_project_domain: function (callback) {
			this.http({ project_get_domain: '获取Node项目域名列表' }, callback);
		},

		/**
		 * @description 获取启动命令列表
		 * @param param {object} 请求参数
		 * @param callback {function} 成功回调行数
		 * @param callback1 {function} 错误回调行数
		 */
		get_start_command: function (params, callback, callback1) {
			this.http({ get_run_list: '获取项目启动命令' }, params, callback, callback1);
		},
		/**
		 * @description 添加Node项目域名
		 * @param param {object} 请求参数
		 * @param callback {function} 回调行数
		 */
		add_node_project_domain: function (param, callback) {
			this.http({ project_add_domain: false, verify: false }, param, callback);
		},

		/**
		 * @description 删除Node项目域名
		 * @param param {object} 请求参数
		 * @param callback {function} 回调行数
		 */
		remove_node_project_domain: function (param, callback) {
			var that = this;
			bt.confirm(
				{
					title: '删除域名【' + param.domain.split(':')[0] + '】',
					msg: '您真的要从站点中删除这个域名吗？',
				},
				function () {
					that.http({ project_remove_domain: '删除Node项目域名' }, param, callback);
				}
			);
		},

		/**
		 * @description 启动Node项目
		 * @param param {object} 请求参数
		 * @param callback {function} 回调行数
		 */
		start_node_project: function (param, callback) {
			this.http({ start_project: '启用Node项目' }, param, callback);
		},

		/**
		 * @description 停止Node项目
		 * @param param {object} 请求参数
		 * @param callback {function} 回调行数
		 */
		stop_node_project: function (param, callback) {
			this.http({ stop_project: '停止Node项目' }, param, callback);
		},

		/**
		 * @description 重启Node项目
		 * @param param {object} 请求参数
		 * @param callback {function} 回调行数
		 */
		restart_node_project: function (param, callback) {
			this.http({ restart_project: '重启Node项目' }, param, callback);
		},

		/**
		 * @description 获取值指定Node项目信息
		 * @param param {object} 请求参数
		 * @param callback {function} 回调行数
		 */
		get_node_project_info: function (param, callback) {
			this.http({ get_project_info: '获取Node项目信息' }, param, callback);
		},

		/**
		 * @description 绑定外网映射
		 * @param param {object} 请求参数
		 * @param callback {function} 回调行数
		 */
		bind_node_project_map: function (param, callback) {
			this.http({ bind_extranet: '绑定映射', verify: false }, param, callback);
		},
		/**
		 * @description 绑定外网映射
		 * @param param {object} 请求参数
		 * @param callback {function} 回调行数
		 */
		unbind_node_project_map: function (param, callback) {
			this.http({ unbind_extranet: '解绑映射', verify: false }, param, callback);
		},
		/**
		 * @description 安装node项目依赖
		 * @param param {object} 请求参数
		 * @param callback {function} 回调行数
		 */
		install_node_project_packages: function (param, callback) {
			this.http({ install_packages: false, verify: false }, param, callback);
		},

		/**
		 * @description 安装指定模块
		 * @param param {object} 请求参数
		 * @param callback {function} 回调行数
		 */
		npm_install_node_module: function (param, callback) {
			this.http({ install_module: '安装Node模块' }, param, callback);
		},
		/**
		 * @description 更新指定模块
		 * @param param {object} 请求参数
		 * @param callback {function} 回调行数
		 */
		upgrade_node_module: function (param, callback) {
			this.http({ upgrade_module: '更新Node模块' }, param, callback);
		},
		/**
		 * @description 删除指定模块
		 * @param param {object} 请求参数
		 * @param callback {function} 回调行数
		 */ uninstall_node_module: function (param, callback) {
			this.http({ uninstall_module: '卸载Node模块' }, param, callback);
		},
		/**
		 * @description 模拟点击
		 */
		simulated_click: function (num) {
			$('.bt-w-menu p:eq(' + num + ')').click();
		},
		/**
		 * @description 获取Node项目信息
		 * @param row {object} 当前行，项目信息
		 */
		set_node_project_view: function (row) {
			var that = this;
			bt.open({
				type: 1,
				title: 'Node项目管理-[' + row.name + ']，添加时间[' + row.addtime + ']',
				skin: 'node_project_dialog',
				area: ['780px', '720px'],
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
								tab = $('<p class="' + (i === 0 ? 'bgw' : '') + '">' + item.title + '</p>');
							$(config.el).append(tab);
							(function (i, item) {
								tab.on('click', function (ev) {
									$('.mask_module').addClass('hide');
									$(this).addClass('bgw').siblings().removeClass('bgw');
									if ($(this).hasClass('bgw')) {
										that.get_node_project_info({ project_name: row.name }, function (res) {
											config.list[i].event.call(that, $content, res, ev);
										});
									}
								});
								if (item.active) tab.click();
							})(i, item);
						}
					}
					reander_tab_list({
						el: $layers.find('.bt-w-menu'),
						list: [
							{
								title: '项目配置',
								active: true,
								event: that.reander_node_project_config,
							},
							{
								title: '域名管理',
								event: that.reander_node_domain_manage,
							},
							{
								title: '外网映射',
								event: that.reander_node_project_map,
							},
							{
								title: '伪静态',
								event: that.reander_node_project_rewrite,
							},
							{
								title: '配置文件',
								event: that.reander_node_file_config,
							},
							{
								title: 'SSL',
								event: that.reander_node_project_ssl,
							},
							{
								title: '负载状态',
								event: that.reander_node_service_condition,
							},
							{
								title: '服务状态',
								event: that.reander_node_service_status,
							},
							{
								title: '模块管理',
								event: that.reander_node_project_module,
							},
							{
								title: '项目日志',
								event: that.reander_node_project_log,
							},
							{
								title: '网站日志',
								event: that.reander_node_site_log,
							},
						],
					});
				},
			});
		},

		/**
		 * @description 渲染Node项目配置视图
		 * @param el {object} 当前element节点
		 * @param row {object} 当前项目数据
		 * @param that {object} 当前node项目对象
		 */
		reander_node_project_config: function (el, rows) {
			var row = $.extend(true, {}, rows);
			var that = this,
				edit_node_project = bt_tools.form({
					el: '#webedit-con',
					data: row.project_config,
					class: 'ptb15',
					form: (function () {
						var fromConfig = that.get_node_general_config({
							form: edit_node_project,
							path: row.path,
							ps: row.ps,
							callback: function (data, form, formNew) {
								data['is_power_on'] = data['is_power_on'] ? 1 : 0;
								var project_script_two = $('[name="project_script_two"]');
								if (project_script_two.length && project_script_two.val() === '') {
									bt.msg({ status: false, msg: '请输入自定义启动命令，不能为空！' });
									return false;
								}
								if (form.port === '') {
									bt.msg({ status: false, msg: '项目端口不能为空' });
									return false;
								}
								if (form.project_script === null) {
									bt.msg({ status: false, msg: '请选择项目目录，获取启动命令！' });
									return false;
								}
								site.node.modify_node_project(data, function (res) {
									if (res.status) {
										row['project_config'] = $.extend(row, data);
										row['path'] = data.project_script;
										row['ps'] = data.ps;
										node_table.$refresh_table_list(true);
									}
									bt.msg({ status: res.status, msg: res.data });
									site.node.simulated_click(0);
								});
							},
						});
						setTimeout(function () {
							var is_existence = false,
								list = fromConfig[2].group.list;
							for (var i = 0; i < list.length; i++) {
								var item = list[i];
								if (item.value === rows.project_config.project_script) {
									is_existence = true;
									break;
								}
							}
							if (!is_existence && list.length > 1) {
								$('[data-name="project_script"] li:eq(' + (list.length - 1) + ')').click();
								$('[name="project_script_two"]').val(rows.project_config.project_script);
							}
							if (list.length === 1) {
								$('[data-name="project_script"] li:eq(0)').click();
								$('[name="project_script_two"]').val(rows.project_config.project_script);
							}
						}, 1000);

						fromConfig[1].group.disabled = true;
						fromConfig[fromConfig.length - 3].hide = true;
						fromConfig[fromConfig.length - 3].group.disabled = true;
						return fromConfig;
					})(),
				});
			setTimeout(function () {
				$(el).append(
					'<ul class="help-info-text c7">' +
						'<li>【启动选项】：默认读取package.json中的scripts列表，也可以选择[自定义启动命令]选项来手动输入启动命令</li>' +
						'<li>【自定义启动命令】：可以选择启动文件，或直接输入启动命令，支持的启动方式：npm/node/pm2/yarn</li>' +
						'<li>【项目端口】：错误的端口会导致访问502，若不知道端口，可先随意填写，启动项目后再改为正确端口</li>' +
						'<li>【运行用户】：为了安全考虑，默认使用www用户运行，root用户运行可能带来安全风险</li>' +
						'</ul>'
				);
				if (!row.listen_ok)
					$(el)
						.find('input[name="port"]')
						.parent()
						.after('<div class="block mt10" style="margin-left: 100px;color: red;line-height: 20px;">项目端口可能有误，检测到当前项目监听了以下端口[ ' + row.listen.join('、') + ' ]</div>');
			}, 100);
		},

		/**
		 * @description 渲染Node项目服务状态
		 * @param el {object} 当前element节点
		 * @param row {object} 当前项目数据
		 */
		reander_node_service_status: function (el, row) {
			var arry = [
					{ title: '启动', event: this.start_node_project },
					{ title: '停止', event: this.stop_node_project },
					{ title: '重启', event: this.restart_node_project },
				],
				that = this,
				html = $(
					'<div class="soft-man-con bt-form"><p class="status"></p><div class="sfm-opt"></div>\
								<div id="alert_setting">\
									<span style="margin-right:10px;font-size:14px">项目异常停止时提醒我:</span>\
									<div class="outer_state_alert">\
										<input class="btswitch btswitch-ios isServerStop" data-project="' +
						row.id +
						'" data-name="' +
						row.name +
						'" data-status="' +
						row.run +
						'" data-type="node" type="checkbox" id="isNodeStop"><label class="btswitch-btn" for="isNodeStop"></label>\
									</div>\
									<span class="btlink serverStopSet" data-project="' +
						row.id +
						'" data-name="' +
						row.name +
						'" data-status="' +
						row.run +
						'" data-type="node" style="margin-left:10px;font-size:14px">告警设置</span>\
								</div>\
							</div>'
				);
			function reander_service(status) {
				var status_info = status ? ['开启', '#20a53a', 'play'] : ['停止', 'red', 'pause'];
				return '当前状态：<span>' + status_info[0] + '</span><span style="color:' + status_info[1] + '; margin-left: 3px;" class="glyphicon glyphicon glyphicon-' + status_info[2] + '"></span>';
			}
			html.find('.status').html(reander_service(row.run));
			el.html(html);
			site.server_status_event({ project: row.id, name: row.name, status: row.run, type: 'node' }, true);
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
									msg: '您确定要' + item.title + '项目吗，' + (row.run ? '当前项目可能会受到影响，' : '') + '是否继续?',
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
		},

		/**
		 * @description 渲染Node项目域名管理
		 * @param el {object} 当前element节点
		 * @param row {object} 当前项目数据
		 */
		reander_node_domain_manage: function (el, row) {
			var that = this,
				list = [
					{
						class: 'mb0',
						items: [
							{
								name: 'nodedomain',
								width: '340px',
								type: 'textarea',
								placeholder:
									'如果需要绑定外网，请输入需要映射的域名，该选项可为空<br>多个域名，请换行填写，每行一个域名，默认为80端口<br>泛解析添加方法 *.domain.com<br>如另加端口格式为 www.domain.com:88',
							},
							{
								name: 'btn_node_submit_domain',
								text: '添加',
								type: 'button',
								callback: function (sdata) {
									var arrs = sdata.nodedomain.split('\n');
									var domins = [];
									for (var i = 0; i < arrs.length; i++) {
										if (arrs[i] != '') {
											domins.push(arrs[i]);
										}
									}
									if (domins.length == 0) {
										bt_tools.msg('添加域名不能为空！', 2);
										return;
									}
									that.add_node_project_domain({ project_name: row.name, domains: domins }, function (res) {
										if (typeof res.status == 'undefined') {
											$('[name=nodedomain]').val('');
											$('.placeholder').css('display', 'block');
											site.render_domain_result_table(res);
											project_domian.$refresh_table_list(true);
										} else {
											bt.msg({ status: res.status, msg: res.error_msg });
										}
									});
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
			$('.btn_node_submit_domain').addClass('pull-right').css('margin', '30px 35px 0 0');
			$('textarea[name=nodedomain]').css('height', '120px');
			placeholder = $('.placeholder');
			placeholder
				.click(function () {
					$(this).hide();
					$('.nodedomain').focus();
				})
				.css({ width: '340px', heigth: '120px', left: '0px', top: '0px', 'padding-top': '10px', 'padding-left': '15px' });
			$('.nodedomain')
				.focus(function () {
					placeholder.hide();
					loadT = layer.tips(placeholder.html(), $(this), { tips: [1, '#20a53a'], time: 0, area: $(this).width() });
				})
				.blur(function () {
					if ($(this).val().length == 0) placeholder.show();
					layer.close(loadT);
				});
			var project_domian = bt_tools.table({
				el: '#project_domian_list',
				url: '/project/nodejs/project_get_domain',
				default: '暂无域名列表',
				param: { project_name: row.name },
				height: 375,
				beforeRequest: function (params) {
					if (params.hasOwnProperty('data') && typeof params.data === 'string') return params;
					return { data: JSON.stringify(params) };
				},
				column: [
					{ type: 'checkbox', class: '', width: 20 },
					{
						fid: 'name',
						title: '域名',
						type: 'text',
						template: function (row) {
							return '<a href="http://' + row.name + ':' + row.port + '" target="_blank" class="btlink">' + row.name + '</a>';
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
									that.remove_node_project_domain({ project_name: row.name, domain: rowc.name + ':' + rowc.port }, function (res) {
										bt.msg({ status: res.status, msg: res.data || res.error_msg });
										rthat.$refresh_table_list(true);
									});
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
								url: '/project/nodejs/project_remove_domain',
								param: function (crow) {
									return { data: JSON.stringify({ project_name: row.name, domain: crow.name + ':' + crow.port }) };
								},
								callback: function (that) {
									// 手动执行,data参数包含所有选中的站点
									bt.show_confirm('批量删除域名', "<span style='color:red'>同时删除选中的域名，是否继续？</span>", function () {
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
									});
								},
							},
						],
					},
				],
			});
			setTimeout(function () {
				$(el).append('<ul class="help-info-text c7">' + '<li>如果您的是HTTP项目，且需要映射到外网，请至少绑定一个域名</li>' + '<li>建议所有域名都使用默认的80端口</li>' + '</ul>');
			}, 100);
		},

		/**
		 * @description 渲染Node项目映射
		 * @param el {object} 当前element节点
		 * @param row {object} 当前项目数据
		 */
		reander_node_project_map: function (el, row) {
			var that = this;
			el.html(
				'<div class="pd15"><div class="ss-text mr50" style="display: block;height: 35px;">' +
					'   <em title="外网映射">外网映射</em>' +
					'       <div class="ssh-item">' +
					'           <input class="btswitch btswitch-ios" id="node_project_map" type="checkbox">' +
					'           <label class="btswitch-btn" for="node_project_map" name="node_project_map"></label>' +
					'       </div>' +
					'</div><ul class="help-info-text c7"><li>如果您的是HTTP项目，且需要外网通过80/443访问，请开启外网映射</li><li>开启外网映射前，请到【域名管理】中至少添加1个域名</li></ul></div>'
			);
			$('#node_project_map').attr('checked', row['project_config']['bind_extranet'] ? true : false);
			$('[name=node_project_map]').click(function () {
				var _check = $('#node_project_map').prop('checked'),
					param = { project_name: row.name };
				if (!_check) param['domains'] = row['project_config']['domains'];
				layer.confirm(
					'是否确认' + (!_check ? '开启' : '关闭') + '外网映射！,是否继续',
					{
						title: '外网映射',
						icon: 0,
						closeBtn: 2,
						cancel: function () {
							$('#node_project_map').attr('checked', _check);
						},
					},
					function () {
						that[_check ? 'unbind_node_project_map' : 'bind_node_project_map'](param, function (res) {
							if (!res.status) $('#node_project_map').attr('checked', _check);
							bt.msg({ status: res.status, msg: typeof res.data != 'string' ? res.error_msg : res.data });
							row['project_config']['bind_extranet'] = _check ? 0 : 1;
						});
					},
					function () {
						$('#node_project_map').attr('checked', _check);
					}
				);
			});
		},

		/**
		 * @description 渲染Node项目模块
		 * @param el {object} 当前element节点
		 * @param row {object} 当前项目数据
		 */
		reander_node_project_module: function (el, row) {
			var that = this;
			el.html(
				'<div class="">' +
					'<div class="">' +
					'<select class="bt-input-text mr5" id="pag-select"><option value="npm">npm</option><option value="pnpm">pnpm</option><option value="yarn">yarn</option></select>' +
					'<input class="bt-input-text mr5" name="mname" type="text" value="" style="width:240px" placeholder="模块名称" />' +
					'<button class="btn btn-success btn-sm va0 install_node_module" >安装模块</button>' +
					'<button class="btn btn-success btn-sm va0 pull-right npm_install_node_config">一键安装项目模块</button></div>' +
					'<div id="node_module_list"></div>' +
					'</div>'
			);
			var name = row.project_config.pkg_manager;
			$('#pag-select').val(name);
			var node_project_module_table = bt_tools.table({
				el: '#node_module_list',
				url: '/project/nodejs/get_project_modules',
				default: '未安装模块，点击一键安装项目模块, 数据为空时的默认提示',
				param: { project_name: row.name, project_cwd: row.path },
				height: '580px',
				load: '正在获取模块列表，请稍候...',
				beforeRequest: function (params) {
					if (params.hasOwnProperty('data') && typeof params.data === 'string') return params;
					return { data: JSON.stringify(params) };
				},
				column: [
					{
						fid: 'name',
						title: '模块名称',
						type: 'text',
					},
					{
						fid: 'version',
						title: '版本',
						type: 'text',
						width: '60px',
					},
					{
						fid: 'license',
						title: '协议',
						type: 'text',
						template: function (row) {
							if (typeof row.license === 'object') return '<span>' + row.license.type + '<span>';
							return '<span>' + row.license + '</span>';
						},
					},
					{
						fid: 'description',
						title: '描述',
						width: 290,
						type: 'text',
						template: function (row) {
							return '<span>' + row.description + '<a href="javascript:;"></a></span>';
						},
					},
					{
						title: '操作',
						type: 'group',
						width: '100px',
						align: 'right',
						group: [
							{
								title: '更新',
								event: function (rowc, index, ev, key, rthat) {
									bt.show_confirm('更新模块', "<span style='color:red'>更新[" + rowc.name + ']模块可能会影响项目运行，继续吗？</span>', function () {
										that.upgrade_node_module({ project_name: row.name, mod_name: rowc.name }, function (res) {
											bt.msg({ status: res.status, msg: res.data || res.error_msg });
											rthat.$refresh_table_list(true);
										});
									});
								},
							},
							{
								title: '卸载',
								event: function (rowc, index, ev, key, rthat) {
									bt.show_confirm('卸载模块', "<span style='color:red'>卸载[" + rowc.name + ']模块可能会影响项目运行，继续吗？</span>', function () {
										that.uninstall_node_module({ project_name: row.name, mod_name: rowc.name }, function (res) {
											bt.msg({ status: res.status, msg: res.data || res.error_msg });
											rthat.$refresh_table_list(true);
										});
									});
								},
							},
						],
					},
				],
				success: function (config) {
					// 隐藏一键安装
					if (config.data && config.data.length > 0) $('.npm_install_node_config').addClass('hide');
				},
			});
			//安装模块
			$('.install_node_module').on('click', function () {
				var _mname = $('input[name=mname]').val();
				if (!_mname) return layer.msg('请输入模块名称及版本', { icon: 2 });
				that.npm_install_node_module({ project_name: row.name, mod_name: _mname }, function (res) {
					bt.msg({ status: res.status, msg: res.data || res.error_msg });
					node_project_module_table.$refresh_table_list(true);
				});
			});
			//一键安装项目模块
			$('.npm_install_node_config').on('click', function () {
				var _command = that.request_module_log_command({ shell: 'tail -f /www/server/panel/logs/npm-exec.log' });
				that.install_node_project_packages({ project_name: row.name }, function (res) {
					if (res.status) {
						node_project_module_table.$refresh_table_list(true);
					}
					layer.close(_command);
					bt.msg({ status: res.status, msg: res.data || res.error_msg });
				});
			});
		},

		/**
		 * @description 渲染Node项目伪静态
		 * @param el {object} 当前element节点
		 * @param row {object} 当前项目数据
		 */
		reander_node_project_rewrite: function (el, row) {
			el.empty();
			if (row.project_config.bind_extranet === 0) {
				$('.mask_module').removeClass('hide').find('.node_mask_module_text:eq(1)').hide().prev().show();
				return false;
			}
			site.edit.get_rewrite_list({ name: 'node_' + row.name }, function () {
				$('.webedit-box .line:first').remove();
				$('[name=btn_save_to]').remove();
				$('.webedit-box .help-info-text li:first').remove();
			});
		},
		/**
		 * @description 渲染Node配置文件
		 * @param el {object} 当前element节点
		 * @param row {object} 当前项目数据
		 */
		reander_node_file_config: function (el, row) {
			el.empty();
			if (row.project_config.bind_extranet === 0) {
				$('.mask_module').removeClass('hide').find('.node_mask_module_text:eq(1)').hide().prev().show();
				return false;
			}
			site.edit.set_config({ name: 'node_' + row.name });
		},
		/**
		 * @description 渲染node项目使用情况
		 * @param el {object} 当前element节点
		 * @param row {object} 当前项目数据
		 */
		reander_node_service_condition: function (el, row) {
			if (!row.run) {
				el.html('').next().removeClass('hide');
				if (el.next().find('.node_mask_module_text').length === 1) {
					el.next()
						.find('.node_mask_module_text')
						.hide()
						.parent()
						.append('<div class="node_mask_module_text">请先启动服务后重新尝试，<a href="javascript:;" class="btlink" onclick="site.node.simulated_click(7)">设置服务状态</a></div');
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
			for (var load in row.load_info) {
				if (row.load_info.hasOwnProperty(load)) {
					_option += '<option value="' + load + '">' + load + '</option>';
				}
			}
			var node_pid = $('[name=node_project_pid]');
			node_pid.html(_option);
			node_pid
				.change(function () {
					var _pid = $(this).val(),
						rdata = row['load_info'][_pid],
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
		},

		/**
		 * @description 渲染Node项目日志
		 * @param el {object} 当前element节点
		 * @param row {object} 当前项目数据
		 */
		reander_node_project_log: function (el, row) {
			var that = this;
			el.html('<div class="node_project_log"></div>');
			bt_tools.send(
				{
					url: '/project/nodejs/get_project_log',
					type: 'GET',
					data: { data: JSON.stringify({ project_name: row.name }) },
				},
				function (res) {
					$('#webedit-con .node_project_log').html(
						'<div class="mb10">日志路径 <input type="text" name="model_log_path" id="model_log_path" value="' +
							res.path +
							'" placeholder="日志路径" class="bt-input-text mr10 ml5" style="width:350px" />\
        <span class="glyphicon glyphicon-folder-open cursor mr10" onclick="bt.select_path(\'model_log_path\',\'dir\')"></span>\
        <button class="btn btn-success btn-sm" name="submitLogConfig">保存</button></div>\
        <div class="mb10" style="line-height: 32px;">日志大小<span class="ml10">' +
							res.szie +
							'</span></div>\
        <pre class="command_output_pre" style="height:500px;">' +
							res.data +
							'</pre>'
					);
					$.post({ url: '/project/nodejs/get_log_split', data: { name: row.name } }, function (rdata) {
						var html = '',
							configInfo = {};
						if (rdata.status) configInfo = rdata.data;
						html =
							'开启后' +
							(rdata.status
								? rdata.data.log_size
									? '日志文件大小超过' + bt.format_size(rdata.data.log_size, true, 2, 'MB') + '时，进行切割日志文件'
									: '每天' + rdata.data.hour + '点' + rdata.data.minute + '分进行切割日志文件'
								: '默认每天2点0分进行切割日志文件');
						$('#webedit-con .node_project_log .command_output_pre').before(
							'<div class="inlineBlock log-split mb20" style="line-height: 32px;">\
          <label>\
            <div class="bt-checkbox ' +
								(rdata.status && rdata.data.status ? 'active' : '') +
								'"></div>\
            <span>日志切割</span>\
          </label>\
          <span class="unit">' +
								html +
								'，如需修改请点击<a href="javascript:;" class="btlink mamger_log_split">编辑配置</a></span>\
          </div>'
						);
						$('#webedit-con .node_project_log .log-split').hover(
							function () {
								layer.tips('当日志文件过大时，读取和搜索时间会增加，同时也会占用存储空间，因此需要对日志进行切割以方便管理和维护。', $(this), { tips: [3, '#20a53a'], time: 0 });
							},
							function () {
								layer.closeAll('tips');
							}
						);
						$('#webedit-con .node_project_log label').click(function () {
							if (rdata['is_old']) {
								bt_tools.msg(rdata);
								return;
							}
							bt.confirm(
								{
									title: '设置日志切割任务',
									msg: !rdata.status || (rdata.status && !rdata.data.status) ? '开启后对该项目日志进行切割，是否继续操作？' : '关闭后将无法对该项目日志进行切割，是否继续操作？',
								},
								function () {
									if (rdata.status) {
										bt_tools.send({ url: '/project/nodejs/set_log_split', data: { name: row.name } }, function (res) {
											bt_tools.msg(res);
											if (res.status) {
												that.reander_node_project_log(el, row);
											}
										});
									} else {
										bt_tools.send({ url: '/project/nodejs/mamger_log_split', data: { name: row.name } }, function (res) {
											bt_tools.msg(res);
											if (res.status) {
												that.reander_node_project_log(el, row);
											}
										});
									}
								}
							);
						});
						$('.mamger_log_split').click(function () {
							if (rdata['is_old']) {
								bt_tools.msg(rdata);
								return;
							}
							bt_tools.open({
								type: 1,
								area: '460px',
								title: '配置日志切割任务',
								closeBtn: 2,
								btn: ['提交', '取消'],
								content: {
									class: 'pd20 mamger_log_split_box',
									form: [
										{
											label: '执行时间',
											group: [
												{
													type: 'text',
													name: 'day',
													width: '44px',
													value: '每天',
													disabled: true,
												},
												{
													type: 'number',
													name: 'hour',
													class: 'group',
													width: '70px',
													value: configInfo.hour || '2',
													unit: '时',
													min: 0,
													max: 23,
												},
												{
													type: 'number',
													name: 'minute',
													class: 'group',
													width: '70px',
													min: 0,
													max: 59,
													value: configInfo.minute || '0',
													unit: '分',
												},
											],
										},
										{
											label: '日志大小',
											group: {
												type: 'text',
												name: 'log_size',
												width: '210px',
												value: configInfo.log_size ? bt.format_size(configInfo.log_size, true, 2, 'MB').replace(' MB', '') : '',
												unit: 'MB',
												placeholder: '请输入日志大小',
											},
										},
										{
											label: '保留最新',
											group: {
												type: 'number',
												name: 'num',
												class: 'group',
												width: '70px',
												value: configInfo.num || '180',
												unit: '份',
											},
										},
									],
								},
								success: function (layero, index) {
									$(layero)
										.find('.mamger_log_split_box .bt-form')
										.prepend(
											'<div class="line">\
                <span class="tname">切割方式</span>\
                <div class="info-r">\
                  <div class="replace_content_view" style="line-height: 32px;">\
                    <div class="checkbox_config">\
                      <i class="file_find_radio ' +
												(configInfo.log_size ? 'active' : '') +
												'"></i>\
                      <span class="laberText" style="font-size: 12px;">按日志大小</span>\
                    </div>\
                    <div class="checkbox_config">\
                      <i class="file_find_radio ' +
												(configInfo.log_size ? '' : 'active') +
												'"></i>\
                      <span class="laberText" style="font-size: 12px;">按执行时间</span>\
                    </div>\
                  </div>\
                </div>'
										);
									$(layero)
										.find('.mamger_log_split_box .bt-form')
										.append(
											'<div class="line"><div class=""><div class="inlineBlock  "><ul class="help-info-text c7"><li>每5分钟执行一次</li><li>【日志大小】：日志文件大小超过指定大小时进行切割日志文件</li><li>【保留最新】：保留最新的日志文件，超过指定数量时，将自动删除旧的日志文件</li></ul></div></div></div>'
										);
									$(layero)
										.find('.replace_content_view .checkbox_config')
										.click(function () {
											var index = $(this).index();
											$(this).find('i').addClass('active').parent().siblings().find('i').removeClass('active');
											if (index) {
												$(layero).find('[name=hour]').parent().parent().parent().show();
												$(layero).find('[name=log_size]').parent().parent().parent().hide();
												$(layero).find('.help-info-text li').eq(0).hide().next().hide();
											} else {
												$(layero).find('[name=hour]').parent().parent().parent().hide();
												$(layero).find('[name=log_size]').parent().parent().parent().show();
												$(layero).find('.help-info-text li').eq(0).show().next().show();
											}
										});
									if (configInfo.log_size) {
										$(layero).find('[name=hour]').parent().parent().parent().hide();
									} else {
										$(layero).find('[name=log_size]').parent().parent().parent().hide();
										$(layero).find('.help-info-text li').eq(0).hide().next().hide();
									}
									$(layero)
										.find('[name=log_size]')
										.on('input', function () {
											if ($(this).val() < 1 || !bt.isInteger(parseFloat($(this).val()))) {
												layer.tips('请输入日志大小大于0的的整数', $(this), { tips: [1, 'red'], time: 2000 });
											}
										});
									$(layero)
										.find('[name=hour]')
										.on('input', function () {
											if ($(this).val() > 23 || $(this).val() < 0 || !bt.isInteger(parseFloat($(this).val()))) {
												layer.tips('请输入小时范围0-23的整数时', $(this), { tips: [1, 'red'], time: 2000 });
											}
											$(layero).find('.hour').text($(this).val());
										});
									$(layero)
										.find('[name=minute]')
										.on('input', function () {
											if ($(this).val() > 59 || $(this).val() < 0 || !bt.isInteger(parseFloat($(this).val()))) {
												layer.tips('请输入正确分钟范围0-59分的整数', $(this), { tips: [1, 'red'], time: 2000 });
											}
											$(layero).find('.minute').text($(this).val());
										});
									$(layero)
										.find('[name=num]')
										.on('input', function () {
											if ($(this).val() < 1 || $(this).val() > 1800 || !bt.isInteger(parseFloat($(this).val()))) {
												layer.tips('请输入保留最新范围1-1800的整数', $(this), { tips: [1, 'red'], time: 2000 });
											}
										});
								},
								yes: function (formD, indexs) {
									formD['name'] = row.name;
									delete formD['day'];
									if ($('.mamger_log_split_box .file_find_radio.active').parent().index()) {
										if (formD.hour < 0 || formD.hour > 23 || isNaN(formD.hour) || formD.hour === '' || !bt.isInteger(parseFloat(formD.hour))) return layer.msg('请输入小时范围0-23时的整数');
										if (formD.minute < 0 || formD.minute > 59 || isNaN(formD.minute) || formD.minute === '' || !bt.isInteger(parseFloat(formD.minute)))
											return layer.msg('请输入正确分钟范围0-59分的整数');
										formD['log_size'] = 0;
									} else {
										if (formD.log_size == '' || !bt.isInteger(parseFloat(formD.log_size))) return layer.msg('请输入日志大小大于0的的整数');
									}
									if (formD.num < 1 || formD.num > 1800 || !bt.isInteger(parseFloat(formD.num))) return layer.msg('请输入保留最新范围1-1800的整数');
									if (!rdata.status || (rdata.status && !rdata.data.status)) {
										if (rdata.status) {
											bt_tools.send({ url: '/project/nodejs/set_log_split', data: { name: row.name } }, function (res) {
												if (res.status) {
													pub_open();
												}
											});
										} else {
											pub_open();
										}
									} else {
										pub_open();
									}
									function pub_open() {
										bt_tools.send({ url: '/project/nodejs/mamger_log_split', data: formD }, function (res) {
											bt.msg(res);
											if (res.status) {
												that.reander_node_project_log(el, row);
												layer.close(indexs);
											}
										});
									}
								},
							});
						});
					});
					// 保存按钮
					$('[name="submitLogConfig"]')
						.unbind('click')
						.click(function () {
							var path = $('#model_log_path').val();
							if (!path) {
								bt.msg({ status: false, msg: '日志路径不能为空' });
								return;
							}
							bt_tools.send(
								{
									url: '/project/nodejs/change_log_path',
									type: 'GET',
									data: { data: JSON.stringify({ project_name: row.name, path: path }) },
								},
								function (rdata) {
									bt.msg(rdata);
									that.reander_node_project_log(el, row);
								}
							);
						});
					$('.command_output_pre').scrollTop($('.command_output_pre').prop('scrollHeight'));
				},
				{ load: '获取Node项目日志', verify: false }
			);
		},

		reander_node_site_log: function (el, row) {
			el.empty();
			if (row.project_config.bind_extranet === 0) {
				$('.mask_module').removeClass('hide').find('.node_mask_module_text:eq(1)').hide().prev().show();
				return false;
			}
			site.edit.get_site_logs({ name: row.name });
		},

		/**
		 * @description node项目SSL
		 * @param el {object} 当前element节点
		 * @param row {object} 当前项目数据
		 */
		reander_node_project_ssl: function (el, row) {
			el.empty();
			if (row.project_config.bind_extranet === 0) {
				$('.mask_module').removeClass('hide').find('.node_mask_module_text:eq(1)').hide().prev().show();
				return false;
			}
			site.set_ssl({ name: row.name, ele: el, id: row.id });
			site.ssl.reload();
		},
		/**
		 * @description 请求模块日志终端
		 * @param config {object} 当前配置数据
		 */
		request_module_log_command: function (config) {
			var r_command = layer.open({
				title: config.name || '正在安装模块，请稍候...',
				type: 1,
				closeBtn: 0,
				area: ['500px', '342px'],
				skin: config.class || 'module_commmand',
				shadeClose: false,
				content: '<div class="site_module_command"></div>',
				success: function () {
					bt_tools.command_line_output({ el: '.site_module_command', shell: config.shell, area: config.area || ['100%', '300px'] });
				},
			});
			return r_command;
		},

		/**
		 * @description 请求封装
		 * @param keyMethod 接口名和loading，键值对
		 * @param param {object || function} 参数，可为空，为空则为callback参数
		 * @param callback {function} 成功回调函数
		 * @param callback1 {function} 错误调函数
		 */
		http: function (keyMethod, param, callback, callback1) {
			var method = Object.keys(keyMethod),
				config = {
					url: '/project/nodejs/' + method[0],
					data: (param && { data: JSON.stringify(param) }) || {},
				},
				success = function (res) {
					callback && callback(res);
				};
			if (callback1) {
				bt_tools.send(config, success, callback1, { load: keyMethod[method[0]], verify: method[1] ? keyMethod[method[1]] : true });
			} else {
				bt_tools.send(config, success, { load: keyMethod[method[0]], verify: method[1] ? keyMethod[method[1]] : true });
			}
		},
	},
	node_porject_view: function () {
		$('#bt_node_table').empty();
		node_table = bt_tools.table({
			el: '#bt_node_table',
			url: '/project/nodejs/get_project_list',
			minWidth: '1000px',
			autoHeight: true,
			default: '项目列表为空', //数据为空时的默认提示\
			load: '正在获取Node项目列表，请稍候...',
			pageName: 'nodejs',
			beforeRequest: function (params) {
				if (params.hasOwnProperty('data') && typeof params.data === 'string') {
					var oldParams = JSON.parse(params['data']);
					delete params['data'];
					return { data: JSON.stringify($.extend(oldParams, params)) };
				}
				return { data: JSON.stringify(params) };
			},
			column: [
				{ type: 'checkbox', class: '', width: 20 },
				{
					fid: 'name',
					title: '项目名称',
					width: 120,
					type: 'link',
					event: function (row, index, ev) {
						site.node.set_node_project_view(row);
					},
				},
				{
					fid: 'run',
					title: '服务状态',
					width: 80,
					// config: {
					//   icon: true,
					//   list: [
					//     [true, '运行中', 'bt_success', 'glyphicon-play'],
					//     [false, '未启动', 'bt_danger', 'glyphicon-pause']
					//   ]
					// },
					template: function (row) {
						return (
							'<a class="btlink ' +
							(row.run ? 'bt_success' : 'bt_danger') +
							' status_tips" data-type="node" data-project="' +
							row.id +
							'" data-name="' +
							row.name +
							'" data-status="' +
							row.run +
							'" href="javascript:;">\
              <span>' +
							(row.run ? '运行中' : '未启动') +
							'</span>\
              <span class="glyphicon ' +
							(row.run ? 'glyphicon-play' : 'glyphicon-pause') +
							'"></span>\
            </a>'
						);
					},
					// type: 'status',
					event: function (row, index, ev, key, that) {
						var status = row.run;
						bt.confirm(
							{
								title: status ? '停止项目' : '启动项目',
								msg: status ? '停止项目后，当前项目服务将停止运行，继续吗？' : '启用Node项目[' + row.name + '],继续操作?',
							},
							function (index) {
								layer.close(index);
								site.node[status ? 'stop_node_project' : 'start_node_project']({ project_name: row.name }, function (res) {
									bt.msg({ status: res.status, msg: res.data || res.error_msg });
									that.$refresh_table_list(true);
								});
							}
						);
					},
				},
				{
					fid: 'pid',
					title: 'PID',
					width: 140,
					type: 'text',
					template: function (row) {
						if ($.isEmptyObject(row['load_info'])) return '<span>-</span>';
						var _id = [];
						for (var i in row.load_info) {
							if (row.load_info.hasOwnProperty(i)) {
								_id.push(i);
							}
						}
						return '<span class="size_ellipsis" style="width:180px" title="' + _id.join(',') + '">' + _id.join(',') + '</span>';
					},
				},
				{
					title: 'CPU',
					width: 60,
					type: 'text',
					template: function (row) {
						if ($.isEmptyObject(row['load_info'])) return '<span>-</span>';
						var _cpu_total = 0;
						for (var i in row.load_info) {
							_cpu_total += row.load_info[i]['cpu_percent'];
						}
						return '<span>' + _cpu_total.toFixed(2) + '%</span>';
					},
				},
				{
					title: '内存',
					width: 80,
					type: 'text',
					template: function (row) {
						if ($.isEmptyObject(row['load_info'])) return '<span>-</span>';
						var _cpu_total = 0;
						for (var i in row.load_info) {
							_cpu_total += row.load_info[i]['memory_used'];
						}
						return '<span>' + bt.format_size(_cpu_total) + '</span>';
					},
				},
				{
					fid: 'path',
					title: '根目录',
					width: 220,
					type: 'link',
					event: function (row, index, ev) {
						openPath(row.path);
					},
				},
				{
					// title: '<span style="display:flex"><span '+(bt.get_cookie('ltd_end')>0?' style="cursor:text" ':'onclick="bt.soft.product_pay_view({ totalNum: 67, limit: \'ltd\', closePro: true })"')+'  class="firwall_place_of_attribution"></span>目录详情</span>',
					title: '目录详情',
					width: 140,
					type: 'text',
					template: function (row, index, ev) {
						return bt.files.dir_details_span(row.path);
					},
				},
				{
					fid: 'ps',
					title: '备注',
					type: 'input',
					width: 100,
					blur: function (row, index, ev, key, that) {
						if (row.ps == ev.target.value) return false;
						bt.pub.set_data_ps({ id: row.id, table: 'sites', ps: ev.target.value }, function (res) {
							bt_tools.msg(res, { is_dynamic: true });
						});
					},
					keyup: function (row, index, ev) {
						if (ev.keyCode === 13) {
							$(this).blur();
						}
					},
				},
				{
					fid: 'node_version',
					width: 100,
					title: 'Node版本',
					type: 'text',
					template: function (row) {
						return '<span>' + row['project_config']['nodejs_version'] + '</span>';
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
							_info += _arry[i][1] + ':' + item + (_arry.length - 1 != i ? '\n' : '');
						}
						return row.ssl === -1
							? '<a class="btlink bt_warning" href="javascript:;">未部署</a>'
							: '<a class="btlink ' + (row.ssl.endtime < 7 ? 'bt_danger' : '') + '" href="javascript:;" title="' + _info + '">剩余' + row.ssl.endtime + '天</a>';
					},
					event: function (row) {
						site.node.set_node_project_view(row);
						setTimeout(function () {
							$('.site-menu p:eq(5)').click();
						}, 500);
					},
				},
				{
					title: '操作',
					type: 'group',
					width: 220,
					align: 'right',
					group: [
						{
							title: '设置',
							event: function (row, index, ev, key, that) {
								site.node.set_node_project_view(row);
							},
						},
						{
							title: '删除',
							event: function (row, index, ev, key, that) {
								bt.prompt_confirm('删除项目', '您正在删除Node项目-[' + row.name + ']，继续吗？', function () {
									site.node.remove_node_project({ project_name: row.name }, function (res) {
										bt.msg({ status: res.status, msg: res.data || res.error_msg });
										node_table.$refresh_table_list(true);
									});
								});
							},
						},
					],
				},
			],
			sortParam: function (data) {
				return { order: data.name + ' ' + data.sort };
			},
			// 渲染完成
			tootls: [
				{
					// 按钮组
					type: 'group',
					positon: ['left', 'top'],
					list: [
						{
							title: '添加Node项目',
							active: true,
							event: function (ev) {
								site.node.add_node_form(function (res, index) {
									if (res.status) {
										layer.close(index);
										node_table.$refresh_table_list(true);
									}
									layer.msg((!Array.isArray(res.data) ? res.data : false) || res.error_msg, { icon: res.status ? 1 : 2, shade: [0.3, '#000'], shadeClose: true, time: 0 });
									bt.msg({ status: res.status, msg: (!Array.isArray(res.data) ? res.data : false) || res.error_msg });
								});
							},
						},
						{
							title: 'Node版本管理器',
							event: function (ev) {
								bt.soft.set_lib_config('nodejs', 'Node.js版本管理器');
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
							title: '部署证书',
							callback: function (that) {
								site.set_ssl_cert(that);
							},
						},
						{
							title: '删除项目',
							url: '/project/nodejs/remove_project',
							param: function (row) {
								return {
									data: JSON.stringify({ project_name: row.name }),
								};
							},
							refresh: true,
							callback: function (that) {
								bt.prompt_confirm('批量删除项目', '您正在删除选中的Node项目，继续吗？', function () {
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
												(item.requests.status ? item.requests.data : item.requests.error_msg) +
												'</span></div></td></tr>';
										}
										node_table.$batch_success_table({ title: '批量删除项目', th: '项目名称', html: html });
										node_table.$refresh_table_list(true);
									});
								});
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
				if ($('#bt_node_table .tootls_top .pull-left .bt-desired').length === 0) {
					$('#bt_node_table .tootls_top .pull-left').append('<span class="bt-desired ml10" style="background-size:contain;"><a href="javascript:;" class="btlink ml5 npsFeedback">需求反馈</a></span>');
					// 网站nps入口
					$('.npsFeedback').on('click', function () {
						bt_tools.nps({ name: '网站', type: 14 });
					});
				}
				// 服务状态事件
				site.server_status_event();
				// 详情事件
				bt.files.dir_details();
			},
		});
	},
	server_status_event: function (param2, temp) {
		if (temp) {
			getPushList(param2, function (obj) {
				if (!$.isEmptyObject(obj)) {
					$('.isServerStop').prop('checked', obj.status);
				}
				// 项目停止状态开关改变事件
				$('.isServerStop').change(function () {
					var data = $(this).data();
					if ($.isEmptyObject(obj)) {
						openServerStopSet(data);
					} else {
						var data = obj,
							id = data.key;
						delete data['key'];
						data.status = $(this).prop('checked');
						bt_tools.send(
							{ url: '/push?action=set_push_config', data: { data: JSON.stringify(data), name: 'site_push', id: id } },
							function (res) {
								bt_tools.msg(res);
							},
							'设置告警任务'
						);
					}
				});

				// 点击告警设置
				$('.serverStopSet')
					.unbind('click')
					.click(function () {
						var data = $(this).data();
						openServerStopSet(data);
					});
			});
		} else {
			$('.status_tips')
				.parent()
				.hover(
					function () {
						var _status_tips = $(this).find('.status_tips'),
							data = _status_tips.data();
						_status_tips.next().remove();
						_status_tips.after(
							'<div class="status_tips_cont">\
					<a class="btlink" href="javascript:;">' +
								(!data.status ? '开启' : '停用') +
								'</a>&nbsp;&nbsp;|&nbsp;&nbsp;\
					<a class="btlink" href="javascript:;">重启</a>&nbsp;&nbsp;|&nbsp;&nbsp;\
					<a class="btlink" href="javascript:;">告警设置</a>\
				</div>'
						);
						$(this)
							.find('.status_tips_cont a')
							.unbind('click')
							.click(function () {
								var index = $(this).index();
								if (index === 2) {
									openServerStopSet(data);
								} else {
									var isPython = data.type === 'python';
									var url =
										'/project/' +
										(data.type === 'node' ? 'nodejs' : data.type) +
										'/' +
										(index ? (isPython ? 'RestartProject' : 'restart_project') : data.status ? (isPython ? 'StopProject' : 'stop_project') : isPython ? 'StartProject' : 'start_project');
									var params = {};
									switch (data.type) {
										case 'java':
										case 'node':
										case 'go':
											url = '/project/' + (data.type === 'node' ? 'nodejs' : data.type) + '/' + (index ? 'restart_project' : data.status ? 'stop_project' : 'start_project');
											params = {
												data: JSON.stringify({ project_name: data.name }),
											};
											break;
										case 'python':
											url = '/project/python/' + (index ? 'RestartProject' : data.status ? 'StopProject' : 'StartProject');
											params = {
												data: JSON.stringify({ name: data.name }),
											};
											break;
										default:
											url = '/project/other/' + (index ? 'restart_project' : data.status ? 'stop_project' : 'start_project');
											params = {
												data: JSON.stringify({ project_name: data.name }),
											};
											break;
									}
									bt_tools.send(
										{ url: url, data: params },
										function (res) {
											bt_tools.msg({ status: res.status, msg: res.data || res.msg });
											if (res.status) {
												if (site.model_table) site.model_table.$refresh_table_list(true);
												if (node_table) node_table.$refresh_table_list(true);
												if (site.javaModle) site.javaModle.get_project_list();
											}
										},
										'修改项目服务状态'
									);
								}
							});
					},
					function () {
						$(this).find('.status_tips').next().remove();
					}
				);
		}
		// 打开项目停止告警设置弹窗
		function openServerStopSet(param) {
			getPushList(param, function (obj) {
				// 项目不存在告警任务或者 点击打开弹窗
				bt_tools.open({
					title: '项目【' + param.name + '】异常停止告警设置',
					area: '500px',
					btn: ['确定', '取消'],
					content: {
						class: 'pd20',
						data: obj,
						form: [
							{
								label: '告警状态',
								group: [
									{
										type: 'other',
										boxcontent:
											'<div class="mr10 alert_status_input"  style="vertical-align: -19px;display: inline-block;">\
											<input class="btswitch btswitch-ios" name="status" id="status" type="checkbox" ' +
											(obj.status || $.isEmptyObject(obj) ? 'checked' : '') +
											'>\
											<label class="btswitch-btn" for="status"></label>\
										</div>',
									},
								],
							},
							{
								label: '间隔时间',
								group: [
									{
										class: 'group groupUnit',
										name: 'interval',
										type: 'number',
										width: '100px',
										value: 600,
										min: 60,
										unit: '秒',
									},
									{
										class: 'ml10',
										type: 'text-tips',
										unit: '后再次监控检测条件',
									},
								],
							},
							{
								label: '每天发送',
								group: [
									{
										class: 'group groupUnit',
										name: 'push_count',
										type: 'number',
										width: '100px',
										value: 3,
										min: 0,
										unit: '次',
									},
									{
										class: 'ml10',
										type: 'text-tips',
										unit: '后，当日不再发送，次日恢复',
									},
								],
							},
							{
								label: '告警方式',
								group: [
									{
										type: 'other',
										boxcontent: '<div class="installPush"></div>',
									},
								],
							},
							{
								group: [
									{
										type: 'help',
										style: 'margin-top: 0;',
										list: ['点击配置后状态未更新，尝试点击【 <a class="handRefresh btlink">手动刷新</a> 】'],
									},
								],
							},
						],
					},
					success: function (layero) {
						renderConfigHTML();
						// 手动刷新
						$('.handRefresh').click(function () {
							renderConfigHTML();
						});
						// 获取配置
						function renderConfigHTML() {
							bt.site.get_msg_configs(function (rdata) {
								var html = '',
									unInstall = '';
								for (var key in rdata) {
									var item = rdata[key],
										_html = '',
										accountConfigStatus = false;
									if (key == 'sms') continue;
									if (key === 'wx_account') {
										if (!$.isEmptyObject(item.data) && item.data.res.is_subscribe && item.data.res.is_bound) {
											accountConfigStatus = true; //安装微信公众号模块且绑定
										}
									}
									_html =
										'<div class="inlineBlock module-check ' +
										(!item.setup || $.isEmptyObject(item.data) ? 'check_disabled' : key == 'wx_account' && !accountConfigStatus ? 'check_disabled' : '') +
										'">' +
										'<div class="cursor-pointer form-checkbox-label mr10">' +
										'<i class="form-checkbox cust—checkbox cursor-pointer mr5 ' +
										(!$.isEmptyObject(obj) && obj.module && obj.module.indexOf(item.name) > -1
											? !item.setup || $.isEmptyObject(item.data)
												? ''
												: key == 'wx_account' && !accountConfigStatus
												? ''
												: 'active'
											: '') +
										'" data-type="' +
										item.name +
										'"></i>' +
										'<input type="checkbox" class="form—checkbox-input hide mr10" name="' +
										item.name +
										'" ' +
										(item.setup || !$.isEmptyObject(item.data) ? (key == 'wx_account' && !accountConfigStatus ? '' : 'checked') : '') +
										'/>' +
										'<span class="vertical_middle" title="' +
										item.ps +
										'">' +
										item.title +
										(!item.setup || $.isEmptyObject(item.data)
											? '[<a target="_blank" class="bterror installNotice" data-type="' + item.name + '">未配置</a>]'
											: key == 'wx_account' && !accountConfigStatus
											? '[<a target="_blank" class="bterror installNotice" data-type="' + item.name + '">未配置</a>]'
											: '') +
										'</span>' +
										'</div>' +
										'</div>';
									if (!item.setup || $.isEmptyObject(item.data)) {
										unInstall += _html;
									} else {
										html += _html;
									}
								}
								$('.installPush').html(html + unInstall);
								if (!$('.installPush .active').length && html != '') {
									$('.installPush .module-check:eq(0) input').prop('checked', true).prev().addClass('active');
								}
								// 安装消息通道
								$('.installPush .form-checkbox-label')
									.unbind('click')
									.on('click', function () {
										var that = $(this).find('i');
										if (!that.parent().parent().hasClass('check_disabled')) {
											if (that.hasClass('active')) {
												that.removeClass('active');
												that.next().prop('checked', false);
											} else {
												that.addClass('active');
												that.next().prop('checked', true);
											}
										}
									});

								$('.installPush .installNotice')
									.unbind('click')
									.on('click', function () {
										var type = $(this).data('type');
										openAlertModuleInstallView(type);
									});
							});
						}
						// 监控频率
						$('input[type=number]').on('input', function () {
							var val = $(this).val(),
								isInterval = $(this).prop('name') === 'interval';
							layer.closeAll('tips');
							if ((!isInterval && val <= 0) || (isInterval && val < 60) || val === '' || !bt.isInteger(parseFloat(val))) {
								layer.tips('数值范围为大于' + (isInterval ? '60' : '0') + '的正整数', $(this), { tips: [1, '#ff0000'], time: 3000 });
							}
						});
					},
					yes: function (form, indexs) {
						var arry = [],
							data = {},
							id = new Date().getTime();
						$('.installPush .active').each(function (item) {
							var item = $(this).attr('data-type');
							arry.push(item);
						});
						if (!arry.length) return layer.msg('请选择至少一种告警通知方式', { icon: 2 });
						if (form.interval < 60 || form.interval === '' || !bt.isInteger(parseFloat(form.interval))) return layer.msg('间隔时间范围应为大于60的正整数', { icon: 2, time: 2000 });
						if (form.push_count <= 0 || form.push_count === '' || !bt.isInteger(parseFloat(form.push_count))) return layer.msg('每天发送次数应为正整数', { icon: 2, time: 2000 });
						if (!$.isEmptyObject(obj)) {
							obj.module = arry.join(',');
							obj.interval = parseInt(form.interval);
							obj.push_count = parseInt(form.push_count);
							obj.status = form.status;
							data = obj;
							id = data.key;
							delete data['key'];
						} else {
							var cycle = {
								java: 1,
								node: 2,
								go: 3,
								python: 4,
								通用: 5,
							};
							data = {
								tid: 'site_push@9',
								type: 'project_status',
								cycle: cycle[param.type],
								count: 0,
								interval: parseInt(form.interval),
								module: arry.join(','),
								title: '项目停止告警',
								push_count: parseInt(form.push_count),
								project: param.project,
								status: form.status,
							};
						}
						bt_tools.send(
							{ url: '/push?action=set_push_config', data: { name: 'site_push', data: JSON.stringify(data), id: id } },
							function (res) {
								bt_tools.msg(res);
								if (res.status) {
									layer.close(indexs);
									if (temp) $('.bt-w-menu.site-menu .bgw').click();
								}
							},
							'设置告警任务'
						);
					},
				});
			});
		}
		// 请求告警任务列表
		function getPushList(param, callback) {
			var data = {};
			bt_tools.send({ url: '/push?action=get_push_list' }, function (res) {
				if (res.hasOwnProperty('site_push') && !$.isEmptyObject(res.site_push)) {
					for (var key in res.site_push) {
						if (res.site_push.hasOwnProperty(key)) {
							if (res.site_push[key].project === param.project) {
								data = res.site_push[key];
								data['key'] = key;
							}
						}
					}
				}
				if (callback) callback(data);
			});
		}
	},
	php_table_view: function () {
		var _this = this,
			recomConfig = product_recommend.get_recommend_type(5), //推荐插件
			renderNum = 0, //渲染次数
			eventStatus = true, //事件状态
			trafficInfo = { flow_type: 'total_flow', flow_name: '总流量' }, //流量信息
			trafficType = [], //流量类型
			isLtd = bt.get_cookie('ltd_end') > 0; //是否购买企业版
		$('#bt_site_table').empty();
		bt.send('GetPHPVersion', 'site/GetPHPVersion', {}, function (rdata) {
			site_table = bt_tools.table({
				el: '#bt_site_table',
				headerId: 'PHP_Site',
				url: '/data?action=getData',
				param: { table: 'sites' }, //参数
				minWidth: '1000px',
				autoHeight: true,
				default: '站点列表为空', //数据为空时的默认提示
				pageName: 'php',
				beforeRequest: function (param) {
					param.type = bt.get_cookie('site_type') || -1;
					param.search = $('#bt_site_table .pull-right .bt_search').find('[placeholder="请输入域名或备注"]').val();
					// 判断是否手动切换了分页数量
					param.limit = param.isCut ? param.limit : '';
					delete param.isCut;
					return param;
				},
				dataFilter: function (res) {
					// 数据清空
					trafficType = [];
					var thatTrafficName = '总流量',
						isFlowInfo = !$.isEmptyObject(res.net_flow_info);
					// 流量类型重构
					$.each(res.net_flow_type, function (index, item) {
						var key = Object.keys(item)[0];
						trafficType.push([key, Object.values(item)[0]]);
						if (isFlowInfo && key == res.net_flow_info.flow_type) thatTrafficName = Object.values(item)[0];
					});
					if (isFlowInfo) trafficInfo = $.extend({}, res.net_flow_info, { flow_name: thatTrafficName });
					_this.search_hi = res;
					$('#bt_site_table .table th').removeClass('bg-sort')
					if(res.plist && res.plist.order) {
						$('.clear-sort').remove()
						$('.bg-sort').remove()
						var orderFid = res.plist.order.split(' ')[0],_th = $('#bt_site_table .table th.'+(orderFid === 'site_ssl' ? 'ssl' : orderFid))
						_th.addClass('bg-sort')
						if(!_th.find('.clear-sort').length) _th.find('.not-select').append('<a class="clear-sort btlink">清除排序</a>')
						$('.bg-sort').hover(function () {
							$(this).find('.clear-sort').removeClass('hide')
						},function () {
							$(this).find('.clear-sort').addClass('hide')
						})
						$('.clear-sort').unbind('click').click(function (e) {
							bt_tools.send({url: 'data?action=del_sorted'},function (res) {
								bt_tools.msg(res)
								if(res.status) {
									$('.clear-sort').remove()
									site_table.config.param.order = ''
									site_table.config.sort.order = ''
									site_table.$refresh_table_list()
								}
							},'清除排序')
						})
					}else {
						$('.clear-sort').remove()
						$('.bg-sort').remove()
					}
					return res;
				},
				setting_btn: true, //是否显示设置按钮
				setting_list: [{ title: 'WAF状态', value: true, class: 'site_waf_icon', disabled: false, pay: true }], //单独显示隐藏某个样式
				column: [
					{
						type: 'checkbox',
						fid:'id',
						class: '',
						width: 20,
						isDisabled: true,
					},
					{
						fid: 'rname',
						title: '网站名',
						class:'site_name',
						sort: true,
						sortValue: 'asc',
						type: 'link',
						isDisabled: true,
						template: function (row, index) {
							var install = false;
							var recomConfig = product_recommend.get_recommend_type(5);
							if (recomConfig) {
								for (var j = 0; j < recomConfig['list'].length; j++) {
									var item = recomConfig['list'][j];
									if (item.name == 'btwaf' || item.name == 'btwaf_httpd') {
										if (item.install === true) install = true;
									}
								}
							}
							if (!$.isEmptyObject(row.waf) && row.waf.status && install)
								return (
									'<div style="display:flex;align-items:center"><span title="WAF防火墙，保护网站安全" class="site_waf_icon_green site_waf_icon" data-name="' +
									row.name +
									'" id="site_waf_icon' +
									index +
									'"></span><a class="btlink" href="javascript:;">' +
									row.name +
									'</a></div>'
								);

							return (
								'<div style="display:flex;align-items:center"><span title="WAF防火墙，开启保护网站安全" class="site_waf_icon_grey site_waf_icon" data-name="' +
								row.name +
								'" id="site_waf_icon' +
								index +
								'"></span><a class="btlink" href="javascript:;">' +
								row.name +
								'</a></div>'
							);
						},
						event: function (row) {
							site.web_edit(row, true);
						},
					},
					{
						fid: 'status',
						title: '状态',
						sort: true,
                      width: 70,
						config: {
							icon: true,
							list: [
								['1', '运行中', 'bt_success', 'glyphicon-play'],
								['0', '已停止', 'bt_danger', 'glyphicon-pause'],
							],
						},
						type: 'status',
						event: function (row, index, ev, key, that) {
							var time = row.edate || row.endtime;
							if (time != '0000-00-00') {
								if (new Date(time).getTime() < new Date().getTime()) {
									layer.msg('当前站点已过期，请重新设置站点到期时间', { icon: 2 });
									return false;
								}
							}
							bt.site[parseInt(row.status) ? 'stop' : 'start'](row.id, row.name, function (res) {
								if (res.status) that.$modify_row_data({ status: parseInt(row.status) ? '0' : '1' });
							});
						},
					},
					{
						fid: 'backup_count',
						title: '备份',
						width: 60,
						type: 'link',
						template: function (row, index) {
							var backup = lan.site.backup_no,
								_class = 'bt_warning';
							if (row.backup_count > 0) (backup = lan.site.backup_yes), (_class = 'bt_success');
							return '<a href="javascript:;" class="btlink  ' + _class + '">' + backup + (row.backup_count > 0 ? '(' + row.backup_count + ')' : '') + '</a>';
						},
						event: function (row, index) {
							site.backup_site_view({ id: row.id, name: row.name }, site_table);
						},
					},
					{
						fid: 'path',
						title: '根目录',
						width: 220,
						type: 'link',
						template: function (row, index) {
							var spath = row.path.split('/');
							var sites_path = '';
							$.each(spath, function (i, item) {
								if (i != spath.length - 1 && item != '') {
									sites_path += item + '/';
								}
							});
							return '<div class="flex align-center">\
							    <span title="点击打开目录" class="path-icon" onclick="openPath(\''+row.path+'\')"></span>\
							    <div class="path_detail" title="'+ row.path +'">\
    							    <div class="dir_details flex align-center" data-id="'+row.id+'" data-path="'+ row.path +'" data-size="'+row.quota.size+'">\
    							    <span class="btlink path_detail_text" onclick="openPath(\''+row.path+'\')">'+row.path+'</span>\
    							    </div>';
						},
						event: function (row, index, ev) {
							openPath(row.path);
						},
					},
					{
						fid: 'quota',
						title: '容量限制',
						display: false,
						pay: true,
						// title: '<span style="display:flex"><span '+(bt.get_cookie('ltd_end')>0?' style="cursor:text" ':'onclick="bt.soft.product_pay_view({ totalNum: '+pay_num+', limit: \'ltd\', closePro: true })"')+' class="firwall_place_of_attribution"></span>容量</span>',
						width: 65,
						template: function (row, index) {
							var quota = row.quota;
							if (!quota.size) return '<a href="javascript:;" class="btlink" title="点击配置容量配额">未配置</a>';
							var size = quota.size * 1024 * 1024;
							var speed = ((quota.used / size) * 100).toFixed(2);
							var quotaFull = false;
							if (quota.size > 0 && quota.used >= size) quotaFull = true;
							return (
								'<div class=""><div class="progress mb0 cursor" style="height:12px;line-height:12px;border-radius:2px;width: 80px;position: relative;" title="当前已用容量：' +
								(quotaFull ? '已用完' : bt.format_size(quota.used)) +
								'\n当前容量配额：' +
								bt.format_size(size) +
								'\n点击修改容量配额">' +
								'<div class="progress-bar progress-bar-' +
								(speed >= 90 ? 'danger' : 'success') +
								'" style="height:15px;line-height:15px;width: ' +
								speed +
								'%;display: inline-block;" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>' +
								'</div>'
							);
						},
						event: function (row, index, ev) {
							site.web_edit(row);
							setTimeout(function () {
								$('.site-menu p:eq(2)').click();
								setTimeout(function () {
									$('#webedit-con .tab-nav span:eq(1)').click();
								}, 300);
							}, 500);
						},
					},
					{
						title: '目录分析',
						fid:'dirDetails',
						display: false,
						width: 65,
						pay: true,
						type: 'link',
						tips: '点击查看当前站点目录磁盘占用情况',
						template: function (row, index) {
							return '查看';
						},
						event: function (row, index, ev) {
							//判断是否安装插件
							bt.soft.get_soft_find('disk_analysis', function (dataRes) {
								if (dataRes.setup && dataRes.endtime > 0) {
									bt.set_cookie('diskPath', row.path);
									bt.soft.set_lib_config(dataRes.name, dataRes.title, dataRes.version);
								} else {
									var ltd_end = bt.get_cookie('ltd_end') < 0;
									if (ltd_end) {
										var item = {
											name: dataRes.name,
											pluginName: dataRes.title,
											ps: '急速分析磁盘/硬盘占用情况',
											preview: false,
											limit: 'ltd',
											description: ['检测硬盘空间使用情况', '快速分析占用大量文件'],
											imgSrc: 'https://www.bt.cn/Public/new/plugin/disk_analysis/1.png',
										};
										bt.soft.product_pay_view({
											totalNum: 121,
											limit: 'ltd',
											closePro: true,
											pluginName: '堡塔硬盘分析工具',
											fun: function () {
												product_recommend.recommend_product_view(
													item,
													{
														imgArea: ['783px', '718px'],
													},
													'ltd',
													121,
													item.name,
													true
												);
											},
										});
									} else {
										bt.soft.install('disk_analysis');
									}
								}
							});
						},
					},
					// {
					//     title: '<span style="display:flex"><span '+(bt.get_cookie('ltd_end')>0?' style="cursor:text" ':'onclick="bt.soft.product_pay_view({ totalNum: 67, limit: \'ltd\', closePro: true })"')+'  class="firwall_place_of_attribution"></span>目录详情</span>',
					//     type: 'text',
					//     width:120,
					//     template:function(row,index,ev){
					//       return bt.files.dir_details_span(row.path);
					//     },
					// },
					{
						fid: 'total_flow',
						pay: true,
						real_title: '流量',
						// title: '<span style="cursor:text;vertical-align: -4px;" '+(bt.get_cookie('ltd_end')>0?'':'onclick="bt.soft.product_pay_view({ totalNum: 142, limit: \'ltd\', closePro: true })"')+' class="firwall_place_of_attribution"></span><span class="netTitle">流量</span> <i class="btlink site_traffic--btn">(切换)</i>',
						title: '<span class="netTitle">流量</span> <i class="btlink site_traffic--btn">(切换)</i>',
						sort: true,
						width: 140,
						template: function (row) {
							if (recomConfig) {
								var re_is_install = recomConfig.list.length && recomConfig.list[1].install;
								//监控是否安装、购买企业版
								if (isLtd && re_is_install) {
									return '<span style="max-width:100px;display: inline-block;">' + bt.format_size(row.net[trafficInfo.flow_type]) + '</span>';
								} else {
									return '<span style="max-width:100px;display: inline-block;" class="btlink traffic_plugin--install">查看</span>';
								}
							} else {
								return '<span style="max-width:100px;display: inline-block;" class="btlink traffic_plugin--install"></span>';
							}
						},
					},
					{
						fid: 'edate',
						title: '到期时间',
						width: 85,
						class: 'set_site_edate',
						sort: true,
						type: 'link',
						template: function (row, index) {
							var _endtime = row.edate || row.endtime;
							if (_endtime === '0000-00-00') {
								return lan.site.web_end_time;
							} else {
								if (new Date(_endtime).getTime() < new Date().getTime()) {
									return '<a href="#" class="bt_danger">' + _endtime + '</a>';
								} else {
									return _endtime;
								}
							}
						},
						event: function (row) {}, //模拟点击误删
					},
					{
						fid: 'ps',
						title: '备注',
						type: 'input',
						blur: function (row, index, ev, key, that) {
							if (row.ps == ev.target.value) return false;
							bt.pub.set_data_ps({ id: row.id, table: 'sites', ps: ev.target.value }, function (res) {
								bt_tools.msg(res, { is_dynamic: true });
							});
						},
						keyup: function (row, index, ev) {
							if (ev.keyCode === 13) {
								$(this).blur();
							}
						},
					},
					{
						fid: 'php_version',
						title: 'PHP',
						tips: '选择php版本',
						width: 85,
						type: 'link',
						template: function (row, index) {
							if (row.php_version.indexOf('静态') > -1) return row.php_version;
							if (
								row.php_version !== '其它' &&
								!rdata.some(function (item) {
									return parseInt(item.version) === parseInt(row.php_version * 10);
								})
							) {
								return '<a href="javascript:; " class="btlink php_version color-org" href="点击切换版本">[' + row.php_version + '] 未安装</a>';
								//   return '<span style="cursor: pointer;"><a class="php_install color-org" data-name="'+ (row.php_version) +'"  title="点击安装版本" href="javascript:;">安装'+ row.php_version +'</a> | <span class="btlink">切换</span></span>';
							}
							return row.php_version === '其它' ? '自定义' : row.php_version;
						},
						event: function (row, index) {
							site.web_edit(row);
							setTimeout(function () {
								$('.site-menu p:eq(9)').click();
							}, 500);
						},
					},
					{
						fid: 'ssl',
						title: 'SSL证书',
						tips: '部署证书',
						width: 85,
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
									if (row.ssl.endtime < 0) {
										return '<a class="btlink bt_danger" href="javascript:;">已过期</a>';
									}
								}
							} catch (error) {}
							for (var i = 0; i < _arry.length; i++) {
								var item = _ssl[_arry[i][0]];
								_info += _arry[i][1] + ':' + item + (_arry.length - 1 != i ? '\n' : '');
							}
							return row.ssl === -1
								? '<a class="btlink bt_warning" href="javascript:;">未部署</a>'
								: '<a class="btlink ' + (row.ssl.endtime < 10 ? 'bt_danger' : '') + '" href="javascript:;" title="' + _info + '">剩余' + row.ssl.endtime + '天</a>';
						},
						event: function (row, index, ev, key, that) {
							site.web_edit(row);
							setTimeout(function () {
								$('.site-menu p:eq(8)').click();
							}, 500);
						},
					},
					{
						fid: 'nodeSync',
						title:
							'<span>节点同步<a title="点击跳转节点同步使用教程" href="https://www.bt.cn/bbs/forum.php?mod=viewthread&tid=58391&highlight=%E8%8A%82%E7%82%B9%E5%90%8C%E6%AD%A5" target="_blank" class="bt-ico-ask">?</a></span>',
						width: 85,
						type: 'link',
						display: false,
						template: function (row, index) {
							return '同步';
						},
						event: function (row, index, ev, key, that) {
							site.sync_node_view(row);
						},
					},
					{
						fid: 'boce',
						title: '拨测告警',
						width: 65,
						type: 'link',
						display: true,
						tips: '点击打开【设置->网站告警->拨测告警】',
						template: function (row, index) {
							return '设置';
						},
						event: function (row, index, ev, key, that) {
							site.web_edit(row);
							setTimeout(function () {
								$('.site-menu p:eq(16)').click();
							}, 500);
						},
					},
					{
						title: '操作',
						type: 'group',
						fid: 'use',
						width: 170,
						align: 'right',
						isDisabled: true,
						group: (function () {
							var setConfig = [
								{
									title: '设置',
									event: function (row, index, ev, key, that) {
										site.web_edit(row, true);
									},
								},
								{
									title: '删除',
									event: function (row, index, ev, key, that) {
										site.del_site(row.id, row.name, function () {
											that.$refresh_table_list(true);
										});
									},
								},
							];
							try {
								var recomConfig = product_recommend.get_recommend_type(5);
								if (recomConfig) {
									for (var i = 0; i < recomConfig['list'].length; i++) {
										var item = recomConfig['list'][i];
										item.imgSrc = 'https://www.bt.cn/Public/new/plugin/' + item.name + '/1.png';

										if (item.title == '防火墙') {
											item.description = ['仅支持Nginx', '抵御CC攻击', '关键词拦截', '拦截恶意扫描', '阻止黑客入侵'];
										} else {
											item.description = ['分析网站运行', '用户访问状况', '精确统计网站流量'];
										}
										(function (item) {
											// layer.closeAll()
											setConfig.unshift({
												title: item.title == '防火墙' ? 'WAF' : item.title,
												event: function (row) {
													if (item.name === 'total') {
														// 仅linux系统单独判断
														if (!item.isBuy) {
															product_recommend.recommend_product_view(
																item,
																{
																	imgArea: ['800px', '576px'],
																},
																'ltd',
																item.pay,
																item.name
															);
														} else if (!item.install) {
															bt.soft.install(item.name);
														} else {
															// 存储当前统计报表设置默认网站
															bt.set_cookie('total_website', row.name);
															bt.soft.set_lib_config(item.name, item.pluginName);
														}
													} else {
														product_recommend.get_version_event(
															item,
															row.name,
															{
																imgArea: ['840px', '606px'],
															},
															'icon'
														);
													}
												},
											});
										})(item);
									}
								}
							} catch (error) {
								console.log(error);
							}
							return setConfig;
						})(),
					},
				],
				sortParam: function (data) {
					// 流量排序
					if (data.name == 'total_flow') {
						return { order: trafficInfo['flow_type'] + ' ' + data.sort };
					}
					return { order: data.name + ' ' + data.sort };
				},
				// 表格渲染完成后
				success: function (that) {

					var $that = this;
					$('#bt_site_table .page_select_number')
						.unbind('change')
						.change(function () {
							// 通过 手动切换分页数
							$that.param.isCut = true;
						});
					if (eventStatus) {
						renderNum++;
						if (renderNum == 2) {
							eventStatus = false;
							// 流量文字
							$('.netTitle').text($.isEmptyObject(trafficInfo) ? trafficType[0][1] : trafficInfo['flow_name']);
							// 流量类型事件监听
							$('#bt_site_table').on('click', '.site_traffic--btn', function (ev) {
								if ($('.site_traffic--typeBox').length > 0) {
									$('.site_traffic--typeBox').remove();
									return false;
								}
								var _trafficDialog = '<div class="site_traffic--typeBox" style="left:' + (ev.clientX - 270) + 'px;top:' + (ev.clientY - 75) + 'px"><ul>';
								$.each(trafficType, function (i, item) {
									_trafficDialog += '<li data-type="' + item[0] + '" class="' + (item[0] == trafficInfo['flow_type'] ? 'active' : '') + '">' + item[1] + '</li>';
								});
								_trafficDialog += '</ul></div>';
								$('#bt_site_table').append(_trafficDialog);
								ev.stopPropagation();
								ev.preventDefault();
							});
							// 流量类型切换
							$('#bt_site_table').on('click', '.site_traffic--typeBox li', function (e) {
								// 是否企业版
								if (!recomConfig.list[1].install || !isLtd) {
									total_plugin_overview();
									return false;
								}
								trafficInfo['flow_type'] = $(this).attr('data-type');
								$('.netTitle').text($(this).text());
								// 切换类型不排序
								that.config.sort = { order: $(this).attr('data-type') };
								$('.site_traffic--typeBox').remove();
								that.$refresh_table_list(true);
								e.stopPropagation();
							});

							// 点击空白处隐藏
							$(document).click(function (ev) {
								$('.site_traffic--typeBox').remove();
							});
						}
					}
					// 安装监控报表插件
					$('.traffic_plugin--install').on('click', function () {
						total_plugin_overview();
					});
					// 购买插件预览
					function total_plugin_overview() {
						var tTtem = $.extend(true, {}, recomConfig.list[1]);
						if (!isLtd) {
							tTtem.pluginName = '网站流量分析';
							tTtem.description = ['分析近期攻击', '快速分析流量状况', '多时段切换', '排查趋势变化'];
							tTtem.ps = '快速浏览不同时间段的流量数据，发现高峰和趋势，助您迅速优化网站！';
							tTtem.imgSrc = 'https://www.bt.cn/Public/new/plugin/' + tTtem.name + '/siteTraffic/traffic.png';
							product_recommend.recommend_product_view(tTtem, false, 'ltd', 142, tTtem.name);
						} else if (!tTtem.install) {
							bt.soft.install(tTtem.name);
						}
					}
					if (!$('.pull-left button:eq(3) .icon_title').length) {
						// $('.pull-left button').eq(5).html('<span class="icon_title" style="position:relative"><span class="new-file-icon new-ltd-icon" style="position:absolute;top:-2px;"></span><span style="margin-left:22px">漏洞扫描</span></span>');
						$('.pull-left button').eq(3).html('<span class="icon_title" style="position:relative"><span>漏洞扫描</span></span>');
					}
					$('.pull-left button')
						.eq(3)
						.hover(
							function () {
								$(this).find('.new-file-icon').removeClass('new-ltd-icon').addClass('new-ltd-hover');
							},
							function () {
								$(this).find('.new-file-icon').removeClass('new-ltd-hover').addClass('new-ltd-icon');
							}
						);
					$('#bt_site_table .dividing-line').remove();
					$('#bt_site_table .pull-left button').eq(3).before('<div class="inlineBlock dividing-line" style="margin: 0 16px 0 11px;"></div>');
					$('#bt_site_table .pull-left button').eq(1).removeClass('mr5').css({ borderRight: 0 });
					$('#bt_site_table .pull-left button')
						.eq(2)
						.find('span')
						.css({ position: 'relative', top: '1px', left: '1px' })
						.html(
							'<span class="adv-select-down"><svg width="12.000000" height="12.000000" viewBox="0 0 12 5" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
								'\t<desc>\n' +
								'\t\t\tCreated with Pixso.\n' +
								'\t</desc>\n' +
								'\t<defs/>\n' +
								'\t<path id="path" d="M0.123291 0.809418L4.71558 5.84385C4.8786 6.02302 5.16846 6.04432 5.33038 5.86389L9.87927 0.783104C10.0412 0.602676 10.04 0.311989 9.87701 0.132816C9.79626 0.0446892 9.68945 0 9.58374 0C9.47693 0 9.36938 0.0459404 9.28827 0.136574L5.02881 4.89284L0.708618 0.15662C0.627869 0.0684967 0.522217 0.0238075 0.415405 0.0238075C0.307434 0.0238075 0.20105 0.0697479 0.119873 0.160381C-0.041626 0.338303 -0.0393677 0.630241 0.123291 0.809418Z" fill-rule="nonzero" fill="#666"/>\n' +
								'</svg></span>'
						);

					// 详情事件
					bt.files.dir_details();
					var interval_php = null;
					$('.php_install')
						.unbind('click')
						.click(function (e) {
							var name = $(this).attr('data-name');
							bt.soft.install('php-' + name);
							interval_php = setInterval(function () {
								if (!$('.memu #memuAsite').hasClass('current')) {
									clearInterval(interval_php);
									return;
								}
								bt.send('GetPHPVersion', 'site/GetPHPVersion', {}, function (rdata) {
									if (
										rdata.some(function (item) {
											return parseInt(item.version) === parseInt(name * 10);
										})
									) {
										clearInterval(interval_php);
										window.location.reload();
									}
								});
							}, 3000);
							e.stopPropagation();
							e.preventDefault();
						});
					if (recomConfig) {
						for (var j = 0; j < recomConfig['list'].length; j++) {
							var item = recomConfig['list'][j];
							if (item.name === 'btwaf') {
								if (!item.isBuy) $('.site_waf_icon').removeClass('site_waf_icon_green').addClass('site_waf_icon_grey');
							}
						}
					}
					$('.event_edate_' + that.random).each(function () {
						var $this = $(this);
						laydate.render({
							elem: $this[0], //指定元素
							min: bt.get_date(1),
							max: '2099-12-31',
							vlue: bt.get_date(365),
							type: 'date',
							format: 'yyyy-MM-dd',
							trigger: 'click',
							btns: ['perpetual', 'confirm'],
							theme: '#20a53a',
							ready: function () {
								$this.click();
							},
							done: function (date) {
								var item = that.event_rows_model.rows;
								bt.site.set_endtime(item.id, date, function (res) {
									if (res.status) {
										bt_tools.msg(res.msg);
										that.$refresh_table_list();
										return false;
									}
									bt.msg(res);
								});
							},
						});
					});
					$('.site_waf_icon').click(function (e) {
						var recomConfig = product_recommend.get_recommend_type(5);
						var rowName = $(this).attr('id');
						var dataName = $(this).data('name');
						if (recomConfig) {
							for (var i = 0; i < recomConfig['list'].length; i++) {
								var item = recomConfig['list'][i];
								(function (item) {
									if (item.name === 'btwaf' || item.name == 'btwaf_httpd') {
										product_recommend.get_version_event(
											item,
											dataName,
											{
												imgArea: ['840px', '606px'],
											},
											'text'
										);
									}
								})(item);
							}
						}
						e.stopPropagation();
					});
					window.onresize = function () {
						$('#bt_site_table .pull-right .bt_search input').css('width', '400px');
						if (window.innerWidth < 1135) {
							$('#bt_site_table .pull-right .bt_search input').css('width', '160px');
						}
					};

					if ($('#bt_site_table .tootls_top .pull-left .bt-desired').length === 0) {
						$('#bt_site_table .tootls_top .pull-left').append(
							'<span class="bt-desired ml10" style="background-size:contain;"><a href="javascript:;" class="btlink ml5 npsFeedback">需求反馈</a></span>'
						);
						// 网站nps入口
						$('.npsFeedback').on('click', function () {
							bt_tools.nps({ name: '网站', type: 14 });
						});
					}
					//运行环境
					// site.show_run_panel()
				},
				// 渲染完成
				tootls: [
					{
						// 按钮组
						type: 'group',
						positon: ['left', 'top'],
						list: [
							{
								title: '添加站点',
								active: true,
								event: function (ev) {
									site.add_site(function (res, param) {
										var id = bt.get_cookie('site_type');
										if (param) {
											// 创建站点
											if (id != -1 && id != param.type_id) {
												$('#php_cate_select .bt_select_list li[data-id="' + param.type_id + '"]').click();
											} else {
												site_table.$refresh_table_list(true);
											}
										} else {
											// 批量添加
											$('#php_cate_select .bt_select_list li[data-id="-1"]').click();
										}
									});
								},
							},
							{
								title: '高级设置',
								event: function (ev) {
									site.site_advance_set(0);
								},
							},
							{
								title: '高级设置',
								event: function (ev) {
									// site.site_advance_set(0);
								},
							},
							{
								title: '漏洞扫描',
								event: function (ev) {
									site.reader_scan_view();
								},
							},
							{
								title: '运行环境',
								event: function (ev) {
									// site.reader_scan_view();
								},
							},
						],
					},
					{
						// 搜索内容
						type: 'search',
						positon: ['right', 'top'],
						placeholder: '请输入域名或备注',
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
								group: [
									{ title: '开启站点', param: { status: 1 } },
									{ title: '停止站点', param: { status: 0 } },
								],
								url: '/site?action=set_site_status_multiple',
								confirmVerify: false, //是否提示验证方式
								paramName: 'sites_id', //列表参数名,可以为空
								paramId: 'id', // 需要传入批量的id
								theadName: '站点名称',
								refresh: true,
							},
							{
								title: '备份站点',
								url: '/site?action=ToBackup',
								paramId: 'id',
								load: true,
								theadName: '站点名称',
								refresh: true,
								param: function (row) {
									return {
										id: row.id,
									};
								},
								callback: function (that) {
									// 手动执行,data参数包含所有选中的站点
									that.start_batch({}, function (list) {
										var html = '';
										for (var i = 0; i < list.length; i++) {
											var item = list[i];
											html +=
												'<tr><td><span>' +
												item.name +
												'</span></td><td><div style="float:right;"><span style="color:' +
												(item.request.status ? '#20a53a' : 'red') +
												'">' +
												item.request.msg +
												'</span></div></td></tr>';
										}
										site_table.$batch_success_table({ title: '批量备份站点', th: '站点名称', html: html });
										site_table.$refresh_table_list(true);
									});
								},
							},
							{
								title: '设置到期时间',
								url: '/site?action=set_site_etime_multiple',
								paramName: 'sites_id', //列表参数名,可以为空
								paramId: 'id', // 需要传入批量的id
								theadName: '站点名称',
								refresh: true,
								confirm: {
									title: '批量设置到期时间',
									content:
										'<div class="line"><span class="tname">到期时间</span><div class="info-r "><input name="edate" id="site_edate" class="bt-input-text mr5" placeholder="yyyy-MM-dd" type="text"></div></div>',
									success: function () {
										laydate.render({
											elem: '#site_edate',
											min: bt.format_data(new Date().getTime(), 'yyyy-MM-dd'),
											max: '2099-12-31',
											vlue: bt.get_date(365),
											type: 'date',
											format: 'yyyy-MM-dd',
											trigger: 'click',
											btns: ['perpetual', 'confirm'],
											theme: '#20a53a',
										});
									},
									yes: function (index, layers, request) {
										var site_edate = $('#site_edate'),
											site_edate_val = site_edate.val();
										if (site_edate_val != '') {
											if (new Date(site_edate_val).getTime() < new Date().getTime()) {
												layer.tips('设置的到期时间不得小于当前时间', '#site_edate', { tips: ['1', 'red'] });
												return false;
											}
											request({ edate: site_edate_val === '永久' ? '0000-00-00' : site_edate_val });
										} else {
											layer.tips('请输入到期时间', '#site_edate', { tips: ['1', 'red'] });
											$('#site_edate').css('border-color', 'red');
											$('#site_edate').click();
											setTimeout(function () {
												$('#site_edate').removeAttr('style');
											}, 3000);
											return false;
										}
									},
								},
							},
							{
								title: '设置PHP版本',
								url: '/site?action=set_site_php_version_multiple',
								paramName: 'sites_id', //列表参数名,可以为空
								paramId: 'id', // 需要传入批量的id
								theadName: '站点名称',
								refresh: true,
								confirm: {
									title: '批量设置PHP版本',
									area: '450px',
									content:
										'<div class="line">\
                  <span class="tname">PHP版本</span>\
                  <div class="info-r">\
                    <select class="bt-input-text mr5 versions" name="versions" style="width:280px"></select>\
                  </div>\
                </div>\
                <div class="line">\
                  <span class="tname">连接配置</span>\
                  <div class="info-r">\
                    <input class="bt-input-text other-version" style="margin-right: 10px;width:280px;color: #000;" type="text" placeholder="如：1.1.1.1:9001或unix:/tmp/php.sock" />\
                  </div>\
                </div>\
                <ul class="help-info-text c7" style="font-size:11px">\
                  <li>请根据您的程序需求选择版本</li>\
                  <li>若非必要,请尽量不要使用PHP5.2,这会降低您的服务器安全性；</li>\
                  <li>PHP7不支持mysql扩展，默认安装mysqli以及mysql-pdo。</li>\
                  <li>【自定义】可自定义PHP连接信息，选择此项需填写可用的PHP连接配置</li>\
                  <li>【自定义】当前仅支持nginx，可配合[宝塔负载均衡 - 重构版]插件的TCP负载功能实现PHP负载集群</li>\
                  <li>【PHP连接配置】支持TCP或Unix配置，示例：192.168.1.25:9001 或 unix:/tmp/php8.sock</li>\
                </ul>',
									success: function (res, list, that) {
										bt.site.get_all_phpversion(function (res) {
											var html = '';
											$.each(res, function (index, item) {
												html += '<option value="' + item.version + '">' + item.name + '</option>';
											});
											$('[name="versions"]').html(html);
											if (html) {
												var phpversion = res[0].version;
												if (phpversion != 'other') {
													$('.other-version').parent().parent().addClass('hide');
													$('.help-info-text li:eq(3),.help-info-text li:eq(4),.help-info-text li:eq(5)').hide();
												}
												if (phpversion.substring(1, 0) != '7') {
													$('.help-info-text li:eq(2)').hide();
												}
												if (phpversion != '52') {
													$('.help-info-text li:eq(1)').hide();
												}
											}
										});
										$('[name="versions"]').change(function () {
											var phpversion = $(this).val();
											if (phpversion == 'other') {
												$('.other-version').parent().parent().removeClass('hide');
												$('.help-info-text li:eq(3),.help-info-text li:eq(4),.help-info-text li:eq(5)').show();
											} else {
												$('.other-version').parent().parent().addClass('hide');
												$('.help-info-text li:eq(3),.help-info-text li:eq(4),.help-info-text li:eq(5)').hide();
											}
											if (phpversion.substring(1, 0) != '7') {
												$('.help-info-text li:eq(2)').hide();
											} else {
												$('.help-info-text li:eq(2)').show();
											}
											if (phpversion != '52') {
												$('.help-info-text li:eq(1)').hide();
											} else {
												$('.help-info-text li:eq(1)').show();
											}
										});
									},
									yes: function (index, layers, request) {
										var params = {
											version: $('[name="versions"]').val(),
										};
										if (params.version === 'other') {
											params['other'] = $('.other-version').val();
										}
										if (params.version === 'other' && !params['other']) {
											layer.msg('自定义PHP版本时，PHP连接配置不能为空', { icon: 2 });
											$('.other-version').focus();
											return false;
										} else {
											request(params);
										}
									},
								},
							},
							{
								title: '部署证书',
								callback: function (that) {
									site.set_ssl_cert(that);
								},
							},
							{
								title: '部署伪静态',
								callback: function (that) {
									site.adding_pseudo_static_in_bulk(that);
								},
							},
							{
								title: '设置分类',
								url: '/site?action=set_site_type',
								paramName: 'site_ids', //列表参数名,可以为空
								paramId: 'id', // 需要传入批量的id
								refresh: true,
								beforeRequest: function (list) {
									var arry = [];
									$.each(list, function (index, item) {
										arry.push(item.id);
									});
									return JSON.stringify(arry);
								},
								confirm: {
									title: '批量设置分类',
									content:
										'<div class="line"><span class="tname">站点分类</span><div class="info-r"><select class="bt-input-text mr5 site_types" name="site_types" style="width:150px"></select></span></div></div>',
									success: function () {
										bt.site.get_type(function (res) {
											var html = '';
											$.each(res, function (index, item) {
												html += '<option value="' + item.id + '">' + item.name + '</option>';
											});
											$('[name="site_types"]').html(html);
										});
									},
									yes: function (index, layers, request) {
										request({ id: $('[name="site_types"]').val() });
									},
								},
								tips: false,
								success: function (res, list, that) {
									var html = '';
									$.each(list, function (index, item) {
										html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (res.status ? '#20a53a' : 'red') + '">' + res.msg + '</span></div></td></tr>';
									});
									that.$batch_success_table({ title: '批量设置分类', th: '站点名称', html: html });
									that.$refresh_table_list(true);
								},
							},
							{
								title: '删除站点',
								load: true,
								url: '/site?action=DeleteSite',
								param: function (row) {
									return {
										id: row.id,
										webname: row.name,
									};
								},
								// paramName: 'sites_id', //列表参数名,可以为空
								// paramId: 'id', //需要传入批量的id
								// theadName: '站点名称',
								// refresh: true,
								callback: function (that) {
									// bt.show_confirm("批量删除站点", "是否同时删除选中站点同名的FTP、数据库、根目录", function() {
									//     var param = {};
									//     $('.bacth_options input[type=checkbox]').each(function() {
									//         var checked = $(this).is(":checked");
									//         if (checked) param[$(this).attr('name')] = checked ? 1 : 0;
									//     })
									//     if (callback) callback(param);
									// }, "<div class='options bacth_options'><span class='item'><label><input type='checkbox' name='ftp'><span>FTP</span></label></span><span class='item'><label><input type='checkbox' name='database'><span>" + lan.site.database + "</span></label></span><span class='item'><label><input type='checkbox' name='path'><span>" + lan.site.root_dir + "</span></label></span></div>");
									var ids = [];
									for (var i = 0; i < that.check_list.length; i++) {
										ids.push(that.check_list[i].id);
									}
									site.del_site(ids, function (param) {
										that.start_batch(param, function (list) {
											layer.closeAll();
											var html = '';
											for (var i = 0; i < list.length; i++) {
												var item = list[i];
												html +=
													'<tr><td>' +
													item.name +
													'</td><td><div style="float:right;"><span style="color:' +
													(item.request.status ? '#20a53a' : 'red') +
													'">' +
													item.request.msg +
													'</span></div></td></tr>';
											}
											site_table.$batch_success_table({
												title: '批量删除',
												th: '站点名称',
												html: html,
											});
											site_table.$refresh_table_list(true);
										});
									});
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
				thead: function (thead) {
					if($('.tabs-item.active').data('type') === 'php') {
						window.addEventListener('resize', function () {
							dynamic_column($(thead))
						})
					}else{
						window.removeEventListener('resize')
					}
					dynamic_column($(thead))
				}
			});

			/**
			 * @description 动态表头
			 * @param {object} column 表头配置
			 */

      var psFlag = false
      var sortFlag = false
			function dynamic_column (column) {
        var theadWidth = null
				var headMinMap = {
					'status': 120,
					'backup_count': 55,
          'siteType':100,
					'sort':50,
					'quota': 70,
					'total_flow': 190,
					'edate': 140,
					'ps': 100,
					'php_version': 55,
					'ssl': 135,
					'nodeSync': 85,
					'boce': 65,
					'use': 170,
					'rname': 200,
					"path": 65,
					"id": 32,
					"dirDetails":65
				}

				if(theadWidth == null){
					for (var i = 0; i < column.length; i++) {
						if ($(column[i]).hasClass('ps')) {
							continue
						}
						if($(column[i]).hasClass('ps')){
							psFlag= true
						}
            if ($(column[i]).hasClass('sort')){
              sortFlag = true
            }
						theadWidth += headMinMap[$(column[i]).attr('class')]
					}
				}

				var tableWidth = $('.site_table_view').width() - 32
				var num = tableWidth - theadWidth
				var styleList = [
					{className: '#bt_site_table table',css:'min-width:1100px'},
				]
				var width = psFlag? num-100 : num-100
				if(width> 30){
					for(var i =0 ; i<column.length;i++){
						if($(column[i]).attr('class')== 'use'){
							styleList.push({
								index: i,
								css:'min-width:'+headMinMap[$(column[i]).attr('class')]+'px'+';width:'+headMinMap[$(column[i]).attr('class')]+'px;text-align:right;'
							})
						}else if($(column[i]).attr('class')== 'rname'){
							styleList.push({
								index: i,
								css:'min-width: 200px;max-width:200px;'
							})
						}else if($(column[i]).attr('class')== 'ps'){
							styleList.push({
								index: i,
								css:'min-width:100px'
							})
						}else {
							styleList.push({
								index: i,
								css:'min-width:'+headMinMap[$(column[i]).attr('class')]+'px'
							})
						}

					}
					styleList.push({
						className: '.path_detail_text',
						css:'display:block;'
					})
					styleList.push({
						className: '.path-icon',
						css:'display:none !important;'
					})
					style_bind(styleList)
				} else{

					for(var i =0 ; i<column.length;i++){
						if($(column[i]).attr('class')== 'use'){
							styleList.push({
								index: i,
                css:'min-width:'+headMinMap[$(column[i]).attr('class')]+'px'+';width:'+headMinMap[$(column[i]).attr('class')]+'px;text-align:right;'
							})
						}else if($(column[i]).attr('class')== 'path'){
							styleList.push({
								index: i,
								css:'min-width: 55px;width:55px;'
							})

							$('.path_detail').off('mouseenter').unbind('mouseleave')
						}else if($(column[i]).attr('class')== 'rname'){
							styleList.push({
								index: i,
								css:'min-width: 200px;'
							})
						} else if($(column[i]).attr('class')== 'ps'){
						styleList.push({
							index: i,
							css:'min-width:50px;'
						})
					}else {
							styleList.push({
								index: i,
								css:'min-width:'+headMinMap[$(column[i]).attr('class')]+'px;width:'+headMinMap[$(column[i]).attr('class')]+'px'
							})
						}

					}
					styleList.push({
						className: '.path_detail_text',
						css:'display:none;'
					})
					styleList.push({
						className: '.path-icon',
						css:'display:block !important;'
					})
          if(sortFlag){
            styleList.push({
              className: '#bt_site_table tbody tr td:nth-child(4) .btlink span:nth-child(1)',
              css:'display:none !important;'
            })
          }else {
					styleList.push({
						className: '#bt_site_table tbody tr td:nth-child(3) .btlink span:nth-child(1)',
						css:'display:none !important;'
					})
          }

					style_bind(styleList)
				}

			}
			var random = bt.get_random(4);
			function style_bind (style_list, status) {
				$('#bt_site_table').find('.tootls_bottom').next().remove()
				var str = '',
					_that = this;
				$.each(style_list, function (index, item) {
					if (item.css != '') {
						if (!item.className) {
							var item_index = style_list[0].hasOwnProperty('className') ? index : item.index + 1
							str += '#bt_site_table' + ' thead th:nth-child(' + item_index + '),' + '#bt_site_table' + ' tbody tr td:nth-child' + (item.span ? ' span' : '') + '(' + item_index + '){' + item.css + '}'
						} else {
							str += item.className + '{' + item.css + '}';
						}
					}
				});
				if ($('#bt_table_' + random).length == 0) $('#bt_site_table').append('<style type="text/css" id="bt_table_' + random + '">' + str + '</style>');
			}
			_this.site_table = site_table;
			_this.init_site_type();
			//运行环境
			site.show_run_panel();
			//高级设置
			site.show_advance_list();
			$('#bt_site_table .pull-right .bt_search .search_input').css('width', '400px');
			var recomList = ['漏洞扫描', '网站安全扫描', '网站拨测告警', '日志安全分析', '网站防篡改', '网站容量限制'],
				_recomHtml = '';
			for (var i = 0; i < recomList.length; i++) {
				_recomHtml += '<div><span class="item_box">' + recomList[i] + '</span></div>';
			}
			$('#bt_site_table .pull-right .bt_search').append(
				'<div id="search_history" style="width:400px;position:absolute;z-index:99;background:#fff;display:none;transitoin:all .3s;box-shadow: 4px 4px 8px rgba(0, 0, 0, .1), -4px -4px 8px rgba(0, 0, 0, .1);top:35px;border-radius:5px"><div class="history_list_box"><div style="display:flex;flex-direction:row;align-items:center;justify-content:space-between;border-bottom:1px solid #EBEEF5;padding:5px 10px"><span style="font-size: 12px;color:#999">搜索历史</span><div id="all_delete" style="width:52px;height:24px;border:1px solid #DCDFE6;color:#999;font-size:12px;display:flex;align-items:center;cursor:pointer;border-radius:2px;justify-content:space-evenly;flex-direction:row"><img class="all_img" style="width:14px;height:14px" src="/static/img/soft_ico/deletes.png" alt="清除">清空</div></div>\
				<div class="list_box_bottom"><div class="list_box_body"></div></div>\
				<div class="list_box_recom">\
					<div>\
						<span>您可能感兴趣</span>\
						<img class="ml5" style="width:14px;height:14px;vertical-align: -2px;" src="/static/images/hots.png">\
					</div>\
					<div class="list_box_recom_body">' +
					_recomHtml +
					'</div>\
				</div>\
				</div></div>'
			);
			$('#bt_site_table .pull-right .bt_search .item_box')
				.unbind('click')
				.click(function () {
					var idx = $(this).parent().index();
					// 获取表格tbody第一行最后一个td下的a标签长度
					var tdLen = $('#bt_site_table tbody tr:eq(0) td').length;
					var _aLen = $('#bt_site_table tbody tr:eq(0) td:last-child a').length;
					if (tdLen <= 2 && idx !== 0) {
						return layer.msg('暂无网站，请先添加网站', { icon: 2 });
					}
					switch (idx) {
						case 0: //漏洞扫描
							site.reader_scan_view();
							break;
						//   case 1://动态查杀
						//     $('#bt_site_table tbody tr:eq(0) td:last-child a:eq('+ (_aLen - 2) +')').click();
						//     setTimeout(function () {
						//       $('.site-menu p:eq(14)').click();
						//       setTimeout(function () {
						//         $('.site-security-tab-view .tab-nav span:eq(2)').click();
						//       },100)
						//     }, 500);
						//     break;
						case 1: //网站安全扫描
							$('#bt_site_table tbody tr:eq(0) td:last-child a:eq(' + (_aLen - 2) + ')').click();
							setTimeout(function () {
								$('.site-menu p:eq(14)').click();
							}, 500);
							break;
						//   case 3://违规词检测
						//     $('#bt_site_table tbody tr:eq(0) td:last-child a:eq('+ (_aLen - 2) +')').click();
						//     setTimeout(function () {
						//       $('.site-menu p:eq(14)').click();
						//       setTimeout(function () {
						//         $('.site-security-tab-view .tab-nav span:eq(1)').click();
						//       },100)
						//     }, 500);
						//     break;
						case 2: //网站拨测告警
							$('#bt_site_table tbody tr:eq(0) td:last-child a:eq(' + (_aLen - 2) + ')').click();
							setTimeout(function () {
								$('.site-menu p:eq(16)').click();
							}, 500);
							break;
						case 3: //日志安全分析
							$('#bt_site_table tbody tr:eq(0) td:last-child a:eq(' + (_aLen - 2) + ')').click();
							setTimeout(function () {
								$('.site-menu p:eq(15)').click();
								setTimeout(function () {
									$('#webedit-con .tab-nav span:eq(2)').click();
								}, 100);
							}, 500);
							break;
						case 4: //网站防篡改
							$('#bt_site_table tbody tr:eq(0) td:last-child a:eq(' + (_aLen - 2) + ')').click();
							setTimeout(function () {
								$('.site-menu p:eq(13)').click();
							}, 500);
							break;
						case 5: //网站容量限制
							$('#bt_site_table tbody tr:eq(0) td:last-child a:eq(' + (_aLen - 2) + ')').click();
							setTimeout(function () {
								$('.site-menu p:eq(2)').click();
								setTimeout(function () {
									$('#webedit-con .tab-nav span:eq(1)').click();
								}, 100);
							}, 500);
							break;
					}
				});
			// _this.get_search_history()
			$('#bt_site_table .pull-right .bt_search')
				.find('[placeholder="请输入域名或备注"]')
				.focus(function () {
					$(document).click(function (event) {
						if (!$(event.target).closest('#search_history').length) {
							if (!$(event.target).is(':input')) {
								$('#search_history').css('display', 'none');
								$(this).unbind('click');
							}
						}
					});
					$('#search_history').css('display', 'block');
					$('.list_box_body').empty();
					if (_this.search_hi.search_history.length > 0) {
						$.each(_this.search_hi.search_history, function (index, item) {
							$('#bt_site_table .pull-right .bt_search')
								.find('.list_box_body')
								.append(
									'<div class="body_item" style="color:#999;cursor:pointer;display:flex;justify-content:space-between;align-items:center;padding-left:10px;padding-right:5px;border-radius:3px" data-name="' +
										item.val +
										'"><span id="history_text">' +
										item.val +
										'</span><div class="delete_single" data-name="' +
										item.val +
										'" style="width:20px;text-align:center"></div></div>'
								);
						});
						$('.delete_single').click(function (event) {
							event.stopPropagation();
							var names = $(this).data('name');
							var cload = layer.msg('正在删除中...', { icon: 16 });
							bt.confirm({ msg: '是否删除改记录？', title: '删除历史记录' }, function () {
								bt_tools.send({ url: '/panel/history/remove_search_history', data: { name: 'sites', key: 'php', val: names } }, function (ress) {
									layer.close(cload);
									layer.msg(ress.msg, { icon: ress.status ? 1 : 2 });
									_this.search_hi.search_history = _this.search_hi.search_history.filter(function (obj) {
										return obj.val !== names;
									});
								});
							});
						});

						$('#bt_site_table .pull-right .bt_search')
							.find('#search_history')
							.find('.history_list_box')
							.find('.list_box_body')
							.find('.body_item')
							.hover(
								function () {
									$(this).css('color', '#333');
									$(this).find('.delete_single').append('<img class="delete_img" style="width:8px;height:8px" src="/static/images/delete_single.png" />');
									$(this).css('background', 'rgb(245, 245, 245)');
								},
								function () {
									$(this).css('color', '#999');
									$(this).find('.delete_single').find('.delete_img').remove();
									$(this).css('background', 'none');
								}
							);
						$('#bt_site_table .pull-right .bt_search')
							.find('#search_history')
							.find('.history_list_box')
							.find('.list_box_body')
							.find('.body_item')
							.click(function () {
								$('#bt_site_table .pull-right .bt_search').find('[placeholder="请输入域名或备注"]').val($(this).data('name'));
								// site_table.$refresh_table_list(true);
							});
					} else {
						$('#bt_site_table .pull-right .bt_search').find('.list_box_body').append('<span style="color:#999">暂无数据</span>');
					}
				})
				.blur(function () {
					$('#search_histo	ry').css('display', 'none');
				});

			$('#all_delete').click(function () {
				var dload = layer.msg('正在清空中...', { icon: 16 });
				bt.confirm({ msg: '是否清空所有历史记录？', title: '清空历史记录' }, function () {
					bt_tools.send({ url: '/panel/history/clear_search_history', data: { name: 'sites', key: 'php' } }, function (ress) {
						layer.close(dload);
						layer.msg(ress.msg, { icon: ress.status ? 1 : 2 });
						_this.search_hi.search_history = [];
					});
				});
			});
			$('#all_delete').hover(
				function () {
					$(this).css({
						color: '#20a53a',
						border: '1px solid #20a53a',
					});
					$(this).find('.all_img').attr('src', '/static/img/soft_ico/deletes_hover.png');
					$(this).find('.all_img').css('width', '14px');
					$(this).find('.all_img').css('height', '14px');
					$(this).css('background', '#F1F9F3');
				},
				function () {
					$(this).css({
						color: '#999',
						border: '1px solid #DCDFE6',
					});
					$(this).css('background', 'none');
					$(this).find('.all_img').css('width', '14px');
					$(this).find('.all_img').css('height', '14px');
					$(this).find('.all_img').attr('src', '/static/img/soft_ico/deletes.png');
				}
			);
		});
		// return site_table;
	},
	// 文件历史搜索
	get_search_history: function () {
		bt_tools.send(
			{ url: '/data?action=getData', data: { table: 'sites', type: bt.get_cookie('site_type') || -1, p: '1', limit: '20' } },
			function (ress) {
				if (ress.status) {
					var list = [];
					$.each(ress.search_history, function (index, item) {
						list.push({
							name: item.val,
							time: item.time,
						});
					});
					$('#bt_site_table .pull-right .bt_search').append('<div>' + +'</div>');
				}
			},
			'获取名称'
		);
	},
	/**
	 * @description 初始化php分类
	 */
	init_site_type: function () {
		$('#php_cate_select').remove();
		$('.tootls_group.tootls_top .pull-right').prepend(
			'<div id="php_cate_select" class="bt_select_updown site_class_type mr10" style="vertical-align: bottom;">\
				<div class="bt_select_value">\
					<span class="bt_select_content">分类:</span>\
						<span class="glyphicon glyphicon-triangle-bottom ml5"></span>\
					</span>\
				</div>\
				<ul class="bt_select_list" style="max-height:150px;overflow:auto"></ul>\
				<div class="class_setting" style="display:none"><span class="item" onclick="site.set_class_type()">分类设置</span></div>\
			</div>'
		);
		bt.site.get_type(function (res) {
			site.reader_site_type(res);
		});
	},
	reader_site_type: function (res) {
		var html = '',
			active = bt.get_cookie('site_type') || -1,
			select = $('#php_cate_select');
		config = this.site_table;
		if (select.find('.bt_select_list li').length > 1) return false;
		res.unshift({ id: -1, name: '全部分类' });
		$.each(res, function (index, item) {
			html += '<li class="item ' + (parseInt(active) == item.id ? 'active' : '') + '" data-id="' + item.id + '" title="' + item.name + '">' + item.name + '</li>';
		});
		// html += '<li role="separator" class="divider"></li><li class="item" data-id="type_sets">分类设置</li>';

		// 点击展示分类 隐藏
		select.find('.bt_select_value').on('click', function (ev) {
			var $this = this;
			$('.class_setting').css('top', select.find('.bt_select_list').height() + 36);
			$(this).siblings().show();
			$(document).one('click', function () {
				// $($this).next().hide();
				$($this).siblings().hide();
			});
			ev.stopPropagation();
		});

		// 点击选项
		select
			.find('.bt_select_list')
			.unbind('click')
			.on('click', 'li', function () {
				var id = $(this).data('id');
				if (id === 'type_sets') {
					site.set_class_type();
				} else {
					bt.set_cookie('site_type', id);
					config.$refresh_table_list(true, function (data) {
						if (parseInt($('#bt_site_table .page .Pcurrent').text()) !== 1) $('.Pstart').click();
					});
					$(this).addClass('active').siblings().removeClass('active');
					select.attr('title', $(this).text());
					select.find('.bt_select_value .bt_select_content').text('分类: ' + $(this).text());
				}
			})
			.empty()
			.html(html);
		select = $(select[0]);
		var text = '';
		if (!select.find('.bt_select_list li.active').length) {
			select.find('.bt_select_list li:eq(0)').addClass('active');
			select.find('.bt_select_value .bt_select_content').text('分类: 默认分类');
			text = '默认分类';
		} else {
			text = select.find('.bt_select_list li.active').text();
			select.find('.bt_select_value .bt_select_content').text('分类: ' + text);
		}
		select.attr('title', text);
	},
	get_list: function (page, search, type) {
		if (page == undefined) page = 1;
		if (type == '-1' || type == undefined) {
			type = bt.get_cookie('site_type');
		}
		if (!search) search = $('#SearchValue').val();
		bt.site.get_list(page, search, type, function (rdata) {
			$('.dataTables_paginate').html(rdata.page);
			var data = rdata.data;
			var _tab = bt.render({
				table: '#webBody',
				columns: [
					{ field: 'id', type: 'checkbox', width: 30 },
					{
						field: 'name',
						title: '网站名',
						templet: function (item) {
							return '<a class="btlink webtips" onclick="site.web_edit(this)" href="javascript:;">' + item.name + '</a>';
						},
						sort: function () {
							site.get_list();
						},
					},
					{
						field: 'status',
						title: '状态',
						width: 80,
						templet: function (item) {
							var _status = '<a href="javascript:;" ';
							if (item.status == '1' || item.status == '正常' || item.status == '正在运行') {
								_status += ' onclick="bt.site.stop(' + item.id + ",'" + item.name + '\') " >';
								_status += '<span style="color:#5CB85C">运行中 </span><span style="color:#5CB85C" class="glyphicon glyphicon-play"></span>';
							} else {
								_status += ' onclick="bt.site.start(' + item.id + ",'" + item.name + '\')"';
								_status += '<span style="color:red">已停止  </span><span style="color:red" class="glyphicon glyphicon-pause"></span>';
							}
							return _status;
						},
						sort: function () {
							site.get_list();
						},
					},
					{
						field: 'backup',
						title: '备份',
						width: 58,
						templet: function (item) {
							var backup = lan.site.backup_no;
							if (item.backup_count > 0) backup = lan.site.backup_yes;
							return '<a href="javascript:;" class="btlink" onclick="site.site_detail(' + item.id + ",'" + item.name + '\')">' + backup + '</a>';
						},
					},
					{
						field: 'path',
						title: '根目录',
						templet: function (item) {
							var _path = bt.format_path(item.path);
							return '<a class="btlink" title="打开目录" href="javascript:openPath(\'' + _path + '\');">' + _path + '</a>';
						},
					},
					{
						field: 'edate',
						title: '到期时间',
						width: 86,
						templet: function (item) {
							var _endtime = '';
							if (item.edate) _endtime = item.edate;
							if (item.endtime) _endtime = item.endtime;
							_endtime = _endtime == '0000-00-00' ? lan.site.web_end_time : _endtime;
							return '<a class="btlink setTimes" id="site_endtime_' + item.id + '" >' + _endtime + '</a>';
						},
						sort: function () {
							site.get_list();
						},
					},
					{
						field: 'ps',
						title: '备注',
						templet: function (item) {
							return "<span class='c9 input-edit'  onclick=\"bt.pub.set_data_by_key('sites','ps',this)\">" + item.ps + '</span>';
						},
					},
					{
						field: 'php_version',
						width: 60,
						title: 'PHP',
						templet: function (item) {
							return '<a class="phpversion_tips btlink">' + item.php_version + '</a>';
						},
					},
					{
						field: 'ssl',
						title: 'SSL证书',
						width: 80,
						templet: function (item) {
							var _ssl = '';
							if (item.ssl == -1) {
								_ssl = '<a class="ssl_tips btlink" style="color:orange;">未部署</a>';
							} else {
								var ssl_info = '证书品牌: ' + item.ssl.issuer + '<br>到期日期: ' + item.ssl.notAfter + '<br>申请日期: ' + item.ssl.notBefore + '<br>可用域名: ' + item.ssl.dns.join('/');
								if (item.ssl.endtime < 0) {
									_ssl = '<a class="ssl_tips btlink" style="color:red;" data-tips="' + ssl_info + '">已过期</a>';
								} else if (item.ssl.endtime < 20) {
									_ssl = '<a class="ssl_tips btlink" style="color:red;" data-tips="' + ssl_info + '">剩余' + (item.ssl.endtime + '天') + '</a>';
								} else {
									_ssl = '<a class="ssl_tips btlink" style="color:green;" data-tips="' + ssl_info + '">剩余' + item.ssl.endtime + '天</a>';
								}
							}
							return _ssl;
						},
					},
					{
						field: 'opt',
						width: 150,
						title: '操作',
						align: 'right',
						templet: function (item) {
							var opt = '';
							var _check = ' onclick="site.site_waf(\'' + item.name + '\')"';

							if (bt.os == 'Linux') opt += '<a href="javascript:;" ' + _check + ' class="btlink ">防火墙</a> | ';
							opt += '<a href="javascript:;" class="btlink" onclick="site.web_edit(this)">设置 </a> | ';
							opt += '<a href="javascript:;" class="btlink" onclick="site.del_site(' + item.id + ",'" + item.name + '\')" title="删除站点">删除</a>';
							return opt;
						},
					},
				],
				data: data,
			});
			var outTime = '';
			$('.ssl_tips').hover(
				function () {
					var that = this,
						tips = $(that).attr('data-tips');
					if (!tips) return false;
					outTime = setTimeout(function () {
						layer.tips(tips, $(that), {
							tips: [2, '#20a53a'], //还可配置颜色
							time: 0,
						});
					}, 500);
				},
				function () {
					outTime != '' ? clearTimeout(outTime) : '';
					layer.closeAll('tips');
				}
			);
			$('.ssl_tips').click(function () {
				site.web_edit(this);
				var timeVal = setInterval(function () {
					var content = $('#webedit-con').html();
					if (content != '') {
						$('.site-menu p:eq(8)').click();
						clearInterval(timeVal);
					}
				}, 100);
			});
			$('.phpversion_tips').click(function () {
				site.web_edit(this);
				var timeVal = setInterval(function () {
					var content = $('#webedit-con').html();
					if (content != '') {
						$('.site-menu p:eq(9)').click();
						clearInterval(timeVal);
					}
				}, 100);
			});
			//设置到期时间
			$('a.setTimes').each(function () {
				var _this = $(this);
				var _tr = _this.parents('tr');
				var id = _this.attr('id');
				laydate.render({
					elem: '#' + id, //指定元素
					min: bt.get_date(1),
					max: '2099-12-31',
					vlue: bt.get_date(365),
					type: 'date',
					format: 'yyyy-MM-dd',
					trigger: 'click',
					btns: ['perpetual', 'confirm'],
					theme: '#20a53a',
					done: function (dates) {
						var item = _tr.data('item');
						bt.site.set_endtime(item.id, dates, function () {});
					},
				});
			});
			//})
		});
	},
	site_waf: function (siteName) {
		try {
			site_waf_config(siteName);
		} catch (err) {
			site.no_firewall();
		}
	},
	html_encode: function (html) {
		var temp = document.createElement('div');
		//2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
		temp.textContent != undefined ? (temp.textContent = html) : (temp.innerText = html);
		//3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
		var output = temp.innerHTML;
		temp = null;
		return output;
	},
	get_types: function (callback) {
		bt.site.get_type(function (rdata) {
			var optionList = '';
			var t_val = bt.get_cookie('site_type');
			for (var i = 0; i < rdata.length; i++) {
				optionList += '<button class="btn btn-' + (t_val == rdata[i].id ? 'success' : 'default') + ' btn-sm" value="' + rdata[i].id + '">' + rdata[i].name + '</button>';
			}
			if ($('.dataTables_paginate').next().hasClass('site_type')) $('.site_type').remove();
			$('.dataTables_paginate').after('<div class="site_type"><button class="btn btn-' + (t_val == '-1' ? 'success' : 'default') + ' btn-sm" value="-1">全部分类</button>' + optionList + '</div>');

			$('.site_type button').click(function () {
				var val = $(this).attr('value');
				bt.set_cookie('site_type', val);
				site.get_list(0, '', val);
				$('.site_type button').removeClass('btn-success').addClass('btn-default');
				$(this).addClass('btn-success');
			});
			if (callback) callback(rdata);
		});
	},
	no_firewall: function (obj) {
		var typename = bt.get_cookie('serverType');
		layer.confirm(
			typename + '防火墙暂未开通，<br>请到&quot;<a href="/soft" class="btlink">软件管理>付费插件>' + typename + '防火墙</a>&quot;<br>开通安装使用。',
			{
				title: typename + '防火墙未开通',
				icon: 7,
				closeBtn: 2,
				cancel: function () {
					if (obj) $(obj).prop('checked', false);
				},
			},
			function () {
				window.location.href = '/soft';
			},
			function () {
				if (obj) $(obj).prop('checked', false);
			}
		);
	},
	/**
	 * @description 备份站点视图
	 * @param {object} config  配置参数
	 * @param {function} callback  回调函数
	 */
	backup_site_view: function (config, thatC, callback) {
		bt_tools.open({
			title: '备份站点&nbsp;-&nbsp;[&nbsp;' + config.name + '&nbsp;]',
			area: '790px',
			btn: false,
			skin: 'bt_backup_table',
			content: '<div id="bt_backup_table" class="pd20" style="padding-bottom:40px;"></div>',
			success: function () {
				var cloudMap = {
					//云存储列表名
					alioss: '阿里云OSS',
					ftp: 'FTP',
					sftp: 'SFTP',
					msonedrive: '微软OneDrive',
					qiniu: '七牛云',
					txcos: '腾讯COS',
					upyun: '又拍云',
					jdcloud: '京东云',
					aws_s3: '亚马逊存储',
					'Google Cloud': '谷歌云',
					'Google Drive': '谷歌网盘',
					bos: '百度云',
					obs: '华为云',
				};
				var backup_table = bt_tools.table({
					el: '#bt_backup_table',
					url: '/data?action=getData',
					param: { table: 'backup', search: config.id, type: '0' },
					default: '[' + config.name + '] 站点备份列表为空', //数据为空时的默认提示
					column: [
						{ type: 'checkbox', class: '', width: 20 },
						{ fid: 'name', title: '文件名', width: 200, fixed: true },
						{
							fid: 'storage_type',
							title: '存储位置',
							type: 'text',
							width: 90,
							template: function (row) {
								var is_cloud = false,
									cloud_name = ''; //当前云存储类型
								if (row.filename.indexOf('|') != -1) {
									var _path = row.filename;
									is_cloud = true;
									cloud_name = _path.match(/\|(.+)\|/, '$1');
								} else {
									is_cloud = false;
								}
								return is_cloud ? cloudMap[cloud_name[1]] : '本地';
							},
						},
						{
							fid: 'size',
							title: '文件大小',
							width: 80,
							type: 'text',
							template: function (row, index) {
								return bt.format_size(row.size);
							},
						},
						{ fid: 'addtime', width: 150, title: '备份时间' },
						{
							fid: 'ps',
							title: '备注',
							type: 'input',
							blur: function (row, index, ev, key, that) {
								if (row.ps == ev.target.value) return false;
								bt.pub.set_data_ps({ id: row.id, table: 'backup', ps: ev.target.value }, function (res) {
									bt_tools.msg(res, { is_dynamic: true });
								});
							},
							keyup: function (row, index, ev) {
								if (ev.keyCode === 13) {
									$(this).blur();
								}
							},
						},
						{
							title: '操作',
							type: 'group',
							width: 90,
							align: 'right',
							group: [
								{
									title: '下载',
									event: function (row) {
										if (row.filename.indexOf('|') !== -1 && row.localexist === 1) {
											layer.msg('暂不支持云存储下载', { icon: 2 });
										} else {
											window.open('/download?filename=' + row.local + '&amp;name=' + row.name);
										}
									},
								},
								{
									title: '删除',
									event: function (row, index, ev, key, that) {
										that.del_site_backup(row, function (rdata) {
											bt_tools.msg(rdata);
											if (rdata.status) {
												thatC.$modify_row_data({ backup_count: thatC.event_rows_model.rows.backup_count - 1 });
												that.$refresh_table_list();
											}
										});
									},
								},
							],
						},
					],
					methods: {
						/**
						 * @description 删除站点备份
						 * @param {object} config
						 * @param {function} callback
						 */
						del_site_backup: function (config, callback) {
							bt.confirm({ title: '删除站点备份[' + config.addtime + ']', msg: '删除选中站点备份文件后，<span class="color-red">该站点备份文件将永久消失</span>，是否继续操作？' }, function () {
								bt_tools.send(
									'site/DelBackup',
									{ id: config.id },
									function (rdata) {
										if (callback) callback(rdata);
									},
									true
								);
							});
						},
					},
					success: function () {
						if (callback) callback();
						$('.bt_backup_table').css('top', ($(window).height() - $('.bt_backup_table').height()) / 2 + 'px');
					},
					tootls: [
						{
							// 按钮组
							type: 'group',
							positon: ['left', 'top'],
							list: [
								{
									title: '备份站点',
									active: true,
									event: function (ev, that) {
										bt.site.backup_data(config.id, function (rdata) {
											bt_tools.msg(rdata);
											if (rdata.status) {
												thatC.$modify_row_data({ backup_count: thatC.event_rows_model.rows.backup_count + 1 });
												that.$refresh_table_list();
											}
										});
									},
								},
							],
						},
						{
							type: 'batch',
							positon: ['left', 'bottom'],
							config: {
								title: '删除',
								url: '/site?action=DelBackup',
								paramId: 'id',
								load: true,
								callback: function (that) {
									bt.confirm({ title: '批量删除站点备份', msg: '批量删除选中的站点备份，<span class="color-red">备份文件将永久消失</span>，是否继续操作？', icon: 0 }, function (index) {
										layer.close(index);
										that.start_batch({}, function (list) {
											var html = '';
											for (var i = 0; i < list.length; i++) {
												var item = list[i];
												html +=
													'<tr><td><span class="text-overflow" title="' +
													item.name +
													'">' +
													item.name +
													'</span></td><td><div style="float:right;"><span style="color:' +
													(item.request.status ? '#20a53a' : 'red') +
													'">' +
													item.request.msg +
													'</span></div></td></tr>';
											}
											backup_table.$batch_success_table({ title: '批量删除站点备份', th: '文件名', html: html });
											backup_table.$refresh_table_list(true);
											thatC.$modify_row_data({ backup_count: thatC.event_rows_model.rows.backup_count - list.length });
										});
									});
								},
							}, //分页显示
						},
						{
							type: 'page',
							positon: ['right', 'bottom'], // 默认在右下角
							pageParam: 'p', //分页请求字段,默认为 : p
							page: 1, //当前分页 默认：1
							numberParam: 'limit',
							//分页数量请求字段默认为 : limit
							defaultNumber: 10,
							//分页数量默认 : 20条
						},
					],
				});
			},
		});
	},
	/**
	 * @description 添加站点
	 * @param {object} config  配置参数
	 * @param {function} callback  回调函数
	 */
	add_site: function (callback) {
		var typeId = bt.get_cookie('site_type');
		var add_web = bt_tools.form({
			data: {}, //用于存储初始值和编辑时的赋值内容
			class: '',
			form: [
				{
					label: '域名',
					must: '*',
					group: {
						type: 'textarea', //当前表单的类型 支持所有常规表单元素、和复合型的组合表单元素
						name: 'webname', //当前表单的name
						style: { width: '440px', height: '100px', 'line-height': '22px' },
						tips: {
							//使用hover的方式显示提示
							text: '如需填写多个域名，请换行填写，每行一个域名，默认为80端口<br>IP地址格式：192.168.1.199<br>泛解析添加方法 *.domain.com<br>如另加端口格式为 www.domain.com:88',
							style: { top: '2px', left: '15px' },
						},
						input: function (value, form, that, config, ev) {
							//键盘事件
							var array = value.webname.split('\n'),
								ress = array[0].split(':')[0],
								oneVal = bt.strim(ress.replace(new RegExp(/([-.])/g), '_')),
								defaultPath = $('#defaultPath').text(),
								is_oneVal = ress.length > 0;
							that.$set_find_value(
								is_oneVal
									? {
											ftp_username: oneVal,
											ftp_password: bt.get_random(16),
											datauser: is_oneVal ? oneVal.substr(0, 16) : '',
											datapassword: bt.get_random(16),
											ps: ress,
											path: bt.rtrim(defaultPath, '/') + '/' + ress,
									  }
									: { ftp_username: '', ftp_password: '', datauser: '', datapassword: '', ps: '', path: bt.rtrim(defaultPath, '/') }
							);
						},
					},
				},
				{
					label: '备注',
					group: {
						type: 'text',
						name: 'ps',
						width: '400px',
						placeholder: '网站备注，可为空', //默认标准备注提示
					},
				},
				{
					label: '根目录',
					must: '*',
					group: {
						type: 'text',
						width: '400px',
						name: 'path',
						icon: {
							type: 'glyphicon-folder-open',
							event: function (ev) {},
						},
						value: bt.get_cookie('sites_path') ? bt.get_cookie('sites_path') : '/www/wwwroot',
						placeholder: '请选择文件目录',
					},
				},
				{
					label: 'FTP',
					group: [
						{
							type: 'select',
							name: 'ftp',
							width: '120px',
							disabled: (function () {
								if (bt.config['pure-ftpd']) return !bt.config['pure-ftpd'].setup;
								return true;
							})(),
							list: [
								{ title: '不创建', value: false },
								{ title: '创建', value: true },
							],
							change: function (value, form, that, config, ev) {
								if (value['ftp'] === 'true') {
									form['ftp_username'].parents('.line').removeClass('hide');
								} else {
									form['ftp_username'].parents('.line').addClass('hide');
								}
							},
						},
						(function () {
							if (bt.config['pure-ftpd']['setup']) return {};
							return {
								type: 'link',
								title: '未安装FTP，点击安装',
								name: 'installed_ftp',
								subclass: 'bterror',
								event: function (ev) {
									bt.soft.install('pureftpd');
								},
							};
						})(),
					],
				},
				{
					label: 'FTP账号',
					hide: true,
					group: [
						{ type: 'text', name: 'ftp_username', placeholder: '创建FTP账号', width: '175px', style: { 'margin-right': '15px' } },
						{ label: '密码', type: 'text', placeholder: 'FTP密码', name: 'ftp_password', width: '175px' },
					],
					help: {
						list: ['创建站点的同时，为站点创建一个对应FTP帐户，并且FTP目录指向站点所在目录。'],
					},
				},
				{
					label: '数据库',
					group: [
						{
							type: 'select',
							name: 'sql',
							width: '120px',
							disabled: (function () {
								if (bt.config['mysql']) return !bt.config['mysql'].setup;
								return true;
							})(),
							list: [
								{ title: '不创建', value: false },
								{ title: 'MySQL', value: 'MySQL' },
								// { title: 'SQLServer', value: 'SQLServer', disabled: true, tips: 'Linux暂不支持SQLServer!' }
							],
							change: function (value, form, that, config, ev) {
								if (value['sql'] === 'MySQL') {
									form['datauser'].parents('.line').removeClass('hide');
									form['codeing'].parents('.bt_select_updown').parent().removeClass('hide');
								} else {
									form['datauser'].parents('.line').addClass('hide');
									form['codeing'].parents('.bt_select_updown').parent().addClass('hide');
								}
							},
						},
						(function () {
							if (bt.config.mysql.setup) return {};
							return {
								type: 'link',
								title: '<span style="color:#ef0808">未安装数据库，点击安装</span>',
								subclass: 'bterror',
								name: 'installed_database',
								event: function () {
									bt.soft.install('mysql');
								},
							};
						})(),
						{
							type: 'select',
							name: 'codeing',
							hide: true,
							width: '120px',
							list: [
								{ title: 'utf8mb4', value: 'utf8mb4' },
								{ title: 'utf8', value: 'utf8' },
								{ title: 'gbk', value: 'gbk' },
								{ title: 'big5', value: 'big5' },
							],
						},
					],
				},
				{
					label: '数据库账号',
					hide: true,
					group: [
						{ type: 'text', name: 'datauser', placeholder: '创建数据库账号', width: '175px', style: { 'margin-right': '15px' } },
						{ label: '密码', type: 'text', placeholder: '数据库密码', name: 'datapassword', width: '175px' },
					],
					help: {
						class: '',
						style: '',
						list: ['创建站点的同时，为站点创建一个对应的数据库帐户，方便不同站点使用不同数据库。'],
					},
				},
				{
					label: 'PHP版本',
					group: [
						{
							type: 'select',
							name: 'version',
							width: '120px',
							list: {
								url: '/site?action=GetPHPVersion',
								dataFilter: function (res) {
									var arry = [];
									for (var i = res.length - 1; i >= 0; i--) {
										var item = res[i];
										arry.push({ title: item.name, value: item.version });
									}
									return arry;
								},
							},
						},
					],
				},
				{
					label: '网站分类',
					group: [
						{
							type: 'select',
							name: 'type_id',
							width: '120px',
							list: {
								url: '/site?action=get_site_types',
								dataFilter: function (res) {
									var arry = [];
									$.each(res, function (index, item) {
										arry.push({ title: item.name, value: item.id });
									});
									return arry;
								},
								success: function (res, formObj) {
									setTimeout(function () {
										var index = -1;
										for (var i = 0; i < res.length; i++) {
											if (res[i].id == typeId) {
												index = i;
												break;
											}
										}
										if (index != -1) formObj.element.find('.bt_select_updown[data-name="type_id"]').find('.bt_select_list li').eq(index).click();
									}, 100);
								},
							},
						},
					],
				},
			],
		});
		//其他配置
		var other_config = {
			dataname: 'MySQL',
			codeing: 'utf8mb4',
			datauser: '',
			datapassword: '',
			php: '',
		};
		var keydept_web = bt_tools.form({
			data: {}, //用于存储初始值和编辑时的赋值内容
			class: 'keydept',
			form: [
				{
					label: '域名',
					must: '*',
					group: {
						type: 'textarea', //当前表单的类型 支持所有常规表单元素、和复合型的组合表单元素
						name: 'webname', //当前表单的name
						style: { width: '440px', height: '100px', 'line-height': '22px' },
						tips: {
							//使用hover的方式显示提示
							text: '如需填写多个域名，请换行填写，每行一个域名，默认为80端口<br>泛解析添加方法 *.domain.com<br>如另加端口格式为 www.domain.com:88',
							style: { top: '15px', left: '15px' },
						},
						input: function (value, form, that, config, ev) {
							//键盘事件
							var array = value.webname.split('\n'),
								ress = array[0].split(':')[0],
								oneVal = bt.strim(ress.replace(new RegExp(/([-.])/g), '_')),
								defaultPath = $('#defaultPath').text(),
								is_oneVal = ress.length > 0;
							other_config.datauser = is_oneVal ? oneVal.substr(0, 16) : '';
							that.$set_find_value(
								is_oneVal
									? {
											ps: ress,
											path: bt.rtrim(defaultPath, '/') + '/' + ress,
									  }
									: { ps: '', path: bt.rtrim(defaultPath, '/') }
							);
						},
					},
				},
				{
					label: '备注',
					group: {
						type: 'text',
						name: 'ps',
						width: '400px',
						placeholder: '网站备注，可为空', //默认标准备注提示
					},
				},
				{
					label: '根目录',
					must: '*',
					group: {
						type: 'text',
						width: '400px',
						name: 'path',
						icon: {
							type: 'glyphicon-folder-open',
							event: function (ev) {},
						},
						value: bt.get_cookie('sites_path') ? bt.get_cookie('sites_path') : '/www/wwwroot',
						placeholder: '请选择文件目录',
					},
				},
			],
		});
		var bath_web = bt_tools.form({
			class: 'plr10',
			form: [
				{
					line_style: { position: 'relative' },
					group: {
						type: 'textarea', //当前表单的类型 支持所有常规表单元素、和复合型的组合表单元素
						name: 'bath_code', //当前表单的name
						style: { width: '560px', height: '180px', 'line-height': '22px', 'font-size': '13px' },
						value: '域名|1|0|0|0\n域名|1|0|0|0\n域名|1|0|0|0',
					},
				},
				{
					group: {
						type: 'help',
						style: { 'margin-top': '0' },
						class: 'none-list-style',
						list: [
							'批量格式：域名|根目录|FTP|数据库|PHP版本',
							'<span style="padding-top:5px;display:inline-block;">域名参数：多个域名用&nbsp;,&nbsp;分割</span>',
							'根目录参数：填写&nbsp;1&nbsp;为自动创建，或输入具体目录',
							'FTP参数：填写&nbsp;1&nbsp;为自动创建，填写&nbsp;0&nbsp;为不创建',
							'数据库参数：填写&nbsp;1&nbsp;为自动创建，填写&nbsp;0&nbsp;为不创建',
							'PHP版本参数：填写&nbsp;0&nbsp;为静态，或输入PHP具体版本号列如：56、71、74',
							'<span style="padding-bottom:5px;display:inline-block;">如需添加多个站点，请换行填写</span>',
							'案例：bt.cn,test.cn:8081|/www/wwwroot/bt.cn|1|1|56',
						],
					},
				},
			],
		});
		var web_tab = bt_tools.tab({
			class: 'pd20',
			type: 0,
			theme: { nav: 'mlr20' },
			active: 1, //激活TAB下标
			list: [
				{
					title: '创建站点',
					name: 'createSite',
					content: add_web.$reader_content(),
					success: function () {
						add_web.$event_bind();
					},
				},
				{
					title: '一键部署',
					name: 'keyDeployment',
					content: keydept_web.$reader_content(),
					success: function () {
						keydept_web.$event_bind();
						$('.keydept').parent().parent().css('padding', '10px 10px 0 10px');
						$.post('/deployment?action=GetSiteList', function (rdata) {
							$.post('/site?action=GetPHPVersion', function (res) {
								var php_version = [],
									php_version_normal = [];
								var n = 0;
								for (var i = res.length - 1; i >= 0; i--) {
									var item = res[i];
									php_version_normal.push({ title: item.name, value: item.version });
								}
								$('.keydept .bt-form').prepend(
									'<div class="line" style="padding: 5px 0 0 0;"><span class="tname"><span class="color-red mr5">*</span>模板部署</span><div class="info-r"><div class="deployment_line"></div></div></div>'
								);
								$('.keydept .bt-form').prepend(
									'<div class="dep_msg">快速的部署网站程序，商城、论坛、博客、框架等程序，<a class="btlink" target="_blank" href="https://www.bt.cn/bbs/thread-33063-1-1.html">免费入驻平台</a></div>'
								);
								$('.keydept .bt-form').append(
									'<div class="line">\
                <span class="tname"><span class="color-red mr5">*</span>其他配置</span>\
                <div class="info-r">\
                  <div class="dep_config"><div class="database_info"></div><hr><div class="php_info"></div></div>\
                  <div class="c9 mt5">其他配置初始状态为默认选择的配置项，如需修改请点击<a class="btlink edit_dep_config">编辑配置</a>。</div>\
                </div>\
              </div>'
								);
								var deployment_line = $('.deployment_line'),
									edit_dep_config = $('.edit_dep_config');
								(database_info = $('.database_info')), (php_info = $('.php_info'));
								//动态修改其他配置
								$('[name="webname"]').keyup(function () {
									otherConfig(other_config);
								});
								render_dep_mode();
								var dep_mode = $('.dep_mode');
								//模板点击事件
								dep_mode.click(function () {
									var index = $(this).index();
									var data = $(this).data();
									if (index === 5 && !data['codename']) {
										//更多模板
										depMoreClick();
										return;
									} else {
										$(this).addClass('active').siblings().removeClass('active');
										is_vespub(data);
									}
								});
								dep_mode.eq(0).click();
								//模板悬浮
								dep_mode.hover(
									function () {
										var i = $(this).index();
										var data = $(this).data();
										if (data['codename']) {
											if (i === 5) if (data.idxs) i = data.idxs;
											var item = rdata.list[i];
											var texts = '名称：' + item.title + '<br>';
											texts += '版本：' + item.version + '<br>';
											texts += '简介：' + item.ps.replace('<a', ',,<a').split(',,')[0] + '<br>';
											texts += '支持PHP版本：' + item.php + '<br>';
											texts += '官网：' + (item.author === '宝塔' ? item.official.replace(/^http[s]?:\/\//, '').split('/')[0] : item.author) + '<br>';
											texts += '评价：' + item.score + '<br>';
											layer.tips(texts, this, { time: 0, tips: [1, '#999'] });
										}
									},
									function () {
										layer.closeAll('tips');
									}
								);
								//编辑配置
								edit_dep_config.click(function () {
									layer.open({
										type: 1,
										title: '编辑配置',
										area: '590px',
										closeBtn: 2,
										shadeClose: false,
										skin: 'edit_dep_form',
										content: '<div id="dep_form"></div>',
										success: function (layers, indexs) {
											bt_tools.form({
												el: '#dep_form',
												class: 'pd15',
												form: [
													{
														label: '数据库',
														group: [
															{
																type: 'select',
																name: 'sql',
																width: '120px',
																disabled: (function () {
																	if (bt.config['mysql']) return !bt.config['mysql'].setup;
																	return true;
																})(),
																placeholder: '未安装数据库',
																list: bt.config.mysql.setup ? [{ title: 'MySQL', value: 'MySQL' }] : [],
															},
															(function () {
																if (bt.config.mysql.setup) return {};
																return {
																	type: 'link',
																	title: '<span style="color:#ef0808">未安装数据库，点击安装</span>',
																	name: 'installed_database',
																	event: function () {
																		bt.soft.install('mysql');
																	},
																};
															})(),
															{
																type: 'select',
																hide: bt.config.mysql.setup ? false : true,
																name: 'codeing',
																width: '120px',
																value: other_config.codeing,
																list: [
																	{ title: 'utf8', value: 'utf8' },
																	{ title: 'utf8mb4', value: 'utf8mb4' },
																	{ title: 'gbk', value: 'gbk' },
																	{ title: 'big5', value: 'big5' },
																],
															},
														],
													},
													{
														label: '数据库账号',
														group: [
															{ type: 'text', value: other_config.datauser, name: 'datauser', placeholder: '创建数据库账号', width: '175px', style: { 'margin-right': '15px' } },
															{ label: '密码', value: other_config.datapassword, type: 'text', placeholder: '数据库密码', name: 'datapassword', width: '175px' },
														],
														help: {
															class: '',
															style: '',
															list: ['创建站点的同时，为站点创建一个对应的数据库帐户，方便不同站点使用不同数据库。'],
														},
													},
													{
														label: 'PHP版本',
														group: [
															{
																type: 'select',
																name: 'version',
																width: '120px',
																placeholder: '无支持版本',
																list: php_version,
															},
															(function () {
																if (php_version.length) return {};
																return {
																	type: 'link',
																	title: '点击安装',
																	name: 'installed_php',
																	event: function () {
																		installPhp($('.dep_mode.active').data('versions'));
																	},
																};
															})(),
														],
													},
													{
														label: '',
														group: {
															type: 'button',
															title: '保存配置',
															name: 'save_dep_config',
															event: function (formData, element, that) {
																if (formData.datauser === '' || $.trim(formData.datauser) === '') return bt_tools.msg('数据库账号不能为空！', 2);
																if (formData.datapassword === '' || $.trim(formData.datapassword) === '') return bt_tools.msg('数据库密码不能为空！', 2);
																other_config.datauser = formData.datauser;
																other_config.datapassword = formData.datapassword;
																other_config.codeing = formData.codeing;
																other_config.php = formData.version === undefined ? '' : formData.version;
																otherConfig(other_config);
																layer.close(indexs);
															},
														},
													},
												],
											});
										},
									});
								});
								//模板点击事件公共
								function is_vespub(data) {
									(php_version = []), (n = 0);
									clear_other_config();
									for (var i = res.length - 1; i >= 0; i--) {
										if (data.versions.toString().indexOf(res[i].version) != -1) {
											php_version.push({ title: res[i].name, value: res[i].version });
											n++;
										}
									}
									var timestamp = new Date().getTime().toString();
									var dtpw = timestamp.substring(7);
									other_config.datauser = 'sql' + dtpw;
									other_config.datapassword = _getRandomString(10);
									other_config.php = php_version.length ? php_version[0].value : '';
									otherConfig(other_config);
									$('.funcReleaseMsg').remove();
									if (data.enable_functions.length > 2) {
										$('.keydept .line:eq(4) .c9.mt5').after('<div class="funcReleaseMsg color-red mt5">注意：部署此项目，以下函数将被解禁：' + data.enable_functions + '</div>');
									}
								}
								//打开更多模板
								function depMoreClick() {
									layer.open({
										type: 1,
										title: '模板',
										area: ['840px', '660px'],
										closeBtn: 2,
										shadeClose: false,
										content:
											'<div id="render_deployment" class="anim-content"><div class="anim-content-left"><p data-type="many">精选推荐</p><p data-type="all">全部</p></div>\
                    <div class="anim-content-right">\
                      <div class="right-top">\
                        <div class="right-top-search">\
                            <input type="text" class="search-input" placeholder="请输入搜索内容" style="flex: 1;">\
                            \
                            <button type="button" class="ser-sub pull-left"></button>\
                        </div>\
                    </div>\
                    <div class="right-bottom"></div>\
                  </div></div>',
										success: function (layers, indexs) {
											var type_html = '',
												left_type = $('.anim-content-left'),
												cont_mode = $('#render_deployment .right-bottom');
											//分类
											$.each(rdata.dep_type, function (i, item) {
												type_html += '<p data-type="' + item.tid + '">' + item.title + '</p>';
											});
											left_type.append(type_html);
											setTimeout(function () {
												left_type.find('p').eq(0).click();
											}, 50);
											left_type.find('p').click(function () {
												$(this).addClass('checked').siblings().removeClass('checked');
												var type = $(this).data('type'),
													con_html = '';
												$.each(rdata.list, function (i, item) {
													var ps = item.ps.replace('<a', ',,<a').split(',,');
													var html =
														'<div class="content-card">\
                          <div class="card-logo"><img src="' +
														item.min_image +
														'" alt="" width="100%"></div>\
                          <div class="card-info">\
                            <div class="card-info-title" title="' +
														item.title +
														'">' +
														item.title +
														'</div>\
                            <div class="card-info-text">\
                              <div>简介：<span class="synopsis" title="' +
														ps[0] +
														'">' +
														ps[0] +
														'</span>' +
														ps[1] +
														'</div>\
                              <div>版本：<span style="margin-right: 17px;">' +
														item.version +
														'</span>评分：<span>' +
														item.score +
														'</span></div>\
                            </div>\
                            <div class="card-bottom">\
                              <div class="gwinfo">官网：<a class="btlink" target="_blank" rel="noreferrer noopener" href="' +
														item.official +
														'">' +
														(item.author === '宝塔' ? item.official.replace(/^http[s]?:\/\//, '').split('/')[0] : item.author) +
														'</a></div>\
                              <div class="btn-click" data-index="' +
														i +
														'">选择模板</div>\
                            </div>\
                          </div>\
                        </div>';
													switch (type) {
														case 'many':
															if (item.is_many === 0) con_html += html;
															break;
														case 'all':
															con_html += html;
															break;
														default:
															if (item.type === type) con_html += html;
															break;
													}
												});
												cont_mode.html(con_html);
												var idxs = $('.dep_mode.active').data().idxs;
												$('.content-card')
													.find('[data-index="' + idxs + '"]')
													.parent()
													.parent()
													.parent()
													.addClass('active')
													.siblings()
													.removeClass('active');
											});
											$('#render_deployment .right-bottom').on('click', '.btn-click', function () {
												var index = $(this).data('index');
												data = rdata.list[index];
												if (index >= 5) {
													index = 5;
													dep_mode
														.eq(index)
														.empty()
														.append(
															'<div><img src="' +
																data.min_image +
																'" />' +
																'<span class="dep_title">' +
																data.title +
																' ' +
																data.version +
																'</span>' +
																'</div><div><a class="dep_more btlink">更多模板>></a></div>'
														);
													dep_mode.eq(index).css({ 'align-items': 'center', 'text-align': 'left', 'line-height': '22px' });
													$('.dep_more').css({ 'line-height': '12px', dispaly: 'inlineBlock' });
													dep_mode
														.eq(index)
														.data('idxs', $(this).data('index'))
														.data('codename', data.name)
														.data('version', data.version)
														.data('versions', data.php)
														.data('title', data.title)
														.data('enable_functions', data.enable_functions);
													$('.dep_more').click(function () {
														depMoreClick();
													});
												}
												dep_mode.eq(index).addClass('active').siblings().removeClass('active');
												data['img'] = data.min_image;
												data['codename'] = data.name;
												data['versions'] = data.php;
												is_vespub(data);
												layer.close(indexs);
											});
										},
									});
								}
								//清空其他配置
								function clear_other_config() {
									other_config.php = '';
									other_config.datauser = '';
									other_config.datapassword = '';
								}
								//渲染模板部署
								function render_dep_mode() {
									var deployment_line_info = '';
									for (var i = 0; i < rdata.list.length; i++) {
										var item = rdata.list[i];
										if (i > 5) continue;
										var ps = item.ps.replace('<a', ',,<a').split(',,');
										if (i === 5) {
											deployment_line_info += '<div class="dep_mode dep_mode_more">' + '<a class="dep_more btlink">更多模板>></a>' + '</div>';
										} else {
											deployment_line_info +=
												'<div class="dep_mode" data-idxs="' +
												i +
												'" data-codename="' +
												item.name +
												'" data-version="' +
												item.version +
												'" data-versions="' +
												item.php +
												'" data-title="' +
												item.title +
												'" data-enable_functions="' +
												item.enable_functions +
												'">' +
												// (item.is_many === 0 ? '<span class="recommend-pay-icon"></span>':'')+
												'<img src="' +
												item.min_image +
												'" />' +
												'<span><span class="dep_title">' +
												item.title +
												' ' +
												item.version +
												'</span>' +
												'<div class="dep_ps"><span>' +
												ps[0] +
												'</span></div></span>' +
												'</div>';
										}
									}
									deployment_line.empty().append(deployment_line_info);
								}
								//渲染其他配置
								function otherConfig(database) {
									var db_html = '',
										phpVersions = $('.dep_mode.active').data('versions');
									db_html +=
										'<span class="mr10">数据库：' +
										(bt.config['mysql'].setup ? database.dataname + '数据库' : '<a class="btlink install_database" style="color:#ef0808">未安装数据库，点击安装</a>') +
										'</span>';
									if (bt.config['mysql'].setup)
										db_html +=
											'<span class="mr10">编码：' +
											database.codeing +
											'</span>\
                  <span class="mr10" title="' +
											database.datauser +
											'">账号：' +
											database.datauser +
											'</span>\
                  <span title="' +
											database.datapassword +
											'">密码：' +
											database.datapassword +
											'</span>';
									database_info.empty().append(db_html);
									php_info
										.empty()
										.append('PHP版本：' + (database.php === '' ? '<span class="bterror">缺少被支持的PHP版本(' + phpVersions + ')<a class="btlink install_php">>>立即安装</a></span>' : database.php));
									$('.install_database').click(function () {
										bt.soft.install('mysql');
									});
									$('.install_php').click(function () {
										installPhp(phpVersions);
									});
								}
								//安装php版本
								function installPhp(phpVersions) {
									var item = phpVersions.toString().split(','),
										versions = [],
										select = '',
										html = '';
									for (var i = 0; i < item.length; i++) {
										var num = (parseInt(item[i]) / 10).toFixed(1);
										versions.push({ m_version: 'php-' + num });
									}
									$.each(versions, function (index, item) {
										select += '<option data-index="' + index + '">' + item.m_version + '</option>';
									});
									html += '<select id="SelectVersion" class="bt-input-text ml10" style="margin-left:10px">' + select + '</select>';
									var loadOpen = bt.open({
										type: 1,
										title: 'php软件安装',
										area: '400px',
										btn: [lan['public'].submit, lan['public'].close],
										content:
											"<div class='bt-form pd20 c6'>\
                    <div class='version line' style='padding-left:15px'>" +
											lan.soft.install_version +
											'：' +
											html +
											"</div>\
                    <div class='fangshi line' style='padding-left:15px;margin-bottom:0px'>" +
											lan.bt.install_type +
											"：<label data-title='" +
											lan.bt.install_src_title +
											"'>" +
											lan.bt.install_src +
											"<input type='checkbox' name='installType' value='0'></label><label data-title='" +
											lan.bt.install_rpm_title +
											"'>" +
											lan.bt.install_rpm +
											"<input type='checkbox' name='installType' value='1' checked></label></div>\
                    <div class='install_modules' style='display: none;'>\
                      <div style='margin-bottom:15px;padding-top:15px;border-top:1px solid #ececec;'><button onclick=\"bt.soft.show_make_args('" +
											name +
											"')\" class='btn btn-success btn-sm'>添加自定义模块</button></div>\
                      <div class='select_modules divtable' style='margin-bottom:20px'>\
                        <table class='table table-hover'>\
                          <thead>\
                            <tr>\
                              <th width='10px'></th>\
                              <th width='80px'>模块名称</th>\
                              <th >模块描述</th>\
                              <th width='80px'>操作</th>\
                            </tr>\
                          </thead>\
                          <tbody class='modules_list'></tbody>\
                        </table>\
                      </div>\
                    </div>\
                  </div>",
										success: function () {
											$('.fangshi input').click(function () {
												$(this).attr('checked', 'checked').parent().siblings().find('input').removeAttr('checked');
												var type = parseInt($('[name="installType"]:checked').val());
												if (type) {
													$('.install_modules').hide();
													return;
												}
												if (bt.soft.check_make_is('php')) {
													$('.install_modules').show();
													bt.soft.get_make_args('php');
												}
											});
										},
										yes: function (indexs, layers) {
											loadOpen.close();
											layer.close(indexs);
											var name = $('#SelectVersion option:selected').val();
											bt.soft.get_soft_find(name, function (rdata) {
												rdata['install_type'] = parseInt($('[name="installType"]:checked').val());
												if (rdata.versions.length > 1) {
													var index = $('#SelectVersion option:selected').attr('data-index');
													rdata['install_version'] = rdata.versions[index];
													bt.soft.install_soft(rdata, this);
												} else {
													rdata['install_version'] = rdata.versions[0];
													bt.soft.install_soft(rdata, this);
												}
											});
										},
									});
								}
								//生成n位随机密码
								function _getRandomString(len) {
									len = len || 32;
									var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
									var maxPos = $chars.length;
									var pwd = '';
									for (i = 0; i < len; i++) {
										pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
									}
									return pwd;
								}
							});
						});
					},
				},
				{
					title: '批量创建',
					name: 'batchCreation',
					content: bath_web.$reader_content(),
					success: function () {
						bath_web.$event_bind();
					},
				},
			],
		});
		bt_tools.open({
			title: '添加站点-支持批量建站',
			skin: 'custom_layer',
			area: '700px',
			btn: ['提交', '取消'],
			content: web_tab.$reader_content(),
			success: function (layers) {
				web_tab.$init();
				$(layers)
					.find('.layui-layer-content')
					.css('overflow', window.innerHeight > $(layers).height() ? 'inherit' : 'auto');
			},
			yes: function (indexs) {
				var formValue = !web_tab.active ? add_web.$get_form_value() : web_tab.active === 1 ? keydept_web.$get_form_value() : bath_web.$get_form_value();
				if (!web_tab.active || web_tab.active === 1) {
					// 创建站点 //一键部署
					var loading = bt.load();
					if (!web_tab.active) {
						add_web.$get_form_element(true);
						if (formValue.webname === '') {
							add_web.form_element.webname.focus();
							bt_tools.msg('域名不能为空！', 2);
							return;
						}
					} else {
						keydept_web.$get_form_element(true);
						if (formValue.webname === '') {
							keydept_web.form_element.webname.focus();
							bt_tools.msg('域名不能为空！', 2);
							return;
						}
						if (!bt.config['mysql'].setup) {
							bt_tools.msg('未安装数据库！', 2);
							return;
						}
						if (other_config.php === '') {
							layer.msg('缺少被支持的PHP版本，请安装!', {
								icon: 5,
							});
							return;
						}
						if (other_config.datauser === '') {
							bt_tools.msg('数据库账号不能为空！', 2);
							return;
						}
						if (other_config.datapassword === '') {
							bt_tools.msg('数据库密码不能为空！', 2);
							return;
						}
					}
					var webname = bt.replace_all(formValue.webname, 'http[s]?:\\/\\/', ''),
						web_list = webname.split('\n'),
						param = { webname: { domain: '', domainlist: [], count: 0 }, type: 'PHP', port: 80 },
						arry = ['ps', ['path', '网站目录'], 'type_id', 'version', 'ftp', 'sql', 'ftp_username', 'ftp_password', 'datauser', 'datapassword', 'codeing'];
					for (var i = 0; i < web_list.length; i++) {
						var temps = web_list[i].replace(/\r\n/, '').split(':');
						if (i === 0) {
							param['webname']['domain'] = web_list[i].replace(/[\r\n]/g, '');
							if (typeof temps[1] != 'undefined') param['port'] = temps[1];
						} else {
							param['webname']['domainlist'].push(web_list[i]);
						}
					}
					param['webname']['count'] = param['webname']['domainlist'].length;
					param['webname'] = JSON.stringify(param['webname']);
					$.each(arry, function (index, item) {
						if (formValue[item] == '' && Array.isArray(item)) {
							bt_tools.msg(item[1] + '不能为空?', 2);
							return false;
						}
						Array.isArray(item) ? (item = item[0]) : '';
						if (formValue['ftp'] === 'false' && (item === 'ftp_username' || item === 'ftp_password')) return true;
						if (formValue['sql'] === 'false' && (item === 'datauser' || item === 'datapassword')) return true;
						param[item] = formValue[item];
					});
					if (typeof param.ftp === 'undefined') {
						param.ftp = false;
						delete param.ftp_password;
						delete param.ftp_username;
					}
					if (typeof param.sql === 'undefined') {
						param.sql = false;
						delete param.datapassword;
						delete param.datauser;
					}
					if (web_tab.active) {
						param['webname_1'] = webname;
						param['address'] = 'localhost';
						param['sql'] = true;
						param['datauser'] = other_config.datauser.replace(/[\r\n]/g, '');
						param['datapassword'] = other_config.datapassword;
						param['version'] = other_config.php;
						param['codeing'] = other_config.codeing;
						delete param.type;
						delete param.type_id;
					}
					bt.send('AddSite', 'site/AddSite', param, function (rdata) {
						loading.close();
						if (rdata.siteStatus) {
							layer.close(indexs);
							site_table.$refresh_table_list(true);
							if (callback) callback(rdata, param);
							var html = '',
								ftpData = '',
								sqlData = '';
							if (rdata.ftpStatus) {
								var list = [];
								list.push({ title: lan.site.user, val: rdata.ftpUser });
								list.push({ title: lan.site.password, val: rdata.ftpPass });
								var item = {};
								item.title = lan.site.ftp;
								item.list = list;
								ftpData = bt.render_ps(item);
							}
							if (rdata.databaseStatus) {
								var list = [];
								list.push({ title: lan.site.database_name, val: rdata.databaseUser });
								list.push({ title: lan.site.user, val: rdata.databaseUser });
								list.push({ title: lan.site.password, val: rdata.databasePass });
								var item = {};
								item.title = lan.site.database_txt;
								item.list = list;
								sqlData = bt.render_ps(item);
							}
							var dep_cont = $('.dep_mode.active').data();
							if (web_tab.active) {
								//一键部署
								if (!rdata.databaseStatus) {
									sqlData =
										"<p class='p1'>数据库账号资料</p>\
                    <p><span>数据库名：</span><strong>数据库创建失败,请检查是否存在同名数据库!</strong></p>\
                    <p><span>用户：</span><strong>数据库创建失败,请检查是否存在同名数据库!</strong></p>\
                                  <p><span>密码：</span><strong>数据库创建失败,请检查是否存在同名数据库!</strong></p>\
                                ";
								}
								var pdata = {
									dname: dep_cont.codename,
									site_name: web_list[0].replace(/[\r\n]/g, '').split(':')[0],
									php_version: param.version,
									source: 1,
								};
								var loadT = layer.msg('<div class="depSpeed">正在提交 <img src="/static/img/ing.gif"></div>', {
									icon: 16,
									time: 0,
									shade: [0.3, '#000'],
								});
								var intervalGetSpeed = setInterval(function () {
									GetSpeed();
								}, 2000);
								bt.send('SetupPackage', 'deployment/SetupPackage', pdata, function (res) {
									layer.close(loadT);
									clearInterval(intervalGetSpeed);
									if (!res.status) {
										layer.msg(res.msg, {
											icon: 5,
											time: 10000,
										});
										return;
									}
									lan.site.success_txt = '已成功部署【' + dep_cont.title + '】';
									if (res.msg.admin_username != '') {
										sqlData =
											"<p class='p1'>已成功部署，无需安装，请登录修改默认账号密码</p>\
                            <p><span>用户：</span><strong>" +
											res.msg.admin_username +
											'</strong></p>\
                            <p><span>密码：</span><strong>' +
											res.msg.admin_password +
											'</strong></p>\
                            ';
									}
									sqlData +=
										"<p><span>访问站点：</span><a class='btlink' href='http://" +
										(web_list[0] + '/' + res.msg.success_url).replace('//', '/') +
										"' target='_blank' rel='noreferrer noopener'>http://" +
										(web_list[0] + '/' + res.msg.success_url).replace('//', '/') +
										'</a></p>';
									pub();
								});
							} else {
								if (ftpData == '' && sqlData == '') {
									bt.msg({ msg: lan.site.success_txt, icon: 1 });
								} else {
									pub();
								}
							}
							function pub() {
								bt.open({
									type: 1,
									area: '600px',
									title: lan.site.success_txt,
									closeBtn: 2,
									shadeClose: false,
									content: "<div class='success-msg'><div class='pic'><img src='/static/img/success-pic.png'></div><div class='suc-con'>" + ftpData + sqlData + '</div></div>',
								});
								if (web_tab.active) $('.suc-con p').eq(4).remove();
								if ($('.success-msg').height() < 150) {
									$('.success-msg').find('img').css({ width: '150px', 'margin-top': '30px' });
								}
							}
						} else {
							bt.msg(rdata);
						}
					});
				} else {
					//批量创建
					var loading = bt.load();
					if (formValue.bath_code === '') {
						bt_tools.msg('请输入需要批量创建的站点信息!', 2);
						return false;
					} else {
						var arry = formValue.bath_code.split('\n'),
							config = '',
							_list = [];
						for (var i = 0; i < arry.length; i++) {
							var item = arry[i],
								params = item.split('|'),
								_arry = [];
							if (item === '') continue;
							for (var j = 0; j < params.length; j++) {
								var line = i + 1,
									items = bt.strim(params[j]);
								_arry.push(items);
								switch (j) {
									case 0: //参数一:域名
										var domainList = items.split(',');
										for (var z = 0; z < domainList.length; z++) {
											var domain_info = domainList[z].trim(),
												_domain = domain_info.split(':');
											if (!bt.check_domain(_domain[0])) {
												bt_tools.msg('第' + line + '行,域名格式错误【' + domain_info + '】，可用范围：1-65535', 2);
												return false;
											}
											if (typeof _domain[1] !== 'undefined') {
												if (!bt.check_port(_domain[1])) {
													bt_tools.msg('第' + line + '行,域名端口格式错误【' + _domain[1] + '】，可用范围：1-65535', 2);
													return false;
												}
											}
										}
										break;
									case 1: //参数二:站点目录
										if (items !== '1') {
											if (items.indexOf('/') < -1) {
												bt_tools.msg('第' + line + '行,站点目录格式错误【' + items + '】', 2);
												return false;
											}
										}
										break;
								}
							}
							_list.push(_arry.join('|').replace(/\r|\n/, ''));
						}
					}
					bt.send('create_type', 'site/create_website_multiple', { create_type: 'txt', websites_content: JSON.stringify(_list) }, function (rdata) {
						loading.close();
						if (rdata.status) {
							var _html = '';
							layer.close(indexs);
							if (callback) callback(rdata);
							$.each(rdata.error, function (key, item) {
								_html += '<tr><td>' + key + '</td><td>--</td><td>--</td><td style="text-align: right;"><span style="color:red">' + item + '</td></td></tr>';
							});
							$.each(rdata.success, function (key, item) {
								_html +=
									'<tr><td>' +
									key +
									'</td><td>' +
									(item.ftp_status ? '<span style="color:#20a53a">成功</span>' : '<span>未创建</span>') +
									'</td><td>' +
									(item.db_status ? '<span style="color:#20a53a">成功</span>' : '<span>未创建</span>') +
									'</td><td  style="text-align: right;"><span style="color:#20a53a">创建成功</span></td></tr>';
							});
							bt.open({
								type: 1,
								title: '站点批量添加',
								area: ['500px', '450px'],
								shadeClose: false,
								closeBtn: 2,
								content:
									'<div class="fiexd_thead divtable" style="margin: 15px 30px 15px 30px;overflow: auto;height: 360px;"><table class="table table-hover"><thead><tr><th>站点名称</th><th>FTP</th><th >数据库</th><th style="text-align:right;width:150px;">操作结果</th></tr></thead><tbody>' +
									_html +
									'</tbody></table></div>',
								success: function () {
									$('.fiexd_thead').scroll(function () {
										var scrollTop = this.scrollTop;
										this.querySelector('thead').style.transform = 'translateY(' + scrollTop + 'px)';
									});
								},
							});
						} else {
							bt.msg(rdata);
						}
					});
				}
			},
		});
	},
	// 高级设置
	site_advance_set: function (index) {
		var _this = this;
		bt.open({
			type: 1,
			area: ['836px', '700px'],
			title: '高级设置',
			closeBtn: 2,
			shift: 0,
			content:
				"<div class='bt-tabs'><div class='bt-w-menu site-menu pull-left' style='height: 100%;width: 126px;'></div><div id='advance-con' class='bt-w-con webedit-con pd15' style='margin-left: 126px;'></div></div>",
		});
		setTimeout(function () {
			var menus = [
				// { title: '修改默认页面', callback: site.edit.set_domains },
				{ title: '修改默认页面', callback: site.advance_list.set_default_page },
				{ title: '默认站点', callback: site.advance_list.set_default_domain },
				{ title: 'PHP命令版本', callback: site.advance_list.set_php_cli_version },
				{ title: 'HTTPS防窜站', callback: site.advance_list.set_safe_config },
				{ title: 'TLS设置', callback: site.advance_list.set_tsl },
				{ title: '全局设置', callback: site.advance_list.set_site_config },
			];
			for (var i = 0; i < menus.length; i++) {
				var men = menus[i];
				var _p = $('<p>' + men.title + '</p>');
				// _p.data('callback', men.callback);
				$('.site-menu').append(_p);
			}
			$('.site-menu p').css('padding-left', '25px');
			$('.site-menu p').click(function () {
				$('#advance-con').html('');
				$(this).addClass('bgw').siblings().removeClass('bgw');
				var callback = menus[$(this).index()].callback
				if(callback) callback()
			});
			site.reload(index);
		}, 100);
	},
	advance_list: {
		set_default_page: function () {
			var tabConfig = bt_tools.tab({
				class: '',
				type: 0,
				theme: { nav: 'ml0 mb15' },
				active: 1, //激活TAB下标
				list: [
					{
						title: '新建网站默认页面',
						name: 'tabname',
						content: '',
						success: function () {
							//对tab_table进行方法渲染}
						},
					},
					{
						title: '404错误页',
						name: 'tabname2',
						content: '',
						success: function () {
							//对tab_table2进行方法渲染}
						},
					},
					{
						title: '网站不存在页',
						name: 'tabname3',
						content: '',
						success: function () {
							//对tab_table3进行方法渲染}
						},
					},
					{
						title: '网站停用后的提示页',
						name: 'tabname4',
						content: '',
						success: function () {
							//对tab_table4进行方法渲染}
						},
					},
				],
			});
			$('#advance-con').html(tabConfig.$reader_content()).find('.tab-con').css({ padding: '10px 0' });
			$('#advance-con')
				.off('click')
				.on('click', '.tab-nav span', function () {
					var that = this;
					var viewIndex = $(this).index();
					var view_list = ['default', '404', 'unexist', 'stop'];
					bt.site.get_default_path(viewIndex, function (path) {
						bt_tools.send({url:'/files?action=GetFileBody', data:{path :path}}, function (rdata) {
							if (!rdata.status) {
								bt.msg({
									msg: rdata.msg,
									icon: 5,
								});
								return;
							}
							var u = ['utf-8', 'GBK', 'GB2312', 'BIG5'];
							var n = '';
							for (var p = 0; p < u.length; p++) {
								m = rdata.encoding === u[p] ? 'selected' : '';
								n += '<option value="' + u[p] + '" ' + m + '>' + u[p] + '</option>';
							}
							$(that).addClass('on').siblings().removeClass('on');
							$('#advance-con .tab-con .tab-block')
								.eq(viewIndex)
								.html(
									'<div class="bt-form">\
						<p style="color: #666; margin-bottom: 7px">提示：Ctrl+F 搜索关键字，Ctrl+S 保存，Ctrl+H 查找替换<select class="bt-input-text" name="encoding" style="width: 80px;position: absolute;top: 7px;right: 0;height: 22px;z-index: 9999;border-radius: 0;">' +
										n +
										'</select></p>\
						<div id="' +
										view_list[viewIndex] +
										'_view_con" class="bt-input-text ace_config_editor_scroll" style="height: 500px; line-height: 18px;"></div>\
						<button id="' +
										view_list[viewIndex] +
										'_view_btn" class="btn btn-success btn-sm" style="margin-top:10px;">保存</button>\
						</div>'
								)
								.addClass('on')
								.siblings()
								.removeClass('on');
							var view = bt.default_view_aceEditor({ el: view_list[viewIndex] + '_view_con', content: rdata.data, path: path, index: viewIndex });
							$('#' + view_list[viewIndex] + '_view_btn')
								.off('click')
								.on('click', function (e) {
									bt.saveEditor(view, $('select[name=encoding]:eq(' + viewIndex + ')').val());
								});
							// $('#' + view_list[viewIndex] +'_view_con textarea').off('blur').on('blur',function(){
							// 	bt.saveEditor(view,$('select[name=encoding]:eq('+ viewIndex +')').val());
							// })
							$('select[name=encoding]:eq(' + viewIndex + ')')
								.off('change')
								.on('change', function (e) {
									bt.saveEditor(view, $('select[name=encoding]:eq(' + viewIndex + ')').val());
								});
							setTimeout(function () {
								$('.ace_scrollbar-h').hide();
							}, 10);
						},'加载配置信息');
					});
				});
			$('#advance-con .tab-nav span:eq(0)').trigger('click');
		},
		set_default_domain: function () {
			bt.site.get_default_site(function (rdata) {
				var arrs = [];
				arrs.push({ title: '未设置默认站点', value: '0' });
				for (var i = 0; i < rdata.sites.length; i++) arrs.push({ title: rdata.sites[i].name, value: rdata.sites[i].name });
				var domain_form = bt_tools.form({
					el: '#advance-con',
					class: 'mtb15',
					form: [
						{
							label: '默认站点',
							group: {
								type: 'select',
								name: 'defaultSite',
								width: '250px',
								list: arrs,
								value: rdata.defaultSite,
								change: function (formData, element, that) {
									// 选中下拉项后
								},
							},
						},
						{
							group: {
								type: 'button',
								class: 'ml20',
								name: 'submitForm',
								title: '保存',
								event: function (formData, element, that) {
									bt.site.set_default_site(formData.defaultSite, function (rdata) {
										bt.msg(rdata);
									});
								},
							},
						},
					],
				});
				$('#advance-con .line:eq(0)').after($(bt.render_help([lan.site.default_site_help_1, lan.site.default_site_help_2])).addClass('plr20'));
			});
		},
		set_php_cli_version: function () {
			$.post('/config?action=get_cli_php_version', {}, function (rdata) {
				if (rdata.status === false) {
					layer.msg(rdata.msg, { icon: 2 });
					return;
				}
				var arrs = [];
				for (var i = 0; i < rdata.versions.length; i++) arrs.push({ title: rdata.versions[i].name, value: rdata.versions[i].version });
				var domain_form = bt_tools.form({
					el: '#advance-con',
					class: 'mtb15',
					form: [
						{
							label: 'PHP-CLI版本',
							group: {
								type: 'select',
								name: 'php_version',
								width: '250px',
								list: arrs,
								value: rdata.select.version,
								change: function (formData, element, that) {
									// 选中下拉项后
								},
							},
						},
						{
							group: {
								type: 'button',
								class: 'ml20',
								name: 'submitForm',
								title: '保存',
								event: function (formData, element, that) {
									site.set_cli_version();
								},
							},
						},
					],
				});
				$('#advance-con .line:eq(0)').after(
					'<ul class="help-info-text c7 plr20">\
				<li>此处可设置命令行运行php时使用的PHP版本</li>\
				<li>安装新的PHP版本后此处需要重新设置</li>\
				<li>其它PHP版本在命令行可通过php+版本的方式运行，如：php74,php80</li>\
				</ul>'
				);
			});
		},
		set_safe_config: function () {
			var loadT = bt.load('正在获取网站设置，请稍候...');
			bt.send('get_https_mode', 'site/get_https_mode', {}, function (res) {
				loadT.close();
				if (typeof res == 'boolean') {
					var domain_form = bt_tools.form({
						el: '#advance-con',
						class: 'mtb15',
						form: [
							{
								label: 'HTTPS防窜站',
								group: {
									name: 'https_mode',
									type: 'other',
									boxcontent:
										'<div style="height: 32px; padding-top: 6px;"><input class="btswitch btswitch-ios" id="https_mode" type="checkbox" name="https_mode">\
																	<label class="btswitch-btn" for="https_mode" style="margin-bottom: 0;"></label>\
																</div>',
								},
							},
						],
					});
					$('#https_mode').prop('checked', res);
					$('#https_mode').change(function () {
						var loadT = bt.load('正在设置HTTPS防窜站，请稍候...');
						bt.send('set_https_mode', 'site/set_https_mode', {}, function (res) {
							loadT.close();
							bt.msg(res);
							if (!res.status) {
								var checked = $('#https_mode').is(':checked');
								$('#https_mode').prop('checked', !checked);
							}
						});
					});
					$('#advance-con .line:eq(0)').after(
						'<ul class="help-info-text c7 plr20">\
												<li>开启后可以解决HTTPS窜站的问题</li>\
												<li>不支持IP证书的防窜，直接使用IP访问的勿开</li>\
												</ul>'
					);
				} else {
					bt.msg(res);
				}
			});
		},
		set_tsl: function () {
			bt_tools.send(
				{ url: 'site?action=get_ssl_protocol' },
				function (res) {
					var tslFrom = bt_tools.form({
						el: '#advance-con',
						class: 'mtb15',
						form: [
							{
								label: 'TLS设置',
								group: [
									{
										name: 'tsl_1',
										class: 'mr20',
										value: res['TLSv1'],
										type: 'checkbox',
										title: 'TLSv1',
									},
									{
										name: 'tsl_2',
										class: 'mr20',
										value: res['TLSv1.1'],
										type: 'checkbox',
										title: 'TLSv1.1',
									},
									{
										name: 'tsl_3',
										class: 'mr20',
										value: res['TLSv1.2'],
										type: 'checkbox',
										title: 'TLSv1.2',
									},
									{
										name: 'tsl_4',
										class: 'mr20',
										value: res['TLSv1.3'],
										type: 'checkbox',
										title: 'TLSv1.3',
									},
								],
							},
							{
								group: {
									type: 'button',
									class: 'ml20',
									name: 'submitForm',
									title: '保存',
									event: function (formData, element, that) {
										var dictionary = {
											tsl_1: 'TLSv1',
											tsl_2: 'TLSv1.1',
											tsl_3: 'TLSv1.2',
											tsl_4: 'TLSv1.3',
										};
										var data = '';
										for (let i = 0; i < Object.keys(formData).length; i++) {
											if (formData[Object.keys(formData)[i]]) {
												data += dictionary[Object.keys(formData)[i]] + ',';
											}
										}
										if (data == '') {
											bt.msg({ msg: '请至少选择一项', icon: 2 });
											return;
										}
										bt_tools.send(
											{
												url: 'site?action=set_ssl_protocol',
												data: { use_protocols: data.substring(0, data.length - 1) },
											},
											function (res) {
												bt.msg(res);
												site.advance_list.set_tsl();
											},
											'设置TLS'
										);
									},
								},
							},
						],
					});
					$('#advance-con .line:eq(0)').after(
						'<ul class="help-info-text c7 plr20">\
											 <li>请注意，TLS 1.0和1.1版本存在安全风险。如果您的应用程序不会出现兼容性问题，请不要勾选此选项。</li>\
											 <li>修改后只会对后续部署证书的站点进行设置，已部署证书的站点不会因此改变</li>\
											 <li>仅支持PHP项目</li>\
											 </ul>'
					);
				},
				'获取TLS设置'
			);
		},
		set_site_config: function () {
			bt_tools.send(
				{ url: 'site?action=create_default_conf' },
				function (res) {
					var siteFrom = bt_tools.form({
						el: '#advance-con',
						class: 'mtb15',
						form: [
							{
								label: '日志切割',
								group: {
									name: 'use_log_split',
									type: 'other',
									boxcontent:
										'<div style="display:flex;align-items:center;"><div style="height: 32px; padding-top: 6px;"><input class="btswitch btswitch-ios" id="use_log_split"' +
										(res['log_split'] ? ' checked ' : '') +
										' type="checkbox" name="log_split">\
								 <label class="btswitch-btn" for="use_log_split" style="margin-bottom: 0;"></label>\
								 </div><span class="c6 ml10" style="margin-top:4px">*提示：开启该选项将自动创建网站日志切割任务，当存在所有网站日志切割任务时不会新建</span></div>\
								',
								},
							},
							{
								label: '默认页面设置',
								group: [
									{
										name: 'page_index_split',
										type: 'other',
										boxcontent:
											'<div style="display:flex;align-items:center;"><div style="height: 32px; padding-top: 6px;"><input class="btswitch btswitch-ios" id="page_index_split"' +
											(res['page_index'] ? ' checked ' : '') +
											' type="checkbox" name="page_index">\
								 <label class="btswitch-btn" for="page_index_split" style="margin-bottom: 0;"></label>\
								</div><span class="ml10" style="margin-top:4px">自动生成index.html(默认首页)</span></div>\
								<div style="display:flex;align-items:center;"><div style="height: 32px; padding-top: 6px;"><input class="btswitch btswitch-ios" id="page_404_split"' +
											(res['page_404'] ? ' checked ' : '') +
											' type="checkbox" name="page_404">\
								 <label class="btswitch-btn" for="page_404_split" style="margin-bottom: 0;"></label>\
								</div><span class="ml10">自动生成404.html(默认404页面)</span></div>\
								',
									},
								],
							},
						],
					});
					$('#advance-con .line:eq(0)').after('<hr>');
					$('#advance-con .line:eq(1)').after(
						'<ul class="help-info-text c7 plr20">\
												 <li>请注意，仅对后续创建的PHP网站生效。</li>\
												 </ul>'
					);
					function set_form_val(formData) {
						bt_tools.send(
							{
								url: 'site?action=set_create_default_conf',
								data: formData,
							},
							function (res) {},'设置全局配置'
						);
					}
					$("input[name='log_split']").change(function () {
						set_form_val({ log_split: $(this).is(':checked'), page_index: $("input[name='page_index']").is(':checked'), page_404: $("input[name='page_404']").is(':checked') });
					});
					$("input[name='page_index']").change(function () {
						set_form_val({ page_index: $(this).is(':checked'), log_split: $("input[name='log_split']").is(':checked'), page_404: $("input[name='page_404']").is(':checked') });
					});
					$("input[name='page_404']").change(function () {
						set_form_val({ page_404: $(this).is(':checked'), page_index: $("input[name='page_index']").is(':checked'), log_split: $("input[name='log_split']").is(':checked') });
					});
				},
				'获取高级站点设置'
			);
		},
	},
	set_default_page: function () {
		bt.open({
			type: 1,
			area: '460px',
			title: lan.site.change_defalut_page,
			closeBtn: 2,
			shift: 0,
			content:
				'<div class="change-default pd20"><button  class="btn btn-default btn-sm ">' +
				lan.site.default_doc +
				'</button><button  class="btn btn-default btn-sm">' +
				lan.site.err_404 +
				'</button>	<button  class="btn btn-default btn-sm ">' +
				lan.site.empty_page +
				'</button><button  class="btn btn-default btn-sm ">' +
				lan.site.default_page_stop +
				'</button></div>',
			success: function () {
				$('.change-default button').click(function () {
					bt.site.get_default_path($(this).index(), function (path) {
						bt.pub.on_edit_file(0, path);
					});
				});
			},
		});
	},
	set_default_site: function () {
		bt.site.get_default_site(function (rdata) {
			var arrs = [];
			arrs.push({ title: '未设置默认站点', value: '0' });
			for (var i = 0; i < rdata.sites.length; i++) arrs.push({ title: rdata.sites[i].name, value: rdata.sites[i].name });
			var form = {
				title: lan.site.default_site_yes,
				area: '530px',
				list: [{ title: lan.site.default_site, name: 'defaultSite', width: '300px', value: rdata.defaultSite, type: 'select', items: arrs }],
				btns: [
					bt.form.btn.close(),
					bt.form.btn.submit('提交', function (rdata, load) {
						bt.site.set_default_site(rdata.defaultSite, function (rdata) {
							load.close();
							bt.msg(rdata);
						});
					}),
				],
			};
			bt.render_form(form);
			$('.line').after($(bt.render_help([lan.site.default_site_help_1, lan.site.default_site_help_2])).addClass('plr20'));
		});
	},
	//PHP-CLI
	get_cli_version: function () {
		$.post('/config?action=get_cli_php_version', {}, function (rdata) {
			if (rdata.status === false) {
				layer.msg(rdata.msg, { icon: 2 });
				return;
			}
			var _options = '';
			for (var i = rdata.versions.length - 1; i >= 0; i--) {
				var ed = '';
				if (rdata.select.version == rdata.versions[i].version) ed = 'selected';
				_options += '<option value="' + rdata.versions[i].version + '" ' + ed + '>' + rdata.versions[i].name + '</option>';
			}
			var body =
				'<div class="bt-form pd20 pb70">\
        <div class="line">\
          <span class="tname">PHP-CLI版本</span>\
          <div class="info-r ">\
            <select class="bt-input-text mr5" name="php_version" style="width:300px">' +
				_options +
				'</select>\
          </div>\
        </div >\
        <ul class="help-info-text c7 plr20">\
          <li>此处可设置命令行运行php时使用的PHP版本</li>\
          <li>安装新的PHP版本后此处需要重新设置</li>\
          <li>其它PHP版本在命令行可通过php+版本的方式运行，如：php74,php80</li>\
        </ul>\
        <div class="bt-form-submit-btn"><button type="button" class="btn btn-sm btn-danger" onclick="layer.closeAll()">关闭</button><button type="button" class="btn btn-sm btn-success" onclick="site.set_cli_version()">提交</button></div></div>';
			layer.open({
				type: 1,
				title: '设置PHP-CLI(命令行)版本',
				area: '560px',
				closeBtn: 2,
				shadeClose: false,
				content: body,
			});
		});
	},
	// // 旧获取漏洞扫描列表
	// get_scan_list: function (callback) {
	//   var that = this, obj = {};
	//   $.post('project/scanning/list', obj, function (res) {
	//     if (res.status !== false) {
	//       that.scan_list = []
	//       that.scan_num = 0
	//       that.scan_list = res
	//       for (var i = 0; i < res.info.length; i++) {
	//         if (res.info[i].cms.length > 0) {
	//           that.scan_num += res.info[i].cms.length
	//         }
	//       }
	//       that.is_pay = res.is_pay
	//       that.span_time = site.get_simplify_time(res.time);
	// 			if(!$('.pull-left button:eq(3) span.btn_num').length){
	// 				if(!$('.pull-left button:eq(3) .icon_title').length) {
	// 					setTimeout(function(){
	// 						$('#bt_site_table .pull-left button:eq(3)').append('<span class="btn_num" style="background:' + (that.scan_num > 0 ? 'red' : '#f0ad4e') + '">' + that.scan_num + '</span>')
	// 					},200)
	// 				}
	// 				$('#bt_site_table .pull-left button:eq(3)').append('<span class="btn_num" style="background:' + (that.scan_num > 0 ? 'red' : '#f0ad4e') + '">' + that.scan_num + '</span>')
	// 			}else{
	// 				$('#bt_site_table .pull-left button:eq(3) span.btn_num').css('background', that.scan_num > 0 ? 'red' : '#f0ad4e').html(that.scan_num);
	// 			}
	// 			if (callback) callback(res);
	//     }else{
	//       that.scan_list = res
	//     }
	//   })

	// },
	// 新获取漏洞扫描列表
	get_scan_list: function (callback) {
		var that = this,
			obj = {};
		var isLtd = Number(bt.get_cookie('ltd_end')) > -1;
		bt_tools.send(
			{ url: isLtd ? 'project/scanning/list' : '/site?action=list', data: obj },
			function (res) {
				if (!(typeof res === 'object' && res !== null)) return;
				if (res.status !== false) {
					that.scan_list = [];
					that.scan_num = 0;
					that.all_site = 0;
					that.scan_list = res;
					that.scanTime = bt.format_data(res.time);
					for (var i = 0; i < res.info.length; i++) {
						if (res.info[i].cms.length > 0) {
							that.scan_num += res.info[i].cms.length;
						}
					}
					that.scan_num = res.loophole_num;
					that.all_site = res.site_num;
					that.is_pay = res.is_pay;
					if (res.time == 0) {
						that.span_time = 0;
					} else {
						that.span_time = site.get_simplify_time(res.time);
					}
					if (!$('.pull-left button:eq(3) span.btn_num').length) {
						if (!$('.pull-left button:eq(3) .icon_title').length) {
							setTimeout(function () {
								$('#bt_site_table .pull-left button:eq(3)').append('<span class="btn_num" style="background:' + (that.scan_num > 0 ? 'red' : '#f0ad4e') + '">' + that.scan_num + '</span>');
							}, 200);
						}
						$('#bt_site_table .pull-left button:eq(3)').append('<span class="btn_num" style="background:' + (that.scan_num > 0 ? 'red' : '#f0ad4e') + '">' + that.scan_num + '</span>');
					} else {
						$('#bt_site_table .pull-left button:eq(3) span.btn_num')
							.css('background', that.scan_num > 0 ? 'red' : '#f0ad4e')
							.html(that.scan_num);
					}
					if (callback) callback(res);
				} else {
					that.scan_list = res;
				}
			},
			{ verify: false }
		);
	},
	/**
	 * @description 新渲染漏洞扫描视图
	 * @return 无返回值
	 */
	reader_scan_view: function () {
		var that = this;
		var isLtd = Number(bt.get_cookie('ltd_end')) > -1;
		var data = {};
		// if(bt.get_cookie('ltd_end') < 0){
		// 	var item = {
		// 		ps:'漏洞扫描是一种自动化的安全检测方式，可以自动扫描目标系统或应用程序中存在的安全漏洞，包括但不限于常见的操作系统漏洞、网络协议漏洞、Web应用程序漏洞等。',
		// 		pluginName:'网站漏洞扫描工具',
		// 		description:['识别多款开源CMS','扫描网站漏洞','提供解决方案','自动化检测'],
		// 		preview:false,
		// 		imgSrc:'https://www.bt.cn/Public/new/plugin/introduce/site/site_scanning.png'
		// 	}
		// 	bt.soft.product_pay_view({ totalNum: 50, limit: 'ltd', closePro: true,pluginName:item.pluginName,fun:function () {
		// 			product_recommend.recommend_product_view(item, {
		// 				imgArea: ['748px', '698px']
		// 			}, 'ltd', 50, 'ltd',true)
		// 		}})
		// 	return
		// }
		//降序
		function sortDesc(a, b) {
			return b.cms.length - a.cms.length;
		}
		function sortDanDesc(a, b) {
			return parseInt(b.dangerous) - parseInt(a.dangerous);
		}
		var thumbnail =
			'<div class="webedit-con">\
      <div class="thumbnail-box">\
        <div class="pluginTipsGg" style="background-image: url(/static/img/preview/site_scanning.png);">\
      </div>\
      </div>\
      <div class="thumbnail-introduce" style="margin-top: 0;">\
        <span>网站漏洞扫描工具介绍：</span>\
        <ul>\
        <li>\
          可识别多款开源CMS程序，支持如下：<br>\
          迅睿CMS、pbootcms、苹果CMS、eyoucms、<br>\
          海洋CMS、ThinkCMF、zfaka、dedecms、<br>\
          MetInfo、emlog、帝国CMS、discuz、<br>\
          Thinkphp、Wordpress、Z-Blog、极致CMS、<br>\
          ShopXO、HYBBS、ECShop、SchoolCMS、<br>\
          phpcms、likeshop、iCMS、WellCMS、<br>\
          chanzhiEPS、PHPOK、LaySNS\
        </li>\
        <li>可扫描网站中存在的漏洞</li>\
        <li>提供修复/提供付费解决方案</li>\
        </ul>\
      </div>\
    </div>';
		// 修复展示客服
		function showWechat(e) {
			var that = this;
			$('#wechat-customer').remove();
			$('.main-content').append(
				'<div id="wechat-customer" style="\
										z-index:99999999999;\
										position:absolute;\
										bottom: 50px;\
										width: 170px;\
										display: flex;\
										height: 228px;\
										flex-direction: column;\
										flex-wrap: nowrap;\
										align-items: center;\
										background-color: #fff;\
										box-shadow: 0 6px 8px rgba(0, 0, 0, 0.25);" class="wechat-customer">\
										<div style="\
										background: rgba(32, 165, 58, 0.1);\
										width: 100%;\
										height: 46px;\
										display: flex;\
										flex-direction: row;\
										align-items: center;\
										justify-content: center;">\
											<a href="https://www.bt.cn/new/wechat_customer" target="_blank" class="btlink" style="justify-content: center;font-size: 16px;width:100%;display: flex;flex-direction: row;flex-wrap: nowrap;align-items: center;"><span style="font-size:18px;border-bottom: 1px solid;line-height:18px;">点击咨询客服</span>\
												<div class="icon-r1" style="width: 15px;height: 18px;margin-top: 1px;margin-left: 5px;"></div>\
											</a>\
										</div>\
										<div class="qrcode-wechat" style="width: 128px;height: 128px;margin: 8px 0 4px 0">\
											<div id="wechatCustomerQrcode">\
												<img src="/static/images/customer-qrcode.png" style="width: 128px;height: 128px;" alt="">\
											</div>\
										</div>\
										<div class="wechat-title" style="width: 103px;height: 26px;display: flex;justify-content: center;align-items: center;">\
											<img class="icon" style="width: 17px;height: 17px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAATlJREFUSEvtVrFOw0AMfed8AxJsZWGAgQHBXP4DCQa+Ioou7g18BRIg9T/KDGJggIGFbiDxDXGQowSBuGvrFISEmtF+7/nis312RVEMiWgIoMT375aIjpj5KeJrTMy8JSJjAPsRzEhErl1Zlhd1XZ8kRKZEdMjM0xlBBiIyATCIYZxzl857X6uTiHaY+TElZrUz87aIPCjvI0gIwVmF5uG7H1gFmZepxv85XTdqCCEcLMQ0gLz3jbbTOm/rPdkLBt0v0E77xysq2it9T2nhuTzPN4ho10KyYEXkXvvkBcC6hWjEvmqQMwCnANZa8p1RJAbfa41vAM7/0cUzczOiZ43zvunrtPVOntuO3+wrluJ12qspvFBm/+bR+u03nhPrkKZk2ZVINUZO964sy44Ta9FSK5GuQ1VVXb0DLf+sHQ9tLL0AAAAASUVORK5CYII=">\
											<span class="scan-title" style="font-size: 16px;margin-left: 8px">扫一扫</span>\
										</div>\
									</div>'
			);
			var cust = $('#wechat-customer');
			cust.css({ top: $(e.target).offset().top - 103 + 'px', left: $(e.target).offset().left - 180 + 'px' });
			cust.off('click').on('click', function (ev) {
				ev.stopPropagation();
			});
			setTimeout(function () {
				$(document).one('click', function () {
					$('.main-content #wechat-customer').remove();
				});
			}, 200);
		}
		function reader_scan_list(res) {
			var data = {
				info: res.info.sort(sortDesc),
				time: res.time,
				is_pay: res.is_pay,
			};
			that.span_time = site.get_simplify_time(data.time);
			var html = '',
				scan_time = '',
				arry = [],
				level = [
					['低危', '#e8d544'],
					['中危', '#E6A23C'],
					['高危', '#ff5722'],
					['严重', 'red'],
				];
			// if (!data.is_pay) {
			// 	html += thumbnail;
			// } else {
			if (!isLtd) {
				if (that.scan_num > 0) {
					$('.warning_scan_body').html(thumbnail);
					return;
				}
			}
			$('.scanning1 .warn_look').removeClass('topBtn');
			$('.warn_repair_scan').show();
			if (data.info.length > 0) {
				html += '<div style="display:flex;color:#333;align-items:center;font-size:14px;margin-bottom:15px;"><div style="margin-left:10px;">网站</div><div style="margin-left:193px;">类型</div></div>';
				for (var i = 0; i < data.info.length; i++) {
					arry[i] = data.info[i].name;
				}
				bt.each(arry, function (index, item) {
					var data_item = [],
						n = 0,
						infoName = [],
						arr;
					var re = /(http[s]?:\/\/([\w-]+.)+([:\d+])?(\/[\w-\.\/\?%&=]*)?)/gi;
					var info = data.info[index];
					if (info.cms.length > 0) {
						arr = info.cms.sort(sortDanDesc);
						for (var i = 0; i < arr.length; i++) {
							data_item[i] = arr[i].name;
						}
						for (var i = 0; i < data.info.length; i++) {
							if (data.info[i].cms.length > 0) {
								infoName[n++] = data.info[i].name;
							}
						}
						var color = 'color:white;background:#e8d544;';
						$.each(arr, function (index, itemss) {
							if (itemss.dangerous > 1) {
								color = 'color:white;background:#E6A23C;';
								if (itemss.dangerous > 2) {
									color = 'color:white;background:red;';
								}
							}
						});
						html +=
							'<li class="module_item" style="background:#f8f8f8;">' +
							'<div class="module_head" style="display:flex;align-items:center;padding-left:0;overflow: inherit;' +
							(item === infoName[0] && info.cms.length > 0 ? 'border-bottom: 1px solid rgb(232, 232, 232);' : '') +
							'">' +
							'<div class="module_title" style="display:flex;align-items:center;" title="' +
							item +
							'"><span class="alarmTip" style="' +
							color +
							'">' +
							info.cms.length +
							'项</span>' +
							item +
							'</div>' +
							'<div class="module_num"><span style="color:#555;" title="' +
							info.cms_name +
							'">' +
							info.cms_name +
							'(' +
							info.version_info +
							')' +
							'</span></div>' +
							'<div class="module_type" style="max-width:230px;overflow: inherit" title="' +
							info.cms_name +
							'（' +
							info.version_info +
							'）">' +
							'<span style="position:relative">无法自动修复，请手动处理或<span style="color:#20a53a" class="listen">联系人工</span>' +
							'</span>' +
							'</div>' +
							'<span class="module_cut_show" style="margin-left: 40px; width:58px;">' +
							(item === infoName[0] && info.cms.length > 0
								? '<i style="color: #555;">收起</i><span style="color: #555;" class="glyphicon glyphicon-menu-up" aria-hidden="false"></span>'
								: '<i style="color: #555;">展开</i><span style="color: #555;" class="glyphicon glyphicon-menu-down" aria-hidden="false"></span>') +
							'</span>' +
							'</div>';
						html += '<ul  class="module_details_list ' + (item === infoName[0] && info.cms.length > 0 ? 'active' : '') + '">';
						bt.each(data_item, function (indexs, items) {
							var cms = arr[indexs];
							html +=
								'<li class="module_details_item" style="background:#f8f8f8;list-style-type: none;">\
									<div class="module_details_head cursor" style="padding-left:0;">' +
								'<span class="module_details_title" style="display: flex;align-items: center;">' +
								(function (level) {
									var level_html = '';
									switch (level) {
										case 4:
											level_html += '<span class="alarmTip" style="display:flex;color:red;background:rgba(239,8,8,.08);">严重</span>';
											break;
										case 3:
											level_html += '<span class="alarmTip" style="display:flex;color:red;background:rgba(239,8,8,.08);">高危</span>';
											break;
										case 2:
											level_html += '<span class="alarmTip" style="display:flex;color:#E6A23C;background:rgba(230, 162, 60,.14);">中危</span>';
											break;
										case 1:
											level_html += '<span class="alarmTip" style="display:flex;color:#e8d544;background:rgba(212, 187, 0,.14);">低危</span>';
											break;
									}
									return level_html;
								})(parseInt(cms.dangerous)) +
								'<span title="' +
								items +
								'">' +
								items +
								'</span>\
                  </span>' +
								'<span class="operate_tools">\
                      <a href="javascript:;" class="btlink cut_details">详情</a>\
                  </span>' +
								'</div>' +
								(cms['repair']
									? '<div class="module_details_body">' +
									  '<div class="module_details_line">\
                      <div class="line_title">修复建议：</div>\
                      <div class="line_content" style="width: 460px;">' +
									  cms.repair
											.replace(re, function (a) {
												return '<a href="' + a + '" class="btlink" rel="noreferrer noopener" target="_blank">' + a + '</a>';
											})
											.replace(/(\r\n)|(\n)/g, '<br>') +
									  '</div>\
                    </div>'
									: '<div class="module_details_body"><div class="module_details_line">此功能为企业版专享功能，如需查看请<a class="btlink no_pay_scan">立即购买</a></div></div>') +
								'</div>' +
								'</li>';
						});
						html += '</ul>';
						html += '</li>';
					}
				});
			} else {
				$('.warn_repair_scan').hide();
				$('.warn_look').css({ marginRight: '0px', right: '17px' });
				$('.scanning1 .warning_cancel_scan').hide();
				$('.scanning1 .warn_look').addClass('topBtn');
				$('.scanning1 .btlink').addClass('hide');
				html +=
					'<li class="safe_state">\
					<img src="/static/img/secure.png" style="width:340px;height:301px;"/>\
					<div class="safe_title">当前处于【<span style="color:#333;">安全状态</span>】，请继续保持！</div>\
					</li>';
				// html += '<li class="safe_state">当前处于安全状态，请继续保持！</li>';
			}
			scan_time = Date.now() / 1000;
			$('.scanning1 .warning_scan_describe .warn_scan_subtitle').html('扫描时间：&nbsp;' + bt.format_data(scan_time));
			// }
			$('.warning_scan_body').html(html);
			$('.listen').click(function (e) {
				e.stopPropagation();
				showWechat(e);
				// var cust = $(this).siblings('#wechat-customer')
				// 		cust.removeClass('hide')
				// 		cust.off('click').on('click',function(e){
				// 			e.stopPropagation()
				// 		})
				// 		setTimeout(function(){
				// 		$(document).one('click',function(){
				// 			cust.addClass('hide')
				// 		})
				// 		},200)
			});
		}
		var pay =
			'<span class="ml5 buy">\
        <span class="wechatEnterpriseService"></span>\
        <span class="btlink service_buy2">付费修复</span>\
      </span>';
		// (!that.is_pay || that.scan_list['status'] === false
		// 		? '<div class="scanNone">\
		//       <img src="' +
		// 		  (that.scan_num > 0 ? '/static/img/scanning-danger.svg' : '/static/img/scanning-success.svg') +
		// 		  '" style="height: 75px;width: 75px;">\
		//       <div class="warning_scan_ps1">\
		//         <div style="font-size: 20px;color:' +
		// 		  (that.scan_list['status'] === false ? '#333' : that.scan_num > 0 ? 'red' : '#20a53a') +
		// 		  ';">\
		//           ' +
		// 		  (that.scan_list['status'] === false
		// 				? '此功能为企业版专享功能'
		// 				: (that.scan_num > 0 ? ' 漏洞数为' + that.scan_num + '个,请尽快修复漏洞' : ' 未扫描到漏洞，请持续保持哦') +
		// 				  ' <i style="font-style:normal;font-size:16px;"> 扫描时间：' +
		// 				  bt.format_data(Date.now() / 1000, 'yyyy/MM/dd')) +
		// 		  '</i></div>\
		//         <div class="warning_scan_time">' +
		// 		  (that.scan_list['status'] === false ? '如需使用该功能请立即查看' : '未开通，此功能为企业版专享功能') +
		// 		  '</div>\
		//       </div>\
		//       <button class="warn_again_scan" style="top: 65px;right: 50px;border-radius: 5px;" onclick="product_recommend.pay_product_sign(\'ltd\',50,\'ltd\')"">立即查看</button>' +
		// 		  '</div>'
		// 		:
		var default_header_view =
			'<div class="warning_scan_title">\
			<div>全部【' +
			that.all_site +
			'个】网站存在风险项<i style="color:' +
			(that.scan_num > 0 ? 'red' : '#444') +
			';">' +
			that.scan_num +
			'</i>个</div>\
				距上次扫描已有 <i>' +
			that.span_time +
			'</i>\
			</div>\
			<div class="warn_scan_subtitle" style="font-size:14px;">\
				扫描时间：' +
			that.scanTime +
			'\
			</div>';
		var nothing_header_view =
			'<div class="warning_scan_title">\
			<div>立即进行漏洞扫描,确保您的网站安全。</div>\
			<div style="font-size:16px;margin-top:10px;">您还未进行漏洞扫描!</div>\
			</div>\
			<div class="warn_scan_subtitle"></div>';
		bt.open({
			type: '1',
			title: '漏洞扫描',
			area: ['750px', '717px'],
			skin: 'warning_scan_view',
			content:
				'<div class="warning_scan_view" style="height:100%;">' +
				'<div class="warning_scan_head">' +
				'<div class="scanNone scanning1">\
      <div class="safaty_load"></div>\
							<img class="scanImg" src="/static/img/scanning-success.svg" />\
      <div class="warning_scan_describe">' +
				(that.span_time == 0 ? nothing_header_view : default_header_view) +
				'</div>\
            <div style="position:relative;float:right;width:170px;">' +
				'<button class="warn_again_scan" style="transition:all 0s ease 0s;">立即扫描</button><button class="warn_look hide" style="margin-right:10px;">重新检测</button>' +
				'<a class="btlink setScanAlarm" style="position:absolute;top:64px;left:64px;" href="javascript:;">自动扫描>></a>\
							</div>' +
				'</div>' +
				'<div class="halving_line"></div>\
          </div>' +
				'<ol class="warning_scan_body" style="overflow: auto;">' +
				thumbnail +
				'</ol>' +
				'<ul class="c7 help_info_text" style="bottom:14px;">' +
				'<li>如需支持其他cms程序，请发帖反馈：<a class="btlink" target="_blank" href="https://www.bt.cn/bbs/thread-89149-1-1.html">https://www.bt.cn/bbs/thread-89149-1-1.html</a></li>' +
				'</ul>' +
				'</div>',
			success: function (layero) {
				// if (site.scan_list.info && site.scan_list.info.length > 0)
				// 	setTimeout(function () {
				// 		$('.warn_again_scan').click();
				// 	}, 50);
				$(layero).find('.layui-layer-content').css({ overflow: 'inherit' });
				$(layero)
					.find('.service_buy2')
					.click(function () {
						bt.onlineService();
					});
				$('.warning_scan_body').on('click', '.thumbnail-box', function () {
					layer.open({
						title: false,
						btn: false,
						shadeClose: true,
						closeBtn: 1,
						area: ['700px', '700px'],
						content: '<img src="/static/img/preview/site_scanning.png" style="width:700px"/>',
						success: function (layero) {
							$(layero).find('.layui-layer-content').css('padding', '0');
						},
					});
				});
				$('.warn_close_scan').click(function () {
					layer.closeAll();
				});
				$('.warn_again_scan').click(function (e) {
					if ($(this).hasClass('warning_cancel_scan')) {
						$('.scanning1 .warning_cancel_scan').html('立即扫描').addClass('warn_again_scan').removeClass('warning_cancel_scan');
						$('.scanning1 .scanImg').attr('src', '/static/img/scanning-success.svg');
						$('.scanning1 .scanImg').css({ height: '85px', width: '85px' });
						$('.safaty_load').css('display', 'none');
						$('.scanning1 .warning_scan_describe .warning_scan_title').html(
							'<div>全部【' + that.all_site + '个】网站存在风险项<i style="color:red;">' + that.scan_num + '</i>个</div>距上次扫描已有 <i>' + that.span_time + '</i>'
						);
						$('.scanning1 .scanImg').css({ marginBottom: '0px' });
						$('.scanning1 .warning_scan_describe .warn_scan_subtitle').html('扫描时间：' + that.scanTime);
						$('.warning_scan_head .scanNone').removeClass('active');
						$('.warning_scan_body').html(thumbnail);
					} else if ($(this).hasClass('warn_repair_scan')) {
						// site.repair_scheme();
						// var cust = $('.scanning1 #wechat-customer')
						// cust.removeClass('hide')
						// cust.off('click').on('click',function(e){
						// 	e.stopPropagation()
						// })
						// setTimeout(function(){
						// $(document).one('click',function(){
						// 	cust.addClass('hide')
						// })
						// },200)
						showWechat(e);
					} else if ($(this).hasClass('warn_look_scan')) {
						product_recommend.pay_product_sign('ltd', 50, 'ltd');
					} else {
						$('.scanning1 .btlink').addClass('hide');
						$('.scanning1 .warn_again_scan').show();
						$('.scanning1 .warn_again_scan').html('取消扫描').addClass('warning_cancel_scan').removeClass('warn_again_scan').removeClass('topBtn');
						$('.scanning1 .scanImg').attr('src', '/static/img/scanning-scan.svg').css({ height: '60px', width: '60px' });
						$('.safaty_load').css('display', 'block');
						$('.scanning1 .warning_scan_describe .warning_scan_title').html('正在扫描网站漏洞，请稍后...');
						$('.scanning1 .scanImg').css({ marginBottom: '25px' });
						$('.scanning1 .warning_scan_describe .warn_scan_subtitle').html('检测程序类型，是否支持');
						$('.warning_scan_head .scanNone').addClass('active');
						$('.warning_scan_body').html('');
						bt_tools.send(
							{ url: isLtd ? 'project/scanning/startScan' : '/site?action=get_Scan' },
							function (res) {
								that.scan_num = 0;
								that.scan_list = res;
								that.is_pay = res.is_pay;
								// for (var i = 0; i < res.info.length; i++) {
								// 	if (res.info[i].cms.length > 0) {
								// 		that.scan_num += res.info[i].cms.length;
								// 	}
								// }
								that.scanTime = bt.format_data(res.time);
								that.scan_num = res.loophole_num;
								that.all_site = res.site_num;
								that.is_pay = res.is_pay;
								if (res.time == 0) {
									that.span_time = 0;
								} else {
									that.span_time = site.get_simplify_time(res.time);
								}
								if (!isLtd) {
									$('.scanning1 .warning_scan_describe .warn_scan_subtitle').html('扫描时间：' + that.scanTime);
								}
								if (!$('.pull-left button:eq(3) span.btn_num').length) {
									$('#bt_site_table .pull-left button:eq(3)').append('<span class="btn_num" style="background:' + (that.scan_num > 0 ? 'red' : '#f0ad4e') + '">' + that.scan_num + '</span>');
								} else {
									$('#bt_site_table .pull-left button:eq(3) span.btn_num')
										.css('background', that.scan_num > 0 ? 'red' : '#f0ad4e')
										.html(that.scan_num);
								}
								if (that.scan_num > 0) {
									$('.scanning1 .scanImg').attr('src', '/static/img/scanning-danger.svg').css({ height: '60px', width: '60px' });
									$('.safaty_load').css('display', 'none');
									$('.scanning1 .warning_scan_describe .warning_scan_title').html('全部【' + that.all_site + '个】网站存在风险项<i style="color:red;">' + that.scan_num + '</i>个，请立即处理');
									$('.scanning1 .scanImg').css({ marginBottom: '25px' });
									$('.scanning1 .btlink').removeClass('hide');
									if (!isLtd) {
										$('.scanning1 .warning_cancel_scan').html('立即查看').addClass('warn_look_scan').removeClass('warning_cancel_scan');
									} else {
										$('.scanning1 .warning_cancel_scan').html('立即处理').addClass('warn_repair_scan').removeClass('warning_cancel_scan');
									}
								} else {
									$('.scanning1 .scanImg').attr('src', '/static/img/scanning-success.svg');
									$('.scanning1 .scanImg').css({ height: '60px', width: '60px' });
									$('.safaty_load').css('display', 'none');
									$('.scanning1 .warning_scan_describe .warning_scan_title').html('当前网站没有风险项');
									$('.scanning1 .scanImg').css({ marginBottom: '25px' });
								}
								// $('.scanning1 .warning_cancel_scan').html('立即处理').addClass('warn_repair_scan').removeClass('warning_cancel_scan');
								$('.warning_scan_head .scanNone').addClass('active');
								$('.warn_look').removeClass('hide');
								reader_scan_list(that.scan_list);
							},
							{ verify: false }
						);
					}
				});
				$('.warn_look').click(function () {
					if (!isLtd) {
						$('.warn_look_scan').addClass('warn_again_scan').removeClass('warn_look_scan');
						$('.warning_cancel_scan').addClass('warn_again_scan').removeClass('warning_cancel_scan');
					} else {
						$('.warn_repair_scan').addClass('warn_again_scan').removeClass('warn_repair_scan');
						$('.warning_cancel_scan').addClass('warn_again_scan').removeClass('warning_cancel_scan');
					}
					$('.warn_again_scan').click();
					$('.warn_look').addClass('hide');
				});
				$('.warning_scan_body').on('click', '.module_item .module_head', function () {
					var _parent = $(this).parent(),
						_parent_index = _parent.index(),
						_list = $(this).next();
					if ($(this).find('.module_num span').text() != '') {
						if (_list.hasClass('active')) {
							_list.css('height', 0);
							$(this).find('.module_cut_show i').text('展开').next().removeClass('glyphicon-menu-up').addClass('glyphicon-menu-down');
							_list.removeClass('active').removeAttr('style');
							$(this).css('border-bottom', 'none');
						} else {
							$(this)
								.parent()
								.parent()
								.scrollTop(_parent_index * 45);
							$(this).find('.module_cut_show i').text('收起').next().removeClass('glyphicon-menu-down').addClass('glyphicon-menu-up');
							_list.addClass('active');
							var details_list = _list.parent().siblings().find('.module_details_list');
							details_list.removeClass('active');
							details_list.prev().find('.module_cut_show i').text('展开').next().removeClass('glyphicon-menu-up').addClass('glyphicon-menu-down');
							details_list.prev().css('border-bottom', 'none');
							$(this).css('border-bottom', '1px solid rgb(232, 232, 232)');
						}
					}
				});
				$('.warning_scan_body').on('click', '.module_details_head', function () {
					if ($(this).children().eq(1).children('.cut_details').hasClass('active')) {
						$(this).siblings().hide();
						$(this).children().eq(1).children('.cut_details').removeClass('active').text('详情');
						$(this).parents('.module_details_item').css({ background: 'transparent' });
					} else {
						var item = $(this).parents('.module_details_item'),
							indexs = item.index();
						$(this).children().eq(1).children('.cut_details').addClass('active').text('收起');
						// item.css({ background: '#f8fffd' });
						item.siblings().find('.module_details_body').hide();
						item.siblings().find('.operate_tools a').removeClass('active').text('详情');
						$(this).siblings().show();
						$('.module_details_list').scrollTop(indexs * 41);
					}
				});
				$('.warning_scan_body').on('click', '.no_pay_scan', function () {
					var item = {
						ps: '漏洞扫描是一种自动化的安全检测方式，可以自动扫描目标系统或应用程序中存在的安全漏洞，包括但不限于常见的操作系统漏洞、网络协议漏洞、Web应用程序漏洞等。',
						pluginName: '网站漏洞扫描工具',
						description: ['识别多款开源CMS', '扫描网站漏洞', '提供解决方案', '自动化检测'],
						preview: false,
						imgSrc: 'https://www.bt.cn/Public/new/plugin/introduce/site/site_scanning.png',
					};
					bt.soft.product_pay_view({
						totalNum: 50,
						limit: 'ltd',
						closePro: true,
						pluginName: item.pluginName,
						fun: function () {
							product_recommend.recommend_product_view(
								item,
								{
									imgArea: ['748px', '698px'],
								},
								'ltd',
								50,
								'ltd',
								true
							);
						},
					});
				});
				// $('.warning_scan_body').on('click', '.operate_tools a', function () {
				// 	var index = $(this).index(),
				// 		data = $(this).data();
				// 	var obj = JSON.stringify({ name: data.name });
				// 	if (index == 2) return;
				// 	if ($(this).text() == '扫描中') return;
				// 	$(this).text('扫描中')
				// 	$(this).css({color:'#333'})
				// 	$(this).siblings('img').removeClass('hide')
				// 	// var loadT = layer.msg('正在检测指定模块，请稍候...', { icon: 16, time: 0 });
				// 	bt_tools.send({url: 'project/scanning/startAweb',data: { data: obj }}, function (res) {
				// 		that.scan_num = 0;
				// 		that.scan_list = res;
				// 		for (var i = 0; i < res.info.length; i++) {
				// 			if (res.info[i].cms.length > 0) {
				// 				that.scan_num += res.info[i].cms.length;
				// 			}
				// 		}
				// 		if (!$('.pull-left button:eq(3) span.btn_num').length) {
				// 			$('#bt_site_table .pull-left button:eq(3)').append('<span class="btn_num" style="background:' + (that.scan_num > 0 ? 'red' : '#f0ad4e') + '">' + that.scan_num + '</span>');
				// 		} else {
				// 			$('#bt_site_table .pull-left button:eq(3) span.btn_num')
				// 				.css('background', that.scan_num > 0 ? 'red' : '#f0ad4e')
				// 				.html(that.scan_num);
				// 		}
				// 		layer.msg('检测成功', { icon: 1 });
				// 		reader_scan_list(that.scan_list);
				// 	},{verify: false});
				// 	return false;
				// });
				$('.setScanAlarm')
					.off('click')
					.on('click', function () {
						bt.site.get_msg_configs(function (res_rdata) {
							bt_tools.send(
								{ url: '/site?action=get_cron_scanin_info' },
								function (ress) {
									//请求回调
									bt_tools.open({
										title: '设置自动扫描',
										area: '560px',
										btn: ['确定', '取消'],
										content: {
											class: 'pd20 public-form',
											formLabelWidth: '120px',
											form: [
												{
													label: '自动扫描',
													group: {
														name: 'checkbox',
														type: 'other',
														boxcontent:
															'<input class="btswitch btswitch-ios" id="autoScan" type="checkbox"><label style="margin-left:6px;margin-right:6px;margin-top:5px;" class="btswitch-btn phpmyadmin-btn" for="autoScan" ></label>',
													},
												},
												{
													label: '周期',
													group: [
														{
															name: 'cycle',
															type: 'number',
															class: 'group',
															width: '116px',
															min: 1,
															max: 60,
															unit: '天',
															value: ress.cycle,
														},
													],
												},
												{
													label: '告警方式',
													group: [
														{
															type: 'other',
															boxcontent: '<div class="installPush"></div>',
														},
													],
												},
												{
													group: [
														{
															type: 'help',
															style: 'margin-top: 0;margin-left: -100px;',
															list: ['点击配置后状态未更新，尝试点击【 <a class="handRefresh btlink">手动刷新</a> 】'],
														},
													],
												},
											],
										},
										success: function (layero) {
											var data = {};
											if (ress.channel != '') {
												data = { channel: ress.channel.split(',') };
											}
											$(layero).find('.layui-layer-content').css('overflow', 'inherit');
											$('#autoScan').prop('checked', ress.status == 0 ? false : true);
											renderAlarmMothod();

											// 手动刷新
											$('.handRefresh').click(function () {
												renderAlarmMothod(true);
											});

											// 渲染告警方式
											function renderAlarmMothod(refresh) {
												if (refresh) {
													bt.site.get_msg_configs(function (rdata) {
														pubConfig(rdata);
													});
												} else {
													pubConfig(res_rdata);
												}
											}
											function pubConfig(rdata) {
												var html = '',
													unInstall = '';
												for (var key in rdata) {
													var item = rdata[key],
														_html = '',
														accountConfigStatus = false;
													// if (key == 'sms') continue;
													if (key === 'wx_account') {
														if (!$.isEmptyObject(item.data) && item.data.res.is_subscribe && item.data.res.is_bound) {
															accountConfigStatus = true; //安装微信公众号模块且绑定
														}
													}
													_html =
														'<div class="inlineBlock module-check ' +
														(!item.setup || $.isEmptyObject(item.data) ? 'check_disabled' : key == 'wx_account' && !accountConfigStatus ? 'check_disabled' : '') +
														'">' +
														'<div class="cursor-pointer form-checkbox-label mr10">' +
														'<i class="form-checkbox cust—checkbox cursor-pointer mr5 ' +
														(!$.isEmptyObject(data) && data.channel && data.channel.indexOf(item.name) > -1
															? !item.setup || $.isEmptyObject(item.data)
																? ''
																: key == 'wx_account' && !accountConfigStatus
																? ''
																: 'active'
															: '') +
														'" data-type="' +
														item.name +
														'"></i>' +
														'<input type="checkbox" class="form—checkbox-input hide mr10" name="' +
														item.name +
														'" ' +
														(item.setup || !$.isEmptyObject(item.data) ? (key == 'wx_account' && !accountConfigStatus ? '' : 'checked') : '') +
														'/>' +
														'<span class="vertical_middle" title="' +
														item.ps +
														'">' +
														item.title +
														(!item.setup || $.isEmptyObject(item.data)
															? '[<a target="_blank" class="bterror installNotice" data-type="' + item.name + '">未配置</a>]'
															: key == 'wx_account' && !accountConfigStatus
															? '[<a target="_blank" class="bterror installNotice" data-type="' + item.name + '">未配置</a>]'
															: '') +
														'</span>' +
														'</div>' +
														'</div>';
													if (!item.setup || $.isEmptyObject(item.data)) {
														unInstall += _html;
													} else {
														html += _html;
													}
												}
												$('.installPush').html(html + unInstall);
												if (!$('.installPush .active').length && html != '' && !data) {
													$('.installPush .module-check:eq(0) input').prop('checked', true).prev().addClass('active');
												}
												// 安装消息通道
												$('.installPush .form-checkbox-label')
													.off('click')
													.on('click', function () {
														var that = $(this).find('i');
														if (!that.parent().parent().hasClass('check_disabled')) {
															if (that.hasClass('active')) {
																that.removeClass('active');
																that.next().prop('checked', false);
															} else {
																that.addClass('active');
																that.next().prop('checked', true);
															}
														}
													});

												$('.installPush .installNotice')
													.unbind('click')
													.on('click', function () {
														var type = $(this).data('type');
														openAlertModuleInstallView(type);
													});
											}
										},
										yes: function (form, indexs) {
											var arry = [];
											$('.installPush .active').each(function (item) {
												var item = $(this).attr('data-type');
												arry.push(item);
											});
											if (!arry.length && $('#autoScan').prop('checked')) return layer.msg('请选择至少一种告警通知方式', { icon: 2 });
											if (form.cycle < 1) {
												return layer.msg('请输入正确的周期', { icon: 2 });
											}
											var param = {
												channel: arry.join(','),
												day: form.cycle ? parseInt(form.cycle) : '',
												status: $('#autoScan').prop('checked') ? 1 : 0,
											};

											bt_tools.send(
												{ url: '/site?action=set_cron_scanin_info', data: param },
												function (res_create) {
													bt_tools.msg(res_create);
													if (res_create.status) layer.close(indexs);
												},
												'设置自动扫描'
											);
										},
									});
								},
								'获取自动扫描设置'
							);
						});
					});
				//reader_scan_list(that.scan_list);
			},
		});
	},
	// /**
	//  * @description 旧渲染漏洞扫描视图
	//  * @return 无返回值
	//  */
	// reader_scan_view: function () {
	//   var that = this;
	// 	if(bt.get_cookie('ltd_end') < 0){
	// 		var item = {
	// 			ps:'漏洞扫描是一种自动化的安全检测方式，可以自动扫描目标系统或应用程序中存在的安全漏洞，包括但不限于常见的操作系统漏洞、网络协议漏洞、Web应用程序漏洞等。',
	// 			pluginName:'网站漏洞扫描工具',
	// 			description:['识别多款开源CMS','扫描网站漏洞','提供解决方案','自动化检测'],
	// 			preview:false,
	// 			imgSrc:'https://www.bt.cn/Public/new/plugin/introduce/site/site_scanning.png'
	// 		}
	// 		product_recommend.recommend_product_view(item, {
	// 			imgArea: ['748px', '698px']
	// 		},'ltd',50,'ltd')
	// 		return
	// 	}
	//   //降序
	//   function sortDesc(a,b){
	//     return b.cms.length - a.cms.length
	//   }
	//   function sortDanDesc(a,b){
	//     return parseInt(b.dangerous) - parseInt(a.dangerous)
	//   }
	//   var thumbnail = '<div class="webedit-con">\
	//     <div class="thumbnail-box">\
	//       <div class="pluginTipsGg" style="background-image: url(/static/img/preview/site_scanning.png);">\
	//     </div>\
	//     </div>\
	//     <div class="thumbnail-introduce" style="margin-top: 0;">\
	//       <span>网站漏洞扫描工具介绍：</span>\
	//       <ul>\
	//       <li>\
	//         可识别多款开源CMS程序，支持如下：<br>\
	//         迅睿CMS、pbootcms、苹果CMS、eyoucms、<br>\
	//         海洋CMS、ThinkCMF、zfaka、dedecms、<br>\
	//         MetInfo、emlog、帝国CMS、discuz、<br>\
	//         Thinkphp、Wordpress、Z-Blog、极致CMS、<br>\
	//         ShopXO、HYBBS、ECShop、SchoolCMS、<br>\
	//         phpcms、likeshop、iCMS、WellCMS、<br>\
	//         chanzhiEPS、PHPOK、LaySNS\
	//       </li>\
	//       <li>可扫描网站中存在的漏洞</li>\
	//       <li>提供修复/提供付费解决方案</li>\
	//       </ul>\
	//     </div>\
	//   </div>'
	//   function reader_scan_list (res) {
	//     var data = {
	//       info : res.info.sort(sortDesc),
	//       time : res.time,
	//       is_pay: res.is_pay
	//     }
	//     that.span_time = site.get_simplify_time(data.time)
	//     var html = '', scan_time = '', arry = [], level = [['低危', '#e8d544'], ['中危', '#E6A23C'], ['高危', '#ff5722'], ['严重', 'red']]
	//     if (!data.is_pay) {
	//       html += thumbnail
	//     }else{
	//       if (data.info.length > 0) {
	//         for(var i = 0;i < data.info.length; i++){
	//           arry[i] = data.info[i].name
	//         }
	//         bt.each(arry, function (index, item) {
	//           var data_item = [], n = 0 , infoName = [],arr
	//           var re=/(http[s]?:\/\/([\w-]+.)+([:\d+])?(\/[\w-\.\/\?%&=]*)?)/gi;
	//           var info = data.info[index]
	//           if (info.cms.length >0) {
	//             arr = info.cms.sort(sortDanDesc)
	//             for (var i = 0; i < arr.length; i++) {
	//               data_item[i] = arr[i].name
	//             }
	//             for (var i = 0; i < data.info.length; i++) {
	//               if (data.info[i].cms.length >0) {
	//                 infoName[n++] = data.info[i].name
	//               }
	//             }
	//             html += '<li class="module_item">' +
	//                 '<div class="module_head" style="background: transparent;' + (item === infoName[0] && info.cms.length > 0 ? 'border-bottom: 1px solid rgb(232, 232, 232);':'') +'">' +
	//                 '<div class="module_title" title="'+ item +'">网站：' + item + '</div>' +
	//                 '<div class="module_num">风险项：<span title="'+ info.cms.length +'">' + info.cms.length + '</span></div>' +
	//                 '<div class="module_type" title="'+ info.cms_name + '（'+ info.version_info +'）">类型：' + info.cms_name + '（'+ info.version_info +'）</div>' +
	//                 '<span class="module_cut_show">' + (item === infoName[0] && info.cms.length > 0 ? '<i style="color: #555;">收起</i><span style="color: #555;" class="glyphicon glyphicon-menu-up" aria-hidden="false"></span>' : '<i style="color: #555;">展开</i><span style="color: #555;" class="glyphicon glyphicon-menu-down" aria-hidden="false"></span>') + '</span>' +
	//                 '</div>'
	//             html += '<ul class="module_details_list ' + (item === infoName[0] && info.cms.length > 0 ? 'active' : '') + '">'
	//             bt.each(data_item, function (indexs, items) {
	//               var cms = arr[indexs]
	//               html += '<li class="module_details_item">' +
	//                   '<div class="module_details_head cursor">' +
	//                   '<span class="module_details_title">\
	//                     <span title="' + items + '">' + items + '</span>\
	//                   <i>（&nbsp;等级：' + (function (level) {
	//                     var level_html = '';
	//                     switch (level) {
	//                       case 4:
	//                         level_html += '<span style="color:red">严重</span>';
	//                         break;
	//                       case 3:
	//                         level_html += '<span style="color:#ff5722">高危</span>';
	//                         break;
	//                       case 2:
	//                         level_html += '<span style="color:#E6A23C">中危</span>';
	//                         break;
	//                       case 1:
	//                         level_html += '<span style="color:#e8d544">低危</span>';
	//                         break;
	//                     }
	//                     return level_html;
	//                   }(parseInt(cms.dangerous))) + '）</i>\
	//                 </span>' +
	//                   '<span class="operate_tools">\
	//                     <a href="javascript:;" class="btlink" data-name="' + info.name + '" ">检测</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:;" class="btlink cut_details">详情</a>\
	//                 </span>'+
	//                   '</div>' +
	//                   '<div class="module_details_body">' +
	//                   '<div class="module_details_line">\
	//                     <div class="line_title">修复建议：</div>\
	//                     <div class="line_content" style="width: 460px;">' + cms.repair.replace(re,function(a){ return '<a href="'+ a +'" class="btlink" rel="noreferrer noopener" target="_blank">'+ a +'</a>'; }).replace(/(\r\n)|(\n)/g,'<br>') + '</div>\
	//                   </div>' +
	//                   '</div>' +
	//                   '</li>';
	//             })
	//             html += '</ul>'
	//             html += '</li>'
	//           }
	//         })
	//       } else {
	//         html += '<li class="safe_state">当前处于安全状态，请继续保持！</li>'
	//       }
	//       scan_time = Date.now() / 1000;
	//       $('.scanning1 .warning_scan_describe .warn_scan_subtitle').html('检测时间：&nbsp;' + bt.format_data(scan_time));
	//     }
	//     $('.warning_scan_body').html(html);
	//   }
	//   var pay = '<span class="ml5 buy">\
	//       <span class="wechatEnterpriseService"></span>\
	//       <span class="btlink service_buy2">付费修复</span>\
	//     </span>'
	//   bt.open({
	//     type: '1',
	//     title: '漏洞扫描',
	//     area: ['750px', '700px'],
	//     skin: 'warning_scan_view',
	//     content: '<div class="warning_scan_view" style="height:100%;">' +
	//     '<div class="warning_scan_head">' +
	//     (!that.is_pay || that.scan_list['status'] === false ? '<div class="scanNone">\
	//     <img src="'+( that.scan_num > 0 ? '/static/img/scanning-danger.svg' : '/static/img/scanning-success.svg')+'" style="height: 75px;width: 75px;">\
	//     <div class="warning_scan_ps1">\
	//       <div style="font-size: 20px;color:'+ (that.scan_list['status'] === false ? '#333' :( that.scan_num > 0 ? 'red':'#20a53a')) +';">\
	//         '+ (that.scan_list['status'] === false ? '此功能为企业版专享功能' : (that.scan_num > 0 ? ' 漏洞数为'+that.scan_num+'个,请尽快修复漏洞' : ' 未扫描到漏洞，请持续保持哦') +' <i style="font-style:normal;font-size:16px;"> 扫描时间：'+ bt.format_data(Date.now() / 1000,'yyyy/MM/dd')) +'</i></div>\
	//       <div class="warning_scan_time">'+
	//       (that.scan_list['status'] === false ? '如需使用该功能请立即查看' : '未开通，此功能为企业版专享功能') +
	//         '</div>\
	//           </div>\
	//           <button style="top: 65px;right: 50px;border-radius: 5px;" onclick=\"product_recommend.pay_product_sign(\'ltd\',50,\'ltd\')\"">立即查看</button>'+
	//             '</div>' : '<div class="scanNone scanning1">\
	//           <div class="safaty_load"></div>\
	//           <img src="/static/img/scanning-success.svg" />\
	//           <div class="warning_scan_describe">\
	//             <div class="warning_scan_title">\
	//               距上次扫描已有 <i>' + that.span_time + '天</i>\
	//             </div>\
	//             <div class="warn_scan_subtitle">\
	//               当前处于安全状态，请继续保持！\
	//             </div>\
	//           </div>\
	//           <button class="warn_again_scan">立即查看</button><button class="warn_look hide" style="margin-right:10px">重新检测</button>'+
	//             '</div>') +
	//         '<div class="halving_line"></div>\
	//         </div>' +
	//         '<ol class="warning_scan_body">'+thumbnail+'</ol>' +
	//         '<ul class="c7 help_info_text">'+
	//         '<li>如需支持其他cms程序，请发帖反馈：<a class="btlink" target="_blank" href="https://www.bt.cn/bbs/thread-89149-1-1.html">https://www.bt.cn/bbs/thread-89149-1-1.html</a></li>'+
	//         '</ul>'+
	//       '</div>',
	//     success: function (layero) {
	//       if(site.scan_list.info && site.scan_list.info.length > 0) setTimeout(function(){$('.warn_again_scan').click()},50)

	//       $(layero).find('.service_buy2').click(function(){
	//         layer.open({
	//           title:false,
	//           btn:false,
	//           shadeClose:true,
	//           closeBtn: 2,
	//           area:['300px', '315px'],
	//           skin: 'service_consult',
	//           content:'<div class="service_consult">\
	//           <div class="service_consult_title">请打开微信"扫一扫"</div>\
	//           <div class="contact_consult" style="margin-bottom: 5px;">\
	//             <div id="contact_consult_qcode1"></div>\
	//             <i class="wechatEnterprise"></i></div>\
	//           <div>【付费修复漏洞】</div>\
	//           <ul class="help-info-text c7" style="margin-left:30px;text-align: left;">\
	//               <li>工作时间：9:15 - 18:00</li>\
	//           </ul>\
	//           </div>',
	//           success:function(layero){
	//             $(layero).find('.layui-layer-content').css('padding','0')
	//             $(layero).find('#contact_consult_qcode1').qrcode({
	//               render: "canvas",
	//               width: 140,
	//               height: 140,
	//               text: 'https://work.weixin.qq.com/kfid/kfc72fcbde93e26a6f3'
	//             });
	//           }
	//         })
	//       })
	//       $('.warning_scan_body').on('click', '.thumbnail-box' ,function(){
	//         layer.open({
	//           title:false,
	//           btn:false,
	//           shadeClose:true,
	//           closeBtn: 1,
	//           area:['700px','700px'],
	//           content:'<img src="/static/img/preview/site_scanning.png" style="width:700px"/>',
	//           success:function(layero){
	//             $(layero).find('.layui-layer-content').css('padding','0')
	//           }
	//         })
	//       });
	//       $('.warn_close_scan').click(function() {
	//         layer.closeAll()
	//       })
	//       $('.warn_again_scan').click(function () {
	//         if ($(this).hasClass('warning_cancel_scan')) {
	//           $('.scanning1 .warning_cancel_scan').html('立即扫描').addClass('warn_again_scan').removeClass('warning_cancel_scan')
	//           $('.scanning1 img').attr("src","/static/img/scanning-success.svg")
	//           $('.scanning1 img').css({"height":"85px","width":"85px"})
	//           $('.safaty_load').css('display','none')
	//           $('.scanning1 .warning_scan_describe .warning_scan_title').html('距上次扫描已有 <i>' + that.span_time + '天</i>')
	//           $('.scanning1 .warning_scan_describe .warn_scan_subtitle').html('当前处于安全状态，请继续保持！');
	//           $('.warning_scan_head .scanNone').removeClass('active')
	//           $('.warning_scan_body').html(thumbnail)
	//         }else if($(this).hasClass('warn_repair_scan')){
	//           site.repair_scheme()
	//         } else {
	//           $('.scanning1 .warn_again_scan').html('取消扫描').addClass('warning_cancel_scan').removeClass('warn_again_scan')
	//           $('.scanning1 img').attr("src","/static/img/scanning-scan.svg").css({"height":"60px","width":"60px"})
	//           $('.safaty_load').css('display','block')
	//           $('.scanning1 .warning_scan_describe .warning_scan_title').html('正在扫描网站漏洞，请稍后...')
	//           $('.scanning1 .warning_scan_describe .warn_scan_subtitle').html('检测程序类型，是否支持')
	//           $('.warning_scan_head .scanNone').addClass('active')
	//           $('.warning_scan_body').html('')
	//           $.post('project/scanning/startScan', {}, function (res) {
	//             that.scan_num = 0
	//             that.scan_list = res
	//             that.is_pay = res.is_pay
	//             for (var i = 0; i < res.info.length; i++) {
	//               if (res.info[i].cms.length > 0) {
	//                 that.scan_num += res.info[i].cms.length
	//               }
	//             }
	//             if(!$('.pull-left button:eq(3) span.btn_num').length){
	// 							$('#bt_site_table .pull-left button:eq(3)').append('<span class="btn_num" style="background:' + (that.scan_num > 0 ? 'red' : '#f0ad4e') + '">' + that.scan_num + '</span>')
	// 						}else{
	// 							$('#bt_site_table .pull-left button:eq(3) span.btn_num').css('background', that.scan_num > 0 ? 'red' : '#f0ad4e').html(that.scan_num);
	// 						}
	//             if (that.scan_num > 0) {
	//               $('.scanning1 img').attr("src","/static/img/scanning-danger.svg").css({"height":"60px","width":"60px"})
	//               $('.safaty_load').css('display','none')
	//               $('.scanning1 .warning_scan_describe .warning_scan_title').html('当前网站存在风险项<i style="color:red;">' + that.scan_num + '</i>项，请立即处理')
	//             } else {
	//               $('.scanning1 img').attr("src","/static/img/scanning-success.svg")
	//               $('.scanning1 img').css({"height":"60px","width":"60px"})
	//               $('.safaty_load').css('display','none')
	//               $('.scanning1 .warning_scan_describe .warning_scan_title').html('当前网站没有风险项')
	//             }
	//             $('.scanning1 .warning_cancel_scan').html('立即修复').addClass('warn_repair_scan').removeClass('warning_cancel_scan')
	//             $('.warn_look').removeClass('hide');
	//             $('.warning_scan_head .scanNone').addClass('active')
	//             reader_scan_list(that.scan_list);
	//           })
	//         }
	//       });
	//       $('.warn_look').click(function(){
	//         $('.warn_repair_scan').addClass('warn_again_scan').removeClass('warn_repair_scan')
	//         $('.warn_again_scan').click();
	//         $('.warn_look').addClass('hide');
	//       })
	//       $('.warning_scan_body').on('click', '.module_item .module_head', function () {
	//         var _parent = $(this).parent(), _parent_index = _parent.index(), _list = $(this).next();
	//         if (parseInt($(this).find('.module_num span').text()) > 0) {
	//           if (_list.hasClass('active')) {
	//             _list.css('height', 0);
	//             $(this).find('.module_cut_show i').text('展开').next().removeClass('glyphicon-menu-up').addClass('glyphicon-menu-down');
	//             _list.removeClass('active').removeAttr('style');
	//             $(this).css('border-bottom','none')
	//           } else {
	//             $(this).parent().parent().scrollTop(_parent_index * 45);
	//             $(this).find('.module_cut_show i').text('收起').next().removeClass('glyphicon-menu-down').addClass('glyphicon-menu-up');
	//             _list.addClass('active');
	//             var details_list = _list.parent().siblings().find('.module_details_list');
	//             details_list.removeClass('active');
	//             details_list.prev().find('.module_cut_show i').text('展开').next().removeClass('glyphicon-menu-up').addClass('glyphicon-menu-down')
	//             details_list.prev().css('border-bottom','none')
	//             $(this).css('border-bottom','1px solid rgb(232, 232, 232)')
	//           }
	//         }
	//       });
	//       $('.warning_scan_body').on('click', '.module_details_head', function () {
	//         if ($(this).children().eq(1).children('.cut_details').hasClass('active')) {
	//           $(this).siblings().hide();
	//           $(this).children().eq(1).children('.cut_details').removeClass('active').text('详情');
	//           $(this).parents('.module_details_item').css({"background": "transparent"})
	//         }else {
	//           var item = $(this).parents('.module_details_item'), indexs = item.index();
	//           $(this).children().eq(1).children('.cut_details').addClass('active').text('收起');
	//           item.css({"background": "#f8fffd"})
	//           item.siblings().find('.module_details_body').hide();
	//           item.siblings().find('.operate_tools a:eq(1)').removeClass('active').text('详情');
	//           $(this).siblings().show();
	//           $('.module_details_list').scrollTop(indexs * 41);
	//         }
	//       })
	//       $('.warning_scan_body').on('click', '.operate_tools a', function () {
	//         var index = $(this).index(), data = $(this).data();
	//         var obj = JSON.stringify({"name" : data.name})
	//         if(index==1) return
	//         var loadT = layer.msg('正在检测指定模块，请稍候...', { icon: 16, time: 0 });
	//         $.post('project/scanning/startAweb', {data : obj}, function (res) {
	//           that.scan_num = 0
	//           that.scan_list = res
	//           for (var i = 0; i < res.info.length; i++) {
	//             if (res.info[i].cms.length > 0) {
	//               that.scan_num += res.info[i].cms.length
	//             }
	//           }
	//           if(!$('.pull-left button:eq(3) span.btn_num').length){
	// 						$('#bt_site_table .pull-left button:eq(3)').append('<span class="btn_num" style="background:' + (that.scan_num > 0 ? 'red' : '#f0ad4e') + '">' + that.scan_num + '</span>')
	// 					}else{
	// 						$('#bt_site_table .pull-left button:eq(3) span.btn_num').css('background', that.scan_num > 0 ? 'red' : '#f0ad4e').html(that.scan_num);
	// 					}
	//           layer.msg('检测成功', { icon: 1 });
	//           reader_scan_list(that.scan_list);
	//         })
	//         return false;
	//       });
	//       //reader_scan_list(that.scan_list);
	//     }
	//   })
	// },

	repair_scheme: function () {
		bt.open({
			title: false,
			area: '330px',
			btn: false,
			closeBtn: 1,
			content:
				'<div class="repair-scheme">\
        <div class="repair-scheme-box">\
          <div class="repair-scheme-title">修复方案一：</div>\
          <div class="repair-scheme-content">请根据当前风险项提供的解决方案手动修复</div>\
        </div>\
        <div class="repair-scheme-box">\
          <div class="repair-scheme-title">修复方案二（<span>推荐，简单快捷</span>）：</div>\
          <div class="repair-scheme-content">\
            <span>使用微信扫描二维码，联系客服，付费修复</span>\
            <div class="qrcode">\
              <div id="wechatQrcode"><img src="/static/images/customer-qrcode.png" alt="qrcode" style="width:90px;height:90px;" /></div>\
            </div>\
          </div>\
        </div>\
      </div>',
		});
	},
	/**
	 * @description 获取时间简化缩写
	 * @param {number} dateTimeStamp 需要转换的时间戳
	 * @return {String} 简化后的时间格式
	 */
	get_simplify_time: function (dateTimeStamp) {
		if (dateTimeStamp.toString().length === 10) dateTimeStamp = dateTimeStamp * 1000;
		var minute = 1000 * 60,
			hour = minute * 60,
			day = hour * 24,
			now = new Date().getTime(),
			diffValue = now - dateTimeStamp;
		var dayC = diffValue / day;
		if (dayC >= 1) {
			result = '' + parseInt(dayC);
		} else {
			result = '0';
		}
		return result;
	},
	// 安全设置
	open_safe_config: function () {
		bt.open({
			type: 1,
			title: 'HTTPS防窜站',
			area: '340px',
			closeBtn: 2,
			shift: 0,
			content:
				'\
        <div class="bt-form pd20">\
          <div class="line">\
            <span class="tname" style="width: 120px;">HTTPS防窜站</span>\
            <div class="info-r" style="height: 32px; margin-left: 120px; padding-top: 6px;">\
              <input class="btswitch btswitch-ios" id="https_mode" type="checkbox" name="https_mode">\
              <label class="btswitch-btn" for="https_mode" style="margin-bottom: 0;"></label>\
            </div>\
          </div>\
          <ul class="help-info-text c7 plr20">\
            <li>开启后可以解决HTTPS窜站的问题</li>\
            <li>不支持IP证书的防窜，直接使用IP访问的勿开</li>\
          </ul>\
        </div>\
      ',
			success: function ($layer) {
				this.init();
				$('#https_mode').change(function () {
					var loadT = bt.load('正在设置HTTPS防窜站，请稍候...');
					bt.send('set_https_mode', 'site/set_https_mode', {}, function (res) {
						loadT.close();
						bt.msg(res);
						if (!res.status) {
							var checked = $('#https_mode').is(':checked');
							$('#https_mode').prop('checked', !checked);
						}
					});
				});
			},
			init: function () {
				var loadT = bt.load('正在获取网站设置，请稍候...');
				bt.send('get_https_mode', 'site/get_https_mode', {}, function (res) {
					loadT.close();
					if (typeof res == 'boolean') {
						$('#https_mode').prop('checked', res);
					} else {
						bt.msg(res);
					}
				});
			},
		});
	},
	set_cli_version: function () {
		var php_version = $("select[name='php_version']").val();
		var loading = bt.load();
		$.post('/config?action=set_cli_php_version', { php_version: php_version }, function (rdata) {
			loading.close();
			if (rdata.status) {
				// layer.closeAll();
			}
			layer.msg(rdata.msg, { icon: rdata.status ? 1 : 2 });
		});
	},
	//批量部署证书
	set_ssl_cert: function (_that) {
		var data_sitename = [];
		for (var i = 0; i < _that.check_list.length; i++) {
			data_sitename.push(_that.check_list[i].name);
		}
		bt.open({
			type: 1,
			title: '证书夹',
			area: '660px',
			closeBtn: 2,
			content: "<div id='cer_list_table' class='pd20' style='height: 550px;'></div>",
			success: function (layers, indexs) {
				bt.site.get_cer_list(function (rdata) {
					var cert_table = bt_tools.table({
						el: '#cer_list_table',
						height: '490px',
						data: rdata,
						column: [
							{
								fid: 'subject',
								title: '域名',
								template: function (row) {
									return '<span>' + row.dns.join('<br>') + '</span>';
								},
							},
							{ fid: 'notAfter', width: '83px', title: '到期时间' },
							{
								fid: 'issuer',
								width: '150px',
								title: '品牌',
								template: function (row) {
									return '<span class="ellipsis_text" title="' + row.issuer + '">' + row.issuer + '</span>';
								},
							},
							{
								title: '操作',
								width: 150,
								type: 'group',
								align: 'right',
								group: [
									{
										title: '部署',
										event: function (row, index, ev, key, that) {
											bt.open({
												type: 1,
												area: '420px',
												title: '部署当前证书',
												closeBtn: 2,
												btn: ['部署证书', '取消'],
												content:
													'<div class="batch-ssl-view batch-ssl-view1">\
                                    <div class="ssl-info-exhibition">\
                                      <div class="flex">\
                                        <span class="ssl-info-name">认证域名：</span>\
                                        <span class="ssl-info-content">' +
													row.dns.join('；') +
													'</span>\
                                      </div>\
                                      <div class="flex">\
                                        <span class="ssl-info-name">证书类型：</span>\
                                        <span class="ssl-info-content">' +
													row.issuer +
													'</span>\
                                      </div>\
                                      <div class="flex">\
                                        <span class="ssl-info-name">到期时间：</span>\
                                        <span class="ssl-info-content">' +
													row.notAfter +
													'</span>\
                                      </div>\
                                    </div>\
                                    <div class="ssl-deploy">如下是需要批量部署证书的站点：</div>\
                                    <div class="site-deployment">\
                                      <div class="site-list">\
                                      </div>\
                                    </div>\
                                  </div>',
												success: function (layero, index) {
													$(layero).find('.layui-layer-btn0').addClass('bath-cert-ssl').append('<span></span>');
													var $siteList = $('.site-deployment .site-list'),
														$bathCertSsl = $('.bath-cert-ssl');

													reanderSiteList(data_sitename);

													/**
													 * @description 设置批量签发按钮状态
													 * @param {number} number - 选中数量
													 */
													function setbathCertBtn(number) {
														if (number === 0) {
															$bathCertSsl.find('span').text('');
														} else {
															$bathCertSsl.find('span').text('[共' + number + '项]');
														}
													}
													/**
													 * @description: 渲染列表
													 * @param {array} collection - 数据集合
													 */
													function reanderSiteList(collection) {
														if (!collection.length) return $siteList.html('<div class="text-center" style="height: 100%;font-size: 14px;line-height: 180px;">暂无站点数据</div>');
														var html = '';
														$.each(collection, function (index, value) {
															html += '<div class="item">' + '<label label class="flex align-center" >' + '<span title="' + value + '">' + value + '</span>' + '</label>' + '</div>';
														});
														$siteList.html(html);
														setbathCertBtn(collection.length);
													}
												},
												yes: function (index, layero) {
													var list = [];
													for (var i = 0; i < data_sitename.length; i++) {
														list.push({ certName: row.subject, siteName: data_sitename[i] });
													}
													bt.simple_confirm({ title: '批量部署证书', msg: '批量部署证书后，原有证书将被覆盖，是否继续？' }, function () {
														layer.close(indexs);
														layer.close(index);
														site.setBathSiteSsl(list, function (res) {
															var html = '';
															for (var i = 0; i < res.successList.length; i++) {
																var item = res.successList[i];
																html += '<tr><td>' + item.siteName + '</td><td><div style="float:right;"><span style="color:#20a53a;">部署成功</span></div></td></tr>';
															}
															for (var i = 0; i < res.faildList.length; i++) {
																var item = res.faildList[i];
																html += '<tr><td>' + item.siteName + '</td><td><div style="float:right;"><span style="color:red;">部署失败</span></div></td></tr>';
															}
															cert_table.$batch_success_table({ title: '批量部署证书', th: '站点', html: html });
															if (site.model_table) site.model_table.$refresh_table_list(true);
															if (node_table) node_table.$refresh_table_list(true);
															if (site_table) site_table.$refresh_table_list(true);
															if (site.javaModle) site.javaModle.get_project_list();
														});
													});
												},
											});
										},
									},
									{
										title: '删除',
										event: function (row, index, ev, key, that) {
											bt.site.remove_cert_ssl(row.subject, function (rdata) {
												if (rdata.status) {
													site.ssl.reload(4);
												}
											});
										},
									},
								],
							},
						],
					});
				});
			},
		});
	},
	/**
	 * @description 批量添加伪静态
	 */
	adding_pseudo_static_in_bulk: function (_that) {
		var data_sitename = [];
		for (var i = 0; i < _that.check_list.length; i++) {
			data_sitename.push(_that.check_list[i].id);
		}
		var site_rewrites = [];
		var err_site = [];
		var template_rewrites = [];
		var aceEditor;
		var cert_table = bt_tools.table({
			el: '#table',
			data: err_site,
			height: '350px',
			minWidth: '350px',
			column: [
				{ fid: 'name', title: '网站名称' },
				{ fid: 'msg', title: '错误信息' },
			],
		});
		var open_edit = function (rdata) {
			bt.open({
				type: 1,
				title: '批量设置站点伪静态',
				area: ['755px', '656px'],
				btn: ['确定', '取消'],
				closeBtn: 2,
				content:
					'\
        <div class = "static-script-body pd15">\
          <div class = "static-script-head">\
            <span class = "static-script-head-title">站点已有伪静态规则：</span>\
            <select id = "static-script-head-self-select" class = "bt-input-text mr5"><option value="">请选择配置</option></select>\
            <span class = "static-script-head-title ml10">模板伪静态规则：</span>\
            <select id = "static-script-head-select" class="bt-input-text mr5" ><option value="">请选择配置</option></select>\
          </div>\
          <hr/>\
          <div class = "static-script-code">\
            <div class="bt-form webedit-dir-box dir-rewrite-man-con">\
              <div id="ace-editor" class=" bt-input-text ace_config_editor_scroll config ace_editor ace-chrome" style="width: 680px; height: 460px; line-height: 22px; font-size: 12px;"></div>\
            </div>\
          </div>\
        </div>',
				success: function (layero, index) {
					var $static_script_head_select = $('#static-script-head-select');
					var $static_script_head_self_select = $('#static-script-head-self-select');
					site_rewrites = rdata.site_rewrites;
					$.each(rdata.site_rewrites, function (index, item) {
						$static_script_head_self_select.append('<option value="' + item.file + '">' + item.name + '站点的伪静态配置</option>');
					});
					$.each(rdata.template_rewrites, function (index, item) {
						$static_script_head_select.append('<option value="' + item.file + '">' + item.name + '模板的伪静态配置</option>');
					});
					$static_script_head_self_select.val(rdata.site_rewrites[0].file);
					bt.files.get_file_body(rdata.site_rewrites[0].file, function (content) {
						aceEditor = bt.aceEditor({
							el: 'ace-editor',
							content: content.data,
						});
					});

					$static_script_head_self_select.on('change', function () {
						var file = $(this).val();
						bt.files.get_file_body(file, function (content) {
							if (content.data == undefined) {
								content.data = '';
							}
							aceEditor.ACE.setValue(content.data);
							$static_script_head_select.val('');
						});
					});
					$static_script_head_select.on('change', function () {
						var file = $(this).val();
						bt.files.get_file_body(file, function (content) {
							if (content.data == undefined) {
								content.data = '';
							}
							aceEditor.ACE.setValue(content.data);
							$static_script_head_self_select.val('');
						});
					});
				},
				yes: function (indexx, layero) {
					bt.open({
						type: 1,
						area: '420px',
						title: '部署当前伪静态规则',
						closeBtn: 2,
						btn: ['部署伪静态规则', '取消'],
						content:
							'<div class="batch-ssl-view batch-ssl-view1">\
                <div class="ssl-deploy">如下是需要批量部署伪静态的站点：</div>\
                <div class="site-deployment">\
                  <div class="site-list">\
                  </div>\
                </div>\
                <div class="text-danger text-icon " style="font-size: 13px">注意：批量设置站点伪静态后，原有站点伪静态配置将被覆盖。</div>\
              </div>',
						success: function (layero, index) {
							$(layero).find('.layui-layer-btn0').addClass('bath-cert-ssl').append('<span></span>');
							var $siteList = $('.site-deployment .site-list'),
								$bathCertSsl = $('.bath-cert-ssl');

							reanderSiteList(site_rewrites);

							/**
							 * @description 设置批量签发按钮状态
							 * @param {number} number - 选中数量
							 */
							function setbathCertBtn(number) {
								if (number === 0) {
									$bathCertSsl.find('span').text('');
								} else {
									$bathCertSsl.find('span').text('[共' + number + '项]');
								}
							}

							/**
							 * @description: 渲染列表
							 * @param {array} collection - 数据集合
							 */
							function reanderSiteList(collection) {
								if (!collection.length) return $siteList.html('<div class="text-center" style="height: 100%;font-size: 14px;line-height: 180px;">暂无站点数据</div>');
								var html = '';
								$.each(collection, function (index, value) {
									html += '<div class="item">' + '<label label class="flex align-center" >' + '<span title="' + value.name + '">' + value.name + '</span>' + '</label>' + '</div>';
								});
								$siteList.html(html);
								setbathCertBtn(collection.length);
							}
						},
						yes: function (index, layero) {
							layer.close(index);
							layer.close(indexx);
							bt_tools.send(
								{
									url: 'site?action=SetRewriteLists',
									data: {
										sites: JSON.stringify(site_rewrites),
										rewrite_data: aceEditor.ACE.getValue(),
									},
								},
								function (res) {
									var html = '';
									for (var i = 0; i < res.length; i++) {
										var item = res[i];
										if (item.status) {
											html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:#20a53a;">部署成功</span></div></td></tr>';
										} else {
											html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:red;">部署失败</span></div></td></tr>';
										}
									}
									cert_table.$batch_success_table({
										title: '批量设置站点伪静态',
										th: '站点',
										html: html,
									});
								},
								'部署伪静态中'
							);
						},
					});
				},
			});
		};

		bt.send(
			'GetRewriteLists',
			'site/GetRewriteLists',
			{
				site_ids: JSON.stringify(data_sitename),
				site_type: 'PHP',
			},
			function (rdata) {
				site_rewrites = rdata.site_rewrite;
				err_site = rdata.err_site;
				template_rewrites = rdata.template_rewrite;
				if (err_site.length > 0) {
					var html = '';
					for (var i = 0; i < err_site.length; i++) {
						var item = err_site[i];
						html += '<tr><td style="text-align: left">' + item.name + '</td><td style="text-align: left"><div><span style="color: red">' + item.msg + '</span></div></td></tr>';
					}
					bt.open({
						title: '批量设置站点伪静态',
						btn: ['下一步', '取消'],
						area: ['490px', '400px'],
						content:
							'<div class="batch_title" style="margin-top: 0">' +
							'<span class>' +
							'<span class="batch_icon" style="background-position:0px 0"></span>' +
							'<span class="batch_text" style="font-size: 17px"> 有' +
							err_site.length +
							'个网站无法部署伪静态！如需忽略请点击下一步。</span>' +
							'<div class="' +
							(length > 4 ? 'fiexd_thead' : '') +
							' batch_tabel divtable" style="margin-top: 20px; overflow: auto;height: 108px;">' +
							'<table class="table table-hover" >' +
							'<thead>' +
							'<tr><th >站点名称</th><th>错误信息</th></tr>' +
							'</thead>' +
							'<tbody>' +
							html +
							'</tbody>' +
							'</table>' +
							'</div>' +
							'</span>' +
							'</div>',
						yes: function (index, layero) {
							layer.close(index);
							open_edit(rdata);
						},
					});
				} else {
					open_edit(rdata);
				}
			}
		);
	},
	del_site: function (wid, wname, callback) {
		var num1 = bt.get_random_num(1, 9),
			num2 = bt.get_random_num(1, 9),
			title = '';
		title = typeof wname === 'function' ? '批量删除站点' : '删除站点 [ ' + wname + ' ]';
		layer.open({
			type: 1,
			title: title,
			icon: 0,
			skin: 'delete_site_layer',
			area: '440px',
			closeBtn: 2,
			shadeClose: true,
			content:
				"<div class='bt-form webDelete pd30' id='site_delete_form'>" +
				'<i class="layui-layer-ico layui-layer-ico0"></i>' +
				"<div class='f13 check_title'>是否要删除关联的FTP、数据库、站点目录！</div>" +
				'<div class="check_type_group">' +
				'<label><input type="checkbox" name="ftp"><span>FTP</span></label>' +
				'<label><input type="checkbox" name="database"><span>数据库</span>' +
				(!recycle_bin_db_open ? '<span class="glyphicon glyphicon-info-sign" style="color: red"></span>' : '') +
				'</label>' +
				'<label><input type="checkbox"  name="path"><span>站点目录</span>' +
				(!recycle_bin_open ? '<span class="glyphicon glyphicon-info-sign" style="color: red"></span>' : '') +
				'</label>' +
				'</div>' +
				"<div class='vcode'>" +
				lan.bt.cal_msg +
				"<span class='text'>" +
				num1 +
				' + ' +
				num2 +
				"</span>=<input type='number' id='vcodeResult' value=''></div>" +
				'</div>',
			btn: [lan.public.ok, lan.public.cancel],
			success: function (layers, indexs) {
				var _this = this;
				$(layers)
					.find('.check_type_group label')
					.hover(
						function () {
							var name = $(this).find('input').attr('name');
							if (name === 'database' && !recycle_bin_db_open) {
								layer.tips('风险操作：当前数据库回收站未开启，删除数据库将永久消失！', this, { tips: [1, 'red'], time: 0 });
							} else if (name === 'path' && !recycle_bin_open) {
								layer.tips('风险操作：当前文件回收站未开启，删除站点目录将永久消失！', this, { tips: [1, 'red'], time: 0 });
							}
						},
						function () {
							layer.closeAll('tips');
						}
					);
				layers.find('#vcodeResult').keyup(function (e) {
					if (e.keyCode == 13) {
						_this.yes(indexs);
					}
				});
			},
			yes: function (indexs) {
				var vcodeResult = $('#vcodeResult'),
					data = { id: wid, webname: wname };
				$('#site_delete_form input[type=checkbox]').each(function (index, item) {
					if ($(item).is(':checked')) data[$(item).attr('name')] = 1;
				});
				if (vcodeResult.val() === '') {
					layer.tips('计算结果不能为空', vcodeResult, { tips: [1, 'red'], time: 3000 });
					vcodeResult.focus();
					return false;
				} else if (parseInt(vcodeResult.val()) !== num1 + num2) {
					layer.tips('计算结果不正确', vcodeResult, { tips: [1, 'red'], time: 3000 });
					vcodeResult.focus();
					return false;
				}
				var is_database = data.hasOwnProperty('database'),
					is_path = data.hasOwnProperty('path'),
					is_ftp = data.hasOwnProperty('ftp');
				if (!is_database && !is_path && (!is_ftp || is_ftp)) {
					if (typeof wname === 'function') {
						wname(data);
						return false;
					}
					bt.site.del_site(data, function (rdata) {
						layer.close(indexs);
						if (callback) callback(rdata);
						bt.msg(rdata);
					});
					return false;
				}
				if (typeof wname === 'function') {
					delete data.id;
					delete data.webname;
				}
				layer.close(indexs);
				var ids = JSON.stringify(wid instanceof Array ? wid : [wid]),
					countDown = typeof wname === 'string' ? 4 : 9;
				title = typeof wname === 'function' ? '二次验证信息，批量删除站点' : '二次验证信息，删除站点 [ ' + wname + ' ]';
				var loadT = bt.load('正在检测站点数据信息，请稍候...');
				bt.send('check_del_data', 'site/check_del_data', { ids: ids }, function (res) {
					loadT.close();
					layer.open({
						type: 1,
						title: title,
						closeBtn: 2,
						skin: 'verify_site_layer_info active',
						area: '740px',
						content:
							'<div class="check_delete_site_main pd30">' +
							'<i class="layui-layer-ico layui-layer-ico0"></i>' +
							'<div class="check_layer_title">堡塔温馨提示您，请冷静几秒钟，确认以下要删除的数据。</div>' +
							'<div class="check_layer_content">' +
							'<div class="check_layer_item">' +
							'<div class="check_layer_site"></div>' +
							'<div class="check_layer_database"></div>' +
							'</div>' +
							'</div>' +
							'<div class="check_layer_error ' +
							(is_database && data['database'] && !recycle_bin_db_open ? '' : 'hide') +
							'"><span class="glyphicon glyphicon-info-sign"></span>风险事项：当前未开启数据库回收站功能，删除数据库后，数据库将永久消失！</div>' +
							'<div class="check_layer_error ' +
							(is_path && data['path'] && !recycle_bin_open ? '' : 'hide') +
							'"><span class="glyphicon glyphicon-info-sign"></span>风险事项：当前未开启文件回收站功能，删除站点目录后，站点目录将永久消失！</div>' +
							'<div class="check_layer_message">请仔细阅读以上要删除信息，防止网站数据被误删，确认删除还有 <span style="color:red;font-weight: bold;">' +
							countDown +
							'</span> 秒可以操作。</div>' +
							'</div>',
						// recycle_bin_db_open &&
						// recycle_bin_open &&
						// btn: ['确认删除(' + countDown + '秒后继续操作)', '取消删除'],
						btn: ['确认删除', '取消删除'],
						success: function (layers) {
							var html = '',
								rdata = res.data;
							for (var i = 0; i < rdata.length; i++) {
								var item = rdata[i],
									newTime = parseInt(new Date().getTime() / 1000),
									t_icon = '<span class="glyphicon glyphicon-info-sign" style="color: red;width:15px;height: 15px;;vertical-align: middle;"></span>';

								(site_html = (function (item) {
									if (!is_path) return '';
									var is_time_rule = newTime - item.st_time > 86400 * 30 && item.total > 1024 * 10,
										is_path_rule = res.file_size <= item.total,
										dir_time = bt.format_data(item.st_time, 'yyyy-MM-dd'),
										dir_size = bt.format_size(item.total);

									var f_html =
										'<i ' + (is_path_rule ? 'class="warning"' : '') + ' style = "vertical-align: middle;" > ' + (item.limit ? '大于50MB' : dir_size) + '</i> ' + (is_path_rule ? t_icon : '');
									var f_title = (is_path_rule ? '注意：此目录较大，可能为重要数据，请谨慎操作.\n' : '') + '目录：' + item.path + '(' + (item.limit ? '大于' : '') + dir_size + ')';

									return (
										'<div class="check_layer_site">' +
										'<span title="站点：' +
										item.name +
										'">站点名：' +
										item.name +
										'</span>' +
										'<span title="' +
										f_title +
										'" >目录：<span style="vertical-align: middle;max-width: 160px;width: auto;">' +
										item.path +
										'</span> (' +
										f_html +
										')</span>' +
										'<span title="' +
										(is_time_rule ? '注意：此站点创建时间较早，可能为重要数据，请谨慎操作.\n' : '') +
										'时间：' +
										dir_time +
										'">创建时间：<i ' +
										(is_time_rule ? 'class="warning"' : '') +
										'>' +
										dir_time +
										'</i></span>' +
										'</div>'
									);
								})(item)),
									(database_html = (function (item) {
										if (!is_database || !item.database) return '';
										var is_time_rule = newTime - item.st_time > 86400 * 30 && item.total > 1024 * 10,
											is_database_rule = res.db_size <= item.database.total,
											database_time = bt.format_data(item.database.st_time, 'yyyy-MM-dd'),
											database_size = bt.format_size(item.database.total);

										var f_size = '<i ' + (is_database_rule ? 'class="warning"' : '') + ' style = "vertical-align: middle;" > ' + database_size + '</i> ' + (is_database_rule ? t_icon : '');
										var t_size = '注意：此数据库较大，可能为重要数据，请谨慎操作.\n数据库：' + database_size;

										return (
											'<div class="check_layer_database">' +
											'<span title="数据库：' +
											item.database.name +
											'">数据库：' +
											item.database.name +
											'</span>' +
											'<span title="' +
											t_size +
											'">大小：' +
											f_size +
											'</span>' +
											'<span title="' +
											(is_time_rule && item.database.total != 0 ? '重要：此数据库创建时间较早，可能为重要数据，请谨慎操作.' : '') +
											'时间：' +
											database_time +
											'">创建时间：<i ' +
											(is_time_rule && item.database.total != 0 ? 'class="warning"' : '') +
											'>' +
											database_time +
											'</i></span>' +
											'</div>'
										);
									})(item));
								if (site_html + database_html !== '') html += '<div class="check_layer_item">' + site_html + database_html + '</div>';
							}
							if (html === '') html = '<div style="text-align: center;width: 100%;height: 100%;line-height: 300px;font-size: 15px;">无数据</div>';
							$('.check_layer_content').html(html);
							var interVal = setInterval(function () {
								countDown--;
								// $(layers).find('.layui-layer-btn0').text('确认删除(' + countDown + '秒后继续操作)')
								$(layers).find('.check_layer_message span').text(countDown);
							}, 1000);
							setTimeout(function () {
								$(layers).find('.layui-layer-btn0').text('确认删除');
								$(layers).find('.check_layer_message').html('<span style="color:red">注意：请仔细阅读以上要删除信息，防止网站数据被误删</span>');
								$(layers).removeClass('active');
								clearInterval(interVal);
							}, countDown * 1000);
						},
						yes: function (indes, layers) {
							if ($(layers).hasClass('active')) {
								layer.tips('请确认信息，稍候再尝试，还剩' + countDown + '秒', $(layers).find('.layui-layer-btn0'), { tips: [1, 'red'], time: 3000 });
								return;
							}
							if (typeof wname === 'function') {
								wname(data);
							} else {
								bt.site.del_site(data, function (rdata) {
									layer.closeAll();
									if (rdata.status) site.get_list();
									if (callback) callback(rdata);
									bt.msg(rdata);
								});
							}
						},
					});
				});
			},
		});
	},
	batch_site: function (type, obj, result) {
		if (obj == undefined) {
			obj = {};
			var arr = [];
			result = { count: 0, error_list: [] };
			$('input[type="checkbox"].check:checked').each(function () {
				var _val = $(this).val();
				if (!isNaN(_val)) arr.push($(this).parents('tr').data('item'));
			});
			if (type == 'site_type') {
				bt.site.get_type(function (tdata) {
					var types = [];
					for (var i = 0; i < tdata.length; i++) types.push({ title: tdata[i].name, value: tdata[i].id });
					var form = {
						title: '设置站点分类',
						area: '530px',
						list: [{ title: lan.site.default_site, name: 'type_id', width: '300px', type: 'select', items: types }],
						btns: [
							bt.form.btn.close(),
							bt.form.btn.submit('提交', function (rdata, load) {
								var ids = [];
								for (var x = 0; x < arr.length; x++) ids.push(arr[x].id);
								bt.site.set_site_type({ id: rdata.type_id, site_array: JSON.stringify(ids) }, function (rrdata) {
									if (rrdata.status) {
										load.close();
										site.get_list();
									}
									bt.msg(rrdata);
								});
							}),
						],
					};
					bt.render_form(form);
				});
				return;
			}
			var thtml = "<div class='options'><label style=\"width:100%;\"><input type='checkbox' id='delpath' name='path'><span>" + lan.site.all_del_info + '</span></label></div>';
			bt.show_confirm(
				lan.site.all_del_site,
				"<a style='color:red;'>" + lan.get('del_all_site', [arr.length]) + '</a>',
				function () {
					if ($('#delpath').is(':checked')) obj.path = '1';
					obj.data = arr;
					bt.closeAll();
					site.batch_site(type, obj, result);
				},
				thtml
			);

			return;
		}
		var item = obj.data[0];
		switch (type) {
			case 'del':
				if (obj.data.length < 1) {
					site.get_list();
					bt.msg({ msg: lan.get('del_all_site_ok', [result.count]), icon: 1, time: 5000 });
					return;
				}
				var data = { id: item.id, webname: item.name, path: obj.path };
				bt.site.del_site(data, function (rdata) {
					if (rdata.status) {
						result.count += 1;
					} else {
						result.error_list.push({ name: item.item, err_msg: rdata.msg });
					}
					obj.data.splice(0, 1);
					site.batch_site(type, obj, result);
				});
				break;
		}
	},
	set_class_type: function () {
		var _form_data = bt.render_form_line({
			title: '',
			items: [
				{ placeholder: '请填写分类名称', name: 'type_name', width: '50%', type: 'text' },
				{
					name: 'btn_submit',
					text: '添加',
					type: 'button',
					callback: function (sdata) {
						bt.site.add_type(sdata.type_name, function (ldata) {
							if (ldata.status) {
								$('[name="type_name"]').val('');
								site.get_class_type();
								site.init_site_type();
							}
							bt.msg(ldata);
						});
					},
				},
			],
		});
		bt.open({
			type: 1,
			area: '350px',
			title: '网站分类管理',
			closeBtn: 2,
			shift: 5,
			shadeClose: true,
			content:
				"<div class='bt-form edit_site_type mb15'><div class='divtable mtb15' style='overflow:auto'>" +
				_form_data.html +
				"<table id='type_table' class='table table-hover' width='100%'></table></div>"+bt.render_help(['【站点批量操作-设置分类】可修改网站分类'])+"</div>",
			success: function () {
				bt.render_clicks(_form_data.clicks);
				site.get_class_type(function (res) {
					$('#type_table').on('click', '.del_type', function () {
						var _this = $(this);
						var item = _this.parents('tr').data('item');
						if (item.id == 0) {
							bt.msg({ icon: 2, msg: '默认分类不可删除/不可编辑!' });
							return;
						}
						bt.confirm({ msg: '是否确定删除分类？', title: '删除分类【' + item.name + '】' }, function () {
							bt.site.del_type(item.id, function (ret) {
								if (ret.status) {
									site.get_class_type();
									site.init_site_type();
									var active = bt.get_cookie('site_type') || -1;
									if (active == item.id) {
										bt.set_cookie('site_type', -1);
									}
									site_table.$refresh_table_list(true);
								}
								bt.msg(ret);
							});
						});
					});
					$('#type_table').on('click', '.edit_type', function () {
						var item = $(this).parents('tr').data('item');
						if (item.id == 0) {
							bt.msg({ icon: 2, msg: '默认分类不可删除/不可编辑!' });
							return;
						}
						bt.render_form({
							title: '修改分类管理【' + item.name + '】',
							area: '350px',
							list: [{ title: '分类名称', width: '150px', name: 'name', value: item.name }],
							btns: [
								{ title: '关闭', name: 'close' },
								{
									title: '提交',
									name: 'submit',
									css: 'btn-success',
									callback: function (rdata, load, callback) {
										bt.site.edit_type({ id: item.id, name: rdata.name }, function (edata) {
											if (edata.status) {
												load.close();
												site.get_class_type();
												site.init_site_type();
											}
											bt.msg(edata);
										});
									},
								},
							],
						});
					});
				});
			},
		});
	},
	get_class_type: function (callback) {
		site.get_types(function (rdata) {
			bt.render({
				table: '#type_table',
				columns: [
					{ field: 'name', title: '名称' },
					{
						field: 'opt',
						width: '80px',
						title: '操作',
						templet: function (item) {
							return '<a class="btlink edit_type" href="javascript:;">编辑</a> | <a class="btlink del_type" href="javascript:;">删除</a>';
						},
					},
				],
				data: rdata,
			});
			$('.layui-layer-page').css({ 'margin-top': '-' + $('.layui-layer-page').height() / 2 + 'px', top: '50%' });
			site.reader_site_type(rdata);
			if (callback) callback(rdata);
		});
	},
	ssl: {
		my_ssl_msg: null,

		//续签订单内
		renew_ssl: function (siteName, auth_type, index) {
			acme.siteName = siteName;
			if (index.length === 32 && index.indexOf('/') === -1) {
				acme.renew(index, function (rdata) {
					site.ssl.ssl_result(rdata, auth_type, siteName);
				});
			} else {
				acme.get_cert_init(index, siteName, function (cert_init) {
					acme.domains = cert_init.dns;
					var options = '<option value="http">文件验证 - HTTP</option>';
					for (var i = 0; i < cert_init.dnsapi.length; i++) {
						options += '<option value="' + cert_init.dnsapi[i].name + '">DNS验证 - ' + cert_init.dnsapi[i].title + '</option>';
					}
					acme.select_loadT = layer.open({
						title: "续签Let's Encrypt证书",
						type: 1,
						closeBtn: 2,
						shade: 0.3,
						area: '500px',
						offset: '30%',
						content:
							'<div style="margin: 10px;">\
              <div class="line ">\
                  <span class="tname" style="padding-right: 15px;margin-top: 8px;">请选择验证方式</span>\
                  <div class="info-r label-input-group ptb10">\
                      <select class="bt-input-text" name="auth_to">' +
							options +
							'</select>\
                      <span class="dnsapi-btn"></span>\
                      <span class="renew-onkey"><button class="btn btn-success btn-sm mr5" style="margin-left: 10px;" onclick="site.ssl.renew_ssl_other()">一键续签</button></span>\
                  </div>\
              </div>\
              <ul class="help-info-text c7">\
                  <li>通配符证书不能使用【文件验证】，请选择DNS验证</li>\
                  <li>使用【文件验证】，请确保没有开[启强制HTTPS/301重定向/反向代理]等功能</li>\
                  <li>使用【阿里云DNS】【DnsPod】等验证方式需要设置正确的密钥</li>\
                  <li>续签成功后，证书将在下次到期前30天尝试自动续签</li>\
                  <li>使用【DNS验证 - 手动解析】续签的证书无法实现下次到期前30天自动续签</li>\
              </ul>\
            </div>',
						success: function (layers) {
							$("select[name='auth_to']").change(function () {
								var dnsapi = $(this).val();
								$('.dnsapi-btn').html('');
								for (var i = 0; i < cert_init.dnsapi.length; i++) {
									if (cert_init.dnsapi[i].name !== dnsapi) continue;
									acme.dnsapi = cert_init.dnsapi[i];
									if (!cert_init.dnsapi[i].data) continue;
									$('.dnsapi-btn').html('<button class="btn btn-default btn-sm mr5 set_dns_config" onclick="site.ssl.show_dnsapi_setup()">设置</button>');
									if (cert_init.dnsapi[i].data[0].value || cert_init.dnsapi[i].data[1].value) break;
									site.ssl.show_dnsapi_setup();
								}
							});
						},
					});
				});
			}
		},
		//续签其它
		renew_ssl_other: function () {
			var auth_to = $("select[name='auth_to']").val();
			var auth_type = 'http';
			if (auth_to === 'http') {
				if (JSON.stringify(acme.domains).indexOf('*.') !== -1) {
					layer.msg('包含通配符的域名不能使用文件验证(HTTP)!', { icon: 2 });
					return;
				}
				auth_to = acme.id;
			} else {
				if (auth_to !== 'dns') {
					if (auth_to === 'Dns_com') {
						acme.dnsapi.data = [{ value: 'None' }, { value: 'None' }];
					}
					if (!acme.dnsapi.data[0].value || !acme.dnsapi.data[1].value) {
						layer.msg('请先设置【' + acme.dnsapi.title + '】接口信息!', { icon: 2 });
						return;
					}
					auth_to = auth_to + '|' + acme.dnsapi.data[0].value + '|' + acme.dnsapi.data[1].value;
				}
				auth_type = 'dns';
			}
			layer.close(acme.select_loadT);
			acme.apply_cert(acme.domains, auth_type, auth_to, '0', function (rdata) {
				site.ssl.ssl_result(rdata, auth_type, acme.siteName);
			});
		},
		show_dnsapi_setup: function () {
			var dnsapi = acme.dnsapi;
			acme.dnsapi_loadT = layer.open({
				title: '设置【' + dnsapi.title + '】接口',
				type: 1,
				closeBtn: 0,
				shade: 0.3,
				area: '550px',
				offset: '30%',
				content:
					'<div class="bt-form pd20 pb70 ">\
                            <div class="line ">\
                                <span class="tname" style="width: 125px;">' +
					dnsapi.data[0].key +
					'</span>\
                                <div class="info-r" style="margin-left:120px">\
                                    <input name="' +
					dnsapi.data[0].name +
					'" class="bt-input-text mr5 dnsapi-key" type="text" style="width:330px" value="' +
					dnsapi.data[0].value +
					'">\
                                </div>\
                            </div>\
                            <div class="line ">\
                                <span class="tname" style="width: 125px;">' +
					dnsapi.data[1].key +
					'</span>\
                                <div class="info-r" style="margin-left:120px">\
                                    <input name="' +
					dnsapi.data[1].name +
					'" class="bt-input-text mr5 dnsapi-token" type="text" style="width:330px" value="' +
					dnsapi.data[1].value +
					'">\
                                </div>\
                            </div>\
                            <div class="bt-form-submit-btn">\
                                <button type="button" class="btn btn-sm btn-danger" onclick="layer.close(acme.dnsapi_loadT);">关闭</button>\
                                <button type="button" class="btn btn-sm btn-success dnsapi-save">保存</button>\
                            </div>\
                            <ul class="help-info-text c7">\
                                <li>' +
					dnsapi.help +
					'</li>\
                            </ul>\
                          </div>',
				success: function (layers) {
					$('.dnsapi-save').click(function () {
						var dnsapi_key = $('.dnsapi-key');
						var dnsapi_token = $('.dnsapi-token');
						pdata = {};
						pdata[dnsapi_key.attr('name')] = dnsapi_key.val();
						pdata[dnsapi_token.attr('name')] = dnsapi_token.val();
						acme.dnsapi.data[0].value = dnsapi_key.val();
						acme.dnsapi.data[1].value = dnsapi_token.val();
						bt.site.set_dns_api({ pdata: JSON.stringify(pdata) }, function (ret) {
							if (ret.status) layer.close(acme.dnsapi_loadT);
							bt.msg(ret);
						});
					});
				},
			});
		},
		set_cert: function (siteName, res) {
			var loadT = bt.load(lan.site.saving_txt);
			var pdata = {
				type: 1,
				siteName: siteName,
				key: res.private_key,
				csr: res.cert + res.root,
			};
			bt.send('SetSSL', 'site/SetSSL', pdata, function (rdata) {
				loadT.close();
				site.reload();
				layer.msg(res.msg, { icon: 1 });
			});
		},
		show_error: function (res, auth_type) {
			var area_size = '500px';
			var err_info = '';
			if (res.msg[1].challenges === undefined) {
				err_info += '<p><span>响应状态:</span>' + res.msg[1].status + '</p>';
				err_info += '<p><span>错误类型:</span>' + res.msg[1].type + '</p>';
				err_info += "<p><span>错误来源:</span><a href='https://letsencrypt.org/' class='btlink'>Let's Encrypt官网</a></p>";
				err_info += '<p><span>错误代码:</span>' + res.msg[1].detail + '</p>';
			} else {
				if (!res.msg[1].challenges[1]) {
					if (res.msg[1].challenges[0]) {
						res.msg[1].challenges[1] = res.msg[1].challenges[0];
					}
				}
				if (res.msg[1].status === 'invalid') {
					area_size = '600px';
					var trs = $('#dns_txt_jx tbody tr');
					var dns_value = '';

					for (var imd = 0; imd < trs.length; imd++) {
						if (trs[imd].outerText.indexOf(res.msg[1].identifier.value) == -1) continue;
						var s_tmp = trs[imd].outerText.split('\t');
						if (s_tmp.length > 1) {
							dns_value = s_tmp[1];
							break;
						}
					}

					err_info += '<p><span>验证域名:</span>' + res.msg[1].identifier.value + '</p>';
					if (auth_type === 'dns') {
						var check_url = '_acme-challenge.' + res.msg[1].identifier.value;
						err_info += '<p><span>验证解析:</span>' + check_url + '</p>';
						err_info += '<p><span>验证内容:</span>' + dns_value + '</p>';
						err_info += '<p><span>错误代码:</span>' + site.html_encode(res.msg[1].challenges[1].error.detail) + '</p>';
					} else {
						var check_url = 'http://' + res.msg[1].identifier.value + '/.well-known/acme-challenge/' + res.msg[1].challenges[0].token;
						err_info += "<p><span>验证URL:</span><a class='btlink' href='" + check_url + "' target='_blank'>点击查看</a></p>";
						err_info += '<p><span>验证内容:</span>' + res.msg[1].challenges[0].token + '</p>';
						err_info += '<p><span>错误代码:</span>' + site.html_encode(res.msg[1].challenges[0].error.detail) + '</p>';
					}
					err_info += "<p><span>验证结果:</span> <a style='color:red;'>验证失败</a></p>";
				}
			}

			layer.msg('<div class="ssl-file-error"><a style="color: red;font-weight: 900;">' + res.msg[0] + '</a>' + err_info + '</div>', {
				icon: 2,
				time: 0,
				shade: 0.3,
				shadeClose: true,
				area: area_size,
			});
		},
		ssl_result: function (res, auth_type, siteName) {
			layer.close(acme.loadT);
			if (res.status === false && typeof res.msg === 'string') {
				bt.msg(res);
				return;
			}
			if (res.status === true || res.status === 'pending' || res.save_path !== undefined) {
				if (auth_type == 'dns' && res.status === 'pending') {
					var b_load = bt.open({
						type: 1,
						area: '700px',
						title: '手动解析TXT记录',
						closeBtn: 2,
						shift: 5,
						shadeClose: false,
						content:
							"<div class='divtable pd15 div_txt_jx'>\
                                    <p class='mb15' >请按以下列表做TXT解析:</p>\
                                    <table id='dns_txt_jx' class='table table-hover'></table>\
                                    <div class='text-right mt10'>\
                                        <button class='btn btn-success btn-sm btn_check_txt' >验证</button>\
                                    </div>\
                                    </div>",
					});

					//手动验证事件
					$('.btn_check_txt').click(function () {
						acme.auth_domain(res.index, function (res1) {
							layer.close(acme.loadT);
							if (res1.status === true) {
								b_load.close();
								site.ssl.set_cert(siteName, res1);
							} else {
								site.ssl.show_error(res1, auth_type);
							}
						});
					});

					//显示手动验证信息
					setTimeout(function () {
						var data = [];
						acme_txt = '_acme-challenge.';
						for (var j = 0; j < res.auths.length; j++) {
							data.push({
								name: acme_txt + res.auths[j].domain.replace('*.', ''),
								type: 'TXT',
								txt: res.auths[j].auth_value,
								force: '是',
							});
							data.push({
								name: res.auths[j].domain.replace('*.', ''),
								type: 'CAA',
								txt: '0 issue "letsencrypt.org"',
								force: '否',
							});
						}
						bt.render({
							table: '#dns_txt_jx',
							columns: [
								{ field: 'name', width: '220px', title: '解析域名' },
								{ field: 'txt', title: '记录值' },
								{ field: 'type', title: '类型' },
								{ field: 'force', title: '必需' },
							],
							data: data,
						});
						$('.div_txt_jx').append(
							bt.render_help([
								'解析域名需要一定时间来生效,完成所以上所有解析操作后,请等待1分钟后再点击验证按钮',
								'可通过CMD命令来手动验证域名解析是否生效: nslookup -q=txt ' + acme_txt + res.auths[0].domain.replace('*.', ''),
								'若您使用的是宝塔云解析插件,阿里云DNS,DnsPod作为DNS,可使用DNS接口自动解析',
							])
						);
					});
					return;
				}
				site.ssl.set_cert(siteName, res);
				return;
			}

			site.ssl.show_error(res, auth_type);
		},
		get_renew_stat: function () {
			$.post('/ssl?action=Get_Renew_SSL', {}, function (task_list) {
				if (!task_list.status) return;
				var s_body = '';
				var b_stat = false;
				for (var i = 0; i < task_list.data.length; i++) {
					s_body += '<p>' + task_list.data[i].subject + ' >> ' + task_list.data[i].msg + '</p>';
					if (task_list.data[i].status !== true && task_list.data[i].status !== false) {
						b_stat = true;
					}
				}
				if (site.ssl.my_ssl_msg) {
					$('.my-renew-ssl').html(s_body);
				} else {
					site.ssl.my_ssl_msg = layer.msg('<div class="my-renew-ssl">' + s_body + '</div>', { time: 0, icon: 16, shade: 0.3 });
				}

				if (!b_stat) {
					setTimeout(function () {
						layer.close(site.ssl.my_ssl_msg);
						site.ssl.my_ssl_msg = null;
					}, 3000);
					return;
				}
				setTimeout(function () {
					site.ssl.get_renew_stat();
				}, 1000);
			});
		},
		onekey_ssl: function (partnerOrderId, siteName) {
			bt.site.get_ssl_info(partnerOrderId, siteName, function (rdata) {
				bt.msg(rdata);
				if (rdata.status) site.reload(7);
			});
		},
		set_ssl_status: function (action, siteName, ssl_id) {
			bt.site.set_ssl_status(action, siteName, function (rdata) {
				bt.msg(rdata);
				if (rdata.status) {
					site.reload(7);
					if (site.model_table) site.model_table.$refresh_table_list(true);
					if (node_table) node_table.$refresh_table_list(true);
					if (ssl_id != undefined) {
						setTimeout(function () {
							$('#ssl_tabs span:eq(' + ssl_id + ')').click();
						}, 1000);
					}
					if (action == 'CloseSSLConf') {
						layer.msg(lan.site.ssl_close_info, { icon: 1, time: 5000 });
					}
				}
			});
		},
		verify_domain: function (partnerOrderId, siteName) {
			bt.site.verify_domain(partnerOrderId, siteName, function (vdata) {
				bt.msg(vdata);
				if (vdata.status) {
					if (vdata.data.stateCode == 'COMPLETED') {
						site.ssl.onekey_ssl(partnerOrderId, siteName);
					} else {
						layer.msg('等待CA验证中，若长时间未能成功验证，请登录官网使用DNS方式重新申请...');
					}
				}
			});
		},
		reload: function (index) {
			if (index == undefined) index = 0;
			var _sel = $('#ssl_tabs .on');
			if (_sel.length == 0) _sel = $('#ssl_tabs span:eq(0)');
			_sel.trigger('click');
		},
	},
	edit: {
		update_composer: function () {
			loadT = bt.load();
			$.post('/files?action=update_composer', { repo: $("select[name='repo']").val() }, function (v_data) {
				loadT.close();
				bt.msg(v_data);
				site.edit.set_composer(site.edit.compr_web);
			});
		},
		show_composer_log: function () {
			$.post('/ajax?action=get_lines', { filename: '/tmp/composer.log', num: 30 }, function (v_body) {
				var log_obj = $('#composer-log');
				if (log_obj.length < 1) return;
				log_obj.html(v_body.msg);
				var div = document.getElementById('composer-log');
				div.scrollTop = div.scrollHeight;
				if (v_body.msg.indexOf('BT-Exec-Completed') != -1) {
					//layer.close(site.edit.comp_showlog);
					layer.msg('执行完成', { icon: 1 });
					site.edit.set_composer(site.edit.compr_web);
					return;
				}

				setTimeout(function () {
					site.edit.show_composer_log();
				}, 1000);
			});
		},
		comp_confirm: 0,
		comp_showlog: 0,
		exec_composer: function () {
			var title_msg = '执行Composer的影响范围取决于该目录下的composer.json配置文件，继续吗？';
			if ($("select[name='composer_args']").val()) {
				title_msg = '即将执行设定的composer命令，继续吗？';
			}
			site.edit.comp_confirm = layer.confirm(title_msg, { title: '确认执行Composer', closeBtn: 2, icon: 3 }, function (index) {
				layer.close(site.edit.comp_confirm);
				var pdata = {
					php_version: $("select[name='php_version']").val(),
					composer_args: $("select[name='composer_args']").val(),
					composer_cmd: $("input[name='composer_cmd']").val(),
					repo: $("select[name='repo']").val(),
					path: $("input[name='composer_path']").val(),
					user: $("select[name='composer_user']").val(),
				};
				$.post('/files?action=exec_composer', pdata, function (rdatas) {
					if (!rdatas.status) {
						layer.msg(rdatas.msg, { icon: 2 });
						return false;
					}
					if (rdatas.status === true) {
						site.edit.comp_showlog = layer.open({
							area: '800px',
							type: 1,
							shift: 5,
							closeBtn: 2,
							title: '在[' + pdata['path'] + ']目录执行Composer，执行完后，确认无问题后请关闭此窗口',
							content: "<pre id='composer-log' style='height: 300px;background-color: #333;color: #fff;margin: 0 0 0;'></pre>",
						});
						setTimeout(function () {
							site.edit.show_composer_log();
						}, 200);
					}
				});
			});
		},
		remove_composer_lock: function (path) {
			$.post('/files?action=DeleteFile', { path: path + '/composer.lock' }, function (rdata) {
				bt.msg(rdata);
				$('.composer-msg').remove();
				$('.composer-rm').remove();
			});
		},
		compr_web: null,
		set_composer: function (web) {
			site.edit.compr_web = web;
			$.post('/files?action=get_composer_version', { path: web.path }, function (v_data) {
				if (v_data.status === false) {
					bt.msg(v_data);
					return;
				}

				var php_versions = '';
				for (var i = 0; i < v_data.php_versions.length; i++) {
					if (v_data.php_versions[i].version == '00') continue;
					php_versions += '<option value="' + v_data.php_versions[i].version + '">' + v_data.php_versions[i].name + '</option>';
				}
				if (!php_versions) layer.msg('没有找到可用的PHP版本!', { time: 10000 });

				var msg = '';
				if (v_data.comp_lock) {
					msg += '<span>' + v_data.comp_lock + ' <a class="btlink composer-rm" onclick="site.edit.remove_composer_lock(\'' + web.path + '\')">[点击删除]</a></span>';
				}
				if (v_data.comp_json !== true) {
					msg += '<span>' + v_data.comp_json + '</span>';
				}

				var com_body =
					'<from class="bt-form" style="padding:30px 0;display:inline-block;width: 630px;">' +
					'<div class="line"><span style="width: 105px;" class="tname">Composer版本</span><div class="info-r"><input readonly="readonly" style="background-color: #eee;width:275px;" name="composer_version" class="bt-input-text" value="' +
					(v_data.msg ? v_data.msg : '未安装Composer') +
					'" /><button onclick="site.edit.update_composer();" style="margin-left: 5px;" class="btn btn-default btn-sm">' +
					(v_data.msg ? '升级Composer' : '安装Composer') +
					'</button></div></div>' +
					'<div class="line"><span style="width: 105px;" class="tname">PHP版本</span><div class="info-r">' +
					'<select class="bt-input-text" name="php_version" style="width:275px;">' +
					'<option value="auto">自动选择</option>' +
					php_versions +
					'</select>' +
					'</div></div>' +
					'<div class="line"><span style="width: 105px;" class="tname">执行参数</span><div class="info-r">' +
					'<select class="bt-input-text" name="composer_args" style="width:275px;">' +
					'<option value="install">install</option>' +
					'<option value="update">update</option>' +
					'<option value="create-project">create-project</option>' +
					'<option value="require">require</option>' +
					'<option value="other">自定义命令</option>' +
					'</select>' +
					'</div></div>' +
					'<div class="line"><span style="width: 105px;" class="tname">补充命令</span><div class="info-r">' +
					'<input style="width:275px;" class="bt-input-text" id="composer_cmd" name="composer_cmd"  placeholder="输入要操作的应用名称或完整Composer命令" type="text" value="" />' +
					'</div></div>' +
					'<div class="line"><span style="width: 105px;" class="tname">镜像源</span><div class="info-r">' +
					'<select class="bt-input-text" name="repo" style="width:275px;">' +
					'<option value="https://mirrors.aliyun.com/composer/">阿里源(mirrors.aliyun.com)</option>' +
					'<option value="https://mirrors.cloud.tencent.com/composer/">腾讯源(mirrors.cloud.tencent.com)</option>' +
					'<option value="repos.packagist">官方源(packagist.org)</option>' +
					'</select>' +
					'</div></div>' +
					'<div class="line"><span style="width: 105px;" class="tname">执行用户</span><div class="info-r">' +
					'<select class="bt-input-text" name="composer_user" style="width:275px;">' +
					'<option value="www">www(推荐)</option>' +
					'<option value="root">root(不建议)</option>' +
					'</select>' +
					'</div></div>' +
					'<div class="line"><span style="width: 105px;" class="tname">执行目录</span><div class="info-r">' +
					'<input style="width:275px;" class="bt-input-text" id="composer_path" name="composer_path" type="text" value="' +
					web.path +
					'" /><span class="glyphicon glyphicon-folder-open cursor ml5" onclick="bt.select_path(\'composer_path\')"></span>' +
					'</div></div>' +
					'<div class="line"><span style="width: 105px;height: 25px;" class="tname"> </span><span class="composer-msg" style="color:red;">' +
					msg +
					'</span></div>' +
					'<div class="line" style="clear:both"><span style="width: 105px;" class="tname"> </span><div class="info-r"><button ' +
					(msg.includes('没有找到') ? 'disabled' : '') +
					' class="btn ' +
					(msg.includes('没有找到') ? 'btn-default' : 'btn-success') +
					' btn-sm" onclick="site.edit.exec_composer()">执行</button></div></div>' +
					'</from>' +
					'<ul class="help-info-text c7" style="margin-top: 0;">' +
					'<li>Composer是PHP主流依赖包管理器，若您的项目使用Composer管理依赖包，可在此处对依赖进行升级或安装</li>' +
					'<li>执行目录：默认为当前网站根目录</li>' +
					'<li>执行用户：默认为www用户，除非您的网站以root权限运行，否则不建议使用root用户执行composer</li>' +
					'<li>镜像源：提供【阿里源】和【官方源】，建议国内服务器使用【阿里源】，海外服务器使用【官方源】</li>' +
					'<li>执行参数：按需选择执行参数,可配合补充命令使用</li>' +
					'<li>补充命令：若此处为空，则按composer.json中的配置执行，此处支持填写完整composer命令</li>' +
					'<li>PHP版本：用于执行composer的PHP版本，无特殊要求，默认即可，如安装出错，可尝试选择其它PHP版本</li>' +
					'<li>Composer版本：当前安装的Composer版本，可点击右侧的【升级Composer】将Composer升级到最新稳定版</li>' +
					'</ul>';
				$('#webedit-con .tab-con').html(com_body);
				// 检测composer执行目录是否有配置文件
				$('#composer_path').change(function () {
					$.post('/files?action=get_composer_version', { path: $(this).val() }, function (r_data) {
						var json_flag = typeof r_data.comp_json == 'boolean' && r_data.comp_json;
						var lock_flag = typeof r_data.comp_lock == 'boolean' && !r_data.comp_lock;
						if (json_flag && lock_flag) {
							$('.composer-msg').parent().hide();
						} else {
							$('.composer-msg').parent().show();
							if (typeof r_data.comp_json == 'string') $('.composer-msg').text(r_data.comp_json);
							if (typeof r_data.comp_lock == 'string') $('.composer-msg').text(r_data.comp_lock);
						}
					});
				});
			});
		},
		set_domains: function (web) {
			var _this = this;
			var list = [
				{
					class: 'mb0',
					items: [
						{ name: 'newdomain', width: '340px', type: 'textarea', placeholder: '每行填写一个域名，默认为80端口<br>泛解析添加方法 *.domain.com<br>如另加端口格式为 www.domain.com:88' },
						{
							name: 'btn_submit_domain',
							text: '添加',
							type: 'button',
							callback: function (sdata) {
								var arrs = sdata.newdomain.split('\n');
								var domins = '';
								for (var i = 0; i < arrs.length; i++) domins += arrs[i] + ',';
								bt.site.add_domains(web.id, web.name, bt.rtrim(domins, ','), function (ret) {
									if (typeof ret.status == 'undefined') {
										site.render_domain_result_table(ret);
										site.reload(0);
									} else {
										bt.msg(ret);
									}
								});
							},
						},
					],
				},
			];
			var _form_data = bt.render_form_line(list[0]),
				loadT = null,
				placeholder = null;
			$('#webedit-con').html(_form_data.html + "<div class='bt_table' id='domain_table'></div>");
			bt.render_clicks(_form_data.clicks);
			$('.btn_submit_domain').addClass('pull-right').css('margin', '30px 35px 0 0');
			placeholder = $('.placeholder');
			placeholder
				.click(function () {
					$(this).hide();
					$('.newdomain').focus();
				})
				.css({ width: '340px', heigth: '100px', left: '0px', top: '0px', 'padding-top': '10px', 'padding-left': '15px' });
			$('.newdomain')
				.focus(function () {
					placeholder.hide();
					loadT = layer.tips(placeholder.html(), $(this), { tips: [1, '#20a53a'], time: 0, area: $(this).width() });
				})
				.blur(function () {
					if ($(this).val().length == 0) placeholder.show();
					layer.close(loadT);
				});
			bt_tools.table({
				el: '#domain_table',
				url: '/data?action=getData',
				param: { table: 'domain', list: 'True', search: web.id },
				dataFilter: function (res) {
					return { data: res };
				},
				column: [
					{ type: 'checkbox', width: 20, keepNumber: 1 },
					{
						fid: 'name',
						title: '域名',
						template: function (row) {
							return '<a href="http://' + row.name + ':' + row.port + '" target="_blank" class="btlink">' + row.name + '</a>';
						},
					},
					{ fid: 'port', title: '端口', width: 50, type: 'text' },
					{
						title: '操作',
						width: 80,
						type: 'group',
						align: 'right',
						group: [
							{
								title: '删除',
								template: function (row, that) {
									return that.data.length === 1 ? '<span>不可操作</span>' : '删除';
								},
								event: function (row, index, ev, key, that) {
									if (ev.target.tagName == 'SPAN') return;
									if (that.data.length === 1) {
										bt.msg({ status: false, msg: '最后一个域名不能删除!' });
										return false;
									}
									bt.confirm({ title: '删除域名【' + row.name + '】', msg: '删除选中的域名后，将无法使用该域名访问网站，是否继续操作？' }, function () {
										bt.site.del_domain(web.id, web.name, row.name, row.port, function (res) {
											if (res.status) that.$delete_table_row(index);
											bt.msg(res);
										});
									});
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
						config: {
							title: '删除',
							url: '/site?action=delete_domain_multiple',
							param: { id: web.id },
							paramId: 'id',
							paramName: 'domains_id',
							theadName: '域名',
							confirmVerify: false, //是否提示验证方式
							refresh: true,
						},
					},
				],
			});
			$('#domain_table>.divtable').css('max-height', '350px');
		},
		set_dirbind: function (web) {
			var _this = this,
				dirss = '';
			$('#webedit-con').html('<div id="sub_dir_table"></div>');
			bt_tools.table({
				el: '#sub_dir_table',
				url: '/site?action=GetDirBinding',
				param: { id: web.id },
				dataFilter: function (res) {
					if ($('#webedit-con').children().length === 2) return { data: res.binding };
					var dirs = [];
					for (var n = 0; n < res.dirs.length; n++) dirs.push({ title: res.dirs[n], value: res.dirs[n] });
					dirss = dirs;
					$('#webedit-con').prepend('<div id="webedit-con-before"></div>');
					// 将子目录绑定形式改为配置版
					bt_tools.form({
						el: '#webedit-con-before',
						form: [
							{
								label: '域名',
								group: {
									type: 'text',
									name: 'domain',
									width: '140px',
									placeholder: '请输入域名',
								},
							},
							{
								label: '子目录',
								group: {
									type: 'select',
									name: 'select_subdir',
									unit: '<button class="btn bt-btn btn-sm btn-success btn_add_subdir">添加</button>',
									width: '240px',
									placeholder: '请选择子目录',
									list: dirss,
									value: '无数据',
								},
							},
						],
					});
					// 点击子目录添加
					$('.btn_add_subdir').click(function () {
						var domain = $('input[name="domain"]').val();
						var dirName = $('select[name="select_subdir"]').val();
						if (!domain || !dirName) {
							layer.msg(lan.site.d_s_empty, { icon: 2 });
							return;
						}
						bt.site.add_dirbind(web.id, domain, dirName, function (ret) {
							layer.msg(ret.msg, { icon: ret.status ? 1 : 2 });
							if (ret.status) site.reload(1);
						});
					});
					return { data: res.binding };
				},
				column: [
					{ type: 'checkbox', width: 20, keepNumber: 1 },
					{
						fid: 'domain',
						title: '域名',
						width: 150,
						template: function (row) {
							return '<a class="btlink" href="http://' + row.domain + ':' + row.port + '" target="_blank" title="' + row.domain + '">' + row.domain + '</a>';
						},
					},
					{ fid: 'port', title: '端口', width: 70, type: 'text' },
					{ fid: 'path', title: '子目录', type: 'text' },
					{
						title: '操作',
						width: 110,
						type: 'group',
						align: 'right',
						group: [
							{
								title: '伪静态',
								event: function (row, index, ev, key, that) {
									row.path = row.path.split('<a ')[0]; // 处理子目录不存在的情况下的提示标签 @author hwliang @date 2022-05-11
									bt.site.get_dir_rewrite({ id: row.id }, function (ret) {
										if (!ret.status) {
											var confirmObj = layer.confirm(lan.site.url_rewrite_alter, { icon: 3, closeBtn: 2 }, function () {
												bt.site.get_dir_rewrite({ id: row.id, add: 1 }, function (ret) {
													layer.close(confirmObj);
													show_dir_rewrite(ret);
												});
											});
											return;
										}
										show_dir_rewrite(ret);

										function get_rewrite_file(name) {
											var spath = '/www/server/panel/rewrite/' + (bt.get_cookie('serverType') == 'openlitespeed' ? 'apache' : bt.get_cookie('serverType')) + '/' + name + '.conf';

											if (name == lan.site.rewritename) {
												if (bt.get_cookie('serverType') == 'nginx') {
													spath = '/www/server/panel/vhost/rewrite/' + web.name + '_' + row['path'].replace(/\//g, '_') + '.conf';
												} else {
													spath = '/www/wwwroot/' + web.name + '/' + row['path'] + '/.htaccess';
												}
											}
											bt.files.get_file_body(spath, function (sdata) {
												$('.dir_config').text(sdata.data);
											});
										}

										function show_dir_rewrite(ret) {
											var load_form = bt.open({
												type: 1,
												area: ['510px', '515px'],
												title: lan.site.config_url,
												closeBtn: 2,
												shift: 5,
												skin: 'bt-w-con',
												shadeClose: true,
												content: "<div class='bt-form webedit-dir-box dir-rewrite-man-con'></div>",
												success: function () {
													if (!ret.status) return false;
													var _html = $('.webedit-dir-box'),
														arrs = [];
													for (var i = 0; i < ret.rlist.length; i++) {
														arrs.push({ title: ret.rlist[i], value: ret.rlist[i] });
													}
													var datas = [
														{
															name: 'dir_rewrite',
															type: 'select',
															width: '130px',
															items: arrs,
															callback: function (obj) {
																get_rewrite_file(obj.val(), 'sub_dir');
															},
														},
														{ items: [{ name: 'dir_config', type: 'textarea', value: ret.data, width: '470px', height: '260px' }] },
														{
															items: [
																{
																	name: 'btn_save',
																	text: '保存',
																	type: 'button',
																	callback: function (ldata) {
																		bt.files.set_file_body(ret.filename, ldata.dir_config, 'utf-8', function (sdata) {
																			if (sdata.status) load_form.close();
																			bt.msg(sdata);
																		});
																	},
																},
															],
														},
													];
													var clicks = [];
													for (var i = 0; i < datas.length; i++) {
														var _form_data = bt.render_form_line(datas[i]);
														_html.append(_form_data.html);
														var _other = bt.os == 'Linux' && i == 0 ? '<span>规则转换工具：<a href="https://www.bt.cn/Tools" target="_blank" style="color:#20a53a">Apache转Nginx</a></span>' : '';
														_html.find('.info-r').append(_other);
														clicks = clicks.concat(_form_data.clicks);
													}
													_html.append(bt.render_help(['请选择您的应用，若设置伪静态后，网站无法正常访问，请尝试设置回default', '您可以对伪静态规则进行修改，修改完后保存即可。']));
													bt.render_clicks(clicks);
													get_rewrite_file($('.dir_rewrite option:eq(0)').val());
												},
											});
										}
									});
								},
							},
							{
								title: '删除',
								event: function (row, index, ev, key, that) {
									bt.confirm({ title: '删除子目录绑定【' + row.path + '】', msg: lan.site.s_bin_del }, function () {
										bt.site.del_dirbind(row.id, function (res) {
											if (res.status) that.$delete_table_row(index);
											bt.msg(res);
										});
									});
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
						config: {
							title: '删除',
							url: '/site?action=delete_dir_bind_multiple',
							param: { id: web.id },
							paramId: 'id',
							paramName: 'bind_ids',
							theadName: '域名',
							confirmVerify: false, //是否提示验证方式
							refresh: true,
						},
					},
				],
			});
		},
		set_dirpath: function (web, used) {
			var _this = this;
			var tabConfig = bt_tools.tab({
				type: 0,
				theme: { nav: 'ml0' },
				active: 1, //激活TAB下标
				list: [
					{
						title: '网站目录',
						name: 'dir_path',
						content: '<div id="dir_path"></div>',
						success: function () {
							var loading = bt.load();
							bt.site.get_site_path(web.id, function (path) {
								bt.site.get_dir_userini(web.id, path, function (rdata) {
									bt_tools.send({ url: '/site?action=get_sites_ftp', data: { site_id: web.id } }, function (ress) {
										loading.close();
										var dirs = [];
										var is_n = false;
										var username_loca = null;
										var ftpid_loca = null;
										for (var n = 0; n < rdata.runPath.dirs.length; n++) {
											dirs.push({ title: rdata.runPath.dirs[n], value: rdata.runPath.dirs[n] });
											if (rdata.runPath.runPath === rdata.runPath.dirs[n]) is_n = true;
										}
										if (!is_n) dirs.push({ title: rdata.runPath.runPath, value: rdata.runPath.runPath });
										var datas = [
											{
												title: '',
												items: [
													{
														name: 'userini',
														type: 'checkbox',
														text: '防跨站攻击(open_basedir)',
														value: rdata.userini,
														callback: function (sdata) {
															bt.site.set_dir_userini(path, function (ret) {
																if (ret.status) site.reload(2);
																layer.msg(ret.msg, { icon: ret.status ? 1 : 2 });
															});
														},
													},
													{
														name: 'logs',
														type: 'checkbox',
														text: '写访问日志',
														value: rdata.logs,
														callback: function (sdata) {
															bt.site.set_logs_status(web.id, function (ret) {
																if (ret.status) site.reload(2);
																layer.msg(ret.msg, { icon: ret.status ? 1 : 2 });
															});
														},
													},
												],
											},
											{
												title: '',
												items: [
													{
														name: 'path',
														title: '网站目录',
														width: '240px',
														value: path,
														event: {
															css: 'glyphicon-folder-open',
															callback: function (obj) {
																bt.select_path(obj);
															},
														},
													},
													{
														name: 'btn_site_path',
														class: 'ml10',
														type: 'button',
														text: '保存',
														callback: function (pdata) {
															bt.site.set_site_path(web.id, pdata.path, function (ret) {
																if (ret.status) site.reload(2);
																layer.msg(ret.msg, { icon: ret.status ? 1 : 2 });
															});
														},
													},
												],
											},
											{
												title: '',
												items: [
													{ title: '运行目录', width: '240px', value: rdata.runPath.runPath, name: 'dirName', type: 'select', items: dirs },
													{
														name: 'btn_run_path',
														type: 'button',
														text: '保存',
														callback: function (pdata) {
															bt.site.set_site_runpath(web.id, pdata.dirName, function (ret) {
																if (ret.status) site.reload(2);
																layer.msg(ret.msg, { icon: ret.status ? 1 : 2 });
															});
														},
													},
												],
											},
										];

										var _html = $('<div class="webedit-box soft-man-con" style="padding-left: 10px;"></div>');

										var clicks = [];
										for (var i = 0; i < datas.length; i++) {
											var _form_data = bt.render_form_line(datas[i]);
											_html.append($(_form_data.html).addClass('line'));
											clicks = clicks.concat(_form_data.clicks);
										}

										_html.find('input[type="checkbox"]').parent().addClass('label-input-group ptb10');
										_html.find('button[name="btn_run_path"]').addClass('ml45');
										_html.find('button[name="btn_site_path"]').addClass('ml33');
										_html.append(bt.render_help(['部分程序需要指定二级目录作为运行目录，如ThinkPHP5，Laravel', '选择您的运行目录，点保存即可']));
										_html.append('<div class="user_pw_tit" style="margin-top: 10px;padding-top: 11px;"></div>');
										_html.append('<div id="ftpForm" style="margin-left:-37px"></div>');

										$('#dir_path').append(_html);
										var is_null = true;
										if (!ress.info) {
											is_null = false;
											$('#ftpsw').prop('checked', false);
										}
										if (ress.info) {
											username_loca = ress.info.name;
											ftpid_loca = ress.info.id;
										}
										var ftpForm = bt_tools.form({
											el: '#ftpForm',
											form: [
												{
													group: {
														name: 'ftpSwitch',
														type: 'other',
														display: true,
														boxcontent:
															'<div style="display:flex;align-items:center;margin-left:36px"><span>添加FTP</span><span class="btswitch-p"><input class="btswitch btswitch-ios" id="ftpsw" type="checkbox"><label style="margin-left:6px;margin-right:6px" class="btswitch-btn phpmyadmin-btn" for="ftpsw" ></label></span><span class="c7">开启即添加FTP，关闭即删除FTP</span></div>',
													},
												},
												{
													label: '用户名',
													group: {
														name: 'username',
														type: 'other',
														display: true,
														boxcontent:
															'<div id="username_input"><div><input type="text" class="bt-input-text mr10" style="width:239px" id="username"><span class="ico-copy cursor btcopy" title="复制" id="username_copy"></span></div></div>',
													},
												},
												{
													label: '密码',
													group: {
														name: 'password',
														type: 'other',
														display: true,
														boxcontent:
															'<div id="userpass_input" style="width:269px;display:flex;align-items:center"><input type="text" class="bt-input-text" style="width:207px;border-radius:2px 0 0 2px" id="userpassword"><div style="border:1px solid #ccc;border-left:0;border-radius:0 2px 2px 0;background:#F5F7FA;width:32px;height:32px;display:flex;align-items:center;flex-direction:row;justify-content:center"><span class="glyphicon cursor glyphicon-repeat icon_password_GnjeBw" title="随机" id="random_pass"></span></div><span class="ico-copy cursor btcopy ml10" title="复制" id="userpass_copy"></div>',
													},
												},
												{
													label: '根目录',
													group: {
														disabled: true,
														type: 'text',
														name: 'webPath',
														width: '239px',
														value: ress.info ? ress.info.path : '',
													},
												},
												{
													label: '',
													group: {
														type: 'button',
														name: 'submitForm',
														title: '保存',
														event: function (formData, element, that) {
															var sload = layer.msg('正在保存中,请稍后...', { icon: 16 });
															$('#username_input').find('#save_status').remove();
															bt_tools.send(
																{ url: '/site?action=set_sites_ftp', data: { site_id: web.id, ftp_name: $('#username').val(), ftp_pwd: $('#userpassword').val(), ftp_id: ftpid_loca } },
																function (resss) {
																	ftpid_loca = resss.info.id;
																	username_loca = resss.info.name;
																	layer.msg(resss.msg, { icon: resss.status ? 1 : 2 });
																	layer.close(sload);
																}
															);
														},
													},
												},
											],
										});
										if (ress.info) {
											if (ress.info.status == '1') {
												$('#ftpsw').prop('checked', true);
											} else {
												$('#ftpsw').prop('checked', false);
											}
											$('#username').val(ress.info.name);
											$('#userpassword').val(ress.info.password);
										}
										if (!ress.info) {
											$('#ftpForm').find('.line').not(':first').css('display', 'none');
										}
										$('#username_copy').click(function () {
											bt.pub.copy_pass($('#username').val());
										});
										$('#userpass_copy').click(function () {
											bt.pub.copy_pass($('#userpassword').val());
										});
										$('#random_pass').click(function () {
											$('#userpassword').val(bt.get_random(12));
										});
										$('#username').blur(function () {
											if (username_loca !== $('#username').val()) {
												$('#username_input').find('#save_status').remove();
												$('#username_input').append('<span id="save_status" style="display:inline-block;padding-top:5px;color:#EF0808">未保存</span>');
											}
										});
										$('#ftpsw').click(function () {
											if (!$('#ftpsw').prop('checked')) {
												bt.confirm(
													{
														title: '删除FTP',
														msg: '<span>关闭后将会删除该FTP，是否继续操作?</span>',
													},
													function () {
														var cload = layer.msg('正在删除中,请稍后...', { icon: 16 });
														bt_tools.send(
															{
																url: '/site?action=set_sites_ftp',
																data: { site_id: web.id, ftp_status: $('#ftpsw').prop('checked'), ftp_name: username_loca, ftp_pwd: $('#userpassword').val(), ftp_id: ftpid_loca },
															},
															function (resss) {
																layer.msg(resss.msg, { icon: resss.status ? 1 : 2 });
																if (!resss.status) {
																	$('#ftpsw').prop('checked', !$('#ftpsw').prop('checked'));
																	return;
																}
																$('#ftpForm').find('.line').not(':first').css('display', 'none');
																layer.close(cload);
															},
															{ verify: false }
														);
													},
													function () {
														$('#ftpsw').prop('checked', !$('#ftpsw').prop('checked'));
													}
												);
											} else {
												$('#username_input').find('#save_status').remove();
												bt.confirm(
													{
														title: '创建FTP',
														msg: '<span>创建FTP将会同步到FTP界面，是否继续操作？</span>',
													},
													function () {
														$('#username').val(bt.get_random(12));
														$('#userpassword').val(bt.get_random(12));
														var cload = layer.msg('正在添加中,请稍后...', { icon: 16 });
														bt_tools.send(
															{ url: '/site?action=set_sites_ftp', data: { site_id: web.id, ftp_name: $('#username').val(), ftp_pwd: $('#userpassword').val() } },
															function (resss) {
																layer.msg(resss.msg, { icon: resss.status ? 1 : 2 });
																if (!resss.status) {
																	$('#ftpsw').prop('checked', !$('#ftpsw').prop('checked'));
																	return;
																}
																site.reload(2);
																$('#ftpForm').find('.line').not(':first').css('display', 'block');
																ftpid_loca = resss.info.id;
																username_loca = resss.info.name;
																layer.msg(resss.msg, { icon: resss.status ? 1 : 2 });
																layer.close(cload);
															},
															{ verify: false }
														);
													},
													function () {
														$('#ftpsw').prop('checked', !$('#ftpsw').prop('checked'));
													}
												);
											}
										});

										bt.render_clicks(clicks);
										if (bt.get_cookie('ltd_end') < 0) {
											// $('.quota_block').append('<div class="mask_layer">\
											// 	<div class="prompt_description"><i class="prompt-note">!</i>此功能为企业版专享功能，<a href="javascript:;" class="btlink" onclick="product_recommend.pay_product_sign(\'ltd\', 51, \'ltd\')">立即升级</a></div>\
											// </div>')
										}

										if (rdata.pass) $('#pathSafe').trigger('click');
									});
								});
							});
						},
					},
					{
						title: '网站配额容量',
						name: 'site_rate',
						content: '<div id="site_rate"></div>',
						success: function () {
							var loading = bt.load();
							bt.site.get_site_path(web.id, function (path) {
								bt.site.get_dir_userini(web.id, path, function (rdata) {
									loading.close();
									var dirs = [];
									var is_n = false;
									for (var n = 0; n < rdata.runPath.dirs.length; n++) {
										dirs.push({ title: rdata.runPath.dirs[n], value: rdata.runPath.dirs[n] });
										if (rdata.runPath.runPath === rdata.runPath.dirs[n]) is_n = true;
									}
									if (!is_n) dirs.push({ title: rdata.runPath.runPath, value: rdata.runPath.runPath });

									var quota_data = [
										{
											title: '',
											items: [{ name: 'quota_used', title: '网站已用容量', width: '240px', value: getQuotaData_used(web, used), disabled: true, unit: '<span class="used_unit">MB</span>' }],
										},
										{
											title: '',
											items: [
												{
													title: '<span class="glyphicon icon-vipLtd" style="margin-left: -23px;"></span> 网站配额容量',
													type: 'number',
													width: '240px',
													min: '0',
													value: getQuotaData_size(web),
													name: 'quota_sized',
													unit: '<span class="used_unit">MB</span>',
												},
												{
													name: 'save_quota_size_btn',
													type: 'button',
													text: '保存',
													callback: function (pdata) {
														var quota_size = $('input[name="quota_sized"]').val();
														bt.public.modify_path_quota({ data: JSON.stringify({ size: quota_size, path: web.path }) }, function (res) {
															if (res.status) {
																bt.msg(res);
																web.quota.size = quota_size;
																site_table.$refresh_table_list(true, function (rdata) {
																	for (var i = 0; i < rdata.data.length; i++) {
																		var item = rdata.data[i];
																		if (item.name === web.name) {
																			web.quota.used = item.quota.used;
																			$('input[name="quota_used"]').val(getQuotaData_used(item));
																		}
																	}
																});
																if (quota_size == '0') {
																	web.quota.used = 0;
																	$('input[name="quota_used"]').val(0);
																	return;
																}
															} else {
																// layer.msg(res.msg, { icon:res.status?1:2, time:0, shade:.3, closeBtn:2})
																if (res.msg === '此功能为企业版专享功能，请先购买企业版') {
																	bt.confirm(
																		{
																			title: '提示',
																			msg: '此功能为企业版专享功能，是否购买企业版？',
																		},
																		function () {
																			bt.soft.product_pay_view({ totalNum: 51, limit: 'ltd', closePro: true });
																		}
																	);
																} else {
																	layer.msg(res.msg, {
																		time: 0,
																		shade: 0.3,
																		closeBtn: 2,
																		maxWidth: 650,
																		icon: res.status ? 1 : 2,
																	});
																}
															}
														});
													},
												},
											],
										},
									];
									function getQuotaData_used(web, used) {
										var quota = web.quota;
										if (typeof quota.size == 'undefined') quota['size'] = 0;
										used = quota['used'];
										if (quota.size == '0') {
											$('.quota_used').next().remove();
											$('.quota_used').after('<span class="used_unit">MB</span>');
											return '未设置容量大小';
										}
										var size = quota.size * 1024 * 1024;
										var quotaFull = false;
										var usedList = ['0'];
										if (used) {
											usedList = bt.format_size(used).split(' ');
											$('.quota_used').next().remove();
											if (used == 0) {
												$('.quota_used').after('<span class="used_unit">MB</span>');
											} else {
												$('.quota_used').after('<span class="used_unit">' + usedList[1] + '</span>');
											}
										}
										if (quota.size > 0 && used >= size) quotaFull = true;
										return quotaFull ? '当前容量已用完' : usedList[0];
									}
									function getQuotaData_size(web) {
										var quota = web.quota;
										if (typeof quota.size == 'undefined') quota['size'] = 0;
										var size = quota.size * 1024 * 1024;
										var quotaFull = false;
										if (quota.size > 0 && quota.used >= size) quotaFull = true;
										return String(quota.size);
									}

									var _html = $('<div class="webedit-box-con soft-man-cons" style="padding-left: 10px;"></div>');
									var clicks = [];
									_html.append('<div class="quota_block" style="position:relative"></div>');
									if (bt.os == 'Linux')
										_html.append(
											'<div class="user_pw_tit" style="margin-top: 10px;padding-top: 11px;display:flex;flex-direction:row;align-items:center"><span class="tit">密码访问</span><span class="btswitch-p"><input class="btswitch btswitch-ios" id="pathSafe" type="checkbox"><label class="btswitch-btn phpmyadmin-btn" for="pathSafe" ></label></span></div><div class="user_pw" style="margin-top: 0px; display: block;"></div>'
										);
									$('#site_rate').append(_html);
									for (var i = 0; i < quota_data.length; i++) {
										var _form_data = bt.render_form_line(quota_data[i]);
										$('.quota_block').append($(_form_data.html).addClass('line mtb10'));
										clicks = clicks.concat(_form_data.clicks);
									}
									if ($('.quota_used').val().indexOf('当前容量已用完') == -1) {
										var used = $('.quota_used');
										var quota = web.quota;
										var usedNum = quota['used'];
										var usedList = ['0'];
										if (usedNum) {
											usedList = bt.format_size(usedNum).split(' ');
										}
										if (usedNum == 0 || used.val() == '0') {
											used.after('<span class="used_unit">MB</span>');
										} else {
											used.after('<span class="used_unit">' + usedList[1] + '</span>');
										}
										$('.quota_sized').on('change', function () {
											if ($(this).val() < 0) {
												$(this).val(0);
											}
										});
									}
									$('.quota_block').append(
										bt.render_help([
											'需要XFS文件系统，且包含prjquota挂载参数才能使用',
											'fstab配置示例：/dev/vdc1 /data xfs defaults,prjquota 0 0',
											'配额容量：设置当前网站最大容量，如需取消容量配额，请设为“0”',
										])
									);
									bt.render_clicks(clicks);
									if (bt.get_cookie('ltd_end') < 0) {
										// $('.quota_block').append('<div class="mask_layer">\
										// 	<div class="prompt_description"><i class="prompt-note">!</i>此功能为企业版专享功能，<a href="javascript:;" class="btlink" onclick="product_recommend.pay_product_sign(\'ltd\', 51, \'ltd\')">立即升级</a></div>\
										// </div>')
									}

									$('#pathSafe').click(function () {
										var val = $(this).prop('checked');
										var _div = $('.user_pw');
										if (val) {
											var dpwds = [
												{ title: '授权账号', width: '200px', name: 'username_get', placeholder: '不修改请留空' },
												{ title: '访问密码', width: '200px', type: 'password', name: 'password_get_1', placeholder: '不修改请留空' },
												{ title: '重复密码', width: '200px', type: 'password', name: 'password_get_2', placeholder: '不修改请留空' },
												{
													name: 'btn_password_get',
													text: '保存',
													type: 'button',
													callback: function (rpwd) {
														if (rpwd.password_get_1 != rpwd.password_get_2) {
															layer.msg(lan.bt.pass_err_re, { icon: 2 });
															return;
														}
														bt.site.set_site_pwd(web.id, rpwd.username_get, rpwd.password_get_1, function (ret) {
															layer.msg(ret.msg, { icon: ret.status ? 1 : 2 });
															$('#webedit-con').find('.tab-nav').children().eq(1).click();
														});
													},
												},
											];
											for (var i = 0; i < dpwds.length; i++) {
												var _from_pwd = bt.render_form_line(dpwds[i]);
												_div.append(_from_pwd.html);
												bt.render_clicks(_from_pwd.clicks);
											}
										} else {
											bt.site.close_site_pwd(web.id, function (rdata) {
												layer.msg(rdata.msg, { icon: rdata.status ? 1 : 2 });
												_div.html('');
												$('#webedit-con').find('.tab-nav').children().eq(1).click();
											});
										}
									});
									if (rdata.pass) $('#pathSafe').trigger('click');
								});
							});
						},
					},
				],
			});
			$('#webedit-con').html(tabConfig.$reader_content());
			tabConfig.$init();
		},
		set_dirguard: function (web) {
			$('#webedit-con').html('<div id="set_dirguard"></div>');
			var tab =
				'<div class="tab-nav mb15">\
                    <span class="on">加密访问</span><span class="">禁止访问</span><span><i class="glyphicon icon-vipLtd" style="margin: 0 5px 0 0;"></i>双向认证<b style="color: #fc6d26;">【推荐】</b></span>\
                    </div>\
                    <div class="tabs_content">\
                      <div class="tabpanel" id="dir_dirguard"></div>\
                      <div class="tabpanel" id="php_dirguard" style="display:none;"></div>\
                      <div class="tabpanel" id="authentication" style="display:none;"></div>\
                    </div>';
			$('#set_dirguard').html(tab);
			bt_tools.table({
				el: '#dir_dirguard',
				url: '/site?action=get_dir_auth',
				param: { id: web.id },
				height: 450,
				dataFilter: function (res) {
					return { data: res[web.name] };
				},
				column: [
					{ type: 'checkbox', width: 20 },
					{ fid: 'site_dir', title: '加密访问', type: 'text' },
					{ fid: 'name', title: '名称', type: 'text' },
					{
						title: '操作',
						width: 110,
						type: 'group',
						align: 'right',
						group: [
							{
								title: '编辑',
								event: function (row, index, ev, key, that) {
									site.edit.template_Dir(web.id, false, row);
								},
							},
							{
								title: '删除',
								event: function (row, index, ev, key, that) {
									bt.site.delete_dir_guard(web.id, row.name, function (res) {
										if (res.status) that.$delete_table_row(index);
										bt.msg(res);
									});
								},
							},
						],
					},
				],
				tootls: [
					{
						// 按钮组
						type: 'group',
						positon: ['left', 'top'],
						list: [
							{
								title: '添加加密访问',
								active: true,
								event: function (ev) {
									site.edit.template_Dir(web.id, true);
								},
							},
						],
					},
					{
						// 批量操作
						type: 'batch',
						positon: ['left', 'bottom'],
						config: {
							title: '删除',
							url: '/site?action=delete_dir_auth_multiple',
							param: { site_id: web.id },
							paramId: 'name',
							paramName: 'names',
							theadName: '加密访问名称',
							confirmVerify: false, //是否提示验证方式
							refresh: true,
						},
					},
				],
			});
			bt_tools.table({
				el: '#php_dirguard',
				url: '/config?action=get_file_deny',
				param: { website: web.name },
				dataFilter: function (res) {
					return { data: res };
				},
				column: [
					{ fid: 'name', title: '名称', type: 'text' },
					{
						fid: 'dir',
						title: '保护的目录',
						type: 'text',
						template: function (row) {
							return '<span title="' + row.dir + '" style="max-width: 250px;text-overflow: ellipsis;overflow: hidden;display: inline-block;">' + row.dir + '</span>';
						},
					},
					{
						fid: 'suffix',
						title: '规则',
						template: function (row) {
							return '<span title="' + row.suffix + '" style="max-width: 85px;text-overflow: ellipsis;overflow: hidden;display: inline-block;">' + row.suffix + '</span>';
						},
					},
					{
						title: '操作',
						width: 110,
						type: 'group',
						align: 'right',
						group: [
							{
								title: '编辑',
								event: function (row, index, ev, key, that) {
									site.edit.template_php(web.name, row);
								},
							},
							{
								title: '删除',
								event: function (row, index, ev, key, that) {
									bt.site.delete_php_guard(web.name, row.name, function (res) {
										if (res.status) that.$delete_table_row(index);
										bt.msg(res);
									});
								},
							},
						],
					},
				],
				tootls: [
					{
						// 按钮组
						type: 'group',
						positon: ['left', 'top'],
						list: [
							{
								title: '添加禁止访问',
								active: true,
								event: function (ev) {
									site.edit.template_php(web.name);
								},
							},
						],
					},
				],
			});
			var theStatus = 1,
				authentication_table = null;
			function renderAuthentication() {
				$('#authentication').empty();
				authentication_table = bt_tools.table({
					el: '#authentication',
					url: '/plugin?action=a&name=ssl_verify&s=get_ssl_list',
					height: '411',
					beforeRequest: function (params) {
						return { status: theStatus, search: params.search };
					},
					column: [
						{ fid: 'client', title: '使用者', type: 'text' },
						{ fid: 'company', title: '公司名称', type: 'text' },
						{
							title: '到期时间',
							width: 150,
							type: 'text',
							template: function (row, index) {
								var lastTime = get_last_time(row.day, row.last_modify);
								var day = get_remaining_day(lastTime);
								return '<span>' + (row.status == 1 ? bt.format_data(lastTime, 'yyyy-MM-dd') + '(剩余' + day + '天)' : '-') + '</span>';
							},
						},
						{
							title: '状态',
							width: 52,
							type: 'text',
							template: function (row, index) {
								return get_cert_status(row.status);
							},
						},
						{
							title: '操作',
							type: 'group',
							width: 125,
							align: 'right',
							group: [
								{
									title: '续签',
									hide: function (rows) {
										var lastTime = get_last_time(rows.day, rows.last_modify);
										var day = get_remaining_day(lastTime);
										return day > 30 || rows.status != 1;
									},
									event: function (row, index, ev, key, that) {
										var loadT = layer.msg('正在续签证书，请稍侯...', {
											icon: 16,
											time: 0,
											shade: 0.3,
										});
										$.post('/plugin?action=a&name=ssl_verify&s=get_user_cert', { client: row.client }, function (rdata) {
											layer.close(loadT);
											if (rdata.status) {
												authentication_table.$refresh_table_list(true);
											}
											layer.msg(rdata.msg, {
												icon: rdata.status ? 1 : 2,
											});
										});
									},
								},
								{
									title: '下载',
									hide: function (rows) {
										return rows.status != 1;
									},
									event: function (row, index, ev, key, that) {
										var loadT = layer.msg('正在下载证书，请稍侯...', {
											icon: 16,
											time: 0,
											shade: 0.3,
										});
										$.post('/plugin?action=a&name=ssl_verify&s=down_client_pfx', { id: row.id }, function (rdata) {
											layer.close(loadT);
											if (rdata.status) {
												window.open('/download?filename=' + encodeURIComponent(rdata.msg));
											} else {
												layer.msg(rdata.msg, { icon: 2 });
											}
										});
									},
								},
								{
									title: '撤销',
									hide: function (rows) {
										return rows.status != 1;
									},
									event: function (row, index, ev, key, that) {
										layer.confirm(
											'是否撤销当前用户【' + row.client + '】的证书,是否继续？',
											{
												btn: ['确认', '取消'],
												icon: 3,
												closeBtn: 2,
												title: '撤销证书',
											},
											function () {
												var loadT = layer.msg('正在撤销证书，请稍侯...', {
													icon: 16,
													time: 0,
													shade: 0.3,
												});
												$.post('/plugin?action=a&name=ssl_verify&s=revoke_client_cert', { id: row.id }, function (rdata) {
													layer.close(loadT);
													if (rdata.status) {
														authentication_table.$refresh_table_list(true);
													}
													layer.msg(rdata.msg, {
														icon: rdata.status ? 1 : 2,
													});
												});
											}
										);
									},
								},
							],
						},
					],
					tootls: [
						{
							type: 'group',
							positon: ['left', 'top'],
							list: [
								{
									title: '生成证书',
									active: true,
									event: function () {
										layer.open({
											type: 1,
											area: '400px',
											title: '生成证书',
											closeBtn: 2,
											shift: 5,
											shadeClose: false,
											btn: ['提交', '取消'],
											content:
												'\
                      <div class="cert_add_box">\
                          <div class="bt-form" style="padding: 15px 25px;">\
                              <div class="line">\
                                  <span class="tname" style="width: 100px;">使用者</span>\
                                  <div class="info-r">\
                                      <input type="text" name="cert_client" class="bt-input-text mr5" style="width: 240px" value="" placeholder="请输入使用者（如“研发部-张三”）" />\
                                  </div>\
                              </div>\
                          </div>\
                      </div>\
                  ',
											yes: function (index, layers) {
												var client = $('[name=cert_client]').val();
												if (client == '') {
													layer.msg('用户名不能为空', { icon: 2 });
													return false;
												}
												var loadT = layer.msg('正在生成证书，请稍侯...', {
													icon: 16,
													time: 0,
													shade: 0.3,
												});
												$.post('/plugin?action=a&name=ssl_verify&s=get_user_cert', { client: client }, function (rdata) {
													layer.close(loadT);
													if (rdata.status) {
														layer.close(index);
														authentication_table.$refresh_table_list(true);
													}
													layer.msg(rdata.msg, {
														icon: rdata.status ? 1 : 2,
													});
												});
											},
										});
									},
								},
							],
						},
						{
							type: 'search',
							positon: ['right', 'top'],
							placeholder: '请输入用户名',
							width: '150px',
							searchParam: 'search', //搜索请求字段，默认为 search
							value: '', // 当前内容,默认为空
						},
					],
					success: function (that) {
						if (authentication_table) {
							var serachDom = $('.search_input_' + authentication_table.random).parent('.bt_search');
							var btnDom = $('.tootls_top .group_' + authentication_table.random + '_0').parent('.pull-left');
							if ($('.mutual_ssl').length == 0) {
								btnDom.append(
									'<div class="mutual_ssl pull-right" style="margin-left: 30px;"><span style="line-height: 22px;margin-right: 5px;">双向认证开关</span>\
								<div class="mutual-switch" style="display: inline-block;vertical-align: middle;">\
									<input class="btswitch btswitch-ios" id="mutualSwitch" type="checkbox">\
									<label class="btswitch-btn" for="mutualSwitch"></label>\
								</div></div>'
								);
								serachDom.prepend(
									'<div class="related_status" style="display: inline-block;margin-right: 10px;vertical-align: bottom;font-size: 0;"><span style="font-size:12px;vertical-align: middle;margin-right:5px">状态</span> <div class="btn-group">\
										<button type="button" class="btn btn-default btn-sm">\
												<span>全部</span>\
												<input type="checkbox" class="hide" value="0">\
										</button>\
										<button type="button" class="btn btn-default btn-sm">\
												<span>正常</span>\
												<input type="checkbox" class="hide" value="1">\
										</button>\
										<button type="button" class="btn btn-default btn-sm">\
												<span>已撤销</span>\
												<input type="checkbox" class="hide" value="-1">\
										</button>\
								</div></div>'
								);
								$('.related_status button')
									.eq(theStatus == -1 ? 2 : theStatus)
									.addClass('btn-success');
								if (!$('#authentication').find('.config_ssl_info').length) {
									$('#authentication').append(
										'<button type="button" title="证书配置" class="btn btn-default config_ssl_info btn-sm mr5">证书配置</button><ul class="help-info-text c7" style="margin-top: 50px;"><li>双向认证仅支持【HTTPS访问】，如需全站设置，还需通过网站设置开启【强制HTTPS】.</li><li>给网站开启【双向认证】，开启后用户需要将【证书】导入到浏览器后才能访问该网站（目前支持Nginx/Apache）</li></ul>'
									);
								}
								$('.config_ssl_info')
									.unbind('click')
									.click(function () {
										$.post('/plugin?action=a&name=ssl_verify&s=get_config', {}, function (rdata) {
											config_ssl_info(rdata);
										});
									});

								// 客户端证书列表搜索
								$('.related_status button').click(function () {
									var _class = 'btn-success';
									if ($(this).hasClass(_class)) return;
									$(this).addClass(_class).siblings().removeClass(_class);
									theStatus = $(this).find('input').val();
									authentication_table.$refresh_table_list(true);
								});
								getMutualStatus(function (str) {
									$('#mutualSwitch').prop('checked', str); //开关状态
								});
								$('[for=mutualSwitch]').click(function () {
									var _status = $('#mutualSwitch').prop('checked');
									var loadT = layer.msg('正在设置双向认证状态，请稍侯...', {
										icon: 16,
										time: 0,
										shade: 0.3,
									});
									$.post(
										'/plugin?action=a&name=ssl_verify&s=set_ssl_verify',
										{
											siteName: web.name,
											status: _status ? 0 : 1,
										},
										function (rdata) {
											layer.close(loadT);
											if (!rdata.status) $('#mutualSwitch').prop('checked', _status);
											layer.msg(rdata.msg, {
												icon: rdata.status ? 1 : 2,
											});
										}
									);
								});
								//判断是否配置证书
								$.post('/plugin?action=a&name=ssl_verify&s=get_config', {}, function (rdata) {
									if (rdata.length == 0) {
										layer.msg('请先完善配置', { time: 700, icon: 2 }, function () {
											config_ssl_info(rdata);
										});
									}
								});
							}
						}
					},
				});
				/**
				 * 生成证书状态
				 * @param {*} status 状态值
				 */
				function get_cert_status(status) {
					if (status == 1) {
						return '<span>正常</span>';
					}
					if (status == -1) {
						return '<span class="error">已撤销</span>';
					}
					return '<span>未知</span>';
				}
				/**
				 * 获取证书到期的时间戳
				 * @param {*} day 证书可用天数
				 * @param {*} lastModify 生成证书的时间戳
				 */
				function get_last_time(day, lastModify) {
					day = day || 0;
					day = day * 24 * 60 * 60;
					lastModify = lastModify || 0;
					return day + lastModify;
				}
				/**
				 * 获取证书的剩余天数
				 * @param {*} lastTime 到期时间戳
				 */
				function get_remaining_day(lastTime) {
					var date = new Date();
					var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
					var todayTime = today.getTime() / 1000;
					var day = (lastTime - todayTime) / 60 / 60 / 24;
					return Math.floor(day);
				}
				function config_ssl_info(info) {
					var param = { company: '', domain: '' };
					if (info && info.length > 0) param = info[0];
					layer.open({
						type: 1,
						area: ['520px', '290px'],
						title: '证书配置',
						closeBtn: 2,
						shift: 5,
						shadeClose: false,
						btn: ['保存', '取消'],
						content:
							'\
                <div class="cert_add_box">\
                    <div class="bt-form" style="padding: 15px 25px;">\
                        <div class="line">\
                            <span class="tname" style="width: 100px;">公司名称</span>\
                            <div class="info-r">\
                                <input type="text" name="config_client" class="bt-input-text mr5" style="width: 340px" value="' +
							param.company +
							'" placeholder="请输入公司名称" />\
                            </div>\
                        </div>\
                        <div class="line">\
                          <span class="tname">域名列表</span>\
                          <div class="info-r">\
                              <textarea class="bt-input-text newdomain" name="config_domain" style="width: 340px;height: 100px;line-height: 22px;">' +
							param.domain +
							'</textarea>\
                              <div class="placeholder c9" style="display: ' +
							(param.domain ? 'none' : 'block') +
							';top:15px;left:15px;">请输入域名列表<br>多个域名可以用英文状态下的逗号隔开</div>\
                          </div>\
                      </div>\
                    </div>\
                </div>',
						success: function () {
							// 文本域选中
							$('[name=config_domain]')
								.focus(function () {
									$('.placeholder').hide();
								})
								.blur(function () {
									if ($(this).val().length == 0) $('.placeholder').show();
								});
							// 文本域描述点击
							$('.cert_add_box .placeholder').click(function (e) {
								$(this).hide();
								$(this).siblings('textarea').focus();
							});
						},
						yes: function (index, layers) {
							var client = $('[name=config_client]').val();
							var domain = $('[name=config_domain]').val();
							if (client == '') {
								layer.msg('公司名称不能为空', { icon: 2 });
								return false;
							}
							if (domain == '') {
								layer.msg('域名列表不能为空', { icon: 2 });
								return false;
							}
							var loadT = layer.msg('正在保存配置，请稍侯...', {
								icon: 16,
								time: 0,
								shade: 0.3,
							});
							$.post('/plugin?action=a&name=ssl_verify&s=set_config', { company: client, domain: domain }, function (rdata) {
								layer.close(loadT);
								if (rdata.status) {
									layer.close(index);
								}
								layer.msg(rdata.msg, {
									icon: rdata.status ? 1 : 2,
								});
							});
						},
					});
				}
				/**
				 * @descripttion: 请求双向认证状态
				 */
				function getMutualStatus(callback) {
					var loadT = layer.msg('正在双向认证状态，请稍侯...', {
						icon: 16,
						time: 0,
						shade: 0.3,
					});
					$.get('/plugin?action=a&name=ssl_verify&s=get_site_list', function (res) {
						layer.close(loadT);
						$.each(res, function (index, item) {
							if (item.name === web.name) {
								if (callback) callback(item.ssl_verify);
							}
						});
					});
				}
			}
			$('#dir_dirguard>.divtable,#php_dirguard>.divtable').css('max-height', '405px');
			$('#dir_dirguard').append(
				"<ul class='help-info-text c7'>\
                <li>目录设置加密访问后，访问时需要输入账号密码才能访问</li>\
                <li>例如我设置了加密访问 /test/ ,那我访问 http://aaa.com/test/ 是就要输入账号密码才能访问</li>\
            </ul>"
			);
			$('#php_dirguard').append(
				"<ul class='help-info-text c7'>\
                <li>后缀：禁止访问的文件后缀</li>\
                <li>目录：规则会在这个目录内生效</li>\
            </ul>"
			);
			$('#set_dirguard').on('click', '.tab-nav span', function () {
				var index = $(this).index();
				$(this).addClass('on').siblings().removeClass('on');
				$('.tabs_content .tabpanel').eq(index).removeAttr('style').siblings().attr('style', 'display:none');
				if (index == 2) {
					var _isInstall = site.edit.render_recommend_product();
					if (_isInstall) {
						renderAuthentication();
					}
				} else {
					$('.thumbnail-introduce-new.recommend').remove();
				}
			});
		},
		ols_cache: function (web) {
			bt.send('get_ols_static_cache', 'config/get_ols_static_cache', { id: web.id }, function (rdata) {
				var clicks = [],
					newkey = [],
					newval = [],
					checked = false;
				Object.keys(rdata).forEach(function (key) {
					//for (let key in rdata) {
					newkey.push(key);
					newval.push(rdata[key]);
				});
				var datas = [
						{ title: newkey[0], name: newkey[0], width: '30%', value: newval[0] },
						{ title: newkey[1], name: newkey[1], width: '30%', value: newval[1] },
						{ title: newkey[2], name: newkey[2], width: '30%', value: newval[2] },
						{ title: newkey[3], name: newkey[3], width: '30%', value: newval[3] },
						{
							name: 'static_save',
							text: '保存',
							type: 'button',
							callback: function (ldata) {
								var cdata = {},
									loadT = bt.load();
								Object.assign(cdata, ldata);
								delete cdata.static_save;
								delete cdata.maxage;
								delete cdata.exclude_file;
								delete cdata.private_save;
								bt.send('set_ols_static_cache', 'config/set_ols_static_cache', { values: JSON.stringify(cdata), id: web.id }, function (res) {
									loadT.close();
									bt.msg(res);
								});
							},
						},
						{ title: 'test', name: 'test', width: '30%', value: '11' },
						{ title: '缓存时间', name: 'maxage', width: '30%', value: '43200' },
						{ title: '排除文件', name: 'exclude_file', width: '35%', value: 'fdas.php' },
						{
							name: 'private_save',
							text: '保存',
							type: 'button',
							callback: function (ldata) {
								var edata = {},
									loadT = bt.load();
								if (checked) {
									edata.id = web.id;
									edata.max_age = parseInt($("input[name='maxage']").val());
									edata.exclude_file = $("textarea[name='exclude_file']").val();
									bt.send('set_ols_private_cache', 'config/set_ols_private_cache', edata, function (res) {
										loadT.close();
										bt.msg(res);
									});
								}
							},
						},
					],
					_html = $('<div class="ols"></div>');
				for (var i = 0; i < datas.length; i++) {
					var _form_data = bt.render_form_line(datas[i]);
					_html.append(_form_data.html);
					clicks = clicks.concat(_form_data.clicks);
				}
				$('#webedit-con').append(_html);
				$("input[name='exclude_file']").parent().removeAttr('class').html('<textarea name="exclude_file" class="bt-input-text mr5 exclude_file" style="width:35%;height: 130px;"></textarea>');
				$("input[name='test']")
					.parent()
					.parent()
					.html(
						'<div style="padding-left: 29px;border-top: #ccc 1px dashed;margin-top: -7px;"><em style="float: left;color: #555;font-style: normal;line-height: 32px;padding-right: 2px;">私有缓存</em><div style="margin-left: 70px;padding-top: 5px;"><input class="btswitch btswitch-ios" id="ols" type="checkbox"><label class="btswitch-btn" for="ols"></label></div></div>'
					);
				var privateInput = $("input[name='maxage'],textarea[name='exclude_file'],button[name='private_save']").parent().parent();
				$('input.bt-input-text').parent().append('<span>秒</span>');
				$("button[name='static_save']")
					.parent()
					.append(bt.render_help(['默认的静态文件缓存时间是604800秒', '如果要关闭，请将其更改为0秒']));
				$('.ols').append(bt.render_help(['私有缓存只支持PHP页面缓存，默认缓存时间为120秒', '排除文件仅支持以PHP为后缀的文件']));
				privateInput.hide();
				var loadT = bt.load();
				bt.send('get_ols_private_cache_status', 'config/get_ols_private_cache_status', { id: web.id }, function (kdata) {
					loadT.close();
					checked = kdata;
					if (kdata) {
						bt.send('get_ols_private_cache', 'config/get_ols_private_cache', { id: web.id }, function (fdata) {
							$("input[name='maxage']").val(fdata.maxage);
							var ss = fdata.exclude_file.join('&#13;');
							$("textarea[name='exclude_file']").html(ss);
							$('#ols').attr('checked', true);
							privateInput.show();
						});
					}
				});
				$('#ols').on('click', function () {
					var loadS = bt.load();
					bt.send('switch_ols_private_cache', 'config/switch_ols_private_cache', { id: web.id }, function (res) {
						loadS.close();
						privateInput.toggle();
						checked = privateInput.is(':hidden') ? false : true;
						bt.msg(res);
						if (checked) {
							bt.send('get_ols_private_cache', 'config/get_ols_private_cache', { id: web.id }, function (fdata) {
								privateInput.show();
								$("input[name='maxage']").val(fdata.maxage);
								$("textarea[name='exclude_file']").html(fdata.exclude_file.join('&#13;'));
							});
						}
					});
				});
				bt.render_clicks(clicks);
				$("button[name='private_save']").parent().css('margin-bottom', '-13px');
				$('.ss-text').css('margin-left', '66px');
				$('.ols .btn-success').css('margin-left', '100px');
			});
		},
		limit_network: function (web) {
			bt.site.get_limitnet(web.id, function (rdata) {
				if (!rdata.limit_rate && !rdata.perip && !rdata.perserver) rdata.value = 1;
				var limits = [
					{ title: '论坛/博客', value: 1, items: { perserver: 300, perip: 25, limit_rate: 512 } },
					{ title: '图片站', value: 2, items: { perserver: 200, perip: 10, limit_rate: 1024 } },
					{ title: '下载站', value: 3, items: { perserver: 50, perip: 3, limit_rate: 2048 } },
					{ title: '商城', value: 4, items: { perserver: 500, perip: 10, limit_rate: 2048 } },
					{ title: '门户', value: 5, items: { perserver: 400, perip: 15, limit_rate: 1024 } },
					{ title: '企业', value: 6, items: { perserver: 60, perip: 10, limit_rate: 512 } },
					{ title: '视频', value: 7, items: { perserver: 150, perip: 4, limit_rate: 1024 } },
					{ title: '自定义', value: 0, items: { perserver: '', perip: '', limit_rate: '' } },
				];
				var datas = [
					{
						items: [
							{
								name: 'statusflow',
								type: 'checkbox',
								value: rdata.perserver != 0 ? true : false,
								text: '启用流量控制',
								callback: function (ldata) {
									if (ldata.statusflow) {
										if (!$('input[name=perip]').val() && !$('input[name=limit_rate]').val() && !$('input[name=perserver]').val()) {
											layer.msg('您的输入为空，请重新填写', { icon: 2 });
											$('#status').prop('checked', rdata.perserver != 0 ? true : false);
											return;
										}
										bt.site.set_limitnet(web.id, ldata.perserver, ldata.perip, ldata.limit_rate, function (ret) {
											layer.msg(ret.msg, { icon: ret.status ? 1 : 2 });
											site.reload(4);
										});
									} else {
										bt.site.close_limitnet(web.id, function (ret) {
											layer.msg(ret.msg, { icon: ret.status ? 1 : 2 });
											if (ret.status) site.reload(4);
										});
									}
								},
							},
						],
					},
					{
						items: [
							{
								title: '限制方案  ',
								width: '200px',
								name: 'limit',
								type: 'select',
								value: rdata.value,
								items: limits,
								callback: function (obj) {
									var data = limits.filter(function (p) {
										return p.value === parseInt(obj.val());
									})[0];
									for (var key in data.items) {
										$('input[name="' + key + '"]').val(data.items[key]);
									}
								},
							},
						],
					},
					{ items: [{ title: '并发限制   ', type: 'number', width: '200px', value: rdata.perserver, name: 'perserver', unit: '<span style="margin-left: 5px;">* 限制当前站点最大并发数</span>' }] },
					{ items: [{ title: '单IP限制   ', type: 'number', width: '200px', value: rdata.perip, name: 'perip', unit: '<span style="margin-left: 5px;">* 限制单个IP访问最大并发数</span>' }] },
					{
						items: [
							{
								title: '流量限制   ',
								type: 'number',
								width: '200px',
								value: rdata.limit_rate,
								name: 'limit_rate',
								unit: '<span style="margin-left: 5px;">* 限制每个请求的流量上限（单位：KB）</span>',
							},
						],
					},
					{
						name: 'btn_limit_get',
						text: rdata.perserver != 0 ? '保存' : '保存并启用',
						type: 'button',
						callback: function (ldata) {
							if (ldata.perserver <= 0 || ldata.perip <= 0 || ldata.limit_rate <= 0) {
								return layer.msg('并发限制，IP限制，流量限制必需大于0且不为空值！', { icon: 2 });
							}
							bt.site.set_limitnet(web.id, ldata.perserver, ldata.perip, ldata.limit_rate, function (ret) {
								layer.msg(ret.msg, { icon: ret.status ? 1 : 2 });
								if (ret.status) site.reload(4);
							});
						},
					},
				];
				var _html = $("<div class='webedit-box soft-man-con'></div>");
				var clicks = [];
				for (var i = 0; i < datas.length; i++) {
					var _form_data = bt.render_form_line(datas[i]);
					_html.append(_form_data.html);
					clicks = clicks.concat(_form_data.clicks);
				}
				_html.find('input[type="checkbox"]').parent().addClass('label-input-group ptb10');
				// _html.append(bt.render_help(['限制当前站点最大并发数', '限制单个IP访问最大并发数', '限制每个请求的流量上限（单位：KB）']));
				$('#webedit-con').append(_html);
				bt.render_clicks(clicks);
				if (rdata.perserver == 0) $("select[name='limit']").trigger('change');
				$('.soft-man-con').on('keyup', '.perserver, .perip, .limit_rate', function () {
					var val = $(this).val();
					if (val == '') return;
					// 判断不是正整数
					if (!/(^[1-9]\d*$)/.test(val)) {
						$(this).val(Math.floor(val));
					}
				});
				$('select[name=limit]').attr('autocomplete', 'off');

				var timer = 0;
				$('input[name=perip],input[name=perserver],input[name=limit_rate]').change(function () {
					clearTimeout(timer);
					timer = setTimeout(function () {
						var limit_perserver_val = $('input[name=perserver]').val();
						var limit_perip_val = $('input[name=perip]').val();
						var limit_rate_val = $('input[name=limit_rate]').val();
						for (var i = 0; i < limits.length; i++) {
							var limit_item = limits[i].items;
							var flag_1 = limit_perserver_val == limit_item.perserver && limit_perip_val == limit_item.perip && limit_rate_val == limit_item.limit_rate;
							$('select[name=limit]').children().prop('selected', false);
							if (flag_1) {
								$('select[name=limit]')
									.find('option[value=' + limits[i].value + ']')
									.prop('selected', true);
								break;
							} else {
								$('select[name=limit]').find('option[value=0]').prop('selected', true);
							}
						}
					}, 500);
				});
			});
		},
		get_rewrite_list: function (web, callback) {
			var filename = '/www/server/panel/vhost/rewrite/' + web.name + '.conf';

			bt.site.get_rewrite_list(web.name, function (rdata) {
				if (typeof rdata != 'object') return;
				var arrs = [],
					webserver = bt.get_cookie('serverType');
				if (bt.get_cookie('serverType') == 'apache') filename = rdata.sitePath + '/.htaccess';
				if (webserver == 'apache' || webserver == 'openlitespeed') filename = rdata.sitePath + '/.htaccess';
				if (webserver == 'openlitespeed') webserver = 'apache';
				for (var i = 0; i < rdata.rewrite.length; i++) arrs.push({ title: rdata.rewrite[i], value: rdata.rewrite[i] });
				var datas = [
					{
						name: 'rewrite',
						type: 'select',
						width: '130px',
						items: arrs,
						callback: function (obj) {
							if (bt.os == 'Linux') {
								var spath = filename;
								if (obj.val() != lan.site.rewritename) spath = '/www/server/panel/rewrite/' + (webserver == 'openlitespeed' ? 'apache' : webserver) + '/' + obj.val() + '.conf';
								bt.files.get_file_body(spath, function (ret) {
									aceEditor.ACE.setValue(ret.data);
									aceEditor.ACE.moveCursorTo(0, 0);
									aceEditor.path = spath;
								});
							}
						},
					},
					{ items: [{ name: 'config', type: 'div', value: rdata.data, widht: '340px', height: '200px' }] },
					{
						items: [
							{
								name: 'btn_save',
								text: '保存',
								type: 'button',
								callback: function (ldata) {
									// bt.files.set_file_body(filename, editor.getValue(), 'utf-8', function (ret) {
									//     if (ret.status) site.reload(4)
									//     bt.msg(ret);
									// })
									aceEditor.path = filename;
									bt.saveEditor(aceEditor);
								},
							},
							{
								name: 'btn_save_to',
								text: '另存为模板',
								type: 'button',
								callback: function (ldata) {
									var temps = {
										title: lan.site.save_rewrite_temp,
										area: '330px',
										list: [{ title: '模板名称', placeholder: '模板名称', width: '160px', name: 'tempname' }],
										btns: [
											{ title: '关闭', name: 'close' },
											{
												title: '提交',
												name: 'submit',
												css: 'btn-success',
												callback: function (rdata, load, callback) {
													var name = rdata.tempname;
													if (name === '') return layer.msg('模板名称不能为空！', { icon: 2 });
													var isSameName = false;
													for (var i = 0; i < arrs.length; i++) {
														if (arrs[i].value == name) {
															isSameName = true;
															break;
														}
													}
													var save_to = function () {
														bt.site.set_rewrite_tel(name, aceEditor.ACE.getValue(), function (rRet) {
															if (rRet.status) {
																load.close();
																site.reload(4);
															}
															bt.msg(rRet);
														});
													};
													if (isSameName) {
														return layer.msg('模板名称已存在，请重新输入模板名称!');
														bt.confirm(
															{
																icon: 0,
																title: '提示',
																msg: '【' + name + '】已存在，是否要替换？',
															},
															function () {
																save_to();
															}
														);
													} else {
														save_to();
													}
												},
											},
										],
									};
									bt.render_form(temps);
								},
							},
						],
					},
				];

				var _html = $("<div class='webedit-box soft-man-con'></div>");
				var clicks = [];
				for (var i = 0; i < datas.length; i++) {
					var _form_data = bt.render_form_line(datas[i]);
					_html.append(_form_data.html);
					var _other = bt.os == 'Linux' && i == 0 ? '<span class="ruleConversion">规则转换工具：<a href="https://www.bt.cn/Tools" target="_blank" style="color:#20a53a">Apache转Nginx</a></span>' : '';
					_html.find('.info-r').append(_other);
					_html.find('.ruleConversion').parent().css({
						width: '540px',
						display: 'inline-flex',
						'align-items': 'center',
						'justify-content': 'space-between',
					});
					clicks = clicks.concat(_form_data.clicks);
				}
				_html.append(bt.render_help(['请选择您的应用，若设置伪静态后，网站无法正常访问，请尝试设置回default', '您可以对伪静态规则进行修改，修改完后保存即可。']));
				$('#webedit-con').append(_html);
				bt.render_clicks(clicks);
				$('div.config').attr('id', 'config_rewrite').css({ height: '360px', width: '540px' });
				var aceEditor = bt.aceEditor({ el: 'config_rewrite', content: rdata.data });
				$('select.rewrite').trigger('change');
				if (callback) callback(rdata);
			});
		},
		set_default_index: function (web) {
			bt.site.get_index(web.id, function (rdata) {
				if (typeof rdata == 'object' && rdata.status === false) {
					bt.msg(rdata);
					return;
				}
				rdata = rdata.replace(new RegExp(/(,)/g), '\n');
				var data = {
					items: [
						{ name: 'Dindex', height: '230px', width: '50%', type: 'textarea', value: rdata },
						{
							name: 'btn_submit',
							text: '添加',
							type: 'button',
							callback: function (ddata) {
								var Dindex = ddata.Dindex.replace(new RegExp(/(\n)/g), ',');
								bt.site.set_index(web.id, Dindex, function (ret) {
									if (!ret.status) {
										bt.msg(ret);
										return;
									}
									bt_tools.msg(ret);

									site.reload(5);
								});
							},
						},
					],
				};
				var _form_data = bt.render_form_line(data);
				var _html = $(_form_data.html);
				_html.append(bt.render_help([lan.site.default_doc_help]));
				$('#webedit-con').append(_html);
				$('.btn_submit').addClass('pull-right').css('margin', '90px 100px 0 0');
				bt.render_clicks(_form_data.clicks);
			});
		},
		set_config: function (web) {
			var con =
				'<p style="color: #666; margin-bottom: 7px">提示：Ctrl+F 搜索关键字，Ctrl+S 保存，Ctrl+H 查找替换</p><div class="bt-input-text ace_config_editor_scroll" style="height:560px; line-height:18px;" id="siteConfigBody"></div>\
				<button id="OnlineEditFileBtn" class="btn btn-success btn-sm" style="margin-top:10px;">保存</button>\
				<ul class="c7 ptb15">\
					<li>此处为站点主配置文件,若您不了解配置规则,请勿随意修改.</li>\
				</ul>';
			$('#webedit-con').html(con);
			var webserve = bt.get_cookie('serverType'),
				config = bt.aceEditor({ el: 'siteConfigBody', path: '/www/server/panel/vhost/' + (webserve == 'openlitespeed' ? webserve + '/detail' : webserve) + '/' + web.name + '.conf' });
			setTimeout(function () {
				$('.ace_scrollbar-h').hide();
			}, 200);
			$('#OnlineEditFileBtn').click(function (e) {
				bt.saveEditor(config);
			});
		},
		set_php_version: function (web) {
			bt.site.get_site_phpversion(web.name, function (sdata) {
				if (sdata.status === false) {
					bt.msg(sdata);
					return;
				}
				bt.site.get_all_phpversion(function (vdata) {
					var versions = [],
						point = '';
					for (var j = vdata.length - 1; j >= 0; j--) {
						var o = vdata[j];
						o.value = o.version;
						o.title = o.name;
						versions.push(o);
					}
					var is_install = versions.filter(function (a) {
						return a.value === sdata.phpversion;
					}).length
						? true
						: false;
					if (!is_install) {
						versions.push({ title: 'PHP-' + sdata.phpversion + '(未安装)', value: sdata.phpversion });
						point = sdata.phpversion.slice(0, sdata.phpversion.length - 1) + '.' + sdata.phpversion.slice(-1);
					}
					var data = {
						items: [
							{
								title: 'PHP版本',
								name: 'versions',
								value: sdata.phpversion,
								type: 'select',
								width: '120px',
								items: versions,
								ps:
									'<input class="bt-input-text other-version" style="margin-right: 10px;width:300px;color: #000;" type="text" value="' +
									sdata.php_other +
									'" placeholder="连接配置，如：1.1.1.1:9001或unix:/tmp/php.sock" />',
							},
							{
								text: '切换',
								name: 'btn_change_phpversion',
								type: 'button',
								// ps: '<span class="current_php">当前版本：<a class="btlink">'+ (sdata.phpversion === 'other' ? '自定义' : sdata.phpversion === '00' ? '静态' : 'PHP-'+ sdata.phpversion) +'</a></span>',
								callback: function (pdata) {
									var interval_php = null;
									if (!is_install && pdata.versions === sdata.phpversion) {
										bt.soft.install('php-' + point);
										interval_php = setInterval(function () {
											if (!$('.memu #memuAsite').hasClass('current')) {
												clearInterval(interval_php);
												return;
											}
											bt.send('GetPHPVersion', 'site/GetPHPVersion', {}, function (rdata) {
												if (
													rdata.some(function (item) {
														return parseInt(item.version) === parseInt(name * 10);
													})
												) {
													clearInterval(interval_php);
													site.reload(9);
												}
											});
										}, 3000);
										return;
									}
									var other = $('.other-version').val();
									if (pdata.versions == 'other' && other == '') {
										layer.msg('自定义PHP版本时，PHP连接配置不能为空', { icon: 2 });
										$('.other-version').focus();
										return;
									}
									bt.site.set_phpversion(web.name, pdata.versions, other, function (ret) {
										if (typeof ret === 'string') {
											layer.msg(ret, { icon: 2 });
											return;
										}
										if (ret.status) {
											var versions = $('[name="versions"]').val();
											versions = versions.slice(0, versions.length - 1) + '.' + versions.slice(-1);
											if (versions == '0.0') versions = '静态';
											site.php_table_view();
											site.reload();
											setTimeout(function () {
												bt.msg(ret);
											}, 1000);
										} else {
											bt.msg(ret);
										}
									});
								},
							},
						],
					};
					var _form_data = bt.render_form_line(data);
					var _html = $(_form_data.html);
					_html.append(
						bt.render_help([
							'请根据您的程序需求选择版本',
							'若非必要,请尽量不要使用PHP5.2,这会降低您的服务器安全性；',
							'PHP7不支持mysql扩展，默认安装mysqli以及mysql-pdo。',
							'【自定义】可自定义PHP连接信息，选择此项需填写可用的PHP连接配置',
							'【自定义】当前仅支持nginx，可配合[宝塔负载均衡 - 重构版]插件的TCP负载功能实现PHP负载集群',
							'【PHP连接配置】支持TCP或Unix配置，示例：192.168.1.25:9001 或 unix:/tmp/php8.sock',
						])
					);
					$('#webedit-con').append(_html);
					bt.render_clicks(_form_data.clicks);
					if (sdata.phpversion != 'other') {
						$('#webedit-con').append(
							'<div class="user_pw_tit" style="margin-top: 22px;padding-top: 28px;border-top: #ccc 1px dashed;"><span class="tit">session隔离</span><span class="btswitch-p" style="display: inline-block;vertical-align: middle;"><input class="btswitch btswitch-ios" id="session_switch" type="checkbox"><label class="btswitch-btn session-btn" for="session_switch" ></label></span></div><div class="user_pw" style="margin-top: 10px; display: block;"></div>' +
								bt.render_help(['开启后将会把session文件存放到独立文件夹，不与其他站点公用存储位置', '若您在PHP配置中将session保存到memcache/redis等缓存器时，请不要开启此选项'])
						);
					}
					var version_data = sdata.phpversion !== '52' && sdata.phpversion !== '82' && sdata.phpversion !== '00';
					var padding_num = version_data && is_install ? '28' : '50';
					$('#webedit-con').append(
						'<div class="user_pw_tit php-pro-box" style="position: relative;margin-top: 22px;padding-top: ' +
							padding_num +
							'px;border-top: #ccc 1px dashed;">\
            <div class="flex align-center sn-home-cont">\
              <div class="inlineBlock" style="line-height: 32px;">\
                <span style="vertical-align: middle;"><span class="glyphicon icon-vipLtd" style="margin-right: 4px;margin-left: 0;"></span>站点防护</span>\
                <div class="phppro-switch ml5" style="float: inherit;display: inline-block;vertical-align: middle;">\
                  <input class="btswitch btswitch-ios" id="isPhpproSwitch" type="checkbox">\
                  <label class="btswitch-btn isPhpproSwitch" for="isPhpproSwitch" style="margin: 0;"></label>\
                </div>\
              </div>\
              <div class="flex align-center php-num-css">\
                <div class="today-num">今日：<span>0</span></div>\
                <div class="all-num">总告警数：<span>0</span></div>\
              </div>\
            </div>\
            <div class="php-pro-btn">\
              <button type="button" name="edit_file_monitor" class="btn btn-default btn-sm mr5 edit_file_monitor">监视器</button>\
              <button type="button" name="get_domain_logs" class="btn btn-default btn-sm ml5 get_domain_logs">触发日志</button>\
            </div>' +
							bt.render_help([
								'基于PHP内核的监控工具，实时监控网站木马、漏洞等其他入侵行为，发现木马支持自动隔离',
								'安全告警默认会监视当前网站访问非当前网站文件的行为(例：你的站点A.com访问了站点B.com的文件或者目录)，通过添加监视器路径，当路径被访问时发送告警',
							]) +
							'</div>'
					);
					//判断不兼容版本
					if (sdata.phpversion !== '52' && sdata.phpversion !== '82' && sdata.phpversion !== '00') {
						//判断是否安装插件PHP网站安全告警
						bt.soft.get_soft_find('security_notice', function (rdata_res) {
							//未安装插件/未购买提示 提示
							if (!rdata_res.setup || rdata_res.endtime < 0) {
								$('#isPhpproSwitch').attr('disabled', true);
								if (rdata_res.endtime >= 0) {
									$('#webedit-con .php-pro-box').append(
										'<div class="mask_layer">\
                  <div class="prompt_description"><i class="prompt-note">!</i>当前未安装【PHP网站安全告警】<a href="javascript:;" class="btlink" onclick="bt.soft.install('+'\'security_notice\''+',this)">点击安装</a></div>\
                </div>'
									);
									return;
								} else {
									$('#webedit-con .php-pro-box').append(
										'<div class="mask_layer">\
											 <div class="sn-home--open-condition" style="margin-top: 10px;margin-left: 0;height:32px;line-height:32px">\
												 <i class="sn-home--important-note">!</i>\
												 当前未购买【PHP网站安全告警】<a href="javascript:;" class="btlink buy_plugin" >点击购买</a>\
											 </div>\
										 </div>'
									);
									$('#webedit-con .php-pro-box .buy_plugin').click(function () {
										bt.soft.product_pay_view({
											name: rdata_res.title,
											pid: rdata_res.pid,
											type: rdata_res.type,
											plugin: true,
											renew: rdata_res.endtime,
											ps: rdata_res.ps,
											ex1: rdata_res.ex1,
											totalNum: 114,
										});
									});
									$('#webedit-con .user_pw_tit').css('padding-top', '50px');
									return;
								}
								$('#webedit-con .php-pro-box').click(function () {
									if (rdata_res.endtime < 0) {
										bt.soft.product_pay_view({
											name: rdata_res.title,
											pid: rdata_res.pid,
											type: rdata_res.type,
											plugin: true,
											renew: rdata_res.endtime,
											ps: rdata_res.ps,
											ex1: rdata_res.ex1,
											totalNum: 114,
										});
										$('#isPhpproSwitch').attr('disabled', true);
										return;
									} else {
										bt.soft.install('security_notice', this);
										$('#isPhpproSwitch').attr('disabled', true);
										return;
									}
								});
								$('#isPhpproSwitch').attr('disabled', false);
							}
							if (rdata_res.setup && is_install) {
								//获取全局防护状态
								bt_tools.send(
									{ url: '/plugin?action=a&name=security_notice&s=get_status', data: {} },
									function (global_config) {
										bt_tools.send(
											{ url: '/plugin?action=a&name=security_notice&s=get_index', data: {} },
											function (index_res) {
												var php_versions = index_res.php_versions
													? index_res.php_versions.filter(function (a) {
															return a.v === sdata.phpversion;
													  })
													: [];
												if ((php_versions.length > 0 && php_versions[0].state !== 1) || !global_config.send) {
													$('.sn-home--open-condition').remove();
													$('.sn-home-cont').append(
														'<div class="sn-home--open-condition"><i class="sn-home--important-note">!</i>未启用PHP安全告警，请先' +
															(!global_config.send ? '<span class="set_send">设置告警</span>' : '') +
															(php_versions.length > 0 && php_versions[0].state !== 1 && !global_config.send ? '和' : '') +
															(php_versions.length > 0 && php_versions[0].state !== 1
																? '开启<span class="php_status" data-version="' + sdata.phpversion + '">PHP-' + sdata.phpversion + '防护</span>'
																: '') +
															'</div>'
													);
												}
												bt_tools.send(
													{ url: '/plugin?action=a&name=security_notice&s=get_sites', data: {} },
													function (site_res) {
														var site_filter = site_res.sites
															? site_res.sites.filter(function (a) {
																	return a.path === web.path && a.site_name === web.name;
															  })
															: [];
														if (site_filter.length > 0) {
															var site_data = site_filter[0];
															$('.today-num span')
																.text(site_data.total.day_total)
																.addClass(site_data.total.day_total > 0 ? 'color-red' : ''); //今日
															$('.all-num span')
																.text(site_data.total.total)
																.addClass(site_data.total.day_total > 0 ? 'color-red' : ''); //总告警数
															$('#isPhpproSwitch').prop('checked', site_data.open); //站点防护
															$('.php-pro-box .sn-home--open-condition .php_status').click(function () {
																var _version = $(this).data('version');
																bt.simple_confirm(
																	{
																		title: '开启【PHP-' + _version + '】防护',
																		msg: '开启后，该版本下的所有站点将受到安全防护，是否继续？',
																	},
																	function () {
																		var loadT = bt.load('正在开启PHP-' + _version + '防护，请稍后...');
																		bt_tools.send(
																			{ url: '/plugin?action=a&name=security_notice&s=set_php_status', data: { php_version: _version, enable: 1 } },
																			function (rdata) {
																				loadT.close();
																				if (rdata.status) {
																					site.reload();
																				}
																				bt_tools.msg(rdata);
																			},
																			{ verify: false }
																		);
																	}
																);
															});
															$('.set_send').on('click', function () {
																bt.open({
																	type: 1,
																	area: '400px',
																	title: '设置告警',
																	closeBtn: 2,
																	shift: 5,
																	shadeClose: false,
																	btn: ['确定', '取消'],
																	content:
																		'<div class="php_set_send"><div class="sn-alarm--setting flex align-center">\
                                        <span style="padding-right: 20px;line-height: 34px;">通知方式</span>\
                                        <div class="sn-alarm--selectBox"></div>\
                                        </div>\
                                      </div>',
																	success: function () {
																		var sendChannel = [
																			{ name: '邮件', value: 'mail' },
																			{ name: '微信公众号', value: 'wx_account' },
																			{ name: '企业微信', value: 'weixin' },
																			{ name: '钉钉', value: 'dingding' },
																			{ name: '飞书', value: 'feishu' },
																		];
																		// 获取告警列表
																		bt_tools.send(
																			{
																				url: '/config?action=get_msg_configs',
																			},
																			function (alarms) {
																				var loadT = bt_tools.load('正在加载告警配置，请稍候...');
																				bt_tools.send(
																					{ url: '/plugin?action=a&name=security_notice&s=get_send_config', data: {} },
																					function (rdata) {
																						loadT.close();
																						var html = '',
																							alarmType = -1,
																							accountConfigStatus = false,
																							flag = true;
																						for (var i = 0; i < sendChannel.length; i++) {
																							if (rdata.msg == sendChannel[i].value) alarmType = i;
																							if (sendChannel[i].value === 'wx_account') {
																								if (
																									!$.isEmptyObject(alarms[sendChannel[i].value]['data']) &&
																									alarms[sendChannel[i].value]['data'].res.is_subscribe &&
																									alarms[sendChannel[i].value]['data'].res.is_bound
																								) {
																									accountConfigStatus = true;
																								}
																							}
																							var is_config =
																								sendChannel[i].value !== 'NONE' && (!alarms[sendChannel[i].value]['setup'] || $.isEmptyObject(alarms[sendChannel[i].value]['data'])) ? true : false;
																							html +=
																								'<li class="sn-alarm--item ' +
																								(sendChannel[i].value == rdata.msg && !is_config ? ' active' : '') +
																								(is_config ? ' disabled' : '') +
																								'" name="' +
																								sendChannel[i].value +
																								'">' +
																								sendChannel[i].name +
																								(is_config ? ' [<a target="_blank" class="bterror installNotice" data-type="' + sendChannel[i].value + '">未配置</a>]' : '') +
																								'</li>';
																							flag = sendChannel[i].value == rdata.msg && is_config ? false : true;
																						}
																						var send_html =
																							'<div class="sn-alram--span"><span class="sn-alarm--channel">' +
																							(alarmType != -1 ? (flag ? sendChannel[alarmType].name : '请选择通知方式') : '请选择通知方式') +
																							'</span>' +
																							'<i class="sn-alram--selectIcon glyphicon glyphicon-menu-down"></i></div>' +
																							'<ul class="sn-alarm--list">' +
																							html +
																							'</ul>';
																						$('.sn-alarm--selectBox').html(send_html);
																						//下拉列表
																						$('.sn-alarm--selectBox').on('click', function (e) {
																							var _ul = $(this).find('.sn-alarm--list');
																							if (_ul.hasClass('show')) {
																								_ul.removeClass('show');
																							} else {
																								_ul.addClass('show');
																							}
																							$(document).one('click', function (ev) {
																								_ul.removeClass('show');
																							});
																							e.stopPropagation();
																						});
																						// 选择发送方式
																						$('.php_set_send .sn-alarm--list').on('click', 'li', function (e) {
																							if ($(this).hasClass('disabled')) {
																								layer.msg('该通道未配置, 请配置后在选择！');
																								return e.stopPropagation();
																							}
																							$('.sn-alarm--list li').removeClass('active');
																							$(this).addClass('active');
																							$('.sn-alarm--channel').text($(this).text());
																							$('.sn-alarm--list').hide();
																						});
																						$('.php_set_send .sn-alarm--list')
																							.find('.installNotice')
																							.unbind('click')
																							.click(function (ev) {
																								var el = $(ev.currentTarget),
																									type = $(el).data('type');
																								openAlertModuleInstallView(type, '.site-menu p.bgw');
																							});
																					},
																					{ verify: false }
																				);
																			}
																		);
																	},
																	yes: function (index, layero) {
																		var name = $('.sn-alarm--list .active').attr('name');
																		if (!name) return layer.msg('请选择通知方式');
																		bt_tools.send(
																			{ url: '/plugin?action=a&name=security_notice&s=set_send', data: { type: name } },
																			function (res) {
																				if (res.status) $('.site-menu .bgw').click();
																				bt_tools.msg(res);
																				layer.close(index);
																			},
																			'设置告警'
																		);
																	},
																});
															});
															//防护开关
															$('#isPhpproSwitch').on('change', function () {
																if (php_versions.length > 0 && php_versions[0].state !== 1) {
																	$('#isPhpproSwitch').prop('checked', false);
																	return bt_tools.msg('请先开启PHP-' + sdata.phpversion + '防护', { icon: 7 });
																}
																var _status = site_data.open;
																if (site_data.version.indexOf('暂不兼容') != -1) {
																	$('#isPhpproSwitch').prop('checked', false);
																	return layer.msg('当前版本不兼容安全防护功能', { icon: 2 });
																}
																bt.simple_confirm(
																	{
																		title: (_status ? '关闭' : '开启') + '【' + site_data.site_name + '】站点安全告警',
																		msg: _status ? '关闭后，该网站将不再接收安全告警，是否继续？' : '开启后，检测到安全问题时将会发送告警通知，是否继续？',
																	},
																	function () {
																		var loadT = bt.load('正在设置站点安全防护...');
																		bt_tools.send(
																			{ url: '/plugin?action=a&name=security_notice&s=' + (_status ? 'stop_site' : 'start_site'), data: { siteName: site_data.site_name } },
																			function (rdata) {
																				loadT.close();
																				if (rdata.status) {
																					site_data.open = !_status;
																					bt_tools.msg(rdata);
																				} else {
																					bt_tools.msg({ status: false, msg: '当前PHP版本未开启防护，无法设置该站点！' });
																					$('#isPhpproSwitch').prop('checked', site_data['open']);
																				}
																			},
																			{ verify: false }
																		);
																	},
																	function () {
																		$('#isPhpproSwitch').prop('checked', site_data['open'] ? true : false);
																	}
																);
															});
															//监视器
															$('.edit_file_monitor')
																.unbind('click')
																.click(function () {
																	bt_tools.open({
																		type: 1,
																		title: '【' + site_data.site_name + '】监视器',
																		area: ['930px', '580px'],
																		btn: false,
																		closeBtn: 2,
																		content:
																			'<div class="sn-site__config pd15"><div id="sn-site__config--table"></div>\
                              <div class="sn-footer">\
                                  <ul class="help-info-text c7">\
                                    <li>安全告警默认会监视当前网站访问非当前网站文件的行为(例：你的站点A.com访问了站点B.com的文件或者目录)，通过添加监视器路径，当路径被访问时发送告警</li>\
                                    <li>告警频率：60秒某一个告警行为只会发送一次告警</li>\
                                    <li><a class="btlink" href="https://www.bt.cn/bbs/thread-112442-1-1.html" target="_blank">使用教程</a></li>\
                                  </ul>\
                              </div>\
                            </div>',
																		success: function () {
																			//监视器
																			site_config_table(site_data.config.file_info);
																			function site_config_table(file_info) {
																				var table_data = [];
																				var file_info = file_info;
																				$.each(file_info, function (index, item) {
																					table_data.push($.extend({ path: index }, item));
																				});

																				bt_tools.table({
																					el: '#sn-site__config--table',
																					default: '暂无数据',
																					data: table_data,
																					height: '380',
																					column: [
																						{
																							fid: 'path',
																							title: '路径',
																							width: 580,
																							tips: '打开目录',
																							type: 'link',
																							event: function (items, index, ev) {
																								if (items.type === 'dir') {
																									openPath(items.path);
																								} else {
																									bt.pub.on_edit_file(0, items.path);
																								}
																							},
																						},
																						{
																							fid: 'type',
																							title: '类型',
																							width: 70,
																							template: function (items) {
																								return '<span>' + (items.type === 'dir' ? '文件夹' : '文件') + '</span>';
																							},
																						},
																						{
																							title: '告警操作',
																							width: 160,
																							template: function (items) {
																								var arr_actions = [];
																								if (parseInt(items.read)) arr_actions.push('读取');
																								if (parseInt(items.del)) arr_actions.push('删除');
																								if (parseInt(items.reit)) {
																									arr_actions.push('修改');
																									arr_actions.push('增加');
																								}
																								return '<span>' + arr_actions.join(' / ') + '</span>';
																							},
																						},
																						{
																							title: '操作',
																							width: 100,
																							type: 'group',
																							align: 'right',
																							group: [
																								{
																									title: '编辑',
																									event: function (items) {
																										edit_file_monitor(items);
																									},
																								},
																								{
																									title: '删除',
																									event: function (items) {
																										del_file_monitor(items);
																									},
																								},
																							],
																						},
																					],
																					tootls: [
																						{
																							type: 'group',
																							positon: ['left', 'top'],
																							list: [
																								{
																									title: '添加监视器',
																									active: true,
																									event: function (ev) {
																										edit_file_monitor();
																									},
																								},
																							],
																						},
																					],
																				});
																				// 删除监视器
																				function del_file_monitor(items) {
																					bt.confirm(
																						{
																							title: '删除监视器',
																							msg: '您真的要删除路径【' + items.path + '】的监视器吗？',
																						},
																						function () {
																							bt_tools.send(
																								{ url: '/plugin?action=a&name=security_notice&s=del_site_config', data: { domain: site_data.site_name, type: items.type, path: items.path } },
																								function (rdata) {
																									bt_tools.msg(rdata);
																									if (rdata.status) {
																										delete file_info[items.path];
																										site_config_table(file_info);
																									}
																								}
																							);
																						}
																					);
																				}
																				function edit_file_monitor(rowdata) {
																					var _type = rowdata ? rowdata.type : 'dir';
																					bt_tools.open({
																						type: 1,
																						title: (rowdata ? '编辑' : '添加') + '监视器',
																						area: '470px',
																						btn: [rowdata ? '确定' : '添加', '取消'],
																						closeBtn: 2,
																						content: {
																							class: 'pd20',
																							form: [
																								{
																									label: '监测路径',
																									group: {
																										type: 'text',
																										width: '260px',
																										name: 'path',
																										disabled: rowdata ? true : false,
																										value: rowdata ? rowdata.path : site_data.path,
																										icon: {
																											type: 'glyphicon-folder-open',
																											select: 'all',
																											defaultPath: site_data.path,
																											event: function (ev) {},
																											callback: function (path, list, type) {
																												_type = type === 'dir' ? 'dir' : 'file';
																												if (_type === 'dir') {
																													$('.module-check').addClass('check_disabled');
																													$('.module-check input').prop('disabled', true);
																													$('.module-check input').prop('checked', false);
																													$('.module-check.check_disabled label').css('color', '#999');
																												} else {
																													$('.module-check').removeClass('check_disabled');
																													$('.module-check input').prop('disabled', false);
																													$('.module-check label').css('color', '#333');
																												}
																											},
																										},
																										placeholder: '请选择目录或文件',
																									},
																								},
																								{
																									label: '告警操作',
																									group: [
																										{
																											type: 'checkbox',
																											style: 'margin-right:20px;',
																											name: 'read',
																											value: rowdata ? parseInt(rowdata.read) : 0,
																											title: '读取',
																										},
																										{
																											type: 'checkbox',
																											class: 'module-check',
																											style: 'margin-right:20px;',
																											name: 'del',
																											value: rowdata ? parseInt(rowdata.del) : 0,
																											title: '删除',
																										},
																										{
																											type: 'checkbox',
																											class: 'module-check',
																											style: 'margin-right:20px;',
																											name: 'reit',
																											value: rowdata ? parseInt(rowdata.reit) : 0,
																											title: '修改/增加',
																										},
																									],
																								},
																								{
																									group: {
																										type: 'help',
																										style: 'margin-left:30px;',
																										list: ['目录暂时只支持读取告警操作'],
																									},
																								},
																							],
																						},
																						success: function (layero, index) {
																							if (_type === 'dir') {
																								$('.module-check').addClass('check_disabled');
																								$('.module-check input').prop('disabled', true);
																								$('.module-check.check_disabled label').css('color', '#999');
																							} else {
																								$('.module-check').removeClass('check_disabled');
																								$('.module-check input').prop('disabled', false);
																								$('.module-check label').css('color', '#333');
																							}
																							$('.module-check.check_disabled label')
																								.unbind('click')
																								.click(function () {
																									if ($(this).parent().hasClass('check_disabled')) layer.tips('目录暂不支持该告警操作！', $(this), { tips: [3, '#ff0000'], time: 3000 });
																								});
																						},
																						yes: function (form, layers, indexs) {
																							if (form.path == '') return layer.msg('监测路径不能为空！');
																							var actions = [];
																							$.each(form, function (index, item) {
																								if (index !== 'path') {
																									actions.push(item ? '1' : '0');
																								}
																							});
																							if (actions.join(',') === '0,0,0') return layer.msg('最少选择一个告警操作！');
																							//actions: 1,1,1,1 读取 删除 修改 增加
																							bt_tools.send(
																								{
																									url: '/plugin?action=a&name=security_notice&s=' + (rowdata ? 'edit_site_config' : 'add_site_config'),
																									data: {
																										domain: site_data.site_name,
																										path: form.path,
																										type: rowdata ? rowdata.type : _type,
																										actions: actions.join(',') + ',0',
																									},
																								},
																								function (rdata) {
																									bt_tools.msg(rdata);
																									if (rdata.status) {
																										bt_tools.send({ url: '/plugin?action=a&name=security_notice&s=get_sites', data: {} }, function (site_res) {
																											var site_filter1 = site_res.sites.filter(function (a) {
																												return a.path === web.path && a.site_name === web.name;
																											});
																											if (site_filter1.length > 0) {
																												site_config_table(site_filter1[0].config.file_info);
																											}
																										});
																									}
																									layer.close(layers);
																								},
																								'添加监视器'
																							);
																						},
																					});
																				}
																			}
																		},
																	});
																});
															//触发日志
															$('.get_domain_logs')
																.unbind('click')
																.click(function () {
																	bt_tools.send({ url: '/plugin?action=a&name=security_notice&s=get_domain_logs', data: { siteName: site_data.site_name, page: 1, limit: 10 } }, function (res) {
																		if (res.data.length == 0) {
																			layer.msg('暂无日志', { icon: 6 });
																			return;
																		}
																		bt_tools.open({
																			type: 1,
																			title: '【' + site_data.site_name + '】网站安全日志',
																			area: ['930px', '580px'],
																			btn: false,
																			closeBtn: 2,
																			content:
																				'<div class="sn-site__log pd15"><div id="sn-site__log--table"></div>\
                                  <div class="sn-site__log--page"></div>\
                              </div>',
																			success: function () {
																				var sitename = site_data.site_name;
																				bt_tools.table({
																					el: '#sn-site__log--table',
																					url: '/plugin?action=a&name=security_notice&s=get_domain_logs',
																					param: { siteName: sitename },
																					height: '470px',
																					column: [
																						{
																							width: 150,
																							title: '时间',
																							template: function (row) {
																								return '<span>' + bt.format_data(row['addtime']) + '</span>';
																							},
																						},
																						{
																							fid: 'address',
																							title: '用户IP',
																							type: 'link',
																							tips: true,
																							event: function (row, index) {
																								layer.confirm(
																									'是否将 <span style="color:#20a53a">' + row['address'] + '</span> 添加到IP白名单？',
																									{ title: '加入IP白名单', closeBtn: 2, icon: 0 },
																									function () {
																										bt_tools.send(
																											{ url: '/plugin?action=a&name=security_notice&s=add_ip_white', data: { start_ip: row['address'], end_ip: row['address'] } },
																											function (res) {
																												bt_tools.msg(res);
																											}
																										);
																									}
																								);
																							},
																						},
																						{
																							fid: 'intercept',
																							title: '恶意类型',
																						},
																						{
																							fid: 'url',
																							width: 270,
																							title: 'URL地址',
																							template: function (row) {
																								var dpath = $('<div></div>').text(row['url']),
																									dpath = dpath.html();
																								if (dpath.length > 35) {
																									dpath = dpath.substring(0, 20) + '...' + dpath.substring(dpath.length - 10, dpath.length);
																								}
																								return '<span title="' + dpath + '">' + dpath + '</span>';
																							},
																						},
																						{
																							title: '操作',
																							type: 'group',
																							width: 180,
																							align: 'right',
																							group: [
																								{
																									title: 'URL加白',
																									event: function (row) {
																										layer.confirm('加入URL白名单后此URL将不再进行防御，是否继续操作？', { title: '加入URL白名单', icon: 3, closeBtn: 2 }, function () {
																											bt_tools.send({ url: '/plugin?action=a&name=security_notice&s=add_url_white', data: { url_rule: row.url } }, function (res) {
																												layer.msg(res.msg, { icon: res.status ? 1 : 2 });
																											});
																										});
																									},
																								},
																								{
																									title: '详情',
																									event: function (row) {
																										var filterXssUrl = $('<div></div>').text(row['url']); //过滤XSS
																										layer.open({
																											type: 1,
																											title: '【' + row['address'] + '】详情',
																											area: '600px',
																											closeBtn: 2,
																											shadeClose: false,
																											content:
																												'\
                                                      <div class="pd15 lib-box">\
                                                          <table class="table" style="border:#ddd 1px solid;">\
                                                              <tbody>\
                                                                  <tr>\
                                                                      <th>时间</th>\
                                                                      <td>' +
																												bt.format_data(row['addtime']) +
																												'</td>\
                                                                      <th>用户IP</th>\
                                                                      <td>\
                                                                          <a class="btlink add_log_ip_white"  title="加入白名单">' +
																												row['address'] +
																												'</a>\
                                                                      </td>\
                                                                  </tr>\
                                                                  <tr>\
                                                                      <th>触发函数</th>\
                                                                      <td>' +
																												row['fun_name'] +
																												'</td>\
                                                                      <th>过滤器</th>\
                                                                      <td style="max-width: 330px;word-break: break-all;">' +
																												row['intercept'] +
																												'</td>\
                                                                  </tr>\
                                                              </tbody>\
                                                          </table>\
                                                          <div class="mt20">\
                                                              <b style="margin-left:10px">URI地址</b>\
                                                          </div>\
                                                          <div class="lib-con mt10">\
                                                              <div class="divpre">' +
																												filterXssUrl.html() +
																												'</div>\
                                                          </div>\
                                                          <div class="mt20">\
                                                              <b style="margin-left:10px">User-Agent</b>\
                                                          </div>\
                                                          <div class="lib-con mt10">\
                                                              <div class="divpre">' +
																												row['data_info']['data']['request']['headers']['user-agent'] +
																												'</div>\
                                                          </div>\
                                                          <div class="clearfix mt20">\
                                                              <b class="pull-left" style="margin-left: 10px;">传入值</b>\
                                                              <a class="btlink btn-error pull-right">URL加白</a>\
                                                          </div>\
                                                          <div class="lib-con mt10">\
                                                              <div class="divpre">' +
																												row['data_info']['data']['args'].join('</br>') +
																												'</div>\
                                                          </div>\
                                                          <div class="clearfix mt20">\
                                                              <b class="pull-left" style="margin-left: 10px;">调用栈</b>\
                                                          </div>\
                                                          <div class="lib-con mt10">\
                                                              <div class="divpre">' +
																												row['data_info']['data']['stack_trace'].join('</br>') +
																												'</div>\
                                                          </div>\
                                                          ' +
																												(row['fun_name'] == 'move_uploaded_file'
																													? '<div class="clearfix mt20"><b class="pull-left" style="margin-left: 10px;">风险文件</b></div><div class="lib-con mt10"><div class="divpre">' +
																													  row['data_info']['filename'] +
																													  '</div></div>'
																													: '') +
																												'\
                                                      </div>',
																											success: function ($layer) {
																												$('.add_log_ip_white').click(function () {
																													layer.confirm(
																														'是否将 <span style="color:#20a53a">' + row['address'] + '</span> 添加到IP白名单？',
																														{ title: '加入IP白名单', closeBtn: 2, icon: 0 },
																														function () {
																															bt_tools.send(
																																{ url: '/plugin?action=a&name=security_notice&s=add_ip_white', data: { start_ip: row['address'], end_ip: row['address'] } },
																																function (res) {
																																	layer.msg(res.msg, { icon: res.status ? 1 : 2 });
																																}
																															);
																														}
																													);
																												});
																												$layer.find('.btn-error').click(function () {
																													layer.confirm('加入URL白名单后此URL将不再进行防御，是否继续操作？', { title: '加入URL白名单', closeBtn: 2, icon: 3 }, function () {
																														bt_tools.send({ url: '/plugin?action=a&name=security_notice&s=wubao_url_white', data: { url_rule: row.url } }, function (res) {
																															layer.msg(res.msg, { icon: res.status ? 1 : 2 });
																														});
																													});
																												});
																											},
																										});
																									},
																								},
																								{
																									title: 'HTTP',
																									event: function (row) {
																										var _http_info = row;
																										if (_http_info) {
																											layer.open({
																												type: 1,
																												title: '【' + row.address + '】HTTP详情',
																												area: ['800px', '500px'],
																												closeBtn: 1,
																												shadeClose: false,
																												maxmin: true,
																												content:
																													'<div class="pd15 lib-box" style="height:100%">\
                                                              <pre id="http_info_data" style="height:100%;white-space: break-spaces;"></pre></div>',
																												success: function (layers) {
																													$('#http_info_data').text(bt.formatJsonForNotes(_http_info));
																													$(layers).css('top', ($(window).height() - $(layers).height()) / 2);
																												},
																											});
																										} else {
																											layer.msg('暂无HTTP详情信息', { icon: 6 });
																										}
																									},
																								},
																							],
																						},
																					],
																					tootls: [
																						{
																							//分页显示
																							type: 'page',
																							numberStatus: true, //　是否支持分页数量选择,默认禁用
																							jump: true, //是否支持跳转分页,默认禁用
																						},
																					],
																				});
																			},
																		});
																	});
																});
														}
													},
													{ verify: false }
												);
											},
											{ verify: false }
										);
									},
									{ verify: false }
								);
							}
						});
					} else {
						$('#webedit-con .php-pro-box').append(
							'<div class="mask_layer">\
              <div class="sn-home--open-condition" style="margin-top: 10px;margin-left: 0;height:32px;line-height:32px">\
								<i class="sn-home--important-note">!</i>\
								当前PHP版本不兼容此功能,请切换其他PHP版本\
							</div>\
            </div>'
						);
					}
					if (!is_install) {
						$('[name=btn_change_phpversion]').text('安装');
						$('.current_php').hide();
						$('#webedit-con .php-pro-box').append(
							'<div class="mask_layer">\
              <div class="sn-home--open-condition" style="margin-top: 10px;margin-left: 0;height:32px;line-height:32px">\
								<i class="sn-home--important-note">!</i>\
								当前PHP版本尚未安装，请先安装\
							</div>\
            </div>'
						);
					} else {
						$('[name=btn_change_phpversion]').text('切换');
						if (sdata.phpversion != 'other') $('[name=btn_change_phpversion]').hide();
					}

					if (sdata.phpversion != 'other') {
						$('.other-version').hide();
						$('.help-info-text li:eq(3),.help-info-text li:eq(4),.help-info-text li:eq(5)').hide();
					}
					if (sdata.phpversion.substring(1, 0) != '7') {
						$('.help-info-text li:eq(2)').hide();
					}
					if (sdata.phpversion != '52') {
						$('.help-info-text li:eq(1)').hide();
					}
					setTimeout(function () {
						$('select[name="versions"]').change(function () {
							var phpversion = $(this).val();
							if (!is_install && phpversion === sdata.phpversion) {
								$('[name=btn_change_phpversion]').text('安装');
								$('.current_php').hide();
							} else {
								$('[name=btn_change_phpversion]').text('切换');
								if (phpversion === sdata.phpversion && phpversion !== 'other') $('[name=btn_change_phpversion]').hide();
								else $('[name=btn_change_phpversion]').show();
							}
							if (phpversion == 'other') {
								$('.other-version').show();
								$('.help-info-text li:eq(3),.help-info-text li:eq(4),.help-info-text li:eq(5)').show();
							} else {
								$('.other-version').hide();
								$('.help-info-text li:eq(3),.help-info-text li:eq(4),.help-info-text li:eq(5)').hide();
							}
							if (phpversion.substring(1, 0) != '7') {
								$('.help-info-text li:eq(2)').hide();
							} else {
								$('.help-info-text li:eq(2)').show();
							}
							if (phpversion != '52') {
								$('.help-info-text li:eq(1)').hide();
							} else {
								$('.help-info-text li:eq(1)').show();
							}
						});
					}, 500);

					function get_session_status() {
						var loading = bt.load('正在获取session状态请稍候');
						bt.send('get_php_session_path', 'config/get_php_session_path', { id: web.id }, function (tdata) {
							loading.close();
							$('#session_switch').prop('checked', tdata);
						});
					}
					get_session_status();
					$('#session_switch').click(function () {
						var val = $(this).prop('checked');
						bt.send('set_php_session_path', 'config/set_php_session_path', { id: web.id, act: val ? 1 : 0 }, function (rdata) {
							bt.msg(rdata);
						});
						setTimeout(function () {
							get_session_status();
						}, 500);
					});
				});
			});
		},
		templet_301: function (sitename, id, row) {
			var isEdit = !!row;
			var form = isEdit
				? row
				: {
						redirectname: new Date().valueOf(),
						tourl: 'http://',
						redirectdomain: [],
						redirectpath: '',
						redirecttype: '',
						type: 1,
						domainorpath: 'domain',
						holdpath: 1,
				  };
			var helps = [
				'重定向类型：表示访问选择的“域名”或输入的“路径”时将会重定向到指定URL',
				'目标URL：可以填写你需要重定向到的站点，目标URL必须为可正常访问的URL，否则将返回错误',
				'重定向方式：使用301表示永久重定向，使用302表示临时重定向',
				'保留URI参数：表示重定向后访问的URL是否带有子路径或参数如设置访问http://b.com 重定向到http://a.com',
				'保留URI参数：  http://b.com/1.html ---> http://a.com/1.html',
				'不保留URI参数：http://b.com/1.html ---> http://a.com',
			];
			bt.site.get_domains(id, function (rdata) {
				var table_data = site.edit.redirect_table.data;
				var flag = true;
				var domain_html = '';
				var select_list = [];
				for (var i = 0; i < rdata.length; i++) {
					flag = true;
					for (var j = 0; j < table_data.length; j++) {
						var con1 = site.edit.get_list_equal(table_data[j].redirectdomain, rdata[i].name);
						var con2 = !site.edit.get_list_equal(form.redirectdomain, rdata[i].name);
						if (con1 && con2) {
							flag = false;
							break;
						}
					}
					if (flag) {
						select_list.push(rdata[i]);
						var selected = site.edit.get_list_equal(form.redirectdomain, rdata[i].name);
						domain_html += '<li ' + (selected ? 'class="selected"' : '') + '><a><span class="text">' + rdata[i].name + '</span><span class="glyphicon glyphicon-ok check-mark"></span></a></li>';
					}
				}
				if (!domain_html) {
					domain_html = '<div style="padding: 14px 0; color: #999; text-align: center; font-size: 12px;">暂无域名可选</div>';
				}

				var content =
					'<style>select.bt-input-text { width: 100px; }</style>\
				<div id="form_redirect" class="bt-form-new pd20">\
					<div class="form-inline">\
						<div class="form-item">\
							<div class="form-label">开启重定向</div>\
							<div class="form-value">\
								<input class="btswitch btswitch-ios" id="type" type="checkbox" name="type" checked />\
								<label class="btswitch-btn phpmyadmin-btn" for="type"></label>\
                                </div>\
                            </div>\
						<div class="form-item">\
							<div class="form-label">保留URI参数</div>\
							<div class="form-value">\
								<input class="btswitch btswitch-ios" id="holdpath" type="checkbox" name="holdpath" checked />\
								<label class="btswitch-btn phpmyadmin-btn" for="holdpath"></label>\
                        </div>\
                            </div>\
                        </div>\
					<div class="form-inline">\
						<div class="form-item">\
							<div class="form-label">重定向类型</div>\
							<div class="form-value">\
								<select class="bt-input-text" name="domainorpath">\
									<option value="domain">域名</option>\
									<option value="path">路径</option>\
                                </select>\
							</div>\
						</div>\
						<div class="form-item">\
							<div class="form-label" style="width: 90px;">重定向方式</div>\
							<div class="form-value">\
								<select class="bt-input-text" style="width: 150px;" name="redirecttype">\
									<option value="301">301（永久重定向）</option>\
									<option value="302">302（临时重定向）</option>\
								</select>\
							</div>\
            </div>\
					</div>\
					<div class="form-inline redirectdomain" style="flex-wrap: nowrap;">\
						<div class="form-item">\
							<div class="form-label">重定向域名</div>\
							<div class="form-value">\
								<div class="btn-group bootstrap-select show-tick redirect_domain" style="width: 200px;">\
                                    <button type="button" class="btn dropdown-toggle btn-default" style="height: 32px; line-height: 18px; font-size: 12px">\
                                        <span class="filter-option pull-left"></span>\
                                        <span class="bs-caret"><span class="caret"></span></span>\
                                    </button>\
                                    <div class="dropdown-menu open">\
                                        <div class="bs-actionsbox">\
                                            <div class="btn-group btn-group-sm btn-block">\
                                                <button type="button" class="actions-btn bs-select-all btn btn-default">全选</button>\
                                                <button type="button" class="actions-btn bs-deselect-all btn btn-default">取消全选</button>\
                                            </div>\
                                        </div>\
                                        <div class="dropdown-menu inner">' +
					domain_html +
					'</div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
						<div class="form-item">\
							<div class="form-label" style="width: 80px;">目标URL</div>\
							<div class="form-value">\
								<input class="bt-input-text" name="tourl" type="text" style="width: 200px;" value="http://" />\
                            </div>\
                        </div>\
                        </div>\
					<div class="form-inline redirectpath" style="display: none; flex-wrap: nowrap;">\
						<div class="form-item">\
							<div class="form-label">重定向路径</div>\
							<div class="form-value">\
							<input class="bt-input-text" name="redirectpath" placeholder="如: http://' +
					sitename +
					' " type="text" style="width: 200px;" />\
							</div>\
						</div>\
						<div class="form-item">\
							<div class="form-label" style="width: 80px;">目标URL</div>\
							<div class="form-value">\
								<input class="bt-input-text" name="tourl1" type="text" style="width: 200px;" value="http://" />\
							</div>\
						</div>\
					</div>\
					<div style="height: 15px;"></div>\
					' +
					bt.render_help(helps) +
					'\
				</div>';
				var redirectdomain = form.redirectdomain;

				var form_redirect = bt.open({
					type: 1,
					skin: 'demo-class',
					area: '650px',
					title: !isEdit ? '添加重定向' : '修改重定向【' + form.redirectname + '】',
					closeBtn: 2,
					shift: 5,
					shadeClose: false,
					btn: ['提交', '取消'],
					content: content,
					success: function () {
						var show_domain_name = function () {
							var text = '';
							if (redirectdomain.length > 0) {
								text = [];
								for (var i = 0; i < redirectdomain.length; i++) {
									text.push(redirectdomain[i]);
								}
								text = text.join(', ');
							} else {
								text = '请选择站点';
							}
							$('.redirect_domain .btn .filter-option').text(text);
						};
						show_domain_name();
						$('.redirect_domain .btn').click(function (e) {
							var $parent = $(this).parent();
							$parent.toggleClass('open');
							$(document).one('click', function () {
								$parent.removeClass('open');
							});
							e.stopPropagation();
						});
						// 单选
						$('.redirect_domain .dropdown-menu li').click(function (e) {
							var $this = $(this);
							var index = $this.index();
							var name = select_list[index].name;
							$this.toggleClass('selected');
							if ($this.hasClass('selected')) {
								redirectdomain.push(name);
							} else {
								var remove_index = -1;
								for (var i = 0; i < redirectdomain.length; i++) {
									if (redirectdomain[i] == name) {
										remove_index = i;
										break;
									}
								}
								if (remove_index != -1) {
									redirectdomain.splice(remove_index, 1);
								}
							}
							show_domain_name();
							e.stopPropagation();
						});
						// 全选
						$('.redirect_domain .bs-select-all').click(function () {
							redirectdomain = [];
							for (var i = 0; i < select_list.length; i++) {
								redirectdomain.push(select_list[i].name);
							}
							$('.redirect_domain .dropdown-menu li').addClass('selected');
							show_domain_name();
						});
						// 取消全选
						$('.redirect_domain .bs-deselect-all').click(function () {
							redirectdomain = [];
							$('.redirect_domain .dropdown-menu li').removeClass('selected');
							show_domain_name();
						});

						// 重定向类型
						$('[name="domainorpath"]').change(function () {
							var path = $(this).val();
							$('.redirect_domain .bs-deselect-all').click();
							$('[name="redirectpath"]').val('');
							$('.redirectpath, .redirectdomain').hide();
							switch (path) {
								case 'path':
									$('.redirectpath').show();
									break;
								case 'domain':
									$('.redirectdomain').show();
									break;
							}
						});

						if (isEdit) {
							$('[name="type"]').prop('checked', form.type == 1);
							$('[name="holdpath"]').prop('checked', form.holdpath == 1);
							$('[name="domainorpath"]').val(form.domainorpath);
							$('[name="redirecttype"]').val(form.redirecttype);
							$('[name="' + (form.domainorpath == 'path' ? 'tourl1' : 'tourl') + '"]').val(form.tourl);
							$('[name="redirectpath"]').val(form.redirectpath);
							$('.redirectpath, .redirectdomain').hide();
							switch (form.domainorpath) {
								case 'path':
									$('.redirectpath').show();
									break;
								case 'domain':
									$('.redirectdomain').show();
									break;
							}
						}

						$('#form_redirect').parent().css('overflow', 'inherit');
					},
					yes: function () {
						form.type = $('[name="type"]').prop('checked') ? 1 : 0;
						form.holdpath = $('[name="holdpath"]').prop('checked') ? 1 : 0;
						form.redirecttype = $('[name="redirecttype"]').val();
						form.domainorpath = $('[name="domainorpath"]').val();
						form.redirectpath = $('[name="redirectpath"]').val();
						form.tourl = $('[name="' + (form.domainorpath == 'path' ? 'tourl1' : 'tourl') + '"]').val();
						form.redirectdomain = JSON.stringify(redirectdomain);

						bt.site.set_redirect(
							isEdit,
							{
								type: form.type,
								sitename: sitename,
								holdpath: form.holdpath,
								redirectname: form.redirectname,
								redirecttype: form.redirecttype,
								domainorpath: form.domainorpath,
								redirectpath: form.redirectpath,
								redirectdomain: form.redirectdomain,
								tourl: form.tourl,
							},
							function (rdata) {
								if (rdata.status) {
									form_redirect.close();
									site.edit.redirect_table.$refresh_table_list();
								}
								bt.msg(rdata);
							}
						);
					},
				});
			});
		},
		templet_404: function (sitename, row) {
			var isEdit = !!row;
			var form = isEdit
				? row
				: {
						sitename: sitename,
						errorpage: 1,
						redirectname: new Date().valueOf(),
				  };
			bt.open({
				type: 1,
				shift: 5,
				closeBtn: 2,
				shadeClose: false,
				area: '400px',
				title: isEdit ? '编辑404重定向【' + row.redirectname + '】' : '添加404重定向',
				btn: ['提交', '取消'],
				content:
					'<style>.form-item .form-label { width: 132px; } .form-item .bt-input-text { width: 180px; } </style>\
				<div class="bt-form-new pd20" style="padding-bottom: 25px;">\
					<div class="form-item">\
						<div class="form-label">开启重定向</div>\
						<div class="form-value">\
							<input type="checkbox" id="redirect_status" class="btswitch btswitch-ios" name="redirect_status" checked="checked" />\
							<label class="btswitch-btn" for="redirect_status"></label>\
						</div>\
					</div>\
					<div class="form-item">\
						<div class="form-label">错误类型</div>\
						<div class="form-value">\
							<select class="bt-input-text">\
								<option selected>页面404</option>\
							</select>\
						</div>\
					</div>\
					<div class="form-item">\
						<div class="form-label">重定向方式</div>\
						<div class="form-value">\
							<select class="bt-input-text" name="redirecttype">\
								<option value="301" selected>301</option>\
								<option value="302">302</option>\
							</select>\
						</div>\
					</div>\
					<div class="form-item">\
						<div class="form-label">404错误重定向到</div>\
						<div class="form-value">\
							<select class="bt-input-text" name="redirect_method">\
								<option value="topath" selected>首页</option>\
								<option value="tourl">自定义页面</option>\
							</select>\
							<input type="text" name="tourl" class="bt-input-text mt10" style="display: none;" placeholder="例: http://www.bt.cn" />\
						</div>\
					</div>\
				</div>',
				success: function () {
					$('select[name="redirect_method"]').change(function () {
						var val = $(this).val();
						if (val == 'tourl') {
							$('input[name="tourl"]').show();
						} else {
							$('input[name="tourl"]').hide();
						}
					});

					if (isEdit) {
						$('[name="redirect_status"]').prop('checked', form.type == 1);
						$('[name="redirecttype"]').val(form.redirecttype);
						$('[name="redirect_method"]').val(form.topath ? 'topath' : 'tourl');
						$('[name="redirect_method"]').change();
						if (form.tourl) {
							$('[name="tourl"]').val(form.tourl);
						}
					}
				},
				yes: function (index) {
					form.redirecttype = $('select[name="redirecttype"]').val();
					form.type = $('[name="redirect_status"]').is(':checked') ? 1 : 0;
					var method = $('[name="redirect_method"]').val();
					if (method == 'topath') {
						form.topath = '/';
						form.tourl = '';
					} else {
						var tourl = $('[name="tourl"]').val().trim();
						if (tourl === '') {
							layer.msg('请输入自定义页面路径', { icon: 2 });
							return;
						}
						form.tourl = tourl;
						form.topath = '';
					}
					bt.site.set_error_redirect(
						isEdit,
						{
							sitename: form.sitename,
							redirectname: form.redirectname,
							tourl: form.tourl,
							topath: form.topath,
							redirecttype: form.redirecttype,
							errorpage: form.errorpage,
							type: form.type,
						},
						function (res) {
							if (res.status) {
								layer.close(index);
								site.edit.redirect_table.$refresh_table_list();
							}
							bt.msg(res);
						}
					);
				},
			});
		},
		get_list_equal: function (list, name) {
			var result = false;
			for (var i = 0; i < list.length; i++) {
				if (list[i] == name) {
					result = true;
					break;
				}
			}
			return result;
		},
		template_Dir: function (id, type, obj) {
			if (type) {
				obj = { name: '', sitedir: '', username: '', password: '' };
			} else {
				obj = { name: obj.name, sitedir: obj.site_dir, username: '', password: '' };
			}
			var form_directory = bt.open({
				type: 1,
				skin: 'demo-class',
				area: '440px',
				title: type ? '添加加密访问' : '修改加密访问',
				closeBtn: 2,
				shift: 5,
				shadeClose: false,
				content:
					"<form id='form_dir' class='divtable pd15' style='padding-bottom: 60px;'>" +
					"<div class='line'>" +
					"<span class='tname'>加密访问</span>" +
					"<div class='info-r ml0'><input name='dir_sitedir' placeholder='输入需要加密访问的目录，如：/text/' class='bt-input-text mr10' type='text' style='width:270px' value='" +
					obj.sitedir +
					"'>" +
					'</div></div>' +
					"<div class='line'>" +
					"<span class='tname'>名称</span>" +
					"<div class='info-r ml0'><input name='dir_name' class='bt-input-text mr10' type='text' style='width:270px' value='" +
					obj.name +
					"'>" +
					'</div></div>' +
					"<div class='line'>" +
					"<span class='tname'>用户名</span>" +
					"<div class='info-r ml0'><input name='dir_username' AUTOCOMPLETE='off' class='bt-input-text mr10' type='text' style='width:270px' value='" +
					obj.username +
					"'>" +
					'</div></div>' +
					"<div class='line'>" +
					"<span class='tname'>密码</span>" +
					"<div class='info-r ml0'><input name='dir_password' AUTOCOMPLETE='off' class='bt-input-text mr10' type='password' style='width:270px' value='" +
					obj.password +
					"'>" +
					'</div></div>' +
					"<ul class='help-info-text c7 plr20'>" +
					'<li>目录设置加密访问后，访问时需要输入账号密码才能访问</li>' +
					'<li>例如我设置了加密访问 /test/ ,那我访问 http://aaa.com/test/ 是就要输入账号密码才能访问</li>' +
					'</ul>' +
					"<div class='bt-form-submit-btn'><button type='button' class='btn btn-sm btn-danger btn-colse-guard'>关闭</button><button type='button' class='btn btn-sm btn-success btn-submit-guard'>" +
					(type ? '提交' : '保存') +
					'</button></div></form>',
			});
			$('.btn-colse-guard').click(function () {
				form_directory.close();
			});
			$('[name="dir_sitedir"]').keyup(function () {
				var val = $(this)
					.val()
					.split('/')
					.filter(function (s) {
						return $.trim(s).length > 0;
					})
					.join('_');
				$('input[name="dir_name"]').val(val);
			});
			$('.btn-submit-guard').click(function () {
				var guardData = {};
				guardData['id'] = id;
				guardData['name'] = $('input[name="dir_name"]').val();
				guardData['site_dir'] = $('input[name="dir_sitedir"]').val();
				guardData['username'] = $('input[name="dir_username"]').val();
				guardData['password'] = $('input[name="dir_password"]').val();
				if (guardData['name'] == '') {
					return layer.msg('名称不能为空', { icon: 2 });
				}
				if (guardData['site_dir'] == '') {
					return layer.msg('加密访问不能为空', { icon: 2 });
				}
				if (guardData['username'] == '') {
					return layer.msg('用户名不能为空', { icon: 2 });
				}
				if (guardData['password'] == '') {
					return layer.msg('密码不能为空', { icon: 2 });
				}
				if (guardData.username.length < 3) {
					return layer.msg('用户名不能少于3位', { icon: 2 });
				}
				if (guardData.password.length < 3) {
					return layer.msg('密码不能少于3位', { icon: 2 });
				}
				if (type) {
					bt.site.create_dir_guard(guardData, function (rdata) {
						if (rdata.status) {
							form_directory.close();
							site.reload();
						} else if (typeof rdata.tip != 'undefined') {
							//检测到其他地方已经设置，是否强制添加
							guardData['force'] = true;
							bt.simple_confirm({ msg: rdata.tip, title: '添加须知' }, function () {
								bt_tools.send('site?action=set_dir_auth', guardData, function (ress) {
									bt.msg(ress);
									if (ress.status) {
										form_directory.close();
										site.reload();
									}
								});
							});
							return false;
						}
						bt.msg(rdata);
					});
				} else {
					bt.site.edit_dir_account(guardData, function (rdata) {
						if (rdata.status) {
							form_directory.close();
							site.reload();
						}
						bt.msg(rdata);
					});
				}
			});
			setTimeout(function () {
				if (!type) {
					$('input[name="dir_name"]').attr('disabled', 'disabled');
					$('input[name="dir_sitedir"]').attr('disabled', 'disabled');
				}
			}, 500);
		},
		template_php: function (website, obj) {
			var _type = 'add',
				_name = '',
				_bggrey = '';
			if (obj == undefined) {
				obj = { name: '', suffix: 'php|jsp', dir: '' };
			} else {
				obj = { name: obj.name, suffix: obj.suffix, dir: obj.dir };
				_type = 'edit';
				_name = ' readonly';
				_bggrey = 'background: #eee;';
			}
			var form_directory = bt.open({
				type: 1,
				area: '440px',
				title: '添加禁止访问',
				closeBtn: 2,
				btn: ['保存', '取消'],
				content:
					"<form class='mt10 php_deny'>" +
					"<div class='line'>" +
					"<span class='tname' style='width: 100px;'>名称</span>" +
					"<div class='info-r ml0' style='margin-left: 100px;'><input name='deny_name' placeholder='规则名称' " +
					_name +
					" class='bt-input-text mr10' type='text' style='width:270px;" +
					_bggrey +
					"' value='" +
					obj.name +
					"'>" +
					'</div></div>' +
					"<div class='line'>" +
					"<span class='tname' style='width: 100px;'>后缀</span>" +
					"<div class='info-r ml0' style='margin-left: 100px;'><input name='suffix' placeholder='禁止访问的后缀' class='bt-input-text mr10' type='text' style='width:270px' value='" +
					obj.suffix +
					"'>" +
					'</div></div>' +
					"<div class='line'>" +
					"<span class='tname' style='width: 100px;'>目录</span>" +
					"<div class='info-r ml0' style='margin-left: 100px;'><input name='dir' placeholder='禁止访问的目录' class='bt-input-text mr10' type='text' style='width:270px' value='" +
					obj.dir +
					"'>" +
					'</div></div></form>' +
					"<ul class='help-info-text c7' style='padding-left:40px;margin-bottom: 20px;'>" +
					'<li>后缀：禁止访问的文件后缀</li>' +
					'<li>目录：规则会在这个目录内生效</li>' +
					'</ul>',
				yes: function () {
					var dent_data = $('.php_deny').serializeObject();
					dent_data.act = _type;
					dent_data.website = website;
					dent_data.suffix = dent_data.suffix.replace(/\|*$/, '');
					var loading = bt.load();
					bt.send('set_php_deny', 'config/set_file_deny', dent_data, function (rdata) {
						loading.close();
						if (rdata.status) {
							form_directory.close();
							site.reload();
							$('#set_dirguard .tab-nav span:eq(1)').click();
						}
						bt_tools.msg(rdata);
					});
				},
			});
		},
		set_301_old: function (web) {
			bt.site.get_domains(web.id, function (rdata) {
				var domains = [{ title: '整站', value: 'all' }];
				for (var i = 0; i < rdata.length; i++) domains.push({ title: rdata[i].name, value: rdata[i].name });
				bt.site.get_site_301(web.name, function (pdata) {
					var _val = pdata.src == '' ? 'all' : pdata.src;
					var datas = [
						{ title: '访问域名', width: '360px', name: 'domains', value: _val, disabled: pdata.status, type: 'select', items: domains },
						{ title: '目标URL', width: '360px', name: 'toUrl', value: pdata.url },
						{
							title: ' ',
							text: '启用301',
							value: pdata.status,
							name: 'status',
							class: 'label-input-group',
							type: 'checkbox',
							callback: function (sdata) {
								bt.site.set_site_301(web.name, sdata.domains, sdata.toUrl, sdata.status ? '1' : '0', function (ret) {
									if (ret.status) site.reload(10);
									bt.msg(ret);
								});
							},
						},
					];
					var robj = $('#webedit-con');
					for (var i = 0; i < datas.length; i++) {
						var _form_data = bt.render_form_line(datas[i]);
						robj.append(_form_data.html);
						bt.render_clicks(_form_data.clicks);
					}
					robj.append(bt.render_help(['选择[整站]时请不要将目标URL设为同一站点下的域名.', '取消301重定向后，需清空浏览器缓存才能看到生效结果.']));
				});
			});
		},
		set_301: function (web) {
			$('#webedit-con').html(
				'<div>\
				<div id="website_redirect"></div>\
				<ul class="help-info-text c7">\
					<li>设置域名重定向后，该域名的404重定向将失效</li>\
				</ul>\
			</div>'
			);

			site.edit.redirect_table = bt_tools.table({
				el: '#website_redirect',
				url: '/site?action=GetRedirectList',
				param: { sitename: web.name },
				height: 500,
				dataFilter: function (res) {
					return { data: res };
				},
				column: [
					{ type: 'checkbox', width: 20 },
					{
						fid: 'sitename',
						title: '被重定向',
						type: 'text',
						width: 120,
						template: function (row, index) {
							var conter = '空';
							if (row.domainorpath == 'path' && row.errorpage !== 1) {
								conter = row.redirectpath || '空';
							} else {
								conter = row.redirectdomain ? row.redirectdomain.join('、') : '空';
							}
							return '<span style="width:100px;" title="' + conter + '">' + conter + '</span>';
						},
					},
					{
						fid: 'method',
						title: '重定向类型',
						type: 'text',
						width: 90,
						template: function (row, index) {
							var str = '';
							if (row.errorpage == 1) {
								str = '错误';
							} else if (row.domainorpath == 'path') {
								str = '路径';
							} else if (row.domainorpath == 'domain') {
								str = '域名';
							}
							return '<span>' + str + '</span>';
						},
					},
					{
						fid: 'path',
						title: '重定向到',
						type: 'text',
						template: function (row, index) {
							var path = row.tourl ? row.tourl : row.topath;
							return (
								'<span title="' +
								path +
								'" style="display: flex;">\
								<span class="size_ellipsis" style="flex: 1; width: 0;">' +
								(row.topath && path == '/' ? '首页' : path) +
								'</span>\
							</span>'
							);
						},
					},
					{
						fid: 'type',
						title: '状态',
						width: 70,
						config: {
							icon: true,
							list: [
								[1, '运行中', 'bt_success', 'glyphicon-play'],
								[0, '已停止', 'bt_danger', 'glyphicon-pause'],
							],
						},
						type: 'status',
						event: function (row, index, ev, key, that) {
							row.type = !row.type ? 1 : 0;
							row.redirectdomain = JSON.stringify(row['redirectdomain']);
							bt.site.modify_redirect(row, function (res) {
								row.redirectdomain = JSON.parse(row['redirectdomain']);
								that.$modify_row_data({ status: row.type });
								bt.msg(res);
							});
						},
					},
					{
						title: '操作',
						width: 150,
						type: 'group',
						align: 'right',
						group: [
							{
								title: '配置文件',
								event: function (row, index, ev, key, that) {
									var type = '';
									try {
										type = bt.get_cookie('serverType') || serverType;
									} catch (err) {}
									bt.site.get_redirect_config(
										{
											sitename: web.name,
											redirectname: row.redirectname,
											webserver: type,
										},
										function (rdata) {
											if ($.isPlainObject(rdata) && !rdata.status) {
												bt_tools.msg(rdata);
												return;
											}
											if (Array.isArray(rdata) && !rdata[0].status) {
												bt_tools.msg(rdata[0]);
												return;
											}
											// if (typeof rdata == 'object' && rdata.constructor == Array) {
											//   if (!rdata[0].status) bt.msg(rdata)
											// } else {
											//   if (!rdata.status) bt.msg(rdata)
											// }
											bt.open({
												type: 1,
												area: ['550px', '550px'],
												title: '编辑配置文件[' + row.redirectname + ']',
												closeBtn: 2,
												shift: 0,
												content:
													'\
											<div class="bt-form pd15">\
												<p style="color: #666; margin-bottom: 7px">提示：Ctrl+F 搜索关键字，Ctrl+S 保存，Ctrl+H 查找替换</p>\
												<div id="redirect_config_con" class="bt-input-text ace_config_editor_scroll" style="height: 350px; line-height: 18px;"></div>\
												<button id="OnlineEditFileBtn" class="btn btn-success btn-sm" style="margin-top:10px;">保存</button>\
												<ul class="help-info-text c7">\
													<li>此处为该负载均衡的配置文件，若您不了解配置规则,请勿随意修改。</li>\
												</ul>\
											"</div>',
												success: function (layers, indexs) {
													var editor = bt.aceEditor({
														el: 'redirect_config_con',
														content: rdata[0].data,
														mode: 'nginx',
														saveCallback: function (val) {
															bt.site.save_redirect_config({ path: rdata[1], data: val, encoding: rdata[0].encoding }, function (ret) {
																if (ret.status) {
																	site.reload(11);
																	layer.close(indexs);
																}
																bt.msg(ret);
															});
														},
													});
													$('#OnlineEditFileBtn').click(function () {
														bt.saveEditor(editor);
													});
												},
											});
										}
									);
								},
							},
							{
								title: '编辑',
								event: function (row, index, ev, key, that) {
									if (row.errorpage == 1) {
										site.edit.templet_404(web.name, row);
									} else {
										site.edit.templet_301(web.name, web.id, row);
									}
								},
							},
							{
								title: '删除',
								event: function (row, index, ev, key, that) {
									bt.site.remove_redirect(web.name, row.redirectname, function (rdata) {
										bt.msg(rdata);
										if (rdata.status) that.$delete_table_row(index);
									});
								},
							},
						],
					},
				],
				tootls: [
					{
						//按钮组
						type: 'group',
						positon: ['left', 'top'],
						list: [
							{
								title: '添加重定向',
								active: true,
								event: function (ev) {
									site.edit.templet_301(web.name, web.id);
								},
							},
							{
								title: '404重定向',
								event: function (ev) {
									var row = undefined;
									var data = site.edit.redirect_table.data;
									for (var i = 0; i < data.length; i++) {
										if (data[i].errorpage == 1) {
											row = data[i];
											break;
										}
									}
									site.edit.templet_404(web.name, row);
								},
							},
						],
					},
					{
						//批量操作
						type: 'batch',
						positon: ['left', 'bottom'],
						placeholder: '请选择批量操作',
						buttonValue: '批量操作',
						disabledSelectValue: '请选择需要批量操作的计划任务!',
						selectList: [
							{
								title: '启用重定向规则',
								url: '/site?action=ModifyRedirect',
								param: function (row) {
									row.type = 1;
									row.redirectdomain = JSON.stringify(row['redirectdomain']);
									return row;
								},
								callback: function (that) {
									bt.simple_confirm({ title: '批量启用重定向规则', msg: '批量启用当前选中的规则后，配置的重定向域名/目录将重新指向目标地址，是否继续操作？' }, function (index) {
										layer.close(index);
										var param = {};
										that.start_batch(param, function (list) {
											var html = '';
											for (var i = 0; i < list.length; i++) {
												var item = list[i];
												var name = '';
												if (item.domainorpath == 'path' && item.errorpage !== 1) {
													name = item.redirectpath;
												} else {
													item.redirectdomain = JSON.parse(item.redirectdomain);
													name = item.redirectdomain ? item.redirectdomain.join('、') : '空';
												}
												html +=
													'<tr><td>' + name + '</td><td><div class="text-right"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + item.request.msg + '</span></div></td></tr>';
											}
											site.edit.redirect_table.$batch_success_table({
												title: '批量开启服务',
												th: '被重定向',
												html: html,
											});
											site.edit.redirect_table.$refresh_table_list(true);
										});
									});
								},
							},
							{
								title: '停用重定向规则',
								url: '/site?action=ModifyRedirect',
								param: function (row) {
									row.type = 0;
									row.redirectdomain = JSON.stringify(row['redirectdomain']);
									return row;
								},
								callback: function (that) {
									bt.simple_confirm({ title: '批量停用重定向规则', msg: '批量停用当前选中的规则后，配置的重定向域名/目录将指向源地址，是否继续操作？' }, function (index) {
										layer.close(index);
										var param = {};
										that.start_batch(param, function (list) {
											var html = '';
											for (var i = 0; i < list.length; i++) {
												var item = list[i];
												var name = '';
												if (item.domainorpath == 'path' && item.errorpage !== 1) {
													name = item.redirectpath;
												} else {
													item.redirectdomain = JSON.parse(item.redirectdomain);
													name = item.redirectdomain ? item.redirectdomain.join('、') : '空';
												}
												html +=
													'<tr><td>' + name + '</td><td><div class="text-right"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + item.request.msg + '</span></div></td></tr>';
											}
											site.edit.redirect_table.$batch_success_table({
												title: '批量停止服务',
												th: '被重定向',
												html: html,
											});
											site.edit.redirect_table.$refresh_table_list(true);
										});
									});
								},
							},
							{
								title: '删除重定向规则',
								url: '/site?action=del_redirect_multiple',
								// param: { site_id: web.id },
								// paramId: 'redirectname',
								// paramName: 'redirectnames',
								// theadName: '重定向名称',
								// confirmVerify: false, // 是否提示验证方式
								// refresh: true,
								param: function (row) {
									return {
										site_id: web.id,
										redirectnames: row.redirectname,
									};
								},
								callback: function (that) {
									bt.simple_confirm(
										{
											title: '批量删除重定向规则',
											msg: '批量删除当前选中的规则后，配置的重定向域名/目录将会彻底失效，是否继续操作？',
										},
										function (index) {
											layer.close(index);
											var param = {};
											that.start_batch(param, function (list) {
												var html = '';
												for (var i = 0; i < list.length; i++) {
													var item = list[i];
													var name = '';
													if (item.domainorpath == 'path' && item.errorpage !== 1) {
														name = item.redirectpath;
													} else {
														name = item.redirectdomain ? item.redirectdomain.join('、') : '空';
													}
													html +=
														'<tr><td>' +
														name +
														'</td><td><div class="text-right"><span style="color:' +
														(item.request.status ? '#20a53a' : 'red') +
														'">' +
														(item.request.status ? '删除成功' : '删除失败') +
														'</span></div></td></tr>';
												}
												site.edit.redirect_table.$batch_success_table({
													title: '批量删除操作完成！',
													th: '被重定向',
													html: html,
												});
												site.edit.redirect_table.$refresh_table_list(true);
											});
										}
									);
								},
							},
						],
					},
				],
			});
		},
		templet_proxy: function (sitename, type, obj) {
			if (type) {
				obj = { type: 1, cache: 0, proxyname: '', proxydir: '/', proxysite: 'http://', cachetime: 1, todomain: '$host', subfilter: [{ sub1: '', sub2: '' }] };
			}
			var sub_conter = '';
			if (typeof obj.subfilter === 'string') obj.subfilter = JSON.parse(obj.subfilter);
			for (var i = 0; i < obj.subfilter.length; i++) {
				if (i == 0 || obj.subfilter[i]['sub1'] != '') {
					sub_conter +=
						"<div class='sub-groud'>" +
						"<input name='rep" +
						((i + 1) * 2 - 1) +
						"' class='bt-input-text mr10' placeholder='被替换的文本,可留空' type='text' style='width:200px' value='" +
						obj.subfilter[i]['sub1'] +
						"'>" +
						"<input name='rep" +
						(i + 1) * 2 +
						"' class='bt-input-text ml10' placeholder='替换为,可留空' type='text' style='width:200px' value='" +
						obj.subfilter[i]['sub2'] +
						"'>" +
						"<a href='javascript:;' class='proxy_del_sub' style='color:red;'>删除</a>" +
						'</div>';
				}
				if (i == 2) $('.add-replace-prosy').attr('disabled', 'disabled');
			}
			var helps = [
				'代理目录：访问这个目录时将会把目标URL的内容返回并显示(需要开启高级功能)',
				'目标URL：可以填写你需要代理的站点，目标URL必须为可正常访问的URL，否则将返回错误',
				'发送域名：将域名添加到请求头传递到代理服务器，默认为目标URL域名，若设置不当可能导致代理无法正常运行',
				'内容替换：只能在使用nginx时提供，最多可以添加3条替换内容,如果不需要替换请留空',
			];
			var form_proxy = bt.open({
				type: 1,
				skin: 'demo-class',
				area: '650px',
				title: type ? '创建反向代理' : '修改反向代理[' + obj.proxyname + ']',
				closeBtn: 2,
				shift: 5,
				shadeClose: false,
				content:
					"<form id='form_proxy' class='divtable pd15' style='padding-bottom: 60px'>" +
					"<div class='line' style='overflow:hidden'>" +
					"<span class='tname' style='position: relative;top: -5px;'>开启代理</span>" +
					"<div class='info-r  ml0 mt5' >" +
					"<input class='btswitch btswitch-ios' id='openVpn' type='checkbox' name='type' " +
					(obj.type == 1 ? 'checked="checked"' : '') +
					"><label class='btswitch-btn phpmyadmin-btn' for='openVpn' style='float:left'></label>" +
					"<div style='display:" +
					(bt.get_cookie('serverType') == 'nginx' ? ' inline-block' : 'none') +
					"'>" +
					"<span class='tname' style='margin-left:15px;position: relative;top: -5px;'>开启缓存</span>" +
					"<input class='btswitch btswitch-ios' id='openNginx' type='checkbox' name='cache' " +
					(obj.cache == 1 ? 'checked="checked"' : '') +
					"'><label class='btswitch-btn phpmyadmin-btn' for='openNginx'></label>" +
					'</div>' +
					"<div style='display: inline-block;'>" +
					"<span class='tname' style='margin-left:10px;position: relative;top: -5px;'>高级功能</span>" +
					"<input class='btswitch btswitch-ios' id='openAdvanced' type='checkbox' name='advanced' " +
					(obj.advanced == 1 ? 'checked="checked"' : '') +
					"'><label class='btswitch-btn phpmyadmin-btn' for='openAdvanced'></label>" +
					'</div>' +
					'</div>' +
					'</div>' +
					"<div class='line' style='clear:both;'>" +
					"<span class='tname'>代理名称</span>" +
					"<div class='info-r  ml0'><input name='proxyname'" +
					(type ? '' : "readonly='readonly'") +
					" class='bt-input-text mr5 " +
					(type ? '' : ' disabled') +
					"' type='text' style='width:200px' value='" +
					obj.proxyname +
					"'></div>" +
					'</div>' +
					"<div class='line cachetime' style='display:" +
					(obj.cache == 1 ? 'block' : 'none') +
					"'>" +
					"<span class='tname'>缓存时间</span>" +
					"<div class='info-r  ml0'><input name='cachetime'class='bt-input-text mr5' type='text' style='width:200px' value='" +
					obj.cachetime +
					"'>分钟</div>" +
					'</div>' +
					"<div class='line advanced'  style='display:" +
					(obj.advanced == 1 ? 'block' : 'none') +
					"'>" +
					"<span class='tname'>代理目录</span>" +
					"<div class='info-r  ml0'><input id='proxydir' name='proxydir' class='bt-input-text mr5' type='text' style='width:200px' value='" +
					obj.proxydir +
					"'>" +
					'</div>' +
					'</div>' +
					"<div class='line'>" +
					"<span class='tname'>目标URL</span>" +
					"<div class='info-r  ml0'>" +
					"<input name='proxysite' class='bt-input-text mr10' type='text' style='width:200px' value='" +
					obj.proxysite +
					"'>" +
					"<span class='mlr15'>发送域名</span><input name='todomain' class='bt-input-text ml10' type='text' style='width:200px' value='" +
					obj.todomain +
					"'>" +
					'</div>' +
					'</div>' +
					"<div class='line replace_conter' style='display:" +
					(bt.get_cookie('serverType') == 'nginx' ? 'block' : 'none') +
					"'>" +
					"<span class='tname'>内容替换</span>" +
					"<div class='info-r  ml0 '>" +
					sub_conter +
					'</div>' +
					'</div>' +
					"<div class='line' style='display:" +
					(bt.get_cookie('serverType') == 'nginx' ? 'block' : 'none') +
					"'>" +
					"<div class='info-r  ml0'>" +
					"<button class='btn btn-success btn-sm btn-title add-replace-prosy' type='button'><span class='glyphicon cursor glyphicon-plus  mr5' ></span>添加内容替换</button>" +
					'</div>' +
					'</div>' +
					"<ul class='help-info-text c7'>" +
					bt.render_help(helps) +
					"<div class='bt-form-submit-btn'><button type='button' class='btn btn-sm btn-danger btn-colse-prosy'>关闭</button><button type='button' class='btn btn-sm btn-success btn-submit-prosy'>" +
					(type ? ' 提交' : '保存') +
					'</button></div>' +
					'</form>',
			});
			bt.set_cookie('form_proxy', form_proxy);
			$('.add-replace-prosy').click(function () {
				var length = $('.replace_conter .sub-groud').length;
				if (length == 2) $(this).attr('disabled', 'disabled');
				var conter =
					"<div class='sub-groud'>" +
					"<input name='rep" +
					(length * 2 + 1) +
					"' class='bt-input-text mr10' placeholder='被替换的文本,可留空' type='text' style='width:200px' value=''>" +
					"<input name='rep" +
					(length * 2 + 2) +
					"' class='bt-input-text ml10' placeholder='替换为,可留空' type='text' style='width:200px' value=''>" +
					"<a href='javascript:;' class='proxy_del_sub' style='color:red;'>删除</a>" +
					'</div>';
				$('.replace_conter .info-r').append(conter);
			});
			$('[name="proxysite"]').keyup(function () {
				var val = $(this).val(),
					ip_reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
				val = val.replace(/^http[s]?:\/\//, '');
				// val = val.replace(/:([0-9]*)$/, '');
				val = val.replace(/(:|\?|\/|\\)(.*)$/, '');
				if (ip_reg.test(val)) {
					$("[name='todomain']").val('$host');
				} else {
					$("[name='todomain']").val(val);
				}
			});
			$('#openAdvanced').click(function () {
				if ($(this).prop('checked')) {
					$('.advanced').show();
				} else {
					$('.advanced').hide();
				}
			});
			$('#openNginx').click(function () {
				if ($(this).prop('checked')) {
					$('.cachetime').show();
				} else {
					$('.cachetime').hide();
				}
			});
			$('.btn-colse-prosy').click(function () {
				form_proxy.close();
			});
			$('.replace_conter').on('click', '.proxy_del_sub', function () {
				$(this).parent().remove();
				$('.add-replace-prosy').removeAttr('disabled');
			});
			$('.btn-submit-prosy').click(function () {
				var form_proxy_data = {};
				$.each($('#form_proxy').serializeArray(), function () {
					if (form_proxy_data[this.name]) {
						if (!form_proxy_data[this.name].push) {
							form_proxy_data[this.name] = [form_proxy_data[this.name]];
						}
						form_proxy_data[this.name].push(this.value || '');
					} else {
						form_proxy_data[this.name] = this.value || '';
					}
				});
				form_proxy_data['type'] = form_proxy_data['type'] == undefined ? 0 : 1;
				form_proxy_data['cache'] = form_proxy_data['cache'] == undefined ? 0 : 1;
				form_proxy_data['advanced'] = form_proxy_data['advanced'] == undefined ? 0 : 1;
				form_proxy_data['sitename'] = sitename;
				form_proxy_data['subfilter'] = JSON.stringify([
					{ sub1: form_proxy_data['rep1'] || '', sub2: form_proxy_data['rep2'] || '' },
					{ sub1: form_proxy_data['rep3'] || '', sub2: form_proxy_data['rep4'] || '' },
					{ sub1: form_proxy_data['rep5'] || '', sub2: form_proxy_data['rep6'] || '' },
				]);
				for (var i in form_proxy_data) {
					if (i.indexOf('rep') != -1) {
						delete form_proxy_data[i];
					}
				}
				if (type) {
					bt.site.create_proxy(form_proxy_data, function (rdata) {
						if (rdata.status) {
							form_proxy.close();
							site.reload(12);
						}
						bt.msg(rdata);
					});
				} else {
					bt.site.modify_proxy(form_proxy_data, function (rdata) {
						if (rdata.status) {
							form_proxy.close();
							site.reload(12);
						}
						bt.msg(rdata);
					});
				}
			});
		},
		set_proxy: function (web) {
			$('#webedit-con').html('<div id="proxy_list" class="bt_table"></div>');
			String.prototype.myReplace = function (f, e) {
				//吧f替换成e
				var reg = new RegExp(f, 'g'); //创建正则RegExp对象
				return this.replace(reg, e);
			};
			var proxy_list_table = bt_tools.table({
				el: '#proxy_list',
				url: '/site?action=GetProxyList',
				param: { sitename: web.name },
				dataFilter: function (res) {
					return { data: res };
				},
				column: [
					{ type: 'checkbox', width: 20 },
					{ fid: 'proxyname', title: '名称', type: 'text' },
					{ fid: 'proxydir', title: '代理目录', type: 'text' },
					{
						fid: 'proxysite',
						title: '目标url',
						type: 'link',
						href: true,
						template: function (row) {
							return '<span style="width: 160px;" class="fixed"><a class="btlink" href="' + row.proxysite + '" target="_blank" title="' + row.proxysite + '">' + row.proxysite + '</a></span>';
						},
					},
					bt.get_cookie('serverType') == 'nginx'
						? {
								fid: 'cache',
								title: '缓存',
								config: {
									icon: false,
									list: [
										[1, '已开启', 'bt_success'],
										[0, '已关闭', 'bt_danger'],
									],
								},
								type: 'status',
								event: function (row, index, ev, key, that) {
									row['cache'] = !row['cache'] ? 1 : 0;
									row['subfilter'] = JSON.stringify(row['subfilter']).replaceAll(/[\\]/g, '').replace('"[', '[').replace(']"', ']');
									bt.site.modify_proxy(row, function (rdata) {
										if (rdata.status) site.reload();
										bt.msg(rdata);
									});
								},
						  }
						: {},
					{
						fid: 'type',
						title: '状态',
						config: {
							icon: true,
							list: [
								[1, '运行中', 'bt_success', 'glyphicon-play'],
								[0, '已暂停', 'bt_danger', 'glyphicon-pause'],
							],
						},
						type: 'status',
						event: function (row, index, ev, key, that) {
							row['type'] = !row['type'] ? 1 : 0;
							row['subfilter'] = JSON.stringify(row['subfilter']).replaceAll(/[\\]/g, '').replace('"[', '[').replace(']"', ']');
							bt.site.modify_proxy(row, function (rdata) {
								if (rdata.status) site.reload();
								bt.msg(rdata);
							});
						},
					},
					{
						title: '操作',
						width: 150,
						type: 'group',
						align: 'right',
						group: [
							{
								title: '配置文件',
								event: function (row, index, ev, key, that) {
									var type = '';
									try {
										type = bt.get_cookie('serverType') || serverType;
									} catch (err) {}
									bt.site.get_proxy_config(
										{
											sitename: web.name,
											proxyname: row.proxyname,
											webserver: type,
										},
										function (rdata) {
											if ($.isPlainObject(rdata) && !rdata.status) {
												bt_tools.msg(rdata);
												return;
											}
											if (Array.isArray(rdata) && !rdata[0].status) {
												bt_tools.msg(rdata[0]);
												return;
											}
											// if (typeof rdata == 'object' && rdata.constructor == Array) {
											//   if (!rdata[0].status) bt.msg(rdata)
											// } else {
											//   if (!rdata.status) bt.msg(rdata)
											// }
											bt.open({
												type: 1,
												area: ['550px', '550px'],
												title: '编辑配置文件[' + row.proxyname + ']',
												closeBtn: 2,
												shift: 0,
												content:
													"<div class='bt-form pd15'>" +
													'<p style="color: #666; margin-bottom: 7px">提示：Ctrl+F 搜索关键字，Ctrl+S 保存，Ctrl+H 查找替换</p>' +
													'<div id="redirect_config_con" class="bt-input-text ace_config_editor_scroll" style="height:350px;line-height: 18px;"></div>' +
													'<button id="OnlineEditFileBtn" class="btn btn-success btn-sm" style="margin-top:10px;">保存</button>' +
													'<ul class="help-info-text c7"><li>此处为该负载均衡的配置文件，若您不了解配置规则,请勿随意修改。</li></ul>' +
													'</div>',
												success: function (layers, indexs) {
													var editor = bt.aceEditor({
														el: 'redirect_config_con',
														content: rdata[0].data,
														mode: 'nginx',
														saveCallback: function (val) {
															bt.site.save_redirect_config({ path: rdata[1], data: val, encoding: rdata[0].encoding }, function (ret) {
																if (ret.status) {
																	site.reload(11);
																	layer.close(indexs);
																}
																bt.msg(ret);
															});
														},
													});
													$('#OnlineEditFileBtn').click(function () {
														bt.saveEditor(editor);
													});
												},
											});
										}
									);
								},
							},
							{
								title: '编辑',
								event: function (row, index, ev, key, that) {
									site.edit.templet_proxy(web.name, false, row);
								},
							},
							{
								title: '删除',
								event: function (row, index, ev, key, that) {
									bt.site.remove_proxy(web.name, row.proxyname, function (rdata) {
										if (rdata.status) that.$delete_table_row(index);
									});
								},
							},
						],
					},
				],
				tootls: [
					{
						//按钮组
						type: 'group',
						positon: ['left', 'top'],
						list: [
							{
								title: '添加反向代理',
								active: true,
								event: function (ev) {
									site.edit.templet_proxy(web.name, true);
								},
							},
						],
					},
					{
						//批量操作
						type: 'batch',
						positon: ['left', 'bottom'],
						placeholder: '请选择批量操作',
						buttonValue: '批量操作',
						disabledSelectValue: '请选择需要批量操作的任务!',
						selectList: [
							{
								title: '启用反向代理规则',
								url: '/site?action=ModifyProxy',
								param: function (row) {
									row.type = 1;
									row['subfilter'] = JSON.stringify(row['subfilter']).replaceAll(/[\\]/g, '').replace('"[', '[').replace(']"', ']');
									return row;
								},
								callback: function (that) {
									// 手动执行,data参数包含所有选中的站点
									bt.confirm({ title: '批量启用反向代理规则', msg: '批量启用当前选中的规则后，配置的反向代理规则将继续生效，是否继续操作？' }, function (index) {
										layer.close(index);
										var param = {};
										that.start_batch(param, function (list) {
											var html = '';
											for (var i = 0; i < list.length; i++) {
												var item = list[i];
												html +=
													'<tr><td>' +
													item.proxyname +
													'</td><td><div style="float:right;"><span style="color:' +
													(item.request.status ? '#20a53a' : 'red') +
													'">' +
													item.request.msg +
													'</span></div></td></tr>';
											}
											proxy_list_table.$batch_success_table({
												title: '批量启用反向代理规则',
												th: '反向代理名称',
												html: html,
											});
											proxy_list_table.$refresh_table_list(true);
										});
									});
								},
							},
							{
								title: '停用反向代理规则',
								url: '/site?action=ModifyProxy',
								param: function (row) {
									row.type = 0;
									row['subfilter'] = JSON.stringify(row['subfilter']).replaceAll(/[\\]/g, '').replace('"[', '[').replace(']"', ']');
									return row;
								},
								callback: function (that) {
									// 手动执行,data参数包含所有选中的站点
									bt.confirm({ title: '批量停用反向代理规则', msg: '批量停用当前选中的规则后，配置的反向代理规则将会失效，是否继续操作？' }, function (index) {
										layer.close(index);
										var param = {};
										that.start_batch(param, function (list) {
											var html = '';
											for (var i = 0; i < list.length; i++) {
												var item = list[i];
												html +=
													'<tr><td>' +
													item.proxyname +
													'</td><td><div style="float:right;"><span style="color:' +
													(item.request.status ? '#20a53a' : 'red') +
													'">' +
													item.request.msg +
													'</span></div></td></tr>';
											}
											proxy_list_table.$batch_success_table({
												title: '批量停用反向代理规则',
												th: '反向代理名称',
												html: html,
											});
											proxy_list_table.$refresh_table_list(true);
										});
									});
								},
							},
							{
								title: '删除反向代理规则',
								url: '/site?action=del_proxy_multiple',
								param: { site_id: web.id },
								paramId: 'proxyname',
								paramName: 'proxynames',
								theadName: '反向代理名称',
								confirmVerify: false, // 是否提示验证方式
								refresh: true,
								callback: function (that) {
									// 手动执行,data参数包含所有选中的站点
									bt.simple_confirm({ title: '批量删除反向代理规则', msg: '批量删除当前选中的规则后，配置的反向代理规则将会彻底失效，是否继续操作？' }, function () {
										var param = {};
										that.start_batch(param, function (list) {
											var html = '';
											for (var i = 0; i < list.length; i++) {
												var item = list[i];
												html +=
													'<tr><td>' +
													item.proxyname +
													'</td><td><div style="float:right;"><span style="color:' +
													(item.request.status ? '#20a53a' : 'red') +
													'">' +
													item.request.msg +
													'</span></div></td></tr>';
											}
											proxy_list_table.$batch_success_table({
												title: '批量删除反向代理规则',
												th: '反向代理名称',
												html: html,
											});
											proxy_list_table.$refresh_table_list(true);
										});
									});
								},
							},
						],
					},
				],
				success: function () {
					$('#proxy_list .help-info-text').remove();
					$('#proxy_list').append(bt.render_help(['设置了反向代理后，【访问限制】中的相应路径的规则将会失效']));
				},
			});
		},
		set_security: function (web) {
			bt.site.get_site_security(web.id, web.name, function (rdata) {
				if (typeof rdata == 'object' && rdata.status === false && rdata.msg) {
					bt.msg(rdata);
					return;
				}
				var robj = $('#webedit-con');
				var datas = [
					{ title: 'URL后缀', name: 'sec_fix', value: rdata.fix, width: '300px' },
					{ title: '许可域名', type: 'textarea', name: 'sec_domains', value: rdata.domains.replace(/,/g, '\n'), width: '300px', height: '210px' },
					{ title: '响应资源', name: 'return_rule', value: rdata.return_rule, width: '300px' },
					{
						title: ' ',
						class: 'label-input-group',
						items: [
							{
								text: '启用防盗链',
								name: 'door_status',
								value: rdata.status,
								type: 'checkbox',
								callback: function (sdata) {
									if (sdata.door_status) {
										$('#http_status').removeAttr('disabled');
									} else {
										$('#http_status').attr({
											disabled: 'disabled',
											checked: false,
										});
									}
								},
							},
							{
								text: '允许空HTTP_REFERER请求',
								name: 'http_status',
								value: rdata.http_status,
								type: 'checkbox',
								callback: function (sdata) {
									if (!$('#door_status').prop('checked')) {
										layer.msg('请先开启防盗链', { icon: 2 });
										$('#http_status').prop('checked', false);
									}
								},
							},
						],
					},
					{
						class: 'label-input-group',
						items: [
							{
								name: 'btn_save',
								type: 'button',
								text: '保存',
								class: 'ml0',
								callback: function (sdata) {
									if (sdata.sec_fix === '') {
										bt_tools.msg({ status: false, msg: 'URL后缀不能为空！' });
										return false;
									}
									if (sdata.sec_domains === '') {
										bt_tools.msg({ status: false, msg: '许可域名不能为空！' });
										return false;
									}
									if (sdata.return_rule === '') {
										bt_tools.msg({ status: false, msg: '响应资源不能为空！' });
										return false;
									}
									bt.site.set_site_security(web.id, web.name, sdata.sec_fix, sdata.sec_domains.split('\n').join(','), sdata.door_status, sdata.return_rule, sdata.http_status, function (ret) {
										if (ret.status) site.reload(13);
										bt.msg(ret);
									});
								},
							},
						],
					},
				];
				for (var i = 0; i < datas.length; i++) {
					var _form_data = bt.render_form_line(datas[i]);
					robj.append(_form_data.html);
					bt.render_clicks(_form_data.clicks);
				}
				var helps = [
					'【URL后缀】一般填写文件后缀,每个文件后缀使用","分隔,如: png,jpg',
					'【许可域名】允许作为来路的域名，每行一个域名,如: www.bt.cn',
					'【响应资源】可设置404/403等状态码，也可以设置一个有效资源，如：/security.png',
					'【允许空HTTP_REFERER请求】是否允许浏览器直接访问，若您的网站访问异常，可尝试开启此功能',
				];
				robj.append(bt.render_help(helps));
			});
		},
		//设置防篡改
		set_tamper: function (web) {
			bt.soft.get_soft_find('tamper_core', function (core_res) {
				bt.soft.get_soft_find('tamper_proof', function (proof_res) {
					if (core_res.setup && core_res.endtime > -1) {
						//购买安装了防篡改 并且未过期
						site.edit.set_tamper_core(web);
						return;
					}
					if (proof_res.setup && proof_res.endtime > -1) {
						//购买安装了防篡改 并且未过期
						site.edit.set_tamper_proof(web);
						return;
					}
					site.edit.render_recommend_product(core_res.endtime > -1, proof_res.endtime > -1);
				});
			});
		},
		//设置网站防篡改
		set_tamper_proof: function (web) {
			if (site.edit.render_recommend_product()) {
				$('#webedit-con').append('<div id="tabTamperProof" class="tab-nav"></div><div class="tab-con" style="padding:15px 0px;"></div>');
				var file_path = '',
					log_data = [];
				var _tab = [
					{
						title: '概览',
						on: true,
						callback: function (robj) {
							getTampreProof(bt.get_date(0), function (rdata) {
								var _headbox =
									'<div class="tamper-open" style="height: 30px;">\
                    <span class="pull-left" style="line-height: 22px;margin-right: 5px;">防篡改开关</span>\
                    <div class="tamper-switch pull-left">\
                      <input class="btswitch btswitch-ios" id="tamperSwitch" type="checkbox">\
                      <label class="btswitch-btn" for="tamperSwitch"></label>\
                    </div>\
                    <div class="searcTime pull-right" style="margin-right: 1px;margin-top:0px">\
                      <span class="gt on">今日</span>\
                      <span class="gt">昨日</span>\
                      <span class="last-gt"><input id="tamperProofSelect" type="text" value=""></span>\
                    </div>\
                </div>';
								var _totalbox =
									'<div class="divtable tamperProofTable">\
                <table class="table table-hover table-bordered" style="width: 640px;margin:15px 0;background-color:#fafafa">\
                  <tbody><tr><th>总拦截次数</th><td>' +
									rdata.totalNum +
									'</td><th>当日拦截次数</th><td>' +
									rdata.theNum +
									'</td></tr></tbody>\
                </table>\
              </div><div class="bt-logs" style="height: 500px;">\
                <div class="divtable">\
                    <div id="site_anti_log" style="max-height:400px;overflow:auto;border:#ddd 1px solid">\
                    <table class="table table-hover" style="border:none;">\
                      <thead><tr><th width="138">时间</th><th width="48">类型</th><th>文件</th><th width="68">溯源日志</th><th width="68">状态</th></tr></thead>\
                      <tbody id="LogDayCon"></tbody>\
                    </table>\
                    </div>\
                    <p class="mtb10 c9" style="border: #ddd 1px solid;padding: 5px 8px;float: right;">共<span id="logs_len">0</span>条记录</p>\
                  </div>\
                  <ul class="help-info-text c7" style="position: absolute;bottom: 10px;">\
                    <li>如果开启防篡改后您的网站出现异常，请尝试排除网站日志、缓存、临时文件、上传等目录后重试，或直接关闭异常网站防篡改功能</li>\
                  </ul>\
              </div>';
								robj.append(_headbox + _totalbox);
								renderTampreProofLog(bt.get_date(0));
								tableFixed('site_anti_log');
								$('#tamperSwitch').prop('checked', rdata.open); //开关
								$('[for=tamperSwitch]').click(function () {
									var _status = $('#tamperSwitch').prop('checked');
									layer.confirm(
										'是否' + (_status ? '关闭' : '开启') + '网站防篡改程序',
										{
											title: '防篡改开关',
											icon: 3,
											closeBtn: 2,
											cancel: function () {
												$('#tamperSwitch').prop('checked', _status);
											},
										},
										function () {
											var loadT = layer.msg('正在设置站点防篡改状态，请稍侯...', {
												icon: 16,
												time: 0,
												shade: 0.3,
											});
											$.post(
												'/plugin?action=a&s=set_site_status&name=tamper_proof',
												{
													siteName: web.name,
												},
												function (rdata) {
													layer.close(loadT);
													layer.msg(rdata.msg, {
														icon: rdata.status ? 1 : 2,
													});
												}
											);
										},
										function () {
											$('#tamperSwitch').prop('checked', _status);
										}
									);
								});
								// 日期选择
								$('.searcTime span')
									.not('.last-gt')
									.click(function () {
										$(this).addClass('on').siblings().removeClass('on');
										switch ($(this).index()) {
											case 0:
												updateTampreProofInfo(bt.get_date(0));
												break;
											case 1:
												updateTampreProofInfo(bt.get_date(-1));
												break;
										}
									});
								//自定义时间
								laydate.render({
									elem: '#tamperProofSelect',
									value: new Date(),
									max: 0,
									done: function (value) {
										updateTampreProofInfo(value);
										$('.last-gt').addClass('on').siblings().removeClass('on');
									},
								});
							});
						},
					},
					{
						title: '排除目录',
						callback: function (robj) {
							robj.append(
								'<div><div class="anti_rule_add"><input style="display:none;" id="select-exclude" value="' +
									file_path +
									'" />\
                <textarea id="input-exclude" class="bt-input-text mr5" type="rule" placeholder="排除目录或文件,每行一条" spellcheck="false" style="margin: 0px 5px -10px 0px; width: 449px; height: 68px; line-height: 18px;"></textarea>\
                <span style="margin-right: 10px;position: fixed;top: 100px;" class="glyphicon glyphicon-folder-open cursor" onclick="bt.select_path(\'select-exclude\',\'all\')" title="点击选择文件或目录"></span>\
                <button class="btn btn-default btn-sm va0 add_exclude_path">添加排除</button>\
                </div>\
                <div class="anti_rule_list rule_out_box" style="margin-top: 10px;">\
                  <div class="divtable bt_table">\
                    <div id="site_exclude_path" style="max-height:320px;overflow:auto;border:#ddd 1px solid">\
                      <table class="table table-hover" style="border:none">\
                        <thead>\
                          <tr><th width="34px">\
                            <span>\
                              <label>\
                                <i class="cust—checkbox cursor-pointer" data-checkbox="all"></i>\
                                <input type="checkbox" class="cust—checkbox-input" />\
                              </label>\
                            </span></th><th>名称或路径</th><th class="text-right">操作</th></tr>\
                      </thead>\
                      <tbody id="site_exclude_path_con">\
                      </tbody>\
                    </table>\
                    </div>\
                    <div class="bt_batch mt10">\
                      <label>\
                        <i class="cust—checkbox cursor-pointer" data-checkbox="all"></i>\
                        <input type="checkbox" class="cust—checkbox-input" />\
                      </label>\
                      <select class="bt-input-text mr5" name="status" disabled="disabled" style="height:28px;color: #666;" placeholder="请选择批量操作">\
                        <option style="color: #b6b6b6;display:none;" disabled selected>请选择批量操作</option>\
                        <option value="1">删除选中</option>\
                      </select>\
                      <button class="btn btn-success btn-sm setBatchStatus" disabled="disabled">批量操作</button>\
                    </div>\
                  </div>\
                </div>\
                <ul class="help-info-text c7">\
                  <li>在此列表中的目录或文件名将不受保护</li>\
                  <li>可以是目录或文件名称,也可以是完整绝对路径,如: cache或/www/wwwroot/bt.cn/cache/</li>\
                  <li>目录或文件名称在完全匹配的情况下生效,绝对路径则使用从左到右匹配成功时生效</li>\
                </ul>\
            </div>'
							);
							// 选择文件
							$('#select-exclude').change(function () {
								var exclude = $('#input-exclude').val();
								var select_exclude = $(this).val();
								$(this).val(file_path);
								if (exclude) {
									exclude += '\n' + select_exclude;
								} else {
									exclude = select_exclude + '\n';
								}

								$('#input-exclude').val(exclude);
							});
							//添加排除
							$('.add_exclude_path').click(function () {
								var path = $('#input-exclude');
								var loadT = layer.msg('正在添加排除目录，请稍候...', {
									icon: 16,
									time: 0,
									shade: 0.3,
								});
								if (path.val() == '') return layer.msg('请输入或选择需要排除的目录');
								$.post('/plugin?action=a&s=add_excloud&name=tamper_proof', { siteName: web.name, excludePath: path.val() }, function (rdata) {
									layer.close(loadT);
									if (rdata.status) {
										renderExcludePath(function () {
											bt.msg(rdata);
											path.val('');
										});
									} else {
										bt.msg(rdata);
									}
								});
							});
							renderExcludePath();
							tableFixed('site_exclude_path');
						},
					},
					{
						title: '保护文件/扩展名',
						callback: function (robj) {
							robj.append(
								'<div><div class="anti_rule_add">\
            <input style="display:none;" id="select-safe" value="' +
									file_path +
									'" />\
            <textarea id="input-safe" class="bt-input-text mr5" type="rule" placeholder="受保护的文件或扩展名,每行一条" spellcheck="false" style="margin: 0px 5px -10px 0px; width: 449px; height: 68px; line-height: 18px;"></textarea>\
            <span style="margin-right: 10px;position: fixed;top: 100px;" class="glyphicon glyphicon-folder-open cursor" onclick="bt.select_path(\'select-safe\',\'all\')" title="点击选择文件"></span>\
            <button class="btn btn-default btn-sm va0 add_protect_ext">添加保护</button></div>\
                <div class="anti_rule_list rule_protect_box" style="margin-top: 10px;">\
                  <div class="divtable bt_table">\
                    <div id="site_protect_ext" style="max-height:320px;overflow:auto;border:#ddd 1px solid">\
                    <table class="table table-hover" style="border:none">\
                      <thead>\
                        <tr><th width="34px">\
                          <span>\
                            <label>\
                              <i class="cust—checkbox cursor-pointer" data-checkbox="all"></i>\
                              <input type="checkbox" class="cust—checkbox-input" />\
                            </label>\
                          </span></th><th>扩展名/文件名</th><th class="text-right">操作</th></tr>\
                      </thead>\
                      <tbody id="site_protect_ext_con">\
                      </tbody>\
                    </table>\
                    </div>\
                    <div class="bt_batch mt10">\
                    <label>\
                      <i class="cust—checkbox cursor-pointer" data-checkbox="all"></i>\
                      <input type="checkbox" class="cust—checkbox-input" />\
                    </label>\
                    <select class="bt-input-text mr5" name="status" disabled="disabled" style="height:28px;color: #666;" placeholder="请选择批量操作">\
                      <option style="color: #b6b6b6;display:none;" disabled selected>请选择批量操作</option>\
                      <option value="1">删除选中</option>\
                    </select>\
                    <button class="btn btn-success btn-sm setBatchStatus" disabled="disabled">批量操作</button>\
                  </div></div>\
                  </div>\
                <ul class="help-info-text c7">\
                  <li>可以是文件扩展名(如:php等)，也可以是文件名</li>\
                  <li>一般添加常见容易被篡改的扩展名即可，如html,php,js等 </li>\
                </ul>\
                </div>'
							);
							//选择文件或扩展名
							$('#select-safe').change(function () {
								var safe = $('#input-safe').val();
								var select_safe = $(this).val();
								$(this).val(file_path);
								if (safe) {
									safe += '\n' + select_safe;
								} else {
									safe = select_safe + '\n';
								}
								$('#input-safe').val(safe);
							});
							//添加保护
							$('.add_protect_ext').click(function () {
								var ext = $('#input-safe');
								var loadT = layer.msg('正在添加受保护文件或类型，请稍候..', {
									icon: 16,
									time: 0,
									shade: 0.3,
								});
								if (ext.val() == '') return layer.msg('请输入或选择需要保护的目录');
								$.post('/plugin?action=a&s=add_protect_ext&name=tamper_proof', { siteName: web.name, protectExt: ext.val() }, function (rdata) {
									layer.close(loadT);
									if (rdata.status) {
										renderProtectExt(function () {
											bt.msg(rdata);
											ext.val('');
										});
									} else {
										bt.msg(rdata);
									}
								});
							});
							renderProtectExt();
							tableFixed('site_protect_ext');
						},
					},
				];
				bt.render_tab('tabTamperProof', _tab);

				$('#tabTamperProof span:eq(0)').click();
				/**
				 * @descripttion: 请求防篡改数据
				 * @param {String} time 查询的时间
				 */
				function getTampreProof(time, callback) {
					var loadT = layer.msg('正在获取站点防篡改信息，请稍侯...', {
						icon: 16,
						time: 0,
						shade: 0.3,
					});
					$.get('/plugin?action=a&s=get_index&name=tamper_proof', { day: time }, function (res) {
						layer.close(loadT);
						$.each(res.sites, function (index, item) {
							if (item.siteName === web.name) {
								item['theNum'] = item.total.day.total;
								item['totalNum'] = item.total.site.total;
								file_path = item.path;
								if (callback) callback(item);
							}
						});
					});
				}

				/**
				 * @descripttion: 更新防篡改数据
				 * @param {String} time 查询的时间
				 */
				function updateTampreProofInfo(time) {
					getTampreProof(time, function (res) {
						$('.tamperProofTable td').eq(0).html(res.totalNum);
						$('.tamperProofTable td').eq(1).html(res.theNum);
						renderTampreProofLog(time);
					});
				}
				/**
				 * @descripttion: 渲染防篡改日志
				 * @param {String} time 查询的时间
				 */
				function renderTampreProofLog(time) {
					var _tbody = '';
					$.get('/plugin?action=a&s=get_safe_logs&name=tamper_proof', { siteName: web.name, day: time }, function (res) {
						if (res.logs.length > 0) {
							log_data = res.logs;
							$.each(res.logs, function (index, item) {
								var txt = '';
								switch (item[1]) {
									case 'create':
										txt = '创建';
										break;
									case 'delete':
										txt = '删除';
										break;
									case 'modify':
										txt = '修改';
										break;
									case 'move':
										txt = '移动';
										break;
								}
								_tbody +=
									'<tr>\
                    <td>' +
									bt.format_data(item[0]) +
									'</td>\
                    <td>' +
									txt +
									'</td>\
                    <td>' +
									item[2] +
									'</td>\
                    <td>' +
									'<a class="btlink get_traceability_log">溯源日志</a>' +
									'</td>\
                    <td>防护成功</td>\
                    </tr>';
							});
						} else {
							_tbody = '<tr><td colspan="5">暂无日志数据</td></tr>';
						}
						$('#LogDayCon').html(_tbody);
						$('#logs_len').html(res.logs.length);
						$('#LogDayCon').on('click', '.get_traceability_log', function () {
							var index = $(this).parents('tr').index();
							get_traceability_log(index);
						});
					});
				}
				// 获取溯源日志
				function get_traceability_log(index) {
					var item = log_data[index];
					layer.open({
						type: 1,
						title: '溯源日志[' + web.name + ']',
						area: '700px',
						shadeClose: false,
						closeBtn: 2,
						content:
							'<div class="setchmod bt-form ">' +
							'<pre class="run-log" style="overflow: auto; border: 0px none; line-height:23px;padding: 15px; margin: 0px; white-space: pre-wrap; height: 405px; background-color: rgb(51,51,51);color:#f1f1f1;border-radius:0px;font-family: "微软雅黑"">' +
							(item[3].length == '' || !item[3] ? '当前日志为空' : item[3].join('\n')) +
							'</pre>' +
							'</div>',
					});
				}
				//渲染排除列表
				function renderExcludePath(callback) {
					var loadT = layer.msg('正在获取排除列表，请稍候..', {
						icon: 16,
						time: 0,
						shade: 0.3,
					});
					$.post('/plugin?action=a&s=get_site_find&name=tamper_proof', { siteName: web.name }, function (rdata) {
						layer.close(loadT);
						var excludeBody = '';
						for (var i = 0; i < rdata.excludePath.length; i++) {
							excludeBody +=
								'<tr><td><label><i class="cust—checkbox cursor-pointer" data-checkbox="' +
								i +
								'" style="position: initial;"></i><input type="checkbox" class="cust—checkbox-input"></label></td><td>' +
								rdata.excludePath[i] +
								'</td><td class="text-right"><a class="btlink del_exclude_path" data-path="' +
								rdata.excludePath[i] +
								'">删除</a></td></tr>';
						}
						$('#site_exclude_path_con').html(excludeBody);
						$('.rule_out_box .bt_table .cust—checkbox')
							.unbind('click')
							.click(function () {
								var checkbox = $(this).data('checkbox'),
									length = $('#site_exclude_path tbody tr').length,
									active = $(this).hasClass('active'),
									active_length;
								if (checkbox == 'all') {
									if (!active) {
										$('.rule_out_box .cust—checkbox').addClass('active');
										$('.rule_out_box .setBatchStatus,.rule_out_box [name="status"]').removeAttr('disabled');
									} else {
										$('.rule_out_box .cust—checkbox').removeClass('active');
										$('.rule_out_box .setBatchStatus,.rule_out_box [name="status"]').attr('disabled', 'disabled');
									}
								} else {
									if (!active) {
										$(this).addClass('active');
										$('.rule_out_box .setBatchStatus,.rule_out_box [name="status"]').removeAttr('disabled');
									} else {
										$(this).removeClass('active');
									}
								}
								active_length = $('#site_exclude_path tbody tr .cust—checkbox.active').length;
								if (active_length === length) {
									$('.rule_out_box [data-checkbox="all"]').addClass('active');
								} else if (active_length === 0) {
									$('.rule_out_box .setBatchStatus,.rule_out_box [name="status"]').attr('disabled', 'disabled');
								} else {
									$('.rule_out_box [data-checkbox="all"]').removeClass('active');
								}
							});
						$('.rule_out_box .setBatchStatus')
							.unbind('click')
							.click(function () {
								var siteState = parseInt($('.rule_out_box [name="status"]').val()),
									rules = [];
								$('#site_exclude_path tbody tr .cust—checkbox.active').each(function () {
									rules.push(rdata.excludePath[$(this).data('checkbox')]);
								});
								if (isNaN(siteState)) {
									bt.msg({ status: false, msg: '请选择批量操作类型' });
									return false;
								}
								layer.confirm(
									'批量删除选中的名称或路径，该操作可能会存在风险，是否继续？',
									{
										title: '批量删除',
										icon: 3,
										closeBtn: 2,
									},
									function () {
										del_exclude_path(
											{
												siteName: web.name,
												excludePath: rules.join(','),
											},
											'批量删除'
										);
									}
								);
							});
						//单个删除
						$('.del_exclude_path').click(function () {
							del_exclude_path({ siteName: web.name, excludePath: $(this).data('path') }, '删除');
						});
						if (callback) callback(rdata);
					});
				}
				//渲染保护列表
				function renderProtectExt(callback) {
					var loadT = layer.msg('正在获取受保护列表，请稍候..', {
						icon: 16,
						time: 0,
						shade: 0.3,
					});
					$.post('/plugin?action=a&s=get_site_find&name=tamper_proof', { siteName: web.name }, function (rdata) {
						layer.close(loadT);
						var protectBody = '';
						for (var i = 0; i < rdata.protectExt.length; i++) {
							protectBody +=
								'<tr><td><label><i class="cust—checkbox cursor-pointer" data-checkbox="' +
								i +
								'" style="position: initial;"></i><input type="checkbox" class="cust—checkbox-input"></label></td><td>' +
								rdata.protectExt[i] +
								'</td><td class="text-right"><a class="btlink remove_protect_ext" data-path="' +
								rdata.protectExt[i] +
								'">删除</a></td></tr>';
						}
						$('#site_protect_ext_con').html(protectBody);
						$('.rule_protect_box .bt_table .cust—checkbox')
							.unbind('click')
							.click(function () {
								var checkbox = $(this).data('checkbox'),
									length = $('#site_protect_ext tbody tr').length,
									active = $(this).hasClass('active'),
									active_length;
								if (checkbox == 'all') {
									if (!active) {
										$('.rule_protect_box .cust—checkbox').addClass('active');
										$('.rule_protect_box .setBatchStatus,.rule_protect_box [name="status"]').removeAttr('disabled');
									} else {
										$('.rule_protect_box .cust—checkbox').removeClass('active');
										$('.rule_protect_box .setBatchStatus,.rule_protect_box [name="status"]').attr('disabled', 'disabled');
									}
								} else {
									if (!active) {
										$(this).addClass('active');
										$('.rule_protect_box .setBatchStatus,.rule_protect_box [name="status"]').removeAttr('disabled');
									} else {
										$(this).removeClass('active');
									}
								}
								active_length = $('#site_protect_ext tbody tr .cust—checkbox.active').length;
								if (active_length === length) {
									$('.rule_protect_box [data-checkbox="all"]').addClass('active');
								} else if (active_length === 0) {
									$('.rule_protect_box .setBatchStatus,.rule_protect_box [name="status"]').attr('disabled', 'disabled');
								} else {
									$('.rule_protect_box [data-checkbox="all"]').removeClass('active');
								}
							});
						$('.rule_protect_box .setBatchStatus')
							.unbind('click')
							.click(function () {
								var siteState = parseInt($('.rule_protect_box [name="status"]').val()),
									rules = [];
								$('#site_protect_ext tbody tr .cust—checkbox.active').each(function () {
									rules.push(rdata.protectExt[$(this).data('checkbox')]);
								});
								if (isNaN(siteState)) {
									bt.msg({ status: false, msg: '请选择批量操作类型' });
									return false;
								}
								layer.confirm(
									'批量删除选中的扩展名或文件名，该操作可能会存在风险，是否继续？',
									{
										title: '批量删除',
										icon: 3,
										closeBtn: 2,
									},
									function () {
										remove_protect_ext(
											{
												siteName: web.name,
												protectExt: rules.join(','),
											},
											'批量删除'
										);
									}
								);
							});
						//单个删除
						$('.remove_protect_ext').click(function () {
							remove_protect_ext({ siteName: web.name, protectExt: $(this).data('path') }, '删除');
						});
						if (callback) callback(rdata);
					});
				}

				//删除排除目录或文件
				function del_exclude_path(param, title) {
					var loadT = layer.msg('正在' + title + '排除目录，请稍候..', {
						icon: 16,
						time: 0,
						shade: 0.3,
					});
					$.post('/plugin?action=a&s=remove_excloud&name=tamper_proof', param, function (rdata) {
						layer.close(loadT);
						if (rdata.status) {
							renderExcludePath(function () {
								bt.msg(rdata);
							});
						} else {
							bt.msg(rdata);
						}
					});
				}
				//删除保护目录或扩展
				function remove_protect_ext(param, title) {
					var loadT = layer.msg('正在' + title + '受保护文件类型，请稍候..', {
						icon: 16,
						time: 0,
						shade: 0.3,
					});
					$.post('/plugin?action=a&s=remove_protect_ext&name=tamper_proof', param, function (rdata) {
						layer.close(loadT);
						if (rdata.status) {
							renderProtectExt(function () {
								bt.msg(rdata);
							});
						} else {
							bt.msg(rdata);
						}
					});
				}

				//表格头固定
				function tableFixed(name) {
					var tableName = document.querySelector('#' + name);
					tableName.addEventListener('scroll', scrollHandle);
				}
				function scrollHandle(e) {
					var scrollTop = this.scrollTop;
					$(this)
						.find('thead')
						.css({
							transform: 'translateY(' + scrollTop + 'px)',
							position: 'relative',
							'z-index': '1',
						});
				}
			}
		},
		// 设置企业级防篡改
		set_tamper_core: function (web) {
			$('#webedit-con').html('<div id="tabTamperCore" class="tab-nav"></div><div class="tab-con" style="padding:15px 0px;"></div>');
			bt.soft.get_soft_find('tamper_core', function (rdata_res) {
				// 全局变量
				var data = {
					configType: [
						{ title: '创建文件', name: 'create' },
						{ title: '编辑文件', name: 'modify' },
						{ title: '删除文件', name: 'unlink' },
						{ title: '新建文件夹', name: 'mkdir' },
						{ title: '删除文件夹', name: 'rmdir' },
						{ title: '文件重命名', name: 'rename' },
						{ title: '创建软链', name: 'link' },
						{ title: '修改文件权限', name: 'chmod' },
						{ title: '修改所有者', name: 'chown' },
					],
				};
				var _site_tamper_data = {};
				// 判断是否安装企业级防篡改插件
				if (rdata_res.setup && rdata_res.endtime > -1) {
					// 获取保护列表
					bt_tools.send({ url: '/tamper_core/get_tamper_paths.json' }, function (rdata) {
						// 获取当前站点的防篡改列表
						var site_tamper_data = rdata.filter(function (item) {
							return item.path == web.path || item.path == web.path + '/';
						});
						_site_tamper_data = site_tamper_data.length ? site_tamper_data[0] : {}; // 站点企业级防篡改数据
						render_tab();
					});
				} else {
					if (rdata_res.setup)
						$('#webedit-con').append(
							'<div class="mask_layer php-pro-box" style="left: 15px">\
							<div class="sn-home--open-condition" style="margin-top: 10px;margin-left: 0;height:32px;line-height:32px">\
								<i class="sn-home--important-note1"></i>未安装企业级防篡改，<a href="javascript:;" class="btlink" onclick="bt.soft.install("tamper_core")">点击安装</a>\
							</div>\
					</div>'
						);
					$('#tabTamperCore').css('margin-top', '40px');
					render_tab();
				}

				function render_tab() {
					var _tab = [
						{
							title: '概览',
							on: true,
							callback: function (robj) {
								var _headbox =
									'<div class="tamper-top-cont php-pro-box flex align-center"><div class="tamper-open flex align-center" style="height: 34px;">\
																	<span class="pull-left" style="line-height: 22px;margin-right: 20px;">防篡改开关</span>\
																	<div class="tamper-switch">\
																		<input class="btswitch btswitch-ios" id="tamperSwitch" type="checkbox">\
																		<label class="btswitch-btn" for="tamperSwitch" style="margin: 0;"></label>\
																	</div>\
																</div></div>';
								var _totalbox =
									'<div class="divtable tamperProofTable">\
																	<table class="table table-hover table-bordered" style="width: 680px;margin:15px 0;background-color:#fafafa">\
																		<tbody>\
																			<tr><th>总拦截次数</th><td><span class="site_all_intercept">--</span></td>\
																			<th>当日拦截次数</th><td><span class="site_today_intercept">--</span></td></tr>\
																		</tbody>\
																	</table>\
																</div>\
																<div class="bt-logs" style="height: 500px;">\
																	<div id="site_anti_log"></div>\
																	<ul class="help-info-text c7" style="position: absolute;bottom: 10px;">\
																		<li>开启防篡改后，部分项目【无法更新，文件无法上传，无法操作等】，需要关闭防篡改或添加白名单</li>\
																	</ul>\
																</div>';
								robj.append(_headbox + _totalbox);

								if (!$('.mask_layer.php-pro-box').length) robj.css('padding', '15px 0');

								// 获取全局状态 rdata.global_status { controller_status: 服务状态, kernel_module_status: 内核状态, settings_status: 全局开关}
								bt_tools.send({ url: '/tamper_core/get_glabal_total.json' }, function (global_rdata) {
									if (!global_rdata.glabal_status.settings_status) {
										$('.tamper-top-cont').append(
											'<div class="sn-home--open-condition"><i class="sn-home--important-note">!</i>未启用企业级防篡改，请先开启<span class="glabal_status">全局开关</span></div>'
										);
										/* 全局开关*/
										$('#serviceStatus').on('change', function () {
											var _status = $(this).prop('checked');
											bt_tools.send({ url: '/tamper_core/modify_global_config.json', data: { key: 'status', value: _status ? 1 : 0 } }, function (res) {
												bt_tools.msg(res);
											});
										});
										$('.glabal_status').click(function () {
											bt.simple_confirm({ title: '开启全局开关', msg: '开启后，站点目录对应的防篡改配置将生效，是否继续操作？' }, function () {
												bt_tools.send({ url: '/tamper_core/modify_global_config.json', data: { key: 'status', value: 1 } }, function (res) {
													bt_tools.msg(res);
													if (res.status) $('.sn-home--open-condition').remove();
												});
											});
										});
									}
								});

								// 定义dom节点变量
								var $tamperSwitch = $('#tamperSwitch'),
									$site_all_intercept = $('.site_all_intercept'),
									$site_today_intercept = $('.site_today_intercept');

								get_tamper_data(_site_tamper_data);
								function get_tamper_data(_data) {
									if (!$.isEmptyObject(_data)) {
										var _site_tamper_data_total = 0, // 总拦截次数
											_site_tamper_data_today = 0, // 当日拦截次数
											_total_title = '', // 总拦截次数标题
											_today_title = ''; // 当日拦截次数标题

										// 防篡改开关
										$tamperSwitch.prop('checked', _data.status == 1 ? true : false);

										// 计算总拦截次数和当日拦截次数
										for (var key in _data.total.all) {
											_site_tamper_data_total += _data.total.all[key];
										}
										for (var key in _site_tamper_data.total.today) {
											_site_tamper_data_today += _data.total.today[key];
										}
										for (var i = 0; i < data.configType.length; i++) {
											var _name = data.configType[i].name;
											_total_title += data.configType[i].title + '：' + _data.total.all[_name];
											_today_title += data.configType[i].title + '：' + _data.total.today[_name];
											if (i !== data.configType.length - 1) {
												_total_title += '\n';
												_today_title += '\n';
											}
										}
										$site_all_intercept.text(_site_tamper_data_total).prop('title', _total_title);
										$site_today_intercept.text(_site_tamper_data_today).prop('title', _today_title);
									}
								}

								//获取日志
								get_log(_site_tamper_data);

								// 获取日志信息
								function get_log(config, date) {
									$('#site_anti_log').empty();
									if (!$.isEmptyObject(config)) {
										var date_list = [
											{
												title: '全部',
												value: '',
											},
										];
										var log_table = bt_tools.table({
											el: '#site_anti_log',
											url: '/tamper_core/get_logs.json',
											param: {
												path_id: config.pid,
												date: date,
											},
											height: 410,
											load: true,
											default: '暂无防护日志',
											dataFilter: function (res) {
												if (!$('#site_anti_log .tootls_top .pull-right #site_date_select').length) {
													$('#site_anti_log .tootls_top .pull-right').prepend('<div id="site_date_select"></div>');
													if (res['dates']) {
														for (var i = 0; i < res.dates.length; i++) {
															date_list.push({
																title: res.dates[i],
																value: res.dates[i],
															});
														}
													}
													bt_tools.form({
														el: '#site_date_select',
														form: [
															{
																group: {
																	type: 'select',
																	name: 'date',
																	width: '120px',
																	value: date ? date : '',
																	list: date_list,
																	placeholder: '请选择日期',
																	change: function (formData) {
																		get_log(config, formData.date == '' ? undefined : formData.date);
																	},
																},
															},
														],
													});
												}
												return res;
											},
											column: [
												{
													fid: 'date',
													title: '时间',
													width: 140,
												},
												{
													fid: 'content',
													title: '目录',
													width: 220,
													fixed: true,
												},
												{
													fid: 'type',
													title: '类型',
													width: 100,
													type: 'text',
													template: function (row) {
														for (var i = 0; i < data.configType.length; i++) {
															if (row.type == data.configType[i].name) {
																return data.configType[i].title;
															}
														}
													},
												},
												{
													fid: 'user',
													title: '用户',
													type: 'text',
													width: 100,
												},
												{
													fid: 'process',
													title: '进程',
													type: 'text',
													width: 80,
													template: function (row) {
														return '<span title="' + row.process + '">' + row.process + '</span>';
													},
												},
											],
											tootls: [
												{
													type: 'group',
													positon: ['left', 'top'], // 默认在左上角
													list: [
														{
															title: '清理日志',
															event: function () {
																var dates_list = date_list.filter(function (item) {
																	return item.value != '';
																});
																if (dates_list.length == 0) {
																	layer.msg('暂无可清理的日志！', { icon: 6 });
																	return false;
																}
																bt_tools.open({
																	type: 1,
																	title: '清理日志',
																	area: ['330px', '220px'],
																	btn: ['确定', '取消'],
																	content: {
																		class: 'pd16',
																		form: [
																			{
																				label: '需要清理的日期',
																				formLabelWidth: '110px',
																				group: [
																					{
																						type: 'select',
																						name: 'date',
																						width: '140px',
																						list: dates_list,
																					},
																				],
																			},
																			{
																				group: {
																					type: 'help',
																					list: ['当前仅支持按日期清理日志'],
																				},
																			},
																		],
																	},
																	success: function (layero) {
																		$(layero).find('.layui-layer-content').css('overflow', 'inherit');
																	},
																	yes: function (formData, ind) {
																		bt_tools.send(
																			{ url: '/tamper_core/del_logs.json', data: { path_id: config.pid, date: formData.date } },
																			function (rdata) {
																				if (rdata.status) {
																					layer.close(ind);
																					get_log(config, date);
																				}
																			},
																			'清理日志'
																		);
																	},
																});
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
													numberParam: 'rows', //分页数量请求字段默认为 : limit
													number: 10, //分页数量默认 : 10条
												},
											],
										});
									} else {
										bt_tools.table({
											el: '#site_anti_log',
											height: 410,
											data: [],
											default: '暂无防护日志',
											column: [
												{
													fid: 'date',
													title: '时间',
													width: 150,
												},
												{
													fid: 'content',
													title: '目录',
													width: 200,
												},
												{
													fid: 'type',
													title: '类型',
													width: 110,
													type: 'text',
												},
												{
													fid: 'user',
													title: '用户',
													type: 'text',
													width: 100,
												},
												{
													fid: 'process',
													title: '进程',
													type: 'text',
													width: 80,
												},
											],
										});
									}
								}

								// 防篡改开关
								$tamperSwitch.change(function () {
									var params = {
										path_id: _site_tamper_data.pid,
										key: 'status',
									};
									var _status = $(this).prop('checked');
									bt.simple_confirm(
										{
											title: _status ? '启用保护目录配置【' + web.name + '】' : '关闭保护目录配置【' + web.name + '】',
											msg: !_status ? '关闭该保护目录配置后，目录将失去保护，是否继续操作？' : '启用该保护目录配置后，目录将受到保护，是否继续操作？',
										},
										function () {
											params['value'] = _status ? 1 : 0;
											//当站点目录不存在企业防篡改配置时，添加站点目录防篡改
											if ($.isEmptyObject(_site_tamper_data)) {
												bt_tools.send(
													{ url: '/tamper_core/multi_create.json', data: { paths: JSON.stringify([{ path: web.path + '/', ps: web.name }]) } },
													function (res) {
														if (res.length && res[0].status) {
															bt_tools.msg({ status: true, msg: '开启防篡改成功' });
															site.edit.set_tamper_core(web);
														}
													},
													'开启防篡改'
												);
											} else {
												bt_tools.send(
													{ url: '/tamper_core/modify_path_config.json', data: params },
													function (res) {
														bt_tools.msg(res);
														if (res.status) {
															_site_tamper_data.status = _status;
														}
													},
													'修改状态'
												);
											}
										},
										function () {
											$tamperSwitch.prop('checked', !_status);
										}
									);
								});
							},
						},
						{
							title: '基础设置',
							callback: function (robj) {
								robj.html('<div id="advancedConfig"></div>' + bt.render_help(['提示：当前配置默认拦截以上规则，请根据当前项目需求设置和配置规则']));

								get_tamper_paths(_site_tamper_data);

								// 站点目录不存在防篡改时渲染遮罩层
								if ($.isEmptyObject(_site_tamper_data)) {
									render_tab_mask(robj);
								}

								// 获取防篡改基础设置
								function get_tamper_paths(config) {
									bt_tools.table({
										el: '#advancedConfig',
										url: '/tamper_core/get_tamper_paths.json',
										height: '520px',
										load: true,
										default: '空',
										dataFilter: function (res) {
											var data1 = [],
												data2 = res;
											for (var j = 0; j < res.length; j++) {
												if (res[j].pid == config.pid) {
													data2 = res[j];
												}
											}
											for (var i = 0; i < data.configType.length; i++) {
												data1.push({ name: '禁止' + data.configType[i].title, key: 'is_' + data.configType[i].name, status: data2['is_' + data.configType[i].name] });
											}
											return { data: data1 };
										},
										column: [
											{
												fid: 'name',
												title: '名称',
												type: 'text',
											},
											{
												title: '状态',
												type: 'switch',
												fid: 'status',
												width: 50,
												align: 'right',
												event: function (rowc, index, ev, key, rthat) {
													// if (_that.glabal_status) {
													var status = $('#advancedConfig tbody tr:eq(' + index + ') .btswitch-btn')
														.siblings()
														.prop('checked');
													var params = {
														key: rowc.key,
														value: status == true ? 1 : 0,
														path_id: config.pid,
													};
													bt_tools.send(
														{ url: '/tamper_core/modify_path_config.json' },
														params,
														function (rdata) {
															bt_tools.msg(rdata);
														},
														rowc.name
													);
													// }
												},
											},
										],
									});
								}
							},
						},
						{
							title: '受保护的文件后缀',
							callback: function (robj) {
								robj.html(
									'<div class="update-code-css"><div id="blackExts"></div>' +
										bt.render_help([
											'所谓文件后缀是指文件名结尾的字符串，不一定是扩展名',
											'例如<code>.php</code>,<code>.html</code>,<code>.js</code>,<code>index.php</code>等',
											'例1：<code>.php</code> 匹配：<code>./1.php</code> <code>./test/2.php</code> 不匹配：<code>./1.php/1.txt</code>',
											'例2：<code>index.php</code> 匹配：<code>./index.php</code> <code>./test/index.php</code> <code>./abc_index.php</code>不匹配：<code>./index.php.tar.gz</code>',
										]) +
										'</div>'
								);

								get_tamper_exts(_site_tamper_data);

								// 站点目录不存在防篡改时渲染遮罩层
								if ($.isEmptyObject(_site_tamper_data)) {
									render_tab_mask(robj);
								}

								function get_tamper_exts(config) {
									var blackExtsTable = bt_tools.table({
										el: '#blackExts',
										url: '/tamper_core/get_tamper_paths.json',
										height: '450',
										load: true,
										default: '暂无受保护的文件后缀',
										dataFilter: function (res) {
											var data1 = [];
											for (var i = 0; i < res.length; i++) {
												if (res[i].pid == config.pid) {
													var black_exts = res[i].black_exts;
													for (var j = 0; j < black_exts.length; j++) {
														data1.push({ exts: black_exts[j] });
													}
												}
											}
											return { data: data1 };
										},
										column: [
											{
												fid: 'exts',
												title: '后缀名',
												type: 'text',
											},
											{
												title: '操作',
												type: 'group',
												width: '200px',
												align: 'right',
												group: [
													{
														title: '删除',
														event: function (rowc, index, ev, key, rthat) {
															var params = {
																path_id: config.pid,
																path: config.path,
																exts: rowc.exts,
															};
															bt.confirm({ title: '删除受保护的文件后缀【' + rowc.exts + '】', msg: '删除受保护的文件后缀后，文件名以该后缀结尾的文件将失去保护，是否继续操作？' }, function () {
																bt_tools.send(
																	{ url: '/tamper_core/remove_black_exts.json' },
																	params,
																	function (rdata) {
																		bt_tools.msg(rdata);
																		if (rdata.status) {
																			blackExtsTable.$refresh_table_list();
																		}
																	},
																	'删除受保护的文件后缀'
																);
															});
														},
													},
												],
											},
										],
										tootls: [
											{
												// 按钮组
												type: 'group',
												positon: ['left', 'top'],
												list: [
													{
														title: '添加',
														active: true,
														event: function (ev, that) {
															var exts = $('input[name=exts]').val();
															if (exts == '') return layer.msg('请输入后缀名', { icon: 2 });
															var params = {
																path_id: config.pid,
																path: config.path,
																exts: exts,
															};
															bt_tools.send(
																{ url: '/tamper_core/add_black_exts.json' },
																params,
																function (rdata) {
																	bt_tools.msg(rdata);
																	if (rdata.status) {
																		blackExtsTable.$refresh_table_list();
																		$('input[name=exts]').val('');
																	}
																},
																'添加扩展名'
															);
														},
													},
												],
											},
										],
										success: function () {
											if ($('input[name=exts]').length == 0) {
												$('#blackExts .tootls_top .pull-left .btn').before('<input type="text" name="exts" placeholder="后缀名" class="bt-input-text mr10 " value="">');
											}
										},
									});
								}
							},
						},
						{
							title: '目录白名单',
							callback: function (robj) {
								robj.html(
									'<div class="update-code-css"><div id="directorysWhite"></div>' +
										bt.render_help([
											'此处允许使用全路径或目录名或路径的一部分如：<code>/www/abc/cache/test/,test,cache/test/</code>',
											'全路径首位必需为<code>/</code>，如：<code>/www/abc/cache/test/</code>',
											'录名或路径的一部分首位不能是<code>/</code>，如：<code>cache/test/</code> 或 <code>test</code>',
											'例1：<code>/www/abc/</code> 匹配:<code>/www/abc/*</code>  不匹配：<code>/www/abc</code> <code>/www/abc123</code>',
											'例2：<code>test</code> 匹配：<code>/www/test/1.txt</code> <code>/www/test_abc</code> 不匹配：<code>/www/1.php</code>',
											'例3：<code>cache/test/</code> 匹配：<code>/www/cache/test/1.txt</code> <code>/cache/test/</code>不匹配：<code>/www/cache/test</code> <code>/cache/</code>',
										]) +
										'</div>'
								);

								get_tamper_directorys(_site_tamper_data);

								// 站点目录不存在防篡改时渲染遮罩层
								if ($.isEmptyObject(_site_tamper_data)) {
									render_tab_mask(robj);
								}

								function get_tamper_directorys(config) {
									var directorysTable = bt_tools.table({
										el: '#directorysWhite',
										url: '/tamper_core/get_tamper_paths.json',
										height: '400',
										load: true,
										default: '暂无目录白名单',
										dataFilter: function (res) {
											var white_dirs = [];
											for (var i = 0; i < res.length; i++) {
												if (res[i].pid == config.pid) {
													res[i].white_dirs.ps = res[i].white_dirs.ps || '';
													white_dirs = res[i].white_dirs.map(function (res) {
														res.ps = res.ps || '';
														return res;
													});
												}
											}
											return { data: white_dirs };
										},
										column: [
											{
												fid: 'dir',
												title: '目录名',
												type: 'text',
											},
											{
												fid: 'ps',
												title: '备注',
												type: 'input',
												blur: function (row, index, ev, key, that) {
													if (row.ps == ev.target.value) return false;
													bt_tools.send(
														{ url: '/tamper_core/set_white_dir_with_ps.json', data: { path_id: config.pid, dir_name: row.dir, ps: ev.target.value } },
														function (rdata) {
															bt_tools.msg(rdata);
															if (rdata.status) {
																that.$refresh_table_list();
															}
														},
														'修改备注'
													);
												},
												keyup: function (row, index, ev) {
													if (ev.keyCode === 13) {
														$(this).blur();
													}
												},
											},
											{
												title: '操作',
												type: 'group',
												width: '60px',
												align: 'right',
												group: [
													{
														title: '删除',
														event: function (rowc, index, ev, key, rthat) {
															var params = {
																path_id: config.pid,
																path: config.path,
																dirname: rowc.dir,
															};
															bt.confirm(
																{ title: '删除目录白名单', msg: typeof rowc.tip_msg != 'undefined' ? rowc.tip_msg : '删除【' + rowc.dir + '】后，该目录下的所有文件将受到保护，是否继续操作？' },
																function () {
																	bt_tools.send(
																		{ url: '/tamper_core/remove_white_dirs.json' },
																		params,
																		function (rdata) {
																			bt_tools.msg(rdata);
																			if (rdata.status) {
																				directorysTable.$refresh_table_list();
																			}
																		},
																		'删除目录白名单'
																	);
																}
															);
														},
													},
												],
											},
										],
										tootls: [
											{
												// 按钮组
												type: 'group',
												positon: ['left', 'top'],
												list: [
													{
														title: '添加',
														active: true,
														event: function (ev, that) {
															var dirname = $('input[name=dirname]').val();
															if (dirname == '') return layer.msg('请输入目录名', { icon: 2 });
															var params = {
																path_id: config.pid,
																path: config.path,
																dirnames: dirname,
															};
															bt_tools.send(
																{ url: '/tamper_core/add_white_dirs.json' },
																params,
																function (rdata) {
																	bt_tools.msg(rdata);
																	if (rdata.status) {
																		directorysTable.$refresh_table_list();
																		$('input[name=dirname]').val('');
																	}
																},
																'添加目录白名单'
															);
														},
													},
												],
											},
										],
										success: function () {
											if ($('input[name=dirname]').length == 0) {
												$('#directorysWhite .tootls_top .pull-left .btn').before('<input type="text" name="dirname" placeholder="目录名" class="bt-input-text mr10 " value="">');
											}
										},
									});
								}
							},
						},
						{
							title: '文件白名单',
							callback: function (robj) {
								robj.html(
									'<div class="update-code-css"><div id="filesWhite"></div>' +
										bt.render_help([
											'此处允许使用全路径或单一文件名如：<code>/test/index.php</code>,<code>index.php</code>',
											'注意，只能是绝对路径或文件名不支持相对路径',
											'例1：<code>index.php</code> 匹配：<code>./index.php</code> <code>./test/index.php</code>不匹配：<code>./abc_index.php</code> <code>./index.php/1.txt</code>',
											'例2：<code>/test/index.php</code> 只匹配：<code>/test/index.php</code>',
										]) +
										'</div>'
								);

								get_files_white_list(_site_tamper_data);

								// 站点目录不存在防篡改时渲染遮罩层
								if ($.isEmptyObject(_site_tamper_data)) {
									render_tab_mask(robj);
								}

								function get_files_white_list(config) {
									var directorysTable = bt_tools.table({
										el: '#filesWhite',
										url: '/tamper_core/get_tamper_paths.json',
										height: '268.5',
										load: true,
										default: '暂无文件白名单',
										dataFilter: function (res) {
											var data1 = [];
											for (var i = 0; i < res.length; i++) {
												if (res[i].pid == config.pid) {
													var white_files = res[i].white_files;
													for (var j = 0; j < white_files.length; j++) {
														data1.push({ filename: white_files[j] });
													}
												}
											}
											return { data: data1 };
										},
										column: [
											{
												fid: 'filename',
												title: '文件名',
												type: 'text',
											},
											{
												title: '操作',
												type: 'group',
												width: '200px',
												align: 'right',
												group: [
													{
														title: '删除',
														event: function (rowc, index, ev, key, rthat) {
															var params = {
																path_id: config.pid,
																path: config.path,
																filename: rowc.filename,
															};
															bt.confirm({ title: '删除文件白名单【' + rowc.filename + '】', msg: '删除该文件白名单后，该文件将受到保护，是否继续操作？' }, function () {
																bt_tools.send(
																	{ url: '/tamper_core/remove_white_files.json' },
																	params,
																	function (rdata) {
																		bt_tools.msg(rdata);
																		if (rdata.status) {
																			directorysTable.$refresh_table_list();
																		}
																	},
																	'删除文件白名单'
																);
															});
														},
													},
												],
											},
										],
										tootls: [
											{
												// 按钮组
												type: 'group',
												positon: ['left', 'top'],
												list: [
													{
														title: '添加',
														active: true,
														event: function (ev, that) {
															var filename = $('input[name=filename]').val();
															if (filename == '') return layer.msg('请输入文件名', { icon: 2 });
															var params = {
																path_id: config.pid,
																path: config.path,
																filename: filename,
															};
															bt_tools.send(
																{ url: '/tamper_core/add_white_files.json' },
																params,
																function (rdata) {
																	bt_tools.msg(rdata);
																	if (rdata.status) {
																		directorysTable.$refresh_table_list();
																		$('input[name=filename]').val('');
																	}
																},
																'添加文件白名单'
															);
														},
													},
												],
											},
										],
										success: function () {
											if ($('input[name=filename]').length == 0) {
												$('#filesWhite .tootls_top .pull-left .btn').before('<input type="text" name="filename" placeholder="文件名" class="bt-input-text mr10 " value="">');
											}
										},
									});
								}
							},
						},
					];
					bt.render_tab('tabTamperCore', _tab);

					$('#tabTamperCore span:eq(0)').click();
				}

				function render_tab_mask(robj) {
					robj.append(
						'<div class="mask_layer php-pro-box">\
						<div class="sn-home--open-condition" style="margin-top: 10px;margin-left: 0;height:32px;line-height:32px">\
							<i class="sn-home--important-note1"></i>当前站点目录未启用防篡改，<a href="javascript:;" class="btlink open_tamper">点击开启</a>\
						</div>\
					</div>'
					);
					robj.css('padding-top', '45px');
					$('.update-code-css').css('margin-top', '10px');
					$('.open_tamper').click(function () {
						bt_tools.send(
							{ url: '/tamper_core/multi_create.json', data: { paths: JSON.stringify([{ path: web.path + '/', ps: web.name }]) } },
							function (res) {
								if (res.length && res[0].status) {
									robj.css('padding-top', '15px');
									$('.update-code-css').css('margin-top', '0');
									bt_tools.msg({ status: true, msg: '开启防篡改成功' });
									// 更新保护列表
									bt_tools.send({ url: '/tamper_core/get_tamper_paths.json' }, function (rdata) {
										// 获取当前站点的防篡改列表
										var arr = rdata.filter(function (item) {
											return item.path == web.path || item.path == web.path + '/';
										});
										_site_tamper_data = arr.length ? arr[0] : {}; // 站点企业级防篡改数据
										$('#tabTamperCore span.on').click();
									});
								}
							},
							'开启防篡改'
						);
					});
				}
			});
		},
		set_tomact: function (web, robj) {
			bt.site.get_site_phpversion(web.name, function (rdata) {
				if (!rdata.tomcatversion) {
					robj.html('<span>' + lan.site.tomcat_err_msg1 + '<span class="btlink install_tomcat" style="margin-left:5px;">点击安装</span></span>');
					$('.install_tomcat').off('click').on('click',function(){
						bt.soft.install('tomcat');

					})
					layer.msg(lan.site.tomcat_err_msg, { icon: 2 });
					return;
				}
				var data = {
					class: 'label-input-group',
					items: [
						{
							text: lan.site.enable_tomcat,
							name: 'tomcat',
							value: rdata.tomcat == -1 ? false : true,
							type: 'checkbox',
							callback: function (sdata) {
								bt.site.set_tomcat(web.name, function (ret) {
									if (res.status) robj.prev().find('span:eq(1)').click();
									bt.msg(ret);
								});
							},
						},
					],
				};
				var _form_data = bt.render_form_line(data);
				robj.append(_form_data.html);
				// bt.render_clicks(_form_data.clicks);
				var helps = [lan.site.tomcat_help1 + ' ' + rdata.tomcatversion + ',' + lan.site.tomcat_help2, lan.site.tomcat_help3, lan.site.tomcat_help4, lan.site.tomcat_help5];
				robj.append(bt.render_help(helps));
				$('input[name="tomcat"]').click(function () {
					bt.site.set_tomcat(web.name, function (ret) {
						// if (ret.status) site.reload(9)
						robj.prev().find('span:eq(1)').click();
						bt.msg(ret);
					});
				});
			});
		},
		get_site_logs: function (web) {
			$('#webedit-con').append('<div id="tabLogs" class="tab-nav"></div><div class="tab-con" style="padding:10px 0px;"></div>');
			var _tab = [
				{
					title: '响应日志',
					on: true,
					callback: function (robj) {
						bt_tools.send({url: '/logs/site/get_ip_area'},function(resStatus) {
              var ip_area = bt.get_cookie('ltd_end') > 0 ? resStatus.msg : 0
              getSiteLogs(ip_area)
              function getSiteLogs(ip_area_num) {
                bt.site.getSiteLogs({ip_area: ip_area_num,siteName: web.name},function(rdata) {
							var _logs_info = $('<div></div>').text(rdata.msg);
							var siteTypes = $('#cutMode .active').data('type'),arr = ['nodejs','go','other']
							var logs = { class: 'bt-logs site_log_hover', items: [{ name: 'site_logs', height: arr.indexOf(siteTypes) !== -1 ? '540px' : '590px', value: _logs_info.html(), width: '100%', type: 'textarea' }] },
								_form_data = bt.render_form_line(logs);
							robj.empty()
                  robj.append('<div class="refresh-btn-box mb10 flex" style="justify-content: space-between;">\
                  <div class="ip-area-box"><input type="checkbox" class="ip_area" id="ip_area" name="ip_area" '+ (ip_area_num ? 'checked' : '') +'><label for="ip_area">显示IP归属地信息<span class="glyphicon icon-vipLtd" style="margin-left: 6px;position: relative;top: -2px;"></span><button type="button" title="更改日志路径" class="btn btn-default btn-sm ml5 setLogPath '+ (web.isLogPathBtn ? '' : 'hide') +'"><span>更改日志路径</span></button></label></div>\
                  <button type="button" title="刷新设置" class="btn btn-default btn-sm mr15 refreshSiteSunLogs refresh-btn relative" >\
							<div class="plr10 flex align-center refresh-div">\
							<div class="countdown">\
								<svg viewBox="0 0 100 100"><path d="\
								M 50 50\
								m 0 -46\
								a 46 46 0 1 1 0 92\
								a 46 46 0 1 1 0 -92\
								" stroke="#ccc" stroke-width="8" fill="#fff" class="el-progress-circle__track" style="stroke-dasharray: 289.027px, 289.027px; stroke-dashoffset: 0px;"></path><path d="\
								M 50 50\
								m 0 -46\
								a 46 46 0 1 1 0 92\
								a 46 46 0 1 1 0 -92\
								" stroke="#20a53a" fill="none" stroke-linecap="round" stroke-width="8" class="el-progress-circle__path" style="stroke-dasharray: 289.027px, 289.027px; stroke-dashoffset: 0px; transition: stroke-dasharray 0.6s ease 0s, stroke 0.6s ease 0s;"></path></svg>\
								<div class="time"></div>\
							</div>\
							<span>刷新日志</span></div>\
							<div class="down-box">\
								<svg width="12.000000" height="12.000000" viewBox="0 0 12 5" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">    				        <desc>    				            Created with Pixso.    				        </desc>    				        <defs></defs>    				        <path id="path" d="M0.123291 0.809418L4.71558 5.84385C4.8786 6.02302 5.16846 6.04432 5.33038 5.86389L9.87927 0.783104C10.0412 0.602676 10.04 0.311989 9.87701 0.132816C9.79626 0.0446892 9.68945 0 9.58374 0C9.47693 0 9.36938 0.0459404 9.28827 0.136574L5.02881 4.89284L0.708618 0.15662C0.627869 0.0684967 0.522217 0.0238075 0.415405 0.0238075C0.307434 0.0238075 0.20105 0.0697479 0.119873 0.160381C-0.041626 0.338303 -0.0393677 0.630241 0.123291 0.809418Z" fill-rule="nonzero" fill="#999999"></path>    				    </svg>\
								<div class="refreshMenu"></div>\
							</div>\
							<div class="refreshMenu"></div>\
							</button></div>'+_form_data.html);
							bt.render_clicks(_form_data.clicks);
                  $('.setLogPath').click(function(){
                        bt_tools.open({
                            title: '设置日志路径',
                            area: ['400px', '200px'],
                            btn: ['确认', '取消'],
                            content: '<div id="bt-log-dialog"></div>',
                            success:function(){
                                bt_tools.form({
                                    el:'#bt-log-dialog',
                                    class:'pd20',
                                    form:[
                                        {
                                            label:'日志路径',
                                            group:{
                                                name:'log_path',
                                                type:'text',
                                                width:'200px',
                                                placeholder:'请输入需要更改的日志路径',
                                                icon: {
                                                    type: 'glyphicon-folder-open',
                                                    event: function (ev) {},
                                                }
                                            }
                                        }
                                    ]
                                })
                            },
                            yes:function(indexs,layero){
                                var logpath = layero.find('input[name="log_path"]').val();
                                if(logpath == ''){
                                    layer.msg('请输入日志路径',{icon:2});
                                    return false;
                                }
                                bt.confirm({ title: '日志路径修改', msg: '是否将【'+logpath+'】设置为日志路径，是否继续？', icon: 0 }, function (index) {
                                    layer.close(index);
                                    bt_tools.send({url:'/logs/site/change_site_log_path',data:{site_name:web.name,log_path:logpath}},function(res){
                                        bt_tools.msg(res);
                                        if(res.status){
                                            layer.close(indexs);
                                        }
                                    })
                                });
                            }
                        })
                    })
                  $('[name=ip_area]').unbind('change').change(function () {
                    var _checked = $(this).prop('checked'),ltd_end = bt.get_cookie('ltd_end');
                    if(ltd_end > 0) {
                      getSiteLogs(_checked ? 1 : 0)
                    }else {
                      $(this).prop('checked',false)
                      product_recommend.pay_product_sign('ltd', 184,'ltd')
                    }
                  })

							function refreshLogs () {
                var _ip_status = $('[name=ip_area]').prop('checked') ? 1 : 0;
                    bt.site.getSiteLogs({ip_area: _ip_status,siteName: web.name}, function (rdata1) {
									var _logs_info1 = $('<div></div>').text(rdata1.msg);
									$('textarea[name="site_logs"]').val(_logs_info1.html());
								});
              }
              bt.refreshLogBtn({func: refreshLogs,cookie: 'sitelog'+ web.id})

              $('.refresh-btn .refresh-div').unbind('click').click(function () {
                refreshLogs()
              })

							$('textarea[name="site_logs"]').attr('readonly', true);
							$('textarea[name="site_logs"]').scrollTop(100000000000);
							$('textarea[name="site_logs"]').parent().css('position', 'relative');
							$('textarea[name="site_logs"]').parent().append(
								'<button class="hide full btn btn-sm btn-success"\
							 							style="position:absolute;top:10px;right:10px">全屏展示</button>'
							);
							$('.site_log_hover')
								.unbind('hover')
								.hover(
									function (e) {
										$('.full').removeClass('hide');
										e.stopPropagation();
										e.preventDefault();
									},
									function (e) {
										$('.full').addClass('hide');
										e.stopPropagation();
										e.preventDefault();
									}
								);
							bt.site.fullScreenLog(_logs_info, web, '响应');
						})
              }
            })
					},
				},
				{
					title: '错误日志',
					callback: function (robj) {
						bt.site.get_site_error_logs(web.name, function (rdata) {
							var _logs_info = $('<div></div>').text(rdata.msg);
							var logs = { class: 'bt-logs error_log_hover', items: [{ name: 'site_logs', height: '590px', value: _logs_info.html(), width: '100%', type: 'textarea' }] },
								_form_data = bt.render_form_line(logs);
							robj.append(_form_data.html);
							bt.render_clicks(_form_data.clicks);
							$('textarea[name="site_logs"]').attr('readonly', true);
							$('textarea[name="site_logs"]').scrollTop(100000000000);
							$('textarea[name="site_logs"]').parent().css('position', 'relative');
							$('textarea[name="site_logs"]').parent().append(
								'<button class="hide full btn btn-sm btn-success"\
							style="position:absolute;top:10px;right:10px">全屏展示</button>'
							);
							$('.error_log_hover')
								.unbind('hover')
								.hover(
									function (e) {
										$('.full').removeClass('hide');
										e.stopPropagation();
										e.preventDefault();
									},
									function (e) {
										$('.full').addClass('hide');
										e.stopPropagation();
										e.preventDefault();
									}
								);
							bt.site.fullScreenLog(_logs_info, web, '错误');
						});
					},
				},
				{
					title: '日志安全分析',
					callback: function (robj) {

				/**
				 * @description WEB日志分析
				 */
			function getSiteWeb(robj,siteName) {
      var that = this
      if(robj==undefined){
				robj = $('#siteWeb');
      }else{
        that.siteName = siteName
      }
			var progress = ''; //扫描进度
			robj.empty();
			bt_tools.send({url: 'logs/site/get_site_log_file',data: { siteName: that.siteName }}, function (rdata) {
				var _path = rdata.log_file
				var analyse_help =
				'<ul class="help-info-text c7">\
				<li>日志安全分析：扫描网站(.log)日志中含有攻击类型的请求(类型包含：<em style="color:red">xss,sql,san,php</em>)</li>\
				<li>分析的日志数据包含已拦截的请求</li>\
				<li>如日志文件过大，扫描可能等待时间较长，请耐心等待</li>\
				</ul>';
				robj.append('<div class="analyse_log_table"></div>' + analyse_help)
				render_analyse_list(that);

				// 渲染分析日志列表
				function render_analyse_list(that) {
					var cronTask= {}
					var renderTable = bt_tools.table({
						el: '.analyse_log_table',
						url: '/ajax?action=get_result&path='+_path,
						column: [
							{
								fid: 'start_time',
								title: '扫描时间',
							},
							{
								fid: 'time',
								type: 'text',
								title: '耗时',
								template: function (row) {
									return row.time.substring(0, 4) + '秒'
								}
							},
							{
								fid: 'xss',
								title: 'XSS',
								template: function (row) {
									return '<span class="onChangeLogDatail" ' + (row.xss > 0 ? 'style="color:red"' : '') + ' name="xss" time="'+row.start_time+'">' + row.xss + '</span>'
								},
								event: function (row) {
									var data ={
										time: row.start_time,
										path: _path,
										type: 'xss',
										action: 'get_detailed'
									}
									if(row.xss > 0){
										get_analysis_data_datail(data);
									}

								}
							},
							{
								fid: 'sql',
								title: 'SQL',
								template: function (row) {
									return '<span class="onChangeLogDatail" ' + (row.sql > 0 ? 'style="color:red"' : '') + ' name="sql" time="'+row.start_time+'">' + row.sql + '</span>'
								},
								event: function (row) {
									var data ={
										time: row.start_time,
										path: _path,
										type: 'sql',
										action: 'get_detailed'
									}
									if(row.sql > 0){
										get_analysis_data_datail(data);
									}
								}
							},
							{
								fid: 'san',
								title: '扫描',
								template: function (row) {
									return '<span class="onChangeLogDatail" ' + (row.san > 0 ? 'style="color:red"' : '') + ' name="san" time="'+row.start_time+'">' + row.san + '</span>'
								},
								event: function (row) {
									var data ={
										time: row.start_time,
										path: _path,
										type: 'san',
										action: 'get_detailed'
									}
									if(row.san > 0){
										get_analysis_data_datail(data);
									}
								}
							},
							{
								fid: 'php',
								title: 'PHP攻击',
								template: function (row) {
									return '<span class="onChangeLogDatail" ' + (row.php > 0 ? 'style="color:red"' : '') + ' name="php" time="'+row.start_time+'">' + row.php + '</span>'
								},
								event: function (row) {
									var data ={
										time: row.start_time,
										path: _path,
										type: 'php',
										action: 'get_detailed'
									}
									if(row.php > 0){
										get_analysis_data_datail(data);
									}
								}
							},
							{
								fid: 'ip',
								title: 'IP(top100)',
								template: function (row) {
									return '<span class="onChangeLogDatail" ' + (row.ip > 0 ? 'style="color:#20a53a"' : '') + ' name="ip" time="'+row.start_time+'">' + row.ip + '</span>'
								},
								event: function (row) {
									var data ={
										time: row.start_time,
										path: _path,
										type: 'ip',
										action: 'get_detailed'
									}
									if(row.ip > 0){
										get_analysis_data_datail(data);
									}
								}
							},
							{
								fid: 'url',
								title: 'URL(top100)',
								template: function (row) {
									return '<span class="onChangeLogDatail" ' + (row.url > 0 ? 'style="color:#20a53a"' : '') + ' name="url" time="'+row.start_time+'">' + row.url + '</span>'
								},
								event: function (row) {
									var data ={
										time: row.start_time,
										path: _path,
										type: 'url',
										action: 'get_detailed'
									}
									if(row.url > 0){
										get_analysis_data_datail(data);
									}
								}
							},
							{
								title: '合计',
								template: function (row) {
									return '<span>'+(Number.parseInt(row.xss) + Number.parseInt(row.sql) + Number.parseInt(row.san) + Number.parseInt(row.php))+'</span>'
								}
							},
						],
						tootls: [
							{
								// 按钮组
								type: 'group',
								positon: ['left', 'top'],
								list: [
									{
										title: '日志扫描',
										active: true,
										event: function (ev, _that) {
							bt.confirm(
								{
									title: '扫描网站日志',
									msg: '建议在服务器负载较低时进行安全分析，本次将对【' + that.siteName + '.log】文件进行扫描，可能等待时间较长，是否继续？',
								},
								function (index) {
									layer.close(index);
									progress = layer.open({
										type: 1,
										closeBtn: 2,
										title: false,
										shade: 0,
										area: '400px',
										content:
											'<div class="pro_style" style="padding: 20px;"><div class="progress-head" style="padding-bottom: 10px;">正在扫描中，扫描进度...</div>\
										<div class="progress">\
											<div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 0%">0%</div>\
										</div>\
									</div>',
										success: function () {
											// 开启扫描并且持续获取进度
											bt.send('log_analysis','ajax/log_analysis',{path: _path}, function (rdata) {
												if (rdata.status) {
													detect_progress();
												} else {
													layer.close(progress);
													layer.msg(rdata.msg, { icon: 2, time: 0, shade: 0.3, shadeClose: true });
												}
											});
										},
									});
								}
							);
										},
									},
									{
										title:'定期扫描',
										event: function (ev, _that) {
											var alert_message = {
												cycle: cronTask.cycle,
												status: cronTask.status=='1',
												module: cronTask.channel,
											};
											function switchPushType(formData) {
												$.ajaxSettings.async = false;
												var alertListModule = [],
														isCheckType = [],
														accountConfigStatus = false,
														_checklist = [];
												// 获取告警通道
												bt_tools.send({ url: 'config?action=get_msg_configs' }, function (rdata) {
													var resetChannelMessage = [],
															prevArray = [];
													Object.getOwnPropertyNames(rdata).forEach(function (key) {
														var mod = rdata[key];
														key == 'wx_account' ? prevArray.push(mod) : resetChannelMessage.push(mod);
													});
													alertListModule = prevArray.concat(resetChannelMessage);
													soft.alert_modules = alertListModule;
													console.log(alertListModule)
													alertListModule.forEach(function (mod, i) {
														if (formData) {
															isCheckType = formData.module.split(',');
														}
														if (mod.name === 'wx_account') {
															if (!$.isEmptyObject(mod.data) && mod.data.res.is_subscribe && mod.data.res.is_bound) {
																accountConfigStatus = true; //安装微信公众号模块且绑定
															}
														}
														if (mod.name !== 'sms') {
															_checklist.push({
																type: 'checkbox',
																name: mod.name,
																class: 'module-check ' + (!mod.setup || $.isEmptyObject(mod.data) ? 'check_disabled' : mod.name == 'wx_account' && !accountConfigStatus ? 'check_disabled' : '') + '',
																style: { 'margin-right': '10px' },
																disabled: !mod.setup || $.isEmptyObject(mod.data) ? true : mod.name == 'wx_account' && !accountConfigStatus ? true : false,
																value: $.inArray(mod.name, isCheckType) >= 0 ? 1 : 0,
																title:
																		mod.title +
																		(!mod.setup || $.isEmptyObject(mod.data)
																				? '<span style="color:red;cursor: pointer;" class="alertInstall">[未配置]</span>'
																				: mod.name == 'wx_account' && !accountConfigStatus
																						? '[<a target="_blank" class="bterror alertInstall">未配置</a>]'
																						: ''),
																event: function (formData, element, thatE) {
																	// thatE.config.form[4].group[i].value = !formData[mod.name] ?0:1;
																},
						});
														}
													});
				});
												$.ajaxSettings.async = true;
												return _checklist;
											}
											bt_tools.open({
												area: ['558px','auto'],
												skin: 'alert_layer',
												class: 'alert_layer',
												btn: ['确定', '取消'],
												title: '日志定期扫描',
												content: {
													class: 'pd20',
													form: [
														{
															label: '自动扫描',
															name: 'auto_scan',
															group: {
																type: 'other',
																boxcontent:
																		'\
																			<div class="mr10 auto-scan alert_status_input"  style="margin-top:5px;vertical-align: middle;display: inline-block;">\
																					<input class="btswitch btswitch-ios" id="status" name="status" type="checkbox">\
																					<label class="btswitch-btn" style="margin: 0"></label>\
																			</div>\
																		',
															},
														},
														{
															label: '周期',
															group: {
																type: 'other',
																boxcontent: '<div style="display: flex;align-items: center;">\
																				<input class="bt-input-text " disabled name="corn" min="0" type="number" style="width: 62px;" value="1"/>\
																				<span style="height: 32px;\
																										line-height: 33px;\
																										display: inline-block;\
																										border: 1px solid #DCDFE6;\
																										border-left: 0;\
																										border-radius: 2px;\
																										width: 44px;\
																										text-align: center;\
																										background-color: #f6f6f6;\
																										vertical-align: middle;\
																										position: relative;\
																										border-top-left-radius: 0;\
																										border-bottom-left-radius: 0;">天</span>\
																			</div>'
															}
														},
														{
															class: 'alert_type',
															label: '告警方式',
															group: switchPushType(alert_message),
														},
														{
															group: {
																type: 'help',
																style: {
																	'margin-top': 0,
																	'margin-left': '20px',
																},
																list: ['未配置后状态未更新，尝试点击【<a class="btlink handRefresh">手动刷新</a>】'],
															},
														},
													],
												},
												success: function () {
													// 点开页面默认设置状态为开启
													$('#status').prop('checked', alert_message.status);
													// 切换状态
													$('.alert_status_input').click(function () {
														var status = $(this).find('input').prop('checked');
														$(this).find('input').prop('checked', !status);
													});
													// 未配置消息通道
													$('.alertInstall').click(function (ev) {
														var type = $(ev.currentTarget).parent('span').siblings('input').attr('name');
														openAlertModuleInstallView(type);
													});
													// 点击手动刷新
													$('.handRefresh').click(function () {
														renderConfigHTML();
													});
													renderConfigHTML();
													// 获取配置
													function renderConfigHTML() {
														bt.site.get_msg_configs(function (rdata) {
															var html = '',
																	unInstall = '';
															for (var key in rdata) {
																var item = rdata[key],
																		_html = '',
																		wx_html = '',
																		accountConfigStatus = false;
																if (key == 'sms') continue;
																if (key === 'wx_account') {
																	if (!$.isEmptyObject(item.data) && item.data.res.is_subscribe && item.data.res.is_bound) {
																		accountConfigStatus = true; //安装微信公众号模块且绑定
																	}
																	// 微信公众号模块置顶
																	wx_html =
																			'<div class="inlineBlock module-check ' +
																			(!item.setup || $.isEmptyObject(item.data) ? 'check_disabled' : key == 'wx_account' && !accountConfigStatus ? 'check_disabled' : '') +
																			'">' +
																			'<div class="cursor-pointer form-checkbox-label mr10" style="height:35px">' +
																			'<i class="form-checkbox cust—checkbox cursor-pointer mr5 ' +
																			(alert_message.module.indexOf(item.name) > -1 ? (!item.setup || $.isEmptyObject(item.data) ? '' : key == 'wx_account' && !accountConfigStatus ? '' : 'active') : '') +
																			'" data-type="' +
																			item.name +
																			'"></i>' +
																			'<input type="checkbox" class="form—checkbox-input hide mr10" name="' +
																			item.name +
																			'" ' +
																			(item.setup || !$.isEmptyObject(item.data) ? (key == 'wx_account' && !accountConfigStatus ? '' : 'checked') : '') +
																			'/>' +
																			'<span class="vertical_middle" title="' +
																			item.ps +
																			'">'+
																			item.title +
																			(!item.setup || $.isEmptyObject(item.data)
																					? '[<a target="_blank" class="bterror installNotice" data-type="' + item.name + '">未配置</a>]'
																					: key == 'wx_account' && !accountConfigStatus
																							? '[<a target="_blank" class="bterror alertInstall" data-type="' + item.name + '">未配置</a>]'
																							: '') +
																			'</span>' +
																			'</div>' +
																			'</div>';
																	continue;
																}
																_html =
																		'<div class="inlineBlock module-check ' +
																		(!item.setup || $.isEmptyObject(item.data) ? 'check_disabled' : key == 'wx_account' && !accountConfigStatus ? 'check_disabled' : '') +
																		'">' +
																		'<div class="cursor-pointer form-checkbox-label mr10" style="height:35px">' +
																		'<i class="form-checkbox cust—checkbox cursor-pointer mr5 ' +
																		(alert_message.module.indexOf(item.name) > -1 ? (!item.setup || $.isEmptyObject(item.data) ? '' : key == 'wx_account' && !accountConfigStatus ? '' : 'active') : '') +
																		'" data-type="' +
																		item.name +
																		'"></i>' +
																		'<input type="checkbox" class="form—checkbox-input hide mr10" name="' +
																		item.name +
																		'" ' +
																		(item.setup || !$.isEmptyObject(item.data) ? (key == 'wx_account' && !accountConfigStatus ? '' : 'checked') : '') +
																		'/>' +
																		'<span class="vertical_middle" title="' +
																		item.ps +
																		'">'+
																		item.title +
																		(!item.setup || $.isEmptyObject(item.data)
																				? '[<a target="_blank" class="bterror alertInstall" data-type="' + item.name + '">未配置</a>]'
																				: key == 'wx_account' && !accountConfigStatus
																						? '[<a target="_blank" class="bterror installNotice" data-type="' + item.name + '">未配置</a>]'
																						: '') +
																		'</span>' +
																		'</div>' +
																		'</div>';
																if (!item.setup) {
																	unInstall += _html;
																} else {
																	html += _html;
																}
															}
															$('.alert_type .info-r').html(wx_html + html + unInstall);
															$('.alertInstall').click(function (ev) {
																var type = $(ev.currentTarget).parent('span').siblings('input').attr('name');
																openAlertModuleInstallView(type);
															});
															$('.alert_layer .form-checkbox-label').on('click', function () {
																var that = $(this).find('i');
																if (!that.parent().parent().hasClass('check_disabled')) {
																	if (that.hasClass('active')) {
																		that.removeClass('active');
																		that.next().prop('checked', false);
																	} else {
																		that.addClass('active');
																		that.next().prop('checked', true);
																	}
																}
															});
														});
													}
												},
												yes: function (form, index) {
													var dom = $('.alert_status_input').find('input'); // 获取告警状态
													var params = {
														action:'set_cron_task',
														path: _path,
														cycle:form.corn,
														channel:'',
														status:form.status?'1':'0',
													}; // 请求参数
													var temp_arr = []; // 临时存储选中的告警方式
													// 获取选中的告警方式，排除未安装的
													$('.alert_layer .alert_type .info-r')
															.children()
															.each(function (index, item) {
																if (!$(item).hasClass('check_disabled')) {
																	var name = $(item).find('input').attr('name');
																	console.log($(item).find('input'))
																	if ($(item).find('i').hasClass('active')) {
																		temp_arr.push(name);
																	}
																}
															});
													console.log(form,temp_arr)
													if (form.status && temp_arr.length == 0) {
														bt.msg({
																status: false,
																	msg: '请选择一种告警方式',
														})
														return
													}
													params.channel = temp_arr.join(',');
													// 发送修改状态请求
													bt_tools.send({
														url:'/ajax',
														data:params
													},function (rdata) {
														if(robj==undefined){
															$($('.Content .tab-nav-border').find('span')[4]).click()
														}else {
															$($('#tabLogs').find('span')[2]).click()
														}

														bt.msg(rdata);
														layer.close(index);
													},'设置定期扫描')
												},
											});
										}
									},
								],
							},
							{
								type: 'page',
								positon: ['right', 'bottom'], // 默认在右下角
								pageParam: 'p', //分页请求字段,默认为 : p
								page: 1, //当前分页 默认：1
								numberParam: 'row',
								//分页数量请求字段默认为 : limit
								number: 10,
							},
						],
						success: function (data) {

							bt_tools.send({
								url:'/ajax',
								data:{
									action:'get_cron_task',
									path: _path,
								}
							},function (rdata){
									if(!$($('.analyse_log_table  .pull-left').find('button')[1]).hasClass('runcon')) {
										if (rdata.status == '1') {
											$($('.analyse_log_table  .pull-left').find('button')[1]).addClass('runcon').append('<span class="glyphicon glyphicon-play ac"></span>')
					} else {
											$($('.analyse_log_table .pull-left').find('button')[1]).addClass('runcon stopStatus').append('<span style="color: #ef0808; margin-left: 3px;" class="glyphicon glyphicon-pause"></span>')
										}
										$($('.analyse_log_table .pull-left').find('button')[3]).prepend('<img style="height: 25px" src="/static/img/soft_ico/ico-btwaf.svg">')
					}
									$('.analyse_log_table .pull-left').css({'display':'flex','align-items':'center'})
									cronTask = rdata
							})
				}
					})
				}

				// 扫描进度
				function detect_progress() {
					bt.send('speed_log','ajax/speed_log',{path: _path}, function (res) {
						var pro = res.msg;
						if (pro !== 100) {
							if (pro > 100) pro = 100;
							if (pro !== NaN) {
								$('.pro_style .progress-bar')
									.css('width', pro + '%')
									.html(pro + '%');
							}
							setTimeout(function () {
								detect_progress();
							}, 1000);
						} else {
							layer.msg('扫描完成', { icon: 1, timeout: 4000 });
							layer.close(progress);
							get_analysis_data();
						}
					});
				}
				// 获取扫描结果
				function get_analysis_data() {
					var loadTGA = bt.load('正在获取日志分析数据，请稍候...');
					bt.send('get_result','ajax/get_result',{path: _path}, function (rdata) {
						loadTGA.close();
						render_analyse_list(rdata, true);
					});
				}
				// 获取扫描结果详情日志
				function get_analysis_data_datail(data) {
					var html = '<div style="padding: 20px">\
								<div id="create_pop_top" style="margin-bottom: 20px">\
									<div class=" mb10" style="padding:12px;display:flex;align-items: center;background: rgb(251, 251, 251);border: 1px solid rgb(238, 238, 238);border-radius: 2px;height: 42px;">\
										<i class="sn-home--important-note">!</i>\
										<span style="color: rgb(102, 102, 102);font-weight: 600">为了保护您的网站安全，建议使用<span class="btlink nginx" >【Nginx防火墙】</span>以有效防御当前站点的'+(data.type=='san'?'扫描':data.type)+'攻击</span>\
									</div>\
								</div>\
								<div id="log-table"></div></div>'
					var ipHtml = '<div id="log-table" style="padding: 20px"></div>'
					layer.open({
						type: 1,
						closeBtn: 2,
						shadeClose: false,
						title: '【'+data.time+'】-【' + (data.type=='san'?'扫描':data.type) + '】日志详情',
						area: data.type!='ip'?['900px','710px']:['600px','710px'],
						content: (data.type!='ip'&&data.type!='url')?html:ipHtml,
						success: function () {
							var loadTGD = bt.load('正在获取日志详情数据，请稍候...');
							$('.nginx').click(function (){
								bt.send('get_soft_find', 'plugin/get_soft_find', {
									sName: 'btwaf'
								}, function (res) {
									if (res.endtime >= 0) {
										if(!res.setup){
											bt.soft.install('btwaf')
										}else {
											bt.soft.set_lib_config(res.name,res.title)
										}
									}else {
										bt.soft.get_soft_find('btwaf',function(rdata){
											bt.soft.product_pay_view({"name":rdata.title,"pid":rdata.pid,"type":rdata.type,"plugin":true,"ps":rdata.ps, 'totalNum': 25});
											setTimeout(function(){
												$('.lib_ltd').click();
											},500);
										});
									}
								});
							})
							function xssAndSqlAndSanAndPhp(data,type) {
								function htmlEncode(str){
									var div = document.createElement('div');
									div.appendChild(document.createTextNode(str));
									return div.innerHTML;
								}
								bt_tools.table({
									el: '#log-table',
									data: data.msg,
									height: '550px',
									column: [
										{
											title: '攻击IP',
											fid: 'ip',
											type: 'text',
											template: function (row) {
												return row.ip
											}
										},
										{
											title: '攻击时间',
											type: 'text',
											fid: 'time',
										},
										{
											title: 'user-agent',
											type: 'text',
											fid: 'ua',
											template: function (row) {
												return '<span  style="display: block;white-space:nowrap;text-overflow:ellipsis; overflow:hidden;width: 260px;" title="'+htmlEncode(row.ua)+'">'+htmlEncode(row.ua)+'</span>'
											}
										},
										{
											title: '请求URL',
											type: 'text',
											fid: 'url',
											template: function (row) {
												if(type=='san'){
													return '<span>'+row.url+'</span>'
												}
												return '<code>'+htmlEncode(decodeURIComponent(row.url))+'</code>'
											}
										}]
								})
							}
							function logFactory(data, type) {
									switch (type) {
										case 'xss':
										case 'sql':
										case 'san':
										case 'php':
											xssAndSqlAndSanAndPhp(data,type)
											break;
										case 'url':
											bt_tools.table({
												el: '#log-table',
												data: data.msg,
												height: '600px',
												column: [
													{
														title: '攻击次数',
														type: 'text',
														fid: 'num',
													},
													{
														title: '访问URL',
														type: 'text',
														fid: 'path'
													},
												]
											})
													break
										case 'ip':
											bt_tools.table({
												el: '#log-table',
												data: data.msg,
												height: '600px',
												column: [
													{
														title: '攻击次数',
														type: 'text',
														fid: 'num',
													},
													{
														title: '访问IP',
														type: 'text',
														fid: 'path'
													},
													]
											})
											break;
									}
							}

							bt_tools.send({
								url:'/ajax',
								data:{
									time: data.time,
									path: data.path,
									type: data.type,
									action: 'get_detailed'
								}
							},function (rdata) {
								loadTGD.close();
								logFactory(rdata,data.type);
							})
						},
					});
				}
			})
		}
		getSiteWeb(robj,web.name)
						return
						// var log = '';
						// if (bt.config.webserver == 'nginx') {
						// 	log = '.log';
						// } else if (bt.config.webserver == 'apache') {
						// 	log = '-access_log';
						// } else {
						// 	log = '_ols.access_log';
						// }
						// var progress = ''; //扫描进度
						// var loadT = bt.load('正在获取日志分析数据，请稍候...');
						// $.post('/ajax?action=get_result&path=/www/wwwlogs/' + web.name + log, function (rdata) {
						// 	loadT.close();
						// 	//1.扫描按钮
						// 	var analyes_log_btn = '<button type="button" title="日志扫描" class="btn btn-success analyes_log btn-sm mr5"><span>日志扫描</span></button>';

						// 	//2.功能介绍
						// 	var analyse_help =
						// 		'<ul class="help-info-text c7">\
            //   <li>日志安全分析：扫描网站(.log)日志中含有攻击类型的请求(类型包含：<em style="color:red">xss,sql,san,php</em>)</li>\
            //   <li>分析的日志数据包含已拦截的请求</li>\
            //   <li>默认展示上一次扫描数据(如果没有请点击日志扫描）</li>\
            //   <li>如日志文件过大，扫描可能等待时间较长，请耐心等待</li>\
            //   </ul>';

						// 	robj.append(analyes_log_btn + '<div class="analyse_log_table"></div>' + analyse_help);
						// 	render_analyse_list(rdata.data);
						// 	//事件
						// 	$(robj)
						// 		.find('.analyes_log')
						// 		.click(function () {
						// 			bt.confirm(
						// 				{
						// 					title: '扫描网站日志',
						// 					msg: '建议在服务器负载较低时进行安全分析，本次将对【' + web.name + log + '】文件进行扫描，可能等待时间较长，是否继续？',
						// 				},
						// 				function (index) {
						// 					layer.close(index);
						// 					progress = layer.open({
						// 						type: 1,
						// 						closeBtn: 2,
						// 						title: false,
						// 						shade: 0,
						// 						area: '400px',
						// 						content:
						// 							'<div class="pro_style" style="padding: 20px;"><div class="progress-head" style="padding-bottom: 10px;">正在扫描中，扫描进度...</div>\
            //           <div class="progress">\
            //             <div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 0%">0%</div>\
            //           </div>\
            //         </div>',
						// 						success: function () {
						// 							// 开启扫描并且持续获取进度
						// 							$.post('/ajax?action=log_analysis&path=/www/wwwlogs/' + web.name + log, function (rdata) {
						// 								if (rdata.status) {
						// 									detect_progress();
						// 								} else {
						// 									layer.close(progress);
						// 									layer.msg(rdata.msg, { icon: 2, time: 0, shade: 0.3, shadeClose: true });

						// 								}
						// 							});
						// 						},
						// 					});
						// 				}
						// 			);
						// 		});
						// });
						// 渲染分析日志列表
						function render_analyse_list(rdata) {
							var numTotal = rdata.xss + rdata.sql + rdata.san + rdata.php + rdata.ip + rdata.url;
							var analyse_list =
								'<div class="divtable" style="margin-top: 10px;"><table class="table table-hover">\
              <thead><tr><th width="142">扫描时间</th><th>耗时</th><th>XSS</th><th>SQL</th><th>扫描</th><th>PHP攻击</th><th>IP(top100)</th><th>URL(top100)</th><th>合计</th></tr></thead>\
              <tbody class="analyse_body">';

							if (rdata.length > 0) {
								//检测是否有扫描数据
								analyse_list +=
									'<tr>\
                  <td>' +
									rdata[0].start_time +
									'</td>\
                  <td>' +
									rdata[0].time.substring(0, 4) +
									'秒</td>\
                  <td class="onChangeLogDatail" ' +
									(rdata[0].xss > 0 ? 'style="color:red"' : '') +
									' name="xss">' +
									rdata[0].xss +
									'</td>\
                  <td class="onChangeLogDatail" ' +
									(rdata[0].sql > 0 ? 'style="color:red"' : '') +
									' name="sql">' +
									rdata[0].sql +
									'</td>\
                  <td class="onChangeLogDatail" ' +
									(rdata[0].san > 0 ? 'style="color:red"' : '') +
									' name="san">' +
									rdata[0].san +
									'</td>\
                  <td class="onChangeLogDatail" ' +
									(rdata[0].php > 0 ? 'style="color:red"' : '') +
									' name="php">' +
									rdata[0].php +
									'</td>\
                  <td class="onChangeLogDatail" ' +
									(rdata[0].ip > 0 ? 'style="color:#20a53a"' : '') +
									' name="ip">' +
									rdata[0].ip +
									'</td>\
                  <td class="onChangeLogDatail" ' +
									(rdata[0].url > 0 ? 'style="color:#20a53a"' : '') +
									' name="url">' +
									rdata[0].url +
									'</td>\
                  <td>' +
									numTotal +
									'</td>\
                </tr>';
							} else {
								analyse_list += '<tr><td colspan="9" style="text-align: center;">没有扫描数据</td></tr>';
							}
							analyse_list += '</tbody></table></div>';
							$('.analyse_log_table').html(analyse_list);
							$('.onChangeLogDatail').css('cursor', 'pointer').attr('title', '点击查看详情');
							//查看详情
							$('.onChangeLogDatail').on('click', function () {
								get_analysis_data_datail($(this).attr('name'));
							});
						}
						// 扫描进度
						function detect_progress() {
							$.post('/ajax?action=speed_log&path=/www/wwwlogs/' + web.name + log, function (res) {
								var pro = res.msg;
								if (pro !== 100) {
									if (pro > 100) pro = 100;
									if (pro !== NaN) {
										$('.pro_style .progress-bar')
											.css('width', pro + '%')
											.html(pro + '%');
									}
									setTimeout(function () {
										detect_progress();
									}, 1000);
								} else {
									layer.msg('扫描完成', { icon: 1, timeout: 4000 });
									layer.close(progress);
									get_analysis_data();
								}
							});
						}
						// 获取扫描结果
						function get_analysis_data() {
							var loadTGA = bt.load('正在获取日志分析数据，请稍候...');
							$.post('/ajax?action=get_result&path=/www/wwwlogs/' + web.name + log, function (rdata) {
								loadTGA.close();
								render_analyse_list(rdata.data, true);
							});
						}
						// 获取扫描结果详情日志
						function get_analysis_data_datail(name) {
							layer.open({
								type: 1,
								closeBtn: 2,
								shadeClose: false,
								title: '【' + name + '】日志详情',
								area: '650px',
								content: '<pre id="analysis_pre" style="background-color: #333;color: #fff;height: 545px;margin: 0;white-space: pre-wrap;border-radius: 0;"></pre>',
								success: function () {
									var loadTGD = bt.load('正在获取日志详情数据，请稍候...');
									$.post('/ajax?action=get_detailed&path=/www/wwwlogs/' + web.name + log + '&type=' + name + '', function (logs) {
										loadTGD.close();
										$('#analysis_pre').html((name == 'ip' || name == 'url' ? '&nbsp;&nbsp;[次数]&nbsp;&nbsp;[' + name + ']</br>' : '') + logs);
									});
								},
							});
						}
					},
				},
			];
			bt.render_tab('tabLogs', _tab);
			$('#tabLogs span:eq(0)').click();
		},
		/**
		 * @descripttion 网站告警
		 */
		set_site_alarms: function (web) {
			$('#webedit-con').append('<div id="tabAlarms" class="tab-nav"></div><div class="tab-con" style="padding:10px 0px;"></div>');
			var _tab = [
				{
					title: '拨测告警',
					on: true,
					callback: function (robj) {
						robj.append('<div id="boceAlarmsTable"></div>');
						var alarmList = [],
							ltd_end = parseInt(bt.get_cookie('ltd_end') || -1);
						// 获取触发条件列表
						bt_tools.send({ url: '/monitor/boce/get_alam_list' }, function (res_list) {
							for (var key in res_list) {
								if (res_list.hasOwnProperty(key)) {
									alarmList.push({
										title: res_list[key],
										value: key,
									});
								}
							}
							renderTable();
							// 渲染表格
							function renderTable(p) {
								p = p || 1;
								$('#boceAlarmsTable').empty();
								var boceTable = bt_tools.table({
									el: '#boceAlarmsTable',
									url: '/monitor/boce/get_list',
									load: true,
									height: '530',
									param: { sid: web.id, p: p },
									dataFilter: function (res) {
										$('#boceAlarmsTable .tootls_bottom .pull-right').html($(res.page.page).addClass('page'));
										$('#boceAlarmsTable .page').on('click', 'a', function (e) {
											var page = $(this).prop('href').split('p=')[1];
											renderTable(page);
											e.preventDefault();
										});
										return { data: res.data, page: res.page.page };
									},
									column: [
										{
											type: 'checkbox',
											width: 20,
										},
										{
											fid: 'name',
											title: '任务名称',
											width: 100,
											fixed: true,
										},
										{
											fid: 'cycle',
											title: '监控频率',
											width: 80,
											template: function (row) {
												return '<span title="每' + row.cycle + '分钟执行一次">' + row.cycle + '分钟</span>';
											},
										},
										{
											fid: 'trigger_condition',
											title: '触发条件',
											width: 130,
											fixed: true,
										},
										{
											fid: 'last_run_time',
											title: '最后执行时间',
											width: 110,
											template: function (row) {
												return '<span>' + (row.last_run_time ? bt.format_data(row.last_run_time, 'MM-dd hh:mm') : '-') + '</span>';
											},
										},
										{
											fid: 'status',
											title: '状态',
											type: 'switch',
											width: 60,
											event: function (row, index, ev, key, that) {
												var _status = row.status;
												bt.simple_confirm(
													{
														title: (_status ? '停止' : '开启') + '【' + row.name + '】任务',
														msg: _status ? '停止后，将不再接收该任务的拨测告警通知，是否继续？' : '开启后，检测到问题时将会发送告警通知，是否继续？',
													},
													function () {
														bt_tools.send(
															{ url: '/monitor/boce/modify', data: { id: row.id, status: row.status ? 0 : 1 } },
															function (rdata) {
																if (rdata.status) that.$refresh_table_list(true);
																bt_tools.msg(rdata);
															},
															(_status ? '停止' : '开启') + '拨测告警任务'
														);
													},
													function () {
														$(ev.currentTarget).prop('checked', row.status);
													}
												);
											},
										},
										{
											title: '操作',
											type: 'group',
											align: 'right',
											width: 200,
											group: [
												{
													title: '执行',
													event: function (row, index, ev, key, that) {
														that.startTask(row);
													},
												},
												{
													title: '日志',
													event: function (row, index, ev, key, that) {
														that.viewLog(row);
													},
												},
												{
													title: '编辑',
													event: function (row, index, ev, key, that) {
														that.openAddBoceTask(row, function (res_create) {
															if (res_create.status) that.$refresh_table_list(true);
														});
													},
												},
												{
													title: '删除',
													event: function (row, index, ev, key, that) {
														bt_tools.send({ url: '/monitor/boce/remove', data: { id: row.id } }, function (res) {
															bt_tools.msg(res);
															if (res.status) that.$refresh_table_list(true);
														});
													},
												},
											],
										},
									],
									tootls: [
										{
											type: 'group',
											positon: ['left', 'top'],
											list: [
												{
													title: '添加拨测告警',
													active: true,
													event: function (ev, that) {
														that.openAddBoceTask(undefined, function (res_create) {
															if (res_create.status) that.$refresh_table_list(true);
														});
													},
												},
											],
										},
										{
											type: 'batch',
											disabledSelectValue: '请选择需要批量操作的IP规则!',
											selectList: [
												{
													title: '执行',
													callback: function (that) {
														var ids = [];
														for (var i = 0; i < that.check_list.length; i++) {
															ids.push(that.check_list[i].id);
														}
														boceTable.eventBatch({ ids: JSON.stringify(ids), type: 'exec', title: '执行' });
													},
												},
												{
													title: '开启',
													callback: function (that) {
														var ids = [];
														for (var i = 0; i < that.check_list.length; i++) {
															ids.push(that.check_list[i].id);
														}
														boceTable.eventBatch({ ids: JSON.stringify(ids), type: 'start', title: '开启' });
													},
												},
												{
													title: '停止',
													callback: function (that) {
														var ids = [];
														for (var i = 0; i < that.check_list.length; i++) {
															ids.push(that.check_list[i].id);
														}
														boceTable.eventBatch({ ids: JSON.stringify(ids), type: 'stop', title: '停止' });
													},
												},
												{
													title: '删除',
													callback: function (that) {
														var ids = [];
														for (var i = 0; i < that.check_list.length; i++) {
															ids.push(that.check_list[i].id);
														}
														boceTable.eventBatch({ ids: JSON.stringify(ids), type: 'delete', title: '删除' });
													},
												},
											],
										},
									],
									methods: {
										/**
										 * @description 日志弹窗
										 * @param _row 行数据
										 */
										viewLog: function (_row) {
											var p = 1;
											boceTable.get_task_log({ pid: _row.id, p: p }, function (res) {
												if (!res.data.length) return layer.msg('暂无日志', { icon: 6, time: 2000 });
												bt_tools.open({
													title: '查看任务记录【' + _row.url + '】',
													btn: false,
													area: ['900px', '590px'],
													content: '<div id="log-result" style="padding: 10px 20px 20px;"></div>',
													success: function (layero) {
														renderLogTable(res);
														function renderLogTable(data) {
															$('#log-result').empty();
															bt_tools.table({
																el: '#log-result',
																data: data.data,
																height: '462px',
																column: [
																	{
																		fid: 'id',
																		title: 'ID',
																	},
																	{
																		fid: 'avgrage',
																		title: '平均耗时',
																	},
																	{
																		fid: 'min_isp',
																		title: '最快',
																		template: function (row) {
																			return '<span>' + row.min_isp + '(' + row.min + 'ms)' + '</span>';
																		},
																	},
																	{
																		fid: '',
																		title: '最慢',
																		template: function (row) {
																			return '<span>' + row.max_isp + '(' + row.max + 'ms)' + '</span>';
																		},
																	},
																	{
																		fid: '',
																		title: '执行时间',
																		template: function (row) {
																			return '<span>' + bt.format_data(row.addtime) + '</span>';
																		},
																	},
																	{
																		fid: 'status',
																		title: '状态',
																		template: function (row) {
																			return '<span class="' + (row.status == 1 ? 'color-green' : 'color-red') + '">' + (row.status == 1 ? '执行成功' : '执行错误') + '</span>';
																		},
																	},
																	{
																		title: '操作',
																		type: 'group',
																		align: 'right',
																		group: [
																			{
																				title: '删除',
																				event: function (row) {
																					bt.simple_confirm({ title: '删除日志【' + row.id + '】', msg: '删除后，该条日志将永久删除，是否继续操作？' }, function () {
																						bt_tools.send({ url: '/monitor/boce/remove_task_log', data: { id: row.id } }, function (res) {
																							bt_tools.msg(res);
																							if (res.status) {
																								boceTable.get_task_log({ pid: _row.id, p: p }, function (res) {
																									renderLogTable(res.data);
																								});
																							}
																						});
																					});
																				},
																			},
																		],
																	},
																],
																success: function () {
																	if (!$('#log-result .tootls_bottom .pull-right').length) $('#log-result').append('<div class="tootls_group tootls_bottom"><div class="pull-right"></div></div>');
																	$('#log-result .tootls_bottom .pull-right').html($(data.page.page).addClass('page'));
																	$('#log-result .page').on('click', 'a', function (e) {
																		p = $(this).prop('href').split('p=')[1];
																		boceTable.get_task_log({ pid: _row.id, p: p }, function (res_data) {
																			renderLogTable(res_data);
																		});
																		e.preventDefault();
																	});
																	$(layero).css({
																		top: ($(window).height() - $(layero).height()) / 2,
																	});
																},
															});
														}
													},
												});
											});
										},
										/**
										 * @description 获取对应的任务日志
										 * @param {*} data.pid id
										 * @param {*} data.p 分页
										 * @param {*} callback 回调
										 */
										get_task_log: function (data, callback) {
											bt_tools.send(
												{ url: '/monitor/boce/get_task_log', data: data },
												function (res) {
													if (callback) callback(res);
												},
												'加载数据'
											);
										},
										/**
										 * @description 执行任务
										 * @param _row 行数据
										 */
										startTask: function (_row) {
											bt_tools.send(
												{ url: '/monitor/boce/start', data: { id: _row.id } },
												function (res) {
													if (res.msg) {
														return bt_tools.msg(res);
													}
													bt_tools.open({
														title: '查看扫描拨测结果【' + _row.url + '】',
														btn: false,
														area: '1000px',
														content: '<div id="boce-scan-result" style="padding: 10px 20px;"></div>',
														success: function (layero) {
															bt_tools.table({
																el: '#boce-scan-result',
																data: res,
																height: '462px',
																column: [
																	{
																		fid: 'isp',
																		title: 'ISP',
																	},
																	{
																		fid: 'primary_ip',
																		title: '解析IP',
																	},
																	{
																		fid: 'http_code',
																		title: '状态',
																	},
																	{
																		fid: 'total_time',
																		title: '总耗时',
																		template: function (row) {
																			return '<span>' + boceTable.set_time_limit(1000, 500, row.total_time, 'ms') + '</span>';
																		},
																	},
																	{
																		fid: 'namelookup_time',
																		title: '解析耗时',
																		template: function (row) {
																			return '<span>' + boceTable.set_time_limit(500, 100, row.namelookup_time, 'ms') + '</span>';
																		},
																	},
																	{
																		fid: 'connect_time',
																		title: '连接耗时',
																		template: function (row) {
																			return '<span>' + boceTable.set_time_limit(500, 100, row.connect_time, 'ms') + '</span>';
																		},
																	},
																	{
																		fid: 'starttransfer_time',
																		title: '处理耗时',
																		template: function (row) {
																			return '<span>' + boceTable.set_time_limit(1000, 500, row.starttransfer_time, 'ms') + '</span>';
																		},
																	},
																	{
																		fid: 'size_download',
																		title: '响应大小',
																		template: function (row) {
																			return '<span>' + bt.format_size(row.size_download) + '</span>';
																		},
																	},
																	{
																		fid: 'speed_download',
																		title: '传输速度',
																		template: function (row) {
																			return '<span>' + bt.format_size(row.speed_download) + '/s' + '</span>';
																		},
																	},
																	{
																		fid: 'header',
																		title: '响应头',
																		template: function (row) {
																			return '<textarea rows="4" readonly style="width: 100%;border: none;outline: none;">' + (row.header ? row.header : '') + '</textarea>';
																		},
																	},
																],
																success: function () {
																	$(layero).css({
																		top: ($(window).height() - $(layero).height()) / 2,
																	});
																},
															});
															boceTable.$refresh_table_list(false);
														},
													});
												},
												'进行任务，可能需要较长时间'
											);
										},
										/**
										 * 设置时间额度
										 * @returns
										 */
										set_time_limit: function (limit1, limit2, data, units) {
											var style_s = '';
											if (data > limit1) {
												style_s = 'color:#FF5722';
											} else if (data > limit2) {
												style_s = 'color:#FFB800';
											}
											return '<span style="' + style_s + '">' + data.toFixed(2) + units + '</span>';
										},
										/**
										 * @description 批量方法
										 * @param {*} data 批量操作数据
										 */
										eventBatch: function (data) {
											bt.simple_confirm(
												{
													title: '批量' + data.title + '任务',
													msg: '您确定要批量' + data.title + '选中的任务吗，是否继续？',
												},
												function () {
													bt_tools.send(
														{ url: '/monitor/boce/batch_operation', data: { ids: data.ids, type: data.type } },
														function (res) {
															var html = '';
															for (var i = 0; i < res.msg.length; i++) {
																var item = res.msg[i];
																var status = res.status ? '#20a53a' : '#ef0808';
																for (var j in item) {
																	html += '<tr><td>' + j + '</td><td><div style="float:right;"><span style="color:' + status + '">' + item[j] + '</span></div></td></tr>';
																}
															}
															boceTable.$batch_success_table({
																title: '批量' + data.title,
																th: '任务名称',
																html: html,
															});
															boceTable.$refresh_table_list(true);
														},
														'执行批量操作'
													);
												}
											);
										},
										/**
										 * @description 编辑任务弹窗
										 * @param {*} data 编辑数据
										 * @param {*} callback 回调函数
										 */
										openAddBoceTask: function (data, callback) {
											bt.site.get_msg_configs(function (res_rdata) {
												// 左右切换按钮样式
												var left_style = {
														'border-radius': '2px',
														'border-top-right-radius': '0',
														'border-bottom-right-radius': '0',
													},
													right_style = {
														'border-radius': '2px',
														'border-top-left-radius': '0',
														'border-bottom-left-radius': '0',
														'padding-left': '24px',
													},
													arr = ['similarity', 'size', 'sensitive', 'status_code'],
													tips = {
														similarity: '当网站内容与最近一次检测结果相比存在10%的内容差异时，将触发告警',
														size: '当网站响应内容大小发生变化达到20%时，将触发告警',
														sensitive: '当网站响应内容中包含敏感词汇时，将触发告警',
														status_code: '当网站响应状态不为正常状态(200、300、302)，将触发告警',
													},
													isNameChange = false; // 是否修改过名称
												if (data) {
													for (var key in res_list) {
														if (data[key]) {
															data['method'] = key;
														}
													}
												}
												bt_tools.open({
													title: '【' + web.name + '】' + (data ? '编辑' : '添加') + '拨测任务',
													area: '560px',
													btn: [data ? '编辑告警' : '添加告警', '取消'],
													content: {
														class: 'pd20 public-form',
														formLabelWidth: '120px',
														form: [
															{
																label: '监控网站URL',
																group: [
																	{
																		name: 'url',
																		type: 'select',
																		width: '364px',
																		value: data ? data.url : '',
																		list: {
																			url: '/data?action=getData',
																			param: {
																				table: 'domain',
																				list: 'True',
																				search: web.id,
																			},
																			dataFilter: function (res, that) {
																				var list = [];
																				for (var i = 0; i < res.length; i++) {
																					list.push(
																						{
																							title: 'http://' + res[i].name,
																							value: 'http://' + res[i].name,
																						},
																						{
																							title: 'https://' + res[i].name,
																							value: 'https://' + res[i].name,
																						}
																					);
																				}
																				return list;
																			},
																		},
																	},
																],
															},
															{
																label: '任务名称',
																group: [
																	{
																		name: 'name',
																		type: 'text',
																		width: '364px',
																		value: data ? data.name : '关键词告警【' + web.name + '】',
																		placeholder: '请输入任务名称',
																		change: function (formData, element, that) {
																			isNameChange = true; // 修改过名称
																		},
																	},
																],
															},
															{
																label: '检测节点',
																group: [
																	{
																		name: 'localhost',
																		disabled: data ? true : false,
																		type: 'button',
																		title: '本地测试',
																		active: false,
																		class: data && data.address === 'node' ? '' : 'btn-cut-success',
																		style: left_style,
																		event: function (formData, element, that) {
																			var mtds = ['sensitive', 'similarity'];
																			if (mtds.indexOf(formData.method) !== -1) {
																				that.config.form[4].group[0].value = 'keyword';
																				that.config.form[4].group[0].unit = '';
																				if (!isNameChange) {
																					// 未修改过名称
																					that.config.form[1].group[0].value = '关键词告警【' + web.name + '】';
																					that.$replace_render_content(1);
																				}
																				that.config.form[5].group[0].display = true;
																				that.config.form[5].group[1].display = false;
																				that.config.form[5].display = true;
																				that.$replace_render_content(5);
																			}
																			that.config.form[4].group[0].list = alarmList.filter(function (item) {
																				return item.value !== 'sensitive' && item.value !== 'similarity';
																			});
																			that.$replace_render_content(4);

																			that.config.form[2].group[0].active = true;
																			that.config.form[2].group[1].active = false;
																			that.config.form[2].group[0].class = 'btn-cut-success';
																			that.config.form[2].group[1].class = '';
																			that.config.form[2].group[0].style = left_style;
																			that.config.form[2].group[1].style = {
																				'border-radius': '2px',
																				'border-top-left-radius': '0',
																				'border-bottom-left-radius': '0',
																				'padding-left': '24px',
																				'border-left': 'none',
																			};
																			that.$replace_render_content(2);
																			that.config.form[3].group[0].value = 10;
																			that.config.form[3].group[0].min = 10;
																			that.$replace_render_content(3);
																		},
																	},
																	{
																		name: 'node',
																		type: 'button',
																		disabled: data ? true : false,
																		active: false,
																		class: data && data.address === 'node' ? 'btn-cut-success' : '',
																		title: '<span class="glyphicon icon-vipLtd mr4" style="height: 16px;background-size: 100%;background-position-y: -3px;"></span><span>多节点测试</span>',
																		style: {
																			'border-radius': '2px',
																			'border-top-left-radius': '0',
																			'border-bottom-left-radius': '0',
																			'padding-left': '24px',
																			'border-left': 'none',
																		},
																		event: function (formData, element, that) {
																			bt.soft.detect_plugin_event({ name: 'bt_boce', version: 2.4, source: 182 }, function (dataRes, is_install) {
																				if (is_install) {
																					that.config.form[4].group[0].list = alarmList;
																					that.$replace_render_content(4);
																					that.config.form[2].group[0].active = false;
																					that.config.form[2].group[1].active = true;
																					that.config.form[2].group[0].class = '';
																					that.config.form[2].group[1].class = 'btn-cut-success';
																					that.config.form[2].group[0].style = Object.assign(left_style, { 'border-right': 'none' });
																					that.config.form[2].group[1].style = right_style;
																					that.$replace_render_content(2);
																					that.config.form[3].group[0].value = 1;
																					that.config.form[3].group[0].min = 1;
																					that.$replace_render_content(3);
																				}
																			});
																		},
																	},
																],
															},
															{
																label: '监控频率',
																group: [
																	// {
																	// 	name: 'cycle',
																	// 	type: 'select',
																	// 	value: 10,
																	// 	width: '160px',
																	// 	value: data ? data.cycle === 10 || data.cycle === 60 ? data.cycle.toString() : '' : '10',
																	// 	list: [
																	// 		{title: '10分钟',value: '10'},
																	// 		{title: '1小时',value: '60'},
																	// 		{title: '自定义',value: ''}
																	// 	],
																	// 	change: function (formData, element, that) {
																	// 		that.config.form[3].group[0].value = formData.cycle
																	// 		if(!formData.cycle) {
																	// 			that.config.form[3].group[1].display = true
																	// 		}else {
																	// 			that.config.form[3].group[1].display = false
																	// 		}
																	// 		that.$replace_render_content(3)
																	// 		$('input[name=cycleCustom]').on('input',function () {
																	// 			var type = $('.btn-cut-success.btn').prop('name'),
																	// 					val = $(this).val()
																	// 			layer.closeAll('tips')
																	// 			if(type === 'localhost' && (val < 10 || val > 60 || val === '')) {// 本地最小 10分钟
																	// 				layer.tips('本地测试时间不能'+ (val > 60 ? '高于60分钟' : '低于10分钟'), $(this), {tips: [1, '#ff0000'],time: 3000});
																	// 			}
																	// 			if(type === 'node' && (val < 1 || val > 60 || val === '')) {// 节点最小1分钟
																	// 				layer.tips('节点测试的监控频率不能'+ (val > 60 ? '高于60分钟' : '低于1分钟'), $(this), {tips: [1, '#ff0000'],time: 3000});
																	// 			}
																	// 		})
																	// 	}
																	// },
																	{
																		name: 'cycle',
																		type: 'number',
																		class: 'group',
																		width: '116px',
																		min: data && data.address === 'node' ? 1 : 10,
																		max: 60,
																		unit: '分钟',
																		value: data ? data.cycle : 10,
																	},
																],
															},
															{
																label: '告警类型',
																group: [
																	{
																		name: 'method',
																		type: 'select',
																		width: '364px',
																		disabled: data ? true : false,
																		value: data ? data.method : '',
																		list:
																			data && data.address === 'node'
																				? alarmList
																				: alarmList.filter(function (item) {
																						return item.value !== 'sensitive' && item.value !== 'similarity';
																				  }),
																		unit: data && arr.indexOf(data.method) !== -1 ? '<div class="mt10">' + tips[data.method] + '</div>' : '',
																		change: function (formData, element, that) {
																			if (arr.indexOf(formData.method) === -1) {
																				that.config.form[5].display = true;
																				that.config.form[5].group[1].display = true;
																				for (var i = 0; i < that.config.form[5].group.length; i++) {
																					if (that.config.form[5].group[i].name === formData.method) {
																						that.config.form[5].group[i].display = true;
																					} else {
																						that.config.form[5].group[i].display = false;
																					}
																				}
																				that.config.form[4].group[0].unit = '';
																			} else {
																				that.config.form[4].group[0].value = formData.method;
																				that.config.form[4].group[0].unit = '<div class="mt10">' + tips[formData.method] + '<div>';
																				that.config.form[5].display = false;
																			}
																			that.$replace_render_content(4);
																			that.$replace_render_content(5);
																			if (!isNameChange) {
																				// 未修改过名称
																				that.config.form[1].group[0].value = res_list[formData.method] + '【' + web.name + '】';
																				that.$replace_render_content(1);
																			}
																		},
																	},
																],
															},
															{
																label: '',
																display: data ? (arr.indexOf(data.method) === -1 ? true : false) : true,
																class: 'mb5',
																group: [
																	{
																		display: data ? (data.method === 'keyword' ? true : false) : true,
																		disabled: data ? true : false,
																		label: '<span class="mr4 color-red">*</span>当网站响应内容不包含',
																		value: data ? data.keyword : '',
																		name: 'keyword',
																		type: 'text',
																		width: '144px',
																		placeholder: '请输入关键词,分割',
																		unit: '内容，将触发告警',
																	},
																	// {
																	// 	display: data ? data.method === 'status_code' ? true : false : false,
																	// 	disabled: data ? true:false,
																	// 	label: '当网站响应状态不为',
																	// 	name: 'status_code',
																	// 	// type: 'select',
																	// 	value: 1,
																	// 	// disabled: true,
																	// 	// list: [{title: '正常状态（200,301,302）',value: 1}],
																	// 	// unit: '，将触发告警',
																	// 	unit: '正常状态（200,301,302），将触发告警',
																	// 	width: '160px'
																	// },
																	{
																		display: data ? (data.method === 'delay' ? true : false) : false,
																		disabled: data ? true : false,
																		label: '<span class="mr4 color-red">*</span>平均响应延迟大于',
																		name: 'delay',
																		type: 'number',
																		class: 'group',
																		unit: 'ms',
																		value: data ? data.delay : 1000,
																		width: '220px',
																	},
																],
															},
															{
																label: '告警次数',
																group: [
																	{
																		label: '<span class="c6">每日最多触发</span>',
																		name: 'alarm_count',
																		type: 'number',
																		width: '100px',
																		value: data ? (data.alarm_count ? data.alarm_count : '0') : 5,
																		min: 0,
																		unit: '次告警',
																	},
																],
															},
															{
																label: '告警方式',
																group: [
																	{
																		type: 'other',
																		boxcontent: '<div class="installPush"></div>',
																	},
																],
															},
															{
																group: [
																	{
																		type: 'help',
																		style: 'margin-top: 0;margin-left: -100px;',
																		list: ['点击配置后状态未更新，尝试点击【 <a class="handRefresh btlink">手动刷新</a> 】'],
																	},
																],
															},
														],
													},
													success: function (layero) {
														$(layero).find('.layui-layer-content').css('overflow', 'inherit');

														if(!$(layero).find('.div-box-tips').length) $(layero).find('.public-form').prepend('<div class="div-box-tips" style="border: 1px solid #EAF1F2;background:#f5faf2;color: #666;"><span>\
														<b>本地测试</b>：本机发送请求，可能导致测试结果不准确等结果<br><b>多节点测试</b>（推荐）：通过宝塔部署在全国的多个节点上来实现更全面的覆盖和测试\
														<span></span></span></div>')

														$(layero).css({
															top: ($(window).height() - $(layero).height()) / 2,
														})


														renderAlarmMothod();

														// 多节点测试提示
														// $(layero)
														// 	.find('[name=node]')
														// 	.hover(
														// 		function () {
														// 			layer.tips('通过在宝塔部署的多个节点上进行网站测试来实现更全面的覆盖和测试', $(this), { tips: [1, '#20a53a'], time: 3000 });
														// 		},
														// 		function () {
														// 			layer.closeAll('tips');
														// 		}
														// 	);

														// 监控频率
														$('input[name=cycle]').on('input', function () {
															var type = $('.btn-cut-success.btn').prop('name'),
																val = $(this).val();
															layer.closeAll('tips');
															if (type === 'localhost' && (val < 10 || val > 60 || val === '')) {
																// 本地最小 10分钟
																layer.tips('本地测试时间不能' + (val > 60 ? '高于60分钟' : '低于10分钟'), $(this), { tips: [1, '#ff0000'], time: 3000 });
															}
															if (type === 'node' && (val < 1 || val > 60 || val === '')) {
																// 节点最小1分钟
																layer.tips('节点测试的监控频率不能' + (val > 60 ? '高于60分钟' : '低于1分钟'), $(this), { tips: [1, '#ff0000'], time: 3000 });
															}
														});

														// 告警次数
														$('input[name=alarm_count]').on('input', function () {
															var val = $(this).val();
															layer.closeAll('tips');
															if (!bt.isInteger(parseFloat(val)) || val < 0 || val === '') {
																layer.tips('告警次数必须为大于等于0的整数', $(this), { tips: [1, '#ff0000'], time: 3000 });
															}
														});

														// 手动刷新
														$('.handRefresh').click(function () {
															renderAlarmMothod(true);
														});

														// 渲染告警方式
														function renderAlarmMothod(refresh) {
															if (refresh) {
																bt.site.get_msg_configs(function (rdata) {
																	pubConfig(rdata);
																});
															} else {
																pubConfig(res_rdata);
															}
														}
														function pubConfig(rdata) {
															var html = '',
																unInstall = '';
															for (var key in rdata) {
																var item = rdata[key],
																	_html = '',
																	accountConfigStatus = false;
																if (key == 'sms') continue;
																if (key === 'wx_account') {
																	if (!$.isEmptyObject(item.data) && item.data.res.is_subscribe && item.data.res.is_bound) {
																		accountConfigStatus = true; //安装微信公众号模块且绑定
																	}
																}
																_html =
																	'<div class="inlineBlock module-check ' +
																	(!item.setup || $.isEmptyObject(item.data) ? 'check_disabled' : key == 'wx_account' && !accountConfigStatus ? 'check_disabled' : '') +
																	'">' +
																	'<div class="cursor-pointer form-checkbox-label mr10">' +
																	'<i class="form-checkbox cust—checkbox cursor-pointer mr5 ' +
																	(!$.isEmptyObject(data) && data.channel && data.channel.indexOf(item.name) > -1
																		? !item.setup || $.isEmptyObject(item.data)
																			? ''
																			: key == 'wx_account' && !accountConfigStatus
																			? ''
																			: 'active'
																		: '') +
																	'" data-type="' +
																	item.name +
																	'"></i>' +
																	'<input type="checkbox" class="form—checkbox-input hide mr10" name="' +
																	item.name +
																	'" ' +
																	(item.setup || !$.isEmptyObject(item.data) ? (key == 'wx_account' && !accountConfigStatus ? '' : 'checked') : '') +
																	'/>' +
																	'<span class="vertical_middle" title="' +
																	item.ps +
																	'">' +
																	item.title +
																	(!item.setup || $.isEmptyObject(item.data)
																		? '[<a target="_blank" class="bterror installNotice" data-type="' + item.name + '">未配置</a>]'
																		: key == 'wx_account' && !accountConfigStatus
																		? '[<a target="_blank" class="bterror installNotice" data-type="' + item.name + '">未配置</a>]'
																		: '') +
																	'</span>' +
																	'</div>' +
																	'</div>';
																if (!item.setup || $.isEmptyObject(item.data)) {
																	unInstall += _html;
																} else {
																	html += _html;
																}
															}
															$('.installPush').html(html + unInstall);
															if (!$('.installPush .active').length && html != '' && !data) {
																$('.installPush .module-check:eq(0) input').prop('checked', true).prev().addClass('active');
															}
															// 安装消息通道
															$('.installPush').on('click', '.form-checkbox-label', function () {
																var that = $(this).find('i');
																if (!that.parent().parent().hasClass('check_disabled')) {
																	if (that.hasClass('active')) {
																		that.removeClass('active');
																		that.next().prop('checked', false);
																	} else {
																		that.addClass('active');
																		that.next().prop('checked', true);
																	}
																}
															});

															$('.installPush .installNotice')
																.unbind('click')
																.on('click', function () {
																	var type = $(this).data('type');
																	openAlertModuleInstallView(type);
																});
														}
													},
													yes: function (form, indexs) {
														var arry = [];
														$('.installPush .active').each(function (item) {
															var item = $(this).attr('data-type');
															arry.push(item);
														});
														if (!arry.length) return layer.msg('请选择至少一种告警通知方式', { icon: 2 });
														var param = {
															url: form.url,
															name: form.name,
															channel: arry.join(','),
															cycle: form.cycle ? parseInt(form.cycle) : '',
															address: $('.btn-cut-success.btn').prop('name'),
															alarm_count: form.alarm_count,
														};
														param[form.method] = form[form.method];
														if (data) {
															// 编辑
															param['id'] = data.id;
															var _method = $('[name=method]').val();
															form['method'] = _method;
															if (_method === 'keyword' && _method === 'size') {
																param[_method] = $('[name=' + _method + ']').val();
															} else {
																param[_method] = 1;
															}
														}
														if (!param[form.method] && arr.indexOf(form.method) === -1) return layer.msg(res_list[form.method] + '内容不能为空', { icon: 2 });
														if (param.address === 'localhost' && (param.cycle < 10 || param.cycle === '')) return layer.msg('本地测试的监控频率不能低于10分钟', { icon: 2 });
														if (param.address === 'node' && (param.cycle < 1 || param.cycle === '')) return layer.msg('节点测试的监控频率不能低于1分钟', { icon: 2 });

														if (param.alarm_count < 0 || param.alarm_count === '') return layer.msg('告警次数必须大于等于0的整数', { icon: 2 });

														if (arr.indexOf(form.method) !== -1) {
															param[form.method] = 1;
														}

														bt_tools.send(
															{ url: data ? '/monitor/boce/modify' : '/monitor/boce/create', data: param },
															function (res_create) {
																bt_tools.msg(res_create);
																if (res_create.status) layer.close(indexs);
																if (callback) callback(res_create);
															},
															data ? '修改任务' : '添加任务'
														);
													},
												});
											});
										},
									},
								});
							}
						});
					},
				},
			];
			bt.render_tab('tabAlarms', _tab);
			$('#tabAlarms span:eq(0)').click();
		},
		/**
		 * @description 其他设置(Composer、Tomcat)site.edit.set_composer\site.edit.set_tomact
		 */
		set_other: function (web) {
			$('#webedit-con').append('<div id="other-box" class="tab-nav"></div><div class="tab-con" style="padding:10px 0px;"></div>');
			var _tab = [
				{
					title: 'Composer',
					active: true,
					callback: function (robj) {
						site.edit.set_composer(web);
					},
				},
				{
					title: 'Tomcat',
					callback: function (robj) {
						site.edit.set_tomact(web, robj);
					},
				},
			];
			bt.render_tab('other-box', _tab);
			$('#other-box span:eq(0)').click();
		},
		/**
		 * @descripttion java性能监控数据
		 */
		get_performance_monitor: function (web) {
			$('#webedit-con').empty();
			if (!web.run) {
				$('#webedit-con').append(
					'<div class="mask_module" style="left:0"><div class="node_mask_module_text">请启动<a href="javascript:;" class="btlink mapExtranet" onclick="site.node.simulated_click(6)"> 项目服务 </a>后查看性能信息</div></div>' +
						'</div>'
				);
				return;
			} else if (!web.project_config.jmx_status) {
				$('#webedit-con').append(
					'<div class="mask_module" style="left:0"><div class="node_mask_module_text">请开启<a href="javascript:;" class="btlink mapExtranet" onclick="site.node.simulated_click(0)"> jmx监控 </a>后查看性能信息</div></div>' +
						'</div>'
				);
				return;
			}
			bt_tools.send(
				{ url: '/project/java/get_status_info', data: { site_id: web.id } },
				function (ress) {
					if (ress.status) {
						var system = ress.data.OperatingSystem,
							classical = ress.data.ClassLoading,
							runtime = ress.data.Runtime,
							thread = ress.data.Threading,
							compilation = ress.data.Compilation,
							bufferPool = ress.data.BufferPool,
							unmemory = ress.data.Memory;
						$('#webedit-con').append('<div class="soft-man-con bt-form" style="padding-bottom:15px"></div>');
						var tabConfig = bt_tools.tab({
							class: 'jvm_all_table',
							type: 0,
							theme: { nav: 'ml0' },
							active: 1, //激活TAB下标
							list: [
								{
									title: '系统情况',
									name: '系统情况',
									content:
										'<div id="tab_table" class="divtable jvm_table" style="overflow:inherit">\
													<table class="table table-hover table-bordered" style="width: 650px;">\
												<thead><th colspan="2" style="text-align:center">系统使用情况</th></thead>\
												<tbody>\
													<tr><td>当前打开的文件描述符数量</td><td>' +
										system.OpenFileDescriptorCount +
										'</td></tr>\
													<tr><td>最大文件描述符数量</td><td>' +
										system.MaxFileDescriptorCount +
										'</td></tr>\
													<tr><td>进程CPU时间</td><td>' +
										system.ProcessCpuTime +
										'</td></tr>\
													<tr><td>可用的物理内存大小</td><td>' +
										system.FreePhysicalMemorySize +
										'</td></tr>\
													<tr><td>总物理内存大小</td><td>' +
										system.TotalPhysicalMemorySize +
										'</td></tr>\
													<tr><td>系统 CPU 负载(CPU 使用率)</td><td>' +
										system.SystemCpuLoad +
										'</td></tr>\
													<tr><td>进程 CPU 负载</td><td>' +
										system.ProcessCpuLoad +
										'</td></tr>\
													<tr><td>系统负载平均值</td><td>' +
										system.SystemLoadAverage +
										'</td></tr>\
												<tbody>\
												</table>\
											<table class="table table-hover table-bordered" style="width: 650px;margin-top:10px">\
												<thead><th colspan="2" style="text-align:center">运行信息</th></thead>\
												<tbody>\
													<tr><td>JVM 实例的启动时间</td><td>' +
										runtime.StartTime +
										'</td></tr>\
													<tr><td>是否支持引导类路径</td><td>' +
										runtime.BootClassPathSupported +
										'</td></tr>\
													<tr><td>JVM 运行时间</td><td>' +
										runtime.Uptime +
										'</td></tr>\
													<tr><td>系统属性</td><td>' +
										runtime.SystemProperties +
										'</td></tr>\
													<tr><td>JVM 实例的名称</td><td>' +
										runtime.Name +
										'</td></tr>\
													<tr><td>JVM 类路径</td><td>' +
										runtime.ClassPath +
										'</td></tr>\
												<tbody>\
												</table>\
											<table class="table table-hover table-bordered" style="width: 650px;margin-top:10px">\
												<thead><th colspan="2" style="text-align:center">线程信息</th></thead>\
												<tbody>\
													<tr><td>峰值线程数</td><td>' +
										thread.PeakThreadCount +
										'</td></tr>\
													<tr><td>守护线程数</td><td>' +
										thread.DaemonThreadCount +
										'</td></tr>\
													<tr><td>线程数</td><td>' +
										thread.ThreadCount +
										'</td></tr>\
													<tr><td>启动的线程总数</td><td>' +
										thread.TotalStartedThreadCount +
										'</td></tr>\
													<tr><td>当前线程的 CPU 时间</td><td>' +
										thread.CurrentThreadCpuTime +
										'</td></tr>\
													<tr><td>当前线程的用户时间</td><td>' +
										thread.CurrentThreadUserTime +
										'</td></tr>\
												<tbody>\
												</table>\
													</div>',
									success: function () {}, //对tab_table进行方法渲染}
								},
								{
									title: '内存情况',
									name: '内存情况',
									content: '<div id="tab_table2"  class="divtable jvm_table" style="overflow:inherit"></div>',
									success: function () {
										var mhtml = '';
										for (var m = 0; m < ress.data.MemoryPool.length; m++) {
											var item = ress.data.MemoryPool[m],
												item_html = '';
											if (item.CollectionUsage != '无') {
												item_html =
													'<tr><td width="100" rowspan="3">CollectionUsage</td><td>最大可用内存</td><td>' +
													item.CollectionUsage.max +
													'</td></tr>\
																					<tr><td>已使用内存</td><td>' +
													item.CollectionUsage.used +
													'</td></tr>\
																					<tr><td>初始内存大小</td><td>' +
													item.CollectionUsage.init +
													'</td></tr>';
											}
											mhtml +=
												'<table class="table table-hover table-bordered" style="width: 650px;margin-top:10px">\
																		<thead><th colspan="3" style="text-align:center">' +
												item.name +
												'</th></thead>\
																		<tbody>\
																			<tr><td colspan="2">内存管理器名称列表</td><td>' +
												item.MemoryManagerNames +
												'</td></tr>\
																			<tr><td colspan="2">使用阈值</td><td>' +
												item.UsageThreshold +
												'</td></tr>\
																			<tr><td colspan="2">是否超过使用阈值</td><td>' +
												item.UsageThresholdExceeded +
												'</td></tr>\
																			<tr><td colspan="2">超过使用阈值的次数</td><td>' +
												item.UsageThresholdCount +
												'</td></tr>\
																			<tr><td colspan="2">是否支持使用阈值</td><td>' +
												item.UsageThresholdSupported +
												'</td></tr>\
																			<tr><td colspan="2">收集使用阈值</td><td>' +
												item.CollectionUsageThreshold +
												'</td></tr>\
																			<tr><td colspan="2">是否超过收集使用阈值</td><td>' +
												item.CollectionUsageThresholdExceeded +
												'</td></tr>\
																			<tr><td colspan="2">超过收集使用阈值的次数</td><td>' +
												item.CollectionUsageThresholdCount +
												'</td></tr>\
																			<tr><td colspan="2">MemoryPool是否有效</td><td>' +
												item.CollectionUsageThresholdSupported +
												'</td></tr>\
																			<tr><td colspan="2">是否支持收集使用阈值</td><td>' +
												item.Valid +
												'</td></tr>\
																			<tr><td colspan="2">名称</td><td>' +
												item.Name +
												'</td></tr>\
																			<tr><td colspan="2">内存池类型</td><td>' +
												item.Type +
												'</td></tr>\
																			<tr><td colspan="2">ObjectName</td><td><span style="width:200px">' +
												item.ObjectName +
												'</span></td></tr>\
																			<tr><td width="100" rowspan="3">使用情况</td><td>最大可用内存</td><td>' +
												item.Usage.max +
												'</td></tr>\
																			<tr><td>已使用内存</td><td>' +
												item.Usage.used +
												'</td></tr>\
																			<tr><td>初始内存大小</td><td>' +
												item.Usage.init +
												'</td></tr>\
																			<tr><td width="100" rowspan="3">PeakUsage</td><td>最大可用内存</td><td>' +
												item.PeakUsage.max +
												'</td></tr>\
																			<tr><td>已使用内存</td><td>' +
												item.PeakUsage.used +
												'</td></tr>\
																			<tr><td>初始内存大小</td><td>' +
												item.PeakUsage.init +
												'</td></tr>\
																			' +
												item_html +
												'\
																		<tbody>\
																</table>';
										}
										mhtml =
											'	<table class="table table-hover table-bordered" style="width: 650px;margin-top:10px">\
																	<thead><th colspan="3" style="text-align:center">（内存）使用情况的信息</th></thead>\
																	<tbody>\
																		<tr>\
																				<td rowspan="3">堆内存使用情况</td>\
																				<td>最大可用的堆内存大小</td><td>' +
											unmemory.HeapMemoryUsage.max +
											'</td>\
																		</tr>\
																		<tr><td>已使用内存</td><td>' +
											unmemory.HeapMemoryUsage.used +
											'</td></tr>\
																		<tr><td>初始内存</td><td>' +
											unmemory.HeapMemoryUsage.init +
											'</td></tr>\
																		<tr><td colspan="2">当前处于 finalization 队列中等待 finalization 的对象数量</td><td>' +
											unmemory.ObjectPendingFinalizationCount +
											'</td></tr>\
																		<tr><td colspan="2">是否启用详细模式</td><td>' +
											unmemory.Verbose +
											'</td></tr>\
																		<tr>\
																				<td rowspan="2">非堆内存使用情况</td>\
																				<td>最大可用的堆内存大小</td><td>' +
											unmemory.NonHeapMemoryUsage.max +
											'</td>\
																		</tr>\
																		<tr><td>已使用内存</td><td>' +
											unmemory.NonHeapMemoryUsage.used +
											'</td></tr>\
																	<tbody>\
															</table>' +
											mhtml;
										$('#tab_table2').html(mhtml);
									},
								},
								{
									title: '垃圾回收',
									name: '垃圾回收',
									content:
										'<div id="tab_table3"  class="divtable" style="overflow:inherit">\
								</div>',
									success: function () {
										var html = '';
										for (var i = 0; i < ress.data.GarbageCollector.length; i++) {
											var item = ress.data.GarbageCollector[i];
											if (item.LastGcInfo != '无') {
												html +=
													'<tr>\
													<td rowspan="9" width="80">' +
													item.name +
													'</td>\
													<td rowspan="5">最近的垃圾回收信息</td>\
													<td>垃圾回收线程数</td><td>' +
													item.LastGcInfo.GcThreadCount +
													'</td>\
													</tr>\
													<tr><td>回收持续时间</td><td>' +
													item.LastGcInfo.duration +
													'</td></tr>\
													<tr><td>结束时间</td><td>' +
													item.LastGcInfo.endTime +
													'</td></tr>\
													<tr><td>开始时间</td><td>' +
													item.LastGcInfo.startTime +
													'</td></tr>\
													<tr><td>数据库id</td><td>' +
													item.LastGcInfo.id +
													'</td></tr>\
													<tr><td colspan="2">回收次数</td><td>' +
													item.CollectionCount +
													'</td></tr>\
													<tr><td colspan="2">回收时间</td><td>' +
													item.CollectionTime +
													'</td></tr>\
													<tr><td colspan="2">是否有效</td><td>' +
													item.Valid +
													'</td></tr>\
													<tr><td colspan="2">垃圾收集器名称</td><td>' +
													item.Name +
													'</td></tr>';
											} else {
												html +=
													'<tr>\
														<td rowspan="5" width="80">' +
													item.name +
													'</td>\
														<td colspan="2">最近的垃圾回收信息</td>\
														<td>' +
													item.LastGcInfo +
													'</td>\
														</tr>\
														<tr><td colspan="2">回收次数</td><td>' +
													item.CollectionCount +
													'</td></tr>\
														<tr><td colspan="2">回收时间</td><td>' +
													item.CollectionTime +
													'</td></tr>\
														<tr><td colspan="2">是否有效</td><td>' +
													item.Valid +
													'</td></tr>\
														<tr><td colspan="2">垃圾收集器名称</td><td>' +
													item.Name +
													'</td></tr>';
											}
										}
										var garbage =
											'<table class="table table-hover table-bordered" style="width: 650px;margin-top:10px">\
									<thead><th colspan="5" style="text-align:center">垃圾回收处理信息</th></thead>\
									<tbody>' +
											html +
											'</tbody>\
									</table>';
										$('#tab_table3').html(garbage);
									},
								},
								{
									title: '其他',
									name: '其他',
									content:
										'<div id="tab_table3"  class="divtable" style="overflow:inherit">\
										<table class="table table-hover table-bordered" style="width: 650px;margin-top:10px">\
											<thead><th colspan="2" style="text-align:center">类加载器信息</th></thead>\
											<tbody>\
												<tr><td>总加载类数</td><td>' +
										classical.TotalLoadedClassCount +
										'</td></tr>\
												<tr><td>当前加载的类数</td><td>' +
										classical.LoadedClassCount +
										'</td></tr>\
												<tr><td>已卸载的类数</td><td>' +
										classical.UnloadedClassCount +
										'</td></tr>\
												<tr><td>是否启用了类加载的详细输出</td><td>' +
										classical.Verbose +
										'</td></tr>\
											<tbody>\
											</table>\
											<table class="table table-hover table-bordered" style="width: 650px;margin-top:10px">\
													<thead><th colspan="2" style="text-align:center">编译器信息</th></thead>\
													<tbody>\
														<tr><td>总编译时间</td><td>' +
										compilation.TotalCompilationTime +
										'</td></tr>\
														<tr><td>是否支持编译时间监控</td><td>' +
										compilation.CompilationTimeMonitoringSupported +
										'</td></tr>\
														<tr><td>编译器名称</td><td>' +
										compilation.Name +
										'</td></tr>\
													<tbody>\
											</table>\
											<table class="table table-hover table-bordered" style="width: 650px;margin-top:10px">\
													<thead><th colspan="3" style="text-align:center">缓冲池息</th></thead>\
													<tbody>\
														<tr>\
																<td width="120" rowspan="4">映射缓冲池的信息</td>\
																<td>总容量</td><td>' +
										bufferPool.mapped.TotalCapacity +
										'</td>\
														</tr>\
														<tr><td>已使用内存</td><td>' +
										bufferPool.mapped.MemoryUsed +
										'</td></tr>\
														<tr><td>名称</td><td>' +
										bufferPool.mapped.Name +
										'</td></tr>\
														<tr><td>缓冲区数量</td><td>' +
										bufferPool.mapped.Count +
										'</td></tr>\
														<tr>\
																<td rowspan="4" width="120">总容量</td>\
																<td>总容量</td><td>' +
										bufferPool.direct.TotalCapacity +
										'</td>\
														</tr>\
														<tr><td>已使用内存</td><td>' +
										bufferPool.direct.MemoryUsed +
										'</td></tr>\
														<tr><td>名称</td><td>' +
										bufferPool.direct.Name +
										'</td></tr>\
														<tr><td>缓冲区数量</td><td>' +
										bufferPool.direct.Count +
										'</td></tr>\
													<tbody>\
											</table>\
										</div>',
								},
							],
						});
						$('#webedit-con').find('.soft-man-con').html(tabConfig.$reader_content());
						tabConfig.$init();
					} else {
						$('#webedit-con').append('<div class="mask_module" style="left:0"><div class="node_mask_module_text" style="color:red">' + ress.msg + '</div></div>' + '</div>');
					}
				},
				{ load: '查询数据', verify: false }
			);
		},
		/**
		 * @descripttion 安全扫描
		 */
		security_scanning: function (web) {
			var that = this;
			function iconImagesUrl(name, isType) {
				if (!isType) isType = false;
				return '/static/img/scanning-' + name + (isType ? '-ico' : '') + '.svg';
			}
			var webEdit = $('#webedit-con'),
				siteName = web.name;
			var load = bt.load('正在获取授权信息，请稍后...');
			$.post('project/webscanning/ScanSingleSite', { data: JSON.stringify({ name: siteName }) }, function (res) {
				load.close();
				var scanType = { vulscan: '漏洞扫描', webscan: '网站配置安全性', filescan: '文件泄露', backup: '备份文件', webshell: '木马程序', index: '首页内容风险', webhorse:'挂马排查',deadchain:'坏链检测',database:'数据库安全',ftps:'网站FTP风险',backend:'网站后台安全' };
				var statusIcon = ['success', 'scan', 'dangerous', 'danger', 'risk'];
				var exhibitionImages = '';
				var itemList = '';
				var textList = '';
				var isScan = res.msg != 0;
				var scanDetails = '当前站点处于安全状态，请继续保持！';

				for (var key in scanType) {
					var item = scanType[key];
					exhibitionImages += '<div class="describe-item-icon"><img src="' + iconImagesUrl(key, true) + '" /><span>' + item + '</span></div>';
					itemList +=
						'<div class="scan-details-item ' +
						key +
						'-details-item">\
              <div class="scan-details-item-header">\
                  <div class="scan-type"><img src="' +
						iconImagesUrl(key, true) +
						'" /><span>' +
						item +
						'</span></div>\
                  <div class="scan-status">等待扫描</div>\
                  <div class="scan-fold"><span>展开</span><img src="/static/img/arrow-down.svg" /></span></div>\
              </div>\
              <div class="scan-details-item-body"></div>\
          </div>';
					textList += '<li><span class="li-icon"></span>' + item + '</li>';
				}

				if (!isScan) scanDetails = '当前站点安全风险未知，请点击扫描查看';
				var describe = '<div class="describe-content"><div class="describe-title">支持网站以下安全扫描项：</div><div class="describe-body">' + exhibitionImages + '</div></div>';
				var time = new Date().getTime() / 1000,
					interval = true;
				if (typeof res.msg == 'number' && res.msg != 0) {
					if (time - res.msg < 86400) interval = false;
				}
				var defaultSecurityHeader =
					'<div class="box-group"><div class="scan—status-icon"><img src="' +
					iconImagesUrl(statusIcon[4]) +
					'"><div class="scan-status-loading"></div></div>\
                <div class="scan-describe-info"><div class="scan-type">' +
					(isScan ? (typeof res.msg == 'number' && interval ? '距上次扫描时间已有<span>' + bt.get_simplify_time(res.msg) + '</span>' : '定期扫描网站，提升网站安全性') : '当前未进行安全扫描') +
					' </div><div class="scan-details">' +
					scanDetails +
					'</div></div></div>\
                <button class="scan-handle-rescan-btn hide">重新扫描</button><button class="scan-handle-btn">立即扫描</button>';
				var securitySacnHtml =
					'<div class="security-sacn" style="padding:0">\
                    <div class="security-sacn-header">' +
					defaultSecurityHeader +
					'</div>\
                    <div class="security-sacn-body"><div class="security-shadow hide"></div>' +
					describe +
					'<div class="scan-details-list">' +
					itemList +
					'</div><div class="security-shadow shadow-bottom hide"></div></div>\
                </div>';

				webEdit.html(securitySacnHtml);

				var scanBtn = $('.scan-handle-btn'),
					scanRescanBtn = $('.scan-handle-rescan-btn'),
					scanStatusIcon = $('.scan—status-icon'),
					securitySacn = $('.security-sacn'),
					scanDescribeInfo = $('.scan-describe-info'),
					scanLoad = $('.scan-status-loading'),
					scanDetailsList = $('.scan-details-list'),
					scanScrollTop = $('.security-sacn-body .security-shadow:eq(0)'),
					scanScrollBottom = $('.security-sacn-body .security-shadow.shadow-bottom:eq(0)');

				if (res.status) {
					// 设置扫描状态和显示
					function setScanInfo(config) {
						var typeElm = $('.' + config.scanType + '-details-item');
						if (typeof config.scanType != 'undefined') {
							// 扫描类型
							typeElm.find('.scan-status').html('<img style="margin-right: 5px;width: 15px;" src="/static/images/loading-2.gif" /><span style="color:#20a53a">扫描中</sapn>');
						}
						if (typeof config.scanIsDanger === 'boolean') {
							// 扫描是否为风险项
							scanLoad.addClass('error');
							scanStatusIcon.find('img').attr('src', iconImagesUrl(statusIcon[2]));
						}
						if (typeof config.scanErrorList != 'undefined') {
							// 判断是否存错误列表
							var itemHtml = '',
								itemBodys = typeElm.find('.scan-details-item-body');
							typeElm
								.find('.scan-status')
								.html(config.scanErrorList.length > 0 ? '<span style="color:red">发现' + config.scanErrorList.length + '项风险</div>' : '<span style="color:#20a53a">安全</span>');
							for (var i = 0; i < config.scanErrorList.length; i++) {
								var item = config.scanErrorList[i],
									title = bt.strim(!!item.name ? item.name : '疑似木马文件[' + item + ']'),
									body = bt.strim(!!item.repair ? item.repair : '修复方案：删除木马文件[' + item + ']');
								itemHtml +=
									'<div class="scan-error-item">\
                  <div class="scan-error-header"><span title="' +
									title +
									'">' +
									title +
									'</span><span title="点击查看修复方法">查看详情</span></div>\
                  <div class="scan-error-body" title="' +
									body +
									'">' +
									body +
									'</div>\
                </div>';
							}
							if (itemHtml != '') {
								itemBodys.html(itemHtml);
								typeElm.find('.scan-details-item-header').click();
								scanDetailsList[0].scrollTop = scanDetailsList[0].scrollHeight;
							} else {
								if (typeElm.hasClass('active')) typeElm.find('.scan-details-item-header').click();
							}
						}
						if (typeof config.scanStart !== 'undefined') {
							// 扫描开始
							scanStatusIcon.addClass('service');
						}
						if (typeof config.scanEnd !== 'undefined') {
							// 扫描结束
							scanStatusIcon.removeClass('service');
							config.scanBtn = config.scanBtn || '立即修复';
							scanDetailsList[0].scrollTop = 0;
							scanBtn.addClass('repair');
							scanRescanBtn.removeClass('hide');
						}
						if (typeof config.scanSuccess !== 'undefined') {
							// 扫描按钮
							scanBtn.addClass('complete');
						}
						config.scanStatusIcon && scanStatusIcon.find('img').attr('src', config.scanStatusIcon); // 状态ICO
						config.scanBtn && scanBtn.text(config.scanBtn); // 按钮文字
						config.scanDescribeType && scanDescribeInfo.find('.scan-type').html(config.scanDescribeType); // 扫描类型
						config.scanDescribe && scanDescribeInfo.find('.scan-details').html(config.scanDescribe); // 扫描详情
					}
					// 重置扫描视图，恢复默认状态
					function resetView() {
						setScanInfo({
							scanDescribeType: '当前未进行安全扫描',
							scanDescribe: '当前站点安全风险未知，请点击扫描查看',
							scanStatusIcon: iconImagesUrl(statusIcon[4]),
							scanBtn: '立即扫描',
						});
						scanRescanBtn.addClass('hide');
						securitySacn.removeClass('process');
						$('.scan-status').html('等待扫描');
						$('.scan-details-item-body').html('');
						scanLoad.removeClass('error');
						scanBtn.removeClass('complete repair');
						scanScrollTop.addClass('hide');
						scanScrollBottom.addClass('hide');
					}

					var connect = new CreateConnect({
						// 创建持久化链接
						name: web.name,
						onmessage: function (data) {
							// 消息监听的回调
							var config = {};
							if (!!data.isEnd) {
								// 是否结束所有扫描
								if (data.error > 0) {
									config.scanDescribeType = '扫描完成，共发现 <span style="color:red">' + data.error + '</span> 项风险';
									config.scanDescribe = '当前站点存在安全风险，请及时查看并处理';
								} else {
									config.scanDescribeType = '扫描完成，当前网站安全状态良好';
									config.scanDescribe = '请继续保持，当前状态';
									config.scanBtn = '知道了';
									config.scanSuccess = true;
								}
								config.scanStatusIcon = iconImagesUrl(statusIcon[data.error > 0 ? 3 : 0]);
								config.scanEnd = true;
								connect.cancel();
							}

							if (!!data.isStart) {
								// 单项执行扫描开始
								config.scanDescribeType = data.info + (data.error ? '，已发现 <span style="color:red">' + data.error + '</span> 项风险' : '，请稍后...');
								config.scanDescribe = '正在检测，请稍后';
								config.scanType = data.type; // 扫描类型
								config.scanError = data.errorList; // 错误列表
							}

							if (!!data.end) {
								// 单项执行扫描结束
								config.scanType = data.type; // 扫描类型
								config.scanErrorList = data.errorList;
							}

							if (!!data.isError) {
								// 是否存在异常
								config.scanIsDanger = true;
							}

							if (!!data.info) {
								// 判断是否有描述信息
								config.scanDescribe = data.info;
							}

							setScanInfo(config);
						},
					});
					var setTimes = setInterval(function () {
						if ($('.security-sacn').length == 0) {
							connect.close();
							clearInterval(setTimes);
						}
					}, 3000);
					scanBtn.on('click', function () {
						var _this = $(this);
						if (_this.hasClass('complete')) {
							resetView();
							return false;
						} else if (_this.hasClass('repair')) {
							site.repair_scheme();
						} else {
							if (!securitySacn.hasClass('process')) {
								securitySacn.addClass('process');
								setScanInfo({
									scanStart: true,
									scanStatusIcon: iconImagesUrl(statusIcon[1]),
									scanBtn: '取消扫描',
								});
								setTimeout(function () {
									connect.start();
								}, 500);
							} else {
								bt.confirm({ title: '取消扫描', msg: '网站可能存在风险，是否取消扫描当前网站，继续吗？', icon: 3, closeBtn: 2 }, function (indexs) {
									securitySacn.removeClass('process');
									setScanInfo({
										scanEnd: true,
										scanDescribeType: '当前未进行安全扫描',
										scanDescribe: '当前站点安全风险未知，请点击扫描查看',
										scanStatusIcon: iconImagesUrl(statusIcon[4]),
										scanBtn: '立即扫描',
									});
									connect.close();
									layer.close(indexs);
									resetView();
								});
							}
						}
					});
					scanDetailsList.on('click', '.scan-details-item-header', function () {
						var _this = $(this),
							parent = $(this).parent(),
							foldText = _this.find('.scan-fold span'),
							foldImg = _this.find('.scan-fold img');
						if (!parent.hasClass('active')) {
							parent.addClass('active');
							foldText.html('收起');
							foldImg.css('transform', 'rotate(180deg)');
						} else {
							parent.removeClass('active');
							foldText.html('展开');
							foldImg.removeAttr('style');
						}
						if (scanDetailsList.height() === 540) {
							scanDetailsList.css('padding-right', '10px');
						} else {
							scanDetailsList.removeAttr('style');
						}
						if (_this[0].scrollHeight > _this.height()) {
							scanScrollBottom.removeClass('hide');
						} else {
							scanScrollBottom.addClass('hide');
							scanScrollTop.addClass('hide');
						}
					});
					scanDetailsList.on('click', '.scan-error-header', function () {
						var _this = $(this).parent(),
							header = _this.find('.scan-error-header');
						if (!_this.hasClass('active')) {
							_this.addClass('active');
							header.find('span:eq(1)').html('收起详情');
						} else {
							_this.removeClass('active');
							header.find('span:eq(1)').html('查看详情');
						}
					});
					scanDetailsList.on('scroll', function () {
						var _this = $(this),
							scrollTop = parseInt(_this.scrollTop().toFixed(0)),
							scrollHeight = _this[0].scrollHeight;
						scanScrollTop.removeClass('hide');
						if (scrollHeight > _this.height()) scanScrollBottom.removeClass('hide');
						if (scrollTop === 0) {
							scanScrollTop.addClass('hide');
						} else if (scrollTop === scrollHeight - _this.height()) {
							scanScrollTop.removeClass('hide');
							scanScrollBottom.addClass('hide');
						}
					});
					scanRescanBtn.on('click', function () {
						resetView();
						scanBtn.click();
					});
				} else {
					// $('.security-sacn-body').html(
					// 	'<div class="webedit-con" style="margin-top:40px;display: flex;justify-content: space-between;align-items: center;">\
					//   <div class="thumbnail-box">\
					//     <div class="pluginTipsGg" style="background-image: url(/static/img/security-Introduction.png);"></div>\
					//   </div>\
					//   <div class="thumbnail-introduce">\
					//     <span>网站安全扫描工具介绍：</span>\
					//       <ul>\
					//         <li>支持对站点的进行如下安全扫描：<br >' +
					// 		textList +
					// 		'</li>\
					//         <li>提供修复/提供付费解决方案</li>\
					//       </ul>\
					//   </div>\
					// </div>'
					// );
					$('.security-sacn-header').remove();
					$('.security-sacn-body').html(
						'<div class="thumbnail-introduce-new" style="margin:0;padding:0px 0">\
              <div class="thumbnail-introduce-title-new" style="width:100%;justify-content:normal;flex-direction:column;padding-left: 24px;">\
                  <div class="thumbnail-title-left-new" style="width:100%;">\
                      <div class="thumbnail-title-text-new">\
                          <p>安全扫描-功能介绍</p>\
                          <p>扫描服务器系统的漏洞，异常用户，已安装软件的安全问题并提供修复方案.</p>\
                      </div>\
                  </div>\
                   <div class="thumbnail-title-button-new daily-product-buy"  style="margin:16px 0 0 0">\
                      <button class="btn btn-success btn-sm" style="width:80px" onclick="product_recommend.pay_product_sign(\'ltd\',66,\'ltd\')">立即购买</button>\
                  </div>\
            </div>\
              <div class="thumbnail-introduce-hr" style="margin:22px 0"></div>\
              <div class="thumbnail-introduce-ul-new" style="margin-bottom:20px">\
                <ul>\
                        ' +
							textList +
							'\
                </ul>\
            </div>\
            <div class="img_view" style="position: relative;">\
              <img class="product_view_img thumbnail-box" src="https://www.bt.cn/Public/new/plugin/introduce/site/security-Introduction.png" style="width:auto;margin-top:10px;height:474px"/>\
              <div class="img_view_mask"></div>\
						</div>\
          </div>'
					);
					$('.thumbnail-box,.img_view_mask').on('click', function () {
						bt.open({
							title: false,
							btn: false,
							closeBtn: 1,
							area: ['700px', '740px'],
							content: '<img src="https://www.bt.cn/Public/new/plugin/introduce/site/security-Introduction.png" style="width:100%;height: 680px;"/>',
						});
					});
					$('.scan-details').html('当前为企业版专享功能，请购买企业版后使用');
					scanBtn.on('click', function () {
						product_recommend.pay_product_sign('ltd', 66, 'ltd');
					});
				}
			});
		},
		render_recommend_product: function (tamper_core_pay, tamper_proof_pay) {
			var _config = $('.bt-w-menu.site-menu p.bgw').data('recom'),
				pay_status = product_recommend.get_pay_status(),
				recom_Template = '',
				_introduce = '';
			(recom_Template = ''), (_introduce = ''), (ltd_end = bt.get_cookie('ltd_end') > 0), (pro_end = bt.get_cookie('pro_end') > 0), (is_tamper = _config.menu_name === '防篡改');
			if (is_tamper) {
				if ((!ltd_end && !pro_end && tamper_proof_pay && !tamper_core_pay) || (pro_end && !tamper_core_pay)) {
					//普通用户已购买网站防篡改并且未购买企业防篡改 则显示 网站防篡改 配置信息
					//当前产品为专业版 未购买企业防篡改 则显示 网站防篡改 配置信息
					_config = product_recommend.get_recommend_type(6).list.filter(function (item) {
						return item.menu_name === '防篡改';
					})[0];
				}
			}
			// 1.未安装
			try {
				if (!_config['isBuy'] || !_config['install']) {
					$.each(_config['product_introduce'], function (index, item) {
						_introduce += '<li><span class="li-icon"></span>' + item + '</li>';
					});
					if ($('.thumbnail-introduce-new').length > 0) return false; //检测是否存在
					recom_Template =
						'<div class="thumbnail-introduce-new recommend" style="margin:0;padding:20px 0 10px">\
              <div class="thumbnail-introduce-title-new">\
                  <div class="thumbnail-title-left-new">\
                      <img src="/static/img/soft_ico/ico-tamper_core.png" alt="图标" class="' +
						(_config['menu_name'] === '防篡改' ? '' : 'hide') +
						'" style="width:62px"/>\
                      <div class="thumbnail-title-text-new">\
                          <p>' +
						_config['title'] +
						'-功能介绍</p>\
                        <p style="width:92%">' +
						_config['ps'] +
						'</p>\
                      </div>\
                  </div>\
                  <div class="thumbnail-title-button-new daily-product-buy" >\
                  ' +
						(_config['isBuy'] && !_config['install']
							? '<button class="btn btn-sm btn-success" style="margin-left:0;" onclick="bt.soft.install(\'' + _config['name'] + '\')">立即安装</button>'
							: '<a class="btn btn-sm btn-default mr5 ' +
							  (!_config.preview ? 'hide' : '') +
							  '" href="' +
							  _config.preview +
							  '" target="_blank">功能预览</a>\
							<button type="submit" class="btn btn-sm btn-success" onclick="product_recommend.pay_product_sign(\'ltd\',' +
							  _config.pay +
							  ",'" +
							  _config.pluginType +
							  '\')">立即购买</button>') +
						'\
                  </div>\
              </div>\
              <div class="thumbnail-introduce-hr" style="margin:20px 0"></div>\
              <div class="thumbnail-introduce-ul-new" style="margin-bottom:20px">\
                  <ul>\
                        ' +
						_introduce +
						'\
                    </ul>\
              </div>\
							<div class="img_view" style="position: relative;">\
								<img class="product_view_img" src="' +
						_config.previewImg +
						'" style="height:' +
						(_config['menu_name'] === '防篡改' ? '440' : '455') +
						'px; margin-top:10px;box-shadow: 1px 1px 30px rgb(0 0 0 / 10%);"/>\
								<div class="img_view_mask"></div>\
							</div>\
						</div>';
					//   <button type="submit" class="btn btn-sm btn-success" onclick=\"product_recommend.pay_product_sign(\'ltd\',' + _config.pay + ',\''+_config.pluginType+'\')\">立即购买</button>\
				} else {
					return true;
				}
				$('#webedit-con').append(recom_Template);
				$('.pluginTipsGg').css('background-image', 'url(' + _config.previewImg + ')');
				$('.product_view_img,.img_view_mask').on('click', function () {
					layer.open({
						title: false,
						btn: false,
						shadeClose: true,
						closeBtn: 1,
						area: ['700px', '650px'],
						content: '<img src="' + _config.previewImg + '" style="width:700px"/>',
						success: function (layero) {
							$(layero).find('.layui-layer-content').css('padding', '0');
						},
					});
				});
			} catch (err) {}
		},
	},
	// 渲染域名列表（添加情况）
	render_domain_result_table: function (data) {
		var resultHTML = '',
			noSSL = typeof data.not_ssl != 'undefined',
			_num = 0;
		$.each(data.domains, function (index, item) {
			_num++;
			resultHTML +=
				'<tr><td><span class="text-overflow" title="' +
				item.name +
				'">' +
				item.name +
				(noSSL ? ($.inArray(item.name, data.not_ssl) != -1 ? '<span class="bt-ico-ask" title="非当前域名的泛域名，无法直接使用当前站点部署的ssl证书的域名">!</span>' : '') : '') +
				'</span></td><td><span style="float:right; color:' +
				(item.status ? '#20a53a' : 'red') +
				'" title="' +
				item.msg +
				'">' +
				item.msg +
				'</span></td></tr>';
		});
		bt.open({
			type: 1,
			title: '添加域名结果',
			area: ['350px', '350px'],
			shadeClose: false,
			skin: 'batch_add_domain_result',
			closeBtn: 2,
			content:
				'<div class="batch_title"><span class><span class="batch_icon"></span><span class="batch_text">添加域名完成！</span></span></div><div class="' +
				(_num > 4 ? 'fiexd_thead' : '') +
				' batch_tabel divtable" style="margin: 15px 30px 15px 30px;overflow: auto;height: 200px;"><table class="table table-hover"><thead><tr><th>域名</th><th style="text-align:right;width:120px;">操作结果</th></tr></thead><tbody>' +
				resultHTML +
				'</tbody></table></div>',
			success: function () {
				if (_num > 4) {
					$('.batch_add_domain_result .fiexd_thead').scroll(function () {
						var scrollTop = this.scrollTop;
						this.querySelector('thead').style.transform = 'translateY(' + (scrollTop - 1) + 'px)';
					});
				}
			},
		});
	},
	// 渲染域名列表（添加情况）
	render_domain_result_table: function (data) {
		var resultHTML = '',
			noSSL = typeof data.not_ssl != 'undefined',
			_num = 0;
		$.each(data.domains, function (index, item) {
			_num++;
			resultHTML +=
				'<tr><td><span class="text-overflow" title="' +
				item.name +
				'">' +
				item.name +
				(noSSL ? ($.inArray(item.name, data.not_ssl) != -1 ? '<span class="bt-ico-ask" title="非当前域名的泛域名，无法直接使用当前站点部署的ssl证书的域名">!</span>' : '') : '') +
				'</span></td><td><span style="float:right; color:' +
				(item.status ? '#20a53a' : 'red') +
				'">' +
				item.msg +
				'</span></td></tr>';
		});
		bt.open({
			type: 1,
			title: '添加域名结果',
			area: ['350px', '350px'],
			shadeClose: false,
			skin: 'batch_add_domain_result',
			closeBtn: 2,
			content:
				'<div class="batch_title"><span class><span class="batch_icon"></span><span class="batch_text">添加域名完成！</span></span></div><div class="' +
				(_num > 4 ? 'fiexd_thead' : '') +
				' batch_tabel divtable" style="margin: 15px 30px 15px 30px;overflow: auto;height: 200px;"><table class="table table-hover"><thead><tr><th>域名</th><th style="text-align:right;width:120px;">操作结果</th></tr></thead><tbody>' +
				resultHTML +
				'</tbody></table></div>',
			success: function () {
				if (_num > 4) {
					$('.batch_add_domain_result .fiexd_thead').scroll(function () {
						var scrollTop = this.scrollTop;
						this.querySelector('thead').style.transform = 'translateY(' + (scrollTop - 1) + 'px)';
					});
				}
			},
		});
	},

	create_let: function (ddata, callback) {
		bt.site.create_let(ddata, function (ret) {
			if (ret.status) {
				if (callback) {
					callback(ret);
				} else {
					site.ssl.reload(1);
					bt.msg(ret);
					return;
				}
			} else {
				if (ret.msg) {
					if (typeof ret.msg == 'string') {
						ret.msg = [ret.msg, ''];
					}
				}
				if (!ret.out) {
					if (callback) {
						callback(ret);
						return;
					}
					bt.msg(ret);
					return;
				}
				var data = '<p>' + ret.msg + '</p><hr />';
				if (ret.err[0].length > 10) data += '<p style="color:red;">' + ret.err[0].replace(/\n/g, '<br>') + '</p>';
				if (ret.err[1].length > 10) data += '<p style="color:red;">' + ret.err[1].replace(/\n/g, '<br>') + '</p>';

				layer.msg(data, { icon: 2, area: '500px', time: 0, shade: 0.3, shadeClose: true });
			}
		});
	},
	reload: function (index) {
		if (index == undefined) index = 0;
		var _sel = $('.site-menu p.bgw');
		if (_sel.length == 0) _sel = $('.site-menu p').eq(index);
		_sel.trigger('click');
	},
	plugin_firewall: function () {
		var typename = bt.get_cookie('serverType');
		var name = 'btwaf_httpd';
		if (typename == 'nginx') name = 'btwaf';

		bt.plugin.get_plugin_byhtml(name, function (rhtml) {
			if (rhtml.status === false) return;

			var list = rhtml.split('<script type="javascript/text">');
			if (list.length > 1) {
				rcode = rhtml.split('<script type="javascript/text">')[1].replace('</script>', '');
			} else {
				list = rhtml.split('<script type="text/javascript">');
				rcode = rhtml.split('<script type="text/javascript">')[1].replace('</script>', '');
			}
			rcss = rhtml.split('<style>')[1].split('</style>')[0];
			rcode = rcode.replace('    wafview()', '');
			$('body').append('<div style="display:none"><style>' + rcss + '</style><script type="javascript/text">' + rcode + '</script></div>');

			setTimeout(function () {
				if (!!(window.attachEvent && !window.opera)) {
					execScript(rcode);
				} else {
					window.eval(rcode);
				}
			}, 200);
		});
	},
	select_site_txt: function (box, value) {
		var that = this;
		layer.open({
			type: 1,
			closeBtn: 2,
			title: '自定义域名',
			area: '600px',
			btn: ['确认', '取消'],
			content:
				'<div class="pd20"><div class="line "><span class="tname">自定义域名</span><div class="info-r "><input  name="site_name" placeholder="请输入需要申请证书的域名（单域名证书），必填项，例如：www.bt.cn" class="bt-input-text mr5 ssl_site_name_rc" type="text" value="' +
				value +
				'" style="width:400px" value=""></div></div>\
            <ul class="help-info-text c7">\
                    <li> 申请之前，请确保域名已解析，如未解析会导致审核失败(包括根域名)</li>\
                    <li>申请www.bt.cn这种以www为二级域名的证书，需绑定并解析顶级域名(bt.cn)，否则将验证失败</li>\
                    <li>SSL证书可选名称赠送规则：</li>\
                    <li>    1、申请根域名(如：bt.cn),赠送下一级为www的域名(如：www.bt.cn)</li>\
                    <li>    2、申请当前host为www的域名（如：www.bt.cn）,赠送上一级域名，(如: bt.cn)</li>\
                    <li>    3、申请其它二级域名，(如：app.bt.cn)，赠送下一级为www的域名 (如：www.app.bt.cn)</li>\
                </ul >\
            </div>',
			success: function () {
				$('[name="site_name"]').focus();
			},
			yes: function (layers, index) {
				var domain = $('.ssl_site_name_rc').val(),
					code = $('.perfect_ssl_info').data('code');
				if (!bt.check_domain(domain)) {
					return layer.msg('单域名格式错误，请重新输入', { icon: 2 });
				} else if (code.indexOf('wildcard') === -1) {
					if (domain.indexOf('*') > -1) {
						return layer.msg('当前为单域名证书，不支持通配符申请', { icon: 2 });
					}
				}
				layer.close(layers);
				$('#' + box).val($('.ssl_site_name_rc').val());
				// that.check_domain_error(domain);
			},
		});
	},
	/**
	 * @descripttion: 选择站点
	 * @author: Lifu
	 * @Date: 2020-08-14
	 * @param {String} box 输出时所用ID
	 * @return: 无返回值
	 */
	select_site_list: function (box, code) {
		var that = this,
			_optArray = [],
			all_site_list = [];

		$.post('/data?action=getData', { tojs: 'site.get_list', table: 'domain', limit: 10000, search: '', p: 1, order: 'id desc', type: -1 }, function (res) {
			var _tbody = '';
			if (res.data.length > 0) {
				$.each(res.data, function (index, item) {
					_body =
						'<tr>' +
						'<td>' +
						'<div class="box-group" style="height:16px">' +
						'<div class="bt_checkbox_groups"></div>' +
						'</div>' +
						'</td>' +
						'<td><span class="overflow_style" style="width:210px">' +
						item['name'] +
						'</span></td>' +
						'</tr>';
					if (code.indexOf('wildcard') > -1) {
						if (item['name'].indexOf('*.') > -1) {
							all_site_list.push(item['name']);
							_tbody += _body;
						}
					} else {
						all_site_list.push(item['name']);
						_tbody += _body;
					}
				});
				if (all_site_list.length == 0) {
					_tbody = '<tr><td colspan="2">暂无数据</td></tr>';
				}
			} else {
				_tbody = '<tr><td colspan="2">暂无数据</td></tr>';
			}

			layer.open({
				type: 1,
				closeBtn: 2,
				title: '选择站点',
				area: ['600px', '640px'],
				btn: ['确认', '取消'],
				content:
					'\
				<div class="pd20 dynamic_head_box">\
					<div class="line">\
						<input type="text" name="serach_site" class="bt-input-text" style="width: 560px;" placeholder="支持字段模糊搜索">\
					</div>\
					<div class="dynamic_list_table">\
						<div class="divtable" style="height:281px">\
							<table class="table table-hover">\
								<thead>\
									<th width="30">\
										<div class="box-group" style="height:16px">\
											<div class="bt_checkbox_groups" data-key="0"></div>\
										</div>\
									</th>\
									<th>域名</th>\
								</thead>\
								<tbody class="dynamic_list">' +
					_tbody +
					'</tbody>\
							</table>\
						</div>\
					</div>\
					<ul class="help-info-text c7">\
						<li> 申请之前，请确保域名已解析，如未解析会导致审核失败(包括根域名)</li>\
						<li>申请www.bt.cn这种以www为二级域名的证书，需绑定并解析顶级域名(bt.cn)，否则将验证失败</li>\
						<li>SSL证书可选名称赠送规则：</li>\
						<li>    1、申请根域名(如：bt.cn),赠送下一级为www的域名(如：www.bt.cn)</li>\
						<li>    2、申请当前host为www的域名（如：www.bt.cn）,赠送上一级域名，(如: bt.cn)</li>\
						<li>    3、申请其它二级域名，(如：app.bt.cn)，赠送下一级为www的域名 (如：www.app.bt.cn)</li>\
					</ul>\
        </div> ',
				success: function () {
					// 固定表格头部
					if (jQuery.prototype.fixedThead) {
						$('.dynamic_list_table .divtable').fixedThead({ resize: false });
					} else {
						$('.dynamic_list_table .divtable').css({ overflow: 'auto' });
					}
					//检索输入
					$('input[name=serach_site]').on('input', function () {
						var _serach = $(this).val();
						if (_serach.trim() != '') {
							$('.dynamic_list tr').each(function () {
								var _td = $(this).find('td').eq(1).html();
								if (_td.indexOf(_serach) == -1) {
									$(this).hide();
								} else {
									$(this).show();
								}
							});
						} else {
							$('.dynamic_list tr').show();
						}
					});

					// 单选设置
					$('.dynamic_list').on('click', '.bt_checkbox_groups', function (e) {
						var _tr = $(this).parents('tr');
						if ($(this).hasClass('active')) {
							$(this).removeClass('active');
						} else {
							$('.dynamic_list .bt_checkbox_groups').removeClass('active');
							$(this).addClass('active');
							_optArray = [_tr.find('td').eq(1).text()];
						}
						e.preventDefault();
						e.stopPropagation();
					});
					// tr点击时
					$('.dynamic_list').on('click', 'tr', function (e) {
						$(this).find('.bt_checkbox_groups').click();
						e.preventDefault();
						e.stopPropagation();
					});
				},
				yes: function (layers, index) {
					var _olist = [];
					if (_optArray.length > 0) {
						$.each(_optArray, function (index, item) {
							if ($.inArray(item, _olist) == -1) {
								_olist.push(item);
							}
						});
					}
					layer.close(layers);
					$('#' + box).val(_olist.join('\n'));
					$('textarea[name=lb_site]').focus();

					that.check_domain_error(_olist[0]);
				},
			});
		});
	},
	// 检测url是否异常
	check_domain_error: function (domain) {
		$('.perfect_ssl_info .testVerify').removeClass('hide');
		$('.perfect_ssl_info .testVerify').html('<img class="loading-ico" src="/static/images/loading-2.gif" /></img><span>检测中</span>');
		bt.send('check_ssl_method', 'ssl/check_ssl_method', { domain: domain }, function (res) {
			$.each(res, function (key, item) {
				var str = item === 1 ? '<a class="btlink" href="javascript:;">正常</a>' : '<a class="red error-link" href="javascript:;">异常</a>';
				$('.' + key + ' .testVerify').html(str);
				$('.' + key).data('error-data', item == 1 ? false : item);
				$('.' + key).data('show-tips', true);
			});
			for (var i = 0; i < $('.check_model_line .check_method_item').length; i++) {
				var $item = $($('.check_model_line .check_method_item')[i]);
				var data = $item.data('error-data');
				if (!data) {
					$('input[name="dcvMethod"]').removeAttr('checked');
					$item.find('input[name="dcvMethod"]').click();
					break;
				}
			}
		});
	},
	show_domain_error_dialog: function (data, msg) {
		msg = msg || '该域名的DNS解析中存在CAA记录，请删除后重新申请';
		var tbody = '';
		$.each(data, function (key, list) {
			var tr = '';
			$.each(list, function (i, listData) {
				var arr = [];
				var td = '<td>' + key + '</td><td>CAA</td>';
				$.each(listData, function (j, item) {
					arr.push(item);
				});
				td += '<td>' + arr.join(' ') + '</td>';
				tr += '<tr>' + td + '</tr>';
			});
			tbody += tr;
		});
		layer.open({
			type: 1,
			closeBtn: 2,
			shadeClose: false,
			area: '480px',
			title: '异常检测',
			content:
				'\
			<div class="pd20">\
				<p class="mb10 red">' +
				msg +
				'</p>\
				<div class="divtable">\
					<table class="table table-hover">\
						<thead>\
							<tr><th>主机记录</th><th width="80">记录类型</th><th>记录值</th></tr>\
						</thead>\
						<tbody>' +
				tbody +
				'</tbody>\
					</table>\
				</div>\
			</div>',
		});
	},
	//节点同步
	sync_node_view: function (row) {
		bt.soft.detect_plugin_event({ name: 'node_admin', version: 1.5, source: 181 }, function (dataRes, is_install) {
			if (!is_install) return false;
			//没节点同步任务是打开显示常见节点同步任务
			var sync_task_list = [],
				sync_list = {},
				node_list = {},
				site_list = [];
			var loadT = bt.load('正在检测节点同步任务列表，请稍候...');
			bt_tools.send({ url: '/plugin?action=a&name=node_admin&s=get_sync_task_list', data: { search: row.name } }, function (res_list) {
				bt_tools.send({ url: '/plugin?action=a&name=node_admin&s=get_sync_list' }, function (res_sync_list) {
					//获取节点列表
					bt_tools.send({ url: '/plugin?action=a&name=node_admin&s=get_node_list', data: { rows: 1000 } }, function (res_node_list) {
						bt_tools.send({ url: '/plugin?action=a&name=node_admin&s=get_local_site_list' }, function (res_site_list) {
							//获取本地站点列表
							loadT.close();
							node_list = res_node_list; //节点列表
							site_list = res_site_list; //本地站点列表
							sync_task_list = res_list.data;
							sync_list = res_sync_list;
							if (sync_task_list.length) history_sync_node_view();
							else create_sync_node_view();
						});
					});
				});
			});
			//打开历史节点同步任务
			function history_sync_node_view() {
				bt_tools.open({
					type: 1,
					title: '节点同步【' + row.name + '】',
					area: '800px',
					btn: false,
					skin: 'sync_node_history',
					content: {
						class: 'pd20',
						form: [
							{
								group: [
									{
										type: 'button',
										name: 'create_sync_node',
										title: '创建同步任务',
										event: function () {
											create_sync_node_view();
										},
									},
								],
							},
							{
								group: [
									{
										type: 'other',
										class: 'history_node_list',
										boxcontent: '',
									},
								],
							},
						],
					},
					success: function (layero) {
						render_node_list(sync_task_list); // 渲染节点列表
						$(layero).css({
							top: ($(window).height() - $(layero).height()) / 2 + 'px',
							left: ($(window).width() - $(layero).width()) / 2 + 'px',
						});
					},
				});
			}
			//渲染节点列表
			function render_node_list(data) {
				var num = -1,
					_li = '',
					fid_title = {
						task_name: '任务名称',
						address: '目标服务器',
						task_info: '同步内容',
						state: '同步状态',
						addtime: '同步时间',
					},
					_sync_list = {};
				for (var key in sync_list) {
					_sync_list[sync_list[key]] = key;
				}
				$('.history_node_list').empty();
				bt_tools.table({
					el: '.history_node_list',
					data: data,
					height: '400px',
					column: [
						{
							fid: 'task_name',
							title: '任务名称',
							width: 160,
							template: function (rowData) {
								num++;
								return '<span title="' + rowData.task_name + '">' + rowData.task_name + '</span>';
							},
						},
						{
							title: '同步信息',
							template: function (rowData) {
								var _task_info = JSON.parse(rowData.task_info).filter(function (item) {
										return item.name === row.name;
									}),
									_task_info_sync = [];
								for (var i = 0; i < _task_info.length; i++) {
									var item = _task_info[i];
									_task_info_sync.push(_sync_list[item.type]);
								}
								return '<div>同步【' + _task_info_sync.join('、') + '】 -> ' + rowData.address + '</div>';
							},
						},
						{
							fid: 'addtime',
							title: '同步时间',
							width: 130,
							template: function (rowData) {
								return '<span>' + new Date(rowData.addtime * 1000).toLocaleString() + '</span>';
							},
						},
						{
							title: '操作',
							align: 'right',
							width: 150,
							template: function (rowData) {
								var link = '<a class="btlink resync_task" data-index="' + num + '">立即同步</a>';
								if (rowData.state == 2) {
									link = '<span style="color: #EF0808;">' + rowData.speed + '</span>';
								}
								var span =
									'<span>' +
									link +
									'&nbsp;&nbsp;|&nbsp;&nbsp;<a class="btlink select_task" data-index="' +
									num +
									'">查看</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a class="btlink del_task" data-name="' +
									rowData.task_name +
									'" data-id="' +
									rowData.task_id +
									'">删除</a></span>';
								return span;
							},
						},
					],
					success: function () {
						// 任务详情
						$('.history_node_list .ico-ask').hover(
							function () {
								var index = $(this).data('index'),
									_tips = '';
								for (var key in fid_title) {
									var title = fid_title[key];
									var val = key === 'addtime' ? new Date(data[index][key] * 1000).toLocaleString() : data[index][key];
									if (key === 'state') {
										val = val == 2 ? data[index].speed : val == -1 ? '正在执行同步任务' : val == 0 ? '等待执行' : '已执行';
									}
									if (key === 'task_info') {
										val = JSON.parse(val);
										var _task_info = [];
										for (var i = 0; i < val.length; i++) {
											var item = val[i];
											_task_info.push(item.name + _sync_list[item.type]);
										}
										val = _task_info.join('、');
									}
									_tips += title + '：' + val + '<br>';
								}
								layer.tips(_tips, $(this), { tips: [1, '#20a53a'], time: 0 });
							},
							function () {
								layer.closeAll('tips');
							}
						);
						// 立即同步任务
						$('.resync_task').click(function () {
							var index = $(this).data('index'),
								_data = data[index],
								task_info = JSON.parse(_data.task_info),
								_task_info = [];
							var arr_task = data.filter(function (item) {
								return item.state == -1;
							});
							var resync_task_flag = arr_task.length ? true : false;
							if (resync_task_flag) {
								layer.msg('已有任务在进行中，请等待任务结束后再同步其他任务！', { icon: 2 });
								return false;
							}
							for (var i = 0; i < task_info.length; i++) {
								_task_info.push(_sync_list[task_info[i].type]);
							}
							bt.simple_confirm({ title: '同步任务', msg: '进行同步【' + _data.task_name + '】同步任务，是否继续操作？' }, function () {
								bt_tools.send(
									{ url: '/plugin?action=a&name=node_admin&s=resync_task', data: { task_id: _data.task_id } },
									function (res) {
										if (res.status) {
											refresh_sync_task_list();
										}
										bt_tools.msg(res);
									},
									'同步任务'
								);
							});
						});
						// 删除任务
						$('.del_task').click(function () {
							var task_id = $(this).data('id'),
								name = $(this).data('name');
							bt.simple_confirm({ title: '删除任务', msg: '删除【' + name + '】同步任务后，将无法继续进行同步，是否继续？' }, function () {
								bt_tools.send({ url: '/plugin?action=a&name=node_admin&s=remove_sync_task', data: { task_id: task_id } }, function (res) {
									if (res.status) {
										refresh_sync_task_list();
									}
									bt_tools.msg(res);
								});
							});
						});
						// 查看任务
						$('.select_task').click(function () {
							var index = $(this).data('index'),
								_data = data[index];
							create_sync_node_view(_data);
						});
					},
				});
			}
			//打开创建节点同步任务
			function create_sync_node_view(edit_data) {
				var is_edit = $.isEmptyObject(edit_data) ? false : true;
				_edit_task_info_arr = [];
				if (is_edit) {
					var _edit_task_info = JSON.parse(edit_data.task_info);
					for (var i = 0; i < _edit_task_info.length; i++) {
						_edit_task_info_arr.push(_edit_task_info[i].type);
					}
				}
				var local_site_list = [], //目标网站信息
					node_data = node_list['data'] ? node_list['data'] : [], //节点列表
					_group = [], //同步节点
					_group_content = [
						{
							name: 'node_cont_all',
							type: 'checkbox',
							title: '全选',
							disabled: is_edit ? true : false,
							class: 'module-check' + (is_edit ? ' check_disabled' : ''),
							event: function (formData, element, that) {
								all_select('node_cont_', 2, formData, that);
							},
						},
					];
				for (var i = 0; i < site_list.length; i++) {
					local_site_list.push({
						title: site_list[i],
						value: site_list[i],
					});
				}
				_group = render_node_data(node_data);
				for (var key in sync_list) {
					var val = sync_list[key];
					_group_content.push({
						name: 'node_cont_' + val,
						type: 'checkbox',
						title: key,
						disabled: is_edit ? true : false,
						value: is_edit && _edit_task_info_arr.indexOf(val) > -1 ? true : false,
						class: 'module-check' + (is_edit ? ' check_disabled' : ''),
						event: function (formData, element, that) {
							no_all_select('node_cont_', 2, Object.keys(sync_list).length, formData, that);
						},
					});
				}
				//渲染同步节点
				function render_node_data(_node_data) {
					var return_group = [
						{
							name: 'node_sync_all',
							type: 'checkbox',
							title: '全选',
							disabled: is_edit ? true : false,
							class: 'module-check' + (is_edit ? ' check_disabled' : ''),
							event: function (formData, element, that) {
								all_select('node_sync_', 1, formData, that);
							},
						},
						{
							name: 'node_btn',
							type: 'button',
							class: 'add_sync_node_btn',
							title: '添加同步节点',
							display: is_edit ? false : true,
							event: function (formData, element, that) {
								var urlregex = new RegExp(
									'^((https|http|ftp|rtsp|mms)?://)?' +
										'(([0-9a-z_!~*().&=+$%-]+: )?[0-9a-z_!~*().&=+$%-]+@)?' +
										'(([0-9]{1,3}.){3}[0-9]{1,3}|' +
										'([0-9a-z_!~*()-]+.)*' +
										'[a-z]{2,6})' +
										'(:[0-9]{1,5})?' +
										'((/?)|(/[0-9a-z_!~*().;?:@&=+$,%#-]+)+/?)$'
								);
								bt_tools.open({
									type: 1,
									title: '添加同步节点',
									area: '510px',
									btn: ['添加', '取消'],
									content: {
										class: 'pd20 sync_node_form add_sync_node_form',
										formLabelWidth: '88px',
										form: [
											{
												label: '面板地址',
												group: [
													{
														name: 'panel',
														type: 'text',
														width: '280px',
														style: {
															margin: 0,
														},
														placeholder: '如：http://192.168.1.41:8881，不包含安全入口',
													},
												],
											},
											{
												label: '面板API秘钥',
												group: [
													{
														name: 'token',
														type: 'textarea',
														style: {
															width: '280px',
															'min-width': '260px',
															'min-height': '94px',
															'line-height': '22px',
															resize: 'none',
														},
														placeholder: '如何获取秘钥?\n面板设置->API接口配置->面板API秘钥\n->IP白名单 加入当前服务器IP',
														unit: '<a href="https://www.bt.cn/bbs/thread-113890-1-1.html" title="点击跳转" style="line-height: 32px;" target="_blank" class="btlink ml10">如何获取API密钥</a>',
													},
												],
											},
											{
												label: '节点名称',
												group: [
													{
														name: 'title',
														type: 'text',
														width: '280px',
														style: {
															margin: 0,
														},
														placeholder: '请输入节点名称',
													},
												],
											},
											{
												label: '节点IP',
												group: [
													{
														name: 'address',
														type: 'text',
														width: '280px',
														style: {
															margin: 0,
														},
														placeholder: '如：192.168.1.41',
													},
												],
											},
											{
												label: '备注',
												group: [
													{
														name: 'ps',
														type: 'text',
														width: '280px',
														style: {
															margin: 0,
														},
														placeholder: '可选择性输入备注',
													},
												],
											},
											{
												group: [
													{
														type: 'help',
														style: { margin: '0 0 0 -88px' },
														list: ['<span class="color-org">注意：获取面板API密钥时，请加入当前服务器IP到IP白名单</span>'],
													},
												],
											},
										],
									},
									success: function () {
										var ipregex = new RegExp('^(?:(?:25[this0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
										$('[name="panel"]').bind('input propertychange', function () {
											var title = $('[name="panel"]').val().split('/'),
												_title = title[2],
												colon = new RegExp(':');
											if (urlregex.test($(this).val()) == false) {
												layer.tips('面板地址格式错误', $(this), { tips: [1, 'red'], time: 2000 });
											}
											if (colon.test(_title)) {
												(title = _title.split(':')), (_title = title[0]);
											} else {
												$('[name="address"]').val($('[name="panel"]').val());
											}
											$('[name="title"]').val(_title);
											if (ipregex.test(_title) == true) {
												$('[name="address"]').val(_title);
											} else {
												$('[name="address"]').val($('[name="panel"]').val());
											}
											$('[name=ps]').val($('[name="panel"]').val());
										});
									},
									yes: function (form, index) {
										if (form.panel == '') {
											layer.msg('面板地址不能为空，请重新输入', { icon: 2 });
											return false;
										} else {
											if (urlregex.test(form.panel) == false) {
												layer.msg('面板地址格式错误，请重新输入', { icon: 2 });
												return false;
											}
										}
										if (form.token == '') {
											layer.msg('面板密钥不能为空，请重新输入', { icon: 2 });
											return false;
										}
										if (form.title == '') {
											layer.msg('节点名称不能为空，请重新输入', { icon: 2 });
											return false;
										}
										if (form.address == '') {
											layer.msg('节点ip不能为空，请重新输入', { icon: 2 });
											return false;
										}
										var ipregex = new RegExp('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
										if (ipregex.test(form.address) == false) {
											layer.msg('节点ip格式错误，请重新输入', { icon: 2 });
											return false;
										}
										form['connect_info'] = JSON.stringify({ panel: form.panel, token: form.token });
										form['state'] = undefined;
										form['group_id'] = 1;
										form['connect_type'] = 1;
										bt_tools.send({ url: '/plugin?action=a&name=node_admin&s=create_node', data: form }, function (res) {
											if (res.status) {
												layer.close(index);
												bt_tools.send({ url: '/plugin?action=a&name=node_admin&s=get_node_list', data: { rows: 1000 } }, function (res_node_list1) {
													node_list = res_node_list1;
													that.config.form[1].group = render_node_data(node_list['data'] ? node_list['data'] : []); //重新配置节点
													that.$replace_render_content(1); //刷新
												});
											}
											bt_tools.msg(res);
										});
									},
								});
							},
						},
					];
					// 同步节点配置
					for (var i = 0; i < _node_data.length; i++) {
						var item = _node_data[i];
						return_group.push({
							name: 'node_sync_' + item.sid,
							type: 'checkbox',
							title: item.title + '【' + item.address + '】',
							newTitle: '节点名称：' + item.title + '\n节点IP：' + item.address + '\n备注：' + item.ps,
							value: is_edit && item.address === edit_data.address ? true : false,
							disabled: is_edit ? true : false,
							class: 'module-check' + (is_edit ? ' check_disabled' : ''),
							event: function (formData, element, that) {
								no_all_select('node_sync_', 1, _node_data.length, formData, that);
							},
						});
					}
					return return_group;
				}
				// 全选选择事件 str:公共name部分 i:第i+1行 formData:表单数据 that:表单对象
				function all_select(str, i, formData, that) {
					for (var key in formData) {
						if (key.indexOf(str) > -1) {
							formData[key] = key.indexOf(str) > -1 ? formData[str + 'all'] : formData[key];
							var idx = get_index(that.config.form[i].group, key);
							that.config.form[i].group[idx].value = formData[key];
						}
					}
					that.$replace_render_content(i); //刷新
				}
				// 非全选选择事件 str:公共name部分 i:第i+1行 length:渲染数据长度 formData:表单数据 that:表单对象
				function no_all_select(str, i, length, formData, that) {
					var arr = 0; //选中数量
					for (var key in formData) {
						if (key.indexOf(str) > -1 && key != str + 'all') {
							if (formData[key]) arr++;
							var idx = get_index(that.config.form[i].group, key);
							that.config.form[i].group[idx].value = formData[key];
						}
					}
					if (arr == length) {
						//全选
						formData[str + 'all'] = true;
					} else {
						//bu全选
						formData[str + 'all'] = false;
					}
					that.config.form[i].group[0].value = formData[str + 'all'];
					that.$replace_render_content(i); //刷新
				}

				var _form = [
					{
						label: '任务名称',
						group: [
							{
								name: 'task_name',
								type: 'text',
								width: '180px',
								value: is_edit ? edit_data.task_name : '',
								disabled: is_edit ? true : false,
								placeholder: '请输入同步任务名称',
							},
						],
					},
					{
						label: '同步节点<span class="ico-ask ml4" data-index="0"></span>',
						class: 'sync_checkbox_box sync_node_box',
						group: _group,
					},
					{
						label: '同步内容<span class="ico-ask ml4" data-index="1"></span>',
						class: 'sync_checkbox_box sync_content_box',
						group: _group_content,
					},
				];
				if (!is_edit) {
					_form.push({
						label: '',
						group: [
							{
								type: 'button',
								name: 'panel_site_run',
								title: '保存并立即同步',
								event: function (formData, element, that) {
									var node_length = 0,
										content_length = 0,
										task_info = [],
										sid = [];
									// target_info = $('select[name=target_info]').val()
									if (!formData.task_name) return layer.msg('同步任务名称不能为空', { icon: 2 });
									for (var key in formData) {
										if (key.indexOf('node_sync_') > -1 && formData[key] && key != 'node_sync_all') {
											sid.push(key.replace('node_sync_', ''));
											node_length++;
										}
										if (key.indexOf('node_cont_') > -1 && formData[key] && key != 'node_cont_all') {
											task_info.push(key.replace('node_cont_', ''));
											content_length++;
										}
									}
									if (!node_length) return layer.msg('最少选择一个同步节点', { icon: 2 });
									if (!content_length) return layer.msg('最少选择一个同步内容', { icon: 2 });
									// if(!target_info) return layer.msg('最少选择一个目标网站', {icon: 2})
									var param = {
										task_name: formData.task_name,
										sid: JSON.stringify(sid),
										// target_info: JSON.stringify(target_info),
										target_info: JSON.stringify([row.name]),
										task_info: JSON.stringify(task_info),
									};
									bt_tools.send(
										{ url: '/plugin?action=a&name=node_admin&s=panel_site_run', data: param },
										function (res) {
											if (res.status) {
												refresh_sync_task_list();
												$('button[name=cancel]').click();
											}
											bt_tools.msg(res);
										},
										'创建同步任务，预计需要几秒钟'
									);
								},
							},
							{
								type: 'button',
								name: 'cancel',
								style: { 'margin-left': '12px' },
								class: 'btn-danger',
								title: '取消',
							},
						],
					});
				}
				_form.push({
					group: [
						{
							type: 'help',
							style: { margin: '0 0 0 -90px' },
							list: ['温馨提示：同步时会覆盖选中节点的配置和文件'],
						},
					],
				});
				// 创建同步任务弹窗
				bt_tools.open({
					type: 1,
					title: is_edit ? '查看同步任务【' + edit_data.task_name + '】' : '创建同步任务',
					area: '560px',
					btn: false,
					content: {
						class: 'pd20 sync_node_form ' + (is_edit ? 'edit_sync_node_form' : 'edit_sync_node_form1'),
						formLabelWidth: '90px',
						form: _form,
					},
					success: function (layero, index) {
						$(layero).find('.layui-layer-content').css('overflow', 'inherit');
						// title提示事件
						$(layero)
							.find('.ico-ask')
							.hover(
								function () {
									var index = $(this).data('index'),
										_tips = index ? (index == 1 ? '需要同步的数据内容和配置' : '需要同步网站信息服务器的网站') : '需要同步网站信息的服务器';
									layer.tips(_tips, $(this), { tips: [1, '#20a53a'], time: 0 });
								},
								function () {
									layer.closeAll('tips');
								}
							);
						// 取消按钮事件 关闭弹窗
						$(layero)
							.find('button[name=cancel]')
							.removeClass('btn-success')
							.on('click', function () {
								layer.close(index);
							});
						$(layero).find('button[name=cancel]').parent().removeClass('btn-danger');
						// 表单提示
						if (!$(layero).find('.sync_node_tips').length && !is_edit) {
							$(layero).find('.sync_node_form').prepend('<div class="form_top_tips"><i class="ico-text-hint"></i>快速实现多台服务器站点信息同步功能，包括SSL证书、网站配置和文件内容修改等</div>');
						}
						if (is_edit) {
							var length = 0;
							$(layero)
								.find('.sync_content_box input')
								.each(function () {
									if ($(this).is(':checked')) length++;
								});
							if (length == Object.keys(sync_list).length) {
								//判断同步内容是否全选
								$(layero).find('.sync_content_box input[name=node_cont_all]').prop('checked', true).prev().addClass('active');
							}
						}
					},
				});
			}
			//刷新同步任务列表
			function refresh_sync_task_list() {
				bt_tools.send({ url: '/plugin?action=a&name=node_admin&s=get_sync_task_list', data: { search: row.name } }, function (res_list) {
					sync_task_list = res_list.data;
					render_node_list(sync_task_list);
				});
			}
			// 获取数组下标
			function get_index(data, key) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].name == key) return i;
				}
			}
		});
	},
	web_edit: function (obj) {
		var _this = this,
			item = obj;
		bt.open({
			type: 1,
			area: ['800px', '765px'],
			title: lan.site.website_change + '[' + item.name + ']  --  ' + lan.site.addtime + '[' + item.addtime + ']',
			closeBtn: 2,
			shift: 0,
			content: "<div class='bt-tabs'><div class='bt-w-menu site-menu pull-left' style='height: 100%;'></div><div id='webedit-con' class='bt-w-con webedit-con pd15'></div></div>",
		});
		setTimeout(function () {
			var webcache = bt.get_cookie('serverType') == 'openlitespeed' ? { title: 'LS-Cache', callback: site.edit.ols_cache } : '';
			var menus = [
				{ title: '域名管理', callback: site.edit.set_domains },
				{ title: '子目录绑定', callback: site.edit.set_dirbind },
				{ title: '网站目录', callback: site.edit.set_dirpath },
				{ title: '访问限制', callback: site.edit.set_dirguard },
				{ title: '流量限制', callback: site.edit.limit_network },
				{ title: '伪静态', callback: site.edit.get_rewrite_list },
				{ title: '默认文档', callback: site.edit.set_default_index },
				{ title: '配置文件', callback: site.edit.set_config },
				{ title: 'SSL', callback: site.set_ssl },
				{ title: 'PHP', callback: site.edit.set_php_version },
				// { title: 'Composer', callback: site.edit.set_composer },
				// { title: 'Tomcat', callback: site.edit.set_tomact },
				// { title: '重定向', callback: site.edit.set_301_old },
				{ title: '重定向', callback: site.edit.set_301 },
				{ title: '反向代理', callback: site.edit.set_proxy },
				{ title: '防盗链', callback: site.edit.set_security },
				// { title: '<span class="glyphicon icon-vipPro" style="margin-left: -23px;"></span> 防篡改', callback: site.edit.set_tamper_proof },
				// { title: '<span class="glyphicon icon-vipLtd" style="margin-left: -23px;"></span> 安全扫描', callback: site.edit.security_scanning },
				{ title: '防篡改', callback: site.edit.set_tamper },
				{ title: '安全扫描', callback: site.edit.security_scanning },
				{ title: '网站日志', callback: site.edit.get_site_logs },
				{ title: '网站告警', callback: site.edit.set_site_alarms },
				{ title: '其他设置', callback: site.edit.set_other },
				// { title: '错误日志', callback: site.edit.get_site_error_logs }
			];
			if (webcache !== '') menus.splice(3, 0, webcache);
			for (var i = 0; i < menus.length; i++) {
				var men = menus[i];
				var _p = $('<p>' + men.title + '</p>');
				_p.data('callback', men.callback);
				$('.site-menu').append(_p);
			}
			$('.site-menu p').css('padding-left', '36px');

			bt.newDotTips([{ el: '.site-menu p:eq(16)', name: 'phpWebSet', style: 'top: 16px;margin-left: 6px;' }]);

			bt.tips({ el: '.site-menu p:eq(17)', position: 'right', style: 'margin-left: -230px;margin-top: -50px;', msg: 'Composer、Tomcat已合并至其他设置', storage: 'set_other_tips' });
			$('.site-menu p:eq(17)').hover(function () {
				$(this).find('.pack-tips-box').remove();
			});

			//推荐安全软件
			product_recommend.init(function () {
				try {
					var recomConfig = product_recommend.get_recommend_type(6);
					try {
						if (recomConfig) {
							$.each(recomConfig.list, function (index, item) {
								if (item.name == 'tamper_proof') {
									bt.soft.get_soft_find('tamper_core', function (rdata_res) {
										item = {
											install: rdata_res.setup,
											isBuy: rdata_res.endtime < 0 ? false : true,
											menu_id: item.menu_id,
											menu_name: item.menu_name,
											name: 'tamper_core',
											pay: '180',
											pid: rdata_res.pid,
											pluginType: 'ltd',
											preview: '',
											previewImg: 'https://www.bt.cn/Public/new/plugin/introduce/site/tamper_core_preview.png',
											product_introduce: item.product_introduce,
											ps: rdata_res.ps,
											title: rdata_res.title,
										};
										$('.site-menu p:contains(' + item.menu_name + ')').data('recom', item);
									});
									return;
								}
								$('.site-menu p:contains(' + item.menu_name + ')').data('recom', item);
							});
						}
					} catch (err) {}

					$('.site-menu p').click(function () {
						$('#webedit-con').html('');
						$(this).addClass('bgw').siblings().removeClass('bgw');
						var callback = $(this).data('callback');
						if (callback) callback(item);
					});
					site.reload(0);
				} catch (error) {
					console.log(error);
				}
			});
		}, 100);
	},
	//批量设置站点证书
	setBathSiteSsl: function (batch_list, callback) {
		bt_tools.send(
			{
				url: '/ssl?action=SetBatchCertToSite',
				data: {
					BatchInfo: JSON.stringify(batch_list),
				},
			},
			function (res) {
				if (callback) callback(res);
			},
			'批量设置站点证书'
		);
	},
	set_ssl: function (web) {
		//站点/项目名、放置位置
		bt.site.get_site_ssl(web.name, function (rdata) {
			var type = rdata.type; // 类型
			var certificate = rdata.cert_data; // 证书信息
			var pushAlarm = rdata.push; // 是否推送告警
			var isStart = rdata.status; // 是否启用
			var layers = null;
			var expirationTime = certificate.endtime; // 证书过期时间
			var isRenew = (function () {
				// 是否续签
				var state = false;
				if (expirationTime <= 30) state = true;
				if (type === 2 && expirationTime < 0) state = true;
				if (type === 0 || type === -1) state = false;
				return state;
			})();

			// 续签视图
			function renewal_ssl_view(item) {
				bt.confirm(
					{
						title: '续签证书',
						msg: '当前证书订单需要重新生成新订单，需要手动续签，和重新部署证书，是否继续操作?',
					},
					function () {
						var loadT = bt.load('正在续签证书，可能等待时间较长，请稍候...');
						bt.send(
							'renew_cert_order',
							'ssl/renew_cert_order',
							{
								pdata: JSON.stringify({ oid: item.oid }),
							},
							function (res) {
								loadT.close();
								site.reload();
								setTimeout(function () {
									bt.msg(res);
								}, 1000);
							}
						);
					}
				);
			}

			// 申请宝塔证书
			function apply_bt_certificate() {
				var html = '';
				var domains = [];
				for (var i = 0; i < rdata.domain.length; i++) {
					var item = rdata.domain[i];
					if (item.name.indexOf('*') == -1) domains.push({ title: item.name, value: item.name });
				}
				for (var i = 0; i < domains.length; i++) {
					var item = domains[i];
					html += '<option value="' + item.value + '">' + item.title + '</option>';
				}
				bt.open({
					type: 1,
					title: '申请免费宝塔SSL证书',
					area: '610px',
					content:
						'<form class="bt_form perfect_ssl_info free_ssl_info" onsubmit="return false;">\
            <div class="line">\
                <span class="tname">证书信息</span>\
                <div class="info-r">\
                    <span class="ssl_title">TrustAsia TLS RSA CA(免费版)</span>\
                </div>\
            </div>\
            <div class="line">\
                <span class="tname">域名</span>\
                <div class="info-r"><select class="bt-input-text mr5 " name="domain" style="width:200px">' +
						html +
						'</select></div>\
            </div>\
            <div class="line">\
                <span class="tname">个人/公司名称</span>\
                <div class="info-r">\
                    <input type="text" class="bt-input-text mr5" name="orgName" value="" placeholder="请输入个人/公司名称，必填项" />\
                </div>\
            </div>\
            <div class="line">\
                <span class="tname">所在地区</span>\
                <div class="info-r">\
                    <input type="text" class="bt-input-text mr5" name="orgRegion" value="" placeholder="请输入所在省份，必填项" style="width: 190px; margin-right:0;" >\
                    <input type="text" class="bt-input-text mr5" name="orgCity" value="" placeholder="请输入所在市/县，必填项" style="width: 190px; margin-left: 15px;"  />\
                </div>\
            </div>\
            <div class="line">\
                <span class="tname">地址</span>\
                <div class="info-r">\
                    <input type="text" class="bt-input-text mr5" name="orgAddress" value="" placeholder="请输入个人/公司地址，必填项" />\
                </div>\
            </div>\
            <div class="line">\
                <span class="tname">手机</span>\
                <div class="info-r">\
                    <input type="text" class="bt-input-text mr5" name="orgPhone" value="" placeholder="请输入手机号码，必填项" />\
                </div>\
            </div>\
            <div class="line">\
                <span class="tname">邮政编码</span>\
                <div class="info-r">\
                    <input type="text" class="bt-input-text mr5" name="orgPostalCode" value="" placeholder="请输入邮政编码，必填项" />\
                </div>\
            </div>\
            <div class="line" style="display:none;">\
                <span class="tname">部门</span>\
                <div class="info-r">\
                    <input type="text" class="bt-input-text mr5" name="orgDivision" value="总务"/>\
                </div>\
            </div>\
            <div class="line">\
                <span class="tname"></span>\
                <div class="info-r">\
                    <span style="line-height: 20px;color:red;display: inline-block;">禁止含有诈骗、赌博、色情、木马、病毒等违法违规业务信息的站点申请SSL证书，如有违反，撤销申请，停用账号</span>\
                </div>\
            </div>\
            <div class="line">\
                <div class="info-r"><button class="btn btn-success submit_ssl_info">提交资料</button></div>\
            </div>\
        </form>',
					success: function (layero, index) {
						$('.submit_ssl_info').click(function () {
							var form = $('.free_ssl_info').serializeObject();
							for (var key in form) {
								if (Object.hasOwnProperty.call(form, key)) {
									var value = form[key],
										el = $('[name="' + key + '"]');
									if (value == '') {
										layer.tips(el.attr('placeholder'), el, { tips: ['1', 'red'] });
										el.focus();
										el.css('borderColor', 'red');
										return false;
									} else {
										el.css('borderColor', '');
									}
									switch (key) {
										case 'orgPhone':
											if (!bt.check_phone(value)) {
												layer.tips('手机号码格式错误', el, { tips: ['1', 'red'] });
												el.focus();
												el.css('borderColor', 'red');
												return false;
											}
											break;
										case 'orgPostalCode':
											if (!/^[0-9]\d{5}(?!\d)$/.test(value)) {
												layer.tips('邮政编号格式错误', el, { tips: ['1', 'red'] });
												el.focus();
												el.css('borderColor', 'red');
												return false;
											}
											break;
									}
								}
							}
							if (form.domain.indexOf('www.') != -1) {
								var rootDomain = form.domain.split(/www\./)[1];
								if (!$.inArray(domains, rootDomain)) {
									layer.msg('您为域名[' + form.domain + ']申请证书，但程序检测到您没有将其根域名[' + rootDomain + ']绑定并解析到站点，这会导致证书签发失败!', { icon: 2, time: 5000 });
									return;
								}
							}
							var loadT = bt.load('正在提交证书资料，请稍候...');
							bt.send('ApplyDVSSL', 'ssl/ApplyDVSSL', $.extend(form, { path: web.path }), function (tdata) {
								loadT.close();
								if (tdata.msg.indexOf('<br>') != -1) {
									layer.msg(tdata.msg, { time: 0, shadeClose: true, area: '600px', icon: 2, shade: 0.3 });
								} else {
									bt.msg(tdata);
								}
								if (tdata.status) {
									layer.close(index);
									site.ssl.verify_domain(tdata.data.partnerOrderId, web.name);
								}
							});
						});
						$('.free_ssl_info input').keyup(function (res) {
							var value = $(this).val();
							if (value == '') {
								layer.tips($(this).attr('placeholder'), $(this), { tips: ['1', 'red'] });
								$(this).focus();
								$(this).css('borderColor', 'red');
							} else {
								$(this).css('borderColor', '');
							}
						});
					},
				});
			}

			if (!Array.isArray(certificate.dns)) certificate = { dns: [] };

			$('#webedit-con').html(
				'<div class="warning_info mb10 ' +
					(!isRenew && isStart ? 'hide' : '') +
					'">' +
					'<p class="' +
					(isStart ? 'hide' : '') +
					'">温馨提示：当前站点未开启SSL证书访问，站点访问可能存在风险。<button class="btn btn-success btn-xs ml10 cutTabView">申请证书</button></p>' +
					'<p class="' +
					(isRenew && isStart ? '' : 'hide') +
					' ">温馨提示：当前[ <span class="ellipsis_text" style="display: inline-block;vertical-align:bottom;max-width: 250px;width: auto;" title="' +
					certificate.dns.join('、') +
					'">' +
					certificate.dns.join('、') +
					'</span> ]证书' +
					(expirationTime < 0 ? '已过期' : '即将过期') +
					'，请及时续签 <button class="btn btn-success btn-xs mlr15 renewCertificate" data-type="' +
					rdata.type +
					'">续签证书</button></p>' +
					'</div><div style="position: absolute;right: 0;top: '+((!isRenew && isStart)?'20px':'70px')+';"><span class="bt-desired ml10" style="background-size:contain;"><a href="javascript:;" class="btlink ml5 npsFeedback" onclick="bt.openFeedback({title:\'SSL证书需求反馈收集\',placeholder:\' <span> 如果您在使用过程中遇到任何问题或功能不完善，请将您的问题或需求详细描述给我们，</span> <br>我们将尽力为您解决或完善。\',recover:\'我们特别重视您的需求反馈，我们会定期每周进行需求评审。希望能更好的帮到您\',key:993,proType:28})">需求反馈</a> </span></div>' +
					'<div id="ssl_tabs"></div><div class="tab-con" style="padding:10px 0;"></div>'
			);
			var tabs = [
				{
					title: '当前证书 - <i class="' + (rdata.status ? 'btlink' : 'bterror') + '">[' + (rdata.status ? '已部署SSL' : '未部署SSL') + ']</i>',
					on: true,
					callback: function (content) {
						acme.id = web.id;
						var classify = '';
						var typeList = ['其他证书', "Let's Encrypt", '宝塔SSL', '商业证书'];
						var state = $(
							'<div class="ssl_state_info ' +
								(!rdata.csr ? 'hide' : '') +
								'">' +
								'<div class="state_info_flex">' +
								'<div class="state_item"><span>证书分类：</span><span><a href="javascript:;" class="btlink cutSslType" data-type="' +
								(typeList[rdata.type] === '其他证书' ? -1 : rdata.type) +
								'">' +
								(rdata.type === -1 ? '其他证书' : typeList[rdata.type]) +
								'</a></span></div>' +
								'<div class="state_item"><span>证书品牌：</span><span class="ellipsis_text" title="' +
								certificate.issuer +
								'">' +
								certificate.issuer +
								'</span></div>' +
								'</div>' +
								'<div class="state_info_flex">' +
								'<div class="state_item"><span>认证域名：</span><span class="ellipsis_text" title="' +
								certificate.dns.join('、') +
								'">' +
								certificate.dns.join('、') +
								'</span></div>' +
								'<div class="state_item"><span>到期时间：</span><span style="' +
								(expirationTime >= 30 ? '' : 'color:#EF0808') +
								'"  class="' +
								(expirationTime >= 30 ? 'btlink' : '') +
								'">' +
								(expirationTime >= 0 ? rdata.cert_data.notAfter + '，剩余' + expirationTime.toFixed(0) + '天到期' : '证书已过期') +
								'</span></div>' +
								'</div>' +
								'<div class="state_info_flex">' +
								'<div class="state_item"><span>强制HTTPS：</span><span class="bt_switch"><input class="btswitch btswitch-ios" id="https" type="checkbox" ' +
								(rdata.httpTohttps ? 'checked' : '') +
								'><label class="btswitch-btn" for="https"></label></span></div>' +
								'<div class="state_item"><span>到期提醒：</span><span class="bt_switch"><input class="btswitch btswitch-ios" id="expiration" type="checkbox" ' +
								(pushAlarm.status ? 'checked' : '') +
								'><label class="btswitch-btn" for="expiration"></label></span><a class="btlink setAlarmMode" style="margin-left: 15px;" href="javascript:;">到期提醒配置</a></div>' +
								'</div>' +
								'</div>' +
								'<div class="custom_certificate_info">' +
								'<div class="state_item"><span>密钥(KEY)</span><textarea class="bt-input-text key" name="key">' +
								(rdata.key || '') +
								'</textarea></div>' +
								'<div class="state_item"><span>证书(PEM格式)</span><textarea class="bt-input-text key" name="csr">' +
								(rdata.csr || '') +
								'</textarea></div>' +
								'</div>' +
								'<div class="mt10">' +
								'<button type="button" class="btn btn-success btn-sm mr10 saveCertificate ' +
								(isStart ? '' : '') +
								'">' +
								(isStart ? '保存' : '保存并启用证书') +
								'</button>' +
								'<button type="button" class="btn btn-success btn-sm mr10 renewCertificate ' +
								(isRenew || type === 1 ? '' : 'hide') +
								'" data-type="' +
								rdata.type +
								'">续签证书</button>' +
								'<button type="button" class="btn btn-default btn-sm mr10 downloadCertificate ' +
								(!rdata.csr ? 'hide' : '') +
								'">下载证书</button>' +
								'<button type="button" class="btn btn-default btn-sm closeCertificate ' +
								(!isStart ? 'hide' : '') +
								'">关闭SSL</button>' +
								'</div>'
						);
						content.append(state);
						content.append(
							bt.render_help([
								'粘贴您的*.key以及*.pem内容，然后保存即可<a href="http://www.bt.cn/bbs/thread-704-1-1.html" class="btlink" target="_blank">[帮助]</a>。',
								'如果浏览器提示证书链不完整,请检查是否正确拼接PEM证书',
								'PEM格式证书 = 域名证书.crt + 根证书(root_bundle).crt',
								'在未指定SSL默认站点时,未开启SSL的站点使用HTTPS会直接访问到已开启SSL的站点',
								'如开启后无法使用HTTPS访问，请检查安全组是否正确放行443端口',
							])
						);
						var setAlarmMode = bt.get_cookie('setAlarmMode');
						if (!pushAlarm.status && rdata.csr && !setAlarmMode) {
							bt.set_cookie('setAlarmMode', 1);
							layer.tips('设置证书到期告警，证书到期后，将会自动推送到期信息。', '.setAlarmMode', { tips: [1, 'red'], time: 3000 });
							setTimeout(function () {
								$(window).one('click', function () {
									layer.closeAll('tips');
								});
							}, 500);
						}
						var moduleConfig = null;
						function cacheModule(callback) {
							if (moduleConfig && callback) return callback(moduleConfig);
							bt.site.get_module_config({ name: 'site_push', type: 'ssl' }, function (rdata1) {
								moduleConfig = rdata1;
								if (callback) callback(rdata1);
							});
						}

						/**
						 * 提醒到期弹框
						 * @param $check 到期提醒开关
						 */
						function alarmMode($check) {
							var time = new Date().getTime();
							var isExpiration = pushAlarm.status;
							if ($check) isExpiration = $check.is(':checked');
							layer.open({
								type: 1,
								title: '到期提醒配置',
								area: '470px',
								closeBtn: 2,
								content:
									'\
                <div class="pd20">\
                  <div class="bt-form">\
                    <div class="line">\
                      <span class="tname">到期提醒</span>\
                      <div class="info-r line-switch">\
                        <input type="checkbox" id="dueAlarm" class="btswitch btswitch-ios" name="due_alarm" ' +
									(isExpiration ? 'checked="checked"' : '') +
									' />\
                        <label class="btswitch-btn" for="dueAlarm"></label>\
                      </div>\
                    </div>\
                    <div class="line">\
                      <span class="tname">设置站点</span>\
                      <div class="info-r">\
                        <input class="bt-input-text mr10" disabled style="width:200px;" value="' +
									web.name +
									'" />\
                      </div>\
                    </div>\
                    <div class="line">\
                      <span class="tname">证书有效期</span>\
                      <div class="info-r">\
                        <div class="inlineBlock">\
                          <span>小于</span>\
                          <input type="number" min="1" name="cycle" class="bt-input-text triggerCycle" style="width:50px;" value="' +
									(pushAlarm.cycle || '30') +
									'" />\
                          <span class="unit">天，将每天发送1次提醒。</span>\
                        </div>\
                      </div>\
                    </div>\
                    <div class="line">\
                      <span class="tname">通知方式</span>\
                      <div class="info-r installPush"></div>\
                    </div>\
                    <div class="line">\
                      <span class="tname">应用配置</span>\
                      <div class="info-r">\
                        <div class="inlineBlock module-check setAllSsl">\
                          <div class="cursor-pointer form-checkbox-label mr10">\
                            <i class="form-checkbox cust—checkbox cursor-pointer mr5"></i>\
                            <input type="checkbox" class="form—checkbox-input hide mr10" name="allSsl"/>\
                            <span class="vertical_middle">将当前配置应用到所有<span class="red">未设置过的站点</span></span>\
                          </div>\
                        </div>\
                      </div>\
                    </div>\
                  </div>\
                </div>',
								btn: ['保存配置', '取消'],
								success: function ($layer) {
									cacheModule(function (rdata1) {
										// 获取配置
										bt.site.get_msg_configs(function (rdata) {
											var html = '',
												unInstall = '',
												pushList = rdata1.push;
											for (var key in rdata) {
												var item = rdata[key],
													_html = '',
													module = pushAlarm.module || [];
												if (pushList.indexOf(item.name) === -1) continue;
												_html =
													'<div class="inlineBlock module-check ' +
													(!item.setup ? 'check_disabled' : '') +
													'">' +
													'<div class="cursor-pointer form-checkbox-label mr10">' +
													'<i class="form-checkbox cust—checkbox cursor-pointer mr5 ' +
													(module.indexOf(item.name) > -1 ? 'active' : '') +
													'" data-type="' +
													item.name +
													'"></i>' +
													'<input type="checkbox" class="form—checkbox-input hide mr10" name="' +
													item.name +
													'" ' +
													(item.setup ? 'checked' : '') +
													'/>' +
													'<span class="vertical_middle" title="' +
													item.ps +
													'">' +
													item.title +
													(!item.setup ? '[<a target="_blank" class="bterror installNotice" data-type="' + item.name + '">点击安装</a>]' : '') +
													'</span>' +
													'</div>' +
													'</div>';
												if (!item.setup) {
													unInstall += _html;
												} else {
													html += _html;
												}
											}
											$('.installPush').html(html + unInstall);
											$('.setAllSsl').on('click', function () {
												var that = $(this).find('i');
												if (that.hasClass('active')) {
													that.removeClass('active');
													that.next().prop('checked', false);
												} else {
													that.addClass('active');
													that.next().prop('checked', true);
												}
											});
											if (pushAlarm.project === 'all' && pushAlarm.status) $('.setAllSsl').trigger('click');
										});
									});

									// 安装消息通道
									$('.installPush').on('click', '.form-checkbox-label', function () {
										var that = $(this).find('i');
										if (!that.parent().parent().hasClass('check_disabled')) {
											if (that.hasClass('active')) {
												that.removeClass('active');
												that.next().prop('checked', false);
											} else {
												that.addClass('active');
												that.next().prop('checked', true);
											}
										}
									});
									$('.triggerCycle').on('input', function () {
										$('.siteSslHelp span').html($(this).val());
									});

									$('.installPush').on('click', '.installNotice', function () {
										var type = $(this).data('type');
										open_three_channel_auth(type);
									});
								},
								yes: function (index) {
									var status = $('input[name="due_alarm"]').is(':checked');
									var cycle = $('.triggerCycle').val();
									var arry = [];
									var module = '';
									var isAll = $('[name="allSsl"]').is(':checked');
									$('.installPush .active').each(function (item) {
										var item = $(this).attr('data-type');
										arry.push(item);
									});
									if (!arry.length) return layer.msg('请选择至少一种告警通知方式', { icon: 2 });
									if (!parseInt(cycle)) return layer.msg('告警通知时间，不能小于1天', { icon: 2 });

									// 参数
									var data = {
										status: status,
										type: 'ssl',
										project: web.name,
										cycle: parseInt(cycle),
										title: '网站SSL到期提醒',
										module: arry.join(','),
										interval: 600,
										push_count: parseInt(cycle),
									};

									// 判断是否点击全局应用
									if (isAll) {
										// 请求设置全局应用告警配置
										var allData = Object.assign({}, data);
										allData.status = true;
										allData.project = 'all';
										bt.site.set_push_config({
											name: 'site_push',
											id: time,
											data: JSON.stringify(allData),
										});
									}

									// 请求设置本站点告警配置
									bt.site.set_push_config(
										{
											name: 'site_push',
											id: pushAlarm.id ? pushAlarm.id : time,
											data: JSON.stringify(data),
										},
										function (rdata) {
											bt.msg(rdata);
											setTimeout(function () {
												site.reload();
											}, 1000);
											layer.close(index);
										}
									);
								},
								cancel: function () {
									$check && $check.prop('checked', !isExpiration);
								},
								btn2: function () {
									$check && $check.prop('checked', !isExpiration);
								},
							});
						}

						// 设置强制HTTPS
						$('#https').on('click', function () {
							var that = $(this),
								isHttps = $(this).is(':checked');
							if (!isHttps) {
								layer.confirm(
									'关闭强制HTTPS后需要清空浏览器缓存才能看到效果,继续吗?',
									{
										icon: 3,
										closeBtn: 2,
										title: '关闭强制HTTPS',
										cancel: function () {
											that.prop('checked', !isHttps);
										},
										btn2: function () {
											that.prop('checked', !isHttps);
										},
									},
									function () {
										bt.site.close_http_to_https(web.name, function (rdata) {
											if (rdata.status) {
												setTimeout(function () {
													site.reload(7);
												}, 3000);
											} else {
												that.prop('checked', !isHttps);
											}
										});
									}
								);
							} else {
								bt.site.set_http_to_https(web.name, function (rdata) {
									if (rdata.status) {
										setTimeout(function () {
											site.reload(7);
										}, 3000);
									} else {
										that.prop('checked', !isHttps);
									}
								});
							}
						});

						// 设置告警通知
						$('#expiration').on('click', function () {
							layer.close(layers);
							var _that = $(this);
							var isExpiration = $(this).is(':checked');
							var time = new Date().getTime();
							if (isExpiration) {
								alarmMode(_that);
							} else {
								var data = JSON.stringify({
									status: isExpiration,
									type: 'ssl',
									project: web.name,
									cycle: parseInt(pushAlarm.cycle),
									title: '网站SSL到期提醒',
									module: pushAlarm.module,
									interval: 600,
									push_count: parseInt(pushAlarm.cycle),
								});
								var id = pushAlarm.id ? pushAlarm.id : time;
								if (pushAlarm.project === 'all') id = time;
								bt.site.set_push_config(
									{
										name: 'site_push',
										id: id,
										data: data,
									},
									function (rdata) {
										bt.msg(rdata);
										setTimeout(function () {
											site.reload();
										}, 1000);
									}
								);
							}
						});

						// 保存证书
						$('.saveCertificate').on('click', function () {
							var key = $('[name="key"]').val(),
								csr = $('[name="csr"]').val();
							function set_ssl() {
								if (key === '' || csr === '') return bt.msg({ status: false, msg: '请填写完整的证书内容' });
								bt.site.set_ssl(
									web.name,
									{
										type: rdata.type,
										siteName: rdata.siteName,
										key: key,
										csr: csr,
									},
									function (ret) {
										if (ret.status) site.reload(7);
										if (site.model_table) site.model_table.$refresh_table_list(true);
										if (node_table) node_table.$refresh_table_list(true);
										if (site_table) site_table.$refresh_table_list(true);
										bt.msg(ret);
									}
								);
							}

							if ((key !== rdata.key && rdata.key) || (csr !== rdata.csr && rdata.key)) {
								layer.confirm(
									'当前证书内容发生改变，证书信息将同步更新，继续操作？',
									{
										icon: 3,
										closeBtn: 2,
										title: '证书保存提示',
									},
									set_ssl
								);
							} else {
								set_ssl();
							}
						});

						// 告警方式
						$('.setAlarmMode').on('click', function () {
							layer.close(layers);
							alarmMode();
						});

						// 续签证书
						$('.renewCertificate')
							.unbind('click')
							.on('click', function () {
								var type = parseInt($(this).attr('data-type'));
								switch (type /**/) {
									case 3: // 商业证书续签
										renewal_ssl_view({ oid: rdata.oid });
										break;
									case 2: // 宝塔证书 续签
										apply_bt_certificate();
										layer.msg('当前证书类型不支持一键续签操作，请重新填写信息申请', { icon: 2, time: 2000 });
										break;
									case 1: // Let's Encrypt 续签
										site.ssl.renew_ssl(web.name, rdata.auth_type, rdata.index);
										break;
								}
							});

						// 关闭证书
						$('.closeCertificate').on('click', function () {
							site.ssl.set_ssl_status('CloseSSLConf', web.name);
						});

						// 切换证书类型
						$('.cutSslType').on('click', function () {
							var type = $(this).attr('data-type');
							switch (type) {
								case '0':
									type = 0;
									break;
								case '1':
									type = 3;
									break;
								case '2':
									type = 2;
									break;
								case '3':
									type = 1;
									break;
							}
							$('#ssl_tabs span:eq(' + type + ')').trigger('click');
						});

						// 下载证书
						$('.downloadCertificate').on('click', function () {
							var key = $('[name="key"]').val(),
								pem = $('[name="csr"]').val();
							bt.site.download_cert(
								{
									siteName: web.name,
									pem: pem,
									key: key,
								},
								function (rdata) {
									if (rdata.status) window.open('/download?filename=' + encodeURIComponent(rdata.msg));
								}
							);
						});
					},
				},
				{
					title: "商用SSL证书<i class='ssl_recom_icon'></i>",
					callback: function (robj) {
						robj = $('#webedit-con .tab-con');
						bt.pub.get_user_info(function (udata) {
							if (udata.status) {
								var deploy_ssl_info = rdata,
									html = '',
									deploy_html = '',
									product_list,
									userInfo,
									order_list,
									is_check = true,
									itemData,
									activeData,
									loadY,
									pay_ssl_layer;
								bt.send('get_order_list', 'ssl/get_order_list', {}, function (rdata) {
									order_list = rdata;
									if (rdata.length == 0) {
										$('#ssl_order_list tbody').html(
											'<tr><td colspan="5" style="text-align:center;">暂无证书 <a class="btlink" href="javascript:$(\'.ssl_business_application\').click();"> ->申请证书</a></td></tr>'
										);
										return;
									}
									$.each(rdata, function (index, item) {
										if (deploy_ssl_info.type == 3 && deploy_ssl_info.oid === item.oid) {
											deploy_html +=
												'<tr data-index="' +
												index +
												'">' +
												'<td><span>' +
												item.domainName.join('、') +
												'</span></td><td><span class="size_ellipsis" title="' +
												item.title +
												'" style="width:164px">' +
												item.title +
												'</span></td><td>' +
												(function () {
													var dayTime = new Date().getTime() / 1000,
														color = '',
														endTiems = '';
													if (item.endDate != '') {
														item.endDate = parseInt(item.endDate);
														endTiems = parseInt((item.endDate - dayTime) / 86400);
														if (endTiems <= 15) color = 'orange';
														if (endTiems <= 7) color = 'red';
														if (endTiems < 0) return '<span style="color:red">已过期</span>';
														return '<span style="' + color + '">剩余' + endTiems + '天</span>';
													} else {
														return '--';
													}
												})() +
												'</td><td>订单完成</td><td style="text-align:right">已部署 | <a class="btlink" href="javascript:site.ssl.set_ssl_status(\'CloseSSLConf\',\'' +
												web.name +
												'\',2)">关闭</a></td></td>';
										} else {
											html +=
												'<tr data-index="' +
												index +
												'">' +
												'<td><span>' +
												(item.domainName == null ? '--' : item.domainName.join('、')) +
												'</span></td><td><span class="size_ellipsis" title="' +
												item.title +
												'" style="width:164px">' +
												item.title +
												'</span></td><td>' +
												(function () {
													var dayTime = new Date().getTime() / 1000,
														color = '',
														endTiems = '';
													if (item.endDate != '') {
														item.endDate = parseInt(item.endDate);
														endTiems = parseInt((item.endDate - dayTime) / 86400);
														if (endTiems <= 15) color = 'orange';
														if (endTiems <= 7) color = 'red';
														if (endTiems < 0) return '<span style="color:red">已过期</span>';
														return '<span style="' + color + '">剩余' + endTiems + '天</span>';
													} else {
														return '--';
													}
												})() +
												'</td><td>' +
												(function () {
													var suggest = '';
													if (!item.install)
														suggest =
															'&nbsp;|<span class="bt_ssl_suggest"><span>排查方法?</span><div class="suggest_content"><ul><li>自行排查<p>以图文的形式，一步步教您验证并部署商业SSL</p><div><a class="btlink" href="https://www.bt.cn/bbs/thread-85379-1-1.html" target="_blank">如何验证商用证书?</a></div></li><li style="position: relative;padding-left: 15px;">购买人工<p>不会部署?人工客服帮你全程部署，不成功可退款</p><div><button class="btn btn-success btn-xs btn-title service_buy" type="button" data-oid="' +
															item.oid +
															'">购买人工</button></div></li></ul></div></span>';
													if (item.certId == '') {
														return '<span style="color:orange;cursor: pointer;" class="options_ssl" data-type="perfect_user_info">待完善资料</span>' + suggest;
													} else if (item.status === 1) {
														switch (item.orderStatus) {
															case 'COMPLETE':
																return '<span style="color:#20a53a;">订单完成</span>';
																break;
															case 'PENDING':
																return '<span style="color: orange;">验证中</span>' + suggest;
																break;
															case 'CANCELLED':
																return '<span style="color: #888;">已取消</span>';
																break;
															case 'FAILED':
																return '<span style="color:red;">申请失败</span>';
																break;
															default:
																if (item.orderStatus == 'EXPIRED') return '<span class="c6">已过期</span>';
																return '<span style="color: orange;">待验证</span>';
																break;
														}
													} else {
														switch (item.status) {
															case 0:
																return '<span style="color: orange;">未支付</span>';
																break;
															case -1:
																return '<span style="color: #888;">已取消</span>';
																break;
														}
													}
												})() +
												'</td><td style="text-align:right;">' +
												(function () {
													var html = '';
													if (item.renew) html += '<a href="javascript:;" class="btlink options_ssl" data-type="renewal_ssl">续签证书</a>&nbsp;&nbsp;|&nbsp;&nbsp;';
													if (item.certId == '') {
														if (item.install) html += '<a class="btlink options_ssl service_method" target="_blank">人工服务</a>&nbsp;|&nbsp;';
														html += '<a href="javascript:;" class="btlink options_ssl"  data-type="perfect_user_info">完善资料</a>';
														return html;
													} else if (item.status === 1) {
														var html = '';
														switch (item.orderStatus) {
															case 'COMPLETE': //申请成功
																return (
																	'<a href="javascript:;" data-type="deploy_ssl" class="btlink options_ssl">部署</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="/ssl?action=download_cert&oid=' +
																	item.oid +
																	'" data-type="download_ssl" class="btlink options_ssl">下载</a>'
																);
																break;
															case 'PENDING': //申请中
																if (item.install) html += '<a class="btlink options_ssl service_method" target="_blank">人工服务</a>&nbsp;|&nbsp;';
																html += '<a href="javascript:;" data-type="verify_order" class="btlink options_ssl">验证</a>';
																return html;
																break;
															case 'CANCELLED': //已取消
																return '无操作';
																break;
															case 'FAILED':
																return '<a href="javascript:;" data-type="info_order" class="btlink options_ssl">详情</a>';
																break;
															default:
																if (item.install) html += '<a class="btlink options_ssl service_method" target="_blank">人工服务</a>&nbsp;|&nbsp;';
																html += '<span href="javascript:;" class="c6">已过期</span>';
																//   html += '<a href="javascript:;" data-type="verify_order" class="btlink options_ssl">验证</a>';
																return html;
																break;
														}
													}
												})() +
												'</td>' +
												'</tr>';
										}
									});
									$('#ssl_order_list tbody').html(deploy_html + html);
									//解决方案事件
									$('#ssl_order_list').on('click', '.bt_ssl_suggest', function (e) {
										var $this = $(this);
										var $layer = $this.parents('.layui-layer');
										var $cont = $this.find('.suggest_content');
										var rect = $this.offset();
										var layerRect = $layer.offset();
										var top = rect.top - layerRect.top + $this.height() + 7;
										var left = rect.left - layerRect.left - 268;
										$cont.css({
											top: top + 'px',
											left: left + 'px',
											right: 'auto',
											bottom: 'auto',
										});
										$('.suggest_content').hide();
										$cont.show();
										$(document).one('click', function () {
											$cont.hide();
										});
										e.stopPropagation();
									});
									// 表格滚动隐藏解决方案内容
									$('.ssl_order_list').scroll(function (e) {
										$('.suggest_content').hide();
									});
									//人工客服购买
									$('#ssl_order_list').on('click', '.service_buy', function () {
										var loads = bt.load('正在生成支付订单,请稍侯...');
										bt.send(
											'apply_cert_install_pay',
											'ssl/apply_cert_install_pay',
											{
												pdata: JSON.stringify({ oid: $(this).data('oid') }),
											},
											function (res) {
												loads.close();
												if (res.status != undefined && !res.status) {
													return layer.msg(res.msg, { time: 0, shadeClose: true, icon: 2, shade: 0.3 });
												}
												open_service_buy(res);
											}
										);
									});

									//人工客服咨询
									$('.service_method').click(function () {
										onChangeServiceMethod();
									});
								});
								robj.append(
									'<div class="alert alert-success" style="padding: 10px 15px;"><div class="business_line" ><div class="business_info business_advantage" style="padding-top:0"><div class="business_advantage_item"><span class="advantage_icon glyphicon glyphicon glyphicon-ok"></span><span class="advantage_title">企业级证书</span></div><div class="business_advantage_item"><span class="advantage_icon glyphicon glyphicon glyphicon-ok"></span><span class="advantage_title">极速申请</span></div><div class="business_advantage_item"><span class="advantage_icon glyphicon glyphicon glyphicon-ok"></span><span class="advantage_title">防劫持/防篡改</span></div><div class="business_advantage_item"><span class="advantage_icon glyphicon glyphicon glyphicon-ok"></span><span class="advantage_title">提高SEO权重</span></div><div class="business_advantage_item"><span class="advantage_icon glyphicon glyphicon glyphicon-ok"></span><span class="advantage_title">赔付保证</span></div><div class="business_advantage_item"><span class="advantage_icon glyphicon glyphicon glyphicon-ok"></span><span class="advantage_title">不成功可退款</span></div><div class="business_advantage_item" style="width:50%"><span class="advantage_icon glyphicon glyphicon glyphicon-ok"></span><span class="advantage_title">官方推荐(宝塔官网bt.cn也在使用)</span></div></div></div></div>\
                                  <div class= "mtb10" >\
                                  <button class="btn btn-success btn-sm btn-title ssl_business_application" type="button">申请证书</button>\
                                  <span class="ml5"><span class="wechatEnterpriseService" style="vertical-align: middle;"></span><span class="btlink service_buy_before">售前客服</span></span>\
                                  <div class="divtable mtb10 ssl_order_list"  style="height: 290px;overflow-y: auto;">\
                                      <table class="table table-hover" id="ssl_order_list">\
                                          <thead><tr><th width="110px">域名</th><th  width="180px">证书类型</th><th>到期时间</th><th>状态</th><th style="text-align:right;">操作</th></tr></thead>\
                                          <tbody><tr><td colspan="5" style="text-align:center"><img src="/static/images/loading-2.gif" style="width:15px;vertical-align: middle;"><span class="ml5" style="vertical-align: middle;">正在获取证书列表，请稍候...</span></td></tr></tbody>\
                                      </table>\
                                  </div>\
                              </div><ul class="help-info-text c7">\
                                  <li style="color:red;">如果您的站点有使用CDN、高防IP、反向代理、301重定向等功能，可能导致验证失败</li>\
                                  <li>证书支持购买多年，只能一年签发一次（有效期一年），需在到期前30天内续签(续签暂不需要验证域名)</li>\
                                  <li>申请www.bt.cn这种以www为二级域名的证书，需绑定并解析顶级域名(bt.cn)，否则将验证失败</li>\
                                  <li>商用证书相对于普通证书，具有更高的安全性、赔付保障和支持通配符和多域名等方式。</li>\
                              </ul>'
								);
								$('.service_buy_before').click(function () {
									bt.onlineService();
								});
								bt.fixed_table('ssl_order_list');
								/**
								 * @description 证书购买人工服务
								 * @param {Object} param 支付回调参数
								 * @returns void
								 */
								function open_service_buy(param) {
									var order_info = {},
										is_check = true;
									pay_ssl_layer = bt.open({
										type: 1,
										title: '购买人工服务',
										area: ['790px', '770px'],
										skin: 'service_buy_view',
										content:
											'<div class="bt_business_ssl">\
                      <div class="bt_business_tab ssl_applay_info active">\
                          <div class="guide_nav"><span class="active">微信支付</span><span >支付宝支付</span></div>\
                          <div class="paymethod">\
                              <div class="pay-wx" id="PayQcode"></div>\
                          </div>\
                          <div class="lib-price-box text-center">\
                              <span class="lib-price-name f14"><b>总计</b></span>\
                              <span class="price-txt"><b class="sale-price"></b>元</span>\
                          </div>\
                          <div class="lib-price-detailed">\
                              <div class="info">\
                                  <span class="text-left">商品名称</span>\
                                  <span class="text-right"></span>\
                              </div>\
                              <div class="info">\
                                  <span class="text-left">下单时间</span>\
                                  <span class="text-right"></span>\
                              </div>\
                          </div>\
                          <div class="lib-prompt"><span>微信扫一扫支付</span></div>\
                      </div>\
                      <div class="bt_business_tab order_service_check">\
                          <div class="prder_pay_service_left">\
                              <div class="order_pay_title">支付成功</div>\
                              <div class="lib-price-detailed">\
                                  <div class="info">\
                                      <span class="text-left">商品名称：</span>\
                                      <span class="text-right"></span>\
                                  </div>\
                                  <div class="info-line"></div>\
                                  <div class="info">\
                                      <span class="text-left">商品价格：</span>\
                                      <span class="text-right"></span>\
                                  </div>\
                                  <div class="info" style="display:block">\
                                      <span class="text-left">下单时间：</span>\
                                      <span class="text-right"></span>\
                                  </div>\
                              </div>\
                          </div>\
                          <div class="prder_pay_service_right">\
                              <div class="order_service_qcode">\
                                  <div class="order_open_title">请打开微信扫一扫联系人工客服</div>\
                                  <div class="order_wx_qcode"><div id="contact_qcode"></div><i class="wechatEnterprise"></i></div>\
                              </div>\
                          </div>\
                      </div>\
                  </div>',
										success: function (layero, indexs) {
											var order_wxoid = null,
												qq_info = null;

											$('.guide_nav span').click(function () {
												$(this).addClass('active').siblings().removeClass('active');
												$('.lib-prompt span').html($(this).index() == 0 ? '微信扫一扫支付' : '支付宝扫一扫支付');
												$('#PayQcode').empty();
												$('#PayQcode').qrcode({
													render: 'canvas',
													width: 200,
													height: 200,
													text: $(this).index() != 0 ? order_info.alicode : order_info.wxcode,
												});
											});
											reader_applay_qcode(
												$.extend(
													{
														name: '证书安装服务',
														price: param.price,
														time: bt.format_data(new Date().getTime()),
													},
													param
												),
												function (info) {
													check_applay_status(function (rdata) {
														$('.order_service_check').addClass('active').siblings().removeClass('active');
														$('.order_service_check .lib-price-detailed .text-right:eq(0)').html(info.name);
														$('.order_service_check .lib-price-detailed .text-right:eq(1)').html('￥' + info.price);
														$('.order_service_check .lib-price-detailed .text-right:eq(2)').html(info.time);
														$('#ssl_tabs .on').click();
														//人工客服二维码
														$('#contact_qcode').qrcode({
															render: 'canvas',
															width: 120,
															height: 120,
															text: 'https://work.weixin.qq.com/kfid/kfc9151a04b864d993f',
														});
														//缩小展示窗口
														$('.service_buy_view')
															.width(690)
															.height(350)
															.css({
																//设置最外层弹窗大小
																left: (document.body.clientWidth - 690) / 2 + 'px',
																top: (document.body.clientHeight - 350) / 2 + 'px',
															});
													}); //检测支付状态
												}
											); //渲染二维码

											function reader_applay_qcode(data, callback) {
												order_wxoid = data.wxoid;
												qq_info = data.qq;
												order_info = data;

												$('#PayQcode').empty().qrcode({
													render: 'canvas',
													width: 240,
													height: 240,
													text: data.wxcode,
												});
												$('.price-txt .sale-price').html(data.price);
												$('.lib-price-detailed .info:eq(0) span:eq(1)').html(data.name);
												$('.lib-price-detailed .info:eq(1) span:eq(1)').html(data.time);
												if (typeof data.qq != 'undefined') {
													$('.order_pay_btn a:eq(0)').attr({
														href: data.qq,
														target: '_blank',
													});
												} else {
													$('.order_pay_btn a:eq(0)').remove();
												}
												if (callback) callback(data);
											}

											function check_applay_status(callback) {
												bt.send(
													'get_wx_order_status',
													'auth/get_wx_order_status',
													{
														wxoid: order_wxoid,
													},
													function (res) {
														if (res.status) {
															is_check = false;
															if (callback) callback(res);
														} else {
															if (!is_check) return false;
															setTimeout(function () {
																check_applay_status(callback);
															}, 2000);
														}
													}
												);
											}
										},
										cancel: function (index) {
											if (is_check) {
												if (confirm('当前正在支付订单，是否取消？')) {
													layer.close(index);
													is_check = false;
												}
												return false;
											}
										},
									});
								}
								/**
								 * @description 对指定表单元素的内容进行效验
								 * @param {Object} el jqdom对象
								 * @param {String} name 表单元素name名称
								 * @param {*} value 表单元素的值
								 * @returns 返回当前元素的值
								 */
								function check_ssl_user_info(el, name, value, config) {
									el.css('borderColor', '#ccc');
									var status;
									switch (name) {
										case 'domains':
											value = bt.strim(value).replace(/\n*$/, '');
											var list = value.split('\n');
											if (value == '') {
												set_info_tips(el, { msg: '域名不能为空！', color: 'red' });
												status = false;
											}
											if (!Array.isArray(list)) list = [list];
											$.each(list, function (index, item) {
												if (bt.check_domain(item)) {
													var type = item.indexOf(),
														index = null;
													if (config.code.indexOf('multi') > -1) index = 0;
													if (config.code.indexOf('wildcard') > -1) index = 1;
													if (config.code.indexOf('wildcard') > -1 && config.code.indexOf('multi') > -1) index = 2;
													switch (index) {
														case 0:
															if (list.length > config.limit) {
																set_info_tips(el, { msg: '多域名证书当前支持' + config.limit + '个域名，如需添加，请联系客服咨询！', color: 'red' });
																status = false;
															} else if (list.length == 1) {
																set_info_tips(el, { msg: '当前为多域名证书(当前支持' + config.limit + '个域名)，至少需要2个域名或多个域名！', color: 'red' });
																status = false;
															}
															break;
														case 1:
															if (item.indexOf('*') != 0) {
																set_info_tips(el, { msg: '通配符域名格式错误,正确写法‘*.bt.cn’', color: 'red' });
																status = false;
															}
															break;
														case 2:
															if (list.length > config.limit) {
																set_info_tips(el, { msg: '多域名通配符证书支持' + config.limit + '个域名，如需添加，请联系客服咨询！！', color: 'red' });
																status = false;
															} else if (list.length == 1) {
																set_info_tips(el, { msg: '当前为多域名通配符(当前支持' + config.limit + '个域名)，需要2个域名或多个域名！', color: 'red' });
																status = false;
															}
															if (item.indexOf('*') != 0) {
																set_info_tips(el, { msg: '通配符域名格式错误,正确写法‘*.bt.cn’', color: 'red' });
																status = false;
															}
															break;
													}
												} else {
													if (value != '') {
														set_info_tips(el, { msg: '【 ' + item + ' 】' + ',域名格式错误！', color: 'red' });
													} else {
														set_info_tips(el, { msg: '域名不能为空！', color: 'red' });
													}
													status = false;
												}
											});
											value = list;
											break;
										case 'state':
											if (value == '') {
												set_info_tips(el, { msg: '所在省份不能为空！', color: 'red' });
												status = false;
											}
											break;
										case 'city':
											if (value == '') {
												set_info_tips(el, { msg: '所在市/县不能为空！', color: 'red' });
												status = false;
											}
											break;
										case 'city':
											if (value == '') {
												set_info_tips(el, { msg: '所在市/县不能为空！', color: 'red' });
												status = false;
											}
											break;
										case 'organation':
											if (value == '') {
												set_info_tips(el, { msg: '公司名称不能为空，如为个人申请请输入个人姓名！', color: 'red' });
												status = false;
											}
											break;
										case 'address':
											if (value == '') {
												set_info_tips(el, { msg: '请输入公司详细地址，不可为空，具体要求见说明，', color: 'red' });
												status = false;
											}
											break;
										case 'name':
											if (value == '') {
												set_info_tips(el, { msg: '用户姓名不能为空！', color: 'red' });
												status = false;
											}
											break;
										case 'email':
											if (value == '') {
												set_info_tips(el, { msg: '用户邮箱地址不能为空！', color: 'red' });
												status = false;
											}
											if (!bt.check_email(value)) {
												set_info_tips(el, { msg: '用户邮箱地址格式错误！', color: 'red' });
												status = false;
											}
											break;
										case 'mobile':
											if (value != '') {
												if (!bt.check_phone(value)) {
													set_info_tips(el, { msg: '用户手机号码格式错误！', color: 'red' });
													status = false;
												}
											}
											break;
										default:
											status = value;
											break;
									}
									if (typeof status == 'boolean' && status === false) return false;
									status = value;
									return status;
								}

								/**
								 * @description 设置元素的提示和边框颜色
								 * @param {Object} el jqdom对象
								 * @param {Object} config  = {
								 *  @param {String} config.msg 提示内容
								 *  @param {String} config.color 提示颜色
								 * }
								 */
								function set_info_tips(el, config) {
									$('html').append($('<span id="width_test">' + config.msg + '</span>'));
									layer.tips(config.msg, el, { tips: [1, config.color], time: 3000 });
									el.css('borderColor', config.color);
									$('#width_test').remove();
								}
								/**
								 * @description 更换域名验证方式
								 * @param {Number} oid 域名订单ID
								 * @returns void
								 */
								function again_verify_veiw(oid, is_success) {
									var loads = bt.load('正在获取验证方式,请稍候...');
									bt.send('get_verify_result', 'ssl/get_verify_result', { oid: oid }, function (res) {
										loads.close();
										var type = res.data.dcvList[0].dcvMethod;
										loadT = bt.open({
											type: 1,
											title: '验证域名-' + (type ? '文件验证' : 'DNS验证'),
											area: '520px',
											btn: ['更改', '取消'],
											content:
												'<div class="bt-form pd15"><div class="line"><span class="tname">验证方式</span><div class="info-r"><select class="bt-input-text mr5" name="file_rule" style="width:250px"></select></div></div>\
                                                    <ul class="help-info-text c7"><li>文件验证（HTTP）：确保网站能够通过http正常访问</li><li>文件验证（HTTPS）：确保网站已开启https，并且网站能够通过https正常访问</li><li>DNS验证：需要手动解析DNS记录值</li><li style="color:red">注意：20分钟内仅允许更换一次，频繁更换会延长申请时间</li></ul>\
                                                </div>',
											success: function (layero, index) {
												var _option_list = { '文件验证(HTTP)': 'HTTP_CSR_HASH', '文件验证(HTTPS)': 'HTTPS_CSR_HASH', 'DNS验证(CNAME解析)': 'CNAME_CSR_HASH' },
													_option = '';
												$.each(_option_list, function (index, item) {
													_option += '<option value="' + item + '" ' + (type == item ? 'selected' : '') + '>' + index + '</option>';
												});
												$('select[name=file_rule]').html(_option);
											},
											yes: function (index, layero) {
												var new_type = $('select[name=file_rule]').val();
												if (type == new_type) return layer.msg('重复的验证方式', { icon: 2 });
												var loads = bt.load('正在修改验证方式,请稍候...');
												bt.send('again_verify', 'ssl/again_verify', { oid: oid, dcvMethod: new_type }, function (res) {
													loads.close();
													if (res.status) layer.close(index);
													layer.msg(res.msg, { icon: res.status ? 1 : 2 });
												});
											},
										});
									});
								}
								/**
								 * @description 验证域名
								 * @param {Number} oid 域名订单ID
								 * @param {Boolean} openTips 是否展示状态
								 * @returns void
								 */
								function verify_order_veiw(oid, is_success, openTips) {
									var loads = bt.load('正在获取验证结果,请稍候...');
									bt.send('get_verify_result', 'ssl/get_verify_result', { oid: oid }, function (res) {
										loads.close();
										if (!res.status) {
											bt.msg(res);
											return false;
										}
										if (res.status == 'COMPLETE') {
											site.ssl.reload();
											return false;
										}
										var rdata = res.data;
										var domains = [],
											type = rdata.dcvList[0].dcvMethod != 'CNAME_CSR_HASH',
											info = {};
										$.each(rdata.dcvList, function (key, item) {
											domains.push(item['domainName']);
										});
										if (type) {
											info = { fileName: rdata.DCVfileName, fileContent: rdata.DCVfileContent, filePath: '/.well-known/pki-validation/', paths: res.paths, kfqq: res.kfqq };
										} else {
											info = { dnsHost: rdata.DCVdnsHost, dnsType: rdata.DCVdnsType, dnsValue: rdata.DCVdnsValue, paths: res.paths, kfqq: res.kfqq };
										}
										if (is_success) {
											is_success({ type: type, domains: domains, info: info });
											return false;
										}
										loadT = bt.open({
											type: 1,
											title: '验证域名-' + (type ? '文件验证' : 'DNS验证'),
											area: '620px',
											content: reader_domains_cname_check({ type: type, domains: domains, info: info }),
											success: function (layero, index) {
												//展示验证状态
												setTimeout(function () {
													if (openTips && res.status == 'PENDING') layer.msg('验证中，请耐心等待', { time: 0, shadeClose: true, icon: 0, shade: 0.3 });
												}, 500);
												var clipboard = new ClipboardJS('.parsing_info .parsing_icon');
												clipboard.on('success', function (e) {
													bt.msg({ status: true, msg: '复制成功' });
													e.clearSelection();
												});
												clipboard.on('error', function (e) {
													bt.msg({ status: true, msg: '复制失败，请手动ctrl+c复制！' });
													console.error('Action:', e.action);
													console.error('Trigger:', e.trigger);
												});
												$('.verify_ssl_domain').click(function () {
													verify_order_veiw(oid, false, true);
													layer.close(index);
												});

												$('.set_verify_type').click(function () {
													again_verify_veiw(oid);
													layer.close(index);
												});

												$('.return_ssl_list').click(function () {
													layer.close(index);
													$('#ssl_tabs span.on').click();
												});

												// 重新验证按钮
												$('.domains_table').on('click', '.check_url_results', function () {
													var _url = $(this).data('url'),
														_con = $(this).data('content');
													check_url_txt(_url, _con, this);
												});
											},
										});
									});
								}

								/**
								 * @description 重新验证
								 * @param {String} url 验证地址
								 * @param {String} content 验证内容
								 * @returns 返回验证状态
								 */
								function check_url_txt(url, content, _this) {
									var loads = bt.load('正在获取验证结果,请稍候...');
									bt.send('check_url_txt', 'ssl/check_url_txt', { url: url, content: content }, function (res) {
										loads.close();
										var html =
											'<span style="color:red">失败[' + res + ']</span><a href="https://www.bt.cn/bbs/thread-56802-1-1.html" target="_blank" class="bt-ico-ask" style="cursor: pointer;">?</a>';
										if (res === 1) {
											html = '<a class="btlink">通过</a>';
										}
										$(_this).parents('tr').find('td:nth-child(2)').html(html);
									});
								}
								/**
								 * @description 渲染验证模板接口
								 * @param {Object} data 验证数据
								 * @returns void
								 */
								function reader_domains_cname_check(data) {
									var html = '';
									if (data.type) {
										var check_html =
											'<div class="bt-table domains_table" style="margin-bottom:20px"><div class="divtable"><table class="table table-hover"><thead><tr><th width="250">URL</th><th width="85">验证结果</th><th style="text-align:right;">操作</th></thead>';
										var paths = data.info.paths;
										for (var i = 0; i < paths.length; i++) {
											check_html +=
												'<tr><td><span title="' +
												paths[i].url +
												'" class="lib-ssl-overflow-span-style">' +
												paths[i].url +
												'</span></td><td>' +
												(paths[i].status == 1
													? '<a class="btlink">通过</a>'
													: '<span style="color:red">失败[' +
													  paths[i].status +
													  ']</span><a href="https://www.bt.cn/bbs/thread-56802-1-1.html" target="_blank" class="bt-ico-ask" style="cursor: pointer;">?</a>') +
												'</td><td style="text-align:right;"><a href="javascript:bt.pub.copy_pass(\'' +
												paths[i].url +
												'\');" class="btlink">复制</a> | <a href="' +
												paths[i].url +
												'" target="_blank" class="btlink">打开</a> | <a data-url="' +
												paths[i].url +
												'" data-content="' +
												data.info.fileContent +
												'" class="btlink check_url_results">重新验证</a></td>';
										}
										check_html += '</table></div></div>';
										html =
											'<div class="lib-ssl-parsing">\
                    <div class="parsing_tips">请给以下域名【 <span class="highlight">' +
											data.domains.join('、') +
											'</span> 】添加验证文件，验证信息如下：</div>\
                    <div class="parsing_parem"><div class="parsing_title">文件所在位置：</div><div class="parsing_info"><input type="text" name="filePath"  class="parsing_input border" value="' +
											data.info.filePath +
											'" readonly="readonly" style="width:350px;"/></div></div>\
                    <div class="parsing_parem"><div class="parsing_title">文件名：</div><div class="parsing_info"><input type="text" name="fileName" class="parsing_input" value="' +
											data.info.fileName +
											'" readonly="readonly" style="width:350px;"/><span class="parsing_icon" data-clipboard-text="' +
											data.info.fileName +
											'">复制</span></div></div>\
                    <div class="parsing_parem"><div class="parsing_title" style="vertical-align: top;">文件内容：</div><div class="parsing_info"><textarea name="fileValue"  class="parsing_textarea" readonly="readonly" style="width:350px;">' +
											data.info.fileContent +
											'</textarea><span class="parsing_icon" style="display: block;width: 60px;border-radius: 3px;" data-clipboard-text="' +
											data.info.fileContent +
											'">复制</span></div></div>' +
											check_html +
											'<div class="parsing_tips" style="font-size:13px;line-height: 24px;">· 本次验证结果是由【本服务器验证】，实际验证将由【CA服务器】进行验证，请耐心等候</br>· 请确保以上列表所有项都验证成功后点击【验证域名】重新提交验证</br>· 如长时间验证不通过，请通过【修改验证方式】更改为【DNS验证】</br>· SSL添加文件验证方式 ->> <a href="https://www.bt.cn/bbs/thread-56802-1-1.html" target="_blank" class="btlink" >查看教程</a></div>\
                            <div class="parsing_parem" style="padding: 0 55px;"><button type="submit" class="btn btn-success verify_ssl_domain">验证域名</button><button type="submit" class="btn btn-default set_verify_type">修改验证方式</button><button type="submit" class="btn btn-default return_ssl_list">返回列表</button></div>\
                        </div>';
									} else {
										html =
											'<div class="lib-ssl-parsing">\
                        <div class="parsing_tips">请给以下域名【 <span class="highlight">' +
											data.domains.join('、') +
											'</span> 】添加“' +
											data.info.dnsType +
											'”解析，解析参数如下：</div>\
                        <div class="parsing_parem"><div class="parsing_title">主机记录：</div><div class="parsing_info"><input type="text" name="host" class="parsing_input" value="' +
											data.info.dnsHost +
											'" readonly="readonly" /><span class="parsing_icon" data-clipboard-text="' +
											data.info.dnsHost +
											'">复制</span></div></div>\
                        <div class="parsing_parem"><div class="parsing_title">记录类型：</div><div class="parsing_info"><input type="text" name="host" class="parsing_input" value="' +
											data.info.dnsType +
											'" readonly="readonly" style="border-right: 1px solid #ccc;border-radius: 3px;width: 390px;" /></div></div>\
                        <div class="parsing_parem"><div class="parsing_title">记录值：</div><div class="parsing_info"><input type="text" name="domains"  class="parsing_input" value="' +
											data.info.dnsValue +
											'" readonly="readonly" /><span class="parsing_icon" data-clipboard-text="' +
											data.info.dnsValue +
											'">复制</span></div></div>\
                        <div class="parsing_tips" style="font-size:13px;line-height: 24px;">· 本次验证结果是由【本服务器验证】，实际验证将由【CA服务器】进行验证，请耐心等候</br>· 请确保以上列表所有项都验证成功后点击【验证域名】重新提交验证</br>· 如长时间验证不通过，请通过【修改验证方式】更改为【DNS验证】</br>· 如何添加域名解析，《<a href="https://cloud.tencent.com/document/product/302/3446" class="btlink" target="__blink">点击查看教程</a>》，和咨询服务器运营商。</div>\
                        <div class="parsing_parem" style="padding: 0 55px;"><button type="submit" class="btn btn-success verify_ssl_domain">验证域名</button><button type="submit" class="btn btn-default set_verify_type">修改验证方式</button><button type="submit" class="btn btn-default return_ssl_list">返回列表</button></div>\
                    </div>';
									}
									return html;
								}
								// 购买证书信息
								function pay_ssl_business() {
									var order_info = {},
										user_info = {},
										is_check = false;
									var loadT = bt.load('正在获取申请证书信息，请稍候...');
									bt.send('get_product_list_v2', 'ssl/get_product_list_v2', {}, function (res) {
										loadT.close();
										var dataLength = res['data'] && res.data.length,
											data_list = res.data,
											list = [],
											prompt_msg = res.info;
										bt.open({
											type: 1,
											title: '购买商业证书',
											area: ['790px', '829px'],
											skin: 'layer-business-ssl',
											content:
												'\
                      <span style="width:700px;text-align: center;display: inline-block;height: 35px;line-height: 35px;background: #F2DEDF;color: #A5374A;font-size: 12px;border-radius: 2px;position: relative;top: 25px;left: 50px;">\
                        <span class="glyphicon glyphicon-alert" style="color: #A5374A; margin-right: 10px;"></span>\
                        禁止含有诈骗、赌博、色情、木马、病毒等违法违规业务信息的站点申请SSL证书，如有违反，撤销申请，停用账号</span>\
                      <div>\
                        <div class="business_ssl_form bt_business_tab active">\
                          <div class="bt-form" style="height: 657px;padding: 30px 20px 20px;">\
                            <div class="line">\
                              <span class="tname">域名数量</span>\
                              <div class="info-r">\
                                <div class="domain_number_group">\
                                  <div class="domain_number_reduce is_disable" data-type="reduce"></div>\
                                  <input type="number" class="domain_number_input" value="" />\
                                  <div class="domain_number_add"  data-type="add"></div>\
                                </div>\
                                <div class="inlineBlock">\
                                  <div class="ssl-service">\
                                    <img src="static/img/icon-ssl-service.png">\
                                    <span class="ml5">教我选择？</span>\
                                  </div>\
                                </div>\
                                <div class="unit mt5 domain_number_tips"></div>\
                                <div class="tips_gray mt5"><p>请选择当前证书包含的域名数量</p></div>\
                              </div>\
                            </div>\
                            <div class="line">\
                              <span class="tname">证书分类</span>\
                              <div class="info-r">\
                                <div class="inlineBlock">\
                                  <div class="ssl_item ssl_type_item mr10" data-type="OV">\
                                    <div class="ssl_item_title">OV证书</div>\
                                    <div class="ssl_item_ps">推荐企业使用</div>\
                                  </div>\
                                  <div class="ssl_item ssl_type_item mr10" data-type="DV">\
                                    <em>热销</em>\
                                    <div class="ssl_item_title">DV证书</div>\
                                    <div class="ssl_item_ps">推荐个人，测试使用</div>\
                                  </div>\
                                  <div class="ssl_item ssl_type_item mr10" data-type="EV">\
                                    <div class="ssl_item_title">EV证书</div>\
                                    <div class="ssl_item_ps">推荐大型政企使用，高安全性</div>\
                                  </div>\
                                </div>\
                                <div class="tips_gray ssl_type_tips"></div>\
                              </div>\
                            </div>\
                            <div class="line">\
                              <span class="tname">证书品牌</span>\
                              <div class="info-r">\
                                <div class="inlineBlock business_brand_list">\
                                  <div class="ssl_item ssl_brand_item mr10" data-type="Positive" title="Positive">Positive</div>\
                                  <div class="ssl_item ssl_brand_item mr10" data-type="锐安信" title="锐安信">锐安信</div>\
                                  <div class="ssl_item ssl_brand_item mr10" data-type="CFCA" title="CFCA">CFCA</div>\
                                  <div class="ssl_item ssl_brand_item mr10" data-type="Digicert" title="Digicert">Digicert</div>\
                                  <div class="ssl_item ssl_brand_item mr10" data-type="GeoTrust" title="GeoTrust">GeoTrust</div>\
                                  <div class="ssl_item ssl_brand_item mr10" data-type="Sectigo" title="Sectigo">Sectigo</div>\
                                </div>\
                                <div class="tips_gray ssl_brand_tips"></div>\
                              </div>\
                            </div>\
                            <div class="line">\
                              <span class="tname">证书类型</span>\
                              <div class="info-r">\
                                <div class="inlineBlock business_price_list">\
                                  <div class="ssl_item ssl_price_item mr10">单域名</div>\
                                  <div class="ssl_item ssl_price_item mr10">泛域名</div>\
                                </div>\
                                <div class="tips_gray ssl_price_tips"></div>\
                              </div>\
                            </div>\
                            <div class="line">\
                              <span class="tname">购买年限</span>\
                              <div class="info-r">\
                                <div class="inlineBlock business_year_list">\
                                  <div class="ssl_item ssl_year_item mr10" data-year="1">1年</div>\
                                  <div class="ssl_item ssl_year_item mr10" data-year="2">2年</div>\
                                  <div class="ssl_item ssl_year_item mr10" data-year="3">3年</div>\
                                  <div class="ssl_item ssl_year_item mr10" data-year="4">4年</div>\
                                  <div class="ssl_item ssl_year_item mr10" data-year="5">5年</div>\
                                </div>\
                                <div class="tips_gray mt5 ssl_year_tips"></div>\
                              </div>\
                            </div>\
                            <div class="line">\
                              <span class="tname">部署服务</span>\
                              <div class="info-r">\
                                <div class="inlineBlock">\
                                  <div class="ssl_item ssl_service_item mr10" data-install="0" style="width: 90px;">不需要</div>\
                                  <div class="ssl_item ssl_service_item mr10" data-install="1" style="width: 90px;">部署服务</div>\
                                  <div class="ssl_item ssl_service_item mr10" data-install="2" style="width: 130px;">部署服务（国密）</div>\
                                  <span class="unit ssl_service_unit"></span>\
                                </div>\
                                <div class="tips_gray mt5 ssl_service_tips"></div>\
                              </div>\
                            </div>\
                          </div>\
                          <div class="business_ssl_btn">\
                            <div class="mr5">\
                              <div class="bname">商品包含：<span class="ml10"></span></div>\
                              <div>总计费用：<div class="present_price ml10">\
                                  <span>278.66</span>元/1年（包含部署服务）\
                                </div>\
                                <div class="original_price">原价342元/1年</div>\
                              </div>\
                            </div>\
                            <div class="inlineBlock ml10">\
                              <button type="button" class="business_ssl_pay">立即购买</button>\
                            </div>\
                          </div>\
                        </div>\
                        <div class="bt_business_tab ssl_applay_info">\
                          <div class="guide_nav">\
                            <span class="active">微信支付</span>\
                            <span>支付宝支付</span>\
                          </div>\
                          <div class="paymethod">\
                            <div class="pay-wx" id="PayQcode"></div>\
                          </div>\
                          <div class="lib-price-box text-center">\
                            <span class="lib-price-name f14"><b>总计</b></span>\
                            <span class="price-txt"><b class="sale-price"></b>元</span>\
                          </div>\
                          <div class="lib-price-detailed">\
                            <div class="info">\
                              <span class="text-left">商品名称</span>\
                              <span class="text-right"></span>\
                            </div>\
                            <div class="info">\
                              <span class="text-left">下单时间</span>\
                              <span class="text-right"></span>\
                            </div>\
                          </div>\
                          <div class="lib-prompt">\
                            <span>微信扫一扫支付</span>\
                          </div>\
                        </div>\
                        <div class="bt_business_tab ssl_order_check" style="padding: 25px 60px 0 60px;">\
                          <div class="order_pay_title">支付成功</div>\
                          <div class="lib-price-detailed">\
                            <div class="info">\
                              <span class="text-left">商品名称</span>\
                              <span class="text-right"></span>\
                            </div>\
                            <div class="info">\
                              <span class="text-left">商品价格</span>\
                              <span class="text-right"></span>\
                            </div>\
                            <div class="info">\
                              <span class="text-left">下单时间</span>\
                              <span class="text-right"></span>\
                            </div>\
                          </div>\
                          <div class="order_pay_btn">\
                            <a href="javascript:;">人工服务</a>\
                            <a href="javascript:;" data-type="info">完善证书资料</a>\
                            <a href="javascript:;" data-type="clear">返回列表</a>\
                          </div>\
                          <ul class="help-info-text c7" style="padding:15px 0 0 70px;font-size:13px;">\
                            <li>支付成功后请点击“完善证书资料”继续申请证书。</li>\
                            <li>如果已购买人工服务，请点击“人工服务”咨询帮助。</li>\
                          </ul>\
                        </div>\
                      </div>',
											success: function (layero, indexs) {
												var numBtn = $('.domain_number_reduce,.domain_number_add'),
													ssl_type_item = $('.ssl_type_item'),
													ssl_brand_item = $('.ssl_brand_item'),
													ssl_service_item = $('.ssl_service_item'),
													ssl_price_item = $('.ssl_price_item'),
													ssl_year_item = $('.ssl_year_item'),
													business_brand_list = $('.business_brand_list'),
													input = $('.domain_number_input'),
													ssl_type_tips = $('.ssl_type_tips'),
													ssl_brand_tips = $('.ssl_brand_tips'),
													ssl_year_tips = $('.ssl_year_tips'),
													ssl_price_tips = $('.ssl_price_tips'),
													ssl_service_unit = $('.ssl_service_unit'),
													ssl_service_tips = $('.ssl_service_tips');
												var dataInfo = [],
													ylist = [],
													is_single = false, //是否存在单域名
													is_worldxml = false, //是否存在泛域名
													year = 1,
													serviceprice = 0,
													install = 0,
													add_domain_number = 0,
													order_id = null,
													qq_info = null;

												$('.ssl-service').click(function () {
													bt.onlineService();
												});

												// 数量加减
												numBtn.click(function () {
													var type = $(this).data('type'),
														reduce = input.prev(),
														add = input.next(),
														min = 1,
														max = 99,
														input_val = parseInt(input.val());
													if ($(this).hasClass('is_disable')) {
														layer.msg(type === 'reduce' ? '当前域名数量不能为0' : '当前域名数量不能大于99');
														return false;
													}
													switch (type) {
														case 'reduce':
															input_val--;
															if (min > input_val < max) {
																input.val(min);
															}
															break;
														case 'add':
															input_val++;
															if (min > input_val < max) {
																input.val(input_val);
																add.removeClass('is_disable');
															}
															if (input_val == max) $(this).addClass('is_disable');
															break;
													}
													if (input_val == min) {
														reduce.addClass('is_disable');
													} else if (input.val() == max) {
														add.addClass('is_disable');
													} else {
														reduce.removeClass('is_disable');
														add.removeClass('is_disable');
													}

													reader_product_info({ current_num: parseInt(input_val) });
												});
												$('.domain_number_input').on('input', function () {
													var _input = $(this),
														input_val = parseInt(_input.val()),
														input_min = 1,
														input_max = 99,
														reduce = _input.prev(),
														add = _input.next();
													if (input_val <= input_min) {
														_input.val(input_min);
														reduce.addClass('is_disable');
													} else if (input_val >= input_max) {
														input.val(input_max);
														add.addClass('is_disable');
													} else {
														reduce.removeClass('is_disable');
														add.removeClass('is_disable');
													}
													if (_input.val() == '') {
														_input.val(input_min);
														input_val = input_min;
														reduce.addClass('is_disable');
													}
													reader_product_info({ current_num: parseInt(_input.val()) });
												});

												function automatic_msg() {
													layer.msg('当前证书品牌不支持多域名证书，已为您自动切换到支持的证书品牌！');
												}

												//总计费用信息
												function reader_product_info(config) {
													config.current_num = config.current_num !== '' ? config.current_num : 1;
													add_domain_number = config.current_num;
													input.val(config.current_num !== '' ? config.current_num : 1);
													var p_index = $('.ssl_price_item.active').index(); //证书类型下标
													var year_list = ylist.filter(function (s) {
														return p_index ? s.code.indexOf('wildcard') > -1 : s.code.indexOf('wildcard') === -1;
													});
													var is_flag = year_list.some(function (s) {
														return s.code.indexOf('multi') > -1 || s.brand === 'Digicert';
													});
													if (p_index) {
														ssl_type_item.eq(2).addClass('disabled');
													} else {
														ssl_type_item.eq(2).removeClass('disabled');
													}
													if (input.val() > 1) {
														// disabled
														//证书类型禁用
														var is_type_disabled = ylist
															.filter(function (s) {
																return !p_index ? s.code.indexOf('wildcard') > -1 : s.code.indexOf('wildcard') === -1;
															})
															.some(function (s) {
																return s.code.indexOf('multi') > -1 || s.brand === 'Digicert';
															});
														if (!is_type_disabled) {
															ssl_price_item.eq(p_index ? 0 : 1).addClass('disabled');
														} else {
															ssl_price_item.eq(p_index ? 0 : 1).removeClass('disabled');
														}
														//证书品牌禁用
														for (var i = 0; i < ssl_brand_item.length; i++) {
															if (ssl_brand_item.eq(i).css('display') !== 'none') {
																var brand_data = ssl_brand_item.eq(i).data();
																if (p_index) {
																	if (!brand_data.is_multi_w) ssl_brand_item.eq(i).addClass('disabled');
																	else ssl_brand_item.eq(i).removeClass('disabled');
																} else {
																	if (!brand_data.is_multi) ssl_brand_item.eq(i).addClass('disabled');
																	else ssl_brand_item.eq(i).removeClass('disabled');
																}
															}
														}
													} else {
														ssl_price_item.eq(p_index ? 0 : 1).removeClass('disabled');
														ssl_brand_item.removeClass('disabled');
													}
													if (!is_flag) {
														if (input.val() > 1) {
															for (var i = 0; i < ssl_brand_item.length; i++) {
																if (ssl_brand_item.eq(i).css('display') !== 'none') {
																	var brand_data = ssl_brand_item.eq(i).data();
																	if (p_index) {
																		if (brand_data.is_multi_w) {
																			automatic_msg();
																			return ssl_brand_item.eq(i).click();
																		}
																	} else {
																		if (brand_data.is_multi) {
																			automatic_msg();
																			return ssl_brand_item.eq(i).click();
																		}
																	}
																}
															}
														}
													}
													//选中的证书信息
													var data_info = year_list.filter(function (s) {
														return $('.domain_number_input').val() > 1 ? (s.brand === 'Digicert' ? s.code.indexOf('multi') === -1 : s.code.indexOf('multi') > -1) : s.code.indexOf('multi') === -1;
													})[0];
													dataInfo = data_info;
													dataInfo['current_num'] = config['current_num'];
													//服务费
													var service_price = [0, data_info.install_price, data_info.install_price_v2];
													for (var i = 0; i < service_price.length; i++) {
														ssl_service_item.eq(i).data('serviceprice', service_price[i]);
													}
													serviceprice = $('.ssl_service_item.active').data('serviceprice');
													if ($('.ssl_service_item.active').index()) ssl_service_unit.html('部署服务费用<span class="org">' + serviceprice + '元/次</span>');
													else ssl_service_unit.html('');
													var cur_num = (config.current_num < data_info.num ? data_info.num : config.current_num) - data_info.num;
													var p_price = parseFloat(serviceprice + (data_info.price + data_info.add_price * cur_num) * year).toFixed(2);
													if (config.current_num > 1 || data_info.brand === 'Digicert') {
														if (data_info.brand !== 'Digicert') ssl_price_item.eq(0).text('多域名');
														if (data_info.brand === 'Digicert') ssl_price_item.eq(0).text('单域名');
														$('.domain_number_tips').html('默认包含' + data_info.num + '个域名，超出数量每个域名<span>' + data_info.add_price + '元/个/年</span>');
													} else {
														ssl_price_item.eq(0).text('单域名');
														$('.domain_number_tips').empty();
													}
													var pp_html = '<span>' + p_price + '</span>元/' + year + '年' + ($('.ssl_service_item.active').index() ? '（包含部署服务）' : ''),
														op_html = '原价' + parseFloat(parseFloat(serviceprice + (data_info.other_price + data_info.add_price * cur_num) * year).toFixed(2)) + '元/' + year + '年';
													var price_pack = parseFloat(parseFloat(data_info.price * year).toFixed(2)),
														price_extra = data_info.add_price * cur_num * year;
													$('.business_ssl_btn .bname span').html(
														'默认包含' + data_info.num + '个域名 ' + price_pack + '元/' + year + '年' + (cur_num ? '，额外超出' + cur_num + '个域名' + price_extra + '元/' + year + '年' : '')
													);
													$('.business_ssl_btn .present_price').html(pp_html);
													$('.business_ssl_btn .original_price').html(op_html);
												}

												setTimeout(function () {
													ssl_type_item.eq(0).click();
												}, 50);
												//证书分类切换
												ssl_type_item.click(function () {
													if ($(this).hasClass('disabled')) return layer.msg('当前证书品牌不支持通配符证书，请选择其他品牌证书');
													if (!$(this).hasClass('active')) $(this).addClass('active').siblings().removeClass('active');
													//证书类型
													var type = $(this).data('type'),
														brand_list = []; //品牌类型
													list = dataLength
														? data_list.filter(function (s) {
																return s.type.indexOf(type) > -1;
														  })
														: [];
													var type_tips_list = prompt_msg['type'][type.toLowerCase()],
														type_tips = '';
													for (var i = 0; i < type_tips_list.length; i++) {
														type_tips += '<p class="mt5">' + type_tips_list[i] + '</p>';
													}
													ssl_type_tips.html(type_tips); //提示信息
													$.each(list, function (i, item) {
														brand_list.push(item.brand);
													});
													brand_list = Array.from(new Set(brand_list)); //去重
													var recommend = prompt_msg['recommend'][type.toLowerCase()];
													business_brand_list.find('em').remove();
													business_brand_list.find('[data-type="' + prompt_msg['recommend'][type.toLowerCase()] + '"]').prepend('<em>推荐</em>');
													ssl_brand_item.hide();
													for (var i = 0; i < brand_list.length; i++) {
														business_brand_list.find('[data-type="' + brand_list[i] + '"]').show();
														var b_list = list.filter(function (s) {
															return s.brand === brand_list[i];
														});
														//品牌是否存在多域名
														var is_multi = b_list.some(function (s) {
															return (s.code.indexOf('wildcard') === -1 && s.code.indexOf('multi') > -1) || s.brand === 'Digicert';
														});
														var is_multi_w = b_list.some(function (s) {
															return (s.code.indexOf('wildcard') > -1 && s.code.indexOf('multi') > -1) || s.brand === 'Digicert';
														});
														business_brand_list.find('[data-type="' + brand_list[i] + '"]').data({ is_multi: is_multi, is_multi_w: is_multi_w });
													}
													business_brand_list.find('[data-type="' + recommend + '"]').click();
												});

												//证书品牌
												ssl_brand_item.click(function () {
													var p_index = $('.ssl_price_item.active').index();
													if ($(this).hasClass('disabled')) {
														if (p_index !== -1) {
															for (var i = 0; i < ssl_brand_item.length; i++) {
																if (ssl_brand_item.eq(i).css('display') !== 'none') {
																	var brand_data = ssl_brand_item.eq(i).data();
																	if (p_index) {
																		if (brand_data.is_multi_w) return ssl_brand_item.eq(i).click();
																	} else {
																		if (brand_data.is_multi) return ssl_brand_item.eq(i).click();
																	}
																}
															}
														}
														return layer.msg('当前证书品牌不支持多域名通配符证书，请选择其他品牌证书');
													}
													if (!$(this).hasClass('active')) $(this).addClass('active').siblings().removeClass('active');
													var type = $(this).data('type'),
														years_list = [],
														max_years = 0,
														years_html = '',
														cert_html = '';
													ylist = list.filter(function (s) {
														return s.brand.indexOf(type) > -1;
													});
													brand_type = $('.ssl_type_item.active').data('type');
													var brand_tips_list = prompt_msg['brand'][type === 'Positive' || type === '锐安信' ? type : type.toLowerCase()],
														brand_tips = '';
													for (var i = 0; i < brand_tips_list.length; i++) {
														brand_tips += '<p class="mt5">' + brand_tips_list[i] + '</p>';
													}
													ssl_brand_tips.html(brand_tips); //提示信息
													$.each(ylist, function (i, item) {
														years_list.push(item.max_years);
													});
													//是否存在单域名/泛域名按钮
													is_single = ylist.some(function (s) {
														return s.code.indexOf('wildcard') === -1;
													});
													is_worldxml = ylist.some(function (s) {
														return s.code.indexOf('wildcard') > -1;
													});
													if (is_single) {
														ssl_price_item.eq(0).show();
													} else {
														ssl_price_item.eq(0).hide();
													}
													if (is_worldxml) {
														ssl_price_item.eq(1).show();
													} else {
														ssl_price_item.eq(1).hide();
													}
													max_years = Array.from(new Set(years_list))[0];
													for (var i = 0; i < 5; i++) {
														if (i < max_years) {
															ssl_year_item.eq(i).show();
														} else {
															ssl_year_item.eq(i).hide();
														}
													}
													//证书类型点击
													var p_index = $('.ssl_price_item.active').index();
													ssl_price_item.eq(p_index !== -1 ? (!is_worldxml && p_index === 1 ? 0 : p_index) : 0).click();
												});
												//证书类型
												$('.business_ssl_form').on('click', '.ssl_price_item', function () {
													if ($(this).hasClass('disabled')) return layer.msg('当前证书品牌不支持多域名通配符证书，请选择其他品牌证书');
													if (!$(this).hasClass('active')) $(this).addClass('active').siblings().removeClass('active');
													var price_tips_list_0 = [
															'仅支持绑定一个二级域名或者子域名，例如 bt.com、cloud.bt.com、dnspod.cloud.bt.com的其中之一 。',
															'如需要绑定同级的所有子域名，例如*.bt.com，请购买泛域名证书。',
														],
														price_tips_list_1 = [
															'带通配符的域名，例如：*.bt.com、*.cloud.bt.com均为泛域名，包含同一级的全部子域名。',
															'注意泛域名不支持跨级，例如*.bt.com 不包含 *.cloud.bt.com的支持',
														];
													var price_tips_list = $(this).index() ? price_tips_list_1 : price_tips_list_0,
														price_tips = '';
													for (var i = 0; i < price_tips_list.length; i++) {
														price_tips += '<p class="mt5">' + price_tips_list[i] + '</p>';
													}
													ssl_price_tips.html(price_tips);
													//购买年限点击
													var y_index = $('.ssl_year_item.active').index();

													ssl_year_item.eq(y_index !== -1 && $('.ssl_year_item.active').css('display') !== 'none' ? y_index : 0).click();
												});
												//购买年限
												$('.business_ssl_form').on('click', '.ssl_year_item', function () {
													if (!$(this).hasClass('active')) $(this).addClass('active').siblings().removeClass('active');
													year = $(this).data('year');
													var year_tips_list = prompt_msg['times'][year + '_year'],
														year_tips = '';
													for (var i = 0; i < year_tips_list.length; i++) {
														year_tips += '<p class="mt5">' + year_tips_list[i] + '</p>';
													}
													ssl_year_tips.html(year_tips); //提示信息

													var ser_index = $('.ssl_service_item.active').index();
													ssl_service_item.eq(ser_index !== -1 ? ser_index : 1).click();
												});

												//部署服务点击
												ssl_service_item.click(function () {
													if (!$(this).hasClass('active')) $(this).addClass('active').siblings().removeClass('active');
													var index = $(this).index();
													(serviceprice = $(this).data('serviceprice')), (install = $(this).data('install'));
													ssl_service_tips.html(
														index
															? index === 1
																? '宝塔提供9:00 - 24:00的人工部署证书部署服务，帮助客户排查部署证书部署生效问题，快速上线'
																: '宝塔提供9:00 - 24:00的人工部署国密算法证书部署服务，帮助客户排查部署证书部署生效问题，快速上线'
															: ''
													);
													var value = $('.domain_number_input').val();
													reader_product_info({ current_num: value === '' ? value : parseInt(value) });
												});

												//购买事件
												$('.business_ssl_pay').click(function () {
													var loadT = bt.load('正在生成支付订单，请稍候...'),
														num = 0;
													add_domain_number = input.val();
													if (dataInfo.add_price !== 0) num = parseInt(dataInfo.current_num - dataInfo.num);
													bt.send(
														'apply_cert_order_pay',
														'ssl/apply_cert_order_pay',
														{
															pdata: JSON.stringify({
																pid: dataInfo.pid,
																install: install,
																years: year,
																num: num,
															}),
														},
														function (res) {
															loadT.close();
															if (res.status) {
																is_check = true;
																$('.bt_progress_content .bt_progress_item:eq(1)').addClass('active');
																$('.ssl_applay_info').addClass('active').siblings().removeClass('active');
																reader_applay_qcode(
																	$.extend(
																		{
																			name: dataInfo.title + year + '年' + (install ? '(包含部署服务)' : ''),
																			price: parseFloat(serviceprice + (dataInfo.price + dataInfo.add_price * num) * year).toFixed(2),
																			time: bt.format_data(new Date().getTime()),
																		},
																		res.msg
																	),
																	function (info) {
																		check_applay_status(function (rdata) {
																			$('.bt_progress_content .bt_progress_item:eq(2)').addClass('active');
																			$('.ssl_order_check').addClass('active').siblings().removeClass('active');
																			$('.ssl_order_check .lib-price-detailed .text-right:eq(0)').html(info.name);
																			$('.ssl_order_check .lib-price-detailed .text-right:eq(1)').html('￥' + info.price);
																			$('.ssl_order_check .lib-price-detailed .text-right:eq(2)').html(info.time);
																			$('#ssl_tabs .on').click();
																		}); //检测支付状态
																	}
																); //渲染二维码
															}
														}
													);
												});
												//支付切换
												$('.guide_nav span').click(function () {
													var price = $('.business_ssl_btn .present_price span').text(),
														is_wx_quota = parseFloat(price) >= 6000;
													if ($(this).index() === 0 && is_wx_quota) {
														layer.msg('微信单笔交易限额6000元,请使用支付宝支付', {
															icon: 0,
														});
													} else {
														$(this).addClass('active').siblings().removeClass('active');
														$('.lib-prompt span').html($(this).index() == 0 ? '微信扫一扫支付' : '支付宝扫一扫支付');
														$('#PayQcode').empty();
														$('#PayQcode').qrcode({
															render: 'canvas',
															width: 200,
															height: 200,
															text: $(this).index() != 0 ? order_info.alicode : order_info.wxcode,
														});
													}
												});
												$('.order_pay_btn a').click(function () {
													switch ($(this).data('type')) {
														case 'info':
															confirm_certificate_info(
																$.extend(dataInfo, {
																	oid: order_id,
																	qq: qq_info,
																	install: install ? true : false,
																	limit: add_domain_number,
																})
															);
															break;
														case 'clear':
															layer.close(indexs);
															break;
													}
												});
												function reader_applay_qcode(data, callback) {
													var price = $('.business_ssl_btn .present_price span').text(),
														is_wx_quota = parseFloat(price) >= 6000;
													order_id = data.oid;
													qq_info = data.qq;
													order_info = data;
													if (is_wx_quota) {
														$('.guide_nav span:eq(1)').click();
													} else {
														$('#PayQcode').empty().qrcode({
															render: 'canvas',
															width: 240,
															height: 240,
															text: data.wxcode,
														});
													}
													$('.price-txt .sale-price').html($('.business_ssl_btn .present_price span').text());
													$('.lib-price-detailed .info:eq(0) span:eq(1)').html(data.name);
													$('.lib-price-detailed .info:eq(1) span:eq(1)').html(data.time);
													if (typeof data.qq != 'undefined') {
														$('.order_pay_btn a:eq(0)').click(function () {
															bt.onlineService();
														});
													} else {
														$('.order_pay_btn a:eq(0)').remove();
													}
													if (callback) callback(data);
												}

												function check_applay_status(callback) {
													bt.send(
														'get_pay_status',
														'ssl/get_pay_status',
														{
															oid: order_id,
														},
														function (res) {
															if (res) {
																is_check = false;
																if (callback) callback(res);
															} else {
																if (!is_check) return false;
																setTimeout(function () {
																	check_applay_status(callback);
																}, 2000);
															}
														}
													);
												}
											},
											cancel: function (index) {
												if (is_check) {
													if (confirm('当前正在支付订单，是否取消？')) {
														layer.close(index);
														is_check = false;
													}
													return false;
												}
											},
										});
									});
								}
								// 确认证书信息
								function confirm_certificate_info(config) {
									var userLoad = bt.load('正在获取用户信息，请稍候...');
									bt.send('get_cert_admin', 'ssl/get_cert_admin', {}, function (res) {
										userLoad.close();
										var html = '';
										var isWildcard = config.code.indexOf('wildcard') > -1;
										var isMulti = config.code.indexOf('multi') > -1;
										if (typeof pay_ssl_layer != 'undefined') pay_ssl_layer.close();
										if (config.code.indexOf('multi') > -1) {
											if (isWildcard) {
												placeholder = '多域名通配符证书，每行一个域名，支持' + config.limit + '个域名，必填项,例如：\r*.bt.cn\r*.bttest.cn';
											} else {
												placeholder = '多域名证书，每行一个域名，支持' + config.limit + '个域名，必填项,例如：\rwww.bt.cn\rwww.bttest.cn';
											}
											html = '<textarea class="bt-input-text mr20 key" name="domains" placeholder="' + placeholder + '" style="line-height:20px;width:400px;height:150px;padding:8px;"></textarea>';
										} else {
											if (isWildcard) {
												placeholder = '请输入需要申请证书的域名（单域名通配符证书），必填项，例如：*.bt.cn';
											} else {
												placeholder = '请输入需要申请证书的域名（单域名证书），必填项，例如：www.bt.cn';
											}
											html =
												'<input type="text" disabled="true" readonly="readonly" id="apply_site_name" class="bt-input-text mr5" name="domains" placeholder="' +
												placeholder +
												'"/><button class="btn btn-success btn-xs ' +
												(isWildcard ? 'hide' : '') +
												"\" onclick=\"site.select_site_list('apply_site_name','" +
												config.code +
												'\')" style="">选择已有域名</button><button class="btn btn-default btn-xs" onclick="site.select_site_txt(\'apply_site_name\',$(\'#apply_site_name\').val())" style="margin: 5px;">自定义域名</button>';
										}
										bt.open({
											type: 1,
											title: '完善商业证书资料',
											area: '640px',
											content:
												'<form class="bt_form perfect_ssl_info" onsubmit="return false;">\
                        <div class="line">\
                            <span class="tname">证书信息</span>\
                            <div class="info-r">\
                                <span class="ssl_title">' +
												config.title +
												(config.limit > 1 ? '<span style="margin-left:5px;">，包含' + config.limit + '个域名</span>' : '') +
												'</span>\
                            </div>\
                        </div>\
                        <div class="line">\
                            <span class="tname">域名</span>\
                            <div class="info-r domain_list_info" style="margin-bottom:-5px;">' +
												html +
												'</div>\
                        </div>\
                        <div class="line check_model_line">\
                            <span class="tname">验证方式</span>\
                            <div class="info-r flex">\
                              <div class="mr20 check_method_item CNAME_CSR_HASH">\
                                <input id="CNAME_CSR_HASH" type="radio" name="dcvMethod" checked="checked" value="CNAME_CSR_HASH">\
                                <label for="CNAME_CSR_HASH">DNS验证(CNAME解析)</label>\
                                <span class="testVerify hide"></span>\
                              </div>\
                              <div class="mr20 check_method_item HTTP_CSR_HASH"  style="display: ' +
												(isWildcard ? 'none' : 'flex') +
												';">\
                                <input id="HTTP_CSR_HASH" type="radio" name="dcvMethod" value="HTTP_CSR_HASH">\
                                <label for="HTTP_CSR_HASH">文件验证(HTTP)</label>\
                                <span class="testVerify hide"></span>\
                              </div>\
                              <div class="mr20 check_method_item HTTPS_CSR_HASH" style="display: ' +
												(isWildcard ? 'none' : 'flex') +
												';">\
                                <input id="HTTPS_CSR_HASH" type="radio" name="dcvMethod" value="HTTPS_CSR_HASH">\
                                <label for="HTTPS_CSR_HASH">文件验证(HTTPS)</label>\
                                <span class="testVerify hide"></span>\
                              </div>\
                            </div>\
                        </div>\
                        <div class="line">\
                            <span class="tname">所在地区</span>\
                            <div class="info-r">\
                                <input type="text" class="bt-input-text mr5" name="state" value="' +
												res.state +
												'" placeholder="请输入所在省份，必填项" style="width: 190px; margin-right:0;" data-placeholder="请输入所在省份，必填项">\
                                <input type="text" class="bt-input-text mr5" name="city" value="' +
												res.city +
												'" placeholder="请输入所在市/县，必填项" style="width: 190px; margin-left: 15px;" data-placeholder="请输入所在市/县，必填项" />\
                            </div>\
                        </div>\
                        <div class="line" style="display:' +
												(config.code.indexOf('ov') > -1 || config.code.indexOf('ev') > -1 ? 'block' : 'none') +
												'">\
                            <span class="tname">公司详细地址</span>\
                            <div class="info-r">\
                                <input type="text" class="bt-input-text mr5" name="address" value="' +
												res.address +
												'" placeholder="请输入公司详细地址，具体要求见说明，必填项" />\
                            </div>\
                        </div>\
                        <div class="line">\
                            <span class="tname">公司名称</span>\
                            <div class="info-r">\
                                <input type="text" class="bt-input-text mr5" name="organation" value="' +
												res.organation +
												'" placeholder="请输入公司名称，如为个人申请请输入个人姓名，必填项" />\
                            </div>\
                        </div>\
                        <div class="line">\
                            <span class="tname">姓名</span>\
                            <div class="info-r ">\
                                <input type="text" class="bt-input-text mr5" name="name" value="' +
												res.lastName +
												res.firstName +
												'" placeholder="请输入姓名，必填项" />\
                            </div>\
                        </div>\
                        <div class="line">\
                            <span class="tname">邮箱</span>\
                            <div class="info-r ">\
                                <input type="text" class="bt-input-text mr5" name="email" value="' +
												res.email +
												'" placeholder="请输入邮箱地址，必填项" />\
                            </div>\
                        </div>\
                        <div class="line">\
                            <span class="tname">手机</span>\
                            <div class="info-r">\
                                <input type="text" class="bt-input-text mr5" name="mobile" value="' +
												res.mobile +
												'" placeholder="请输入手机号码，若为空，则使用当前绑定手机号" />\
                            </div>\
                        </div>\
                        <div class="line">\
                            <div class="info-r"><button class="btn btn-success submit_ssl_info">提交资料</button></div>\
                        </div>\
                        <ul class="help-info-text c7 ssl_help_info">\
                          <li style="' +
												(isWildcard ? '' : 'display: none;') +
												'">通配符证书只支持DNS验证</li>\
                          <li style="' +
												(isMulti ? '' : 'display: none;') +
												'">多域名只支持DNS验证</li>\
                          <li tyle="color:red">https或者http验证，必须保证网站能通过http/https访问</li>\
                          <li tyle="color:red">域名前缀是www,提醒用户解析上级根域名，如申请www.bt.cn，请确保解析bt.cn</li>\
                        </ul>\
                        <ul class="help-info-text c7 ssl_help_info" style="display:' +
												(config.code.indexOf('ov') > -1 || config.code.indexOf('ev') > -1 ? 'block' : 'none') +
												'; margin-top: 0;">\
                            <li>OV/EV证书申请流程条件：</li>\
                            <li>1、填写网站验证信息(文件验证或DNS验证)</li>\
                            <li>2、完成邮箱认证，根据CA发送的邮件完善邮件内容(中文填写即可)</li>\
                            <li>3、企查查或者爱企查、百度地图、114best能查询到相关企业信息，且公司名和公司地址完全匹配</li>\
                            <li>4、企查查或其他平台留下的电话能保证周一到周五(7:00 - 15:00)能接听到CA的认证电话，电话号码归属地来自美国，请留意接听。</li>\
                        </ul>\
                    </form>',
											// 添加dns接口
											add_dns_interface: function () {
												if ($('.dns_interface_line').length > 0) return;
												bt.site.get_dns_api(function (api) {
													var arrs_list = [],
														arr_obj = {};
													for (var x = 0; x < api.length; x++) {
														arrs_list.push({
															title: api[x].title,
															value: api[x].name,
														});
														arr_obj[api[x].name] = api[x];
													}
													var data = {
														title: '选择DNS接口',
														class: 'dns_interface_line',
														items: [
															{
																name: 'dns_interface_select',
																width: '120px',
																type: 'select',
																items: arrs_list,
																callback: function (obj) {
																	var _val = obj.val();
																	$('.set_dns_config').remove();
																	var _val_obj = arr_obj[_val];
																	var _form = {
																		title: '',
																		area: '550px',
																		list: [],
																		btns: [
																			{
																				title: '关闭',
																				name: 'close',
																			},
																		],
																	};
																	var helps = [];
																	if (_val_obj.data !== false) {
																		_form.title = '设置【' + _val_obj.title + '】接口';
																		helps.push(_val_obj.help);
																		var is_hide = true;
																		for (var i = 0; i < _val_obj.data.length; i++) {
																			_form.list.push({
																				title: _val_obj.data[i].name,
																				name: _val_obj.data[i].key,
																				value: _val_obj.data[i].value,
																			});
																			if (!_val_obj.data[i].value) is_hide = false;
																		}
																		_form.btns.push({
																			title: '保存',
																			css: 'btn-success',
																			name: 'btn_submit_save',
																			callback: function (ldata, load) {
																				bt.site.set_dns_api(
																					{
																						pdata: JSON.stringify(ldata),
																					},
																					function (ret) {
																						if (ret.status) {
																							load.close();
																							robj.find('input[type="radio"]:eq(0)').trigger('click');
																							robj.find('input[type="radio"]:eq(1)').trigger('click');
																						}
																						bt.msg(ret);
																					}
																				);
																			},
																		});
																		if (is_hide) {
																			obj.after('<button class="btn btn-default btn-sm mr5 set_dns_config">设置</button>');
																			$('.set_dns_config').click(function () {
																				var _bs = bt.render_form(_form);
																				$('div[data-id="form' + _bs + '"]').append(bt.render_help(helps));
																			});
																		} else {
																			var _bs = bt.render_form(_form);
																			$('div[data-id="form' + _bs + '"]').append(bt.render_help(helps));
																		}
																	}
																},
															},
														],
													};
													var form_line_html = bt.render_form_line(data);
													$('.check_model_line.line').after(form_line_html.html);
													$('[name="dns_interface_select"] option[value="dns"]').prop('selected', 'selected');
													bt.render_clicks(form_line_html.clicks);
												});
											},
											// 移除dns接口
											remove_dns_interface: function () {
												$('.dns_interface_line.line').remove();
											},
											check_dns_interface: function (callback) {
												var val = $('input[name="dcvMethod"]:radio:checked').val();
												if (val !== 'CNAME_CSR_HASH') {
													if (callback) callback();
													return;
												}
												var dns_val = $('.dns_interface_select').val();
												if (dns_val == 'dns') {
													if (callback) callback();
												} else {
													bt.site.get_dns_api(function (res) {
														var config;
														for (var i = 0; i < res.length; i++) {
															if (res[i].name == dns_val) {
																config = res[i];
																break;
															}
														}
														var check = true;
														var title = '';
														if (config && config.data) {
															for (var j = 0; j < config.data.length; j++) {
																if (config.data[j].value === '') {
																	check = false;
																	title = config.title;
																	break;
																}
															}
														}
														if (check) {
															if (callback) callback();
														} else {
															layer.msg('已选择DNS接口【' + title + '】未配置密钥', { icon: 2 });
														}
													});
												}
											},
											success: function (layero, index) {
												$('.perfect_ssl_info').data('code', config.code);
												var _this_layer = this;
												this.add_dns_interface();
												// 验证方式
												$('input[name="dcvMethod"]').change(function () {
													var val = $(this).val();
													if (val == 'CNAME_CSR_HASH') {
														_this_layer.add_dns_interface();
													} else {
														_this_layer.remove_dns_interface();
													}
												});
												// 公司详细地址联动
												$('.perfect_ssl_info').on('input', 'input[name="state"], input[name="city"]', function (e) {
													var is_ovev = config.code.indexOf('ov') > -1 || config.code.indexOf('ev') > -1;
													if (!is_ovev) {
														var state = $('.perfect_ssl_info input[name="state"]').val();
														var city = $('.perfect_ssl_info input[name="city"]').val();
														$('.perfect_ssl_info input[name="address"]').val(state + city);
													}
												});
												$('.perfect_ssl_info')
													.on('focus', 'input[type=text],textarea', function () {
														var placeholder = $(this).attr('placeholder');
														$('html').append($('<span id="width_test">' + placeholder + '</span>'));
														$(this).attr('data-placeholder', placeholder);
														layer.tips(placeholder, $(this), { tips: [1, '#20a53a'], time: 0 });
														$(this).attr('placeholder', '');
														$('#width_test').remove();
													})
													.on('blur', 'input[type=text],textarea', function () {
														var name = $(this).attr('name'),
															val = $(this).val();
														layer.closeAll('tips');
														$(this).attr('placeholder', $(this).attr('data-placeholder'));
														check_ssl_user_info($(this), name, val, config);
													});
												$('.submit_ssl_info').on('click', function () {
													var data = {},
														form = $('.perfect_ssl_info').serializeObject(),
														is_ovev = config.code.indexOf('ov') > -1 || config.code.indexOf('ev') > -1,
														loadT = null;

													$('.perfect_ssl_info')
														.find('input,textarea')
														.each(function () {
															var name = $(this).attr('name'),
																value = $(this).val(),
																value = check_ssl_user_info($(this), name, value, config);
															if (typeof value === 'boolean') {
																form = false;
																return false;
															}
															form[name] = value;
														});
													if (typeof form == 'boolean') return false;
													if (!is_ovev) form['address'] = form['state'] + form['city'];
													if (typeof config.limit == 'undefined') config.limit = config.num;
													if (form.domains.length < config.limit) {
														bt.confirm({ title: '提示', msg: '检测到当前证书支持' + config.limit + '个域名可以继续添加域名，是否忽略继续提交？' }, function () {
															req(true);
														});
														return false;
													}
													req(true);
													function req(verify) {
														if (is_ovev && verify) {
															bt.open({
																title: 'OV或EV证书企业信息二次确认',
																area: ['600px'],
																btn: ['继续提交', '取消'],
																content:
																	'<div class="bt_form certificate_confirm" style="font-size: 12px;padding-left: 25px">' +
																	'<div class="line">' +
																	'<span class="tname">公司名称</span>' +
																	'<div class="info-r"><input type="text" class="bt-input-text mr5" name="organation" value="' +
																	form.organation +
																	'" style="width:380px;"/></div>' +
																	'<div style="padding:0 0 5px 100px;color:#777">*确保与企查查获取的名称一致，否则认证失败需要重走流程。<a href="javascript:;" class="checkInfo btlink">点击查询</a></div>' +
																	'</div>' +
																	'<div class="line">' +
																	'<span class="tname">公司详细地址</span>' +
																	'<div class="info-r"><input type="text" class="bt-input-text mr5" name="address"  value="' +
																	form.address +
																	'" style="width:380px;"/></div>' +
																	'<div style="padding:0 0 0 100px;color:#777">*确保与企查查获取的地址一致，否则认证失败需要重走流程。</div>' +
																	'</div>' +
																	'<ul class="help-info-text c7 ssl_help_info">' +
																	'<li>商用OV/EV证书申请流程：</li>' +
																	'<li>1、完成邮箱认证，根据CA发送的邮件完善邮件内容(中文回复“确认”即可)</li>' +
																	'<li style="color:red">2、填写完整的【公司名】和【公司详细地址】，并且企查查等平台能查询到企业信息</li>' +
																	'<li>3、EV证书需要在认证平台留下的电话能接听CA的认证电话（周一到周五 7:00 - 15:00），电话号码归属地来自美国，请留意接听。</li>' +
																	'<li>支持认证平台包括企查查、爱企查、百度地图、114best，其中任意一个</li>' +
																	'</ul>' +
																	'</div>',
																yes: function () {
																	req(false);
																},
																success: function () {
																	$('.certificate_confirm [name="organation"]').change(function () {
																		$('.perfect_ssl_info [name="organation"]').val($(this).val());
																		form.organation = $(this).val();
																	});
																	$('.certificate_confirm [name="address"]').change(function () {
																		$('.perfect_ssl_info [name="address"]').val($(this).val());
																		form.address = $(this).val();
																	});
																	$('.checkInfo').on('click', function (e) {
																		window.open('https://www.qcc.com/web/search?key=' + $('.certificate_confirm [name="organation"]').val());
																	});
																},
															});
															return false;
														}
														_this_layer.check_dns_interface(function () {
															var loadT = bt.load('正在提交证书资料，请稍候...');
															var auth_to = $("[name='dns_interface_select']") ? $("[name='dns_interface_select']").val() : '';
															bt.send(
																'apply_order_ca',
																'ssl/apply_order_ca',
																{
																	pdata: JSON.stringify({
																		pid: config.pid,
																		oid: config.oid,
																		domains: form.domains,
																		dcvMethod: $("[name='dcvMethod']:checked").val(),
																		auth_to: auth_to,
																		Administrator: {
																			job: '总务',
																			postCode: '523000',
																			country: 'CN',
																			lastName: form.name,
																			state: form.state,
																			city: form.city,
																			address: form.address,
																			organation: form.organation,
																			email: form.email,
																			mobile: form.mobile,
																			lastName: form.name,
																		},
																	}),
																},
																function (res) {
																	loadT.close();
																	if (typeof res.msg == 'object') {
																		for (var key in res.msg.errors) {
																			if (Object.hasOwnProperty.call(res.msg.errors, key)) {
																				var element = res.msg.errors[key];
																				bt.msg({
																					status: false,
																					msg: element,
																				});
																			}
																		}
																	} else {
																		if (res.caa_list) {
																			site.show_domain_error_dialog(res.caa_list, res.msg);
																		} else {
																			bt.msg(res);
																		}
																	}
																	if (res.status) {
																		layer.close(index);
																		verify_order_veiw(config.oid);
																		$('#ssl_tabs span.on').click();
																	}
																}
															);
														});
													}
												});

												$('.check_method_item label').click(function (e) {
													e.stopPropagation();
												});

												$('.check_method_item').click(function () {
													// 选中
													$(this).find('label').trigger('click');
													// 判断是否显示异常
													var show = $(this).data('show-tips');
													if (!show) return;
													$(this).data('show-tips', false);
													// 判断是否存在异常数据
													var data = $(this).data('error-data');
													if (!data) return;
													$(this).find('.error-link').trigger('click');
												});

												$('.check_method_item').on('click', '.error-link', function (e) {
													e.stopPropagation();
													var data = $(this).parents('.check_method_item').data('error-data');

													if ($.isPlainObject(data)) {
														site.show_domain_error_dialog(data);
													}
													if (Array.isArray(data)) {
														var html = '';
														$.each(data, function (i, item) {
															html += '<p>' + item + '</p>';
														});
														layer.msg(html, {
															icon: 2,
															shade: 0.3,
															closeBtn: 2,
															time: 0,
															success: function ($layer) {
																$layer.css({ 'max-width': '560px' });
																var width = $(window).width();
																var lWidth = $layer.width();
																$layer.css({
																	left: (width - lWidth) / 2 + 'px',
																});
															},
														});
													}
												});

												var Timer = null;
												$('.CNAME_CSR_HASH,.HTTP_CSR_HASH,.HTTPS_CSR_HASH').hover(
													function () {
														var $this = $(this);
														var data = $(this).data('error-data');
														if (data) return;
														var arry = ['如网站还未备案完成，可选【DNS验证】', '如网站未开启301、302、强制HTTPS、反向代理功能，请选择HTTP', '如网站开启【强制HTTPS】，请选【HTTPS验证】'];
														var tips = arry[$this.index()];
														clearTimeout(Timer);
														Timer = setTimeout(function () {
															$this.data({
																tips: layer.tips(tips, $this.find('label'), { tips: 1, time: 0 }),
															});
														}, 200);
													},
													function () {
														clearTimeout(Timer);
														layer.close($(this).data('tips'));
													}
												);
											},
										});
									});
								}
								$('.ssl_business_application').click(function () {
									pay_ssl_business();
								});
								//订单证书操作
								$('.ssl_order_list')
									.unbind('click')
									.on('click', '.options_ssl', function () {
										var type = $(this).data('type'),
											tr = $(this).parents('tr');
										itemData = order_list[tr.data('index')];
										switch (type) {
											case 'deploy_ssl': // 部署证书
												bt.confirm(
													{
														title: '部署证书',
														msg: '是否部署该证书,是否继续？<br>证书类型：' + itemData.title + ' <br>证书支持域名：' + itemData.domainName.join('、') + '<br>部署站点名:' + web.name + '',
													},
													function (index) {
														var loads = bt.load('正在部署证书，请稍候...');
														bt.send('set_cert', 'ssl/set_cert', { oid: itemData.oid, siteName: web.name }, function (rdata) {
															layer.close(index);
															$('#webedit-con').empty();
															site.set_ssl(web);
															site.ssl.reload();
															bt.msg(rdata);
														});
													}
												);
												break;
											case 'verify_order': // 验证订单
												verify_order_veiw(itemData.oid);
												break;
											case 'clear_order': // 取消订单
												bt.confirm(
													{
														title: '取消订单',
														msg: '是否取消该订单，订单域名【' + itemData.domainName.join('、') + '】，是否继续？',
													},
													function (index) {
														var loads = bt.load('正在取消订单，请稍候...');
														bt.send('cancel_cert_order', 'ssl/cancel_cert_order', { oid: itemData.oid }, function (rdata) {
															layer.close(index);
															if (rdata.status) {
																$('#ssl_tabs span:eq(2)').click();
																setTimeout(function () {
																	bt.msg(rdata);
																}, 2000);
															}
															bt.msg(rdata);
														});
													}
												);
												break;
											case 'perfect_user_info': //完善用户信息
												confirm_certificate_info(itemData);
												break;
											case 'renewal_ssl':
												renewal_ssl_view(itemData);
												break;
										}
									});
							} else {
								robj.append('<div class="alert alert-warning" style="padding:10px">未绑定宝塔账号，请注册绑定，绑定宝塔账号(非论坛账号)可实现一键部署SSL</div>');
								var datas = [
									{ title: '宝塔账号', name: 'bt_username', value: rdata.email, width: '260px', placeholder: '请输入手机号码' },
									{ title: '密码', type: 'password', name: 'bt_password', value: rdata.email, width: '260px' },
									{
										title: ' ',
										items: [
											{
												text: '登录',
												name: 'btn_ssl_login',
												type: 'button',
												callback: function (sdata) {
													bt.pub.login_btname(sdata.bt_username, sdata.bt_password, function (ret) {
														if (ret.status) site.reload(7);
													});
												},
											},
											{
												text: '注册宝塔账号',
												name: 'bt_register',
												type: 'button',
												callback: function (sdata) {
													window.open('https://www.bt.cn/register.html');
												},
											},
										],
									},
								];
								for (var i = 0; i < datas.length; i++) {
									var _form_data = bt.render_form_line(datas[i]);
									robj.append(_form_data.html);
									bt.render_clicks(_form_data.clicks);
								}
								robj.append(
									bt.render_help([
										'商用证书相对于普通证书，具有更高的安全性、赔付保障和支持通配符和多域名等方式。<a class="btlink" target="_blank" href="https://www.racent.com/sectigo-ssl">点击查看</a>',
										'已有宝塔账号请登录绑定',
									])
								);
							}
						});
					},
				},
				{
					title: '测试证书',
					callback: function (robj) {
						robj = $('#webedit-con .tab-con');
						bt.pub.get_user_info(function (udata) {
							if (udata.status) {
								robj.append(
									"<div class=\"alert alert-danger\" style=\"margin-bottom: 10px;\">* 建议用于测试、个人试用等场景，org、jp等特殊域名存在无法申请的情况</div><button name=\"btsslApply\" class=\"btn btn-success btn-sm mr5 btsslApply\">申请证书</button><div id='ssl_order_list' class=\"divtable mtb15 table-fixed-box\" style=\"max-height:340px;overflow-y: auto;\"><table id='bt_order_list' class='table table-hover'><thead><tr><th>域名</th><th>到期时间</th><th>状态</th><th>操作</th></tr></thead><tbody><tr><td colspan='4' style='text-align:center'><img style='height: 18px;margin-right:10px' src='/static/images/loading-2.gif'>正在获取订单,请稍候...</td></tr></tbody></table></div>"
								);
								bt.site.get_domains(web.id, function (ddata) {
									$('.btsslApply').click(function () {
										apply_bt_certificate();
									});
									var helps = [
										'<span style="color:red">注意：请勿将SSL证书用于非法网站，一经发现，吊销证书</span>',
										'申请之前，请确保域名已解析，如未解析会导致审核失败(包括根域名)',
										'宝塔SSL申请的是免费版TrustAsia DV SSL CA - G5证书，仅支持单个域名申请',
										'有效期1年，不支持续签，到期后需要重新申请',
										'建议使用二级域名为www的域名申请证书,此时系统会默认赠送顶级域名为可选名称',
										'在未指定SSL默认站点时,未开启SSL的站点使用HTTPS会直接访问到已开启SSL的站点',
										'测试SSL申请注意事项及教程 <a href="https://www.bt.cn/bbs/thread-33113-1-1.html" target="_blank" class="btlink"> 使用帮助</a>',
									];
									robj.append(bt.render_help(helps));
									var loading = bt.load();
									bt.site.get_order_list(web.name, function (odata) {
										loading.close();
										if (odata.status === false) {
											layer.msg(odata.msg, { icon: 2 });
											return;
										}
										robj.append('<div class="divtable mtb15 table-fixed-box" style="max-height:200px;overflow-y: auto;"><table id=\'bt_order_list\' class=\'table table-hover\'></table></div>');
										bt.render({
											table: '#bt_order_list',
											columns: [
												{ field: 'commonName', title: '域名' },
												{
													field: 'endtime',
													width: '70px',
													title: '到期时间',
													templet: function (item) {
														return bt.format_data(item.endtime, 'yyyy/MM/dd');
													},
												},
												{ field: 'stateName', width: '100px', title: '状态' },
												{
													field: 'opt',
													align: 'right',
													width: '100px',
													title: '操作',
													templet: function (item) {
														var opt = '<a class="btlink" onclick="site.ssl.onekey_ssl(\'' + item.partnerOrderId + "','" + web.name + '\')" href="javascript:;">部署</a>';
														if (item.stateCode == 'WF_DOMAIN_APPROVAL') {
															opt = '<a class="btlink" onclick="site.ssl.verify_domain(\'' + item.partnerOrderId + "','" + web.name + '\')" href="javascript:;">验证域名</a>';
														} else {
															if (item.setup) opt = '已部署 | <a class="btlink" href="javascript:site.ssl.set_ssl_status(\'CloseSSLConf\',\'' + web.name + '\')">关闭</a>';
														}
														return opt;
													},
												},
											],
											data: odata.data,
										});
										bt.fixed_table('bt_order_list');
									});
								});
							} else {
								robj.append('<div class="alert alert-warning" style="padding:10px">未绑定宝塔账号，请注册绑定，绑定宝塔账号(非论坛账号)可实现一键部署SSL</div>');

								var datas = [
									{ title: '宝塔账号', name: 'bt_username', value: rdata.email, width: '260px', placeholder: '请输入手机号码' },
									{ title: '密码', type: 'password', name: 'bt_password', value: rdata.email, width: '260px' },
									{
										title: ' ',
										items: [
											{
												text: '登录',
												name: 'btn_ssl_login',
												type: 'button',
												callback: function (sdata) {
													bt.pub.login_btname(sdata.bt_username, sdata.bt_password, function (ret) {
														if (ret.status) site.reload(7);
													});
												},
											},
											{
												text: '注册宝塔账号',
												name: 'bt_register',
												type: 'button',
												callback: function (sdata) {
													window.open('https://www.bt.cn/register.html');
												},
											},
										],
									},
								];
								for (var i = 0; i < datas.length; i++) {
									var _form_data = bt.render_form_line(datas[i]);
									robj.append(_form_data.html);
									bt.render_clicks(_form_data.clicks);
								}
								robj.append(
									bt.render_help([
										'宝塔SSL证书为亚洲诚信证书，需要实名认证才能申请使用',
										'已有宝塔账号请登录绑定',
										'宝塔SSL申请的是TrustAsia DV SSL CA - G5 原价：1900元/1年，宝塔用户免费！',
										'一年满期后免费颁发',
									])
								);
							}
						});
					},
				},
				{
					title: "Let's Encrypt",
					callback: function (robj) {
						acme.get_account_info(function (let_user) {
							if (let_user.status === false) {
								layer.msg(let_user.msg, { icon: 2, time: 10000 });
							}
						});
						acme.id = web.id;
						if (rdata.status && rdata.type == 1) {
							var cert_info = '';
							if (rdata.cert_data['notBefore']) {
								cert_info =
									'<div style="margin-bottom: 10px;" class="alert alert-success">\
                                        <p style="margin-bottom: 9px;"><span style="width: 357px;display: inline-block;"><b>已部署成功：</b>将在距离到期时间1个月内尝试自动续签</span>\
                                        <span style="margin-left: 15px;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;max-width: 140px;width: 140px;">\
                                        <b>证书品牌：</b>' +
									rdata.cert_data.issuer +
									'</span></p>\
                                        <span style="display:inline-block;max-width: 357px;overflow:hidden;text-overflow:ellipsis;vertical-align:-3px;white-space: nowrap;width: 357px;"><b>认证域名：</b> ' +
									rdata.cert_data.dns.join('、') +
									'</span>\
                                        <span style="margin-left: 15px;"><b>到期时间：</b> ' +
									rdata.cert_data.notAfter +
									'</span></div>';
							}
							robj.append('<div>' + cert_info + '<div><span>密钥(KEY)</span><span style="padding-left:194px">证书(PEM格式)</span></div></div>');
							var datas = [
								{
									items: [
										{ name: 'key', width: '45%', height: '220px', type: 'textarea', value: rdata.key },
										{ name: 'csr', width: '45%', height: '220px', type: 'textarea', value: rdata.csr },
									],
								},
								{
									items: [
										{
											text: '关闭SSL',
											name: 'btn_ssl_close',
											hide: !rdata.status,
											type: 'button',
											callback: function (sdata) {
												site.ssl.set_ssl_status('CloseSSLConf', web.name);
											},
										},
										{
											text: '续签',
											name: 'btn_ssl_renew',
											hide: !rdata.status,
											type: 'button',
											callback: function (sdata) {
												site.ssl.renew_ssl(web.name, rdata.auth_type, rdata.index);
											},
										},
									],
								},
							];
							for (var i = 0; i < datas.length; i++) {
								var _form_data = bt.render_form_line(datas[i]);
								robj.append(_form_data.html);
								bt.render_clicks(_form_data.clicks);
							}
							robj.find('textarea').css('background-color', '#f6f6f6').attr('readonly', true);
							var helps = [
								'<span style="color:red">注意：请勿将SSL证书用于非法网站</span>',
								'申请之前，请确保域名已解析，如未解析会导致审核失败(包括根域名)',
								'宝塔SSL申请的是免费版TrustAsia DV SSL CA - G5证书，仅支持单个域名申请',
								'有效期1年，不支持续签，到期后需要重新申请',
								'建议使用二级域名为www的域名申请证书,此时系统会默认赠送顶级域名为可选名称',
								'在未指定SSL默认站点时,未开启SSL的站点使用HTTPS会直接访问到已开启SSL的站点',
								'如果重新申请证书时提示【订单已存在】请登录宝塔官网删除对应SSL订单',
							];
							robj.append(
								bt.render_help([
									"已为您自动生成Let's Encrypt免费证书；",
									'如需使用其他SSL,请切换其他证书后粘贴您的KEY以及PEM内容，然后保存即可。',
									'如开启后无法使用HTTPS访问，请检查安全组是否正确放行443端口',
								])
							);
							return;
						}
						bt.site.get_site_domains(web.id, function (ddata) {
							var helps = [
								[
									'<span style="color:red">注意：请勿将SSL证书用于非法网站</span>',
									'Let\'s Encrypt 证书申请和续签限制 <a class="btlink" target="_blank" href="https://letsencrypt.org/zh-cn/docs/rate-limits/">点击查看</a>',
									'<span style="color:red;">Let\'s Encrypt因更换根证书，部分老旧设备访问时可能提示不可信，考虑购买<a class="btlink" onclick="$(\'#ssl_tabs span\').eq(1).click();">[商用SSL证书]</a></span>',
									'申请之前，请确保域名已解析，如未解析会导致审核失败',
									"Let's Encrypt免费证书，有效期3个月，支持多域名。默认会自动续签",
									'若您的站点使用了CDN或301重定向会导致续签失败',
									'在未指定SSL默认站点时,未开启SSL的站点使用HTTPS会直接访问到已开启SSL的站点',
									'如开启后无法使用HTTPS访问，请检查安全组是否正确放行443端口',
								],
								[
									'<span style="color:red">注意：请勿将SSL证书用于非法网站</span>',
									'在DNS验证中，我们提供了多种自动化DNS-API，并提供了手动模式',
									'使用DNS接口申请证书可自动续期，手动模式下证书到期后需重新申请',
									'使用【DnsPod/阿里云DNS】等接口前您需要先在弹出的窗口中设置对应接口的API',
									'如开启后无法使用HTTPS访问，请检查安全组是否正确放行443端口',
								],
							];
							var datas = [
								{
									title: '验证方式',
									items: [
										{
											name: 'check_file',
											text: '文件验证',
											type: 'radio',
											callback: function (obj) {
												$('.checks_line').remove();
												$(obj).siblings().removeAttr('checked');

												$('.help-info-text').html($(bt.render_help(helps[0])));
												//var _form_data = bt.render_form_line({ title: ' ', class: 'checks_line label-input-group', items: [{ name: 'force', type: 'checkbox', value: true, text: '提前校验域名(提前发现问题,减少失败率)' }] });
												//$(obj).parents('.line').append(_form_data.html);

												$('#ymlist li input[type="checkbox"]').each(function () {
													if ($(this).val().indexOf('*') >= 0) {
														$(this).parents('li').hide();
													}
												});
											},
										},
										{
											name: 'check_dns',
											text: 'DNS验证(支持通配符)',
											type: 'radio',
											callback: function (obj) {
												$('.checks_line').remove();
												$(obj).siblings().removeAttr('checked');
												$('.help-info-text').html($(bt.render_help(helps[1])));
												$('#ymlist li').show();

												var arrs_list = [],
													arr_obj = {};
												bt.site.get_dns_api(function (api) {
													site.dnsapi = {};

													for (var x = 0; x < api.length; x++) {
														site.dnsapi[api[x].name] = {};
														site.dnsapi[api[x].name].s_key = 'None';
														site.dnsapi[api[x].name].s_token = 'None';
														if (api[x].data) {
															site.dnsapi[api[x].name].s_key = api[x].data[0].value;
															site.dnsapi[api[x].name].s_token = api[x].data[1].value;
														}
														arrs_list.push({ title: api[x].title, value: api[x].name });
														arr_obj[api[x].name] = api[x];
													}

													var data = [
														{
															title: '选择DNS接口',
															class: 'checks_line',
															items: [
																{
																	name: 'dns_select',
																	width: '120px',
																	type: 'select',
																	items: arrs_list,
																	callback: function (obj) {
																		var _val = obj.val();
																		$('.set_dns_config').remove();
																		var _val_obj = arr_obj[_val];
																		var _form = {
																			title: '',
																			area: '530px',
																			list: [],
																			btns: [{ title: '关闭', name: 'close' }],
																		};

																		var helps = [];
																		if (_val_obj.data !== false) {
																			_form.title = '设置【' + _val_obj.title + '】接口';
																			helps.push(_val_obj.help);
																			var is_hide = true;
																			for (var i = 0; i < _val_obj.data.length; i++) {
																				_form.list.push({ title: _val_obj.data[i].name, name: _val_obj.data[i].key, value: _val_obj.data[i].value });
																				if (!_val_obj.data[i].value) is_hide = false;
																			}
																			_form.btns.push({
																				title: '保存',
																				css: 'btn-success',
																				name: 'btn_submit_save',
																				callback: function (ldata, load) {
																					bt.site.set_dns_api({ pdata: JSON.stringify(ldata) }, function (ret) {
																						if (ret.status) {
																							load.close();
																							robj.find('input[type="radio"]:eq(0)').trigger('click');
																							robj.find('input[type="radio"]:eq(1)').trigger('click');
																						}
																						bt.msg(ret);
																					});
																				},
																			});
																			if (is_hide) {
																				obj.after('<button class="btn btn-default btn-sm mr5 set_dns_config">设置</button>');
																				$('.set_dns_config').click(function () {
																					var _bs = bt.render_form(_form);
																					$('div[data-id="form' + _bs + '"]').append(bt.render_help(helps));
																				});
																			} else {
																				var _bs = bt.render_form(_form);
																				$('div[data-id="form' + _bs + '"]').append(bt.render_help(helps));
																			}
																		}
																	},
																},
															],
														},
														{
															title: ' ',
															class: 'checks_line label-input-group',
															items: [{ css: 'label-input-group ptb10', text: '自动组合泛域名', name: 'app_root', type: 'checkbox' }],
														},
													];
													for (var i = 0; i < data.length; i++) {
														var _form_data = bt.render_form_line(data[i]);
														$(obj).parents('.line').append(_form_data.html);
														bt.render_clicks(_form_data.clicks);
													}
													$('.info-r.checks_line.label-input-group').after('<div>* 如需申请通配符域名请勾选此项且不要在下方域名列表选中*.xxx.com</div>');
												});
											},
										},
									],
								},
							];

							for (var i = 0; i < datas.length; i++) {
								var _form_data = bt.render_form_line(datas[i]);
								robj.append(_form_data.html);
								bt.render_clicks(_form_data.clicks);
							}
							var _ul = $('<ul id="ymlist" class="domain-ul-list"></ul>');
							var _ul_html = '';
							for (var i = 0; i < ddata.domains.length; i++) {
								if (ddata.domains[i].binding === true) continue;
								_ul_html +=
									'<li class="checked_default" style="cursor: pointer;"><input class="checkbox-text" type="checkbox" value="' + ddata.domains[i].name + '">' + ddata.domains[i].name + '</li>';
							}
							if (_ul_html) {
								_ul.append('<li class="checked_all" style="cursor: pointer;"><input class="checkbox-text" type="checkbox">全选</li>');
								_ul.append(_ul_html);
							}
							var _line = $("<div class='line mtb10'></div>");
							_line.append('<span class="tname text-center">域名</span>');
							_line.append(_ul);
							robj.append(_line);
							robj.find('input[type="radio"]').parent().addClass('label-input-group ptb10');
							// 判断是否全选
							var getSelectAll = function () {
								var count = 0;
								var total = 0;
								$('#ymlist .checked_default').each(function () {
									var checked = $(this).find('input').prop('checked');
									checked && count++;
									total++;
								});
								$('#ymlist .checked_all')
									.find('input')
									.prop('checked', count == total);
							};
							// 设置选中框
							var setCheckedDefault = function (checked) {
								$('#ymlist .checked_default').each(function () {
									$(this).find('input').prop('checked', checked);
								});
							};
							// 点击选择框
							$('#ymlist li').click(function () {
								var o = $(this).find('input');
								var checked = o.prop('checked');
								checked = !checked;
								o.prop('checked', checked);
							});
							// 阻止冒泡事件
							$('#ymlist li input').click(function (e) {
								e.stopPropagation();
							});
							// 点击默认选中框
							$('#ymlist .checked_default').click(function (e) {
								getSelectAll();
							});
							$('#ymlist .checked_default input').click(function (e) {
								getSelectAll();
							});
							// 点击全选
							$('#ymlist .checked_all').click(function (e) {
								var checked = $(this).find('input').prop('checked');
								setCheckedDefault(checked);
							});
							$('#ymlist .checked_all input').click(function (e) {
								var checked = $(this).prop('checked');
								setCheckedDefault(checked);
							});
							var _btn_data = bt.render_form_line({
								title: ' ',
								text: '申请',
								name: 'letsApply',
								type: 'button',
								callback: function (ldata) {
									ldata['domains'] = [];
									$('#ymlist .checked_default input[type="checkbox"]:checked').each(function () {
										if (!(ldata.check_file && $(this).val().indexOf('*.') > -1)) ldata['domains'].push($(this).val());
									});
									var auth_type = 'http';
									var auth_to = web.id;
									var auto_wildcard = '0';
									if (ldata.check_dns) {
										auth_type = 'dns';
										auth_to = 'dns';
										auto_wildcard = ldata.app_root ? '1' : '0';
										if (ldata.dns_select !== auth_to) {
											if (!site.dnsapi[ldata.dns_select].s_key) {
												layer.msg('指定dns接口没有设置密钥信息');
												return;
											}
											auth_to = ldata.dns_select + '|' + site.dnsapi[ldata.dns_select].s_key + '|' + site.dnsapi[ldata.dns_select].s_token;
										}
									}
									if (ldata.domains.length <= 0) {
										layer.msg('至少需要有一个域名', { icon: 2 });
										return;
									}
									acme.apply_cert(ldata['domains'], auth_type, auth_to, auto_wildcard, function (res) {
										site.ssl.ssl_result(res, auth_type, web.name);
									});
								},
							});
							robj.append(_btn_data.html);
							bt.render_clicks(_btn_data.clicks);

							robj.append(bt.render_help(helps[0]));
							robj.find('input[type="radio"]:eq(0)').trigger('click');
						});
					},
				},
				{
					title: '证书夹',
					callback: function (robj) {
						robj = $('#webedit-con .tab-con');
						robj.html("<div class='divtable' style='height:555px;overflow: auto;'><div id='cer_list_table'></div></div>");
						bt.site.get_cer_list(function (rdata) {
							var cert_table = bt_tools.table({
								el: '#cer_list_table',
								data: rdata,
								column: [
									{
										fid: 'subject',
										title: '域名',
										template: function (row) {
											return '<span>' + row.dns.join('<br>') + '</span>';
										},
									},
									{ fid: 'notAfter', width: '83px', title: '到期时间' },
									{
										fid: 'issuer',
										width: '150px',
										title: '品牌',
										template: function (row) {
											return '<span class="ellipsis_text" title="' + row.issuer + '">' + row.issuer + '</span>';
										},
									},
									{
										title: '操作',
										width: 150,
										type: 'group',
										align: 'right',
										group: [
											{
												title: '部署',
												event: function (row, index, ev, key, that) {
													bt.open({
														type: 1,
														area: '520px',
														title: '部署当前证书',
														closeBtn: 2,
														btn: ['部署证书', '取消'],
														content:
															'<div class="batch-ssl-view">\
                                        <div class="ssl-info-exhibition">\
                                          <div class="flex">\
                                            <span class="ssl-info-name">认证域名：</span>\
                                            <span class="ssl-info-content">' +
															row.dns.join('；') +
															'</span>\
                                          </div>\
                                          <div class="flex">\
                                            <span class="ssl-info-name">证书类型：</span>\
                                            <span class="ssl-info-content">' +
															row.issuer +
															'</span>\
                                          </div>\
                                          <div class="flex">\
                                            <span class="ssl-info-name">到期时间：</span>\
                                            <span class="ssl-info-content">' +
															row.notAfter +
															'</span>\
                                          </div>\
                                        </div>\
                                        <div class="ssl-deploy">请选择需要批量部署证书的站点：</div>\
                                        <div class="site-deployment">\
                                          <div class="flex justify-between mb-10">\
                                            <div class="btn-group btn-group-sm cut-site-type" role="group" aria-label="..." >\
                                              <button type="button" class="btn btn-success" data-type="all">全部</button>\
                                              <button type="button" class="btn btn-default" data-type="match">匹配站点</button>\
                                            </div>\
                                            <div class="bt-search">\
                                              <input type="text" class="search-input" placeholder="请输入站点名" />\
                                              <span class="glyphicon glyphicon-search" aria-hidden="true"></span>\
                                            </div>\
                                          </div>\
                                          <div class="site-list">\
                                          </div>\
                                        </div>\
                                      </div>',
														success: function (layero, index) {
															$(layero).find('.layui-layer-btn0').addClass('bath-cert-ssl').append('<span></span>');
															var cert = row.dns,
																arry = []; //列表数据
															var $siteDeployment = $('.site-deployment'),
																$siteList = $('.site-deployment .site-list'),
																$bathCertSsl = $('.bath-cert-ssl'),
																$searchInput = $('.site-deployment .search-input');

															//all列表
															setTimeout(function () {
																$siteDeployment.find('.btn').eq(0).click();
															}, 50);

															//搜索
															var iptTimer = null;
															$searchInput.on('input', function () {
																clearTimeout(iptTimer);
																iptTimer = setTimeout(function () {
																	setSiteList();
																}, 500);
															});
															function setSiteList() {
																var val = $searchInput.val(),
																	list = [];
																var $btCheckbox = $('.site-deployment').find('.bt-checkbox');
																var $checkboxFilter = $btCheckbox.filter('.active');
																for (var i = 0; i < $checkboxFilter.length; i++) {
																	list.push($checkboxFilter.eq(i).data('name'));
																}
																if (val.trim() == '') $searchInput.val('');
																reanderSiteList(
																	list.filter(function (s) {
																		return $.trim(s).length > 0;
																	}),
																	1
																);
															}
															// 单选
															$siteList.on('click', '.bt-checkbox', function (ev) {
																$(this).toggleClass('active');
																var $btCheckbox = $siteList.find('.bt-checkbox');
																var $checkboxLength = $btCheckbox.length;
																var $checkboxFilterLength = $btCheckbox.filter('.active').length;
																var $checkboxAll = $siteList.find('.bt-checkbox-all');
																if ($checkboxFilterLength === 0) {
																	$checkboxAll.removeClass('active active1');
																}
																if ($checkboxFilterLength > 0) {
																	$checkboxAll.addClass('active1').removeClass('active');
																}
																if ($checkboxLength === $checkboxFilterLength) {
																	$checkboxAll.addClass('active').removeClass('active1');
																}
																setbathCertBtn($checkboxFilterLength);
																ev.stopPropagation();
																ev.preventDefault();
															});
															// 全选
															$siteList.on('click', '.bt-checkbox-all', function (ev) {
																var $this = $(this);
																var $btCheckbox = $siteList.find('.bt-checkbox');
																var $checkboxLength = $btCheckbox.length;
																$this.toggleClass('active').removeClass('active1');
																if ($this.hasClass('active')) {
																	$btCheckbox.addClass('active');
																	setbathCertBtn($checkboxLength);
																} else {
																	$btCheckbox.removeClass('active');
																	setbathCertBtn(0);
																}
																ev.stopPropagation();
																ev.preventDefault();
															});

															// 行内选中
															$siteList.on('click', '.item', function (ev) {
																$(this).find('.bt-checkbox,.bt-checkbox-all').trigger('click');
																ev.stopPropagation();
																ev.preventDefault();
															});
															// 切换站点显示类型
															$siteDeployment.on('click', '.cut-site-type .btn', function (ev) {
																var type = $(this).data('type');
																$(this).addClass('btn-success').removeClass('btn-default').siblings().removeClass('btn-success').addClass('btn-default');
																setbathCertBtn(0);
																getSiteList(type === 'all' ? [] : cert, function (res) {
																	switch (type) {
																		case 'all':
																			arry = paramTop(res.all);
																			break;
																		case 'match':
																			arry = res.site.length ? paramTop(res.site) : [];
																			break;
																	}
																	reanderSiteList(arry);
																});
															});
															//当前站点置顶
															function paramTop(collection) {
																collection.unshift(collection.splice(collection.indexOf(web.name), 1)[0]);
																return collection;
															}
															/**
															 * @description 设置批量签发按钮状态
															 * @param {number} number - 选中数量
															 */
															function setbathCertBtn(number) {
																if (number === 0) {
																	$bathCertSsl.find('span').text('');
																} else {
																	$bathCertSsl.find('span').text('[已选择' + number + '项]');
																}
															}
															/**
															 * @description: 渲染列表
															 * @param {array} collection - 数据集合
															 */
															function reanderSiteList(collection, type) {
																var searchVal = $searchInput.val(),
																	_active = [];
																if (type) {
																	for (var i = 0; i < collection.length; i++) {
																		_active.push(collection[i]);
																	}
																}
																if (searchVal) {
																	var _arry = arry.filter(function (s) {
																		return s.indexOf(searchVal) > -1;
																	});
																	if (_arry) {
																		collection = Array.from(new Set(_active.concat(_arry)));
																	} else {
																		collection = [];
																	}
																} else {
																	collection = arry;
																}

																if (!collection.length) return $siteList.html('<div class="text-center" style="height: 100%;font-size: 14px;line-height: 180px;">暂无站点数据</div>');
																var html = '<div class="item"><label class="flex align-center"><div class="bt-checkbox-all"></div><span>全选</span></label></div>';
																$.each(collection, function (index, value) {
																	html +=
																		'<div class="item">' +
																		'<label label class="flex align-center" >' +
																		'<div class="bt-checkbox ' +
																		(value === web.name ? 'active' : '') +
																		'" data-name="' +
																		value +
																		'"></div>' +
																		'<span title="' +
																		value +
																		'">' +
																		value +
																		(value === web.name ? '&nbsp;[当前站点]' : '') +
																		'</span>' +
																		'</label>' +
																		'</div>';
																});
																$siteList.html(html);
																for (var i = 0; i < _active.length; i++) {
																	$('.bt-checkbox[data-name="' + _active[i] + '"]').addClass('active');
																}
																var box = $('.bt-checkbox'),
																	box_all = $('.bt-checkbox-all');
																var box_length = box.filter('.active').length;
																if (box_length) box_all.addClass('active1');
																if (box_length === box.length) box_all.addClass('active').removeClass('active1');
																setbathCertBtn(box_length);
															}
															/**
															 * @description: 获取站点列表
															 * @param {array} cert_list - 证书列表
															 * @param {function} callback - 回调函数
															 */
															function getSiteList(cert_list, callback) {
																var param = {};
																if (!Array.isArray(cert_list)) {
																	callback = cert_list;
																	cert_list = [];
																}
																if (cert_list.length) {
																	param = {
																		cert_list: JSON.stringify(cert_list),
																	};
																}
																bt_tools.send(
																	{
																		url: '/ssl?action=GetSiteDomain',
																		data: param,
																	},
																	function (res) {
																		if (callback) callback(res);
																	},
																	'获取站点列表'
																);
															}
														},
														yes: function (index, layero) {
															var list = [];
															var $btCheckbox = $('.site-deployment').find('.bt-checkbox');
															var $checkboxFilter = $btCheckbox.filter('.active');
															if (!$checkboxFilter.length) return layer.msg('请选择最少一个站点');
															for (var i = 0; i < $checkboxFilter.length; i++) {
																list.push({ certName: row.subject, siteName: $checkboxFilter.eq(i).data('name') });
															}
															bt.simple_confirm({ title: '批量部署证书', msg: '批量部署证书后，原有证书将被覆盖，是否继续？' }, function () {
																layer.close(index);
																site.setBathSiteSsl(list, function (res) {
																	var html = '';
																	for (var i = 0; i < res.successList.length; i++) {
																		var item = res.successList[i];
																		html += '<tr><td>' + item.siteName + '</td><td><div style="float:right;"><span style="color:#20a53a;">部署成功</span></div></td></tr>';
																	}
																	for (var i = 0; i < res.faildList.length; i++) {
																		var item = res.faildList[i];
																		html += '<tr><td>' + item.siteName + '</td><td><div style="float:right;"><span style="color:red;">部署失败</span></div></td></tr>';
																	}
																	cert_table.$batch_success_table({ title: '批量部署证书', th: '站点', html: html });
																	site.ssl.reload(2);
																	if (site.model_table) site.model_table.$refresh_table_list(true);
																	if (node_table) node_table.$refresh_table_list(true);
																	if (site_table) site_table.$refresh_table_list(true);
																	site.set_ssl(web);
																});
															});
														},
													});
												},
											},
											{
												title: '删除',
												event: function (row, index, ev, key, that) {
													bt.site.remove_cert_ssl(row.subject, function (rdata) {
														if (rdata.status) {
															site.ssl.reload(4);
														}
													});
												},
											},
										],
									},
								],
							});
						});
					},
				},
			];

			bt.render_tab('ssl_tabs', tabs);

			$('#ssl_tabs span:eq(' + (rdata.status ? (rdata.csr ? 0 : 1) : 1) + ')').trigger('click');

			$('.cutTabView').on('click', function () {
				$('#ssl_tabs span:eq(1)').trigger('click');
				setTimeout(function () {
					$('.ssl_business_application').trigger('click');
				}, 400);
			});
		});
	},
	//显示php运行环境
	show_run_panel: function () {
		var soft_name = bt.get_cookie('serverType');
		soft_setup_find();
		function soft_setup_find() {
			$.post(
				'plugin?action=get_soft_find',
				{
					sName: soft_name,
				},
				function (rdata) {
					if (rdata.task == '-1') {
						setTimeout(function () {
							soft_setup_find();
						}, 3000);
					} else {
						var pan =
							'<span id="runPanel" style="cursor:pointer">' +
							'<img src="/static/img/soft_ico/ico-' +
							rdata.name +
							'.svg"><span class="Resize">' +
							rdata.title +
							' ' +
							rdata.version +
							'</span>' +
							(rdata.status ? '<span class="glyphicon glyphicon-play ac"></span>' : '<span style="color: #ef0808; margin-left: 3px;" class="glyphicon glyphicon-pause"></span>') +
							'</span>';
						$('.pull-left button').eq(4).css({
							padding: '3px 10px',
							height: '30px',
							'box-sizing': 'border-box',
						});
						if (!rdata.status) {
							$('.pull-left button').eq(4).addClass('stopStatus');
						}
						$('.pull-left button').eq(4).html(pan);
						var manu = $('<div class="flex manu" style="display:none;width:200px"><div class="arrow_b" style=""></div><div class="arrow" style=""></div></div>');
						var status_list = [
							{
								opt: rdata.status ? 'stop' : 'start',
								title: rdata.status ? '停止' : '启动',
							},
							{
								opt: 'restart',
								title: '重启',
							},
							{
								opt: 'reload',
								title: '重载',
							},
						];
						for (var i = 0; i < status_list.length; i++)
							manu.append('<div class="ac" onclick="bt.pub.set_server_status(\'' + rdata.name + "','" + status_list[i].opt + '\')">' + status_list[i].title + '</div> |');
						manu.append('<div class="ac" onclick="soft.set_soft_config(\'' + rdata.name + '\')">' + '告警设置' + '</div>');
						// btns.append('<button class="ml5 btn btn-default btn-sm mr5" onclick="soft.set_soft_config(\'' + rdata.name + '\')" >设置</button>');
						$('#runPanel').wrap('<div class="runcon"></div>');
						var time = null;
						$('#runPanel')
							.parents('.btn')
							.off('click')
							.on('click', function (e) {
								if ($(e.target).parents('.manu').length > 0 || e.target == $('.manu')[0]) {
									return;
								}
								soft.set_soft_config(rdata.name);
							});
						$('#runPanel')
							.parents('.btn')
							.on('mouseover', function () {
								manu.show();
							});
						$('#runPanel')
							.parents('.btn')
							.on('mouseleave', function () {
								time = setTimeout(function () {
									manu.hide();
								}, 200);
							});
						manu.on('mouseenter', function () {
							clearTimeout(time);
						});
						manu.on('mouseleave', function () {
							manu.hide();
						});
						$('.runcon').append(manu);
						var div = $('.Resize');
						if (window.innerWidth < 1600 && window.innerWidth > 1400) {
							$('.pull-left button').eq(4).show();
							div.html(rdata.title);
						} else if (window.innerWidth <= 1400) {
							$('.pull-left button').eq(4).hide();
						} else {
							$('.pull-left button').eq(4).show();
							div.html(rdata.title + ' ' + rdata.version);
						}
						$(window).resize(function () {
							if (window.innerWidth < 1600 && window.innerWidth > 1400) {
								$('.pull-left button').eq(4).show();
								div.html(rdata.title);
							} else if (window.innerWidth <= 1400) {
								$('.pull-left button').eq(4).hide();
							} else {
								$('.pull-left button').eq(4).show();
								div.html(rdata.title + ' ' + rdata.version);
							}
						});
					}
					if (!rdata.setup) {
						$('.pull-left button').eq(4).hide();
					}
				}
			);
		}
	},
	// 显示php高级设置
	show_advance_list: function () {
		var timer = null;
		var btn = $('#bt_site_table .pull-left button').eq(1);
		var next = $('#bt_site_table .pull-left button').eq(2);
		next.css({ position: 'relative' });
		var tips = $(
			'<div class="runcon adv-tips">更多功能已合并至高级设置<div class="arrow_b" style=""></div><div class="arrow" style="border-color: #FDF6EC transparent transparent transparent;"></div></div>'
		);
		var adv_list = ['修改默认页面', '默认站点', 'PHP命令版本', 'HTTPS防窜站', 'TLS设置', '全局设置'];
		var options = '';
		for (var i = 0; i < adv_list.length; i++) {
			options += '<div class="adv-option" data-id=' + i + ' title="' + adv_list[i] + '" style="width:100%;padding:5px 10px;text-align:left;">' + adv_list[i] + '</div>';
		}
		var advance_manu = $('<div class="flex advance_manu">' + options + '</div>');
		next.append(advance_manu);

		bt.newDotTips([
			{ el: '#bt_site_table .set_list_fid_dropdown .setting_btn', name: 'phpSetBtn', style: 'top: -4px;margin-left: 26px;' },
			{ el: '#bt_site_table .bt_search', name: 'phpSearch', style: 'top: -4px;margin-left: -5px;' },
			{ el: '#bt_site_table .pull-left button:eq(1)', name: 'phpAdvance', style: 'top: -3px;margin-left: 6px;z-index: 8;' }
		]);

		if (!bt.get_storage('adv_tips')) next.append(tips);
		btn.hover(function (e) {
			// btn.css({    'color': '#20A53A',
			// 	'background-color': '#F1F9F3',
			// 	'border-color': '#BCE4C4'})
			// next.css({    'color': '#20A53A',
			// 	'background-color': '#F1F9F3',
			// 	'border-color': '#BCE4C4'})
			bt.set_storage('adv_tips', 'false');
			tips.hide();
		});
		next.hover(function (e) {
			// btn.css({    'color': '#20A53A',
			// 	'background-color': '#F1F9F3',
			// 	'border-color': '#BCE4C4'})
			// 	next.css({    'color': '#20A53A',
			// 	'background-color': '#F1F9F3',
			// 	'border-color': '#BCE4C4'})
			bt.set_storage('adv_tips', 'false');
			tips.hide();
		});
		tips.hover(function (e) {
			bt.set_storage('adv_tips', 'false');
			e.stopPropagation();
			tips.hide();
		});
		$('.advance_manu .adv-option')
			.off('click')
			.on('click', function (e) {
				site.site_advance_set($(this).data('id'));
				e.stopPropagation();
			});
		next.on('mouseenter', function () {
			clearTimeout(timer);
			advance_manu.show();
		});
		next.on('mouseover', function () {
			advance_manu.show();
		});
		next.on('mouseleave', function () {
			timer = setTimeout(function () {
				advance_manu.hide();
				$('.adv-select-down path').attr('fill', '#666');
			}, 200);
		});
		advance_manu.on('mouseenter', function () {
			clearTimeout(timer);
			advance_manu.show();
		});
	},
};

function GetSpeed() {
	if (!$('.depSpeed')) return;
	$.get('/deployment?action=GetSpeed', function (speed) {
		if (speed.status === false) return;
		if (speed.name == '下载文件') {
			speed =
				'<p>正在' +
				speed.name +
				' <img src="/static/img/ing.gif"></p>\
				<div class="bt-progress"><div class="bt-progress-bar" style="width:' +
				speed.pre +
				'%"><span class="bt-progress-text">' +
				speed.pre +
				'%</span></div></div>\
				<p class="f12 c9"><span class="pull-left">' +
				ToSize(speed.used) +
				'/' +
				ToSize(speed.total) +
				'</span><span class="pull-right">' +
				ToSize(speed.speed) +
				'/s</span></p>';
			$('.depSpeed').prev().hide();
			$('.depSpeed').css({
				'margin-left': '-37px',
				width: '380px',
			});
			$('.depSpeed').parents('.layui-layer').css({
				'margin-left': '-100px',
			});
		} else {
			speed = '<p>' + speed.name + '</p>';
			$('.depSpeed').prev().show();
			$('.depSpeed').removeAttr('style');
			$('.depSpeed').parents('.layui-layer').css({
				'margin-left': '0',
			});
		}
		$('.depSpeed').html(speed);
		// setTimeout(function () {
		//   GetSpeed();
		// }, 1000);
	});
}

/**
 * @description 创建链接方法
 * @param {*} config  {siteName:网站名称}
 * @param {*} callback
 */
function CreateConnect(config, callback) {
	this.scanList = ['vulscan', 'webscan', 'filescan', 'backup', 'webshell', 'index','webhorse','deadchain','database','ftps','backend']; // 类型
	this.execution = 0; // 执行位置
	this.connectStatus = false; // 连接状态
	this.isHandle = false; // 是否处理
	this.config = {
		// 配置
		mod_name: 'webscanning',
		def_name: 'ScanSingleSite',
		ws_callback: '',
		name: config.name,
		scan_list: [],
	};
	this.init();
	this.onmessage = config.onmessage;
	if (callback) {
		callback.call(this);
	}
}

/**
 * @description 初始化链接
 * @param {*} data
 */
CreateConnect.prototype.init = function (callback) {
	var that = this;
	var http_token = $('#request_token_head').attr('token');
	this.send();
	this.connect.onopen = function () {
		that.connectStatus = true;
		this.send(JSON.stringify({ 'x-http-token': http_token }));
		this.send(
			JSON.stringify({
				mod_name: 'webscanning',
			})
		);
		if (callback) callback();
	};
};

/**
 * @description 开始执行扫描
 * @param {*} data
 */
CreateConnect.prototype.start = function (error) {
	var that = this,
		index = 0,
		isEnd = false,
		errorNum = 0,
		errorList = [];
	if (typeof error === 'undefined') error = 0;
	errorNum += error;
	this.isHandle = true;
	if (that.execution == this.scanList.length) {
		that.execution = 0;
		that.onmessage({ isEnd: true, error: errorNum }); // 监听返回内容
		return false;
	}
	if (this.connectStatus) {
		var ws = this.connect;
		var execution = this.execution;
		var type = this.scanList[this.execution];
		this.config.scan_list = [type];
		this.config.ws_callback = new Date().getTime();
		ws.send(JSON.stringify(this.config));
		ws.onmessage = function (wsData) {
			if (isEnd) {
				that.execution++;
				index = 0;
				that.start(errorNum);
				return false;
			}
			var data = JSON.parse(wsData.data),
				isStart = false;
			index++;
			isStart = !!(index === 1);
			if (!that.isHandle) return false;
			data.isStart = isStart;
			if (typeof data.webinfo != 'undefined') {
				var webinfo = data.webinfo;
				errorNum += webinfo.result[data.type].length || 0;
				errorNum && (data.isError = true);
				data.errorList = webinfo.result[data.type];
			}
			data.error = errorNum;
			that.onmessage(data); // 监听返回内容
			if (data.end) isEnd = true;
		};
	} else {
		that.init(function () {
			that.start();
		});
	}
};

/**
 * @description 取消扫描
 */
CreateConnect.prototype.cancel = function () {
	this.isHandle = false;
	this.execution = 0;
};

/**
 * @description 取消扫描
 */
// CreateConnect.prototype.cancel = function(){
//   this.isHandle = false;
// }

/**
 * @description 发送请求
 */
CreateConnect.prototype.send = function () {
	var protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
	this.connect = new WebSocket(protocol + location.host + '/ws_project');
};

/**
 * @description 关闭ws链接
 */
CreateConnect.prototype.close = function () {
	this.connect.close();
	this.connectStatus = false;
	this.cancel();
};

$('#cutMode .tabs-item[data-type="' + (bt.get_cookie('site_model') || 'php') + '"]').trigger('click');
