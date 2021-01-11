## Setup OWASP ZAP (v2.9)

Have an docker image available. \
To be able to scan, interact with the Nodejs application, they should be in the same docker network

For example, if the Nodejs app is running in my_network. We ran this command for ZAP:

``` 
docker run --net <app_network> -u zap -p 8080:8080 -p 8090:8090 -i owasp/zap2docker-stable:2.9.0 zap-webswing.sh
```

Substitute `<app_network>` with the Docker network which the Node.js application is running on.

Then on your browser, head to http://localhost:8080/zap 

[ZAP Docker web UI guide](https://www.zaproxy.org/docs/docker/webswing/)