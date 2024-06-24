# coding: utf-8
# -------------------------------------------------------------------
# 宝塔Linux面板
# -------------------------------------------------------------------
# Copyright (c) 2015-2099 宝塔软件(http://bt.cn) All rights reserved.
# -------------------------------------------------------------------
# Author: wzz <wzz@bt.cn>
# -------------------------------------------------------------------
import json
import os
import traceback
from datetime import datetime

import public
from btdockerModel import dk_public as dp
from btdockerModel.dockerBase import dockerBase

class main(dockerBase):

    # 2023/12/27 下午 2:56 创建容器反向代理
    def create_proxy(self, get):
        '''
            @name 创建容器反向代理
            @author wzz <2023/12/27 下午 2:57>
            @param "data":{"参数名":""} <数据类型> 参数描述
            @return dict{"status":True/False,"msg":"提示信息"}
        '''
        try:
            if not (os.path.exists('/etc/init.d/nginx') or os.path.exists('/etc/init.d/httpd')):
                return public.returnMsg(False, '未检测到nginx或apache服务，请先安装其中一个!')

            if not hasattr(get, 'domain'):
                return public.returnMsg(False, '参数错误,请传domain参数!')

            if not hasattr(get, 'container_port'):
                return public.returnMsg(False, '参数错误,请传container_port参数!')

            self.siteName = get.domain.strip()

            if dp.sql('dk_sites').where('container_id=?', (get.container_id,)).order('id desc').find():
                self.close_proxy(get)
            # 2024/2/23 下午 12:05 如果其他地方有这个域名，则禁止添加
            newpid = public.M('domain').where("name=? and port=?", (self.siteName, 80)).getField('pid')
            if newpid:
                result = public.M('sites').where("id=? and ps!=?",
                                                 (newpid, '容器[{}]的反向代理'.format(get.container_name))).find()
                if result:
                    return public.returnMsg(False,
                                            '项目类型【{}】已存在域名：{}'.format(result['project_type'],
                                                                               self.siteName))

            self.container_port = get.container_port
            if not dp.check_socket(self.container_port):
                return public.returnMsg(False, "服务器端口[{}]未被使用，请输入正在使用的端口进行反代！".format(self.container_port))

            self.sitePath = '/www/wwwroot/' + self.siteName

            from panelSite import panelSite
            args = public.to_dict_obj({
                'webname': '{"domain":"'+ self.siteName +'","domainlist":[],"count":0}',
                'type': 'docker',
                'port': "80",
                'ps': self.siteName,
                'path': self.sitePath,
                'type_id': 111,
                'version': "00",
                'ftp': False,
                'sql': False,
            })
            panelSite().AddSite(args)

            args = public.to_dict_obj({
                'type': 1,
                'proxyname': get.container_name + '_dk_proxy',
                'cachetime': 1,
                'proxydir': '/',
                'cache': 0,
                'subfilter': '[{"sub1":"","sub2":""},{"sub1":"","sub2":""},{"sub1":"","sub2":""}]',
                'sitename': self.siteName,
                'advanced': 0,
                'proxysite': 'http://127.0.0.1:' + self.container_port,
                'todomain': '$host',
            })
            import projectModel.proxyModel as proxyModel
            proxyModel = proxyModel.main()
            proxyModel.CreateProxy(args)

            # 设置面板SSL
            if hasattr(get, "privateKey") and hasattr(get, "certPem"):
                args = public.to_dict_obj({
                    'type': '1',
                    'siteName': self.siteName,
                    'key': get.privateKey,
                    'csr': get.certPem,
                })
                panelSite().SetSSL(args)

            # 写入数据库
            newpid = public.M('domain').where("name=? and port=?", (self.siteName, 80)).getField('pid')
            if newpid:
                # 更新ps和project_type字段
                public.M('sites').where("id=?", (newpid,)).save('ps,project_type', (
                    '容器[{}]的反向代理'.format(get.container_name),
                    'proxy'))

            site_pid = dp.sql('dk_sites').add(
                'name,path,ps,addtime,container_id,container_name,container_port',
                (self.siteName, self.sitePath, '容器[{}]的反向代理'.format(get.container_name),
                 datetime.now().strftime("%Y-%m-%d %H:%M:%S"), get.container_id, get.container_name, self.container_port)
            )
            if not site_pid:
                return public.returnMsg(False, '添加失败，数据库无法写入!')

            domain_id = dp.sql('dk_domain').where('id=?', (site_pid,)).find()
            if not domain_id:
                dp.sql('dk_domain').add(
                    'pid,name,addtime',
                    (site_pid, self.siteName, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                )

            return public.returnMsg(True, '添加成功!')
        except Exception as e:
            return public.returnMsg(True, '添加失败，错误{}!'.format(str(e)))

    # 2024/1/2 下午 5:34 获取容器的反向代理信息
    def get_proxy_info(self, get):
        '''
            @name 获取容器的反向代理信息
            @author wzz <2024/1/2 下午 5:34>
            @param "data":{"参数名":""} <数据类型> 参数描述
            @return dict{"status":True/False,"msg":"提示信息"}
        '''
        try:
            if not hasattr(get, 'container_id'):
                return public.returnMsg(False, '参数错误,请传container_id参数!')

            container_id = get.container_id
            proxy_info = dp.sql('dk_sites').where('container_id=?', (container_id,)).order('id desc').find()
            print(proxy_info)

            path = '/www/server/panel/vhost/cert/' + proxy_info['name']
            csrpath = path + "/fullchain.pem"
            keypath = path + "/privkey.pem"
            if os.path.exists(csrpath) and os.path.exists(keypath):
                try:
                    proxy_info['cert'] = public.readFile(csrpath)
                    proxy_info['key'] = public.readFile(keypath)
                except:
                    proxy_info['cert'] = ""
                    proxy_info['key'] = ""

            if not proxy_info:
                return public.returnMsg(False, '未检测到反向代理信息!')

            return proxy_info
        except:
            print(traceback.format_exc())
            return {}

    # 2024/1/2 下午 5:43 关闭容器的反向代理
    def close_proxy(self, get):
        '''
            @name 关闭容器的反向代理
            @param "data":{"参数名":""} <数据类型> 参数描述
            @return dict{"status":True/False,"msg":"提示信息"}
        '''
        try:
            if not hasattr(get, 'container_id'):
                return public.returnMsg(False, '参数错误,请传container_id参数!')

            container_id = get.container_id
            proxy_info = dp.sql('dk_sites').where('container_id=?', (container_id,)).order('id desc').find()

            if not proxy_info:
                return public.returnMsg(False, '未检测到反向代理信息!')

            newpid = public.M('domain').where("name=? and port=?", (proxy_info["name"], 80)).getField('pid')
            if not newpid:
                return public.returnMsg(False, '未检测到反向代理信息!')

            result = public.M('sites').where("id=? and ps=?", (newpid, '容器[{}]的反向代理'.format(proxy_info["container_name"]))).find()
            # 删除反向代理
            import projectModel.proxyModel as proxyModel
            proxyModel = proxyModel.main()

            args = public.to_dict_obj({
                'id': result['id'],
                'webname': proxy_info['name'],
                'type': 1,
            })
            proxyModel.DeleteSite(args)

            # 删除站点
            public.M('sites').where("name=?", (proxy_info['name'],)).delete()
            public.M('domain').where("name=?", (proxy_info['name'],)).delete()

            # 删除数据库记录
            dp.sql('dk_sites').where('container_id=?', (container_id,)).delete()
            dp.sql('dk_domain').where('pid=?', (proxy_info['id'],)).delete()

            return public.returnMsg(True, '删除成功!')
        except:
            return traceback.format_exc()

    # 2024/1/2 下午 5:57 获取指定域名的证书内容
    def get_cert_info(self, get):
        '''
            @name 获取指定域名的证书内容
            @author wzz <2024/1/2 下午 5:58>
            @param "data":{"参数名":""} <数据类型> 参数描述
            @return dict{"status":True/False,"msg":"提示信息"}
        '''
        try:
            if not hasattr(get, 'cert_name'): return public.returnMsg(False, '参数错误!')
            cert_name = get.cert_name
            # 2024/1/3 下午 4:50 处理通配符域名，将*.spider.com替换成spider.com
            if cert_name.startswith('*.'):
                cert_name = cert_name.replace('*.', '')
            if not os.path.exists('/www/server/panel/vhost/ssl/{}'.format(cert_name)):
                return public.returnMsg(False, '证书不存在!')
            cert_data = {}
            cert_data['cert_name'] = cert_name
            cert_data['cert'] = public.readFile('/www/server/panel/vhost/ssl/{}/fullchain.pem'.format(cert_name))
            cert_data['key'] = public.readFile('/www/server/panel/vhost/ssl/{}/privkey.pem'.format(cert_name))
            cert_data['info'] = json.loads(
                public.readFile('/www/server/panel/vhost/ssl/{}/info.json'.format(cert_name)))
            return cert_data
        except:
            return traceback.format_exc()
