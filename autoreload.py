#!/usr/bin/env python

###############################################################################
###############################################################################

__author__ = 'http://github.com/stevekrenzel'
__author__ = 'hsk81'

###############################################################################
###############################################################################

import os
import sys
import time
import subprocess

###############################################################################
###############################################################################

def file_filter (name):
    return not name.startswith ('.') and \
           not name.endswith ('.css') and \
           not name.endswith ('.html') and \
           not name.endswith ('.js') and \
           not name.endswith ('.log') and \
           not name.endswith ('.pyc') and \
           not name.endswith ('.txt')

def file_times (path):
    for top_level in filter (file_filter, os.listdir (path)):
        for root, dirs, files in os.walk (top_level):
            for filename in filter (file_filter, files):

                path_to = os.path.join (root, filename)
                mo_time = os.stat (path_to).st_mtime

                yield (mo_time, path_to)

def print_stdout (process):
    stdout = process.stdout
    if stdout is not None: print stdout

###############################################################################
###############################################################################

## Concat all args together, and treat that as the command
command = ' '.join (sys.argv[1:])
# The path to watch
path = '.'
# How often we check the filesystem for changes (in seconds)
wait = 1.000
# The process to autoreload
process = subprocess.Popen (command, shell=True)
# The current maximum file modified time under the watched directory
mo_time_last, _ = max (file_times (path))

###############################################################################
###############################################################################

if __name__ == '__main__':

    while True:

        try:
            mo_time, path_to = max (file_times (path))
            print_stdout (process)

            if mo_time > mo_time_last:
                mo_time_last = mo_time

                print '* Restarting with reloader due: %s' % path_to

                process.kill ()
                process = subprocess.Popen (command, shell=True)
                time.sleep (wait)

        except KeyboardInterrupt:
            break

###############################################################################
###############################################################################
