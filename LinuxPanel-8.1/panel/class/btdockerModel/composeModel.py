# coding: utf-8
# -------------------------------------------------------------------
# 宝塔Linux面板
# -------------------------------------------------------------------
# Copyright (c) 2015-2099 宝塔软件(http://bt.cn) All rights reserved.
# -------------------------------------------------------------------
# Author: wzz <wzz@bt.cn>
# -------------------------------------------------------------------

# ------------------------------
# Docker模型
# ------------------------------
import json
import os
import time

import public
from btdockerModel import containerModel as dc
from btdockerModel import dk_public as dp
from btdockerModel.dockerBase import dockerBase


class main(dockerBase):

    def get_docker_compose_version(self):
        try:
            import subprocess
            result = subprocess.run(["docker-compose", "version", "--short"], capture_output=True, text=True)
            version_str = result.stdout.strip()
            major, minor, patch = map(int, version_str.split('.'))
            return major, minor, patch
        except Exception as e:
            print("Error:", e)
            return None

    # 验证配置文件
    def check_conf(self, path):
        # 2024/3/21 下午 5:58 检测path是否存在中文，如果有就false return
        if public.check_chinese(path):
            return public.returnMsg(False, "文件路径不能包含中文！")

        # 2024/3/20 下午 4:33 获取docker-compose的版本，如果大于v2.24.7则不需要检测，比如是v2.25，解决高版本的docker-compose
        version = self.get_docker_compose_version()
        if version and version > (2, 24, 7):
            tmpfile = public.md5(path)
            public.ExecShell("\cp -r {} /tmp/{}.yml".format(path, public.md5(path)))
            public.ExecShell("sed -i '/version:/d' /tmp/{}.yml".format(tmpfile))
            path = "/tmp/{}.yml".format(tmpfile)

        shell = "/usr/bin/docker-compose -f {} config".format(path)
        a, e = public.ExecShell(shell)
        if e and "setlocale: LC_ALL: cannot change locale (en_US.UTF-8)" not in e:
            return public.returnMsg(False, "检测失败: {}".format(e))
        return public.returnMsg(True, "检测通过!")

    # 用引导方式创建模板
    def add_template_gui(self, get):
        """
        用引导方式创建模板
        :param name                     模板名
        :param description              模板描述
        :param data                     模板内容 {"version":3,"services":{...}...}
        :param get:
        模板文件参数：
        version 2/3version
            2: 仅支持单机
            3：支持单机和多机模式
        services:
            多个容器的集合
            下一层执行服务名
            如web1,服务名下面指定服务的变量
            web1:
                build: .                    基于dockerfile构建一个镜像
                image: nginx                服务所使用的镜像为nginx
                container_name: "web"       容器名
                depends_on:                 该服务在db服务启动后再启动
                  - db
                ports:
                  - "6061:80"               将容器的80端口映射到主机的6061端口
                networks:
                  - frontend                该容器所在的网络
                deploy:                     指定与部署和运行服务相关的配置(在使用 swarm时才会生效)
                  replicas: 6               6个副本
                  update_config:
                    parallelism: 2
                    delay: 10s
                  restart_policy:
                    condition: on-failure
        其他详细描述可以参考 https://docs.docker.com/compose/compose-file/compose-file-v3
        :return:
        """
        import yaml
        path = "{}/template".format(self.compose_path)
        file = "{}/{}.yaml".format(path, get.name)
        if not os.path.exists(path):
            os.makedirs(path)
        data = json.loads(get.data)
        yaml.dump(data, file)

    def get_template_kw(self, get):
        data = {
            "version": "",
            "services": {
                "server_name_str": {  # 用户输入
                    "build": {
                        "context": "str",
                        "dockerfile": "str",
                        "get": [],
                        "cache_from": [],
                        "labels": [],
                        "network": "str",
                        "shm_size": "str",
                        "target": "str"
                    },
                    "cap_add": "",
                    "cap_drop": "",
                    "cgroup_parent": "str",
                    "command": "str",
                    "configs": {
                        "my_config_str": []
                    },
                    "container_name": "str",
                    "credential_spec": {
                        "file": "str",
                        "registry": "str"
                    },
                    "depends_on": [],
                    "deploy": {
                        "endpoint_mode": "str",
                        "labels": {
                            "key": "value"
                        },
                        "mode": "str",
                        "placement": [{"key": "value"}],
                        "max_replicas_per_node": "int",
                        "replicas": "int",
                        "resources": {
                            "limits": {
                                "cpus": "str",
                                "memory": "str",
                            },
                            "reservations": {
                                "cpus": "str",
                                "memory": "str",
                            },
                            "restart_policy": {
                                "condition": "str",
                                "delay": "str",
                                "max_attempts": "int",
                                "window": "str"
                            }
                        }
                    }
                }
            }
        }

    # 创建项目配置文件
    def add_template(self, get):
        """
        添加一个模板文件
        :param name                     模板名
        :param remark              模板描述
        :param data                     模板内容
        :param get:
        :return:
        """
        import re
        name = get.name
        if not re.search(r"^[\w\.\-]+$", name):
            return public.returnMsg(False, "模板名不能包含特殊字符，仅支持字母、数字、下划线、点、中划线")

        template_list = self.template_list(get)
        for template in template_list:
            if name == template['name']:
                return public.returnMsg(False, "此模版名已经存在！")

        path = "{}/{}/template".format(self.compose_path, name)
        file = "{}/{}.yaml".format(path, name)
        if not os.path.exists(path):
            os.makedirs(path)
        public.writeFile(file, get.data)

        check_res = self.check_conf(file)
        if not check_res['status']:
            if os.path.exists(file):
                os.remove(file)
            return check_res

        pdata = {
            "name": name,
            "remark": public.xsssec(get.remark),
            "path": file
        }
        dp.sql("templates").insert(pdata)
        dp.write_log("添加模板【{}】成功!".format(name))
        public.set_module_logs('docker', 'add_template', 1)
        return public.returnMsg(True, "模板添加成功!")

    def edit_template(self, get):
        """
        :param id 模板id
        :param data 模板内容
        :param remark              模板描述
        :param get:
        :return:
        """
        template_info = dp.sql("templates").where("id=?", (get.id,)).find()
        if not template_info:
            return public.returnMsg(False, "没有找改该模版！")

        if "data" not in get:
            return public.returnMsg(False, "模板内容格式错误,请输入有效的docker-compose模板！")

        if "version" not in get.data:
            return public.returnMsg(False, "模板内容格式错误,请输入有效的docker-compose模板！")

        public.writeFile(template_info['path'], get.data)
        check_res = self.check_conf(template_info['path'])
        if not check_res['status']:
            return check_res
        pdata = {
            "name": get.name,
            "remark": public.xsssec(get.remark),
            "path": template_info['path']
        }
        dp.sql("templates").where("id=?", (get.id,)).update(pdata)
        dp.write_log("编辑模板 [{}] 成功!".format(template_info['name']))
        return public.returnMsg(True, "修改模板成功！")

    def get_template(self, get):
        """
        id 模板ID
        获取模板内容
        :return:
        """
        template_info = dp.sql("templates").where("id=?", (get.template_id,)).find()
        if not template_info:
            return public.returnMsg(False, "没有找到此模板!")

        return public.returnMsg(True, public.readFile(template_info['path']))

    def template_list(self, get):
        """
        获取所有模板
        :param get:
        :return:
        """
        template = dp.sql("templates").select()[::-1]
        if not isinstance(template, list):
            template = []

        return template

    def remove_template(self, get):
        """
        删除模板
        :param template_id
        :param get:
        :return:
        """
        data = dp.sql("templates").where("id=?", (get.template_id,)).find()
        if not data:
            return public.returnMsg(False, "没有找到此模板!")
        if os.path.exists(data['path']):
            os.remove(data['path'])
        dp.sql("templates").delete(id=get.template_id)
        dp.write_log("删除模板 [{}] 成功!".format(data['name']))
        return public.returnMsg(True, "删除成功!")

    def edit_project_remark(self, get):
        """
        编辑项目
        :param project_id 项目
        :param remark备注
        :param get:
        :return:
        """
        stacks_info = dp.sql("stacks").where("id=?", (get.project_id,)).find()
        if not stacks_info:
            return public.returnMsg(False, "没有找到该项目！")
        pdata = {
            "remark": public.xsssec(get.remark)
        }
        dp.write_log("项目 [{}] 的备注修改成功 [{}] --> [{}]!".format(stacks_info['name'], stacks_info['remark'],
                                                                      public.xsssec(get.remark)))
        dp.sql("stacks").where("id=?", (get.project_id,)).update(pdata)

    def edit_template_remark(self, get):
        """
        编辑项目
        :param templates_id 项目
        :param remark备注
        :param get:
        :return:
        """
        stacks_info = dp.sql("templates").where("id=?", (get.templates_id,)).find()
        if not stacks_info:
            return public.returnMsg(False, "没有找到该模版！")
        pdata = {
            "remark": public.xsssec(get.remark)
        }
        dp.write_log("修改模板 [{}] 备注成功 [{}] --> [{}]!".format(stacks_info['name'], stacks_info['remark'],
                                                                    public.xsssec(get.remark)))
        dp.sql("templates").where("id=?", (get.templates_id,)).update(pdata)

    def create_project_in_path(self, name, path):
        shell = "cd {} && /usr/bin/docker-compose -p {} up -d &> {}".format("/".join(path.split("/")[:-1]), name,
                                                                            self._log_path)
        public.ExecShell(shell)

    def create_project_in_file(self, project_name, file):
        project_path = "{}/{}".format(self.compose_path, project_name)
        project_file = "{}/docker-compose.yaml".format(project_path)
        if not os.path.exists(project_path):
            os.makedirs(project_path)
        template_content = public.readFile(file)
        public.writeFile(project_file, template_content)
        shell = "/usr/bin/docker-compose -p {} -f {} up -d &> {}".format(project_name, project_file, self._log_path)
        public.ExecShell(shell)

    def check_project_container_name(self, template_data, get):
        """
        检测模板文件中的容器名是否已经存在
        :return:
        """
        import re
        data = []
        template_container_name = re.findall("container_name\s*:\s*[\"\']+(.*)[\'\"]", template_data)
        container_list = dc.main().get_list(get)

        container_list = container_list['container_list']
        for container in container_list:
            if container['name'] in template_container_name:
                data.append(container['name'])
        if data:
            return public.returnMsg(False, "容器名已经存在！: <br>[{}]".format(", ".join(data)))
        # 获取模板所使用的端口
        rep = "(\d+):\d+"
        port_list = re.findall(rep, template_data)
        for port in port_list:
            if dp.check_socket(port):
                return public.returnMsg(False, "此端口 [{}] 已经被其他模板使用！".format(port))

    # 创建项目
    def create(self, get):
        """
        :param project_name         项目名
        :param remark          描述
        :param template_id             模板ID
        :param rags:
        :return:
        """
        project_name = public.md5(get.project_name)
        if "template_id" not in get:
            return public.returnMsg(False, "参数错误,请传入template_id!")
        template_id = get.template_id
        template_info = dp.sql("templates").where("id=?", template_id).find()
        if len(template_info) < 1:
            return public.returnMsg(False, "没有找到此模板，或模板文件损坏!")

        if not os.path.exists(template_info['path']):
            return public.returnMsg(False, "模板文件不存在!")

        template_exist = dp.sql("stacks").where("template_id=?", (template_id,)).find()
        if template_exist:
            return public.returnMsg(False, "模板【{}】已经被项目:【{}】部署,请换一个模板后再试!".format(template_info['name'], template_exist['name']))

        name_exist = self.check_project_container_name(public.readFile(template_info['path']), get)
        if name_exist:
            return name_exist

        stacks_info = dp.sql("stacks").where("name=?", (project_name)).find()
        if not stacks_info:
            pdata = {
                "name": public.xsssec(get.project_name),
                "status": "1",
                "path": template_info['path'],
                "template_id": template_id,
                "time": time.time(),
                "remark": public.xsssec(get.remark)
            }
            dp.sql("stacks").insert(pdata)
        else:
            return public.returnMsg(False, "项目名已经存在!")

        if template_info['add_in_path'] == 1:
            self.create_project_in_path(
                project_name,
                template_info['path']
            )
        else:
            self.create_project_in_file(
                project_name,
                template_info['path']
            )
        dp.write_log("项目 [{}] 部署成功!".format(project_name))
        public.set_module_logs('docker', 'add_project', 1)
        return public.returnMsg(True, "部署成功!")

    def compose_project_list(self, get):
        """
        获取所有已部署的项目列表
        @param get:
        """
        compose_project = dp.sql("stacks").select()
        try:
            cmd_result = public.ExecShell("/usr/bin/docker-compose ls -a --format json")[0]
            if "Segmentation fault" in cmd_result:
                return public.returnMsg(False, "docker-compose 版本过低，请升级到最新版！")
            result = json.loads(cmd_result)
        except:
            result = []

        for i in compose_project:
            for j in result:
                if public.md5(i['name']) in j['Name']:
                    i['run_status'] = j['Status'].split("(")[0].lower()
                    break
                else:
                    i['run_status'] = "exited"

        return compose_project

    def project_container_count(self, get):
        """
        获取项目容器数量
        @param get:
        @return:
        """
        from btdockerModel.dockerSock import container
        sk_container = container.dockerContainer()
        sk_container_list = sk_container.get_container()

        stacks_info = dp.sql("stacks").select()
        net_info = []

        for i in stacks_info:
            count = 0
            for c in sk_container_list:
                if public.md5(i['name']) in c["Names"][0].replace("/", ""):
                    count += 1
                    continue

                if 'com.docker.compose.project' in c.keys():
                    if public.md5(i['name']) in c['com.docker.compose.project.config_files']:
                        count += 1
                        continue

                    if public.md5(i['name']) in public.md5(c['com.docker.compose.project.config_files']):
                        count += 1
                        continue

                if 'com.docker.compose.project' in c['Labels'].keys():
                    if public.md5(i['name']) in c['Labels']['com.docker.compose.project.config_files']:
                        count += 1
                        continue

                    if public.md5(i['name']) in public.md5(c['Labels']['com.docker.compose.project.config_files']):
                        count += 1
                        continue

            net_info.append(count)

        return net_info

    def get_compose_container(self, get):
        """
        目前仅支持本地 url: unix:///var/run/docker.sock
        """
        from btdockerModel.dockerSock import container
        sk_container = container.dockerContainer()
        sk_container_list = sk_container.get_container()

        project_container_list = []
        for c in sk_container_list:
            if public.md5(get.name) in dp.rename(c["Names"][0].replace("/", "")):
                project_container_list.append(dc.main().struct_container_list(c))
                continue

            if 'com.docker.compose.project' in c.keys():
                if public.md5(get.name) in c['com.docker.compose.project.config_files']:
                    project_container_list.append(dc.main().struct_container_list(c))

                if public.md5(get.name) in public.md5(c['com.docker.compose.project.config_files']):
                    project_container_list.append(dc.main().struct_container_list(c))

            if 'com.docker.compose.project' in c['Labels'].keys():
                if public.md5(get.name) in c['Labels']['com.docker.compose.project.config_files']:
                    project_container_list.append(dc.main().struct_container_list(c))

                if public.md5(get.name) in public.md5(c['Labels']['com.docker.compose.project.config_files']):
                    project_container_list.append(dc.main().struct_container_list(c))

        return project_container_list

    # 删除项目
    def remove(self, get):
        """
        project_id          数据库记录的项目ID
        :param get:
        :return:
        """
        statcks_info = dp.sql("stacks").where("id=?", (get.project_id,)).find()
        if not statcks_info:
            return public.returnMsg(True, "没有找到该项目名!")
        container_name = public.ExecShell("docker ps --format \"{{.Names}}\"")
        if statcks_info['name'] in container_name[0]:
            shell = f"/usr/bin/docker-compose -p {statcks_info['name']} -f {statcks_info['path']} down &> {self._log_path}"
        else:
            shell = f"/usr/bin/docker-compose -p {public.md5(statcks_info['name'])} -f" \
                    f" {statcks_info['path']} down &> {self._log_path}"
        public.ExecShell(shell)
        dp.sql("stacks").delete(id=get.project_id)
        dp.write_log("删除项目 [{}] 成功!".format(statcks_info['name']))
        return public.returnMsg(True, "删除成功!")

    def prune(self, get):
        """
        删除所有没有容器的项目
        @param get:
        @return:
        """
        stacks_info = dp.sql("stacks").select()
        container_name = public.ExecShell("docker ps --format \"{{.Names}}\"")[0]
        container_name = container_name.split("\n")
        for i in stacks_info:
            # 2024/3/21 下午 6:26 如果i['name']在container_name[0]中，说明容器还在运行，不删除
            is_run = False
            for j in container_name:
                if public.md5(i['name']) in j:
                    is_run = True
                    break

            if is_run: continue
            shell = "/usr/bin/docker-compose -f {} down &> {}".format(i['path'], self._log_path)
            public.ExecShell(shell)
            dp.sql("stacks").delete(id=i['id'])
            dp.write_log("清理项目 [{}] 成功!".format(i['name']))
        return public.returnMsg(True, "清理成功!")

    def set_compose_status(self, get):
        """
        设置项目状态
        @param get:
        @return:
        """
        if get.status == 'start':
            return self.start(get)
        elif get.status == 'stop':
            return self.stop(get)
        elif get.status == 'restart':
            return self.restart(get)
        elif get.status == 'pause':
            return self.pause(get)
        elif get.status == 'unpause':
            return self.unpause(get)
        elif get.status == 'kill':
            return self.kill(get)
        else:
            return public.returnMsg(False, "参数错误！")

    def kill(self, get):
        """
        强制停止项目
        @param get:
        @return:
        """
        statcks_info = dp.sql("stacks").where("id=?", (get.project_id,)).find()
        if not statcks_info:
            return public.returnMsg(True, "没找到项目配置!")
        shell = "/usr/bin/docker-compose -f {} kill &> {}".format(
            "{}/data/compose/{}/docker-compose.yaml".format(public.get_panel_path(), public.md5(statcks_info['name'])),
            self._log_path
        )
        a, e = public.ExecShell(shell)
        if e:
            return public.returnMsg(False, "停止项目失败: {}".format(e))
        dp.write_log("停止项目 [{}] 成功!".format(statcks_info['name']))
        return public.returnMsg(True, "设置成功!")

    def stop(self, get):
        """
        停止项目
        project_id          数据库记录的项目ID
        kill                强制停止项目 0/1
        :param get:
        :return:
        """
        statcks_info = dp.sql("stacks").where("id=?", (get.project_id,)).find()
        if not statcks_info:
            return public.returnMsg(True, "没找到项目配置!")

        shell = "/usr/bin/docker-compose -f {} stop &> {}".format(
            "{}/data/compose/{}/docker-compose.yaml".format(public.get_panel_path(), public.md5(statcks_info['name'])),
            self._log_path
        )
        a, e = public.ExecShell(shell)
        if e:
            return public.returnMsg(False, "停止项目失败: {}".format(e))
        dp.write_log("停止项目 [{}] 成功!".format(statcks_info['name']))
        return public.returnMsg(True, "设置成功!")

    def start(self, get):
        """
        启动项目
        project_id          数据库记录的项目ID
        :param get:
        :return:
        """
        statcks_info = dp.sql("stacks").where("id=?", (get.project_id,)).find()
        if not statcks_info:
            return public.returnMsg(False, "没找到项目配置!")

        shell = "/usr/bin/docker-compose -f {} start &> {}".format(
            "{}/data/compose/{}/docker-compose.yaml".format(public.get_panel_path(), public.md5(statcks_info['name'])),
            self._log_path
        )
        a, e = public.ExecShell(shell)
        if e:
            return public.returnMsg(False, "启动项目失败: {}".format(e))
        dp.write_log("启动项目 [{}] 成功!".format(statcks_info['name']))
        return public.returnMsg(True, "设置成功!")

    def restart(self, get):
        """
        拉取项目内需要的镜像
        project_id          数据库记录的项目ID
        :param get:
        :return:
        """
        statcks_info = dp.sql("stacks").where("id=?", (get.project_id,)).find()
        if not statcks_info:
            return public.returnMsg(True, "没找到项目配置!")

        shell = "/usr/bin/docker-compose -f {} restart &> {}".format(
            "{}/data/compose/{}/docker-compose.yaml".format(public.get_panel_path(), public.md5(statcks_info['name'])),
            self._log_path
        )
        a, e = public.ExecShell(shell)
        if e:
            return public.returnMsg(False, "重启项目失败: {}".format(e))
        dp.write_log("重启项目 [{}] 成功!".format(statcks_info['name']))
        return public.returnMsg(True, "设置成功!")

    def pull(self, get):
        """
        拉取模板内需要的镜像
        template_id          数据库记录的项目ID
        :param get:
        :return:
        """
        statcks_info = dp.sql("templates").where("id=?", (get.template_id,)).find()
        if not statcks_info:
            return public.returnMsg(True, "没有找到该模板!")

        os.system(
            "nohup /usr/bin/docker-compose -f {} pull >> {} 2>&1 "
            "&& echo 'bt_successful' >> {} "
            "|| echo 'bt_failed' >> {} &".format(
                statcks_info['path'],
                self._log_path,
                self._log_path,
                self._log_path,
        ))
        dp.write_log("模板 [{}] 内的镜像拉取成功  !".format(statcks_info['name']))
        return public.returnMsg(True, "拉取成功!")

    def pause(self, get):
        """
        暂停项目
        project_id          数据库记录的项目ID
        :param get:
        :return:
        """
        statcks_info = dp.sql("stacks").where("id=?", (get.project_id,)).find()
        if not statcks_info:
            return public.returnMsg(True, "没找到项目配置!")
        shell = "/usr/bin/docker-compose -f {} pause &> {}".format(
            "{}/data/compose/{}/docker-compose.yaml".format(public.get_panel_path(), public.md5(statcks_info['name'])),
            self._log_path
        )
        a, e = public.ExecShell(shell)
        if e:
            return public.returnMsg(False, "暂停项目失败: {}".format(e))
        dp.write_log("暂停 [{}] 成功!".format(statcks_info['name']))
        return public.returnMsg(True, "设置成功!")

    def unpause(self, get):
        """
        取消暂停项目
        project_id          数据库记录的项目ID
        :param get:
        :return:
        """
        statcks_info = dp.sql("stacks").where("id=?", (get.project_id,)).find()
        if not statcks_info:
            return public.returnMsg(True, "没找到项目配置!")
        shell = "/usr/bin/docker-compose -f {} unpause &> {}".format(
            "{}/data/compose/{}/docker-compose.yaml".format(public.get_panel_path(), public.md5(statcks_info['name'])),
            self._log_path
        )
        a, e = public.ExecShell(shell)
        if e:
            return public.returnMsg(False, "取消暂停项目失败: {}".format(e))
        dp.write_log("取消暂停 [{}] 成功!".format(statcks_info['name']))
        return public.returnMsg(True, "设置成功!")

    def scan_compose_file(self, path, data):
        """
        递归扫描目录下的compose文件
        :param path 需要扫描的目录
        :param data 需要返回的数据 一个字典
        :param get:
        :return:
        """
        file_list = os.listdir(path)
        for file in file_list:
            current_path = os.path.join(path, file)
            # 判断是否是文件夹
            if os.path.isdir(current_path):
                self.scan_compose_file(current_path, data)
            else:
                if file == "docker-compose.yaml" or file == "docker-compose.yam" or file == "docker-compose.yml":
                    if "/www/server/panel/data/compose" in current_path:
                        continue
                    data.append(current_path)
                if ".yaml" in file or ".yam" in file or ".yml" in file:
                    if "/www/server/panel/data/compose" in current_path:
                        continue
                    data.append(current_path)
        return data

    def get_compose_project(self, get):
        """
        :param path 需要获取的路径 是一个目录
        :param sub_dir 扫描子目录
        :param get:
        :return:
        """
        data = list()
        suffix = ["yaml", "yam", "yml"]
        if get.path == "/":
            return public.returnMsg(False, "无法扫描根目录，文件数量太多!")

        if get.path[-1] == "/":
            get.path = get.path[:-1]
        if str(get.sub_dir) == "1":
            res = self.scan_compose_file(get.path, data)
            if not res:
                res = []
            else:
                tmp = list()
                p_name_tmp = list()
                for i in res:
                    if i.split(".")[1] not in suffix:
                        continue

                    project_name = i.split("/")[-1].split(".")[0]
                    if project_name in p_name_tmp:
                        project_name = "{}_{}".format(project_name, i.split("/")[-2])

                    tmp_data = {
                        "project_name": project_name,
                        "conf_file": "/".join(i.split("/")),
                        "remark": "从本地添加"
                    }

                    tmp.append(tmp_data)
                    p_name_tmp.append(tmp_data['project_name'])
                res = tmp
                p_name_tmp.clear()
        else:
            yaml = "{}/docker-compose.yaml".format(get.path)
            yam = "{}/docker-compose.yam".format(get.path)
            yml = "{}/docker-compose.yml".format(get.path)
            if os.path.exists(yaml):
                res = [{
                    "project_name": get.path.split("/")[-1],
                    "conf_file": yaml,
                    "remark": "从本地添加"
                }]
            elif os.path.exists(yam):
                res = [{
                    "project_name": get.path.split("/")[-1],
                    "conf_file": yam,
                    "remark": "从本地添加"
                }]
            elif os.path.exists(yml):
                res = [{
                    "project_name": get.path.split("/")[-1],
                    "conf_file": yml,
                    "remark": "从本地添加"
                }]
            else:
                res = list()

            if not os.path.isdir(get.path):
                return res

            dir_list = os.listdir(get.path)

            for i in dir_list:
                if i.rsplit(".")[-1] in suffix:
                    res.append({
                        "project_name": i.rsplit(".")[0],
                        "conf_file": "/".join(get.path.split("/") + [i]),
                        "remark": "从本地添加"
                    })

        return res

    # 从现有目录中添加模板
    def add_template_in_path(self, get):
        """
        :param template_list list [{"project_name":"pathtest_template","conf_file":"/www/dockerce/mysecent-project/docker-compose.yaml","remark":"描述描述"}]
        :param get:
        :return:
        """
        create_failed = dict()
        create_successfully = dict()
        for template in get.template_list:
            path = template['conf_file']
            name = template['project_name']
            remark = template['remark']
            exists = self.template_list(get)
            for i in exists:
                if name == i['name']:
                    create_failed[name] = "模板已存在!"
                    continue
            if not os.path.exists(path):
                create_failed[name] = "没找到此模板!"
                continue
            check_res = self.check_conf(path)
            if not check_res['status']:
                create_failed[name] = "模板验证失败，可能格式错误!"
                continue
            pdata = {
                "name": name,
                "remark": remark,
                "path": path,
                "add_in_path": 1
            }
            dp.sql("templates").insert(pdata)
            create_successfully[name] = "模板添加成功!"

        for i in create_failed:
            if i in create_successfully:
                del (create_successfully[i])
            else:
                dp.write_log("从路径 [{}] 添加模板成功!".format(i))
        if not create_failed and create_successfully:
            return {'status': True, 'msg': '添加模板成功: [{}]'.format(','.join(create_successfully))}
        elif not create_successfully and create_failed:

            return {'status': False,
                    'msg': '添加模板失败: 模板名已经存在或格式错误 [{}],请使用docker-compose -f [指定compose.yml文件] config进行检查'
                    .format(','.join(create_failed))}

        return {'status': False, 'msg': '这些模板成功: [{}]<br>这些模板失败: 模板名已经存在或格式错误 [{}]'.format(
            ','.join(create_successfully), ','.join(create_failed))}

    def get_pull_log(self, get):
        """
        获取镜像拉取日志，websocket
        @param get:
        @return:
        """
        get.wsLogTitle = "开始拉取模板镜像,请等待..."
        get._log_path = self._log_path
        return self.get_ws_log(get)
        
    # 编辑项目    
    def edit(self, get):
        """
        :param project_id: 要编辑的项目的ID
        :param project_name: 新的项目名
        :param remark: 新的描述
        :param template_id: 新的模板ID
        :return:
        """
        # 删除旧的项目
        remove_result = self.remove(get)
        if not remove_result['status']:
          return public.returnMsg(True, "修改失败!")  

        # 创建新的项目
        create_result = self.create(get)
        return public.returnMsg(True, "修改成功!")