#!/usr/bin/env python
import flask
from flask import Flask, render_template, request, flash, redirect, make_response;import os
import subprocess
import socket
import json

app = Flask(__name__)
app.secret_key = "super secret key"




@app.route('/meeting/logs/<meeting_id>', methods=['POST','OPTIONS'])
def upload_file(meeting_id):
    if request.method == 'POST':
        app.logger.error('%s', meeting_id+"\t"+str(request.json))
        resp = flask.Response(json.dumps({"resp":meeting_id}))
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Headers'] = '*'
        return resp
    if request.method == 'OPTIONS':
        resp = flask.Response()
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Headers']='*'
        return resp;




if __name__ == "__main__":
    hostname = socket.gethostname()
    app.run(host="127.0.0.1", debug=True);