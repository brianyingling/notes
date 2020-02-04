# Architecting Applications for Kubernetes
https://www.digitalocean.com/community/tutorials/architecting-applications-for-kubernetes
___

## Introduction
1. As system complexity grows, designing and running applications with scalability, portability and robustness is challenging.
2. Following certain patterns and practices in designing apps can help solve some of the most common problems.
3. Tools like Docker and K8s help teams package, deploy and scale software on distributed systems

## Designing for Application Scalability
1. horizontically scale - adjusting the # of identical copies of software to distribute to different machines in order to handle load
2. vertically scale - adjusts the properties of same machines (HD, RAM, CPU, etc.) to handle load
3. microservices - scalable software pattern where small applications communicate over the network that are composed of the larger application
4. Decoupling monolithic applications into microservices enables each piece of the system to be scaled based on demand.
5. Complexity and composition that would normally exist at the application level is now transferred to K8s.
6. cloud native apps - programs that follow a microservices architecture built with resiliency, observability and admin features to adapt to the environment in which it exists.
    * health reporting metrics
    * export telemetry data
    * designed to handle regular restarts and failures

### Following 12 Factor Application Philosophy
1. Core philosophies that exist in a clustered environment
2. 12 Factors:
    * *codebase*: use version control like git
    * *dependencies*: should be managed entirely by the codebase and either part of the code or downloaded via package manager
    * *config*: define parameters in the deployment environment instead of baking them in the codebase
    * *backing services*: resources are network-accessible and connection details are set in configuration
    * *build, release, run*: Build stage should be entirely separate from appliation release stage.
        * Build stage creates an artifact from source code
        * Release stage combines artifact & configuratino
        * Run stage executes the release
    * *processes*: Applications are processes and should not store state locally, state should be offloaded to a backing service
    * *port binding*: Applications should naively bind to a port and listen for connctions
    * *concurrency*: Should be able to run multiple copies of the application concurrently, and allow for scaling without adjusting app code
    * *disposability*: Processes (instances of applications) should be able to start and stop without side effects
    * *dev/prod parity*: Testing, staging, production environments should match closely and be kept in sync. Differences in envs are opportunities for incompatibilities and untested configs to appear
    * *logs*: Apps should stream logs to standard output so external services can decide how best to handle them
    * *admin processes*: One-off admin processes should be run against specific releases and shipped with main process code
3. Following the guidelines above allows for applications to fit with K8s enviromnent

## Containerizing Application Components
1. K8s uses containers to run isolated, packaged apps across its cluster nodes
2. Apps must be containerized and run with a container runtime like Docker
3. Containerization helps enforce the 12 Factors
    * Isolates application environment from external host system
    * Supports a service-oriented approach to inter-application communication
    * Takes config through env variables
    * Encourages process-based concurrency
    * Independently scalable

### Guidelines on Optimizing Containers
1. image building
    * Keep your container images small and composable
    * Small containers take less time to start
    * Separate build steps from the final image
    * Use Docker multi-stage builds
        * Can specifiy one base image for the build
        * Define another image for runtime
    * Base images
        * There are large distros like `ubuntu:16.04`
        * There are minimal base images tagged `scratch`
        * Note minimal images will not have all the tools you may need
        * Alpine Linux - solid, minimal base environment with a tiny Linux distro
    * Interpreted Languages
        * No compilation stage so the interpreter must be available in prod
        * Many language-specific, optimized images exist

## Deciding on Scope for Containers and Pods
1. Pods - smallest unit of abstaction in K8s.
    * def. - a K8s object that contains 1 or more containers
    * containers in a pod share a lifecycle and managed as 1 unit
    * containers in a pod always on same node, share resources like filesystems and IP space
2. Determining effective scope for containers
    * Look for natural development boundaries
        * Containers can represent discrete units of functionality that can be used in different contexts
        * Allows for container to be deployed in different contexts
    * Parts that can benefit from independent management
        * Areas of the system that can be start, stopped, deployed independently
        * Since pods are the smallest unit of work, K8s doesn't allow you to manage containers within the pod independently
        * Don't group together containers that can benefit from separate administration
        * Example: web servers from app servers should be in different pods because each layer can scale independently

### Enhancing Pod Functionality by Bundling Supporting Containers
1. What types of containers should be bundled in a single pod?
    * primary container - responsible for core functions of the pod
    * containers that can extend primary container's functionality
    * Example: Two separate functions
        * container 1 / pod 1 - nginx serving content
        * container 2 / pod 2 - updates static files when a repo changes
        * Both can be used independently
        * Can be maintained by different teams
    * 3 Patterns for Bundling Supporting Containers
        * source: https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45406.pdf
        * Patterns
            * *sidecar*
                * secondary container enhances primary container's functionality
                * example: logs or watches updated config files
            * *ambassador*
                * secondary container to abstract remote resources
                * primary container connects to secondary container
                * secondary container abstracts these resources from primary container
                * Example: connection to a distributed Redis cluster
                * Primary container does not need to know about deployment env to connect to external services
            * *adaptor*
                * Used to translate primary container's data to align with standards expected from external parties.
                * Enable uniform access to centralized services

## Extracting Config into ConfigMaps and Secrets
1. Components should be configurable at runtime to support multiiple contexts
2. 2 K8s ojbects that support runtime config parameters:
    1. ConfigMaps
    2. Secrets
3. ConfigMaps
    * mechanism to store data exposed to pods at runtime
    * Can be environment variables or files on the pod
    * Allows for injecting the values at runtime and can modify app's behavior without rebuilding container images
4. Secrets
    * Similar to ConfigMaps, but used for sensitive data
    * Selectively allows pods to access them
    * Work much in the same way as ConfigMaps
5. Both prevents users from putting config directly in K8s object definitions

## Implementing Readiness and Liveness Probes
1. liveness and readiness probes - tools used to monitor application health
2. liveness probes
    * Determines whether an application within a cluster is actively running
    * k8s will periodically run commands within container to check this; can send HTTP / TCP network requests to determine if the process is available
    * if a liveness probe fails, K8s restarts the container to attempt to restablish functionality
3. readiness probe
    * Determines whether a pod is ready to serve traffic
    * When a readiness probe fails, K8s stops sending requests to the prod temporarily until it finishes its initialization or maintenance routines
4. Both tools allow k8s to automatically restart pods or remove them from backend groups

## Using Deployments to Manage Scale and Availability
1. deployments - compound objects that build on other k8s primitives to add additional capabilities
2. adds lifecycle management capabilities to replicasets
3. Gives replicasets the ability to perform rolling updates and rollback to earlier versions
4. Can help scale out infrastructure, manage availability reqs, automatically restart pods in the event of failure
5. These provide an administrative framework and self-healing capabilities to pods
6. Pods are the workhorses but users should not be manually configuring them; instead let deployments do this

## Creating Services and Ingress Rules to Manage Access to Application Layers
1. Services
    * manages routing information for dynamic pools of pods
    * controls access to various layers of your infrastructure
    * They are specific components that route traffic to pods
    * Can control traffic from both external and internal sources

### Accessing Services Internally
1. clusterIP service
    * can connect to a set of pods using a stable IP address only accessible from within the cluster
    * Any object on the cluster can communicate with the server by sending traffic directly to its IP address
    * Works well for internal application layers

### Exposing Services for Public Consumption
1. *load balancer* service type
    * uses your cloud provider's API to provision a load balancer
    * load balancer serves traffic to the service pods through a public IP address
    * Expensive because k8s creates a load balancer for every service
2. *ingress* objects
    * used to describe how to route different types of requests to different services based on a set of rules
    * example:
        * service a is routed requests for "example.com"
        * service b is routed requests for "sammytheshark.com"
    * determines how to route a mixed stream of requests to their target services based on previously-defined rules
3. *ingress controller*
    * def. - a pod deployed within a cluster that implments the ingress rules and forwards traffic to services
    * currently *ingress* object type is in beta

## Using Declarative Syntax to Manage Kubernetes State
1. Drawbacks to using `kubectl`
    * can imperatively declare ad hoc objects to immediately deploy, which is beneficial for learning k8s
    * does not leave any record of the changes deployed to the cluster
    * makes it difficult to recover in the event of failures
2. Declarative syntax
    * can define resources in text files and then use `kubect` to apply the changes
    * These files can be stored in version control
    * Storing files in version control allows you to maintain a snapshot of your desired cluster state in any given time.

## Conclusion
1. Benefits of k8s and Docker are clearer when development and operations practices align with the concepts the tooling supports
2. Align your architecture with k8s patterns can help alleviate some of the challenges with highly complex deployments