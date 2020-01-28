# Complete Introduction to Containers
## Brian Holt, Frontend Masters
---

## Features In Docker

### Bind Mounts
https://btholt.github.io/complete-intro-to-containers/bind-mounts
___

1. Concept: How can we have persistent storage between runs of a container.
2. No "Snowflakes" -- that is fragile servers that are established with specific properties that if the server disappears or crashes, that setup disappears and it will take time re-establish it.
3. Containers are advantageous because they are designed to be ephemeral - they can be spun up and shut down.
4. Not everything can fit in containers -- namely applications that require state, such as databases.
6. What are bind mounts?
    * Portals to the host OS from the container
    * Directories and files on the host OS that can be accessible from the container
    * Both the host OS and the container are bound -- changes within the bound host's directory appear in the container and vice versa.

example command: This command runs nginx and copies whatever is in the current directory you're in into nginx and runs it -- no Dockerfile involved here
```# from the root directory of your CRA app
docker run --mount type=bind,source="$(pwd)"/build,target=/usr/share/nginx/html -p 8080:80 nginx
```

### Volumes
https://btholt.github.io/complete-intro-to-containers/volumes
___

1. Difference between Volumes and bind mounts:
    * bind mounts - files exist on the host computer and are exposed to the container
    * volume - Docker manages the relationship for you; the filesystem is not directly exposed to the container.
2. Project:
    * Create a very simple db by writing to the filesystem, then read the file, and return to the user
    * Node file persists a number and adds one to it.
    *  `docker run --env DATA_PATH=/data/num.txt --mount type=volume,src=incrementor-data,target=/data incrementor`
        * `--env` Here we are setting an environment variable that references `/data/num.txt`
        * `--mount` We specify the mount type, the source (name of volume) and the target (where the data will land)
3. Should generally prefer volumes over bind mounts.
4. Common uses cases:
    * logs
    * databases
5. Other types of mounts
    * tmp fs 
        * temporary filesystem
        * good for secrets
    * npipe - used on Windows Docker containers

### Containers & Dev Environment
https://btholt.github.io/complete-intro-to-containers/dev-containers
___

1. Nice to be handed a container that has everything in it so that setting up your environment isn't a chore.

### Dev Containers with VS Code
https://btholt.github.io/complete-intro-to-containers/visual-studio-code
___

1. Use the `Remote - Container` extension
2. Need to add a `.devcontainer` folder and its own Dockerfile
3. VS Code can launch the Docker container on your behalf
4. Uses bind mount under the hood.

### Networks and Docker: MongoDB Container
https://btholt.github.io/complete-intro-to-containers/networking
___

1. `docker network ls`
    * lists the networks Docker containers can use to connect with one another
    * Docker allows you to connect to the bridge network
2. Let's connect to a running MongoDb server and this bridge
3. Running Mongo on Docker talking to another Docker container (with Mongo) on the same network (app-net)
    `docker run -p 3000:3000 --network=app-net --env MONGO_CONNECTION_STRING=mongodb://db:27017 app-with-mongo`
4. Painful! What if there's a tool that can help? There is! Docker Compose.