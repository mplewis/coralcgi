#!/usr/bin/env python

import coralcgi_loader
coralcgi, relative_path = coralcgi_loader.import_coralcgi()
coralcgi.setup(debug=True, relative_path=relative_path, html=False)

import json
from coralcgi import request
from coralcgi.headers import ContentType

ContentType.json()
print json.dumps({'request_method': request.method(),
                  'data': request.data()})
