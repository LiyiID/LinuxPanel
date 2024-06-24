import re
import sys
import os
import time
import json
import datetime
import shutil

from requests import get

panelPath = '/www/server/panel/'
os.chdir(panelPath)

sys.path.insert(0, panelPath + "class/")
import public
import db

# 数据库配置文件
DATABASES_PATH = os.path.join(public.get_panel_path(), "config/databases.json")


# 获取数据库对象
def get_db_obj(sfile):
    db_obj = db.Sql()
    db_obj.dbfile(sfile)
    return db_obj


default_db_obj = get_db_obj(os.path.join(panelPath, "data/default.db"))
docker_db_obj = get_db_obj(os.path.join(panelPath, "data/docker.db"))
# default_db_obj = get_db_obj("/www/default.db")

dst_dir = '{}/data/db/'.format(panelPath)

dst_dir_f = dst_dir[:-1]  # 去掉最后的斜杠,否则无法判断文件是否存在
if not os.path.exists(dst_dir_f):
    os.makedirs(dst_dir_f, 384)
else:
    # 处理存在./data/db文件的情况
    if os.path.isfile(dst_dir_f):
        os.remove(dst_dir_f)
        os.makedirs(dst_dir_f, 384)


def print_x(msg):
    if public.is_debug():
        print(msg)


# 获取表结构
def get_table_byjson(table, dst_db_name):
    nkey = '{}_{}'.format(table, dst_db_name)

    alltables = get_database_json(False)
    if not nkey in alltables:
        return None

    db_info = alltables[nkey]
    if not 'fields' in db_info or not 'sql' in db_info:
        return None

    field_keys = []
    field_info = {}
    for field in db_info['fields']:
        field_info[field[1]] = field

        field_keys.append('`{}`'.format(field[1]))

    data = {}

    data['field'] = field_info
    data['sql'] = alltables[nkey]['sql']
    data['field_keys'] = field_keys
    data['wheres'] = []

    return data


# 获取表结构
def get_table_info(db_obj, table):
    field_info = {}
    wheres = []
    field_keys = []
    tb_list = db_obj.query("PRAGMA table_info({});".format(table))
    if not isinstance(tb_list, list):
        print_x('{} 表结构读取失败，可能原因表已损坏'.format(table))
        return None

    for tb in tb_list:
        field_info[tb[1]] = tb
        field_keys.append('`{}`'.format(tb[1]))
        wheres.append('`{}`=?'.format(tb[1]))

    res = db_obj.query("SELECT * FROM sqlite_master WHERE type='table' AND name='{}';".format(table))
    if not isinstance(res, list):
        return None

    if len(res) == 0:
        return None
    data = {}
    data['field'] = field_info
    data['sql'] = res[0][4]
    data['field_keys'] = field_keys
    data['wheres'] = wheres

    return data


# 检查表是否存在
def check_exists_table(db_obj, table):
    res = db_obj.query("SELECT * FROM sqlite_master WHERE type='table' AND name='{}';".format(table))
    if not isinstance(res, list):
        print_x('{} 读取失败，可能原因表已损坏'.format(table))
        return False
    if len(res) > 0:
        return True
    return False


# 同步单个表
def sync_db_table(table, dst_db_name, src_db_obj):
    try:

        if src_db_obj == None:
            src_field = get_table_byjson(table, dst_db_name)
        else:
            src_field = get_table_info(src_db_obj, table)

        if not src_field:
            return False

        # 检查表存在

        db_file = '{}/{}'.format(dst_dir, dst_db_name)
        dst_obj = get_db_obj(db_file)
        if not check_exists_table(dst_obj, table):

            print_x('{}数据库 {} 表不存在，准备创建数据库'.format(dst_db_name, table))
            res = dst_obj.execute(src_field['sql'])

            try:
                # 数据库文件损坏
                if str(res).find('file is not a database') != -1:
                    print_x('数据库文件损坏，尝试重新创建！')

                    if os.path.exists(db_file):
                        print_x('备份已损坏的数据库文件：{}'.format(db_file))
                        os.rename(db_file, '{}.{}.bak'.format(db_file, time.strftime('%Y%m%d%H%M%S')))

                    return sync_db_all(table,dst_db_name,src_db_obj)
            except:pass

            if str(res).find("error") != -1:
                print_x("创建表 {} 错误：{}".format(table, res))
                return False



        # 修复字段
        dst_field = get_table_info(dst_obj, table)

        is_alert = False
        for field in src_field['field']:
            if not field in dst_field['field']:
                continue

            dst_fs = dst_field['field'][field]
            src_fs = src_field['field'][field]

            d4 = dst_fs[4]
            s4 = src_fs[4]

            if d4 == '0': d4 = 0
            if s4 == '0': s4 = 0

            try:
                if not d4: d4 = ''
                d4 = d4.strip("'").strip('"')
                if not d4: d4 = ''
            except:pass

            try:
                if not s4: s4 = ''
                s4 = s4.strip("'").strip('"')
            except: pass

            if d4 == s4: continue

            is_alert = True
            break

        #修改字段类型
        if is_alert:
            print_x('dst : {}  src :{}'.format(dst_fs, src_fs))
            print_x('{}数据库 {} 表 {} 字段默认值不一致，准备修改字段值'.format(dst_db_name, table, field))
            new_table = 'wz_{}_{}'.format(table,public.md5(str(time.time())))
            # sql_list = [
            #     "ALTER TABLE {table} RENAME TO {new_table};".format(table=table, new_table=new_table),
            #     "{};".format(src_field['sql']),
            #     "INSERT INTO {table}({field_keys}) select {field_keys} FROM {new_table};".format(table=table, new_table=new_table, field_keys=','.join(src_field['field_keys']).strip(','))
            # ]
            # for sql_a in sql_list:
            #     res = dst_obj.execute(sql_a)

            sql_list = [
                "ALTER TABLE {table} RENAME TO {new_table};".format(table=table, new_table=new_table),
                "{};".format(src_field['sql'])
            ]
            # 获取目标表字段信息
            dst_field_info = get_table_info(dst_obj, table)

            # 确保 dst_field_info 不是 None
            if dst_field_info is None:
                print_x("目标数据库中表 {} 的信息无法获取，可能表不存在。".format(table))
                # 在这里处理表不存在的情况，例如创建表或返回错误信息
                return False
            # 假设 src_field_keys 和 dst_field_keys 分别存储了源表和目标表的字段名
            src_field_keys = src_field['field_keys']
            dst_field_keys = dst_field_info['field_keys']

            # 找到两个列表的交集，即两个表都有的字段
            common_fields = list(set(src_field_keys) & set(dst_field_keys))
            # 如果有共同的字段，则进行数据迁移
            if common_fields:
                insert_sql = "INSERT INTO {table}({fields}) SELECT {fields} FROM {new_table};".format(
                    table=table,
                    new_table=new_table,
                    fields=','.join(common_fields)  # 使用交集中的字段
                )
                # print(insert_sql)
                sql_list.append(insert_sql)
            else:
                print_x("没有共同的字段可以迁移。")

            for sql_a in sql_list:
                res = dst_obj.execute(sql_a)

            if str(res).find("error") != -1:
                #还原同步失败
                print_x("修改字段类型 {} 错误：{}".format(field, res))
                dst_obj.execute("ALTER TABLE {table} RENAME TO {new_table};".format(table=new_table, new_table=table))
                return False

        #检查缺少字段
        dst_field = get_table_info(dst_obj, table)
        for field in src_field['field']:
            if not field in dst_field['field']:
                print_x('{}数据库 {} 表 {} 字段不存在，准备创建字段'.format(dst_db_name, table, field))

                res = dst_obj.execute('ALTER TABLE {} ADD COLUMN {} {} DEFAULT {} ;'.format(table, field, src_field['field'][field][2], src_field['field'][field][4]))
                if str(res).find("error") != -1:
                    print_x("创建字段 {} 错误：{}".format(field, res))
                    return False


        if src_db_obj == None:
            return True

        # 检查数据是否存在
        resp = src_db_obj.query("select count(*) from {};".format(table))
        if not isinstance(resp, list):
            print_x(resp)
            return False

        limit = 1000
        total = resp[0][0]
        sql_field = ','.join(src_field['field_keys']).strip(',')
        insert_sql = "INSERT INTO '{tb_name}' ({field_sql}) VALUES ({create_sql});".format(tb_name=table, field_sql=sql_field, create_sql=",".join(["?"] * len(src_field['field_keys'])))

        dst_resp = dst_obj.query("select count(*) from {};".format(table))
        if not isinstance(dst_resp, list):
            print_x(dst_resp)
            return False

        # 存在数据跳过迁移
        dst_total = dst_resp[0][0]
        if dst_total > 0:
            return False

        for idx in range(0, total, limit):
            data_list = src_db_obj.query("SELECT * FROM {tb_name} LIMIT {idx},{limit};".format(tb_name=table, idx=idx, limit=limit))
            resp = dst_obj.executemany(insert_sql, data_list)
            print_x("{} row:{}".format(table, resp))
    except:

        print(public.get_error_info())


"""
@name 获取数据库json
@param is_talbe 是否按表名索引，default.db按表名返回，其他数据库防止重复，按表名_数据库名返回
"""


def get_database_json(is_talbe=True):
    all_tabs = {}
    init_db_dict = json.loads(public.readFile(DATABASES_PATH))
    for db_keys in init_db_dict.keys():
        for table in init_db_dict[db_keys].keys():
            nkey = '{}_{}'.format(table, db_keys)
            if is_talbe: nkey = table

            if not nkey in all_tabs:
                all_tabs[nkey] = {}

            all_tabs[nkey]['db'] = db_keys
            all_tabs[nkey]['table'] = table
            all_tabs[nkey]['sql'] = init_db_dict[db_keys][table]['sql']
            all_tabs[nkey]['fields'] = init_db_dict[db_keys][table]['fields']

    return all_tabs


"""
@name 数据未迁移成功，修复数据库
"""
def repair_db():
    try:

        total = 0
        check_json = {
            'sites': 'site.db',
            'users': 'panel.db',
            'databases': 'database.db',
            'ftps': 'ftp.db',
            'config': 'panel.db',
            'crontab':'crontab.db'
        }
        for skey in check_json.keys():

            dst_obj = get_db_obj('{}/{}'.format(dst_dir, check_json[skey]))
            query_sql = 'SELECT count(*) FROM {} ;'.format(skey)
            query_res = dst_obj.query(query_sql)
            try:
                if query_res[0][0] > 0:
                    continue
                total += 1
            except:
                total += 10

        if total <= 2:
            return False

        flag_path = '{}/update'.format(dst_dir)
        if os.path.exists(flag_path):
            os.remove(flag_path)

        sync_db_all()
    except:
        pass


"""
@name 迁移面板数据库
"""


def sync_db_all():
    num = 0
    flag_path = '{}/update'.format(dst_dir)
    if os.path.exists(flag_path):
        try:
            num = int(public.readFile(flag_path))
        except:
            pass
        if num > 3:
            return False

    nlist = []
    all_tabs = get_database_json(True)

    n_json = {
        'default.db': default_db_obj,
        'docker.db': docker_db_obj
    }

    for key in n_json.keys():
        try:
            src_db_obj = n_json[key]
            resp = src_db_obj.query("SELECT name FROM sqlite_master WHERE type='table' AND name not in ('sqlite_sequence','sqlite_master');")
            if len(resp) == 0:
                raise Exception('读取失败,数据库{}损坏，跳过！'.format(key))

            for table in resp:
                try:
                    table = table[0]
                    db_info = {'db': key}
                    if table in all_tabs:
                        db_info = all_tabs[table]

                    print_x('正在同步表到 {} 数据库 - 1：{}'.format(table, db_info['db']))
                    sync_db_table(table, db_info['db'], src_db_obj)

                    nkey = '{}_{}'.format(table, db_info['db'])
                    nlist.append(nkey)
                except:
                    pass
        except:
            print_x(public.get_error_info())

    # 第二次检测，防止数据库损坏
    all_tabs = get_database_json(False)
    for nkey in all_tabs.keys():
        db_info = all_tabs[nkey]
        if not nkey in nlist:
            print_x('正在同步表到 {} 数据库：{}'.format(db_info['table'], db_info['db']))
        sync_db_table(db_info['table'], db_info['db'], None)

    public.writeFile(flag_path, str(num + 1))




def check_db():
    public.check_field('backup', 'pid', 'INTEGER DEFAULT 0')
    public.check_field('backup', 'type', 'INTEGER DEFAULT 0')


"""
@name 修复字段默认值，重试3次
"""


def repair_column():
    num = 0
    flag_path = '{}/repair_column'.format(dst_dir)
    if os.path.exists(flag_path):
        try:
            num = int(public.readFile(flag_path))
        except:
            pass
        if num > 3:
            return False

    data = get_database_json()
    for table in data:
        try:
            fields = data[table]['fields']
        except:
            continue

        for field in fields:
            if field[4] == None:
                continue

            sql_shell = "UPDATE {} SET {}={} WHERE {} is null;".format(table, field[1], field[4], field[1])
            public.M(table).execute(sql_shell)

    public.writeFile(flag_path, str(num + 1))


def get_sql_shell(dfile, table):
    db_obj = get_db_obj(dfile)
    try:
        fname = os.path.basename(dfile)
        data = {}
        data[fname] = {}
        resp = db_obj.query("SELECT name FROM sqlite_master WHERE type='table' AND name not in ('sqlite_sequence','sqlite_master');")
        if len(resp) == 0:
            raise Exception('读取失败,数据库损坏，跳过！')

        if table:
            info = get_table_info(db_obj, table)
            if not info:  return False
            fields = []
            for _,i in info['field'].items():
                if i[4] in ['""', None, 'NULL', '0']:
                    if i[2].lower() in ['integer', 'int', 'real', 'numeric', 'decimal', 'BOOLEAN']:
                        i[4] = 0
                    elif i[2].lower() in ['text', 'varchar', 'char']:
                        i[4] = "''"
                fields.append(i)
            data[fname][table] = {
                'sql': info['sql'],
                'fields': fields
            }
        else:
            for table in resp:
                table = table[0]
                info = get_table_info(db_obj, table)
                if not info: continue
                fields = []
                for _, i in info['field'].items():
                    if i[4] in ['""', None, 'NULL', '0' , 0]:
                        if i[2].lower() in ['integer', 'int', 'real', 'numeric', 'decimal', 'BOOLEAN']:
                            i[4] = 0
                        elif i[2].lower() in ['text', 'varchar', 'char']:
                            i[4] = "''"
                    fields.append(i)
                data[fname][table] = {
                    'sql': info['sql'],
                    'fields': fields
                }
        print(json.dumps(data))
        return True
    except:
        print_x('不是有效的数据库文件，跳过！')
        return False

#测试sql是否能执行
def test_sql():

    dst_dir = '/www/test/db/'
    if os.path.exists(dst_dir):  shutil.rmtree(dst_dir)

    os.makedirs(dst_dir, 755)

    all_tabs = get_database_json(False)
    for nkey in all_tabs.keys():
        db_info = all_tabs[nkey]

        print_x('正在同步表到 {} 数据库：{}'.format(db_info['table'], db_info['db']))
        src_field = get_table_byjson(db_info['table'], db_info['db'])
        dst_obj = get_db_obj('{}/{}'.format(dst_dir, db_info['db']))
        if not check_exists_table(dst_obj, db_info['table']):
            res = dst_obj.execute(src_field['sql'])
            if str(res).find("error") != -1:
                print_x("创建表 {} 错误：{}".format(db_info['table'], res))
                break

        dst_field = get_table_info(dst_obj, db_info['table'])

        n_list = []
        for field in src_field['field']:
            if not field in n_list:
                n_list.append(field)

        for field in dst_field['field']:
            if not field in n_list:
                n_list.append(field)

        for field in n_list:
            if not field in src_field['field']:
                print('databases.json文件 {} - {} fields 数组里缺少字段：{}'.format(db_info['db'],db_info['table'],field))

            if not field in dst_field['field']:
                print('databases.json文件 {} - {} sql语句里缺少字段：{}'.format(db_info['db'],db_info['table'],field))

"""
@name 检查数据库字段
"""
def repair_lack_field():
    all_tabs = get_database_json(False)
    for nkey in all_tabs.keys():
        db_info = all_tabs[nkey]

        dst_obj = get_db_obj('{}/{}'.format(dst_dir, db_info['db']))
        if not check_exists_table(dst_obj, db_info['table']):
            continue

        src_field = get_table_byjson(db_info['table'], db_info['db'])
        dst_field = get_table_info(dst_obj, db_info['table'])

        for field in src_field['field']:
            if field in dst_field['field']:
                continue
            res = dst_obj.execute('ALTER TABLE {} ADD COLUMN {} {} DEFAULT {} ;'.format(db_info['table'], field, src_field['field'][field][2], src_field['field'][field][4]))


def check_default_error(sfile):
    """
    @name 检查默认数据库是否损坏
    """
    try:
        default_db_obj = get_db_obj(sfile)
        res = default_db_obj.query("SELECT name FROM sqlite_master WHERE type='table' AND name not in ('sqlite_sequence','sqlite_master');")
        if type(res) == str:
            if res.find('error:') >= 0:
                return True
    except:pass
    return False



def repair_db_byfile(dst_file):
    """
    @name 修复数据库损坏的问题（从历史备份里恢复）

    """
    try:
        if not check_default_error(dst_file):
            return False
        print('{} 数据库已损坏'.format(dst_file))
        mtime = os.path.getmtime(dst_file)

        is_repair = False
        for i in range(0, 15):
            try:
                bak_date = public.format_date(times= mtime - i * 86400, format='%Y-%m-%d')

                zfile = '/www/backup/panel/{}.zip'.format(bak_date)
                if not os.path.exists(zfile):
                    continue

                public.ExecShell('unzip -o {} -d /www/backup/panel/'.format(zfile))

                nfile = dst_file.replace('/www/server/panel/data/', '')
                db_file = '/www/backup/panel/{}/data/{}'.format(bak_date,nfile)

                if not os.path.exists(db_file):
                    print('备份文件 {} 不存在'.format(db_file))
                    continue

                if check_default_error(db_file):
                    print('备份文件 {} 数据库已损坏'.format(db_file))
                    continue

                if os.path.exists(dst_file):
                    os.rename(dst_file, '{}.{}.bak'.format(dst_file,time.strftime('%Y%m%d%H%M%S')))

                print('正在恢复数据库文件 - {}'.format(bak_date))
                shutil.copyfile(db_file, dst_file)
                is_repair = True
                break
            except:
                print(public.get_error_info())

        if is_repair:
            flag_path = '{}/update'.format(dst_dir)
            if os.path.exists(flag_path): os.remove(flag_path)
            print('数据库损坏，已修复成功')
        else:
            print('数据库恢复失败，请联系宝塔客服恢复')
    except: pass


def repair_all_db():
    """
    @name 修复所有数据库
    """

    db_files = [os.path.join(panelPath, "data/default.db")]

    all_tabs = get_database_json(False)
    for nkey in all_tabs.keys():
        db_info = all_tabs[nkey]

        nfile = '{}/{}'.format(dst_dir, db_info['db']).replace('//','/')

        if nfile in db_files: continue

        db_files.append(nfile)

    for db_file in db_files:
        repair_db_byfile(db_file)




if __name__ == '__main__':

    if len(sys.argv) > 1:
        nkey = sys.argv[1]
        if nkey == 'repair':
            flag_path = '{}/update'.format(dst_dir)
            if os.path.exists(flag_path): os.remove(flag_path)

        elif nkey == 'get_sql':
             get_sql_shell(sys.argv[1], sys.argv[2])
             exit()
        elif nkey == 'test_sql':
            test_sql()
            exit()

    repair_all_db()
    try:
        sync_db_all()
        repair_db()
        repair_column()
    except:pass
    repair_lack_field()
