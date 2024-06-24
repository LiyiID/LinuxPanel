#coding: utf-8

# nginx配置文件修复


import os,sys,re
os.chdir("/www/server/panel")
sys.path.insert(0,"class/")
import public

def get_conf_files():
    conf_file = os.path.join(public.get_panel_path(),'vhost/nginx')
    if not os.path.exists(conf_file):
        return []
    dir_list = os.listdir(conf_file)
    conf_list = []
    for fname in dir_list:
        filename = os.path.join(conf_file,fname)
        if not os.path.isfile(filename): continue
        if len(fname) < 5: continue
        if fname[-5:] != '.conf': continue
        conf_list.append(filename)
    return conf_list


def get_nginx_version():
    '''
        @name 获取nginx版本
        @return tuple
    '''
    version = public.ReadFile('/www/server/nginx/version.pl')
    if not version: return (0,0,0)
    version = version.split('.')
    if len(version) < 3: return (0,0,0)
    return tuple([int(version[0]),int(version[1]),int(version[2])])


def start():
    # 检查nginx版本是否支持http3
    http3_version = (1,25,0)
    nginx_version = get_nginx_version()
    if nginx_version == (0,0,0):
        print('未安装nginx')
        return
    if nginx_version >= http3_version:
        print("无需修复nginx配置文件")
        return
    print("-"*90)
    res = "\n".join(public.ExecShell("nginx -t"))
    print(res.strip())
    print("-"*90)
    if res.find('[emerg]') == -1 and res.find('[warn]') == -1:
        print('nginx配置文件无错误，无需修复')
        return

    conf_files = get_conf_files()
    if not conf_files: return

    is_reload = False


    patt = re.compile(r'\s+listen\s+\d+\s+quic\s+\w+;',re.I)

    for filename in conf_files:
        is_write = False
        conf = public.readFile(filename)
        if not conf: continue
        if conf.find('http2 on;') != -1:
            conf = conf.replace('http2 on;','')
            is_write = True
        if conf.find('http3 on;') != -1:
            conf = conf.replace('http3 on;','')
            is_write = True
        if patt.search(conf):
            conf = patt.sub('',conf)
            is_write = True
        if filename.find('0.default.conf') != -1:
            if conf.find('listen 443 ssl http2;') == -1:
                conf = conf.replace('listen 443 ssl ;','listen 443 ssl http2;')
                conf = conf.replace('listen 443 ssl;','listen 443 ssl http2;')
                is_write = True
        
        if is_write:
            public.writeFile(filename,conf)
            is_reload = True
            print('修复配置文件: {}'.format(filename))
    
    if is_reload:
        print("-"*90)
        os.system("nginx -t")

        res = "\n".join(public.ExecShell("/etc/init.d/nginx reload"))
        print(res.strip())
        if res.find('nginx is not running') != -1:
            print("检测到nginx未启动，尝试启动nginx")
            res = "\n".join(public.ExecShell("/etc/init.d/nginx start"))
            print(res.strip())
    else:
        print('没有发现需要修复的配置文件')

    
if __name__ == '__main__':
    start()
        

