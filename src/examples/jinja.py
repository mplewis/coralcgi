#!/usr/bin/env python

import coralcgi_loader
coralcgi, relative_path = coralcgi_loader.import_coralcgi()
coralcgi.setup(debug=True, relative_path=relative_path)

import jinja2

template = jinja2.Template('''
<html>
  <head>
    <title>{{ title }}</title>
  </head>
  <body>
    <h1>{{ header }}</h1>
    <p>{{ text }}</p>
  </body>
</html>
''')

print template.render(title='Jinja2 Example',
                      header='Hello world!',
                      text='This was rendered using an HTML template.')
