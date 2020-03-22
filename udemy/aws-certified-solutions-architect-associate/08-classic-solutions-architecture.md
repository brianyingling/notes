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