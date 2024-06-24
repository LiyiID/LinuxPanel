$('.database-pos .tabs-item').click(function () {
  var index = $(this).index();
  $(this).addClass('active').siblings().removeClass('active');
  $('.db_table_view .tab-con .tab-con-block').eq(index).removeClass('hide').siblings().addClass('hide');

  db_public_fn.showDatabase(true);
});


var database_table = null,
    dbCloudServerTable = null,  //远程服务器视图
    cloudDatabaseList = [],     //远程服务器列表
    mongoDBAccessStatus = false;

var database = {
  backuptoList: [{ title: '服务器磁盘', value: 'localhost' },
    { title: '阿里云OSS', value: 'alioss' },
    { title: '腾讯云COS', value: 'txcos' },
    { title: '七牛云存储', value: 'qiniu' },
    { title: '华为云存储', value: 'obs' },
    { title: '百度云存储', value: 'bos' }],
  database_table_view: function (search) {
		var _this = this
    var param = {
      table: 'databases',
      search: search || ''
    }
    $('#bt_database_table').empty();
    database_table = bt_tools.table({
      el: '#bt_database_table',
      url: '/data?action=getData',
      param: param, //参数
      minWidth: '1000px',
      autoHeight: true,
      default: "数据库列表为空", // 数据为空时的默认提示
      pageName: 'database',
      load:'获取数据库列表，可能需要较长时间，请耐心等待...',
      beforeRequest: function(){
        var db_type_val = $('.database_type_select_filter').val()
        switch(db_type_val){
          case 'all':
            delete param['db_type']
            delete param['sid']
            break;
          case 0:
            param['db_type'] = 0;
            break;
          default:
            delete param['db_type'];
            param['sid'] = db_type_val
        }
				param.search = $('#bt_database_table .pull-right .bt_search').find('[placeholder="请输入数据库名称/备注"]').val();
        return param
      },
			dataFilter:function(res){
				_this.search_hi = res
				return res
			},
      column: [{
        type: 'checkbox',
        width: 20
      },
        {
          fid: 'name',
          title: '数据库名',
          type: 'text'
        },
        {
          fid: 'username',
          title: '用户名',
          type: 'text',
          sort: true
        },
        {
          fid: 'password',
          title: '密码',
          type: 'password',
          copy: true,
          eye_open: true,
          template: function (row) {
            if (row.password === '') return '<span class="c9 cursor" onclick="database.set_data_pass(\'' + row.id + '\',\'' + row.username + '\',\'' + row.password + '\')">无法获取密码，请点击<span style="color:red">改密</span>重置密码!</span>'
            return true
          }
        },
        bt.public.get_quota_config('database'),
        {
          fid: 'backup',
          title: '备份',
          width: 130,
          template: function (row) {
            var backup = '点击备份',
                _class = "bt_warning";
            if (row.backup_count > 0) backup = lan.database.backup_ok, _class = "bt_success";
            return '<span><a href="javascript:;" class="btlink ' + _class + '" onclick="database.database_detail(' + row.id + ',\'' + row.name + '\',\'' + row.db_type + '\')">' + backup + (row.backup_count > 0 ? ('(' + row.backup_count + ')') : '') + '</a> | ' +
                '<a href="javascript:database.input_database(\'' + row.name + '\')" class="btlink">' + lan.database.input + '</a></span>';
          }
        },
        {
          title:'数据库位置',
          type: 'text',
          width: 116,
          template: function (row) {
            var type_column = '-'
            switch(row.db_type){
              case 0:
                type_column = '本地数据库'
                break;
              case 1:
                type_column = ('远程库('+row.conn_config.db_host+':'+row.conn_config.db_port+')').toString()
                break;
              case 2:
                $.each(cloudDatabaseList,function(index,item){
                  if(row.sid == item.id){
                    if(item.ps !== ''){ // 默认显示备注
                      type_column = item.ps
                    }else{
                      type_column = ('远程服务器('+item.db_host+':'+item.db_port+')').toString()
                    }
                  }
                })
                break;
            }
            return '<span class="flex" style="width:100px" title="'+type_column+'"><span class="size_ellipsis" style="width: 0; flex: 1;">'+type_column+'</span></span>'
          }
        },
        {
          fid: 'ps',
          title: '备注',
          type: 'input',
          blur: function (row, index, ev) {
            bt.pub.set_data_ps({
              id: row.id,
              table: 'databases',
              ps: ev.target.value
            }, function (res) {
              layer.msg(res.msg, { icon: res.status ? 1 : 2 });
            });
          },
          keyup: function (row, index, ev) {
            if (ev.keyCode === 13) {
              $(this).blur();
            }
          }
        },
        {
          type: 'group',
          title: '操作',
          width: 220,
          align: 'right',
          group: [{
            title: '管理',
            tips: '数据库管理',
            hide:function(rows){return rows.db_type != 0},  // 远程数据库和远程服务器
            event: function (row) {
              bt.database.open_phpmyadmin(row.name, row.username, row.password);
            }
          }, {
            title: '权限',
            tips: '设置数据库权限',
            hide:function(rows){return rows.db_type == 1}, //远程数据库
            event: function (row) {
              bt.database.set_data_access(row.username);
            }
          }, {
            title: '工具',
            tips: 'MySQL优化修复工具',
            event: function (row) {
              database.rep_tools(row.name);
            }
          }, {
            title: '改密',
            tips: '修改数据库密码',
            hide:function(rows){return rows.db_type == 1},
            event: function (row) {
              database.set_data_pass(row.id, row.username, row.password);
            }
          }, {
            title: '删除',
            tips: '删除数据库',
            event: function (row) {
              var list = [];
              list.push(row)
              database.del_database(list, row.name,row, function (res) {
                if (res.status) database_table.$refresh_table_list(true);
                layer.msg(res.msg, {
                  icon: res.status ? 1 : 2
                })
              });
            }
          }]
        }
      ],
      sortParam: function (data) {
        return {
          'order': data.name + ' ' + data.sort
        };
      },
      tootls: [{ // 按钮组
        type: 'group',
        positon: ['left', 'top'],
        list: [{
          title: '添加数据库',
          active: true,
          event: function () {
            var cloudList = []
            $.each(cloudDatabaseList,function(index,item){
              var _tips = item.ps != ''?(item.ps+' ('+item.db_host+')'):item.db_host
							cloudList.push({title:_tips,value:item.id,name:item.db_host})
            })
            bt.database.add_database(cloudList,function (res) {
              if (res.status) database_table.$refresh_table_list(true);
            })
          }
        }, {
          title: 'root密码',
          event: function () {
            bt.database.set_root('root')
          }
        }, {
          title: 'phpMyAdmin',
          event: function () {
            var url = $('#phpMyAdminUrl').data('url'),
                isEnable = url !== 'False';
            bt.open({
              type: 1,
              title:'phpMyAdmin访问安全提示',
              area:'450px',
              btn:false,
              content:'<div class="bt-form pd25">\
                <div class="rebt-con" style="width:100%;display: flex;padding:0;height:auto;justify-content: space-around;">\
                  <div class="rebt-li panel_visit" style="position:relative;width: 150px;height: 50px;line-height: 50px;">\
                    <a href="javascript:;" style="font-size:13px;border-radius:2px;">通过面板访问</a>\
                    <span class="recommend-pay-icon" style="height: 30px;width: 30px;background-size: contain;"></span>\
                  </div>\
                  <div class="rebt-li public_visit" style="position:relative;width: 150px;height: 50px;line-height: 50px;">\
                    <a href="javascript:;"  style="font-size:13px;border-radius:2px;">通过公共访问</a>\
                  </div>\
                </div>\
                <ul class="help-info-text c7"><li>面板访问需要登录面板后，才能通过面板访问phpMyAdmin</li><li>若通过面板为phpMyAdmin开启了密码访问，请使用【通过公共访问】</li>'+ (isEnable?
                      '<li class="color-red">关闭公共访问权限可提升安全性，可到软件商店-&gt;phpMyAdmin中关闭</li>':
                      '<li>未开启公共访问权限，可到软件商店-&gt;phpMyAdmin中开启</li><li class="color-red">注意：开启公共访问权限存在安全风险，建议非必要不启用</li>'
              ) + '</ul>\
              </div>',
              success:function (layers,indexs) {
                $('.close_layer').click(function () {
                  layer.close(indexs)
                })
                $('.panel_visit').click(function () {

                  bt.soft.get_soft_find('phpmyadmin',function(rdata){
                    if(rdata.ext.auth){
                      layer.msg('当前phpMyAdmin已开启密码访问，请使用【通过公共访问】');
                      return;
                    }
                    bt.database.open_phpmyadmin('', 'root', bt.config.mysql_root)
                  })
                })
                $('.public_visit').click(function () {
                  if(isEnable){
                    window.open(url)
                  }else{
                    layer.msg('未开启公共访问权限')
                  }
                })
              }
            })
          }
        },
          {
            title:'远程服务器',
            event:function(){
              db_public_fn.get_cloud_server_list();
            }
          },{
            title:'企业增量备份',
            event:function(){
              database.get_backup();
            }
          },{
            title: '同步所有',
            style: {
              'margin-left': '30px'
            },
            event: function () {
              database.sync_to_database({
                type: 0,
                data: []
              }, function (res) {
                if (res.status) database_table.$refresh_table_list(true);
              })
            }
          }, {
            title: '从服务器获取',
            event: function () {
              var _list = [];
              $.each(cloudDatabaseList,function (index,item){
                var _tips = item.ps != ''?(item.ps+' (服务器地址:'+item.db_host+')'):item.db_host
                _list.push({title:_tips,value:item.id})
              })
              bt_tools.open({
                title:'选择数据库位置',
                area:'450px',
                btn: ['确认','取消'],
                skin: 'databaseCloudServer',
                content: {
                  'class':'pd20',
                  form:[{
                    label:'数据库位置',
                    group:{
                      type:'select',
                      name:'sid',
                      width:'260px',
                      list:_list
                    }
                  }]
                },
                success:function(layers){
                  $(layers).find('.layui-layer-content').css('overflow','inherit')
                },
                yes:function (form,layers,index){
                  bt.database.sync_database(form.sid,function (rdata) {
                    if (rdata.status){
                      database_table.$refresh_table_list(true);
                      layer.close(layers)
                    }
                  })
                }
              })
            }
          }, {
            title: '回收站',
            icon: 'trash',
            event: function () {
              // bt.recycle_bin.open_recycle_bin(6)
              fileManage.recycle_bin_view()
            }
          },{
            title: 'mysql',
            event: function () {
            }
          }]
      }, {
        type: 'batch', //batch_btn
        positon: ['left', 'bottom'],
        placeholder: '请选择批量操作',
        buttonValue: '批量操作',
        disabledSelectValue: '请选择需要批量操作的数据库!',
        selectList: [{
          title: '同步数据库',
          url: '/database?action=SyncToDatabases&type=1',
          load:true,
          param: function (row) {
            var arry = [];
            arry.push(row.id);
            return {ids: JSON.stringify(arry)}
          },
          callback: function (that) {
						// 手动执行,data参数包含所有选中的站点
						bt.simple_confirm({ title: '批量同步数据库', msg: '批量同步选中的数据库，同步过程中可能存在风险，请在闲置时间段同步数据库，是否继续操作？' }, function () {
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
										item.request.msg +
										'</span></div></td></tr>';
								}
								database_table.$batch_success_table({ title: '批量同步数据库', th: '数据库名', html: html });
								database_table.$refresh_table_list(true);
							});
						});
					},
        },{
          title:'备份数据库',
          url: bt.data.db_tab_name == 'mysql' ? 'database?action=ToBackup' : '/database/'+bt.data.db_tab_name+'/ToBackup',
          load: true,
					param: function (row) {
						return bt.data.db_tab_name == 'mysql' ? { id: row.id } : {data:JSON.stringify({id: row.id})}
					},
					callback: function (that) { // 手动执行,data参数包含所有选中的站点
						that.start_batch({},function(list){
							var html = '';
							for(var i=0;i<list.length;i++){
								var item = list[i];
								html += '<tr><td>'+ item.name +'</td><td><div style="float:right;"><span style="color:'+ (item.request.status?'#20a53a':'red') +'">'+ item.request.msg +'</span></div></td></tr>';
							}
							database_table.$batch_success_table({title:'批量备份数据库',th:'数据库名',html:html});
							database_table.$refresh_table_list(true);
						});
					}
        },{
          title: "删除数据库",
          url: '/database?action=DeleteDatabase',
          load: true,
          param: function (row) {
            return {
              id: row.id,
              name: row.name
            }
          },
          callback: function (config) { // 手动执行,data参数包含所有选中的站点
            var ids = [];
            for (var i = 0; i < config.check_list.length; i++) {
              ids.push(config.check_list[i].id);
            }
            database.del_database(config.check_list, function (param) {
              config.start_batch(param, function (list) {
                layer.closeAll()
                var html = '';
                for (var i = 0; i < list.length; i++) {
                  var item = list[i];
                  html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + item.request.msg + '</span></div></td></tr>';
                }
                database_table.$batch_success_table({
                  title: '批量删除',
                  th: '数据库名称',
                  html: html
                });
                database_table.$refresh_table_list(true);
              });
            })
          }
        }]
      }, {
        type: 'search',
        positon: ['right', 'top'],
        placeholder: '请输入数据库名称/备注',
        searchParam: 'search', //搜索请求字段，默认为 search
        value: '',// 当前内容,默认为空
      }, { //分页显示
        type: 'page',
        positon: ['right', 'bottom'], // 默认在右下角
        pageParam: 'p', //分页请求字段,默认为 : p
        page: 1, //当前分页 默认：1
        numberParam: 'limit', //分页数量请求字段默认为 : limit
        number: 20, //分页数量默认 : 20条
        numberList: [10, 20, 50, 100, 200], // 分页显示数量列表
        numberStatus: true, //　是否支持分页数量选择,默认禁用
        jump: true, //是否支持跳转分页,默认禁用
      }],
      success:function(config){
          // $('.pull-left button').eq(4).html('<span style="position:relative"><span class="new-file-icon new-ltd-icon" style="position:absolute;top:-2px"></span><span style="margin-left:22px">企业增量备份</span></span>')
          //  $('.pull-left button').eq(4).hover(function () {
    			// 		$(this).find('.new-file-icon').removeClass('new-ltd-icon').addClass('new-ltd-hover')
          //    },function(){
          //        $(this).find('.new-file-icon').removeClass('new-ltd-hover').addClass('new-ltd-icon')
          //    })
				// db_public_fn.show_run_panel()
        //搜索前面新增数据库位置下拉
        if($('.database_type_select_filter').length == 0){
					$('.pull-right').css({'display':'flex','align-items':'center'})
          var _option = '<option value="all">全部</option>'
          $.each(cloudDatabaseList,function(index,item){
            var _tips = item.ps != ''?item.ps:item.db_host
            _option +='<option value="'+item.id+'">'+_tips+'</option>'
          })
          $('#bt_database_table .bt_search').before('<select class="bt-input-text mr5 database_type_select_filter" style="width:110px" name="db_type_filter">'+_option+'</select>')

          //事件
          $('.database_type_select_filter').change(function(){
            // database_table.$refresh_table_list(true,function(data){
            //   if(parseInt($('#bt_database_table .page .Pcurrent').text()) !== 1) $('.Pstart').click()
            // });
						database_table.config.page.page = 1;
            database_table.$refresh_table_list(true);
						if($(this).find('option:selected').attr('value') == 'all'){
							$(this).parent().find('.db_status_row').remove()
						}else{
							$(this).parent().find('.db_status_row').remove()
							$(this).before('<div class="db_status_row">\
							<span class="db_status_icon status_icon status_success"></span>\
							<span class="db_status_type">本地服务器</span>状态：\
							<span class="db_status_text">正常</span>\
							</div>')
							bt.database.check_single_db_status($(this).find('option:selected').attr('value'),false,$(this).find('option:selected').text())
						}
          })
        }

				if($('#bt_database_table .tootls_top .pull-left .bt-desired').length === 0){
					$('#bt_database_table .tootls_top .pull-left').append('<span class="bt-desired ml10" style="background-size: 16px;background-position: left;"><a href="javascript:;" class="btlink ml5 npsFeedback">需求反馈</a></span>')
					// 数据库nps入口
					$('.npsFeedback').on('click',function(){
						bt_tools.nps({name:'数据库',type:12})
					})
				}
      }
    });

    $('#bt_database_table .pull-right .bt_search .search_input').css('width', '300px');
		var recomList = ['增量备份', '远程数据库', 'MySQL容量限制'],_recomHtml = ''
		for(var i = 0; i<recomList.length;i++){
			_recomHtml += '<div><span class="item_box">'+recomList[i]+'</span></div>'
		}
		$('#bt_database_table .pull-right .bt_search').append(
			'<div id="search_history" style="width:400px;margin-left: -100px;position:absolute;z-index:99;background:#fff;display:none;transitoin:all .3s;box-shadow: 4px 4px 8px rgba(0, 0, 0, .1), -4px -4px 8px rgba(0, 0, 0, .1);top:35px;border-radius:5px"><div class="history_list_box"><div style="display:flex;flex-direction:row;align-items:center;justify-content:space-between;border-bottom:1px solid #EBEEF5;padding:5px 10px"><span style="font-size: 12px;color:#999">搜索历史</span><div id="all_delete" style="width:52px;height:24px;border:1px solid #DCDFE6;color:#999;font-size:12px;display:flex;align-items:center;cursor:pointer;border-radius:2px;justify-content:space-evenly;flex-direction:row"><img class="all_img" style="width:14px;height:14px" src="/static/img/soft_ico/deletes.png" alt="清除">清空</div></div>\
			<div class="list_box_bottom"><div class="list_box_body"></div></div>\
        <div class="list_box_recom">\
          <div>\
            <span>您可能感兴趣</span>\
            <img class="ml5" style="width:14px;height:14px;vertical-align: -2px;" src="/static/images/hots.png">\
          </div>\
          <div class="list_box_recom_body">'+ _recomHtml +'</div>\
        </div>\
			</div></div>'
		);
		$('#bt_database_table .pull-right .bt_search .item_box').unbind('click').click(function(){
			var idx = $(this).parent().index()
			// 获取表格tbody第一行最后一个td下的a标签长度
			if(idx === 2) {
				// 获取表格tbody第一行最后一个td下的a标签长度
				var tdLen = $('#bt_database_table tbody tr:eq(0) td').length
				if(tdLen <= 2) {
					return layer.msg('暂无数据库，请先添加数据库',{icon:2})
				}
			}
			setTimeout(function(){
				switch(idx){
					case 0:// 增量备份
						$('#bt_database_table .tootls_top .pull-left [title="企业增量备份"]').click()
						break;
					case 1:// 远程数据库
					    $('#bt_database_table .tootls_top .pull-left [title="远程服务器"]').click()
						break;
				// 	case 2:// MySQL执行日志
				// 		$('.site-menu p').eq(3).click()
				// 		break;
				// 	case 3:// MySQL全文搜索
				// 		$('.site-menu p').eq(4).click()
				// 		break;
				// 	case 4:// MySQL用户管理
				// 		$('.site-menu p').eq(5).click()
				// 		break;
					case 2:// MySQL容量限制
						$('#bt_database_table tbody tr:eq(0) td:eq(4) a').click()
						break;
				}
			},100)
		})
		$('#bt_database_table .pull-right .bt_search')
			.find('[placeholder="请输入数据库名称/备注"]')
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
							$('#bt_database_table .pull-right .bt_search')
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
						$('#bt_database_table .pull-right .bt_search')
							.find('#search_history')
							.find('.history_list_box')
							.find('.list_box_body')
							.find('.body_item')
							.click(function () {
								$('#bt_database_table .pull-right .bt_search').find('[placeholder="请输入数据库名称/备注"]').val($(this).data('name'));
								// database_table.$refresh_table_list(true);
							});
						$('#bt_database_table .pull-right .bt_search')
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
					} else {
						$('#bt_database_table .pull-right .bt_search').find('.list_box_body').append('<span style="color:#999">暂无数据</span>');
					}
					$('.delete_single').click(function (event) {
						event.stopPropagation();
							var names = $(this).data('name')
							var cload = layer.msg('正在删除中...', { icon: 16 })
							bt.confirm({ msg: '是否删除改记录？', title: '删除历史记录' }, function () {
								bt_tools.send({ url: '/panel/history/remove_search_history', data: { name: 'databases', key: 'get_list', val: names } }, function (ress) {
									layer.close(cload);
									layer.msg(ress.msg, { icon: ress.status ? 1 : 2 });
									_this.search_hi.search_history = _this.search_hi.search_history.filter(function(obj) {
  									return obj.val !== names;
									});
								});
							});
						})
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
				$(this).find('.all_img').attr('src', '/static/img/soft_ico/deletes.png');
				$(this).find('.all_img').css('width', '14px');
				$(this).find('.all_img').css('height', '14px');
				$(this).css('background', 'none');
			}
		);
			$('#all_delete').click(function () {
						var dload = layer.msg('正在清空中...', { icon: 16 });
						bt.confirm({ msg: '是否清空所有历史记录？', title: '清空历史记录' }, function () {
							bt_tools.send({ url: '/panel/history/clear_search_history', data: { name: 'databases', key: 'get_list' } }, function (ress) {
								layer.close(dload);
								layer.msg(ress.msg, { icon: ress.status ? 1 : 2 });
								_this.search_hi.search_history = [];
							});
						});
					});
		// 运行环境
		db_public_fn.show_run_panel()
  },
  // 同步所有
  sync_to_database: function (obj, callback) {
    bt.database.sync_to_database({
      type: obj.type,
      ids: JSON.stringify(obj.data)
    }, function (rdata) {
      if (callback) callback(rdata);
    });
  },
  // 同步数据库
  database_detail: function (id, dataname,db_type) {
    if(bt.data.db_tab_name == 'mysql'){
      var cloud_list = { //云存储列表名
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
        obs: '华为云'
      };
			function getType (name) {
        var type = 'localhost'; // 当前云存储类型
        if (name.indexOf('|') != -1) {
          type = name.match(/\|(.+)\|/, "$1")[1];
        }
        return type;
      }
      var web_tab = bt_tools.tab({
        class: 'pd20',
        type: 0,
        theme: { nav: 'ml0'},
        active: 1, //激活TAB下标
        list: [{
          title: '常规备份',
          name: 'conventionalBackup',
          content: '<div id="bt_backup_table"></div>',
          success: function () {
            var bt_backup_table = $('#bt_backup_table')
            bt_backup_table.html('')
            var backup_table = bt_tools.table({
              el: '#bt_backup_table',
              url: '/data?action=getData',
              param: { table: 'backup', search: id, type: '1', limit:5 },
              default: "[" + dataname + "] 数据库备份列表为空", //数据为空时的默认提示
              column: [
                { type: 'checkbox', class: '', width: 20 },
                { fid: 'name', title: '文件名称', width: 220, fixed: true },
                {
                  fid: 'storage_type',
                  title: '存储位置',
                  type: 'text',
                  width: 70,
                  template: function (row) {
                    var is_cloud = false, cloud_name = '' //当前云存储类型
                    if (row.filename.indexOf('|') != -1) {
                      var _path = row.filename;
                      is_cloud = true;
                      cloud_name = _path.match(/\|(.+)\|/, "$1")
                    } else {
                      is_cloud = false;
                    }
                    return is_cloud ? cloud_list[cloud_name[1]] : '本地'
                  }
                },
                {
                  fid: 'size',
                  title: '文件大小',
                  width: 80,
                  type: 'text',
                  template: function (row, index) {
                    return bt.format_size(row.size)
                  }
                },
                { fid: 'addtime', width: 150, title: '备份时间' },
                { fid: 'ps',
                  title: '备注',
                  type: 'input',
                  blur: function (row, index, ev, key, that) {
                    if (row.ps == ev.target.value) return false
                    bt.pub.set_data_ps({ id: row.id, table: 'backup', ps: ev.target.value }, function (res) {
                      bt_tools.msg(res, { is_dynamic: true })
                    })
                  },
                  keyup: function (row, index, ev) {
                    if (ev.keyCode === 13)  $(this).blur()
                  }
                },
                {
                  title: '操作',
                  type: 'group',
                  width: 140,
                  align: 'right',
                  group: [{
                    title: '恢复',
                    event: function (row, index, ev, key, that) {
											var type = getType(row.filename);
                      if (type != 'alioss' && type != 'bos' && type != 'txcos' && type != 'obs' && type != 'localhost') {
                          layer.msg('暂不支持存储位置【' + cloud_list[type] + '】恢复功能', { icon: 2, closeBtn: 1, time: 0, shadeClose: true });
                          return;
                      }
                      var _id = row.id;
                      num1 = bt.get_random_num(3, 15),
                          num2 = bt.get_random_num(5, 9),
                          taskID = 0,
                          taskStatus = 0, //0未开始  1正在下载   2下载完成
                          intervalTask = null;
                      // 根据id获取对象数据
                      var obj = that.data.filter(function (x) {
                        return x.id === _id
                      })
                      obj = obj[0] //由于filter返回数组所以取第一位
                      var _path = obj.filename,
                          cloud_name = _path.match(/\|(.+)\|/, "$1"),
                          isYun = _path.indexOf('|') != -1;
                      if (!isYun) {
                        bt.database.input_sql(_path, dataname)
                        return
                      }
                      layer.open({
                        type: 1,
                        title: "从云存储恢复",
                        area: ['500px', '350px'],
                        closeBtn: 2,
                        shadeClose: false,
                        skin: 'db_export_restore',
                        content: "<div style='padding: 20px 20px 0 20px;'>" +
                            "<div class='db_export_content'><ul>" +
                            "<li>此备份文件存储在云存储，需要通过以下步骤才能完成恢复：</li>" +
                            "<li class='db_export_txt'>" +
                            "<span>1</span>" +
                            "<div>" +
                            "<p>从[" + cloud_list[cloud_name[1]] + "]下载备份文件到服务器。</p>" +
                            "<p class='btlink'></p>" +
                            "</div>" +
                            "</li>" +
                            "<li class='db_export_txt2'>" +
                            "<span>2</span>" +
                            "<div>" +
                            "<p>恢复备份</p>" +
                            "<p class='btlink'></p>" +
                            "</div>" +
                            "</li>" +
                            "</ul>" +
                            "<p class='db_confirm_txt'style='color:red;margin-bottom: 10px;'>数据库将被覆盖，是否继续？</p>" +
                            "</div>" +
                            "<div class='db_export_vcode db_two_step' style='margin:0'>" + lan.bt.cal_msg + "" +
                            "<span class='text'>" + num1 + " + " + num2 + "</span>=<input type='number' id='vcodeResult' value=''>" +
                            "</div>" +
                            "<div class='bt-form-submit-btn'>" +
                            "<button type='button' class='btn btn-danger btn-sm db_cloud_close'>取消</button>" +
                            "<button type='button' class='btn btn-success btn-sm db_cloud_confirm'>确认</button></div>" +
                            "</div>",
                        success: function (layers, indexs) {
                          // 确认按钮
                          $('.db_export_restore').on('click', '.db_cloud_confirm', function () {
                            var vcodeResult = $('#vcodeResult');
                            if (vcodeResult.val() === '') {
                              layer.tips('计算结果不能为空', vcodeResult, {
                                tips: [1, 'red'],
                                time: 3000
                              })
                              vcodeResult.focus()
                              return false;
                            } else if (parseInt(vcodeResult.val()) !== (num1 + num2)) {
                              layer.tips('计算结果不正确', vcodeResult, {
                                tips: [1, 'red'],
                                time: 3000
                              })
                              vcodeResult.focus()
                              return false;
                            }
                            $('.db_two_step,.db_confirm_txt').remove(); //删除计算
                            $('.db_export_restore .db_export_content li:first').animate({
                              'margin-bottom': '35px'
                            }, 600);
                            $('.db_export_restore .db_cloud_confirm').addClass('hide'); //隐藏确认按钮
                            //请求云储存链接
                            $.post('/cloud', {
                              toserver: true,
                              filename: obj.filename,
                              name: obj.name
                            }, function (res) {
                              taskID = res.task_id
                              if (res.status === false) {
                                layer.msg(res.msg, {
                                  icon: 2
                                });
                                return false;
                              } else {
                                // 获取下载进度
                                function downloadDBFile () {
                                  $.post('/task?action=get_task_log_by_id', {
                                    id: res.task_id,
                                    task_type: 1
                                  }, function (task) {
                                    if (task.status == 1) {
                                      clearInterval(intervalTask)
                                      taskStatus = 2
                                      $('.db_export_txt p:eq(1)').html('下载完成!');
                                      $('.db_export_txt2 p:eq(1)').html('请稍等，正在恢复数据库 <img src="/static/img/ing.gif">');
                                      bt.send('InputSql', 'database/InputSql', {
                                        file: res.local_file,
                                        name: dataname
                                      }, function (rdata) {
                                        layer.close(indexs)
                                        bt.msg(rdata);
                                      })
                                    } else {
                                      taskStatus = 1;
                                      //更新下载进度
                                      $('.db_export_txt p:eq(1)').html('正在下载文件:已下载 ' + task.used + '/' + ToSize(task.total))
                                    }
                                  })
                                }
                                downloadDBFile();
                                intervalTask = setInterval(function () {
                                  downloadDBFile();
                                }, 1500);
                              }
                            })
                          })
                          // 取消按钮
                          $('.db_export_restore').on('click', '.db_cloud_close', function () {
                            switch (taskStatus) {
                              case 1:
                                layer.confirm('正在执行从云存储中下载，是否取消', {
                                  title: '下载取消'
                                }, function () {
                                  clearInterval(intervalTask) //取消轮询下载进度
                                  layer.close(indexs)
                                  database.cancel_cloud_restore(taskID)
                                })
                                break;
                              case 2:
                                layer.msg('数据正在恢复中，无法取消', {
                                  icon: 2
                                })
                                return false;
															default:
																layer.close(indexs);
																break;
                            }
                          })
                        },
                        cancel: function (layers) {
                          switch (taskStatus) {
                            case 0:
                              layer.close(layers);
                              break;
                            case 1:
                              layer.confirm('正在执行从云存储中下载，是否取消', {
                                title: '下载取消'
                              }, function () {
                                clearInterval(intervalTask) //取消轮询下载进度
                                layer.close(layers)
                                database.cancel_cloud_restore(taskID)
                              }, function () {
                                return false;
                              })
                              break;
                            case 2:
                              layer.msg('数据正在恢复中，无法取消', {
                                icon: 2
                              })
                              return false;
                          }
                          return false;
                        }
                      })
                    }
                  },{
                    title: '下载',
                    event: function (row) {
											if (row.filename.indexOf('|') !== -1 && row.localexist === 1) {
												layer.msg('暂不支持云存储下载', { icon: 2 });
											} else {
												window.open('/download?filename=' + row.local + '&amp;name=' + row.name);
											}
										}
                  }, {
                    title: '删除',
                    event: function (row, index, ev, key, that) {
                      that.del_site_backup(row, function (rdata) {
                        bt_tools.msg(rdata);
                        if (rdata.status) {
                          that.$refresh_table_list();
                          database_table.$refresh_table_list(true)
                        }
                      });
                    }
                  }]
                }
              ],
              methods: {
                /**
                 * @description 删除站点备份
                 * @param {object} config
                 * @param {function} callback
                 */
                del_site_backup: function (config, callback) {
                  bt.confirm({ title: '删除数据库备份[' + config.addtime + ']', msg: '删除选中数据库备份文件后，<span class="color-red">该数据库备份文件将永久消失</span>，是否继续操作？' }, function () {
                    bt_tools.send('database/DelBackup', { id: config.id }, function (rdata) {
                      if (callback) callback(rdata)
                    }, true)
                  });
                }
              },
              success: function () {
                $('.bt_backup_table').css('top', (($(window).height() - $('.bt_backup_table').height()) / 2) + 'px')

                bt.newDotTips([{el: '#bt_backup_table .tootls_top .pull-left button:eq(1)',name: 'customBackup',style: 'top: -3px;margin-left: 5px;'}])
              },
              tootls: [{ // 按钮组
                type: 'group',
                positon: ['left', 'top'],
                list: [{
                  title: '备份数据库',
                  active: true,
                  event: function (ev, that) {
                    var allLoad = layer.msg('正在备份中,请稍后......', { icon: 16, shade: [0.3, '#000'], time: 0 });
													bt_tools.send(
														{ url: '/database?action=ToBackup', data: { id: id } },
														function (ress) {
															backup_table.$refresh_table_list();
															layer.msg(ress.msg, { icon: ress.status ? 1 : 2, time: 0, shadeClose: true, shade: [0.3, '#000'] });
														})
                  }
                },{
									title: '自定义备份',
									active: false,
									event: function (ev, that) {
										var btn_Type = 'db';
										var mysqlTable = null;
										bt_tools.open({
											title: '自定义备份 - [ ' + dataname + ' ]',
											area: ['600px', '560px'],
											class: 'p15',
											btn: ['备份', '取消'],
											// btn-success
											content:
												'<div id="mysqlForm"></div>\
																<div id="dataBaseTableMysql"></div><style type="text/css">#dataBaseTableMysql thead th{background-color:#fff}</style>',
											success: function () {
												var mysqlForm = bt_tools.form({
													el: '#mysqlForm',
													class: 'pd20',
													form: [
														{
															group: {
																type: 'other',
																boxcontent: '<div><div><p>数据表</p></div><div id="dataBaseTableMysql"></div></div>',
															},
														},
														{
															formLabelWidth: '71px',
															label: '备份方式',
															group: {
																type: 'radio',
																name: 'radioValue',
																width: '150px',
																value: 'db',
																list: [
																	{ title: '合并导出', value: 'db' },
																	{ title: '分表导出', value: 'table' },
																],
																event: function (formData, element, that) {
																	btn_Type = formData.radioValue;
																},
															},
														},
														{
															group: {
																type: 'help',
																list: ['合并导出：将选中的表导出到一个SQL文件内。', '分表导出：一张表存储为一个SQL文件。'],
															},
														},
													],
												});
												mysqlTable = bt_tools.table({
													el: '#dataBaseTableMysql',
													url: '/database?action=GetInfo',
													default: '暂无数据',
													param: { db_name: dataname },
													height: '250px',
													dataVerify: false, //为false可跳过异常处理
													load: true,
													tips: '正在获取数据...',
													dataFilter: function (rdata) {
														return { data: rdata.tables };
													},
													column: [
														{ type: 'checkbox', class: 'checkBoxs', width: 20 },
														{
															fid: 'table_name',
															fixed: true,
															width: 300,
															title: '全选',
														},
														{
															fid: 'rows_count',
															width: 100,
															title: '行数',
														},
														{
															fid: 'data_size',
															width: 80,
															title: '大小',
														},
													],
												});
											},
											yes: function (formD, indexs) {
												if (mysqlTable.checkbox_list.length < 1) {
													layer.msg('请至少选择一项', { icon: 2 });
													return;
												}
												var table_list = [];
												$.each(mysqlTable.checkbox_list, function (index, value) {
													table_list.push(mysqlTable.data[value].table_name);
												});
												var mysql_Backup_load = layer.msg('正在备份中，请稍后...', { icon: 16, time: 0, shade: [0.3, '#000'] });
												bt_tools.send(
													{ url: '/database?action=ToBackup', data: { storage_type: btn_Type, table_list: JSON.stringify(table_list), id: id } },
													function (ress) {
														backup_table.$refresh_table_list();
														layer.msg(ress.msg, { icon: ress.status ? 1 : 2, time: 0, shadeClose: true, shade: [0.3, '#000'] });
													});
											},
											cancel: function () {},
										});
										$('#dataBaseTableMysql').css('width', '560px');
								}}]
              }, {
                type: 'batch',
                positon: ['left', 'bottom'],
                config: {
                  title: '删除',
                  url: '/site?action=DelBackup',
                  paramId: 'id',
                  load: true,
                  callback: function (that) {
                    bt.confirm({ title: '批量删除数据库备份', msg: '批量删除选中的数据库备份，<span class="color-red">备份文件将永久消失</span>，是否继续操作？', icon: 0 }, function (index) {
                      layer.close(index);
                      that.start_batch({}, function (list) {
                        var html = '';
                        for (var i = 0; i < list.length; i++) {
                          var item = list[i];
                          html += '<tr><td><span class="text-overflow" title="' + item.name + '">' + item.name + '</span></td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + item.request.msg + '</span></div></td></tr>';
                        }
                        backup_table.$batch_success_table({ title: '批量删除数据库备份', th: '文件名', html: html })
                        backup_table.$refresh_table_list(true)
                        database_table.$refresh_table_list(true)
                      });
                    });
                  }
                } //分页显示
              }, {
                type: 'page',
                positon: ['right', 'bottom'], // 默认在右下角
                pageParam: 'p', //分页请求字段,默认为 : p
                page: 1, //当前分页 默认：1
                numberParam: 'limit',
                //分页数量请求字段默认为 : limit
                defaultNumber: 10
                //分页数量默认 : 20条
              }]
            })
          }
        }, {
					title: '<p style="height:16px;padding:0;border:none;margin-right:2px;background-color: transparent;vertical-align: sub;" class="firwall_place_of_attribution"></p>增量备份',
          name: 'incrementalBackup',
          content:"<div id='webedit-con-database' class='bt-w-con webedit-con pd15' style='margin-left:0;height:495px;'></div>",
					success:function(){
						database.backupList(1,dataname);
          }
        }]
      });
      bt_tools.open({
        area: '880px',
        title: '备份数据库&nbsp;-&nbsp;[&nbsp;' + dataname + '&nbsp;]',
        btn: false,
        skin: 'bt_backup_table',
        content: web_tab.$reader_content(),
        success:function () {
          web_tab.$init();
          $('.bt_backup_table .tab-nav span').eq(1).click(function () {
            if(db_type != 0){
              $('.bt_backup_table .tab-nav span').eq(0).click()
              layer.msg('不支持远程数据库')
              return false
            }
            if(database.isLtdBackAndCap()) return false
          })
        }
      });
    }else{
			if (bt.data.db_tab_name == 'mongodb') {
				// mgdb弹窗渲染
				// bt.pub.get_data('table=backup&search=' + id + '&type=1&tojs=database.database_detail', function (frdata) {
				// frdata.page = frdata.page.replace(/'/g, '"').replace(/database.database_detail\(/g, "database.database_detail(" + id + ",'" + dataname + "',");
				bt_tools.open({
					area: ['880px', '633px'],
					title: '备份数据库&nbsp;-&nbsp;[&nbsp;' + dataname + '&nbsp;]',
					btn: false,
					content:
						"<div class='divtable pd15 style='padding-bottom: 0'><button id='btn_data_backupMgdb_All' class='btn btn-success btn-sm' type='button' style='margin-bottom:10px;margin-right:5px'>备份数据库</button><button id='btn_data_backupMgdb' class='btn btn-default btn-sm' type='button' style='margin-bottom:10px'>自定义备份</button><div id='DataBackupListMgdb'></div></div>",
					success: function () {
            bt.newDotTips([{el: '#btn_data_backupMgdb',name: 'customBackup',style: 'top: -3px;margin-left: 5px;'}])

						var mgdbTableFh = bt_tools.table({
							el: '#DataBackupListMgdb',
							url: '/data?action=getData',
							param: { table: 'backup', search: id, limit: 10, p: 1, type: 1 },
							default: '暂无数据',
							dataVerify: false, //为false可跳过异常处理
							tips: '正在获取数据，请稍后...',
							load: true,
							dataFilter: function (rdata) {
								//return rdata  //不做处理
								return { data: rdata.data, page: rdata.page }; //处理好数据后返回
							},
							column: [
								{ type: 'checkbox', class: '', width: 20 },
								{
									title: '文件名称',
									width: 200,
									template: function (row) {
										return '<span title="' + row.filename + '" style="width:200px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + row.name + '</span>';
									},
								},
								{
									title: '存储位置',
									width: 70,
									template: function (row) {
										var cloud_list = {
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
										var is_cloud = false,
											cloud_name = ''; //当前云存储类型
										if (row.filename.indexOf('|') != -1) {
											var _path = row.filename;
											is_cloud = true;
											cloud_name = _path.match(/\|(.+)\|/, '$1');
										} else {
											is_cloud = false;
										}
										return is_cloud ? '<span>' + cloud_list[cloud_name[1]] + '</span>' : '<span>本地</span>';
									},
								},
								{
									title: '文件大小',
									width: 70,
									template: function (row) {
										return '<span>' + bt.format_size(row.size) + '</span>';
									},
								},
								{ fid: 'addtime', title: '备份时间', width: 140 },
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
										if (ev.keyCode === 13) $(this).blur();
									},
								},
								// {
								//   title:'操作',
								//   width:140,
								//   template:function(row){
								//     var _opt = '<a class="btlink" herf="javascrpit:;" onclick="bt.database.input_sql(\'' + row.filename + '\',\'' + dataname + '\')">恢复</a> | \
								//      <a class="btlink" href="/download?filename=' + row.filename + '&amp;name=' + row.name + '" target="_blank">下载</a> | \
								//     <a class="btlink" herf="javascrpit:;" onclick="bt.database.del_backup(\'' + row.id + '\',\'' + id + '\',\'' + dataname + '\',\'' + row.addtime + '\')">删除</a>'
								//     return '<span>'+ _opt +'</span>';
								//   }
								// },
								{
									title: '操作',
									type: 'group',
									align: 'right',
									group: [
										{
											title: '恢复',
											event: function (row, index, ev, key, that) {
												bt.database.input_sql(row.filename, dataname);
											},
										},
										{
											title: '下载',
											event: function (row, index, ev, key, that) {
												window.open('/download?filename=' + row.filename + '&amp;name=' + row.name + '');
											},
										},
										{
											title: '删除',
											event: function (row, index, ev, key, that) {
												bt.simple_confirm(
													{ title: '删除备份文件-' + row.addtime + '', msg: '删除选中备份文件后，<span class="color-red">该备份文件将永久消失</span>，是否继续操作？' },
													function (index) {
														bt_tools.send({ url: '/database/mongodb/DelBackup', data: { data: JSON.stringify({ id: row.id }) } }, function (ress) {
															mgdbTableFh.$refresh_table_list();
															database_table.$refresh_table_list();
															layer.msg(ress.msg, { icon: ress.status ? 1 : 2 });
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
									type: 'batch',
									positon: ['left', 'bottom'],
									config: {
										title: '删除',
										url: '/site?action=DelBackup',
										paramId: 'id',
										load: true,
										callback: function (that, index) {
											layer.close(index);
											bt.confirm({ title: '批量删除数据库备份', msg: '批量删除选中的数据库备份，<span class="color-red">备份文件将永久消失</span>，是否继续操作？', icon: 0 }, function (index) {
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
													mgdbTableFh.$batch_success_table({ title: '批量删除数据库备份', th: '文件名', html: html });
													mgdbTableFh.$refresh_table_list();
												});
											});
										},
									},
								},
								{
									//分页显示
									type: 'page',
									positon: ['right', 'bottom'], // 默认在右下角
									pageParam: 'p', //分页请求字段,默认为 : p
									page: 1, //当前分页 默认：1
									numberParam: 'limit', //分页数量请求字段默认为 : limit
									number: 10, //分页数量默认 : 20条
									numberList: [10, 20, 50, 100, 200], // 分页显示数量列表
									numberStatus: false, //　是否支持分页数量选择,默认禁用
									jump: false, //是否支持跳转分页,默认禁用
								},
							],
						});
						$('#btn_data_backupMgdb_All').click(function () {
							var allLoad = layer.msg('正在备份中,请稍后......', { icon: 16, shade: [0.3, '#000'], time: 0 });
							bt_tools.send(
								{ url: '/database/mongodb/ToBackup', data: { data: JSON.stringify({ id: id }) } },
								function (ress) {
									mgdbTableFh.$refresh_table_list();
									layer.msg(ress.msg, { icon: ress.status ? 1 : 2, shade: [0.3, '#000'], time: 0, shadeClose: true });
								},
								allLoad
							);
						});
						$('#btn_data_backupMgdb')
							.unbind('click')
							.click(function () {
								var mgdbTable = null,
									btn_Type = 'bson';
								bt_tools.open({
									title: '自定义备份 - [ ' + dataname + ' ]',
									area: ['600px', '560px'],
									class: 'p15',
									btn: ['备份', '取消'],
									content:
										'<div id="mgdbForm"></div>\
																			<div id="dataBaseTableMgdb"></div><style type="text/css">#dataBaseTableMgdb thead th{background-color:#fff}</style>',
									success: function () {
										var mgdbForm = bt_tools.form({
											el: '#mgdbForm',
											class: 'pd20',
											form: [
												{
													group: {
														type: 'other',
														boxcontent: '<div><p>数据表</p><div id="dataBaseTableMgdb"></div></div>',
													},
												},
												{
													label: '备份格式',
													formLabelWidth: '71px',
													group: {
														type: 'radio',
														name: 'radioValue',
														width: '150px',
														value: 'bson',
														list: [
															{ title: 'bson', value: 'bson' },
															{ title: 'json', value: 'json' },
														],
														event: function (formData, element, that) {
															btn_Type = formData.radioValue;
														},
													},
												},
												{
													group: {
														type: 'help',
														list: ['备份格式：打包后压缩包内的文件格式'],
													},
												},
											],
										});
										mgdbTable = bt_tools.table({
											el: '#dataBaseTableMgdb',
											url: '/database/mongodb/GetInfo',
											default: '暂无数据',
											param: { data: JSON.stringify({ db_name: dataname }) },
											height: '250px',
											dataVerify: false, //为false可跳过异常处理
											tips: '正在获取数据，请稍后...',
											load: true,
											dataFilter: function (rdata) {
												if(!rdata.status) return []
												return { data: rdata.data.collection_list };
											},
											column: [
												{ type: 'checkbox', class: 'checkBoxs', width: 20 },
												{
													fid: 'collection_name',
													fixed: true,
													width: 300,
													title: '全选',
												},
												{
													fid: 'count',
													width: 100,
													title: '文档数量',
												},
												{
													title: '存储大小',
													width: 80,
													template: function (row) {
														return '<span>' + ToSize(row.storage_size) + '</span>';
													},
												},
											],
										});
									},
									yes: function (formD, indexs) {
										if (mgdbTable.checkbox_list.length < 1) {
											layer.msg('请至少选择一项', { icon: 2 });
											return;
										}
										var table_list = [];
										$.each(mgdbTable.checkbox_list, function (index, value) {
											table_list.push(mgdbTable.data[value].collection_name);
										});
										var mgdb_Backup_load = layer.msg('正在备份中，请稍后...', { icon: 16, time: 0, shade: [0.3, '#000'] });
										bt_tools.send(
											{ url: '/database/mongodb/ToBackup', data: { data: JSON.stringify({ file_type: btn_Type, collection_list: table_list, id: id }) } },
											function (ress) {
												mgdbTableFh.$refresh_table_list();
												layer.msg(ress.msg, { icon: ress.status ? 1 : 2, time: 0, shadeClose: true, shade: [0.3, '#000'] });
											});
									},
									cancel: function () {},
								});
								$('#dataBaseTableMgdb').css('width', '560px');
							});
					},
				});
				$('#DataBackupListMgdb').css('height', '462px');
			} else if ((bt.data.db_tab_name = 'pgsql')) {
				// pgsql弹窗渲染
				var loadT = bt.load(lan.public.the_get);
				bt.pub.get_data('table=backup&search=' + id + '&type=1&tojs=database.database_detail', function (frdata) {
					loadT.close();
					frdata.page = frdata.page.replace(/'/g, '"').replace(/database.database_detail\(/g, 'database.database_detail(' + id + ",'" + dataname + "',");
					if ($('#DataBackupListPgsql').length <= 0) {
						bt_tools.open({
							type: 1,
							area: ['880px', '633px'],
							title: '备份数据库&nbsp;-&nbsp;[&nbsp;' + dataname + '&nbsp;]',
              btn: false,
							content:
								"<div class='divtable pd15 style='padding-bottom: 0'><button id='btn_data_backupPgsql_All' class='btn btn-success btn-sm' type='button' style='margin-bottom:10px;margin-right:5px'>备份数据库</button><button id='btn_data_backupPgsql' class='btn btn-default btn-sm' type='button' style='margin-bottom:10px'>自定义备份</button><div id='DataBackupListPgsql'></div></div>",
							success: function () {
								var pgSql = bt_tools.table({
									el: '#DataBackupListPgsql',
									url: '/data?action=getData',
									param: { table: 'backup', search: id, limit: 10, p: 1, type: 1 },
									default: '暂无数据',
									height: '',
									tips: '正在获取数据，请稍后...',
									load: true,
									dataVerify: false, //为false可跳过异常处理
									dataFilter: function (rdata) {
										//return rdata  //不做处理
										return { data: rdata.data, page: rdata.page }; //处理好数据后返回
									},
									column: [
										{ type: 'checkbox', class: '', width: 20 },
										{
											title: '文件名称',
											width: 200,
											template: function (row) {
												return '<span title="' + row.filename + '" style="width:200px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + row.name + '</span>';
											},
										},
										{
											title: '存储位置',
											width: 70,
											template: function (row) {
												var cloud_list = {
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
												var is_cloud = false,
													cloud_name = ''; //当前云存储类型
												if (row.filename.indexOf('|') != -1) {
													var _path = row.filename;
													is_cloud = true;
													cloud_name = _path.match(/\|(.+)\|/, '$1');
												} else {
													is_cloud = false;
												}
												return is_cloud ? '<span>' + cloud_list[cloud_name[1]] + '</span>' : '<span>本地</span>';
											},
										},
										{
											title: '文件大小',
											width: 80,
											template: function (row) {
												return '<span>' + bt.format_size(row.size) + '</span>';
											},
										},
										{ fid: 'addtime', title: '备份时间', width: 150 },
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
												if (ev.keyCode === 13) $(this).blur();
											},
										},
										// {
										//   title:'操作',
										//   width:140,
										//   template:function(row){
										//     var _opt = '<a class="btlink" herf="javascrpit:;" onclick="bt.database.input_sql(\'' + row.filename + '\',\'' + dataname + '\')">恢复</a> | ';
										//          _opt += '<a class="btlink" href="/download?filename=' + row.filename + '&amp;name=' + row.name + '" target="_blank">下载</a> | ';
										//         _opt += '<a class="btlink" herf="javascrpit:;" onclick="bt.database.del_backup(\'' + row.id + '\',\'' + id + '\',\'' + dataname + '\',\'' + row.addtime + '\')">删除</a>'
										//         return '<span>'+ _opt +'</span>';
										//   }
										// }
										{
											title: '操作',
											type: 'group',
											align: 'right',
											group: [
												{
													title: '恢复',
													event: function (row, index, ev, key, that) {
														bt.database.input_sql(row.filename, dataname);
													},
												},
												{
													title: '下载',
													event: function (row, index, ev, key, that) {
														window.open('/download?filename=' + row.filename + '&amp;name=' + row.name + '');
													},
												},
												{
													title: '删除',
													event: function (row, index, ev, key, that) {
														bt.simple_confirm(
															{ title: '删除备份文件-' + row.addtime + '', msg: '删除选中备份文件后，<span class="color-red">该备份文件将永久消失</span>，是否继续操作？' },
															function (index) {
																bt_tools.send({ url: '/database/pgsql/DelBackup', data: { data: JSON.stringify({ id: row.id }) } }, function (ress) {
																	pgSql.$refresh_table_list();
																	database_table.$refresh_table_list();
																	layer.msg(ress.msg, { icon: ress.status ? 1 : 2 });
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
											type: 'batch',
											positon: ['left', 'bottom'],
											config: {
												title: '删除',
												url: '/site?action=DelBackup',
												paramId: 'id',
												load: true,
												callback: function (that, index) {
													layer.close(index);
													bt.confirm({ title: '批量删除数据库备份', msg: '批量删除选中的数据库备份，<span class="color-red">备份文件将永久消失</span>，是否继续操作？', icon: 0 }, function (index) {
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
															pgSql.$batch_success_table({ title: '批量删除数据库备份', th: '文件名', html: html });
															pgSql.$refresh_table_list();
														});
													});
												},
											},
										},
										{
											//分页显示
											type: 'page',
											positon: ['right', 'bottom'], // 默认在右下角
											pageParam: 'p', //分页请求字段,默认为 : p
											page: 1, //当前分页 默认：1
											numberParam: 'limit', //分页数量请求字段默认为 : limit
											number: 10, //分页数量默认 : 20条
											numberList: [10, 20, 50, 100, 200], // 分页显示数量列表
											numberStatus: false, //　是否支持分页数量选择,默认禁用
											jump: false, //是否支持跳转分页,默认禁用
										},
									],
								});
								$('#btn_data_backupPgsql_All').click(function () {
									var allLoad = layer.msg('正在备份中,请稍后......', { icon: 16, shade: [0.3, '#000'], time: 0 });
									bt_tools.send(
										{ url: '/database/pgsql/ToBackup', data: { data: JSON.stringify({ id: id }) } },
										function (ress) {
											pgSql.$refresh_table_list();
											layer.msg(ress.msg, { icon: ress.status ? 1 : 2, shade: [0.3, '#000'], time: 0, shadeClose: true });
										},
										allLoad
									);
								});
								$('#btn_data_backupPgsql')
									.unbind('click')
									.click(function () {
										var pgsqlTable = null,
											btn_Type = 'db';
										bt_tools.open({
											title: '自定义备份 - [ ' + dataname + ' ]',
											area: ['600px', '560px'],
											class: 'p15',
											btn: ['备份', '取消'],
											content:
												'<div id="pgsqlForm"></div>\
																			<div id="dataBaseTablePgsql"></div><style type="text/css">#dataBaseTablePgsql thead th{background-color:#fff}</style>',
											success: function () {
												var pgsqlForm = bt_tools.form({
													el: '#pgsqlForm',
													class: 'pd20',
													form: [
														{
															group: {
																type: 'other',
																boxcontent: '<div><p>数据表</p><div id="dataBaseTablePgsql"></div></div>',
															},
														},
														{
															label: '备份方式',
															formLabelWidth: '71px',
															group: {
																type: 'radio',
																name: 'radioValue',
																width: '150px',
																value: 'db',
																list: [
																	{ title: '合并导出', value: 'db' },
																	{ title: '分表导出', value: 'table' },
																],
																event: function (formData, element, that) {
																	btn_Type = formData.radioValue;
																},
															},
														},
														{
															group: {
																type: 'help',
																list: ['合并导出：将选中的表导出到一个SQL文件内。', '分表导出：一张表存储为一个SQL文件。'],
															},
														},
													],
												});
												pgsqlTable = bt_tools.table({
													el: '#dataBaseTablePgsql',
													url: '/database/pgsql/GetInfo',
													default: '暂无数据',
													param: { data: JSON.stringify({ db_name: dataname }) },
													height: '250px',
													dataVerify: false, //为false可跳过异常处理
													tips: '正在获取数据，请稍后...',
													load: true,
													dataFilter: function (rdata) {
														if(!rdata.status) return []
														return { data: (rdata.data.table_list) };
													},
													column: [
														{ type: 'checkbox', class: 'checkBoxs', width: 20 },
														{
															fid: 'table_name',
															fixed: true,
															width: 300,
															title: '全选',
														},
														{
															fid: 'rows_count',
															width: 100,
															title: '行数',
														},
														{
															fid: 'total_size',
															title: '总大小',
															width: 80,
														},
													],
												});
											},
											yes: function (formD, indexs) {
												if (pgsqlTable.checkbox_list.length < 1) {
													layer.msg('请至少选择一项', { icon: 2 });
													return;
												}
												var table_list = [];
												$.each(pgsqlTable.checkbox_list, function (index, value) {
													table_list.push(pgsqlTable.data[value].table_name);
												});
												var pgsql_Backup_load = layer.msg('正在备份中，请稍后...', { icon: 16, time: 0, shade: [0.3, '#000'] });
												bt_tools.send(
													{ url: '/database/pgsql/ToBackup', data: { data: JSON.stringify({ storage_type: btn_Type, table_list: table_list, id: id }) } },
													function (ress) {
														// layer.close(pgsql_Backup_load);
														pgSql.$refresh_table_list();
														layer.msg(ress.msg, { icon: ress.status ? 1 : 2, time: 0, shadeClose: true, shade: [0.3, '#000'] });
													});
											},
											cancel: function () {},
										});
										$('#dataBaseTablePgsql').css('width', '560px');
									});
							},
						});
					}
				});
				$('#DataBackupListPgsql').css('min-height', '462px');
			}
    }
  },
  /**
   * @description 日志
   * @param {object}
   */
  backupLogs: function (row, index, ev, key, that) {
    var _that = this
    _that.getCrontabLogs(row, function (rdata) {
      layer.open({
        type: 1,
        title: lan.crontab.task_log_title,
        area: ['700px', '490px'],
        shadeClose: false,
        closeBtn: 2,
        content: '<div class="setchmod bt-form">\
          <pre class="crontab-log" style="overflow: auto; border: 0 none; line-height:23px;padding: 15px; margin: 0;white-space: pre-wrap; height: 405px; background-color: rgb(51,51,51);color:#f1f1f1;border-radius:0;"></pre>\
            <div class="bt-form-submit-btn" style="margin-top: 0">\
            <button type="button" class="btn btn-danger btn-sm btn-title" id="clearLogs" style="margin-right:15px;">'+ lan['public']['empty'] + '</button>\
            <button type="button" class="btn btn-success btn-sm btn-title">'+ lan['public']['close'] + '</button>\
          </div>\
        </div>',
        success: function (layers, index) {
          var log_body = rdata.msg === '' ? '当前日志为空' : rdata.msg, setchmod = $(".setchmod pre"), crontab_log = $('.crontab-log')[0]
          setchmod.text(log_body);
          crontab_log.scrollTop = crontab_log.scrollHeight;
          $('#clearLogs').on('click', function () {
            _that.clearCrontabLogs(row, function () {
              setchmod.text('')
            })
          })
          $('.setchmod .bt-form-submit-btn .btn-success').click(function(){
            layer.close(index)
          })
        }
      })
    })
  },
  /**
   * @description 执行备份任务
   * @param {object} param 参数对象
   * @param {function} callback 回调函数
   */
  startCrontabTask: function (param, callback) {
    bt_tools.send({
      url: '/crontab?action=StartTask',
      data: param
    }, function (res) {
      bt.msg(res)
      if (res.status && callback) callback(res)
    }, '执行备份任务');
  },
  /**
   * @description 获取执行日志
   * @param {object} param 参数对象
   * @param {function} callback 回调函数
   */
  getCrontabLogs: function (param, callback) {
    bt_tools.send({
      url: '/crontab?action=GetLogs',
      data: param
    }, function (res) {
      if (res.status) {
        if (callback) callback(res)
      } else {
        bt.msg(res)
      }
    }, '获取执行日志');
  },
  /**
   * @description 清空执行日志
   * @param {object} param 参数对象
   * @param {function} callback 回调函数
   */
  clearCrontabLogs: function (param, callback) {
    bt_tools.send({
      url: '/crontab?action=DelLogs',
      data: param
    }, function (res) {
      bt.msg(res)
      if (res.status && callback) callback(res)
    }, '清空执行日志');
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
  // 备份导入》本地导入
  upload_files: function (name) {
    var path = bt.get_cookie('backup_path') + "/database/";
    var is_pgsql = $('.database-pos .tabs-item.active').data('type') === 'pgsql'
    bt_upload_file.open(path, is_pgsql ? '.sql' : '.sql,.zip,.bak,.gz', is_pgsql ? '请上传sql' : lan.database.input_up_type, function () {
      database.input_database(name);
    });
  },
  //备份数据库
  backupList: function (type,db) {
    var _that = this
     $('#webedit-con-database').html('<div id="dbbackup_list">\
			<div class="flex dataLoad" style=""><span>数据加载中<img src="/static/img/loading.gif"></span></div>\
		</div>');
    var arry1 = [],arry = [],tbObj = {};
    var url = '' ,params = {},alldbname = [],alltablesname = []
    var search = {}
    dataBaseName(true)
		function dataBaseName(flag) {
			(database.databaseName = []), (alldbname = []), (arry1 = []),(tbObj = {});
			bt_tools.send({url:'project/binlog/get_databases'}, function (res) {
				if (res.data.length == 0) {
					database.databaseName = [{title: '当前没有数据库',value: ''}]
					arry1 = database.databaseName
				}else{
					database.databaseName = res.data
					for (var i = 0; i < database.databaseName.length; i++) {
						alldbname.push(database.databaseName[i])
					}
					$.each(alldbname, function (index, item) {
						arry1.push({ title: item.name + (item.cron_id == null || item.cron_id.length == 0 ? ' [无备份任务]' : ''), value: item.value });
						tbObj[item.value] = [];
						$.each(item.table_list, function (indexs, tb) {
							tbObj[item.value].push({ title: tb.tb_name + (tb.cron_id == null || tb.cron_id.length == 0 ? '[无备份任务]' : ''), value: tb.value })
						})
					});
				}
				if (flag) {
					if (type === 0) {
						url = 'project/binlog/get_databases_info';
						table();
					} else {
						if (database.databaseName.length == 0) {
							return layer.msg('当前没有数据库!');
						}
						if(db){
							refresh(db)
						}else{
							refresh('全部数据库');
						}

					}
				}
			});
		}
    function refresh(res) {
			url = 'project/binlog/get_increment_crontab';
			if(res == '全部数据库') {
				params = { db_name: '', };
			}else{
				params = { db_name: res, };
			}
      if (type == 1) {
        search ={
          type: 'search',
          positon: ['right', 'top'],
          placeholder: '请输入数据库名称',
          searchParam: 'datab_name', //搜索请求字段，默认为 search
          value: res,// 当前内容,默认为空
        }
      }
      table(res);
      $('#dbbackup_list .tootls_group.tootls_top .pull-right').prepend('\
      <div class="selects_conter">\
        <span class="select_text">数据库</span>\
        <div class="select_conter">\
        <span style="display: none;" class="database_hide_value"></span>\
        <input type="text" placeholder="请选择" autocomplete="off" class="inbox_input database_input"\
            name="inbox_input" style="border: none;" value="'+ (res ? res : '') +'">\
        <ul class="database_list" id="database_select_list"></ul>\
        <span class="select_down"></span>\
      </div>\
      ')
      $('.select_conter input').on('focus', function (e) {
        var _that = $(this),
            database_list = $(this).next(),
            _list = database_list.find('li'),
            database_default = $(this).prev(),
            html = '';
        _list.siblings().removeClass('active')
				html += '<li ' + (_that.val() == '全部数据库' ? 'class="active"' : '') + '>全部数据库</li>';
        for (var i = 0; i < arry1.length; i++) {
          var item = arry1[i]
          html += '<li '+ (_that.val() == item.value ? 'class="active"': '') + '>'+ item.value + '</li>'
        }
        $('.database_list').html(html)
        database_list.width($(this)[0].clientWidth);
        $(document).unbind('click').on('click', function (ev) {
          if (ev.target.className.indexOf('inbox_input') == -1 && ev.target.className.indexOf('select_down') == -1) {
            if (_that.val() == '' || _that.val() != database_default.text()) {
              _that.val(database_default.text())
            }
            database_list.hide();
          }else{
            if (ev.target.className == 'select_down') {
              if (database_list.css('display') == 'block') {
                database_list.hide()
              }else{
                database_list.show()
              }
            }else{
              database_list.show()
            }
          }
          ev.stopPropagation();
        });
        return false;
      })
      $('.select_conter .select_down').on('click',function () {
        $('.select_conter input').focus()
      })
      $('.select_conter input').on('input', function (e) {
        var html = '',_that = $(this)
				if (_that.val() == '') {
					html += '<li class=" " >全部数据库</li>';
				}
        for (var i = 0; i < arry1.length; i++) {
          var item = arry1[i]
          if (_that.val() != '') {
            if (item.value.indexOf(_that.val()) > -1) {
              html += '<li '+ (_that.val() == item.value ? 'class="active"': '') + '>'+ item.value + '</li>'
            }else{
              html += ''
            }
          }else{
            html += '<li>' + item.value + '</li>'
          }
          $('.database_list').html(html)
        }
      })
      $('.select_conter input').on('keydown', function (e) {
        if (e.keyCode == 13) {
          $('#dbbackup_list').html('');
          refresh($(this).val())
        }
      })
      $('.select_conter').on('click', 'li', function (e) {
        var item_val = $(this).text(),
            input = $(this).parent().prev();
        $(this).addClass('active').siblings().removeClass('active').parent().hide();
        $(this).parent().siblings(".database_hide_value").html(item_val);
        $(this).parent().siblings(".database_input").text(item_val);
        $('#dbbackup_list').html('');
        refresh(item_val)
        input.val(item_val);
      })
    }
    function getTables(res,callabck){
      alltablesname = [],arry = []
      //获取指定数据库表名
      bt_tools.send({url:'project/binlog/get_tables' , data: {db_name:res}}, function (res) {
        if (res.length == 0) {
          alltablesname = [{title:'当前数据库下没有表',value:''}]
          arry = alltablesname
        }else{
          for (var i = 0; i < res.length; i++) {
            alltablesname.push(res[i])
          }
          $.each(alltablesname,function(index,item){
            arry.push({ title: item.name+(item.cron_id == null || item.cron_id.length == 0 ? ' [无备份任务]':''), value: item.name })
          })
        }
        if(callabck) callabck(arry)
      })
    }
    /**
   * @description 删除计划任务
   * @param {object} param 参数对象
   * @param {function} callback 回调函数
   */
		function delCrontab(param, callback) {
			bt.input_confirm(
				{ title: '删除备份任务【' + param.name + '】', value: '删除备份任务', msg: "删除备份任务后，<span class='color-org'>备份数据将永久消失</span>，是否继续操作？" },
				function () {
					bt_tools.send({
						url: '/crontab?action=DelCrontab',
						data: { id: param.id }
					}, function (res) {
						bt.msg(res)
						if (res.status && callback) callback(res)
					}, '删除计划任务');
				}
			);

		}
	function formatType(config, formData) {
		var formConfig = config;
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
				formConfig.group[1].value = parseInt(formData.week)
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
	}
	/**
		* 获取告警设置
	*/
		function getAlarmSetting(value){
			// 获取告警列表
			bt_tools.send({
				url: '/config?action=get_msg_configs',
			}, function (alarms) {
						var html = '',alarmType = -1,accountConfigStatus = false,isConfig = []
						var channelType = ['mail','dingding','feishu','weixin','wx_account','sms']
						var channelName = ['邮箱','钉钉','飞书','企业微信','微信公众号','短信']
						var sendChannel = []
						var all = database.pushChannelMessage.getChannelSwitch(alarms, 'enterpriseBackup')
						$.each(all,function(index,item){
							isConfig.push(item.value)
							sendChannel.push({name: item.title,value: item.value})
						})
						$.each(channelType,function(index,item){
							if(isConfig.indexOf(item) == -1){
								sendChannel.push({name: channelName[index],value: item})
							}
						})
						sendChannel[0].name = '全部已安装通道'
						for(var i=0; i<sendChannel.length; i++){
								// if(rdata.msg == sendChannel[i].value) alarmType = i
								// if (sendChannel[i].value === 'wx_account') {
								// 	var item = alarms[sendChannel[i].value]
								// 	if (!$.isEmptyObject(item.data) && item.data.res.is_subscribe && item.data.res.is_bound) {
								// 		accountConfigStatus = true;
								// 	}
								// }
								var is_config = false
								if(sendChannel[i].value !='all' && sendChannel[i].value !=all[0].value){
									is_config = $.isEmptyObject(alarms[sendChannel[i].value].data)
								}
								html += '<li class="sn-alarm--item '+ (is_config ? ' disabled' : '') +'" name="'+sendChannel[i].value+'">'+sendChannel[i].name+ (is_config ? ' [<a target="_blank" class="bterror installNotice" data-type="' + sendChannel[i].value + '">未配置</a>]' : '') +'</li>'
						}
						$('.sn-alarm--list').html(html)
						$('.sn-alarm--channel').html(alarmType != -1 ? $('.sn-alarm--list .sn-alarm--item.active').hasClass('disabled') ? '请选择告警方式' : sendChannel[alarmType].name :'请选择告警方式')
								// 告警方式选择
						$('.sn-alarm--selectBox').off('click').on('click',function(e){
							var _ul = $(this).find('.sn-alarm--list');
							if(_ul.hasClass('show')){
									_ul.removeClass('show');
							}else{
									_ul.addClass('show');
							}
							$(document).one('click',function(){
									_ul.removeClass('show');
							})
							e.stopPropagation();
						})
						// 告警方式选择
							$('.sn-alarm--list').off('click').on('click','li',function(){
								if($(this).hasClass('disabled')) return
								var name = $(this).attr('name'),that = this;
												$('.sn-alarm--list li').removeClass('active')
												$(that).addClass('active')
												$('.sn-alarm--channel').text($(that).text())
												$('.sn-alarm--list').hide();
						})
						$('.sn-alarm--selectBox').find('.installNotice').unbind('click').click(function (ev) {
							ev.stopPropagation()
							var el = $(ev.currentTarget), type = $(el).data('type');
							openAlertModuleInstallView(type,null,function(){
								getAlarmSetting()
							});
						});
						if(value){
							$('.sn-alarm--list li').each(function(index,item){
							if(value == $(item).attr('name')){
								$(item).click()
								$('.sn-alarm--list').removeClass('show');
							}
						})
						}else{
							$('.sn-alarm--list li').eq(0).click();
							$('.sn-alarm--list').removeClass('show');
						}
			})
		}
		function table(db) {
			$('#dbbackup_list').html('');
      var backup_databases = bt_tools.table({
        el: '#dbbackup_list',
        url: url,
        param: params,
        load: true,
        default: type === 0 ? '数据库备份列表为空' : '备份列表为空', //数据为空时的默认提示
				height: 260,
        column: [
					{ fid: 'db_name', title: '数据库名', type: 'text'},
					{ title: '表名', type: 'text',template:function(row){
						return '<span style="display:inline-block;max-width:200px;white-space: nowrap; text-overflow: ellipsis; overflow: hidden;" title="'+ row.tb_name +'">'+ row.tb_name +'</span>'
					} },
					{ fid: 'full_size', title: '备份大小', width: 80, type: 'text' },
					{ fid: 'last_backup_time', title: '备份时间', width: 150, type: 'text' },
					{
						title: '操作',
						type: 'group',
						width: 270,
						align: 'right',
						group: [
							{
								title: '执行',
								hide: function (row) {
									return row.cron_id == [] || row.cron_id.length == 0 ? true : false;
								},
								event: function (row, index, ev, key, that) {
									database.startCrontabTask({ id: row.cron_id }, function () {
										that.$refresh_table_list();
										database_table.$refresh_table_list(true);
									});
								},
							},
							{
								title: '日志',
								hide: function (row) {
									return row.cron_id == [] || row.cron_id.length == 0 ? true : false;
								},
								event: function (row, index, ev, key, that) {
									database.backupLogs({ id: row.cron_id }, index, ev, key, that);
								},
							},
							{
								title: '记录',
								event: function (row, index, ev, key, that) {
									that.new_resume_download_backup({ gp_type: 0, title: '恢复', datab_name: row.db_name,url:'/project/binlog/restore_time_database',params:{cron_id:row.cron_id} });
								},
							},
							{
								title: '编辑',
								hide: function (row) {
									return row.cron_id == [] || row.cron_id.length == 0 ? true : false;
								},
								event: function (row, index, ev, key, that) {
									if (database.isLtdBackAndCap()) return;
									var editBackup = null;
									layer.open({
										type: 1,
										title: '编辑' + '[' + row.db_name + ']增量备份',
										closeBtn: 2,
										shadeClose: false,
										area: '590px',
										btn: ['提交', '取消'],
										skin: 'addDbbackup',
										content: '<div id="addDbbackup"></div>',
										success: function (layers, indexs) {
											$(':focus').blur();
											var mulpValues = [],
												mulpTitles = [];
											for (var i = 0; i < database.backuptoList.length; i++) {
												if (row['upload_' + database.backuptoList[i].value] == '') continue;
												mulpValues.push(row['upload_' + database.backuptoList[i].value]);
												mulpTitles.push(database.backuptoList[i].title);
											}
											editBackup = bt_tools.form({
												el: '#addDbbackup',
												data: row,
												class: 'pd15',
												form: [
													{
														label: '数据备份到',
														group: {
															type: 'multipleSelect',
															name: 'backupTo',
															width: '390px',
															value: row.backupTo,
															list: database.backuptoList,
															placeholder: '请选择数据备份到',
														},
													},
													{
														label: '压缩密码',
														group: {
															type: 'text',
															disabled: true,
															name: 'zip_password',
															width: '390px',
															value: row.zip_password,
														},
													},
													{
														label: '执行周期',
														group: [{
															type: 'select',
															name: 'type',
															value: 'week',
															width:'100px',
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
																formatType(that.config.form[2], formData)
																that.$replace_render_content(2)
															}
														}, {
															type: 'select',
															name: 'week',
															width: '70px',
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
															width: '50px',
															value: '3',
															unit: '日',
															min: 1,
															max: 31
														}, {
															type: 'number',
															name: 'hour',
															'class': 'group',
															width: '50px',
															value: '1',
																unit: '小时',
																min: 0,
															max: 23
														}, {
															type: 'number',
															name: 'minute',
															'class': 'group',
															width: '50px',
															min: 0,
															max: 59,
															value: '30',
															unit: '分钟'
														}]
													},
													{
														label: '备份提醒',
														group: [
															{
																type: 'select',
																name: 'notice',
																value: parseInt(row.notice),
																list: [
																	{ title: '不接收任何消息通知', value: 0 },
																	{ title: '任务执行失败接收通知', value: 1 },
																],
																change: function (formData, element, that) {
																	that.config.form[3].group[1].display = formData.notice == 0 ? false : true;
																	that.config.form[3].group[0].value = parseInt(formData.notice);
																	that.$replace_render_content(3);
																	if(formData.notice == 1) getAlarmSetting()
																},
															},
															{
																label: '消息通道',
																name: 'notice_channel',
																type: 'other',
																display: false,
																boxcontent:'<div class="sn-alarm--selectBox">\
																<span class="sn-alarm--channel">请选择告警方式</span>\
																<i class="sn-alram--selectIcon glyphicon glyphicon-menu-down"></i>\
																<ul class="sn-alarm--list"></ul>\
																</div>'
															},
														],
													},
												],
											});
											formatType(editBackup.config.form[2], row)
											editBackup.$replace_render_content(2)
											if(row.notice == 1) {
												editBackup.config.form[3].group[1].display = true;
												editBackup.$replace_render_content(3);
												getAlarmSetting(row.notice_channel)
											}
										},
										yes: function (indexs) {
											var formData = editBackup.$get_form_value();
											var _where1 = $('input[name=where1]'), _hour = $('input[name=hour]'), _minute = $('input[name=minute]')
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
													layer.msg('请输入正确的小时范围[0-23]', { icon: 2 });
													return false;
												}
											}
											if (_minute.length > 0) {
												if (_minute.val() > 59 || _minute.val() < 0 || _minute.val() == '') {
													_minute.focus();
													layer.msg('请输入正确的分钟范围[0-59]', { icon: 2 });
													return false;
												}
											}
											switch (formData.type) {
												case "minute-n":
													formData.where1 = formData.minute;
													formData.minute = '';
													if(formData.where1 < 1) return bt.msg({ status: false, msg: '分钟不能小于1！' })
													break;
												case "hour-n":
													formData.where1 = formData.hour;
													formData.hour = '';
													if(formData.minute <= 0 && formData.where1 <= 0) return bt.msg({ status: false, msg: '小时、分钟不能同时小于1！' })
													break;
													// 天/日默认最小为1
											}
											formData['cron_type'] = 'hour-n';
											formData['backup_type'] = row.type;
											// formData['datab_name'] = type == 0 ? row.name : $('input[name=inbox_input]').val();
											formData['cron_id'] = row.cron_id;
											formData['backup_id'] = row.backup_id;
											formData['notice_channel'] = formData.notice == 0 ? '' : formData.notice_channel;
											var multipleValues = $('select[name=backupTo]').val();
											if (multipleValues == null) return layer.msg('请最少选择一个备份类型');
												(formData['notice_channel'] = formData.notice == 0 ? '' : $('.sn-alarm--list .active').attr('name'));
												(formData['name'] = 'MySQL数据库增量备份['+ row.db_name +']');
												(formData['db_name'] = row.db_name);
												(formData['tb_name'] = row.tb_name == '所有' ? '' : row.tb_name);
												(formData['backupTo'] = multipleValues.join('|'));
												(formData['sType'] = '');
												(formData['sBody'] = '');
												(formData['sName'] = '');
												(formData['urladdress'] = '');
												(formData['save'] = '');
												(formData['save_local'] = 1);
												(formData['id'] = row.cron_id);

											//编辑
											bt_tools.send(
												{ url: '/project/binlog/modify_mysql_increment_crontab', data: formData },
												function (res) {
													bt_tools.msg(res);
													if (res.status) {
														layer.close(indexs);
														that.$refresh_table_list();
														database_table.$refresh_table_list(true);
													}
												},
												'编辑备份任务'
											);
										},
									});
								},
							},
							{
								title: '删除',
								event: function (row, index, ev, key, that) {
									delCrontab({ id: row.cron_id,name:row.name }, function (rdata) {
										bt_tools.msg(rdata);
										if (rdata.status) {
											that.$refresh_table_list();
											database_table.$refresh_table_list(true);
											dataBaseName(false);
										}
									})
								},
							},
						],
					},
				],
        methods: {
         /**
					 * @description 恢复 导出
					 * @param {object} config
					 */
					new_resume_download_backup: function (config) {
						var open = bt_tools.open({
							title:'【' + config.datab_name + '】备份记录',
							area:['750px','430px'],
							btn:false,
							content:"<div id='showBackupTable' style='margin:0 20px;'></div>",
							success:function(el,indexs){
									//打开弹窗后执行的事件
									bt_tools.table({
										el:'#showBackupTable',
										url:'/project/binlog/get_backup',
										default:'暂无数据',
										height: '335px',
										param:config.params,
										dataVerify: false,  //为false可跳过异常处理
										dataFilter: function (rdata) {
											 return {data: rdata.data}  //处理好数据后返回
										},
										column:[
											{
												fid: 'name',
												title: '备份名称',
												template:function(row){
													return "<span style='display:inline-block;width:310px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;' title='" + (row.localhost) +"'>" + (row.name) +"</span>"
												}
											},{
												fid: 'size',
												title: '备份大小',
												width:'120px',
												template:function(row){
													return "<span style='width:120px;'>" + (bt.format_size(row.size, true, 2)) +"</span>"
												}
											},{
												fid: 'type',
												title: '类型',
												width:'80px',
												template:function(row){
													return "<span style='width:100px;'>" + (row.type == 0? '增量':'全量') +"</span>"
												}
											},{
												fid: 'addtime',
												title: '时间点',
												width:'230px',
											},{
												title: "操作",
												type: 'group',
												align: 'right',
												width:'120px',
												group: [{
														title: '恢复',
														event: function (row, index, ev, key, that) {
																layer.open({
																	type: 1,
																	title: '恢复' + config.datab_name + '数据',
																	icon: 0,
																	skin: 'delete_site_layer',
																	area: '530px',
																	closeBtn: 2,
																	shadeClose: true,
																	content:
																		"<div class='bt-form webDelete hint_confirm pd30' id='site_delete_form'>" +
																		"<div class='hint_title'>\
																				<i class='hint-confirm-icon'></i>\
																				<div class='hint_con'>" +
																				'恢复后会<span style="color:red;font-size:14px;font-weight: bold;">覆盖当前数据库数据</span>，此操作不可逆，是否继续操作？' +
																		'</div>\
																			</div>' +
																		"<div >" +
																		'<br>' +
																		"</div>\
																				<div class='confirm-info-box'>\
																					<div>请手动输入“<span class='color-red'>我已知晓</span>”，完成验证</div>\
																					<input onpaste='return false;' id='prompt_input_box' type='text' value='' autocomplete='off' style='width: 440px;'>\
																				</div>" +
																		'</div>',
																	btn: ['确认恢复', '取消恢复'],
																	yes: function (indexs) {
																		var result = bt.replace_all($('#prompt_input_box').val(), ' ', '');
																		if (result == '我已知晓') {
																			bt_tools.send({url:'/project/binlog/restore_time_database',data:{cron_id:config.params.cron_id,node_time:row.addtime}},function(res){
																				if(res.status){
																					layer.msg(res.msg,{icon:1})
																					layer.close(indexs)
																				}
																			},'恢复' + '【' + config.datab_name + '】数据')
																		} else {
																			$('#prompt_input_box').focus();
																			return layer.msg('验证失败，请重新输入', { icon: 2 });
																		}
																	},
																	success: function () {
																		$(':focus').blur();
																	},
																});

														}
												},{
													title: '导出',
													event: function (row, index, ev, key, that) {
															bt_tools.send({url:'/project/binlog/export_time_database',data:{cron_id:config.params.cron_id,node_time:row.addtime}},function(res){
																if(res.status){
																	if(res.data){
																		bt_tools.open({
																			title:'导出【' + config.datab_name + '】数据',
																			area:['540px','360px'],
																			btn:false,
																			content:'<div id="">\
																			<div class="batch_title"><span class=""><span class="batch_icon"></span><span class="batch_text">导出成功！</span></span></div>\
																			<div class=" batch_tabel divtable" style="margin: 15px 30px 15px 30px;overflow: auto;height: 200px;">\
																			<table class="table table-hover"><thead>\
																			<tr><th>文件名称</th><th style="text-align:right;">文件大小</th><th style="text-align:right;width:150px;">操作</th></tr></thead><tbody><tr>\
																			<td title="'+ res.data.path +'">'+ res.data.name +'</td><td><div style="float:right;"><span>'+ bt.format_size(res.data.size, true, 2) +'</span></div></td>\
																			<td style="text-align: right;"><span style="width: 150px;"><a onclick="bt.pub.copy_pass(\''+ res.data.path +'\')" class="btlink group_1_srk5n" title="复制路径">复制路径</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="/download?filename=' + res.data.path +'" class="btlink group_2_srk5n" title="下载">下载</a></span></td>\
																			</tr></tbody></table></div>\
																			</div>',
																	})
																	}else{
																	layer.msg(res.msg,{icon:1})
																	}
																	layer.close(indexs)
																}
															},'导出' + '【' + config.datab_name + '】数据')

													}
											}]
										}
										],
										success:function(){
												$('#showBackupTable').find('.tips').remove()
												$('#showBackupTable').append('<span class="tips" style="color:#ef0808">恢复：会从最早【全量备份】开始恢复至选择的【增量备份】时间点</span>')
										}
								})
							},
							btn2:function(){
									// 取消按钮
							}
						})
					},
					/**
					 * @description 旧 恢复 下载
           * @param {object} config
           */
          resume_download_backup: function (config) {
            layer.open({
              type: 1,
              title:config.title+(type === 0 ? '数据库':'表' )+'【'+config.datab_name+'】数据',
              closeBtn: 2,
              shadeClose: false,
              area:['350px',config.backup_id == null ? '220px':'170px'],
              skin: 'restore',
              content: '<div id="restore" class="bt-form pd15">\
                <div class="line" style="display: '+(config.backup_id == null ? "block":"none")+'">\
                  <span class="tname">解压密码</span>\
                  <div class="info-r">\
                    <input type="text" class="bt-input-text mr5 showPwd" name="zip_password" placeholder="请输入解压密码" />\
                  </div>\
                </div>\
                <div class="line">\
                  <span class="tname">'+ config.title +'截止时间</span>\
                  <div class="info-r">\
                    <input id="calendar" type="text" class="bt-input-text mr5" name="calendar" placeholder="请输入'+ config.title +'截止时间" readOnly />\
                  </div>\
                </div>\
              </div>',
              btn: ['确定'+config.title, '关闭'],
              success: function (){
                laydate.render({
                  elem: '#calendar'
                  ,show: true //直接显示
                  ,closeStop: '#test1'
                  ,theme: '#20a53a'
                  ,trigger: 'click' //采用click弹出
                  ,min: config.start_time,
                  max: config.end_time,
                  vlue: bt.get_date(365),
                  type: 'datetime',
                  format: 'yyyy-MM-dd HH:mm:ss',
                  btns: ['clear','confirm']
                });
              },
              yes: function (indexs) {
                var url = '',title = ''
                var params = {
                  end_time : $('input[name=calendar]').val()
                }
                if(params.end_time == '') return layer.msg("截止时间不能为空")
                if(config.backup_id == null){
                  if($('input[name=zip_password]').val() == ''){
                    return layer.msg("解压密码不能为空")
                  }else{
                    params['zip_password'] = $('input[name=zip_password]').val()
                  }
                }
                if (type == 0) {
                  params['datab_name'] = config.datab_name
                } else {
                  params['datab_name'] = $('input[name=inbox_input]').val()
                  params['table_name'] = config.datab_name
                }
                if (config.gp_type == 0){//恢复
                  url = 'project/binlog/restore_to_database'
                  params['backup_id'] = config.backup_id
                  title = '恢复备份任务'
                }else {//下载
                  params['backup_type'] =  type == 0 ? 'databases' : 'tables'
                  url = 'project/binlog/export_data'
                  title = '下载备份任务'
                }
                bt_tools.send({url:url, data:params } , function (res) {
                  if (config.gp_type == 0) {
                    layer.msg(res.msg, {icon: res.status ? 1:2})
                    if(res.status) layer.close(indexs)
                  }else{
                    if (typeof res.name == "undefined") {
                      if (!res.status) {
                        layer.msg(res.msg, {icon: 2})
                      }
                    }else{
                      layer.close(indexs)
                      window.location.href = '/download?filename='+res.name
                    }
                  }
                },title)
              }
            })
          },
          /**
           * @description 删除站点备份
           * @param {object} config
           * @param {function} callback
           */
          del_database_backup: function (config, callback) {
            bt.prompt_confirm("删除备份任务","删除备份任务[" + config.name + "]，删除此任务会连备份数据一起删除,是否继续？",function () {
              bt_tools.send({url:'project/binlog/delete_mysql_binlog_setting',data: {cron_id:config.cron_id,backup_id:config.backup_id,type:'manager'}}, function (rdata) {
                if (callback) callback(rdata)
              }, '删除备份任务')
            })
          }
        },
        tootls: [{ // 按钮组
          type: 'group',
          positon: ['left', 'top'],
          list: [{
            title: '添加备份任务',
            active: true,
            event: function (ev, that) {
              if(database.isLtdBackAndCap()) return
              var addDBbackup = null;
              layer.open({
                type: 1,
                title:'添加备份任务',
                closeBtn: 2,
                shadeClose: false,
                area: '590px',
                btn: ['提交','取消'],
                skin: 'addDbbackup',
                content: '<div id="addDbbackup"></div>',
                success: function (layers, indexs) {
									$('.addDbbackup').css('top', '410px');
                  addDBbackup = bt_tools.form({
                    el: '#addDbbackup',
                    class: 'pd15',
                    form: [
                      {
												label: '选择数据库',
												group: {
													type: 'select',
													name: 'db_name',
													width: '390px',
													list: arry1,
													value: db ? db : undefined,
													change: function (formData, element, that) {
														if (type == 1) {
															// getTables(formData.datab_name, function (res) {
																that.config.form[1].group.list = tbObj[formData.db_name];
																that.config.form[1].group.value = that.config.form[1].group.list[0].value;
																that.$replace_render_content(1);
																var html = '<span class="tbName" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">所有</span>'
																$('[data-name=tb_name] .bt_select_value').find('.bt_select_content').remove()
																$('[data-name=tb_name] .bt_select_value').append(html)
																$('[data-name=tb_name] .bt_select_list li').addClass('active')
															// });
														}
													},
												},
											},
                      {
                        label: '选择表',
                        hide: type === 1 ? false : true,
                        group: {
													type: 'multipleSelect',
													name: 'tb_name',
													width: '390px',
													list: tbObj[arry1[0].value],
													value:[''],
													change: function (formData, element, that) {
														var li = $(this)
														var con = $('[data-name=tb_name] .bt_select_value')
														var value = $('select[name=tb_name]').val()
														if(!value){
															layer.msg('至少选择1个！')
															var oldValue = li.attr('title').split('[')[0]
															value = [oldValue]
															$('select[name=tb_name]').val([oldValue])
															li.addClass('active')
														}
														if(li.attr('title')=='所有'){
															//点击所有
															if(li.hasClass('active')){
																li.siblings().addClass('active')
																$('select[name=tb_name]').val([''])
																value = ['所有']
															}else{
																li.siblings().removeClass('active')
																$('select[name=tb_name]').val([])
																value = ['请选择表']
															}
														}else{
															if(li.hasClass('active')){
																//其它选项选中
																var isALL=true
																li.siblings().not(':first').each(function(i){
																	if(!($(this).hasClass('active'))){
																		isALL=false
																		return
																	}
																})
																if(isALL){
																	$(li.siblings()[0]).addClass('active')
																	value = ['所有']
																$('select[name=tb_name]').val([''])
																}
															}else{
																//其它选项取消
																$(li.siblings()[0]).removeClass('active')
																var selectedValues = $('select[name=tb_name]').val();
																if (selectedValues) {
																	var filteredValues = selectedValues.filter(function(item) {
																		return item !== '';
																	});
																	$('select[name=tb_name]').val(filteredValues);
																}
																value = $('select[name=tb_name]').val()
																// if(li.parent().prev().find('.bt_select_content').first().children().first().html()=='所有'){
																// 	li.parent().prev().find('.bt_select_content').first().remove()
																// }
															}
														}
														$('.tbName').remove()
														$('.moreTips').remove()
														con.find('.bt_select_content_def').remove()
														var html = '<span class="tbName" style="width:280px;white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">'+ value.join(',') +'</span>'
														var more = '<span class="moreTips">...等'+ value.length +'个表</span>'
														con.find('.bt_select_content').remove()
														con.append(html)
														if(value.length > 3){
															con.append(more)
															}
														con.attr('title',value.join(','))
														con.parents('.info-r').siblings('.tname').css({'height':'35px','line-height':'35px'})
														con.siblings('.bt_select_list').css('top','47px')
														con.siblings('.bt_select_list_arrow').css('top','31px')
														con.siblings('.bt_select_list_arrow_fff').css('top','32px')
													}
												},
                      },
                      {
                        label: '数据备份到',
                        group: {
                          type: 'multipleSelect',
                          name: 'upload_alioss',
                          width: '390px',
                          value: ['localhost'],
                          list: database.backuptoList,
                          placeholder: '请选择数据备份到'
                        }
                      },
                      {
                        label: '压缩密码',
                        group: {
                          type: 'text',
                          name: 'zip_password',
                          width: '390px',
                          placeholder: '请输入压缩密码，可为空',
                          unit: '<span class="glyphicon glyphicon-repeat cursor mr5"></span>'
                        }
                      },
											{
												label: '执行周期',
												group: [{
													type: 'select',
													name: 'type',
													value: 'week',
													width:'100px',
													value:'hour-n',
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
														formatType(that.config.form[4], formData)
														that.$replace_render_content(4)
													}
												}, {
													type: 'select',
													name: 'week',
													width: '70px',
													display: false,
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
													width: '50px',
														value: '3',
													unit: '日',
													min: 1,
													max: 31
												}, {
													type: 'number',
													name: 'hour',
													'class': 'group',
													width: '50px',
													value: '1',
														unit: '小时',
														min: 0,
													max: 23
												}, {
													type: 'number',
													name: 'minute',
													'class': 'group',
													width: '50px',
													min: 0,
													max: 59,
													value: '30',
													unit: '分钟'
												}]
											},
                      {
                        label: '备份提醒',
                        group: [{
                          type: 'select',
                          name: 'notice',
                          value: 0,
                          list: [
                            { title: '不接收任何消息通知', value: 0 },
                            { title: '任务执行失败接收通知', value: 1 }
                          ],
                          change: function (formData, element, that) {
                            that.config.form[5].group[1].display = formData.notice == 0 ? false : true
                            that.config.form[5].group[0].value = parseInt(formData.notice)
                            that.$replace_render_content(5)
														if(formData.notice == 1) getAlarmSetting()
                          }
                        }, {
													label: '消息通道',
													name: 'notice_channel',
													type: 'other',
													display: false,
													boxcontent:'<div class="sn-alarm--selectBox">\
													<span class="sn-alarm--channel">请选择告警方式</span>\
													<i class="sn-alram--selectIcon glyphicon glyphicon-menu-down"></i>\
													<ul class="sn-alarm--list"></ul>\
													</div>'

												}]
                      }
                    ]
                  })
									var html = '<span class="tbName" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">所有</span>'
											$('[data-name=tb_name] .bt_select_value').find('.bt_select_content').remove()
											$('[data-name=tb_name] .bt_select_value').append(html)
											$('[data-name=tb_name] .bt_select_list li').addClass('active')
                  $('#addDbbackup .pd15').append("<ul class='help-info-text c7 mlr20'>\
                      <li style='color:red;'>注意：请牢记压缩密码，以免因压缩密码导致无法恢复和下载数据</li>\
                  </ul>");
                  $('#addDbbackup .unit .glyphicon-repeat').click(function (){
                    $('#addDbbackup input[name=zip_password]').val(bt.get_random(bt.get_random_num(6,10)))
                  })
                },
                yes: function (indexs) {
                  var formData = addDBbackup.$get_form_value();
									var _where1 = $('input[name=where1]'), _hour = $('input[name=hour]'), _minute = $('input[name=minute]')
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
											layer.msg('请输入正确的小时范围[0-23]', { icon: 2 });
											return false;
										}
									}
									if (_minute.length > 0) {
										if (_minute.val() > 59 || _minute.val() < 0 || _minute.val() == '') {
											_minute.focus();
											layer.msg('请输入正确的分钟范围[0-59]', { icon: 2 });
											return false;
										}
									}
									switch (formData.type) {
										case "minute-n":
											formData.where1 = formData.minute;
											formData.minute = '';
											if(formData.where1 < 1) return bt.msg({ status: false, msg: '分钟不能小于1！' })
											break;
										case "hour-n":
											formData.where1 = formData.hour;
											formData.hour = '';
											if(formData.minute <= 0 && formData.where1 <= 0) return bt.msg({ status: false, msg: '小时、分钟不能同时小于1！' })
											break;
											// 天/日默认最小为1
									}
									formData['cron_type'] = 'hour-n';
									formData['backup_type'] = type === 0 ? 'databases' : 'tables';
									var multipleValues = $('select[name=upload_alioss]').val();
									if (multipleValues == null) return layer.msg('请最少选择一个备份类型');
										(formData['notice_channel'] = formData.notice == 0 ? '' : $('.sn-alarm--list .active').attr('name'));
										(formData['name'] = 'MySQL数据库增量备份['+ formData['db_name'] +']');
										(formData['backupTo'] = multipleValues.join('|'));
										(formData['sType'] = 'enterpriseBackup');
										(formData['sBody'] = '');
										(formData['sName'] = 'tables');
										(formData['urladdress'] = '');
										(formData['save'] = '');
										(formData['save_local'] = 1);
										var tb_name = $('select[name=tb_name]').val()
										if(!tb_name) return layer.msg('请最少选择一个备份表');
										(formData['tb_name'] = tb_name.join(','));
									//添加
									bt_tools.send({ url: 'project/binlog/add_mysql_increment_crontab', data: formData }, function (res) {
										// bt_tools.msg(res);
										if (res.status) {
											layer.close(indexs);
											that.$refresh_table_list();
											database_table.$refresh_table_list(true);
											dataBaseName(false);
										}
									});
                }
              })

            }
          }]
        },
          //分页显示
          {
            type: 'page',
            positon: ['right', 'bottom'], // 默认在右下角
            pageParam: 'p', //分页请求字段,默认为 : p
            page: 1, //当前分页 默认：1
            // numberParam: 'limit',
            //分页数量请求字段默认为 : limit
            // defaultNumber: 10
            //分页数量默认 : 20条
          }]
      })
      $('#dbbackup_list').append("<ul class='help-info-text c7'>\
          <li>备份大小：备份大小包含完全备份数据大小和增量备份数据大小</li>\
          <li>备份会保留一个星期的备份数据，当备份时，检测到完全备份为一个星期前，会重新完全备份</li>\
          <li>请勿同一时间添加多个备份任务，否则可能因同一时间执行多个备份任务导致文件句柄数打开过多或者爆内存</li>\
      </ul>");
    }
  },
  isLtdBackAndCap: function () {
    var ltd = parseInt(bt.get_cookie('ltd_end')  || -1)
    if(ltd <= 0){
      var item = {
        name: 'enterprise_backup',
        pluginName: '企业增量备份',
        ps: '指定数据库或指定表增量备份，支持InnoDB和MyISAM两种存储引擎，可增量备份至服务器磁盘、阿里云OSS、腾讯云COS、七牛云存储、华为云存储、百度云存储',
        preview: false,
        description:['快速恢复数据','支持数据安全保护','支持增量备份','支持差异备份'],
        imgSrc:'https://www.bt.cn/Public/new/plugin/introduce/database/backup.png'
      }
      product_recommend.recommend_product_view(item, {
        imgArea: ['890px', '620px']
      },'ltd',54,item.name)
      return true
    }
    return false
  },
  get_backup: function () {
    var that = this;
    if(database.isLtdBackAndCap()) return
    bt_tools.send({url:'project/binlog/get_binlog_status'}, function (res) {
      if (res.status) {
        bt.open({
          type: 1,
          area: ['890px','620px'],
          title: '企业增量备份',
          closeBtn: 2,
          skin: 'databaseBackup',
          shift: 0,
          content:
			"<div id='webedit-con-database' class='bt-w-con webedit-con pd15' style='margin-left:0;'></div>",
					success: function () {
            database.backupList(1);
          }
        })
      } else {
        layer.msg('请检查数据库是否正常运行或二进制日志是否开启！', { time: 0, shadeClose: true, shade: .3 });
      }
    },'检测是否开启二进制日志')
  },
  /**
   * @name 删除导入的文件
   * @author hwliang<2021-09-09>
   * @param {string} filename
   * @param {string} name
   */
  rm_input_file: function (filename, name) {
    bt.files.del_file(filename, function (rdata) {
      bt.msg(rdata);
      database.input_database(name);
    })
  },
  // 备份导入
  input_database: function (name,mType) {
    var path = bt.get_cookie('backup_path') + "/database";

    bt.files.get_files(path, '', function (rdata) {
      var data = [];
      for (var i = 0; i < rdata.FILES.length; i++) {
        if (rdata.FILES[i] == null) continue;
        var fmp = rdata.FILES[i].split(";");
        var ext = bt.get_file_ext(fmp[0]);
        if(mType == 'mongodb'){
					var intactExt = fmp[0].match(/\.(.*)/)[1]
          var mdbFileType = ["zip","gz","json","csv","json.zip","json.gz","csv.zip","csv.gz"]
          if($.inArray(intactExt,mdbFileType) == -1) continue;
        }else{
          if (ext != 'sql' && ext != 'zip' && ext != 'gz' && ext != 'tgz' && ext != 'bak') continue;
        }
        data.push({
          name: fmp[0],
          size: fmp[1],
          etime: fmp[2],
        })
      }
      if ($('#DataInputList').length <= 0) {
        bt.open({
          type: 1,
          skin: 'demo-class',
          area: ["600px", "478px"],
          title: lan.database.input_title_file,
          closeBtn: 2,
          shift: 5,
          shadeClose: false,
          content: '\
            <div class="pd15 bt_table">\
              <div class="clearfix">\
                <button class="btn btn-default btn-sm" onclick="database.upload_files(\'' + name + '\')">' + lan.database.input_local_up + '</button>\
                <div class="pull-right">\
                  \
                </div>\
              </div>\
              <div class="divtable mtb15" style="max-height:274px; overflow:auto; border: 1px solid #ddd;">\
                <table id="DataInputList" class="table table-hover" style="border: none;"></table>\
              </div>' +
              bt.render_help($('.database-pos .tabs-item.active').data('type') === 'pgsql' ? ['仅支持sql',(bt.os != 'Linux' ? lan.database.input_ps3.replace(/\/www.*\/database/, path) : lan.database.input_ps3)] : [lan.database.input_ps1, lan.database.input_ps2, (bt.os != 'Linux' ? lan.database.input_ps3.replace(/\/www.*\/database/, path) : lan.database.input_ps3)]) +
              '</div>\
            ',
						success:function(){
							if(mType == 'mongodb')$('.demo-class').find('.help-info-text').html('<li>仅支持zip、gz、json、csv、（.json.zip|.json.gz|.csv.zip|.csv.gz）</li><li>bson 格式需压缩成 zip|gz 压缩包结构：目录/目录/*.bson文件（目录名无要求）</li>')
						}
        });
      }
      setTimeout(function () {
        bt.fixed_table('DataInputList');
        bt.render({
          table: '#DataInputList',
          columns: [{
            field: 'name',
            title: lan.files.file_name,
            width: 220,
            fixed: true
          },
            {
              field: 'etime',
              title: lan.files.file_etime,
              templet: function (item) {
                return bt.format_data(item.etime);
              }
            },
            {
              field: 'size',
              title: lan.files.file_size,
              templet: function (item) {
                return bt.format_size(item.size)
              }
            },
            {
              field: 'opt',
              title: '操作',
              align: 'right',
							templet: function (item) {
                return '<span><a class="btlink" herf="javascrpit:;" onclick="bt.database.input_sql(\'' + bt.rtrim(rdata.PATH, '/') + "/" + item.name + '\',\'' + name + '\')">导入</a>  | <a class="btlink" herf="javascrpit:;" onclick="database.rm_input_file(\'' + bt.rtrim(rdata.PATH, '/') + "/" + item.name + '\',\'' + name + '\')">删除</a></span>';
              }
            },
          ],
          data: data
        });
      }, 100)
    }, 'mtime')
  },
  // 工具
  rep_tools: function (db_name, res) {
    var loadT = layer.msg('正在获取数据,请稍候...', {
      icon: 16,
      time: 0
    });
    bt.send('GetInfo', 'database/GetInfo', {
      db_name: db_name
    }, function (rdata) {
      layer.close(loadT)
      if (rdata.status === false) {
        layer.msg(rdata.msg, {
          icon: 2
        });
        return;
      }
      var types = {
        InnoDB: "MyISAM",
        MyISAM: "InnoDB"
      };
      var tbody = '';
      for (var i = 0; i < rdata.tables.length; i++) {
        if (!types[rdata.tables[i].type]) continue;
        tbody += '<tr>\
                        <td><input value="dbtools_' + rdata.tables[i].table_name + '" class="check" onclick="database.selected_tools(null,\'' + db_name + '\');" type="checkbox"></td>\
                        <td><span style="width:220px;"> ' + rdata.tables[i].table_name + '</span></td>\
                        <td>' + rdata.tables[i].type + '</td>\
                        <td><span style="width:90px;"> ' + rdata.tables[i].collation + '</span></td>\
                        <td>' + rdata.tables[i].rows_count + '</td>\
                        <td>' + rdata.tables[i].data_size + '</td>\
                        <td style="text-align: right;">\
                            <a class="btlink" onclick="database.rep_database(\'' + db_name + '\',\'' + rdata.tables[i].table_name + '\')">修复</a> |\
                            <a class="btlink" onclick="database.op_database(\'' + db_name + '\',\'' + rdata.tables[i].table_name + '\')">优化</a> |\
                            <a class="btlink" onclick="database.to_database_type(\'' + db_name + '\',\'' + rdata.tables[i].table_name + '\',\'' + types[rdata.tables[i].type] + '\')">转为' + types[rdata.tables[i].type] + '</a>\
                        </td>\
                    </tr> '
      }

      if (res) {
        $(".gztr").html(tbody);
        $("#db_tools").html('');
        $("input[type='checkbox']").attr("checked", false);
        $(".tools_size").html('大小：' + rdata.data_size);
        return;
      }

      layer.open({
        type: 1,
        title: "MySQL工具箱【" + db_name + "】",
        area: ['780px', '580px'],
        closeBtn: 2,
        shadeClose: false,
        content: '<div class="pd15">\
                                <div class="db_list">\
                                    <span><a>数据库名称：' + db_name + '</a>\
                                    <a class="tools_size">大小：' + rdata.data_size + '</a></span>\
                                    <span id="db_tools" style="float: right;"></span>\
                                </div >\
                                <div class="divtable">\
                                <div  id="database_fix"  style="height:360px;overflow:auto;border:#ddd 1px solid">\
                                <table class="table table-hover "style="border:none">\
                                    <thead>\
                                        <tr>\
                                            <th><input class="check" onclick="database.selected_tools(this,\'' + db_name + '\');" type="checkbox"></th>\
                                            <th>表名</th>\
                                            <th>引擎</th>\
                                            <th>字符集</th>\
                                            <th>行数</th>\
                                            <th>大小</th>\
                                            <th style="text-align: right;">操作</th>\
                                        </tr>\
                                    </thead>\
                                    <tbody class="gztr">' + tbody + '</tbody>\
                                </table>\
                                </div>\
                            </div>\
                            <ul class="help-info-text c7">\
                                <li>【修复】尝试使用REPAIR命令修复损坏的表，仅能做简单修复，若修复不成功请考虑使用myisamchk工具</li>\
                                <li>【优化】执行OPTIMIZE命令，可回收未释放的磁盘空间，建议每月执行一次</li>\
                                <li>【转为InnoDB/MyISAM】转换数据表引擎，建议将所有表转为InnoDB</li>\
                            </ul></div>'
      });
      tableFixed('database_fix');
      //表格头固定
      function tableFixed (name) {
        var tableName = document.querySelector('#' + name);
        tableName.addEventListener('scroll', scrollHandle);
      }

      function scrollHandle (e) {
        var scrollTop = this.scrollTop;
        //this.querySelector('thead').style.transform = 'translateY(' + scrollTop + 'px)';
        $(this).find("thead").css({
          "transform": "translateY(" + scrollTop + "px)",
          "position": "relative",
          "z-index": "1"
        });
      }
    });
  },
  selected_tools: function (my_obj, db_name) {
    var is_checked = false
    if (my_obj) is_checked = my_obj.checked;
    var db_tools = $("input[value^='dbtools_']");
    var n = 0;
    for (var i = 0; i < db_tools.length; i++) {
      if (my_obj) db_tools[i].checked = is_checked;
      if (db_tools[i].checked) n++;
    }
    if (n > 0) {
      var my_btns = '<button class="btn btn-default btn-sm" onclick="database.rep_database(\'' + db_name + '\',null)">修复</button><button class="btn btn-default btn-sm" onclick="database.op_database(\'' + db_name + '\',null)">优化</button><button class="btn btn-default btn-sm" onclick="database.to_database_type(\'' + db_name + '\',null,\'InnoDB\')">转为InnoDB</button></button><button class="btn btn-default btn-sm" onclick="database.to_database_type(\'' + db_name + '\',null,\'MyISAM\')">转为MyISAM</button>'
      $("#db_tools").html(my_btns);
    } else {
      $("#db_tools").html('');
    }
  },
  rep_database: function (db_name, tables) {
    dbs = database.rep_checkeds(tables)
    var loadT = layer.msg('已送修复指令,请稍候...', {
      icon: 16,
      time: 0
    });
    bt.send('ReTable', 'database/ReTable', {
      db_name: db_name,
      tables: JSON.stringify(dbs)
    }, function (rdata) {
      layer.close(loadT)
      if (rdata.status) {
        database.rep_tools(db_name, true);
      }
      layer.msg(rdata.msg, {
        icon: rdata.status ? 1 : 2
      });
    });
  },
  op_database: function (db_name, tables) {
    dbs = database.rep_checkeds(tables)
    var loadT = layer.msg('已送优化指令,请稍候...', {
      icon: 16,
      time: 0
    });
    bt.send('OpTable', 'database/OpTable', {
      db_name: db_name,
      tables: JSON.stringify(dbs)
    }, function (rdata) {
      layer.close(loadT)
      if (rdata.status) {
        database.rep_tools(db_name, true);
      }
      layer.msg(rdata.msg, {
        icon: rdata.status ? 1 : 2
      });
    });
  },
  to_database_type: function (db_name, tables, type) {
    dbs = database.rep_checkeds(tables)
    var loadT = layer.msg('已送引擎转换指令,请稍候...', {
      icon: 16,
      time: 0,
      shade: [0.3, "#000"]
    });
    bt.send('AlTable', 'database/AlTable', {
      db_name: db_name,
      tables: JSON.stringify(dbs),
      table_type: type
    }, function (rdata) {
      layer.close(loadT);
      if (rdata.status) {
        database.rep_tools(db_name, true);
      }
      layer.msg(rdata.msg, {
        icon: rdata.status ? 1 : 2
      });
    });
  },
  rep_checkeds: function (tables) {
    var dbs = []
    if (tables) {
      dbs.push(tables)
    } else {
      var db_tools = $("input[value^='dbtools_']");
      for (var i = 0; i < db_tools.length; i++) {
        if (db_tools[i].checked) dbs.push(db_tools[i].value.replace('dbtools_', ''));
      }
    }

    if (dbs.length < 1) {
      layer.msg('请至少选择一张表!', {
        icon: 2
      });
      return false;
    }
    return dbs;
  },
  // 改密
  set_data_pass: function (id, username, password) {
    var that = this,
        bs = bt.database.set_data_pass(function (rdata) {
          if (rdata.status) database_table.$refresh_table_list(true);
          bt.msg(rdata);
        })
    $('.name' + bs).val(username);
    $('.id' + bs).val(id);
    $('.password' + bs).val(password);
  },
  // 删除
  del_database: function (wid, dbname,obj, callback) {
    var is_db_type = false, del_data = []
    if(typeof wid === 'object') {
      del_data = wid
      is_db_type = wid.some(function(item){
        return item.db_type > 0
      })
      var ids = [];
      for (var i = 0; i < wid.length; i++) {
        ids.push(wid[i].id);
      }
      wid = ids
    }
    var type = $('.database-pos .tabs-item.active').data('type'),
        title = '',
        tips = '';
    title = typeof dbname === "function" ? '批量删除数据库' : '删除数据库 - [ ' + dbname + ' ]';
    tips = is_db_type || !recycle_bin_db_open || type !== 'mysql' ? '<span class="color-red">当前列表存在彻底删除后无法恢复的数据库</span>，请仔细查看列表，以防误删，是否继续操作？' : '当前列表数据库将迁移至数据库回收站，如需彻底删除请前往数据库回收站，是否继续操作？'
    var arrs = wid instanceof Array ? wid : [wid]
    var ids = JSON.stringify(arrs),
        countDown = 9;
    if (arrs.length == 1) countDown = 4
    var loadT = bt.load('正在检测数据库数据信息，请稍候...'),
        param = {url:'database/'+bt.data.db_tab_name+'/check_del_data',data:{data:JSON.stringify({ids: ids})}}
    if(bt.data.db_tab_name == 'mysql') param = {url:'database?action=check_del_data',data:{ids:ids}}
    bt_tools.send(param,function(res){
      loadT.close()
      layer.open({
        type: 1,
        title: title,
        area: '740px',
        skin: 'verify_site_layer_info active',
        closeBtn: 2,
        shadeClose: true,
        content: '<div class="check_delete_site_main hint_confirm pd30">'+
          "<div class='hint_title'>\
            <i class=\'hint-confirm-icon\'></i>\
            <div class=\'hint_con\'>"+tips+"</div>\
          </div>"+
          '<div id="check_layer_content" class="ptb15">' +
          '</div>' +
          '<div class="check_layer_message">'+
          (is_db_type ? '<span class="color-red">注意：远程数据库暂不支持数据库回收站，选中的数据库将彻底删除</span><br>' : '')+
          (!recycle_bin_db_open ? '<span class="color-red">风险操作：当前数据库回收站未开启，删除数据库将永久消失</span><br>' : '')
          +'<span class="message_count">请仔细阅读以上要删除信息，防止数据库被误删，下一步还有 <span class="count_down" style="color:red;font-weight: bold;">' + countDown + '</span> 秒可以操作。</span></div>' +
        '</div>',
        // btn: ['下一步(' + countDown + '秒后继续操作)', lan.public.cancel],
        btn: ['下一步', lan.public.cancel],
        success: function (layers) {
          setTimeout(function () { $(layers).css('top', ($(window).height() - $(layers).height()) / 2); }, 50)
          var rdata = res.data,
              newTime = parseInt(new Date().getTime() / 1000),
              t_icon = ' <span class="glyphicon glyphicon-info-sign" style="color: red;width:15px;height: 15px;;vertical-align: middle;"></span>';
          for (var j = 0; j < rdata.length; j++) {
            for (var i = 0; i < del_data.length; i++) {
              if(rdata[j].id == del_data[i].id) {
                var is_time_rule = (newTime - rdata[j].st_time) > (86400 * 30) && (rdata[j].total > 1024 * 10),
                  is_database_rule = res.db_size <= rdata[j].total,
                  database_time = bt.format_data(rdata[j].st_time, 'yyyy-MM-dd'),
                  database_size = bt.format_size(rdata[j].total);
                var f_size = database_size
                var t_size = '注意：此数据库较大，可能为重要数据，请谨慎操作.\n数据库：' + database_size;
                if (rdata[j].total < 2048) t_size = '注意事项：当前数据库不为空，可能为重要数据，请谨慎操作.\n数据库：' + database_size;
                if (rdata[j].total === 0) t_size = '';
                rdata[j]['t_size'] = t_size
                rdata[j]['f_size'] = f_size
                rdata[j]['database_time'] = database_time
                rdata[j]['is_time_rule'] = is_time_rule
                rdata[j]['is_database_rule'] = is_database_rule
                rdata[j]['db_type'] = del_data[i].db_type
                rdata[j]['conn_config'] = del_data[i].conn_config
              }
            }
          }
          var filterData = rdata.filter(function (el) {
            return ids.indexOf(el.id) != -1
          })
          bt_tools.table({
            el: '#check_layer_content',
            data: filterData,
            height: '300px',
            column: [
              { fid: 'name', title: '数据库名称' },
              { title: '数据库大小',template: function (row) {
                return '<span class="'+ (row.is_database_rule ? 'warning' : '') +'" style="width: 110px;" title="' + row.t_size + '">' + row.f_size + (row.is_database_rule ? t_icon : '') + '</span>'
              }},
							{
								title: '数据库表',
								template: function (row) {
									return (
										'<span class="btlink showDelTable" data-sid="'+ row.sid +'" data-name="'+ row.name +'" style="width: 70px;" title="点击查看表">查看</span>'
									);
								},
							},
              { title: '数据库位置',template: function (row) {
                var type_column = '-'
                switch(row.db_type){
                  case 0:
                    type_column = '本地数据库'
                    break;
                  case 1:
                  case 2:
                    type_column = '远程数据库'
                    break;
                }
                return '<span style="width: 110px;" title="' + type_column + '">' + type_column + '</span>'
              }},
              { title: '创建时间',template: function (row) {
                return '<span ' + (is_time_rule && row.total != 0 ? 'class="warning"' : '') +' title="' + (row.is_time_rule && row.total != 0 ? '重要：此数据库创建时间较早，可能为重要数据，请谨慎操作.' : '') + '时间：' + row.database_time + '">' + row.database_time + '</span>'
              }},
              { title: '删除结果',align: 'right',template: function (row,index,ev,_that) {
                var _html = ''
                switch(row.db_type){
                  case 0:
                    _html = type !== 'mysql' ? '彻底删除' : (!recycle_bin_db_open ? '彻底删除' :'移至回收站')
                    break;
                  case 1:
                  case 2:
                    _html = '彻底删除'
                    break;
                }
                return '<span style="width: 110px;" class="'+ (_html === '彻底删除' ? 'warning' + (row.db_type > 0 ? ' remote_database' : '') : '') +'">' + _html + '</span>'
              }}
            ],
            success: function () {
              $('#check_layer_content').find('.glyphicon-info-sign').click(function (e) {
                var msg = $(this).parent().prop('title')
                msg = msg.replace('数据库：','<br>数据库：')
                layer.tips(msg, $(this).parent(), { tips: [1, 'red'], time: 3000 })
                $(document).click(function (ev) {
                  layer.closeAll('tips');
                  $(this).unbind('click');
                  ev.stopPropagation();
                  ev.preventDefault();
                });
                e.stopPropagation();
                e.preventDefault();
              });
															// 添加查看表事件
															$('.showDelTable').click(function(){
																var sid = $(this).data('sid'),name = $(this).data('name');
																var btn = $(this)
																bt_tools.send({url:'/database?action=get_database_table',data:{name,sid}},function(ress){
																	//请求回调
																	var arr = []
																	$.each(ress,function(index,item){
																		arr.push(item)
																	})
																	showTablePopover(arr,btn)
																	function showTablePopover(data,el){
																		var popover = $('<div class="list-popover" style="width:250px;height:230px;position:absolute;padding:10px;padding-top:0;z-index: 999999999;background: #fff;"><div id="popover-table"></div></div>')
																		$(document.documentElement).append(popover)
																		popover.css({left:el.offset().left + 50,top:el.offset().top - 100})
																		var delTable = bt_tools.table({
																			el:'#popover-table',
																			default:'暂无数据',
																			height: '200px',
																			data:data,
																			column:[
																					{
																						fid: 'row',
																						title: '表名称',
																						type: 'text',
																						template: function (row) {
																							return '<span title="' + row + '">' + row + '</span>';
																						}
																					},
																			]
																	})
																	popover.click(function(ev){
																		ev.stopPropagation();
																	})
																	$(document).one('click',function(){
																		$('.list-popover').remove()
																	})
																	}
															},'获取数据库表')
															})
              if($('.remote_database').length) {
                $('.remote_database').each(function (index, el) {
                  var id = $(el).parent().parent().parent().index()
                  $('#check_layer_content tbody tr').eq(id).css('background-color','#ff00000a')
                })
              }
            }
          })
          var is_once = false
          $('#check_layer_content .divtable').scroll(function () {
            var top = $(this).scrollTop()
            if(top + 302 >= $(this)[0].scrollHeight){
              is_once = true
              $(layers).removeClass('on');
            }
          })
          var interVal = setInterval(function () {
            countDown--;
            // $(layers).find('.layui-layer-btn0').text('下一步(' + countDown + '秒后继续操作)')
            $(layers).find('.check_layer_message .count_down').text(countDown)
          }, 1000);
          setTimeout(function () {
            $(layers).find('.layui-layer-btn0').text('下一步');
            $(layers).find('.check_layer_message .message_count').html('<span style="color:red">请仔细阅读以上要删除信息，防止数据库被误删</span>')
            if($('#check_layer_content table').height() > 300){
              if(is_once == false) $(layers).addClass('on');
            }
            $(layers).removeClass('active');
            clearInterval(interVal)
          }, countDown * 1000)
        },
        yes: function (indes, layers) {
          if ($(layers).hasClass('on')) {
            layer.tips('请确认信息，将列表滚动到底部', $(layers).find('.layui-layer-btn0'), {
              tips: [1, 'red'],
              time: 3000
            })
            return;
          }
          if ($(layers).hasClass('active')) {
            layer.tips('请确认信息，稍候再尝试，还剩' + countDown + '秒', $(layers).find('.layui-layer-btn0'), {
              tips: [1, 'red'],
              time: 3000
            })
            return;
          }
          title = typeof dbname === "function" ? '二次验证信息，批量删除数据库' : '二次验证信息，删除数据库 - [ ' + dbname + ' ]';
          if(type !== 'mysql'){
            tips = '<span class="color-red">当前数据库暂不支持数据库回收站，删除后将无法恢复</span>，此操作不可逆，是否继续操作？';
          }else{
            tips = is_db_type ? '<span class="color-red">远程数据库不支持数据库回收站，删除后将无法恢复</span>，此操作不可逆，是否继续操作？' : recycle_bin_db_open ? '删除后如需彻底删除请前往数据库回收站，是否继续操作？' : '删除后可能会影响业务使用，此操作不可逆，是否继续操作？'
          }
          layer.open({
            type: 1,
            title: title,
            icon: 0,
            skin: 'delete_site_layer',
            area: "530px",
            closeBtn: 2,
            shadeClose: true,
            content: "<div class=\'bt-form webDelete hint_confirm pd30\' id=\'site_delete_form\'>" +
                  "<div class='hint_title'>\
                  <i class=\'hint-confirm-icon\'></i>\
                  <div class=\'hint_con\'>"+tips+"</div>\
                </div>"+
                "<div style=\'color:red;margin:18px 0 18px 18px;font-size:14px;font-weight: bold;\'>注意：数据无价，请谨慎操作！！！" + (type === 'mysql' && !recycle_bin_db_open ? '<br>风险操作：当前数据库回收站未开启，删除数据库将永久消失！' : '') + "</div>\
                  <div class='confirm-info-box'>\
                    <div>请手动输入“<span class='color-red'>删除数据库</span>”，完成验证</div>\
                    <input onpaste='return false;' id='prompt_input_box' type='text' value='' autocomplete='off' style='width: 440px;'>\
                  </div>"+
                "</div>",
            btn: ['确认删除', '取消删除'],
            yes: function (indexs) {
              var data = {
                    id: wid,
                    name: dbname
                  };
              var result = bt.replace_all($("#prompt_input_box").val(), ' ', '')
              if (result == '删除数据库') {
                if (typeof dbname === "function") {
                  delete data.id;
                  delete data.name;
                }
                layer.close(indexs)
                layer.close(indes)
                if (typeof dbname === "function") {
                  dbname(data)
                } else {
                  data.id = data.id[0]
                  bt.database.del_database(data, function (rdata) {
                    layer.closeAll()
                    if (callback) callback(rdata);
                    bt.msg(rdata);
                  })
                }
              }else{
                $("#prompt_input_box").focus()
                return layer.msg('验证失败，请重新输入', {icon: 2});
              }
            }
          })
        }
      })
    })
  },
}

var sql_server ={
  database_table_view :function(search){
    var param = {
      table: 'databases',
      search: search || ''
    }
    $('#bt_sqldatabase_table').empty();
    database_table = bt_tools.table({
      el: '#bt_sqldatabase_table',
      url: 'database/sqlserver/get_list',
      param: param, //参数
      minWidth: '1000px',
      load: true,
      autoHeight: true,
      default: "数据库列表为空", // 数据为空时的默认提示
      pageName: 'database',
      beforeRequest:function(beforeData){
        var db_type_val = $('.sqlserver_type_select_filter').val()
        switch(db_type_val){
          case 'all':
            delete param['db_type']
            delete param['sid']
            break;
          case 0:
            param['db_type'] = 0;
            break;
          default:
            delete param['db_type'];
            param['sid'] = db_type_val
        }
        if (beforeData.hasOwnProperty('data') && typeof beforeData.data === 'string') {
          delete beforeData['data']
          return { data: JSON.stringify($.extend(param,beforeData)) }
        }
        return {data:JSON.stringify(param)}
      },
      column:[
        {type: 'checkbox',width: 20},
        {fid: 'name',title: '数据库名',type:'text'},
        {fid: 'username',title: '用户名',type:'text',sort:true},
        {fid:'password',title:'密码',type:'password',copy:true,eye_open:true},
        {
          title:'数据库位置',
          type: 'text',
          width: 116,
          template: function (row) {
            var type_column = '-'
            switch(row.db_type){
              case 0:
                type_column = '本地数据库'
                break;
              case 1:
                type_column = ('远程库('+row.conn_config.db_host+':'+row.conn_config.db_port+')').toString()
                break;
              case 2:
                $.each(cloudDatabaseList,function(index,item){
                  if(row.sid == item.id){
                    if(item.ps !== ''){ // 默认显示备注
                      type_column = item.ps
                    }else{
                      type_column = ('远程服务器('+item.db_host+':'+item.db_port+')').toString()
                    }
                  }
                })
                break;
            }
            return '<span class="flex" style="width:100px" title="'+type_column+'"><span class="size_ellipsis" style="width: 0; flex: 1;">'+type_column+'</span></span>'
          }
        },
        {
          fid: 'ps',
          title: '备注',
          type: 'input',
          blur: function (row, index, ev) {
            bt.pub.set_data_ps({
              id: row.id,
              table: 'databases',
              ps: ev.target.value
            }, function (res) {
              layer.msg(res.msg, (res.status ? {} : {
                icon: 2
              }));
            });
          },
          keyup: function (row, index, ev) {
            if (ev.keyCode === 13) {
              $(this).blur();
            }
          }
        },
        {
          type: 'group',
          title: '操作',
          width: 220,
          align: 'right',
          group: [{
            title: '改密',
            tips: '修改数据库密码',
            hide:function(rows){return rows.db_type == 1},
            event: function (row) {
              database.set_data_pass(row.id, row.username, row.password);
            }
          }, {
            title: '删除',
            tips: '删除数据库',
            event: function (row) {
              var list = [];
              list.push(row)
              database.del_database(list, row.name,row, function (res) {
                if (res.status) database_table.$refresh_table_list(true);
                layer.msg(res.msg, {
                  icon: res.status ? 1 : 2
                })
              });
            }
          }]
        }
      ],
      sortParam: function (data) {
        return {
          'order': data.name + ' ' + data.sort
        };
      },
      tootls: [{ // 按钮组
        type: 'group',
        positon: ['left', 'top'],
        list: [{
          title: '添加数据库',
          active: true,
          event: function () {
            var cloudList = []
            $.each(cloudDatabaseList,function(index,item){
              var _tips = item.ps != ''?(item.ps+' ('+item.db_host+')'):item.db_host
							cloudList.push({title:_tips,value:item.id,name:item.db_host})
            })
            bt.database.add_database(cloudList,function (res) {
              if (res.status) database_table.$refresh_table_list(true);
            })
          }
        },{
          title:'远程服务器',
          event:function(){
            db_public_fn.get_cloud_server_list();
          }
        },{
          title: '同步所有',
          style:{'margin-left':'30px'},
          event: function () {
            database.sync_to_database({type:0,data:[]},function(res){
              if(res.status) database_table.$refresh_table_list(true);
            })
          }
        },{
          title: '从服务器获取',
          event: function () {
            var _list = [];
            $.each(cloudDatabaseList,function (index,item){
              var _tips = item.ps != ''?(item.ps+' (服务器地址:'+item.db_host+')'):item.db_host
              _list.push({title:_tips,value:item.id})
            })
            bt_tools.open({
              title:'选择数据库位置',
              area:'450px',
              btn: ['确认','取消'],
              skin: 'databaseCloudServer',
              content: {
                'class':'pd20',
                form:[{
                  label:'数据库位置',
                  group:{
                    type:'select',
                    name:'sid',
                    width:'260px',
                    list:_list
                  }
                }]
              },
              success:function(layers){
                $(layers).find('.layui-layer-content').css('overflow','inherit')
              },
              yes:function (form,layers,index){
                bt.database.sync_database(form.sid,function (rdata) {
                  if (rdata.status){
                    database_table.$refresh_table_list(true);
                    layer.close(layers)
                  }
                })
              }
            })
          }
        }]
      },{
        type: 'batch', //batch_btn
        positon: ['left', 'bottom'],
        placeholder: '请选择批量操作',
        buttonValue: '批量操作',
        disabledSelectValue: '请选择需要批量操作的数据库!',
        selectList: [{
          title:'同步选中',
          url:'/database/'+bt.data.db_tab_name+'/SyncToDatabases',
          load: true,
          paramName: 'data', //列表参数名,可以为空
          th:'数据库名称',
          beforeRequest: function(list) {
            var arry = [];
            $.each(list, function (index, item) {
              arry.push(item.id);
            });
            return JSON.stringify({ids:JSON.stringify(arry),type:1})
          },
          success: function (res, list, that) {
            layer.closeAll();
            var html = '';
            $.each(list, function (index, item) {
              html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (res.msg.indexOf("失败")==-1 ? '#20a53a' : 'red') + '">' + res.msg + '</span></div></td></tr>';
            });
            that.$batch_success_table({
              title: '批量同步选中',
              th: '数据库名称',
              html: html
            });
          }
        },{
          title: "删除数据库",
          url: '/database/'+bt.data.db_tab_name+'/DeleteDatabase',
          load: true,
          param: function (row) {
            return {data:JSON.stringify({
                id: row.id,
                name: row.name
              })}
          },
          callback: function (that) { // 手动执行,data参数包含所有选中的站点
            var ids = [];
            for (var i = 0; i < that.check_list.length; i++) {
              ids.push(that.check_list[i].id);
            }
            database.del_database(that.check_list,function(param){
              that.start_batch(param, function (list) {
                layer.closeAll()
                var html = '';
                for (var i = 0; i < list.length; i++) {
                  var item = list[i];
                  html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + item.request.msg + '</span></div></td></tr>';
                }
                database_table.$batch_success_table({
                  title: '批量删除',
                  th: '数据库名称',
                  html: html
                });
                database_table.$refresh_table_list(true);
              });
            })
          }
        }]
      }, {
        type: 'search',
        positon: ['right', 'top'],
        placeholder: '请输入数据库名称/备注',
        searchParam: 'search', //搜索请求字段，默认为 search
        value: '',// 当前内容,默认为空
      }, { //分页显示
        type: 'page',
        positon: ['right', 'bottom'], // 默认在右下角
        pageParam: 'p', //分页请求字段,默认为 : p
        page: 1, //当前分页 默认：1
        numberParam: 'limit', //分页数量请求字段默认为 : limit
        number: 20, //分页数量默认 : 20条
        numberList: [10, 20, 50, 100, 200], // 分页显示数量列表
        numberStatus: true, //　是否支持分页数量选择,默认禁用
        jump: true, //是否支持跳转分页,默认禁用
      }],
      success:function(config){
        //搜索前面新增数据库位置下拉
        if($('.sqlserver_type_select_filter').length == 0){
          var _option = '<option value="all">全部</option>'
          $.each(cloudDatabaseList,function(index,item){
            var _tips = item.ps != ''?item.ps:item.db_host
            _option +='<option value="'+item.id+'">'+_tips+'</option>'
          })
          $('#bt_sqldatabase_table .bt_search').before('<select class="bt-input-text mr5 sqlserver_type_select_filter" style="width:110px" name="db_type_filter">'+_option+'</select>')

          //事件
          $('.sqlserver_type_select_filter').change(function(){
            // database_table.$refresh_table_list(true,function(data){
            //   if(parseInt($('#bt_sqldatabase_table .page .Pcurrent').text()) !== 1) $('.Pstart').click()
            // });
						database_table.config.page.page = 1;
            database_table.$refresh_table_list(true);
						bt.database.append_select_status(this,'sqlserver')
          })
        }
      }
    });
  }
}

var mongodb = {
  database_table_view :function(search){
    var param = {
      table: 'databases',
      search: search || ''
    }
    $('#bt_mongodb_table').empty();
    database_table = bt_tools.table({
      el: '#bt_mongodb_table',
      url: 'database/mongodb/get_list',
      param: param, //参数
      minWidth: '1000px',
      load: true,
      autoHeight: true,
      default: "数据库列表为空", // 数据为空时的默认提示
      pageName: 'database',
      beforeRequest:function(beforeData){
        var db_type_val = $('.mongodb_type_select_filter').val()
        switch(db_type_val){
          case 'all':
            delete param['db_type']
            delete param['sid']
            break;
          case 0:
            param['db_type'] = 0;
            break;
          default:
            delete param['db_type'];
            param['sid'] = db_type_val
        }
        if (beforeData.hasOwnProperty('data') && typeof beforeData.data === 'string') {
          delete beforeData['data']
          return { data: JSON.stringify($.extend(param,beforeData)) }
        }
        return {data:JSON.stringify(param)}
      },
      column:[
        {type: 'checkbox',width: 20},
        {fid: 'name',title: '数据库名',type:'text'},
        {fid: 'username',title: '用户名',type:'text',sort:true},
        {fid:'password',title:'密码',type:'password',copy:true,eye_open:true},
        {
          fid:'backup',
          title: '备份',
          width: 130,
          template: function (row) {
            var backup = '点击备份',
                _class = "bt_warning";
            if (row.backup_count > 0) backup = lan.database.backup_ok, _class = "bt_success";
						return '<span><a href="javascript:;" class="btlink ' + _class + '" onclick="database.database_detail('+row.id+',\''+row.name+'\',\'mongodb\')">' + backup + (row.backup_count > 0 ? ('(' + row.backup_count + ')') : '') + '</a> | <a href="javascript:database.input_database(\''+row.name+'\',\'mongodb\')" class="btlink">'+lan.database.input+'</a></span>'
          }
        },
        {
          title:'数据库位置',
          type: 'text',
          width: 116,
          template: function (row) {
            var type_column = '-'
            switch(row.db_type){
              case 0:
                type_column = '本地数据库'
                break;
              case 1:
                type_column = ('远程库('+row.conn_config.db_host+':'+row.conn_config.db_port+')').toString()
                break;
              case 2:
                $.each(cloudDatabaseList,function(index,item){
                  if(row.sid == item.id){
                    if(item.ps !== ''){ // 默认显示备注
                      type_column = item.ps
                    }else{
                      type_column = ('远程服务器('+item.db_host+':'+item.db_port+')').toString()
                    }
                  }
                })
                break;
            }
            return '<span class="flex" style="width:100px" title="'+type_column+'"><span class="size_ellipsis" style="width: 0; flex: 1;">'+type_column+'</span></span>'
          }
        },
        {
          fid: 'ps',
          title: '备注',
          type: 'input',
          blur: function (row, index, ev) {
            bt.pub.set_data_ps({
              id: row.id,
              table: 'databases',
              ps: ev.target.value
            }, function (res) {
              layer.msg(res.msg, (res.status ? {} : {
                icon: 2
              }));
            });
          },
          keyup: function (row, index, ev) {
            if (ev.keyCode === 13) {
              $(this).blur();
            }
          }
        },
        {
          type: 'group',
          title: '操作',
          width: 220,
          align: 'right',
          group: [{
						title: '权限',
            tips: '设置数据库权限',
            hide:function(rows){return rows.db_type == 1}, //远程数据库
            event: function (row) {
              bt.database.set_mongo_data_access(row.username);
            }
          }, {
            title: '工具',
            tips: 'mongodb工具',
            event: function (row) {
              mongodb.mongo_tools(row.name);
            }
          },{
            title: '改密',
            tips: '修改数据库密码',
            hide:function(rows){return rows.db_type == 1},
            event: function (row) {
              database.set_data_pass(row.id, row.username, row.password);
            }
          }, {
            title: '删除',
            tips: '删除数据库',
            event: function (row) {
              var list = [];
              list.push(row)
              database.del_database(list, row.name,row, function (res) {
                if (res.status) database_table.$refresh_table_list(true);
                layer.msg(res.msg, {
                  icon: res.status ? 1 : 2
                })
              });
            }
          }]
        }
      ],
      sortParam: function (data) {
        return {
          'order': data.name + ' ' + data.sort
        };
      },
      tootls: [{ // 按钮组
        type: 'group',
        positon: ['left', 'top'],
        list: [{
          title: '添加数据库',
          active: true,
          event: function () {
            var cloudList = []
            $.each(cloudDatabaseList,function(index,item){
              var _tips = item.ps != ''?(item.ps+' ('+item.db_host+')'):item.db_host
							cloudList.push({title:_tips,value:item.id,name:item.db_host})
            })
            bt.database.add_database(cloudList,function (res) {
              if (res.status) database_table.$refresh_table_list(true);
            })
          }
        },{
          title: 'root密码',
          event: function () {
            if(mongoDBAccessStatus){
              bt.database.set_root('mongo')
            }else{
              layer.msg('请先开启安全认证',{icon:0})
            }
          }
        },{
          title: '安全认证',
          event: function () {
            layer.open({
              title:'安全认证开关',
              area:'250px',
              btn:false,
              content:'<div class="bt-form">\
								<div class="line">\
									<span class="tname">安全认证</span>\
									<div class="info-r">\
										<div class="inlineBlock mr50" style="margin-top: 5px;vertical-align: -6px;">\
											<input class="btswitch btswitch-ios" id="mongodb_access" type="checkbox" name="monitor">\
											<label class="btswitch-btn" for="mongodb_access" style="margin-bottom: 0;"></label>\
										</div>\
									</div>\
								</div>\
								<div class="line">\
									<div class="">\
									<div class="inlineBlock  ">\
									<ul class="help-info-text c7" style="margin-top:0;">\
										<li>安全认证：开启后访问数据需要使用帐号和密码</li>\
									</ul>\
								</div></div></div>\
							</div>',
              success:function(){
                $('#mongodb_access').attr('checked',mongoDBAccessStatus)

                $('#mongodb_access').click(function(){
                  var _status = $(this).prop('checked')
                  bt_tools.send({url:'database/'+bt.data.db_tab_name+'/set_auth_status',data:{data:JSON.stringify({status:_status?1:0})},verify: true},function(rdata){
                    if(rdata.status){
                      mongoDBAccessStatus = _status
                      layer.msg(rdata.msg,{icon:1})
                    }
                  },'设置密码访问状态')
                })
              }
            })
          }
        },{
          title:'远程服务器',
          event:function(){
            db_public_fn.get_cloud_server_list();
          }
        },{
          title: '同步所有',
          style:{'margin-left':'30px'},
          event: function () {
            database.sync_to_database({type:0,data:[]},function(res){
              if(res.status) database_table.$refresh_table_list(true);
            })
          }
        },{
          title: '从服务器获取',
          event: function () {
            var _list = [];
            $.each(cloudDatabaseList,function (index,item){
              var _tips = item.ps != ''?(item.ps+' (服务器地址:'+item.db_host+')'):item.db_host
              _list.push({title:_tips,value:item.id})
            })
            bt_tools.open({
              title:'选择数据库位置',
              area:'450px',
              btn: ['确认','取消'],
              skin: 'databaseCloudServer',
              content: {
                'class':'pd20',
                form:[{
                  label:'数据库位置',
                  group:{
                    type:'select',
                    name:'sid',
                    width:'260px',
                    list:_list
                  }
                }]
              },
              success:function(layers){
                $(layers).find('.layui-layer-content').css('overflow','inherit')
              },
              yes:function (form,layers,index){
                bt.database.sync_database(form.sid,function (rdata) {
                  if (rdata.status){
                    database_table.$refresh_table_list(true);
                    layer.close(layers)
                  }
                })
              }
            })
          }
        }]
      },{
        type: 'batch', //batch_btn
        positon: ['left', 'bottom'],
        placeholder: '请选择批量操作',
        buttonValue: '批量操作',
        disabledSelectValue: '请选择需要批量操作的数据库!',
        selectList: [
					{
						title: '同步数据库',
						url:'/database/'+bt.data.db_tab_name+'/SyncToDatabases',
						param: function (row) {
							var arry = [];
							arry.push(row.id);
							var params = {
							    ids: JSON.stringify(arry),
							    type:1
							}
							return {data:JSON.stringify(params)};
						},
						callback: function (that) {
							// 手动执行,data参数包含所有选中的站点
							bt.simple_confirm({ title: '批量同步数据库', msg: '批量同步选中的数据库，同步过程中可能存在风险，请在闲置时间段同步数据库，是否继续操作？' }, function () {
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
											item.request.msg +
											'</span></div></td></tr>';
									}
									database_table.$batch_success_table({ title: '批量同步数据库', th: '数据库名', html: html });
									database_table.$refresh_table_list(true);
								});
							});
						},
					},
					{
						title: '备份数据库',
						url: bt.data.db_tab_name == 'mysql' ? 'database?action=ToBackup' : '/database/' + bt.data.db_tab_name + '/ToBackup',
						load: true,
						param: function (row) {
							return bt.data.db_tab_name == 'mysql' ? { id: row.id } : { data: JSON.stringify({ id: row.id }) };
						},
						callback: function (that) {
							// 手动执行,data参数包含所有选中的站点
							that.start_batch({}, function (list) {
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
								database_table.$batch_success_table({ title: '批量备份数据库', th: '数据库名', html: html });
								database_table.$refresh_table_list(true);
							});
						},
					},
					{
						title: '删除数据库',
						url: '/database?action=DeleteDatabase',
						load: true,
						param: function (row) {
							return {
								id: row.id,
								name: row.name,
							};
						},
						callback: function (config) {
							// 手动执行,data参数包含所有选中的站点
							var ids = [];
							for (var i = 0; i < config.check_list.length; i++) {
								ids.push(config.check_list[i].id);
							}
							database.del_database(config.check_list, function (param) {
								config.start_batch(param, function (list) {
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
									database_table.$batch_success_table({
										title: '批量删除',
										th: '数据库名称',
										html: html,
									});
									database_table.$refresh_table_list(true);
								});
							});
						},
					},
				],
      }, {
        type: 'search',
        positon: ['right', 'top'],
        placeholder: '请输入数据库名称/备注',
        searchParam: 'search', //搜索请求字段，默认为 search
        value: '',// 当前内容,默认为空
      }, { //分页显示
        type: 'page',
        positon: ['right', 'bottom'], // 默认在右下角
        pageParam: 'p', //分页请求字段,默认为 : p
        page: 1, //当前分页 默认：1
        numberParam: 'limit', //分页数量请求字段默认为 : limit
        number: 20, //分页数量默认 : 20条
        numberList: [10, 20, 50, 100, 200], // 分页显示数量列表
        numberStatus: true, //　是否支持分页数量选择,默认禁用
        jump: true, //是否支持跳转分页,默认禁用
      }],
      success:function(config){
        //搜索前面新增数据库位置下拉
        if($('.mongodb_type_select_filter').length == 0){
          var _option = '<option value="all">全部</option>'
          $.each(cloudDatabaseList,function(index,item){
            var _tips = item.ps != ''?item.ps:item.db_host
            _option +='<option value="'+item.id+'">'+_tips+'</option>'
          })
          $('#bt_mongodb_table .bt_search').before('<select class="bt-input-text mr5 mongodb_type_select_filter" style="width:110px" name="db_type_filter">'+_option+'</select>')

          //事件
          $('.mongodb_type_select_filter').change(function(){
						database_table.config.page.page = 1;
            database_table.$refresh_table_list(true);
						bt.database.append_select_status(this,'mongodb')
            // database_table.$refresh_table_list(true,function(data){
            //   if(parseInt($('#bt_mongodb_table .page .Pcurrent').text()) !== 1) $('.Pstart').click()
            // });
          })
        }
      }
    });
  },
		// mongodb工具
		mongo_tools: function (db_name, res) {
			var loadT = layer.msg('正在获取数据,请稍候...', {
				icon: 16,
				time: 0
			});
			bt_tools.send({ url: 'database/mongodb/GetInfo', data: { data: JSON.stringify({ db_name: db_name }) } }, function (rdata) {
				layer.close(loadT)
				if (rdata.status === false) {
					layer.msg(rdata.msg, {
						icon: 2
					});
					return;
				}
				// var types = {
				//   InnoDB: "MyISAM",
				//   MyISAM: "InnoDB"
				// };
				var tbody = '',
				tableList=rdata.data.collection_list;
				for (var i = 0; i < tableList.length; i++) {
					// if (!types[rdata.tables[i].type]) continue;
					tbody += '<tr>\
													<td><span style="width:150px;"  title="' + tableList[i].collection_name + '"> ' + tableList[i].collection_name + '</span></td>\
													<td><span style="width:90px;"> ' + tableList[i].count + '</span></td>\
													<td><span style="width:90px;"> ' + db_public_fn.compute_data_unit(tableList[i].size) + '</span></td>\
													<td><span style="width:90px;"> ' + db_public_fn.compute_data_unit(tableList[i].avg_obj_size) + '</span></td>\
													<td>' + db_public_fn.compute_data_unit(tableList[i].storage_size) + '</td>\
													<td>' + tableList[i].nindexes + '</td>\
													<td>' +  db_public_fn.compute_data_unit(tableList[i].total_index_size) + '</td>\
											</tr> '
				}

				// if (res) {
				//   $(".gztr").html(tbody);
				//   $("#db_tools").html('');
				//   $("input[type='checkbox']").attr("checked", false);
				//   $(".tools_size").html('大小：' + rdata.data.storageSize);
				//   return;
				// }

				layer.open({
					type: 1,
					title: "MongoDB工具箱【" + db_name + "】",
					area: ['780px', '480px'],
					closeBtn: 2,
					shadeClose: false,
					content: '<div class="pd15">\
																	<div class="db_list">\
																			<span><a>数据库名称：' + db_name + '</a>\
																			<a class="tools_size">集合数量：' + rdata.data.collections + '</a>\
																			<a class="tools_size">存储大小：' + db_public_fn.compute_data_unit(rdata.data.storageSize) + '</a>\
																			<a class="tools_size">索引大小：' + db_public_fn.compute_data_unit(rdata.data.indexSize) + '</a></span>\
																	</div >\
																	<div class="divtable">\
																	<div  id="database_fix"  style="height:360px;overflow:auto;border:#ddd 1px solid">\
																	<table class="table table-hover "style="border:none">\
																			<thead>\
																					<tr>\
																							<th>集合名称</th>\
																							<th>文档数量</th>\
																							<th>内存中的大小</th>\
																							<th>对象平均大小</th>\
																							<th>存储大小</th>\
																							<th>索引数量</th>\
																							<th>索引大小</th>\
																					</tr>\
																			</thead>\
																			<tbody class="gztr">' + tbody + '</tbody>\
																	</table>\
																	</div>\
															</div>\
										</div>',
															success:function(){
																$(':focus').blur();
															}
				});
				tableFixed('database_fix');
				//表格头固定
				function tableFixed (name) {
					var tableName = document.querySelector('#' + name);
					tableName.addEventListener('scroll', scrollHandle);
				}

				function scrollHandle (e) {
					var scrollTop = this.scrollTop;
					//this.querySelector('thead').style.transform = 'translateY(' + scrollTop + 'px)';
					$(this).find("thead").css({
						"transform": "translateY(" + scrollTop + "px)",
						"position": "relative",
						"z-index": "1"
					});
				}
			});
		},
}
var redis = {
  redisDBList:[],
  cloudInfo:{
    sid:0,
    title:'本地服务器'
  },  //当前远程信息
	clusterModeConfig:{}, //集群模式配置
  database_table_view:function(){
    var that = this;
    this.cloudInfo.sid = cloudDatabaseList.length == 0 ? 0 : cloudDatabaseList[0].id
    this.cloudInfo.title = cloudDatabaseList.length == 0 ? '本地数据库' : cloudDatabaseList[0].ps
    $('#bt_redis_view').empty()

    $('#bt_redis_view').html('<div class="pull-right redis_cloud_server"></div>')

    // 远程服务器列表
    var _option = ''
    $.each(cloudDatabaseList,function(index,item){
      var _tips = item.ps != ''?item.ps:item.db_host
      _option +='<option value="'+item.id+'">'+_tips+'</option>'
    })
    $('#bt_redis_view .redis_cloud_server').html('<span class="mr5" style="color:#f0ad4e"><span class="glyphicon glyphicon-info-sign"></span>当前所有操作项都关联至</span><select class="bt-input-text mr5 redis_type_select_filter" style="width:110px" name="db_type_filter">'+_option+'</select>')
		$('.pull-right').css({'display':'flex','align-items':'center'})
		$('.redis_type_select_filter').after('<div class="db_status_row">\
		<span class="db_status_icon status_icon status_success"></span>\
		状态：\
		<span class="db_status_text">正常</span>\
		</div>')
    //远程服务器列表点击事件
    $('.redis_type_select_filter').change(function(){
      that.cloudInfo.sid = $(this).val();
      that.cloudInfo.title = $(this).find('option:selected').text();
      that.render_redis_content()
      if(parseInt($('#bt_redis_view .page .Pcurrent').text()) !== 1) $('.Pstart').click()
			$('.pull-right').css({'display':'flex','align-items':'center'})
			bt.database.check_single_other_status($(this).find('option:selected').attr('value'),false,$(this).find('option:selected').text(),'redis')
    })


    // 渲染redis列表
    this.render_redis_content()
  },
  render_redis_content:function(id){
    $('.redis_content_view').remove()
    var that = this;
    $('#bt_redis_view').append('<div class="redis_content_view">\
		<button type="button" title="添加Key" class="btn btn-success btn-sm mr5 addRedisDB" style="margin-bottom:10px"><span>添加Key</span></button>\
		<button type="button" title="远程服务器" class="btn btn-default btn-sm mr5 RedisCloudDB" style="margin-bottom:10px"><span>远程服务器</span></button>\
		<button type="button" title="备份列表" class="btn btn-default btn-sm mr5 backupRedis" style="margin-bottom:10px;display:'+(this.cloudInfo.sid == 0?'inline-block':'none')+'"><span>备份列表</span></button>\
		<button type="button" title="集群管理" class="btn btn-default btn-sm mr5 cluster_manage" style="margin:0 5px 10px 30px">集群管理</button>\
		<button type="button" title="清空数据库" class="btn btn-default btn-sm emptyRedisDB"><span>清空数据库</span></button>\
		<div id="redis_content_tab"><div class="tab-nav"></div><div class="tab-con redis_table_content" style="padding:10px 0"></div></div></div>')

        bt.newDotTips([{el: '#bt_redis_view .redis_content_view button:eq(3)',name: 'redisManag',style: 'top: -2px;margin-left: 6px;'}])

		$('.addRedisDB').click(function () {
			that.set_redis_library();
		});
		$('.backupRedis').click(function () {
			that.backup_redis_list();
		});
		$('.emptyRedisDB').click(function () {
			that.choose_redis_list();
		});
		$('.RedisCloudDB').click(function () {
			db_public_fn.get_cloud_server_list();
		});
		$('.cluster_manage').click(function () {
			that.cluster_manage_viwe();
		});

		var tabHTML = ''
    bt_tools.send({url:'database/redis/get_list',data:{data:JSON.stringify({sid:that.cloudInfo.sid})}},function(rdata){
      if(typeof rdata.msg !== 'undefined' && !rdata.status){
        layer.msg(rdata.msg, {
          icon: 2,
          time: 0,
          closeBtn: 2
        });
        return false;
      }

      that.redisDBList = rdata;
      $.each(rdata,function(index,item){
        tabHTML +='<span data-id="'+item.id+'">'+item.name+'('+item.keynum+')</span>'
      })
      $('#redis_content_tab .tab-nav').html(tabHTML)


      setTimeout(function(){
        if(id){
					$('#redis_content_tab .tab-nav span').eq(id).click()
          // $('#redis_content_tab .tab-nav span:contains(DB'+id+')').click()
        }else{
          if(rdata.length == 0){
            $('#redis_content_tab .tab-nav').remove()
            that.render_redis_table(0)
          }else{
            $('#redis_content_tab .tab-nav span:eq(0)').click()
          }
        }
      },50)

      // redis数据库点击事件
      $('#redis_content_tab .tab-nav span').click(function(){
        var _id = $(this).data('id');
        $(this).addClass('on').siblings().removeClass('on')
        that.render_redis_table(_id)
      })
    },{verify:false})
  },
  render_redis_table:function(id){
    var that = this;
    $('.redis_table_content').empty();
    database_table = bt_tools.table({
      el: '.redis_table_content',
      url: 'database/redis/get_db_keylist',
      param: {db_idx:id}, //参数
      minWidth: '1000px',
			dataVerify: false,
      autoHeight: true,
      load: true,
      default: "数据库列表为空", // 数据为空时的默认提示
      pageName: 'redis_' + id,
      beforeRequest:function(beforeData){
        var db_type_val = that.cloudInfo.sid,param = {}
        switch(db_type_val){
          case 0:
            param['db_type'] = 0;
            break;
          default:
            delete param['db_type'];
            param['sid'] = db_type_val
        }
        if (beforeData.hasOwnProperty('data') && typeof beforeData.data === 'string') {
          delete beforeData['data']
          return { data: JSON.stringify($.extend(param,{db_idx:id},beforeData)) }
        }
        return {data:JSON.stringify($.extend(param,{db_idx:id,limit:beforeData.limit}))}
      },
      column:[
        {type: 'checkbox',width: 20},
        {fid: 'name',title: '键',type:'text'},
        {fid: 'val',title: '值',type:'text',template:function(row){
            var _val = $('<div></div>').text(row.val)
            return '<div class="flex" style="width:350px" title="'+_val.text().replace(/\"/g, '\&quot;')+'"><span class="size_ellipsis">'+_val.text()+'</span><span class="ico-copy cursor btcopy ml5" title="复制值"></span></div>'
          },event:function(row,index,ev,key){
            if($(ev.target).hasClass('btcopy')){
              bt.pub.copy_pass(row.val.replaceAll("&quot;", "\""));
            }
          }},
        {fid:'type',title:'数据类型',type:'text'},
        {fid:'len',title:'数据长度',type:'text'},
        {fid:'endtime',title:'有效期',type:'text',template: function (row) {
            return that.reset_time_format(row.endtime)
          }},
        {
          type: 'group',
          title: '操作',
          width: 220,
          align: 'right',
          group: [{
            title: '编辑',
            tips: '编辑数据',
            hide: function(rows){
              return (rows.type == 'string' || rows.type == 'int')?false:true
            },
            event: function (row) {
              row.db_idx = id;
              that.set_redis_library(row)
            }
          },{
            title: '删除',
            tips: '删除数据',
            event: function (row) {
              layer.confirm('是否删除【'+row.name+'】', {
                title: '删除key值', closeBtn: 2, icon: 0
              }, function (index) {
                bt_tools.send({url:'database/redis/del_redis_val',data:{data:JSON.stringify({db_idx:id,key:row.name,sid:that.cloudInfo.sid})}},function(rdata){
                  if(rdata.status){
                    that.render_redis_table(id);
                    that.change_tabs_num();
                  }
                  bt_tools.msg(rdata)
                  layer.close(index)
                })
              });
            }
          }]
        }
      ],
      tootls: [{
        type: 'search',
        positon: ['right', 'top'],
        placeholder: '请输入键名称',
        searchParam: 'search', //搜索请求字段，默认为 search
        value: '',// 当前内容,默认为空
      }, {
        type: 'batch',
        positon: ['left', 'bottom'],
        config: {
          title: '删除',
          url: 'database/redis/del_redis_val',
          param: function (row) {
            return { data:JSON.stringify({db_idx:id,key:row.name,sid:that.cloudInfo.sid}) }
          },
          load: true,
          callback: function (that) {
            bt.confirm({ title: '批量删除key值', msg: '是否批量删除选中的key值，是否继续？', icon: 0 }, function (index) {
              layer.close(index);
              that.start_batch({}, function (list) {
                var html = '';
                for (var i = 0; i < list.length; i++) {
                  var item = list[i];
                  html += '<tr><td><span class="text-overflow" title="' + item.name + '">' + item.name + '</span></td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + item.request.msg + '</span></div></td></tr>';
                }
                database_table.$batch_success_table({ title: '批量删除key值', th: '键', html: html });
                database_table.$refresh_table_list(true);
              });
            });
          }
        }
      }, { //分页显示
        type: 'page',
        positon: ['right', 'bottom'], // 默认在右下角
        pageParam: 'p', //分页请求字段,默认为 : p
        page: 1, //当前分页 默认：1
        numberParam: 'limit', //分页数量请求字段默认为 : limit
        number: 20, //分页数量默认 : 20条
        numberList: [10, 20, 50, 100, 200], // 分页显示数量列表
        numberStatus: true, //　是否支持分页数量选择,默认禁用
        jump: true, //是否支持跳转分页,默认禁用
      }],
      success: function () {
        var arry = [],maxWidth = ''
        for (var i = 0; i < $('.size_ellipsis').length; i++) {
          arry.push($('.size_ellipsis').eq(i).width())
        }
        maxWidth = Math.max.apply(null,arry)
        $('.size_ellipsis').width(maxWidth+5)
      }
    });
  },
  // 设置tabs的数量
  change_tabs_num: function () {
    var text = $('#redis_content_tab .tab-nav .on').text();
    var num = text.match(/\((.*?)\)/g);
    num = RegExp.$1;
    if (!isNaN(num)) {
      num--;
      $('#redis_content_tab .tab-nav .on').text(text.replace(/\([0-9]\)/ig, '(' + num + ')'));
    }
  },
  // redis备份列表
  backup_redis_list:function(){
    var that = this,redisBackupTable = null;
    bt_tools.open({
      title:'Redis备份列表',
      area:['927px','633px'],
      btn: false,
      skin: 'redisBackupList',
      content: '<div id="redisBackupTable" class="pd20" style="padding-bottom:40px;"></div>',
      success:function(){
        redisBackupTable = bt_tools.table({
          el:'#redisBackupTable',
          default:'备份列表为空',
          height:478,
          url: 'database/redis/get_backup_list',
          param:{"data":JSON.stringify({"sort":'desc'})},
          column:[{
            fid:'name',
            title:'名称',
            width: 170,
            template: function (item) {
              return '<span class="flex" style="width:154px" title="'+item.name+'"><span class="size_ellipsis" style="width: 0; flex: 1;">'+item.name+'</span></span>'
            }},
            {
              fid:'filepath',
              title:'路径',
              template: function (item) {
                return '<span class="flex" style="width:280px" title="'+item.filepath+'"><span class="size_ellipsis" style="width: 0; flex: 1;">'+item.filepath+'</span></span>'
              }},
            {fid:'mtime',width:137,title:'备份时间',template:function(row){
                return '<span>'+bt.format_data(row.mtime)+'</span>'
              }},
            {fid:'size',title:'大小',template:function(row){
                return '<span>'+bt.format_size(row.size)+'</span>'
              }},
            {fid:'sid',width:78,title:'备份位置',template:function(row){
                var type_column = '-'
                switch(row.sid){
                  case "0":
                    type_column = '本地数据库'
                    break;
                  case "1":
                    type_column = ('远程库('+row.conn_config.db_host+':'+row.conn_config.db_port+')').toString()
                    break;
                  case "2":
                    $.each(cloudDatabaseList,function(index,item){
                      if(row.sid == item.id){
                        if(item.ps !== ''){ // 默认显示备注
                          type_column = item.ps
                        }else{
                          type_column = ('远程服务器('+item.db_host+':'+item.db_port+')').toString()
                        }
                      }
                    })
                    break;
                }
                return '<span class="flex" style="width:100px" title="'+type_column+'"><span class="size_ellipsis" style="width: 0; flex: 1;">'+type_column+'</span></span>'
              }},
            {
              type: 'group',
              title: '操作',
              align: 'right',
              group: [{
                title:'恢复',
                event:function(row){
                  bt.prompt_confirm('覆盖数据', '即将使用【'+row.name+'】对数据进行覆盖，是否继续?', function () {
                    bt_tools.send({url:'database/redis/InputSql',data:{data:JSON.stringify({file:row.filepath,sid:0})}},function(rdata){
                      if(rdata.status) that.render_redis_content();
                      bt_tools.msg(rdata)
                    },'恢复数据')
                  })
                }
              },{
                title:'删除',
                event:function(row){
                  layer.confirm('是否删除【'+row.name+'】备份', {
                    title: '删除备份', closeBtn: 2, icon: 0
                  }, function (index) {
                    bt_tools.send({url:'database/redis/DelBackup',data:{data:JSON.stringify({file:row.filepath})}},function(rdata){
                      if(rdata.status) redisBackupTable.$refresh_table_list(true);
                      bt_tools.msg(rdata)
                      layer.close(index)
                    },'删除备份')
                  });
                }
              }]
            }
          ],
          tootls:[{
            type:'group',
            positon: ['left','top'],
            list:[{
              title:'立即备份',
              active: true,
              event:function(){
                bt_tools.send({url:'database/redis/ToBackup'},function(rdata){
                  if(rdata.status) redisBackupTable.$refresh_table_list(true);
                  bt_tools.msg(rdata)
                })
              }
            }]
          }]
        })
      }
    })
  },
  // 添加/编辑redis库
  set_redis_library:function(row){
    var that = this,
        redis_form = null,
        cloudList = []
    $.each(cloudDatabaseList,function(index,item){
      var _tips = item.ps != ''?(item.ps+' ('+item.db_host+')'):item.db_host
			cloudList.push({title:_tips,value:item.id,name:item.db_host})
    });
    bt_tools.open({
      title:(row?('编辑['+row.name+']'):'添加')+'Key'+(!row?('至【'+this.cloudInfo.title+'】'):''),
      area: ['400px', '440px'],
      btn:[(row?'保存':'添加'),'取消'],
      content: '<div class="ptb20" id="redis_library_form"></div>',
      success: function (layers) {
        redis_form = bt_tools.form({
          el:'#redis_library_form',
          form: [{
            label:'数据库',
            group:{
              type:'select',
              name:'db_idx',
              width:'260px',
              list:[
                {title:'DB0',value:0},
                {title:'DB1',value:1},
                {title:'DB2',value:2},
                {title:'DB3',value:3},
                {title:'DB4',value:4},
                {title:'DB5',value:5},
                {title:'DB6',value:6},
                {title:'DB7',value:7},
                {title:'DB8',value:8},
                {title:'DB9',value:9},
                {title:'DB10',value:10},
                {title:'DB11',value:11},
                {title:'DB12',value:12},
                {title:'DB13',value:13},
                {title:'DB14',value:14},
                {title:'DB15',value:15}
              ],
              disabled:row?true:false,
            }
          },{
            label:'键',
            group:{
              type:'text',
              name:'name',
              width:'260px',
              placeholder:'请输入键(key)',
              disabled:row?true:false,
            }
          },{
            label:'值',
            group:{
              type:'textarea',
              name:'val',
              width:'260px',
              style: {
                'min-height': '100px',
                'line-height': '22px',
                'padding-top': '5px',
                'resize': 'both'
              },
              placeholder:'请输入值',
            }
          },{
            label:'有效期',
            group:{
              type:'number',
              name:'endtime',
              width:'235px',
              placeholder:'为空则永不过期',
              unit:'秒'
            }
          },{
            group: {
              type: 'help',
              style: { 'margin-left': '30px' },
              list: ['有效期为0表示永久']
            }
          }],
          data:row?row:{db_idx:$('#redis_content_tab .tab-nav span.on').data('id')}
        })
      },
      yes:function(indexs){
        var formValue = redis_form.$get_form_value()
        if(formValue.name == '') return layer.msg('键不能为空')
        if(formValue.val == '') return layer.msg('值不能为空')
        if(formValue.endtime <= 0) delete formValue.endtime
        if(row){
          formValue['db_idx'] = $('#redis_content_tab .tab-nav span.on').data('id')
        }
        formValue['sid'] = that.cloudInfo.sid
        bt_tools.send({url:'database/redis/set_redis_val',data:{data:JSON.stringify(formValue)}},function(res){
          if(res.status){
            layer.close(indexs);
            that.render_redis_content(formValue.db_idx)
          }
          bt_tools.msg(res)
        },(row?'保存':'添加')+'redis数据中')
      }
    })
  },
  //选择需要清空的redis库
  choose_redis_list:function(){
    var that = this;
    layer.open({
      type:1,
      area:'400px',
      title:'清空【'+this.cloudInfo.title+'】数据库',
      shift: 5,
      closeBtn: 2,
      shadeClose: false,
      btn:['确认','取消'],
      content:'<div class="bt-form pd20" id="choose_redis_from">\
					<div class="line"><span class="tname">选择数据库</span>\
						<div class="info-r">\
							<div class="rule_content_list">\
								<div class="rule_checkbox_group" bt-event-click="checkboxMysql" bt-event-type="active_all"><input name="*" type="checkbox" style="display: none;">\
									<div class="bt_checkbox_groups active"></div>\
									<span class="rule_checkbox_title">全部选中</span></div>\
								<ul class="rule_checkbox_list"></ul>\
							</div>\
						</div>\
					</div>\
				</div>',
      success:function(layers,index){
        var rule_site_list = '';
        $.each(that.redisDBList,function(index,item){
          rule_site_list += '<li>'
              +'<div class="rule_checkbox_group" bt-event-click="checkboxMysql" bt-event-type="active">'
              +'<span class="glyphicon glyphicon-menu-right" style="display:none" aria-hidden="true" bt-event-click="checkboxMysql" bt-event-type="fold"></span>'
              +'<input name="'+ item.name +'" type="checkbox" data-id="'+item.id+'" checked=checked style="display: none;">'
              +'<div class="bt_checkbox_groups active"></div>'
              +'<span class="rule_checkbox_title">'+ item.name +'</span>'
              +'</div>'
              +'</li>'
          $('.rule_checkbox_list').html(rule_site_list);
          that.event_bind()
        });
      },
      yes:function(index,layers){
        var redisIDList = [];
        $('#choose_redis_from .rule_checkbox_list input').each(function(index,el){
          if($(this).prop('checked')){
            redisIDList.push($(this).data('id'))
          }
        });
        if(redisIDList.length == 0)return layer.msg('请选择需要删除的数据库',{icon:2})
        layer.confirm('清空后数据将无法恢复,是否继续?', {
          title: '清空数据库', closeBtn: 2, icon: 0
        }, function (index) {
          bt_tools.send({url:'database/redis/clear_flushdb',data:{data:JSON.stringify({ids:JSON.stringify(redisIDList),sid:that.cloudInfo.sid})}},function(rdata){
            if(rdata.status){
              that.render_redis_content();
              layer.closeAll()
            }
            bt_tools.msg(rdata)
          })
        });

      }
    })
  },

	// 集群管理视图
	cluster_manage_viwe: function () {
		var rthat = this;
		bt_tools.open({
			title:'集群管理',
			area:['520px','370px'],
			btn:false,
			content:'<div id="cluster_manage_table" class="pd15"></div>',
			success:function(){
				rthat.get_cluster_list()
			}
		})
		// 集群开关事件绑定
		$('#cluster_manage_table').on('click','.clusterServiceStatus',function(){
			var status = $(this).prev().prop('checked')
			bt_tools.send({url:'database/rediscluster/'+(status?'stop_cluster':'restart_cluster'),data:{}},function(res){
				if(res.status){rthat.get_cluster_list()}
				bt_tools.msg(res);
			},'集群'+(status?'停止':'启动')+'中')
		})
	},
		// 获取集群列表
	get_cluster_list:function(){
		var rthat = this;
		bt_tools.send({url:'database/rediscluster/get_cluster_info',data:{}},function(clist){
			if(typeof clist.msg != 'undefined' && !clist.status){
				layer.closeAll()
				bt_tools.msg(clist);
				return false;
			}
			var newData = [],_column = [],fixedThead= true,num = 0;
			$.each(clist.data.cluster, function (index, item) {
				newData.push($.extend(item, { status: item.status == 'running'?'1':'0' }));
			})
			// 深拷贝容器数据
			rthat.clusterModeConfig = JSON.parse(JSON.stringify(clist));
			_column = rthat.get_cluster_table_config()  //获取集群表格配置
			$('#cluster_manage_table').empty(); // 清空表格
			bt_tools.table({
				el:'#cluster_manage_table',
				data:newData,
				height:240,
				column:_column,
				tootls:[{ // 按钮组
					type: 'group',
					positon: ['left', 'top'],
					list: [{
						title: '集群配置',
						active: true,
						event: function (ev, that) {
							rthat.open_cluster_mode_config()
						}
					}]
				}],
				success:function(){
					if(fixedThead){
						num++;
						if(num >= 2){
							var btnPositionBox = $('#cluster_manage_table').find('.tootls_group.tootls_top .pull-left')
							// 判断模式开关是否已存在
							if(btnPositionBox.find('.cluster_mode_switch').length == 0){
								btnPositionBox.append('<div style="display:inline">当前模式：【<span class="cluster_mode_title">无</span>】</div>')
								$('#cluster_manage_table').find('.tootls_group.tootls_top .pull-right').append('<div class="cluster_mode_switch" style="display: inline-block;margin-left: 20px;">\
								<span>集群开关</span>\
								<div style="display: inline-block;vertical-align: -6px;margin-left:5px;">\
									<input type="checkbox" class="btswitch btswitch-ios" id="clusterServiceStatus">\
									<label class="btswitch-btn clusterServiceStatus" for="clusterServiceStatus"></label>\
								</div></div>')
								rthat.matching_cluster_type(clist.data.config.pattern)
							}
							// 集群开关状态设置
							$('#clusterServiceStatus').prop('checked',clist.data.config.status)
						}
					}
				}
			})
		},{load:'获取集群列表',verify:false})
	},
	// 设置集群表格配置
	get_cluster_table_config:function(){
		var array = [
			{fid:'name',title:'容器名称',type:'text'},
			{fid:'port',title:'端口',type:'text'},
			{fid:'role',title:'角色',type:'text',template:function(row){
					return '<span>'+(row.role?'主':'从')+'库</span>'
				}},
			{fid:'status',title:'状态',config: {
					icon: true,
					list: [
						['1', '运行中', 'bt_success', 'glyphicon-play'],
						['0', '已停止', 'bt_danger', 'glyphicon-pause']
					]
				},
				type: 'status',
				event: function (row, index, ev, key, that) {
					bt_tools.send({ url:'database/rediscluster/set_container',data:{data:JSON.stringify({node_id:row.node_id,status:row.status == '1'?'stop':'start'})}},function(res){
						if(res.status){
							redis.get_cluster_list()
						}
						bt_tools.msg(res);
					},'容器'+(row.status == '1'?'停止':'启动')+'中')
				}
			},
			{
				title: '操作',
				type: 'group',
				width: 44,
				align: 'right',
				group: [{
					title: '删除',
					event: function (row, index, ev, key, that) {
						bt.confirm({
							title: '删除容器【' + row.name + '】',
							msg: '您真的要从列表中删除这个容器吗？'
						}, function () {
							bt_tools.send({url:'database/rediscluster/remove_cluster_node',data:{data:JSON.stringify({node_id:row.node_id})}},function(res){
								if(res.status){
									redis.get_cluster_list()
								}
								bt_tools.msg(res);
							})
						});
					}
				}]
			}
		]
		// 非主从模式
		var _mode = this.clusterModeConfig.data.config.pattern
		if( _mode != 'replicate') array.splice(2,0,{
			fid:'port_2',
			title:(_mode == 'sentinel'?'哨兵端口':'总线端口'),
			type:'text'
		})
		return array
	},
	// 集群模式管理
	open_cluster_mode_config:function(){
		var that = this
		bt_tools.open({
			title:'集群模式配置',
			area:['440px','570px'],
			btn:['保存','取消'],
			skin:'cluster_dialog_box',
			content:{
				class:'pd20',
				form:[
					{
						label:'redis版本',
						group:{
							type:'select',
							name:'redis_version',
							placeholder:'请选择版本',
							width:'260px',
							list:(function(){
								var _version = []
								$.each(that.clusterModeConfig.data.redis_version,function(index,item){
									_version.push({title:item,value:item})
								})
								return _version
							})()
						}
					},
					{
						label:'模式',
						group:{
							type:'select',
							name:'pattern',
							width:'260px',
							list:[
								{title:'主从模式',value:'replicate'},
								{title:'哨兵模式',value:'sentinel'},
								{title:'集群模式',value:'cluster'}
							],
							change: function (formData) {
								switchComposeType(formData.pattern)
							}
						}
					},
					{
						label:'数据库',
						group:[{
							type:'number',
							name:'databases',
							width:'76px',
							'class': 'group',
							value:16,
							unit:'个',
							suffix:'* 需要创建的数据库数量'
						}]
					},
					{
						label:'数据库密码',
						group:{
							type:'text',
							name:'requirepass',
							width:'260px',
							placeholder:'请输入数据库密码'
						}
					},{
						group:{
							type:'other',
							boxcontent:'<div class="compose_list_title">容器列表 【当前为：<span class="compose_mode_title"></span>】<button type="button" class="btn btn-success btn-xs ml15 add_redis_compose" style="vertical-align: initial;"><i class="glyphicon glyphicon-plus"></i> 添加容器</button></div><div class="redis_mode_table" id="redis_mode_table">\
							<div class="divtable" style="height:162px">\
								<table class="table table-hover">\
									<thead><tr><th>端口</th><th>CPU</th><th>内存</th><th>角色</th></tr></thead>\
									<tbody></tbody>\
								</table></div></div>'
						}
					}
				],
				data:that.clusterModeConfig.data.config,
			},
			success:function(layers){
				// 表格渲染
				that.render_cluster_mode_table()
				// 模式提示信息
				switchComposeType(that.clusterModeConfig.data.config.pattern)
				// 表头固定
				if (jQuery.prototype.fixedThead) {
					$('.redis_mode_table .divtable').fixedThead({ resize: false });
				}
				// 事件绑定
				$('.cluster_dialog_box').on('click','.add_redis_compose',function(){
					that.clusterModeConfig.data.cluster.splice(0,0,{port:'',use_cpu:1,use_memory:500,role:0})
					that.render_cluster_mode_table()
				})
			},yes:function(formD,indexs){
				var params = {};
				if(formD.databases < 1) return layer.msg('数据库数量不能小于1', {icon:0});
				if(formD.requirepass == '' || formD.requirepass.length < 5) return layer.msg('数据库密码不能小于5位', {icon:0});
				params['redis_version'] = formD.redis_version;
				params['pattern'] = formD.pattern;
				params['databases'] = Number(formD.databases);
				params['requirepass'] = formD.requirepass;
				params['cluster'] = []

				if(params.pattern == 'cluster'){
					params['replicate'] = 0
				}

				// 容器当前的数量
				var _container_num = $('.redis_mode_table tbody tr').length;
				// 循环容器数量取出formD中的数据
				for(var i = 0; i < _container_num; i++){
					// 判断端口是否为空
					if(formD['cluster_port_'+i] == ''){
						$('input[name="cluster_port_'+i+'"]').focus()
						return layer.msg('端口不能为空', {icon:0});
					}
					// 判断cpu是否为空
					if(formD['cluster_cpu_'+i] == ''){
						$('input[name="cluster_cpu_'+i+'"]').focus()
						return layer.msg('容器CPU数量不能为空', {icon:0});
					}
					// 判断内存是否为空
					if(formD['cluster_memory_'+i] == ''){
						$('input[name="cluster_memory_'+i+'"]').focus()
						return layer.msg('内存不能为空', {icon:0});
					}

					params['cluster'].push({
						port:Number(formD['cluster_port_'+i]),
						use_cpu:Number(formD['cluster_cpu_'+i]),
						use_memory:Number(formD['cluster_memory_'+i]),
						role:Number(formD['cluster_role_'+i])
					})
				}

				// 判断各模式下主库的数量
				var _master_num = 0;
				$.each(params.cluster,function(index,item){
					if(item.role == 1) _master_num++
				})
				// 判断主从模式/哨兵模式下主库的数量不能大于或小于1
				if(params.pattern != 'cluster' && _master_num != 1) return layer.msg('只能设置一个主库', {icon:0});
				// 判断集群模式下主库的数量小于3
				if(params.pattern == 'cluster' && _master_num < 3) return layer.msg('主库数量不能小于3个', {icon:0});

				// 提交数据
				bt_tools.send({url:'database/rediscluster/set_cluster',data:{data:JSON.stringify(params)}},function(res){
					if(res.status){
						layer.close(indexs)
						that.get_cluster_list()
						that.matching_cluster_type(params['pattern'])
					}
					bt_tools.msg(res)
				},'保存配置中')
			}
		})
		// 切换模式类型提醒
		function switchComposeType(type){
			var text = ''
			if(typeof type === 'undefined') {
				type = 'replicate'
			}
			switch(type){
				case 'replicate':
					text = '主从模式,请添加不少于3个容器'
					break;
				case 'sentinel':
					text = '哨兵模式,请添加不少于3个容器'
					break;
				case 'cluster':
					text = '集群模式,请添加不少于3个主库'
					break;
			}
			$('.compose_mode_title').html(text)
		}
	},
	/**
	 * @description 渲染集群模式表格
	 * @return {String} body的数据结构
	 */
	render_cluster_mode_table: function(){
		var arrData = [],_body = '';
		// 存在模式
		if(this.clusterModeConfig.data.config.requirepass != ''){
			arrData = this.clusterModeConfig.data.cluster
		}else{
			// 不存在模式(默认生成三个容器)
			arrData = [
				{port:30001,use_cpu:1,use_memory:500,role:1},
				{port:30002,use_cpu:1,use_memory:500,role:0},
				{port:30003,use_cpu:1,use_memory:500,role:0},
			]
			this.clusterModeConfig.data.cluster = arrData
			this.clusterModeConfig.data.config.requirepass = '0' // 标识符可忽略
		}

		// 渲染表格数据
		$.each(arrData, function (index, item) {
			_body += '<tr>\
				<td><input type="number" name="cluster_port_'+index+'" value="' + item.port + '"></td>\
				<td><input type="number" name="cluster_cpu_'+index+'" value="' + item.use_cpu + '"><span class="unit">个</span></td>\
				<td><input type="number" name="cluster_memory_'+index+'" value="' + item.use_memory
				+ '"><span class="unit">MB</span></td>\
				<td><select name="cluster_role_'+index+'" value="'+item.role+'">\
					<option value="1" '+(item.role?'selected':'')+'>主库</option>\
					<option value="0" '+(!item.role?'selected':'')+'>从库</option>\
				</select></td></tr>';
		})

		// 生成表格
		$('.redis_mode_table tbody').html(_body)
	},
	// redis集群管理
	matching_cluster_type:function(type){
		var text = ''
		switch(type){
			case 'replicate':
				text = '主从模式'
				break;
			case 'sentinel':
				text = '哨兵模式'
				break;
			case 'cluster':
				text = '集群模式'
				break;
		}
		$('.cluster_mode_title').html(text)
	},

  event_bind:function(){
    $('.rule_checkbox_group').unbind('click').click(function(ev){
      var _type = $(this).attr('bt-event-type'), _checkbox = '.bt_checkbox_groups';
      switch (_type) {
        case 'active_all'://选中全部
          var thatActive = $(this).find(_checkbox), thatList = $(this).next();
          if (thatActive.hasClass('active')) {
            thatActive.removeClass('active').prev().prop('checked', false);
            thatList.find(_checkbox).removeClass('active').prev().prop('checked', false);
          } else {
            thatActive.addClass('active').prev().prop('checked', true);
            thatList.find(_checkbox).addClass('active').prev().prop('checked', true);
          }
          break;
        case 'active': //激活选中和取消
          var thatActive = $(this).find(_checkbox), thatList = $(this).next();
          if (thatActive.hasClass('active')) {
            thatActive.removeClass('active').prev().prop('checked', false);
            $('.mysql_content_list>.mysql_checkbox_group input').prop('checked', false).next().removeClass('active');
            if (thatList.length == 1) {
              thatList.find(_checkbox).removeClass('active').prev().prop('checked', false);
            } else {
              var nodeLength = $(this).parent().siblings().length + 1,
                  nodeList = $(this).parent().parent();
              if (nodeList.find('.bt_checkbox_groups.active').length != nodeLength) {
                nodeList.prev().find(_checkbox).removeClass('active').prev().prop('checked', false);
              }
            }
          } else {
            thatActive.addClass('active').prev().prop('checked', true);
            if (thatList.length == 1) {
              thatList.find(_checkbox).addClass('active').prev().prop('checked', true);
            } else {
              var nodeLength = $(this).parent().siblings().length + 1,
                  nodeList = $(this).parent().parent();
              if (nodeList.find('.bt_checkbox_groups.active').length == nodeLength) {
                nodeList.prev().find(_checkbox).addClass('active').prev().prop('checked', true);
              }
            }
          }
          break;
        case 'fold': //折叠数据库列表
          if ($(this).hasClass('glyphicon-menu-down')) {
            $(this).removeClass('glyphicon-menu-down').addClass('glyphicon-menu-right').parent().next().hide();
          } else {
            $(this).removeClass('glyphicon-menu-rigth').addClass('glyphicon-menu-down').parent().next().show();
          }
          break;
      }
      $('.rule_content_list').removeAttr('style');
      ev.stopPropagation();
    })
  },
  //重置时间格式
  reset_time_format:function(time){
    if(time == 0) return '永久'
    var theTime = parseInt(time);// 秒
    var middle= 0;// 分
    var hour= 0;// 小时

    if(theTime > 60) {
      middle= parseInt(theTime/60);
      theTime = parseInt(theTime%60);
      if(middle> 60) {
        hour= parseInt(middle/60);
        middle= parseInt(middle%60);
      }
    }
    var result = ""+parseInt(theTime)+"秒";
    if(middle > 0) {
      result = ""+parseInt(middle)+"分"+result;
    }
    if(hour> 0) {
      result = ""+parseInt(hour)+"小时"+result;
    }
    return result;
  }
}
var pgsql ={
  database_table_view :function(search){
    var param = {
      table: 'databases',
      search: search || ''
    }
    $('#bt_pgsql_table').empty();
    database_table = bt_tools.table({
      el: '#bt_pgsql_table',
      url: 'database/'+bt.data.db_tab_name+'/get_list',
      param: param, //参数
      minWidth: '1000px',
      load: true,
      autoHeight: true,
      default: "数据库列表为空", // 数据为空时的默认提示
      pageName: 'database',
      beforeRequest:function(beforeData){
        var db_type_val = $('.pgsql_type_select_filter').val()
        switch(db_type_val){
          case 'all':
            delete param['db_type']
            delete param['sid']
            break;
          case 0:
            param['db_type'] = 0;
            break;
          default:
            delete param['db_type'];
            param['sid'] = db_type_val
        }
        if (beforeData.hasOwnProperty('data') && typeof beforeData.data === 'string') {
          delete beforeData['data']
          return { data: JSON.stringify($.extend(param,beforeData)) }
        }
        return {data:JSON.stringify(param)}
      },
      column:[
        {type: 'checkbox',width: 20},
        {fid: 'name',title: '数据库名',type:'text'},
        {fid: 'username',title: '用户名',type:'text',sort:true},
        {fid:'password',title:'密码',type:'password',copy:true,eye_open:true},
        {
          fid:'backup',
          title: '备份',
          width: 130,
          template: function (row) {
            var backup = '点击备份',
                _class = "bt_warning";
            if (row.backup_count > 0) backup = lan.database.backup_ok, _class = "bt_success";
            return '<span><a href="javascript:;" class="btlink ' + _class + '" onclick="database.database_detail('+row.id+',\''+row.name+'\')">' + backup + (row.backup_count > 0 ? ('(' + row.backup_count + ')') : '') + '</a> | ' +
                '<a href="javascript:database.input_database(\''+row.name+'\')" class="btlink">'+lan.database.input+'</a></span>';
          }
        },
        {
          title:'数据库位置',
          type: 'text',
          width: 116,
          template: function (row) {
            var type_column = '-'
            switch(row.db_type){
              case 0:
                type_column = '本地数据库'
                break;
              case 1:
                type_column = ('远程库('+row.conn_config.db_host+':'+row.conn_config.db_port+')').toString()
                break;
              case 2:
                $.each(cloudDatabaseList,function(index,item){
                  if(row.sid == item.id){
                    if(item.ps !== ''){ // 默认显示备注
                      type_column = item.ps
                    }else{
                      type_column = ('远程服务器('+item.db_host+':'+item.db_port+')').toString()
                    }
                  }
                })
                break;
            }
            return '<span class="flex" style="width:100px" title="'+type_column+'"><span class="size_ellipsis" style="width: 0; flex: 1;">'+type_column+'</span></span>'
          }
        },
        {
          fid: 'ps',
          title: '备注',
          type: 'input',
          blur: function (row, index, ev) {
            bt.pub.set_data_ps({
              id: row.id,
              table: 'databases',
              ps: ev.target.value
            }, function (res) {
              layer.msg(res.msg, (res.status ? {} : {
                icon: 2
              }));
            });
          },
          keyup: function (row, index, ev) {
            if (ev.keyCode === 13) {
              $(this).blur();
            }
          }
        },
        {
          type: 'group',
          title: '操作',
          width: 220,
          align: 'right',
          group: [{
							title: '工具',
							tips: 'pgsql工具',
							event: function (row) {
								pgsql.pgsql_tools(row.name);
							},
						},{
            title: '改密',
            tips: '修改数据库密码',
            hide:function(rows){return rows.db_type == 1},
            event: function (row) {
              database.set_data_pass(row.id, row.username, row.password);
            }
          }, {
            title: '删除',
            tips: '删除数据库',
            event: function (row) {
              var list = [];
              list.push(row)
              database.del_database(list, row.name,row, function (res) {
                if (res.status) database_table.$refresh_table_list(true);
                layer.msg(res.msg, {
                  icon: res.status ? 1 : 2
                })
              });
            }
          }]
        }
      ],
      sortParam: function (data) {
        return {
          'order': data.name + ' ' + data.sort
        };
      },
      tootls: [{ // 按钮组
        type: 'group',
        positon: ['left', 'top'],
        list: [{
          title: '添加数据库',
          active: true,
          event: function () {
            if(cloudDatabaseList.length == 0) return layer.msg('至少添加一个远程服务器或安装本地数据库',{time:0,icon:2,closeBtn: 2, shade: .3})
            var cloudList = []
            $.each(cloudDatabaseList,function(index,item){
              var _tips = item.ps != ''?(item.ps+' ('+item.db_host+')'):item.db_host
							cloudList.push({title:_tips,value:item.id,name:item.db_host})
            })
            bt.database.add_database(cloudList,function (res) {
              if (res.status) database_table.$refresh_table_list(true);
            })
          }
        },{
          title: '管理员密码',
          event: function () {
            bt.database.set_root('pgsql')
          }
        },{
          title:'远程服务器',
          event:function(){
            db_public_fn.get_cloud_server_list();
          }
        },{
          title: '同步所有',
          style:{'margin-left':'30px'},
          event: function () {
            database.sync_to_database({type:0,data:[]},function(res){
              if(res.status) database_table.$refresh_table_list(true);
            })
          }
        },{
          title: '从服务器获取',
          event: function () {
            if(cloudDatabaseList.length == 0) return layer.msg('至少添加一个远程服务器或安装本地数据库',{time:0,icon:2,closeBtn: 2, shade: .3})
            var _list = [];
            $.each(cloudDatabaseList,function (index,item){
              var _tips = item.ps != ''?(item.ps+' (服务器地址:'+item.db_host+')'):item.db_host
              _list.push({title:_tips,value:item.id})
            })
            bt_tools.open({
              title:'选择数据库位置',
              area:'450px',
              btn: ['确认','取消'],
              skin: 'databaseCloudServer',
              content: {
                'class':'pd20',
                form:[{
                  label:'数据库位置',
                  group:{
                    type:'select',
                    name:'sid',
                    width:'260px',
                    list:_list
                  }
                }]
              },
              success:function(layers){
                $(layers).find('.layui-layer-content').css('overflow','inherit')
              },
              yes:function (form,layers,index){
                bt.database.sync_database(form.sid,function (rdata) {
                  if (rdata.status){
                    database_table.$refresh_table_list(true);
                    layer.close(layers)
                  }
                })
              }
            })
          }
        }]
      },{
        type: 'batch', //batch_btn
        positon: ['left', 'bottom'],
        placeholder: '请选择批量操作',
        buttonValue: '批量操作',
        disabledSelectValue: '请选择需要批量操作的数据库!',
        selectList: [{
          title:'同步选中',
          url:'/database/'+bt.data.db_tab_name+'/SyncToDatabases',
          paramName: 'data', //列表参数名,可以为空
          th:'数据库名称',
          beforeRequest: function(list) {
            var arry = [];
            $.each(list, function (index, item) {
              arry.push(item.id);
            });
            return JSON.stringify({ids:JSON.stringify(arry),type:1})
          },
          success: function (res, list, that) {
            layer.closeAll();
            var html = '';
            $.each(list, function (index, item) {
              html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (res.msg.indexOf('失败')==-1 ? '#20a53a' : 'red') + '">' + res.msg + '</span></div></td></tr>';
            });
            that.$batch_success_table({
              title: '批量同步选中',
              th: '数据库名称',
              html: html
            });
          }
        },{
          title:'备份数据库',
          url: bt.data.db_tab_name == 'mysql' ? 'database?action=ToBackup' : '/database/'+bt.data.db_tab_name+'/ToBackup',
          load: true,
					param: function (row) {
						return bt.data.db_tab_name == 'mysql' ? { id: row.id } : {data:JSON.stringify({id: row.id})}
					},
					callback: function (that) { // 手动执行,data参数包含所有选中的站点
						that.start_batch({},function(list){
							var html = '';
							for(var i=0;i<list.length;i++){
								var item = list[i];
								html += '<tr><td>'+ item.name +'</td><td><div style="float:right;"><span style="color:'+ (item.request.status?'#20a53a':'red') +'">'+ item.request.msg +'</span></div></td></tr>';
							}
							database_table.$batch_success_table({title:'批量备份数据库',th:'数据库名',html:html});
							database_table.$refresh_table_list(true);
						});
					}
        },{
          title: "删除数据库",
          url: '/database/'+bt.data.db_tab_name+'/DeleteDatabase',
          load: true,
          param: function (row) {
            return {data:JSON.stringify({
                id: row.id,
                name: row.name
              })}
          },
          callback: function (that) { // 手动执行,data参数包含所有选中的站点
            var ids = [];
            for (var i = 0; i < that.check_list.length; i++) {
              ids.push(that.check_list[i].id);
            }
            database.del_database(that.check_list,function(param){
              that.start_batch(param, function (list) {
                layer.closeAll()
                var html = '';
                for (var i = 0; i < list.length; i++) {
                  var item = list[i];
                  html += '<tr><td>' + item.name + '</td><td><div style="float:right;"><span style="color:' + (item.request.status ? '#20a53a' : 'red') + '">' + item.request.msg + '</span></div></td></tr>';
                }
                database_table.$batch_success_table({
                  title: '批量删除',
                  th: '数据库名称',
                  html: html
                });
                database_table.$refresh_table_list(true);
              });
            })
          }
        }]
      }, {
        type: 'search',
        positon: ['right', 'top'],
        placeholder: '请输入数据库名称/备注',
        searchParam: 'search', //搜索请求字段，默认为 search
        value: '',// 当前内容,默认为空
      }, { //分页显示
        type: 'page',
        positon: ['right', 'bottom'], // 默认在右下角
        pageParam: 'p', //分页请求字段,默认为 : p
        page: 1, //当前分页 默认：1
        numberParam: 'limit', //分页数量请求字段默认为 : limit
        number: 20, //分页数量默认 : 20条
        numberList: [10, 20, 50, 100, 200], // 分页显示数量列表
        numberStatus: true, //　是否支持分页数量选择,默认禁用
        jump: true, //是否支持跳转分页,默认禁用
      }],
      success:function(config){
        //搜索前面新增数据库位置下拉
        if($('.pgsql_type_select_filter').length == 0){
          var _option = '<option value="all">全部</option>'
          $.each(cloudDatabaseList,function(index,item){
            var _tips = item.ps != ''?item.ps:item.db_host
            _option +='<option value="'+item.id+'">'+_tips+'</option>'
          })
          $('#bt_pgsql_table .bt_search').before('<select class="bt-input-text mr5 pgsql_type_select_filter" style="width:110px" name="db_type_filter">'+_option+'</select>')

          //事件
          $('.pgsql_type_select_filter').change(function(){
						database_table.config.page.page = 1;
            database_table.$refresh_table_list(true);
						bt.database.append_select_status(this,'pgsql')
            // database_table.$refresh_table_list(true,function(data){
            //   if(parseInt($('#bt_pgsql_table .page .Pcurrent').text()) !== 1) $('.Pstart').click()
            // });
          })
        }
      }
    });
  },
		// pgsql工具
		pgsql_tools: function (db_name, res) {
			var loadT = layer.msg('正在获取数据,请稍候...', {
				icon: 16,
				time: 0
			});
			bt_tools.send({ url: 'database/pgsql/GetInfo', data: { data: JSON.stringify({ db_name: db_name }) } }, function (rdata) {
				layer.close(loadT)
				if (rdata.status === false) {
					layer.msg(rdata.msg, {
						icon: 2
					});
					return;
				}
				// var types = {
				//   InnoDB: "MyISAM",
				//   MyISAM: "InnoDB"
				// };
				var tbody = '',
				tableList=rdata.data.table_list;
				for (var i = 0; i < tableList.length; i++) {
					// if (!types[rdata.tables[i].type]) continue;
					tbody += '<tr>\
													<td><span style="width:250px;" title="' + tableList[i].table_name + '"> ' + tableList[i].table_name + '</span></td>\
													<td><span> ' + tableList[i].collation + '</span></td>\
													<td>' + tableList[i].rows_count + '</td>\
													<td><span style="width:90px;"> ' + tableList[i].indexes_size + '</span></td>\
													<td><span> ' + tableList[i].table_size + '</span></td>\
													<td>' + tableList[i].total_size + '</td>\
											</tr> '
				}

				// if (res) {
				//   $(".gztr").html(tbody);
				//   $("#db_tools").html('');
				//   $("input[type='checkbox']").attr("checked", false);
				//   $(".tools_size").html('大小：' + rdata.data.storageSize);
				//   return;
				// }

				layer.open({
					type: 1,
					title: "PgSQL工具箱【" + db_name + "】",
					area: ['780px', '480px'],
					closeBtn: 2,
					shadeClose: false,
					content: '<div class="pd15">\
																	<div class="db_list">\
																			<span><a>数据库名称：' + db_name + '</a>\
																			<a class="tools_size">总大小：' + rdata.data.total_size + '</a></span>\
																	</div >\
																	<div class="divtable">\
																	<div  id="database_fix"  style="height:360px;overflow:auto;border:#ddd 1px solid">\
																	<table class="table table-hover "style="border:none">\
																			<thead>\
																					<tr>\
																							<th width="250px">表名</th>\
																							<th>编码</th>\
																							<th>行数</th>\
																							<th>索引大小</th>\
																							<th>表数据大小</th>\
																							<th>总大小</th>\
																					</tr>\
																			</thead>\
																			<tbody class="gztr">' + tbody + '</tbody>\
																	</table>\
																	</div>\
															</div>\
										</div>',
															success:function(){
																$(':focus').blur();
															}
				});
				tableFixed('database_fix');
				//表格头固定
				function tableFixed (name) {
					var tableName = document.querySelector('#' + name);
					tableName.addEventListener('scroll', scrollHandle);
				}

				function scrollHandle (e) {
					var scrollTop = this.scrollTop;
					//this.querySelector('thead').style.transform = 'translateY(' + scrollTop + 'px)';
					$(this).find("thead").css({
						"transform": "translateY(" + scrollTop + "px)",
						"position": "relative",
						"z-index": "1"
					});
				}
			});
		},
}
var db_public_fn = {
  // 远程服务器列表
  get_cloud_server_list:function(){
    var that = this;
    bt_tools.open({
      title:bt.data.db_tab_name+'远程服务器列表',
      area:'860px',
      btn: false,
      skin: 'databaseCloudServer',
      content: '<div id="db_cloud_server_table" class="pd20"></div>',
      success:function($layer){
        var tdHTML = [{
          fid:'db_host',
          title:'服务器地址',
          width: 170,
          template: function (item) {
            return '<span class="flex" style="width:154px" title="'+item.db_host+'"><span class="size_ellipsis" style="width: 0; flex: 1;">'+item.db_host+'</span></span>'
          }
        },
          {fid:'db_port',width:80,title:'数据库端口'},
          {fid:'db_type',width:80,title:'数据库类型'},
          {
            fid:'db_user',
            width:100,
            title:'管理员名称'
          },
          {fid:'db_password',type: 'password',title:'管理员密码',copy: true,eye_open: true},
          {fid:'ps',title:'备注',width:160,template: function (item) {
              return '<span class="flex" style="width:144px" title="'+item.ps+'"><span class="size_ellipsis" style="width: 0; flex: 1;">'+item.ps+'</span></span>'
            }},
          {
            type: 'group',
            width: 100,
            title: '操作',
            align: 'right',
            group: [{
              title:'编辑',
              hide:function (row) {
                return row.id == 0
              },
              event:function(row){
                that.render_db_cloud_server_view(row,true);
              }
            },{
              title:'删除',
              hide:function (row) {
                return row.id == 0
              },
              event:function(row){
                that.del_db_cloud_server(row)
              }
            }]
          }
        ]
        if(bt.data.db_tab_name == 'redis') tdHTML.splice(3,1)
        dbCloudServerTable = bt_tools.table({
          el:'#db_cloud_server_table',
          default:'服务器列表为空',
          data: [],
          column:tdHTML,
          tootls:[{
            type:'group',
            positon: ['left','top'],
            list:[{
              title:'添加远程服务器',
              active: true,
              event:function(){that.render_db_cloud_server_view()}
            }]
          }],
          success: function () {
            var height = $(window).height();
            var layerHeight = $layer.height();
            var top = (height - layerHeight) / 2;
            $layer.css('top', top);
          }
        });
        that.render_cloud_server_table();
      }
    })
  },
  // 重新渲染远程服务器
  render_cloud_server_table: function (callback) {
    var param = {url:'database/'+bt.data.db_tab_name+'/GetCloudServer',data:{data:JSON.stringify({type:bt.data.db_tab_name})}}
    if(bt.data.db_tab_name == 'mysql') param = {url:'database?action=GetCloudServer',data:{type:bt.data.db_tab_name}}
    bt_tools.send(param,function(rdata){
      var arry = []
      for (var i = 0; i < rdata.length; i++) {
        var element = rdata[i];
        if(element.id == 0) continue
        arry.push(element)
      }
      dbCloudServerTable.$reader_content(arry);
      if(callback) callback(rdata)
    });
  },
  // 添加/编辑远程服务器视图
  render_db_cloud_server_view:function(config,is_edit){
    var that = this,_type = bt.data.db_tab_name;
    if(!config){
      config = {db_host:'',db_port:'3306',db_user:'',db_password:'',db_user:'root',ps:''}
      if(_type == 'sqlserver'){
        config['db_port'] = 1433
        config['db_user'] = 'sa'
      }else if(_type == 'redis'){
        config['db_port'] = 6379
        config['db_user'] = ''
      }else if(_type == 'mongodb'){
        config['db_port'] = 27017
      }else if(_type == 'pgsql'){
        config['db_port'] = 5432
        config['db_user'] = 'postgres'
      }
    }
    var tips = [
      '支持MySQL5.5、MariaDB10.1及以上版本',
      '支持阿里云、腾讯云等云厂商的云数据库',
      '注意1：请确保本服务器有访问数据库的权限',
      '注意2：请确保填写的管理员帐号具备足够的权限',
    ]
    if (bt.data.db_tab_name === 'mysql') {
      tips.push('注意3：通过宝塔安装的数据库root默认不支持远程权限');
    }
    bt_tools.open({
      title: (is_edit?'编辑':'添加')+bt.data.db_tab_name+'远程服务器',
      area:'450px',
      btn:['保存','取消'],
      skin:'addCloudServerProject',
      content:{
        'class':'pd20',
        form:[{
          label:'服务器地址',
          group:{
            type:'text',
            name:'db_host',
            width:'260px',
            value:config.db_host,
            placeholder:'请输入服务器地址',
            event:function(){
              $('[name=db_host]').on('input blur',function(e){
                switch(e.type){
                  case 'input':
                    $('[name=db_ps]').val($(this).val())
                    break;
                  case 'blur':
                    if($(this).val().indexOf(':') != -1){
                      var reg = /:(\d+)/,_post = $(this).val().match(reg)
                      $('[name=db_port]').val(_post[1])
                      $(this).val($(this).val().replace(reg,''))
                    }
                    break;
                }
              })
            }
          }
        },{
          label:'数据库端口',
          group:{
            type:'number',
            name:'db_port',
            width:'260px',
            value:config.db_port,
            placeholder:'请输入数据库端口'
          }
        },{
          label:'管理员名称',
          hide:bt.data.db_tab_name == 'redis'?true:false,
          group:{
            type:'text',
            name:'db_user',
            width:'260px',
            value:config.db_user,
            placeholder:'请输入管理员名称',
          }
        },{
          label:'管理员密码',
          group:{
            type:'text',
            name:'db_password',
            width:'260px',
            value:config.db_password,
            placeholder:'请输入管理员密码'
          }
        },{
          label:'备注',
          group:{
            type:'text',
            name:'db_ps',
            width:'260px',
            value:config.ps,
            placeholder:'服务器备注'
          }
        },{
          group:{
            type:'help',
            style:{'margin-top':'0'},
            list: tips
          }
        }]
      },
      success:function(){
        if(bt.data.db_tab_name != 'mysql') $('.addCloudServerProject .help-info-text li').eq(0).remove();
      },
      yes:function(form,indexs){
        var interface = is_edit?'ModifyCloudServer':'AddCloudServer'
        if(form.db_host == '') return layer.msg('请输入服务器地址',{icon:2})
        if(form.db_port == '') return layer.msg('请输入数据库端口',{icon:2})
        if(!bt.check_port(form.db_port)) return layer.msg('端口格式错误，可用范围：1-65535',{icon:2})
        if(form.db_user == '' && bt.data.db_tab_name != 'redis') return layer.msg('请输入管理员名称',{icon:2})
        if(form.db_password == '') return layer.msg('请输入管理员密码',{icon:2})

        if(is_edit) form['id'] = config['id'];
        form['type'] = bt.data.db_tab_name
        that.layerT = bt.load('正在'+(is_edit?'修改':'创建')+'远程服务器,请稍候...');

        var param = {url:'database/'+bt.data.db_tab_name+'/'+interface,data:{data:JSON.stringify(form)}}
        if(bt.data.db_tab_name == 'mysql') param = {url:'database?action='+interface,data:form}
        bt_tools.send(param,function(rdata){
          that.layerT.close();
          if(rdata.status){
            that.reset_server_config()
            layer.close(indexs)
            layer.msg(rdata.msg, {icon:1})
          }else{
            layer.msg(rdata.msg,{time:0,icon:2,closeBtn: 2, shade: .3,area: '650px'})
          }
        })
      }
    })
  },
  // 删除远程服务器管理关系
  del_db_cloud_server: function(row){
    var that = this;
    layer.confirm('仅删除管理关系以及面板中的数据库记录，不会删除远程服务器中的数据', {
      title: '删除【'+row.db_host+'】远程服务器',
      icon: 0,
      closeBtn: 2
    }, function () {
      var param = {url:'database/'+bt.data.db_tab_name+'/RemoveCloudServer',data:{data:JSON.stringify({id:row.id})}}
      if(bt.data.db_tab_name == 'mysql') param = {url:'database?action=RemoveCloudServer',data:{id:row.id}}
      bt_tools.send(param,function(rdata){
        if(rdata.status) that.reset_server_config()
        layer.msg(rdata.msg, {
          icon: rdata.status ? 1 : 2
        })
      })
    })
  },
  // 重新加载服务
  reset_server_config:function(){
    this.render_cloud_server_table(function(){
      if (bt.data.db_tab_name == 'redis') redis.cloudInfo.sid = 0  //redis恢复默认是本地服务器
      db_public_fn.showDatabase();
    });
  },
	//显示mysql运行环境
	show_run_panel:function(){
		// var runPanel=$('#runPanel')
		function soft_setup_find() {
			$.post("plugin?action=get_soft_find", {
				sName: 'mysql'
			}, function (rdata) {
					if (rdata.task == "-1") {
						setTimeout(function () {
							soft_setup_find();
						}, 3000);
					} else {
						var pan = '<span id="runPanel" style="cursor:pointer">' +
							'<img src="/static/img/soft_ico/ico-' + rdata.name + '.svg">' +
							'<span class="Resize">' + rdata.title + ' ' + rdata.version + '</span>' +
							(rdata.status ? '<span class="glyphicon glyphicon-play ac"></span>' :
								'<span style="color: #ef0808; margin-left: 3px;" class="glyphicon glyphicon-pause"></span>') +
							'</span>';
						$('.pull-left button').eq(8).css({'padding':'3px 10px','height':'30px','box-sizing':'border-box'})
						if(!rdata.status){
							$('.pull-left button').eq(8).addClass('stopStatus')
						}
						$('.pull-left button').eq(8).html(pan);
						var manu=$('<div class="flex manu" style="display:none;"><div class="arrow_b" style=""></div><div class="arrow" style=""></div></div>')
						var status_list = [
							{
								opt: rdata.status? 'stop':'start',
								title: rdata.status? '停止':'启动'
							},
							{
								opt: 'restart',
								title: '重启'
							},
						]
						for (var i = 0; i < status_list.length; i++) manu.append('<div class="ac" onclick="bt.pub.set_server_status(\'' + rdata.name + '\',\'' + status_list[i].opt + '\')">' + status_list[i].title + '</div> |');
						manu.append('<div class="ac" onclick="bt.pub.set_server_status(\'' + rdata.name + '\',\'' + 'reload' + '\')">' + '重载' + '</div>');
						$('#runPanel').wrap('<div class="runcon"></div>')
						var time=null
						$('#runPanel').parents('.btn').off('click').on('click',function(e){
							if($(e.target).parents('.manu').length>0 ||e.target==$('.manu')[0]){
								return
							}
							soft.set_soft_config(rdata.name)
						})
						$('#runPanel').parents('.btn').on('mouseover',function(){
							manu.show()
						})
						$('#runPanel').parents('.btn').on('mouseleave',function(){
							time=setTimeout(function(){
								manu.hide()
							},200)

						})
						manu.on('mouseenter',function(){
							clearTimeout(time)
						})
						manu.on('mouseleave',function(){
							manu.hide()
						})
						$('.runcon').append(manu)
						var div=$('.Resize')
						if(window.innerWidth<1600 &&window.innerWidth>1500){
							$('.pull-left button').eq(8).show()
							div.html(rdata.title)
						}else if(window.innerWidth<=1500){
							$('.pull-left button').eq(8).hide()
						}else{
							$('.pull-left button').eq(8).show()
							div.html(rdata.title+' '+rdata.version)
						}
						$(window).resize(function(){
							if(window.innerWidth<1600 &&window.innerWidth>1500){
								$('.pull-left button').eq(8).show()
								div.html(rdata.title)
							}else if(window.innerWidth<=1500){
								$('.pull-left button').eq(8).hide()
							}else{
								$('.pull-left button').eq(8).show()
								div.html(rdata.title+' '+rdata.version)
							}
						});
					}
					if(!rdata.setup){
						$('.pull-left button').eq(8).hide()
					}
			});
		}
		soft_setup_find()
	},
  // 显示当前数据库
  showDatabase: function (showTips) {
    var type = $('.database-pos .tabs-item.active').data('type');
    bt.set_cookie('db_page_model', type);
    bt.data.db_tab_name = type;
    if (type == 'redis') {
      $('.info-title-tips').hide();
    } else {
      $('.info-title-tips').show()
    }
    var loadT = layer.msg('正在获取远程服务器列表,请稍候...', {
      icon: 16,
      time: 0,
      shade: [0.3, '#000']
    });

    var requestParam = {url:'database/'+bt.data.db_tab_name+'/GetCloudServer',data:{data:JSON.stringify({type:bt.data.db_tab_name})}}
    if (bt.data.db_tab_name == 'mysql') requestParam = {url:'database?action=GetCloudServer',data:{type:bt.data.db_tab_name}}
    bt_tools.send(requestParam,function(cloudData){
      layer.close(loadT);
      cloudDatabaseList = cloudData
      //是否安装本地或远程服务器
      if(cloudData.length <= 0){
        var tips = '当前未安装本地服务器/远程服务器,<a class="btlink install_server">点击安装</a> | <a class="btlink" onclick="db_public_fn.get_cloud_server_list()">添加远程服务器</a>'
        if(bt.data.db_tab_name == 'sqlserver')tips = '当前未配置远程服务器,<a class="btlink" onclick="db_public_fn.get_cloud_server_list()">添加远程服务器</a>'
        $('.mask_layer').removeAttr('style');
        $('.prompt_description').html(tips)

        // 安装pgsql
        $('.install_server').click(function(){
          var db_type = bt.data.db_tab_name
          if(db_type == 'pgsql'){
            bt.soft.get_soft_find('pgsql_manager',function(rdata){   //判断是否安装插件
              for (var i = 0; i < rdata.versions.length; i++) {
                if (rdata.versions[i].setup == true) {  //判断是否安装版本
                  bt.soft.set_lib_config('pgsql_manager','PostgreSQL管理器')
                  break;
                }else{
                  bt.soft.install('pgsql_manager')
                  break;
                }
              }
            })
          }else{
            bt.soft.install(db_type)
          }
        })
      }else{
        $('.mask_layer').hide()
        if (showTips && type == 'mysql' && !isSetup) {
          layer.msg('未安装本地数据库，已隐藏无法使用的功能!', { time: 2000 });
        }
      }
			// $('#runPanel').hide();
      switch (type) {
        case 'mysql':
          database.database_table_view();
					db_public_fn.show_run_panel()
          if (cloudData.length > 0 && !isSetup) {
						// $('#runPanel').hide();
            $('#bt_database_table .tootls_group.tootls_top .pull-left button').eq(1).hide();
            $('#bt_database_table .tootls_group.tootls_top .pull-left button').eq(2).hide();
            $('#bt_database_table .tootls_group.tootls_top .pull-left button').eq(4).hide();
            $('#bt_database_table .tootls_group.tootls_top .pull-left button').eq(7).hide();
						$('#bt_database_table .tootls_group.tootls_top .pull-left button').eq(8).hide();
          }
          break;
        case 'sqlserver':
          sql_server.database_table_view();
          break;
        case 'mongodb':
          bt_tools.send({url:'database/'+bt.data.db_tab_name+'/get_root_pwd'},function(_status){
            mongoDBAccessStatus = _status.authorization == 'enabled'?true:false
            mongodb.database_table_view();
          },'获取访问状态')
          break;
        case 'redis':
          redis.database_table_view();
          break;
        case 'pgsql':
          pgsql.database_table_view();
          break;
      }
    })
  },
	//计算工具的数据格式和单位
	compute_data_unit:function(data){
		if (typeof data !== 'number' || isNaN(data)) {
			return 'Invalid input';
		}
		var size=data;
		var ext_list=['b','KB','MB','GB','TB']

	for (var i = 0; i < ext_list.length; i++) {
			var ext = ext_list[i];
			if (size < 1024) return size + ext;
			size = size / 1024;
			if(!bt.isInteger(size)) size=size.toFixed(2)
		}
		return size+ext_list[ext_list.length-1]
	},
}

$('.database-pos .tabs-item[data-type="' + (bt.get_cookie('db_page_model') || 'mysql') + '"]').trigger('click');
