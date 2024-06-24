# coding: utf-8
#  + -------------------------------------------------------------------
# | 宝塔Linux面板
#  + -------------------------------------------------------------------
# | Copyright (c) 2015-2016 宝塔软件(http:#bt.cn) All rights reserved.
#  + -------------------------------------------------------------------
# | Author: hwliang <hwl@bt.cn>
#  + -------------------------------------------------------------------
import json
import time
import traceback
from datetime import datetime

import public, db, re, os, firewalls, sys
import subprocess
import ipaddress

try:
    from BTPanel import session
except:
    pass
os.chdir('/www/server/panel')
sys.path.insert(0, 'class/')
import crontab


class ftp:
    __runPath = None
    config_path = '/www/server/panel/data/ftp_push_config.json'

    def __init__(self):
        self.__runPath = '/www/server/pure-ftpd/bin'
        self.filepath="/www/server/panel/class/ftp_types.json"
    def AddUser(self, get):
        """
        @name 添加FTP用户
        @param path 保存路径
        @param ftp_username FTP用户名
        @param ftp_password FTP密码
        @param ps 备注
        """
        try:
            if not os.path.exists('/www/server/pure-ftpd/sbin/pure-ftpd'):
                return public.returnMsg(False, '请先到软件商店安装Pure-FTPd服务')
            import files, time
            fileObj = files.files()

            get['ftp_username'] = get['ftp_username'].replace(' ', '')
            if re.search("\W+", get['ftp_username']):
                return {
                    'status': False,
                    'code': 501,
                    'msg': public.getMsg('FTP_USERNAME_ERR_T')
                }
            if len(get['ftp_username']) < 3:
                return {
                    'status': False,
                    'code': 501,
                    'msg': public.getMsg('FTP_USERNAME_ERR_LEN')
                }
            if not fileObj.CheckDir(get['path']):
                return {
                    'status': False,
                    'code': 501,
                    'msg': public.getMsg('FTP_USERNAME_ERR_DIR')
                }
            if public.M('ftps').where('name=?',
                                      (get.ftp_username.strip(),)).count():
                return public.returnMsg(False, 'FTP_USERNAME_ERR_EXISTS',
                                        (get.ftp_username,))
            username = get['ftp_username'].strip()
            password = get['ftp_password'].strip()

            if len(password) < 6:
                return public.returnMsg(False, 'FTP密码长度不能少于6位!')
            get.path = get['path'].strip()
            get.path = get.path.replace("\\", "/")
            fileObj.CreateDir(get)
            public.ExecShell('chown www.www ' + get.path)
            public.ExecShell(self.__runPath + '/pure-pw useradd "' + username +
                             '" -u www -d ' + get.path + '<<EOF \n' +
                             password + '\n' + password + '\nEOF')
            self.FtpReload()
            ps = public.xssencode2(get['ps'])
            if get['ps'] == '': ps = public.getMsg('INPUT_PS')
            addtime = time.strftime('%Y-%m-%d %X', time.localtime())

            pid = 0
            if hasattr(get, 'pid'): pid = get.pid
            public.M('ftps').add(
                'pid,name,password,path,status,ps,addtime',
                (pid, username, password, get.path, 1, ps, addtime))
            public.WriteLog('TYPE_FTP', 'FTP_ADD_SUCCESS', (username,))
            return public.returnMsg(True, 'ADD_SUCCESS')
        except Exception as ex:
            public.WriteLog('TYPE_FTP', 'FTP_ADD_ERR', (username, str(ex)))
            return public.returnMsg(False, 'ADD_ERROR')

    # 删除用户
    def DeleteUser(self, get):
        try:
            username = get['username']
            id = get['id']
            if public.M('ftps').where("id=? and name=?", (id, username,)).count() == 0:
                return public.returnMsg(False, 'DEL_ERROR')
            public.ExecShell(self.__runPath + '/pure-pw userdel "' + username +
                             '"')
            self.FtpReload()
            public.M('ftps').where("id=?", (id,)).delete()
            public.WriteLog('TYPE_FTP', 'FTP_DEL_SUCCESS', (username,))
            return public.returnMsg(True, "DEL_SUCCESS")
        except Exception as ex:
            public.WriteLog('TYPE_FTP', 'FTP_DEL_ERR', (username, str(ex)))
            return public.returnMsg(False, 'DEL_ERROR')

    # 修改用户密码
    def SetUserPassword(self, get):
        try:
            id = get['id']
            username = get['ftp_username'].strip()
            password = get['new_password'].strip()
            if public.M('ftps').where("id=? and name=?", (id, username,)).count() == 0:
                return public.returnMsg(False, 'DEL_ERROR')
            if len(password) < 6:
                return public.returnMsg(False, 'FTP密码长度不能少于6位!')
            public.ExecShell(self.__runPath + '/pure-pw passwd "' + username +
                             '"<<EOF \n' + password + '\n' + password +
                             '\nEOF')
            self.FtpReload()
            public.M('ftps').where("id=?",
                                   (id,)).setField('password', password)
            public.WriteLog('TYPE_FTP', 'FTP_PASS_SUCCESS', (username,))
            return public.returnMsg(True, 'EDIT_SUCCESS')
        except Exception as ex:
            public.WriteLog('TYPE_FTP', 'FTP_PASS_ERR', (username, str(ex)))
            return public.returnMsg(False, 'EDIT_ERROR')
        
    def SetUser(self, get):
        try:
            id = get['id']
            username = get['ftp_username'].strip()
            password = get['new_password'].strip()

            path = get['path'].strip().replace("\\", "/")
            
            if public.M('ftps').where("id=? and name=?", (id, username,)).count() == 0:
                return public.returnMsg(False, 'DEL_ERROR')
            
            # 修改用户密码
            if len(password) < 6:
                return public.returnMsg(False, 'FTP密码长度不能少于6位!')
            public.ExecShell(self.__runPath + '/pure-pw passwd "' + username +
                            '"<<EOF \n' + password + '\n' + password +
                            '\nEOF')
            public.M('ftps').where("id=?",
                                (id,)).setField('password', password)
            public.WriteLog('TYPE_FTP', 'FTP_PASS_SUCCESS', (username,))
            
            # 修改用户目录
            public.ExecShell('chown www.www ' + path)
            public.ExecShell(self.__runPath + '/pure-pw usermod "' + username +
                            '"  -d ' + path)
            public.M('ftps').where("id=?",
                                (id,)).setField('path', path)
            
            self.FtpReload()
            
            return public.returnMsg(True, 'EDIT_SUCCESS')
        except Exception as ex:
            public.WriteLog('TYPE_FTP', 'FTP_PASS_ERR', (username, str(ex)))
            return public.returnMsg(False, 'EDIT_ERROR'+str(ex))
    def BatchSetUserPassword(self, get):
        try:
            if not hasattr(get, 'data') or not get.data:
                return public.returnMsg(False, '参数错误！')
            result = []
            data = json.loads(get.data)
            for i in data:
                try:
                    id = i['id']
                    username = i['ftp_username'].strip()
                    password = i['new_password'].strip()
                    if public.M('ftps').where("id=? and name=?", (id, username,)).count() == 0:
                        return public.returnMsg(False, 'DEL_ERROR')
                    if len(password) < 6:
                        return public.returnMsg(False, 'FTP密码长度不能少于6位!')
                    public.ExecShell(self.__runPath + '/pure-pw passwd "' + username +
                                     '"<<EOF \n' + password + '\n' + password +
                                     '\nEOF')
                    public.M('ftps').where("id=?", (id,)).setField('password', password)
                    public.WriteLog('TYPE_FTP', 'FTP_PASS_SUCCESS', (username,))
                    result.append({'ftp_username': i['ftp_username'], 'status': True})
                except:
                    result.append({'ftp_username': i['ftp_username'], 'status': False})
            self.FtpReload()
            return result
        except:
            return public.returnMsg(False, '批量修改失败！')

    # 设置用户状态
    def SetStatus(self, get):
        msg = public.getMsg('OFF')
        if get.status != '0': msg = public.getMsg('ON')
        try:
            id = get['id']
            username = get['username']
            status = get['status']
            if public.M('ftps').where("id=? and name=?", (id, username,)).count() == 0:
                return public.returnMsg(False, 'DEL_ERROR')
            if int(status) == 0:
                public.ExecShell(self.__runPath + '/pure-pw usermod "' +
                                 username + '" -r 1')
            else:
                public.ExecShell(self.__runPath + '/pure-pw usermod "' +
                                 username + "\" -r ''")
            self.FtpReload()
            public.M('ftps').where("id=?", (id,)).setField('status', status)
            public.WriteLog('TYPE_FTP', 'FTP_STATUS', (msg, username))
            return public.returnMsg(True, 'SUCCESS')
        except Exception as ex:
            public.WriteLog('TYPE_FTP', 'FTP_STATUS_ERR',
                            (msg, username, str(ex)))
            return public.returnMsg(False, 'FTP_STATUS_ERR', (msg,))

    '''
     * 设置FTP端口
     * @param Int _GET['port'] 端口号
     * @return bool
     '''

    def setPort(self, get):
        try:
            port = get['port'].strip()
            if not port: return public.returnMsg(False, 'FTP端口不能为空')
            if int(port) < 1 or int(port) > 65535:
                return public.returnMsg(False, 'PORT_CHECK_RANGE')
            data = public.ExecShell("ss -nultp|grep -w '%s '" % port)[0]
            if data: return public.returnMsg(False, "PORT_CHECK_EXISTS", [port])
            file = '/www/server/pure-ftpd/etc/pure-ftpd.conf'
            conf = public.readFile(file)
            rep = u"\n#?\s*Bind\s+[0-9]+\.[0-9]+\.[0-9]+\.+[0-9]+,([0-9]+)"
            # preg_match(rep,conf,tmp)
            conf = re.sub(rep, "\nBind        0.0.0.0," + port, conf)
            public.writeFile(file, conf)
            public.ExecShell('/etc/init.d/pure-ftpd restart')
            public.WriteLog('TYPE_FTP', "FTP_PORT", (port,))
            # 添加防火墙
            # data = ftpinfo(port=port,ps = 'FTP端口')
            get.port = port
            get.ps = public.getMsg('FTP_PORT_PS')
            firewalls.firewalls().AddAcceptPort(get)
            session['port'] = port
            return public.returnMsg(True, 'EDIT_SUCCESS')
        except Exception as ex:
            public.WriteLog('TYPE_FTP', 'FTP_PORT_ERR', (str(ex),))
            return public.returnMsg(False, 'EDIT_ERROR')

    # 重载配置
    def FtpReload(self):
        public.ExecShell(
            self.__runPath +
            '/pure-pw mkdb /www/server/pure-ftpd/etc/pureftpd.pdb')

    def get_login_logs(self, get):
        import ftplog
        ftpobj = ftplog.ftplog()
        return ftpobj.get_login_log(get)

    def get_action_logs(self, get):
        import ftplog
        ftpobj = ftplog.ftplog()
        return ftpobj.get_action_log(get)

    def set_ftp_logs(self, get):
        import ftplog
        ftpobj = ftplog.ftplog()
        result = ftpobj.set_ftp_log(get)
        return result

    def get_cron_config(self, get):
        try:
            if not hasattr(get, 'id') and get['id']:
                return public.returnMsg(False, '请传入ftp的id！')
            if not os.path.exists(self.config_path):
                public.writeFile(self.config_path,
                                 json.dumps({'0': [], '1': [], '2': [], '3': [], 'channel': ''}))
            data = json.loads(public.readFile(self.config_path))
            id_data = {}
            for i, j in data.items():
                if i == 'channel':
                    continue
                for k in j:
                    if int(get.id) == k['id']:
                        k['push_action'] = i
                        id_data = k
                        break
            if not id_data:
                return {'id': get.id, 'push_action': '0', 'end_time': '0', 'channel': data['channel']}
            id_data['channel'] = data['channel']
            return id_data
        except:
            return {'id': get.id, 'push_action': '0', 'end_time': '0', 'channel': data.get('channel', '')}

    def set_cron_config(self, get):
        try:
            if os.path.exists(self.config_path):
                config = json.loads(public.readFile(self.config_path))
            else:
                config = {'0': [], '1': [], '2': [], '3': [], 'channel': ''}
            if not hasattr(get, 'id') and get['id']:
                return public.returnMsg(False, '参数错误！')
            for id in json.loads(get.id):
                data = {}
                for i, j in config.items():
                    if i == 'channel':
                        continue
                    for k in j:
                        print(i, j)
                        if k['id'] == int(id):
                            j.remove(k)
                data['id'] = int(id)
                if hasattr(get, 'end_time') and get['end_time'] != '':
                    data['end_time'] = get['end_time']
                if hasattr(get, 'show') and get['show'] != '':
                    data["show"] = get["show"] == "true"
                if get.push_action!="0":
                    data['is_push'] = True
                else:
                    data['is_push'] = False
                if len(data) < 3:
                    return public.returnMsg(False, '参数不足！')
                config[get.push_action].append(data)
                config['channel'] = get.channel
            self.create_task()
            public.writeFile(self.config_path, json.dumps(config))
            return public.returnMsg(True, '设置成功！')
        except:
            return public.returnMsg(False, '设置失败！')

    def send_notification(self, title, msg, channel):
        data = public.get_push_info(title, msg)
        for channel in channel.split(','):
            obj = public.init_msg(channel)
            obj.send_msg(data['msg'])

    # 创建计划任务
    def create_task(self):
        id = public.M('crontab').where("name=?", "【勿删】ftp定时检测密码有效期任务").getField('id')
        if id:
            return
        pypath = '/www/server/panel/class/ftp.py'
        p = crontab.crontab()
        args = {
            "name": "【勿删】ftp定时检测密码有效期任务",
            "type": "day",
            "where1": '',
            "hour": 1,
            "minute": 30,
            "week": "",
            "sType": "toShell",
            "sName": "",
            "backupTo": "localhost",
            "save": '',
            "sBody": "btpython {}".format(pypath),
            "urladdress": "undefined"
        }
        p.AddCrontab(args)

    # 删除计划任务
    def remove_task(self):
        p = crontab.crontab()
        id = public.M('crontab').where("name=?", "【勿删】ftp定时检测密码有效期任务").getField('id')
        args = {"id": id}
        p.DelCrontab(args)

    def run(self):
        if not os.path.exists(self.config_path):
            print('配置文件不存在,关闭警告！')
            self.remove_task()
            return
        config = json.loads(public.readFile(self.config_path))
        if not config:
            print('无任务，关闭任务！')
            self.remove_task()
            return
        try:
            for push_achion, data in config.items():
                msg = []
                title = ''
                if push_achion == '0' or push_achion == 'channel':
                    continue
                for i in data:
                    uname = public.M('ftps').where("id=?", (i['id'],)).getField('name')
                    pwd = public.M('ftps').where("id=?", (i['id'],)).getField('password')
                    if not (uname and pwd):
                        continue
                    now = time.time()
                    end_time = int(i['end_time'])
                    if int(end_time) < int(now):
                        if not i['is_push']:
                            if push_achion == '1':
                                i['is_push'] = True
                                title = 'FTP密码修改提醒'
                                msg.append('【{}】账号请及时【修改】FTP密码！'.format(uname))
                            if push_achion == '2':
                                i['is_push'] = True
                                title = 'FTP服务停止提醒'
                                if self.SetStatus(public.to_dict_obj({'id': i['id'], 'username': uname, 'status': 0}))['status']:
                                    msg.append('【{}】账号【已停止】请及时处理！'.format(uname))
                                else:
                                    msg.append('【{}】账号【停止失败】请及时处理！'.format(uname))
                            if push_achion == '3':
                                new_pwd = public.GetRandomString(12)
                                res = self.SetUserPassword(public.to_dict_obj({'id': i['id'], 'ftp_username': uname, 'new_password': new_pwd}))
                                i['is_push'] = True
                                title = 'FTP服务自动改密提醒'
                                if res['status']:
                                    msg.append('【{}】账号已将密码改为【{}】！'.format(uname, new_pwd))
                                else:
                                    msg.append('【{}】账号密码修改失败！'.format(uname))
                if title:
                    self.send_notification(title, msg, config['channel'])
            public.writeFile(self.config_path, json.dumps(config))
        except:
            print(traceback.format_exc())
            public.writeFile(self.config_path, json.dumps(config))
    def kb_to_mb_or_gb(self,size_kb):
        """
        将大小从KB转换为更适合的单位，保持输出格式简单。
        """
        if not size_kb.isdigit():
            return size_kb + "KB"  # 如果不是数字，返回原始值并附加"KB"
        
        size_kb = int(size_kb)
        if size_kb < 1024:
            return f"{size_kb}KB"
        elif size_kb < 1048576:  # 小于1GB的KB数
            size_mb = size_kb / 1024
            return f"{int(size_mb)}MB"  # 只保留整数部分并返回B"
        else:
            size_gb = size_kb / 1048576
            return f"{int(size_mb)}GB"  # 只保留整数部分并返回
                    
    def GetFtpUserAccess(self, get):
        try:
            username = get['username']
            cmd = self.__runPath + '/pure-pw show "' + username + '"'
            result = subprocess.check_output(cmd, shell=True, text=True)
            # 对结果进行处理
            result_lines = result.split('\n')
            result_dict = {}  # 创建一个空字典来存储结果
            for line in result_lines:
                if line:
                    key, value = line.split(':', 1)
                    key = key.lower().strip()  # 将键转换为小写
                    key = '_'.join(key.split())  # 使用一个下划线替换所有空格
                    # 如果键在指定的列表中，就只保留数字，并添加单位
                    if key in ["download_bandwidth", "upload_bandwidth", "max_size"]:
                       
                        numeric_value = ''.join(filter(str.isdigit, value.strip()))
                        value = self.kb_to_mb_or_gb(numeric_value)  # 调用辅助函数进行转换

                    elif key in ["ratio","time_restrictions","max_files","max_sim_sessions"]:
                        value = value.split()[0]  
                        # 如果值只包含数字 "0"，则将其设置为空
                        if all(char == "0" for char in value.replace("-", "")):
                            value = ""
                        # 如果 "ratio" 的值为 "0:0"，则将其设置为空
                        if key == "ratio" and value == "0:0":
                            value = ""
                    else:
                        value = value.strip()  # 去掉值前后的空格
                    # 如果值为 "0MB" 或 "0KB"，则将其设置为空
                    if value in ["0MB", "0KB"]:
                        value = ""
                    result_dict[key] = value  # 添加到字典中
            return {"status": True, "msg": "获取ftp用户权限成功","data":result_dict}
        except Exception as e:
            # public.WriteLog('TYPE_FTP', '获取ftp用户权限失败', (username, str(e)))
            return {"status": False, "msg": '获取ftp用户权限失败'}


    def ModifyFtpUserAccess(self, get):
        try:
            username = get['username']

            # 构建修改用户权限的命令
            cmd = self.__runPath + f'/pure-pw usermod "{username}"'
            
            # 解析用户提交的权限参数
            download_bandwidth = get.get('download_bandwidth', '0KB')
            upload_bandwidth = get.get('upload_bandwidth', '0KB')
            max_size = get.get('max_size', '0MB')

            if download_bandwidth[-2:].lower() == 'mb':
                download_bandwidth = str(int(download_bandwidth[:-2]) * 1024) + 'KB'
            # elif download_bandwidth[-2:].lower() == 'gb':
            #     download_bandwidth = str(int(download_bandwidth[:-2]) * 1024 * 1024) + 'KB'

            if  upload_bandwidth[-2:].lower() == 'mb':
                upload_bandwidth = str(int(upload_bandwidth[:-2]) * 1024) + 'KB'
            # elif  upload_bandwidth[-2:].lower() == 'gb':
            #     upload_bandwidth = str(int(upload_bandwidth[:-2]) * 1024 * 1024) + 'KB'

            # if max_size[-2:].lower() == 'gb':
            #     max_size = str(int(upload_bandwidth[:-2]) * 1024 * 1024) + 'MB'

            max_files = get.get('max_files', 0)
            ratio = get.get('ratio')
            if ratio:
                upload_ratio, download_ratio = ratio.split(':')
                if int(upload_ratio)==0 or int (download_ratio)==0 :
                   return public.returnMsg(False,'上传和下载比率设置不正确')
                cmd += f' -q {upload_ratio} -Q {download_ratio}'
            else:
                pass
            allowed_local_ips = get.get('allowed_local_ips', '')
            denied_local_ips = get.get('denied_local_ips', '')
            allowed_client_ips = get.get('allowed_client_ips', '')
            denied_client_ips = get.get('denied_client_ips', '')
            time_restrictions = get.get('time_restrictions', '0000-0000')

            max_sim_sessions = get.get('max_sim_sessions', '0')
            # 验证 IP 地址的格式
            for ip in [allowed_local_ips, denied_local_ips, allowed_client_ips, denied_client_ips]:
                if ip:
                    try:
                        ipaddress.ip_address(ip)
                    except ValueError:
                        return public.returnMsg(False, 'IP 地址格式不正确')

            if download_bandwidth:
                cmd += f' -t {download_bandwidth[:-2]}'
            if upload_bandwidth:
                cmd += f' -T {upload_bandwidth[:-2]}'
            if max_files:
                cmd += f' -n {max_files}'
            if max_size:
                cmd += f' -N {max_size[:-2]}'               
            if time_restrictions:
                cmd += f' -z {time_restrictions}'
            if max_sim_sessions:
                cmd += f' -y {max_sim_sessions}'
            
            if allowed_local_ips:
                cmd += f' -i {allowed_local_ips}'

            if denied_local_ips:
                cmd += f' -I {denied_local_ips}'

            if allowed_client_ips:
                cmd += f' -r {allowed_client_ips}'

            if denied_client_ips:
                cmd += f' -R {denied_client_ips}'

            # 执行命令
            subprocess.check_call(cmd, shell=True)
            
            # 重载ftp
            public.ExecShell("/www/server/pure-ftpd/bin/pure-pw mkdb /www/server/pure-ftpd/etc/pureftpd.pdb")

            # 返回成功消息
            return public.returnMsg(True, 'EDIT_SUCCESS')
        except Exception as e:
            # public.WriteLog('TYPE_FTP', 'FTP_ACCESS_MODIFY_ERR', (username, str(e)))
            return public.returnMsg(False, 'EDIT_ERROR'+str(e))

    def view_ftp_types(self, get):

        try:
            self.check_and_add_type_id_column()
            data = self.load_json_file()
            return public.returnMsg(True, data['types'])
        except Exception as e:
            return public.returnMsg(False, str(e))

    def check_and_add_type_id_column(self):
        # 尝试查询ftps表中的type_id字段，以检查它是否存在
        query_result = public.M('ftps').field('type_id').select()
        if "no such column: type_id" in query_result:
            try:
                public.M('ftps').execute("ALTER TABLE 'ftps' ADD 'type_id' INTEGER", ())
            except Exception as e:
                print(e)

    def load_json_file(self):
        """加载JSON文件"""
        return self.check_and_create_json()


    def check_and_create_json(self,default_data={"types": []}):
        """检查JSON文件是否存在，如果不存在则创建并初始化它"""
        if not os.path.exists(self.filepath):
            self.save_json_file(default_data)
            return default_data  # 返回初始化数据以供使用

if __name__ == "__main__":
    f = ftp()
    f.run()
