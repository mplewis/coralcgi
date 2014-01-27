import cgidebug
from headers import ContentType

# Setup library paths
import sys
sys.path.append('coralcgi/libs')


def setup(debug=False, html=True):
    if debug:
        cgidebug.enable()
    if html:
        ContentType.html()
