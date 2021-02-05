# Build Application Docker images
This guide shows how the application's Docker image can be built from the source code to run with docker-compose. The necessary files for each application can be found here. These files will replace the original files in the cloned repo.

## Step 1:
Clone the source repo of the desired application.

## Step 2:
Put the `express-instrument-app` folder inside the root directory of the cloned repo. This folder contains the code coverage plugin to be integrated with the application. 

## Step 3:
Replace the files in the source code repo with the ones in this directory. 

`package*.json`, `Dockerfile` and `docker-compose.yml` are located at the root directory in the source repo. 

Note: 
- *For Keystone v4.0.0*, `server.js` is located at `<keystone_source>/test/e2e`
- *For apostrophe boilerplate*, `app.js` is located at root directory.
- *For mongo-express*, `app.js` is located at root directory.

## Step 4: 
In the root directory of the source repo, where all the files have been replaced, build the image with:
```
$ docker build --tag <image_name>:<version> .
```

Note: For docker-compose to run the newly built image, replace the `image` field in `docker-compose.yml` with `<image_name>:<version>`.
