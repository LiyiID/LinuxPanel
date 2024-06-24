# coding: utf-8
# -------------------------------------------------------------------
# 宝塔Linux面板
# -------------------------------------------------------------------
# Copyright (c) 2015-2099 宝塔软件(http://bt.cn) All rights reserved.
# -------------------------------------------------------------------
# Author: zouhw <zhw@bt.cn>
# -------------------------------------------------------------------

# ------------------------------
# Docker模型
# ------------------------------
import json

import public
from btdockerModel import dk_public as dp
from btdockerModel.dockerBase import dockerBase


class main(dockerBase):

    def docker_client(self, url):
        return dp.docker_client(url)

    def add(self, args):
        """
        添加仓库
        :param registry 仓库URL docker.io
        :param name
        :parma username
        :parma password
        :param namespace 仓库命名空间
        :param remark 备注
        :param args:
        :return:
        """
        # 验证登录
        if not args.registry:
            args.registry = "docker.io"
        res = self.login(self._url, args.registry, args.username, args.password)
        if not res['status']:
            return res

        r_list = self.registry_list(args)
        if len(r_list) > 0:
            for r in r_list:
                if r['name'] == args.name:
                    return public.returnMsg(False, "名字已经存在！ <br><br>名称：{}".format(args.name))
                if r['username'] == args.username and args.registry == r['url']:
                    return public.returnMsg(False, "仓库信息已存在！")
        pdata = {
            "name": args.name,
            "url": args.registry,
            "namespace": args.namespace,
            "username": public.aes_encrypt(args.username, self.aes_key),
            "password": public.aes_encrypt(args.password, self.aes_key),
            "remark": public.xsssec(args.remark)
        }
        dp.sql("registry").insert(pdata)
        dp.write_log("添加仓库 [{}] [{}] 成功！".format(args.name, args.registry))
        return public.returnMsg(True, "添加成功！")

    def edit(self, args):
        """
        添加仓库
        :param registry 仓库URL docker.io
        :param id 仓库id
        :parma username
        :parma password
        :param namespace
        :param remark
        :param args:
        :return:
        """
        # 验证登录
        if str(args.id) == "1":
            return public.returnMsg(False, "【Docker官方仓库】不可编辑！")
        if not args.registry:
            args.registry = "docker.io"

        # 2023/12/13 上午 11:40 处理加密的编辑
        try:
            is_encrypt = False
            res = self.login(self._url, args.registry, args.username, args.password)
            if not res['status']:
                res = self.login(
                    self._url,
                    args.registry,
                    public.aes_decrypt(args.username, self.aes_key),
                    public.aes_decrypt(args.password, self.aes_key)
                )
                if not res['status']:
                    return res
                is_encrypt = True
        except Exception as e:
            if "binascii.Error: Incorrect padding" in str(e):
                return public.returnMsg(False, "编辑失败！原因：账号密码解密失败！请删除仓库后重新添加试试")
            return public.returnMsg(False, "编辑失败！原因：{}".format(e))

        res = dp.sql("registry").where("id=?", (args.id,)).find()
        if not res:
            return public.returnMsg(False, "找不到此仓库")
        pdata = {
            "name": args.name,
            "url": args.registry,
            "username": public.aes_encrypt(args.username, self.aes_key) if is_encrypt is False else args.username,
            "password": public.aes_encrypt(args.password, self.aes_key) if is_encrypt is False else args.password,
            "namespace": args.namespace,
            "remark": args.remark
        }
        dp.sql("registry").where("id=?", (args.id,)).update(pdata)
        dp.write_log("编辑仓库 [{}][{}] 成功！".format(args.name, args.registry))
        return public.returnMsg(True, "编辑成功!")

    def remove(self, args):
        """
        删除某个仓库
        :param id
        :param rags:
        :return:
        """
        if str(args.id) == "1":
            return public.returnMsg(False, "【Docker官方仓库】无法删除！")

        data = dp.sql("registry").where("id=?", (args.id)).find()

        if len(data) < 1:
            return public.returnMsg(True, "删除失败，仓库id可能不存在！")

        dp.sql("registry").where("id=?", (args.id,)).delete()

        dp.write_log("删除存储库 [{}][{}] 成功！".format(data['name'], data['url']))
        return public.returnMsg(True, "成功删除！")

    def registry_list(self, get):
        """
        获取仓库列表
        :return:
        """
        # 2024/1/3 下午 6:00 检测数据库是否存在并且表健康
        search_result = dp.sql("registry").where('id=? or name=?', (1, "docker官方库")).select()
        if len(search_result) == 0:
            dp.sql("registry").insert({
                "name": "docker官方库",
                "url": "docker.io",
                "username": "",
                "password": "",
                "namespace": "",
                "remark": "docker官方库"
            })
        if "error: no such table: registry" in search_result or len(search_result) == 0:
            public.ExecShell("mv -f /www/server/panel/data/docker.db /www/server/panel/data/db/docker.db")
            dp.check_db()

        res = dp.sql("registry").select()
        # res = dp.sql("registry").where("id!=?", (1,)).select()
        if not isinstance(res, list):
            res = []

        return res

    def get_com_registry(self, get):
        """
        获取常用仓库列表
        @param get:
        @return:
        """
        com_registry_file = "{}/class/btdockerModel/config/com_registry.json".format(public.get_panel_path())
        try:
            com_registry = json.loads(public.readFile(com_registry_file))
        except:
            com_registry = {
                "docker.io": "docker官方镜像站",
                "swr.cn-north-4.myhuaweicloud.com": "华为云镜像站",
                "ccr.ccs.tencentyun.com": "腾讯云镜像站",
                "registry.cn-hangzhou.aliyuncs.com": "阿里云镜像站(杭州)"
            }

        return com_registry

    def registry_info(self, name):
        return dp.sql("registry").where("name=?", (name,)).find()

    def login(self, url, registry, username, password):
        """
        仓库登录测试
        :param args:
        :return:
        """
        import docker.errors
        try:
            res = self.docker_client(url).login(
                registry=registry,
                username=username,
                password=password,
                reauth=False
            )
            return public.returnMsg(True, str(res))
        except docker.errors.APIError as e:
            if "authentication required" in str(e):
                return public.returnMsg(False, "登录测试失败！原因：可能是账号密码错误，请检查！")
            if "unauthorized: incorrect username or password" in str(e):
                return public.returnMsg(False, "登录测试失败！原因：可能是账号密码错误，请检查！")
            return public.returnMsg(False, "登录测试失败！原因：{}".format(e))
