__author__ = 'hsk81'

###############################################################################
###############################################################################

from .leaf import Leaf
from .node import Node, NodePath
from .polymorphic import Polymorphic
from .property import Base64Property
from .property import StringProperty
from .property import TextProperty
from .property import Property
from .user import User

###############################################################################
###############################################################################

from ..ext import db
import __builtin__

###############################################################################
###############################################################################

Node.subprops = __builtin__.property (lambda self, alias=db.orm.aliased (Node):
    db.session.query (Property).join (alias.props).filter (alias.base==self))

###############################################################################
###############################################################################
