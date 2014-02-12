import cgidebug
from headers import ContentType

import sys
import os

LIB_DIR = 'coralcgi/libs'


def setup(debug=False, html=True, relative_path=''):
    if debug:
        cgidebug.enable()
    if html:
        ContentType.html()
    # Setup library paths
    sys.path.append(os.path.join(relative_path, LIB_DIR))


def redirect(dest):
    print 'Status: 303 See Other'
    print 'Location: %s' % dest
    print
