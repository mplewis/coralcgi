#!/usr/bin/env python

import coralcgi_loader
coralcgi = coralcgi_loader.import_coralcgi()

coralcgi.setup(debug=True)

print '<h1>test</h1>'
print '<p>This is a test of basic CGI.</p>'
