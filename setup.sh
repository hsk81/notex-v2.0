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
        virtualenv . --prompt="[$1] "
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
    CLASSPATH=$STATIC/app.js
    CLASSPATH=$CLASSPATH,$STATIC/app/,$STATIC/lib/extjs/src
    CLASSPATH=$CLASSPATH,$STATIC/lib/extjs/examples/ux/statusbar

    TEMPLATES=$1/templates
    PAGE_INP=$TEMPLATES/index-in.html
    PAGE_OUT=$TEMPLATES/index.html
    PAGE_CLA=../static/all-classes.js

    sencha compile -classpath=$CLASSPATH \
                   -option debug:false \
           exclude -namespace Ext.chart and \
           exclude -namespace Ext.dd and \
           exclude -namespace Ext.direct and \
           exclude -namespace Ext.draw and \
           exclude -namespace Ext.flash and \
           page -inp=$PAGE_INP \
                -out=$PAGE_OUT \
                -cla=$PAGE_CLA \
                -strip-comments \
                -compress
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
