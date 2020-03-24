# # AWS Certified Solutions Architect - Associate

## Section 8 - Classic Solutions Architecture

## Introduction
* These solutions architectures are the best part of this course
* Let's understand how do all of these technologies we've seen work together
* Need to be *100%* comfortable here!
* We'll see the progression of a Solutions Architect mindset through many sample case studies:
    * WhatsTheTime.com
    * MyClothes.com
    * MyWordPress.com
    * Instantiating applications quickly
    * Beanstalk

## Stateless Web App: WhatIsTheTime.com
* WhatIsTheTime.com allows people to know what time it is.
* We don't need a database
* We want to start small and can accept downtime
* We want to fully scale vertically and horizontally, no downtime
* Let's go through the Solutions Architect journey

## Stateless Web App: WhatIsTheTime.com - Starting Simple

User --- (what time is it?) --> ec2 instance (t2) (public), also include Elastic IP address
    <--- It's 5:30pm!       ---

## Stateless Web App: WhatIsTheTime.com - Scaling Vertically
* Many users are attaching, scale up from `t2.micro` to say `m5.large`
* Stop `t2.micro` instance, spin up a `m5.large` instance
* IP address is the same because it uses the Elastic IP address
* Experienced downtime while upgrading to m5 instance
* Works, but isn't great

## Stateless Web App: WhatIsTheTime.com - Scaling Horizontally
* We now created 3 separate `m5.large` instances, each with their own Elastic IP address
* Each client now needs to be aware of each instance
* Need to manage more infrastructure here
* Next step:

Route 53
DNS Query                     
api.whatisthetime.com       ---  Users     ---     m5, m5, m5 instance  Public EC2 instance, No Elastic IP
A Record
TTL 1 hour

* But we want to be able to add/remove instances on the fly, this doesn't help

## Stateless Web App: WhatIsTheTime.com - Scaling Horizontally with a Load Balancer

Availability Zone 1                     Availability Zone1          Users                   DNS Query
(private instances)                     ELB + Health Checks                                 api.whatisthetime.com
m5  <--- security groups rules --->                                 User                    Alias Record (IP to AWS resource)
m5  <--- security groups rules --->                                 User                    ELB IP address changes, need hostname
m5  <--- security groups rules --->                                 User                    TTL 1 hour

* Adding / removing load balancers manually is really hard to do...

## Stateless Web App: WhatIsTheTime.com - Scaling Horizontally with an Auto Scaling Group

Availability Zone 1                     Availability Zone1          Users                   DNS Query
(private instances)                     ELB + Health Checks                                 api.whatisthetime.com
(managed by Auto Scaling Group)
m5  <--- security groups rules --->                                 User                    Alias Record (IP to AWS resource)
m5  <--- security groups rules --->                                 User                    ELB IP address changes, need hostname
m5  <--- security groups rules --->                                 User                    TTL 1 hour

* ASG allows to scale in/out automatically based on demand

## Stateless Web App: WhatIsTheTime.com - Making our App Multi-Availability Zone
Availability Zones 1-3                     Availability Zone1          Users                   DNS Query
(private instances)                        ELB + Health Checks                                 api.whatisthetime.com
(managed by Auto Scaling Group)
AZ1
m5  <--- security groups rules --->                                 User                    Alias Record (IP to AWS resource)
m5  <--- security groups rules --->                                 User                    ELB IP address changes, need hostname

AZ2
m5  <--- security groups rules --->                                 User                    TTL 1 hour
m5  <--- security groups rules --->                                 User                    TTL 1 hour

AZ3
m5  <--- security groups rules --->                                 User                    TTL 1 hour

## Minimum 2 AZ - Let's reserve capacity
* If we know we need at least 2 instances, lets have reserve instances to save on cost

## In this lecture we discussed
* Public v Private IP and ec2 instances
* Elastic IP vs Route 53 vs Load Balancers
* Route 53 TTL, A records and Alias Records
* Maintain ec2 instances manually vs Auto Scaling Groups
* multi az to survive disasters
* ELB health checks
* Security Group Rules
* Reservation of capacity for cost savings when possible 
* We're considering 5 pillars for a well architected application:
    * costs
    * performance
    * reliability
    * security
    * operational excellence

## Stateful Web App: MyClothes.com
* MyClothes.com allows people to buy clothes online
* There's a shopping cart
* Our website is having hundreds of users at the same time
* We need to scale, maintain horizontal scalability and keep our web application as stateless as possible
* Users should not use their shopping cart
* Users should have their details (address, email, etc) in a db
* Let's see how we can proceed

|------> Route 53                               Auto Scaling Group
|                                               m5 (AZ1)
|                                               m5 (AZ2)
v                                               m5 (AZ3)
user --- multi availability zone ELB ---> 

* users are losing their shopping carts when they get directed to different instances for each req.
* How can we do this?
    * we can introduce stickiness (ELB stickiness) -- user always hits the same instance for each req.
    * we still lose our shopping cart if an instance gets terminated for some reason

## Stateful Web App: MyClothes.com -- Introduce User Cookies
* We can store the contents of the shopping cart in a user cookie
* Can talk to various servers bc the user is sending the cart by way of a cookie
* Servers are stateless
* However, HTTP requests are heavier
* Security risk bc cookies can be altered
* Cookies must also be validated 
* Cookies must be less than 4KB

## Stateful Web App: MyClothes.com -- Introduce Server Session

|------> Route 53                                                    Auto Scaling Group
|                                                                    m5 (AZ1) --------> 
|                                                                    m5 (AZ2) (send session_id to get cart) --->   ElastiCache
v                                                                    m5 (AZ3) --------> 
user ---> (send session_id in web cookies) ---> multi AZ ELB ---> 

* Instance receives the session_id from the request and then uses that to fetch the cart from elastiCache
* Cart is returned to the instance which is then returned to the client
* Storing session data in DynamoDB is an alternative
* Using ElastiCache is much more secure than sending cart data from client by way of cookies
* Instances can also talk to RDS to fetch user data (address, name, etc)
* Like ElastiCache, each ec2 instance can independently talk to RDS which makes the servers stateless
* ElastiCache becomes the source of truth
* RDS master can take in writes and replicate to RDS read replicas (can have up to 5 read replicas in RDS)

## Stateful Web App: MyClothes.com -- Write Through

|------> Route 53                                                    Auto Scaling Group
|                                                                    m5 (AZ1) --------> 
|                                                                    m5 (AZ2) (send session_id to get cart) --->   ElastiCache
v                                                                    m5 (AZ3) -------->                         
user ---> (send session_id in web cookies) ---> multi AZ ELB ---> 
                                                                                \
                                                                                ( read / write) 
                                                                                        | 
                                                                                        RDS
    * ec2 instances talk to ElastiCache, pulls data from cache with a cache it
    * if an instance misses the cache (data not found), it reads RDS db
    * This pattern reduces the traffic from RDS and improves performance
    * Cache maintenance does make this more complex

## Stateful Web App: MyClothes.com -- MultiAZ - Survive Disasters
|------> Route 53            Auto Scaling Group
|                            m5 (AZ1) --------> 
|                            m5 (AZ2) (send session_id to get cart) --->   ElastiCache MultiAZ
v                            m5 (AZ3) -------->                            RDS MultiAZ
user --- ( multi-AZ) --->

* MultiAZ app across the board (ec2 instances, elasticache, rds all multi-availability-zone)

## Stateful Web App: MyClothes.com -- MultiAZ - Security Groups
|------> Route 53                           Auto Scaling Group
|                                           m5 (AZ1) --------> 
|                                           m5 (AZ2) -------->                      ElastiCache
v                                           m5 (AZ3) -------->                      RDS
user --- ( open HTTP/S to 0.0.0.0/0 --->    (restrict traffic to ec2                (restrict traffic to ElastiCache / RDS )
                                            security group from LB)                 (security group from ec2 security group)

## In this lecture, we've discussed...
## 3-tier architectures for web applications
* ELB sticky sessions
* Web clients for storing cookies and making our web app stateless
* ElastiCache
    * for storing sessions (alternative: DynamoDB)
    * for caching data from RDS
    * multi AZ for surviving disasters
* RDS
    * for storing user data
    * Read replicas for scaling reads
    * multi az for disaster recovery
* Tight security with security groups referencing each other

## Stateful Web App: MyWordPress.com
* We are trying to create a fully scalable WordPress website
* We want that website to access and correctly display picture uploads
* Our user data, and the blog content should be stored in a MySQL database
* Let's see how we can achieve this!

## Stateful Web App: MyWordPress.com -- RDS Layer
|------> Route 53                           Auto Scaling Group
|                                        /   m5 (AZ1) --------> 
|                         /------->     -   m5 (AZ2) -------->                      
v                        /               \   m5 (AZ3) -------->                      Aurora MySQL MultiAZ Read Replicas
user --- >  MultiAZ ELB /
              
## Stateful Web App: MyWordPress.com -- Storing Images with EBS
|------> Route 53                                                                    
| 
|
v                        
user --- (send image) >  MultiAZ ELB  ---> AZ1
                                           m5 Amazon EBS Volume
* EBS volumes work really well when you have 1 instance, but it can be hard to find data when you have multiple instances


|------> Route 53                                                                    
|  
|                                      /------- AZ1 ( m5 with ENI) \
v                                     /                             \
user --- (send image) >  MultiAZ ELB /                                     
                                     \                                EFS
                                      \                             /
                                       \------- AZ2 ( m5 with ENI) /

* User sends an image to a multi-AZ ELB
* ELB is in front of two ec2 instances in different availability zones, each with its own ENI (Elastic Network Interface)
* ENI is referenced in an Elastic File System
* Storage is shared among all the instances
* Good way to store across many ec2 instances so that they have access to the same data

## In this lecture we discussed...
* Aurora DB to have easy Multi-AZ and read replicas
* Storing data in EBS (single instance application)
* Vs storing data in EFS (distributed application)
* EBS is cheaper than EFS but there are advantages for distributed applications when using EFS

## Instantiating Applications Quickly
* How do we install / deploy our application on these instances?
* When launching a full stack (ec2, ebs, rds) it can take time to:
    * install applications
    * insert initial (or recovery data)
    * configure everything
    * launch the application
* We can use the advantage of the cloud to speed that up!
* ec2 instances
    * *Use a golden AMI:* Install your applications, OS dependencies, etc. beforehand and launch your ec2 instance from golden AMI
        * Very common pattern to have in AWS
    * *Bootstrap using User Data:* For dynamic configuration, use User Data scripts
    * *Hybrid:* mix Golden AMI and User Data (Elastic Beanstalk)
* RDS databases:
    * Restore from a snapshot: the database will have schemas and data ready!
* EBS volumes:
    * Restore from a snapshot: the disk will already be formatted and have data!

## Beanstalk Overview
## Typical Web App 3-tier architecture

        Public subnet               Private Subnet              ElastiCache
                                            m3

                                    /       m3
                                   /        
user ---> Elastic Load Balancing  /         m3                  RDS master
|                                                               | cross az replication
|                                           m3                  |
|                                                               |
Route 53                                    m3                  RDS slave

                                            Auto scaling

## Developer Problems on AWS
* Managing infrastructure
* Configuring all the databases, load balancers, etc.
* Scaling concerns
* Most web apps have the same architecture (ALB + ASG)
* All the developers want is their code to run!
* Possibly, consistency across different applications and environments

## AWS Elastic Beanstalk Overview
* Elastic Beanstalk is a developer centric view of deploying an application on AWS
* It uses all of the components we've seen before: ec2, asg, elb, rds, etc.
* But it's all in one view that's easy to make sense of
* We still have full control over the configuration
* BeanStalk is free but you pay for the underlying instances

## BeanStalk
* Managed service
    * Instance configuration / OS is handled by BeanStalk
    * Deployment strategy is configurable but performed by Elastic BeanStalk
* Just the application code is the developer's responsbilityf
* Three architectural models:
    * Single instance deployment: good for dev
    * LB + ASG: great for production or pre-production web applications
    * ASG only: great for non-web apps in production (workers, etc)
* Has 3 components:
    * Application
    * Application version: each deployment gets assigned a version
    * Environment name: (dev, test, prod): free naming
* You deploy application versions to environments and can promote application versions to the next environment
* Rollback feature to previous version
* Full control over lifecycle of environments

    Create Application      --> Upload Version ---> Release to Environments
    Create Environments         (+ alias)
* Support for many platforms:
    * Go
    * Java
    * Java with Tomcat
    * .NET on Windows Server with IIS
    * Node
    * PHP
    * Python
    * Ruby
    * Packer Builder
    * Single Container Docker
    * Multicontainer Docker
    * Preconfigured Docker
    * If not supported, you can write your own custom platform (advanced)
* Configuration when creating an Elastic Beanstalk application:
    * low cost / free tier: 1 ec2 instance, 1 public IP
    * high availability: ELB, ASG