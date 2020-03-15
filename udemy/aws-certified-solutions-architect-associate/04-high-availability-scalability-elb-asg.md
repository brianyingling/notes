# AWS Certified Solutions Architect - Associate

## Section 4 - High Availability and Scalability - ELB and ASG


## Scalability and High Availability
* Scalability means that an application / system can handle greater loads by adapting.
* 2 Kinds of scalability:
    * Vertical scalability 
    * Horizontal scalability = elasticity
* Scalability is linked but different to high availability

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




