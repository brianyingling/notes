# AWS Certified Solutions Architect - Associate

## Section 13 - AWS Storage Extras

## Snowball
* Physical data transport solution that helps moving TBs or PBs of data in and out of AWS
* Alternative to moving data over the network ( and paying network fees)
* Secure, tamper-resistant , uses KMS 256-bit encryption
* Tracking using SNS and text messages. E-ink shipping label
* Pay per data transfer job
* Use cases: large data cloud migrations, DC decommision, disaster recovery
* If it takes more than a week to transfer over the network, use Snowball!

## Snowball Process
* Request Snowball devices from the AWS console for delivery
* Install Snowball client on your servers
* Connect the Snowball to your servers and copy files using the client
* Ship back the device when you're done (goes to the right AWS facility)
* Data will be loaded in an S3 bucket
* Snowball is completely wiped
* Tracking is done using SNS, text messages, and AWS console

## Snowball Edge
* Snowball Edges add computational capability to the device
* 100TB capacity
    * storage optimized - 24 vCPU
    * compute optimize - 52 vCPU and optional GPU
* Supports a custom ec2 AMI so you can perform processing on the go
* Supports custom Lambda functions
* Very useful to pre-process the data while moving
* Use case: data migration, image collection, IoT capture, machine learning

## AWS Snowmobile
* it's an actual truck
* Transfer exabytes of data!
* Each snowmobile will have 100PB of capacity
* Better than Snowball if you transfer more than 10PB

## Solution Architecture: Snowball Into Glacier
* Snowball cannot import data to Glacier directly
* You have to import data into s3 first, then use a s3 lifecycle policy

Snowball --- (import) ---> S3 --- (S3 lifecycle policy) ---> Amazon Glacier

## Hybrid Cloud for Storage
* AWS is pushing for hybrid cloud
    * Part of your infrastructure is on the cloud
    * Part of your infrastructure is on-premise
* This can be due to:
    * Long cloud migrations
    * Security requirements
    * Compliance requirements
    * IT strategy
* S3 is a proprietary technology (unlike EFS / NFS) so how do you expose the s3 data on premise?
* AWS Storage Gateway

## AWS Storage Cloud Native Options
* AWS types:
    * Block:
        * EBS
        * EC2
    * File:
        * EFS
    * Object:
        * S3
        * Glacier
* Bridge between on-premise and cloud data in s3
* Use cases: disaster recovery, backup and restore, tiered storage
* 3 types of storage gateway:
    * File Gateway
    * Volume Gateway
    * Tape Gateway
* Exam: You need to know the difference between all three!

## File Gateway
* Configured S3 buckets are accessible using NFS and SMB protocol
* Supports S3 standard, IA, S3 One Zone IA
* Bucket access using IAM roles for each File Gateway
* Most recently used data is cached in the file gateway
* Can be mounted on many servers

## Volume Gateway
* Block storage for iSCSI protocol backed by S3
* Backed by EBS snapshots which can help store on-premise volumes
* Cached Volumes: low latency access to the most recent data
* Stored Volumes: entire dataset is on-premise, scheduled backups to S3

## Tape Gateway
* Some companies have backup processes on physical tapes!
* With Tape Gateway, companies use the same process but in the cloud
* Virtual Tape Library (VTL) backed by Amazon S3 and Glacier
* Back up data using existing tape-based processes (and iSCSI interface)
* Works with leading software vendors

## AWS Storage Gateway Summary
* Exam tip: read the question well, it will hint on what gateway to use
* On-premise data to the cloud -> Storage Gateway
* File access / NFS -> File Gateway (backed by S3)
* Volumes / Block Storage / iSCSI -> Volume Gateway (backed by S3 with EBS snapshots)
* VTL Tape Solution / backup with iSCSI -> Tape Gateway (backed by s3 and Glacier)

## Amazon FSx for Windows (File Server)
* EFS is a shared POSIX system for Linux systems
* FSx for Windows is a fully-managed Windows filesystem shared drive
* Supports SMB protocol and Windows NTFS
* Microsoft Active Directory integration, ACL, user quotas
* Built on SSD, scale up to 10s of GBs, millions of IOPS, 100s PB of data
* Can be accessed from your on-premise infrastructure
* Can be configured to be Multi-AZ (high availabilty)
* Data is backed up daily to S3

## Amazon FSx for Lustre
* Lustre is a type of parallel distributed system for large-scale computing
* Lustre name is derived from "linux" and "cluster"
* Used for machine learning and high-performance computing (HPC)
* Video processing, financial modeling, Electronic Design Automation
* Scales up to 100s of GB/s, millions of IOPS, sub-ms latencies
* Seamless integration with S3
    * Can read s3 as a filesystem (through FSx)
    * Can write the output of the computations back to S3 (through FSx)
* Can be used from on-premise servers




