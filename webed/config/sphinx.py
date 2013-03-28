__author__ = 'hsk81'

###############################################################################
###############################################################################

class SphinxConfig:

    ##
    ## The ZeroMQ *frontend* addresses to which the ping & data queues bind to.
    ##

    PING_QUEUE_ADDRESS = 'tcp://*:7070'
    DATA_QUEUE_ADDRESS = 'tcp://*:9090'

    ##
    ## The ZeroMQ *backend* addresses to which the ping & data queues bind to.
    ##

    PING_QUEUE_BACKEND_ADDRESS = 'tcp://*:7171'
    DATA_QUEUE_BACKEND_ADDRESS = 'tcp://*:9191'

    ##
    ## The ZeroMQ *frontend* PING_ADDRESS of the signalling queue: it's used to
    ## figure out if a worker is available or not.
    ##

    PING_ADDRESS = 'tcp://localhost:7070'

    ##
    ## The ZeroMQ *backend* PING_BACKEND_ADDRESS of the signalling queue: it's
    ## used to attach a worker to the queue.
    ##

    PING_BACKEND_ADDRESS = 'tcp://localhost:7171'

    ##
    ## The ZeroMQ *frontend* DATA_ADDRESS of the data queue: it's used to
    ## transport data to a worker to be processed.
    ##

    DATA_ADDRESS = 'tcp://localhost:9090'

    ##
    ## The ZeroMQ *backend* DATA_BACKEND_ADDRESS of the data queue: it's
    ## used to attach a worker to the queue.
    ##

    DATA_BACKEND_ADDRESS = 'tcp://localhost:9191'

    ##
    ## The PING_TIMEOUT ensures that a ping to the workers *fails* after the
    ## defined amount of milli-seconds: no worker is then considered available.
    ##

    PING_TIMEOUT = 15.000 * 1000 ##[ms]

    ##
    ## The POLL_TIMEOUT ensures that a *waiting* worker stops waiting for an
    ## incoming message (ping or data) and moves on.
    ##

    POLL_TIMEOUT = 00.250 * 1000 ##[ms]

###############################################################################
###############################################################################
