NoTex.ch
========

An online text editor for reStructuredText, Markdown, LaTex and more! It has integrated project management, syntax highlighting, split view and spell checking for 85+ dictionaries. Projects can be exported and imported as ZIP archives plus reStructuredText projects can be converted to PDF, HTML or LaTex.

Give it a try: Visit https://notex.ch, open a sample project and press the *Export as .. PDF* button.

Installation
------------

* ```git clone https://github.com/hsk81/notex notex.git && cd notex.git```

Clone the GIT repository to the local disk and change the current working directory to the top level of the repository.

* ```docker build -rm -t notex:run .```

Build a [docker](http://www.docker.io) container image and tag it as `notex:run`: If your machine or internet connection is slow then just go have lunch, or do something time consuming, since the build process will take a while. A docker version `0.7.4` or newer is recommended.

Execution: Development
----------------------

* ```docker run -t -p 5050:5000 notex:run ./webed.py help```

Show all available commands; execute e.g. `./webed.py run -h` to see detailed options for the specified command. Don't get confused about `./webed.py`, which is the internal name of NoTex.

* ```docker run -t -p 5050:5000 notex:run $(cat RUN.dev)```

Run the docker container and map the internal port `5000` to the external port `5050`. The `$(cat RUN.dev)` sub-process delivers the actual command to start the application; see the `RUN.dev` file for details.

* ```http://localhost:5050```

Navigate your browser to the above location, and enjoy! The application runs in debug mode, so don't use this approach in a production environment; see the next section for that.

**INFO**: Actual conversions will not work yet, since the corresponding workers have not been started!

Execution: Production
---------------------

You need to run *three* components to get a functional application: a frontend `ntx` which is connected via a queue `qqq` to a backend conversion worker `spx`:
```
export QUEUE=tcp://10.0.3.1 && docker run -name ntx -t -p 8080:80 notex:run \
PING_ADDRESS=$QUEUE:7070 DATA_ADDRESS=$QUEUE:9090 $(cat RUN.pro)
```
Export first the `QUEUE` environment variable which needs to contain the TCP/IP address of a queue (to be started in the next step); if you run all three components on the same host then you can use the address of the bridge docker uses, e.g. `lxcbr0` (or similar: run `ifconfig` to get a listing of enabled interfaces).

Then run the *frontend* container named `ntx` and map the internal port `80` to the external port `8080`; the `PING_ADRESS` and `DATA_ADDRESS` variables are set within the containers environment and tell the frontend where the *ping* and *data* channels need to connect to; finally the `$(cat RUN.pro)` sub-process delivers the actual command to start the application and is executed as a container process; see the `RUN.pro` file for details.
```
docker run -name qqq -t -p 7070:7070 -p 9090:9090 -p 7171:7171 -p 9191:9191 \
notex:run ./webed-sphinx.py queue -pfa 'tcp://*:7070' -dfa 'tcp://*:9090' \
-pba 'tcp://*:7171' -dba 'tcp://*:9191'
```
Start the *queue* container named `qqq`, map the required ports to the host machine, and ensure that the TCP/IP binding addresses for the *ping* and *data* channels are declared correctly; actually you could omit the `-pfa`, `-dfa`, `-pba` and `-dba` arguments, since this case the default values are used anyway.

As mentioned the queue offers four binding points: two for *frontend* container(s) to connect to (`-pfa` or `--ping-frontend-address`, and `-dfa` or `--data-frontend-address`), plus another two for *backend* worker(s) to connect to (`-pba` or `--ping-backend-address`, and `-dba` or `--data-backend-address`).

The application uses the *ping* and *data* channels for different purposes: Given a conversion job, the frontend ask the queue via a "ping" through the former channel if a worker is available, and if so sends the corresponding data through the latter one. The queue figures in a similar way which backend converter is idle and chooses it for the job.
```
export QUEUE=tcp://10.0.3.1 && docker run -name spx-1 -t hsk81/notex:run \
./webed-sphinx.py converter -p $QUEUE:7171 -d $QUEUE:9191 --worker-threads 2
```
Run a worker container named `spx-1`, and connect to the queue by wiring the *ping* and *data* channels to the corresponding addresses and ports; the worker starts internally two threads: depending on job load and resources you can increase or decrease the number of conversion threads per worker.

You could also start another worker container by repeating the same command except by using another name, e.g. `spx-2`: But this does not make much sense, if the same physical host is used (increase the number of worker threads instead); if you would run the command on another host though, the you probably would need to provide the correct TCP/IP address via the `QUEUE` variable.

* ```http://localhost:8080```

Navigate your browser to the above location, and enjoy! The frontend container runs internally `nginx` to serve the application; depending on your needs use another external port than `8080` or proxy to `localhost:8080` via an `nginx` (or `apache` etc.) instance on your host machine.
