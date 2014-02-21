#!/usr/bin/env python

import coralcgi_loader
coralcgi, relative_path = coralcgi_loader.import_coralcgi()
coralcgi.setup(debug=True, html=False, relative_path=relative_path)

import jinja2
from coralcgi import request
from coralcgi.headers import ContentType
from sys import exit

DATA_DIR = 'pages'
DATA_EXT = 'md'

env = jinja2.Environment(loader=jinja2.FileSystemLoader('templates'))

error_page = env.get_template('error.html')

data = request.data()

# All requests need a ?page=toedit query argument
try:
    page = data['page']
except KeyError:
    ContentType.html()
    print error_page.render(error='No page specified for editing.',
                            debug=request.data())
    exit()

page_path = '%s/%s.%s' % (DATA_DIR, page, DATA_EXT)

# Save the edited wiki page
try:
    edited_markdown = data['page-body']
except KeyError:
    ContentType.html()
    print error_page.render(error='No page data was received.',
                            debug=request.data())
    exit()
try:
    with open(page_path, 'w') as f:
        f.write(edited_markdown)
except IOError:
    ContentType.html()
    print error_page.render(error='Couldn\'t write to page: %s' %
                            page_path)
    exit()

coralcgi.redirect('wiki.py?page=%s' % page)
