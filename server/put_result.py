#!/usr/bin/python
# -*- coding: UTF-8 -*-

import os   #Python的标准库中的os模块包含普遍的操作系统功能  
import re   #引入正则表达式对象  
import urllib   #用于对URL进行编解码  
from BaseHTTPServer import HTTPServer, BaseHTTPRequestHandler  #导入HTTP处理相关的模块  
import MySQLdb
import json
from urlparse import urlparse, parse_qs

#自定义处理程序，用于处理HTTP请求  
class TestHTTPHandler(BaseHTTPRequestHandler):
    #处理GET请求  
    def do_GET(self):
        #获取URL
        print 'URL=',self.path
        try:
            up = urlparse(self.path)
            arg = parse_qs(up.query)
            print arg
            name = arg['name'][0]
            xtype = arg['xtype'][0]
            head = arg['head'][0]
            db = MySQLdb.connect(host="127.0.0.1", user="root", passwd="234", db="xtest",charset="utf8")
            db.query("insert into t_result(name,xtype,head,cnt) values('%s','%s','%s',1) on duplicate key update xtype=values(xtype),head=values(head),cnt=cnt+1"%(name,xtype,head))
            db.commit()
            db.close()
            
            self.protocal_version = 'HTTP/1.1'  #设置协议版本  
            self.send_response(200) #设置响应状态码  
            self.send_header("Content-type", "text/html;charset=utf-8")  #设置响应头  
            self.end_headers() 
            self.wfile.write("")
        except MySQLdb.Error as err:
            print err
            self.protocal_version = 'HTTP/1.1'  #设置协议版本  
            self.send_response(501) #设置响应状态码  
            self.send_header("Content-type", "text/html;charset=utf-8")  #设置响应头  
            self.end_headers()
            self.wfile.write(err)   #输出响应内容  
        except Exception as err:
            print err
            self.protocal_version = 'HTTP/1.1'  #设置协议版本  
            self.send_response(502) #设置响应状态码  
            self.send_header("Content-type", "text/html;charset=utf-8")  #设置响应头  
            self.end_headers()
            self.wfile.write(err)   #输出响应内容          
        #启动服务函数  
def start_server(port):
        http_server = HTTPServer(('', int(port)), TestHTTPHandler)
        http_server.serve_forever() #设置一直监听并接收请求  

#os.chdir('static')  #改变工作目录到 static 目录  
start_server(8002)  #启动服务，监听8000端口
