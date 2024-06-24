#!/bin/python
# coding: utf-8
# +-------------------------------------------------------------------
# | 宝塔Linux面板
# +-------------------------------------------------------------------
# | Copyright (c) 2015-2016 宝塔软件(http://bt.cn) All rights reserved.
# +-------------------------------------------------------------------
# | Author: hwliang <hwl@bt.cn>
# +-------------------------------------------------------------------

# ------------------------------
# 计划任务
# ------------------------------

import sys
import os
import logging
from json import dumps, loads
from psutil import Process, pids, cpu_count, cpu_percent, net_io_counters, disk_io_counters, virtual_memory

os.environ['BT_TASK'] = '1'
sys.path.insert(0, "/www/server/panel/class/")
import time
import public
import db
import threading
import panelTask
import process_task
import PluginLoader

task_obj = panelTask.bt_task()
task_obj.not_web = True
global pre, timeoutCount, logPath, isTask, oldEdate, isCheck
pre = 0
timeoutCount = 0
isCheck = 0
oldEdate = None
logPath = '/tmp/panelExec.log'
isTask = '/tmp/panelTask.pl'
python_bin = None
thread_dict = {}


def get_python_bin():
    global python_bin
    if python_bin: return python_bin
    bin_file = '/www/server/panel/pyenv/bin/python'
    bin_file2 = '/usr/bin/python'
    if os.path.exists(bin_file):
        python_bin = bin_file
        return bin_file
    python_bin = bin_file2
    return bin_file2


def WriteFile(filename, s_body, mode='w+'):
    """
    写入文件内容
    @filename 文件名
    @s_body 欲写入的内容
    return bool 若文件不存在则尝试自动创建
    """
    try:
        fp = open(filename, mode)
        fp.write(s_body)
        fp.close()
        return True
    except:
        try:
            fp = open(filename, mode, encoding="utf-8")
            fp.write(s_body)
            fp.close()
            return True
        except:
            return False


def ReadFile(filename, mode='r'):
    """
    读取文件内容
    @filename 文件名
    return string(bin) 若文件不存在，则返回None
    """
    if not os.path.exists(filename):
        return False
    f_body = None
    with open(filename, mode) as fp:
        f_body = fp.read()
    return f_body


# 下载文件
def DownloadFile(url, filename):
    try:
        import urllib
        import socket
        socket.setdefaulttimeout(10)
        urllib.urlretrieve(url, filename=filename, reporthook=DownloadHook)
        os.system('chown www.www ' + filename)
        WriteLogs('done')
    except:
        WriteLogs('done')


# 下载文件进度回调
def DownloadHook(count, blockSize, totalSize):
    global pre
    used = count * blockSize
    pre1 = int((100.0 * used / totalSize))
    if pre == pre1:
        return
    speed = {'total': totalSize, 'used': used, 'pre': pre}
    WriteLogs(dumps(speed))
    pre = pre1


# 写输出日志
def WriteLogs(logMsg):
    try:
        global logPath
        with open(logPath, 'w+') as fp:
            fp.write(logMsg)
            fp.close()
    except:
        pass


def ExecShell(cmdstring, cwd=None, timeout=None, shell=True):
    try:
        global logPath
        import subprocess
        import time
        sub = subprocess.Popen(cmdstring + ' &> ' + logPath, cwd=cwd,
                               stdin=subprocess.PIPE, shell=shell, bufsize=4096)

        while sub.poll() is None:
            time.sleep(0.1)

        return sub.returncode
    except:
        return None


# 任务队列
def startTask():
    global isTask, logPath, thread_dict
    tip_file = '/dev/shm/.panelTask.pl'
    n = 0
    while 1:
        try:
            if os.path.exists(isTask):
                with db.Sql() as sql:
                    public.M('tasks').where(
                        "status=?", ('-1',)).setField('status', '0')
                    taskArr = public.M('tasks').where("status=?", ('0',)).field('id,type,execstr').order("id asc").select()
                    for value in taskArr:
                        public.check_sys_write()
                        start = int(time.time())
                        if not public.M('tasks').where("id=?", (value['id'],)).count():
                            public.writeFile(tip_file, str(int(time.time())))
                            continue
                        public.M('tasks').where("id=?", (value['id'],)).save('status,start', ('-1', start))
                        if value['type'] == 'download':
                            argv = value['execstr'].split('|bt|')
                            DownloadFile(argv[0], argv[1])
                            end = int(time.time())
                            public.M('tasks').where("id=?", (value['id'],)).save('status,end', ('1', end))

                        elif value['type'] == 'execshell':
                            try:
                                msg = save_installed_msg(value["id"])
                            except:
                                msg = public.get_error_info()

                            ExecShell(value['execstr'])
                            # 安装PHP后需要重新加载PHP环境
                            if value['execstr'].find('install php') != -1:
                                os.system("btpython /www/server/panel/tools.py phpenv")
                            elif value['execstr'].find('install nginx') != -1:
                                # 修复nginx配置文件到支持当前安装的nginx版本
                                os.system("btpython /www/server/panel/script/nginx_conf_rep.py")

                            end = int(time.time())
                            public.M('tasks').where("id=?", (value['id'],)).save('status,end', ('1', end))

                            try:
                                if msg is not None:
                                    update_installed_msg(msg)
                            except:
                                public.writeFile("{}/logs/task.error".format(public.get_panel_path()), public.get_error_info())

                        if (public.M('tasks').where("status=?", ('0')).count() < 1):
                            if os.path.exists(isTask):
                                os.remove(isTask)
                        public.start_syssafe()
                    sql.close()
                    taskArr = None
            public.writeFile(tip_file, str(int(time.time())))

            # 线程检查
            n += 1
            if n > 60:
                run_thread()
                n = 0
        except:
            pass
        time.sleep(2)


def save_installed_msg(task_id):
    from panel_msg import Message

    msg_list = Message.find_by_sub_args("soft_install", ("soft_install.task_id=?", [task_id, ]), 1)
    if msg_list is None:
        return None
    else:
        msg = msg_list[0]
        msg.title = "正在" + msg.title[2:]
        msg.sub["file_name"] = "/tmp/panelExec.log"
        msg.sub["install_status"] = "正在" + msg.sub["install_status"][2:]
        msg.sub["status"] = 1
        msg.read = False
        msg.read_time = 0

        res = msg.save_to_db()
        return msg


def update_installed_msg(msg):
    import shutil
    global logPath

    logs_dir = public.get_panel_path() + "/logs/installed"
    if not os.path.exists(logs_dir):
        os.makedirs(logs_dir, 0o600)

    filename = logs_dir + "/{}_{}.log".format(msg.sub["soft_name"], int(time.time()))
    if os.path.exists(logPath):
        shutil.copyfile(logPath, filename)
        # public.writeFile(logPath, "")
        msg.sub["file_name"] = filename
        msg.sub["install_status"] = msg.sub["install_status"][2:] + "结束"
        msg.sub["status"] = 2
        msg.read = False
        msg.title = msg.title[2:] + "已结束"
        msg.read_time = 0

    res = msg.save_to_db()


# 网站到期处理
def siteEdate():
    global oldEdate
    try:
        if not oldEdate:
            oldEdate = ReadFile('/www/server/panel/data/edate.pl')
        if not oldEdate:
            oldEdate = '0000-00-00'
        mEdate = time.strftime('%Y-%m-%d', time.localtime())
        if oldEdate == mEdate:
            return False
        oldEdate = mEdate
        os.system("nohup " + get_python_bin() + " /www/server/panel/script/site_task.py > /dev/null 2>&1 &")
    except Exception as ex:
        logging.info(ex)
        pass



def GetLoadAverage():
    c = os.getloadavg()
    data = {}
    data['one'] = float(c[0])
    data['five'] = float(c[1])
    data['fifteen'] = float(c[2])
    data['max'] = cpu_count() * 2
    data['limit'] = data['max']
    data['safe'] = data['max'] * 0.75
    return data


# 系统监控任务
def systemTask():
    try:
        filename = 'data/control.conf'
        with db.Sql() as sql:
            sql = sql.dbfile('system')
            csql = '''CREATE TABLE IF NOT EXISTS `load_average` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `pro` REAL,
  `one` REAL,
  `five` REAL,
  `fifteen` REAL,
  `addtime` INTEGER
)'''
            sql.execute(csql, ())
            sql.close()

        count = 0
        reloadNum = 0
        diskio_1 = diskio_2 = networkInfo = cpuInfo = diskInfo = None
        network_up = {}
        network_down = {}
        cycle = 60
        try:
            from panelDaily import panelDaily
            panelDaily().check_databases()
        except Exception as e:
            logging.info(e)

        proc_task_obj = process_task.process_task()

        while True:
            if not os.path.exists(filename):
                time.sleep(10)
                continue

            day = 30
            try:
                day = int(ReadFile(filename))
                if day < 1:
                    time.sleep(10)
                    continue
            except:
                day = 30

            addtime = int(time.time())
            deltime = addtime - (day * 86400)
            # 取当前CPU Io
            tmp = {}
            tmp['used'] = proc_task_obj.get_monitor_list(addtime)
            tmp['mem'] = GetMemUsed()
            cpuInfo = tmp

            # 取当前网络Io
            networkIo_list = net_io_counters(pernic=True)
            tmp = {}
            tmp['upTotal'] = 0
            tmp['downTotal'] = 0
            tmp['up'] = 0
            tmp['down'] = 0
            tmp['downPackets'] = {}
            tmp['upPackets'] = {}

            for k in networkIo_list.keys():
                networkIo = networkIo_list[k][:4]
                if not k in network_up.keys():
                    network_up[k] = networkIo[0]
                    network_down[k] = networkIo[1]

                tmp['upTotal'] += networkIo[0]
                tmp['downTotal'] += networkIo[1]
                tmp['downPackets'][k] = round(
                    float((networkIo[1] - network_down[k]) / 1024) / cycle, 2)
                tmp['upPackets'][k] = round(
                    float((networkIo[0] - network_up[k]) / 1024) / cycle, 2)
                tmp['up'] += tmp['upPackets'][k]
                tmp['down'] += tmp['downPackets'][k]

                network_up[k] = networkIo[0]
                network_down[k] = networkIo[1]

            # if not networkInfo:
            #     networkInfo = tmp
            # if (tmp['up'] + tmp['down']) > (networkInfo['up'] + networkInfo['down']):
            networkInfo = tmp

            # 取磁盘Io
            disk_ios = True
            try:
                if os.path.exists('/proc/diskstats'):
                    diskio_2 = disk_io_counters()

                    if not diskio_1:
                        diskio_1 = diskio_2
                    tmp = {}
                    tmp['read_count'] = int((diskio_2.read_count - diskio_1.read_count) / cycle)
                    tmp['write_count'] = int((diskio_2.write_count - diskio_1.write_count) / cycle)
                    tmp['read_bytes'] = int((diskio_2.read_bytes - diskio_1.read_bytes) / cycle)
                    tmp['write_bytes'] = int((diskio_2.write_bytes - diskio_1.write_bytes) / cycle)
                    tmp['read_time'] = int((diskio_2.read_time - diskio_1.read_time) / cycle)
                    tmp['write_time'] = int((diskio_2.write_time - diskio_1.write_time) / cycle)

                    if not diskInfo:
                        diskInfo = tmp

                    # if (tmp['read_bytes'] + tmp['write_bytes']) > (diskInfo['read_bytes'] + diskInfo['write_bytes']):
                    diskInfo['read_count'] = tmp['read_count']
                    diskInfo['write_count'] = tmp['write_count']
                    diskInfo['read_bytes'] = tmp['read_bytes']
                    diskInfo['write_bytes'] = tmp['write_bytes']
                    diskInfo['read_time'] = tmp['read_time']
                    diskInfo['write_time'] = tmp['write_time']

                    # logging.info(['read: ',tmp['read_bytes'] / 1024 / 1024,'write: ',tmp['write_bytes'] / 1024 / 1024])
                    diskio_1 = diskio_2
            except:
                logging.info(public.get_error_info())
                disk_ios = False

            try:
                sql = db.Sql().dbfile('system')
                data = (cpuInfo['used'], cpuInfo['mem'], addtime)
                sql.table('cpuio').add('pro,mem,addtime', data)
                sql.table('cpuio').where("addtime<?", (deltime,)).delete()
                data = (networkInfo['up'], networkInfo['down'], networkInfo['upTotal'], networkInfo['downTotal'], dumps(networkInfo['downPackets']), dumps(networkInfo['upPackets']), addtime)
                sql.table('network').add('up,down,total_up,total_down,down_packets,up_packets,addtime', data)
                sql.table('network').where("addtime<?", (deltime,)).delete()
                # logging.info(diskInfo)
                if os.path.exists('/proc/diskstats') and disk_ios:
                    data = (diskInfo['read_count'], diskInfo['write_count'], diskInfo['read_bytes'], diskInfo['write_bytes'], diskInfo['read_time'], diskInfo['write_time'], addtime)
                    sql.table('diskio').add('read_count,write_count,read_bytes,write_bytes,read_time,write_time,addtime', data)
                    sql.table('diskio').where("addtime<?", (deltime,)).delete()

                # LoadAverage
                load_average = GetLoadAverage()
                lpro = round(
                    (load_average['one'] / load_average['max']) * 100, 2)
                if lpro > 100:
                    lpro = 100
                sql.table('load_average').add('pro,one,five,fifteen,addtime', (lpro, load_average['one'], load_average['five'], load_average['fifteen'], addtime))
                sql.table('load_average').where("addtime<?", (deltime,)).delete()
                sql.close()

                lpro = None
                load_average = None
                cpuInfo = None
                networkInfo = None
                diskInfo = None
                data = None
                count = 0
                reloadNum += 1
                if reloadNum > 1440:
                    reloadNum = 0

                # 日报数据收集
                if os.path.exists("/www/server/panel/data/start_daily.pl"):
                    try:
                        from panelDaily import panelDaily
                        pd = panelDaily()
                        t_now = time.localtime()
                        yesterday = time.localtime(time.mktime((
                            t_now.tm_year, t_now.tm_mon, t_now.tm_mday - 1,
                            0, 0, 0, 0, 0, 0
                        )))
                        yes_time_key = pd.get_time_key(yesterday)
                        con = ReadFile("/www/server/panel/data/store_app_usage.pl")
                        # logging.info(str(con))
                        store = False
                        if con:
                            if con != str(yes_time_key):
                                store = True
                        else:
                            store = True

                        if store:
                            date_str = str(yes_time_key)
                            pd.store_app_usage(yes_time_key)
                            pd.check_server()
                            daily_data = pd.get_daily_data_local(date_str)
                            if "status" in daily_data.keys():
                                if daily_data["status"]:
                                    score = daily_data["score"]
                                    if public.M("system").dbfile("system").table("daily").where("time_key=?", (yes_time_key,)).count() == 0:
                                        public.M("system").dbfile("system").table("daily").add("time_key,evaluate,addtime", (yes_time_key, score, time.time()))
                                    # pd.store_app_usage(yes_time_key)
                                    WriteFile("/www/server/panel/data/store_app_usage.pl", str(yes_time_key), "w")
                                # logging.info("更新应用存储信息:"+str(yes_time_key))
                                # pd.check_server()
                    except Exception as e:
                        logging.info("存储应用空间信息错误:" + str(e))
            except Exception as ex:
                logging.info(str(ex))
            del (tmp)
            time.sleep(cycle)
            count += 1
    except Exception as ex:
        logging.info(ex)
        time.sleep(cycle)
        systemTask()


# 取内存使用率
def GetMemUsed():
    try:
        mem = virtual_memory()
        memInfo = {'memTotal': mem.total / 1024 / 1024, 'memFree': mem.free / 1024 / 1024,
                   'memBuffers': mem.buffers / 1024 / 1024, 'memCached': mem.cached / 1024 / 1024}
        tmp = memInfo['memTotal'] - memInfo['memFree'] - \
              memInfo['memBuffers'] - memInfo['memCached']
        tmp1 = memInfo['memTotal'] / 100
        return (tmp / tmp1)
    except:
        return 1


# 检查502错误


def check502():
    try:
        phpversions = public.get_php_versions()
        for version in phpversions:
            if version in ['52', '5.2']: continue
            php_path = '/www/server/php/' + version + '/sbin/php-fpm'
            if not os.path.exists(php_path):
                continue
            if checkPHPVersion(version):
                continue
            if startPHPVersion(version):
                public.WriteLog('PHP守护程序', '检测到PHP-' + version + '处理异常,已自动修复!', not_web=True)
    except Exception as ex:
        logging.info(ex)


# 处理指定PHP版本
def startPHPVersion(version):
    try:
        fpm = '/etc/init.d/php-fpm-' + version
        php_path = '/www/server/php/' + version + '/sbin/php-fpm'
        if not os.path.exists(php_path):
            if os.path.exists(fpm):
                os.remove(fpm)
            return False

        # 尝试重载服务
        os.system(fpm + ' start')
        os.system(fpm + ' reload')
        if checkPHPVersion(version):
            return True

        # 尝试重启服务
        cgi = '/tmp/php-cgi-' + version + '.sock'
        pid = '/www/server/php/' + version + '/var/run/php-fpm.pid'
        os.system('pkill -9 php-fpm-' + version)
        time.sleep(0.5)
        if os.path.exists(cgi):
            os.remove(cgi)
        if os.path.exists(pid):
            os.remove(pid)
        os.system(fpm + ' start')
        if checkPHPVersion(version):
            return True
        # 检查是否正确启动
        if os.path.exists(cgi):
            return True
        return False
    except Exception as ex:
        logging.info(ex)
        return True


# 检查指定PHP版本
def checkPHPVersion(version):
    try:
        cgi_file = '/tmp/php-cgi-{}.sock'.format(version)
        if os.path.exists(cgi_file):
            init_file = '/etc/init.d/php-fpm-{}'.format(version)
            if os.path.exists(init_file):
                init_body = public.ReadFile(init_file)
                if not init_body: return True
            uri = "/phpfpm_" + version + "_status?json"
            result = public.request_php(version, uri, '')
            loads(result)
        return True
    except:
        logging.info("检测到PHP-{}无法访问".format(version))
        return False


"""
@name 检查当前节点是否可用
"""
def check_node_status():
    try:
        node_path = '{}/data/node_url.pl'.format(public.get_panel_path())
        if not os.path.exists(node_path):
            return False

        mtime = os.path.getmtime(node_path)
        if time.time() - mtime < 86400:
            return False

        os.system("nohup " + get_python_bin() + " /www/server/panel/script/reload_check.py auth_day > /dev/null 2>&1 &")
    except:
        pass

# 502错误检查线程
def check502Task():
    try:
        while True:

            check_node_status()
            public.auto_backup_panel()
            # public.auto_backup_defalt_db()
            check502()
            sess_expire()
            mysql_quota_check()
            siteEdate()
            time.sleep(600)
            PluginLoader.daemon_panel()

    except Exception as ex:
        logging.info(ex)
        time.sleep(600)
        PluginLoader.daemon_panel()
        check502Task()


# MySQL配额检查
def mysql_quota_check():
    os.system("nohup " + get_python_bin() + " /www/server/panel/script/mysql_quota.py > /dev/null 2>&1 &")


# session过期处理
def sess_expire():
    try:
        sess_path = '/www/server/panel/data/session'
        if not os.path.exists(sess_path):
            return
        s_time = time.time()
        f_list = os.listdir(sess_path)
        f_num = len(f_list)
        for fname in f_list:
            filename = '/'.join((sess_path, fname))
            fstat = os.stat(filename)
            f_time = s_time - fstat.st_mtime
            if f_time > 3600:
                os.remove(filename)
                continue
            if fstat.st_size < 256 and len(fname) == 32:
                if f_time > 60 or f_num > 30:
                    os.remove(filename)
                    continue
        del (f_list)
    except Exception as ex:
        logging.info(str(ex))


# 检查面板证书是否有更新
def check_panel_ssl():
    try:
        while True:
            lets_info = ReadFile("/www/server/panel/ssl/lets.info")
            if not lets_info:
                time.sleep(3600)
                continue
            os.system("nohup " + get_python_bin() + " /www/server/panel/script/panel_ssl_task.py > /dev/null 2>&1 &")
            time.sleep(3600)
    except Exception as e:
        public.writeFile("/tmp/panelSSL.pl", str(e), "a+")


# 面板进程守护
def daemon_panel():
    cycle = 10
    panel_pid_file = "{}/logs/panel.pid".format(public.get_panel_path())
    while 1:
        time.sleep(cycle)

        # 检查pid文件是否存在
        if not os.path.exists(panel_pid_file):
            continue

        # 读取pid文件
        panel_pid = public.readFile(panel_pid_file)
        if not panel_pid:
            service_panel('start')
            continue

        # 检查进程是否存在
        comm_file = "/proc/{}/comm".format(panel_pid)
        if not os.path.exists(comm_file):
            service_panel('start')
            continue

        # 是否为面板进程
        comm = public.readFile(comm_file)
        if comm.find('BT-Panel') == -1:
            service_panel('start')
            continue


def update_panel():
    os.system("curl -k https://download.bt.cn/install/update6.sh|bash &")


def service_panel(action='reload'):
    if not os.path.exists('/www/server/panel/init.sh'):
        update_panel()
    else:
        os.system("nohup bash /www/server/panel/init.sh {} > /dev/null 2>&1 &".format(action))
    logging.info("面板服务: {}".format(action))


# 重启面板服务
def restart_panel_service():
    rtips = 'data/restart.pl'
    reload_tips = 'data/reload.pl'
    while True:
        if os.path.exists(rtips):
            os.remove(rtips)
            service_panel('restart')
        if os.path.exists(reload_tips):
            os.remove(reload_tips)
            service_panel('reload')
        time.sleep(1)


# 取面板pid
def get_panel_pid():
    try:
        pid = ReadFile('/www/server/panel/logs/panel.pid')
        if pid:
            return int(pid)
        for pid in pids():
            try:
                p = Process(pid)
                n = p.cmdline()[-1]
                if n.find('runserver') != -1 or n.find('BT-Panel') != -1:
                    return pid
            except:
                pass
    except:
        pass
    return None


def HttpGet(url, timeout=6, headers={}):
    if sys.version_info[0] == 2:
        try:
            import urllib2
            req = urllib2.Request(url, headers=headers)
            response = urllib2.urlopen(req, timeout=timeout, )
            return response.read()
        except Exception as ex:
            logging.info(str(ex))
            return str(ex)
    else:
        try:
            import urllib.request
            req = urllib.request.Request(url, headers=headers)
            response = urllib.request.urlopen(req, timeout=timeout)
            result = response.read()
            if type(result) == bytes:
                result = result.decode('utf-8')
            return result
        except Exception as ex:
            logging.info("URL: {}  => {}".format(url, ex))
            return str(ex)


# 定时任务去检测邮件信息
def send_mail_time():
    while True:
        try:
            os.system("nohup " + get_python_bin() + " /www/server/panel/script/mail_task.py > /dev/null 2>&1 &")
            time.sleep(59)
        except:
            time.sleep(59)
            send_mail_time()


# 5个小时更新一次更新软件列表
def update_software_list():
    while True:
        try:
            import panelPlugin
            panelPlugin.panelPlugin().get_cloud_list_status(None)
            time.sleep(18000)
        except:
            time.sleep(1800)
            update_software_list()


# 面板消息提醒
def check_panel_msg():
    python_bin = get_python_bin()
    while True:
        os.system('nohup {} /www/server/panel/script/check_msg.py > /dev/null 2>&1 &'.format(python_bin))
        time.sleep(3600)


# 面板推送消息
def push_msg():
    python_bin = get_python_bin()
    while True:
        time.sleep(60)
        os.system('nohup {} /www/server/panel/script/push_msg.py > /dev/null 2>&1 &'.format(python_bin))


def JavaProDaemons():
    '''
        @name Java 项目守护进程
        @author lkq@bt.cn
        @time 2022-07-19
        @param None
    '''
    if public.M('sites').where('project_type=?', ('Java')).count() >= 1:
        project_info = public.M('sites').where('project_type=?', ('Java')).select()
        for i in project_info:
            try:
                import json
                i['project_config'] = json.loads(i['project_config'])
                # 判断项目是否设置了守护进程
                if i['project_config']['java_type'] != 'springboot': continue
                if 'auth' in i['project_config'] and i['project_config']['auth'] == 1 or i['project_config']['auth'] == '1':
                    print("Java", i['name'])
                    from projectModel import javaModel
                    java = javaModel.main()
                    if java.get_project_run_state(project_name=i['name']):
                        continue
                    else:
                        # 如果项目是在后台停止的，那么就不再启动
                        if os.path.exists("/var/tmp/springboot/vhost/pids/{}.pid".format(i['name'])):
                            get = public.dict_obj()
                            get.project_name = i['name']
                            java.start_project(get)
                            public.WriteLog('守护进程', 'Java项目[{}]已经被守护进程启动'.format(i['name']))
            except:
                continue


def GoDaemons():
    '''
        @name Go 项目守护进程
        @author lkq@bt.cn
        @time 2022-07-19
        @param None
    '''
    if public.M('sites').where('project_type=?', ('Go')).count() >= 1:
        project_info = public.M('sites').where('project_type=?', ('Go')).select()
        for i in project_info:
            try:
                import json
                i['project_config'] = json.loads(i['project_config'])
                if 'is_power_on' in i['project_config'] and i['project_config']['is_power_on'] == 1 or i['project_config']['is_power_on'] == '1':
                    from projectModel import goModel
                    java = goModel.main()
                    if java.get_project_run_state(project_name=i['name']):
                        continue
                    else:
                        # 如果项目是在后台停止的，那么就不再启动
                        if os.path.exists("/var/tmp/gopids/{}.pid".format(i['name'])):
                            get = public.dict_obj()
                            get.project_name = i['name']
                            java.start_project(get)
                            public.WriteLog('守护进程', 'Go项目[{}]已经被守护进程启动'.format(i['name']))
            except:
                continue


def PythonDaemons():
    '''
        @name Python 项目守护进程
        @author baozi@bt.cn
        @time 2023-10-21
    '''
    if public.M('sites').where('project_type=?', ('Python')).count() >= 1:
        project_info = public.M('sites').where('project_type=?', ('Python')).select()
        for i in project_info:
            try:
                import json
                from projectModel import pythonModel

                i['project_config'] = json.loads(i['project_config'])
                if 'auto_run' in i['project_config'] and i['project_config']['auto_run'] in ["1", 1, True, "true"]:
                    python_obj = pythonModel.main()
                    if python_obj.get_project_run_state(project_name=i['name']):
                        continue
                    else:
                        if not python_obj.is_stop_by_user(i["id"]):
                            # 如果项目是在后台停止的，那么就不再启动
                            get = public.dict_obj()
                            get.name = i['name']
                            python_obj.StartProject(get)
                            public.WriteLog('守护进程', 'Python项目[{}]已经被守护进程启动'.format(i['name']))
            except:
                continue


def ProLog():
    path_list = ["/www/server/go_project/vhost/logs", "/var/tmp/springboot/vhost/logs/"]
    try:
        for i2 in path_list:
            if os.path.exists(i2):
                for dir in os.listdir(i2):
                    dir = os.path.join(i2, dir)
                    # 判断当前目录是否为文件夹
                    if os.path.isfile(dir):
                        if dir.endswith(".log"):
                            # 文件大于500M的时候则清空文件
                            if os.stat(dir).st_size > 200000000:
                                public.ExecShell("echo ''>{}".format(dir))
    except:
        pass


def ProDadmons():
    '''
        @name 项目守护进程
        @author
    '''
    n = 30
    while 1:
        n += 1
        if n >= 30:
            n = 1
            ProLog()
        wait_daemon_time()
        try:
            JavaProDaemons()
        except:
            pass
        GoDaemons()
        PythonDaemons()


def wait_daemon_time():
    last_time_out = get_daemon_time()
    use_time = 0
    while use_time < last_time_out:
        time.sleep(5)
        use_time += 5
        new_time_out = get_daemon_time()
        if new_time_out != last_time_out:
            if use_time > new_time_out:
                break
            else:
                last_time_out = new_time_out


def get_daemon_time():
    if os.path.exists("/www/server/panel/data/daemon_time.pl"):
        time_out = int(public.readFile("/www/server/panel/data/daemon_time.pl"))
        if time_out < 10:
            time_out = 10
        if time_out > 30 * 60:
            time_out = 30 * 60
    else:
        time_out = 120
    return time_out


def process_task_thread():
    '''
        @name 进程监控
        @auther hwliang
    '''

    # 进程流量监控，如果文件：/www/server/panel/data/is_net_task.pl 或 /www/server/panel/data/control.conf不存在，则不监控进程流量
    net_task_obj = process_task.process_network_total()
    net_task_obj.start()


def run_tasks_list():
    """
    @name 延时启动任务
    """
    spath = '{}/data/tasks'.format(public.get_panel_path())

    try:
        import PluginLoader
    except:
        pass

    while True:
        if os.path.exists(spath):
            for file in os.listdir(spath):
                filename = '{}/{}'.format(spath, file)
                try:
                    data = loads(public.readFile(filename))
                    # 超过执行时间
                    if time.time() > data['time']:
                        # 插件
                        if data['type'] == 2:
                            res = PluginLoader.plugin_run(data['name'], data['fun'], public.to_dict_obj(data['args']))
                            if not res['status']: continue

                            os.remove(filename)
                            public.WriteLog(data['title'], res['msg'])
                        elif data['type'] == 1:
                            # 面板
                            pass
                except:
                    os.remove(filename)
        time.sleep(60)


def check_database_quota():
    get = public.dict_obj()
    get.model_index = "project"
    while True:
        num = PluginLoader.module_run("quota", "database_quota_check", get)
        if num == 0:
            break
        time.sleep(60)


def run_thread():
    global thread_dict, task_obj
    tkeys = thread_dict.keys()

    thread_list = {
        "start_task": task_obj.start_task,
        "systemTask": systemTask,
        "check502Task": check502Task,
        "daemon_panel": daemon_panel,
        "restart_panel_service": restart_panel_service,
        "check_panel_ssl": check_panel_ssl,
        "update_software_list": update_software_list,
        "send_mail_time": send_mail_time,
        "check_panel_msg": check_panel_msg,
        "push_msg": push_msg,
        "ProDadmons": ProDadmons,
        "process_task_thread": process_task_thread,
        'run_tasks_list': run_tasks_list,
        "check_database_quota": check_database_quota,
    }

    for skey in thread_list.keys():
        if not skey in tkeys or not thread_dict[skey].is_alive():
            thread_dict[skey] = threading.Thread(target=thread_list[skey])
            thread_dict[skey].setDaemon(True)
            thread_dict[skey].start()


def main():
    main_pid = 'logs/task.pid'
    if os.path.exists(main_pid):
        os.system("kill -9 $(cat {}) &> /dev/null".format(main_pid))
    pid = os.fork()
    if pid:
        sys.exit(0)

    os.setsid()

    _pid = os.fork()
    if _pid:
        public.writeFile(main_pid, str(_pid))
        sys.exit(0)

    sys.stdout.flush()
    sys.stderr.flush()
    task_log_file = 'logs/task.log'
    try:
        logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s]: %(message)s',
                            datefmt='%Y-%m-%d %H:%M:%S', filename=task_log_file, filemode='a+')
    except Exception as ex:
        print(ex)
    logging.info('服务已启动')
    time.sleep(5)
    run_thread()
    startTask()


if __name__ == "__main__":
    main()
