#!bin/python

###############################################################################
###############################################################################

from setuptools import setup

###############################################################################
###############################################################################

version = '2.1.5'

###############################################################################
###############################################################################

if __name__ == '__main__':

    setup (
        name='webed',
        version=version,
        description='Browser based text editor',
        author='Hasan Karahan',
        author_email='hasan.karahan81@gmail.com',
        packages=['webed'],
        include_package_data=True,
        zip_safe=False,
        install_requires=[
            'Flask==0.10.1',
             ## REQUIRES: `pip uninstall Flask-Admin` && `setup.py install`!!
            'Flask-Admin==1.0.6',
            'Flask-Assets==0.8',
            'Flask-DebugToolbar==0.8.0',
            'Flask-Login==0.2.7',
            'Flask-Mail==0.9.0',
            'Flask-Psycopg2==1.2',
            'Flask-SQLAlchemy==1.0',
            'Flask-Script==0.5.3',
            'Flask-WTF==0.9.3',
            'Jinja2==2.7.1',
            'MarkupSafe==0.18',
            'PyYAML==3.10',
            'SQLAlchemy==0.8.2',
            'WTForms==1.0.5',
            'Werkzeug==0.9.4',
            'acidfs==1.1dev',
            'blinker==1.3',
            'compressinja==0.0.2',
            'hiredis==0.1.1',
            'ipython==1.1.0',
            'itsdangerous==0.23',
            'psycopg2==2.5.1',
            'pylibmc==1.2.3',
            'pyzmq==13.1.0',
            'redis==2.8.0',
            'requests==2.0.0',
            'spritemapper==1.0.0',
            'transaction==1.4.1',
            'uWSGI==1.9.18.1',
            'ujson==1.33',
            'webassets==0.8',
            'wsgiref==0.1.2',
            'yuicompressor==2.4.8',
            'zope.interface==4.0.5',
        ],

        dependency_links=[
            'http://github.com/hsk81/acidfs/tarball/master#egg=acidfs-1.1dev',
            'http://github.com/hsk81/flask-admin/tarball/master#egg=Flask-Admin-1.0.6'
        ]
    )

    print
    print "# If this is the 1st run, execute also:"
    print "$ pip uninstall Flask-Admin"
    print "# And then re-run setup:"
    print "$ ./setup.py install"

###############################################################################
###############################################################################
