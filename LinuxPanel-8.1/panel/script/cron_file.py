# -*- coding: UTF-8 -*-

import sys, os
import time
os.chdir('/www/server/panel')
sys.path.insert(0, "class/")
sys.path.insert(0, '/www/server/panel')
import public
import PluginLoader

class main:
    def __check_auth(self):
        try:
            from pluginAuth import Plugin
            plugin_obj = Plugin(False)
            plugin_list = plugin_obj.get_plugin_list()
            if int(plugin_list['ltd']) > time.time():
                return True
            return False
        except:return False


    def run(self):
        pay = self.__check_auth()
        args = public.dict_obj()
        args.model_index = 'project'
        PluginLoader.module_run('safe_detect', 'file_detect', args)

if __name__ == '__main__':
    channels = sys.argv[1]
    main = main()
    main.run()
