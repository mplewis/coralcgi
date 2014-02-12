# Append to path so we can find/import CoralCGI
import sys
sys.path.append('src')

# Test framework modules
import sure  # noqa
from mock import patch, call

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

    @patch('coralcgi.cgidebug.enable')
    @patch('coralcgi.headers.ContentType.html')
    @patch('sys.path')
    def test_setup_defaults(self, mock_path, mock_html, mock_enable):
        TEST_REL_PATH = ''
        appended_path = os.path.join(TEST_REL_PATH, coralcgi.LIB_DIR)
        coralcgi.setup()
        mock_enable.assert_not_called()
        mock_html.assert_called()
        mock_path.append.assert_called_with(appended_path)


class TestCGIDebug:
    @patch('cgitb.enable')
    def test_cgidebug(self, mock_cgitb_enable):
        cgidebug.enable('test_arg', test_kwarg='test_val')
        mock_cgitb_enable.assert_called_with('test_arg', test_kwarg='test_val')


class TestHeaders:
    @patch('sys.stdout')
    def test_html(self, mock_stdout):
        coralcgi.headers.ContentType().html()
        expected = [call('Content-Type: text/html; charset=UTF-8\n'),
                    call('\n')]
        mock_stdout.write.assert_has_calls(expected)

    @patch('sys.stdout')
    def test_json(self, mock_stdout):
        coralcgi.headers.ContentType().json()
        expected = [call('Content-Type: application/json; charset=UTF-8\n'),
                    call('\n')]
        mock_stdout.write.assert_has_calls(expected)

    @patch('sys.stdout')
    def test_text(self, mock_stdout):
        coralcgi.headers.ContentType().text()
        expected = [call('Content-Type: text/plain; charset=UTF-8\n'),
                    call('\n')]
        mock_stdout.write.assert_has_calls(expected)


class TestRequest:
    def test_request_method(self):
        with patch.dict('os.environ', {'REQUEST_METHOD': 'GET'}):
            request.method().should.equal('GET')

    @patch.object(sys, 'stdin')
    def test_data(self, mock_stdin):
        QUERY_STRING = 'puppy=wolf&kitten=leopard&kitten=housecat'
        with patch.dict('os.environ', {'QUERY_STRING': QUERY_STRING}):
            mock_stdin.read.return_value = QUERY_STRING
            request.data().should.equal({'puppy': 'wolf', 'kitten': 'leopard'})

    @patch.object(sys, 'stdin')
    def test_data_multiple(self, mock_stdin):
        QUERY_STRING = 'puppy=wolf&kitten=leopard&kitten=housecat'
        with patch.dict('os.environ', {'QUERY_STRING': QUERY_STRING}):
            mock_stdin.read.return_value = QUERY_STRING
            expected = {'puppy': ['wolf'], 'kitten': ['leopard', 'housecat']}
            request.data_multiple().should.equal(expected)

    @patch.object(sys, 'stdin')
    def test_data_raw(self, mock_stdin):
        STDIN_DATA = 'quick brown foxes\nlazy dogs\n'
        mock_stdin.read.return_value = STDIN_DATA
        request.data_raw().should.equal(STDIN_DATA)

    def test_request_query_raw(self):
        QUERY_STRING = 'thing1=one&thing2=two'
        with patch.dict('os.environ', {'QUERY_STRING': QUERY_STRING}):
            request.query_raw().should.equal(QUERY_STRING)
