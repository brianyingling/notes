# AWS Certified Solutions Architect - Associate

## Section 12 - CloudFront - AWS Global Accelerator

## AWS CloudFront
* Content Delivery Network (CDN)
* Improves read performance, content is cached at the edge
* 216 Points of Presence globally (edge locations)
* DDoS protection, integration with Shield, AWS Web Application Firewall
* Can expose external HTTPS and can talk to internal HTTPS backends
* Locations: https://aws.amazon.com/cloudfront/features/?nc=sn&loc=2

## CloudFront - Origins (data CloudFront can pull from)
* S3 bucket
    * For distributing files and caching them at the edge
    * Enhanced security with CloudFront Origin Access Identity (OAI)
* S3 website
    * Must first enable the bucket as a static s3 website
* Custom Origin (HTTP) - Must be publicly accessible
    * Application Load Balancer
    * EC2 instance
    * Any HTTP backend you want

## CloudFront - S3 as an Origin

                    AWS
Public www          --------------------------------------------------------------------------------             
(users)    <---     | Edge                                                                 Edge                 Public www
                    | Los Angeles                                                          Mumbai       --->    (users)
                    |           <- private AWS    Origin (S3 Bucket) private AWS ->
Public www  <---      Edge                          ^
(users)               Sao Paulo <- private AWS      |                                      Edge                 Public www
                                                     (OAI)           private AWS ->        Melbourne    --->    (users)
                                                    v
                                                Origin Access Identity
                                                + S3 Bucket Policy

## CloudFront - ALB or EC2 as an origin                            
EC2:                                                                      --- Security Group ---
Users <---> Edge location <---> (Allow Public IP of Edge locations) <---> EC2 instances
* IP addresses of ec2 instances must be public
* Edge location traverses the security group, the security group must allow the IPs of CloudFront edge locations into ec2 instances
* Can get a list of public IP addresses to whitelist for security groups (must allow all the IPs for CloudFront to work)

ALB:                                            --- Security Group ---      --- Security Group ---
Users <---> Edge Location (Public IPs) <--->    ALB must be public --->     EC2 instances (can be private)
* ALB *must be public*
* Backend ec2 instances can be private

## CloudFront Geo Restriction
* You can restrict who can access your distribution
    * *whitelist*: Allow your users to access your content only if they're in one of the countries on a list of approved countries
    * *blacklist*: Prevent your users from accessing your content if they're in one of the countries on a blacklist of banned countries
* The "country" is determined using a 3rd party Geo-IP database
* Use Case: Copyright Laws to control access to content

## CloudFront vs S3 Cross Region Replication
* CloudFront:
    * using a Global Edge network
    * Files are cached for a TTL (maybe a day)
    * Great for static content that must be available everywhere
* S3 Cross Region Replication
    * Must be setup for each region you want replication to happen
    * Files are updated in near real time
    * Read only
    * Great for dynamic content that needs to be available at low-latency in few regions

## AWS CloudFront Hands On
* We'll create an S3 bucket
* We'll create a CloudFront distribution
* We'll create an Origin Access Identity (OAI) - a "user" accessing our bucket
* We'll limit the s3 bucket to be accessed only using this identity

## CloudFront Signed URL / Signed Cookies
* You want to distribute paid shared content to premium users over the world
* We can use a CloudFront Signed URL / Cookie. We attach a policy with:
    * Includes URL expiration
    * Includes IP ranges to access the data from
    * Trusted signers (which AWS accounts can create signed URLs)
* How long should the URL be valid for?
    * Shared content (movie, music); make it short (a few minutes)
    * Private content (private to the user); you can make it last for years
* What's the difference between a Signed URL and a cookie?
    * Signed URL gives access to individual files (one signed URL per file)
    * Signed Cookies = access to multiple files (one signed cookie for many files)

## CloudFront Signed URL Diagram

Client                                       CloudFront                      S3
^
|        --- signed url --->                  --------------                  ----------------
|   Returned sign URL                          Edge location
|  Authentication + Auth                                    <--- OAI --->    Object
v                                           Edge location
Application 
    <--- use AWS SDK Generate Signed URL --->

* Client gets authenticated and authorized by the application
* Application requests a generated signed URL
* Application returns the generated signed URL to the client
* Client uses the signed URL to access the file in S3 by way of CloudFront on the Edge

## CloudFront Signed URL vs S3 Pre-Signed URL
* CloudFront Signed URL:
    * Allow access to a path, no matter the origin
    * Account-wide key-pair, only the root can manage it
    * Can filter by path, IP, date, expiration
    * Can leverage caching features
    * client <---> (signed url) <---> Edge Location <---> ec2 instance
* S3 Signed URL:
    * Issue a request as the person who presigned the URL
    * Uses the IAM key of the signing IAM principal
    * Limited lifetime
    * Client <--- pre-signed url ---> s3 bucket

## Global Users for your Application
* You have deployed an application and have global users who want to access it directly
* They go over the public internet, which can add a lot of latency due to the number of hops
* We wish to go as fast as possible through AWS network to minimize latency

## Unicast IP vs Anycast IP
* Unicast IP: one server holds one IP address
* Anycast IP: all servers hold the same IP address and the client is routed to the nearest one

## AWS Global Accelerator
* uses the Anycast IP concept
* Leverage the AWS internal global network to route to your application
* Client ---> Edge network (private AWS network) ---> public ALB
* 2 Anycast IP are created for your application
* Anycast IP send traffic directly to Edge locations
* Edge locations send traffic to your application
* Works with Elastic IP, EC2 instances, ALB, NLB, public or private
* Consistent performance
    * Intelligent routing to lowest latency and fast regional failover
    * No issue with client cache (because the IP doesn't change)
    * Internal AWS network
* Health checks
    * Global Accelerator peforms a health check of your applications
    * Helps make sure your application global (failover less than 1 minute for unhealthy)
    * Great for disaster recovery (thanks to the health checks)
* Security
    * only 2 external IPs need to be whitelisted
    * DDoS protection thanks to AWS Shield

## AWS Global Accelerator vs CloudFront
* They both use the AWS global network and its edge locations around the world
* Both services integrate with AWS Shield for DDoS protection
* CloudFront
    * Improves performance for both cacheable content (such as images and video)
    * Dynamic content (such as API acceleration and dynamic site recovery)
    * Content is served at the Edge
* Global Accelerator
    * Improves performance for a wide range of applications over TCP or UDP
    * Proxying packets at the Edge to applications running in one or more AWS regions
    * Good fit for non-HTTP use cases, such as gaming (UDP), IoT (MQTT), or VoiceOver IP
    * Good for HTTP use cases that require deterministic, fast regional failover