# -*- coding: utf-8 -*-

import sys
from importlib import import_module
# 将模块的路径添加到系统路径中
sys.path.append('/www/server/panel/class')
import public

def restart_project_based_on_model(model_name, project_name):

    try:
        model = import_module("projectModel." + model_name + "Model")
        model_main = model.main()
        get=public.dict_obj()
        print(333)
        # 定义get为一个字典
        if model_name == "python":
            get.name=project_name
            model_main.RestartProject(get)
        else:
            get.project_name=project_name
            model_main.restart_project(get)
    except Exception as e:
        print("获取失败" + str(e))

if __name__ == "__main__":
    model_name = sys.argv[1]
    project_name = sys.argv[2]

    restart_project_based_on_model(model_name, project_name)
