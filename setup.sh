#!/bin/bash

###############################################################################
###############################################################################

# Initial $ ./setup.sh init

###############################################################################
###############################################################################

ACTMETH=${1}
APPNAME=${2-"webed"}

###############################################################################
###############################################################################

function setup_env () {
    if [ $VIRTUAL_ENV ] ; then
        exit 0
    else
        git submodule update --init --recursive && build_env $1
        virtualenv2 . --prompt="[$1] "
    fi
}

function clean_env () {
    rm -rf bin/ include/ lib/
}

function clean_egg () {
    rm -rf build/ dist/ *.egg-info/
}

function clean_pyc () {
    rm -rf $(tree -fi | grep \\.pyc$)
}

function clean_log () {
    rm -rf $(tree -fi | grep \\.log$)
}

function build_env () {

    STATIC=$1/static
    TEMPLATES=$1/templates

    CLSPATH_EXT=$STATIC/webed-ext/app/app.js
    CLSPATH_EXT=$CLSPATH_EXT,$STATIC/webed-ext/app
    CLSPATH_EXT=$CLSPATH_EXT,$STATIC/ext/src

    if [ ! -d "$STATIC/ext" ] ; then
        sencha -sdk $STATIC/lib/extjs generate workspace $STATIC
    fi

    sencha compile -classpath=$CLSPATH_EXT \
                   -option debug:false \
              page -inp=$TEMPLATES/index-in.html \
                   -out=$TEMPLATES/index.html \
                   -cla=../static/all-classes.excl.new.js \
                   -strip -compress and \
           include -namespace Webed and \
            concat -out=$STATIC/all-classes.incl.new.js \
                   -strip -compress

    mv $STATIC/all-classes.excl.new.js $STATIC/all-classes.excl.js
    mv $STATIC/all-classes.incl.new.js $STATIC/all-classes.incl.js

    wget -O- http://www.google-analytics.com/ga.js > $STATIC/ga/ga-www.in.js
    wget -O- http://www.google-analytics.com/ga.js > $STATIC/ga/ga-ssl.in.js
}

###############################################################################
###############################################################################

case $ACTMETH in
    clean)
        clean_env && \
        clean_egg && \
        clean_pyc && \
        clean_log ;;
    clean-env)
        clean_env ;;
    clean-egg)
        clean_egg ;;
    clean-pyc)
        clean_pyc ;;
    clean-log)
        clean_log ;;
    init)
        setup_env $APPNAME ;;
    build)
        build_env $APPNAME ;;
    *)
        $0 init $1 $2 ;;
esac

###############################################################################
###############################################################################

exit 0
