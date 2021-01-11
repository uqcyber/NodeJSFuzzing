# NODE_JS_FUZZING
A small project to compare the performance of various of fuzzers agains 5 Node.js applications. The list of applications involved in this project:

- [NodeGoat v1.3.0](https://github.com/OWASP/NodeGoat/tree/v1.3)
- [Keystone v4.0.0](https://github.com/keystonejs/keystone-classic/tree/v4.0.0)
- [Juice-Shop v8.3.0](https://github.com/bkimminich/juice-shop/tree/v8.3.0)
- [Mongo-express v0.51.0](https://github.com/mongo-express/mongo-express/tree/v0.51.0)
- [Apostrophe boilerplate](https://github.com/apostrophecms/apostrophe-boilerplate)

## Presequisites
The docker images are built and tested using:
- Docker version 18.09.1-ol, build b2a1f2a
- docker-compose version 1.27.4, build 40524192

All the docker-compose.yml files are at version "2.0". 
For the docker-compose version support, please see [here](https://docs.docker.com/compose/compose-file/compose-versioning/#version-2)

## Building and pushing docker images to Github registry
First create a personal token on github. Make sure that the token has enough privileges (i.e read,write:packages). Then run docker login.

```
$ docker login docker.pkg.github.com --username <your_username> -p <your_token>
```

Build your image and run docker tag (all names are lowercase)
```
$ docker build -t <image_name>:<tag> .

$ docker tag <image_name>:<tag> docker.pkg.github.com/<user_name>/<repo_name>/<image_name>:<tag>
```

Push the tagged docker image to repo
```
$ docker push docker.pkg.github.com/<user_name>/<repo_name>/<image_name>:<tag>
```

For more information, please see [Github Docs](https://docs.github.com/en/free-pro-team@latest/packages/guides/configuring-docker-for-use-with-github-packages).

## Quick start
Docker-compose provides a quick and easy way to startup the applications.
1. Head to the desired application's directory (for example: `app_docker/nodegoat` for NodeGoat).
2. Run: `docker-compose up`
3. Docker-compose will handle the pulling and running those applications
4. Then you can access the application via browser on localhost. (Please see `README.md` in `app_docker` for more information).

Note: the docker-compose.yml files use the already built Docker images available in this repo's packages. If you want to build the images own your own, the detailed instructions are available in `app_docker`. 

