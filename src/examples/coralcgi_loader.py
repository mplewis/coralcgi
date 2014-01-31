import sys
import os
UP_DIR = '../'


def is_root(path):
    return os.path.dirname(path) == path


def import_coralcgi():
    first = True
    curr_search_path = ''
    at_root = False
    while True:
        if at_root:
            print 'Status: 500'
            print 'Content-Type: text/plain;'
            print
            print ('coralcgi_loader: ERROR: CoralCGI not found in any parent '
                   'directories of %s' % os.getcwd())
            sys.exit(1)
        if is_root(os.path.abspath(curr_search_path)):
            at_root = True
        try:
            import coralcgi  # noqa
            break
        except ImportError:
            if not first:
                sys.path.pop()
            curr_search_path += UP_DIR
            sys.path.append(curr_search_path)
            first = False
    return (coralcgi, curr_search_path)
