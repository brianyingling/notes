# Complete Introduction to Containers
## Brian Holt, Frontend Masters
---

## Multi Container Projects

### Docker Compose
https://btholt.github.io/complete-intro-to-containers/docker-compose
___

1. Docker Compose - extremely useful for dev environments
2. What does Docker Compose do?
    * Here are all the containers, here's how they talk to each other, spin them up for me.
    * it uses one configuration file - docker-compose.yml
3. `docker-compose up` - runs docker compose
4. CAN be used in prod IF there's just one host, but chances are there's not.
5. Kubernetes is much better suited for horizontally scaling containers
6. Docker Compose is useful for CI/CD pipelines 



### Docker Compose and nodemon
https://btholt.github.io/complete-intro-to-containers/docker-compose
___

1. Let's make this a nicer dev experience
2. `nodemon` - watches js files and restarts the Node server if those files change.
3. `docker-compose up --build`
    * forces a build of those containers before instantiating them.
4. `docker-compose up --scale web=10`
    * Scaling the web services up to 10 instances
    * Really need a load balancer here because in this case we're manually binding the containers to ports and docker-compose will error.

### Kubernetes Fundamentals
https://btholt.github.io/complete-intro-to-containers/kubernetes
___
1. Kubernetes - a container orchestration tool
    * manages large, complicated clusters of containers to multiple different hosts
    * There's a lot to Kubernetes
    * Scales containers well
    * Good at checking the health of containers
2. Fundamental concepts
    * master - "the brain", or it controls everything
        * Azure, GCP, do not charge for the master; AWS does
        * We talk to the master
    * nodes
        * worker endpoints
        * talks to master
        * some may have just 1 container, but can have more.
        * Node is just a deploy target
        * unimportant as to what it is, if it's a physical device or not, so long as it can accept containers
    * pod 
        * deployment unit that cannot be separated
        * Example: say a password service and a user service depend on each other; that's a pod.
        * considered atomic but can be made up of multiple containers
    * service
        * a group of pods that make up one service.
        * a reliable pod that services can rely on to talk to it, since pods are always scaling up and down.
    * deployment
        * describes the state of your pods and K8s works to get it in that state
3. kubectl - CLI used to interact with Kubernetes

### Kompose
https://btholt.github.io/complete-intro-to-containers/kompose
___

1. Kompose - conversion tool to go from Docker Compose to Kubernetes
2. Brian Holt uses this frequently and would rather initially begin with Docker Compose and then convert
3. Takes a `docker-compose.yml` file and turns into a K8s configuration.
4. Kompose requires reading from a container registry (e.g. Docker Hub) rather than building files locally so you will have to do do that.
5. AWS and Azure ahve low-level services like `LoadBalancer` but it isn't cheap -- its better to put nginx as a load balancer in front of it.
6. Run `kubectl` on port 8080 - Kompose expets it to be running. Leave this in the background:
    `kubectl proxy --port=8080 &`


### OCI - Open Container Initiative
https://btholt.github.io/complete-intro-to-containers/buildah
___

1. Buildah
    * Docker alternative
    * only works with Linux
    * interchangeable with Docker - build with Buildah, then run with Docker and vice versa
2. Buildah & Docker
    * Buildah knows how to run Dockerfiles
3. Podman
    * Runs containers
    * Need to specify a cgroup-manager whereas Docker does this for you under the hood.

### Wrapping Up
___

1. Things that were useful
    * How to make a shareable container
    * How to integrate with VS Code
    * how to spin up a container
    * How to use multi-stage containers with Docker Compose and Kubernetes
2. Tech We Didn't Talk About Centered Around Containers
    * AWS Fargate
    * Visual Studio Online
    * Google Cloud Run
    * Basically these technologies take the containers and manages them for your serverless containers
3. Ecosystem
    * More Docker alternatives
        `lxc`, `lxd`, `rkt`
    * Other Orchestration systems
        * Docker Swarm (simpler than K8s, but less powerful)
        * Apache Mesos
        * Hashicorp Nomad
4. Questions
    * What's the difference between CMD and RUN? 
        * RUN - runs a buildtime, can have many RUN statements in a Dockerfile
        * CMD - runs at runtime, can only have 1 CMD statement in a Dockerfile
    * Can we use Docker with Gatsby?
        * Yes, and there's probably already a container for it
    * Best way to monitor containers?
        * There's always New Relic and other tools, but your cloud provider should have some tools






