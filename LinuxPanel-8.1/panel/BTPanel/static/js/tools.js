var bt_tools = {
  commandConnectionPool: {}, //ws连接池
  /**
   * @description 表格渲染
   * @param {object} config  配置对象 参考说明
   * @return {object} table 表格对象
   */
  table: function (config) {
    var that = this,
      table = $(config.el),
      tableData = table.data('table');
    if (tableData && table.find('table').length > 0) {
      if (config.url !== undefined) {
        tableData.$refresh_table_list(true);
      } else if (config.data !== undefined) {
        tableData.$reader_content(config.data);
      }
      return tableData;
    }

    function ReaderTable(config) {
      this.config = config;
      this.$load();
    }

    ReaderTable.prototype = {
      style_list: [], // 样式列表
      event_list: {}, // 事件列表,已绑定事件
      checkbox_list: [], // 元素选中列表
      batch_active: {},
      event_rows_model: {}, // 事件行内元素模型，行内元素点击都会将数据临时存放
      data: [],
      cache_set_column: [],//缓存设置显示隐藏的列数据
      cache_set_all: {},//所有缓存设置显示隐藏的列数据
      page: '',
      column: [],
      batch_thread: [],
      random: bt.get_random(5),
      init: false, // 是否初始化渲染
      checked: false, // 是否激活，用来判断是否失去焦点
      /**
       * @description 加载数据
       * @return void
       */
      $load: function () {
        var _that = this;
        if (this.config.init) this.config.init(this);
        $(this.config.el).addClass('bt_table');
        if (this.config.minWidth)
          this.style_list.push({
            className: this.config.el + ' table',
            css: 'min-width:' + this.config.minWidth,
          });
        if (this.config.tootls) {
          this.$reader_tootls(this.config.tootls);
        } else {
          if ($(_that.config.el + '.divtable').length === 0) $(_that.config.el).append('<div class="divtable mtb10" style="max-height:' + (this.config.height || 'auto') + '"></div>');
        }
        this.$reader_content();
        if (_that.config.url !== undefined) {
          this.$refresh_table_list(_that.config.load || false);
        } else if (this.config.data !== undefined) {
          this.$reader_content(this.config.data);
        } else {
          alert('缺少data或url参数');
        }
        if (this.config.methods) {
          //挂载实例方法
          $.extend(this, this.config.methods);
        }
        if (this.config.height) bt_tools.$fixed_table_thead(this.config.el + ' .divtable');
      },

      /**
       * @description 刷新表格数据
       * @param {boolean} load
       * @param {function} callback 回调函数
       * @return void
       */
      $refresh_table_list: function (load, callback) {
        var _that = this;
        this.$http(load, function (data) {
          if (callback) callback(data);
          _that.$reader_content(data.data, typeof data.total != 'undefined' ? parseInt(data.total) : data.page);
        });
      },

      /**
       * @description 渲染内容
       * @param {object} data 渲染的数据
       * @param {number} page 数据分页/总数
       * @return void
       */
      $reader_content: function (data, page) {
        var _that = this,d
        var thead = '',
          tbody = '',
          i = 0,
          column = this.config.column,
          event_list = {},
          checkbox = $(_that.config.el + ' .checkbox_' + _that.random);
        data = data || [];
        this.data = data;
        if(_that.config.setting_btn){
          var time = setInterval(function(){
              if(bt.config!=undefined) {
                pub_content(bt.config)
                clearInterval(time)
              }
            },1)
        }else {
          old_pub_content()
        }
        function old_pub_content() {
          if (checkbox.length) {
            checkbox.removeClass('active selected');
            _that.checkbox_list = [];
            _that.$set_batch_view();
          }
          do {
            var rows = _that.data[i],
              completion = 0;
            if (_that.data.length > 0) tbody += '<tr>';
            for (var j = 0; j < column.length; j++) {
              var item = column[j];
              if ($.isEmptyObject(item)) {
                completion++;
                continue;
              }
              if (i === 0 && !_that.init) {
                if (!_that.init) _that.style_list.push(_that.$dynamic_merge_style(item, j - completion));
                var sortName = 'sort_' + _that.random + '',
                  checkboxName = 'checkbox_' + _that.random,
                  sortValue = item.sortValue || 'desc';
                thead += '<th><span ' + (item.sort ? 'class="not-select ' + sortName + (item.sortValue ? ' sort-active' : '') + ' cursor-pointer"' : '') + ' data-index="' + j + '" ' + (item.sort ? 'data-sort="' + sortValue + '"' : '') + '>' + (item.type == "checkbox" ? '<label><i class="cust—checkbox cursor-pointer ' + checkboxName + '" data-checkbox="all"></i><input type="checkbox" class="cust—checkbox-input"></label>' : '<span>' + item.title + '</span>') + (item.sort ? '<span class="glyphicon glyphicon-triangle-' + (sortValue == 'desc' ? 'bottom' : 'top') + ' ml5"></span>' : '') + '</span></th>';
                if (i === 0) {
                  if (!event_list[sortName] && item.sort)
                    event_list[sortName] = {
                      event: _that.config.sortEvent,
                      eventType: 'click',
                      type: 'sort'
                    };
                  if (!event_list[checkboxName])
                    event_list[checkboxName] = {
                      event: item.checked,
                      eventType: 'click',
                      type: 'checkbox'
                    };
                }
              }
              if (rows !== undefined) {
                var template = '', className = 'event_' + item.fid + '_' + _that.random;
                if (item.template) {
                  template = _that.$custom_template_render(item, rows, j);
                }
                if (typeof template === "undefined" || typeof item.template === "undefined") {
                  template = _that.$reader_column_type(item, rows);
                  event_list = $.extend(event_list, template[1]);
                  template = template[0];
                }
                var fixed = false;
                if (typeof item.fixed != "undefined" && item.fixed) {
                  if (typeof item.class != "undefined") {
                    if (item.class.indexOf('fixed') === -1) item.class += ' fixed';
                  } else {
                    item.class = 'fixed';
                  }
                  fixed = true;
                }
                tbody +=
                  '<td><span ' +
                  (fixed ? 'style="width:' + (item.width - 16) + 'px" title="' + template + '"' : ' ') +
                  (item['class'] ? 'class="' + item['class'] + '"' : '') +
                  ' ' +
                  (item.tips ? 'title="' + item.tips + '"' : '') +
                  '>' +
                  template +
                  '</span></td>';
                if (i === 0) {
                  if (!event_list[className] && item.event)
                    event_list[className] = {
                      event: item.event,
                      eventType: 'click',
                      type: 'rows'
                    };
                }
              }
            }
            if (_that.data.length > 0) tbody += '</tr>'
            if (_that.data.length == 0) tbody += '<tr class="no-tr"><td colspan="' + column.length + '" style="text-align:center;">' + (_that.config['default'] || '数据为空') + '</td></tr>';
            i++;
          } while (i < _that.data.length);
          if (!_that.init) _that.$style_bind(_that.style_list);
          _that.$event_bind(event_list);
          if (!_that.init) {
            $(_that.config.el + ' .divtable').append(
              '<table class="table table-hover"><thead style="position: relative;z-index: 1;">' + thead + '</thead><tbody>' + tbody + '</tbody></table></div></div>'
            );
          } else {
            $(_that.config.el + ' .divtable tbody').html(tbody);
            if (_that.config.page) {
              $(_that.config.el + ' .page').replaceWith(_that.$reader_page(_that.config.page, page));
            }
          }

          _that.init = true;
          if (_that.config.success) _that.config.success(this);
        }
        function pub_content(rdata_header) {
          /*** 渲染设置显示隐藏列按钮 ***/
          var setting_btn = _that.config.setting_btn
          if (setting_btn) {
            var cache_name = _that.config.el + '_' + _that.random,setting_ul_html = ''
            _that.cache_set_column = []
            var flag = false,flag_num = 0
            for (var j = 0; j < column.length; j++) {
              if(column[j]['type'] == 'checkbox') continue;
              if(!column[j]['width']) flag = true
              _that.cache_set_column.push({
                title: column[j]['real_title'] ? column[j]['real_title'] : column[j]['title'],
                value: column[j].hasOwnProperty('display') ? column[j]['display'] : true ,
                idx: j ,
                disabled: column[j].hasOwnProperty('isDisabled') ? column[j]['isDisabled'] : false,
                pay: column[j].hasOwnProperty('pay') ? column[j]['pay'] : false,
              })
            }
            // if(!flag) {
            //     column[1]['width'] = 'auto'
            // }
            if(_that.config.hasOwnProperty('setting_list')) {
              for (var j = 0; j < _that.config.setting_list.length; j++) {
                _that.cache_set_column.unshift(_that.config.setting_list[j])
              }
            }
              _that.cache_set_all = !$.isEmptyObject(rdata_header.table_header) ? rdata_header.table_header : _that.cache_set_all;// 获取所有缓存数据
              var cache_data = $.isEmptyObject(rdata_header.table_header) ? [] : JSON.parse(_that.cache_set_all[_that.config.headerId] || '[]')
							try{
              var _flag = _that.cache_set_all[_that.config.headerId] && cache_data.filter(function (item,index) {
								if(!_that.cache_set_column[index]) return false
                return item.title === _that.cache_set_column[index].title
              }).length === _that.cache_set_column.length
              _that.cache_set_column = _flag ? JSON.parse(_that.cache_set_all[_that.config.headerId]) : _that.cache_set_column;  // 有缓存时用缓存数据
							}catch(error){
								console.log(error)
							}

            // 渲染显示隐藏列按钮下拉列表
              for (var j = 0; j < _that.cache_set_column.length; j++) {
                var obj = _that.cache_set_column[j],title = $(obj.title).text().replace(/\?/g,"");
                if(obj.value) flag_num++
                var text =''
                if(title == '流量' || obj.title == '流量' && obj.disabled) text = '不支持openlitespeed';
                setting_ul_html += '<li title="'+text+'" class="setting_ul_li' + (obj.value ? ' active' : '') + (obj.disabled ? ' disabled' : '') + '">\
              <i></i>\
                <span class="ml10">'+ (title ? title : obj.title) +'</span>'+
                (title || obj.pay ? '<span class="glyphicon icon-vipLtd" style="margin-left: 6px;position: relative;top: -2px;"></span>' : '') +
              '</li>'
              if(obj.idx) column[obj.idx]['display'] = obj.value // 重置显示状态
            }

						// var allColumns = column.length;
            // var displayedColumns = _that.cache_set_column.filter(function(col) {
            // 	return col.value;
            // }).length;

            // if (displayedColumns === allColumns) { // 当界面显示列与表格的所有列长度相等时(都显示)
            // 	var allColumnsHaveWidth = column.every(function(col) {
            // 		return col.width && col.width != 'auto';
            // 	});
            //
            // 	if (allColumnsHaveWidth) {
            // 	    // 所有列都有宽度时，不进行操作
            // 	} else {
            // 		var secondColumn = column[1];
            // 			var columnWithoutWidth = column.find(function(col, index) {
            // 				return index > 1 && !col.width;
            // 			});
            //
            // 			if (columnWithoutWidth) { // 首列为复选框列，且含有除第二列的某一列无宽度或auto时，则设定第二列宽度为auto
            // 				secondColumn.width = 'auto';
            // 			} else {
            // 				var websiteNameColumn = column.find(function(col) {
            // 					return col.title === '网站名';
            // 				});
            //
            // 				if (websiteNameColumn) { // 首列为复选框列，只有第二列无宽度或auto时，设定第二列宽度为100px，若该列为网站名，则设定为210px
            // 					websiteNameColumn.width = 200;
            // 				} else {
            // 					secondColumn.width = 100;
            // 				}
            // 			}
            // 	}
            // } else { // 当界面显示列与表格所有列长度不等时(未全部展示)
            // 	var displayedColumnsHaveWidth = column.every(function(col) {
            // 		return col.display && col.width && col.width != 'auto';
            // 	});
            // 	if (displayedColumnsHaveWidth) { // 显示的所有列都有宽度时，若首列为复选框，则设定第二列的列宽度为auto
            // 		var firstColumn = column[0];
            // 		if (firstColumn.type === 'checkbox') {
            // 			var secondColumn = column[1];
            // 			secondColumn.width = 'auto';
						// 			var websiteNameColumn = column.find(function(col) {
						// 				return col.title === '网站名';
						// 			});
						// 			if (websiteNameColumn) {
						// 				var otherColumnsWidth = column.reduce(function(acc, col) {
						// 					if (col.title !== '网站名' && col.display) {
						// 						return acc + parseInt(col.width) || 0;
						// 					}
						// 					return acc;
						// 				}, 0);
            //
						// 				var tableWidth = $(_that.config.el).width();
						// 				if (tableWidth - otherColumnsWidth > 200 ) {
						// 					websiteNameColumn.width = 'auto';
						// 				}else{
						// 				    websiteNameColumn.width = 200;
						// 				}
						// 			}
            // 		}
            // 	}else{
            // 	    // 固定网站名宽度
            // 	    var websiteNameColumn = column.find(function(col) {
						// 				return col.title === '网站名';
						// 			});
						// 			if (websiteNameColumn) {
						// 				var otherColumnsWidth = column.reduce(function(acc, col) {
						// 					if (col.title !== '网站名' && col.display) {
						// 						return acc + parseInt(col.width) || 0;
						// 					}
						// 					return acc;
						// 				}, 0);
            //
						// 				var tableWidth = $(_that.config.el).width();
						// 				if (tableWidth - otherColumnsWidth > 200 ) {
						// 					websiteNameColumn.width = 'auto';
						// 				}else{
						// 				    websiteNameColumn.width = 200;
						// 				}
						// 			}
            // 	}
            // }

            //渲染显示隐藏列按钮
              if(!$(_that.config.el + ' .set_list_fid_dropdown').length) {
                $(_that.config.el + ' .tootls_top .pull-right').append('<div class="set_list_fid_dropdown"><div class="setting_btn"><i class="glyphicon glyphicon-cog icon-setting"></i></div>\
                <ul class="setting_ul">'+setting_ul_html+'</ul></div>')
            }
            //显示隐藏列鼠标移入事件
            var set_interval = null
              $(_that.config.el + ' .setting_btn').hover(function(){
              $(this).next().show()
            },function(e){
              var _this = $(this), mouseY = 0,mouseX = 0;
              //获取鼠标位置
              $(document).mousemove(function (e) {
                mouseY = e.pageY;
                mouseX = e.pageX;
              });
              set_interval = setInterval(function () {
                if(_this.next().css('display') == 'block') {
                  var bW = _this.width(),bH = _this.height(),bT = _this.offset().top,bL = _this.offset().left,
                      uW = _this.next().width(),uH = _this.next().height(),uT = _this.next().offset().top,uL = _this.next().offset().left;
                  var is_b = mouseX > bL && mouseX < bL + bW && mouseY > bT && mouseY < bT + bH,
                      is_u = mouseX > uL && mouseX < uL + uW && mouseY > uT && mouseY < uT + uH;
                  //判断是否还在区域内
                  if(!is_b && !is_u) _this.next().hide()
                }else{
                  clearInterval(set_interval)
                }
              },200)
            })

            //显示隐藏列点击事件
            $(_that.config.el + ' .setting_ul .setting_ul_li').unbind('click').click(function(e){
            if($(this).hasClass('disabled')) return false;
            if($(this).hasClass('active')) $(this).removeClass('active')
            else $(this).addClass('active')
            var index = $(this).index();
            _that.cache_set_column[index].value = !_that.cache_set_column[index].value; //重置显示状态
            _that.cache_set_all[_that.config.headerId] = _that.cache_set_column;
            bt.send('set_table_header', 'config/set_table_header', {table_name: _that.config.headerId,table_data: JSON.stringify(_that.cache_set_column)}, function (res) {
              bt.send('get_table_header', 'config/get_table_header', {}, function (rdata_header) {// 获取所有表自定义列数据
                bt.config['table_header'] = rdata_header;
                _that.init = false; //重置表头和数据
                _that.style_list = [_that.style_list[0]]; //重置样式
                $('#bt_table_' + _that.random).remove();  //重置表样式
                _that.$reader_content(_that.data, page); //刷新数据
              })
            })
          })
        }
        /*** -------end-------- ***/

        if (checkbox.length) {
          checkbox.removeClass('active selected');
          _that.checkbox_list = [];
          _that.$set_batch_view();
        }
        do {
          var rows = _that.data[i],
              completion = 0;
          if (_that.data.length > 0) tbody += '<tr>';
          for (var j = 0; j < column.length; j++) {
            /*** 设置列显示隐藏存在 并且 不显示 则跳过 ***/
            if (setting_btn && column[j]['display'] === false) {
              if(!column[j].hasOwnProperty('class')) completion++;
              continue;
            }
            /*** -------end-------- ***/
            var item = column[j];
            if ($.isEmptyObject(item)) {
              completion++;
              continue;
            }
              if (i === 0 && !_that.init) {
                if (!_that.init) _that.style_list.push(_that.$dynamic_merge_style(item, j - completion));
                var sortName = 'sort_' + _that.random + '',
                    checkboxName = 'checkbox_' + _that.random,
                  sortValue = item.sortValue || 'desc';
									thead += '<th class="'+item.fid+'"><span ' + (item.sort ? 'class="not-select ' + sortName + (item.sortValue ? ' sort-active' : '') + ' cursor-pointer"' : '') + ' data-index="' + j + '" ' + (item.sort ? 'data-sort="' + sortValue + '"' : '') + '>' + (item.type == "checkbox" ? '<label><i class="cust—checkbox cursor-pointer ' + checkboxName + '" data-checkbox="all"></i><input type="checkbox" class="cust—checkbox-input"></label>' : '<span>' + item.title + '</span>') + (item.sort ? '<span class="glyphicon glyphicon-triangle-' + (sortValue == 'desc' ? 'bottom' : 'top') + ' ml5"></span>' : '') + '</span></th>';
              if (i === 0) {
                if (!event_list[sortName] && item.sort) event_list[sortName] = {
                    event: _that.config.sortEvent,
                  eventType: 'click',
                  type: 'sort'
                };
                if (!event_list[checkboxName]) event_list[checkboxName] = {
                  event: item.checked,
                  eventType: 'click',
                  type: 'checkbox'
                };
              }
            }
            if (rows !== undefined) {
                var template = '', className = 'event_' + item.fid + '_' + _that.random;
              if (item.template) {
                template = _that.$custom_template_render(item, rows, j);
              }
              if (typeof template === "undefined" || typeof item.template === "undefined") {
                  template = _that.$reader_column_type(item, rows);
                event_list = $.extend(event_list, template[1]);
                template = template[0];
              }
              var fixed = false;
              if (typeof item.fixed != "undefined" && item.fixed) {
                if (typeof item.class != "undefined") {
                  if (item.class.indexOf('fixed') === -1) item.class += ' fixed';
                } else {
                  item.class = 'fixed';
                }
                fixed = true;
              }
              tbody += '<td><span ' + (fixed ? 'style="width:' + (item.width - 16) + 'px" title="' + template + '"' : ' ') + (item['class'] ? 'class="' + item['class'] + '"' : '') + ' ' + (item.tips ? 'title="' + item.tips + '"' : '') + '>' + template + '</span></td>'; if (i === 0) {
                if (!event_list[className] && item.event) event_list[className] = {
                  event: item.event,
                  eventType: 'click',
                  type: 'rows'
                };
              }
            }
          }
          if (_that.data.length > 0) tbody += '</tr>'
            if (_that.data.length == 0) tbody += '<tr class="no-tr"><td colspan="' + column.length + '" style="text-align:center;">' + (_that.config['default'] || '数据为空') + '</td></tr>';
          i++;
        } while (i < _that.data.length);
        if (!_that.init) _that.$style_bind(_that.style_list);
          _that.$event_bind(event_list);
          if (!_that.init) {
            $(_that.config.el + ' .divtable .table').remove()
						_that.config.thead(thead)
            $(_that.config.el + ' .divtable').append('<table class="table table-hover"><thead style="position: relative;z-index: 1;">' + thead + '</thead><tbody>' + tbody + '</tbody></table></div></div>');
        } else {
            $(_that.config.el + ' .divtable tbody').html(tbody);
            if (_that.config.page) {
              $(_that.config.el + ' .page').replaceWith(_that.$reader_page(_that.config.page, page));
          }
        }
        /*** 设置列显示隐藏---单独某个class处理 ***/
        if(setting_btn && _that.config.hasOwnProperty('setting_list')) {
          for (var j = 0; j < _that.cache_set_column.length; j++) {
            var obj = _that.cache_set_column[j]
            if (obj.hasOwnProperty('class')) {
                if(obj.value) $(_that.config.el + ' .' + obj.class).show()
                else $(_that.config.el + ' .' + obj.class).hide()
            }
          }
        }
        /*** -------end-------- ***/
        _that.init = true;
        if (_that.config.success) _that.config.success(_that);
        }
      },

      /**
       * @description 自定模板渲染
       * @param {object} item 当前元素模型
       * @param {object} rows 当前元素数据
       * @param {number} j 当前模板index
       * @return void
       */
      $custom_template_render: function (item, rows, j) {
        var className = 'event_' + item.fid + '_' + this.random,
          _template = item.template(rows, j),
          $template = $(_template);
        if ($template.length > 0) {
          template = $template.addClass(className)[0].outerHTML;
        } else {
          if (item.type === 'text') {
            template = '<span class="' + className + ' ' + item['class'] + '">' + _template + '</span>';
          } else {
            template = '<a href="javascript:;" class="btlink ' + className + '">' + _template + '</a>';
          }
        }
        return template;
      },

      /**
       * @description 替换table数据
       * @param {string} newValue 内容数据
       * @return void
       */
      $modify_row_data: function (newValue) {
        this.event_rows_model.rows = $.extend(this.event_rows_model.rows, newValue);
        var row_model = this.event_rows_model,
          template = null;
        if (typeof row_model.model.template != 'undefined') {
          template = $(this.$custom_template_render(row_model.model, row_model.rows, row_model.index));
          if (!template.length) template = $(this.$reader_column_type(row_model.model, row_model.rows)[0]);
        } else {
          template = $(this.$reader_column_type(row_model.model, row_model.rows)[0]);
        }
        if (row_model.model.type == 'group') {
          $(row_model.el).parent().empty().append(template);
        } else {
          row_model.el.replaceWith(template);
        }
        row_model.el = template;
      },

      /**
       * @description 批量执行程序
       * @param {object} config 配置文件
       * @return void
       */
      $batch_success_table: function (config) {
        var _that = this,
          length = $(config.html).length;
        bt.open({
          type: 1,
          title: config.title,
          area: config.area || ['350px', '350px'],
          shadeClose: false,
          closeBtn: 2,
          content:
            config.content ||
            '<div class="batch_title"><span class><span class="batch_icon"></span><span class="batch_text">' +
            config.title +
            '操作完成！</span></span></div><div class="' +
            (length > 4 ? 'fiexd_thead' : '') +
            ' batch_tabel divtable" style="margin: 15px 30px 15px 30px;overflow: auto;height: 200px;"><table class="table table-hover"><thead><tr><th>' +
            config.th +
            '</th><th style="text-align:right;width:120px;">操作结果</th></tr></thead><tbody>' +
            config.html +
            '</tbody></table></div>',
          success: function () {
            if (length > 4) _that.$fixed_table_thead('.fiexd_thead');
          }
        });
      },
      /**
       * @description 固定表头
       * @param {string} el DOM选择器
       * @return void
       */
      $fixed_table_thead: function (el) {
        $(el).scroll(function () {
          var scrollTop = this.scrollTop;
          this.querySelector('thead').style.transform = 'translateY(' + (scrollTop - 1) + 'px)';
        });
      },
      /**
       * @description 删除行内数据
       */
      $delete_table_row: function (index) {
        this.data.splice(index, 1)
        this.$reader_content(this.data);
      },

      /**
       * @description 设置批量操作显示
       * @return void 无
       */
      $set_batch_view: function () {
        if (typeof this.config.batch != 'undefined') {
          //判断是否存在批量操作
          var bt_select_btn = $(this.config.el + ' .set_batch_option');
          if (typeof this.config.batch.config != 'undefined') {
            // 判断批量操作是多个还是单个
            if (this.checkbox_list.length > 0) {
              bt_select_btn
                .removeClass('bt-disabled btn-default')
                .addClass('btn-success')
                .text('批量' + this.batch_active.title + '(已选中' + this.checkbox_list.length + ')');
            } else {
              bt_select_btn
                .addClass('bt-disabled btn-default')
                .removeClass('btn-success')
                .text('批量' + this.batch_active.title);
            }
          } else {
            var bt_select_val = $(this.config.el + ' .bt_table_select_group .bt_select_value');
            if (this.checkbox_list.length > 0) {
              bt_select_btn.removeClass('bt-disabled btn-default').addClass('btn-success').prev().removeClass('bt-disabled');
              bt_select_val.find('em').html('(已选中' + this.checkbox_list.length + ')');
            } else {
              bt_select_btn.addClass('bt-disabled btn-default').removeClass('btn-success').prev().addClass('bt-disabled');
              bt_select_val.children().eq(0).html('请选择批量操作<em></em>');
              bt_select_val.next().find('li').removeClass('active');
              this.batch_active = {};
            }
          }
        }
      },

      /**
       * @description 渲染指定类型列内容
       * @param {object} data 渲染的数据
       * @param {object} rows 渲染的模板
       * @return void
       */
      $reader_column_type: function (item, rows) {
        var value = rows[item.fid],
          event_list = {},
          className = 'click_' + item.fid + '_' + this.random,
          config = [],
          _that = this;
        switch (item.type) {
          case 'text': //普通文本
            config = [value, event_list];
            break;
          case 'checkbox': //单选内容
            config = ['<label><i class="cust—checkbox cursor-pointer checkbox_' + this.random + '"></i><input type="checkbox" class="cust—checkbox-input"></label>', event_list];
            break;
          case 'password':
            var _copy = '',
              _eye_open = '',
              className = 'ico_' + _that.random + '_',
              html = '<span class="bt-table-password mr10"><i>**********</i></span>';
            if (item.eye_open) {
              html += '<span class="glyphicon cursor pw-ico glyphicon-eye-open mr10 ' + className + 'eye_open" title="显示密码"></span>';
              if (!event_list[className + 'eye_open'])
                event_list[className + 'eye_open'] = {
                  type: 'eye_open_password',
                };
            }
            if (item.copy) {
              html += '<span class="ico-copy cursor btcopy mr10 ' + className + 'copy" title="复制密码"></span>';
              if (!event_list[className + 'copy'])
                event_list[className + 'copy'] = {
                  type: 'copy_password',
                };
            }
            config = [html, event_list];
            break;
          case 'link': //超链接类型
            className += '_' + item.fid;
            if (!event_list[className] && item.event)
              event_list[className] = {
                event: item.event,
                type: 'rows',
              };
            config = [
              '<a class="btlink ' +
              className +
              '" href="' +
              (item.href ? value : 'javascript:;') +
              '" ' +
              (item.href ? 'target="' + (item.target || '_blank') + '"' : '') +
              ' title="' +
              value +
              '">' +
              value +
              '</a>',
              event_list,
            ];
            break;
          case 'input': //可编辑类型
            blurName = 'blur_' + item.fid + '_' + this.random;
            keyupName = 'keyup_' + item.fid + '_' + this.random;
            if (!event_list[blurName] && item.blur)
              event_list[blurName] = {
                event: item.blur,
                eventType: 'blur',
                type: 'rows',
              };
            if (!event_list[keyupName] && item.keyup)
              event_list[keyupName] = {
                event: item.keyup,
                eventType: 'keyup',
                type: 'rows',
              };
            config = [
              '<input type="text" title="点击编辑内容，按回车或失去焦点自动保存"  class="table-input ' + blurName + ' ' + keyupName + '" data-value="' + value + '" value="' + value + '" />',
              event_list,
            ];
            break;
          case 'status': // 状态类型
            var active = '';
            $.each(item.config.list, function (index, items) {
              if (items[0] === value) active = items;
            });
            if (!event_list[className] && item.event)
              event_list[className] = {
                event: item.event,
                type: 'rows',
              };
            config = [
              '<a class="btlink ' +
              className +
              ' ' +
              (active[2].indexOf('#') > -1 ? '' : active[2]) +
              '" style="' +
              (active[2].indexOf('#') > -1 ? 'color:' + active[2] + ';' : '') +
              '" href="javascript:;"><span>' +
              active[1] +
              '</span>' +
              (item.config.icon ? '<span class="glyphicon ' + active[3] + '"></span>' : '') +
              '</a>',
              event_list,
            ];
            break;
          case 'switch': //开关类型
            var active = '',
              _random = bt.get_random(5);
            active = new Number(value) == true ? 'checked' : '';
            if (!event_list[className] && item.event)
              event_list[className] = {
                event: item.event,
                type: 'rows',
              };
            config = [
              '<div class="bt_switch_group"><input class="btswitch btswitch-ios ' +
              className +
              '" id="' +
              _random +
              '" type="checkbox" ' +
              active +
              '><label class="btswitch-btn" for="' +
              _random +
              '" data-index="0" bt-event-click="set_site_server_status"></label></div>',
              event_list,
            ];
            break;
          case 'group':
            var _html = '';
            $.each(item.group, function (index, items) {
              className = (item.fid ? item.fid : 'group') + '_' + index + '_' + _that.random;
              var _hide = false;
              if (items.template) {
                var _template = items.template(rows, _that),
                  $template = $(_template);
                if ($template.length > 0) {
                  _html += $template.addClass(className)[0].outerHTML;
                } else {
                  _html += '<a href="javascript:;" class="btlink ' + className + '" title="' + (items.title || '') + '">' + _template + '</a>';
                }
              } else {
                if (typeof items.hide != 'undefined') {
                  _hide = typeof items.hide === 'boolean' ? items.hide : items.hide(rows);
                  if (typeof _hide != 'boolean') return false;
                }
                _html += '<a href="javascript:;" class="btlink ' + className + '" ' + (_hide ? 'style="display:none;"' : '') + ' title="' + (items.tips || items.title) + '">' + items.title + '</a>';
              }
              //当前操作按钮长度等于当前所以值时不向后添加分割
              if (!_hide) _html += item.group.length == index + 1 ? '' : '&nbsp;&nbsp;|&nbsp;&nbsp;';
              if (!event_list[className] && items.event)
                event_list[className] = {
                  event: items.event,
                  type: 'rows',
                };
            });
            config = [_html, event_list];
            break;
          default:
            config = [value, event_list];
            break;
        }
        return config;
      },
      /**
       * @description 渲染工具条
       * @param {object} data 配置参数
       * @return void
       */
      $reader_tootls: function (config) {
        var _that = this,
          event_list = {};

        /**
         * @description 请求方法
         * @param {Function} callback 回调函数
         * @returns void
         */
        function request(active, check_list) {
          var loadT = bt.load('正在执行批量' + active.title + '，请稍候...'),
            batch_config = {},
            list = _that.$get_data_batch_list(active.paramId, check_list);
          if (!active.beforeRequest) {
            batch_config[active.paramName] = list.join(',');
          } else {
            batch_config[active.paramName] = active.beforeRequest(check_list);
          }
          bt_tools.send(
            {
              url: active.url || _that.config.batch.url,
              data: $.extend(active.param || {}, batch_config),
            },
            function (res) {
              loadT.close();
              if (res.status === false && typeof res.success === 'undefined') {
                bt_tools.msg(res);
                return false;
              }
              if (typeof active.tips === 'undefined' || active.tips) {
                var html = '';
                $.each(res.error, function (key, item) {
                  html +=
                    '<tr><td><span class="text-overflow" title="' +
                    key +
                    '">' +
                    key +
                    '</span/></td><td><div style="float:right;" class="size_ellipsis"><span style="color:red">' +
                    item +
                    '</span></div></td></tr>';
                });
                $.each(res.success, function (index, item) {
                  html +=
                    '<tr><td><span class="text-overflow" title="' +
                    item +
                    '">' +
                    item +
                    '</span></td><td><div style="float:right;" class="size_ellipsis"><span style="color:#20a53a">操作成功</span></div></td></tr>';
                });
                _that.$batch_success_table({
                  title: '批量' + active.title,
                  th: active.theadName,
                  html: html,
                });
                if (active.refresh) _that.$refresh_table_list(true);
              } else {
                if (!active.success) {
                  var html = '';
                  $.each(check_list, function (index, item) {
                    html +=
                      '<tr><td><span class="text-overflow" title="' +
                      item.name +
                      '">' +
                      item.name +
                      '</span></td><td><div style="float:right;"><span style="color:' +
                      (res.status ? '#20a53a' : 'red') +
                      '">' +
                      ((typeof active.theadValue != 'undefined' ? active.theadValue[res.status ? 0 : 1] : null) || res.msg) +
                      '</span></div></td></tr>';
                  });
                  _that.$batch_success_table({title: '批量' + active.title + '完成', th: active.theadName, html: html});
                  if (active.refresh) _that.$refresh_table_list(true);
                }
              }
              if (active.success) {
                active.success(res, check_list, _that);
              }
            }
          );
        }

        /**
         * @description 执行批量，包含递归批量和自动化批量
         * @returns void
         */
        function execute_batch(active, check_list, success) {
          // if(active.recursion) 递归方式
          var bacth = {
            loadT: 0,
            config: {},
            check_list: check_list,
            bacth_status: true,
            start_batch: function (param, callback) {
              var _this = this;
              if (typeof param == 'undefined') param = {};
              if (typeof param == 'function') (callback = param), (param = {});
              if (active.load)
                this.loadT = layer.msg('正在执行批量' + active.title + '，<span class="batch_progress">进度:0/' + this.check_list.length + '</span>,请稍候...', {
                  icon: 16,
                  skin: 'batch_tips',
                  shade: 0.3,
                  time: 0,
                  area: '400px',
                });
              this.config = {
                param: param,
                url: active.url,
              };
              this.bacth(callback);
            },
            /**
             *
             * @param {Number} index 递归批量程序
             * @param {Function} callback 回调函数
             * @return void(0)
             */
            bacth: function (index, callback) {
              var _this = this,
                param = {};
              if (typeof index === 'function' || typeof index === 'undefined') (callback = index), (index = 0);
              if (index < this.check_list.length) {
                'function' == typeof active.url ? (this.config.url = active.url(check_list[index])) : (this.config.url = active.url);
                if (typeof active.param == 'function') {
                  param = active.param(check_list[index]);
                } else {
                  param = active.param;
                }
                this.config.param = $.extend(this.config.param, param);
                // this.config.param = param;
                if (typeof active.paramId != 'undefined') _this.config.param[active.paramName || active.paramId] = _this.check_list[index][active.paramId];
                if (typeof active.beforeBacth != 'undefined') this.config.param = $.extend(this.config.param, active.beforeBacth(_this.check_list[index]));
                if (this.config.param['bacth'] && index == this.check_list.length - 1) {
                  delete this.config.param['bacth'];
                }
                if (!_this.bacth_status) return false;
                if (active.load)
                  $('#layui-layer' + _this.loadT)
                    .find('.layui-layer-content')
                    .html(
                      '<i class="layui-layer-ico layui-layer-ico16"></i>正在执行批量' +
                      active.title +
                      '，<span class="batch_progress">进度:' +
                      index +
                      '/' +
                      _this.check_list.length +
                      '</span>，请稍候...' +
                      (active.clear ? '<a href="javascript:;" class="btlink clear_batch" style="margin-left:20px;">取消</a>' : '')
                    );
                bt_tools.send(
                  {
                    url: this.config.url,
                    data: this.config.param,
                    bacth: true,
                  },
                  function (res) {
                    $.extend(
                      _this.check_list[index],
                      {
                        request: {
                          status: typeof res.status === 'boolean' ? res.status : false,
                          msg: res.msg || '请求网络错误',
                        },
                      },
                      {requests: res}
                    );
                    index++;
                    _this.bacth(index, callback);
                  }
                );
              } else {
                if (success) success();
                if (callback) {
                  callback(this.check_list);
                }
                if (active.automatic) {
                  var html = '';
                  for (var i = 0; i < this.check_list.length; i++) {
                    var item = this.check_list[i];
                    html +=
                      '<tr><td>' +
                      (typeof item[active.paramThead] != 'undefined' ? item[active.paramThead] : item.name) +
                      '</td><td><div style="float:right;"><span style="color:' +
                      (item.request.status ? '#20a53a' : 'red') +
                      '">' +
                      item.request.msg +
                      '</span></div></td></tr>';
                  }
                  _that.$batch_success_table({title: '批量' + active.title, th: active.theadName, html: html});
                  if (active.refresh) _that.$refresh_table_list(true);
                  _that.$clear_table_checkbox();
                }
                layer.close(this.loadT);
              }
            },
            clear_bacth: function () {
              this.bacth_status = false;
              layer.close(this.loadT);
            },
          };
          if (active.callback) {
            active.callback(bacth);
          } else {
            if (!active.confirm || active.recursion) {
              if (active.confirmVerify) {
                bt.show_confirm('批量操作' + active.title + '已选中', '批量' + active.title + '，该操作可能会存在风险，是否继续？', function (index) {
                  layer.close(index);
                  if (!active.recursion) {
                    request(active, check_list);
                  } else {
                    bacth.start_batch();
                  }
                });
              } else {
                bt.confirm(
                  {
                    title: '批量' + active.title,
                    msg: typeof active.tips !== 'undefined' ? active.tips : '批量' + active.title + '，该操作可能会存在风险，是否继续？',
                    shadeClose: active.shadeClose ? active.shadeClose : false,
                  },
                  function (index) {
                    layer.close(index);
                    if (!active.recursion) {
                      request(active, check_list);
                    } else {
                      bacth.start_batch();
                    }
                  }
                );
              }
            } else {
              request(active, check_list);
            }
          }
        }

        for (var i = 0; i < config.length; i++) {
          var template = '',
            item = config[i],
            positon = [];
          switch (item.type) {
            case 'group':
              positon = item.positon || ['left', 'top'];
              $.each(item.list, function (index, items) {
                var _btn = item.type + '_' + _that.random + '_' + index,
                  html = '';
                if (items.type == 'division') {
                  template += '<span class="mlr5"></span>';
                } else {
                  if (!items.group) {
                    template +=
                      '<button type="button" title="' +
                      (items.tips || items.title) +
                      '" class="btn ' +
                      (items.active ? 'btn-success' : 'btn-default') +
                      ' ' +
                      _btn +
                      ' btn-sm mr5" ' +
                      that.$verify(_that.$reader_style(items.style), 'style') +
                      '>' +
                      (items.icon ? '<span class="glyphicon glyphicon-' + items.icon + ' mr5"></span>' : '') +
                      '<span>' +
                      items.title +
                      '</span></button>';
                  } else {
                    template +=
                      '<div class="btn-group" style="vertical-align: top;">\
                        <button type="button" class="btn btn-default ' +
                      _btn +
                      ' btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span style="margin-right:2px;">分类管理</span><span class="caret" style="position: relative;top: -1px;"></span></button>\
                        <ul class="dropdown-menu"></ul>\
                    </div>';
                    if (item.list) {
                      $.each(item.list, function (index, items) {
                        html += '<li><a href="javascript:;" ' + +'>' + items[item.key] + '</a></li>';
                      });
                    }
                    if (items.init)
                      setTimeout(function () {
                        items.init(_btn);
                      }, 400);
                  }
                }
                if (!event_list[_btn])
                  event_list[_btn] = {
                    event: items.event,
                    type: 'button',
                  };
              });
              break;
            case 'search':
              positon = item.positon || ['right', 'top'];
              item.value = item.value || '';
              this.config.search = item;
              var _input = 'search_input_' + this.random,
                _focus = 'search_focus_' + this.random,
                _btn = 'search_btn_' + this.random;
              template =
                '<div class="bt_search"><input type="text" class="search_input ' +
                _input +
                '" style="' +
                (item.width ? 'width:' + item.width : '') +
                '" placeholder="' +
                (item.placeholder || '') +
                '"/><span class="glyphicon glyphicon-search ' +
                _btn +
                '" aria-hidden="true"></span></div>';
              if (!event_list[_input])
                event_list[_input] = {
                  eventType: 'keyup',
                  type: 'search_input',
                };
              if (!event_list[_focus])
                event_list[_focus] = {
                  type: 'search_focus',
                  eventType: 'focus',
                };
              if (!event_list[_btn])
                event_list[_btn] = {
                  type: 'search_btn',
                };
              break;
            case 'batch':
              positon = item.positon || ['left', 'bottom'];
              item.placeholder = item.placeholder || '请选择批量操作';
              item.buttonValue = item.buttonValue || '批量操作';
              this.config.batch = item;
              var batch_list = [],
                _html = '',
                active = item.config;
              if (typeof item.config != 'undefined') {
                _that.batch_active = active;
                $(_that.config.el).on('click', '.set_batch_option', function (e) {
                  var check_list = [];
                  for (var i = 0; i < _that.checkbox_list.length; i++) {
                    check_list.push(_that.data[_that.checkbox_list[i]]);
                  }
                  if ($(this).hasClass('bt-disabled')) {
                    layer.tips(_that.config.batch.disabledTips || '请选择需要批量操作的数据', $(this), {
                      tips: [1, 'red'],
                      time: 2000,
                    });
                    return false;
                  }
                  switch (typeof active.confirm) {
                    case 'function':
                      active.confirm(active, function (param, callback) {
                        active.param = $.extend(active.param, param);
                        execute_batch(active, check_list, callback);
                      });
                      break;
                    case 'undefined':
                      execute_batch(active, check_list);
                      break;
                    case 'object':
                      var config = active.confirm;
                      bt.open({
                        title: config.title || '批量操作',
                        area: config.area || '350px',
                        btn: config.btn || ['确认', '取消'],
                        content: config.content,
                        success: function (layero, index) {
                          config.success(layero, index, active);
                        },
                        yes: function (index, layero) {
                          config.yes(index, layero, function (param, callback) {
                            active.param = $.extend(active.param, param);
                            request(active, check_list);
                          });
                        },
                      });
                      break;
                  }
                });
              } else {
                $.each(item.selectList, function (index, items) {
                  if (items.group) {
                    $.each(items.group, function (indexs, itemss) {
                      batch_list.push($.extend({}, items, itemss));
                      _html += '<li class="item">' + itemss.title + '</li>';
                    });
                    delete items.group;
                  } else {
                    batch_list.push(items);
                    _html += '<li class="item">' + items.title + '</li>';
                  }
                });
                // 打开批量类型列表
                $(_that.config.el)
                  .unbind()
                  .on('click', '.bt_table_select_group .bt_select_value', function (e) {
                    var _this = this,
                      $parent = $(this).parent(),
                      bt_selects = $parent.find('.bt_selects'),
                      area = $parent.offset(),
                      _win_area = _that.$get_win_area();
                    if ($parent.hasClass('bt-disabled')) {
                      layer.tips(_that.config.batch.disabledSelectValue, $parent, {tips: [1, 'red'], time: 2000});
                      return false;
                    }
                    if ($parent.hasClass('active')) {
                      $parent.removeClass('active');
                    } else {
                      $parent.addClass('active');
                    }
                    if (bt_selects.height() > _win_area[1] - area.top) {
                      bt_selects.addClass('top');
                    } else {
                      bt_selects.removeClass('top');
                    }
                    $(document).one('click', function () {
                      $(_that.config.el).find('.bt_table_select_group').removeClass('active');
                      return false;
                    });
                    return false;
                  });
                // 选择批量的类型
                $(_that.config.el).on('click', '.bt_table_select_group .item', function (e) {
                  var _text = $(this).text(),
                    _index = $(this).index();
                  $(this).addClass('active').siblings().removeClass('active');
                  $(_that.config.el + ' .bt_select_tips').html('批量' + _text + '<em>(已选中' + _that.checkbox_list.length + ')</em>');
                  _that.batch_active = batch_list[_index];
                  if (!_that.checked) $('.bt_table_select_group').removeClass('active');
                });
                // 执行批量操作
                $(_that.config.el).on('click', '.set_batch_option', function (e) {
                  var check_list = [],
                    active = _that.batch_active;
                  if ($(this).hasClass('bt-disabled')) {
                    layer.tips(_that.config.batch.disabledSelectValue, $(this), {
                      tips: [1, 'red'],
                      time: 2000,
                    });
                    return false;
                  }
                  for (var i = 0; i < _that.checkbox_list.length; i++) {
                    check_list.push(_that.data[_that.checkbox_list[i]]);
                  }
                  if (JSON.stringify(active) === '{}') {
                    var bt_table_select_group = $(_that.config.el + ' .bt_table_select_group');
                    layer.tips('请选择需要批量操作的类型', bt_table_select_group, {
                      tips: [1, 'red'],
                      time: 2000,
                    });
                    bt_table_select_group.css('border', '1px solid red');
                    setTimeout(function () {
                      bt_table_select_group.removeAttr('style');
                    }, 2000);
                    return false;
                  }
                  switch (typeof active.confirm) {
                    case 'function':
                      active.confirm(active, function (param, callback) {
                        active.param = $.extend(active.param, param);
                        execute_batch(active, check_list, callback);
                      });
                      break;
                    case 'undefined':
                      execute_batch(active, check_list);
                      break;
                    case 'object':
                      var config = active.confirm;
                      bt.open({
                        type: 1,
                        title: config.title || '批量操作',
                        area: config.area || '350px',
                        btn: config.btn || ['确认', '取消'],
                        content: '<div class="pd20">' + config.content + '</div>',
                        success: function (layero, index) {
                          config.success(layero, index, active);
                        },
                        yes: function (index, layero) {
                          config.yes(index, layero, function (param, callback) {
                            active.param = $.extend(active.param, param);
                            layer.close(index);
                            request(active, check_list);
                          });
                        },
                      });
                      break;
                  }
                });
              }
              template =
                '<div class="bt_batch"><label><i class="cust—checkbox cursor-pointer checkbox_' +
                this.random +
                '" data-checkbox="all"></i><input type="checkbox" lass="cust—checkbox-input" /></label>' +
                (typeof item.config != 'undefined'
                  ? '<button type="button" class="btn btn-default btn-sm set_batch_option bt-disabled">批量' + item.config.title + '</button>'
                  : '<div class="bt_table_select_group bt-disabled not-select"><span class="bt_select_value"><span class="bt_select_tips">请选择批量操作<em></em></span><span class="glyphicon glyphicon-triangle-bottom ml5"></span></span><ul class="bt_selects ">' +
                  _html +
                  '</ul></div><button type="button" class="btn btn-default btn-sm set_batch_option bt-disabled" >' +
                  item.buttonValue +
                  '</button>') +
                '</div>';
              break;
            case 'page':
              positon = item.positon || ['right', 'bottom'];
              item.page = config.page || 1;
              item.pageParam = item.pageParam || 'p';
              item.number = item.number || 20;
              item.numberList = item.numberList || [10, 20, 50, 100, 200];
              item.numberParam = typeof item.numberParam === 'boolean' ? item.numberParam : item.numberParam || 'limit';
              this.config.page = item;
              // var pageNumber = bt.get_cookie('page_number')
              var pageNumber = this.$get_page_number();
              // if (this.config.cookiePrefix && pageNumber) this.config.page.number = pageNumber
              if (pageNumber) this.config.page.number = pageNumber;
              template = this.$reader_page(this.config.page, '<div><span class="Pcurrent">1</span><span class="Pcount">共0条数据</span></div>');
              break;
          }
          if (template) {
            var tools_group = $(_that.config.el + ' .tootls_' + positon[1]);
            if (tools_group.length) {
              var tools_item = tools_group.find('.pull-' + positon[0]);
              tools_item.append(template);
            } else {
              var tools_group_elment =
                '<div class="tootls_group tootls_' +
                positon[1] +
                '"><div class="pull-left">' +
                (positon[0] === 'left' ? template : '') +
                '</div><div class="pull-right">' +
                (positon[0] === 'right' ? template : '') +
                '</div></div>';
              if (positon[1] === 'top') {
                $(_that.config.el).append(tools_group_elment);
                if ($(_that.config.el + ' .divtable').length === 0) $(_that.config.el).append('<div class="divtable mtb10" style="max-height:' + _that.config.height + 'px"></div>');
              } else {
                if ($(_that.config.el + ' .divtable').length === 0) $(_that.config.el).append('<div class="divtable mtb10" style="max-height:' + _that.config.height + 'px"></div>');
                $(_that.config.el).append(tools_group_elment);
              }
            }
          }
        }
        if (!this.init) this.$event_bind(event_list);
      },

      $clear_table_checkbox: function () {
        $(this.config.el).find('.bt_table .cust—checkbox').removeClass('selected active');
      },
      /**
       * @description 获取数据批量列表
       * @param {string} 需要获取的字段
       * @return {array} 当前需要批量列表
       */
      $get_data_batch_list: function (fid, data) {
        var arry = [];
        $.each(data || this.data, function (index, item) {
          arry.push(item[fid]);
        });
        return arry;
      },

      /**
       * @description 渲染分页
       * @param {object} config 配置文件
       * @param {object} page 分页
       * @return string
       */
      $reader_page: function (config, page) {
        var template = '',
          eventList = {},
          _that = this,
          $page = null;
        // console.log(config, page)
        if (config.number && !page) {
          template =
            (config.page !== 1 ? '<a class="Pnum page_link_' + this.random + '"  data-page="1">首页</a>' : '') +
            (config.page !== 1 ? '<a class="Pnum page_link_' + this.random + '" data-page="' + (config.page - 1) + '">上一页</a>' : '') +
            (_that.data.length === config.number ? '<a class="Pnum page_link_' + this.random + '" data-page="' + (config.page + 1) + '">下一页</a>' : '') +
            '<span class="Pcount">第 ' +
            config.page +
            ' 页</span>';
          eventList['page_link_' + this.random] = {type: 'cut_page_number'};
        } else {
          if (typeof page === 'number') page = this.$custom_page(page);
          $page = $(page);
          $page.find('a').addClass('page_link_' + this.random);
          template += $page.html();
          if (config.numberStatus) {
            var className = 'page_select_' + this.random,
              number = _that.$get_page_number();
            template += '<select class="page_select_number ' + className + '">';
            $.each(config.numberList, function (index, item) {
              template += '<option value="' + item + '" ' + ((number || config.number) == item ? 'selected' : '') + '>' + item + '条/页</option>';
            });
            template += '</select>';
            eventList[className] = {eventType: 'change', type: 'page_select'};
          }
          if (config.jump) {
            var inputName = 'page_jump_input_' + this.random;
            var btnName = 'page_jump_btn_' + this.random;
            template +=
              '<div class="page_jump_group"><span class="page_jump_title">跳转到</span><input type="number" class="page_jump_input ' +
              inputName +
              '" value="' +
              config.page +
              '" /><span class="page_jump_title">页</span><button type="button" class="page_jump_btn ' +
              btnName +
              '">确认</button></div>';
            eventList[inputName] = {
              eventType: 'keyup',
              type: 'page_jump_input',
            };
            eventList[btnName] = {
              type: 'page_jump_btn',
            };
          }
          eventList['page_link_' + this.random] = {
            type: 'cut_page_number',
          };
          _that.config.page.total =
            $page.length === 0
              ? 0
              : typeof page == 'number'
                ? page
                : parseInt(
                  $page
                    .find('.Pcount')
                    .html()
                    .match(/([0-9]*)/g)[1]
                );
        }

        _that.$event_bind(eventList);
        return '<div class="page">' + template + '</div>';
      },
      /**
       * @description 渲染样式
       * @param {object|string} data 样式配置
       * @return {string} 样式
       */
      $reader_style: function (data) {
        var style = '';
        if (typeof data === 'string') return data;
        if (typeof data === 'undefined') return '';
        $.each(data, function (key, item) {
          style += key + ':' + item + ';';
        });
        return style;
      },
      /**
       * @description 自定义分页
       * @param {}
       */
      $custom_page: function (total) {
        var html = '<div class="page">',
          config = this.config.page,
          page = Math.ceil(total / config.number),
          tmpPageIndex = 0;
        if (config.page > 1 && page > 1) {
          html += '<a class="Pstart" href="p=1">首页</a><a class="Pstart" href="p=' + (config.page - 1) + '">上一页</a>';
        }
        if (page <= 10) {
          for (var i = 1; i <= page; i++) {
            i == config.page ? (html += '<span class="Pcurrent">' + i + '</span>') : (html += '<a class="Pnum" href="p=' + i + '">' + i + '</a>');
          }
        } else if (config.page < 10) {
          for (var i = 1; i <= 10; i++) i == config.page ? (html += '<span class="Pcurrent">' + i + '</span>') : (html += '<a class="Pnum" href="p=' + i + '">' + i + '</a>');
          html += '<span>...</span>';
        } else if (page - config.page < 7) {
          page - 7 > 1 && ((html += '<a class="Pnum" href="p=1">1</a>'), (html += '<span>...</span>'));
          for (var i = page - 7; i <= page; i++)
            i == config.page ? (html += '<span class="Pcurrent">' + i + '</span>') : (html += 1 == i ? '<span>...</span>' : '<a class="Pnum" href="p=' + i + '">' + i + '</a>');
        } else {
          0 == tmpPageIndex && (tmpPageIndex = config.page),
          (tmpPageIndex <= config.page - 5 || tmpPageIndex >= config.page + 5) && (tmpPageIndex = config.page),
            (html += '<a class="Pnum" href="p=1">1</a>'),
            (html += '<span>...</span>');
          for (var i = tmpPageIndex - 3; i <= tmpPageIndex + 3; i++)
            i == config.page ? (html += '<span class="Pcurrent">' + i + '</span>') : (html += '<a class="Pnum" href="p=' + i + '">' + i + '</a>');
          (html += '<span>...</span>'), (html += '<a class="Pnum" href="p=' + page + '">' + page + '</a>');
        }
        return (
          page > 1 && config.page < page && (html += '<a class="Pstart" href="p=' + (config.page + 1) + '">下一页</a><a class="Pstart" href="p=' + page + '">尾页</a>'),
            (html += '<span class="Pcount">共' + total + '条</span></div>')
        );
      },

      /**
       * @deprecated 动态处理合并行内，css样式
       * @param {object} rows 当前行数据
       * @return {stinrg} className class类名
       * @return void
       */
      $dynamic_merge_style: function (column, index) {
        var str = '';
        $.each(column, function (key, item) {
          switch (key) {
            case 'align':
              str += 'text-align:' + item + ';';
              break;
            case 'width':
              str += 'width:' + (typeof item == 'string' ? item : item + 'px') + ';';
              break;
            case 'style':
              str += item;
              break;
            case 'minWidth':
              str += 'min-width:' + (typeof item == 'string' ? item : item + 'px') + ';';
              break;
            case 'maxWidth':
              str += 'max-width:' + (typeof item == 'string' ? item : item + 'px') + ';';
              break;
          }
        });
        return {
          index: index,
          css: str,
        };
      },

      /**
       * @description 事件绑定
       * @param {array} eventList 事件列表
       * @return void
       */
      $event_bind: function (eventList) {
        var _that = this;
        $.each(eventList, function (key, item) {
          if (_that.event_list[key] && _that.event_list[key].eventType === item.eventType) return true;
          _that.event_list[key] = item;
          $(_that.config.el).on(item.eventType || 'click', '.' + key, function (ev) {
            var index = $(this).parents('tr').index(),
              data1 = $(this).data(),
              arry = [],
              column_data = _that.config.column[$(this).parents('td').index()];
            switch (item.type) {
              case 'rows':
                _that.event_rows_model = {
                  el: $(this),
                  model: column_data,
                  rows: _that.data[index],
                  index: index,
                };
                arry = [_that.event_rows_model.rows, _that.event_rows_model.index, ev, key, _that];
                break;
              case 'sort':
                var model = _that.config.column[data1.index];
                if ($(this).hasClass('sort-active'))
                  $('.sort_' + _that.random + ' .sort-active').data({
                    sort: 'desc',
                  });
                $('.sort_' + _that.random)
                  .removeClass('sort-active')
                  .find('.glyphicon')
                  .removeClass('glyphicon-triangle-top')
                  .addClass('glyphicon-triangle-bottom');
                $(this).addClass('sort-active');
                if (data1.sort == 'asc') {
                  $(this).data({
                    sort: 'desc',
                  });
                  $(this).find('.glyphicon').removeClass('glyphicon-triangle-top').addClass('glyphicon-triangle-bottom');
                } else {
                  $(this).data({
                    sort: 'asc',
                  });
                  $(this).find('.glyphicon').removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-top');
                }
                _that.config.sort = _that.config.sortParam({
                  name: model.fid,
                  sort: data1.sort,
                });
                _that.$refresh_table_list(true);
                break;
              case 'checkbox':
                var all = $(_that.config.el + ' [data-checkbox="all"]'),
                  checkbox_list = $(_that.config.el + ' tbody .checkbox_' + _that.random);
                if (data1.checkbox == undefined) {
                  if (!$(this).hasClass('active')) {
                    $(this).addClass('active');
                    _that.checkbox_list.push(index);
                    if (_that.data.length === _that.checkbox_list.length) {
                      all.addClass('active').removeClass('selected');
                    } else if (_that.checkbox_list.length > 0) {
                      all.addClass('selected');
                    }
                  } else {
                    $(this).removeClass('active');
                    _that.checkbox_list.splice(_that.checkbox_list.indexOf(index), 1);
                    if (_that.checkbox_list.length > 0) {
                      all.addClass('selected').removeClass('active');
                    } else {
                      all.removeClass('selected active');
                    }
                  }
                } else {
                  if (_that.checkbox_list.length === _that.data.length) {
                    _that.checkbox_list = [];
                    checkbox_list.removeClass('active selected').next().prop('checked', 'checked');
                    all.removeClass('active');
                  } else {
                    checkbox_list.each(function (index, item) {
                      if (!$(this).hasClass('active')) {
                        $(this).addClass('active').next().prop('checked', 'checked');
                        _that.checkbox_list.push(index);
                      }
                    });
                    all.removeClass('selected').addClass('active');
                  }
                }
                _that.$set_batch_view();
                break;
              case 'button':
                arry.push(ev, _that);
                break;
              case 'search_focus':
                var search_tips = $(_that.config.el + ' .bt_search_tips');
                if ($(_that.config.el + ' .bt_search_tips').length > 0) {
                  search_tips.remove();
                }
                break;
              case 'search_input':
                if (ev.keyCode == 13) {
                  $(_that.config.el + ' .search_btn_' + _that.random).click();
                  return false;
                }
                break;
              case 'search_btn':
                var _search = $(_that.config.el + ' .search_input'),
                  val = $(_that.config.el + ' .search_input').val(),
                  _filterBox = $('<div></div>').text(val),
                  _filterText = _filterBox.html();

                val = _filterText; //过滤xss
                val = val.replace(/(^\s*)|(\s*$)/g, '');
                _search.text(val);
                _that.config.search.value = val;
                if (_that.config.page) _that.config.page.page = 1;
                _search.append('<div class="bt_search_tips"><span>' + val + '</span><i class="bt_search_close"></i></div>');
                _that.$refresh_table_list(true);
                break;
              case 'page_select':
                var limit = parseInt($(this).val());
                _that.$set_page_number(limit);
                _that.config.page.number = limit;
                _that.config.page.page = 1;
                _that.$refresh_table_list(true);
                return false;
                break;
              case 'page_jump_input':
                if (ev.keyCode === 13) {
                  $(_that.config.el + ' .page_jump_btn_' + _that.random).click();
                  $(this).focus();
                }
                return false;
                break;
              case 'page_jump_btn':
                var jump_page = parseInt($(_that.config.el + ' .page_jump_input_' + _that.random).val()),
                  max_number = Math.ceil(_that.config.page.total / _that.config.page.number);
									if (isNaN(jump_page) || Number(jump_page) < 1) jump_page = 1
                if (jump_page > max_number) jump_page = _that.config.page.page;
                _that.config.page.page = jump_page;
                _that.$refresh_table_list(true);
                break;
              case 'cut_page_number':
                var page =
                  $(this).data('page') ||
                  parseInt(
                    $(this)
                      .attr('href')
                      .match(/([0-9]*)$/)[0]
                  );
                _that.config.page.page = page;
                _that.$refresh_table_list(true);
                return false;
                break;
              case 'eye_open_password':
                if ($(this).hasClass('glyphicon-eye-open')) {
                  $(this).addClass('glyphicon-eye-close').removeClass('glyphicon-eye-open');
                  $(this).prev().text(_that.data[index][column_data.fid]);
                } else {
                  $(this).addClass('glyphicon-eye-open').removeClass('glyphicon-eye-close');
                  $(this).prev().html('<i>**********</i>');
                }
                return false;
                break;
              case 'copy_password':
                bt.pub.copy_pass(_that.data[index][column_data.fid]);
                return false;
                break;
            }
            if (item.event) item.event.apply(this, arry);
          });
        });
      },

      /**
       * @description 样式绑定
       * @param {array} style_list 样式列表
       * @return void
       */
      $style_bind: function (style_list, status) {
        var str = '',
          _that = this;
        $.each(style_list, function (index, item) {
          if (item.css != '') {
            if (!item.className) {
              var item_index = style_list[0].hasOwnProperty('className') ? index : item.index + 1
              str += _that.config.el + ' thead th:nth-child(' + item_index + '),' + _that.config.el + ' tbody tr td:nth-child' + (item.span ? ' span' : '') + '(' + item_index + '){' + item.css + '}'
            } else {
              str += item.className + '{' + item.css + '}';
            }
          }
        });
        if ($('#bt_table_' + _that.random).length == 0) $(_that.config.el).append('<style type="text/css" id="bt_table_' + _that.random + '">' + str + '</style>');
      },

      /**
       * @deprecated 获取WIN高度或宽度
       * @return 返回当期的宽度和高度
       */
      $get_win_area: function () {
        return [window.innerWidth, window.innerHeight];
      },

      /**
       * @description 获取分页条数
       * @return 返回分页条数
       */
      $get_page_number: function () {
        var name = this.config.pageName;
        if (name) {
          return bt.get_cookie(name + '_page_number');
        }
      },

      /**
       * @description 设置分页条数
       * @param {object} limit 分页条数
       * @return void
       */
      $set_page_number: function (limit) {
        var name = this.config.pageName;
        if (name) bt.set_cookie(name + '_page_number', limit);
      },

      /**
       * @description 请求数据，
       * @param {object} param 参数和请求路径
       * @return void
       */
      $http: function (load, success) {
        var page_number = this.$get_page_number(),
          that = this,
          param = {},
          config = this.config,
          _page = config.page,
          _search = config.search,
          _sort = config.sort || {};
        if (_page) {
          if (page_number && !_page.number) _page.number = page_number;
          if (_page.defaultNumber) _page.number = _page.defaultNumber;

          if (_page.numberParam) param[_page.numberParam] = _page.number;
          param[_page.pageParam] = _page.page;
        }

        if (_search) param[_search.searchParam] = _search.value;
        var params = $.extend(config.param, param, _sort);
        if (this.config.beforeRequest) {
          if (this.config.beforeRequest === 'model') {
            config.param = (function () {
              if (params.hasOwnProperty('data') && typeof params.data === 'string') {
                var oldParams = JSON.parse(params['data']);
                delete params['data'];
                return {data: JSON.stringify($.extend(oldParams, params))};
              }
              return {data: JSON.stringify(params)};
            })();
          } else {
            config.param = this.config.beforeRequest(params);
          }
        } else {
          config.param = params;
        }
        bt_tools.send(
          {
            url: config.url,
            data: config.param,
          },
          function (res) {
            if (typeof config.dataFilter != 'undefined') {
              var data = config.dataFilter(res, that);
              if (typeof data.tootls != 'undefined') data.tootls = parseInt(data.tootls);
              if (success) success(data);
            } else {
              if (void 0 === res.data) {
                success &&
                success({
                  data: res,
                });
              } else
                success &&
                success({
                  data: res.data,
                  page: res.page,
                });
            }
          },
          {
            load: load ? '获取列表数据' : false,
            verify: typeof config.dataVerify === 'undefined' ? true : !!config.dataVerify
          }
        );
      },
    };
    var example = new ReaderTable(config);
    $(config.el).data('table', example);
    return example;
  },

  /**
   * @description 验证表单
   * @param {object} el 节点
   * @param {object} config 验证配置
   * @param {function} callback 验证成功回调
   */
  verifyForm: function (el, config, callback) {
    var verify = false,
      formValue = this.getFormValue(el, []);
    for (var i = 0; i < config.length; i++) {
      var item = config[i];
      verify = item.validator.apply(this, [formValue[item.name], formValue]);
      if (typeof verify === 'string') {
        this.error(verify);
        return false;
      }
    }
    callback && callback(typeof verify !== 'string', formValue);
  },
  /**
   * @description 获取表单值
   * @param {String} el 表单元素
   * @param {Array} filter 过滤列表
   * @returns {Object} 表单值
   */
  getFormValue: function (el, filter) {
    var form = $(el).serializeObject();
    filter = filter && [];
    for (var key in form) {
      if (filter.indexOf(key) > -1) delete form[key];
    }
    return form;
  },

  /**
   * @description 设置layer定位
   * @param {object} el 节点
   */
  setLayerArea: function (el) {
    var $el = $(el),
      width = $el.width(),
      height = $el.height(),
      winWidth = $(window).width(),
      winHeight = $(window).height();
    $el.css({left: (winWidth - width) / 2, top: (winHeight - height) / 2});
  },

  /**
   * @description 渲染表单行内容
   * @param {object} config 配置参数
   */
  line: function (config) {
    var $line = $('<div class="line ' + (config.lineClass ? config.lineClass : '') + '" style="' + (config.labelStyle || '') + '"><span class="tname" style="' + (config.labelWidth ? ('width:' + config.labelWidth) : '') + '">' + ((typeof config.must !== "undefined" && config.must != '' ? '<span class="color-red mr5">' + config.must + '</span>' : '') + config.label || '') + '</span><div class="info-r" style="' + (config.labelWidth ? ('margin-left:' + config.labelWidth) : '') + '"></div></div>');
    var $form = this.renderLineForm(config);
    $form.data({line: $line});
    $line.find('.info-r').append($form);
    return {
      $line: $line,
      $form: $form,
    };
  },

  /**
   * @description 帮助提示
   * @param {object} config 配置参数
   */
  help: function (config) {
    var $help = '';
    for (var i = 0; i < config.list.length; i++) {
      var item = config.list[i];
      $help += '<li>' + item + '</li>';
    }
    return $('<ul class="help-info-text c7" style="' + (config.style || '') + '">' + $help + '</ul>');
  },

  /**
   * @description 渲染表单行内容
   * @param {object} config 配置参数
   * @returns {jQuery|HTMLElement|*}
   */
  renderLineForm: function (config) {
    config.type = config.type || 'text';
    var lineFilter = ['label', 'labelWidth', 'group', 'on', 'width', 'options', 'type']; // 排除渲染这些属性
    var $form = null;
    var props = (function () {
      var attrs = {};
      for (var key in config) {
        if (lineFilter.indexOf(key) === -1) {
          attrs[key] = config[key];
        }
      }
      return attrs;
    })();
    var width = config.width ? 'style="width:' + config.width + '"' : '';
    switch (config.type) {
      case 'textarea':
        $form = '<textarea class="bt-input-text mr5" ' + width + '></textarea>';
        break;
      case 'select':
        var options = config.options,
          optionsHtml = '';
        for (var i = 0; i < options.length; i++) {
          var item = options[i],
            newItem = item;
          if (typeof item === 'string') newItem = {label: item, value: item};
          optionsHtml += '<option value="' + newItem.value + '">' + newItem.label + '</option>';
        }
        $form = '<select class="bt-input-text mr5" ' + width + '>' + optionsHtml + '</select>';
        break;
      case 'text':
        $form = '<input type="text" class="bt-input-text mr5" />';
        break;
    }
    $form = $($form);
    $form.width(config.width || '100%').attr(props);
    if (!config.on) config.on = {};
    for (var onKey in config.on) {
      (function (onKey) {
        $form.on(onKey, function (ev) {
          config.on[onKey].apply(this, [ev, $(this).val()]);
        });
      })(onKey);
    }
    return $form;
  },

  /**
   * @description 渲染表单行组
   * @param {object} el 配置参数
   * @param {object} config 配置参数
   * @param {object|undefined} formData 表单数据
   */
  fromGroup: function (el, config, formData) {
    var $el = $(el),
      lineList = {};
    for (var i = 0; i < config.length; i++) {
      var item = config[i];
      if (item.type === 'tips') {
        $el.append(this.help(item));
      } else {
        var line = this.line(item);
        if (typeof formData != 'undefined') line.$form.val(formData[item.name] || '');
        lineList[line.$form.attr('name')] = line;
        $el.append(line.$line);
      }
    }
    return lineList;
  },

 /**
   * @description 渲染Form表单
   * @param {*} config
   * @return 当前实例对象
   */
  form: function (config) {
    var _that = this;
    function ReaderForm (config) {
      this.config = config;
      this.el = config.el
      this.submit = config.submit
      this.data = config.data || {};
      this.$load();
    }
    ReaderForm.prototype = {
      element: null,
      style_list: [], // 样式列表
      event_list: {}, // 事件列表,已绑定事件
      event_type: ['click', 'event', 'focus', 'keyup', 'blur', 'change', 'input'],
      hide_list: [],
      form_element: {},
      form_config: {},
      random: bt.get_random(5),
      $load: function () {
        var that = this;
        if (this.el) {
          $(this.el).html(this.$reader_content())
          // $(this.el).find('input[type="text"],textarea').each(function () {
          //   var name = $(this).attr('name');
          //   $(this).val(that.data[name]);
          // });
          if ($('#editCrontabForm .bt_multiple_select_updown').length > 0) {
            var height = $('#editCrontabForm .bt_multiple_select_updown').parent().height()
            $('#editCrontabForm .line:eq(3) .tname').css({'height':height+'px','line-height':height+'px'})
          }
          this.$event_bind();
        }
      },

      /**
       * @description 渲染Form内容
       * @param {Function} callback 回调函数
       */
      $reader_content: function (callback) {
        var that = this,
            html = '',
            _content = '';
        $.each(that.config.form, function (index, item) {
          if (item.separate) {
            html += '<div class="bt_form_separate"><span class="btn btn-sm btn-default">' + item.separate + '</span></div>'
          } else {
            html += that.$reader_content_row(index, item);
          }
        });
        that.element = $('<form class="bt-form" data-form="' + that.random + '" onsubmit="return false">' + html + '</form>');
        _content = $('<div class="' + _that.$verify(that.config['class']) + '"></div>');
        _content.append(that.element);
        if (callback) callback();
        return _content[0].outerHTML;
      },

      /**
       * @description 渲染行内容
       * @param {object} data Form数据
       * @param {number} index 下标
       * @return {string} HTML结构
       */
      $reader_content_row: function (index, data) {
        try {
          var that = this, help = data.help || false, labelWidth = data.formLabelWidth || this.config.formLabelWidth;
          if (data.display === false) return '<div class="line" style="padding:0"></div>';
          return '<div class="line' + _that.$verify(data['class']) + _that.$verify(data.hide, 'hide', true) + '"' + _that.$verify(data.id, 'id') + '>' +
              (typeof data.label !== "undefined" ? '<span class="tname" ' + (labelWidth ? 'style="width:' + labelWidth + '"' : '') + '>' + (typeof data.must !== "undefined" && data.must != '' ? '<span class="color-red mr5">'+data.must+'</span>':'') + data.label + '</span>' : '') +
              '<div class="' + (data.label ? 'info-r' : '') + _that.$verify(data.line_class) + '"' + _that.$verify(that.$reader_style($.extend(data.style, labelWidth ? { 'margin-left': labelWidth } : {})), 'style') + '>' +
              that.$reader_form_element(data.group, index) +
              (help ? ('<div class="c9 mt5 ' + _that.$verify(help['class'], 'class') + '" ' + _that.$verify(that.$reader_style(help.style), 'style') + '>' + help.list.join('</br>') + '</div>') : '') +
              '</div>' +
              '</div>';
        } catch (error) {
          console.log(error)
        }
      },

      /**
       * @description 渲染form类型
       * @param {object} data 表单数据
       * @param {number} index 下标
       * @return {string} HTML结构
       */
      $reader_form_element: function (data, index) {
        var that = this, html = '';
        if (!Array.isArray(data)) data = [data];
        $.each(data, function (key, item) {
          item.find_index = index;
          html += that.$reader_form_find(item);
          that.form_config[item.name] = item;
        });
        return html;
      },
      /**
       * @descripttion 渲染单个表单元素
       * @param {Object} item 配置
       * @return: viod
       */
      $reader_form_find: function (item) {
        var that = this, html = '', style = that.$reader_style(item.style) + _that.$verify(item.width, 'width', 'style'),
            attribute = that.$verify_group(item, ['name', 'placeholder', 'disabled', 'readonly', 'autofocus', 'autocomplete', 'min', 'max']),
            event_group = that.$create_event_config(item),
            eventName = '', index = item.find_index;
        if (item.display === false) return html
        html += item.label ? '<span class="mr5 inlineBlock">' + item.label + '</span>' : '';
        if (typeof item['name'] !== "undefined") {
          that.$check_event_bind(item.name, event_group)
        }
        html += '<div class="' + (item.dispaly || 'inlineBlock') + ' ' + _that.$verify(item.hide, 'hide', true) + ' ' + (item['class'] || '') + '">';
        var _value = typeof that.data[item.name] !== "undefined" && that.data[item.name] !== '' ? that.data[item.name] : (item.value || '')
        // if(typeof that.data == 'undefined') that.data = {}
        // if(typeof item.value != 'undefined' && typeof that.data[item.name] == "undefined") that.data[item.name] = item.value
        switch (item.type) {
          case 'text': // 文本选择
          case 'checkbox': // 复选框
          case 'password': // 密码
          case 'radio': // 单选框
          case 'number': // 数字
            var _event = 'event_' + item.name + '_' + that.random;
            switch (item.type) {
              case 'checkbox': // 复选框
                html += '<label class="cursor-pointer form-checkbox-label" ' + _that.$verify(that.$reader_style(item.style), 'style') + '><i class="form-checkbox cust—checkbox cursor-pointer mr5 ' + _event + '_label ' + (_value ? 'active' : '') + '"></i><input type="checkbox" class="form—checkbox-input hide mr10 ' + _event + '" name="' + item.name + '" ' + (_value ? 'checked' : '') + '/><span class="vertical_middle">' + item.title + '</span></label>';
                if(typeof item.disabled != 'undefined' && item.disabled){
                  //禁止复选框    同时可设置class:'check_disabled',使鼠标手为禁止状态
                }else {
                  that.$check_event_bind(_event + '_label', {'click': {type: 'checkbox_icon', config: item}})
                  that.$check_event_bind(_event, {'input': {type: 'checkbox', config: item, event: item.event}})
                }
                break;
              case 'radio':
                $.each(item.list,function(keys,rItem){
                  var radioRandom = _event+'_radio_'+keys
                  html+= '<span class="form-radio"><input type="radio" name="'+item.name+'" '+(_value == rItem.value ? 'checked': '')+' id="'+radioRandom+'" class="'+radioRandom+'" value="'+rItem.value+'"><label for="'+radioRandom+'" class="mb0">'+rItem.title+'</span>'
                  that.$check_event_bind(radioRandom, {'input': {type: 'radio', config: item, event: item.event}})
                })
                break;
              default:
                html += '<input type="' + item.type + '"' + attribute + ' ' + (item.icon ? 'id="' + _event + '"' : '') + ' class="bt-input-' + (item.type !== 'select_path' && item.type !== 'number' && item.type !== 'password' ? item.type : 'text') + ' mr10 ' + (item.label ? 'vertical_middle' : '') + _that.$verify(item['class']) + '"' + _that.$verify(style, 'style') + ' value="' + _value + '"/>';
                break;
            }
            if (item.btn && !item.disabled) {
              html += '<span class="btn ' + item.btn.type + ' ' + item.name + '_btn cursor" ' + _that.$verify(that.$reader_style(item.btn.style), 'style') + '>' + item.btn.title + '</span>';
              if (typeof item.btn.event !== 'undefined') {
                that.$check_event_bind(item.name + '_btn', {
                  'click': {
                    config: item,
                    event: item.btn.event
                  }
                })
              }
            }
            if (item.icon) {
              html += '<span class="glyphicon ' + item.icon.type + ' ' + item.name + '_icon cursor ' + (item.disabled ? 'hide' : '') + ' mr10" ' + _that.$verify(that.$reader_style(item.icon.style), 'style') + '></span>';
              if (typeof item.icon.event !== 'undefined') {
                that.$check_event_bind(item.name + '_icon', {
                  'click': {
                    type: 'select_path',
                    select: item.icon.select || '',
                    config: item,
                    defaultPath: item.icon.defaultPath || '',
                    children: '.' + item.name + '_icon',
                    event: item.icon.event,
                    callback: item.icon.callback
                  }
                })
              }
            }
            break;
          case 'textarea':
            html += '<textarea class="bt-input-text"' + _that.$verify(style, 'style') + attribute + ' >' + _value + '</textarea>';
            $.each(['blur', 'focus', 'input'], function (index, items) {
              if (item.tips) {
                var added = null, event = {}
                switch (items) {
                  case 'blur':
                    added = function (ev, item, element) {
                      if ($(this).val() === '') $(this).next().show();
                      layer.close(item.tips.loadT);
                      $(ev.target).data('layer', '');
                    }
                    break;
                  case 'focus':
                    added = function (ev, item) {
                      $(this).next().hide();
                      item.tips.loadT = layer.tips(tips, $(this), {
                        tips: [1, '#20a53a'],
                        time: 0,
                        area: $(this).width()
                      });
                    }
                    break;
                }
              }
              that.event_list[item.name][items] ? (that.event_list[item.name][items]['added'] = added) : (that.event_list[item.name][items] = {
                type: item.type,
                cust: false,
                event: item[items],
                added: added
              });
            });
            if (item.tips) {
              var tips = '';
              if (typeof item.tips.list === "undefined") {
                tips = item.tips.text;
              } else {
                tips = item.tips.list.join('</br>');
              }
              html += '<div class="placeholder c9 ' + item.name + '_tips" ' + _that.$verify(that.$reader_style(item.tips.style), 'style') + '>' + tips + '</div>';
              that.$check_event_bind(item.name + '_tips', {
                'click': {
                  type: 'textarea_tips',
                  config: item
                }
              })
            }
            break;
          case 'select':
            html += that.$reader_select(item, style, attribute, index);
            that.$check_event_bind('custom_select', {
              'click': {
                type: 'custom_select',
                children: '.bt_select_value'
              }
            })
            that.$check_event_bind('custom_select_item', {
              'click': {
                type: 'custom_select_item',
                children: 'li.item'
              }
            })
            break;
          case 'multipleSelect':
            // 使用规则  【配置中必须含有value字段（无需默认值设置空数组）、需要选中的下拉项以数组逗号隔开】
            html += that.$reader_multipleSelect(item, style, attribute, index);
						that.$check_event_bind('custom_select', {
              'click': {
                type: 'custom_select',
                children: '.bt_select_value'
              }
            })
            that.$check_event_bind('custom_select_item', {
              'click': {
                type: 'custom_select_item',
                children: 'li.item'
              }
            })
            that.$check_event_bind('icon_trem_close', {
              'click': {
                type: 'icon_trem_close',
                children: '.icon-trem-close'
              }
            })
            break;
          case 'secondaryMenu'://下拉二级菜单
            html += that.$reader_secondaryMenu(item, style, attribute, index);
            that.$check_event_bind('secondary_menu_parent', {
              'mouseover click': {
                type: 'secondary_menu_parent',
                children: '.item-parent'
              }
            })
            that.$check_event_bind('secondary_menu_child', {
              'click': {
                type: 'secondary_menu_child',
                children: '.item-child'
              }
            })
            break;
          case 'link':
            eventName = 'event_link_' + that.random + '_' + item.name;
            html += '<a href="' + (item.href || 'javascript:;') + '" class="'+ (item['subclass'] ? item['subclass'] : 'btlink') +' ' + eventName + '" ' + _that.$verify(that.$reader_style(item.style), 'style') + '>' + item.title + '</a>';
            that.$check_event_bind(eventName, {
              'click': {
                type: 'link_event',
                event: item.event
              }
            })
            break;
          case 'button':
						html += '<button class="btn ' + (item.hasOwnProperty('active') ? item.active ? 'btn-success' : 'btn-default' : "btn-success ") +' btn-' + (item.size || 'sm ') + ' ' + eventName + ' ' + _that.$verify(item['class']) + '"  ' + _that.$verify(that.$reader_style(item.style), 'style') + ' ' + attribute + '>' + item.title + '</button>'
            break;
          case 'help':
            var _html = '';
            $.each(item.list, function (index, items) {
              _html += '<li>' + items + '</li>';
            })
            html += '<ul class="help-info-text c7' + _that.$verify(item['class']) + '"' + _that.$verify(that.$reader_style(item.style), 'style') + ' ' + attribute + '>' + _html + '</ul>';
            break;
          case 'other':
            html += item.boxcontent;
        }
        html += item.unit ? '<span class="' + (item.type === 'text-tips' ? 'text-tips' : 'unit') + '">' + item.unit + '</span>' : '';
        html += item.suffix ? '<span class="text-tips ml10" '+(item.type === 'select')+'>'+item.suffix+'</span>':'';
        html += '</div>'
        return html;
      },

      /**
       * @descripttion 检测检测名称
       * @param {string} eventName 配置
       * @param {object} config 事件配置
       */
      $check_event_bind: function (eventName, config) {
        if (!this.event_list[eventName]) {
          if (!this.event_list.hasOwnProperty(eventName)) {
            this.event_list[eventName] = config
          }
        }
      },
      /**
       * @description 创建事件配置
       * @param {object} item 行内配置
       * @return {object} 配置信息
       */
      $create_event_config: function (item) {
        var config = {};
        if (typeof item['name'] === "undefined") return {};
        $.each(this.event_type, function (key, items) {
          if (item[items]) {
            config[(items === 'event' ? 'click' : items)] = {
              type: item.type,
              event: item[items],
              cust: (['select', 'checkbox', 'radio'].indexOf(item.type) > -1),
              config: item
            };
          }
        });
        return config;
      },
      /**
       * @description 渲染样式
       * @param {object|string} data 样式配置
       * @return {string} 样式
       */
      $reader_style: function (data) {
        var style = '';
        if (typeof data === 'string') return data;
        if (typeof data === 'undefined') return '';
        $.each(data, function (key, item) {
          style += key + ':' + item + ';';
        });
        return style;
      },
      /**
       * @descripttion 局部刷新form表单元素
       * @param {String} name 需要刷新的元素
       * @param {String} name 元素新数据
       * @return: viod
       */
      $local_refresh: function (name, config) {
        var formFind = this.element.find('[data-name=' + name + ']')
        if (this.element.find('[data-name=' + name + ']').length === 0) formFind = this.element.find('[name=' + name + ']')
        formFind.parent().replaceWith(this.$reader_form_find(config))
        // if(config.type == 'text' || config.tyep == 'textarea'){
        //   if (this.element.find('[data-name=' + name + ']').length === 0) formFind = this.element.find('[name=' + name + ']')
        //   formFind.val(config.value)
        // }
      },
      /**
       * @description 渲染下拉，内容方法
       */
      $reader_select: function (item, style, attribute, index) {
        var that = this, list = '', option = '', active = {};
        if (typeof item.list === 'function') {
          var event = item.list;
          event.call(this, this.config.form);
          item.list = [];
        }
        if (!Array.isArray(item.list)) {
          var config = item.list;
          bt_tools.send({
            url: config.url,
            data: config.param || config.data || {}
          }, function (res) {
            if (res.status !== false) {
              var list = item.list.dataFilter ? item.list.dataFilter(res, that) : res;
              if (item.list.success) item.list.success(res, that, that.config.form[index], list)
              item.list = list
              if (!item.list.length) {
                item.disabled = true
                layer.msg(item.placeholder || '数据获取为空', { icon: 2 })
              }
              that.$replace_render_content(index);
            } else {
              bt.msg(res);
            }
          });
          return false
        }
        if (typeof that.data[item.name] === "undefined") active = item.list[0]
        $.each(item.list, function (key, items) {
          if (items.value === item.value || items.value === that.data[item.name]) {
            active = items
            return false
          }
        })
        $.each(item.list, function (key, items) {
          list += '<li class="item' + _that.$verify(items.value === active.value ? 'active' : '') + ' ' + (items.disabled ? 'disabled' : '') + '" title="' + items.title + '">' + items.title + '</li>';
          option += '<option value="' + items.value + '"' + (items.disabled ? 'disabled' : '') + ' ' + _that.$verify(items.value === active.value ? 'selected' : '') + '>' + items.title + '</option>';
        });
        var title = !Array.isArray(item.list) ? '获取数据中' : (active ? active.title : item.placeholder)
        return '<div class="bt_select_updown mr10 ' + (item.disabled ? 'bt-disabled' : '') + ' ' + + _that.$verify(item['class']) + '" ' + _that.$verify(style, 'style') + ' data-name="' + item.name + '">' +
            '<span class="bt_select_value"><span class="bt_select_content" title="' + (title || item.placeholder) + '">' + (title || item.placeholder) + '</span><div class="icon-down"><svg width="12.000000" height="12.000000" viewBox="0 0 12 5" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
          '\t<desc>\n' +
          '\t\t\tCreated with Pixso.\n' +
          '\t</desc>\n' +
          '\t<defs/>\n' +
          '\t<path id="path" d="M0.123291 0.809418L4.71558 5.84385C4.8786 6.02302 5.16846 6.04432 5.33038 5.86389L9.87927 0.783104C10.0412 0.602676 10.04 0.311989 9.87701 0.132816C9.79626 0.0446892 9.68945 0 9.58374 0C9.47693 0 9.36938 0.0459404 9.28827 0.136574L5.02881 4.89284L0.708618 0.15662C0.627869 0.0684967 0.522217 0.0238075 0.415405 0.0238075C0.307434 0.0238075 0.20105 0.0697479 0.119873 0.160381C-0.041626 0.338303 -0.0393677 0.630241 0.123291 0.809418Z" fill-rule="nonzero" fill="#999999"/>\n' +
          '</svg>\n</div></span>' +
            '<ul class="bt_select_list">' + (list || '<div style="height:80px;display:inline-flex;align-items:center;justify-content:center;color:#999;width:100%">无数据</div>') + '</ul>' +
            '<select' + attribute + ' class="hide" ' + (item.disabled ? 'disabled' : '') + ' autocomplete="off">' + (option || '') + '</select>' +
            '<div class="bt_select_list_arrow"></div><div class="bt_select_list_arrow_fff"></div>'+
            '</div>';
      },
      /**
       * @description 渲染多选下拉，内容方法
       */
      $reader_multipleSelect: function (item, style, attribute, index) {
        var that = this, list = '', option = '', active = {}, mulpActive = [],str = '';
        if (typeof item.list === 'function') {
          var event = item.list;
          event.call(this, this.config.form);
          item.list = [];
        }
        if ($.isArray(item.value)) {
          mulpActive = item.value
        }else{
          if (!Array.isArray(item.list)) {
            var config = item.list;
            bt_tools.send({
              url: config.url,
              data: config.param || config.data || {}
            }, function (res) {
              if (res.status !== false) {
                var list = item.list.dataFilter ? item.list.dataFilter(res, that) : res;
                if (item.list.success) item.list.success(res, that, that.config.form[index], list)
                item.list = list
                if (!item.list.length) {
                  item.disabled = true
                  layer.msg(item.placeholder || '数据获取为空', { icon: 2 })
                }
                that.$replace_render_content(index);
              } else {
                bt.msg(res);
              }
            });
            return false
          }
          if (typeof that.data[item.name] === "undefined") active = item.list[0]
          $.each(item.list, function (key, items) {
            if (items.value === item.value || items.value === that.data[item.name]) {
              active = items
              return false
            }
          })
        }
        $.each(item.list, function (key, items) {
          if ($.isArray(item.value)){
            for (var i = 0; i < mulpActive.length; i++) {
              if(mulpActive.indexOf(items.value) > -1) {
                active.value = items.value
              }
            }
          }
          list += '<li class="item item1' + _that.$verify(items.value === active.value ? 'active' : '') + ' ' + (items.disabled ? 'disabled' : '') + '" title="' + items.title + '">\
            <span>' + items.title + '</span>\
            <span class="icon-item-active"></span>\
          </li>';
          option += '<option value="' + items.value + '"' + (items.disabled ? 'disabled' : '') + ' ' + _that.$verify(items.value === active.value ? 'selected' : '') + '>' + items.title + '</option>';
        });
        for (var i = 0; i < item.list.length; i++) {
          if (mulpActive.indexOf(item.list[i].value) > -1) {
            str += '<span class="bt_select_content"><span>'
                + item.list[i].title+ '</span><span class="icon-trem-close"></span></span>'
          }
        }
        var title = !Array.isArray(item.list) ? '获取数据中' : (active ? active.title : item.placeholder)
        return '<div class="bt_multiple_select_updown bt_select_updown mr10 ' + (item.disabled ? 'bt-disabled' : '') + ' ' + + _that.$verify(item['class']) + '" ' + _that.$verify(style, 'style') + ' data-name="' + item.name + '">' +
            '<span class="bt_select_value">'+(item.value.length == 0 ? '<span class="bt_select_content"><span>'
                + (title || item.placeholder) + '</span><span class="icon-trem-close"></span></span>':str)
            + '<div class="icon-down"><svg width="12.000000" height="12.000000" viewBox="0 0 12 5" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><desc>Created with Pixso.</desc><defs></defs><path id="path" d="M0.123291 0.809418L4.71558 5.84385C4.8786 6.02302 5.16846 6.04432 5.33038 5.86389L9.87927 0.783104C10.0412 0.602676 10.04 0.311989 9.87701 0.132816C9.79626 0.0446892 9.68945 0 9.58374 0C9.47693 0 9.36938 0.0459404 9.28827 0.136574L5.02881 4.89284L0.708618 0.15662C0.627869 0.0684967 0.522217 0.0238075 0.415405 0.0238075C0.307434 0.0238075 0.20105 0.0697479 0.119873 0.160381C-0.041626 0.338303 -0.0393677 0.630241 0.123291 0.809418Z" fill-rule="nonzero" fill="#999999"></path></svg></div>\
            </span>' +
            '<ul class="bt_select_list">' + (list || '') + '</ul>' +
            '<select' + attribute + ' class="hide" ' + (item.disabled ? 'disabled' : '') + ' autocomplete="off" multiple>' + (option || '') + '</select>' +
            '<div class="bt_select_list_arrow"></div><div class="bt_select_list_arrow_fff"></div>'+
            '</div>';
      },
      /**
       * @description 渲染二级下拉
       */
      $reader_secondaryMenu: function (item, style, attribute, index) {
        // 规则限制  【通过配置中的data.xx值设置为空，可清除上次选中的内容】
        // 1.不可通过请求数据来渲染
        // 2.至少有一个一级内容，一级下拉不可点击
        var that = this,list = '', active = {};
        $.each(item.list, function (key, items) {
          list += '<li class="item-parent"><div class="item-menu-title" style="'+(function (){
            for(var i=0;i<items.child.length;i++){
              if (items.child[i].value == item.value || items.child[i].value == that.data[item.name]) {
                active = items.child[i]
              }
              if(items.child[i].value === active.value){
                return 'color:#20a53a;'
              }
            }
          })()+'">' + items.title + '</div>' +
              (function () {
                var _con = ''
                if (items.child.length > 0) {
                  _con = '\
                 <svg style="margin-right: 10px;fill:#999999;" width="5.989136" height="10.000000" viewBox="0 0 5.98914 10" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
                 \t<desc>\
                 \t\t\tCreated with Pixso.\
                 \t</desc>\
                 \t<defs/>\
                 \t<path id="path" d="M0.809448 9.87672L5.84387 5.28442C6.02307 5.12138 6.04431 4.83153 5.86389 4.66962L0.783081 0.120728C0.602661 -0.0411835 0.312012 -0.0400543 0.132812 0.122986C0.0446777 0.203751 0 0.310562 0 0.416229C0 0.523041 0.0458984 0.6306 0.136597 0.711746L4.89282 4.97118L0.156616 9.29137C0.0684814 9.37213 0.0238037 9.4778 0.0238037 9.58461C0.0238037 9.69255 0.0697021 9.79898 0.1604 9.88011C0.338257 10.0416 0.630249 10.0394 0.809448 9.87672Z" fill-rule="nonzero" />\
                 </svg><div class="item-menu-body-list">\
								<ul class="">'+ (function () {
                    var str = '';
                    $.each(items.child, function (key, child) {
                      str += '<li class="item-child' + _that.$verify(child.value === active.value ? 'active' : '') + '" title="' + child.title + '" data-value="'+child.value+'"><div class="item-menu-title">' + child.title + '</div></li>'
                    })
                    return str;
                  })() +'</ul></div>';
                }else{ _con = '<span style="top: 0;color: #ccc;">[空]</span>'}
                return _con;
              })()+'</li>';
        })
        return '<div class="bt_select_updown bt_seconday_menu" ' + _that.$verify(style, 'style') + ' data-name="' + item.name + '">\
					<span class="bt_select_value"><span class="bt_select_content">'+(!$.isEmptyObject(active) ? active.title : item.placeholder)+'</span>\
					<div class="icon-down"><svg width="12.000000" height="12.000000" viewBox="0 0 12 5" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><desc>Created with Pixso.</desc><defs></defs><path id="path" d="M0.123291 0.809418L4.71558 5.84385C4.8786 6.02302 5.16846 6.04432 5.33038 5.86389L9.87927 0.783104C10.0412 0.602676 10.04 0.311989 9.87701 0.132816C9.79626 0.0446892 9.68945 0 9.58374 0C9.47693 0 9.36938 0.0459404 9.28827 0.136574L5.02881 4.89284L0.708618 0.15662C0.627869 0.0684967 0.522217 0.0238075 0.415405 0.0238075C0.307434 0.0238075 0.20105 0.0697479 0.119873 0.160381C-0.041626 0.338303 -0.0393677 0.630241 0.123291 0.809418Z" fill-rule="nonzero" fill="#999999"></path></svg></div>\
					</span>\
					<ul class="bt_select_list">' + list + '</ul>\
					<input '+ attribute +' class="hide" value="'+(active.value || '')+'">\
          <div class="bt_select_list_arrow"></div><div class="bt_select_list_arrow_fff"></div>\
					</div>';
      },
      /**
       * @description 替换渲染内容
       */
      $replace_render_content: function (index) {
        var that = this, config = this.config.form[index], html = that.$reader_content_row(index, config);
        $('[data-form=' + that.random + ']').find('.line:eq(' + index + ')').replaceWith(html);
        this.$event_bind()
      },

      /**
       * @description 重新渲染内容
       * @param {object} formConfig 配置
       */
      $again_render_form: function (formConfig) {
        var formElement = $('[data-form=' + this.random + ']'), that = this;
        formConfig = formConfig || this.config.form
        formElement.empty()
        for (var i = 0; i < formConfig.length; i++) {
          var config = formConfig[i]
          // if (config.display === false) continue
          formElement.append(that.$reader_content_row(i, config))
        }
        this.config.form = formConfig
        this.$event_bind()

        // 处理复选框重新渲染第一次点击无效
        formElement.find('.form-checkbox-label').click();
        formElement.find('.form-checkbox-label').click();
      },

      /**
       * @description 事件绑定功能
       * @param {Object} eventList 事件列表
       * @param {Function} callback 回调函数
       * @return void
       */
      $event_bind: function (eventList, callback) {
        var that = this, _event = {};
        that.element = $(typeof eventList === 'object' ? that.element : ('[data-form=' + that.random + ']'));
        _event = eventList
        if (typeof eventList === 'undefined') _event = that.event_list;
        $.each(_event, function (key, item) {
          if ($.isEmptyObject(item)) return true;
          $.each(item, function (keys, items) {
            if (!!item.type) return false;
            if (!items.hasOwnProperty('bind')) {
              items.bind = true
            } else {
              return false
            }
            var childNode = '';
            if (typeof items.cust === "boolean") {
              childNode = '[' + (items.cust ? 'data-' : '') + 'name=' + key + ']';
            } else {
              childNode = '.' + key;
            }
            (function (items, key) {
              if (items.onEvent === false) {
                switch (items.type) {
                  case 'input_checked':
                    $(childNode).on(keys != 'event' ? keys : 'click', function (ev) {
                      items.event.apply(this, [ev, that]);
                    });
                    break;
                }
                return true;
              } else {
                if (items.type === 'select') return true
                that.element.on(keys !== 'event' ? keys : 'click', items.children ? items.children : childNode, function (ev) {
                  var form = that.$get_form_element(true), config = that.form_config[key];
                  switch (items.type) {
                    case 'textarea_tips':
                      $(this).hide().prev().focus();
                      break;
                    case 'custom_select':
                      if ($(this).parent().hasClass('bt-disabled')) return false;
                      var select_value = $(this).next();
                      select_value.parent('.bt_select_updown').css('border', '1px solid rgb(220, 223, 230)')
                      that.element.find('.item-parent').removeClass('down');
                      that.element.find('.bt_select_list,.item-menu-body-list').parent('.bt_select_updown').css('border', '1px solid rgb(220, 223, 230)')
                      if (!select_value.hasClass('show')) {
                        $('.bt_select_list').removeClass('show').css('display', 'none');
                        $('.bt_select_list_arrow').fadeOut(1)
                        $('.bt_select_list_arrow_fff').fadeOut(1)
                      $('.icon_up').remove()
                      $('.icon-down').show()
                        select_value.slideDown('fast');
                        select_value.addClass('show');
                        select_value.prev().append("<div class='icon_up'>" +
                          "<svg width=\"12.000000\" height=\"12.000000\" viewBox=\"0 0 12 12\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n" +
                          "<desc>" +
                          "Created with Pixso." +
                          "</desc>" +
                          "<defs/>" +
                          "<path id=\"path\" d=\"M1.12328 8.19058L5.71558 3.15616C5.87862 2.97699 6.16847 2.95569 6.33038 3.13611L10.8793 8.21689C11.0412 8.39731 11.04 8.68802 10.877 8.86719C10.7962 8.95532 10.6894 9 10.5838 9C10.477 9 10.3694 8.95407 10.2883 8.86343L6.02883 4.10715L1.70864 8.84338C1.62788 8.93152 1.5222 8.9762 1.41539 8.9762C1.30746 8.9762 1.20103 8.93024 1.11988 8.83963C0.958351 8.66171 0.960617 8.36975 1.12328 8.19058Z\" fill-rule=\"nonzero\" fill=\"#999999\"/>\n" +
                          "</svg></div>")
                        select_value.prev().find('.icon-down').hide()
                        select_value.parent('.bt_select_updown').css('border', '1px solid #20A53A')

                        var height = $(this).height()
                        select_value.css('top',(height+12)+'px')
                        $(select_value.siblings()[2]).css('top',(height-4)+'px')
                        $(select_value.siblings()[3]).css('top',(height-3)+'px')
                        $(select_value.siblings()[2]).show()
                        $(select_value.siblings()[3]).show()
                      } else {
                        select_value.parent('.bt_select_updown').css('border', '1px solid rgb(220, 223, 230)')
                        $('.icon_up').remove()
                        $('.icon-down').show()
                        select_value.slideUp('fast');
                        select_value.removeClass('show');
                        $('.bt_select_list_arrow').fadeOut(300)
                        $('.bt_select_list_arrow_fff').fadeOut(300)
                      }
                      $(document).click(function () {
                        that.element.find('.bt_select_list,.item-menu-body-list').slideUp('fast');
                        that.element.find('.bt_select_list,.item-menu-body-list').removeClass('show');
                        that.element.find('.item-parent').removeClass('down');
                        that.element.find('.bt_select_list,.item-menu-body-list').parent('.bt_select_updown').css('border', '1px solid rgb(220, 223, 230)')
                        $('.bt_select_list_arrow').fadeOut(300)
                        $('.bt_select_list_arrow_fff').fadeOut(300)
                        $('.icon_up').remove()
                        $('.icon-down').show()
                        $(this).unbind('click');
                        return false;
                      });
                      return false;
                      break;
                    case 'custom_select_item':
                      config = that.form_config[$(this).parents('.bt_select_updown').attr('data-name')]
                      var item_config = config.list[$(this).index()]
                      var item = $(this).parent().find('.item'),arry = [],_html = '',mulpVal = []
                      if ($(this).hasClass('disabled')) {
                        $(this).parent().removeClass('show');
                        if (item_config.tips) layer.msg(item_config.tips, { icon: 2 });
                        return true;
                      }
                      if (!$(this).hasClass('active') && !$(this).hasClass('disabled')) {
                        var value = item_config.value.toString();
                        $(this).parent().prev().find('.bt_select_content').text($(this).text());
                        $(this).parent().prev().find('.bt_select_content').prop('title',$(this).text());
                        if (config.type != "multipleSelect"){
                          $(this).addClass('active').siblings().removeClass('active');
                          $(this).parent().next().val(value)
                          $(this).parent().slideUp('fast');
                          $(this).parent().removeClass('show');
                          $('.bt_select_list_arrow').fadeOut(200)
                          $('.bt_select_list_arrow_fff').fadeOut(200)
                        } else{
                          $(this).addClass('active')
                        }
                      }else{
                        if (config.type == "multipleSelect"){
                          // if($(this).parent().find('.active').length <= 1) return layer.msg('最少选择一个！！！')
                          $(this).removeClass('active')
                        }
                      }
                      if(config.type == "multipleSelect"){
                        for (var i = 0; i < item.length; i++) {
                          if (item.eq(i).hasClass('active')) {
                            arry.push(item.eq(i).text().trim().replace(/\s/g,""))
                          }
                        }
                        for (var i = 0; i < config.list.length; i++) {
                          if(arry.indexOf(config.list[i].title.trim().replace(/\s/g,"")) > -1){
                            mulpVal.push(config.list[i].value)
                          }
                        }
                        if (arry.length == 0) {
                          _html += '<span class="bt_select_content_def">'+config.placeholder+'</span>'
                        }else{
                          $(this).parent().prev().find('.bt_select_content_def').remove()
                          for (var i = 0; i < arry.length; i++) {
                            _html += '<span class="bt_select_content"><span>' + arry[i] + '</span><span class="icon-trem-close"></span></span>'
                          }
                        }
                        $(this).parent().prev().find('.bt_select_content').remove()
                        $(this).parent().prev().find('.icon-down').before(_html)
                        $(this).parent().next().val(mulpVal)
                        var height = $(this).parent().parent().parent().height()
                        $(this).parent().parent().parent().parent().siblings().css({'height':height+'px','line-height':height+'px'})
                        $(this).parent().css('top',(height+12)+'px')
                        $('.bt_select_list_arrow_fff').css('top',(height-3)+'px')
                        $('.bt_select_list_arrow').css('top',(height-4)+'px')
                      }
                      $('.icon-trem-close').click(function () {
                        var str = $(this).siblings().text().trim().replace(/\s/g,"")
                        for (var i = 0; i < item.length; i++) {
                          if (str == item.eq(i).prop('title')) {
                            item.eq(i).click()
                          }
                        }
                        return false
                      })
                      that.data[config.name] = config.type == "multipleSelect" ? mulpVal : value
                      if (items.event) items.event = null
                      if (config.change) items.event = config.change
                      ev.stopPropagation()
                      break;
                    case 'icon_trem_close':
                      var str = $(this).siblings().text().trim().replace(/\s/g,""),
                          item = $(this).parent().parent().siblings('.bt_select_list').find('.item')
                      for (var i = 0; i < item.length; i++) {
                        if (str == item.eq(i).prop('title')) {
                          item.eq(i).click()
                        }
                      }
                      return false
                      break
                    case 'secondary_menu_parent':
                      $('.item-menu-title').removeAttr('style')
                      $(this).addClass('down').siblings().removeClass('down').find('.item-menu-body-list').removeClass('show')
                      $(this).siblings().children('svg').css('fill','#999999')
                      $('.down').children('svg').css('fill','#666666')
                      if ($(this).find('.item-menu-body-list').length > 0) {
                        $(this).find('.item-menu-body-list').addClass('show').parent().siblings().find('.item-menu-body-list').removeClass('show')
                      }
                      ev.stopPropagation()
                      break;
                    case 'secondary_menu_child':
                      var _value = $(this).attr('data-value')
                      config = that.form_config[$(this).parents('.bt_select_updown').attr('data-name')]
                      that.data[config.name] = _value
                      if (items.event) items.event = null
                      if (config.change) items.event = config.change
                      ev.stopPropagation()
                      break;
                    case 'select_path':
                      bt.select_path('event_' + $(this).prev().attr('name') + '_' + that.random, items.select || "", !items.callback || items.callback.bind(that), items.defaultPath || "");
                      break;
                    case 'checkbox':
                      var checked = $(this).is(':checked');
                      if (checked) {
                        $(this).prev().addClass('active');
                      } else {
                        $(this).prev().removeClass('active');
                      }
                      break;
                  }
                  if (items.event) items.event.apply(this, [that.$get_form_value(), form, that, config, ev]); // 事件
                  if (items.added) items.added.apply(this, [ev, config, form]);
                });
              }
            }(items, key));
          });
        });
        if (callback) callback();
      },

      /**
       * @description 获取表单数据
       * @return {object} 表单数据
       */
      $get_form_value: function () {
        var form = {},ev = this.element
        ev.find('input,textarea[disabled="disabled"]').each(function (index, item) {
          var val = $(this).val();
          if ($(this).attr('type') === 'checkbox') { val = $(this).prop('checked') }
          if ($(this).attr('type') === 'radio') { val =ev.find('input[name='+$(this).attr('name')+']:radio:checked').val() }
          form[$(this).attr('name')] = val
        })
        return $.extend({}, ev.serializeObject(), form)
      },

      /**
       * @description 设置指定数据
       *
       */
      $set_find_value: function (name, value) {
        var config = {}, that = this;
        typeof name != 'string' ? config = name : config[name] = value;
        $.each(config, function (key, item) {
          that.form_element[key].val(item);
        });
      },

      /**
       * @description 获取Form，jquery节点
       * @param {Boolean} afresh 是否强制刷新
       * @return {object}
       */
      $get_form_element: function (afresh) {
        var form = {},
            that = this;
        if (afresh || $.isEmptyObject(that.form_element)) {
          this.element.find(':input').each(function (index) {
            form[$(this).attr('name')] = $(this);
          });
          that.form_element = form;
          return form;
        } else {
          return that.form_element;
        }
      },

      /**
       * @description 验证值整个列表是否存在，存在则转换成属性字符串格式
       */
      $verify_group: function (config, group) {
        var that = this,
            str = '';
        $.each(group, function (index, item) {
          if (typeof config[item] === "undefined") return true;
          if (['disabled', 'readonly'].indexOf(item) > -1) {
            str += ' ' + (config[item] ? (item + '="' + item + '"') : '');
          } else {
            str += ' ' + item + '="' + config[item] + '"';
          }
        });
        return str;
      },

      /**
       * @description 验证绑定事件
       * @param {String} value
       */
      $verify_bind_event: function (eventName, row, group) {
        var event_list = {};
        $.each(group, function (index, items) {
          var event_fun = row[items];
          if (event_fun) {
            if (typeof event_list[eventName] === "object") {
              if (!Array.isArray(event_list[eventName])) event_list[eventName] = [event_list[eventName]];
              event_list[eventName].push({
                event: event_fun,
                eventType: items
              });
            } else {
              event_list[eventName] = {
                event: event_fun,
                eventType: items
              };
            }
          }
        });
        return event_list;
      },

      /**
       * @description 验证值是否存在
       * @param {String} value 内容/值
       * @param {String|Boolean} attr 属性
       * @param {String} type 属性
       */
      $verify: function (value, attr, type) {
        if (!value) return '';
        if (type === true) return value ? ' ' + attr : '';
        if (type === 'style') return attr ? attr + ':' + value + ';' : value;
        return attr ? ' ' + attr + '="' + value + '"' : ' ' + value;
      },
      /**
       * @description 验证form表单
       */
      $verify_form: function () {
        var form_list = {}, form = this.config.form, form_value = this.$get_form_value(), form_element = this.$get_form_element(true),is_verify = true
        for (var key = 0; key < form.length; key++) {
          var item = form[key];
          if (!Array.isArray(item.group)) item.group = [item.group];
          if (item.separate) continue
          for (var i = 0; i < item.group.length; i++) {
            var items = item.group[i], name = items.name;
            if (items.type === 'help') continue;
            if (typeof items.verify == 'function') {
              var is_verify = items.verify(form_value[name], form_element[name], items, true);
              is_verify = typeof is_verify == "boolean"?false:true
            }
          }
        }
        if(!is_verify) return is_verify
        return form_value;
      },
      /**
       * @description 提交内容，需要传入url
       * @param {Object|Function} param 附加参数或回调函数
       * @param {Function} callback 回调
       */
      $submit: function (param, callback, tips) {
        var form = this.$verify_form();
        if (typeof param === "function") tips = callback, callback = param, param = {};
        if (!form) return false;
        form = $.extend(form, param);
        if (typeof this.config.url == "undefined") {
          bt_tools.msg('请求提交地址不能为空！', false);
          return false;
        }
        bt_tools.send({
          url: this.config.url,
          data: form
        }, function (res) {
          if (callback) {
            callback(res, form);
          } else {
            bt_tools.msg(res);
          }
        }, (tips || '提交中'));
      }
    }
    return new ReaderForm(config);
  },
  /**
   * @description tab切换，支持三种模式
   * @param {object} config
   * @return 当前实例对象
   */
  tab: function (config) {
    var _that = this;

    function ReaderTab(config) {
      this.config = config;
      this.theme = this.config.theme || {};
      this.$load();
    }

    ReaderTab.prototype = {
      type: 1,
      theme_list: [
        {
          content: 'tab-body',
          nav: 'tab-nav',
          body: 'tab-con',
          active: 'on',
        },
        {
          content: 'bt-w-body',
          nav: 'bt-w-menu',
          body: 'bt-w-con',
        },
      ],
      random: bt.get_random(5),
      $init: function () {
        var that = this,
          active = this.config.active,
          config = that.config.list,
          _theme = {};
        this.$event_bind();
        if (config[that.active].success) config[that.active].success();
        config[that.active]['init'] = true;
      },
      $load: function () {
        var that = this;
      },
      $reader_content: function () {
        var that = this,
          _list = that.config.list,
          _tab = '',
          _tab_con = '',
          _theme = that.theme,
          config = that.config;
        if (typeof that.active === 'undefined') that.active = 0;
        if (!$.isEmptyObject(config.theme)) {
          _theme = this.theme_list[that.active];
          $.each(config.theme, function (key, item) {
            if (_theme[key]) _theme[key] += ' ' + item;
          });
          that.theme = _theme;
        }
        if (config.type && $.isEmptyObject(config.theme)) this.theme = this.theme_list[that.active];
        $.each(_list, function (index, item) {
          var active = that.active === index,
            _active = _theme['active'] || 'active';
          _tab += '<span class="' + (active ? _active : '') + '">' + item.title + '</span>';
          _tab_con += '<div class="tab-block ' + (active ? _active : '') + '">' + (active ? item.content : '') + '</div>';
        });
        that.element = $(
          '<div id="tab_' +
          that.random +
          '" class="' +
          _theme['content'] +
          _that.$verify(that.config['class']) +
          '"><div class="' +
          _theme['nav'] +
          '" >' +
          _tab +
          '</div><div class="' +
          _theme['body'] +
          '">' +
          _tab_con +
          '</div></div>'
        );
        return that.element[0].outerHTML;
      },
      /**
       * @description 事件绑定
       *
       */
      $event_bind: function () {
        var that = this,
          _theme = that.theme,
          active = _theme['active'] || 'active';
        if (!that.el) that.element = $('#tab_' + that.random);
        that.element.on('click', '.' + _theme['nav'].replace(/\s+/g, '.') + ' span', function () {
          var index = $(this).index(),
            config = that.config.list[index];
          $(this).addClass(active).siblings().removeClass(active);
          $('#tab_' + that.random + ' .' + _theme['body'] + '>div:eq(' + index + ')')
            .addClass(active)
            .siblings()
            .removeClass(active);
          that.active = index;
          if (!config.init) {
            // console.log(_theme)
            $('#tab_' + that.random + ' .' + _theme['body'] + '>div:eq(' + index + ')').html(config.content);
            if (config.success) config.success();
            config.init = true;
          }
        });
      },
    };
    return new ReaderTab(config);
  },
  /**
   * @description loading过渡
   * @param {*} title
   * @param {*} is_icon
   * @return void
   */
  load: function (title) {
    var random = bt.get_random(5),
      layel = $(
        '<div class="layui-layer layui-layer-dialog layui-layer-msg layer-anim" id="' +
        random +
        '" type="dialog" style="z-index: 99891031;"><div class="layui-layer-content layui-layer-padding"><i class="layui-layer-ico layui-layer-ico16"></i>正在' +
        title +
        '，请稍候...</div><span class="layui-layer-setwin"></span></div><div class="layui-layer-shade" id="layer-mask-' +
        random +
        '" times="17" style="z-index:99891000; background-color:#000; opacity:0.3; filter:alpha(opacity=30);"></div>'
      ),
      mask = '',
      loadT = '';
    $('body').append(layel);
    var win = $(window),
      msak = $('.layer-loading-mask'),
      layel = $('#' + random);
    layel.css({top: (win.height() - 64) / 2, left: (win.width() - 320) / 2});
    if (title === true) loadT = layer.load();
    return {
      close: function () {
        if (typeof loadT == 'number') {
          layer.close(loadT);
        } else {
          $('body')
            .find('#' + random + ',#layer-mask-' + random)
            .remove();
        }
      },
    };
  },
  /**
   * @description 弹窗方法，有默认的参数和重构的参数
   * @param {object} config  和layer参数一致
   * @require 当前关闭弹窗方法
   */
  open: function (config) {
    var _config = {},
      layerT = null,
      form = null;
    _config = $.extend({type: 1, area: '640px', closeBtn: 2, btn: ['确认', '取消']}, config);
    if (typeof _config.content == 'object') {
      var param = _config.content;
      form = bt_tools.form(param);
      _config.success = function (layero, indexs) {
        form.$event_bind();
        // $(layero).find('input[type="text"],textarea').each(function () {
        //   var name = $(this).attr('name');
        //   $(this).val(form.data[name]);
        // });
        if (typeof config.success != 'undefined') config.success(layero, indexs, form);
      };
      _config.yes = function (indexs, layero) {
        var form_val = form.$verify_form();
        if (!form_val) return false;
        if (typeof config.yes != 'undefined') {
          var yes = config.yes.apply(form, [form_val, indexs, layero]);
          if (!yes) return false;
        }
      };
      _config.content = form.$reader_content();
    }
    layerT = layer.open(_config);
    return {
      close: function () {
        layer.close(layerT);
      },
      form: form,
    };
  },
  /**
   * @description 封装msg方法
   * @param {object|string} param1 配置参数,请求方法参数
   * @param {number} param2 图标ID
   * @require 当前关闭弹窗方法
   */
  msg: function (param1, param2) {
    var layerT = null,
      msg = '',
      config = {};
    if (typeof param1 === 'object') {
      if (typeof param1.status === 'boolean') {
        (msg = param1.msg), (config = {icon: param1.status ? 1 : 2});
        if (!param1.status) config = $.extend(config, {
          time: !param2 ? 0 : 3000,
          closeBtn: 2,
          shade: 0.3,
          shadeClose: true
        });
      }
    }
    if (typeof param1 === 'string') {
      (msg = param1),
        (config = {
          icon: typeof param2 !== 'undefined' ? param2 : 1,
          shadeClose: true,
        });
    }
    layerT = layer.msg(msg, config);
    return {
      close: function () {
        layer.close(layerT);
      },
    };
  },

  /**
   * @description 成功提示
   * @param {string} msg 信息
   */
  success: function (msg) {
    this.msg({msg: msg, status: true});
  },

  /**
   * @description 错误提示
   * @param {string} msg 信息
   */
  error: function (msg) {
    this.msg({msg: msg, status: false});
  },
  /**
   * @description 请求封装
   * @param {string|object} conifg ajax配置参数/请求地址
   * @param {function|object} callback 回调函数/请求参数
   * @param {function} callback1 回调函数/可为空
   * @returns void 无
   */
  send: function (param1, param2, param3, param4, param5, param6) {
    var params = {},
      success = null,
      error = null,
      config = [],
      param_one = '';
    $.each(arguments, function (index, items) {
      config.push([items, typeof items]);
    });

    function diff_data(i) {
      try {
        success = config[i][1] == 'function' ? config[i][0] : null;
        error = config[i + 1][1] == 'function' ? config[i + 1][0] : null;
      } catch (error) {
      }
    }

    param_one = config[0];
    switch (param_one[1]) {
      case 'string':
        $.each(config, function (index, items) {
          var value = items[0],
            type = items[1];
          if (index > 1 && (type == 'boolean' || type == 'string' || type == 'object')) {
            var arry = param_one[0].split('/');
            params['url'] = '/' + arry[0] + '?action=' + arry[1];
            if (type == 'object') {
              params['load'] = value.load;
              params['verify'] = value.verify;
              if (value.plugin) params['url'] = '/plugin?action=a&name=' + arry[0] + '&s=' + arry[1];
            } else if (type == 'string') {
              params['load'] = value;
            }
            return false;
          } else {
            params['url'] = param_one[0];
          }
        });
        if (config[1][1] === 'object') {
          params['data'] = config[1][0];
          diff_data(2);
        } else {
          diff_data(1);
        }
        break;
      case 'object':
        params['url'] = param_one[0].url;
        params['data'] = param_one[0].data || {};
        $.each(config, function (index, items) {
          var value = items[0],
            type = items[1];
          if (index > 1 && (type == 'boolean' || type == 'string' || type == 'object')) {
            switch (type) {
              case 'object':
                params['load'] = value.load;
                params['verify'] = value.verify;
                break;
              case 'string':
                params['load'] = value;
                break;
            }
            return true;
          }
        });
        if (config[1][1] === 'object') {
          params['data'] = config[1][0];
          diff_data(2);
        } else {
          diff_data(1);
        }
        break;
    }
    if (params.load) params.load = this.load(params.load);
    $.ajax({
      type: params.type || 'POST',
      url: params.url,
      data: params.data || {},
      dataType: params.dataType || 'JSON',
      complete: function (res) {
        if (params.load) params.load.close();
      },
      success: function (res) {
        if (typeof params.verify == 'boolean' && !params.verify) {
          if (success) success(res);
          return false;
        }
        if (typeof res === 'string') {
          layer.msg(res, {
            icon: 2,
            time: 0,
            closeBtn: 2,
          });
          return false;
        }
        if (params.batch) {
          if (success) success(res);
          return false;
        }
        if (res.status === false && (res.hasOwnProperty('msg') || res.hasOwnProperty('error_msg'))) {
          if (error) {
            error(res);
          } else {
            bt_tools.msg({status: res.status, msg: !res.hasOwnProperty('msg') ? res.error_msg : res.msg});
          }
          return false;
        }

        if (params.tips) {
          bt_tools.msg(res);
        }
        if (success) success(res);
      },
    });
  },

  /**
   * @description 命令行输入
   */
  command_line_output: function (config) {
    var _that = this,
      uuid = bt.get_random(15);

    /**
     * @description 渲染
     * @param config
     * @return {object}
     * @constructor
     */
    function ReaderCommand(config) {
      var that = this;
      for (var key in _that.commandConnectionPool) {
        var item = _that.commandConnectionPool[key],
          element = $(item.config.el);
        if (config.shell === item.config.shell && element.length) {
          item.el = element;
          return item;
        }
      }
      if (typeof config === 'undefined') config = {};
      this.config = $.extend({route: '/sock_shell'}, config);
      this.xterm_config = $.extend(this.xterm_config, this.config.xterm);
      this.el = $(this.config.el);
      this.open = config.open;
      this.close = config.close;
      this.message = config.message;
      if (!this.config.hasOwnProperty('el')) {
        _that.msg({msg: '请输入选择器element，不可为空', status: false});
        return false;
      }
      if (!this.config.hasOwnProperty('shell')) {
        _that.msg({msg: '请输入命令，不可为空', status: false});
        return false;
      }
      if (this.config.hasOwnProperty('time')) {
        setTimeout(function () {
          that.close_connect();
        }, this.config.time);
      }
      this.init();
    }

    ReaderCommand.prototype = {
      socket: null, //websocket 连接保持的对象
      socketToken: null,
      timeout: 0, // 连接到期时间，为0代表永久有效
      monitor_interval: 2000,
      element_detection: null,
      uuid: uuid,
      fragment: [],
      error: 0, // 错误次数，用于监听元素内容是否还存在
      retry: 0, // 重试次数
      forceExit: false, // 强制断开连接
      /**
       * @description 程序初始化
       */
      init: function () {
        var oldUUID = bt.get_cookie('commandInputViewUUID'),
          that = this;
        if (!this.el[0]) {
          if (this.error > 10) return false;
          setTimeout(function () {
            that.init();
            this.error++;
          }, 2000);
          return false;
        }
        this.error = 0;
        if (this.el[0].localName !== 'pre') {
          this.el.append('<pre class="command_output_pre"></pre>');
          this.el = this.el.find('pre');
          this.config.el = this.config.el + ' pre';
        } else {
          this.el.addClass('command_output_pre');
        }
        if (Array.isArray(this.config.area)) {
          this.el.css({width: this.config.area[0], height: this.config.area[1]});
        } else {
          this.el.css({width: '100%', height: '100%'});
        }
        if (oldUUID && typeof _that.commandConnectionPool[oldUUID] != 'undefined') {
          _that.commandConnectionPool[oldUUID].close_connect();
          delete _that.commandConnectionPool[oldUUID];
        }
        bt.set_cookie('commandInputViewUUID', this.uuid);
        this.element_detection = setInterval(function () {
          if (!$(that.config.el).length) {
            clearInterval(that.element_detection);
            that.forceExit = true;
            that.close_connect();
          }
        }, 1 * 60 * 1000);
        this.set_full_screen();
        this.create_websocket_connect(this.config.route, this.config.shell);
        this.monitor_element();
      },
      /**
       * @description 创建websocket连接
       * @param {string} url websocket连接地址
       * @param {string} shell 需要传递的命令
       */
      create_websocket_connect: function (url, shell) {
        var that = this;
        this.socket = new WebSocket((location.protocol === 'http:' ? 'ws://' : 'wss://') + location.host + url);
        this.socket.addEventListener('open', function (ev) {
          if (!this.socketToken) {
            var _token = document.getElementById('request_token_head').getAttribute('token');
            this.socketToken = {'x-http-token': _token};
          }
          this.send(JSON.stringify(this.socketToken));
          this.send(shell);
          if (that.open) that.open();
          that.retry = 0;
        });
        this.socket.addEventListener('close', function (ev) {
          if (!that.forceExit) {
            // console.log(ev.code,that.retry)
            if (ev.code !== 1000 && that.retry <= 10) {
              that.socket = that.create_websocket_connect(that.config.route, that.config.shell);
              that.retry++;
            }
            if (that.close) that.close(ev);
          }
        });
        this.socket.addEventListener('message', function (ws_event) {
          var result = ws_event.data;
          if (!result) return;
          that.refresh_data(result);
          if (that.message) that.message(result);
        });
        return this.socket;
      },

      /**
       * @description 设置全屏视图
       */
      set_full_screen: function () {
        // 1
      },

      htmlEncodeByRegExp: function (str) {
        if (str.length == 0) return '';
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/ /g, '&nbsp;')
          .replace(/\'/g, '&#39;')
          .replace(/\"/g, '&quot;')
          .replace(/\(/g, '&#40;')
          .replace(/\)/g, '&#41;')
          .replace(/`/g, '&#96;')
          .replace(/=/g, '＝');
      },

      /**
       * @description 刷新Pre数据
       * @param {object} data 需要插入的数据
       */
      refresh_data: function (data) {
        var rdata = this.htmlEncodeByRegExp(data);
        this.el = $(this.config.el);
        if (!this.el) return false;
        this.fragment.push(rdata);
        if (this.fragment.length >= 300) {
          this.fragment.splice(0, 150);
          this.el.html(this.fragment.join(''));
        } else {
          this.el.append(rdata);
        }
        if (this.el[0]) {
          this.el.scrollTop(this.el[0].scrollHeight);
        }
      },

      /**
       * @description 监听元素状态，判断是否移除当前的ws连接
       *
       */
      monitor_element: function () {
        var that = this;
        this.monitor_interval = setInterval(function () {
          if (!that.el.length) {
            that.close_connect();
            clearInterval(that.monitor_interval);
          }
        }, that.config.monitorTime || 2000);
      },

      /**
       * @description 断开命令响应和websocket连接
       */
      close_connect: function () {
        this.forceExit = true;
        this.socket.close();
        delete _that.commandConnectionPool[this.uuid];
      },
    };
    this.commandConnectionPool[uuid] = new ReaderCommand(config);
    return this.commandConnectionPool[uuid];
  },

  /**
   * @description 清理验证提示样式
   * @param {object} element  元素节点
   */
  $clear_verify_tips: function (element) {
    element.removeClass('bt-border-error bt-border-sucess');
    layer.close('tips');
  },

  /**
   * @description 验证提示
   * @param {object} element  元素节点
   * @param {string} tips 警告提示
   * @return void
   */
  $verify_tips: function (element, tips, is_error) {
    if (typeof is_error === 'undefined') is_error = true;
    element.removeClass('bt-border-error bt-border-sucess').addClass(is_error ? 'bt-border-error' : 'bt-border-sucess');
    element.focus();
    layer.tips('<span class="inlineBlock">' + tips + '</span>', element, {
      tips: [1, is_error ? 'red' : '#20a53a'],
      time: 3000,
      area: element.width()
    });
  },
  /**
   * @description 验证值是否存在
   * @param {String} value 内容/值
   * @param {String|Boolean} attr 属性
   * @param {String} type 属性
   */
  $verify: function (value, attr, type) {
    if (!value) return '';
    if (type === true) return value ? ' ' + attr : '';
    if (type === 'style') return attr ? attr + ':' + value + ';' : value;
    return attr ? ' ' + attr + '="' + value + '"' : ' ' + value;
  },

  /**
   * @description 批量操作的结果
   * @param {*} config
   */
  $batch_success_table: function (config) {
    var _that = this,
      length = $(config.html).length;
    bt.open({
      type: 1,
      title: config.title,
      area: config.area || ['350px', '350px'],
      shadeClose: false,
      closeBtn: 2,
      content:
        config.content ||
        '<div class="batch_title"><span class><span class="batch_icon"></span><span class="batch_text">' +
        config.title +
        '操作完成！</span></span></div><div class="' +
        (length > 4 ? 'fiexd_thead' : '') +
        ' batch_tabel divtable" style="margin: 15px 30px 15px 30px;overflow: auto;height: 200px;"><table class="table table-hover"><thead><tr><th>' +
        config.th +
        '</th><th style="text-align:right;width:120px;">操作结果</th></tr></thead><tbody>' +
        config.html +
        '</tbody></table></div>',
      success: function () {
        if (length > 4) _that.$fixed_table_thead('.fiexd_thead');
      },
    });
  },
  /**
   * @description 固定表头
   * @param {string} el DOM选择器
   * @return void
   */
  $fixed_table_thead: function (el) {
    $(el).scroll(function () {
      var scrollTop = this.scrollTop;
      this.querySelector('thead').style.transform = 'translateY(' + (scrollTop - 1) + 'px)';
    });
  },
  /**
   * @description 插件视图设置
   * @param {object|string} layid dom元素或layer_id
   * @param {object} config 插件宽度高度或其他配置
   */
  $piugin_view_set: function (layid, config) {
    var element = $(typeof layid === 'string' ? '#layui-layer' + layid : layid).hide(),
      win = $(window);
    setTimeout(function () {
      var width = config.width || element.width(),
        height = config.height || element.height();
      element.css($.extend(config, {
        left: (win.width() - width) / 2,
        top: (win.height() - height) / 2
      })).addClass('custom_layer');
    }, 50);
    setTimeout(function () {
      element.show();
    }, 500);
  },
  /**
   * @description 简化版nps
   */
  nps: function (config) {
    var html = '\
      <div>\
         <div class="nps-star pd20" style="padding-top: 30px">\
            <div>\
              <div class="time-keeping" style="position: absolute;top: 4px;right: 28px;color: #999999;"><span style="color:red;">15&nbsp;</span>秒后自动关闭</div>\
              <div style="font-size: 14px;text-align: left;color: #000;">您对【' + config.name + '】功能的满意程度？</div>\
              <div class="star-container">\
                <div class="star">\
                  <div class="star-icon">\
                      <svg width="30" height="30" data-attr="1" style="color: #cccccc" viewBox="0 0 152.249 145.588" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
                        <desc>\
                          Created with Pixso.\
                        </desc>\
                        <defs/>\
                        <path id="矢量 104" d="M68.5163 5.52759L56.0289 43.9553C54.9577 47.2512 51.8863 49.4829 48.4207 49.4829L8.01495 49.4844C0.265564 49.4844 -2.95648 59.4011 3.31281 63.9564L36.0008 87.7075C38.8045 89.7446 39.9776 93.3553 38.9068 96.6514L26.4222 135.08C24.0278 142.45 32.4632 148.579 38.7328 144.024L71.4227 120.275C74.2265 118.239 78.0229 118.239 80.8267 120.275L113.517 144.024C119.786 148.579 128.222 142.45 125.827 135.08L113.343 96.6514C112.272 93.3553 113.445 89.7446 116.249 87.7075L148.937 63.9563C155.206 59.4011 151.984 49.4844 144.234 49.4844L103.829 49.4829C100.363 49.4829 97.2916 47.2512 96.2205 43.9553L83.7331 5.52759C81.3381 -1.84253 70.9113 -1.84253 68.5163 5.52759Z" \
                          fill-rule="evenodd" \
                          fill="currentColor"\
                        />\
                      </svg>\
                  </div>\
                  <div class="star-title" style="color: #FFFFFF">很不满意</div>\
                </div>\
                <div class="star">\
                  <div class="star-icon">\
                      <svg width="30" height="30" data-attr="2" style="color: #cccccc" viewBox="0 0 152.249 145.588" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
                        <desc>\
                          Created with Pixso.\
                        </desc>\
                        <defs/>\
                        <path id="矢量 104" d="M68.5163 5.52759L56.0289 43.9553C54.9577 47.2512 51.8863 49.4829 48.4207 49.4829L8.01495 49.4844C0.265564 49.4844 -2.95648 59.4011 3.31281 63.9564L36.0008 87.7075C38.8045 89.7446 39.9776 93.3553 38.9068 96.6514L26.4222 135.08C24.0278 142.45 32.4632 148.579 38.7328 144.024L71.4227 120.275C74.2265 118.239 78.0229 118.239 80.8267 120.275L113.517 144.024C119.786 148.579 128.222 142.45 125.827 135.08L113.343 96.6514C112.272 93.3553 113.445 89.7446 116.249 87.7075L148.937 63.9563C155.206 59.4011 151.984 49.4844 144.234 49.4844L103.829 49.4829C100.363 49.4829 97.2916 47.2512 96.2205 43.9553L83.7331 5.52759C81.3381 -1.84253 70.9113 -1.84253 68.5163 5.52759Z" \
                          fill-rule="evenodd" \
                          fill="currentColor"\
                        />\
                      </svg>\
                  </div>\
                  <div class="star-title" style="color: #FFFFFF">不满意</div>\
                </div>\
                <div class="star">\
                  <div class="star-icon">\
                      <svg width="30" height="30" data-attr="3" style="color: #cccccc" viewBox="0 0 152.249 145.588" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
                        <desc>\
                          Created with Pixso.\
                        </desc>\
                        <defs/>\
                        <path id="矢量 104" d="M68.5163 5.52759L56.0289 43.9553C54.9577 47.2512 51.8863 49.4829 48.4207 49.4829L8.01495 49.4844C0.265564 49.4844 -2.95648 59.4011 3.31281 63.9564L36.0008 87.7075C38.8045 89.7446 39.9776 93.3553 38.9068 96.6514L26.4222 135.08C24.0278 142.45 32.4632 148.579 38.7328 144.024L71.4227 120.275C74.2265 118.239 78.0229 118.239 80.8267 120.275L113.517 144.024C119.786 148.579 128.222 142.45 125.827 135.08L113.343 96.6514C112.272 93.3553 113.445 89.7446 116.249 87.7075L148.937 63.9563C155.206 59.4011 151.984 49.4844 144.234 49.4844L103.829 49.4829C100.363 49.4829 97.2916 47.2512 96.2205 43.9553L83.7331 5.52759C81.3381 -1.84253 70.9113 -1.84253 68.5163 5.52759Z" \
                          fill-rule="evenodd" \
                          fill="currentColor"\
                        />\
                      </svg>\
                  </div>\
                  <div class="star-title" style="color: #FFFFFF">一般</div>\
                </div>\
                <div class="star">\
                  <div class="star-icon">\
                      <svg width="30" height="30" data-attr="4" style="color: #cccccc" viewBox="0 0 152.249 145.588" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
                        <desc>\
                          Created with Pixso.\
                        </desc>\
                        <defs/>\
                        <path id="矢量 104" d="M68.5163 5.52759L56.0289 43.9553C54.9577 47.2512 51.8863 49.4829 48.4207 49.4829L8.01495 49.4844C0.265564 49.4844 -2.95648 59.4011 3.31281 63.9564L36.0008 87.7075C38.8045 89.7446 39.9776 93.3553 38.9068 96.6514L26.4222 135.08C24.0278 142.45 32.4632 148.579 38.7328 144.024L71.4227 120.275C74.2265 118.239 78.0229 118.239 80.8267 120.275L113.517 144.024C119.786 148.579 128.222 142.45 125.827 135.08L113.343 96.6514C112.272 93.3553 113.445 89.7446 116.249 87.7075L148.937 63.9563C155.206 59.4011 151.984 49.4844 144.234 49.4844L103.829 49.4829C100.363 49.4829 97.2916 47.2512 96.2205 43.9553L83.7331 5.52759C81.3381 -1.84253 70.9113 -1.84253 68.5163 5.52759Z" \
                          fill-rule="evenodd" \
                          fill="currentColor"\
                        />\
                      </svg>\
                  </div>\
                  <div class="star-title" style="color: #FFFFFF">满意</div>\
                </div>\
                <div class="star">\
                  <div class="star-icon">\
                      <svg width="30" height="30" data-attr="5" style="color: #cccccc" viewBox="0 0 152.249 145.588" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
                        <desc>\
                          Created with Pixso.\
                        </desc>\
                        <defs/>\
                        <path id="矢量 104" d="M68.5163 5.52759L56.0289 43.9553C54.9577 47.2512 51.8863 49.4829 48.4207 49.4829L8.01495 49.4844C0.265564 49.4844 -2.95648 59.4011 3.31281 63.9564L36.0008 87.7075C38.8045 89.7446 39.9776 93.3553 38.9068 96.6514L26.4222 135.08C24.0278 142.45 32.4632 148.579 38.7328 144.024L71.4227 120.275C74.2265 118.239 78.0229 118.239 80.8267 120.275L113.517 144.024C119.786 148.579 128.222 142.45 125.827 135.08L113.343 96.6514C112.272 93.3553 113.445 89.7446 116.249 87.7075L148.937 63.9563C155.206 59.4011 151.984 49.4844 144.234 49.4844L103.829 49.4829C100.363 49.4829 97.2916 47.2512 96.2205 43.9553L83.7331 5.52759C81.3381 -1.84253 70.9113 -1.84253 68.5163 5.52759Z" \
                          fill-rule="evenodd" \
                          fill="currentColor"\
                        />\
                      </svg>\
                  </div>\
                  <div class="star-title" style="color: #FFFFFF">非常满意</div>\
                </div>\
              </div>\
              <div class="nps-content">\
                  <textarea style="width: 100%;height: 100px;" placeholder="您对' + config.name + '有什么改进的方向和建议?"></textarea>\
              </div>'+
              (config.name === '网站' ? '<div class="mtb10 c6">如遇BUG问题请联系QQ群：<a class="btlink" title="宝塔面板交流群-2群" href="https://qm.qq.com/cgi-bin/qm/qr?k=pDI9rilMP7Bcf8NcXlk_9ar3_sTLEuaZ&jump_from=webapi&authKey=jLsyfgvmymKrdZrhWRAr3bTn8DkPA/PsqQ+cWw17PvbaKPcy+SteMP8ZmGVZW3yL" target="_blank">435590797</a></div>' : '')
            +
            '<div class="nps-submit">\
                <button class="btn btn-sm btn-success" style="width: 100%;height: 38px;">提交反馈</button>\
              </div>\
            </div>\
         </div>\
      </div>'
    var score = 0; 

    /**
     * @description 切换星星颜色
     */
    function switchColor() {
      var _index = $(this).data('attr');
      score = _index;
      $(this).parents('.star-container').find('.star-icon svg').each(function (index, item) {
        if (index < _index) {
          if (_index <= 2) {
            $(item).css('color', '#EF0808')
          } else if (_index <= 3) {
            $(item).css('color', '#F0AD4E')
          }
          if (_index >= 4) $(item).css('color', '#20A53A')
        } else {
          $(item).css('color', '#cccccc')
        }
      })
    }

    /**
     * @description 文字颜色
     * @param index
     * @param _index
     * @param item
     */
    function textColor(index, _index, item) {
      if (index == (_index - 1)) {
        if (_index <= 2) {
          $(item).parent().next().css(
            {
              'color': '#EF0808',
              'background-color': 'rgba(239, 8, 8, 0.05)',
              'border': '1px solid rgb(239 8 8 / 26%)',
            })
        } else if (_index <= 3) {
          $(item).parent().next().css(
            {
              'color': '#f7be56',
              'background-color': 'rgb(247 190 86 / 17%)',
              'border': '1px solid rgb(247 190 86 / 26%)',
            })
        } else {
          $(item).parent().next().css(
            {
              'color': '#69be3d',
              'background-color': 'rgb(105 190 61 / 17%)',
              'border': '1px solid rgb(105 190 61 / 26%)',
            })
        }
      } else {
        $(item).parent().next().removeAttr('style')
      }
    }

    /**
     * @description 移除星星鼠标移入移出
     */
    function selectRemoveHover() {
      var _index = $(this).data('attr');
      $(this).parents('.star-container').find('.star-icon svg').each(function (index, item) {
        textColor(index, _index, item);
      })
    }

    var timeOutIndex = null;
    var close = false
    /**
     * @description 鼠标移入星星
     * @param layero
     */
    function starHover(layero) {
      $('.nps-content textarea').removeClass('textarea-error')
      $('.nps-content textarea').next().remove()
      layero.find('.nps-star .star-icon svg').hover(function () {
        clearTimeout(timeOutIndex)
        var that = this
        var _index = $(this).data('attr');
        $(this).parent().next().show()
        $(this).parents('.star-container').find('.star-icon svg').each(function (index, item) {
          textColor(index, _index, item);
          if (index < _index) {
            if (_index <= 2) {
              $(item).css('color', '#ed6d68')
            } else if (_index <= 3) {
              $(item).css('color', '#f7be56')
            }
            if (_index >= 4) $(item).css('color', '#69be3d')
          } else {
            $(item).css('color', '#cccccc')
          }
        })
      }, function () {
        switchColor.call(this);
      })
    }

    var index = layer.open({
      type: 1,
      content: html,
      area: ['310px'],
      title: '',
      id:'nps',
      shade:0,
      cancel:function (index, layero) {
        close = true
        $('.nps-submit button').click()
      },
      success: function (layero, index) {
        layero.find('.nps-star .star-icon svg').parents('.star-container').find('.star-icon svg').each(function (index, item) {
          if(index== 0){
            $(item).parent().next().css(
              {
                'color': '#EF0808',
                'background-color': 'rgba(239, 8, 8, 0.05)',
                'border': '1px solid rgb(239 8 8 / 26%)',
              })
          }
          if(index == 2){
            $(item).parent().next().css(
              {
                'color': '#f7be56',
                'background-color': 'rgb(247 190 86 / 17%)',
                'border': '1px solid rgb(247 190 86 / 26%)',
              })
          }
          if(index == 4){
            $(item).parent().next().css(
              {
                'color': '#69be3d',
                'background-color': 'rgb(105 190 61 / 17%)',
                'border': '1px solid rgb(105 190 61 / 26%)',
              })
          }
        })
        var tiem = 15;
        var time_index = setInterval(function () {
          tiem--;
          if (tiem == 0) {
            close = true
            $('.nps-submit button').click()
            clearInterval(time_index)
          }
          $('.time-keeping').html('<span style="color: red">'+tiem+'</span>&nbsp;' + '秒后自动关闭')
        }, 1000)
        $('.time-keeping')
        layero.hover(function () {
          clearInterval(time_index)
          $('.time-keeping').hide()
        })
        starHover(layero);
        $('.nps-content textarea').focus(function () {
          if (score != 0) {
            $('.nps-star .star-icon svg').unbind('mouseenter').unbind('mouseleave')
          }
        })
        $('.nps-content textarea').blur(function () {
          starHover(layero);
        })
        $('.nps-star .star-icon svg').click(function () {
          selectRemoveHover.call(this);
          switchColor.call(this);
          var _index = $(this).data('attr');
          $('.nps-content textarea').focus();
        })

        function submitNPS(_data,success) {
          bt_tools.send({url: 'config?action=write_nps_new', data: _data}, function (res) {
            layer.close(index)
            if (res.status && success) {
              layer.open({
                title: false,
                btn: false,
                shadeClose: true,
                shade: 0.1,
                closeBtn: 0,
                skin: 'qa_thank_dialog',
                area: '230px',
                content: '<div class="qa_thank_box" style="background-color:#F1F9F3;text-align: center;padding: 20px 0;"><img src="/static/img/feedback/QA_like.png" style="width: 55px;"><p style="margin-top: 15px;">感谢您的参与!</p></div>',
                success: function (layero, index) {
                  $(layero).find('.layui-layer-content').css({
                    'padding': '0',
                    'border-radius': '5px'
                  })
                  $(layero).css({
                    'border-radius': '5px',
                    'min-width': '230px'
                  })
                  setTimeout(function () {
                    layer.close(index)
                  }, 3000)
                }
              })
            }
          })
        }

        bt_tools.send({
          url: 'config?action=get_nps_new',
          data: {version: -1, product_type: config.type}
        }, function (res) {
          var data = res.msg[0];
          var question = {}
          $('.nps-submit button').click(function () {
            question[data.id]=$('.nps-content textarea').val()
            var _data = {
              rate: score,
              product_type: config.type,
              software_name: config.soft,
              questions: JSON.stringify(question)
            }
            if(close){
              _data.rate = 0
              submitNPS(_data,false);
            }else {
              if(score == 0){
                layer.msg('打个分数再提交吧，麻烦您了~', {
                  icon: 0
                })
                return false;
              }
              if ($('.nps-content textarea').val() == '') {
                $('.nps-content textarea').addClass('textarea-error').focus();
                if ($('.nps-content textarea').next().length == 0) {
                  $('.nps-content textarea').after('<span style="color: red;position: absolute;top: 222px;left: 22px;">请填写下您的建议再提交吧，麻烦您了~</span>')
                }
              } else {
                $('.nps-content textarea').css('border', '1px solid #ccc')
                $('.nps-content textarea').next().remove()
                submitNPS(_data,true);
              }
            }
          })
        })
      }
    })
  }
};
setTimeout(function () {
  $.fn.serializeObject = function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    return this.serializeArray().reduce(function (data, pair) {
      if (!hasOwnProperty.call(data, pair.name)) {
        data[pair.name] = pair.value;
      }
      return data;
    }, {});
  };
}, 300);

function arryCopy(arrys) {
  var list = arrys.concat(),
    arry = [];
  for (var i = 0; i < list.length; i++) {
    arry.push($.extend(true, {}, list[i]));
  }
  return arry;
}
