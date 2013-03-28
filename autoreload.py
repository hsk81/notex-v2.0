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
    return (not name.startswith ('.')) and (not name.endswith ('.swp'))

def file_times (path):
    for top_level in filter (file_filter, os.listdir (path)):
        for root, dirs, files in os.walk (top_level):
            for filename in filter (file_filter, files):
                yield os.stat (os.path.join (root, filename)).st_mtime

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
last_mtime = max (file_times (path))

###############################################################################
###############################################################################

if __name__ == '__main__':

    while True:

        try:
            max_mtime = max (file_times (path))
            print_stdout (process)
            if max_mtime > last_mtime:

                last_mtime = max_mtime
                print '* Restarting with reloader'
                process.kill ()
                process = subprocess.Popen (command, shell=True)

                time.sleep (wait)

        except KeyboardInterrupt:
            break

###############################################################################
###############################################################################
