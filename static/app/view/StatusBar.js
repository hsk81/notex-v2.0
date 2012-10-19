Ext.Loader.setPath ({
    'Ext.ux': '../static/lib/extjs/examples/ux'
});

Ext.define ('Webed.view.StatusBar', {
    extend: 'Ext.ux.statusbar.StatusBar',
    alias: 'widget.status-bar',
    text: 'WebEd',
    items: [{
        xtype: 'status-bar.progress-bar'
    },'-',{
        xtype: 'status-bar.info-button'
    },'-',{
        text: '125%'
    },{
        xtype: 'status-bar.slider'
    }]
});

Ext.define ('Webed.view.statusBar.ProgressBar', {
    extend: 'Ext.ProgressBar',
    alias: 'widget.status-bar.progress-bar',

    width : 256,
    value : 100.0,
    hidden : false,

    disabled: true,
    interval : 125, //[ms]
    total : 0, //[ms]
    increment : 100 // #segments
});

Ext.define ('Webed.view.statusBar.InfoButton', {
    extend: 'Ext.Button',
    alias: 'widget.status-bar.info-button',

    tooltip: '<b>Line:Char</b> or <b>Lines:Words:Chars</b>',
    text: '',
    disabled: true,
    width: 64
});

Ext.define ('Webed.view.statusBar.Slider', {
    extend: 'Ext.slider.Single',
    alias: 'widget.status-bar.slider',

    width : 128,
    increment : 25,
    value : 125,
    minValue : 50,
    maxValue : 150
});
