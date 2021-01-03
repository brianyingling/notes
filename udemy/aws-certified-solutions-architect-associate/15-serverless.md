# AWS Certified Solutions Architect - Associate

## Section 15 - Serverless

## What is Serverless?
* Serverless is a new paradigm where developers do not have to manage servers anymore
* They just deploy code
* They just deploy functions
* Initially...Serverless == FaaS (Functions as a Service)
* Serverless was pioneered by AWS Lambda but now includes anything that's managed: databases, messaging, storage, etc.
* Serverless does not mean there are no servers, it just means that developers do not manage them

## Serverless in AWS
* AWS Lambda
* DynamoDB
* AWS Cognito
* AWS API Gateway
* Amazon S3
* AWS SNS & SQS
* AWS Kinesis Data Firehose
* Aurora Serverless
* Step Functions
* Fargate

Users
|        \              \
(static  (REST API)     (Login)
content)    |           |
|           v           v
v           Lambda      Cognito
S3 Bucket   |
            V
            DynamoDB

## Why AWS Lambda
EC2 instances:
* Virtual Servers in the cloud
* Limited by RAM and CPU
* Continuously running
* Scaling means intervention to add and remove servers

Lambda:
* Virtual functions - no servers to manage!
* Limited by time - short executions!
* Run on demand
* Scaling is automated

## Benefits of AWS Lambda
* Easy Pricing
    * Pay per request and compute time
    * Free tier of 1 million Lambda requests and 400,000 GB of compute time
* Integrated with many AWS services
* Integrated with many programming languages
* Easy monitoring through CloudWatch
* Easy to get more resources per function ( up to 3GB of RAM)
* Increasing RAM will also improve CPU and network

## AWS Lambda language support
* Node.js (JavaScript)
* Python
* Java (Java 8 compatible)
* C# (.NET Core)
* Go
* C# / PowerShell
* Ruby
* Custom Runtime API (community supported, example Rust)
* Docker DOES NOT run on AWS Lambda, for Docker use ECS or Fargate

## AWS Lambda Integrations
Main ones
* API Gateway
* Kinesis
* DynamoDB
* S3
* CloudFront
* CloudWatch Events / EventBridge
* CloudWatch Logs
* SNS
* SQS
* Cognito

## Example: Serverless Thumbnail Integration
* S3 Bucket -> New Image in S3 -> trigger Lambda function that generates a thumbnail -> push to another s3 bucket -> OR push metadata in DynamoDB

## Example: Serverless CRON Job
* Jobs generated at any given interval
CloudWatch Event Bridge Rule -> trigger every hour -> Lambda function to perform a task

## AWS Lambda Pricing: example
https://aws.amazon.com/lambda/pricing
* Pay per calls: first 1 million requests free
* 0.20 cents per million requests thereafter
* Pay per duration (increments of 100 ms)
    * 400,000GB-secs of compute time per month if FREE
    * == 400,000 secs if function is 1GB RAM
* It's usually very cheap to run AWS Lambda so it's very popular

## AWS Lambda Limits to Know - Per Region
* Execution
    * Memory Allocation: 128MB - 3008MB (64MB increments)
    * Max execution time: 900 secs (15 mins)
    * 4KB of Environment Variables
    * Disk capacity in the "function container" (in /tmp) of 512MB
    * 1000 Concurrency executions (can be increased)
* Deployment
    * Lambda function deployment size (compressed zip), 50MB
    * Size of uncompressed deployment (code + dependencies) 250MB
    * Can use /tmp directory to load other files at startup
    * Size of env variables: 4KB

## Lambda@Edge
* You have deployed a CDN using CloudFront
* What if you wanted to run a global AWS Lambda alongside each Edge location?
* how to implement request filtering before reaching your application?
* For this, you can use Lambda@Edge:
    deploy Lambda functions alongside your CloudFront CDN
    * Build more responsive applications
    * You don't manage servers, Lambda is deployed globally
    * Customize the CDN content
    * Pay for only what you use
* You can use Lambda to change CloudFront requests and responses
    * After CloudFront receives a request from a viewer (viewer request)
    * Before CloudFront forwards the request to the origin (origin request)

user --- (Viewer Request) ---> CloudFront --- (Origin Request)  ---> Origin
    --- (Viewer Response) --->            <--- (Origin Response) --- 

* You can generate responses to viewers without sending request to the origin

Amazon s3 bucket
HTML Website ---> User visits website --- (Dynamic API requests) ---> CloudFront <---> Lambda@Edge function (runs code in each CloudFront edge, globally ) <---> querying data in DynamoDB

## Lambda@Edge: Use Cases
* Website Security and Privacy
* Dynamic Web Application at the Edge
* Search Engine Optimization
* Intelligently Route Across Origin and Data Centers
* Bot Mitigation at the Edge
* Real-time Image Transformation
* A/B Testing
* User Authorization and Authentication
* User Prioritization
* User Tracking and Analytics

## DynamoDB Overview
* Fully managed, highly available with replication across 3 Availability Zones (AZs)
* NoSQL database - not a relational database
* Scales to massive workloads, distributed database
* Millions of requests / sec, trillions of rows, 100s of TBs of storage
* Fast and convenient in performance (low latency on retrieval)
* Integrated with IAM for security, authorization, and administration
* Enables event-driven programming with DynamoDB streams
* Low cost and auto-scaling capabilities

## DynamoDB - Basics
* DynamoDB is made of tables
* Each table has a primary key (must be decided at creation time)
* Each table can have an infinite number of items ( = rows)
* Each item has attributes (can be added over time - can be null) - attribute is like a column in a relational db
* Max size of an item is 400K
* Data types supported are:
    * Scalar Types: String, Number, Binary, Boolean, Null
    * DocumentTypes: List, Map
    * Set Types: String Set, Number Set, Binary Set

## DynamoDB - Provisioned Throughput
* Table must have provisioned read and write capacity units
* Read Capacity Units (RCU): throughput for reads ($0.00013 per RCU)
    * 1 RCU = 1 strongly consistent read of 4KB / sec.
    * 1 RCU = 2 eventually consistent read of 4KB / sec.
* Write Capacity Units (WCU): throughput for writes ($0.00065 per WCU)
    * 1 WCU = 1 write of 1 KB / sec
* Option to set up autoscaling of throughput to meet demand
* Throughput can be exceeded temporarily through "burst credit"
* If burst credit are empty, you'll get a "ProvisionedThroughputException"
* It's then advised to do an exponential backoff retry

