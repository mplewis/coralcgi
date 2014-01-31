#!/usr/bin/env python

import coralcgi_loader
coralcgi, relative_path = coralcgi_loader.import_coralcgi()
coralcgi.setup(debug=True, relative_path=relative_path)

print '<h1>test</h1>'
print '<p>This is a test of basic CGI.</p>'
