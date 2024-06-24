#coding: utf-8
#-------------------------------------------------------------------
# 宝塔Linux面板
#-------------------------------------------------------------------
# Copyright (c) 2015-2099 宝塔软件(http://bt.cn) All rights reserved.
#-------------------------------------------------------------------
# Author: hwliang <hwl@bt.cn>
#-------------------------------------------------------------------

#------------------------------
# 任务编排
#------------------------------
import db
import public
import time
import json
import os
import sys
from crontabModel.base import crontabBase
class main(crontabBase):

    _log_type = '任务编排-任务'
    _operator = ['=','!=','>','>=','<','<=','in','not in']
    _exec_script_file = 'script/crontab_task_exec.py'
    _exec_log_file = 'logs/crontab_task_exec.log'

    def __init__(self) -> None:
        super().__init__()
        self._sql = db.Sql().dbfile(self.dbfile)

    def get_trigger_list(self,args = None):
        '''
            @name 获取任务列表
            @author hwliang
            @param args<dict_obj>{
                p<int> 分页
                rows<int> 每页数量
                search<string> 搜索关键字
            }
            @return list
        '''
        p = 1
        if args and 'p' in args: p = int(args.p)
        rows = 10
        if args and 'rows' in args: rows = int(args.rows)
        search = ''
        if args and 'search' in args: search = args.search
        tojs = ''
        if args and 'tojs' in args: tojs = args.tojs
        where = ''
        params = []
        if search:
            where = "name like ? or ps like ?"
            params.append('%' + search + '%')
            params.append('%' + search + '%')

        if 'script_id' in args:
            where = "script_id = ?"
            params.append(args.script_id)

        if 'status' in args:
            where = "status = ?"
            params.append(args.status)

        count = self._sql.table('trigger').where(where,tuple(params)).count()
        data = public.get_page(count,p,rows,tojs)
        data['data'] = self._sql.table('trigger').where(where,tuple(params)).order('trigger_id desc').limit(data['row'],data['shift']).select()
        for i in data['data']:
            i['operator_where'] = self._sql.table('operator_where').where('trigger_id=?',i['trigger_id']).select()
            i['return_type'] = 'all'
            i['script_info'] = {}
            if not i['args']: i['args'] = ''
            if i['script_id']:
                i['script_info'] = self._sql.table('scripts').where('script_id=?',(i['script_id'],)).find()
                if i['script_info']:
                    i['return_type'] = i['script_info']['return_type']
                else:
                    i['script_info'] = {}
                if not i['return_type']: i['return_type'] = 'all'

            # 取上次执行时间
            i['last_exec_time'] = self._sql.table('tasks').where('trigger_id=?',(i['trigger_id'],)).order('log_id desc').getField('start_time')
        return data

    def sync_crontab(self,trigger_id):
        '''
            @name 同步到计划任务
            @param trigger_id<int> 任务ID
            @return dict
        '''
        trigger_info = self._sql.table('trigger').where('trigger_id=?',(trigger_id,)).find()
        if not trigger_info:
            return public.returnMsg(False,'任务不存在')

        import crontab
        crontab_obj = crontab.crontab()
        trigger_info['type'] = trigger_info['cycle_type']
        trigger_info['hour'] = trigger_info['cycle_hour']
        trigger_info['minute'] = trigger_info['cycle_minute']
        trigger_info['week'] = trigger_info['cycle_where']
        trigger_info['where1'] = trigger_info['cycle_where']
        cron_config,param,name = crontab_obj.GetCrondCycle(trigger_info)
        panel_path = public.get_panel_path()
        cron_line = "{} {} {}/{} {} >> {}/{}".format(cron_config,public.get_python_bin(),panel_path,self._exec_script_file,trigger_id,panel_path,self._exec_log_file)
        cron_file = crontab_obj.get_cron_file()
        if not os.path.exists(cron_file):
            public.writeFile(cron_file,'')
        cron_body = public.readFile(cron_file)
        cron_lines = cron_body.strip().split('\n')
        cron_lines.append(cron_line)
        cron_body = '\n'.join(cron_lines)
        cron_body += '\n'
        result = public.writeFile(cron_file, cron_body)
        if not result: return False
        crontab_obj.CrondReload()
        return True


    def remove_crontab(self,trigger_id):
        '''
            @name 移除计划任务
            @param trigger_id<int> 任务ID
            @return dict
        '''
        import crontab
        crontab_obj = crontab.crontab()
        cron_file = crontab_obj.get_cron_file()
        if not os.path.exists(cron_file):
            return

        cron_body = public.readFile(cron_file)
        cron_lines = cron_body.strip().split('\n')
        cron_lines_new = []
        tip_line = '{} {} >>'.format(self._exec_script_file,trigger_id)

        for cron_line in cron_lines:
            if not cron_line: continue
            if cron_line.find(tip_line) == -1:
                cron_lines_new.append(cron_line)

        cron_body = '\n'.join(cron_lines_new)
        cron_body += '\n'
        public.writeFile(cron_file,cron_body)
        crontab_obj.CrondReload()
        return True




    def get_trigger_info(self,args = None):
        '''
            @name 获取任务信息
            @author hwliang
            @param args<dict_obj>{
                trigger_id<int> 任务ID
            }
            @return dict
        '''
        if not args or not 'trigger_id' in args:
            return public.returnMsg(False,'参数错误')
        trigger_id = int(args.trigger_id)
        trigger_info = self._sql.table('trigger').where('trigger_id=?',(trigger_id,)).find()
        if not trigger_info:
            return public.returnMsg(False,'任务不存在')

        trigger_info['operator_where'] = self._sql.table('operator_where').where('trigger_id=?',trigger_info['trigger_id']).select()
        return public.returnMsg(True,trigger_info)


    def create_trigger(self,args = None):
        '''
            @name 添加任务信息
            @author hwliang
            @param args<dict_obj>{
                name<string> 任务名称
                script_id<int> 脚本ID
                ps<string> 备注
                script_body<string> 脚本内容
                cycle_type<string> 任务类型
                cycle_where<string> 任务条件
                cycle_hour<string> 小时
                cycle_minute<string> 运行分钟
                operator_where<list>{
                    operator<string> 操作符
                    op_value<string> 值
                    run_script_id<int> 运行脚本ID
                    run_script<string> 运行脚本内容
                }
            }
            @return dict
        '''
        if not args or not hasattr(args,'name') or not hasattr(args,'script_id'):
            return public.returnMsg(False,'参数错误')
        if not args.name:
            return public.returnMsg(False,'任务名称不能为空')

        if not args.script_id and not args.script_body:
            return public.returnMsg(False,'脚本内容和脚本ID不能同时为空')
        if not args.cycle_type:
            return public.returnMsg(False,'任务类型不能为空')
        script_args = args.get('args','')

        #检查脚本是否存在
        if args.script_id:
            script_info = self._sql.table('scripts').where('script_id=?',(args.script_id,)).find()
            if not script_info:
                return public.returnMsg(False,'脚本不存在')
            if 'is_args' in script_info and script_info['is_args'] == 1 and not script_args:
                return public.returnMsg(False,'该脚本需要脚本参数')

        #检查任务是否存在
        if self._sql.table('trigger').where('name=?',(args.name,)).count():
            return public.returnMsg(False,'任务已存在')


        pdata = {
            'name':args.name,
            'script_id':args.script_id,
            'ps':args.ps,
            'script_body':args.script_body,
            'args':script_args,
            'cycle_type':args.cycle_type,
            'cycle_where':args.cycle_where,
            'cycle_hour':args.cycle_hour,
            'cycle_minute':args.cycle_minute,
            'create_time': int(time.time())
        }

        trigger_id = self._sql.table('trigger').insert(pdata)

        if not trigger_id:
            return public.returnMsg(False,'添加失败')

        result = self.sync_crontab(trigger_id)
        if not result:
            self._sql.table('trigger').where('trigger_id=?', trigger_id).delete()
            return public.returnMsg(False, '写入计划任务失败,请检查磁盘是否可写或是否开启了系统加固!')

        #增加任务条件
        operator_where = args.operator_where
        for op in operator_where:
            op['trigger_id'] = trigger_id
            op['create_time'] = int(time.time())
            self._sql.table('operator_where').insert(op)

        public.set_module_logs('crontab_trigger', 'create_trigger', 1)
        public.WriteLog(self._log_type,'添加任务【%s】成功!' % args.name)
        return public.returnMsg(True,'添加成功')


    def modify_trigger(self,args = None):
        '''
            @name 修改任务信息
            @author hwliang
            @param args<dict_obj>{
                trigger_id<int> 任务ID
                name<string> 任务名称
                script_id<int> 脚本ID
                ps<string> 备注
                script_body<string> 脚本内容
                cycle_type<string> 任务类型
                cycle_where<string> 任务条件
                cycle_hour<string> 小时
                cycle_minute<string> 运行分钟
                operator_where<list>{
                    operator<string> 操作符
                    op_value<string> 值
                    run_script_id<int> 运行脚本ID
                    run_script<string> 运行脚本内容
                }
            }
            @return dict
        '''
        if not args or not hasattr(args,'name') or not hasattr(args,'script_id'):
            return public.returnMsg(False,'参数错误')
        if not args.name:
            return public.returnMsg(False,'任务名称不能为空')

        if not args.script_id and not args.script_body:
            return public.returnMsg(False,'脚本内容和脚本ID不能同时为空')
        if not args.cycle_type:
            return public.returnMsg(False,'任务类型不能为空')
        script_args = args.get('args','')
        #检查脚本是否存在
        if args.script_id:
            script_info = self._sql.table('scripts').where('script_id=?',(args.script_id,)).find()
            if not script_info:
                return public.returnMsg(False,'脚本不存在')
            if 'is_args' in script_info and script_info['is_args'] and not script_args:
                return public.returnMsg(False,'该脚本需要脚本参数')

        #检查任务是否存在
        trigger_info = self._sql.table('trigger').where('trigger_id=?',(args.trigger_id,)).find()
        if not trigger_info:
            return public.returnMsg(False,'任务不存在')

        #检查任务是否存在
        if self._sql.table('trigger').where('name=? and trigger_id!=?',(args.name,args.trigger_id)).count():
            return public.returnMsg(False,'任务已存在')


        pdata = {
            'name':args.name,
            'script_id':args.script_id,
            'ps':args.ps,
            'script_body':args.script_body,
            'args':script_args,
            'cycle_type':args.cycle_type,
            'cycle_where':args.cycle_where,
            'cycle_hour':args.cycle_hour,
            'cycle_minute':args.cycle_minute
        }

        self._sql.table('trigger').where('trigger_id=?',(args.trigger_id,)).update(pdata)

        # #删除任务条件
        # self._sql.table('operator_where').where('trigger_id=?',(args.trigger_id,)).delete()

        #增加任务条件
        operator_where = args.operator_where
        for op in operator_where:
            op['trigger_id'] = args.trigger_id
            op['create_time'] = int(time.time())
            self._sql.table('operator_where').insert(op)
        self.remove_crontab(args.trigger_id)
        result = self.sync_crontab(args.trigger_id)
        if not result:
            return public.returnMsg(False, '写入计划任务失败,请检查磁盘是否可写或是否开启了系统加固!')

        # 更新数据库中的任务
        self._sql.table('trigger').where('trigger_id=?', (args.trigger_id,)).update(pdata)

        public.WriteLog(self._log_type,'修改任务【%s】成功!' % args.name)
        return public.returnMsg(True,'修改成功')


    def remove_trigger(self,args = None):
        '''
            @name 删除任务信息
            @author hwliang
            @param args<dict_obj>{
                trigger_id<int> 任务ID
            }
            @return dict
        '''
        if not args or not 'trigger_id' in args:
            return public.returnMsg(False,'参数错误')

        trigger_info = self._sql.table('trigger').where('trigger_id=?',(args.trigger_id,)).find()
        if not trigger_info:
            return public.returnMsg(False,'任务不存在')

        self._sql.table('trigger').where('trigger_id=?',(args.trigger_id,)).delete()
        self._sql.table('operator_where').where('trigger_id=?',(args.trigger_id,)).delete()
        self._sql.table("tasks").where('trigger_id=? AND script_id=0',(args.trigger_id,)).delete()
        self.remove_crontab(args.trigger_id)
        public.WriteLog(self._log_type,'删除任务【%s】成功!' % trigger_info['name'])
        return public.returnMsg(True,'删除成功')


    def get_operator_where_list(self,args):
        '''
            @name 获取触发事件列表
            @author hwliang
            @param args<dict_obj>{
                trigger_id:<int>
            }
            @return list
        '''
        trigger_id = args.get('trigger_id',0)
        if not trigger_id: return public.returnMsg(False,"任务ID不能为空")
        data = self._sql.table('operator_where').where('trigger_id=?',trigger_id).select()
        for d in data:
            d['script_info'] = {}
            if d['run_script_id']:
                d['script_info'] = self._sql.table('scripts').where('script_id=?',(d['run_script_id'],)).find()
                if not d['script_info']: d['script_info'] = {}
            if not d['args']: d['args'] = ''
        return data

    def create_operator_where(self,args):
        '''
            @name 创建触发事件
            @author hwliang
            @param args<dict_obj>{
                "trigger_id":<int>,  任务ID
                "operator":<string>, 运算符，支持： =,!=,>,>=,<,<=,in,not in
                "op_value":<mixed>, 比较值，如果运算符为in,not in 时，此处应当为string类型的数据； 运算符为=,!=时，可以是string/int/float类型的数据；运算符为>,>=,<,<=时，此处应当为: int/float类型的数据
                "run_script_id":<int>,  触发成功后运行的脚本ID，此参数与run_script互斥
                "run_script":<string> 触发触功后运行的脚本内容，仅支持bash脚本，此参数与run_script_id互斥
            }
            @return dict
        '''
        op = {}
        op['trigger_id'] = int(args.get('trigger_id',0))
        op['operator'] = args.get('operator','=')
        op['op_value'] = args.get('op_value','')
        op['run_script_id'] = int(args.get('run_script_id',0))
        op['run_script'] = args.get('run_script','')
        op['args'] = args.get('args','')
        if not op['run_script_id'] and not op['run_script']:
            return public.returnMsg(False,'run_script_id和run_script至少需要一个有效值')

        if not op['operator'] in self._operator:
            return public.returnMsg(False,'请使用以下运算符之一：{}'.format(self._operator))

        trigger_info = self._sql.table('trigger').where('trigger_id=?',(op['trigger_id'],)).find()
        if not trigger_info:
            return public.returnMsg(False,'指定任务不存在')

        if op['run_script_id']:
            script_info = self._sql.table('scripts').where('script_id=?',(op['run_script_id'],)).find()
            if not script_info:
                return public.returnMsg(False,'指定脚本不存在')
            if 'is_args' in script_info and script_info['is_args'] and not op['args']:
                return public.returnMsg(False,'脚本需要参数，请填写参数')


        op['create_time'] = int(time.time())
        if not self._sql.table('operator_where').insert(op):
            return public.returnMsg(False,'添加触发事件失败')

        public.WriteLog(self._log_type,"为任务[{}]添加了一个新事件".format(trigger_info['name']))
        return public.returnMsg(True,'添加成功')


    def modify_operator_where(self,args):
        '''
            @name 修改触发事件
            @author hwliang
            @param args<dict_obj>{
                "where_id": <int> 事件ID
                "operator":<string>, 运算符，支持： =,!=,>,>=,<,<=,in,not in
                "op_value":<mixed>, 比较值，如果运算符为in,not in 时，此处应当为string类型的数据； 运算符为=,!=时，可以是string/int/float类型的数据；运算符为>,>=,<,<=时，此处应当为: int/float类型的数据
                "run_script_id":<int>,  触发成功后运行的脚本ID，此参数与run_script互斥
                "run_script":<string> 触发触功后运行的脚本内容，仅支持bash脚本，此参数与run_script_id互斥
            }
            @return dict
        '''
        op = {}
        op['where_id'] = int(args.get('where_id',0))
        op['operator'] = args.get('operator','=')
        op['op_value'] = args.get('op_value','')
        op['run_script_id'] = args.get('run_script_id',0)
        op['run_script'] = args.get('run_script','')
        op['args'] = args.get('args','')
        if not op['where_id']:
            return public.returnMsg(False,'事件ID不能为空')

        if not op['operator'] in self._operator:
            return public.returnMsg(False,'请使用以下运算符之一：{}'.format(self._operator))

        where_info = self._sql.table('operator_where').where('where_id=?',(op['where_id'],)).find()
        if not where_info:
            return public.returnMsg(False,'指定事件不存在')

        if not op['run_script_id'] and not op['run_script']:
            return public.returnMsg(False,'run_script_id和run_script至少需要一个有效值')

        if op['run_script_id']:
            script_info = self._sql.table('scripts').where('script_id=?',(op['run_script_id'],)).find()
            if not script_info:
                return public.returnMsg(False,'指定脚本不存在')
            if 'is_args' in script_info and script_info['is_args'] and not op['args']:
                return public.returnMsg(False,'脚本需要参数，请填写参数')

        if not self._sql.table('operator_where').where('where_id=?',op['where_id']).update(op):
            return public.returnMsg(False,'修改事件成功')

        public.WriteLog(self._log_type,"修改事件: ".format(op['where_id']))
        return public.returnMsg(True,'修改成功')


    def remove_operator_where(self,args):
        '''
            @name 删除指定事件
            @author hwliang
            @param args<dict_obj>{
                "where_id": <int> 事件ID
            }
            @return dict
        '''
        where_id = int(args.get('where_id',0))
        if not where_id: return public.returnMsg(False,'事件ID不能为空')
        where_info = self._sql.table('operator_where').where('where_id=?',(where_id,)).find()
        if not where_info:
            return public.returnMsg(False,'指定事件不存在')

        if not self._sql.table('operator_where').where('where_id=?',where_id).delete():
            return public.returnMsg(False,'事件删除失败')

        public.WriteLog(self._log_type,"删除事件: ".format(where_id))
        return public.returnMsg(True,'删除成功')



    def exec_script(self,script_id,script_body,s_args):
        '''
            @name 执行脚本内容
            @param script_id<int> 脚本ID
            @param script_body<string> 脚本内容
            @return dict
        '''
        script_type = 'bash'
        script_exts = {'bash':'sh','python':'py','php':'php','node':'js','ruby':'rb','perl':'pl'}
        if script_id:
            script_info = self._sql.table('scripts').where('script_id=?',(script_id,)).find()
            if not script_info:
                return False
            script_body = script_info['script']
            script_type = script_info['script_type']

        if not script_body:
            return False

        if s_args: s_args = ' ' + s_args

        tmp_file = '{}/tmp/{}.{}'.format(public.get_panel_path(),public.GetRandomString(32),script_exts[script_type])
        public.writeFile(tmp_file,script_body)

        if script_type == 'bash':
            result = public.ExecShell('bash {}{}'.format(tmp_file,s_args))
        elif script_type == 'python':
            result = public.ExecShell('{} {}{}'.format(public.get_python_bin(),tmp_file,s_args))

        if os.path.exists(tmp_file):
            os.remove(tmp_file)

        return result

    def add_task_log(self,script_id,trigger_id,where_id,status,result_succ,result_err,start_time,end_time):
        '''
            @name 添加任务日志
            @param script_id<int> 脚本ID
            @param trigger_id<int> 触发器ID
            @param where_id<int> 事件ID
            @param status<int> 任务状态
            @param result_succ<string> 成功结果
            @param result_err<string> 错误结果
            @param start_time<int> 开始时间
            @param end_time<int> 结束时间
            @return bool
        '''
        return self._sql.table('tasks').add('script_id,trigger_id,where_id,status,result_succ,result_err,start_time,end_time',
            (script_id,trigger_id,where_id,status,result_succ,result_err,start_time,end_time))

    def get_trigger_logs(self,args):
        '''
            @name 获取任务执行日志
            @param args<dict_obj>{
                "trigger_id": <int> 任务ID
                "p": <int> 页码
                "rows": <int> 每页数量
            }
        '''
        trigger_id = int(args.get('trigger_id',0))
        if not trigger_id: return public.returnMsg(False,'任务ID不能为空')
        p = 1
        if 'p' in args: p = int(args['p'])
        rows = 10
        if 'rows' in args: rows = int(args['rows'])
        tojs = ''
        if 'tojs' in args: tojs = args.tojs

        where = 'trigger_id=?'
        where_args = (trigger_id,)
        count = self._sql.table('tasks').where(where,where_args).count()
        page = public.get_page(count,p,rows,tojs)
        page['data'] = self._sql.table('tasks').where(where,where_args).limit(page['row'],page['shift']).order('log_id desc').select()
        return page

    def get_operator_logs(self,args):
        '''
            @name 获取任务事件执行日志
            @param args<dict_obj>{
                "where_id": <int> 任务事件ID
                "p": <int> 页码
                "rows": <int> 每页数量
            }
        '''
        where_id = int(args.get('where_id',0))
        if not where_id: return public.returnMsg(False,'任务事件ID不能为空')
        p = 1
        if 'p' in args: p = int(args['p'])
        rows = 10
        if 'rows' in args: rows = int(args['rows'])
        tojs = ''
        if 'tojs' in args: tojs = args.tojs

        where = 'where_id=?'
        where_args = (where_id,)
        count = self._sql.table('tasks').where(where,where_args).count()
        page = public.get_page(count,p,rows,tojs)
        page['data'] = self._sql.table('tasks').where(where,where_args).limit(page['row'],page['shift']).order('log_id desc').select()
        return page

    def test_trigger(self,args):
        '''
            @name 测试指定任务
            @author hwliang
            @param args<dict_obj>{
                trigger_id<int> 任务ID
            }
            @return dict
        '''
        if not args or not 'trigger_id' in args:
            return public.returnMsg(False,'参数错误')


        trigger_info = self._sql.table('trigger').where('trigger_id=?',(args.trigger_id,)).find()
        if not trigger_info:
            return public.returnMsg(False,'任务不存在')
        script_body = ''
        script_type = 'bash'
        return_type = 'string'

        script_exts = {'bash':'sh','python':'py','php':'php','node':'js','ruby':'rb','perl':'pl'}
        script_args = ''
        #检查脚本是否存在
        if trigger_info['script_id']:
            script_info = self._sql.table('scripts').where('script_id=?',(trigger_info['script_id'],)).find()
            if not script_info:
                return public.returnMsg(False,'脚本不存在')
            script_body = script_info['script']
            script_type = script_info['script_type']
            return_type = script_info['return_type']
            if 'args' in trigger_info and trigger_info['args']: script_args = trigger_info['args']
        else:
            script_body = trigger_info['script_body']

        trigger_start_time = int(time.time())
        result_msg = ['正在执行任务...']
        if script_args: script_args = ' {}'.format(script_args)

        tmp_file = '{}/tmp/trigger_{}.{}'.format(public.get_panel_path(),trigger_info['trigger_id'],script_exts[script_type])
        public.writeFile(tmp_file,script_body)

        #执行脚本
        if script_type == 'bash':
            result = public.ExecShell("bash {}{}".format(tmp_file,script_args))
        else:
            result = public.ExecShell("{} {}{}".format(public.get_python_bin(),tmp_file,script_args))

        if os.path.exists(tmp_file):
            os.remove(tmp_file)

        if not result[0]:
            self.add_task_log(trigger_info['script_id'],trigger_info['trigger_id'],0,0,result[0],result[1],trigger_start_time,int(time.time()))
            return public.returnMsg(False,'脚本执行失败,错误信息:\n{}'.format(result[1]))


        result_msg.append("任务脚本已执行完成,返回结果:\n{}".format(result[0]))
        #检查任务事件
        operator_where = self._sql.table('operator_where').where('trigger_id=?',(args.trigger_id,)).select()
        if not operator_where:
            result_msg.append("该任务没有设置事件,跳过事件检查。")
            self.add_task_log(trigger_info['script_id'],trigger_info['trigger_id'],0,1,'\n'.join(result_msg),result[1],trigger_start_time,int(time.time()))
            return public.returnMsg(True,result_msg)

        if return_type in ['string','json']:
            _line = result[0].strip()
        else:
            _line = result[0].strip().split('\n')[-1]

        _value = _line
        if return_type == 'string':
            _value = _line
        elif return_type == 'json':
            try:
                _value = json.loads(_line)
            except:
                result_msg.append("脚本返回结果不是JSON格式,跳过事件检查。")
                self.add_task_log(trigger_info['script_id'],trigger_info['trigger_id'],0,0,'\n'.join(result_msg),result[1],trigger_start_time,int(time.time()))
                return public.returnMsg(False,result_msg)
        elif return_type == 'int':
            try:
                _value = int(_line)
            except:
                result_msg.append("脚本返回结果的最后一行不是整数,跳过事件检查。")
                self.add_task_log(trigger_info['script_id'],trigger_info['trigger_id'],0,0,'\n'.join(result_msg),result[1],trigger_start_time,int(time.time()))
                return public.returnMsg(False,result_msg)
        elif return_type == 'float':
            try:
                _value = float(_line)
            except:
                result_msg.append("脚本返回结果的最后一行不是浮点数,跳过事件检查。")
                self.add_task_log(trigger_info['script_id'],trigger_info['trigger_id'],0,0,'\n'.join(result_msg),result[1],trigger_start_time,int(time.time()))
                return public.returnMsg(False,result_msg)
        result_msg.append("共有 {} 个事件需要处理".format(len(operator_where)))
        n = 1

        for op in operator_where:
            if return_type == 'int':
                op['op_value'] = int(op['op_value'])
            elif return_type == 'float':
                op['op_value'] = float(op['op_value'])
            _script = op['run_script_id'] if op['run_script_id'] else op['run_script']
            result_msg.append("正在处理第 {} 个事件: [当返回值 {} {} 时 执行 {}]".format(n,op['operator'],op['op_value'],_script))
            op_start_time = int(time.time())
            is_true = False
            if op['operator'] in ['==','=']:
                if _value == op['op_value']:
                    is_true = True
            elif op['operator'] == '!=':
                if _value != op['op_value']:
                    is_true = True
            elif op['operator'] == '>':
                if _value > op['op_value']:
                    is_true = True
            elif op['operator'] == '>=':
                if _value >= op['op_value']:
                    is_true = True
            elif op['operator'] == '<':
                if _value < op['op_value']:
                    is_true = True
            elif op['operator'] == '<=':
                if _value <= op['op_value']:
                    is_true = True
            elif op['operator'] == 'in':
                if str(_value).find(str(op['op_value'])) != -1:
                    is_true = True
            elif op['operator'] == 'not in':
                if str(_value).find(str(op['op_value'])) == -1:
                    is_true = True

            if is_true:
                result_msg.append("事件条件成立,正在执行执行脚本...")
                public.WriteLog('任务编排',"任务[{}]触发条件[返回结果 {} {}]，已执行预设的脚本!".format(trigger_info['name'],op['operator'],op['op_value']))
                s_args = ''
                if 'args' in op and op['args']: s_args = op['args']
                result_msg.append("事件条件成立,正在执行执行事件脚本...")

                result = self.exec_script(op['run_script_id'],op['run_script'],s_args)
                if not result[0]:
                    public.WriteLog('任务编排',"任务[{}]触发条件[返回结果 {} {} {}]，执行预设的脚本失败： {}".format(trigger_info['name'],op['operator'],op['op_value'],result[1]))
                    result_msg.append("事件脚本执行失败,错误信息:\n{}".format("\n".join(result)))
                    self.add_task_log(op['run_script_id'],0,op['where_id'],0,'\n'.join(result_msg),'\n'.join(result),op_start_time,int(time.time()))
                else:
                    self.add_task_log(op['run_script_id'],0,op['where_id'],1,result[0],result[1],op_start_time,int(time.time()))
                    result_msg.append("事件脚本执行成功,返回结果:\n{}".format(result[0]))
            else:
                result_msg.append("事件条件不成立,跳过执行。")

            result_msg.append("第 {} 个事件处理完成。".format(n))
            result_msg.append("-" * 20)
            n+=1
        self.add_task_log(trigger_info['script_id'],trigger_info['trigger_id'],0,1,'\n'.join(result_msg),result[1],trigger_start_time,int(time.time()))
        return public.returnMsg(True,"\n".join(result_msg))










