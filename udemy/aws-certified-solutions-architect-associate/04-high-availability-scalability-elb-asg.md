# AWS Certified Solutions Architect - Associate

## Section 4 - High Availability and Scalability - ELB and ASG

## Scalability and High Availability
* Scalability means that an application / system can handle greater loads by adapting.
* 2 Kinds of scalability:
    * Vertical scalability 
    * Horizontal scalability = elasticity
* Scalability is linked to but different than high availability

## Vertical Scalability
* def. - increases the size of the instance
* For example, your application runs on a t2.micro - upgrading this to t2.large
* Vertical scalability is very common for non-distributed systems, such as a database
* RDS, ElastiCache are services that can scale vertically
* There's usually a limit to how much you can vertically scale (hardware limit)

## Horizontal Scalability
* def. - means to increase the number of instances / system for your application
* Horizontally scaling implies distributed systems.
* Common for web applications / modern applications
* It's easy to horizontally scale thanks to cloud offerings like EC2.

## High Availability
* High availability goes hand in hand with horizontal scaling
* High availability means running your application / system in at least 2 data centers (== availability zones)
* The goal of high availability is to survive a data center loss
* High availability can be passive (for RDS multi-availability-zone for example)
* The high availability can be active (for horizontal scaling)

## High Availability & Scalability for EC2
* Vertical Scaling: increasing instance size (=scale up/down)
    * from t2.nano - 0.5GB RAM, 1 vCPU
    * to u-12tbl.metal - 12.3TB RAM, 448 vCPUs
* Horizontal Scaling: increase number of instances (= scale out / in) out when increasing, in when decreasing instances
    * Auto Scaling Group
    * Load Balancer
* High Availability: Run instances for the same application across availability zones
    * Auto Scaling Group - multi availability zones
    * Load Balancer - multi availability zones

## What is Load Balancing?
* Load balancers are servers that will forward internet traffic to multiple servers (ec2 instances) downstream
* Users only deal with a single point of entry and we can scale up or down the number of instances and the load balancer will only distribute traffic to the instances available.

## Why Use a Load Balancer?
* Spread load across multiple downstream instances
* Expose a single point of access (DNS) to your application
* Seamlessly handle failures of downstream instances
* Do regular health checks to your instances
* Provide SSL termination (HTTPS) for your websites
* Enforce stickiness with cookies
* High availablity across zones
* Separate public traffic from private traffic

## Why Use an EC2 Load Balancer?
* An ELB (EC2 Load Balancer) is a managed load balancer:
    * AWS guarantees that it will be working
    * AWS will take care of the upgrades, maintenance, and high availability
    * AWS provides only a few configuration knobs
* It costs less to setup your own load balancer but it will be a lot more effort on your end
* It is integrated with many AWS offerings

## Health Checks
* Health Checks are crucial for Load Balancers
* They enable the load balancer to know if instances it forwards traffic to are available to reply to requests
* The health check is done on a port and a route (/health is common)
* If the response is NOT 200 (ok), then the instance is unhealthy
* Can configure them to happen every x amount of seconds

## Types of Load Balancers on AWS
* AWS has 3 kinds of managed Load Balancers
    * Classic Load Balancer - v1 - old generation - 2009
        * HTTP, HTTPS, TCP
    * Application Load Balancer - v2 - new generation - 2016
        * HTTP, HTTPS, WebSocket
    * Network Load Balancer - v2 - new generation - 2017
        * TCP, TLS (secure TCP) & UDP
* Overall, it is recommended to use the newer v2 generation load balancers as they provide more features
* You can setup internal (private) or external (public) ELBs

## Load Balancer Security Groups
* Users send traffic over HTTP/HTTPS to the load balancer
* Load balancer sends traffic to your ec2 instances
* HTTP traffic restricted to load balancer; ec2 instances only accept traffic from the load balancer
* Have an Application Security Group that allows traffic only from Load Balancer

## Load Balancer Good To Know
* Load Balancers can scale but not instantaneously - contact AWS for a "warm up"
* Troubleshooting
    * 4xx errors are client induced errors
    * 5xx errors are appliction induced errors
    * Load Balancer Errors 503 means at capacity or no registered target
    * If the Load Balancer cannot connect to your application, check your security groups!
* Monitoring
    * ELB access logs will log all access requests (so you can debug per request)
    * CloudWatch metrics will give you aggregate statistics (ex: connections count)

## Classic Load Balancers (v1)
* Supports TCP (Layer 4), HTTP and HTTPS (Layer 7)
* Health checks are TCP or HTTP based
* Fixed hostname: `xxx.region.elb.amazonaws.com`

## Application Load Balancer (v2)
* Application Load Balancer is Layer 7 (HTTP)
* Load Balancing to multiple HTTP applications across machines (target groups)
* Load Balancing to multiple applications on the same machine (containers)
* Support for HTTP/2 and WebSockets
* Support redirects (from HTTP to HTTPS for example)
* Routing Tables to different target groups:
    * Routing based on path in URL (example.com/users and example.com/posts)
    * Routing based on hostname in URL (one.example.com and other.example.com)
    * Routing based on Query String, Headers (example.com/users?id=123&order=false)
* Application Load Balancers (ALB) are great for microservices and container-based applications
    (Docker and Amazon ECS)
* Has a port mapping feature to redirect to a dynamic port in ECS
* In comparison, we'd need multiple Classic Load Balancer per application
* ALB exposes a DNS URL, whereas ALB / CLB exposes a static IP address 


## Application Load Balancer (v2) HTTP-based traffic
ALB Routes to different apps 
* route /user       -> hits same External Application Load Balancer -> target group for Users application (many ec2 instances)
* route / search    -> hits same External Application Load Balancer -> target group for Search application (many ec2 instances)

## Application Load Balancer (v2) Target Groups
* EC2 instances can be managed by an Auto Scaling Group - HTTP
* ECS tasks (managed by ECS itself) - HTTP
* Lambda functions - HTTP request is translated into a JSON event (ALBs can be in front of lambda functions)
* IP addresses - must be private IPs
* ALB can route to multiple target groups
* Health checks are at the target group level

## Application Load Balancer (v2) - Good To Know
* Get a fixed hostname - xxx.region.elb.amazonaws.com
* The application servers don't see the IP of the client directly
    * The true IP of the client is inserted in the header `X-Forwarded-For`
    * We can also get Port (`X-Forwarded-Port`) and protocol (`X-Forwarded-Proto`)
* Client IP (12.34.56.78) -> Load Balancer IP (Private IP) -> EC2 instance
* For the instance to to know the Client IP it will have to look at these extra headers listed above

## Network Load Balancer (v2)
* Network load balancers (Layer 4) allow you to:
    * Forward TCP and UDP traffic to your instances
    * Handle millions of requests per second
    * Less latency ~100ms (vs 400ms) for ALB
* NLB has *one static IP per availability zone* and supports assigning Elastic IP (helpful for whitelisting specific IP) (CLB and ALB have static hostname)
* NLBs are used for extreme performance, TCP or UDP traffic
* *NOT* included in AWS free tier
* NLB exposes a STATIC IP address, whereas ALB / CLB exposes a static DNS URL 

## Network Load Balancer (v2) -- TCP (Layer 4) Based Traffic
Initial setup with instances assigned to nlb target group are unhealthy because they do not allow traffic to come in from anywhere
* Use this if you want to have a static IP or:
* high performance

## Load Balancer Stickiness
* It is possible to implement stickiness so that the same client is always redirected to the same instance behind a load balancer
* Works for CLB and ALB
* The "cookie" used for stickiness has an expiration date you control
* Use case: make sure the user doesn't lose his session data
* Enabling stickiness may bring imbalance to the load over the backend ec2 instances
* For ALB, stickiness settings are at the target group level

## Cross Zone Load Balancing
* With cross-zone load balancing, each load balancer instance distributes evenly across all registered instances in all availability zones
* Otherwise, each load balancer node distributes request evenly across the registered instances only in its own Availability Zone
* Classic Load Balancer
    * disabled by default
    * No charge for inter-availability-zone data if enabled (if data goes from one AZ to another, you will be charged for it, but not with CLB)
* Application Load Balancer
    * Always on (can't be disabled)
    * No charges for inter AZ data
* Network Load Balancer
    * Disabled by default
    * You pay charges ($) for inter AZ data if enabled

## SSL / TLS - Basics
* SSL certificate allows traffic between your clients and your load balancer to be encrypted in transit (in-flight encryption)
* SSL refers to Secure Sockets Layer, used to encrypt connections
* TLS refers to Transport Layer Security, which is a newer version
* Nowadays, TLS certificates are mainly used, but people still refer to it as SSL
* Public SSL certificates are issued by Certificate Authorities (CA)
* Example authorities: Comodo, Symantec, GoDaddy, GlobalSign, Digicert, Letsencrypt, etc.
* SSL certificates have an expiration date (you set) and must be renewed

Users ---> (https encrypted over www) ---> Load Balancer -->  (http over private VPC) ---> ec2 instance
* Load balancer uses a x.509 certificate (SSL/TLS server certificate)
* You can manage certificates using ACM (AWS Certificate Manager)
* You can also upload your own certificates alternatively
* HTTPS listener:
    * You must specify a default certificate
    * You can add an optional list of certs to support multiple domains
    * Clients can use SNI (Server Name Indication) to specify the hostname they reach
    * Ability to specify a security policy to support older versions of SSL/TLS (legacy clients)

## SSL - Server Name Indication
* SNI solves the problem of loading multiple SSL certificates onto one web server (to serve multiple websites)
* It's a "newer" protocol and requires the client to indicate the hostname of the target server in the initial SSL handshake
* The server will then find the correct certificate or return the default one
* Note:
    * only works with ALB & NLB (newer generation), CloudFront
    * Does not work for CLB (older generation)

## Elastic Load Balancers - SSL Certificates
* Classic Load Balancer (v1)
    * Support only one SSL certificate
    * Must use multiple CLB for multiple hostname with multiple SSL certificates
* Application Load Balancer (v2)
    * Supports multiple listeners with multiple SSL certificates
    * Uses Server Name Indication (SNI) to make it work
* Network Load Balancer (v2)
    * Supports multiple listeners with multiple SSL certificates
    * Uses Server Name Indication (SNI) to make it work

## What's an Auto Scaling Group?
* In real life, the load on your websites and application can change
* In the cloud, you can create and get rid of servers very quickly
* The goal of an Auto Scaling Group is to:
    * Scale out (add ec2 instances) to match an increased load
    * Scale in (remove ec2 instances) to match a decreased load
    * Ensure we have a minimum and maximum number of machines running
    * Automatically register new instances to a load balancer
* Need to know about the minimum size, actual size / desired capacity, and maximum size (scale out as needed)

## Auto Scaling Group in AWS with Load Balancer
* Traffic goes through a Load Balancer so ASGs work hand in hand with them

## Auto Scaling Groups have the following attributes:
* Launch configuration:
    * AMI + an instance type
    * EC2 User Data
    * EBS Volumes
    * Security Groups
    * SSH Key Pair
* Min Size / Max Size / Initial Capacity
* Network + Subnets Information
* Load Balancer Information
* Scaling Policies

## Auto Scaling Alarms
* It is possible to scale an ASG based on CloudWatch alarms
* An Alarm monitors a metric (such as average CPU)
* Metrics are computed for the overall ASG instances
* Based on the alarm:
    * We can create scale-out policies (increase the number of instances)
    * We can create scale-in policies (decrease the number of instances)

## Auto Scaling New Rules
* It is now possible to define "better" auto scaling rules that are directly managed by EC2
    * Target average CPU Usage
    * Number of requests on the ELB per instance
    * Average network in
    * Averge network out
* These rules are easy to set up and can make more sense

## Auto Scaling Custom Metric
* We can auto scale based on a custom metric (e.g. number of connected users)
* 1. Send custom metric from application on EC2 to CloudWatch (PutMetric API)
* 2. Create CloudWatch alarm to react to low / high values
* 3. Use the CloudWatch alarm as the scaling policy for ASG

## ASG Brain Dump
* Scaling policies can be on CPU, network... and can even be on custom metrics or based on a schedule (if you know your visitors' patterns)
* ASGs can use launch configurations and you update an ASG by providing a new launch configuration
* IAM roles attached to an ASG will get assigned to EC2 instances
* ASGs are free: you pay for the underlying resources being launched
* Having instances under an ASG means that if they get terminated for whatever reason, the ASG will restart them. Extra safety!
* ASG can terminate instances marked as unhealthy by a load balancer (and hence replace them)

## Auto Scaling Groups - Scaling Policies
* Target Tracking Scaling
    * Most simple and easy to set up
    * Example: I want the average ASG CPU to stay around 40%, over this and more instances will be provisioned
* Simple / Step Scaling
    * When a CloudWatch alarm is triggered (example CPU > 70%) then add 2 units
    * When a CloudWatch alarm is triggered (example CPU < 30%) then remove 1 unit
* Scheduled Actions
    * Anticipate scaling based on known usage patterns
    * Example: increase the min capacity to 10 at 5pm on Fridays

## Auto Scaling Groups - Scaling Cooldowns
* The cooldown period helps to ensure that your Auto Scaling Group doesn't launch or terminate additional instances before the previous scaling activity takes effect
* In addition to the default cooldown for Auto Scaling Groups, we can create cooldowns that apply to a specific simple scaling policy
* A scaling-specific cooldown period overrides the default cooldown period.
* One common use for scaling specific cooldowns is with a scale-in policy -- a policy that terminates instances based on a specific criteria or metric. Because this policy terminates instances, Amazon EC2 Auto Scaling needs less time to determine whether to terminate additional instances.
* If the default cooldown period of 300 seconds is too long, you can reduce costs by applying a scaling-specific cooldown period of 180 seconds to the scale-in policy.
* If your application is scaling up or down multiple times each hour, modify the Auto Scaling Groups cooldown timers and the CloudWatch alarm period that triggers the scale in.

## Auto Scaling Groups - For Solutions Architects
* ASG Default Termination Policy (simplified version):
    * Find the AZ with the most number of instances
    * If there are multiple instances in the AZ to choose from, delete the one with the oldest launch configuration
    * ASG tries to balance the number of instances across Availability Zone by default
* Lifecycle Hooks
    * By default as soon as an instance is launched its in service
    * You have the ability to perform extra steps before the instance goes in service (pending state).
    * You have the ability to perform some actions before the instance is Terminated (terminating state).


Things to study:
1. ALB is given a static DNS name, whereas NLB is given a static IP address
2. Scaling policies (Simple Scaling, Step Scaling, Target Tracking, Scheduled Scaling)
