import sys
import json
import os
# 检查 /www/server/panel/plugin/clear/ 目录是否存在
if not os.path.exists('/www/server/panel/plugin/clear/'):
    print("请先到软件商店安装日志清理工具")
    sys.exit()
sys.path.append('/www/server/panel/plugin')
from clear.clear_main import clear_main
import public

# import sys
# import json
# import os
# from clear.clear_main import clear_main
# import public

# 日志类型的英文到中文的映射
log_type_mapping = {
    'system_log': '系统日志',
    'panel_log': '面板日志',
    'www_log': '网站日志',
    'usranalyse_log': '用户分析日志',
    'mysql_log': 'MySQL日志',
    'Recycle': '回收站',
    'mail_log': '邮件日志',
    'php_session': 'PHP会话',
    'total_log': '总日志',
    'user_config': '用户配置'
}

def check_plugin_directory():
    # 检查 /www/server/panel/plugin/clear/ 目录是否存在
    if not os.path.exists('/www/server/panel/plugin/clear/'):
        print("请先到软件商店安装日志清理工具")
        sys.exit()

def get_log_data():
    get = public.dict_obj()
    # 创建 clear_main 类的实例
    clear_instance = clear_main()
    # 现在，我们可以使用这个实例来调用 RetuenLog 方法
    return clear_instance.RetuenLog(get), clear_instance

def clean_logs(clear_instance, selected_logs):
    get = public.dict_obj()
    get.data = json.dumps(selected_logs)  # 将字典转换为字符串
    print("开始清理日志")
    # 然后，我们可以使用这些日志数据来清理日志
    clear_instance.remove_file(get)
    # 调用 GetToStatus 方法并检查其返回值
    status = clear_instance.GetToStatus(get)
    if status == 100:
        print(f"清理成功")
    public.set_module_logs('crontab', 'log_cleanup', 1)

def main():
    check_plugin_directory()
    log_data, clear_instance = get_log_data()
    # 获取用户输入的日志类型
    log_type = sys.argv[1]
    if log_type=="all":
        selected_logs = log_data
    else:
        # 根据用户输入的日志类型选择要清理的日志
        selected_logs = {log_type: log_data[log_type]}
        total_size = 0
        # 计算相同类型的日志的总大小
        for log in selected_logs[log_type]:
            if log['size'] != '0':
                total_size += log['count_size']
        print(f"即将清理{log_type_mapping[log_type]},总大小：{total_size / 1024}K")
    clean_logs(clear_instance, selected_logs)

if __name__ == "__main__":
    main()
