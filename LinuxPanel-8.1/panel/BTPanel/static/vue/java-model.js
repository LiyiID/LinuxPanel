dynamic.delay('java-model', () => {
    site.javaModle = new Vue({
        el: '#bt_java_table',
        delimiters: ['${', '}'],
        data: {
            serachValue: '',
            pageInfo: {
                page: 1,
                tools: 0,
                limit: 10,
            },
            projectList: [], //产品列表
            tomcatInfo: {}, // tomcat 配置
            tomcatList: [], // tomcat 列表
            tomcatAllList: [], // 所有tomcat 列表
            jdkInfo: [], // jdk 配置
            jdkList: [], //jdk 数据
            projectFormInfo: {
                project_type: 3, // 项目列表
                project_name: '', // 项目名称，仅项目为3
                domain: '', // 仅项目类型为独立项目和内置项目，需要传递域名作为项目名称
                domains: '', // 项目名称，仅项目为3
                project_path: '/www/wwwroot', // 项目路径，仅项目类型为独立项目和内置项目
                project_jdk: '', // 项目JDK，仅项目为3
                project_jar: '/www/wwwroot', // 项目JDR路径，仅项目为3
                project_cmd: '', // 项目执行命令，仅项目为3
                run_user: 'www', // 项目执行用户，仅项目为3
                tomcat_version: '', // tomcat版本,仅项目类型为独立项目和内置项目
                project_ps: '', // 描述字段
                port: '', //项目端口
								release_firewall:false,
								jmx_status:false, //是否开启jmx
								jmx_port:'', //jmx端口
                debug: false,
                is_separation: 0,
                api_url: '',
                host_url: '',
                static_path: '',
            },
            projectFormBackup: false, //副本字段
            addJavaView: false, //添加java项目
            jdkManageView: false, // jdk管理视图
            jdkPathValue: '',
            tomcatManageView: false, // tomcat管理 视图
            modifyTomcatPort: false, // 修改tomcat端口
            modifyTomcatJdk: false, // 修改tomcatJDK
            tomcatPort: '', // tomcat 端口
            tomcatJdk: '', // tomcat JDK
            tomcatStartShell: '',
            tomcatVersion: '', // tomcat 版本
            projectSettings: false, // 设置项目视图
            projectInfo: {
                project_config: { java_type: '' },
            }, // 项目信息
            project_settings_model: 'projectInformation', //项目模块
            tomcatAceConfig: null,
            defalutTabView: false,
            updateView: true,
            initialization: false,
						scrollTop: 0,
            javaEnvName: 'JDKConfig',
            javaEnvShow: false,
            javaJDKInstall: '安装'
        },
        methods: {
            /**
             * @description 获取环境信息，jdk和tomcat
             */
            async get_system_info(callback) {
                try {
                    let rdata = await this.$http({ get_system_info: '获取JAVA环境信息' });
                    let info = rdata.msg,
                        isJdk = false,
                        isTomcat = false;
                    if (callback)
                        callback({
                            jdk: this.get_local_jdk_version(info.jdk_info),
                            tomcat: this.get_tomcat_version(info.tomcat_info),
                        });
                } catch (e) {
                    this.$msg(e);
                }
            },

            /**
             * @description 获取JDK信息
             * @param request {Boolean} 请求数据，默认为空
             * @return {Promise,Boolean}
             */
            get_local_jdk_version(request) {
							if (request) {
									this.jdkList = [];
									this.jdkInfo = request;
									for (let i = 0; i < request.length; i++) {
											const item = request[i];
											if(item.operation != 0){
													this.jdkList.push({
															title: item.name + ' [' + item.path + ']',
															value: item.path,
											});
									}
									}
									return request.length > 0;
							}
							return new Promise(async resolve => {
									try {
											let rdata = await this.$http({
													get_local_jdk_version: '获取本地JDK信息',
											});
											this.get_local_jdk_version(rdata);
											resolve(rdata);
									} catch (e) {
											this.$msg(e);
									}
							});
						},

            /**
             * @description 获取Tomcat列表
             * @param request {Boolean,undefined} 请求数据，默认为空
             * @return {Promise,Boolean}
             */
            get_tomcat_version(request) {
                if (request) {
                    this.tomcatList = [];
                    this.tomcatInfo = request;
                    let isTomcat = false;
                    for (const key in request) {
                        const item = request[key];
                        item.version = parseInt(key.match(/([0-9])+$/)[0]);
                        this.tomcatAllList.push({ title: key, value: item.version });
                        if (!item.status) continue;
                        this.tomcatList.push({ title: key, value: item.version });
                        if (item.info.status) {
                            isTomcat = true;
                        }
                    }
                    return isTomcat;
                }
                return new Promise(async resolve => {
                    let rdata = await this.$http({
                        get_tomcat_version: '获取tomcat信息',
                    });
                    this.get_tomcat_version(rdata);
                    resolve(rdata);
                });
            },

            /**
             * @description 获取CPU信息
             * @param {Object} row 行内数据
             * @return {string}
             */
            get_cpu_info(row) {
                if (this.$isType(row['load_info']) !== 'object') return '--';
                let tools = 0;
                for (const key in row.load_info) {
                    let item = row.load_info[key];
                    tools += item['cpu_percent'];
                }
                return tools.toFixed(2) + '%';
            },

            /**
             * @description 获取项目类型
             * @param {Object} row 行内数据
             * @return {string}
             */
            get_project_type(row) {
                let project_config = row.project_config;
                switch (project_config.java_type) {
                    case 'neizhi':
                        return '内置项目 [Tomcat' + row.project_config.tomcat_version + ']';
                    case 'duli':
                        return '独立项目 [Tomcat' + row.project_config.tomcat_version + ']';
                    case 'springboot':
                        return 'SpringBoot';
                }
            },

            /**
             * @description 获取证书信息
             * @param {Object} row 行内数据
             * @return {string}
             */
            get_ssl_info(row) {
                let ssl = row.ssl,
                    info = '',
                    list = [
                        ['issuer', '证书品牌'],
                        ['notAfter', '到期日期'],
                        ['notBefore', '申请日期'],
                        ['dns', '可用域名'],
                    ];
                for (let i = 0; i < list.length; i++) {
                    let item = ssl[list[i][0]];
                    info += list[i][1] + ':' + item + (list.length - 1 !== i ? '\n' : '');
                }
                return info;
            },

            /**
             * @description 获取内存信息
             * @param {Object} row 行内数据
             * @return {string}
             */
            get_memory_info(row) {
                if (this.$isType(row['load_info']) !== 'object') return '--';
                let tools = 0;
                for (const key in row.load_info) {
                    let item = row.load_info[key];
                    tools += item['memory_used'];
                }
                return bt.format_size(tools);
            },

            /**
             * @description 获取端口信息
             * @param {Object} row 行内数据
             * @return {string}
             */
            get_listen_info(row) {
                return row.listen.length ? row.listen.join(',') : '--';
            },

            /**
             * @description 打开文件路径
             * @param {string} path 文件路径
             */
            open_file_path(path) {
                openPath(path);
            },

            /**
             * @description 修改项目备注
             * @param {Object} row 行内数据
             * @param {Number} index 下标
             * @return {boolean}
             */
            editor_project_ps(e, row) {
                if (!e.target) return;
                const newValue = e.target.value;
                if (row.ps === newValue) return;
                bt.pub.set_data_ps(
                    { id: row.id, table: 'sites', ps: newValue },
                    res => {
                        if (res.status) row.ps = newValue;
                        this.$msg(res);
                    }
                );
            },

            enter_editor_project_ps(e) {
                if (!e.target) return;
                if (e.keyCode != 13) return;
                e.target.blur();
            },

            /**
             * @description 切换设置状态
             * @param {Object} row 行内数据
             * @return void
             */
            async switch_operation_state(row, index) {
                try {
                    let title = `${row.run ? '停用' : '启动'}项目`,
                        information = row.run
                            ? '停用[' +
                            row.name +
                            '] 项目，停用后将无法访问该项目，您真的要停用这个项目吗？'
                            : '即将启动[' + row.name + ']项目，是否继续操作？',
                        param = {};
                    param[row.run ? 'stop_project' : 'start_project'] = title;
                    await this.$confirm({ title: title, msg: information });
                    let rdata = await this.$http(param, { project_name: row.name });
                    await this.get_project_list();
                    this.$msg(rdata);
                } catch (err) {}
            },

            /**
             * @description 删除项目信息
             * @param {Object} row 行内数据
             * @return void
             */
            async delete_project_find(row) {
                try {
                    await this.$confirm({
                        title: '删除项目',
                        msg: `您正在删除Java项目-[ ${row.name} ]，继续吗？`,
                    });
                    let rdata = await this.$http(
                        { remove_project: '删除Java项目' },
                        { project_name: row.name }
                    );
                    await this.get_project_list();
                    this.$msg(rdata);
                } catch (e) {
                    this.$msg(e);
                }
            },

            /**
             * @description 修复项目
             * @param row 行内数据
             */
            async repair_project_find(row) {
                let is_hide = false;
                this.tomcatList.forEach((item, index) => {
                    if (item.value === parseInt(row.project_config.tomcat_version))
                        is_hide = true;
                });
                if (!is_hide) {
                    await this.tomcat_manage_view();
                    this.$warning('当前Tomcat版本未安装，请安装后重试');
                    return false;
                }
                await this.$confirm({
                    title: '修复项目',
                    msg: `您正在修复Java项目-[ ${row.name} ]，继续吗？`,
                });
                try {
                    let rdata = await this.$http(
                        { fix_project: '修复Java项目' },
                        { project_name: row.name }
                    );
                    await this.get_project_list();
                    this.$msg(rdata);
                } catch (e) {
                    this.$msg(e);
                }
            },

            /**
             * @description 添加java项目
             */
            add_java_project: function () {
                if (this.jdkList.length > 0)
                    this.projectFormInfo.project_jdk = this.jdkList[0].value;
                this.addJavaView = true;
            },

            /**
             * @description 关闭java项目
             */
            close_add_java_project: function () {
                this.projectFormInfo = Object.assign({}, this.projectFormBackup);
            },

            /**
             * @description 搜索项目信息
             */
            async search_project_info() {
                let load = this.$load('获取项目列表，请稍候...');
                await this.get_project_list({ search: this.serachValue });
                load.close();
            },

            /**
             * @description 获取项目列表
             * @param  {Object} param 请求参数
             * @return {Promise}
             */
            get_project_list(param) {
                let load = null;
                if (this.$isType(param) === 'number') {
                    this.pageInfo.p = param;
                    load = this.$load('获取项目列表，请稍候...');
                }
								this.$refs['java_table'].clear_batch_val()
                return new Promise(async (resolve, reject) => {
                    try {
                        let rdata = await this.$http(
                            { get_project_list: false },
                            Object.assign(
                                {
                                    p: this.pageInfo.p || 1,
                                    limit: this.pageInfo.limit || 10,
                                },
                                param
                            )
                        );
                        if (load) load.close();
                        const { data } = rdata;
                        for (let i = 0; i < data.length; i++) {
                            const { project_config } = data[i];
                            if (project_config.project_cmd) {
                                project_config.project_jdk =
                                    project_config.project_cmd.split(' ')[0];
                            }
                        }
                        this.projectList = data;
                        let pageInfo = this.get_table_page_info(rdata.page);
                        this.pageInfo = Object.assign(this.pageInfo, pageInfo);
                        resolve(rdata);
                    } catch (e) {
                        this.$msg(e);
                    }
                });
            },
            /**
             * @description 获取表格分页信息
             * @param name {string} 需要选择的名称
             * @param type {string} 选择类型,默认为目录
             */
            get_table_page_info(info) {
                let reg = info.match(
                    /.+class='Pcurrent'>([0-9]+)<\/span>.+共([0-9]+)条.+/
                );
                return {
                    page: parseInt(reg[1]),
                    tools: parseInt(reg[2]),
                };
            },

            /**
             * @description 选择文件路径
             * @param name {string} 需要选择的名称
             * @param type {string} 选择类型,默认为目录
             */
            select_path(name, type) {
                try {
                    bt.select_path('select_path', type || 'dir', async path => {
                        switch (name) {
                            case 'add_load_jdk':
                                this.jdkPathValue = path;
                                break;
                            case 'tomcat_jsk_path':
                                this.tomcatJdk = path;
                                break;
                        }
                    });
                } catch (e) {
                    this.$error(e);
                }
            },

            /**
             * @description 创建JAVA项目
             * @param {object} param 配置参数
             * @return {Promise}
             */
            create_java_project(param) {
                return new Promise((resolve, reject) => {
                    this.$tryCatch(async () => {
                        try {
                            let rdata = await this.$http(
                                { create_project: '创建JAVA项目' },
                                param
                            );
                            this.$msg(rdata);
                            resolve(rdata);
                        } catch (e) {
                            this.$msg(e);
                        }
                    });
                });
            },

            /**
             * @description 提交和验证表单
             */
            async submit_form_info() {
                let form = this.projectFormInfo,
                    newForm = {
                        project_type: form.project_type,
                        project_ps: form.project_ps,
                    };
                if (newForm.project_type > 1) {
                    newForm = Object.assign(newForm, {
                        port: form.port,
                        release_firewall:form.release_firewall?true:false,
                        auth: form.auth ? 1 : 0,
                    });
                }
                if (newForm.project_type < 3) {
                    newForm = Object.assign(newForm, {
                        domain: form.domain,
                        tomcat_version: form.tomcat_version,
                        project_path: form.project_path,
                    });
                }
                if (newForm.project_type === 3) {
                    newForm = Object.assign(newForm, {
                        project_type: form.project_type,
                        project_name: form.project_name,
                        domains: form.domains,
                        project_jdk: form.project_jdk,
                        project_jar: form.project_jar,
                        project_cmd: form.project_cmd,
												jmx_status:form.jmx_status,
												jmx_port:form.jmx_port,
                        run_user: form.run_user,
												release_firewall:form.release_firewall?true:false,
                        is_separation: form.is_separation,
                        api_url: form.api_url,
                        host_url: form.host_url,
                        static_path: form.static_path,
                    });
                }
                if ('domain' in newForm && newForm.domain === '') {
                    this.$error('项目域名不能为空');
                    return false;
                } else if ('project_name' in newForm && newForm.project_name === '') {
                    this.$error('项目名称不能为空');
                    return false;
                } else if ('project_path' in newForm && newForm.project_path === '') {
                    this.$error('项目路径不能为空');
                    return false;
                } else if ('port' in newForm && newForm.port === '') {
                    this.$error('项目端口不能为空');
                    return false;
                } else if ('project_jar' in newForm && newForm.project_jar === '') {
                    this.$error('请选择项目jdr文件路径');
                    return false;
                } else if ('port' in newForm && newForm.port === '') {
                    this.$error('项目端口不能为空');
                    return false;
                } else if ('port' in newForm && !bt.check_port(newForm.port)) {
                    this.$error('项目端口号应为[0-65535]');
                    return false;
                } else if ('project_cmd' in newForm && newForm.project_cmd === '') {
                    this.$error('项目执行命令不能为空');
                    return false;
                } else if ('project_cmd' in newForm && newForm.domains !== '') {
                    let domain_list = bt.check_domain_list(newForm.domains);
                    if (!domain_list) return false;
                    newForm.domains = domain_list;
                } else if ('is_separation' in newForm && newForm.is_separation == 1) {
                    const { api_url, host_url, static_path } = newForm;
                    if (api_url === '') {
                        this.$error('后端目录不能为空');
                        return false;
                    }
                    if (host_url === '') {
                        this.$error('目标url不能为空');
                        return false;
                    }
                    if (static_path === '') {
                        this.$error('静态目录不能为空');
                        return false;
                    }
                }
                try {
                    let rdata = await this.create_java_project(newForm);
                    this.addJavaView = false;
                    await this.get_project_list();
                    this.$msg(rdata);
                } catch (e) {
                    this.$msg(e);
                }
            },
            // 获取项目信息
            async get_project_info(name) {
                return await this.$http(
                    { get_project_info: '获取项目数据' },
                    { project_name: name }
                );
            },

            /**
             * @description 自定义jdk视图
             */
            jdk_manage_view(show=false) {
							this.get_local_jdk_version();
						},

            /**
             * @description 添加jdk信息
             */
            async add_jdk_info(index) {
							try {
									let rdata = await this.$http(
											{ add_local_jdk: '添加JDK信息' },
											{ jdk: this.jdkPathValue }
									);
									layer.close(index);
									this.jdkPathValue = '';
									await this.update_jdk()
									this.$msg(rdata);
							} catch (e) {
									this.$msg(e);
							}
						},

						async update_jdk(item) {
								await this.get_local_jdk_version();
						},

            /**
             * @description 删除jdk信息
             * @param item {object} 选择删除的数据
             */
            async delete_jdk_info(item) {
                await this.$confirm({
                    title: '删除JDK信息',
                    msg: '是否删除【 ' + item.name + ' 】，<span style="color: red">此操作将会删除该JDK目录下的所有文件，请确保该JDK未被使用</span>，是否继续操作？',
                });
                try {
                    let rdata = await this.$http(
                        { del_local_jdk: '删除JDK信息' },
                        { jdk: item.path }
                    );
                    await this.get_local_jdk_version();
                    this.$msg(rdata);
                } catch (e) {
                    this.$msg(e);
                }
            },
						async set_default_jdk(item) {
							return new Promise((resolve, reject)=>{
									bt_tools.send({url:'/project/java/install_jdk_new',data:item},function(res){
											resolve(res)
									},reject)
							})
						},
            /**
             * @description tomcat版本视图
             */
						async tomcat_manage_view(addJavaView=false) {
							this.javaEnvShow = true
							this.javaEnvName = 'tomcatconfig'
							await this.get_tomcat_version();
						},
            /**
             * @description 安装tomcat指定版本
             * @param {Number} version 当前的版本信息
             * @param {String} type install == 安装(默认安装)  uninstall == 卸载
             */
            async install_tomcat_version(version, type) {
                if (!type) type = 'install';
                let title =
                    (type === 'install' ? '安装Tomcat' : '卸载Tomcat') + version;
								var content = (type === 'install' ? '安装Tomcat' : '卸载Tomcat') + version;
								if (type === 'uninstall') {
									try {
											let site = await this.$http(
													{ get_tomcat_domain: '检查Tomcat下绑定的站点' },
													{ version: version }
											);
											if (site.length > 0){
													content =
													'卸载Tomcat，当前Tomcat下包含多个站点【' +
													site.join('、') +
													'】，删除后将导致项目无法正常运行';
											}

									} catch (e) {
											this.$msg(e);
									}
								}
								await this.$confirm({
									title: title,
									msg: '是否' + content + '，继续操作吗？',
								});
                var layerIndex = -1;
                if (type !== 'uninstall') {
                    this.$shell({
                        title: '正在' + title + '，请稍候...',
                        shell: 'tail -f /tmp/panelShell2.pl',
                        area: ['500px', '300px'],
                        success: async () => {
                            await this.get_tomcat_version();
                            this.$success('安装成功');
                        },
                        callback(index) {
                            layerIndex = index;
                        },
                    });
                }
                try {
                    let rdata = await this.$http(
                        {
                            install_tomcat:
                                type === 'uninstall' ? '卸载Tomcat' + version : false,
                        },
                        { version: version, type }
                    );
                    await this.get_tomcat_version();
                    this.$msg(rdata);
                } catch (e) {
                    layer.close(layerIndex);
                    this.$msg(e);
                }
            },

            /**
             * @description 设置tomcat服务状态
             * @param {Number} version 当前的版本信息
             * @param {String} type 操作方式 start启动(默认启动) stop 关闭 restart 重启
             */
            async set_tomcat_service(version, type) {
                try {
                    if (!type) type = 'start';
                    let rdata = await this.$http(
                        {
                            start_tomcat:
                                (type === 'start'
                                    ? '启动Tomcat'
                                    : type === 'stop'
                                        ? '停止Tomcat'
                                        : '重载Tomcat') +
                                version +
                                '服务',
                        },
                        {
                            version: version,
                            type,
                        }
                    );
                    await this.get_tomcat_version();
                    this.$msg(rdata);
                } catch (e) {
                    this.$msg(e);
                }
            },
            /**
             * @description 打开修改tomcat端口视图
             * @param version {Number} 版本号
             * @param port {Number} 端口号
             */
            open_tomcat_port_view(version, port) {
                this.tomcatPort = port;
                this.tomcatVersion = version;
                this.modifyTomcatPort = true;
            },
            /**
             * @description 打开修改tomcat端口视图
             * @param version {String} 版本号
             * @param jdk {String} jdk路径
             */
            open_tomcat_jdk_view(StartShell, jdk) {
                this.tomcatStartShell = StartShell;
                this.tomcatJdk = jdk;
                this.modifyTomcatJdk = true;
            },
            /**
             * @description 修改tomcat端口
             */
            async modify_tomcat_port() {
                if (this.tomcatPort === '') {
                    this.$error('tomcat 端口号不能为空');
                    return false;
                }
                try {
                    let rdata = await this.$http(
                        { replce_tomcat_port: '修改端口' },
                        {
                            port: this.tomcatPort,
                            version: this.tomcatVersion,
                        }
                    );
                    await this.get_tomcat_version();
                    this.$msg(rdata);
                } catch (e) {
                    this.$msg(e);
                }
            },
            /**
             * @description 修改tomcat JDK路径
             */
            async modify_tomcat_jdk() {
                if (this.tomcatJdk === '') {
                    this.$error('tomcat JDK地址不能为空');
                    return false;
                }
                try {
                    let rdata = await this.$http(
                        { replce_tomcat_port: '修改JDK' },
                        {
                            tomcat_start: this.tomcatStartShell,
                            jdk_path: this.tomcatJdk,
                        }
                    );
                    await this.get_tomcat_version();
                    this.$msg(rdata);
                } catch (e) {
                    this.$msg(e);
                }
            },

            /**
             * @description 项目设置视图
             */
            project_settings_view(item) {
                this.projectSettings = true;
                this.projectInfo = item;
            },
            /**
             * @description 关闭项目设置视图
             */
            async close_project_settings() {
                this.project_settings_model = 'projectInformation';
                this.close_add_java_project();
                this.defalutTabView = false;
                await this.get_project_list();
            },
						close_java_evn(){
							this.javaEnvShow = false
							this.javaEnvName = 'JDKConfig'
						},

            /**
             * @description 切换项目设置状态
             */
            cut_project_settings_model(config, row) {
                this.defalutTabView = false;
                this.$nextTick(async () => {
                    let webView = $('#webedit-con');
                    webView.empty();
                    switch (config.name) {
                        case 'pseudoStatic':
                            if (!row.project_config.bind_extranet) {
                                this.defalutTabView = true;
                                return false;
                            }
                            site.edit.get_rewrite_list(
                                {
                                    name: 'java_' + row.name,
                                },
                                function () {
                                    $('.webedit-box .line:first').remove();
                                    $('[name=btn_save_to]').remove();
                                    $('.webedit-box .help-info-text li:first').remove();
                                }
                            );
                            break;
                        case 'configurationFile':
                            if (!row.project_config.bind_extranet) {
                                this.defalutTabView = true;
                                return false;
                            }
                            site.edit.set_config({
                                name: 'java_' + row.name,
                            });
                            break;
                        case 'ssl':
                            if (!row.project_config.bind_extranet) {
                                this.defalutTabView = true;
                                return false;
                            }
                            site.set_ssl({
                                name: row.name,
                                ele: webView,
                                id: row.id,
                            });
                            site.ssl.reload();
                            break;
                        case 'tomcatConfig':
                            this.tomcatAceConfig = bt.aceEditor({
                                el: 'tomcatConfig',
                                path: row.project_config.server_xml,
                                mode: 'xml',
                            });
                            break;
                        case 'loadState':
                            if (!row.run) {
                                this.defalutTabView = true;
                                return false;
                            }
                            try {
                                let rdata = await this.get_project_info(row.name);
                                this.projectInfo = rdata;
                                site.node.reander_node_service_condition(webView, rdata);
                            } catch (e) {
                                this.$msg(e);
                            }
                            break;
												case 'performanceMonitor':
														site.edit.get_performance_monitor(row)
														break
                        case 'siteLog':
                            if (!row.project_config.bind_extranet) {
                                this.defalutTabView = true;
                                return false;
                            }
                            site.edit.get_site_logs({ name: row.name });
                            break;
                        default:
                            break;
                    }
                });
            },
            /**
             * @description 切换项目tabs
             * @param {string} name 切换的tabs名称
             */
            cut_project_tabs(name, row) {
                this.project_settings_model = name;
                if (this.$isType(row) !== 'undefined') {
                    this.projectInfo = row;
                    this.project_settings_view(row);
                }
                this.$nextTick(() => {
                    this.cut_project_settings_model({ name: name }, this.projectInfo);
                });
            },

            /**
             * @description 保存Tomcat配置文件
             */
            save_tomcat_config() {
                bt.saveEditor(this.tomcatAceConfig);
            },
        },
        async mounted() {
            this.pageInfo.limit = parseInt(10); // 获取分页数量
            // bt.get_cookie('page_number') ||
            this.projectFormBackup = Object.assign({}, this.projectFormInfo);
            const res = await this.get_system_info(async res => {
                if (res.jdk || res.tomcat) {
                    await this.get_project_list(); // 获取项目列表
                } else {
                    this.initialization = true;
                }
            }); // 获取系统信息
        },
    });
});
