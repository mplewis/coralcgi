#!/usr/bin/env python

import coralcgi_loader
coralcgi = coralcgi_loader.import_coralcgi()
coralcgi.setup(debug=True, relative_dir='..')

import jinja2
import glob
from coralcgi import request
from os.path import basename, splitext
from markdown import markdown

DATA_DIR = 'pages'
DATA_EXT = 'md'

page_list = jinja2.Template('''
<html>
  <head>
    <title>Wiki: Page List</title>
  </head>
  <body>
    <h1><a href="wiki.py">Wiki</a>: {{ pages|length }} pages</h1>
    <hr />
    <ul>
      {% for page in pages %}
        <li><a href="wiki.py?page={{ page }}">{{ page }}</a></li>
      {% endfor %}
    </ul>
  </body>
</html>
''')

view_page = jinja2.Template('''
<html>
  <head>
    <title>Wiki: {{ page }}</title>
  </head>
  <body>
    <h1>
      <a href="wiki.py">Wiki</a>:
      <a href="wiki.py?page={{ page }}">{{ page }}</a>
    </h1>
    <hr />
    <p>{{ data|safe }}</p>
  </body>
</html>
''')

error_page = jinja2.Template('''
<html>
  <head>
    <title>Wiki: Error</title>
  </head>
  <body>
    <h1><a href="wiki.py">Wiki</a>: Error</h1>
    <hr />
    <p>{{ error }}</p>
  </body>
</html>
''')

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
