#!/bin/bash

###############################################################################
###############################################################################

# Require $ sudo pacman -S nodejs
# Require $ sudo npm install -g grunt

# Initial $ ./setup.sh init webed
# Upgrade $ ./setup.sh init webed --upgrade

###############################################################################
###############################################################################

ACTMETH=${1}
APPNAME=${2-"webed"}
PIPOPTS=${3-""}

###############################################################################
###############################################################################

function pipit () {
    pip install $1 Flask
    pip install $1 Flask-SQLAlchemy
    pip install $1 Flask-Admin
    pip install $1 Flask-DebugToolbar
    pip install $1 ipython
}

###############################################################################
###############################################################################

function vexec_pip () {
    if [ -f bin/activate ] ; then
        source bin/activate
        if [ $VIRTUAL_ENV ] ; then
            pipit $1 ; deactivate
        fi
    fi
}

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

function clear_env () {
    if [ $VIRTUAL_ENV ] ; then
        deactivate
    fi

    rm bin/ include/ lib/ -r
}

function build () {
    cd ./static/lib/jquery.git/
    npm install && grunt
    cd ./../../../
}

###############################################################################
###############################################################################

case $ACTMETH in
    clear)
        clear_env ;;
    init)
        setup_env $APPNAME && vexec_pip $PIPOPTS ;;
    *)
        $0 init $1 $2 ;;
esac

###############################################################################
###############################################################################

exit 0
