#!/bin/bash

###############################################################################
###############################################################################

# Require $ sudo pacman -S nodejs
# Require $ sudo npm install -g grunt

# Initial $ ./setup.sh init webed

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
        git submodule update --init && build
        virtualenv . --prompt="[$1] "
    fi
}

function clean_env () {
    if [ $VIRTUAL_ENV ] ; then
        deactivate
    fi

    rm bin/ include/ lib/ -rf
}

function clean_egg () {
    rm build/ dist/ *.egg-info/ -rf
}

function build () {
    echo -n
}

###############################################################################
###############################################################################

case $ACTMETH in
    clean)
        clean_egg && clean_env ;;
    clean-egg)
        clean_egg ;;
    clean-env)
        clean_env ;;
    init)
        setup_env $APPNAME ;;
    *)
        $0 init $1 $2 ;;
esac

###############################################################################
###############################################################################

exit 0
