__author__ = 'hsk81'

###############################################################################
###############################################################################

class Q:

    def __init__ (self, query):

        self.query = query

    def all (self, **kwargs):

        return self.query.filter_by (**kwargs).all ()

    def all_or_default (self, default=None, **kwargs):

        query = self.query.filter_by (**kwargs)
        return query.all () if query.count () >= 1 else default

    def one (self, **kwargs):

        return self.query.filter_by (**kwargs).one ()

    def one_or_default (self, default=None, **kwargs):

        query = self.query.filter_by (**kwargs)
        return query.one () if query.count () == 1 else default

    def page (self, offset, limit, **kwargs):

        query = self.query.filter_by (**kwargs)
        total = query.count ()
        query = query.offset (offset=offset)
        query = query.limit (limit=limit)

        return  query.all (), total

    def page_or_default (self, offset, limit, default=None, **kwargs):

        query = self.query.filter_by (**kwargs)
        total = query.count ()

        if total >= 1:
            query = query.offset (offset=offset)
            query = query.limit (limit=limit)
            return query.all (), total
        else:
            return default, total

###############################################################################
###############################################################################

class Linq:

    def __init__ (self, iterable):

        self.iterable = iterable

    def first (self):

        assert len (self.iterable) > 0
        return self.iterable[0]

    def first_or_default (self, default=None):

        if len (self.iterable) > 0:
            return self.iterable[0]
        else:
            return default

    def last (self):

        assert len (self.iterable) > 0
        return self.iterable[-1]

    def last_or_default (self, default=None):

        if len (self.iterable) > 0:
            return self.iterable[-1]
        else:
            return default

    def filter (self, fn):

        return Linq (filter (fn, self.iterable))

###############################################################################
###############################################################################
