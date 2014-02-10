# Append to path so we can find/import CoralCGI
import sys
sys.path.append('src')

# Test framework modules
import sure  # noqa
from mock import patch

# Modules to test
import coralcgi
from coralcgi import cgidebug

# Modules mocked for testing
import os


@patch('coralcgi.cgidebug.enable')
@patch('coralcgi.headers.ContentType.html')
@patch('sys.path')
def test_setup(mock_path, mock_html, mock_enable):
    TEST_REL_PATH = 'rel/path/test'
    appended_path = os.path.join(TEST_REL_PATH, coralcgi.LIB_DIR)

    coralcgi.setup(debug=True, html=False, relative_path=TEST_REL_PATH)

    mock_enable.assert_called()
    mock_html.assert_not_called()
    mock_path.append.assert_called_with(appended_path)


@patch('cgitb.enable')
def test_cgidebug(mock_cgitb_enable):
    cgidebug.enable('test_arg', test_kwarg='test_val')
    mock_cgitb_enable.assert_called_with('test_arg', test_kwarg='test_val')
