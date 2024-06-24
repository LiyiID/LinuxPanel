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
import time

import crontab
import docker.errors
# ------------------------------
# Docker模型
# ------------------------------
import public
from btdockerModel import dk_public as dp
from btdockerModel.dockerBase import dockerBase


class main(dockerBase):

    def __init__(self):
        super().__init__()
        self.alter_table()
        if public.M('sqlite_master').db('docker_log_split').where('type=? AND name=?', ('table', 'docker_log_split')).count():
            p = crontab.crontab()
            llist = p.GetCrontab(None)

            if type(llist) == list:
                for i in llist:
                    if i['name'] == '[勿删]docker日志切割':
                        return

            get = {
                "name": "[勿删]docker日志切割",
                "type": "minute-n",
                "where1": 5,
                "hour": "",
                "minute": "",
                "week": "",
                "sType": "toShell",
                "sName": "",
                "backupTo": "localhost",
                "save": '',
                "sBody": "btpython /www/server/panel/script/dk_log_split.py",
                "urladdress": "undefined"
            }
            p.AddCrontab(get)

    def alter_table(self):
        if not dp.sql('sqlite_master').db('container').where('type=? AND name=? AND sql LIKE ?',
                                             ('table', 'container', '%sid%')).count():
            dp.sql('container').execute("alter TABLE container add container_name VARCHAR DEFAULT ''", ())

    def docker_client(self, url):
        return dp.docker_client(url)

    def get_cmd_log(self, get):
        """
        获取命令运行容器的日志，websocket
        @param get:
        @return:
        """
        get.wsLogTitle = "开始执行命令,请等待..."
        get._log_path = self._rCmd_log
        return self.get_ws_log(get)

    def run_cmd(self, get):
        """
        命令行创建运行容器(docker run)，需要做危险命令校验，存在危险命令则不执行
        @param get:
        @return:
        """
        import re
        if not hasattr(get, 'cmd'):
            return public.returnMsg(False, '请传入cmd参数错误')
        if "docker run" not in get.cmd:
            return public.returnMsg(False, '只能执行docker run命令')

        danger_cmd = ['rm', 'rmi', 'kill', 'stop', 'pause', 'unpause', 'restart', 'update', 'exec', 'init',
                      'shutdown', 'reboot', 'chmod', 'chown', 'dd', 'fdisk', 'killall', 'mkfs', 'mkswap', 'mount',
                      'swapoff', 'swapon', 'umount', 'userdel', 'usermod', 'passwd', 'groupadd', 'groupdel',
                      'groupmod', 'chpasswd', 'chage', 'usermod', 'useradd', 'userdel', 'pkill']

        danger_symbol = ['&', '&&', '||', '|', ';']

        for d in danger_cmd:
            if get.cmd.startswith(d) or re.search(r'\s{}\s'.format(d), get.cmd):
                return public.returnMsg(False, '存在危险命令: [{}]，不允许执行!'.format(d))

        for d in danger_symbol:
            if d in get.cmd:
                return public.returnMsg(False, '存在危险符号: [{}]，不允许执行!'.format(d))

        os.system("echo -n > {}".format(self._rCmd_log))
        os.system("nohup {} >> {} 2>&1 && echo 'bt_successful' >> {} || echo 'bt_failed' >> {} &".format(
            get.cmd,
            self._rCmd_log,
            self._rCmd_log,
            self._rCmd_log,
        ))

        return public.returnMsg(True, "命令已执行完毕！")

    # 添加容器
    def run(self, get):
        """
        :param name:容器名
        :param image: 镜像
        :param publish_all_ports 暴露所有端口 1/0
        :param ports  暴露某些端口 {'1111/tcp': ('127.0.0.1', 1111)}
        :param command 命令
        :param entrypoint  配置容器启动后执行的命令
        :param environment 环境变量 xxx=xxx 一行一条
        :param auto_remove 当容器进程退出时，在守护进程端启用自动移除容器。 0/1

        :param get:
        :return:
        """
        config_path = "{}/config/name_map.json".format(public.get_panel_path())
        if not os.path.exists(config_path):
            public.writeFile(config_path, json.dumps({}))

        if public.readFile(config_path) == '':
            public.writeFile(config_path, json.dumps({}))

        # 2024/2/20 下午 3:21 如果检测到是中文的容器名，则自动转换为英文 
        name_map = json.loads(public.readFile(config_path))
        import re
        if re.findall(r"[\u4e00-\u9fa5]", get.name):
            name_str = 'q18q' + public.GetRandomString(10).lower()
            name_map[name_str] = get.name
            get.name = name_str
            public.writeFile(config_path, json.dumps(name_map))

        cPorts = get.ports if "ports" in get and get.ports != "" else False
        nPorts = {}
        if not cPorts is False:
            if ":" in cPorts.keys():
                return public.returnMsg(False, "端口格式错误，暂不支持此种方式！")
            if "-" in cPorts.keys():
                return public.returnMsg(False, "端口格式错误，暂不支持此种方式！")

            for i in cPorts.keys():
                if cPorts[i] == "": continue
                if dp.check_socket(cPorts[i]):
                    return public.returnMsg(False, "服务器端口[{}]已被占用，请更换为其他端口！".format(cPorts[i]))

                if "tcp/udp" in i:
                    cPort = i.split('/')[0]
                    nPorts[str(cPort) + "/tcp"] = cPorts[i]
                    nPorts[str(cPort) + "/udp"] = cPorts[i]
                else:
                    nPorts[i] = cPorts[i]
            del cPorts

        if "image" not in get or not get.image:
            return public.returnMsg(False, "如果没有选择镜像，请到镜像标签拉取您需要的镜像！")

        if get.image == "<none>" or "<none>" in get.image:
            return public.returnMsg(False, "镜像不存在，请检查镜像名称是否正确！")

        mem_limit = get.mem_limit if "mem_limit" in get and get.mem_limit != "0" else None
        if not mem_limit is None:
            mem_limit_byte = dp.byte_conversion(get.mem_limit)
            if mem_limit_byte > dp.get_mem_info():
                return public.returnMsg(False, "内存配额已超过可用数量！")
            if mem_limit_byte < 6291456:
                return public.returnMsg(False, "内存配额不能小于6MB！")

        try:
            if "force_pull" in get and get.force_pull == "0":
                self.docker_client(self._url).images.get(get.image)
        except docker.errors.ImageNotFound as e:
            return public.returnMsg(False, "镜像[{}]不存在，如需尝试强制拉取请勾选【强制拉取】按钮！".format(get.image))
        except docker.errors.APIError as e:
            return public.returnMsg(False, "镜像[{}]不存在，如需尝试强制拉取请勾选【强制拉取】按钮！".format(get.image))

        # 2024/4/16 上午11:40 检查镜像是否存在并且处理镜像如果是非应用容器的情况
        try:
            from btdockerModel.dockerSock import image
            sk_image = image.dockerImage()
            image_inspect = sk_image.inspect(get.image)
            if type(image_inspect) != dict:
                return public.returnMsg(False, "镜像[{}]不存在，请检查镜像名称是否正确！".format(get.image))

            if "Config" in image_inspect and "Cmd" in image_inspect["Config"]:
                sh_list = ("bash", "sh", "dash", "/bin/sh", "/bin/bash", "/bin/dash")
                if len(image_inspect["Config"]["Cmd"]) == 1 and image_inspect["Config"]["Cmd"][0] in sh_list:
                    get.tty = "1"
                    get.stdin_open = "1"
        except Exception as e:
            pass

        cpu_quota = get.cpu_quota if "cpu_quota" in get and get.cpu_quota != "0" else 0
        if int(cpu_quota) != 0:
            cpu_quota = float(get.cpu_quota) * 100000

            if int(cpu_quota) / 100000 > dp.get_cpu_count():
                return public.returnMsg(False, "CPU 配额已超过可用内核数！")

        df_restart_policy = {"Name": "unless-stopped", "MaximumRetryCount": 0}
        restart_policy = get.restart_policy if "restart_policy" in get and get.restart_policy else df_restart_policy
        if restart_policy['Name'] == "always":
            restart_policy = {"Name": "always"}

        mem_reservation = get.mem_reservation if "mem_reservation" in get and get.mem_reservation != "" else None
        # 2023/12/19 下午 3:08 检测如果小于6MB则报错
        if not mem_reservation is None and mem_reservation != "0":
            mem_reservation_byte = dp.byte_conversion(mem_reservation)
            if mem_reservation_byte < 6291456:
                return public.returnMsg(False, "内存预留不能小于6MB！")

        network = get.network if "network" in get and get.network != "" else "bridge"
        ip_address = get.ip_address if "ip_address" in get and get.ip_address != "" else None

        try:
            res = self.docker_client(self._url).containers.run(
                name=get.name,
                image=get.image,
                detach=True,
                # cpuset_cpus=get.cpuset_cpus ,#指定容器使用的cpu个数
                tty=True if "tty" in get and get.tty == "1" else False,
                stdin_open=True if "stdin_open" in get and get.stdin_open == "1" else False,
                publish_all_ports=True if "publish_all_ports" in get and get.publish_all_ports != "0" else False,
                ports=nPorts if len(nPorts) > 0 else None,
                cpu_quota=int(cpu_quota) or 0,
                mem_reservation=mem_reservation,  # b,k,m,g
                mem_limit=mem_limit,  # b,k,m,g
                restart_policy=restart_policy,
                command=get.command if "command" in get and get.command != "" else None,
                volume_driver=get.volume_driver if "volume_driver" in get and get.volume_driver != "" else None,
                volumes=get.volumes if "volumes" in get and get.volumes != "" else None,
                auto_remove=True if "auto_remove" in get and get.auto_remove != "0" else False,
                privileged=True if "privileged" in get and get.privileged != "0" else False,
                environment=dp.set_kv(get.environment),  # "HOME=/value\nHOME11=value1"
                labels=dp.set_kv(get.labels),  # "key=value\nkey1=value1"
                network=network,
            )

        except docker.errors.APIError as e:
            if "invalid reference format" in str(e):
                return public.returnMsg(False, "镜像名称格式不正确，请输入正确的镜像名，如：nginx:latest")
            if "failed to create task for container" in str(e) or "failed to create shim task" in str(e):
                return public.returnMsg(False, "容器创建失败,详情：{}！".format(str(e)))
            if "Minimum memory limit can not be less than memory reservation limit, see usage" in str(e):
                return public.returnMsg(False, "内存配额不能小于内存保留量！")
            if "already exists in network bridge" in str(e):
                return public.returnMsg(False, "容器名称或网络桥接器已存在，请更换容器名后再试！")
            if "No command specified" in str(e):
                return public.returnMsg(False, "该镜像中无启动命令，请指定容器启动命令！")
            if "permission denied" in str(e):
                return public.returnMsg(False, "权限异常！详情：{}".format(str(e)))
            if "Internal Server Error" in str(e):
                return public.returnMsg(False, "容器创建失败！docker主进程或iptables异常，请在合适的时候重启docker服务！")
            if "repository does not exist or may require 'docker login'" in str(e):
                return public.returnMsg(False, "镜像[{}]不存在，请检查镜像名称是否正确！".format(get.image))
            if "Minimum memory reservation allowed is 6MB" in str(e):
                return public.returnMsg(False, "内存预留不能小于6MB！")
            if "container to be able to reuse that name." in str(e):
                return public.returnMsg(False, "容器名称已存在！")
            if "Invalid container name" in str(e):
                return public.returnMsg(False, "容器名称不合法,")
            if "bind: address already in use" in str(e):
                port = ""
                for i in get.ports:
                    if ":{}:".format(get.ports[i]) in str(e):
                        port = get.ports[i]
                get.id = get.name
                self.del_container(get)
                return public.returnMsg(False, "服务器端口 {} 正在使用中！ 请更改其他端口".format(port))
            return public.returnMsg(False, '创建失败! {}'.format(str(e)))
        except Exception as a:
            print(traceback.format_exc())
            self.del_container(get)
            if "Read timed out" in str(a):
                return public.returnMsg(False, "容器创建失败,连接docker超时,请尝试重启docker后再试!")
            return public.returnMsg(False, '容器运行失败! {}'.format(str(a)))

        if res:
            # print(res.status)
            # print(res.id)
            # dk_config = self.docker_client(self._url).containers.get(res.id)
            # print(dk_config.attrs['NetworkSettings']['Networks'][network]['IPAddress'])
            # 将容器的ip改成用户指定的ip
            pdata = {
                "cpu_limit": str(get.cpu_quota),
                "container_name": get.name
            }
            dp.sql('container').insert(pdata)
            public.set_module_logs('docker', 'run_container', 1)
            dp.write_log("创建容器 [{}] 成功！".format(get.name))

            # 2024/2/26 下午 6:00 添加备注
            self.check_remark_table()
            dp.sql('dk_container_remark').insert({
                "container_id": res.id,
                "container_name": get.name,
                "remark": public.xssencode2(get.remark),
                "addtime": int(time.time())
            })

            if not ip_address is None:
                try:
                    self.docker_client(self._url).networks.get(network).disconnect(res.id)
                    self.docker_client(self._url).networks.get(network).connect(res.id, ipv4_address=ip_address)
                    # dk_config = self.docker_client(self._url).containers.get(res.id)
                    # print(dk_config.attrs['NetworkSettings']['Networks'][network]['IPAddress'])
                    # logs = res.logs(stdout=True, stderr=True)
                    # print(logs.decode())
                except docker.errors.APIError as e:
                    if "Invalid IPv4 address" in str(e):
                        return public.returnMsg(
                            True, "容器创建成功，但是您输入的IP【{}】地址不合法，已为您自动分配IP！"
                            .format(ip_address)
                        )

            # 返回包含容器的id和name
            return {
                "status": True,
                "msg": "创建成功！",
                "id": res.id,
                "name": dp.rename(res.name),
            }
            # return public.returnMsg(True, "容器创建成功！")
        return public.returnMsg(False, '创建失败！')

    def upgrade_container(self, get):
        """
        更新正在运行的容器镜像（重建）
        @param get:
        @return:
        """
        try:
            if "id" not in get:
                return public.returnMsg(False, "容器ID异常，请刷新页面后重试！")

            container = self.docker_client(self._url).containers.get(get.id)

            old_container_config = self.save_container_config(container)
            new_image = get.new_image if "new_image" in get and get.new_image else "latest"
            if new_image is None:
                return public.returnMsg(False, "新镜像名称不能为空！")

            if "upgrade" in get and get.upgrade == "1":
                get.new_image = "{}:{}".format(old_container_config["image"].split(':')[0], new_image)

            try:
                if "force_pull" in get and get.force_pull == "1":
                    self.docker_client(self._url).images.get(get.new_image)
            except docker.errors.ImageNotFound as e:
                return public.returnMsg(False, "镜像不存在！")
            except docker.errors.APIError as e:
                return public.returnMsg(False, "镜像不存在！")

            get.old_container_config = old_container_config
            new_container_config = self.structure_new_container_conf(get)
            if type(new_container_config) != dict:
                return new_container_config

            container.stop()
            container.remove()

            try:
                new_container = self.docker_client(self._url).containers.run(
                    name=new_container_config["name"],
                    image=new_container_config["image"],
                    detach=new_container_config["detach"],
                    cpu_quota=new_container_config["cpu_quota"],
                    mem_limit=new_container_config["mem_limit"],
                    tty=new_container_config["tty"],
                    stdin_open=new_container_config["stdin_open"],
                    publish_all_ports=new_container_config["publish_all_ports"],
                    ports=new_container_config["ports"],
                    command=new_container_config["command"],
                    entrypoint=new_container_config["entrypoint"],
                    environment=new_container_config["environment"],
                    labels=new_container_config["labels"],
                    auto_remove=new_container_config["auto_remove"],
                    privileged=new_container_config["privileged"],
                    volumes=new_container_config["volumes"],
                    volume_driver=new_container_config["volume_driver"],
                    mem_reservation=new_container_config["mem_reservation"],
                    restart_policy=new_container_config["restart_policy"],
                    network=new_container_config["network"],
                )
            except Exception as e:
                if "Read timed out" in str(e):
                    return public.returnMsg(False, "容器编辑失败,连接docker超时,请尝试重启docker后再试!")
                print(traceback.format_exc())
                return public.returnMsg(False, "更新失败！{}".format(str(e)))

            if not "upgrade" in get or get.upgrade != "1":
                new_ip_address = get.new_ip_address if "new_ip_address" in get and get.new_ip_address else \
                    old_container_config["ip_address"]
                new_network = get.new_network if "new_network" in get and get.new_network else \
                    old_container_config["network"]

                if new_network != "bridge":
                    try:
                        self.docker_client(self._url).networks.get(new_network).disconnect(new_container.id)
                        self.docker_client(self._url).networks.get(new_network).connect(
                            new_container.id, ipv4_address=new_ip_address
                        )

                    except docker.errors.APIError as e:
                        if ("user specified IP address is supported only when "
                            "connecting to networks with user configured subnets") in str(e):
                            self.docker_client(self._url).networks.get(new_network).connect(new_container.id)
                            return public.returnMsg(
                                True, "容器编辑成功，当前指定的【{}】网络创建时未指定子网，无法自定义IP，已为您自动分配IP！"
                                .format(str(new_network))
                            )

                    except Exception as e:
                        self.docker_client(self._url).networks.get(new_network).connect(new_container.id)
                        print(traceback.format_exc())
                        return public.returnMsg(
                            True, "容器编辑成功，网络【{}】设置失败，已为您自动分配IP，错误详情：{}！"
                            .format(new_network, str(e))
                        )

            return public.returnMsg(True, "更新成功！")
        except docker.errors.NotFound as e:
            if "No such container" in str(e):
                return public.returnMsg(False, "容器不存在！")
            return public.returnMsg(False, "更新失败！{}".format(str(e)))
        except docker.errors.APIError as e:
            if "No such container" in str(e):
                return public.returnMsg(False, "容器不存在！")
            return public.returnMsg(False, "更新失败！{}".format(str(e)))
        except Exception as a:
            if "Read timed out" in str(a):
                return public.returnMsg(False, "容器编辑失败,连接docker超时,请尝试重启docker后再试!")
            print(traceback.format_exc())
            return public.returnMsg(False, "更新失败！{}".format(str(a)))

    def save_container_config(self, container):
        """
        保存容器的配置信息
        """
        ip_address, network = None, None
        if len(container.attrs['NetworkSettings']['Networks']) != 0:
            Networks = container.attrs['NetworkSettings']['Networks'][list(container.attrs['NetworkSettings']['Networks'].keys())[0]]
            ip_address = Networks['IPAddress']
            network = Networks['NetworkID']

        container_config = {
            "image": container.attrs['Config']['Image'],
            "name": container.attrs['Name'],
            "detach": True,
            "cpu_quota": container.attrs['HostConfig']['CpuQuota'],
            "mem_limit": container.attrs['HostConfig']['Memory'],
            "tty": container.attrs['Config']['Tty'],
            "stdin_open": container.attrs['Config']['OpenStdin'],
            "publish_all_ports": container.attrs['HostConfig']['PublishAllPorts'],
            "ports": container.attrs['NetworkSettings']['Ports'],
            "command": container.attrs['Config']['Cmd'],
            "entrypoint": container.attrs['Config']['Entrypoint'],
            "environment": container.attrs['Config']['Env'],
            "labels": container.attrs['Config']['Labels'],
            "auto_remove": container.attrs['HostConfig']['AutoRemove'],
            "privileged": container.attrs['HostConfig']['Privileged'],
            "volumes": container.attrs['HostConfig']['Binds'],
            "volume_driver": container.attrs['HostConfig']['VolumeDriver'],
            "mem_reservation": container.attrs['HostConfig']['MemoryReservation'],
            "restart_policy": container.attrs['HostConfig']['RestartPolicy'],
            "network": network,
            "ip_address": ip_address,
        }
        return container_config

    def structure_new_container_conf(self, get):
        """
        构造新的容器配置
        @param get:
        @return:
        """
        new_image = get.new_image if "new_image" in get and get.new_image else get.old_container_config["image"]
        new_name = get.new_name if "new_name" in get and get.new_name else get.old_container_config["name"].replace("/", "")
        new_cpu_quota = get.new_cpu_quota if "new_cpu_quota" in get and get.new_cpu_quota != 0 else get.old_container_config["cpu_quota"]
        if int(new_cpu_quota) != 0:
            new_cpu_quota = float(new_cpu_quota) * 100000

            if int(new_cpu_quota) / 100000 > dp.get_cpu_count():
                return public.returnMsg(False, "CPU 配额已超过可用内核数！")

        new_mem_limit = get.new_mem_limit if "new_mem_limit" in get and get.new_mem_limit else get.old_container_config["mem_limit"]
        new_tty = get.new_tty if "new_tty" in get and get.new_tty else get.old_container_config["tty"]
        new_stdin_open = get.new_stdin_open if "new_stdin_open" in get and get.new_stdin_open else get.old_container_config["stdin_open"]
        new_publish_all_ports = get.new_publish_all_ports if "new_publish_all_ports" in get and get.new_publish_all_ports != '0' else get.old_container_config["publish_all_ports"]
        new_ports = get.new_ports if "new_ports" in get and get.new_ports else get.old_container_config["ports"]
        new_command = get.new_command if "new_command" in get and get.new_command != '' else get.old_container_config["command"]
        new_entrypoint = get.new_entrypoint if "new_entrypoint" in get and get.new_entrypoint != '' else get.old_container_config["entrypoint"]
        new_environment = get.new_environment if "new_environment" in get and get.new_environment != '' else get.old_container_config["environment"]
        new_labels = get.new_labels if "new_labels" in get and get.new_labels != '' else get.old_container_config["labels"]
        new_auto_remove = True if "new_auto_remove" in get and get.new_auto_remove != '0' else get.old_container_config["auto_remove"]
        new_privileged = True if "new_privileged" in get and get.new_privileged != '0' else get.old_container_config["privileged"]
        new_volumes = get.new_volumes if "new_volumes" in get and get.new_volumes else get.old_container_config["volumes"]
        new_volume_driver = get.new_volume_driver if "new_volume_driver" in get and get.new_volume_driver else get.old_container_config["volume_driver"]
        new_mem_reservation = get.new_mem_reservation if "new_mem_reservation" in get and get.new_mem_reservation else get.old_container_config["mem_reservation"]
        new_restart_policy = get.new_restart_policy if "new_restart_policy" in get and get.new_restart_policy else get.old_container_config["restart_policy"]
        new_network = get.new_network if "new_network" in get and get.new_network else get.old_container_config["network"]

        container_config = {
            "image": new_image,
            "name": new_name,
            "detach": True,
            "cpu_quota": int(new_cpu_quota),
            "mem_limit": new_mem_limit,
            "tty": new_tty,
            "stdin_open": new_stdin_open,
            "publish_all_ports": new_publish_all_ports,
            "ports": new_ports,
            "command": new_command,
            "entrypoint": new_entrypoint,
            "environment": dp.set_kv(new_environment) if type(new_environment) != list else new_environment,
            "labels": dp.set_kv(new_labels) if type(new_labels) != dict else new_labels,
            "auto_remove": new_auto_remove,
            "privileged": new_privileged,
            "volumes": new_volumes,
            "volume_driver": new_volume_driver,
            "mem_reservation": new_mem_reservation,
            "restart_policy": new_restart_policy,
            "network": new_network,
        }
        return container_config

    def commit(self, get):
        """
        保存为镜像
        :param repository       推送到的仓库
        :param tag              镜像标签 jose:v1
        :param message          提交的信息
        :param author           镜像作者
        :param changes
        :param conf dict
        :param path 导出路径
        :param name 导出文件名
        :param get:
        :return:
        """
        try:
            if not hasattr(get, 'conf') or not get.conf:
                get.conf = None
            if get.repository == "docker.io":
                get.repository = ""

            container = self.docker_client(self._url).containers.get(get.id)
            container.commit(
                repository=get.repository if "repository" in get else None,
                tag=get.tag if "tag" in get else None,
                message=get.message if "message" in get else None,
                author=get.author if "author" in get else None,
                # changes=get.changes if get.changes else None,
                conf=get.conf
            )
            dp.write_log("提交容器 [{}] 作为图像 [{}] 成功！".format(container.attrs['Name'], get.tag))

            if hasattr(get, "path") and get.path:
                get.id = "{}:{}".format(get.repository, get.tag)
                from btdockerModel import imageModel as di
                result =  di.main().save(get)
                if result['status']:
                    return public.returnMsg(True, "镜像已生成，并{}".format(result['msg']))
                return result

            return public.returnMsg(True, "提交成功！")
        except Exception as e:
            return public.returnMsg(False, "提交失败！{}".format(str(e)))

    def docker_shell(self, get):
        """
        容器执行命令
        :param get:
        :return:
        """
        try:
            if "id" not in get:
                return public.returnMsg(False, "容器ID异常，请刷新页面后重试！")

            shell_list = ('bash', 'sh')
            if "shell" not in get:
                return public.returnMsg(False, "请选择shell类型！")

            if get.shell not in shell_list:
                return public.returnMsg(False, "不支持此种shell,请选择bash或sh！")

            cmd = 'docker container exec -it {} {}'.format(get.id, get.shell)
            return public.returnMsg(True, cmd)
        except docker.errors.APIError as ex:
            return public.returnMsg(False, '获取容器失败')

    def export(self, get):
        """
        导出容器为tar 没有导入方法，目前弃用
        :param get:
        :return:
        """
        from os import path as ospath
        from os import makedirs as makedirs
        try:
            if "tar" in get.name:
                file_name = '{}/{}'.format(get.path, get.name)
            else:
                file_name = '{}/{}.tar'.format(get.path, get.name)
            if not ospath.exists(get.path):
                makedirs(get.path)
            public.writeFile(file_name, '')
            f = open(file_name, 'wb')
            container = self.docker_client(self._url).containers.get(get.id)
            data = container.export()
            for i in data:
                f.write(i)
            f.close()
            return public.returnMsg(True, "成功导出到：{}".format(file_name))
        except:
            return public.returnMsg(False, '操作失败：' + str(public.get_error_info()))

    def del_container(self, get):
        """
        删除指定容器
        @param get:
        @return:
        """
        import sys
        sys.path.insert(0, '/www/server/panel/class')
        from btdockerModel.proxyModel import main
        from panelSite import panelSite
        try:
            container = self.docker_client(self._url).containers.get(get.id)
            config_path = "{}/config/name_map.json".format(public.get_panel_path())
            if not os.path.exists(config_path):
                public.writeFile(config_path, json.dumps({}))
            if public.readFile(config_path) == '':
                public.writeFile(config_path, json.dumps({}))
            config_data = json.loads(public.readFile(config_path))
            if container.name in config_data.keys():
                config_data.pop(container.name)
            public.writeFile(config_path, json.dumps(config_data))
            container.remove(force=True)
            dp.sql("cpu_stats").where("container_id=?", (get.id,)).delete()
            dp.sql("io_stats").where("container_id=?", (get.id,)).delete()
            dp.sql("mem_stats").where("container_id=?", (get.id,)).delete()
            dp.sql("net_stats").where("container_id=?", (get.id,)).delete()
            dp.sql("container").where("container_nam=?", (container.attrs['Name'])).delete()
            dp.write_log("删除容器 [{}] 成功！".format(container.attrs['Name']))
            get.container_id=get.id
            info=main().get_proxy_info(get)
            if info and 'name' in info and 'id' in info:
                print(info['name'])
                print(info['id'])
                args = public.to_dict_obj({
                    'id': info['id'],
                    'webname':info['name']

                })
                panelSite().DeleteSite(args)
                # domain_id = dp.sql('dk_domain').where('id=?', (info['id'],)).find()

                # 删除站点
                dp.sql('sites').where('name=?', (info['name'],)).delete()
                dp.sql('domain').where("name=?", (info['name'],)).delete()

                # 删除数据库记录
                dp.sql('dk_domain').where('id=?', (info['id'],)).delete()
                dp.sql('dk_sites').where('container_id=?', (get.id,)).delete()

            return public.returnMsg(True, "成功删除!")
        except Exception as e:
            return public.returnMsg(False, "删除失败!"+str(e))

    # 设置容器状态
    def set_container_status(self, get):
        """
        设置容器状态
        @param get:
        @return:
        """
        try:
            container = self.docker_client(self._url).containers.get(get.id)
            result = {"status": True, "msg": "设置成功!"}
            if get.status == "start":
                result = self.start(get)
            elif get.status == "stop":
                result = self.stop(get)
            elif get.status == "pause":
                result = self.pause(get)
            elif get.status == "unpause":
                result = self.unpause(get)
            elif get.status == "reload":
                result = self.reload(get)
            elif get.status == "kill":
                container.kill()
            else:
                container.restart()

            try:
                return {
                    "name": container.attrs['Name'].replace('/', ''),
                    "status": result['status'],
                    "msg": result['msg'],
                }
            except:
                return {
                    "name": container.attrs['Name'].replace('/', ''),
                    "status": False,
                    "msg": str(result),
                }
        except Exception as e:
            if "No such container" in str(e):
                return public.returnMsg(False, "容器已被删除!")
            if "port is already allocated" in str(e) or "address already in use" in str(e):
                if "[::]" in str(e):
                    str_port = str(e).split("[::]:")[1].split(":")[0]
                    return public.returnMsg(False, "ipv6服务器端口[{}] 已被占用!".format(str_port))
                else:
                    str_port = str(e).split("0.0.0.0")[1].split(":")[1].split(" ")[0]
                    return public.returnMsg(False, "ipv4服务器端口[{}] 已被占用!".format(str_port))
            return public.returnMsg(False, "设置失败!" + str(e))

    # 停止容器
    def stop(self, get):
        """
        停止指定容器
        :param get:
        :return:
        """
        try:
            get.status = "stop"
            container = self.docker_client(self._url).containers.get(get.id)
            container.stop()
            time.sleep(1)
            data = self.docker_client(self._url).containers.get(get.id)
            if data.attrs['State']['Status'] != "exited":
                return public.returnMsg(False, "停止失败!")
            dp.write_log("停止容器 [{}] 成功!".format(data.attrs['Name'].replace('/', '')))
            return public.returnMsg(True, "停止成功!")
        except docker.errors.APIError as e:
            if "is already paused" in str(e):
                return public.returnMsg(False, "容器已暂停!")
            if "No such container" in str(e):
                return public.returnMsg(True, "容器已停止并删除，因为容器有停止后自动删除的选项!")
            return public.returnMsg(False, "停止失败!{}".format(e))

    def start(self, get):
        """
        启动指定容器
        :param get:
        :return:
        """
        try:
            get.status = "start"
            container = self.docker_client(self._url).containers.get(get.id)
            container.start()
            time.sleep(1)
            data = self.docker_client(self._url).containers.get(get.id)
            if data.attrs['State']['Status'] != "running":
                return public.returnMsg(False, "启动失败!")
            dp.write_log("启动容器 [{}] 成功!".format(data.attrs['Name'].replace('/', '')))
            return public.returnMsg(True, "启动成功!")
        except docker.errors.APIError as e:
            if "cannot start a paused container, try unpause instead" in str(e):
                return self.unpause(get)
        except Exception as a:
            print(traceback.format_exc())
            raise Exception(a)

    def pause(self, get):
        """
        暂停此容器内的所有进程
        :param get:
        :return:
        """
        try:
            get.status = "pause"
            container = self.docker_client(self._url).containers.get(get.id)
            container.pause()
            time.sleep(1)
            data = self.docker_client(self._url).containers.get(get.id)
            if data.attrs['State']['Status'] != "paused":
                return public.returnMsg(False, "容器暂停失败!")
            dp.write_log("暂停容器 [{}] 成功!".format(data.attrs['Name'].replace('/', '')))
            return public.returnMsg(True, "容器暂停成功!")
        except docker.errors.APIError as e:
            if "is already paused" in str(e):
                return public.returnMsg(False, "容器已被挂起！")
            if "is not running" in str(e):
                return public.returnMsg(False, "容器未启动，无法暂停!")
            if "is not paused" in str(e):
                return public.returnMsg(False, "容器没有被暂停或已被删除，请检查容器是否有停止后立即删除的选项!")
            return str(e)
        except Exception as a:
            print(traceback.format_exc())
            raise Exception(a)

    def unpause(self, get):
        """
        取消暂停该容器内的所有进程
        :param get:
        :return:
        """
        try:
            get.status = "unpause"
            container = self.docker_client(self._url).containers.get(get.id)
            container.unpause()
            time.sleep(1)
            data = self.docker_client(self._url).containers.get(get.id)
            if data.attrs['State']['Status'] != "running":
                return public.returnMsg(False, "启动失败!")
            dp.write_log("取消暂停容器 [{}] 成功!".format(data.attrs['Name'].replace('/', '')))
            return public.returnMsg(True, "容器取消暂停成功")
        except docker.errors.APIError as e:
            if "is already paused" in str(e):
                return public.returnMsg(False, "容器已暂停!")
            if "is not running" in str(e):
                return public.returnMsg(False, "容器未启动，无法暂停!")
            if "is not paused" in str(e):
                return public.returnMsg(False, "容器没有被暂停或已被删除，请检查容器是否有停止后立即删除的选项!")
            return str(e)
        except Exception as a:
            print(traceback.format_exc())
            raise Exception(a)

    def reload(self, get):
        """
        再次从服务器加载此对象并使用新数据更新 attrs
        :param get:
        :return:
        """
        get.status = "reload"
        container = self.docker_client(self._url).containers.get(get.id)
        container.reload()
        time.sleep(1)
        data = self.docker_client(self._url).containers.get(get.id)
        if data.attrs['State']['Status'] != "running":
            return public.returnMsg(False, "启动失败!")
        dp.write_log("重新加载容器 [{}] 成功!".format(data.attrs['Name'].replace('/', '')))
        return public.returnMsg(True, "重载容器成功!")

    def restart(self, get):
        """
        重新启动这个容器。类似于 docker restart 命令
        :param get:
        :return:
        """
        try:
            get.status = "restart"
            container = self.docker_client(self._url).containers.get(get.id)
            container.restart()
            time.sleep(1)
            data = self.docker_client(self._url).containers.get(get.id)
            if data.attrs['State']['Status'] != "running":
                return public.returnMsg(False, "启动失败!")
            dp.write_log("重启容器 [{}] 成功!".format(data.attrs['Name'].replace('/', '')))
            return public.returnMsg(True, "容器重启成功!")
        except docker.errors.APIError as e:
            if "container is marked for removal and cannot be started" in str(e):
                return public.returnMsg(False, "容器已停止并删除，因为容器有停止后自动删除的选项!")
            if "is already paused" in str(e):
                return public.returnMsg(False, "容器已暂停!")
            return str(e)

    def get_container_ip(self, container_networks):
        """
        获取容器IP
        @param container_networks:
        @return:
        """
        data = list()
        for network in container_networks:
            data.append(container_networks[network]['IPAddress'])
        return data

    def get_container_path(self, detail):
        """
        获取容器路径
        @param detail:
        @return:
        """
        try:
            import os
            if not "GraphDriver" in detail:
                return False
            if "Data" not in detail["GraphDriver"]:
                return False
            if "MergedDir" not in detail["GraphDriver"]["Data"]:
                return False
            path = detail["GraphDriver"]["Data"]["MergedDir"]
            if not os.path.exists(path):
                return ""
            return path
        except:
            return False

    def get_container_info(self, get):
        """
        获取容器信息
        @param get:
        @return:
        """
        try:
            if "id" not in get or get.id == "":
                return public.returnMsg(False, "容器ID为空，请刷新浏览器后再试！")

            from btdockerModel.dockerSock import container
            sk_container = container.dockerContainer()
            sk_container_info = sk_container.get_container_inspect(get.id)

            info_path = "/var/lib/docker/containers/{}/container_info.json".format(get.id)
            public.writeFile(info_path, json.dumps(sk_container_info, indent=3))
            sk_container_info['container_info'] = info_path
            return sk_container_info
        except Exception as e:
            if "No such container" in str(e):
                return public.returnMsg(False, "容器不存在！")
            return public.returnMsg(False, "获取容器信息失败！{}".format(str(e)))

    def struct_container_ports(self, ports):
        """
        构造容器ports
        @param ports:
        @return:
        """
        data = dict()
        for port in ports:
            key = str(port["PrivatePort"]) + "/" + port["Type"]
            if key not in data.keys():
                data[str(port["PrivatePort"]) + "/" + port["Type"]] = [{
                            "HostIp": port["IP"],
                            "HostPort": str(port["PublicPort"])
                        }] if "IP" in port else None
            else:
                data[str(port["PrivatePort"]) + "/" + port["Type"]].append({
                    "HostIp": port["IP"],
                    "HostPort": str(port["PublicPort"])
                })
        return data

    def struct_container_list(self, container):
        '''
            @name 构造容器列表
            @author wzz <2024/3/13 下午 5:32>
            @param "data":{"参数名":""} <数据类型> 参数描述
            @return dict{"status":True/False,"msg":"提示信息"}
        '''
        tmp = {
            "id": container["Id"],
            "name": dp.rename(container['Names'][0].replace("/", "")),
            "status": container["State"],
            "image": container["Image"],
            "created_time": dp.timestamp_to_string(container["Created"]),
            "ip": self.get_container_ip(container["NetworkSettings"]['Networks']),
            "ports": self.struct_container_ports(container["Ports"]),
        }

        return tmp

    # 2024/4/11 下午2:46 获取 merged 目录
    def get_container_merged(self, get):
        '''
            @name 获取容器 merged 目录
            @author wzz <2024/4/11 下午2:47>
            @param "data":{"参数名":""} <数据类型> 参数描述
            @return dict{"status":True/False,"msg":"提示信息"}
        '''
        try:
            get.id = get.get("id", "")
            if get.id == "":
                return public.returnMsg(False, "容器ID为空，请刷新浏览器后再试！")
            return {"path": public.ExecShell("docker inspect -f \"{{json .GraphDriver.Data.MergedDir}}\" " + get.id)[0].strip().strip('"')}
        except Exception as e:
            return {"path": ""}

    # 2024/4/11 下午3:44 获取其他容器列表的数据
    def get_other_container_data(self, get):
        '''
            @name 获取其他容器列表的数据
            @author wzz <2024/4/11 下午3:45>
            @param "data":{"参数名":""} <数据类型> 参数描述
            @return dict{"status":True/False,"msg":"提示信息"}
        '''
        try:
            from btdockerModel.dockerSock import container

            sk_container = container.dockerContainer()
            container_list = sk_container.get_container()

            data = []
            for sk_c in container_list:
                try:
                    remark_result = dp.sql("dk_container_remark").where("container_id=?", (sk_c["Id"],)).select()
                    remark = remark_result[0]['remark'] if isinstance(remark_result, list) and len(
                        remark_result) > 0 else ""
                except Exception as e:
                    remark = ""

                data.append({
                    "id": sk_c["Id"],
                    "name": dp.rename(sk_c['Names'][0].replace("/", "")),
                    "backup_count": dp.sql("dk_backup").where("container_id=?", (sk_c["Id"],)).count(),
                    "remark": remark,
                })

            return data
        except Exception as e:
            return []

    # 获取容器列表
    def get_list(self, get):
        """
        获取所有容器列表 1
        :param get
        :return:
        """
        from btdockerModel.dockerSock import container
        sk_container = container.dockerContainer()
        sk_container_list = sk_container.get_container()

        data = {
            "online_cpus": dp.get_cpu_count(),
            "mem_total": dp.get_mem_info(),
            "container_list": [],
        }

        container_detail = list()
        grouped_by_status = dict()
        for sk_c in sk_container_list:
            struct_container = self.struct_container_list(sk_c)
            status = struct_container['status']
            grouped_by_status.setdefault(status, []).append(struct_container)
            container_detail.append(struct_container)

        data['grouped_by_status'] = grouped_by_status
        data['container_list'] = container_detail
        return data

    # 获取容器的attr
    def get_container_attr(self, containers):
        c_list = containers.list(all=True)
        return [container_info.attrs for container_info in c_list]

    # 获取容器日志
    def get_logs(self, get):
        """
        获取指定容器日志
        :param get:
        :return:
        """
        res = {
            "logs": "",
            'split_status': False,
            'split_type': 'day',
            'split_size': 1000,
            'split_hour': 2,
            'split_minute': 0,
            'save': '180'
        }

        try:
            container = self.docker_client(self._url).containers.get(get.id)
            if hasattr(get, 'time_search') and get.time_search != '':
                if not os.path.exists(container.attrs['LogPath']):
                    return ""

                time_search = json.loads(str(get.time_search))
                since = int(time_search[0])
                until = int(time_search[1])
                r_logs = container.logs(since=since, until=until).decode()

            else:
                if not os.path.exists(container.attrs['LogPath']):
                    return ""

                size = os.stat(container.attrs['LogPath']).st_size
                if size < 1048576:
                    r_logs = container.logs().decode()
                else:
                    tail = int(get.tail) if "tail" in get else 3000
                    r_logs = container.logs(tail=tail).decode()

            if hasattr(get, 'search') and get.search != '':
                if get.search:
                    r_logs = r_logs.split("\n")
                    r_logs = [i for i in r_logs if get.search in i]
                    r_logs = "\n".join(r_logs)

            res['logs'] = r_logs
            res['id'] = get.id
            res['name'] = dp.rename(container.attrs['Name'][1:])
            res['logs_path'] = container.attrs['LogPath']
            res['size'] = os.stat(container.attrs['LogPath']).st_size

            if public.M('sqlite_master').db('docker_log_split').where('type=? AND name=?', ('table', 'docker_log_split')).count():
                res['split_status'] = True if public.M('docker_log_split').where('pid=?', (get.id,)).count() else False
                data = public.M('docker_log_split').where('pid=?', (get.id,)).select()
                if data:
                    res['split_type'] = data[0]['split_type']
                    res['split_size'] = data[0]['split_size']
                    res['split_hour'] = data[0]['split_hour']
                    res['split_minute'] = data[0]['split_minute']
                    res['save'] = data[0]['save']
                else:
                    res['split_type'] = 'day'
                    res['split_size'] = 1000
                    res['split_hour'] = 2
                    res['split_minute'] = 0
                    res['save'] = '180'

            return res

        except Exception:
            return res

    def get_logs_all(self, get):
        """
        获取所有容器的日志
        @param get:
        @return:
        """
        try:
            client = self.docker_client(self._url)
            if not client:
                return public.returnMsg(True, 'docker连接失败')
            containers = client.containers
            clist = [i.attrs for i in containers.list(all=True)]
            clist = [{'id': i['Id'], 'name': dp.rename(i['Name'][1:]), 'log_path': i['LogPath']} for i in clist]
            for i in clist:
                if os.path.exists(i['log_path']):
                    i['size'] = os.stat(i['log_path']).st_size
                else:
                    i['size'] = 0
            return clist
        except Exception as e:
            return public.returnMsg(True, e)

    def docker_split(self, get):
        """
        设置容器日志切割
        @param get:
        @return:
        """
        try:
            client = self.docker_client(self._url)
            if not client:
                return public.returnMsg(True, 'docker连接失败')
            containers = client.containers
            clist = [i.attrs for i in containers.list(all=True)]
            name = [dp.rename(i['Name'][1:]) for i in clist if i['Id'] == get.pid]
            if name:
                name = name[0]
            else:
                name = ''
            if not hasattr(get, 'type'):
                return public.returnMsg(False, '参数错误，请传入：type')
            if not public.M('sqlite_master').db('docker_log_split').where('type=? AND name=?', ('table', 'docker_log_split')).count():
                public.M('docker_log_split').execute('''CREATE TABLE IF NOT EXISTS docker_log_split (
                id      INTEGER      PRIMARY KEY AUTOINCREMENT,
                name    text default '',
                pid    text default '',
                log_path     text default '',
                split_type text default '',
                split_size INTEGER default 0,
                split_hour INTEGER default 2,
                split_minute INTEGER default 0,
                save INTEGER default 180)''', ())
            if get.type == 'add':
                if "log_path" not in get or not get.log_path:
                    return public.returnMsg(False, '容器日志目录不存在，无法设置日志切割！')

                if not (hasattr(get, 'pid') and hasattr(get, 'log_path') and
                        hasattr(get, 'split_type') and hasattr(get, 'split_size') and
                        hasattr(get, 'split_minute') and
                        hasattr(get, 'split_hour') and hasattr(get, 'save')):
                    return public.returnMsg(False, '参数错误')
                data = {
                    'name': name,
                    'pid': get.pid,
                    'log_path': get.log_path,
                    'split_type': get.split_type,
                    'split_size': get.split_size,
                    'split_hour': get.split_hour,
                    'split_minute': get.split_minute,
                    'save': get.save
                }
                if public.M('docker_log_split').where('pid=?', (get.pid,)).count():
                    id = public.M('docker_log_split').where('pid=?', (get.pid,)).select()
                    public.M('docker_log_split').delete(id[0]['id'])
                public.M('docker_log_split').insert(data)
                return public.returnMsg(True, "开启成功!")
            elif get.type == 'del':
                id = public.M('docker_log_split').where('pid=?', (get.pid,)).getField('id')
                public.M('docker_log_split').where('id=?', (id,)).delete()
                return public.returnMsg(True, "关闭成功!")
        except:
            return public.returnMsg(False, traceback.format_exc())

    def clear_log(self, get):
        """
        清空日志
        @param get:
        @return:
        """
        if not hasattr(get, 'log_path'):
            return public.returnMsg(False, '参数错误')
        if not os.path.exists(get.log_path):
            return public.returnMsg(False, '日志文件不存在')
        public.writeFile(get.log_path, '')
        return public.returnMsg(True, "日志清理成功成功!")

    def prune(self, get):
        """
        :param get:
        :return:
        """
        try:
            res = self.docker_client(self._url).containers.prune()
            if not res['ContainersDeleted']:
                return public.returnMsg(False, "没有无用的容器！")
            dp.write_log("删除无用的容器成功！")
            return public.returnMsg(True, "删除成功！")
        except docker.errors.APIError as e:
            return public.returnMsg(False, "删除失败！ {}".format(e))

    def update_restart_policy(self, get):
        """
        更新容器重启策略
        @param get:
        @return:
        """
        try:
            if "restart_policy" not in get:
                return public.returnMsg(False, "参数错误,请传入重启策略restart_policy！")

            container = self.docker_client(self._url).containers.get(get.id)
            container.update(restart_policy=get.restart_policy)
            dp.write_log("更新容器 [{}] 重启策略成功！".format(container.attrs['Name']))
            return public.returnMsg(True, "更新成功！")
        except docker.errors.APIError as e:
            return public.returnMsg(False, "更新失败！ {}".format(e))
    '''
        @name 重命名指定容器
        @author wzz <2023/12/1 下午 3:13>
        @param 参数名<数据类型> 参数描述
        @return 数据类型
    '''
    def rename_container(self, get):
        """
        重命名指定容器
        @param get:
        @return:
        """
        try:
            # 2023/12/6 上午 10:54 容器未启动时，不允许重命名
            container = self.docker_client(self._url).containers.get(get.id)
            if container.attrs['State']['Status'] != "running":
                return public.returnMsg(False, "容器未启动，无法重命名！")
            config_path = "{}/config/name_map.json".format(public.get_panel_path())
            if not os.path.exists(config_path):
                public.writeFile(config_path, json.dumps({}))

            if public.readFile(config_path) == '':
                public.writeFile(config_path, json.dumps({}))

            name_map = json.loads(public.readFile(config_path))
            name_str = 'q18q' + public.GetRandomString(10).lower()
            name_map[name_str] = get.name
            get.name = name_str
            public.writeFile(config_path, json.dumps(name_map))

            container.rename(get.name)
            dp.write_log("重命名容器 [{}] 成功！".format(get.name))
            return public.returnMsg(True, "重命名成功！")
        except docker.errors.APIError as e:
            return public.returnMsg(False, "重命名失败！ {}".format(e))

    # 2024/2/23 上午 9:58 设置容器列表置顶
    def set_container_to_top(self, get):
        """
        设置容器列表置顶
        @param get:
        @return:
        """
        set_type = get.type if "type" in get else ""
        container_name = get.container_name if "container_name" in get else None

        if set_type not in ['add', 'del']: return public.returnMsg(False, '类型仅支持add/del')
        if container_name is None: return public.returnMsg(False, '请选择容器')

        _conf_path = "{}/class/btdockerModel/config/container_top.json".format(public.get_panel_path())
        if os.path.exists(_conf_path):
            container_top_conf = json.loads(public.readFile(_conf_path))
        else:
            container_top_conf = []

        if set_type == "add":
            container_top_conf = [i for i in container_top_conf if i != container_name]
            container_top_conf.insert(0, container_name)
            public.writeFile(_conf_path, json.dumps(container_top_conf))
            return public.returnMsg(True, '设置置顶成功！')
        elif set_type == "del":
            container_top_conf.remove(container_name)
            public.writeFile(_conf_path, json.dumps(container_top_conf))
            return public.returnMsg(True, '取消置顶成功！')

    # 2024/2/23 上午 9:58 获取容器列表置顶
    def _get_container_to_top(self):
        """
        获取容器列表置顶
        @return:
        """
        _conf_path = "{}/class/btdockerModel/config/container_top.json".format(public.get_panel_path())
        if os.path.exists(_conf_path):
            container_top_conf = json.loads(public.readFile(_conf_path))
        else:
            container_top_conf = []

        return container_top_conf

    # 2024/3/13 下午 5:46 检查并创建备注的表
    def check_remark_table(self):
        '''
            @name 检查并创建备注的表
            @author wzz <2024/2/26 下午 5:59>
            @param "data":{"参数名":""} <数据类型> 参数描述
            @return dict{"status":True/False,"msg":"提示信息"}
        '''
        if not dp.sql('sqlite_master').db('dk_container_remark').where('type=? AND name=?', ('table', 'dk_container_remark')).count():
            dp.sql('dk_container_remark').execute(
                "CREATE TABLE `dk_container_remark` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `container_id` TEXT, `container_name` TEXT, `remark` TEXT, `addtime` TEXT)",
                ()
            )

    # 2024/2/26 下午 6:11 修改备注
    def set_container_remark(self, get):
        """
        设置容器备注
        @param get:
        @return:
        """
        if not hasattr(get, 'remark'):
            return public.returnMsg(False, '参数错误, 请传入remark！')
        if not hasattr(get, 'id'):
            return public.returnMsg(False, '参数错误, 请传入id！')

        container_id = get.id
        container_remark = public.xssencode2(get.remark)

        if not dp.sql("dk_container_remark").where("container_id=?", (container_id,)).count():
            dp.sql("dk_container_remark").insert({
                "container_id": container_id,
                "remark": container_remark,
            })
        else:
            dp.sql("dk_container_remark").where("container_id=?", (container_id,)).setField("remark", container_remark)

        return public.returnMsg(True, "设置成功！")

    # 2024/2/27 上午 11:03 通过cgroup获取所有容器的cpu和内存使用情况
    def get_all_stats(self, get):
        """
        # 通过cgroup获取所有容器的cpu和内存使用情况
        @param get:
        @return:
        """
        if not hasattr(get, 'ws_callback'):
            return public.returnMsg(False, '参数错误, 请传入ws_callback！')
        if not hasattr(get, '_ws'):
            return public.returnMsg(False, '参数错误, 请传入_ws！')

        from system import system
        syst = system()
        data = dict()
        data["cpu_info"] = syst.GetCpuInfo()
        data["mem_info"] = syst.GetMemInfo()

        get._ws.send(public.getJson(
            {
                "data": data,
                "ws_callback": get.ws_callback,
                "msg": "开始获取所有容器的cpu和内存使用情况！",
                "status": True,
                "end": False,
            }))

        try:
            # 获取所有容器列表
            container_list = self.get_list(get)["container_list"]

            while True:
                docker_stats_result = public.ExecShell(
                    "docker stats --no-stream --format "
                    "'{{.ID}},{{.Name}},{{.CPUPerc}},{{.MemUsage}},{{.MemPerc}},{{.NetIO}},{{.BlockIO}},{{.PIDs}};'"
                )[0]

                data["cpu_info"] = syst.GetCpuInfo()
                data["mem_info"] = syst.GetMemInfo()

                if not docker_stats_result:
                    get._ws.send(public.getJson(
                        {
                            "data": {},
                            "ws_callback": get.ws_callback,
                            "msg": "暂时没有获取到正在运行中的容器资源信息！",
                            "status": True,
                            "end": True,
                        }))
                    return

                container_stats_data = list()

                for i in docker_stats_result.split(";"):
                    if not i: continue
                    tmp = i.strip().split(",")
                    if len(tmp) == 0: continue
                    if len(tmp) == 1 and not tmp[0]: continue

                    # 获取容器使用的image
                    id = image = create_time = ""

                    for cl in container_list:
                        if cl["name"] in dp.rename(tmp[1]):
                            id = cl["id"]
                            image = cl["image"]
                            create_time = cl["created_time"]
                            break

                    container_stats_data.append({
                        "id": id,
                        "name": dp.rename(tmp[1]),
                        "image": image,
                        "create_time": create_time,
                        "cpu_usage": tmp[2].strip("%"),
                        "mem_percent": tmp[4].strip("%"),
                        "mem_usage": {
                            "mem_usage": dp.byte_conversion(tmp[3].split("/")[0]),
                            "mem_limit": dp.byte_conversion(tmp[3].split("/")[1]),
                        },
                        "net_io": {
                            "net_in": dp.byte_conversion(tmp[5].split("/")[0]),
                            "net_out": dp.byte_conversion(tmp[5].split("/")[1]),
                        },
                        "block_io": {
                            "block_in": dp.byte_conversion(tmp[6].split("/")[0]),
                            "block_out": dp.byte_conversion(tmp[6].split("/")[1]),
                        },
                        "pids": tmp[7],
                    })

                data["container_stats_data"] = container_stats_data
                data["container_count"] = len(container_stats_data)
                end = False
                msg = "获取所有容器的cpu和内存使用情况成功！"
                if len(container_stats_data) == 0:
                    end = True
                    msg = "暂时没有获取到正在运行中的容器资源信息！"

                get._ws.send(public.getJson(
                    {
                        "data": data,
                        "ws_callback": get.ws_callback,
                        "msg": msg,
                        "status": True,
                        "end": end,
                    }))

                time.sleep(0.1)

        except:
            print(traceback.format_exc())
            get._ws.send(public.getJson(
                {
                    "data": {},
                    "ws_callback": get.ws_callback,
                    "msg": "获取所有容器的cpu和内存使用情况失败！",
                    "status": True,
                    "end": True,
                }))
            return