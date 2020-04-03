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