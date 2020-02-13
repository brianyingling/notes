# Building Optimized Containers for Kubernetes
https://www.digitalocean.com/community/tutorials/building-optimized-containers-for-kubernetes
___

## Introduction
1. Container images - primary packaging format for defining apps in k8s
2. Introducing strategies for creating high quality images and goals for making decisions when containerizing apps

## Characteristics of Efficient Container Images
1. Some questions to ask:
    * What makes a good container image?
    * What are the goals when designing a new image?
    * What are the most important characteristics and behavior for an image?
2. qualities to aim for:
    * A single, well-defined purpose
        * Don't think of containers as VMs
        * Think more like Unix utilities in doing 1 small thing well
    * Generic design with the ability to inject config at runtime
        * Design with reuse in mind
    * Small image size
        * downloads quickly
        * smaller set of installed packages
    * externally manage state
        * store data outside the container to prevent loss
    * Easy to understand
        * Keep them as simple as possible
    * Follow containerized software best practices
        * Aim to work with the container model instead of against it.
        * Log to stdout so k8s can expose the data
    * Fully leverage k8s features
        * provide endpoints for liveness and readiness checks

## Reuse Minimal, Shared Base Layers
1. Use base or stratch (image wo filesystem or utilities)
2. Good idea to try to reuse the same parent for each image

## Managing Container Layers
1. Docker creates a new layer every time it executes a `RUN`, `COPY`, or `ADD` instruction
2. These operations are cached and if they exist previously without change, Docker uses the cached layer
3. Using Multi-Stage Builds
    * Allows users to divide your Dockerfile into multiple sections
    each with a `FROM` statement

## Scoping Functionality at the Container and Pod Level
1. Containerizing by Function
    * Good practice to package each piece of independent functionality into its own separate container image
    * Containers are lightweight abstractions; this is unlike VMs, where resources are generally grouped together to reduce use of OS resources
    * Advantages:
        * Each container can be developed independently
        * Each container can be scaled independently
2. Combining Container Images in Pods
    * Pods 
        * smallest unit that can be managed by the control plane
        * Consist of one or more containers
        * Containers within a pod are always scheduled on the same worker node
        * Become less flexible when too much functionality is bundled in them

## Designing for Runtime Configuration
1. Use ConfigMaps and Secrets

## Treating Containers Like Applications, not Services
1. 

