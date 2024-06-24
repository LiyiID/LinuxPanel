var strVarCity = '';
strVarCity += '                        <div class="aui_content" style="padding: 20px 0 0 0;">';
strVarCity +=
	'                          <div id="check_ploy" class="tootls_group" style="position:relative;">' +
                              '<div style="font-size: 13px;color: #333;height: 35px;line-height: 35px;">登录策略：</div>' +
                              '<i class="check" data-ploy="2" style="margin-right:5px"></i>选中地区放行，其他地区屏蔽' +
                              '<i class="check" data-ploy="1" style="margin-right:5px"></i>选中地区屏蔽，其他地区放行' +
                             '</div>';
strVarCity += '                            <div class="data-result"><em>最多选择 <strong>2000</strong> 项</em></div>';
strVarCity += '                            <div class="data-error" style="display: none;">最多只能选择 3 项</div>';
strVarCity += '                            <div class="data-search bt_search" id="searchRun">' +
                                              '<input class="run search_input" name="searcharea" placeholder="输入地区名称进行搜索..."/>' +
                                              '<div class="searchList run "></div>' +
  '                                        </div>';
strVarCity += '                            <div class="data-tabs">';
strVarCity += '                              <ul>';
strVarCity += '                                <li onclick="removenode_area(this)" data-selector="tab-all" class="active"><a href="javascript:;"><span>全部</span><em></em></a></li>';
strVarCity += '                              </ul>';
strVarCity += '                            </div>';
strVarCity += '                            <div class="data-container data-container-city">';
strVarCity += '                            </div>';
strVarCity += '                        </div>';
// 全局变量
var datatype = '';
var dataCityinput = null;
var searchValue = searchdata();

$(document).on('click', '#select-region', function () {
	var that = this;
	layer.open({
		title: '选择地区信息',
		type: 1,
		area: ['700px', '720px'],
		content: strVarCity,
		btn: ['确定', '取消'],
		closeBtn: 2,
		success: function (layero, index) {
			appendCity(that, 'duoxuan');
			if ($('#select-region').data('ploy') == 1) {
				$($('#check_ploy .check')[1]).addClass('active');
			} else {
				$($('#check_ploy .check')[0]).addClass('active');
			}
		},
    yes:function (index, layero){
      saveCity(index, layero)
    }
	});
});

$(document).on('click', '.area-danxuan', function () {
	appendCity(this, 'danxuan');
});
// 选择策略事件绑定
$(document).on('click', '#check_ploy .check', function () {
	$(this).addClass('active').siblings().removeClass('active');
});
function appendCity(thiscon, Cityxz) {
	dataCityinput = thiscon;
	datatype = Cityxz;
	var city = JSON.parse(localStorage.getItem('region'))
	var span = ''
	if(city.limit_area.city.length>0 && city.limit_area.city !== undefined){
		$.each(city.limit_area.city, function (index, items) {
			span += `<span class="svae_box aui-titlespan" data-code="${items.code}" data-name="${items.name}" onclick="removespan_area(this)">${items.name}<i>×</i></span>`
		})
	}
	if (city.limit_area.province.length>0){
		$.each(city.limit_area.province, function (index, items) {
			span += `<span class="svae_box aui-titlespan" data-code="${items.code}" data-name="${items.name}" onclick="removespan_area(this)">${items.name}<i>×</i></span>`
		})
	}
	if (city.limit_area.country.length>0){
		$.each(city.limit_area.country, function (index, items) {
			span += `<span class="svae_box aui-titlespan" data-code="${items.code}" data-name="${items.name}" onclick="removespan_area(this)">${items.name}<i>×</i></span>`
		})
	}
	if (datatype == 'danxuan') {
		$('.data-result').find('strong').text('1');
	} else {
		$('.data-result').html('<div style="font-size: 13px;color: #333;height: 35px;line-height: 35px;">地区（可选择多项）：</div><div class="path-box" style="border:1px solid #CCCCCC;height:84px;max-height: 84px;overflow: auto;padding: 10px">'+span+'</div>');
	}
	if ($(dataCityinput).data('value') != '') {
		var inputarry = $(dataCityinput).data('value').split('-');
		var inputarryname = $(dataCityinput).val().split('-');
		if (inputarry.length > 0) {
			for (var i in inputarry) {
				$('.path-box').append(
					'<span class="svae_box aui-titlespan" data-code="' + inputarry[i] + '" data-name="' + inputarryname[i] + '" onclick="removespan_area(this)">' + inputarryname[i] + '<i>×</i></span>'
				);
			}
		}
	}

	selectProvince('all', null, '');
	auto_area.run();
}

var dataarrary = __LocalDataCities.list;
function selectProvince(type, con, isremove) {
	//显示省级
	var strVarCity = '';
	if (type == 'all') {
		var dataCityxz = __LocalDataCities.category.provinces;
		var datahotcityxz = __LocalDataCities.category.hotcities;
		var dataCountryxz = __LocalDataCities.category.continents;
		// 加载热门城市和省份
		strVarCity += '<div class="view-all" id="">';
		strVarCity += '  <p class="data-title">热门城市</p>';
		strVarCity += '    <div class="data-list data-list-hot">';
		strVarCity += '      <ul class="clearfix">';
		for (var i in datahotcityxz) {
			strVarCity +=
				'<li><a href="javascript:;" data-code="' +
				datahotcityxz[i] +
				'" data-name="' +
				dataarrary[datahotcityxz[i]][0] +
				'" class="d-item"  onclick="selectProvince(\'sub\',this,\'\')">' +
				dataarrary[datahotcityxz[i]][0] +
				'<label>0</label></a></li>';
		}
		strVarCity += '      </ul>';
		strVarCity += '    </div>';
		strVarCity += '    <p class="data-title">中国省份</p>';
		strVarCity += '   <div class="data-list data-list-provinces">';
		strVarCity += '  <ul class="clearfix">';
		for (var i in dataCityxz) {
			strVarCity +=
				'<li><a href="javascript:;" data-code="' +
				dataCityxz[i] +
				'" data-name="' +
				dataarrary[dataCityxz[i]][0] +
				'" class="d-item"  onclick="selectProvince(\'sub\',this,\'\')">' +
				dataarrary[dataCityxz[i]][0] +
				'<label>0</label></a></li>';
		}
		strVarCity += ' </ul>';
		strVarCity += '</div>';
		strVarCity += '    <p class="data-title">其他地区</p>';
		strVarCity += '   <div class="data-list data-list-provinces">';
		strVarCity += '  <ul class="clearfix">';
		for (var i in dataCountryxz) {
			strVarCity +=
				'<li><a href="javascript:;" data-code="' +
				dataCountryxz[i] +
				'" data-name="' +
				dataarrary[dataCountryxz[i]][0] +
				'" class="d-item"  onclick="selectProvince(\'sub\',this,\'\')">' +
				dataarrary[dataCountryxz[i]][0] +
				'<label>0</label></a></li>';
		}
		strVarCity += ' </ul>';
		strVarCity += '</div>';
		$('.data-container-city').html(strVarCity);

		$('.data-result span').each(function (index) {
			if ($('a[data-code=' + $(this).data('code') + ']').length > 0) {
				$('a[data-code=' + $(this).data('code') + ']').addClass('d-item-active');
				if (
					$('a[data-code=' + $(this).data('code') + ']')
						.attr('class')
						.indexOf('data-all') > 0
				) {
					$('a[data-code=' + $(this).data('code') + ']')
						.parent('li')
						.nextAll('li')
						.find('a')
						.css({ color: '#ccc', cursor: 'not-allowed' });
					$('a[data-code=' + $(this).data('code') + ']')
						.parent('li')
						.nextAll('li')
						.find('a')
						.attr('onclick', '');
				} else {
					if ($('.data-list-provinces a[data-code=' + $(this).data('code').toString().substring(0, 3) + ']').length > 0) {
						var numlabel = $('.data-list-provinces a[data-code=' + $(this).data('code').toString().substring(0, 3) + ']')
							.find('label')
							.text();
						$('.data-list-provinces a[data-code=' + $(this).data('code').toString().substring(0, 3) + ']')
							.find('label')
							.text(parseInt(numlabel) + 1)
							.show();
					}
				}
			} else {
				var numlabel = $('.data-list-provinces a[data-code=' + $(this).data('code').toString().substring(0, 3) + ']')
					.find('label')
					.text();
				$('.data-list-provinces a[data-code=' + $(this).data('code').toString().substring(0, 3) + ']')
					.find('label')
					.text(parseInt(numlabel) + 1)
					.show();
			}
		});
	}
	//显示下一级
	else {
		var dataCityxz = __LocalDataCities.category.provinces;
		var relations = __LocalDataCities.relations;
		if (typeof relations[$(con).data('code')] != 'undefined') {
			//添加标题
			if (isremove != 'remove') {
				$('.data-tabs li').each(function () {
					$(this).removeClass('active');
				});
				$('.data-tabs ul').append(
					'<li data-code=' +
						$(con).data('code') +
						' data-name=' +
						$(con).data('name') +
						' class="active" onclick="removenode_area(this)"><a href="javascript:;"><span>' +
						$(con).data('name') +
						'</span><em></em></a></li>'
				);
			}
			//添加内容
			strVarCity += '<ul class="clearfix">';
			if (datatype == 'danxuan') {
				strVarCity +=
					'<li class="li-disabled" style="width:100%" ><a href="javascript:;" class="d-item data-all"  data-code="' +
					$(con).data('code') +
					'"  data-name="' +
					$(con).data('name') +
					'">' +
					$(con).data('name') +
					'<label>0</label></a></li>';
			} else {
				strVarCity +=
					'<li class="" style="width:100%"><a href="javascript:;" class="d-item data-all"  data-code="' +
					$(con).data('code') +
					'"  data-name="' +
					$(con).data('name') +
					'"  onclick="selectitem_area(this)">' +
					$(con).data('name') +
					'<label>0</label></a></li>';
			}
			for (var i in relations[$(con).data('code')]) {
				strVarCity +=
					'<li><a href="javascript:;" class="d-item" data-code="' +
					relations[$(con).data('code')][i] +
					'"  data-name="' +
					dataarrary[relations[$(con).data('code')][i]][0] +
					"\" onclick=\"selectProvince('sub',this,'')\">" +
					dataarrary[relations[$(con).data('code')][i]][0] +
					'<label>0</label></a></li>';
			}
			strVarCity += '</ul>';
			$('.data-container-city').html(strVarCity);
		} else {
			if (datatype == 'duoxuan') {
				if (typeof $(con).data('flag') != 'undefined') {
					if ($('.data-result span[data-code="' + $(con).data('code') + '"]').length > 0) {
						return false;
					}
				}
				if ($(con).attr('class').indexOf('d-item-active') > 0) {
					$('.data-result span[data-code="' + $(con).data('code') + '"]').remove();
					$(con).removeClass('d-item-active');
					// 省份显示城市数量减一,当为0时不显示
					if ($('.data-list-provinces a[data-code=' + $(con).data('code').toString().substring(0, 3) + ']').length > 0) {
						var numlabel = $('.data-list-provinces a[data-code=' + $(con).data('code').toString().substring(0, 3) + ']')
							.find('label')
							.text();
						if (parseInt(numlabel) == 1) {
							$('.data-list-provinces a[data-code=' + $(con).data('code').toString().substring(0, 3) + ']')
								.find('label')
								.text(0)
								.hide();
						} else {
							$('.data-list-provinces a[data-code=' + $(con).data('code').toString().substring(0, 3) + ']')
								.find('label')
								.text(parseInt(numlabel) - 1);
						}
					}
					return false;
				} else {
					// 已全选省份,不可再选
					if ($('.data-list-provinces a[data-code=' + $(con).data('code').toString().substring(0, 3) + ']').hasClass('d-item-active')) {
						$('.data-error').text('已全选省份,不可再选');
						$('.data-error').slideDown();
						setTimeout("$('.data-error').text('最多只能选择 3 项').hide()", 1000);
						return false;
					}
				}
				if ($('.data-result span').length > 2000) {
					$('.data-error').slideDown();
					setTimeout("$('.data-error').hide()", 1000);
					return false;
				} else {
					$('.path-box').append(
						'<span class="svae_box aui-titlespan" data-code="' +
							$(con).data('code') +
							'" data-name="' +
							$(con).data('name') +
							'" onclick="removespan_area(this)">' +
							$(con).data('name') +
							'<i>×</i></span>'
					);
					$(con).addClass('d-item-active');
				}
			} else {
				//单选
				$('.data-result span').remove();
				// 消除搜索影响
				$('.data-list-hot li').siblings('li').find('a').removeClass('d-item-active');
				$('.data-container-city li').siblings('li').find('a').removeClass('d-item-active');

				$('.path-box').append(
					'<span class="svae_box aui-titlespan" data-code="' +
						$(con).data('code') +
						'" data-name="' +
						$(con).data('name') +
						'" onclick="removespan_area(this)">' +
						$(con).data('name') +
						'<i>×</i></span>'
				);
				$(con).parent('li').siblings('li').find('a').removeClass('d-item-active');
				$(con).addClass('d-item-active');

				$('.data-list-provinces a[data-code=' + $(con).data('code').toString().substring(0, 3) + ']').removeClass('d-item-active');
				$('.data-list-provinces a[data-code=' + $(con).data('code').toString().substring(0, 3) + ']')
					.find('label')
					.text(0)
					.hide();
			}
		}
		$('.data-result span').each(function () {
			$('.data-list-provinces a[data-code=' + $(this).data('code').toString().substring(0, 3) + ']')
				.find('label')
				.text(0)
				.hide();
		});
		$('.data-result span').each(function () {
			if ($('a[data-code=' + $(this).data('code') + ']').length > 0) {
				$('a[data-code=' + $(this).data('code') + ']').addClass('d-item-active');
				if (
					$('a[data-code=' + $(this).data('code') + ']')
						.attr('class')
						.indexOf('data-all') > 0
				) {
					if (datatype == 'duoxuan') {
						$('a[data-code=' + $(this).data('code') + ']')
							.parent('li')
							.nextAll('li')
							.find('a')
							.css({ color: '#ccc', cursor: 'not-allowed' });
						$('a[data-code=' + $(this).data('code') + ']')
							.parent('li')
							.nextAll('li')
							.find('a')
							.attr('onclick', '');
					}
				} else {
					if (datatype == 'danxuan') {
						$('.data-list-provinces a').each(function () {
							$(this).find('label').text(0).hide();
						});
					}
					if ($('.data-list-provinces a[data-code=' + $(this).data('code').toString().substring(0, 3) + ']').length > 0) {
						var numlabel = $('.data-list-provinces a[data-code=' + $(this).data('code').toString().substring(0, 3) + ']')
							.find('label')
							.text();
						$('.data-list-provinces a[data-code=' + $(this).data('code').toString().substring(0, 3) + ']')
							.find('label')
							.text(parseInt(numlabel) + 1)
							.show();
					}
				}
			} else {
				var numlabel = $('.data-list-provinces a[data-code=' + $(this).data('code').toString().substring(0, 3) + ']')
					.find('label')
					.text();
				$('.data-list-provinces a[data-code=' + $(this).data('code').toString().substring(0, 3) + ']')
					.find('label')
					.text(parseInt(numlabel) + 1)
					.show();
			}
		});
	}
}

function selectitem_area(con) {
	if (datatype == 'duoxuan') {
		//多选
		if ($('.data-result span').length > 2000) {
			$('.data-error').slideDown();
			setTimeout("$('.data-error').hide()", 1000);
			return false;
		} else {
			$('.data-result span').each(function () {
				if ($(this).data('code').toString().substring(0, $(con).data('code').toString().length) == $(con).data('code').toString()) {
					$(this).remove();
				}
			});
			$(con).parent('li').siblings('li').find('a').removeClass('d-item-active');

			if ($(con).attr('class').indexOf('d-item-active') == -1) {
				$(con).parent('li').nextAll('li').find('a').css({ color: '#ccc', cursor: 'not-allowed' });
				$(con).parent('li').nextAll('li').find('a').attr('onclick', '');
			} else {
				$(con).parent('li').nextAll('li').find('a').removeAttr('style');
				$(con).parent('li').nextAll('li').find('a').attr('onclick', 'selectProvince("sub",this,"")');
			}
			if ($(con).attr('class').indexOf('d-item-active') > 0) {
				$('.data-result span[data-code="' + $(con).data('code') + '"]').remove();
				$(con).removeClass('d-item-active');
				return false;
			}
			$('.path-box').append(
				'<span class="svae_box aui-titlespan" data-code="' +
					$(con).data('code') +
					'" data-name="' +
					$(con).data('name') +
					'" onclick="removespan_area(this)">' +
					$(con).data('name') +
					'<i>×</i></span>'
			);
			$(con).addClass('d-item-active');
		}
	} else {
		//单选
		$('.data-result span').remove();
		$('.path-box').append(
			'<span class="svae_box aui-titlespan" data-code="' + $(con).data('code') + '" data-name="' + $(con).data('name') + '" onclick="removespan_area(this)">' + $(con).data('name') + '<i>×</i></span>'
		);
		$(con).parent('li').siblings('li').find('a').removeClass('d-item-active');
		$(con).addClass('d-item-active');
	}
}

function removenode_area(lithis) {
	$(lithis).siblings().removeClass('active');
	$(lithis).addClass('active');
	if ($(lithis).nextAll('li').length == 0) {
		return false;
	}
	$(lithis).nextAll('li').remove();
	if ($(lithis).data('selector') == 'tab-all') {
		selectProvince('all', null, '');
	} else {
		selectProvince('sub', lithis, 'remove');
	}
}

function removespan_area(spanthis) {
	$('a[data-code=' + $(spanthis).data('code') + ']').removeClass('d-item-active');
	if ($('a[data-code=' + $(spanthis).data('code') + ']').length > 0) {
		if (
			$('a[data-code=' + $(spanthis).data('code') + ']')
				.attr('class')
				.indexOf('data-all') > 0
		) {
			$('a[data-code=' + $(spanthis).data('code') + ']')
				.parent('li')
				.nextAll('li')
				.find('a')
			$('a[data-code=' + $(spanthis).data('code') + ']')
				.parent('li')
				.nextAll('li')
				.find('a')
				.attr('onclick', 'selectProvince("sub",this,"")');
		}
	}
	if ($('.data-list-provinces a[data-code=' + $(spanthis).data('code').toString().substring(0, 3) + ']').length > 0) {
		var numlabel = $('.data-list-provinces a[data-code=' + $(spanthis).data('code').toString().substring(0, 3) + ']')
			.find('label')
			.text();
		if (parseInt(numlabel) == 1) {
			$('.data-list-provinces a[data-code=' + $(spanthis).data('code').toString().substring(0, 3) + ']')
				.find('label')
				.text(0)
				.hide();
		} else {
			$('.data-list-provinces a[data-code=' + $(spanthis).data('code').toString().substring(0, 3) + ']')
				.find('label')
				.text(parseInt(numlabel) - 1);
		}
	}
	$(spanthis).remove();
}

//确定选择
function saveCity(index, layero) {
	var val = '';
	var cityName = '';
	if ($('.svae_box').length > 0) {
		$('.svae_box').each(function () {
			val += $(this).data('code') + '-';
			cityName += $(this).data('name') + '-';
		});
	}
	if (val != '') {
		val = val.substring(0, val.lastIndexOf('-'));
	}
	if (cityName != '') {
		cityName = cityName.substring(0, cityName.lastIndexOf('-'));
	}
	var city = []
	var province = []
	var country = []
	$.each(val.split('-'), function (i, item) {
		if(item.length == 3 && __LocalDataCities.category.continents.indexOf(item) == -1){
			province.push({name: dataarrary[item][0], code: item})
		}else if (item.length == 3 && __LocalDataCities.category.continents.indexOf(item) != -1) {
			__LocalDataCities.relations[item].forEach(function (item) {
				country.push({name: dataarrary[item][0], code: item})
			})
		}
		if(item.length == 6 && __LocalDataCities.category.continents.indexOf(item.substring(0,3)) == -1){
			city.push({name: dataarrary[item][0], code: item})
		}else if(item.length == 6 && __LocalDataCities.category.continents.indexOf(item.substring(0,3)) != -1) {
			country.push({name: dataarrary[item][0], code: item})
		}
	})
	bt_tools.send({
		url:'/config?action=set_limit_area',
		data:{
			limit_area: JSON.stringify({
				city: city,
				province: province,
				country: country
			}),
			limit_area_status: city.length>0 || province.length>0 || country.length>0?true:false,
			limit_type: $('#check_ploy .check.active').data('ploy')==2?'allow':'deny'
		}
	},function(res){
		bt_tools.msg(res)
		layer.close(index)
		setTimeout(function () {
			window.location.reload();
		},500)

	},'保存地区信息')
}

function Close() {
	$('.aui_state_box').remove();
}

function searchdata() {
	var list = __LocalDataCities.list;
	var dataArr = [];
	for (var i in list) {
		// if (i.length == 3 && i != '010' && i != '020' && i != '030' && i != '040') {
		//     continue;
		// }
		if (i.length > 6 || i == 'hwgat') {
			continue;
		}
		// if (parseInt(i.toString().substring(0, 2)) >= 32) {
		//     continue;
		// }
		var temp = {};
		temp.code = i;
		temp.name = list[i][0];
		temp.pinyin = list[i][1];
		temp.py = list[i][2];
		dataArr.push(temp);
	}
	return dataArr;
}
