$('.footer').css({
  'position': 'inherit',
  'padding-left': '180px'
});  //日报悬浮调整
var controlObj = {
  // 监控
  conTrolView: {
    init: function () {
      var that = this;
      var networkType = bt.get_cookie('network-unitType')
      if (!networkType) {
        bt.set_cookie('network-unitType', 'KB/s')
        networkType = 'KB/s'
      }
      var diskType = bt.get_cookie('disk-unitType')
      if (!diskType) {
        bt.set_cookie('disk-unitType', 'KB/s')
        diskType = 'KB/s'
      }

      $(".network-unit .picker-text-list").text(networkType);
      $(".disk-unit .picker-text-list").text(diskType);
      $(".network-unit .select-list-item li:contains(" + networkType + ")").addClass("active");
      $(".disk-unit .select-list-item :contains(" + diskType + ")").addClass("active");
      $(".bt-crontab-select-button").on('click', '.select-picker-search', function () {
        $(this).next().toggle();
        if ($(this).parent().hasClass('network-unit')) {
          $(".disk-unit .select-list-item").hide();
        } else {
          $(".network-unit .select-list-item").hide();
        }
      });
      $(".bt-crontab-select-button").on('click', '.select-list-item li', function () {
        var _button = $(this).parents('.bt-crontab-select-button');
        $(this).addClass('active').siblings().removeClass('active');
        _button.find('.picker-text-list').text($(this).text());
        _button.find(".select-list-item").toggle();
        var cookie_type = $(this).parents('.bgw').find('.searcTime .time_range_submit').attr('data-type');
        setCookie(cookie_type + '-unitType', $(this).attr('data-attr'));
        $(this).parents('.bgw').find('.searcTime .gt.on').click();
      });
      // 默认显示7天周期图表
      setTimeout(function () {
        that.Wday(0, 'getload');
      }, 500);

      setTimeout(function () {
        that.Wday(0, 'cpu');
      }, 500);

      setTimeout(function () {
        that.Wday(0, 'mem');
      }, 1000);

      setTimeout(function () {
        that.Wday(0, 'disk');
      }, 1500);

      setTimeout(function () {
        that.Wday(0, 'network');
      }, 2000);

      $('.btime').val(that.get_today() + ' 00:00:00');
      $('.etime').val(that.get_today() + ' 23:59:59');

      that.GetStatus();
			controlObj.conTrolView.handle_click_time()
    },

		// 点击时间选择事件
		handle_click_time:function(){
			var that = this
			$(".st").hover(function () {
				$(this).next().show();
			}, function () {
				$(this).next().hide();
				$(this).next().hover(function () {
					$(this).show();
				}, function () {
					$(this).hide();
				})
			});

			$('.btime').val(that.get_today() + ' 00:00:00');
			$('.etime').val(that.get_today() + ' 23:59:59');

			$(".searcTime .gt").click(function () {
				$(this).addClass("on").siblings().removeClass("on");
				$(this).siblings('.ss').children('.on').removeClass('on');
			});

			$('.time_range_submit').click(function () {
				$(this).parents(".searcTime").find("span").removeClass("on");
				$(this).parents(".searcTime").find(".st").addClass("on");
				var b = (new Date($(this).parent().find(".btime").val()).getTime()) / 1000;
				var e = (new Date($(this).parent().find(".etime").val()).getTime()) / 1000;
				b = Math.round(b);
				e = Math.round(e);
				var type = $(this).attr('data-type')
				var callback = that[type]
				if (callback) callback(b, e);
			});
		},
    // 指定天数
    Wday: function (day, name) {
      var data = this.get_date(day);
      var b = data.b;
      var e = data.e;
      switch (name) {
        case "cpu":
          this.cpu(b, e);
          break;
        case "mem":
          this.mem(b, e);
          break;
        case "disk":
          this.disk(b, e);
          break;
        case "network":
          this.network(b, e);
          break;
        case "getload":
          this.getload(b, e);
          break;
      }
      //处理日报页面resize导致监控页图表没有重绘
      var event = document.createEvent("HTMLEvents");
      event.initEvent("resize", true, true);
      window.dispatchEvent(event);
    },

    get_date: function (day) {
      var now = Math.floor((new Date().getTime()) / 1000);
      var b = 0;
      var e = now;
      if (day == 0) {
        b = (new Date(this.get_today() + " 00:00:00").getTime()) / 1000;
      } else if (day == 1) {
        b = (new Date(this.get_before_date(day) + " 00:00:00").getTime()) / 1000;
        e = (new Date(this.get_before_date(day) + " 23:59:59").getTime()) / 1000;
      } else {
        b = (new Date(this.get_before_date(day - 1) + " 00:00:00").getTime()) / 1000;
      }
      b = Math.floor(b);
      e = Math.floor(e);
      return {
        b: b,
        e: e
      }
    },

    get_today: function () {
      var mydate = new Date();
      return bt.format_data(mydate.getTime() / 1000, 'yyyy/MM/dd');
    },

    get_before_date: function (day) {
      var now = new Date(this.get_today());
      var now_time = now.getTime();
      var before_days_time = (now_time - (day * 24 * 3600 * 1000)) / 1000;
      return bt.format_data(before_days_time, 'yyyy/MM/dd');
    },

    //取监控状态
    GetStatus: function () {

      loadT = layer.msg(lan.public.read, { icon: 16, time: 0 })
      $.post('/config?action=SetControl', 'type=-1', function (rdata) {
        layer.close(loadT);
        if (rdata.status) {
          $("#openJK").html("<input class='btswitch btswitch-ios' id='ctswitch' type='checkbox' checked><label class='btswitch-btn' for='ctswitch' onclick='controlObj.conTrolView.SetControl()'></label>")
        }
        else {
          $("#openJK").html("<input class='btswitch btswitch-ios' id='ctswitch' type='checkbox'><label class='btswitch-btn' for='ctswitch' onclick='controlObj.conTrolView.SetControl()'></label>")
        }
        $("#saveDay").val(rdata.day)
      })
    },

    //设置监控状态
    SetControl: function (act) {
      var day = new Number($("#saveDay").val() || 0)
      if (day < 1) {
        layer.msg(lan.control.save_day_err, { icon: 2 });
        return;
      }
      if (act) {
        var type = $("#ctswitch").prop('checked') ? '1' : '0';
      } else {
        var type = $("#ctswitch").prop('checked') ? '0' : '1';
      }

      loadT = layer.msg(lan.public.the, { icon: 16, time: 0 })
      if(!/^-?\d+$/.test(day)){
        return layer.msg('保存天数必须为整数',{icon:2,time:2000});
      }
      $.post('/config?action=SetControl', {type:type,day:day}, function (rdata) {
        layer.close(loadT);
        layer.msg(rdata.msg, { icon: rdata.status ? 1 : 2 });
      });
    },

    // 清理记录
    CloseControl: function () {
      bt.show_confirm(lan.control.close_log, lan.control.close_log_msg, function () {
        loadT = layer.msg(lan.public.the, { icon: 16, time: 0 })
        $.post('/config?action=SetControl', 'type=del', function (rdata) {
          layer.close(loadT);
          $.get('/system?action=ReWeb');
          layer.msg(rdata.msg, { icon: rdata.status ? 1 : 2 });
          setTimeout(function () {
            location.reload();
          }, 2000);
        });
      });
    },

    // 字节单位转换MB
    ToSizeG: function (bytes) {
      var c = 1024 * 1024;
      var b = 0;
      if (bytes > 0) {
        var b = (bytes / c).toFixed(2);
      }
      return b;
    },

    /**
     * 获取默认echart配置
     */
    get_default_option: function (startTime, endTime) {
      var interval = ((endTime - startTime) / 3) * 1000;
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          bottom: 80
        },
        xAxis: {
          type: 'time',
          boundaryGap: ['1%', '0%'],
          minInterval: interval,
          axisLine: {
            lineStyle: {
              color: "#666"
            }
          },
          axisLabel: {
            formatter: function (value) {
              return bt.format_data(value / 1000, 'MM/dd\nhh:mm');
            }
          }
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
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100,
            zoomLock: true
          },
          {
            bottom: 10,
            start: 0,
            end: 100,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ]
      }
    },

    /**
     * 补全数据
     * @param {*} rdata
     */
    set_data: function (data, startTime, endTime) {
      if (data.length <= 0) return;
      var time;
      // var min = data[0];
      // min.addtime = min.addtime.replace(/([0-9]{2}\/[0-9]{2}).{1}[0-9:]*/, '$1 00:00');
      // data.unshift(min);
      // for (var key in data[0]) {
      //   if (key == 'addtime') continue;
      //   data[0][key] = 0;
      // }

      for (var i = 0; i < data.length; i++) {
        if (typeof data[i].addtime === "number") continue;
        time = this.get_time(data[i].addtime, data[data.length - 1].addtime);
        data[i].addtime = time;
      }
    },

    get_time: function (date, endDate) {
      var endMonth = endDate.split(' ')[0].split('/');
      endMonth = parseInt(endMonth);
      var today = new Date();
      var str = date.split(' ');
      var dateStr = str[0].split('/');
      var timeStr = str[1].split(':');
      var month = parseInt(dateStr[0]);
      var year = today.getFullYear();
      var toMonth = today.getMonth()+1;   //当前月份
      if (month > toMonth || (month == 12 && month == endMonth)) {
        year -= 1;
      }
      var newDate = new Date(year, month - 1, dateStr[1], timeStr[0], timeStr[1]);
      return newDate.getTime();
    },

    cpuTopData:{},
    //cpu
    cpu: function (b, e) {
      var _that = this;
      var that = controlObj.conTrolView;
      $.get('/ajax?action=GetCpuIo&start=' + b + '&end=' + e, function (rdata) {
        that.set_data(rdata, b, e);
        var myChartCpu = echarts.init(document.getElementById('cpuview'));
        var xData = [];
        var yData = [];
        //var zData = [];
        if (rdata.length > 0) {
          for (var i = 0; i < rdata.length; i++) {
            var item = rdata[i]
            yData.push([item.addtime, item.pro]);
            if(_that.cpuTopData === undefined) _that.cpuTopData = {};
            _that.cpuTopData[item.addtime] = item.cpu_top;
          }
          var startTime = rdata[0].addtime / 1000;
          var endTime = rdata[rdata.length - 1].addtime / 1000;
          var option = that.get_cpu_option(startTime, endTime, yData);
					var fullchart;
					if(document.getElementById('fullchart-cpu')){
						fullchart = echarts.init(document.getElementById('fullchart-cpu'))
						// 外部图表与内部保持一致
						option.tooltip.confine = true; // 让悬浮框只显示在可视区域内
						fullchart.setOption(option)
					}
					// 点击全屏
					$('.full-screen-cpu').unbind('click').click(function(e){
						layer.open({
							title:'全屏查看-CPU',
							type:1,
							closeBtn:1,
							area:['100%','100%'],
							content:'<div class="time_title title c6 plr15"></div><div id="fullchart-cpu" style="width:100%;height:92%"></div>"',
							success:function(layers){
									var fullchart = echarts.init(document.getElementById('fullchart-cpu'))
									option.tooltip.confine = true;
									fullchart.setOption(option)
									$(layers).find('.time_title').html($('.cpu-title').html())
									// 移除全屏展示按钮
									$(layers).find('.full-screen-cpu').remove()
									controlObj.conTrolView.handle_click_time()
							},cancel:function(layers){
								// 初始化外部图表
								$('.cpu-title .searcTime').children().eq(2).click()
							}
						})
						e.preventDefault()
						e.stopPropagation()
					})
          myChartCpu.setOption(option);
          window.addEventListener("resize", function () {
            myChartCpu.resize();
          });
        }
      });
    },

    /**
     * 获取cpu图表配置
     */
    get_cpu_option: function (startTime, endTime, yData) {
      var that = this;
      var option = this.get_default_option(startTime, endTime);
      option.tooltip.formatter = function (config) {
        var legendList = '';
        for (var i = 0; i < config.length; i++) {
          var item = config[i];
          legendList += '<div class="select-data"><span class="status" style="background-color: '+ item.color +'"></span><span>'+ item.seriesName + '：' + item.data[1].toFixed(2) +'%</span></div>'
        }
        return that.echarts_formatter({
          time: config[0].axisValueLabel,
          data: that.cpuTopData[config[0].axisValue],
          legend: legendList
        })
      };
      option.tooltip.padding = 0;
      option.tooltip.backgroundColor = 'rgba(255,255,255,0.95)';
      option.tooltip.borderColor = '#eee';
      option.tooltip.position = function (pos, params, dom, rect, size) {
        return that.echarts_position('cpuview',{pos:pos,size:size})
      }
      option.yAxis.name = lan.public.pre;
      option.yAxis.min = 0;
      option.yAxis.max = 100;
      option.series = [
        {
          name: 'CPU',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          showSymbol: false,
          itemStyle: {
            normal: {
              color: 'rgb(0, 153, 238)'
            }
          },
          data: yData
        }
      ];
      return option;
    },

    memTopData:{},
    //内存
    mem: function (b, e) {
      var _that = this;
      var that = controlObj.conTrolView;
      $.get('/ajax?action=GetCpuIo&start=' + b + '&end=' + e, function (rdata) {
        that.set_data(rdata, b, e);
        var myChartMen = echarts.init(document.getElementById('memview'));
        var xData = [];
        //var yData = [];
        var zData = [];
        if (rdata.length > 0) {
          for (var i = 0; i < rdata.length; i++) {
            var item = rdata[i]
            // xData.push(rdata[i].addtime);
            // yData.push(rdata[i].pro);
            // zData.push(rdata[i].mem);
            zData.push([rdata[i].addtime, rdata[i].mem]);
            if(_that.memTopData === undefined) _that.memTopData = {};
            _that.memTopData[item.addtime] = item.memory_top;
          }
          var startTime = rdata[0].addtime / 1000;
          var endTime = rdata[rdata.length - 1].addtime / 1000;
          option = that.get_mem_option(startTime, endTime, zData);
					var fullchart;
					if(document.getElementById('fullchart-mem')){
						fullchart = echarts.init(document.getElementById('fullchart-mem'))
						option.tooltip.confine = true; // 限定悬浮框区域
						fullchart.setOption(option)
					}
					// 点击全屏
					$('.full-screen-mem').unbind('click').click(function(e){
						layer.open({
							title:'全屏查看-内存',
							type:1,
							closeBtn:1,
							area:['100%','100%'],
							content:'<div class="time_title title c6 plr15"></div><div id="fullchart-mem" style="width:100%;height:92%"></div>"',
							success:function(layers){
									var fullchart = echarts.init(document.getElementById('fullchart-mem'))
									option.tooltip.confine = true;
									fullchart.setOption(option)
									$(layers).find('.time_title').html($('.mem-title').html())
									// 移除全屏展示按钮
									$(layers).find('.full-screen-mem').remove()
									controlObj.conTrolView.handle_click_time()
							},cancel:function(layers){
								$('.mem-title .searcTime').children().eq(2).click()
							}
						})
						e.preventDefault()
						e.stopPropagation()
					})
          myChartMen.setOption(option);
          window.addEventListener("resize", function () {
            myChartMen.resize();
          });
        }
      })
    },

    /**
     * 获取mem图表配置
     */
    get_mem_option: function (startTime, endTime, zData) {
      var that = this;
      var option = this.get_default_option(startTime, endTime);
      option.tooltip.formatter = function (config) {
        var legendList = '';
        for (var i = 0; i < config.length; i++) {
          var item = config[i];
          legendList += '<div class="select-data"><span class="status" style="background-color: '+ item.color +'"></span><span>'+ item.seriesName + '：' + item.data[1].toFixed(2) +'%</span></div>'
        }
        return that.echarts_formatter({
          time: config[0].axisValueLabel,
          data: that.memTopData[config[0].axisValue],
          table:[
            {title:'PID', width:'40px', index: 1},
            {title:'进程名', index: 2},
            {title:'内存占用', index: 0, unit:function (val){
                return bt.format_size(val)
              }},
            {title:'启动用户', index: 4},
          ],
          legend: legendList
        })
      };
      option.tooltip.padding = 0;
      option.tooltip.backgroundColor = 'rgba(255,255,255,0.95)';
      option.tooltip.borderColor = '#eee';
      option.tooltip.position = function (pos, params, dom, rect, size) {
        return that.echarts_position('memview',{pos:pos,size:size})
      }
      option.yAxis.name = lan.public.pre;
      option.yAxis.min = 0;
      option.yAxis.max = 100;
      option.series = [
        {
          name: lan.index.process_mem,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          showSymbol: false,
          itemStyle: {
            normal: {
              color: 'rgb(0, 153, 238)'
            }
          },
          data: zData
        }
      ];
      return option;
    },

    diskTopData:{},
    //磁盘io
    disk: function (b, e) {
      var _that = this;
      var that = controlObj.conTrolView;
      $.get('/ajax?action=GetDiskIo&start=' + b + '&end=' + e, function (rdata) {
        that.set_data(rdata, b, e);
        var diskview = document.getElementById('diskview'), myChartDisk = echarts.init(diskview), rData = [], wData = [], xData = [],zData = [],yData = [], unit_size = 1, _unit = getCookie('disk-unitType');
        $(diskview).next().removeClass('hide').addClass('show');
        switch (_unit) {
          case 'MB/s':
            unit_size = 1024;
            break;
          case 'GB/s':
            unit_size = 1024 * 1024;
            break;
          default:
            unit_size = 1;
            break;
        }

        var is_gt_MB = false;
        var is_gt_GB = false;
        for (var i = 0; i < rdata.length; i++) {
          var item = rdata[i];
          var read = (rdata[i].read_bytes / 1024).toFixed(3);
          var write = (rdata[i].write_bytes / 1024).toFixed(3);
          // rData.push(read / unit_size);
          // wData.push(write / unit_size);
          // xData.push(rdata[i].addtime);

          rData.push([rdata[i].addtime, read / unit_size]);
          wData.push([rdata[i].addtime, write / unit_size]);
          yData.push([rdata[i].addtime,rdata[i].read_count + rdata[i].write_count]);
          zData.push([rdata[i].addtime,rdata[i].read_time + rdata[i].write_time]);
          if(_that.diskTopData === undefined) _that.diskTopData = {};
          _that.diskTopData[item.addtime] = item.disk_top;
          var read_MB = read / 1024;
          var write_MB = write / 1024;
          if ((read_MB >= 1 || write_MB >= 1) && !is_gt_MB) {
            is_gt_MB = true;
          }
          if (is_gt_MB) {
            var read_GB = read_MB / 1024;
            var write_GB = write_MB / 1024;
            if ((read_GB >= 1 || write_GB >= 1) && !is_gt_GB) {
              is_gt_GB = true;
            }
          }
        }
        if (!is_gt_GB) {
          $('#diskview').next().find('.select-list-item li').eq(2).hide();
        } else {
          $('#diskview').next().find('.select-list-item li').eq(2).show();
        }
        if (!is_gt_MB) {
          $('#diskview').next().find('.select-list-item li').eq(1).hide();
        } else {
          $('#diskview').next().find('.select-list-item li').eq(1).show();
        }
        if (rdata.length > 0) {
          var startTime = rdata[0].addtime / 1000;
          var endTime = rdata[rdata.length - 1].addtime / 1000;
          var option = that.get_disk_option(_unit, startTime, endTime, rData, wData,zData,yData);
					var fullchart;
					if(document.getElementById('fullchart-disk')){
						fullchart = echarts.init(document.getElementById('fullchart-disk'))
						option.tooltip.confine = true; // 限定悬浮框区域
						fullchart.setOption(option)
					}
					// 点击全屏
					$('.full-screen-disk').unbind('click').click(function(e){
						layer.open({
							title:'全屏查看-磁盘',
							type:1,
							closeBtn:1,
							area:['100%','100%'],
							content:'<div class="time_title title c6 plr15"></div><div id="fullchart-disk" style="width:100%;height:92%"></div>"',
							success:function(layers){
									var fullchart = echarts.init(document.getElementById('fullchart-disk'))
									option.tooltip.confine = true;
									fullchart.setOption(option)
									$(layers).find('.time_title').html($('.disk-title').html())
									// 移除全屏展示按钮
									$(layers).find('.full-screen-disk').remove()
									controlObj.conTrolView.handle_click_time()
							},cancel:function(layers){
								$('.disk-title .searcTime').children().eq(2).click()
							}
						})
						e.preventDefault()
						e.stopPropagation()
					})
          myChartDisk.setOption(option);
          window.addEventListener("resize", function () {
            myChartDisk.resize();
          });
        }
      })
    },

    /**
     * 获取磁盘IO图表配置
     */
    get_disk_option: function (unit, startTime, endTime, rData, wData,zData,yData) {
      var that = this;
      var option = this.get_default_option(startTime, endTime);

      option.tooltip.formatter = function (config) {
        var legendList = '';
        for (var i = 0; i < config.length; i++) {
          var item = config[i],_unit = '';
          if(item.seriesName === '读写次数') _unit = '次/s'
          if(item.seriesName === '读写延迟') _unit = 'ms'
          if(item.seriesName === '读取' || item.seriesName === '写入') _unit = unit
          legendList += '<div class="select-data">' +
              '<span class="status" style="background-color: '+ item.color +'"></span>' +
              '<span>'+ item.seriesName + '：' + item.data[1].toFixed(2) + ' ' + _unit +'</span>' +
              '</div>'
        }
        return that.echarts_formatter({
          time: config[0].axisValueLabel,
          data: that.diskTopData[config[0].axisValue],
          width: '470px',
          table:[
            {title: 'PID', width: '40px',index:3},
            {title: '进程名',width: '50px', index: 4},
            {title: '磁盘占用', index: 0, unit:function (val){
                return bt.format_size(val);
              }},
            {title: '读取', index: 1, unit:function (val){
                return bt.format_size(val);
              }},
            {title: '写入', index: 2, unit:function (val){
                return bt.format_size(val);
              }},
            {title: '启动用户', index: 6},
          ],
          legend: legendList
        })
      };


      option.tooltip.padding = 0;
      option.tooltip.backgroundColor = 'rgba(255,255,255,0.95)';
      option.tooltip.borderColor = '#eee';
      option.tooltip.position = function (pos, params, dom, rect, size) {
        return that.echarts_position('diskview',{pos:pos,size:size})
      }
      option.legend = {
        top: '18px',
        data: ['读取', '写入','读写次数','读写延迟']
      };
      option.series = [
        {
          name: '读取',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          showSymbol: false,
          itemStyle: {
            normal: {
              color: 'rgb(255, 70, 131)'
            }
          },
          data: rData
        },
        {
          name: '写入',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          showSymbol: false,
          itemStyle: {
            normal: {
              color: 'rgba(46, 165, 186, .7)'
            }
          },
          data: wData
        }
        ,
        {
          name: '读写次数',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          showSymbol: false,
          itemStyle: {
            normal: {
              color: 'rgba(30, 144, 255)'
            }
          },
          data: yData
        }
        ,
        {
          name: '读写延迟',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          showSymbol: false,
          itemStyle: {
            normal: {
              color: 'rgba(255, 140, 0)'
            }
          },
          data: zData
        }
      ];
      return option;
    },

    //网络Io
    network: function (b, e) {
      var that = controlObj.conTrolView;
      $.get('/ajax?action=GetNetWorkIo&start=' + b + '&end=' + e, function (rdata) {
        that.set_data(rdata, b, e);
        var anetwork = document.getElementById('network'), myChartNetwork = echarts.init(anetwork), aData = [], bData = [], cData = [], dData = [], xData = [], yData = [], zData = [], unit_size = 1, _unit = getCookie('network-unitType'), network_io = [{ title: '全部', value: 'all' }], network_select = $('[name="network-io"]'), network_html = '<option value="">全部</option>', is_network = 0, network_io_key = bt.get_cookie('network_io_key') || '';
        $(anetwork).next().removeClass('hide').addClass('show');
        switch (_unit) {
          case 'MB/s':
            unit_size = 1024;
            break;
          case 'GB/s':
            unit_size = 1024 * 1024;
            break;
          default:
            unit_size = 1;
            break;
        }
        network_select.unbind('change').change(function () {
          bt.set_cookie('network_io_key', $(this).val());
          that.network(b, e);
        }).removeClass('hide').addClass('show');

        var is_gt_MB = false;
        var is_gt_GB = false;
        for (var i = 0; i < rdata.length; i++) {
          var items = rdata[i];
          if (is_network < 1 && typeof items.down_packets === 'object') {
            for (var key in items.down_packets) {
              network_html += '<option value="' + key + '" ' + (network_io_key === key ? 'selected' : '') + '>' + key + '</option>';
            }
            network_select.html(network_html);
            is_network++;
          }
          if (typeof network_io_key != 'undefined' && network_io_key != '') {
            if (typeof items.down_packets === 'object') {
              // zData.push(items.down_packets[network_io_key] / unit_size);
              zData.push([items.addtime, items.down_packets[network_io_key] / unit_size]);
            } else {
              // zData.push(0);
              zData.push([items.addtime, 0]);
            }
          } else {
            // zData.push(items.down / unit_size);
            zData.push([items.addtime, items.down / unit_size]);
          }
          if (typeof network_io_key != 'undefined' && network_io_key != '') {
            if (typeof items.up_packets === 'object') {
              // yData.push(items.up_packets[network_io_key] / unit_size);
              yData.push([items.addtime, items.up_packets[network_io_key] / unit_size]);
            } else {
              // yData.push(0);
              yData.push([items.addtime, 0]);
            }
          } else {
            // yData.push(items.up / unit_size);
            yData.push([items.addtime, items.up / unit_size]);
          }
          var up_MB = items.up / 1024;
          var down_MB = items.down / 1024;
          if ((up_MB >= 1 || down_MB >= 1) && !is_gt_MB) {
            is_gt_MB = true;
          }
          if (is_gt_MB) {
            var up_GB = up_MB / 1024;
            var down_GB = down_MB / 1024;
            if ((up_GB >= 1 || down_GB >= 1) && !is_gt_GB) {
              is_gt_GB = true;
            }
          }
          // xData.push(items.addtime);
        }
        if (!is_gt_GB) {
          $('#network').next().find('.select-list-item li').eq(2).hide();
        } else {
          $('#network').next().find('.select-list-item li').eq(2).show();
        }
        if (!is_gt_MB) {
          $('#network').next().find('.select-list-item li').eq(1).hide();
        } else {
          $('#network').next().find('.select-list-item li').eq(1).show();
        }
        if (rdata.length > 0) {
          var startTime = rdata[0].addtime / 1000;
          var endTime = rdata[rdata.length - 1].addtime / 1000;
          var option = that.get_network_option(_unit, startTime, endTime, yData, zData);
					var fullchart;
					if(document.getElementById('fullchart-net')){
						fullchart = echarts.init(document.getElementById('fullchart-net'))
						option.tooltip.confine = true; // 限定悬浮框区域
						fullchart.setOption(option)
					}
					// 点击全屏
					$('.full-screen-net').unbind('click').click(function(e){
						layer.open({
							title:'全屏查看-网络IO',
							type:1,
							closeBtn:1,
							area:['100%','100%'],
							content:'<div class="time_title title c6 plr15"></div><div id="fullchart-net" style="width:100%;height:92%"></div>"',
							success:function(layers){
									var fullchart = echarts.init(document.getElementById('fullchart-net'))
									option.tooltip.confine = true;
									fullchart.setOption(option)
									$(layers).find('.time_title').html($('.net-title').html())
									// 移除全屏展示按钮
									$(layers).find('.full-screen-net').remove()
									controlObj.conTrolView.handle_click_time()
									$(layers).find('select[name="network-io"]').unbind('change').change(function () {
										bt.set_cookie('network_io_key', $(this).val());
										that.network(b, e);
									}).removeClass('hide').addClass('show');
							},cancel:function(layers){
								$('.net-title .searcTime').children().eq(2).click()
							}
						})
						e.preventDefault()
						e.stopPropagation()
					})
          myChartNetwork.setOption(option);
          window.addEventListener("resize", function () {
            myChartNetwork.resize();
          });
        }
      })
    },

    /**
     * 获取网络IO图表配置
     */
    get_network_option: function (unit, startTime, endTime, yData, zData) {
      var that = this;
      var option = this.get_default_option(startTime, endTime);
      option.tooltip.formatter = function (config) {
        var data = config[0];
        var time = data.data[0];
        var date = bt.format_data(time / 1000);
        var _tips = '';
        for (var i = 0; i < config.length; i++) {
          var item = config[i]
          _tips += '<div class="select-data">' +
              '<span class="status" style="background-color: '+ item.color +'"></span>' +
              '<span>'+ item.seriesName +'：'+ item.data[1].toFixed(3) +' '+ unit +'</span>' +
              '</div>'
        }
        return that.echarts_formatter({
          width:'280px',
          time: config[0].axisValueLabel,
          legend: _tips
        })
      };
      option.tooltip.padding = 0;
      option.tooltip.backgroundColor = 'rgba(255,255,255,0.95)';
      option.tooltip.borderColor = '#eee';
      option.tooltip.position = function (pos, params, dom, rect, size) {
        return that.echarts_position('network',{pos:pos,size:size})
      }
      option.legend = {
        top: '18px',
        data: [lan.index.net_up, lan.index.net_down]
      };
      option.series = [
        {
          name: lan.index.net_up,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          showSymbol: false,
          itemStyle: {
            normal: {
              color: 'rgb(255, 140, 0)'
            }
          },
          data: yData
        },
        {
          name: lan.index.net_down,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          showSymbol: false,
          itemStyle: {
            normal: {
              color: 'rgb(30, 144, 255)'
            }
          },
          data: zData
        }
      ];
      return option;
    },

    //负载
    getload_old: function (b, e) {
      $.get('/ajax?action=get_load_average&start=' + b + '&end=' + e, function (rdata) {
        var myChartgetload = echarts.init(document.getElementById('getloadview'));
        var aData = [];
        var bData = [];
        var xData = [];
        var yData = [];
        var zData = [];


        for (var i = 0; i < rdata.length; i++) {
          xData.push(rdata[i].addtime);
          yData.push(rdata[i].pro);
          zData.push(rdata[i].one);
          aData.push(rdata[i].five);
          bData.push(rdata[i].fifteen);
        }
        var interval = ((e - b) / 3) * 1000;
        option = {
          tooltip: {
						trigger: 'axis',
						confine:true // 限定悬浮框区域
          },
          calculable: true,
          legend: {
            data: ['系统资源使用率', '1分钟', '5分钟', '15分钟'],
            selectedMode: 'single',
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xData,
            minInterval: interval,
            axisLine: {
              lineStyle: {
                color: "#666"
              }
            }
          },
          yAxis: {
            type: 'value',
            name: '',
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
          },
          dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100,
            zoomLock: true
          }, {
            start: 0,
            end: 100,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }],
          series: [
            {
              name: '系统资源使用率',
              type: 'line',
              smooth: true,
              showSymbol: true,
              symbol: 'circle',
              sampling: 'average',
              itemStyle: {
                normal: {
                  color: 'rgb(255, 140, 0)'
                }
              },
              data: yData
            },
            {
              name: '1分钟',
              type: 'line',
              smooth: true,
              showSymbol: true,
              symbol: 'circle',
              sampling: 'average',
              itemStyle: {
                normal: {
                  color: 'rgb(30, 144, 255)'
                }
              },
              data: zData
            },
            {
              name: '5分钟',
              type: 'line',
              smooth: true,
              showSymbol: true,
              symbol: 'circle',
              sampling: 'average',
              itemStyle: {
                normal: {
                  color: 'rgb(0, 178, 45)'
                }
              },
              data: aData
            },
            {
              name: '15分钟',
              type: 'line',
              smooth: true,
              showSymbol: true,
              symbol: 'circle',
              sampling: 'average',
              itemStyle: {
                normal: {
                  color: 'rgb(147, 38, 255)'
                }
              },
              data: bData
            }
          ]
        };
        myChartgetload.setOption(option);
        window.addEventListener("resize", function () {
          myChartgetload.resize();
        });
      })
    },

    loadCpuTopData: {},
    // 系统负载
    getload: function (b, e) {
      var _that = this;
      var that = controlObj.conTrolView;
      $.get('/ajax?action=get_load_average&start=' + b + '&end=' + e, function (rdata) {
        that.set_data(rdata, b, e);
        var myChartgetload = echarts.init(document.getElementById('getloadview'));
        var aData = [];
        var bData = [];
        var xData = [];
        var yData = [];
        var zData = [];

        for (var i = 0; i < rdata.length; i++) {
          // xData.push(rdata[i].addtime);
          // yData.push(rdata[i].pro);
          // zData.push(rdata[i].one);
          // aData.push(rdata[i].five);
          // bData.push(rdata[i].fifteen);
          zData.push([rdata[i].addtime, rdata[i].one]);
          yData.push([rdata[i].addtime, rdata[i].pro]);
          aData.push([rdata[i].addtime, rdata[i].five]);
          bData.push([rdata[i].addtime, rdata[i].fifteen]);
          if(_that.loadCpuTopData === undefined) _that.loadCpuTopData = {};
          _that.loadCpuTopData[rdata[i].addtime] = rdata[i].cpu_top;
        }
        if (rdata.length > 0) {
          var startTime = rdata[0].addtime / 1000;
          var endTime = rdata[rdata.length - 1].addtime / 1000;
          var option = that.get_load_option(startTime, endTime, yData, zData, aData, bData);
					var fullchart;
					if(document.getElementById('fullchart-load')){
						fullchart = echarts.init(document.getElementById('fullchart-load'))
						option.tooltip.confine = true; // 限定悬浮框区域
						fullchart.setOption(option)
					}
					// 点击全屏
					$('.full-screen-load').unbind('click').click(function(e){
						layer.open({
							title:'全屏查看-内存',
							type:1,
							closeBtn:1,
							area:['100%','100%'],
							content:'<div class="time_title title c6 plr15"></div><div id="fullchart-load" style="width:100%;height:92%"></div>"',
							success:function(layers){
									var fullchart = echarts.init(document.getElementById('fullchart-load'))
									option.tooltip.confine = true;
									fullchart.setOption(option)
									$(layers).find('.time_title').html($('.load-title').html())
									// 移除全屏展示按钮
									$(layers).find('.full-screen-load').remove()
									controlObj.conTrolView.handle_click_time()
							},cancel:function(layers){
								$('.load-title .searcTime').children().eq(2).click()
							}
						})
						e.preventDefault()
						e.stopPropagation()
					})
          myChartgetload.setOption(option);
          window.addEventListener("resize", function () {
            myChartgetload.resize();
          });
        }
      })
    },

    /**
     * 获取平均负载图表配置
     */
    get_load_option: function (startTime, endTime, yData, zData, aData, bData) {
      var that = this;
      var option = this.get_default_option(startTime, endTime);
      var interval = ((endTime - startTime) / 3) * 1000;
      option.tooltip.padding = 0;
      option.tooltip.backgroundColor = 'rgba(255,255,255,0.95)';
      option.tooltip.borderColor = '#eee';
      option.tooltip.position = function (pos, params, dom, rect, size) {
        return that.echarts_position('getloadview',{pos:pos,size:size})
      }

      option.tooltip.formatter = function (config) {
        var tdList = '', selectList = '', resource = '';
        for (var i = 0; i < config.length; i++) {
          var item = config[i];
          switch (item.seriesName){
            case '1分钟':
            case '5分钟':
            case '15分钟':
              selectList += '<div class="select-data"><span class="status" style="background-color: '+ item.color +'"></span><span>'+ item.seriesName +'：'+ item.data[1].toFixed(2) +'%</span></div>';
              break;
            case '资源使用率':
              resource = item.data[1].toFixed(2)
              break;
          }
        }
        return that.echarts_formatter({
          time: config[0].axisValueLabel,
          data: that.loadCpuTopData[config[0].axisValue],
          legend: '<div class="select-data"><span class="status"></span><span>资源使用率：'+ resource +'%</span></div><div class="'+ (config[0].seriesName === '资源使用率'?'hide':'') +'">'+ selectList +'</div>'
        })
      };

      option.legend = {
        data: ['1分钟', '5分钟', '15分钟'],
        right: '16%',
        top: '10px'
      };
      option.axisPointer = {
        link: { xAxisIndex: 'all' },
        lineStyle: {
          color: '#aaaa',
          width: 1
        }
      };
      // 直角坐标系内绘图网格
      option.grid = [
        {
          left: '5%',
          bottom: 80,
          right: '55%',
          width: '40%',
          height: 'auto'
        },
        {
          bottom: 80,
          left: '55%',
          width: '40%',
          height: 'auto'
        }
      ];
      // 直角坐标系grid的x轴
      option.xAxis = [
        {
          type: 'time',
          boundaryGap: ['1%', '0%'],
          minInterval: interval,
          axisLine: {
            lineStyle: {
              color: "#666"
            }
          },
          axisLabel: {
            formatter: function (value) {
              return bt.format_data(value / 1000, 'MM/dd\nhh:mm');
            }
          }
        },
        {
          type: 'time',
          gridIndex: 1,
          boundaryGap: ['1%', '0%'],
          minInterval: interval,
          axisLine: {
            lineStyle: {
              color: "#666"
            }
          },
          axisLabel: {
            formatter: function (value) {
              return bt.format_data(value / 1000, 'MM/dd\nhh:mm');
            }
          }
        }
      ];
      option.yAxis = [
        {
          scale: true,
          name: '资源使用率',
          min: 0,
          max: function (value) {
            // 最大值超过100
            if (value.max >= 100) return Math.ceil(value.max);
            // 最大值超过80
            if (value.max >= 80) return 100;
            // 小于80取当前最大值的首位数字
            return parseInt((value.max + 10).toString().slice(0,1) + '0')
          },
          // y轴网格显示
          splitLine: {
            show: true,
            lineStyle: {
              color: "#ddd"
            }
          },
          // 坐标轴名样式
          nameTextStyle: {
            color: '#666',
            fontSize: 12,
            align: 'left'
          },
          axisLine: {
            lineStyle: {
              color: '#666',
            }
          },
        },
        {
          scale: true,
          name: '负载详情',
          gridIndex: 1,
          splitLine: {
            show: true,
            lineStyle: {
              color: "#ddd"
            }
          },
          nameTextStyle: {
            color: '#666',
            fontSize: 12,
            align: 'left'
          },
          axisLine: {
            lineStyle: {
              color: '#666',
            }
          }
        }
      ];
      option.dataZoom[0].xAxisIndex = [0, 1];
      option.dataZoom[1].type = 'slider';
      option.dataZoom[1].left = '5%';
      option.dataZoom[1].right = '5%';
      option.dataZoom[1].xAxisIndex = [0, 1];
      option.series = [
        {
          name: '资源使用率',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 2,
              color: 'rgb(255, 140, 0)'
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(255, 140, 0)'
            }
          },
          data: yData
        },
        {
          xAxisIndex: 1,
          yAxisIndex: 1,
          name: '1分钟',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 2,
              color: 'rgb(30, 144, 255)'
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(30, 144, 255)'
            }
          },
          data: zData
        },
        {
          xAxisIndex: 1,
          yAxisIndex: 1,
          name: '5分钟',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 2,
              color: 'rgb(0, 178, 45)'
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0, 178, 45)'
            }
          },
          data: aData
        },
        {
          xAxisIndex: 1,
          yAxisIndex: 1,
          name: '15分钟',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 2,
              color: 'rgb(147, 38, 255)'
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(147, 38, 255)'
            }
          },
          data: bData
        }
      ];
      option.textStyle = {
        color: '#666',
        fontSize: 12
      };
      return option;
    },

    // 统计图图例定位
    echarts_position: function (id,config){
      var boxWidth = config.size.contentSize[0],
          boxHeight = config.size.contentSize[1],
          winWidth = window.innerWidth,
          winHeight = window.innerHeight,
          _box = document.getElementById(id).getBoundingClientRect(),
          _x = config.pos[0] + _box.left,
          _y = config.pos[1] + _box.top,
          _top = 0,
          _left = 0;
      if(_x + boxWidth + 80  < winWidth){
        _left = config.pos[0] + 20
      }else{
        _left = config.pos[0] - boxWidth - 20
      }

      if(_y + boxHeight + 80 < winHeight){
        _top = config.pos[1] + 20
      }else{
        _top = config.pos[1] - boxHeight - 20
      }
      if(_y - boxHeight < 0) _top = 0 -_box.top + 10

      return [_left, _top]
    },
    // 统计图图例
    echarts_formatter: function (config){
      var time = config.time, legend = config.legend;
      var thead = '', tbody = '';
      if(typeof config.data === 'undefined') config.data = []
      if(typeof config.table === 'undefined'){
        config.table = [
          {title:'PID', width:'40px', index: 1},
          {title:'进程名', index: 2},
          {title:'CPU占用', index: 0, unit:'%'},
          {title:'启动用户', index: 4},
        ]
      }
      for (var i = 0; i < config.data.length; i++) {
        var item = config.data[i];
        if(i === 0) thead += '<tr>'
        tbody += '<tr>'
        for (var j = 0; j < config.table.length; j++) {
          var tableItem = config.table[j]
          if(i === 0) thead += '<th style="width:'+(tableItem.width || 'auto') +'">'+ tableItem.title +'</th>'
          var value = '', itemVal = item[tableItem.index]
          if(typeof tableItem.unit === 'function'){
            value = tableItem.unit(itemVal)
          }else{
            value = itemVal + (tableItem.unit || '')
          }
          tbody += '<td >'+ value +'</td>'
        }
        if(i === 0) thead += '</tr>'
        tbody += '</tr>'
      }

      return '<div class="echarts-tooltip" style="width:'+ (config.width || '400px') +'">\
        <div class="formatter-header">\
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABHNCSVQICAgIfAhkiAAAAgBJREFUWIXtWN1xgzAMlkQ3YoCaYaJji8AWPjJM3AEYCasPNT3XZ2xBk17b43uCiy190b8AOHHixN8GPkpQ3/cmfrfWukfIPUyw73vjvTci8oqIJndGRBwivk3TNPwoQWYeAOC689p4hOgugsFq971KYhBRt8f9pD3IzEOOnIg4ABiJqCOibpomBIARAMbw2xd47+/BAyqoLJiznIi4pmnGmjW2rK615IuGYEbBeLvdBs3dQALTuA0yqwZqageCYBOTOxLs8zy7tm0xltW2Lc7z7Er3qv+AmSV+DzF2GJfL5R6XpZqri0mSBjMRdd8hBwDQNM0Yv3vvTel8kaCIvEbPTpMQaUdJYa11cXbHOnIoJknsCkR8KxFbluW6WoOZi64LskyqI4dNC9YsEcN7f08VLcuy2WmIyGl1qQv1VuZuCUfEqrs1UBN8hLIVT2l1JWW5llYisqfVbRJMhZfKQVo6RMTtKUklixazOMxzJjxvloO1na1hUHNhmCE/dZTOFl0clxZN0FtrVbVSW76qBNNyUCodWqSDR62vFwkGa3zGFyKaPQGeInN3zJ2LoWr86cAAByaa3JqgGTxU8yARdYlrrsx81QydaxuEryObevBQj05bi9K6uQF8xNOaSJWNT+2BX780/a+1MwUzD5rFnYiq9fEpBGM869PHiRMn/jreAZxNPtSJHlfLAAAAAElFTkSuQmCC" alt="path" />\
          <span>日期：'+ time +'</span>\
        </div>\
          <div class="formatter-body">'+ legend +
          '<div class="process-top5 '+ (config.data.length === 0?'hide':'') +'">\
            <div class="process-header"></div>\
            <table>\
              <thead>\
              <tr>'+ thead +'</tr>\
              </thead>\
              <tbody>'+ tbody +'</tbody>\
            </table>\
          </div>\
        </div>\
      </div>'
    }
  },
  // 日报
  dailyView: function (date) {
    var that = this, _liHthml = '', paramDate = date ? date : getBeforeDate(1).replace(/\//g, '')
    $.post('/daily?action=get_daily_data', { date: paramDate }, function (res) {
      if (!res.status) {
        // var product_view = '<div class="daily-thumbnail">' +
        //   '<div class="thumbnail-box">' +
        //   '<img style="max-width: 400px;box-shadow: 1px 1px 30px rgb(0 0 0 / 10%);" src="/static/img/preview/daily.png">' +
        //   '</div>' +
        //   '<div class="thumbnail-introduce">' +
        //   '<span>日报功能介绍：</span>' +
        //   '<ul>' +
        //   '<li>服务器运行情况监测</li>' +
        //   '<li>CPU、内存、磁盘、进程过载等异常信息记录</li>' +
        //   '<li>协助管理员分析服务器</li>' +
        //   '</ul>' +
        //   '<div class="daily-product-buy">' +
        //   '<a title="立即购买" href="javascript:;" class="btn btn-success va0 ml15">立即购买</a>'
        // '</div>' +
        //   '</div>' +
        //   '</div>'
				var product_view = '<div class="thumbnail-introduce-new" style="padding-top:34px">\
							<div class="thumbnail-introduce-title-new" style="width:64%;flex-direction: column;">\
								<div class="thumbnail-title-left-new" style="width:100%;">\
										<div class="thumbnail-title-text-new">\
												<p>日报-功能介绍</p>\
												<p>能够对服务器运行情况进行监测，分析服务器异常的信息进行行为记录，协助管理员进行服务器分析。</p>\
										</div>\
								</div>\
								<div class="thumbnail-title-button-new daily-product-buy" style="width: 100%; margin:16px 0 0 0">\
											<a title="立即购买" href="javascript:;" class="btn btn-success va0">立即购买</a>\
								</div>\
						</div>\
						<div class="thumbnail-introduce-hr" style="width: 64%;"></div>\
						<div class="thumbnail-introduce-ul-new" style="width:72%;">\
								<ul style="justify-content:space-evenly">\
										<li><span class="li-icon"></span>服务器运行情况监测</li>\
										<li><span class="li-icon"></span>异常信息记录</li>\
										<li><span class="li-icon"></span>服务器分析</li>\
									</ul>\
						</div>\
						<img class="product_view_img" src="https://www.bt.cn/Public/new/plugin/introduce/control/daily.png" style="width: 64%;box-shadow: 0px 6px 10px rgba(145, 145, 145, 0.25);margin-top:30px"/>\
				</div>'
        $('.daily-view').html(product_view);
        $('.thumbnail-box').hover(function (e) {
          $(this).addClass('shadow_mask')
        }, function () {
          $(this).removeClass('shadow_mask')
        }).click(function () {
          layer.open({
            title: false,
            btn: false,
            shadeClose: true,
            closeBtn: 2,
            area: '908px',
            content: '<img src="' + $('.thumbnail-box img').attr('src') + '">'
          })
        })
        // 购买
        $('.daily-product-buy a').click(function () {
          bt.soft.updata_ltd(false, 22);
        })
        return false;
      }
      $.post('/daily?action=get_daily_list', function (dlist) {
        for (var i = dlist.length; i > 0; i--) {
          var tItem = dlist[i - 1],
              _code = tItem.evaluate == '正常' ? '#20a53a' : (tItem.evaluate == '良好' ? '#2034a5' : '#ffa700'),
              _strTime = tItem.time_key.toString(),
              _timeText = _strTime.substr(0, 4) + '-' + _strTime.substr(4, 2) + '-' + _strTime.substr(6, 2)
          _liHthml += '<li class="' + (tItem.time_key == res.date ? 'active' : '') + '" data-time="' + tItem.time_key + '"><i style="background-color:' + _code + '"></i> ' + _timeText + '</li>'
        }
        var _html = '', txtColor = '', serverData = res.data, resTime = res.date.toString(), timeText = resTime.substr(0, 4) + '-' + resTime.substr(4, 2) + '-' + resTime.substr(6, 2);
        txtColor = res.evaluate == '正常' ? '#20a53a' : (res.evaluate == '良好' ? '#2034a5' : '#ffa700')
        _html = '<div class="daily_time_select">' +
            '<span>选择日期:</span>' +
            '<div class="daily_time_box">' +
            '<span class="daily_box_text">' + timeText + '</span>' +
            '<ul class="daily_select_list">' + _liHthml + '</ul>' +
            '</div>' +
            '</div>' +
            '<div class="daily-head">' +
            '<p class="daily-status" style="color:' + txtColor + ';text-align: center;font-size: 46px;">' + res.evaluate + '</p>' +
            '<p style="text-align: center;margin: 10px 0 30px;">监测时间：' + timeText + ' 00:00:00 - 23:59:59</p>' +
            '<p style="margin-bottom: 15px;">健康信息提醒：</p>' +
            '<ul class="report_results ' + (res.evaluate != '正常' ? 'textRed' : '') + '">'

        $.each(res.summary, function (index, item) {
          _html += '<li>' + item + '</li>'
        })
        _html += '</ul></div>'
        _html += '<div class="divtable daily-table" style="width:960px;margin:0 auto">' +
            '<table class="table table-hover">' +
            '<tbody>' +
            '<tr class="daily-title"><td width=110>资源</td><td colspan="2">过载次数(五分钟内平均使用率超过80%)</td></tr>' +
            '<tr><td><i style="background-color:' + (serverData.cpu.ex ? 'red' : '#20a53a') + '"></i> CPU</td><td colspan="2">' + that.resource_info('cpu', serverData.cpu.detail) + '</td></tr>' +
            '<tr><td><i style="background-color:' + (serverData.ram.ex ? 'red' : '#20a53a') + '"></i> 内存</td><td colspan="2">' + that.resource_info('ram', serverData.ram.detail) + '</td></tr>' +
            '<tr><td><i style="background-color:' + (serverData.disk.ex ? 'red' : '#20a53a') + '"></i> 磁盘</td><td colspan="2">' + that.resource_info('disk', serverData.disk.detail) + '</td></tr>' +
            '<tr class="daily-title"><td>常用服务</td><td colspan="2">异常次数(服务出现停止运行的次数)</td></tr>' +
            '<tr><td><i style="background-color:' + (serverData.server.nginx.ex ? 'red' : '#20a53a') + '"></i> Nginx</td><td colspan="2">' + that.resource_info('nginx', serverData.server.nginx.detail) + '</td></tr>' +
            '<tr><td><i style="background-color:' + (serverData.server.mysql.ex ? 'red' : '#20a53a') + '"></i> Mysql</td><td colspan="2">' + that.resource_info('mysql', serverData.server.mysql.detail) + '</td></tr>' +
            '<tr><td><i style="background-color:' + (serverData.server.apache.ex ? 'red' : '#20a53a') + '"></i> Apache</td><td colspan="2">' + that.resource_info('apache', serverData.server.apache.detail) + '</td></tr>' +
            '<tr><td><i style="background-color:' + (serverData.server.php.ex ? 'red' : '#20a53a') + '"></i> PHP</td><td colspan="2">' + that.resource_info('php', serverData.server.php.detail) + '</td></tr>' +
            '<tr><td><i style="background-color:' + (serverData.server.ftpd.ex ? 'red' : '#20a53a') + '"></i> Ftpd</td><td colspan="2">' + that.resource_info('ftpd', serverData.server.ftpd.detail) + '</td></tr>' +
            '<tr><td><i style="background-color:' + (serverData.server.redis.ex ? 'red' : '#20a53a') + '"></i> Redis</td><td colspan="2">' + that.resource_info('redis', serverData.server.redis.detail) + '</td></tr>' +
            '<tr><td><i style="background-color:' + (serverData.server.tomcat.ex ? 'red' : '#20a53a') + '"></i> Tomcat</td><td colspan="2">' + that.resource_info('tomcat', serverData.server.tomcat.detail) + '</td></tr>' +
            '<tr><td><i style="background-color:' + (serverData.server.memcached.ex ? 'red' : '#20a53a') + '"></i> Memcached</td><td colspan="2">' + that.resource_info('memcached', serverData.server.memcached.detail) + '</td></tr>' +
            '<tr class="daily-title"><td>备份类型</td><td width=240>备份失败</td><td>未开启备份</td></tr>' +
            '<tr><td><i style="background-color:' + (serverData.backup.database.backup.length || serverData.backup.database.no_backup.length ? 'red' : '#20a53a') + '"></i> 数据库</td><td>' + that.resource_info('database_backup', serverData.backup.database.backup) + '</td><td>' + that.resource_info('database_no_backup', serverData.backup.database.no_backup) + '</td></tr>' +
            '<tr><td><i style="background-color:' + (serverData.backup.site.backup.length || serverData.backup.site.no_backup.length ? 'red' : '#20a53a') + '"></i> 网站</td><td>' + that.resource_info('site_backup', serverData.backup.site.backup) + '</td><td>' + that.resource_info('site_no_backup', serverData.backup.site.no_backup) + '</td></tr>' +
            '<tr class="daily-title"><td>异常类型</td><td colspan="2">次数</td></tr>' +
            '<tr><td><i style="background-color:' + (serverData.exception.panel.ex ? 'red' : '#20a53a') + '"></i> 面板异常登录</td><td colspan="2">' + that.resource_info('panel', serverData.exception.panel.detail) + '</td></tr>' +
            '<tr><td><i style="background-color:' + (serverData.exception.ssh.ex ? 'red' : '#20a53a') + '"></i> SSH异常登录</td><td colspan="2">' + that.resource_info('ssh', serverData.exception.ssh.detail) + '</td></tr>' +
            '</tbody>' +
            '</table>' +
            '<ul class="help-info-text c7">' +
            '<li style="list-style: none;">在系统监控开启的情况下，日报会记录服务器每天运行的异常信息，协助管理员分析服务器前一天是否运行正常。</li>' +
            '</ul>' +
            '</div>'
        $('.daily-view').html(_html);

        //选择日期
        $('.daily_box_text').on('click', function (e) {
          if ($(this).parent().hasClass('active')) {
            $(this).parent().removeClass('active');
          } else {
            $(this).parent().addClass('active')
          }
          $(document).unbind('click').click(function (e) {
            $('.daily_time_box').removeClass('active');
            $(this).unbind('click');
          });
          e.stopPropagation();
          e.preventDefault();
        })
        //选择日期li
        $('.daily_select_list').on('click', 'li', function (e) {
          var _val = $(this).data('time');
          $(this).addClass('active').siblings().removeClass('active');
          $(this).parent().prev().find('.daily_box_text').html($(this).text());
          that.dailyView(_val);
        });
      })
    })
  },
  resource_info: function (type, data) {
    var tdHTml = ''
    if (type.indexOf('_backup') == -1) {
      tdHTml = data.length > 0 ? (data.length + '次 <span name="daily_' + type + '"><a class="btlink">查看详情</a><div class="daily_details_mask bgw hide"></div></span>') + '' : '未监测到异常'
    } else {
      var backupTotal = data.length, unit = '次';
      if (type == 'database_no_backup' || type == 'site_no_backup') unit = '个'
      tdHTml = backupTotal > 0 ? (backupTotal + unit + ' <span name="daily_' + type + '"><a class="btlink">查看详情</a><div class="daily_details_mask bgw hide"></div></span>') + '' : '未监测到异常'
    }
    $('.daily-view').off('click', '[name=daily_' + type + ']');
    $('.daily-view').on('click', '[name=daily_' + type + ']', function (e) {
      var box = $(this).find('.daily_details_mask')
      if (e.target.localName == 'a') {
        if (box.hasClass('hide')) {
          //隐藏所有
          $('.daily_details_mask').addClass('hide').prev('a').removeAttr('style')
          box.prev('a').css('color', '#23527c');
          box.removeClass('hide').css({ left: e.clientX - 215, top: (e.clientY - 60) + $(document).scrollTop() });
        } else {
          box.addClass('hide')
          box.prev('a').removeAttr('style');
        }
        var _details = '<div class="divtable daliy_details_table"><table class="table table-hover">', thead = '', _tr = '';
        switch (type) {
          case 'cpu':
          case 'ram':
            thead = '<thead><tr><th></th><th>过载时间</th><th>PID</th><th>进程</th><th>占用</th></tr></thead>'
            $.each(data, function (index, item) {
              _tr += '<tr><td>' + (index + 1) + '</td><td>' + bt.format_data(item.time) + '</td><td>' + item.pid + '</td><td><span class="overflow_hide" style="width:100px" title="' + item.name + '">' + item.name + '</span></td><td>' + item.percent + '%</td></tr>'
            })
            break;
          case 'disk':
            thead = '<thead><tr><th></th><th>路径</th><th>占用</th></tr></thead>'
            $.each(data, function (index, item) {
              _tr += '<tr><td>' + (index + 1) + '</td><td><span class="overflow_hide" style="width:230px" title="' + item.name + '">' + item.name + '</span></td><td>' + item.percent + '%</td></tr>'
            })
            break;
          case 'nginx':
          case 'ftpd':
          case 'memcached':
          case 'tomcat':
          case 'apache':
          case 'mysql':
          case 'redis':
          case 'php':
            thead = '<thead><tr><th></th><th>停止时间</th></tr></thead>'
            $.each(data, function (index, item) {
              _tr += '<tr><td>' + (index + 1) + '</td><td>' + bt.format_data(item.time) + '</td></tr>'
            })
            break;
          case 'database_backup':
          case 'site_backup':
          case 'path_backup':
            thead = '<thead><tr><th></th><th>名称</th><th>时间</th></tr></thead>'
            $.each(data, function (index, item) {
              _tr += '<tr><td>' + (index + 1) + '</td><td><span class="overflow_hide" style="width:230px" title="' + item.name + '">' + item.name + '</span></td><td>' + bt.format_data(item.time) + '</td></tr>'
            })
            break;
          case 'database_no_backup':
          case 'site_no_backup':
          case 'path_no_backup':
            thead = '<thead><tr><th></th><th>名称</th></tr></thead>'
            $.each(data, function (index, item) {
              _tr += '<tr><td>' + (index + 1) + '</td><td><span class="overflow_hide" style="width:230px" title="' + item.name + '">' + item.name + '</span></td></tr>'
            })
            break;
          case 'panel':
          case 'ssh':
            thead = '<thead><tr><th></th><th>时间</th><th>用户</th><th>详情</th></tr></thead>'
            $.each(data, function (index, item) {
              _tr += '<tr><td>' + (index + 1) + '</td><td>' + bt.format_data(item.time) + '</td><td>' + item.username + '</td><td>' + item.desc + '</td></tr>'
            })
            break;
        }
        _details += thead + '<tbody>' + _tr + '</tbody></table></div>';

        $(this).find('.daily_details_mask').html(_details)
        if (data.length > 5) {
          // 固定表格头部
          if (jQuery.prototype.fixedThead) {
            $(box).find('.divtable').fixedThead({ resize: false, height: 213 });
            $(box).find('.divtable').css({ 'overflow': 'hidden' });
          } else {
            $(box).find('.divtable').css({ 'overflow': 'auto' });
          }
        }
      }

      $(document).one('click', function () {
        $('.daily_details_mask').addClass('hide').prev('a').removeAttr('style')
      })
      e.stopPropagation();
    })
    return tdHTml;
  }
}
//定义周期时间
function getBeforeDate (n) {
  var n = n;
  var d = new Date();
  var year = d.getFullYear();
  var mon = d.getMonth() + 1;
  var day = d.getDate();
  if (day <= n) {
    if (mon > 1) {
      mon = mon - 1;
    }
    else {
      year = year - 1;
      mon = 12;
    }
  }
  d.setDate(d.getDate() - n);
  year = d.getFullYear();
  mon = d.getMonth() + 1;
  day = d.getDate();
  s = year + "/" + (mon < 10 ? ('0' + mon) : mon) + "/" + (day < 10 ? ('0' + day) : day);
  return s;
}
