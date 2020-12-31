# fuzzing_nodejs
This document describes how to get applications to work in docket containers for OWASP ZAP docker container to interact with.

## Presequisites
Docker and docker-compose

## Putting docker image on repo (in case I forget)
First create a personal token on github. Then run docker login.

```
docker login docker.pkg.github.com --username <your_username> -p <your_token>
```

Build your image and run docker tag (all names are lowercase)
```
$ docker build -t <image_name>:<tag> .

$ docker tag <name>:<tag> docker.pkg.github.com/<user_name>/<repo_name>/<image_name>:<tag>
```

Push the docker image to repo
```
docker push docker.pkg.github.com/<user_name>/<repo_name>/<image_name>:<tag>
```

## Setup OWASP ZAP

Have an docker image available. \
To be able to scan, interact with the Nodejs application, they should be in the same docker network

For example, if the Nodejs app is running in my_network. We ran this command for ZAP:

``` 
docker run --net my_network -u zap -p 8080:8080 -p 8090:8090 -i owasp/zap2docker-stable zap-webswing.sh
```

If ZAP container is already running, we can use:

```
docker network connect my_network <ZAP container name>
```

Then on your browser, head to http://localhost:8080/zap 

[ZAP Docker web UI guide](https://www.zaproxy.org/docs/docker/webswing/)

## Setup Nodejs Application
### 1. NodeGoat 1.3.0
Source code: https://github.com/OWASP/NodeGoat/tree/v1.3

If you simply want to run without code coverage plugin, within the cloned repo, run:
```
[NodeGoat]$ docker-compose build #For first time startup
[NodeGoat]$ docker-compose up
```
If you want to run with code coverage plugin, there are 2 options:
1. Run with the available Docker image:
- Get the image [here](https://github.com/skyworld42/NodeJSFuzzing/packages/547575)
- In `nodegoat_docker/docker-compose.yml`, replace `"build: ."` with `"image: docker.pkg.github.com/skyworld42/nodejsfuzzing/nodegoat_coverage:v1"` and run:
```
[nodegoat_docker]$ docker-compose up
``` 
2. Build the Docker image by your own:
- Put the `express-instrument-app` within the NodeGoat repo directory. Make sure that there is NO `node_modules` within `express-instrument-app`.
- Add to the `dependencies` of NodeGoat's `package.json` to point to the `express-instrument-app` folder:
```
...
    dependencies: {
        "express-instrument-app": "file:./express-instrument-app",
        ...
    }
...
```
- Replace the `Dockerfile` and `docker-compose.yml` in NodeGoat directory by the ones in `nodegoat_docker/` 
- Build the Docker image by:
```
[NodeGoat]$ docker build --tag <tag_name>:<version> . 
```
- Make sure in `docker-compose.yml` the option for `web` is `"image: <tag_name>:<version>"`
- Run `docker-compose up`.
- Note: because of compatibility with the code coverage plugin, I switch from `node:4.4` to `node:10` in the Dockerfile. This is not the optimal solution which might cause large image size. TODO: fix this. 

### 2. Keystone 4.0.0
https://github.com/keystonejs/keystone-classic/tree/v4.0.0

There is a test server that pre-populates the application. We're launching it with the following command: 
```
node test/e2e/server.js --env default --notest
```

To run it inside a Docker container. 

1. Using the existed image on github registry: `docker.pkg.github.com/skyworld42/nodejsfuzzing/keystone_coverage:v1`
    
    - Update the `image` field in docker-compose.yml to the target Docker image.
    - Run `docker-compose up`

2. Build docker image on local machine

    - Copy `server.js` to `<keystone 4.0.0 directory>/test/e2e/`
    - Copy `docker-compose.yml` and `Dockerfile` to `<keystone 4.0.0 directory>`
    - Build the docker image:
    ```
    docker build --tag <name>:<version> .
    ```
    - Update the `image` field in `docker-compose.yml` with `<name>:<version>`
    - Run `docker-compose up`

### 3. Apostrophe boilerplate
https://github.com/apostrophecms/apostrophe-boilerplate

It also uses docker-compose -> similar to NodeGoat.Note that this also use docker volumes. When tested on Oracle Linux Server 7.9, there is a permission error because of selinux enabled. Overcome by adding `:z` flag after each volume in `docker-compoes.yml`

Solution taken from [stackoverflow](https://stackoverflow.com/questions/44139279/docker-mounting-volume-with-permission-denied)

### 4. Juice-Shop 8.3.0
Source code: https://github.com/bkimminich/juice-shop/tree/v8.3.0

Run the authorization script to get the authorization token:
```
replayer/bin/replay --log juice-shop/loginSpec.js --config juice-shop/config.js
```

Existed docker hub repo: `bkimminich/juice-shop:v8.3.0`
Run without code coverage plugin:
```
sudo docker run --net my_network -d -p 3000:3000 bkimminich/juice-shop:v8.3.0 npm start
```
If you want code-coverage plugin, again there are 2 options:
1. Run with the available Docker image:
- Access the image [here](https://github.com/skyworld42/NodeJSFuzzing/packages/547578)
2. Build your own Docker image:
- Put the `express-instrument-app` within the Juice-shop repo directory. Make sure that there is NO `node_modules` within `express-instrument-app`.
- Add to the `dependencies` of Juice-shop's `package.json` to point to the `express-instrument-app` folder:
```
...
    dependencies: {
        "express-instrument-app": "file:./express-instrument-app",
        ...
    }
...
```
- Build the Docker image:
```
[Juice-shop]$ docker build --tag <tag_name>:<version> .
```
- Start up the application:
```
[Juice-shop]$ docker run --name juice -p 3000:3000 <tag_name>:<version> node ./express-instrument-app/bin/run --projectDir ./ --logFile log.txt --enable-coverage --babel app.js
```
### 5. Mongo-express 0.51.0 
https://github.com/mongo-express/mongo-express/tree/v0.51.0

Put the [docker-compose.yml](./mongo-express_docker) file into mongo-express directory. Then run:
```
docker-compose up
```
To start up the app with mongodb docker container.
