#!/usr/bin/env python

import coralcgi_loader
coralcgi, relative_path = coralcgi_loader.import_coralcgi()
coralcgi.setup(debug=True, html=False, relative_path=relative_path)

import os
import jinja2
from coralcgi import request
from coralcgi.headers import ContentType
from sys import exit

DATA_DIR = 'pages'
DATA_EXT = 'md'

env = jinja2.Environment(loader=jinja2.FileSystemLoader('templates'))

edit_page = env.get_template('delete.html')
error_page = env.get_template('error.html')

# All requests need a ?page=toedit query argument
try:
    page = request.data()['page']
except KeyError:
    ContentType.html()
    print error_page.render(error='No page specified for deletion.',
                            debug=request.data())
    exit()

page_path = '%s/%s.%s' % (DATA_DIR, page, DATA_EXT)

if request.method() == 'GET':
    ContentType.html()
    try:
        with open(page_path, 'r') as f:
            raw_markdown = f.read()
    except IOError:
        print error_page.render(error='Page not found: %s' % page)
        exit()
    print edit_page.render(page=page, raw_markdown=raw_markdown)
else:
    os.remove(page_path)
    coralcgi.redirect('wiki.py')