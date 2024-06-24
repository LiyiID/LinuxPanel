# -*- coding: utf-8 -*-
from time import time
import os,struct
try:
    import cPickle as pickle
except ImportError:  # pragma: no cover
    import pickle

from cachelib.base import BaseCache
import io
import builtins

safe_builtins = {
    'range',
    'complex',
    'set',
    'frozenset',
    'slice',
}

class RestrictedUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if module == "builtins" and name in safe_builtins:
            # print(name)
            return getattr(builtins, name)
        return None

def restricted_loads(s):
    # return RestrictedUnpickler(io.BytesIO(s)).load()
    return True



class SimpleCache(BaseCache):

    """Simple memory cache for single process environments.  This class exists
    mainly for the development server and is not 100% thread safe.  It tries
    to use as many atomic operations as possible and no locks for simplicity
    but it could happen under heavy load that keys are added multiple times.

    :param threshold: the maximum number of items the cache stores before
                      it starts deleting some.
    :param default_timeout: the default timeout that is used if no timeout is
                            specified on :meth:`~BaseCache.set`. A timeout of
                            0 indicates that the cache never expires.
    """

    def __init__(self, threshold=500, default_timeout=300):
        BaseCache.__init__(self, default_timeout)
        self._cache = {}
        self.clear = self._cache.clear
        self._threshold = threshold

    def _prune(self):
        if len(self._cache) > self._threshold:
            now = time()
            toremove = []
            for idx, (key, (expires, _)) in enumerate(self._cache.items()):
                if (expires != 0 and expires <= now) or idx % 3 == 0:
                    toremove.append(key)
            for key in toremove:
                self._cache.pop(key, None)


    def _normalize_timeout(self, timeout):
        timeout = BaseCache._normalize_timeout(self, timeout)
        if timeout > 0:
            timeout = time() + timeout
        return timeout


    def get(self, key):
        if not isinstance(key,str): return None
        try:
            expires, value = self._cache[key]
            if expires == 0 or expires > time():
                return pickle.loads(value)
        except (KeyError, pickle.PickleError):
            return None

    def set(self, key, value, timeout=None):

        # 类型判断
        if not isinstance(key,str): return False
        type_list=(int,float,bool,str,list,dict,tuple,set,bytes)
        value_type=type(value)
        if value_type not in type_list:
            return False

        # 过期清理
        expires = self._normalize_timeout(timeout)
        self._prune()
        try:
            restricted_loads(pickle.dumps(value))
        except:
            return False

        # 转换
        _val =  pickle.dumps(value, pickle.HIGHEST_PROTOCOL)
        self._cache[key] = (expires,_val)
        return True

    def add(self, key, value, timeout=None):

        # 类型判断
        if not isinstance(key,str): return False
        type_list=(int,float,bool,str,list,dict,tuple,set,bytes)
        value_type=type(value)
        if value_type not in type_list:
            return False

        expires = self._normalize_timeout(timeout)
        self._prune()
        try:
            restricted_loads(pickle.dumps(value))
        except:
            return False
        item = (expires, pickle.dumps(value,pickle.HIGHEST_PROTOCOL))
        if key in self._cache:
            return False
        self._cache.setdefault(key, item)
        return True

    def delete(self, key):
        result = self._cache.pop(key, None) is not None
        return result

    def has(self, key):
        try:
            expires, value = self._cache[key]
            return expires == 0 or expires > time()
        except KeyError:
            return False


    def get_expire_time(self, key):
        try:
            expires, value = self._cache[key]
            return expires
        except KeyError:
            return 0

