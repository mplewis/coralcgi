import cgi
import os
import sys


def method():
    return os.environ['REQUEST_METHOD']


def data():
    data = {}
    form = cgi.FieldStorage()
    for key in form.keys():
        val = form.getfirst(key)
        data[key] = val
    return data


def data_multiple():
    data = {}
    form = cgi.FieldStorage()
    for key in form.keys():
        val = form.getlist(key)
        data[key] = val
    return data


def data_raw():
    return sys.stdin.read()


def query_raw():
    return os.environ['QUERY_STRING']
