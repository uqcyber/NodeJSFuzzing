#### Copyright (c) 2020, 2021, Oracle and/or its affiliates.
#### Contributor: Trong Nhan Mai
---
# Build and Run Fuzzers in Docker containers

## OWASP ZAP (v2.9) - Docker image available in Docker Hub
To be able to interact with the Node.js application, they should be added to the same network as the application.

To start OWASP ZAP with Web UI, run:

``` 
$ docker run --net <app_network> -u zap -p 8080:8080 -p 8090:8090 -i owasp/zap2docker-stable:2.9.0 zap-webswing.sh
```

Substitute `<app_network>` with the Docker network in which the Node.js application is running.

Then on your browser, head to http://localhost:8080/zap 

[ZAP Docker web UI guide](https://www.zaproxy.org/docs/docker/webswing/)