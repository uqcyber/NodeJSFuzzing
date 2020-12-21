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
Make sure to clone https://github.com/OWASP/NodeGoat/tree/v1.3

Setup coverage plugin for NodeGoat:
```
[NodeGoat]$ cp path/to/express-instrument-app . 
[NodeGoat]$ cd express-instrument-app
[express-instrument-app]$ npm install .
```

On first time start up:
```
[NodeGoat]$ docker-compose build
```

Start up using docker-compose:
```
[NodeGoat]$ docker-compose up
```

### 2. Keystone 4.0.0
https://github.com/keystonejs/keystone-classic/tree/v4.0.0

There is a test server that pre-populates the application. We're launching it with the following command: 
```
node test/e2e/server.js --env default --notest
```

To run it inside a Docker container. 

1. Using the existed image on github registry: `docker.pkg.github.com/skyworld42/fuzzing_nodejs/keystone-docker:v1`
    
    - Run the images (with the command above) inside a docker network and connect ZAP to it. Don't need to use docker-compose.

2. Build docker image on local machine

    - Copy [server.js](./keystone_docker/server.js) to `<keystone 4.0.0 directory>/test/e2e/`
    - Copy docker-compose.yml and Dockerfile to `<keystone 4.0.0 directory>`
    - Run:
    ```
    docker-compose up
    ```

### 3. Apostrophe boilerplate
https://github.com/apostrophecms/apostrophe-boilerplate

It also uses docker-compose -> similar to NodeGoat.Note that this also use docker volumes. When tested on Oracle Linux Server 7.9, there is a permission error because of selinux enabled. Overcome by adding `:z` flag after each volume in `docker-compoes.yml`

Solution taken from [stackoverflow](https://stackoverflow.com/questions/44139279/docker-mounting-volume-with-permission-denied)

### 4. Juice-Shop 8.3.0
https://github.com/bkimminich/juice-shop/tree/v8.3.0

Existed docker hub repo: `bkimminich/juice-shop`
```
sudo docker run --net my_network -d -p 3000:3000 bkimminich/juice-shop:v8.3.0 npm start
```

### 5. Mongo-express 0.51.0 
https://github.com/mongo-express/mongo-express/tree/v0.51.0

Put the [docker-compose.yml](./mongo-express_docker) file into mongo-express directory. Then run:
```
docker-compose up
```
To start up the app with mongodb docker container.

