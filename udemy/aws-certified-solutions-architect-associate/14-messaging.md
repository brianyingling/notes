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
* What if you need to suddenly encode 1000 videos but usually it's 10
* In that case it is better to *decouple* your applications
    * using SQS: queue model
    * using SNS: pub/sub model
    * using Kinesis: real-time streaming model
* These services can scale independently from our application!

## What's a Queue?
Producers (can have many) --- (send messages) ---> SQS --- (poll messages) ---> Consumers (can have many)

## SQS - Standard Queue
* Oldest offering (over 10 years old)
* Fully managed
* Scales from 1 message/sec to 10,000s messages/sec
* Default retention of messages: 4 days, max 14 days
* No limit to how many messages can be in the queue
* Low latency (< 10ms on publish and receive)
* Horizontal scaling in terms of number of consumers
* Can have duplicate messages (at least once delivery, occassionally)
* Can have out of order messages (best effort ordering)
* Limitation of 256K per message sent

## SQS - Delay Queue
* Delay a message (consumers don't see it immediately) up to 15 mins
* Default is 0 sec (message is available right away)
* Can set a default at a queue level
* Can override the default setting using the DelaySeconds parameter

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
* What if you want to send one message to many

Direct Integration:

Buying Service  --->    Email notification
                --->    Fraud service
                --->    Shipping Service
                --->    SQS queue

Pub/Sub:
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
    * SNS messages
    * Mobile notifications

## SNS integrates with a lot of Amazon Products
* Some services can send data directly to SNS for notifications
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

## SNS + SQS: Fan Out
* Push once in SNS, receive in many SQS queues
Buying Service ---> SNS Topic   ---> SQS Queue   ---> Fraud Service
                                ---> SQS Queue   ---> Shipping Service
* Fully decoupled
* No data loss
* Able to add receivers of data later can add/remove queues later
* SQS allows for delayed processing
* SQS allows for retries of work
* May have many workers on one queue and one worker on the other queue

