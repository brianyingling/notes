# Modernizing Applications for Kubernetes
https://www.digitalocean.com/community/tutorials/modernizing-applications-for-kubernetes
___

## Introduction
1. Modern stateless applications are:
    * built and designed to run in containers and managed in container clusters.
    * Developed using Cloud Native and 12 Factor principles
    * designed to minimize manual intervention and maximize portability and redundancy
2. In this guide we will discuss:
    * high-level steps for modernizing applications for a K8s cluster
    * focus is on stateless applications where persistent data is offloaded to an external data store.
    * functionality k8s provides for managing and scaling stateless apps

## Preparing the Application for Migration
1. Implement app-level changes that maximizes app's portability and observability for k8s.
2. k8s is highly automatable so the appropriate app logic to communicate with the container orchestrator needs to be buil.

### Extract Configuration Data
1. Extract config data from application code
2. Configuration can consist of anything that can vary across deployments and environments:
    * service endpoints
    * database addresses
    * credentials
    * other parameters and options
3. Example: staging and prod environments each have their own databases endpoints:
    * they should not exist in app logic
    * should exist as env variables, external key-value store, or a local file
    * values are extracted from the source and fed into the app
4. Allows for the application to be a generic, portable package that can be deployed in many environments with the configuration data injected into it

### Offload Application State
1. Persistent state should not be stored in the application locally; otherwise it cannot horizontally scale
2. Application should be designed with the sense that any one of its pods can fail and be restarted. To do this, the data must be stored elsewhere
3. Session data should be moved to an external data store like Redis
4. Whereever possible, any app state should be offloaded to services like managed dbs or caches
5. Stateful apps:
    * k8s has built-in features for attaching permanent block storage volumes to containers and Pods
    * StatefulSet workload
6. Stateless containers allow k8s scheduler to quickly scale up and down your app, and launch pods when resources are available
7. If you don't require the StatefulSet workload, you should use the Deployment worklaod
8. Consult the k8s White Paper for more on stateless architectures and Cloud Native microservices: http://assets.digitalocean.com/white-papers/running-digitalocean-kubernetes.pdf

### Implement Health Checks
1. k8s will restart/reschedule containers not deemed "healthy"
2. If your app is deadlocked and is unable to perform any meaningful work but is still running, k8s will keep the container alive
3. Types of health checks
    * readiness probe - lets k8s know when your app can receive traffic
    * liveness probe - lets k8s know when your app is healthy and running
4. Kubelet Node agent performs these probes on running Pods using 3 different methods:
    * HTTP: performs an HTTP GET request against an endpoint like `/health` and gets a response status between 200 and 399
    * Container Command: Kubelet probe executes a command inside of the running container. If exit code is 0, it succeeds
    * TCP: Kubelet probe attempts to connect to your container on a specified port. If it can it succeeds
5. You choose the type of health check depending on the application, language, and framework
6. Should allocate planning for what "healthy" and "ready" mean for your particular app, as well as dev time for testing the endpoints
7. K8s documentation on liveness and readiness probes:
https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/

### Instrument Code for Logging and Monitoring
1. Telemetry and logging data is necessary for monitoring and debugging app performance
2. Prometheus - open source systems monitoring and alerting toolkit
    * many client libraries for instrumenting your code with many different metric types for counting events and durations
3. RED method
    * helpful when designing app's instrumentation
    * Rate - # of requests received by your application
    * Errors - # of errors emitted by your application
    * Duration - amount of time it takes your app to serve a respones
4. Signals to measure for app monitoring: 
https://landing.google.com/sre/sre-book/chapters/monitoring-distributed-systems/#xref_monitoring_golden-signals
5. How will your app log in a distributed cluster-based environment
    * Remove hardcoded config references to local log files
    * Log directly to stdout and stderr
    * Treat logs as a continuous event stream, a sequence of time-ordered events
    * Stream can be captured by the container and can be forwarded to a logging layer like the ELK stack (Elasticsearch, Fluentd, Kibana)

###  Build Administration Logic into API
1. Create API endpoints for admin purposes (flushing queues, clearing caches) without having to restart containers
2. Containers should be treated as immutable objects
3. Manual admin should be avoided in a prod env

### Summary
1. We discussed app-level changes before containerizing your app and moving to k8s.
2. Reference: https://www.digitalocean.com/community/tutorials/architecting-applications-for-kubernetes


## Containerizing Your Application
1. Time to package your app in a container now!
2. We're using Docker here but you can use your own

### Explicitly Declare Dependencies
1. Be sure to version every piece of software on the image
2. Avoid `latest` tags and unversioned packages because these can change and break your application
3. May want to create a private registry or private mirror of a public registry to exert more control over image versioning
4. How to create a private registry: https://docs.docker.com/registry/deploying/

### Keep Image Sizes Small
1. Large images can slow things down
2. Benefits to packaging a minimal set of tools and app files:
    * Reduce image sizes
    * Speed up image builds
    * Reduce container start lag
    * Speed up image transfer times
    * Improve security by reducing attack surface
3. Steps to take:
    * Use a minimal base OS image like `alpine` or build from `scratch`
    * Clean up unnecessary files and artifacts
    * Use separate 'build' and 'runtime' containers to keep prod app containers small
    * Ignore unnecessary build artifacts when copying in large directories
4. More info on optimizing Docker containers: https://www.digitalocean.com/community/tutorials/building-optimized-containers-for-kubernetes

### Inject Configuration
Options for injecting config data:
1. Specify environment variables in the Dockerfile using `ENV`
2. Can pass in env variables as parameters when starting a container using `docker run` and `-e`:
    * `docker run -e MYSQL_USER='my_db_user' IMAGE[:TAG]`
3. Can use an env file that contains a list of environment variables and their values. Use `--env-file` flag:
    * `docker run --env-file var_list IMAGE[:TAG]`
4. For K8s, should further externalize config from the image and use K8s built in `ConfigMap` and `Secrets` objects
    * Allows you to separate config from image manifests
    * Can version these separately from your application

### Publish Image to a Registry
1. Upload your app image to a container image registry like Docker Hub
2. Private registries allow you to publish your internal app images without exposing them to the wider world
3. Private registry options:
    * Quay.io
    * Paid Docker Hub plans
4. Registries can integrate with GitHub so that when a Dockerfile is updated and pushed, the registry service will automatically pull the new Dockerfile, build the image, and make the image available

### Implement a Build Pipeline
1. Manually building, testing, and deploying images to prod does not scale well
2. Core functions of a Build Pipeline:
    * Watch source code repos for changes
    * Run smoke and unit tests on modified code
    * Build container images containing modified code
    * Run further integration tests using build container images
    * If tests pass, tag and publish to registry
    * OPTIONAL: in continuous deployment setups, Update K8s Deployments and roll out images to staging/production clusters
3. Many paid CI products that have built-in integrations with popular version control services like GitHub and image registries like Docker Hub
4. Can also use Jenkins: https://www.digitalocean.com/community/tutorials/how-to-set-up-continuous-integration-pipelines-in-jenkins-on-ubuntu-16-04

### Implement Container Logging and Monitoring
1. Multiple container-level patterns for logging, multiple k8s-level patterns
2. `json-file` Docker logging driver
    * In k8s, containers use this by default
    * Captures stdout and stderr streams and writes them to JSON files on the Node where the container is running
3. Sidecar container
    * paired with the primary app container
    * picks up logs from the filesystem, a local socket, or systemd journal
    * Can do some processing and stream them to stdout/stderr or to a logging backend
4. For simple microservices, logging to stdout/stderr is recommended because you can use `kubectl logs` to access log streams
5. Monitoring:
    * `docker stats` - grabs CPU and memory usage for running containers
    * cAdvisor (installed on k8s by default) has more advanced features
    * Use Prometheus, Grafana in a multi-node, multi-container prod env

### Summary
1. We discussed best practices for:
    * building containers
    * setting up CI/CD and image registry
    * considerations for increasing observability into containers
2. For optimizing containerss: https://www.digitalocean.com/community/tutorials/building-optimized-containers-for-kubernetes
3. For CI/CD:
    * https://www.digitalocean.com/community/tutorials/an-introduction-to-continuous-integration-delivery-and-deployment
    * https://www.digitalocean.com/community/tutorials/an-introduction-to-ci-cd-best-practices


## Deploying on Kubernetes

### Write Deployment and Pod Configuration Files
1. Pod - smallest deployable unit in K8s
1. Pod consists of:
    * application container
    * possibly sidecar containers for monitoring or logging
    * possibly init containers running setup scripts
2. Containers in a pod share:
    * storage resources
    * network namespace
    * port space
    * localhost
    * data using mounted volumes
3. Pods rolled out using deployments
    * deployments - controllers defined by YAML files declaring some state
    * Control plane gradually brings the actual state of the cluster to match the desired state.
        * It schedules containers on nodes as required
    * To scale the number of app replicas running:
            * Update the `replicas` field in the Deployment config file
            * Run `kubectl apply` against the config file
    * More about:
        * pods: https://kubernetes.io/docs/concepts/workloads/pods/pod/
        * deployments: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/

### Configure Pod Storage
1. K8s Pod Storage Types:
    * Volumes
    * Persistent Volumes (PVs)
    * Persistent Volume Claims (PVCs)
2. Volumes
    * Lifecycle of a volume is tied to the pod, not the container
    * If a container dies, the Volume persists and the new container will be able to mount the same volume
    * if a pod restarts or dies, its Volumes also disappear
3. PersistentVolume (PV)
    * Preserves data across pod restarts and updates
    * Abstractions representing persistent storage like cloud block storage volumes or NFS storage
    * If your app requires one volume per replica, you should not use Deployments but StatefulSet controllers
        * StatefulSets - designed for stable network ids, stable persistent storage and ordering guarantees
        * Deployments - use for stateless apps
    * StatefulSets documentation: https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/
    * PVs and PVCs: https://kubernetes.io/docs/concepts/storage/persistent-volumes/

### Injecting Configuration Data with Kubernetes
1. `env` and `envFrom` fields available for setting env variables in pod configuration files
2. This allows you to move config out of Dockerfiles and into Pod and Deployment config files
3. Can modify values in K8s Pod and Deployment configurations without rebuilding
4. Other constructs for configs: ConfigMaps and Secrets

### ConfigMaps and Secrets
1. ConfigMaps
    * allows you to save config data as objects referenced in Pod and Deployment configuration files
    * can pull from config files using `--from-file` flag
2. More about ConfigMaps and Secrets: https://kubernetes.io/docs/concepts/configuration/

### Create Services
1. Once app is up and running, every Pod is assigned an IP address shared by its containers
2. If the pod is removed or dies, a newly-started Pod will get a different IP address
3. K8s Service:
    * provides access to an identical set of pods performing the same functionality
    * 1 Stable IP address for accessing the set of pods
4. 4 Types of K8s:
    * `ClusterIP`
        * default type, grants service a stable internal IP accessible anywhere within the cluster
    * `NodePort`
        * Exposes the service on each Node at a static port between  30000-32767
        * When the request hits the Node at its Node IP address and the NodePort, it will be load balanced and routed to the app containers
    * `LoadBalancer`
        * Creates a load balancer using your cloud provider's load balancing product
        * Also configures a `NodePort` and `ClusterIP` for your Service to where external requests will be routed
    * `ExternalName`
        * Maps a K8s service to a DNS record
        * Can be used for accessing external services using K8s DNS
5. Creating a `LoadBalancer` Service for each Deployment will create a new cloud-based load balancer and can become costly
6. Alternative to LoadBalancer: can use an Ingress controller
7. Popular Ingress Controller: Nginx Ingress Controller:https://github.com/kubernetes/ingress-nginx
8. More on ingress controllers: https://kubernetes.io/docs/concepts/services-networking/ingress/

### Logging and Monitoring
1. Should implement centralized logging because using `kubectl logs` and `docker logs` on individual pods is tedious
2. consists of agents running on all worker nodes, enrich them with metadata and forward logs to a backend like ElasticSearch. Logs can then be visualized, filtered, and organized using Kibana
3. Can log to stdout/stderr, use sidecar containers, or use logging agents directly in Pods (can become resource-intensive)
4. More information on logging architecture and tradeoffs:https://kubernetes.io/docs/concepts/cluster-administration/logging/
5. Example logging agents: Filebeat, Fluentd
6. K8s creates JSON logging files for containers on the Node (found in `/var/lib/docker/containers/`)
7. Node logging agent should be run as a DaemonSet Controller
    *DaemonSet - ensures that every Node runs a copy of the DaemonSet Pod
8. Cluster and app-level monitoring can be setup using Prometheus monitoring system / time-series database and Grafana metrics dashboard
9. Prometheus
    * works on a 'pull' model by scraping HTTP endpoints (like /metrics/cadvisor or /metrics API)
    * Can then be analyzed and visualized using Grafana dashboard
    * Prometheus and Grafana can be launched into a cluster like any other Deployment and Service

## Conclusion
1. Migrating and monitoring an app so that it runs on k8s involves some planning and architecting
2. Once done it allows new versions to be deployed and scaled as necessary
3. Steps:
    * externalizing config
    * setting up loging and metrics
    * configuring health checks
    * stateless app