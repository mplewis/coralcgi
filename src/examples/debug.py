#!/usr/bin/env python

import coralcgi_loader
coralcgi = coralcgi_loader.import_coralcgi()

import sys
import os
import json
from coralcgi import headers

coralcgi.setup(debug=True, html=False)

headers.ContentType.json()
data = {'sys.path': sys.path, 'os.environ': dict(os.environ)}
print json.dumps(data)
