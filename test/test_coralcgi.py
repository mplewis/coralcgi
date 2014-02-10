import sys
sys.path.append('src')

import coralcgi

import os
import sure  # noqa
from mock import MagicMock


def test_setup():
    TEST_REL_PATH = 'rel/path/test'
    appended_path = os.path.join(TEST_REL_PATH, coralcgi.LIB_DIR)

    coralcgi.cgidebug.enable = MagicMock()
    coralcgi.headers.ContentType.html = MagicMock()
    sys.path = MagicMock()

    coralcgi.setup(debug=True, html=False, relative_path=TEST_REL_PATH)

    coralcgi.cgidebug.enable.assert_called()
    coralcgi.headers.ContentType.html.assert_not_called()
    sys.path.append.assert_called_with(appended_path)
