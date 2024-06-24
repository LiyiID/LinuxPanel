# coding: utf-8
# -------------------------------------------------------------------
# 宝塔Linux面板
# -------------------------------------------------------------------
# Copyright (c) 2015-2099 宝塔软件(http://bt.cn) All rights reserved.
# -------------------------------------------------------------------
# Author: boazi <baozi@bt.cn>
# -------------------------------------------------------------------
# 消息盒子
# ------------------------------
import os
import time
import copy
import json
from datetime import datetime
from typing import Optional, List

import public
from panelModel.base import panelBase
from panel_msg import Message, get_msg_table, load_module, init, get_msg_db, msg_db_locker


class FilterConfig:
    _CONFIG_FILE = public.get_panel_path() + '/data/msg_box_config.json'
    _DEFAULT_CONFIG = {
        "filters": [
            {
                "name": "网站",
                "status": True,
                "description": "网站相关的事件信息",
                "sub": [
                    {
                        "name": "网站证书(SSL)到期",
                        "status": True,
                    },
                    {
                        "name": "网站到期",
                        "status": True,
                    },
                    {
                        "name": "项目停止告警",
                        "status": True,
                    },

                ]
            },
            {
                "name": "数据库",
                "status": True,
                "description": "数据库相关的事件信息",
                "sub": [
                    {
                        "name": "MySQL数据库密码到期",
                        "status": True,
                    },
                    {
                        "name": "MySQL主从复制异常告警",
                        "status": True,
                    },
                ]
            },
            {
                "name": "面板",
                "status": True,
                "description": "面板操作相关事件和信息",
                "sub": [
                    {
                        "name": "面板密码有效期",
                        "status": True,
                    },
                    {
                        "name": "面板登录告警",
                        "status": True,
                    },
                    {
                        "name": "面板安全告警",
                        "status": True,
                    },
                    {
                        "name": "面板更新提醒",
                        "status": True,
                    },

                ]
            },
            {
                "name": "软件",
                "status": True,
                "description": "包含SSH在内的服务器软件相关信息",
                "sub": [
                    {
                        "name": "服务停止告警",
                        "status": True,
                    },
                    {
                        "name": "SSH登录告警",
                        "status": True,
                    },
                    {
                        "name": "SSH登录失败告警",
                        "status": True,
                    }
                ]
            },
            {
                "name": "主机",
                "status": True,
                "description": "服务器性能相关信息，如：CUP",
                "sub": [
                    {
                        "name": "首页磁盘告警",
                        "status": True,
                    },
                    {
                        "name": "首页CPU告警",
                        "status": True,
                    },
                    {
                        "name": "首页负载告警",
                        "status": True,
                    },
                    {
                        "name": "首页内存告警",
                        "status": True,
                    }
                ]
            }
        ]
    }

    def __init__(self):
        self._conf = self._read_config_from_file()
        if self._conf is None:
            self._conf = copy.deepcopy(self._DEFAULT_CONFIG)

        self._cache = None
        self._cache_time = None

        self._filters = None

    @property
    def filters(self):
        if self._filters is not None:
            return self._filters
        self._filters = {
            "软件安装": ["软件安装"]
        }
        for k in self._conf["filters"]:
            if k["status"] is True:
                sub_data = set()
                self._filters[k["name"]] = sub_data
                for i in k["sub"]:
                    if i["status"] is True:
                        sub_data.add(i["name"])

        return self._filters

    def reset_filters(self):
        self._filters = None

    @classmethod
    def _read_config_from_file(cls) -> Optional[dict]:
        if not os.path.exists(cls._CONFIG_FILE):
            return None

        try:
            data = public.readFile(cls._CONFIG_FILE)
            if data:
                res = json.loads(data)
                if isinstance(res, dict):
                    return res
        except json.JSONDecodeError:
            pass
        return None

    def save_config_to_file(self):
        public.writeFile(self._CONFIG_FILE, json.dumps(self._conf))

    @property
    def cache(self) -> List[dict]:
        """缓存查询数据"""
        now = time.time()
        if self._cache_time is None:
            self._cache_time = now - 1
        if self._cache_time > now:
            if self._cache is not None:
                return self._cache
            else:
                self._cache = self._get_cache()
        else:
            self._cache_time = now + 20
            self._cache = self._get_cache()
        return self._cache

    @staticmethod
    @msg_db_locker
    def _get_cache() -> List[dict]:
        """后续可以优化这个查询"""
        msgs_sql = (
            "SELECT id, msg_types FROM msg WHERE (read = 0 AND sub_type != 'soft_install') OR "
            "(sub_type == 'soft_install' AND id IN (SELECT pid FROM soft_install WHERE status < 2 OR read = 0)) "
            "ORDER BY id DESC "
        )
        with get_msg_db() as db:
            msgs = db.query(msgs_sql)

            if isinstance(msgs, str):
                raise ValueError("数据库查询出错" + msgs)
            result = []
            for msg in msgs:
                result.append({
                    "id": msg[0],
                    "msg_types": json.loads(msg[1])
                })

        return result

    def clear_cache(self):
        self._cache = None

    def filter_msg(self) -> List[dict]:
        res = []
        for m in self.cache:
            if len(m["msg_types"]) > 1:
                if m["msg_types"][0] in self.filters and m["msg_types"][1] in self.filters[m["msg_types"][0]]:
                    res.append(m["id"])
            else:
                if m["msg_types"][0] in self.filters:
                    res.append(m["id"])

        return res


filter_config = FilterConfig()


class main(panelBase):

    # @staticmethod
    # def test(get=None):
    #     return {"status": True, "msg": "1111"}

    @staticmethod
    def get_msg_count(get):
        """获取未读信息数量，用于入口图标"""
        res = filter_config.filter_msg()
        return {
            "count": len(res),
            "not_read": len(res),
            "msgs_id": res
        }

    @staticmethod
    @msg_db_locker
    def get_not_read_list(get):
        """获取未读信息列表，不包含详情"""
        filter_config.clear_cache()
        res = filter_config.filter_msg()
        if "limit" in get and isinstance(get.limit, int) and get.limit > 0:
            res = res[:get.limit]
        with get_msg_table("msg") as table:
            data = table.where("id in ({})".format(",".join(["?"] * len(res))), res).order("id DESC").select()
        if isinstance(data, str):
            return public.returnMsg(False, "数据库损坏" + data)

        for d in data:
            d["msg_types"] = json.loads(d["msg_types"])
            d["source"] = json.loads(d["source"])
            d["read"] = bool(d["read"])
            if d["sub_type"] == "soft_install":
                msg = Message.find_by_id(d["id"])
                d["sub"] = msg.sub

        return data

    @staticmethod
    @msg_db_locker
    def get_msg_list(get):
        """获取信息列表"""
        try:
            page = int(get.page)
            size = int(get.size)
            sub_type = get.sub_type
            is_read = get.is_read
            if "create_time_start" in get:
                create_time_start = int(get.create_time_start)
            else:
                create_time_start = None
            if "create_time_end" in get:
                create_time_end = int(get.create_time_end)
            else:
                create_time_end = None
        except (ValueError, KeyError):
            return public.returnMsg(False, "参数错误")

        if page < 1:
            page = 1
        if size < 1:
            size = 20

        where_list = []
        args = []
        if sub_type != "all":
            where_list.append("sub_type = ?")
            args.append(sub_type)

        if create_time_start is not None:
            where_list.append("create_time > ?")
            args.append(create_time_start)

        if create_time_end is not None:
            where_list.append("create_time < ?")
            args.append(create_time_end)

        if is_read == "read":
            where_list.append("read = ?")
            args.append(1)
        elif is_read == "not_read":
            where_list.append("read = ?")
            args.append(0)
        with get_msg_table("msg") as table:
            count = table.where(" AND ".join(where_list), args).count()
            data = table.where(" AND ".join(where_list), args).limit(size, (page - 1) * size).order("id DESC").select()

        if isinstance(data, str):
            return public.returnMsg(False, "数据库损坏" + data)

        for d in data:
            d["source"] = json.loads(d["source"])
            d["read"] = bool(d["read"])
            d["msg_types"] = json.loads(d["msg_types"])

        return {
            "count": count,
            "msg_list": data
        }

    @staticmethod
    def get_msg_info(get):
        """获取信息详情"""
        try:
            msg_id = int(get.msg_id)
        except (ValueError, KeyError):
            return public.returnMsg(False, "参数错误")

        filter_config.clear_cache()
        msg = Message.find_by_id(msg_id)
        if msg is None:
            return public.returnMsg(False, "未查询到具体信息")
        msg.read = True
        msg.save_to_db()
        return msg.to_dict()

    @staticmethod
    def multi_read(get):
        """多选已读"""
        try:
            msgs_id = get.msgs_id
            msgs_id = json.loads(msgs_id)
        except (ValueError, KeyError, json.JSONDecodeError):
            return public.returnMsg(False, "参数错误")

        Message.multi_read(msgs_id)
        filter_config.clear_cache()
        return public.returnMsg(True, "操作成功")

    @staticmethod
    def multi_delete(get):
        """多选删除"""
        try:
            msgs_id = get.msgs_id
            msgs_id = json.loads(msgs_id)
        except (ValueError, KeyError, json.JSONDecodeError):
            return public.returnMsg(False, "参数错误")

        Message.multi_delete(msgs_id)
        filter_config.clear_cache()
        return public.returnMsg(True, "操作成功")

    @staticmethod
    def read_all(get=None):
        """所有信息标为已读"""
        Message.read_all()
        filter_config.clear_cache()
        return public.returnMsg(True, "操作成功")

    @staticmethod
    def delete_all(get=None):
        """所有信息删除"""
        Message.delete_all()
        filter_config.clear_cache()
        return public.returnMsg(True, "操作成功")

    @staticmethod
    def get_installed_msg(get=None):
        """获取在安装的软件的信息详情"""
        task = public.M('tasks').where("status!=?", ('1',)).field('id,status').order("id asc").find()
        if not task or isinstance(task, str):
            return public.returnMsg(False, "没有安装任务")
        task_id = task["id"]
        msg_list = Message.find_by_sub_args(
            sub_name="soft_install",
            sub_where=("soft_install.task_id=?", [task_id, ]),
            limit=1)
        if not msg_list:
            return public.returnMsg(False, "没有安装任务")

        return msg_list[0].to_dict()

    @staticmethod
    def installed_msg_list(get=None):
        """获取任务队列中"""
        try:
            page = int(get.p.strip())
            pre_page = int(get.limit.strip())
        except (ValueError, KeyError, TypeError, AttributeError):
            return public.returnMsg(False, "参数错误")

        if page < 1:
            page = 1
        if pre_page < 1:
            pre_page = 10
        task_list = public.M('tasks').where("status = ? and type = ? ", ('1', "execshell")).order(
            "id desc").select()
        if isinstance(task_list, str):
            return public.returnMsg(False, "任务队列数据库损坏")

        count = len(task_list)
        target_list = task_list[(page - 1) * pre_page: page * pre_page + 1]
        msg_list = Message.query_by_sub_args(sub_name="soft_install", order_by="msg.id desc")

        msg_map_by_task_id = {m.sub["task_id"]: m for m in msg_list}
        for t in target_list:
            if t["id"] in msg_map_by_task_id:
                t["msg_info"] = msg_map_by_task_id[t["id"]].to_dict()
            else:
                t["msg_info"] = None

        page_data = public.get_page(count, p=page, rows=pre_page)
        page_data["data"] = target_list

        return page_data


if __name__ == '__main__':
    print(Message.query_by_sub_args(sub_name="soft_install"))
