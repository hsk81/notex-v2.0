Ext.define ('Webed.store.MIMEs', {
    extend: 'Ext.data.Store',
    requires: 'Webed.model.MIME',
    model: 'Webed.model.MIME',

    data: [{
        name: 'APL',
        mime: 'text/apl',
        icon: 'icon-page_white_code',
        exts: ['apl']
    },{
        name: 'Asterisk',
        mime: 'text/x-asterisk',
        icon: 'icon-page_white_code_red',
        exts: ['conf']
    },{
        name: 'C',
        mime: 'text/x-csrc',
        icon: 'icon-page_white_c',
        exts: ['c']
    },{
        name: 'C++',
        mime: 'text/x-c++src',
        icon: 'icon-page_white_cplusplus',
        exts: ['cpp','cxx']
    },{
        name: 'Java',
        mime: 'text/x-java',
        icon: 'icon-page_white_cup',
        exts: ['java']
    },{
        name: 'C#',
        mime: 'text/x-csharp',
        icon: 'icon-page_white_csharp',
        exts: ['cs']
    },{
        name: 'Scala',
        mime: 'text/x-scala',
        icon: 'icon-page_white_code',
        exts: ['scala']
    },{
        name: 'Clojure',
        mime: 'text/x-clojure',
        icon: 'icon-page_white_code',
        exts: ['clj']
    },{
        name: 'CoffeeScript',
        mime: 'text/x-coffeescript',
        icon: 'icon-page_white_cup',
        exts: ['coffee']
    },{
        name: 'Common Lisp',
        mime: 'text/x-common-lisp',
        icon: 'icon-page_white_code',
        exts: ['lisp']
    },{
        name: 'CSS',
        mime: 'text/css',
        icon: 'icon-css',
        exts: ['css']
    },{
        name: 'D',
        mime: 'text/x-d',
        icon: 'icon-page_white_code',
        exts: ['d']
    },{
        name: 'Diff',
        mime: 'text/x-diff',
        icon: 'icon-document_inspect',
        exts: ['diff']
    },{
        name: 'ECL',
        mime: 'text/x-ecl',
        icon: 'icon-page_white_code',
        exts: ['ecl']
    },{
        name: 'Erlang',
        mime: 'text/x-erlang',
        icon: 'icon-page_white_code',
        exts: ['erl']
    },{
        name: 'GO',
        mime: 'text/x-go',
        icon: 'icon-page_white_go',
        exts: ['go']
    },{
        name: 'Groovy',
        mime: 'text/x-groovy',
        icon: 'icon-page_white_cup',
        exts: ['groovy','gvy','gy','gsh']
    },{
        name: 'H',
        mime: 'text/x-csrc',
        icon: 'icon-page_white_h',
        exts: ['h']
    },{
        name: 'Haskell',
        mime: 'text/x-haskell',
        icon: 'icon-page_white_code',
        exts: ['hs','lhs']
    },{
        name: 'Haxe',
        mime: 'text/x-haxe',
        icon: 'icon-page_white_code',
        exts: ['hx']
    },{
        name: 'ASP.NET',
        mime: 'application/x-aspx',
        icon: 'icon-page_white_world',
        flag: {text: true},
        exts: ['aspx']
    },{
        name: 'Embedded Javascript',
        mime: 'application/x-ejs',
        icon: 'icon-page_white_world',
        flag: {text: true},
        exts: ['ejs']
    },{
        name: 'JavaServer Pages',
        mime: 'application/x-jsp',
        icon: 'icon-page_white_world',
        flag: {text: true},
        exts: ['jsp']
    },{
        name: 'HTML',
        mime: 'text/html',
        icon: 'icon-html',
        exts: ['html']
    },{
        name: 'HTTP',
        mime: 'message/http',
        icon: 'icon-page_white_get',
        flag: {text: true},
        exts: ['http']
    },{
        name: 'JavaScript',
        mime: 'text/javascript',
        icon: 'icon-page_white_cup',
        exts: ['js']
    },{
        name: 'JSON',
        mime: 'application/json',
        icon: 'icon-page_white_code_red',
        flag: {text: true},
        exts: ['json']
    },{
        name: 'TypeScript',
        mime: 'application/typescript',
        icon: 'icon-page_white_cup',
        flag: {text: true},
        exts: ['ts']
    },{
        name: 'LESS',
        mime: 'text/x-less',
        icon: 'icon-css',
        exts: ['less']
    },{
        name: 'Lua',
        mime: 'text/x-lua',
        icon: 'icon-page_white_code',
        exts: ['lua']
    },{
        name: 'Markdown (GitHub-flavour)',
        mime: 'text/x-markdown',
        icon: 'icon-page_white_star',
        exts: ['md']
    },{
        name: 'NTriples',
        mime: 'text/n-triples',
        icon: 'icon-page_white_code_red',
        exts: ['nt']
    },{
        name: 'OCaml',
        mime: 'text/x-ocaml',
        icon: 'icon-page_white_code',
        exts: ['ocaml','mli','ml']
    },{
        name: 'Pascal',
        mime: 'text/x-pascal',
        icon: 'icon-page_white_code',
        exts: ['pas','pascal','tpu']
    },{
        name: 'Perl',
        mime: 'text/x-perl',
        icon: 'icon-page_white_code',
        exts: ['pl','perl','plx','pm']
    },{
        name: 'PHP',
        mime: 'text/x-php',
        icon: 'icon-page_white_php',
        exts: ['php']
    },{
        name: 'Pig',
        mime: 'text/x-pig',
        icon: 'icon-page_white_database',
        exts: ['pig']
    },{
        name: 'Plain Text',
        mime: 'text/plain',
        icon: 'icon-page_white_text',
        exts: ['txt']
    },{
        name: 'Properties files',
        mime: 'text/x-properties',
        icon: 'icon-page_white_code_red',
        exts: ['properties']
    },{
        name: 'Python',
        mime: 'text/x-python',
        icon: 'icon-page_white_code',
        exts: ['py']
    },{
        name: 'R',
        mime: 'text/x-rsrc',
        icon: 'icon-page_white_code',
        exts: ['r']
    },{
        name: 'reStructuredText',
        mime: 'text/x-rst',
        icon: 'icon-page_white_star',
        exts: ['rst','rest']
    },{
        name: 'Ruby',
        mime: 'text/x-ruby',
        icon: 'icon-page_white_ruby',
        exts: ['rb','ruby']
    },{
        name: 'Rust',
        mime: 'text/x-rustsrc',
        icon: 'icon-page_white_code',
        exts: ['rust']
    },{
        name: 'Sass',
        mime: 'text/x-sass',
        icon: 'icon-css',
        exts: ['sass']
    },{
        name: 'Scheme',
        mime: 'text/x-scheme',
        icon: 'icon-page_white_code',
        exts: ['scm','ss']
    },{
        name: 'Shell',
        mime: 'text/x-sh',
        icon: 'icon-page_white_code',
        exts: ['sh','ksh','bsh']
    },{
        name: 'Sieve',
        mime: 'application/sieve',
        icon: 'icon-page_white_code',
        flag: {text: true},
        exts: ['sieve']
    },{
        name: 'Smalltalk',
        mime: 'text/x-stsrc',
        icon: 'icon-page_white_code',
        exts: ['st']
    },{
        name: 'SPARQL',
        mime: 'application/x-sparql-query',
        icon: 'icon-page_white_database',
        flag: {text: true, hidden: true},
        exts: ['rq']
    },{
        name: 'SQL',
        mime: 'text/x-sql',
        icon: 'icon-page_white_database',
        flag: {hidden: true},
        exts: ['sql']
    },{
        name: 'sTeX',
        mime: 'text/x-stex',
        icon: 'icon-page_white_medal',
        exts: ['stex']
    },{
        name: 'LaTeX',
        mime: 'text/x-latex',
        icon: 'icon-page_white_medal',
        exts: ['tex','lof','toc','sty','latex']
    },{
        name: 'TiddlyWiki ',
        mime: 'text/x-tiddlywiki',
        icon: 'icon-page_white_lightning',
        exts: ['wiki']
    },{
        name: 'Tiki wiki',
        mime: 'text/tiki',
        icon: 'icon-page_white_lightning',
        exts: ['tiki']
    },{
        name: 'VB.NET',
        mime: 'text/x-vb',
        icon: 'icon-page_white_code',
        exts: ['vb']
    },{
        name: 'VBScript',
        mime: 'text/vbscript',
        icon: 'icon-page_white_code',
        exts: ['vbs']
    },{
        name: 'Verilog',
        mime: 'text/x-verilog',
        icon: 'icon-page_white_code',
        exts: ['v']
    },{
        name: 'XML',
        mime: 'application/xml',
        icon: 'icon-page_white_code_red',
        flag: {text: true},
        exts: ['xml','xhtml']
    },{
        name: 'XQuery',
        mime: 'application/xquery',
        icon: 'icon-page_white_database',
        flag: {text: true},
        exts: ['xq','xql','xqm','xqy','xquery','xqws']
    },{
        name: 'YAML',
        mime: 'text/x-yaml',
        icon: 'icon-page_white_code_red',
        exts: ['yaml']
    },{
        name: 'Z80',
        mime: 'text/x-z80',
        icon: 'icon-page_white_code',
        exts: ['z80']
    },{ // --------------------------------------------------------------------
        name: 'Root',
        mime: 'application/root',
        icon: 'icon-node_tree'
    },{
        name: 'Folder',
        mime: 'application/folder',
        icon: 'icon-folder'
    },{ // --------------------------------------------------------------------
        name: 'Generic',
        mime: 'application/project',
        icon: 'icon-report',
        main: 'text/plain'
    },{
        name: 'ReStructuredTex',
        mime: 'application/project+rest',
        icon: 'icon-report_rest',
        main: 'text/x-rst'
    },{
        name: 'LaTex',
        mime: 'application/project+latex',
        icon: 'icon-report_latex',
        main: 'text/x-latex'
    },{ // --------------------------------------------------------------------
        name: 'Text',
        mime: 'text/*',
        icon: 'icon-page'
    },{
        name: 'Image',
        mime: 'image/*',
        icon: 'icon-picture'
    },{
        name: 'Generic',
        mime: '*',
        icon: 'icon-page_white'
    }]
});
