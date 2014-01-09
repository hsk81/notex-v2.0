__author__ = 'hsk81'

###############################################################################
###############################################################################

import os

###############################################################################
###############################################################################

class SphinxConfig:

    ##
    ## The SPHINX_TEMP_PATH is the working directory for converters: It keeps
    ## the data - that is being processed - *temporarily*.
    ##

    SPHINX_TEMP_PATH = os.path.join (
        os.path.sep, 'var', 'www', 'webed', 'sphinx')
    SPHINX_TEMP_PATH = os.getenv (
        'SPHINX_TEMP_PATH', SPHINX_TEMP_PATH)

    ##
    ## The SPHINX_TEMPLATE_PATH is the path to the Sphinx template(s), which
    ## is copied at conversion to SPHINX_TEMP_PATH for further processing.
    ##

    SPHINX_TEMPLATE_PATH = os.path.join (
        'webed', 'static', 'webed-ext', 'dat', 'sphinx-tpl')
    SPHINX_TEMPLATE_PATH = os.getenv (
        'SPHINX_TEMPLATE_PATH', SPHINX_TEMPLATE_PATH)

    ##
    ## The ZeroMQ *frontend* addresses to which the ping & data queues bind to.
    ##

    PING_QUEUE_ADDRESS = os.getenv (
        'PING_QUEUE_ADDRESS', 'tcp://*:7070')
    DATA_QUEUE_ADDRESS = os.getenv (
        'DATA_QUEUE_ADDRESS', 'tcp://*:9090')

    ##
    ## The ZeroMQ *backend* addresses to which the ping & data queues bind to.
    ##

    PING_QUEUE_BACKEND_ADDRESS = os.getenv (
        'PING_QUEUE_BACKEND_ADDRESS', 'tcp://*:7171')
    DATA_QUEUE_BACKEND_ADDRESS = os.getenv (
        'DATA_QUEUE_BACKEND_ADDRESS', 'tcp://*:9191')

    ##
    ## The ZeroMQ *frontend* PING_ADDRESS of the signalling queue: it's used to
    ## figure out if a worker is available or not.
    ##

    PING_ADDRESS = os.getenv (
        'PING_ADDRESS', 'tcp://localhost:7070')

    ##
    ## The ZeroMQ *backend* PING_BACKEND_ADDRESS of the signalling queue: it's
    ## used to attach a worker to the queue.
    ##

    PING_BACKEND_ADDRESS = os.getenv (
        'PING_BACKEND_ADDRESS', 'tcp://localhost:7171')

    ##
    ## The ZeroMQ *frontend* DATA_ADDRESS of the data queue: it's used to
    ## transport data to a worker to be processed.
    ##

    DATA_ADDRESS = os.getenv (
        'DATA_ADDRESS', 'tcp://localhost:9090')

    ##
    ## The ZeroMQ *backend* DATA_BACKEND_ADDRESS of the data queue: it's
    ## used to attach a worker to the queue.
    ##

    DATA_BACKEND_ADDRESS = os.getenv (
        'DATA_BACKEND_ADDRESS', 'tcp://localhost:9191')

    ##
    ## The PING_TIMEOUT ensures that a ping to the workers *fails* after the
    ## defined amount of milli-seconds: no worker is then considered available.
    ##

    PING_TIMEOUT = float (os.getenv (
        'PING_TIMEOUT', 12.000 * 1000)) ## [ms]

    ##
    ## The POLL_TIMEOUT ensures that a *waiting* worker stops waiting for an
    ## incoming message (ping or data) and moves on.
    ##

    POLL_TIMEOUT = float (os.getenv (
        'POLL_TIMEOUT', 00.250 * 1000)) ## [ms]

###############################################################################
###############################################################################
