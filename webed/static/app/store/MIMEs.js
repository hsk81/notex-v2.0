Ext.define ('Webed.store.MIMEs', {
    extend: 'Ext.data.Store',
    requires: 'Webed.model.MIME',
    model: 'Webed.model.MIME',

    data: [{
        name: 'APL',
        mime: 'text/apl',
        icon: 'icon-page_white_code',
        ext:  'apl'
    },{
        name: 'Asterisk',
        mime: 'text/x-asterisk',
        icon: 'icon-page_white_code_red',
        ext:  'conf'
    },{
        name: 'C',
        mime: 'text/x-csrc',
        icon: 'icon-page_white_c',
        ext:  'c'
    },{
        name: 'C++',
        mime: 'text/x-c++src',
        icon: 'icon-page_white_cplusplus',
        ext:  'cpp'
    },{
        name: 'Java',
        mime: 'text/x-java',
        icon: 'icon-page_white_cup',
        ext:  'java'
    },{
        name: 'C#',
        mime: 'text/x-csharp',
        icon: 'icon-page_white_csharp',
        ext:  'cs'
    },{
        name: 'Scala',
        mime: 'text/x-scala',
        icon: 'icon-page_white_code',
        ext:  'scala'
    },{
        name: 'Clojure',
        mime: 'text/x-clojure',
        icon: 'icon-page_white_code',
        ext:  'clj'
    },{
        name: 'CoffeeScript',
        mime: 'text/x-coffeescript',
        icon: 'icon-page_white_cup',
        ext:  'coffee'
    },{
        name: 'Common Lisp',
        mime: 'text/x-common-lisp',
        icon: 'icon-page_white_code',
        ext:  'lisp'
    },{
        name: 'CSS',
        mime: 'text/css',
        icon: 'icon-css',
        ext:  'css'
    },{
        name: 'D',
        mime: 'text/x-d',
        icon: 'icon-page_white_code',
        ext:  'd'
    },{
        name: 'Diff',
        mime: 'text/x-diff',
        icon: 'icon-document_inspect',
        ext:  'diff'
    },{
        name: 'ECL',
        mime: 'text/x-ecl',
        icon: 'icon-page_white_code',
        ext:  'ecl'
    },{
        name: 'Erlang',
        mime: 'text/x-erlang',
        icon: 'icon-page_white_code',
        ext:  'erl'
    },{
        name: 'GO',
        mime: 'text/x-go',
        icon: 'icon-page_white_go',
        ext:  'go'
    },{
        name: 'Groovy',
        mime: 'text/x-groovy',
        icon: 'icon-page_white_cup',
        ext:  'groovy'
    },{
        name: 'H',
        mime: 'text/x-csrc',
        icon: 'icon-page_white_h',
        ext:  'h'
    },{
        name: 'Haskell',
        mime: 'text/x-haskell',
        icon: 'icon-page_white_code',
        ext:  'hs'
    },{
        name: 'Haxe',
        mime: 'text/x-haxe',
        icon: 'icon-page_white_code',
        ext:  'hx'
    },{
        name: 'ASP.NET',
        mime: 'application/x-aspx',
        icon: 'icon-page_white_world',
        flag: {text:  true},
        ext:  'aspx'
    },{
        name: 'Embedded Javascript',
        mime: 'application/x-ejs',
        icon: 'icon-page_white_world',
        flag: {text:  true},
        ext:  'ejs'
    },{
        name: 'JavaServer Pages',
        mime: 'application/x-jsp',
        icon: 'icon-page_white_world',
        flag: {text:  true},
        ext:  'jsp'
    },{
        name: 'HTML',
        mime: 'text/html',
        icon: 'icon-html',
        ext:  'html'
    },{
        name: 'HTTP',
        mime: 'message/http',
        icon: 'icon-page_white_get',
        flag: {text:  true},
        ext:  'http'
    },{
        name: 'JavaScript',
        mime: 'text/javascript',
        icon: 'icon-page_white_cup',
        ext:  'js'
    },{
        name: 'JSON',
        mime: 'application/json',
        icon: 'icon-page_white_code_red',
        flag: {text:  true},
        ext:  'json'
    },{
        name: 'TypeScript',
        mime: 'application/typescript',
        icon: 'icon-page_white_cup',
        flag: {text:  true},
        ext:  'ts'
    },{
        name: 'LESS',
        mime: 'text/x-less',
        icon: 'icon-css',
        ext:  'less'
    },{
        name: 'Lua',
        mime: 'text/x-lua',
        icon: 'icon-page_white_code',
        ext:  'lua'
    },{
        name: 'Markdown (GitHub-flavour)',
        mime: 'text/x-markdown',
        icon: 'icon-page_white_star',
        ext:  'md'
    },{
        name: 'NTriples',
        mime: 'text/n-triples',
        icon: 'icon-page_white_code_red',
        ext:  'nt'
    },{
        name: 'OCaml',
        mime: 'text/x-ocaml',
        icon: 'icon-page_white_code',
        ext:  'ml'
    },{
        name: 'Pascal',
        mime: 'text/x-pascal',
        icon: 'icon-page_white_code',
        ext:  'pascal'
    },{
        name: 'Perl',
        mime: 'text/x-perl',
        icon: 'icon-page_white_code',
        ext:  'pl'
    },{
        name: 'PHP',
        mime: 'text/x-php',
        icon: 'icon-page_white_php',
        ext:  'php'
    },{
        name: 'Pig',
        mime: 'text/x-pig',
        icon: 'icon-page_white_database',
        ext:  'pig'
    },{
        name: 'Plain Text',
        mime: 'text/plain',
        icon: 'icon-page_white_text',
        ext:  'txt'
    },{
        name: 'Properties files',
        mime: 'text/x-properties',
        icon: 'icon-page_white_code_red',
        ext:  'properties'
    },{
        name: 'Python',
        mime: 'text/x-python',
        icon: 'icon-page_white_code',
        ext:  'py'
    },{
        name: 'R',
        mime: 'text/x-rsrc',
        icon: 'icon-page_white_code',
        ext:  'r'
    },{
        name: 'reStructuredText',
        mime: 'text/x-rst',
        icon: 'icon-page_white_star',
        ext:  'rst'
    },{
        name: 'Ruby',
        mime: 'text/x-ruby',
        icon: 'icon-page_white_ruby',
        ext:  'rb'
    },{
        name: 'Rust',
        mime: 'text/x-rustsrc',
        icon: 'icon-page_white_code',
        ext:  'rust'
    },{
        name: 'Sass',
        mime: 'text/x-sass',
        icon: 'icon-css',
        ext:  'sass'
    },{
        name: 'Scheme',
        mime: 'text/x-scheme',
        icon: 'icon-page_white_code',
        ext:  'scm'
    },{
        name: 'Shell',
        mime: 'text/x-sh',
        icon: 'icon-page_white_code',
        ext:  'sh'
    },{
        name: 'Sieve',
        mime: 'application/sieve',
        icon: 'icon-page_white_code',
        flag: {text:  true},
        ext:  'sieve'
    },{
        name: 'Smalltalk',
        mime: 'text/x-stsrc',
        icon: 'icon-page_white_code',
        ext:  'st'
    },{
        hidden: true,
        name: 'SPARQL',
        mime: 'application/x-sparql-query',
        icon: 'icon-page_white_database',
        flag: {text:  true},
        ext:  'rq'
    },{
        hidden: true,
        name: 'SQL',
        mime: 'text/x-sql',
        icon: 'icon-page_white_database',
        ext:  'sql'
    },{
        name: 'sTeX',
        mime: 'text/x-stex',
        icon: 'icon-page_white_medal',
        ext:  'stex'
    },{
        name: 'LaTeX',
        mime: 'text/x-latex',
        icon: 'icon-page_white_medal',
        ext:  'tex'
    },{
        name: 'TiddlyWiki ',
        mime: 'text/x-tiddlywiki',
        icon: 'icon-page_white_lightning',
        ext:  'wiki'
    },{
        name: 'Tiki wiki',
        mime: 'text/tiki',
        icon: 'icon-page_white_lightning',
        ext:  'tiki'
    },{
        name: 'VB.NET',
        mime: 'text/x-vb',
        icon: 'icon-page_white_code',
        ext:  'vb'
    },{
        name: 'VBScript',
        mime: 'text/vbscript',
        icon: 'icon-page_white_code',
        ext:  'vbs'
    },{
        name: 'Verilog',
        mime: 'text/x-verilog',
        icon: 'icon-page_white_code',
        ext:  'v'
    },{
        name: 'XML',
        mime: 'application/xml',
        icon: 'icon-page_white_code_red',
        flag: {text:  true},
        ext:  'xml'
    },{
        name: 'XQuery',
        mime: 'application/xquery',
        icon: 'icon-page_white_database',
        flag: {text:  true},
        ext:  'xq'
    },{
        name: 'YAML',
        mime: 'text/x-yaml',
        icon: 'icon-page_white_code_red',
        ext:  'yaml'
    },{
        name: 'Z80',
        mime: 'text/x-z80',
        icon: 'icon-page_white_code',
        ext:  'z80'
    },{ // --------------------------------------------------------------------
        name: 'Root',
        mime: 'application/root',
        icon: 'icon-node_tree'
    },{
        name: 'Folder',
        mime: 'application/folder',
        icon: 'icon-folder'
    },{ // --------------------------------------------------------------------
        name: 'LaTex',
        mime: 'application/project+latex',
        icon: 'icon-report_latex'
    },{
        name: 'ReStructuredTex',
        mime: 'application/project+rest',
        icon: 'icon-report_rest'
    },{
        name: 'Generic',
        mime: 'application/project',
        icon: 'icon-report'
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
