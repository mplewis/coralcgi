# Append to path so we can find/import CoralCGI
import sys
sys.path.append('src')

# Test framework modules
import sure  # noqa
from mock import patch

# Modules to test
import coralcgi
from coralcgi import cgidebug
from coralcgi import request

# Modules mocked for testing
import os


class TestCoralCGI:
    @patch('coralcgi.cgidebug.enable')
    @patch('coralcgi.headers.ContentType.html')
    @patch('sys.path')
    def test_setup(self, mock_path, mock_html, mock_enable):
        TEST_REL_PATH = 'rel/path/test'
        appended_path = os.path.join(TEST_REL_PATH, coralcgi.LIB_DIR)
        coralcgi.setup(debug=True, html=False, relative_path=TEST_REL_PATH)
        mock_enable.assert_called()
        mock_html.assert_not_called()
        mock_path.append.assert_called_with(appended_path)


class TestCGIDebug:
    @patch('cgitb.enable')
    def test_cgidebug(self, mock_cgitb_enable):
        cgidebug.enable('test_arg', test_kwarg='test_val')
        mock_cgitb_enable.assert_called_with('test_arg', test_kwarg='test_val')


class TestRequest:
    def test_request_method(self):
        with patch.dict('os.environ', {'REQUEST_METHOD': 'GET'}):
            request.method().should.equal('GET')

    def test_request_query_raw(self):
        query_string = 'thing1=one&thing2=two'
        with patch.dict('os.environ', {'QUERY_STRING': query_string}):
            request.query_raw().should.equal(query_string)
