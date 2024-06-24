var bt = {
	// 新功能存储数据 
	newDotTipsData: {},
	del_seven_coupon : false ,//7天内删除优惠券 
	os: 'Linux',
	refreshMain: function (path) {
		window.parent.postMessage('refreshMain' + (path ? '::' + path : ''), '*')
	},
	isInteger: function (obj) {
		//是否整数
		return (obj | 0) === obj
	},
	check_ip: function (
		ip //验证ip
	) {
		var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
		return reg.test(ip);
	},
	check_ips: function (
		ips //验证ip段
	) {
		var reg = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\/\d{1,2})?$/;
		return reg.test(ip);
	},
	// 验证域名列表
	check_domain_list: function (domainInfo, isPort) {
		var domainList = domainInfo.trim().replace(' ', '').split('\n');
		for (var i = 0; i < domainList.length; i++) {
			var item = domainList[i];
			if (isPort && !bt.check_domain_port(item)) {
				bt.msg({ status: false, msg: '第' + (i + 1) + '行【' + item + '】域名格式错误' });
				return false;
			}
			if (!isPort && !bt.check_domain(item)) {
				bt.msg({ status: false, msg: '第' + (i + 1) + '行【' + item + '】域名格式错误' });
				return false;
			}
		}
		return domainList;
	},
	check_url: function (
		url //验证url
	) {
		var reg = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;
		return reg.test(url);
	},
	check_port: function (port) {
		var reg = /^([1-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
		return reg.test(port);
	},
	check_chinese: function (str) {
		var reg = /[\u4e00-\u9fa5]/;
		return reg.test(str);
	},
	check_domain: function (
		domain //验证域名
	) {
		var reg = /^([\w\u4e00-\u9fa5\-\*]{1,100}\.){1,10}([\w\u4e00-\u9fa5\-]{1,24}|[\w\u4e00-\u9fa5\-]{1,24}\.[\w\u4e00-\u9fa5\-]{1,24})$/;
		return reg.test(bt.strim(domain));
	},
	check_domain_port: function (domain) {
		//验证域名带端口号
		var reg =
			/^([\w\u4e00-\u9fa5\-\*]{1,100}\.){1,10}([\w\u4e00-\u9fa5\-]{1,24}|[\w\u4e00-\u9fa5\-]{1,24}\.[\w\u4e00-\u9fa5\-]{1,24})(:([1-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?$/;
		return reg.test(bt.strim(domain));
	},
	check_img: function (
		fileName //验证是否图片
	) {
		var exts = ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff', 'ico'];
		var check = bt.check_exts(fileName, exts);
		return check;
	},
	check_email: function (email) {
		var reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
		return reg.test(email);
	},

	check_phone: function (phone) {
		var reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
		return reg.test(phone);
	},
	check_zip: function (fileName) {
		var ext = fileName.split('.');
		var extName = ext[ext.length - 1].toLowerCase();
		if (extName == 'zip') return 0;
		if (extName == 'rar') return 2;
		if (extName == 'gz' || extName == 'tgz') return 1;
		return -1;
	},
	check_text: function (fileName) {
		var exts = ['rar', 'zip', 'tar.gz', 'gz', 'iso', 'xsl', 'doc', 'xdoc', 'jpeg', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'exe', 'so', '7z', 'bz'];
		return bt.check_exts(fileName, exts) ? false : true;
	},
	check_exts: function (fileName, exts) {
		var ext = fileName.split('.');
		if (ext.length < 2) return false;
		var extName = ext[ext.length - 1].toLowerCase();
		for (var i = 0; i < exts.length; i++) {
			if (extName == exts[i]) return true;
		}
		return false;
	},
	check_version: function (version, cloud_version) {
		var arr1 = version.split('.'); //
		var arr2 = cloud_version.split('.');
		var leng = arr1.length > arr2.length ? arr1.length : arr2.length;
		while (leng - arr1.length > 0) {
			arr1.push(0);
		}
		while (leng - arr2.length > 0) {
			arr2.push(0);
		}
		for (var i = 0; i < leng; i++) {
			if (i == leng - 1) {
				if (arr1[i] != arr2[i]) return 2; //子版本匹配不上
			} else {
				if (arr1[i] != arr2[i]) return -1; //版本匹配不上
			}
		}
		return 1; //版本正常
	},
	// url合成
	url_merge: function (url) {
		var origin = window.location.origin;
		return (cdn_url !== '/static' ? cdn_url : origin + cdn_url) + url + '?version=' + panel_version + '&repair=' + update_code;
	},
	replace_all: function (str, old_data, new_data) {
		var reg_str = '/(' + old_data + '+)/g';
		var reg = eval(reg_str);
		return str.replace(reg, new_data);
	},
	get_file_ext: function (fileName) {
		var text = fileName.split('.');
		var n = text.length - 1;
		text = text[n];
		return text;
	},
	get_file_path: function (filename) {
		var arr = filename.split('/');
		path = filename.replace('/' + arr[arr.length - 1], '');
		return path;
	},
	get_date: function (a) {
		var dd = new Date();
		dd.setTime(dd.getTime() + (a == undefined || isNaN(parseInt(a)) ? 0 : parseInt(a)) * 86400000);
		var y = dd.getFullYear();
		var m = dd.getMonth() + 1;
		var d = dd.getDate();
		return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
	},
	get_form: function (select) {
		var sarr = $(select).serializeArray();
		var iarr = {};
		for (var i = 0; i < sarr.length; i++) {
			iarr[sarr[i].name] = sarr[i].value;
		}
		return iarr;
	},
	ltrim: function (str, r) {
		var reg_str = '/(^\\' + r + '+)/g';
		var reg = eval(reg_str);
		str = str.replace(reg, '');
		return str;
	},
	rtrim: function (str, r) {
		var reg_str = '/(\\' + r + '+$)/g';
		var reg = eval(reg_str);
		str = str.replace(reg, '');
		return str;
	},
	strim: function (str) {
		var reg_str = '/ /g';
		var reg = eval(reg_str);
		str = str.replace(reg, '');
		return str;
	},
	contains: function (str, substr) {
		if (str) {
			return str.indexOf(substr) >= 0;
		}
		return false;
	},
	format_size: function (
		bytes,
		is_unit,
		fixed,
		end_unit //字节转换，到指定单位结束 is_unit：是否显示单位  fixed：小数点位置 end_unit：结束单位
	) {
		if (bytes == undefined) return 0;

		if (is_unit == undefined) is_unit = true;
		if (fixed == undefined) fixed = 2;
		if (end_unit == undefined) end_unit = '';

		if (typeof bytes == 'string') bytes = parseInt(bytes);
		var unit = [' B', ' KB', ' MB', ' GB', 'TB'];
		var c = 1024;
		for (var i = 0; i < unit.length; i++) {
			var cUnit = unit[i];
			if (end_unit) {
				if (cUnit.trim() == end_unit.trim()) {
					var val = i == 0 ? bytes : fixed == 0 ? bytes : bytes.toFixed(fixed);
					if (is_unit) {
						return val + cUnit;
					} else {
						val = parseFloat(val);
						return val;
					}
				}
			} else {
				if (bytes < c) {
					var val = i == 0 ? bytes : fixed == 0 ? bytes : bytes.toFixed(fixed);
					if (is_unit) {
						return val + cUnit;
					} else {
						val = parseFloat(val);
						return val;
					}
				}
			}

			bytes /= c;
		}
	},
	format_data: function (tm, format) {
		if (format == undefined) format = 'yyyy/MM/dd hh:mm:ss';
		tm = tm.toString();
		if (tm.length > 10) {
			tm = tm.substring(0, 10);
		}
		var data = new Date(parseInt(tm) * 1000);
		var o = {
			'M+': data.getMonth() + 1, //month
			'd+': data.getDate(), //day
			'h+': data.getHours(), //hour
			'm+': data.getMinutes(), //minute
			's+': data.getSeconds(), //second
			'q+': Math.floor((data.getMonth() + 3) / 3), //quarter
			S: data.getMilliseconds(), //millisecond
		};
		if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (data.getFullYear() + '').substr(4 - RegExp.$1.length));
		for (var k in o) if (new RegExp('(' + k + ')').test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));

		return format;
	},
	format_path: function (path) {
		var reg = /(\\)/g;
		path = path.replace(reg, '/');
		return path;
	},
	get_random: function (len) {
		len = len || 32;
		var $chars = 'AaBbCcDdEeFfGHhiJjKkLMmNnPpRSrTsWtXwYxZyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
		var maxPos = $chars.length;
		var pwd = '';
		for (i = 0; i < len; i++) {
			pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return pwd;
	},
	refresh_pwd: function (length, obj) {
		if (obj == undefined) obj = 'MyPassword';
		var _input = $('#' + obj);
		if (_input.length > 0) {
			_input.val(bt.get_random(length));
		} else {
			$('.' + obj).val(bt.get_random(length));
		}
	},
	get_random_num: function (
		min,
		max //生成随机数
	) {
		var range = max - min;
		var rand = Math.random();
		var num = min + Math.round(rand * range); //四舍五入
		return num;
	},
	/**
	 * 生成计算数字(加强计算，用于删除重要数据二次确认)
	 * */
	get_random_code: function () {
		var flist = [20, 21, 22, 23];

		var num1 = bt.get_random_num(13, 19);
		var t1 = num1 % 10;

		var num2 = bt.get_random_num(13, 29);
		var t2 = num2 % 10;

		while ($.inArray(num2, flist) >= 0 || t1 + t2 <= 10 || t1 == t2) {
			num2 = bt.get_random_num(13, 29);
			t2 = num2 % 10;
		}
		return { num1: num1, num2: num2 };
	},
	/**
	 * @description 设置本地存储，local和session
	 * @param {String} type 存储类型，可以为空，默认为session类型。
	 * @param {String} key 存储键名
	 * @param {String} val 存储键值
	 * @return 无返回值
	 */
	set_storage: function (type, key, val) {
		if (type != 'local' && type != 'session') (val = key), (key = type), (type = 'local');
		window[type + 'Storage'].setItem(key, val);
	},

	/**
	 * @description 获取本地存储，local和session
	 * @param {String} type 存储类型，可以为空，默认为session类型。
	 * @param {String} key 存储键名
	 * @return {String} 返回存储键值
	 */
	get_storage: function (type, key) {
		if (type != 'local' && type != 'session') (key = type), (type = 'local');
		return window[type + 'Storage'].getItem(key);
	},

	/**
	 * @description 删除指定本地存储，local和session
	 * @param {String} type 类型，可以为空，默认为session类型。
	 * @param {String} key 键名
	 * @return 无返回值
	 */
	remove_storage: function (type, key) {
		if (type != 'local' && type != 'session') (key = type), (type = 'local');
		window[type + 'Storage'].removeItem(key);
	},

	/**
	 * @description 删除指定类型的所有存储信息储，local和session
	 * @param {String} type 类型，可以为空，默认为session类型。
	 * @return 无返回值
	 */
	clear_storage: function (type) {
		if (type != 'local' && type != 'session') (key = type), (type = 'local');
		window[type + 'Storage'].clear();
	},
	set_cookie: function (key, val, time) {
		if (time != undefined) {
			var exp = new Date();
			exp.setTime(exp.getTime() + time);
			time = exp.toGMTString();
		} else {
			var Days = 30;
			var exp = new Date();
			exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
			time = exp.toGMTString();
		}
		var is_https = window.location.protocol == 'https:';
		var samesite = ';Secure; Path=/; SameSite=None';
		document.cookie = 'http'+ ( is_https ?'s':'') +'_'+ key + '=' + encodeURIComponent(val) + ';expires=' + time + (is_https ? samesite : '');
	},
	get_cookie: function (key) {
		var is_https = window.location.protocol == 'https:';
		var arr,
			reg = new RegExp('(^| )http'+ ( is_https ?'s':'') +'_' + key + '=([^;]*)(;|$)');
		if ((arr = document.cookie.match(reg))) {
			var val = '';
			if(arr.length > 2){
				try {
					val = decodeURIComponent(arr[2]);
				} catch (error) {
					val = arr[2]
				}
			}
			return val == 'undefined' ? '' : val;
		} else {
			return null;
		}
	},
	clear_cookie: function (key) {
		this.set_cookie(key, '', new Date());
	},
	//刷新日志
	refreshLogBtn: function (obj) {
		var timer = null
		render_status(false,3)
		function render_status(status,times) {
			$('.refreshMenu').html('<div class=" mt10">\
					<form class="bt-form" data-form="3zG5d" onsubmit="returhiden false">\
					<div class="line" style="padding: 0px;">\
					<span class="tname" style="width: 90px; padding-right: 10px; color: black;">定时刷新</span>\
					<div class="info-r"><div class="inlineBlock  ">\
					<div class="inlineBlock  mt5 refreshMenuFix">\
					<input class="btswitch btswitch-ios" id="setTimeRefresh1" type="checkbox" '+ (status ? 'checked' : '') +'>\
					<label class="btswitch-btn setTimeRefresh1" for="setTimeRefresh1" style="margin-left:6px;margin-right:6px"></label>\
					</div></div></div></div>\
					<div class="line '+ (status ? '' : 'hide') +'" style="padding: 0px;"><span class="tname" style="width: 90px; padding-right: 10px; color: black;">时间间隔</span><div class="info-r"><div class="inlineBlock  "><input type="number" name="time" class="bt-input-text mr10 " style="margin-left:-22px; color:#333;width:50px;" value="'+ times +'"><span class="unit">秒</span></div></div></div></form></div>')
			$('.refreshMenu').append('<div class="arrow_b" style=""></div><div class="arrow" style=""></div>')
			if(status) {
				$('.refreshMenu .line:eq(1)').removeClass('hide')
			}else {
				$('.refreshMenu .line:eq(1)').addClass('hide')
			}

			$('#setTimeRefresh1').unbind('change').on('change',function(){
				var isCheck = $(this).prop('checked')
				$('#setTimeRefresh1').prop('checked',isCheck)
				setRefreshLogs()
				if(isCheck) {
					layer.msg('设置成功', { icon: 1 })
				}else {
					layer.msg('取消成功', { icon: 1 })
				}
			})
			$('[name=time]').on('input',function(){
				var val = $(this).val()
				layer.closeAll('tips')
				if(Number(val) < 1){
					layer.tips('时间间隔不能小于1',$(this), { tips: [1, '#ff0000'], time: 2000 })
				}else {
					render_status(true,val)
				}
			})
		}
		if(bt.get_storage(obj.cookie+ 'Refresh') == 'true'){
			$('#setTimeRefresh1').prop('checked', bt.get_storage(obj.cookie+ 'Refresh'))
			$('.refreshMenu [name=time]').val(bt.get_storage(obj.cookie+ 'RefreshTime')/1000)
			setRefreshLogs()
		}
		// 刷新设置
		$('.refresh-btn').find('.down-box').on('click',function (e) {
			$('.refreshMenu').show()
			if($('#setTimeRefresh1').prop('checked')){
				$('.refreshMenu [name=time]').on('blur',function(){
					if($(this).val() < 1){
						layer.msg('刷新时间不能小于1',{icon:0})
						$('.refreshMenu [name=time]').val(bt.get_storage(obj.cookie+ 'RefreshTime')/1000)
						return false
					}
					setRefreshLogs()
				})
			}else{
				$($('.refreshMenu .line')[1]).hide()
			}
			$(document).on('click',function(e){
				if(!$(e.target).hasClass('refresh-btn') && $(e.target).parents('.refresh-btn').length == 0){
					$('.refreshMenu').hide()
				}
			})
			e.stopPropagation();
		});
		function setRefreshLogs(){
			var timeNum = $('.refreshMenu [name=time]').val(),
				isCheck = $('#setTimeRefresh1').prop('checked')
			var leng = 289.027/timeNum,num = timeNum
			clearInterval(timer)
			if(isCheck){
				if(Number(timeNum) > 0){
					$('.refresh-btn .countdown .time').text(timeNum)
					clearInterval(timer)
					$('.refresh-btn .countdown').show()
					timer = setInterval(function(){
						if(!$('.refresh-btn .countdown').length) clearInterval(timer)
						if(timeNum == 0){
							obj.func()
						}
						$('.refresh-btn .countdown .time').text(timeNum)
						$('.refresh-btn .countdown svg path').eq(1).css({
							'stroke-dasharray': (289.027-leng*(num - timeNum)) +'px, 289.027px;'
						})
						$('.refresh-btn .countdown .time').prev().remove()
						var width = 289.027-leng*(num - timeNum)
						$('.refresh-btn .countdown .time').before(render_svg(width))
						timeNum--
						if(timeNum < 0){
							timeNum = $('.refreshMenu [name=time]').val()
						}
					},1000)
					bt.set_storage(obj.cookie+ 'Refresh', isCheck)
					bt.set_storage(obj.cookie+ 'RefreshTime', timeNum*1000)
				}else{
					layer.msg('请输入正确的间隔', { icon: 2 })
				}
			}else{
				$('.refresh-btn .countdown').hide()
				clearInterval(timer)
				bt.set_storage(obj.cookie+ 'Refresh', isCheck)
			}
			render_status(isCheck,timeNum)
		}

		function render_svg(width) {
			return '<svg viewBox="0 0 100 100"><path d="\
				M 50 50\
				m 0 -46\
				a 46 46 0 1 1 0 92\
				a 46 46 0 1 1 0 -92\
				" stroke="#ccc" stroke-width="8" fill="#fff" class="el-progress-circle__track" style="stroke-dasharray: 289.027px, 289.027px; stroke-dashoffset: 0px;"></path><path d="\
				M 50 50\
				m 0 -46\
				a 46 46 0 1 1 0 92\
				a 46 46 0 1 1 0 -92\
				" stroke="#20a53a" fill="none" stroke-linecap="round" stroke-width="8" class="el-progress-circle__path" style="stroke-dasharray:'+ width +'px, 289.027px; stroke-dashoffset: 0px; transition: stroke-dasharray 0.6s ease 0s, stroke 0.6s ease 0s;"></path></svg>'
		}
	},
	/**
	 * @description 渲染关网站
	 * @param {Object} obj name site/databases
	 */
	render_associated_service: function (obj) {
		$(obj.el).empty()
		var dataList = [],isSite = obj.name === 'site'
		var column =  [
			{
				fid: isSite ? 'rname' : 'mysql',
				title: isSite ? '站点名称' : '数据库',
				template: function (row) {
					return '<span>'+ ((isSite ? row.rname : row.name) || '--') +'</span>'
				}
			},
			{
				fid: 'mysql',
				title: isSite ? '数据库' : '站点名称',
				template: function (row) {
					return '<div><span>'+ ((isSite ? row.mysql.name : row.rname) || '--') +'</span><a data-id="'+ row.id +'" class="btlink  ml10 cutMysqlSite">切换</a></div>'
				}
			}
		]
		if(isSite) {
			column.splice(1,0,{
				fid: 'ftp',
				title: 'FTP用户',
				template: function (row) {
					return '<div><span>'+ (row.ftp.name || '--') +'</span><a class="btlink cutFtp ml10" data-id="'+ row.id +'" >切换</a></div>'
				}
			})
		}
		bt_tools.table({
			el: obj.el,
			url: isSite ? '/panel/sitelink/get_site_info' : '/panel/sitelink/get_mysql_info',
			default: '关联网站列表为空',
			height: '520px',
			dataFilter: function (res) {
				dataList = res
				return {data: res}
			},
			column: column,
			success: function () {
				// 切换FTP
				$('.cutFtp').unbind('click').click(function () {
					var id = $(this).data('id')
					var item = dataList.find(function (items) {
						return items.id === id
					})
					bt_tools.open({
						title: '切换FTP',
						area: '400px',
						content: {
							class: 'pd20',
							form: [
								{
									label: '站点名称',
									group: [
										{
											type: 'text',
											disabled: true,
											value: item.rname,
											width: '200px',
										}
									]
								},
								{
									label: 'FTP用户',
									group: [
										{
											type: 'select',
											name: 'ftp_id',
											value: item.ftp.id,
											width: '200px',
											list: {
												url: '/panel/sitelink/get_ftp_info',
												dataFilter: function (res, that) {
													var data = []
													for (var i = 0; i < res.length; i++) {
														data.push({title: res[i].name, value: res[i].id})
													}
													return data;
												},
											},
										}
									]
								}
							]
						},
						success: function (layero, index) {
							$(layero).find('.layui-layer-content').css('overflow','inherit')
						},
						yes: function (form,indexs) {
							bt_tools.send({url: '/panel/sitelink/modify_ftp_link',data: {ftp_id: form.ftp_id, pid: id}},function (res) {
								bt_tools.msg(res)
								if(res.status) {
									layer.close(indexs)
									bt.render_associated_service(obj)
								}
							})
						}
					})
				})
				// 切换数据库/网站
				$('.cutMysqlSite').unbind('click').click(function () {
					var id = $(this).data('id')
					var item = dataList.find(function (items) {
						return items.id === id
					})
					bt_tools.open({
						title: isSite ? '切换数据库' : '切换网站',
						area: '400px',
						content: {
							class: 'pd20',
							form: [
								{
									label: isSite ? '站点名称' : '数据库',
									group: [
										{
											type: 'text',
											disabled: true,
											value: isSite ? item.rname : item.name,
											width: '200px',
										}
									]
								},
								{
									label: isSite ? '数据库' : '站点名称',
									group: [
										{
											type: 'select',
											name: 'mid',
											value: isSite ? item.mysql.id : item.pid,
											width: '200px',
											list: isSite ? {
												url: '/panel/sitelink/get_mysql_info',
												dataFilter: function (res, that) {
													var data = []
													for (var i = 0; i < res.length; i++) {
														data.push({title: res[i].name, value: res[i].id})
													}
													return data;
												},
											} : {
												url: '/panel/sitelink/get_site_info',
												dataFilter: function (res, that) {
													var data = []
													for (var i = 0; i < res.length; i++) {
														data.push({title: res[i].rname, value: res[i].id})
													}
													return data;
												},
											},
										}
									]
								}
							]
						},
						success: function (layero, index) {
							$(layero).find('.layui-layer-content').css('overflow','inherit')
						},
						yes: function (form,indexs) {
							bt_tools.send({url: '/panel/sitelink/modify_mysql_link',data: {sql_id: isSite ? form.mid : item.id, pid: isSite ? item.id : form.mid}},function (res) {
								bt_tools.msg(res)
								if(res.status) {
									layer.close(indexs)
									bt.render_associated_service(obj)
								}
							})
						}
					})
				})
			}
		})
	},
	// json格式化
	formatJsonForNotes:function(json, options) {
		var reg = null,
			formatted = '',
			pad = 0,
			PADDING = '  '; // （缩进）可以使用'\t'或不同数量的空格
		// 可选设置
		options = options || {};
		// 在 '{' or '[' follows ':'位置移除新行
		options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
		// 在冒号后面加空格
		options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;
		// 开始格式化...
		if (typeof json !== 'string') {
			// 确保为JSON字符串
			json = JSON.stringify(json);
		} else {
			//已经是一个字符串，所以解析和重新字符串化以删除额外的空白
			json = JSON.parse(json);
			json = JSON.stringify(json);
		}
		// 在花括号前后添加换行
		reg = /([\{\}])/g;
		json = json.replace(reg, '\r\n$1\r\n');
		// 在方括号前后添加新行
		reg = /([\[\]])/g;
		json = json.replace(reg, '\r\n$1\r\n');
		// 在逗号后添加新行
		reg = /(\,)/g;
		json = json.replace(reg, '$1\r\n');
		// 删除多个换行
		reg = /(\r\n\r\n)/g;
		json = json.replace(reg, '\r\n');
		// 删除逗号前的换行
		reg = /\r\n\,/g;
		json = json.replace(reg, ',');
		// 可选格式...
		if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
			reg = /\:\r\n\{/g;
			json = json.replace(reg, ':{');
			reg = /\:\r\n\[/g;
			json = json.replace(reg, ':[');
		}
		if (options.spaceAfterColon) {
			reg = /\:/g;
			json = json.replace(reg, ': ');
		}
		$.each(json.split('\r\n'), function(index, node) {
			var i = 0,
				indent = 0,
				padding = '';
			if (node.match(/\{$/) || node.match(/\[$/)) {
				indent = 1;
			} else if (node.match(/\}/) || node.match(/\]/)) {
				if (pad !== 0) {
					pad -= 1;
				}
			} else {
				indent = 0;
			}
			for (i = 0; i < pad; i++) {
				padding += PADDING;
			}
			formatted += padding + node + '\r\n';
			pad += indent;
		});
		return formatted;
	},
	/**
	 * @description tips提示
	 * @param {*} obj.el {string} 元素ID/class
	 * @param {*} obj.msg {string} 提示内容
	 * @param {*} obj.time {number} 提示停留时间
	 * @param {*} obj.style {string} 提示盒子样式
	 * @param {*} obj.position {string} 提示箭头位置 top:上 right:右 bottom:下 left:左
	 * @param {*} obj.storage {string} 是否存提示状态 只首次提示
	 */
	tips: function (obj) {
		var elStorage = bt.get_storage(obj.storage)
		if(!elStorage) {
			$(obj.el).append('<div class="pack-tips-box '+ (obj.position ? obj.position : 'top') +'" style="'+ obj.style +'">'+ obj.msg +'</div>')
			// 存储提示状态
			if(obj.storage) bt.set_storage(obj.storage, 1)
			if(obj.time) {
				setTimeout(function(){
					$(obj.el).find('.pack-tips-box').remove();
				}, obj.time)
			}
		}
	},
	/**
	 * @description 新功能加小圆点提醒
	 * @param {*} obj.el {string} 元素ID/class
	 * @param {*} obj.name {string} 设置的名称
	 * @param {*} obj.style {string} 样式
	 */
	newDotTips: function (objArr) {
		var newDotTipsData = sessionStorage.getItem('newDotTipsData') // 获取存储的数据
		if(!newDotTipsData) { // 不存在则请求数据
			bt_tools.send({url: 'config?action=get_status_info'},function (res) {
				sessionStorage.setItem('newDotTipsData', JSON.stringify(res.msg))
				setDotTips(res.msg)		
			})
		}else {
			setDotTips(JSON.parse(newDotTipsData))
		}
		function setDotTips(data) {
			for (var i = 0; i < objArr.length; i++) {
				var obj = objArr[i]
				if(!data.hasOwnProperty(obj.name) || (data.hasOwnProperty(obj.name) && data[obj.name] === 0)) {
					$(obj.el + ' .bt-red-dot').remove()
					//增加红点
					$(obj.el).css('position','relative')
					$(obj.el).append('<div class="bt-red-dot inlineBlock ml6" style="position: absolute;background: #FF5050;'+ (obj.style || '') +'"></div>')
					$(obj.el).click(function (){
						if($(obj.el + ' .bt-red-dot').length) {
							$(obj.el + ' .bt-red-dot').remove()
							bt_tools.send({url: 'config?action=set_status_info',data: {name: obj.name,status: 1}},function (rdata) {
								bt_tools.send({url: '/config?action=set_popularize'},function (res) {})
								bt_tools.send({url: 'config?action=get_status_info'},function (res) {
									sessionStorage.setItem('newDotTipsData', JSON.stringify(res.msg))
								})
							})
						}
					})
				}
				
			}
		}
	},
	/**
	 * @description 选择文件目录或文件
	 * @param id {string} 元素ID
	 * @param type {string || function} 选择方式，文件或目录
	 * @param success {function} 成功后的回调
	 */
	select_path: function (id, type, success, default_path) {
		var _this = this;
		_this.set_cookie("SetName", "");
		if (typeof type !== 'string') success = type, type = 'dir';
		title = type === 'all' ? '选择目录和文件' : type === 'file' ? lan.bt.file : lan.bt.dir
		if(type === 'multiple') title = '选择目录和文件，支持多选';
		var loadT = bt.open({
			type: 1,
			area: "750px",
			title: title,
			closeBtn: 2,
			shift: 5,
			content: "<div class='changepath'>\
				<div class='path-top flex' style='justify-content: space-between;'>\
						<div>\
					<button type='button' id='btn_back' class='btn btn-default btn-sm'><span class='glyphicon glyphicon-share-alt'></span> " + lan['public']['return'] + "</button>\
					<div class='place' id='PathPlace'>" + lan.bt.path + "：<span></span>\
				</div>\
									</div>\
					<div>\
							<button type='button' id='btn_refresh' class='btn btn-default btn-sm'><span class='glyphicon glyphicon-repeat'></span> 刷新</button>\
						</div>\
					</div>\
					<div class='path-con'><div class='path-con-left'><dl><dt id='changecomlist' >" + lan.bt.comp + "</dt></dl></div><div class='path-con-right'><ul class='default' id='computerDefautl'></ul><div class='file-list divtable'><table class='table table-hover' style='border:0 none'><thead><tr class='file-list-head'><th width='5%'></th><th width='38%'>" + lan.bt.filename + "</th><th>备注</th><th width='24%'>" + lan.bt.etime + "</th><th width='8%'>" + lan.bt.access + "</th></tr></thead><tbody id='tbody' class='list-list'></tbody></table></div></div></div></div><div class='getfile-btn' style='margin-top:0'><button type='button' class='btn btn-default btn-sm pull-left' onclick='CreateFolder()'>" + lan.bt.adddir + "</button><button type='button' class='btn btn-danger btn-sm mr5' onclick=\"layer.close(getCookie('ChangePath'))\">" + lan['public'].close + "</button> <button type='button' id='bt_select' class='btn btn-success btn-sm' >" + lan.bt.path_ok + "</button></div>",
			success: function () {
				$('#btn_refresh').click(function () {
					var path = $("#PathPlace").find("span").text();
					path = bt.rtrim(bt.format_path(path), '/');
					var load = bt.load('正在刷新目录，请稍后...');
					_this.get_file_list(path, type,function () {
						load.close();
					});
				})
				$('#btn_back').on('click', function () {
					var path = $("#PathPlace").find("span").text();
					path = bt.rtrim(bt.format_path(path), '/');
					var back_path = bt.get_file_path(path);
					_this.get_file_list(back_path, type);
				})
				//选择
				$('#bt_select').on('click', function () {
					var path = [],trList = $('#tbody tr.active'),_type = 'dir'
					if (!trList.length && type == 'file') {
						layer.msg('请选择文件继续操作！', { icon: 0 })
						return false;
					}
					trList.each(function(){
						var $this = this;
						var $data = $(this).find('.fileItem').data();
						_type = $data.type;
						path.push(bt.rtrim($data.path, '/'))
					});
					if(path.length === 0) {
						path = [$("#PathPlace").find("span").text()]
					}
					$("#" + id).val(path[0]).change();
					$("." + id).val(path[0]).change();
					if (typeof success === "function") success(path[0], path,_type)
					loadT.close();
				});
				var element = $("#" + id), paths = element.val(), defaultPath = $('#defaultPath');
				if (defaultPath.length > 0 && element.parents('.tab-body').length > 0) {
					paths = defaultPath.text();
				}
				if (default_path) {
					paths = default_path;
				}
				_this.get_file_list(paths, type);
			}
		})
		_this.set_cookie('ChangePath', loadT.form);
	},

	get_file_list: function (path, type,callabck) {
		type = type || 'dir'
		var _that = this;
		bt.send('GetDir', 'files/GetDir', {
			path: path,
			disk: true
		}, function (rdata) {
			var d = '',
				a = '';
			if (rdata.DISK != undefined) {
				for (var f = 0; f < rdata.DISK.length; f++) {
					a += "<dd class=\"bt_open_dir\" path =\"" + rdata.DISK[f].path + "\"><span class='glyphicon glyphicon-hdd'></span>&nbsp;" + rdata.DISK[f].path + "</dd>"
				}
				$("#changecomlist").html(a)
			}
			for (var f = 0; f < rdata.DIR.length; f++) {
				var g = rdata.DIR[f].split(";");
				var e = g[0];
				var ps = g[10]
				if(ps != ''){
					ps =ps.split('：')[1];
					if(ps==undefined) ps = g[10].split(':')[1] ;
					if(ps==undefined) ps = g[10];
				}
				if (e.length > 20) {
					e = e.substring(0, 20) + "..."
				}
				if (isChineseChar(e)) {
					if (e.length > 10) {
						e = e.substring(0, 10) + "..."
					}
				}
				d += "<tr><td>" + ((type === 'all' || type === 'dir' || type === 'multiple') ? '<span style="display: flex;align-items: center;"><input style="margin: 0;" type=\"checkbox\" name="fileCheck" /></span>' : '') + "</td><td><a class='fileItem bt_open_dir' class=\"bt_open_dir\" data-path =\"" + rdata.PATH + "/" + g[0] + "\" title='" + g[0] + "' data-type=\"dir\"><span class='glyphicon glyphicon-folder-open'></span><span>" + e + "</span></a></td><td style='width:100px'><span style='  width: 100px;display: inline-block;text-overflow: ellipsis;overflow: hidden;white-space: pre;vertical-align: middle;'>"+ps+"</span></td><td>" + bt.format_data(g[2]) + "</td><td>" + g[3] + " | "+ g[4] + "</td></tr>"
			}

			if (rdata.FILES !== null && rdata.FILES !== "") {
				for (var f = 0; f < rdata.FILES.length; f++) {
					var g = rdata.FILES[f].split(";");
					var e = g[0];
					var ps = g[10]
					if(ps != ''){
						ps =ps.split('：')[1];
						if(ps==undefined) ps = g[10].split(':')[1] ;
						if(ps==undefined) ps = g[10];
					}
					if (e.length > 20) {
						e = e.substring(0, 20) + "..."
					}
					if (isChineseChar(e)) {
						if (e.length > 10) {
							e = e.substring(0, 10) + "..."
						}
					}
					d += "<tr><td>" + ((type === 'all' || type === 'file' || type === 'multiple') ? '<span  style="display: flex;align-items: center;"><input style="margin: 0;" type=\"checkbox\" name="fileCheck" /></span>' : '') + "<td><a class='fileItem bt_open_dir' class=\"bt_open_dir\" title='" + g[0] + "' data-type=\"files\" data-path =\"" + rdata.PATH + "/" + g[0] + "\"><span class='glyphicon glyphicon-file'></span><span>" + e + "</span></a></td><td style='width:100px'><span style='  width: 100px;display: inline-block;text-overflow: ellipsis;overflow: hidden;white-space: pre;vertical-align: middle;'>"+ps+"</span></td><td>" + bt.format_data(g[2]) + "</td><td>" + g[3] + " | "+ g[4] + "</td></tr>"
				}
			}

			$(".default").hide();
			$(".file-list").show();
			$("#tbody").html(d);
			if (rdata.PATH.substr(rdata.PATH.length - 1, 1) !== "/") {
				rdata.PATH += "/"
			}
			$("#PathPlace").find("span").html(rdata.PATH);
			$("#tbody tr").click(function () {
				if ($(this).find('td:eq(0) input').length > 0) {
					if ($(this).hasClass('active')) {
						$(this).removeClass('active');
						$(this).find('td:eq(0) input').prop('checked', false);
					} else {
						$(this).addClass('active');
						$(this).find('td:eq(0) input').prop('checked', true);
						if(!(type === 'multiple')){
							$(this).addClass('active').siblings().removeClass('active');
							$(this).siblings().find('td:eq(0) input').prop('checked', false);
						}
					}
				}
			});
			$('#changecomlist dd').click(function () {
				_that.get_file_list($(this).attr('path'), type);
			});
			$('.bt_open_dir').click(function () {
				var data = $(this).data();
				if (data.type === 'dir') _that.get_file_list(data.path, type);
			})
			if(callabck) callabck(rdata);
		})
	},
	// /**
	//  * @description 选择文件目录或文件
	//  * @param id {string} 元素ID
	//  * @param type {string || function} 选择方式，文件或目录
	//  * @param success {function} 成功后的回调
	//  */
	// select_path: function (id, type, success, default_path) {
	// 	var _this = this;
	// 	_this.set_cookie('SetName', '');
	// 	if (typeof type !== 'string') (success = type), (type = 'dir');
	// 	var loadT = bt.open({
	// 		type: 1,
	// 		area: '650px',
	// 		title: type === 'all' ? '选择目录和文件' : type === 'file' ? lan.bt.file : lan.bt.dir,
	// 		closeBtn: 2,
	// 		shift: 5,
	// 		content:
	// 			"<div class='changepath'><div class='path-top'><button type='button' id='btn_back' class='btn btn-default btn-sm'><span class='glyphicon glyphicon-share-alt'></span> " +
	// 			lan['public']['return'] +
	// 			"</button><div class='place' id='PathPlace'>" +
	// 			lan.bt.path +
	// 			"：<span></span></div></div><div class='path-con'><div class='path-con-left'><dl><dt id='changecomlist' >" +
	// 			lan.bt.comp +
	// 			"</dt></dl></div><div class='path-con-right'><ul class='default' id='computerDefautl'></ul><div class='file-list divtable'><table class='table table-hover' style='border:0 none'><thead><tr class='file-list-head'><th width='5%'></th><th width='38%'>" +
	// 			lan.bt.filename +
	// 			"</th><th width='24%'>" +
	// 			lan.bt.etime +
	// 			"</th><th width='8%'>" +
	// 			lan.bt.access +
	// 			"</th><th width='15%'>" +
	// 			lan.bt.own +
	// 			"</th></tr></thead><tbody id='tbody' class='list-list'></tbody></table></div></div></div></div><div class='getfile-btn' style='margin-top:0'><button type='button' class='btn btn-default btn-sm pull-left' onclick='CreateFolder()'>" +
	// 			lan.bt.adddir +
	// 			"</button><button type='button' class='btn btn-danger btn-sm mr5' onclick=\"layer.close(getCookie('ChangePath'))\">" +
	// 			lan['public'].close +
	// 			"</button> <button type='button' id='bt_select' class='btn btn-success btn-sm' >" +
	// 			lan.bt.path_ok +
	// 			'</button></div>',
	// 		success: function () {
	// 			$('#btn_back').on('click', function () {
	// 				var path = $('#PathPlace').find('span').text();
	// 				path = bt.rtrim(bt.format_path(path), '/');
	// 				var back_path = bt.get_file_path(path);
	// 				_this.get_file_list(back_path, type);
	// 			});
	// 			//选择
	// 			$('#bt_select').on('click', function () {
	// 				var path = bt.format_path($('#PathPlace').find('span').text());
	// 				var _type = 'dir';
	// 				if (type === 'file' && !$('#tbody tr.active').length) {
	// 					layer.msg('请选择文件后继续操作！', { icon: 0 });
	// 					return false;
	// 				}
	// 				if ($('#tbody tr').hasClass('active')) {
	// 					path = $('#tbody tr.active .bt_open_dir').attr('path');
	// 					_type = $('#tbody tr.active .bt_open_dir').data('type'); //返回类型
	// 				}
	// 				path = bt.rtrim(path, '/');
	// 				$('#' + id)
	// 					.val(path)
	// 					.change();
	// 				$('.' + id)
	// 					.val(path)
	// 					.change();
	// 				if (typeof success === 'function') success(path, _type);
	// 				loadT.close();
	// 			});
	// 			var element = $('#' + id),
	// 				paths = element.val(),
	// 				defaultPath = $('#defaultPath');
	// 			if (defaultPath.length > 0 && element.parents('.tab-body').length > 0) {
	// 				paths = defaultPath.text();
	// 			}
	// 			if (default_path) {
	// 				paths = default_path;
	// 			}
	// 			_this.get_file_list(paths, type);
	// 		},
	// 	});
	// 	_this.set_cookie('ChangePath', loadT.form);
	// },
	// get_file_list: function (path, type) {
	// 	type = type || 'dir';
	// 	var _that = this;
	// 	bt.send(
	// 		'GetDir',
	// 		'files/GetDir',
	// 		{
	// 			path: path,
	// 			disk: true,
	// 		},
	// 		function (rdata) {
	// 			var d = '',
	// 				a = '';

	// 			rdata.PATH = bt.rtrim(rdata.PATH, '/');
	// 			if (rdata.DISK != undefined) {
	// 				for (var f = 0; f < rdata.DISK.length; f++) {
	// 					a += '<dd class="bt_open_dir" path ="' + rdata.DISK[f].path + "\"><span class='glyphicon glyphicon-hdd'></span>&nbsp;" + rdata.DISK[f].path + '</dd>';
	// 				}
	// 				$('#changecomlist').html(a);
	// 			}
	// 			for (var f = 0; f < rdata.DIR.length; f++) {
	// 				var g = rdata.DIR[f].split(';');
	// 				var e = g[0];
	// 				if (e.length > 20) {
	// 					e = e.substring(0, 20) + '...';
	// 				}
	// 				if (isChineseChar(e)) {
	// 					if (e.length > 10) {
	// 						e = e.substring(0, 10) + '...';
	// 					}
	// 				}
	// 				d +=
	// 					'<tr><td>' +
	// 					(type === 'all' || type === 'dir' ? '<input type="checkbox" />' : '') +
	// 					'</td><td class="bt_open_dir" path ="' +
	// 					rdata.PATH +
	// 					'/' +
	// 					g[0] +
	// 					'" data-type="dir" title=\'' +
	// 					g[0] +
	// 					"'><span class='glyphicon glyphicon-folder-open'></span><span>" +
	// 					e +
	// 					'</span></td><td>' +
	// 					bt.format_data(g[2]) +
	// 					'</td><td>' +
	// 					g[3] +
	// 					'</td><td>' +
	// 					g[4] +
	// 					'</td></tr>';
	// 			}

	// 			if (rdata.FILES != null && rdata.FILES != '') {
	// 				for (var f = 0; f < rdata.FILES.length; f++) {
	// 					var g = rdata.FILES[f].split(';');
	// 					var e = g[0];
	// 					if (e.length > 20) {
	// 						e = e.substring(0, 20) + '...';
	// 					}
	// 					if (isChineseChar(e)) {
	// 						if (e.length > 10) {
	// 							e = e.substring(0, 10) + '...';
	// 						}
	// 					}

	// 					d +=
	// 						'<tr><td>' +
	// 						(type === 'all' || type === 'file' ? '<input type="checkbox" />' : '') +
	// 						'<td class="bt_open_dir" title=\'' +
	// 						g[0] +
	// 						'\' data-type="files" path ="' +
	// 						rdata.PATH +
	// 						'/' +
	// 						g[0] +
	// 						"\"><span class='glyphicon glyphicon-file'></span><span>" +
	// 						e +
	// 						'</span></td><td>' +
	// 						bt.format_data(g[2]) +
	// 						'</td><td>' +
	// 						g[3] +
	// 						'</td><td>' +
	// 						g[4] +
	// 						'</td></tr>';
	// 				}
	// 			}

	// 			$('.default').hide();
	// 			$('.file-list').show();
	// 			$('#tbody').html(d);
	// 			if (rdata.PATH.substr(rdata.PATH.length - 1, 1) != '/') {
	// 				rdata.PATH += '/';
	// 			}
	// 			$('#PathPlace').find('span').html(rdata.PATH);
	// 			$('#tbody tr').click(function () {
	// 				if ($(this).find('td:eq(0) input').length > 0) {
	// 					if ($(this).hasClass('active')) {
	// 						$(this).removeClass('active');
	// 						$(this).find('td:eq(0) input').prop('checked', false);
	// 					} else {
	// 						$(this).find('td:eq(0) input').prop('checked', true);
	// 						$(this).siblings().find('td:eq(0) input').prop('checked', false);
	// 						$(this).addClass('active').siblings().removeClass('active');
	// 					}
	// 				}
	// 			});
	// 			$('#changecomlist dd').click(function () {
	// 				_that.get_file_list($(this).attr('path'), type);
	// 			});
	// 			$('.bt_open_dir span').click(function () {
	// 				if ($(this).parent().data('type') == 'dir') _that.get_file_list($(this).parent().attr('path'), type);
	// 			});
	// 		}
	// 	);
	// },
	prompt_confirm: function (title, msg, callback) {
		layer.open({
			type: 1,
			title: title,
			area: '350px',
			closeBtn: 2,
			btn: ['确认', '取消'],
			content:
				"<div class='bt-form promptDelete pd20'>\
								<p>" +
				msg +
				"</p>\
								<div class='confirm-info-box'>\
									<input onpaste='return false;' id='prompt_input_box' type='text' value=''>\
									<div class='placeholder c9 prompt_input_tips' >如果确认操作，请手动输入‘<font style='color: red'>" +
				title +
				"</font>’</div>\
											<div style='margin-top:5px;display: none;' class='prompt_input_ps'>验证码错误，请手动输入‘<font style='color: red'>" +
				title +
				'</font>’</div></div>\
								</div>',
			success: function () {
				var black_txt_ = $('#prompt_input_box');

				$('.placeholder').click(function () {
					$(this).hide().siblings('input').focus();
				});
				black_txt_.focus(function () {
					$('.prompt_input_tips.placeholder').hide();
				});
				black_txt_.blur(function () {
					black_txt_.val() == '' ? $('.prompt_input_tips.placeholder').show() : $('.prompt_input_tips.placeholder').hide();
				});
				black_txt_.keyup(function () {
					if (black_txt_.val() == '') {
						$('.prompt_input_tips.placeholder').show();
						$('.prompt_input_ps').hide();
					} else {
						$('.prompt_input_tips.placeholder').hide();
					}
				});
			},
			yes: function (layers, index) {
				var result = bt.replace_all($('#prompt_input_box').val(), ' ', '');
				if (result == title) {
					layer.close(layers);
					if (callback) callback();
				} else {
					$('.prompt_input_ps').show();
				}
			},
		});
	},
	show_confirm: function (title, msg, callback, error) {
		var d = Math.round(Math.random() * 9 + 1),
			c = Math.round(Math.random() * 9 + 1),
			t = d + ' + ' + c,
			e = d + c;

		function submit(index, layero) {
			var a = $('#vcodeResult'),
				val = a.val().replace(/ /g, '');
			if (val == undefined || val == '') {
				layer.msg(lan.bt.cal_err);
				return;
			}
			if (val != a.data('value')) {
				layer.msg(lan.bt.cal_err);
				return;
			}
			layer.close(index);
			if (callback) callback();
		}
		layer.open({
			type: 1,
			title: title,
			area: '365px',
			closeBtn: 2,
			shadeClose: true,
			btn: [lan['public'].ok, lan['public'].cancel],
			content:
				"<div class='bt-form webDelete pd20'>\
						<p style='font-size:13px;word-break: break-all;margin-bottom: 5px;'>" +
				msg +
				'</p>' +
				(error || '') +
				"<div class='vcode'>" +
				lan.bt.cal_msg +
				"<span class='text'>" +
				t +
				"</span>=<input type='number' id='vcodeResult' data-value='" +
				e +
				"' value=''></div>\
					</div>",
			success: function (layero, index) {
				$('#vcodeResult')
					.focus()
					.keyup(function (a) {
						if (a.keyCode == 13) {
							submit(index, layero);
						}
					});
			},
			yes: submit,
		});
	},
	/**
	 * @description 普通提示弹窗
	 * @param {Object} config 弹窗对象 {title:标题, msg:提示内容}
	 * @param {function} callback 确认回调函数
	 * @param {function} callback1 取消回调函数
	 */
	simple_confirm: function (config, callback, callback1) {
		layer.open({
			type: 1,
			title: config.title,
			area: '430px',
			closeBtn: 2,
			shadeClose: false,
			btn: config['btn'] ? config.btn : [lan['public'].ok, lan['public'].cancel],
			content:
				'<div class="bt-form hint_confirm pd30">\
					<div class="hint_title">\
						<i class="hint-confirm-icon"></i>\
						<div class="hint_con">' +
				config.msg +
				'</div>\
					</div>\
				</div>',
			yes: function (index, layero) {
				if (callback && typeof callback(index) === 'undefined') layer.close(index);
			},
			btn2: function (index) {
				//取消返回回调
				if (callback1 && typeof callback1(index) === 'undefined') layer.close(index);
			},
			cancel: function (index) {
				//取消返回回调
				if (callback1 && typeof callback1(index) === 'undefined') layer.close(index);
			}
		});
	},
	/**
	 * @description 计算提示弹窗
	 * @param {Object} config 弹窗对象 {title: 提示标题, msg: 提示内容}
	 * @param {function} callback 回调函数
	 */
	compute_confirm: function (config, callback) {
		var d = Math.round(Math.random() * 9 + 1),
			c = Math.round(Math.random() * 9 + 1),
			t = d + ' + ' + c,
			e = d + c;

		function submit(index, layero) {
			var a = $('#vcodeResult'),
				val = a.val().replace(/ /g, '');
			if (val == undefined || val == '') {
				layer.msg(lan.bt.cal_err);
				return;
			}
			if (val != a.data('value')) {
				layer.msg(lan.bt.cal_err);
				return;
			}
			layer.close(index);
			if (callback) callback();
		}
		layer.open({
			type: 1,
			title: config.title,
			area: '430px',
			closeBtn: 2,
			shadeClose: true,
			btn: [lan['public'].ok, lan['public'].cancel],
			content:
				'<div class="bt-form hint_confirm pd30">\
						<div class="hint_title">\
							<i class="hint-confirm-icon"></i>\
							<div class="hint_con">' +
				config.msg +
				'</div>\
						</div>\
						<div class="vcode">计算验证：<span class="text">' +
				t +
				'</span>=<input type="number" id="vcodeResult" data-value="' +
				e +
				'" value=""></div>\
				</div>',
			success: function (layero, index) {
				$('#vcodeResult')
					.focus()
					.keyup(function (a) {
						if (a.keyCode == 13) {
							submit(index, layero);
						}
					});
			},
			yes: submit,
		});
	},
	/**
	 * @description 输入提示弹窗
	 * @param {Object} config 弹窗对象 {title: 提示标题, value: 输入值, msg: 提示内容}
	 * @param {function} callback 回调函数
	 */
	input_confirm: function (config, callback) {
		layer.open({
			type: 1,
			title: config.title,
			area: '430px',
			closeBtn: 2,
			shadeClose: true,
			btn: [lan['public'].ok, lan['public'].cancel],
			content:
				'<div class="bt-form hint_confirm pd30">\
						<div class="hint_title">\
							<i class="hint-confirm-icon"></i>\
							<div class="hint_con">' +
				config.msg +
				'</div>\
						</div>\
						<div class="confirm-info-box">\
							<div>请手动输入“<span class="color-org">' +
				config.value +
				'</span>”，完成验证</div>\
							<input onpaste="return false;" id="prompt_input_box" type="text" value="" autocomplete="off">\
						</div>\
				</div>',
			yes: function (layers, index) {
				var result = bt.replace_all($('#prompt_input_box').val(), ' ', '');
				if (result == config.value) {
					layer.close(layers);
					if (callback) callback();
				} else {
					$('#prompt_input_box').focus();
					return layer.msg('验证失败，请重新输入', { icon: 2 });
				}
			},
		});
	},
	to_login: function () {
		layer.confirm(
			'您的登陆状态已过期，请重新登陆!',
			{
				title: '会话已过期',
				icon: 2,
				closeBtn: 1,
				shift: 5,
			},
			function () {
				location.reload();
			}
		);
	},
	do_login: function () {
		bt.confirm(
			{
				msg: lan.bt.loginout,
			},
			function () {
				window.location.href = '/login?dologin=True';
			}
		);
	},
	send: function (response, module, data, callback, param) {
		// if (sType == undefined) sType = 1;

		module = module.replace('panel_data', 'data');
		var sType = 1;
		var str = bt.get_random(16);
		console.time(str);
		if (!response) alert(lan.get('lack_param', ['response']));
		modelTmp = module.split('/');
		if (modelTmp.length < 2) alert(lan.get('lack_param', ['s_module', 'action']));
		if (bt.os == 'Linux' && sType === 0) {
			socket.on(response, function (rdata) {
				socket.removeAllListeners(response);
				var rRet = rdata.data;
				if (rRet.status === -1) {
					bt.to_login();
					return;
				}
				console.timeEnd(str);
				if (callback) callback(rRet);
			});
			if (!data) data = {};
			data = bt.linux_format_param(data);
			data['s_response'] = response;
			data['s_module'] = modelTmp[0];
			data['action'] = modelTmp[1];
			socket.emit('panel', data);
		} else {
			data = bt.win_format_param(data);
			var url = '/' + modelTmp[0] + '?action=' + modelTmp[1];
			$.post(url, data, function (rdata) {
				//会话失效时自动跳转到登录页面
				if (typeof rdata == 'string') {
					if ((rdata.indexOf('/static/favicon.ico') != -1 && rdata.indexOf('/static/img/qrCode.png') != -1) || rdata.indexOf('<!DOCTYPE html>') === 0) {
						window.location.href = '/login';
						return;
					}
					// 请求结果为字符串并且开头有traceback 弹报错窗口
					if(rdata.startsWith('Traceback')) {
						error_find = 0
						gl_error_body = '<!--<!--' + rdata
						var pro = parseInt(bt.get_cookie('pro_end') || -1);
						var ltd = parseInt(bt.get_cookie('ltd_end') || -1);
						isBuy = pro == 0 || ltd > 0 ? true : false;
						show_error_message()
						return
					}
				}

				if(param && param.hasOwnProperty('verify') && param['verify'] === true) {
					// 请求结果为对象
					if (typeof rdata === 'object' && rdata.status === false && (rdata.hasOwnProperty('msg') || rdata.hasOwnProperty('error_msg'))) {
						bt_tools.msg({ status: rdata.status, msg: !rdata.hasOwnProperty('msg') ? rdata.error_msg : rdata.msg });
						return false;
					}
				}

				if (callback) callback(rdata);
			}).error(function (e, f) {
				if (callback) callback('error');
			});
		}
	},
	linux_format_param: function (param) {
		if (typeof param == 'string') {
			var data = {};
			arr = param.split('&');
			var reg = /(^[^=]*)=(.*)/;
			for (var i = 0; i < arr.length; i++) {
				var tmp = arr[i].match(reg);
				if (tmp.length >= 3) data[tmp[1]] = tmp[2] == 'undefined' ? '' : tmp[2];
			}
			return data;
		}
		return param;
	},
	win_format_param: function (param) {
		if (typeof data == 'object') {
			var data = '';
			for (var key in param) {
				data += key + '=' + param[key] + '&';
			}
			if (data.length > 0) data = data.substr(0, data.length - 1);
			return data;
		}
		return param;
	},
	msg: function (config) {
		var btns = [];
		if(config.code === -1){
			config.closeBtn = 1
			config.time = 0
		}
		var btnObj = {
			title: config.title ? config.title : false,
			shadeClose: config.shadeClose ? config.shadeClose : true,
			closeBtn: config.closeBtn ? config.closeBtn : 0,
			scrollbar: true,
			shade: 0.3,
		};
		if (!config.hasOwnProperty('time')) config.time = 2000;
		if (typeof config.msg == 'string' && bt.contains(config.msg, 'ERROR')) config.time = 0;

		if (config.hasOwnProperty('icon')) {
			if (typeof config.icon == 'boolean') config.icon = config.icon ? 1 : 2;
		} else if (config.hasOwnProperty('status')) {
			config.icon = config.status ? 1 : 2;
			if (!config.status) {
				btnObj.time = 0;
			}
		}
		if (config.icon) btnObj.icon = config.icon;
		btnObj.time = config.time;
		var msg = '';
		if (config.msg) msg += config.msg;
		if (config.msg_error) msg += config.msg_error;
		if (config.msg_solve) msg += config.msg_solve;

		layer.msg(msg, btnObj);
	},
	confirm: function (config, callback, callback1) {
		var btnObj = {
			title: config.title ? config.title : false,
			time: config.time ? config.time : 0,
			shadeClose: config.shadeClose !== undefined ? config.shadeClose : true,
			closeBtn: config.closeBtn ? config.closeBtn : 2,
			scrollbar: true,
			shade: 0.3,
			icon: 3,
			skin: config.skin ? config.skin : '',
			cancel: config.cancel ? config.cancel : function () {},
		};
		layer.confirm(
			config.msg,
			btnObj,
			function (index) {
				if (callback) callback(index);
			},
			function (index) {
				if (callback1) callback1(index);
			}
		);
	},
	load: function (msg) {
		if (!msg) msg = lan['public'].the;
		var loadT = layer.msg(msg, {
			icon: 16,
			time: 0,
			shade: [0.3, '#000'],
		});
		var load = {
			form: loadT,
			close: function () {
				layer.close(load.form);
			},
		};
		return load;
	},
	open: function (config) {
		config.closeBtn = 2;
		var loadT = layer.open(config);
		var load = {
			form: loadT,
			close: function () {
				layer.close(load.form);
			},
		};
		return load;
	},
	closeAll: function () {
		layer.closeAll();
	},
	check_select: function () {
		setTimeout(function () {
			var num = $('input[type="checkbox"].check:checked').length;
			if (num == 1) {
				$('button[batch="true"]').hide();
				$('button[batch="false"]').show();
			} else if (num > 1) {
				$('button[batch="true"]').show();
				$('button[batch="false"]').show();
			} else {
				$('button[batch="true"]').hide();
				$('button[batch="false"]').hide();
			}
		}, 5);
	},
	render_help: function (arr) {
		var html = '<ul class="help-info-text c7">';
		for (var i = 0; i < arr.length; i++) {
			html += '<li>' + arr[i] + '</li>';
		}
		html += '</ul>';
		return html;
	},
	render_ps: function (item) {
		var html = "<p class='p1'>" + item.title + '</p>';
		for (var i = 0; i < item.list.length; i++) {
			html += '<p><span>' + item.list[i].title + '：</span><strong>' + item.list[i].val + '</strong></p>';
		}
		html += '<p style="margin-bottom: 19px; margin-top: 11px; color: #666"></p>';
		return html;
	},
	render_table: function (obj, arr, append) {
		//渲染表单表格
		var html = '';
		for (var key in arr) {
			if (arr.hasOwnProperty(key)) {
				html += '<tr><th>' + key + '</th>';
				if (typeof arr[key] != 'object') {
					html += '<td>' + arr[key] + '</td>';
				} else {
					for (var i = 0; i < arr[key].length; i++) {
						html += '<td>' + arr[key][i] + '</td>';
					}
				}
				html += '</tr>';
			}
		}
		if (append) {
			$('#' + obj).append(html);
		} else {
			$('#' + obj).html(html);
		}
	},

	fixed_table: function (name) {
		$('#' + name)
			.parent()
			.bind('scroll', function () {
				var scrollTop = this.scrollTop;
				$(this)
					.find('thead')
					.css({
						transform: 'translateY(' + scrollTop + 'px)',
						position: 'relative',
						'z-index': '1',
					});
			});
	},
	render_tab: function (obj, arr) {
		var _obj = $('#' + obj).addClass('tab-nav');
		for (var i = 0; i < arr.length; i++) {
			var item = arr[i];
			var _tab = $('<span ' + (item.on ? 'class="on"' : '') + '>' + item.title + '</span>');
			if (item.callback) {
				_tab.data('callback', item.callback);
				_tab.click(function () {
					$('#' + obj)
						.find('span')
						.removeClass('on');
					$(this).addClass('on');
					var _contents = $('#' + obj).next('.tab-con');
					_contents.html('');
					$(this).data('callback')(_contents);
				});
			}
			_obj.append(_tab);
		}
	},
	render_form_line: function (item, bs, form) {
		var clicks = [],
			_html = '',
			_hide = '',
			is_title_css = ' ml0';
		if (!bs) bs = '';
		if (item.title) {
			_html += '<span class="tname">' + item.title + '</span>';
			is_title_css = '';
		}
		_html += "<div class='info-r " + item['class'] + ' ' + is_title_css + "'>";

		var _name = item.name;
		var _placeholder = item.placeholder;
		if (item.items && item.type != 'select') {
			for (var x = 0; x < item.items.length; x++) {
				var _obj = item.items[x];
				if (!_name && !_obj.name) {
					alert('缺少必要参数name');
					return;
				}
				if (_obj.hide) continue;
				if (_obj.name) _name = _obj.name;
				if (_obj.placeholder) _placeholder = _obj.placeholder;
				if (_obj.title) _html += '<div class="inlineBlock mr5"><span class="mr5">' + _obj.title + '</span>  ';
				switch (_obj.type) {
					case 'select':
						var _width = _obj.width ? _obj.width : '100px';
						_html += '<select ' + (_obj.disabled ? 'disabled' : '') + ' class="bt-input-text mr5 ' + _name + bs + '" name="' + _name + '" style="width:' + _width + '">';
						for (var j = 0; j < _obj.items.length; j++) {
							_html += '<option ' + (_obj.value == _obj.items[j].value ? 'selected' : '') + ' value="' + _obj.items[j].value + '">' + _obj.items[j].title + '</option>';
						}
						_html += '</select>';
						break;
					case 'textarea':
						var _width = _obj.width ? _obj.width : '330px';
						var _height = _obj.height ? _obj.height : '100px';
						_html +=
							'<textarea class="bt-input-text mr20 ' +
							_name +
							bs +
							'" name="' +
							_name +
							'" style="width:' +
							_width +
							';height:' +
							_height +
							';line-height:22px">' +
							(_obj.value ? _obj.value : '') +
							'</textarea>';
						if (_placeholder) _html += '<div class="placeholder c9" style="top: 15px; left: 15px; display: block;">' + _placeholder + '</div>';
						break;
					case 'button':
						var _width = _obj.width ? _obj.width : '330px';
						_html += '<button type="button" name=\'' + _name + '\' class="btn btn-'+(_obj['color']?_obj['color']:'success')+' btn-sm mr5 ml5 ' + _name + bs + ' ' + (_obj['class'] ? _obj['class'] : '') + '">' + _obj.text + '</button>';
						break;
					case 'radio':
						var _v = _obj.value === true ? 'checked' : '';
						_html +=
							'<input type="radio" class="' +
							_name +
							'" id="' +
							_name +
							'" name="' +
							_name +
							'"  ' +
							_v +
							'><label class="mr20" for="' +
							_name +
							'" style="font-weight:normal">' +
							_obj.text +
							'</label>';
						break;
					case 'checkbox':
						var _v = _obj.value === true ? 'checked' : '';
						_html +=
							'<input type="checkbox" class="' +
							_name +
							'" id="' +
							_name +
							'" name="' +
							_name +
							'"  ' +
							_v +
							'><label class="mr20" for="' +
							_name +
							'" style="font-weight:normal">' +
							_obj.text +
							'</label>';
						break;
					case 'number':
						var _width = _obj.width ? _obj.width : '330px';
						_html +=
							"<input name='" +
							_name +
							"' " +
							(_obj.disabled ? 'disabled' : '') +
							" class='bt-input-text mr5 " +
							_name +
							bs +
							"' " +
							(_placeholder ? ' placeholder="' + _placeholder + '"' : '') +
							" type='number' style='width:" +
							_width +
							"' value='" +
							(_obj.value ? _obj.value : '0') +
							"' />";
						_html += _obj.unit ? _obj.unit : '';
						break;
					case 'password':
						var _width = _obj.width ? _obj.width : '330px';
						_html +=
							"<input name='" +
							_name +
							"' " +
							(_obj.disabled ? 'disabled' : '') +
							" class='bt-input-text mr5 " +
							_name +
							bs +
							"' " +
							(_placeholder ? ' placeholder="' + _placeholder + '"' : '') +
							" type='password' style='width:" +
							_width +
							"' value='" +
							(_obj.value ? _obj.value : '') +
							"' />";
						break;
					case 'div':
						var _width = _obj.width ? _obj.width : '330px';
						var _height = _obj.height ? _obj.height : '100px';
						_html +=
							'<div class="bt-input-text ace_config_editor_scroll mr20 ' +
							_name +
							bs +
							'" name="' +
							_name +
							'" style="width:' +
							_width +
							';height:' +
							_height +
							';line-height:22px">' +
							(_obj.value ? _obj.value : '') +
							'</div>';
						if (_placeholder) _html += '<div class="placeholder c9" style="top: 15px; left: 15px; display: block;">' + _placeholder + '</div>';
						break;
					case 'switch':
						_html +=
							'<div style="display: inline-block;vertical-align: middle;">\
															<input type="checkbox" id="' +
							_name +
							'" ' +
							(_obj.value == true ? 'checked' : '') +
							' class="btswitch btswitch-ios">\
															<label class="btswitch-btn" for="' +
							_name +
							'" style="margin-top:5px;"></label>\
													</div>';
						break;
					case 'other':
						_html += _obj.boxcontent;
						break;
					default:
						var _width = _obj.width ? _obj.width : '330px';

						_html +=
							"<input name='" +
							_name +
							"' " +
							(_obj.disabled ? 'disabled' : '') +
							" class='bt-input-text mr5 " +
							_name +
							bs +
							"' " +
							(_placeholder ? ' placeholder="' + _placeholder + '"' : '') +
							" type='text' style='width:" +
							_width +
							"' value='" +
							(_obj.value ? _obj.value : '') +
							"' />";
						break;
				}
				if (_obj.title) _html += '</div>';
				if (_obj.callback != undefined)
					clicks.push({
						bind: _name + bs,
						callback: _obj.callback,
					});

				if (_obj.event) {
					_html += '<span data-id="' + _name + bs + '" class="glyphicon cursor mr5 ' + _obj.event.css + ' icon_' + _name + bs + '" ></span>';
					if (_obj.event.callback)
						clicks.push({
							bind: 'icon_' + _name + bs,
							callback: _obj.event.callback,
						});
				}
				if (_obj.ps) _html += " <span class='c9 mt10'>" + _obj.ps + '</span>';
				if (_obj.ps_help) _html += "<span class='bt-ico-ask " + _obj.name + "_help' tip='" + _obj.ps_help + "'>?</span>";
			}
			if (item.ps) _html += " <span class='c9 mt10'>" + item.ps + '</span>';
		} else {
			switch (item.type) {
				case 'select':
					var _width = item.width ? item.width : '100px';
					_html += '<select ' + (item.disabled ? 'disabled' : '') + ' class="bt-input-text mr5 ' + _name + bs + '" name="' + _name + '" style="width:' + _width + '">';
					for (var j = 0; j < item.items.length; j++) {
						_html += '<option ' + (item.value == item.items[j].value ? 'selected' : '') + ' value="' + item.items[j].value + '">' + item.items[j].title + '</option>';
					}
					_html += '</select>';
					break;
				case 'button':
					var _width = item.width ? item.width : '330px';
					_html += '<button type="button" name=\'' + _name + '\' class="btn btn-success btn-sm mr5 ml5 ' + _name + bs + '">' + item.text + '</button>';
					break;
				case 'number':
					var _width = item.width ? item.width : '330px';
					_html +=
						"<input name='" +
						item.name +
						"' " +
						(item.disabled ? 'disabled' : '') +
						" class='bt-input-text mr5 " +
						_name +
						bs +
						"' " +
						(_placeholder ? ' placeholder="' + _placeholder + '"' : '') +
						" type='number' style='width:" +
						_width +
						"' value='" +
						(item.value ? item.value : '0') +
						"' />";
					break;
				case 'checkbox':
					var _v = item.value === true ? 'checked' : '';
					_html +=
						'<input type="checkbox" class="' +
						_name +
						'" id="' +
						_name +
						'" name="' +
						_name +
						'"  ' +
						_v +
						'><label class="mr20" for="' +
						_name +
						'" style="font-weight:normal">' +
						item.text +
						'</label>';
					break;
				case 'password':
					var _width = item.width ? item.width : '330px';
					_html +=
						"<input name='" +
						_name +
						"' " +
						(item.disabled ? 'disabled' : '') +
						" class='bt-input-text mr5 " +
						_name +
						bs +
						"' " +
						(_placeholder ? ' placeholder="' + _placeholder + '"' : '') +
						" type='password' style='width:" +
						_width +
						"' value='" +
						(item.value ? item.value : '') +
						"' />";
					break;
				case 'textarea':
					var _width = item.width ? item.width : '330px';
					var _height = item.height ? item.height : '100px';
					_html +=
						'<textarea class="bt-input-text mr20 ' +
						_name +
						bs +
						'"  ' +
						(item.disabled ? 'disabled' : '') +
						'  name="' +
						_name +
						'" style="width:' +
						_width +
						';height:' +
						_height +
						';line-height:22px">' +
						(item.value ? item.value : '') +
						'</textarea>';
					if (_placeholder) _html += '<div class="placeholder c9" style="top: 15px; left: 15px; display: block;">' + _placeholder + '</div>';
					break;
				case 'other':
					_html += item.boxcontent;
					break;
				default:
					var _width = item.width ? item.width : '330px';
					_html +=
						"<input name='" +
						item.name +
						"' " +
						(item.disabled ? 'disabled' : '') +
						" class='bt-input-text mr5 " +
						_name +
						bs +
						"' " +
						(_placeholder ? ' placeholder="' + _placeholder + '"' : '') +
						" type='text' style='width:" +
						_width +
						"' value='" +
						(item.value ? item.value : '') +
						"' />";
					break;
			}
			if (item.callback)
				clicks.push({
					bind: _name + bs,
					callback: item.callback,
				});
			if (item.ps) _html += " <span class='c9 mt10 mr5'>" + item.ps + '</span>';
		}
		_html += '</div>';
		if (!item['class']) item['class'] = '';
		if (item.hide) _hide = 'style="display:none;"';
		_html = '<div class="line ' + item['class'] + '" ' + _hide + '>' + _html + '</div>';

		if (form) {
			form.append(_html);
			bt.render_clicks(clicks);
		}
		return {
			html: _html,
			clicks: clicks,
			data: item,
		};
	},
	render_form: function (data, callback) {
		if (data) {
			var bs = '_' + bt.get_random(6);
			var _form = $("<div data-id='form" + bs + "' class='bt-form bt-form pd20 pb70 " + (data['class'] ? data['class'] : '') + "'></div>");
			var _lines = data.list;
			var clicks = [];
			for (var i = 0; i < _lines.length; i++) {
				var _obj = _lines[i];
				if (_obj.hasOwnProperty('html')) {
					_form.append(_obj.html);
				} else {
					var rRet = bt.render_form_line(_obj, bs);
					for (var s = 0; s < rRet.clicks.length; s++) clicks.push(rRet.clicks[s]);
					_form.append(rRet.html);
				}
			}

			var _btn_html = '';
			for (var i = 0; i < data.btns.length; i++) {
				var item = data.btns[i];
				var css = item.css ? item.css : 'btn-danger';
				_btn_html += "<button type='button' class='btn btn-sm " + css + ' ' + item.name + bs + "' >" + item.title + '</button>';
				clicks.push({
					bind: item.name + bs,
					callback: item.callback,
				});
			}
			_form.append("<div class='bt-form-submit-btn'>" + _btn_html + '</div>');
			var loadOpen = bt.open({
				type: 1,
				skin: data.skin,
				area: data.area,
				title: data.title,
				closeBtn: 2,
				content: _form.prop('outerHTML'),
				end: data.end ? data.end : false,
				success: function () {
					$(':focus').blur();
					if (data.yes) data.yes();
				},
			});
			setTimeout(function () {
				bt.render_clicks(clicks, loadOpen, callback);
			}, 100);
		}
		return bs;
	},
	render_clicks: function (clicks, loadOpen, callback) {
		for (var i = 0; i < clicks.length; i++) {
			var obj = clicks[i];

			var btn = $('.' + obj.bind);
			btn.data('item', obj);
			btn.data('load', loadOpen);
			btn.data('callback', callback);

			switch (btn.prop('tagName')) {
				case 'SPAN':
					btn.click(function () {
						var _obj = $(this).data('item');
						_obj.callback($(this).attr('data-id'));
					});
					break;
				case 'SELECT':
					btn.change(function () {
						var _obj = $(this).data('item');
						_obj.callback($(this));
					});
					break;
				case 'TEXTAREA':
				case 'INPUT':
				case 'BUTTON':
					if (btn.prop('tagName') == 'BUTTON' || btn.attr('type') == 'checkbox') {
						btn.click(function () {
							var _obj = $(this).data('item');
							var load = $(this).data('load');
							var _callback = $(this).data('callback');
							var parent = $(this).parents('.bt-form').length === 0 ? $(this).parents('.bt-w-con') : $(this).parents('.bt-form');

							if (_obj.callback) {
								var data = {};
								parent.find('*').each(function (index, _this) {
									var _name = $(_this).attr('name');

									if (_name) {
										if ($(_this).attr('type') == 'checkbox' || $(_this).attr('type') == 'radio') {
											data[_name] = $(_this).prop('checked');
										} else {
											data[_name] = $(_this).val();
										}
									}
								});
								_obj.callback(data, load, function (rdata) {
									if (_callback) _callback(rdata);
								});
							} else {
								load.close();
							}
						});
					} else {
						if (btn.attr('type') == 'radio') {
							btn.click(function () {
								var _obj = $(this).data('item');
								_obj.callback($(this));
							});
						} else {
							btn.on('input', function () {
								var _obj = $(this).data('item');
								_obj.callback($(this));
							});
						}
					}
					break;
			}
		}
	},
	render: function (
		obj //columns 行
	) {
		if (obj.columns) {
			var checks = {};
			$(obj.table).html('');
			var thead = '<thead><tr>';
			for (var h = 0; h < obj.columns.length; h++) {
				var item = obj.columns[h];
				if (item) {
					thead += '<th';
					if (item.width) thead += ' width="' + item.width + '" ';
					if (item.align || item.sort) {
						thead += ' style="';
						if (item.align) thead += 'text-align:' + item.align + ';';
						if (item.sort) thead += item.sort ? 'cursor: pointer;' : '';
						thead += '"';
					}
					if (item.type == 'checkbox') {
						thead += '><input  class="check"  onclick="bt.check_select();" type="checkbox">';
					} else {
						thead += '>' + item.title;
					}
					if (item.sort) {
						checks[item.field] = item.sort;
						thead += ' <span data-id="' + item.field + '" class="glyphicon glyphicon-triangle-top" style="margin-left:5px;color:#bbb"></span>';
					}
					if (item.help) thead += '<a href="' + item.help + '" class="bt-ico-ask" target="_blank" title="点击查看说明">?</a>';

					thead += '</th>';
				}
			}
			thead += '</tr></thead>';
			var _tab = $(obj.table).append(thead);
			if (obj.data.length > 0) {
				for (var i = 0; i < obj.data.length; i++) {
					var val = obj.data[i];
					var tr = $('<tr></tr>');
					for (var h = 0; h < obj.columns.length; h++) {
						var item = obj.columns[h];
						if (item) {
							var _val = val[item.field];
							if (typeof _val == 'string') _val = _val.replace(/\\/g, '');
							if (item.hasOwnProperty('templet')) _val = item.templet(val);
							if (item.type == 'checkbox') _val = '<input value=' + val[item.field] + '  class="check" onclick="bt.check_select();" type="checkbox">';
							var td = '<td ';
							if (item.align) {
								td += 'style="';
								if (item.align) td += 'text-align:' + item.align;
								td += '"';
							}
							if (item.index) td += 'data-index="' + i + '" ';
							td += '>';
							var fixed = false;
							if (typeof item.fixed != 'undefined' && item.fixed) {
								if (typeof item.class != 'undefined') {
									if (item.class.indexOf('fixed') === -1) item.class += ' fixed';
								} else {
									item.class = 'fixed';
								}
								fixed = true;
							}
							tr.append(td + (fixed ? '<span style="width:' + (item.width - 16) + 'px" title="' + _val + '" class="' + item['class'] + '">' + _val + '</span>' : _val) + '</td>');
							tr.data('item', val);
							_tab.append(tr);
						}
					}
				}
			} else {
				_tab.append("<tr><td colspan='" + obj.columns.length + "'>" + lan.bt.no_data + '</td></tr>');
				if($(obj.table).attr('id') == 'softList'){
					_tab.find('td').css('text-align','center').html('<a class="btlink" onclick="bt.openFeedback({title:\'宝塔面板需求反馈收集\',placeholder:\'<span>如果您在使用过程中遇到任何问题或功能不完善，请将您的问题或需求详细描述给我们，</span><br>我们将尽力为您解决或完善。\',recover:\'我们特别重视您的需求反馈，我们会定期每周进行需求评审。希望能更好的帮到您\',key:993,proType:16})">未查询到搜索内容,提交需求反馈</a>')
					$('.soft-search').after('<a class="btlink npsFeedBack ml20" style="line-height: 30px" onclick="bt.openFeedback({title:\'宝塔面板需求反馈收集\',placeholder:\'<span>如果您在使用过程中遇到任何问题或功能不完善，请将您的问题或需求详细描述给我们，</span><br>我们将尽力为您解决或完善。\',recover:\'我们特别重视您的需求反馈，我们会定期每周进行需求评审。希望能更好的帮到您\',key:993,proType:16})">未查询到搜索内容,提交需求反馈</a>')
				}
			}
			$(obj.table)
				.find('.check')
				.click(function () {
					var checked = $(this).prop('checked');
					if ($(this).parent().prop('tagName') == 'TH') {
						$('.check').prop('checked', checked ? 'checked' : '');
					}
				});
			var asc = 'glyphicon-triangle-top';
			var desc = 'glyphicon-triangle-bottom';

			var orderby = bt.get_cookie('order');
			if (orderby != undefined) {
				var arrys = orderby.split(' ');
				if (arrys.length == 2) {
					if (arrys[1] == 'asc') {
						$(obj.table)
							.find('th span[data-id="' + arrys[0] + '"]')
							.removeClass(desc)
							.addClass(asc);
					} else {
						$(obj.table)
							.find('th span[data-id="' + arrys[0] + '"]')
							.removeClass(asc)
							.addClass(desc);
					}
				}
			}

			$(obj.table)
				.find('th')
				.data('checks', checks)
				.click(function () {
					var _th = $(this);
					var _checks = _th.data('checks');
					var _span = _th.find('span');
					if (_span.length > 0) {
						var or = _span.attr('data-id');
						if (_span.hasClass(asc)) {
							bt.set_cookie('order', or + ' desc');
							$(obj.table)
								.find('th span[data-id="' + or + '"]')
								.removeClass(asc)
								.addClass(desc);
							_checks[or]();
						} else if (_span.hasClass(desc)) {
							bt.set_cookie('order', or + ' asc');
							$(obj.table)
								.find('th span[data-id="' + arrys[0] + '"]')
								.removeClass(desc)
								.addClass(asc);
							_checks[or]();
						}
					}
				});
		}
		return _tab;
	},
	openFeedback: function (param) {
		var openFeed = bt_tools.open({
			area:['570px','380px'],
			btn:false,
			content:'<div id="feedback">\
			<div class="nps_survey_banner">\
			<span class="Ftitle"> <i></i> <span style="vertical-align:4px;">'+param.title+'</span> </span>\
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
									text: param.placeholder,
									style: { top: '126px', left: '50px' },
								},
							}
						},
						{
							group:{
								name: 'tips',
								type: 'other',
								boxcontent:'<div style="color:#20a53a;margin-left:30px;">'+param.recover+'</div>'
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
									var config = {}
									config[param.key] = formData.feed
									bt_tools.send({url:'config?action=write_nps_new',data:{questions:JSON.stringify(config),software_name:1,rate:0,product_type:param.proType}},function(ress){
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
	editor:function(config){
		var random = bt.get_random(8), aEditor = null
		return layer.open({
			type: 1,
			closeBtn: 2,
			title: '在线编辑['+ config.path +']',
			area: config.area || '650px',
			btn: ['保存', '关闭'],
			content: '<div class="pd20">' +
				'<div class="mb15 flex" style="align-items: center;justify-content: space-between;">' +
				'<span style="color:red;">提示：Ctrl+F 搜索关键字，Ctrl+G 查找下一个，Ctrl+S 保存，Ctrl+Shift+R 查找替换!</span>' +
				'<select class="bt-input-text" style="height: 25px" name="encoding">' +
				'<option value="utf-8" selected="">utf-8</option>' +
				'<option value="GBK">GBK</option>' +
				'<option value="GB2312">GB2312</option>' +
				'<option value="BIG5">BIG5</option>' +
				'</select>' +
				'</div>' +
				'<div id="custom-editor-'+ random +'" style="border:1px solid #ececec; height: '+ (config.height || '500px') +';"></div>' +
				'</div>',
			success: function (layers, indexs){
				var el = document.getElementById('custom-editor-'+ random);
				aEditor = ace.edit(el, {
					theme: "ace/theme/chrome", //主题
					mode: "ace/mode/"+( config.mode || 'text'), // 语言类型
					wrap: true,
					showInvisibles: false,
					showFoldWidgets: false,
					useSoftTabs: true,
					tabSize: 2,
					showPrintMargin: false,
					readOnly: false,
					fontSize: '12px'
				})
				aEditor.commands.addCommand({
					name: '保存文件',
					bindKey: {
						win: 'Ctrl-S',
						mac: 'Command-S'
					},
					exec: function (editor) {
						if(config.saveCallback) config.saveCallback(editor)
					},
					readOnly: false
				});
				if(config.success) config.success(aEditor, layers, indexs);
			},
			yes: function (index, layero) {
				if(config.saveCallback) config.saveCallback(aEditor)
			}
		})
	},

	// ACE编辑配置文件
	aceEditor: function (obj) {
		var aEditor = {
				ACE: ace.edit(obj.el, {
					theme: obj.theme || 'ace/theme/chrome', //主题
					mode: 'ace/mode/' + (obj.mode || 'nginx'), // 语言类型
					wrap: true,
					showInvisibles: false,
					showPrintMargin: false,
					showFoldWidgets: false,
					useSoftTabs: true,
					tabSize: 2,
					readOnly: obj.readOnly || false,
				}),
				path: obj.path,
				content: '',
				saveCallback: obj.saveCallback,
			},
			_this = this;
		$('#' + obj.el).css('fontSize', '12px');

		aEditor.ACE.commands.addCommand({
			name: '保存文件',
			bindKey: {
				win: 'Ctrl-S',
				mac: 'Command-S',
			},
			exec: function (editor) {
				_this.saveEditor(aEditor, aEditor.saveCallback);
			},
			readOnly: false, // 如果不需要使用只读模式，这里设置false
		});
		if (obj.path !== undefined) {
			var loadT = layer.msg(lan.soft.get_config, {
				icon: 16,
				time: 0,
				shade: [0.3, '#000'],
			});
			bt.send(
				'GetFileBody',
				'files/GetFileBody',
				{
					path: obj.path,
				},
				function (res) {
					layer.close(loadT);
					if (!res.status) {
						bt.msg(res);
						return false;
					}
					aEditor.ACE.setValue(res.data); //设置配置文件内容
					aEditor.ACE.moveCursorTo(0, 0); //设置文件光标位置
					aEditor.ACE.resize();
				}
			);
		} else if (obj.content != undefined) {
			aEditor.ACE.setValue(obj.content);
			aEditor.ACE.moveCursorTo(0, 0); //设置文件光标位置
			aEditor.ACE.resize();
		}
		return aEditor;
	},
	// ACE编辑配置文件---网站-高级设置-编辑默认页
	default_view_aceEditor: function (obj) {
		var view_list = ['default','404','unexist','stop']
		var aEditor = {
				ACE: ace.edit(obj.el, {
					theme: 'ace/theme/chrome', //主题
					mode: 'ace/mode/' + (obj.mode || 'nginx'), // 语言类型
					wrap: true,
					showInvisibles: false,
					showPrintMargin: false,
					showFoldWidgets: false,
					useSoftTabs: true,
					vScrollBarAlwaysVisible:false,
					tabSize: 2,
					readOnly: false,
				}),
				path: obj.path,
				content: '',
				saveCallback: obj.saveCallback,
			},
			_this = this;
		$('#' + obj.el).css('fontSize', '12px');

		aEditor.ACE.commands.addCommand({
			name: '保存文件',
			bindKey: {
				win: 'Ctrl-S',
				mac: 'Command-S',
			},
			exec: function (editor) {
				// $('#' + view_list[obj.index] +'_view_con textarea').trigger('blur')
				_this.saveEditor(aEditor, $('select[name=encoding]:eq('+ obj.index +')').val());
			},
			readOnly: false, // 如果不需要使用只读模式，这里设置false
		});
		if (obj.content != undefined) {
			aEditor.ACE.setValue(obj.content);
			aEditor.ACE.moveCursorTo(0, 0); //设置文件光标位置
			aEditor.ACE.resize();
		} else if (obj.path !== undefined) {
			var loadT = layer.msg(lan.soft.get_config, {
				icon: 16,
				time: 0,
				shade: [0.3, '#000'],
			});
			bt.send(
				'GetFileBody',
				'files/GetFileBody',
				{
					path: obj.path,
				},
				function (res) {
					layer.close(loadT);
					if (!res.status) {
						bt.msg(res);
						return false;
					}
					aEditor.ACE.setValue(res.data); //设置配置文件内容
					aEditor.ACE.moveCursorTo(0, 0); //设置文件光标位置
					aEditor.ACE.resize();
				}
			);
		}
		return aEditor;
	},
	// 保存编辑器文件
	saveEditor: function (ace,encode='utf-8') {
		if (!ace.saveCallback) {
			var loadT = bt.load(lan.soft.the_save);
			bt.send(
				'SaveFileBody',
				'files/SaveFileBody',
				{
					data: ace.ACE.getValue(),
					path: ace.path,
					encoding: encode,
				},
				function (rdata) {
					loadT.close();
					bt.msg(rdata);
				}
			);
		} else {
			ace.saveCallback(ace.ACE.getValue());
		}
	},
	/**
	 * @description 遍历数组和对象
	 * @param {Array|Object} obj 遍历数组|对象
	 * @param {Function} fn 遍历对象或数组
	 * @return 当前对象
	 */
	each: function (obj, fn) {
		var key,
			that = this;
		if (typeof fn !== 'function') return that;
		obj = obj || [];
		if (obj.constructor === Object) {
			for (key in obj) {
				if (fn.call(obj[key], key, obj[key])) break;
			}
		} else {
			for (key = 0; key < obj.length; key++) {
				if (fn.call(obj[key], key, obj[key])) break;
			}
		}
		return that;
	},

	/**
	 * @description 获取时间简化缩写
	 * @param {Numbre} dateTimeStamp 需要转换的时间戳
	 * @return {String} 简化后的时间格式
	 */
	get_simplify_time: function (dateTimeStamp) {
		if (dateTimeStamp === 0) return '刚刚';
		if (dateTimeStamp.toString().length === 10) dateTimeStamp = dateTimeStamp * 1000;
		var minute = 1000 * 60,
			hour = minute * 60,
			day = hour * 24,
			month = day * 30,
			now = new Date().getTime(),
			diffValue = now - dateTimeStamp;
		if (diffValue < 0) return '刚刚';
		var monthC = diffValue / month,
			weekC = diffValue / (7 * day),
			dayC = diffValue / day,
			hourC = diffValue / hour,
			minC = diffValue / minute,
			result = '';
		if (monthC >= 1) {
			result = '' + parseInt(monthC) + '月前';
		} else if (weekC >= 1) {
			result = '' + parseInt(weekC) + '周前';
		} else if (dayC >= 1) {
			result = '' + parseInt(dayC) + '天前';
		} else if (hourC >= 1) {
			result = '' + parseInt(hourC) + '小时前';
		} else if (minC >= 1) {
			result = '' + parseInt(minC) + '分钟前';
		} else {
			result = '刚刚';
		}
		return result;
	},
	// 在线客服
	onlineService: function (help) {
		layer.open({
			type: 1,
			area: ['200px', '250px'],
			title: false,
			closeBtn: 2,
			shift: 0,
			content:
				'<div class="service_consult">\
						<div class="service_consult_title" style="background: rgba(32, 165, 58, 0.1);"><a href="https://www.bt.cn/new/wechat_customer" target="_blank" class="btlink"><span style="border-bottom: 1px solid;">点击咨询客服</span><div class="icon-r" style="width: 15px;height: 18px;margin-top: 1px;margin-left: 5px;vertical-align: middle;"></div></a></div>\
						<div class="contact_consult" style="margin: 10px auto 8px auto;">\
							<div id="contact_consult_qcode">\
								<img src="/static/images/customer-qrcode.png" alt="" style="border: none;" />\
							</div>\
						</div>\
						<div class="wechat-title">\
						<img class="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAATlJREFUSEvtVrFOw0AMfed8AxJsZWGAgQHBXP4DCQa+Ioou7g18BRIg9T/KDGJggIGFbiDxDXGQowSBuGvrFISEmtF+7/nis312RVEMiWgIoMT375aIjpj5KeJrTMy8JSJjAPsRzEhErl1Zlhd1XZ8kRKZEdMjM0xlBBiIyATCIYZxzl857X6uTiHaY+TElZrUz87aIPCjvI0gIwVmF5uG7H1gFmZepxv85XTdqCCEcLMQ0gLz3jbbTOm/rPdkLBt0v0E77xysq2it9T2nhuTzPN4ho10KyYEXkXvvkBcC6hWjEvmqQMwCnANZa8p1RJAbfa41vAM7/0cUzczOiZ43zvunrtPVOntuO3+wrluJ12qspvFBm/+bR+u03nhPrkKZk2ZVINUZO964sy44Ta9FSK5GuQ1VVXb0DLf+sHQ9tLL0AAAAASUVORK5CYII=">\
						<span class="scan-title" style="font-size: 16px;">扫一扫</span></div>\
				</div>',
			success: function (layers) {
				$(layers).css('border-radius', '4px');
				var html = '';
				if (Array.isArray(help)) {
					for (var i = 0; i < help.length; i++) {
						html += help[i];
					}
					$('#helpList').parent(html);
				}
			},
		});
	},

	/**
	 * @description 获取设备信息
	 */
	getDeviceInfo: function(){
		var userAgent = window.navigator.userAgent;
		var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(userAgent);
		var deviceInfo = {
			screenWidth: window.screen.width,
			screenHeight: window.screen.height,
			availWidth: window.screen.availWidth,
			availHeight: window.screen.availHeight,
			pixelRatio: window.devicePixelRatio,
			pixelDepth: window.screen.pixelDepth,
			browserName: "",
			browserVersion: "",
			deviceType: isMobile ? "Mobile" : "Desktop",
			deviceName: userAgent,
			engineName:"",
			osName: userAgent.indexOf("Win") != -1 ? "Windows" :
				userAgent.indexOf("iPhone") != -1 ? "iPhone" :
					userAgent.indexOf("iPad") != -1 ? "iPad" :
						userAgent.indexOf("iPod") != -1 ? "iPod" :
							userAgent.indexOf("Mac") != -1 ? "MacOS" :
								userAgent.indexOf("X11") != -1 ? "UNIX" :
									userAgent.indexOf("Android") != -1 ? "Android" :
										userAgent.indexOf("iOS") != -1 ? "iOS" :
											userAgent.indexOf("Linux") != -1 ? "Linux" : "Unknown"
		};

		// 获取浏览器引擎
		if (userAgent.indexOf("Trident") != -1) {
			deviceInfo.engineName = "Trident";
		} else if (userAgent.indexOf("Edge") != -1) {
			deviceInfo.engineName = "EdgeHTML";
		} else if (userAgent.indexOf("AppleWebKit") != -1) {
			deviceInfo.engineName = "WebKit";
		} else if (userAgent.indexOf("Gecko") != -1 && userAgent.indexOf("KHTML") == -1) {
			deviceInfo.engineName = "Gecko";
		}

		// 获取浏览器名称和版本
		if (/MSIE|Trident/i.test(userAgent)) {
			deviceInfo.browserName = "IE";
			deviceInfo.browserVersion = userAgent.match(/(MSIE|rv:?)\s?([\d\.]+)/)[2];
		} else if (/Firefox/i.test(userAgent)) {
			deviceInfo.browserName = "Firefox";
			deviceInfo.browserVersion = userAgent.match(/Firefox\/([\d\.]+)/)[1];
		} else if (/Chrome/i.test(userAgent)) {
			deviceInfo.browserName = "Chrome";
			deviceInfo.browserVersion = userAgent.match(/Chrome\/([\d\.]+)/)[1];
		} else if (/Safari/i.test(userAgent)) {
			deviceInfo.browserName = "Safari" ;
			if(deviceInfo.osName !== "MacOS"){
				deviceInfo.browserVersion = userAgent.match(/Safari\/([\d\.]+)/)[1];
			}else{
				deviceInfo.browserVersion = userAgent.match(/Version\/([\d\.]+)/)[1];
			}
		}

		// 获取Edge新旧版本信息
		if (userAgent.indexOf("Edg") != -1) {
			deviceInfo.browserName = "Microsoft Edge";
			deviceInfo.browserVersion = userAgent.substring(userAgent.indexOf("Edg") + 4).split(" ")[0];
		} else if (userAgent.indexOf("Edge") != -1) {
			deviceInfo.browserName = "Microsoft Edge (Legacy)";
			deviceInfo.browserVersion = userAgent.substring(userAgent.indexOf("Edge") + 5).split(" ")[0];
		}
		return deviceInfo;
	}
};

bt.pub = {
	get_data: function (data, callback, hide) {
		if (!hide) var loading = bt.load(lan['public'].the);
		bt.send('getData', 'data/getData', data, function (rdata) {
			if (loading) loading.close();
			if (callback) callback(rdata);
		});
	},
	set_data_by_key: function (tab, key, obj) {
		var _span = $(obj);
		var _input = $("<input class='baktext' type='text' placeholder='" + lan.ftp.ps + "' />").val(_span.text());
		_span.hide().after(_input);
		_input.focus();
		_input.blur(function () {
			var item = $(this).parents('tr').data('item');
			var _txt = $(this);
			var data = {
				table: tab,
				id: item.id,
			};
			data[key] = _txt.val();
			bt.pub.set_data_ps(data, function (rdata) {
				if (rdata.status) {
					_span.text(_txt.val());
					_span.show();
					_txt.remove();
				}
			});
		});
		_input.keyup(function () {
			if (event.keyCode == 13) {
				_input.trigger('blur');
			}
		});
	},
	set_data_ps: function (data, callback) {
		bt.send('setPs', 'data/setPs', data, function (rdata) {
			if (callback) callback(rdata);
		});
	},
	set_server_status: function (serverName, type) {
		var sName = serverName;
		if (bt.contains(serverName, 'php-')) {
			serverName = 'php-fpm-' + serverName.replace('php-', '').replace('.', '');
		}
		if (serverName == 'pureftpd') serverName = 'pure-ftpd';
		if (serverName == 'mysql') serverName = 'mysqld';
		serverName = serverName.replace('_soft', '');
		var data = 'name=' + serverName + '&type=' + type;
		var msg = lan.bt[type];
		var typeName = '';
		switch (type) {
			case 'stop':
				typeName = '停止';
				break;
			case 'restart':
				typeName = '重启';
				break;
			case 'reload':
				typeName = '重载';
				break;
		}
		bt.confirm(
			{
				msg: lan.get('service_confirm', [msg, serverName]),
				title: typeName + serverName + '服务',
			},
			function () {
				var load = bt.load(lan.get('service_the', [msg, serverName]));
				bt.send('system', 'system/ServiceAdmin', data, function (rdata) {
					load.close();
					var f = rdata.status ? lan.get('service_ok', [serverName, msg]) : rdata.msg || lan.get('service_err', [serverName, msg]);
					if(rdata.status) {
					    bt.msg({
    						msg: f,
    						icon: rdata.status,
    					});
					}else {
					    layer.msg(f,{icon: 2,closeBtn: 2, time: 0,shade: 0.3, shadeClose: true})
					}

					if (rdata.status) {
						if ($('.bt-soft-menu').length) {
							setTimeout(function () {
								bt.send('get_soft_find', 'plugin/get_soft_find', {sName: sName}, function (res) {
									$('.bt-soft-menu').data('data', res)
									$('.bt-soft-menu .bgw').click()
								})
							}, 1000);
						} else {
							setTimeout(function () {
								window.location.reload();
							}, 1000);
						}
						if (!rdata.status) {
							bt.msg(rdata);
						}
					}
				});
			}
		);
	},
	set_ftp_logs: function (type) {
		var serverName = 'pure-ftpd日志';
		var data = 'exec_name=' + type;
		var typeName = '开启';
		switch (type) {
			case 'stop':
				typeName = '关闭';
				break;
		}
		var status = type == 'stop' ? false : true;
		layer.confirm(
			typeName + 'pure-ftpd日志管理后，' + (status ? '将记录所有FTP用户的登录、操作记录' : '将无法记录所有FTP用户的登录、操作记录') + '，是否继续操作？',
			{
				title: typeName + serverName + '管理',
				closeBtn: 2,
				icon: 3,
				cancel: function () {
					$('#isFtplog').prop('checked', !status);
				},
			},
			function () {
				var load = bt.load('正在' + typeName + 'pure-ftpd日志管理，请稍后...');
				bt.send('ftp', 'ftp/set_ftp_logs', data, function (rdata) {
					load.close();
					bt.msg(rdata);
					$('.bt-soft-menu p').eq(3).click();
				});
			},
			function () {
				$('#isFtplog').prop('checked', !status);
			}
		);
	},
	get_ftp_logs: function (callback) {
		bt.send('ftp', 'ftp/set_ftp_logs', { exec_name: 'getlog' }, function (res) {
			var _status = res.msg === 'start' ? true : false;
			if (callback) callback(_status);
		});
	},
	set_server_status_by: function (data, callback) {
		bt.send('system', 'system/ServiceAdmin', data, function (rdata) {
			if (callback) callback(rdata);
		});
	},
	get_task_count: function (callback) {
		bt.send('GetTaskCount', 'ajax/GetTaskCount', {}, function (rdata) {
			$('.task').text(rdata);
			if (callback) callback(rdata);
		});
	},
	check_install: function (callback) {
		bt.send('CheckInstalled', 'ajax/CheckInstalled', {}, function (rdata) {
			if (callback) callback(rdata);
		});
	},
	get_user_info: function (callback) {
		var loading = bt.load();
		bt.send('GetUserInfo', 'ssl/GetUserInfo', {}, function (rdata) {
			loading.close();
			if (callback) callback(rdata);
		});
	},
	show_hide_pass: function (obj) {
		var a = 'glyphicon-eye-open';
		var b = 'glyphicon-eye-close';

		if ($(obj).hasClass(a)) {
			$(obj).removeClass(a).addClass(b);
			$(obj).prev().text($(obj).prev().attr('data-pw'));
		} else {
			$(obj).removeClass(b).addClass(a);
			$(obj).prev().text('**********');
		}
	},
	copy_pass: function (password) {
		var clipboard = new ClipboardJS('#bt_copys');
		clipboard.on('success', function (e) {
			bt.msg({
				msg: '复制成功',
				icon: 1,
			});
		});

		clipboard.on('error', function (e) {
			bt.msg({
				msg: '复制失败，浏览器不兼容!',
				icon: 2,
			});
		});
		$('#bt_copys').attr('data-clipboard-text', password);
		$('#bt_copys').click();
	},
	login_btname: function (username, password, callback) {
		var loadT = bt.load(lan.config.token_get);
		bt.send(
			'GetToken',
			'ssl/GetToken',
			{
				username: username,
				password: password,
			},
			function (rdata) {
				loadT.close();
				bt.msg(rdata);
				if (rdata.status) {
					if (callback) callback(rdata);
				}
			}
		);
	},
	bind_btname: function (callback) {
		new BindAccount().bindUserView(1);
	},
	unbind_bt: function () {
		var name = $("input[name='btusername']").val();
		bt.confirm(
			{
				msg: lan.config.binding_un_msg,
				title: lan.config.binding_un_title,
			},
			function () {
				bt.send('DelToken', 'ssl/DelToken', {}, function (rdata) {
					bt.msg(rdata);
					$("input[name='btusername']").val('');
				});
			}
		);
	},
	get_menm: function (callback) {
		var loading = bt.load();
		bt.send('GetMemInfo', 'system/GetMemInfo', {}, function (rdata) {
			loading.close();
			if (callback) callback(rdata);
		});
	},
	on_edit_file: function (type, fileName, mode) {
		if (type != 0) {
			var l = $('#PathPlace input').val();
			var body = encodeURIComponent($('#textBody').val());
			var encoding = $('select[name=encoding]').val();
			var loadT = bt.load(lan.bt.save_file);
			bt.send('SaveFileBody', 'files/SaveFileBody', 'data=' + body + '&path=' + fileName + '&encoding=' + encoding, function (rdata) {
				if (type == 1) loadT.close();
				bt.msg(rdata);
			});
			return;
		}
		var loading = bt.load(lan.bt.read_file);
		ext = bt.get_file_ext(fileName);

		bt.send('GetFileBody', 'files/GetFileBody', 'path=' + fileName, function (rdata) {
			if (!rdata.status) {
				bt.msg({
					msg: rdata.msg,
					icon: 5,
				});
				return;
			}
			loading.close();
			var u = ['utf-8', 'GBK', 'GB2312', 'BIG5'];
			var n = '';
			var m = '';
			var o = '';
			for (var p = 0; p < u.length; p++) {
				m = rdata.encoding === u[p] ? 'selected' : '';
				n += '<option value="' + u[p] + '" ' + m + '>' + u[p] + '</option>';
			}
			var aceEditor = {},
				r = bt.open({
					type: 1,
					shift: 5,
					closeBtn: 1,
					area: ['80%', '80%'],
					shade: false,
					title: lan.bt.edit_title + '[' + fileName + ']',
					btn: [lan['public'].save, lan['public'].close],
					content:
						'\
							<form class="bt-form pd20">\
								<div class="line">\
									<p style="position: relative; color:red;margin-bottom:10px">' +
						lan.bt.edit_ps +
						'<select class="bt-input-text" name="encoding" style="width: 74px;position: absolute;top: 0;right: 0;height: 22px;z-index: 9999;border-radius: 0;">' +
						n +
						'</select>\
									</p>\
									<div class="mCustomScrollbar bt-input-text ace_config_editor_scroll" id="textBody" style="width:100%;margin:0 auto;line-height: 1.8;position: relative;top: 10px;min-height:300px;"></div>\
								</div>\
							</form>',
					yes: function (layer, index) {
						bt.saveEditor(aceEditor);
					},
					btn2: function (layer, index) {
						r.close();
					},
					success: function (layers) {
						function resize() {
							var $layers = $(layers).find('.layui-layer-content').height();
							$('#textBody').height($layers - 80);
						}
						resize();
						$(window).on('resize', resize);
						aceEditor = bt.aceEditor({
							el: 'textBody',
							content: rdata.data,
							mode: mode,
							saveCallback: function (val) {
								bt.send(
									'SaveFileBody',
									'files/SaveFileBody',
									{
										path: fileName,
										encoding: $('[name="encoding"] option:selected').val(),
										data: val,
									},
									function (rdata) {
										bt.msg(rdata);
									}
								);
							},
						});
					},
				});
		});
	},
};

bt.index = {
	rec_install: function () {
		bt.send('GetSoftList', 'ajax/GetSoftList', {}, function (l) {
			var c = '';
			var g = '';
			var e = '';
			for (var h = 0; h < l.length; h++) {
				if (l[h].name == 'Tomcat') {
					continue;
				}
				var o = '';
				var m = "<input id='data_" + l[h].name + "' data-info='" + l[h].name + ' ' + l[h].versions[0].version + "' type='checkbox' checked>";
				for (var b = 0; b < l[h].versions.length; b++) {
					var d = '';
					if (
						(l[h].name == 'PHP' && (l[h].versions[b].version == '7.4' || l[h].versions[b].version == '7.4')) ||
						(l[h].name == 'MySQL' && l[h].versions[b].version == '5.7') ||
						(l[h].name == 'phpMyAdmin' && l[h].versions[b].version == '5.2')
					) {
						d = 'selected';
						m = "<input id='data_" + l[h].name + "' data-info='" + l[h].name + ' ' + l[h].versions[b].version + "' type='checkbox' checked>";
					}
					o += "<option value='" + l[h].versions[b].version + "' " + d + '>' + l[h].name + ' ' + l[h].versions[b].version + '</option>';
				}
				var f =
					"<li><span class='ico'><img src='/static/img/" +
					l[h].name.toLowerCase() +
					".png'></span><span class='name'><select id='select_" +
					l[h].name +
					"' class='sl-s-info'>" +
					o +
					"</select></span><span class='pull-right'>" +
					m +
					'</span></li>';
				if (l[h].name == 'Nginx') {
					c = f;
				} else {
					if (l[h].name == 'Apache') {
						g = f;
					} else {
						e += f;
					}
				}
			}
			c += e;
			g += e;

			g = g.replace(new RegExp(/(data_)/g), 'apache_').replace(new RegExp(/(select_)/g), 'apache_select_');
			var k = layer.open({
				type: 1,
				title: lan.bt.install_title,
				area: ['670px', '500px'],
				closeBtn: 2,
				shadeClose: false,
				content:
					"\
					<div class='rec-install'>\
						<div class='important-title'>\
							<p><span class='glyphicon glyphicon-alert' style='color: #f39c12; margin-right: 10px;'></span>" +
					lan.bt.install_ps +
					" <a href='javascript:jump()' style='color:#20a53a'>" +
					lan.bt.install_s +
					'</a> ' +
					lan.bt.install_s1 +
					"</p>\
							<button type='button' class='btn btn-sm btn-default no-show-rec-btn'>不再显示推荐</button>\
							\
						</div>\
						<div class='rec-box'>\
							<h3>" +
					lan.bt.install_lnmp +
					"</h3>\
							<div class='rec-box-con'>\
								<ul class='rec-list'>" +
					c +
					"</ul>\
								<p class='fangshi1'>" +
					lan.bt.install_type +
					"：<label data-title='" +
					lan.bt.install_rpm_title +
					"'><span>" +
					lan.bt.install_rpm +
					"</span><input type='checkbox' checked></label><label data-title='" +
					lan.bt.install_src_title +
					"'><span>" +
					lan.bt.install_src +
					"</span><input type='checkbox'></label></p>\
								<div class='onekey'>" +
					lan.bt.install_key +
					"</div>\
							</div>\
						</div>\
						<div class='rec-box' style='margin-left:16px'>\
							<h3>LAMP</h3>\
							<div class='rec-box-con'>\
								<ul class='rec-list'>" +
					g +
					"</ul>\
								<p class='fangshi1'>" +
					lan.bt.install_type +
					"：<label data-title='" +
					lan.bt.install_rpm_title +
					"'><span>" +
					lan.bt.install_rpm +
					"</span><input type='checkbox' checked></label><label data-title='" +
					lan.bt.install_src_title +
					"'><span>" +
					lan.bt.install_src +
					"</span><input type='checkbox'></label></p>\
								<div class='onekey'>" +
					lan.bt.install_key +
					'</div>\
							</div>\
						</div>\
					</div>',
				success: function ($layer, index) {
					form_group.select_all([
						'#select_Nginx',
						'#select_MySQL',
						'#select_Pure-Ftpd',
						'#select_PHP',
						'#select_phpMyAdmin',
						'#apache_select_Apache',
						'#apache_select_MySQL',
						'#apache_select_Pure-Ftpd',
						'#apache_select_PHP',
						'#apache_select_phpMyAdmin',
					]);
					form_group.checkbox();
					$('.layui-layer-content').css('overflow', 'inherit');
					$('.fangshi1 label').click(function () {
						var input = $(this).find('input'),
							siblings_label = input.parents('label').siblings();
						input.prop('checked', 'checked').next().addClass('active');
						siblings_label.find('input').removeAttr('checked').next().removeClass('active');
					});
					// 不再显示推荐
					$('.no-show-rec-btn').click(function () {
						bt.confirm(
							{
								title: '不再显示推荐',
								msg: '是否不再显示推荐安装套件？',
							},
							function () {
								var load = bt.load('正在设置，请稍候...');
								bt.send('CreateDir', 'files/CreateDir', { path: '/www/server/php' }, function (res) {
									load.close();
									if (res.status) res.msg = '设置成功';
									bt.msg(res);
									setTimeout(function () {
										if (res.status) layer.close(index);
									}, 2000);
								});
							}
						);
					});
					var loadT = '';
					$('.fangshi1 label').hover(
						function () {
							var _title = $(this).attr('data-title'),
								_that = $(this);
							loadT = setTimeout(function () {
								layer.tips(_title, _that[0], {
									tips: [1, '#20a53a'], //还可配置颜色
									time: 0,
								});
							}, 500);
						},
						function () {
							clearTimeout(loadT);
							layer.closeAll('tips');
						}
					);
				},
			});
			$('.sl-s-info').change(function () {
				var p = $(this).find('option:selected').text();
				var n = $(this).attr('id');
				p = p.toLowerCase();
				$(this).parents('li').find('input').attr('data-info', p);
			});
			$('#apache_select_PHP').change(function () {
				var n = $(this).val();
				j(n, 'apache_select_', 'apache_');
			});
			$('#select_PHP').change(function () {
				var n = $(this).val();
				j(n, 'select_', 'data_');
			});

			function j(p, r, q) {
				var n = '4.4';
				switch (p) {
					case '5.4':
						n = '4.4';
						break;
					case '5.5':
						n = '4.9';
						break;
					case '5.6':
						n = '4.9';
						break;
					case '7.0':
						n = '4.9';
						break;
					case '7.1':
						n = '5.1';
						break;
					default:
						n = '5.2';
				}
				$('#' + r + "phpMyAdmin option[value='" + n + "']")
					.attr('selected', 'selected')
					.siblings()
					.removeAttr('selected');
				$('#' + q + 'phpMyAdmin').attr('data-info', 'phpmyadmin ' + n);
			}
			$('#select_MySQL,#apache_select_MySQL').change(function () {
				var n = $(this).val();
				a(n);
			});

			$('#apache_select_Apache').change(function () {
				var apacheVersion = $(this).val();
				if (apacheVersion == '2.2') {
					layer.msg(lan.bt.install_apache22);
				} else {
					layer.msg(lan.bt.install_apache24);
				}
			});

			$('#apache_select_PHP').change(function () {
				var apacheVersion = $('#apache_select_Apache').val();
				var phpVersion = $(this).val();
				if (apacheVersion == '2.2') {
					if (phpVersion != '5.2' && phpVersion != '5.3' && phpVersion != '5.4') {
						layer.msg(lan.bt.insatll_s22 + 'PHP-' + phpVersion, {
							icon: 5,
						});
						$(this).val('5.4');
						$('#apache_PHP').attr('data-info', 'php 5.4');
						return false;
					}
				} else {
					if (phpVersion == '5.2') {
						layer.msg(lan.bt.insatll_s24 + 'PHP-' + phpVersion, {
							icon: 5,
						});
						$(this).val('5.4');
						$('#apache_PHP').attr('data-info', 'php 5.4');
						return false;
					}
				}
			});

			function a(n) {
				memSize = bt.get_cookie('memSize');
				max = 64;
				msg = '64M';
				switch (n) {
					case '5.1':
						max = 256;
						msg = '256M';
						break;
					case '5.7':
						max = 1500;
						msg = '2GB';
						break;
					case '8.0':
						max = 5000;
						msg = '6GB';
						break;
					case '5.6':
						max = 800;
						msg = '1GB';
						break;
					case 'AliSQL':
						max = 800;
						msg = '1GB';
						break;
					case 'mariadb_10.0':
						max = 800;
						msg = '1GB';
						break;
					case 'mariadb_10.1':
						max = 1500;
						msg = '2GB';
						break;
				}
				if (memSize < max) {
					layer.msg(lan.bt.insatll_mem.replace('{1}', msg).replace('{2}', n), {
						icon: 5,
					});
				}
			}
			var de = null;
			$('.onekey').click(function () {
				if (de) return;
				var v = $(this).prev().find('input').eq(0).prop('checked') ? '1' : '0';
				var r = $(this).parents('.rec-box-con').find('.rec-list li').length;
				var n = '';
				var q = '';
				var p = '';
				var x = '';
				var s = '';
				de = true;
				for (var t = 0; t < r; t++) {
					var w = $(this).parents('.rec-box-con').find('ul li').eq(t);
					var u = w.find('input');
					if (u.prop('checked')) {
						n += u.attr('data-info') + ',';
					}
				}
				q = n.split(',');
				loadT = layer.msg(lan.bt.install_to, {
					icon: 16,
					time: 0,
					shade: [0.3, '#000'],
				});

				install_plugin(q);

				function install_plugin(q) {
					if (!q[0]) return;
					p = q[0].split(' ')[0].toLowerCase();
					x = q[0].split(' ')[1];
					if (p == 'pure-ftpd') p = 'pureftpd';
					if (p == 'php') p = 'php-' + x;

					s = 'sName=' + p + '&version=' + x + '&type=' + v + '&id=' + (t + 1);
					bt.send('install_plugin', 'plugin/install_plugin', s, function () {
						q.splice(0, 1);
						install_plugin(q);
					});
				}

				layer.close(loadT);
				layer.close(k);
				// setTimeout(function () {
				// 	GetTaskCount();
				// }, 2000);
				layer.msg(lan.bt.install_ok, {
					icon: 1,
				});
				setTimeout(function () {
					task();
				}, 1000);
			});
		});
	},
};

bt.weixin = {
	settiming: '',
	relHeight: 500,
	relWidth: 500,
	userLength: '',
	get_user_info: function (callback) {
		bt.send(
			'get_user_info',
			'panel_wxapp/get_user_info',
			{},
			function (rdata) {
				if (callback) callback(rdata);
			},
			1
		);
	},
	init: function () {
		var _this = this;
		$('.layui-layer-page').css('display', 'none');
		$('.layui-layer-page').width(_this.relWidth);
		$('.layui-layer-page').height(_this.relHeight);
		$('.bt-w-menu').height(_this.relWidth - 1 - $('.layui-layer-title').height());
		var width = $(document).width();
		var height = $(document).height();
		var boxwidth = width / 2 - _this.relWidth / 2;
		var boxheight = height / 2 - _this.relHeight / 2;
		$('.layui-layer-page').css({
			left: boxwidth + 'px',
			top: boxheight + 'px',
		});
		$('.boxConter,.layui-layer-page').css('display', 'block');
		$('.layui-layer-close').click(function (event) {
			window.clearInterval(_this.settiming);
		});
		this.get_user_details();
		$('.iconCode').hide();
		$('.personalDetails').show();
	},
	// 获取二维码
	get_qrcode: function () {
		var _this = this;
		var qrLoading = bt.load(lan.config.config_qrcode);

		bt.send('blind_qrcode', 'panel_wxapp/blind_qrcode', {}, function (res) {
			qrLoading.close();
			if (res.status) {
				$('#QRcode').empty();
				$('#QRcode').qrcode({
					render: 'canvas', //也可以替换为table
					width: 200,
					height: 200,
					text: res.msg,
				});
				_this.settiming = setInterval(function () {
					_this.verify_binding();
				}, 2000);
			} else {
				bt.msg(res);
			}
		});
	},
	// 获取用户信息
	get_user_details: function (type) {
		var _this = this;
		var conter = '';
		_this.get_user_info(function (res) {
			clearInterval(_this.settiming);
			if (!res.status) {
				res.time = 3000;
				bt.msg(res);

				$('.iconCode').hide();
				return false;
			}
			if (JSON.stringify(res.msg) == '{}') {
				if (type) {
					bt.msg({
						msg: lan.config.qrcode_no_list,
						icon: 2,
					});
				} else {
					_this.get_qrcode();
				}
				$('.iconCode').show();
				$('.personalDetails').hide();
				return false;
			}
			$('.iconCode').hide();
			$('.personalDetails').show();
			var datas = res.msg;
			for (var item in datas) {
				conter +=
					'<li class="item">\
									<div class="head_img"><img src="' +
					datas[item].avatarUrl +
					'" title="用户头像" /></div>\
									<div class="nick_name"><span>昵称:</span><span class="nick"></span>' +
					datas[item].nickName +
					'</div>\
									<div class="cancelBind">\
										<a href="javascript:;" class="btlink" title="取消当前微信小程序的绑定" onclick="bt.weixin.cancel_bind(' +
					item +
					')">取消绑定</a>\
									</div>\
								</li>';
			}
			conter +=
				'<li class="item addweChat" style="height:45px;"><a href="javascript:;" class="btlink" onclick="bt.weixin.add_wx_view()"><span class="glyphicon glyphicon-plus"></span>添加绑定账号</a></li>';
			$('.userList').empty().append(conter);
		});
	},
	// 添加绑定视图
	add_wx_view: function () {
		$('.iconCode').show();
		$('.personalDetails').hide();
		this.get_qrcode();
	},
	// 取消当前绑定
	cancel_bind: function (uid) {
		var _this = this;
		var bdinding = layer.confirm(
			'您确定要取消当前绑定吗？',
			{
				btn: ['确认', '取消'],
				icon: 3,
				title: '取消绑定',
			},
			function () {
				bt.send(
					'blind_del',
					'panel_wxapp/blind_del',
					{
						uid: uid,
					},
					function (res) {
						bt.msg(res);
						_this.get_user_details();
					}
				);
			},
			function () {
				layer.close(bdinding);
			}
		);
	},
	// 监听是否绑定
	verify_binding: function () {
		var _this = this;
		bt.send('blind_result', 'panel_wxapp/blind_result', {}, function (res) {
			if (res) {
				bt.msg({
					status: true,
					msg: '绑定成功!',
				});
				clearInterval(_this.settiming);
				_this.get_user_details();
			}
		});
	},
	open_wxapp: function () {
		var rhtml =
			'<div class="boxConter" style="display: none">\
									<div class="iconCode" >\
										<div class="box-conter">\
											<div id="QRcode"></div>\
											<div class="codeTip">\
												<ul>\
													<li>1、打开宝塔面板小程序<span class="btlink weChat">小程序二维码<div class="weChatSamll"><img src="https://app.bt.cn/static/app.png"></div></span></li>\
													<li>2、使用宝塔小程序扫描当前二维码，绑定该面板</li>\
												</ul>\
												<span><a href="javascript:;" title="返回面板绑定列表" class="btlink" style="margin: 0 auto" onclick="bt.weixin.get_user_details(true)">查看绑定列表</a></span>\
											</div>\
										</div>\
									</div>\
									<div class="personalDetails" style="display: none">\
										<ul class="userList"></ul>\
									</div>\
								</div>';

		bt.open({
			type: 1,
			title: '绑定微信',
			area: '500px',
			shadeClose: false,
			content: rhtml,
		});
		bt.weixin.init();
	},
};

bt.ftp = {
	get_list: function (page, search, callback) {
		if (page == undefined) page = 1;
		search = search == undefined ? '' : search;
		var order = bt.get_cookie('order') ? '&order=' + bt.get_cookie('order') : '';

		var data = 'tojs=ftp.get_list&table=ftps&limit=15&p=' + page + '&search=' + search + order;
		bt.pub.get_data(data, function (rdata) {
			if (callback) callback(rdata);
		});
	},
	add: function (callback) {
		bt.data.ftp.add.list[1].items[0].value = bt.get_random(16);
		var bs = bt.render_form(bt.data.ftp.add, function (rdata) {
			if (callback) callback(rdata);
		});
		$('.path' + bs).val($('#defaultPath').text());
	},
	set_password: function (callback) {
		var bs = bt.render_form(bt.data.ftp.set_password, function (rdata) {
			if (callback) callback(rdata);
		});
		return bs;
	},
	del: function (id, username, callback) {
		var loading = bt.load(lan.get('del_all_task_the', [username]));
		bt.send(
			'DeleteUser',
			'ftp/DeleteUser',
			{
				id: id,
				username: username,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	set_status: function (id, username, status, callback) {
		var loadT = bt.load(lan['public'].the);
		var data = 'id=' + id + '&username=' + username + '&status=' + status;
		bt.send('SetStatus', 'ftp/SetStatus', data, function (rdata) {
			loadT.close();
			if (callback) callback(rdata);
			bt.msg(rdata);
		});
	},
	set_port: function (callback) {
		var bs = bt.render_form(bt.data.ftp.set_port, function (rdata) {
			if (callback) callback(rdata);
		});
		return bs;
	},
};

bt.recycle_bin = {
	open_recycle_bin: function (type) {
		if (type == undefined) type = 1;
		bt.files.get_recycle_bin(type, function (rdata) {
			var data = [];
			switch (type) {
				case 2:
					data = rdata.dirs;
					break;
				case 3:
					data = rdata.files;
					break;
				case 4:
				case 5:
				case 6:
					for (var i = 0; i < rdata.files.length; i++) {
						if (type == 6 && bt.contains(rdata.files[i].name, 'BTDB_')) {
							data.push(rdata.files[i]);
						} else {
							if (type == 4 && bt.check_img(rdata.files[i].name)) {
								data.push(rdata.files[i]);
							} else if (type == 5 && !bt.check_img(rdata.files[i].name)) {
								data.push(rdata.files[i]);
							}
						}
					}
					for (var i = 0; i < rdata.dirs.length; i++) {
						if (type == 6 && bt.contains(rdata.dirs[i].name, 'BTDB_')) {
							data.push(rdata.dirs[i]);
						} else {
							if (type == 4 && bt.check_img(rdata.dirs[i].name)) {
								data.push(rdata.dirs[i]);
							} else if (type == 5 && !bt.check_img(rdata.dirs[i].name)) {
								data.push(rdata.dirs[i]);
							}
						}
					}
					break;
				default:
					data = rdata.dirs.concat(rdata.files);
					break;
			}
			if ($('#tab_recycle_bin').length <= 0) {
				bt.open({
					type: 1,
					skin: 'demo-class',
					area: ['80%', '606px'],
					title: lan.files.recycle_bin_title,
					closeBtn: 2,
					shift: 5,
					shadeClose: false,
					content:
						'<div class="re-head">\
								<div style="margin-left: 3px;" class="ss-text">\
																<em>' +
						lan.files.recycle_bin_on +
						'</em>\
																<div class="ssh-item">\
																				<input class="btswitch btswitch-ios" id="Set_Recycle_bin" type="checkbox" ' +
						(rdata.status ? 'checked' : '') +
						'>\
																				<label class="btswitch-btn" for="Set_Recycle_bin" onclick="bt.files.set_recycle_bin()"></label>\
																</div>\
																<em style="margin-left: 20px;">' +
						lan.files.recycle_bin_on_db +
						'</em>\
																<div class="ssh-item">\
																				<input class="btswitch btswitch-ios" id="Set_Recycle_bin_db" type="checkbox" ' +
						(rdata.status_db ? 'checked' : '') +
						'>\
																				<label class="btswitch-btn" for="Set_Recycle_bin_db" onclick="bt.files.set_recycle_bin(1)"></label>\
																</div>\
												</div>\
								<span style="line-height: 32px; margin-left: 30px;">' +
						lan.files.recycle_bin_ps +
						'</span>\
												<button style="float: right" class="btn btn-default btn-sm" onclick="bt.recycle_bin.clear_recycle_bin();">' +
						lan.files.recycle_bin_close +
						'</button>\
								</div>\
								<div class="re-con">\
									<div class="re-con-menu"></div>\
									<div class="re-con-con">\
									<div style="margin: 15px;" class="divtable">\
										<table id="tab_recycle_bin" width="100%" class="table table-hover"></table>\
									</div></div></div>',
				});
			}

			setTimeout(function () {
				var menus = [
					{
						title: lan.files.recycle_bin_type1,
						click: 'bt.recycle_bin.open_recycle_bin(1)',
					},
					{
						title: lan.files.recycle_bin_type2,
						click: 'bt.recycle_bin.open_recycle_bin(2)',
					},
					{
						title: lan.files.recycle_bin_type3,
						click: 'bt.recycle_bin.open_recycle_bin(3)',
					},
					{
						title: lan.files.recycle_bin_type4,
						click: 'bt.recycle_bin.open_recycle_bin(4)',
					},
					{
						title: lan.files.recycle_bin_type5,
						click: 'bt.recycle_bin.open_recycle_bin(5)',
					},
					{
						title: lan.files.recycle_bin_type6,
						click: 'bt.recycle_bin.open_recycle_bin(6)',
					},
				];
				var m_html = '';
				for (var i = 0; i < menus.length; i++) {
					var c = type == i + 1 ? 'class="on"' : '';
					m_html += '<p ' + c + ' onclick="' + menus[i].click + '" >' + menus[i].title + '</p>';
				}
				$('.re-con-menu').html(m_html);
				var _tab = bt.render({
					table: '#tab_recycle_bin',
					columns: [
						{
							field: 'name',
							title: lan.files.recycle_bin_th1,
						},
						{
							field: 'dname',
							title: lan.files.recycle_bin_th2,
						},
						{
							field: 'size',
							title: lan.files.recycle_bin_th3,
							templet: function (item) {
								return bt.format_size(item.size);
							},
						},
						{
							field: 'time',
							title: lan.files.recycle_bin_th4,
							templet: function (item) {
								return bt.format_data(item.time);
							},
						},
						{
							field: 'opt',
							title: lan.files.recycle_bin_th5,
							align: 'right',
							templet: function (item) {
								var opt = '<a class="btlink" href="javascript:;" onclick="bt.recycle_bin.re_recycle_bin(\'' + item.rname + "'," + type + ')">恢复</a> | ';
								opt += '<a class="btlink" href="javascript:;" onclick="bt.recycle_bin.del_recycle_bin(\'' + item.rname + "'," + type + ",'" + item.name + '\')">永久删除</a>';
								return opt;
							},
						},
					],
					data: data,
				});
			}, 100);
		});
	},
	clear_recycle_bin: function () {
		var _this = this;
		bt.files.clear_recycle_bin(function (rdata) {
			_this.open_recycle_bin(1);
			bt.msg(rdata);
		});
	},
	del_recycle_bin: function (path, type, name) {
		var _this = this;
		bt.files.del_recycle_bin({ path: path, name: name }, function (rdata) {
			if (rdata.status) _this.open_recycle_bin(type);
			bt.msg(rdata);
		});
	},
	re_recycle_bin: function (path, type) {
		var _this = this;
		bt.files.re_recycle_bin(path, function (rdata) {
			if (rdata.status) {
				_this.open_recycle_bin(type);
				if (database) database.database_table_view();
			}
			bt.msg(rdata);
		});
	},
};

bt.files = {
	//表格目录template
	dir_details_span: function (path, is_a) {
		var html = '<span class="dir_details_span">',_html = ''
		if($('.file_list_content.file_manage').length) {
			html += '<div class="dir_details" data-path="'+ path +'">\
					<a class="btlink details_event" href="javascript:;">计算</a>\
					<div class="details_cont">\
						<div class="details_content"></div>\
					</div>\
				</div>\
			</span>'
		}else{
			if(!is_a) html += ''
			html += '<div class="dir_details" data-path="'+ path +'">\
						<a class="btlink details_event" style="margin-left:24px" href="javascript:;" title="点击查看目录详情">详情</a>\
						<div class="details_cont">\
							<div class="details_cont_load" style="position:absolute;width: 100%;height: 100%;top: 0;left:0;display: none;z-index: 99999999;background:rgba(0,0,0,0.3);align-items:center;justify-content: center;">\
								<div class="pd15" style="background: #fff;">\
									<img src="/static/img/loading.gif" class="mr10">\
									<span>正在获取目录详情，请稍后...</span>\
								</div>\
							</div>\
							<div class="details_content"></div>\
						</div>\
					</div>\
				</span>'
		}
		return html
	},
	dir_details: function () {
		$('.dir_details').unbind('click').click(function(e){
			var path = $(this).data('path');
			var $this = $(this);
			$this.find('.details_cont').css('top',$this.offset().top+10+ 'px')
			if($('.file_list_content.file_manage').length) $this.find('.details_cont').css('top',$this.offset().top)
			if(($this.offset().top+ 600) > window.screen.height){
				$this.find('.details_cont').css('top',($this.offset().top - 327) + 'px')
				// $this.find('.details_cont').addClass('details_cont2')
				// $this.find('.details_cont').removeClass('details_cont')
			}else{
				// $this.find('.details_cont2').addClass('details_cont')
				// $this.find('.details_cont2').removeClass('details_cont2')
			}
			$('.details_cont').hide();
			// $('.details_cont2').hide();

			if($this.find('.details_content').html() !== '') {
				$this.find('.details_cont').show();
				// $this.find('.details_cont2').show();
				return e.stopPropagation();
			}
			get_details()
			function get_details(is_refresh){
				//判断是否安装插件
				bt.send(
					'get_soft_find',
					'plugin/get_soft_find',
					{
						sName: 'disk_analysis',
					},
					function (rdata1) {
						bt.soft.softData = rdata1
						if(rdata1.setup && rdata1.endtime > 0) {
							bt_tools.send({url: '/files/size/get_batch_path_size',data: {path_list: JSON.stringify([path]),is_refresh: is_refresh ? is_refresh : false}},function (res) {
								if(res['status'] === false) {
									if(res['code'] && res['code'] === 404){
										bt.soft.install('disk_analysis')
									}
									bt_tools.msg(res.msg,2)
								}else{
									$this.find('.details_cont').show();
									$this.find('.details_cont .details_cont_load').css('display','inline-flex');
									$this.find('.details_cont_load').hide()
									var item = res.data[path.lastIndexOf('/') == path.length - 1 ? path.substring(0,path.length - 1) : path] || res.data[path]
									var size = bt.format_size(item.type ? item.total_asize : item.asize)//目录总大小/文件大小
									var dir_count = item.dir_num;//总目录数量
									var file_count = item.file_num;//总文件数量
									if(!item.type){
										dir_count = '--'
										file_count = '--'
									}
									var accept = item.accept;//权限
									var user = item.user;//所属用户
									var mtime = bt.format_data(String(item.mtime));//修改时间
									var stime = bt.format_data(String(item.stime));//扫描时间
									var ctime = bt.format_data(String(item.ctime));//权限修改时间
									var html = '<div class="details_cont_item"><span>目录详情<span>'+ stime +'</span></span><button type="button" title="刷新" class="btn btn-default btn-sm details_refresh" style="margin-left: 5px"><i class="icon-refresh"></i><span>刷新</span></button>\
									</div><div class="details_cont_item">\
										<div>目录路径：</div>\
										<div title="'+ path +'">'+ path +'</div>\
									</div>\
									<div class="details_cont_item">\
										<div>目录大小：</div>\
										<div>'+ size +'</div>\
									</div>\
									<div class="details_cont_item">\
										<div>文件夹数量：</div>\
										<div>'+ dir_count +'</div>\
									</div>\
									<div class="details_cont_item">\
										<div>文件数量：</div>\
										<div>'+ file_count +'</div>\
									</div>\
									<div class="details_cont_item">\
										<div>权限：</div>\
										<div>'+ accept +'<a class="btlink ml16 authority" href="javascript:;">修改权限</a></div>\
									</div>\
									<div class="details_cont_item">\
										<div>所属用户：</div>\
										<div>'+ user +'</div>\
									</div>\
									<hr>\
									<div class="details_cont_item">\
										<div>最后修改时间：</div>\
										<div>'+ mtime +'</div>\
									</div>\
									<div class="details_cont_item">\
										<div>权限变更时间：</div>\
										<div>'+ ctime +'</div>\
									</div>'
									$this.find('.details_cont .details_content').html(html);
									$('.details_refresh').unbind('click').click(function(ev){
										get_details(true)
										ev.stopPropagation();
									})
									$('.authority').unbind('click').click(function(e){
										var rdata = {
											chmod: accept,
											chown: user,
										}
										var arr = (path.lastIndexOf('/') == path.length - 1 ? path.substring(0,path.length - 1) : path).split('/')
										var filename = arr[arr.length - 1]
										var loadY = layer.open({
											type: 1,
											closeBtn: 2,
											title: lan.files.set_auth + '[' + filename + ']',
											area: '400px',
											shadeClose: false,
											content: '<div class="setchmod bt-form ptb15 pb70">\
																					<fieldset>\
																							<legend>' + lan.files.file_own + '</legend>\
																							<p><input type="checkbox" id="owner_r" />' + lan.files.file_read + '</p>\
																							<p><input type="checkbox" id="owner_w" />' + lan.files.file_write + '</p>\
																							<p><input type="checkbox" id="owner_x" />' + lan.files.file_exec + '</p>\
																					</fieldset>\
																					<fieldset>\
																							<legend>' + lan.files.file_group + '</legend>\
																							<p><input type="checkbox" id="group_r" />' + lan.files.file_read + '</p>\
																							<p><input type="checkbox" id="group_w" />' + lan.files.file_write + '</p>\
																							<p><input type="checkbox" id="group_x" />' + lan.files.file_exec + '</p>\
																					</fieldset>\
																					<fieldset>\
																							<legend>' + lan.files.file_public + '</legend>\
																							<p><input type="checkbox" id="public_r" />' + lan.files.file_read + '</p>\
																							<p><input type="checkbox" id="public_w" />' + lan.files.file_write + '</p>\
																							<p><input type="checkbox" id="public_x" />' + lan.files.file_exec + '</p>\
																					</fieldset>\
																					<div class="setchmodnum"><input class="bt-input-text" type="text" id="access" maxlength="3" value="' + rdata.chmod + '">' + lan.files.file_menu_auth + '，\
																					<span>' + lan.files.file_own + '\
																					<select id="chown" class="bt-input-text">\
																							<option value="www" ' + (rdata.chown == 'www' ? 'selected="selected"' : '') + '>www</option>\
																							<option value="mysql" ' + (rdata.chown == 'mysql' ? 'selected="selected"' : '') + '>mysql</option>\
																							<option value="root" ' + (rdata.chown == 'root' ? 'selected="selected"' : '') + '>root</option>\
																					</select></span>\
																					<span><input type="checkbox" id="accept_all" checked /><label for="accept_all" style="position: absolute;margin-top: 4px; margin-left: 5px;font-weight: 400;">应用到子目录</label></span>\
																					</div>\
																					<div class="bt-form-submit-btn">\
																							<button type="button" class="btn btn-danger btn-sm btn-title layer_close">' + lan['public'].close + '</button>\
																							<button type="button" class="btn btn-success btn-sm btn-title set_access_authority">' + lan['public'].ok + '</button>\
																					</div>\
																			</div>',
											success: function (index, layers) {
												edit_access_authority();
												$("#access").keyup(function () {
													edit_access_authority();
												});
												$("input[type=checkbox]").change(function () {
													var idName = ['owner', 'group', 'public'];
													var onacc = '';
													for (var n = 0; n < idName.length; n++) {
														var access = 0;
														access += $("#" + idName[n] + "_x").prop('checked') ? 1 : 0;
														access += $("#" + idName[n] + "_w").prop('checked') ? 2 : 0;
														access += $("#" + idName[n] + "_r").prop('checked') ? 4 : 0;
														onacc += access;
													}
													$("#access").val(onacc);
												});
												//提交
												$('.set_access_authority').click(function () {
													var chmod = $("#access").val();
													var chown = $("#chown").val();
													var all = $("#accept_all").prop("checked") ? 'True' : 'False';
													var _form = {}
													_form = {
														user: chown,
														access: chmod,
														all: all
													}
													_form['filename'] = path
													bt.send('SetFileAccess', 'files/SetFileAccess', _form, function (res) {
														if (res.status) {
															layer.close(layers);
															get_details(true)
															if($('.file_list_content.file_manage').length) bt_file.reader_file_list({ path: bt_file.file_path, is_operating: false })
														}
														layer.msg(res.msg, { icon: res.status ? 1 : 2 });
													})
												})
												$('.layer_close').click(function () {
													layer.close(layers);
												})
												function edit_access_authority() {
													var access = $("#access").val();
													var idName = ['owner', 'group', 'public'];
													for (var n = 0; n < idName.length; n++) {
														$("#" + idName[n] + "_x").prop('checked', false);
														$("#" + idName[n] + "_w").prop('checked', false);
														$("#" + idName[n] + "_r").prop('checked', false);
													}
													var lh = access.length
													access = lh === 1 ? '00'+access : (lh === 2 ? '0'+access : access)
													for (var i = 0; i < access.length; i++) {
														var onacc = access.substr(i, 1);
														if (i > idName.length) continue;
														if (onacc > 7) $("#access").val(access.substr(0, access.length - 1));
														switch (onacc) {
															case '1':
																$("#" + idName[i] + "_x").prop('checked', true);
																break;
															case '2':
																$("#" + idName[i] + "_w").prop('checked', true);
																break;
															case '3':
																$("#" + idName[i] + "_x").prop('checked', true);
																$("#" + idName[i] + "_w").prop('checked', true);
																break;
															case '4':
																$("#" + idName[i] + "_r").prop('checked', true);
																break;
															case '5':
																$("#" + idName[i] + "_r").prop('checked', true);
																$("#" + idName[i] + "_x").prop('checked', true);
																break;
															case '6':
																$("#" + idName[i] + "_r").prop('checked', true);
																$("#" + idName[i] + "_w").prop('checked', true);
																break;
															case '7':
																$("#" + idName[i] + "_r").prop('checked', true);
																$("#" + idName[i] + "_w").prop('checked', true);
																$("#" + idName[i] + "_x").prop('checked', true);
																break;
														}
													}
												}
											}
										});
									})
									$(document).unbind('click').click(function (ev) {
										$this.find('.details_cont').hide();
										ev.stopPropagation();
									});
									e.stopPropagation();
									e.preventDefault();
								}
							},{verify: false})
						}else {
							if(rdata1.endtime > 0) {
								bt.soft.install('disk_analysis')
							}else{
								var item = {
									name: 'disk_analysis',
									pluginName: '堡塔硬盘分析工具',
									ps: '急速分析磁盘/硬盘占用情况',
									preview: false,
									limit: 'ltd',
									description:['检测硬盘空间','占用百分比显示'],
									imgSrc:'https://www.bt.cn/Public/new/plugin/disk_analysis/1.png'
								}
								bt.soft.product_pay_view({ totalNum: 67, limit: 'ltd', closePro: true,pluginName:item.pluginName,fun:function () {
										product_recommend.recommend_product_view(item, {
											imgArea: ['783px', '718px']
										}, 'ltd', 67, item.name,true)
									}})
								$('.buyNow').unbind('click').click(function (e){
									bt.soft.product_pay_view({
										name: rdata1.title,
										pid: rdata1.pid,
										type: rdata1.type,
										plugin: true,
										renew: rdata1.endtime,
										ps: rdata1.ps.replaceAll("'", '`'),
										ex1: rdata1.ex1,
										totalNum:67
									})
									e.stopPropagation()
									e.preventDefault();
								})
							}
						}
					})
			}
			e.stopPropagation();
		})
	},
	dir_details_hover: function (e,_that,web) {
		var _this = _that
		var path = _this.data('path');
		var id = _this.data('id')
		var $this = _this;
		$this.find('.details_cont').css('top',bt.files.getElementPosition(e.target).top +$this.height() + 'px')
		if($('.file_list_content.file_manage').length) $this.find('.details_cont').css('top',$this.offset().top)
		$('.details_cont').hide();
		if($this.find('.details_content').html() !== '') {
			$this.find('.details_cont').show();
			return e.stopPropagation();
		}
		get_details()
		function get_details(is_refresh){
			//判断是否安装插件
			bt.send(
				'get_soft_find',
				'plugin/get_soft_find',
				{
					sName: 'disk_analysis',
				},
				function (rdata1) {
					$.post({url: '/files/size/get_batch_path_size',data: {path_list: JSON.stringify([path]),is_refresh: is_refresh ? is_refresh : false}},function (res) {
						$this.find('.details_cont').show();
						$this.find('.details_cont .details_cont_load').css('display','inline-flex');
						$this.find('.details_cont_load').hide()
						var item = res.data?res.data[path.lastIndexOf('/') == path.length - 1 ? path.substring(0,path.length - 1) : path]:{}
						var size = '--',accept = '--',user = '--',mtime = '--',stime = '--',ctime = '--',text = '使用';
						if(rdata1.setup && rdata1.endtime > 0) {
							size = item.type?bt.format_size(item.type ? item.total_asize : item.asize):'--'//目录总大小/文件大小
							mtime = item.mtime?bt.format_data(String(item.mtime)):'--';//修改时间
							stime = item.stime?bt.format_data(String(item.stime)):'--';//扫描时间
							ctime = item.ctime?bt.format_data(String(item.ctime)):'--';//权限修改时间
							accept = item.accept?item.accept:'--';//权限
							user = item.user?item.accept:'--';//所属用户
						}else{
							if(!rdata1.setup  && rdata1.endtime > 0 ) text = '安装'
							if(rdata1.endtime < 0 ) text = '购买'
							item = {}
						}
						var html = '<div class="dir_details_hover_tip">了解更多目录信息，请'+text+'<span class="btlink disk_analysis_click">磁盘分析工具</span></div>\
									<div class="details_cont_item" >\
									<span>目录详情<span>'+ stime +'</span></span>\
									</div><div class="details_cont_item" style="align-items:flex-start">\
										<div >目录路径：</div>\
												<div title="'+ path +'" id="path_data">'+ path +'<br/>\
												<div class="dir_details_hover_button">\
														<button type="button" class="btn btn-default btn-sm" onclick="openPath(\''+path+'\')">打开</button>\
														<button type="button" class="btn btn-default btn-sm " onclick="bt.pub.copy_pass(\''+path+'\')">复制</button>\
														<button type="button" class="btn btn-default btn-sm change_path">修改</button>\
												</div>\
										</div>\
									</div>\
									<div class="details_cont_item">\
										<div>目录大小：</div>\
										<div>'+ size +'</div>\
									</div>\
									<div class="details_cont_item">\
										<div>权限/所有者：</div>\
										<div>'+ accept +'/'+user+'<a class="btlink ml16 authority '+(rdata1.setup && rdata1.endtime > 0?'':'hide')+'" href="javascript:;">修改权限</a></div>\
									</div>\
									<hr>\
									<div class="details_cont_item">\
										<div>最后修改时间：</div>\
										<div>'+ mtime +'</div>\
									</div>\
									<div class="details_cont_item">\
										<div>权限变更时间：</div>\
										<div>'+ ctime +'</div>\
									</div>'
						$this.find('.details_cont .details_content').html(html);
						$('.change_path').click(function(){
							bt.select_path('path_data','dir',function(path0, path,_type){
								bt.site.set_site_path(id, path0, function (ret) {
									layer.msg(ret.msg, { icon: ret.status ? 1 : 2 });
									site_table.$refresh_table_list(true);
									$('#path_data').text(path0)
								});
							});
						})
						$('.details_refresh').unbind('click').click(function(ev){
							get_details(true)
							ev.stopPropagation();
						})
						$('.disk_analysis_click').unbind('click').click(function(e){
							if(rdata1.setup && rdata1.endtime > 0) {
								bt.soft.set_lib_config('disk_analysis','堡塔硬盘分析工具',rdata1.version)
							}else if(!rdata1.setup  && rdata1.endtime > 0 ){
								bt.soft.install('disk_analysis')
							}else{
								var item = {
									name: rdata1.name,
									pluginName: rdata1.title,
									ps: '急速分析磁盘/硬盘占用情况',
									preview: false,
									limit: 'ltd',
									description:['检测硬盘空间使用情况','快速分析占用大量文件'],
									imgSrc:'https://www.bt.cn/Public/new/plugin/disk_analysis/1.png'
								}
								bt.soft.product_pay_view({ totalNum: 121, limit: 'ltd', closePro: true,pluginName:'堡塔硬盘分析工具',fun:function () {
										product_recommend.recommend_product_view(item, {
											imgArea: ['783px', '718px']
										}, 'ltd', 121, item.name,true)
									}})
							}
							e.stopPropagation()
						})
						$('.authority').unbind('click').click(function(e){
							var rdata = {
								chmod: accept,
								chown: user,
							}
							var arr = (path.lastIndexOf('/') == path.length - 1 ? path.substring(0,path.length - 1) : path).split('/')
							var filename = arr[arr.length - 1]
							var loadY = layer.open({
								type: 1,
								closeBtn: 2,
								title: lan.files.set_auth + '[' + filename + ']',
								area: '400px',
								shadeClose: false,
								content: '<div class="setchmod bt-form ptb15 pb70">\
												<fieldset>\
														<legend>' + lan.files.file_own + '</legend>\
														<p><input type="checkbox" id="owner_r" />' + lan.files.file_read + '</p>\
														<p><input type="checkbox" id="owner_w" />' + lan.files.file_write + '</p>\
														<p><input type="checkbox" id="owner_x" />' + lan.files.file_exec + '</p>\
												</fieldset>\
												<fieldset>\
														<legend>' + lan.files.file_group + '</legend>\
														<p><input type="checkbox" id="group_r" />' + lan.files.file_read + '</p>\
														<p><input type="checkbox" id="group_w" />' + lan.files.file_write + '</p>\
														<p><input type="checkbox" id="group_x" />' + lan.files.file_exec + '</p>\
												</fieldset>\
												<fieldset>\
														<legend>' + lan.files.file_public + '</legend>\
														<p><input type="checkbox" id="public_r" />' + lan.files.file_read + '</p>\
														<p><input type="checkbox" id="public_w" />' + lan.files.file_write + '</p>\
														<p><input type="checkbox" id="public_x" />' + lan.files.file_exec + '</p>\
												</fieldset>\
												<div class="setchmodnum"><input class="bt-input-text" type="text" id="access" maxlength="3" value="' + rdata.chmod + '">' + lan.files.file_menu_auth + '，\
												<span>' + lan.files.file_own + '\
												<select id="chown" class="bt-input-text">\
														<option value="www" ' + (rdata.chown == 'www' ? 'selected="selected"' : '') + '>www</option>\
														<option value="mysql" ' + (rdata.chown == 'mysql' ? 'selected="selected"' : '') + '>mysql</option>\
														<option value="root" ' + (rdata.chown == 'root' ? 'selected="selected"' : '') + '>root</option>\
												</select></span>\
												<span><input type="checkbox" id="accept_all" checked /><label for="accept_all" style="position: absolute;margin-top: 4px; margin-left: 5px;font-weight: 400;">应用到子目录</label></span>\
												</div>\
												<div class="bt-form-submit-btn">\
														<button type="button" class="btn btn-danger btn-sm btn-title layer_close">' + lan['public'].close + '</button>\
														<button type="button" class="btn btn-success btn-sm btn-title set_access_authority">' + lan['public'].ok + '</button>\
												</div>\
										</div>',
								success: function (index, layers) {
									edit_access_authority();
									$("#access").keyup(function () {
										edit_access_authority();
									});
									$("input[type=checkbox]").change(function () {
										var idName = ['owner', 'group', 'public'];
										var onacc = '';
										for (var n = 0; n < idName.length; n++) {
											var access = 0;
											access += $("#" + idName[n] + "_x").prop('checked') ? 1 : 0;
											access += $("#" + idName[n] + "_w").prop('checked') ? 2 : 0;
											access += $("#" + idName[n] + "_r").prop('checked') ? 4 : 0;
											onacc += access;
										}
										$("#access").val(onacc);
									});
									//提交
									$('.set_access_authority').click(function () {
										var chmod = $("#access").val();
										var chown = $("#chown").val();
										var all = $("#accept_all").prop("checked") ? 'True' : 'False';
										var _form = {}
										_form = {
											user: chown,
											access: chmod,
											all: all
										}
										_form['filename'] = path
										bt.send('SetFileAccess', 'files/SetFileAccess', _form, function (res) {
											if (res.status) {
												layer.close(layers);
												get_details(true)
												if($('.file_list_content.file_manage').length) bt_file.reader_file_list({ path: bt_file.file_path, is_operating: false })
											}
											layer.msg(res.msg, { icon: res.status ? 1 : 2 });
										})
									})
									$('.layer_close').click(function () {
										layer.close(layers);
									})
									function edit_access_authority() {
										var access = $("#access").val();
										var idName = ['owner', 'group', 'public'];
										for (var n = 0; n < idName.length; n++) {
											$("#" + idName[n] + "_x").prop('checked', false);
											$("#" + idName[n] + "_w").prop('checked', false);
											$("#" + idName[n] + "_r").prop('checked', false);
										}
										var lh = access.length
										access = lh === 1 ? '00'+access : (lh === 2 ? '0'+access : access)
										for (var i = 0; i < access.length; i++) {
											var onacc = access.substr(i, 1);
											if (i > idName.length) continue;
											if (onacc > 7) $("#access").val(access.substr(0, access.length - 1));
											switch (onacc) {
												case '1':
													$("#" + idName[i] + "_x").prop('checked', true);
													break;
												case '2':
													$("#" + idName[i] + "_w").prop('checked', true);
													break;
												case '3':
													$("#" + idName[i] + "_x").prop('checked', true);
													$("#" + idName[i] + "_w").prop('checked', true);
													break;
												case '4':
													$("#" + idName[i] + "_r").prop('checked', true);
													break;
												case '5':
													$("#" + idName[i] + "_r").prop('checked', true);
													$("#" + idName[i] + "_x").prop('checked', true);
													break;
												case '6':
													$("#" + idName[i] + "_r").prop('checked', true);
													$("#" + idName[i] + "_w").prop('checked', true);
													break;
												case '7':
													$("#" + idName[i] + "_r").prop('checked', true);
													$("#" + idName[i] + "_w").prop('checked', true);
													$("#" + idName[i] + "_x").prop('checked', true);
													break;
											}
										}
									}
								}
							});
						})
						$(document).unbind('click').click(function (ev) {
							$this.find('.details_cont').hide();
							$this.find('.loading_gif').addClass('hide')
							ev.stopPropagation();
						});
						e.stopPropagation();
						e.preventDefault();
					})
				})
		}
		e.stopPropagation();
	},
	getElementPosition:function(element)  {
		let top = element.offsetTop //这是获取元素距父元素顶部的距离
		let left = element.offsetLeft
		var current = element.offsetParent //这是获取父元素
		while (current !== null) {
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
	get_path: function () {
		path = path = bt.get_cookie('Path');
		if (!path) {
			bt.msg({
				msg: lan.get('lack_param', ['response']),
			});
		}
	},
	get_files: function (Path, searchV, callback, sort) {
		var searchtype = Path;
		if (isNaN(Path)) {
			var p = '1';
		} else {
			var p = Path;
			Path = bt.get_cookie('Path');
		}
		var search = '';
		if (searchV.length > 1 && searchtype == '1') {
			search = '&search=' + searchV;
		}
		sort_str = '';
		if (sort) sort_str = '&sort=' + sort + '&reverse=True';
		var showRow = bt.get_cookie('showRow');
		if (!showRow) showRow = '500';
		var totalSize = 0;
		var loadT = bt.load(lan['public'].the);
		bt.send('get_files', 'files/GetDir', 'tojs=GetFiles&p=' + p + '&showRow=' + showRow + search + '&path=' + Path + sort_str, function (rdata) {
			loadT.close();
			//bt.set_cookie('Path',rdata.PATH);
			if (callback) callback(rdata);
		});
	},
	get_recycle_bin: function (type, callback) {
		loading = bt.load(lan['public'].the);
		bt.send('Get_Recycle_bin', 'files/Get_Recycle_bin', {}, function (rdata) {
			loading.close();
			if (callback) callback(rdata);
		});
	},
	re_recycle_bin: function (path, callback) {
		bt.confirm(
			{
				msg: lan.files.recycle_bin_re_msg,
				title: lan.files.recycle_bin_re_title,
			},
			function () {
				var loadT = bt.load(lan.files.recycle_bin_re_the);
				bt.send('Re_Recycle_bin', 'files/Re_Recycle_bin', 'path=' + path, function (rdata) {
					loadT.close();
					bt.msg(rdata);
					if (callback) callback(rdata);
				});
			}
		);
	},
	del_recycle_bin: function (obj, callback) {
		bt.input_confirm(
			{
				title: '永久删除' + (obj.type === 'folder' ? '文件夹' : '文件') + '【' + obj.name + '】',
				value: '删除' + (obj.type === 'folder' ? '文件夹' : '文件'),
				msg: '<span class="color-org">风险操作，删除选中的' + (obj.type === 'folder' ? '文件夹' : '文件') + '将彻底消失</span>，此操作不可逆，是否继续操作？',
			},
			function () {
				var loadT = bt.load(lan.files.recycle_bin_del_the);
				bt.send('Re_Recycle_bin', 'files/Del_Recycle_bin', 'path=' + obj.path, function (rdata) {
					loadT.close();
					bt.msg(rdata);
					if (callback) callback(rdata);
				});
			}
		);
	},
	clear_recycle_bin: function (callback) {
		bt.input_confirm(
			{
				title: lan.files.recycle_bin_close,
				value: lan.files.recycle_bin_close,
				msg: '<span class="color-org">风险操作，清空回收站后，回收站所有暂存文件或数据库将彻底消失</span>，无法恢复，是否继续操作？',
			},
			function () {
				var loadT = bt.load("<div class='myspeed'>" + lan.files.recycle_bin_close_the + '</div>');
				bt.send('Re_Recycle_bin', 'files/Close_Recycle_bin', {}, function (rdata) {
					loadT.close();
					bt.msg(rdata);
					if (callback) callback(rdata);
				});
			}
		);
	},
	set_recycle_bin: function (db) {
		var loadT = bt.load(lan['public'].the);
		var data = {};
		if (db)
			data = {
				db: db,
			};
		bt.send('Recycle_bin', 'files/Recycle_bin', data, function (rdata) {
			loadT.close();
			bt.msg(rdata);
		});
	},
	rename: function (fileName, type, callback) {
		if (type == undefined) type = 0;
		_this = this;
		path = _this.get_path();
		if (type) {
			var newFileName = path + '/' + $('#newFileName').val();
			var oldFileName = path + '/' + fileName;
			var loading = bt.load(lan['public'].the);
			bt.send('MvFile', 'files/MvFile', 'sfile=' + oldFileName + '&dfile=' + newFileName, function (rdata) {
				loading.close();
				bt.msg(rdata);
				if (callback) callback(rdata);
			});
			return;
		}
		bt.open({
			type: 1,
			shift: 5,
			closeBtn: 2,
			area: '320px',
			title: lan.files.file_menu_rename,
			content:
				'<div class="bt-form pd20 pb70">\
							<div class="line">\
							<input type="text" class="bt-input-text" name="Name" id="newFileName" value="' +
				fileName +
				'" placeholder="' +
				lan.files.file_name +
				'" style="width:100%" />\
							</div>\
							<div class="bt-form-submit-btn">\
							<button type="button" class="btn btn-danger btn-sm btn-title" onclick="layer.closeAll()">' +
				lan['public'].close +
				'</button>\
							<button type="button" id="ReNameBtn" class="btn btn-success btn-sm btn-title">' +
				lan['public'].save +
				'</button>\
							</div>\
						</div>',
		});
		setTimeout(function () {
			$('#ReNameBtn').click(function () {
				_this.rename(fileName, 1, callback);
			});
			$('#newFileName')
				.focus()
				.keyup(function (e) {
					if (e.keyCode == 13) $('#ReNameBtn').click();
				});
		}, 100);
	},
	get_file_body: function (path, callback) {
		bt.send('GetFileBody', 'files/GetFileBody', 'path=' + path, function (rdata) {
			if (callback) callback(rdata);
		});
	},
	set_file_body: function (path, data, encoding, callback) {
		var loading = bt.load(lan.site.saving_txt);
		bt.send(
			'SaveFileBody',
			'files/SaveFileBody',
			{
				path: path,
				data: data,
				encoding: encoding,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	del_file: function (path, callback) {
		bt.confirm(
			{
				msg: '删除文件【' + path + '】后，该数据库文件将迁至回收站，是否继续操作？',
				title: lan.files.del_file,
			},
			function () {
				loading = bt.load(lan['public'].the);
				bt.send('del_file', 'files/DeleteFile', 'path=' + path, function (rdata) {
					loading.close();
					bt.msg(rdata);
					if (callback) callback(rdata);
				});
			}
		);
	},
	del_dir: function (path, callback) {
		bt.confirm(
			{
				msg: lan.get('recycle_bin_confirm_dir', [path]),
				title: lan.files.del_file,
			},
			function () {
				loading = bt.load(lan['public'].the);
				bt.send('DeleteDir', 'files/DeleteDir', 'path=' + path, function (rdata) {
					loading.close();
					bt.msg(rdata);
					if (callback) callback(rdata);
				});
			}
		);
	},
	cut_file: function (
		fileName,
		callback //裁剪
	) {
		bt.set_cookie('cutFileName', fileName);
		bt.set_cookie('copyFileName', null);
		bt.msg({
			msg: lan.files.mv_ok,
			icon: 1,
			time: 1,
		});
		if (callback) callback(rdata);
	},
	copy_file: function (fileName, callback) {
		bt.set_cookie('cutFileName', null);
		bt.set_cookie('copyFileName', fileName);
		bt.msg({
			msg: lan.files.copy_ok,
			icon: 1,
			time: 1,
		});
		if (callback) callback(rdata);
	},
	paste_file: function (
		fileName,
		callback //粘贴
	) {
		_this = this;
		path = _this.get_path();
		var copyName = bt.get_cookie('copyFileName');
		var cutName = bt.get_cookie('cutFileName');
		var filename = copyName;
		if (cutName != 'null' && cutName != undefined) filename = cutName;
		filename = filename.split('/').pop();

		bt.send(
			'CheckExistsFiles',
			'files/CheckExistsFiles',
			{
				dfile: path,
				filename: filename,
			},
			function (rdata) {
				if (rdata.length > 0) {
					var tbody = '';
					for (var i = 0; i < rdata.length; i++) {
						tbody += '<tr><td>' + rdata[i].filename + '</td><td>' + bt.format_size(rdata[i].size) + '</td><td>' + bt.format_data(rdata[i].mtime) + '</td></tr>';
					}
					var mbody =
						'<div class="divtable"><table class="table table-hover" width="100%" border="0" cellpadding="0" cellspacing="0"><thead><th>' +
						lan.bt.filename +
						'</th><th>' +
						lan.bt.file_size +
						'</th><th>' +
						lan.bt.etime +
						'</th></thead>\
								<tbody>' +
						tbody +
						'</tbody>\
								</table></div>';
					bt.show_confirm(bt.files.file_conver_msg, mbody, function () {
						_this.paste_to(path, copyName, cutName, fileName, callback);
					});
				} else {
					_this.paste_to(path, copyName, cutName, fileName, callback);
				}
			}
		);
	},
	paste_to: function (path, copyName, cutName, fileName, callback) {
		if (copyName != 'null' && copyName != undefined) {
			var loading = bt.msg({
				msg: lan.files.copy_the,
				icon: 16,
			});
			bt.send('CopyFile', 'files/CopyFile', 'sfile=' + copyName + '&dfile=' + path + '/' + fileName, function (rdata) {
				loading.close();
				bt.msg(rdata);
				if (callback) callback(rdata);
			});
			bt.set_cookie('copyFileName', null);
			bt.set_cookie('cutFileName', null);
			return;
		}

		if (cutName != 'null' && cutName != undefined) {
			var loading = bt.msg({
				msg: lan.files.copy_the,
				icon: 16,
			});
			bt.send('MvFile', 'files/MvFile', 'sfile=' + copyName + '&dfile=' + path + '/' + fileName, function (rdata) {
				loading.close();
				bt.msg(rdata);
				if (callback) callback(rdata);
			});
			bt.set_cookie('copyFileName', null);
			bt.set_cookie('cutFileName', null);
		}
	},
	zip: function (dirName, submits, callback) {
		_this = this;
		if (submits != undefined) {
			if (dirName.indexOf(',') == -1) {
				tmp = $('#sfile').val().split('/');
				sfile = tmp[tmp.length - 1];
			} else {
				sfile = dirName;
			}
			dfile = $('#dfile').val();
			layer.closeAll();
			var loading = bt.load(lan.files.zip_the);
			bt.send('Zip', 'files/Zip', 'sfile=' + sfile + '&dfile=' + dfile + '&type=tar&path=' + path, function (rdata) {
				loading.close();
				if (rdata == null || rdata == undefined) {
					bt.msg({
						msg: lan.files.zip_ok,
						icon: 1,
					});
					if (callback) callback(rdata);
					return;
				}
				bt.msg(rdata);
				if (rdata.status) if (callback) callback(rdata);
			});
			return;
		}
		var ext = '.zip';
		if (bt.os == 'Linux') ext = '.tar.gz';

		param = dirName;
		if (dirName.indexOf(',') != -1) {
			tmp = path.split('/');
			dirName = path + '/' + tmp[tmp.length - 1];
		}
		bt.open({
			type: 1,
			shift: 5,
			closeBtn: 2,
			area: '650px',
			title: lan.files.zip_title,
			content:
				'<div class="bt-form pd20 pb70">' +
				'<div class="line noborder">' +
				'<input type="text" class="form-control" id="sfile" value="' +
				param +
				'" placeholder="" style="display:none" />' +
				'<span>' +
				lan.files.zip_to +
				'</span><input type="text" class="bt-input-text" id="dfile" value="' +
				dirName +
				ext +
				'" placeholder="' +
				lan.files.zip_to +
				'" style="width: 75%; display: inline-block; margin: 0px 10px 0px 20px;" /><span class="glyphicon glyphicon-folder-open cursor" onclick="ChangePath(\'dfile\')"></span>' +
				'</div>' +
				'<div class="bt-form-submit-btn">' +
				'<button type="button" class="btn btn-danger btn-sm btn-title" onclick="layer.closeAll()">' +
				lan['public'].close +
				'</button>' +
				'<button type="button" id="ReNameBtn" class="btn btn-success btn-sm btn-title"' +
				lan.files.file_menu_zip +
				'</button>' +
				'</div>' +
				'</div>',
		});

		setTimeout(function () {
			$('#dfile').change(function () {
				var dfile = bt.rtrim($(this).val(), '/');
				if (bt.check_zip(dfile) === -1) {
					dfile += ext;
					$(this).val(dfile);
				}
			});
			$('#ReNameBtn').click(function () {
				_this.zip(param, 1, callback);
			});
		}, 100);
	},
	un_zip: function (
		fileName,
		type,
		callback // type: zip|tar
	) {
		_this = this;
		if (type.length == 3) {
			var sfile = encodeURIComponent($('#sfile').val());
			var dfile = encodeURIComponent($('#dfile').val());
			var password = encodeURIComponent($('#unpass').val());
			coding = $("select[name='coding']").val();
			layer.closeAll();
			var loading = bt.load(lan.files.unzip_the);
			bt.send('UnZip', 'files/UnZip', 'sfile=' + sfile + '&dfile=' + dfile + '&type=' + type + '&coding=' + coding + '&password=' + password, function (rdata) {
				loading.close();
				bt.msg(rdata);
				if (callback) callback(rdata);
			});
			return;
		}
		var path = bt.get_file_path(fileName);
		type = type == 1 ? 'tar' : 'zip';
		var umpass = '';
		if (type == 'zip') {
			umpass =
				'<div class="line"><span class="tname">' +
				lan.files.zip_pass_title +
				'</span><input type="text" class="bt-input-text" id="unpass" value="" placeholder="' +
				lan.files.zip_pass_msg +
				'" style="width:330px" /></div>';
		}
		bt.open({
			type: 1,
			shift: 5,
			closeBtn: 2,
			area: '490px',
			title: lan.files.unzip_title,
			content:
				'<div class="bt-form pd20 pb70">' +
				'<div class="line unzipdiv">' +
				'<span class="tname">' +
				lan.files.unzip_name +
				'</span><input type="text" class="bt-input-text" id="sfile" value="' +
				fileName +
				'" placeholder="' +
				lan.files.unzip_name_title +
				'" style="width:330px" /></div>' +
				'<div class="line"><span class="tname">' +
				lan.files.unzip_to +
				'</span><input type="text" class="bt-input-text" id="dfile" value="' +
				path +
				'" placeholder="' +
				lan.files.unzip_to +
				'" style="width:330px" /></div>' +
				umpass +
				'<div class="line"><span class="tname">' +
				lan.files.unzip_coding +
				'</span><select class="bt-input-text" name="coding">' +
				'<option value="UTF-8">UTF-8</option>' +
				'<option value="gb18030">GBK</option>' +
				'</select>' +
				'</div>' +
				'<div class="bt-form-submit-btn">' +
				'<button type="button" class="btn btn-danger btn-sm btn-title" onclick="layer.closeAll()">' +
				lan['public'].close +
				'</button>' +
				'<button type="button" id="ReNameBtn" class="btn btn-success btn-sm btn-title" >' +
				lan.files.file_menu_unzip +
				'</button>' +
				'</div>' +
				'</div>',
		});
		setTimeout(function () {
			$('#ReNameBtn').click(function () {
				_this.un_zip(fileName, type, callback);
			});
		}, 100);
	},
	show_img: function (fileName) {
		var imgUrl = '/download?filename=' + fileName;
		bt.open({
			type: 1,
			closeBtn: 2,
			title: false,
			area: '500px',
			shadeClose: true,
			content: '<div class="showpicdiv"><img width="100%" src="' + imgUrl + '"></div>',
		});
		$('.layui-layer').css('top', '30%');
	},
	get_files_bytes: function (fileName, fileSize) {
		window.open('/download?filename=' + encodeURIComponent(fileName));
	},
	upload_files: function () {
		path = this.get_path();
		bt.open({
			type: 1,
			closeBtn: 2,
			title: lan.files.up_title,
			area: ['500px', '500px'],
			shadeClose: false,
			content:
				'<div class="fileUploadDiv"><input type="hidden" id="input-val" value="' +
				path +
				'" />\
						<input type="file" id="file_input"  multiple="true" autocomplete="off" />\
						<button type="button"  id="opt" autocomplete="off">' +
				lan.files.up_add +
				'</button>\
						<button type="button" id="up" autocomplete="off" >' +
				lan.files.up_start +
				'</button>\
						<span id="totalProgress" style="position: absolute;top: 7px;right: 147px;"></span>\
						<span style="float:right;margin-top: 9px;">\
						<font>' +
				lan.files.up_coding +
				':</font>\
						<select id="fileCodeing" >\
							<option value="byte">' +
				lan.files.up_bin +
				'</option>\
							<option value="utf-8">UTF-8</option>\
							<option value="gb18030">GB2312</option>\
						</select>\
						</span>\
						<button type="button" id="filesClose" autocomplete="off" onClick="layer.closeAll()" >' +
				lan['public'].close +
				'</button>\
						<ul id="up_box"></ul></div>',
		});
		UploadStart();
	},
	set_chmod: function (action, fileName, callback) {
		_this = this;
		if (action == 1) {
			var chmod = $('#access').val();
			var chown = $('#chown').val();
			var data = 'filename=' + fileName + '&user=' + chown + '&access=' + chmod;
			var loadT = bt.load(lan['public'].config);
			bt.send('SetFileAccess', 'files/SetFileAccess', data, function (rdata) {
				loadT.close();
				if (rdata.status) layer.closeAll();
				bt.msg(rdata);
				if (callback) callback(rdata);
			});
			return;
		}

		var toExec = fileName == lan.files.all ? 'Batch(3,1)' : "_this.set_chmod(1,'" + fileName + "',callback)";

		bt.send('GetFileAccess', 'files/GetFileAccess', 'filename=' + fileName, function (rdata) {
			if (bt.os == 'Linux') {
				bt.open({
					type: 1,
					title: lan.files.set_auth + '[' + fileName + ']',
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
									</select></span></div>\
									<div class="bt-form-submit-btn">\
										<button type="button" class="btn btn-danger btn-sm btn-title" onclick="layer.closeAll()">' +
						lan['public'].close +
						'</button>\
												<button type="button" class="btn btn-success btn-sm btn-title" onclick="' +
						toExec +
						'" >' +
						lan['public'].ok +
						'</button>\
											</div>\
								</div>',
				});

				settimeout(function () {
					_this.on_linux_access();
					$('#access').keyup(function () {
						_this.on_linux_access();
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
				}, 100);
			}
		});
	},
	on_linux_access: function () {
		var access = $('#access').val();
		var idName = ['owner', 'group', 'public'];
		for (var n = 0; n < idName.length; n++) {
			$('#' + idName[n] + '_x').prop('checked', false);
			$('#' + idName[n] + '_w').prop('checked', false);
			$('#' + idName[n] + '_r').prop('checked', false);
		}
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
	on_win_access: function () {},
	get_right_click: function (type, path, name) {
		_this = this;
		var displayZip = bt.check_zip(type);
		var options = {
			items: [
				{
					text: lan.files.file_menu_copy,
					onclick: function () {
						_this.copy_file(path);
					},
				},
				{
					text: lan.files.file_menu_mv,
					onclick: function () {
						_this.cut_file(path);
					},
				},
				{
					text: lan.files.file_menu_rename,
					onclick: function () {
						_this.rename(path, name);
					},
				},
				{
					text: lan.files.file_menu_auth,
					onclick: function () {
						_this.set_chmod(0, path);
					},
				},
				{
					text: lan.files.file_menu_zip,
					onclick: function () {
						_this.zip(path);
					},
				},
			],
		};
		if (type == 'dir') {
			options.items.push({
				text: lan.files.file_menu_del,
				onclick: function () {
					_this.del_dir(path);
				},
			});
		} else if (isText(type)) {
			options.items.push(
				{
					text: lan.files.file_menu_edit,
					onclick: function () {
						bt.on_edit_file(0, path);
					},
				},
				{
					text: lan.files.file_menu_down,
					onclick: function () {
						_this.get_files_bytes(path);
					},
				},
				{
					text: lan.files.file_menu_del,
					onclick: function () {
						_this.del_file(path);
					},
				}
			);
		} else if (displayZip != -1) {
			options.items.push(
				{
					text: lan.files.file_menu_unzip,
					onclick: function () {
						_this.un_zip(path, displayZip);
					},
				},
				{
					text: lan.files.file_menu_down,
					onclick: function () {
						_this.get_files_bytes(path);
					},
				},
				{
					text: lan.files.file_menu_del,
					onclick: function () {
						_this.del_file(path);
					},
				}
			);
		} else if (isImage(type)) {
			options.items.push(
				{
					text: lan.files.file_menu_img,
					onclick: function () {
						_this.show_img(path);
					},
				},
				{
					text: lan.files.file_menu_down,
					onclick: function () {
						_this.get_files_bytes(path);
					},
				},
				{
					text: lan.files.file_menu_del,
					onclick: function () {
						_this.del_file(path);
					},
				}
			);
		} else {
			options.items.push(
				{
					text: lan.files.file_menu_down,
					onclick: function () {
						_this.get_files_bytes(path);
					},
				},
				{
					text: lan.files.file_menu_del,
					onclick: function () {
						_this.del_file(path);
					},
				}
			);
		}
		return options;
	},
	get_dir_size: function (path, callback) {
		if (!path) path = this.get_path();
		var loading = bt.load(lan['public'].the);
		bt.send(
			'GetDirSize',
			'files/GetDirSize',
			{
				path: path,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	batch: function (type, access, callback) {
		_this = this;

		var el = document.getElementsByTagName('input');
		var len = el.length;
		var data = 'path=' + path + '&type=' + type;
		var name = 'data';

		var oldType = bt.get_cookie('BatchPaste');

		for (var i = 0; i < len; i++) {
			if (el[i].checked == true && el[i].value != 'on') {
				data += '&' + name + '=' + el[i].value;
			}
		}

		if (type == 3 && access == undefined) {
			_this.set_chmod(0, lan.files.all);
			return;
		}

		if (type < 3) bt.set_cookie('BatchSelected', '1');
		bt.set_cookie('BatchPaste', type);

		if (access == 1) {
			var access = $('#access').val();
			var chown = $('#chown').val();
			data += '&access=' + access + '&user=' + chown;
			layer.closeAll();
		}
		if (type == 4) {
			AllDeleteFileSub(data, path);
			bt.set_cookie('BatchPaste', oldType);
			return;
		}

		if (type == 5) {
			var names = '';
			for (var i = 0; i < len; i++) {
				if (el[i].checked == true && el[i].value != 'on') {
					names += el[i].value + ',';
				}
			}
			_this.zip(names);
			return;
		}

		myloadT = bt.load("<div class='myspeed'>" + lan['public'].the + '</div>');
		setTimeout(function () {
			getSpeed('.myspeed');
		}, 1000);
		bt.send('SetBatchData', 'files/SetBatchData', data, function (rdata) {
			myloadT.close();
			bt.msg(rdata);
			if (callback) callback(rdata);
		});
	},
	download_file: function (action, callback) {
		path = bt.get_cookie('Path');
		if (action == 1) {
			var fUrl = $('#mUrl').val();
			fUrl = fUrl;
			fpath = $('#dpath').val();
			fname = $('#dfilename').val();
			layer.closeAll();
			loading = bt.load(lan.files.down_task);
			bt.send('DownloadFile', 'files/DownloadFile', 'path=' + fpath + '&url=' + fUrl + '&filename=' + fname, function (rdata) {
				loading.close();
				bt.msg(rdata);
				if (callback) callback(rdata);
			});
			return;
		}
		layer.open({
			type: 1,
			shift: 5,
			closeBtn: 2,
			area: '500px',
			title: lan.files.down_title,
			content:
				'<form class="bt-form pd20 pb70">\
							<div class="line">\
							<span class="tname">' +
				lan.files.down_url +
				':</span><input type="text" class="bt-input-text" name="url" id="mUrl" value="" placeholder="' +
				lan.files.down_url +
				'" style="width:330px" />\
							</div>\
							<div class="line">\
							<span class="tname ">' +
				lan.files.down_to +
				':</span><input type="text" class="bt-input-text" name="path" id="dpath" value="' +
				path +
				'" placeholder="' +
				lan.files.down_to +
				'" style="width:330px" />\
							</div>\
							<div class="line">\
							<span class="tname">' +
				lan.files.file_name +
				':</span><input type="text" class="bt-input-text" name="filename" id="dfilename" value="" placeholder="' +
				lan.files.down_save +
				'" style="width:330px" />\
							</div>\
							<div class="bt-form-submit-btn">\
							<button type="button" class="btn btn-danger btn-sm" onclick="layer.closeAll()">' +
				lan['public'].close +
				'</button>\
							<button type="button" id="dlok" class="btn btn-success btn-sm dlok" onclick="DownloadFile(1)">' +
				lan['public'].ok +
				'</button>\
							</div>\
						</form>',
		});
		fly('dlok');
		$('#mUrl').keyup(function () {
			durl = $(this).val();
			tmp = durl.split('/');
			$('#dfilename').val(tmp[tmp.length - 1]);
		});
	},
};
// 任务管理器
bt.crontab = {
	// 执行计划任务请求
	start_task_send: function (id, name) {
		var that = this,
			loading = bt.load();
		bt.send(
			'start_task_send',
			'crontab/StartTask',
			{
				id: id,
			},
			function (rdata) {
				loading.close();
				rdata.time = 2000;
				bt.msg(rdata);
			}
		);
	},

	// 删除计划任务
	del_task_send: function (id, name) {
		bt.show_confirm('删除[' + name + ']', '您确定要删除该任务吗?', function () {
			bt.send(
				'del_task_send',
				'crontab/DelCrontab',
				{
					id: id,
				},
				function (rdata) {
					loading.close();
					rdata.time = 2000;
					bt.msg(rdata);
					that.get_crontab_list();
				}
			);
		});
	},

	// 设置计划任务状态
	set_crontab_status: function (id, status, callback) {
		var that = this,
			loading = bt.load();
		bt.confirm(
			{
				title: '提示',
				msg: status ? '计划任务暂停后将无法继续运行，您真的要停用这个计划任务吗？' : '该计划任务已停用，是否要启用这个计划任务？',
			},
			function () {
				bt.send(
					'set_crontab_status',
					'crontab/set_cron_status',
					{
						id: id,
					},
					function (rdata) {
						loading.close();
						if (callback) callback(rdata);
					}
				);
			}
		);
	},

	// 编辑计划任务脚本
	edit_crontab_file: function (echo) {
		bt.pub.on_edit_file(0, '/www/server/cron/' + echo);
	},

	// 编辑计划任务
	edit_crontab: function (id, data) {
		var that = this,
			loading = bt.load('提交数据中...');
		bt.send('edit_crontab', 'crontab/modify_crond', data, function (rdata) {
			loading.close();
			if (rdata.status) {
				// that.get_crontab_list();
				layer.msg(rdata.msg, {
					icon: 1,
				});
			} else {
				layer.msg(rdata.msg, {
					icon: 2,
				});
			}
		});
	},

	// 获取计划任务日志
	get_logs_crontab: function (id, name) {
		var that = this;
		bt.send(
			'get_logs_crontab',
			'crontab/GetLogs',
			{
				id: id,
			},
			function (rdata) {
				if (!rdata.status) {
					rdata.time = 1000;
					bt.msg(rdata);
				} else {
					bt.open({
						type: 1,
						title: '查看日志-[' + name + ']',
						area: ['700px', '520px'],
						shadeClose: false,
						closeBtn: 1,
						content:
							'<div class="setchmod bt-form pd20 pb70">' +
							'<pre class="crontab-log" style="overflow: auto; border: 0px none; line-height:28px;padding: 15px; margin: 0px; height: 405px; background-color: rgb(51,51,51);color:#f1f1f1;font-family: "微软雅黑"">' +
							(rdata.msg == '' ? '当前日志为空' : rdata.msg) +
							'</pre>' +
							'<div class="bt-form-submit-btn" style="margin-top: 0px;">' +
							'<button type="button" class="layui-btn layui-btn-sm" onclick="bt.crontab.del_logs_crontab(' +
							id +
							')">' +
							lan['public'].empty +
							'</button>' +
							'<button type="button" class="layui-btn layui-btn-sm layui-btn-primary" onclick="layer.closeAll()">' +
							lan['public'].close +
							'</button>' +
							'</div>' +
							'</div>',
					});
					setTimeout(function () {
						var div = document.getElementsByClassName('crontab-log')[0];
						div.scrollTop = div.scrollHeight;
					}, 200);
				}
			}
		);
	},

	// 删除计划任务日志
	del_logs_crontab: function (id, name) {
		var that = this,
			loading = bt.load();
		bt.send(
			'del_logs_crontab',
			'crontab/DelLogs',
			{
				id: id,
			},
			function (rdata) {
				loading.close();
				layer.closeAll();
				rdata.time = 2000;
				bt.msg(rdata);
			}
		);
	},

	// 获取计划任务列表
	get_crontab_list: function (status, callback) {
		var that = this;
		var loading = bt.load();
		bt.send('get_crontab_list', 'crontab/GetCrontab', {}, function (rdata) {
			loading.close();
			if (callback) callback(rdata);
		});
	},

	// 获取站点和备份位置信息
	get_data_list: function (type, name) {
		var that = this;
		bt.send(
			'get_data_list',
			'crontab/GetDataList',
			{
				type: type,
			},
			function (rdata) {
				that.backupsList.siteList = [
					{
						name: 'ALL',
						ps: '所有',
					},
				];
				that.backupsList.optList = [
					{
						name: '服务器磁盘',
						value: 'localhost',
					},
				];
				that.backupsList.siteList = that.backupsList.siteList.concat(rdata.data);
				that.backupsList.optList = that.backupsList.optList.concat(rdata.orderOpt);
				that.initFrom['crontab-name'] = name + '[' + that.backupsList.siteList[that.initFrom['crontab-site']].name + ']';
				that.insert_control_from(that.initFrom['crontab-submit']);
			}
		);
	},

	// 添加计划任务请求
	add_control_send: function (data) {
		var that = this,
			loading = bt.load('提交数据中...');
		bt.send('addCrontab', 'crontab/AddCrontab', data, function (rdata) {
			loading.close();
			if (rdata.status) {
				that.insert_control_from(true, true);
				that.get_crontab_list();
				layer.msg(rdata.msg, {
					icon: 1,
				});
			} else {
				layer.msg(rdata.msg, {
					icon: 2,
				});
			}
		});
	},
	get_crontab_find: function (id, callback) {
		bt.send(
			'get_crontab_find',
			'crontab/get_crontab_find',
			{
				id: id,
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
};

// bt.config = {
// 	close_panel: function (callback) {
// 		layer.confirm(
// 			lan.config.close_panel_msg,
// 			{
// 				title: lan.config.close_panel_title,
// 				closeBtn: 2,
// 				icon: 13,
// 				cancel: function () {
// 					if (callback) callback(false);
// 				},
// 			},
// 			function () {
// 				loading = bt.load(lan['public'].the);
// 				bt.send('ClosePanel', 'config/ClosePanel', {}, function (rdata) {
// 					loading.close();
// 					if (callback) callback(rdata);
// 				});
// 			},
// 			function () {
// 				if (callback) callback(false);
// 			}
// 		);
// 	},
// 	set_auto_update: function (callback) {
// 		loading = bt.load(lan['public'].the);
// 		bt.send('AutoUpdatePanel', 'config/AutoUpdatePanel', {}, function (rdata) {
// 			loading.close();
// 			bt.msg(rdata);
// 			if (callback) callback(rdata);
// 		});
// 	},
// 	sync_data: function (callback) {
// 		var loadT = bt.load(lan.config.config_sync);
// 		bt.send('syncDate', 'config/syncDate', {}, function (rdata) {
// 			loadT.close();
// 			bt.msg(rdata);
// 			if (callback) callback(rdata);
// 		});
// 	},
// 	save_config: function (data, callback) {
// 		loading = bt.load(lan.config.config_save);
// 		bt.send('setPanel', 'config/setPanel', data, function (rdata) {
// 			loading.close();
// 			bt.msg(rdata);
// 			if (callback) callback(rdata);
// 		});
// 	},
// 	set_template: function (template, callback) {
// 		var loadT = bt.load(lan['public'].the);
// 		bt.send(
// 			'SetTemplates',
// 			'config/SetTemplates',
// 			{
// 				templates: template,
// 			},
// 			function (rdata) {
// 				loadT.close();
// 				bt.msg(rdata);
// 				if (callback) callback(rdata);
// 			}
// 		);
// 	},
// 	set_panel_ssl: function (status, callback) {
// 		var msg = status
// 			? lan.config.ssl_close_msg
// 			: '<a style="font-weight: bolder;font-size: 16px;">' +
// 			  lan.config.ssl_open_ps +
// 			  '</a><li style="margin-top: 12px;color:red;">' +
// 			  lan.config.ssl_open_ps_1 +
// 			  '</li><li>' +
// 			  lan.config.ssl_open_ps_2 +
// 			  '</li><li>' +
// 			  lan.config.ssl_open_ps_3 +
// 			  '</li><p style="margin-top: 10px;"><input type="checkbox" id="checkSSL" /><label style="font-weight: 400;margin: 3px 5px 0px;" for="checkSSL">' +
// 			  lan.config.ssl_open_ps_4 +
// 			  '</label><a target="_blank" class="btlink" href="https://www.bt.cn/bbs/thread-4689-1-1.html" style="float: right;">' +
// 			  lan.config.ssl_open_ps_5 +
// 			  '</a></p>';
// 		layer.confirm(
// 			msg,
// 			{
// 				title: lan.config.ssl_title,
// 				closeBtn: 2,
// 				icon: 3,
// 				area: '550px',
// 				cancel: function () {
// 					if (callback) {
// 						if (status == 0) {
// 							callback(false);
// 						} else {
// 							callback(true);
// 						}
// 					}
// 				},
// 			},
// 			function () {
// 				if (window.location.protocol.indexOf('https') == -1) {
// 					if (!$('#checkSSL').prop('checked')) {
// 						bt.msg({
// 							msg: lan.config.ssl_ps,
// 							icon: 2,
// 						});
// 						if (callback) callback(false);
// 					}
// 				}
// 				var loadT = bt.load(lan.config.ssl_msg);
// 				bt.send('SetPanelSSL', 'config/SetPanelSSL', {}, function (rdata) {
// 					loadT.close();
// 					bt.msg(rdata);
// 					if (callback) callback(rdata);
// 				});
// 			},
// 			function () {
// 				if (callback) {
// 					if (status == 0) {
// 						callback(false);
// 					} else {
// 						callback(true);
// 					}
// 				}
// 			}
// 		);
// 	},
// 	get_panel_ssl: function () {
// 		_this = this;
// 		loading = bt.load('正在获取证书信息...');
// 		bt.send('GetPanelSSL', 'config/GetPanelSSL', {}, function (cert) {
// 			loading.close();
// 			var certBody =
// 				'<div class="tab-con">\
// 				<div class="myKeyCon ptb15">\
// 					<div class="ssl-con-key pull-left mr20">密钥(KEY)<br>\
// 						<textarea id="key" class="bt-input-text">' +
// 				cert.privateKey +
// 				'</textarea>\
// 					</div>\
// 					<div class="ssl-con-key pull-left">证书(PEM格式)<br>\
// 						<textarea id="csr" class="bt-input-text">' +
// 				cert.certPem +
// 				'</textarea>\
// 					</div>\
// 					<div class="ssl-btn pull-left mtb15" style="width:100%">\
// 						<button class="btn btn-success btn-sm" id="btn_submit">保存</button>\
// 					</div>\
// 				</div>\
// 				<ul class="help-info-text c7 pull-left">\
// 					<li>粘贴您的*.key以及*.pem内容，然后保存即可<a href="http://www.bt.cn/bbs/thread-704-1-1.html" class="btlink" target="_blank">[帮助]</a>。</li>\
// 					<li>如果浏览器提示证书链不完整,请检查是否正确拼接PEM证书</li><li>PEM格式证书 = 域名证书.crt + 根证书(root_bundle).crt</li>\
// 				</ul>\
// 			</div>';
// 			bt.open({
// 				type: 1,
// 				area: '600px',
// 				title: '自定义面板证书',
// 				closeBtn: 2,
// 				shift: 5,
// 				shadeClose: false,
// 				content: certBody,
// 			});
//
// 			$('#btn_submit').click(function () {
// 				key = $('#key').val();
// 				csr = $('#csr').val();
// 				_this.set_panel_ssl({
// 					privateKey: key,
// 					certPem: csr,
// 				});
// 			});
// 		});
// 	},
// 	set_panel_ssl: function (data, callback) {
// 		var loadT = bt.load(lan.config.ssl_msg);
// 		bt.send('SavePanelSSL', 'config/SavePanelSSL', data, function (rdata) {
// 			loadT.close();
// 			bt.msg(rdata);
// 			if (callback) callback(rdata);
// 		});
// 	},
// 	set_username: function (type) {
// 		if (type == 1) {
// 			if (p1 == '' || p1.length < 3) {
// 				bt.msg({
// 					msg: lan.bt.user_len,
// 					icon: 2,
// 				});
// 				return;
// 			}
// 			if (p1 != p2) {
// 				bt.msg({
// 					msg: lan.bt.user_err_re,
// 					icon: 2,
// 				});
// 				return;
// 			}
// 			var checks = ['admin', 'root', 'admin123', '123456'];
// 			if ($.inArray(p1, checks)) {
// 				bt.msg({
// 					msg: '禁止使用常用用户名!',
// 					icon: 2,
// 				});
// 				return;
// 			}
// 			bt.send(
// 				'setUsername',
// 				'config/setUsername',
// 				{
// 					username1: p1,
// 					username2: p2,
// 				},
// 				function (rdata) {
// 					if (rdata.status) {
// 						layer.closeAll();
// 						$("input[name='username_']").val(p1);
// 					}
// 					bt.msg(rdata);
// 				}
// 			);
// 			return;
// 		}
// 		bt.open({
// 			type: 1,
// 			area: '290px',
// 			title: lan.bt.user_title,
// 			closeBtn: 2,
// 			shift: 5,
// 			shadeClose: false,
// 			content:
// 				"<div class='bt-form pd20 pb70'><div class='line'><span class='tname'>" +
// 				lan.bt.user +
// 				"</span><div class='info-r'><input class='bt-input-text' type='text' name='password1' id='p1' value='' placeholder='" +
// 				lan.bt.user_new +
// 				"' style='width:100%'/></div></div><div class='line'><span class='tname'>" +
// 				lan.bt.pass_re +
// 				"</span><div class='info-r'><input class='bt-input-text' type='text' name='password2' id='p2' value='' placeholder='" +
// 				lan.bt.pass_re_title +
// 				"' style='width:100%'/></div></div><div class='bt-form-submit-btn'><button type='button' class='btn btn-danger btn-sm' onclick=\"layer.closeAll()\">" +
// 				lan['public'].close +
// 				"</button> <button type='button' class='btn btn-success btn-sm' onclick=\"bt.config.set_username(1)\">" +
// 				lan['public'].edit +
// 				'</button></div></div>',
// 		});
// 	},
// 	set_password: function (type) {
// 		if (type == 1) {
// 			p1 = $('#p1').val();
// 			p2 = $('#p2').val();
// 			if (p1 == '' || p1.length < 8) {
// 				bt.msg({
// 					msg: lan.bt.pass_err_len,
// 					icon: 2,
// 				});
// 				return;
// 			}
//
// 			//准备弱口令匹配元素
// 			var checks = ['admin888', '123123123', '12345678', '45678910', '87654321', 'asdfghjkl', 'password', 'qwerqwer'];
// 			pchecks = 'abcdefghijklmnopqrstuvwxyz1234567890';
// 			for (var i = 0; i < pchecks.length; i++) {
// 				checks.push(pchecks[i] + pchecks[i] + pchecks[i] + pchecks[i] + pchecks[i] + pchecks[i] + pchecks[i] + pchecks[i]);
// 			}
//
// 			//检查弱口令
// 			cps = p1.toLowerCase();
// 			var isError = '';
// 			for (var i = 0; i < checks.length; i++) {
// 				if (cps == checks[i]) {
// 					isError += '[' + checks[i] + '] ';
// 				}
// 			}
// 			if (isError != '') {
// 				bt.msg({
// 					msg: lan.bt.pass_err + isError,
// 					icon: 2,
// 				});
// 				return;
// 			}
//
// 			if (p1 != p2) {
// 				bt.msg({
// 					msg: lan.bt.pass_err_re,
// 					icon: 2,
// 				});
// 				return;
// 			}
// 			bt.send(
// 				'setPassword',
// 				'config/setPassword',
// 				{
// 					password1: p1,
// 					password2: p2,
// 				},
// 				function (rdata) {
// 					layer.closeAll();
// 					bt.msg(rdata);
// 				}
// 			);
// 			return;
// 		}
// 		layer.open({
// 			type: 1,
// 			area: '290px',
// 			title: lan.bt.pass_title,
// 			closeBtn: 2,
// 			shift: 5,
// 			shadeClose: false,
// 			content:
// 				"<div class='bt-form pd20 pb70'><div class='line'><span class='tname'>" +
// 				lan['public'].pass +
// 				"</span><div class='info-r'><input class='bt-input-text' type='text' name='password1' id='p1' value='' placeholder='" +
// 				lan.bt.pass_new_title +
// 				"' style='width:100%'/></div></div><div class='line'><span class='tname'>" +
// 				lan.bt.pass_re +
// 				"</span><div class='info-r'><input class='bt-input-text' type='text' name='password2' id='p2' value='' placeholder='" +
// 				lan.bt.pass_re_title +
// 				"' style='width:100%' /></div></div><div class='bt-form-submit-btn'><span style='float: left;' title='" +
// 				lan.bt.pass_rep +
// 				"' class='btn btn-default btn-sm' onclick='randPwd(10)'>" +
// 				lan.bt.pass_rep_btn +
// 				"</span><button type='button' class='btn btn-danger btn-sm' onclick=\"layer.closeAll()\">" +
// 				lan['public'].close +
// 				"</button> <button type='button' class='btn btn-success btn-sm' onclick=\"bt.config.set_password(1)\">" +
// 				lan['public'].edit +
// 				'</button></div></div>',
// 		});
// 	},
// };

bt.system = {
	get_total: function (callback) {
		bt.send('GetSystemTotal', 'system/GetSystemTotal', {}, function (rdata) {
			if (callback) callback(rdata);
		});
	},
	get_net: function (callback) {
		bt.send('GetNetWork', 'system/GetNetWork', {}, function (rdata) {
			if (callback) callback(rdata);
		});
	},
	get_disk_list: function (callback) {
		bt.send('GetDiskInfo', 'system/GetDiskInfo', {}, function (rdata) {
			if (callback) callback(rdata);
		});
	},
	re_memory: function (callback) {
		bt.send('ReMemory', 'system/ReMemory', {}, function (rdata) {
			if (callback) callback(rdata);
		});
	},
	check_update: function (callback, check) {
		var data = {};
		if (check == undefined)
			data = {
				check: true,
			};
		if (check === false) data = {};
		if (check) var load = bt.load(lan.index.update_get);
		bt.send('UpdatePanel', 'ajax/UpdatePanel', data, function (rdata) {
			if (check) load.close();
			if (callback) callback(rdata);
		});
	},
	to_update: function (callback) {
		var load = bt.load(lan.index.update_the);
		bt.send(
			'UpdatePanel',
			'ajax/UpdatePanel',
			{
				toUpdate: 'yes',
			},
			function (rdata) {
				load.close();
				if (callback) callback(rdata);
			}
		);
		window.localStorage.removeItem('panelVersion');
	},
	reload_panel: function (callback) {
		bt.send('ReWeb', 'system/ReWeb', {}, function (rdata) {
			if (callback) callback(rdata);
		});
	},
	rep_panel: function (callback) {
		var loading = bt.load(lan.index.rep_panel_the);
		bt.send('RepPanel', 'system/RepPanel', {}, function (rdata) {
			loading.close();
			if (rdata) {
				if (callback)
					callback({
						status: rdata,
						msg: lan.index.rep_panel_ok,
					});
				bt.system.reload_panel();
			}
		});
	},
	get_warning: function (callback) {
		bt.send('GetWarning', 'ajax/GetWarning', {}, function (rdata) {
			if (callback) callback(rdata);
		});
	},
	root_reload: function (callback) {
		bt.send('RestartServer', 'system/RestartServer', {}, function (rdata) {
			if (callback) callback(rdata);
		});
	},
};

bt.control = {
	get_status: function (callback) {
		loading = bt.load(lan['public'].read);
		bt.send(
			'GetControl',
			'control/SetControl',
			{
				type: 1,
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
	set_control: function (type, day, callback) {
		loadT = bt.load(lan['public'].the);
		bt.send(
			'SetControl',
			'config/SetControl',
			{
				type: type,
				day: day,
			},
			function (rdata) {
				loadT.close();
				bt.msg(rdata);
				if (callback) callback(rdata);
			}
		);
	},
	clear_control: function (callback) {
		bt.confirm(
			{
				msg: lan.control.close_log_msg,
				title: lan.control.close_log,
			},
			function () {
				loadT = bt.load(lan['public'].the);
				bt.send(
					'SetControl',
					'config/SetControl',
					{
						type: 'del',
					},
					function (rdata) {
						loadT.close();
						bt.msg(rdata);
						if (callback) callback(rdata);
					}
				);
			}
		);
	},
	get_data: function (type, start, end, callback) {
		action = '';
		switch (type) {
			case 'cpu': //cpu和内存一起获取
				action = 'GetCpuIo';
				break;
			case 'disk':
				action = 'GetDiskIo';
				break;
			case 'net':
				action = 'GetNetWorkIo';
				break;
			case 'load':
				action = 'get_load_average';
				break;
		}
		if (!action) bt.msg(lan.get('lack_param', 'type'));
		bt.send(
			action,
			'ajax/' + action,
			{
				start: start,
				end: end,
			},
			function (rdata) {
				if (callback) callback(rdata, type);
			}
		);
	},
	format_option: function (obj, type) {
		option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
				},
				formatter: obj.formatter,
			},
			grid: obj.grid || {},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: obj.tData,
				axisLine: {
					lineStyle: {
						color: '#666',
					},
				},
			},
			yAxis: {
				type: 'value',
				name: obj.unit,
				boundaryGap: [0, '100%'],
				splitNumber: obj.splitNumber,
				min: 0,
				splitLine: {
					lineStyle: {
						color: '#ddd',
					},
				},
				axisLine: {
					lineStyle: {
						color: '#666',
					},
				},
			},
			dataZoom: [
				{
					type: 'inside',
					start: 0,
					zoomLock: true,
				},
				{
					start: 0,
					handleIcon:
						'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
					handleSize: '80%',
					handleStyle: {
						color: '#fff',
						shadowBlur: 3,
						shadowColor: 'rgba(0, 0, 0, 0.6)',
						shadowOffsetX: 2,
						shadowOffsetY: 2,
					},
				},
			],
			series: [],
		};
		if (obj.legend) option.legend = obj.legend;
		if (obj.dataZoom) option.dataZoom = obj.dataZoom;

		for (var i = 0; i < obj.list.length; i++) {
			var item = obj.list[i];
			series = {
				name: item.name,
				type: item.type ? item.type : 'line',
				smooth: item.smooth ? item.smooth : true,
				symbol: item.symbol ? item.symbol : 'none',
				showSymbol: item.showSymbol ? item.showSymbol : false,
				sampling: item.sampling ? item.sampling : 'average',
				areaStyle: item.areaStyle ? item.areaStyle : {},
				lineStyle: item.lineStyle ? item.lineStyle : {},
				itemStyle: item.itemStyle
					? item.itemStyle
					: {
						normal: {
							color: 'rgb(0, 153, 238)',
						},
					},
				symbolSize: 6,
				symbol: 'circle',
				data: item.data,
			};

			// LinearGradient在ie上是存在问题的
			if (ie_version >= 10) {
				series.areaStyle = {};
			}

			option.series.push(series);
		}
		return option;
	},
};

bt.firewall = {
	get_log_list: function (page, search, callback) {
		if (page == undefined) page = 1;
		search = search == undefined ? '' : search;
		var order = bt.get_cookie('order') ? '&order=' + bt.get_cookie('order') : '';

		var data = 'tojs=firewall.get_log_list&table=logs&limit=10&p=' + page + '&search=' + search + order;
		bt.pub.get_data(data, function (rdata) {
			if (callback) callback(rdata);
		});
	},
	get_list: function (page, search, callback) {
		if (page == undefined) page = 1;
		search = search == undefined ? '' : search;
		var order = bt.get_cookie('order') ? '&order=' + bt.get_cookie('order') : '';

		var data = 'tojs=firewall.get_list&table=firewall&limit=10&p=' + page + '&search=' + search + order;
		bt.pub.get_data(data, function (rdata) {
			if (callback) callback(rdata);
		});
	},
	get_logs_size: function (callback) {
		if (bt.os == 'Linux') {
			bt.files.get_dir_size('/www/wwwlogs', function (rdata) {
				if (callback) callback(rdata);
			});
		}
	},
	get_ssh_info: function (callback) {
		bt.send('GetSshInfo', 'firewall/GetSshInfo', {}, function (rdata) {
			if (callback) callback(rdata);
		});
	},
	set_mstsc: function (port, callback) {
		bt.confirm(
			{
				msg: lan.firewall.ssh_port_msg,
				title: lan.firewall.ssh_port_title,
			},
			function () {
				loading = bt.load(lan['public'].the);
				bt.send(
					'SetSshPort',
					'firewall/SetSshPort',
					{
						port: port,
					},
					function (rdata) {
						loading.close();
						bt.msg(rdata);
						if (callback) callback(rdata);
					}
				);
			}
		);
	},
	ping: function (status, callback) {
		var msg = status == 0 ? lan.firewall.ping_msg : lan.firewall.ping_un_msg;
		layer.confirm(
			msg,
			{
				closeBtn: 2,
				title: lan.firewall.ping_title,
				cancel: function () {
					if (callback) callback(-1); //取消
				},
			},
			function () {
				loading = bt.load(lan['public'].the);
				bt.send(
					'SetPing',
					'firewall/SetPing',
					{
						status: status,
					},
					function (rdata) {
						loading.close();
						if (callback) callback(rdata);
					}
				);
			},
			function () {
				if (callback) callback(-1); //关闭
			}
		);
	},
	set_mstsc_status: function (status, callback) {
		var msg = status == 1 ? lan.firewall.ssh_off_msg : lan.firewall.ssh_on_msg;
		layer.confirm(
			msg,
			{
				closeBtn: 2,
				title: lan['public'].warning,
				cancel: function () {
					if (callback) callback(-1); //取消
				},
			},
			function () {
				loading = bt.load(lan['public'].the);
				bt.send(
					'SetSshStatus',
					'firewall/SetSshStatus',
					{
						status: status,
					},
					function (rdata) {
						loading.close();
						if (callback) callback(rdata);
					}
				);
			},
			function () {
				if (callback) callback(-1); //关闭
			}
		);
	},
	add_accept_port: function (type, port, ps, callback) {
		var action = 'AddDropAddress';
		if (type == 'port') {
			ports = port.split(':');
			if (port.indexOf('-') != -1) ports = port.split('-');
			for (var i = 0; i < ports.length; i++) {
				if (!bt.check_port(ports[i])) {
					layer.msg('可用端口范围：1-65535', { icon: 2 });
					// layer.msg(lan.firewall.port_err, {
					//   icon: 5
					// });
					return;
				}
			}
			action = 'AddAcceptPort';
		}

		if (ps.length < 1) {
			layer.msg(lan.firewall.ps_err, {
				icon: 2,
			});
			return -1;
		}
		loading = bt.load();
		bt.send(
			action,
			'firewall/' + action,
			{
				port: port,
				type: type,
				ps: ps,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	del_accept_port: function (id, port, callback) {
		var action = 'DelDropAddress';
		if (port.indexOf('.') == -1) {
			action = 'DelAcceptPort';
		}
		bt.confirm(
			{
				msg: lan.get('confirm_del', [port]),
				title: lan.firewall.del_title,
			},
			function (index) {
				var loadT = bt.load(lan['public'].the_del);
				bt.send(
					action,
					'firewall/' + action,
					{
						id: id,
						port: port,
					},
					function (rdata) {
						loadT.close();
						if (callback) callback(rdata);
					}
				);
			}
		);
	},
	clear_logs_files: function (callback) {
		var loadT = bt.load(lan.firewall.close_the);
		bt.send('CloseLogs', 'files/CloseLogs', {}, function (rdata) {
			if (callback) callback(rdata);
		});
	},
	clear_logs: function (callback) {
		bt.compute_confirm({ title: '清空面板操作日志', msg: '风险操作，清空该日志后，将无法查询面板以往的操作记录，是否继续操作？' }, function () {
			var loadT = bt.load(lan.firewall.close_the);
			bt.send('delClose', 'ajax/delClose', {}, function (rdata) {
				loadT.close();
				if (callback) {
					callback(rdata);
				} else {
					bt.msg(rdata);
				}
			});
		});
	},
};

bt.soft = {
	pub: {
		wxpayTimeId: 0,
		availableBalance: 0,//可用余额
		countDown: null,//倒计时
		softData:[]// 存储单个插件数据
	},
	php: {
		get_config: function (version, callback) {
			//获取禁用函数,扩展列表
			//var loading = bt.load();
			bt.send(
				'GetPHPConfig',
				'ajax/GetPHPConfig',
				{
					version: version,
				},
				function (rdata) {
					//loading.close();
					if (callback) callback(rdata);
				}
			);
		},
		get_limit_config: function (version, callback) {
			//获取超时限制,上传限制
			var loading = bt.load();
			bt.send(
				'get_php_config',
				'config/get_php_config',
				{
					version: version,
				},
				function (rdata) {
					loading.close();
					if (callback) callback(rdata);
				}
			);
		},
		get_php_config: function (version, callback) {
			var loading = bt.load();
			bt.send(
				'GetPHPConf',
				'config/GetPHPConf',
				{
					version: version,
				},
				function (rdata) {
					loading.close();
					if (callback) callback(rdata);
				}
			);
		},
		install_php_lib: function (version, name, title, callback) {
			bt.confirm(
				{
					msg: lan.soft.php_ext_install_confirm.replace('{1}', name),
					title: '安装【' + name + '】',
				},
				function () {
					name = name.toLowerCase();
					var loadT = bt.load(lan.soft.add_install);
					bt.send(
						'InstallSoft',
						'files/InstallSoft',
						{
							name: name,
							version: version,
							type: '1',
						},
						function (rdata) {
							loadT.close();
							if (callback) callback(rdata);
							bt.msg(rdata);
						}
					);
					fly('bi-btn');
				}
			);
		},
		un_install_php_lib: function (version, name, title, callback) {
			bt.confirm(
				{
					msg: lan.soft.php_ext_uninstall_confirm.replace('{1}', name),
					title: '卸载【' + name + '】',
				},
				function () {
					name = name.toLowerCase();
					var data = 'name=' + name + '&version=' + version;
					var loadT = bt.load();
					bt.send(
						'UninstallSoft',
						'files/UninstallSoft',
						{
							name: name,
							version: version,
						},
						function (rdata) {
							loadT.close();
							if (callback) callback(rdata);
							bt.msg(rdata);
						}
					);
				}
			);
		},
		set_upload_max: function (version, max, callback) {
			var loadT = bt.load(lan.soft.the_save);
			bt.send(
				'setPHPMaxSize',
				'config/setPHPMaxSize',
				{
					version: version,
					max: max,
				},
				function (rdata) {
					loadT.close();
					if (callback) callback(rdata);
				}
			);
		},
		set_php_timeout: function (version, time, callback) {
			var loadT = bt.load(lan.soft.the_save);
			bt.send(
				'setPHPMaxTime',
				'config/setPHPMaxTime',
				{
					version: version,
					time: time,
				},
				function (rdata) {
					loadT.close();
					if (callback) callback(rdata);
				}
			);
		},
		disable_functions: function (version, fs, callback) {
			var loadT = bt.load();
			bt.send(
				'setPHPDisable',
				'config/setPHPDisable',
				{
					version: version,
					disable_functions: fs,
				},
				function (rdata) {
					loadT.close();
					if (callback) callback(rdata);
				}
			);
		},
		get_fpm_config: function (version, callback) {
			var loadT = bt.load();
			bt.send(
				'getFpmConfig',
				'config/getFpmConfig',
				{
					version: version,
				},
				function (rdata) {
					loadT.close();
					if (callback) callback(rdata);
				}
			);
		},
		set_fpm_config: function (version, data, callback) {
			var loadT = bt.load();
			data.version = version;
			bt.send('setFpmConfig', 'config/setFpmConfig', data, function (rdata) {
				loadT.close();
				if (callback) callback(rdata);
			});
		},
		get_php_status: function (version, callback) {
			var loadT = bt.load();
			bt.send(
				'GetPHPStatus',
				'ajax/GetPHPStatus',
				{
					version: version,
				},
				function (rdata) {
					loadT.close();
					if (callback) callback(rdata);
				}
			);
		},
		// 获取PHP_session
		get_php_session: function (version, callback) {
			var loadT = bt.load();
			bt.send(
				'GetSessionConf',
				'config/GetSessionConf',
				{
					version: version,
				},
				function (res) {
					loadT.close();
					if (callback) callback(res);
				}
			);
		},
		// 设置PHP_session文件
		set_php_session: function (obj, callback) {
			var loadT = bt.load();
			bt.send('SetSessionConf', 'config/SetSessionConf', obj, function (res) {
				loadT.close();
				if (callback) callback(res);
			});
		},
		// 获取PHP_session清理信息
		get_session_count: function (callback) {
			var loadT = bt.load();
			bt.send('GetSessionCount', 'config/GetSessionCount', {}, function (res) {
				loadT.close();
				if (callback) callback(res);
			});
		},
		// 清理php_session
		clear_session_count: function (obj, callback) {
			bt.confirm(
				{
					msg: obj.msg,
					title: obj.title,
				},
				function () {
					var loadT = bt.load();
					bt.send('DelOldSession', 'config/DelOldSession', {}, function (res) {
						loadT.close();
						if (callback) callback(res);
					});
				}
			);
		},
		get_fpm_logs: function (version, callback) {
			var loadT = bt.load();
			bt.send(
				'GetFpmLogs',
				'ajax/GetFpmLogs',
				{
					version: version,
				},
				function (logs) {
					loadT.close();
					if (logs.status !== true) {
						logs.msg = '';
					}
					if (logs.msg == '') logs.msg = '当前没有fpm日志.';
					if (callback) callback(logs);
				}
			);
		},
		get_slow_logs: function (version, callback) {
			var loadT = bt.load();
			bt.send(
				'GetFpmSlowLogs',
				'ajax/GetFpmSlowLogs',
				{
					version: version,
				},
				function (logs) {
					loadT.close();
					if (logs.status !== true) {
						logs.msg = '';
					}
					if (logs.msg == '') logs.msg = '当前没有慢日志.';
					if (callback) callback(logs);
				}
			);
		},
	},
	redis: {
		get_redis_status: function (callback) {
			var loadT = bt.load();
			bt.send('GetRedisStatus', 'ajax/GetRedisStatus', {}, function (rdata) {
				loadT.close();
				if (callback) callback(rdata);
			});
		},
	},
	pro: {
		conver_unit: function (name) {
			var unit = '';
			switch (name) {
				case 'year':
					unit = '年';
					break;
				case 'month':
					unit = '个月';
					break;
				case 'day':
					unit = '天';
					break;
				case '1':
					unit = '1个月';
					break;
				case '3':
					unit = '3个月';
					break;
				case '6':
					unit = '6个月';
					break;
				case '12':
					unit = '1年';
					break;
				case '24':
					unit = '2年';
					break;
				case '36':
					unit = '3年';
					break;
				case '999':
					unit = '永久';
					break;
			}
			return unit;
		},
		get_product_discount_by: function (pid, callback) {
			if (pid) {
				bt.send(
					'get_plugin_price',
					'auth/get_plugin_price',
					{
						pid: pid,
					},
					function (rdata) {
						if (callback) callback(rdata);
					}
				);
			} else {
				bt.send('get_product_discount_by', 'auth/get_product_discount_by', {}, function (rdata) {
					if (callback) callback(rdata);
				});
			}
		},
		get_plugin_coupon: function (pid, callback) {
			bt.send(
				'check_pay_status',
				'auth/check_pay_status',
				{
					id: pid,
				},
				function (rdata) {
					if (callback) callback(rdata);
				}
			);
		},
		get_wx_order_status: function (wxoid, callback) {
			bt.send(
				'get_wx_order_status',
				'auth/get_wx_order_status',
				{
					wxoid: wxoid,
					kf: $('.libPay-kf-input').prop('checked') ? 1 : 0,
				},
				function (rdata) {
					if (callback) callback(rdata);
				}
			);
		},
		get_re_order_status: function (callback) {
			bt.send('get_re_order_status', 'auth/get_re_order_status', {}, function (rdata) {
				if (callback) callback(rdata);
			});
		},
		get_voucher: function (pid, callback) {
			if (pid) {
				bt.send(
					'get_voucher_plugin',
					'auth/get_voucher_plugin',
					{
						pid: pid,
					},
					function (rdata) {
						if (callback) callback(rdata);
					}
				);
			} else {
				bt.send('get_voucher', 'auth/get_voucher', {}, function (rdata) {
					if (callback) callback(rdata);
				});
			}
		},
		create_order_voucher: function (pid, code, callback) {
			var loading = bt.load();
			if (pid) {
				bt.send(
					'create_order_voucher_plugin',
					'auth/create_order_voucher_plugin',
					{
						pid: pid,
						code: code,
					},
					function (rdata) {
						loading.close();
						if (callback) callback(rdata);
						bt.msg(rdata);
					}
				);
			} else {
				bt.send(
					'create_order_voucher',
					'auth/create_order_voucher',
					{
						code: code,
					},
					function (rdata) {
						loading.close();
						if (callback) {
							callback(rdata);
						} else {
							bt.soft.pro.update();
						}
					}
				);
			}
		},
		create_order: function (config, callback) {
			if (typeof config.pid != 'undefined') {
				bt.send('get_buy_code', 'auth/get_buy_code', config, function (rdata) {
					if (callback) callback(rdata);
				});
			} else {
				bt.send('create_order', 'auth/create_order', config, function (rdata) {
					if (callback) callback(rdata);
				});
			}
		},
	},
	get_index_renew: function () {
		bt.soft.get_product_renew(function (res) {
			var html = $('<div><div>');
			if (res.length > 0) {
				bt.soft.each(res, function (index, item) {
					html.append(
						$(
							'<p><span class="glyphicon glyphicon-alert" style="color: #f39c12; margin-right: 10px;"></span>' +
							item.msg +
							'&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" class="set_messages_status" style="color:#777">[ 忽略提示 ]</a></p>'
						).data(item)
					);
				});
				$('#messageError').show().html(html);
				$('.set_messages_status').click(function () {
					var data = $(this).parent().data(),
						that = this;
					bt.soft.set_product_renew_status(
						{
							id: data.id,
							state: 0,
						},
						function (rdata) {
							if (!res.status) {
								$(that).parent().remove();
							}
							bt.msg(rdata);
						}
					);
				});
			}
		});
	},
	// 获取产品续费状态
	get_product_renew: function (callback) {
		$.get('/message/get_messages', function (res) {
			if (res.status === false) {
				layer.msg(res.msg, {
					icon: 2,
				});
				return false;
			}
			if (callback) callback(res);
		});
	},
	set_product_renew_status: function (data, callback) {
		bt_tools.send({url: '/message/status_message',data: {id: data.id,state: data.state}},function (res) {
			if (res.status === false) {
				layer.msg(res.msg, {
					icon: 2,
				});
				return false;
			}
			if (callback) callback(res);
		},{verify: false});
	},
	abcCompare:{},
	totalNum:'',
	// 产品支付视图(配置参数)
	product_pay_view: function (config) {
		var bt_user_info = localStorage.getItem('bt_user_info'),
			ltd_end = bt.get_cookie('ltd_end'),
			pro_end = bt.get_cookie('pro_end');
		bt.set_cookie('payConfig', JSON.stringify(config));
		var totalNum = parseInt(config.totalNum ? config.totalNum : '');
		this.totalNum = totalNum;
		if (totalNum) {
			bt.set_cookie('pay_source', parseInt(totalNum));
		}else{
			bt.clear_cookie('pay_source');
		}
		// // 判断登录
		// if (!bt_user_info) {
		// 	bt.pub.bind_btname(function () {
		// 		window.location.reload();
		// 	});
		// 	return false;
		// }
		if (config.ps !== undefined) config.ps = format_introduce(config.ex1) || config.ps.replace(/#1/g, '<').replace(/#2/g, '>').replace(/#3/g, '"').replace(/#4/g, "'");
		var that = this;
		var user_info = JSON.parse(bt_user_info);
		var username = user_info.data.username;
		var overall_beforeunload = function () {
			return '';
		};

		var overall_keyup = function () {
			if (window.event.keyCode == 116 || (window.event.shiftKey && window.event.keyCode == 121)) {
				layer.msg('提示，正在交易订单，为确保订单支付成功，请关闭支付页面后再刷新页面!', { icon: 1 });
				window.event.keyCode = 0;
				window.event.returnValue = false;
			}
			if (window.event.altKey && window.event.keyCode == 115) {
				//屏蔽Alt+F4
				window.showModelessDialog('about:blank', '', 'dialogWidth:1px;dialogheight:1px');
				return false;
			}
		};
		// 格式化介绍
		function format_introduce(introduce) {
			if (!introduce) return '';
			var html = '<ol>',introArray = introduce.split('|');
			for (var i = 0; i < introArray.length; i++) {
				html += '<li style="margin: 0 7px 14px 16px;list-style: disc;">' + introArray[i] + '</li>';
			}
			html += '</ol>';
			return html;
		}

		layer.open({
			type: 1,
			title: false,
			skin: 'libPay-view',
			area: ['1000px', '720px'],
			shadeClose: false,
			content:
				'<div class="libPay-content-box" ' +
				(config.totalNum ? 'data-index="' + config.totalNum + '"' : '') +
				'>\
									<div class="libPay-product-introduce"></div>\
									<div class="libPay-product-content">\
									<div class="libPay-menu ' +
				(config.plugin ? 'is_plugin' : 'is_ops') +
				' ' +
				((typeof config.closePro != 'undefined' && config.closePro) || config['type'] === 12 || config['is_alone'] ? 'closePro' : '') +
				'">\
											' +
				(config.plugin ? '<div class="libPay-menu-type lib_plugin"><p>' + config.name + '</p><p>此功能包含于【' + (config.type===8?'专业版':'企业版') + '】</p></div>' : '') +
				'\
											<div class="libPay-menu-type lib_pro" >\
													<p><span class="glyphicon glyphicon-vip"></span><span style="margin-left:8px">' +
				bt.os +
				'专业版</span></p>\
													<p>适用于个人用户、个人项目</p>\
											</div>\
											<div class="libPay-menu-type lib_ltd" >\
													<p><span class="glyphicon glyphicon-vip"></span><span style="margin-left:8px">' +
				bt.os +
				'企业版</span></p>\
													<span class="recommend-pay-icon"></span>\
													<p>适用于官网、电商、教育、医疗等企业用户</p>\
											</div>' +
				(config.plugin
					? ''
					: '<div class="libPay-menu-type lib_ops" >\
													<p><span class="glyphicon glyphicon-vip"></span><span style="margin-left:8px">企业运维托管</span></p>\
													<p>适用于无专业技术、需技术服务的企业</p>\
											</div>') +
				'<div class="libPay-menu-type lib_ver" >\
													<p><span></span><span style="margin-left:8px">抵扣券</span></p>\
													<p>抵扣券授权</p>\
											</div>\
									</div>\
									<div id="pay_product_view">\
											<div class="libVoucher-loading custom-loading"><div class="custom-loading__icon"></div><p>正在请求列表中,请稍候...</p></div>\
											<div class="libPay-layer-item">\
													<div class="libPay-line-item proS" id="libPay-theme-tips">\
													<img style="margin-right:10px;" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAuMDAwMDAwIiBoZWlnaHQ9IjIyLjAwMDAwMCIgdmlld0JveD0iMCAwIDIw\
													IDIyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5z\
													OnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KCTxkZXNjPgoJCQlDcmVhdGVk\
													IHdpdGggUGl4c28uCgk8L2Rlc2M+Cgk8cGF0aCBpZD0icGF0aCIgZD0iTTEzLjM0MDggNS4zNDIx\
													OUMxMy43NDk1IDYuMjkxMzUgMTMuODEwOSA3Ljg1OTg5IDEyLjk2NDkgOC42MTQwMUMxMS41OTE0\
													IDMuMDc5ODYgOC4xNTc3MSAyIDguMTU3NzEgMkM4LjU2NjM1IDQuODEzMzIgNi43MjI5IDcuODky\
													MDkgNC45MTIwNSAxMC4yMTI3QzQuODUwNjUgOS4xMDA2NSA0Ljc4NTQ2IDguMzQ4NTcgNC4xOTQ1\
													OCA3LjIwMjMzQzQuMDY3OTkgOS4yNjM1NSAyLjU3MTc4IDEwLjkwMDUgMi4xMzQ0IDEyLjk2MTdD\
													MS42MDQ5OCAxNS44MDkyIDIuNTcxNzggMTcuODA2MSA2LjI1MjkzIDIwQzUuMDk4MDggMTcuNDgy\
													MyA1LjcyMzQ1IDE2LjA0MDQgNi42Mjg5MSAxNC43MzMzQzcuNTk1NyAxMy4yMjkxIDcuODQ4ODgg\
													MTEuNzg3MyA3Ljg0ODg4IDExLjc4NzNDNy44NDg4OCAxMS43ODczIDguNjI3NjkgMTIuODAwOCA4\
													LjMxODg1IDE0LjQwMzVDOS42MjcxNCAxMi44MzUgOS44ODAzMSAxMC4zMTEyIDkuNjk0MjcgOS4z\
													OTYyN0MxMi42ODg3IDExLjU5MDIgMTQuMDI5NSAxNi40MzQ2IDEyLjI4MzkgMTkuOTM1NkMyMS41\
													MTg0IDE0LjQwNTUgMTQuNTU3IDYuMTkwODMgMTMuMzQwOCA1LjM0MjE5WiIgZmlsbC1ydWxlPSJu\
													b256ZXJvIiBmaWxsPSIjRUMwMjAyIi8+Cgk8ZGVmcy8+Cjwvc3ZnPgo=">\
													<span></span>'+(config.fun?'<span style="color:#D98704;">；企业版包含【'+config.pluginName+'】此功能，<a class="btlink see-infomation" >立即查看>></a></span>':'')+'</div>\
													<div class="libPay-line-item proTname" style="margin-bottom:20px">产品周期</div>\
													<div class="libPay-line-item proP" id="libPay-theme-price">\
														<div class="switch-cycle-left hide" title="查看更多周期价格"><span class="glyphicon glyphicon-chevron-left"></span></div>\
															<ul class="pay-pro-cycle"></ul>\
														<div class="switch-cycle-right" title="查看更多周期价格"><span class="glyphicon glyphicon-chevron-right"></span></div>\
													</div>\
													<div class="libPay-line-item proTname">授权数量</div>\
													<div class="libPay-line-item proN" id="libPay-theme-nums" style="margin-bottom: 20px;"></div>\
													<div class="libPay-line-item artificial hide"><i class="artificial—checkbox"></i><input type="checkbox" class="artificial—checkbox-input" />\
													 人工运维托管\
													 <span class="artificial_price ml8">￥3999</span>\
													 <div class="ml30"><img src="/static/img/ico/icon-artificial1.svg" /><span class="ml5">专家技术支持</span></div>\
													 <div class="ml15"><img src="/static/img/ico/icon-artificial2.svg" /><span class="ml5">5分钟内急速响应</span></div>\
													 <div class="ml15"><img src="/static/img/ico/icon-artificial3.svg" /><span class="ml5">问题解决率达99%</span></div>\
													</div>\
													<div class="libPay-line-item coupons disabled"><i class="coupon—checkbox"></i><input type="checkbox" class="coupon—checkbox-input" />\
													优惠券（0）\
													<div class="coupon_item"><span>暂无优惠券</span></div></div>\
													<div class="libPay-line-item prokf hide">\
															<label>\
																	<i class="libPay-kf-consul"></i>\
																	<input type="checkbox" class="libPay-kf-input">\
															</label>\
															<span>是否需要客服电话联系，工作时间 9：30-18：00</span>\
													</div>\
													<div class="libPay-line-item" id="libPay-qcode-box" style="margin:20px 0 20px 0">\
														<div class="libPay-qcode-left">\
																<div class="pay-radio-type" >\
																		<div class="pay-type-btn active" data-condition="2" >\
																				<label class="pay-type-label"> <span class="pay-radio-icon"></span><span class="pay-radio-tit">微信扫码支付</span></label>\
																		</div>\
																		<div class="pay-type-btn" data-condition="3">\
																				<label class="pay-type-label"><span class="pay-radio-icon"></span><span class="pay-radio-tit">支付宝扫码支付</span></label>\
																		</div>\
																		<div class="pay-type-btn" data-condition="4">\
																				<label class="pay-type-label"><span class="pay-radio-icon"></span><span class="pay-radio-tit">余额支付</span></label>\
																		</div>\
																		<div class="pay-type-btn" data-condition="5">\
																				<label class="pay-type-label"><span class="pay-radio-icon"></span><span class="pay-radio-tit">对公转账</span></label>\
																		</div>\
																</div>\
														</div>\
														<div class="libPay-qcode-right">\
																<div class="libPay-loading custom-loading"><div class="custom-loading__icon"></div><p>正在生成订单,请稍候...</p></div>\
																<div class= "libPaycode-box">\
																<div class="pay-wx" style="height:132px;width: 132px;margin-right: 20px;position: relative;" id="PayQcode" >\
																	<div></div>\
																	<div class="payqcode-box" >\
																		<span class="wx-pay-ico wechat""></span>\
																	</div>\
																</div>\
																		<div class="libPaycode-foo-txt" style="max-width: 380px;">\
																			<div class="payment_results_tips hide">企业运维托管尊享福利如需更多网站服务器解决方案<a class="btlink" style="text-decoration: underline;">点击咨询</a></div>\
																			<div class="payment_repeat_tips payment_repeat_tips_red hide" style="display:flex;align-items:center"><span style="margin-right:4px;" class="repeat_pay_warning"></span>检测到您30分钟内有重复支付订单！</div>\
																			<div class="payment_repeat_tips hide"><div style="color:#555;margin-left:4px">如遇到支付授权未生效，请尝试 <span class="btlink links_refresh" style="color:#20a53a;font-size:12px;text-decoration: underline;font-weight:400;">刷新授权</span></div></div>\
																			<div class="payment_repeat_tips payment_repeat_tips_hr hide"></div>\
																			<div class="box">\
																				 <div class="userinfo">\
																						<div class="info_label mb-5">当前账号: </div>\
																						<div class="info_value">' +
				username +
				'</div>\
																						<a class="btlink" onclick="bt.pub.bind_btname()" href="javascript:;" style="text-decoration: underline;">切换账号</a>\
																				</div>\
																				<p> 支付金额: <span class="libPayTotal">---</span> <lable class="libPayCycle">--年</lable></p>\
																			</div>\
																		</div>\
																		<div class="libBank-box">\
																			<div><span>开户名称: </span>广东堡塔安全技术有限公司</div>\
																			<div><span>开户银行: </span>招商银行股份有限公司东莞天安数码城支行</div>\
																			<div><span>银行账号: </span><a class="btlink service_buy_before">联系客服</a></div>\
																		</div>\
																		<div class="libBank-payment-box">\
																			<div class="payment_cont">\
																				<div>可用余额</div>\
																				<div><span class="availableBalance">---</span>元</div>\
																				<button class="btn btn-success btn-xs availableBalanceBtn" style="width: 72px; height: 28px;margin-top: 10px;">立即购买</button>\
																				<div class="availableBalanceTip hide mt5">当前余额不足，请先<a target="_blank" href="https://www.bt.cn/admin/recharge" class="btlink">充值余额</a></div>\
																			</div>\
																		</div>\
																</div >\
														</div>\
												</div>\
											</div>\
											<div class="libPay-layer-item">\
													<p class="voucher-tit">产品类型</p>\
													<div class="libVoucher-type"><ul class="li-c-item"></ul></div>\
													<p class="voucher-tit" style="margin-top: 20px;">抵扣券列表</p>\
													<div class="libVoucher-list"><ul class="pay-btn-group"></ul></div>\
													<div class="libPay-voucher-submit" style="margin:33px 0">\
															<div class="paymethod-submit" >\
																	<button class="btn btn-success btn-sm f16 disabled" style="width: 200px; height: 40px;">暂无抵扣券，请先购买</button>\
															</div>\
															<p style="margin-top: 35px;font-size: 15px;color: #AAAFB8;">堡塔官网后台、参与活动购买的产品抵扣券，可用于开通授权或续费</p>\
													</div>\
											</div>\
									</div>\
									</div>\
									<div class="libPay-footer-tips">\
											<span class="service_buy_before"><i></i>购买未生效</span> | \
											<span class="service_invoice"><i></i>申请发票</span> | \
											<span class="service_buy_before"><i></i>联系客服</span>\
									</div>\
							</div>',
			success: function (layers, indexs) {
				var loadT = bt.load('正在获取产品推荐信息，请稍候...');
				var temporary_coupon = {} //24小时临时优惠券
				$('.see-infomation').click(function () {
					config.fun()
				})
				bt.send('get_coupons','auth/get_coupons',{},function(res_coupons){
					bt.send('get_plugin_remarks', 'auth/get_plugin_remarks', {}, function (res) {

						var add_seven_coupon = false //7天内添加优惠券
						that.abcCompare = res.pay_list || {};
						that.abcCompare.totalNum = 0;
						loadT.close();
						//初始化
						that.pay_loading.init('start');
						that.pay_loading.init('end');

						// 防止浏览器过低
						$('.libPay-view .layui-layer-content').removeAttr('style');
						$('.libPay-view .layui-layer-page,.libPay-view .layui-layer-content').height(640);

						// 活动广告
						if(typeof res.activity_list != 'undefined' && res.activity_list.length > 0){
							$('#libPay-theme-tips').removeClass('hide')
							$($('#libPay-theme-tips span')[0]).html(res.activity_list[0])
							$('#libPay-theme-tips span').css('padding','0')
						}else{
							$('.libPay-line-item.proTname').css({'fontSize': '18px','margin': '20px 0 15px 0'})
						}

						//客服电话咨询
						$('.libPay-line-item.prokf').click(function (ev) {
							if ($(this).find('i').hasClass('active')) {
								$(this).find('i').removeClass('active');
								$(this).find('input').prop('checked', false);
							} else {
								$(this).find('i').addClass('active');
								$(this).find('input').prop('checked', true);
							}
							ev.preventDefault();
						});
						$('.links_refresh').click(function(){
							if(window.location.pathname != '/soft') {
								soft.flush_cache()
							}else{
								soft.flush_cache()
								getPaymentStatus()
							}
						})
						var arry = [
							{
								title: '专业版',
								name: '宝塔面板专业版',
								introduce: '适用于个人用户、个人项目',
								colorGroup: { l_bg: 'FFF5E1' },
								pid: 100000011,
								type: 'pro',
								rlist: res.pro_list,
							},
							{
								title: '企业版',
								name: '宝塔面板企业版',
								introduce: '适用于官网，电商、教育、医疗等企业用户',
								colorGroup: { l_bg: '2F3437' },
								pid: 100000032,
								type: 'ltd',
								rlist: res.list,
							},
						];
						if(config.plugin){
							arry.unshift({
								name: config.name,
								pid: config.pid,
								type: 'plugin',
								typeid: config.type,
								ps: config.ps,
							});
						}

						var hide_pro = false, hide_plugin = false;
						// 根据后端的传值，进行产品的展示、隐藏
						if(that.abcCompare.type_3.indexOf(totalNum) > -1 || that.abcCompare.type_2.indexOf(totalNum) > -1 || that.abcCompare.type_1.indexOf(totalNum) > -1){
							$('.libPay-menu .lib_plugin').addClass('hide');
							hide_plugin = true;
							if(that.abcCompare.type_3.indexOf(totalNum) > -1 ) {
								$('.libPay-menu .lib_pro').addClass('hide').parent().addClass('closePro');
								hide_pro = true
							}
						}

						var ops_obj = {
							title: '企业运维托管',
							name: '企业运维托管',
							introduce: '适用于无专业技术、需要高级技术服务支持的企业用户',
							colorGroup: { l_bg: '2F3437' },
							pid: 100000068,
							type: 'ops',
							rlist: [
								'网站性能优化',
								'网站安全扫描',
								'网站攻击防护',
								'服务器运维托管',
								'企业版所有特权',
								'文件防篡改配置',
								'文件代码同步部署',
								'系统文件垃圾清理',
								'数据库数据同步部署',
								'50x/40x网站报错处理',
								'CPU内存占用100%处理',
							],
						}
						if (!config.plugin)
							arry.push(ops_obj);

						$('.libPay-line-item.artificial').unbind('click').click(function () {
							// 点击托管
							if(!$(this).hasClass('active')) {
								$(this).addClass('active')
								$('.libPay-menu .libPay-menu-type.active').data('data', arry.filter(function (item) {return item.pid === 100000068})[0] || ops_obj);
								bt.send('get_last_paid_time','auth/get_last_paid_time',{
									pid:100000068
								},function(t_data){
									if(t_data.res != 0 && t_data.res != '0'){
										var last_pay_time = t_data.res * 1000
										var now_time = new Date().getTime()
										var time = that.interval(last_pay_time,now_time)
										if(time<=30){
											$('.payment_repeat_tips').removeClass('hide');
										}else{
											$('.payment_repeat_tips').addClass('hide');
										}
									}else{
										$('.payment_repeat_tips').addClass('hide');
									}
								})
							}else{
								$(this).removeClass('active')
								$('.libPay-menu .libPay-menu-type.active').data('data', arry.filter(function (item) {return item.pid === 100000032})[0]);
								bt.send('get_last_paid_time','auth/get_last_paid_time',{
									pid:100000032
								},function(t_data){
									if(t_data.res != 0 && t_data.res != '0'){
										var last_pay_time = t_data.res * 1000
										var now_time = new Date().getTime()
										var time = that.interval(last_pay_time,now_time)
										if(time<=30){
											$('.payment_repeat_tips').removeClass('hide');
										}else{
											$('.payment_repeat_tips').addClass('hide');
										}
									}else{
										$('.payment_repeat_tips').addClass('hide');
									}
								})
							}
							useCoupons()
							var _index = $('.pay-cycle-btns.active').index()
							$('.pay-cycle-btns').eq(_index > 0 ? _index : 0).click()
						})
						$('.libPay-menu').data('arry', arry)
						$('.libPay-menu .libPay-menu-type').each(function (index) {
							$(this).data('data', arry[index]);
						});
						$('.libPay-menu .libPay-menu-type').click(function () {
							var _item = $(this).data('data');
							$('#libPay-theme-price').removeAttr('style');
							$('.pay-pro-cycle').removeAttr('style');

							$('.switch-cycle-left').addClass('hide')
							layer.close(bt.soft.unbindId);
							$('.unbundling_mask').hide();
							if($(this).prop('class').indexOf('ltd') !== -1) {
								$('.libPay-line-item.artificial').removeClass('active')
								_item = arry.filter(function (item) {return item.pid === 100000032})[0]
							}
							$(this).data('data', _item);
							that.get_product_change($(this).index(), _item.type);
							$('.libPay-content-box').removeClass('ltd pro ops ver plugin').addClass(_item.type);
							if (_item.type == 'ops') {
								$('.payment_results_tips').removeClass('hide');
							} else {
								$('.payment_results_tips').addClass('hide');
							}
							if(_item.type != 'ver'){
								bt.send('get_last_paid_time','auth/get_last_paid_time',{
									pid:_item.pid
								},function(t_data){
									if(t_data.res != 0 && t_data.res != '0'){
										var last_pay_time = t_data.res * 1000
										var now_time = new Date().getTime()
										var time = that.interval(last_pay_time,now_time)
										if(time<=30){
											$('.payment_repeat_tips').removeClass('hide');
											$('.payment_results_tips').addClass('hide');
										}else{
											$('.payment_repeat_tips').addClass('hide');
										}
									}else{
										$('.payment_repeat_tips').addClass('hide');
									}
								})
							}
							useCoupons()
						});

						function useCoupons() {
							var memu_type = $('.libPay-menu .libPay-menu-type.active')
							var _item = memu_type.data('data');
							if(res_coupons.success && _item.type !== 'ver'){
								var all_coupons_data = res_coupons.res,coupons_data = []
								var _ul = ''
								for (var i = 0; i < all_coupons_data.length; i++) {
									if(all_coupons_data[i].product_id === _item.pid || all_coupons_data[i].extra_product_ids.indexOf(_item.pid) != -1){
										coupons_data.push(all_coupons_data[i])
										_ul += '<li>'+ all_coupons_data[i].name +'</li>'
									}
								}
								if(coupons_data.length){
									for (var i = 0; i < coupons_data.length; i++) {
										//24小时临时优惠券
										if(coupons_data[i].ptype){
											temporary_coupon = coupons_data[i]
											temporary_coupon['index'] = i
										}
									}
									$('.libPay-line-item.coupons').empty().append('<i class="coupon—checkbox"></i><input type="checkbox" class="coupon—checkbox-input" />\
										优惠券（'+coupons_data.length+'）\
										<div class="coupon_item"><span>'+ coupons_data[0].name +'</span><ul class="hide">'+ _ul +'</ul></div>\
										<div class="countdown_item hide"><div class="hour"></div>小时<div class="minute"></div>分<div class="second"></div>秒后失效</div>').data('data',coupons_data)
									$('.coupon_item').data('data',coupons_data[0])
									$('.libPay-line-item.coupons').removeClass('disabled')

									//是否有临时优惠券
									$('.exclusive_coupon_popup').remove()
									var use_coupon_id = bt.get_cookie('use_coupon_id')
									//临时优惠券
									if(!$.isEmptyObject(temporary_coupon) && !$('.exclusive_coupon_popup').length) {
										if(!(use_coupon_id !== null && use_coupon_id.indexOf(temporary_coupon.id) > -1)) {
											var result = arry.find(function(item,index){ return item.pid === temporary_coupon.product_id})
											var time = temporary_coupon.endtime*1000 - new Date().getTime()
											var hour = parseInt(time / (1000 * 60 * 60)) % 24
											bt.open({
												type: 1,
												area: '438px',
												title: false,
												closeBtn: 1,
												shadeClose: false,
												skin: 'exclusive_coupon_popup',
												content: '<div class="exclusive_coupon_title">恭喜你获得专属优惠券</div>\
														<div class="exclusive_coupon_info">\
															<div class="exclusive_coupon_cont">\
																<div class="exclusive_coupon_cont_left">\
																	<div class="coupon_discount_price"><span>￥</span><span>'+parseInt(temporary_coupon.val2)+'</span></div>\
																	<div class="coupon_fully_able">满'+ parseInt(temporary_coupon.val1) +'元可用</div>\
																</div>\
																<div class="exclusive_coupon_cont_right">\
																	<div>购买'+ result.title +'可用</div>\
																	<div>仅限'+hour+'小时</div>\
																</div>\
															</div>\
														</div>\
														<div class="exclusive_coupon_bottom">\
															<button type="button" class="exclusive_coupon_btn">立即使用</button>\
														</div>',
												success: function (layero, index) {
													$(layero).css({'background': 'rgb(255, 249, 245)','border-radius':'18px'})
													$(layero).find('.layui-layer-content').css({'padding':'35px 40px','border-radius':'18px'})
													$(layero).prev().css({'background': 'rgb(0, 0, 0)','opacity':'0.45'})
													$(layero).before($('<img class="exclusive_coupon_light" src="/static/img/exclusive_coupon_light.svg" alt="" />').css({
														'z-index':$(layero).prev().css('z-index'),
														'left': $(layero).css('left').match(/\d+/) - 100+'px',
														'top': $(layero).css('top').match(/\d+/) - 140+'px',
													}))
													$(window).resize(function () {
														$('.exclusive_coupon_light').css({
															'left': $(layero).css('left').match(/\d+/) - 100+'px',
															'top': $(layero).css('top').match(/\d+/) - 140+'px',
														})
													})
													$(layero).find('.exclusive_coupon_btn').click(function () {
														var _cycle = $('.pay-cycle-btns.active').data('data'),//周期数据
															_nums = $('.btn_nums.active').data('data'),//数量
															_price = 0

														$.each(_cycle.nums,function (index,item) {
															if(item.count == _nums){
																_price = item.price
															}
														})

														if(_price >= parseInt(temporary_coupon.val1)){
															coupon_li.eq(temporary_coupon.index).click()
														}
														bt.set_cookie('use_coupon_id',bt.get_cookie('use_coupon_id') + temporary_coupon.id)
														$('.exclusive_coupon_light').remove()
														layer.close(index)
													})
												},
												cancel: function (index, layero) {
													bt.set_cookie('use_coupon_id',bt.get_cookie('use_coupon_id') + temporary_coupon.id)
													$('.exclusive_coupon_light').remove()
												}
											})
										}
									}
								}else{
									$('.libPay-line-item.coupons').empty().append('<i class="coupon—checkbox"></i><input type="checkbox" class="coupon—checkbox-input" />\
										优惠券（0）\
										<div class="coupon_item"><span>暂无优惠券</span></div>')
									$('.coupon_item').data('data',[])
									$('.libPay-line-item.coupons').data('data',[])
									$('.libPay-line-item.coupons').removeClass('active').addClass('disabled')
								}
								var coupon_li = $('.libPay-line-item.coupons .coupon_item ul li')

								//优惠券点击事件
								$('.libPay-line-item.coupons').unbind('click').click(function (ev) {
									if($(this).hasClass('disabled') && !coupons_data.length) return layer.msg('暂无优惠券！')
									if($(this).hasClass('disabled')) return layer.msg('无可用优惠券！')
									if($(this).hasClass('active')) $(this).removeClass('active')
									else $(this).addClass('active')
									that.create_pay_code($('.pay-cycle-btns.active').index());
								})
								// 优惠券显示
								$('.libPay-line-item.coupons .coupon_item').click(function (ev) {
									if(!coupons_data.length) return layer.msg('暂无优惠券！')
									$(this).find('ul').toggleClass('hide')
									// 点击空白处关闭
									$(document).click(function (ev) {
										$('.libPay-line-item.coupons .coupon_item ul').addClass('hide')
										$(this).unbind('click');
										ev.stopPropagation();
										ev.preventDefault();
									});
									ev.stopPropagation()
								})
								// 优惠券选择
								coupon_li.unbind('click').click(function (ev) {
									if($(this).hasClass('disabled')){
										return layer.msg('该优惠券不满足使用条件！')
									}
									$(this).addClass('active').siblings().removeClass('active')
									$(this).parent().parent().find('span').html($(this).html())
									$(this).parent().addClass('hide')
									var coupons_data = $('.libPay-line-item.coupons').data('data')
									var _coupon_data = coupons_data[$(this).index()]
									$('.coupon_item').data('data',_coupon_data)
									if(!$('.libPay-line-item.coupons').hasClass('disabled')) $('.libPay-line-item.coupons').addClass('active')
									var item = $('[data-type=1]').data('data')
									if(_coupon_data.ptype) {
										$('.libPay-line-item.coupons .countdown_item').removeClass('hide')
										timeInterval(_coupon_data)
									}else{
										$('.libPay-line-item.coupons .countdown_item').addClass('hide')
									}
									if(item){
										//是否7天体验券
										if(parseFloat(_coupon_data.val2) > 1){
											$('[data-type=1]').find('.pay-head-price').html('<span><div class="libPrice">￥<i>'+ item.price +'</i></div>/'+ that.pro.conver_unit(item.cycle + '') +'</span><p>原价:'+ item.sprice +'元</p>')
											$('[data-type=1]').find('.pay-foo-price').html('低至'+ (item.price / ((item.cycle / 12) * 365)).toFixed(2)+ '元/天')

										} else{
											// 7天体验券
											// $('[data-nums=1]').addClass('active').siblings().removeClass('active')
											// $('[data-type=1]').addClass('active').siblings().removeClass('active')
											// $('[data-type=1]').find('.pay-head-price').html('<span><div class="libPrice">￥<i>'+ parseFloat(_coupon_data.val1).toFixed(2) +'</i></div>/7天体验</span><p>原价:'+ item.sprice +'元</p>')
											// $('[data-type=1]').find('.pay-foo-price').html('低至'+ parseFloat(parseFloat(_coupon_data.val1)/7).toFixed(2)+ '元/天')
											if(!ev.isTrigger){
												var $children = $('.pay-pro-cycle').children()
												var $num_children = $('#libPay-theme-nums').children()
												$.each($num_children,function (index,item) {
													if(index != 0){
														$(item).remove()
													}
												})
												var clonedElement =$($children[$children.length-1]).clone();
												clonedElement.find('.pay-head-price').html('<span><div class="libPrice">￥<i>'+ parseFloat(_coupon_data.val1).toFixed(2) +'</i></div>/7天体验</span>')
												clonedElement.find('.pay-foo-price').html('低至'+ parseFloat(parseFloat(_coupon_data.val1)/7).toFixed(2)+ '元/天')
												clonedElement.data('data',Object.assign(_coupon_data,{cycle:1,nums:[{id: 0, pid: "100000068", discount: 1, count: 1, product_cycle: "1", price: 1000}]}))
												if(!$('.switch-cycle-right').hasClass('hide')){
													if($($children[0]).data('data').nums.length != 1){
														$($children[0]).before(clonedElement)
													}

												}else {
													if($($children[0]).data('data').nums.length != 1){
														$($children[0]).before(clonedElement)
													}
													$('.switch-cycle-left').click()
												}
												$(clonedElement).addClass('active').siblings().removeClass('active')
												$(clonedElement).addClass('active').siblings().removeClass('active')
											}else {
												if(!$('.switch-cycle-right').hasClass('hide')){
													var $children = $('.pay-pro-cycle').children()
													if($($children[0]).data('data').nums.length == 1){
														$($children[0]).remove()
													}
												}else {
													bt.del_seven_coupon = true
												}
												$('.libPay-line-item.coupons').click()
											}
											for (var i = 0; i < coupons_data.length; i++) {
												if(parseFloat(coupons_data[i].val1) > item.price){
													coupon_li.eq(i).addClass('disabled')
												}
											}
										}
									}
									that.create_pay_code($('.pay-cycle-btns.active').index());
									ev.stopPropagation()
								})
								// 优惠券倒计时
								function timeInterval(data_coupons) {
									clearInterval(bt.soft.pub.countdown)
									bt.soft.pub.countdown = setInterval(function(){
										that.countDown(data_coupons)
										if(!data_coupons.ptype) {
											clearInterval(bt.soft.pub.countdown)
										}
									},1000)
								}
							}
						}
						// 发票
						$('.service_invoice').click(function () {

							layer.open({
								type: 1,
								title: '申请发票',
								closeBtn: 2,
								shadeClose: false,
								area: '400px',
								content:
									'<ul class="help-info-text c7 explainDescribeList" style="margin: 15px;"><li>前往堡塔<a class="btlink" href="http://www.bt.cn/admin/product_orders" target="_blank">官网后台</a>-订单列表【点击申请发票】</li><li>请提前准备好公司抬头</li><li>下单时间满3天并且订单金额为200元以上可自主申请发票</li></ul>',
							});
						});
						//技术客服
						$('.payment_results_tips a').click(function () {
							layer.open({
								type: 1,
								title: false,
								closeBtn: 2,
								shadeClose: false,
								area: '240px',
								content:
									'<div class="enter_qrcode">\
															<img class="enterprise_wechat_qrcode" src="/static/img/enterprise_wechat.png">\
															<div>\
																	<img class="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAATlJREFUSEvtVrFOw0AMfed8AxJsZWGAgQHBXP4DCQa+Ioou7g18BRIg9T/KDGJggIGFbiDxDXGQowSBuGvrFISEmtF+7/nis312RVEMiWgIoMT375aIjpj5KeJrTMy8JSJjAPsRzEhErl1Zlhd1XZ8kRKZEdMjM0xlBBiIyATCIYZxzl857X6uTiHaY+TElZrUz87aIPCjvI0gIwVmF5uG7H1gFmZepxv85XTdqCCEcLMQ0gLz3jbbTOm/rPdkLBt0v0E77xysq2it9T2nhuTzPN4ho10KyYEXkXvvkBcC6hWjEvmqQMwCnANZa8p1RJAbfa41vAM7/0cUzczOiZ43zvunrtPVOntuO3+wrluJ12qspvFBm/+bR+u03nhPrkKZk2ZVINUZO964sy44Ta9FSK5GuQ1VVXb0DLf+sHQ9tLL0AAAAASUVORK5CYII=">\
																	<span>微信扫一扫，联系技术客服<span>\
															</div>\
													</div>',
							});
						});

						$('.switch-cycle-right').click(function () {
							var num = $(this).prev().children().length;
							var width = 170;
							var remainder =  num % 4; //获取余数
							$(this).prev().css('transform','translateX(-'+(remainder * width ) + 'px)')
							$('.switch-cycle-left').removeClass('hide')
							$('#libPay-theme-price').css('padding-left','30px')
							$(this).addClass('hide')
						})

						$('.switch-cycle-left').click(function (ev) {
							if(bt.del_seven_coupon){
								var $children = $('.pay-pro-cycle').children()
								if($($children[0]).data('data').nums.length == 1){
									$($children[0]).remove()
									bt.del_seven_coupon = false
								}
							}
							$('#libPay-theme-price').removeAttr('style')
							$('.switch-cycle-right').removeClass('hide')
							$(this).next().removeAttr('style')
							$(this).addClass('hide')
						})
						//100000000表示获取所有抵扣券
						bt.soft.pro.get_voucher(100000000, function (rdata) {
							var tab_list = $('.libPay-menu .libPay-menu-type'),
								item = arry[rdata.length > 0 ? tab_list.length - 1 : 0],
								is_coupon = false;
							$('.libVoucher-loading').hide();
							tab_list.last().data('data', {
								type: 'ver',
								data: rdata,
							});
							for (var i = 0; i < rdata.length; i++) {
								if (rdata[i].product_id === config.pid) {
									is_coupon = true;
									break;
								}
							}
							is_coupon = config.is_coupon !== undefined ? config.is_coupon : is_coupon;
							if (!is_coupon) {
								if (config.plugin && hide_plugin) setTimeout(function(){tab_list.eq(2).click(); },300);
								if (config.limit === 'ltd') tab_list.eq(1).click();
								if (config.limit === 'pro' || config.plugin) tab_list.eq(!hide_pro?0:1).click();
								if (config.limit === 'ops') $('.libPay-menu .libPay-menu-type.lib_ops').click();
							} else {
								that.get_product_change(tab_list.length - 1, 'ver');
							}
						});
					});
					$('.libPay-view').on('click', '.service_buy_before', function () {
						bt.onlineService();
					});
					$(window).on('beforeunload', overall_beforeunload);
					$(document).on('keydown', overall_keyup);
					bt.set_cookie('refresh_software_list', 1);
					bt.set_cookie('force', 1);
				})

				// 当弹窗高度大于浏览器高度时，设置弹窗高度为浏览器高度
				resize()
				function resize() {
					var winHeight = $(window).height(),layerHeight = $(layers).height()
					if(layerHeight >= winHeight){
						setTimeout(function () {
							$(layers).css({
								overflow: 'auto',
								width: '1017px',
								height: winHeight,
								top: 0
							})
							$('.libPay-view.layui-layer-page .layui-layer-content').attr('style','height:720px !important')
						},1000)
					}else {
						$(layers).css({
							overflow: 'inherit',
							width: '1000px',
							height: '720px',
							top: ($(window).height() - 720) / 2 + 'px'
						})
						$('.libPay-view.layui-layer-page .layui-layer-content').attr('style','height: 640px')
					}
				}
			},
			end: function () {
				$(window).unbind('beforeunload', overall_beforeunload);
				$(document).unbind('keydown', overall_keyup);
				clearInterval(bt.soft.pub.wxpayTimeId);
			},
			cancel: function (indexs) {
				bt.simple_confirm({ title: '温馨提示', msg: '支付过程中，请勿关闭该页面，以免出现支付异常！'}, function (indexss) {
					layer.close(indexs);
					layer.close(indexss);
					window.parent.postMessage('closePlugin', '*')
				})
				return false;
			},
		});
	},
	// 设置顶部身份图标
	set_pay_status_icon:function(){
		bt.send('get_pd', 'ajax/get_pd', {}, function (res) {
			var tab = $('.pos-box .authState'),
				tab1 = $('.index-pos-box .pull-right'),
				proHTML = '',
				_index = res[1] > 0 ? 1 : 2,
				is_pay = res[1] >= 0 || res[2] > 0, //是否购买
				advanced = res[1] == 0 || res[1] > 0 ? 'pro':'ltd';
			if(!is_pay){
				proHTML = '<span><span class="btltd-gray" onclick="bt.soft.updata_ltd()" style="margin-right:4px" title="点击升级到企业版"></span><span id="free-span">免费版</span></span>'
				proHTML_button = '<div class="product-buy" style="margin-right:0;"><button type="button" class="btn btn-success btn-xs" style="vertical-align: 1px;" onclick="product_recommend.pay_product_sign(\'ltd\',80,\'ltd\')">立即升级</button></div>'
				proHTML_index = '<span class="btltd-gray" onclick="bt.soft.updata_ltd()" title="点击升级到企业版">免费版</span>'
				tab.children().eq(-1).remove()
				tab.append(proHTML_button);
				if($('.product-buy').prev().text().includes('免费版')){
					proHTML = '<span class="btltd-gray" onclick="bt.soft.updata_ltd()" title="点击升级到企业版"></span>'
				}
			}else{
				proHTML = ' <span class="bt'+advanced+'"></span>'
				proHTML_index = ' <span class="bt'+advanced+'">到期时间：<span style="color: #fc6d26;font-weight: bold;margin-right:5px">'+(res[1] === 0?'永久授权':((res[1] === -2 || res[2] === -2)?'已过期':bt.format_data(res[_index],'yyyy-MM-dd'))+ '&nbsp;&nbsp;<a class="btlink" onclick="bt.soft.updata_pro()">续费</a>')+'</span>'
			}
			// 其他界面
			tab.children().eq(0).remove();
			tab.prepend(proHTML);
			// 首页替换
			tab1.children().eq(0).remove();
			tab1.prepend(proHTML_index);
		})
	},
	//获取付款周期
	get_product_change: function (idx, btype) {
		var that = this,
			_pro_end = bt.get_cookie('pro_end'),
			_ltd_end = bt.get_cookie('ltd_end');

		clearInterval(bt.soft.pub.wxpayTimeId);
		$('.libPay-layer-item')
			.eq(btype === 'ver' ? 1 : 0)
			.addClass('aShow')
			.siblings()
			.removeClass('aShow');
		$('.libPay-footer-tips').removeClass('hide');
		var _obj = $('.libPay-menu .libPay-menu-type').eq(idx);
		_obj.addClass('active').siblings().removeClass('active');
		var _data = _obj.data('data');
		if (btype !== 'ver') {
			var _html = '',
				_list = '',
				href = '';
			if (btype !== 'plugin') {
				//运维版添加报告链接
				if (_data['type'] == 'ops') {
					href =
						'<div class="pro-introduce safe-report"><span class="glyphicon glyphicon-star"></span><span><a target="_blank" href="https://www.bt.cn/new/product/safety_report.html" >获取安全检查报告</a></span></div>';
				}
				var active = ['30+款付费插件','20+企业版专享功能','15+款付费插件']
				//渲染特权列表
				$.each(_data['rlist'], function (index, item) {
					var activeIndex = active.indexOf(item)
					_list += '<div class="pro-introduce"><span class="glyphicon glyphicon-ok"></span><span>' + (activeIndex !== -1 ? '<a class="selectPrivilege '+ (activeIndex === 2 ? 'pro' : '') +'" data-index="'+ activeIndex +'">'+ item +'</a>' : item) + '</span></div>';
				});
				_html =
					'<div class="pro-left-introduce ' +
					_data.type +
					'">\
										<div class="pro-left-title"><div><span class="glyphicon glyphicon-vip" style="margin-right:7px"></span><span>' +
					(_data.type == 'ops' ? '' : 'Linux') +
					_data.title +
					'</span></div><span>' +
					_data.introduce +
					'</span></div>\
										<div class="pro-left-list">\
												<div class="pro-left-list-title">' +
					_data.title +
					'特权:</div>\
												<div class="pro-left-list-content">' +
					_list +
					href +
					'</div>\
										</div>\
								<div class="pro-price-herf"><a class="privilege_contrast" href="javascript:;">特权对比</a></div>\
								</div>';
			} else {
				_html =
					'<div class="pro-left-introduce ' +
					_data.type +
					'">\
										<div class="pro-left-title"><div><span>' +
					_data.name +
					'</span></div></div>\
										<div class="pro-left-list">\
												<div class="pro-left-list-title">插件说明</div>\
												<div class="pro-left-list-content" style="width: 165px;line-height: 23px;">' +
					_data.ps +
					'</div>\
										</div>\
										<div class="pro-left-footer-recom"><span>Linux' +
					(_data.typeid == 8 ? '专业版' : '企业版') +
					'可免费使用【' +
					_data.name +
					'】等' +
					(_data.typeid == 8 ? 15 : 30) +
					'+款插件，价格仅售￥<span class="plugin_pro_price">-</span>/年</span></div>\
								</div>';
			}
			$('.libPay-product-introduce').empty().append(_html);

			//查看特权
			$('.selectPrivilege').unbind('click').click(function () {
				var idx = $(this).data('index'),title = $(this).text(),
					proList = ['Apache防火墙','Nginx防火墙','MySQL主从复制','网站防篡改程序','宝塔系统加固','文件同步工具','异常监控推送','宝塔负载均衡','堡塔APP','对象存储自动挂载','NFS文件共享管理器','宝塔任务管理器','网站监控报表','堡塔SSH二次认证','堡塔网站挂马检测'],
					ltdList = ['堡塔PHP安全防护','服务器安全扫描','堡塔企业级防篡改','堡塔防入侵','服务器网络加速','堡塔网站测速','堡塔限制访问型证书','文件监控','PHP网站安全告警','系统漏洞扫描','漏洞情报推送','堡塔站点优化','节点同步工具','堡塔运维平台','数据库运维工具','Java安全告警','IP精准数据包','面板多用户管理','堡塔资源监视器','堡塔硬盘分析工具']
				ltdList2 = ['漏洞扫描','网站配额容量','双向认证','流量限额','网站-防篡改','网站安全','站点防护','安全扫描','违规词检测','拨测告警','ftp容量配额','企业增量备份','二进制文件分析','敏感词检测','面板日报','系统防火墙归属地','ssh登录日志','安全检测','文件大小查看','百度云存储','阿里云oss','腾讯云cos','华为云存储','日志统计'],
					pluginList = proList.concat(ltdList)
				bt_tools.open({
					title: title,
					btn: false,
					area: '500px',
					content: '<div class="privilegeTable pd20"></div>',
					success:function (layero, index) {
						bt_tools.table({
							el:'.privilegeTable',
							data: idx === 0 ? pluginList : idx === 1 ? ltdList2 : proList,
							height: '400px',
							column:[
								{
									title: '序号',
									template: function (row) {
										var list = idx ? idx === 1 ? ltdList2 : proList : pluginList
										return '<span>'+ (list.indexOf(row) + 1) +'</span>'
									}
								},
								{
									title: '特权名称',
									template: function (row) {
										return '<a class="privilegeLink" target="_blank" href="https://www.bt.cn/new/pricing.html">'+ row +'</a>'
									}
								}
							],
							success:function () {
								$(layero).css('top', ($(window).height() - $(layero).height())/2 + 'px')
								$('.privilegeLink').hover(function () {
									layer.tips('<span>点击跳转到【官网-价格】</span>',$(this),{tips: [2, '#555555'],time: 0})
								},function () {
									layer.closeAll('tips')
								})
							}
						})
					}
				})
			})

			//特权对比弹窗
			$('.privilege_contrast').click(function (e) {
				layer.closeAll()
				that.privilege_contrast()
				e.stopPropagation()
			})


			that.get_product_discount_cache(_data, function (rdata) {
				var _ul = $('#libPay-theme-price ul').empty(),
					_nums = $('#libPay-theme-nums').empty();
				(num = 0), (html = ''), (payList = []);
				if (rdata.pid === '100000068') {
					delete rdata['1'];
					delete rdata['6'];
					delete rdata['36'];
				}
				$('.plugin_pro_price').html(_data.typeid == 8 ? rdata.pro : rdata.ltd); //动态产品价格
				var is_type_2 = that.abcCompare.type_2.indexOf(that.totalNum) > -1 // 是否是type2
				for (var keys in rdata) {
					var item = rdata[keys];
					if (typeof item === 'object') {
						if(keys === '1' && rdata['pid'] === '100000011' && is_type_2) continue;
						num++;
						if (num > 4 && is_type_2) break;
						item['cycle'] = keys;
						payList.push(item);
					}
				}
				if(num > 4) $('.switch-cycle-right').removeClass('hide');
				if(is_type_2 || num <= 4){
					$('.switch-cycle-right,.switch-cycle-left').addClass('hide');
				}
				// 排序
				for (var i = 0; i < payList.length; i++) {
					for (var j = i + 1; j < payList.length; j++) {
						if (payList[i].sort > payList[j].sort) {
							var temp = payList[i];
							payList[i] = payList[j];
							payList[j] = temp;
						}
					}
				}
				render_num(rdata['12'].nums);
				$.each(payList, function (index, item) {
					var keys = item.cycle;
					var _li = $(
						'<li class="pay-cycle-btns" data-type="' +
						keys +
						'"><div class="pay-head-price"><span><div class="libPrice">￥<i>' +
						item.price +
						'</i></div>/' +
						that.pro.conver_unit(item.cycle + '') +
						'</span><p>原价:' +
						item.sprice +
						'元</p></div><div class="pay-foo-price">低至' +
						(item.price / ((item.cycle / 12) * 365)).toFixed(2) +
						'元/天</div>' +
						(item.tip ? '<em>' + item.tip + '</em>' : '') +
						'</li>'
					);
					_li.data('data', item).click(function () {
						$('.pay-cycle-btns').eq($(this).index()).addClass('active').siblings().removeClass('active');
						var artificial = $('.libPay-line-item.artificial')
						var memu_type = $('.libPay-menu .libPay-menu-type.active')
						var arry = $('.libPay-menu').data('arry')
						if($(this).data('data').cycle === "12" && $('.libPay-menu-type.lib_ltd').hasClass('active')){
							artificial.removeClass('hide')
							if(artificial.hasClass('active')){
								memu_type.data('data', arry.filter(function(items){return items.pid === 100000068})[0]);
							}else{
								memu_type.data('data', arry.filter(function(items){return items.pid === 100000032})[0]);
							}
						}else{
							artificial.addClass('hide')
							if($(this).data('data').cycle !== "12" && $('.libPay-menu-type.lib_ltd').hasClass('active')) {
								memu_type.data('data', arry.filter(function(items){return items.pid === 100000032})[0]);
								if(artificial.hasClass('active')) artificial.click()
							}
						}
						var num_index = $('.btn_nums.active').index();
						_nums.html('');
						render_num(item.nums);
						$('.btn_nums').eq(num_index > 0 ? num_index : 0).click();
					});
					_ul.append(_li);
				});
				if (btype === 'ops') {
					$('.libPay-line-item.proP ul').append('<div class="ops_msg"></div>');
				}
				$('.pay-cycle-btns').eq(0).click()
				// $('.btn_nums').eq(0).click();
				// $('.btn_nums').eq(0).addClass('active').siblings().removeClass('active');
				// // if(num >= 4) $('#libPay-theme-price .pay-cycle-btns').css('width',((910  - ((num - 1) * 10)) / num) + 'px')
				// that.create_pay_code(0);

				function render_num(nums) {
					for (var i = 0; i < nums.length; i++) {
						var count = nums[i].count;
						var discount = nums[i].discount;
						var _btn = $('<button data-nums="' + count + '" class="btn_nums"><span>' + count + '台</span>' + (discount < 1 ? '<em>' + discount * 10 + '折</em>' : '') + '</button>');
						_btn.data('data', count).click(function () {
							var num = $(this).data('data');
							if (num === 1) {
								$('.more_msg').hide();
								$('.libPay-view').css('height','720px')
							}
							if (num > 1) {
								$('.libPay-view').css('height','740px')
								$('.more_msg').remove();
								$('.libPay-line-item.proN').append('<div class="more_msg">购买多台授权会默认减1台用于本机授权，剩余的授权台数以抵扣券的方式发放到当前账号，购买后请切换至抵扣券查看</div>');
							}
							$(this).addClass('active').siblings().removeClass('active');
							var _coupon = $('.libPay-line-item.coupons');
							var coupon_data = _coupon.data('data'),//优惠券数据
								_cycle = $('.pay-cycle-btns.active').data('data'),//周期数据
								_nums = $('.btn_nums.active').data('data');//数量
							var _coupon_li = $('.coupon_item ul li'),
								_coupon_span = $('.coupon_item span');
							var _price = 0,
								arr_coupon = [];//可使用优惠券数组
							if($('.pay-cycle-btns.active').data('data').cycle === "12" && $('.libPay-menu-type.lib_ltd').hasClass('active')){
								var arry = $('.libPay-menu').data('arry')
								var _menu_type_data = arry.filter(function(item){return item.pid === 100000068})[0]
								var p_id = _menu_type_data ? _menu_type_data.pid : 100000068;
								var _data_cache = that.product_cache[p_id];
								if(_data_cache) {
									_cycle = _data_cache['12']
									$('.artificial_price').text('￥' + _data_cache['12'].nums.filter(function(item){return item.count === num})[0].price)
								}else{
									bt.soft.pro.get_product_discount_by(p_id, function (rdata) {
										$('.artificial_price').text('￥' + rdata['12'].nums.filter(function(item){return item.count === num})[0].price)
										that.product_cache[p_id] = rdata;
										_cycle = rdata['12']
										setTimeout(function () {
											delete that.product_cache[p_id];
										}, 60000);
									})
								}
							}
							if(!$('.libPay-line-item.artificial').hasClass('active')) _cycle = $('.pay-cycle-btns.active').data('data');
							_cycle.nums.forEach(function (item,index) {
								if(item.count == _nums){
									_price = item.price
								}
							});
							if(coupon_data){
								coupon_data.forEach(function (item,index) {
									//是否满足使用条件
									if(parseInt(item.val1) <= _price){
										_coupon_li.eq(index).removeClass('disabled')
										arr_coupon.push({
											index:index,
											val1:item.val1,
											val2:item.val2,
											ptype: item.ptype,
										})
									}else{
										_coupon_li.eq(index).addClass('disabled')
									}
								});
								if(arr_coupon.length){
									//最优惠的优惠券排序
									arr_coupon.sort(function (a,b) {
										return b.val2 - a.val2
									})
									$('.countdown_item').removeClass('hide')
									_coupon.removeClass('disabled')
									_coupon_li.eq(arr_coupon[0].index).click()
									if(arr_coupon[0].ptype == 1) $('.countdown_item').removeClass('hide')
									else $('.countdown_item').addClass('hide')
								}else{
									_coupon_span.text('无可用优惠券')
									$('.coupon_item').data('data','')
									$('.countdown_item').addClass('hide')
									_coupon_li.removeClass('active')
									_coupon.removeClass('active').addClass('disabled')
									that.create_pay_code($('.pay-cycle-btns.active').index());
								}
							}else{
								that.create_pay_code($('.pay-cycle-btns.active').index());
							}
						});
						_nums.append(_btn);
					}
				}
			});
		} else {
			var voucherIntroduce = '';
			voucherIntroduce =
				'<div class="pro-left-introduce ' +
				_data.type +
				'"><div class="pro-left-title"><div><span>抵扣券</span></div><span>抵扣券授权</span></div>\
			<div class="pro-left-list">\
				<div class="pro-left-list-title">抵扣券来源:</div>\
				<div class="pro-left-list-content"><ul><li>官网后台购买</li><li>活动页购买</li><li>推广赠送</li><li>更换绑定IP</li></ul></div>\
								<div class="pro-price-herf"><a target="_blank" href="https://www.bt.cn/new/activity.html">查看更多活动</a></div>\
			</div></div>';
			$('.libPay-product-introduce').empty().append(voucherIntroduce);
			var _voucherList = _data.data;
			if (_voucherList === undefined || _voucherList.length <= 0) {
				$('.libPay-layer-item.aShow p').hide();
				return;
			}
			$('.libPay-layer-item.aShow p').show();
			// $('.libPay-footer-tips').addClass('hide')
			var _arry = {};
			this.each(_voucherList, function (index, item) {
				if (!_arry.hasOwnProperty(item.product_id)) {
					_arry[item.product_id] = {
						name: item.name,
						product_id: item.product_id,
						list: [],
						active: false,
					};
				}
				_arry[item.product_id]['list'].push(item);
			});
			//抵扣券分类
			var _ul = $('.libVoucher-type ul').empty();
			$.each(_arry, function (index, oitem) {
				var p_html = '<span><span>' + oitem.name + '</span></span>';
				if ($.inArray(oitem.product_id, [100000030, 100000011]) >= 0) {
					p_html = '<span class="pro-font-icon"><span class="glyphicon glyphicon-vip" style="margin-right:5px"></span><span>' + oitem.name + '</span></span>';
				} else if ($.inArray(oitem.product_id, [100000046, 100000032]) >= 0) {
					p_html = '<span class="ltd-font-icon"><span class="glyphicon glyphicon-vip" style="margin-right:5px"></span><span>' + oitem.name + '</span></span>';
				}

				var _li = $('<li class="pay-cycle-btn auto" data-id="' + oitem.product_id + '" >' + p_html + '</li>')
					.data(oitem)
					.click(function (ev) {
						$(this).addClass('active').siblings().removeClass('active');

						//抵扣券列表
						var _vlist = $('.libVoucher-list ul').empty();
						var v_data = $(this).data();
						$.each(v_data.list, function (index, item) {
							var _v_li = $(
								'<li class="pay-cycle-btn ' +
								(index == 0 ? 'active' : '') +
								'"><span>' +
								(item.unit == 'month' && item.cycle == 999 ? '永久' : item.cycle + that.pro.conver_unit(item.unit)) +
								'</span></li>'
							)
								.data(item)
								.click(function () {
									$(this).addClass('active').siblings().removeClass('active');
								});
							_vlist.append(_v_li);
						});
						var sub_btn = $('.libPay-voucher-submit button');
						if (v_data.list.length > 0) {
							//抵扣券续费
							sub_btn
								.removeClass('disabled')
								.text('提交')
								.unbind('click')
								.click(function () {
									var s_data = $('.libVoucher-list li.active').data();
									if (!s_data) {
										layer.msg('无可用优惠券');
										return false;
									}
									bt.send('get_last_paid_time','auth/get_last_paid_time',{
										pid:s_data.product_id
									},function(t_data){
										if(t_data.res != 0 && t_data.res != '0'){
											var last_pay_time = t_data.res * 1000
											var now_time = new Date().getTime()
											var time = that.interval(last_pay_time,now_time)
											if(time<=30){
												var content_html = '<div class="repeat_pay_dialog">\
														<div class="repeat_pay_tips"><span class="pay_warning_icon"></span>\
																<div class="repeat_pay_tips_text"><span style="margin-bottom:5px;">检测到您30分钟内有重复支付订单的操作！</span>\
																<span>如遇到支付授权未生效的情况，请尝试刷新授权</span></div></div>\
															<hr>\
															<div style="margin-bottom:3px">\
																<div class="repeat_pay_links" style="margin-bottom:8px">\
																	<span class="repeat_pay_links_refresh"></span>\
																	<span class="btlink links_span links_refresh">点击刷新授权</span>\
																</div>\
																<div class="repeat_pay_links">\
																	<span class="repeat_pay_links_service"></span>\
																	<span class="btlink links_span" id="links_service">联系客服查询授权状态</span>\
																</div>\
															</div>\
															<div style="width:100%;position:relative;height:30px"><button class="btn btn-sm btn-success repeat_pay_button">仍要继续</button></div>\
														</div>'
												layer.open({
													type:1,
													title:false,
													btn:false,
													closeBtn:1,
													area:['390px','204px'],
													content:content_html,
													success:function(layero, index){
														var _this = this
														$(layero).find('.layui-layer-close2').addClass('layui-layer-close1').removeClass('layui-layer-close2');

														$('.repeat_pay_button').click(function(){
															that.submit_pay_conpon($('.libVoucher-list li.active').data())
														})
														$('#links_service').click(function(){
															bt.onlineService();
														})
														$('.links_refresh').click(function(){
															layer.close(index)
															if(window.location.pathname != '/soft') {
																soft.flush_cache()
															}else{
																soft.flush_cache()
																getPaymentStatus()
															}
														})
													}
												})
											}else{
												that.submit_pay_conpon(s_data)
											}
										}else{
											that.submit_pay_conpon($('.libVoucher-list li.active').data())
										}
									})
									var _pro_end = bt.get_cookie('pro_end'),
										_ltd_end = bt.get_cookie('ltd_end');
								});
						} else {
							sub_btn.addClass('disabled').text('暂无抵扣券，请先购买').unbind('click');
						}
					});
				//企业版、专业版靠前
				if ($.inArray(oitem.product_id, [100000011, 100000032]) >= 0) {
					_ul.prepend(_li);
				} else {
					_ul.append(_li);
				}
			});

			//判断企业版、专业版未到期的产品
			var ltd = _ul.find('li[data-id=100000032]');
			var pro = _ul.find('li[data-id=100000011]');
			if (_ltd_end > 0 && ltd.length) {
				ltd.trigger('click');
			} else if (_pro_end > 0 && pro.length) {
				pro.trigger('click');
			} else {
				_ul.find('li').eq(0).trigger('click');
			}
		}
	},
	// 提交优惠券
	submit_pay_conpon:function(s_data){
		var that = this
		bt.soft.pro.create_order_voucher(s_data.product_id, s_data.code, function (rdata) {
			bt.set_storage('home_day_not_display','')//清除首页不再提醒
			if (typeof rdata.msg === 'string' && !rdata.status && rdata['extra']) {
				bt.soft.unbindAuth(rdata.extra.rest_unbind_count);
				setTimeout(function () {
					layer.closeAll('dialog');
				}, 10);
				return;
			}
			layer.closeAll();
			getPaymentStatus();
			if (rdata.status) {
				setTimeout(function () {
					bt.set_cookie('force', 1);
					if(window.location.pathname !== '/soft'){
						soft.flush_cache()
					}else{
						if (soft) soft.flush_cache();
					}
					location.reload(true);
				}, 1000);
			}
			bt.msg(rdata);
		});
	},
	// 计算时间差
	interval:function(faultDate,completeTime){
		var stime = faultDate;
		var etime = completeTime;
		var usedTime = etime - stime;  //两个时间戳相差的毫秒数
		var days=Math.floor(usedTime/(24*3600*1000));
		//计算出小时数
		var leave1=usedTime%(24*3600*1000);    //计算天数后剩余的毫秒数
		var hours=Math.floor(leave1/(3600*1000));
		//计算相差分钟数
		var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
		var minutes=Math.floor(leave2/(60*1000));
		if(hours>0 || days>0){
			return 31;
		}
		// var time = days + "天"+hours+"时"+minutes+"分";
		return minutes;
	},
	//获取倒计时
	countDown: function (data) {
		var nowTime = new Date().getTime();
		var time = data.endtime*1000 - nowTime;
		var day = parseInt(time / (1000 * 60 * 60 * 24))
		var hour = parseInt(time / (1000 * 60 * 60)) % 24
		var minute = parseInt(time / (1000 * 60)) % 60
		var second = parseInt(time / 1000) % 60
		$('.countdown_item .hour').html(hour)
		$('.countdown_item .minute').html(minute)
		$('.countdown_item .second').html(second)
		if (time <= 0) {
			$('.countdown_item').addClass('hide')
			clearInterval(bt.soft.pub.countdown)
		}
	},
	//生成支付二维码
	create_pay_code: function (idx) {
		// 授权冲突时不再请求购买订单
		$('.pay-cycle-btns').eq(idx).addClass('active').siblings().removeClass('active');
		var that = this,
			_product = $('.libPay-menu-type.active').data('data'),
			_cycle = $('.pay-cycle-btns.active').data('data'),
			_nums = $('.btn_nums.active').data('data'),
			_coupon = $('.libPay-line-item.coupons').hasClass('active') && !$('.libPay-line-item.coupons').hasClass('disabled') ? $('.coupon_item').data('data') : ''
		if(_coupon==''){
			if($($('.pay-pro-cycle').children()[0]).find('.pay-head-price .libPrice').find('i').text()=='0.99'){
				if($('.switch-cycle-right').hasClass('hide')){
					bt.del_seven_coupon =true
				}else {
					var $children = $('.pay-pro-cycle').children()
					if($($children[0]).data('data').nums.length == 1){
						$($children[0]).remove()
						$($('.pay-cycle-btns')[0]).click()
						return
					}
				}

			}
		}else if(_coupon.name.indexOf('0.99元7天体验券')!=-1){
			var $children = $('.pay-pro-cycle').children()
			var $num_children = $('#libPay-theme-nums').children()
			$.each($num_children,function (index,item) {
				if(index != 0){
					$(item).remove()
				}
			})
			var clonedElement =$($children[$children.length-1]).clone();
			clonedElement.find('.pay-head-price').html('<span><div class="libPrice">￥<i>'+ parseFloat(_coupon.val1).toFixed(2) +'</i></div>/7天体验</span>')
			clonedElement.find('.pay-foo-price').html('低至'+ parseFloat(parseFloat(_coupon.val1)/7).toFixed(2)+ '元/天')
			clonedElement.data('data',Object.assign(_coupon,{cycle:1,nums:[{id: 0, pid: "100000068", discount: 1, count: 1, product_cycle: "1", price: 1000}]}))
			if(!$('.switch-cycle-right').hasClass('hide')){
				if($($children[0]).data('data').nums.length != 1){
					$($children[0]).before(clonedElement)
				}

			}else {
				$('.switch-cycle-left').click()
				if($($children[0]).data('data').nums.length != 1){
					$($children[0]).before(clonedElement)
				}
			}
			$('.btn_nums').eq(0).addClass('active').siblings().removeClass('active')
			$(clonedElement).addClass('active').siblings().removeClass('active')
			$(clonedElement).addClass('active').siblings().removeClass('active')

		}
		var pay_source = parseInt(bt.get_cookie('pay_source') || 0);
		if (pay_source === 0) {
			if ($('.btltd-gray').length == 1) {
				// 是否免费版
				pay_source = 27;
			} else {
				pay_source = 28;
			}
		}
		$('.wx-pay-ico').hide();
		$('.libPay-loading').show();

		$('#PayQcode div:eq(0)').empty();
		$('.libPaycode-foo-txt .libPayTotal').text('---');
		that.pay_loading.set('start');
		$('.pay-radio-type').data('data', 0);
		$('div').remove('.libPay-line-item.unbind_auth');
		$('#libPay-qcode-box').show();
		var params = {
			pid: _product.pid,
			cycle: _cycle.cycle,
			source: pay_source,
			num: _nums,
		}
		if (_coupon) params.coupon = _coupon.id;
		that.pro.create_order(params,
			function (rdata) {
				var start = that.pay_loading.get('start');
				var end = that.pay_loading.set('end');
				if (end < start) return;
				$('.libPay-loading').hide();
				if (typeof rdata.msg === 'string' && !rdata.status && rdata['extra']) {
					// $('.unbundling_mask').show()
					$('#libPay-qcode-box').hide();
					$('.libPay-menu-type.active').addClass('auth_conflict')
					that.unbindAuth(rdata.extra.rest_unbind_count, true, function (obj) {
						$('.libPay-layer-item')
							.eq(0)
							.append($('<div class="libPay-line-item unbind_auth">' + obj.html + '</div>'));
						that.unbind_authorization_event(obj.count, obj.type);
					});
					// $('.proTname,.proN,#libPay-qcode-box').hide()
					return;
				}
				var active_idx = $('.pay-cycle-btns.active').index(),
					active_product = $('.libPay-menu-type.active').data('data'),
					nums_idx = $('.btn_nums.active').index();
				//判断创建订单完成后，前端选择的产品和周期是否发生改变
				if (((idx != active_idx || _product.pid != active_product.pid) && active_product && active_product.type != 'ver') || (_cycle.nums[nums_idx] && _nums != _cycle.nums[nums_idx].count)) {
					that.create_pay_code(active_idx);
					return;
				}
				if (rdata.status === false) {
					bt.set_cookie('force', 1);
					if (typeof soft != 'undefined') soft.flush_cache();
				} else {
					$('.payment_results_error_tips').remove();

					$('.wx-pay-ico').show();
					$('.pay-radio-type').data('data', rdata);
					$('.libPay-content-box .pay-type-btn')
						.unbind('click')
						.click(function () {
							that.show_pay_code($(this).index(),_coupon.id);
						});
					// that.show_pay_code($(".pay-type-btn.active").index())
					// if (rdata.pay_type === 1) {
					// 	$('.libPay-content-box .pay-type-btn').eq(0).click();
					// } else if (rdata.pay_type === 2) {
					// 	$('.libPay-content-box .pay-type-btn').eq(1).click();
					// } else {
					// that.show_pay_code($('.pay-type-btn.active').index());
					// }
					bt.send('get_credits', 'auth/get_credits', {uid: rdata.data.uid}, function (res) {
						bt.soft.pub.availableBalance = parseFloat(res.res/100)
						var cash_fee = parseFloat(rdata.data.cash_fee/100)
						$('.libPay-content-box .pay-type-btn').eq(bt.soft.pub.availableBalance >= cash_fee ? 2 : $('.pay-type-btn.active').index()).click();
					})
					that.product_pay_monitor({
						pid: rdata.data.pid,
						wxoid: rdata.data.wxoid,
						name: _product.name,
						title: _product.title,
						num: _nums,
						cycle: parseFloat(rdata.data.cash_fee/100) < 1 ? '7天' : that.pro.conver_unit(_cycle.cycle),
						rlist: _product.rlist,
						username: $('.info_value').text()
					});
				}
			}
		);
	},
	unbindId: 99999,
	/**
	 * @description 解绑授权
	 */
	unbindAuth: function (count, isBack, callback) {
		var that = this;
		var pro = parseInt(bt.get_cookie('pro_end'), 10),
			ltd = parseInt(bt.get_cookie('ltd_end'), 10),
			type = '';
		if (pro > -1) type = pro ? '专业版授权' : '专业版永久授权';
		if (ltd > 0) type = '企业版授权';
		_html =
			'<div class="unbindAuth">\
									<div class="icon"><span class="glyphicon glyphicon-exclamation-sign"></span><span>检测到授权冲突</span></div>\
									<div class="tips" style="margin-bottom: 5px">当前面板已绑定【<span style="color: #ff8d00;">' +
			type +
			'</span>】，若要购买/更换其他授权，请先解绑当前授权。</div>\
									<div class="tips">专业版/企业版每月允许免费更改服务器IP(解绑授权)一次，超过限制次数后请手动购买解绑次数。</div>\
									<div class="box"><a title="解绑授权" href="javascript:;" rel="noreferrer noopener" class="btn btn-success unbindAuthBtn">当前解绑次数已使用，点击前往购买</a></div>\
							</div>';
		if (callback) {
			//有回调方法时，不再往下执行弹窗方式
			callback({ html: _html, count: count, type: type });
			return false;
		}
		if ($('.unbindAuth').length > 1) return false;
		layer.close(that.unbindId);
		this.unbindId = layer.open({
			type: 1,
			title: false,
			closeBtn: 2,
			shadeClose: false,
			area: '340px',
			content: _html,
			success: function (layers, indexs) {
				bt.soft.unbind_authorization_event(count, type);
			},
		});
	},
	// 解绑授权事件
	unbind_authorization_event: function (count, type) {
		var that = this
		var unbindAuth = $('.unbindAuthBtn');
		if (count) {
			unbindAuth.text('解绑授权，剩余次数' + count + '次');
		} else {
			unbindAuth.text('点击前往购买解绑次数');
		}
		unbindAuth.on('click', function () {
			if (count > 0) {
				bt.confirm(
					{
						title: '提示',
						msg: '解绑当前<span style="color: #ff8d00;">【' + type + '】</span>，继续操作！',
					},
					function () {
						bt.soft.unbind_authorization(function (res) {
							bt.set_storage('home_day_not_display','')//清除首页不再提醒
							var payConfig = JSON.parse(bt.get_cookie('payConfig') || '{}');
							if (res.success) {
								layer.closeAll();
								if(location.pathname != '/soft'){
									soft.flush_cache()
								}else if(location.pathname == '/soft'){
									soft.flush_cache() // 清空软件缓存
									bt.clear_cookie('ltd_end')
									bt.clear_cookie('pro_end')
									getPaymentStatus()
									window.location.reload() // 重启页面
								}
								bt.soft.product_pay_view(payConfig);
							}
							bt.msg({ status: res.success, msg: res.res });
						});
					}
				);
			} else {
				unbindAuth.attr({ href: 'https://www.bt.cn/admin/profe_ee', target: '_blank' }).trigger('click');
			}
		});
	},
	// 解绑专业版和企业版
	unbind_authorization: function (callback) {
		var load = bt.load('正在解绑账号授权，请稍候...');
		bt.send('unbind_authorization', 'auth/unbind_authorization', {}, function (res) {
			load.close();
			if (callback) callback(res);
		});
	},
	// 购买解绑次数
	pay_unbind_count: function (callback) {
		var load = bt.load('正在获取支付订单，请稍候...');
		bt.send('get_pay_unbind_count', 'auth/get_pay_unbind_count', {}, function (res) {
			load.close();
			if (callback) callback(res);
		});
	},
	// 获取解绑次数
	get_unbind_count: function (callback) {
		var load = bt.load('正在获取支付次数，请稍候...');
		bt.send('rest_unbind_count', 'auth/rest_unbind_count', {}, function (res) {
			load.close();
			if (callback) callback(res);
		});
	},
	//特权对比
	privilege_contrast: function () {
		var that = this;
		that.get_soft_list(undefined,undefined,undefined,function (res) {
			var vips_list = res.remarks.vips_list, _tbody = '',arrActive = ['30+款付费插件','20+企业版专享功能','15+款付费插件']
			for (const key in vips_list) {
				var value = vips_list[key],activeIndex = arrActive.indexOf(key)
				_tbody += '<tr>\
          <td><span class="'+ (activeIndex !== -1 ? 'cursor-pointer' : '') +'">'+ key + (activeIndex !== -1 ? '<span class="down-icon ml10" data-idx="'+ activeIndex +'"></span>' : '') +'</span></td>\
          <td><i class="'+ (!value.pro ? 'error-icon' : 'success-icon') +'"></i></td>\
          <td><i class="'+ (!value.ltd ? 'error-icon' : 'success-icon') +'"></i></td>\
          <td><i class="'+ (!value.vltd ? 'error-icon' : 'success-icon') +'"></i></td>\
        </tr>'
			}
			bt_tools.open({
				title: false,
				area: ['970px', '700px'],
				btn: false,
				content: '<div class="privilege_contrast_title mt10">\
            <img src="/static/img/privilege_contrast_title.png" width="290px" alt="" />\
          </div>\
          <div class="privilege_contrast_box">\
            <table>\
              <thead>\
              <tr>\
                <th><div class="thCont">\<div class="titleType">功能特权</div></div></th>\
                <th>\
                  <div class="thCont">\
                    <div class="titleType"><span class="glyphicon icon-vipPro"></span>专业版</div>\
                    <span class="title_price">￥ 699/年</span>\
                    <button type="button" class="proBtn">立即升级</button>\
                  </div>\
                </th>\
                <th>\
                  <div class="thCont">\
                    <span class="recommend-icon"></span>\
                    <div class="titleType"><span class="glyphicon icon-vipLtd"></span>企业版</div>\
                    <span class="title_price">￥ 1399/年</span>\
                    <button type="button" class="ltdBtn">立即升级</button>\
                  </div>\
                </th>\
                <th>\
                  <div class="thCont">\
                    <div class="titleType"><span class="glyphicon icon-vipLtd"></span>企业运维托管</div>\
                    <span class="title_price">￥ 5999/年</span>\
                    <button type="button" class="opsBtn"><span>立即升级</span></button>\
                  </div>\
                </th>\
              </tr>\
            </thead></table>\
						<table><tbody>'+ _tbody +'</tbody></table>\
          </div>',
				success: function (layero,index) {
					$(layero).find('.down-icon').parent().unbind('click').click(function () {
						var _tr = $(this).parents('tr'),_idx = $(this).find('.down-icon').data('idx')
						var proList = ['Apache防火墙','Nginx防火墙','MySQL主从复制','网站防篡改程序','宝塔系统加固','文件同步工具','异常监控推送','宝塔负载均衡','堡塔APP','对象存储自动挂载','NFS文件共享管理器','宝塔任务管理器','网站监控报表','堡塔SSH二次认证','堡塔网站挂马检测'],
							ltdList = ['堡塔PHP安全防护','服务器安全扫描','堡塔企业级防篡改','堡塔防入侵','服务器网络加速','堡塔网站测速','堡塔限制访问型证书','文件监控','PHP网站安全告警','系统漏洞扫描','漏洞情报推送','堡塔站点优化','节点同步工具','堡塔运维平台','数据库运维工具','Java安全告警','IP精准数据包','面板多用户管理','堡塔资源监视器','堡塔硬盘分析工具']
						ltdList2 = ['漏洞扫描','网站配额容量','双向认证','流量限额','网站-防篡改','网站安全','站点防护','安全扫描','违规词检测','拨测告警','ftp容量配额','企业增量备份','二进制文件分析','敏感词检测','面板日报','系统防火墙归属地','ssh登录日志','安全检测','文件大小查看','百度云存储','阿里云oss','腾讯云cos','华为云存储','日志统计'],
							payList = ['Apache防火墙','Nginx防火墙','网站监控报表 ','文件同步工具','网站防篡改程序','宝塔系统加固','MySQL主从复制','宝塔任务管理器','堡塔APP','堡塔SSH二次认证','宝塔负载均衡','异常监控推送','对象存储自动挂载','NFS文件共享管理器'],
							_proHtml = '',_ltdHtml = '',_ltdList2Html = '',_payHtml = ''
						for (var i = 0; i < proList.length; i++) {
							_proHtml += '<div><code title="'+ proList[i] +'">'+ proList[i] +'</code></div>'
						}
						for (var i = 0; i < ltdList.length; i++) {
							_ltdHtml += '<div><code title="'+ ltdList[i] +'">'+ ltdList[i] +'</code></div>'
						}
						for (var i = 0; i < ltdList2.length; i++) {
							_ltdList2Html += '<div><code title="'+ ltdList2[i] +'">'+ ltdList2[i] +'</code></div>'
						}
						for (var i = 0; i < payList.length; i++) {
							_payHtml += '<div><code title="'+ payList[i] +'">'+ payList[i] +'</code></div>'
						}

						if($(this).hasClass('active')) {
							$(this).removeClass('active')
							$(this).css({'font-weight':'normal','color':'#666'})
							_tr.next().remove()
						}else {
							$(this).addClass('active')
							$(this).css({'font-weight':'bold','color':'#333'})
							var _html = ''
							switch (_idx) {
								case 0:
									_html = '<div class="flex">\
                    <div class="pluginCont two" style="width: 44%;"><div class="text-center"><img src="/static/img/privilege_contrast_title_pro.png" width="210px" /></div><div class="cont_box">'+ _proHtml +'</div></div>\
                    <div class="inlineBlock dividing-line" style="height: 136px;top: 36px;"></div>\
                    <div class="pluginCont two flex-1"><div class="text-center"><img src="/static/img/privilege_contrast_title_ltd.png" width="210px" /></div><div class="cont_box">'+ _ltdHtml +'</div></div>\
                  </div>'
									break;
								default:
									_html = '<div class="flex">\
                    <div class="pluginCont" style="width: 100%;"><div class="text-center"><img src="/static/img/privilege_contrast_title_'+ (_idx == 1 ? '20' : '15') +'.png" width="262px" /></div><div class="cont_box">'+ (_idx == 1 ? _ltdList2Html : _payHtml) +'</div></div>\
                  </div>'
									break;
							}
							_tr.after('<tr>\
                <td colspan="4" style="border-top: none;">'+ _html +'</td>\
              </tr>')
						}
					})
					$('.proBtn').click(function () {
						if($('.libPay-view').length){
							$('.libPay-menu-type.lib_pro').click();
						}else{
							that.product_pay_view({ totalNum: 55,limit: 'pro',pid: 100000011,is_coupon: false })
						}
						$('.libPay-menu-type.lib_ltd').click();
						layer.close(index);
					})
					$('.ltdBtn').click(function () {
						if($('.libPay-view').length){
							$('.libPay-menu-type.lib_ltd').click();
						}else{
							that.product_pay_view({ totalNum: 55,limit: 'ltd',pid: 100000032,is_coupon: false })
						}
						$('.libPay-menu-type.lib_ltd').click();
						layer.close(index);
					})
					$('.opsBtn').click(function () {
						if($('.libPay-view').length){
							$('.libPay-menu-type.lib_ops').click();
						}else{
							that.product_pay_view({ limit: 'ops',pid: 100000068,is_coupon: false })
						}
						layer.close(index);
					})
				}
			})

		})

	},
	show_pay_code: function (idx, couponId) {
		var that = this;
		var _data = $('.pay-radio-type').data('data'),
			_cycle = $('.pay-cycle-btns.active').data('data'),
			_obj = $('.libPay-content-box .pay-type-btn').eq(idx),
			_num = $('.btn_nums.active').data('data'),
			_isLtd = $('.libPay-menu-type.active').hasClass('lib_ops'),
			_product = $('.libPay-menu-type.active').data('data'),
			_coupon = $('.libPay-line-item.coupons').hasClass('active') && !$('.libPay-line-item.coupons').hasClass('disabled') ? $('.coupon_item').data('data') : ''

		if (!_data) return;
		var cash_fee = parseFloat(_data.data.cash_fee / 100),
			org_price = parseFloat(parseFloat(_cycle.sprice * _num).toFixed(2)),
			discount_amount = org_price - cash_fee;
		$('.libPaycode-foo-txt .libPayTotal').html('<span style="font-size:18px;margin-right:2px;">¥</span>' + parseFloat(_data.data.cash_fee / 100));
		var html = ''
		if(cash_fee>=1){
			html = '<span class="org_price">原价: ' + org_price + '元</span>'+ (_coupon ?'<span class="discount_amount">已使用优惠券，立减'+ parseFloat(_coupon.val2) +'元</span>' : '')
		}else {
			html = ''
		}
		$('.libPayCycle')
			.text((cash_fee < 1 ? '7天' : this.pro.conver_unit(_cycle.cycle)) + '/')
			.append('<i>' + _num + '台</i>'+html);
		if (cash_fee >= 6000 && idx === 0) {
			$('.libPay-content-box .pay-type-btn')
				.eq(0)
				.click(function () {
					layer.tips('支付金额已超过微信单笔支付额度,请使用支付宝支付', $('.pay-type-btn:eq(0)'), {
						tips: [1, 'red'],
						skin: 'wechat_pay_tips',
					});
					$('.layui-layer-tips').css({ left: $('.pay-type-btn:eq(0)').offset().left, top: $('.pay-type-btn:eq(0)').offset().top - 45 });
					return false;
				});
			$('.libPay-content-box .pay-type-btn').eq(1).click();
			return;
		}
		if (idx != 3 && idx != 2) {
			if (_isLtd) {
				$('.payment_results_tips').show();
				$('.payment_repeat_tips').show();
				$('.libPaycode-foo-txt').css('margin-top', '0');
			}
			$('.payment_repeat_tips').show();
			$('.payqcode-box,.pay-wx').show();
			$('.org_price').removeAttr('style');
		}
		$('.libBank-box').hide();
		$('.libBank-payment-box').hide();
		switch (idx) {
			//微信支付
			case 0:
				$('#PayQcode div:eq(0)').empty().qrcode(_data.msg);
				$('.payqcode-box span').removeClass('alipay').addClass('wechat');
				break;
			//支付宝支付
			case 1:
				$('#PayQcode div:eq(0)').empty().qrcode(_data.ali_msg);
				$('.payqcode-box span').removeClass('wechat').addClass('alipay');
				break;
			case 2: //余额支付
				$('.availableBalance').html(bt.soft.pub.availableBalance.toFixed(2));
				$('.libBank-payment-box').css({ display: 'inline-flex', width: '240px' });
				$('.payqcode-box,.pay-wx,.payment_results_tips').hide();
				$('.payment_repeat_tips').hide()
				$('.org_price').css('display', 'block');
				if(bt.soft.pub.availableBalance < cash_fee){
					$('.availableBalanceTip').removeClass('hide')
					$('.availableBalanceBtn').addClass('disabled');
				}else{
					$('.availableBalanceTip').addClass('hide')
					$('.availableBalanceBtn').removeClass('disabled');
				}
				$('.availableBalanceBtn').unbind('click').click(function(){
					if($(this).hasClass('disabled')) return layer.msg('余额不足，请先充值！');
					var params = {
						num: _num,
						cycle: _cycle.cycle,
						uid: _data.data.uid,
						pid: _data.data.pid,
					}
					var obj_data={
						_data:_data,
						_product:_product,
						_num:_num,
						cash_fee:cash_fee,
						_cycle:_cycle,
					}
					bt.send('get_last_paid_time','auth/get_last_paid_time',{
						pid:params.pid
					},function(t_data){
						if(t_data.res != 0 && t_data.res != '0'){
							var last_pay_time = t_data.res * 1000
							var now_time = new Date().getTime()
							var time = that.interval(last_pay_time,now_time)
							if(couponId) params['coupon'] = couponId;
							if(time<=30){
								var content_html = '<div class="repeat_pay_dialog">\
												<div class="repeat_pay_tips"><span class="pay_warning_icon"></span>\
														<div class="repeat_pay_tips_text"><span style="margin-bottom:5px;">检测到您30分钟内有重复支付订单的操作！</span>\
														<span>如遇到支付授权未生效的情况，请尝试刷新授权</span></div></div>\
													<hr>\
													<div style="margin-bottom:3px">\
														<div class="repeat_pay_links" style="margin-bottom:8px">\
															<span class="repeat_pay_links_refresh"></span>\
															<span class="btlink links_span links_refresh">点击刷新授权</span>\
														</div>\
														<div class="repeat_pay_links">\
															<span class="repeat_pay_links_service"></span>\
															<span class="btlink links_span" id="links_service">联系客服查询授权状态</span>\
														</div>\
													</div>\
													<div style="width:100%;position:relative;height:30px"><button class="btn btn-sm btn-success repeat_pay_button">仍要继续</button></div>\
												</div>'
								layer.open({
									type:1,
									title:false,
									btn:false,
									closeBtn:1,
									area:['390px','204px'],
									content:content_html,
									success:function(layero, index){
										var _this = this
										$(layero).find('.layui-layer-close2').addClass('layui-layer-close1').removeClass('layui-layer-close2');
										$('.repeat_pay_button').click(function(){
											layer.close(index)
											bt.confirm({msg:'您确定要使用余额支付吗？',title:'余额支付'},function(){that.product_buy_event(params,idx,obj_data)})
										})
										$('#links_service').click(function(){
											bt.onlineService();
										})
										$('.links_refresh').click(function(){
											layer.close(index)
											if(window.location.pathname!= '/soft') {
												soft.flush_cache()
											}else{
												soft.flush_cache()
												getPaymentStatus()
											}
										})
									}
								})
							}else{
								bt.confirm({msg:'您确定要使用余额支付吗？',title:'余额支付'},function(){that.product_buy_event(params,idx,obj_data)})
							}
						}else{
							bt.confirm({msg:'您确定要使用余额支付吗？',title:'余额支付'},function(){that.product_buy_event(params,idx,obj_data)})
						}
					})
				})
				break;
			case 3: //对公转账
				$('.libPaycode-foo-txt').css('margin-top', '10px');
				$('.libBank-box').css({ display: 'inline-block', width: '250px' });
				$('.payqcode-box,.pay-wx,.payment_results_tips').hide();
				$('.payment_repeat_tips').hide()
				$('.org_price').css('display', 'block');
				break;
		}
		_obj.addClass('active').siblings().removeClass('active');
	},
	pay_loading: {
		set: function (type) {
			var count = $('.libPay-loading').data(type);
			if (count) {
				count += 1;
			} else {
				count = 1;
			}
			$('.libPay-loading').data(type, count);
			return count;
		},
		get: function (type) {
			return $('.libPay-loading').data(type);
		},
		init: function (type) {
			$('.libPay-loading').data(type, 0);
		},
	},
	product_cache: {}, //产品周期缓存
	order_cache: {},
	// 获取产品周期 ，并进行对象缓存
	get_product_discount_cache: function (config, callback) {
		var that = this;
		// if (typeof this.product_cache[config.pid] != "undefined") {
		//   if (callback) callback(this.product_cache[config.pid]);
		// } else {
		$('.libVoucher-loading').show();
		that.pay_loading.set('start_price');

		bt.soft.pro.get_product_discount_by(config.pid, function (rdata) {
			if (that.pay_loading.set('end_price') == that.pay_loading.get('start_price')) {
				$('.libVoucher-loading').hide();
			}
			if (typeof rdata.status === 'boolean') {
				if (!rdata.status) return false;
			}
			that.product_cache[config.pid] = rdata;
			setTimeout(function () {
				delete that.product_cache[config.pid];
			}, 60000);
			if (callback) callback(rdata);
		});
		// }
	},
	product_buy_event:function(params,idx,obj){
		var that = this
		var loadT = bt.load('正在支付中，请稍后...');
		bt.send('create_with_credit_by_panel', 'auth/create_with_credit_by_panel', params, function (res) {
			loadT.close();
			if(res.success){
				that.product_pay_monitor({
					status: true,
					idx: idx,
					pid: obj._data.data.pid,
					wxoid: obj._data.data.wxoid,
					name: obj._product.name,
					title: obj._product.title,
					num: obj._num,
					cycle: obj.cash_fee < 1 ? '7天' : that.pro.conver_unit(obj._cycle.cycle),
					rlist: obj._product.rlist,
					username: $('.info_value').text()
				});
				soft.flush_cache();
			}else{
				layer.msg(res.res, {icon: 2});
			}
		})
	},
	// 支付状态监听
	product_pay_monitor: function (config) {
		var that = this;
		function callback(rdata) {
			if (rdata.status) {
				clearInterval(bt.soft.pub.wxpayTimeId);
				layer.closeAll();
				if (config.title === undefined) {
					var title = '';
					title = config.name + '插件支付成功！';
					setTimeout(function () {
						bt.set_cookie('force', 1);
						if (soft) soft.flush_cache();
						if (config.pid != 100000068 && config.pid != 100000012) location.reload(true);
					}, 2000); // 需要重服务端重新获取软件列表，并刷新软件管理浏览器页面
					bt.msg({
						msg: title,
						icon: 1,
						shade: [0.3, '#000'],
					});
				}else{
					var className = '',time_name = 'ltd'
					switch (config.pid) {
						case 100000032:
							className = 'ltd_success';
							break;
						case 100000068:
							className = 'ltd_success ops_success';
							time_name = 'ops'
							break;
						default:
							className = 'pro_success';
							time_name = 'pro'
							break;
					}
					if(location.href.indexOf('software') !== -1) getPaymentStatus();
					if(!$('.successful_purchase_popup').length) {
						that.get_soft_list(undefined,undefined,undefined,function (res) {
							var ltd = bt.get_cookie('ltd_end');
							bt.open({
								type: 1,
								title: false,
								area: ['692px', className === 'pro_success' ? '462px' : '535px'],
								closeBtn: 2,
								shadeClose: false,
								skin: 'successful_purchase_popup ' + className,
								content: '<div class="successful_purchase_title">\
											<div class="successful_purchase_suptitle">\
												<i class="success-title-icon"></i>\
												<span>恭喜您购买'+ config.title +'成功</span>\
											</div>\
											<div class="successful_purchase_subtitle">\
												<span>当前账号：'+config.username+'</span>\
												<div class="dividing_line"></div>\
												<span>'+ config.cycle+ config.num +'台</span>' +
									(ltd < 0 && time_name === 'ops' ? '' : '<div class="dividing_line"></div>\
												<span>'+ bt.format_data(res[(time_name === 'ops' ? 'ltd':time_name)],'yyyy-MM-dd') +'到期</span>') +
									'</div>'+
									(config.num > 1 ? '<div>本机默认授权1台，剩余'+ (config.num - 1) +'台以抵扣券的方式发放到当前账号，请切换至抵扣券查看</div>':'')
									+'</div>\
										<div class="successful_purchase_cont"></div>',
								success: function (layero, index) {
									var cont = $('.successful_purchase_cont')
									var cont_html = '';
									for (var i = 0; i < config.rlist.length; i++) {
										cont_html += '<div class="item">' + config.rlist[i] + '</div>';
									}
									cont.html(cont_html);
								},
								cancel: function (index, layero) {
									location.reload(true);
									window.parent.postMessage('closePlugin', '*')
									window.parent.postMessage('refreshMain', '*')
								}
							})
						})
					}
				}

				return
				clearInterval(bt.soft.pub.wxpayTimeId);
				layer.closeAll();
				var title = '';
				if (config.pid == 100000032 || config.pid === '') {
					title = config.pid === '' ? '专业版支付成功！' : '企业版支付成功！';
					getPaymentStatus();
				} else {
					title = config.name + '插件支付成功！';
				}
				setTimeout(function () {
					bt.set_cookie('force', 1);
					if (soft) soft.flush_cache();
					if (config.pid != 100000068 && config.pid != 100000012) location.reload(true);
				}, 2000); // 需要重服务端重新获取软件列表，并刷新软件管理浏览器页面
				if (config.pid === 100000068) {
					layer.open({
						type: 1,
						title: false,
						closeBtn: 2,
						shadeClose: false,
						area: '400px',
						content:
							'<div class="pay_status success">\
													<div class="icon layui-layer-ico"></div>\
													<div class="text">' +
							title +
							'</div>\
											</div>\
										<div class="enter_qrcode">\
										<img class="enterprise_wechat_qrcode" src="/static/img/enterprise_wechat.png">\
										<div>\
											<img class="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAATlJREFUSEvtVrFOw0AMfed8AxJsZWGAgQHBXP4DCQa+Ioou7g18BRIg9T/KDGJggIGFbiDxDXGQowSBuGvrFISEmtF+7/nis312RVEMiWgIoMT375aIjpj5KeJrTMy8JSJjAPsRzEhErl1Zlhd1XZ8kRKZEdMjM0xlBBiIyATCIYZxzl857X6uTiHaY+TElZrUz87aIPCjvI0gIwVmF5uG7H1gFmZepxv85XTdqCCEcLMQ0gLz3jbbTOm/rPdkLBt0v0E77xysq2it9T2nhuTzPN4ho10KyYEXkXvvkBcC6hWjEvmqQMwCnANZa8p1RJAbfa41vAM7/0cUzczOiZ43zvunrtPVOntuO3+wrluJ12qspvFBm/+bR+u03nhPrkKZk2ZVINUZO964sy44Ta9FSK5GuQ1VVXb0DLf+sHQ9tLL0AAAAASUVORK5CYII=">\
											<span>微信扫一扫，添加运维技术人员<span>\
										</div>\
									</div>',
						cancel: function () {
							location.reload(true);
						},
					});
					return false;
				}
				bt.msg({
					msg: title,
					icon: 1,
					shade: [0.3, '#000'],
				});
			}
		}
		clearInterval(bt.soft.pub.wxpayTimeId);
		if(config['idx']) {
			callback(config);
		} else{
			function intervalFun() {
				if (config.wxoid) {
					that.pro.get_wx_order_status(config.wxoid, callback);
				} else {
					that.pro.get_re_order_status(callback);
				}
			}
			intervalFun();
			bt.soft.pub.wxpayTimeId = setInterval(function () {
				intervalFun();
			}, 2500);
		}
	},

	updata_ltd: function (is_alone, num) {
		var param = {
			name: '宝塔面板企业版',
			pid: 100000032,
			limit: 'ltd',
		};
		if (typeof num !== 'undefined') {
			param['totalNum'] = num;
		}
		bt.set_cookie('pay_source', num);

		if (is_alone || false)
			$.extend(param, {
				source: 5,
				is_alone: true,
			});
		bt.soft.product_pay_view(param);
	},

	updata_pro: function (num) {
		var param = {
			name: '宝塔面板专业版',
			pid: 100000011,
			limit: 'pro',
		};
		if (num) param['totalNum'] = num;
		bt.set_cookie('pay_source', num);
		bt.soft.product_pay_view(param);
	},
	//遍历数组和对象
	each: function (obj, fn) {
		var key,
			that = this;
		if (typeof fn !== 'function') return that;
		obj = obj || [];
		if (obj.constructor === Object) {
			for (key in obj) {
				if (fn.call(obj[key], key, obj[key])) break;
			}
		} else {
			for (key = 0; key < obj.length; key++) {
				if (fn.call(obj[key], key, obj[key])) break;
			}
		}
		return that;
	},
	re_plugin_pay_other: function (pluginName, pid, type, price) {
		bt.pub.get_user_info(function (rdata) {
			if (!rdata.status) {
				bt.pub.bind_btname(0, function (rdata) {});
				return;
			}
			var txt = '购买';
			if (type) txt = '续费';
			var payhtml =
				'<div class="libPay otherDialogBox" style="padding:15px 30px 30px 30px">\
						<div class="warning_info mb10">\
							<p>温馨提示：第三方插件不支持更换IP，请确定使用的IP后再进行购买。</p>\
						</div>\
						<div class="libpay-con">\
							<div class="payment-con">\
								<div class="pay-weixin">\
									<div class="libPay-item f14 plr15">\
										<div class="li-tit c4">' +
				txt +
				'时长</div>\
										<div class="li-con c6" id="PayCycle"><ul class="pay-btn-group">\
																					<li class="pay-cycle-btn active" onclick="bt.soft.get_rscode_other(' +
				pid +
				',' +
				price +
				',1,' +
				type +
				')"><span>1个月</span></li>\
																					<li class="pay-cycle-btn" onclick="bt.soft.get_rscode_other(' +
				pid +
				',' +
				price +
				',3,' +
				type +
				')"><span>3个月</span></li>\
																					<li class="pay-cycle-btn" onclick="bt.soft.get_rscode_other(' +
				pid +
				',' +
				price +
				',6,' +
				type +
				')"><span>6个月</span></li>\
																					<li class="pay-cycle-btn" onclick="bt.soft.get_rscode_other(' +
				pid +
				',' +
				price +
				',12,' +
				type +
				')"><span>1年</span></li>\
																			</ul></div>\
									</div>\
									<div class="lib-price-box text-center"><span class="lib-price-name f14"><b>总计</b></span><span class="price-txt"><b class="sale-price"></b>元</span><s class="cost-price"></s></div>\
									<div class="paymethod">\
										<div class="pay-wx"></div>\
										<div class="pay-wx-info f16 text-center"><span class="wx-pay-ico mr5"></span>微信扫码支付</div>\
									</div>\
								</div>\
							</div>\
						</div>\
					</div>';

			layer.open({
				type: 1,
				title: txt + pluginName,
				area: ['616px', '490px'],
				closeBtn: 2,
				shadeClose: false,
				content: payhtml,
			});
			bt.soft.get_rscode_other(pid, price, 1, type);
			setTimeout(function () {
				$('.pay-btn-group > li')
					.unbind('click')
					.click(function () {
						$(this).addClass('active').siblings().removeClass('active');
					});
			}, 100);
		});
	},
	get_rscode_other: function (pid, price, cycle, type) {
		var loadT = layer.msg('正在获取支付信息...', {
			icon: 16,
			time: 0,
			shade: 0.3,
		});
		bt.send('create_plugin_other_order','auth/create_plugin_other_order',{pid: pid,cycle: cycle,type: type},function (rdata) {
				layer.close(loadT);
				if (!rdata.status) {
					layer.closeAll();
					layer.msg(rdata.msg, {
						icon: rdata.status ? 1 : 2,
					});
					return;
				}

				if (!rdata.msg.code) {
					layer.closeAll();
					layer.msg(rdata.msg, {
						icon: rdata.status ? 1 : 2,
					});
					soft.flush_cache();
					return;
				}
				$('.sale-price').text((price * cycle).toFixed(2));
				$('.pay-wx').html('');
				$('.pay-wx').qrcode(rdata.msg.code);
				$('.pay-wx').css({ display: 'flex', 'justify-content': 'center', 'margin-bottom': '10px' });
				$('.pay-wx canvas').css({ width: '175px', height: '175px', margin: '0', 'border-bottom-color': '#ddd' });
				bt.set_cookie('other_oid', rdata.msg.oid);
				bt.soft.get_order_stat(rdata.msg.oid, type);
			}
		);
	},
	get_order_stat: function (order_id, type) {
		if (bt.get_cookie('other_oid') != order_id) return;
		setTimeout(function () {
			bt.send('get_order_stat','auth/get_order_stat',{oid: order_id,type: type},function (stat) {
				if (stat == 1) {
					layer.closeAll();
					soft.flush_cache();
					return;
				}

				if ($('.pay-btn-group').length > 0) {
					bt.soft.get_order_stat(order_id, type);
				}
			});
		}, 1000);
	},
	get_index_list: function (callback) {
		bt.send('get_index_list', 'plugin/get_index_list', {}, function (rdata) {
			if (callback) callback(rdata);
		});
	},
	set_sort_index: function (data, callback) {
		var loading = bt.load();
		bt.send(
			'sort_index',
			'plugin/sort_index',
			{
				ssort: data,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	get_soft_list: function (p, type, search, callback,row) {
		if (p == undefined) p = 1;
		if (type == undefined) type = 0;
		if (search == undefined) search = '';
	var force = bt.soft_flush_cache || 0;
		if (row == undefined) row = 12;
		p = p + '';
		if (p.indexOf('not_load') == -1) {
			var loading = bt.load(lan['public'].the, 1);
		} else {
			var loading = null;
			p = p.split('not_load')[0];
		}

		bt.send(
			'get_soft_list',
			'plugin/get_soft_list',
			{
				p: p,
				type: type,
				tojs: 'soft.get_list',
				force: force,
				query: search,
				row:row,
			},
			function (rdata) {
				if (loading) loading.close();
				bt.soft.softList = rdata.list.data
				if(rdata.list.data.length%3 !== 0){
					$('.soft_card_page').css('justify-content','flex-start')
				}else{
					$('.soft_card_page').css('justify-content','space-between')
				}
				bt.set_cookie('force', 0);
				bt.set_cookie('ltd_end', rdata.ltd);
				bt.set_cookie('pro_end', rdata.pro);
				if (callback) callback(rdata);
			}
		);
	bt.soft_flush_cache = 0
	},
	/**
	 * @description 检测插件是否安装事件
	 * @param {String} obj.name 插件名称
	 * @param {number} obj.version 最低安装版本 可为空
	 * @param {number} obj.source 购买来源
	 * @param {Function} callback 回调函数 dataRes:插件信息，is_install:是否已安装
	 *  */
	detect_plugin_event: function (obj, callback) {
		bt.soft.get_soft_find(obj.name, function (dataRes) {
			bt.soft.softData = dataRes
			if(dataRes.setup && dataRes.endtime > 0) {//已安装未到期
				// 检测版本号是否满足最低版本要求
				if(obj.hasOwnProperty('version') && parseFloat(dataRes.version) >= parseFloat(obj.version)) {
					if(callback) callback(dataRes,true)
				}else{
					if(!obj.hasOwnProperty('version')) {// 无需判断版本号时，直接返回
						if(callback) callback(dataRes,true)
					}else{// 需要判断版本号时，更新插件版本
						bt.simple_confirm({title: '更新提示',msg: '当前版本过低，无法使用此功能，是否继续更新？'},function() {
							bt.soft.pubUpdataPlugin(dataRes,obj.version)
						})
					}
				}
			}else{
				if(obj.hasOwnProperty('check')){
					if(callback) callback(dataRes,false)
					return
				}
				if(dataRes.endtime > 0) {// 未安装未到期调用安装事件
					bt.soft.install(obj.name)
				}else {// 已到期调用支付界面
					product_recommend.pay_product_sign('ltd', obj.source, 'ltd')
				}
				if(callback) callback(dataRes,false)
			}
		})
	},
	/**
	 * @description 公共更新插件方法
	 * @param dataRes 插件详情
	 * @param minVersion 最低安装版本
	 */
	pubUpdataPlugin: function (dataRes,minVersion) {
		var length = dataRes.versions.filter(function (item) {return parseFloat(item.m_version + '.' + item.version) >= minVersion}).length
		if(length) {// 有可用版本时，更新插件列表
			pubUpdata(dataRes)
		}else{// 无可用版本时，更新插件列表
			bt_tools.send({url: '/plugin?action=get_soft_list',data: {p: 1,type: 0,tojs: '',force: 1}}, function (res_refresh) {
				bt.soft.get_soft_find(data_res.name, function (res1) {
					pubUpdata(res1)
				})
			})
		}
		function pubUpdata(data_res) {
			if (data_res.versions.length > 1) {
				for (var j = 0; j < data_res.versions.length; j++) {
					var min_version = data_res.versions[j]
					var ret = bt.check_version(data_res.version, min_version.m_version + '.' + min_version.version);
					if (ret > 0) {
						if (ret == 2) {
							bt.soft.update_soft(data_res.name, data_res.title, min_version.m_version, min_version.version, min_version.update_msg.replace(/\n/g, "_bt_"), data_res.type)
						}
						break;
					}
				}
			}else {
				var min_version = data_res.versions[0],
					is_beta = min_version.beta;
				var cloud_version = min_version.m_version + '.' + min_version.version;
				if (data_res.version != cloud_version && is_beta == data_res.is_beta) {
					bt.soft.update_soft(data_res.name, data_res.title, min_version.m_version, min_version.version, min_version.update_msg.replace(/\n/g, "_bt_"), data_res.type)
				}
			}
		}
	},
	to_index: function (name, callback) {
		var status = $('#index_' + name).prop('checked') ? '0' : '1';
		if (name.indexOf('php-') >= 0) {
			var verinfo = name.replace(/\./, '');
			status = $('#index_' + verinfo).prop('checked') ? '0' : '1';
		}
		if (status == 1) {
			bt.send(
				'add_index',
				'plugin/add_index',
				{
					sName: name,
				},
				function (rdata) {
					if(rdata.status) $('.index_' + name).prop('checked',true)
					rdata.time = 1000;
					if (!rdata.status) bt.msg(rdata);
					if (callback) callback(rdata);
				}
			);
		} else {
			bt.send(
				'remove_index',
				'plugin/remove_index',
				{
					sName: name,
				},
				function (rdata) {
					if(rdata.status) $('.index_' + name).prop('checked',false)
					rdata.time = 1000;
					if (!rdata.status) bt.msg(rdata);
					if (callback) callback(rdata);
				}
			);
		}
	},
	add_make_args: function (name, init) {
		name = bt.soft.get_name(name);
		pdata = {
			name: name,
			args_name: $("input[name='make_name']").val(),
			init: init,
			ps: $("input[name='make_ps']").val(),
			args: $("input[name='make_args']").val(),
		};
		if (pdata.args_name.length < 1 || pdata.args.length < 1) {
			layer.msg('自定义模块名称和参数不能为空!');
			return;
		}
		loadT = bt.load('正在添加自定义模块...');
		bt.send('add_make_args', 'plugin/add_make_args', pdata, function (rdata) {
			loadT.close();
			bt.msg(rdata);
			if (rdata.status) {
				bt.soft.loadOpen.close();
				bt.soft.get_make_args(name);
			}
		});
	},
	show_make_args: function (name) {
		name = bt.soft.get_name(name);
		var _aceEditor = '';
		bt.soft.loadOpen = bt.open({
			type: 1,
			title: '添加自定义选装模块',
			area: '500px',
			btn: [lan['public'].submit, lan['public'].close],
			content:
				'<div class="bt-form c6">\
					<from class="bt-form" id="outer_url_form" style="padding:30px 10px;display:inline-block;">\
						<div class="line">\
							<span class="tname">模块名称</span>\
							<div class="info-r">\
								<input name="make_name" class="bt-input-text mr5" type="text" placeholder="只能是字母、数字、下划线" style="width:350px" value="">\
							</div>\
						</div>\
						<div class="line">\
							<span class="tname">模块描述</span>\
							<div class="info-r">\
								<input name="make_ps" class="bt-input-text mr5" placeholder="30字以内的描述" type="text" style="width:350px" value="">\
							</div>\
						</div>\
						<div class="line">\
							<span class="tname">模块参数</span>\
							<div class="info-r">\
								<input name="make_args" class="bt-input-text mr5" type="text" placeholder="如：--add-module=/tmp/echo/echo-nginx-module-master" style="width:350px" value="">\
							</div>\
						</div>\
						<div class="line">\
							<span class="tname">前置脚本</span>\
							<div class="info-r">\
								<div id="preposition_shell" class="bt-input-text" style="height:300px;width:350px;font-size:11px;line-height:20px;"></div>\
							</div>\
						</div>\
					</from>\
				</div>',
			success: function (layer, index) {
				_aceEditor = ace.edit('preposition_shell', {
					theme: 'ace/theme/chrome', //主题
					mode: 'ace/mode/sh', // 语言类型
					wrap: true,
					showInvisibles: false,
					showPrintMargin: false,
					showFoldWidgets: false,
					useSoftTabs: true,
					tabSize: 2,
					readOnly: false,
				});
				_aceEditor.setValue('# 在编译前执行的shell脚本内容，通常为第三方模块的依赖安装和源码下载等前置准备');
			},
			yes: function () {
				bt.soft.add_make_args(name, _aceEditor.getValue());
			},
		});
	},
	modify_make_args: function (name, args_name) {
		name = bt.soft.get_name(name);
		var _aceEditor = '';
		bt.soft.loadOpen = bt.open({
			type: 1,
			title: '编辑自定义选装模块[' + name + ':' + args_name + ']',
			area: '500px',
			btn: [lan['public'].submit, lan['public'].close],
			content:
				'<div class="bt-form c6">\
					<from class="bt-form" id="outer_url_form" style="padding:30px 10px;display:inline-block;">\
						<div class="line">\
							<span class="tname">模块名称</span>\
							<div class="info-r">\
								<input name="make_name" class="bt-input-text mr5" type="text" placeholder="只能是字母、数字、下划线" style="width:350px" value="' +
				bt.soft.make_data[args_name].name +
				'">\
							</div>\
						</div>\
						<div class="line">\
							<span class="tname">模块描述</span>\
							<div class="info-r">\
								<input name="make_ps" class="bt-input-text mr5" placeholder="30字以内的描述" type="text" style="width:350px" value="' +
				bt.soft.make_data[args_name].ps +
				'">\
							</div>\
						</div>\
						<div class="line">\
							<span class="tname">模块参数</span>\
							<div class="info-r">\
								<input name="make_args" class="bt-input-text mr5" type="text" placeholder="如：--add-module=/tmp/echo/echo-nginx-module-master" style="width:350px" value="' +
				bt.soft.make_data[args_name].args +
				'">\
							</div>\
						</div>\
						<div class="line">\
							<span class="tname">前置脚本</span>\
							<div class="info-r">\
								<div id="preposition_shell" class="bt-input-text" style="height:300px;width:350px;font-size:11px;line-height:20px;"></div>\
							</div>\
						</div>\
					</from>\
				</div>',
			success: function (layer, index) {
				_aceEditor = ace.edit('preposition_shell', {
					theme: 'ace/theme/chrome', //主题
					mode: 'ace/mode/sh', // 语言类型
					wrap: true,
					showInvisibles: false,
					showPrintMargin: false,
					showFoldWidgets: false,
					useSoftTabs: true,
					tabSize: 2,
					readOnly: false,
				});
				_aceEditor.setValue(bt.soft.make_data[args_name].init);
			},
			yes: function () {
				bt.soft.add_make_args(name, _aceEditor.getValue());
			},
		});
	},
	set_make_args: function (_this, name, args_name) {
		name = bt.soft.get_name(name);
		if ($('.args_' + args_name)[0].checked) {
			bt.soft.make_config.push(args_name);
		} else {
			index = bt.soft.make_config.indexOf(args_name);
			if (index === -1) return;
			bt.soft.make_config.splice(index, 1);
		}
		index = bt.soft.make_config.indexOf('');
		if (index !== -1) bt.soft.make_config.splice(index, 1);
		bt.send(
			'set_make_args',
			'plugin/set_make_args',
			{
				name: name,
				args_names: bt.soft.make_config.join('\n'),
			},
			function (rdata) {
				if (!rdata.status) {
					bt.msg(rdata);
				}
			}
		);
	},
	del_make_args: function (name, args_name) {
		name = bt.soft.get_name(name);
		bt.confirm(
			{
				msg: '真的要删除[' + name + ':' + args_name + ']模块吗？',
				title: '删除[' + name + ':' + args_name + ']模块!',
			},
			function () {
				loadT = bt.load('正在删除模块[' + args_name + ']...');
				bt.send(
					'del_make_args',
					'plugin/del_make_args',
					{
						name: name,
						args_name: args_name,
					},
					function (rdata) {
						bt.msg(rdata);
						bt.soft.get_make_args(name);
					}
				);
			}
		);
	},
	get_make_args: function (name) {
		name = bt.soft.get_name(name);
		loadT = bt.load('正在获取可选模块...');
		bt.send(
			'get_make_args',
			'plugin/get_make_args',
			{
				name: name,
			},
			function (rdata) {
				loadT.close();
				var module_html = '';
				bt.soft.make_config = rdata.config.split('\n');
				bt.soft.make_data = {};
				for (var i = 0; i < rdata.args.length; i++) {
					bt.soft.make_data[rdata.args[i].name] = rdata.args[i];
					var checked_str = bt.soft.make_config.indexOf(rdata.args[i].name) == -1 ? '' : 'checked="checked"';
					module_html +=
						'<tr>\
										<td>\
											<input class="args_' +
						rdata.args[i].name +
						'" onclick="bt.soft.set_make_args(this,\'' +
						name +
						"','" +
						rdata.args[i].name +
						'\')" type="checkbox" ' +
						checked_str +
						' />\
										</td>\
										<td>' +
						rdata.args[i].name +
						'</td><td>' +
						rdata.args[i].ps +
						'</td>\
										<td>\
											<a onclick="bt.soft.modify_make_args(\'' +
						name +
						"','" +
						rdata.args[i].name +
						'\')" class="btlink">编辑</a>\
											| <a onclick="bt.soft.del_make_args(\'' +
						name +
						"','" +
						rdata.args[i].name +
						'\')" class="btlink">删除</a>\
										</td>\
									</tr>';
				}
				$('.modules_list').html(module_html);
			}
		);
	},
	check_make_is: function (name) {
		name = bt.soft.get_name(name);
		var shows = ['nginx', 'apache', 'mysql', 'php'];
		for (var i = 0; i < shows.length; i++) {
			if (name.indexOf(shows[i]) === 0) {
				return true;
			}
		}
		return false;
	},
	get_name: function (name) {
		if (name.indexOf('php-') === 0) {
			return 'php';
		}
		return name;
	},
	install: function (name, that) {

		var _this = this;
		if (bt.soft.is_install) {
			layer.msg('正在安装其他软件，请稍候操作！', { icon: 0 });
			return false;
		}
		_this.get_soft_find(name, function (rdata) {
			bt.soft.softData = rdata
			_this.install_logic_code(rdata, that,name);
		});
	},
	install_logic_code: function (rdata, that, name) {
		var _this = this;
		bt.soft.softData = rdata;
		if(typeof name === 'undefined') name = rdata.name;
		var arrs = ['apache', 'nginx', 'mysql'],
			html = '',
			config = {
				select_html: '',
				compile: false,
				phpVersion: '',
				size: false,
			};
		if ($.inArray(name, arrs) >= 0) {
			var select = '';
			if (rdata.versions.length > 1) {
				$.each(rdata.versions, function (index, item) {
					select += '<option data-index="' + index + '">' + name + item.m_version + '</option>';
				});
				html += '<select id="SelectVersion" class="SelectVersion bt-input-text">' + select + '</select>';
				config.select_html = html;
			} else {
				html += '<span>' + rdata.name + (rdata.name.indexOf('php-') > -1 ? '' : rdata.versions[0].m_version) + '</span>';
				config.phpVersion = rdata.name + (rdata.name.indexOf('php-') > -1 ? '' : rdata.versions[0].m_version);
			}
			config.compile = true;
			config.size = true;
			// _this.install_soft(rdata, that);
			_this.show_plugin_info(rdata, undefined, config);
		} else if (rdata.versions.length > 1) {
			var SelectVersion = '';
			for (var i = 0; i < rdata.versions.length; i++) {
				var item = rdata.versions[i];
				var beta = item.beta === 1 ? ' Beta' : ' Stable';
				SelectVersion += '<option  data-index="' + i + '">' + item.m_version + '.' + item.version + beta + '</option>';
			}
			html = "<select id='SelectVersion' class='bt-input-text SelectVersion'>" + SelectVersion + '</select>';
			// if(rdata.type == 5) {
			// 	config.size = true
			// }
			config.select_html = html;
			config.size = true;
			// _this.get_install_plugin(rdata)
			// _this.install_soft(rdata, that);
			_this.show_plugin_info(rdata, undefined, config);
		} else if (name.indexOf('php-') >= 0) {
			var select = '';
			$.each(rdata.other_php, function (index, item) {
				if(!item.status){
					select += '<option ' + (item.name == name ? 'selected' : '') + ' data-index="' + index + '" data-version="' + item.version + '">' + item.name + '</option>';
				}
			});
			html += '<select id="SelectVersion" class="bt-input-text SelectVersion">' + select + '</select>';
			config.select_html = html;
			config.compile = true;
			_this.show_plugin_info(rdata, undefined, config);
		} else {
			// config.size = true
			rdata['install_version'] = rdata.versions[0];
			_this.install_soft(rdata, that);
			// _this.show_plugin_info(rdata,undefined,config)
		}
	},
	is_loop_speed: true,
	is_install: false,

	/**
	 * @description 监听下载进度
	 * @param {object} param 参数
	 * @param {function} callback 回调函数
	 * @param {string} type 判断是否为第一次
	 */
	monitor_soft_download_speed: function (param, callback, type) {
		var that = this;
		if (!type) {
			layer.open({
				type: 1,
				title: false,
				area: '450px',
				btn: false,
				closeBtn: 0,
				skin: 'soft_download_speed',
				content:
					'<div class="message-list" style="padding: 12px 15px;">' +
					'<div class="mw-con">' +
					'<ul class="waiting-down-list">' +
					'<li>' +
					'<div class="down-filse-name">' +
					'<span class="fname" style="width:80%;" title="">正在下载' +
					param.name +
					' ' +
					param.version +
					'.' +
					param.min_version +
					'，请稍候...</span>' +
					'<span style="width: 20%;display: inline-block;vertical-align: top;text-align: right;" data-name="down_pre">0%</span></div>' +
					'<div class="down-progress">' +
					'<div class="done-progress" data-name="progress" style="width:0%"></div></div>' +
					'<div class="down-info"><span class="total-size" data-name="size">0 KB/0 KB</span><span  class="speed-size" data-name="speed">0K/s</span><span style="margin-left: 20px;" data-name="time">预计还要: -- 秒</span></div>' +
					'</li>' +
					'</ul>' +
					'</div>' +
					'</div>',
				success: function (layero, index) {
					that.monitor_soft_download_speed(param, callback, true);
				},
			});
		} else {
			that.get_soft_download_speed(param, function (res) {
				if ($('.soft_download_speed').length === 0) return false;
				if (res.down_pre) {
					$('[data-name="down_pre"]').text(res.down_pre + ' %');
					$('[data-name="size"]').text(bt.format_size(res.down_size) + ' / ' + bt.format_size(res.total_size));
					$('[data-name="speed"]').text(bt.format_size(res.sec_speed) + '/s');
					$('[data-name="time"]').text('预计还要:' + res.need_time + '秒');
					$('[data-name="progress"]').css({
						width: res.down_pre + '%',
					});
				}
				setTimeout(function () {
					that.monitor_soft_download_speed(param, callback, true);
				}, 1000);
			});
		}
	},
	/**
	 * @description 获取软件下载进度
	 * @param {function} callback 回调函数
	 */
	get_soft_download_speed: function (param, callback) {
		bt.send(
			'get_download_speed',
			'plugin/get_download_speed',
			{
				plugin_name: param.plugin_name,
			},
			function (res) {
				if (callback) callback(res);
			}
		);
	},
	//显示进度
	show_speed: function () {
		bt.send(
			'get_lines',
			'ajax/get_lines',
			{
				num: 10,
				filename: '/tmp/panelShell.pl',
			},
			function (rdata) {
				var msg_lines = rdata.msg.trim().split('\n');
				if (msg_lines[msg_lines.length - 1] === 'Successify') {
					layer.closeAll();
					if (typeof soft != 'undefined') {
						soft.get_list(bt.get_cookie('load_page') + 'not_load', bt.get_cookie('load_type'), bt.get_cookie('load_search'));
						// 		soft.get_list();
						setTimeout(function () {
							bt.msg({ status: true, msg: '安装成功！' });
						}, 500);
					}
					return false;
				}
				if ($('#install_show').length < 1) return;
				if (rdata.status === true) {
					$('#install_show').text(rdata.msg);
					$('#install_show').animate(
						{
							scrollTop: $('#install_show').prop('scrollHeight'),
						},
						400
					);
				}
				if (bt.soft.is_loop_speed) {
					setTimeout(function () {
						bt.soft.show_speed();
					}, 1000);
				}
			}
		);
	},
	loadT: null,
	//显示进度窗口
	show_speed_window: function (config, callback) {
		if (!config.soft)
			config['soft'] = {
				type: 10,
			};
		if (config.soft.type == 5) {
			//使用消息盒子安装
			if (callback) callback();
			return false;
		} else if (config.soft.type == 10 && !config.status) {
			//第三方安装, 非安装，仅下载安装脚本
			if (callback) callback();
			return false;
		}

		layer.closeAll();
		bt.soft.loadT = layer.open({
			title: config.title || '正在执行安装脚本，请稍候...',
			type: 1,
			closeBtn: false,
			maxmin: true,
			shade: false,
			skin: 'install_soft',
			area: ['500px', '300px'],
			content:
				"<pre style='width:500px;margin-bottom: 0px;height:100%;border-radius:0px; text-align: left;background-color: #000;color: #fff;white-space: pre-wrap;' id='install_show'>" +
				config.msg +
				'</pre>',
			success: function (layers, index) {
				$(config.event).removeAttr('onclick').html('正在安装');
				$('.layui-layer-max').hide();
				bt.soft.is_loop_speed = true;
				bt.soft.is_install = true;
				bt.soft.show_speed();
				if (callback) callback();
			},
			end: function () {
				bt.soft.is_install = false
				bt.soft.is_loop_speed = false
			},
			min: function (layero) {
				$('.layui-layer-max').show();
				setTimeout(function(){
					layero.css({
					left:'190px'
				})
			},50)
		},
			restore: function () {
				$('.layui-layer-max').hide();
			},
		});
	},
	/**
	 * @description 安装指定软件版本
	 * @param item
	 * @param version
	 * @param min_version
	 * @param type
	 * @param that
	 */
	install_soft: function (item, that, type) {
		//安装单版本
		if (!item.install_version) {
			if (typeof that == 'string') {
				item.install_version = {
					m_version: that,
					version: '',
				};
			} else {
				layer.msg('没有找到要安装的版本号!', { icon: 2, time: 5000 });
				return;
			}
		}
		var that = this,
			install_info = item.install_version,
			version = install_info.m_version,
			min_version = install_info.version;
		layer.closeAll();
		item.title = bt.replace_all(item.title, '-' + version, '');
		if(type){
			return bt.soft.install(item.name,that)
		}
		if(item.type === 10){
			// 第三方安装
			layer.confirm(item.type !== 5 ? lan.soft.lib_insatll_confirm.replace('{1}', item.title) : lan.get('install_confirm', [item.title, version]), { closeBtn: 2 }, function () {
				that.get_install_plugin(item);
			});
		}else if(item.type === 5 && item.versions.length < 2) {
			bt.soft.show_plugin_info(item,undefined,{})
		} else {
			that.get_install_plugin(item);
			if (item.type !== 5) {
				bt.soft.monitor_soft_download_speed({
					plugin_name: item.name,
					name: item.title,
					version: version,
					min_version: min_version,
				});
			}
		}
	},

	/**
	 * @description 获取安装插件
	 * @param
	 */

	get_install_plugin: function (item) {
		var plugin_info = bt.load('正在获取插件安装信息，请稍候<img src="/static/img/ing.gif" />');
		var fn = function () {
			bt.send(
				'install_plugin',
				'plugin/install_plugin',
				{
					sName: item.name,
					version: item.install_version.m_version,
					min_version: item.install_version.version,
					type: item.install_type == 0 ? 0:item.install_type == 1? item.install_type : undefined,
				},
				function (rdata) {
					plugin_info.close();
					if (rdata.install_opt) {
						bt.soft.show_plugin_info(rdata,undefined,{});
						return;
					}
					if (rdata.size) {
						bt.soft.install_other(rdata);
						return;
					}
					bt.pub.get_task_count(function (rdata) {
						if (rdata > 0 && item.type === 5) messagebox();
					});
					if (typeof soft != 'undefined') soft.get_list(bt.get_cookie('load_page') + 'not_load', bt.get_cookie('load_type'), bt.get_cookie('load_search'));
					if (!rdata.status) {
						layer.closeAll();
						layer.msg(rdata.msg,{icon:2,closeBtn:2,time:false})
						return
					}
					if (rdata.msg.indexOf('依赖以下软件') > -1) {
						bt.soft.show_plugin_info(item,undefined,{size:true})
					}
				}
			);
		};
		if (item.type === 10 && item.endtime === 0) {
			bt.send(
				'create_plugin_other_order',
				'auth/create_plugin_other_order',
				{
					pid: item.pid,
					cycle: 999,
					type: 0,
				},
				fn
			);
		} else {
			fn();
		}
	},

	/**
	 * 安装插件过程 - 1 显示插件安装信息
	 * @author hwliang<2021-06-23>
	 * @param {object} data
	 * @return void
	 */
	show_plugin_info: function (data, is_beta, config) {
		layer.closeAll();
		var loadT = null,type={},tab_arr = [],img_arr = [],title = '',that = this;
		var data_date = '暂无'
		if (typeof is_beta === 'undefined') is_beta = false;
		switch (data.install_opt) {
			case 'i':
				title = '安装';
				if (data.update) title = '更新';
				break;
			case 'u':
				title = '更新';
				break;
			case 'r':
				title = '修复';
				break;
			default:
				title = '安装'
		}
		$.ajaxSettings.async = false
		if(data.update || bt.soft.softData==undefined){
			this.get_soft_find(data.name,function(res){ set_data(res) })
		}else{
			set_data(bt.soft.softData)
		}
		function set_data (data1){
				type =  data1.type
			data.title =  data1.title
			if( data.versions.length){
					data.versions =  data1.versions
						data_date =  data1.versions[0].update_time?bt.format_data( data1.versions[0].update_time,'yyyy/MM/dd'):'暂无'
			}

			if( data1.introduction){
					var introduce_tab =  data1.introduction.split(';')
					for(var i = 0;i<introduce_tab.length;i++){
							tab_arr.push(introduce_tab[i].split('|')[0])
							if(data1.name.indexOf('php-')>-1){
								img_arr.push('https://www.bt.cn/Public/new/plugin/php/'+introduce_tab[i].split('|')[1])
							}else{
								img_arr.push('https://www.bt.cn/Public/new/plugin/'+data1.name+'/'+introduce_tab[i].split('|')[1])
							}
					}
			}
		}
		$.ajaxSettings.async = true
			var loadT = bt.load('正在获取插件版本信息，请稍候...');
		if (data === 'error') return false;
		bt.send(
			'get_plugin_upgrades',
			'plugin/get_plugin_upgrades',
			{
				plugin_name: data.name,
				show: 1,
			},
			function (rdata) {
				loadT.close();
				var info = {
					m_version:'',
					version:''
				};
				if (is_beta) {
					var last_info = rdata[rdata.length - 1];
					info = last_info.beta ? last_info : {};
				} else {
					info = rdata[0];
				}
				if (data.install_opt === 'i') {
					$.each(rdata, function (index, item) {
						var version = item.m_version + '.' + item.version;
						if (version === data.versions) info = item;
					});
				}
				var item_type = typeof type === 'number'?type:data.type
				var new_version = ''
				if(data.versions.length > 1 && data.version){
					var max_version_number = 0
					for (var i = 0; i < data.versions.length; i++) {
						var min_version = data.versions[i]
						if(data.name == 'mysql'){
							var ret = bt.check_version(data.version, min_version.m_version + '.' + min_version.version);
							if (ret > 0) {
								if (ret == 2) new_version = min_version.m_version+'.'+min_version.version
								break;
							}
						}else if(data.name === 'nginx'){
							var versionArr = data.version.split('.');
							versionArr.pop();
							var versionWithoutLast = versionArr.join('.');
							if(min_version.m_version === versionWithoutLast){
								new_version = min_version.m_version + '.' + min_version.version
							}
						}else{
							if(min_version.m_version.substr(0,1) > max_version_number){
								max_version_number = min_version.m_version.substr(0,1)
								new_version = min_version.m_version + '.' + min_version.version
							}
						}
					}
				}else{
					var min_version = data.versions[0]
					new_version = min_version.m_version + '.' + min_version.version
				}

				var dependnet_flag = !data.dependnet.need && !data.dependnet.selected
				if($.isArray(data.dependnet.need)){
					dependnet_flag = !data.dependnet.need.length && !data.dependnet.selected.length
				}
				layer.open({
					type: 1,
					area: '630px',
					title: false,
					closeBtn: 2,
					shift: 5,
					shadeClose: false,
					zIndex: 1989101,
					content:
						'<style>\
												.btn-content{text-align: center;margin-top: 25px;}\
												.checkbox-btn{cursor: pointer}\
												.item_list{margin-left:150px;border-left:5px solid #e1e1e1;position:relative;padding:5px 0 0 2px}\
												.item_list:first-child .index_acive::before{content: "";display: inline-block;position: absolute;top: -22px;left: 5px;height: 22px;width: 5px;background: #fff;z-index: 998}\
												.index_title{border-bottom:1px solid #ececec;margin-bottom:5px;font-size:12px;color:#20a53a;padding: 7px 0 5px 15px;margin-top:7px;margin-left:5px;}\
												.index_conter{line-height:25px;font-size:12px;min-height:40px;padding-left:20px;color:#888}\
												.index_date{position:absolute;left:-140px;top:20px;font-size:12px;color:#333}\
												.index_acive{width:15px;height:15px;background-color:#20a53a;display:block;border-radius:50%;position:absolute;left:-10px;top:21px;z-index: 999}\
												.index_acive::after{position:relative;display:block;content:"";height:5px;width:5px;display:block;border-radius:50%;background-color:#fff;top:5px;left:5px}\
												.bt-form-conter> span{text-align: center;width: 100%;display: inline-block;padding: 15px;font-size: 16px;}\
												.ignoreVersion:hover{background: #d4d4d4;color: #999;}\
										</style>\
										<div class="bt-form c7 install-three-plugin">\
										<div class="plugin_'+(title === '更新'?"update":"install")+'_back"></div>\
												<div class="install-header-title" style="min-height: 100px;">\
													<div class="install-tips">\
														<img style="height:40px;margin-top: 6px;" alt="" src="/static/img/soft_ico/ico-' + (data.name.indexOf('php-') >= 0?'php':data.name) + '.png">\
															<div class="plugin-title" style="'+((type == 5 && title != '更新')?'margin-top: 11px;':'')+'">\
																<div class="plugin-title-text"><span>'+ data.title +'</span><div class="plugin-tag">\
																	<div style="border:1px solid #E1E1E1;color:#9a9a9a;" class="plugin-tag-item '+ ( item_type === 7?'':'hide') +'"><span>免费</span></div>\
																	<div style="border:1px solid #F9EE9E;color:#FFC82F;" class="plugin-tag-item '+ ( item_type === 8?'':'hide') +'"><span>专</span></div>\
																	<div style="border:1px solid #E8D6B3;color:#A3782F;" class="plugin-tag-item '+ ( item_type === 12?'':'hide') +'"><span>企</span></div>\
																</div>\</div>\
																<div class="item '+(type==5?'hide':'')+'">\
																	<span>更新时间：</span>\
																	<span class="data_date">'+data_date+'</span>'+(title == '更新'?'':'<span class="c9" style="margin:0 20px">|</span><span class="btlink history_version" style="font-weight: normal;">更新日志</span>')+'\
																</div>\
																	<div class="version_message">\
																	<span class="'+( title == '更新'?'':'hide')+'" style="font-weight:normal;">最新版本：<span class="isNewBeta">'+(is_beta?'测试版'+info.m_version+'.'+info.version:new_version)+'</span></span>\
																	<span class="'+((config && !config['select_html'] && bt.soft.softData.setup)?'':'hide')+'" style="font-weight:normal;'+ (title == '更新'?'margin-left:16px;':'') +'">当前版本：'+ data.version +'</span>\
																	</div>\
															</div>\
													</div>\
													<div style="display: flex;align-items: center;">\
														<div class="'+(config && config['select_html']?'':'hide')+' version_select">'+ (config && config['select_html']?config.select_html:'') +'</div>\
														<button type="button" title="耗时20-120分钟，稳定性更好" class="btn btn-default compile_install_button '+(config && config['compile']?'':'hide')+'" '+(data.dependnet.length?'disabled':'')+' data-index="0">编译安装</button>\
														<button type="button" title="'+ ((config && type == 5 && title != '更新')?'耗时1-5分钟，适用于快速上线':"") +'" class="btn btn-success  '+($.isEmptyObject(data.dependnet)|| dependnet_flag?'install_plugin_button':'install_enviroment')+'"  style="display: flex;align-items: center;" data-index="1"><span class="update_plugin_button_icon" style="display:'+(title === "更新"?'':'none')+'"></span>'+((config && type == 5 && title != '更新')?'极速安装':"立即"+title)+'</button>\
														'+ (title === '更新' ? '<button type="button" class="btn btn-default ignoreVersion" style="position: absolute;margin-top: 100px;line-height: 23px;width: 104px;">忽略此版本</button>':'') +'\
													</div>\
												</div>\
												<hr>\
												<div class="plugin-img-introduce '+(img_arr.length?'':'hide') +'">\
													<div class="global-set-left">\
														<ul class="global-set-tab">'+
														(function(){
																var tab_html = ''
																for(var tab_item in tab_arr){
																	if(tab_arr[tab_item] == '') continue;
																	tab_html += '<li data-index="'+tab_item+'">'+tab_arr[tab_item]+'</li>'
																}
																return tab_html
														})()
														+'</ul>\
													</div>\
													<div class="global-set-right" title="点击放大查看" style="cursor:pointer">\
															<img src="/static/images/bt_logo_new.png" style="width:400px;max-height:100%">\
													</div>\
												</div>\
												<div class="plugin-detail">\
													<div class="plugin-info-title '+(title == '更新'?'hide':'')+'">插件说明：</div>\
													<div class="plugin-info-content '+(title == '更新'?'hide':'')+'">' +data.ps +'</div>\
													<div class="plugin-info-title '+(title == '更新'?'':'hide')+'">更新日志：</div>\
													<div class="plugin-info-content '+(title == '更新'?'':'hide')+'">' + (data.update_msg?data.update_msg:'暂无内容') +'</div>\
												</div>\
												<div class="divtable bt_table mtb20 hide" style="padding: 0 45px;">\
														<table class="table table-hover ' +(type==5?'hide':(JSON.stringify(data.dependnet) === '{}' ? 'hide' : '')) +'">\
																<thead><tr><th>依赖软件</th><th>安装状态</th><th style="text-align: right;">操作</th></tr></thead>\
																<tbody>' +
						(function () {
							var html = '';
							for (var dataKey in data.dependnet) {
								var item = data.dependnet[dataKey];
								html +=
									'<tr><td>' +
									dataKey +
									'</td><td>' +
									(item
										? '<span style="color:#20a532"><span class="glyphicon glyphicon-ok mr5"></span><span>已安装</span></span>'
										: '<span style="color:#FF9C00"><span class="glyphicon glyphicon-remove mr5"></span><span>未安装</span></span>') +
									'</td><td style="text-align: right;">' +
									(item ? '--' : '<a href="javascript:;" class="btlink">立即安装</a>') +
									'</td><tr>';
							}
							return html;
						})() +
						'</tbody></table>' +
						(false
							? '<div style="margin: 15px 5px">' +
								'<div class="checkbox-btn"><i class="cust—checkbox cursor-pointer checkbox-btn-safety mr10"></i><span style="font-weight: 500;color:red">当前操作存在安全风险，请点击进行二次确认后，继续操作？</span></div></div>'
							: '') +
						'</div>\
										<ul class="help-info-text c6 plugin-helper" style="z-index:9999;position:relative;">\
												<li class="'+(config?'hide':'')+'"><span>插件来源【' +data.author +'】，网址 <a href="' +data.home +'" target="_blank" class="btlink" style="text-decoration: revert;">' +data.home +
												'</a></span></li>\
												<li><span>如果已存在此插件，文件将被替换！</span></li>\
												<li  class="' +
						(JSON.stringify(data.dependnet) === '{}' ? 'hide' : '') +
						'"><span style="color:red">请手动安装插件依赖环境，如果未安装，将无法正常使用该插件</span></li>\
												<li class="' +
						(data.update && data.name === 'mysql' ? '' : 'hide') +
						'"><span style="color:red">更新数据库有风险,建议在更新前,先备份您的数据库！</span></li>\
												<li class="' +
						(!data.update ? 'hide' : '') +
						'"><span style="color:red">更新过程可能会导致服务中断,请须知</span></li>\
												<li class="' +
						(!data.update ? 'hide' : '') +
						'"><span style="color:red">建议您在服务器负载闲时进行软件更新</span></li></li>\
												<li class="' +
						(data.update ? 'hide' : '') +
						'"><span>安装过程可能需要几分钟时间，请耐心等候!</span></li>\
										</ul>\
								</div>',
					success: function (layers, indexs) {
							var _this = this
							// 忽略此版本
			$('.ignoreVersion').unbind('click').click(function () {
				bt_tools.send({url: 'plugin?action=set_plugin_ignore',data: {plugin_name: data.name,plugin_version: is_beta ?info.m_version+'.'+info.version:new_version}},function (res) {
				bt_tools.msg(res)
				layer.close(indexs)
				setTimeout(function () {
					// 刷新页面
					bt.refreshMain(window.location.origin + '/soft')
				})
				},'忽略此版本')
			})
							$('.plugin-img-introduce .global-set-tab').children().eq(0).addClass('on')
							$('.plugin-img-introduce .global-set-right img').attr('src',img_arr[0])
								$('.global-set-left').unbind('click').on('click', '.global-set-tab li', function () {
										$(this).addClass('on').siblings().removeClass('on');
										$('.global-set-right img').attr('src',img_arr[$(this).index()])
							})
							// 图片悬浮显示遮罩点击全屏
							$('.plugin-img-introduce .global-set-right').click(function(){
								layer.open({
									type: 1,
									closeBtn: 2,
									skin:'img-full',
									area:['1000px','800px'],
									content: '<div class="plugin-introduce-content">\
										<div class="btns">\
											<a href="javascript:;" class="leftbtn" style="float: left; margin-left: 30px;"></a>\
											<a href="javascript:;" class="rightbtn" style="float: right; margin-right: 30px;"></a>\
										</div>\
										<div class="plugin-introduce-view">'+$('.plugin-img-introduce .global-set-right').html()+'</div></div>',
									btn:false,
									title:false,
									success:function(indexs){
										$('.img-full img').css({'width':'100%','height':'100%'})
										// 轮播图经过事件
										$('.plugin-introduce-content').hover(function(){
											$('.img-full .btns').css('display','block')
										},function(){
											$('.img-full .btns').css('display','none')
										})
										// 获取轮播图数量
										var pSwiperL = $('.global-set-tab li').length
										// 获取当前图片位置,轮播图左右点击事件
										var index = $('.plugin-introduce-view img').attr('src').split('/')
										index = index[index.length-1].split('.')[0]
										$('.img-full .leftbtn').click(function(){
											index--
											if(index == 0){
												index = pSwiperL
											}
											img_path_event(index)
										})
										$('.img-full .rightbtn').click(function(){
											index++
											if(index-1 == pSwiperL){
												index = 1
											}
											img_path_event(index)
										})
										// 切换图片路径
										function img_path_event(index){
											// 获取当前图片路径,用/分期,将最后一个元素替换成[index].png
											var img_path = $('.plugin-introduce-view img').attr('src').split('/')
											img_path[img_path.length-1] = index+'.png'
											$('.plugin-introduce-view img').attr('src',img_path.join('/'))
										}
										// 防止全局键盘事件重复绑定,监听键盘左右键,执行对应的切换操作
										$(document).unbind('keydown').keydown(function(event){
											if(event.keyCode == 37){
												$('.img-full .leftbtn').click()
											}else if(event.keyCode == 39){
												$('.img-full .rightbtn').click()
											}
										})
									}
								})
							})
						$('.history_version').on('click', function () {
							var load = bt.load('正在获取历史版本，请稍候...');
							bt.send(
								'get_plugin_upgrades',
								'plugin/get_plugin_upgrades',
								{
									plugin_name: data.name,
								},
								function (res) {
									load.close();
									var _html_history = '<div class="bt-form-conter pd20">' +
											'<div class="item_box" style="height:315px;overflow: auto;">' +
											(function () {
												var html = '';
												for (var i = 0; i < res.length; i++) {
													var item = res[i];
													html +=
														'<div class="item_list">' +
														'<span class="index_acive"></span>' +
														'<div class="index_date">' +
														bt.format_data(item.update_time) +
														'</div>' +
														'<div class="index_title">' +
														data.title +
														item.m_version +
														'.' +
														item.version +
														'- ' +
														(item.beta ? '测试版' : '正式版') +
														'</div>' +
														'<div class="index_conter">' +
														(item.update_msg.replace(/\n/g, '</br>') || '无') +
														'</div>' +
														'</div>';
												}
												return html;
											})() +
											'</div>' +
											'</div>'
									if(!res.length){
											_html_history = '<div style="padding:20px;width:100%;height:100%;display:flex;justify-content:center;align-items:center;padding-bottom:20px">暂无版本数据</div>'
									}
									layer.open({
										type: 1,
										area: ['520px', '400px'],
										title: data.title + ' -更新日志',
										closeBtn: 2,
										shift: 5,
										shadeClose: false,
										zIndex: 1989101,
										content:_html_history
									});
								}
							);
						});
						$('.install_plugin_button').on('click', function () {
							var _this = this;
							layer.closeAll();
								var setup_name = bt.get_cookie('is_install'),flag = true
								if(setup_name){
										var service = ['openlitespeed','nginx','apache']
										$.ajaxSettings.async = false;
										get_realtime_tasks(function(res){
										var reg = /\[(.*)\]/
										if(res.task){
											for(var t = 0;t<res.task.length;t++){
												var match = res.task[t].name.match(reg)
												var match_name = match[1].split('-')
												if($.inArray(data.name,service) > -1 && $.inArray(match_name[0],service) > -1){
													flag = false
													return layer.msg('存在同类型的环境正在安装，请删除重试！',{icon:2})
												}
												if(match[1] === data.name || match_name[0] === data.name){
													flag = false
													return layer.msg('当前插件正在安装，请稍后重试！',{icon:2})
												}
											}
										}
										})
										$.ajaxSettings.async = true;
								}
								if(!flag) return
								if($('.isNewBeta').text().includes('测试版')){
											bt.soft.input_package(data.name, data.tmp_path, data);
								}
							if(config && type == 5 && title != '更新'){
								data.install_type = Number($(_this).data('index'));
								if (data.versions.length > 1) {
									var index = $('.SelectVersion option:selected').attr('data-index');
									data['install_version'] = data.versions[index];
									bt.soft.install_soft(data, that);
								} else {
									data['install_version'] = data.versions[0];
									bt.soft.get_install_plugin(data);
								}
							}else if(type == 5 && data.name.indexOf("php-")>-1){
								bt.soft.show_speed_window(
									{
										title: '正在更新,请稍候...',
										status: true,
										soft: {
											type: parseInt(type),
										},
									},
									function () {
										bt.send(
											'install_plugin',
											'plugin/install_plugin',
											{
												sName: data.name,
												version: data.versions[0].m_version,
												min_version: data.versions[0].version,
												upgrade: data.versions[0].m_version,
											},
											function (rdata) {
													if(!rdata.status){
															layer.closeAll()
															layer.msg(rdata.msg,{icon:2,closeBtn:2,time:false})
															return
													}
												if (rdata.install_opt) {
													_this.show_plugin_info(
														$.extend(true, {}, rdata, {
															update: true,
														})
													);
													return;
												}
												if (rdata.size) {
													_this.install_other(rdata);
													return;
												}
												layer.close(bt.soft.loadT);
												bt.pub.get_task_count(function (rdata) {
														messagebox();
												});
												if (typeof soft != 'undefined') soft.get_list(bt.get_cookie('load_page') + 'not_load', bt.get_cookie('load_type'), bt.get_cookie('load_search'));
												bt.msg(rdata);
											}
										);
											layer.close(indexs)
									}
								);
							}else{
								if (parseInt(data.type) === 11 || data.update) {
									bt.show_confirm(
										'安全验证',
										'<span style="color:red">' +
											(data.author === '宝塔' ? '更新过程可能会导致服务中断,是否继续升级？<br>建议您在服务器负载闲时进行软件更新。' : '安装第三方插件存在一定的安全风险，是否继续安装？') +
											'</span>',
										function () {
											bt.soft.input_package(data.name, data.tmp_path, data);
										}
									);
									return false;
								}
								var index = $('.SelectVersion option:selected').attr('data-index');
								data['install_version'] = data.versions[index];
								if(index){
									if(!data.tmp_path){
										bt.send(
											'install_plugin',
											'plugin/install_plugin',
											{
												sName: data.name,
												version: data.install_version.m_version,
												min_version: data.install_version.version,
												type: data.install_type,
											},
											function (rdata) {
												if(rdata.msg && !rdata.status){
													layer.closeAll();
													layer.msg(rdata.msg,{icon:2,closeBtn:2,time:false})
													return
												}
													bt.soft.input_package(rdata.name, rdata.tmp_path, rdata);
											})
									}else{
										bt.soft.input_package(data.name, data.tmp_path, data);
									}
								}else{
									if (data.versions.length > 1 && data.version) {
										if(data.name == 'mysql'){
											for (var i = 0; i < data.versions.length; i++) {
												var min_version = data.versions[i]
												var ret = bt.check_version(data.version, min_version.m_version + '.' + min_version.version);
												if (ret > 0) {
													if (ret == 2) {
														bt.soft.show_speed_window(
															{
																title: '正在更新到[' + data.title + '-' + min_version.m_version + '.' + min_version.version + '],请稍候...',
																status: true,
																soft: {
																	type: parseInt(data.type),
																},
															},
															function () {
																bt.set_cookie('softType', data.type);
																bt.soft.update_soft_request(data.name,data.title,min_version.m_version,min_version.version);
															}
														);
													}
													break;
												}
											}
											return
										}
										var parts = new_version.split('.');
										var majorVersion = parts[0] + '.' + parts[1];
										var minorVersion = parts[2];
										bt.soft.show_speed_window(
											{
												title: '正在更新到[' + data.title + '-' + new_version +'],请稍候...',
												status: true,
												soft: {
													type: parseInt(data.type),
												},
											},
											function () {
												bt.set_cookie('softType', data.type);
												bt.soft.update_soft_request(data.name,data.title,majorVersion,minorVersion);
											}
										);
									} else {
										if(title != '更新'){
											bt.soft.input_package(data.name, data.tmp_path, data);
											return
										}
										var min_version = data.versions[0],
												is_beta = min_version.beta?min_version.beta:false;
										var cloud_version = min_version.m_version + '.' + min_version.version;
										if (data.version != cloud_version && is_beta == data.is_beta) {
											bt.soft.show_speed_window(
												{
													title: '正在更新到[' + data.title + '-' + min_version.m_version + '.' + min_version.version + '],请稍候...',
													status: true,
													soft: {
														type: parseInt(data.type),
													},
												},
												function () {
													bt.set_cookie('softType', data.type);
													bt.soft.update_soft_request(data.name,data.title,min_version.m_version,min_version.version);
												}
											);
										};
									}
								}
							}
						})
						$('.compile_install_button').on('click',function(){
							// 编译安装
							bt.open({
								type: 1,
								title: name + lan.soft.install_title,
								area: '400px',
								btn: ['提交并安装', lan['public'].close],
								content:
									"<div class='bt-form pd20 c6'>\
									<div class='install_modules'>\
										<div style='margin-bottom:15px;'><button onclick=\"bt.soft.show_make_args('" +
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
								yes: function (indexs, layers) {
									$('.install_plugin_button').data({ index: 0 }).click()
								},
								end:function(){
									$('.install_plugin_button').data({ index: 1 })
								}
							});
						})
						$('.SelectVersion').unbind('change').change(function(){
								var index = $('.SelectVersion option:selected').attr('data-index');
								if(data.name.indexOf('php-')>-1){
										that.install($(this).val(),that)
								}else{
									if(data.versions[index].update_time){
										data_date = bt.format_data(data.versions[index].update_time,'yyyy/MM/dd')
										$('.data_date').text(data_date)
									}
								}
						})
						$('.install_enviroment').click(function(){
							var _html_need= '',_html_selected = '',_selected_item = '',_html = ''
							if(data.dependnet.need.length) _html_need = '<span>缺少必要依赖</span>'+ data.dependnet.need.join('、')+'，是否安装？'
							if(data.dependnet.selected.length){
								for(var i=0;i<data.dependnet.selected.length;i++){
									for(var j = 0;j<data.dependnet.selected[i].length;j++){
										var item = data.dependnet.selected[i][j]
										_selected_item += '<input type="radio" name="sex" value="'+item+'"><span style="margin: 0 6px;">'+item+'</span>'
									}
									_html += '<div class="selected_group">'+_selected_item+'</div>'
								}
								_html_selected = '<span>缺少选装依赖,请选择安装</span><div>'+_html+'</div>'
							}
								layer.open({
										title:'【'+data.title+'】安装环境缺失',
										closeBtn:2,
										area:['420px'],
										btn:['立即安装','取消'],
										content:'<div class="bt-form hint_confirm"><div class="hint_title"><i class="hint-confirm-icon"></i><div class="hint_con select-form">检测到当前插件'+_html_need +_html_selected+'</div>        </div>      </div>',
										yes:function(){
											// 存在必须选择项
											if(data.dependnet.need.length){
													for(var k = 0;k<data.dependnet.need.length;k++){
															that.get_soft_find(data.dependnet.need[k],function(res){
																res['install_version'] = data.versions[0];
																bt.soft.install_soft(res, that,true);
														})
													}
											}
											// 存在选择项
											if(data.dependnet.selected.length){
												if(!$('.select-form input[type="radio"]:checked').attr('value')) return bt.msg({status:false,msg:'请选择安装项'})
												for(var s = 0;s<data.dependnet.selected.length;s++){
													that.get_soft_find($('.select-form input[type="radio"]:checked').attr('value'),function(res){
														res['install_version'] = res.versions[0];
															bt.soft.install_soft(res,that,true);
													})
												}
											}
										}
								})
						})

					},
					cancel: function () {
						bt.send(
							'close_install',
							'plugin/close_install',
							{
								plugin_name: data.name,
							},
							function (rdata) {
							}
						);
					},
				});
			}
		);
		if (data.force_message !== '' && typeof data.force_message != 'undefined') {
			layer.open({
				type: 1,
				area: '400px',
				title: '提示内容',
				closeBtn: false,
				shift: 5,
				btn: ['确认', '取消'],
				content:
					'<div class="bt-form webDelete pd20">' +
					'<p style="font-size:13px;word-break: break-all;margin-bottom: 15px;padding:5px;"><span style="color:red;font-size:14px;">' +
					data.force_message +
					'</span></p>' +
					'<div class="vcode" style="padding: 4px 50px;height: auto;line-height: 40px;">计算结果：<span class="text"></span>=<input type="number" id="vsResult" value="" style="height: 30px;padding-left: 10px;width: 60px;border: 1px solid #888;border-radius: 2px;outline: none;"></div>' +
					'</div>',
				success: function (layers, indexs) {
					var num1 = bt.get_random_num(1, 9),
						num2 = bt.get_random_num(1, 9),
						vsResult = $('#vsResult');
					if (num1 === num2) num2 = num1 + 1;
					$('.vcode .text').text(num1 + ' + ' + num2);
					vsResult.data('value', num1 + num2);
					vsResult.on('keyup', function (event) {
						if (event.keyCode === 13) {
							var data = $(this).data();
							if (parseInt($(this).val()) !== data.value) {
								layer.msg('计算结果错误，请重新计算！', {
									icon: 2,
								});
							} else {
								layer.close(indexs);
							}
						}
					});
				},
				yes: function (indexs) {
					var $vcode = $('#vsResult'),
						data = $vcode.data();
					if (parseInt($vcode.val()) !== data.value) {
						layer.msg('计算结果错误，请重新计算！', {
							icon: 2,
						});
					} else {
						layer.close(indexs);
					}
				},
				btn2: function (indexs) {
					layer.closeAll();
				},
			});
		}
	},
	/**
	 * @description 插件管理
	 */
	plugin_toolbox_info: function (name, title, version, is_beta, index) {
		var loadT = bt.load('获取插件信息，请稍候...');
		bt.soft.softData = bt.soft.softList[index]
		if (!name) return;
		bt.send(
			'get_plugin_upgrades',
			'plugin/get_plugin_upgrades',
			{
				plugin_name: name,
				show: 1,
			},
			function (rdata) {
				loadT.close();
				var info = {},
					beta = {},
					tls = {};
				var last_info = rdata[rdata.length - 1];
				beta = last_info.beta ? last_info : {};
				tls = rdata[0];
				info = is_beta ? beta : tls;
				if (!info) {
					var versions = version.split[0];
					info = {
						beta: 2,
						m_version: version.split[0],
						update_msg: 0,
						update_time: 0,
						version: version.split[1],
					};
				}
				layer.open({
					type: 1,
					area: ['500px'],
					title: title + 'v' + version + '-修复插件',
					closeBtn: 2,
					shift: 5,
					shadeClose: false,
					btn: false,
					content:
						'<style>' +
						'.plugin_toolbox{padding: 35px;}' +
						'.plugin_toolbox .alert i{font-style: normal;font-weight: 600;color: red;padding:0 2px;}' +
						'.cut_plugin_version{background: #f5f6fa;border-radius: 4px;padding: 20px;margin-bottom: 15px;height: 200px;width: 100%;border: 1px solid #efefef;}' +
						'.plugin_title_info{font-weight: 600;height: 25px;}' +
						'.plugin_title_info span{color:#666;font-size: 13px;}' +
						'.plugin_title_info>span:nth-child(1) span{color:#20a53a;}' +
						'.plugin_title_info>span:nth-child(1){font-weight: 600;float: left;}' +
						'.plugin_title_info span:nth-child(2){font-weight: 600;float: right;}' +
						'.plugin_content_info{font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;color: #888;clear: both;padding: 0;font-size: 13px;color: #555;border: 0;background: none;margin-top: 15px;}' +
						'.plugin_content_info{margin: 0 auto;height: 140px;line-height:24px}' +
						'.cutPlugin{height: 38px;width:180px;}' +
						'</style>' +
						'<div class="plugin_toolbox">' +
						'<div class="alert alert-success" role="alert"><span>提示：如果当前插件<i>出现异常错误</i>或<i>无法使用</i>，请尝试点击</span><button class="btn btn-success btn-xs ml5 repairPlugin">修复插件</button></div>' +
						(JSON.stringify(beta) === '{}' || is_beta
							? '<div class="cut_version"'+((name == 'total'||name=='rsync'||name=='syssafe'||name=='tamper_proof')?'style="height: 100px"':'')+'></div>'
							: '<div class="cut_plugin_version "><div class="plugin_title_info ' +
							(info.beta === 2 ? 'hide' : '') +
							'"><span>最新' +
							(!is_beta ? '测试版' : '正式版') +
							'：<span>' +
							title +
							'v' +
							info.m_version +
							'.' +
							info.version +
							'</span></span><span>更新时间：' +
							bt.format_data(info.update_time, 'yyyy-MM-dd') +
							'</span></div><pre class="plugin_content_info">' +
							(info.beta === 2 ? '无版本信息' : (info.update_msg?info.update_msg:'暂无更新信息')) +
							'</pre></div>' +
							'<div class="text-center"><button class="btn btn-success btn-xs ' +
							(info.beta === 2 ? 'hide' : '') +
							' cutPlugin">切换' +
							(!is_beta ? '测试版' : '正式版') +
							'</button></div>') +
						'</div>',
					success: function (layers, indexs) {
						if(name == 'total'||name=='rsync'||name=='syssafe'||name=='tamper_proof'){
							var list = [];
							$.each(rdata, function (index, item) {
								list.push({
									title: item.m_version + '.' + item.version + (item.beta ? 'bate' : 'Stable'),
									value: item.m_version + '.' + item.version,
								})
							})
							var versionForm = bt_tools.form({
								el: '.cut_version',
								form:[
									{
										label:'选择版本',
										group:[{
											type:'select',
											width:'200px',
											name:'version',
											list:list,
										},
											{
												type: 'button',
												width: '200px',
												name: 'cutVersion',
												class: 'cutVersion',
												title: '切换版本',
												event: function (ev) {
													var version
													var minVersion
													if(versionForm.$get_form_value().version.split('.').length == 3){
														version = versionForm.$get_form_value().version.split('.')[0]+'.'+versionForm.$get_form_value().version.split('.')[1]
														minVersion = versionForm.$get_form_value().version.split('.')[2]
													} else {
														version = versionForm.$get_form_value().version.split('.')[0]
														minVersion = versionForm.$get_form_value().version.split('.')[1]
													}
													bt.soft.monitor_soft_download_speed({
														plugin_name: name,
														name: title,
														version: version,
														min_version: minVersion,
													});
													var data ={
														install_version:{
															m_version:version,
															version:minVersion
														},
														name:name,
														title:title,
													}
													bt.soft.install_soft(data)
												}
											},
										]
									},
									{
										group: {
											type: 'help',
											style: { 'margin-top': '0' },
											class: 'help-info',
											list: [
												'无法修复？请尝试切换下版本。',
											],
										},
									},
								],

							})
						}

						$('.repairPlugin').click(function () {
							layer.closeAll();
							info = tls;
							bt.soft.monitor_soft_download_speed({
								plugin_name: name,
								name: title,
								version: info.m_version,
								min_version: info.version,
							});
							bt.send(
								'repair_plugin',
								'plugin/repair_plugin',
								{
									version: info.m_version,
									min_version: info.version,
									plugin_name: name,
								},
								function (res) {
									if(typeof res.status === "boolean" && !res.status) {
										layer.closeAll()
										return bt_tools.msg(res)
									}
									layer.close(indexs);
									bt.soft.show_plugin_info(res, is_beta);
								}
							);
						});
						$('.cutPlugin').click(function () {
							info = !is_beta ? beta : tls;
							bt.soft.monitor_soft_download_speed({
								plugin_name: name,
								name: title,
								version: info.m_version,
								min_version: info.version,
							});
							bt.send(
								'upgrade_plugin',
								'plugin/upgrade_plugin',
								{
									version: info.m_version,
									min_version: info.version,
									plugin_name: name,
								},
								function (res) {
									layer.close(indexs);
									bt.soft.show_plugin_info(res, !is_beta);
								}
							);
						});
					},
				});
			}
		);
	},

	/**
	 * 安装插件过程 - 2 导入到面板
	 * @author hwliang<2021-06-23>
	 * @param {string} plugin_name 插件名称
	 * @param {string} tmp_path  临时路径
	 * @param {object} data 插件信息
	 * @return void
	 */
	input_package: function (plugin_name, tmp_path, data) {
		bt.soft.show_speed_window(
			{
				title: '正在安装【' + data.title + '】，可能需要几分钟时间，请耐心等候!',
				status: true,
			},
			function () {
				bt.send('input_package','plugin/input_package',{plugin_name: plugin_name,tmp_path: tmp_path,install_opt: data.install_opt},function (rdata) {
						layer.closeAll();
						if (rdata.status) {
							if (typeof soft !== 'undefined') {
								soft.get_list(bt.get_cookie('load_page') + 'not_load', bt.get_cookie('load_type'), bt.get_cookie('load_search'));
							} else {
								setTimeout(function () {
									window.refresh();
									soft.get_list(bt.get_cookie('load_page') + 'not_load', bt.get_cookie('load_type'), bt.get_cookie('load_search'));
								}, 2000);
							}
						}
						setTimeout(function () {
							layer.msg(rdata.msg, {
								icon: rdata.status ? 1 : 2,
							});
						}, 1000);
					}
				);
			}
		);
	},
	// 第三方插件安装
	install_other: function (data) {
		layer.closeAll();
		var loadT = layer.open({
			type: 1,
			area: '500px',
			title: (data.update ? '更新' : '安装') + '第三方插件包',
			closeBtn: 2,
			shift: 5,
			shadeClose: false,
			btn: ['确定' + (data.update ? '更新' : '安装'), '取消'],
			content:
				'<style>\
													.install_three_plugin{padding:25px;}\
													.plugin_user_info p { font-size: 14px;}\
													.plugin_user_info {padding: 25px;line-height: 26px;background: #f5f6fa;border-radius: 5px;border: 1px solid #efefef;}\
													.btn-content{text-align: center;margin-top: 25px;}\
											</style>\
											<div class="bt-form c7  install_three_plugin pb70">\
													<div class="plugin_user_info">\
															<p><b>名称：</b>' +
				data.title +
				'</p>\
															<p><b>版本：</b>' +
				data.versions +
				'</p>\
															<p><b>描述：</b>' +
				(data.update ? data.update : data.ps) +
				'</p>\
															<p><b>大小：</b>' +
				bt.format_size(data.size, true) +
				'</p>\
															<p><b>开发商：</b>' +
				data.author +
				'</p>\
															<p><b>来源：</b><a class="btlink" href="' +
				data.home +
				'" target="_blank">' +
				data.home +
				'</a></p>\
													</div>\
													<ul class="help-info-text c7">\
															' +
				(data.update ? '<li>更新过程可能需要几分钟时间，请耐心等候!</li>' : '<li>安装过程可能需要几分钟时间，请耐心等候!</li><li>如果已存在此插件，将被替换!</li>') +
				'\
													</ul>\
											</div>',
			yes: function (index, event) {
				soft.input_zip(data.name, data.tmp_path, data);
			},
		});
	},
	update_soft: function (name, title, version, min_version, update_msg, type) {
		// console.log(name,title, version, min_version, update_msg, type)
		var _this = this;
		if (parseInt(type) !== 5) {
			_this.update_soft_request(name, title, version, min_version);
			return false;
		}else{
			_this.get_soft_find(name,function(rdata){
				bt.soft.softData = rdata;
				// console.log(rdata)
				rdata.install_opt = 'u'
				_this.show_plugin_info(rdata,undefined,{})
			})
		}
		// 旧版更新s
		// 		var msg = "<li style='color:red;'>建议您在服务器负载闲时进行软件更新.</li>";
		// 		if (name === 'mysql')
		// 			msg = "<ul style='color:red;'><li>更新数据库有风险,建议在更新前,先备份您的数据库.</li><li>如果您的是云服务器,强烈建议您在更新前做一个快照.</li><li>建议您在服务器负载闲时进行软件更新.</li></ul>";
		// 		if (update_msg)
		// 			msg +=
		// 				'<div style="    margin-top: 10px;"><span style="font-size: 14px;font-weight: 900;">本次更新说明: </span><hr style="margin-top: 5px; margin-bottom: 5px;" /><pre>' +
		// 				update_msg.replace(/(_bt_)/g, '\n') +
		// 				'</pre><hr style="margin-top: -5px; margin-bottom: -5px;" /></div>';
		// 		bt.show_confirm(
		// 			'更新[' + title + ']',
		// 			'更新过程可能会导致服务中断,您真的现在就将[' + title + ']更新到[' + version + '.' + min_version + ']吗?',
		// 			function () {
		// 				bt.soft.show_speed_window(
		// 					{
		// 						title: '正在更新到[' + title + '-' + version + '.' + min_version + '],请稍候...',
		// 						status: true,
		// 						soft: {
		// 							type: parseInt(type),
		// 						},
		// 					},
		// 					function () {
		// 						bt.set_cookie('softType', type);
		// 						_this.update_soft_request(name, title, version, min_version);
		// 					}
		// 				);
		// 			},
		// 			msg
		// 		);
	},
	/**
	 * @description 更新插件请求
	 * @param {string} name 插件名称
	 * @param {number} version 插件版本
	 * @param {number} min_version 插件子版本
	 */
	update_soft_request: function (name, title, version, min_version) {
		var _this = this,
			type = bt.get_cookie('softType');

		if (type !== '5' && type !== 5)
			bt.soft.monitor_soft_download_speed({
				plugin_name: name,
				name: title,
				version: version,
				min_version: min_version,
			});
		bt.send(
			'install_plugin',
			'plugin/install_plugin',
			{
				sName: name,
				version: version,
				min_version: min_version,
				upgrade: version,
			},
			function (rdata) {
				bt.soft.softData = rdata
				if(rdata.msg && !rdata.status){
					layer.closeAll()
					layer.msg(rdata.msg,{icon:2,closeBtn:2,time:false})
					return
				}
				if (rdata.install_opt) {
					_this.show_plugin_info(
						$.extend(true, {}, rdata, {
							update: true,
						})
					);
					return;
				}
				if (rdata.size) {
					_this.install_other(rdata);
					return;
				}
				layer.close(bt.soft.loadT);
				bt.pub.get_task_count(function (rdata) {
					if (rdata > 0 && type === '5') messagebox();
				});
				if (typeof soft != 'undefined') soft.get_list(bt.get_cookie('load_page') + 'not_load', bt.get_cookie('load_type'), bt.get_cookie('load_search'));
				bt.msg(rdata);
			}
		);
	},
	un_install: function (name) {
		var _this = this;
		_this.get_soft_find(name, function (item) {
			var version = '';
			for (var i = 0; i < item.versions.length; i++) {
				if (item.versions[i].setup && bt.contains(item.version, item.versions[i].m_version)) {
					version = item.versions[i].m_version;
					if (version.indexOf('.') < 0) version += '.' + item.versions[i].version;
					break;
				}
			}
			var title = bt.replace_all(item.title, '-' + version, '');
			layer.open(
				{
					type: 0,
					area: '240px',
					title: lan.soft.uninstall,
					closeBtn: 2,
					icon: 3,
					content:'<div>' +
						'<div>' +
						'<span>'+lan.soft.uninstall_confirm.replace('{1}', title).replace('{2}', item.version)+'</span>' +
						'</div>' +
						'<div style="display: flex;align-items: center;margin-top: 20px">' +
						((name == 'total'||name=='rsync'||name=='syssafe'||name=='tamper_proof')?'<div class="bt-checkbox data-element active" id="0" data-name="test1"></div><span>保存配置文件</span>':'') +
						'</div>' +
						'</div>',
					success:function (layers, indexs) {
						if(name == 'total'||name=='rsync'||name=='syssafe'||name=='tamper_proof'){
							$('.bt-checkbox').click(function () {
								$(this).toggleClass('active')
							})
						}

					},
					yes: function () {
						bt.set_storage(name+'_config',false)
						var loadT = bt.load(lan.soft.lib_uninstall_the);
						if(name == 'total'||name=='rsync'||name=='syssafe'||name=='tamper_proof'){
							if($('.bt-checkbox').hasClass('active')){
								bt_tools.send(
									{
										url: '/plugin?action=save_plugin_settings',
										data:{
											soft_name:name
										}
									},function (res) {
										bt.send(
											'uninstall_plugin',
											'plugin/uninstall_plugin',
											{
												sName: name,
												version: version,
											},
											function (rdata) {
												loadT.close();
												bt.pub.get_task_count();
												if (typeof soft != 'undefined') soft.get_list(bt.get_cookie('load_page') + 'not_load', bt.get_cookie('load_type'), bt.get_cookie('load_search'));
												soft.render_soft_recommend()
												bt.msg(rdata);
											}
										);
									})
							}else {
								bt.send(
									'uninstall_plugin',
									'plugin/uninstall_plugin',
									{
										sName: name,
										version: version,
									},
									function (rdata) {
										loadT.close();
										bt.pub.get_task_count();
										if (typeof soft != 'undefined') soft.get_list(bt.get_cookie('load_page') + 'not_load', bt.get_cookie('load_type'), bt.get_cookie('load_search'));
										soft.render_soft_recommend()
										bt.msg(rdata);
									}
								);
							}
						}else {
							bt.send(
								'uninstall_plugin',
								'plugin/uninstall_plugin',
								{
									sName: name,
									version: version,
								},
								function (rdata) {
									loadT.close();
									bt.pub.get_task_count();
									if (typeof soft != 'undefined') soft.get_list(bt.get_cookie('load_page') + 'not_load', bt.get_cookie('load_type'), bt.get_cookie('load_search'));
									soft.render_soft_recommend()
									bt.msg(rdata);
								}
							);
						}
					}
				}
			);
		});
	},
	get_soft_find: function (name, callback) {
		var loadT = bt.load();
		bt.send(
			'get_soft_find',
			'plugin/get_soft_find',
			{
				sName: name,
			},
			function (rdata) {
				bt.soft.softData = rdata
				loadT.close();
				if (callback) callback(rdata);
			}
		);
	},
	get_config_path: function (name) {
		var fileName = '';
		if (bt.os == 'Linux') {
			switch (name) {
				case 'mysql':
				case 'mysqld':
					fileName = '/etc/my.cnf';
					break;
				case 'nginx':
					fileName = '/www/server/nginx/conf/nginx.conf';
					break;
				case 'pureftpd':
					fileName = '/www/server/pure-ftpd/etc/pure-ftpd.conf';
					break;
				case 'apache':
					fileName = '/www/server/apache/conf/httpd.conf';
					break;
				case 'tomcat':
					fileName = '/www/server/tomcat/conf/server.xml';
					break;
				case 'memcached':
					fileName = '/etc/init.d/memcached';
					break;
				case 'redis':
					fileName = '/www/server/redis/redis.conf';
					break;
				case 'openlitespeed':
					fileName = '/usr/local/lsws/conf/httpd_config.conf';
					break;
				default:
					fileName = '/www/server/php/' + name + '/etc/php.ini';
					break;
			}
		}
		return fileName;
	},
	/**
	 * @description 到期视图
	 * @param obj.type 类型 ltd/pro/plugin
	 * @param obj.name 插件名称
	 * @param obj.funEvent 点击事件
	 */
	view_expire: function (obj,callback) {
		var _li = '',_title = '',successTitle = obj.endtime === -2 ? '立即续费' : '立即购买',cancelTitle = obj.endtime === -2 ? '取消续费' : '取消购买'
		if(obj.type == 'plugin'){
			bt_tools.send({url: '/panel/introduction/get_plugin_info',data:{plugin_name: obj.name}},function(res){
				_title = '【'+ res.name +'插件<span class="cbt_danger">已到期</span>】，您将损失以下特权：'
				for (var i = 0; i < res.introduction.length; i++) {
					_li += '<li><span></span>'+ res.introduction[i] +'</li>'
				}
				openCon()
			})
		}else if(obj.type == 'ltd'){
			_title = '【企业版授权<span class="cbt_ltd">已到期</span>】，您将损失以下特权：'
			_li = '<li><i></i><span>堡塔防篡改</span></li>\
					<li><i></i><span>PHP安全告警</span></li>\
					<li><i></i><span>安全风险</span></li>\
					<li><i></i><span>漏洞扫描</span></li>\
					<li><i></i><span>Waf防火墙</span></li>\
					<li><i></i><span>监控报表</span></li>\
					<li><i></i><span>5分钟急速响应</span></li>\
					<li><i></i><span>专享企业服务群</span></li>'
			openCon()
		}else {
			_title = '【专业版授权<span class="cbt_pro">已到期</span>】，您将损失以下特权：'
			_li = '<li><i></i><span>Waf防火墙</span></li>\
					<li><i></i><span>监控报表</span></li>\
					<li><i></i><span>文件同步</span></li>\
					<li><i></i><span>系统加固</span></li>\
					<li><i></i><span>客服优先响应</span></li>\
					<li><i></i><span>商业防火墙授权</span></li>\
					<li><i></i><span>可更换IP</span></li>'
			openCon()
		}
		function openCon() {
			bt_tools.open({
				title: false,
				area: '600px',
				btn: false,
				content: '<div class="expire-box pd20 '+ obj.type +'">\
						<div class="expire-box-title">'+ _title +'</div>\
						<ul class="expire-box-ul">'+ _li +'</ul>\
						<div class="expire-box-btn">\
							<div>'+successTitle+'</div>\
							<a href="javascript:;">'+ cancelTitle +'</a>\
						</div>\
					</div>',
				success: function (layers, indexs) {
					$('.expire-box-btn div').click(function(){
						if(obj.type == 'plugin'){ // endtime == -2
							bt.send('get_soft_find','plugin/get_soft_find',{sName: obj.name},function (res) {
								// 插件续费
								bt.soft.product_pay_view({
									name: res.title,
									pid: res.pid,
									type: res.type,
									plugin: true,
									renew: res.endtime,
									ex1: res.ex1,
									ps: res.ps.replace(/</g, '\<').replace(/>/g, '\>').replace(/"/g, '\"').replace(/'/g, '\''),
									totalNum: 320
								})
							})
						}else if(obj.type === 'ltd'){
							obj.funEvent()
						}else {
							obj.funEvent()
						}
						layer.close(indexs)
					})
					$('.expire-box-btn a').click(function(){
						layer.close(indexs)
					})
				}
			})
		}
	},
	set_lib_config: function (name, title, version, endtime) { // endtime 软件商店-最近使用-到期
		var list = ['btwaf_httpd','btwaf','total','rsync','tamper_proof','syssafe','task_manager','security_notice','tamper_core','bt_security','system_scan','vuln_push','disk_analysis']
		if(list.indexOf(name) !== -1 && parseInt(endtime) < 0){ // 已到期
			return bt.soft.view_expire({type: 'plugin',name:name,endtime:endtime})
		}
		bt_tools.send({ url: '/plugin?action=a&name=' + name }, function (res) {
			if(res.msg && res.msg.indexOf('您无操作此插件的权限') !== -1){
				return bt_tools.msg(res)
			}
			var loadT = bt.load(lan.soft.menu_temp);
			$.ajax({
				url: '/plugin?action=getConfigHtml',
				data: {
					name: name,
					version: version,
				},
				type: 'get',
				success: function (rhtml) {
					loadT.close();
					if (rhtml.status === false) {
						if (name == 'phpguard') {
							layer.msg(lan.soft.menu_phpsafe, {
								icon: 1,
							});
						} else {
							layer.msg(rhtml.msg, {
								icon: 2,
							});
						}
						return;
					}

					function openPulige() {
						bt.open({
							type: 1,
							shift: 5,
							offset: 'auto',
							closeBtn: 2,
							area: (title.indexOf('Node.js版本管理器')>-1?['700px', '710px']:'700px'),
							title: '<img style="width: 24px;margin-right: 5px;margin-left: -10px;margin-top: -3px;" src="/static/img/soft_ico/ico-' + name + '.png" />' + title,
							content: rhtml.replace('"javascript/text"', '"text/javascript"'),
							success: function (layers) {
								if (rhtml.indexOf('CodeMirror') != -1) {
									loadLink(['/static/codemirror/lib/codemirror.css']);
									loadScript([
										'/static/codemirror/lib/codemirror.js',
										'/static/codemirror/addon/edit/editAll.js',
										'/static/codemirror/mode/modeAll.js',
										'/static/codemirror/addon/dialog/dialog.js',
										'/static/codemirror/addon/search/search.js',
										'/static/codemirror/addon/scroll/annotatescrollbar.js',
									]);
								}
								// 弹窗高度大于窗口高度时，设置弹窗高度为窗口高度
								var win_height = $(window).height(),layer_height = $(layers).height();
								if(layer_height >= win_height){
									setTimeout(function(){
										$(layers).css({
											top: '0px'
										})
									},100)
								}else {
									$(layers).find('.layui-layer-content').removeAttr('style').css({
										'background-color': '#fff',
									})
									$(layers).css({
										top: (win_height - layer_height)/2 + 'px',
									})
									$(layers).find('.layui-layer-close').addClass('layui-layer-close2').removeClass('layui-layer-close1')
								}
							},
							cancel: function (index) {
								layer.close(index)
								window.parent.postMessage('closePlugin', '*')
								return false
							}
						});

					}

					// rhtml = rhtml.replace(/,\s+error:\s+function(.|\n|\r)+obj.error\(ex\);\s+\}/,"");
					if(name == 'total'||name=='rsync'||name=='syssafe'||name=='tamper_proof') {
						if (bt.get_storage(name + '_config') == 'true') {
							openPulige()
						} else {
							bt_tools.send(
								{
									url: '/plugin?action=check_plugin_settings',
									data: {
										soft_name: name
									}
								}, function (res) {
									if (res['on_config']) {
										openPulige()
									} else {
										layer.open({
											type: 0,
											area: '200px',
											title:'【'+title+'】插件' ,
											closeBtn: 2,
											icon: 3,
											btn: ['确定', '取消'],
											content: '<div>' +
												'<span>检测到【'+title+'】插件存在配置文件</span>' +
												'<div style="display: flex;margin-top: 10px">' +
												'<span>配置文件</span>' +
												'<div>' +
												'<div class="indicators-label" style="margin-left: 10px;" bt-event-click="indicatorsType" data-name="pv"><input type="radio" value="1" name="1" checked><label class="check_pv" style="font-weight:normal;cursor: pointer">导入</label><input  type="radio" name="1" value="0"><label class="check_pv" style="margin-left: 10px;   margin-bottom: 0;    font-weight: normal;cursor: pointer" class="check_pv" style="font-weight:normal">不导入</label></div>' +
												'</div>' +
												'</div>' +
												'</div>',
											success: function (layers, indexs) {
												$('.check_pv').click(function () {
													$(this).prev().prop('checked', true)
												})
												$('.layui-layer-btn1').click(function () {
													bt.set_storage(name + '_config', true)
													openPulige()
													layer.close(indexs)
												})
											},
											yes: function (index, layero) {
												bt.set_storage(name + '_config', true)
												if ($('input[name="1"]:checked').val() == 1) {
													bt_tools.send({
															url: '/plugin?action=load_plugin_settings',
															data: {soft_name: name,}
														},
														function (res) {
															if (res.status) {
																layer.close(index)
																openPulige();
															}
														},'导入配置文件')
												} else {
													layer.close(index)
													openPulige()
												}
											},
											cancel: function (index) {
												bt.set_storage(name + '_config', true)
												layer.close(index)
												openPulige()
											}
										})
									}
								})
						}
					}else {
						openPulige()
					}


					/*rtmp = rhtml.split('<script type="javascript/text">')
            if (rtmp.length < 2) {
                rtmp = rhtml.split('<script type="text/javascript">')
            }
            rcode = rtmp[1].replace('</script>','');
            setTimeout(function(){
                if(!!(window.attachEvent && !window.opera)){
                    execScript(rcode);
                }else{
                    window.eval(rcode);
                }
            },200)*/
				},
			});
		},{verify:false})
	},
	save_config: function (fileName, data) {
		var encoding = 'utf-8';
		var loadT = bt.load(lan.soft.the_save);
		bt.send(
			'SaveFileBody',
			'files/SaveFileBody',
			{
				data: data,
				path: fileName,
				encoding: encoding,
			},
			function (rdata) {
				loadT.close();
				bt.msg(rdata);
			}
		);
	},
};

bt.database = {
	get_list: function (page, search, callback) {
		if (page == undefined) page = 1;
		search = search == undefined ? '' : search;
		var order = bt.get_cookie('order') ? '&order=' + bt.get_cookie('order') : '';

		var data = 'tojs=database.get_list&table=databases&limit=15&p=' + page + '&search=' + search + order;
		bt.pub.get_data(data, function (rdata) {
			if (callback) callback(rdata);
		});
	},
	//检测数据库是否启动
	check_database_status:function (name, callback) {
		bt.send('CheckDatabaseStatus', 'database/CheckDatabaseStatus', {name: name}, function (rdata) {
			if(callback) callback(rdata)
		})
	},
	get_root_pass: function (callback) {
		bt.send(
			'getKey',
			'data/getKey',
			{
				table: 'config',
				key: 'mysql_root',
				id: 1,
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
	set_root: function (type) {
		if (type == 'mongo' || type == 'pgsql') {
			bt_tools.send('database/' + bt.data.db_tab_name + '/get_root_pwd', function (rdata) {
				if (type == 'pgsql') bt.data.database.mongo['list'][0]['title'] = '管理员密码';
				var bs = bt.render_form(bt.data.database.mongo);
				$('.password' + bs).val(rdata.msg);
			});
		} else {
			bt.database.get_root_pass(function (rdata) {
				var bs = bt.render_form(bt.data.database.root);
				$('.password' + bs).val(rdata);
			});
		}
	},
	set_data_pass: function (callback) {
		var bs = bt.render_form(bt.data.database.data_pass, function (rdata) {
			if (callback) callback(rdata);
		});
		return bs;
	},
	set_data_access: function (name) {
		var loading = bt.load(),
			param = { url: 'database/' + bt.data.db_tab_name + '/GetDatabaseAccess', data: { data: JSON.stringify({ name: name }) } };
		if (bt.data.db_tab_name == 'mysql') param = { url: 'database?action=GetDatabaseAccess', data: { name: name } };
		bt_tools.send(param, function (rdata) {
			loading.close();
			var bs = bt.render_form(bt.data.database.data_access);
			$('.name' + bs).val(name);
			setTimeout(function () {
				if (rdata.msg == '127.0.0.1' || rdata.msg == '%') {
					$('.dataAccess' + bs).val(rdata.msg);
				} else {
					$('.dataAccess' + bs)
						.val('ip')
						.trigger('change');
					$('#dataAccess_subid').val(rdata.msg.replace(/,/g, '\n'));
				}
			}, 100);
		});
	},
	// mysql状态
	check_single_db_status:function(sid,load,name,isDialog){
		bt_tools.send({url:'/database?action=CheckDatabaseStatus',data:{sid:sid}},function(ress){
			bt.database.set_status_dom(name,ress,isDialog)
		},{verify:false,load:load,})
	},
	// 其他数据库远程状态
	check_single_other_status:function(sid,load,name,type,isDialog){
		bt_tools.send({url:'/database/'+type+'/CheckDatabaseStatus',data:{data:JSON.stringify({sid:sid})}},function(ress){
			bt.database.set_status_dom(name,ress,isDialog)
		},{verify:false,load:load,})
	},
	// 设置选项样式
	set_status_dom:function(name,ress,isDialog){
		$((isDialog?'.layui-layer-content':'.pull-right')+' .db_status_row').find(' .db_status_type').text(name)
		$((isDialog?'.layui-layer-content':'.pull-right')+' .db_status_row').find(' .db_status_text').text(ress.msg)
		if(!ress.db_status){
			$((isDialog?'.layui-layer-content':'.pull-right')+' .db_status_row').find('.db_status_icon').removeClass('status_success').addClass('status_abnormal')
			$((isDialog?'.layui-layer-content':'.pull-right')+' .db_status_row').find(' .db_status_text').css('color','#ef0808')
		} else{
			$((isDialog?'.layui-layer-content':'.pull-right')+' .db_status_row').find('.db_status_icon').removeClass('status_abnormal').addClass('status_success')
			$((isDialog?'.layui-layer-content':'.pull-right')+' .db_status_row').find(' .db_status_text').css('color','#20A53A')
		}
	},
	// 在类别选择框前增加状态信息
	append_select_status:function(that,type){
		if($(that).find('option:selected').attr('value') == 'all'){
			$(that).parent().find('.db_status_row').remove()
		}else{
			$('.pull-right').css({'display':'flex','align-items':'center'})
			$(that).parent().find('.db_status_row').remove()
			$(that).before('<div class="db_status_row">\
				<span class="db_status_icon status_icon status_success"></span>\
				<span class="db_status_type">'+($(that).find('option:selected').text())+'</span>状态：\
				<span class="db_status_text">查询中...</span>\
				</div>')
			bt.database.check_single_other_status($(that).find('option:selected').attr('value'),false,$(that).find('option:selected').text(),type)
		}
	},
	// 根据id查询数组对象中的对象
	findObjectsById:function(arr, id) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].value == id) {
				return arr[i];
			}
		}
		return null; // 如果未找到匹配的对象，则返回 null
	},
	add_database: function (cloudList, callback) {
		if(bt.data.db_tab_name == 'pgsql_manager') bt.data.db_tab_name = 'pgsql'
		if (bt.data.db_tab_name == 'mysql') {
			bt.data.database.data_add.list[2].items[0].value = bt.get_random(16);
			bt.data.database.data_add.list[4].items[0].items = cloudList;
			// 在此查询状态 默认查询数据库第一栏
			var db_obj = bt.database.findObjectsById(cloudList,cloudList[0].value)
			if(db_obj.value == '0') db_obj.name = '本地服务器'
			bt.database.check_single_db_status(cloudList[0].value,false,db_obj.name,true)
			bt.data.database.data_add.list[4].items[0].items = cloudList;
			bt.render_form(bt.data.database.data_add, function (rdata) {
				if (callback) callback(rdata);
			});
			$('.click_status_check').click(function(){
				var sid = $('.add_to_db select').find('option:selected').attr('value')
				bt.database.check_single_db_status(sid,'检测')
			})
			$('.add_to_db select').change(function(){
				var db_obj = bt.database.findObjectsById(cloudList,$(this).find('option:selected').attr('value'))
				if(db_obj.value == '0') db_obj.name = '本地服务器'
				bt.database.check_single_db_status($(this).find('option:selected').attr('value'),'检测数据库状态',db_obj.name,true)
			})
		} else {
			var copyDataAdd = $.extend(true, {}, bt.data.database.data_add);
			copyDataAdd.list[2].items[0].value = bt.get_random(16);
			switch (bt.data.db_tab_name) {
				case 'sqlserver':
				case 'mongodb':
				case 'pgsql':
					delete copyDataAdd.list[0].items[1];
					copyDataAdd.list.splice(3);
					copyDataAdd.list.push(bt.data.database.data_add.list[4]);
					copyDataAdd.list.push(bt.data.database.data_add.list[5]);
					copyDataAdd.list[3].items[0].items = cloudList;
					break;
			}
			//没有本地或者远程数据库
			if (cloudList.length == 0) {
				copyDataAdd.list[copyDataAdd.list.length - 1].hide = true;
			}
			bt.database.check_single_other_status(cloudList[0].value,false,(cloudList[0].value == '0'?'本地服务器':cloudList[0].name),bt.data.db_tab_name,true)
			bt.render_form($.extend(true, {}, copyDataAdd), function (rdata) {
				if (callback) callback(rdata);
			});
			$('.click_status_check').click(function(){
				var sid = $('.add_to_db select').find('option:selected').attr('value')
				var db_obj = bt.database.findObjectsById(cloudList,sid)
				bt.database.check_single_other_status(sid,'检测',(sid == '0'?'本地服务器': db_obj.name),bt.data.db_tab_name,true)
			})
			$('.add_to_db select').change(function(){
				var db_obj = bt.database.findObjectsById(cloudList,$(this).find('option:selected').attr('value'))
				if(db_obj.value == '0') db_obj.name = '本地服务器'
				bt.database.check_single_other_status($(this).find('option:selected').attr('value'),'检测数据库状态',db_obj.name,bt.data.db_tab_name,true)
			})
		}
	},
	del_database: function (data, callback) {
		var loadT = bt.load(lan.get('del_all_task_the', [data.name])),
			param = { url: 'database/' + bt.data.db_tab_name + '/DeleteDatabase', data: { data: JSON.stringify(data) } };
		if (bt.data.db_tab_name == 'mysql') param = { url: 'database?action=DeleteDatabase', data: data };
		bt_tools.send(param, function (rdata) {
			loadT.close();
			bt.msg(rdata);
			if (callback) callback(rdata);
		});
	},
	sync_database: function (sid, callback) {
		var loadT = bt.load(lan.database.sync_the),
			param = { url: 'database/' + bt.data.db_tab_name + '/SyncGetDatabases', data: { data: JSON.stringify({ sid: sid }) } };
		if (bt.data.db_tab_name == 'mysql') param = { url: 'database?action=SyncGetDatabases', data: { sid: sid } };
		bt_tools.send(param, function (rdata) {
			loadT.close();
			if (callback) callback(rdata);
			bt.msg(rdata);
		});
	},
	sync_to_database: function (data, callback) {
		var loadT = bt.load(lan.database.sync_the),
			param = { url: 'database/' + bt.data.db_tab_name + '/SyncToDatabases', data: { data: JSON.stringify(data) } };
		if (bt.data.db_tab_name == 'mysql') param = { url: 'database?action=SyncToDatabases', data: data };
		bt_tools.send(param, function (rdata) {
			loadT.close();
			if (callback) callback(rdata);
			bt.msg(rdata);
		});
	},
	open_phpmyadmin: function (name, username, password) {
		if ($('#toPHPMyAdmin').attr('action').indexOf('phpmyadmin') == -1) {
			layer.msg(lan.database.phpmyadmin_err, {
				icon: 2,
				shade: [0.3, '#000'],
			});
			setTimeout(function () {
				window.location.href = '/soft';
			}, 3000);
			return;
		}
		$('#toPHPMyAdmin').attr('action', $('#toPHPMyAdmin').attr('public-data'));
		var murl = $('#toPHPMyAdmin').attr('action');
		$('#pma_username').val(username);
		$('#pma_password').val(password);
		$('#db').val(name);
		layer.msg(lan.database.phpmyadmin, {
			icon: 16,
			shade: [0.3, '#000'],
			time: 1000,
		});
		setTimeout(function () {
			$('#toPHPMyAdmin').submit();
			layer.closeAll();
		}, 200);
	},
	submit_phpmyadmin: function (name, username, password, pub) {
		if (pub === true) {
			$('#toPHPMyAdmin').attr('action', $('#toPHPMyAdmin').attr('public-data'));
		} else {
			$('#toPHPMyAdmin').attr('action', '/phpmyadmin/index.php');
		}
		var murl = $('#toPHPMyAdmin').attr('action');
		$('#pma_username').val(username);
		$('#pma_password').val(password);
		$('#db').val(name);
		layer.msg(lan.database.phpmyadmin, {
			icon: 16,
			shade: [0.3, '#000'],
			time: 1000,
		});
		setTimeout(function () {
			$('#toPHPMyAdmin').submit();
			layer.closeAll();
		}, 200);
	},

	input_sql: function (fileName, dataName) {
		bt.show_confirm(lan.database.input_title, '<span style="color:red;font-size:13px;">【' + dataName + '】' + lan.database.input_confirm + '</span>', function (index) {
			if(bt.data.db_tab_name === "pgsql_manager") bt.data.db_tab_name = "pgsql";
			var loading = bt.load(lan.database.input_the),
				param = { url: 'database/' + bt.data.db_tab_name + '/InputSql', data: { data: JSON.stringify({ file: fileName, name: dataName }) } };
			if (bt.data.db_tab_name == 'mysql') param = { url: 'database?action=InputSql', data: { file: fileName, name: dataName } };
			bt_tools.send(param, function (rdata) {
				loading.close();
				rdata['code']=-1
				bt.msg(rdata)
			});
		});
	},
	backup_data: function (id, callback) {
		var loadT = bt.load(lan.database.backup_the),
			param = { url: 'database/' + bt.data.db_tab_name + '/ToBackup', data: { data: JSON.stringify({ id: id }) } };
		if (bt.data.db_tab_name == 'mysql') param = { url: 'database?action=ToBackup', data: { id: id } };
		bt_tools.send(param, function (rdata) {
			loadT.close();
			bt.msg(rdata);
			if (callback) callback(rdata);
		});
	},
	del_backup: function (id, dataId, dataName, addtime) {
		bt.confirm(
			{
				msg: '删除选中备份文件后，<span class="color-red">该备份文件将永久消失</span>，是否继续操作？',
				title: '删除备份文件[' + addtime + ']',
			},
			function () {
				var loadT = bt.load(),
					param = { url: 'database/' + bt.data.db_tab_name + '/DelBackup', data: { data: JSON.stringify({ id: id }) } };
				if (bt.data.db_tab_name == 'mysql') param = { url: 'database?action=DelBackup', data: { id: id } };
				bt_tools.send(param, function (rdata) {
					loadT.close();
					if (rdata.status) {
						if (database) {
							database.database_detail(dataId, dataName);
							database.database_table_view();
						}
					}
					bt.msg(rdata);
				});
			}
		);
	},
	// 设置mongodb权限
	set_mongo_data_access: function (name) {
		var loading = bt.load(),
			// param = { url: 'database/' + bt.data.db_tab_name + '/GetDatabaseAccess', data: { data: JSON.stringify({ name: name }) } },
			accessList=[],
			checkList=[],
			username='';
		if (bt.data.db_tab_name == 'mongodb'){
			param = { url: 'database/mongodb/GetDatabaseAccess', data: { data: JSON.stringify({ user_name: name }) } };
		}
		bt_tools.send({url:'database/mongodb/GetRole'},function(rdata){
			$(rdata.data).each(function(index,e){
				var item={
					title:e.name,
					value:e.role
				}
				accessList.push(item)
			})
			bt_tools.send(param, function (rdata) {
				username=rdata.data.user
				$(rdata.data.roles).each(function(i,e){
					var isCheck=e.role
					checkList.push(isCheck)
				})
				loading.close();
				// var bs = bt.render_form(bt.data.database.data_access);
				bt_tools.open({
					title:'设置数据库用户权限['+ username +']',
					area:['600px','210px'],
					// btn:['确定','取消'],
					content:{//配置请查看表单form方法中的类型
						class:'pd20',
						form:[{
							label: '访问权限',
							group: {
								type: 'multipleSelect',
								placeholder:'',
								name: 'checkedAccess',
								width: '420px',
								value: checkList,
								list: accessList
							}
						}]
					},
					success:function(layers){
						//打开弹窗后执行的事件
						$(layers).find('.layui-layer-content').css('overflow', 'inherit')
					},
					yes:function(formD,indexs){
						var load=bt_tools.load('正在加载中')
						//formD会获取配置中name的集合数据
						var data={
							user_name:username,
							db_permission:this.data.checkedAccess? this.data.checkedAccess:checkList
						}
						if(data.db_permission.length==0){
							load.close()
							bt_tools.msg('至少选择一个访问权限！',2);
							return
						}
						bt_tools.send({url:'database/mongodb/SetDatabaseAccess',data:{data:JSON.stringify(data)}},function(rdata){
							load.close()
							bt_tools.msg('设置成功')
							layer.close(indexs)

						},function(e){
							load.close()
							bt_tools.msg(e.msg,2);
						})
						//indexs可用于完成操作后关闭弹窗layer.close(indexs)
					}
				})
			});
		})
	},
};

bt.send('get_config', 'config/get_config', {}, function (rdata) {
	bt.config = rdata;
	if (rdata.user_info && rdata.user_info.status) {
		var rdata_data = rdata.user_info.data;
		localStorage.setItem('bt_user_info', JSON.stringify(rdata.user_info));
		$(".bind-user").html('<a href="javascript:bt.pub.bind_btname();" class="btlink" style="margin-left: 5px;">'+rdata_data.username+'</a>');
	}
	else {
		$(".bind-weixin a").attr("href", "javascript:;");
		$(".bind-weixin a").click(function () {
			bt.msg({ msg: '请先绑定宝塔账号!', icon: 2 });
		})
	}
});

bt.plugin = {
	get_plugin_byhtml: function (name, callback) {
		bt.send(
			'getConfigHtml',
			'plugin/getConfigHtml',
			{
				name: name,
			},
			function (rdata) {
				// rdata = rdata.replace(/,\s+error:\s+function(.|\n|\r)+obj.error\(ex\);\s+\}/,"")
				if (callback) callback(rdata);
			}
		);
	},
	get_firewall_state: function (callback) {
		var typename = getCookie('serverType');
		var name = 'btwaf_httpd';
		if (typename == 'nginx') name = 'btwaf';
		bt.send(
			'a',
			'plugin/a',
			{
				name: name,
				s: 'get_total_all',
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
};

bt.site = {
	get_list: function (page, search, type, callback) {
		if (page == undefined) page = 1;
		type = type == undefined ? '&type=-1' : '&type=' + type;
		search = search == undefined ? '' : search;
		var order = bt.get_cookie('order') ? '&order=' + bt.get_cookie('order') : '';
		var data = 'tojs=site.get_list&table=sites&limit=15&p=' + page + '&search=' + search + order + type;
		bt.pub.get_data(data, function (rdata) {
			if (callback) callback(rdata);
		});
	},
	get_domains: function (id, callback) {
		var data = 'table=domain&list=True&search=' + id;
		bt.pub.get_data(
			data,
			function (rdata) {
				if (callback) callback(rdata);
			},
			1
		);
	},
	get_type: function (callback) {
		bt.send('get_site_types', 'site/get_site_types', '', function (rdata) {
			if (callback) callback(rdata);
		});
	},
	add_type: function (name, callback) {
		bt.send(
			'add_site_type',
			'site/add_site_type',
			{
				name: name,
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
	edit_type: function (data, callback) {
		bt.send(
			'modify_site_type_name',
			'site/modify_site_type_name',
			{
				id: data.id,
				name: data.name,
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
	del_type: function (id, callback) {
		bt.send(
			'remove_site_type',
			'site/remove_site_type',
			{
				id: id,
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
	set_site_type: function (data, callback) {
		bt.send(
			'set_site_type',
			'site/set_site_type',
			{
				id: data.id,
				site_ids: data.site_array,
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
	get_site_domains: function (id, callback) {
		var loading = bt.load();
		bt.send(
			'GetSiteDomains',
			'site/GetSiteDomains',
			{
				id: id,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	add_domains: function (id, webname, domains, callback) {
		var loading = bt.load();
		bt.send(
			'AddDomain',
			'site/AddDomain',
			{
				domain: domains,
				webname: webname,
				id: id,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	del_domain: function (siteId, siteName, domain, port, callback) {
		var loading = bt.load();
		bt.send(
			'DelDomain',
			'site/DelDomain',
			{
				id: siteId,
				webname: siteName,
				domain: domain,
				port: port,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
				bt.msg(rdata);
			}
		);
	},
	get_dirbind: function (id, callback) {
		var loading = bt.load();
		bt.send(
			'GetDirBinding',
			'site/GetDirBinding',
			{
				id: id,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	add_dirbind: function (id, domain, dirName, callback) {
		var loading = bt.load();
		bt.send(
			'AddDirBinding',
			'site/AddDirBinding',
			{
				id: id,
				domain: domain,
				dirName: dirName,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	del_dirbind: function (id, callback) {
		var loading = bt.load();
		bt.send(
			'DelDirBinding',
			'site/DelDirBinding',
			{
				id: id,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	get_dir_rewrite: function (data, callback) {
		var loading = bt.load();
		bt.send('GetDirRewrite', 'site/GetDirRewrite', data, function (rdata) {
			loading.close();
			if (callback) callback(rdata);
		});
	},
	get_site_path: function (id, callback) {
		bt.send(
			'getKey',
			'data/getKey',
			{
				table: 'sites',
				key: 'path',
				id: id,
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
	get_dir_userini: function (id, path, callback) {
		bt.send(
			'GetDirUserINI',
			'site/GetDirUserINI',
			{
				id: id,
				path: path,
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
	set_dir_userini: function (path, callback) {
		var loading = bt.load();
		bt.send(
			'SetDirUserINI',
			'site/SetDirUserINI',
			{
				path: path,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	set_logs_status: function (id, callback) {
		var loading = bt.load();
		bt.send(
			'logsOpen',
			'site/logsOpen',
			{
				id: id,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	set_site_runpath: function (id, path, callback) {
		var loading = bt.load();
		bt.send(
			'SetSiteRunPath',
			'site/SetSiteRunPath',
			{
				id: id,
				runPath: path,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	set_site_path: function (id, path, callback) {
		var loading = bt.load();
		bt.send(
			'SetPath',
			'site/SetPath',
			{
				id: id,
				path: path,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	set_site_pwd: function (id, username, password, callback) {
		var loading = bt.load();
		bt.send(
			'SetHasPwd',
			'site/SetHasPwd',
			{
				id: id,
				username: username,
				password: password,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	close_site_pwd: function (id, callback) {
		var loading = bt.load();
		bt.send(
			'SetHasPwd',
			'site/CloseHasPwd',
			{
				id: id,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	get_limitnet: function (id, callback) {
		bt.send(
			'GetLimitNet',
			'site/GetLimitNet',
			{
				id: id,
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
	set_limitnet: function (id, perserver, perip, limit_rate, callback) {
		var loading = bt.load();
		bt.send(
			'SetLimitNet',
			'site/SetLimitNet',
			{
				id: id,
				perserver: perserver,
				perip: perip,
				limit_rate: limit_rate,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	close_limitnet: function (id, callback) {
		var loading = bt.load();
		bt.send(
			'CloseLimitNet',
			'site/CloseLimitNet',
			{
				id: id,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	get_rewrite_list: function (siteName, callback) {
		bt.send(
			'GetRewriteList',
			'site/GetRewriteList',
			{
				siteName: siteName,
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
	set_rewrite_tel: function (name, data, callback) {
		var loading = bt.load(lan.site.saving_txt);
		bt.send(
			'SetRewriteTel',
			'site/SetRewriteTel',
			{
				name: name,
				data: data,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	get_index: function (id, callback) {
		bt.send(
			'GetIndex',
			'site/GetIndex',
			{
				id: id,
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
	set_index: function (id, index, callback) {
		var loading = bt.load();
		bt.send(
			'SetIndex',
			'site/SetIndex',
			{
				id: id,
				Index: index,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	get_site_config: function (siteName, callback) {
		if (bt.os == 'Linux') {
			var sPath = '/www/server/panel/vhost/' + bt.get_cookie('serverType') + '/' + siteName + '.conf';
			bt.files.get_file_body(sPath, function (rdata) {
				if (callback) callback(rdata);
			});
		}
	},
	set_site_config: function (siteName, data, encoding, callback) {
		var loading = bt.load(lan.site.saving_txt);
		if (bt.os == 'Linux') {
			var sPath = '/www/server/panel/vhost/' + bt.get_cookie('serverType') + '/' + siteName + '.conf';
			bt.files.set_file_body(sPath, data, 'utf-8', function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			});
		}
	},
	set_phpversion: function (siteName, version, other, callback) {
		var loading = bt.load();
		bt.send(
			'SetPHPVersion',
			'site/SetPHPVersion',
			{
				siteName: siteName,
				version: version,
				other: other,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	// 重定向列表
	get_redirect_list: function (name, callback) {
		var loadT = bt.load(lan.site.the_msg);
		bt.send(
			'GetRedirectList',
			'site/GetRedirectList',
			{
				sitename: name,
			},
			function (rdata) {
				loadT.close();
				if (callback) callback(rdata);
			}
		);
	},
	// 重定向列表
	get_redirect_list: function (name, callback) {
		var loadT = layer.load();
		bt.send(
			'GetRedirectList',
			'site/GetRedirectList',
			{
				sitename: name,
			},
			function (rdata) {
				layer.close(loadT);
				if (callback) callback(rdata);
			}
		);
	},
	create_redirect: function (obj, callback) {
		var loadT = bt.load(lan.site.the_msg);
		bt.send('CreateRedirect', 'site/CreateRedirect', obj, function (rdata) {
			loadT.close();
			if (callback) callback(rdata);
		});
	},
	modify_redirect: function (obj, callback) {
		var loadT = bt.load(lan.site.the_msg);
		bt.send('ModifyRedirect', 'site/ModifyRedirect', obj, function (rdata) {
			loadT.close();
			if (callback) callback(rdata);
		});
	},
	set_redirect: function (isEdit, obj, callback) {
		isEdit ? this.modify_redirect(obj, callback) : this.create_redirect(obj, callback);
	},
	set_error_redirect: function (isEdit, obj, callback) {
		var loadT = bt.load(lan.site.the_msg);
		var url = isEdit ? 'ModifyRedirect' : 'set_error_redirect';
		bt.send(url, 'site/' + url, obj, function (rdata) {
			loadT.close();
			if (callback) callback(rdata);
		});
	},
	remove_redirect: function (sitename, redirectname, callback) {
		bt.compute_confirm({ title: '删除重定向规则【' + sitename + '】', msg: '删除选中的规则后，配置的重定向域名/目录将指向源地址，是否继续操作？' }, function () {
			var loadT = bt.load(lan.site.the_msg);
			bt.send(
				'DeleteRedirect',
				'site/DeleteRedirect',
				{
					sitename: sitename,
					redirectname: redirectname,
				},
				function (rdata) {
					loadT.close();
					if (callback) callback(rdata);
				}
			);
		});
	},
	get_redirect_config: function (obj, callback) {
		var loadT = bt.load(lan.site.the_msg);
		bt.send('GetRedirectFile', 'site/GetRedirectFile', obj, function (rdata) {
			loadT.close();
			if (callback) callback(rdata);
		});
	},
	save_redirect_config: function (obj, callback) {
		var loadT = bt.load(lan.site.the_msg);
		bt.send('SaveProxyFile', 'site/SaveRedirectFile', obj, function (rdata) {
			loadT.close();
			if (callback) callback(rdata);
		});
	},
	get_site_proxy: function (siteName, callback) {
		bt.send(
			'GetProxy',
			'site/GetProxy',
			{
				name: siteName,
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
	set_site_proxy: function (siteName, type, proxyUrl, toDomain, sub1, sub2, callback) {
		var loading = bt.load();
		bt.send(
			'SetProxy',
			'site/SetProxy',
			{
				name: siteName,
				type: type,
				proxyUrl: proxyUrl,
				toDomain: toDomain,
				sub1: sub1,
				sub2: sub2,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	set_open_proxy_cache: function (siteName, callback) {
		var loading = bt.load();
		bt.send(
			'ProxyCache',
			'site/ProxyCache',
			{
				siteName: siteName,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	get_proxy_list: function (name, callback) {
		var loadT = bt.load(lan.site.the_msg);
		bt.send(
			'GetProxyList',
			'site/GetProxyList',
			{
				sitename: name,
			},
			function (rdata) {
				loadT.close();
				if (callback) callback(rdata);
			}
		);
	},
	create_proxy: function (obj, callback) {
		var loadT = bt.load(lan.site.the_msg);
		bt.send('CreateProxy', 'site/CreateProxy', obj, function (rdata) {
			loadT.close();
			if (callback) callback(rdata);
		});
	},
	remove_proxy: function (sitename, proxyname, callback,type) {
		bt.compute_confirm({ title: '删除反向代理规则【' + proxyname + '】', msg: '删除选中的规则后，配置的反向代理规则将会彻底失效，是否继续操作？' }, function () {
			var loadT = bt.load(lan.site.the_msg);
			if(type == 'proxy'){
				bt_tools.send({
					url:'/project/proxy/RemoveProxy',
					data:{
						sitename: sitename,
						proxyname: proxyname,
					}
				},function(rdata){
					loadT.close();
					if (callback) callback(rdata);
					bt.msg(rdata);
				})
			}else {
				bt.send(
					'RemoveProxy',
					'site/RemoveProxy',
					{
						sitename: sitename,
						proxyname: proxyname,
					},
					function (rdata) {
						loadT.close();
						if (callback) callback(rdata);
						bt.msg(rdata);
					}
				);
			}
		});
	},
	modify_proxy: function (obj, callback,type) {
		var loadT = bt.load(lan.site.the_msg);
		if(type == 'proxy'){
			bt_tools.send({
				url:'/project/proxy/ModifyProxy',
				data:obj,
			},function(rdata){
				loadT.close();
				if (callback) callback(rdata);
			})
		}else {
			bt.send('ModifyProxy', '	site/ModifyProxy', obj, function (rdata) {
				loadT.close();
				if (callback) callback(rdata);
			});
		}

	},
	get_proxy_config: function (obj, callback) {
		var loadT = bt.load(lan.site.the_msg);
		bt.send('GetProxyFile', 'site/GetProxyFile', obj, function (rdata) {
			loadT.close();
			if (callback) callback(rdata);
		});
	},
	save_proxy_config: function (obj, callback) {
		var loadT = bt.load(lan.site.the_msg);
		bt.send('SaveProxyFile', 'site/SaveProxyFile', obj, function (rdata) {
			loadT.close();
			if (callback) callback(rdata);
		});
	},
	get_site_security: function (id, name, callback) {
		bt.send(
			'GetSecurity',
			'site/GetSecurity',
			{
				id: id,
				name: name,
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
	set_site_security: function (id, name, fix, domains, status, return_rule,http_status, callback) {
		var loading = bt.load(lan.site.the_msg);
		bt.send(
			'SetSecurity',
			'site/SetSecurity',
			{
				id: id,
				name: name,
				fix: fix,
				domains: domains,
				status: status,
				return_rule: return_rule,
				http_status: http_status,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	get_site_301: function (siteName, callback) {
		bt.send(
			'Get301Status',
			'site/Get301Status',
			{
				siteName: siteName,
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
	set_site_301: function (siteName, srcDomain, toUrl, type, callback) {
		var loading = bt.load();
		bt.send(
			'Set301Status',
			'site/Set301Status',
			{
				siteName: siteName,
				toDomain: toUrl,
				srcDomain: srcDomain,
				type: type,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	set_tomcat: function (siteName, callback) {
		var loading = bt.load(lan['public'].config);
		bt.send(
			'SetTomcat',
			'site/SetTomcat',
			{
				siteName: siteName,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	get_site_logs: function (siteName, callback,type) {
		var loading = bt.load();
		if(type == 'proxy') {
			bt_tools.send({
				url:'/project/proxy/GetSiteLogs',
				data:{
					siteName: siteName,
				}
			},function(rdata){
				loading.close();
				if (rdata.status !== true) rdata.msg = '';
				if (rdata.msg == '') rdata.msg = '当前没有日志.';
				if (callback) callback(rdata);
			})
		}else {
			bt.send(
				'GetSiteLogs',
				'site/GetSiteLogs',
				{
					siteName: siteName,
				},
				function (rdata) {
					loading.close();
					if (rdata.status !== true) rdata.msg = '';
					if (rdata.msg == '') rdata.msg = '当前没有日志.';
					if (callback) callback(rdata);
				}
			);
		}
	},
	getSiteLogs: function (obj, callback) {
		bt_tools.send({ url: '/logs/site/GetSiteLogs', data: { ip_area: obj.ip_area,siteName: obj.siteName } }, function (rdata) {
			if (rdata.status !== true) rdata.msg = '';
			if (rdata.msg == '') rdata.msg = '当前没有日志.';
			if (callback) callback(rdata);
		},{load: '获取日志',verify:false})
	},
	get_site_error_logs: function (siteName, callback,type) {
		var loading = bt.load();
		if(type == 'proxy') {
			bt_tools.send({
				url:'/project/proxy/get_site_errlog',
				data:{
					siteName: siteName,
				}
			},function (rdata){
				loading.close();
				if (rdata.status !== true) rdata.msg = '';
				if (rdata.msg == '') rdata.msg = '当前没有日志.';
				if (callback) callback(rdata);
			})
		}else {
			bt.send(
				'get_site_errlog',
				'site/get_site_errlog',
				{
					siteName: siteName,
				},
				function (rdata) {
					loading.close();
					if (rdata.status !== true) rdata.msg = '';
					if (rdata.msg == '') rdata.msg = '当前没有日志.';
					if (callback) callback(rdata);
				}
			);
		}
	},
	// 全屏弹窗编辑器
	fullEdiotrView: function (obj,callback) {
		layer.open({
			type: 1,
			area: ['100%','100%'], // 100%全屏
			shade: 0.4,
			title: obj.title,
			closeBtn: 1,
			content: '<div id="editor-content" style="height: 100%;"></div>', // 内容
			success:function(layers){
				$(layers).css('top','0')
				$(layers).css('left','0')
				var editor_content = {
					el:'editor-content',
					mode:'dockerfile',
					content: obj.msg,
					readOnly: obj.hasOwnProperty('readOnly') ? obj.readOnly : true,
					theme:'ace/theme/monokai',
				}
				if(obj.path) editor_content['path'] = obj.path
				var aEditor = bt.aceEditor(editor_content)
				if(obj.hasOwnProperty('readOnly') && obj.readOnly == false) {
					aEditor.ACE.getSession().on('change', function (editor) {
						if (callback) callback(aEditor)
					})
				}
				if(!obj.top) { // 是否滚动到底部
					setTimeout(function () {
						aEditor.ACE.getSession().setScrollTop(aEditor.ACE.renderer.scrollBar.scrollHeight)
					},50)
				}
			}
		});
	},
	// 全屏展示日志信息 flag 是否走编辑器全屏
	fullScreenLog:function(data,row,type,flag){
		// 点击全屏
		$('.full').unbind('click').click(function(){
			if(flag) {
				layer.open({
					type: 1,
					area: ['100%','100%'], // 100%全屏
					shade: 0.4,
					title: row.title ? row.title :'查看【'+row.name+'】'+type+'日志',
					closeBtn: 1,
					content: '<div id="editor-content" style="height: 100%;"></div>', // 内容
					success:function(layers){
						$(layers).css('top','0')
						$(layers).css('left','0')
						var editor_content = {
							el:'editor-content',
							mode:'dockerfile',
							content: data.html(),
							readOnly: row.hasOwnProperty('readOnly') ? row.readOnly : true,
							theme:'ace/theme/monokai',
						}
						if(row.path) editor_content['path'] = row.path
						var aEditor = bt.aceEditor(editor_content)
						if(!row.top) { // 是否滚动到最底部
							setTimeout(function () {
								aEditor.ACE.getSession().setScrollTop(aEditor.ACE.renderer.scrollBar.scrollHeight)
							},50)
						}
					}
				});
			}else {
				layer.open({
					type: 1,
					area: ['100%','100%'], // 100%全屏
					shade: 0.4,
					title: '查看【'+row.name+'】'+type+'日志',
					closeBtn: 1,
					content: '<pre style="background:black;color:white;height:100%;margin:0">'+data.html()+'</pre>', // 内容
					success:function(layers){
						$(layers).css('top','0')
						$(layers).css('left','0')
					}
				});
			}
		})
	},
	get_site_ssl: function (siteName, callback) {
		var loadT = bt.load(lan.site.the_msg);
		bt.send(
			'GetSSL',
			'site/GetSSL',
			{
				siteName: siteName,
			},
			function (rdata) {
				loadT.close();
				if (callback) callback(rdata);
			}
		);
	},
	create_let: function (data, callback) {
		var loadT = layer.open({
			title: false,
			type: 1,
			closeBtn: 0,
			shade: 0.3,
			area: '500px',
			offset: '30%',
			content: "<pre style='margin-bottom: 0px;height:250px;text-align: left;background-color: #000;color: #fff;white-space: pre-wrap;' id='create_lst'>正在准备申请证书...</pre>",
			success: function (layers, index) {
				bt.site.get_let_logs();
				bt.send('CreateLet', 'site/CreateLet', data, function (rdata) {
					layer.close(loadT);
					if (callback) callback(rdata);
				});
			},
		});
	},
	get_let_logs: function () {
		bt.send(
			'get_lines',
			'ajax/get_lines',
			{
				num: 10,
				filename: '/www/server/panel/logs/letsencrypt.log',
			},
			function (rdata) {
				if ($('#create_lst').text() === '') return;
				if (rdata.status === true) {
					$('#create_lst').text(rdata.msg);
					$('#create_lst').scrollTop($('#create_lst')[0].scrollHeight);
				}
				setTimeout(function () {
					bt.site.get_let_logs();
				}, 1000);
			}
		);
	},
	get_dns_api: function (callback) {
		var loadT = bt.load();
		bt.send('GetDnsApi', 'site/GetDnsApi', {}, function (rdata) {
			loadT.close();
			if (callback) callback(rdata);
		});
	},
	set_dns_api: function (data, callback) {
		var loadT = bt.load();
		bt.send('SetDnsApi', 'site/SetDnsApi', data, function (rdata) {
			loadT.close();
			if (callback) callback(rdata);
		});
	},
	verify_domain: function (partnerOrderId, siteName, callback) {
		var loadT = bt.load(lan.site.ssl_apply_2);
		bt.send(
			'Completed',
			'ssl/Completed',
			{
				partnerOrderId: partnerOrderId,
				siteName: siteName,
			},
			function (rdata) {
				loadT.close();
				if (callback) callback(rdata);
			}
		);
	},
	get_dv_ssl: function (domain, path, callback) {
		var loadT = bt.load(lan.site.ssl_apply_1);
		bt.send(
			'GetDVSSL',
			'ssl/GetDVSSL',
			{
				domain: domain,
				path: path,
			},
			function (rdata) {
				loadT.close();
				if (callback) callback(rdata);
			}
		);
	},
	get_module_config: function (param, callback) {
		var loadT = bt.load('正在获取告警配置，请稍候...');
		bt.send(
			'get_module_config',
			'push/get_module_config',
			{
				name: param.name,
				type: param.type,
			},
			function (rdata) {
				loadT.close();
				if (callback) callback(rdata);
			}
		);
	},

	// 设置
	set_push_config: function (param, callback) {
		var loadT = bt.load('正在设置告警配置，请稍候...');
		bt.send(
			'set_push_config',
			'push/set_push_config',
			{
				name: param.name,
				id: param.id,
				data: param.data,
			},
			function (rdata) {
				loadT.close();
				if (callback) callback(rdata);
			}
		);
	},

	// 获取消息推送配置
	get_msg_configs: function (callback) {
		var loadT = bt.load('正在获取消息推送配置，请稍候...');
		bt.send('get_msg_configs', 'config/get_msg_configs', {}, function (rdata) {
			loadT.close();
			if (callback) callback(rdata);
		});
	},

	// 下载证书
	download_cert: function (param, callback) {
		var loadT = bt.load('正在下载证书，请稍候...');
		bt.send(
			'download_cert',
			'site/download_cert',
			{
				siteName: param.siteName,
				ssl_type: param.ssl_type || 'csr',
				pem: param.pem,
				key: param.key,
				pwd: param.pwd || '', //密码，非必填
			},
			function (rdata) {
				loadT.close();
				if (callback) callback(rdata);
			}
		);
	},
	get_ssl_info: function (partnerOrderId, siteName, callback) {
		var loadT = bt.load(lan.site.ssl_apply_3);
		bt.send(
			'GetSSLInfo',
			'ssl/GetSSLInfo',
			{
				partnerOrderId: partnerOrderId,
				siteName: siteName,
			},
			function (rdata) {
				loadT.close();
				if (callback) callback(rdata);
			}
		);
	},
	set_cert_ssl: function (certName, siteName, callback) {
		var loadT = bt.load('正在部署证书...');
		bt.send(
			'SetCertToSite',
			'ssl/SetCertToSite',
			{
				certName: certName,
				siteName: siteName,
			},
			function (rdata) {
				loadT.close();
				site.reload();
				if (callback) callback(rdata);
				bt.msg(rdata);
			}
		);
	},
	remove_cert_ssl: function (certName, callback) {
		bt.compute_confirm({ title: '删除证书夹证书【' + certName + '】', msg: '删除选中的证书后，该证书将不会显示在证书夹，是否继续操作？' }, function () {
			var loadT = bt.load(lan.site.the_msg);
			bt.send(
				'RemoveCert',
				'ssl/RemoveCert',
				{
					certName: certName,
				},
				function (rdata) {
					loadT.close();
					if (callback) callback(rdata);
					bt.msg(rdata);
				}
			);
		});
	},
	set_http_to_https: function (siteName, callback) {
		var loading = bt.load();
		bt.send(
			'HttpToHttps',
			'site/HttpToHttps',
			{
				siteName: siteName,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
				bt.msg(rdata);
			}
		);
	},
	close_http_to_https: function (siteName, callback) {
		var loading = bt.load();
		bt.send(
			'CloseToHttps',
			'site/CloseToHttps',
			{
				siteName: siteName,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
				bt.msg(rdata);
			}
		);
	},
	set_ssl: function (siteName, data, callback) {
		if (data.path) {
			//iis导入证书
		} else {
			var loadT = bt.load(lan.site.saving_txt);
			bt.send(
				'SetSSL',
				'site/SetSSL',
				{
					type: 1,
					siteName: siteName,
					key: data.key,
					csr: data.csr,
				},
				function (rdata) {
					loadT.close();
					if (callback) callback(rdata);
				}
			);
		}
	},
	set_ssl_status: function (action, siteName, callback) {
		var loadT = bt.load(lan.site.get_ssl_list);
		bt.send(
			action,
			'site/' + action,
			{
				updateOf: 1,
				siteName: siteName,
			},
			function (rdata) {
				loadT.close();
				if (callback) callback(rdata);
			}
		);
	},
	get_cer_list: function (callback) {
		var loadT = bt.load(lan.site.the_msg);
		bt.send('GetCertList', 'ssl/GetCertList', {}, function (rdata) {
			loadT.close();
			if (callback) callback(rdata);
		});
	},
	get_order_list: function (siteName, callback) {
		bt.send(
			'GetOrderList',
			'ssl/GetOrderList',
			{
				siteName: siteName,
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
	del_site: function (data, callback) {
		var loadT = bt.load(lan.get('del_all_task_the', [data.webname]));
		bt.send('DeleteSite', 'site/DeleteSite', data, function (rdata) {
			loadT.close();
			if (callback) callback(rdata);
		});
	},
	add_site: function (callback) {
		var _form = $.extend(true, {}, bt.data.site.add);
		bt.site.get_all_phpversion(function (rdata) {
			bt.site.get_type(function (tdata) {
				for (var i = 0; i < _form.list.length; i++) {
					if (_form.list[i].name == 'version') {
						var items = [];
						for (var j = rdata.length - 1; j >= 0; j--) {
							var o = rdata[j];
							o.value = o.version;
							o.title = o.name;
							items.push(o);
						}
						_form.list[i].items = items;
					} else if (_form.list[i].name == 'type_id') {
						for (var x = 0; x < tdata.length; x++)
							_form.list[i].items.push({
								value: tdata[x].id,
								title: tdata[x].name,
							});
					}
				}
				var bs = bt.render_form(_form, function (rdata) {
					if (callback) callback(rdata);
				});
				$('.placeholder').click(function () {
					$(this).hide();
					$('.webname' + bs).focus();
				});
				$('.path' + bs).val($('#defaultPath').text());
				$('.webname' + bs).focus(function () {
					$('.placeholder').hide();
				});
				$('.webname' + bs).blur(function () {
					if ($(this).val().length == 0) {
						$('.placeholder').show();
					}
				});
			});
		});
	},
	get_all_phpversion: function (callback) {
		bt.send(
			'GetPHPVersion',
			'site/GetPHPVersion',
			{
				s_type: 1,
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
	get_site_phpversion: function (siteName, callback) {
		bt.send(
			'GetSitePHPVersion',
			'site/GetSitePHPVersion',
			{
				siteName: siteName,
			},
			function (rdata) {
				if (callback) callback(rdata);
			}
		);
	},
	stop: function (id, name, callback) {
		bt.simple_confirm(
			{
				title: '停用站点【' + name + '】',
				msg: '停用站点后将无法正常访问，用户访问会显示当前网站停用后的提示页，是否继续操作？\
					<div class="mt10 flex align-center"><input type="checkbox" id="joinStop" class="jsCheckbox"><label for="joinStop" style="font-weight: 400;margin: 0 0 0 5px;cursor: pointer;">是否加入停止分类？</label></div>', //lan.site.site_stop_txt
			},
			function (index) {
				var isCheck = $('#joinStop').is(':checked')
				if (index > 0) {
					var loadT = bt.load();
					bt.send(
						'SiteStop',
						'site/SiteStop',
						{
							id: id,
							name: name,
							type_id: isCheck ? -2 : ''
						},
						function (ret) {
							loadT.close();
							if (site && typeof callback == 'undefined') {
								site.get_list();
							} else {
								if (callback) callback(ret,isCheck);
							}
							bt.msg(ret);
						}
					);
				}
			}
		);
	},
	start: function (id, name, callback) {
		bt.simple_confirm(
			{
				title: '启动站点【' + name + '】',
				msg: '启用当前站点后，用户可以正常访问网站内容，是否继续操作？', //lan.site.site_start_txt
			},
			function (index) {
				if (index > 0) {
					var loadT = bt.load();
					bt.send(
						'SiteStart',
						'site/SiteStart',
						{
							id: id,
							name: name,
						},
						function (ret) {
							loadT.close();
							if (site && typeof callback == 'undefined') {
								site.get_list();
							} else {
								if (callback) callback(ret);
							}
							bt.msg(ret);
						}
					);
				}
			}
		);
	},
	backup_data: function (id, callback) {
		var loadT = bt.load(lan.database.backup_the);
		bt.send(
			'ToBackup',
			'site/ToBackup',
			{
				id: id,
			},
			function (rdata) {
				loadT.close();
				bt.msg(rdata);
				if (callback) callback(rdata);
			}
		);
	},
	del_backup: function (id, siteId, siteName) {
		bt.confirm(
			{
				msg: lan.site.webback_del_confirm,
				title: lan.site.del_bak_file,
			},
			function (index) {
				var loadT = bt.load();
				bt.send(
					'DelBackup',
					'site/DelBackup',
					{
						id: id,
					},
					function (frdata) {
						loadT.close();
						if (frdata.status) {
							if (site) site.site_detail(siteId, siteName);
						}
						bt.msg(frdata);
					}
				);
			}
		);
	},
	set_endtime: function (id, dates, callback) {
		var loadT = bt.load(lan.site.saving_txt);
		bt.send(
			'SetEdate',
			'site/SetEdate',
			{
				id: id,
				edate: dates,
			},
			function (rdata) {
				loadT.close();
				if (callback) callback(rdata);
			}
		);
	},
	set_other_endtime: function (id, edate, callback) {
		bt_tools.send({
			url:'/project/go/set_site_etime_multiple',
			data:{
				sites_id:id,
				edate:edate,
			}
		},function (rdata) {
			if (callback) callback(rdata);
		})
	},
	get_default_path: function (type, callback) {
		var vhref = '';
		if (bt.os == 'Linux') {
			switch (type) {
				case 0:
					vhref = '/www/server/panel/data/defaultDoc.html';
					break;
				case 1:
					vhref = '/www/server/panel/data/404.html';
					break;
				case 2:
					var type = '';
					try {
						type = bt.get_cookie('serverType') || serverType;
					} catch (err) {}
					vhref = '/www/server/apache/htdocs/index.html';
					if (type == 'nginx') vhref = '/www/server/nginx/html/index.html';
					break;
				case 3:
					vhref = '/www/server/stop/index.html';
					break;
			}
		}
		if (callback) callback(vhref);
	},
	get_default_site: function (callback) {
		var loading = bt.load();
		bt.send('GetDefaultSite', 'site/GetDefaultSite', {}, function (rdata) {
			loading.close();
			if (callback) callback(rdata);
		});
	},
	set_default_site: function (name, callback) {
		var loading = bt.load();
		bt.send(
			'SetDefaultSite',
			'site/SetDefaultSite',
			{
				name: name,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	get_dir_auth: function (id, callback) {
		var loading = bt.load();
		bt.send(
			'get_dir_auth',
			'site/get_dir_auth',
			{
				id: id,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	create_dir_guard: function (data, callback) {
		var loading = bt.load();
		bt.send(
			'set_dir_auth',
			'site/set_dir_auth',
			{
				id: data.id,
				name: data.name,
				site_dir: data.site_dir,
				username: data.username,
				password: data.password,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	edit_dir_account: function (data, callback) {
		var loading = bt.load();
		bt.send(
			'modify_dir_auth_pass',
			'site/modify_dir_auth_pass',
			{
				id: data.id,
				name: data.name,
				username: data.username,
				password: data.password,
			},
			function (rdata) {
				loading.close();
				if (callback) callback(rdata);
			}
		);
	},
	delete_dir_guard: function (id, data, callback) {
		bt.compute_confirm({ title: '删除加密访问规则【' + data + '】', msg: '删除选中的规则后，访问' + data + '将不再需要安全验证，是否继续操作？' }, function () {
			var loading = bt.load();
			bt.send(
				'delete_dir_auth',
				'site/delete_dir_auth',
				{
					id: id,
					name: data,
				},
				function (rdata) {
					loading.close();
					if (callback) callback(rdata);
				}
			);
		});
	},
	delete_php_guard: function (website, data, callback) {
		bt.compute_confirm({ title: '删除禁止访问规则【' + data + '】', msg: '删除选中的规则后，该保护目录将失去防护，是否继续操作？' }, function () {
			var loading = bt.load();
			bt.send(
				'del_file_deny',
				'config/del_file_deny',
				{
					website: website,
					deny_name: data,
				},
				function (rdata) {
					loading.close();
					if (callback) callback(rdata);
				}
			);
		});
	},
};

bt.form = {
	btn: {
		close: function (title, callback) {
			var obj = {
				title: '关闭',
				name: 'btn-danger',
			};
			if (title) obj.title = title;
			if (callback) obj['callback'] = callback;
			return obj;
		},
		submit: function (title, callback) {
			var obj = {
				title: '提交',
				name: 'submit',
				css: 'btn-success',
			};
			if (title) obj.title = title;
			if (callback) obj['callback'] = callback;
			return obj;
		},
	},
	item: {
		data_access: {
			title: '访问权限',
			items: [
				{
					name: 'dataAccess',
					type: 'select',
					width: '200px',
					items: [
						{
							title: '本地服务器',
							value: '127.0.0.1',
						},
						{
							title: '所有人(不安全)',
							value: '%',
						},
						{
							title: '指定IP',
							value: 'ip',
						},
					],
					callback: function (obj) {
						var subid = obj.attr('name') + '_subid';
						$('#' + subid).remove();
						if (obj.val() == 'ip') {
							obj
								.parent()
								.append(
									'<textarea id="' +
									subid +
									'" class="bt-input-text mr5" type="text" name="address" placeholder="如需填写多个IP，请换行填写，每行一个IP" style="line-height: 20px;width: 200px;height: 160px; display: block;margin-top: 10px;"></textarea>'
								);
						}
					},
				},
			],
		},
		password: {
			title: '密码',
			name: 'password',
			items: [
				{
					type: 'text',
					width: '311px',
					value: bt.get_random(16),
					event: {
						css: 'glyphicon-repeat',
						callback: function (obj) {
							bt.refresh_pwd(16, obj);
						},
					},
				},
			],
		},
	},
};

bt.data = {
	db_tab_name: bt.get_cookie('db_page_model') || 'mysql', //当前数据库类型
	database: {
		root: {
			title: lan.database.edit_pass_title,
			area: '530px',
			list: [
				{
					title: 'root密码',
					name: 'password',
					items: [
						{
							type: 'text',
							width: '311px',
							event: {
								css: 'glyphicon-repeat',
								callback: function (obj) {
									bt.refresh_pwd(16, obj);
								},
							},
						},
					],
				},
			],
			btns: [
				bt.form.btn.close(),
				bt.form.btn.submit('提交', function (rdata, load) {
					var loading = bt.load(),
						param = { url: 'database/' + bt.data.db_tab_name + '/SetupPassword', data: { data: JSON.stringify(rdata) } };
					if (bt.data.db_tab_name == 'mysql') param = { url: 'database?action=SetupPassword', data: rdata };
					bt_tools.send(param, function (rRet) {
						loading.close();
						bt.msg(rRet);
						if (rRet.status) load.close();
					});
				}),
			],
		},
		mongo: {
			title: lan.database.edit_pass_title,
			area: '530px',
			list: [
				{
					title: 'root密码',
					name: 'password',
					items: [
						{
							type: 'text',
							width: '311px',
							event: {
								css: 'glyphicon-repeat',
								callback: function (obj) {
									bt.refresh_pwd(16, obj);
								},
							},
						},
					],
				},
			],
			btns: [
				bt.form.btn.close(),
				bt.form.btn.submit('提交', function (rdata, load) {
					var loading = bt.load(),
						url = 'database/' + bt.data.db_tab_name + '/set_auth_status';
					if (bt.data.db_tab_name == 'pgsql') url = 'database/' + bt.data.db_tab_name + '/set_root_pwd';
					bt_tools.send({ url: url, data: { data: JSON.stringify($.extend(rdata, { status: 1 })) } }, function (rRet) {
						loading.close();
						bt.msg(rRet);
						load.close();
					});
				}),
			],
		},
		data_add: {
			title: lan.database.add_title,
			area: '530px',
			list: [
				{
					title: '数据库名',
					items: [
						{
							name: 'name',
							placeholder: '新的数据库名称',
							type: 'text',
							width: '65%',
							callback: function (obj) {
								$('input[name="db_user"]').val(obj.val());
							},
						},
						{
							name: 'codeing',
							type: 'select',
							width: '27%',
							items: [
								{
									title: 'utf8mb4',
									value: 'utf8mb4',
								},
								{
									title: 'utf-8',
									value: 'utf8',
								},
								{
									title: 'gbk',
									value: 'gbk',
								},
								{
									title: 'big5',
									value: 'big5',
								},
							],
						},
					],
				},
				{
					title: '用户名',
					name: 'db_user',
					placeholder: '数据库用户',
					width: '65%',
				},
				bt.form.item.password,
				bt.form.item.data_access,
				{
					title: '添加至',
					class:'add_to_db',
					items: [
						{
							name: 'sid',
							type: 'select',
							width: '65%',
							items: [],
						},
					],
				},
				{
					name: 'db_status',
					type: 'other',
					display: false,
					boxcontent:'<div class="db_status_row">\
								<span class="db_status_icon status_icon status_success"></span>\
								<span class="db_status_type">本地服务器</span>状态：\
								<span class="db_status_text">正常</span>\
								<span class="btlink status_refresh status_icon click_status_check"></span>\
								<span class="btlink click_status_check">检测</span>\
								</div>',
				}
			],
			yes: function () {
				$('[name=sid]').after('<a class="btlink" onclick="layer.closeAll();db_public_fn.get_cloud_server_list()" style="margin-left: 10px;">管理远程服务器</a>');
				if (bt.data.db_tab_name == 'mongodb') {
					if (!mongoDBAccessStatus) {
						$('.layui-layer.layui-layer-page .line').eq(1).hide();
						$('.layui-layer.layui-layer-page .line').eq(2).hide();
					}

					// 远程服务器类型判断
					$('[name=sid]').change(function () {
						//为远程服务器时,默认开启安全认证
						if ($(this).val() != 0) {
							$('.layui-layer.layui-layer-page .line').eq(1).show();
							$('.layui-layer.layui-layer-page .line').eq(2).show();
						} else {
							if (!mongoDBAccessStatus) {
								$('.layui-layer.layui-layer-page .line').eq(1).hide();
								$('.layui-layer.layui-layer-page .line').eq(2).hide();
							}
						}
					});
				}
			},
			btns: [
				bt.form.btn.close(),
				bt.form.btn.submit('提交', function (rdata, load, callback) {
					if($('.db_status_row').find('.db_status_icon').hasClass('status_abnormal')){
						return layer.msg('数据库状态异常，请检查数据库状态后重试!',{icon:2,closeBtn:2})
					}
					if (!rdata.address) rdata.address = rdata.dataAccess;
					if (!rdata.ps) rdata.ps = rdata.name;
					if (bt.data.db_tab_name == 'mongodb' && !mongoDBAccessStatus && $('[name=sid]').val() == 0) {
						delete rdata['db_user'];
						delete rdata['password'];
					}

					var loading = bt.load(),
						param = { url: 'database/' + bt.data.db_tab_name + '/AddDatabase', data: { data: JSON.stringify(rdata) } };
					if (bt.data.db_tab_name == 'mysql') {
						rdata['dtype'] = 'MySQL';
						param = { url: 'database?action=AddDatabase', data: rdata };
					}
					if(rdata.sid === '0'){
						if(bt.data.db_tab_name == 'pgsql') bt.data.db_tab_name = 'pgsql_manager'
						bt.database.check_database_status(bt.data.db_tab_name,function(sdata){
							if(bt.data.db_tab_name == 'pgsql_manager') bt.data.db_tab_name = 'pgsql'
							if(sdata){
								bt_tools.send(param, function (rRet) {
									loading.close();
									if (rRet.status) load.close();
									if (callback) callback(rRet);
									bt.msg(rRet);
								});
							}else{
								bt.confirm({msg:'当前数据库服务状态未开启，是否开启？',title:'提示'},function(){
									bt.load('正在开启'+ bt.data.db_tab_name +'服务,请稍候...')
									if(bt.data.db_tab_name == 'mongodb'){
										bt_tools.send({url:'/plugin?action=a&name=mongodb&s=service_admin',data:{status: 1}}, function (mdata) {
											if(mdata.status){
												bt_tools.msg({msg:bt.data.db_tab_name+'服务已启动',status:true})
												setTimeout(function(){
													bt_tools.send(param, function (rRet) {
														loading.close();
														if (rRet.status) load.close();
														if (callback) callback(rRet);
														bt.msg(rRet);
													});
												},1000)
											}else{
												bt_tools.msg({msg:bt.data.db_tab_name+'服务启动失败',status:false})
											}
										})
									}else{
										var send_name = bt.data.db_tab_name
										if(bt.data.db_tab_name == 'mysql') send_name = 'mysqld'
										if(send_name == 'pgsql_manager') send_name = 'pgsql'
										bt.send('ServiceAdmin', 'system/ServiceAdmin', {name: send_name,type: 'start'}, function (fdata) {
											if(fdata.status){
												bt_tools.msg({msg:send_name+'服务已启动',status:true})
												setTimeout(function(){
													bt_tools.send(param, function (rRet) {
														loading.close();
														if (rRet.status) load.close();
														if (callback) callback(rRet);
														bt.msg(rRet);
													});
												},1000)
											}else{
												bt_tools.msg({msg:'服务启动失败',status:false})
												return
											}
										})
									}
								})
							}
						})
					}else{
						bt_tools.send(param, function (rRet) {
							loading.close();
							if (rRet.status) load.close();
							if (callback) callback(rRet);
							bt.msg(rRet);
						});
					}
				}),
			],
		},
		data_access: {
			title: '设置数据库权限',
			area: '380px',
			list: [
				{
					title: 'name',
					name: 'name',
					hide: true,
				},
				bt.form.item.data_access,
			],
			btns: [
				bt.form.btn.close(),
				{
					title: '提交',
					name: 'submit',
					css: 'btn-success',
					callback: function (rdata, load) {
						rdata.access = rdata.dataAccess;
						var flag = false;
						if (rdata.access == 'ip'){
							var list = rdata.address.split('\n');
							$(list).each(function(index,item){
								if(!bt.check_ip(item)){
									bt.msg({status:false,msg:'IP地址【'+item+'】格式不正确，请重新输入!'});
									flag = true;
								}else {
									flag = false;
								}
							})
							if(flag) return;
							var address = rdata.address.replace(/\n/g,',')
							rdata.address = address;
							rdata.access = address;
							// rdata.address = rdata.address.replace('\n',',');
							// rdata.access = rdata.address;
						}
						var loading = bt.load(),
							param = { url: 'database/' + bt.data.db_tab_name + '/SetDatabaseAccess', data: { data: JSON.stringify(rdata) } };
						if (bt.data.db_tab_name == 'mysql') param = { url: 'database?action=SetDatabaseAccess', data: rdata };
						if(rdata.access == '%'){
							layer.open({
								type: 1,
								title:'权限设置提醒',
								area:['400px'],
								btn:['确定','取消'],
								content:'<div class="hint_confirm pd20"><div class="hint_title">\
															<i class="hint-confirm-icon"></i>\
															<div class="hint_con">\
																<span>设置权限为所有人后，将会导致数据库安全性降低，他人可以随意访问数据库，是否继续操作？</span>\
															</div>\
													</div></div>',
								yes:function(index){
									layer.close(index);
									bt_tools.send(param, function (rRet) {
										loading.close();
										bt.msg(rRet);
										if (rRet.status) load.close();
									});
								}
							})
							loading.close();
							return
						}
						bt_tools.send(param, function (rRet) {
							loading.close();
							bt.msg(rRet);
							if (rRet.status) load.close();
						});
					},
				},
			],
		},
		data_pass: {
			title: '修改数据库密码',
			area: '530px',
			list: [
				{
					title: 'id',
					name: 'id',
					hide: true,
				},
				{
					title: '用户名',
					name: 'name',
					disabled: true,
				},
				{
					title: '密码',
					name: 'password',
					items: [
						{
							type: 'text',
							event: {
								css: 'glyphicon-repeat',
								callback: function (obj) {
									bt.refresh_pwd(16, obj);
								},
							},
						},
					],
				},
			],
			btns: [
				{
					title: '关闭',
					name: 'close',
				},
				{
					title: '提交',
					name: 'submit',
					css: 'btn-success',
					callback: function (rdata, load, callback) {
						var loading = bt.load(),
							param = { url: 'database/' + bt.data.db_tab_name + '/ResDatabasePassword', data: { data: JSON.stringify(rdata) } };
						if (bt.data.db_tab_name == 'mysql') param = { url: 'database?action=ResDatabasePassword', data: rdata };
						bt_tools.send(param, function (rRet) {
							loading.close();
							bt.msg(rRet);
							if (rRet.status) load.close();
							if (callback) callback(rRet);
						});
					},
				},
			],
		},
	},
	site: {
		add: {
			title: lan.site.site_add,
			area: '640px',
			list: [
				{
					title: '域名',
					name: 'webname',
					items: [
						{
							type: 'textarea',
							width: '458px',
							callback: function (obj) {
								var array = obj.val().split('\n');
								var ress = array[0].split(':')[0];
								var res = bt.strim(ress.replace(new RegExp(/([-.])/g), '_'));
								var ftp_user = res;
								var data_user = res;
								if (!isNaN(res.substr(0, 1))) {
									ftp_user = 'ftp_' + ftp_user;
									data_user = 'sql_' + data_user;
								}
								if (data_user.length > 16) data_user = data_user.substr(0, 16);
								obj.data('ftp', ftp_user);
								obj.data('database', data_user);

								$('.ftp_username').val(ftp_user);
								$('.datauser').val(data_user);

								var _form = obj.parents('div.bt-form');
								var _path_obj = _form.find('input[name="path"]');
								var path = _path_obj.val();
								var defaultPath = $('#defaultPath').text();
								var dPath = bt.rtrim(defaultPath, '/');
								if (path.substr(0, dPath.length) == dPath) _path_obj.val(dPath + '/' + ress);
								_form.find('input[name="ps"]').val(ress);
							},
							placeholder: '每行填写一个域名，默认为80端口<br>泛解析添加方法：先添加一个域名 domain.com，后换行添加*.domain.com<br>如另加端口格式为 www.domain.com:88',
						},
					],
				},
				{
					title: '备注',
					name: 'ps',
					placeholder: '网站备注',
				},
				{
					title: '根目录',
					name: 'path',
					items: [
						{
							type: 'text',
							width: '330px',
							event: {
								css: 'glyphicon-folder-open',
								callback: function (obj) {
									bt.select_path(obj);
								},
							},
						},
					],
				},
				{
					title: 'FTP',
					items: [
						{
							name: 'ftp',
							type: 'select',
							items: [
								{
									value: 'false',
									title: '不创建',
								},
								{
									value: 'true',
									title: '创建',
								},
							],
							callback: function (obj) {
								var subid = obj.attr('name') + '_subid';
								$('#' + subid).remove();
								if (obj.val() == 'true') {
									var _bs = obj.parents('div.bt-form').attr('data-id');
									var ftp_user = $('textarea[name="webname"]').data('ftp');
									var item = {
										title: 'FTP设置',
										items: [
											{
												name: 'ftp_username',
												title: '用户名',
												width: '173px',
												value: ftp_user,
											},
											{
												name: 'ftp_password',
												title: '密码',
												width: '173px',
												value: bt.get_random(16),
											},
										],
										ps: '创建站点的同时，为站点创建一个对应FTP帐户，并且FTP目录指向站点所在目录。',
									};
									var _tr = bt.render_form_line(item);

									obj.parents('div.line').append('<div class="line" id=' + subid + '>' + _tr.html + '</div>');
								}
							},
						},
					],
				},
				{
					title: '数据库',
					items: [
						{
							name: 'sql',
							type: 'select',
							items: [
								{
									value: 'false',
									title: '不创建',
								},
								{
									value: 'MySQL',
									title: 'MySQL',
								},
								{
									value: 'SQLServer',
									title: 'SQLServer',
								},
							],
							callback: function (obj) {
								var subid = obj.attr('name') + '_subid';
								$('#' + subid).remove();
								if (obj.val() != 'false') {
									if (bt.os == 'Linux' && obj.val() == 'SQLServer') {
										obj.val('false');
										bt.msg({
											msg: 'Linux暂不支持SQLServer!',
											icon: 2,
										});
										return;
									}
									var _bs = obj.parents('div.bt-form').attr('data-id');
									var data_user = $('textarea[name="webname"]').data('database');
									var item = {
										title: '数据库设置',
										items: [
											{
												name: 'datauser',
												title: '用户名',
												width: '173px',
												value: data_user,
											},
											{
												name: 'datapassword',
												title: '密码',
												width: '173px',
												value: bt.get_random(16),
											},
										],
										ps: '创建站点的同时，为站点创建一个对应的数据库帐户，方便不同站点使用不同数据库。',
									};
									var _tr = bt.render_form_line(item);
									obj.parents('div.line').append('<div class="line" id=' + subid + '>' + _tr.html + '</div>');
								}
							},
						},
						{
							name: 'codeing',
							type: 'select',
							items: [
								{
									value: 'utf8',
									title: 'utf-8',
								},
								{
									value: 'utf8mb4',
									title: 'utf8mb4',
								},
								{
									value: 'gbk',
									title: 'gbk',
								},
								{
									value: 'big5',
									title: 'big5',
								},
							],
						},
					],
				},
				{
					title: '程序类型',
					type: 'select',
					name: 'type',
					disabled: bt.contains(bt.get_cookie('serverType'), 'IIS') ? false : true,
					items: [
						{
							value: 'PHP',
							title: 'PHP',
						},
						{
							value: 'Asp',
							title: 'Asp',
						},
						{
							value: 'Aspx',
							title: 'Aspx',
						},
					],
					callback: function (obj) {
						if (obj.val() == 'Asp' || obj.val() == 'Aspx') {
							obj.parents('div.line').next().hide();
						} else {
							obj.parents('div.line').next().show();
						}
					},
				},
				{
					title: 'PHP版本',
					name: 'version',
					type: 'select',
					items: [
						{
							value: '00',
							title: '纯静态',
						},
					],
				},
				{
					title: '网站分类',
					name: 'type_id',
					type: 'select',
					items: [],
				},
			],
			btns: [
				{
					title: '关闭',
					name: 'close',
				},
				{
					title: '提交',
					name: 'submit',
					css: 'btn-success',
					callback: function (rdata, load, callback) {
						var loading = bt.load();
						if (!rdata.webname) {
							bt.msg({
								msg: '主域名格式不正确',
								icon: 2,
							});
							return;
						}
						var webname = bt.replace_all(rdata.webname, 'http:\\/\\/', '');
						webname = bt.replace_all(webname, 'https:\\/\\/', '');
						var arrs = webname.split('\n');
						var list = [];
						var domain_name, port;
						for (var i = 0; i < arrs.length; i++) {
							if (arrs[i]) {
								var temp = arrs[i].split(':');
								var item = {};
								item['name'] = temp[0];
								item['port'] = temp.length > 1 ? temp[1] : 80;
								if (!bt.check_domain(item.name)) {
									bt.msg({
										msg: lan.site.domain_err_txt,
										icon: 2,
									});
									return;
								}
								if (i > 0) {
									list.push(arrs[i]);
								} else {
									domain_name = item.name;
									port = item.port;
								}
							}
						}
						var domain = {};
						domain['domain'] = domain_name;
						domain['domainlist'] = list;
						domain['count'] = list.length;
						rdata.webname = JSON.stringify(domain);
						rdata.port = port;
						bt.send('AddSite', 'site/AddSite', rdata, function (rRet) {
							loading.close();
							if (rRet.siteStatus) load.close();
							if (callback) callback(rRet);
						});
					},
				},
			],
		},
	},
	ftp: {
		add: {
			title: lan.ftp.add_title,
			area: '530px',
			list: [
				{
					title: '用户名',
					name: 'ftp_username',
					callback: function (obj) {
						var defaultPath = $('#defaultPath').text();
						var wootPath = bt.rtrim(defaultPath, '/');
						if (bt.contains($('input[name="path"]').val(), wootPath)) {
							$('input[name="path"]').val(wootPath + '/' + obj.val());
						}
					},
				},
				{
					title: '密码',
					name: 'ftp_password',
					items: [
						{
							type: 'text',
							width: '330px',
							value: bt.get_random(16),
							event: {
								css: 'glyphicon-repeat',
								callback: function (obj) {
									bt.refresh_pwd(16, obj);
								},
							},
						},
					],
				},
				{
					title: '根目录',
					name: 'path',
					items: [
						{
							type: 'text',
							event: {
								css: 'glyphicon-folder-open',
								callback: function (obj) {
									bt.select_path(obj);
								},
							},
						},
					],
				},
			],
			btns: [
				{
					title: '关闭',
					name: 'close',
				},
				{
					title: '提交',
					name: 'submit',
					css: 'btn-success',
					callback: function (rdata, load, callback) {
						var loading = bt.load();
						if (!rdata.ps) rdata.ps = rdata.ftp_username;
						bt.send('AddUser', 'ftp/AddUser', rdata, function (rRet) {
							loading.close();
							if (rRet.status) load.close();
							if (callback) callback(rRet);
							bt.msg(rRet);
						});
					},
				},
			],
		},
		set_port: {
			title: lan.ftp.port_title,
			skin: '',
			area: '500px',
			list: [
				{
					title: '默认端口',
					name: 'port',
					width: '250px',
				},
			],
			btns: [
				{
					title: '关闭',
					name: 'close',
				},
				{
					title: '提交',
					name: 'submit',
					css: 'btn-success',
					callback: function (rdata, load, callback) {
						var loading = bt.load();
						if (!bt.check_port(rdata.port)) {
							layer.msg('端口格式错误，可用范围：1-65535, <br />请避免使用以下端口【22,80,443,8080,8443,8888】', { icon: 2 });
							return;
						}
						bt.send('setPort', 'ftp/setPort', rdata, function (rRet) {
							loading.close();
							if (rRet.status) load.close();
							if (callback) callback(rRet);
							bt.msg(rRet);
						});
					},
				},
			],
		},
		set_password: {
			title: lan.ftp.pass_title,
			area: '530px',
			list: [
				{
					title: 'id',
					name: 'id',
					hide: true,
				},
				{
					title: '用户名',
					name: 'ftp_username',
					disabled: true,
				},
				{
					title: '密码',
					name: 'new_password',
					items: [
						{
							type: 'text',
							event: {
								css: 'glyphicon-repeat',
								callback: function (obj) {
									bt.refresh_pwd(16, obj);
								},
							},
						},
					],
				},
			],
			btns: [
				{
					title: '关闭',
					name: 'close',
				},
				{
					title: '提交',
					name: 'submit',
					css: 'btn-success',
					callback: function (rdata, load, callback) {
						bt.confirm(
							{
								msg: lan.ftp.pass_confirm,
								title: lan.ftp.stop_title,
							},
							function () {
								var loading = bt.load();
								bt.send('SetUserPassword', 'ftp/SetUserPassword', rdata, function (rRet) {
									loading.close();
									if (rRet.status) load.close();
									if (callback) callback(rRet);
									bt.msg(rRet);
								});
							}
						);
					},
				},
			],
		},
	},
};
var form_group = {
	select_all: function (_arry) {
		for (var j = 0; j < _arry.length; j++) {
			this.select(_arry[j]);
		}
	},
	select: function (elem) {
		$(elem).after(
			'<div class="bt_select_group"><div class="bt_select_active"><span class="select_val default">请选择</span><span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span> </div><ul class="bt_select_ul"></ul></div>'
		);
		var _html = '',
			select_el = $(elem),
			select_group = select_el.next(),
			select_ul = select_group.find('.bt_select_ul'),
			select_val = select_group.find('.select_val'),
			select_icon = select_group.find('.glyphicon');
		php_data = {
			4.4: ['5.4'],
			4.9: ['5.6', '7.0'],
			5.1: ['7.1'],
			5.2: ['7.2', '7.3', '7.4', '8.0', '8.1'],
		};
		select_el.find('option').each(function (index, el) {
			var active = select_el.val() === $(el).val(),
				_val = $(el).val(),
				_name = $(el).text();
			_html += '<li data-val="' + _val + '" class="' + (active ? 'active' : '') + '">' + _name + '</li>';
			if (active) {
				select_val.text(_name);
				_val !== '' ? select_val.removeClass('default') : select_val.addClass('default');
			}
		});
		select_el.hide();
		select_ul.html(_html);
		$(elem)
			.next('.bt_select_group')
			.find('.bt_select_active')
			.unbind('click')
			.click(function (e) {
				if (!$(this).next().hasClass('active')) {
					$(this)
						.parents()
						.find('li')
						.siblings()
						.find('.bt_select_ul.active')
						.each(function () {
							is_show_slect_parent(this);
						});
					$(this)
						.parents('.rec-box')
						.siblings()
						.find('.bt_select_ul.active')
						.each(function () {
							is_show_slect_parent(this);
						});
				}
				is_show_select_ul($(this).next().hasClass('active'));
				$(document).click(function (ev) {
					is_show_select_ul(true);
					$(this).unbind('click');
					ev.stopPropagation();
					ev.preventDefault();
				});
				e.stopPropagation();
				e.preventDefault();
			});

		$(elem)
			.next('.bt_select_group')
			.on('click', '.bt_select_ul li', function () {
				var _val = $(this).attr('data-val'),
					_name = $(this).text();
				$(this).addClass('active').siblings().removeClass('active');
				_val !== '' ? select_val.removeClass('default') : select_val.addClass('default');
				select_val.text(_name);
				select_el.val(_val);
				$(elem)
					.find('option[value="' + _val + '"]')
					.change();
				is_show_select_ul(true);
				// 根据php版本筛选phpMyAdmin
				var is_php = elem.indexOf('select_PHP') !== -1;
				if (is_php) {
					var php_my_admin_data = [];
					for (var key in php_data) {
						for (var i = 0; i < php_data[key].length; i++) {
							if (php_data[key][i] === _val) {
								php_my_admin_data.push(key);
								break;
							}
						}
					}
					var _select_html = '',
						_ul_html = '',
						$select_ul;
					$.each(php_my_admin_data, function (index, item) {
						_select_html += '<option value="' + item + '">phpMyAdmin ' + item + '</option>';
						_ul_html += '<li data-val="' + item + '" class="">phpMyAdmin ' + item + '</li>';
					});
					if (elem.indexOf('apache') !== -1) {
						$('#apache_select_phpMyAdmin').html(_select_html);
						$select_ul = $('#apache_select_phpMyAdmin').next().find('.bt_select_ul');
					} else {
						$('#select_phpMyAdmin').html(_select_html);
						$select_ul = $('#select_phpMyAdmin').next().find('.bt_select_ul');
					}
					$select_ul.html(_ul_html);
					if (_ul_html) $select_ul.find('li').eq(0).click();
				}
			});

		function is_show_slect_parent(that) {
			$(that).removeClass('active fadeInUp animated');
			$(that).prev().find('.glyphicon').removeAttr('style');
			$(that).parent().removeAttr('style');
		}

		function is_show_select_ul(active) {
			if (active) {
				select_group.removeAttr('style');
				select_icon.css({
					transform: 'rotate(0deg)',
				});
				select_ul.removeClass('active fadeInUp animated');
			} else {
				select_group.css('borderColor', '#20a53a');
				select_icon.css({
					transform: 'rotate(180deg)',
				});
				select_ul.addClass('active fadeInUp animated');
			}
		}
	},
	checkbox: function () {
		$('input[type="checkbox"]').each(function (index, el) {
			$(el).hide();
			$(el).after('<div class="bt_checkbox_group ' + ($(this).prop('checked') ? 'active' : 'default') + '"></div>');
		});
		$('.bt_checkbox_group').click(function () {
			$(this).prev().click();
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
				$(this).prev().removeAttr('checked');
			} else {
				$(this).addClass('active');
				$(this).prev().attr('checked', 'checked');
			}
		});
	},
};

var dynamic = {
	loadList: [],
	fileFunList: {},
	load: false,
	callback: null,

	// 初始化执行
	execution: function () {
		for (var i = 0; i < this.loadList.length; i++) {
			var fileName = this.loadList[i];
			if (fileName in this.fileFunList) this.fileFunList[fileName]();
		}
	},

	/**
	 * @description 动态加载js,css文件
	 * @param url {string|array} 文件路径或文件数组
	 * @param fn {function|undefined} 回调函数
	 */
	require: function (url, fn, config) {
		var urlList = url,
			total = 0,
			num = 0,
			that = this;
		if (!Array.isArray(url)) urlList = [url];
		total = urlList.length;
		this.load = true;
		this.fileFunList = {};
		function createElement(url) {
			var element = null;
			if (url.indexOf('.js') > -1) {
				element = document.createElement('script');
				element.type = 'text/javascript';
				element.src = bt.url_merge('/vue/' + url);
			} else if (url.indexOf('.css') > -1) {
				element = document.createElement('link');
				element.rel = 'stylesheet';
				element.href = bt.url_merge('/vue/' + url);
			}
			return element;
		}
		for (var i = 0; i < urlList.length; i++) {
			var item = urlList[i],
				dirArray = item.split('/'),
				filName = dirArray[dirArray.length - 1].split('.')[0];
			if (this.loadList.indexOf(filName) > -1) break;
			this.loadList.push(filName);
			(function (url) {
				var element = createElement(url);
				if (element.readyState) {
					element.onreadystatechange = function (ev) {
						if (element.readyState === 'loaded' || element.readyState === 'complete') {
							element.onreadystatechange = null;
							num++;
							if (total === num) {
								that.execution();
								if (fn) {
									fn.call(that);
								}
								that.load = false;
							}
						}
					};
				} else {
					element.onload = function (ev) {
						that.loadList[filName] = that.fn;
						num++;
						if (total === num) {
							that.execution();
							if (fn) {
								fn.call(that);
							}
							that.load = false;
						}
					};
				}
				document.getElementsByTagName('head')[0].appendChild(element);
			})(item);
		}
	},
	/**
	 * @description 执行延迟文件内容执行
	 * @param fileName {string} 文件名称，不要加文件后缀
	 * @param callback {function} 回调行数
	 */
	delay: function delay(fileName, callback) {
		if (!this.load) {
			callback();
			return false;
		}
		this.fileFunList[fileName] = callback;
	},
};

bt.public = {
	// 设置目录配额
	modify_path_quota: function (data, callback) {
		var loadT = bt.load('正在设置目录配额，请稍候...');
		bt_tools.send({url: '/project/quota/modify_path_quota_old',data: data}, function (res) {
			loadT.close();
			if (callback) callback(res);
		},{verify:false});
	},
	isLtdBackAndCap: function () {
		var ltd = parseInt(bt.get_cookie('ltd_end')  || -1)
		if(ltd < 0){
			var item = {
				pluginName: '企业容量配额',
				ps: '指定数据库容量配额，使用面板导入或使用root账号导入，不受配额影响',
				preview: false,
				description:['面板导入','root导入','XFS文件系统'],
				imgSrc:'/static/images/recommend/capacity.png'
			}
			bt.soft.product_pay_view({ totalNum: 52, limit: 'ltd', closePro: true,pluginName:item.pluginName,fun:function () {
					product_recommend.recommend_product_view(item, {
						imgArea: ['783px', '588px']
					}, 'ltd', 52, 'ltd',true)
				}})
			return true
		}
		return false
	},
	// 设置mysql配额
	modify_mysql_quota: function (data, callback) {
		var loadT = bt.load('正在设置MySql配额，请稍候...');
		bt_tools.send({url: '/project/quota/modify_database_quota',data: data}, function (res) {
			loadT.close();
			if (callback) callback(res);
		},{verify:false});
	},

	/**
	 * @description 获取quoto容量
	 */

	get_quota_config: function (type) {
		var pay_num = (type == 'site' || type == 'ftp' ? 51 : 52)
		return {
			fid: 'quota',
		// <span '+(bt.get_cookie('ltd_end')>0?' style="cursor:text" ':'onclick="bt.soft.product_pay_view({ totalNum: '+pay_num+', limit: \'ltd\', closePro: true })"')+' class="firwall_place_of_attribution"></span>
		title: '容量',
			width: 120,
		align:'left',
			template: function (row, index) {
			var quota = row.quota;
			if (!quota.size) return '<a href="javascript:;" class="btlink">未配置</a>';
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
				if(row.sid !=0){
					bt.msg({status:false,msg:'暂不支持远程数据库设置容量配额'});
					return;
				}
				if(bt.public.isLtdBackAndCap(pay_num)) return
				if (typeof row.quota.status === 'boolean') {
					// bt_tools.msg(row.quota);
					bt.confirm(
						{
							title: '提示',
							msg: '此功能为企业版专享功能，是否购买企业版？',
						},
						function () {
							bt.soft.product_pay_view({ totalNum: 51, limit: 'ltd', closePro: true });
						}
					);
					return false;
				}
				var quota = row.quota;
				var size = quota.size * 1024 * 1024;
				var usedList = bt.format_size(quota.used).split(' ');
				var quotaFull = false;
				if (quota.size > 0 && quota.used >= size) quotaFull = true;
				layer.open({
					type: 1,
					title: '【' + row.name + '】' + (type == 'site' ? '网站' : type == 'ftp' ? 'FTP' : '数据库') + '配额容量',
				area: '400px',
					closeBtn: 2,
					btn: ['保存', '取消'],
					content:
					'<div class="bt-form pd20"><div class="line">' +
					'<span class="tname" style="width:120px">当前已用容量</span>' +
						'<div class="info-r" style="maring-right:120px">' +
					'<input type="text" name="used" disabled placeholder="" class="bt-input-text mr10 " style="width:120px;" value="' +
					(!quotaFull ? (quota.size != 0 ? usedList[0] : 0) : '容量已用完') +
						'" /><span>' +
					(!quotaFull ? (quota.size != 0 ? usedList[1] : 'MB') : '') +
						'</span>' +
						'</div>' +
					'<span class="tname" style="width:120px">配额容量</span>' +
						'<div class="info-r" style="maring-right:120px">' +
					'<input type="text" name="quota_size" placeholder="" class="bt-input-text mr10 " style="width:120px;" value="' +
					quota.size +
						'" /><span>MB</span>' +
						'</div>' +
						'</div>' +
					'<ul class="help-info-text c7">' +
					'<li style="color:red;">温馨提示：此功能为企业版专享功能</li>' +
					'<li class="' +
					(type == 'database' ? 'hide' : '') +
					'">需要XFS文件系统，且包含prjquota挂载参数才能使用</li>' +
					'<li class="' +
					(type == 'database' ? 'hide' : '') +
					'">fstab配置示例：/dev/vdc1 /data xfs defaults,prjquota 0 0</li>' +
					'<li class="' +
					(type == 'database' ? '' : 'hide') +
					'">使用面板导入或使用root账号导入，不受配额影响</li>' +
					'<li>配额容量：如需取消容量配额，请设为“0”</li>' +
					'</ul>' +
						'</div>',
				yes: function (indexs) {
					var quota_size = $('[name="quota_size"]').val();
					if (type === 'site' || type === 'ftp') {
						bt.public.modify_path_quota({ data: JSON.stringify({ size: quota_size, path: row.path }) }, function (res) {
							if (res.status) {
								bt.msg(res);
									layer.close(indexs);
									setTimeout(function () {
										location.reload();
									}, 200);
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
					} else {
						bt.public.modify_mysql_quota({ data: JSON.stringify({ size: quota_size, db_name: row.name }) }, function (res) {
							if (res.status === false && res.msg === '此功能为企业版专享功能，请先购买企业版') {
								bt.confirm(
									{
										title: '提示',
										msg: '此功能为企业版专享功能，是否购买企业版？',
									},
									function () {
										bt.soft.updata_pro(52);
									}
								);
							} else {
								bt.msg(res);
							}
							if (res.status) {
								layer.close(indexs);
								setTimeout(function () {
									location.reload();
								}, 200);
							}
						});
					}
					},
				});
			},
		};
	},
};

var dynamic = {
	loadList: [],
	fileFunList: {},
	load: false,
	callback: null,

	// 初始化执行
	execution: function () {
		for (var i = 0; i < this.loadList.length; i++) {
			var fileName = this.loadList[i];
			if (fileName in this.fileFunList) this.fileFunList[fileName]();
		}
	},

	/**
	 * @description 动态加载js,css文件
	 * @param urls {string|array} 文件路径或文件数组
	 * @param fn {function|undefined} 回调函数
	 */
	require: function (urls, fn) {
		if (!Array.isArray(urls)) urls = [urls];

		this.fileFunList = {};

		var i = 0;
		var that = this;
		var total = urls.length;
		var callback = function () {
			i++;
			if (i < total) {
				that.loadFile(urls[i], callback);
			} else {
				fn && fn();
			}
		};
		this.loadFile(urls[i], callback);
	},
	/**
	 * @description 加载js,css文件
	 * @param {string} url 文件路径
	 * @param {function} fn 回调函数
	 */
	loadFile: function (url, fn) {
		this.load = true;

		var that = this;
		var element = this.createElement(url);

		if (element.readyState) {
			element.onreadystatechange = function (ev) {
				if (element.readyState === 'loaded' || element.readyState === 'complete') {
					element.onreadystatechange = null;
					that.execution();
					fn && fn.call(that);
					that.load = false;
				}
			};
		} else {
			element.onload = function (ev) {
				that.execution();
				fn && fn.call(that);
				that.load = false;
			};
		}
		document.getElementsByTagName('head')[0].appendChild(element);
	},
	/**
	 * @description 创建元素
	 * @param {string} url 文件路径
	 * @returns
	 */
	createElement: function (url) {
		var element = null;
		if (url.indexOf('.js') > -1) {
			element = document.createElement('script');
			element.type = 'text/javascript';
			element.src = bt.url_merge('/vue/' + url);
		} else if (url.indexOf('.css') > -1) {
			element = document.createElement('link');
			element.rel = 'stylesheet';
			element.href = bt.url_merge('/vue/' + url);
		}
		return element;
	},
	/**
	 * @default 执行延迟文件内容执行
	 * @param fileName {string} 文件名称，不要加文件后缀
	 * @param callback {function} 回调行数
	 */
	delay: function delay(fileName, callback) {
		if (!this.load) {
			callback();
			return false;
		}
		this.fileFunList[fileName] = callback;
	},
};

// 过滤编码
bt.htmlEncode = {
	/**
	 * @description 正则转换特殊字符
	 * @param {string} layid 字符内容
	 */
	htmlEncodeByRegExp: function (str) {
		if (typeof str == 'undefined' || str.length == 0) return '';
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
};

if (!Object.values) {
	Object.values = function(obj) {
		var vals = [];
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				vals.push(obj[key]);
			}
		}
		return vals;
	}
}
