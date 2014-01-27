class ContentType:

    @staticmethod
    def html(charset='UTF-8'):
        print 'Content-Type: text/html; charset=%s\n' % charset

    @staticmethod
    def json(charset='UTF-8'):
        print 'Content-Type: application/json; charset=%s\n' % charset

    @staticmethod
    def text(charset='UTF-8'):
        print 'Content-Type: text/plain; charset=%s\n' % charset
