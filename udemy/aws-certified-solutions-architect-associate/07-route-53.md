# AWS Certified Solutions Architect - Associate

## Section 7 - Route 53

## AWS Route 53 Overview
* Route 53 is a managed DNS (Domain Name Service)
* DNS is a collection of rules and records that help clients understand how to reach a server through URLs
* In AWS, the most common records are:
    * A: URL to IPv4
    * AAAA: URL to IPv6
    * CNAME: URL to URL
    * Alias: URL to AWS resource

## Route 53 - Diagram for A Record

Client
Web Browser    --- DNS request (http://myapp.mydomain.com) ---> Route 53
                < ---             Send back IP: 32.45.67.85 ---
            
            --- HTTP Request: 32.45.67.85, Host: http://myapp.mydomain.com ---> Application Server (32.45.67.85)
            < --- HTTP Response --

## AWS Route 53 Overview
* Route 53 can use:
    * public domain names that you own or buy (application.mypublicdomain.com)
    * private domain names that can be resolved by your instances in your VPCs (application1.company.internal)
* Route 53 has advanced features such as:
    * load balancing (through DNS - also called client load balancing)
    * health checks (although limited)
    * routing policy: simple, failover, geolocation, latency, weighted, multi-value
* You pay $0.50 / month per hosted zone

## DNS Records TTL (Time to Live)
* Way to cache the DNS query so as to not overload DNS
* DNS cache will update if IP changes but only if the TTL expires
* High TTL ~24 hours
    * less traffic on DNS
    * possibly outdated records
* Low TTL, ~ 60s
    * more traffic on DNS
    * Records outdated for less time
    * Easy to change records

Browser --- (DNS Request: http://myapp.mydomain.com) ---> Route 53
 (DNS cache for TTL duration)  <--- Send back IP: 32.45.67.85 (A record: URL to IP), TTL: 300 s ---

        --- (DNS Request: http://myapp.mydomain.com) ---> Route 53
        <-- Send back IP: 195.23.45.22, A Record: URL to IP, 300 s>

## CNAME vs. Alias
* AWS resources (Load Balancer, CloudFront, etc.) expose an AWS URL: `lbl-1234.us-east-2.elb.amazonaws.com` and you want it to be `myapp.mydomain.com`
* CNAME: 
    * Points a URL to any other URL - app.mydomain.com -> blah.anything.com
    * *only for non-ROOT domain (aka something.mydomain.com), can't be mydomain.com*
* Alias:
    * Points a URL to an AWS resource - app.mydomain.com -> blahbla.amazonaws.com
    * *works for root and non-root domains (aka mydomain.com)*
    * Free of charge
    * support for native health chec

## Simple Routing Policy
* Maps a domain to one URL
* Use when you need to redirect to a single resource
* You can't attach health checks to a simple routing policy
* If multiple values are returned, a random one is chosen by the client

## Weighted Routing Policy
* Control the % of the requests that go to a specific endpoint

            -> 70% ec2 weight: 70
Route 53    -> 20% ec2 weight: 20
            -> 10% ec2 weight: 10

* Helpful to test 1% of traffic on new app version for example
* Helpful to split traffic between two regions
* Can be associated with health checks

## Latency Routing Policy
* Redirect to the server that has the least latency close to us
* Super helpful when latency of users is a priority
* Latency is evaluated in terms of user to designated AWS Region
* Germany may be directed to the US (if that's the lowest latency)

## Health Check
* Have x health checks fail -> unhealthy (default is 3)
* Have x health checks pass -> healthy (default is 3)
* Default health check interval: 30s (can set to 10s - but leads to higher cost)
* About 15 health checkers will check the endpoint health
* -> 1 request every 2 secs on average
* Can have HTTP, TCP, and HTTPS health checks (no SSL verification)
* Possibility of integrating the health check with CloudWatch
* Health checks can be linked to Route 53 DNS queries!

## Failover Routing Policy
Web Browser --- (DNS request) ---> Route 53 --- (health check - mandatory) ---> Primary
                                            --- (failover if health check fails) ---> Secondary (disaster recovery)

## Geolocation Routing Policy
* Different from latency-based
* Routing based on user location
* Here we specify: traffic from UK should go to this specific IP
* Should create a "default" policy (in case there's no match on location)

## Multi Value Routing Policy
* Use when routing traffic to multiple resources
* Want to associate a Route 53 health checks with records
* Up to 8 healthy records are returned for each Multi Value query
* MultiValue is not a substitute for having an Elastic Load Balancer

## Route 53 as a Registrar
* A domain name *registrar* is an organization that manages the reservation of Internet domain names
* Famous names:
    * GoDaddy
    * Google Domains
    * Etc ...
* And also... Route 53 (e.g. AWS)
* Domain Registrar != DNS

## 3rd Party Registrar with AWS Route 53
* If you buy your domain on 3rd party website, you can still use Route 53
1. Create a Hosted Zone in Route 53
2. Update NS records on 3rd party website to use Route 53 name servers

* Domain Registrar != DNS!
* (but each domain registrar usually comes with some DNS features)
* You can insert NS servers in 3rd party website