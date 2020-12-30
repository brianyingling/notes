# AWS Certified Solutions Architect - Associate

## Section 14 - Messaging

## Introduction
* When we start to deploy multiple applications, they will inevitably need to communicate with one another
* 2 patterns of application communication:
    * synchronous communication: application to application
        * buying service <---> shipping service 
    * asynchronous / event-based communication: application to queue to application
        * buying service ---> queue ---> shipping service
* Synchronous between applications can be problematic if there are sudden spikes of traffic
* What if you need to suddenly encode 1000 videos but usually it's 10?
* In that case it is better to *decouple* your applications so that it can scale better
    * using SQS: queue model
    * using SNS: pub/sub model
    * using Kinesis: real-time streaming model
* These services can scale independently from our application!

## What's a Queue?
Producers (can have many) --- (send messages) ---> SQS --- (poll messages) ---> Consumers (can have many)

## SQS - Standard Queue
* Oldest offering (over 10 years old)
* Fully managed
* Attributes:
    * Unlimited throughput, unlimited number of messages in queue
    * Default retention of messages: 4 days, maximum of 14 days (has to be deleted within that timeframe)
    * Low latency (<10 ms on publish and receive)
    * Limitation of 256K per message sent
* Can have duplicate messages (at least once delivery, occassionally)
* Can have out of order messages (best effort ordering)

* Scales from 1 message/sec to 10,000s messages/sec
* Horizontal scaling in terms of number of consumers

## SQS - Producing Messages
* Produced to SQS using the SDK (SendMessage API)
* The message is persisted in SQS until a consumer deletes it
* Message retention: default 4 days up to 14 days
* Example: send an order to be processed:
    * Order id
    * Customer Id
    * Any attributes you want
* SQS standard: unlimited throughput

## SQS - Consuming Messages
* Consumers (running on EC2 instances, servers, or AWS Lambda)
* Poll SQS for messages (receive up to 10 messages at a time)
* Process the messages (example: insert message into RDS database)
* Delete the messages using the DeleteMessage API

## SQS Multiple EC2 Instances Consumers
* Consumers receive and process messages in parallel
* At least once delivery
* Best-effort message ordering
* Consumers delete messages after processing them
* We can scale consumers horizontally to improve throughput of messaging

## SQS with Auto Scaling Group (ASG)
* Can setup an Auto Scaling Group that scales out based on the queue length (this is set up in CloudWatch)

SQS Queue ---- Poll for messages ---> EC2 instances with Auto Scaling Group
|
|
v
CloudWatch Metric - Queue Length ---> CloudWatch Alarm, scale instances now
ApproxNumberOfMessages

## SQS to decouple between application tiers
--- request ---> Front End Web App (auto scaling) ---> SQS Queue ---> Back end processing App (video processing) Auto Scaling ---> insert S3 bucket
* Let the SQS queue receive the request for the back end app to consume instead of having the front end app tier handle the processing

## Amazon SQS - Security
* Encryption
    * In-flight encryption using HTTPS API
    * At-rest encryption using KMS keys
    * Client side encryption if the client wants to perform encryption/decryption itself
* Access Controls: IAM policies to regulate access to the SQS API
* SQS Access Policies (similar to S3 bucket policies)
    * Useful for cross-account access to SQS queues
    * Useful for allowing other services (SNS, S3...) to write to an SQS queue

## SQS - Message Visibility Timeout
* After a message is polled by a consumer, it becomes visible to other consumers'
* By default the "message visibility timeout" is 30 secs.
* That means the message has 30 secs to be processed.
* Within the visibility timeout (30 secs) other consumers of the queue will not receive the message
* After the message visibility timeout is over, the message is "visible" in SQS
* If a message is NOT processed within the visibility timeout, it will be processed TWICE
* A consumer could call the ChangeMessageVisibility API to get more time
* If visibility timeout is high (say, hours) and consumer crashes, re-processing will take time
* If visibility timeout is too low (secs) we may get duplicates

ReceiveMessage  ReceiveMessage                              ReceiveMessage          ReceiveMessage
Req             Req                                         Req                     Req
|               | (don't see bc visibility timeout window)  | (don't see)           | (seen, because timeout window exp.)
------------- ( time ) ----------------------------------------------------------------->

## SQS - Dead Letter Queue
* If a consumer fails to process a message within the Visiblity Timeout...the message goes back to the queue
* We can set a threshold of how many times a message can go back into the queue
* After the *MaximumReceives* threshold is exceeded, the message goes into a dead letter queue (DLQ)
* Useful for debugging!
* Make sure to process the messages in the DLQ before they expire:
*   Good to set a retention of 14 days in DLQ
## SQS - Delay Queue
* Delay a message (consumers don't see it immediately) up to 15 mins
* Default is 0 sec (message is available right away)
* Can set a default at a queue level
* Can override the default setting using the DelaySeconds parameter

## SQS - FIFO Queue
* FIFO = First In First Out (ordering of messages in queue)
* Consumer will receive messages in the exact same order producer sends them
* Limited throughput: 300 msg/sec without batching, 3000 msg/sec with batching
* Exactly once send capability (by removing duplicates)
* Messages are processed in order by the consumer

## SQS with Auto Scaling Group (ASG)
* Goal: scale the number of EC2 instances based on the number of messages in the SQS queue

(SQS Queue) - | (poll for messages) -> EC2 instances+ | - Auto Scaling Group

CloudWatch Custom Metric - Queue Length / Number of Instances
CloudWatch Alarm triggered, scales Auto Scaling Group

More load, more EC2 instances, less load, less EC2 instances

## SQS to decouple between application tiers
requests -> (EC2 instances+ ASG) -> SQS Queue -> (EC2 instances+  - ASG)

## SQS - Producing Messages
* Define Body (up to 256k "string", attributes - name, value, type)
* Provide Delay Delivery (optional)
* Get back
    * Message identifier
    * MD5 hash of the body

## SQS - Consuming Messages
* Consumers ...
* Poll SQS for messages (receive up to 10 messages at at a time)
* Process the message within the visibility timeout
* Delete the message using the message ID and receipt handle
SQS --- (poll messages) ---> message --- (process message) ---> Consumer
                                                                    |
        <------- (delete message) -----------------------------------       

## SQS - Visibility Timeout
* When a consumer polls a message from a queue, the message is "invisible" to other consumers for a defined period...the Visibility Timeout
    * Set between 0 sec and 12 hours (default 30 sec)
    * If set too high, say 15 mins, and consumer fails to process the message, you must wait a long time before processing the message again
    * If set too low, say 30 secs, and consumer needs time to process message (2 mins), another consumer will receive the message and the message will be processed more than once
* ChangeMessageVisibility API to change the visiblity while processing a message
* DeleteMessage API to tell SQS the message was successfully processed

## SQS - Dead Letter Queue
* If a consumer fails to process a message within the Visiblity Timeout, the message goes back to the queue
* We can set a threshold of how many times a message can go back to the queue, called a "redrive policy"
* After the threshold is exceeded, the message goes into a dead letter queue (DLQ)
* We have to create the DLQ first and then designate it as a DLQ
* Make sure to process the messages in the DLQ before they expire!

## SQS - Long Polling
* When a consumer requests a message from the queue, it can optionally "wait" for messages to arrive if there are none in the queue
* This is called long polling
* Long Polling decreases the number of API calls made to SQS while increasing the efficiency and latency of your application
* Wait time can be between 1 sec to 20 sec
* Long polling is preferable to short polling
* Long polling can be enabled at the queue level or the API level using WaitTimeSeconds

## SQS Message Consumption Flow Diagram

                            (visibility after timeout)
                                |           |
                                v           |
*Producer ---(message) ---> SQS Queue --- (message) ---> *consumer 
                                    (long polling)                  |
                                <------ (delete message) ----
                                |
                                |
                                v
                            Dead Letter Queue

* = many

## SQS - FIFO Queue
* Newer offering (First In-First Out) - not available in all regions!
* Name of the queue must end in `.fifo`
* Lower throughput (up to 3000/sec with batching, 300/sec without)
* Messages are processed in order
* Messages are sent exactly once
* No per message delay (only per queue delay)
* Ability to do content based de-duplication
* 5 minute interval de-duplication using Duplication ID
* Message Groups:
    * Possibility to group messages for FIFO ordering using "Message Group ID"
    * Only one worker can be assigned per message group so that messages are processed in order
    * Message group is just an extra tag on the message!                

## SQS with Auto Scaling Group
* 
                                ---- Auto Scaling Group ---       <---------          
SQS --- (poll messages) --->    EC2 instances                               |
                                    |                                       |
CloudWatch Custom Metric   <---------                                       |
Queue Length / # of instances                                               |
                ---- (meets the threshold) ---> CloudWatch Alarm ---> (scale the instances)

* We have a number of ec2 instances consuming messages from a SQS standard queue
* We want to be able to scale in/out the # of ec2 instances based on message consumption
* Set up a CloudWatch custom metric that sets the queue length / # of instances
* When we meet the threshold, CloudWatch triggers an alarm that is assigned to a scaling policy on Auto Scaling Group receives and scales in/out the instances
* 2 alarms: one for going above the threshold and 1 for going under threshold
* Step-scaling policy


## SQS to decouple between application tiers
             --- Auto Scaling Group ---                 --- Auto Scaling Group --- (scaling)
request ---> ec2 instances --- (PUT) ---> SQS Queue ---> ec2 instances

## SNS
* What if you want to send one message to many receivers?

Direct Integration:

Buying Service  --->    Email notification
                --->    Fraud service
                --->    Shipping Service
                --->    SQS queue

Pub/Sub:                                Subscribers:
Buying Service ---> SNS Topic   --->    Email notification
                                --->    Fraud service
                                --->    Shipping Service
                                --->    SQS queue 

* The "event producer" only sends message to one SNS topic
* As many "event producers" (subscriptions) as we want to listen to the SNS topic notifications
* Each subscriber to the topic will get all the messages (note: new feature to filter messages)
* Up to 10 million subscriptions / topic
* 100,000 topics limit
* Subscribers can be:
    * SQS
    * HTTP/HTTPS (with delivery retries - how many times?)
    * Lambda
    * Emails
    * SMS messages
    * Mobile notifications

## SNS integrates with a lot of Amazon Products
* Many AWS services can send directly to SNS for notifications
* CloudWatch (for alarms)
* Auto Scaling Groups notifications
* S3 (on bucket events)
* CloudFormation (upon state changes -> failed to build)
* Etc.

## SNS - How to Publish
* Topic Publish (within your AWS server - using SDK)
    * Create a topic
    * Create a subscription (or many)
    * Publish to the topic
* Direct publish (for mobile apps SDK)
    * Create a platform application
    * Create a platform endpoint
    * Publish to the platform endpoitn
    * Works with Google GCM, Apple APNS, Amazon ADM

## Amazon SNS - Security
* Encryption:
    * In-flight encryption using HTTPS API
    * At-rest encryption using KMS keys
    * Client-side encryption if the client wants to perform encryption/decryption itself
* Access Controls: IAM policies to regulate access to the SNS API
* SNS Access Policies (similar to S3 bucket policies)
    * Useful for cross-account access to SNS topics
    * Useful for allowing other services (S3...) to write to an SNS topic


## SNS + SQS: Fan Out
* Push once in SNS, receive in many SQS queues
Buying Service ---> SNS Topic   ---> SQS Queue   ---> Fraud Service
                                ---> SQS Queue   ---> Shipping Service
* Fully decoupled
* No data loss
* Able to add receivers of data later can add/remove queues later
* SQS allows for delayed processing
* SQS allows for retries of work
* Ability to add more SQS subscribers over time\
* Make sure your SQS queue access policy allows for SNS to write
* *SNS cannot send messages to SQS FIFO queues (AWS limitation)*
* May have many workers on one queue and one worker on the other queue

## Application: S3 Events to multiple queues
* For the same combination of: event type (eg object create) and prefix (e.g. images/) you can only have *one S3 event rule*
* If you want to send the same S3 event to many SQS queues, use fan-out

S3 Object created ... - events -> Amazon S3 -> SNS Topic - Fan out ---> SQS Queue
                                                                   ---> SQS Queue
## Kinesis Overview
* Kinesis is a managed alternative to Apache Kafka
* Great for application logs, metrics, IoT, clickstreams
* Great for "real-time" big data
* Great for streaming processing frameworks (Spark, NiFi, etc.)
* Data is automatically replicated to 3 availability zones
* *Kinesis streams:* low latency streaming ingest at scale
* *Kinesis Analytics:* perform real-time analytics on streams using SQL
* *Kinesis Firehose:* load streams into s3, RedShift, ElasticSearch, etc...

## Kinesis
                                            --- Kinesis ---

Click Streams   -->                                                                     ---> S3 Bucket
IoT Devices     -->     Kinesis Streams ---> Kinesis Analytics ---> Kinesis Firehose    ---> Redshift
Metrics & Logs  --> 

## Kinesis Streams Overview
* Streams are divided into ordered shards / partitions

                Shard 1
producers --->  Shard 2     ---> consumers
                Shard 3
* Data retention is by default 1 day, can go up to 7 days
* Ability to reprocess / replay data
* Multiple applications can consume the same stream
* Real time processing with scale of throughput
* Once data is inserted in Kinesis, it can't be deleted (immutability)

## Kinesis Streams Shards
* One stream is made of many shards
* 1 MB/sec or 1000 messages/sec at write PER SHARD
* 2 MB/sec PER SHARD
* Billing is per shard provisioned, can have as many shards as you want
* Batching available or per message calls
* The number of shards can evolve over time (reshard / merge)
* Records are ordered per shard

## Kinesis API - Put records
* PutRecord API + Partition key that gets hashed
* The same key always goes to the same partition (helps with ordering for a specific key)
* Messages get a "sequence number"
* Choose a partition key that is highly distributed (helps prevent "hot partition", where all data goes to 1 shard)
    * user_id if many users
    * *NOT* country_id if 90% of users are in 1 country
    * choose something that will spread your data evenly
* Use Batching with PutRecords to reduce costs and increase throughput
* ProvisionedThroughputExceeded if we go over the limits
* Can use CLI, AWS SDK, or producer libraries from various frameworks

Message key (hashed to determine shard id)                          Shard 1
Data                                        --- (produced) --->     Shard 2
                                                                    Shard 3

## Kinesis API - Exceptions
* ProvisionedThroughputExceeded Exceptions
    * Happens when sending more data (exceeding MB/sec or TPS for any shard)
    * Make sure you don't have a hot shard (such that your partition key is bad and too much data goes to that partition)
* Solution
    * Retries with backoff
    * Increase shards (scaling)
    * Ensure your partition key is a good one

## Kinesis API - Consumers
* Can use a normal consumer (CLI, SDK, etc.)
* Can use the Kinesis Client Library (in Java, Node, Python, Ruby, .NET)
    * KCL uses DynamoDB to checkpoint offsets
    I KCL uses DynamoDB to track other workers and share the work amongst shards

## Kinesis Security
* Control access / authorization using IAM policies
* Encryption in flight using HTTPS endpoints
* Encryption at rest using KMS
* Possibility to encrypt / decrypt data client side (harder)
* VPC endpoints available for Kinesis to access within VPC