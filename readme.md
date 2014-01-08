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

Execution: Production
---------------------

* ```docker run -t -p 8080:80 notex:run $(cat RUN.pro)```

Run the docker container and map the internal port `80` to the external port `8080`. The `$(cat RUN.pro)` sub-process delivers the actual command to start the application; see the `RUN.pro` file for details.

* ```http://localhost:8080```

Navigate your browser to the above location, and enjoy! The container runs internally `nginx` to serve the application; depending on your needs use another external port than `8080` or proxy to `localhost:8080` via an `nginx` (or `apache` etc.) instance on your host machine.

**INFO:** The actual conversion process has *not* been docker-ized yet; but this will be fixed very soon!
