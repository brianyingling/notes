# An Introduction to Kubernetes
https://www.digitalocean.com/community/tutorials/an-introduction-to-kubernetes
___

## Introduction 
1. Kubernetes - a platform for managing containerized applications in a clustered environment.
2. This guide covers basic concepts of the architecture, and the model used for handling deployments and scaling.

## What is Kubernetes?
1. def. - a system for running and coordinating containerized applications in a cluster.
2. Manages the lifecycle of containerized apps.
3. Provides predictability, scalability, and high availability.
4. Actions:
    * Can scale services
    * Perform graceful rolling updates
    * Switch traffic between different versions of software.

## Kubernetes Architecture
1. System built in layers, where each layer is abstracted from lower levels
2. Cluster
    * Brings together virtual or physical services in a shared network with communication with each other.
    * This is where all of K8s (Kubernetes abbreviation) is configured.
3. Master
    * The "gateway" or the brain fro the cluster
    * Exposes an API for users and clusters to communicate with the cluster's components
    * Health checks the other servers
    * Performs scheduling (how to split up and abstract work)
    * Orchestrating communication between other components
    * Is the primary point of contact with the cluster
4. Nodes
    * Servers responsible for receiving and running workloads
    * Apps / servers are run in containers, so a container runtime is needed for each app.
    * Receives instructions from the master server.
    * Can create or destroy containers, adjust networking rules, and forward traffic.
5. Declarative Plan
    * Submitted in either JSON or YAML.
    * Defines what to create and how it is managed.
    * Master server takes the plan and figures out how to run it on the cluster

## Master Server Components
1. Primary control plane for the cluster
2. Users interact with master
3. Responsibilities:
    * Accept user requests
    * Best way to schedule containers
    * Authenticate clients and nodes
    * Adjust cluster-wide networking
    * Manages scaling and health checks
4. etcd
    * Lightweight key-value store that can span multiple nodes
    * Configuration data is stored here and accessible by nodes
    * Can be used for service discovery
    * Can help components configure themselves
    * requirement: must be network-accessible to each of the nodes
5. kube-apiserver
    * API server that allows a user to configure K8s workloads & organizational units
    * Ensures etcd store and service details of each container are in agreement.
    * Acts as a bridge between various components to maintain cluster health
    * Implements a RESTful interface
    * `kubectl` - K8s CLI
6. kube-controller-manager
    * General service with many responsibilities:
        * Managed different containers that regulate cluster state.
        * Manage workload lifecycles
        * Perform routine tasks
    * Uses API server to watch for changes on etcd
    * When detecting a change, the controller reads new info and implement the procedure. Can involve scaling apps up  and down, and adjusting endpoints
7. kube-scheduler
    * Assigns workloads to specific nodes in the cluster
    * Reads workloads, requirements, analyzes the environment, and places work on (an) acceptable node(s)
    * Responsible for tracking capacity on each host. Must know the total capacity as well as the resources already allocated.f
8. cloud-controller-manager
    * Maps K8s generic representation of ressources to actual resources provided by a specific cloud provideer.
    * Acts as the glue between K8s and providers while maintaining generic constructs.

## Node Server Components
1. nodes - servers that perform work by running containers
2. requirements for a node:
    * A container runtime
        * Responsible for starting and managing containers
        * Each unit of work is basically implemented as a container that needs to be deployed
    * A kubelet:
        * def. - a contact point for each node in the cluster.
        * Responsible for relaying info to and from the control pane services
        * Responsible for interacting with the etcd store to read/write config values
        * Communicates with master components to authenticate and receive work:
            * work - received as a manifest and defines the workload and operating parameters
            * responsible for maintaining the state of work
        * Controls the state of the container runtime.
    * a kube-proxy
        * proxy server:
            * manages individual host subnetting
            * Makes services available to other components
        * forwards requests to the right containers
        * does basic load balancing
        * makes sure network is predictable and isolated

## Kubernetes Objects and Workloads
1. Users do not interact with containers directly; they interact with instances made up of primitives in the K8s Object Model.
2. Pods
    * The most basic unit of K8s.
    * One or more containers are encapsulated in a pod.
    * pod - 1+ containers that should be controlled as a single application
    * Managed as a unit - shares environment, volumes, IP space
    * Best think of a pod as a single monolithic application.
    * A pod's composition:
        * Main container that satisfies the general purpose of the workload
        * Helper container that facilitates closely related tasks
    * Horizontal scaling is discouraged at the pod level; other higher level objects are more suited.
    * Users should not manage pods directly.
3. Replication Controllers and Replication Sets
    * Users will be working with groups of identical, replicated pods
    * Pods created by pod templates and are horizontally scaled by replication controllers and sets
    * Replication Controllers
        * def - Object that defines a pod template and control parameters to horizontally scale identical replicas of pods.
        * Can scale by increasing or decreasing number of running copies
        * Replication controllers' config has a template for pod definitions
        * Responsible for ensuring # of pods deployed match # specified in its config
        * Controller will start new pods if pods fail
        * Will spin up or kill pods if # in the config changes
        * Can also perform rolling updates
4. Replication Sets
    * Beginning to replace replication controllers
    * Has greater flexibility in how controllers identify pods
    * Cannot do rolling updates
    * Mean to be used insde of higher level units
5. Deployments
    * One of the most common components to create and manage
    * use replication sets as a building block with flexible lifecycle management
    * Solves many pain points that existed with replication controllers and rolling updates
    * Designed to ease lifecycle management of replicated pods
    * Easily change config and K8s will:
        * Adjust replication sets
        * Manage transition between app versions
        * Maintain history with undo capabilities
    * Users will work with these frequently
6. Stateful Sets
    * Specialized pod containers that have ordering and uniqueness guarantees
    * Often associated with data-oriented applications like databases.
    * Provided a stable network ID that will persist even if the pod needs to move to another node
    * Persistent storage volumes can also be transferred with a pod
    * Volumes will still exist even if the pod is deleted
7. Daemon Sets
    * Specialized pod containers that run a copy of a pod on each node in the cluster.
    * Help in performing maintenance
    * Logs and metrics are good use cases for daemon sets
7. Jobs and Cron Jobs
    * Workloads that have a shorter lifecycle where they have a more task-based workflow and exit after they are done.
    * Good for batch processing
    * cron jobs
        * Jobs with a scheduling component
        * Reimplementation of the classic cron behavior with the cluster as the platform

## Other Kubernetes Components
1. Services
    * Component that can act as a load balancer
    * Acts as an "ambassador" for pods
    * Groups together logical collections of pods that perform the same function and are treated as a single entity
    * Keeps track of and routes to the backend containers
    * Consumers only need to know the service's stable endpoint
    * Service allows backend work units to be scaled or replaced without affecting the cluster.
    * Service's IP address remains stable
    * Any of the pods need to be accessed by another app, then build a service
    * 2 Strategies:
        * NodePort - static port is opened up on each node's external interface
        * LoadBalancer 
2. Volumes and Persistent Volumes
    * K8s volumes abstracts allowing data to be shared by all containers in a pod
    * Data remains available until the pod terminates
    * Not a good solution for persistent data
    * Persistent Volumes:
        * More robust storage not tied to a pod lifecycle
        * Once a pod is done, the volume's reclamation policy determines whether it is destroyed or kept around.
3. Labels and Annotations
    * Label - semantic tag that can be attached to a K8s object to indicate they are part of a larger group
        * key-value pair
    * Annotations
        * Free-form key-value pair similar to labels
        



