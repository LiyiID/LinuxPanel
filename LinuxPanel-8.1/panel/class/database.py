# coding: utf-8
# -------------------------------------------------------------------
# 宝塔Linux面板
# -------------------------------------------------------------------
# Copyright (c) 2015-2017 宝塔软件(http:#bt.cn) All rights reserved.
# -------------------------------------------------------------------
# Author: hwliang <hwl@bt.cn>
# -------------------------------------------------------------------

# ------------------------------
# 数据库管理类
# ------------------------------
import os
import time
import json
import re
import datetime
from typing import Tuple

import public, panelMysql
try:
    from BTPanel import session
except:
    pass
import datatool
import db_mysql
import subprocess

class database(datatool.datatools):
    _MYSQL_CNF = "/etc/my.cnf"
    try:
        _DB_BACKUP_DIR = os.path.join(public.M("config").where("id=?", (1,)).getField("backup_path"), "database")
    except:
        pdata = {
            "id": 1,
            "webserver": public.GetWebServer(),
            "backup_path": "/www/backup",
            "sites_path": "/www/wwwroot",
            "status": 0,
            "mysql_root": "admin"
        }
        print(public.M("config").insert(pdata))
        print(public.M("config").where("id=?", (1,)).update(pdata))
        _DB_BACKUP_DIR = os.path.join(public.M("config").where("id=?", (1,)).getField("backup_path"), "database")

    _MYSQL_BACKUP_DIR = os.path.join(_DB_BACKUP_DIR, "mysql")
    _MYSQL_ALL_BACKUP_DIR = os.path.join(_MYSQL_BACKUP_DIR, "all_backup")
    _MYSQLDUMP_BIN = public.get_mysqldump_bin()
    _MYSQL_BIN = public.get_mysql_bin()

    _MYSQL_ACCESS_MSG = {
        "ALL PRIVILEGES": "所有权限",
        "USAGE": "使用权限",

        # 数据
        "SELECT": "读取数据",
        "INSERT": "插入数据",
        "UPDATE": "更新数据",
        "DELETE": "删除数据",
        "FILE": "文件操作",

        # 结构
        "CREATE": "创建",
        "ALTER": "修改表结构",
        "INDEX": "创建索引",
        "DROP": "删除",
        "CREATE TEMPORARY TABLES": "创建临时表",
        "SHOW VIEW": "查看视图",
        "CREATE ROUTINE": "创建存储过程/函数",
        "ALTER ROUTINE": "修改存储过程/函数",
        "EXECUTE": "执行存储过程",
        "CREATE VIEW": "创建视图",
        "EVENT": "管理事件",
        "TRIGGER": "创建触发器",

        # 管理
        "GRANT": "授权",
        "SUPER": "执行超级操作",
        "PROCESS": "查看进程",
        "RELOAD": "重新加载权限",
        "SHUTDOWN": "关闭服务器",
        "SHOW DATABASES": "查看数据库",
        "LOCK TABLES": "锁定表",
        "REFERENCES": "创建外键",
        "REPLICATION CLIENT": "作为复制主库",
        "REPLICATION SLAVE": "作为复制从库",
        "CREATE USER": "创建用户",

        "CREATE TABLESPACE": "创建表空间",
        "CREATE ROLE": "创建角色",
        "DROP ROLE": "删除角色",

        "APPLICATION_PASSWORD_ADMIN": "应用程序密码管理员",
        "AUDIT_ABORT_EXEMPT": "免除审计中断",
        "AUDIT_ADMIN": "审计管理员",
        "AUTHENTICATION_POLICY_ADMIN": "身份验证策略管理员",
        "BACKUP_ADMIN": "备份管理员",
        "BINLOG_ADMIN": "二进制日志管理员",
        "BINLOG_ENCRYPTION_ADMIN": "二进制日志加密管理员",
        "CLONE_ADMIN": "克隆管理员",
        "CONNECTION_ADMIN": "连接管理员",
        "ENCRYPTION_KEY_ADMIN": "加密密钥管理员",
        "FIREWALL_EXEMPT": "防火墙例外",
        "FLUSH_OPTIMIZER_COSTS": "刷新优化器成本",
        "FLUSH_STATUS": "刷新状态",
        "FLUSH_TABLES": "刷新表",
        "FLUSH_USER_RESOURCES": "刷新用户资源",
        "GROUP_REPLICATION_ADMIN": "组复制管理员",
        "GROUP_REPLICATION_STREAM": "组复制流",
        "INNODB_REDO_LOG_ARCHIVE": "InnoDB 重做日志归档",
        "INNODB_REDO_LOG_ENABLE": "启用 InnoDB 重做日志",
        "PASSWORDLESS_USER_ADMIN": "无密码用户管理员",
        "PERSIST_RO_VARIABLES_ADMIN": "持久化只读变量管理员",
        "REPLICATION_APPLIER": "复制应用程序",
        "REPLICATION_SLAVE_ADMIN": "复制从库管理员",
        "RESOURCE_GROUP_ADMIN": "资源组管理员",
        "RESOURCE_GROUP_USER": "资源组用户",
        "ROLE_ADMIN": "角色管理员",
        "SENSITIVE_VARIABLES_OBSERVER": "敏感变量观察员",
        "SERVICE_CONNECTION_ADMIN": "服务连接管理员",
        "SESSION_VARIABLES_ADMIN": "会话变量管理员",
        "SET_USER_ID": "设置用户 ID",
        "SHOW_ROUTINE": "显示例程",
        "SYSTEM_USER": "系统用户",
        "SYSTEM_VARIABLES_ADMIN": "系统变量管理员",
        "TABLE_ENCRYPTION_ADMIN": "表加密管理员",
        "TELEMETRY_LOG_ADMIN": "遥测日志管理员",
        "XA_RECOVER_ADMIN": "XA 恢复管理员",

    }

    def __init__(self):
        if os.path.isfile(self._MYSQL_BACKUP_DIR):
            public.ExecShell("rm -f {}".format(self._MYSQL_BACKUP_DIR))
        if not os.path.exists(self._MYSQL_BACKUP_DIR):
            public.ExecShell('mkdir -p {}'.format(self._MYSQL_BACKUP_DIR))

        if os.path.isfile(self._MYSQL_ALL_BACKUP_DIR):
            public.ExecShell("rm -f {}".format(self._MYSQL_ALL_BACKUP_DIR))
        if not os.path.exists(self._MYSQL_ALL_BACKUP_DIR):
            public.ExecShell('mkdir -p {}'.format(self._MYSQL_ALL_BACKUP_DIR))
        self.filepath="/www/server/panel/class/database_types.json"

    def get_mysql_status(self,get=None):
        #检查mysql是否存在，是否包含远程数据库
        bt_mysql_bin = '{}/mysql/bin'.format(public.get_setup_path())
        if os.path.exists(bt_mysql_bin):
            return public.returnMsg(True, "本地数据库已安装")

        data = public.M('database_servers').where("LOWER(db_type)=LOWER('mysql')", ()).select()
        if isinstance (data,list) and data:
            return public.returnMsg(True, "已配置远程数据库")

        return public.returnMsg(False, "没有可用的数据库服务器")

    def AddCloudServer(self, get):
        """
        添加远程服务器
        @param db_host<string> 服务器地址
        @param db_port<port> 数据库端口
        @param db_user<string> 用户名
        @param db_password<string> 数据库密码
        @param db_ps<string> 数据库备注
        @return dict
        """
        if not hasattr(get, "db_host"):
            return public.returnMsg(False, "缺少参数! db_host")
        if not hasattr(get, "db_port"):
            return public.returnMsg(False, "缺少参数! db_port")
        if not hasattr(get, "db_user"):
            return public.returnMsg(False, "缺少参数! db_user")
        if not hasattr(get, "db_password"):
            return public.returnMsg(False, "缺少参数! db_password")
        if not hasattr(get, "db_ps"):
            return public.returnMsg(False, "缺少参数! db_ps")
        get.db_name = None
        res = self.CheckCloudDatabase(get)
        if isinstance(res, dict): return res
        if public.M("database_servers").where("db_host=? AND db_port=? AND LOWER(db_type)=LOWER('mysql')", (get.db_host, get.db_port)).count():
            return public.returnMsg(False, "指定服务器已存在: [{}:{}]".format(get.db_host, get.db_port))
        get.db_port = int(get.db_port)
        pdata = {
            "db_host": get.db_host,
            "db_port": get.db_port,
            "db_user": get.db_user,
            "db_password": get.db_password,
            "ps": public.xssencode2(get.db_ps.strip()),
            "addtime": int(time.time())
        }

        result = public.M("database_servers").insert(pdata)

        if isinstance(result, int):
            public.WriteLog("数据库管理", "添加远程MySQL服务器[{db_host}:{db_port}]".format(db_host=get.db_host, db_port=get.db_port))
            return public.returnMsg(True, "添加成功!")
        return public.returnMsg(False, "添加失败： {result}".format(result=result))
    
    def check_and_create_json(self,default_data={"types": []}):
        """检查JSON文件是否存在，如果不存在则创建并初始化它"""
        if not os.path.exists(self.filepath):
            self.save_json_file(default_data)
            return default_data  # 返回初始化数据以供使用

    def load_json_file(self):
        try:
            with open(self.filepath, 'r') as file:
                data = json.load(file)
            return data
        except Exception as e:
            print(e)
            # 如果发生错误，返回一个具有默认结构的空字典
            return {"types": []}
        
    def save_json_file(self,data):
        """保存数据到JSON文件"""
        with open(self.filepath, 'w', encoding='utf-8') as file:
            json.dump(data, file, ensure_ascii=False, indent=4)

    def check_local_server(self, db_type):
        # 查询指定类型且accept字段为"127.0.0.1"的记录
        result = public.M("databases").where("LOWER(type)=? AND accept=?", (db_type, "127.0.0.1")).select()
        # 检查是否有符合条件的记录
        has_local_server = len(result) > 0

        return has_local_server
    
    def check_cloud_server(self, db_type):
        # 查询指定类型的数据库服务器记录
        result = public.M("database_servers").where("LOWER(type)=?", (db_type,)).select()
        # 返回查询结果，而非布尔值
        return result

    def check_and_add_type_id_column(self):
        # 尝试查询databases表中的type_id字段，以检查它是否存在
        query_result = public.M('databases').field('type_id').select()
        if "no such column: type_id" in query_result:
            try:
                # 如果type_id字段不存在，则向databases表中添加该字段
                # 这里我们将type_id设为INTEGER类型，假设它将用于存储与site_types表中的id相关联的整数值
                public.M('databases').execute("ALTER TABLE 'databases' ADD 'type_id' INTEGER", ())
            except Exception as e:
                print(e)

    def view_database_types(self, get):

        try:

            self.check_and_add_type_id_column()
            # 加载分类数据
            data = self.load_json_file()
            db_type = get.db_type

            cloud_servers = self.GetCloudServer(get)
            if cloud_servers is None:
                cloud_servers = []


            # 查询数据库类型匹配的记录
            result = public.M("databases").where("LOWER(type)=?", (db_type,)).select()


            # # 从data中根据db_type找到对应的分类信息
            matching_types = [t for t in data['types'] if t['db_type'].lower() == db_type]

            # 分别创建本地服务器和远程服务器的分类列表
            special_types = []

            # 初始化ID为0，并递减
            next_id = 0
            # 遍历cloud_servers列表，添加特殊分类
            for server in cloud_servers:
                # 添加分类，使用server中的id
                if server['db_host'] == '127.0.0.1':
                    # 本地服务器分类
                    special_types.append({"id": server['id'], "ps": "本地服务器", "db_type": db_type})
                else:
                    # 远程服务器分类
                    special_types.append({"id": server['id'], "ps": server['db_host'], "db_type": db_type})
                    
            # 将特殊类型分类放在前面，然后附加其他类型的分类
            ordered_matching_types = special_types + matching_types

            # 如果有匹配的分类信息，则返回这些信息
            if ordered_matching_types:
                return public.returnMsg(True, ordered_matching_types)
            else:
                return public.returnMsg(False, "没有找到匹配的分类信息。")
        except Exception as e:
            return public.returnMsg(False, str(e))

    def is_name_exists(self, name):
        data = self.load_json_file()  # 加载现有数据
        for t in data.get('types', []):
            if t.get('ps') == name:
                return True  # 名字已存在
        return False  # 名字不存在

            
    def add_database_types(self, get):
        ps = get.ps
        db_type = get.db_type
        # 检查名字是否已存在
        if self.is_name_exists(ps):
            return public.returnMsg(False, "指定分类名称已存在!")

        data = self.load_json_file()  # 加载现有数据
        if not data or 'types' not in data or not data['types']:  # 如果文件为空、不存在或'types'列表为空
            data = {"types": []}
            next_id = -1  # 从-1开始
        else:
            # 查找当前最小的id值，并从-1开始递减
            next_id = min([t.get('id', 0) for t in data['types']], default=0) - 1

        # 新分类的id设置为next_id
        new_type = {"id": next_id, "ps": ps, "db_type": db_type}
        data['types'].append(new_type)  # 添加新的分类信息
        self.save_json_file(data)  # 保存更新后的数据到文件
        return public.returnMsg(True, "分类添加成功。")

    def delete_database_types(self, get):
        data = self.load_json_file()  # 加载现有数据
        if not data:  # 检查数据是否成功加载
            return public.returnMsg(False, "分类删除失败，数据加载失败。")
        
        # 查找并删除指定ID的分类
        found = False  # 标记是否找到并准备删除的分类
        for i, t in enumerate(data['types']):
            print(t.get('id'))
            if t.get('id') == int(get.id):
                del data['types'][i]  # 删除找到的分类
                found = True
                break  # 找到后即退出循环

        if found:
            self.save_json_file(data)  # 如果成功找到并删除，保存更改
            return public.returnMsg(True, "分类删除成功。")
        else:
            return public.returnMsg(False, "分类删除失败，未找到指定的分类。")

    def update_database_types(self, get):
        ps = get.ps
        data = self.load_json_file()  # 加载现有数据
        # 检查名字是否已存在
        if self.is_name_exists(ps):
            return public.returnMsg(False, "指定分类名称已存在!")
        if data:
            for i, t in enumerate(data['types']):
                if t.get('id') == int(get.id):
                    # 更新分类信息
                    t['ps'] = ps
                    self.save_json_file(data)  # 保存更新后的数据
                    return public.returnMsg(True, "分类修改成功。")
            return public.returnMsg(False, "分类修改失败，未找到指定的分类。")
        else:
            return public.returnMsg(False, "分类修改失败，数据加载失败。")

    def set_database_type_by_name(self, get):
        try:
            # 尝试分割传入的字符串以处理多个数据库名
            database_names = get.database_names.split(',')
            
            # 准备数据库操作对象
            database_sql = public.M("databases")
            
            
            # 遍历所有提供的数据库名
            for db_name in database_names:
                # 去除可能的前后空格
                db_name = db_name.strip()
                if db_name:  # 确保数据库名不为空
                    # 更新指定数据库名的type_id
                    result = database_sql.where("name=?", (db_name,)).setField("type_id", int(get.id))
            return public.returnMsg(True, "设置成功！")
        except Exception as e:
            # 通用异常处理
            return public.returnMsg(False, "设置失败！"+str(e))



    def find_databases_by_name_and_type(self, get):
        import re
        try:
            db_type=get.db_type
            # 先从类型数据中找到name对应的id
            data = self.load_json_file()
            type_id = next((item['id'] for item in data['types'] if item['id'] == id), None)
            result=public.M("databases").where("LOWER(type)=? AND  type_id=?", (db_type, type_id)).select()
            if result:
                return public.returnMsg(True, result)
            else:
                return public.returnMsg(True, [])
        except Exception as e:
            return public.returnMsg(False, str(e))
    def GetCloudServer(self, get):
        '''
            @name 获取远程服务器列表
            @author hwliang<2021-01-10>
            @return list
        '''
        data = public.M('database_servers').where("LOWER(db_type)=LOWER('mysql')", ()).select()
        bt_mysql_bin = '{}/mysql/bin/mysql'.format(public.get_setup_path())

        if not isinstance(data, list): data = []
        if os.path.exists(bt_mysql_bin):
            data.insert(0, {'id': 0, 'db_host': '127.0.0.1', 'db_port': 3306, 'db_user': 'root', 'db_password': '', 'ps': '本地服务器', 'addtime': 0})
        return data

    def RemoveCloudServer(self, get):
        '''
            @name 删除远程服务器
            @author hwliang<2021-01-10>
            @param id<int> 远程服务器ID
            @return dict
        '''

        id = int(get.id)
        if not id: return public.returnMsg(False, '参数传递错误，请重试!')
        db_find = public.M('database_servers').where("id=? AND LOWER(db_type)=LOWER('mysql')", (id,)).find()
        if not db_find: return public.returnMsg(False, '指定远程服务器不存在!')
        public.M('databases').where("sid=? AND LOWER(type)=LOWER('mysql')", id).delete()
        result = public.M('database_servers').where("id=? AND LOWER(db_type)=LOWER('mysql')", id).delete()
        if isinstance(result, int):
            public.WriteLog('数据库管理', '删除远程MySQL服务器[{}:{}]'.format(db_find['db_host'], int(db_find['db_port'])))
            return public.returnMsg(True, '删除成功!')
        return public.returnMsg(False, '删除失败： {}'.format(result))

    def ModifyCloudServer(self, get):
        '''
            @name 修改远程服务器
            @author hwliang<2021-01-10>
            @param id<int> 远程服务器ID
            @param db_host<string> 服务器地址
            @param db_port<port> 数据库端口
            @param db_user<string> 用户名
            @param db_password<string> 数据库密码
            @param db_ps<string> 数据库备注
            @return dict
        '''
        if not hasattr(get, 'id'):
            return public.returnMsg(False, '参数传递错误，请重试!')
        if not hasattr(get, 'db_host'):
            return public.returnMsg(False, '参数传递错误，请重试!')
        if not hasattr(get, 'db_port'):
            return public.returnMsg(False, '参数传递错误，请重试!')
        if not hasattr(get, 'db_user'):
            return public.returnMsg(False, '参数传递错误，请重试!')
        if not hasattr(get, 'db_password'):
            return public.returnMsg(False, '参数传递错误，请重试!')
        if not hasattr(get, 'db_ps'):
            return public.returnMsg(False, '参数传递错误，请重试!')

        id = int(get.id)
        get.db_port = int(get.db_port)
        db_find = public.M('database_servers').where("id=? AND LOWER(db_type)=LOWER('mysql')", (id,)).find()
        if not db_find: return public.returnMsg(False, '指定远程服务器不存在!')
        _modify = False
        if db_find['db_host'] != get.db_host or db_find['db_port'] != get.db_port:
            _modify = True
            if public.M('database_servers').where("db_host=? AND db_port=? AND LOWER(db_type)=LOWER('mysql')", (get.db_host, get.db_port)).count():
                return public.returnMsg(False, '指定服务器已存在: [{}:{}]'.format(get.db_host, get.db_port))

        if db_find['db_user'] != get.db_user or db_find['db_password'] != get.db_password:
            _modify = True

        if _modify:
            res = self.CheckCloudDatabase(get)
            if isinstance(res, dict): return res

        pdata = {
            'db_host': get.db_host,
            'db_port': get.db_port,
            'db_user': get.db_user,
            'db_password': get.db_password,
            'ps': public.xssencode2(get.db_ps.strip())
        }

        result = public.M("database_servers").where('id=?', (id,)).update(pdata)
        if isinstance(result, int):
            public.WriteLog('数据库管理', '修改远程MySQL服务器[{}:{}]'.format(get.db_host, get.db_port))
            return public.returnMsg(True, '修改成功!')
        return public.returnMsg(False, '修改失败： {}'.format(result))

    def AddCloudDatabase(self, get):
        '''
            @name 添加远程数据库
            @author hwliang<2022-01-06>
            @param db_host<string> 服务器地址
            @param db_port<port> 数据库端口
            @param db_user<string> 用户名
            @param db_name<string> 数据库名称
            @param db_password<string> 数据库密码
            @param db_ps<string> 数据库备注
            @return dict
        '''
        if not hasattr(get, 'db_host'):
            return public.returnMsg(False, '参数传递错误，请重试!')
        if not hasattr(get, 'db_port'):
            return public.returnMsg(False, '参数传递错误，请重试!')
        if not hasattr(get, 'db_user'):
            return public.returnMsg(False, '参数传递错误，请重试!')
        if not hasattr(get, 'db_name'):
            return public.returnMsg(False, '参数传递错误，请重试!')
        if not hasattr(get, 'db_password'):
            return public.returnMsg(False, '参数传递错误，请重试!')
        if not hasattr(get, 'db_ps'):
            return public.returnMsg(False, '参数传递错误，请重试!')

        # 检查数据库是否能连接
        res = self.CheckCloudDatabase(get)
        if isinstance(res, dict): return res

        if public.M('databases').where("name=? AND LOWER(type)=LOWER('mysql')", (get.db_name,)).count():
            return public.returnMsg(False, '已存在同名的数据库: [' + get.db_name + ']')
        get.db_port = int(get.db_port)
        conn_config = {
            'db_host': get.db_host,
            'db_port': get.db_port,
            'db_user': get.db_user,
            'db_password': get.db_password,
            'db_name': get.db_name
        }

        pdata = {
            'name': get.db_name,
            'ps': get.db_ps,
            'conn_config': json.dumps(conn_config),
            'db_type': '1',
            'username': get.db_user,
            'password': get.db_password,
            'accept': '127.0.0.1',
            'addtime': time.strftime('%Y-%m-%d %X', time.localtime()),
            'pid': 0
        }

        result = public.M('databases').insert(pdata)
        if isinstance(result, int):
            public.WriteLog('数据库管理', '添加远程MySQL数据库[%s]成功' % (get.db_name))
            return public.returnMsg(True, '添加成功!')
        return public.returnMsg(False, '添加失败： {}'.format(result))

    def CheckCloudDatabase(self, conn_config):
        '''
            @name 检查远程数据库信息是否正确
            @author hwliang<2022-01-06>
            @param conn_config<dict> 连接信息
                db_host<string> 服务器地址
                db_port<port> 数据库端口
                db_user<string> 用户名
                db_name<string> 数据库名称
                db_password<string> 数据库密码
            @return True / dict
        '''
        try:
            if not 'db_name' in conn_config: conn_config['db_name'] = None
            mysql_obj = db_mysql.panelMysql()
            flag = mysql_obj.set_host(conn_config['db_host'], conn_config['db_port'], conn_config['db_name'], conn_config['db_user'], conn_config['db_password'])
            if flag is False:
                if mysql_obj._ex:
                    return public.returnMsg(False, self.GetMySQLError(mysql_obj._ex))
                return public.returnMsg(False, "连接数据库[{}:{}]失败".format(conn_config['db_host'], conn_config['db_port']))

            result = mysql_obj.query("show databases")
            if isinstance(result, str) or self.IsSqlError(result):
                if mysql_obj._ex:
                    return public.returnMsg(False, self.GetMySQLError(mysql_obj._ex))
                else:
                    return public.returnMsg(False, self.GetMySQLError(result))
            if not conn_config['db_name']: return True
            for i in result:
                if i[0] == conn_config['db_name']:
                    return True
            return public.returnMsg(False, '指定数据库不存在!')
        except Exception as ex:
            res = self.GetMySQLError(ex)
            if not res: res = str(ex)
            return public.returnMsg(False, res)

    def GetMySQLError(self, e):
        if isinstance(e, str):
            return e
        res = ''
        if e.args[0] == 1045:
            res = '用户名或密码错误!'
        if e.args[0] == 1049:
            res = '数据库不存在!'
        if e.args[0] == 1044:
            res = '没有指定数据库的访问权限!<br>1、检查数据库用户是否有访问该数据库的权限!<br>2、面板所在服务器IP可能没有访问目标用户的权限!'
        if e.args[0] == 1062:
            res = '数据库已存在!'
        if e.args[0] == 1146:
            res = '数据表不存在!'
        if e.args[0] == 2003:
            res = '数据库服务器连接失败!<br>1、检查远程数据库服务器是否正确放行端口!<br>2、检查远程数据库服务器是否开启!<br>3、检查远程地址或端口输入是正确!'
        if res:
            res = res + "<pre>" + str(e) + "</pre>"
        else:
            res = str(e)
        return res

    # 数据库状态检测
    def CheckDatabaseStatus(self, get):
        """
        数据库状态检测
        """
        if not hasattr(get, "sid"):
            return public.returnMsg(False, "缺少参数！sid")
        if not str(get.sid).isdigit():
            return public.returnMsg(False, "参数错误！sid")
        sid = int(get.sid)

        db_name = None
        if sid != 0:
            conn_config = public.M("database_servers").where("id=? AND LOWER(db_type)=LOWER('mysql')", (sid,)).find()
            if not conn_config:
                return public.returnMsg(False, "远程数据库信息不存在！")
            conn_config["db_name"] = None
            db_user = conn_config["db_user"]
            root_password = conn_config["db_password"]
            db_host = conn_config["db_host"]
            db_port = conn_config["db_port"]
        else:
            db_user = "root"
            root_password = public.M("config").where("id=?", (1,)).getField("mysql_root")
            db_host = "localhost"
            try:
                db_port = int(panelMysql.panelMysql().query("show global variables like 'port'")[0][1])
            except:
                db_port = 3306
        mysql_obj = db_mysql.panelMysql()
        flag = mysql_obj.set_host(db_host, db_port, db_name, db_user, root_password)

        error = ''
        db_status = True
        if flag is False:
            db_status = False
            error = mysql_obj._ex
            error_msg=str(error)
            match_1045 = re.search(r".*\(1045.*", error_msg)
            match_2003 = re.search(r".*\(2003.*", error_msg)
            if match_1045:
                return public.returnMsg(False, '{}用户连接失败，请尝试重置数据库{}密码后重新添加'.format(db_user, db_user))
            elif match_2003:
                return public.returnMsg(False, '数据库连接失败，请检查Mysql是否正常运行')
        return {"status": True, 'error': str(error), "msg": "正常" if db_status is True else "异常", "db_status": db_status}
    # 添加数据库
    def AddDatabase(self, get):
        # try:
        data_name = get['name'].strip().lower()
        if not data_name: return public.returnMsg(False, '数据库名称不能为空')

        if self.CheckRecycleBin(data_name): return public.returnMsg(False, '数据库[' + data_name + ']已在回收站，请从回收站恢复!')
        if len(data_name.encode("utf-8")) > 64: return public.returnMsg(False, '数据库名不能大于64位!')
        reg = r"^[\w\.-]+$"
        username = get.db_user.strip()
        if not username: return public.returnMsg(False, '数据库用户名不能为空')
        if len(username.encode("utf-8")) > 16: return public.returnMsg(False, '数据库用户名不能超过16位')
        if not re.match(reg, data_name): return public.returnMsg(False, 'DATABASE_NAME_ERR_T')
        if not re.match(reg, username): return public.returnMsg(False, '数据库名称不合法!')
        if not hasattr(get, 'db_user'): get.db_user = data_name

        checks = ['root', 'mysql', 'test', 'sys', 'panel_logs']
        if username in checks or len(username) < 1: return public.returnMsg(False, '数据库用户名不合法!')
        if data_name in checks or len(data_name) < 1: return public.returnMsg(False, '数据库名称不合法!')
        data_pwd = get['password']
        re_list = re.findall("[，。？！；：“”‘’（）【】《》￥&\u4e00-\u9fa5]+", data_pwd)
        if re_list: return public.returnMsg(False, f'数据库密码不能包含中文和特殊字符 {" ".join(re_list)}')
        if len(data_pwd) < 1:
            data_pwd = public.md5(str(time.time()))[0:16]

        sql = public.M('databases')
        if sql.where("(username=?) AND LOWER(type)=LOWER('mysql')", (username)).count(): return public.returnMsg(False, '数据库用户已存在，请使用其他数据库用户名称！')
        # if sql.where("(name=? or username=?) AND LOWER(type)=LOWER('mysql')", (data_name, username)).count(): return public.returnMsg(False, 'DATABASE_NAME_EXISTS')

        address = get['address'].strip()
        if address in ['', 'ip']: return public.returnMsg(False, '访问权限为【指定IP】时，需要填写IP地址!')

        user = '是'
        password = data_pwd

        codeing = get['codeing']

        wheres = {
            'utf8': 'utf8_general_ci',
            'utf8mb4': 'utf8mb4_general_ci',
            'gbk': 'gbk_chinese_ci',
            'big5': 'big5_chinese_ci'
        }
        codeStr = wheres[codeing]
        # 添加MYSQL
        sid = get.get('sid/d', 0)
        mysql_obj = public.get_mysql_obj_by_sid(sid)
        if not mysql_obj: return public.returnMsg(False, '连接指定数据库失败')

        # 从MySQL验证是否存在
        if self.database_exists_for_mysql(mysql_obj, data_name):  return public.returnMsg(False, '指定数据库已在MySQL中存在，请换个名称!')

        result = mysql_obj.execute("CREATE DATABASE `{db_name}` DEFAULT CHARACTER SET {db_charset} COLLATE {db_collate};".format(
            db_name=data_name,
            db_charset=codeing,
            db_collate=codeStr
        ))
        isError = self.IsSqlError(result)
        if isError != None: return isError

        mysql_obj.execute("DROP USER `{}`@`localhost`".format(username))
        for a in address.split(','):
            mysql_obj.execute("DROP USER `{}`@`localhost`".format(username, a))

        self.__CreateUsers(sid, data_name, username, password, address)

        if get['ps'] == '': get['ps'] = public.getMsg('INPUT_PS')
        get['ps'] = public.xssencode2(get['ps'])
        addTime = time.strftime('%Y-%m-%d %X', time.localtime())

        pid = 0
        if hasattr(get, 'pid'): pid = get.pid
        # 添加入SQLITE
        db_type = 0
        if sid: db_type = 2
        sql.add('pid,sid,db_type,name,username,password,accept,ps,addtime', (pid, sid, db_type, data_name, username, password, address, get['ps'], addTime))
        public.WriteLog("TYPE_DATABASE", 'DATABASE_ADD_SUCCESS', (data_name,))
        return public.returnMsg(True, 'ADD_SUCCESS')
        # except Exception as ex:
        #     public.WriteLog("TYPE_DATABASE",'DATABASE_ADD_ERR', (data_name,str(ex)))
        #     return public.returnMsg(False,'ADD_ERROR')

    # 判断数据库是否存在—从MySQL
    def database_exists_for_mysql(self, mysql_obj, dataName):
        databases_tmp = self.map_to_list(mysql_obj.query('show databases'))
        if not isinstance(databases_tmp, list):
            return True

        for i in databases_tmp:
            if i[0] == dataName:
                return True
        return False

    # 创建用户
    @classmethod
    def __CreateUsers(cls, sid, dbname, username, password, address):
        mysql_obj = public.get_mysql_obj_by_sid(sid)
        if not mysql_obj: return public.returnMsg(False, '连接指定数据库失败')
        mysql_obj.execute("CREATE USER `%s`@`localhost` IDENTIFIED BY '%s'" % (username, password))
        result = mysql_obj.execute("grant all privileges on `%s`.* to `%s`@`localhost`" % (dbname, username))
        if str(result).find('1044') != -1:
            mysql_obj.execute("grant SELECT,INSERT,UPDATE,DELETE,CREATE,DROP,INDEX,ALTER,CREATE TEMPORARY TABLES,LOCK TABLES,EXECUTE,CREATE VIEW,SHOW VIEW,EVENT,TRIGGER on `%s`.* to `%s`@`localhost`" % (
                dbname, username))
        for a in address.strip("\n").split('\n'):
            if not a: continue
            mysql_obj.execute("CREATE USER `{}`@`{}` IDENTIFIED BY '{}'".format(username, a, password))
            result = mysql_obj.execute("grant all privileges on `%s`.* to `%s`@`%s`" % (dbname, username, a))
            if str(result).find('1044') != -1:
                mysql_obj.execute("grant SELECT,INSERT,UPDATE,DELETE,CREATE,DROP,INDEX,ALTER,CREATE TEMPORARY TABLES,LOCK TABLES,EXECUTE,CREATE VIEW,SHOW VIEW,EVENT,TRIGGER on `%s`.* to `%s`@`%s`" % (
                    dbname, username, a))
        mysql_obj.execute("flush privileges")

    # 检查是否在回收站
    def CheckRecycleBin(self, name):
        try:
            u_name = self.db_name_to_unicode(name)
            for n in os.listdir('/www/.Recycle_bin'):
                if n.find('BTDB_' + name + '_t_') != -1: return True
                if n.find('BTDB_' + u_name + '_t_') != -1: return True
            return False
        except:
            return False

    # 检测数据库执行错误
    @classmethod
    def IsSqlError(cls, mysqlMsg):
        err_dict = {
            1045: "数据库用户名或密码错误！",
            1049: "数据库不存在！",
            1044: "没有指定数据库的访问权限，或指定数据库不存在！",
            1062: "数据库已存在！",
            1142: "指定用户权限不足！",
            1146: "数据表不存在！",
            2002: "本地服务器无法连接！",
            2003: "数据库服务器连接失败！",
            23000: "外键约束冲突！",
        }

        import pymysql
        if isinstance(mysqlMsg, pymysql.err.MySQLError):  # 捕获异常
            error_code, error_message = mysqlMsg.args

            err_msg = err_dict.get(error_code)
            if err_msg is not None:
                error_message = err_msg + "<pre>" + error_message + "</pre>"
            return public.returnMsg(False, error_message)
        mysqlMsg = str(mysqlMsg)
        if "MySQLdb" in mysqlMsg: return public.returnMsg(False, 'DATABASE_ERR_MYSQLDB')
        if "2002," in mysqlMsg or '2003,' in mysqlMsg: return public.returnMsg(False, 'DATABASE_ERR_CONNECT')
        if "using password:" in mysqlMsg: return public.returnMsg(False, 'DATABASE_ERR_PASS')
        if "Connection refused" in mysqlMsg: return public.returnMsg(False, 'DATABASE_ERR_CONNECT')
        if "1133," in mysqlMsg: return public.returnMsg(False, 'DATABASE_ERR_NOT_EXISTS')
        if "3679," in mysqlMsg: return public.returnMsg(False, '从数据库删除失败，数据目录不存在!')
        if "1141," in mysqlMsg: return public.returnMsg(False, '数据库用户添加失败！')
        if "libmysqlclient" in mysqlMsg:
            self.rep_lnk()
            public.ExecShell("pip uninstall mysql-python -y")
            public.ExecShell("pip install pymysql")
            public.writeFile('data/restart.pl', 'True')
            return public.returnMsg(False, "执行失败，已尝试自动修复，请稍候重试!")
        return None

    def rep_lnk(self):
        shell_cmd = '''
Setup_Path=/www/server/mysql
#删除软链
DelLink()
{
	rm -f /usr/bin/mysql*
	rm -f /usr/lib/libmysql*
	rm -f /usr/lib64/libmysql*
    rm -f /usr/bin/myisamchk
    rm -f /usr/bin/mysqldump
    rm -f /usr/bin/mysql
    rm -f /usr/bin/mysqld_safe
    rm -f /usr/bin/mysql_config
}
#设置软件链
SetLink()
{
    ln -sf ${Setup_Path}/bin/mysql /usr/bin/mysql
    ln -sf ${Setup_Path}/bin/mysqldump /usr/bin/mysqldump
    ln -sf ${Setup_Path}/bin/myisamchk /usr/bin/myisamchk
    ln -sf ${Setup_Path}/bin/mysqld_safe /usr/bin/mysqld_safe
    ln -sf ${Setup_Path}/bin/mysqlcheck /usr/bin/mysqlcheck
	ln -sf ${Setup_Path}/bin/mysql_config /usr/bin/mysql_config

	rm -f /usr/lib/libmysqlclient.so.16
	rm -f /usr/lib64/libmysqlclient.so.16
	rm -f /usr/lib/libmysqlclient.so.18
	rm -f /usr/lib64/libmysqlclient.so.18
	rm -f /usr/lib/libmysqlclient.so.20
	rm -f /usr/lib64/libmysqlclient.so.20
	rm -f /usr/lib/libmysqlclient.so.21
	rm -f /usr/lib64/libmysqlclient.so.21

	if [ -f "${Setup_Path}/lib/libmysqlclient.so.18" ];then
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.18 /usr/lib/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.18 /usr/lib64/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.18 /usr/lib/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.18 /usr/lib64/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.18 /usr/lib/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.18 /usr/lib64/libmysqlclient.so.20
	elif [ -f "${Setup_Path}/lib/mysql/libmysqlclient.so.18" ];then
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.18 /usr/lib/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.18 /usr/lib64/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.18 /usr/lib/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.18 /usr/lib64/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.18 /usr/lib/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.18 /usr/lib64/libmysqlclient.so.20
	elif [ -f "${Setup_Path}/lib/libmysqlclient.so.16" ];then
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.16 /usr/lib/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.16 /usr/lib64/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.16 /usr/lib/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.16 /usr/lib64/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.16 /usr/lib/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.16 /usr/lib64/libmysqlclient.so.20
	elif [ -f "${Setup_Path}/lib/mysql/libmysqlclient.so.16" ];then
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.16 /usr/lib/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.16 /usr/lib64/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.16 /usr/lib/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.16 /usr/lib64/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.16 /usr/lib/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.16 /usr/lib64/libmysqlclient.so.20
	elif [ -f "${Setup_Path}/lib/libmysqlclient_r.so.16" ];then
		ln -sf ${Setup_Path}/lib/libmysqlclient_r.so.16 /usr/lib/libmysqlclient_r.so.16
		ln -sf ${Setup_Path}/lib/libmysqlclient_r.so.16 /usr/lib64/libmysqlclient_r.so.16
	elif [ -f "${Setup_Path}/lib/mysql/libmysqlclient_r.so.16" ];then
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient_r.so.16 /usr/lib/libmysqlclient_r.so.16
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient_r.so.16 /usr/lib64/libmysqlclient_r.so.16
	elif [ -f "${Setup_Path}/lib/libmysqlclient.so.20" ];then
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.20 /usr/lib/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.20 /usr/lib64/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.20 /usr/lib/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.20 /usr/lib64/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.20 /usr/lib/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.20 /usr/lib64/libmysqlclient.so.20
	elif [ -f "${Setup_Path}/lib/libmysqlclient.so.21" ];then
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.21 /usr/lib/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.21 /usr/lib64/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.21 /usr/lib/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.21 /usr/lib64/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.21 /usr/lib/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.21 /usr/lib64/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.21 /usr/lib/libmysqlclient.so.21
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.21 /usr/lib64/libmysqlclient.so.21
	elif [ -f "${Setup_Path}/lib/libmariadb.so.3" ]; then
		ln -sf ${Setup_Path}/lib/libmariadb.so.3 /usr/lib/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmariadb.so.3 /usr/lib64/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmariadb.so.3 /usr/lib/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmariadb.so.3 /usr/lib64/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmariadb.so.3 /usr/lib/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/libmariadb.so.3 /usr/lib64/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/libmariadb.so.3 /usr/lib/libmysqlclient.so.21
		ln -sf ${Setup_Path}/lib/libmariadb.so.3 /usr/lib64/libmysqlclient.so.21
	elif [ -f "${Setup_Path}/lib/mysql/libmysqlclient.so.20" ];then
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.20 /usr/lib/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.20 /usr/lib64/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.20 /usr/lib/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.20 /usr/lib64/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.20 /usr/lib/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.20 /usr/lib64/libmysqlclient.so.20
	fi
}
DelLink
SetLink
'''
        return public.ExecShell(shell_cmd)

    # 删除数据库
    def DeleteDatabase(self, get):
        if not hasattr(get, "id"):
            return public.returnMsg(False, "缺少参数！id")
        if not hasattr(get, "name"):
            return public.returnMsg(False, "缺少参数！name")
        db_id = get.id
        db_name = get.name
        db_find = public.M("databases").where("id=? AND name=? AND LOWER(type)=LOWER('mysql')", (db_id, db_name)).find()
        if not db_find:
            return public.returnMsg(False, "数据库[{}]不存在".format(db_name))

        if db_find["db_type"] == 0 or db_find["sid"]:  # # 删除本地数据库
            if os.path.exists("data/recycle_bin_db.pl") and db_find["sid"] == 0:
                return self.DeleteToRecycleBin(db_name)

            username = db_find["username"]
            # 删除MYSQL
            mysql_obj = public.get_mysql_obj_by_sid(db_find["sid"])
            if not mysql_obj:
                if db_find["sid"] != "0":
                    return public.returnMsg(False, "远程数据库连接失败，请检查远程数据库是否正常/账户密码是否正确".format(db_name))
                else:
                    return public.returnMsg(False, "数据库[{}]连接失败,请检查数据库是否启动/root密码是否正确".format(db_name))
            result = mysql_obj.execute("DROP database  `{}`".format(db_name))
            isError = self.IsSqlError(result)
            result=str(result)
            if isError != None: 
                if re.search(r"database doesn't exist", result):
                    public.M('databases').where("id=? AND name=? AND LOWER(type)=LOWER('mysql')", (db_id, db_name)).delete()
                else:
                    return isError
            user_host = mysql_obj.query("select Host from mysql.user where User='{}'".format(username))
            if isinstance(user_host, list):
                for host in user_host:
                    mysql_obj.execute("DROP USER `{}`@`{}`".format(username, host[0]))
            mysql_obj.execute("flush privileges")
        # 删除SQLITE
        public.M('databases').where("id=? AND name=? AND LOWER(type)=LOWER('mysql')", (db_id, db_name)).delete()
        public.WriteLog("TYPE_DATABASE", 'DATABASE_DEL_SUCCESS', (db_name,))
        return public.returnMsg(True, 'DEL_SUCCESS')

    @classmethod
    def db_name_to_unicode(cls, name):
        '''
            @name 中文数据库名转换为Unicode编码
            @author hwliang<2021-12-20>
            @param name<string> 数据库名
            @return name<string> Unicode编码的数据库名
        '''
        name = name.replace('.', '@002e')
        name = name.replace('-', '@002d')
        return name.encode("unicode_escape").replace(b"\\u", b"@").decode()

    # 删除数据库到回收站
    @classmethod
    def DeleteToRecycleBin(cls, db_name):
        Recycle_path = '/www/.Recycle_bin/'

        data = public.M('databases').where("name=? AND LOWER(type)=LOWER('mysql') AND sid=0", (db_name,)).find()
        if not data:
            return public.returnMsg(False, "数据库信息不存在！")
        username = data['username']

        mysql_obj = panelMysql.panelMysql()

        user_host = mysql_obj.query("select Host from mysql.user where User='{}';".format(username))
        if isinstance(user_host, list):
            for host in user_host:
                mysql_obj.execute("DROP USER `{}`@`{}`;".format(username, host[0]))

        mysql_obj.execute("flush privileges")

        data['rmtime'] = int(time.time())
        u_name = cls.db_name_to_unicode(db_name)

        rm_path = os.path.join(Recycle_path, "BTDB_{}_t_{}".format(u_name, data['rmtime']))

        idx = 1
        while os.path.exists(rm_path):
            rm_path = os.path.join(Recycle_path, "BTDB_{}_t_{}({})".format(u_name, data['rmtime'], idx))
            idx += 1

        rm_config_file = os.path.join(rm_path, "config.json")

        datadir = public.get_datadir()
        db_path = os.path.join(datadir, u_name)
        if not os.path.exists(db_path):
            return public.returnMsg(False, '指定数据库数据不存在!: {}'.format(db_path))

        public.ExecShell("mv -f {} {}".format(db_path, rm_path))
        if not os.path.exists(rm_path):
            return public.returnMsg(False, '移动数据库数据到回收站失败!')
        public.writeFile(rm_config_file, json.dumps(data))
        public.M('databases').where("name=? AND LOWER(type)=LOWER('mysql') AND sid=0", (db_name,)).delete()
        public.WriteLog("TYPE_DATABASE", 'DATABASE_DEL_SUCCESS', (db_name,))
        return public.returnMsg(True, 'RECYCLE_BIN_DB')

    # 永久删除数据库
    @classmethod
    def DeleteTo(cls, filename):
        if os.path.isfile(filename):
            try:
                data = json.loads(public.readFile(filename))
            except:
                data = {}
                data['name'] = os.path.basename(filename).replace('BTDB_', '').split('_t_')[0]
                if not data['name']: return public.returnMsg(False, '数据库名称解析失败!')
            if public.M('databases').where("name=? AND LOWER(type)=LOWER('mysql')", (data['name'],)).count():
                os.remove(filename)
                return public.returnMsg(True, 'DEL_SUCCESS')
        else:
            if os.path.exists(filename):
                data = json.loads(public.readFile(os.path.join(filename, "config.json")))
            else:
                return public.returnMsg(False, '指定数据库回收目录不存在!')

        mysql_obj = panelMysql.panelMysql()
        databases_tmp = mysql_obj.query('show databases')
        if not isinstance(databases_tmp, list):
            return public.returnMsg(False, "连接 localhost 数据库失败！")

        flag = False
        for i in databases_tmp:
            if i[0] == data['name']:
                flag = True

        if flag is True:
            u_name = cls.db_name_to_unicode(data['name'])
            datadir = public.get_datadir()
            db_path = os.path.join(datadir, u_name)
            if not os.path.exists(db_path):
                os.makedirs(db_path)
                public.ExecShell("chown mysql:mysql {}".format(db_path))
            result = mysql_obj.execute("DROP database  `{}`;".format(data['name']))
            isError = cls.IsSqlError(result)
            if isError != None: return isError
            user_host = mysql_obj.query("select Host from mysql.user where User='{}';".format(data["username"]))
            if isinstance(user_host, list):
                for host in user_host:
                    mysql_obj.execute("DROP USER `{}`@`{}`;".format(data["username"], host[0]))
            mysql_obj.execute("flush privileges;")

        if os.path.isfile(filename):
            os.remove(filename)
        else:
            import shutil
            shutil.rmtree(filename)

        try:
            public.WriteLog("TYPE_DATABASE", 'DATABASE_DEL_SUCCESS', (data['name'],))
        except:
            pass
        return public.returnMsg(True, 'DEL_SUCCESS')

    # 恢复数据库
    @classmethod
    def RecycleDB(cls, filename):
        import json
        _isdir = False
        if os.path.isfile(filename):
            data = json.loads(public.readFile(filename))
        else:

            re_config_file = os.path.join(filename, "config.json")
            try:
                data = json.loads(public.readFile(re_config_file))
            except:
                return public.returnMsg(False, '指定数据库回收目录不存在!')
            u_name = cls.db_name_to_unicode(data['name'])
            db_path = os.path.join(public.get_datadir(), u_name)
            if os.path.exists(db_path):
                return public.returnMsg(False, '当前数据库中存在同名数据库，为保证数据安全，停止恢复!')
            _isdir = True

        db_info = public.M('databases').where("name=? AND LOWER(type)=LOWER('mysql')", (data['name'],)).find()
        if db_info:
            if db_info["db_type"] != 0 or db_info["sid"] != 0:
                return public.returnMsg(False, "恢复数据库失败!存在同名远程数据库！")
            if not _isdir: os.remove(filename)
            return public.returnMsg(True, 'RECYCLEDB')

        if not _isdir:
            os.remove(filename)
        else:
            public.ExecShell('mv -f {} {}'.format(filename, db_path))
            if not os.path.exists(db_path):
                return public.returnMsg(False, '数据恢复失败!')

            db_config_file = os.path.join(db_path, "config.json")
            if os.path.exists(db_config_file): os.remove(db_config_file)

            # 设置文件权限
            public.ExecShell("chown -R mysql:mysql {}".format(db_path))
            public.ExecShell("chmod -R 660 {}".format(db_path))
            public.ExecShell("chmod  700 {}".format(db_path))

        cls.__CreateUsers(0, data['name'], data['username'], data['password'], data['accept'])
        public.M('databases').add('id,pid,name,username,password,accept,ps,addtime', (data['id'], data['pid'], data['name'], data['username'], data['password'], data['accept'], data['ps'], data['addtime']))
        return public.returnMsg(True, "RECYCLEDB")

    # 设置ROOT密码
    def SetupPassword(self, get):
        password = get['password'].strip()

        if not password: return public.returnMsg(False, 'root密码不能为空')
        re_list = re.findall("[，。？！；：“”‘’（）【】《》￥&\u4e00-\u9fa5]+", password)
        if re_list: return public.returnMsg(False, f'数据库密码不能包含中文和特殊字符 {" ".join(re_list)}')

        try:
            if not password: return public.returnMsg(False, 'root密码不能为空')
            if password.find("'") != -1 or password.find('"') != -1: return public.returnMsg(False, "数据库密码不能包含引号")
            if re.search(r"[\u4e00-\u9fa5]+", password): return public.returnMsg(False, '数据库密码不能包含中文')
            sid = get.get('sid/d', 0)
            # 修改MYSQL
            mysql_obj = public.get_mysql_obj_by_sid(sid)
            if not mysql_obj: return public.returnMsg(False, '连接指定数据库失败')
            result = mysql_obj.query("show databases")
            isError = self.IsSqlError(result)
            is_modify = True
            if isError != None and not sid:
                # 尝试使用新密码
                public.M('config').where("id=?", (1,)).setField('mysql_root', password)
                result = mysql_obj.query("show databases")
                isError = self.IsSqlError(result)
                if isError != None:
                    public.ExecShell("cd /www/server/panel && " + public.get_python_bin() + " tools.py root \"" + password + "\"")
                    is_modify = False

            if is_modify:
                admin_user = 'root'
                m_version = public.readFile(public.GetConfigValue('setup_path') + '/mysql/version.pl')
                if sid:
                    admin_user = mysql_obj._USER
                    m_version = mysql_obj.query('select version();')[0][0]

                if m_version.find('5.7') != -1 or m_version.find('8.0') != -1:
                    accept = self.map_to_list(mysql_obj.query("select Host from mysql.user where User='{}'".format(admin_user)))
                    for my_host in accept:
                        mysql_obj.execute("UPDATE mysql.user SET authentication_string='' WHERE User='{}' and Host='{}'".format(admin_user, my_host[0]))
                        mysql_obj.execute("ALTER USER `%s`@`%s` IDENTIFIED BY '%s'" % (admin_user, my_host[0], password))
                elif m_version.find('10.5.') != -1 or m_version.find('10.4.') != -1:
                    accept = self.map_to_list(mysql_obj.query("select Host from mysql.user where User='{}'".format(admin_user)))
                    for my_host in accept:
                        mysql_obj.execute("ALTER USER `%s`@`%s` IDENTIFIED BY '%s'" % (admin_user, my_host[0], password))
                else:
                    result = mysql_obj.execute("update mysql.user set Password=password('" + password + "') where User='{}'".format(admin_user))
                mysql_obj.execute("flush privileges")

            msg = public.getMsg('DATABASE_ROOT_SUCCESS')
            # 修改SQLITE
            if sid:
                public.M('database_servers').where("id=? AND LOWER(db_type)=LOWER('mysql')", sid).setField('db_password', password)
                public.WriteLog("TYPE_DATABASE", "修改远程MySQL服务器管理员密码")
            else:
                public.M('config').where("id=?", (1,)).setField('mysql_root', password)
                public.WriteLog("TYPE_DATABASE", "DATABASE_ROOT_SUCCESS")
                session['config']['mysql_root'] = password
            return public.returnMsg(True, msg)
        except Exception as ex:
            return public.returnMsg(False, str(ex))

    # 修改用户密码
    def ResDatabasePassword(self, get):
        # try:
        newpassword = get['password']
        username = get['name']
        id = get['id']
        if not newpassword: return public.returnMsg(False, '数据库[%s]密码不能为空' % username)

        re_list = re.findall("[，。？！；：“”‘’（）【】《》￥&\u4e00-\u9fa5]+", newpassword)
        if re_list: return public.returnMsg(False, f'数据库密码不能包含中文字符 {" ".join(re_list)}')

        db_find = public.M('databases').where("id=? AND LOWER(type)=LOWER('mysql')", (id,)).find()
        name = db_find['name']

        if newpassword.find("'") != -1 or newpassword.find('"') != -1: return public.returnMsg(False, "数据库密码不能包含引号")
        # 修改MYSQL
        sid = db_find['sid']
        if sid and username == 'root': return public.returnMsg(False, '不能修改远程数据库的root密码')
        mysql_obj = public.get_mysql_obj_by_sid(sid)
        if not mysql_obj: return public.returnMsg(False, '连接指定数据库失败')
        m_version = public.readFile(public.GetConfigValue('setup_path') + '/mysql/version.pl')
        if sid:
            m_version = mysql_obj.query('select version();')[0][0]

        if not isinstance(m_version, str):
            public.ExecShell('mysql -V > /www/server/mysql/version_v.pl')
            m_version = public.readFile('/www/server/mysql/version_v.pl')

        user_result=mysql_obj.query("select * from mysql.user where User='" + username + "'")
        if not user_result:
            return public.returnMsg(False, "数据库用户不存在，请同步此数据库后再重新设置密码！")

        if m_version.find('5.7') != -1 or m_version.find('8.0') != -1:
            accept = self.map_to_list(mysql_obj.query("select Host from mysql.user where User='" + username + "' AND Host!='localhost'"))
            mysql_obj.execute("update mysql.user set authentication_string='' where User='" + username + "'")
            result = mysql_obj.execute("ALTER USER `%s`@`localhost` IDENTIFIED BY '%s'" % (username, newpassword))
            for my_host in accept:
                mysql_obj.execute("ALTER USER `%s`@`%s` IDENTIFIED BY '%s'" % (username, my_host[0], newpassword))
        elif m_version.find('10.5.') != -1 or m_version.find('10.4.') != -1:
            accept = self.map_to_list(mysql_obj.query("select Host from mysql.user where User='" + username + "' AND Host!='localhost'"))
            result = mysql_obj.execute("ALTER USER `%s`@`localhost` IDENTIFIED BY '%s'" % (username, newpassword))
            for my_host in accept:
                mysql_obj.execute("ALTER USER `%s`@`%s` IDENTIFIED BY '%s'" % (username, my_host[0], newpassword))
        else:
            result = mysql_obj.execute("update mysql.user set Password=password('" + newpassword + "') where User='" + username + "'")

        isError = self.IsSqlError(result)
        if isError != None: return isError

        mysql_obj.execute("flush privileges")
        # if result==False: return public.returnMsg(False,'DATABASE_PASS_ERR_NOT_EXISTS')
        # 修改SQLITE
        if int(id) > 0:
            public.M('databases').where("id=? AND LOWER(type)=LOWER('mysql')", (id,)).setField('password', newpassword)
        else:
            public.M('config').where("id=?", (id,)).setField('mysql_root', newpassword)
            session['config']['mysql_root'] = newpassword

        public.WriteLog("TYPE_DATABASE", 'DATABASE_PASS_SUCCESS', (name,))
        return public.returnMsg(True, 'DATABASE_PASS_SUCCESS', (name,))
        # except Exception as ex:
        #     if str(ex).find('public.PanelError') != -1:
        #         raise ex
        #     import traceback
        #     public.WriteLog("TYPE_DATABASE", 'DATABASE_PASS_ERROR',(username,traceback.format_exc(limit=True).replace('\n','<br>')))
        #     return public.returnMsg(False,'DATABASE_PASS_ERROR',(name,))

    # 备份数据库
    def ToBackup(self, get):
        """
        备份数据库
        csv /www/server/mysql/bin/mysql -uroot -padmin test5 -e "select * from test1;" --default-character-set=gbk | sed 's/\t/","/g;s/^/"/;s/$/"/;s/\n//g' > /www/backup/database/mysql/test.csv
        """
        try:
            public.writeFile("/tmp/backup_sql.log","Starting to backup the database!")
            public.ExecShell("echo '' >> /tmp/backup_sql.log")
            if not os.path.exists(self._MYSQLDUMP_BIN):
                return public.returnMsg(False, "缺少备份工具，请先通过软件管理安装MySQL!")

            if not hasattr(get, "id"):
                return public.returnMsg(False, "缺少参数！id")
            db_id = get.id
            table_list = getattr(get, "table_list", "[]")
            storage_type = getattr(get, "storage_type", "db")

            if storage_type not in ["db", "table"]:
                return public.returnMsg(False, "参数错误！storage_type")
            try:
                table_list = json.loads(table_list)
            except:
                return public.returnMsg(False, "参数错误！table_list")

            db_find = public.M("databases").where("id=? AND LOWER(type)=LOWER('mysql')", (db_id,)).find()
            if not db_find:
                return public.returnMsg(False, "数据库不存在！{db_id}".format(db_id=db_id))

            db_name = db_find["name"]

            flag, conn_config = self.__get_db_name_config(db_name)
            if flag is False:
                return conn_config

            mysql_obj = db_mysql.panelMysql()
            flag = mysql_obj.set_host(conn_config["db_host"], conn_config["db_port"], None, conn_config["db_user"], conn_config["db_password"])
            if flag is False:
                return public.returnMsg(False, self.GetMySQLError(mysql_obj._ex))

            db_backup_dir = os.path.join(self._MYSQL_BACKUP_DIR, db_name)
            if not os.path.exists(db_backup_dir):
                os.makedirs(db_backup_dir)

            file_name = "{db_name}_{backup_time}_mysql_data_{number}".format(db_name=db_name, backup_time=time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime()), number=public.GetRandomString(5))

            db_charset = public.get_database_character(db_name)

            set_gtid_purged = ""
            resp = public.ExecShell("{} --help | grep set-gtid-purged".format(self._MYSQLDUMP_BIN))[0]
            if resp.find("--set-gtid-purged") != -1:
                set_gtid_purged = "--set-gtid-purged=OFF"

            if db_find["db_type"] == 2:
                db_user =conn_config["db_user"]
                db_password = conn_config["db_password"]
                db_port = int(conn_config["db_port"])
            else:
                db_user="root"
                db_password=public.M("config").where("id=?", (1,)).getField("mysql_root")
                db_port=conn_config["db_port"]
                
            shell = "'{mysqldump_bin}' {set_gtid_purged} --opt --skip-lock-tables --single-transaction --routines --events --skip-triggers --default-character-set='{db_charset}' --force " \
                    "--host='{db_host}' --port={db_port} --user='{db_user}' --password='{db_password}' '{db_name}'".format(
                mysqldump_bin=self._MYSQLDUMP_BIN,
                set_gtid_purged=set_gtid_purged,
                db_charset=db_charset,
                db_host=conn_config["db_host"],
                db_port=db_port,
                db_user=db_user,
                db_password=db_password,
                db_name=db_name,
            )
            backup_ps = "手动备份"
            if storage_type == "db":  # 导出单个文件
                export_dir = os.path.join(db_backup_dir, file_name + ".sql")
                table_shell = ""
                if len(table_list) != 0:
                    backup_ps += "-合并导出"
                    table_shell = "'" + "' '".join(table_list) + "'"

                shell += " {table_shell} > '{backup_path}'".format(table_shell=table_shell, backup_path=export_dir)
                public.ExecShell(shell, env={"MYSQL_PWD": conn_config["db_password"]})

            else:  # 按表导出
                backup_ps += "-分表导出"
                export_dir = os.path.join(db_backup_dir, file_name)
                if not os.path.isdir(export_dir):
                    os.makedirs(export_dir)

                for table_name in table_list:
                    tb_backup_path = os.path.join(export_dir, "{table_name}.sql".format(table_name=table_name))
                    tb_shell = shell + " '{table_name}' | tee /tmp/backup_sql.log > '{tb_backup_path}' ".format(table_name=table_name, tb_backup_path=tb_backup_path)
                    public.ExecShell(tb_shell, env={"MYSQL_PWD": conn_config["db_password"]})
            zip_password = getattr(get, "password", None)
            password_shell = ""
            if zip_password:
               password_shell = "-P '{zip_password}'".format(zip_password=zip_password)
            if os.path.isfile(export_dir):
                backup_path = "{export_dir}.zip".format(export_dir=export_dir)
                public.ExecShell("zip -m -j '{backup_path}' {password_shell} '{file_name}' >> /tmp/backup_sql.log".format(backup_dir=db_backup_dir, backup_path=backup_path,file_name=export_dir,password_shell=password_shell))
            elif os.path.isdir(export_dir):
                backup_path = "{export_dir}.zip".format(export_dir=export_dir)
                public.ExecShell("zip -m -j '{backup_path}' {password_shell} -r '{export_dir}'".format(backup_dir=db_backup_dir, backup_path=backup_path, export_dir=export_dir,password_shell=password_shell))
            else:
                return public.returnMsg(False,"导出失败！")
            public.ExecShell("rm -rf {}".format(export_dir))
            time.sleep(0.1)
            if not os.path.exists(backup_path):
                return public.returnMsg(False, "数据库备份失败，导出文件不存在！")

            addTime = time.strftime('%Y-%m-%d %X', time.localtime())
            backup_size = os.path.getsize(backup_path)
            public.M("backup").add("type,name,pid,filename,size,addtime,ps", (1, os.path.basename(backup_path), db_id, backup_path, backup_size, addTime, backup_ps))
            public.WriteLog("TYPE_DATABASE", "DATABASE_BACKUP_SUCCESS", (db_name,))
            return public.returnMsg(True, "BACKUP_SUCCESS")
        except Exception as e:
          return public.returnMsg(False, str(e))


    # 导入
    def InputSql(self, get):
        public.writeFile("/tmp/import_sql.log", "Starting to import the database!")
        public.ExecShell("echo '' >> /tmp/import_sql.log")
        if not os.path.exists(self._MYSQL_BIN):
            return public.returnMsg(False, "缺少备份工具，请先通过软件管理安装MySQL!")

        if not hasattr(get, "name"):
            return public.returnMsg(False, "缺少参数！name")
        if not hasattr(get, "file"):
            return public.returnMsg(False, "缺少参数！file")

        zip_password = getattr(get, "password", None)
        password_shell = ""
        if zip_password:
            password_shell = "-P '{zip_password}'".format(zip_password=zip_password)

        db_name = get.name
        file = get.file

        if file.count("|") == 2:  # 从云存储下载
            local_path, cloud_name, file_name = file.split("|")
            if not os.path.exists(local_path):
                from CloudStoraUpload import CloudStoraUpload
                cloud = CloudStoraUpload()
                if cloud.run(cloud_name) is False:
                    return public.returnMsg(False, "连接云存储失败！")
                clould_path = os.path.join(cloud.obj.backup_path, "database", "mysql", db_name, file_name)
                cloud.cloud_download_file(clould_path, local_path)
            if not os.path.exists(local_path):
                return public.returnMsg(False, "从云存储下载失败！")
            file = local_path

        if not os.path.exists(file): return public.returnMsg(False, "导入路径不存在!")
        if not os.path.isfile(file): return public.returnMsg(False, "仅支持导入压缩文件!")

        password = public.M("config").where("id=?", (1,)).getField("mysql_root")

        file_name = os.path.basename(file)
        _, file_ext = os.path.splitext(file_name)
        if file_name.lower().endswith(".tar.gz"):
            file_ext = ".tar.gz"
        ext_list = [".sql", ".tar.gz", ".gz", ".zip"]
        if file_ext not in ext_list:
            return public.returnMsg(False, "请选择sql、tar.gz、gz、zip文件格式!")
        db_find = public.M("databases").where("name=? AND LOWER(type)=LOWER('mysql')", db_name).find()

        mysql_obj = public.get_mysql_obj_by_sid(db_find["sid"])
        if not mysql_obj: return public.returnMsg(False, "连接数据库失败!")
        result = mysql_obj.execute("show databases")
        isError = self.IsSqlError(result)
        if isError: return isError

        # 解压
        input_dir = os.path.join(self._MYSQL_BACKUP_DIR, db_name, "input_tmp_{}".format(int(time.time() * 1000_000)))

        public.ExecShell("echo '检查导入的压缩文件格式！' >> /tmp/import_sql.log")
        is_zip = False
        if file_ext == ".zip":
            if not os.path.isdir(input_dir): os.makedirs(input_dir)

            public.ExecShell("echo '开始解压导入的压缩文件!' >> /tmp/import_sql.log")
            # 定义你的命令
            command = "unzip {password_shell} -o '{file}' -d '{input_dir}'".format(password_shell=password_shell, file=file, input_dir=input_dir)
            result = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            print(command)
            if b'incorrect password' in result.stderr:
                return public.returnMsg(False,"压缩密码错误！")
                return public.returnMsg(False, "压缩密码错误！")
            elif b'inflating' in result.stdout:
                is_zip = True
            elif b'extracting' in result.stdout:
                return public.returnMsg(False,"未包含有效备份文件，恢复失败！请检测备份是否完整！")
                return public.returnMsg(False, "未包含有效备份文件，恢复失败！请检测备份是否完整！")
            else:
                return public.returnMsg(False,"解压错误！")
                return public.returnMsg(False, "解压错误！")


        elif file_ext == ".tar.gz":
            public.ExecShell("echo '开始解压导入的压缩文件!' >> /tmp/import_sql.log")
            if not os.path.isdir(input_dir): os.makedirs(input_dir)
            public.ExecShell("tar zxf '{file}' -C '{input_dir}'".format(file=file, input_dir=input_dir))
            is_zip = True
        elif file_ext == ".gz":
            public.ExecShell("echo '开始解压导入的压缩文件!' >> /tmp/import_sql.log")
            if not os.path.isdir(input_dir): os.makedirs(input_dir)
            temp_file = os.path.join(input_dir, file_name)
            public.ExecShell("cp '{file}' '{temp_file}' && gunzip -q '{temp_file}'".format(file=file, temp_file=temp_file))
            is_zip = True

        input_path_list = []
        if is_zip is True:  # 遍历临时目录
            def get_input_path(input_dir: str, input_path_list: list):
                for file_name in os.listdir(input_dir):
                    path = os.path.join(input_dir, file_name)
                    if os.path.isfile(path) and path.endswith(".sql"):
                        input_path_list.append(path)
                    elif os.path.isdir(path):
                        get_input_path(path, input_path_list)

            get_input_path(input_dir, input_path_list)
        else:
            input_path_list.append(file)

        db_host = "localhost"
        db_user = "root"
        if db_find["db_type"] == 0:  # 本地数据库
            result = panelMysql.panelMysql().execute("show databases")
            isError = self.IsSqlError(result)
            if isError: return isError
            db_password = public.M("config").where("id=?", (1,)).getField("mysql_root")
            if not db_password:
                return public.returnMsg(False, "数据库密码为空！请先设置数据库密码！")
            try:
                db_port = int(panelMysql.panelMysql().query("show global variables like 'port'")[0][1])
            except:
                db_port = 3306
        elif db_find["db_type"] == 1:
            # 远程数据库
            conn_config = json.loads(db_find["conn_config"])
            res = self.CheckCloudDatabase(conn_config)
            if isinstance(res, dict): return res
            db_host = conn_config["db_host"]
            db_port = int(conn_config["db_port"])
            db_user = conn_config["db_user"]
            db_password = public.shell_quote(str(conn_config["db_password"]))
        elif db_find["db_type"] == 2:
            conn_config = public.M("database_servers").where("id=? AND LOWER(db_type)=LOWER('mysql')", db_find["sid"]).find()
            res = self.CheckCloudDatabase(conn_config)
            if isinstance(res, dict): return res
            db_host = conn_config["db_host"]
            db_port = int(conn_config["db_port"])
            db_user = conn_config["db_user"]
            db_password = public.shell_quote(str(conn_config["db_password"]))
        else:
            return public.returnMsg(False, "未知的数据库类型")

        db_charset = public.get_database_character(db_name)
        shell = "'{mysql_bin}' --force --default-character-set='{db_charset}' --host='{db_host}' --port={db_port} --user='{db_user}' --password='{password}' '{db_name}'".format(
            mysql_bin=self._MYSQL_BIN,
            db_charset=db_charset,
            db_host=db_host,
            db_port=db_port,
            db_user=db_user,
            password=db_password,
            db_name=db_name,
        )
        for path in input_path_list:
            public.ExecShell("{shell} < '{path}'".format(shell=shell, path=path), env={"MYSQL_PWD": password})

        # 清理导入临时目录
        if is_zip is True:
            public.ExecShell("rm -rf '{input_dir}'".format(input_dir=input_dir))
        public.WriteLog("TYPE_DATABASE", "DATABASE_INPUT_SUCCESS", (db_name,))
        public.ExecShell("echo 'Database recovery successful!' >> /tmp/import_sql.log")
        return public.returnMsg(True, "DATABASE_INPUT_SUCCESS")



    # 获取备份文件
    def GetBackup(self, get):
        p = getattr(get, "p", 1)
        limit = getattr(get, "limit", 10)
        return_js = getattr(get, "return_js", "")
        search = getattr(get, "search", None)

        if not str(p).isdigit():
            return public.returnMsg(False, "参数错误！p")
        if not str(limit).isdigit():
            return public.returnMsg(False, "参数错误！limit")

        p = int(p)
        limit = int(limit)

        ext_list = ["sql", "tar.gz", "gz", "zip"]

        backup_list = []

        # 递归获取备份文件
        def get_dir_backup(backup_dir: str, backup_list: list, is_recursion: bool):
            for name in os.listdir(backup_dir):
                path = os.path.join(backup_dir, name)
                if os.path.isdir(path) and name == "all_backup": continue  # 跳过全部备份目录
                if os.path.isfile(path):
                    ext = name.split(".")[-1]
                    if ext.lower() not in ext_list: continue
                    if search is not None and search not in name: continue

                    stat_file = os.stat(path)
                    path_data = {
                        "name": name,
                        "path": path,
                        "size": stat_file.st_size,
                        "mtime": int(stat_file.st_mtime),
                        "ctime": int(stat_file.st_ctime),
                    }
                    backup_list.append(path_data)
                elif os.path.isdir(path) and is_recursion is True:
                    get_dir_backup(path, backup_list, is_recursion)

        get_dir_backup(self._MYSQL_BACKUP_DIR, backup_list, True)
        get_dir_backup(self._DB_BACKUP_DIR, backup_list, False)

        try:
            from flask import request
            uri = public.url_encode(request.full_path)
        except:
            uri = ''
        # 包含分页类
        import page
        # 实例化分页类
        page = page.Page()
        info = {
            "p": p,
            "count": len(backup_list),
            "row": limit,
            "return_js": return_js,
            "uri": uri,
        }
        page_info = page.GetPage(info)

        start_idx = (int(p) - 1) * limit
        end_idx = p * limit if p * limit < len(backup_list) else len(backup_list)
        backup_list.sort(key=lambda data: data["mtime"], reverse=True)
        backup_list = backup_list[start_idx:end_idx]
        return {"status": True, "msg": "OK", "data": backup_list, "page": page_info}

    # 删除备份文件
    def DelBackup(self, get):
        if not hasattr(get, "id"):
            return public.returnMsg(False, "缺少参数！id")
        db_id = get.id

        backup_info = public.M("backup").where("id=?", (db_id,)).find()
        if not backup_info:
            return public.returnMsg(False, "备份已删除！")
        filename = backup_info["filename"]

        if os.path.exists(filename):
            os.remove(filename)
        db_name = ""
        try:
            if filename == "qiniu":
                name = backup_info["name"]
                public.ExecShell(public.get_python_bin() + " " + public.GetConfigValue(
                    "setup_path") + "/panel/script/backup_qiniu.py delete_file " + name)
            public.M("backup").where("id=?", (db_id,)).delete()

            # 取实际
            pid = backup_info["pid"]
            db_name = public.M("databases").where("id=? AND LOWER(type)=LOWER('mysql')", (pid,)).getField("name")
            public.WriteLog("TYPE_DATABASE", "DATABASE_BACKUP_DEL_SUCCESS", (db_name, filename))
            return public.returnMsg(True, "DEL_SUCCESS")
        except Exception as ex:
            public.WriteLog("TYPE_DATABASE", "DATABASE_BACKUP_DEL_ERR", (db_name, filename, str(ex)))
            return public.returnMsg(False, "DEL_ERROR")

    # 同步数据库到服务器
    def SyncToDatabases(self, get):
        # result = panelMysql.panelMysql().execute("show databases")
        # isError=self.IsSqlError(result)
        # if isError: return isError
        type = int(get['type'])
        n = 0
        sql = public.M('databases')
        if type == 0:
            data = sql.field('id,sid,name,username,password,accept,db_type').where("LOWER(type)=LOWER('mysql')",
                                                                                   ()).select()
            for value in data:
                if value['db_type'] in ['1', 1]:
                    continue  # 跳过远程数据库
                result = self.ToDataBase(value)
                if result == 1: n += 1
        else:
            import json
            data = json.loads(get.ids)
            for value in data:
                find = sql.where("id=? AND LOWER(type)=LOWER('mysql')", (value,)).field(
                    'id,sid,name,username,password,accept').find()
                result = self.ToDataBase(find)
                if result == 1: n += 1

        # 当只同步1个数据库时，不返回成功数量
        if n == 1:
            return public.returnMsg(True, '同步成功')
        elif n == 0:
            # 失败
            return public.returnMsg(True, '同步失败')
        else:
            return public.returnMsg(True, 'DATABASE_SYNC_SUCCESS', (str(n),))

    # 配置
    def mypass(self, act, password=None):
        conf_file = '/etc/my.cnf'
        conf_file_bak = '/etc/my.cnf.bak'
        if os.path.getsize(conf_file) > 2:
            public.writeFile(conf_file_bak, public.readFile(conf_file))
            public.set_mode(conf_file_bak, 600)
            public.set_own(conf_file_bak, 'mysql')
        elif os.path.getsize(conf_file_bak) > 2:
            public.writeFile(conf_file, public.readFile(conf_file_bak))
            public.set_mode(conf_file, 600)
            public.set_own(conf_file, 'mysql')

        public.ExecShell("sed -i '/user=root/d' {}".format(conf_file))
        public.ExecShell("sed -i '/password=/d' {}".format(conf_file))
        if act:
            password = public.M('config').where('id=?', (1,)).getField('mysql_root')
            mycnf = public.readFile(conf_file)
            if not mycnf: return False
            src_dump_re = r"\[mysqldump\][^.]"
            sub_dump = "[mysqldump]\nuser=root\npassword=\"{}\"\n".format(password)
            mycnf = re.sub(src_dump_re, sub_dump, mycnf)
            if len(mycnf) > 100: public.writeFile(conf_file, mycnf)
            return True
        return True

    # 添加到服务器
    def ToDataBase(self, find):
        # if find['username'] == 'bt_default': return 0
        if len(find['password']) < 3:
            find['username'] = find['name']
            find['password'] = public.md5(str(time.time()) + find['name'])[0:10]
            public.M('databases').where("id=? AND LOWER(type)=LOWER('mysql')", (find['id'],)).save('password,username', (find['password'], find['username']))
        sid = find['sid']
        mysql_obj = public.get_mysql_obj_by_sid(find['sid'])
        if not mysql_obj: return public.returnMsg(False, '连接指定数据库失败')
        result = mysql_obj.execute("create database `" + find['name'] + "`")
        if "using password:" in str(result): return -1
        if "Connection refused" in str(result): return -1

        password = find['password']
        # if find['password']!="" and len(find['password']) > 20:
        # password = find['password']

        self.__CreateUsers(sid, find['name'], find['username'], password, find['accept'])
        return 1

    # 从服务器获取数据库
    def SyncGetDatabases(self, get):
        sid = get.get('sid/d', 0)
        db_type = 0
        if sid: db_type = 2
        if not os.path.exists('/usr/bin/mysql'):
            public.install_mysql_client()
        mysql_obj = public.get_mysql_obj_by_sid(sid)
        if not mysql_obj: return public.returnMsg(False, '连接指定数据库失败')
        data = mysql_obj.query("show databases")
        isError = self.IsSqlError(data)
        if isError != None: return isError
        users = mysql_obj.query("select User,Host from mysql.user where User!='root' AND Host!='localhost' AND Host!=''")

        if type(users) == str: return public.returnMsg(False, users)
        if type(users) != list: return public.returnMsg(False, public.GetMySQLError(users))

        sql = public.M('databases')
        nameArr = ['information_schema', 'performance_schema', 'mysql', 'sys']
        n = 0
        for value in data:
            b = False
            for key in nameArr:
                if value[0] == key:
                    b = True
                    break
            if b: continue
            if sql.where("name=? AND LOWER(type)=LOWER('mysql')", (value[0],)).count(): continue
            host = '127.0.0.1'

            for user in users:
                if value[0] == user[0]:
                    host = user[1]
                    break

            ps = public.getMsg('INPUT_PS')
            if value[0] == 'test':
                ps = public.getMsg('DATABASE_TEST')

            # XSS过虑
            if not re.match("^[\w+\.-]+$", value[0]): continue

            addTime = time.strftime('%Y-%m-%d %X', time.localtime())

            if public.M('databases').add('name,sid,db_type,username,password,accept,ps,addtime', (value[0], sid, db_type, value[0], '', host, ps, addTime)): n += 1

        return public.returnMsg(True, 'DATABASE_GET_SUCCESS', (str(n),))

    # 获取数据库权限
    def GetDatabaseAccess(self, get):
        name = get['name']
        db_name = public.M('databases').where("username=? AND LOWER(type)=LOWER('mysql')", name).getField('name')
        mysql_obj = public.get_mysql_obj(db_name)
        if mysql_obj is False:
            return public.returnMsg(False, "连接数据库失败")
        users = mysql_obj.query("select Host from mysql.user where User='" + name + "' AND Host!='localhost'")
        isError = self.IsSqlError(users)
        if isError != None: return isError
        users = self.map_to_list(users)

        if len(users) < 1:
            return public.returnMsg(True, "127.0.0.1")

        accs = []
        for c in users:
            accs.append(c[0])
        userStr = '\n'.join(accs)
        return public.returnMsg(True, userStr)

    # 设置数据库权限
    def SetDatabaseAccess(self, get):
        names = get['name'].split(',')
        set_phpv_successfully = []
        set_phpv_failed = {}
        for name in names:
            try:
                db_find = public.M('databases').where("username=? AND LOWER(type)=LOWER('mysql')", (name,)).find()
                db_name = db_find['name']
                sid = db_find['sid']
                mysql_obj = public.get_mysql_obj(db_name)
                access = get['access'].strip()
                if access in ['']: return public.returnMsg(False, 'IP地址不能为空!')
                password = public.M('databases').where("username=? AND LOWER(type)=LOWER('mysql')", (name,)).getField(
                    'password')
                result = mysql_obj.query("show databases")
                isError = self.IsSqlError(result)
                if isError != None: return isError
                users = mysql_obj.query("select Host from mysql.user where User='" + name + "' AND Host!='localhost'")

                for us in users:
                    mysql_obj.execute("drop user `{name}`@`{host}`".format(name=name, host=us[0]))
                self.__CreateUsers(sid, db_name, name, password, access)
                set_phpv_successfully.append(db_name)
            except Exception as e:
                set_phpv_failed[name] = "操作失败"
                pass

        if len(names) > 1:
            return {'status': True, 'msg': '设置[ {} ]数据库权限成功'.format(','.join(set_phpv_successfully)),
                    'error': set_phpv_failed,
                    'success': set_phpv_successfully}

        return public.returnMsg(True, 'SET_SUCCESS')

    # 获取数据库配置信息
    def GetMySQLInfo(self, get):
        data = {}
        try:
            public.CheckMyCnf()
            myfile = '/etc/my.cnf'
            mycnf = public.readFile(myfile)
            rep = "datadir\s*=\s*(.+)\n"
            data['datadir'] = re.search(rep, mycnf).groups()[0]
            rep = "port\s*=\s*([0-9]+)\s*\n"
            data['port'] = re.search(rep, mycnf).groups()[0]
        except:
            data['datadir'] = '/www/server/data'
            data['port'] = '3306'
        return data

    # 修改数据库目录
    def SetDataDir(self, get):
        if get.datadir[0] != '/': return public.returnMsg(False, '数据目录必须以根目录 / 开头')
        if get.datadir[-1] == '/': get.datadir = get.datadir[0:-1]
        if len(get.datadir) > 32: return public.returnMsg(False, '数据目录长度不能超过32位')
        if not re.search(r"^[0-9A-Za-z_/\\]+$", get.datadir): return public.returnMsg(False, '数据库路径中不能包含特殊符号')
        second_split = get.datadir.find('/', 1)
        top_dir = get.datadir
        if second_split > -1: top_dir = top_dir[:second_split]
        danger_dirs = ['/etc', '/usr', '/boot', '/proc', '/sys', '/tmp', '/root', '/lib', '/bin', '/sbin', '/run', '/lib64', '/lib32', '/srv']
        if top_dir in danger_dirs:
            return public.returnMsg(False, f'数据目录不能放在{top_dir}目录下，可能导致数据丢失或系统异常。')
        if not os.path.exists(get.datadir): public.ExecShell('mkdir -p ' + get.datadir)

        mysqlInfo = self.GetMySQLInfo(get)
        if mysqlInfo['datadir'] == get.datadir: return public.returnMsg(False, 'DATABASE_MOVE_RE')

        public.ExecShell('/etc/init.d/mysqld stop')
        public.ExecShell('\cp -arf ' + mysqlInfo['datadir'] + '/* ' + get.datadir + '/')
        public.ExecShell('chown -R mysql.mysql ' + get.datadir)
        public.ExecShell('chmod -R 755 ' + get.datadir)
        public.ExecShell('rm -f ' + get.datadir + '/*.pid')
        public.ExecShell('rm -f ' + get.datadir + '/*.err')

        public.CheckMyCnf()
        myfile = '/etc/my.cnf'
        mycnf = public.readFile(myfile)
        public.writeFile('/etc/my_backup.cnf', mycnf)
        mycnf = mycnf.replace(mysqlInfo['datadir'], get.datadir)
        public.writeFile(myfile, mycnf)
        public.ExecShell('/etc/init.d/mysqld start')
        result = public.ExecShell('ps aux|grep mysqld|grep -v grep')
        if len(result[0]) > 10:
            public.writeFile('data/datadir.pl', get.datadir)
            return public.returnMsg(True, 'DATABASE_MOVE_SUCCESS')
        else:
            public.ExecShell('pkill -9 mysqld')
            public.writeFile(myfile, public.readFile('/etc/my_backup.cnf'))
            public.ExecShell('/etc/init.d/mysqld start')
            return public.returnMsg(False, 'DATABASE_MOVE_ERR')

    # 修改数据库端口
    def SetMySQLPort(self, get):
        myfile = '/etc/my.cnf'
        mycnf = public.readFile(myfile)
        rep = r"port\s*=\s*([0-9]+)\s*\n"
        mycnf = re.sub(rep, 'port = ' + get.port + '\n', mycnf)
        public.writeFile(myfile, mycnf)
        public.ExecShell('/etc/init.d/mysqld restart')
        return public.returnMsg(True, 'EDIT_SUCCESS')

    # 获取错误日志
    def GetErrorLog(self, get):
        path = self.GetMySQLInfo(get)['datadir']
        if not os.path.exists(path):
            return public.returnMsg(False, '数据库目录不存在，请检查Mysql是否安装正常')
        filename = ''
        for n in os.listdir(path):
            if len(n) < 5: continue
            if n[-3:] == 'err':
                filename = path + '/' + n
                break
        if not os.path.exists(filename): return public.returnMsg(False, 'FILE_NOT_EXISTS')
        log_data = public.xsssec(public.GetNumLines(filename, 1000)).split('\n')
        if hasattr(get, 'close'):
            public.writeFile(filename, '')
            return public.returnMsg(True, 'LOG_CLOSE')
        screening_datas = []
        if hasattr(get, 'screening') and get.screening != "all" and get.screening != "":
            get.screening = get.screening.split(',')
            for i in log_data:
                for screening in get.screening:
                    if '[' + screening + ']' in i.lower():
                        screening_datas.append(i)
        else:
            return '\n'.join(log_data)
        return '\n'.join(screening_datas)

    # 二进制日志开关
    def BinLog(self, get):
        status = getattr(get, "status", None)
        mysql_cnf = public.readFile(self._MYSQL_CNF)

        if not mysql_cnf:
            return public.returnMsg(False, '数据库配置文件不存在，请检查mysql是否安装正确或论坛发帖求助')

        log_bin_status = re.search("\nlog-bin", mysql_cnf)
        is_off_bin_log = re.search("\nskip-log-bin", mysql_cnf)
        bin_log_status = False
        if log_bin_status and not is_off_bin_log:
            bin_log_status = True

        mysql_data_dir = self.GetMySQLInfo(get)['datadir']
        if status is not None:
            bin_log_total_size = 0
            mysql_bin_index = os.path.join(mysql_data_dir, "mysql-bin.index")
            mysql_bin_index_content = public.readFile(mysql_bin_index)
            if mysql_bin_index_content is not False:
                for name in str(mysql_bin_index_content).strip().split("\n"):
                    bin_log_path = os.path.join(mysql_data_dir, os.path.basename(name))
                    if os.path.isfile(bin_log_path):
                        bin_log_total_size += os.path.getsize(bin_log_path)
            return {"status": True, "msg": "ok", "data": {"binlog_status": bin_log_status, "size": bin_log_total_size}}

        if bin_log_status is True:  # 关闭 binlog 日志
            master_slave_conf_1 = "/www/server/panel/plugin/masterslave/data.json"
            master_slave_conf_2 = "/www/server/panel/plugin/mysql_replicate/config.json"
            if os.path.exists(master_slave_conf_1):
                return {"status": False, "msg": "请先卸载【Mysql主从复制】插件后再关闭二进制日志！！", "data": {"binlog_status": bin_log_status}}
            if os.path.exists(master_slave_conf_2):
                return {"status": False, "msg": "请先卸载【Mysql主从复制（重构版）】插件后再关闭二进制日志！！", "data": {"binlog_status": bin_log_status}}
            if log_bin_status:
                mysql_cnf = re.sub(r"\nlog-bin", "\n#log-bin", mysql_cnf)
            mysql_cnf = re.sub(r"\nbinlog_format", "\n#binlog_format", mysql_cnf)
            if not is_off_bin_log:
                if re.search("\n#\s*skip-log-bin", mysql_cnf):
                    mysql_cnf = re.sub("\n#\s*skip-log-bin", "\nskip-log-bin", mysql_cnf)
                else:
                    mysql_cnf = re.sub("\n#\s*log-bin", "\nskip-log-bin\n#log-bin", mysql_cnf)
            # public.ExecShell("rm -f {}/mysql-bin.*".format(mysql_data_dir))
        else:  # 开启 binlog 日志
            if re.search("\n#\s*log-bin", mysql_cnf):
                mysql_cnf = re.sub("\n#\s*log-bin", "\nlog-bin", mysql_cnf)
            else:
                mysql_cnf = re.sub("[mysqld]", "[mysqld]\nlog-bin=mysql-bin", mysql_cnf)

            if re.search("\n#\s*binlog_format", mysql_cnf):
                mysql_cnf = re.sub(r"\n#\s*binlog_format", "\nbinlog_format", mysql_cnf)
            else:
                mysql_cnf = re.sub("[mysqld]", "[mysqld]\nbinlog_format=mixed", mysql_cnf)

            if is_off_bin_log:
                mysql_cnf = re.sub("\nskip-log-bin", "\n#skip-log-bin", mysql_cnf)

        public.writeFile(self._MYSQL_CNF, mysql_cnf)
        public.ExecShell('sync')
        public.ExecShell('/etc/init.d/mysqld restart')
        return {"status": True, "msg": "{}二进制日志成功！".format("开启" if not bin_log_status else "关闭"), "data": {"binlog_status": not bin_log_status}}

    # 获取MySQL配置状态
    def GetDbStatus(self, get):
        result = {}
        data = self.map_to_list(panelMysql.panelMysql().query('show variables'))
        gets = ['bt_mysql_set', 'bt_mem_size', 'bt_query_cache_size', 'table_open_cache', 'thread_cache_size',
                'query_cache_type', 'key_buffer_size', 'query_cache_size', 'tmp_table_size', 'max_heap_table_size',
                'innodb_buffer_pool_size', 'innodb_additional_mem_pool_size', 'innodb_log_buffer_size',
                'max_connections', 'sort_buffer_size', 'read_buffer_size', 'read_rnd_buffer_size', 'join_buffer_size',
                'thread_stack', 'binlog_cache_size']
        result['mem'] = {}
        mycnf = public.readFile('/etc/my.cnf')
        if not mycnf:
            return public.returnMsg(False, '数据库配置文件不存在，请检查mysql是否安装正确或论坛发帖求助')
        for g in gets:
            reg = g + r"\s+=\s+\d+(\.\d+)?"
            if re.search(reg, mycnf):
                value = re.search(reg, mycnf).group()
                if re.search(r"\d+(\.\d+)+", value):
                    value = re.search(r"\d+(\.\d+)?", value).group()
                    value = value
                elif re.search(r"\d+", value):
                    value = re.search(r"\d+", value).group()
                    value = int(value)
                result['mem'][g] = value
            else:
                for d in data:
                    if d[0] == g: result['mem'][g] = d[1]
                if 'query_cache_type' in result['mem']:
                    if result['mem']['query_cache_type'] != 'ON': result['mem']['query_cache_size'] = '0'
        return result

    # 设置MySQL配置参数
    def SetDbConf(self, get):
        gets = ['key_buffer_size', 'query_cache_size', 'tmp_table_size', 'max_heap_table_size',
                'innodb_buffer_pool_size', 'innodb_log_buffer_size', 'max_connections', 'query_cache_type',
                'table_open_cache', 'thread_cache_size', 'sort_buffer_size', 'read_buffer_size', 'read_rnd_buffer_size',
                'join_buffer_size', 'thread_stack', 'binlog_cache_size']
        emptys = ['max_connections', 'query_cache_type', 'thread_cache_size', 'table_open_cache']
        annotation = {'mysql_set': 'bt_mysql_set', 'memSize': 'bt_mem_size', 'query_cache_size': 'bt_query_cache_size'}
        mycnf = public.readFile('/etc/my.cnf')
        n = 0
        m_version = public.readFile('/www/server/mysql/version.pl')
        if not m_version: m_version = ''

        # 保存选项
        for k, v in annotation.items():
            reg = v + r"\s+=\s+\d+(\.\d+)?"
            if re.search(reg, mycnf):
                bt_mysql_set = "{} = {}".format(v, get[k])
                mycnf = re.sub(v + r"\s+=\s+\d+(\.\d+)?", bt_mysql_set, mycnf, 1)
            else:
                mycnf = mycnf + "\n# {} = {}".format(v, get[k])
        for g in gets:
            if m_version.find('8.') == 0 and g in ['query_cache_type', 'query_cache_size']:
                n += 1
                continue
            s = 'M'
            if n > 5 and not g in ['key_buffer_size', 'query_cache_size', 'tmp_table_size', 'max_heap_table_size',
                                   'innodb_buffer_pool_size', 'innodb_log_buffer_size']: s = 'K'
            if g in emptys: s = ''
            if g in ['innodb_log_buffer_size']:
                s = 'M'
                if int(get[g]) < 8:
                    return public.returnMsg(False, 'innodb_log_buffer_size不能小于8MB')

            rep = r'\s*' + g + r'\s*=\s*\d+(M|K|k|m|G)?\n'

            c = g + ' = ' + get[g] + s + '\n'
            if mycnf.find(g) != -1:
                mycnf = re.sub(rep, '\n' + c, mycnf, 1)
            else:
                mycnf = mycnf.replace('[mysqld]\n', '[mysqld]\n' + c)
            n += 1
        public.writeFile('/etc/my.cnf', mycnf)
        return public.returnMsg(True, 'SET_SUCCESS')

    # 获取MySQL运行状态
    def GetRunStatus(self, get):
        import time
        result = {}
        data = panelMysql.panelMysql().query('show global status')
        gets = ['Max_used_connections', 'Com_commit', 'Com_rollback', 'Questions', 'Innodb_buffer_pool_reads',
                'Innodb_buffer_pool_read_requests', 'Key_reads', 'Key_read_requests', 'Key_writes',
                'Key_write_requests', 'Qcache_hits', 'Qcache_inserts', 'Bytes_received', 'Bytes_sent',
                'Aborted_clients', 'Aborted_connects', 'Created_tmp_disk_tables', 'Created_tmp_tables',
                'Innodb_buffer_pool_pages_dirty', 'Opened_files', 'Open_tables', 'Opened_tables', 'Select_full_join',
                'Select_range_check', 'Sort_merge_passes', 'Table_locks_waited', 'Threads_cached', 'Threads_connected',
                'Threads_created', 'Threads_running', 'Connections', 'Uptime']
        try:
            if data[0] == 1045:
                return public.returnMsg(False, 'MySQL密码错误!')

            for d in data:
                for g in gets:
                    try:
                        if d[0] == g: result[g] = d[1]
                    except:
                        pass
        except:
            return public.returnMsg(False, str(data))

        if not 'Run' in result and result:
            result['Run'] = int(time.time()) - int(result['Uptime'])
        tmp = panelMysql.panelMysql().query('show master status')
        try:

            result['File'] = tmp[0][0]
            result['Position'] = tmp[0][1]
        except:
            result['File'] = 'OFF'
            result['Position'] = 'OFF'
        return result

    # 取慢日志
    def GetSlowLogs(self, get):
        path = self.GetMySQLInfo(get)['datadir'] + '/mysql-slow.log'
        if not os.path.exists(path): return public.returnMsg(False, '日志文件不存在!')
        return public.returnMsg(True, public.xsssec(public.GetNumLines(path, 100)))

    # 获取binlog文件列表
    def GetMySQLBinlogs(self, get):
        data_dir = self.GetMySQLInfo(get)["datadir"]
        index_file = os.path.join(data_dir, "mysql-bin.index")
        if not os.path.exists(index_file): return public.returnMsg(False, '未开启binlog或者日志文件不存在!')

        text = public.readFile(index_file)

        rows = panelMysql.panelMysql().query("show master status")

        current_log = ""
        if not isinstance(rows, list):
            return public.returnMsg(False, "Mysql 数据库状态异常！")
        if len(rows) != 0:
            current_log = rows[0][0]

        bin_log = []
        for item in text.split('\n'):
            log_file = item.strip()
            log_name = log_file.lstrip("./")
            if not log_file: continue  # 空行
            bin_log_path = os.path.join(data_dir, log_name)
            if not os.path.isfile(bin_log_path): continue
            st = os.stat(bin_log_path)
            bin_log.append({
                "name": log_name,
                "path": bin_log_path,
                "size": st.st_size,
                "last_modified": int(st.st_mtime),
                "last_access": int(st.st_atime),
                "current": current_log == log_name
            })
        return {"status": True, "msg": "ok", "data": bin_log}

    def ClearMySQLBinlog(self, get):
        if not hasattr(get, "days"):
            return public.returnMsg(False, "缺少参数！days")
        if not str(get.days).isdigit():
            return public.returnMsg(False, "参数错误！days")
        days = int(get.days)
        if days < 7: return public.returnMsg(False, '为保证数据安全, 近期的binlog不能删除!')

        rows = panelMysql.panelMysql().query("PURGE BINARY LOGS BEFORE DATE_SUB(NOW(), INTERVAL {days} DAY)".format(days=days))

        return public.returnMsg(True, "清理完成!")

    # 获取当前数据库信息
    def GetInfo(self, get):
        info = self.GetdataInfo(get)
        # return info
        if info:
            return info
        else:
            return public.returnMsg(False, "获取数据库信息失败！请检查远程数据库配置信息")

    # 修复表信息
    def ReTable(self, get):
        info = self.RepairTable(get)
        if info:
            return public.returnMsg(True, "修复完成!")
        else:
            return public.returnMsg(False, "修复失败!")

    # 优化表
    def OpTable(self, get):
        info = self.OptimizeTable(get)
        if info:
            return public.returnMsg(True, "优化成功!")
        else:
            return public.returnMsg(False, "优化失败或者已经优化过了")

    # 更改表引擎
    def AlTable(self, get):
        info = self.AlterTable(get)
        if info:
            return public.returnMsg(True, "更改成功")
        else:
            return public.returnMsg(False, "影响行为0，可能是个空表或指定表不支持")

    def get_average_num(self, slist):
        """
        @获取平均值
        """
        count = len(slist)
        limit_size = 1 * 1024 * 1024
        if count <= 0: return limit_size

        if len(slist) > 1:
            slist = sorted(slist)
            limit_size = int((slist[0] + slist[-1]) / 2 * 0.85)
        return limit_size

    def get_database_size(self, ids, is_pid=False):
        """
        获取数据库大小
        """
        result = {}
        for id in ids:
            if not is_pid:
                x = public.M('databases').where("id=? AND LOWER(type)=LOWER('mysql')", id).field('id,sid,pid,name,type,ps,addtime').find()
            else:
                x = public.M('databases').where("pid=? AND LOWER(type)=LOWER('mysql')", id).field('id,sid,pid,name,ps,type,addtime').find()
            if not x: continue
            x['backup_count'] = public.M('backup').where("pid=? AND type=?", (x['id'], '1')).count()
            if (x['type']).lower() == 'mysql':
                x['total'] = int(public.get_database_size_by_id(x['id']))
            else:
                try:
                    from panelDatabaseController import DatabaseController
                    project_obj = DatabaseController()

                    get = public.dict_obj()
                    get['data'] = {'db_id': x['id']}
                    get['mod_name'] = x['type'].lower()
                    get['def_name'] = 'get_database_size_by_id'

                    x['total'] = project_obj.model(get)
                except:
                    x['total'] = int(public.get_database_size_by_id(x['id']))
            result[x['name']] = x
        return result
    def get_database_table(self, get):
        if not hasattr(get, "sid"):
            return public.returnMsg(False, "缺少参数！sid")
        if not hasattr(get, "name"):
            return public.returnMsg(False, "缺少参数！name")
        
        db_name=get.name
        if not db_name: return public.returnMsg(False, "数据库名不能为空")
        
        mysql_obj = public.get_mysql_obj_by_sid(get.sid)
        if not mysql_obj: return public.returnMsg(False,'数据库连接失败')
        tables={}
        try:
            tables = mysql_obj.query("SHOW TABLES FROM {};".format(db_name))
        except:
            return tables
        return tables

    def check_del_data(self, get):
        """
        @删除数据库前置检测
        """
        ids = json.loads(get.ids)
        slist = {};
        result = [];
        db_list_size = []
        db_data = self.get_database_size(ids)
        for key in db_data:
            data = db_data[key]
            if not data['id'] in ids: continue

            db_addtime = public.to_date(times=data['addtime'])
            data['score'] = int(time.time() - db_addtime) + data['total']
            data['st_time'] = db_addtime

            if data['total'] > 0: db_list_size.append(data['total'])
            result.append(data)

        slist['data'] = sorted(result, key=lambda x: x['score'], reverse=True)
        slist['db_size'] = self.get_average_num(db_list_size)
        return slist

    # 获取所有数据库
    def GetBackupDatabase(self, get):
        if not hasattr(get, "sid"):
            return public.returnMsg(False, "缺少参数！sid")
        if not str(get.sid).isdigit():
            return public.returnMsg(False, "参数错误！sid")
        sid = int(get.sid)
        if sid != 0:
            conn_config = public.M("database_servers").where("id=? AND LOWER(db_type)=LOWER('mysql')", (sid,)).find()
            if not conn_config:
                return public.returnMsg(False, "远程数据库信息不存在！")
            conn_config["db_name"] = None
            db_user = conn_config["db_user"]
            db_password = conn_config["db_password"]
            db_host = conn_config["db_host"]
            db_port = conn_config["db_port"]
        else:
            db_user = "root"
            db_password = public.M("config").where("id=?", (1,)).getField("mysql_root")
            db_host = "localhost"
            try:
                db_port = int(panelMysql.panelMysql().query("show global variables like 'port'")[0][1])
            except:
                db_port = 3306
        mysql_obj = db_mysql.panelMysql()
        flag = mysql_obj.set_host(db_host, db_port, None, db_user, db_password)
        if flag is False:
            return public.returnMsg(False, self.GetMySQLError(mysql_obj._ex))

        db_list = public.M("databases").field("id,name,sid").where("sid=? AND LOWER(type)=LOWER('mysql')", (sid)).select()
        for db_info in db_list:
            db_name = db_info["name"]

            table_list = self.map_to_list(mysql_obj.query("show tables from `{db_name}`".format(db_name=db_name)))
            db_info["table_num"] = 0
            db_size = 0
            for tb_info in table_list:
                db_info["table_num"] += 1
                table = self.map_to_list(mysql_obj.query("show table status from `%s` where name = '%s'" % (db_name, tb_info[0])))
                if not table: continue
                table_6 = table[0][6]
                table_7 = table[0][7]
                if table_6 is None:
                    table_6 = 0
                if table_7 is None:
                    table_7 = 0
                db_size += int(table_6) + int(table_7)
            db_info["size"] = self.ToSize(db_size)
        return {"status": True, "msg": "ok", "data": db_list}

    # 获取所有数据库备份
    def GetAllBackup(self, get):
        p = getattr(get, "p", 1)
        limit = getattr(get, "limit", 10)
        return_js = getattr(get, "return_js", "")
        search = getattr(get, "search", None)

        if not str(p).isdigit():
            return public.returnMsg(False, "参数错误！p")
        if not str(limit).isdigit():
            return public.returnMsg(False, "参数错误！limit")

        p = int(p)
        limit = int(limit)

        ext_list = ["sql", "tar.gz", "gz", "zip"]

        backup_list = []

        # 递归获取备份文件
        def get_dir_backup(backup_dir: str, backup_list: list, is_recursion: bool):
            for name in os.listdir(backup_dir):
                path = os.path.join(backup_dir, name)
                if os.path.isfile(path) and (name.endswith(".zip") or name.endswith(".tar.gz")):
                    ext = name.split(".")[-1]
                    if ext.lower() not in ext_list: continue
                    if search is not None and search not in name: continue

                    stat_file = os.stat(path)
                    path_data = {
                        "name": name,
                        "path": path,
                        "size": stat_file.st_size,
                        "mtime": int(stat_file.st_mtime),
                        "ctime": int(stat_file.st_ctime),
                    }
                    backup_list.append(path_data)
                elif os.path.isdir(path) and is_recursion is True:
                    get_dir_backup(path, backup_list, is_recursion)

        get_dir_backup(self._MYSQL_ALL_BACKUP_DIR, backup_list, False)

        try:
            from flask import request
            uri = public.url_encode(request.full_path)
        except:
            uri = ''
        # 包含分页类
        import page
        # 实例化分页类
        page = page.Page()
        info = {
            "p": p,
            "count": len(backup_list),
            "row": limit,
            "return_js": return_js,
            "uri": uri,
        }
        page_info = page.GetPage(info)

        start_idx = (int(p) - 1) * limit
        end_idx = p * limit if p * limit < len(backup_list) else len(backup_list)
        backup_list.sort(key=lambda data: data["mtime"], reverse=True)
        backup_list = backup_list[start_idx:end_idx]
        return {"status": True, "msg": "OK", "data": backup_list, "page": page_info}

    # 获取备份信息
    def GetBackupInfo(self, get):
        if not hasattr(get, "file"):
            return public.returnMsg(False, "缺少参数！file")

        file = get.file
        if not os.path.exists(file):
            return public.returnMsg(False, "备份文件不存在！")

        _, ext = os.path.splitext(file)
        if ext not in [".zip", ".tar.gz"]:
            return public.returnMsg(False, "当前仅支持预览 .zip、tar.gz 格式文件")

        zip_file_info = []
        if ext == ".zip":
            import zipfile
            try:
                zip_file = zipfile.ZipFile(file)
            except:
                return public.returnMsg(False, '不是有效的 zip 压缩包文件')

            for item in zip_file.infolist():
                if item.is_dir(): continue

                filename = item.filename
                try:
                    filename = item.filename.encode('cp437').decode('gbk')
                except:
                    pass
                if not str(filename).endswith(".sql"): continue
                file_name = os.path.basename(filename)
                db_name, ext = os.path.splitext(file_name)
                if ext != ".sql": continue
                file_info = {
                    "name": db_name,
                    "size": item.file_size,
                    "mtime": datetime.datetime(*item.date_time).strftime("%Y-%m-%d %H:%M:%S"),
                }
                zip_file_info.append(file_info)
            zip_file.close()
        elif ext == ".tar.gz":
            import tarfile
            if not tarfile.is_tarfile(file):
                return public.returnMsg(False, '不是有效的tar.gz压缩包文件')
            zip_file = tarfile.open(file)
            for item in zip_file.getmembers():
                if item.isdir(): continue

                filename = item.name
                try:
                    filename = item.name.encode('cp437').decode('gbk')
                except:
                    pass

                if not str(filename).endswith(".sql"): continue
                file_name = os.path.basename(filename)
                db_name, ext = os.path.splitext(file_name)
                if ext != ".sql": continue
                file_info = {
                    "name": db_name,
                    "size": item.size,
                    "mtime": datetime.datetime.fromtimestamp(item.mtime).strftime("%Y-%m-%d %H:%M:%S"),
                }
                zip_file_info.append(file_info)
            zip_file.close()
        return {"status": True, "msg": "ok", "data": zip_file_info}

    # 备份数据库
    def ToBackupAll(self, get):
        """
        备份数据库
        csv /www/server/mysql/bin/mysql -uroot -padmin test5 -e "select * from test1;" --default-character-set=gbk | sed 's/\t/","/g;s/^/"/;s/$/"/;s/\n//g' > /www/backup/database/mysql/test.csv
        """
        if not os.path.exists(self._MYSQLDUMP_BIN):
            return public.returnMsg(False, "缺少备份工具，请先通过软件管理安装MySQL!")

        if not hasattr(get, "sid"):
            return public.returnMsg(False, "缺少参数！sid")
        if not hasattr(get, "db_list"):
            return public.returnMsg(False, "缺少参数！db_list")
        if not str(get.sid).isdigit():
            return public.returnMsg(False, "参数错误！sid")

        try:
            db_list = json.loads(get.db_list)
        except:
            return public.returnMsg(False, "参数错误！db_list")

        sid = int(get.sid)
        if sid != 0:
            conn_config = public.M("database_servers").where("id=? AND LOWER(db_type)=LOWER('mysql')", (sid,)).find()
            if not conn_config:
                return public.returnMsg(False, "远程数据库信息不存在！")
            conn_config["db_name"] = None
            db_user = conn_config["db_user"]
            db_password = conn_config["db_password"]
            db_host = conn_config["db_host"]
            db_port = conn_config["db_port"]
        else:
            db_user = "root"
            db_password = public.M("config").where("id=?", (1,)).getField("mysql_root")
            db_host = "localhost"
            try:
                db_port = int(panelMysql.panelMysql().query("show global variables like 'port'")[0][1])
            except:
                db_port = 3306
        mysql_obj = db_mysql.panelMysql()
        flag = mysql_obj.set_host(db_host, db_port, None, db_user, db_password)
        if flag is False:
            return public.returnMsg(False, self.GetMySQLError(mysql_obj._ex))

        addTime = time.localtime()
        file_name = "{db_host}_{backup_time}_mysql_data".format(db_host=db_host, backup_time=time.strftime("%Y-%m-%d_%H-%M-%S", addTime))
        export_dir = os.path.join(self._MYSQL_ALL_BACKUP_DIR, file_name)
        if not os.path.exists(export_dir):
            os.makedirs(export_dir)

        for db_name in db_list:
            db_file_name = "{db_name}.sql".format(db_name=db_name)
            db_backup_path = os.path.join(export_dir, db_file_name)

            # 添加创建数据库语句
            db_charset, db_collate = self.__get_character_collate(db_name)
            create_database_sql = """
CREATE DATABASE IF NOT EXISTS \`{db_name}\`
    DEFAULT CHARACTER SET {db_charset}
    COLLATE {db_collate};

USE \`{db_name}\`;
    """.format(db_name=db_name, db_charset=db_charset, db_collate=db_collate)
            create_database_shell = """echo "{create_database_sql}" > '{backup_path}'""".format(create_database_sql=create_database_sql, backup_path=db_backup_path)
            public.ExecShell(create_database_shell)

            set_gtid_purged = ""
            resp = public.ExecShell("{} --help | grep set-gtid-purged".format(self._MYSQLDUMP_BIN))[0]
            if resp.find("--set-gtid-purged") != -1:
                set_gtid_purged = "--set-gtid-purged=OFF"

            shell = "'{mysqldump_bin}' {set_gtid_purged} --opt --skip-lock-tables --single-transaction --routines --events --skip-triggers --default-character-set='{db_charset}' --force " \
                    "--add-drop-database --host='{db_host}' --port={db_port} --user='{db_user}' --password='{db_password}' '{db_name}' >> '{backup_path}'".format(
                mysqldump_bin=self._MYSQLDUMP_BIN,
                set_gtid_purged=set_gtid_purged,
                db_charset=db_charset,
                db_host=db_host,
                db_port=db_port,
                db_user=db_user,
                db_password=db_password,
                db_name=db_name,
                backup_path=db_backup_path
            )

            public.ExecShell(shell, env={"MYSQL_PWD": db_password})
            if not os.path.exists(db_backup_path):
                public.ExecShell("rm -rf {}".format(export_dir))
                return public.returnMsg(False, "数据库备份失败，导出文件不存在！")

        backup_path = "{export_dir}.zip".format(export_dir=export_dir)
        public.ExecShell("cd '{backup_dir}' && zip -m '{backup_path}' -r '{file_name}'".format(backup_dir=self._MYSQL_ALL_BACKUP_DIR, backup_path=backup_path, file_name=file_name))
        if not os.path.exists(backup_path):
            public.ExecShell("rm -rf {}".format(export_dir))
            return public.returnMsg(False, "数据库备份失败，压缩文件不存在！")
        public.WriteLog("TYPE_DATABASE", "DATABASE_BACKUP_SUCCESS", ("全部数据库",))
        return public.returnMsg(True, "BACKUP_SUCCESS")

    # 导入
    def InputSqlAll(self, get):
        if not os.path.exists(self._MYSQL_BIN):
            return public.returnMsg(False, "缺少备份工具，请先通过软件管理安装MySQL!")

        if not hasattr(get, "file"):
            return public.returnMsg(False, "缺少参数！file")

        file = get.file
        if not os.path.exists(file): return public.returnMsg(False, "导入路径不存在!")
        if not os.path.isfile(file): return public.returnMsg(False, "仅支持导入压缩文件!")

        password = public.M("config").where("id=?", (1,)).getField("mysql_root")

        file_name = os.path.basename(file)
        _, file_ext = os.path.splitext(file_name)
        if file_ext not in [".tar.gz", ".zip"]:
            return public.returnMsg(False, "请选择 tar.gz、zip文件格式!")

        db_list = []
        if file_ext == ".zip":
            import zipfile
            try:
                zip_file = zipfile.ZipFile(file)
            except:
                return public.returnMsg(False, '不是有效的 zip 压缩包文件')

            for item in zip_file.infolist():
                if item.is_dir(): continue
                filename = item.filename
                try:
                    filename = item.filename.encode('cp437').decode('gbk')
                except:
                    pass
                if not str(filename).endswith(".sql"): continue
                name = os.path.basename(filename)
                db_name, _ = os.path.splitext(name)
                db_list.append(db_name)
            zip_file.close()
        elif file_ext == ".tar.gz":
            import tarfile
            if not tarfile.is_tarfile(file):
                return public.returnMsg(False, '不是有效的tar.gz压缩包文件')
            zip_file = tarfile.open(file)
            for item in zip_file.getmembers():
                if item.isdir(): continue

                filename = item.name
                try:
                    filename = item.name.encode('cp437').decode('gbk')
                except:
                    pass

                if not str(filename).endswith(".sql"): continue
                name = os.path.basename(filename)
                db_name, _ = os.path.splitext(name)
                db_list.append(db_name)
            zip_file.close()

        # 前置检测
        # 获取所有服务器连接配置
        conn_config_dict = {}
        for db_name in db_list:
            if public.M("databases").where("name=? AND LOWER(type)=LOWER('mysql')", (db_name,)).count() == 0:  # 添加数据库信息
                address = "127.0.0.1"
                self.__CreateUsers(0, db_name, db_name, password, address)
                addTime = time.strftime('%Y-%m-%d %X', time.localtime())
                public.M("databases").add('pid,sid,db_type,name,username,password,accept,ps,addtime', (0, 0, 0, db_name, db_name, password, address, db_name, addTime))

            if conn_config_dict.get(db_name) is not None:  # 已经获取连接对象
                continue

            flag, conn_config = self.__get_db_name_config(db_name)
            if flag is False:
                return conn_config
            if conn_config_dict.get(db_name) is None:
                mysql_obj = db_mysql.panelMysql()
                flag = mysql_obj.set_host(conn_config["db_host"], conn_config["db_port"], None, conn_config["db_user"], conn_config["db_password"])
                if flag is False:
                    return public.returnMsg(False, self.GetMySQLError(mysql_obj._ex))
                conn_config_dict[db_name] = conn_config

        # 解压
        input_dir = os.path.join(self._MYSQL_ALL_BACKUP_DIR, "input_tmp_{}".format(int(time.time() * 1000_000)))

        is_zip = False
        if file_ext == ".zip":
            if not os.path.isdir(input_dir): os.makedirs(input_dir)
            public.ExecShell("unzip -o '{file}' -d '{input_dir}'".format(file=file, input_dir=input_dir))
            is_zip = True
        elif file_ext == ".tar.gz":
            if not os.path.isdir(input_dir): os.makedirs(input_dir)
            public.ExecShell("tar zxf '{file}' -C '{input_dir}'".format(file=file, input_dir=input_dir))
            is_zip = True

        input_path_list = []
        if is_zip is True:  # 遍历临时目录
            def get_input_path(input_dir: str, input_path_list: list):
                for file_name in os.listdir(input_dir):
                    path = os.path.join(input_dir, file_name)
                    if os.path.isfile(path) and path.endswith(".sql"):
                        input_path_list.append(path)
                    elif os.path.isdir(path):
                        get_input_path(path, input_path_list)

            get_input_path(input_dir, input_path_list)
        else:
            input_path_list.append(file)

        for path in input_path_list:
            name = os.path.basename(path)
            db_name, _ = os.path.splitext(name)
            conn_config = conn_config_dict.get(db_name)

            shell = "'{mysql_bin}' --force --host='{db_host}' --port={db_port} --user='{db_user}' --password='{password}'".format(
                mysql_bin=self._MYSQL_BIN,
                db_host=conn_config["db_host"],
                db_port=conn_config["db_port"],
                db_user=conn_config["db_user"],
                password=conn_config["db_password"],
            )

            public.ExecShell("{shell} < '{path}'".format(shell=shell, path=path), env={"MYSQL_PWD": password})

        # 清理导入临时目录
        if is_zip is True:
            public.ExecShell("rm -rf '{input_dir}'".format(input_dir=input_dir))
        # public.WriteLog("TYPE_DATABASE", "DATABASE_INPUT_SUCCESS", (db_name,))
        return public.returnMsg(True, "DATABASE_INPUT_SUCCESS")
        # except Exception as ex:
        # public.WriteLog("TYPE_DATABASE", "DATABASE_INPUT_ERR",(name,str(ex)))
        # return public.returnMsg(False,"DATABASE_INPUT_ERR")

    def __get_db_name_config(self, db_name: str) -> Tuple[bool, dict]:
        db_find = public.M("databases").where("name=? AND LOWER(type)=LOWER('mysql')", (db_name,)).find()

        if db_find["db_type"] == 0:  # 本地数据库
            result = panelMysql.panelMysql().execute("show databases")
            isError = self.IsSqlError(result)
            if isError: return False, isError
            db_password = public.M("config").where("id=?", (1,)).getField("mysql_root")
            if not db_password:
                return public.returnMsg(False, "数据库密码为空！请先设置数据库密码！")
            try:
                db_port = int(panelMysql.panelMysql().query("show global variables like 'port'")[0][1])
            except:
                db_port = 3306
            if not db_password:
                return False, public.returnMsg(False, "{} 数据库密码不能为空".format(db_find["name"]))
            conn_config = {
                "db_host": "localhost",
                "db_port": db_port,
                "db_user": db_find["username"],
                "db_password": db_find["password"],
            }
        elif db_find["db_type"] == 1:
            # 远程数据库
            conn_config = json.loads(db_find["conn_config"])
            res = self.CheckCloudDatabase(conn_config)
            if isinstance(res, dict): return False, res
            conn_config["db_port"] = int(conn_config["db_port"])
        elif db_find["db_type"] == 2:
            conn_config = public.M("database_servers").where("id=? AND LOWER(db_type)=LOWER('mysql')", db_find["sid"]).find()
            res = self.CheckCloudDatabase(conn_config)
            if isinstance(res, dict): return False, res
            conn_config["db_name"] = None
            conn_config["db_port"] = int(conn_config["db_port"])
        else:
            return False, public.returnMsg(False, "{} 未知的数据库类型".format(db_find["name"]))
        return True, conn_config

    # 获取数据库 字符集,排序规则
    @classmethod
    def __get_character_collate(cls, db_name: str) -> Tuple[str, str]:
        db_obj = public.get_mysql_obj(db_name)
        tmp = db_obj.query("SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE schema_name = '{db_name}'".format(db_name=db_name))
        import pymysql
        if isinstance(tmp, pymysql.err.OperationalError) or not tmp:
            return 'utf8mb4', 'utf8mb4_general_ci'
        return tmp[0]

    # 获取数据库表
    def GetDatabasesList(self, get):
        if not hasattr(get, "sid"):
            return public.returnMsg(False, "缺少参数！sid")
        if not str(get.sid).isdigit():
            return public.returnMsg(False, "参数错误！sid")

        mysql_obj = public.get_mysql_obj_by_sid(get.sid)
        if not mysql_obj: return public.returnMsg(False, '数据库连接失败')
        data_list = mysql_obj.query("select schema_name from information_schema.schemata where schema_name not in ('sys', 'mysql', 'information_schema', 'performance_schema');")
        isError = self.IsSqlError(data_list)
        if isError != None:
            return isError
        if not isinstance(data_list, list):
            return public.returnMsg(False, "查询数据库失败！{}".format(data_list))

        db_list = [{"name": "全局权限", "value": "*", "tb_list": []}]
        for data in data_list:
            db_name = data[0]
            info = {
                "name": db_name,
                "value": db_name,
                "tb_list": [{"name": "所有", "value": "*"}],
            }

            table_list = mysql_obj.query("show tables from `{db_name}`;".format(db_name=db_name))
            if not isinstance(table_list, list):
                continue
            info["tb_list"].extend([{"name": data[0], "value": data[0]} for data in table_list])

            db_list.append(info)

        return {"status": True, "msg": "ok", "data": db_list}

    # 获取所有用户
    def GetMysqlUser(self, get):
        if not hasattr(get, "sid"):
            return public.returnMsg(False, "缺少参数！sid")
        if not str(get.sid).isdigit():
            return public.returnMsg(False, "参数错误！sid")

        search = getattr(get, "search", None)

        mysql_obj = public.get_mysql_obj_by_sid(get.sid)
        if isinstance(mysql_obj, bool):
            return public.returnMsg(False, "数据库连接错误！")

        if search is not None:
            user_data = mysql_obj.query("SELECT user FROM mysql.user WHERE user not in ('mysql.sys', 'mysql.session', 'mysql.infoschema', '') and user like '%{}%' GROUP BY user;".format(search))
        else:
            user_data = mysql_obj.query("SELECT user FROM mysql.user WHERE user not in ('mysql.sys', 'mysql.session', 'mysql.infoschema', '') GROUP BY user;")
        if not isinstance(user_data, list):
            return public.returnMsg(False, "数据库连接失败")

        # 获取告警信息
        try:
            push_dict = json.loads(public.readFile(os.path.join(public.get_panel_path(),"class/push/push.json")))
            database_push = push_dict.get("database_push", {})
            if not isinstance(database_push, dict):
                database_push = {}
        except:
            database_push = {}

        is_password_last_changed = False
        try:
            data_list = mysql_obj.query("SELECT count(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = 'mysql' AND TABLE_NAME = 'user' AND COLUMN_NAME = 'password_last_changed';")
            if data_list == [[1]]:
               is_password_last_changed = True
        except:
            pass

        user_list = []
        for user_item in user_data:
            user = user_item[0]

            if is_password_last_changed is True:
                host_data = mysql_obj.query("SELECT host, authentication_string, password_last_changed FROM mysql.user WHERE user='{}';".format(user))
            else:
                host_data = mysql_obj.query("SELECT host, authentication_string, null FROM mysql.user WHERE user='{}';".format(user))
            if not isinstance(host_data, list):
                continue

            host_list = []
            for host_item in host_data:

                access_data = mysql_obj.query("SHOW GRANTS FOR `{}`@`{}`;".format(user, host_item[0]))
                if not isinstance(access_data, list):
                    continue

                info = {
                    "host": host_item[0],
                    "password": "有" if host_item[1] else "无",
                    "password_last_changed": host_item[2].strftime("%Y-%m-%d %H:%M:%S") if host_item[2] else host_item[2],
                    "access_list": [],
                    "password_expire_push": {
                        "time": int(time.time()),
                        "tid": "database_push@0",
                        "type": "mysql_pwd_endtime",
                        "title": "MySQL数据库密码到期",
                        "status": False,
                        "count": 0,
                        "project": [int(get.sid), user, host_item[0]],
                        "cycle": 15,
                        "push_count": 1,
                        "interval": 600,
                        "module": "",
                        "module_type" : "database_push"
                    },
                }

                for access_item in access_data:
                    re_obj = re.search("GRANT\s*([^.]+)\s*ON\s*([^.]+)\.([^.]+)\s*TO", access_item[0], flags=re.IGNORECASE)
                    if re_obj:
                        access_str = re_obj.group(1)
                        database = re_obj.group(2).strip("`'\" ")
                        table = re_obj.group(3).strip("`'\" ")

                        access_list = []
                        for access in access_str.split(","):
                            access = access.strip()
                            access_temp = {
                                "title": self._MYSQL_ACCESS_MSG.get(access.upper()),
                                "access": access,
                            }
                            access_list.append(access_temp)

                        access_info = {
                            "database": database,
                            "table": table,
                            "access": access_list,
                        }
                        info["access_list"].append(access_info)

                # 获取告警信息
                for key, push_info in database_push.items():
                    if push_info.get("project") == [int(get.sid), user, info["host"]]:
                        push_info["time"] = key
                        info["password_expire_push"].update(push_info)

                host_list.append(info)


            user_info = {
                "user": user,
                "list": host_list,
            }
            user_list.append(user_info)
        return {"status": True, "msg": "ok", "data": user_list, "is_password_last_changed": is_password_last_changed}

    # 添加用户
    def AddMysqlUser(self, get):
        if not hasattr(get, "sid"):
            return public.returnMsg(False, "缺少参数！sid")
        if not hasattr(get, "username"):
            return public.returnMsg(False, "缺少参数！username")
        if not hasattr(get, "password"):
            return public.returnMsg(False, "缺少参数！password")
        if not hasattr(get, "host"):
            return public.returnMsg(False, "缺少参数！host")
        if not str(get.sid).isdigit():
            return public.returnMsg(False, "参数错误！sid")

        username = get.username
        password = get.password
        host = get.host

        if not username: return public.returnMsg(False, '用户名不能为空')
        if not password: return public.returnMsg(False, '密码不能为空')
        if not host: return public.returnMsg(False, '主机名不能为空')

        re_list = re.findall("[，。？！；：“”‘’（）【】《》￥&\u4e00-\u9fa5]+", password)
        if re_list: return public.returnMsg(False, f'数据库密码不能包含中文字符 {" ".join(re_list)}')
        if password.find("'") != -1 or password.find('"') != -1: return public.returnMsg(False, "数据库密码不能包含引号")

        if host != "localhost" and host != "%":
            if public.check_ip(host) == False:
                return public.returnMsg(False, '请填写正确的ip格式')

        mysql_obj = public.get_mysql_obj_by_sid(get.sid)
        if not mysql_obj: return public.returnMsg(False, '连接数据库失败')

        data_list = mysql_obj.query("SELECT count(user) FROM mysql.user WHERE user='{}' and host='{}';".format(username, host))
        if data_list == [[1]]:
            return public.returnMsg(False, '已存在相同用户名与主机名用户!')
        result = mysql_obj.execute("CREATE USER `{}`@`{}` IDENTIFIED BY '{}';".format(username, host, password))
        isError = self.IsSqlError(result)
        if isError != None:
            return isError
        return public.returnMsg(True, 'ADD_SUCCESS')

    # 删除用户
    def DelMysqlUser(self, get):
        if not hasattr(get, "sid"):
            return public.returnMsg(False, "缺少参数！sid")
        if not hasattr(get, "username"):
            return public.returnMsg(False, "缺少参数！username")
        if not hasattr(get, "host"):
            return public.returnMsg(False, "缺少参数！host")
        if not str(get.sid).isdigit():
            return public.returnMsg(False, "参数错误！sid")

        username = get.username
        host = get.host
        if not username: return public.returnMsg(False, '用户名不能为空')
        if not host: return public.returnMsg(False, '主机名不能为空')

        if username == "root":
            return public.returnMsg(False, 'root账户禁止删除')

        mysql_obj = public.get_mysql_obj_by_sid(get.sid)
        if not mysql_obj: return public.returnMsg(False, '数据库连接失败')
        result = mysql_obj.execute("drop user `{}`@`{}`".format(username, host))
        isError = self.IsSqlError(result)
        if isError != None:
            return isError
        return public.returnMsg(True, 'DEL_SUCCESS')

    # 修改用户密码
    def ChangeUserPass(self, get):
        if not hasattr(get, "sid"):
            return public.returnMsg(False, "缺少参数！sid")
        if not hasattr(get, "username"):
            return public.returnMsg(False, "缺少参数！username")
        if not hasattr(get, "host"):
            return public.returnMsg(False, "缺少参数！host")
        if not hasattr(get, "password"):
            return public.returnMsg(False, "缺少参数！password")
        if not str(get.sid).isdigit():
            return public.returnMsg(False, "参数错误！sid")

        username = get.username
        newpassword = get.password
        host = get.host

        if not newpassword: return public.returnMsg(False, '数据库[%s]密码不能为空' % username)

        re_list = re.findall("[，。？！；：“”‘’（）【】《》￥&\u4e00-\u9fa5]+", newpassword)
        if re_list: return public.returnMsg(False, f'数据库密码不能包含中文字符 {" ".join(re_list)}')

        if newpassword.find("'") != -1 or newpassword.find('"') != -1: return public.returnMsg(False, "数据库密码不能包含引号")
        # 修改MYSQL
        mysql_obj = public.get_mysql_obj_by_sid(get.sid)
        if not mysql_obj: return public.returnMsg(False, '连接指定数据库失败')
        m_version = public.readFile(public.GetConfigValue('setup_path') + '/mysql/version.pl')

        if m_version.find('5.7') != -1 or m_version.find('8.0') != -1:
            # mysql_obj.execute("update mysql.user set authentication_string='' where User='" + username + "'")
            result = mysql_obj.execute("ALTER USER `{}`@`{}` IDENTIFIED BY '{}';".format(username, host, newpassword))
        elif m_version.find('10.5.') != -1 or m_version.find('10.4.') != -1:
            accept = self.map_to_list(mysql_obj.query("select Host from mysql.user where User='{}' AND Host!='localhost'".format(username)))
            result = mysql_obj.execute("ALTER USER `{}`@`localhost` IDENTIFIED BY '{}';".format(username, newpassword))
            for my_host in accept:
                mysql_obj.execute("ALTER USER `{}`@`{}` IDENTIFIED BY '{}';".format(username, my_host[0], newpassword))
        else:
            result = mysql_obj.execute("update mysql.user set Password=password('{}') where User='{}'".format(newpassword, username))

        isError = self.IsSqlError(result)
        if isError != None: return isError

        mysql_obj.execute("flush privileges")
        return public.returnMsg(True, '修改密码成功')

    # 获取用户权限
    def GetUserGrants(self, get):
        if not hasattr(get, "sid"):
            return public.returnMsg(False, "缺少参数！sid")
        if not hasattr(get, "username"):
            return public.returnMsg(False, "缺少参数！username")
        if not hasattr(get, "host"):
            return public.returnMsg(False, "缺少参数！host")
        if not str(get.sid).isdigit():
            return public.returnMsg(False, "参数错误！sid")

        username = get.username
        host = get.host
        mysql_obj = public.get_mysql_obj_by_sid(get.sid)
        if not mysql_obj: return public.returnMsg(False, '数据库连接失败')

        usergrant = mysql_obj.query("SHOW GRANTS FOR `{}`@`{}`;".format(username, host))
        merged_text = "\n".join([item[0] for item in usergrant if item])
        return merged_text

    # 添加用户权限
    def AddUserGrants(self, get):
        if not hasattr(get, "sid"):
            return public.returnMsg(False, "缺少参数！sid")
        if not hasattr(get, "username"):
            return public.returnMsg(False, "缺少参数！username")
        if not hasattr(get, "host"):
            return public.returnMsg(False, "缺少参数！host")
        if not str(get.sid).isdigit():
            return public.returnMsg(False, "参数错误！sid")
        if not hasattr(get, "db_name"):
            return public.returnMsg(False, "缺少参数！db_name")
        if not hasattr(get, "tb_name"):
            return public.returnMsg(False, "缺少参数！tb_name")
        if not hasattr(get, "access"):
            return public.returnMsg(False, "缺少参数！access")
        if not hasattr(get, "with_grant"):
            return public.returnMsg(False, "缺少参数！with_grant")

        username = get.username
        host = get.host
        db_name = get.db_name
        tb_name = get.tb_name
        access = get.access
        with_grant = get.with_grant == "1"  # 是否允许创建用户授权其它用户

        if not username: return public.returnMsg(False, "用户名不能为空")
        if not host: return public.returnMsg(False, "主机名不能为空")
        if not access: return public.returnMsg(False, "权限不能为空")
        if not tb_name: return public.returnMsg(False, "表名称不能为空")

        mysql_obj = public.get_mysql_obj_by_sid(get.sid)
        if not mysql_obj: return public.returnMsg(False, "连接数据库失败")

        user_access = mysql_obj.query("SHOW GRANTS FOR `{}`@`{}`".format(username, host))
        if not isinstance(user_access, list):
            return public.returnMsg(False, "查询用户 `{}`@`{}` 权限失败！".format(username, host))
        user_access = [access[0] for access in user_access]

        if db_name != "*":
            db_name = "`{}`".format(db_name)
        if tb_name != "*":
            tb_name = "`{}`".format(tb_name)

        if with_grant is True:
            grant_sql = "grant {access} on {db_name}.{tb_name} to `{user}`@`{host}` WITH GRANT OPTION;".format(
                access=access,
                db_name=db_name,
                tb_name=tb_name,
                user=username,
                host=host
            )
        else:
            grant_sql = "grant {access} on {db_name}.{tb_name} to `{user}`@`{host}`;".format(
                access=access,
                db_name=db_name,
                tb_name=tb_name,
                user=username,
                host=host
            )
        if grant_sql in user_access:
            return public.returnMsg(False, "已存在相同用户名与主机名用户!")

        result = mysql_obj.execute(grant_sql)
        isError = self.IsSqlError(result)
        if isError != None:
            return isError

        mysql_obj.execute("flush privileges")
        return public.returnMsg(True, "添加授权成功!")

    # 删除用户权限
    def DelUserGrants(self, get):
        if not hasattr(get, "sid"):
            return public.returnMsg(False, "缺少参数！sid")
        if not hasattr(get, "username"):
            return public.returnMsg(False, "缺少参数！username")
        if not hasattr(get, "host"):
            return public.returnMsg(False, "缺少参数！host")
        if not str(get.sid).isdigit():
            return public.returnMsg(False, "参数错误！sid")
        if not hasattr(get, "db_name"):
            return public.returnMsg(False, "缺少参数！db_name")
        if not hasattr(get, "tb_name"):
            return public.returnMsg(False, "缺少参数！tb_name")
        if not hasattr(get, "access"):
            return public.returnMsg(False, "缺少参数！access")
        if not hasattr(get, "with_grant"):
            return public.returnMsg(False, "缺少参数！with_grant")

        username = get.username
        host = get.host
        db_name = get.db_name
        tb_name = get.tb_name
        access = get.access
        with_grant = get.with_grant == "1"  # 是否允许创建用户授权其它用户

        if not username: return public.returnMsg(False, "用户名不能为空")
        if not host: return public.returnMsg(False, "主机名不能为空")
        if not access: return public.returnMsg(False, "权限不能为空")
        if not tb_name: return public.returnMsg(False, "表名称不能为空")

        mysql_obj = public.get_mysql_obj_by_sid(get.sid)
        if not mysql_obj: return public.returnMsg(False, "连接数据库失败")

        if db_name != "*":
            db_name = "`{}`".format(db_name)
        if tb_name != "*":
            tb_name = "`{}`".format(tb_name)

        if with_grant is True:
            grant_sql = "revoke {access} on {db_name}.{tb_name} from `{user}`@`{host}` WITH GRANT OPTION;".format(
                access=access,
                db_name=db_name,
                tb_name=tb_name,
                user=username,
                host=host
            )
        else:
            grant_sql = "revoke {access} on {db_name}.{tb_name} from `{user}`@`{host}`;".format(
                access=access,
                db_name=db_name,
                tb_name=tb_name,
                user=username,
                host=host
            )
        result = mysql_obj.execute(grant_sql)
        isError = self.IsSqlError(result)
        if isError != None:
            return isError

        mysql_obj.execute("flush privileges")
        return public.returnMsg(True, "撤销授权成功!")


    # 数据库告警设置信息获取
    def GetPushUser(self, get):
        sid = getattr(get, "sid", None)
        username = getattr(get, "username", None)

        if sid is None:
            data_list = public.M("database_servers").where("LOWER(db_type)=LOWER('mysql')", ()).select()
            bt_mysql_bin = os.path.join(public.get_setup_path(), "mysql/bin/mysql")

            db_list = []
            if os.path.exists(bt_mysql_bin):
                db_list.append({"title": "本地服务器", "value": 0})

            for data in data_list:
                db_list.append({"title": data["ps"], "value": data["id"]})
            return {"status": True, "msg": "ok", "data": db_list}

        mysql_obj = public.get_mysql_obj_by_sid(sid)
        if not mysql_obj: return public.returnMsg(False, "数据库连接失败")

        if username is None:
            user_data = mysql_obj.query("SELECT user FROM mysql.user WHERE user not in ('mysql.sys', 'mysql.session', 'mysql.infoschema', '') GROUP BY user;")
            if not isinstance(user_data, list):
                return public.returnMsg(False, "数据库连接失败")

            user_list = []
            for user_item in user_data:
                user_list.append({"title": user_item[0], "value": user_item[0]})
            return {"status": True, "msg": "ok", "data": user_list}

        host_list = []
        host_data = mysql_obj.query("SELECT host FROM mysql.user WHERE user='{}';".format(username))
        if not isinstance(host_data, list):
            return public.returnMsg(False, "数据库连接失败")

        for host_item in host_data:
            host_list.append({"title": host_item[0], "value": host_item[0]})
        return {"status": True, "msg": "ok", "data": host_list}

    # 修改表的注释
    def ModifyTableComment(self, get):

        db_name = get.db_name
        table_name = get.table_name
        comment = get.comment
        if not db_name or not table_name: return False
        if not self.DB_MySQL: self.DB_MySQL = public.get_mysql_obj(db_name)
        if not self.DB_MySQL: return self.DB_MySQL

        # 检查表是否存在
        tables = self.map_to_list(self.DB_MySQL.query('show tables from `%s`' % db_name))
        if table_name not in [table[0] for table in tables]:
            return public.returnMsg(False, '指定的表不存在!')

        # 执行 SQL 更新命令以修改表的注释
        try:
            self.DB_MySQL.execute("ALTER TABLE `{}`.`{}` COMMENT = '{}'".format(db_name, table_name, comment))
            return public.returnMsg(True, '表的注释已成功修改!')
        except Exception as e:
            return public.returnMsg(False, '修改表的注释失败: {}'.format(str(e)))
    def export_table_structure(self,get):
        import subprocess
        db_name=get.db_name
        table_name=get.table_name
        filename=get.filename
        db_user = "root"
        db_password = public.M("config").where("id=?", (1,)).getField("mysql_root")
        # 构造 mysqldump 命令
        cmd = "mysqldump -u {} -p{} -d {} {} > {}".format(db_user,db_password,db_name, table_name, filename)
        print(cmd)

        # 使用 subprocess 执行命令
        process = subprocess.Popen(cmd, shell=True)
        process.wait()

        if process.returncode == 0:
            return public.returnMsg(True, "表结构已成功导出到文件: {}".format(filename))

        else:
            return public.returnMsg(False, "导出表结构失败")

    def set_restart_task(self,get):
        import sys
        sys.path.append("..")  # 添加上一级目录到系统路径
        import crontab
        try:
            p = crontab.crontab()
            task_name = '[勿删]MySQL守护进程' 
            status = get.status
            public.M('crontab').where('name=?', (task_name,)).setField('status', status)
            if get.status == "1":
                return public.returnMsg(True, "开启MySQL守护进程成功")
            else:
                return public.returnMsg(True, "关闭MySQL守护进程成功")
        except Exception as e:
            return public.returnMsg(False, "开启MySQL守护进程失败" + str(e))

    def get_restart_task(self,get):
        import sys
        sys.path.append("..")  # 添加上一级目录到系统路径
        import crontab
        try:
            p = crontab.crontab()
            print(898989)
            task_name = '[勿删]MySQL守护进程' 
            if public.M('crontab').where('name=?', (task_name,)).count() == 0:
                task = {
                    "name": task_name,
                    "type": "minute-n",
                    "where1": "5",
                    "hour": "1",
                    "minute": "5",
                    "week": "1",
                    "sType": "toShell",
                    "sName": "",
                    "backupTo": "",
                    "save": "",
                    "sBody": "btpython /www/server/panel/script/restart_database.py ",
                    "urladdress": "",
                    "status": "0",
                    "notice":0,
                }
                p.AddCrontab(task)
                public.M('crontab').where('name=?', (task_name,)).setField('status', 0)
            print(89898)
            crontab_data = public.M('crontab').where('name=?', (task_name,)).select()[0]
            print(crontab_data)
            status = crontab_data['status']
            info = {"status": status}
            return public.returnMsg(True, info)
        except Exception as e:
            return public.returnMsg(False, "获取失败" + str(e))
