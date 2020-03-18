# AWS Certified Solutions Architect - Associate

## Section 5 - EC2 Storage - EBS and EFS

## What's an EBS Volume?
* An EC2 machine loses its root volume (main drive) when it's manually terminated
* Unexpected terminations might happen from time to time (AWS will email you)
* Sometimes you need a way to store your instance data somewhere
* An EBS (Elastic Block Store) Volume is a network drive you can attach your instances while they run
* It allows your instances to persist data.

## EBS Volume
* It's a network drive (i.e. not a physical drive)
    * It uses the network to communicate the instance, which means there might be some latency
    * Can be detached from an EC2 instance and attached to another one quickly (as long as they're in the same AZ)
* It's locked to an Availability Zone (AZ)
    * An EBS Volume in `us-east-1a` cannot be attached to `us-east-1b`
    * To move a volume across, you first need to snapshot
* Have a provisioned capacity (size in GBs and IOPS)
    * You get billed for all of the provisioned capacity
    * You can increase the capacity of the drive over time

## EBS Volume Example

---- us-east-1a ---
-ec2-       -ec2-       -ec2-
EBS (10GB)  ebs (100GB)
            ebs (50GB)

---- us-east-1b ---
-ec2-       -ec2-      
EBS (10GB)  ebs (50GB)

* EBS volumes are scoped to a *specific AZ*
* We *cannot* attach volumes from `us-east-1a` to instances from `us-east-1b`

## EBS Volume Types
* EBS volumes come in 4 types
    * GP2 (SSD): General Purpose SSD volume that balances price and performance for a wide variety of workloads
    * IO1 (SSD): Highest-performance SSD volume for mission-critical low-latency or high-throughput workloads
    * ST1 (HDD): Low cost HDD volume designed for frequently accessed, throughput-intensive workloads
    * SC1 (HDD): Lowest-cost HDD volume designed for less frequently accessed workloads
* EBS Volumes are characterized in Size | Throughput | IOPS (I/O Operations Per Second)
* When in doubt, always consult the AWS Documentation!
* Only GP2 and IO1 can be used as boot volumes

## EBS Hands On
* `lsblk` command shows all of the attached EBS volumes
* Need to consult the AWS documentation to making an EBS volume available for use on Linux
* Run this command: `sudo file -s /dev/xvdb` -> returns `data`, which means there is no filesystem on the device and we must create one
* To make a filesystem, run this command: `sudo mkfs -t ext4 /dev/xvdb`
* Now we need to mount our directory, say in a data folder. So create a `data` folder: `sudo mkdir /data`
* Now mount the drive to the data folder: `sudo mount /dev/xvdb /data`
* Optionally, you can mount this EBS volume on every single reboot. To do this:
    * We need to add an entry to the `/etc/fstab` file. But first we should back it up:
    * Back up: `sudo cp /etc/fstab /etc/fstab.orig`
    * Edit `etc/fstab` in a text editor: `sudo nano /etc/fstab`
    * Need to add a new line in this format:
        * `device_name    mount_point     file_system_type    some_other_things
        * /dev/xvdb       /data           ext4                defaults,nofail 0 2
    * Verify that our filesystem has been formatted: `sudo file -s /dev/xvdb`
    * unmount /data: `sudo umount /data`
    * `sudo mount -a`: mounts the drive in `/etc/fstab`

## EBS Volume Types Use Cases
* GP2
    * GP2 - recommended for most workloads
    * Can use it as a system boot volumes
    * Virtual desktops
    * Low-latency interactive apps
    * Development and test environments
    * Size: Ranges from 1GB-16TB
    * Small GP2 volumes can burst IOPS to 3000
    * There's a burst aspect to it, like t2 instances
    * Max IOPS is 16000
    * 3 IOPS per GB, so at 5,334GB we are at the max IOPS
* IO1
    * Critical business applications that require sustained IOPS performance, for more than 16000 IOPS per volume (GP2 limit)
    * Large database workloads, such as:
        * MongoDB, Cassandra, Microsoft SQL Server, MySQL, PostgreSQL, Oracle
    * Size range from 4GB-16TB
    * IOPS is provisioned (PIOPS) - MIN 100 - MAX 64,000 (Nitro instances) else MAX 32,000 (other instances)
    * The maximum ratio of provisioned IOPS to requested volume size (in GB) is 50:1
* ST1
    * Streaming workloads requiring consistent, fast throughput at a low price
    * Big Data, Data Warehouses, Log Processing
    * Apache Kafka
    * Cannot be a boot volume
    * 500GB-16TB
    * Max IOPS is 500
    * Max throughput is 500MB/s - can burst
* SC1
    * Throughput-oriented storage for large volumes of data that is infrequently accessed
    * Scenarios where the lowest storage cost is important
    * Cannot be a boot volume
    * 500GB - 16TB
    * Max IOPS is 250
    * Max throughput is 250MB/s - can burst

## EBS - Volume Types Summary
* GP2: General Purpose volumes (cheap)
    * 3 IOPS/GB, min. 100 IOPS, burst to 3000 IOPS, max 16000 IOPS
    * 1GB - 16TB, +1TB = +3000 IOPS
* IO1: Provisioned IOPS (more expensive)
    * Min 100 IOPS, Max 64000 IOPS (Nitro) or 32000 (other)
    * 4GB-16TB. Size of volume and IOPS are independent
* ST1: Throughput Optimized HDD
    * 500GB-16TB, 500MB/s throughput
* SC1: Cold HDD, Infrequently accessed data
    * 250GB-16TB, 250MB/s throughput

## EBS Snapshots
* Incremental - only backup changed blocks
* EBS backups use IO and you shouldn't run them while your application is handling a lot of traffic
* Snapshots will be stored in S3 (but you won't be able to see them)
* Not necessarily needed to detach volume to snapshot, but it is recommended
* Max 100,000 snapshots
* Can copy snapshots across AZ or Region
* Can make image (AMI) from snapshot
* EBS volumes restored by snapshots need to be pre-warmed (using fio or dd command to read the entire volume)
* Can be automated using Amazon Data Lifecycle Manager

## EBS Migration
* EBS volumes are only locked to a specific Availability Zone
* To migrate to a different AZ (or region):
    * Snapshot the volume
    * (optional) Copy the volume to a different region
    * Create a volume from the snapshot in the Availability Zone of your choice

## EBS Encryption
* When you create an encrypted EBS volume, you get the following:
    * Data is at rest encrypted inside the volume
    * All the data in-flight moving between the instance and the volume is encrypted
    * All snapshots are encrypted
    * All volumes created from the snapshot
* Encryption and decryption are handled transparently (you have nothing to do)
* Encryption has a minimal impact on latency (almost nothing)
* EBS Encryption leverages keys from KMS (AES-256)
* Copying an unencrypted snapshot allows encryption
* Snapshots of encrypted volumes are encrypted

## Encryption: Encrypt An Unencrypted EBS Volume
* Create an EBS snapshot of the volume
* Encrypt the EBS snapshot (using copy)
* Create a new EBS volume from the snapshot (volume will also be encrypted)
* Now you can attach the encrypted volume to the original instance

## EBS Volume vs Instance Store
* Some instances do not come with Root EBS volumes
* Instead, they come with "Instance Store" (= ephemeral storage)
* Instance store/ephemeral storage is physically attached to the machine (EBS is a network drive)
* Pros:
    * Better I/O performance
    * Good for buffer / cache / scratch data / temporary content
    * Data survives reboots
* Cons:
    * On stop or termination, data is lost
    * Can't resize the instance store
    * Backups must be operated on the user

## Local EC2 Instance Store
* Physical disk attached to the physical server where your EC2 is
* Very high IOPS (because it's physical!), EBS is limited up to 64000 IOPS whereas here reads/writes can exceed 1 million depending on instance type
* Disks up to 7.5TB, striped to reach 30TB
* Block storage (like EBS)
* Cannot be increased in size
* Risk of data loss if hardware fails

## EBS RAID Options
* EBS is already redundant storage (replicated within an AZ)
* But what if you wanted to increase your IOPS to 100,000 IOPS?
* What if you wanted to mirror your EBS volumes?
* You would mount volumes in parallel in RAID settings!
* RAID is possible as long as your OS supports it!
* Some RAID options are:
    * RAID 0
    * RAID 1
    * RAID 5 (not recommended for EBS - see documentation)
    * RAID 6 (not recommended for EBS - see documentation)
* We'll explore RAID 0 and RAID 1

## RAID 0 (increase performance)
* Combining 2 or more volumes and getting the total disk space and I/O
* ec2 instance -> one logical volume -> (ebs volume 1 and ebs volume 2)
* Writes to either ebs volume 1 or ebs volume 2 at a time
* But if one disk fails, all the data fails
* Increasing performance, but risking more
* Use cases:
    * An app that needs a lot of IOPS and doesn't need fault-tolerance
    * A database that has replication already built in
* Using this, we can have a very big disk with a lot of IOPS
* For example:
    * two 500GB Amazon EBS IO1 volumes with 4000 provisioned IOPS each will create a:
    * 1000 GB RAID 0 array with an available bandwidth of 8000 IOPS and 1000MB/s throughput

## RAID 1 (increased fault-tolerance)
* ec2 instance -> one logical volume -> (ebs volume 1 and ebs volume 2)
* Write to both ebs volume at the same time
* RAID 1 - mirroring a volume to another
* If one disk fails, our logical volume is still working
* We have to send the data to two EBS volumes at the same time (2x network)
* Use case:
    * Application that needs to increase volume fault tolerance
    * Application where you need to service disks
* For example:
    * two 500GB Amazon EBS IO1 volumes with 4000 provisioned IOPS each will create a:
    * 500GB RAID 1 array with an available bandwidth of 4000 IOPS and 500MB/s throughput

## EFS - Elastic File System
* Managed NFS (network file system) that can be mounted on many EC2
* EFS works with EC2 instances in multiple AZs
* Highly available, scalable, expensive, (3x GP2), pay per use (you don't provision capacity)
* Have to attach a security group to your EFS

ec2 (us-east-1a)        ec2 (us-east-1b)    ec2 (us-east-1c)
        ^                       ^                   ^
        v                       v                   v
                    security group
                            ^
                            v
                        EFS
* All of these instances in different AZs can talk to the same EFS drive 
* Use cases:
    * content management, web serving, data sharing, WordPress
    * Uses NFSv4.1 protocol
* Uses security groups to control access to EFS
* Compatible with Linux based AMI (not Windows)
* Performance mode:
    * General purpose (default)
    * Max IO - used when 1000s of ec2 are using the EFS
* EFS file sync to sync from on-premise file system to EFS
* Backup EFS to EFS (incremental - can choose frequency)
* Encrypted when at rest using KMS

## EFS Hands On
* configuring EFS on 2 ec2 instances using SSH
* Follow the directions when looking at your EFS instance in the AWS console:
    * install efs utils: `sudo yum install -y amazon-efs-utils`
    * create an efs folder: `sudo mkdir /efs`
    * mount your efs drive to the the efs folder: `sudo mount -t efs fs-37b4484f:/ /efs`, where `fs-xxxx` you get from the AWS console

## EBS and EFS for Solutions Architect
* EBS volumes can be attached to only one instance at a time (like a usb stick)
* EBS volumes are locked at the availability zone level (can migrate using snapshots and backups, but functionally only at AZ level)
* Migrating an EBS volume across AZ means first backing it up (snapshot), then recreating it on the other AZ
* EBS backups use IO and you shouldn't run them while your application is handling a lot of traffic
* Root EBS volumes of instances get terminated by default if the EC2 instance gets terminated
* Disk IO is high -> increase EBS volume size (for gp2)
* EFS allows for mounting 100s of instances
* EFS share website files (like wordpress)
* EBS gp2, optimize on cost (for local-type of storage on the instance)
* Can use a custom AMI for faster deployment on Auto Scaling Groups.
* EFS vs EBS vs Instance Store
* Solution architecture on EBS / EFS is discussed in a later section