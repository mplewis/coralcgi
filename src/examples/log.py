#!/usr/bin/env python

import coralcgi_loader
coralcgi = coralcgi_loader.import_coralcgi()

from coralcgi import request
from coralcgi.headers import ContentType
from datetime import datetime
from os.path import isfile

FILENAME = 'log.txt'

coralcgi.setup(debug=True, html=False)
ContentType.text()

if not isfile(FILENAME):
    open(FILENAME, 'w').close()

if request.method() != 'POST':
    with open(FILENAME, 'r') as f:
        data = f.read()
    print 'Current log contents:'
    print '-----'
    print data
    print '-----'
else:
    time = datetime.now()
    data = request.data_raw()
    with open(FILENAME, 'a') as f:
        f.write(time.isoformat())
        f.write('\n')
        f.write(data)
        f.write('\n\n')
    print 'Data logged to %s:' % FILENAME
    print '-----'
    print data
    print '-----'
