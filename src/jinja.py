#!/usr/bin/env python

import coralcgi
import jinja2

coralcgi.setup(debug=True)

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
