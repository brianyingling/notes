# Complete Introduction to Containers
## Brian Holt, Frontend Masters
---

## Docker

### Getting Setup with Docker

### Docker Images without Docker
https://btholt.github.io/complete-intro-to-containers/docker-images-without-docker
___
1. Essentially Docker images are just zip files
2. Base layer is an image
3. image - holds the state of a container and puts it together



### Docker Images with Docker
https://btholt.github.io/complete-intro-to-containers/docker-images-with-docker
___
1. `docker run`
    * command that runs Docker containers
    * will pull a Docker image from Docker Hub if Docker cannot find it locally
    * handles the `chroot`ing, namespacing, unsharing, and cgroup setup for you.
2. containers are designed to be ephemeral -- that is they are meant to be spun up and then destroyed. They are not to be meant permanent.
3. `docker run -it alpine:3.10 <optional cmd>`
    * `docker` - the Docker CLI 
    * `run` - runs a Docker container from an image
    * `-it` - opens up an interactive terminal inside the container after running it
    * `alpine:3.10` - the Docker image to run as a container. Here, this is Alpine Linux v.3.10
    * `<optional cmd>` - can include a command to be executed inside the container, e.g. `bash`, `ls`, etc.
4. `docker image prune`
    * This command will remove Docker images.
    * Note that it is very easy to build many images and take up HD space.
5. `docker run -it --detach ubuntu:bionic`
    * `--detach` flag runs the Docker container in the background
6. `docker attach <name>`
    * Attaches the specified Docker image to the currently running process.
7. `docker kill <name>`
    * Kills a Docker container running
8. `docker rm <name>`
    * Removes a Docker container from disk
8. `docker kill <name>`
    * Stops a Docker container that's running, whereas `docker rm` removes it from disk
9. `--rm` flag deletes the docker container after exiting from it


### Node.js on Docker
https://btholt.github.io/complete-intro-to-containers/nodejs-on-docker

1. `docker run -it node:12-stretch`
    * Runs a Node REPL inside of a Debian-based Linux container

### Tags
https://btholt.github.io/complete-intro-to-containers/tags
1. tags - looser version of labeling
2. If a tag is not specified, Docker will automatically pull the Docker image with the latest tag, e.g. `:latest`
3. Some conventions are adopted (using `lts` or `stretch`) but no set rules


### Docker CLI
https://btholt.github.io/complete-intro-to-containers/docker-cli

1. The following will be popular Docker commands used with the CLI.
2. `docker pull`
    * Pulls Docker images from the registry (Docker Hub) to run.
3. `docker inspect`
    * Gives metadata about a given Docker container
4. `docker pause`
    * Freezes a given container and stops all its process trees
5. `docker unpause`
    * Unpauses a container
6. `docker kill`
    * Kills a Docker container running
    * `docker kill $(docker ps -q)` kills all containers currently running
7. Difference between `docker run` and `docker exec`
    * `docker run` - starts a new container
    * `docker exec` - runs a command on an already existing container. So, for example `docker exec foobar ls` runs `ls` on the `foobar` container that already exists and is running
8. `docker history`
    * Shows how a container's image layer composition has changed over time
9. `docker info`
    * Information about the host's computer
10. `docker top`
    * View all of the processes happening within a container
11. `docker ps --all`
    * show all of the Docker containers you've stopped as well as those running
12. `docker rm`
    * Removes the container
13. `docker rmi`
    * Removes the image
13. `docker container prune`
    * Removes all images
14. `docker image list`
    * Shows all Docker images
15. `docker restart`
    * Restarts the container
16. `docker search`
    * Searches for a particular container off of Docker Hub



