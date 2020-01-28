# Complete Introduction to Containers
## Brian Holt, Frontend Masters
---

## Making Tiny Containers

### Alpine Linux
https://btholt.github.io/complete-intro-to-containers/alpine-linux
___
1. Alpine Linux - a much smaller Linux distro great for containers
2. Base layer is ~5MB
3. Based off of BusyBox
4. Sparse because it is barebones and does not have most of the features of other Linux distros.
5. Container is ~86MB compared to Ubuntu's 900MB.

### Alpine NodeJS Container
https://btholt.github.io/complete-intro-to-containers/making-our-own-alpine-nodejs-container
___
1. Build our own container off of Alpine
2. Use apk - Alpine's package manager
3. Add a node user and group -- do not use root
4. Establish own work directory - WORKDIR


### Multi-stage Builds
https://btholt.github.io/complete-intro-to-containers/multi-stage-builds
___
1. A Dockerfile can contain many builds.
2. Docker can copy the results of one build into another.
3. Dockerfile can have many FROM statements and can copy the results from that FROM build into
another build using COPY's --from flag

### Static Assets Project Exercise
https://btholt.github.io/complete-intro-to-containers/static-assets-project
___
1. We're going to use create-react-app to create a build and copy its output into an nginx build
2. Initialize the Dockerfile with a FROM statement using node:12-stretch, run npm ci && npm run build, then copy its output into an nginx build in nginx's /usr/share/nginx/html folder.
3. We do not want to add our own CMD here because nginx knows how to start itself

### Static Assets Project Solution
https://btholt.github.io/complete-intro-to-containers/static-assets-project