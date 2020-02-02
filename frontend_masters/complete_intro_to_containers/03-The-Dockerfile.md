# Complete Introduction to Containers
## Brian Holt, Frontend Masters
---

## Dockerfiles Preamble
https://btholt.github.io/complete-intro-to-containers/dockerfile
___

1. Dockerfiles
    * Most common way to build a Docker image (apparently there are other ways -- besides docker-compose?)

2. Dockerfile
    * Docker will read this specific file name to build a container
    * It is a procedural set of instructions Docker will execute
    * Always requires a base container (FROM <base-container>)
    * `CMD` - Running the base Node container will drop the user into the Node REPL, but 
      `CMD` will override the previous base image's `CMD` and run the `CMD` listed in the Dockerfile.
    * Required to only have ONE `CMD` command in a Dockerfile.
    * `CMD` is not required in a Dockerfile but Docker will default to the previous `CMD` declared in the base image.
    * `docker build --tag my-node-app`
        * Docker will cache all layers in the build step.


### Build a NodeJS App
https://btholt.github.io/complete-intro-to-containers/build-a-nodejs-app
___

3. Build a NodeJS App
    * Making a Dockerfile that contains this application and the Node server for us.
    * For each step in the Dockerfile, there's a hashed container that's cached.
    * Docker by default is isolated from the rest of the world; we cannot access the server without opening up and mapping ports.
    * Originally we did not give the Docker container access to the host network
    * Let's give the container access to the host network
    * Sidenote: --init
        * Node doesn't respond to OS-level interruptions, so Docker receives Ctrl-C, passes it to Node, and node ignores it.
        * --init
            * Runs Docker with a module called `Tini` (init backwards).
            * `Tini` will proxy the process and shut it down for you if it receives a Ctrl-C.
    * --publish
        * <base OS port>:<docker container port>
        * Maps an external port to an internal port and exposes the application here.
    * `docker run --init --publish 3000:3000 my-node-app`
        * my-node-app is the docker container we've built and tagged as such.

### Run a NodeJS App
https://btholt.github.io/complete-intro-to-containers/build-a-nodejs-app
___

4. Run a NodeJS App
    * In general, do not run containers as root.
    * We specify a user called `node`. Node containers have a user called `node` baked into the image.
    * Work inside of a Dockerfile should also specify permissions.
    * `ADD` command
        * Similar to `COPY`
        * Extra things:
            * Can download files from the network
            * Can automatically run zipped files
    * `COPY` by default copies files to the root directory of the project
    * `WORKDIR`
        * specifies a directory from which Docker will work and copy files to
        * permissions by default set by root (unless `USER` is changed beforehand)


### Add Dependencies to a NodeJS App
https://btholt.github.io/complete-intro-to-containers/more-complicated-nodejs-app
___

5. Add Dependencies to a NodeJS App
    * Part of the reason why we have Docker is that we can freeze and control our dependencies.
    * CI/CD won't have module dependences because they are not checked in source control (at least they shouldn't be)
    * We need to run `npm install` inside the container
    * `RUN`
        * executes a specified Linux command
    * Use `npm ci` instead of `npm install`
        * `npm ci` will adhere to the dependencies listed in `package-lock.json` (won't `npm i` do this as well??)
        * It's also faster
    * Be prepared to run into permissions issues when working with Docker!
    * Setting the server to `localhost` means it cannot escape the container and its a hard loopback that cannot leave the container -- use "0.0.0.0"

6. `EXPOSE`
    * Docker command callled `EXPOSE` to expose the port
    * Issues when using `EXPOSE`
        * Still need to use a flag at runtime -- `-P`
        * We don't know what port the exposed port is mapped to until we run `docker ps`.

7. Layers
    * Every step in a Dockerfile is a layer that's hashed and cached.
    * Docker will use the cached layer on rebuilds if it didn't change.
    * Can get a stale cache with NPM because packages using the caret ^ won't update, because `package.json` didn't change even though there may be a newer version.
    
8. Docker Ignore
    * .dockerignore - works similarly to .gitignore
    * Lists files Docker should not copy over.
