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