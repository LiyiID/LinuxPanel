# coding: utf-8
# +-------------------------------------------------------------------
# | 宝塔Linux面板
# +-------------------------------------------------------------------
# | Copyright (c) 2015-2099 宝塔软件(http:#bt.cn) All rights reserved.
# +-------------------------------------------------------------------
# | Author: hwliang <hwl@bt.cn>
# +-------------------------------------------------------------------

import public, os, sys, db, time, json, re
from BTPanel import session, cache, json_header
from flask import request, redirect, g, render_template


class userlogin:
    limit_expire_time = 0

    # 离线版权限认证函数
    def offlinepanelpower(self):
        try:
            from panelPlugin import panelPlugin
            args = public.to_dict_obj({})
            args.p = 1
            args.row = 1
            try:
                plugin = panelPlugin().get_soft_list(args)
            except:
                return True
            if not plugin['ltd']: return True
            if int(plugin['ltd']) < int(time.time()):
                return True
            return False
        except:
            return True

    def request_post(self, post):
        # 离线版用户登录验证
        if os.path.exists("/www/server/panel/data/local_tip.pl"):
            if self.offlinepanelpower():
                return render_template('offlinepanelpower.html')
        if not hasattr(post, 'username') or not hasattr(post, 'password'):
            return public.returnJson(False, 'LOGIN_USER_EMPTY'), json_header

        self.error_num(False)
        if self.limit_address('?') < 1: return public.returnJson(False, '您多次登录失败,暂时禁止登录,请等待{}秒后重试!'.format(int(self.limit_expire_time - time.time()))), json_header
        post.username = post.username.strip()
        format_error = '参数格式错误'

        # 标记会话安全模式 -- 不要删除
        g.session_safe_mode = False
        if hasattr(post, 'safe_mode'): 
            if post.safe_mode == '1': g.session_safe_mode = True

        # 核验用户名密码格式
        post.username = public.rsa_decrypt(post.username)
        if len(post.username) != 32:
            return public.returnMsg(False, format_error), json_header
        post.password = public.rsa_decrypt(post.password)
        if len(post.password) != 32:
            return public.returnMsg(False, format_error), json_header

        if not re.match(r"^\w+$", post.username): return public.returnMsg(False, format_error), json_header
        if not re.match(r"^\w+$", post.password): return public.returnMsg(False, format_error), json_header
        last_login_token = session.get('last_login_token', None)
        if not last_login_token:
            public.WriteLog('TYPE_LOGIN', 'LOGIN_ERR_CODE', ('****', '****', public.GetClientIp()))
            return public.returnJson(False, "验证失败，请刷新页面重新登录!"), json_header

        public.chdck_salt()
        sql = db.Sql()
        userInfo = None
        user_plugin_file = '{}/users_main.py'.format(public.get_plugin_path('users'))
        if os.path.exists(user_plugin_file):
            user_list = public.M('users').field('id,username,password,salt').select()
            for u_info in user_list:
                if public.md5(public.md5(u_info['username'] + last_login_token)) == post.username:
                    userInfo = u_info
        else:
            userInfo = public.M('users').where('id=?', 1).field('id,username,password,salt').find()

        if 'code' in session:
            if session['code'] and not 'is_verify_password' in session:
                if not hasattr(post, 'code'): return public.returnJson(False, '验证码不能为空!'), json_header
                if not re.match(r"^\w+$", post.code): return public.returnJson(False, 'CODE_ERR'), json_header
                if not public.checkCode(post.code):
                    public.WriteLog('TYPE_LOGIN', 'LOGIN_ERR_CODE', ('****', '****', public.GetClientIp()))
                    return public.returnJson(False, 'CODE_ERR'), json_header
        try:
            if not userInfo:
                public.WriteLog('TYPE_LOGIN', 'LOGIN_ERR_PASS', ('****', '******', public.GetClientIp()))
                num = self.limit_address('+')
                if not num: return public.returnJson(False, '您多次登录失败,暂时禁止登录,请等待{}秒后重试!'.format(int(self.limit_expire_time - time.time()))), json_header
                return public.returnJson(False, '用户名或密码错误，请刷新页面重试，您还可以重试[{}]次'.format(num)), json_header

            if userInfo and not userInfo['salt']:
                public.chdck_salt()
                userInfo = public.M('users').where('id=?', (userInfo['id'],)).field('id,username,password,salt').find()

            password = public.md5(post.password.strip() + userInfo['salt'])
            s_username = public.md5(public.md5(userInfo['username'] + last_login_token))
            if s_username != post.username or userInfo['password'] != password:
                public.WriteLog('TYPE_LOGIN', 'LOGIN_ERR_PASS', ('****', '******', public.GetClientIp()))
                num = self.limit_address('+')
                if not num: return public.returnJson(False, '您多次登录失败,暂时禁止登录,请等待{}秒后重试!'.format(int(self.limit_expire_time - time.time()))), json_header
                return public.returnJson(False, 'LOGIN_USER_ERR', (str(num),)), json_header
            _key_file = "/www/server/panel/data/two_step_auth.txt"

            area_check = public.check_area_panel()
            if area_check: return area_check

            # 密码过期检测
            if sys.path[0] != 'class/': sys.path.insert(0, 'class/')
            if not public.password_expire_check():
                session['password_expire'] = True

            # 登陆告警
            # public.run_thread(public.login_send_body,("账号密码",userInfo['username'],public.GetClientIp(),str(int(request.environ.get('REMOTE_PORT')))))
            # public.login_send_body("账号密码",userInfo['username'],public.GetClientIp(),str(request.environ.get('REMOTE_PORT')))
            if hasattr(post, 'vcode'):
                if not re.match(r"^\d+$", post.vcode): return public.returnJson(False, '验证码格式错误'), json_header
                if self.limit_address('?', v="vcode") < 1: return public.returnJson(False, '您多次验证失败，禁止10分钟'), json_header
                import pyotp
                secret_key = public.readFile(_key_file)
                if not secret_key:
                    return public.returnJson(False, "没有找到key,请尝试在命令行关闭谷歌验证后在开启"), json_header
                t = pyotp.TOTP(secret_key)
                result = t.verify(post.vcode)
                if not result:
                    if public.sync_date(): result = t.verify(post.vcode)
                    if not result:
                        num = self.limit_address('++', v="vcode")
                        return public.returnJson(False, '验证失败，您还可以尝试[{}]次!'.format(num)), json_header
                now = int(time.time())
                public.run_thread(public.login_send_body, ("账号密码", userInfo['username'], public.GetClientIp(), str(int(request.environ.get('REMOTE_PORT')))))
                public.writeFile("/www/server/panel/data/dont_vcode_ip.txt", json.dumps({"client_ip": public.GetClientIp(), "add_time": now}))
                self.limit_address('--', v="vcode")
                self.set_cdn_host(post)
                return self._set_login_session(userInfo)

            acc_client_ip = self.check_two_step_auth()

            if not os.path.exists(_key_file) or acc_client_ip:
                public.run_thread(public.login_send_body, ("账号密码", userInfo['username'], public.GetClientIp(), str(int(request.environ.get('REMOTE_PORT')))))
                self.set_cdn_host(post)
                return self._set_login_session(userInfo, acc_client_ip)
            self.limit_address('-')
            session['is_verify_password'] = True
            return "1"
        except Exception as ex:
            stringEx = str(ex)
            if stringEx.find('unsupported') != -1 or stringEx.find('-1') != -1:
                public.ExecShell("rm -f /tmp/sess_*")
                public.ExecShell("rm -f /www/wwwlogs/*log")
                public.ServiceReload()
                return public.returnJson(False, 'USER_INODE_ERR'), json_header
            public.WriteLog('TYPE_LOGIN', 'LOGIN_ERR_PASS', ('****', '******', public.GetClientIp()))
            num = self.limit_address('+')
            if not num: return public.returnJson(False, '您多次登录失败,暂时禁止登录,请等待{}秒后重试!'.format(
                int(self.limit_expire_time - time.time()))), json_header

            # 2024/1/3 下午 2:31 记录登录时捕捉不到合适的错误，记录到文件中易于排查
            import traceback
            public.writeFile(
                '/www/server/panel/data/login_err.log',
                public.getDate() + '\n' + str(traceback.format_exc() + "\n"),
                mode='a+'
            )

            # 提交错误登录信息
            _form = request.form.to_dict()
            if 'username' in _form: _form['username'] = '******'
            if 'password' in _form: _form['password'] = '******'
            if 'phone' in _form: _form['phone'] = '******'

            # 错误信息
            error_infos = {
                "REQUEST_DATE": public.getDate(),  # 请求时间
                "PANEL_VERSION": public.version(),  # 面板版本
                "OS_VERSION": public.get_os_version(),  # 操作系统版本
                "REMOTE_ADDR": public.GetClientIp(),  # 请求IP
                "REQUEST_URI": request.method + request.full_path,  # 请求URI
                "REQUEST_FORM": public.xsssec(str(_form)),  # 请求表单
                "USER_AGENT": public.xsssec(request.headers.get('User-Agent')),  # 客户端连接信息
                "ERROR_INFO": str(traceback.format_exc()),  # 错误信息
                "PACK_TIME": public.readFile("/www/server/panel/config/update_time.pl") if os.path.exists("/www/server/panel/config/update_time.pl") else public.getDate(),  # 打包时间
                "TYPE": 2,
                "ERROR_ID": str(ex)
            }
            pkey = public.Md5(error_infos["ERROR_INFO"])

            # 提交
            if not public.cache_get(pkey):
                try:
                    public.run_thread(public.httpPost, ("https://api.bt.cn/bt_error/index.php", error_infos))
                    public.cache_set(pkey, 1, 1800)
                except Exception as e:
                    pass

            return (public.returnJson(
                False, '登录出现异常，请联系宝塔官方人员处理，详情：【{}】'.format(stringEx)),
                    json_header)

    def request_tmp(self, get):
        try:
            if not hasattr(get, 'tmp_token'): return public.error_not_login()
            if len(get.tmp_token) == 48:
                return self.request_temp(get)
            if len(get.tmp_token) != 64: return public.error_not_login()
            if not re.match(r"^\w+$", get.tmp_token): return public.error_not_login()

            save_path = '/www/server/panel/config/api.json'
            data = json.loads(public.ReadFile(save_path))
            if not 'tmp_token' in data or not 'tmp_time' in data: public.error_not_login()
            if (time.time() - data['tmp_time']) > 120: return public.error_not_login()
            if get.tmp_token != data['tmp_token']: return public.error_not_login()
            userInfo = public.M('users').where("id=?", (1,)).field('id,username').find()
            session['login'] = True
            session['username'] = userInfo['username']
            session['tmp_login'] = True
            session['uid'] = userInfo['id']
            ids = public.WriteLog('TYPE_LOGIN', 'LOGIN_SUCCESS', (userInfo['username'], public.GetClientIp() + ":" + str(request.environ.get('REMOTE_PORT'))))
            public.cache_set(public.GetClientIp() + ":" + str(request.environ.get('REMOTE_PORT')), ids)
            self.limit_address('-')
            cache.delete('panelNum')
            cache.delete('dologin')
            session['session_timeout'] = time.time() + public.get_session_timeout()
            del (data['tmp_token'])
            del (data['tmp_time'])
            public.writeFile(save_path, json.dumps(data))
            self.set_request_token()
            self.login_token()
            self.set_cdn_host(get)
            return redirect('/')
        except:
            return public.error_not_login()

    def request_temp(self, get):
        try:
            if len(get.__dict__.keys()) > 2: return public.error_not_login()
            if not hasattr(get, 'tmp_token'): return public.error_not_login()
            if len(get.tmp_token) != 48: return public.error_not_login()
            if not re.match(r"^\w+$", get.tmp_token): return public.error_not_login()
            skey = public.GetClientIp() + '_temp_login'
            if not public.get_error_num(skey, 10): return public.error_not_login()

            s_time = int(time.time())
            if public.M('temp_login').where('state=? and expire>?', (0, s_time)).field('id,token,salt,expire').count() == 0:
                public.set_error_num(skey)
                return public.error_not_login()

            data = public.M('temp_login').where('state=? and expire>?', (0, s_time)).field('id,token,salt,expire').find()
            if not data:
                public.set_error_num(skey)
                return public.error_not_login()
            if not isinstance(data, dict):
                public.set_error_num(skey)
                return public.error_not_login()
            r_token = public.md5(get.tmp_token + data['salt'])
            if r_token != data['token']:
                public.set_error_num(skey)
                return public.error_not_login()
            public.set_error_num(skey, True)
            userInfo = public.M('users').where("id=?", (1,)).field('id,username').find()
            session['login'] = True
            session['username'] = '临时({})'.format(data['id'])
            session['tmp_login'] = True
            session['tmp_login_id'] = str(data['id'])
            session['tmp_login_expire'] = int(data['expire'])
            session['uid'] = data['id']
            sess_path = 'data/session'
            if not os.path.exists(sess_path):
                os.makedirs(sess_path, 384)
            public.writeFile(sess_path + '/' + str(data['id']), '')
            login_addr = public.GetClientIp() + ":" + str(request.environ.get('REMOTE_PORT'))
            ids = public.WriteLog('TYPE_LOGIN', 'LOGIN_SUCCESS', (userInfo['username'], login_addr))
            public.cache_set(public.GetClientIp() + ":" + str(request.environ.get('REMOTE_PORT')), ids)
            public.M('temp_login').where('id=?', (data['id'],)).update({"login_time": s_time, 'state': 1, 'login_addr': login_addr})
            self.limit_address('-')
            cache.delete('panelNum')
            cache.delete('dologin')
            session['session_timeout'] = time.time() + public.get_session_timeout()
            self.set_request_token()
            self.login_token()
            self.set_cdn_host(get)
            public.run_thread(public.login_send_body("临时授权", userInfo['username'], public.GetClientIp(), str(request.environ.get('REMOTE_PORT'))))
            return redirect('/')
        except:
            return public.error_not_login()

    def login_token(self):
        import config
        config.config().reload_session()

    def request_get(self, get):
        '''
            @name 验证登录页面请求权限
            @author hwliang
            @return False | Response
        '''
        # 获取标题
        if not 'title' in session: session['title'] = public.getMsg('NAME')

        # 验证是否使用限制的域名访问
        domain_check = public.check_domain_panel()
        if domain_check: return domain_check

        # 验证是否使用限制的IP地址访问
        ip_check = public.check_ip_panel()
        if ip_check: return ip_check

        # 验证是否已经登录
        if 'login' in session:
            if session['login'] == True:
                return redirect('/')

        # 复位验证码
        if not 'code' in session:
            session['code'] = False

        # 记录错误次数
        self.error_num(False)

    # 生成request_token
    def set_request_token(self):
        html_token_key = public.get_csrf_html_token_key()
        session[html_token_key] = public.GetRandomString(48)
        session[html_token_key.replace("https_", "")] = public.GetRandomString(48)
        # 标记会话安全模式 -- 不要删除
        if 'session_safe_mode' in g:
            session['session_safe_mode'] = g.session_safe_mode
        else:
            session['session_safe_mode'] = False

        # 存储客户端标记 -- 用于判断是否是同一客户端 -- 不要删除
        session['client_hash'] = public.get_client_hash()

    def set_cdn_host(self, get):
        try:
            if not 'cdn_url' in get: return True
            plugin_path = 'plugin/static_cdn'
            if not os.path.exists(plugin_path): return True
            cdn_url = public.get_cdn_url()
            if not cdn_url or cdn_url == get.cdn_url: return True
            public.set_cdn_url(get.cdn_url)
        except:
            return False

    # 防暴破
    def error_num(self, s=True):
        nKey = 'panelNum'
        num = cache.get(nKey)
        if not num:
            cache.set(nKey, 1)
            num = 1
        if s: cache.inc(nKey, 1)
        if num > 6: session['code'] = True

    # IP限制
    def limit_address(self, type, v=""):
        clientIp = public.GetClientIp()
        numKey = 'limitIpNum_' + v + clientIp
        limit = 5
        outTime = 300
        try:
            # 初始化
            num1 = cache.get(numKey)
            if not num1:
                cache.set(numKey, 0, outTime)
                num1 = 0

            self.limit_expire_time = cache.get_expire_time(numKey)

            # 计数
            if type == '+':
                cache.inc(numKey, 1)
                self.error_num()
                session['code'] = True
                return limit - (num1 + 1)

            # 计数验证器
            if type == '++':
                cache.inc(numKey, 1)
                self.error_num()
                session['code'] = False
                return limit - (num1 + 1)

            # 清空
            if type == '-':
                cache.delete(numKey)
                session['code'] = False
                return 1

            # 清空验证器
            if type == '--':
                cache.delete(numKey)
                session['code'] = False
                return 1
            return limit - num1
        except:
            return limit

    # 登录成功设置session
    def _set_login_session(self, userInfo, acc_client_ip=None):
        try:
            session['login'] = True
            session['username'] = userInfo['username']
            session['uid'] = userInfo['id']
            session['login_user_agent'] = public.md5(request.headers.get('User-Agent', ''))
            ids = public.WriteLog('TYPE_LOGIN', 'LOGIN_SUCCESS', (userInfo['username'], public.GetClientIp() + ":" + str(request.environ.get('REMOTE_PORT'))))
            public.cache_set(public.GetClientIp() + ":" + str(request.environ.get('REMOTE_PORT')), ids)
            self.limit_address('-')
            cache.delete('panelNum')
            cache.delete('dologin')
            session['session_timeout'] = time.time() + public.get_session_timeout()
            if 'last_login_token' in session: del (session['last_login_token'])
            self.set_request_token()
            self.login_token()
            login_type = 'data/app_login.pl'
            if os.path.exists(login_type):
                os.remove(login_type)
            try:
                default_pl = "{}/default.pl".format(public.get_panel_path())
                public.writeFile(default_pl, "********")
            except:
                pass

            address = public.GetClientIp()
            port = str(request.environ.get('REMOTE_PORT'))

            login_address = '{}(未知)'.format(address, )
            # 返回增加登录地区
            res = public.returnMsg(True, 'LOGIN_SUCCESS') if not acc_client_ip else public.returnMsg(True, '登录成功，您的ip:【{}】已进行过动态口令认证，24小时内免认证!'.format(address))
            res['login_time'] = time.time()
            res['login_time_str'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
            try:
                ip_info = public.get_free_ip_info(address)
                if 'city' in ip_info:
                    res['ip_info'] = ip_info
                if '内网地址' in ip_info['info']:
                    res['ip_info'] = ip_info
                    res['ip_info']['ip'] = address
                login_address = '{}({})'.format(address, ip_info['info'])
            except:
                print(public.get_error_info())

            last_login = {}
            last_file = 'data/last_login.pl'
            try:
                last_login = json.loads(public.readFile(last_file))
            except:
                pass
            public.writeFile(last_file, json.dumps(res))

            res['last_login'] = last_login
            session['login_address'] = public.xsssec(login_address)
            session['login_time'] = res['login_time']   # 记录登录时间，验证客户端时要用，不要删除
            public.record_client_info()
            return public.getJson(res), json_header
        except Exception as ex:
            stringEx = str(ex)
            if stringEx.find('unsupported') != -1 or stringEx.find('-1') != -1:
                public.ExecShell("rm -f /tmp/sess_*")
                public.ExecShell("rm -f /www/wwwlogs/*log")
                public.ServiceReload()
                return public.returnJson(False, 'USER_INODE_ERR'), json_header
            public.WriteLog('TYPE_LOGIN', 'LOGIN_ERR_PASS', ('****', '******', public.GetClientIp()))
            num = self.limit_address('+')
            return public.returnJson(False, 'LOGIN_USER_ERR', (str(num),)), json_header

    # 检查是否需要进行二次验证
    def check_two_step_auth(self):
        dont_vcode_ip_info = public.readFile("/www/server/panel/data/dont_vcode_ip.txt")
        acc_client_ip = False
        if dont_vcode_ip_info:
            dont_vcode_ip_info = json.loads(dont_vcode_ip_info)
            ip = dont_vcode_ip_info["client_ip"] == public.GetClientIp()
            now = int(time.time())
            v_time = now - int(dont_vcode_ip_info["add_time"])
            if ip and v_time < 86400:
                acc_client_ip = True
        return acc_client_ip

    # 清理多余SESSION数据
    def clear_session(self):
        try:
            session_file = '/dev/shm/session.db'
            if not os.path.exists(session_file): return False
            s_size = os.path.getsize(session_file)
            if s_size < 1024 * 512: return False
            if s_size > 1024 * 1024 * 10:
                from BTPanel import sdb
                if os.path.exists(session_file): os.remove(session_file)
                sdb.create_all()
                if not os.path.exists(session_file):
                    public.writeFile('/www/server/panel/data/reload.pl', 'True')
                    return False
            return True
        except:
            return False
