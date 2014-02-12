#!/usr/bin/env python

import coralcgi_loader
coralcgi, relative_path = coralcgi_loader.import_coralcgi()
coralcgi.setup(debug=True, relative_path=relative_path)

import jinja2
import glob
from coralcgi import request
from os.path import basename, splitext
from markdown import markdown

DATA_DIR = 'pages'
DATA_EXT = 'md'

env = jinja2.Environment(loader=jinja2.FileSystemLoader('templates'))

page_list = env.get_template('list.html')
view_page = env.get_template('view.html')
error_page = env.get_template('error.html')

if not 'page' in request.data():
    page_paths = glob.glob('%s/*.%s' % (DATA_DIR, DATA_EXT))
    page_names = [splitext(basename(page_path))[0] for page_path in page_paths]
    print page_list.render(pages=page_names)
else:
    page = request.data()['page']
    try:
        with open('%s/%s.%s' % (DATA_DIR, page, DATA_EXT)) as f:
            data = markdown(f.read())
        print view_page.render(page=page, data=data)
    except IOError:
        print error_page.render(error='Page not found: %s' % page)
