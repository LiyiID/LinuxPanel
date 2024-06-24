$('#cronMode .tabs-item').on('click', function () {
	var that = this,
		type = $(this).data('type'),
		index = $(this).index();
	$(this).addClass('active').siblings().removeClass('active');
	$('.tab-con').find('.tab-con-block').eq(index).removeClass('hide').siblings().addClass('hide');
	$('.info-title-tips').hide();
	$('.task-orchestration').hide();
	$('.task-orchestration-title').hide();
	switch (type) {
		case 'crontab':
			crontab.init();
			break;
		case 'trigger':
			if (getCookie('ltd_end') < 0) {
				$('.task-orchestration-title').show();
				$('.info-title-tips').show();
			}else{
				$('.task-orchestration').show();
			}
		case 'script':
			bt_tools.send(
				{ url: '/crontab/script/get_script_list_by_type' },
				{},
				function (res) {
					script_type_list = res;
					if (type == 'trigger') {
						trigger.init();
					} else {
						script.init();
					}
				},
				'获取脚本信息'
			);
			break;
	}
	bt.set_cookie('crontab_model', type);
});

// var crontabNpsShow = false;
// var randomNPSTouch =Math.floor(Math.random()*(3+1))
var backupListAll = [], siteListAll = [], databaseListAll = [], allDatabases = [], allTables = [],topping_list=[],timeZone=[],regionList=[],timeZoneListObj={},localDomainList=[],
    backuptolist = [{ title: '服务器磁盘', value: 'localhost' },
      { title: '阿里云OSS', value: 'alioss' },
      { title: '腾讯云COS', value: 'txcos' },
      { title: '七牛云存储', value: 'qiniu' },
      { title: '华为云存储', value: 'obs' },
      { title: '百度云存储', value: 'bos' }];
		databaseTypeList=[{ title: 'MySQL', value: 'mysql' },
			{ title: 'MongoDB', value: 'mongodb' },
			{ title: 'Redis', value: 'redis' },
			{ title: 'PgSQL', value: 'pgsql' },]
var crontab = {
	addCrontabTable: null,
  crontabListTabel:null,
	typeTips: { site: '备份网站', database: '数据库类型', logs: '切割日志', path: '备份目录', webshell: '查杀站点' },
  crontabForm: { name: '', type: '', where1: '', hour: '', minute: '', week: '', sType: '', sBody: '', sName: '', backupTo: '', save: '', sBody: '', urladdress: '', save_local: '', notice: '', notice_channel: '' , datab_name : '',tables_name :'' },
  editForm: false,
	crontabFormConfig: [{
    label: '任务类型',
    group: {
      type: 'select',
      name: 'sType',
      width: '180px',
      value: 'toShell',
      list: [
        { title: 'Shell脚本', value: 'toShell' },
        { title: '备份网站', value: 'site' },
        { title: '备份数据库', value: 'database' },
        { title: '数据库增量备份', value: 'enterpriseBackup' },
        { title: '日志切割', value: 'logs' },
        { title: '备份目录', value: 'path' },
        { title: '木马查杀', value: 'webshell' },
        { title: '同步时间', value: 'syncTime' },
        { title: '释放内存', value: 'rememory' },
        { title: '访问URL', value: 'toUrl' }
      ],
      unit: '<span style="margin-top: 9px; display: inline-block;"><i style="color: red;font-style: initial;font-size: 12px;margin-right: 5px">*</i>任务类型包含以下部分：Shell脚本、备份网站、备份数据库、日志切割、释放内存、访问URL、备份目录、木马查杀、同步时间</span>',
      change: function (formData, element, that) {
        that.data.type = 'week'   //默认类型为每星期
        var config = crontab.crontabsType(arryCopy(crontab.crontabFormConfig), formData, that)
				if(formData.sType === 'syncTime'){
					config[8].group[1].list = timeZoneListObj[timeZone[0]];
					config[8].group[0].value = timeZone[0];
					config[8].group[1].value = timeZone[1];
					config[1].group.value='定期同步服务器时间['+ timeZone[0] + '/'+ timeZone[1] +']'
				}
        that.$again_render_form(config)
        var arry = ['site', 'database', 'logs', 'webshell', 'enterpriseBackup'];
        if (arry.indexOf(formData.sType) > -1) {
          that.$replace_render_content(3)
          setTimeout(function () {
            $('[data-name="sName"] li:eq(0)').click()
          }, 100)
        }
        if (formData.sType === 'enterpriseBackup') {
          $('.glyphicon-repeat').on('click', function () {
						that.config.form[7].group[0].value = bt.get_random(bt.get_random_num(6, 10));
						that.$local_refresh('urladdress', that.config.form[7].group[0]);
						$('input[name=urladdress]').click();
					});
					crontab.getTbList(allDatabases[0].value, function (res) {
						config[3].group[4].list = res;
						config[1].group.value = '[勿删]数据库增量备份[ ' + allDatabases[0].value + ' ]';
						that.$again_render_form(config);
						var html = '<span class="tbName" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">所有</span>';
						$('[data-name=tables_name] .bt_select_value').find('.bt_select_content').remove();
						$('[data-name=tables_name] .bt_select_value').append(html);
						$('[data-name=tables_name] .bt_select_list li').addClass('active');
						$('.glyphicon-repeat').off('click').on('click',function(){
							$('[name=urladdress]').val(bt.get_random(bt.get_random_num(6, 10)))
						})
					});
        }
        $('[title="数据库增量备份"]').html('<span style="display:flex;align-items:center">数据库增量备份<span class="new-file-icon new-ltd-icon" style="margin-left:4px"></span></span>')
				if (formData.sType === 'site' || formData.sType === 'database') {
          $('[data-name=more] ul li').addClass('active')
					//任务名称展示
					var nameForm = that.config.form[1]
						var firstTips=crontab.typeTips[formData.sType]
						if(formData.sType === 'database'){
							var typeName
							if($('select[name=db_type]').val()=='mysql') typeName='MySQL'
							if($('select[name=db_type]').val()=='mongodb') typeName='MongoDB'
							if($('select[name=db_type]').val()=='redis') typeName='Redis'
							if($('select[name=db_type]').val()=='pgsql') typeName='PgSQL'
							firstTips='备份'+ typeName +'数据库'
						}
						nameForm.group.value = firstTips + '['+ ($('select[name=more]').val()=='ALL'? '所有':'') +']'
						that.$local_refresh('name', nameForm.group)
        }
			}
    }
  }, {
    label: '任务名称',
    group: {
			type: 'text',
			name: 'name',
			width: '350px',
			placeholder: '请输入计划任务名称',
			change:function (formData,el,that) {
					if (formData.sType !== 'toUrl') {
						return;
					}
					that.isRemoveInput = true;
			}
		},
  }, {
    label: '执行周期',
    group: [{
      type: 'select',
      name: 'type',
      value: 'week',
      list: [
        { title: '每天', value: 'day' },
        { title: 'N天', value: 'day-n' },
        { title: '每小时', value: 'hour' },
        { title: 'N小时', value: 'hour-n' },
        { title: 'N分钟', value: 'minute-n' },
        { title: '每星期', value: 'week' },
        { title: '每月', value: 'month' }
      ],
      change: function (formData, element, that) {
        crontab.crontabType(that.config.form, formData)
        that.$replace_render_content(2)
      }
    }, {
      type: 'select',
      name: 'week',
      value: '1',
      list: [
        { title: '周一', value: '1' },
        { title: '周二', value: '2' },
        { title: '周三', value: '3' },
        { title: '周四', value: '4' },
        { title: '周五', value: '5' },
        { title: '周六', value: '6' },
        { title: '周日', value: '0' }
      ]
    }, {
      type: 'number',
      display: false,
      name: 'where1',
      'class': 'group',
      width: '70px',
      value: '3',
      unit: '日',
      min: 1,
      max: 31
    }, {
      type: 'number',
      name: 'hour',
      'class': 'group',
      width: '70px',
      value: '1',
      unit: '小时',
      min: 0,
      max: 23
    }, {
      type: 'number',
      name: 'minute',
      'class': 'group',
      width: '70px',
      min: 0,
      max: 59,
      value: '30',
      unit: '分钟'
    }]
  }, {
    label: '备份网站',
    display: false,
    group: [{
			display: false,
			type: 'select',
			name: 'db_type',
			width: '100px',
			list: databaseTypeList,
			change: function (formData, element, that) {
				// 选中下拉项后
				bt_tools.send({
					url: '/crontab?action=GetDatabases',
					data: { db_type: formData.db_type }
				}, function (res) {
					var list = [{ title: '所有', value: 'ALL' }];
					if(formData.db_type=='redis') list=[]
					for (var i = 0; i < res.length; i++) {
						var item = res[i]
						var filterXss = $('<div></div>').text(item.ps)
						list.push({ title: item.name+'['+ filterXss.html() +']', value: item.name });
					}
					if (list.length === 1 && formData.db_type!='redis') list = []
					databaseListAll = list
					that.config.form[3].group[1].list=databaseListAll
					delete that.config.form[1].group.value
					if(formData.db_type=='redis'){
						that.config.form[3].group[1].value=['本地数据库']
					}
					if(list.length > 1 && formData.db_type!='redis'){
						that.config.form[3].group[1].value=['ALL']
					}
					that.$replace_render_content(1)
					that.$replace_render_content(3)
					setTimeout(function(){
						if (formData.sType === 'site' || formData.sType === 'database') {

							$('[data-name=more] ul li').addClass('active')
							//任务名称展示
							var nameForm = that.config.form[1]
							var firstTips=crontab.typeTips[formData.sType]
							if(formData.sType === 'database'){
								var typeName
								if(formData.db_type=='mysql') typeName='MySQL'
								if(formData.db_type=='mongodb') typeName='MongoDB'
								if(formData.db_type=='redis') typeName='Redis'
								if(formData.db_type=='pgsql') typeName='PgSQL'
								firstTips='备份'+typeName+'数据库'
							}
							if($('select[name=more]').val()!=null){
								nameForm.group.value = firstTips + '['+ ($('.bt-warp select[name=more]').val()=='ALL'? '所有':$('select[name=more]').val()) +']'
							}else{
								nameForm.group.value = firstTips + '[]'
							}
							that.$local_refresh('name', nameForm.group)
						}
					},100)
				})
			}
	},{
      type: 'select',
      name: 'sName',
      width: '150px',
			placeholder:'',
      list: siteListAll,
      change: function (formData, element, that) {
				if(formData.sType === 'site' || formData.sType === 'database'){
						$('.moreTip').remove()
							if($(this).attr('title')=='所有'){
								//点击所有
								if($(this).hasClass('active')){
									$(this).siblings().addClass('active')
									element.more.val(['ALL'])
								}else{
									$(this).siblings().click()
									element.more.val([])
								}
							}else{
								if($(this).hasClass('active')){
									//其它选项选中
									var isALL=true
									$(this).siblings().not(':first').each(function(i){
										if(!($(this).hasClass('active'))){
											isALL=false
											return
										}
									})
									if(isALL){
										$($(this).siblings()[0]).click()
									}
								}else{
									//其它选项取消
									$($(this).siblings()[0]).removeClass('active')
									element.more.val(element.more.val()?element.more.val().filter(function(item) {
										return item !== 'ALL';
									}):null);
									if($(this).parent().prev().find('.bt_select_content').first().children().first().html()=='所有'){
										$(this).parent().prev().find('.bt_select_content').first().remove()
									}
								}
							}
							//选择展示
					var span = '<span class="moreTip">...等' + (element.more.val() ? element.more.val().length : '') + '个' + (formData.sType == 'site' ? '网站' : '数据库') + '</span>';
					$(this).parent().prev().append(span)
					$('.moreTip').hide()
					if(element.more.val()?(element.more.val().indexOf('ALL') != -1):null){
						$(this).parent().prev().find('.bt_select_content').slice(1).remove()
					$('.moreTip').hide()
					}else if(element.more.val()==null){
					$('.moreTip').hide()
					}
					if($(this).parent().prev().find('.bt_select_content').length>1){
						//最多显示2行
						$(this).parent().prev().find('.bt_select_content').slice(1).hide()
						$(this).parents('.line').children().first().css('max-height','67px')
						$('.moreTip').show()
					}
					$(this).parents('.line').children().first().css({'line-height':$(this).parent().parent().height()+'px','height':$(this).parent().parent().height()+'px'})
					$(this).parent().css('top',$(this).parent().parent().height()+14+'px')
					$('.bt_select_list_arrow_fff').css('top',$(this).parent().parent().height()+'px')
					$('.bt_select_list_arrow').css('top',$(this).parent().parent().height()-1+'px')
					var selectTip=[]
					$.each(element.more.val(),function(i,n){
						if(n=='ALL') {
							selectTip.push('所有'+(formData.sType=='site'? '网站':'数据库'))
						}else{
							selectTip.push(n)
						}
					})
					$(this).parent().parent().attr('title',selectTip.join('\n'))
				}
				//任务名称展示
        var nameForm = that.config.form[1]
        if (formData.sType === 'enterpriseBackup') {
            crontab.getAllTables(formData.datab_name,function(res) {
            that.config.form[3].group[4].list = res
            that.config.form[3].group[4].display = formData.sName === 'tables'
            that.$replace_render_content(3)
            var select_data = (formData.sName === 'databases' ? formData.datab_name : (formData.datab_name+'---'+ res[0].value))
            nameForm.group.value = '[勿删]数据库增量备份[ ' + (formData.sName === 'databases' ? formData.datab_name : (formData.datab_name+'---'+ res[0].value)) + ' ]'
            if(!formData.datab_name) nameForm.group.value = '[勿删]数据库增量备份'
            that.$local_refresh('name', nameForm.group)
          })
        }else if(formData.sType === 'site' || formData.sType === 'database'){
					var firstTips=crontab.typeTips[formData.sType]
					if(formData.sType === 'database'){
						var typeName
						if(formData.db_type=='mysql') typeName='MySQL'
						if(formData.db_type=='mongodb') typeName='MongoDB'
						if(formData.db_type=='redis') typeName='Redis'
						if(formData.db_type=='pgsql') typeName='PgSQL'
						firstTips='备份'+ typeName +'数据库'
					}
					if(element.more.val()){
						if (element.more.val()[0] === 'ALL') {
							nameForm.group.value = firstTips + '[ 所有 ]';
						} else {
							var selectTip = element.more.val().slice(0, 1).join('，');
							if (element.more.val().length > 1) {
								selectTip += '......等' + element.more.val().length + '个' + (formData.sType == 'site' ? '网站' : '数据库');
							}
							nameForm.group.value = firstTips + '[ ' + selectTip + ' ]';
						}
					}else{
						nameForm.group.value = firstTips + '[]'
					}
				}else{
          nameForm.group.value = crontab.typeTips[formData.sType] + '[ ' + (formData.sName === 'ALL' ? '所有' : formData.sName) + ' ]'
        }
        that.$local_refresh('name', nameForm.group)
      }
    }, {
      type: 'text',
      width: '200px',
      name: 'path',
      display: false,
      icon: {
        type: 'glyphicon-folder-open',
        event: function (formData, element, that) {
          $("#bt_select").one('click', function () {
            that.config.form[1].group.value = '备份目录[' + element['path'].val() + ']'
            that.$local_refresh('name', that.config.form[1].group)
          })
        }
      },
      value: bt.get_cookie('sites_path') ? bt.get_cookie('sites_path') : '/www/wwwroot',
      placeholder: '请选择文件目录'
    },{
      label: '数据库',
      display: false,
      type: 'select',
      name: 'datab_name',
      width: '150px',
      list: allDatabases,
      change: function (formData, element, that) {
        var nameForm = that.config.form[1]
        crontab.getTbList(formData.datab_name, function (res) {
					that.config.form[3].group[4].list = res
          that.$replace_render_content(3)
          var select_data = (formData.sName === 'databases' ? formData.datab_name : formData.datab_name+'---'+res[0].value)
					nameForm.group.value = '[勿删]数据库增量备份[ ' + formData.datab_name + ' ]';
					that.$local_refresh('name', nameForm.group);
					var html = '<span class="tbName" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">所有</span>';
					$('[data-name=tables_name] .bt_select_value').find('.bt_select_content').remove();
					$('[data-name=tables_name] .bt_select_value').append(html);
					$('[data-name=tables_name] .bt_select_list li').addClass('active');
				});
      }
    },{
      type: 'multipleSelect',
      display: false,
      label: '表',
      name: 'tables_name',
      width: '390px',
      list: allTables,
			value: [''],
      change: function (formData, element, that) {
				if (formData.sType === 'enterpriseBackup') {
					var li = $(this);
					var con = $('[data-name=tables_name] .bt_select_value');
					var value = $('select[name=tables_name]').val();
					if (!value) {
						layer.msg('至少选择1个！');
						var oldValue = li.attr('title').split('[')[0];
						value = [oldValue];
						$('select[name=tables_name]').val([oldValue]);
						li.addClass('active');
					}
					if (li.attr('title') == '所有') {
						//点击所有
						if (li.hasClass('active')) {
							li.siblings().addClass('active');
							$('select[name=tables_name]').val(['']);
							value = ['所有'];
						} else {
							li.siblings().removeClass('active');
							$('select[name=tables_name]').val([]);
							value = ['请选择表'];
				}
					} else {
						if (li.hasClass('active')) {
							//其它选项选中
							var isALL = true;
							li.siblings()
								.not(':first')
								.each(function (i) {
									if (!$(this).hasClass('active')) {
										isALL = false;
										return;
									}
								});
							if (isALL) {
								$(li.siblings()[0]).addClass('active');
								value = ['所有'];
								$('select[name=tables_name]').val(['']);
							}
						} else {
							//其它选项取消
							$(li.siblings()[0]).removeClass('active');
							$('select[name=tables_name]').val(
								$('select[name=tables_name]').val().filter(function(item){return item !== ''})
							);
							value = $('select[name=tables_name]').val();
						}
					}
					$('.tbName').remove();
					$('.moreTips').remove();
					con.find('.bt_select_content_def').remove();
					var html = '<span class="tbName" style="width:280px;white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">' + value.join(',') + '</span>';
					var more = '<span class="moreTips">...等' + value.length + '个表</span>';
					con.find('.bt_select_content').remove();
					con.append(html);
					if (value.length > 3) {
						con.append(more);
					}
					con.attr('title', value.join(','));
					con.parents('.info-r').siblings('.tname').css({ height: '35px', 'line-height': '35px' });
					con.siblings('.bt_select_list').css('top', '47px');
					con.siblings('.bt_select_list_arrow').css('top', '31px');
					con.siblings('.bt_select_list_arrow_fff').css('top', '32px');
					//任务名称展示
					var nameForm = that.config.form[1]
					var tables_name=$('[name=tables_name]').val()
					if(tables_name){
						var name = tables_name[0]
						if(name == '') name = '所有'
						nameForm.group.value = '[勿删]数据库增量备份[ ' + (formData.sName === 'databases' ? formData.datab_name : (formData.datab_name+'---'+ name)) + ' ]'
					}else{
						nameForm.group.value = '[勿删]数据库增量备份[ ' + (formData.sName === 'databases' ? formData.datab_name : (formData.datab_name)) + ' ]'
					}
							if(!formData.datab_name) nameForm.group.value = '[勿删]数据库增量备份'
							that.$local_refresh('name', nameForm.group)
				}
      }
    } ,{
      type: 'select',
      name: 'backupTo',
      label: '备份到',
      width: '150px',
      placeholder: '无存储信息',
      value: 'localhost',
      list: backupListAll,
      change: function (formData, element, that) {
        if (that.data.sType !== 'enterpriseBackup' && formData.sType !== 'enterpriseBackup' && that.data.sType !== 'mysql_increment_backup' && formData.sType !== 'mysql_increment_backup') {
          that.config.form[3].group[5].value = formData.backupTo;
          that.config.form[3].group[6].value = formData.save;
          that.config.form[3].group[7].display = formData.backupTo !== "localhost" ? true : false;
          switch(formData.sType){
            case 'site':
							case 'database':
								if($('select[name=more').val()!=null){
									that.config.form[3].group[0].value = formData.db_type
									that.config.form[3].group[1].value = $('select[name=more').val()
								}
								break;
							case 'path':
								that.config.form[3].group[2].value = formData.path
								break;
						}
          that.$replace_render_content(3)
					var _this=this
					setTimeout(function(){
						if($('.layui-layer-content').length==0){
							if(that.data.sType=='site' || that.data.sType == 'database'){
								//选择展示
								var multi=$('.bt_multiple_select_updown')
								var select_value=multi.children('.bt_select_value')
								var span = '<span class="moreTip">...等' + (element.more.val() ? element.more.val().length : '') + '个' + (that.data.sType == 'site' ? '网站' : '数据库') + '</span>';
								select_value.append(span)
								$('.moreTip').hide()
								if(element.more.val().indexOf('ALL') != -1){
									select_value.siblings('.bt_select_list').children().slice(1).addClass('active')
									select_value.find('.bt_select_content').slice(1).remove()
									$('.moreTip').hide()
								}else if(element.more.val()==null){
									$('.moreTip').hide()
								}
								if(select_value.find('.bt_select_content').length>1){
									//最多显示2行
									select_value.find('.bt_select_content').slice(1).hide()
									// $(_this).parents('.line').children().first().css('max-height','67px')
									$('.moreTip').show()
								}
								multi.find('ul').css('top',multi.height()+14+'px')
								$('.bt_select_list_arrow_fff').css('top',multi.height()+'px')
								$('.bt_select_list_arrow').css('top',multi.height()-1+'px')
								var selectTip=[]
								$.each(element.more.val(),function(i,n){
									if(n=='ALL') {
										selectTip.push('所有'+(that.data.sType=='site'? '网站':'数据库'))
									}else{
										selectTip.push(n)
									}
								})
								$('.bt-form').find('.line:eq(3)').find('.tname').css({'line-height':multi.parents('.info-r').height()+'px','height':multi.parents('.info-r').height()+'px'})
								multi.attr('title',selectTip.join('\n'))
							}
						}
					},10)
				}
				var addType = formData.sType;
				var editType = that.data.sType;
				if (addType === 'site' || addType === 'database' || addType === 'path' || editType === 'site' || editType === 'database' || editType === 'path') {
					// if (addType === 'site' || addType === 'database' || addType === 'path') {
					if (addType == undefined) {
						// 编辑状态
						if (formData.backupTo == 'localhost') {
							that.config.form[4].group[0].value = '';
							that.config.form[4].group[0].disabled = true;
							that.config.form[4].group[1].display = false;
						} else {
							that.config.form[4].group[0].disabled = false;
							that.config.form[4].group[0].value = '';
						}
						that.$replace_render_content(4);
					} else {
						// 添加状态
						var config = crontab.crontabsType(arryCopy(crontab.crontabFormConfig), formData, that);
						if (formData.backupTo == 'localhost') {
							config[4].display = false;
						} else {
							config[4].display = true;
							config[4].group[0].value = '';
							config[3].group[5].value = formData.backupTo;
							config[3].group[7].display = formData.backupTo !== 'localhost' ? true : false;
						}
						config[3].group[1].value = element.more?element.more.val():'';
						config[3].group[2].value = formData.path
						config[1].group.value = formData.name;
						that.$again_render_form(config);
					}
        }
				//编辑功能时表单的展示
				$('.bt_multiple_select_updown .bt_select_value').attr('title',$('.bt_multiple_select_updown select').val()?$('.bt_multiple_select_updown select').val().join('\n'):'')
					if($('.layui-layer-content').length>0){
						var valList=$('.layui-layer-content .bt_multiple_select_updown select[name=more]').val() || []
						if(valList.length>1){
							var select_value=$('.layui-layer-content .bt_multiple_select_updown .bt_select_value')
							//最多显示2行
							select_value.find('.bt_select_content').slice(1).hide()
							if(that.data.sType == 'database'){
								var span='<span class="moreTip" style="display: block;">...等'+ valList.length +'个数据库</span>'
							select_value.append(span)
							}
							if(that.data.sType == 'site'){
								var span='<span class="moreTip" style="display: block;">...等'+ valList.length +'个网站</span>'
							select_value.append(span)
							}
							select_value.parents('.line').find('.tname').css({'line-height':select_value.height()+'px','height':select_value.height()+'px'})
						}
						$('.layui-layer-content .bt_multiple_select_updown .bt_select_value').attr('title',valList.join('\n'))
						$('.layui-layer-content input[name=more]').attr('title',that.data.sName.split(',').join('\n'))
						if (that.data.sType !== 'enterpriseBackup' && that.data.sType !== 'mysql_increment_backup') {
							$('.layui-layer-content .bt_multiple_select_updown .bt_select_value .icon-trem-close').remove()
						}
					}
      }
    }, {
      label: '保留最新',
      type: 'number',
      name: 'save',
      'class': 'group',
      width: '70px',
      value: '3',
      unit: '份'

    }, {
      type: 'checkbox',
      name: 'save_local',
      display: false,
      style: { "margin-top": "7px" },
      value: 1,
      title: '同时保留本地备份（和云存储保留份数一致）',
      event: function (formData, element, that) {
				that.config.form[3].group[7].value = !formData.save_local ? '0' : '1';
      }
    }]
  },
	{
		label: '文件拆分',
		display: false,
		name: 'fileSplit',
		group: [
			{
				type: 'select',
				name: 'split_type',
				width: '200px',
				list: [
					{ title: '不进行任何拆分', value: '' },
					{ title: '按大小拆分文件', value: 'size' },
					{ title: '按数量拆分文件', value: 'num' },
				],
				change: function (formData, element, that) {
					// 选中下拉项后
					if (formData.split_type == '') {
						that.config.form[4].group[1].display = false;
					} else if (formData.split_type == 'size') {
						that.config.form[4].group[1].display = true;
						that.config.form[4].group[1].value = 1024;
						that.config.form[4].group[1].unit = 'MB';
					} else if (formData.split_type == 'num') {
						that.config.form[4].group[1].display = true;
						that.config.form[4].group[1].value = 5;
						that.config.form[4].group[1].unit = '个';
					}
					that.config.form[4].group[0].value = formData.split_type;
					that.$replace_render_content(4);
				},
			},
			{
				type: 'number',
				display: false,
				name: 'split_value',
				class: 'group',
				width: '70px',
				min: 1,
				value: '1024',
				unit: 'MB',
			},
			{
				name: 'script_body',
				type: 'other',
				boxcontent:
					'<span style="margin-top: 0px; display: inline-block;color:#666;"><i style="color: red;font-style: initial;font-size: 12px;margin-right: 5px">*</i>为了解决上传时文件过大导致上传失败，若文件小请忽略此选项,开启拆分后备份文件大于5G时拆分成指定大小</span>',
			},
		],
	}, {
    label: '备份提醒',
    display: false,
    group: [{
      type: 'select',
      name: 'notice',
      value: 0,
      list: [
        { title: '不接收任何消息通知', value: 0 },
        { title: '任务执行失败接收通知', value: 1 }
      ],
      change: function (formData, element, that) {
        var notice_channel_form = that.config.form[5],
							notice = parseInt(formData.notice);
						notice_channel_form.group[1].display = !!notice;
						notice_channel_form.group[0].value = notice;
						that.$replace_render_content(5);

						var flag = false;
						if (formData.notice !== '0') {
							flag = that.config.form[5].group[1].list.length == 0;
						}
						that.config.form[10].group.disabled = flag;
						that.$local_refresh('submitForm', that.config.form[10].group);
			},
    }, {
      label: '消息通道',
      type: 'select',
      name: 'notice_channel',
      display: false,
      width: '100px',
      placeholder: '未配置消息通道',
      list: {
        url: '/config?action=get_msg_configs',
        dataFilter: function (res, that) {
          return crontab.pushChannelMessage.getChannelSwitch(res,that.config.form[0].group.value)
        },
        success: function (res, that, config, list) {
          if(!config.group[1].value && config.group[0].value == 1){
            config.group[1].value = list.length > 0 ? list[0].value : []
          }
          if (list.length === 0) {
						that.config.form[10].group.disabled = true;
						that.$local_refresh('submitForm', that.config.form[10].group);
					}
        }
      }
    }, {
      type: 'link',
      'class': 'mr5',
      title: '设置消息通道',
      event: function (formData, element, that) {
        open_three_channel_auth();
      }
    }]
  }, {
    label: '脚本内容',
    group: {
      type: 'textarea',
      name: 'sBody',
      style: {
        'width': '500px',
        'min-width': '500px',
        'min-height': '130px',
        'line-height': '22px',
        'padding-top': '10px',
        'resize': 'both'
      },
      placeholder: '请输入脚本内容，可以直接粘贴执行方式和可执行文件路径'
    }
  }, {
		label: 'URL地址',
		display: false,
		group: [
			{
				type: 'text',
				width: '500px',
				name: 'urladdress',
				value: 'http://',
				input: function (formData, element, that) {
					if (formData.sType !== 'toUrl') return;
					if (that.isRemoveInput) return;
					if (!this.value) {
						$('.bt-input-text[name=name]').val('访问URL');
						return;
					}
					$('.bt-input-text[name=name]').val('访问URL[ ' + this.value + ' ]');
					if (formData.sType === 'enterpriseBackup') {
						$('.glyphicon-repeat').on('click', function () {
							that.config.form[7].group.value = bt.get_random(bt.get_random_num(6, 10));
							that.$local_refresh('urladdress', that.config.form[7].group);
							$('input[name=urladdress]').click();
						});
					}
				},
				focus:function(formData, element, that){
					if (formData.sType !== 'toUrl') return;
					var _that=this
					//解决浏览器自动填充问题
					$(this).attr('autocomplete','off')

					var con = $(this).parent();
					con.css('position', 'relative');

					var li=''
					for(var i=0;i<localDomainList.length;i++){
						li+='<div class="domain-li '+ ((localDomainList[i]==$(this).val())? 'active':'') +'" title="'+ localDomainList[i] +'">'+ localDomainList[i] +'</div>'
					}
					var localManu=$('<div class="localManu">'+ li +'</div>');
					con.append(localManu);
					localManu.show();
					$('.domain-li').on('click',function(){
						$(_that).val($(this).html());
						$(this).addClass('active');
						if($('.layui-layer-content').length>0){
							$('.layui-layer-content .bt-input-text[name=name]').val('访问URL[ ' + $(this).html() + ' ]');
						}else{
						$('.bt-input-text[name=name]').val('访问URL[ ' + $(this).html() + ' ]');
						}
						localManu.hide();
					})
					$(this).on('blur',function(){
						setTimeout(function(){
						$('.localManu').hide();
						},200)
					})
				}
			},
			{
				type: 'button',
				name: 'validationUrl',
				class: 'btn-default',
				active: false,
				title: '测试url',
				event: function (formData, element, that) {
					crontab.validationURLHandel(formData);
				},
			},
		],
	}, {
		label: '时区选择',
    display: false,
    group: [{
      type: 'select',
      name: 'region',
		width: '120px',
      list: regionList,
      change: function (formData, element, that) {
				var config = that.config.form[8].group[1];
				config.list = timeZoneListObj[formData.region];
				config.value = timeZoneListObj[formData.region][0].value;
				that.$local_refresh('zone', config);
				if ($('.layui-layer-content').length > 0) {
					$('.layui-layer-content .bt-input-text[name=name]').val('定期同步服务器时间[' + formData.region + '/' + that.config.form[8].group[1].value + ']');
				} else {
					$('.bt-input-text[name=name]').val('定期同步服务器时间[' + formData.region + '/' + that.config.form[8].group[1].value + ']');
				}
      }
    }, {
      type: 'select',
      name: 'zone',
      width: '150px',
			change: function (formData, element, that) {
				if($('.layui-layer-content').length>0){
					$('.layui-layer-content .bt-input-text[name=name]').val('定期同步服务器时间['+ formData.region + '/'+ formData.zone +']');
				}else{
				$('.bt-input-text[name=name]').val('定期同步服务器时间['+ formData.region + '/'+ formData.zone +']');
				}
      }
    }]
  },{
    label: '温馨提示',
    display: true,
    group: {
      type: 'help',
      name: 'webshellTips',
      style: { 'margin-top': '6px' },
      list: ['为了保证服务器的安全稳定，shell脚本中以下命令不可使用：shutdown, init 0, mkfs, passwd, chpasswd, --stdin, mkfs.ext, mke2fs']
    }
  }, {
    label: '',
    group: {
      type: 'button',
      size: '',
      name: 'submitForm',
      title: '添加任务',
      event: function (formData, element, that) {
        // bt_tools.nps({name:'计划任务',type:5})
        randomNPSTouch =Math.floor(Math.random()*(3+1))
				formData['save_local'] = that.config.form[3].group[7].value.toString();
        that.submit(formData)
      }
    }
  }],
  /**
   * @description 计划任务类型解构调整
   * @param {}
   * @param {}
   * @param {Add} 是否是添加
   */

  crontabsType: function (config, formData, Add) {
		if (Add) {
			Add.isRemoveInput = false;    //控制访问URL任务名称
		}
		config[5].group[1].name = 'notice_channel';
		config[3].group[5].list = backupListAll;
		// config[2].group[0].value = 'week';
		config[9].display = false;
	switch (formData.sType) {
		case 'toShell':
			config[9].display = true;
			config[9].group.list = '';
			config[9].group.unit = '为了保证服务器的安全稳定，shell脚本中以下命令不可使用：shutdown, init 0, mkfs, passwd, chpasswd, --stdin, mkfs.ext, mke2fs';
			break;
		case 'enterpriseBackup':
			config[2].label = '备份周期'
			config[2].group[0].display = true;
			config[2].group[1].display = false
			config[2].group[2].display = false
			config[2].group[3].display = true
			config[2].group[4].display = true;
			config[7].display = false;
			config[3].group[0].display = false;
			config[3].label = '数据库';
			config[3].group[1].display = false;
			config[3].group[5].placeholder = ''
			config[3].group[5].value = ['localhost']
			config[3].group[5].width = '300px'
			config[3].group[3].list = allDatabases
			config[3].group[5].list = backuptolist
			config[3].group[5].type = 'multipleSelect'
			config[3].group[3].display = true;
			config[3].group[3].label = '';
			config[3].group[4].display = true;
			config[3].group[6].display = false;
			config[3].display = true;
			config[7].display = true;
			config[7].label = '压缩密码';
			config[7].group[0].width = '250px';
			config[7].group[0].unit = '<span class="glyphicon glyphicon-repeat cursor mr5"></span><span style="margin-left:5px;color:red;">注意：请牢记压缩密码，以免因压缩密码导致无法恢复和下载数据</span>'
			config[7].group[0].placeholder = '请输入压缩密码，可为空';
			config[7].group[0].value = '';
			config[7].group[1].display = false;
			config[1].group.disabled = true // 禁用任务名称，不允许修改
			config[6].display = false;
			config[5].display = true;
			config[9].display = true;
			config[9].group.list = '';
			config[9].group.unit = '<span class="alertMsg">【使用提醒】当前数据库暂不支持SQLServer、MongoDB、Redis、PgSQL备份</span>';
				if (Add) {
				config[2].group[0].value = 'hour-n'
				config[2].group[3].value = '3'
			}
			if(bt.get_cookie('ltd_end')<0){
				config[2].group[3].disabled = true
				config[3].group[1].disabled = true
				config[3].group[3].disabled = true;
				config[3].group[4].disabled = true;
				config[3].group[5].disabled = true
				config[5].group[0].disabled = true;
				config[7].group[0].disabled = true;
				config[10].group.title = '升级企业版使用';
			}
			break;
		case 'database':
			if (formData.sType === 'database') {
				// config[3].group[1].display=true
				config[3].group[0].display=true
				config[3].group[1].type='multipleSelect'
				config[3].group[1].width='300px'
				config[3].group[1].value = []
				config[3].group[1].list=databaseListAll
				config[3].group[1].name='more'
				config[3].group[1].label='数据库'
			}
			config[6].display = false;
			config[9].group.list = '';
			config[9].group.unit = '<span class="alertMsg">当前数据库暂不支持SQLServer、MongoDB、Redis、PgSQL备份</span>';
			if (Add) {
				config[2].group[0].value = 'day'
				config[2].group[1].display = false
				config[2].group[3].value = '2'
				config[2].group[4].value = '30'
			}
		case 'logs':
			if (formData.sType === 'logs') {
				config[3].group[1].type='select'
				config[3].group[1].placeholder = ''
				if(Add){
					config[2].group[3].value = '0'
					config[2].group[4].value = '1'
					config[2].group[0].value = 'day'
				}
				config[2].group[1].display = false
				config[3].group[5].display = false
				config[3].group[6].value = 180
				config[9].display = true;
				config[9].group.list = '';
				config[9].group.unit = '<span class="alertMsg">存储路径：/www/wwwlogs/history_backups/  <span class="btlink mr10" onClick="openPath(\'/www/wwwlogs/history_backups\')">【跳转到目录】</span></span>'
			}
		case 'path':
			if (formData.sType === 'path') {
				config[1].group.value = '备份目录[' + config[3].group[2].value + ']'
				if(Add) {
					config[2].group[0].value = 'day'
					config[2].group[1].display = false
				}
				config[3].group[1].display = false
				config[3].group[2].display = true
				config[3].group[5].list = backupListAll
			}
		case 'webshell':
			if (formData.sType === 'webshell') {
				config[3].group[1].unit = '<span style="margin-top: 9px; display: inline-block;">*本次查杀由长亭牧云强力驱动</span>';
				config[3].group[5].display = false
				config[3].group[6].display = false
				config[3].group[7].display = false
				config[5].display = true;
				config[5].label = '消息通道';
				config[5].group[1].name = 'urladdress';
				config[5].group[0].display = false;
				delete config[5].group[1].label;
				config[5].group[1].display = true;
				config[6].display = false;
			}
		case 'site':
			if (formData.sType === 'site') {
				config[3].group[1].width='300px'
				config[3].group[1].type='multipleSelect'
				config[3].group[1].name='more'
				config[3].group[1].value = []
			}
			config[3].group[1].list = siteListAll;
			config[3].label = crontab.typeTips[formData.sType]
			if (formData.sType !== 'path') config[1].group.disabled = true // 禁用任务名称，不允许修改
			config[3].display = true // 显示备份网站操作模块
			if (formData.sType === 'database' || formData.sType === 'site' || formData.sType === 'path') config[5].display = true;
			config[6].label = '排除规则';
			config[6].group.placeholder = '每行一条规则,目录不能以/结尾，示例：\ndata/config.php\nstatic/upload\n *.log\n';
			break;
		case 'syncTime':
			config[1].group.value = '定期同步服务器时间'
			config[6].display = false;
			config[8].display = true;
			config[9].display = true;
			config[9].group.list = '';
			config[9].group.unit = '<span class="alertMsg">默认从NTP服务器同步时间，失败时将同步bt.cn的服务器时间。</span>'
			break;
		case 'rememory':
			config[1].group.value = '释放内存'
			config[6].display = false;
			config[9].display = true;
			config[9].group.list = '';
			config[9].group.unit = '释放PHP、MYSQL、PURE-FTPD、APACHE、NGINX的内存占用,建议在每天半夜执行!'
			break;
		case 'toUrl':
			config[1].group.value = '访问URL[ http:// ]';
			config[6].display = false;
			config[7].display = true;
			break;
	}
	if (formData.sType === 'database') config[3].group[1].list = databaseListAll;
	if (Add && (formData.sType === 'database' || formData.sType === 'site')) {
		config[3].group[1].value = ['ALL'];
	}
	if (Add && (formData.sType === 'logs')) {
		config[3].group[1].value = 'ALL';
	}
	config[0].group.value = formData.sType
	return config
},
	/**
	 * @description 创建、编辑任务
	 * @param {Object} row  编辑时传入的行数据
	 */
	render_trigger_view: function (row) {
		var _this = this,
			_btn = ['创建', '取消'],
			_title = '创建任务',
			triggerOpenView = null,
			_aceEditor = null;
		var formConfig = [
			{
				label: '名称',
				group: {
					name: 'name',
					type: 'text',
					placeholder: '请输入任务名称',
					width: '280px',
					event: function () {
						if (!row) {
							$('[name=name]').on('input', function () {
								$('[name=ps]').val($(this).val());
							});
						}
					},
				},
			},
			{
				label: '执行周期',
				group: [
					{
						type: 'select',
						name: 'cycle_type',
						value: 'day',
						width: '70px',
						list: [
							{ title: '每天', value: 'day' },
							{ title: 'N天', value: 'day-n' },
							{ title: '每小时', value: 'hour' },
							{ title: 'N小时', value: 'hour-n' },
							{ title: 'N分钟', value: 'minute-n' },
							{ title: '每月', value: 'month' },
						],
						change: function (formData, element, that) {
							_this.crontabType(that.config.form, formData);
							that.$replace_render_content(1);
						},
					},
					{
						type: 'number',
						display: false,
						name: 'cycle_where',
						class: 'group',
						width: '52px',
						value: '3',
						unit: '日',
						min: 1,
						max: 31,
					},
					{
						type: 'number',
						name: 'cycle_hour',
						class: 'group',
						width: '52px',
						value: '1',
						unit: '小时',
						min: 0,
						max: 23,
					},
					{
						type: 'number',
						name: 'cycle_minute',
						class: 'group',
						width: '52px',
						min: 0,
						max: 59,
						value: '30',
						unit: '分钟',
					},
				],
			},
			{
				label: '运行',
				group: [
					{
						name: 'script_type',
						type: 'select',
						width: '100px',
						value: 'registry',
						list: [
							{ title: '脚本库', value: 'registry' },
							{ title: '自定义脚本', value: 'custom' },
						],
						change: function (formData, element, that) {
							that.config.form[2].group[0].value = formData.script_type;
							if (formData.script_type == 'custom') {
								that.config.form[2].group[1].display = false;
								that.config.form[2].group[2].display = true;

								// 是否已展示脚本参数
								if (that.config.form[5].group.display) {
									that.config.form[5].label = '';
									that.config.form[5].group.display = false; //隐藏参数
									that.$replace_render_content(5);
								}
							} else {
								that.data.script_id = ''; //清除上次选中的值
								that.config.form[2].group[1].display = true;
								that.config.form[2].group[2].display = false;
							}
							that.$replace_render_content(2);
							if (formData.script_type == 'custom') {
								_aceEditor = crontab_ace();
								$('.trigger_box').css('top', ($(window).height() - $('.trigger_box').height()) / 2);
							}
						},
					},
					{
						name: 'script_id',
						type: 'secondaryMenu',
						width: '170px',
						placeholder: '请选择脚本',
						list: (function () {
							return _this.render_script_list();
						})(),
						change: function (formData, element, that, lineData) {
							var $this = $(this);
							var parentIndex = $this.parent().parent().parent().index(); //当前选中的数据的父级索引
							var index = $this.index(); //当前选中的数据的索引
							var childenData = lineData.list[parentIndex].child[index]; //当前选中的数据
							if (childenData.is_args == 1) {
								that.config.form[5].group.display = true;
								that.config.form[5].label = childenData.args_title;
								that.config.form[5].group.placeholder = childenData.args_ps;
								that.data.args = '';
							} else {
								that.config.form[5].group.display = false;
								that.config.form[5].label = '';
							}
							that.config.form[2].group[0].value = formData.script_type;
							that.$replace_render_content(2);
							that.$replace_render_content(5);
						},
					},
					{
						name: 'script_body',
						type: 'other',
						display: false,
						boxcontent: '<div class="bt-input-text" style="width:390px;height: 200px;min-height:200px;line-height:18px;margin-top: 10px;" id="scriptBody"></div>',
					},
				],
			},
			{
				label: '备注',
				group: {
					name: 'ps',
					type: 'text',
					placeholder: '备注',
					width: '280px',
				},
			},
			{
				label: '',
				group: {
					display: false,
					name: 'args',
					type: 'text',
					placeholder: '',
					width: '280px',
				},
			},
		];
		if (row) {
			_btn = ['保存', '取消'];
			_title = '编辑任务';
			if (row.script_id == 0 && row.script_body != '') {
				formConfig[2].group[0].value = 'custom';
				formConfig[2].group[1].display = false;
				formConfig[2].group[2].display = true;
			}
			if (!$.isEmptyObject(row.script_info) && row.script_info.is_args == 1) {
				formConfig[5].group.display = true;
				formConfig[5].label = row.script_info.args_title;
				formConfig[5].group.placeholder = row.script_info.args_ps;
			}
			_this.crontabType(formConfig, row);
		}
		bt_tools.open({
			type: 1,
			area: '570px',
			title: _title,
			closeBtn: 2,
			skin: 'trigger_box',
			btn: _btn,
			content: '<div class="pd20" id="trigger_form_box"></div>',
			success: function (layers) {
				triggerOpenView = bt_tools.form({
					el: '#trigger_form_box',
					data: row || {},
					form: formConfig,
				});
				$(layers).find('.layui-layer-content').css('overflow', 'inherit');
				if (row && row.script_id == 0 && row.script_body != '') {
					_aceEditor = crontab_ace();
					_aceEditor.setValue(row.script_body);
					$(layers).css('top', ($(window).height() - $(layers).height()) / 2);
				}
			},
			yes: function (layers) {
				var formValue = triggerOpenView.$get_form_value();
				if (formValue.name == '') return bt.msg({ msg: '请输入任务名称', icon: 2 });
				var hour = parseInt(formValue.cycle_hour),
					minute = parseInt(formValue.cycle_minute),
					where1 = parseInt(formValue.cycle_where);
				switch (formValue.cycle_type) {
					case 'hour':
					case 'minute-n':
						if (minute < 0 || minute > 59 || isNaN(minute)) return bt.msg({ status: false, msg: '请输入正确分钟范围0-59分' });
						if (formValue.cycle_type == 'minute-n') {
							formValue.cycle_where = minute;
							formValue.cycle_minute = '';
							if (formValue.cycle_where < 1) return bt.msg({ status: false, msg: '分钟不能小于1！' });
						}
						break;
					case 'day-n':
					case 'month':
						if (where1 < 1 || where1 > 31 || isNaN(where1)) return bt.msg({ status: false, msg: '请输入正确天数1-31天' });
					case 'week':
					case 'day':
					case 'hour-n':
						if (hour < 0 || hour > 23 || isNaN(hour)) return bt.msg({ status: false, msg: '请输入小时范围0-23时' });
						if (minute < 0 || minute > 59 || isNaN(minute)) return bt.msg({ status: false, msg: '请输入正确分钟范围0-59分' });
						if (formValue.cycle_type === 'hour-n') {
							formValue.cycle_where = formValue.cycle_hour;
							formValue.cycle_hour = '';
							if (minute <= 0 && hour <= 0) return bt.msg({ status: false, msg: '小时、分钟不能同时小于1！' });
						}
						break;
				}
				if (typeof formValue.cycle_where == 'undefined') formValue.cycle_where = '';
				if (typeof formValue.cycle_hour == 'undefined') formValue.cycle_hour = '';
				if (formValue.script_type == 'custom') {
					formValue.script_body = _aceEditor.getValue();
					if (formValue.script_body == '') {
						layer.msg('脚本内容不能为空!', { icon: 2 });
						return;
					}
				} else {
					formValue.script_body = '';
					if (formValue.script_id == '') return bt.msg({ status: false, msg: '请选择脚本' });
				}
				if (formValue.script_id >= 0) {
					formValue.script_id = parseInt(formValue.script_id);
				} else {
					formValue.script_id = 0;
				}
				formValue.operator_where = [];
				delete formValue['script_type'];
				if (row) formValue.trigger_id = row.trigger_id;
				if (typeof formValue.args != 'undefined' && formValue.args == '') return bt.msg({ status: false, msg: '请填写' + $('input[name=args]').parents('.line').find('.tname').text() });
				bt_tools.send(
					{ url: '/crontab/trigger/' + (row ? 'modify_trigger' : 'create_trigger'), data: { data: JSON.stringify(formValue) } },
					function (res) {
						if (res.status) {
							layer.close(layers);
							_this.get_trigger_list();
						}
						bt_tools.msg(res);
					},
					(row ? '修改' : '创建') + '任务'
				);
			},
		});
	},
  /**
   * @description 计划任务类型解构调整
   */
  crontabType: function (config, formData) {
    var formConfig = config[2];
    switch (formData.type) {
      case 'day-n':
      case 'month':
      case 'day':
        formConfig.group[1].display = false
        $.extend(formConfig.group[2], {
          display: formData.type !== 'day',
          unit: formData.type === 'day-n' ? '天' : '日'
        })
        formConfig.group[3].display = true
        break;
      case 'hour-n':
      case 'hour':
      case 'minute-n':
        formConfig.group[1].display = false
        formConfig.group[2].display = false
        formConfig.group[3].display = formData.type === 'hour-n'
        formConfig.group[4].value = formData.type === 'minute-n' ? 3 : 30
        break;
      case 'week':
        formConfig.group[1].display = true
        formConfig.group[2].display = false
        formConfig.group[3].display = true
        break;

    }
    var num = formData.sType == 'logs' ? 0 : 1;
    var hour = formData.hour ? formData.hour : num;
    var minute = formData.minute ? formData.minute : 30;
    formConfig.group[3].value = parseInt(hour).toString();
    formConfig.group[4].value = parseInt(minute).toString()
    formConfig.group[0].value = formData.type;
    return config;
  },
  /**
   * @description 添加计划任务表单
   */
  addCrontabForm: function () {
    var _that = this
    return bt_tools.form({
      el: '#crontabForm',
      'class': 'crontab_form',
      form: arryCopy(crontab.crontabFormConfig),
      submit: function (formData) {
        var form = $.extend(true, {}, _that.crontabForm), _where1 = $('input[name=where1]'), _hour = $('input[name=hour]'), _minute = $('input[name=minute]');
        $.extend(form, formData)
	    if(bt.get_cookie('ltd_end') < 0 && form.sType === 'enterpriseBackup'){
			  $.post("plugin?action=get_soft_find", {
				  sName: 'enterprise_backup'
			  }, function (rdata) {
				  rdata.description = ['快速恢复数据','支持数据安全保护','支持增量备份','支持差异备份']
				  rdata.pluginName = '企业增量备份'
				  rdata.ps = '指定数据库或指定表增量备份，支持InnoDB和MyISAM两种存储引擎，可增量备份至服务器磁盘、阿里云OSS、腾讯云COS、七牛云存储、华为云存储、百度云存储'
				  rdata.imgSrc='https://www.bt.cn/Public/new/plugin/introduce/database/backup.png'
				  product_recommend.recommend_product_view(rdata,{imgArea: ['890px', '620px']},'ltd',53,'ltd')
			  })
			  return
	    }
        if (form.name === '') {
          bt.msg({ status: false, msg: '计划任务名称不能为空！' })
          return false
        }
        if (_where1.length > 0) {
          if (_where1.val() > 31 || _where1.val() < 1 || _where1.val() == '') {
            _where1.focus();
            layer.msg('请输入正确的周期范围[1-31]', { icon: 2 });
            return false;
          }
        }
        if (_hour.length > 0) {
          if (_hour.val() > 23 || _hour.val() < 0 || _hour.val() == '') {
            _hour.focus();
            layer.msg('请输入正确的周期范围[0-23]', { icon: 2 });
            return false;
          }
        }
        if (_minute.length > 0) {
          if (_minute.val() > 59 || _minute.val() < 0 || _minute.val() == '') {
            _minute.focus();
            layer.msg('请输入正确的周期范围[0-59]', { icon: 2 });
            return false;
          }
        }
        switch (form.type) {
          case "minute-n":
            form.where1 = form.minute;
            form.minute = '';
            if(form.where1 < 1) return bt.msg({ status: false, msg: '分钟不能小于1！' })
            break;
          case "hour-n":
            form.where1 = form.hour;
            form.hour = '';
            if(form.minute <= 0 && form.where1 <= 0) return bt.msg({ status: false, msg: '小时、分钟不能同时小于1！' })
            break;
            // 天/日默认最小为1
        }
        switch (form.sType) {
          case 'syncTime':
            if (form.sType === 'syncTime') form.sType = 'sync_time'
						form.sName = form.region + '/' + form.zone
						break;
          case 'toShell':
            if (form.sBody === '') {
              bt.msg({ status: false, msg: '脚本内容不能为空！' })
              return false
            }
            break;
          case 'path':
            form.sName = form.path
            delete form.path
            if (form.sName === '') {
              bt.msg({ status: false, msg: '备份目录不能为空！' })
              return false
            }
            break;
          case 'toUrl':
            if (!bt.check_url(form.urladdress)) {
              layer.msg(lan.crontab.input_url_err, { icon: 2 });
              $('#crontabForm input[name=urladdress]').focus();
              return false;
            }
            break;
          case 'enterpriseBackup':
            // if (form.hour < 1) {
            //   layer.msg('备份周期应大于0', { icon: 2 });
            //   $('#crontabForm input[name=hour]').focus();
            //   return false;
            // }
            break;
        }
        if (form.sType == "site" || form.sType == "database" || form.sType == "path" || form.sType == "logs") {
          if (Number(form.save) < 1 || form.save == '') {
            return bt.msg({status: false, msg: '保留最新不能小于1！'});
          }
        }
        var url = '/crontab?action=AddCrontab',params = form
        if (form.sType == "enterpriseBackup") {
					var multipleValues = $('select[name=backupTo').val();
					if (multipleValues == null)
						return layer.msg('请最少选择一个备份类型')(
							(form['backupTo'] = multipleValues.join('|'))
						);
					form['db_name'] = form.datab_name;
					form['zip_password'] = form.urladdress;
					var tb_name = $('select[name=tables_name]').val();
					if (!tb_name) return layer.msg('请最少选择一个备份表');
					form['tb_name'] = tb_name.join(',');
					url = '/project/binlog/add_mysql_increment_crontab';
					params = form;
        }
				if(form.sType == "site" || form.sType == "database"){
					if($('select[name=more').val()){
						params.sName=$('select[name=more').val().join(',')
					}else{
						if($('select[name=more').val()==null){
							layer.msg('请选择备份的'+(form.sType == "site"?'网站':'数据库'), { icon: 2 });
							return
						}else{
							params.sName=$('select[name=more').val()[0] || ''
						}
					}
				}

				if (form.sType == 'site' || form.sType == 'database' || form.sType == 'path') {
					if (form.split_type == undefined) {
						form.split_type = '';
					}
					if (form.split_value == undefined) {
						form.split_value = '';
					}
					if (form.split_type == 'size' && form.split_value < 1) {
						return layer.msg('拆分大小至少大于1MB');
					}
					if (form.split_type == 'num' && form.split_value < 2) {
						return layer.msg('拆分数量至少大于2');
					}
				}
			bt_tools.send({
								url: url,
								data: params
							}, function (res) {
								_that.getDatabaseList('mysql')
								_that.addCrontabTable.data = {}
								_that.addCrontabTable.$again_render_form(_that.crontabFormConfig)
								_that.crontabListTabel.$refresh_table_list(true)
								bt_tools.msg(res)
                  // setTimeout(function (){
                  //   if(crontabNpsShow && randomNPSTouch==1){
                  //     bt_tools.nps({name:'计划任务',type:6,soft:'crontab'})
                  //     crontabNpsShow=false
                  //     bt.set_cookie('crontab_nps','1',86400000*365)
                  //   }
                  // },500)

							}, '添加计划任务');

      }
    })
  },
	/**
   * @description 获取对应类型数据库列表
   */
	getDatabaseList:function(type){
		bt_tools.send({
			url: '/crontab?action=GetDatabases',
			data: { db_type: type }
		}, function (res) {
			var list = [{ title: '所有', value: 'ALL' }];
						if(type=='redis') list=[]
				for (var i = 0; i < res.length; i++) {
					var item = res[i]
					var filterXss = $('<div></div>').text(item.ps)
					list.push({ title: item.name+'['+ filterXss.html() +']', value: item.name });
				}
				if (list.length === 1 && type!='redis') list = []
				databaseListAll = list
		})
	},
  /**
   	* @description 新 取指定数据库的所有表名
	 * @param {object} param 参数对象
	 * @param {function} callback 回调函数
	 */
	getTbList: function (param, callback) {
		$.post('/project/binlog/get_databases', function (res) {
			var data = [],
				allTables = [];
				if(!res.status) return
				// 判断当前是否为企业版
				if (bt.get_cookie('ltd_end') < 0) {
					allTables = [{ title: '升级企业版使用', value: '' }];
						if (callback) callback(allTables)
					return
				}
			for (let i = 0; i < res.data.length; i++) {
				if (res.data[i].value == param) {
					$.each(res.data[i].table_list, function (index, tb) {
						data.push({ title: tb.tb_name + (tb.cron_id == null || tb.cron_id.length == 0 ? '[无备份任务]' : ''), value: tb.value });
					});
				}
				// data[res.data[i].value] = res.data[i].tables
			}
			if (res.data.length == 0) {
				allTables = [{ title: '当前数据库下没有表', value: '' }];
			} else {
				allTables = data;
			}
			if (callback) callback(allTables);
		});
	},
	/**
	 * @description 旧 取指定数据库的所有表名
   */
  getAllDatabases: function (callback){
		$.post('/crontab?action=GetDatabases', function (res) {
      allDatabases = []
      if (res.length == 0) {
        allDatabases = [{title:'当前没有数据库',value:''}]
      }else{
        for (let i = 0; i < res.length; i++) {
          allDatabases.push({title:res[i].name,value:res[i].name})
        }
      }
      if (callback) callback(res)
    })
  },
  /**
   * @description 取指定数据库的所有表名
   * @param {object} param 参数对象
   * @param {function} callback 回调函数
   */
  getAllTables: function (param, callback) {
    $.post('project/binlog/get_tables', {db_name: param} , function (res) {
      var data = [],allTables = []
      for (let i = 0; i < res.length; i++) {
        data.push({title:res[i].name,value:res[i].name})
      }
      if (data.length == 0) {
        allTables = [{title:'当前数据库下没有表',value:''}]
      }else{
        allTables = data
      }
      if (callback) callback(allTables)
    })
  },
  /**
   * @description 获取计划任务存储列表
   * @param {function} callback 回调函数
   */
  getDataList: function (type, callback) {
		var _that = this
		if ($.type(type) === 'function') callback = type, type = 'sites'
		bt_tools.send({
			url: '/crontab?action=GetDataList',
			data: { type: type }
		}, function (res) {
			var backupList = [{ title: '服务器磁盘', value: 'localhost' }];
			for (var i = 0; i < res.orderOpt.length; i++) {
				var item = res.orderOpt[i]
				backupList.push({ title: item.name, value: item.value })
			}
			backupListAll = backupList
			var siteList = [{ title: '所有', value: 'ALL' }];
			for (var i = 0; i < res.data.length; i++) {
				var item = res.data[i]
				siteList.push({ title: item.name + '[' + _that.htmlDecodeByRegExp(item.ps) + ']', value: item.name });
			}
			if (siteList.length === 1) siteList = []
			if (type === 'sites') {
				siteListAll = siteList
			} else {
				databaseListAll = siteList
			}
			if (callback) callback(res)
		}, '获取存储配置');
	},
	/**
   * @description 转义字符，防止xss
   * @param {string} str 转换的字符串
   */
	htmlDecodeByRegExp:function(str){
		var temp = ""
		if (str.length == 0) return ""
		temp = str.replace(/&amp;/g, "&")
		temp = temp.replace(/&lt;/g, "＜")
		temp = temp.replace(/&gt;/g, "＞")
		temp = temp.replace(/&nbsp;/g, " ")
		temp = temp.replace(/&#39;/g, "\'")
		temp = temp.replace(/&quot;/g, "\"")
		return temp
	},
  /**
   * @description 删除计划任务
   * @param {object} param 参数对象
   * @param {function} callback 回调函数
   */
  delCrontab: function (param, callback) {
    bt_tools.send({
      url: '/crontab?action=DelCrontab',
      data: { id: param.id }
    }, function (res) {
      bt.msg(res)
      if (res.status && callback) callback(res)
    }, '删除计划任务');
  },
  /**
   * @description 执行计划任务
   * @param {object} param 参数对象
   * @param {function} callback 回调函数
   */
  startCrontabTask: function (param, callback) {
    bt_tools.send({
      url: '/crontab?action=StartTask',
      data: { id: param.id }
    }, function (res) {
      bt.msg(res)
      if (res.status && callback) callback(res)
    }, '执行计划任务');
  },
  /**
   * @description 获取计划任务执行日志
   * @param {object} param 参数对象
   * @param {function} callback 回调函数
   */
  getCrontabLogs: function (param, callback) {
    bt_tools.send({
      url: '/crontab?action=GetLogs',
      data: { id: param.id }
    }, function (res) {
      if (res.status) {
        if (callback) callback(res)
      } else {
        bt.msg(res)
      }
    }, '获取执行日志');
  },
  /**
   * @description 获取计划任务执行日志
   * @param {object} param 参数对象
   * @param {function} callback 回调函数
   */
  clearCrontabLogs: function (param, callback) {
    bt_tools.send({
      url: '/crontab?action=DelLogs',
      data: { id: param.id }
    }, function (res) {
      bt.msg(res)
      if (res.status && callback) callback(res)
    }, '清空执行日志');
  },
  /**
   * @description 获取计划任务执行状态
   * @param {object} param 参数对象
   * @param {function} callback 回调函数
   */
  setCrontabStatus: function (param, callback) {
    bt_tools.send({
      url: '/crontab?action=set_cron_status',
      data: { id: param.id }
    }, function (res) {
      bt.msg(res)
      if (res.status && callback) callback(res)
    }, '设置任务状态');
  },
  /**
   * @description 计划任务表格
   */
  crontabTabel: function () {
    var _that = this
		var crontabTableObj = bt_tools.table({
      el: '#crontabTabel',
      url: '/crontab?action=GetCrontab',
      minWidth: '1000px',
      autoHeight: true,
      'default': "计划任务列表为空", //数据为空时的默认提示
      height: 300,
      dataFilter: function (res) {
        // if(res.length===0){
        //   crontabNpsShow= false
        // }else {
        //   bt_tools.send({
        //     url: 'config?action=get_nps',
        //     data: {version: -1, product_type: 6,software_name:'crontab'}
        //   }, function (res) {
        //     crontabNpsShow = !res.nps
        //   })
        // }
				return { data: res };
      },
      column: [
        { type: 'checkbox', 'class': '', width: 20 },
        {
          fid: 'name',
          title: "任务名称",
					width:'450px',
					template: function (row) {
						if(row.sType == "site"||row.sType == "database"){
							if(Array.isArray(row.sName.split(','))){
							this.tips=row.sName.split(',').join('\n')
							}else{
								this.tips=row.sName
							}
						}
						return '<span class="list-row"><span class="img-box" style="width:20px;height:14px;display:inline-block;"><img src="/static/img/file_icon/topping.png" style="display:none;" title="置顶" class="crontab-topping crontab-gray" data-id="'+row.id+'" /></span>'+row.name+'</span>'
          }
        },
        {
          fid: 'status',
          title: "状态",
          width: 80,
          config: {
            icon: true,
            list: [
              [1, '正常', 'bt_success', 'glyphicon-play'],
              [0, '停用', 'bt_danger', 'glyphicon-pause']
            ]
          },
          type: 'status',
          event: function (row, index, ev, key, that) {
            bt.confirm({
              title: '设置计划任务状态',
              msg: parseInt(row.status) ? '计划任务暂停后将无法继续运行，您真的要停用这个计划任务吗？' : '该计划任务已停用，是否要启用这个计划任务'
            }, function () {
              _that.setCrontabStatus(row, function () {
                that.$refresh_table_list(true)
              })
            })
          }
        },
        // {
        //   fid: 'type',
        //   title: "周期",
        //   width: 120
        // },
        {
          fid: 'cycle',
          title: "执行周期",
          template: function (row, index) {
            if (row.sType == "enterpriseBackup") {
              return '<span>每隔'+ row.where1 +'小时执行</span>'
            }
            return '<span>'+ row.cycle +'</span>'
          }
        }, {
          fid: 'save',
          title: "保存数量",
					width: '80px',
          template: function (row) {
            if(typeof row.sBody == 'undefined' || row.sBody == null) return '<span>' + (row.save > 0 ? +row.save + '份' : '-') + '</span>'
						if(row.sType == 'enterpriseBackup' || row.sType == 'logs'|| row.sBody.indexOf('run_log_split.py') !=-1) return '<span>' + (row.save > 0 ? +row.save + '份' : '-') + '</span>'
							return '<div><span>' + (row.save > 0 ? +row.save + '份' : '-') + '</span><span class="btlink crontab_show_backup" data-id="'+ row.id+'" data-name="'+row.name +'"> '+(row.save > 0 ? '[查看]' : '')+'</span></div>'
          }
        }, {
          fid: 'backupTo',
          title: "备份到",
          width: '100px',
          template: function (row, index) {
            if (row.sType == "enterpriseBackup") {
              var arry = [],arry1 = []
              arry = row.backupTo.split("|")
              for (var i = 0; i < arry.length; i++) {
                for (var j = 0; j < backuptolist.length; j++) {
                  if (arry[i] == backuptolist[j].value) {
                    arry1.push(backuptolist[j].title)
                  }
                }
              }
							return '<span style="width:100px;display:inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="' + arry1 + '">' + arry1 + '</span>'
            } else {
              for (var i = 0; i < backupListAll.length; i++) {
                var item = backupListAll[i]
                if (item.value === row.backupTo) {
                  if (row.sType === 'toShell') return '<span>--</span>';
									return '<span style="width:100px;">' + item.title + '</span>'
                }
              }
              return '<span style="width:100px;">--</span>'
            }
          }
        }, {
          fid: 'addtime',
          title: '上次执行时间',
        },
        {
          title: "操作",
          type: 'group',
          align: 'right',
          group: [{
            title: '执行',
            event: function (row, index, ev, key, that) {
              randomNPSTouch =Math.floor(Math.random()*(3+1))
              _that.startCrontabTask(row, function (res) {
                that.$refresh_table_list(true);
                if(res.status) {
                  setTimeout(function () {
                    layer.closeAll()
                    $('#crontabTabel .table tbody tr:eq('+ index +')').find('[title="日志"]').click()
                  }, 1000)
                }
              })
						}
          }, {
            title: '编辑',
            event: function (row, index, ev, key, that) {
              var arry = [],db_result,t_result
              arry = row.urladdress.split("|")
              // if(row.sType === 'enterpriseBackup'){
              //   crontab.getAllDatabases(function (rdata) {
              //     crontab.getAllTables(arry[0],function(res) {
              //       db_result = rdata.some(function(item){
              //         if (item.name === arry[0]) {
              //           return true
              //         }
              //       })
              //       if(arry[1] !== ''){
              //         t_result = res.some(function(item){
              //           if (item.value === arry[1]) {
              //             return true
              //           }
              //         })
              //       }
              //       edit(res)
              //     })
              //   })
              // }else{
              //   edit()
              // }
							edit()
              function edit(table_list) {
                layer.open({
                  type: 1,
                  title: '编辑计划任务-[' + row.name + ']',
                  area: (row.sType != "enterpriseBackup" && row.sType != "database") ? '990px':'1140px',
                  skin: 'layer-create-content',
                  shadeClose: false,
                  closeBtn: 2,
                  content: '<div class="ptb20" id="editCrontabForm" style="min-height: 400px"></div>',
                  success: function (layers, indexs) {
                    randomNPSTouch =Math.floor(Math.random()*(3+1))
                    bt_tools.send({
                      url: '/crontab?action=get_crond_find',
                      data: { id: row.id }
                    }, function (rdata) {
                      var formConfig = arryCopy(crontab.crontabFormConfig),
                          form = $.extend(true, {}, _that.crontabForm),
                          cycle = {};
                      for (var keys in form) {
                        if (form.hasOwnProperty.call(form, keys)) {
                          form[keys] = typeof rdata[keys] === "undefined" ? '' : rdata[keys]
                        }
                      }
                      crontab.crontabType(formConfig, form)
                      crontab.crontabsType(formConfig, form)
                      switch (rdata.type) {
                        case 'day':
                          cycle = { where1: '', hour: rdata.where_hour, minute: rdata.where_minute }
                          break;
                        case 'day-n':
                          cycle = { where1: rdata.where1, hour: rdata.where_hour, minute: rdata.where_minute }
                          break;
                        case 'hour':
                          cycle = { where1: rdata.where1, hour: rdata.where_hour, minute: rdata.where_minute }
                          break;
                        case 'hour-n':
                          cycle = { where1: rdata.where1, hour: rdata.where1, minute: rdata.where_minute }
                          break;
                        case 'minute-n':
                          cycle = { where1: rdata.where1, hour: '', minute: rdata.where1 }
                          break;
                        case 'week':
                          formConfig[2].group[1].value = rdata.where1
                          formConfig[2].group[1].display = true
                          cycle = { where1: '', week: rdata.where1, hour: rdata.where_hour, minute: rdata.where_minute }
                          break;
                        case 'month':
                          cycle = { where1: rdata.where1, where: '', hour: rdata.where_hour, minute: rdata.where_minute }
                          break;
                      }

                      if (rdata.sType !== 'mysql_increment_backup') {
                        formConfig[3].group[5].value = rdata.backupTo;
                        formConfig[3].group[7].display = (rdata.backupTo != "" && rdata.backupTo != 'localhost');
                        formConfig[3].group[7].value = rdata.save_local;
                      }
											formConfig[5].group[0].value = rdata.notice;
											formConfig[5].group[1].display = rdata.sType == 'webshell' ? true : !!rdata.notice; //单独判断是否为木马查杀
											if (formConfig[5].group[1].display) {
												formConfig[5].group[1].display = true;
												formConfig[5].group[1].value = rdata.sType == 'webshell' ? rdata.urladdress : rdata.notice_channel === '' ? 'all' : rdata.notice_channel;
											}
                      $.extend(form, cycle, { id: rdata.id })

											if (rdata.sType == 'sync_time') {
												var region = rdata.sName.split('/');
												formConfig[0].group.value = 'syncTime';
												formConfig[6].display = false;
												formConfig[8].display = true;
												formConfig[9].display = true;
												formConfig[8].group[0].value = region[0];
												formConfig[8].group[1].value = region[1];
												formConfig[8].group[1].list = timeZoneListObj[region[0]];
												formConfig[9].group.list = '';
												formConfig[9].group.unit = '<span class="alertMsg">默认从NTP服务器同步时间，失败时将同步bt.cn的服务器时间。</span>';
											}

                      switch (rdata.sType) {
                        case 'logs':
													form.path = rdata.sName
                          formConfig[3].group[2].disabled = true
													break;
                        case 'path':
                          form.path = rdata.sName
                          formConfig[3].group[2].disabled = true
                          break
                        case 'mysql_increment_backup':
													formConfig[0].group.value = 'enterpriseBackup';
													formConfig[3].display = true;
													formConfig[3].label = '数据库';
													formConfig[3].group[3].value = arry[0];
													formConfig[3].group[3].display = true;
													formConfig[3].group[3].label = '';
													formConfig[3].group[1].display = false;
													formConfig[3].group[3].disabled = true;
													formConfig[3].group[3].list = [{ title: rdata.sName, value: rdata.sName }];
													formConfig[3].group[3].value = rdata.sName;
													formConfig[3].group[4].disabled = true;
													formConfig[3].group[4].type = 'text';
													var value = rdata.sBody.split(',');
													formConfig[3].group[4].value = rdata.sBody.split(',')[0];
													formConfig[3].group[4].width = '200px';
													if (value.length > 1) {
														formConfig[3].group[4].value = rdata.sBody.split(',')[0] + '......等' + rdata.sBody.split(',').length + '个表';
													} else if (value[0] == '') {
														formConfig[3].group[4].value = '所有';
													}
														formConfig[3].group[4].display = true;
													formConfig[3].group[5].type = 'multipleSelect';
													formConfig[3].group[5].width = '300px';
													formConfig[6].display = false;
													formConfig[7].display = false;
													formConfig[5].display = true;
													formConfig[9].display = true;
													formConfig[9].group.list = ['【使用提醒】当前数据库暂不支持SQLServer、MongoDB、Redis、PgSQL备份'];
													var backT = rdata.backupTo.split('|'),
														backupTolist = [];
													for (var i = 0; i < backT.length; i++) {
														if (backT[i] != '') {
															backupTolist.push(backT[i]);
														}
													}
													formConfig[3].group[5].value = backupTolist;
													break;
                        case 'toShell':
                            if(rdata.save){
                              formConfig[2].group[0].disabled = true
                              if(rdata.type === 'minute-n'){
                                formConfig[2].group[4].disabled = true
                              }
                              formConfig[3].group[6].value = rdata.save
                              for (var i = 0; i < formConfig[3].group.length; i++) {
                                if(i === 5) {
                                  delete formConfig[3].group[i]['label']
                                  formConfig[3].group[i].display = true
                                }else{
                                  formConfig[3].group[i].display = false
                                }
                              }
                              formConfig[3].label = '保留最新'
                              formConfig[3].display = true
                            }
                            break;
                      }
                      formConfig[0].group.disabled = true;
											formConfig[1].group.disabled = true;
											formConfig[3].group[1].disabled = true;
											formConfig[7].group[1].display = false;
											formConfig[10].group.title = '保存编辑';
                      var screen = ['site','database','logs','path','webshell']
                      if(screen.indexOf(form.sType) > -1){
                        if (form.sName === 'ALL') {
                          form.name = form.name.replace(/\[(.*)]/, '[ 所有 ]');
                        } else if(rdata.sType=='site'||rdata.sType=='database'){
													form.name = form.name
												} else{
													form.name = form.name.replace(/\[(.*)]/, '[ ' + form.sName + ' ]');
												}
                      }
											if(rdata.sType=='site'||rdata.sType=='database'){
												var valList=rdata.sName.split(',')
												if(valList.length>1){
													formConfig[3].group[1].value=form.sName.split(',')
													if(rdata.sType=='database'){
														formConfig[3].group[1].value=form.sName.split(',')[0]+'......等'+ form.sName.split(',').length +'个数据库'
													}
												}else{
													formConfig[3].group[1].value = valList
													if(rdata.sType=='database' && valList[0]=='ALL'){
														formConfig[3].group[1].value = '所有数据库'
													}
												}
												// formConfig[3].group[1].type='text'
												if(rdata.sType=='database'){
													formConfig[3].label='数据库类型'
													formConfig[3].group[0].disabled = true
													formConfig[3].group[0].value = rdata.db_type
													formConfig[3].group[1].type='text'
													// formConfig[3].group[1].list=database_list
													// formConfig[3].group[0].display=false
													// formConfig[3].group[1].label=''
												}
											}
											if (rdata.sType == 'site' || rdata.sType == 'database' || rdata.sType == 'path') {
												formConfig[4].display = true;
												if (rdata.backupTo != 'localhost') {
													// formConfig[4].group[0].disabled = true
													// formConfig[4].group[1].disabled = true
													if (rdata.split_type != '') {
														formConfig[4].group[1].display = true;
														formConfig[4].group[0].value = rdata.split_type;
														formConfig[4].group[1].value = rdata.split_value;
													}
													if (rdata.split_type == 'size') {
														formConfig[4].group[1].unit = 'MB';
													} else if (rdata.split_type == 'num') {
														formConfig[4].group[1].unit = '个';
													}
												} else {
													// formConfig[4].group[0].disabled = true;
													formConfig[4].display = false;
												}
											}
                      delete formConfig[0].group.unit

                      bt_tools.form({
                        el: '#editCrontabForm',
                        'class': 'crontab_form',
                        form: formConfig,
                        data: form,
                        submit: function (formData) {
                          var submitForm = $.extend(true, {}, _that.crontabForm, formData, {
                            id: rdata.id,
                            sType: rdata.sType
                          })
                          if (submitForm.name === '') {
                            bt.msg({ status: false, msg: '计划任务名称不能为空！' })
                            return false
                          }
                          switch (submitForm.sType) {
                            case 'sync_time':
															submitForm.sName = submitForm.region + '/' + submitForm.zone
															break;
                            case 'syncTime':
                              if (form.sType === 'syncTime') form.sType = 'sync_time'
															submitForm.sName = submitForm.region + '/' + submitForm.zone
															break;
                            case 'toShell':
                              if (submitForm.sBody === '') {
                                bt.msg({ status: false, msg: '脚本内容不能为空！' })
                                return false
                              }
                              if(rdata.save !== ''){
                                submitForm.type = rdata.type
                              }
                              break;
                            case 'path':
                              submitForm.sName = submitForm.path
                              delete submitForm.path
                              if (submitForm.sName === '') {
                                bt.msg({ status: false, msg: '备份目录不能为空！' })
                                return false
                              }
                              break;
                            case 'toUrl':
                              if (!bt.check_url(submitForm.urladdress)) {
                                layer.msg(lan.crontab.input_url_err, { icon: 2 });
                                $('#editCrontabForm input[name=urladdress]').focus();
                                return false;
                              }
                              break;
                            case 'enterpriseBackup':
                              if (submitForm.hour == '')  return bt.msg({ status: false, msg: '备份周期不能为空！' })
                              if (submitForm.hour < 0)  return
                              break;
                          }

                          var hour = parseInt(submitForm.hour), minute = parseInt(submitForm.minute), where1 = parseInt(submitForm.where1)

                          switch (submitForm.type) {
                            case 'hour':
                            case 'minute-n':
                              if (minute < 0 || minute > 59 || isNaN(minute)) return bt.msg({ status: false, msg: '请输入正确分钟范围0-59分' })
                              if (submitForm.type === 'minute-n') {
                                submitForm.where1 = submitForm.minute
                                submitForm.minute = ''
                                if(submitForm.where1 < 1) return bt.msg({ status: false, msg: '分钟不能小于1！' })
                              }
                              break;
                            case 'day-n':
                            case 'month':
                              if (where1 < 1 || where1 > 31 || isNaN(where1)) return bt.msg({ status: false, msg: '请输入正确天数1-31天' })
                            case 'week':
                            case 'day':
                            case 'hour-n':
                              if (hour < 0 || hour > 23 || isNaN(hour)) return bt.msg({ status: false, msg: '请输入小时范围0-23时' })
                              if (minute < 0 || minute > 59 || isNaN(minute)) return bt.msg({ status: false, msg: '请输入正确分钟范围0-59分' })
                              if (submitForm.type === 'hour-n') {
                                submitForm.where1 = submitForm.hour
                                submitForm.hour = ''
                                if(submitForm.minute <= 0 && submitForm.where1 <= 0) return bt.msg({ status: false, msg: '小时、分钟不能同时小于1！' })
                              }
                              break;
                          }
                          if (submitForm.sType == "site" || submitForm.sType == "database" || submitForm.sType == "path" || submitForm.sType == "logs") {
                            if (Number(submitForm.save) < 1 || submitForm.save == '') {
                              return bt.msg({ status: false, msg: '保留最新不能小于1！'});
                            }
                          }
													if (submitForm.sType == 'site' || submitForm.sType == 'database' || submitForm.sType == 'path') {
														if (submitForm.split_type == '') {
															submitForm.split_value = '';
														}
														if (submitForm.split_type == 'size' && submitForm.split_value < 1) {
															return layer.msg('拆分大小至少大于1MB');
														}
														if (submitForm.split_type == 'num' && submitForm.split_value < 2) {
															return layer.msg('拆分数量至少大于2');
														}
													}

                          var url = '/crontab?action=modify_crond', params = submitForm
                          if (submitForm.sType == 'enterpriseBackup' || submitForm.sType == 'mysql_increment_backup') {
														var multipleValues = $('.layui-layer-content select[name=backupTo').val();
														if (multipleValues == null) {
															return layer.msg('请最少选择一个备份类型');
														}
														submitForm['backupTo'] = multipleValues.join('|');
														submitForm['sName'] = rdata.sName;
														submitForm['sBody'] = rdata.sBody;
														submitForm['id'] = rdata.id;
														url = '/project/binlog/modify_mysql_increment_crontab';
														params = submitForm;
													} else {
						    if (submitForm.sType == 'database') {params['db_type'] = $('#editCrontabForm [name=db_type]').val();}
                            if($('select[name=sName]').length){
                              params.name.match(/\[(.*)]/)
                              var sName_result = formConfig[3].group[1].list.some(function(item){
                                if (item.value === (RegExp.$1.trim() === '所有'?'ALL':RegExp.$1.trim())) {
                                  return true
                                }
                              })
                              if(!sName_result) return layer.msg(formConfig[3].group[1].placeholder,{icon:2})
                            }
                          }
                          bt_tools.send({
                            url: url,
                            data: params
                          }, function (res) {
                            bt_tools.msg(res)
                            layer.close(indexs)
                            _that.crontabListTabel.$refresh_table_list(true);
                          }, '编辑计划任务')
                        }
                      })
										if($('.layui-layer-content').length>0){
											//增加提示
											$('.layui-layer-content input[name=tables_name]').attr('title', rdata.sBody.split(',').join('\n'));
											$('.layui-layer-content input[name=more]').attr('title',rdata.sName.split(',').join('\n'))
											$('.layui-layer-content .bt_multiple_select_updown .bt_select_value').attr('title',rdata.sName.split(',').join('\n'))
											// $('.layui-layer-content .bt_multiple_select_updown').find('.bt_select_value').attr('title',rdata.sName.split(',').join('\n'))
											$('input[name=name]').attr('title',rdata.sName.split(',').join('\n'))
											//重新渲染多选框
											if(rdata.sType=='site'||rdata.sType=='database'){
												var valList=form.sName.split(',')
												if(valList.length>1){
													var select_value=$('.layui-layer-content .bt_multiple_select_updown .bt_select_value')
													//最多显示2行
													select_value.find('.bt_select_content').slice(1).hide()
													var span = '<span class="moreTip" style="display: block;">...等' + valList.length + '个' + (rdata.sType == 'site' ? '网站' : '数据库') + '</span>';
													select_value.append(span)
													select_value.parents('.line').find('.tname').css({'line-height':select_value.height()+'px','height':select_value.height()+'px'})
												}
												$('.layui-layer-content .bt_multiple_select_updown .bt_select_value .icon-trem-close').remove()
															}
															// if(rdata.sType=='database'){

															// }
											}
                    }, '获取计划配置信息')
                  }
                })
              }
            }
          },
					{
						title: '日志',
						event: function (row, index, ev, key, that) {
							var log_interval = null;
							_that.getCrontabLogs(row, function (rdata) {
								if (row.sType == 'webshell') {
									layer.open({
										type: 1,
										title: lan.crontab.task_log_title,
										area: ['740px', '550px'],
										shadeClose: false,
										closeBtn: 2,
										content:
											'<div class="setchmod bt-form pd20">\
									<div style="margin-bottom:20px">\
								<button type="button" title="刷新日志"\
								class="btn btn-success btn-sm mr5 refreshCrontabLogs">刷新日志</button>\
								<button type="button" title="清理日志"\
									class="btn btn-default btn-sm mr5 clearLogs"><span>清理日志</span></button>\
									<button type="button" title="导出日志"\
										class="btn btn-default btn-sm mr5 deriveLogs"><span>导出日志</span></button>\
										<div style="float:right">\
											<button class="btn btn-sm btn-success Catalogue_show" \
												id="Catalogue_show_left">全部</button>\
											<button style="margin-left:-5px" class="btn btn-sm btn-default Catalogue_show" \
												id="Catalogue_show_right">异常</button>\
													<input id="time_choose" autocomplete="off" placeholder="自定义时间" type="text"></input>\
									</div>\
									</div>\
										<div class="crontab-log" id="crontab-logsHtml" style="overflow: auto; border: 0 none; line-height:23px;padding: 15px; margin: 0;white-space: pre-wrap; height: 405px; background-color: rgb(51,51,51);color:#f1f1f1;border-radius:0;"></div>\
									</div>',
										success: function () {
											var time = [];
											var typeLog = 'all';
											var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)
											var nScrollTop = 0; //滚动到的当前位置
											var nDivHight = $('.crontab-log').height();
											var isDb = true;
											$('.crontab-log').scroll(function () {
												nScrollHight = $(this)[0].scrollHeight;
												nScrollTop = $(this)[0].scrollTop;
												var paddingBottom = parseInt($(this).css('padding-bottom')),
													paddingTop = parseInt($(this).css('padding-top'));
												isDb = false;
												//判断是否滚动到底部
												if (nScrollTop + paddingBottom + paddingTop + nDivHight >= nScrollHight) {
													isDb = true;
												}
											});
											render_content(rdata);
											function render_content(data) {
												var crontab_log = $('.crontab-log')[0];
												if (data.msg == '') {
													data.msg = '当前日志为空！';
												}
												$('#crontab-logsHtml').html(data.msg);
												crontab_log.scrollTop = crontab_log.scrollHeight;
											}
											$('#clearLogs').on('click', function () {
												clearInterval(log_interval);
												_that.clearCrontabLogs(row, function () {
													$('.setchmod pre').text('');
												});
											});
											$('#closeLogs').on('click', function () {
												layer.closeAll();
											});
											$('.refreshCrontabLogs')
												.unbind('click')
												.click(function () {
													if (!row.id) return layer.msg('暂无计划任务，不支持刷新日志', { icon: 2 });
													getList({ id: row.id, type: typeLog, time_search: time });
												});
											$('.clearLogs').click(function () {
												var delForm;
												bt_tools.open({
													title: '清理日志',
													area: ['420px', '220px'],
													btn: ['确定', '取消'],
													content: '<div id="clearForm"></div>',
													success: function (layero) {
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
																		change: function (formData, element, that) {
																			// 选中下拉项后
																		},
																	},
																},
															],
														});
													},
													yes: function (data, indexs) {
														var dLoad = layer.msg('正在清理中...', { icon: 16, time: 0, shade: [0.3, '#000'] });
														bt_tools.send({ url: '/crontab?action=clear_logs', data: { id: row.id, day: delForm.$get_form_value().cSelect } }, function (ress) {
															layer.close(dLoad);
															layer.msg(ress.msg, { icon: ress.status ? 1 : 2 });
														});
														getList({ id: row.id, type: typeLog, time_search: time });
														layer.close(data);
													},
													cancel: function () {
														//点击右上角关闭时,如果btn:false,当前事件将无法使用
													},
												});
											});
											$('.deriveLogs').click(function () {
												var typeDay;
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
																		name: 'isError',
																		type: 'other',
																		display: true,
																		boxcontent:
																			'<div>\
									<button class="w-60px btn btn-sm btn-success bt-cp1-hover bt-cp Catalogue_shows"\
												id="Catalogue_show_all">全部</button>\
											<button style="margin-left:-5px" class="w-60px btn btn-sm btn-default bt-cp1-hover bt-cp Catalogue_shows"\
												id="Catalogue_show_seven">近7天</button>\
									<button style="margin-left:-5px" class="w-60px btn btn-sm btn-default bt-cp1-hover bt-cp Catalogue_shows"\
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
													yes: function (indexs, formD) {
														var Eload = layer.msg('正在导出中...', { icon: 16, time: 0, shade: [0.3, '#000'] });
														bt_tools.send(
															{ url: '/crontab?action=download_logs', data: { id: row.id, day: typeDay, type: deriveLogsForm.$get_form_value().isError ? 'warring' : '' } },
															function (ress) {
																layer.close(Eload);
																window.open('/download?filename=' + ress.msg);
																layer.msg(ress.status ? '导出日志成功' : ress.msg, { icon: ress.status ? 1 : 2 });
															}
														);
														layer.close(indexs);
													},
													cancel: function () {
														//点击右上角关闭时,如果btn:false,当前事件将无法使用
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
											$('.Catalogue_show').click(function () {
												$(this).addClass('btn-success').removeClass('btn-default').siblings().removeClass('btn-success').addClass('btn-default');
											});
											$('#Catalogue_show_left').click(function () {
												getList({ id: row.id, type: 'all', time_search: time });
												typeLog = 'all';
											});
											$('#Catalogue_show_right').click(function () {
												typeLog = 'warring';
												getList({ id: row.id, type: 'warring', time_search: time });
											});
											// $('#time_choose').removeAttr('lay-key');
											laydate.render({
												elem: '#time_choose',
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
													time = list;
													getList({ id: row.id, type: typeLog, time_search: time });
												},
											});
											function getList(data) {
												var getload = layer.msg('正在获取日志...', { icon: 16, time: 0, shade: [0.3, '#000'] });
												bt_tools.send(
													{ url: '/crontab?action=GetLogs', data: { id: data.id, type: data.type ? data.type : '', time_search: JSON.stringify(data.time_search) } },
													function (ress) {
														render_content(ress);
													},
													{ verify: false }
												);
												layer.close(getload);
											}
										},
										cancel: function (indexs) {
											layer.close(indexs);
										},
									});
								} else {
									layer.open({
										type: 1,
										title: lan.crontab.task_log_title,
										area: ['740px', '540px'],
										shadeClose: false,
										closeBtn: 2,
										content:
											'<div class="setchmod bt-form pd20">\
										<button id="clearLogs" class="btn btn-sm btn-default" style="margin-bottom:10px">清空日志</button>\
										<pre class="crontab-log" style="overflow: auto; border: 0 none; line-height:23px;padding: 15px; margin: 0;white-space: pre-wrap; height: 405px; background-color: rgb(51,51,51);color:#f1f1f1;border-radius:0;"></pre>\
									</div>',
										success: function () {
											randomNPSTouch = Math.floor(Math.random() * (3 + 1));
											var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)
											var nScrollTop = 0; //滚动到的当前位置
											var nDivHight = $('.crontab-log').height();
											var isDb = true;
											$('.crontab-log').scroll(function () {
												nScrollHight = $(this)[0].scrollHeight;
												nScrollTop = $(this)[0].scrollTop;
												var paddingBottom = parseInt($(this).css('padding-bottom')),
													paddingTop = parseInt($(this).css('padding-top'));
												isDb = false;
												//判断是否滚动到底部
												if (nScrollTop + paddingBottom + paddingTop + nDivHight >= nScrollHight) {
													isDb = true;
												}
											});
											var data_text = '';
											log_interval = setInterval(function () {
												bt_tools.send(
													{
														url: '/crontab?action=GetLogs',
														data: { id: row.id },
													},
													function (res) {
														if (res.status) {
															var arr = res.msg.split('\n');
															if ($('.layui-layer-content').length < 1) clearInterval(log_interval);
															if (data_text === res.msg && arr[arr.length - 1].indexOf('-------') > -1) {
																clearInterval(log_interval);
																return;
															}

															if (data_text === res.msg && arr[arr.length - 1].indexOf('========') > -1) {
																clearInterval(log_interval);
																return;
															}
															if (isDb) render_content(res);
														}
													}
												);
											}, 2000);
											render_content(rdata);
											function render_content(data) {
												var log_body = data.msg === '' ? '当前日志为空' : data.msg,
													setchmod = $('.setchmod pre'),
													crontab_log = $('.crontab-log')[0];
													log_body = log_body.replace(/&nbsp;/g, ' ');
												setchmod.text(log_body);
												if (crontab_log) {
													crontab_log.scrollTop = crontab_log.scrollHeight;
												}
											}
											// 点击清空日志
											$('#clearLogs').on('click', function () {
												bt.confirm(
													{
														title: '清空日志确认',
														msg: '确定要清除该任务执行日志吗？',
													},
													function (indexs) {
														clearInterval(log_interval);
														_that.clearCrontabLogs(row, function () {
															$('.setchmod pre').text('当前日志为空');
														});
													}
												);
											});
											// 点击关闭日志
											// $('#closeLogs').on('click', function () {
											//   setTimeout(function (){
											//     if(crontabNpsShow && randomNPSTouch==2){
											//       bt_tools.nps({name:'计划任务',type:6})
											//       crontabNpsShow = false
											//       bt.set_cookie('crontab_nps','1',86400000*365)
											//     }
											//   },500)
											//   clearInterval(log_interval)
											//   layer.closeAll()
											// })
										},
										cancel: function (indexs) {
											clearInterval(log_interval);
											// setTimeout(function () {
											// 	if (crontabNpsShow && 2 == 2) {
											// 		bt_tools.nps({ name: '计划任务', type: 5,soft:'crontab' });
											// 		crontabNpsShow = false;
											// 		bt.set_cookie('crontab_nps', '1', 86400000 * 365);
											// 	}
											// }, 500);
											layer.close(indexs);
										},
									});
								}
							});
						},
					},
					 {
            title: '删除',
            event: function (row, index, ev, key, that) {
              bt.confirm(
								{
									title: '删除计划任务',
									msg: '您确定要删除计划任务【' + row.name + '】，是否继续？',
								},
								function () {
									if (row.sType == 'enterpriseBackup') {
										var arry = [];
										arry = row.urladdress.split('|');
										bt_tools.send({ url: 'project/binlog/delete_mysql_binlog_setting', data: { cron_id: row.id, backup_id: arry[2], type: 'cron' } }, function (res) {
											layer.msg(res.msg, { icon: res.status ? 1 : 2 });
											that.$refresh_table_list(true);
										});
									} else {
										_that.delCrontab(row, function () {
										// setTimeout(function () {
										// 	if (crontabNpsShow && randomNPSTouch == 3) {
										// 		bt_tools.nps({ name: '计划任务', type: 6, soft:'crontab'});
										// 		crontabNpsShow = false;
										// 		bt.set_cookie('crontab_nps', '1', 86400000 * 365);
										// 	}
										// }, 500);
											that.$refresh_table_list(true);
										});
									}
								}
							);
            }
          }]
        }
      ],
			success:function(that){
				$('.crontab_show_backup').click(function(){
					var backup_id = Number($(this).data('id')),backup_name = $(this).data('name')
					var content_html = '<div style="padding:20px"><div id="backup_table_show"></div></div>'
					layer.open({
						type: 1,
						closeBtn:2,
						title:backup_name+'-备份文件',
						content: content_html,
						area: ['700px', '530px'],
						success:function(){
							var backup_table = bt_tools.table({
								el: '#backup_table_show',
								url: '/crontab?action=get_backup_list',
								param: {cron_id: backup_id},
								autoHeight: true,
								default: "列表为空",
								pageName: 'backup',
								column: [
									{fid: 'name', title: '文件名称',width:180,fixed:true},
									{fid: 'addtime', title: '备份时间'},
									{fid: 'filename', title: '备份到',width:220,fixed:true},
									{fid: 'size',type:'text', title: '文件大小',template:function(row){
										return bt.format_size(row.size)
									}},
									{
										title:'操作',
										type: 'group',
										align: 'right',
										group: [{
											title: '下载',
											event: function (row, index, ev, key, that) {
                        bt_tools.send({url:'/crontab?action=cloud_backup_download',data:{cron_id: backup_id,filename:row.filename}},function(rdata){
													if(rdata.status){
														if(rdata.is_loacl ){
															window.open('/download?filename=' + encodeURIComponent(rdata.path));
														}else{
															window.open(rdata.path)
														}
													}else{
														bt.msg(rdata)
													}
												})
											}
										}],
									},
								],
								tootls: [ {
									type: 'page',
									positon: ['right', 'bottom'], // 默认在右下角
									pageParam: 'p', //分页请求字段,默认为 : p
									page: 1, //当前分页 默认：1
									numberParam: 'rows',
									//分页数量请求字段默认为 : limit
									defaultNumber: 10
									//分页数量默认 : 20条
								}]
							})
						}
					})
				})
				//置顶设置
				$('#crontabTabel').find('tr').on('mouseenter',function(){
					if($(this).find('img').hasClass('crontab-gray')){
						$(this).find('img').show()
					}
				})
				$('#crontabTabel').find('tr').on('mouseleave',function(){
					if($(this).find('img').hasClass('crontab-gray')){
						$(this).find('img').hide()
					}
				})
				// bt_tools.send({
				// 	url: '/crontab?action=set_task_top',
				// }, function (res) {
					// var topping_list=res.list
					$('.crontab-topping').each(function(){
						var id = Number($(this).data('id'))
						if((topping_list.indexOf(id+'') != -1)){
							$(this).removeClass('crontab-gray')
							$(this).attr('title','取消置顶')
							$(this).show()
						}
					})
					$('.crontab-topping').off('click').on('click',function(){
						var id = Number($(this).data('id'))
						if(topping_list.indexOf(id+'') != -1){
							//取消置顶
							bt_tools.send({
								url: '/crontab?action=cancel_top'
							},{
								task_id:id
							}, function (res) {
								_that.getToppingList(crontabTableObj);
							});
						}else{
							// 置顶
							bt_tools.send({
								url: '/crontab?action=set_task_top'
							},{
								task_id:id
							}, function (res) {
								_that.getToppingList(crontabTableObj);
							});
						}
					})
				//  小屏1440*900的计划任务列表的操作列显示混乱问题
				$('#crontabTabel tbody tr td .action').parent().css({width:'170px'})
				// 任务列表搜索事件绑定
				$('.order_search .glyphicon-search').off('click').on('click',function(){
					crontab.searchOrder($('.order_search .search_input').val(), crontabTableObj);
				})
				$('.order_search .search_input').off('focus').on('focus',function(){
					$(document).off('keydown').on('keydown',function(e){
						if(e.keyCode===13){
							crontab.searchOrder($('.order_search .search_input').val(), crontabTableObj);
						}
					})
				})
				$('.order_search .search_input').off('blur').on('blur',function(){
					$(document).off('keydown')
				})
			},
      // 渲染完成
      tootls: [{ // 批量操作
        type: 'batch', //batch_btn
        positon: ['left', 'bottom'],
        placeholder: '请选择批量操作',
        buttonValue: '批量操作',
        disabledSelectValue: '请选择需要批量操作的计划任务!',
        selectList: [{
          title: "执行任务",
					callback: function (that) {
						// 执行已有方法
						var confirm = bt.confirm({
              title: '批量执行任务',
              msg: '您确定要批量执行选中的计划任务吗，是否继续？'
            }, function () {
							layer.close(confirm)
							var id_list = [];
							for(var i=0;i<that.check_list.length;i++){
							id_list.push(that.check_list[i].id)
							}
							layer.msg('正在批量执行任务,请稍候...', {
								icon: 16,
								skin: 'batch_tips',
								shade: .3,
								time: 0,
								area: '400px'
							})
							bt_tools.send({
								url: '/crontab?action=set_cron_status_all'
							},{
								id_list:JSON.stringify(id_list),
								type:'exec'
							}, function (res) {
								layer.closeAll()
                var html = '';
							for (var i = 0; i < res.length; i++) {
								var item = res[i];
								var status = item.status?'#20a53a':'#ef0808'
								delete item.status
								for(var j in item){
									html += '<tr><td>' + j + '</td><td><div style="float:right;"><span style="color:'+ status +'">' + item[j] + '</span></div></td></tr>';
								}
                }
                _that.crontabListTabel.$batch_success_table({
                  title: '批量执行',
                  th: '任务名称',
                  html: html
                });
                _that.crontabListTabel.$refresh_table_list(true);
              });
            })
					},
        }, {
          title: '启动任务',
					callback: function (that) {
							// 执行已有方法
							var confirm = bt.confirm({
								title: '批量启动任务',
								msg: '您确定要批量启动选中的计划任务吗，是否继续？'
							}, function () {
								layer.close(confirm)
								var id_list = [];
								for(var i=0;i<that.check_list.length;i++){
								id_list.push(that.check_list[i].id)
          }
								layer.msg('正在执行批量启动任务,请稍候...', {
									icon: 16,
									skin: 'batch_tips',
									shade: .3,
									time: 0,
									area: '400px'
								})
								bt_tools.send({
									url: '/crontab?action=set_cron_status_all'
								},{
									id_list:JSON.stringify(id_list),
									type:'start'
								}, function (res) {
									layer.closeAll()
									var html = '';
                for (var i = 0; i < res.length; i++) {
                  var item = res[i];
									var status = item.status?'#20a53a':'#ef0808'
									delete item.status
									for(var j in item){
										html += '<tr><td>' + j + '</td><td><div style="float:right;"><span style="color:'+ status +'">' + item[j] + '</span></div></td></tr>';
									}
                }
									_that.crontabListTabel.$batch_success_table({
										title: '批量启动',
										th: '任务名称',
										html: html
									});
									_that.crontabListTabel.$refresh_table_list(true);
								});
							})
					},
        },{
					title: '停止任务',
					callback: function (that) {
							// 执行已有方法
							bt.confirm({
								title: '批量停止任务',
								msg: '您确定要批量停止选中的计划任务吗，是否继续？'
							}, function () {
								var id_list = [];
								for(var i=0;i<that.check_list.length;i++){
								id_list.push(that.check_list[i].id)
								}
								layer.msg('正在执行批量停止任务,请稍候...', {
									icon: 16,
									skin: 'batch_tips',
									shade: .3,
									time: 0,
									area: '400px'
								})
								bt_tools.send({
									url: '/crontab?action=set_cron_status_all'
								},{
									id_list:JSON.stringify(id_list),
									type:'stop'
								}, function (res) {
									layer.closeAll()
									var html = '';
								for (var i = 0; i < res.length; i++) {
									var item = res[i];
									var status = item.status?'#20a53a':'#ef0808'
									delete item.status
									for(var j in item){
										html += '<tr><td>' + j + '</td><td><div style="float:right;"><span style="color:'+ status +'">' + item[j] + '</span></div></td></tr>';
									}
								}
									_that.crontabListTabel.$batch_success_table({
										title: '批量停止',
										th: '任务名称',
										html: html
									});
									_that.crontabListTabel.$refresh_table_list(true);
								});
							})
					},
				},{
          title: "删除任务",
          // url: function (row) {
          //     return '/crontab?action=DelCrontab&id='+ row.id
          // },
          // load: true,
          // // param: function (row) {
          // //   return { id: row.id }
          // // },
          // callback: function (that) { // 手动执行,data参数包含所有选中的站点
          //   bt.show_confirm("批量删除计划任务", "<span style='color:red'>同时删除选中的计划任务，是否继续？</span>", function () {
          //     var param = {};
          //     that.start_batch(param, function (list) {
          //       var html = '';
          //       for (var i = 0; i < list.length; i++) {
          //         var item = list[i];
          //         html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + item.request.msg + '</span></div></td></tr>';
          //       }
          //       _that.crontabListTabel.$batch_success_table({
          //         title: '批量删除',
          //         th: '任务名称',
          //         html: html
          //       });
          //       _that.crontabListTabel.$refresh_table_list(true);
          //     });
          //   });
          // }
					callback: function (that) {
						// 执行已有方法
						bt.confirm({
							title: '批量删除任务',
							msg: '您确定要批量删除选中的计划任务吗，是否继续？'
						}, function () {
							var id_list = [];
							for(var i=0;i<that.check_list.length;i++){
							id_list.push(that.check_list[i].id)
							}
							layer.msg('正在执行批量删除任务,请稍候...', {
								icon: 16,
								skin: 'batch_tips',
								shade: .3,
								time: 0,
								area: '400px'
							})
							bt_tools.send({
								url: '/crontab?action=set_cron_status_all'
							},{
								id_list:JSON.stringify(id_list),
								type:'del'
							}, function (res) {
								layer.closeAll()
                var html = '';
							for (var i = 0; i < res.length; i++) {
								var item = res[i];
								var status = item.status?'#20a53a':'#ef0808'
								delete item.status
								for(var j in item){
									html += '<tr><td>' + j + '</td><td><div style="float:right;"><span style="color:'+ status +'">' + item[j] + '</span></div></td></tr>';
								}
                }
                _that.crontabListTabel.$batch_success_table({
                  title: '批量删除',
                  th: '任务名称',
                  html: html
                });
                _that.crontabListTabel.$refresh_table_list(true);
              });
						})
					},
        }],
      }]
    })
		return crontabTableObj;
  },
	/**
   * @descripttion 搜索任务列表
   */
	searchOrder:function(val,that){
		that.config.param={search:val}
		that.$refresh_table_list()
	},
	/**
   * @descripttion 获取置顶列表
   */
	getToppingList:function(that){
		bt_tools.send({
			url: '/crontab?action=set_task_top',
		}, function (res) {
			topping_list=res.list
			if(that){
				that.$refresh_table_list()
			}
		})
	},
	/**
   * @descripttion 获取时区列表
   */
	getTimeZoneList:function(that){
		bt_tools.send({
			url: '/crontab?action=get_zone',
		}, function (res) {
			timeZone= res.status
			var list = res
			delete list.status
			for(var i in list){
				regionList.push({title:i,value:i})
				timeZoneListObj[i]=[]
				for(var j=0;j<list[i].length;j++){
					timeZoneListObj[i].push({title:list[i][j],value:list[i][j]})
				}
			}
		})
	},
	/**
	 * @descripttion 获取本地域名列表
	 */
	getLocalDomainList:function(that){
		bt_tools.send({
			url: '/crontab?action=get_domain',
		}, function (res) {
			localDomainList= res
		})
	},
  /**
   * @descripttion 消息推送下拉
   */
  pushChannelMessage:{
    //获取通道状态
    getChannelSwitch:function(data,type) {
      var arry = [{title: '全部通道', value: ''}], info = [];
      for (var resKey in data) {
        if (data.hasOwnProperty(resKey)) {
          var value = resKey, item = data[resKey]
          if (!item['setup'] || $.isEmptyObject(item['data'])) continue
          info.push(value)
          arry.push({title: item.title, value: value})
        }
      }
      arry[0].value = info.join(',');
      if (type === 'webshell') arry.shift();
      if (arry.length === (type === 'webshell' ? 0 : 1)) return []
      return arry
    }
  },
	 /**
     * 测试URL合法，并渲染展示
     * @param {Object} formData 表单的数据，里面有url地址
     * @returns
     */
	 validationURLHandel: function (formData) {
		if (formData.sType === 'toUrl') {
				if (!bt.check_url(formData.urladdress)) {
						bt.msg({ status: false, msg: 'URL地址格式错误' });
						$('.bt-input-text[name=urladdress]')[0].clientHeight;
						$('.bt-input-text[name=urladdress]')[0].focus();
						$('.bt-input-text[name=urladdress]')[0].autocomplete = 'off';
						return;
				}

				//发送网络请求
				var loadT = layer.msg('正在测试url，请稍侯...', {
					icon: 16,
					time: 0,
					shade: 0.3,
				});
				bt_tools.send({ url: '/crontab?action=check_url_connecte', data: { url: formData.urladdress } }, function (data) {
						bt_tools.open({
								title: '测试URL结果',
								area: [700, 600],
								btn: false,
								skin: 'www',
								content: {
										class: 'testUrl',
										form: [
												{
														label: '响应状态：',
														group: {
																name: 'statusCode',
																class: data.status_code === 200 ? 'green' : 'red',
																type: 'other',
																boxcontent: '<div >' + (data.status_code === 200 ? '正常访问 （200）' : '异常（404）') + '</div>',
														},
												},
												{
														label: '响应时间：',
														group: {
																name: 'time',
																type: 'other',
																class: data.time.slice(0, -2) / 1000 < 2 ? 'green' : data.time.slice(0, -2) / 1000 < 6 ? 'orange' : 'red',
																boxcontent: '<div >' + data.time + '</div>',
														},
												},
												{
														label: '响应内容：',
														group: {
																name: 'script',
																type: 'other',
																boxcontent: '<div class="bt-input-text" style="width:482px;height: 274px;min-height:274px;line-height:18px;" id="scriptBody"></div>',
														},
												},
										],
								},
								success: function () {
									_aceEditor = crontab_ace();
									// 编辑器
									function crontab_ace(){
										$('#scriptBody').css('fontSize', '12px');
										return ace.edit('scriptBody', {
											theme: "ace/theme/chrome", //主题
											mode: "ace/mode/python", // 语言类型
											wrap: true,
											showInvisibles: false,
											showPrintMargin: false,
											showFoldWidgets: false,
											useSoftTabs: true,
											tabSize: 2,
											showPrintMargin: false,
											readOnly: false
										})
									}
									$('.ace_scrollbar')[0].classList.add('messageCard');
									_aceEditor.setValue(data.txt);
									_aceEditor.clearSelection();
									// if (data.txt.includes("＜!DOCTYPE html＞")) {
									// 	_aceEditor.session.setMode("ace/mode/HTML");
									// }
									layer.close(loadT);
									// $('.layui-layer-content')[0].style.height='437px';
									$('.ww .layui-layer-title').css({ height: '44px' });
									$('.www .layui-layer-content').css({ width: '590px', height: '422px' });
									$('.testUrl .inlineBlock').css({ 'margin-left': '-10px', 'line-height': '32px' });
									$('.testUrl')[0].style.padding = '10px 0';
									// $('.line').css({padding:'10px 0',height:'52px'})
									// $('.line')[2].style.padding='10px 0';
								},
							});
						});
		}
	},

  /**
   * @description 初始化
   */
  init: function () {
    var that = this;
		this.getToppingList() //获取置顶列表
		this.getTimeZoneList() //获取时区列表
		this.getLocalDomainList() //获取本地域名列表
    this.getAllDatabases() //获取所有数据库
    this.getDataList(function () { //获取所有计划任务
      that.addCrontabTable = that.addCrontabForm()
			$('[title="数据库增量备份"]').html('<span style="display:flex;align-items:center">数据库增量备份<span class="new-file-icon new-ltd-icon" style="margin-left:4px"></span></span>')
      that.crontabListTabel = that.crontabTabel()
      that.getDataList('databases');
    })
    function resizeTable () { //计划任务列表高度自适应
      var height = window.innerHeight - 795, table = $('#crontabTabel .divtable');
      table.css({ maxHeight: height < 400 ? '400px' : (height + 'px') })
    }
    $(window).on('resize', resizeTable) //窗口变化时计划任务列表高度自适应
    setTimeout(function () {
      resizeTable()
    }, 500)
  }
}
var trigger = {
	that_trigger: null, //当前任务编排ID
	trigger_event_table: null, //事件列表
	/**
	 * @description 获取任务编排列表
	 */
	get_trigger_list: function () {
		var _this = this;
		var ltd_end = bt.get_cookie('ltd_end');
		if (ltd_end < 0) return;
		$('#crontabTrigger').next().hide();
		var triggerTable = bt_tools.table({
			el: '#crontabTrigger',
			url: '/crontab/trigger/get_trigger_list',
			minWidth: '1000px',
			load: true,
			autoHeight: true,
			default: '任务列表为空', //数据为空时的默认提示
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
				{ fid: 'name', title: '任务名称', type: 'text' },
				{
					fid: 'cycle_type',
					title: '执行周期',
					type: 'text',
					template: function (row) {
						return '<span>' + _this.render_cycle_text(row) + '</span>';
					},
				},
				{ fid: 'ps', title: '备注', type: 'text' },
				{
					fid: 'create_time',
					width: 137,
					title: '创建时间',
					template: function (row) {
						return '<span>' + bt.format_data(row.create_time) + '</span>';
					},
				},
				{
					fid: 'last_exec_time',
					width: 137,
					title: '上次执行时间',
					template: function (row) {
						var last_time = typeof row.last_exec_time != 'number' ? '-' : bt.format_data(row.last_exec_time);
						return '<span>' + last_time + '</span>';
					},
				},
				{
					type: 'group',
					title: '操作',
					align: 'right',
					group: [
						{
							title: '执行',
							event: function (row) {
								bt.confirm({ title: '执行脚本', msg: '立即执行[' + row.name + ']中的脚本任务，执行过程可能等待时间较长，请耐心等待。是否继续？' }, function (index) {
									layer.close(index);
									bt_tools.send(
										{ url: '/crontab/trigger/test_trigger', data: { data: JSON.stringify({ trigger_id: row.trigger_id }) } },
										function (rdata) {
											_this.execute_result(row.name, rdata);
											triggerTable.$refresh_table_list(true);
										},
										{ load: '执行' + row.name, verify: false }
									);
								});
							},
						},
						{
							title: '事件',
							event: function (row) {
								_this.get_trigger_event(row);
							},
						},
						{
							title: '编辑',
							event: function (row) {
								_this.render_trigger_view(row);
							},
						},
						{
							title: '日志',
							event: function (row) {
								_this.get_execute_log({ name: row.name, param: { trigger_id: row.trigger_id }, url: '/trigger/get_trigger_logs', load: '任务' });
							},
						},
						{
							title: '删除',
							event: function (row, index, ev, key, that) {
								bt.confirm({ title: '删除[' + row.name + ']', msg: '删除后不再执行任务规则,是否继续操作？' }, function (index) {
									bt_tools.send(
										{ url: '/crontab/trigger/remove_trigger', data: { trigger_id: row.trigger_id } },
										function (rdata) {
											if (rdata.status) that.$refresh_table_list(true);
											bt_tools.msg(rdata);
										},
										'删除任务'
									);
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
							title: '创建任务',
							active: true,
							event: function () {
								_this.render_trigger_view();
							},
						},
					],
				},
				{
					type: 'batch', //batch_btn
					positon: ['left', 'bottom'],
					config: {
						title: '删除任务',
						url: '/crontab/trigger/remove_trigger',
						load: true,
						param: function (row) {
							return { trigger_id: row.trigger_id };
						},
						callback: function (that) {
							bt.confirm(
								{
									title: '批量删除任务',
									msg: '批量删除后不再执行任务规则，是否继续？',
								},
								function () {
									that.start_batch({}, function (list) {
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
										triggerTable.$batch_success_table({
											title: '批量删除',
											th: '任务名称',
											html: html,
										});
										triggerTable.$refresh_table_list(true);
									});
								}
							);
						},
					},
				},
				{
					type: 'search',
					positon: ['right', 'top'],
					placeholder: '请输入关键字',
					searchParam: 'search', //搜索请求字段，默认为 search
					value: '', // 当前内容,默认为空
				},
				{
					//分页显示
					type: 'page',
					positon: ['right', 'bottom'], // 默认在右下角
					pageParam: 'p', //分页请求字段,默认为 : p
					page: 1, //当前分页 默认：1
					numberParam: 'rows', //分页数量请求字段默认为 : limit
					number: 20, //分页数量默认 : 20条
					numberList: [10, 20, 50, 100, 200], // 分页显示数量列表
					numberStatus: true, //　是否支持分页数量选择,默认禁用
					jump: true, //是否支持跳转分页,默认禁用
				},
			],
		});
	},
	/**
	 * @description 创建、编辑任务
	 * @param {Object} row  编辑时传入的行数据
	 */
	render_trigger_view: function (row) {
		var _this = this,
			_btn = ['创建', '取消'],
			_title = '创建任务',
			triggerOpenView = null,
			_aceEditor = null;
		var formConfig = [
			{
				label: '名称',
				group: {
					name: 'name',
					type: 'text',
					placeholder: '请输入任务名称',
					width: '280px',
					event: function () {
						if (!row) {
							$('[name=name]').on('input', function () {
								$('[name=ps]').val($(this).val());
							});
						}
					},
				},
			},
			{
				label: '执行周期',
				group: [
					{
						type: 'select',
						name: 'cycle_type',
						value: 'day',
						width: '70px',
						list: [
							{ title: '每天', value: 'day' },
							{ title: 'N天', value: 'day-n' },
							{ title: '每小时', value: 'hour' },
							{ title: 'N小时', value: 'hour-n' },
							{ title: 'N分钟', value: 'minute-n' },
							{ title: '每月', value: 'month' },
						],
						change: function (formData, element, that) {
							_this.crontabType(that.config.form, formData);
							that.$replace_render_content(1);
						},
					},
					{
						type: 'number',
						display: false,
						name: 'cycle_where',
						class: 'group',
						width: '52px',
						value: '3',
						unit: '日',
						min: 1,
						max: 31,
					},
					{
						type: 'number',
						name: 'cycle_hour',
						class: 'group',
						width: '52px',
						value: '1',
						unit: '小时',
						min: 0,
						max: 23,
					},
					{
						type: 'number',
						name: 'cycle_minute',
						class: 'group',
						width: '52px',
						min: 0,
						max: 59,
						value: '30',
						unit: '分钟',
					},
				],
			},
			{
				label: '运行',
				group: [
					{
						name: 'script_type',
						type: 'select',
						width: '100px',
						value: 'registry',
						list: [
							{ title: '脚本库', value: 'registry' },
							{ title: '自定义脚本', value: 'custom' },
						],
						change: function (formData, element, that) {
							that.config.form[2].group[0].value = formData.script_type;
							if (formData.script_type == 'custom') {
								that.config.form[2].group[1].display = false;
								that.config.form[2].group[2].display = true;

								// 是否已展示脚本参数
								if (that.config.form[4].group.display) {
									that.config.form[4].label = '';
									that.config.form[4].group.display = false; //隐藏参数
									that.$replace_render_content(4);
								}
							} else {
								that.data.script_id = ''; //清除上次选中的值
								that.config.form[2].group[1].display = true;
								that.config.form[2].group[2].display = false;
							}
							that.$replace_render_content(2);
							if (formData.script_type == 'custom') {
								_aceEditor = crontab_ace();
								$('.trigger_box').css('top', ($(window).height() - $('.trigger_box').height()) / 2);
							}
						},
					},
					{
						name: 'script_id',
						type: 'secondaryMenu',
						width: '170px',
						placeholder: '请选择脚本',
						list: (function () {
							return _this.render_script_list();
						})(),
						change: function (formData, element, that, lineData) {
							var $this = $(this);
							var parentIndex = $this.parent().parent().parent().index(); //当前选中的数据的父级索引
							var index = $this.index(); //当前选中的数据的索引
							var childenData = lineData.list[parentIndex].child[index]; //当前选中的数据
							if (childenData.is_args == 1) {
								that.config.form[4].group.display = true;
								that.config.form[4].label = childenData.args_title;
								that.config.form[4].group.placeholder = childenData.args_ps;
								that.data.args = '';
							} else {
								that.config.form[4].group.display = false;
								that.config.form[4].label = '';
							}
							that.config.form[2].group[0].value = formData.script_type;
							that.$replace_render_content(2);
							that.$replace_render_content(4);
						},
					},
					{
						name: 'script_body',
						type: 'other',
						display: false,
						boxcontent: '<div class="bt-input-text" style="width:390px;height: 200px;min-height:200px;line-height:18px;margin-top: 10px;" id="scriptBody"></div>',
					},
				],
			},
			{
				label: '备注',
				group: {
					name: 'ps',
					type: 'text',
					placeholder: '备注',
					width: '280px',
				},
			},
			{
				label: '',
				group: {
					display: false,
					name: 'args',
					type: 'text',
					placeholder: '',
					width: '280px',
				},
			},
		];
		if (row) {
			_btn = ['保存', '取消'];
			_title = '编辑任务';
			if (row.script_id == 0 && row.script_body != '') {
				formConfig[2].group[0].value = 'custom';
				formConfig[2].group[1].display = false;
				formConfig[2].group[2].display = true;
			}
			if (!$.isEmptyObject(row.script_info) && row.script_info.is_args == 1) {
				formConfig[4].group.display = true;
				formConfig[4].label = row.script_info.args_title;
				formConfig[4].group.placeholder = row.script_info.args_ps;
			}
			_this.crontabType(formConfig, row);
		}
		bt_tools.open({
			type: 1,
			area: '570px',
			title: _title,
			closeBtn: 2,
			skin: 'trigger_box',
			btn: _btn,
			content: '<div class="pd20" id="trigger_form_box"></div>',
			success: function (layers) {
				triggerOpenView = bt_tools.form({
					el: '#trigger_form_box',
					data: row || {},
					form: formConfig,
				});
				$(layers).find('.layui-layer-content').css('overflow', 'inherit');
				if (row && row.script_id == 0 && row.script_body != '') {
					_aceEditor = crontab_ace();
					_aceEditor.setValue(row.script_body);
					$(layers).css('top', ($(window).height() - $(layers).height()) / 2);
				}
			},
			yes: function (layers) {
				var formValue = triggerOpenView.$get_form_value();
				if (formValue.name == '') return bt.msg({ msg: '请输入任务名称', icon: 2 });
				var hour = parseInt(formValue.cycle_hour),
					minute = parseInt(formValue.cycle_minute),
					where1 = parseInt(formValue.cycle_where);
				switch (formValue.cycle_type) {
					case 'hour':
					case 'minute-n':
						if (minute < 0 || minute > 59 || isNaN(minute)) return bt.msg({ status: false, msg: '请输入正确分钟范围0-59分' });
						if (formValue.cycle_type == 'minute-n') {
							formValue.cycle_where = minute;
							formValue.cycle_minute = '';
							if (formValue.cycle_where < 1) return bt.msg({ status: false, msg: '分钟不能小于1！' });
						}
						break;
					case 'day-n':
					case 'month':
						if (where1 < 1 || where1 > 31 || isNaN(where1)) return bt.msg({ status: false, msg: '请输入正确天数1-31天' });
					case 'week':
					case 'day':
					case 'hour-n':
						if (hour < 0 || hour > 23 || isNaN(hour)) return bt.msg({ status: false, msg: '请输入小时范围0-23时' });
						if (minute < 0 || minute > 59 || isNaN(minute)) return bt.msg({ status: false, msg: '请输入正确分钟范围0-59分' });
						if (formValue.cycle_type === 'hour-n') {
							formValue.cycle_where = formValue.cycle_hour;
							formValue.cycle_hour = '';
							if (minute <= 0 && hour <= 0) return bt.msg({ status: false, msg: '小时、分钟不能同时小于1！' });
						}
						break;
				}
				if (typeof formValue.cycle_where == 'undefined') formValue.cycle_where = '';
				if (typeof formValue.cycle_hour == 'undefined') formValue.cycle_hour = '';
				if (formValue.script_type == 'custom') {
					formValue.script_body = _aceEditor.getValue();
					if (formValue.script_body == '') {
						layer.msg('脚本内容不能为空!', { icon: 2 });
						return;
					}
				} else {
					formValue.script_body = '';
					if (formValue.script_id == '') return bt.msg({ status: false, msg: '请选择脚本' });
				}
				if (formValue.script_id >= 0) {
					formValue.script_id = parseInt(formValue.script_id);
				} else {
					formValue.script_id = 0;
				}
				formValue.operator_where = [];
				delete formValue['script_type'];
				if (row) formValue.trigger_id = row.trigger_id;
				if (typeof formValue.args != 'undefined' && formValue.args == '') return bt.msg({ status: false, msg: '请填写' + $('input[name=args]').parents('.line').find('.tname').text() });
				bt_tools.send(
					{ url: '/crontab/trigger/' + (row ? 'modify_trigger' : 'create_trigger'), data: { data: JSON.stringify(formValue) } },
					function (res) {
						if (res.status) {
							layer.close(layers);
							_this.get_trigger_list();
						}
						bt_tools.msg(res);
					},
					(row ? '修改' : '创建') + '任务'
				);
			},
		});
	},
	/**
	 * @description 类型解构调整
	 * @param {Object} config  配置
	 * @param {Object} formData 当前form数据
	 */
	crontabType: function (config, formData) {
		var formConfig = config[1];
		switch (formData.cycle_type) {
			case 'day-n':
			case 'month':
			case 'day':
				$.extend(formConfig.group[1], {
					display: formData.cycle_type !== 'day',
					unit: formData.cycle_type === 'day-n' ? '天' : '日',
				});
				formConfig.group[2].display = true;
				break;
			case 'hour-n':
			case 'hour':
			case 'minute-n':
				formConfig.group[1].display = false;
				formConfig.group[2].display = formData.cycle_type === 'hour-n';
				formConfig.group[3].value = formData.cycle_type === 'minute-n' ? 3 : 30;
				break;
		}
		var hour = formData.cycle_hour ? formData.cycle_hour : 1;
		var minute = formData.cycle_minute ? formData.cycle_minute : 30;
		formConfig.group[2].value = formData.cycle_type == 'hour-n' && formData.cycle_where >= 0 ? parseInt(formData.cycle_where).toString() : parseInt(hour).toString();
		formConfig.group[3].value = formData.cycle_type == 'minute-n' && formData.cycle_where >= 0 ? parseInt(formData.cycle_where).toString() : parseInt(minute).toString();
		formConfig.group[0].value = formData.cycle_type;
		return config;
	},
	/**
	 * @description 渲染执行周期
	 * @param {Object} row 行数据
	 */
	render_cycle_text: function (row) {
		switch (row.cycle_type) {
			case 'day':
				return '每天' + row.cycle_hour + '点' + row.cycle_minute + '分 执行';
			case 'day-n':
				return '每隔' + row.cycle_where + '天,' + row.cycle_hour + '点' + row.cycle_minute + '分 执行';
			case 'hour':
				return '每小时,第' + row.cycle_minute + '分钟 执行';
			case 'hour-n':
				return '每' + row.cycle_where + '小时,第' + row.cycle_minute + '分钟 执行';
			case 'minute-n':
				return '每隔' + row.cycle_where + '分钟执行';
			case 'month':
				return '每月,' + row.cycle_where + '日 ' + row.cycle_hour + '点' + row.cycle_minute + '分 执行';
		}
	},
	/**
	 * @description 渲染任务编排事件列表
	 * @param {Object} rowEvent 行数据
	 */
	get_trigger_event: function (rowEvent) {
		var _this = this;
		this.that_trigger = rowEvent;
		bt_tools.open({
			title: '[' + rowEvent.name + ']事件',
			area: '650px',
			skin: 'trigger_event_box',
			btn: false,
			default: '事件列表为空', //数据为空时的默认提示
			content: '<div class="pd20" id="trigger_event_table"></div>',
			success: function (layers, indexs) {
				_this.trigger_event_table = bt_tools.table({
					el: '#trigger_event_table',
					url: '/crontab/trigger/get_operator_where_list',
					load: true,
					height: 248,
					param: { trigger_id: rowEvent.trigger_id },
					column: [
						{ type: 'checkbox', class: '', width: 20 },
						{
							title: '触发内容',
							width: 440,
							template: function (row) {
								return '<span>当执行结果[' + _this.trigger_type(row.operator) + '][' + row.op_value + ']时，执行[' + _this.filter_script_itme(row.run_script_id, row.run_script) + ']</span>';
							},
						},
						{
							title: '操作',
							type: 'group',
							width: 170,
							align: 'right',
							group: [
								{
									title: '编辑',
									event: function (row) {
										_this.render_trigger_event_view(row);
									},
								},
								{
									title: '日志',
									event: function (row) {
										_this.get_execute_log({ name: '触发事件', param: { where_id: row.where_id }, url: '/trigger/get_operator_logs', load: '任务事件' });
									},
								},
								{
									title: '删除',
									event: function (row, index, ev, key, that) {
										bt.confirm(
											{
												title: '删除触发事件',
												msg: '删除后不再触发事件规则,是否继续操作？',
											},
											function () {
												bt_tools.send(
													{ url: '/crontab/trigger/remove_operator_where', data: { where_id: row.where_id } },
													function (rdata) {
														if (rdata.status) that.$refresh_table_list(true);
														bt_tools.msg(rdata);
													},
													'删除触发事件'
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
							type: 'group',
							positon: ['left', 'top'],
							list: [
								{
									title: '创建触发事件',
									active: true,
									event: function () {
										_this.render_trigger_event_view();
									},
								},
							],
						},
						{
							type: 'batch', //batch_btn
							positon: ['left', 'bottom'],
							config: {
								title: '删除触发事件',
								url: 'crontab/trigger/remove_operator_where',
								load: true,
								param: function (row) {
									return { where_id: row.where_id };
								},
								callback: function (that) {
									bt.confirm(
										{
											title: '批量删除事件',
											msg: '批量删除后不再触发事件规则，是否继续？',
										},
										function () {
											that.start_batch({}, function (list) {
												layer.close(indexs);
												var html = '';
												for (var i = 0; i < list.length; i++) {
													var item = list[i];
													html +=
														'<tr><td>' +
														item.where_id +
														'</td><td><div style="float:right;"><span style="color:' +
														(item.request.status ? '#20a53a' : 'red') +
														'">' +
														item.request.msg +
														'</span></div></td></tr>';
												}
												_this.trigger_event_table.$batch_success_table({
													title: '批量删除',
													th: '触发事件ID',
													html: html,
												});
												_this.trigger_event_table.$refresh_table_list(true);
											});
										}
									);
								},
							},
						},
					],
				});
				$(layers).find('.layui-layer-content').css('overflow', 'inherit');
				$(layers).css('top', ($(window).height() - $(layers).height()) / 2);
			},
		});
	},
	/**
	 * @description 添加编辑触发事件
	 * @param {*} row 编辑时传入的数据
	 */
	render_trigger_event_view: function (row) {
		var _this = this,
			_btn = ['创建', '取消'],
			_title = '创建触发事件',
			triggerEventView = null,
			_aceEditor = null;
		var formConfig = [
			{
				label: '当执行结果',
				group: [
					{
						type: 'select',
						width: '100px',
						name: 'operator',
						value: '',
						list: [
							{ title: '大于', value: '>' },
							{ title: '大于等于', value: '>=' },
							{ title: '小于', value: '<' },
							{ title: '小于等于', value: '<=' },
							{ title: '等于', value: '=' },
							{ title: '不等于', value: '!=' },
							{ title: '包含', value: 'in' },
							{ title: '不包含', value: 'not in' },
						],
						change: function (formData, element, that) {
							that.config.form[0].group[0].value = formData.operator;
							that.config.form[0].group[1].value = formData.op_value;
							switch (formData.operator) {
								case 'in':
								case 'not in':
								case '=':
								case '!=':
									that.config.form[0].group[1].type = 'text';
									break;
								case '>':
								case '>=':
								case '<':
								case '<=':
									that.config.form[0].group[1].type = 'number';
									break;
							}
							that.$replace_render_content(0);
						},
					},
					{
						type: 'text',
						width: '280px',
						name: 'op_value',
						style: { 'vertical-align': 'middle' },
						placeholder: '请输入比较值',
						value: '',
					},
				],
			},
			{
				label: '运行',
				group: [
					{
						name: 'script_type',
						type: 'select',
						width: '100px',
						value: 'registry',
						list: [
							{ title: '脚本库', value: 'registry' },
							{ title: '自定义脚本', value: 'custom' },
						],
						change: function (formData, element, that) {
							that.config.form[1].group[0].value = formData.script_type;
							if (formData.script_type == 'custom') {
								that.config.form[1].group[1].display = false;
								that.config.form[1].group[2].display = true;
							} else {
								that.config.form[1].group[1].display = true;
								that.config.form[1].group[2].display = false;
							}
							that.$replace_render_content(1);
							if (formData.script_type == 'custom') {
								_aceEditor = crontab_ace();
								$('.trigger_event_box').css('top', ($(window).height() - $('.trigger_event_box').height()) / 2);
							}
						},
					},
					{
						name: 'run_script_id',
						type: 'secondaryMenu',
						width: '170px',
						placeholder: '请选择脚本',
						list: (function () {
							return _this.render_script_list();
						})(),
						change: function (formData, element, that, lineData) {
							var $this = $(this);
							var parentIndex = $this.parent().parent().parent().index(); //当前选中的数据的父级索引
							var index = $this.index(); //当前选中的数据的索引
							var childenData = lineData.list[parentIndex].child[index]; //当前选中的数据
							if (childenData.is_args == 1) {
								that.config.form[2].group.display = true;
								that.config.form[2].label = childenData.args_title;
								that.config.form[2].group.placeholder = childenData.args_ps;
							} else {
								that.config.form[2].group.display = false;
								that.config.form[2].label = '';
							}
							that.config.form[1].group[0].value = formData.script_type;
							that.$replace_render_content(1);
							that.$replace_render_content(2);
						},
					},
					{
						name: 'run_script',
						type: 'other',
						display: false,
						boxcontent: '<div class="bt-input-text" style="width:390px;height: 200px;min-height:200px;line-height:18px;margin-top: 10px;" id="scriptBody"></div>',
					},
				],
			},
			{
				label: '',
				group: {
					display: false,
					name: 'args',
					type: 'text',
					placeholder: '',
					width: '280px',
				},
			},
		];
		if (row) {
			_btn = ['保存', '取消'];
			_title = '编辑触发事件';
			if (row.run_script_id == 0 && row.run_script != '') {
				formConfig[1].group[0].value = 'custom';
				formConfig[1].group[1].display = false;
				formConfig[1].group[2].display = true;
			}
			if (!$.isEmptyObject(row.script_info) && row.script_info.is_args == 1) {
				formConfig[2].group.display = true;
				formConfig[2].label = row.script_info.args_title;
				formConfig[2].group.placeholder = row.script_info.args_ps;
			}
			formConfig[0].group[0].value = row.operator;
		}
		switch (_this.that_trigger.return_type) {
			case 'string':
				formConfig[0].group[0].list = [
					{ title: '包含', value: 'in' },
					{ title: '不包含', value: 'not in' },
					{ title: '等于', value: '=' },
					{ title: '不等于', value: '!=' },
				];
				formConfig[0].group[1].type = 'text';
				break;
			case 'int':
			case 'float':
				formConfig[0].group[0].list = [
					{ title: '大于', value: '>' },
					{ title: '大于等于', value: '>=' },
					{ title: '小于', value: '<' },
					{ title: '小于等于', value: '<=' },
					{ title: '等于', value: '=' },
					{ title: '不等于', value: '!=' },
				];
				formConfig[0].group[1].type = 'number';
				break;
		}
		bt_tools.open({
			type: 1,
			area: '570px',
			title: _title,
			skin: 'trigger_event_box',
			closeBtn: 2,
			btn: _btn,
			content: '<div class="pd20" id="trigger_event_form_box"></div>',
			success: function (layers) {
				triggerEventView = bt_tools.form({
					el: '#trigger_event_form_box',
					data: row || {},
					form: formConfig,
				});
				$(layers).find('.layui-layer-content').css('overflow', 'inherit');
				if (row && row.run_script_id == 0 && row.run_script != '') {
					_aceEditor = crontab_ace();
					_aceEditor.setValue(row.run_script);
					$(layers).css('top', ($(window).height() - $(layers).height()) / 2);
				}
			},
			yes: function (layers) {
				var formValue = triggerEventView.$get_form_value();
				if (formValue.op_value == '') return layer.msg('请输入比较值', { icon: 2 });
				if (formValue.script_type == 'custom') {
					formValue.run_script = _aceEditor.getValue();
					if (formValue.run_script == '') {
						layer.msg('脚本内容不能为空!', { icon: 2 });
						return;
					}
				} else {
					formValue.run_script = '';
					if (formValue.run_script_id == '') return bt.msg({ status: false, msg: '请选择脚本' });
				}
				if (formValue.run_script_id >= 0) {
					formValue.run_script_id = parseInt(formValue.run_script_id);
				} else {
					formValue.run_script_id = 0;
				}
				if (row) {
					formValue.where_id = row.where_id;
				} else {
					formValue.trigger_id = _this.that_trigger['trigger_id'];
				}
				delete formValue.script_type;
				bt_tools.send(
					{ url: '/crontab/trigger/' + (row ? 'modify_operator_where' : 'create_operator_where'), data: { data: JSON.stringify(formValue) } },
					function (res) {
						if (res.status) {
							layer.close(layers);
							_this.trigger_event_table.$refresh_table_list(true);
						}
						bt_tools.msg(res);
					},
					(row ? '修改' : '创建') + '触发器事件'
				);
			},
		});
	},
	/**
	 * @description 渲染脚本列表
	 */
	render_script_list: function () {
		var scriptArray = [];
		$.each(script_type_list, function (index, item) {
			scriptArray.push({
				title: item.name,
				value: item.type_id,
				child: (function () {
					var child = [];
					$.each(item.script_list, function (i, s) {
						child.push({ title: s.name, value: s.script_id, is_args: s.is_args, args_title: s.args_title, args_ps: s.args_ps });
					});
					return child;
				})(),
			});
		});
		return scriptArray;
	},
	/**
	 * @description 获取执行日志【任务、任务事件、脚本库】
	 */
	get_execute_log: function (rowData) {
		bt_tools.open({
			title: '[' + rowData.name + ']执行日志',
			area: ['850px', '530px'],
			skin: 'execute_dialog_box',
			btn: false,
			default: '日志列表为空', //数据为空时的默认提示
			content: '<div class="pd20" id="execute_log_table"></div>',
			success: function (layers, indexs) {
				bt_tools.table({
					el: '#execute_log_table',
					url: '/crontab' + rowData.url,
					load: true,
					height: 390,
					beforeRequest: function (params) {
						if (params.hasOwnProperty('data') && typeof params.data === 'string') {
							var oldParams = JSON.parse(params['data']);
							delete params['data'];
							return { data: JSON.stringify($.extend(oldParams, params, rowData.param)) };
						}
						return { data: JSON.stringify($.extend(params, rowData.param)) };
					},
					column: [
						{
							title: '执行时间',
							width: 135,
							template: function (row) {
								return '<span>' + bt.format_data(row.start_time) + '</span>';
							},
						},
						{
							title: '耗时',
							template: function (row) {
								var diff = row.end_time - row.start_time;
								return '<span>' + (diff < 1 ? '小于1' : diff) + '秒</span>';
							},
						},
						{
							title: '执行结果',
							width: 80,
							template: function (row) {
								return row.status ? '<span class="bt_success">成功</span>' : '<span class="bt_danger">失败</span>';
							},
						},
						{
							title: '返回内容',
							width: 440,
							template: function (row) {
								var txt = row.status ? row.result_succ : row.result_err;
								return '<pre style="max-height:140px;max-width:422px;">' + txt + '</pre>';
							},
						},
					],
					tootls: [
						{
							//分页显示
							type: 'page',
							positon: ['right', 'bottom'], // 默认在右下角
							pageParam: 'p', //分页请求字段,默认为 : p
							page: 1, //当前分页 默认：1
							numberParam: 'rows', //分页数量请求字段默认为 : limit
							number: 20, //分页数量默认 : 20条
							numberList: [10, 20, 50, 100, 200], // 分页显示数量列表
							numberStatus: true, //　是否支持分页数量选择,默认禁用
							jump: true, //是否支持跳转分页,默认禁用
						},
					],
				});
				$(layers).find('.layui-layer-content').css('overflow', 'inherit');
				$(layers).css('top', ($(window).height() - $(layers).height()) / 2);
			},
		});
	},
	/**
	 * @description 执行后返回的内容
	 */
	execute_result: function (name, row) {
		bt_tools.open({
			type: 1,
			area: '600px',
			title: '[' + name + ']执行结果',
			closeBtn: 2,
			skin: 'script-param-box',
			btn: false,
			content: '<pre style="min-height: 300px;max-height:450px; background: #0f0f0f;color:#fff;margin-bottom: 0;">' + row.msg + '</pre>',
		});
	},
	/**
	 * @description 任务选中的事件脚本 【脚本内容统一展示为自定义，是脚本库则显示具体脚本名称】
	 * @param {Object} id 事件脚本id
	 * @param {Object} sbody 自定义脚本内容
	 */
	filter_script_itme: function (id, sbody) {
		var _name = '';
		if (sbody != '') {
			_name = '自定义脚本';
		} else {
			$.each(script_type_list, function (index, item) {
				$.each(item.script_list, function (i, s) {
					if (s.script_id == id) {
						_name = item.name + '-' + s.name;
						return false;
					}
				});
			});
		}
		return _name;
	},
	/**
	 * @description 任务类型
	 * @param {string} row 类型数据
	 */
	trigger_type: function (type) {
		switch (type) {
			case '=':
				return '等于';
			case '!=':
				return '不等于';
			case '>':
				return '大于';
			case '<':
				return '小于';
			case '>=':
				return '大于等于';
			case '<=':
				return '小于等于';
			case 'in':
				return '包含';
			case 'not in':
				return '不包含';
		}
	},
	/**
	 * @description 触发值
	 * @param {string} row 触发值数据
	 */
	trigger_value: function (type) {
		switch (type) {
			case 'in':
			case 'not in':
				return '字符串';
			case '=':
			case '!=':
				return '字符串/整数/浮点数';
			case '>':
			case '<':
			case '>=':
			case '<=':
				return '整数/浮点数';
		}
	},

	/**
	 * @description 初始化
	 */
	init: function () {
		this.get_trigger_list();
	},
};
var script_type_list = []; //脚本分类列表
var script = {
	script_type: 1, //当前分类
	/**
	 * @description 渲染脚本类型
	 */
	render_script_type: function () {
		var that = this,
			_tabNav = '';

		$.each(script_type_list, function (i, item) {
			_tabNav += '<span class="' + (that.script_type == item.type_id ? 'on' : '') + '" data-id="' + item.type_id + '">' + item.name + '</span>';
		});
		$('#crontabScriptBox')
			.empty()
			.append('<div class="tab-nav-border">' + _tabNav + '</div><div class="tab-con" style="padding-top:15px;"><div id="crontabScript"></div></div>');
		$('#crontabScriptBox .tab-nav-border span').click(function () {
			$(this).addClass('on').siblings().removeClass('on');
			that.script_type = $(this).data('id');
			that.get_script_list();
		});
		that.get_script_list(); //默认触发一次
	},
	/**
	 * @description 获取脚本列表
	 */
	get_script_list: function () {
		var that = this;
		var scriptTable = bt_tools.table({
			el: '#crontabScript',
			url: '/crontab/script/get_script_list',
			load: true,
			minWidth: '1000px',
			autoHeight: true,
			default: '脚本列表为空', //数据为空时的默认提示
			beforeRequest: function (params) {
				if (params.hasOwnProperty('data') && typeof params.data === 'string') {
					var oldParams = JSON.parse(params['data']);
					delete params['data'];
					return { data: JSON.stringify($.extend(oldParams, params, { type_id: that.script_type })) };
				}
				return { data: JSON.stringify($.extend(params, { type_id: that.script_type })) };
			},
			column: [
				{ type: 'checkbox', class: '', width: 20 },
				{ fid: 'name', title: '名称' },
				{ fid: 'script_type', title: '类型' },
				{
					fid: 'return_type',
					title: '返回类型',
					template: function (row) {
						var _type = '';
						switch (row.return_type) {
							case 'string':
								_type = '字符串';
								break;
							case 'int':
								_type = '整数';
								break;
							case 'float':
								_type = '浮点数';
								break;
						}
						return '<span>' + _type + '</span>';
					},
				},
				{ fid: 'ps', title: '备注' },
				{
					fid: 'create_time',
					width: 137,
					title: '创建时间',
					template: function (row) {
						return '<span>' + bt.format_data(row.create_time) + '</span>';
					},
				},
				{
					fid: 'last_exec_time',
					width: 137,
					title: '上次执行时间',
					template: function (row) {
						var last_time = typeof row.last_exec_time != 'number' ? '-' : bt.format_data(row.last_exec_time);
						return '<span>' + last_time + '</span>';
					},
				},
				{
					type: 'group',
					title: '操作',
					align: 'right',
					group: [
						{
							title: '执行',
							event: function (row) {
								var _param = { script_id: row.script_id },
									paramDialog = null;
								if (row.is_args == 1) {
									bt_tools.open({
										type: 1,
										area: '450px',
										title: '执行脚本参数',
										closeBtn: 2,
										skin: 'script-param-box',
										btn: ['立即执行', '取消'],
										content: {
											class: 'pd20',
											form: [
												{
													label: row.args_title,
													group: {
														name: 'args',
														type: 'text',
														placeholder: row.args_ps,
														width: '230px',
													},
												},
											],
										},
										yes: function (formD, indexs) {
											if (formD.args == '') return bt.msg({ status: false, msg: '参数不能为空!' });
											_param['args'] = formD.args;
											start_test_script();
											paramDialog = indexs;
										},
									});
								} else {
									start_test_script();
								}

								function start_test_script() {
									bt.confirm({ title: '执行脚本', msg: '立即执行[' + row.name + ']中的脚本任务，执行过程可能等待时间较长，请耐心等待。是否继续？' }, function (index) {
										layer.close(index);
										bt_tools.send(
											{
												url: '/crontab/script/test_script',
												data: { data: JSON.stringify(_param) },
											},
											function (rdata) {
												if (typeof paramDialog !== 'undefined') layer.close(paramDialog);
												trigger.execute_result(row.name, rdata);
											},
											{ load: '执行' + row.name, verify: false }
										);
									});
								}
							},
						},
						{
							title: '编辑',
							event: function (row) {
								that.render_script_view(row);
							},
						},
						{
							title: '日志',
							event: function (row) {
								trigger.get_execute_log({ name: row.name, param: { script_id: row.script_id }, url: '/script/get_script_logs', load: '脚本' });
							},
						},
						{
							title: '删除',
							event: function (row, index, ev, key, that) {
								bt.confirm({ title: '删除[' + row.name + ']', msg: '删除后脚本信息不可恢复,是否继续操作？' }, function (index) {
									bt_tools.send(
										{ url: '/crontab/script/remove_script', data: { script_id: row.script_id } },
										function (rdata) {
											if (rdata.status) that.$refresh_table_list(true);
											bt_tools.msg(rdata);
										},
										'删除脚本'
									);
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
							title: '创建脚本',
							active: true,
							event: function () {
								that.render_script_view();
							},
						},
					],
				},
				{
					type: 'batch', //batch_btn
					positon: ['left', 'bottom'],
					config: {
						title: '删除脚本信息',
						url: '/crontab/script/remove_script',
						load: true,
						param: function (row) {
							return { script_id: row.script_id };
						},
						callback: function (that) {
							bt.confirm(
								{
									title: '批量删除脚本',
									msg: '批量删除后脚本信息将无法回复，是否继续？',
								},
								function () {
									that.start_batch({}, function (list) {
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
										scriptTable.$batch_success_table({
											title: '批量删除',
											th: '脚本名称',
											html: html,
										});
										scriptTable.$refresh_table_list(true);
									});
								}
							);
						},
					},
				},
				{
					type: 'search',
					positon: ['right', 'top'],
					placeholder: '请输入关键字',
					searchParam: 'search', //搜索请求字段，默认为 search
					value: '', // 当前内容,默认为空
				},
				{
					//分页显示
					type: 'page',
					positon: ['right', 'bottom'], // 默认在右下角
					pageParam: 'p', //分页请求字段,默认为 : p
					page: 1, //当前分页 默认：1
					numberParam: 'rows', //分页数量请求字段默认为 : limit
					number: 20, //分页数量默认 : 20条
					numberList: [10, 20, 50, 100, 200], // 分页显示数量列表
					numberStatus: true, //　是否支持分页数量选择,默认禁用
					jump: true, //是否支持跳转分页,默认禁用
				},
			],
		});
	},
	/**
	 * @description 渲染脚本创建、编辑视图
	 * @param {Object} row 编辑时传入的行数据
	 */
	render_script_view: function (row) {
		var _this = this,
			_btn = ['创建', '取消'],
			_title = '创建脚本',
			scriptOpenView = null,
			_aceEditor = null;
		var script_config = [
			{
				label: '名称',
				group: {
					name: 'name',
					type: 'text',
					placeholder: '请输入脚本名称',
					width: '280px',
					event: function () {
						if (!row) {
							$('[name=name]').on('input', function () {
								$('[name=ps]').val($(this).val());
							});
						}
					},
				},
			},
			{
				label: '返回类型',
				group: {
					type: 'select',
					name: 'return_type',
					width: '100px',
					list: [
						{ value: 'string', title: '字符串' },
						{ value: 'int', title: '整数' },
						{ value: 'float', title: '浮点数' },
					],
				},
			},
			{
				label: '脚本参数',
				group: [
					{
						type: 'select',
						name: 'is_args',
						width: '100px',
						list: [
							{ value: '0', title: '不需要' },
							{ value: '1', title: '需要' },
						],
						change: function (formData, element, that) {
							that.config.form[2].group[0].value = formData.is_args;
							if (formData.is_args == 1) {
								that.config.form[2].group[1].display = true;
								that.config.form[2].group[2].display = true;
							} else {
								that.config.form[2].group[1].display = false;
								that.config.form[2].group[2].display = false;
							}
							that.$replace_render_content(2);
						},
					},
					{
						type: 'text',
						display: false,
						name: 'args_title',
						placeholder: '参数标题',
						style: { 'vertical-align': 'middle' },
						width: '90px',
					},
					{
						type: 'text',
						display: false,
						name: 'args_ps',
						style: { 'vertical-align': 'middle' },
						placeholder: '参数说明',
						width: '180px',
					},
				],
			},
			{
				label: '内容',
				group: {
					name: 'script',
					type: 'other',
					boxcontent: '<div class="bt-input-text" style="width:390px;height: 200px;min-height:200px;line-height:18px;" id="scriptBody"></div>',
				},
			},
			{
				label: '备注',
				group: {
					name: 'ps',
					type: 'text',
					placeholder: '备注',
					width: '280px',
				},
			},
			{
				group: {
					type: 'help',
					list: ['当前仅支持Python和Shell脚本', '请根据返回类型在脚本执行结束时输出符合预期的值', '如果选择需要脚本参数，试用当前脚本时需传递一个参数，在脚本中的第一个参数中接收'],
				},
			},
		];
		if (row) {
			_btn = ['保存', '取消'];
			_title = '编辑脚本';
			row.is_args = row.is_args.toString();
			if (row.is_args == '1') {
				script_config[2].group[1].display = true;
				script_config[2].group[2].display = true;
			} else {
				row['args_title'] = row['args_ps'] = '';
			}
		}
		bt_tools.open({
			type: 1,
			area: '570px',
			title: _title,
			closeBtn: 2,
			btn: _btn,
			content: '<div class="pd20" id="script_form_box"></div>',
			success: function (layers) {
				scriptOpenView = bt_tools.form({
					el: '#script_form_box',
					data: row,
					form: script_config,
				});
				if (row && row['ps']) $('[name=ps]').val(row['ps'].replace('"', '"'));
				setTimeout(function () {
					_aceEditor = crontab_ace();
					_aceEditor.setValue(row ? row.script : '');
				}, 300);
				$(layers).find('.layui-layer-content').css('overflow', 'inherit');
				$(layers).css('top', ($(window).height() - $(layers).height()) / 2);
			},
			yes: function () {
				var form_data = scriptOpenView.$get_form_value();
				if (form_data.name == '') return bt.msg({ status: false, msg: '请输入脚本名称' });
				if (form_data.is_args == '1') {
					if (form_data.args_title == '') return bt.msg({ status: false, msg: '请输入参数标题' });
					if (form_data.args_ps == '') return bt.msg({ status: false, msg: '请输入参数说明' });
				}
				form_data.script = _aceEditor.getValue();
				if (!form_data.script) return bt.msg({ status: false, msg: '请输入脚本内容' });
				if (row) {
					form_data.script_id = row.script_id;
				}
				form_data['type_id'] = $('#crontabScriptBox span.on').data('id');
				bt_tools.send(
					{ url: '/crontab/script/' + (row ? 'modify_script' : 'create_script'), data: { data: JSON.stringify(form_data) } },
					function (rdata) {
						if (rdata.status) {
							_this.get_script_list();
							layer.closeAll();
						}
						bt.msg(rdata);
					},
					(row ? '修改' : '创建') + '脚本'
				);
			},
		});
	},

	/**
	 * @description 初始化
	 */
	init: function () {
		this.render_script_type();
	},
};
// 编辑器
function crontab_ace() {
	$('#scriptBody').css('fontSize', '12px');
	return ace.edit('scriptBody', {
		theme: 'ace/theme/chrome', //主题
		mode: 'ace/mode/python', // 语言类型
		wrap: true,
		showInvisibles: false,
		showPrintMargin: false,
		showFoldWidgets: false,
		useSoftTabs: true,
		tabSize: 2,
		showPrintMargin: false,
		readOnly: false,
	});
}
$('#cronMode .tabs-item[data-type="' + (bt.get_cookie('crontab_model') || 'crontab') + '"]').trigger('click');
