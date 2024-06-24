# coding: utf-8
# +-------------------------------------------------------------------
# | 宝塔Linux面板
# +-------------------------------------------------------------------
# | Copyright (c) 2015-2099 宝塔软件(http:#bt.cn) All rights reserved.
# +-------------------------------------------------------------------
# | Author: sww <hwl@bt.cn>
# +-------------------------------------------------------------------

import json
import os
import re
import time
import traceback
import public
import json
from flask import request


try:
    from BTPanel import cache
    import requests
except:
    pass



class crontab:
    field = 'id,name,type,where1,where_hour,where_minute,echo,addtime,status,save,backupTo,sName,sBody,sType,urladdress,save_local,notice,notice_channel,db_type,split_type,split_value,type_id,rname,keyword,post_param,flock,time_set,backup_mode,db_backup_path,time_type,special_time,log_cut_path,user_agent,version,table_list'
    
    def __init__(self):
        try:
            cront = public.M('crontab').order("id desc").field(self.field).select()
        except Exception as e:
            try:
               public.check_database_field("crontab.db", "crontab")
            except Exception as e:
                pass
        
        # cront = public.M('crontab').order("id desc").field(self.field).select()
        # if type(cront) == str:
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'status' INTEGER DEFAULT 1", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'save' INTEGER DEFAULT 3", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'backupTo' TEXT DEFAULT off", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'sName' TEXT", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'sBody' TEXT", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'sType' TEXT", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'urladdress' TEXT", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'save_local' INTEGER DEFAULT 0", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'notice' INTEGER DEFAULT 0", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'notice_channel' TEXT DEFAULT ''", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'db_type' TEXT DEFAULT ''", ())
        #     public.M('crontab').execute("UPDATE 'crontab' SET 'db_type'='mysql' WHERE sType='database' and db_type=''", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'split_type' TEXT DEFAULT ''", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'split_value' INTEGER DEFAULT 0", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'rname' TEXT DEFAULT ''", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'type_id' INTEGER", ())
        #     public.M('crontab').execute("PRAGMA foreign_keys=on", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD CONSTRAINT 'fk_type_id' FOREIGN KEY ('type_id') REFERENCES 'crontab_types' ('id')", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'keyword' TEXT DEFAULT ''", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'post_param' TEXT DEFAULT ''", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'flock' INTEGER DEFAULT 0", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'time_set' TEXT DEFAULT ''", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'backup_mode' TEXT DEFAULT ''", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'db_backup_path' TEXT DEFAULT ''", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'time_type' TEXT DEFAULT ''", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'special_time' TEXT DEFAULT ''", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'log_cut_path' TEXT DEFAULT ''", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'user_agent' TEXT DEFAULT ''", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'version' TEXT DEFAULT ''", ())
        #     public.M('crontab').execute("ALTER TABLE 'crontab' ADD 'table_list' TEXT DEFAULT ''", ())
        #     cront = public.M('crontab').order("id desc").field(self.field).select()

        public.check_table('crontab_types',
                           '''CREATE TABLE "crontab_types" (
                                            "id" INTEGER PRIMARY KEY AUTOINCREMENT,
                                            "name" VARCHAR DEFAULT '',
                                            "ps" VARCHAR DEFAULT '');''')

    def get_zone(self, get):
        try:
            try:
                import pytz
            except:
                import os
                os.system("btpip install pytz")
                import pytz
            areadict = {}
            for i in pytz.all_timezones:
                if i.find('/') != -1:
                    area, zone = i.split('/')[0], i.split('/')[1]
                    if area not in areadict:
                        areadict[area] = [zone]
                    areadict[area].append(zone)
            for k, v in areadict.items():
                if k == 'status': continue
                areadict[k] = sorted(list(set(v)))
            # 取具体时区
            # 取具体时区地区
            result = public.ExecShell('ls -l /etc/localtime')
            area = result[0].split('/')[-2].strip()
            zone = result[0].split('/')[-1].strip()
            areadict['status'] = [area, zone]
            return areadict
        except:
            return public.returnMsg(False, '获取时区失败!')

    # 获取所有domain
    def get_domain(self, get=None):
        try:
            domains = public.M('domain').field('name').select()
            domains = ['http://' + i['name'] for i in domains]
            return domains
        except:
            return traceback.format_exc()

    # 设置置顶
    def set_task_top(self, get=None):
        """
        设置任务置顶，不传参数查询设置的计划任务列表
        :param get: task_id
        :return:
        """
        cron_task_top_path = '/www/server/panel/data/cron_task_top'
        if os.path.exists(cron_task_top_path):
            task_top = json.loads(public.readFile(cron_task_top_path))
        else:
            task_top = {'list': []}
        if get and hasattr(get, 'task_id'):
            task_top['list'] = [i for i in task_top['list'] if i != get['task_id']]
            task_top['list'].append(get['task_id'])
            public.writeFile(cron_task_top_path, json.dumps(task_top))
            return public.returnMsg(True, '设置置顶成功！')
        return task_top

    # 取消置顶
    def cancel_top(self, get):
        """
        取消任务置顶
        :param get:task_id
        :return:
        """
        cron_task_top_path = '/www/server/panel/data/cron_task_top'
        if os.path.exists(cron_task_top_path):
            task_top = json.loads(public.readFile(cron_task_top_path))
        else:
            return public.returnMsg(True, '取消置顶成功！')
        if hasattr(get, 'task_id'):
            task_top['list'].remove(get['task_id'])
            public.writeFile(cron_task_top_path, json.dumps(task_top))
            return public.returnMsg(True, '取消置顶成功！')
        else:
            return public.returnMsg(False, '请传入取消置顶ID！')


    # 取计划任务列表
    def GetCrontab(self, get):
        try:
            self.checkBackup()
            self.__clean_log()
            # cront = public.M('crontab').order("id desc").field(self.field).select()
            #
            # # sqllit分组查询
            # if hasattr(get, 'group_by'):
            #     if get.group_by != '':
            #         cront = public.M('crontab').where('type=?', (get.group_by,)).select()

 
            type_id = get.type_id if hasattr(get, 'type_id') else ""
            if type_id:
                if type_id == '-1':
                    cront = public.M('crontab').where('name like ?', ('%勿删%',)).order("id desc").field(self.field).select()
                elif type_id == '0':
                    cront = public.M('crontab').where('name not like ?', ('%勿删%',)).order("id desc").field(self.field).select()
                    cront = [
                        i for i in cront
                        if not isinstance(i['type_id'], int) or i['type_id'] <= 0
                    ]

                else:
                    cront = public.M('crontab').where('type_id=?', (type_id,)).order("id desc").field(self.field).select()
            else:
                cront = public.M('crontab').order("id desc").field(self.field).select()
                
            data = []
            for i in range(len(cront)):
                tmp = {}
                tmp = cront[i]
                if type_id != '-1' and type_id != "" and any('【勿删】' in str(value) for value in tmp.values()):  # 如果任何字段包含 "【勿删】"，跳过这个任务
                    continue

                if cront[i]['type'] == "day":
                    tmp['type_zh'] = public.getMsg('CRONTAB_TODAY')
                    tmp['cycle'] = public.getMsg('CRONTAB_TODAY_CYCLE',
                                                 (str(cront[i]['where_hour']), str(cront[i]['where_minute'])))
                elif cront[i]['type'] == "day-n":
                    tmp['type_zh'] = public.getMsg('CRONTAB_N_TODAY', (str(cront[i]['where1']),))
                    tmp['cycle'] = public.getMsg('CRONTAB_N_TODAY_CYCLE', (
                        str(cront[i]['where1']), str(cront[i]['where_hour']), str(cront[i]['where_minute'])))
                elif cront[i]['type'] == "hour":
                    tmp['type_zh'] = public.getMsg('CRONTAB_HOUR')
                    tmp['cycle'] = public.getMsg('CRONTAB_HOUR_CYCLE', (str(cront[i]['where_minute']),))
                elif cront[i]['type'] == "hour-n":
                    tmp['type_zh'] = public.getMsg('CRONTAB_N_HOUR', (str(cront[i]['where1']),))
                    tmp['cycle'] = public.getMsg('CRONTAB_N_HOUR_CYCLE',
                                                 (str(cront[i]['where1']), str(cront[i]['where_minute'])))
                elif cront[i]['type'] == "minute-n":
                    tmp['type_zh'] = public.getMsg('CRONTAB_N_MINUTE', (str(cront[i]['where1']),))
                    tmp['cycle'] = public.getMsg('CRONTAB_N_MINUTE_CYCLE', (str(cront[i]['where1']),))
                elif cront[i]['type'] == "week":
                    tmp['type_zh'] = public.getMsg('CRONTAB_WEEK')
                    if not cront[i]['where1']: cront[i]['where1'] = '0'
                    tmp['cycle'] = public.getMsg('CRONTAB_WEEK_CYCLE', (
                        self.toWeek(int(cront[i]['where1'])), str(cront[i]['where_hour']),
                        str(cront[i]['where_minute'])))
                elif cront[i]['type'] == "month":
                    tmp['type_zh'] = public.getMsg('CRONTAB_MONTH')
                    tmp['cycle'] = public.getMsg('CRONTAB_MONTH_CYCLE', (
                        str(cront[i]['where1']), str(cront[i]['where_hour']), str(cront[i]['where_minute'])))

                log_file = '/www/server/cron/{}.log'.format(tmp['echo'])
                if os.path.exists(log_file):
                    tmp['addtime'] = self.get_last_exec_time(log_file)
                data.append(tmp)
            # 假设前端发送的参数是一个字典，如 {'order_param': 'name desc'}
            order_param = get.order_param if hasattr(get, 'order_param') else None

            # 获取置顶列表
            top_list = self.set_task_top()['list']
            if top_list:
                top_list = top_list[::-1]


            # 将数据分为置顶数据和其他数据
            top_data = [item for item in data if str(item['id']) in top_list]
            data1 = [item for item in data if str(item['id']) not in top_list]

            # 对置顶数据和其他数据分别进行排序
            if order_param:
                sort_key, order = order_param.split(' ')
                reverse_order = order == 'desc'

                top_data = sorted(top_data, key=lambda x: x[sort_key], reverse=reverse_order)
                data1 = sorted(data1, key=lambda x: x[sort_key], reverse=reverse_order)

            # 将排序后的数据合并
            data = top_data + data1
            if hasattr(get, 'search'):
                if get.search != '':
                    data = [
                        item for item in data if
                        get.search in item['name']
                        or get.search in item['sName']
                        or get.search in item['type_zh']
                        or get.search in item['addtime']
                    ]


            for i in data:
                if i['backup_mode'] =="1":
                    i['backup_mode'] = 1
                else:
                    i['backup_mode'] = 0 
                if i['db_backup_path'] =="":
                    i['db_backup_path'] = "/www/backup"
                    
                if not i.get('rname', ''):
                    i['rname'] = i['name']
                if i['time_type']=='sweek':
                    i['type']='sweek'
                    week_str = self.toweek(i['time_set'])
                    if week_str:  # 检查week_str是否为空
                        i['type_zh']=week_str
                        i['cycle']="每"+week_str+i['special_time']+"执行"

                elif i['time_type']=='sday':
                            i['type']='sweek'
                            i['type_zh']=i['special_time']
                            i['cycle']="每天"+i['special_time']+"执行"

                elif i['time_type']=='smonth':
                    i['type']='sweek'
                    i['type_zh']=i['special_time']
                    i['cycle']="每月"+i['time_set']+"号"+i['special_time']+"执行"
                # if i['sType']=="site_restart":
                #     i['type']='sday'
                if i['sType']=='site_restart':
                    i['cycle']="每天"+i['special_time']+"执行"
                # 检查当前任务是否在置顶列表中
                if str(i['id']) in top_list:
                    # 如果在置顶列表中，设置sort为1
                    i['sort'] = 1
                else:
                    # 如果不在置顶列表中，设置sort为0
                    i['sort'] = 0

            return data
        except Exception as e:
            return public.returnMsg(False, '查询失败: ' + str(e))

    def toweek(self, days):
        week_days = {
            '1': '周一',
            '2': '周二',
            '3': '周三',
            '4': '周四',
            '5': '周五',
            '6': '周六',
            '7': '周日'
        }
        day_list = str(days).split(',')
        for day in day_list:
            if day not in week_days:
                print('Invalid day:', day)
                return ''
        return ','.join(week_days[day] for day in day_list)

    def get_backup_list(self, args):
        '''
            @name 获取指定备份任务的备份文件列表
            @author hwliang
            @param args<dict> 参数{
                cron_id<int> 任务ID 必填
                p<int> 页码 默认1
                rows<int> 每页显示条数 默认10
                callback<string> jsonp回调函数  默认为空
            }
            @return <dict>{
                page<str> 分页HTML
                data<list> 数据列表
            }
        '''

        p = args.get('p/d', 1)
        rows = args.get('rows/d', 10)
        tojs = args.get('tojs/s', '')
        callback = args.get('callback/s', '') if tojs else tojs

        cron_id = args.get('cron_id/d')
        count = public.M('backup').where('cron_id=?', (cron_id,)).count()
        data = public.get_page(count, p, rows, callback)
        data['data'] = public.M('backup').where('cron_id=?', (cron_id,)).limit(data['row'], data['shift']).select()
        return data

    def get_last_exec_time(self, log_file):
        '''
            @name 获取上次执行时间
            @author hwliang
            @param log_file<string> 日志文件路径
            @return format_date
        '''
        exec_date = ''
        try:
            log_body = public.GetNumLines(log_file, 20)
            if log_body:
                log_arr = log_body.split('\n')
                date_list = []
                for i in log_arr:
                    if i.find('★') != -1 and i.find('[') != -1 and i.find(']') != -1:
                        date_list.append(i)
                if date_list:
                    exec_date = date_list[-1].split(']')[0].split('[')[1]
        except:
            pass

        finally:
            if not exec_date:
                exec_date = public.format_date(times=int(os.path.getmtime(log_file)))
        return exec_date

    # 清理日志
    def __clean_log(self):
        try:
            log_file = '/www/server/cron'
            if not os.path.exists(log_file): return False
            for f in os.listdir(log_file):
                if f[-4:] != '.log': continue
                filename = log_file + '/' + f
                if os.path.getsize(filename) < 1048576 / 2: continue
                tmp = public.GetNumLines(filename, 100)
                public.writeFile(filename, tmp)
        except:
            pass

    # 转换大写星期
    def toWeek(self, num):
        wheres = {
            0: public.getMsg('CRONTAB_SUNDAY'),
            1: public.getMsg('CRONTAB_MONDAY'),
            2: public.getMsg('CRONTAB_TUESDAY'),
            3: public.getMsg('CRONTAB_WEDNESDAY'),
            4: public.getMsg('CRONTAB_THURSDAY'),
            5: public.getMsg('CRONTAB_FRIDAY'),
            6: public.getMsg('CRONTAB_SATURDAY')
        }
        try:
            return wheres[num]
        except:
            return ''

    # 检查环境
    def checkBackup(self):
        if cache.get('check_backup'): return None

        # 检查备份表是否正确
        if not public.M('sqlite_master').db('backup').where('type=? AND name=? AND sql LIKE ?',
                                               ('table', 'backup', '%cron_id%')).count():
            public.M('backup').execute("ALTER TABLE 'backup' ADD 'cron_id' INTEGER DEFAULT 0", ())

        # 检查备份脚本是否存在
        filePath = public.GetConfigValue('setup_path') + '/panel/script/backup'
        if not os.path.exists(filePath):
            public.downloadFile(public.GetConfigValue('home') + '/linux/backup.sh', filePath)
        # 检查日志切割脚本是否存在
        filePath = public.GetConfigValue('setup_path') + '/panel/script/logsBackup'
        if not os.path.exists(filePath):
            public.downloadFile(public.GetConfigValue('home') + '/linux/logsBackup.py', filePath)
        # 检查计划任务服务状态
        import system
        sm = system.system()
        if os.path.exists('/etc/init.d/crond'):
            if not public.process_exists('crond'): public.ExecShell('/etc/init.d/crond start')
        elif os.path.exists('/etc/init.d/cron'):
            if not public.process_exists('cron'): public.ExecShell('/etc/init.d/cron start')
        elif os.path.exists('/usr/lib/systemd/system/crond.service'):
            if not public.process_exists('crond'): public.ExecShell('systemctl start crond')
        cache.set('check_backup', True, 3600)

    # 设置计划任务状态
    def set_cron_status(self, get):
        id = get['id']
        cronInfo = public.M('crontab').where('id=?', (id,)).field(self.field).find()
        status_msg = ['停用', '启用']
        status = 1
        if cronInfo['status'] == status:
            status = 0
            if not self.remove_for_crond(cronInfo['echo']):
                return public.returnMsg(False, '写入计划任务失败,请检查磁盘是否可写或是否开启了系统加固!')
        else:
            cronInfo['status'] = 1
            if not self.sync_to_crond(cronInfo):
                return public.returnMsg(False, '写入计划任务失败,请检查磁盘是否可写或是否开启了系统加固!')

        public.M('crontab').where('id=?', (id,)).setField('status', status)
        public.WriteLog('计划任务', '修改计划任务[' + cronInfo['name'] + ']状态为[' + status_msg[status] + ']')
        cronPath = '/www/server/cron'
        cronName = cronInfo['echo']
        if_stop = get.get('if_stop', '')
        if if_stop:
            self.stop_cron_task(cronPath, cronName, if_stop)
        return public.returnMsg(True, '设置成功')

    def set_cron_status_all(self, get):
        """
        批量设置计划任务状态
        :param get: type:stop, start, del, exec    id_list:[1,2,3]
        :return:
        """
        if not hasattr(get, 'type'):
            return public.returnMsg(False, '参数错误')
        if not hasattr(get, 'id_list'):
            return public.returnMsg(False, '参数错误')
        # 停止或开启
        if get.type not in ['stop', 'start', 'del', 'exec']:
            return public.returnMsg(False, '参数错误')
        if get.type == 'stop' or get.type == 'start':
            id_list = json.loads(get['id_list'])
            status = 1 if get.type == 'start' else 0
            status_msg = ['停止', '开启']
            data = []
            for id in id_list:
                try:
                    name = public.M('crontab').where('id=?', (id,)).field('name').find().get('name', '')
                    cronInfo = public.M('crontab').where('id=?', (id,)).field(self.field).find()
                    if not cronInfo:
                        data.append({id: '此id计划任务不存在', 'status': False})
                        continue
                    if status == 1:
                        if not self.sync_to_crond(cronInfo):
                            return public.returnMsg(False, '写入计划任务失败,请检查磁盘是否可写或是否开启了系统加固!')
                    else:
                        if not self.remove_for_crond(cronInfo['echo']):
                            return public.returnMsg(False, '写入计划任务失败,请检查磁盘是否可写或是否开启了系统加固!')
                    public.M('crontab').where('id=?', (id,)).setField('status', status)
                    cronPath = '/www/server/cron'
                    cronName = cronInfo['echo']
                    if_stop = get.if_stop
                    self.stop_cron_task(cronPath, cronName, if_stop)
                except:
                    data.append({name: "{}设置失败".format(status_msg[status]), 'status': True})
                else:
                    data.append({name: "{}设置成功".format(status_msg[status]), 'status': False})
            return data
        # 删除
        if get.type == 'del':
            id_list = json.loads(get['id_list'])
            data = []
            for id in id_list:
                try:
                    name = public.M('crontab').where('id=?', (id,)).field('name').find().get('name', '')
                    if not name:
                        data.append({id: '此id计划任务不存在', 'status': False})
                        continue
                    get = public.to_dict_obj({'id': id})
                    res = self.DelCrontab(get)
                except:
                    pass
                data.append({name: "删除{}".format("成功" if res['status'] else "失败"), 'status': res['status']})
            return data
        # 执行
        if get.type == 'exec':
            id_list = json.loads(get['id_list'])
            data = []
            for id in id_list:
                try:
                    name = public.M('crontab').where('id=?', (id,)).field('name').find().get('name', '')
                    if not name:
                        data.append({id: '此id计划任务不存在', 'status': False})
                        continue
                    get = public.to_dict_obj({'id': id})
                    res = self.StartTask(get)
                except:
                    pass
                data.append({name: "执行{}".format("成功" if res['status'] else "失败"), 'status': res['status']})
            return data

    # 修改计划任务
    def modify_crond(self, get):
        try:
            if re.search('<.*?>', get['name']):
                return public.returnMsg(False, "分类名称不能包含HTML语句")
            if get['sType'] == 'toShell':
                sBody = get['sBody']
                get['sBody'] = sBody.replace('\r\n', '\n')
                if get.get('version',''):
                    version = get['version'].replace(".", "")
                    get['sBody'] = get['sBody'].replace("${1/./}", version)
            if len(get['name']) < 1:
                return public.returnMsg(False, 'CRONTAB_TASKNAME_EMPTY')
            id = get['id']
            cronInfo = public.M('crontab').where('id=?', (id,)).field(self.field).find()


            if get['type']=='sweek':

            # if get['type']=='sweek':
                self.modify_values(cronInfo['echo'],get['time_type'],get['special_time'],get['time_set']) 
                get['type']='minute-n'
            cuonConfig, get, name = self.GetCrondCycle(get)
            # 检查是否有从前端发送的cuonConfig参数
            # if 'user_cuonConfig' in get:
            #     if not self.validate_cuonConfig(get['user_cuonConfig']):
            #         return public.returnMsg(False, '时间格式错误')
            #     cuonConfig = get['user_cuonConfig']
            # else:
            #     cuonConfig, get, name = self.GetCrondCycle(get)
              
            

            projectlog = self.modify_project_log_split(cronInfo, get)
            if projectlog.modify():
                return public.returnMsg(projectlog.flag, projectlog.msg)
            if not get['where1']: get['where1'] = get['week']
            del (cronInfo['id'])
            del (cronInfo['addtime'])
            cronInfo['name'] = get['name']
            if cronInfo['sType'] == "sync_time": cronInfo['sName'] = get['sName']
            cronInfo['type'] = get['type']
            cronInfo['where1'] = get['where1']
            cronInfo['where_hour'] = get['hour']
            cronInfo['where_minute'] = get['minute']
            cronInfo['save'] = get['save']
            cronInfo['backupTo'] = get['backupTo']
            cronInfo['sBody'] = get['sBody']
            cronInfo['urladdress'] = get['urladdress']
            cronInfo['time_type']=get.get('time_type','')
            cronInfo['special_time']=get.get('special_time','')
            cronInfo['time_set']=get.get('time_set','')
            if get.get('db_backup_path')=="/www/backup":
                db_backup_path=""
            else:
                db_backup_path=get.get('db_backup_path','')
            columns = 'type,where1,where_hour,where_minute,save,backupTo,sName,sBody,urladdress,db_type,split_type,split_value,rname,post_param,flock,time_set,backup_mode,db_backup_path,time_type,special_time,user_agent,version,table_list'
            values = (get['type'], get['where1'], get['hour'],
                      get['minute'], get['save'], get['backupTo'], cronInfo['sName'], get['sBody']
                      , get['urladdress'], get.get("db_type"), get.get("split_type"), get.get("split_value"), get['name'], get.get('post_param', ''), get.get('flock', 0),get.get('time_set',''),get.get('backup_mode', ''),db_backup_path,get.get('time_type',''),get.get('special_time',''),get.get('user_agent',''),get.get('version',''),get.get('table_list',''))
            if 'save_local' in get:
                columns += ",save_local, notice, notice_channel"
                values = (get['type'], get['where1'], get['hour'],
                          get['minute'], get['save'], get['backupTo'], cronInfo['sName'], get['sBody'],
                          get['urladdress'], get.get("db_type"), get.get("split_type"), get.get("split_value"), get['name'], get.get('post_param', ''), get.get('flock', 0),get.get('time_set',''),get.get('backup_mode', ''),db_backup_path,get.get('time_type',''),get.get('special_time',''),get.get('user_agent',''),get.get('version',''),get.get('table_list',''),
                          get['save_local'], get["notice"],get["notice_channel"])
            if not self.remove_for_crond(cronInfo['echo']):
                return public.returnMsg(False, '写入计划任务失败,请检查磁盘是否可写或是否开启了系统加固!')
            if cronInfo['status'] == 0: return public.returnMsg(False, '当前任务处于停止状态,请开启任务后再修改!')
            if not self.sync_to_crond(cronInfo):
                return public.returnMsg(False, '写入计划任务失败,请检查磁盘是否可写或是否开启了系统加固!')
            public.M('crontab').where('id=?', (id,)).save(columns, values)

            public.WriteLog('计划任务', '修改计划任务[' + cronInfo['name'] + ']成功')
            return public.returnMsg(True, '修改成功')
        #except Exception as e:
         #   return public.returnMsg(False,str(e))
        except:
             return public.returnMsg(False,traceback.format_exc())

    # 获取指定任务数据
    def get_crond_find(self, get):
        id = int(get.id)
        data = public.M('crontab').where('id=?', (id,)).field(self.field).find()
        return data

    # 同步到crond
    def sync_to_crond(self, cronInfo):
        if not 'status' in cronInfo: return False
        if 'where_hour' in cronInfo:
            cronInfo['hour'] = cronInfo['where_hour']
            cronInfo['minute'] = cronInfo['where_minute']
            cronInfo['week'] = cronInfo['where1']
        cuonConfig, cronInfo, name = self.GetCrondCycle(cronInfo)
        cronPath = public.GetConfigValue('setup_path') + '/cron'
        cronName = self.GetShell(cronInfo)
        if type(cronName) == dict: return cronName
        # cuonConfig += ' ' + cronPath + '/' + cronName + ' >> ' + cronPath + '/' + cronName + '.log 2>&1'

        if int(cronInfo.get('flock', 0)) == 1:
            flock_name = cronPath + '/' + cronName + '.lock'
            public.writeFile(flock_name, '')
            os.system('chmod 777 {}'.format(flock_name))
            cuonConfig += ' flock -xn ' + cronPath + '/' + cronName + '.lock' + ' -c ' + cronPath + '/' + cronName + ' >> ' + cronPath + '/' + cronName + '.log 2>&1'
        else:
            cuonConfig += ' ' + cronPath + '/' + cronName + ' >> ' + cronPath + '/' + cronName + '.log 2>&1'
        wRes = self.WriteShell(cuonConfig)
        if type(wRes) != bool: return False
        self.CrondReload()
        return True

    def ensure_execute_commands_script(self,get):
        cronName = public.md5(public.md5(str(time.time()) + '_bt'))
        script_path = '/etc/init.d/execute_commands'
        systemd_service_path = '/etc/systemd/system/execute_commands.service'

        # For systemd systems
        if os.path.exists('/bin/systemctl') or os.path.exists('/usr/bin/systemctl'):
            if not os.path.exists(systemd_service_path):
                with open(systemd_service_path, 'w') as service_file:
                    service_content = """[Unit]
    Description=Custom Service to execute commands at startup
    After=network.target

    [Service]
    Type=simple
    ExecStart=btpython /www/server/panel/script/execute_commands.py
    Restart=on-failure

    [Install]
    WantedBy=multi-user.target
    """
                    service_file.write(service_content)

                os.system('systemctl daemon-reload')
                os.system('systemctl start execute_commands.service')
                os.system('systemctl enable execute_commands.service')
                print("Systemd service created and enabled successfully.")

        # For SysVinit systems
        else:
            if not os.path.exists(script_path):
                with open(script_path, 'w') as script_file:
                    script_content = """#! /bin/sh
    # chkconfig: 2345 55 25

    ### BEGIN INIT INFO
    # Provides:          custom_service
    # Required-Start:    $all
    # Required-Stop:     $all
    # Default-Start:     2 3 4 5
    # Default-Stop:      0 1 6
    # Short-Description: Custom Service
    # Description:       Executes user-defined shell commands at startup
    ### END INIT INFO

    # Author:   Your Name
    # website:  Your Website

    PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

    case "$1" in
        start)
            echo -n "Starting custom_service... "
            if [ -f /var/run/custom_service.pid ];then
                mPID=$(cat /var/run/custom_service.pid)
                isStart=`ps ax | awk '{ print $1 }' | grep -e "^${mPID}$"`
                if [ "$isStart" != "" ];then
                    echo "custom_service (pid $mPID) already running."
                    exit 1
                fi
            fi
            nohup btpython /www/server/panel/script/execute_commands.py > /dev/null 2>&1 &
            pid=$!
            echo $pid > /var/run/custom_service.pid
            echo " done"
            ;;
        stop)
            echo "Custom Service does not support stop operation."
            ;;
        status)
            if [ -f /var/run/custom_service.pid ];then
                mPID=`cat /var/run/custom_service.pid`
                isStart=`ps ax | awk '{ print $1 }' | grep -e "^${mPID}$"`
                if [ "$isStart" != '' ];then
                    echo "custom_service is running with PID $mPID."
                    exit 0
                else
                    echo "custom_service is stopped"
                    exit 0
                fi
            else
                echo "custom_service is stopped"
                exit 0
            fi
            ;;
        *)
            echo "Usage: $0 {start|status}"
            exit 1
            ;;
    esac

    exit 0"""
                    script_file.write(script_content)
                    os.chmod(script_path, 0o755)  # Set execute permission
                print("Init script created successfully.")
                
                if os.path.exists('/usr/sbin/update-rc.d'):
                    os.system('update-rc.d -f execute_commands defaults')
                print("Service configured for SysVinit successfully.")

        if get.get('db_backup_path') == "/www/backup":
            db_backup_path = ""
        else:
            db_backup_path = get.get('db_backup_path', '')
        columns = 'name,type,where1,where_hour,where_minute,echo,addtime,\
                status,save,backupTo,sType,sName,sBody,urladdress,db_type,split_type,split_value,keyword,post_param,flock,time_set,backup_mode,db_backup_path,time_type,special_time,user_agent,version,table_list'
        values = (public.xssencode2(get['name']), get['type'], get['where1'], get['hour'],
                  get['minute'], cronName, time.strftime('%Y-%m-%d %X', time.localtime()),
                  1, get['save'], get['backupTo'], get['sType'], get['sName'], get['sBody'],
                  get['urladdress'], get.get("db_type"), get.get("split_type"), get.get("split_value"), get.get('keyword', ''), get.get('post_param', ''), get.get('flock', 0), get.get('time_set', ''),
                  get.get('backup_mode', ''), db_backup_path, get.get('time_type', ''), get.get('special_time', ''), get.get('user_agent', ''), get.get('verison', ''), get.get('table_list', ''))
        if "save_local" in get:
            columns += ",save_local,notice,notice_channel"
            values = (public.xssencode2(get['name']), get['type'], get['where1'], get['hour'],
                      get['minute'], cronName, time.strftime('%Y-%m-%d %X', time.localtime()),
                      1, get['save'], get['backupTo'], get['sType'], get['sName'], get['sBody'],
                      get['urladdress'], get.get("db_type"), get.get("split_type"), get.get("split_value"), get.get('keyword', ''), get.get('post_param', ''), get.get('flock', 0),
                      get.get('time_set', ''), get.get('backup_mode', ''), db_backup_path, get.get('time_type', ''), get.get('special_time', ''), get.get('user_agent', ''), get.get('verison', ''),
                      get.get('table_list', ''),
                      get["save_local"], get['notice'], get['notice_channel'])
        addData = public.M('crontab').add(columns, values)
        public.add_security_logs('计划任务', '添加计划任务[' + get['name'] + ']成功' + str(values))
        if type(addData) == str:
            return public.returnMsg(False, addData)
        public.WriteLog('计划任务', '添加计划任务[' + get['name'] + ']成功')
        if addData > 0:
            result = public.returnMsg(True, 'ADD_SUCCESS')
            result['id'] = addData
            return result
        return public.returnMsg(False, 'ADD_ERROR')

    # 添加计划任务
    def AddCrontab(self, get):

        try:
          
            if len(get['name']) < 1:
                return public.returnMsg(False, 'CRONTAB_TASKNAME_EMPTY')
            if get['sType'] == 'toShell':
                get['sBody'] = get['sBody'].replace('\r\n', '\n')
            # 如果get中有version键，就替换sBody中的版本号占位符
                if get.get('version',''):
                    version = get['version'].replace(".", "")
                    get['sBody'] = get['sBody'].replace("${1/./}", version)
                    print(get['sBody'])
            if get['sType'] == 'startup_services':
                return self.ensure_execute_commands_script(get)  # 检查并创建脚本
                
            if get['type']=='sweek':
               get['type']='minute-n'
            cuonConfig, get, name = self.GetCrondCycle(get)
            cronPath = public.GetConfigValue('setup_path') + '/cron'
            cronName = self.GetShell(get)

            if type(cronName) == dict: return cronName
            if int(get.get('flock', 0)) == 1:
                flock_name = cronPath + '/' + cronName + '.lock'
                public.writeFile(flock_name, '')
                os.system('chmod 777 {}'.format(flock_name))
                cuonConfig += ' flock -xn ' + cronPath + '/' + cronName + '.lock' + ' -c ' + cronPath + '/' + cronName + ' >> ' + cronPath + '/' + cronName + '.log 2>&1'
            else:
                cuonConfig += ' ' + cronPath + '/' + cronName + ' >> ' + cronPath + '/' + cronName + '.log 2>&1'
            wRes = self.WriteShell(cuonConfig)
            if type(wRes) != bool: return wRes
            self.CrondReload()
            if get.get('db_backup_path')=="/www/backup":
                db_backup_path=""
            else:
                db_backup_path=get.get('db_backup_path','')
            columns = 'name,type,where1,where_hour,where_minute,echo,addtime,\
                    status,save,backupTo,sType,sName,sBody,urladdress,db_type,split_type,split_value,keyword,post_param,flock,time_set,backup_mode,db_backup_path,time_type,special_time,user_agent,version,table_list'
            values = (public.xssencode2(get['name']), get['type'], get['where1'], get['hour'],
                    get['minute'], cronName, time.strftime('%Y-%m-%d %X', time.localtime()),
                    1, get['save'], get['backupTo'], get['sType'], get['sName'], get['sBody'],
                    get['urladdress'], get.get("db_type"), get.get("split_type"), get.get("split_value"), get.get('keyword', ''), get.get('post_param', ''), get.get('flock', 0),get.get('time_set', ''),get.get('backup_mode',''),db_backup_path,get.get('time_type',''),get.get('special_time',''),get.get('user_agent',''),get.get('verison',''),get.get('table_list',''))
            if "save_local" in get:
                columns += ",save_local,notice,notice_channel"
                values = (public.xssencode2(get['name']), get['type'], get['where1'], get['hour'],
                        get['minute'], cronName, time.strftime('%Y-%m-%d %X', time.localtime()),
                        1, get['save'], get['backupTo'], get['sType'], get['sName'], get['sBody'],
                        get['urladdress'], get.get("db_type"), get.get("split_type"), get.get("split_value"), get.get('keyword', ''), get.get('post_param', ''), get.get('flock', 0),get.get('time_set', ''),get.get('backup_mode', ''),db_backup_path,get.get('time_type',''),get.get('special_time',''),get.get('user_agent',''),get.get('verison',''),get.get('table_list',''),
                        get["save_local"], get['notice'], get['notice_channel'])
            addData = public.M('crontab').add(columns, values)
            public.add_security_logs('计划任务', '添加计划任务[' + get['name'] + ']成功' + str(values))
            if type(addData) == str:
                return public.returnMsg(False, addData)
            public.WriteLog('计划任务', '添加计划任务[' + get['name'] + ']成功')
            if addData > 0:
                result = public.returnMsg(True, 'ADD_SUCCESS')
                result['id'] = addData
                return result
            return public.returnMsg(False, 'ADD_ERROR')
        except Exception as e:
            return public.returnMsg(False, str(e))

    # 构造周期
    def GetCrondCycle(self, params):
        cuonConfig = ""
        name = ""
        if params['type'] == "day":
            cuonConfig = self.GetDay(params)
            name = public.getMsg('CRONTAB_TODAY')
        elif params['type'] == "day-n":
            cuonConfig = self.GetDay_N(params)
            name = public.getMsg('CRONTAB_N_TODAY', (params['where1'],))
        elif params['type'] == "hour":
            cuonConfig = self.GetHour(params)
            name = public.getMsg('CRONTAB_HOUR')
        elif params['type'] == "hour-n":
            cuonConfig = self.GetHour_N(params)
            name = public.getMsg('CRONTAB_HOUR')
        elif params['type'] == "minute-n":
            cuonConfig = self.Minute_N(params)
        elif params['type'] == "week":
            params['where1'] = params['week']
            cuonConfig = self.Week(params)
        elif params['type'] == "month":
            cuonConfig = self.Month(params)
        return cuonConfig, params, name

    # 取任务构造Day
    def GetDay(self, param):
        cuonConfig = "{0} {1} * * * ".format(param['minute'], param['hour'])
        return cuonConfig

    # 取任务构造Day_n
    def GetDay_N(self, param):
        cuonConfig = "{0} {1} */{2} * * ".format(param['minute'], param['hour'], param['where1'])
        return cuonConfig

    # 取任务构造Hour
    def GetHour(self, param):
        cuonConfig = "{0} * * * * ".format(param['minute'])
        return cuonConfig

    # 取任务构造Hour-N
    def GetHour_N(self, param):
        cuonConfig = "{0} */{1} * * * ".format(param['minute'], param['where1'])
        return cuonConfig

    # 取任务构造Minute-N
    def Minute_N(self, param):
        cuonConfig = "*/{0} * * * * ".format(param['where1'])
        return cuonConfig

    # 取任务构造week
    def Week(self, param):
        cuonConfig = "{0} {1} * * {2}".format(param['minute'], param['hour'], param['week'])
        return cuonConfig

    # 取任务构造Month
    def Month(self, param):
        cuonConfig = "{0} {1} {2} * * ".format(param['minute'], param['hour'], param['where1'])
        return cuonConfig

    # 取数据列表
    def GetDataList(self, get):
        data = {}
        if get['type'] == 'databases':
            data['data'] = public.M(get['type']).where("type=?", "MySQL").field('name,ps').select()
        else:
            data['data'] = public.M(get['type']).field('name,ps').select()
        for i in data['data']:
            if 'ps' in i:
                try:
                    if i['ps'] is None: continue
                    i['ps'] = public.xsssec(i['ps'])  # 防止数据库为空时，xss防御报错  2020-11-25
                except:
                    pass
        data['orderOpt'] = []
        import json
        tmp = public.readFile('data/libList.conf')
        if not tmp: return data
        libs = json.loads(tmp)
        for lib in libs:
            if not 'opt' in lib: continue
            filename = 'plugin/{}'.format(lib['opt'])
            if not os.path.exists(filename): continue
            tmp = {}
            tmp['name'] = lib['name']
            tmp['value'] = lib['opt']
            data['orderOpt'].append(tmp)
        return data

    # 取任务日志
    def GetLogs(self, get):
        id = get['id']
        sType = public.M('crontab').where("id=?", (id,)).getField('sType')
        if sType == 'webshell':
            try:
                logs = self.GetWebShellLogs(get)
                return logs
            except:
                pass
        echo = public.M('crontab').where("id=?", (id,)).field('echo').find()
        logFile = public.GetConfigValue('setup_path') + '/cron/' + echo['echo'] + '.log'
        if not os.path.exists(logFile): return public.returnMsg(True, 'CRONTAB_TASKLOG_EMPTY')
        log = public.GetNumLines(logFile, 2000)
        return public.returnMsg(True, public.xsssec(log))

    # 清理任务日志
    def DelLogs(self, get):
        try:
            id = get['id']
            echo = public.M('crontab').where("id=?", (id,)).getField('echo')
            logFile = public.GetConfigValue('setup_path') + '/cron/' + echo + '.log'
            if not os.path.exists(logFile): return public.returnMsg(True, 'CRONTAB_TASKLOG_CLOSE')
            os.remove(logFile)
            return public.returnMsg(True, 'CRONTAB_TASKLOG_CLOSE')
        except:
            return public.returnMsg(False, 'CRONTAB_TASKLOG_CLOSE_ERR')

    # 删除计划任务
    def DelCrontab(self, get):
        try:
            id = get['id']
            find = public.M('crontab').where("id=?", (id,)).field('name,echo').find()
            if not find: return public.returnMsg(False, '指定任务不存在!')
            if not self.remove_for_crond(find['echo']): return public.returnMsg(False, '无法写入文件，请检查是否开启了系统加固功能!')
            cronPath = public.GetConfigValue('setup_path') + '/cron'
            sfile = cronPath + '/' + find['echo']
            if os.path.exists(sfile): os.remove(sfile)
            sfile = cronPath + '/' + find['echo'] + '.log'
            if os.path.exists(sfile): os.remove(sfile)

            public.M('crontab').where("id=?", (id,)).delete()
            public.add_security_logs("删除计划任务", "删除计划任务:" + find['name'])
            public.WriteLog('TYPE_CRON', 'CRONTAB_DEL', (find['name'],))
            return public.returnMsg(True, 'DEL_SUCCESS')
        except:
            return public.returnMsg(False, 'DEL_ERROR')

    # 从crond删除
    def remove_for_crond(self, echo):
        file = self.get_cron_file()
        if not os.path.exists(file):
            return False
        conf = public.readFile(file)
        if not conf: return True
        if conf.find(str(echo)) == -1: return True
        rep = ".+" + str(echo) + ".+\n"
        conf = re.sub(rep, "", conf)
        try:
            if not public.writeFile(file, conf): return False
        except:
            return False
        self.CrondReload()
        return True


    # 取执行脚本
    def GetShell(self, param):
        type = param['sType']
        if not 'echo' in param:
            cronName = public.md5(public.md5(str(time.time()) + '_bt'))
        else:
            cronName = param['echo']
        if type == 'toFile':
            shell = param.sFile
        else:
            cronPath = '/www/server/cron'  
            cronFile = '{}/{}.pl'.format(cronPath,cronName)
            head = "#!/bin/bash\nPATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin\nexport PATH\n"
            head += "echo $$ > " + cronFile + "\n"  # 将PID保存到文件中
            time_type = param.get('time_type', '')
            if time_type:
                time_list=param.get('time_set', '')
                special_time=param.get('special_time', '')           
                # if time_type == "sweek":
                # 调用 Python 脚本进行时间检查
                head += 'if [[ $1 != "start" ]]; then\n'
                head += ' if ! btpython /www/server/panel/script/time_check.py time_type={} special_time={} time_list={}; then\n'.format(time_type, ",".join(special_time.split(",")), ",".join(time_list.split(",")))
                head += '   exit 1\n'
                head += ' fi\n'
                head += 'fi\n'
            if param['sType']=="site_restart":
                special_time=param.get('special_time', '')
                # 调用 Python 脚本进行时间检查
                head += 'if [[ $1 != "start" ]]; then\n'
                head += ' if ! btpython /www/server/panel/script/special_time.py special_time={} ; then\n'.format(",".join(special_time.split(",")))
                head += '   exit 1\n'
                head += ' fi\n'
                head += 'fi\n'
            log = '-access_log'
            python_bin = "{} -u".format(public.get_python_bin())
            if public.get_webserver() == 'nginx':
                log = '.log'
            if type in ['site', 'path'] and param['sBody'] != 'undefined' and len(param['sBody']) > 1:
                exclude_files = ','.join([n.strip() for n in param['sBody'].split('\n') if n.strip()])
                head += f'export BT_EXCLUDE="{exclude_files}"\n'
            attach_param = " " + cronName
            log_cut_path = param['log_cut_path'] if hasattr(param,'log_cut_path') else '/www/wwwlogs/'
            special_time= param['special_time'] if hasattr(param,'special_time') else ''
            wheres = {
                'path': head + python_bin + " " + public.GetConfigValue(
                    'setup_path') + "/panel/script/backup.py path " + param['sName'] + " " + str(
                    param['save']) + attach_param,
                'site': head + python_bin + " " + public.GetConfigValue(
                    'setup_path') + "/panel/script/backup.py site " + param['sName'] + " " + str(
                    param['save']) + attach_param,
                'database': head + python_bin + " " + public.GetConfigValue(
                    'setup_path') + "/panel/script/backup.py database " + param['sName'] + " " + str(
                    param['save']) + attach_param,
                'logs': head + python_bin + " " + public.GetConfigValue('setup_path') + "/panel/script/logsBackup " +
                        param['sName'] + " " + str(param['save']) + " " + log_cut_path,
                'rememory': head + "/bin/bash " + public.GetConfigValue('setup_path') + '/panel/script/rememory.sh',
                'sync_time': head + python_bin + " " + public.GetConfigValue(
                    'setup_path') + "/panel/script/sync_time.py {}".format(param['sName']),
                'webshell': head + python_bin + " " + public.GetConfigValue(
                    'setup_path') + '/panel/class/webshell_check.py site ' + param['sName'] + ' ' + param['urladdress'],
                'mysql_increment_backup': head + python_bin + " " + public.GetConfigValue(
                    'setup_path') + '/panel/script/loader_binlog.py --echo_id=' + cronName,
                'special_log': head + python_bin + " " + public.GetConfigValue('setup_path') + "/panel/script/rotate_log_special.py " +
                               str(param['save']) + " " + param['sName'],
                'site_restart':head + python_bin + " " + public.GetConfigValue('setup_path') + "/panel/script/move_config.py " +
                              " " + param['sName'] + " " + special_time,
                'log_cleanup':head + python_bin + " " + public.GetConfigValue('setup_path') + "/panel/script/log_cleanup.py " +
                              " " + param['sName'],
            }
            # 取消插件调用计划任务
            # if param['backupTo'] != 'localhost':
            #     cfile = public.GetConfigValue('setup_path') + "/panel/plugin/" + param['backupTo'] + "/" + param[
            #         'backupTo'] + "_main.py"
            #     if not os.path.exists(cfile): cfile = public.GetConfigValue('setup_path') + "/panel/script/backup_" + \
            #                                           param['backupTo'] + ".py"
            #     wheres = {
            #         'path': head + python_bin + " " + cfile + " path " + param['sName'] + " " + str(
            #             param['save']) + attach_param,
            #         'site': head + python_bin + " " + cfile + " site " + param['sName'] + " " + str(
            #             param['save']) + attach_param,
            #         'database': head + python_bin + " " + cfile + " database " + param['sName'] + " " + str(
            #             param['save']) + attach_param,
            #         'logs': head + python_bin + " " + public.GetConfigValue(
            #             'setup_path') + "/panel/script/logsBackup " + param['sName'] + " " + str(param['save']),
            #         'rememory': head + "/bin/bash " + public.GetConfigValue('setup_path') + '/panel/script/rememory.sh',
            #         'webshell': head + python_bin + " " + public.GetConfigValue(
            #             'setup_path') + '/panel/class/webshell_check.py site ' + param['sName'] + ' ' + param[
            #                         'urladdress']
            #     }
            try:
                shell = wheres[type]

            except:
                if type=="site_restart":
                    lines = shell.split('\n')
                    last_line = lines[-1]               
                    new_command = '''

if [[ $1 == "start" ]]; then
        {} start
else
        {}
                    
fi
'''.format(last_line, last_line)

                    shell = shell.replace(last_line, new_command)
                # 设置 User-Agent 头
                user_agent = "-H 'User-Agent: {}'".format(param['user_agent']) if hasattr(param,'user_agent') else ''
                if type == 'toUrl':
                    # shell = head + "curl -sS --connect-timeout 10 -m 3600 '" + param['urladdress'] + "'"
                    shell = head + "curl -sS {} --connect-timeout 10 -m 3600 '{}'".format(user_agent, param['urladdress'])
                elif type == 'to_post':
                    param1 = {}
                    for i in json.loads(param['post_param']):
                        param1[i['paramName']] = i['paramValue']
                    # shell = head + '''curl -sS -X POST --connect-timeout 10 -m 3600 -H "Content-Type: application/json"  -d '{}' {} '''.format(json.dumps(param1),
                    #                                                                                                                            param['urladdress'])
                    shell = head + '''curl -sS -X POST {} --connect-timeout 10 -m 3600 -H "Content-Type: application/json"  -d '{}' {} '''.format(user_agent, json.dumps(param1), param['urladdress'])
                else:
                    shell = head + param['sBody'].replace("\r\n", "\n")
            cronPath = '/www/server/cron'  # 修改为实际的路径
            cronFile = f'{cronPath}/{cronName}.pl'
            shell += f'''
echo "----------------------------------------------------------------------------"
endDate=`date +"%Y-%m-%d %H:%M:%S"`
echo "★[$endDate] Successful"
echo "----------------------------------------------------------------------------"
rm -f {cronFile}
'''
        if type == 'toShell' and param.get('notice') and param['notice_channel'] and param['notice_channel'] and len(param.get('keyword', '')):
            shell += "btpython /www/server/panel/script/shell_push.py {} {} {} {} &".format(cronName, param['notice_channel'], param['keyword'], param['name'])

        cronPath = public.GetConfigValue('setup_path') + '/cron'
        if not os.path.exists(cronPath): public.ExecShell('mkdir -p ' + cronPath)
        file = cronPath + '/' + cronName
        public.writeFile(file, self.CheckScript(shell))
        public.ExecShell('chmod 750 ' + file)
        return cronName
        # except Exception as ex:
        # return public.returnMsg(False, 'FILE_WRITE_ERR' + str(ex))



    # 检查脚本
    def CheckScript(self, shell):
        keys = ['shutdown', 'init 0', 'mkfs', 'passwd', 'chpasswd', '--stdin', 'mkfs.ext', 'mke2fs']
        for key in keys:
            shell = shell.replace(key, '[***]')
        return shell

    # 重载配置
    def CrondReload(self):
        if os.path.exists('/etc/init.d/crond'):
            public.ExecShell('/etc/init.d/crond reload')
        elif os.path.exists('/etc/init.d/cron'):
            public.ExecShell('service cron restart')
        else:
            public.ExecShell("systemctl reload crond")

    # 将Shell脚本写到文件
    def WriteShell(self, config):
        u_file = '/var/spool/cron/crontabs/root'
        file = self.get_cron_file()
        if not os.path.exists(file): public.writeFile(file, '')
        conf = public.readFile(file)
        if type(conf) == bool: return public.returnMsg(False, '读取文件失败!')
        conf += config + "\n"
        if public.writeFile(file, conf):
            if not os.path.exists(u_file):
                public.ExecShell("chmod 600 '" + file + "' && chown root.root " + file)
            else:
                public.ExecShell("chmod 600 '" + file + "' && chown root.crontab " + file)
            return True
        return public.returnMsg(False, '文件写入失败,请检查是否开启系统加固功能!')


    # 立即执行任务
    def StartTask(self, get):
        echo = public.M('crontab').where('id=?', (get.id,)).getField('echo')
        # 检查echo值的类型是否为字符串
        if not isinstance(echo, str):
            # 如果不是字符串，返回一个错误消息
            return public.returnMsg(False, 'echo值类型错误')
        execstr = public.GetConfigValue('setup_path') + '/cron/' + echo
        public.ExecShell('chmod +x ' + execstr)
        public.ExecShell('nohup ' + execstr +' start >> ' + execstr + '.log 2>&1 &')
        print('nohup ' + execstr +' start >> ' + execstr + '.log 2>&1 &')
        return public.returnMsg(True, 'CRONTAB_TASK_EXEC')

    # 获取计划任务文件位置
    def get_cron_file(self):
        u_path = '/var/spool/cron/crontabs'
        u_file = u_path + '/root'
        c_file = '/var/spool/cron/root'
        cron_path = c_file
        if not os.path.exists(u_path):
            cron_path = c_file

        if os.path.exists("/usr/bin/apt-get"):
            cron_path = u_file
        elif os.path.exists('/usr/bin/yum'):
            cron_path = c_file

        if cron_path == u_file:
            if not os.path.exists(u_path):
                os.makedirs(u_path, 472)
                public.ExecShell("chown root:crontab {}".format(u_path))
        if not os.path.exists(cron_path):
            public.writeFile(cron_path, "")
        return cron_path

    def modify_project_log_split(self, cronInfo, get):

        def _test_project_type(self, project_type):
            if project_type == "Node项目":
                return "nodojsModel"
            elif project_type == "Java项目":
                return "javaModel"
            elif project_type == "GO项目":
                return "goModel"
            elif project_type == "其他项目":
                return "otherModel"
            elif project_type == "Python项目":
                return "pythonModel"
            else:
                return None

        def the_init(self, cronInfo, get: dict):
            self.get = get
            self.cronInfo = cronInfo
            self.msg = ""
            self.flag = False
            name = get["name"]
            if name.find("运行日志切割") != -1:
                try:
                    project_type, project_name = name.split("]", 2)[1].split("[", 1)
                    project_type = self._test_project_type(project_type)
                except:
                    self.project_type = None
                    return
            else:
                self.project_type = None
                return

            self.project_type = project_type
            self.project_name = project_name
            conf_path = '{}/data/run_log_split.conf'.format(public.get_panel_path())
            data = json.loads(public.readFile(conf_path))
            self.log_size = int(data[self.project_name]["log_size"]) / 1024 / 1024

        def modify(self):
            from importlib import import_module
            if not self.project_type:
                return False
            if self.cronInfo["type"] != self.get['type']:
                self.msg = "运行日志切割不能修改执行周期的方式"
                return True
            get = public.dict_obj()
            get.name = self.project_name
            get.log_size = self.log_size
            if get.log_size != 0:
                get.hour = "2"
                get.minute = str(self.get['where1'])
            else:
                get.hour = str(self.get['hour'])
                get.minute = str(self.get['minute'])
            get.num = str(self.get["save"])

            model = import_module(".{}".format(self.project_type), package="projectModel")

            res = getattr(model.main(), "mamger_log_split")(get)
            self.msg = res["msg"]
            self.flag = res["status"]

            return True

        attr = {
            "__init__": the_init,
            "_test_project_type": _test_project_type,
            "modify": modify,
        }
        return type("ProjectLog", (object,), attr)(cronInfo, get)

    # 检查指定的url是否通
    def check_url_connecte(self, get):
        end_time = 0
        if 'url' not in get or get['url'] == '':
            return public.returnMsg(False, '请传入url!')
        try:
            start_time = time.time()
            response = requests.get(get.url, timeout=3)
            response.encoding = 'utf-8'
            end_time = time.time()
            if response.status_code == 200:
                return {'status': True, 'status_code': response.status_code,
                        'txt': public.xsssec(response.text),
                        'time': str(int(round(end_time - start_time, 2) * 1000)) + 'ms'}
            else:
                return {'status': False, 'status_code': response.status_code, 'txt': public.xsssec(response.text),
                        'time': str(int(round(end_time - start_time, 2) * 1000)) + 'ms'}
        except requests.exceptions.RequestException:
            return {'status': False, 'status_code': '', 'txt': '访问异常',
                    'time': '0ms'}

    # 获取各个类型数据库
    def GetDatabases(self, get):
        from panelMysql import panelMysql
        db_type = getattr(get, "db_type", "mysql")

        crontab_databases = public.M("crontab").field("id,sName").where("LOWER(type)=LOWER(?)", (db_type)).select()
        for db in crontab_databases:
            db["sName"] = set(db["sName"].split(","))
            # table_list = panelMysql().query("show tables from `{db_name}`;".format(db_name=database["name"]))

        if db_type == "redis":
            database_list = []
            cron_id = None
            for db in crontab_databases:
                if db_type in db["sName"]:
                    cron_id = db["id"]
                    break
            database_list.append({"name": "本地数据库", "ps": "", "cron_id": cron_id})
            return database_list

        databases = public.M("databases").field("name,ps").where("LOWER(type)=LOWER(?)", (db_type)).select()

        for database in databases:
            try:
                if database.get("name") is None: continue
                table_list = panelMysql().query("show tables from `{db_name}`;".format(db_name=database["name"]))
                if not isinstance(table_list, list):
                    continue
                cron_id = public.M("mysql_increment_settings").where("tb_name == ''", ()).getField("cron_id")
                database["table_list"] = [{"tb_name": "所有", "value": "", "cron_id": cron_id if cron_id else None}]
                for tb_name in table_list:
                    cron_id = public.M("mysql_increment_settings").where("tb_name in (?)", (tb_name[0])).getField("cron_id")
                    database["table_list"].append({"tb_name": tb_name[0], "value": tb_name[0], "cron_id": cron_id if cron_id else None})

                database["cron_id"] = []
                for db in crontab_databases:
                    if database["name"] in db["sName"]:
                        database["cron_id"].append(db["id"])
            except Exception as e:
                print(e)
        return databases

    # 取任务日志
    def GetWebShellLogs(self, get):
        id = get['id']
    # 取任务日志
    def GetWebShellLogs(self, get):
        id = get['id']
        echo_result = public.M('crontab').where("id=?", (id,)).field('echo').find()
        # 确保echo_result总是字典形式
        if isinstance(echo_result, list) and echo_result and isinstance(echo_result[0], dict):
            echo = echo_result[0]  # 如果是列表，则取列表的第一个字典元素
        elif isinstance(echo_result, dict):
            echo = echo_result
        else:
            return public.returnMsg(False, "执行任务失败！未找到匹配的任务记录。")

        # 从这一点开始，echo变量将是字典形式，并且包含'echo'键
        if 'echo' in echo:
            logFile = public.GetConfigValue('setup_path') + '/cron/' + echo['echo'] + '.log'
        else:
            return public.returnMsg(False, "执行任务失败！任务记录中缺少'echo'信息。")
        
        if not os.path.exists(logFile): return public.returnMsg(False, 'CRONTAB_TASKLOG_EMPTY')
        logs = public.readFile(logFile)
        logs = public.xsssec(logs)
        logs = logs.split('\n')
        if hasattr(get, 'time_search') and get.time_search != '' and get.time_search != '[]':
            time_logs = []
            time_search = json.loads(get.time_search)
            start_time = int(time_search[0])
            end_time = int(time_search[1])
            for i in range(len(logs) - 1, -1, -1):
                infos = re.findall(r'【(.+?)】', logs[i])
                try:
                    infos_time = time.strptime(infos[0], "%Y-%m-%d %H:%M:%S")
                    infos_time = time.mktime(infos_time)
                    if infos_time > start_time and infos_time < end_time:
                        time_logs.append(logs[i])
                except:
                    pass
            time_logs.reverse()
            logs = time_logs

        if hasattr(get, 'type') and get.type != '':
            if get.type == 'warring':
                warring_logs = []
                for i in range(len(logs)):
                    if '【warring】' in logs[i]:
                        warring_logs.append(logs[i])
                logs = warring_logs

        for i in range(len(logs)):
            if '【warring】' in logs[i]:
                logs[i] = '<span style="background-color:rgba(239, 8, 8, 0.8)">{}</span>'.format(logs[i])
        logs = '\n'.join(logs)
        if logs:
            return public.returnMsg(True, logs)
        else:
            return public.returnMsg(False, 'CRONTAB_TASKLOG_EMPTY')

    def download_logs(self, get):
        try:
            id = int(get['id'])
            echo = public.M('crontab').where("id=?", (id,)).field('echo').find()
            logFile = public.GetConfigValue('setup_path') + '/cron/' + echo['echo'] + '.log'
            if not os.path.exists(logFile): return public.returnMsg(False, 'CRONTAB_TASKLOG_EMPTY')
            logs = public.readFile(logFile)
            logs = logs.split('\n')
            if hasattr(get, 'day') and get.day != '':
                day = int(get.day)
                time_logs = []
                end_time = int(time.time())
                start_time = end_time - day * 86400
                for i in range(len(logs), 0, -1):
                    try:
                        infos = re.findall(r'【(.+?)】', logs[i])
                        infos_time = time.strptime(infos[0], "%Y-%m-%d %H:%M:%S")
                        infos_time = time.mktime(infos_time)
                        if infos_time > start_time and infos_time < end_time:
                            time_logs.append(logs[i])
                        if infos_time < start_time:
                            break
                    except:
                        pass
                time_logs.reverse()
                logs = time_logs
            if hasattr(get, 'type') and get.type != '':
                if get.type == 'warring':
                    warring_logs = []
                    for i in range(len(logs)):
                        if '【warring】' in logs[i]:
                            warring_logs.append(logs[i])
                    logs = warring_logs
            logs = '\n'.join(logs)
            public.writeFile('/tmp/{}.log'.format(echo['echo']), logs)
            return public.returnMsg(True, '/tmp/{}.log'.format(echo['echo']))
        except:
            return public.returnMsg(False, '下载失败！')

    def clear_logs(self, get):
        try:
            id = int(get['id'])
            echo = public.M('crontab').where("id=?", (id,)).field('echo').find()
            logFile = public.GetConfigValue('setup_path') + '/cron/' + echo['echo'] + '.log'
            if not os.path.exists(logFile): return public.returnMsg(False, 'CRONTAB_TASKLOG_EMPTY')
            logs = public.readFile(logFile)
            logs = logs.split('\n')
            if hasattr(get, 'day') and get.day != '':
                day = int(get.day)
                end_time = int(time.time())
                start_time = end_time - day * 86400

                last_idx = len(logs) - 1
                for i in range(len(logs) - 1, -1, -1):
                    info_obj = re.search(r'[【\[](\d+-\d+-\d+\s+\d+:\d+:\d+)[】\]]', logs[i])
                    if info_obj:
                        add_info_time = info_obj.group(1)
                        add_info_time = time.strptime(add_info_time, "%Y-%m-%d %H:%M:%S")
                        add_info_time = time.mktime(add_info_time)
                        if add_info_time < start_time:
                            break
                        last_idx = i
                logs = logs[last_idx:]
            else:
                logs = []
            public.writeFile(logFile, '\n'.join(logs))
            return public.returnMsg(True, '清除成功！')
        except:
            return public.returnMsg(False, '清除失败！')


    def cloud_backup_download(self, get):
        if not hasattr(get, 'filename'):
            return public.returnMsg(False, '请传入filename!')
        if get.filename:
            path = get.filename.split('|')[0]
            if os.path.exists(path):
                return {'status': True, 'is_loacl': True, 'path': path}
        if not hasattr(get, 'cron_id'):
            return public.returnMsg(False, '请传入cron_id!')
        if "|" not in get.filename:
            return public.returnMsg(False, '文件不存在！')
        cron_data = public.M('crontab').where('id=?', (get.cron_id,)).field('sType,sName,db_type').find()
        cloud_name = get.filename.split('|')[1]
        file_name = get.filename.split('|')[-1]

        if isinstance(cron_data, dict):
            names = cron_data['sName'].split(',')
        else:
            return public.returnMsg(False, 'cron_data类型错误，不是字典')  
              
        if names == ['ALL']:
            table = ''
            if cron_data['sType'] == 'site':
                table = 'sites'
            if cron_data['sType'] == 'database':
                table = 'databases'
            if not table:
                return public.returnMsg(False, '数据错误！')
            names = public.M(table).field('name').select()
            names = [i.get('name') for i in names]
        names = [i for i in list(names) if i in file_name]
        if not names:
            return public.returnMsg(False, '未找到对应的文件，请手动去云存储下载')
        if names:
            name = names[-1]
        else:
            return public.returnMsg(False,'查询文件对应的数据库或者网站名称时出错！')
        import CloudStoraUpload
        c = CloudStoraUpload.CloudStoraUpload()
        c.run(cloud_name)
        if c.obj is None:
            return public.returnMsg(False, '云存储对象未正确初始化！')
        url = ''
        backup_path = c.obj.backup_path
        if cron_data['sType'] == 'site':
            path = os.path.join(backup_path, 'site', name)
            data = c.obj.get_list(path)
            for i in data['list']:
                if i['name'] == file_name:
                    url = i['download']

            if not url:
                path = os.path.join(backup_path, 'site')
                data = c.obj.get_list(path)
                for i in data['list']:
                    if i['name'] == file_name:
                        url = i['download']
                        break
        elif cron_data['sType'] == 'database':
            path = os.path.join(backup_path, 'database', cron_data['db_type'], name)
            data = c.obj.get_list(path)
            for i in data['list']:
                if i['name'] == file_name:
                    url = i['download']
                    break
            if not url:
                path = os.path.join(backup_path, 'database')
                data = c.obj.get_list(path)
                for i in data['list']:
                    if i['name'] == file_name:
                        url = i['download']
                        break
        elif cron_data['sType'] == 'path':
            path = os.path.join(backup_path, 'path', file_name.split('_')[1])
            data = c.obj.get_list(path)
            for i in data['list']:
                if i['name'] == file_name:
                    url = i['download']
                    break
        if url == '':
            return public.returnMsg(False, '在云存储中未发现该文件!')
        return {'status': True, 'is_loacl': False, 'path': url}

    def get_crontab_types(self, get):
        data = public.M("crontab_types").field("id,name,ps").order("id asc").select()
        return {'status': True, 'msg': data}

    def add_crontab_type(self, get):
        # get.name =  html.escape(get.name.strip())
        get.name = public.xsssec(get.name.strip())
        if re.search('<.*?>', get.name):
            return public.returnMsg(False, "分类名称不能包含HTML语句")
        if not get.name:
            return public.returnMsg(False, "分类名称不能为空")
        if len(get.name) > 16:
            return public.returnMsg(False, "分类名称长度不能超过16位")

        crontab_type_sql = public.M('crontab_types')

        if get.name in {"Shell脚本", "备份网站", "备份数据库", "数据库增量备份", "日志切割", "备份目录", "木马查杀", "同步时间", "释放内存", "访问URL", "系统任务"}:
            return public.returnMsg(False, "指定分类名称已存在")

        if crontab_type_sql.where('name=?', (get.name,)).count() > 0:
            return public.returnMsg(False, "指定分类名称已存在")

        # 添加新的计划任务分类
        crontab_type_sql.add("name", (get.name,))

        return public.returnMsg(True, '添加成功')

    def remove_crontab_type(self, get):
        crontab_type_sql = public.M('crontab_types')
        crontab_sql = public.M('crontab')
        crontab_type_id = get.id

        if crontab_type_sql.where('id=?', (crontab_type_id,)).count() == 0:
            return public.returnMsg(False, "指定分类不存在")

        name = crontab_type_sql.where('id=?', (crontab_type_id,)).field('name').find().get('name', '')
        # if name in {"toShell", "site", "database", "enterpriseBackup", "logs", "path", "webshel", "syncTime", "rememory", "toUrl", "系统任务"}:
        #     return public.returnMsg(False, "这是默认类型，无法删除")

        # 删除指定的计划任务分类
        crontab_type_sql.where('id=?', (crontab_type_id,)).delete()

        # 找到 crontab 表中的相关数据，并设置其 sType 和 type_id 字段为空
        crontab_sql.where('type_id=?', (crontab_type_id,)).save('type_id', (''))

        return public.returnMsg(True, "分类已删除")

    def modify_crontab_type_name(self, get):
        get.name = public.xsssec(get.name.strip())
        # get.name =  html.escape(get.name.strip())
        if re.search('<.*?>', get.name):
            return public.returnMsg(False, "分类名称不能包含HTML语句")
        if not get.name:
            return public.returnMsg(False, "分类名称不能为空")
        if len(get.name) > 16:
            return public.returnMsg(False, "分类名称长度不能超过16位")

        crontab_type_sql = public.M('crontab_types')
        crontab_type_id = get.id

        if crontab_type_sql.where('id=?', (crontab_type_id,)).count() == 0:
            return public.returnMsg(False, "指定分类不存在")

        if get.name in {"Shell脚本", "备份网站", "备份数据库", "数据库增量备份", "日志切割", "备份目录", "木马查杀", "同步时间", "释放内存", "访问URL", "系统任务"}:
            return public.returnMsg(False, "名字不能修改为系统默认的任务分类名")

        if crontab_type_sql.where('name=? AND id!=?', (get.name, crontab_type_id)).count() > 0:
            return public.returnMsg(False, "指定分类名称已存在")

        # 修改指定的计划任务分类名称
        crontab_type_sql.where('id=?', (crontab_type_id,)).setField('name', get.name)

        return public.returnMsg(True, "修改成功")

    def set_crontab_type(self, get):
        try:
            crontab_ids = json.loads(get.crontab_ids)
            crontab_sql = public.M("crontab")
            crontab_type_sql = public.M("crontab_types")

            # sType= public.M('crontab_types').where('id=?', (get['type_id'],)).field('name').find().get('name', '')
            crontab_type_id = get.id
            if crontab_type_id=="-1" or crontab_type_id=="0":
                return public.returnMsg(False,"不能设置为系统分类或者默认分类!")
            if crontab_type_sql.where('id=?', (crontab_type_id,)).count() == 0:
                return public.returnMsg(False, "指定分类不存在")
            for s_id in crontab_ids:
                crontab_sql.where("id=?", (s_id,)).save('type_id', (crontab_type_id))

            return public.returnMsg(True, "设置成功!")
        except Exception as e:
            return public.returnMsg(False, "设置失败" + str(e))

    def export_crontab_to_json(self, get):
        # cront = public.M('crontab').order("id desc").field(self.field).select()
        try:

            # 假设 crontab_data 是从数据库中获取的计划任务数据
            crontab_data = public.M('crontab').order("id asc").field(self.field).select()
            # 遍历 crontab_data 列表
            for task in crontab_data:
                # 将每个任务的 type_id 字段设置为空
                task['type_id'] = ""

            # 将数据转换为 JSON 格式
            json_data = json.dumps(crontab_data)

            # 将 JSON 数据写入文件
            with open('/tmp/计划任务数据.json', 'w') as f:
                f.write(json_data)
            server_url = request.url_root  # 获取服务器地址
            download_url = f"{server_url}download?filename=/tmp/计划任务数据.json"
            return public.returnMsg(True, "导出成功!,下载路径为" + download_url)
        except Exception as e:
            return public.ReturnMsg(False, "导入失败：" + str(e))

    def import_crontab_from_json(self, get):
        try:
            file = request.files['file']
            overwrite = get.overwrite
            if file:
                json_data = file.read().decode('utf-8')

                try:
                    crontab_data = json.loads(json_data)
                except ValueError as e:
                    return public.returnMsg(False, "无法解析的JSON文件！")

                # 检查数据是否是可迭代的
                if not isinstance(crontab_data, list):
                    return public.returnMsg(False, "选择json文件内容不正确！")

                # 检查数据是否为crontab的数据
                required_keys = ['id', 'name', 'type', 'where1', 'where_hour', 'where_minute', 'echo', 'addtime', 'status', 'save', 'backupTo', 'sName', 'sBody', 'sType', 'urladdress', 'save_local',
                                 'notice', 'notice_channel']
                for task in crontab_data:
                    if not all(key in task for key in required_keys):
                        return public.returnMsg(False, "数据不是crontab的数据内容，请选择正确的导入文件!")

                # 如果 overwrite 为 "1"，则删除所有数据
                if overwrite == "1":
                    # public.M('crontab').delete()

                    # 初始化计数器
                    successful_imports = 0

                    # 遍历 crontab_data 列表
                    failed_tasks = []
                    for task in crontab_data:
                        # 使用AddCrontab函数将任务添加到表中
                        task.pop('id', None)
                        cronName = self.GetShell(task)
                        task['echo'] = cronName
                        columns = ",".join(task.keys())
                        values = tuple(task.values())

                        # # 检查数据库中是否已经存在相同的任务
                        # existing_task = public.M('crontab').where("rname=?", task['rname']).field('rname').select()
                        # if existing_task:
                        #     continue  # 如果任务已存在，跳过插入操作

                        addData = public.M('crontab').add(columns, values)
                        if type(addData) == str:
                            failed_tasks.append({task['name']: addData})
                            continue

                        # 如果任务成功添加，增加计数器
                        successful_imports += 1

                        # 检查是否有database类型的任务
                        if task['sType'] == 'database':
                            if not public.M('databases').where("LOWER(type)=?", task['db_type'].lower()).field('name,ps').select():
                                failed_tasks.append({task['name']: '没有找到对应的数据库类型'})

                        if task['backupTo'] != "localhost" and task['sType'] == 'site':
                            cloud_storage_providers = {
                                "qiniu": "七牛云存储",
                                "aliyun": "阿里云OSS",
                                "ftp": "FTP存储空间",
                                "bos": "百度云",
                                "cos": "腾讯云",
                                "upyun": "又拍云",
                                "alioss": "阿里云",
                                "aws_s3": "亚马逊",
                                "obs": "华为云",
                                "jdcloud": "京东云",

                            }

                            data = self.GetDataList({'type': 'orderOpt'})

                            if not any(lib['value'] == task['backupTo'] for lib in data['orderOpt']):
                                failed_tasks.append({task['name']: f"没有安装{cloud_storage_providers[task['backupTo']]}"})

                        if task['sType'] == 'path':
                            if not os.path.exists(task['sName']):
                                failed_tasks.append({task['name']: f"没有目录{task['sName']}"})

                    if failed_tasks:
                        failed_tasks_str = '；'.join(f"{idx + 1}.{task_name}: {error}" for idx, task in enumerate(failed_tasks) for task_name, error in task.items())
                        return public.returnMsg(True, f"成功导入{successful_imports}条计划任务，但以下任务无法执行：{failed_tasks_str}")
                    else:
                        # if successful_imports==0:
                        #    return public.returnMsg(True, f"计划任务成功导入{successful_imports}条计划任务!")
                        # else:
                        return public.returnMsg(True, f"计划任务成功导入{successful_imports}条计划任务，所有任务都可以执行！")


            else:
                return public.returnMsg(False, "请选择导入文件!")
        except Exception as e:
            return public.ReturnMsg(False, "导入失败！")

    def stop_cron_task(self, cronPath, cronName, if_stop):
        cronFile = f'{cronPath}/{cronName}.pl'
        if if_stop == "True":
            if os.path.exists(cronFile):
                # 读取文件内容，获取 PID
                with open(cronFile, 'r') as file:
                    pid = file.read().strip()
                os.system(f'kill -9 {pid}')
                os.remove(cronFile)
                print(f'{cronFile} 删除成功。')

    def set_atuo_start_syssafe(self, get):
        try:
            if not hasattr(get, 'time'):
                return public.returnMsg(False, "请传入time参数！")
            time = int(get.time)
            public.ExecShell('/etc/init.d/bt_syssafe stop')
            data = {
                'type': 2,
                'time': time,
                'name': 'syssafe',
                'title': '宝塔系统加固',
                'fun': 'set_open',
                'args': {
                    'status': 1
                }
            }
            public.set_tasks_run(data)
            return public.returnMsg(True, "临时关闭系统加固成功！")
        except Exception as e:
            public.ExecShell('/etc/init.d/bt_syssafe start')
            return public.returnMsg(False, "临时关闭系统加固失败！" + str(e))

    def set_atuo_start_syssafe(self, get):
        try:
            if not hasattr(get, 'time'):
                return public.returnMsg(False, "请传入time参数！")
            time = int(get.time)
            public.ExecShell('/etc/init.d/bt_syssafe stop')
            data = {
                'type': 2,
                'time': time,
                'name': 'syssafe',
                'title': '宝塔系统加固',
                'fun': 'set_open',
                'args': {
                    'status': 1
                }

            }
            public.set_tasks_run(data)
            return public.returnMsg(True, "临时关闭系统加固成功！")
        except Exception as e:
            return public.returnMsg(False, "临时关闭系统加固失败！" + str(e))

    def set_rotate_log(self, get):
        try:
            p = crontab()
            task_name = '[勿删]切割计划任务日志'
            status = get.status
            numbers = get.numbers

            public.M('crontab').where('name=?', (task_name,)).setField('status', status)
            public.M('crontab').where('name=?', (task_name,)).setField('save', numbers)
            # public.M('crontab').where('name=?', (task_name,)).setField('sBody', sBody)
            if get.status == "1":

                return public.returnMsg(True, "开启日志切割成功")
            else:
                return public.returnMsg(True, "关闭日志切割成功")
            # print("开启日志切割成功")
        except Exception as e:
            return public.returnMsg(False, "开启日志切割失败" + str(e))
            # print("开启日志切割失败 ")

    def get_rotate_log_config(self, get):
        try:
            p = crontab()
            task_name = '[勿删]切割计划任务日志'

            if public.M('crontab').where('name=?', (task_name,)).count() == 0:
                task = {
                    "name": task_name,
                    "type": "day-n",
                    "where1": "1",
                    "hour": "0",
                    "minute": "0",
                    "week": "",
                    "sType": "toShell",
                    "sName": "",
                    "backupTo": "",
                    "save": "10",
                    "sBody": "btpython /www/server/panel/script/rotate_log.py 10",
                    "urladdress": "",
                    "status": "1"
                }
                p.AddCrontab(task)
            crontab_data = public.M('crontab').where('name=?', (task_name,)).select()[0]
            status = crontab_data['status']
            numbers = crontab_data['save']
            info = {"status": status, "numbers": numbers}
            return public.returnMsg(True, info)
        except Exception as e:
            return public.returnMsg(False, "获取失败" + str(e))

    def get_restart_project_config(self, get):
        try:
            # import sys
            # sys.path.append("..")  # 添加上一级目录到系统路径
            # import crontab
            # import public
            model_name=get.model_name
            project_name=get.project_name
            task_name = '[勿删]定时重启{}项目{}'.format(model_name,project_name)
            sBody='btpython /www/server/panel/script/restart_project.py {} {}'.format(model_name,project_name)
            public.M('crontab').where('name=?', (task_name,)).select()
            if public.M('crontab').where('name=?', (task_name,)).count() == 0:
                task = {
                    "name": task_name,
                    "type": "day",
                    "where1":"" ,
                    "hour": "0",
                    "minute":"0",
                    "week": "",
                    "sType": "toShell",
                    "sName": "",
                    "backupTo": "",
                    "save": "10",
                    "sBody": sBody,
                    "urladdress": "",
                    "status":"0"
                }
                crontab().AddCrontab(task)
                public.M('crontab').where('name=?', (task_name,)).setField('status', 0)
            crontab_data_list = public.M('crontab').where('name=?', (task_name,)).select()
            if crontab_data_list:
                crontab_data = crontab_data_list[0]
                status = crontab_data['status']
                return public.returnMsg(True, crontab_data)
            else:
                return public.returnMsg(False, "创建计划任务{}失败，请检查是否开启系统加固或者磁盘情况".format(task_name))
        except Exception as e:
            return public.returnMsg(False, "获取失败"+str(e))
    
    def set_restart_project(self,get):
        try:
            status=get.status
            hour = get.get('hour', 0)
            minute = get.get('minute', 0)
            model_name=get.model_name
            project_name=get.project_name
            task_name = '[勿删]定时重启{}项目{}'.format(model_name,project_name)

            crontab_data_list = public.M('crontab').where('name=?', (task_name,)).select()
            if crontab_data_list:
                public.M('crontab').where('name=?', (task_name,)).setField('status', status)
                public.M('crontab').where('name=?', (task_name,)).setField('where_hour', hour)
                public.M('crontab').where('name=?', (task_name,)).setField('where_minute', minute)
                if  get.status=="1":
                        return public.returnMsg(True, "开启成功")
                else:
                    return public.returnMsg(True, "关闭成功")
            else:
                return public.returnMsg(False, "创建计划任务{}失败,请检查是否开启系统加固或者磁盘情况".format(task_name))

        except Exception as e:
            return public.returnMsg(False, "开启失败"+str(e))


    def modify_values(self, cronName, new_time_type, new_special_time, new_time_list):
        cronName = cronName 
        cronPath = '/www/server/cron'  
        cronFile = '{}/{}'.format(cronPath, cronName)
        # 打开文件
        with open(cronFile, 'r') as file:
            # 读取文件内容
            lines = file.readlines()

        # 进行你的修改
        for i, line in enumerate(lines):
            if "btpython /www/server/panel/script/time_check.py" in line:
                lines[i] = 'if ! btpython /www/server/panel/script/time_check.py time_type={} special_time={} time_list={}; then\n'.format(new_time_type, new_special_time, new_time_list)

        # 保存修改
        with open(cronFile, 'w') as file:
            file.writelines(lines)

    def set_execute_script(self, get):

        # get._ws.send(public.getJson({
        #     "result": False,
        # }))
        if '_ws' not in get:
            return False

        public.ExecShell("chmod +x /www/server/panel/script/check_crontab.sh")
        # 使用nohup运行脚本，并将输出重定向到/www/test.txt，同时确保命令在后台运行
        exec_result=public.ExecShell("nohup /www/server/panel/script/check_crontab.sh > /www/check_crontab.txt 2>&1 &")
        if exec_result:  # 假设ExecShell返回的第一个元素是成功与否的标志
            # 以只读模式打开日志文件，并移动到文件末尾
            if not os.path.exists("/www/check_crontab.txt"):
                public.writeFile("/www/check_crontab.txt", "")
            with open("/www/check_crontab.txt", "r") as log_file:
                while True:
                    # 读取新的一行
                    line = log_file.readline()
                    if not line:
                        time.sleep(1)  # 如果没有新内容，则稍等片刻再尝试读取
                        continue
                    # 发送新读取的行
                    # print(line.strip())
                    get._ws.send(public.getJson({
                    "callback":"set_execute_script",
                    "result":line.strip()

                    }))
                    # get._ws.send(line.strip())  # 使用strip()移除行尾的换行符
                    if line.strip()=="successful":
                        break
            return True
        else:
            get._ws.send("脚本执行失败")
            return False
