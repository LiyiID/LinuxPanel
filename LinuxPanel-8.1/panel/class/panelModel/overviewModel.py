# coding: utf-8
# -------------------------------------------------------------------
# 宝塔Linux面板
# -------------------------------------------------------------------
# Copyright (c) 2015-2099 宝塔软件(http://bt.cn) All rights reserved.
# -------------------------------------------------------------------
# Author: cjxin <cjxin@bt.cn>
# -------------------------------------------------------------------

import os
import time
import json
import datetime

import public
from panelModel.base import panelBase


class main(panelBase):
    _PLUGIN_DIR = os.path.join(public.get_panel_path(), "plugin")
    _OVERVIEW_TEMPLATE = os.path.join(public.get_panel_path(), "config/overview_template.json")
    _OVERVIEW_SETTING = os.path.join(public.get_panel_path(), "config/overview_setting.json")

    def __init__(self):
        overview_template = [
            {
                "template": "base",
                "option": [
                    {
                        "title": "网站",
                        "name": "sites",
                        "status": True,
                        "repetition": True,
                        "type": "base",
                        "source": {
                            "click": "href",
                            "href": "/site"
                        },
                        "params": [
                            {
                                "name": "网站类型",
                                "type": "select",
                                "option": [
                                    {
                                        "name": "全部",
                                        "source": "all"
                                    },
                                    {
                                        "name": "PHP项目",
                                        "source": "php"
                                    },
                                    {
                                        "name": "Java项目",
                                        "source": "java"
                                    },
                                    {
                                        "name": "Node项目",
                                        "source": "node"
                                    },
                                    {
                                        "name": "Go项目",
                                        "source": "go"
                                    },
                                    {
                                        "name": "Python项目",
                                        "source": "python"
                                    },
                                    {
                                        "name": "其它项目",
                                        "source": "other"
                                    },
                                    {
                                        "name": "反向代理",
                                        "source": "proxy"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "title": "FTP",
                        "name": "ftps",
                        "status": True,
                        "repetition": False,
                        "type": "base",
                        "source": {
                            "click": "href",
                            "href": "/ftp"
                        },
                        "params": [
                            {
                                "name": "FTP",
                                "type": "select",
                                "option": [
                                    {
                                        "name": "FTP",
                                        "source": "all"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "title": "数据库",
                        "name": "databases",
                        "status": True,
                        "repetition": True,
                        "type": "base",
                        "source": {
                            "click": "href",
                            "href": "/database"
                        },
                        "params": [
                            {
                                "name": "数据库类型",
                                "type": "select",
                                "option": [
                                    {
                                        "name": "全部",
                                        "source": "all"
                                    },
                                    {
                                        "name": "MySQL",
                                        "source": "mysql"
                                    },
                                    {
                                        "name": "SQLServer",
                                        "source": "sqlserver"
                                    },
                                    {
                                        "name": "MongoDB",
                                        "source": "mongodb"
                                    },
                                    {
                                        "name": "Redis",
                                        "source": "redis"
                                    },
                                    {
                                        "name": "PgSQL",
                                        "source": "pgsql"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "title": "安全风险",
                        "name": "safety_risk",
                        "status": True,
                        "repetition": False,
                        "type": "model",
                        "source": {
                            "click": "href",
                            "href": "/"
                        },
                        "params": [
                            {
                                "name": "网站类型",
                                "type": "select",
                                "option": [
                                    {
                                        "name": "安全风险",
                                        "source": "safety_risk"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "title": "备忘录",
                        "name": "memo",
                        "status": True,
                        "repetition": False,
                        "type": "model",
                        "source": {
                            "click": "href",
                            "href": "/memo"
                        },
                        "params": [
                            {
                                "name": "备忘录",
                                "source": "memo"
                            }
                        ]
                    }
                ]
            },
            {
                "template": "browse",
                "option": [
                    {
                        "title": "网站监控报表",
                        "name": "total",
                        "status": False,
                        "repetition": True,
                        "type": "plugin",
                        "action": {
                            "click": "href",
                            "href": "/total"
                        },
                        "params": [
                            {
                                "name": "网站",
                                "type": "select",
                                "select_option": "site_all",
                                "option": []
                            },
                            {
                                "name": "指标",
                                "type": "select",
                                "option": [
                                    {
                                        "name": "浏览量",
                                        "source": "pv"
                                    },
                                    {
                                        "name": "访客量",
                                        "source": "uv"
                                    },
                                    {
                                        "name": "ip",
                                        "source": "ip"
                                    },
                                    {
                                        "name": "蜘蛛数",
                                        "source": "spider"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "title": "WAF",
                        "name": "btwaf",
                        "status": False,
                        "repetition": False,
                        "type": "plugin",
                        "source": {
                            "click": "href",
                            "href": "/btwaf/index"
                        },
                        "params": [
                            {
                                "name": "展示",
                                "type": "select",
                                "option": [
                                    {
                                        "name": "风险拦截",
                                        "source": "intercept"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "title": "防篡改",
                        "name": "tamper_core",
                        "status": False,
                        "repetition": False,
                        "type": "plugin",
                        "source": {
                            "click": "href",
                            "href": ""
                        },
                        "params": [
                            {
                                "name": "展示",
                                "type": "select",
                                "option": [
                                    {
                                        "name": "拦截数",
                                        "source": "intercept"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "template": "browse",
                "option": [
                    {
                        "title": "SSH登录日志数",
                        "name": "ssh_log",
                        "status": True,
                        "repetition": True,
                        "type": "model",
                        "source": {
                            "click": "href",
                            "href": "/logs"
                        },
                        "params": [
                            {
                                "name": "日志类型",
                                "type": "select",
                                "option": [
                                    {
                                        "name": "SSH登录日志-全部",
                                        "source": "ALL"
                                    },
                                    {
                                        "name": "SSH登录日志-成功数",
                                        "source": "Accepted"
                                    },
                                    {
                                        "name": "SSH登录日志-失败数",
                                        "source": "Failed"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "template": "open_dir",
                "status": True,
                "repetition": False,
                "type": "model",
                "option": [
                    {
                        "title": "快捷目录",
                        "name": "open_dir",
                        "source": {
                            "click": "href",
                            "href": "/files"
                        },
                        "params": [
                            {
                                "name": "目录",
                                "type": "dir",
                                "option": [
                                    {
                                        "name": '/www/wwwroot',
                                        "source": '/www/wwwroot'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "template": "search_file",
                "status": True,
                "repetition": False,
                "type": "model",
                "option": [
                    {
                        "title": "文件/内容快速查找",
                        "name": "search_file",
                        "source": {
                            "click": "href",
                            "href": "/files",
                            "xx": "xxx"
                        },
                        "params": []
                    }
                ]
            }
        ]
        if not os.path.isfile(self._OVERVIEW_TEMPLATE):
            public.writeFile(self._OVERVIEW_TEMPLATE, json.dumps(overview_template))
        else:
            temp_overview_template = public.readFile(self._OVERVIEW_TEMPLATE)
            if temp_overview_template != overview_template:
                public.writeFile(self._OVERVIEW_TEMPLATE, json.dumps(overview_template))

        overview_setting = [
            {
                "id": 1,
                "template": "base",
                "title": "网站",
                "name": "sites",
                "status": True,
                "repetition": True,
                "type": "base",
                "source": {
                    "click": "href",
                    "href": "/site"
                },
                "params": [
                    {
                        "name": "全部",
                        "source": "all"
                    }
                ]
            },
            {
                "id": 2,
                "template": "base",
                "title": "FTP",
                "name": "ftps",
                "status": True,
                "repetition": False,
                "type": "base",
                "source": {
                    "click": "href",
                    "href": "/ftp"
                },
                "params": [
                    {
                        "name": "FTP",
                        "source": "all"
                    }
                ]
            },
            {
                "id": 3,
                "template": "base",
                "title": "数据库",
                "name": "databases",
                "status": True,
                "repetition": True,
                "type": "base",
                "source": {
                    "click": "href",
                    "href": "/database"
                },
                "params": [
                    {
                        "name": "全部",
                        "source": "all"
                    }
                ]
            },
            {
                "id": 4,
                "template": "base",
                "title": "安全风险",
                "name": "safety_risk",
                "status": True,
                "repetition": False,
                "type": "model",
                "source": {
                    "click": "href",
                    "href": "/"
                },
                "params": [
                    {
                        "name": "安全风险",
                        "source": "safety_risk"
                    }
                ]
            },
            {
                "id": 5,
                "template": "base",
                "name": "memo",
                "title": "备忘录",
                "status": True,
                "repetition": False,
                "type": "model",
                "source": {
                    "click": "href",
                    "href": "/memo"
                },
                "params": [
                    {
                        "name": "备忘录",
                        "source": "memo",
                    }
                ]
            }
        ]
        if not os.path.isfile(self._OVERVIEW_SETTING):
            public.writeFile(self._OVERVIEW_SETTING, json.dumps(overview_setting))
        # else:
        #     temp_overview_setting = public.readFile(self._OVERVIEW_SETTING)
        #     if temp_overview_setting != overview_setting:
        #         public.writeFile(self._OVERVIEW_SETTING, json.dumps(overview_setting))

    # 获取首页概览
    def GetTemplateOverview(self, get):
        select_option_dict = {
            "site_all": public.M("sites").field("name").select()
        }

        overview_template = public.readFile(self._OVERVIEW_TEMPLATE)
        overview_template = json.loads(overview_template)
        for template in overview_template:
            template_option = template.get("option", [])
            for option in template_option:
                if option.get("status", False) is False:
                    if option.get("type") == "plugin":  # 插件
                        plugin_path = os.path.join(self._PLUGIN_DIR, option["name"])
                        option["status"] = os.path.exists(plugin_path)

                option_params = option.get("params", [])
                for params in option_params:
                    select_option = params.get("select_option")
                    if select_option is not None and select_option_dict.get(select_option) is not None:
                        params["option"] = select_option_dict.get(select_option)
                        for site in params["option"]:
                            site["source"] = site["name"]
        return {"status": True, "msg": "ok", "data": overview_template}

    # 获取首页概览
    def GetOverview(self, get):
        func_dict = {
            "sites": self._base,
            "ftps": self._base,
            "databases": self._base,
            "total": self._total,
            "safety_risk": self._safety_risk,
            "memo": self._memo,
            "btwaf": self._btwaf,
            "tamper_core": self._tamper_core,
            "ssh_log": self._ssh_log,
            "open_dir": self._open_dir
        }
        try:
            overview_setting = public.readFile(self._OVERVIEW_SETTING)
            overview_setting = json.loads(overview_setting)
        except Exception as err:
            overview_setting = []


        nlist = []
        for overview in overview_setting:
            if overview.get("title", '')  == "文件/内容快速查找":
                nlist.append(overview)
            overview["value"] = []
            params_list = overview.get("params")
            if not params_list or len(params_list) == 0 or not params_list[0] : continue

            if overview.get("type") == "plugin":  # 插件
                from panelPlugin import panelPlugin
                get = public.dict_obj()
                get.sName = overview["name"]
                overview["plugin_info"] = panelPlugin().get_soft_find(get)

            if overview.get("status", False) is True:
                func = func_dict.get(overview["name"])
                if func is not None:
                    overview["value"] = func(overview["name"], params_list)
            nlist.append(overview)

        return {"status": True, "msg": "ok", "data": nlist}

    # 添加首页概览
    def AddOverview(self, get):
        if not hasattr(get, "overview"):
            return public.returnMsg(False, "缺少参数! overview")
        try:
            overview_setting = public.readFile(self._OVERVIEW_SETTING)
            overview_setting = json.loads(overview_setting)
        except Exception as err:
            overview_setting = []

        overview = json.loads(get.overview)

        if overview.get("value") is not None:
            del overview["value"]

        max_id = 0
        for over in overview_setting:
            if over["id"] > max_id: max_id = over["id"]

        overview["id"] = max_id + 1

        overview_setting.append(overview)

        public.writeFile(self._OVERVIEW_SETTING, json.dumps(overview_setting))
        return {"status": True, "msg": "添加成功！", "data": overview_setting}


    # 修改首页概览
    def SetOverview(self, get):
        if not hasattr(get, "overview"):
            return public.returnMsg(False, "缺少参数! overview")

        overview = json.loads(get.overview)

        overview_setting = []
        if isinstance(overview, list):
            overview_setting = overview
        elif isinstance(overview, dict):
            try:
                overview_setting = public.readFile(self._OVERVIEW_SETTING)
                overview_setting = json.loads(overview_setting)
            except Exception as err:
                overview_setting = []

            if overview.get("value") is not None:
                del overview["value"]

            for idx in range(len(overview_setting)):
                over = overview_setting[idx]
                if over["id"] == overview["id"]:
                    overview_setting[idx] = overview
                    break
            else:
                return public.returnMsg(False, "不存在！")

        public.writeFile(self._OVERVIEW_SETTING, json.dumps(overview_setting))
        return {"status": True, "msg": "修改成功！", "data": overview_setting}

    # 删除首页概览
    def DelOverview(self, get):
        if not hasattr(get, "overview_id"):
            return public.returnMsg(False, "缺少参数! overview_id")
        if not str(get.overview_id).isdigit():
            return public.returnMsg(False, "参数错误! overview_id")

        try:
            overview_setting = public.readFile(self._OVERVIEW_SETTING)
            overview_setting = json.loads(overview_setting)
        except Exception as err:
            overview_setting = []

        overview_id = int(get.overview_id)
        for idx in range(len(overview_setting)-1,-1, -1):
            over = overview_setting[idx]
            if int(over["id"]) == overview_id:
                del overview_setting[idx]
                break

        ret = public.writeFile(self._OVERVIEW_SETTING, json.dumps(overview_setting))
        return {"status": True, "msg": "删除成功！", "data": overview_setting}

    # 获取基础功能数据
    def _base(self, name: str, params_list: list) -> list:
        source_dict = {
            "sites": lambda t_type: public.M("sites").count() if t_type == "all" else public.M("sites").where("LOWER(project_type)=LOWER(?)", (t_type,)).count(),
            "ftps": lambda t_type: public.M("ftps").count() if t_type == "all" else public.M("ftps").where("LOWER(status)=LOWER(?)", (t_type,)).count(),
            "databases": lambda t_type: public.M("databases").count() if t_type == "all" else public.M("databases").where("LOWER(type)=LOWER(?)", (t_type,)).count(),
        }
        value_list = [0]
        for params in params_list:
            if name == "databases" and params["source"] == "redis":
                from databaseModel.redisModel import panelRedisDB
                data = panelRedisDB.get_options("databases", 16)
                if not isinstance(data, int):
                    data = 0
                value_list[0] = data
            elif name == "sites":
                where = ""
                if params["source"] != "all":
                    where = "LOWER(project_type)=LOWER('{}')".format(params["source"])
                value_list[0] = public.M("sites").where(where, ()).count()
                if where:
                    start_num = public.M("sites").where(where + " and status='1'", ()).count()
                    stop_num = public.M("sites").where(where + " and status='0'", ()).count()
                else:
                    start_num = public.M("sites").where("status='1'", ()).count()
                    stop_num = public.M("sites").where("status='0'", ()).count()
                value_list.append(start_num)
                value_list.append(stop_num)
            else:
                data = source_dict.get(name)(params["source"])
                if not isinstance(data, int):
                    data = 0
                value_list[0] = data
        return value_list

    # 安全风险
    def _safety_risk(self, name: str, params_list: list) -> list:
        value_list = [0]
        from panelWarning import panelWarning

        data = panelWarning().get_scan_bar(None)
        if isinstance(data, dict):
            safety_risk = data.get("count")
            value_list[0] = safety_risk
        return value_list

    # 获取网站监控报表
    def _total(self, name: str, params_list: list) -> list:
        totoal_data_path = "/www/server/total/logs"
        value_list = [0, 0]

        site = params_list[0]["source"]
        target = params_list[1]["source"]  # pv u ip spider
        if target not in ["pv", "uv", "ip", "spider"]:
            return value_list

        site_db_path = os.path.join(totoal_data_path, site, "total.db")
        if not os.path.exists(site_db_path):
            return value_list

        today_time = datetime.date.today()
        today_start = today_time.strftime("%Y%m%d00")
        today_end = today_time.strftime("%Y%m%d23")

        db_obj = public.M("request_stat").dbfile(site_db_path)
        today_data = db_obj.field("sum({target}) as {target}".format(target=target)).where("time between ? and ?", (today_start, today_end)).find()
        if today_data and isinstance(today_data, dict) and today_data.get(target):
            value_list[0] = today_data[target]

        yesterday_time = today_time - datetime.timedelta(days=1)
        yesterday_start = yesterday_time.strftime("%Y%m%d00")
        yesterday_end = yesterday_time.strftime("%Y%m%d23")

        db_obj = public.M("request_stat").dbfile(site_db_path)
        yesterday_data = db_obj.field("sum({target}) as {target}".format(target=target)).where("time between ? and ?", (yesterday_start, yesterday_end)).find()
        if yesterday_data and isinstance(yesterday_data, dict) and yesterday_data.get(target):
            value_list[1] = yesterday_data[target]
        return value_list

    # waf
    def _btwaf(self, name: str, params_list: list) -> list:
        value_list = [0, 0]

        waf_db_path = "/www/server/btwaf/totla_db/totla_db.db"
        if not os.path.exists(waf_db_path):
            return value_list

        today_time = int(datetime.datetime.now().replace(hour=0, minute=0, second=0, microsecond=0).timestamp())
        yesterday_time = today_time - 86400
        try:
            today_data = public.M("totla_log").dbfile(waf_db_path).field('time').where("time>=?", (today_time)).order('id desc').count()
            if isinstance(today_data, int):
                value_list[0] = today_data
        except:
            pass
        try:
            yesterday_data = public.M("totla_log").dbfile(waf_db_path).field('time').where("time>=? and time<=?", (yesterday_time, today_time)).order('id desc').count()
            if isinstance(yesterday_data, int):
                value_list[1] = yesterday_data
        except:
            pass
        return value_list

    # 防篡改
    def _tamper_core(self, name: str, params_list: list) -> list:
        value_list = [0, 0]

        tamper_core_dir = "/www/server/tamper/total"
        if not os.path.exists(tamper_core_dir):
            return value_list

        today_time = datetime.date.today()
        yesterday_time = today_time - datetime.timedelta(days=1)
        for p_name in os.listdir(tamper_core_dir):
            dir_path = os.path.join(tamper_core_dir, str(p_name))
            if not os.path.isdir(dir_path): continue

            today_path = os.path.join(dir_path, "{}.json".format(today_time))  # 今日
            if os.path.isfile(today_path):
                today_info = public.readFile(today_path)
                today_info = json.loads(today_info)
                for info in today_info.values():
                    value_list[0] += sum(info.values())

            yesterday_path = os.path.join(dir_path, "{}.json".format(yesterday_time))  # 昨日
            if os.path.isfile(yesterday_path):
                yesterday_info = public.readFile(yesterday_path)
                yesterday_info = json.loads(yesterday_info)
                for info in yesterday_info.values():
                    value_list[1] += sum(info.values())

        return value_list

    # SSH登录日志数
    def _ssh_log(self, name: str, params_list: list) -> list:
        value_list = [0, 0]

        select = params_list[0]["source"]

        import PluginLoader

        page = 1
        while True:
            args = public.dict_obj()
            args.model_index = "safe"  # 模块名
            args.select = select
            args.count = 100
            args.p = page

            ssh_list = PluginLoader.module_run("syslog", "get_ssh_list", args)
            if not isinstance(ssh_list, list):
                break
            if len(ssh_list) == 0:
                break

            today_time = datetime.date.today()
            yesterday_time = today_time - datetime.timedelta(days=1)
            for data in ssh_list:
                if str(data["time"]).startswith(str(today_time)):
                    value_list[0] += 1
                elif str(data["time"]).startswith(str(yesterday_time)):
                    value_list[1] += 1
                else:
                    return value_list
            page += 1
        return value_list

    # 快捷目录
    def _open_dir(self, name: str, params_list: list) -> list:
        value_list = []
        for params in params_list:
            value_list.append(params["source"])
        return value_list
    # 备忘录
    def _memo(self, name: str, params_list: list) -> list:
        value_list = []
        memo_path = "/www/server/panel/data/memo.txt"
        if not os.path.exists(memo_path):
            public.writeFile(memo_path, "")
        content = public.readFile(memo_path)
        value_list.append(content)
        return value_list
