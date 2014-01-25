[NoTex.ch](https://notex.ch): An Online Text Editor
===================================================

An online text editor for reStructuredText, Markdown, LaTex and more! It has integrated project management, syntax highlighting, split view and spell checking for 85+ dictionaries. Projects can be exported and imported as ZIP archives plus reStructuredText projects can be converted to PDF, HTML or LaTex. Give it a try: Visit https://notex.ch, open a sample project and press the *Export as .. PDF* button.

Commercial Support
------------------

Do you need help in setting up NoTex for your organization or institution? Does the described setup not correspond to your requirements? Would you like to have the application customized? Don't hesitate, and write to 17fa6d23@opayq.com: We'll provide you with an SLA (service level agreement) tailored to your needs!

**INFO**: To avoid spam the contact email is random and changes on a regular basis.

Installation
------------

* ```git clone https://github.com/hsk81/notex notex.git && cd notex.git```

Clone the GIT repository to the local disk and change the current working directory to the top level of the repository.

* ```docker build -rm -t hsk81/notex:run .```

Build a [docker](http://www.docker.io) container image and tag it as `hsk81/notex:run`: If your machine or internet connection is slow then just go have lunch, or do something time consuming, since the build process will take a while. A docker version `0.7.5` or newer is recommended.

**INFO**: Due to some docker issues, there is a small possiblity that the process will fail: In such a case just repeat the build command, till it runs through.

Execution: Development
----------------------

* ```docker run -t -p 5050:5000 hsk81/notex:run ./webed.py help```

Show all available commands; execute e.g. `./webed.py run -h` to see detailed options for the specified command. Don't get confused about `./webed.py`, which is the internal name of NoTex.

* ```docker run -t -p 5050:5000 hsk81/notex:run $(cat RUN.dev)```

Run the docker container and map the internal port `5000` to the external port `5050`. The `$(cat RUN.dev)` sub-process delivers the actual command to start the application; see the `RUN.dev` file for details.

* ```http://localhost:5050```

Navigate your browser to the above location, and enjoy! The application runs in debug mode, so don't use this approach in a production environment; see the next section for that.

**INFO**: Actual conversion (to PDF, HTML etc.) will not work yet, since the corresponding workers have not been started!

Execution: Production
---------------------

You need to run *three* components to get a functional application: a *frontend* `ntx` which is connected via a *queue* `qqq` to a *backend* conversion worker `spx-1`. But before starting any of the components you first need the setup a location, which can be used to exchange data:

* ```mkdir -p /var/www/webed && chmod www-data:www-data /var/www/webed -R```

Create `/var/www/webed` for sharing purposes (on the host machine), and give ownership to the `www-data` user and group; some GNU/Linux distributions may use `http` instead of `www-data` as the owner.
```
export QUEUE=tcp://10.0.3.1 && docker run -name ntx -t -p 8080:80 -p 9418:9418 -v /var/www/webed:/var/www/webed:rw hsk81/notex:run PING_ADDRESS=$QUEUE:7070 DATA_ADDRESS=$QUEUE:9090 $(cat RUN.pro)
```
Export first the `QUEUE` environment variable which needs to contain the TCP/IP address of a queue (to be started in the next step); if you run all three components on the same host then you can use the address of docker's bridge , e.g. `lxcbr0` (or similar: run `ifconfig` to get a listing of enabled interfaces).

Then run the *frontend* container named `ntx` and map the internal port `80` to the external port `8080`; the `PING_ADRESS` and `DATA_ADDRESS` variables are set within the containers environment and tell the frontend where the *ping* and *data* channels need to connect to; finally the `$(cat RUN.pro)` sub-process delivers the actual command to start the application and is executed as a container process; see the `RUN.pro` file for details.

The command also maps the `9418` port, which belongs to a `git-daemon`: This allows youto `clone` a particular repository from your host (if you know it's randomly generated name), like `git clone git://localhost/6b76c8b4-..-2aa1af896791`.
```
docker run -name qqq -t -p 7070:7070 -p 9090:9090 -p 7171:7171 -p 9191:9191 hsk81/notex:run ./webed-sphinx.py queue -pfa 'tcp://*:7070' -dfa 'tcp://*:9090' -pba 'tcp://*:7171' -dba 'tcp://*:9191'
```
Start the *queue* container named `qqq`, map the required ports to the host machine, and ensure that the TCP/IP binding addresses for the *ping* and *data* channels are declared correctly; actually you could omit the `-pfa`, `-dfa`, `-pba` and `-dba` arguments, since in this case the default values are used anyway.

As mentioned the queue offers four binding points: two for *frontend* container(s) to connect to (`-pfa` or `--ping-frontend-address`, and `-dfa` or `--data-frontend-address`), plus another two for *backend* worker(s) to connect to (`-pba` or `--ping-backend-address`, and `-dba` or `--data-backend-address`).

The application uses the *ping* and *data* channels for different purposes: Given a conversion job, the frontend asks the queue via a "ping" through the former channel if a worker is available, and if so it sends the corresponding data through the latter channel. The queue figures in a similar way which backend converter is idle and chooses it for the job.
```
export QUEUE=tcp://10.0.3.1 && docker run -name spx-1 -t -v /var/www/webed:/var/www/webed:rw hsk81/notex:run ./webed-sphinx.py converter -p $QUEUE:7171 -d $QUEUE:9191 --worker-threads 2
```
Run a worker container named `spx-1`, and connect to the queue by wiring the *ping* and *data* channels to the corresponding address and ports. The worker starts internally two threads: depending on job load and resources you can increase or decrease the number of conversion threads per worker.

You could also start another worker container by repeating the same command except by using another name, e.g. `spx-2`: But this does not make much sense, if the same physical host is used (increase the number of worker threads instead); if you would run the command on another host though, then you probably would need to provide a correct TCP/IP address for the `QUEUE` variable.

* ```http://localhost:8080```

Navigate your browser to the above location, and enjoy! The frontend container runs internally `nginx` to serve the application; depending on your needs use another external port than `8080` or proxy to `localhost:8080` via an `nginx` (or `apache` etc.) instance on your host machine.

Configuration
-------------

The default configuration (for the production environment) should be adapted to your needs, since otherwise some of the services which are included in NoTex might not run as expected. Below you'll find the configuration apdaptations which are used for the [NoTex.ch](https://notex.ch) site itself.

### Caching (`webed.conf`)

On [NoTex.ch](https://notex.ch) `memcached` is not run within the container, but externally (the command from `RUN.pro` has been adapted by omitting `MEMCACHED` [it could have also be set to zero: `MEMCACHED=0`]). Therefore the corresponding `memcached_pass` value had to be adapted:

```diff
diff --git a/webed.conf b/webed.conf
index 09aa27b..5c15110 100644
--- a/webed.conf
+++ b/webed.conf
@@ -15,7 +15,7 @@ server {
     location /cache {
         internal;
         set $memcached_key      $args;
-        memcached_pass          127.0.0.1:11211;
+        memcached_pass          10.0.3.1:11211;
         default_type            application/octet-stream;
         expires                 15s;
         add_header              Cache-Control private;
```

### Caching and Admin (`default.py`)

On [NoTex.ch](https://notex.ch) `memcached` and `redis` are not run within the container, but externally (the command from `RUN.pro` has been adapted by omitting `MEMCACHED` and `REDIS` [they could have also be set to zero: `MEMCACHED=0` and `REDIS=0`]). Therefore the corresponding `CACHE{0,1,2,3}_SERVERS` values had to be adapted:

```diff
diff --git a/webed/config/default.py b/webed/config/default.py
index e77e80c..751fcfc 100644
--- a/webed/config/default.py
+++ b/webed/config/default.py
@@ -27,13 +27,13 @@ class DefaultConfig:
         'CACHE_DEFAULT_TIMEOUT', PERMANENT_SESSION_LIFETIME.total_seconds ()))
 
     CACHE0_KEY_PREFIX = os.getenv ('CACHE0_KEY_PREFIX', 'webed-std:')
-    CACHE0_SERVERS = eval (os.getenv ('CACHE0_SERVERS', str (['127.0.0.1'])))
+    CACHE0_SERVERS = eval (os.getenv ('CACHE0_SERVERS', str (['10.0.3.1'])))
     CACHE1_KEY_PREFIX = os.getenv ('CACHE1_KEY_PREFIX', 'webed-obj:')
-    CACHE1_SERVERS = eval (os.getenv ('CACHE1_SERVERS', str (['127.0.0.1'])))
+    CACHE1_SERVERS = eval (os.getenv ('CACHE1_SERVERS', str (['10.0.3.1'])))
     CACHE2_KEY_PREFIX = os.getenv ('CACHE2_KEY_PREFIX', 'webed-sss:')
-    CACHE2_SERVERS = eval (os.getenv ('CACHE2_SERVERS', str (['127.0.0.1'])))
+    CACHE2_SERVERS = eval (os.getenv ('CACHE2_SERVERS', str (['10.0.3.1'])))
     CACHE3_KEY_PREFIX = os.getenv ('CACHE3_KEY_PREFIX', 'webed-dbs:')
-    CACHE3_SERVERS = eval (os.getenv ('CACHE3_SERVERS', str (['127.0.0.1'])))
+    CACHE3_SERVERS = eval (os.getenv ('CACHE3_SERVERS', str (['10.0.3.1'])))
 
     LOG_FILE = os.path.join ('..', 'webed.logs', 'webed.log')
     LOG_FILE = os.getenv ('LOG_FILE', LOG_FILE)
@@ -63,10 +63,10 @@ class DefaultConfig:
     ##
 
     PRIVILEGED_ADDRESSES = eval (os.getenv (
-        'PRIVILEGED_ADDRESSES', str (['127.0.0.1'])))
+        'PRIVILEGED_ADDRESSES', str (['XXX.X.X.X'])))
 
     PROXY_FIX = eval (os.getenv (
-        'PROXY_FIX', str (False)))
+        'PROXY_FIX', str (True)))
 
     ##
     ## MIMETYPE_PATHs is a list of paths point to a `mime.types` file, which
```

In addition, the `PRIVILEGED_ADDRESSES` has been changed to allow **secure** access to the admin interface: To access it use (a) the IP address of a machine, which has a back-end proxy (like `squid`) running, (b) on which you can `SSH` tunnel to, and (c) which has a front-end proxy (like `nginx`) running (pointing to the NoTex instance). Further then (d) connect your browser to the local port of the SSH tunnel (change the corresponding proxy settings in your browser).

You should also make sure to run the front-end proxy via HTTPS (for which a self-signed SSL certificated should be enough). Then navigate to e.g. `admin.notex.ch` (or whereever the now *privileged machine* is running):

* `https://admin.notex.ch/admin/`

Provided, you've set-up the privileged machine correctly, the admin interface should appear: By default you'll be recognized as an `annonymous` user. To login visit `https://admin.notex.ch/admin/login` and to logout `https://admin.notex.ch/admin/logout`: On successful login you should be recognized as an `admin` user, and acquire access to the corresponding actions/menus.

The security of this setup is based upon the admin user possessing the SSH key file for the privileged machine to be able to establish an SSH tunnel successfully. As long as the priviledged machine is not compromised, the access should be safe. Consider also a *browser plugin* which can quickly enable and disable the proxy access: As long as the proxy is disabled you should not be able to login as an admin user.

Set `PROXY_FIX` to `True`, and correctly forward the *remote address* of a client (in the front-end proxy via setting the `X-Forwarded-For` and `X-Real-IP` headers), since otherwise this setup will not work. Do **not** set `PROXY_FIX` if you connect the NoTex instance directly (without a front-end proxy in between) to the internet!

### Security, DB, Mail, Blog and CDN (`production.py`)

Replace the authentication tokens marked with `XXX` with the corresponding values for you environment: A `SECRET_KEY` can be generated by simply running the `production.py` script; the DB is run (like the caches) externally (which means `POSTGRESQL` has been omitted [or set to zero: `POSTGRESQL=0`]); the `MAIL_*` and `DEFAULT_MAIL_*` values have been adapted to allow the contact page to work properly; the `BLOG_*` values changed to let the desired blogs appear; and finally a `CDN` has been setup to allow fast global access:

```diff
diff --git a/webed/config/production.py b/webed/config/production.py
index 8f5e39a..3104eec 100644
--- a/webed/config/production.py
+++ b/webed/config/production.py
@@ -23,14 +23,14 @@ import os
 ###############################################################################
 ###############################################################################
 
-SECRET_KEY = '000000000000000000000000000000000000000=' ## [!!]
+SECRET_KEY = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX=' ## [**]
 SECRET_KEY = os.getenv ('SECRET_KEY', SECRET_KEY)
 
 ###############################################################################
 ###############################################################################
 
 SQLALCHEMY_DATABASE_URI = os.getenv ('SQLALCHEMY_DATABASE_URI',
-    'postgresql://webed-p:password@localhost/webed-p') ## [ok]
+    'postgresql://webed-p:password@10.0.3.1/webed-p') ## [ok]
 
 ###############################################################################
 ###############################################################################
@@ -45,26 +45,26 @@ VCS_CONF = os.getenv ('VCS_CONF', VCS_CONF)
 ###############################################################################
 ###############################################################################
 
-MAIL_SERVER = os.getenv ('MAIL_SERVER', 'SMTP.SERVER.NET') ## [??]
+MAIL_SERVER = os.getenv ('MAIL_SERVER', 'smtp.XXXXXX.XXX') ## [**]
 MAIL_PORT = int (os.getenv ('MAIL_PORT', 587)) ## [ok]
 MAIL_USE_TLS = eval (os.getenv ('MAIL_USE_TLS', str (True))) ## [ok]
-MAIL_USERNAME = os.getenv ('MAIL_USERNAME', 'USERNAME') ## [??]
-MAIL_PASSWORD = os.getenv ('MAIL_PASSWORD', 'PASSWORD') ## [??]
+MAIL_USERNAME = os.getenv ('MAIL_USERNAME', 'XXXXXXXX') ## [**]
+MAIL_PASSWORD = os.getenv ('MAIL_PASSWORD', 'XXXXXXXX') ## [**]
 
 DEFAULT_MAIL_SENDER = eval (os.getenv (
-    'DEFAULT_MAIL_SENDER', str (('SENDER', 'SENDER@MAIL.NET')))) ## [??]
+    'DEFAULT_MAIL_SENDER', str (('XXXXXX', 'XXXXXX@XXXX.XXX')))) ## [**]
 DEFAULT_MAIL_RECEIVERS = eval (os.getenv (
-    'DEFAULT_MAIL_RECEIVERS', str (['RECEIVER@MAIL.NET']))) ## [??]
+    'DEFAULT_MAIL_RECEIVERS', str (['XXXXXXXX@XXXX.XXX']))) ## [**]
 
 ###############################################################################
 ###############################################################################
 
 BLOG_ID = os.getenv ('BLOG_ID', str (
-    '0000000000000000000')) ## [??]
+    'XXXXXXXXXXXXXXXXXXX')) ## [**]
 BLOG_URL = os.getenv ('BLOG_URL', str (
     'https://www.googleapis.com/blogger/v3/blogs/%s/posts' % BLOG_ID)) ## [ok]
 BLOG_API_KEY = os.getenv ('BLOG_API_KEY', str (
-    '0000000000000--000000000000000000000000')) ## [??]
+    'XXXXXXXXXXXXX--XXXXXXXXXXXXXXXXXXXXXXXX')) ## [**]
 BLOG_HEADERS = eval (os.getenv ('BLOG_HEADERS', str (
     {'Accept-Encoding': 'gzip', 'User-Agent': 'NoTex.ch (gzip)'}))) ## [ok]
@@ -72,6 +72,7 @@ BLOG_HEADERS = eval (os.getenv ('BLOG_HEADERS', str (
 ###############################################################################
 
 FORUM_URL = os.getenv ('FORUM_URL', 'http://bbs.notex.ch/index.php') ## [ok]
+CDN = os.getenv ('CDN', 'https://XXXXXXXXXXX') ## [**]
 
 ###############################################################################
 ###############################################################################
```

### Web frontend to GIT (`gitweb.conf`)

The `gitweb` service provides a web interface to a git repository; the `$project_list` setting should definitely be set, since it controls which projects are seen on the main view. Since such a list is not desirable -- due to privacy reasons -- it point to an empty/non-existent `$projectroot/project.lst` file:

```diff
diff --git a/gitweb.conf b/gitweb.conf
index 78c8ad1..5696f40 100644
--- a/gitweb.conf
+++ b/gitweb.conf
@@ -5,10 +5,10 @@ $git_temp = "/tmp";
 $projectroot = "/var/www/webed/acid"; 
 
 # File listing projects, or directory to be scanned for projets.
-$projects_list = "$projectroot";
+$projects_list = "$projectroot/project.lst";
 
 # Base URLs for links displayed in the web interface.
-our @git_base_url_list = qw(git://localhost);
+our @git_base_url_list = qw(git://vcs.notex.ch);
 
 # Show the author of each line in a source file.
 $feature{'blame'}{'default'} = [1];
@@ -17,10 +17,10 @@ $feature{'blame'}{'default'} = [1];
 $feature{'highlight'}{'default'} = [1];
 
 # Label for the "home link" at the top of all pages.
-$home_link_str = "NoTex";
+$home_link_str = "NoTex.ch";
 
 # Target of the home link on the top of all pages.
-$home_link = "http://localhost:8008/git/";
+$home_link = "https://notex.ch";
 
 # Name of your site or organization.
-$site_name = "NoTex - Git Web Interface";
+$site_name = "NoTex.ch - Git Web Interface";
```

Commercial Support
------------------

Do you need help in setting up NoTex for your organization or institution? Does the described setup not correspond to your requirements? Would you like to have the application customized? Do not hesitate, and write to 17fa6d23@opayq.com: We'll provide you with an SLA (service level agreement) tailored to your needs!

**INFO**: To avoid spam the contact email is random and changes on a regular basis.
