if (window.__zoom) window.__zoom = 1;
var bt_file = {
  area: [], // Win视图大小
  loadT: null, // 加载load对象
  loadY: null, // 弹窗layer对象，仅二级弹窗
  vscode: null,
  file_table_arry: [], // 选中的文件列表
  timerM: null, // 定时器
  is_update_down_list: true,
  is_recycle: bt.get_cookie('file_recycle_status') || false, // 是否开启回收站
  is_editor: false, // 是否处于重命名、新建编辑状态
  file_header: { file_checkbox: 40, file_name: 'auto', file_tamper_core: 80, file_accept: 120, file_size: 90, file_mtime: 145, file_ps: 'auto', file_operation: 450, file_tr: 0, file_list_header: 0 },
  file_operating: [], // 文件操作记录，用于前进或后退
  file_pointer: -1, // 文件操作指针，用于指定前进和后退的路径，的指针位数
  file_path: 'C:/', // 文件目录
  file_page_num: bt.get_storage('local', 'showRow') || 500, //每页个数
  file_list: [], // 文件列表
  tamper_data: {}, // 文件列表防篡改数据
  file_store_list: [], // 文件收藏列表
  file_store_current: 0, //文件收藏当前分类索引
  file_images_list: [], // 文件图片列表
  file_drop: null, // 拖拽上传
  file_present_task: null,
  file_selection_operating: {},
  file_share_list: [],
  recomConfig: {}, //推荐软件
  cloud_storage_type: 'upload', //云存储操作类型
  cloud_storage_config: {}, //云存储配置
  cloud_storage_upload_list: [], //云存储上传列表
  cloud_storage_download_list: [], //云存储下载列表
  cloud_storage_type_list: [], //云存储类型列表
  cloud_storage_use_status: true, //判断是否企业版
  search_history: [], //搜索历史记录
  zipPath: '', // ZIP压缩包预览根目录
  zipType: '', // 压缩包预览类型
  newPathList: [],
  headerId: 'File_Header',
  cache_set_column: [], //缓存设置显示隐藏的列数据
  cache_set_all: {}, //所有缓存设置显示隐藏的列数据
  duplicateFile: function (rdata, zip_path, path, extract_path,type='extract',ress,unZipType) {
    var that = this
    if (rdata.type != undefined && rdata.type == '1') {
      var html =
        '<div style="    padding: 20px 20px;">\
			<div>\
				<div class="bt-form hint_confirm" style="padding: 10px">\
					<div class="hint_title">\
						<i class="hint-confirm-icon"></i>\
						<div class="hint_con">当前目录已包含以下文件，请选择需要操作的文件，继续操作？</div>\
					</div>\
				</div>\
				<div id="duplicate-file-table" style="min-height: 200px"></div>\
				</div>\
				<div><span style="color:#999999;">选择文件后，进行相应的操作</span></div>\
				<div style="margin-top: 20px">\
					<button class="btn btn-success mr5 jump">跳过</button>\
					<button class="btn btn-default mr5 cover">覆盖</button>\
					<button class="btn btn-default mr5 rename">重命名解压文件</button>\
				</div>\
			</div>';
      layer.open({
        type: 1,
        closeBtn: 2,
        content: html,
        offset: 'auto',
        area: ['700px','420px'],
        title: false,
        success: function (layero, index) {
          function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
          }
          var duplicateFileNum = rdata.data.length;
          var successNum = 0;
          var duplicateFileTable = bt_tools.table({
            el: '#duplicate-file-table',
            height: '200px',
            data: rdata.data,
            column: [
              {
                type: 'checkbox',
                width: 30,
              },
              {
                title: '文件名',
                fid:'name',
                type: 'text',
                template: function (row) {
                  return '<span title = "'+row.zip_file_path+'">'+row.name+'</span>'
                }
              },
              {
                title: '大小',
                width: 150,
                type: 'text',
                fid: 'file_size',
                template: function (row) {
                  if(row.file_size == row.zip_file_size){
                    return '<span style="color:#20A53A ;">无变化</span>'
                  }else {
                    return '<div style="display: flex;flex-direction: column;"><div>解压文件：<span style="color: red">'+formatBytes(row.zip_file_size)+'</span></div><div>目标文件：<span style="color: red">'+formatBytes(row.file_size)+'</span></div></div>'
                  }
                }
              },
              {
                title: '修改时间',
                width: 200,
                type: 'text',
                fid: 'file_mtime',
                template: function (row) {
                  if(row.file_mtime == row.zip_file_mtime){
                    return '<span style="color:#20A53A ;">无变化</span>'
                  }else {
                    return '<div style="display: flex;flex-direction: column;"><div>解压文件：<span style="color: red">'+row.zip_file_mtime+'</span></div><div>目标文件：<span style="color: red">'+row.file_mtime+'</span></div></div>'
                  }
                }
              },
              {title: '执行结果',type: 'text',template: function (row) {
                  return '-'
                }
              },
            ],
          })

          function resultFun(text) {
            $.each(duplicateFileTable.checkbox_list, function (index, item) {
              $($($('#duplicate-file-table').find('tbody').find('tr')[item]).find('td')[4]).html('<span style="color:#20A53A ;">'+text+'</span>')
              $($($('#duplicate-file-table').find('tbody').find('tr')[item]).find('td')[0]).off().find('.cust—checkbox').addClass('disabled')
              $($($('#duplicate-file-table').find('tbody').find('tr')[item]).find('td')[0]).find('.cust—checkbox-input').prop('checked', false).attr('disabled', 'disabled')
              $($($('#duplicate-file-table').find('tbody').find('tr')[item]).css('cursor', 'not-allowed'))
            })
            duplicateFileTable.checkbox_list = []
          }

          function resShow(res, type) {
            if (res.status) {
              successNum += duplicateFileTable.checkbox_list.length;
              if (successNum == duplicateFileNum) {
                layer.closeAll();
                bt.msg({status: true, msg: '解压成功'});
                that.reader_file_list({}, function (res) {
                });
              }
              switch (type) {
                case 0:
                  resultFun('已跳过');
                  break;
                case 1:
                  resultFun('已覆盖');
                  break;
                case 2:
                  resultFun('已重命名');
                  break;
              }
            }
          }

          function submitResult(data) {
            if(type == 'extract') {
              bt_tools.send(
                {
                  url: 'files/' + that.zipType + '/extract_byfiles',
                  data: {
                    data: JSON.stringify({
                      zip_path: data.zip_path,
                      sfile: data.path,
                      extract_path: data.extract_path,
                      filenames: data.filenames,
                      type: data.type,
                    }),
                  },
                }, function (res) {
                  resShow(res, data.type);
                }
              )
            }else if(type == 'unZip'){
              bt_tools.send(
                {
                  url:'/files?action=UnZip',
                  data:data
                },function (res) {
                  resShow(res, data.type1);
                })
            }
          }

          function submit(rdata,type,zip_path, path, extract_path) {
            var filenames = []
            $.each(duplicateFileTable.checkbox_list, function (index, item) {
              filenames.push({zip_file_path:rdata.data[item].zip_file_path,file_path:rdata.data[item].file_path})
            })
            var data = {
              zip_path: zip_path,
              path: path,
              extract_path: extract_path,
              filenames: filenames,
              type: type
            }
            submitResult(data)
          }

          function submitForm(ress,unZipType,type) {
            var filenames = []
            $.each(duplicateFileTable.checkbox_list, function (index, item) {
              filenames.push({zip_file_path:rdata.data[item].zip_file_path,file_path:rdata.data[item].file_path})
            })
            var data = {
              sfile: ress.z_name,
              dfile: ress.z_path,
              type: unZipType,
              coding: ress.z_code,
              password: ress.z_password,
              filenames: JSON.stringify(filenames),
              type1: type
            }
            submitResult(data)
          }

          var time = setInterval(function () {
            if (duplicateFileTable.init) {
              $('span[data-index="0"] label i').click()
              clearInterval(time);
              $('.jump').click(function () {
                if(type== 'extract') {
                  submit(rdata, 0, zip_path, path, extract_path);
                }else if(type == 'unZip'){
                  submitForm(ress,unZipType,0)
                }
              })
              $('.rename').click(function () {
                if(type== 'extract') {
                  submit(rdata, 2, zip_path, path, extract_path);
                } else if(type=='unZip'){
                  submitForm(ress,unZipType,2)
                }
              })
              $('.cover').click(function () {
                if(type== 'extract') {
                  submit(rdata, 1, zip_path, path, extract_path);
                } else if(type=='unZip'){
                  submitForm(ress,unZipType,1)
                }
              })
            }
          },500)
        },
      });
      return false;
    } else {
      return true;
    }
  },
  scroll_width: (function () {
    var odiv = document.createElement('div'),
      styles = {
        width: '100px',
        height: '100px',
        overflowY: 'scroll',
      },
      i,
      scrollbarWidth;
    for (i in styles) odiv.style[i] = styles[i];
    document.body.appendChild(odiv); // 把div添加到body中
    scrollbarWidth = odiv.offsetWidth - odiv.clientWidth; // 相减
    odiv.parentNode.removeChild(odiv); // 移除创建的div
    return scrollbarWidth; // 返回滚动条宽度
  })(),
  is_mobile: (function () {
    if (navigator.userAgent.match(/mobile/i) || /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
      // layer.msg(navigator.userAgent.match(/mobile/i), { icon: 2, time: 0 });
      return true;
    }
    return false;
  })(),
  method_list: {
    GetFileBody: '获取文件内容', // 获取文件内容
    DeleteDir: '删除文件目录',
    DeleteFile: '删除文件',
    GetDiskInfo: ['system', '获取磁盘列表'],
    CheckExistsFiles: '检测同名文件是否存在',
    GetFileAccess: '获取文件权限信息',
    SetFileAccess: lan['public'].config,
    DelFileAccess: '正在删除用户',
    get_path_size: '获取文件目录大小',
    add_files_store_types: '创建收藏夹分类',
    get_files_store: '获取收藏夹列表',
    del_files_store: '取消文件收藏',
    dir_webshell_check: '木马扫描',
    file_webshell_check: '查杀文件',
    files_search: '文件搜索',
    get_download_url_list: '获取外链分享列表',
    get_download_url_find: '获取指定外链分享信息',
    create_download_url: '创建外链分享',
    remove_download_url: '取消外链分享',
    add_files_store: '添加文件收藏',
    CopyFile: '粘贴文件',
    MvFile: '剪切文件',
    SetBatchData: '执行批量操作',
    BatchPaste: '粘贴中',
  },
  file_DIR_list: '', //文件夹类型 大小统一发送时需要的
  init: function () {
    var that = this;
    if (bt.get_cookie('rank') == undefined || bt.get_cookie('rank') == null || bt.get_cookie('rank') == 'a' || bt.get_cookie('rank') == 'b') {
      bt.set_cookie('rank', 'list');
    }
    //推荐安全软件
    product_recommend.init(function () {
      that.area = [window.innerWidth, window.innerHeight];
      that.file_path = bt.get_cookie('Path');
      that.event_bind(); // 事件绑定
      that.reader_file_list({ is_operating: true }); // 渲染文件列表
      that.render_file_disk_list(); // 渲染文件磁盘列表

      that.set_file_table_width(); // 设置表格宽度
      that.recomConfig = product_recommend.get_recommend_type(7);
      //云存储列表
      bt_tools.send(
        { url: '/files/upload/get_oss_objects', data: {} },
        function (list) {
          if (typeof list.msg != 'undefined' && list.msg.indexOf('抱歉，此功能只') == -1) {
            bt_tools.msg(list);
          }
          if (typeof list.msg != 'undefined') {
            that.cloud_storage_upload_list = [
              { name: 'bos', title: '百度云存储' },
              { name: 'alioss', title: '阿里云OSS' },
              { name: 'txcos', title: '腾讯云COS' },
              { name: 'obs', title: '华为云存储' },
            ];
            that.cloud_storage_download_list = [
              { name: 'bos', title: '百度云存储' },
              { name: 'alioss', title: '阿里云OSS' },
              { name: 'txcos', title: '腾讯云COS' },
              { name: 'obs', title: '华为云存储' },
            ];
            that.cloud_storage_use_status = false;
          } else {
            that.cloud_storage_upload_list = list.upload;
            that.cloud_storage_download_list = list.down;
          }
          var downHTML = '<li data-type="down_url"><i class="file_menu_icon soft_link_file_icon"></i><span>从URL链接下载</span></li>';
          $.each(that.cloud_storage_download_list, function (index, item) {
            downHTML +=
              '<li data-type="down_' +
              item.name +
              '"><i class="file_menu_icon down_' +
              item.name +
              '_file_icon"></i><span  style="position:relative">' +
              item.title +
              '<span class="new-file-icon new-ltd-icon" style="right: 26px;top: 4px;left: auto;"></span</span></li>';
          });
          $('.upload_download .nav_down_list').html(downHTML);
          // 下载
          $('.file_nav_view .upload_download li').on('click', function (e) {
            if ($(this).index()) {
              var down_item = {
                ps: '从远程云存储服务器其中下载文件，配合对应插件使用，完成文件的快速传输，实现文件转移,支持多种远程云服务。',
                description: ['百度云存储', '阿里云OSS', '腾讯云COS', '华为云存储'],
                pluginName: '远程下载',
                preview: false,
                imgSrc: 'https://www.bt.cn/Public/new/plugin/introduce/files/downLoadServer.png',
              };
              if (!that.check_ltd_end(down_item, 78, { imgArea: ['860px', '550px'] })) return;
            }
            var type = $(this).data('type'),
              nav_down_list = $('.create_file_or_dir .nav_down_list');
            nav_down_list.css({
              display: function () {
                setTimeout(function () {
                  nav_down_list.removeAttr('style');
                }, 100);
                return 'none';
              },
            });
            switch (type) {
              case 'down_url':
                that.open_download_view();
                break;
              default:
                that.get_cosfs_upload_list({ open: type });
                break;
            }

            e.stopPropagation();
            e.preventDefault();
          });
        },
        { verify: false }
      );
      var callback = $(this).data('callback');
      if (callback) callback(item);
    });
    bt_tools.send({ url: '/config?action=get_table_header', data: { table_name: that.headerId } }, function (rdata_header) {
      pub_content(rdata_header);
    })
    function pub_content(table_header) {
      var setting_ul_html = '';
      that.cache_set_all = table_header
      that.cache_set_column = that.cache_set_all[that.headerId]
        ? JSON.parse(that.cache_set_all[that.headerId])
        : [
          {
            title: '文件名',
            type: 'file_name',
            disabled: true,
            value: true,
          },
          {
            title: '防篡改',
            type: 'file_tamper_core',
            disabled: false,
            pay: true,
            value: true,
          },
          {
            title: '权限/所有者',
            type: 'file_accept',
            disabled: false,
            value: true,
          },
          {
            title: '大小',
            type: 'file_size',
            disabled: false,
            value: true,
          },
          {
            title: '修改时间',
            type: 'file_mtime',
            disabled: false,
            value: true,
          },
          {
            title: '备注',
            type: 'file_ps',
            disabled: false,
            value: true,
          },
          {
            title: '操作',
            type: 'file_operation',
            disabled: true,
            value: true,
          },
        ];
      // 渲染显示隐藏列按钮下拉列表
      for (var j = 0; j < that.cache_set_column.length; j++) {
        var obj = that.cache_set_column[j],
          title = obj.title.indexOf('/>') !== -1 ? $(obj.title).text().replace(/\?/g, '') : '';
        setting_ul_html +=
          '<li class="setting_ul_li' +
          (obj.value ? ' active' : '') +
          (obj.disabled ? ' disabled' : '') +
          '">\
          <i></i>\
          <span class="ml10">' +
          (title ? title : obj.title) +
          '</span>' +
          (title || obj.pay ? '<span class="glyphicon icon-vipLtd" style="margin-left: 6px;position: relative;top: -2px;"></span>' : '') +
          '</li>';
        if (!obj.value)
          $('.file_th.' + obj.type)
            .hide()
            .next()
            .hide();
      }
      $('.set_list_fid_dropdown .setting_ul').html(setting_ul_html);
    }
  },
  // 事件绑定
  event_bind: function () {
    var that = this;
    // 自定义列事件
    //显示隐藏列鼠标移入事件
    var set_interval = null;
    $('.file_nav_view .setting_btn').hover(
      function () {
        $(this).next().show();
      },
      function (e) {
        var _this = $(this),
          mouseY = 0,
          mouseX = 0;
        //获取鼠标位置
        $(document).mousemove(function (e) {
          mouseY = e.pageY;
          mouseX = e.pageX;
        });
        set_interval = setInterval(function () {
          if (_this.next().css('display') == 'block') {
            var bW = _this.width(),
              bH = _this.height(),
              bT = _this.offset().top,
              bL = _this.offset().left, // 按钮宽高 等位置
              uW = _this.next().width(),
              uH = _this.next().height(),
              uT = _this.next().offset().top,
              uL = _this.next().offset().left; // 下拉列表宽高 等位置
            var is_b = mouseX > bL && mouseX <= bL + bW && mouseY > bT && mouseY <= bT + bH,
              is_u = mouseX > uL && mouseX <= uL + uW && mouseY > uT && mouseY <= uT + uH;
            //判断是否还在区域内
            if (!is_b && !is_u) _this.next().hide();
          } else {
            clearInterval(set_interval);
          }
        }, 200);
      }
    );

    //显示隐藏列点击事件
    $('.file_nav_view .setting_ul').on('click', '.setting_ul_li', function (e) {
      // $('.file_nav_view .setting_ul').find('.setting_ul_li').unbind('click').click(function(e){
      if ($(this).hasClass('disabled')) return false;
      if ($(this).hasClass('active')) $(this).removeClass('active');
      else $(this).addClass('active');
      var index = $(this).index();
      that.cache_set_column[index].value = !that.cache_set_column[index].value; //重置显示状态
      that.cache_set_all[that.headerId] = that.cache_set_column;

      //判断是否显示列
      if (!that.cache_set_column[index].value) {
        $('.file_th.' + that.cache_set_column[index].type)
          .hide()
          .next()
          .hide();
      } else {
        $('.file_th.' + that.cache_set_column[index].type)
          .show()
          .next()
          .show();
      }

      bt.send('set_table_header', 'config/set_table_header', { table_name: that.headerId, table_data: JSON.stringify(that.cache_set_column) }, function (res) {
        bt.send('get_table_header', 'config/get_table_header', {}, function (rdata_header) {
          // 获取所有表自定义列数据
          bt.config['table_header'] = rdata_header;
          //刷新列表
          that.reader_file_list_content(that.file_list);
          that.set_file_table_width(); // 设置表格宽度
        });
      });
    });

    // 窗口大小限制
    $(window)
      .resize(function (ev) {
        if ($(this)[0].innerHeight != that.area[1]) {
          that.area[1] = $(this)[0].innerHeight;
          that.set_file_view();
        }
        if ($(this)[0].innerWidth != that.area[0]) {
          that.area[0] = $(this)[0].innerWidth;
          that.set_dir_view_resize(); //目录视图
          that.set_menu_line_view_resize(); //菜单栏视图
          that.set_file_table_width(); //设置表头宽度
        }
      })
      .keydown(function (e) {
        // 全局按键事件
        e = window.event || e;
        var keyCode = e.keyCode,
          tagName = e.target.tagName.toLowerCase();
        if (!that.is_editor) {
          //非编辑模式
          // Ctrl + v   粘贴事件
          if (e.ctrlKey && keyCode == 86 && tagName != 'input' && tagName != 'textarea') {
            that.paste_file_or_dir();
          }
          // 退格键
          if (keyCode == 8 && tagName !== 'input' && tagName !== 'textarea' && typeof $(e.target).attr('data-backspace') === 'undefined') {
            $('.file_path_upper').click();
          }
        }
      });
    $('.search_path_views')
      .find('.file_search_checked')
      .unbind('click')
      .click(function () {
        if ($(this).hasClass('active')) {
          $(this).removeClass('active');
        } else {
          $(this).addClass('active');
        }
      });
    // 搜索按钮
    $('.search_path_views').on('click', '.path_btn', function (e) {
      var input_dom = $('.search_path_views').find('#search_history').find('.history_list_box').find('.list_box_body');
      var _obj = { path: that.file_path, search: $('.file_search_input').val() };
      if ($('#search_all').hasClass('active')) _obj['all'] = 'True';
      that.loadT = bt.load('正在搜索文件中,请稍候...');
      _obj['file_btn'] = true;
      that.reader_file_list(_obj, function (res) {
        if (!res.msg) that.loadT.close();
        if (_obj.search) $('.fileAllSize').addClass('hide');
        else $('.fileAllSize').removeClass('hide');
      });
      $('#search_history').css('display', 'none');
      e.stopPropagation();
    });
    $('.search_path_views').on('click', '.file_search_config label', function (e) {
      $(this).prev().click();
    });
    // 搜索框（获取焦点、回车提交）
    $('.search_path_views .file_search_input').on('focus keyup', function (e) {
      e = e || window.event;
      var _obj = { path: that.file_path, search: $(this).val() };
      switch (e.type) {
        case 'keyup':
          var isCheck = $('.file_search_checked').hasClass('active');
          if (isCheck) _obj['all'] = 'True';
          if (e.keyCode != 13 && e.type == 'keyup') return false;
          $('.path_btn').click();
          break;
      }
      e.stopPropagation();
      e.preventDefault();
    });
    $('.search_path_views input').css('width', '350px');
    var recomList = ['收藏夹', '文件分享', '文件同步', '企业级防篡改', '文件内容搜索'],_recomHtml = ''
    for(var i = 0; i<recomList.length;i++){
      _recomHtml += '<div><span class="item_box">'+recomList[i]+'</span></div>'
    }
    $('.search_path_views').append(
      '<div id="search_history" style="width:400px;position:absolute;z-index:99;background:#fff;display:none;transitoin:all .3s;box-shadow: 4px 4px 8px rgba(0, 0, 0, .1), -4px -4px 8px rgba(0, 0, 0, .1);top:35px;border-radius:5px"><div class="history_list_box"><div style="display:flex;flex-direction:row;align-items:center;justify-content:space-between;border-bottom:1px solid #EBEEF5;padding:5px 10px"><span style="font-size: 12px;color:#999">搜索历史</span><div id="all_delete" style="width:52px;height:24px;border:1px solid #DCDFE6;color:#999;font-size:12px;display:flex;align-items:center;cursor:pointer;border-radius:2px;justify-content:space-evenly;flex-direction:row"><img class="all_img" style="width:14px;height:14px" src="/static/img/soft_ico/deletes.png" alt="清除">清空</div></div>\
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
    $('.search_path_views .file_search_input').focus(function () {
      $(document).click(function (event) {
        if (!$(event.target).closest('#search_history').length) {
          if (!$(event.target).is(':input')) {
            $('#search_history').css('display', 'none');
            $(this).unbind('click');
          }
        }
        if($(event.target).hasClass('item_box')){
          var idx = $(event.target).parent().index()
          switch(idx){
            case 0:// 收藏夹
              bt_file.set_favorites_manage()
              break;
            case 1:// 文件分享
              $('.file_nav_view .share_file_list').click()
              break;
            case 2:// 文件同步
              $('.file_nav_view .file_rsync_list').click()
              break;
            case 3:// 企业级防篡改
              $('.file_nav_view .tamper_hover_tips').click()
              break;
            case 4:// 文件内容搜索
              $('.file_nav_view .replace_content').click()
              break;
          }
        }
      });
      $('#search_history').css('display', 'block');
      $('.list_box_body').empty();
      if (that.search_hi.search_history.length > 0) {
        $.each(that.search_hi.search_history, function (index, item) {
          $('.search_path_views #search_history .history_list_box')
            .find('.list_box_body')
            .append(
              '<div class="body_item" style="color:#999;font-size:12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;padding:5px 5px 5px 10px;border-radius:3px" data-name="' +
              item.val +
              '"><span class="history_text">' +
              item.val +
              '</span><div class="delete_single" data-name="' +
              item.val +
              '" style="width:20px;text-align:center"></div></div>'
            );
        });
        $('.search_path_views')
          .find('#search_history')
          .find('.history_list_box')
          .find('.list_box_body')
          .find('.body_item')
          .click(function () {
            $('.search_path_views').find('[placeholder="搜索文件/目录"]').val($(this).data('name'));
            // database_table.$refresh_table_list(true);
          });
        $('.search_path_views')
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
        $('.search_path_views').find('.list_box_body').append('<span style="color:#999;font-size:12px;padding-top:5px;display:block">暂无数据</span>');
      }
      $('.delete_single').click(function (event) {
        event.stopPropagation();
        var names = $(this).data('name');
        var cload = layer.msg('正在删除中...', { icon: 16 });
        bt.confirm({ msg: '是否删除历史记录？', title: '删除历史记录' }, function () {
          bt_tools.send({ url: '/panel/history/remove_search_history', data: { name: 'files', key: 'get_list', val: names } }, function (ress) {
            layer.close(cload);
            layer.msg(ress.msg, { icon: ress.status ? 1 : 2 });
            that.search_hi.search_history = that.search_hi.search_history.filter(function(obj) {
              return obj.val !== names;
            });
          });
        });
      });
    });
    $('#all_delete').click(function () {
      var dload = layer.msg('正在清空中...', { icon: 16 });
      bt.confirm({ msg: '是否清空所有历史记录？', title: '清空历史记录' }, function () {
        bt_tools.send({ url: '/panel/history/clear_search_history', data: { name: 'files', key: 'get_list' } }, function (ress) {
          layer.close(dload);
          layer.msg(ress.msg, { icon: ress.status ? 1 : 2 });
          $('.search_path_views').find('#search_history').find('.history_list_box').find('.list_box_body').empty();
          that.search_hi.search_history = []
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
        $(this).find('.all_img').attr('src', '/static/img/soft_ico/deletes.png');
        $(this).find('.all_img').css('width', '14px');
        $(this).find('.all_img').css('height', '14px');
        $(this).css('background', 'none');
      }
    );
    // 文件路径事件（获取焦点、失去焦点、回车提交）
    $('.file_path_input .path_input').on('focus blur keyup', function (e) {
      e = e || window.event;
      var path = $(this).attr('data-path'),
        _this = $(this);
      switch (e.type) {
        case 'focus':
          $(this).addClass('focus').val(path).prev().hide();
          break;
        case 'blur':
          $(this).removeClass('focus').val('').prev().show();
          break;
        case 'keyup':
          if (e.keyCode != 13 && e.type == 'keyup') return false;
          if ($(this).data('path') != $(this).val()) {
            that.reader_file_list({ path: that.path_check($(this).val()), is_operating: true }, function (res) {
              if (res.status === false) {
                _this.val(path);
              } else {
                _this.val(that.path_check(res.PATH));
                _this.blur().prev().show();
              }
            });
          }
          break;
      }
      e.stopPropagation();
    });
    // 文件路径点击跳转
    $('.file_path_input .file_dir_view').on('click', '.file_dir', function () {
      that.reader_file_list({ path: $(this).attr('title'), is_operating: true });
    });

    // 文件操作前进或后退
    $('.forward_path span').click(function () {
      var index = $(this).index(),
        path = '';
      if (!$(this).hasClass('active')) {
        switch (index) {
          case 0:
            that.file_pointer = that.file_pointer - 1;
            path = that.file_operating[that.file_pointer];
            break;
          case 1:
            that.file_pointer = that.file_pointer + 1;
            path = that.file_operating[that.file_pointer];
            break;
        }
        that.reader_file_list({ path: path, is_operating: false });
      }
    });

    //展示已隐藏的目录
    $('.file_path_input .file_dir_view').on('click', '.file_dir_omit', function (e) {
      var _this = this,
        new_down_list = $(this).children('.nav_down_list');
      $(this).addClass('active');
      new_down_list.addClass('show');
      $(document).one('click', function () {
        $(_this).removeClass('active');
        new_down_list.removeClass('show');
        e.stopPropagation();
      });
      e.stopPropagation();
    });
    //目录获取子级所有文件夹(箭头图标)
    $('.file_path_input .file_dir_view').on('click', '.file_dir_item i', function (e) {
      var children_list = $(this).siblings('.nav_down_list');
      var _path = $(this).siblings('span').attr('title');
      children_list.show().parent().siblings().find('.nav_down_list').removeAttr('style');
      that.render_path_down_list(children_list, _path);
      $(document).one('click', function () {
        children_list.removeAttr('style');
        e.stopPropagation();
      });
      e.stopPropagation();
    });
    //目录子级文件路径跳转（下拉）
    $('.file_path_input .file_dir_view').on('click', '.file_dir_item .nav_down_list li', function (e) {
      that.reader_file_list({ path: $(this).data('path'), is_operating: true });
    });
    // 文件上一层
    $('.file_path_upper').click(function () {
      that.reader_file_list({ path: that.retrun_prev_path(that.file_path), is_operating: true });
    });

    // 文件刷新
    $('.file_path_refresh').click(function () {
      that.reader_file_list({ path: that.file_path }, function (res) {
        if (!res.msg) layer.msg('刷新成功');
      });
    });

    // 上传
    $('.upload_file').on('click', function (e) {
      var path = $('#fileInputPath').attr('data-path');
      uploadFiles.init_upload_path(path);
      uploadFiles.upload_layer();
    });

    // 新建文件夹或文件
    $('.file_nav_view .create_file_or_dir li').on('click', function (e) {
      if ($(this).index() > 1) {
        that.file_groud_event({ open: 'soft_link' });
        return false;
      }
      var type = $(this).data('type'),
        nav_down_list = $('.create_file_or_dir .nav_down_list');
      nav_down_list.css({
        display: function () {
          setTimeout(function () {
            nav_down_list.removeAttr('style');
          }, 100);
          return 'none';
        },
      });
      if (!that.is_editor) {
        that.is_editor = true;
        // 首位创建“新建文件夹、文件”
        $('.file_list_content').prepend(
          '<div class="file_tr createModel active">' +
          '<div class="file_td file_checkbox"></div>' +
          '<div class="file_td file_name">' +
          '<div class="file_ico_type"><i class="file_icon ' +
          (type == 'newBlankDir' ? 'file_folder' : '') +
          '"></i></div>' +
          (bt.get_cookie('rank') == 'icon'
            ? '<span class="file_title file_' +
            (type == 'newBlankDir' ? 'dir' : 'file') +
            '_status"><textarea name="createArea" onfocus="select()">' +
            (type == 'newBlankDir' ? '新建文件夹' : '新建文件') +
            '</textarea></span>'
            : '<span class="file_title file_' +
            (type == 'newBlankDir' ? 'dir' : 'file') +
            '_status"><input name="createArea" value="' +
            (type == 'newBlankDir' ? '新建文件夹' : '新建文件') +
            '" onfocus="select()" type="text"></span>') +
          '</div>' +
          '</div>'
        );

        // 输入增高、回车、焦点、失去焦点
        $((bt.get_cookie('rank') == 'icon' ? 'textarea' : 'input') + '[name=createArea]')
          .on('input', function () {
            if (bt.get_cookie('rank') == 'icon') {
              this.style.height = 'auto';
              this.style.height = this.scrollHeight + 'px';
            }
          })
          .keyup(function (e) {
            if (e.keyCode == 13) $(this).blur();
          })
          .blur(function (e) {
            var _val = $(this)
              .val()
              .replace(/[\r\n]/g, '');
            if (that.match_unqualified_string(_val)) return layer.msg('名称不能含有 /\\:*?"<>|符号', { icon: 2 });
            if (_val == '') _val = type == 'newBlankDir' ? '新建文件夹' : '新建文件';
            setTimeout(function () {
              //延迟处理，防止Li再次触发
              that.create_file_req({ type: type == 'newBlankDir' ? 'folder' : 'file', path: that.file_path + '/' + _val }, function (res) {
                if (res.status) that.reader_file_list({ path: that.file_path });
                layer.msg(res.msg, { icon: res.status ? 1 : 2 });
              });
              $('.createModel').remove(); // 删除模板
              that.is_editor = false;
            }, 300);
            e.preventDefault();
          })
          .focus();
      } else {
        return false;
      }
      e.stopPropagation();
      e.preventDefault();
    });
    // 收藏夹列表跳转
    $('.file_nav_view .favorites_file_path ul').on('click', 'li', function (e) {
      var _href = $(this).data('path'),
        _type = $(this).data('type'),
        nav_down_list = $('.favorites_file_path .nav_down_list');
      if (_type == 'dir') {
        that.reader_file_list({ path: _href, is_operating: true });
      } else {
        if ($(this).data('null') != undefined) return false;
        var _file = $(this).attr('title').split('.'),
          _fileT = _file[_file.length - 1],
          _fileE = fileManage.determine_file_type(_fileT);
        switch (_fileE) {
          case 'text':
            openEditorView(0, _href);
            break;
          case 'video':
            that.open_video_play(_href);
            break;
          case 'images':
            that.open_images_preview({ filename: $(this).attr('title'), path: _href });
            break;
          default:
            that.reader_file_list({ path: that.retrun_prev_path(_href), is_operating: true });
            break;
        }
      }
      //点击隐藏
      nav_down_list.css({
        display: function () {
          setTimeout(function () {
            nav_down_list.removeAttr('style');
          }, 100);
          return 'none';
        },
      });
      e.stopPropagation();
      e.preventDefault();
    });
    // 打开终端
    $('.terminal_view').on('click', function () {
      web_shell(undefined, true);
    });

    // 分享列表
    $('.share_file_list').on('click', function () {
      that.open_share_view();
    });
    // 数据同步
    $('.file_rsync_list').hover(
      function () {
        $(this).find('.new-file-icon').removeClass('new-pro-icon').addClass('new-pro-hover');
      },
      function () {
        $(this).find('.new-file-icon').removeClass('new-pro-hover').addClass('new-pro-icon');
      }
    );
    $('.file_rsync_list').on('click', function () {
      try {
        $.each(that.recomConfig.list, function (index, item) {
          if (item.name == 'rsync') {
            var _title = '',
              _tips = '',
              _status = 0;
            if (!item['isBuy'] || !item['install']) {
              if (item['isBuy'] && !item['install']) {
                _title = '安装';
                _tips = '检测到' + item.title + '功能没有安装，是否立即安装开启使用';
              } else {
                item.description = ['支持多设备', '支持文件同步', '支持异地备份', '支持云存储'];
                item.imgSrc = 'https://www.bt.cn/Public/new/plugin/' + item.name + '/1.png';
                bt.soft.product_pay_view({
                  totalNum: 70,
                  limit: 'ltd',
                  closePro: true,
                  pluginName: '文件同步工具',
                  fun: function () {
                    product_recommend.recommend_product_view(item, { imgArea: ['994px', '535px'] }, 'ltd', 70, item.name, true);
                  },
                });
                return false;
              }
            } else {
              bt.plugin.get_plugin_byhtml(item.name, function (html) {
                layer.open({
                  type: 1,
                  title: '<img style="width: 24px;margin-right: 5px;margin-left: -10px;margin-top: -3px;" src="/static/img/soft_ico/ico-rsync.png">文件同步工具',
                  area: '1000px',
                  content: html,
                });
              });
              return false;
            }
            layer.confirm(_tips, { title: _title + item.title, closeBtn: 2, icon: 3 }, function () {
              bt.soft.install(item['name']);
            });
          }
        });
      } catch (err) {
        console.log(err);
      }
    });
    // 打开文件操作历史记录
    $('.file_history_show').click(function () {
      layer.open({
        title: '文件操作记录',
        area: ['800px', '560px'],
        btn: false,
        closeBtn: 2,
        content: '<div><div id="file_history"></div><ul class="help-info-text c6"><li>清空当前日志可前往"日志->操作日志"中清空</li></ul></div>',
        success: function () {
          //打开弹窗后执行的事件
          bt_tools.table({
            el: '#file_history',
            url: '/files?action=GetFileHistory',
            default: '暂无数据',
            dataVerify: false, //为false可跳过异常处理
            height: '400px',
            dataFilter: function (rdata) {
              return { data: rdata.data }; //处理好数据后返回
            },
            column: [
              {
                fid: 'addtime',
                title: '操作时间',
                width: 160,
              },
              {
                fid: 'log',
                title: '操作日志',
              },
            ],
          });
        },
      });
    });
    // 打开硬盘挂载的目录
    $('.mount_disk_list').on('click', '.nav_btn', function () {
      var path = $(this).data('menu');
      that.reader_file_list({ path: path, is_operating: true });
    });
    // 硬盘磁盘挂载
    $('.mount_disk_list').on('click', '.nav_down_list li', function () {
      var path = $(this).data('disk'),
        disk_list = $('.mount_disk_list.thezoom .nav_down_list');
      disk_list.css({
        display: function () {
          setTimeout(function () {
            disk_list.removeAttr('style');
          }, 100);
          return 'none';
        },
      });
      that.reader_file_list({ path: path, is_operating: true });
    });

    //企业级防篡改
    $('.tamper_core .nav_btn').hover(
      function () {
        $(this).find('.new-file-icon').removeClass('new-ltd-icon').addClass('new-ltd-hover');
      },
      function () {
        $(this).find('.new-file-icon').removeClass('new-ltd-hover').addClass('new-ltd-icon');
      }
    );

    $('.tamper_core .nav_btn').on('click', function () {
      var ltd = bt.get_cookie('ltd_end');
      var name = 'tamper_core';
      bt.send('get_soft_find','plugin/get_soft_find',{sName: name},
        function (rdata) {
          if (ltd < 0) {
            rdata.description = ['保护站点内容安全', '阻止黑客非法修改网页', '阻止网站被挂马', '阻止其他入侵行为'];
            rdata.pluginName = '企业级防篡改';
            rdata.imgSrc = 'https://www.bt.cn/Public/new/plugin/' + rdata.name + '/1.png';
            bt.soft.product_pay_view({
              totalNum: 75,
              limit: 'ltd',
              closePro: true,
              pluginName: '企业级防篡改',
              fun: function () {
                product_recommend.recommend_product_view(rdata, { imgArea: ['1000px', '610px'] }, 'ltd', 75, rdata.name, true);
              },
            });

            // bt.soft.product_pay_view({ totalNum: 51, limit: 'ltd', closePro: true });
            return;
          }
          if (!rdata.setup) {
            bt.soft.install(name);
          } else {
            bt.soft.set_lib_config(name, rdata.title, rdata.version);
          }
        }
      );
    });

    // 回收站
    $('.file_nav_view').on('click', '.recycle_bin', function (ev) {
      fileManage.recycle_bin_view();
      ev.stopPropagation();
      ev.preventDefault();
    });
    // 批量操作
    $('.file_nav_view .multi').on('click', '.nav_btn_group', function (ev) {
      var batch_type = $(this).data('type');
      if (typeof batch_type != 'undefined') that.batch_file_manage(batch_type);
      ev.stopPropagation();
      ev.preventDefault();
    });
    // 批量操作
    $('.file_nav_view .multi').on('click', '.nav_btn_group li', function (ev) {
      var batch_type = $(this).data('type');
      that.batch_file_manage(batch_type);
      ev.stopPropagation();
      ev.preventDefault();
    });
    // 全部粘贴按钮
    $('.file_nav_view').on('click', '.file_all_paste', function () {
      that.paste_file_or_dir();
    });

    // 表头点击事件，触发排序字段和排序方式
    $('.file_list_header').on('click', '.file_name,.file_size,.file_mtime,.file_accept,.file_user', function (e) {
      var _tid = $(this).attr('data-tid'),
        _reverse = $(this).find('.icon_sort').hasClass('active'),
        _search = $('.file_search_input').val(),
        _active = $(this).hasClass('active');
      if (!$(this).find('.icon_sort').hasClass('active') && $(this).hasClass('active')) {
        $(this).find('.icon_sort').addClass('active');
      } else {
        $(this).find('.icon_sort').removeClass('active');
      }
      $(this).addClass('active').siblings().removeClass('active').find('.icon_sort').removeClass('active').empty();
      $(this).find('.icon_sort').html('<i class="iconfont icon-xiala"></i>');
      if (!_active) _reverse = true;
      bt.set_cookie('files_sort', _tid);
      bt.set_cookie('name_reverse', _reverse ? 'True' : 'False');
      that.reader_file_list({ reverse: _reverse ? 'True' : 'False', sort: _tid, search: _search, file_btn: '', });
      $('.file_search_input').val(_search);
      return false;
    });

    // 设置排序显示
    $('.file_list_header .file_th').each(function (index, item) {
      var files_sort = bt.get_cookie('files_sort'),
        name_reverse = bt.get_cookie('name_reverse');
      if ($(this).attr('data-tid') === files_sort) {
        $(this).addClass('active').siblings().removeClass('active').find('.icon_sort').removeClass('active').empty();
        $(this).find('.icon_sort').html('<i class="iconfont icon-xiala"></i>');
        if (name_reverse === 'False') $(this).find('.icon_sort').addClass('active');
      }
    });

    // 全选选中文件
    $('.file_list_header .file_check').on('click', function (e) {
      var checkbox = parseInt($(this).data('checkbox'));
      switch (checkbox) {
        case 0:
          $(this).addClass('active').removeClass('active_2').data('checkbox', 1);
          $('.file_list_content .file_tr').addClass('active').removeClass('active_2');
          $('.nav_group.multi').removeClass('hide');
          $('.file_menu_tips').addClass('hide');
          that.file_table_arry = that.file_list.slice();
          break;
        case 2:
          $(this).addClass('active').removeClass('active_2').data('checkbox', 1);
          $('.file_list_content .file_tr').addClass('active');
          $('.nav_group.multi').removeClass('hide');
          $('.file_menu_tips').addClass('hide');
          that.file_table_arry = that.file_list.slice();
          break;
        case 1:
          $(this).removeClass('active active_2').data('checkbox', 0);
          $('.file_list_content .file_tr').removeClass('active');
          $('.nav_group.multi').addClass('hide');
          $('.file_menu_tips').removeClass('hide');
          that.file_table_arry = [];
          break;
      }
      that.calculate_table_active();
    });
    // 文件勾选
    $('.file_list_content').on('click', '.file_checkbox', function (e) {
      //列表选择
      var _tr = $(this).parents('.file_tr'),
        index = _tr.data('index'),
        filename = _tr.data('filename');
      if (_tr.hasClass('active')) {
        _tr.removeClass('active');
        that.remove_check_file(that.file_table_arry, 'filename', filename);
      } else {
        _tr.addClass('active');
        _tr.attr('data-filename', that.file_list[index]['filename']);
        that.file_table_arry.push(that.file_list[index]);
      }
      that.calculate_table_active();
      e.stopPropagation();
    });

    // 文件列表滚动条事件
    $('.file_list_content').scroll(function (e) {
      if ($(this).scrollTop() == $(this)[0].scrollHeight - $(this)[0].clientHeight) {
        $(this).prev().css('opacity', 1);
        $(this).next().css('opacity', 0);
      } else if ($(this).scrollTop() > 0) {
        $(this).prev().css('opacity', 1);
      } else if ($(this).scrollTop() == 0) {
        $(this).prev().css('opacity', 0);
        $(this).next().css('opacity', 1);
      }
    });

    // 选中文件
    $('.file_table_view .file_list_content').on('click', '.file_tr', function (e) {
      if ($(e.target).hasClass('foo_menu_title') || $(e.target).parents().hasClass('foo_menu_title')) return true;
      // $(this).addClass('active').siblings().removeClass('active');
      // that.file_table_arry = [that.file_list[$(this).data('index')]];
      that.calculate_table_active();
      e.stopPropagation();
      e.preventDefault();
    });

    // 打开文件的分享、收藏状态
    $('.file_table_view .file_list_content').on('click', '.file_name .icon-onchange', function (e) {
      var file_tr = $(this).parents('.file_tr'),
        index = file_tr.data('index'),
        data = that.file_list[index];
      data['index'] = index;
      if ($(this).hasClass('icon-share1')) {
        that.info_file_share(data);
      }
      if ($(this).hasClass('icon-favorites')) {
        that.cancel_file_favorites(data);
      }
      if ($(this).hasClass('topping_file_icon')) {
        that.cancel_file_topping(data);
      }
      e.stopPropagation();
    });

    // 文件解锁/锁定
    $('.file_table_view .file_list_content').on('click', '.file_tamper_core .icon-lock-box', function (e) {
      var ltd = bt.get_cookie('ltd_end');
      //   if(ltd < 0) return bt.soft.product_pay_view({ totalNum: 71, limit: 'ltd', closePro: true });
      //   if(ltd < 0){

      //   }
      var data = $(this).data(),
        path = data.path;
			data.filename = data.filename.toString();
      //查询查询路径生效的方式
      get_effective_path(path);
      function get_effective_path(path) {
        bt.soft.get_soft_find('tamper_core', function (rdata_res) {
          if (ltd < 0) {
            rdata_res.imgSrc = 'https://www.bt.cn/Public/new/plugin/' + rdata_res.name + '/1.png';
            rdata_res.pluginName = '堡塔企业级防篡改';
            rdata_res.description = rdata_res.ex1.split('|');
            if (rdata_res.description.length > 4) {
              for (var i = 0; i < rdata_res.description.length - 4; i++) {
                rdata_res.description.pop();
              }
            }
            that.check_ltd_end(rdata_res, 71, { imgArea: ['1000px', '610px'] });
            // product_recommend.pay_product_sign('ltd',71,'ltd')
            return;
          }
          if (rdata_res.setup && rdata_res.endtime > -1) {
            bt_tools.send({url: '/tamper_core/get_effective_path.json',data: { path: path }}, function (res) {
              if (!res.status) {
                if (res['tip']) {
                  bt.confirm({ title: '提示', msg: '当前' + res.tip + '，是否开启？' }, function (index) {
                    layer.close(index);
                    bt_tools.send(
                      { url: '/tamper_core/modify_global_config.json', data: { key: 'status',value: 1 } },
                      function (rdata) {
                        bt_tools.msg(rdata);
                        if (rdata.status) {
                          setTimeout(function () {
                            get_effective_path(path);
                          }, 2000);
                        }
                      },
                      '启动服务'
                    );
                  });
                } else {
                  if (res.msg.indexOf('get_effective_path') !== -1) {
                    bt_tools.msg({ status: false, msg: '企业级防篡改版本过低，<a href="javascript:;"  class="btlink tamperCoreUpdate">立即升级</a>！' });
                    $('.tamperCoreUpdate')
                      .unbind('click')
                      .click(function () {
                        bt.soft.get_soft_find('tamper_core', function (item) {
                          if (item.versions.length > 1) {
                            for (var i = 0; i < item.versions.length; i++) {
                              var min_version = item.versions[i];
                              var ret = bt.check_version(item.version, min_version.m_version + '.' + min_version.version);
                              if (ret > 0) {
                                if (ret == 2) bt.soft.update_soft(item.name, item.title, min_version.m_version, min_version.version, min_version.update_msg.replace(/\n/g, '_bt_'), item.type);
                                break;
                              }
                            }
                          } else {
                            var min_version = item.versions[0],
                              is_beta = min_version.beta;
                            var cloud_version = min_version.m_version + '.' + min_version.version;
                            if (item.version != cloud_version && is_beta == item.is_beta)
                              bt.soft.update_soft(item.name, item.title, min_version.m_version, min_version.version, min_version.update_msg.replace(/\n/g, '_bt_'), item.type);
                          }
                        });
                      });
                  } else {
                    bt_tools.msg(res);
                  }
                }
              } else {
                var pid = res.data.pid,
                  lock = res.data.lock,
                  action = res.data.action;
                var url = '',
                  exts_table_data = [];
                (is_lock = lock ? '关闭' : '开启'), (boxcontent = ''), (rules_path = ''), (suffix = '');
                if (pid !== 0) {
                  //防篡改存在规则
                  url = 'batch_setting.json';
                } else {
                  //防篡改不存在规则
                  url = 'create_path.json';
                }
                var disposeData;
                if (data.type == 'dir') {
                  disposeData = path.slice(0, 31)
                  if(path.length > disposeData.length) {
                    disposeData = disposeData + '...'
                  }
                  boxcontent = (lock ? '关闭【' +  '<span title=' + path + '>' + disposeData + '</span>' + '/】目录保护后，该目录将恢复所有操作权限' : '开启【' + '<span title=' + path + '>' + disposeData + '</span>' + '/】目录保护后，该目录禁止所有操作权限') + '，是否继续操作？';
                } else {
                  var arr_suffix = data.filename.split('.');
                  suffix = data.filename.indexOf('.') !== -1 ? '.' + arr_suffix[arr_suffix.length - 1] : '';
                  disposeData = (data.filename).slice(0, 31)
                  if((data.filename).length > disposeData.length) {
                    disposeData = disposeData + '...'
                  }
                  boxcontent = (lock ? '关闭【' + '<span title=' + data.filename + '>' + disposeData + '</span>' + '】文件保护后，该文件将恢复所有操作权限' : '开启【' + '<span title=' + data.filename + '>' + disposeData + '</span>' + '】文件保护后，该文件将禁止所有操作权限') + '，是否继续操作？';
                }
                var protection_arr = [],
                  group = [],
                  paramAction = [],
                  form1 = {};
                bt.open({
                  type: 1,
                  title: '【' + disposeData + '】' + is_lock + '保护',
                  area: '500px',
                  closeBtn: 2,
                  btn: ['确定', '取消'],
                  shift: 5,
                  shadeClose: false,
                  content: '<div id="quick_file" style="padding: 20px 20px 20px 30px;"></div>',
                  success: function (layero, index) {
                    var pathArr = data.path.split('/')
                    var parentP = pathArr.length >= 2 ? pathArr[pathArr.length - 2] : ''
                    // console.log(parentP)
                    $.each(action, function (index, item) {
                      switch (item) {
                        case 'open':
                        case 'close':
                          paramAction.push({
                            key: item,
                            values: res.data.rule.path,
                          });
                          break;
                        case 'remove_wd':
                          protection_arr.push({ title: '删除白名单目录', type: item, data: res.data.white_dir });
                          paramAction.push({
                            key: item,
                            values: res.data.white_dir,
                          });
                          break;
                        case 'add_wd':
                          protection_arr.push({ title: '添加白名单目录', type: item, data: path + '/' });
                          paramAction.push({
                            key: item,
                            values: path + '/',
                          });
                          break;
                        case 'add_bf':
													if (res.data.white_files.indexOf(parentP + '/' + data.filename) === -1)
															protection_arr.push({ title: '添加当前文件【' + parentP + '/' + disposeData + '】的保护', type: item + '-2', data: parentP + '/' + disposeData, value: 1 });
                          if (
                            suffix !== '' &&
                            !protection_arr.some(function (a) {
                              return a.type === 'add_bf-1';
                            })
                          )
                            protection_arr.push({ title: '添加所有文件后缀为【' + suffix + '】的保护', type: item + '-1', data: suffix });
                          break;
                        case 'remove_wf':
													protection_arr.push({ title: '添加当前文件【' + parentP + '/' + data.filename + '】的保护', type: item, data: parentP + '/' + data.filename, value: 1 });
                          if (
                            suffix !== '' &&
                            !protection_arr.some(function (a) {
                              return a.type === 'add_bf-1';
                            })
                          )

                            protection_arr.push({ title: '添加所有文件后缀为【' + suffix + '】的保护', type: 'add_bf-1', data: suffix });
                          break;
                        case 'remove_bf':
													if(suffix !== '') protection_arr.push({title:'关闭所有文件后缀为【'+suffix+'】的保护',type: item,data: suffix})
                          break;
                        case 'add_wf':
                          protection_arr.push({
															title: '关闭当前文件【' + parentP + '/' + data.filename + '】的保护',
                            type: res.data.black_exts.indexOf(suffix) !== -1 ? item : 'remove_bf-1',
															data: parentP + '/' + data.filename,
                            value: 1,
                          });
                          if (res.data.black_exts.indexOf(suffix) !== -1) {
                            paramAction.push({
                              key: 'remove_bf',
															values: parentP + '/' + data.filename,
                            });
                          }
                          break;
                      }
                    });
                    if (pid === 0 && data.type !== 'dir') {
											protection_arr.push({ title: '添加当前文件' + parentP + '/' + data.filename + '的保护', type: 'add_bf-2', data: parentP + '/' + data.filename, value: 1 });
                      if (suffix !== '') protection_arr.push({ title: '添加后缀' + suffix + '的保护', type: 'add_bf-1', data: suffix });
                    }
                    protection_arr = protection_arr.sort(function (a, b) {
											return (b.value || 0) - (a.value || 0)
										})
                    $.each(protection_arr, function (index, item) {
                      group.push({
                        type: 'checkbox',
                        style: 'margin-left: 0px;margin-right:10px;',
                        name: item.type,
                        value: item.value ? item.value : 0,
                        title: item.title,
											})
										})
                    bt_tools.form({
                      el: '#quick_file',
                      labelWidth: '0',
                      form: [
                        {
                          label: '<i class="hint-confirm-icon"></i>',
                          display: boxcontent ? true : false,
                          group: {
                            type: 'other',
                            boxcontent: '<div style="font-size: 16px;">' + boxcontent + '</div>',
                          },
                        },
                        {
                          display: data.type == 'dir' ? false : true,
                          class: 'protect_file',
                          group: group,
                        },
                      ],
                    });
                    if (exts_table_data.length) {
                      $('#quick_file').append('<div id="exts_table" class="table"></div>');
                      bt_tools.table({
                        el: '#exts_table',
                        height: '150px',
                        column: [
                          {
                            fid: 'ext',
                            title: '文件后缀名',
                            template: function (item) {
                              return '<span>' + item + '</span>';
                            },
                          },
                        ],
                        data: exts_table_data,
                      });
                    }
                  },
                  yes: function (index, layero) {
                    var params = {},
                      settings = [],
                      exts = [];
                    if (pid !== 0) {
                      params['pid'] = pid;
                    } else {
                      params['path'] = $('input[name="path"]').val();
                    }
                    //文件弹窗参数
                    if (data.type !== 'dir') {
                      $.each(protection_arr, function (index, item) {
                        var checked = $('input[name="' + item.type + '"]').prop('checked');
                        if (checked) {
                          if (pid !== 0) {
                            var exits = settings.filter(function (temp) {
                              return temp.key === item.type.split('-')[0];
                            });
                            if (exits.length) {
                              for (let i = 0; i < settings.length; i++) {
                                if (settings[i].key === item.type.split('-')[0]) {
                                  settings[i].values.push(item.data);
                                }
                              }
                            } else {
                              settings.push({
                                key: item.type.split('-')[0],
                                values: [item.data],
                              });
                            }
                          } else {
                            // console.log(item)
                            exts.push(item.data);
                          }
                        }
                      });
                    }
                    if (pid !== 0) {
                      if (paramAction.length) {
                        $.each(paramAction, function (index, item) {
                          settings.push(item);
                        });
                      }
                    }
                    if (settings.length) {
                      params['settings'] = JSON.stringify(settings);
                    }
                    //不存在规则参数
                    if (pid === 0) {
                      var rules_path = path;
                      // console.log(rules_path);
                      params['path'] = data.type !== 'dir' ? rules_path.replace(data.filename, '') : rules_path;
                      params['exts'] = JSON.stringify(exts);
                    }
                    if (pid !== 0 && data.type !== 'dir' && !settings.length) return layer.msg('最少选中一个');
                    bt_tools.send({ url: '/tamper_core/' + url, data: params }, function (res) {
                      if (res.status) {
                        bt_tools.msg(res);
                        that.reader_file_list({ path: that.file_path, is_operating: true });
                      }
                    });
                    layer.close(index);
                  },
                });
              }
            },{verify: false});
          } else {
            if (!rdata_res.setup && rdata_res.endtime > -1) {
              bt.soft.install('tamper_core');
            } else {
              bt.soft.product_pay_view({ name: rdata_res.title, pid: rdata_res.pid, type: rdata_res.type, plugin: true, renew: '', ps: rdata_res.ps, ex1: rdata_res.ex1, totalNum: 34 });
            }
          }
        });
      }
      e.stopPropagation();
    });

    // 打开文件夹和文件 --- 双击
    $('.file_table_view .file_list_content').on('dblclick', '.file_tr', function (e) {
      var index = $(this).data('index'),
        data = that.file_list[index];
      if (
        $(e.target).hasClass('details_cont') ||
        $(e.target).parents('.details_cont').length > 0 ||
        $(e.target).hasClass('file_check') ||
        $(e.target).parents('.foo_menu').length > 0 ||
        $(e.target).hasClass('set_file_ps') ||
        that.is_editor
      )
        return false;
      if (data.type == 'dir') {
        if (data['filename'] == 'Recycle_bin') return fileManage.recycle_bin_view();
        that.reader_file_list({ path: that.file_path + '/' + data['filename'], is_operating: true });
      } else {
        switch (data.open_type) {
          case 'text':
            openEditorView(0, data.path);
            break;
          case 'video':
            that.open_video_play(data);
            break;
          case 'images':
            that.open_images_preview(data);
            break;
          case 'compress':
            // if (data.ext === 'zip' || data.ext === 'rar' || data.ext === 'gz') {
            //   that.comp_files_preview(data)
            // } else {
            // that.unpack_file_to_path(data)
            // }
            that.unpack_file_to_path(data);
            break;
        }
      }
      e.stopPropagation();
      e.preventDefault();
    });

    // 打开文件夹或文件 --- 文件名单击
    $('.file_table_view .file_list_content').on('click', '.file_title i,.file_ico_type .file_icon', function (e) {
      var file_tr = $(this).parents('.file_tr'),
        index = file_tr.data('index'),
        data = that.file_list[index];
      if (data.type == 'dir') {
        if (data['filename'] == 'Recycle_bin') return fileManage.recycle_bin_view();
        that.reader_file_list({ path: that.file_path + '/' + data['filename'], is_operating: true });
      } else {
        layer.msg(data.open_type == 'compress' ? '双击解压文件' : data.open_type == 'ont_text' ? '该文件类型不支持编辑' : '双击文件编辑');
      }
      e.stopPropagation();
      e.preventDefault();
    });

    // 禁用浏览器右键菜单
    $('.file_list_content').on('contextmenu', function (ev) {
      if ($(ev.target).attr('name') == 'createArea' || $(ev.target).attr('name') == 'rename_file_input') {
        return true;
      } else {
        return false;
      }
    });

    // 禁用菜单右键默认浏览器右键菜单
    $('.selection_right_menu').on('contextmenu', function (ev) {
      return false;
    });

    // 文件夹和文件鼠标右键
    $('.file_list_content').on('mousedown', '.file_tr', function (ev) {
      if (ev.which === 1 && ($(ev.target).hasClass('foo_menu_title') || $(ev.target).parents().hasClass('foo_menu_title'))) {
        ev.stopPropagation();
        ev.preventDefault();
        that.render_file_groud_menu(ev, this);
        $(ev.target).parent().addClass('foo_menu_click');
        $(this).siblings().find('.foo_menu').removeClass('foo_menu_click');
        $(this).addClass('active').siblings().removeClass('active');
      } else if (ev.which === 3 && !that.is_editor) {
        $('.selection_right_menu').show();
        if (that.file_table_arry.length > 1) {
          that.render_files_multi_menu(ev);
        } else {
          that.render_file_groud_menu(ev, this);
          $('.content_right_menu').removeAttr('style');
          $(this).addClass('active').siblings().removeClass('active');
        }
        ev.stopPropagation();
        ev.preventDefault();
      } else {
        return true;
      }
    });

    $(document).click(function () {
      $('.selection_right_menu').hide();
    });

    $(document).mousedown(function (e) {
      if (3 == e.which) {
        $('.selection_right_menu').hide();
      }
    });

    //设置单页显示的数量，默认为100，设置local本地缓存
    $('.filePage').on('change', '.showRow', function () {
      var val = $(this).val();
      bt.set_storage('local', 'showRow', val);
      bt_file.file_page_num = val;
      var search = $('.file_search_input').val();
      var data = { showRow: val, p: 1, is_operating: false, search: search, file_btn: !!search };
      if ($('#search_all').hasClass('active')) {
        data.all = 'True';
      }
      that.reader_file_list(data);
    });

    // 页码跳转
    $('.filePage').on('click', 'div:nth-child(2) a', function (e) {
      var num = $(this)
        .attr('href')
        .match(/p=([0-9]+)$/)[1];
      var search = $('.file_search_input').val();
      var data = { path: that.path, p: num, search: search, file_btn: !!search };
      if ($('#search_all').hasClass('active')) {
        data.all = 'True';
      }
      that.reader_file_list(data);
      e.stopPropagation();
      e.preventDefault();
    });

    // 获取文件夹大小
    $('.file_list_content').on('click', '.folder_size', function (e) {
      var data = that.file_list[$(this).parents('.file_tr').data('index')],
        _this = this;
      that.get_file_size({ path: data.path }, function (res) {
        $(_this).text(bt.format_size(res.size));
      });
      e.stopPropagation();
      e.preventDefault();
    });
    // 获取文件夹大小
    $('.file_list_content').on('click', '.dir_details', function (e) {
      var data = that.file_list[$(this).parents('.file_tr').data('index')],
        _this = this,
        _top_text = '';
      //判断是否安装插件
      bt.soft.get_soft_find('disk_analysis', function (dataRes) {
        if (dataRes.setup && dataRes.endtime > 0) {
          _top_text = false;
          bt_tools.send(
            { url: 'files/size/get_batch_path_size', data: { path_list: JSON.stringify([data.path]), is_refresh: false } },
            function (res) {
              if(!res.status) {
                return bt_tools.msg(res);
              }
              var path_data = res.data;
              // console.log(path_data);
              pub_details({
                path: data.path,
                size: path_data[data.path].type ? path_data[data.path].total_asize : path_data[data.path].asize,
                user: data.user,
                root_level: data.root_level,
                dir_num: path_data[data.path].dir_num,
                file_num: path_data[data.path].file_num,
                mtime: data.mtime,
                ctime: path_data[data.path].ctime,
              });
            },
            { verify: false }
          );
        } else {
          if (dataRes.endtime > 0) _top_text = '安装硬盘分析工具畅享更多信息，<a href="javascript;" class="btlink" onclick="bt.soft.install(\'disk_analysis\',this)">立即安装</a>';
          if (dataRes.endtime < 0) _top_text = '购买硬盘分析工具畅享更多信息，<a href="javascript;" class="btlink">立即购买</a>';
          that.get_file_size({ path: data.path }, function (res) {
            pub_details(
              {
                path: data.path,
                size: res.size,
                user: data.user,
                root_level: data.root_level,
                dir_num: '----------',
                file_num: '----------',
                mtime: data.mtime,
                ctime: '----------',
              },
              _top_text
            );
          });
        }
      });
      function pub_details(details_data, _top_text) {
        var htmlClassName = '';
        $(_this).find('.details_event').text(bt.format_size(details_data.size));
        if (_top_text && _top_text.indexOf('购买') != -1) htmlClassName = 'buyTool';
        var html =
          '<div class="info-title-tips ' +
          (_top_text ? '' : 'hide') +
          ' ' +
          htmlClassName +
          '" style="height:32px;line-height:32px">\
            <p style="display:flex;align-items:center"><i class="layui-layer-ico layui-layer-ico0" style="width: 16px;height: 16px;display: inline-block;margin-right: 8px;vertical-align: middle;background-size: 700%;"></i>' +
          _top_text +
          '</p>\
        </div><div class="details_cont_item ordinary_cout_item"><span>目录详情</span>\
        </div><div class="details_cont_item ordinary_cout_item">\
          <div>目录路径：</div>\
          <div title="' +
          details_data.path +
          '">' +
          details_data.path +
          '</div>\
        </div>\
        <div class="details_cont_item ordinary_cout_item">\
          <div>目录大小：</div>\
          <div>' +
          bt.format_size(details_data.size) +
          '</div>\
        </div>\
        <div class="details_cont_item ">\
          <div style="display:flex;align-items:center;width:102px"><span class="firwall_place_of_attribution"></span>文件夹数量：</div>\
          <div>' +
          details_data.dir_num +
          '</div>\
        </div>\
        <div class="details_cont_item">\
          <div style="display:flex;align-items:center;width:102px"><span class="firwall_place_of_attribution"></span>文件数量：</div>\
          <div>' +
          details_data.file_num +
          '</div>\
        </div>\
        <div class="details_cont_item ordinary_cout_item">\
          <div>权限：</div>\
          <div>' +
          details_data.user +
          '<a class="btlink ml16 authority" href="javascript:;">修改权限</a></div>\
        </div>\
        <div class="details_cont_item ordinary_cout_item">\
          <div>所属用户：</div>\
          <div>' +
          details_data.root_level +
          '</div>\
        </div>\
        <hr>\
        <div class="details_cont_item ordinary_cout_item">\
          <div>最后修改时间：</div>\
          <div>' +
          bt.format_data(details_data.mtime) +
          '</div>\
        </div>\
        <div class="details_cont_item">\
          <div style="display:flex;align-items:center;width:108px"><span class="firwall_place_of_attribution"></span>权限变更时间：</div>\
          <div>' +
          (Number(details_data.ctime) ? bt.format_data(details_data.ctime) : details_data.ctime) +
          '</div>\
        </div>';
        $('.details_cont').hide();
        $(_this).find('.details_content').html(html);
        $(_this)
          .find('.details_cont')
          .css({ top: $(_this).offset().top, 'margin-left': $(_this).find('.details_event').width() + 7 });
        $(_this).find('.details_cont').show();
        $('.buyTool').click(function () {
          var item = {
            name: 'disk_analysis',
            pluginName: '堡塔硬盘分析工具',
            ps: '急速分析磁盘/硬盘占用情况',
            preview: false,
            limit: 'ltd',
            description: ['检测硬盘空间', '占用百分比显示'],
            imgSrc: 'https://www.bt.cn/Public/new/plugin/disk_analysis/1.png',
          };
          bt.soft.product_pay_view({
            totalNum: 140,
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
                140,
                'disk_analysis',
                true
              );
            },
          });
        });
        $(_this)
          .find('.details_content')
          .click(function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
          });
        $(_this)
          .find('.authority')
          .click(function () {
						details_data.filename = details_data.path.split('/').pop();
            that.set_file_authority(details_data);

          });
        $(_this).hover(
          function () {
            if ($(this).parent().find('.details_cont .details_content').html() === '') return;
            $(this)
              .parent()
              .find('.details_cont')
              .css({ top: $(this).offset().top, 'margin-left': $(this).find('.details_event').width() + 7 });
            $(this).parent().find('.details_cont').show();
          },
          function () {
            if ($(this).parent().find('.details_cont .details_content').html() === '') return;
            $(this).parent().find('.details_cont').hide();
          }
        );
      }
      e.stopPropagation();
      e.preventDefault();
    });
    // 获取目录总大小
    $('.filePage').on('click', '#file_all_size', function (e) {
      if (that.file_path === '/') {
        layer.tips('当前目录为系统根目录（/）,执行获取文件大小将占用<span class="bt_danger">大量磁盘IO</span>,将导致服务器运行缓慢。', this, { tips: [1, 'red'], time: 5000 });
        return false;
      }
      that.get_dir_size({ path: that.file_path });
      //deng
      var path_data = '';
      var dataRes = '';
      bt.soft.get_soft_find('disk_analysis', function (resdata) {
        dataRes = resdata;
        if (dataRes.setup && dataRes.endtime > 0) {
          $('.file_list_content .dir_details').each(function () {
            $(this).find('.details_event').html('<img style="width:16px" src="../../static/img/loading.gif" alt="" class="loading_deng">');
          });
          bt_tools.send(
            {
              url: 'files/size/get_dir_path_size',
              data: { path: that.file_path, is_refresh: true },
            },
            function (res) {
              if(!res.status) {
                $('.file_list_content .dir_details').each(function () {
                    $(this).find('.details_event').html('<a class="btlink details_event" href="javascript:;">计算</a><div class="details_cont"><div class="details_content"></div></div>');
                  });
                return bt_tools.msg(res)
              }
              path_data = res.data.list;
              for (var key in path_data) {
                path_data[res.data.full_path + '/' + key] = path_data[key];
              }
              $('.file_list_content .dir_details').each(function () {
                var data = that.file_list[$(this).parents('.file_tr').data('index')],
                  _this = this,
                  _top_text = '';
                //判断是否安装插件
                var _datapath = data.path;
                // function getRelativePath(a, b) {
                //   if (a.startsWith(b)) {
                //     return a.substring(b.length+1);
                //   } else {
                //     return "kong";
                //   }
                // }

                // bt.soft.get_soft_find('disk_analysis',function(dataRes){
                // if(dataRes.setup && dataRes.endtime > 0) {
                _top_text = false;
                var pathData = path_data[data.path];
                pub_details({
                  path: _datapath,
                  size: pathData && pathData.type ? pathData.total_asize : pathData.asize,
                  user: data.user,
                  root_level: data.root_level,
                  dir_num: path_data[data.path].dir_num,
                  file_num: path_data[data.path].file_num,
                  mtime: data.mtime,
                  ctime: path_data[data.path].ctime,
                });
                // }else{
                //if(dataRes.endtime > 0) _top_text = '安装硬盘分析工具畅享更多信息，<a href="javascript;" class="btlink" onclick="bt.soft.install(\'disk_analysis\',this)">立即安装</a>'
                // if(dataRes.endtime < 0) _top_text = '购买硬盘分析工具畅享更多信息，<a href="javascript;" class="btlink">立即购买</a>'
                // that.get_file_size({ path: data.path }, function (res) {
                //   pub_details({
                //     path: data.path,
                //     size: res.size,
                //     user: data.user,
                //     root_level: data.root_level,
                //     dir_num: '----------',
                //     file_num: '----------',
                //     mtime: data.mtime,
                //     ctime: '----------',
                //   },_top_text)
                // })
                // }
                // })
                function pub_details(details_data, _top_text) {
                  var htmlClassName = '';
                  $(_this).find('.details_event').text(bt.format_size(details_data.size));
                  if (_top_text && _top_text.indexOf('购买') != -1) htmlClassName = 'buyTool';
                  var html =
                    '<div class="info-title-tips ' +
                    (_top_text ? '' : 'hide') +
                    ' ' +
                    htmlClassName +
                    '" style="height:32px;line-height:32px">\
                      <p style="display:flex;align-items:center"><i class="layui-layer-ico layui-layer-ico0" style="width: 16px;height: 16px;display: inline-block;margin-right: 8px;vertical-align: middle;background-size: 700%;"></i>' +
                    _top_text +
                    '</p>\
                  </div><div class="details_cont_item ordinary_cout_item"><span>目录详情</span>\
                  </div><div class="details_cont_item ordinary_cout_item">\
                    <div>目录路径：</div>\
                    <div title="' +
                    details_data.path +
                    '">' +
                    details_data.path +
                    '</div>\
                  </div>\
                  <div class="details_cont_item ordinary_cout_item">\
                    <div>目录大小：</div>\
                    <div>' +
                    bt.format_size(details_data.size) +
                    '</div>\
                  </div>\
                  <div class="details_cont_item ">\
                    <div style="display:flex;align-items:center;width:102px"><span class="firwall_place_of_attribution"></span>文件夹数量：</div>\
                    <div>' +
                    details_data.dir_num +
                    '</div>\
                  </div>\
                  <div class="details_cont_item">\
                    <div style="display:flex;align-items:center;width:102px"><span class="firwall_place_of_attribution"></span>文件数量：</div>\
                    <div>' +
                    details_data.file_num +
                    '</div>\
                  </div>\
                  <div class="details_cont_item ordinary_cout_item">\
                    <div>权限：</div>\
                    <div>' +
                    details_data.user +
                    '<a class="btlink ml16 authority" href="javascript:;">修改权限</a></div>\
                  </div>\
                  <div class="details_cont_item ordinary_cout_item">\
                    <div>所属用户：</div>\
                    <div>' +
                    details_data.root_level +
                    '</div>\
                  </div>\
                  <hr>\
                  <div class="details_cont_item ordinary_cout_item">\
                    <div>最后修改时间：</div>\
                    <div>' +
                    bt.format_data(details_data.mtime) +
                    '</div>\
                  </div>\
                  <div class="details_cont_item">\
                    <div style="display:flex;align-items:center;width:108px"><span class="firwall_place_of_attribution"></span>权限变更时间：</div>\
                    <div>' +
                    (Number(details_data.ctime) ? bt.format_data(details_data.ctime) : details_data.ctime) +
                    '</div>\
                  </div>';
                  $('.details_cont').hide();
                  $(_this).find('.details_content').html(html);
                  $(_this)
                    .find('.details_cont')
                    .css({ top: $(_this).offset().top, 'margin-left': $(_this).find('.details_event').width() + 7 });
                  // $(_this).find('.details_cont').show();
                  $('.buyTool').click(function () {
                    var item = {
                      name: 'disk_analysis',
                      pluginName: '堡塔硬盘分析工具',
                      ps: '急速分析磁盘/硬盘占用情况',
                      preview: false,
                      limit: 'ltd',
                      description: ['检测硬盘空间', '占用百分比显示'],
                      imgSrc: 'https://www.bt.cn/Public/new/plugin/disk_analysis/1.png',
                    };
                    product_recommend.recommend_product_view(
                      item,
                      {
                        imgArea: ['783px', '718px'],
                      },
                      'ltd',
                      140,
                      'disk_analysis'
                    );
                  });
                  // $(_this).find('.details_content').click(function (ev) {
                  //   ev.stopPropagation();
                  //   ev.preventDefault();
                  // })
                  $(_this)
                    .find('.authority')
                    .click(function () {
											details_data.filename = details_data.path.split('/').pop();
                      that.set_file_authority(details_data);
                    });
                  $(_this).hover(
                    function () {
                      if ($(this).parent().find('.details_cont .details_content').html() === '') return;
                      $(this)
                        .parent()
                        .find('.details_cont')
                        .css({ top: $(this).offset().top, 'margin-left': $(this).find('.details_event').width() + 7 });
                      $(this).parent().find('.details_cont').show();
                    },
                    function () {
                      if ($(this).parent().find('.details_cont .details_content').html() === '') return;
                      $(this).parent().find('.details_cont').hide();
                    }
                  );
                }
                e.stopPropagation();
                e.preventDefault();
              });
            }, {verify: false}
          );
        }
      });
      // deng end
      // $('.file_list_content .dir_details').each(function(){
      //       var data = that.file_list[$(this).parents('.file_tr').data('index')],
      //       _this = this,_top_text = '';
      //   //判断是否安装插件
      //   // bt.soft.get_soft_find('disk_analysis',function(dataRes){
      //     if(dataRes.setup && dataRes.endtime > 0) {
      //         _top_text = false
      //         pub_details({
      //           path: data.path,
      //           size: path_data[data.path].type ? path_data[data.path].total_asize : path_data[data.path].asize,
      //           user: data.user,
      //           root_level: data.root_level,
      //           dir_num: path_data[data.path].dir_num,
      //           file_num: path_data[data.path].file_num,
      //           mtime: data.mtime,
      //           ctime: path_data[data.path].ctime,
      //         })
      //     }else{
      //       if(dataRes.endtime > 0) _top_text = '安装硬盘分析工具畅享更多信息，<a href="javascript;" class="btlink" onclick="bt.soft.install(\'disk_analysis\',this)">立即安装</a>'
      //       if(dataRes.endtime < 0) _top_text = '购买硬盘分析工具畅享更多信息，<a href="javascript;" class="btlink">立即购买</a>'
      //       that.get_file_size({ path: data.path }, function (res) {
      //         pub_details({
      //           path: data.path,
      //           size: res.size,
      //           user: data.user,
      //           root_level: data.root_level,
      //           dir_num: '----------',
      //           file_num: '----------',
      //           mtime: data.mtime,
      //           ctime: '----------',
      //         },_top_text)
      //       })
      //     }
      //   // })
      //   function pub_details(details_data,_top_text) {
      //       var htmlClassName = ''
      //     $(_this).find('.details_event').text(bt.format_size(details_data.size));
      //     if(_top_text && _top_text.indexOf('购买') != -1) htmlClassName = 'buyTool'
      //     var html = '<div class="info-title-tips '+(_top_text?'':'hide')+' '+htmlClassName+'" style="height:32px;line-height:32px">\
      //         <p style="display:flex;align-items:center"><i class="layui-layer-ico layui-layer-ico0" style="width: 16px;height: 16px;display: inline-block;margin-right: 8px;vertical-align: middle;background-size: 700%;"></i>'+_top_text+'</p>\
      //     </div>\<div class="details_cont_item ordinary_cout_item"><span>目录详情</span>\
      //     </div><div class="details_cont_item ordinary_cout_item">\
      //       <div>目录路径：</div>\
      //       <div title="'+ details_data.path +'">'+ details_data.path +'</div>\
      //     </div>\
      //     <div class="details_cont_item ordinary_cout_item">\
      //       <div>目录大小：</div>\
      //       <div>'+ bt.format_size(details_data.size) +'</div>\
      //     </div>\
      //     <div class="details_cont_item ">\
      //       <div style="display:flex;align-items:center;width:102px"><span class="firwall_place_of_attribution"></span>文件夹数量：</div>\
      //       <div>'+details_data.dir_num+'</div>\
      //     </div>\
      //     <div class="details_cont_item">\
      //       <div style="display:flex;align-items:center;width:102px"><span class="firwall_place_of_attribution"></span>文件数量：</div>\
      //       <div>'+details_data.file_num+'</div>\
      //     </div>\
      //     <div class="details_cont_item ordinary_cout_item">\
      //       <div>权限：</div>\
      //       <div>'+ details_data.user +'<a class="btlink ml16 authority" href="javascript:;">修改权限</a></div>\
      //     </div>\
      //     <div class="details_cont_item ordinary_cout_item">\
      //       <div>所属用户：</div>\
      //       <div>'+ details_data.root_level +'</div>\
      //     </div>\
      //     <hr>\
      //     <div class="details_cont_item ordinary_cout_item">\
      //       <div>最后修改时间：</div>\
      //       <div>'+ bt.format_data(details_data.mtime) +'</div>\
      //     </div>\
      //     <div class="details_cont_item">\
      //       <div style="display:flex;align-items:center;width:108px"><span class="firwall_place_of_attribution"></span>权限变更时间：</div>\
      //       <div>'+ (Number(details_data.ctime) ? bt.format_data(details_data.ctime) : details_data.ctime) +'</div>\
      //     </div>'
      //     $('.details_cont').hide()
      //     $(_this).find('.details_content').html(html)
      //     $(_this).find('.details_cont').css({'top':$(_this).offset().top,'margin-left':$(_this).find('.details_event').width() + 7})
      //     $(_this).find('.details_cont').show();
      //     $('.buyTool').click(function(){
      //         var item = {
      //                     name: 'disk_analysis',
      //                     pluginName: '堡塔硬盘分析工具',
      //                     ps: '急速分析磁盘/硬盘占用情况',
      //                     preview: false,
      //                     limit: 'ltd',
      //                     description:['检测硬盘空间','占用百分比显示'],
      //                     imgSrc:'https://www.bt.cn/Public/new/plugin/disk_analysis/1.png'
      //                   }
      //         product_recommend.recommend_product_view(item, {
      //                 imgArea: ['783px', '718px']
      //               },'ltd',140,'disk_analysis')
      //     })
      //     $(_this).find('.details_content').click(function (ev) {
      //       ev.stopPropagation();
      //       ev.preventDefault();
      //     })
      //     $(_this).find('.authority').click(function () {
      //       that.set_file_authority(details_data);
      //     })
      //     $(_this).hover(function(){
      //       if($(this).parent().find('.details_cont .details_content').html() === '') return;
      //       $(this).parent().find('.details_cont').show();
      //     },function(){
      //       if($(this).parent().find('.details_cont .details_content').html() === '') return;
      //       $(this).parent().find('.details_cont').hide();
      //     })
      //   }
      //   e.stopPropagation();
      //   e.preventDefault();
      // })
    });

    // 文件区域【鼠标按下】
    $('.file_list_content').on('mousedown', function (ev) {
      if (
        $(ev.target).hasClass('file_checkbox') ||
        $(ev.target).hasClass('file_check') ||
        $(ev.target).hasClass('icon-share1') ||
        $(ev.target).hasClass('icon-favorites') ||
        ev.target.localName == 'i' ||
        $(ev.target).parents('.app_menu_group').length > 0 ||
        $(ev.target).hasClass('createModel') ||
        $(ev.target).hasClass('editr_tr') ||
        $(ev.target).attr('name') == 'createArea' ||
        $(ev.target).attr('name') == 'rename_file_input' ||
        $(ev.target).hasClass('set_file_ps') ||
        that.is_editor
      ) {
        return true;
      }
      if (ev.which == 3 && !that.is_editor) {
        ev.stopPropagation();
        ev.preventDefault();
        $('.selection_right_menu').removeAttr('style');
        that.render_file_all_menu(ev, this);
        return true;
      }
      //是否为右键
      $('.file_list_content').bind('mousewheel', function () {
        return false;
      }); //禁止滚轮(鼠标抬起时解绑)
      var container = $(this), //当前选区容器
        scroll_h = 0,
        con_t = container.offset().top, //选区偏移上
        con_l = container.offset().left; //选区偏移左
      var startPos = {
        //初始位置
        top: ev.clientY - $(this).offset().top,
        left: ev.clientX - $(this).offset().left,
      };

      // 鼠标按下后拖动
      bt_file.window_mousemove = function (ev) {
        // 鼠标按下后移动到的位置
        var endPos = {
          top: ev.clientY - con_t > 0 && ev.clientY - con_t < container.height() ? ev.clientY - con_t : ev.clientY - (con_t + container.height()) > 1 ? container.height() : 0,
          left: ev.clientX - con_l > 0 && ev.clientX - con_l < container.width() ? ev.clientX - con_l : ev.clientX - (con_l + container.width()) > 1 ? container.width() : 0,
        };
        var fixedPoint = {
          // 设置定点
          top: endPos.top > startPos.top ? startPos.top : endPos.top,
          left: endPos.left > startPos.left ? startPos.left : endPos.left,
        };

        var enter_files_box = that.enter_files_box();
        if (bt.get_cookie('rank') == 'list') {
          //在列表模式下减去表头高度
          fixedPoint.top = fixedPoint.top + 40;
        }
        // 拖拽范围的宽高
        var w = Math.min(Math.abs(endPos.left - startPos.left), con_l + container.width() - fixedPoint.left);
        var h = Math.min(Math.abs(endPos.top - startPos.top), con_t + container.height() - fixedPoint.top);

        // 超出选区上时
        if (ev.clientY - con_t < 0) {
          var beyond_t = Math.abs(ev.clientY - con_t);
          container.scrollTop(container.scrollTop() - beyond_t);
          if (container.scrollTop() != 0) {
            scroll_h += beyond_t;
          }
          h = h + scroll_h;
        }
        // 超出选区下时
        if (ev.clientY - (con_t + container.height()) > 1) {
          var beyond_b = ev.clientY - (con_t + container.height());
          container.scrollTop(container.scrollTop() + beyond_b);
          if (container[0].scrollHeight - container[0].scrollTop !== container[0].clientHeight) {
            scroll_h += beyond_b;
          }
          h = h + scroll_h;
          fixedPoint.top = fixedPoint.top - scroll_h;
        }
        if (startPos.top == endPos.top || startPos.left == endPos.left) return true;
        // if(Math.abs(startPos.top - endPos.top) <= 5 || Math.abs(startPos.left == endPos.left) <= 5) return true;
        // 设置拖拽盒子位置
        enter_files_box.show().css({
          left: fixedPoint.left + 'px',
          top: fixedPoint.top + 'px',
          width: w + 'px',
          height: h + 'px',
        });

        var box_offset_top = enter_files_box.offset().top;
        var box_offset_left = enter_files_box.offset().left;
        var box_offset_w = enter_files_box.offset().left + enter_files_box.width();
        var box_offset_h = enter_files_box.offset().top + enter_files_box.height();
        $(container)
          .find('.file_tr')
          .each(function (i, item) {
            var offset_top = $(item).offset().top;
            var offset_left = $(item).offset().left;
            var offset_h = $(item).offset().top + $(item).height();
            var offset_w = $(item).offset().left + $(item).width();
            if (bt.get_cookie('rank') == 'icon') {
              // 为Icon模式时
              if (offset_w >= box_offset_left && offset_left <= box_offset_w && offset_h >= box_offset_top && offset_top <= box_offset_h) {
                $(item).addClass('active');
              } else {
                $(item).removeClass('active');
              }
            } else {
              // 为List模式时
              if (offset_w >= box_offset_left && offset_h >= box_offset_top && offset_top <= box_offset_h) {
                $(item).addClass('active');
              } else {
                $(item).removeClass('active');
              }
            }
          });
      };

      // 鼠标抬起
      bt_file.window_mouseup = function (ev) {
        var _move_array = [],
          enter_files_box = that.enter_files_box();
        var box_offset_top = enter_files_box.offset().top;
        var box_offset_left = enter_files_box.offset().left;
        var box_offset_w = enter_files_box.offset().left + enter_files_box.width();
        var box_offset_h = enter_files_box.offset().top + enter_files_box.height();
        if (box_offset_top && box_offset_left && box_offset_w && box_offset_h) {
          $(container)
            .find('.file_tr')
            .each(function (i, item) {
              var offset_top = $(item).offset().top;
              var offset_left = $(item).offset().left;
              var offset_h = $(item).offset().top + $(item).height();
              var offset_w = $(item).offset().left + $(item).width();
              if (bt.get_cookie('rank') == 'icon') {
                // 为Icon模式时
                if (offset_w >= box_offset_left && offset_left <= box_offset_w && offset_h >= box_offset_top && offset_top <= box_offset_h) {
                  _move_array.push($(item).data('index'));
                }
              } else {
                // 为List模式时
                if (offset_w >= box_offset_left && offset_h >= box_offset_top && offset_top <= box_offset_h) {
                  _move_array.push($(item).data('index'));
                }
              }
            });
          that.render_file_selected(_move_array); //渲染数据
        }
        enter_files_box.remove(); // 删除盒子
        $('.file_list_content').unbind('mousewheel'); //解绑滚轮事件
        $(document).unbind('mousemove', bt_file.window_mousemove);
      };
      $(document).one('mouseup', bt_file.window_mouseup);
      $(document).on('mousemove', bt_file.window_mousemove);
      $(document).one('mouseleave', bt_file.window_mouseup);
      ev.stopPropagation();
      ev.preventDefault();
    });
    // 备注设置
    $('.file_list_content').on('blur', '.set_file_ps', function (ev) {
      var tr_index = $(this).parents('.file_tr').data('index'),
        item = that.file_list[tr_index],
        nval = $(this).val(),
        oval = $(this).data('value'),
        _this = this;
      if (nval == oval) return false;
      if (/(\<|\>|\"|\&|\;)/g.test(nval)) {
        layer.msg('备注不能含有 <>"&;符号', { icon: 0 });
        nval = nval.replaceAll(/(\<|\>|\"|\&|\;)/g, '');
      }
      bt_tools.send(
        'files/set_file_ps',
        { filename: item.path, ps_type: 0, ps_body: nval },
        function (rdata) {
          $(_this).data('value', nval);
        },
        { tips: '设置文件/目录备注', tips: true }
      );
    });
    // 备注回车事件
    $('.file_list_content').on('keyup', '.set_file_ps', function (ev) {
      if (ev.keyCode == 13) {
        $(this).blur();
      }
      ev.stopPropagation();
    });
    // 表头拉伸
    $('.file_list_header').on('mousedown', '.file_width_resize', function (ev) {
      return false;
      if (ev.which == 3) return false;
      var th = $(this),
        Minus_v = $(this).prev().offset().left,
        _header = $('.file_list_header').innerWidth(),
        maxlen = 0;
      maxlen = _header - $('.file_main_title').data;
      $(document)
        .unbind('mousemove')
        .mousemove(function (ev) {
          var thatPos = ev.clientX - Minus_v;
          that.set_style_width(th.prev().data('tid'), thatPos);
        });
      $(document).one('mouseup', th, function (ev) {
        $(document).unbind('mousemove');
      });
      ev.stopPropagation();
      ev.preventDefault();
    });
    // 视图调整
    $('.cut_view_model').on('click', function () {
      var type = $(this).data('type');
      $('.file_table_view')
        .addClass(type === 'icon' ? 'icon_view' : 'list_view')
        .removeClass(type !== 'icon' ? 'icon_view' : 'list_view')
        .scrollLeft(0);
      bt.set_cookie('rank', type);
      $(this).addClass('active').siblings().removeClass('active');
      if ($('a.btlink.joinFile').length > 0) {
        $('a.btlink.joinFile').css('bottom', bt.get_cookie('rank') == 'icon' ? '-10px' : '');
      }

      // that.reader_file_list_content(that.file_list);
      // that.set_file_table_width();
    });

    //老版快捷操作
    $('.file_list_content').on('click', '.set_operation_group a', function (ev) {
      ev.stopPropagation();
      ev.preventDefault();
      var data = $(this).parents('.file_tr').data(),
        type = $(this).data('type'),
        item = that.file_list[data.index];
      if (type == 'more') return true;
      item.open = type;
      item.index = data.index;
      item.type_tips = item.type == 'file' ? '文件' : '目录';
      that.file_groud_event(item);
    });
    // 文件搜索
    $('.replace_content').on('click', function () {
      that.replace_content_view();
    });
    // 合并文件事件绑定
    $('.file_list_content').on('click', '.joinFile', function (e) {
      e.stopPropagation();
      e.preventDefault();
      var data = $(this).parents('.file_tr').data(),
        item = that.file_list[data.index];
      that.join_file(item);
    });
  },

  // 上传文件
  file_drop: function () {
    var path = $('#fileInputPath').attr('data-path');
    uploadFiles.init_upload_path(path);
    uploadFiles.upload_layer();
  },
  /**
   * @descripttion: 文件拖拽范围
   * @author: Lifu
   * @return: 拖拽元素
   */
  enter_files_box: function () {
    if ($('#web_mouseDrag').length === 0) {
      $('<div></div>', {
        id: 'web_mouseDrag',
        style: ['position:absolute; top:0; left:0;', 'border:1px solid #072246; background-color: #cce8ff;', 'filter:Alpha(Opacity=15); opacity:0.15;', 'overflow:hidden;display:none;z-index:9;'].join(
          ''
        ),
      }).appendTo('.file_table_view');
    }
    return $('#web_mouseDrag');
  },
  /**
   * @description 清除表格选中数据和样式
   * @returns void
   */
  clear_table_active: function () {
    this.file_table_arry = [];
    $('.file_list_header .file_check').removeClass('active active_2');
    $('.file_list_content .file_tr').removeClass('active app_menu_operation');
    $('.file_list_content .file_tr .file_ps .foo_menu').removeClass('foo_menu_click');
    $('.app_menu_group').remove();
  },
  /**
   * @description 计算表格中选中
   * @returns void
   */
  calculate_table_active: function () {
    var that = this,
      header_check = $('.file_list_header .file_check');
    //判断数量
    if (this.file_table_arry.length == 0) {
      header_check.removeClass('active active_2').data('checkbox', 0);
    } else if (this.file_table_arry.length == this.file_list.length) {
      header_check.addClass('active').removeClass('active_2').data('checkbox', 1);
    } else {
      header_check.addClass('active_2').removeClass('active').data('checkbox', 2);
    }
    //数量大于0开启键盘事件
    if (this.file_table_arry.length > 0) {
      // 获取窗口焦点 防止首次keydown事件失效
      window.focus()
      $(document)
        .unbind('keydown')
        .on('keydown', function (e) {
          var keyCode = e.keyCode,
            tagName = e.target.localName.toLowerCase(),
            is_mac = window.navigator.userAgent.indexOf('Mac') > -1;
          if (tagName == 'input' || tagName == 'textarea') return true;
          // Ctrl + c   复制事件
          if (e.ctrlKey && keyCode == 67) {
            if (that.file_table_arry.length == 1) {
              that.file_groud_event($.extend(that.file_table_arry[0], { open: 'copy' }));
              $('.file_all_paste').removeClass('hide');
            } else if (that.file_table_arry.length > 1) {
              that.batch_file_manage('copy'); //批量
            }
          }
          // Ctrl + x   剪切事件
          if (e.ctrlKey && keyCode == 88) {
            if (that.file_table_arry.length == 1) {
              that.file_groud_event($.extend(that.file_table_arry[0], { open: 'shear' }));
              $('.file_all_paste').removeClass('hide');
            } else if (that.file_table_arry.length > 1) {
              that.batch_file_manage('shear'); //批量
            }
          }
        });
      //数量超过一个显示批量操作
      if (this.file_table_arry.length > 1) {
        $('.nav_group.multi').removeClass('hide');
        $('.file_menu_tips').addClass('hide');
      } else {
        $('.nav_group.multi').addClass('hide');
        $('.file_menu_tips').removeClass('hide');
      }
    } else {
      $('.nav_group.multi').addClass('hide');
      $('.file_menu_tips.multi').removeClass('hide');
      $(document).unbind('keydown');
    }
    $('.selection_right_menu,.file_path_input .file_dir_item .nav_down_list').removeAttr('style'); // 删除右键样式、路径下拉样式
    that.set_menu_line_view_resize();
  },
  /**
   * @description 设置文件路径视图自动调整
   * @returns void
   */
  set_dir_view_resize: function () {
    var file_path_input = $('.file_path_input'),
      file_dir_view = $('.file_path_input .file_dir_view'),
      _path_width = file_dir_view.attr('data-width'),
      file_item_hide = null;
    if (_path_width) {
      parseInt(_path_width);
    } else {
      _path_width = file_dir_view.width();
      file_dir_view.attr('data-width', _path_width);
    }
    if (file_dir_view.width() - _path_width < 90) {
      var width = 0;
      $($('.file_path_input .file_dir_view .file_dir_item').toArray().reverse()).each(function () {
        var item_width = 0;
        if (!$(this).attr('data-width')) {
          $(this).attr('data-width', $(this).width());
          item_width = $(this).width();
        } else {
          item_width = parseInt($(this).attr('data-width'));
        }
        width += item_width;
        if (file_path_input.width() - width <= 90) {
          $(this).addClass('hide');
        } else {
          $(this).removeClass('hide');
        }
      });
    }
    var file_item_hide = file_dir_view.children('.file_dir_item.hide').clone(true);
    if (file_dir_view.children('.file_dir_item.hide').length == 0) {
      file_path_input.removeClass('active').find('.file_dir_omit').addClass('hide');
    } else {
      file_item_hide.each(function () {
        if ($(this).find('.glyphicon-hdd').length == 0) {
          $(this).find('.file_dir').before('<span class="file_dir_icon"></span>');
        }
      });
      file_path_input.addClass('active').find('.file_dir_omit').removeClass('hide');
      file_path_input.find('.file_dir_omit .nav_down_list').empty().append(file_item_hide);
      file_path_input.find('.file_dir_omit .nav_down_list .file_dir_item').removeClass('hide');
    }
  },
  /**
   * @descripttion 设置菜单栏视图自动调整
   * @return: 无返回值
   */
  set_menu_line_view_resize: function () {
    var pathBoxWidth = $('.file_path_views').width(),
      missingWidth = 35, // 因margin计算不到的宽度和提前减去的宽度
      tipsBox = $('.file_menu_tips'), // 提示信息
      disk_list_width = 0,
      batch_list_width = 0,
      _width = 0,
      disk_list = $('.mount_disk_list'),
      batch_list = $('.nav_group.multi');
    if (!disk_list.attr('data-width')) disk_list.attr('data-width', disk_list.innerWidth());
    if (!batch_list.attr('data-width') && batch_list.innerWidth() != 0 && batch_list.innerWidth() != -1) {
      batch_list.attr('data-width', batch_list.innerWidth());
    }
    disk_list_width = parseInt(disk_list.attr('data-width'));
    batch_list_width = parseInt(batch_list.attr('data-width') | 0);

    // 当前页面宽度小于1660时，缩小所有按钮内边距
    if (this.area[0] < 1660) {
      $('.nav_group .nav_btn,.disk_title_group_btn').css({ 'padding-left': '4px', 'padding-right': '4px' });
      $('.cosfs_downup_list .nav_btn_title').text('腾讯云COSFS');
    } else {
      $('.nav_group .nav_btn,.disk_title_group_btn').removeAttr('style');
      $('.cosfs_downup_list .nav_btn_title').text('腾讯云COSFS挂载工具');
    }

    //排除磁盘、批量操作的宽度
    $('.file_nav_view .nav_group')
      .not('.mount_disk_list,.nav_group.multi')
      .each(function () {
        _width += $(this).innerWidth();
      });

    // 磁盘挂载容纳位置压缩
    if (pathBoxWidth - _width - missingWidth < disk_list_width + batch_list_width) {
      $('.nav_group.mount_disk_list').addClass('thezoom').find('.disk_title_group_btn').removeClass('hide');
    } else {
      $('.nav_group.mount_disk_list').removeClass('thezoom');
    }

    // 磁盘挂载宽度加入总宽度
    _width += $('.nav_group.mount_disk_list').width();

    // 处于批量选中状态--->批量按钮处理
    if ($('.file_list_content .file_tr.active').length > 1) {
      var surplusWdith = pathBoxWidth - (_width + missingWidth), // 剩余空间(宽度少了按钮加上的外边距)
        batchNumber = Math.floor(surplusWdith / 68); // 可以容纳的批量操作个数
      // 批量操作宽度小于剩余空间
      if (surplusWdith < batch_list_width) {
        // 隐藏所有批量按钮、显示可容纳的数量
        $('.batch_group_list>.nav_btn_group').hide();
        $('.batch_group_list>.nav_btn_group')
          .slice(0, batchNumber - 1)
          .show();
        $('.batch_group_list>.nav_btn_group:last-child').removeClass('hide').show();
      } else {
        $('.batch_group_list>.nav_btn_group').css('display', 'inline-block');
        $('.batch_group_list>.nav_btn_group:last-child').addClass('hide');
      }
    }

    // 空间完全足够的情况下展示提示
    if (pathBoxWidth - _width - missingWidth - 128 > 128 && $('.file_list_content .file_tr.active').length <= 1 && !$('.mount_disk_list').hasClass('thezoom')) {
      tipsBox.removeClass('hide');
    } else {
      tipsBox.addClass('hide');
    }
  },
  /**
   * @description 设置文件前进或后退状态
   * @returns void
   */
  set_file_forward: function () {
    var that = this,
      forward_path = $('.forward_path span');
    if (that.file_operating.length == 1) {
      forward_path.addClass('active');
    } else if (that.file_pointer == that.file_operating.length - 1) {
      forward_path.eq(0).removeClass('active');
      forward_path.eq(1).addClass('active');
    } else if (that.file_pointer == 0) {
      forward_path.eq(0).addClass('active');
      forward_path.eq(1).removeClass('active');
    } else {
      forward_path.removeClass('active');
    }
  },
  /**
   * @description 设置文件视图
   * @returns void
   */
  set_file_view: function () {
    var file_list_content = $('.file_list_content'),
      height = this.area[1] - $('.file_table_view')[0].offsetTop - 170;
    $('.file_bodys').height(this.area[1] - 100);
    if (this.file_list.length * 40 > height) {
      file_list_content.attr('data-height', file_list_content.data('height') || file_list_content.height()).css({ overflow: 'hidden', 'overflow-y': 'auto', height: height + 'px' });
      $('.file_shadow_bottom').css('opacity', 1);
    } else {
      file_list_content.css({ overflow: 'hidden', 'overflow-y': 'auto', height: height + 'px' });
      $('.file_shadow_top,.file_shadow_bottom').css('opacity', 0);
    }
  },
  /**
   * @description 打开分享列表
   * @returns void
   */
  open_share_view: function () {
    var that = this;
    layer.open({
      type: 1,
      shift: 5,
      closeBtn: 2,
      area: ['850px', '580px'],
      title: '分享列表',
      content:
        '<div class="divtable mtb10 download_table" style="padding:5px 10px;">\
                    <table class="table table-hover" id="download_url">\
                        <thead><tr><th width="230px">分享名称</th><th width="300px">文件地址</th><th>过期时间</th><th style="text-align:right;width:120px;">操作</th></tr></thead>\
                        <tbody class="download_url_list"></tbody>\
                    </table>\
                    <div class="page download_url_page"></div>\
            </div>',
      success: function () {
        that.render_share_list();

        // 分享列表详情操作
        $('.download_url_list').on('click', '.info_down', function () {
          var indexs = $(this).attr('data-index');
          that.file_share_view(that.file_share_list[indexs], 'list');
        });

        // 分页
        $('.download_table .download_url_page').on('click', 'a', function (e) {
          var _href = $(this)
            .attr('href')
            .match(/p=([0-9]+)$/)[1];
          that.render_share_list({ p: _href });
          e.stopPropagation();
          e.preventDefault();
        });
      },
    });
  },
  /**
   * @description 渲染分享列表
   * @param {Number} page 分页
   * @returns void
   */
  render_share_list: function (param) {
    var that = this,
      _list = '';
    if (typeof param == 'undefined') param = { p: 1 };
    bt_tools.send(
      'files/get_download_url_list',
      param,
      function (res) {
        that.file_share_list = res.data;
        if (res.data.length > 0) {
          $.each(res.data, function (index, item) {
            _list +=
              '<tr>' +
              '<td><span style="width:230px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: inline-block;" title="' +
              item.ps +
              '">' +
              item.ps +
              '</span></td>' +
              '<td><span style="width:300px;white-space: nowrap;overflow:hidden;text-overflow: ellipsis;display: inline-block;" title="' +
              item.filename +
              '">' +
              item.filename +
              '</span></td>' +
              '<td><span>' +
              item.expire+
              '</span></td>' +
              '<td style="text-align:right;">' +
              '<a href="javascript:;" class="btlink info_down" data-id="' +
              item.id +
              '" data-index="' +
              index +
              '">详情</a>&nbsp;|&nbsp;' +
              '<a href="javascript:;" class="btlink del_down" data-id="' +
              item.id +
              '" data-index="' +
              index +
              '" data-ps="' +
              item.ps +
              '">关闭</a>' +
              '</td></tr>';
          });
        } else {
          _list = '<tr><td colspan="4">暂无分享数据</td></tr>';
        }
        $('.download_url_list').html(_list);
        $('.download_url_page').html(res.page);
        // 删除操作
        $('.download_table').on('click', '.del_down', function () {
          var id = $(this).attr('data-id'),
            _ps = $(this).attr('data-ps');
          that.remove_download_url({ id: id, fileName: _ps }, function (res) {
            if (res.status) {
              that.render_share_list(param);
              that.reader_file_list({ path: that.file_path });
            }
            layer.msg(res.msg, { icon: res.status ? 1 : 2 });
          });
        });
      },
      '获取分享列表'
    );
  },

  /**
   * @description 删除选中数据
   * @param {Array} arry
   * @param {*} value
   * @return void
   */
  remove_check_file: function (arry, key, value) {
    var len = arry.length;
    while (len--) {
      if (arry[len][key] == value) arry.splice(len, 1);
    }
  },

  /**
   * @description 打开文件下载视图
   * @return void
   */
  open_download_view: function () {
    var that = this;
    that.reader_form_line(
      {
        url: 'DownloadFile',
        beforeSend: function (data) {
          return { url: data.url, path: data.path, filename: data.filename };
        },
        overall: { width: '310px' },
        data: [
          {
            label: 'URL地址:',
            name: 'url',
            placeholder: 'URL地址',
            value: 'http://',
            eventType: ['input', 'focus'],
            input: function () {
              var value = $(this).val(),
                url_list = value.split('/');
              $('[name="filename"]').val(url_list[url_list.length - 1]);
            },
          },
          { label: '下载到:', name: 'path', placeholder: '下载到', value: that.file_path },
          {
            label: '文件名:',
            name: 'filename',
            placeholder: '保存文件名',
            value: '',
            eventType: 'enter',
            enter: function () {
              $('.download_file_view .layui-layer-btn0').click();
            },
          },
        ],
      },
      function (form, html) {
        var loadT = bt.open({
          type: 1,
          title: '下载文件',
          area: '500px',
          shadeClose: false,
          skin: 'download_file_view',
          content: html[0].outerHTML,
          btn: ['确认', '关闭'],
          success: function () {
            form.setEvent();
          },
          yes: function (indexo, layero) {
            var ress = form.getVal();
            if (!bt.check_url(ress.url)) {
              layer.msg('请输入有效的url地址', { icon: 2 });
              return false;
            }
            if (ress.filename == '') {
              layer.msg('请输入文件名', { icon: 2 });
              return false;
            }
            var _val = ress.filename.replace(/[\r\n]/g, '');
            if (that.match_unqualified_string(_val)) {
              layer.msg('名称不能含有 /\\:*?"<>|符号', { icon: 2 });
              return false;
            }
            form.submitForm(function (res) {
              that.render_present_task_list();
              layer.msg(res.msg, { icon: res.status ? 1 : 2 });
              loadT.close();
            }, '正在下载文件，请稍候...');
          },
        });
      }
    );
  },

  /**
   * @description 设置样式文件
   * @param {String} type 表头类型
   * @param {Number} width 宽度
   * @return void
   */
  set_style_width: function (type, width) {
    var _content = bt.get_cookie('formHeader') || $('#file_list_info').html(),
      _html = '',
      _reg = new RegExp('\\.file_' + type + '\\s?\\{width\\s?\\:\\s?(\\w+)\\s\\!important;\\}', 'g'),
      _defined_config = { name: 150, type: 80, size: 80, mtime: 150, accept: 80, user: 80, ps: 150 };
    _html = _content.replace(_reg, function (match, $1, $2, $3) {
      return '.file_' + type + '{width:' + (width < 80 ? _defined_config[type] + 'px' : width + 'px') + ' !important;}';
    });
    $('#file_list_info').html(_html);
  },

  /**
   * @description 设置文件表格
   * @return void
   */
  set_file_table_width: function () {
    var that = this,
      file_header_width = $('.file_table_view')[0].offsetWidth,
      auto_num = 0,
      width = 0,
      auto_all_width = 0,
      css = '',
      _width = 0,
      tr_heigth = 40,
      other = '',
      config = {};
    if(!this.is_mobile) {
      var isWi = $(window).width() <= 1440;
      this.file_header.file_operation = isWi ? 80 : 450;
      if(isWi) {
        $('[data-type=more]').prevAll().hide();
      }else {
        $('[data-type=more]').prevAll().show();
      }
    }
    $.each(this.file_header, function (key, item) {
      var arr = that.cache_set_column.filter(function (it) {
        return it.type === key;
      });
      if (arr.length && arr[0].value) {
        if (item == 'auto') {
          auto_num++;
          config[key] = 0;
        } else {
          width += item;
          css += '.' + key + '{width:' + (key != 'file_operation' ? item : item - 16) + 'px !important;}';
        }
      }
    });
    if (this.is_mobile) $('.file_operation.file_th').attr('style', 'margin-right:-10px !important;');
    if (this.file_list.length * tr_heigth > $('.file_list_content').height()) {
      config['file_tr'] = file_header_width - this.scroll_width;
      file_header_width = file_header_width;
      other += '.file_td.file_operation{width:' + (this.file_header['file_operation'] - this.scroll_width) + 'px !important;}';
      other += '.file_th.file_operation{padding-right:' + (10 + this.scroll_width) + 'px !important}';
    } else {
      file_header_width = file_header_width;
      config['file_tr'] = file_header_width;
      if (this.is_mobile) other += '.file_td.file_operation{width:' + this.file_header['file_operation'] + 'px !important;}';
    }
    config['file_list_header'] = file_header_width;
    auto_all_width = file_header_width - width;
    _width = auto_all_width / auto_num - 16; // 减去左右两侧内边距
    $.each(config, function (key, item) {
      css += '.file_bodys .' + key + '{width:' + (item == 0 ? _width : item) + 'px !important;}';
    });
    // var fileListInfo = $('#file_list_info').html()
    $('#file_list_info').html(css + other);
  },

  /**
   * @description 渲染路径列表
   * @param {Function} callback 回调函数
   * @return void
   */
  render_path_list: function (callback) {
    var that = this,
      html = '<div class="file_dir_omit hide" title="展开已隐藏的目录"><span></span><i class="iconfont icon-zhixiang-zuo"></i><div class="nav_down_list"></div></div>',
      path_before = '',
      dir_list = this.file_path.split('/').splice(1),
      first_dir = this.file_path.split('/')[0];
    if (bt.os === 'Windows') {
      if (dir_list.length == 0) dir_list = [];
      dir_list.unshift('<span class="glyphicon glyphicon-hdd"></span><span class="ml5">本地磁盘(' + first_dir + ')</span>');
    } else {
      if (this.file_path == '/') dir_list = [];
      dir_list.unshift('根目录');
    }
    for (var i = 0; i < dir_list.length; i++) {
      path_before += '/' + dir_list[i];
      if (i == 0) path_before = '/';
      html +=
        '<div class="file_dir_item">\
        <span class="file_dir" title="' +
        path_before.replace('//', '/') +
        '">' +
        dir_list[i] +
        '</span>\
        <i class="iconfont icon-arrow-right"></i>\
        <ul class="nav_down_list">\
            <li data-path="*"><span>加载中</span></li>\
        </ul>\
      </div>';
    }
    $('.path_input').val('').attr('data-path', this.file_path);
    var file_dir_view = $('.file_path_input .file_dir_view');
    file_dir_view.html(html);
    file_dir_view.attr('data-width', file_dir_view.width());
    that.set_dir_view_resize.delay(that, 100);
  },

  /**
   * @description 渲染路径下拉列表
   * @param {Object} el Dom选择器
   * @param {String} path 路径
   * @param {Function} callback 回调函数
   */
  render_path_down_list: function (el, path, callback) {
    var that = this,
      _html = '',
      next_path = $(el).parent().next().find('.file_dir').attr('title');
    this.get_dir_list(
      {
        path: path,
      },
      function (res) {
        that.search_hi = res
        $.each(that.data_reconstruction(res.DIR), function (index, item) {
          var _path = (path != '/' ? path : '') + '/' + item.filename;
          _html +=
            '<li data-path="' +
            _path +
            '" title="' +
            _path +
            '" class="' +
            (_path === next_path ? 'active' : '') +
            '"><i class="file_menu_icon newly_file_icon"></i><span>' +
            item.filename +
            '</span></li>';
        });
        $(el).html(_html);
      }
    );
  },

  /**
   * @description 渲染文件列表
   * @param {Object} data 参数对象，例如分页、显示数量、排序，不传参数使用默认或继承参数
   * @param {Function} callback 回调函数
   * @return void
   */
  reader_file_list: function (data, callback) {
    var that = this,
      select_page_num = '',
      next_path = '',
      model = bt.get_cookie('rank'),
      // model = 'list',
      isPaste = bt.get_cookie('record_paste_type');
    var plugin_title = ' ';
    if (isPaste != 'null' && isPaste != undefined) {
      //判断是否显示粘贴
      $('.file_nav_view .file_all_paste').removeClass('hide');
    } else {
      $('.file_nav_view .file_all_paste').addClass('hide');
    }
    $('.file_table_view')
      .removeClass('list_view icon_view')
      .addClass(model == 'icon' ? 'icon_view' : 'list_view');
    $('.cut_view_model:nth-child(' + (model == 'icon' ? '1' : '2') + ')')
      .addClass('active')
      .siblings()
      .removeClass('active');
    this.file_images_list = [];
    if (data.file_btn) {
      var search_input = $('.search_path_views .file_search_input').val();
      data['search'] = search_input;
    }
    this.get_dir_list(data, function (res) {
      that.search_hi = res
      if (res.status === false && res.msg.indexOf('指定目录不存在!') > -1) {
        return that.reader_file_list({ path: '/www' });
      }
      that.file_path = that.path_check(res.PATH);
      that.tamper_data = res.tamper_data;
      that.file_list = $.merge(that.data_reconstruction(res.DIR, 'DIR',res), that.data_reconstruction(res.FILES));
      that.file_store_list = res.STORE;
      that.file_DIR_list = that.dataProcessingSplicing(res.DIR);
      bt.set_cookie('Path', that.path_check(res.PATH));
      if (typeof res.FILE_RECYCLE == 'boolean') bt.set_cookie('file_recycle_status', res.FILE_RECYCLE);
      that.reader_file_list_content(that.file_list, function (rdata) {
        $('.path_input').attr('data-path', that.file_path);
        $('.file_nav_view .multi').addClass('hide');
        $('.selection_right_menu').removeAttr('style');
        var arry = ['100', '200', '500', '1000', '2000'];
        for (var i = 0; i < arry.length; i++) {
          var item = arry[i];
          select_page_num += '<option value="' + item + '" ' + (item == bt_file.file_page_num ? 'selected' : '') + '>' + item + '</option>';
        }
        bt.soft.get_soft_find('disk_analysis', function (dataRes) {
          if (dataRes.setup && dataRes.endtime > 0) {
            plugin_title = '已安装《堡塔硬盘分析工具》可以一键扫描所有目录大小';
          } else {
            plugin_title = '安装《堡塔硬盘分析工具》可以一键扫描所有目录大小 ';
          }
          var page = $(res.PAGE);
          page.append('<span class="Pcount-item">每页<select class="showRow">' + select_page_num + '</select>条</span>');
          $('.filePage').html(
            '<div class="page_num">共' +
            rdata.is_dir_num +
            '个目录，' +
            (that.file_list.length - rdata.is_dir_num) +
            '个文件<i class="fileAllSize">，文件大小:<a href="javascript:;" class="btlink" id="file_all_size" title="' +
            plugin_title +
            '">计算</a></i></div>' +
            page[0].outerHTML
          );
          // $('.filePage').html('<div class="page_num">共' + rdata.is_dir_num + '个目录，' + (that.file_list.length - rdata.is_dir_num) + '个文件，文件大小:<a href="javascript:;" class="btlink" id="file_all_size">计算</a></div>' + page[0].outerHTML);
          // if(data.is_operating) data.is_operating = false;
          if (data && data.is_operating && that.file_operating[that.file_pointer] != res.PATH) {
            next_path = that.file_operating[that.file_pointer + 1];
            if (typeof next_path != 'undefined' && next_path != res.PATH) that.file_operating.splice(that.file_pointer + 1);
            that.file_operating.push(res.PATH);
            that.file_pointer = that.file_operating.length - 1;
          }
          that.render_path_list(); // 渲染文件路径地址
          that.set_file_forward(); // 设置前进后退状态
          that.render_favorites_list(); //渲染收藏夹列表
          that.set_file_view(); // 设置文件视图

          that.set_file_table_width(); //设置表格头部宽度
          if (callback) callback(res);
        });
      });
    });
  },
  /**
   * @descripttion 重组数据结构
   * @param {Number} data  数据
   * @param {String} type  类型
   * @return: 返回重组后的数据
   */
  data_reconstruction: function (data, type, res) {
    var that = this,
      arry = [],
      info_ps = [
        ['/etc', 'PS: 系统主要配置文件目录'],
        ['/home', 'PS: 用户主目录'],
        ['/tmp', 'PS: 公共的临时文件存储点'],
        ['/root', 'PS: 系统管理员的主目录'],
        ['/home', 'PS: 用户主目录'],
        ['/usr', 'PS: 系统应用程序目录'],
        ['/boot', 'PS: 系统启动核心目录'],
        ['/lib', 'PS: 系统资源文件类库目录'],
        ['/mnt', 'PS: 存放临时的映射文件系统'],
        ['/www', 'PS: 宝塔面板程序目录'],
        ['/bin', 'PS: 存放二进制可执行文件目录'],
        ['/dev', 'PS: 存放设备文件目录'],
        ['/www/wwwlogs', 'PS: 默认网站日志目录'],
        ['/www/server', 'PS: 宝塔软件安装目录'],
        ['/www/wwwlogs', 'PS: 网站日志目录'],
        ['/www/Recycle_bin', 'PS: 回收站目录,勿动'],
        ['/www/server/panel', 'PS: 宝塔主程序目录，勿动'],
        ['/www/server/panel/plugin', 'PS: 宝塔插件安装目录'],
        ['/www/server/panel/BTPanel', 'PS: 宝塔面板前端文件'],
        ['/www/server/panel/BTPanel/static', 'PS: 宝塔面板前端静态文件'],
        ['/www/server/panel/BTPanel/templates', 'PS: 宝塔面板前端模板文件'],
        [bt.get_cookie('backup_path'), 'PS: 默认备份目录'],
        [bt.get_cookie('sites_path'), 'PS: 默认建站目录'],
      ];
    if (data.length < 1) return [];
    $.each(data, function (index, item) {
      var itemD = item.split(';'),
        fileMsg = '',
        fileN = itemD[0].split('.'),
        extName = itemD[0].substr(-3) == 'log' ? 'log' : fileN[fileN.length - 1];
      switch (itemD[0]) {
        case '.user.ini':
          fileMsg = 'PS: PHP用户配置文件(防跨站)!';
          break;
        case '.htaccess':
          fileMsg = 'PS: Apache用户配置文件(伪静态)';
          break;
        case 'swap':
          fileMsg = 'PS: 宝塔默认设置的SWAP交换分区文件';
          break;
      }
      if (itemD[0].indexOf('.upload.tmp') != -1) fileMsg = 'PS: 宝塔文件上传临时文件,重新上传从断点续传,可删除';
      for (var i = 0; i < info_ps.length; i++) {
        if (that.path_resolve(that.file_path, itemD[0]) === info_ps[i][0]) fileMsg = info_ps[i][1];
      }
      var tamper_arr = [];
      if (that.tamper_data) {
        tamper_arr = that.tamper_data[type == 'DIR' ? 'dirs' : 'files'];
      } else {
        that.tamper_data = {};
      }
      var type_arr = that.tamper_data.status && tamper_arr.length ? tamper_arr[index].split(';') : [];
      var array = res?res.bt_sync:[]
      arry.push({
        caret: itemD[8] == '1' ? true : false, // 是否收藏
        down_id: parseInt(itemD[9]), // 是否分享 分享id
        ext: type == 'DIR' ? '' : extName.toLowerCase(), // 文件类型
        filename: itemD[0], // 文件名称
        mtime: itemD[2], // 时间
        ps: fileMsg || itemD[10] || '', // 备注
        topping: itemD[11] == '1' ? true : false, //是否置顶
        is_os_ps: fileMsg != '' ? true : false, // 是否系统备注信息
        size: itemD[1], // 文件大小
        type: type == 'DIR' ? 'dir' : 'file', // 文件类型
        user: itemD[3], // 用户权限
        root_level: itemD[4], // 所有者
        soft_link: itemD[5] || '', // 软连接
        is_search: $('.file_search_input').val() ? true : false, //判断是否搜索
        is_lock: parseInt(type_arr[0]) || 0,
        tamper_proof_id: parseInt(type_arr[1]) || 0,
        sync:Array.isArray(array)?array.length>0?array[index]:false:false
      });
    });
    return arry;
  },
  /**
   * @descripttion 渲染拖拽选中列表
   * @param {Array} _array 选中的区域
   * @return: 无返回值
   */
  render_file_selected: function (_array) {
    var that = this,
      tmp = [];
    that.clear_table_active();
    $.each(_array, function (index, item) {
      if (tmp.indexOf(item) == -1) {
        tmp.push(item);
      }
    });
    $.each(tmp, function (ind, items) {
      $('.file_list_content .file_tr').eq(items).addClass('active');
      that.file_table_arry.push(that.file_list[items]);
    });
    that.calculate_table_active();
  },
  /**
   * @descripttion 渲染收藏夹列表
   * @return: 无返回值
   */
  render_favorites_list: function () {
    var html = '';
    if (this.file_store_list.length > 0) {
      $.each(this.file_store_list, function (index, item) {
        html +=
          '<li title="' +
          item['name'] +
          '(' +
          item['path'] +
          ')" data-path="' +
          item['path'] +
          '" data-type="' +
          item['type'] +
          '">' +
          '<i class="' +
          (item['type'] == 'file' ? 'file_new_icon' : 'file_menu_icon create_file_icon') +
          '"></i>' +
          '<span>' +
          item['name'] +
          '\
						<span style="color:#999;font-size:12px;white-space: nowrap;text-overflow: ellipsis;overflow:hidden;position:relative;left:0">\
						(' +
          item['path'] +
          ')</span>\
					</span>' +
          '</li>';
      });
      html += '<li data-manage="favorites" data-null onclick="bt_file.set_favorites_manage()"><span class="iconfont icon-shezhi1"></span><span>管理</span></li>';
    } else {
      html = '<li data-null style="width: 150px;"><i></i><span>（空）</span></li>';
    }

    $('.favorites_file_path .nav_down_list').html(html);
  },
  /**
   * @descripttion 收藏夹目录视图
   * @return: 无返回值
   */
  set_favorites_manage: function () {
    var that = this;
    layer.open({
      type: 1,
      title: '管理收藏夹',
      area: ['850px', '580px'],
      closeBtn: 2,
      shift: 5,
      shadeClose: false,
      content:
        "<div class='stroe_tab_list bt-table pd15'>\
                    <div class='divtable' style='height:420px'>\
                    <table class='table table-hover'>\
                        <thead><tr><th>路径</th><th style='text-align:right'>操作</th></tr></thead>\
                        <tbody class='favorites_body'></tbody>\
                    </table></div></div>",
      success: function (layers) {
        that.render_favorites_type_list();
        setTimeout(function () {
          $(layers).css('top', ($(window).height() - $(layers).height()) / 2);
        }, 50);
      },
      cancel: function () {
        that.reader_file_list({ path: that.file_path });
      },
    });
  },
  /**
   * @description 渲染收藏夹分类列表
   * @return void
   */
  render_favorites_type_list: function () {
    var _detail = '';
    this.$http('get_files_store', function (rdata) {
      if (rdata.length > 0) {
        $.each(rdata, function (ind, item) {
          _detail +=
            '<tr>' +
            '<td><span class="favorites_span" title="' +
            item['path'] +
            '">' +
            item['path'] +
            '</span></td>' +
            '<td style="text-align:right;">' +
            '<a class="btlink" onclick="bt_file.del_favorites(\'' +
            item['path'] +
            '\')">删除</a>' +
            '</td>' +
            '</tr>';
        });
      } else {
        _detail = '<tr><td colspan="2">暂无收藏</td></tr>';
      }
      $('.favorites_body').html(_detail);
      if (jQuery.prototype.fixedThead) {
        $('.stroe_tab_list .divtable').fixedThead({ resize: false });
      } else {
        $('.stroe_tab_list .divtable').css({ overflow: 'auto' });
      }
    });
  },
  /**
   * @description 重新获取收藏夹列表
   * @return void
   */
  load_favorites_index_list: function () {
    var that = this;
    this.$http('get_files_store', function (rdata) {
      that.file_store_list = rdata;
      that.render_favorites_list();
    });
  },
  /**
   * @description 删除收藏夹
   * @param {String} path 文件路径
   * @return void
   */
  del_favorites: function (path) {
    var that = this;
    layer.confirm('是否确定删除路径【' + path + '】？', { title: '删除收藏夹', closeBtn: 2, icon: 3 }, function (index) {
      that.$http('del_files_store', { path: path }, function (res) {
        if (res.status) {
          that.render_favorites_type_list();
        }
        layer.msg(res.msg, { icon: res.status ? 1 : 2 });
      });
    });
  },
  /**
   * @description 数据同步
   * @param {String} config 选中的文件信息
   * @return void
   */
  set_dir_rsync: function (config) {
    var loadget = layer.msg('正在检测配置信息...', { icon: 16, time: 0, shade: [0.3, '#000'] }),
      _path = config.path + '/';
    $.get('/plugin?action=a&name=rsync&s=get_send_conf', function (res) {
      if (res.length > 0) {
        $.each(res, function (index, item) {
          if (item.path == _path) {
            layer.close(loadget);
            bt.soft.set_lib_config('rsync', '文件同步工具')
            // bt_file.set_send_port_view(item.source, item.name, index);
            return false;
          }
          //没有对应的数据时，获取接收端列表
          if (index == res.length - 1) {
            get_receive_port_conf();
          }
        });
      } else {
        get_receive_port_conf();
      }
    });
    // 获取接收端列表
    function get_receive_port_conf() {
      $.get('/plugin?action=a&name=rsync&s=get_global_conf', function (res) {
        if (res['modules'].length > 0) {
          $.each(res['modules'], function (index, item) {
            if (item.path == _path) {
              layer.close(loadget);
              item['mName'] = item.name;
              var _conf = { title: '编辑接收端', btn: '保存', action: 'modify_module', form: item };
              bt_file.set_rsync_view('', _conf);
              return false;
            }
            //没有对应的数据时，获取接收端列表
            if (index == res['modules'].length - 1) {
              default_create_deply();
            }
          });
        } else {
          default_create_deply();
        }
      });
    }
    // 默认创建同步
    function default_create_deply() {
      layer.close(loadget);
      bt.open({
        type: 1,
        title: '【' + config.filename + '】设置数据同步',
        area: '600px',
        btn: false,
        content:
          '<div class="bt-form pd25">\
                  <div class="rebt-con" style="width:100%;display: flex;padding:0;height:auto;justify-content: space-around;">\
                    <div class="rebt-li" style="position:relative;width: 200px;" onclick="bt_file.set_rsync_view(\'' +
          config.path +
          '\')">\
                      <a href="javascript:;" style="font-size:13px;border-radius:2px;"><span style="display: block;font-weight: bold;font-size: 15px;">接收端</span>我需要从其他服务器中接收数据</a>\
                    </div>\
                    <div class="rebt-li" style="position:relative;width: 200px;" onclick="bt_file.set_send_port_view(\'' +
          config.path +
          '\',false)">\
                      <a href="javascript:;"  style="font-size:13px;border-radius:2px;"><span style="display: block;font-weight: bold;font-size: 15px;">发送端</span>我需要将本服务器数据发送出去</a>\
                    </div>\
                  </div>\
                  <ul class="help-info-text c7">\
                    <li>注意：不同的同步任务及服务器请不要使用相同的同步名称及用户名，这会导致管理混乱。</li>\
                    <li><a class="btlink" target="_blank" href="https://www.bt.cn/bbs/thread-98022-1-1.html">详细使用方法，请点击这里查看教程</a><a href="https://www.bt.cn/bbs/thread-98022-1-1.html" target="_blank" class="bt-ico-ask" style="cursor: pointer;">?</a></li>\
                    </ul>\
                </div>',
      });
    }
  },
  /**
   * @description 设置文件夹数据同步   接收端
   * @param {String} path 文件夹路径
   * @param {Object} editConfig 编辑参数
   * @return void
   */
  set_rsync_view: function (path, editConfig) {
    var _param = { title: '创建接收端', btn: '提交', action: 'add_module', form: { mName: '', password: bt.get_random(12), path: path, comment: '' } },
      receiveForm = null;
    if (editConfig) _param = editConfig;
    layer.open({
      type: 1,
      title: _param.title,
      area: ['470px', '324px'],
      btn: [_param.btn, '取消'],
      shadeClose: false,
      closeBtn: 2,
      content: '<div class="ptb20" id="receive_port_view"></div>',
      success: function (layers) {
        receiveForm = bt_tools.form({
          el: '#receive_port_view',
          form: [
            {
              label: '用户名',
              group: {
                type: 'text',
                name: 'mName',
                width: '300px',
                disabled: typeof editConfig === 'object' ? true : false,
                placeholder: '请填写用户名,不能有中文或特殊符号',
              },
            },
            {
              label: '密码',
              group: {
                type: 'text',
                name: 'password',
                width: '300px',
                icon: {
                  type: 'glyphicon-repeat',
                  name: 'random',
                },
                placeholder: '请输入密码',
              },
            },
            {
              label: '同步到',
              group: {
                type: 'text',
                name: 'path',
                width: '300px',
                disabled: true,
                placeholder: '请选择本地路径',
              },
            },
            {
              label: '备注',
              group: {
                type: 'text',
                name: 'comment',
                width: '300px',
              },
            },
          ],
          data: _param.form,
        });
        //随机密码
        $('.glyphicon-repeat').click(function () {
          $(this).siblings('input').val(bt.get_random(12));
        });
      },
      yes: function (indexs) {
        var _form = receiveForm.$get_form_value();
        if (_form.mName == '') return layer.msg('请填写用户名', { icon: 2 });
        if (_form.password == '') return layer.msg('请填入密码', { icon: 2 });
        bt_tools.send(
          {
            url: '/plugin?action=a&name=rsync&s=' + _param.action,
            data: _form,
          },
          function (res) {
            layer.closeAll();
            bt_tools.msg(res);
            look_receive_info(_form);
            path = path.replace(/\/$/, '');
            if (path) bt_file.add_files_rsync(path, 'recv');
          },
          '提交表单信息'
        );
      },
    });
    // 数据同步账号信息
    function look_receive_info(form) {
      layer.open({
        type: 1,
        closeBtn: 1,
        title: '接收端用户信息',
        area: ['400px', '220px'],
        shadeClose: false,
        content:
          '<div class="pd20">\
                <div class="replace_content_view ">\
                <div class="replace_content_line">\
                    <span class="tname">用户名</span>\
                    <div class="info-r">\
                        <input class="bt-input-text" disabled="disabled" autocomplete="off" type="text" style="width:280px" value="' +
          form.mName +
          '">\
                    </div>\
                </div>\
                <div class="replace_content_line">\
                    <span class="tname">密码</span>\
                    <div class="info-r">\
                        <input class="bt-input-text" disabled="disabled" autocomplete="off" type="text" style="width:280px" value="' +
          form.password +
          '">\
                    </div>\
                </div></div>\
                <ul class="help-info-text c7">\
                    <li>使用上面的用户信息，前往发送数据的服务器上面的创建发送端</li>\
                </ul></div>',
      });
    }
  },
  /**
   * @description 设置文件夹数据同步   发送端
   * @param {String} path 文件夹路径
   * @param {String} mName 编辑参数
   * @param {Number} index 索引位置
   * @return void
   */
  set_send_port_view: function (path, mName, index) {
    var loadget = layer.msg('正在获取配置信息...', { icon: 16, time: 0, shade: [0.3, '#000'] });
    var setClientForm = {},
      setTitle = '',
      setSubmit = '';
    bt_tools.send({url: '/plugin?action=a&name=rsync&s=get_send_byname',data: { mName: mName }}, function (rdata) {
      layer.close(loadget);
      var aulv = '',
        alwv = '',
        real = '',
        timing = '',
        day = '',
        min = '',
        none = '',
        hour = '',
        minuten = '',
        open_compress = '',
        close_compress = '';
      var status = mName == false ? false : true;
      if (status) {
        setTitle = '编辑同步任务';
        setSubmit = '保存';
        setClientForm = rdata;
        if (setClientForm.delete != 'true') {
          aulv = 'selected ="selected "';
        } else {
          alwv = 'selected ="selected "';
        }
        if (setClientForm.realtime) {
          real = 'selected ="selected "';
          none = 'display:none;';
        } else {
          timing = 'selected ="selected "';
          none = 'display:block;';
        }
        if (setClientForm.cron.type == 'day') {
          day = 'selected ="selected "';
          hour = 'display:block;';
          minuten = 'display:none;';
        } else {
          min = 'selected ="selected "';
          hour = 'display:none;';
          minuten = 'display:block;';
        }

        if (setClientForm.rsync.compress == 'true') {
          open_compress = 'selected ="selected "';
        } else {
          close_compress = 'selected ="selected "';
        }
      } else {
        setTitle = '创建发送任务';
        setSubmit = '提交';
        none = 'display:none;';
        minuten = 'display:none;';
        setClientForm = {
          delete: 'false',
          cron: {
            where_hour: '0',
            id: '',
            type: '',
            where1: '1',
            where_minute: '0',
          },
          rsync: {
            bwlimit: 1024,
          },
          delay: 3,
          realtime: true,
          secret_key: '',
          ip: '',
          mName: '',
          path: path,
          exclude: '',
        };
      }
      layer.open({
        type: 1,
        skin: 'demo-class',
        area: '600px',
        title: setTitle,
        closeBtn: 2,
        shift: 0,
        shadeClose: false,
        content:
          "<form class='bt-form pd20 pb70 ' id='fromServerPath' accept-charset='utf-8'>\
                            <div class='line'>\
                                <span class='tname'>服务器IP</span>\
                                <div class='info-r c4'>\
                                    <input class='bt-input-text' type='text' name='ip' placeholder='请输入接收服务器IP' value='" +
          setClientForm.ip +
          "' style='width:310px' />\
                                </div>\
                            </div>\
                            <div class='line'>\
                                <span class='tname'>同步目录</span>\
                                <div class='info-r c4'>\
                                    <input id='inputPath' class='bt-input-text mr5' type='text' name='path' value='" +
          setClientForm.path +
          "' placeholder='请选择同步目录' disabled='disabled' style='width:310px' />\
                                </div>\
                            </div>\
                            <div class='line'>\
                                <span class='tname'>同步方式</span>\
                                <div class='info-r c4'>\
                                    <select class='bt-input-text' name='delete' style='width:100px'>\
                                        <option value='false' " +
          aulv +
          ">增量</option>\
                                        <option value='true' " +
          alwv +
          ">完全</option>\
                                    </select>\
                                    <a href='https://www.bt.cn/bbs/forum.php?mod=viewthread&amp;tid=11231' target='_blank' class='bt-ico-ask' style='cursor: pointer;'>?</a>\
                                    <span style='margin-left: 20px;margin-right: 10px;'>同步周期</span>\
                                    <select class='bt-input-text synchronization' name='realtime' style='width:100px'>\
                                        <option value='true' " +
          real +
          ">实时同步</option>\
                                        <option value='false' " +
          timing +
          ">定时同步</option>\
                                    </select>\
                                </div>\
                            </div>\
                            <!--<div class='line'>\
                                <span class='tname'>同步周期</span>\
                                <div class='info-r c4'>\
                                    <select class='bt-input-text synchronization' name='realtime' style='width:100px'>\
                                        <option value='true' " +
          real +
          ">实时同步</option>\
                                        <option value='false' " +
          timing +
          ">定时同步</option>\
                                    </select>\
                                </div>\
                            </div>-->\
                            <div class='line' id='period' style='" +
          none +
          "height:45px;'>\
                                <span class='tname'>定时周期</span>\
                                <div class='info-r c4'>\
                                    <select class='bt-input-text pull-left mr20' name='period' style='width:100px;'>\
                                        <option value='day' " +
          day +
          ">每天</option>\
                                        <option value='minute-n' " +
          min +
          ">N分钟</option>\
                                    </select>\
                                    <div class='plan_hms pull-left mr20 bt-input-text hour' style='" +
          hour +
          "'>\
                                        <span><input type='number' name='hour' value='" +
          setClientForm.cron.hour +
          "' maxlength='2' max='23' min='0'></span>\
                                        <span class='name'>小时</span>\
                                    </div>\
                                    <div class='plan_hms pull-left mr20 bt-input-text minute' style='" +
          hour +
          "'>\
                                        <span><input type='number' name='minute' value='" +
          setClientForm.cron.minute +
          "' maxlength='2' max='59' min='0'></span>\
                                        <span class='name'>分钟</span>\
                                    </div>\
                                    <div class='plan_hms pull-left mr20 bt-input-text minute-n' style='" +
          minuten +
          "'>\
                                        <span><input type='number' name='minute-n' value='" +
          setClientForm.cron.where1 +
          "' maxlength='2' max='59' min='0'></span>\
                                        <span class='name'>分钟</span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class='line'>\
                                <span class='tname'>限速</span>\
                                <div class='info-r c4'>\
                                    <input class='bt-input-text' type='number' name='bwlimit' min='0'  value='" +
          setClientForm.rsync.bwlimit +
          "' style='width:100px' /> KB\
                                    <span style='margin-left: 54px;margin-right: 10px;'>延迟</span><input class='bt-input-text' min='0' type='number' name='delay'  value='" +
          setClientForm.delay +
          "' style='width:100px' /> 秒\
                                </div>\
                            </div>\
                            <div class='line'>\
                                <span class='tname'>连接方式</span>\
                                <div class='info-r c4'>\
                                    <select class='bt-input-text' name='conn_type' style='width:100px'>\
                                        <option value='key'>密钥</option>\
                                        <option value='user'>帐号</option>\
                                    </select>\
                                    <span style='margin-left: 45px;margin-right: 10px;'>压缩传输</span>\
                                    <select class='bt-input-text' name='compress' style='width:100px'>\
                                        <option value='true' " +
          open_compress +
          ">开启</option>\
                                        <option value='false' " +
          close_compress +
          ">关闭</option>\
                                    </select>\
                                </div>\
                            </div>\
                            <div class='line conn-key'>\
                                <span class='tname'>接收密钥</span>\
                                <div class='info-r c4'>\
                                    <textarea id='mainDomain' class='bt-input-text' name='secret_key' style='width:310px;height:75px;line-height:22px' placeholder='此密钥为 接收配置[接收账号] 的密钥'>" +
          setClientForm.secret_key +
          "</textarea>\
                                </div>\
                            </div>\
                            <div class='line conn-user'>\
                                <span class='tname'>用户名</span>\
                                <div class='info-r c4'>\
                                    <input class='bt-input-text' type='text' name='u_user' min='0'  value='" +
          (setClientForm.name ? setClientForm.name : '') +
          "' style='width:310px' />\
                                </div>\
                            </div>\
                            <div class='line conn-user'>\
                                <span class='tname'>密码</span>\
                                <div class='info-r c4'>\
                                    <input class='bt-input-text' type='text' name='u_pass' min='0'  value='" +
          (setClientForm.password ? setClientForm.password : '') +
          "' style='width:310px' />\
                                </div>\
                            </div>\
                            <div class='line conn-user'>\
                                <span class='tname'>端口</span>\
                                <div class='info-r c4'>\
                                    <input class='bt-input-text' type='number' name='u_port' min='0'  value='" +
          (setClientForm.rsync.port ? setClientForm.rsync.port : '873') +
          "' style='width:310px' />\
                                </div>\
                            </div>\
                            <div class='bt-form-submit-btn'>\
                                <button type='button' class='btn btn-danger btn-sm btn-title colseView' onclick='layer.closeAll()'>取消</button>\
                                <button type='button' class='btn btn-success btn-sm btn-title setViewData'>" +
          setSubmit +
          '</button>\
                            </div>\
                            <ul class="help-info-text c7">\
                                <li>【同步目录】：若不以<code>/</code>结尾，则表示将数据同步到二级目录，一般情况下目录路径请以<code>/</code>结尾</li>\
                                    <li>【同步方式】增量： 数据更改/增加时同步，且只追加和替换文件</li>\
                                    <li>【同步方式】完全： 保持两端的数据与目录结构的一致性，会同步删除、追加和替换文件和目录</li>\
                                    <li>【限速】：限制数据同步任务的速度，防止因同步数据导致带宽跑高</li>\
                                    <li>【延迟】：在延迟时间周期内仅记录不同步，到达周期后一次性同步数据，以节省开销</li>\
                                    <li>【压缩传输】：开启后可减少带宽开销，但会增加CPU开销，如带宽充足，建议关闭此选项</li>\
                                </ul>\
                            </form>',

        success: function () {
          $('.conn-user').hide();
          $("select[name='conn_type']").change(function () {
            if ($(this).val() == 'key') {
              $('.conn-user').hide();
              $('.conn-key').show();
            } else {
              $('.conn-user').show();
              $('.conn-key').hide();
            }
          });
          //默认添加时使用账号密码方式
          if (!status) {
            $("select[name='conn_type']").val('user');
            $("select[name='conn_type']").change();
          }
        },
      });

      $("select[name='delete']").change(function () {
        if ($(this).val() == 'true') {
          var mpath = $('input[name="path"]').val();
          var msg =
            '<div><span style="color:orangered;">警告：您选择了完全同步，将会使本机同步与目标机器指定目录的文件保持一致，' +
            '<br />请确认目录设置是否有误，一但设置错误，可能导致目标机器的目录文件被删除!</span>' +
            '<br /><br /> <span style="color:red;">注意： 同步程序将本机目录：' +
            mpath +
            '的所有数据同步到目标服务器，若目标服务器的同步目录存在其它文件将被删除!</span> <br /><br /> 已了解风险，请按确定继续</div>';

          layer.confirm(msg, {
            title: '数据安全风险警告',
            icon: 2,
            closeBtn: 1,
            shift: 5,
            btn2: function () {
              setTimeout(function () {
                $($("select[name='delete']").children('option')[0]).prop('selected', true);
              }, 100);
            },
          });
        }
      });
      $('.synchronization').click(function (event) {
        var selVal = $('.synchronization option:selected').val();
        if (selVal == 'false') {
          $('#period').show();
        } else {
          $('#period').hide();
          $('.hour input,.minute input').val('0');
          $('.minute-n input').val('1');
        }
      });
      $('#period select').click(function (event) {
        var selVal = $('#period select option:selected').val();
        if (selVal == 'day') {
          $('.hour,.minute').show();
          if ($('.hour input').val() == '') {
            $('.hour input,.minute input').val('0');
          }
          $('.minute-n').hide();
        } else {
          $('.hour,.minute').hide();
          $('.minute-n').show();
          if ($('.minute-n input').val() == '') {
            $('.minute-n input').val('1');
          }
        }
      });
      $('.setViewData').click(function (event) {
        var server = {
          ip: '',
          path: '',
          secret_key: '',
          delete: 'true',
          realtime: 'true',
          sname: '',
          password: '',
          port: 873,
          cron: {
            type: '',
            where1: '',
            hour: '',
            minute: '',
            id: '',
            port: 873,
          },
        };

        if ($('input[name="ip"]').val() != '') {
          server.ip = $('input[name="ip"]').val();
        } else {
          layer.msg('请输入服务器IP地址！');
          return false;
        }
        if ($('input[name="bwlimit"]').val() > -1) {
          server.bwlimit = $('input[name="bwlimit"]').val();
        }

        if ($('input[name="delay"]').val() > -1) {
          server.delay = $('input[name="delay"]').val();
        }

        if ($('input[name="path"]').val() != '') {
          server.path = $('input[name="path"]').val();
        } else {
          layer.msg('请输入同步目录！');
          return false;
        }
        server.delete = $('select[name="delete"] option:selected').val();
        server.realtime = $('select[name="realtime"] option:selected').val() == 'true' ? true : false;
        server.compress = $('select[name="compress"] option:selected').val();
        if (!server.realtime) {
          server.cron.type = $('select[name="period"] option:selected').val();
          if (server.cron.type == 'day') {
            server.cron.hour = $('input[name="hour"]').val();
            server.cron.minute = $('input[name="minute"]').val();
            if (server.cron.hour == '' || server.cron.minute == '') {
              layer.msg('请输入同步时间！');
              return false;
            }
          } else {
            server.cron.where1 = $('input[name="minute-n"]').val();
            if (server.cron.where1 == '') {
              layer.msg('请输入同步时间！');
              return false;
            }
          }
        }
        var conn_type = $("select[name='conn_type']").val();
        if (conn_type == 'key') {
          if ($('textarea[name="secret_key"]').val() != '') {
            server.secret_key = $('textarea[name="secret_key"]').val();
          } else {
            layer.msg('请输入接收密钥！');
            return false;
          }
        } else {
          server.sname = $("input[name='u_user']").val();
          server.password = $("input[name='u_pass']").val();
          server.cron.port = Number($("input[name='u_port']").val());
          server.port = server.cron.port;
          if (!server.sname || !server.password || !server.cron.port) {
            layer.msg('请输入帐号、密码、端口信息');
            return false;
          }
        }

        server.cron = JSON.stringify(server.cron);
        server.index = index;
        var loading = layer.msg('提交数据中,请稍后...', { icon: 16, time: 0, shade: [0.3, '#000'] });
        bt_tools.send({url: '/plugin?action=a&name=rsync&s=add_ormodify_send',data: server}, function (res) {
          layer.close(loading);
          if (res.status) {
            layer.closeAll();
            setTimeout(function () {
              layer.msg(res.msg, { icon: 1 });
            }, 200);
            //创建发送后给文件夹添加备注
            if (path) {
              var _pathPS = path.replace(/\/$/, '');
              $.get('/plugin?action=a&name=rsync&s=get_send_conf', function (res) {
                $.each(res, function (index, item) {
                  if (item.path == path) {
                    var ps = '接收服务器:' + item.ip + '::' + item.name;
                    bt_tools.send(
                      'files/set_file_ps',
                      { filename: _pathPS, ps_type: 0, ps_body: ps },
                      function () {
                        $('.file_tr.active .set_file_ps').data('value', ps);
                        $('.file_tr.active .set_file_ps').val(ps);
                      },
                      { tips: '设置文件/目录备注', tips: true }
                    );
                  }
                });
              });
              bt_file.add_files_rsync(_pathPS, 'send');
            }
          } else {
            layer.msg(res.msg, { icon: 2 });
          }
        },{verify: false});
      });
    },{verify: false});
  },
  /**
   * @description 添加文件同步数据标记
   * @param {String} path 文件夹路径
   * @param {String} type 接收/发送
   * @return void
   */
  add_files_rsync: function (path, type) {
    bt_tools.send('files/add_files_rsync', { path: path, s_type: type }, function () {}, { tips: '文件夹标记', tips: true });
  },
  /**
   * @description 渲染文件列表内容
   * @param {Object} data 文件列表数据
   * @param {Function} callback 回调函数
   * @return void
   */
  reader_file_list_content: function (data, callback) {
    var _html = '',
      that = this,
      is_dir_num = 0,
      images_num = 0;
    $.each(data, function (index, item) {
      var is_vs_tips = '打开（code-server）'
      var _title = item.filename,
        only_id = bt.get_random(10),
        path = (that.file_path + '/' + item.filename).replace('//', '/'),
        is_compress = fileManage.determine_file_type(item.ext, 'compress'),
        is_editor_tips = (function () {
          var _openTitle = '打开';
          switch (fileManage.determine_file_type(item.ext)) {
            case 'images':
              _openTitle = '预览';
              break;
            case 'video':
              _openTitle = '播放';
              break;
            default:
              if (fileManage.determine_file_type(item.ext) == 'compress' || fileManage.determine_file_type(item.ext) === 'ont_text') {
                _openTitle = '';
              } else {
                _openTitle = '编辑';
              }
              break;
          }
          item.type == 'dir' ? (_openTitle = '打开') : '';
          return _openTitle;
        })(item);
      that.file_list[index]['only_id'] = only_id;
      is_vs_tips = (is_editor_tips === '预览' || is_editor_tips === '播放') ? '':(is_editor_tips + '（code-server）')
      if (item.type == 'dir') is_dir_num++;
      item.path = path; // 文件路径;
      item.open_type = fileManage.determine_file_type(item.ext); // 打开类型;
      if (item.open_type == 'images') {
        item.images_id = images_num;
        that.file_images_list.push(item.path);
        images_num++;
      }
      if (item.ext === 'bt_split' || item.ext === 'bt_split_json') {
        // 判断是否是拆分之后的文件
        item.is_os_ps = true; //禁止编辑备注
      }
      _html +=
        '<div class="file_tr" data-index="' +
        index +
        '" data-filename="' +
        item.filename +
        '" ' +
        (bt.get_cookie('rank') == 'icon'
          ? 'title="' +
          path +
          '&#13;' +
          lan.files.file_size +
          ':' +
          bt.format_size(item.size) +
          '&#13;' +
          lan.files.file_etime +
          ':' +
          bt.format_data(item.mtime) +
          '&#13;' +
          lan.files.file_auth +
          ':' +
          item.user +
          '&#13;' +
          lan.files.file_own +
          ':' +
          item.root_level +
          '"'
          : '') +
        '>' +
        '<div class="file_td file_checkbox"><div class="file_check"></div></div>' +
        '<div class="file_td file_name" style="position:relative;">' +
        '<div class="file_ico_type">' +
        (item.open_type == 'images' ? '<img class="file_images" src="/static/images/layer/loading-2.gif" style="width:20px;height:20px;left:5px;top:12.5px;" />' : '') +
        '<i class="file_icon ' +
        (item.open_type == 'images' ? 'hide ' : '') +
        '' +
        (item.type == 'dir' ? 'file_folder' : (item.ext == '' ? '' : 'file_' + item.ext).replace('//', '/')) +
        '"></i>' +
        '</div>' +
        (item.ext == 'bt_split_json' ? '<a class="btlink joinFile" data-type="join_file">[文件合并]</a>' : '') +
        '<span class="file_title file_' +
        item.type +
        '_status" ' +
        (bt.get_cookie('rank') == 'icon' ? '' : 'title="' + path + '"') +
        '><i>' +
        item.filename +
        item.soft_link +
        '</i></span><div class="file-rsync" style="margin-right: 25px">'+
        (item.sync.length>0?'': Object.keys(item.sync).length==0?'':item.sync.type=='modules'?'<a class="btlink" onclick="bt.soft.set_lib_config(\'rsync\', \'rsync\')">文件同步接收端</a>':'<a class="btlink" onclick="bt.soft.set_lib_config(\'rsync\', \'rsync\')">文件同步发送端</a>')
        +'</div>' +
        (item.topping
          ? '<span class="icon-onchange topping_file_icon" style="cursor: pointer;' +
          (item.caret && item.down_id != 0 ? 'right:57px' : item.caret || item.down_id != 0 ? 'right:30px' : 'right:5px') +
          '" title="取消置顶"></span>'
          : '') +
        (item.caret ? '<span class="icon-onchange iconfont icon-favorites" style="' + (item.down_id != 0 ? 'right:30px' : '') + '" title="文件已收藏，点击取消"></span>' : '') +
        (item.down_id != 0 ? '<span class="icon-onchange iconfont icon-share1" title="文件已分享，点击查看信息"></span>' : '') +
        '</div>' +
        // '<div class="file_td file_type hide"><span title="' + (item.type == 'dir' ? '文件夹' : that.ext_type_tips(item.ext)) + '">' + (item.type == 'dir' ? '文件夹' : that.ext_type_tips(item.ext)) + '</span></div>' +
        '<div class="file_td file_tamper_core ' +
        that.is_fid_hide('file_tamper_core') +
        '">' +
        '<div class="icon-lock-box ' +
        (item.is_lock ? 'green' : '') +
        '" title="点击' +
        (item.is_lock ? '关闭防篡改，该文件或目录可以被修改' : '开启防篡改，该文件或目录将不会被修改') +
        '" data-lock="' +
        item.is_lock +
        '" data-pid="' +
        item.tamper_proof_id +
        '" data-filename="' +
        item.filename +
        '" data-path="' +
        item.path +
        '" data-type="' +
        item.type +
        '">' +
        '<span class="icon-lock-span">' +
        (item.is_lock ? '防护中' : '未防护') +
        '</span>' +
        '<span  style="z-index: 9" class="icon-lock ' +
        (item.is_lock ? 'icon-file-lock' : 'icon-file-unlock') +
        '"></span>' +
        '</div>' +
        '</div>' +
        '<div class="file_td file_accept ' +
        that.is_fid_hide('file_accept') +
        '"><span>' +
        item.user +
        ' / ' +
        item.root_level +
        '</span></div>' +
        '<div class="file_td file_size ' +
        that.is_fid_hide('file_size') +
        '"><span>' +
        (item.type == 'dir' ? bt.files.dir_details_span(path, true) : bt.format_size(item.size)) +
        '</span></div>' +
        '<div class="file_td file_mtime ' +
        that.is_fid_hide('file_mtime') +
        '"><span>' +
        bt.format_data(item.mtime) +
        '</span></div>' +
        '<div class="file_td file_ps ' +
        that.is_fid_hide('file_ps') +
        '"><span class="file_ps_title" style="width:100%" title="' +
        item.ps +
        '">' +
        (item.is_os_ps
          ? '<span>' + item.ps + '</span>'
          : '<input type="text" class="set_file_ps" ' +
          (item.disablePs ? 'style="background-color:transparent;"' : '') +
          ' ' +
          (item.disablePs ? 'disabled="true"' : '') +
          ' data-value="' +
          item.ps +
          '" value="' +
          item.ps +
          '" />') +
        '</span></div>' +
        '<div class="file_td file_operation"><div class="set_operation_group">' +
        '<a href="javascript:;" class="btlink" data-type="open">' +
        is_editor_tips +
        '</a>' +
        (is_editor_tips !== '' ? '<span>&nbsp;|&nbsp;</span>' : '') +
        (is_vs_tips ? '<a href="javascript:;" class="btlink" data-type="vsopen">'+ is_vs_tips +'</a><span>&nbsp;|&nbsp;</span>' : '') +
        '<a href="javascript:;" class="btlink" data-type="copy">复制</a><span>&nbsp;|&nbsp;</span>' +
        '<a href="javascript:;" class="btlink" data-type="shear">剪切</a><span>&nbsp;|&nbsp;</span>' +
        '<a href="javascript:;" class="btlink" data-type="rename">重命名</a><span>&nbsp;|&nbsp;</span>' +
        '<a href="javascript:;" class="btlink" data-type="authority">权限</a><span>&nbsp;|&nbsp;</span>' +
        '<a href="javascript:;" class="btlink" data-type="' +
        (is_compress ? 'unzip' : 'compress') +
        '">' +
        (is_compress ? '解压' : '压缩') +
        '</a><span>&nbsp;|&nbsp;</span>' +
        '<a href="javascript:;" class="btlink" data-type="del">删除</a><span>&nbsp;|&nbsp;</span>' +
        '<a href="javascript:;" class="btlink foo_menu_title" data-type="more">更多<i></i></a>' +
        '</div></div>' +
        '</div>';
    });
    that.render_file_thumbnail();
    if(_html == '') _html = '<div class="no_file_list" style="display: flex;flex-direction: column;align-items: center;"><img src="/static/images/svg/no-file.svg" /><p style="color: #999999">暂无文件</p></div>';
    $('.file_list_content.file_manage').html(_html);
    if ($('a.btlink.joinFile').length > 0) {
      $('a.btlink.joinFile').css('bottom', bt.get_cookie('rank') == 'icon' ? '-10px' : '');
    }
    if (callback) callback({ is_dir_num: is_dir_num });
    that.clear_table_active(); // 清除表格选中内容
  },
  /**
   * 判断文件列表是否隐藏
   * @param {*} type 列类型
   * @returns boolean
   */
  is_fid_hide: function (type) {
    var that = this;
    return that.cache_set_column.length
      ? that.cache_set_column.filter(function (items) {
        return items.type == type;
      })[0].value
        ? ''
        : 'hide'
      : '';
  },
  /**
   * @description 渲染文件磁盘列表
   * @return void
   */
  render_file_disk_list: function () {
    var that = this,
      html = '',
      _li = '';
    that.get_disk_list(function (res) {
      $.each(res, function (index, item) {
        html +=
          '<div class="nav_btn" data-menu="' +
          item.path +
          '">' +
          '<span class="glyphicon glyphicon-hdd"></span>' +
          '<span title="' +
          (item.path == '/' ? '/(根目录)' : item.path) +
          ' (' +
          item.size[2] +
          ')' +
          '">' +
          (item.path == '/' ? '/(根目录)' : item.path) +
          ' (' +
          item.size[2] +
          ')</span>' +
          '</div>';
        _li +=
          '<li data-disk="' +
          item.path +
          '" title="' +
          (item.path == '/' ? '/(根目录)' : item.path) +
          ' (' +
          item.size[2] +
          ')' +
          '"><i class="glyphicon glyphicon-hdd"></i><span>' +
          (item.path == '/' ? '根目录' : item.path) +
          ' (' +
          item.size[2] +
          ')</span></li>';
      });
      $('.mount_disk_list').html(
        '<div class="disk_title_group_btn hide"><span class="disk_title_group">磁盘分区</span><i class="iconfont icon-xiala"></i><ul class="nav_down_list">' +
        _li +
        '</ul></div><div class="file_disk_list">' +
        html +
        '</div>'
      );
      that.set_menu_line_view_resize();
    });
  },

  /**
   * @description 渲染文件缩略图列表
   */
  render_file_thumbnail: function () {
    if (this.file_images_list.length == 0) return false;
    var arry = [];
    $.each(this.file_images_list, function (index, item) {
      var list = item.split('/');
      arry.push(list[list.length - 1]);
    });
    var files = arry.join(',');
    this.$http('get_images_resize', { path: this.file_path, files: files, width: 45, height: 45, return_type: 'base64' }, function (res) {
      var rdata = res.data;
      $.each(rdata, function (key, item) {
        if (!item) {
          $('[data-filename="' + key + '"] .file_images')
            .hide()
            .next()
            .removeClass('hide');
        } else {
          $('[data-filename="' + key + '"] .file_images')
            .attr('src', item)
            .removeAttr('style');
        }
      });
    });
  },

  /**
   * @description 渲染右键鼠标菜单
   * @param {Object} ev 事件event对象
   * @param {Object} el 事件对象DOM
   * @return void
   */
  render_file_groud_menu: function (ev, el) {
    var that = this,
      index = $(el).data('index'),
      _openTitle = '打开',
      data = that.file_list[index],
      compression = ['zip', 'rar', 'gz', 'tar', 'war', 'tgz', 'bz2', '7z'],
      _type = that.determine_file_type(data.ext);
    (config = {
      open: _openTitle,
      vsopen: '打开（code-server）',
      importDatabase: '导入数据库',
      split_0: true,
      download: '下载',
      splitFile: '文件拆分',
      favorites: '添加到收藏夹',
      cancel_favorites: '取消收藏',
      share: '外链分享',
      cancel_share: '取消分享',
      topping: '置顶目录/文件',
      cancel_topping: '取消置顶',
      rsync: '文件同步',
      oss_upload: ['上传到云存储', {}],
      file_real_time_log: '监听日志',
      split_1: true,
      dir_kill: '木马扫描',
      authority: '权限',
      split_2: true,
      copy: '复制',
      shear: '剪切',
      rename: '重命名',
      del: '删除',
      split_3: true,
      compress: '创建压缩',
      format_conversion:'格式转换',
      unzip: '解压',
      copy_file: '创建副本',
      open_find_dir: '打开文件所在目录',
      split_4: true,
      send_mail: '发送至邮箱',
      property: '属性',
    }),
      (info_ps = ['/etc', '/home', '/tmp', '/root', '/home', '/usr', '/boot', '/lib', '/mnt', '/www', '/bin', '/dev', '/www/server', '/www/Recycle_bin']);
    //当不是企业版时，隐藏部分功能（置顶目录/文件、创建副本、发送至邮箱）
    var ltd_end = bt.get_cookie('ltd_end') < 0;
    if (ltd_end) {
      delete config['topping'];
      delete config['copy_file'];
      delete config['send_mail'];
    }
    //end
    var oss_list = {};
    $.each(that.cloud_storage_upload_list, function (index, item) {
      oss_list['up_' + item.name] = item.title;
      that.cloud_storage_type_list.push('up_' + item.name);
    });
    config['oss_upload'][1] = oss_list;
    $.each(info_ps, function (index, item) {
      if (item == data.path) {
        //禁止同步关键目录
        delete config['rsync'];
      }
    });
    // 文件类型判断
    switch (fileManage.determine_file_type(data.ext)) {
      case 'images':
        _openTitle = '预览';
        delete config['vsopen']
        break;
      case 'video':
        _openTitle = '播放';
        delete config['vsopen']
        break;
      default:
        _openTitle = '编辑';
        config['vsopen'] = '编辑（code-server）'
        break;
    }
    config['open'] = data.type == 'dir' ? '打开' : _openTitle;
    if (_type === 'compress') {
      if (data.ext === 'zip' || data.ext === 'rar' || data.ext === 'gz') {
        // config['open'] = data.ext.toUpperCase() + '压缩预览 <span style="position: absolute; top: 4px; right: 28px; font-weight: initial;" class="new-ltd-icon new-file-icon"></span>';
        config['open'] = data.ext.toUpperCase() + '压缩预览';
      } else {
        delete config['open']; // 判断是否压缩文件,禁用操作
      }
      delete config['vsopen']
    }
    if (data.type === 'dir') {
      delete config['download']; // 判断是否文件或文件夹,禁用下载
      delete config['send_mail'];
      delete config['oss_upload']; //禁用上传
      delete config['splitFile']; //禁用文件拆分
    } else {
      delete config['dir_kill'];
      delete config['rsync']; // 判断是否文件夹，删除数据同步
    }
    if (data.ext === 'bt_split' || data.ext === 'bt_split_json') {
      // 判断是否是拆分之后的文件
      delete config['splitFile']; //禁用文件拆分
    }
    // if (data.open_type == 'compress') delete config['open']; // 判断是否压缩文件,禁用操作
    if (data.ext !== 'log') delete config['file_real_time_log']; // 判断是否日志文件,禁用操作
    if (data.ext !== 'sql') delete config['importDatabase']; // 判断是否sql文件,禁用操作
    if (data.down_id != 0) {
      delete config['share']; //已分享
    } else {
      delete config['cancel_share']; //未分享
    }
    if (data.topping) {
      delete config['topping']; //已置顶
    } else {
      delete config['cancel_topping']; //未置顶
    }
    if (data.caret !== false) {
      delete config['favorites']; // 已收藏
    } else {
      delete config['cancel_favorites']; // 未收藏
    }
    // if (data.ext == 'php') config['dir_kill'] = '文件查杀';
    // if (data.ext != 'php' && data.type != 'dir') delete config['dir_kill'];
    var num = 0;
    $.each(compression, function (index, item) {
      // 判断压缩文件
      if (item == data.ext) num++;
    });
    if (num == 0) delete config['unzip'];
    if (!data.is_search) {
      delete config['open_find_dir']; // 判断是否为搜索文件，提供打开目录操作
    } else {
      config['open_find_dir'] = data.type == 'dir' ? '打开该目录' : '打开文件所在目录';
    }
    that.file_selection_operating = config;
    that.reader_menu_list({ el: $('.selection_right_menu'), ev: ev, data: data, list: config });
  },

  /**
   * @description 渲染右键全局菜单
   * @param {Object} ev 事件event对象
   * @param {Object} el 事件对象DOM
   * @return void
   */
  render_file_all_menu: function (ev, el) {
    var that = this,
      config = {
        refresh: '刷新',
        split_0: true,
        upload: '上传',
        create: [
          '新建文件夹/文件',
          {
            create_dir: '新建文件夹',
            create_files: '新建文件',
            soft_link: '软链接文件',
          },
        ],
        oss_download: ['从云存储下载', {}],
        web_shell: '终端',
        split_1: true,
        paste: '粘贴',
      },
      offsetNum = 0,
      isPaste = bt.get_cookie('record_paste_type');
    var oss_list = {};
    $.each(that.cloud_storage_download_list, function (index, item) {
      oss_list['down_' + item.name] = item.title;
      that.cloud_storage_type_list.push('down_' + item.name);
    });
    config['oss_download'][1] = oss_list;
    if (isPaste == 'null' || isPaste == undefined) {
      delete config['split_1'];
      delete config['paste'];
    }
    that.reader_menu_list({ el: $('.selection_right_menu'), ev: ev, data: {}, list: config });
  },
  /**
   * @descripttion 文件多选时菜单
   * @param {Object} ev 事件event对象
   * @return: 无返回值
   */
  render_files_multi_menu: function (ev) {
    var that = this,
      config_group = [
        ['copy', '复制'],
        ['shear', '剪切'],
        ['authority', '权限'],
        ['compress', '创建压缩'],
        ['foramt_conversion', '格式转换'],
        ['del', '删除'],
      ],
      el = $('.selection_right_menu').find('ul'),
      el_height = el.height(),
      el_width = el.width(),
      left = ev.clientX - (this.area[0] - ev.clientX < el_width ? el_width : 0);
    el.empty();

    $.each(config_group, function (index, mitem) {
      var $children = null
      var fileList = that.file_table_arry.filter(function(item) { return item.type === 'file'})
      // 判断不存在文件 不渲染格式转换
      if (fileList.length == 0 && mitem[0] == 'foramt_conversion') {
        return
      }
      if (mitem[0] == 'split') {
        el.append('<li class="separate"></li>');
      } else {
        el.append(
          $(
            '<li><i class="file_menu_icon ' +
            mitem[0] +
            '_file_icon ' +
            (function (type) {
              if (type == 'authority') return 'iconfont icon-authority';
              return '';
            })(mitem[0]) +
            '"></i><span>' +
            mitem[1] +
            '</span></li>'
          )
            .append($children)
            .on('click', { type: mitem[0], data: that.file_table_arry }, function (ev) {
              $('.selection_right_menu').removeAttr('style');
              that.batch_file_manage(ev.data.type);
              ev.stopPropagation();
              ev.preventDefault();
            })
        );
      }
    });
    $('.selection_right_menu')
      .css({
        left: left,
        top: ev.clientY - (this.area[1] - ev.clientY < el_height ? el_height : 0),
      })
      .removeClass('left_menu right_menu')
      .addClass(this.area[0] - (left + el_width) < 230 ? 'left_menu' : 'right_menu');
    $(document).one('click', function (e) {
      $(ev.currentTarget).removeClass('selected');
      $('.selection_right_menu').removeAttr('style');
      e.stopPropagation();
      e.preventDefault();
    });
  },

  /**
   * @description 渲染菜单列表
   * @param {Object} el 菜单DOM
   * @param {Object} config 菜单配置列表和数据
   * @returns void
   */
  reader_menu_list: function (config) {
    config.el.show();
    var that = this,
      el = config.el.find('ul'),
      el_height = 0,
      el_width = el.width(),
      left = config.ev.clientX - (this.area[0] - config.ev.clientX < el_width ? el_width : 0),
      top = 0;
    el.empty();
    $.each(config.list, function (key, item) {
      var $children = null,
        $children_list = null;
      if (typeof item == 'boolean') {
        el.append('<li class="separate"></li>');
      } else {
        if (Array.isArray(item)) {
          $children = $('<div class="file_menu_down"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span><ul class="set_group"></ul></div>');
          $children_list = $children.find('.set_group');
          $.each(item[1], function (keys, items) {
            $children_list.append(
              $(
                '<li style="display:flex;align-items:center;"><i class="file_menu_icon ' +
                keys +
                '_file_icon"></i><span>' +
                items +
                '</span><span class="new-file-icon new-ltd-icon ' +
                (items.indexOf('文件') > -1 ? 'hide' : '') +
                '" style="margin-left:40px"></span></li>'
              ).on('click', { type: keys, data: config.data }, function (ev) {
                that.file_groud_event(
                  $.extend(ev.data.data, {
                    open: ev.data.type,
                    index: parseInt($(config.ev.currentTarget).data('index')),
                    element: config.ev.currentTarget,
                    type_tips: config.data.type == 'dir' ? '文件夹' : '文件',
                  })
                );
                config.el.removeAttr('style');
                ev.stopPropagation();
                ev.preventDefault();
              })
            );
          });
        }
        if(config.data.type == 'dir' && key == 'format_conversion') return
        el.append(
          $(
            '<li><i class="file_menu_icon ' +
            key +
            '_file_icon ' +
            (function (type) {
              switch (type) {
                case 'share':
                case 'cancel_share':
                  return 'iconfont icon-share1';
                case 'dir_kill':
                  return 'iconfont icon-dir_kill';
                case 'authority':
                  return 'iconfont icon-authority';
              }
              return '';
            })(key) +
            '"></i><span>' +
            (Array.isArray(item) ? item[0] : item) +
            '</span></li>'
          )
            .append($children)
            .on('click', { type: key, data: config.data }, function (ev) {
              that.file_groud_event(
                $.extend(ev.data.data, {
                  open: ev.data.type,
                  index: parseInt($(config.ev.currentTarget).data('index')),
                  element: config.ev.currentTarget,
                  type_tips: config.data.type == 'dir' ? '文件夹' : '文件',
                })
              );
              // 有子级拉下时不删除样式，其余删除
              if (key != 'compress' && key != 'create' && key != 'oss_upload' && key != 'oss_download') {
                config.el.removeAttr('style');
              }
              ev.stopPropagation();
              ev.preventDefault();
            })
        );
      }
    });
    el_height = el.innerHeight();
    top = config.ev.clientY - (this.area[1] - config.ev.clientY < el_height + 30 ? el_height : 0);
    var isGreaterScreen = this.area[1] > el_height, //页面高度大于菜单高度
      minHeadHeight = this.area[1] - 20 > 300 ? this.area[1] - 20 : 300;
    if (top < 0) {
      //偏移高度为负数时
      top = (this.area[1] - config.el.height()) / 2;
    }
    var element = $(config.ev.target),
      moreLink = element.hasClass('foo_menu_title') || element.parents().hasClass('foo_menu_title'); // 更多按钮

    if (moreLink) {
      left = config.ev.clientX - el_width;
      top = this.area[1] - config.ev.clientY < el_height ? config.ev.clientY - el_height - 20 : config.ev.clientY + 15;
      if (top < 0) {
        left = left - 30;
        top = (this.area[1] - config.el.height()) / 2;
      }
    }
    config.el
      .css({
        left: left + 10,
        top: top,
        'max-height': isGreaterScreen ? 'none' : this.area[1] - 20 + 'px',
        'overflow-y': isGreaterScreen ? 'initial' : 'auto',
      })
      .removeClass('left_menu right_menu')
      .addClass(this.area[0] - (left + el_width) < 230 ? 'left_menu' : 'right_menu');

    // 子菜单鼠标移动事件
    el.children('li').mouseenter(function (e) {
      var $this = $(this);
      var $submenu = $this.find('.file_menu_down .set_group');
      if ($submenu.length <= 0) return;

      var menuHeight = $submenu.height();
      var rect = $this[0].getBoundingClientRect();
      var bottom = $(window).height() - rect.top;
      if (!isGreaterScreen) {
        //设置子级ul脱离文档流
        $submenu.css({
          position: 'fixed',
          top: el.scrollTop() + rect.top,
          left: moreLink ? rect.right - 358 : rect.right, //chrome下包含了滚动条宽度，需去除
          right: 0,
        });
      } else {
        $submenu.removeAttr('style');
      }
      if (menuHeight >= bottom) {
        $submenu.css({
          top: -(menuHeight - 20) + 'px',
        });
      }
    });

    // 产品推荐
    this.change_file_menu_icon('rsync', 'rsync', 'pro');
    this.change_file_menu_icon('copy_file', 'copy_file', 'ltd');
    this.change_file_menu_icon('topping', 'topping', 'ltd');
    this.change_file_menu_icon('file_real_time_log', 'file_real_time_log', 'ltd');
    this.change_file_menu_icon('send_mail', 'send_mail', 'ltd');
  },
  /**
   * @description 修改右键专属文字提醒
   * @param {String} class   拼接的class
   * @param {String} icon   icon
   * @param {String} version   专业版、企业版
   */
  change_file_menu_icon: function (name, icon, version) {
    var $icon = $('.file_menu_icon.' + name + '_file_icon');
    if (name != 'copy_file') $icon.css('cssText', 'background-image:url(/static/img/soft_ico/ico-' + icon + '.png);background-size:20px 18px!important;width:20px;height: 18px;margin-left: -2px;');
    var $li = $icon.parents('li');
    // $li.append('<span style="position: absolute; top: 4px; right: 28px; font-weight: initial;" class="new-'+version+'-icon new-file-icon"></span>')
  },
  /**
   * @description 返回后缀类型说明
   * @param {String} ext 后缀类型
   * @return {String} 文件类型
   */
  ext_type_tips: function (ext) {
    var config = {
      ai: 'Adobe Illustrator格式图形',
      apk: '安卓安装包',
      asp: '动态网页文件',
      bat: '批处理文件',
      bin: '二进制文件',
      bas: 'BASIC源文件',
      bak: '备份文件',
      css: 'CSS样式表',
      cad: '备份文件',
      cxx: 'C++源代码文件',
      crt: '认证文件',
      cpp: 'C++代码文件',
      conf: '配置文件',
      dat: '数据文件',
      der: '认证文件',
      doc: 'Microsoft Office Word 97-2003 文档',
      docx: 'Microsoft Office Word 2007 文档',
      exe: '程序应用',
      gif: '图形文件',
      go: 'Go语言源文件',
      htm: '超文本文档',
      html: '超文本文档',
      ico: '图形文件',
      java: 'Java源文件',
      access: '数据库文件',
      jsp: 'HTML网页',
      jpe: '图形文件',
      jpeg: '图形文件',
      jpg: '图形文件',
      log: '日志文件',
      link: '快捷方式文件',
      js: 'Javascript源文件',
      mdb: 'Microsoft Access数据库',
      mp3: '音频文件',
      ape: 'CloudMusic.ape',
      mp4: '视频文件',
      avi: '视频文件',
      mkv: '视频文件',
      rm: '视频文件',
      mov: '视频文件',
      mpeg: '视频文件',
      mpg: '视频文件',
      rmvb: '视频文件',
      webm: '视频文件',
      wma: '视频文件',
      wmv: '视频文件',
      swf: 'Shockwave Flash Object',
      mng: '多映像网络图形',
      msi: 'Windows Installe安装文件包',
      png: '图形文件',
      py: 'Python源代码',
      pyc: 'Python字节码文件',
      pdf: '文档格式文件',
      ppt: 'Microsoft Powerpoint 97-2003 幻灯片演示文稿',
      pptx: 'Microsoft Powerpoint2007 幻灯片演示文稿',
      psd: 'Adobe photoshop位图文件',
      pl: 'Perl脚本语言',
      rar: 'RAR压缩文件',
      reg: '注册表文件',
      sys: '系统文件',
      sql: '数据库文件',
      sh: 'Shell脚本文件',
      txt: '文本格式',
      vb: 'Visual Basic的一种宏语言',
      xml: '扩展标记语言',
      xls: 'Microsoft Office Excel 97-2003 工作表',
      xlsx: 'Microsoft Office Excel 2007 工作表',
      gz: '压缩文件',
      zip: 'ZIP压缩文件',
      z: '',
      '7z': '7Z压缩文件',
      json: 'JSON文本',
      php: 'PHP源文件',
      mht: 'MHTML文档',
      bmp: 'BMP图片文件',
      webp: 'WEBP图片文件',
      cdr: 'CDR文件',
    };
    return typeof config[ext] != 'undefined' ? config[ext] : '未知文件';
  },

  /**
   * @description 文件类型判断，或返回格式类型(不传入type)
   * @param {String} ext
   * @param {String} type
   * @return {Boolean|Object} 返回类型或类型是否支持
   */
  determine_file_type: function (ext, type) {
    var config = {
        images: ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff', 'ico', 'JPG', 'webp'],
        compress: ['zip', 'rar', 'gz', 'war', 'tgz', '7z'],
        video: ['mp4', 'mp3', 'mpeg', 'mpg', 'mov', 'avi', 'webm', 'mkv', 'mkv', 'mp3', 'rmvb', 'wma', 'wmv'],
        ont_text: ['iso', 'xlsx', 'xls', 'doc', 'docx', 'tiff', 'exe', 'so', 'bz', 'dmg', 'apk', 'pptx', 'ppt', 'xlsb', 'pdf'],
      },
      returnVal = false;
    if (ext) ext = ext.toLowerCase();
    if (type != undefined) {
      if (type == 'text') {
        $.each(config, function (key, item) {
          $.each(item, function (index, items) {
            if (items == ext) {
              returnVal = true;
              return false;
            }
          });
        });
        returnVal = !returnVal;
      } else {
        if (typeof config[type] == 'undefined') return false;
        $.each(config[type], function (key, item) {
          if (item == ext) {
            returnVal = true;
            return false;
          }
        });
      }
    } else {
      $.each(config, function (key, item) {
        $.each(item, function (index, items) {
          if (items == ext) {
            returnVal = key;
            return false;
          }
        });
      });
      if (typeof returnVal == 'boolean') returnVal = 'text';
    }
    return returnVal;
  },

  /**
   * @description 右键菜单事件组
   * @param {Object} data 当前文件或文件夹右键点击的数据和数组下标，以及Dom元素
   * @return void
   */
  file_groud_event: function (data) {
    var that = this;
    var ltd_cookie = bt.get_cookie('ltd_end') > 0;
    if ($.inArray(data.open, that.cloud_storage_type_list) > -1) {
      //上传/下载云存储
      var down_item = {
        ps: '将文件上传到远程服务器，配合对应插件使用，完成文件的快速传输，实现文件转移,支持多种远程云服务。',
        description: ['百度云存储', '阿里云OSS', '腾讯云COS', '华为云存储'],
        pluginName: '上传云存储',
        preview: false,
        imgSrc: 'https://www.bt.cn/Public/new/plugin/introduce/files/uploadServer.png',
      };
      if (!that.check_ltd_end(down_item, 73, { imgArea: ['1010px', '646px'] })) return;
      this.get_cosfs_upload_list(data);
      return false;
    }
    switch (data.open) {
      case 'vsopen':
        openVsEditorView({parentPath: that.file_path,type: data.type,path: data.path})
        break
      case 'open': // 打开目录、文件编辑、预览图片、播放视频
        if (data.type == 'dir') {
          this.reader_file_list({ path: data.path });
        } else {
          switch (data.open_type) {
            case 'text':
              openEditorView(0, data.path);
              break;
            case 'video':
              this.open_video_play(data);
              break;
            case 'images':
              this.open_images_preview(data);
              break;
            case 'compress':
              var top_item = {
                ps: '可以在解压压缩包之前预览其内容，支持解压整个压缩包或选择性解压某些文件。',
                description: ['快速预览压缩包中的内容', '支持ZIP、GZ、RAR格式', '支持选择性解压'],
                pluginName: '压缩包文件预览',
                preview: false,
                imgSrc: 'https://www.bt.cn/Public/new/plugin/introduce/files/file_compress.png',
              };
              if (!that.check_ltd_end(top_item, 171, { imgArea: ['607px', '445px'] })) return;
              this.comp_files_preview(data);
              break;
          }
        }
        break;
      case 'importDatabase'://导入数据库
        bt_tools.send({ url: '/data?action=getData', data: { table: 'databases' } }, function (res) {
          var dbList = res.data
          bt_tools.open({
            title: '导入数据库',
            area: ['400px', '180px'],
            btn: ['导入', '取消'],
            content: '<div id="bt-import-database-dialog"></div>',
            success:function(layers){
              $(layers).find('.layui-layer-content').css('overflow','inherit')
              bt_tools.form({
                el:'#bt-import-database-dialog',
                class:'pd20',
                form:[
                  {
                    label:'数据库名',
                    group:{
                      type:'select',
                      name:'name',
                      width:'200px',
                      placeholder:'请选择数据库',
                      list:(function(){
                        var list = [];
                        for(var i=0;i<dbList.length;i++){
                          list.push({title:dbList[i].name,value:dbList[i].name});
                        }
                        return list;
                      })()
                    }
                  }
                ]
              })
            },
            yes:function(indexs,layero){
              var name = layero.find('select[name="name"]').val();
              if(!name){
                layer.msg('请选择数据库');
                return false;
              }
              bt.confirm({ title: '导入数据库', msg: '是否将【'+data.filename+'】文件，导入【'+name+'】数据库中，是否继续？', icon: 0 }, function (index) {
                layer.close(index);
                bt_tools.send({url:'/database?action=InputSql',data:{name:name,file:data.path}},function(res){
                  bt_tools.msg(res);
                  if(res.status){
                    layer.close(indexs);
                  }
                })
              });
            }
          })
        },'获取数据库列表')
        break;
      case 'download': //下载
        this.down_file_req(data);
        break;
      case 'splitFile': // 文件拆分
        this.split_file(data);
        break;
      case 'joinFile': // 文件合并
        this.join_file(data);
        break;
      case 'share': // 添加分享文件
        this.set_file_share(data);
        break;
      case 'cancel_share': // 取消分享文件
        this.info_file_share(data);
        break;
      case 'favorites': //添加收藏夹
        this.$http('add_files_store', { path: data.path }, function (res) {
          if (res.status) {
            that.file_list[data.index] = $.extend(that.file_list[data.index], { caret: true });
            that.reader_file_list_content(that.file_list);
            that.load_favorites_index_list();
          }
          layer.msg(res.msg, { icon: res.status ? 1 : 2 });
        });
        break;
      case 'cancel_favorites': //取消收藏
        this.cancel_file_favorites(data);
        break;
      case 'topping': //置顶
        var top_item = {
          ps: '在文件视图中置顶对应的目录或者文件，便于用户快速查找与定位重要文件。',
          description: ['快速定位', '视觉重心'],
          pluginName: '文件/目录置顶',
          preview: false,
          imgSrc: 'https://www.bt.cn/Public/new/plugin/introduce/files/fileTop.png',
        };
        if (!that.check_ltd_end(top_item, 77, { imgArea: ['994px', '364px'] })) return;
        bt_tools.send({ url: '/files/logs/set_topping_status', data: { data: JSON.stringify({ sfile: data.path, status: 1 }) } }, function (res) {
          if (res.status) {
            that.file_list[data.index] = $.extend(that.file_list[data.index], { topping: true });
            that.reader_file_list({ is_operating: true });
          }
          layer.msg(res.msg, { icon: res.status ? 1 : 2 });
        });
        break;
      case 'cancel_topping': //取消置顶
        this.cancel_file_topping(data);
        break;
      case 'rsync': //数据同步
        try {
          $.each(this.recomConfig.list, function (index, item) {
            if (item.name == data.open) {
              var _title = '',
                _tips = '',
                _status = 0;
              if (!item['isBuy'] || !item['install']) {
                if (item['isBuy'] && !item['install']) {
                  _title = '安装';
                  _tips = '检测到' + item.title + '功能没有安装，是否立即安装开启使用';
                } else {
                  //   item.description = ['支持多设备','支持文件同步','支持异地备份','支持云存储']
                  //   item.imgSrc = 'https://www.bt.cn/Public/new/plugin/'+item.name+'/1.png'
                  // product_recommend.recommend_product_view(item,{imgArea: ['994px','535px']},'ltd',170,item.name)
                  product_recommend.pay_product_sign('pro', 170, 'pro');
                  return false;
                }
              } else {
                that.set_dir_rsync(data);
                return false;
              }
              layer.confirm(_tips, { title: _title + item.title, closeBtn: 2, icon: 3 }, function () {
                bt.soft.install(item['name']);
              });
            }
          });
        } catch (err) {}
        break;
      case 'file_real_time_log': // 日志文件
        var top_item = {
          ps: '监听日志写入，便于用户快速分析当前最新日志。',
          description: ['实时监听日志写入', '切割最新日志信息', '筛选重要日志'],
          pluginName: '日志写入分析',
          preview: false,
          imgSrc: 'https://www.bt.cn/Public/new/plugin/introduce/files/files_log.png',
        };
        if (!that.check_ltd_end(top_item, 87, { imgArea: ['844px', '528px'] })) return;
        this.get_file_real_time_log_view(data);
        break;
      case 'authority': // 权限
        this.set_file_authority(data);
        break;
      case 'dir_kill': //木马扫描
        this.set_dir_kill(data);
        break;
      case 'copy': // 复制内容
        this.copy_file_or_dir(data);
        break;
      case 'shear': // 剪切内容
        this.cut_file_or_dir(data);
        break;
      case 'rename': // 重命名
        this.rename_file_or_dir(data);
        break;
      case 'compress':
        data['open'] = 'tar_gz';
        this.compress_file_or_dir(data);
        break;
      case 'tar_gz': // 压缩gzip文件
      case 'rar': // 压缩rar文件
      case 'zip': // 压缩zip文件
      case '7z': // 压缩zip文件
        this.compress_file_or_dir(data);
        break;
      case 'unzip':
      case 'folad': //解压到...
        this.unpack_file_to_path(data);
        break;
      case 'refresh': // 刷新文件列表
        $('.file_path_refresh').click();
        break;
      case 'upload': //上传文件
        var path = $('#fileInputPath').attr('data-path');
        uploadFiles.init_upload_path(path);
        uploadFiles.upload_layer();
        break;
      case 'soft_link': //软链接创建
        this.set_soft_link();
        break;
      case 'create_dir': // 新建文件目录
        $('.file_nav_view .create_file_or_dir li').eq(0).click();
        break;
      case 'create_files': // 新建文件列表
        $('.file_nav_view .create_file_or_dir li').eq(1).click();
        break;
      case 'del': //删除
        this.del_file_or_dir(data);
        break;
      case 'paste': //粘贴
        this.paste_file_or_dir();
        break;
      case 'web_shell': // 终端
        web_shell();
        break;
      case 'open_find_dir': // 打开文件所在目录
        this.reader_file_list({ path: this.retrun_prev_path(data.path) });
        break;
      case 'send_mail': // 发送邮箱
        if (/.*[\u4e00-\u9fa5]+.*$/.test(data.filename)) {
          layer.msg('不支持发送含有中文的文件', { icon: 2 });
        } else if (parseFloat(data.size) > 1024 * 1024 * 50) {
          layer.msg('当前文件大小超过50M，暂不支持邮件发送', { icon: 2 });
        } else {
          this.send_mail_view(data);
        }
        break;
      case 'property': //属性
        this.open_property_view(data);
        break;
      case 'copy_file': //副本
        this.create_copy_file(data);
        break;
      case 'format_conversion': //格式转换
        if(data.type == 'dir'){
          return layer.msg('暂不支持文件夹格式转换', { icon: 2 });
        }
        this.file_format_conversion(data);
        break;
    }
  },

  comp_files_path_cache: {},

  /**
   * @description 压缩文件预览
   * @param {array} data 压缩文件路径
   */
  comp_files_preview: function (data) {
    var that = this;
    var path = data.path;
    that.zipPath = path;
    that.zipType = data.ext;
    this.comp_files_path_cache = {};
    this.del_comp_files_cache = [];
    this.comp_current_dir = '';
    if (that.zipType.toUpperCase() == 'RAR') {
      layer.msg('暂时不支持该格式的压缩包', { icon: 5 });
      return false;
    }
    bt.open({
      type: 1,
      title: that.zipType.toUpperCase() + '压缩预览 --【' + path + '】',
      area: ['740px', '660px'],
      skin: 'zipPreview',
      btn: false,
      success: function () {
        // var newPathList = [];
        var $compfileListBody = $('.compfileListBody');
        var $compFilesPreview = $('.compFilesPreview');
        var $bathSelect = $('.compfileListBath .bt_table_select_group');
        var $bathBtn = $('.compfileListBath .set_batch_option');
        var $checkAll = $compFilesPreview.find('.compHeaderItem .fileCheck,.compfileListBath .cust—checkbox');
        var comp_path = '/';
        var zipFileList = [];
        var timer = 0;

        bt_tools.send(
          {
            url: 'files/' + that.zipType + '/get_zip_files',
            data: { data: JSON.stringify({ sfile: path }) },
          },
          function (rdata) {
            isDir(rdata, '');
            rdata = resArray;
            if (!Array.isArray(rdata)) return false;
            zipFileList = rdata;
            newPathList = that.obtain_comp_file_tree(rdata);
            that.comp_files_path_cache[comp_path] = newPathList;
            renderView('/', newPathList);
          },
          '获取压缩包文件'
        );

        // 遍历文件生成树结构方法
        var oldFather = [];
        var resArray = []; // 结果集
        function isDir(data, name, fatherObj) {
          const dictionary = ['file_size', 'compress_size', 'compress_type', 'filename', 'date_time', 'is_dir', 'fullpath'];
          let a = Object.keys(data);
          if (fatherObj !== undefined && !oldFather.includes(fatherObj)) {
            oldFather.push(fatherObj);
          }
          if (name !== '') {
            fatherObj = {
              name: name,
              isDir: true,
              size: 0,
              fileNum: 0,
              dateTime: 0,
              subdirectory: [],
            };
          }
          if (a.length === 0) {
            oldFather.push(fatherObj);
            return undefined;
          }
          let i = 0;
          for (var b = 0; b < a.length; b++) {
            var res = a[b];
            i += 1;
            if (!dictionary.includes(res)) {
              var flag = isDir(data[res], res, fatherObj);
              if (flag !== undefined) {
                if (name !== '') {
                  var resObj = {
                    name: res,
                    isDir: false,
                    size: data[res]['file_size'],
                    dateTime: data[res]['date_time'],
                    fullpath: data[res]['fullpath'],
                  };
                  fatherObj.size = fatherObj.size + data[res]['file_size'];
                  fatherObj.fileNum += 1;
                  fatherObj.subdirectory.push(resObj);
                } else {
                  var resObj = {
                    name: res,
                    isDir: false,
                    size: data[res]['file_size'],
                    dateTime: data[res]['date_time'],
                    fullpath: data[res]['fullpath'],
                  };
                  resArray.push(resObj);
                }
              } else {
                if (oldFather.length > 1) {
                  let a = JSON.parse(JSON.stringify(oldFather[oldFather.length - 1]));
                  oldFather.pop();
                  oldFather[oldFather.length - 1].subdirectory.push(a);
                  oldFather[oldFather.length - 1].size = a.size;
                  oldFather[oldFather.length - 1].fileNum = oldFather[oldFather.length - 1].subdirectory.length;
                } else {
                  resArray.push(oldFather[0]);
                  oldFather.pop();
                }
              }
            } else {
              return true;
            }
          }
        }

        function renderView(dir, list) {
          that.comp_current_dir = dir;
          uncheck();
          that.render_comp_file_path('.compFilesPreview .compDirNavbar .dirList', dir);
          that.render_comp_file_tree('.compFilesPreview .compfileListBody', list);
        }
        var path_string = '';
        function openDirectory(data) {
          comp_path = '/' + data.name;
          path_string = path_string + comp_path;
          if (data.isDir) {
            renderView(path_string, data.subdirectory);
          }
        }

        function checkBatch(active, number) {
          if (!number) number = 0;
          if (active) {
            $bathSelect.addClass('bt-disabled');
            $bathBtn.addClass('bt-disabled btn-default').removeClass('btn-success');
            $bathSelect.find('.bt_select_tips em').text('');
            $bathSelect.find('.bt_select_tips span').text('请选择批量操作');
          } else {
            $bathSelect.removeClass('bt-disabled');
            $bathBtn.removeClass('bt-disabled btn-default').addClass('btn-success');
            $bathSelect.find('.bt_select_tips em').text('(已选中' + number + ')');
          }
        }

        function uncheck() {
          $checkAll.removeClass('active active2');
          $compfileListBody.find('.compBodyItemTd').removeClass('active');
          $bathSelect.find('.bt_selects item').removeClass('active');
          $bathSelect.removeClass('active');
          checkBatch(true);
        }

        // 解压至
        $('.unzipTo').on('click', function () {
          that.unpack_file_to_path(data);
        });

        // 添加文件
        $('.addFileToCom').on('click', function () {
          bt.select_path(
            'addFileToCom',
            'multiple',
            function (path1, pathList) {
              bt_tools.send(
                {
                  url: 'files/' + that.zipType + '/add_zip_file',
                  data: {
                    data: JSON.stringify({
                      sfile: path,
                      r_path: path_string.replace(/^\//, ''),
                      f_list: pathList.length === 1 && pathList[0].substr(pathList[0].length - 1, 1) === '/' ? [(path1 + '/').replace('//', '')] : pathList,
                    }),
                  },
                },
                function (rdata) {
                  bt.msg(rdata);
                  if (rdata.status) {
                    bt_tools.send(
                      {
                        url: 'files/' + that.zipType + '/get_zip_files',
                        data: { data: JSON.stringify({ sfile: path }) },
                      },
                      function (rdata) {
                        if (Array.isArray(rdata)) return false;
                        resArray.length = 0;
                        isDir(rdata, '');
                        rdata = resArray;
                        zipFileList = rdata;
                        newPathList = that.obtain_comp_file_tree(rdata);
                        //初始化缓存
                        that.del_comp_files_cache = [];
                        var strPath = path_string.replace(/^\//, '') === '' ? '/' : path_string.replace(/^\//, '');
                        that.comp_files_path_cache['/'] = newPathList;
                        var item = newPathList;
                        var str = path_string.replace(/^\//, '') === '' || path_string.replace(/^\//, '') === '/';
                        var dataName = path_string
                          .replace(/^\//, '')
                          .split('/')
                          .filter(function (s) {
                            return s !== '';
                          });
                        that.render_comp_file_path('.compFilesPreview .compDirNavbar .dirList', path_string === '' ? '/' : path_string);
                        var dataList = item.filter(function (s) {
                          return s.name === dataName[0];
                        });
                        if (dataName.length > 1) {
                          for (var i = 1; i < dataName.length; i++) {
                            dataList = dataList[0].subdirectory.filter(function (s) {
                              return s.name + '' === dataName[i];
                            });
                          }
                        }
                        if (strPath !== '/') that.comp_files_path_cache[strPath] = dataList;
                        that.render_comp_file_tree('.compFilesPreview .compfileListBody', item ? (str ? item : dataList[0].subdirectory) : []);
                      },
                      '获取压缩包文件'
                    );
                  }
                },
                '添加文件至压缩包'
              );
            },
            bt_file.file_path
          );
        });

        // 搜索
        $compFilesPreview.on('input', '.search_input', function () {
          var val = $(this).val();
          clearTimeout(timer);
          timer = setTimeout(function () {
            var serachList = [];
            if (val === '') return false;
            $.each(zipFileList, function (index, item) {
              if (item.filename.indexOf(val) > -1) {
                var pathList = item.filename.split('/');
                item.title = pathList[pathList.length - 1];
                serachList.push(item);
              }
            });
            that.render_comp_file_tree('.compFilesPreview .compfileListBody', serachList);
          }, 500);
        });

        //  选中下拉列表
        $('.compDirNavbar').on('click', '.dirItem', function () {
          path_string = '';
          var path = $(this).data('path'),
            pathDir = ('/' + path).replace('//', '/'),
            pathList = path.split('/'),
            indexes = '',
            data;
          path = path + '/';
          path = path.replace('//', '').replace(/^\//, '');
          if (path === '') path = '/';
          indexes = pathDir.replace(/^\//, '') + '/';
          path_string = '/' + indexes;
          path_string = path_string.replaceAll('//', '/');
          comp_path = '/' + indexes;
          path_string = path_string.slice(0, path_string.length - 1);
          old_path = path_string.split('/');
          if (pathDir === '/') {
            data = that.comp_files_path_cache['/'];
          } else {
            data = that.comp_files_path_cache[('/' + pathDir).replace('//', '')];
          }
          renderView(pathDir, path === '/' ? data : data[0].subdirectory ? data[0].subdirectory : data);
        });

        // 返回上一层
        var old_path;
        $compFilesPreview.on('click', '.returnUpperStory', function () {
          var pathDir = ('/' + comp_path).replace('//', '/'),
            pathList = comp_path.split('/'),
            indexes = '',
            data;
          path_string = path_string.replaceAll('//', '/');
          path_string = path_string.split('/');
          path_string = path_string.splice(0, path_string.length - 1);
          path_string = path_string.join('/');
          if (pathList[pathList.length - 1] === '') pathList.splice(-1, 1);
          pathDir = pathList.length > 1 ? pathList.join('/') : '/';
          indexes = pathDir.replace(/^\//, '');
          old_path = path_string.split('/');
          if (old_path[old_path.length - 1] === undefined || old_path[old_path.length - 1] === '') {
            data = that.comp_files_path_cache['/'];
            comp_path = '/';
            path_string = '/';
            old_path = [];
          } else {
            var temp_old_path = old_path.join('/');
            var temp_new_path = temp_old_path.slice(1, temp_old_path.length);
            data = that.comp_files_path_cache[temp_new_path];
            comp_path = '/' + data[0].name;
          }
          renderView(path_string, comp_path === '/' ? data : data[0].subdirectory ? data[0].subdirectory : data);
        });

        // 单选
        $compfileListBody.on('click', '.compBodyItemTd', function (ev) {
          var $this = $(this);
          $this.find('.fileCheck').trigger('click');
          ev.preventDefault();
          ev.stopPropagation();
        });

        // 选中当前行
        $compfileListBody.on('click', '.compBodyItemTd .fileCheck', function (ev) {
          var $this = $(this);
          var data = $this.parent().parent().data();
          var checkData = $this.data();
          var $parentItem = $(this).parent().parent();
          if ($parentItem.hasClass('active')) {
            $parentItem.removeClass('active');
          } else {
            $parentItem.addClass('active');
          }
          var $checkItem = $compfileListBody.find('.compBodyItemTd');
          var $checkActiveItem = $compfileListBody.find('.compBodyItemTd.active');
          var $checkAll = $compFilesPreview.find('.compHeaderItem .fileCheck,.compfileListBath .cust—checkbox');
          if ($checkActiveItem.length === 0) {
            $checkAll.removeClass('active2 active');
            checkBatch(true);
          }
          if ($checkActiveItem.length > 0) {
            $checkAll.addClass('active2').removeClass('active');
            checkBatch(false, $checkActiveItem.length);
          }
          if ($checkActiveItem.length === $checkItem.length) {
            $checkAll.addClass('active').removeClass('active2');
          }
          return false;
        });

        // 设置批量选项 批量解压
        $compFilesPreview.on('click', '.set_batch_option', function (ev) {
          var title = $('.compfileListBath .bt_select_tips span').text();
          var index = $('.bt_table_select_group .bt_selects .item.active').index();
          if ($(this).hasClass('bt-disabled')) return layer.tips('请选择需要批量操作的文件！', $(this), { tips: [1, 'red'], time: 2000 });
          if (index < 0) return layer.tips('请选择需要批量操作的类型', $(this).prev(), { tips: [1, 'red'], time: 2000 });
          var arry = [];
          bt.open({
            type: 1,
            title: title,
            area: '350px',
            btn: [index === 0 ? '解压文件' : '删除文件', '取消'],
            content:
              '<div class="pd15">' +
              '<div class="line ' +
              (index === 1 ? 'hide' : '') +
              '" style="border-bottom: 1px solid #ececec;"><span class="tname" style="width:70px;">解压目录</span><div class="info-r" style="margin-left:70px;"><input name="path" id="batchComp" value="' +
              bt_file.file_path +
              '" class="bt-input-text mr5" type="text" style="width:210px; margin-right: 10px;" value=""><span class="glyphicon cursor mr5 glyphicon-folder-open"></span></div></div>' +
              '<div id="batchTable"></div>' +
              '</div>',
            yes: function (indexs) {
              layer.close(indexs);
              var filenames = [];
              $.each(arry, function (aindex, item) {
                if (item.isDir) {
                  var temp =  item.name+'/';
                  filenames.push(temp);
                } else {
                  filenames.push(item.fullpath);
                }
              });
              // for (var i in result_arr) {
              // 	filenames.push(result_arr[i]);
              // }
              if (!index) {
                var extract_path = $('#batchComp').val();
                path_string = path_string.replace('//', '/');
                var zip_path = path_string.slice(1, path_string.length);
                if (zip_path === '') {
                  zip_path = '';
                }
                bt_tools.send(
                  {
                    url: 'files/' + that.zipType + '/extract_byfiles',
                    data: {
                      data: JSON.stringify({
                        zip_path: zip_path,
                        sfile: path,
                        extract_path: extract_path,
                        filenames: filenames,
                      }),
                    },
                  },
                  function (rdata) {
                    if (that.duplicateFile(rdata,zip_path,path,extract_path)) {
                      bt.msg(rdata);
                      result_arr = [];
                      uncheck();
                      that.reader_file_list({}, function (res) {});
                    }
                  },
                  '解压压缩包文件'
                );
              } else {
                bt_tools.send(
                  {
                    url: 'files/' + that.zipType + '/delete_zip_file',
                    data: {
                      data: JSON.stringify({
                        sfile: path,
                        filenames: filenames,
                      }),
                    },
                  },
                  function (rdata) {
                    bt.msg(rdata);
                    uncheck();
                    $.each(filenames, function (aindex, item) {
                      that.del_comp_files_cache.push(item);
                    });
                    // 去掉删除掉的文件 重新渲染
                    var strPath = path_string.replace(/^\//, '') === '' ? '/' : path_string.replace(/^\//, '');
                    var item = that.comp_files_path_cache[strPath];
                    var item_del = that.del_comp_files_cache;
                    dataList = item_del.map(function (i) {
                      return i.replace(strPath + '/', '');
                    }); // 需要删除的文件
                    if (dataList.length >= 1) {
                      findObj(item);
                    }
                    that.comp_files_path_cache[strPath] = item_data;
                    var str = path_string.replace(/^\//, '') === '' || path_string.replace(/^\//, '') === '/';
                    that.render_comp_file_tree('.compFilesPreview .compfileListBody', item_data.length ? (str ? item_data : item_data[0].subdirectory) : []);
                    dataList = [];
                  },
                  '删除压缩包文件'
                );
              }
            },
            success: function (layers) {
              var itemActiveList = $compfileListBody.find('.active');
              itemActiveList.each(function ($index, item) {
                var data = $(this).data();
                arry.push(data);
              });
              $(layers)
                .find('.glyphicon-folder-open')
                .on('click', function () {
                  bt.select_path('batchComp', 'dir');
                });
              bt_tools.table({
                el: '#batchTable',
                height: '200px',
                data: arry,
                column: [
                  {
                    fid: 'title',
                    title: '文件名',
                    template: function (row) {
                      return '<span>' + row.name + '</span>';
                    },
                  },
                  {
                    fid: 'compress_size',
                    title: '大小',
                    template: function (row) {
                      if (row.isDir) {
                        var row_size = bt.format_size(row.size);
                        if (row_size === '0B') return '<span>' + row_size + '</span>';
                        return '--';
                      } else {
                        return '--';
                      }
                    },
                  },
                ],
              });
            },
          });
        });
        var dataList = [];
        var item_data = [];
        function findObj(item) {
          if (!Array.isArray(item)) item = [item];
          for (var j = 0; j < dataList.length; j++) {
            item_data = item.filter(function (sub) {
              if (sub.subdirectory) {
                sub.subdirectory = sub.subdirectory.filter(function (sub_item) {
                  if (sub_item.name != dataList[j] && sub_item.name + '/' != dataList[j] && sub_item.fullpath != dataList[j]) return sub_item;
                });
                if (sub.subdirectory.length === 0) return item[0];
                return sub;
              } else {
                if (sub.name !== dataList[j] && sub.fullpath !== dataList[j] && sub.name + '/' !== dataList[j]) {
                  return sub;
                }
              }
            });
          }
        }
        // 全选或反选
        $compFilesPreview.on('click', '.compHeaderItem .fileCheck,.compfileListBath .cust—checkbox', function () {
          var $this = $(this);
          var $checkItem = $compfileListBody.find('.compBodyItemTd');
          $bathSelect.find('.bt_selects item').removeClass('active');
          $bathSelect.removeClass('active');

          if ($this.hasClass('active')) {
            $checkAll.removeClass('active');
            $checkItem.removeClass('active');
            checkBatch(!$this.hasClass('active'), $checkItem.length);
          } else {
            $checkAll.addClass('active').removeClass('active2');
            $checkItem.addClass('active');
            checkBatch(!$this.hasClass('active'), $checkItem.length);
          }
        });

        // 渲染下拉列表
        $compFilesPreview.on('click', '.bt_table_select_group', function (ev) {
          var $this = $(this);
          if (!$this.hasClass('bt-disabled')) {
            $this.addClass('active');
          }
        });

        // 批量选择
        $compFilesPreview.on('click', '.bt_table_select_group .bt_selects .item', function () {
          var $this = $(this);
          var $tips = $compFilesPreview.find('.bt_table_select_group').find('.bt_select_tips');
          $this.addClass('active').siblings().removeClass('active');
          setTimeout(function () {
            $compFilesPreview.find('.bt_table_select_group').removeClass('active');
            $tips.find('span').text('批量' + $this.text());
          }, 100);
        });

        // 禁用浏览器右键菜单
        $compfileListBody.on('contextmenu', function (ev) {
          var html = '';
          // $compFilesPreview.
          return false;
        });

        // 双击打开
        $compfileListBody.on('dblclick', '.compBodyItemTd', function (ev) {
          var data = $(this).data(),
            $target = $(ev.target);
          if (!$target.hasClass('fileCheck')) {
            if (data.isDir) {
              openDirectory(data);
            } else {
              $(this).find('.operateCompFiles').click();
            }
          }
        });

        // 打开
        $compfileListBody.on('click', '.compBodyItem .openDir', function (ev) {
          var arry = [];
          var data = $(this).parent().parent().parent().data();
          arry.push(data);
          var item = $('.dirList .dirItem');
          var str =
            item
              .eq(item.length - 1)
              .find('a')
              .prop('title')
              .replace(that.zipPath + '/', '') + '/';
          var name = (str === '/' ? '' : str) + data.name;
          that.comp_files_path_cache[name] = that.comp_files_path_cache[name] ? that.comp_files_path_cache[name] : arry;
          if (data.isDir) {
            openDirectory(that.comp_files_path_cache[name][0]);
          } else {
            $(this).find('.operateCompFiles').click();
          }
          ev.stopPropagation();
          ev.preventDefault();
        });

        // 编辑压缩文件
        $compfileListBody.on('click', '.compBodyItem .operateCompFiles', function (ev) {
          var dataPath = $(this).attr('data-path');
          var re1 = new RegExp('/', 'g');
          var idDataPath = '#' + dataPath.replace(re1, '_').replaceAll('.', '_');
          var data = $(this).parent().parent().parent().data();
          if (data.title) {
            var title = data.title.split('.');
            var ext = title[title.length - 1];
            ext = that.determine_file_type(ext);
          }
          bt.editor({
            path: data.name,
            mode: ext,
            success: function (editor) {
              bt_tools.send(
                {
                  url: 'files/' + that.zipType + '/get_fileinfo_by',
                  data: { data: JSON.stringify({ sfile: path, filename: data.fullpath }) },
                },
                function (rdata) {
                  if (!rdata.status) layer.msg(rdata.msg);
                  editor.setValue(rdata.data === null ? '' : rdata.data);
                  editor.moveCursorTo(0, 0);
                  editor.focus();
                },
                '获取文件内容'
              );
            },
            // 保存后的回调
            saveCallback: function (editor) {
              bt_tools.send(
                {
                  url: 'files/' + that.zipType + '/write_zip_file',
                  data: { data: JSON.stringify({ sfile: path, filename: data.fullpath, data: editor.getValue() }) },
                },
                function (rdata) {
                  var modifyTime = parseInt(new Date().getTime() / 1000);
                  var spanTime = '<span>' + bt.format_data(modifyTime) + '</span>';
                  var arrEach = function (arr) {
                    arr.forEach(item => {
                      if (item.fullpath == dataPath) {
                        item.dateTime = modifyTime;
                      } else {
                        if ('subdirectory' in item) {
                          arrEach(item.subdirectory);
                        }
                      }
                    });
                  };
                  arrEach(newPathList);
                  $(idDataPath).html(spanTime);
                  bt.msg(rdata);
                },
                '保存文件内容'
              );
            },
          });
          ev.stopPropagation();
          ev.preventDefault();
        });

        // 解压文件 单个
        $compfileListBody.on('click', '.decompFiles', function (ev) {
          var data = $(this).parent().parent().parent().data();
          bt.open({
            type: 1,
            title: '解压压缩包文件-[' + data.name + ']',
            area: '350px',
            btn: ['解压文件', '取消'],
            content:
              '<div class="pd15">' +
              '<div class="line"><span class="tname" style="width:70px;">解压目录</span><div class="info-r" style="margin-left:70px;"><input name="path" id="batchComp" value="' +
              bt_file.file_path +
              '" class="bt-input-text mr5" type="text" style="width:210px; margin-right: 10px;" value=""><span class="glyphicon cursor mr5 glyphicon-folder-open"></span></div></div>' +
              '</div>',
            success: function (layers) {
              $(layers)
                .find('.glyphicon-folder-open')
                .on('click', function () {
                  bt.select_path('batchComp', 'dir');
                });
            },
            yes: function (indexs) {
              layer.close(indexs);
              var extract_path = $('#batchComp').val();
              var fullpath = [data.fullpath];
              var temp = path_string.slice(1, path_string.length);
              if (data.isDir) {
                temp = data.name+ '/';
                result_arr = [temp];
              } else {
                result_arr = fullpath;
              }
              var zip_path = path_string.slice(1, path_string.length);
              if (zip_path === '') zip_path = '';
              bt_tools.send(
                {
                  url: 'files/' + that.zipType + '/extract_byfiles',
                  data: {
                    data: JSON.stringify({
                      zip_path: zip_path,
                      sfile: path,
                      extract_path: extract_path,
                      filenames: result_arr,
                    }),
                  },
                },
                function (rdata) {
                  if (that.duplicateFile(rdata,zip_path,path,extract_path)) {
                    result_arr = [];
                    bt.msg(rdata);
                    that.reader_file_list({}, function (res) {});
                  }
                },
                '解压压缩包文件'
              );
            },
          });
          ev.stopPropagation();
          ev.preventDefault();
        });

        // 文件赋值遍历方法
        var result_arr = [];
        function dir_each(dir, path) {
          if (dir.isDir) {
            result_arr.push(path + '/');
            var sub_item = dir.subdirectory;
            for (var r = 0; r < sub_item.length; r++) {
              if (sub_item[r].isDir) {
                dir_each(sub_item[r], path + '/' + sub_item[r].name);
              } else {
                result_arr.push(sub_item[r].fullpath);
              }
            }
          } else {
            result_arr.push(dir.fullpath);
          }
        }
        function dir_each_delete(dir, path) {
          if (dir.isDir) {
            var sub_item = dir.subdirectory;
            for (var k = 0; k < sub_item.length; k++) {
              dir_each_delete(sub_item[k], path);
              if (sub_item[k].fullpath) path = sub_item[k].fullpath.replace(sub_item[k].name, '');
            }
            result_arr.push(path);
          } else {
            result_arr.push(dir.fullpath);
          }
        }
        // 删除压缩文件single
        $compfileListBody.on('click', '.compBodyItem .deleteCompFiles', function (ev) {
          var data = $(this).parent().parent().parent().data();
          layer.confirm(
            '删除当前文件，删除后文件将彻底，是否继续操作？',
            {
              title: '删除压缩包文件-[' + data.name + ']',
              area: '350px',
              closeBtn: 2,
              icon: 0,
            },
            function (indexs) {
              var fullpath = [data.fullpath];
              var temp = path_string.slice(1, path_string.length);
              if (data.isDir) {
                temp = temp + '/' + data.name;
                dir_each_delete(data, temp);
              } else {
                result_arr = fullpath;
              }
              bt_tools.send(
                {
                  url: 'files/' + that.zipType + '/delete_zip_file',
                  data: { data: JSON.stringify({ sfile: path, filenames: result_arr }) },
                },
                function (rdata) {
                  bt.msg(rdata);
                  that.del_comp_files_cache.push(data.name);
                  // 去掉删除掉的文件 重新渲染
                  var strPath = path_string.replace(/^\//, '') === '' ? '/' : path_string.replace(/^\//, '');
                  var item = that.comp_files_path_cache[strPath];
                  var item_del = that.del_comp_files_cache;
                  dataList = item_del.map(function (i) {
                    return i.replace(strPath + '/', '');
                  }); // 需要删除的文件
                  if (dataList.length >= 1) {
                    findObj(item);
                  }
                  var str = path_string.replace(/^\//, '') === '' || path_string.replace(/^\//, '') === '/';
                  that.render_comp_file_tree('.compFilesPreview .compfileListBody', item ? (str ? item : item_data[0].subdirectory) : []);
                  layer.close(indexs);
                },
                '删除压缩包文件'
              );
            }
          );
          ev.stopPropagation();
          ev.preventDefault();
        });
      },
      content:
        '<div class="compFilesPreview">' +
        '<div class="compToolbarHeader tootls_group">' +
        '<div class="toolbar-left">' +
        '<button class="btn btn-sm btn-success mr10 unzipTo" title="解压总文件压缩包至指定文件夹">解压至</button>' +
        (that.zipType === 'rar' ? '' : '<button class="btn btn-sm btn-default addFileToCom" title="添加文件至当前压缩包">添加文件</button>') +
        '</div>' +
        '</div>' +
        '<div class="compDirNavbar">' +
        '<div class="returnUpperStory">' +
        '<a href="javascript:;" class="btlink">返回上一层</a>' +
        '</div>' +
        '<div class="dirList"></div>' +
        '</div>' +
        '<div class="compfileList">' +
        '<div class="compfileListHeader">' +
        '<div class="compHeaderItem" style="width: 40px"><div class="fileCheck" data-type="all"></div></div>' +
        '<div class="compHeaderItem" style="width: 23%;"><span>名称</span></div>' +
        '<div class="compHeaderItem" style="width: 14%;"><span>大小</span></div>' +
        '<div class="compHeaderItem" style="flex: 1;"><span>修改时间</span></div>' +
        '<div class="compHeaderItem" style="width: 19%;text-align: right;"><span>操作</span></div>' +
        '</div>' +
        '<div class="compfileListBody file_list_content" ' +
        (that.zipType === 'rar' ? 'style="max-height: 380px;"' : '') +
        '></div>' +
        '</div>' +
        '<div class="compfileListBath">' +
        '<div class="bt_batch">' +
        '<label><i class="cust—checkbox" data-checkbox="all"></i><input type="checkbox" class="cust—checkbox-input"></label>' +
        '<div class="bt_table_select_group bt-disabled not-select">' +
        '<span class="bt_select_value">' +
        '<span class="bt_select_tips"><span>请选择批量操作</span><em></em></span>' +
        '<span class="glyphicon glyphicon-triangle-bottom ml5"></span>' +
        '</span>' +
        '<ul class="bt_selects">' +
        '<li class="item">解压文件</li>' +
        '<li class="item">删除文件</li>' +
        '</ul>' +
        '</div>' +
        '<button type="button" class="btn btn-default btn-sm set_batch_option bt-disabled">批量操作</button>' +
        '</div>' +
        '</div>' +
        (that.zipType === 'rar' ? '<ul class="help-info-text c7"><li>RAR压缩预览不支持添加文件至当前压缩包</li></ul>' : '') +
        '</div>',
    });
  },

  /**
   * @description 获得文件树数据
   * @param {array} list 所有文件
   * @param {string} path 当前路径
   */
  obtain_comp_file_tree: function (list, path) {
    var root = [];
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (item.name) {
        var chain = item.name.split('/'); // 获取当前文件或目录层级
      }
      var currentHierarchy = root; // 将生成的目录结构缓存
      for (var j = 0; j < chain.length; j++) {
        var wantedNode = chain[j];
        if (wantedNode === '') {
          continue;
        }
        var lastHierarchy = currentHierarchy;

        // 遍历root是否已有该层级
        for (var k = 0; k < currentHierarchy.length; k++) {
          if (currentHierarchy[k].title === wantedNode) {
            currentHierarchy = currentHierarchy[k].children;
            break;
          }
        }

        if (lastHierarchy === currentHierarchy) {
          var newNode = {};
          $.extend(
            newNode,
            {
              children: [],
              title: wantedNode,
            },
            item
          );
          // 清空多余children结构
          if (j === chain.length - 1) {
            delete newNode.children;
          }
          currentHierarchy.push(newNode);
          currentHierarchy = newNode.children;
        }
      }
    }
    return root;
  },

  /**
   * @description 渲染文件树
   * @param {string} el 插入节点
   * @param {array} list 数据结构
   */
  render_comp_file_tree: function (el, list) {
    var $el = $(el),
      that = this;
    if (!Array.isArray(list)) list = [];
    // $el.attr('class','')
    // $el.removeClass('file_list_content')
    $el.empty();
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (item.name) {
        var title = item.name.split('.');
        var ext = title[title.length - 1];
      }
      var openType = this.determine_file_type(ext);
      if (this.del_comp_files_cache.indexOf(item.name) > -1) continue;
      $el.append(
        $(
          '<div class="compBodyItemTd">' +
          '<div class="compBodyItem" style="width: 40px"><div class="fileCheck"></div></div>' +
          '<div class="compBodyItem" style="width: 23%;">' +
          '<span>' +
          '<a href="javascript:;" class="openDir">' +
          '<i class="file_icon file_' +
          (item.isDir ? 'folder' : ext) +
          '"></i>' +
          '<span class="fileName" title="' +
          item.name +
          '">' +
          item.name +
          '</span>' +
          '</a>' +
          '</span>' +
          '</div>' +
          '<div class="compBodyItem" style="width: 14%;"><span>' +
          (!item.isDir ? bt.format_size(item.size) : '--') +
          '</span></div>' +
          '<div class="compBodyItem" id="' +
          (item.fullpath ? item.fullpath.replaceAll('/', '_').replaceAll('.', '_') : ' ') +
          '" style="flex: 1;"><span>' +
          (!item.isDir ? (isNaN(item.dateTime) ? item.dateTime : bt.format_data(item.dateTime)) : '--') +
          '</span></div>' +
          '<div class="compBodyItem" style="width: 19%; justify-content: flex-end;">' +
          '<span class="hide">' +
          (openType !== 'text' || !!item.isDir || that.zipType === 'rar'
            ? ''
            : '<a href="javascript:;" class="btlink operateCompFiles" data-path="' + (item.fullpath ? item.fullpath : ' ') + '" data-event="editor">编辑</a>&nbsp;&nbsp;|&nbsp;&nbsp;') +
          '<a href="javascript:;" class="btlink decompFiles" data-event="decompression">解压</a>&nbsp;&nbsp;|&nbsp;&nbsp;' +
          '<a href="javascript:;" class="btlink deleteCompFiles" data-event="delel">删除</a>' +
          '</span>' +
          '</div>' +
          '</div>'
        ).data(item)
      );
    }
  },
  /**
   * @description 渲染压缩文件路径
   * @param {string} el 插入节点
   * @param {string} path 路径
   */
  render_comp_file_path: function (el, path) {
    var that = this;
    path = path.replace('//', '/');
    var $el = $(el),
      pathList = path.split('/'),
      currentPath = '',
      $returnUpperStory = $el.parent().find('.returnUpperStory');
    var html = '<div class="dirItem_more"><a href="javascript:;" title="部分目录已经省略">...</a><i class="iconfont icon-arrow-right"></i></div>';
    $el.empty();
    if (pathList[pathList.length - 1] === '') pathList.splice(-1, 1);
    if (pathList.length === 1) {
      $returnUpperStory.hide();
    } else {
      $returnUpperStory.show();
    }
    for (var i = 0; i < pathList.length; i++) {
      var item = pathList[i];
      currentPath += '/' + item;
      if (i > 2 && i < pathList.length - 1 && pathList.length > 4) {
        i == pathList.length - 2 ? $el.append(html) : '';
      } else {
        $el.append(
          $(
            '<div class="dirItem">' +
            '<a href="javascript:;" title="' +
            that.zipPath +
            currentPath.replace('//', '/') +
            '" class="' +
            (i === pathList.length - 1 ? '' : 'btlink') +
            '">' +
            (i === 0 ? '当前压缩包' : item) +
            '</a><i class="iconfont icon-arrow-right"></i>' +
            '</div>'
          ).data('path', currentPath.replace('//', '/'))
        );
      }
    }
  },

  /**
   * @description 搜索文件树
   * @param {string} el 插入节点
   * @param {arry} list 渲染数据
   */
  search_comp_file_tree: function (el, list) {},

  /**
   * @descripttion 列表批量处理
   * @param {String} stype 操作
   * @return: 无返回值
   */
  batch_file_manage: function (stype) {
    var that = this,
      _api = '',
      _fname = [],
      _obj = {},
      _path = $('');
    types = [];
    $.each(this.file_table_arry, function (index, item) {
      if (item.type && types.indexOf(item.type) == -1) {
        types.push(item.type);
      }
      _fname.push(item.filename);
    });
    switch (stype) {
      case 'copy': //复制
      case 'shear': //剪切
        _api = 'SetBatchData';
        _obj['data'] = JSON.stringify(_fname);
        _obj['type'] = stype == 'copy' ? '1' : '2';
        _obj['path'] = that.file_path;
        break;
      case 'del': //删除
        _obj['data'] = JSON.stringify(_fname);
        _obj['type'] = '4';
        _obj['path'] = that.file_path;
        return that.batch_file_delect(_obj);
        break;
      case 'authority': //权限
        _obj['filename'] = '批量';
        _obj['type'] = '3';
        _obj['filelist'] = JSON.stringify(_fname);
        _obj['path'] = that.file_path;
        return that.set_file_authority(_obj, true);
        break;
      case 'foramt_conversion':
        // 循环判定数据中是否存在文件夹，存在则剔除该数据
        // var flag = false
        for (var i = 0; i < that.file_table_arry.length; i++) {
          if (that.file_table_arry[i].type == 'dir') {
            that.file_table_arry.splice(i, 1);
            i--;
          }
        }
        // 数据为空时，提示并返回
        if (that.file_table_arry.length == 0) {
          layer.msg('抱歉,文件夹不支持格式转换',{icon:2})
          // 去除
          return
        }
        this.file_format_conversion(that.file_table_arry,true);
        return
        break;
      case 'compress': //压缩
        var arry_f = that.file_path.split('/'),
          file_title = arry_f[arry_f.length - 1];
        _obj['filename'] = _fname.join(',');
        _obj['open'] = 'tar_gz';
        _obj['path'] = that.file_path + '/' + file_title;
        if (types.length > 1) {
          _obj['type_tips'] = '目录和文件';
        } else if (types[0] == 'dir') {
          _obj['type_tips'] = '目录';
        } else if (types[0] == 'file') {
          _obj['type_tips'] = '文件';
        } else {
          _obj['type_tips'] = '';
        }
        return that.compress_file_or_dir(_obj, true);
        break;
    }
    // 批量标记
    that.$http(_api, _obj, function (res) {
      if (res.status) {
        bt.set_cookie('record_paste_type', stype == 'copy' ? '1' : '2');
        that.clear_table_active();
        $('.nav_group.multi').addClass('hide');
        $('.file_menu_tips').removeClass('hide');
        $('.file_nav_view .file_all_paste').removeClass('hide');
      }
      layer.msg(res.msg, { icon: res.status ? 1 : 2 });
    });
  },
  /**
   * @descripttion 批量删除
   * @param {Object} obj.data   需删除的数据
   * @param {Object} obj.type   批量删除操作
   * @return: 无返回值
   */
  batch_file_delect: function (obj) {
    var that = this;
    if (that.is_recycle == 'true' || (typeof that.is_recycle == 'boolean' && that.is_recycle)) {
      layer.confirm('确认删除选中内容,删除后将移至回收站，是否继续操作?', { title: '批量删除', closeBtn: 2, icon: 3 }, function () {
        that.$http('SetBatchData', obj, function (res) {
          if (res.status) that.reader_file_list({ path: that.file_path });
          layer.msg(res.msg, { icon: res.status ? 1 : 2 });
        });
      });
    } else {
      bt.show_confirm('批量删除', '<span><i style="font-size: 15px;font-style: initial;color: red;">当前未开启回收站，批量删除后将无法恢复，是否继续删除?</i></span>', function () {
        that.$http('SetBatchData', obj, function (res) {
          if (res.status) that.reader_file_list({ path: that.file_path });
          layer.msg(res.msg, { icon: res.status ? 1 : 2 });
        });
      });
    }
  },
  /**
   * @description 批量文件粘贴
   * @return void
   */
  batch_file_paste: function () {
    var that = this,
      _pCookie = bt.get_cookie('record_paste_type');
    this.check_exists_files_req({ dfile: this.file_path }, function (result) {
      if (result.length > 0) {
        var tbody = '';
        for (var i = 0; i < result.length; i++) {
          tbody +=
            '<tr><td><input id="file_check' +
            i +
            '" name="skip_checked" type="checkbox" data-name="' +
            result[i].filename +
            '"></input></td><td><span class="exists_files_style">' +
            result[i].filename +
            '</td><td>' +
            ToSize(result[i].size) +
            '</td><td>' +
            getLocalTime(result[i].mtime) +
            '</td></tr>';
        }
        var mbody =
          '<p style="margin-bottom:10px">以下目标文件名称与源文件相同，点击确定后勾选文件将跳过，<span style="color:red">未勾选文件将会被覆盖</span>，请确认后继续：</p><div class="divtable" style="max-height:350px;overflow:auto;table-layout:fixed"><table class="table table-hover" width="100%" border="0" cellpadding="0" cellspacing="0"><thead><th><input id="file_check" type="checkbox"></th><th>文件名</th><th width="40">大小</th><th>最后修改时间</th></thead>\
				<tbody>' +
          tbody +
          '</tbody>\
				</table></div>';
        SafeMessage('文件跳过提醒', mbody, function (checked_name_arr) {
          that.$http('BatchPaste', { type: _pCookie, path: that.file_path, skip_files: JSON.stringify(checked_name_arr) }, function (rdata) {
            if (rdata.status) {
              bt.set_cookie('record_paste_type', null);
              that.reader_file_list({ path: that.file_path });
            }
            layer.msg(rdata.msg, { icon: rdata.status ? 1 : 2 });
          });
        });
      } else {
        that.$http('BatchPaste', { type: _pCookie, path: that.file_path }, function (rdata) {
          if (rdata.status) {
            bt.set_cookie('record_paste_type', null);
            that.reader_file_list({ path: that.file_path });
          }
          layer.msg(rdata.msg, { icon: rdata.status ? 1 : 2 });
        });
      }
    });
  },

  /**
   * @description 文件内容搜索
   * @return void
   */
  replace_content_view: function () {
    var fileThat = this
    layer.open({
      title: '文件内容搜索',
      type: 1,
      skin: 'replace_content_view',
      area: ['1050px', '670px'],
      zIndex: 19900,
      closeBtn: 2,
      content:'\
			<div style="display:flex;flex-direction:column;padding:20px">\
				<div class="box-top">\
							<div style="display:flex">\
							<div style="position:relative">\
							<select class="bt-input-text mr5 files_type_select " style="width:90px;cursor:pointer" name="files_type_select" ><option value="routine">常规搜索</option><option value="expert">高级搜索</option></select>\
							<select class="bt-input-text mr5 files_name_select " style="width:80px;position:absolute;left:89px;box-shadow:none;margin-left: 6px;cursor:pointer" name="files_name_select" ><option value="files">文件</option><option value="file_name">文件名</option></select>\
							<div class="searchContenInputBox" style="display: inline-block;">\
								<input type="text" id="replaceContentValue" class="bt-input-text replaceContentValue" placeholder="请输入查找的文件内容" AUTOCOMPLETE="off" style="width:804px;padding: 0 126px 0 86px;box-shadow:none;" />\
								<ul class="history_search_list hide"></ul>\
							</div>\
							<div class="input_option" style="display:flex;position:absolute;top:6px;right:10px">\
								<span class="mr4" id="size_write" title="区分大小写">Aa</span>\
								<span class="mr4" id="whole_word" title="全词匹配">[ab]</span>\
								<span id="character" title="正则表达式">.*</span>\
							</div>\
							</div>\
							<button class="normalBtnStyle checkBtn" id="search_file_btn" style="vertical-align:top;margin-left:20px">搜索</button>\
							</div>\
							<div style="display:flex;margin-left:49px;margin-top:10px;flex-direction:column" id="search_box">\
								<div style="display:flex">\
							<div class="replace_content_line" style="width: 530px;margin-bottom: 0;">' +
        '<span class="tname" style="width:46px">目录</span>' +
        '<div class="info-r" style="margin-left:0">' +
        '<input  class="bt-input-text" value="' +
        bt_file.file_path +
        '" type="text" style="width:480px;padding-right:86px" id="replaceContentPath">' +
        '<div class="file_path_switch replaceHasChild" style="right:4px">' +
        '<i class="file_find_checkbox active"></i>' +
        '<span class="laberText">包含子目录</span>\
								<span class="glyphicon cursor glyphicon-folder-open" style="left:68px"></span>\
								</div>\
								</div>\
								</div>\
								<div class="replace_content_line file_ext_box" style="margin-bottom:0;margin-left: 40px;">\
								<span class="tname" style="width:67px">文件后缀</span>\
								<input class="bt-input-text file-search-ext" placeholder="选择或填写后缀类型，使用逗号分隔" style="width: 322px;">\
								<div class="inlineFloatExt"></div>\
								</div>\
								</div>\
								</div>\
								<div class="box-bottom" style="font-size:14px;height:438px;margin-top: 20px;">' +
        fileThat.reader_file_result() +
        '\
				</div>\
				<ul class="help-info-text c7"><li>常规搜索仅支持查询20MB以下文件内容</li></ul>\
			</div>\
			</div>',
      success: function () {
        $('.glyphicon-folder-open').click(function (e) {
          bt.select_path('replaceContentPath')
          e.stopPropagation()
        })
        $('.files_type_select').css({
          outline: 'none',
          border: 'none',
          'box-shadow': 'none'
        });
        var files_form;
        //单选、复选框按钮事件
        $('.checkbox_config,.file_path_switch').click(function (e) {
          if (e.target.localName == 'i' || e.target.localName == 'span') {
            var is_radio = $(this).find('i').hasClass('file_find_radio'),
              i_box = $(this).find('i');
            if (is_radio) {
              //是否单选
              i_box.addClass('active').parent('div').siblings().find('i').removeClass('active');
            } else {
              //是否复选
              if (i_box.hasClass('active')) {
                i_box.removeClass('active');
              } else {
                i_box.addClass('active');
              }
            }
          }
        });
        $('.input_option span').hover(
          function () {
            if(!$(this).hasClass('active')){
              $(this).css({'background': '#efefef','color': '#333'});
            }
          },
          function () {
            $(this).removeAttr('style');
          }
        );
        $('.input_option span').click(function () {
          if ($(this).hasClass('active')) {
            $(this).removeClass('active');
          } else {
            $(this).addClass('active');
          }
        });
        $('#search_file_btn').click(function () {
          var data = {};
          if ($('.files_type_select').val() == 'routine') {
            data = {
              search_content: $('.replaceContentValue').val(),
              exts: $('.file-search-ext').val(), // 搜索后缀
              path: $('#replaceContentPath').val(), // 搜索路径
              is_subdir: $('.file_find_checkbox').hasClass('active') ? true : false, // 是否包含子目录
              is_regular: $('#character').hasClass('active') ? true : false, // fase 普通模式 true 为正则模式
              is_case: $('#size_write').hasClass('active') ? true : false, // true	不区分大小写
              is_word: $('#whole_word').hasClass('active') ? true : false, // true 全词匹配
            };
          } else {
            var formData = files_form.$get_form_value()
            if (formData.stime == 'diy' && (formData.s_time == '' || formData.e_time == '')) return layer.msg('请选择修改时间', { icon: 0 })
            if (formData.ssize == 'diy' && (formData.min_size == '' || formData.max_size == '')) return layer.msg('请输入大小范围', { icon: 0 })
            // 修改时间
            if (formData.stime != 'no_limit' && formData.stime != 'diy') {
              var time = parseInt(new Date().getTime()/1000)
              switch (formData.stime) {
                case 't3':
                  formData.s_time = time - 3 * 3600;
                  formData.e_time = time;
                  break;
                case 'today':
                  formData.s_time = new Date(new Date().toLocaleDateString()).getTime() / 1000
                  formData.e_time = time;
                  break;
                case 'l7':
                  formData.s_time = time - 7 * 24 * 3600;
                  formData.e_time = time;
                  break;
                case 'l30':
                  formData.s_time = time - 30 * 24 * 3600;
                  formData.e_time = time;
                  break;
              }
            } else if (formData.stime == 'no_limit') {
              delete formData.s_time
              delete formData.e_time
            } else if (formData.stime == 'diy') {
              formData.s_time = new Date(Date.parse(formData.s_time)).getTime() / 1000;
              formData.e_time = new Date(Date.parse(formData.e_time)).getTime() / 1000;
            }
            // 文件大小处理
            if (formData.ssize != 'no_limit' && formData.ssize != 'diy') {
              switch (formData.ssize) {
                case '100kb':
                  formData.min_size = '0';
                  formData.max_size = '102400';
                  break;
                case '1mb':
                  formData.min_size = '0';
                  formData.max_size = '1048576';
                  break;
                case '10mb':
                  formData.min_size = '0';
                  formData.max_size = '10485760';
                  break;
              }
            } else if (formData.ssize == 'no_limit') {
              delete formData.min_size
              delete formData.max_size
            } else if (formData.ssize == 'diy') {
              formData.min_size = formData.min_size * 1024 * 1024;
              formData.max_size = formData.max_size * 1024 * 1024;
            }
            data = {
              search_content: $('.replaceContentValue').val(),
              exts: $('.file-search-ext').val(), // 搜索后缀
              path: $('#replaceContentPath').val(), // 搜索路径
              is_subdir: $('.file_find_checkbox').hasClass('active') ? true : false, // 是否包含子目录
              is_regular: $('#character').hasClass('active') ? true : false, // fase 普通模式 true 为正则模式
              is_case: $('#size_write').hasClass('active') ? true : false, // true	不区分大小写
              is_word: $('#whole_word').hasClass('active') ? true : false, // true 全词匹配
              // start_time: $('.file-expert-search').length !== 0 ? files_form.$get_form_value().s_time : '0', // 开始时间
              start_time: formData.s_time, // 开始时间
              end_time: formData.e_time, // 结束事件
              min_size: formData.min_size, //最小文件大小
              max_size: formData.max_size, //最大文件大小
            };
          }
          if(data.exts == '') data.exts = '*' // 默认所有
          fileThat.searchReplaceContent(data);
        });
        $('.files_name_select').change(function () {
          if ($('.files_name_select').val() == 'files') {
            $('#replaceContentValue').attr('placeholder', '请输入文件内容搜索');
          } else {
            $('.files_type_select').val('expert').change();
            $('#replaceContentValue').attr('placeholder', '请输入文件名搜索');
          }
        });
        // 后缀下拉
        $('.file_ext_box').click(function (e) {
          var extBox = $('.inlineFloatExt')
          if(e.target.localName == 'input'){
            if(extBox.hasClass('show')){
              extBox.removeClass('show')
            }else{
              extBox.addClass('show')
            }
          }
          $(document).one('click',function (e) {
            extBox.removeClass('show')
          })
          e.stopPropagation();
        })
        // 搜索切换
        $('.files_type_select').change(function () {
          // 恢复默认
          $('.box-bottom').html(fileThat.reader_file_result())
          if ($(this).val() == 'expert') {
            $('.replace_content_view .help-info-text').addClass('hide');
            if (bt.get_cookie('ltd_end') < 0) {
              $('#search_file_btn').prop('disabled',true).addClass('disabled')
              //提示开通企业版
              $('.box-bottom').html('<div class="mask_layer" style="left: 115px;"><div class="prompt_description" style="height: 46px;width: 264px;line-height: 46px;margin-top: -35px;box-shadow: 1px 1px 50px rgb(0 0 0 / 20%);"><i class="layui-layer-ico layui-layer-ico0" style="width: 20px;height: 20px;display: inline-block;margin-right: 15px;vertical-align: middle;background-size: 700%;"></i>此功能为企业版专享，<a href="javascript:;" class="btlink" onclick="product_recommend.pay_product_sign(\'ltd\', 79, \'ltd\')">立即升级</a></div></div>')
            }
            if($('.file-expert-search').length == 0){
              $('#search_box').append('<div class="file-expert-search" style="margin-left:-30px;margin-top: 10px;"></div>');
              files_form = bt_tools.form({
                el: '.file-expert-search',
                formLabelWidth: '76px',
                data:{ssize:'10mb'},
                form: [
                  {
                    label: '修改时间',
                    group: [
                      {
                        name: 'stime',
                        width: '200px',
                        type: 'select',
                        list: [
                          { title: '不限时间', value: 'no_limit' },
                          { title: '最近3小时', value: 't3' },
                          { title: '最近1天', value: 'today' },
                          { title: '最近7天', value: 'l7' },
                          { title: '最近30天', value: 'l30' },
                          { title: '自定义', value: 'diy' },
                        ],
                        change: function (formData, element, that) {
                          that.config.form[0].group[0].width = formData.stime == 'diy' ? '90px' : '200px';
                          that.config.form[0].group[1].hide = formData.stime == 'diy' ? false : true;
                          that.config.form[0].group[2].hide = formData.stime == 'diy' ? false : true;
                          that.$replace_render_content(0);
                          $('.file-expert-search [name=s_time]').attr('id', 'search_start_time');
                          $('.file-expert-search [name=e_time]').attr('id', 'search_end_time');

                          laydate.render({
                            elem: '#search_start_time',
                            type: 'datetime',
                            value: '',
                            done: function (value) {
                              $('#search_start_time').val(value);
                            },
                          });
                          laydate.render({
                            elem: '#search_end_time',
                            type: 'datetime',
                            value: '',
                            done: function (value) {
                              $('#search_end_time').val(value);
                            },
                          });
                        },
                      },
                      {
                        hide: true,
                        type: 'text',
                        width: '140px',
                        class: 'search_start_time vertBootom',
                        placeholder: '开始修改的时间',
                        name: 's_time',
                      },
                      {
                        hide: true,
                        type: 'text',
                        width: '140px',
                        class: 'search_end_time vertBootom',
                        placeholder: '结束修改的时间',
                        name: 'e_time',
                      },
                    ],
                  },
                  {
                    label: '文件大小',
                    group: [
                      {
                        name: 'ssize',
                        width: '200px',
                        type: 'select',
                        list: [
                          { title: '不限大小', value: 'no_limit' },
                          { title: '0 ~ 100KB', value: '100kb' },
                          { title: '0 ~ 1MB', value: '1mb' },
                          { title: '0 ~ 10MB', value: '10mb' },
                          { title: '自定义', value: 'diy' },
                        ],
                        change: function (formData, element, that) {
                          var isDiy = formData.ssize == 'diy';
                          that.config.form[1].group[0].width = isDiy ? '100px' : '200px';
                          that.config.form[1].group[1].hide = isDiy ? false : true;
                          that.config.form[1].group[2].hide = isDiy ? false : true;
                          that.config.form[1].group[3].hide = isDiy ? false : true;
                          that.config.form[1].group[4].hide = isDiy ? false : true;
                          that.config.form[1].group[5].hide = isDiy ? false : true;

                          that.$replace_render_content(1);
                        },
                      },
                      {
                        hide: true,
                        unit: '大于',
                        class: 'vertBootom pr8',
                      },
                      {
                        hide: true,
                        type: 'number',
                        width: '70px',
                        class: 'vertBootom search_start_size',
                        unit: 'MB',
                        value: '0',
                        name: 'min_size',
                      },
                      {
                        hide: true,
                        unit: ' ',
                        class: 'plr10',
                      },
                      {
                        hide: true,
                        unit: '小于',
                        class: 'vertBootom pr8',
                      },
                      {
                        hide: true,
                        type: 'number',
                        width: '70px',
                        class: 'vertBootom search_end_size',
                        unit: 'MB',
                        value: '10',
                        name: 'max_size',
                      },
                    ],
                  },
                ],
              });
              $('.file-expert-search .bt-form').css('display', 'flex');
              $('.file-expert-search .bt-form').find('.line').last().css('padding', '0');
            }
          } else {
            $('.replace_content_view .help-info-text').removeClass('hide');
            $('#search_file_btn').prop('disabled',false).removeClass('disabled')
            $('.file-expert-search').remove();
            $('.files_name_select').val('files')
          }
        });
        // 渲染历史记录
        $('.searchContenInputBox').click(function (e) {
          if(e.target.localName == 'li') return;
          var list = JSON.parse(bt.get_cookie('file_search_list'))
          if ($.type(list) != 'undefined' || list != null) {
            $('.history_search_list').empty();
            $.each(list, function (index, item) {
              $('.history_search_list').append($('<li></li>').attr('data-key', item).text(item)).removeClass('hide');
            });
          }
          // 输入框输入时隐藏历史记录
          $('#replaceContentValue').on('input', function () {
            $('.history_search_list').addClass('hide');
          });
          $(document).one('click',function (e) {
            $('.history_search_list').addClass('hide');
          })
          e.stopPropagation();
        })
        //选择历史输入
        $('.history_search_list').on('click', 'li', function () {
          $('#replaceContentValue').val($(this).data('key'));
          $('.history_search_list').addClass('hide');
        });
        // 渲染后缀列表
        function renderExtDom() {
          var extList = [
              ['*', '全部'],
              ['no_ext', '无后缀文件'],
              ['php', 'PHP文件'],
              ['py', 'Python文件'],
              ['html', 'HTML文件'],
              ['js', 'JS文件'],
              ['json', 'JSON文件'],
              ['conf', 'Conf配置文件'],
              ['log', 'LOG日志'],
            ],
            extDom = '',
            extArray = [];
          $.each(extList, function (i, v) {
            extDom += '<li data-val="' + v[0] + '">' + v[1] + '</li>';
          });
          $('.inlineFloatExt').append('<div class="mt5"><ul>' + extDom + '</ul></div>');
          $('.inlineFloatExt').on('click', 'li', function () {
            var _ext = $(this).data('val'),
              inputExt = $('.file-search-ext').val().split(',');
            // 优先判断是否为全部
            if (_ext != '*') {
              // 过滤掉一次有可能添加多个逗号的情况
              $.each(inputExt, function (ie, iv) {
                if (iv === '') inputExt.splice(ie, 1);
              });
              if ($.inArray('*', extArray) != -1 || inputExt.length == 0) {
                // 判断上一次或输入框中是否有全部或者输入框为空（手动全部删除）
                extArray = [_ext];
              } else {
                if ($.inArray('*', inputExt) != -1) {
                  // 判断输入的有全部 单独删除
                  inputExt.splice($.inArray('*', inputExt), 1);
                }
                // 合并两个数组 输入和选中的
                var group = extArray.concat(inputExt);
                if (group[0] == '') group = []; // 判断是否为空
                // 去重
                group = $.uniqueSort(group.sort());
                // 当前选中的是否在现有的数组中
                if ($.inArray(_ext, group) == -1) {
                  group.push(_ext);
                } else {
                  group.splice($.inArray(_ext, group), 1);
                }
                // 将数据替换成后缀数组
                extArray = group;
              }
            } else {
              extArray = [_ext];
            }
            $('.file-search-ext').val(extArray.join(','));
          });
        }
        renderExtDom()
      },
    });
  },
  reader_file_result: function () {
    search_html =
      '<div style="color: #bcbcbc; font-size: 20px; text-align: center;line-height:35px;border-top:1px solid #f1f1f1;height:100%;padding-top:83px">键入查找内容以在文件中查询</br><span style="font-size:14px">细致的选项可以有效地缩短检索时间</span></div>\
            ';
    return search_html;
  },
    reader_file_result: function () {
        search_html =
            '<div style="color: #bcbcbc; font-size: 20px; text-align: center;line-height:35px;border-top:1px solid #f1f1f1;height:100%;padding-top:83px">键入查找内容以在文件中查询</br><span style="font-size:14px">细致的选项可以有效地缩短检索时间</span></div>\
            ';
        return search_html;
    },
  /**
   * @description 文件内容搜索結果
   * @returns void
   */
  searchReplaceContent: function (data) {
    if (data.search_content == '') {
      layer.msg('请输入搜索内容', { icon: 0, time: 1000 });
      return;
    }
    var that = this,
      isRoutine = $('.files_type_select').val() === 'routine',
      sear_num = 0,
      search_option_num = 0;
    data.ws_callback = '111';
    data.model_index = 'files';
    data.mod_name = isRoutine?'panelSearch':'search';
    data.def_name = 'get_search';
    if ($('.files_name_select').val() == 'file_name') {
      var search_html =
        '<div>\
				<div class="search_title" style="padding:7px 10px;border:1px solid #DCDFE6;border-bottom:none">\
				</div>\
				<div class="search_content" style="max-height:420px;overflow:auto">\
				</div>\
			</div>\
				';
      $('.box-bottom').html(search_html);
    } else {
      var search_html =
        '\
		<div class="search-box">\
		<div class="box-left">\
		<div class="box-left_top"><span class="left_top_title" style="font-size:12px"></span></div>\
		<div class="box-left_bottom">\
		</div>\
		</div>\
		<div class="box-right">\
		<div class="box-right_top"><span class="right_top_title"></span><div class="search_item_opstion" style="color:#47A95A;cursor:pointer;margin-left:20px;display:none;flex: 1;">编辑</div></div>\
		<div class="box-right_bottom" >\
		</div>\
		</div>\
		';
      $('.box-bottom').html(search_html);
    }
    $('#search_file_btn').prop('disabled',true).addClass('disabled').html('搜索中')
    $('.left_top_title,.search_title').html('<span class="search_loading_title">文件搜索中<img src="/static/img/loading.gif" style="width:16px;height:16px"></span><span class="search_result_title"></span>');

    this.setSearchHistoryList(data.search_content)//设置搜索历史
    // 文件名修改传递参数
    if($('.files_name_select').val() == 'file_name'){
      data.search_name = data.search_content
      delete data.search_content
    }
    getFlieSpeed($('.files_name_select').val(), isRoutine  ? '/ws_panel' : '/ws_model', data, function (info) {
      if (!info) {
        $('#search_file_btn').prop('disabled',false).removeClass('disabled').html('搜索')
        $('.left_top_title,.search_title').find('.search_loading_title').html('搜索结果，')
        if (sear_num == 0) {
          $('.box-bottom').html(
            '<div style="color: #bcbcbc; font-size: 20px; text-align: center;line-height:35px;border-top:1px solid #f1f1f1;height:100%;padding-top:83px">抱歉没有找到“'+ (typeof data.search_content != 'undefined'?data.search_content: data.search_name) +'”相关的结果</div>'
          );
        }
        $('.box-right_top .search_item_opstion').css('display','block');
        return;
      }
      sear_num++;
      search_option_num += info.search_num;

      $('.left_top_title').find('.search_result_title').html((isRoutine?'<br>':'')+'在' + sear_num + '个文件中有' + search_option_num + '个匹配项</span>');
      $('.search_title').find('.search_result_title').html('共' + sear_num + '个文件');
      if ($('.files_name_select').val() == 'file_name') {
        that.render_files_list(info);
      } else {
        that.render_files_content(info);
      }
      //编辑跳转
      $('.editFile').click(function () {
        openEditorView(0, $(this).data('filename'), function (val, aceEitor) {
          aceEditor.ace.execCommand('find');
          aceEditor.ace.find(data.text);
        });
      });
    });

  },
  // 渲染文件列表函数
  render_files_list: function (data) {
    $('.search_content').append(
      '<div class="content_item">\
						<span class="search_item_name">' +
      data.html_path +
      '</span>\
			<span>\
            <span style="width:72px;right:250px;" class="search_name_span mr50">'+bt.format_size(data.size)+'</span>\
				<span style="width:140px" class="search_name_span mr50">'+bt.format_data(data.mtime)+'</span>\
				<span class="search_item_opstion" style="color:#47A95A;cursor:pointer;width: 50px;" data-name="' +
      data.path +
      '">编辑</span></span>\
                </div>\
                '
    );
    $('.search_item_opstion').click(function () {
      if (data.path == $(this).data('name')) {
        openEditorView(0, $(this).data('name'), function (val, aceEitor) {
          aceEditor.ace.execCommand('find');
          aceEditor.ace.find(data.line);
        });
      }

    });
  },
  // 渲染文件内容函数
  render_files_content: function (data) {
    $('.box-left_bottom').append(
      '<div class="left_bottom_item" title="'+ data.name + '（匹配'+ data.search_num +'次）' +'" data-name="' +
      data.path +
      '"><span class="bottom_item_name">' +
      data.name +
      '</span><span class="bottom_item_num">' +
      data.search_num +
      '</span></div>'
    );
    $('.left_bottom_item').eq(0).addClass('active')
    $('.left_bottom_item').click(function () {
      $(this).addClass('active').siblings().removeClass('active')
      if (data.path == $(this).data('name')) {
        $('.box-right_bottom').empty()
        $('.right_top_title').html(data.path).prop('title',data.path);
        $('.search_item_opstion').attr('data-name', $(this).data('name'));
        $.each(data.search_result, function (index, value) {
          $('.box-right_bottom').append('<span>行 ' + value.row_num + '：' + value.line + '</span>');
        });
      }
    });
    $('.search_item_opstion')
      .unbind('click')
      .click(function () {
        openEditorView(0, $('.right_top_title').text(), function (val, aceEitor) {
          aceEditor.ace.execCommand('find');
          aceEditor.ace.find(data.line);
        });
      });
    if ($('.box-right_bottom').find('span').length > 0) {
      return
    }

    $('.right_top_title').html(data.path).prop('title',data.path);
    $('.search_item_opstion').attr('data-name', data.path);
    $.each(data.search_result, function (index, value) {
      $('.box-right_bottom').append('<span>行 ' + value.row_num + '：' + value.line + '</span>');
    });
  },

  /**
   * @description 设置搜索历史列表
   * @param {String} text 查找的文本
   * @returns void
   */
  setSearchHistoryList: function (text) {
    var h_cookie = JSON.parse(bt.get_cookie('file_search_list'));
    if ($.type(h_cookie) === 'undefined' || h_cookie == null) {
      bt.set_cookie('file_search_list', JSON.stringify([text]));
    } else {
      if ($.inArray(text, h_cookie) != -1) return true; //如果已在列表中则跳过
      h_cookie.unshift(text); //数组首位添加查找内容
      if (h_cookie.length > 7) h_cookie.pop(); //超过7位时删除最后一条搜索记录
      bt.set_cookie('file_search_list', JSON.stringify(h_cookie));
    }
  },
  /**
   * @description 转义查找输入的内容特殊字符
   * @param {String} e 查找的内容
   * @returns 返回转义结果
   */
  escodeChange: function (e) {
    if (/(\+|\-|\$|\||\!|\(|\)|\{|\}|\[|\]|\^|\”|\~|\*|\?|\:|\\)/g.test(e)) {
      e = e
        .replace(/(\+|\-|\$|\||\!|\(|\)|\{|\}|\[|\]|\^|\”|\~|\*|\?|\:|\\)/g, '\\$1')
        .replace(/&/g, '&amp;')
        .replace(/\>/g, '&gt;')
        .replace(/\</g, '&lt;');
    }
    return e;
  },
  /**
   * @description 获取实时日志文件
   * @param {String} row 当前文件的数据
   * @return void
   */
  get_file_real_time_log_view: function (row) {
    var that = this;
    this.get_logs_info({ path: row.path, limit: 200 }, function (rdata) {
      var thMd5 = rdata.md5, // 文件md5
        interVal = null; // 定时器;
      layer.open({
        type: 1,
        maxmin: true,
        title: '【' + row.filename + '】日志写入分析',
        area: ['850px', '580px'],
        skin: 'file_monitor_box',
        btn: false,
        content:
          '<div class="pd15">' +
          '<div class="file_monitor_line" style="margin-bottom:10px">' +
          '获取最新: <select class="bt-input-text mr20" name="monitor_line_num">' +
          '<option value="200">200/行</option>' +
          '<option value="500">500/行</option>' +
          '<option value="1000">1000/行</option>' +
          '<option value="2000">2000/行</option>' +
          '<option value="5000">5000/行</option>' +
          '</select>' +
          '自动刷新: <div class="mr20" style="display: inline-block;vertical-align: bottom;">' +
          '<input class="btswitch btswitch-ios" id="refresh_monitor" type="checkbox">' +
          '<label class="btswitch-btn" for="refresh_monitor"></label>' +
          '</div>' +
          '刷新间隔: <input type="number" value="5" name="refresh_time" class="bt-input-text mr10" style="width:60px" >/单位（秒）' +
          '<span class="new_time" style="margin-left:15px"></span>' +
          '</div>' +
          '<div class="file_monitor_line" style="margin-bottom:10px">' +
          '文件路径: <input type="text" class="bt-input-text mr10" style="width:468px" disabled value="' +
          row.path +
          '">' +
          '<div style="display: inline-block;">' +
          '<input type="text" class="bt-input-text mr10" name="log_search_select" style="width:200px" placeholder="搜索关键值/内容">' +
          '<button type="button" class="btn btn-success btn-sm monitor_log_search">搜索</button>' +
          '</div> ' +
          '</div>' +
          '<div class="file_monitor_line bt-logs">' +
          '<textarea class="bt-input-text " name="monitor_content" style="width:100%;height:420px;line-height:22px" readOnly="readonly">' +
          rdata.data +
          '</textarea>' +
          '</div>' +
          '</div>',
        success: function () {
          var _content = $('textarea[name="monitor_content"]'), // 获取内容dom
            _config = { isAuto: false, refreshTime: 5, lineNum: 200 }; // 当前刷新配置

          _content.scrollTop(100000000000);

          setContentRefresh(); //默认执行一次
          // 请求的行数
          $('[name=monitor_line_num]').change(function () {
            clearInterval(interVal);
            _config['lineNum'] = $(this).val();
            setContentRefresh();
          });
          // 自动刷新开关
          $('#refresh_monitor').click(function () {
            var status = $(this).prop('checked');
            _config['isAuto'] = status;
            setContentRefresh();
          });
          // 刷新间隔
          $('[name=refresh_time]').change(function () {
            var _time = $(this).val();
            if (_time <= 1) {
              _time = 2;
              $(this).val(2);
              return layer.msg('刷新间隔不能小于两秒', { icon: 2 });
            }
            _config['refreshTime'] = _time;
            setContentRefresh();
          });
          // 搜索按钮
          $('.monitor_log_search').click(function () {
            getFileMonitorData();
          });
          // 开启、停止自动刷新
          function setContentRefresh() {
            clearInterval(interVal);
            if (_config.isAuto) {
              interVal = setInterval(function () {
                getFileMonitorData();
              }, _config['refreshTime'] * 1000);
            }
          }
          // 获取日志数据
          function getFileMonitorData() {
            that.get_logs_info({ path: row.path, limit: _config.lineNum }, function (res) {
              $('.new_time').text('最后刷新时间：' + bt.format_data(new Date().getTime()));
              if (res.md5 === thMd5) return false;
              thMd5 = res.md5;
              _content.val(res.data).scrollTop(100000000000);
            });
          }
        },
        cancel: function () {
          clearInterval(interVal);
        },
        full: function () {
          // 最大化时
          $('[name=monitor_content]').height($('.file_monitor_box .layui-layer-content').height() - 150);
        },
        restore: function () {
          $('.file_monitor_box .layui-layer-content').height(536);
          $('[name=monitor_content]').height(410);
        },
      });
    });
  },
  /**
   * @param {Object} data 当前文件的数据对象
   * @return void
   */
  open_property_view: function (data) {
    var _this = this;
    _this.$http('get_file_attribute', { filename: data.path }, function (res) {
      layer.open({
        type: 1,
        closeBtn: 2,
        title: '[ ' + data.filename + ' ] - ' + (data.is_dir ? '文件夹' : '文件') + '属性',
        area: ['580px', '520px'],
        shadeClose: false,
        content:
          '<div class="bt-property-setting pd15">\
            <div class="tab-nav">\
              <span class="on">常规</span>\
              <span>详细信息</span>\
              <span>历史版本</span>\
            </div>\
            <div class="tab-con">\
              <div class="property-box file_list_content  active">\
                <div class="attr-box">\
                  <div class="attr-name" style="height: 60px;line-height: 60px;"><i class="file_icon file_' +
          (res.is_link ? 'link' : res.is_dir ? 'folder' : res.st_type) +
          '"></i></div>\
                  <div class="attr-content" style="height: 60px;line-height: 60px;"><input type="text" disabled value="' +
          data.filename +
          '" /></div>\
                </div>\
                <div class="dividing"></div>\
                <div class="attr-box" >\
                  <div class="attr-name">类型:</div>\
                  <div class="attr-content">' +
          (res.is_dir || res.is_link ? res.st_type : _this.ext_type_tips(res.st_type)) +
          '</div>\
                </div>\
                <div class="attr-box" >\
                  <div class="attr-name">文件路径:</div>\
                  <div class="attr-content" style="display: flex;align-items: center;"><span title="' +
          (res.path + '/' + data.filename).replace('//', '/') +
          '">' +
          (res.path + '/' + data.filename).replace('//', '/') +
          '</span><i class="ico-copy cursor btcopy ml5 copyProperytPath" data-clipboard-text="' +
          (res.path + '/' + data.filename).replace('//', '/') +
          '" title="复制文件路径"></i></div>\
                </div>\
                <div class="attr-box" >\
                  <div class="attr-name">大小:</div>\
                  <div class="attr-content">' +
          bt.format_size(res.st_size) +
          ' (' +
          (_this.font_thousandth(res.st_size) + ' 字节') +
          ')' +
          '</div>\
                </div>\
                <div class="dividing"></div>\
                <div class="attr-box">\
                  <div class="attr-name">权限:</div>\
                  <div class="attr-content">' +
          res.mode +
          '</div>\
                </div>\
                <div class="attr-box">\
                  <div class="attr-name">所属组:</div>\
                  <div class="attr-content">' +
          res.group +
          '</div>\
                </div>\
                <div class="attr-box">\
                  <div class="attr-name">所属用户:</div>\
                  <div class="attr-content">' +
          res.user +
          '</div>\
                </div>\
                <div class="dividing"></div>\
                <div class="attr-box">\
                  <div class="attr-name">访问时间:</div>\
                  <div class="attr-content">' +
          bt.format_data(res.st_atime) +
          '</div>\
                </div>\
                <div class="attr-box">\
                  <div class="attr-name">修改时间:</div>\
                  <div class="attr-content">' +
          bt.format_data(res.st_mtime) +
          '</div>\
                </div>\
              </div>\
              <div class="property-box details_box_view">\
                <table>\
                  <thead><tr><th><div style="width:100px">属性</div></th><th><div style="width:400px">值</div></th></tr></thead>\
                  <tbody class="details_list"></tbody>\
                </table>\
              </div>\
              <div class="property-box history_box_view">\
                <table>\
                  <thead><tr><th><div style="width:140px;">修改时间</div></th><th><div style="width:85px;">文件大小</div></th><th><div >MD5</div></th><th><div style="width:90px;text-align:right;">操作</div></th></tr></thead>\
                  <tbody class="history_list"></tbody>\
                </table>\
              </div>\
            </div>\
          </div>',
        success: function (layero, index) {
          var copy_properyt_path = new ClipboardJS('.copyProperytPath');
          copy_properyt_path.on('success', function (e) {
            layer.msg('复制成功!', {
              icon: 1,
            });
          });
          $('.bt-property-setting .tab-nav span').click(function () {
            var index = $(this).index();
            $(this).addClass('on').siblings().removeClass('on');
            $('.property-box:eq(' + index + ')')
              .addClass('active')
              .siblings()
              .removeClass('active');
          });
          $('.history_box_view').on('click', '.open_history_file', function () {
            var _history = $(this).attr('data-time');
            openEditorView(0, data.path);
            setTimeout(function () {
              aceEditor.openHistoryEditorView({ filename: data.path, history: _history }, function () {
                layer.close(index);
                $('.ace_conter_tips').show();
                $('.ace_conter_tips .tips').html(
                  '只读文件，文件为' +
                  data.path +
                  '，历史版本 [ ' +
                  bt.format_data(new Number(_history)) +
                  ' ]<a href="javascript:;" class="ml35 btlink" data-path="' +
                  data.path +
                  '" data-history="' +
                  _history +
                  '">点击恢复左侧历史版本</a>'
                );
              });
            }, 500);
          });
          $('.history_box_view').on('click', '.recovery_file_historys', function () {
            aceEditor.event_ecovery_file(this);
          });
          var config = {
              filename: ['文件名', data.filename],
              type: ['类型', res.is_dir || res.is_link ? res.st_type : _this.ext_type_tips(res.st_type)],
              path: '文件路径',
              st_size: ['文件大小', bt.format_size(res.st_size) + ' (' + (_this.font_thousandth(res.st_size) + ' 字节') + ')'],
              st_atime: ['访问时间', bt.format_data(res.st_atime)],
              st_mtime: ['修改时间', bt.format_data(res.st_mtime)],
              st_ctime: ['元数据修改时间', bt.format_data(res.st_ctime)],
              md5: '文件MD5',
              sha1: '文件sha1',
              user: '所属用户',
              group: '所属组',
              mode: '文件权限',
              lsattr: '特殊权限',
              st_uid: '用户id',
              st_gid: '用户组id',
              st_nlink: 'inode的链接数',
              st_ino: 'inode的节点号',
              st_mode: 'inode保护模式',
              st_dev: 'inode驻留设备',
            },
            html = '',
            html2 = '';
          for (var key in config) {
            if (Object.hasOwnProperty.call(config, key)) {
              var element = config[key],
                value = $.isArray(element) ? element[1] : res[key];
              html +=
                '<tr><td><div style="width:110px">' +
                ($.isArray(element) ? element[0] : element) +
                '</div></td><td><div class="ellipsis" style="width:400px" title="' +
                value +
                '">' +
                value +
                '</div></td></tr>';
            }
          }
          for (var i = 0; i < res.history.length; i++) {
            var item = res.history[i];
            html2 +=
              '<tr><td><div style="width:140px;">' +
              bt.format_data(item.st_mtime) +
              '</div></td><td><div style="width:85px;">' +
              bt.format_size(item.st_size) +
              '</div></td><td><div>' +
              item.md5 +
              '</div></td><td><div style="width:90px;text-align:right;"><a href="javascript:;" class="btlink open_history_file" data-time="' +
              item.st_mtime +
              '">查看</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:;" class="btlink recovery_file_historys" data-history="' +
              item.st_mtime +
              '" data-path="' +
              data.path +
              '">恢复</a></div></td></tr>';
          }
          if (html2 === '') html2 += '<tr><td colspan="4"><div style="text-align: center;">当前文件无历史版本</div></td></tr>';
          $('.details_list').html(html);
          $('.history_list ').html(html2);
          _this.fixed_table_thead('.details_box_view');
          _this.fixed_table_thead('.history_box_view ');
        },
      });
    });
  },
  /**
   * @description 固定表头
   * @param {string} el DOM选择器
   * @return void
   */
  fixed_table_thead: function (el) {
    $(el).scroll(function () {
      var scrollTop = this.scrollTop;
      this.querySelector('thead').style.transform = 'translateY(' + scrollTop + 'px)';
    });
  },
  /**
   * @description 字符千分隔符
   * @param {string} el DOM选择器
   * @return void
   */
  font_thousandth: function (num) {
    var source = String(num).split('.'); //按小数点分成2部分
    source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), '$1,'); //只将整数部分进行都好分割
    return source.join('.'); //再将小数部分合并进来
  },

  /**
   * @description 打开图片预览
   * @param {Object} data 当前文件的数据对象
   * @return void
   */
  open_images_preview: function (data) {
    var that = this,
      mask = $(
        '<div class="preview_images_mask">' +
        '<div class="preview_head">' +
        '<span class="preview_title">' +
        data.filename +
        '</span>' +
        '<span class="preview_small hidden" title="缩小显示"><span class="glyphicon glyphicon-resize-small" aria-hidden="true"></span></span>' +
        '<span class="preview_full" title="最大化显示"><span class="glyphicon glyphicon-resize-full" aria-hidden="true"></span></span>' +
        '<span class="preview_close" title="关闭图片预览视图"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span>' +
        '</div>' +
        '<div class="preview_body"><img id="preview_images" src="/download?filename=' +
        data.path +
        '" data-index="' +
        data.images_id +
        '"></div>' +
        '<div class="preview_toolbar">' +
        '<a href="javascript:;" title="左旋转"><span class="glyphicon glyphicon-repeat reverse-repeat" aria-hidden="true"></span></a>' +
        '<a href="javascript:;" title="右旋转"><span class="glyphicon glyphicon-repeat" aria-hidden="true"></span></a>' +
        '<a href="javascript:;" title="放大视图"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></a>' +
        '<a href="javascript:;" title="缩小视图"><span class="glyphicon glyphicon-zoom-out" aria-hidden="true"></span></a>' +
        '<a href="javascript:;" title="重置视图"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></a>' +
        '<a href="javascript:;" title="图片列表"><span class="glyphicon glyphicon-list" aria-hidden="true"></span></a>' +
        '</div>' +
        '<div class="preview_cut_view">' +
        '<a href="javascript:;" title="上一张"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></a>' +
        '<a href="javascript:;" title="下一张"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></a>' +
        '</div>' +
        '</div>'
      ),
      images_config = {
        natural_width: 0,
        natural_height: 0,
        init_width: 0,
        init_height: 0,
        preview_width: 0,
        preview_height: 0,
        current_width: 0,
        current_height: 0,
        current_left: 0,
        current_top: 0,
        rotate: 0,
        scale: 1,
        images_mouse: false,
      };
    if ($('.preview_images_mask').length > 0) {
      $('#preview_images').attr('src', '/download?filename=' + data.path);
      return false;
    }
    $('body').css('overflow', 'hidden').append(mask);
    images_config.preview_width = mask[0].clientWidth;
    images_config.preview_height = mask[0].clientHeight;
    // 图片预览
    $('.preview_body img').load(function () {
      var img = $(this)[0];
      if (!$(this).attr('data-index')) $(this).attr('data-index', data.images_id);
      images_config.natural_width = img.naturalWidth;
      images_config.natural_height = img.naturalHeight;
      auto_images_size(false);
    });
    //图片头部拖动
    $('.preview_images_mask .preview_head').on('mousedown', function (e) {
      e = e || window.event; //兼容ie浏览器
      var drag = $(this).parent();
      $('body').addClass('select'); //webkit内核和火狐禁止文字被选中
      $(this).onselectstart = $(this).ondrag = function () {
        //ie浏览器禁止文字选中
        return false;
      };
      if ($(e.target).hasClass('preview_close')) {
        //点关闭按钮不能拖拽模态框
        return;
      }
      var diffX = e.clientX - drag.offset().left;
      var diffY = e.clientY - drag.offset().top;
      $(document)
        .on('mousemove', function (e) {
          e = e || window.event; //兼容ie浏览器
          var left = e.clientX - diffX;
          var top = e.clientY - diffY;
          if (left < 0) {
            left = 0;
          } else if (left > window.innerWidth - drag.width()) {
            left = window.innerWidth - drag.width();
          }
          if (top < 0) {
            top = 0;
          } else if (top > window.innerHeight - drag.height()) {
            top = window.innerHeight - drag.height();
          }
          drag.css({
            left: left,
            top: top,
            margin: 0,
          });
        })
        .on('mouseup', function () {
          $(this).unbind('mousemove mouseup');
        });
    });
    //图片拖动
    $('.preview_images_mask #preview_images')
      .on('mousedown', function (e) {
        e = e || window.event;
        $(this).onselectstart = $(this).ondrag = function () {
          return false;
        };
        var images = $(this);
        var preview = $('.preview_images_mask').offset();
        var diffX = e.clientX - preview.left;
        var diffY = e.clientY - preview.top;
        $('.preview_images_mask')
          .on('mousemove', function (e) {
            e = e || window.event;
            var offsetX = e.clientX - preview.left - diffX,
              offsetY = e.clientY - preview.top - diffY,
              rotate = Math.abs(images_config.rotate / 90),
              preview_width = rotate % 2 == 0 ? images_config.preview_width : images_config.preview_height,
              preview_height = rotate % 2 == 0 ? images_config.preview_height : images_config.preview_width,
              left,
              top;
            if (images_config.current_width > preview_width) {
              var max_left = preview_width - images_config.current_width;
              left = images_config.current_left + offsetX;
              if (left > 0) {
                left = 0;
              } else if (left < max_left) {
                left = max_left;
              }
              images_config.current_left = left;
            }
            if (images_config.current_height > preview_height) {
              var max_top = preview_height - images_config.current_height;
              top = images_config.current_top + offsetY;
              if (top > 0) {
                top = 0;
              } else if (top < max_top) {
                top = max_top;
              }
              images_config.current_top = top;
            }
            if (images_config.current_height > preview_height && images_config.current_top <= 0) {
              if (images_config.current_height - preview_height <= images_config.current_top) {
                images_config.current_top -= offsetY;
              }
            }
            images.css({ left: images_config.current_left, top: images_config.current_top });
          })
          .on('mouseup', function () {
            $(this).unbind('mousemove mouseup');
          })
          .on('dragstart', function () {
            e.preventDefault();
          });
      })
      .on('dragstart', function () {
        return false;
      });
    //关闭预览图片
    $('.preview_close').click(function (e) {
      $('.preview_images_mask').remove();
    });
    //图片工具条预览
    $('.preview_toolbar a').click(function () {
      var index = $(this).index(),
        images = $('#preview_images');
      switch (index) {
        case 0: //左旋转,一次旋转90度
        case 1: //右旋转,一次旋转90度
          images_config.rotate = index ? images_config.rotate + 90 : images_config.rotate - 90;
          auto_images_size();
          break;
        case 2:
        case 3:
          if ((images_config.scale == 3 && index == 2) || (images_config.scale == 0.2 && index == 3)) {
            layer.msg(images_config.scale >= 1 ? '图像放大，已达到最大尺寸。' : '图像缩小，已达到最小尺寸。');
            return false;
          }
          images_config.scale = (index == 2 ? Math.round((images_config.scale + 0.4) * 10) : Math.round((images_config.scale - 0.4) * 10)) / 10;
          auto_images_size();
          break;
        case 4:
          var scale_offset = images_config.rotate % 360;
          if (scale_offset >= 180) {
            images_config.rotate += 360 - scale_offset;
          } else {
            images_config.rotate -= scale_offset;
          }
          images_config.scale = 1;
          auto_images_size();
          break;
      }
    });
    // 最大最小化图片
    $('.preview_full,.preview_small').click(function () {
      if ($(this).hasClass('preview_full')) {
        $(this).addClass('hidden').prev().removeClass('hidden');
        images_config.preview_width = that.area[0];
        images_config.preview_height = that.area[1];
        mask.css({ width: that.area[0], height: that.area[1], top: 0, left: 0, margin: 0 }).data('type', 'full');
        auto_images_size();
      } else {
        $(this).addClass('hidden').next().removeClass('hidden');
        $('.preview_images_mask').removeAttr('style');
        images_config.preview_width = 750;
        images_config.preview_height = 650;
        auto_images_size();
      }
    });
    // 上一张，下一张
    $('.preview_cut_view a').click(function () {
      var images_src = '',
        preview_images = $('#preview_images'),
        images_id = parseInt(preview_images.attr('data-index'));
      if (!$(this).index()) {
        images_id = images_id === 0 ? that.file_images_list.length - 1 : images_id - 1;
        images_src = that.file_images_list[images_id];
      } else {
        images_id = images_id == that.file_images_list.length - 1 ? 0 : images_id + 1;
        images_src = that.file_images_list[images_id];
      }
      preview_images.attr('data-index', images_id).attr('src', '/download?filename=' + images_src);
      $('.preview_title').html(that.get_path_filename(images_src));
    });
    // 自动图片大小
    function auto_images_size(transition) {
      var rotate = Math.abs(images_config.rotate / 90),
        preview_width = rotate % 2 == 0 ? images_config.preview_width : images_config.preview_height,
        preview_height = rotate % 2 == 0 ? images_config.preview_height : images_config.preview_width,
        preview_images = $('#preview_images'),
        css_config = {};
      images_config.init_width = images_config.natural_width;
      images_config.init_height = images_config.natural_height;
      if (images_config.init_width > preview_width) {
        images_config.init_width = preview_width;
        images_config.init_height = parseFloat(((preview_width / images_config.natural_width) * images_config.init_height).toFixed(2));
      }
      if (images_config.init_height > preview_height) {
        images_config.init_width = parseFloat(((preview_height / images_config.natural_height) * images_config.init_width).toFixed(2));
        images_config.init_height = preview_height;
      }
      images_config.current_width = parseFloat(images_config.init_width * images_config.scale);
      images_config.current_height = parseFloat(images_config.init_height * images_config.scale);
      images_config.current_left = parseFloat(((images_config.preview_width - images_config.current_width) / 2).toFixed(2));
      images_config.current_top = parseFloat(((images_config.preview_height - images_config.current_height) / 2).toFixed(2));
      css_config = {
        width: images_config.current_width,
        height: images_config.current_height,
        top: images_config.current_top,
        left: images_config.current_left,
        display: 'inline',
        transform: 'rotate(' + images_config.rotate + 'deg)',
        opacity: 1,
        transition: 'all 100ms',
      };
      if (transition === false) delete css_config.transition;
      preview_images.css(css_config);
    }
  },

  /**
   * @description 打开视频播放
   * @param {Object} data 当前文件的数据对象
   * @return void
   */
  open_video_play: function (data) {
    var old_filename = data.path,
      imgUrl = '/download?filename=' + encodeURIComponent(data.path),
      p_tmp = data.path.split('/'),
      path = p_tmp.slice(0, p_tmp.length - 1).join('/');
    layer.open({
      type: 1,
      closeBtn: 2,
      title: '正在播放[<a class="btvideo-title">' + p_tmp[p_tmp.length - 1] + '</a>]',
      area: ['890px', '402px'],
      shadeClose: false,
      skin: 'movie_pay',
      content:
        '<div id="btvideo"><video type="" src="' +
        imgUrl +
        '&play=true" data-filename="' +
        data.path +
        '" controls="controls" controlslist="nodownload" autoplay="autoplay" width="640" height="360">您的浏览器不支持 video 标签。</video></div><div class="video-list"></div>',
      success: function () {
        bt.send('get_videos','files/get_videos', { path: path }, function (rdata) {
          var video_list =
              '<table class="table table-hover" style="margin-bottom:0;"><thead style="display: none;"><tr><th style="word-break: break-all;word-wrap:break-word;width:165px;">文件名</th><th style="width:65px" style="text-align:right;">大小</th></tr></thead>',
            index = 0;
          for (var i = 0; i < rdata.length; i++) {
            var filename = path + '/' + rdata[i].name;
            if (filename === old_filename) index = i;
            video_list +=
              '<tr class="' +
              (filename === old_filename ? 'video-avt' : '') +
              '"><td style="word-break: break-all;word-wrap:break-word;width:150px" onclick="bt_file.play_file(this,\'' +
              filename +
              '\')" title="文件: ' +
              filename +
              '\n类型: ' +
              rdata[i].type +
              '"><a>' +
              rdata[i].name +
              '</a></td><td style="font-size: 8px;text-align:right;width:' +
              (65 + bt_file.scroll_width) +
              'px;">' +
              ToSize(rdata[i].size) +
              '</td></tr>';
          }
          video_list += '</table>';
          $('.video-list')
            .html(video_list)
            .scrollTop(index * 34);
        });
      },
    });
  },
  /**
   * @description 切换播放
   * @param {String} obj
   * @param {String} filename 文件名
   * @return void
   */
  play_file: function (obj, filename) {
    if ($('#btvideo video').attr('data-filename') == filename) return false;
    var imgUrl = '/download?filename=' + encodeURIComponent(filename) + '&play=true';
    var v = '<video src="' + imgUrl + '" controls="controls" data-fileName="' + filename + '" autoplay="autoplay" width="640" height="360">您的浏览器不支持 video 标签。</video>';
    $('#btvideo').html(v);
    var p_tmp = filename.split('/');
    $('.btvideo-title').html(p_tmp[p_tmp.length - 1]);
    $('.video-avt').removeClass('video-avt');
    $(obj).parents('tr').addClass('video-avt');
  },
  /**
   * @description 复制文件和目录
   * @param {Object} data 当前文件的数据对象
   * @return void
   */
  copy_file_or_dir: function (data) {
    bt.set_cookie('record_paste', data.path);
    bt.set_cookie('record_paste_fileType', data.type);
    bt.set_cookie('record_paste_type', 'copy');
    $('.file_all_paste').removeClass('hide');
    layer.msg('复制成功，请点击粘贴按钮，或Ctrl+V粘贴');
  },

  /**
   * @description 剪切文件和目录
   * @param {Object} data 当前文件的数据对象
   * @return void
   */
  cut_file_or_dir: function (data) {
    bt.set_cookie('record_paste', data.path);
    bt.set_cookie('record_paste_fileType', data.type);
    bt.set_cookie('record_paste_type', 'cut');
    $('.file_all_paste').removeClass('hide');
    layer.msg('剪切成功，请点击粘贴按钮，或Ctrl+V粘贴');
  },
  /**
   * @descripttion 粘贴文件和目录
   * @return: 无返回值
   */
  paste_file_or_dir: function () {
    var that = this,
      _isPaste = bt.get_cookie('record_paste_type'),
      _fileType = bt.get_cookie('record_paste_fileType'),
      _paste = bt.get_cookie('record_paste'),
      _filename = '';
    if (_paste != 'null' && _paste != undefined) _filename = _paste.split('/').pop();
    if (this.file_path == _paste) {
      layer.msg('错误的复制逻辑，从' + _paste + '粘贴到' + this.file_path + '有包含关系，存在无限循环复制风险!', { icon: 0, time: 0, shade: 0.3, shadeClose: true });
      return false;
    }
    if (_fileType == 'dir' && this.file_path.indexOf(_paste + '/') > -1) {
      layer.msg('错误的复制逻辑，从' + _paste + '粘贴到' + this.file_path + '有包含关系，存在无限循环复制风险!', { icon: 0, time: 0, shade: 0.3, shadeClose: true });
      return false;
    }
    if (_isPaste != 'null' && _isPaste != undefined) {
      switch (_isPaste) {
        case 'cut':
        case 'copy':
          this.check_exists_files_req({ dfile: this.file_path, filename: _filename }, function (result) {
            if (result.length > 1) {
              var tbody = '';
              for (var i = 0; i < result.length; i++) {
                tbody +=
                  '\
								<tr>\
									<td><span style="display: flex;" title="' +
                  result[i].filename +
                  '"><span class="exists_files_style" style="flex: 1; width: 0;">' +
                  result[i].filename +
                  '</span></span></td>\
									<td>' +
                  ToSize(result[i].size) +
                  '</td>\
									<td>' +
                  getLocalTime(result[i].mtime) +
                  '</td>\
								</tr>';
              }
              var mbody =
                '\
							<div class="divtable">\
								<table class="table table-hover" width="100%">\
									<thead>\
										<th>文件名</th>\
										<th width="90">大小</th>\
										<th width="140">最后修改时间</th>\
									</thead>\
                  <tbody>' +
                tbody +
                '</tbody>\
                </table>\
							</div>';
              SafeMessage('即将覆盖以下文件', mbody, function () {
                that.config_paste_to(_paste, _filename);
              });
            } else if (result.length == 1) {
              result[0].type = _fileType;
              that.cover_single_file(_paste, result[0]);
            } else {
              that.config_paste_to(_paste, _filename);
            }
          });
          break;
        case '1':
        case '2':
          that.batch_file_paste();
          break;
      }
    }
  },
  /**
   * @descripttion 覆盖单个文件
   * @param {String} path 路径
   * @param {Object} file 文件对象
   */
  cover_single_file: function (path, file) {
    var that = this;
    var filename = file.filename;
    var index
    if(filename.indexOf('.tar.gz')> -1){
      index = filename.lastIndexOf('.tar.gz');
    }else {
      index = filename.lastIndexOf('.');
    }
    if (index == -1) {
      filename += ' - 副本';
    } else {
      filename = filename.substring(0, index) + ' - 副本' + filename.substring(index, filename.length);
    }
    layer.open({
      type: 1,
      title: '重复文件提示',
      area: '400px',
      closeBtn: 2,
      shadeClose: false,
      btn: ['确定', '取消'],
      content:
        '\
			<div class="cover_single_file bt-form">\
				<div class="rows input">\
					<div class="rows-label">操作类型: </div>\
					<div class="rows-value">\
						<div class="replace_content_view">\
							<div class="checkbox_config c$over">\
								<i class="file_find_radio"></i>\
								<span class="laberText" style="font-size: 12px;">覆盖文件</span>\
							</div>\
							<div class="checkbox_config rename">\
								<i class="file_find_radio active"></i>\
								<span class="laberText" style="font-size: 12px;">重命名文件</span>\
							</div>\
						</div>\
					</div>\
				</div>\
				<div class="rows input">\
					<div class="rows-label">文件名: </div>\
					<div class="rows-value">\
						<input type="text" class="bt-input-text" name="filename" placeholder="文件名" value="' +
        filename +
        '" style="width: 220px;" />\
					</div>\
				</div>\
				<div class="rows">\
					<div class="rows-label">大小: </div>\
					<div class="rows-value">' +
        ToSize(file.size) +
        '</div>\
				</div>\
				<div class="rows">\
					<div class="rows-label">最后修改时间: </div>\
					<div class="rows-value">' +
        getLocalTime(file.mtime) +
        '</div>\
				</div>\
			</div>',
      success: function () {
        $('.cover_single_file .checkbox_config').click(function () {
          if ($(this).find('.file_find_radio').hasClass('active')) return;
          $(this).parent().find('.file_find_radio').removeClass('active');
          $(this).find('.file_find_radio').addClass('active');
          var $input = $('.cover_single_file input[name="filename"]');
          if ($(this).hasClass('rename')) {
            $input.removeAttr('disabled');
            $input.val(filename);
            $input.focus();
          } else {
            $input.val(file.filename);
            $input.attr('disabled', 'disabled');
          }
        });
      },
      yes: function (index) {
        var filename = $('.cover_single_file input[name="filename"]').val();

        function save() {
          that.config_paste_to(path, filename, function (res) {
            if (res.status) {
              layer.close(index);
            }
          });
        }

        if (this.checkSameName(filename)) {
          bt.confirm(
            {
              title: '覆盖文件【' + filename + '】',
              msg: '您确定要覆盖当前文件？',
            },
            function (indexs) {
              layer.close(indexs);
              save();
            }
          );
        } else {
          save();
        }
      },
      checkSameName: function (filename) {
        var result = false;
        for (var i = 0; i < that.file_list.length; i++) {
          if (that.file_list[i].filename == filename) {
            result = true
            break;
          }
        }
        return result
      },
    });
  },
  /**
   * @descripttion 粘贴到
   * @param {String} path         复制/剪切路径
   * @param {String} _filename     文件名称
   * @return: 无返回值
   */
  config_paste_to: function (path, _filename, callback) {
    var that = this,
      dfile = this.file_path + '/' + _filename,
      _type = bt.get_cookie('record_paste_type');
    this.$http(_type == 'copy' ? 'CopyFile' : 'MvFile', { sfile: path, dfile: dfile }, function (rdata) {
      if (rdata.status) {
        bt.set_cookie('record_paste', null);
        bt.set_cookie('record_paste_fileType', null);
        bt.set_cookie('record_paste_type', null);
        that.reader_file_list({ path: that.file_path },function(){
					layer.msg(rdata.msg, { icon: rdata.status ? 1 : 2 })
				});
      }
      layer.msg(rdata.msg, { icon: rdata.status ? 1 : 2 })
      callback && callback(rdata);
    });
  },
  /**
   * @description 重命名文件和目录
   * @param {Object} data 当前文件的数据对象
   * @return void
   */
  rename_file_or_dir: function (data) {
    var that = this;
    that.is_editor = true;
    $('.file_list_content .file_tr:nth-child(' + (data.index + 1) + ')')
      .addClass('editr_tr')
      .find('.file_title')
      .empty()
      .append(
        $(
          bt.get_cookie('rank') == 'icon'
            ? '<textarea name="rename_file_input" onfocus="this.select()">' + data.filename + '</textarea>'
            : '<input name="rename_file_input" onfocus="this.select()" type="text" value="' + data.filename + '">'
        )
      );
    if (bt.get_cookie('rank') == 'icon') {
      $('textarea[name=rename_file_input]').css({ height: $('textarea[name=rename_file_input]')[0].scrollHeight });
    }
    $((bt.get_cookie('rank') == 'icon' ? 'textarea' : 'input') + '[name=rename_file_input]')
      .on('input', function () {
        if (bt.get_cookie('rank') == 'icon') {
          this.style.height = 'auto';
          this.style.height = this.scrollHeight + 'px';
        }
        if (data.type == 'file') {
          var ext_arry = $(this).val().split('.'),
            ext = ext_arry[ext_arry.length - 1];
          $(this)
            .parent()
            .prev()
            .find('.file_icon')
            .removeAttr('class')
            .addClass('file_icon file_' + ext);
        }
      })
      .keyup(function (e) {
        if (e.keyCode == 13) $(this).blur();
        e.stopPropagation();
        e.preventDefault();
      })
      .blur(function () {
        var _val = $(this)
            .val()
            .replace(/[\r\n]/g, ''),
          config = { sfile: data.path, dfile: that.path_resolve(that.file_path, _val) };
        if (data.filename == _val || _val == '') {
          $('.file_list_content .file_tr:nth-child(' + (data.index + 1) + ')')
            .removeClass('editr_tr')
            .find('.file_title')
            .empty()
            .append($('<i>' + data.filename + '</i>'));
          that.is_editor = false;
          return false;
        }
        if (that.match_unqualified_string(_val)) return layer.msg('名称不能含有 /\\:*?"<>|符号', { icon: 2 });
        that.rename_file_req(config, function (res) {
          that.reader_file_list({ path: that.file_path }, function () {
            layer.msg(res.msg, { icon: res.status ? 1 : 2 });
          });
        });
        that.is_editor = false;
      })
      .focus();
  },

  /**
   * @description 设置文件和目录分享
   * @param {Object} data 当前文件的数据对象
   * @returns void
   */
  set_file_share: function (data) {
    var that = this;
    this.loadY = bt.open({
      type: 1,
      shift: 5,
      closeBtn: 2,
      area: '450px',
      title: '设置分享' + data.type_tips + '-[' + data.filename + ']',
      btn: ['生成外链', '取消'],
      content:
        '<from class="bt-form" id="outer_url_form" style="padding:30px 15px;display:inline-block">' +
        '<div class="line"><span class="tname">分享名称</span><div class="info-r"><input name="ps"  class="bt-input-text mr5" type="text" placeholder="分享名称不能为空" style="width:270px" value="' +
        data.filename +
        '"></div></div>' +
        '<div class="line"><span class="tname">有效期</span><div class="info-r">' +
        '<label class="checkbox_grourd"><input type="radio" name="expire" value="24" checked><span>&nbsp;1天</span></label>' +
        '<label class="checkbox_grourd"><input type="radio" name="expire" value="168"><span>&nbsp;7天</span></label>' +
        '<label class="checkbox_grourd"><input type="radio" name="expire" value="1130800"><span>&nbsp;永久</span></label>' +
        '</div></div>' +
        '<div class="line"><span class="tname">提取码</span><div class="info-r"><input name="password" class="bt-input-text mr5" placeholder="为空则不设置提取码" type="text" style="width:220px" value=""><button type="button" id="random_paw" class="btn btn-success btn-sm btn-title">随机</button></div></div>' +
        '<ul class="help-info-text c7 ptb10">\
			<li style="color:red;margin:0 28px">注意：生成的外链分享链接具有一定的风险，请仅与可信任的人分享链接，避免敏感信息泄露</li>\
		</ul></from>',
      yes: function (indexs, layers) {
        var ps = $('[name=ps]').val(),
          expire = $('[name=expire]:checked').val(),
          password = $('[name=password]').val();
        if (ps === '') {
          layer.msg('分享名称不能为空', { icon: 2 });
          return false;
        }
        that.create_download_url(
          {
            filename: data.path,
            ps: ps,
            password: password,
            expire: expire,
          },
          function (res) {
            if (!res.status) {
              layer.msg(res.msg, { icon: res.status ? 1 : 2 });
              return false;
            } else {
              var rdata = res.msg;
              that.file_list[data.index] = $.extend(that.file_list[data.index], { down_id: rdata.id, down_info: rdata });
              that.loadY.close();
              that.info_file_share(data);
              that.reader_file_list_content(that.file_list);
            }
          }
        );
      },
      success: function (layers, index) {
        $('#random_paw').click(function () {
          $(this).prev().val(bt.get_random(6));
        });
      },
    });
  },

  /**
   * @description 分享信息查看
   * @param {Object} data 当前文件的数据对象
   * @returns void
   */
  info_file_share: function (data) {
    var that = this;
    if (typeof data.down_info == 'undefined') {
      this.get_download_url_find({ id: data.down_id }, function (res) {
        that.file_list[data.index] = $.extend(that.file_list[data.index], { down_info: res });
        that.file_share_view(that.file_list[data.index], 'fonticon');
      });
      return false;
    }
    this.file_share_view(data, 'fonticon');
  },
  /**
   * @description 分享信息视图
   * @param {Object} data 当前文件的数据对象
   * @param {String} type 区别通过右键打开或是图标点击
   * @returns void
   */
  file_share_view: function (datas, type) {
    var data = datas;
    if (type == 'fonticon') {
      data = datas.down_info;
    }
    var that = this,
      download_url = location.origin + '/down/' + data.token,
      down = download_url+'?fname='+data.ps + '&down=true'
    this.loadY = bt.open({
      type: 1,
      shift: 5,
      closeBtn: 2,
      area: '550px',
      title: '外链分享-[' + data.filename + ']',
      content:
        '<div class="bt-form pd20 pb70">' +
        '<div class="line"><span class="tname">分享名称</span><div class="info-r"><input readonly class="bt-input-text mr5" type="text" style="width:365px" value="' +
        data.ps +
        '"></div></div>' +
        '<div class="line external_link"><span class="tname">分享外链</span><div class="info-r"><input readonly class="bt-input-text mr5" type="text" style="width:280px" value="' +
        download_url +
        '"><button type="button" id="copy_url" data-clipboard-text="' +
        download_url +
        '" class="btn btn-success btn-sm btn-title copy_url" style="margin-right:5px" data-clipboard-target="#copy_url"><img style="width:16px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIUlEQVQ4T6XTsSuFURjH8d+3/AFm0x0MyqBEUQaUIqUU3YwWyqgMptud/BlMSt1SBiklg0K3bhmUQTFZDZTxpyOvznt7z3sG7/T2vOf5vM85z3nQPx+KfNuHkhoZ7xXYjNfEwIukXUnvNcg2sJECnoHhugpsnwBN21PAXVgbV/AEjNhuVSFA23YHWLNt4Cc3Bh6BUdtLcbzAgHPbp8BqCngAxjJbOANWUkAPGA8fE8icpD1gOQV0gclMBRfAYgq4BaZtz/YhA5IGgY7tS2AhBdwAM7b3JX1I+iz1G45sXwHzKeAa6P97qZgcEA6v/ZsR3v9aHCmt0P9UBVuShjKz8CYpXPkDYKJ0kaKhWpe0UwOFxDATx5VACFZ0Ivbuga8i8A3NFqQRZ5pz7wAAAABJRU5ErkJggg=="></button><button type="button" class="btn btn-success QR_code btn-sm btn-title"><img  style="width:16px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABUklEQVQ4T6WSIU9DQRCEvwlYLIoEgwEECs3rDyCpobbtL6AKRyggMQ9TJBjUMzgMCeUnIEAREoICFAoEZMk2dy/Xo4KGNZu7nZ2bnT3xz1DsN7MFYCnhe5V0n/Kb2QowL2kY70cEoXAHVEnDG/ABXAJXmVDHVZKqSFAA58AqsAY8AW3A68/AQ7hbBG6BbeDGlaQEh8AucA3suzDgC5gFXHID2At5YxJBNwA6ocFBM8B3OL8DTaCcpMDN2QojxHHdk9Qrx9SeAyf1CMFIJ3DjYqxLOgo192gs4ibSNfrMOaj2yBvMrCnpImYHR4C/vizpIPkX/mpbUtfMepJKMxtKKsyslNTLCZxkBzgFjoE5oCVp08yKvyhwgkGyRl9nX1LDzDz3kzxS8kuBpFYygq8xJ4gjjBMEpz+BF+AxcXLg39XMOpLOciW1gtz9ac71GqdpSrE/8U20EQ3XLHEAAAAASUVORK5CYII="></button></div></div>' +
        '<div class="line external_link" style="' +
        (data.password == '' ? 'display:none;' : 'display:block') +
        '"><span class="tname">提取码</span><div class="info-r"><input readonly class="bt-input-text mr5" type="text" style="width:243px" value="' +
        data.password +
        '"><button type="button" data-clipboard-text="链接:' +
        download_url +
        ' 提取码:' +
        data.password +
        '"  class="btn btn-success copy_paw btn-sm btn-title">复制链接及提取码</button></div></div>' +
        '<div class="line"><span class="tname">过期时间</span><div class="info-r"><span style="line-height:32px; display: block;font-size:14px">' +
        data.expire +
        '</span></div></div>' +
        '<div class="line"><ul style="list-style:disc;"><li style="color:red;margin:0 32px">注意：生成的外链分享链接具有一定的风险，请仅与可信任的人分享链接，避免敏感信息泄露</li></ul></div>' +
        '<div class="bt-form-submit-btn">' +
        '<button type="button" class="btn btn-danger btn-sm btn-title layer_close">' +
        lan['public'].close +
        '</button>' +
        '<button type="button" id="down_del" class="btn btn-danger btn-sm btn-title close_down" style="color:#fff;background-color:#c9302c;border-color:#ac2925;" onclick="">关闭分享外链</button>' +
        '</div>' +
        '</div>',
      success: function (layers, index) {
        var copy_url = new ClipboardJS('.copy_url');
        var copy_paw = new ClipboardJS('.copy_paw');
        copy_url.on('success', function (e) {
          layer.msg('复制链接成功!', { icon: 1 });
          e.clearSelection();
        });
        copy_paw.on('success', function (e) {
          layer.msg('复制链接及提取码成功!', { icon: 1 });
          e.clearSelection();
        });
        $('.layer_close').click(function () {
          layer.close(index);
        });
        $('.QR_code').click(function () {
          layer.closeAll('tips');
          layer.tips('<div style="height:140px;width:140px;padding:8px 0" id="QR_code"></div>', '.QR_code', {
            area: ['150px', '150px'],
            tips: [1, '#ececec'],
            time: 0,
            shade: [0.05, '#000'],
            shadeClose: true,
            success: function () {
              jQuery('#QR_code').qrcode({
                render: 'canvas',
                text: down,
                height: 130,
                width: 130,
              });
            },
          });
        });
        $('.close_down').click(function () {
          that.remove_download_url({ id: data.id, fileName: data.filename }, function (res) {
            that.loadY.close();
            if (type == 'fonticon') {
              that.file_list[datas.index].down_id = 0;
              that.reader_file_list_content(that.file_list);
            }
            if (type == 'list') {
              that.render_share_list();
            }
            that.reader_file_list({ path: that.file_path });
            layer.msg(res.msg, { icon: res.status ? 1 : 2 });
          });
        });
      },
    });
  },
  /**
   * @description 删除文件和目录
   * @param {Object} data 当前文件的数据对象
   * @return void
   */
  del_file_or_dir: function (data) {
    var that = this;
    if (that.is_recycle == 'true' || (typeof that.is_recycle == 'boolean' && that.is_recycle)) {
      bt.simple_confirm(
        {
          title: '删除' + data.type_tips + '【' + data.filename + '】',
          msg: '删除选中的' + data.type_tips + '后，该' + data.type_tips + '将迁移至文件回收站，如需彻底删除请前往文件回收站，是否继续操作？\
          '+ (data.down_id !== 0 ? '<br><span class="color-red">当前'+ data.type_tips +'已开启【外链分享】，请谨慎操作！</span>' : ''),
        },
        function () {
          that.del_file_req(data, function (res) {
            that.reader_file_list({ path: that.file_path });
            layer.msg(res.msg, { icon: res.status ? 1 : 2 });
          });
        }
      );
    } else {
      bt.compute_confirm(
        { title: '删除' + data.type_tips + '【' + data.filename + '】', msg: '风险操作，当前未开启文件回收站，删除选中的' + data.type_tips + '将彻底删除，无法恢复，是否继续操作？\
				'+ (data.down_id !== 0 ? '<br><span class="color-red">当前'+ data.type_tips +'已开启【外链分享】，请谨慎操作！</span>' : ''), },
        function () {
          that.del_file_req(data, function (res) {
            that.reader_file_list({ path: that.file_path });
            layer.msg(res.msg, { icon: res.status ? 1 : 2 });
          });
        }
      );
    }
  },

  /**
   * @description 取消文件收藏
   * @param {Object} data 当前文件的数据对象
   * @returns void
   */
  cancel_file_favorites: function (data) {
    var that = this,
      index = data.index;
    this.loadY = bt.confirm({ title: '取消' + data['filename'] + '收藏', msg: '是否取消[' + data['path'] + ']的收藏，是否继续？' }, function () {
      that.$http('del_files_store', { path: data.path }, function (res) {
        if (res.status) {
          that.file_list[index].caret = false;
          that.reader_file_list_content(that.file_list);
          that.load_favorites_index_list();
        }
        layer.msg(res.msg, { icon: res.status ? 1 : 2 });
      });
    });
  },
  /**
   * @description 取消文件置顶
   */
  cancel_file_topping: function (data) {
    var that = this;
    bt.confirm({ title: '取消置顶', msg: '是否取消[' + data['filename'] + ']的置顶，是否继续？' }, function () {
      bt_tools.send({ url: '/files/logs/set_topping_status', data: { data: JSON.stringify({ sfile: data.path, status: 0 }) } }, function (res) {
        if (res.status) {
          that.file_list[data.index] = $.extend(that.file_list[data.index], { topping: false });
          that.reader_file_list_content(that.file_list);
        }
        layer.msg(res.msg, { icon: res.status ? 1 : 2 });
      });
    });
  },
  /**
   * @description 创建软链接
   * @param {Object} data 当前文件的数据对象
   */
  set_soft_link: function (data) {
    var that = this;
    bt_tools.open({
      title: '创建软链接',
      area: '520px',
      content: {
        class: 'pd20',
        formLabelWidth: '110px',
        form: [
          {
            label: '名称',
            group: {
              type: 'text',
              name: 'name',
              width: '280px',
              placeholder: '请输入软链接名称',
              value: '',
            },
          },
          {
            label: '链接到',
            group: {
              type: 'text',
              name: 'sfile',
              width: '280px',
              placeholder: '请选择需要创建的软链的文件夹和文件',
              icon: { type: 'glyphicon-folder-open', event: function (ev) {}, select: 'all' },
              value: '',
              input: function (ev) {},
            },
          },
          {
            label: '',
            group: {
              type: 'help',
              style: { 'margin-top': '0' },
              class: 'none-list-style',
              list: ['提示：请选择需要创建的软链的文件夹和文件'],
            },
          },
        ],
      },
      init: function () {
        var e = null,
          t = setInterval(function () {
            if (($('input[name="sfile"]').length < 1 && clearInterval(t), e != $('input[name="sfile"]').val())) {
              e = $('input[name="sfile"]').val();
              var i = e.split('/');
              i.length > 1 && $('[name="name"]').val(i[i.length - 1]);
            }
          }, 100);
      },
      yes: function (data, indexs, layero) {
        if (data.name === '') return layer.msg('软链接名称不能为空！', { icon: 2 });
        if (data.sfile === '') return layer.msg('软链的文件夹和文件不能为空！', { icon: 2 });
        data = $.extend(data, { dfile: that.file_path + '/' + data.name });
        delete data.name;
        // var sfile = data.sfile,dirList = sfile.split('/');
        // data = $.extend(data,{dfile:that.file_path + '/' + dirList[dirList.length -1]})
        bt_tools.send(
          'files/CreateLink',
          data,
          function (res) {
            if (res.status) {
              layer.close(indexs);
              bt.msg(res);
              that.reader_file_list({ path: that.file_path });
            }
          },
          { tips: '创建软链接' }
        );
      },
    });
  },

  /**
   * @description 设置文件权限 - ok
   * @param {Object} data 当前文件的数据对象
   * @param {Boolean} isPatch 是否多选
   * @returns void
   */
  set_file_authority: function (data, isPatch) {
    var that = this;
    that.get_file_authority({ path: data.path }, function (rdata) {
      that.loadY = layer.open({
        type: 1,
        closeBtn: 2,
        title: lan.files.set_auth + '[' + data.filename + ']',
        area: '400px',
        shadeClose: false,
        content:
          '<div class="setchmod bt-form ptb15 pb70">\
                            <fieldset>\
                                <legend>' +
          lan.files.file_own +
          '</legend>\
                                <p><input type="checkbox" id="owner_r" />' +
          lan.files.file_read +
          '</p>\
                                <p><input type="checkbox" id="owner_w" />' +
          lan.files.file_write +
          '</p>\
                                <p><input type="checkbox" id="owner_x" />' +
          lan.files.file_exec +
          '</p>\
                            </fieldset>\
                            <fieldset>\
                                <legend>' +
          lan.files.file_group +
          '</legend>\
                                <p><input type="checkbox" id="group_r" />' +
          lan.files.file_read +
          '</p>\
                                <p><input type="checkbox" id="group_w" />' +
          lan.files.file_write +
          '</p>\
                                <p><input type="checkbox" id="group_x" />' +
          lan.files.file_exec +
          '</p>\
                            </fieldset>\
                            <fieldset>\
                                <legend>' +
          lan.files.file_public +
          '</legend>\
                                <p><input type="checkbox" id="public_r" />' +
          lan.files.file_read +
          '</p>\
                                <p><input type="checkbox" id="public_w" />' +
          lan.files.file_write +
          '</p>\
                                <p><input type="checkbox" id="public_x" />' +
          lan.files.file_exec +
          '</p>\
                            </fieldset>\
                            <div class="setchmodnum"><input class="bt-input-text" type="text" id="access" maxlength="3" value="' +
          rdata.chmod +
          '">' +
          lan.files.file_menu_auth +
          '，\
                            <span>' +
          lan.files.file_own +
          '\
                            <select id="chown" class="bt-input-text">\
                                <option value="www" ' +
          (rdata.chown == 'www' ? 'selected="selected"' : '') +
          '>www</option>\
                                <option value="mysql" ' +
          (rdata.chown == 'mysql' ? 'selected="selected"' : '') +
          '>mysql</option>\
                                <option value="root" ' +
          (rdata.chown == 'root' ? 'selected="selected"' : '') +
          '>root</option>\
                            </select></span>\
                            <span><input type="checkbox" id="accept_all" checked /><label for="accept_all" style="position: absolute;margin-top: 4px; margin-left: 5px;font-weight: 400;">应用到子目录</label></span>\
                            </div>\
                            <div class="bt-form-submit-btn">\
                                <button type="button" class="btn btn-danger btn-sm btn-title layer_close">' +
          lan['public'].close +
          '</button>\
                                <button type="button" class="btn btn-success btn-sm btn-title set_access_authority">' +
          lan['public'].ok +
          '</button>\
                            </div>\
                        </div>',
        success: function (index, layers) {
          that.edit_access_authority();
          $('#access').keyup(function () {
            that.edit_access_authority();
          });
          $('input[type=checkbox]').change(function () {
            var idName = ['owner', 'group', 'public'];
            var onacc = '';
            for (var n = 0; n < idName.length; n++) {
              var access = 0;
              access += $('#' + idName[n] + '_x').prop('checked') ? 1 : 0;
              access += $('#' + idName[n] + '_w').prop('checked') ? 2 : 0;
              access += $('#' + idName[n] + '_r').prop('checked') ? 4 : 0;
              onacc += access;
            }
            $('#access').val(onacc);
          });
          //提交
          $('.set_access_authority').click(function () {
            var chmod = $('#access').val();
            var chown = $('#chown').val();
            var all = $('#accept_all').prop('checked') ? 'True' : 'False';
            var _form = {};
            _form = {
              user: chown,
              access: chmod,
              all: all,
            };
            if (isPatch) {
              _form['type'] = data.type;
              _form['path'] = data.path;
              _form['data'] = data.filelist;
            } else {
              _form['filename'] = data.path;
            }
            that.$http(isPatch ? 'SetBatchData' : 'SetFileAccess', _form, function (res) {
              if (res.status) {
                layer.close(layers);
                that.reader_file_list({ path: that.file_path, is_operating: false });
              }
              layer.msg(res.msg, { icon: res.status ? 1 : 2 });
            });
          });
          $('.layer_close').click(function () {
            layer.close(layers);
          });
        },
      });
    });
  },

  /**
   * 购买引导判定
   * @param {Object} item 数据对象
   * @param {number} source 来源
   * @param {Object} config 配置对象
   **/
  check_ltd_end: function (item, source, config) {
    var ltd_cookie = bt.get_cookie('ltd_end') > 0;
    if (!ltd_cookie) {
      bt.soft.product_pay_view({
        totalNum: source,
        limit: 'ltd',
        closePro: true,
        pluginName: item.pluginName,
        fun: function () {
          product_recommend.recommend_product_view(item, config, 'ltd', source, 'ltd', true);
        },
      });
      return false;
    }
    return true;
  },
  /**
   * 创建文件副本
   * @param {Object} data 当前文件数据对象
   **/
  create_copy_file: function (data) {
    var is_ltd = this.check_ltd_end(
      {
        ps: '为文件或目录创建副本文件，创建的副本文件将以源文件(1).x命名',
        description: ['可创建文件、目录副本'],
        preview: false,
        pluginName: '创建副本',
        imgSrc: 'https://www.bt.cn/Public/new/plugin/introduce/files/copyFile.png',
      },
      74,
      { imgArea: ['1010px', '680px'] }
    );
    if (!is_ltd) return;
    var that = this;
    bt_tools.send(
      { url: '/files/logs/copy_file_to', data: { data: JSON.stringify({ sfile: data.path }) } },
      function (res) {
        if (res.status) that.reader_file_list({ path: that.file_path });
        layer.msg(res.msg, { icon: res.status ? 1 : 2 });
      },
      '创建副本'
    );
  },
  /**
   * @description format_conversion 文件格式转换
   * @param {Object} data 当前文件数据对象
   */
  file_format_conversion: function (data,is_multiple) {
    // 文件格式转化
    var that = this;
    var file_dialog = bt_tools.open({
      title:'文件格式转换',
      area:['780px','640px'],
      btn:false,
      content:'<div id="file_format_box"></div>',
      success:function(el,index){
        var file_format_list = [],can_foramt = [],file_logs_format = '';
        var _that = this
        var file_format_tab = bt_tools.tab({
          class: 'pd20 h-full',
          type: 0,
          theme: { nav: 'ml0'},
          active: 1, //激活TAB下标
          list:[{
            title: '格式转化',
            name: 'tabname',
            content: '<div id="file_format"></div>',
            success: function () {
              $('#file_format_box').append('<div class="submit_format_file_btn"><button class="btn btn-sm btn-success submit_format_file">执行转换</button></div>')
              // 渲染文件格式转换列表
              var file_format_tbody = '',selected_data = [];
              if(is_multiple){
                $.each(data,function(index,item){
                  if(item.type == 'file') set_data(item)
                })
                get_format_suffix()
              }else{
                if(data.type) set_data(data)
                get_format_suffix()
              }
              function set_data(data){
                var file_audio = ['mp3','wav','flac']
                var file_format_obj = {};
                var parts = data.filename.split(';');
                var fileName = parts[0];
                var suffix = fileName.split('.').pop();
                file_format_obj.name = fileName;
                file_format_obj.file_stype = suffix;
                file_format_obj.type = data.open_type
                if(file_audio.includes(data.ext)) file_format_obj.type = 'audio'
                file_format_obj.path = data.path;
                file_format_list.push(JSON.parse(JSON.stringify(file_format_obj)));
              }
              function get_format_suffix (){
                file_format_tbody = ''
                var all_options = []
                $('#file_format').empty()
                $.ajaxSettings.async = false;
                that.get_format_suffix(function(res){
                  all_format_option = res.msg
                  for (var j = 0; j < res.msg.all.length; j++) {
                    all_options += '<li class="item" data-option="' + res.msg.all[j] + '">' + res.msg.all[j] + '</li>';
                  }
                  $.each(file_format_list,function(index,item){
                    switch(item.type){
                      case 'images' :
                        _that.can_foramt = res.msg.image
                        break;
                      case 'video' :
                        _that.can_foramt = res.msg.video
                        break;
                      case 'audio' :
                        _that.can_foramt = res.msg.audio
                        break;
                      default:
                        _that.can_foramt = res.msg.all
                        break;
                    }
                    // 判断数据类型，例：若为图片则显示图片类的转换后缀
                    // 判断该数据是否存在与可转换的列表中，若不存在则转化操作列展示"不支持转化"
                    var isConvertible = res.msg.all.includes(item.file_stype);
                    // 生成ul形式的下拉框
                    var selectOptions = '';
                    for (var i = 0; i < _that.can_foramt.length; i++) {
                      selectOptions += '<li class="item" data-option="' + _that.can_foramt[i] + '">' + _that.can_foramt[i] + '</li>';
                    }
                    var conversionBtn = isConvertible ? '<div class="bt_select_updown" style="width:158px">\
													<div class="bt_select_value">\
																<span class="bt_select_content">'+_that.can_foramt[0]+'</span>\
																<span class="glyphicon glyphicon-triangle-bottom ml5"></span>\
													</div>\
													<ul class="bt_select_list" style="max-height:150px;overflow:auto">'+selectOptions+'</ul>\
												</div>' : '<span style="color:#EF0808">不支持转化</span>';

                    var con_flag =  conversionBtn.includes('不支持转化')
                    file_format_tbody += '<tr class="file_tr '+(con_flag?'':'active')+'">\
													<td style="width:60px"><div class="file_td file_checkbox '+(con_flag?'notclick':'')+'"><div class="file_check"></div></div></td>\
													<td style="width:200px">\
														<div class="flex" style="align-items:center" title="'+ item.path +'">\
															<i class="file_icon file_'+item.file_stype+'"></i>\
															<span>'+ item.name +'</span>\
														</div>\
													</td>\
													<td style="width:100px">'+ item.file_stype +'</td>\
													<td style="width:168px;padding:8px 0px">'+ conversionBtn +'</td>\
													<td class="status_td" style="width:80px">'+(con_flag?'<span style="color:#ef0808">无法执行</span>':'待执行')+'</td>\
													<td ><span class="bterror delete_format_file">取消</span></td>\
												</tr>';
                  })
                })
                // 查询当前所在的文件路径
                var cur_path = !is_multiple?data.path.replace('/'+data.filename,''):file_format_list[0].path.replace('/'+file_format_list[0].name,'')
                var file_format_html =  '<div class="divtable file_table_view file_list_content file_list_format">\
										<button class="btn btn-sm btn-success add_format_file mb10">添加</button>\
										<div class="file_format_th">\
										<div class="file_list_header">\
												<div class="file_main_title">\
													<div class="file_checkbox file_th" style="width:60px">\
														<div class="file_check" data-type="all" data-checkbox="0"></div>\
													</div>\
													<div class="file_name file_th" data-tid="name" style="width:200px">\
														<span>文件名</span>\
													</div>\
													<div class="file_th" data-tid="accept" style="width:100px">\
														<span>格式类型</span>\
													</div>\
													<div class="file_th" data-tid="accept" style="width:180px">\
														<span>转化为</span><div class="bt_select_updown top_updown" style="width: 114px;margin-left: 4px;">\
														<div class="bt_select_value"><span class="bt_select_content">jpg</span><span class="glyphicon glyphicon-triangle-bottom ml5"></span></div>\
														<ul class="bt_select_list" style="position:fixed;width:120px">'+all_options+'</ul>\
														</div>\
													</div>\
													<div class="file_th" data-tid="accept" style="width:86px">\
														<span>执行状态</span>\
													</div>\
													<div class="file_th" data-tid="accept" style="width:100px">\
														<span>操作</span>\
													</div>\
												</div>\
											</div>\
											</div>\
										<div style="height:320px;overflow:auto"><table class="table table-hover file_data_table" width="100%" cellspacing="0" cellpadding="0" border="0">\
											<tbody class="file_format_tbody ">\
												'+file_format_tbody+'\
											</tbody>\
										</table></div>\
											<div class="file_format_save mtb10">\
												<span>保存路径：<span id="format_save_path">'+cur_path+'</span></span>\
												<span class="glyphicon glyphicon-folder-open cursor ChangePath"></span>\
											</div>\
											<div class="is_delete_file">\
												<input type="checkbox" class="userini" id="delete_old_file" name="delete_old_file"> 是否删除源文件\
											</div>\
										</div>'
                $.ajaxSettings.async = true;
                $('#file_format').html(file_format_html)

                // 点击下拉框展示选项
                $('.file_format_tbody .bt_select_updown').click(function(e){
                  $('#file_format .bt_select_list').hide()
                  // 判断自身bt_select_list是否为展示状态，若展示则隐藏，反之则显示
                  if($(this).find('.bt_select_list').css('display') == 'block'){
                    $(this).find('.bt_select_list').hide()
                  }else{
                    $(this).find('.bt_select_list').show()
                  }
                  e.stopPropagation()
                  e.preventDefault()
                  // 设置ul的位置
                  $(this).find('.bt_select_list').css({
                    top:32 + $('.file_data_table').parent().scrollTop(),
                    left:0
                  })

                  // 表格滚动时消失
                  $('.file_data_table').parent().scroll(function(){
                    $('.bt_select_list').hide()
                  })
                })
                // 点击顶部的下拉框，将下面的下拉框的值都变为顶部的值
                $('.top_updown .bt_select_value').click(function(e){
                  e.stopPropagation()
                  e.preventDefault()
                  $('.bt_select_list').hide()
                  // 判断自身bt_select_list是否为展示状态，若展示则隐藏，反之则显示
                  if($(this).next().css('display') == 'block'){
                    $(this).next().hide()
                  }else{
                    $(this).next().show()
                    $(this).next().css({
                      top:that.getElementPosition($(this)[0]).top + 32,
                      left:that.getElementPosition($(this)[0]).left
                    })
                  }
                })
                // 点击其他位置都关闭ul,
                $(document).click(function(){
                  $('.bt_select_list').hide()
                })

                // 顶部表头转化为xxx选项选择
                $('.top_updown .bt_select_list .item').click(function(e){
                  var option = $(this).attr('data-option')
                  $(this).parent().prev().find('.bt_select_content').text(option)
                  $('.file_format_tbody .file_tr').each(function(index,item){
                    $(item).find('.bt_select_content').html(option)
                    var options = $(item).find('.bt_select_list .item').map(function() {
                      return $(this).attr('data-option');
                    }).get();
                    if (!options.includes(option)) {
                      // 取消该项选中，禁止选中
                      $(item).find('.file_checkbox').addClass('notclick')
                      $(item).find('.file_checkbox').parent().css('cursor','not-allowed')
                      $(item).removeClass('active').removeClass('active_2')
                      $(item).find('.status_td').html('<span style="color:#EF0808">无法执行</span>');
                    }else{
                      $(item).find('.file_checkbox').parent().css('cursor','pointer')

                      $(item).find('.file_checkbox').removeClass('notclick')
                      $(item).find('.status_td').html('待执行');
                    }
                    check_selection()
                  })
                  $(this).parent().hide()
                })
                // 点击选项内容更改bt_select_content内容并隐藏选项内容
                $('.file_format_tbody .bt_select_list .item').click(function(e){
                  e.stopPropagation()
                  e.preventDefault()
                  var option = $(this).attr('data-option')
                  $(this).parents('.bt_select_updown').find('.bt_select_content').html(option)
                  $(this).parents('.file_tr').find('.file_checkbox').removeClass('notclick')
                  $(this).parents('.file_tr').find('.status_td').html('待执行');
                  $(this).parents('.bt_select_updown').find('.bt_select_list').hide()
                })
                // 点击添加打开文件选择器
                $('.add_format_file').click(function(){
                  bt.select_path('null','file',function(path0, path,_type){
                    // 查询该文件数据加入表格中
                    that.$http('get_file_attribute', { filename: path0 }, function (res) {
                      // 查询该文件数据属于哪个类
                      file_format_list.push({
                        name: res.name,
                        file_stype: res.st_type,
                        path: res.path+'/'+res.name
                      })
                      get_format_suffix()
                    });
                  })
                })
                $('.ChangePath').click(function(){
                  bt.select_path('format_save_path','dir',function(path0, path,_type){
                    // 判断结尾是否为"/"，若不是则添加
                    if(path0[path0.length-1] != '/') path0 = path0+'/'
                    $('#format_save_path').text(path0)
                  },cur_path)
                })
                // 点击选中行 并存储选中内容
                $('.file_format_tbody').on('click', '.file_checkbox', function (e) {
                  // 找到点击行的file_tr 并判定其是否为选中状态，为其增加相应的点击状态，并更改表头全选file_check的状态
                  var file_tr = $(this).parents('.file_tr')
                  if(file_tr.hasClass('active')){
                    file_tr.removeClass('active')
                  }else{
                    file_tr.addClass('active')
                  }
                  check_selection()
                  // 判断是否有选中的行，若有则显示提交按钮，若无则隐藏
                  if($('.file_format_tbody .file_tr.active').length > 0){
                    $('.submit_format_file_btn').show()
                  }else{
                    $('.submit_format_file_btn').hide()
                  }
                })

                // 点击全选
                $('#file_format .file_list_header .file_check').on('click', function (e) {
                  if ($(this).hasClass('active')) {
                    $(this).removeClass('active')
                    $('.file_format_tbody .file_tr').removeClass('active')
                  } else {
                    $(this).addClass('active').removeClass('active_2')
                    // 当存在无法执行项、不可转换项时，不勾选这些项,当不存在可勾选项时，提醒用户
                    $('.file_format_tbody .file_tr').each(function (index, item) {
                      if (!$(item).find('.file_td').hasClass('notclick')) {
                        $(item).addClass('active')
                      }
                    })
                    // 当所有项都不被勾选时提醒用户没有可选项，并移除全选勾选
                    if ($('.file_format_tbody .file_td').length == $('.file_format_tbody .file_td.notclick').length) {
                      $(this).removeClass('active')
                      layer.msg('当前无可选', { icon: 2 });
                    }
                  }
                })
                //点击取消 删除该行在表格中的显示，当列表无数据时 显示空状态
                $('.delete_format_file').click(function(){
                  var file_tr = $(this).parents('.file_tr')
                  var index = file_tr.index()
                  file_format_list.splice(index,1)
                  file_tr.remove()
                  if($('.file_format_tbody .file_tr').length == 0){
                    $('.file_format_tbody').html('<tr><td colspan="6" style="text-align:center">暂无数据</td></tr>')
                  }
                  check_selection()
                })
              }

            }
          },{
            title: '操作日志',
            name: 'tabname2',
            content: '<div id="file_format_log"></div>',
            success: function () {
              $('#file_format_box').find('.submit_format_file_btn').hide()
              file_logs_format = bt_tools.table({
                el: '#file_format_log',
                url: '/files/conversion/get_log',
                default: '暂无数据',
                dataVerify: false, //为false可跳过异常处理
                height: '460px',
                dataFilter: function (rdata) {
                  // return {data: rdata.data, page: rdata.page}
                  return { data: rdata.msg.data,page: rdata.msg.page}; //处理好数据后返回
                },
                column: [
                  {
                    fid: 'time',
                    title: '操作时间',
                    width: 160,
                    template:function(row){
                      return '<span>'+bt.format_data(row.time)+'</span>'
                    }
                  },
                  {
                    fid: 'type',
                    title: '操作类型',
                    width: 68,
                  },
                  {
                    fid: 'operation',
                    title: '操作日志',
                    width:320,
                    fixed:true
                  },
                  {
                    fid: 'status',
                    title: '操作结果',
                  },
                ],tootls: [{ //分页显示
                  type: 'page',
                  positon: ['right', 'bottom'], // 默认在右下角
                  pageParam: 'p', //分页请求字段,默认为 : p
                  page: 1, //当前分页 默认：1
                  numberParam: 'limit', //分页数量请求字段默认为 : limit
                  number: 8, //分页数量默认 : 20条
                }],
              });
            }
          }]
        })
        $('#file_format_box').html(file_format_tab.$reader_content())
        file_format_tab.$init();

        // 点击切换tab
        $('#file_format_box .tab-nav span').eq(0).click(function () {
          $('#file_format_box').find('.submit_format_file_btn').show()
        });
        $('#file_format_box .tab-nav span').eq(1).click(function () {
          $('#file_format_box').find('.submit_format_file_btn').hide()
          file_logs_format.$refresh_table_list()
        });


        // 点击提交
        $('.submit_format_file').click(function(e){
          e.stopPropagation()
          e.preventDefault()
          var delete_select = $('#delete_old_file').prop('checked')
          var pdata_params = []
          // 循环存储数据
          $.each(file_format_list,function(index,item){
            var file_format_params_obj = {}
            // 当为多条数据时，只循环添加已选中的数据
            if($('.file_format_tbody  .file_tr').eq(index).hasClass('active')){
              file_format_params_obj['input_file'] = item.path
              // 出口文件为当前文件路径+新选的文件后缀
              if($('#format_save_path').html()[$('#format_save_path').html().length-1] != '/') $('#format_save_path').html($('#format_save_path').html()+'/')

              file_format_params_obj['output_file'] = $('#format_save_path').html()+item.name.split('.')[0]+'.'+$('.file_format_tbody .file_tr').eq(index).find('.bt_select_content').html()
              pdata_params.push(file_format_params_obj)
            }
          })
          // 判断是否有数据
          if(pdata_params.length == 0) return layer.msg('请选择需要转换的文件',{icon:2})
          var params = {
            is_save:delete_select?'1':'0',
            pdata:JSON.stringify(pdata_params)
          }
          that.set_format_suffix(params,function(res){
            // 循环结果数据
            if(res.status){
              var html = '';
              for (var i = 0; i < res.msg.length; i++) {
                var item = res.msg[i];
                html +=
                  '<tr><td><span>' +
                  item.name +
                  '</span></td><td><div style="float:right;"><span style="color:' +
                  (item.status ? '#20a53a' : 'red') +
                  '">' +
                  (item.status?'转换成功':'转换失败') +
                  '</span></div></td></tr>';
              }
              bt_tools.$batch_success_table({ title: '格式转换', th: '文件名称', html: html })
              layer.close(index)
              $('.file_path_refresh').click();
            }

          })
        })

        function check_selection(){
          // 判定是否勾选全选，当数据都能够转化时勾选全选，增加active类，当含有不可转化数据、无法执行数据时设置全选按钮样式为active_2

          // 获取可转化项
          var active_check_not = $('.file_format_tbody .file_tr .file_td:not(.notclick)');
          // var all_check = $('.file_format_tbody .file_checkbox')
          var active_check = $('.file_format_tbody .file_tr.active')
          if (active_check_not.length === active_check.length) {
            $('#file_format .file_main_title .file_check[data-type="all"]').addClass('active').removeClass('active_2')
          } else if (active_check.length > 0) {
            $('#file_format .file_main_title .file_check[data-type="all"]').addClass('active_2').removeClass('active')
          }else{
            $('#file_format .file_main_title .file_check[data-type="all"]').removeClass('active').removeClass('active_2')
          }
        }
        check_selection()
      },
    })
  },
  // 获取元素基于浏览器的位置
  getElementPosition:function(element) {
    let top = element.offsetTop //这是获取元素距父元素顶部的距离
    let left = element.offsetLeft
    var current = element.offsetParent //这是获取父元素
    while (current !== null && current.className !== 'layui-layer layui-layer-page  layer-anim') {
      //当它上面有元素时就继续执行
      top += current.offsetTop //这是获取父元素距它的父元素顶部的距离累加起来
      left += current.offsetLeft
      current = current.offsetParent //继续找父元素
    }
    return {
      top,
      left,
    }
  },
  /**
   * @description 获取实时任务视图
   * @returns void
   */
  get_present_task_view: function () {
    this.file_present_task = layer.open({
      type: 1,
      title: '实时任务队列',
      area: '500px',
      closeBtn: 2,
      skin: 'present_task_list',
      shadeClose: false,
      shade: false,
      offset: 'auto',
      content: '<div style="margin: 10px;" class="message-list"></div>',
    });
  },
  /**
   * @description 渲染实时任务列表数据
   * @returns void
   */
  render_present_task_list: function () {
    var that = this;
    this.get_task_req({ status: -3 }, function (lists) {
      if (lists.length == 0) {
        layer.close(that.file_present_task);
        that.file_present_task = null;
        that.reader_file_list({ path: that.file_path, is_operating: false });
        return;
      }
      var task_body = '',
        is_add = false;
      $.each(lists, function (index, item) {
        if (item.status == -1) {
          if (!that.file_present_task) that.get_present_task_view();
          if (item.type == '1') {
            task_body +=
              '<div class="mw-con">\
                            <ul class="waiting-down-list">\
                                <li>\
                                    <div class="down-filse-name"><span class="fname" style="width:80%;" title="正在下载: ' +
              item.shell +
              '">正在下载: ' +
              item.shell +
              '</span><span style="position: absolute;left: 84%;top: 25px;color: #999;">' +
              item.log.pre +
              '%</span><span class="btlink" onclick="bt_file.remove_present_task(' +
              item.id +
              ')" style="position: absolute;top: 25px;right: 20px;">取消</span></div>\
                                    <div class="down-progress"><div class="done-progress" style="width:' +
              item.log.pre +
              '%"></div></div>\
                                    <div class="down-info"><span class="total-size"> ' +
              item.log.used +
              '/' +
              ToSize(item.log.total) +
              '</span><span class="speed-size">' +
              (item.log.speed == 0 ? '正在连接..' : item.log.speed) +
              '/s</span><span style="margin-left: 20px;">预计还要: ' +
              item.log.time +
              '</span></div>\
                                </li>\
                            </ul>\
                            </div>';
          } else {
            task_body +=
              '<div class="mw-title"><span style="max-width: 88%;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' +
              item.name +
              ': ' +
              item.shell +
              '</span><span class="btlink" onclick="bt_file.remove_present_task(' +
              item.id +
              ')"  style="position: absolute;top: 10px;right: 15px;">取消</span></div>\
                        <div class="mw-con codebg">\
                            <code>' +
              item.log +
              '</code>\
                        </div>';
          }
        } else {
          if (!is_add) {
            task_body += '<div class="mw-title">等待执行任务</div><div class="mw-con"><ul class="waiting-list">';
            is_add = true;
          }
          task_body +=
            '<li><span class="wt-list-name" style="width: 90%;">' +
            item.name +
            ': ' +
            item.shell +
            '</span><span class="mw-cancel" onclick="bt_file.remove_present_task(' +
            item.id +
            ')">X</span></li>';
        }
      });
      if (that.file_present_task) {
        if (is_add) task_body += '</ul></div>';
        $('.message-list').html(task_body);
      }
      setTimeout(function () {
        that.render_present_task_list();
      }, 1000);
    });
  },
  /**
   * @description 取消实时任务列表
   * @returns void
   */
  remove_present_task: function (id) {
    var that = this;
    layer.confirm('是否取消当前执行的任务队列？', { title: '取消任务队列', icon: 0 }, function (indexs) {
      layer.close(indexs);
      var loadT = bt.load('正在取消任务...');
      bt.send('remove_task', 'task/remove_task', { id: id }, function (rdata) {
        loadT.close();
        layer.msg(rdata.msg, { icon: 1 });
        // layer.close(that.file_present_task)
        // that.file_present_task = null;
      });
    });
  },
  /**
   * @descripttion 设置访问权限
   * @returns void
   */
  edit_access_authority: function () {
    var access = $('#access').val();
    var idName = ['owner', 'group', 'public'];
    for (var n = 0; n < idName.length; n++) {
      $('#' + idName[n] + '_x').prop('checked', false);
      $('#' + idName[n] + '_w').prop('checked', false);
      $('#' + idName[n] + '_r').prop('checked', false);
    }
    var lh = access.length;
    access = lh === 1 ? '00' + access : lh === 2 ? '0' + access : access;
    for (var i = 0; i < access.length; i++) {
      var onacc = access.substr(i, 1);
      if (i > idName.length) continue;
      if (onacc > 7) $('#access').val(access.substr(0, access.length - 1));
      switch (onacc) {
        case '1':
          $('#' + idName[i] + '_x').prop('checked', true);
          break;
        case '2':
          $('#' + idName[i] + '_w').prop('checked', true);
          break;
        case '3':
          $('#' + idName[i] + '_x').prop('checked', true);
          $('#' + idName[i] + '_w').prop('checked', true);
          break;
        case '4':
          $('#' + idName[i] + '_r').prop('checked', true);
          break;
        case '5':
          $('#' + idName[i] + '_r').prop('checked', true);
          $('#' + idName[i] + '_x').prop('checked', true);
          break;
        case '6':
          $('#' + idName[i] + '_r').prop('checked', true);
          $('#' + idName[i] + '_w').prop('checked', true);
          break;
        case '7':
          $('#' + idName[i] + '_r').prop('checked', true);
          $('#' + idName[i] + '_w').prop('checked', true);
          $('#' + idName[i] + '_x').prop('checked', true);
          break;
      }
    }
  },
  /**
   * @description 获取文件权限 - ok
   * @param {Object} data 当前文件的数据对象
   * @param {Object} el 当前元素对象
   * @returns void
   */
  get_file_authority: function (data, callback) {
    this.$http('GetFileAccess', { filename: data.path }, function (rdata) {
      if (callback) callback(rdata);
    });
  },
  /**
   * @description 文件夹木马扫描
   * @param {Object} data 当前文件的数据对象
   * @returns void
   */
  set_dir_kill: function (data) {
    var that = this;
    var socket = null;
    var $layer = $('spyware_detection_view');
    var that_layer = null;
    var tableList = [];
    var path = data.path;
    bt.open({
      type: '1',
      title: '木马扫描 【' + path + '】',
      area: ['840px', '660px'],
      content:
        '\
			<div class="spyware_detection_view">\
				<div class="spyware_detection_head">\
					<div class="head_icon">\
						<div class="scanning" style="display: none;">\
							<img class="start_icon" src="/static/img/scanning-scan.svg" />\
							<div class="status_loading"></div>\
						</div>\
						<div class="scanning_danger" style="display: none;">\
							<img class="start_icon" src="/static/img/scanning-dangerous.svg" />\
							<div class="status_loading danger"></div>\
						</div>\
						<div class="done" style="display: none;">\
							<img class="icon success" src="/static/img/scanning-success.svg" />\
							<img class="icon danger" src="/static/img/scanning-danger.svg" style="display: none;" />\
						</div>\
					</div>\
					<div class="head_left">\
						<div class="info">当前未进行木马查杀</div>\
						<div class="file"></div>\
					</div>\
					<div class="head_right">\
						<button type="button" class="btn btn-default cancel-detection-btn" style="display: none;">取消查杀</button>\
						<button type="button" class="btn btn-default reset-detection-btn" style="display: none; margin-right: 6px">重新查杀</button>\
						<button type="button" class="btn btn-success done-detection-btn" style="display: none; width: 70px;">完成</button>\
					</div>\
				</div>\
				<!-- <div class="spyware_detection_progress">\
					<div class="progress_bar">\
						<div class="inner"></div>\
					</div>\
					<div class="text">0%</div>\
				</div> -->\
				<div class="spyware_detection_body">\
					<div id="spyware_detection_table"></div>\
				</div>' +
        bt.render_help(['本处为快速扫描，基于木马特征进行识别，可能会有遗漏或误报，更精准的结果以【网站-设置-安全扫描】为主']) +
        '</div>',
      success: function (layero, index) {
        that_layer = this;
        $layer = layero;

        this.init_table();
        that_layer.reset_detection();

        // 重新查杀
        $('.reset-detection-btn').click(function () {
          that_layer.reset_detection();
        });

        // 取消
        $('.cancel-detection-btn').click(function () {
          bt.confirm(
            {
              title: '取消查杀',
              msg: '当前正在进行木马查杀，确定停止查杀？',
            },
            function (indexs) {
              that_layer.stop_detection();
              layer.close(indexs);
            }
          );
        });

        // 完成
        $('.done-detection-btn').click(function () {
          layer.close(index);
        });

        $layer.prev().css({ 'z-index': 19999 });
        $layer.css({ 'z-index': 20000 });
      },
      cancel: function (index) {
        if (that_layer.detection_status != 'done') {
          bt.confirm(
            {
              msg: '正在木马查杀，关闭即表示结束查杀',
              title: '确定关闭木马查杀',
            },
            function (indexs) {
              that_layer.stop_detection();
              layer.close(indexs);
              layer.close(index);
            }
          );
        }
        return that_layer.detection_status == 'done';
      },
      init_table: function () {
        var that_layer = this;
        this.spyTable = bt_tools.table({
          el: '#spyware_detection_table',
          default: '暂无数据',
          height: '376',
          data: [],
          column: [
            {
              type: 'checkbox',
              width: 20,
            },
            {
              fid: 'filename',
              title: '文件名',
              width: 140,
              type: 'text',
              template: function (row) {
                return '<span class="flex" title="' + row.filename + '"><span style="flex: 1; width: 0;" class="text_ellipsis">' + row.filename + '</span></span>';
              },
            },
            {
              fid: 'path',
              title: '文件路径',
              type: 'text',
              template: function (row) {
                return '<span class="flex" title="' + row.path + '"><span style="flex: 1; width: 0;" class="text_ellipsis">' + row.path + '</span></span>';
              },
            },
            {
              type: 'group',
              title: '操作',
              width: 140,
              align: 'right',
              group: [
                {
                  title: '误报',
                  event: function (row) {
                    bt.show_confirm('误报反馈', '<span class="red">是否确定提交误报反馈</br></span>', function () {
                      var loadT = bt.load('正在添加URL白名单，请稍候...');
                      bt.send('send_baota', 'files/send_baota', { filename: row.path }, function (res) {
                        loadT.close();
                        bt.msg(res);
                      });
                    });
                  },
                },
                {
                  title: '编辑',
                  event: function (row) {
                    openEditorView(0, row.path);
                  },
                },
                {
                  title: '删除',
                  event: function (row, index) {
                    that.del_file_or_dir(row, function (res) {
                      if (res.status) {
                        tableList.splice(index, 1);
                        that_layer.set_table_list();
                      }
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
                callback: function (data) {
                  bt.confirm(
                    {
                      title: '批量删除',
                      msg: '确认删除选中内容,删除后将移至回收站，是否继续操作?',
                    },
                    function (indexs) {
                      var layerT = bt.load('正在批量删除文件，请稍候...');
                      var list = [];
                      var i = 0;
                      var checkList = data.check_list;

                      function delFile(data, callback) {
                        bt.send('DeleteFile', 'files/DeleteFile', { path: data.path }, function (res) {
                          list.push({
                            filename: data.filename,
                            status: res.status,
                            result: res.status ? '删除成功' : '删除失败',
                          });
                          if (res.status) {
                            var fileIndex = -1;
                            for (var i = 0; i < tableList.length; i++) {
                              if (tableList[i].path == data.path) {
                                fileIndex = i;
                              }
                            }
                            if (fileIndex != -1) {
                              tableList.splice(fileIndex, 1);
                            }
                          }
                          callback && callback(res);
                        });
                      }
                      function callback() {
                        i++;
                        if (i >= checkList.length) {
                          that_layer.set_table_list();
                          layerT.close();
                          bt.open({
                            type: '1',
                            title: '批量删除',
                            area: '350px',
                            content:
                              '\
														<div class="batch_title">\
															<span class="batch_icon"></span>\
															<span class="batch_text">批量删除操作完成！</span>\
														</div>\
														<div id="batch_table" style="margin: 15px 30px 15px 30px;"></div>\
													',
                            success: function ($layers) {
                              bt_tools.table({
                                el: '#batch_table',
                                height: '200px',
                                data: list,
                                column: [
                                  {
                                    fid: 'filename',
                                    title: '文件名',
                                    type: 'text',
                                    template: function (row) {
                                      return '<span class="flex" title="' + row.filename + '"><span style="flex: 1; width: 0;" class="text_ellipsis">' + row.filename + '</span></span>';
                                    },
                                  },
                                  {
                                    fid: 'result',
                                    title: '操作结果',
                                    type: 'text',
                                    width: 90,
                                    align: 'right',
                                    template: function (row) {
                                      return '<span style="color: ' + (row.status ? '#20a53a' : 'red') + '">' + row.result + '</span>';
                                    },
                                  },
                                ],
                              });

                              var top = ($(window).height() - $layers.height()) / 2;
                              $layers.css('top', top + 'px');
                            },
                          });
                        } else {
                          delFile(checkList[i], callback);
                        }
                      }
                      delFile(checkList[i], callback);
                    }
                  );
                },
              },
            },
          ],
        });
      },
      reset_detection: function () {
        that_layer.detection_status = 'start';
        $layer.find('.spyware_detection_head .file').text('开始文件查杀');
        this.show_cancel_btn();
        this.init_info();
        this.reset_table();
        this.reset_tq_num();
        this.set_progress(0);
        this.set_stop_status(false);
        this.set_search_file_num(0);
        this.set_icon_status('scanning');
        // this.set_progress_color('success');
        this.start_detection();
      },
      // 显示取消按钮
      show_cancel_btn: function () {
        $('.done-detection-btn').hide();
        $('.start-detection-btn').hide();
        $('.reset-detection-btn').hide();
        $('.cancel-detection-btn').show();
      },
      // 显示完成按钮
      show_done_btn: function () {
        $('.start-detection-btn').hide();
        $('.cancel-detection-btn').hide();
        $('.done-detection-btn').show();
        $('.reset-detection-btn').show();
      },
      // 初始化信息
      init_info: function () {
        $layer
          .find('.spyware_detection_head .info')
          .html('<span class="status">正在查杀</span>，已扫描过滤文件<span class="scanned_num">0</span>/<span class="total_num">0</span>个；发现木马文件<span class="tqnum">0</span>个');
      },
      // 改变完成状态
      change_status_done: function () {
        $layer.find('.spyware_detection_head .info .status').text('查杀完成');
      },
      // 设置进度条进度
      set_progress: function (val) {
        if (val == 0) {
          $layer.find('.progress_bar .inner').remove();
          $layer.find('.progress_bar').html('<div class="inner"></div>');
        } else {
          $layer.find('.progress_bar .inner').css('width', val + '%');
          $layer.find('.spyware_detection_progress .text').text(val + '%');
        }
      },
      // 设置进度条颜色
      set_progress_color: function (status) {
        switch (status) {
          case 'success':
            $layer.find('.progress_bar .inner').css('background-color', '#20a53a');
            break;
          case 'danger':
            $layer.find('.progress_bar .inner').css('background-color', 'red');
            break;
        }
      },
      // 设置木马扫描进度条
      set_search_progress: function (scanned, total) {
        if (total == 0) return;
        var range = ((scanned / total) * 100).toFixed(1);
        this.set_progress(range);
      },
      // 设置图标状态
      set_icon_status: function (state) {
        $layer.find('.spyware_detection_head .head_icon>div').hide();
        var $icon = $layer.find('.spyware_detection_head .head_icon .' + state);
        $icon.show();
        switch (state) {
          case 'done':
            var img = $layer.find('.spyware_detection_head .tqnum').text() <= 0 ? 'success' : 'danger';
            $icon.find('.icon').hide();
            $icon.find('.icon.' + img).show();
            break;
        }
      },
      // 设置搜索文件数量
      set_search_file_num: function (scanned, total) {
        $layer.find('.spyware_detection_head .scanned_num').text(scanned);
        if (total) $layer.find('.spyware_detection_head .total_num').text(total);
      },
      // 设置搜索文件信息
      set_search_file_text: function (text) {
        $layer.find('.spyware_detection_head .file').text(text);
      },
      // 重置木马数量
      reset_tq_num: function () {
        $layer.find('.tqnum').text(0);
      },
      // 设置停止状态
      set_stop_status: function (val) {
        this.stop_status = val;
        if (val) this.on_close();
      },
      // 添加木马数量
      add_tq_num: function () {
        var num = $layer.find('.tqnum').text() || 0;
        num++;
        $layer.find('.tqnum').text(num);
      },
      // 开始查杀
      start_detection: function () {
        this.connect();
      },
      // 停止查杀
      stop_detection: function () {
        this.set_stop_status(true);
        this.set_progress(100.0);
        this.show_done_btn();
        this.set_icon_status('done');
        this.change_status_done();
        $layer.find('.spyware_detection_head .info .status').text('查杀已取消');
        $layer.find('.spyware_detection_head .file').text('扫描已完成');
      },
      // 重置表格数据
      reset_table: function () {
        tableList = [];
        this.set_table_list();
      },
      // 设置表格数据
      set_table_data: function (data) {
        var path = data.path;
        if (!path) return;
        var filename = path.substring(path.lastIndexOf('/') + 1, path.length);
        that.$http('get_file_attribute', { filename: path }, function (res) {
          tableList.push({
            type: res.is_dir ? 'dir' : 'file',
            type_tips: res.is_dir ? '文件夹' : '文件',
            filename: filename,
            path: path,
          });
          that_layer.set_table_list();
        });
      },
      set_table_list: function () {
        this.spyTable.$reader_content(tableList);
      },
      connect: function () {
        // 连接
        var url = (window.location.protocol === 'http:' ? 'ws://' : 'wss://') + window.location.host + '/ws_panel';
        socket = new WebSocket(url);
        // 绑定事件
        socket.addEventListener('open', this.on_open);
        socket.addEventListener('error', this.on_error);
        socket.addEventListener('message', this.on_message);
      },
      send: function (data, success) {
        // 判断当前连接状态，如果 != 1，则100ms后尝试重新发送
        if (socket.readyState === 1) {
          socket.send(JSON.stringify(data));
          if (success) success();
        } else {
          setTimeout(function () {
            that_layer.send(data);
          }, 100);
        }
      },
      on_open: function (e) {
        var token = $('#request_token_head').attr('token');
        that_layer.send({ mod_name: 'files', 'x-http-token': token });
        that_layer.send({ mod_name: 'files', def_name: 'ws_webshell_check', ws_callback: 1, path: path });
      },
      on_close: function () {
        if (socket) {
          socket.close();
          socket = null;
        }
      },
      on_error: function (e) {
        console.log(e);
      },
      on_message: function (e) {
        var dataStr = e.data;
        if (!dataStr) return;
        if (that_layer.stop_status === true) return;
        var data = JSON.parse(dataStr);
        that_layer.set_search_file_text(data.info);
        if (data.end === false) {
          that_layer.set_search_file_num(data.is_count, data.count);
        }
        if (data.end === false && data.status === false) {
          that_layer.set_search_progress(data.is_count, data.count);
        }
        if (data.end === false && data.status === true) {
          that_layer.set_icon_status('scanning_danger');
          // that_layer.set_progress_color('danger');
          that_layer.add_tq_num();
          that_layer.set_table_data(data);
        }
        if (data.end === true && data.is_max !== true) {
          that_layer.detection_status = 'done';
          that_layer.set_progress(100.0);
          that_layer.change_status_done();
          that_layer.show_done_btn();
          that_layer.set_icon_status('done');
        } else if (data.end === true && data.is_max === true) {
          that_layer.detection_status = 'done';
          that_layer.set_icon_status('done');
          that_layer.set_progress(100.0);
          that_layer.show_done_btn();
          $layer.find('.head_left .info').text('查杀失败');
          $layer.find('.head_icon .done .icon.success').hide();
          $layer.find('.head_icon .done .icon.danger').show();
          $layer.find('.reset-detection-btn').hide();
        }
      },
    });
    // if (data.ext == 'php') {
    //     that.$http('file_webshell_check', { filename: data.path }, function(rdata) {
    //         layer.msg(rdata.msg, { icon: rdata.status ? 1 : 2 })
    //     })
    // } else {
    //     layer.confirm('木马扫描将包含子目录中的php文件，是否操作？', { title: '木马扫描[' + data['filename'] + ']', closeBtn: 2, icon: 3 }, function(index) {
    //         that.$http('dir_webshell_check', { path: data.path }, function(rdata) {
    //             layer.msg(rdata.msg, { icon: rdata.status ? 1 : 2 })
    //         })
    //     })
    // }
  },
  /**
   * @description 文件路径合并
   * @param {String} paths 旧路径
   * @param {String} param 新路径
   * @return {String} 新的路径
   */
  path_resolve: function (paths, param) {
    var path = '',
      split = '';
    if (!Array.isArray(param)) param = [param];
    paths.replace(/([\/|\/]*)$/, function ($1) {
      split = $1;
      return 'www';
    });
    $.each(param, function (index, item) {
      path += '/' + item;
    });
    return (paths + path).replace('//', '/');
  },

  /**
   * @descripttion 取扩展名
   * @return: 返回扩展名
   */
  get_ext_name: function (fileName) {
    var extArr = fileName.split('.');
    var exts = [
      'folder',
      'folder-unempty',
      'sql',
      'c',
      'cpp',
      'cs',
      'flv',
      'css',
      'js',
      'htm',
      'html',
      'java',
      'log',
      'mht',
      'php',
      'url',
      'xml',
      'ai',
      'bmp',
      'cdr',
      'gif',
      'ico',
      'jpeg',
      'jpg',
      'JPG',
      'png',
      'psd',
      'webp',
      'ape',
      'avi',
      'mkv',
      'mov',
      'mp3',
      'mp4',
      'mpeg',
      'mpg',
      'rm',
      'rmvb',
      'swf',
      'wav',
      'webm',
      'wma',
      'wmv',
      'rtf',
      'docx',
      'fdf',
      'potm',
      'pptx',
      'txt',
      'xlsb',
      'xlsx',
      '7z',
      'cab',
      'iso',
      'rar',
      'zip',
      'gz',
      'bt',
      'file',
      'apk',
      'bookfolder',
      'folder-empty',
      'fromchromefolder',
      'documentfolder',
      'fromphonefolder',
      'mix',
      'musicfolder',
      'picturefolder',
      'videofolder',
      'sefolder',
      'access',
      'mdb',
      'accdb',
      'fla',
      'doc',
      'docm',
      'dotx',
      'dotm',
      'dot',
      'pdf',
      'ppt',
      'pptm',
      'pot',
      'xls',
      'csv',
      'xlsm',
    ];
    var extLastName = extArr[extArr.length - 1];
    for (var i = 0; i < exts.length; i++) {
      if (exts[i] == extLastName) {
        return exts[i];
      }
    }
    return 'file';
  },

  /**
   * @description 获取路径上的文件名称
   * @param {String} path 路径
   * @return {String} 文件名称
   */
  get_path_filename: function (path) {
    var paths = path.split('/');
    return paths[paths.length - 1];
  },

  /**
   * @description 返回上一层目录地址
   * @param {String} path 当前路径
   * @returns 返回上一层地址
   */
  retrun_prev_path: function (path) {
    var dir_list = path.split('/');
    dir_list.splice(dir_list.length - 1);
    if (dir_list == '') dir_list = ['/'];
    return dir_list.join('/');
  },
  /**
   * @descripttion: 路径过滤
   * @return: 无返回值
   */
  path_check: function (path) {
    path = path.replace('//', '/');
    if (path === '/') return path;
    path = path.replace(/\/+$/g, '');
    return path;
  },

  /**
   * @description 获取文件权限信息
   * @param {Object} data 请求传入参数
   * @param {Function} callback 回调参数
   * @returns void
   */
  get_file_access: function (data, callback) {
    var that = this;
    this.layerT = bt.load('正在文件权限信息，请稍候...');
    bt.send('GetFileAccess', 'files/GetFileAccess', { path: data.path }, function (res) {
      that.loadT.close();
      if (callback) callback();
    });
  },
  /**
   * @description 获取可上传的云存储列表
   * @param {Object} data 当前选中文件的数据
   */
  get_cosfs_upload_list: function (data) {
    var that = this,
      type = data.open.indexOf('up_') != -1 ? 'upload' : 'down';
    var _item = {};
    if (!this.cloud_storage_use_status) {
      return bt_tools.msg('抱歉，此功能只对企业版用户开放!', 2);
    }
    $.each(type == 'upload' ? this.cloud_storage_upload_list : this.cloud_storage_download_list, function (index, item) {
      // 索引相同存储的数据
      if (data.open.indexOf(item.name) != -1) {
        _item = item;
        return false;
      }
    });
    // 判断当前存储是否安装
    if (_item.setup) {
      // 是否配置密钥
      if (_item.is_conf) {
        that.cloud_storage_type = type;
        that.cloud_storage_config = _item;
        that.get_cloud_path_view(data);
      } else {
        // 再次确认是否有密钥
        bt_tools.send({ url: '/files/upload/get_oss_objects', data: {} }, function (list) {
          $.each(list[type], function (ie, io) {
            if (data.open.indexOf(io.name) != -1) {
              if (io.is_conf) {
                that.cloud_storage_type = type;
                that.cloud_storage_config = _item;
                that.get_cloud_path_view(data);
              } else {
                bt.soft.set_lib_config(_item.name, _item.title);
              }
            }
          });
        });
      }
    } else {
      bt.soft.install(_item.name); // 安装云存储插件
    }
  },
  /**
   * @description 获取云存储路径视图
   * @param {Object} data 当前选中文件的数据
   * @returns void
   **/
  get_cloud_path_view: function (data) {
    var that = this,
      isUpload = this.cloud_storage_type == 'upload' ? true : false;
    layer.open({
      type: 1,
      area: ['700px', '670px'],
      title: isUpload ? '上传到' + this.cloud_storage_config.title : '从' + this.cloud_storage_config.title + '下载 【勾选需要下载的文件】',
      btn: [isUpload ? '上传' : '下载', '取消'],
      skin: 'file-cloud-view',
      content:
        '<div class="cloud-layer-view ">' +
        '<div class="cloud-head-box pd15"></div>' +
        '<div class="cloud-content-box pd15">' +
        '<div class="divtable" style="margin-bottom:15px">' +
        '<table class="table table-hover">' +
        '<thead><tr><th width="30"></th><th>名称</th><th>大小</th><th>更新时间</th></tr></thead>' +
        '<tbody class="list-list"></tbody>' +
        '</table>' +
        '</div></div></div>',
      success: function () {
        // 默认获取列表
        that.get_cloud_path_list('/');
      },
      yes: function (layers) {
        var url = '',
          param = {};
        if (isUpload) {
          url = '/files/upload/upload_file';
          param = { name: that.cloud_storage_config.name, filename: data.path, object_name: $('#cloudPath').val() };
        } else {
          var downActive = $('.list-list tr.active'),
            downFile = downActive.find('.cursor span:eq(1)').text(),
            downPath = downActive.find('input').data('download');
          if (downActive.length == 0) {
            layer.msg('请选择勾选需要下载的文件', { icon: 0 });
          }
          url = '/files/down/download_file';
          param = { name: that.cloud_storage_config.name, url: downPath, path: that.file_path, filename: downFile };
        }
        bt_tools.send({ url: url, data: { data: JSON.stringify(param) } }, function (res) {
          if (res.status) {
            layer.close(layers);
            that.render_present_task_list(); //下载时显示进度
          }
          layer.msg(res.msg, { icon: res.status ? 1 : 2 });
        });
      },
    });
  },
  /**
   * @description 获取云存储路径列表
   * @param {String} path 当前路径
   * @returns void
   **/
  get_cloud_path_list: function (path) {
    var that = this,
      thatCloudInfo = this.cloud_storage_config;
    bt_tools.send(
      { url: '/plugin?action=a&s=get_list&name=' + thatCloudInfo.name, data: { path: path } },
      function (clist) {
        if (typeof clist.status != 'undefined' && !clist.status) {
          return bt.soft.set_lib_config(thatCloudInfo.name, thatCloudInfo.title);
        }
        var headHtml = '',
          listBody = '',
          listFiles = '';
        for (var i = 0; i < clist.list.length; i++) {
          if (clist.list[i].type == null) {
            listBody +=
              '<tr><td></td><td class="cursor" onclick="bt_file.get_cloud_path_list(\'' +
              (path + '/' + clist.list[i].name).replace('//', '/') +
              '\')"><span class="ico ico-folder"></span><span>' +
              clist.list[i].name +
              '</span></td><td>-</td><td>-</td></tr>';
          } else {
            listFiles +=
              '<tr><td>' +
              (that.cloud_storage_type == 'upload' ? '' : '<input type="checkbox" data-download="' + clist.list[i].download + '"/>') +
              '</td><td class="cursor"><span class="ico ico-file"></span><span>' +
              clist.list[i].name +
              '</span></td><td>' +
              ToSize(clist.list[i].size) +
              '</td><td>' +
              getLocalTime(clist.list[i].time) +
              '</td></tr>';
          }
        }
        listBody += listFiles;

        //路径渲染
        var pathLi = '';
        var tmp = path.split('/');
        var pathname = '';
        var n = 0;
        for (var i = 0; i < tmp.length; i++) {
          if (n > 0 && tmp[i] == '') continue;
          var dirname = tmp[i];
          if (dirname == '') {
            dirname = '根目录';
            n++;
          }
          pathname += '/' + tmp[i];
          pathname = pathname.replace('//', '/');
          pathLi += '<li><a title="' + pathname + '" onclick="bt_file.get_cloud_path_list(\'' + pathname + '\')">' + dirname + '</a></li>';
        }
        var um = 1;
        if (tmp[tmp.length - 1] == '') um = 2;
        var backPath = tmp.slice(0, tmp.length - um).join('/') || '/';

        headHtml +=
          '<button id="backBtn" class="btn btn-default btn-sm glyphicon glyphicon-arrow-left pull-left" title="后退" onClick="bt_file.get_cloud_path_list(\'' +
          backPath +
          '\')"></button>' +
          '<input id="cloudPath" style="display:none;" type="text" value="' +
          path +
          '">' +
          '<div class="place-input pull-left"><div style="width:1400px;height:28px"><ul>' +
          pathLi +
          '</ul></div></div>' +
          '<button class="refreshBtn btn btn-default btn-sm glyphicon glyphicon-refresh pull-left mr20" title="刷新" onclick="bt_file.get_cloud_path_list(\'' +
          path +
          '\')" style="margin-left:-1px;"></button>';

        $('.cloud-head-box').html(headHtml);
        $('.cloud-content-box .list-list').html(listBody);

        //事件绑定
        $('.cloud-content-box .list-list')
          .unbind('click')
          .on('click', 'tr', function () {
            var $this = $(this);
            if ($this.hasClass('active')) {
              $this.removeClass('active');
              $this.find('input').attr('checked', false);
            } else {
              $this.addClass('active').siblings().removeClass('active');
              $this.siblings().find('input').attr('checked', false);
            }
          });
      },
      { load: '获取云存储列表', verify: false }
    );
  },
  /**
   * @description 发送至邮箱
   * @param {Object} data 请求传入参数
   */
  send_mail_view: function (data) {
    var that = this,
      sendMailForm = null;
    var item = {
      ps: '宝塔邮箱消息通道，用于接收面板消息推送',
      pluginName: '邮件',
      description: ['面板消息推送', '接收面板文件'],
      preview: false,
      imgSrc: 'https://www.bt.cn/Public/new/plugin/introduce/files/sendEmail.png',
    };
    if (!that.check_ltd_end(item, 72)) return;
    bt_tools.send(
      { url: '/files/upload/check_email_config', data: {} },
      function (mail) {
        if (!mail.setup) {
          layer.open({
            type: 1,
            title: '安装邮箱模块',
            shadeClose: false,
            area: ['390px', '210px'],
            btn: false,
            content:
              '<div class="alarm-view"><div class="plugin_user_info c7">\
                <p><b>名称：</b>邮箱</p>\
                <p><b>版本：</b>1.0</p>\
                <p><b>描述：</b>宝塔邮箱消息通道，用于接收面板消息推送</p>\
                <p><b>说明：</b><a class="btlink" href="" target=" _blank"></a></p>\
                <p><button class="btn btn-success btn-sm mt1 installMailModule">安装模块</button></p>\
            </div></div>',
            success: function () {
              $('.installMailModule').click(function () {
                bt_tools.send(
                  { url: '/config?action=install_msg_module', data: { name: 'mail' } },
                  function (res) {
                    if (res.status) {
                      layer.closeAll();
                    }
                    layer.msg(res.msg, { icon: res.status ? 1 : 2 });
                  },
                  '安装邮箱模块'
                );
              });
            },
          });
        } else {
          bt_tools.open({
            title: '发送至邮箱',
            area: ['500px', '350px'],
            btn: ['发送', '取消'],
            content: '<div class="ptb20" id="send_mail_form"></div>',
            success: function () {
              sendMailForm = bt_tools.form({
                el: '#send_mail_form',
                form: [
                  {
                    label: '接收者邮箱',
                    group: {
                      type: 'text',
                      name: 'to_email',
                      width: '360px',
                      placeholder: '请输入接收者邮箱，支持同时发送到多个邮箱，用逗号“,”隔开',
                    },
                  },
                  {
                    label: '内容',
                    group: {
                      type: 'textarea',
                      name: 'msg',
                      width: '360px',
                      style: {
                        'min-height': '100px',
                        'line-height': '22px',
                        'padding-top': '5px',
                        resize: 'both',
                      },
                    },
                  },
                  {
                    label: '附件',
                    group: {
                      type: 'text',
                      name: 'file',
                      width: '360px',
                      disabled: true,
                      value: data.filename,
                    },
                  },
                ],
              });
            },
            yes: function (indexs) {
              var formValue = sendMailForm.$get_form_value();
              if (!bt.check_email(formValue.to_email)) return layer.msg('请输入接收者邮箱', { icon: 2 });
              delete formValue['file'];
              formValue['flist'] = [data.path];
              bt_tools.send(
                { url: 'files/upload/send_to_email', data: { data: JSON.stringify(formValue) } },
                function (res) {
                  if (res.status) {
                    layer.close(indexs);
                    that.email_send_status_list(res);
                  }
                },
                '发送文件'
              );
            },
          });
        }
      },
      '获取邮箱状态'
    );
  },
  /**
   * @description 邮箱发送情况列表
   * @param {Object} data 发送后的邮箱列表
   */
  email_send_status_list: function (data) {
    layer.open({
      type: 1,
      title: '文件发送状态',
      btn: false,
      area: '590px',
      content:
        '<div class="divtable pd15" style="max-height: 330px;overflow: auto;"><table class="table table-hover" id="email_send_status_list"><thead><tr><th>邮箱</th><th>详情</th></tr></thead><tbody></tbody></table></div>',
      success: function () {
        var _list = '';
        $.each(data.list, function (i, item) {
          var _msg = '';
          if (typeof item === 'string') {
            _msg = item;
          } else {
            if ($.isEmptyObject(item.error)) {
              _msg = '<span class="btlink">发送成功</span>';
            } else {
              $.each(item.error, function (ie, eitem) {
                _msg = '<span class="btlink">发送成功</span>,<span class="bterror">但' + ie + eitem + '</span>';
              });
            }
          }
          _list += '<tr><td>' + i + '</td><td>' + _msg + '</td></tr>';
        });
        $('#email_send_status_list tbody').html(_list);
      },
    });
  },
  /**
   * @description 创建外链下载
   * @param {Object} data 请求传入参数
   * @param {Function} callback 回调参数
   * @returns void
   */
  create_download_url: function (data, callback) {
    var that = this;
    this.layerT = bt.load('正在分享文件，请稍候...');
    bt.send('create_download_url', 'files/create_download_url', { filename: data.filename, ps: data.ps, password: data.password, expire: data.expire }, function (res) {
      that.layerT.close();
      if (callback) callback(res);
    });
  },

  /**
   * @description 获取外链下载数据
   * @param {Object} data 请求传入参数
   * @param {Function} callback 回调参数
   * @returns void
   */
  get_download_url_find: function (data, callback) {
    var that = this;
    this.layerT = bt.load('正在获取分享文件信息，请稍候...');
    bt.send('get_download_url_find', 'files/get_download_url_find', { id: data.id }, function (res) {
      that.layerT.close();
      if (callback) callback(res);
    });
  },

  /**
   * @description 删除外链下载
   * @param {Object} data 请求传入参数
   * @param {Function} callback 回调参数
   * @returns void
   */
  remove_download_url: function (data, callback) {
    var that = this;
    layer.confirm('是否取消分享该文件【' + data.fileName + '】，是否继续？', { title: '取消分享', closeBtn: 2, icon: 3 }, function () {
      this.layerT = bt.load('正在取消分享文件，请稍候...');
      bt.send('remove_download_url', 'files/remove_download_url', { id: data.id }, function (res) {
        if (callback) callback(res);
      });
    });
  },

  /**
   * @description 获取磁盘列表
   * @param {Function} callback 回调参数
   * @returns void
   */
  get_disk_list: function (callback) {
    bt_tools.send(
      'system/GetDiskInfo',
      function (res) {
        if (callback) callback(res);
      },
      '获取磁盘列表'
    );
  },

  // 新建文件（文件和文件夹）
  create_file_req: function (data, callback) {
    var _req = data.type === 'folder' ? 'CreateDir' : 'CreateFile';
    bt.send(
      _req,
      'files/' + _req,
      {
        path: data.path,
      },
      function (res) {
        if (callback) callback(res);
      }
    );
  },

  // 重命名文件（文件或文件夹）
  rename_file_req: function (data, callback) {
    bt_tools.send(
      'files/MvFile',
      {
        sfile: data.sfile,
        dfile: data.dfile,
        rename: data.rename || true,
      },
      function (res) {
        if (callback) callback(res);
      },
      '执行重命名'
    );
  },

  // 剪切文件请求（文件和文件夹）
  shear_file_req: function (data, callback) {
    this.rename_file_req(
      {
        sfile: data.sfile,
        dfile: data.dfile,
        rename: false,
      },
      function (res) {
        if (callback) callback(res);
      },
      '执行剪切'
    );
  },

  // 检查文件是否存在（复制文件和文件夹前需要调用）
  check_exists_files_req: function (data, callback) {
    var layerT = bt.load('正在粘贴文件，请稍候...');
    bt.send(
      'CheckExistsFiles',
      'files/CheckExistsFiles',
      {
        dfile: data.dfile,
        filename: data.filename,
      },
      function (res) {
        layerT.close();
        if (callback) callback(res);
      }
    );
  },

  // 复制文件（文件和文件夹）
  copy_file_req: function (data, callback) {
    bt.send(
      'CopyFile',
      'files/CopyFile',
      {
        sfile: data.sfile,
        dfile: data.dfile,
      },
      function (res) {
        if (callback) callback(res);
      }
    );
  },

  // 压缩文件（文件和文件夹）
  compress_file_req: function (data, callback) {
    bt.send(
      'Zip',
      'files/Zip',
      {
        sfile: data.sfile,
        dfile: data.dfile,
        z_type: data.z_type,
        path: data.path,
      },
      function (res) {
        if (callback) callback(res);
      }
    );
  },

  // 获取实时任务
  get_task_req: function (data, callback) {
    bt.send(
      'get_task_lists',
      'task/get_task_lists',
      {
        status: data.status,
      },
      function (res) {
        if (callback) callback(res);
      }
    );
  },

  // 获取文件权限
  get_file_access: function () {
    bt.send(
      'GetFileAccess',
      'files/GetFileAccess',
      {
        filename: data.filename,
      },
      function (res) {
        if (callback) callback(res);
      }
    );
  },

  // 设置文件权限
  set_file_access: function () {
    bt.send(
      'SetFileAccess',
      'files/SetFileAccess',
      {
        filename: data.filename,
        user: data.user,
        access: data.access,
        all: data.all,
      },
      function (res) {
        if (callback) callback(res);
      }
    );
  },

  /**
   * @description 删除文件（文件和文件夹）
   * @param {Object} data 文件目录参数
   * @param {Function} callback 回调函数
   * @return void
   */
  del_file_req: function (data, callback) {
    var _req = data.type === 'dir' ? 'DeleteDir' : 'DeleteFile';
    var layerT = bt.load('正在删除文件，请稍候...');
    bt_tools.send( {url:'/files?action=' + _req, data:{ path: data.path }}, function (res) {
      layerT.close();
      if (callback) callback(res);
    })
  },

  /**
   * @description 下载文件
   * @param {Object} 文件目录参数
   * @param {Function} callback 回调函数
   * @return void
   */
  down_file_req: function (data, callback) {
    window.open('/download?filename=' + encodeURIComponent(data.path));
  },
  /**
   * @description 拆分文件
   * @param {Object} 文件目录参数
   * @param {Function} callback 回调函数
   * @return void
   */
  split_file: function (data, callback) {
    var that = this;
    bt_tools.open({
      title: '【' + data.filename + '】文件拆分',
      area: ['550px', '400px'],
      skin: 'splitOpen',
      btn: ['确定', '取消'],
      content: {
        //配置请查看表单form方法中的类型
        class: 'pd20',
        form: [
          {
            label: '拆分方式',
            group: [
              {
                type: 'checkbox',
                class: 'mr20',
                name: 'typeS',
                title: '按大小拆分',
                value: true,
                event: function (row, el, that) {
                  if (!row.typeN) {
                    if (!row.typeS) {
                      // 必须选择1个
                      that.config.form[0].group[0].value = true;
                      that.$replace_render_content(0);
                    }
                  } else {
                    // 切换选择
                    that.config.form[0].group[0].value = true;
                    that.config.form[0].group[1].value = false;
                    that.config.form[1].label = '大小';
                    that.config.form[1].group[0].value = 1024;
                    that.config.form[1].group[0].unit = 'MB';
                    that.config.form[1].group[1].boxcontent = '<span style="color:#777;">拆分后的每个文件大小</span>';
                    that.$replace_render_content(0);
                    that.$replace_render_content(1);
                  }
                },
              },
              {
                type: 'checkbox',
                name: 'typeN',
                title: '按数量拆分',
                value: false,
                event: function (row, el, that) {
                  if (!row.typeS) {
                    if (!row.typeN) {
                      // 必须选择1个
                      that.config.form[0].group[1].value = true;
                      that.$replace_render_content(0);
                    }
                  } else {
                    // 切换选择
                    that.config.form[0].group[0].value = false;
                    that.config.form[0].group[1].value = true;
                    that.config.form[1].label = '数量';
                    that.config.form[1].group[0].value = 5;
                    that.config.form[1].group[0].unit = '个';
                    that.config.form[1].group[1].boxcontent = '<span style="color:#777;">文件大小 &divide; 数量 = 拆分大小</span>';
                    that.$replace_render_content(0);
                    that.$replace_render_content(1);
                  }
                },
              },
            ],
          },
          {
            label: '大小',
            group: [
              {
                type: 'number',
                class: 'group',
                name: 'num',
                width: '80px',
                value: 1024,
                unit: 'MB',
              },
              {
                name: 'other-num',
                type: 'other',
                class: 'ml20',
                boxcontent: '<span style="color:#777;">拆分后的每个文件大小</span>',
              },
            ],
          },
          {
            label: '存放目录',
            group: {
              type: 'text',
              width: '200px',
              name: 'path',
              style: 'overflow: hidden;white-space: nowrap;text-overflow: ellipsis;',
              icon: {
                type: 'glyphicon-folder-open',
                event: function (formData, element, that) {
                  $('#bt_select').one('click', function () {
                    $('input[name="path"]').attr('title', $('input[name="path"]').val());
                  });
                },
              },
              value: bt_file.file_path,
              placeholder: '请选择文件目录',
            },
          },
          {
            group: {
              type: 'help',
              list: ['拆分后会在存放目录(默认当前目录)下创建一个xxx_split文件夹,存放配置文件以及拆分文件'],
            },
          },
        ],
      },
      success: function (el) {
        //打开弹窗后执行的事件
        el.find('.pd20').prepend(
          '<div class="sn-home--open-condition"><span><i class="sn-home--important-note">!</i>注意：</span>\
					<span style="margin-left:20px;">1.被拆分成多个文件后，需要将它们合并才能使用</span>\
					<span style="margin-left:20px;">2.拆分后如果其中一个文件被损坏或丢失，可能会影响整个文件的完整性</span></div>'
        );
        $('input[name="path"]').attr('title', $('input[name="path"]').val());
      },
      yes: function (formD, indexs) {
        //formD会获取配置中name的集合数据
        //indexs可用于完成操作后关闭弹窗layer.close(indexs)
        var params = {
          file_path: data.path,
          save_path: formD.path,
        };
        if (formD.typeS) {
          if (formD.num * 1024 * 1024 < data.size / 2) {
            params.split_size = formD.num;
          } else {
            return bt_tools.msg('拆分大小不能大于文件大小一半', { icon: 2 });
          }
        } else {
          if (formD.num >= 2) {
            params.split_num = formD.num;
          } else {
            return bt_tools.msg('拆分数量不能小于2个', { icon: 1 });
          }
        }
        bt_tools.send(
          'files/SplitFile',
          params,
          function (res) {
            if (res.status) {
              layer.close(indexs);
              that.reader_file_list({ path: data.file_path }, function () {
                bt_tools.msg('拆分成功');
              });
            } else {
              bt_tools.msg(res.data.msg, { icon: 2 });
            }
          },
          '拆分文件'
        );
      },
    });
  },
  /**
   * @description 合并文件
   * @param {Object} 文件目录参数
   * @param {Function} callback 回调函数
   * @return void
   */
  join_file: function (data, callback) {
    var that = this;
    bt_tools.send('/files?action=JoinConfigFile', { file_path: data.path }, function (res) {
      bt_tools.open({
        title: '合并【' + data.filename + '】文件',
        area: ['550px', '300px'],
        skin: 'splitOpen',
        btn: ['确定', '取消'],
        content: {
          //配置请查看表单form方法中的类型
          class: 'pd20',
          form: [
            {
              label: '文件名称',
              group: [
                {
                  name: 'other-name',
                  type: 'other',
                  boxcontent: '<div style="color:#777;height:32px;line-height:32px;margin-right:80px;">' + res.data.name + '</div>',
                },
              ],
            },
            {
              label: '文件大小',
              group: [
                {
                  name: 'other-size',
                  type: 'other',
                  boxcontent: '<div style="color:#777;height:32px;line-height:32px;">' + bt.format_size(res.data.size, true) + '</div>',
                },
              ],
            },
            {
              label: '存放目录',
              group: {
                type: 'text',
                width: '200px',
                name: 'path',
                style: 'overflow: hidden;white-space: nowrap;text-overflow: ellipsis;',
                icon: {
                  type: 'glyphicon-folder-open',
                  event: function (formData, element, that) {
                    $('#bt_select').one('click', function () {
                      $('input[name="path"]').attr('title', $('input[name="path"]').val());
                    });
                  },
                },
                value: bt_file.file_path,
                placeholder: '请选择文件目录',
              },
            },
          ],
        },
        success: function (el) {
          //打开弹窗后执行的事件
          $('input[name="path"]').attr('title', $('input[name="path"]').val());
        },
        yes: function (formD, indexs) {
          //formD会获取配置中name的集合数据
          //indexs可用于完成操作后关闭弹窗layer.close(indexs)
          var params = {
            file_path: data.path,
            save_path: formD.path,
          };
          if (formD.path == '') {
            return bt_tools.msg('请选择合并后文件的存放路径', { icon: 2 });
          }
          bt_tools.send(
            'files/JoinFile',
            params,
            function (res) {
              if (res.status) {
                layer.close(indexs);
                that.reader_file_list({ path: data.file_path }, function () {
                  bt_tools.msg('合并成功');
                });
              } else {
                bt_tools.msg(res.data.msg, { icon: 2 });
              }
            },
            '合并文件'
          );
        },
      });
    });
  },
  /**
   * @description 获取文件大小（文件夹）
   * @param {*} data  文件目录参数
   * @param {Function} callback 回调函数
   * @return void
   */
  get_file_size: function (data, callback) {
    bt_tools.send('files/get_path_size', { path: data.path }, callback, '获取文件目录大小');
  },
  /**
   * @description 获取目录大小
   * @param {*} data  文件目录地址
   * @return void
   */
  get_dir_size: function (data, callback) {
    bt_tools.send(
      'files/GetDirSize',
      { path: data.path },
      function (rdata) {
        $('#file_all_size').text(rdata);
        if (callback) callback(rdata);
      },
      { tips: '获取目录大小', verify: false }
    );
  },
  /**
   * @description 获取文件目录
   * @param {*} data  文件目录参数
   * @param {Function} callback 回调函数
   */
  get_dir_list: function (data, callback) {
    var that = this,
      f_sort = bt.get_cookie('files_sort');
    if (f_sort) {
      data['sort'] = f_sort;
      data['reverse'] = bt.get_cookie('name_reverse');
    }
    bt_tools.send(
      'files/GetDir',
      $.extend(
        {
          p: 1,
          showRow: bt.get_storage('local', 'showRow') || that.file_page_num,
          path: bt.get_cookie('Path') || data.path,
        },
        data
      ),
      callback,
      { tips: false }
    );
    // (data.showRow ||  bt.get_storage('local','showRow') || that.file_page_num)
  },
  /**
   * @description 获取可操作的转化列表
   * @param {*} data
   * @param {*} callback
   */
  get_format_suffix: function (callback) {
    bt_tools.send({url:'/files/conversion/get_convert_liet'},function(ress){
      //请求回调
      if(callback) callback(ress)
    },'获取转化列表')
  },
  /**
   * @description 获取可操作的转化列表
   * @param {*} data
   * @param {*} callback
   */
  set_format_suffix: function (data,callback) {
    bt_tools.send({url:'/files/conversion/run',data:data},function(ress){
      //请求回调
      if(callback) callback(ress)
    },'格式转化')
  },
  /**
   * @description 获取日志文件
   * @param {*} data  文件目录参数
   * @param {Function} callback 回调函数
   * @return void
   */
  get_logs_info: function (data, callback) {
    var logV = $('[name=log_search_select]').val();
    bt_tools.send(
      'files/logs/get_logs_info',
      {
        data: JSON.stringify({
          file: data.path,
          limit: data.limit,
          search: logV !== '' ? logV : '',
        }),
      },
      callback
    );
  },
  /**
   * @description 文件、文件夹压缩
   * @param {Object} data  文件目录参数
   * @param {Boolean} isbatch  是否批量操作
   */
  compress_file_or_dir: function (data, isbatch) {
    var that = this;
    $('.selection_right_menu').removeAttr('style');
    bt_tools.open({
      title: '压缩' + data.type_tips + '[ ' + data.filename + ' ]',
      area: '480px',
      skin: 'compress_file_view',
      btn: ['压缩', '关闭'],
      content: {
        class: 'pd20',
        form: [
          {
            label: '压缩类型',
            group: [
              {
                type: 'select',
                name: 'z_type',
                value: data.open,
                width: '260px',
                list: [
                  {title: 'tar.gz (推荐)',value: 'tar.gz'},
                  {title: 'zip (通用格式)',value: 'zip'},
                  {title: 'rar (WinRAR对中文兼容较好)',value: 'rar'},
                  {title: '7z (压缩率极高的压缩格式)',value: '7z'},
                ],
                change: function (formData, element, that) {
                  var _type = formData.z_type,
                    _inputVel = formData.dfile,
                    path_list = [];
                  _inputVel = _inputVel.substring(0, _inputVel.lastIndexOf('/'));
                  path_list = _inputVel.split('/');
                  that.config.form[1].group[0].value = _inputVel + '/' + (isbatch ? path_list[path_list.length - 1] : data.filename) + '_' + bt.get_random(6) + '.' + _type
                  that.$replace_render_content(1);
                  // 处理复选框重新渲染第一次点击无效
                  // $('.isDownload').find('.form-checkbox-label').click()
                }
              },
            ]
          },
          {
            label: '压缩路径',
            group: [
              {
                name: 'dfile',
                type: 'text',
                width: '260px',
                placeholder: '请选择压缩路径',
                icon: {
                  type: 'glyphicon-folder-open',
                  select: 'dir',
                  event: function (ev) {},
                  callback: function (path,list,type) {
                    $('[name=dfile]').val(path)
                  }
                },
                value: data.path + '_' + bt.get_random(6) + '.' + (data.open == 'tar_gz' ? 'tar.gz' : data.open),
              }
            ]
          },
          {
            label: '',
            display: false,
            group: [
              {
                type: 'checkbox',
                title: '压缩并下载',
                class: 'isDownload',
                name: 'isDownload',
                event: function (formData,element) {
                  if(formData.isDownload) {
                    $('.compress_file_view .layui-layer-btn0').text('压缩并下载')
                  }else{
                    $('.compress_file_view .layui-layer-btn0').text('压缩')
                  }
                }
              }
            ]
          }
        ]
      },
      success: function(layers) {
        $(layers).find('.layui-layer-content').css('overflow','inherit')
        // 处理复选框第一次点击无效
        // $('.isDownload').find('.form-checkbox-label').click()
        $('[name=dfile]').on('input',function () {
          var val = $(this).val()
          layer.closeAll('tips')
          if(val === '') layer.tips('压缩路径不能为空',$(this), { tips: [1, 'red'], time: 2000 })
        })
      },
      yes: function (formData,indexs) {
        if(formData.dfile === '') return layer.msg('压缩路径不能为空',{icon: 2})
        var ind = data.path.lastIndexOf('/'),
          _url = data.path.substring(0, ind + 1); // 过滤路径文件名
        var param = {
          sfile: data.filename,
          dfile: formData.dfile,
          z_type: formData.z_type,
          path: _url
        },url = formData.isDownload ? 'files?action=ZipAndDownload' : '/files?action=Zip'
        bt_tools.send({url: url,data: param},function (res) {
          setTimeout(function () {
            that.reader_file_list({ path: _url });
          }, 1000);
          if (res == null || res == undefined) {
            layer.msg(lan.files.zip_ok, { icon: 1 });
          }
          if (res.status) {
            that.render_present_task_list();
          }
          if(formData.isDownload) that.down_file_req({path: formData.dfile})
          bt_tools.msg(res);
          layer.close(indexs);
        },'创建压缩文件')
      }
    })
  },
  /**
   * @description 文件、文件夹解压
   * @param {*} data  文件目录参数
   */
  unpack_file_to_path: function (data) {
    var that = this,
      _type = 'zip',
      spath = '';
    spath = data.path.substring(0, data.path.lastIndexOf('/'));
    this.reader_form_line(
      {
        url: 'UnZip',
        overall: { width: '310px' },
        data: [
          { label: '文件名', name: 'z_name', placeholder: '压缩文件名', value: data.path },
          { label: '解压到', name: 'z_path', placeholder: '解压路径', value: spath },
          {
            label: '编码',
            name: 'z_code',
            type: 'select',
            value: 'UTF-8',
            list: [
              ['UTF-8', 'UTF-8'],
              ['gb18030', 'GBK'],
            ],
          },
        ],
        beforeSend: function (updata) {
          return { sfile: updata.z_name, dfile: updata.z_path, type: _type, coding: updata.z_code, password: updata.z_password };
        },
      },
      function (form, html) {
        var loadT = layer.open({
          type: 1,
          title: '解压文件 [ ' + data.filename + ' ]',
          area: '480px',
          shadeClose: false,
          closeBtn: 2,
          skin: 'unpack_file_view',
          btn: ['解压', '关闭'],
          content: html[0].outerHTML,
          success: function () {
            if (data.ext == 'gz') _type = 'tar'; //解压格式
            if (_type == 'zip') {
              // 判断是否插入解压密码
              $('.unpack_file_view .line:nth-child(2)').append(
                '<div class="line"><span class="tname">解压密码</span><div class="info-r"><input type="text" name="z_password" class="bt-input-text " placeholder="无密码则留空" style="width:310px" value=""></div></div>'
              );
            }
          },
          yes: function () {
            var ress = form.getVal();
            if (ress.z_name == '') return layer.msg('请输入文件名路径', { icon: 2 });
            if (ress.z_path == '') return layer.msg('请输入解压地址', { icon: 2 });
            form.submitForm(function (res, datas) {
              if(that.duplicateFile(res,'','','','unZip',ress,_type)){
                layer.close(loadT);
                setTimeout(function () {
                  that.reader_file_list({ path: datas.path });
                }, 1000);
                if (res.status) {
                  that.render_present_task_list();
                }
                layer.msg(res.msg, { icon: res.status ? 1 : 2 });
              }
            }, '正在解压文件，请稍候...');
          },
        });
      }
    );
  },

  /**
   * @description 获取替换内容
   * @param {Object} data 请求传入参数
   * @param {Function} callback 回调参数
   * @returns void
   */
  get_replace_log: function () {
    bt_tools.send(
      'files/GetDir',
      $.extend(
        {
          p: 1,
          showRow: bt.get_storage('local', 'showRow') || that.file_page_num,
          path: bt.get_cookie('Path') || data.path,
        },
        data
      ),
      { tips: false }
    );
  },
  /**
   * @description 匹配非法字符
   * @param {Array} item 配置对象
   * @return 返回匹配结果
   */
  match_unqualified_string: function (item) {
    var containSpecial = RegExp(/[(\*)(\|)(\\)(\:)(\")(\/)(\<)(\>)(\?)(\)]+/);
    return containSpecial.test(item);
  },
  /**
   * @description 渲染表单
   * @param {Array} config 配置对象
   * @param {Function} callback 回调函数
   * @return void
   */
  reader_form_line: function (config, callback) {
    var that = this,
      random = bt.get_random(10),
      html = $('<form id="' + random + '" class="bt-form pd20"></form>'),
      data = config,
      eventList = [],
      that = this;
    if (!Array.isArray(config)) data = config.data;
    $.each(data, function (index, item) {
      var labelWidth = item.labelWidth || config.overall.labelWidth || null,
        event_random = bt.get_random(10),
        width = item.labelWidth || config.overall.width || null,
        form_line = $('<div class="line"><span class="tname" ' + (labelWidth ? 'width:' + labelWidth : '') + '>' + (item.label || '') + '</span><div class="info-r"></div></div>'),
        form_el = $(
          (function () {
            switch (item.type) {
              case 'select':
                return (
                  '<select ' +
                  (item.disabled ? 'disabled' : '') +
                  ' ' +
                  (item.readonly ? 'readonly' : '') +
                  ' class="bt-input-text mr5 ' +
                  (item.readonly ? 'readonly-form-input' : '') +
                  '" name="' +
                  item.name +
                  '" ' +
                  (item.eventType ? 'data-event="' + event_random + '"' : '') +
                  ' style="' +
                  (width ? 'width:' + width : '') +
                  '">' +
                  (function (item) {
                    var options_list = '';
                    $.each(item.list, function (key, items) {
                      if (!Array.isArray(items)) {
                        //判断是否为二维数组
                        options_list += '<option value="' + items + '" ' + (item.value === key ? 'selected' : '') + '>' + items + '</option>';
                      } else {
                        options_list += '<option value="' + items[0] + '" ' + (item.value === items[0] ? 'selected' : '') + '>' + items[1] + '</option>';
                      }
                    });
                    return options_list;
                  })(item) +
                  '</select>'
                );
                break;
              case 'text':
              default:
                return (
                  '<input ' +
                  (item.disabled ? 'disabled' : '') +
                  ' ' +
                  (item.readonly ? 'readonly' : '') +
                  ' ' +
                  (item.eventType ? 'data-event="' + event_random + '"' : '') +
                  ' type="text" name="' +
                  item.name +
                  '" ' +
                  (item.id ? 'id="' + item.id + '"' : '') +
                  ' class="bt-input-text ' +
                  (item.readonly ? 'readonly-form-input' : '') +
                  '" placeholder="' +
                  (item.placeholder || '') +
                  '" style="' +
                  (width ? 'width:' + width : '') +
                  '" value="' +
                  (item.value || '') +
                  '"/>'
                );
                break;
            }
          })(item)
        );
      if (item.eventType || item.event) {
        if (!Array.isArray(item.eventType)) item.eventType = [item.eventType];
        $.each(item.eventType, function (index, items) {
          eventList.push({ el: event_random, type: items || 'click', event: item[items] || null });
          if (config.el) {
            var els = $('[data-event="' + item.el + '"]');
            if (item[items]) {
              if (items == 'enter') {
                els.on('keyup', function (e) {
                  if (e.keyCode == 13) item.event(e);
                });
              } else {
                els.on(item || 'click', item.event);
              }
            } else {
              if (items == 'focus') {
                var vals = els.val();
                if (vals != '') {
                  els.val('').focus().val(vals);
                }
              } else {
                els[items]();
              }
            }
          }
        });
      }
      form_line.find('.info-r').append(form_el);
      html.append(form_line);
    });
    if (config.el) $(config.el).empty().append(html);
    if (callback)
      callback(
        {
          // 获取内容
          getVal: function () {
            return $('#' + random).serializeObject();
          },
          // 设置事件，没有设置el参数，需要
          setEvent: function () {
            $.each(eventList, function (index, item) {
              var els = $('[data-event="' + item.el + '"]');
              if (item.event === null) {
                if (item.type == 'focus') {
                  var vals = els.val();
                  if (vals != '') {
                    els.val('').focus().val(vals);
                  }
                } else {
                  els[item.type]();
                }
              } else {
                if (item.type == 'enter') {
                  els.on('keyup', function (e) {
                    if (e.keyCode == 13) item.event(e);
                  });
                } else {
                  els.on(item.type, item.event);
                }
              }
            });
          },
          // 提交表单
          submitForm: function (callback, load) {
            var data = this.getVal();
            if (config.beforeSend) data = config.beforeSend(data);
            that.loadT = bt.load(load || '提交表单内容');
            bt.send(config.url, 'files/' + config.url, data, function (rdata) {
              that.loadT.close();
              if (callback) callback(rdata, data);
            });
            // bt.http({tips:config.loading || '正在提交表单内容，请稍候...',url:config.url,data:data,success:function(rdata){if(callback) callback(rdata,data)}});
          },
        },
        html
      );
  },
  /**
   * @description: 邓 文件夹大小的统一发送数据处理
   * @return {*}
   */
  dataProcessingSplicing: function (data) {
    var _that = this;
    var _array = [];
    $.each(data, function (index, item) {
      var _itemD = item.split(';');
      _array.push(_that.file_path + '/' + _itemD[0]);
    });
    return _array;
  },
  /**
   * @description 文件管理请求方法
   * @param {*} data
   * @param {*} parem
   * @param {*} callback
   */
  $http: function (data, parem, callback) {
    var that = this,
      loadT = '';
    if (typeof data == 'string') {
      if (typeof parem != 'object') (callback = parem), (parem = {});
      if (!Array.isArray(that.method_list[data])) that.method_list[data] = ['files', that.method_list[data]];
      that.$http({ method: data, tips: that.method_list[data][1] ? '正在' + that.method_list[data][1] + '，请稍候...' : false, module: that.method_list[data][0], data: parem, msg: true }, callback);
    } else {
      if (typeof data.tips != 'undefined' && data.tips) loadT = bt.load(data.tips);
      bt.send(data.method, (data.module || 'files') + '/' + data.method, data.data || {}, function (res) {
        if (loadT != '') loadT.close();
        if (typeof res == 'string') res = JSON.parse(res);
        if (res.status === false && res.msg) {
          bt.msg(res);
          return false;
        }
        if (parem) parem(res);
      });
    }
  },
};
bt_file.init();
if(localStorage.getItem("MYSQL-RECYCLE")=="true"){
  setTimeout(() => {
    $('#container > div.main-content > div > div.file_nav_view > div.float_r.menu-header-foot > div.nav_group.recycle_bin').click()
		$('.recycle_view').find('.tab-nav').children().eq(1).click()
    localStorage.removeItem('MYSQL-RECYCLE')
  }, 1000)

}
Function.prototype.delay = function (that, arry, time) {
  if (!Array.isArray(arry)) (time = arry), (arry = []);
  if (typeof time == 'undefined') time = 0;
  setTimeout(this.apply(that, arry), time);
  return this;
};

jQuery.prototype.serializeObject = function () {
  var a, o, h, i, e;
  a = this.serializeArray();
  o = {};
  h = o.hasOwnProperty;
  for (i = 0; i < a.length; i++) {
    e = a[i];
    if (!h.call(o, e.name)) {
      o[e.name] = e.value;
    }
  }
  return o;
};
