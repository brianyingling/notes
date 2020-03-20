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