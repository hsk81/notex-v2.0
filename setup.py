#!bin/python

###############################################################################
###############################################################################

from setuptools import setup

###############################################################################
###############################################################################

setup (
    name='webed',
    version='0.1.0',
    description='Browser based text editor',
    author='Hasan Karahan',
    author_email='hasan.karahan81@gmail.com',
    packages=['webed'],
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'compressinja>=0.0.2',
        'Flask>=0.9',
        'Flask-Admin>=1.0.4',
        'Flask-Assets>=0.8',
        'Flask-DebugToolbar>=0.8',
        'Flask-Login>=0.1.3',
        'Flask-Mail>=0.7.6',
        'Flask-Script>=0.5.3',
        'Flask-SQLAlchemy>=0.16',
        'Flask-Psycopg2>=1.2',
        'gevent>=0.13.8',
        'gevent-fastcgi==0.1.15dev',
        'zope.interface==4.0.5',
        'ipython>=0.13.1',
        'hiredis>=0.1.1',
        'pylibmc>=1.2.3',
        'PyYAML>=3.10',
        'pyzmq>=13.0.0',
        'redis>=2.7.2',
        'spritemapper>=1.0.0',
        'ujson>=1.30',
        'yuicompressor>=2.4.7'
    ]
)

###############################################################################
###############################################################################
