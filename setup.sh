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
    TEMPLATES=$1/templates
    WEBED_EXT=$STATIC/webed-ext

    CLSPATH_EXT=$WEBED_EXT/app/app.js
    CLSPATH_EXT=$CLSPATH_EXT,$WEBED_EXT/app
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
}

function minify () {

    STATIC=$1/static
    WEBED_EXT=$STATIC/webed-ext

    ###########################################################################
    ## delete intermediary `*.{css,js}`

    rm -f $STATIC/lib.js
    rm -f $STATIC/webed-ext.js
    rm -f $WEBED_EXT/resources/theme/theme-blue.css
    rm -f $WEBED_EXT/resources/theme/theme-gray.css
    rm -f $WEBED_EXT/resources/theme/theme-standard.css
    rm -f $WEBED_EXT/resources/theme/theme-ie.css

    ###########################################################################
    ## $WEBED_EXT/resources/theme/theme.new.css

    FROMs=$WEBED_EXT/resources/theme/reset.css
    FROMs=$FROMs,$WEBED_EXT/resources/theme/menu.css
    FROMs=$FROMs,$WEBED_EXT/resources/theme/webed.css
    FROMs=$FROMs,$WEBED_EXT/resources/theme/icons-16.css
    FROMs=$FROMs,$STATIC/lib/codemirror/lib/codemirror.css
    FROMs=$FROMs,$STATIC/lib/codemirror/addon/dialog/dialog.css

    sencha fs concat -f $STATIC/ext/resources/css/ext-all.css,$FROMs \
                     -t $WEBED_EXT/resources/theme/theme-blue.css
    sencha fs concat -f $STATIC/ext/resources/css/ext-all-gray.css,$FROMs \
                     -t $WEBED_EXT/resources/theme/theme-gray.css
    sencha fs concat -f $STATIC/ext/resources/css/ext-standard.css,$FROMs \
                     -t $WEBED_EXT/resources/theme/theme-standard.css
    sencha fs concat -f $STATIC/ext/resources/css/ext-ie.css,$FROMs \
                     -t $WEBED_EXT/resources/theme/theme-ie.css

    yuicompressor $WEBED_EXT/resources/theme/theme-blue.css \
                > $WEBED_EXT/resources/theme/theme-blue.new.css
    yuicompressor $WEBED_EXT/resources/theme/theme-gray.css \
                > $WEBED_EXT/resources/theme/theme-gray.new.css
    yuicompressor $WEBED_EXT/resources/theme/theme-standard.css \
                > $WEBED_EXT/resources/theme/theme-standard.new.css
    yuicompressor $WEBED_EXT/resources/theme/theme-ie.css \
                > $WEBED_EXT/resources/theme/theme-ie.new.css

    ###########################################################################
    ## $STATIC/lib.new.js

    FROMs=$STATIC/lib/node-uuid/uuid.js
    FROMs=$FROMs,$STATIC/lib/dmp/javascript/diff_match_patch.js
    FROMs=$FROMs,$STATIC/lib/typojs/typo/typo.js
    FROMs=$FROMs,$STATIC/lib/codemirror/lib/codemirror.js
    FROMs=$FROMs,$STATIC/lib/codemirror/addon/selection/active-line.js
    FROMs=$FROMs,$STATIC/lib/codemirror/addon/edit/matchbrackets.js
    FROMs=$FROMs,$STATIC/lib/codemirror/addon/dialog/dialog.js
    FROMs=$FROMs,$STATIC/lib/codemirror/addon/search/searchcursor.js
    FROMs=$FROMs,$STATIC/lib/codemirror/addon/search/search.js
    FROMs=$FROMs,$STATIC/lib/codemirror/addon/mode/loadmode.js
    FROMs=$FROMs,$STATIC/lib/codemirror/addon/mode/overlay.js
    FROMs=$FROMs,$STATIC/lib/codemirror/mode/meta.js

    sencha fs concatenate -f $FROMs -t $STATIC/lib.js
    yuicompressor $STATIC/lib.js > $STATIC/lib.new.js

    ###########################################################################
    ## $STATIC/webed-ext.new.js

    FROMs=$WEBED_EXT/app/assert.js
    FROMs=$FROMs,$WEBED_EXT/app/util.js
    FROMs=$FROMs,$WEBED_EXT/app/uuid.js
    FROMs=$FROMs,$WEBED_EXT/app/mime.js

    sencha fs concatenate -f $FROMs -t $STATIC/webed-ext.js
    yuicompressor $STATIC/webed-ext.js > $STATIC/webed-ext.new.js

    ###########################################################################
    ## swap from `*.new.{css,js}` to `*.min.{css,js}`

    mv $STATIC/webed-ext.new.js $STATIC/webed-ext.min.js
    mv $STATIC/lib.new.js $STATIC/lib.min.js
    mv $WEBED_EXT/resources/theme/theme-blue.new.css \
       $WEBED_EXT/resources/theme/theme-blue.min.css
    mv $WEBED_EXT/resources/theme/theme-gray.new.css \
       $WEBED_EXT/resources/theme/theme-gray.min.css
    mv $WEBED_EXT/resources/theme/theme-standard.new.css \
       $WEBED_EXT/resources/theme/theme-standard.min.css
    mv $WEBED_EXT/resources/theme/theme-ie.new.css \
       $WEBED_EXT/resources/theme/theme-ie.min.css
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
    minify)
        minify $APPNAME ;;
    *)
        $0 init $1 $2 ;;
esac

###############################################################################
###############################################################################

exit 0
