# AWS Certified Solutions Architect - Associate

## Section 3 - AWS Fundamentals - IAM and EC2

### Introduction

### AWS Regions

Regions exist all around the world - us-east-1, etc.

Each region has multiple availability zones: us-east-1a, us-east-1b

Availability zones are recognized with a letter, a through f.

Each availability zone is a physical data center in the region, but separate from the others so they are isolated from disasters

AWS consoles are region scoped (except IAM and S3)

https://aws.amazon.com/about-aws/global-infrastructure

### IAM introduction

* IAM ( Identity and Access Management )
* Your whole AWS security is there:
    * Users
    * Groups
    * Roles
* Root account should never be used (and shared)
* Users must be created with proper permissions
* IAM is at the center of AWS
* Policies are written in JSON

Users
- Usually a typical person

Groups
- functions (admins, devops)
- teams (engineering, design)
- contains users

Roles
- Internal usage within AWS resources
- Roles are what we give to internal machines

Policies (JSON docs)
- defines what each can and cannot do

* IAM has a *global* view
* Permissions are governed by Policies
* MFA (multifactor authentication) can be setup
* IAM has predefined managed policies
* least privilege principles - give users the minimal amount of permissions they need to perform their job


### IAM Federation

* Big enterprises usually integrate their own repository of users with IAM
* This way one can login to AWS using their company credentials
* Identity Federation uses the SAML standard (Active Directory)

### IAM 101 Brain Dump
* One IAM user per Physical Person
* One IAM Role per Application
* IAM credentials should NEVER BE SHARED
* Never write IAM credentials in code
* Never use the Root account except for initial setup
* Never use Root IAM credentials

### EC2 Introduction

What is EC2?
* One of AWS's most popular offerings
* Mainly:
    * rents virtual machines
    * storing data on virtual drives (EBS)
    * distributing load across machines (ELB)
    * scaling services using an auto-scaling group (ASG)

### SSH Summary Table

Use Putty for Windows less than v. 10
EC2 Instance Connect allows users to connect to your instance on any OS using your browser

### How to SSH into EC2 instance

SSH allows you to control a machine remotely

Computer will access port 22 of your ec2 instance

Need to use the key .pem file to access our instance via SSH

To access:

`ssh -i EC2Tutorial.pem ec2-user@xx.xx.xx.xx`

When downloaded, PEM files have a permisssion of 0644 and that is too open. Since the key is available to other users, it cannot be used and the terminal will not allow you to ssh into the machine.

To fix, use chmod:

`chmod 0400 EC2Tutorial.pem`

Amazon EC2 Instance connect (browser-based) only works with Amazon Linux 2 instances

### Introduction to Security Groups

* Security groups are fundamental to network security in AWS
* Control how traffic is allowed into and out of our EC2 instances
* It is a very fundamental skill to learn to troubleshoot networking issues
* Will learn to use inbound and outbound ports
* Security Groups have name, description, inbound, outbound, and tags
* Inbound - all the rules that will allow traffic into our instance (we added SSH as a rule)
* Outbound - all traffic allowed out of the instance (by default all our allowed)
* Timeout - attempting to ssh into an instance without an ssh inbound rule will cause a timeout

### Security Groups Deep Dive
* Basically act as a "firewall" on ec2 instances
* They regulate:
    * access to ports
    * Authorized IP ranges - IPv4 and IPv6
    * Control of inbound to network (from other to the instance)
    * Control of outbound from network (from instance to the other)
* Things to Know:
    * Can be attached to multiple instances (many-to-many relationship -- one instance can belong to many security groups and one security group can have many instances)
    * Locked down to region / VPC combination, switching to another region or VPC requires creating another security group for that region or VPC
    * Does live outside the EC2 - if traffic is blocked the EC2 instance won't see it
    * It's good to maintain one separate security group just for SSH access
    * If your application is not accessible via timeout, it's likely a security group issue
    * If you receive a "connection refused" error then it's an application error or it's not launched
* How to reference Security Groups from other Security Groups?
    * EC2 instances can allow for other security groups to have access to it, say inbound traffic is permitted from Security Group 1 and 2, but not 3; any instance with Security Group 3 will not be able to access the other instance.

### Private v Public v Elastic IP
* Private v Public IP (IPv4)
    * Networking has two types of IPs: IPv4 and IPv6
        * IPv4: 1.160.10.240
        * IPv6: -- very long string ---
    * We're only using IPv4
    * IPv4 allows for 3.7 billion addresses in the public space
    * IPv4: [0-255].[0-255].[0-255].[0-255]
    * Private network has a series of servers / computers that can talk to one another within the network but not outside directly
    * Internet gateway (public) - computers in the private network communicate outside via the Internet Gateway, which is publicly accessible
    * Public IP - accessible publicly over the internet
    * Private IP - only accessible from within the network
* Fundamental differences:
    * Public IP
        * can be identified on the internet
        * must be unique across the internet
        * can be geolocated easily
    * Private IP
        * can only be identified on the private network
        * must be unique within the private network
        * TWO different private networks can have the same IP because they are only accessible from within the private network
        * Machines connect to the internet via internet gateway (a proxy)
        * Only a specified range of IPs can be used as private IPs
    * Elastic IP
        * When you start and stop an EC2 instance, it can change its public IP
        * If you need a fixed public IP for your instance, you need an elastic IP
        * An elastic IP is a public IPv4 you own as long as you don't delete it
        * You can attach it to one instance at a time
        * With an Elastic IP address, you can mask the failure of an instance or software by rapidly remapping the address to another instance in your account
        * You can only have 5 Elastic IP in your account (you can ask AWS to increase this)
        * Overall, try to avoid using Elastic IP
            * Reflect poor architectural decisions
            * Instead use a random public IP and register a DNS name to it
            * Or, use a Load Balancer and don't use a public IP
    * By default, our EC2 machine comes with:
        * a private IP for the internal AWS network
        * a public IP address
    * When we are doing SSH into our ec2 instances:
        * we can't use a private IP because we are not in the same network
        * we can only use the public IP
    * If your machine stopped and started, the public IP can change

### Launching an Apache Server on EC2
* Use Apache to display a web page
* Create an index.html that shows the hostname of our machine

* SSH into the machine
* run `sudo su` to get superuser controls
* run `yum update -y` to update the packages
* run `yum install -y httpd` to install Apache
* run `systemctl start httpd.service` to start the Apache service
* run `systemctl enable httpd.service` to enable the service on restarts
* curl `localhost:80` should result in returning an html page

Going to the browser and attempting to access Apache server through the instance's IP address results in a timeout, we need to configure security group to allow for HTTP inbound requests

After adding an HTTP inbound rule to our security group on port 80, we can now see the default Apache test page. We would need to add content to `/var/www/html`

### EC2 User Data
* It is possible to bootstrap our instances using an EC2 User Data script
* Bootstrapping means launching commands when the machine starts
* That script is only run once at the instance first start
* EC2 user data is used to automate boot tasks such as:
    * Installing updates
    * Installing software
    * Downloading common files from the internet
    * Anything you can think of :-)
* EC2 Data Script runs with the root user
* Hands on: What are we going to do?
    * We want to make sure this ec2 instance has Apache HTTP server installed to display a simple page
    * We will write a User Data script

### EC2 Instance Launch Types
* On Demand instances: short workload, predictable pricing
* Reserved: (Minimum 1 year)
    * reserved instances: long workloads
    * convertible reserved instances: long workloads with flexible instances (example m4.large today, c5 tomorrow)
    * scheduled reserved instances: example - every Thursday between 3 - 6pm
* Spot instances: short workloads, for cheap, can lose instances (less reliable)
* Dedicated instances: no other customer will share the hardware
* Dedicated hosts: book an entire physical server, control instance placement

### EC2 On Demand
* Pay for what you use (billing per second after the first min)
* Has the highest cost but no upfront payment
* No long term commitment
* Recommended for short-term and uninterrupted workloads, where you can't predict how the app will behave

### EC2 Reserved Instances
* Up to 75% discount compared to on-demand
* Pay upfront for what you use with long-term commitment
* Reservation period between 1 - 3 years
* Reserve a specific instance type
* Recommended for steady state usage applications (think database)
* Convertible Reserved Instance
    * Can change ec2 instance type
    * Up to 54% discount
* Scheduled Reserved Instances
    * Launch within time window reserved
    * When you require a fraction of day / week / month

### EC2 Spot Instances
* Can get a discount of up to 90% compared to on-demand
* Define max spot price and get the instance while current spot price < max spot price
    * Hourly spot price varies based on offer and capacity
    * If current spot price > your max price you can choose to stop or terminate your instance within 2 min grace period
* Other Strategy: Spot Block
    * "block" spot instance during a specified time frame (1 to 6 hours) without interruptions
    * In rare situations, the instance may be reclaimed
* Used for batch jobs, data analysis, or workloads that are resilient to failures
* Not great for critical jobs or databases

### EC2 Dedicated Hosts
* Physical dedicated EC2 server for your use
* Full control over EC2 instance placement
* Visibility into the underlying sockets / physical cores of the hardware
* Allocated for your account for a 3 year period reservation
* More expensive
* Useful for software that have complicated licensing model (BYOL - Bring Your Own License)
* For companies that have strong regulatory or compliance needs

### EC2 Dedicated Instances
* Instances running on hardware that's dedicated to you
* May share hardware with other instances in same account, but only within your account
* No control over instance placement (can move hardware after start / stop)

### Which Host is Right for Me?
* On demand - coming in and staying resort - whenever we like, we pay full price
* Reserved - Like planning ahead and if we plan to stay for a long time, we may get a good discount
* Spot instances - the hotel allows people to bid for empty rooms and the highest bidder keeps the rooms. You can get kicked out at any time
* Dedicated Hosts - We book an entire building of the resort

### EC2 Instance Types - Main ones
* R - applications that need a lot of RAM - in-memory caches
* C - applications that need a lot of CPU - compute / databases
* M - applications that are balanced (think "medium") - general / web-app
* I - applications that need good local I/O (instance storage) - databases
* G - applications that need a GPU - video rendering / machine learning
* T2 / T3 - burstable instances (up to a capacity) - get a good burst for a short while but lose it as it goes on
* T2 / T3 unlimited - unlimited burst
* Real world tip: use https://www.ec2instances.info

### Burstable Instances ( T2 / T3 )
* AWS has the concept of burstable instances (T2/T3 machines)
* Burst means that overall the instance has OK CPU performance
* When the machine needs to process something unexpected (a spike in load for example) it can burst and CPU can be VERY good
* If the machine bursts, it uses "burst credits"
* If burst credits are all gone, the CPU becomes BAD
* If the machine stops bursting, credits are accumulated over time
* Burstable instances can be amazing to handle unexpected traffic and getting the insurance that it will be handled correctly
* If your instance consistently runs low on credit, you need to move to a different kind of non-burstable instance
* CloudWatch can give you a view of these burst credits

### T2/T3 Unlimited
* Nov 2017: it is possible to have unlimited burst credit balance
* You pay extra money if you go over your credit balance, but you dont lose in performance
* Overall it is a new offering so be careful, costs could go high if you're not monitoring the health of your instances
* Read more: https://aws.amazon.com/blogs/aws/new-t2-unlimited-going-beyond-the-burst-with-high-performance/ 

### What is an AMI?
* AWS comes with base images:
    * Ubuntu
    * Fedora
    * Red Hat
    * Windows
    * etc.
* These images can be customized at runtime using EC2 User Data
* But what if we wanted to create our own image ready to go?
* That's an AMI - an image used to create our instances
* AMIs can be built for Windows or Linux

### Why would you use a custom AMI?
* Using a custom built AMI can provide the following advantages:
    * Pre-installed packages needed
    * Faster boot time (no need for EC2 User Data at boot time)
    * Machine comes configured with monitoring / enterprise software
    * Security concerns - control over the machines in the network
    * Control over maintenance and updates of AMIs over time
    * Active Directory Integration out of the box
    * Installing your app ahead of time (for faster deploys when autoscaling)
    * Using someone else's AMI that is optimised for running an app, DB, etc.
* AMI are built only for a specific region!

### Using Public AMIs
* You can leverage public AMIs from others
* You can also pay for other people's AMI by the hour
    * You basically "rent" expertise from the AMI creator
* AMIs can be found and published on the Amazon Marketplace
* Warning!
    * Do not use an AMI you do not trust, some come with malware or are insecure

### AMI Storage
* Your AMI take space and live in S3
* Amazon S3 is a durable, cheap, and resilient storage where most of your backups will live (but you wont see them in the s3 console
)
* By default your AMIs are private and locked for your account and region
* Can make them public and share them with other AWS accounts or sell them on the AWS marketplace

### AMI Pricing
* AMIs live in S3, so you get charged for the space it takes in s3
* s3 in us-east-1: first 50TB/month: 0.023 per GB

### Cross Account AMI Copy (FAQ + Exam Tip)
* You can share an AMI with another AWS account
* Sharing an AMI does not affect the ownership of the AMI
* If you copy an AMI that has been shared with your account, you are the owner of the target AMI in your account
* To copy an AMI that was shared with you from another account, the owner of the source AMI must grant you read permissions for the storage that backs the AMI, either the associated EBS snapshot (for an Amazon EBS-backed AMI) or an associated S3 bucket (or an instance store-backed AMI)
* Limits:
    * You can't copy an encrypted AMI that was shared with you from another account. Instead, if the underlying snapshot and encryption key were shared with you, you can copy the snapshot while re-encrypting it with a key of your own. You own the copied snapshot and can register it as a new AMI
    * You can't copy an AMI with an associated `billingProduct` code that was shared with you from another account. This includes Windows AMIs and AMIs from the AWS Marketplace. To copy a shared AMI with a `billingProduct` code, launch an EC2 instance in your account using the shared AMI and then create an AMI from the instance.

### EC2 Placement Groups
* Sometimes you want control over the EC2 instance placement strategy
* Strategy can be defined using placement groups
* When you create a placement group, you specify one of the following strategies for the group:
    * cluster - cluster instances grouped into a low-latency group in a single Availability Zone (high performance but high risk)
    * spread - spreads instances across underlying hardware (max 7 instances per group per AZ ) - critical applications
    * partition - spreads instances across many different partitions (which rely on different sets of racks) within availabilty zone. Scales to 100s of EC2 instances per group (Hadoop, Cassandra, Kafka)

### Placement Groups - Cluster
Same rack, same Availabilty Zone

Placement group cluster, low latency 10Gps network

|-----------------------------------|
    ec2     ec2     ec2

    ec2     ec2     ec2
|-----------------------------------|

Pros:
* Great network (10Gbps bandwidth between ec2 instances)
Cons:
* If the rack fails, all the instances fail at the same time
Use Case:
* Big data job that needs to complete fast
* Applications that need low latency and high network throughput

### Placement Groups - Spread

|-------|   |-------|   |-------|
us-east1a    us-east1b  us-east1c

hardware1   hardware3   hardware5
ec2         ec2         ec2

hardware2   hardware4   hardware6
ec2         ec2         ec2

Pros:
* Can span across Availability Zones
* Reduced risk from simultaneous failure
Cons:
* Limited to 7 instances per Availabilty Zone per placement group
Use Case:
* Application that needs to maximize high availability
* Critical applications where each instance must be isolated from failure from one another

### Placement Group - Partition
|-----------------------------------|
us-east-1a
Partition1  Partition2  Partition3
ec2         ec2         ec2
ec2         ec2         ec2
ec2         ec2         ec2
ec2         ec2         ec2

* Up to 7 partitions per Availability Zone
* Up to 100s of ec2 instances
* Instances in a partition do not share racks with the instances in other partitions
* A partition failure can affect many ec2 but won't affect other partitions
* EC2 instances get access to the partition information as metadata
* Use cases: HDFS, HBase, Cassandra, Kafka

NOTE: Cluster is not available for t2 instance types

### Elastic Network Interfaces (ENI)
* Logical component in a VPC that represents a virtual network card (what gives ec2 instances access to the network)
* 
Availability Zone
ec2
 - eth0 - primary ENI - 192.168.0.31
 - eth1 - secondary ENI - 192.168.0.42

ec2
- eth0 - primary ENI
- eth1 - can move the first instance's eth1 secondary ENI here

* ENI can have the following attributes:
    * Primary private IPv4, one or more secondary IPv4
    * One elastic IP (IPv4) per private IPv4
    * One public IPv4
    * One or more security groups
    * MAC address

* Can create ENIs independently and attach them on the fly (move them) on EC2 instances for failover
* Bound to a specific availability zone (AZ)
* This is very helpful for failovers, can move the IP around if an instance fails
* An ENI is a VIRTUAL network interface that can be attached/detached from ec2 instances


### EC2 Hibernate
* We know we can start, stop, terminate instances
    * Stop: data on disk (EBS) is kept intact on the next start
    * Terminate: Any EBS volumes (root) also set-up to be destroyed are lost
* On start, the following happens:
    * First start: the OS boots and the EC2 User Data script is run
    * Following starts: OS boots up
    * Then your application starts, caches get warmed up, and that can take time!
* Introducing EC2 Hibernate:
    * RAM state is preserved
    * Instance boot is much faster! (OS is not stopped or restarted)
    * Under the hood: RAM state is written to a file in the root EBS volume
    * Root EBS volume must be encrypted
* Use-cases
    * long-running processes
    * saving RAM state
    * services that take time to initialize

### EC2 Hibernate - Good to know
* Supported instance families - C3, C4, C5, M3, M4, M5, R3, R4, R5
* Instance RAM size - must be less than 150GB
* Instance size - not supported for bare metal instances
* AMI: Amazon Linux 2, Linux AMI, Ubuntu, Windows
* Root Volume: Must be EBS, encrypted, not instance store and large
* Only available for on-demand and reserved instances (not spot instances)
* Instance cannot hibernate for more than 60 days

### EC2 for Solutions Architects
* EC2 instances are billed by the second, t2.micro is free tier
* On Linux / Mac, use SSH, on Windows use Putty
* SSH is on port 22, lock down the security group to your IP
* Timeout issues -> most likely security group issues
* Permission issues on the SSH key - run `chmod 0400`
* Security groups can reference other security groups instead of IP ranges (very popular exam question)
* Know the difference between Public, Private, and Elastic IP addresses
* You can customize an EC2 instance at boot time using EC2 User Data
* Know the 4 EC2 launch modes:
    * on-demand
    * reserved
    * spot instances
    * dedicated hosts
* Know the basic instance types: R, C, M, I, G, T2/T3
* You can create AMIs to pre-install software on your EC2 -> faster boot
* AMI can be copied across regions and accounts
* EC2 instances can be started in placement groups
    * Cluster
    * Spread
    * Partition



