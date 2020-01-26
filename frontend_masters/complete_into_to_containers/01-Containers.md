# Complete Introduction to Containers
## Brian Holt, Frontend Masters
---

## Containers

#### What are Containers?
---
##### History
1. Bare Metal
    * Needed to work with physical servers, hardware, datacenters, temperatures, etc.
    * Pros
        * Allows for greatest amount of control
    * Cons
        * Expensive - need to support physical hardware, locations, and the personnel needed to support them
        * Have to worry about physical capacity - RAM, CPU, storage, etc.

2. Virtual Machines
    * One physical server containing multiple OSes running concurrently.
    * Pros
        * Can scale up and down within our own capacity
        * OS within an OS provides security and resources are allocated for each guest OS
    * Cons
        * Still need to worry about hardware
        * Running an OS within an OS is inefficient

#### Public Cloud
---
1. Cloud providers include AWS, Azure, Google Cloud Provider
2. No need to worry about physical hardware and maintaining datacenters; the cloud provider handles this
3. Some tooling include Terraform, Chef, Puppet and Salt
4. Provisioning involves creating instances, downloading code and updating software
5. We're still running an entire guest OS inside a host OS, which is inefficent.

#### Containers
____
1. Lighter-weight and secure
2. VMs are considered lighter than bare metal and containers are lighter than traditional VMs.
3. Containers involve isolating a section of the filesystem, establishing that in an image, and the host OS is executing and managing that.
4. Multiple containers can run in one host OS but are isolated from one another.

#### 3 Kernel Commands Essential to Creating Containers
____
1. Commands are:
    1. chroot - limits access to the filesystem by container
    2. namespaces - limits processes by container
    3. cgroups - limits physical resources (CPU, RAM, etc.) by container
2. `chroot`
    * *Nix command that 'changes root' on a process to a different directory in the filesystem
    * The process can only see the directory that is declared as root; executables, kernel commands, anything that exists outside of the new root is not visible inside that process and would need to be incluced. 
    * Also known as 'jailed' - the root has been changed and cannot be seen outside of root (otherwise it wouldn't be root)
    * We went through examples where we needed to copy basic kernel commands (`cat`, `ls`) to use them in the newly-changed root
3. Namespaces
    * Without namespaces, users using `chroot` can still see processes outside of their changed root
    * This can lead to users affecting other users' processes, potentially killing them.
    * `debootstrap`
        * To install run: 
        `apt-get debootstrap -y`
        * this tool allows users to set up a `chroot` environment without copying commands from the kernel ass we did in the previous exercises
        * Minimal Debian-based environemnt that can be `chroot`ed
    * Host OS can still see child OS's processes but the child OS cannot see host OS's processes
4. cgroups (control groups)
    * Limits physical resources to a given group. Resources such as CPU, RAM, network bandwidth, etc.
    * Prevents one container from demanding all of resources from a physical server and preventing other containers from utilizing those resources
    * `cgcreate` - creates a new group
5. To Summarize:
    * At its core, Docker is:
        * `chroot` - limiting filesystems
        * namespaces - limiting processes and capabilities
        * cgroups - limiting hardware resources





