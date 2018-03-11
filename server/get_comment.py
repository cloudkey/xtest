#!/usr/bin/python
# -*- coding: UTF-8 -*-

import os   #Python的标准库中的os模块包含普遍的操作系统功能  
import re   #引入正则表达式对象  
import urllib   #用于对URL进行编解码  
from BaseHTTPServer import HTTPServer, BaseHTTPRequestHandler  #导入HTTP处理相关的模块  
import MySQLdb
import json
from urlparse import urlparse, parse_qs
import time

#自定义处理程序，用于处理HTTP请求  
class TestHTTPHandler(BaseHTTPRequestHandler):
    #处理GET请求  
    def do_GET(self):
        #获取URL
        print 'URL=',self.path
        try:
            up = urlparse(self.path)
            args = parse_qs(up.query)
            cur_id = int(args['id'][0])
            down = int(args['down'][0])
            db = MySQLdb.connect(host="127.0.0.1", user="root", passwd="234", db="xtest",charset="utf8")
            cursor = db.cursor()
            if(down == 1):
                cursor.execute("select name,head,content,comment_time,id from t_comments where id<'%d' order by id limit 10"%(cur_id))
            else:
                cursor.execute("select name,head,content,comment_time,id from t_comments where id > '%d' order by id desc limit 10"%(cur_id))
            results = cursor.fetchall()  
            arr = []
            for item in results:
                tmp = {}
                tmp["id"] = str(item[4])
                tmp["lz_icon"] = item[1]
                tmp["lz_name"] = item[0]
                tmp["zan_cnt"] = "0"
                tmp["content"] = item[2]
                tmp["date"] =   item[3].strftime("%Y-%m-%d %H:%M:%S")
                tmp["reply"] = []
                
                arr.append(tmp)
            templateStr = json.dumps(arr, ensure_ascii=False, encoding='UTF-8')
            db.close()
            
            self.protocal_version = 'HTTP/1.1'  #设置协议版本  
            self.send_response(200) #设置响应状态码  
            self.send_header("Content-type", "text/html;charset=utf-8")  #设置响应头  
            self.end_headers()
            self.wfile.write(templateStr.encode("utf-8"))   #输出响应内容  
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
start_server(8005)  #启动服务，监听8000端口
