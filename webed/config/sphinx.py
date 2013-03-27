__author__ = 'hsk81'

###############################################################################
###############################################################################

class SphinxConfig:

    ##
    ## ZeroMQ addresses for *pinging* (status) and *data* transfer: There are
    ## two queue since status and data messages have different characteristics.
    ##

    PING_ADDRESS = 'tcp://localhost:7070'
    PING_TIMEOUT = 15.000 * 1000 ##[ms]
    DATA_ADDRESS = 'tcp://localhost:9090'
    DATA_TIMEOUT = 00.250 * 1000 ##[ms]

###############################################################################
###############################################################################
