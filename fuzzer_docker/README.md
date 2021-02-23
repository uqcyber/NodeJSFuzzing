#### Copyright (c) 2020, 2021, Oracle and/or its affiliates.
#### Contributor: Trong Nhan Mai
---
# Build and Run Fuzzers in Docker containers

## OWASP ZAP (v2.9)
There is a Docker image available in Docker Hub. To be able to interact with the Node.js application, the image should run in the same network as the application.

To start OWASP ZAP with Web UI, run:

``` 
$ docker run --net <app_network> -u zap -p 8080:8080 -p 8090:8090 -i owasp/zap2docker-stable:2.9.0 zap-webswing.sh
```

Substitute `<app_network>` with the Docker network in which the Node.js application is running.

Then on your browser, head to http://localhost:8080/zap. Please see [ZAP Docker web UI guide](https://www.zaproxy.org/docs/docker/webswing/) for more information.

**To import the configuration:** From the main UI, go to `Analyze` -> `Scan Policy Manager` -> `Import`. Then you can run the scan by using the UI.

**Please update/install these add-ons before configurate the scan policy:**
- Active scan rules (Release) - 37.0.0
- Active scan rules (Beta) - 32.0.0
- Active scan rules (Alpha) - 30.0.0
- Advanced SQL Injection Scanner (Beta) - 13.0.0
- DOM XSS Active Scan rule (Beta) - 9.0.0
- Ajax Spider - 23.2.0

More details on ZAP's add-on can be found [here](https://www.zaproxy.org/addons/).

## Arachni (v1.5.1 with web UI v0.5.12)
To startup the Arachni Docker image (already available in Docker Hub), run:
```
docker run --net <app_network> k -d -p 222:22 -p 7331:7331 -p 9292:9292 --name arachni arachni/arachni:1.5.1
```

The Web UI can be accessed from your browser at http://localhost:9292 

The default credentials when logging into the Web UI: 
1. Administrator account
- E-mail: admin@admin.admin
- Password: administrator

2. Regular user account
- E-mail: user@user.user
- Password: regular_user

The configuration file for Arachni scan are included in [arachni_configs](./arachni_configs). You must import these configuration files via Arahni's Web UI to be able to use them for scanning. 

***To import the profile configuration:*** From the main UI -> `Profile` -> `Import`. After importing the configuration, please modify accordingly (for example, the IP addresses used in the template configuration files are different from your setup).

## W3AF - v2019.1.2
Build from source:
```
git clone <w3af_repo>
cd W3AF
./w3af/extras/docker/docker-build-local.sh 
```

It will build an image from source with the tag `andresriancho/w3af:source`

The `source` version of w3af used in this project is at commit [cd22e52](https://github.com/andresriancho/w3af/commit/cd22e5252243a87aaa6d0ddea47cf58dacfe00a9).

The original workflow of W3AF Docker image is to start it up and use SSH to connect to the running Docker container. However, the scripts to run this workflow in the repo does not work for me. Therefore, I decided to use `docker exec`

This command will start up the W3AF container:
```
docker run --net <app_network> --name <container_name> -it -v ~/.w3af:/root/.w3af:z -v ~/w3af-shared:/root/w3af-shared:z -p 44444:44444 andresriancho/w3af:<source | latest> 
```

The command will startup 2 shared volumes `w3af-shared` and `.w3af`. Instructions on how Docker volumes work can be found here [here](https://docs.docker.com/storage/volumes/#start-a-container-with-a-volume).

When the container is running, one can start up the w3af_console by using:
```
docker exec -it <container_name> python /home/w3af/w3af/w3af_console --no-update
```

Or you can start a bash shell within the container by:
```
docker exec -it <container_name> /bin/bash 
```

The script to start the w3af console (`w3af_console`) is able to read the commands from a script. The scripts that I used to perform the scan in this project are located [here](./w3af_configs). 

To use the scripts, first copy them to the `w3af-shared` directory **in your host machine**. It will allow the `w3af` container to access them. After that, you can run the `w3af_console` with those script:

```
docker exec -it <container_name> python /home/w3af/w3af/w3af_console -s <location_to_script_from_w3af_container> --no-update
```  

Or this command from `bash` within the container:
```
/home/w3af/w3af/w3af_console -s <location_to_script_from_w3af_container> --no-update
```

**Important**: You must update the URLs in those scripts to suit your environment setup (you can check the app container's IP by running `docker network inspect <app_network>`). Please don't run those scripts directly.
