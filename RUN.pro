NGINX=1 REDIS=1 MEMCACHED=1 POSTGRESQL=1 uwsgi -s /var/www/webed/uwsgi.sock -w webed-wsgi:app --enable-threads
