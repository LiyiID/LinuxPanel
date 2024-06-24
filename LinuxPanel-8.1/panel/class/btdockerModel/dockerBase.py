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
import public
from btdockerModel import dk_public as dp


class dockerBase(object):

    def __init__(self):
        self._db_path = "/www/server/panel/data/db/docker.db"
        self._backup_log = '/tmp/backup.log'
        self._log_path = '/tmp/dockertmp.log'
        self._rCmd_log = '/tmp/dockerRun.log'
        self._url = "unix:///var/run/docker.sock"
        self.compose_path = "{}/data/compose".format(public.get_panel_path())
        self.aes_key = "btdockerModel_QWERAS"
        self.moinitor_lock = "/tmp/bt_docker_monitor.lock"

    def get_ws_log(self, get):
        """
        获取日志，websocket
        @param get:
        @return:
        """
        if not hasattr(get, "_ws"):
            return True

        import time
        sum = 0

        with open(get._log_path, "r") as file:
            position = file.tell()
            get._ws.send("{}\r\n".format(get.wsLogTitle))

            while True:
                current_position = file.tell()
                line = file.readline()
                if current_position > position:
                    file.seek(position)
                    new_content = file.read(current_position - position)
                    if "nohup" not in new_content:
                        for i in new_content.split('\n'):
                            if i == "": continue
                            get._ws.send(i.strip("\n") + "\r\n")

                    position = current_position

                    if "bt_successful" in line:
                        get._ws.send("bt_successful\r\n")
                        del get._ws
                        break
                    elif "bt_failed" in line:
                        get._ws.send("bt_failed\r\n")
                        del get._ws
                        break

                    if sum > 0:
                        sum = 0
                else:
                    sum += 1

                    if sum >= 6000:
                        get._ws.send("\r\n超过10分钟未响应！\r\n")
                        break

                time.sleep(0.1)

        return True
