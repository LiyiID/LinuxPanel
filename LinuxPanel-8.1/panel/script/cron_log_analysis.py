import json
import sys, os
import time
import traceback

os.chdir('/www/server/panel')
sys.path.insert(0, "class/")
import crontab
import public


def run(path):
    msg = ''
    from log_analysis import log_analysis
    log_analysis = log_analysis()
    get = public.dict_obj()
    get.action = 'log_analysis'
    get.path = path
    log_analysis.log_analysis(get)
    get.action = 'speed_log'
    start_time = time.time()
    while True:
        time.sleep(1)
        data = log_analysis.speed_log(get)
        if int(data['msg']) == 100 or data['status'] == False:
            break
        if time.time() - start_time > 100:
            break

    get.action = 'get_result'
    res = log_analysis.get_result(get)
    data = res['data'][0]
    if data['is_status']:
        all = data['php'] + data['san'] + data['sql'] + data['xss']
        if all > 0:
            msg = '【异常】，发现{}条异常日志'.format(all)
        else:
            msg = '【安全】，未发现异常日志'
    return msg

def send_notification(title, msg, channels):
    data = public.get_push_info(title, msg)
    for channel in channels.split(','):
        try:
            obj = public.init_msg(channel)
            obj.send_msg(data['msg'])
            print('{}通道发送成功'.format(channel))
        except:
            print('{}通道发送失败'.format(channel))


if __name__ == '__main__':
    resource = []
    cron_task_path = '/www/server/panel/data/cron_task_analysis.json'
    if not os.path.exists(cron_task_path) or len(json.loads(public.ReadFile(cron_task_path))) <= 1:
        cron_name = '[勿删]web日志定期检测服务'
        p = crontab.crontab()
        id = public.M('crontab').where("name=?", (cron_name,)).getField('id')
        args = {"id": id}
        p.DelCrontab(args)
        exit()
    data = json.loads(public.ReadFile(cron_task_path))
    channel = data['channel']
    for path, config in data.items():
        if path == 'channel':
            continue
        name = path.split('/')[-1].split('.')
        name = '.'.join(name[:-1])
        try:
            msg = run(path)
            resource.append('网站【{}】：{}'.format(name, msg))
        except:
            resource.append('网站【{}】：{}'.format(name, '检测失败'))
    if resource:
        send_notification('网站日志检测', resource, channel)
    print('网站日志检测：\n{}'.format('  \n'.join(resource)))
