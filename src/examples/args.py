#!/usr/bin/env python

import coralcgi_loader
coralcgi = coralcgi_loader.import_coralcgi()

import json
from coralcgi import request
from coralcgi.headers import ContentType

coralcgi.setup(debug=True, html=False)

ContentType.json()
print json.dumps({'request_method': request.method(),
                  'data': request.data()})
