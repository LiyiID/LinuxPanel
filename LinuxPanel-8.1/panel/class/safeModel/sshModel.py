# coding: utf-8
# -------------------------------------------------------------------
# 宝塔Linux面板
# -------------------------------------------------------------------
# Copyright (c) 2015-2099 宝塔软件(http://bt.cn) All rights reserved.
# -------------------------------------------------------------------
# Author: hwliang <hwl@bt.cn>
# -------------------------------------------------------------------

# ssh信息
# ------------------------------
import json
import os
import re
import time

import public
from safeModel.base import safeBase


class main(safeBase):

    def __init__(self):
        pass

    def get_ssh_intrusion(self, get):
        """
        @获取SSH爆破次数
        @param get:
        """
        result = {'error': 0, 'success': 0, 'today_error': 0, 'today_success': 0}
        if os.path.exists("/etc/debian_version"):
            version = public.readFile('/etc/debian_version').strip()
            if 'bookworm' in version or 'jammy' in version or 'impish' in version:
                version = 12
            else:
                try:
                    version = float(version)
                except:
                    version = 11
            if version >= 12:
                try:
                    err_num1 = int(public.ExecShell(
                        "journalctl -u ssh --no-pager |grep -a 'Failed password for' |grep -v 'invalid' |wc -l")[0])
                    err_num2 = int(public.ExecShell(
                        "journalctl -u ssh --no-pager|grep -a 'Connection closed by authenticating user' |grep -a 'preauth' |wc -l")[
                                       0])
                    result['error'] = err_num1 + err_num2
                    result['success'] = int(public.ExecShell("journalctl -u ssh --no-pager|grep -a 'Accepted' |wc -l")[0].decode('utf-8'))

                    today_err_num1 = int(public.ExecShell(
                        "journalctl -u ssh --no-pager -S today |grep -a 'Failed password for' |grep -v 'invalid' |wc -l")[
                                             0])
                    today_err_num2 = int(public.ExecShell(
                        "journalctl -u ssh --no-pager -S today |grep -a 'Connection closed by authenticating user' |grep -a 'preauth' |wc -l")[
                                             0])
                    result['today_error'] = today_err_num1 + today_err_num2
                    result['today_success'] = int(
                        public.ExecShell("journalctl -u ssh --no-pager -S today |grep -a 'Accepted' |wc -l")[0])
                except:
                    pass
                return result

        # data = self.get_ssh_cache()
        for sfile in self.get_ssh_log_files(None):
            for stype in result.keys():
                try:
                    count = 0
                    time_formatted = time.strftime('%b  %d', time.localtime())
                    month, day = time_formatted.split()
                    day = day.lstrip('0')

                    formatted_time = "{}  {}".format(month, day)
                    formatted_time1 = "{} {} ".format(month, day)
                    if stype == 'error':
                        cmd1 = "cat %s|grep -a 'Failed password for' |grep -v 'invalid' |wc -l" % (sfile)
                        cmd2 = "cat %s|grep -a 'Connection closed by authenticating user' |grep -a 'preauth' |wc -l" % (sfile)
                        cmd3 = "cat %s|grep -a 'PAM service(sshd) ignoring max retries' |wc -l" % (sfile)
                        num1 = int(public.ExecShell(cmd1)[0].strip())
                        num2 = int(public.ExecShell(cmd2)[0].strip())
                        num3 = int(public.ExecShell(cmd3)[0].strip())
                        count = num1 + num2 + num3
                        # 可能存在cmd1和cmd2中都存在同一条记录 进行去重
                        try:
                            tmp1 = public.ExecShell("cat %s|grep -a 'Failed password for' |grep -v 'invalid' |awk '{print $5}'" % (sfile))
                            tmp2 = public.ExecShell("cat %s|grep -a 'Connection closed by authenticating user' |grep -a 'preauth' |awk '{print $5}'" % (sfile))
                            tmp3 = public.ExecShell("cat %s|grep -a 'PAM service(sshd) ignoring max retries' |awk '{print $5}'" % (sfile))
                            tmp1 = tmp1[0].strip().split('\n')
                            tmp2 = tmp2[0].strip().split('\n')
                            tmp3 = tmp3[0].strip().split('\n')
                            count -= len([i for i in tmp1 if i in tmp2 and i])
                            count -= len([i for i in tmp1 if i in tmp3 and i])
                            count -= len([i for i in tmp2 if i in tmp3 and i])
                        except:
                            pass
                    elif stype == 'success':
                        cmd1 = "cat %s|grep -a 'Accepted' |wc -l" % (sfile)
                        cmd2 = "cat %s|grep -a 'sshd\[.*session opened for user' |wc -l" % (sfile)
                        count = int(public.ExecShell(cmd1)[0].strip())
                        count += int(public.ExecShell(cmd2)[0].strip())
                        # 可能存在cmd1和cmd2中都存在同一条记录 进行去重
                        try:
                            tmp1 = public.ExecShell("cat %s|grep -a 'Accepted' |awk '{print $5}'" % (sfile))
                            tmp2 = public.ExecShell("cat %s|grep -a 'sshd\[.*session opened for user' |awk '{print $5}'" % (sfile))
                            tmp1 = tmp1[0].strip().split('\n')
                            tmp2 = tmp2[0].strip().split('\n')
                            count -= len([i for i in tmp1 if i in tmp2 and i])
                        except:
                            pass
                    elif stype == 'today_error':
                        cmd1 = "cat %s|grep -a 'Failed password for' |grep -v 'invalid' |grep -aE '%s|%s' |wc -l" % (
                            sfile, formatted_time, formatted_time1)
                        cmd2 = "cat %s|grep -a 'Connection closed by authenticating user' |grep -a 'preauth' |grep -aE '%s|%s' |wc -l" % (
                            sfile, formatted_time, formatted_time1)
                        cmd3 = "cat %s|grep -a 'PAM service(sshd) ignoring max retries' |grep -aE '%s|%s' |wc -l" % (
                            sfile, formatted_time, formatted_time1)
                        num1 = int(public.ExecShell(cmd1)[0].strip())
                        num2 = int(public.ExecShell(cmd2)[0].strip())
                        num3 = int(public.ExecShell(cmd3)[0].strip())
                        count = num1 + num2 + num3
                        # 可能存在cmd1和cmd2中都存在同一条记录 进行去重
                        try:
                            tmp1 = public.ExecShell("cat %s|grep -a 'Failed password for' |grep -v 'invalid' |grep -aE '%s|%s' |awk '{print $5}'" % (sfile, formatted_time, formatted_time1))
                            tmp2 = public.ExecShell("cat %s|grep -a 'Connection closed by authenticating user' |grep -a 'preauth' |grep -aE '%s|%s' |awk '{print $5}'" % (sfile, formatted_time, formatted_time1))
                            tmp3 = public.ExecShell("cat %s|grep -a 'PAM service(sshd) ignoring max retries' |grep -aE '%s|%s' |awk '{print $5}'" % (sfile, formatted_time, formatted_time1))
                            tmp1 = tmp1[0].strip().split('\n')
                            tmp2 = tmp2[0].strip().split('\n')
                            tmp3 = tmp3[0].strip().split('\n')
                            count -= len([i for i in tmp1 if i in tmp2 and i])
                            count -= len([i for i in tmp1 if i in tmp3 and i])
                            count -= len([i for i in tmp2 if i in tmp3 and i])
                        except:
                            pass
                    elif stype == 'today_success':
                        cmd1 = "cat %s|grep -a 'Accepted' |grep -aE '%s|%s' |wc -l" % (sfile, formatted_time, formatted_time1)
                        cmd2 = "cat %s|grep -a 'sshd\[.*session opened for user' |grep -aE '%s|%s' |wc -l" % (
                            sfile, formatted_time, formatted_time1)
                        count = int(public.ExecShell(cmd1)[0].strip())
                        count += int(public.ExecShell(cmd2)[0].strip())
                        # 可能存在cmd1和cmd2中都存在同一条记录 进行去重  2024.3.22
                        try:
                            tmp1 = public.ExecShell("cat %s|grep -a 'Accepted' |grep -aE '%s|%s' |awk '{print $5}'" % (sfile, formatted_time, formatted_time1))
                            tmp2 = public.ExecShell("cat %s|grep -a 'sshd\[.*session opened for user' |grep -aE '%s|%s' |awk '{print $5}'" % (sfile, formatted_time, formatted_time1))
                            tmp1 = tmp1[0].strip().split('\n')
                            tmp2 = tmp2[0].strip().split('\n')
                            count -= len([i for i in tmp1 if i in tmp2 and i])
                        except:
                            pass

                except:
                    continue

                result[stype] += count
        return result

    def get_ssh_cache(self):
        """
        @获取换成ssh记录
        """
        file = '{}/data/ssh_cache.json'.format(public.get_panel_path())
        cache_data = {'success': {}, 'error': {}, 'today_success': {}, 'today_error': {}}
        if not os.path.exists(file):
            public.writeFile(file, json.dumps(cache_data))
            return cache_data

        try:
            data = json.loads(public.readFile(file))
        except:
            public.writeFile(file, json.dumps(cache_data))
            data = cache_data

        return data

    def set_ssh_cache(self, data):
        """
        @设置ssh缓存
        """
        file = '{}/data/ssh_cache.json'.format(public.get_panel_path())
        public.writeFile(file, json.dumps(data))
        return True

    def GetSshInfo(self, get):
        """
        @获取SSH登录信息

        """
        port = public.get_sshd_port()
        status = public.get_sshd_status()
        isPing = True
        try:
            file = '/etc/sysctl.conf'
            conf = public.readFile(file)
            rep = r"#*net\.ipv4\.icmp_echo_ignore_all\s*=\s*([0-9]+)"
            tmp = re.search(rep, conf).groups(0)[0]
            if tmp == '1': isPing = False
        except:
            isPing = True

        data = {}
        data['port'] = port
        data['status'] = status
        data['ping'] = isPing
        data['firewall_status'] = self.CheckFirewallStatus()
        # data['error'] = self.get_ssh_intrusion(get)
        data['fail2ban'] = self._get_ssh_fail2ban()
        return data

    def get_ssh_login_info(self, get):
        """
        @获取SSH登录信息
        """
        return self.get_ssh_intrusion(get)

    @staticmethod
    def _get_ssh_fail2ban():
        """
        @name 获取fail2ban的服务和SSH防爆破状态
        @return:
        """
        plugin_path = "/www/server/panel/plugin/fail2ban"
        result_data = {"status": 0, "installed": 1}
        if not os.path.exists("{}".format(plugin_path)):
            result_data['installed'] = 0
            return result_data

        sock = "{}/fail2ban.sock".format(plugin_path)
        if not os.path.exists(sock):
            return result_data

        s_file = '{}/plugin/fail2ban/config.json'.format(public.get_panel_path())
        if os.path.exists(s_file):
            try:
                data = json.loads(public.readFile(s_file))
                if 'sshd' in data:
                    if data['sshd']['act'] == 'true':
                        result_data['status'] = 1
                        return result_data
            except:
                pass

        return result_data

    # 改远程端口
    def SetSshPort(self, get):
        port = get.port
        if int(port) < 22 or int(port) > 65535: return public.returnMsg(False, 'FIREWALL_SSH_PORT_ERR')
        ports = ['21', '25', '80', '443', '8080', '888', '8888']
        if port in ports: return public.returnMsg(False, '请不要使用常用程序的默认端口!')
        file = '/etc/ssh/sshd_config'
        conf = public.readFile(file)

        rep = r"#*Port\s+([0-9]+)\s*\n"
        conf = re.sub(rep, "Port " + port + "\n", conf)
        public.writeFile(file, conf)

        if self.__isFirewalld:
            public.ExecShell('firewall-cmd --permanent --zone=public --add-port=' + port + '/tcp')
            public.ExecShell('setenforce 0')
            public.ExecShell('sed -i "s#SELINUX=enforcing#SELINUX=disabled#" /etc/selinux/config')
            public.ExecShell("systemctl restart sshd.service")
        elif self.__isUfw:
            public.ExecShell('ufw allow ' + port + '/tcp')
            public.ExecShell("service ssh restart")
        else:
            public.ExecShell('iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport ' + port + ' -j ACCEPT')
            public.ExecShell("/etc/init.d/sshd restart")

        self.FirewallReload()
        public.M('firewall').where("ps=? or ps=? or port=?", ('SSH远程管理服务', 'SSH远程服务', port)).delete()
        public.M('firewall').add('port,ps,addtime', (port, 'SSH远程服务', time.strftime('%Y-%m-%d %X', time.localtime())))
        public.WriteLog("TYPE_FIREWALL", "FIREWALL_SSH_PORT", (port,))
        return public.returnMsg(True, 'EDIT_SUCCESS')

    def SetSshStatus(self, get):
        """
        @设置SSH状态
        """
        get.exists(["status"])
        if int(get['status']) == 1:
            msg = public.getMsg('FIREWALL_SSH_STOP')
            act = 'stop'
        else:
            msg = public.getMsg('FIREWALL_SSH_START')
            act = 'start'

        public.ExecShell("/etc/init.d/sshd " + act)
        public.ExecShell('service ssh ' + act)
        public.ExecShell("systemctl " + act + " sshd")
        public.ExecShell("systemctl " + act + " ssh")

        public.WriteLog("TYPE_FIREWALL", msg)
        return public.returnMsg(True, 'SUCCESS')
