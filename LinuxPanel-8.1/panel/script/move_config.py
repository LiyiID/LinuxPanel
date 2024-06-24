# -*- coding: utf-8 -*-
import os
import shutil
import sys
sys.path.insert(0, '/www/server/panel/class')
from panelSite import panelSite
from data import data
import public

def get_website_status(website):
    get = public.dict_obj()
    get.table = "sites"
    data_obj = data()
    site_data = data_obj.getData(get)

    for site in site_data['data']:
        if site['name'] == website:
            return site['status']

    return None

def stop_website(website):
    id = public.M('sites').where("name=?", (website ,)).getField('id')
    get = public.dict_obj()
    get.id = id
    get.name = website
    panelSite().SiteStop(get)

def start_website(website):
    id = public.M('sites').where("name=?", (website ,)).getField('id')
    get = public.dict_obj()
    get.id = id
    get.name = website
    panelSite().SiteStart(get)

def move_config(website):
    # 定义源和目标文件夹
    source_dir = "/www/server/panel/vhost"
    target_dir = "/www/php_site/vhost"

    # 定义 apache 和 nginx 文件夹
    folders = ["apache", "nginx"]

    # 获取网站状态
    status = get_website_status(website)
    if status is None:
        print(f"网站 {website} 不存在.")
        return

    for folder in folders:
        # 根据网站状态设置源文件路径
        if status == '1':
            source_file = os.path.join(source_dir, folder, website + ".conf")
        else:
            source_file = os.path.join(target_dir, folder, website + ".conf")

        # 检查源文件是否存在
        if not os.path.isfile(source_file):
            # print(f"{source_file} 不存在.")
            continue

        # 检查目标文件夹是否存在，如果不存在则创建
        target_folder = os.path.join(target_dir, folder)
        os.makedirs(target_folder, exist_ok=True)

        # 根据网站状态移动文件
        if status == '1':
            stop_website(website)
            # 如果网站是启动状态，将原来位置的配置文件移动到指定文件夹
            target_file = os.path.join(target_folder, website + ".conf")
            shutil.move(source_file, target_file)
            # print("Start to stop stie !")
        else:

            # print(90909009)

            # 如果网站是停止状态，将目标文件夹中的文件移动回原来的位置
            target_file = os.path.join(source_dir, folder, website + ".conf")
            shutil.move(source_file, target_file)
            start_website(website)
            # print("Start to start stie !")



        # print(f"{source_file} 已移动到 {target_file}")

# 获取命令行参数作为网站名称
if len(sys.argv) != 2:
    print("用法: python move_config.py <网站名称>")
    sys.exit(1)

website = sys.argv[1]
move_config(website)
public.ServiceReload()
