# # AWS Certified Solutions Architect - Associate

## Section 9 - S3 Introduction

## Introduction
* S3 is one of the main building blocks of AWS
* It's advertised as "infinitely scaling" storage
* Widely popular and deserves its own section
* Many websites use S3 as a backbone
* Many AWS services use AWS S3 as an integration as well
* We'll have a step-by-step approach to S3

## AWS S3 Overview - Buckets
* S3 allows people to store objects (files) in "buckets" (directories)
* Buckets MUST have a *globally unique name*
* Buckets are defined at the regional level (even though they need a globally unique name)
* Naming convention
    * No uppercase
    * No underscore
    * 3-63 characters long
    * Not an IP
    * Must start with a lowercase or a number

## AWS S3 Overview - Objects
* Objects (files) have a key. The key is the FULL path:
    * <my_bucket>/my_file.txt
    * <my_bucket>/my_folder/another_folder/my_file.txt
* There is no concept of "directories" within buckets (although the UI will trick you to think otherwise)
* Just keys with very long names that contain slashes "/"
* Object values are the contents of the body:
    * Max size is 5TB
    * If uploading more than 5GB, must use "multi-part upload"
* Metadata (list of text key/value pairs -- system or user metadata)
* Tags (Unicode key/value pair -- up to 10) - useful for security / lifecycle
* Version ID (if versioning is enabled)

## AWS S3 - Versioning
* You can version your files in S3
* It is enabled at the *bucket level*
* Same key overwrite will increment the "version": 1, 2, 3...
* If you overwrite a file, you will increment its version
* It is best practice to version your buckets:
    * Protection against unintended deletes (ability to restore a version)
    * Easily rollback to previous version
* Any file that is not versioned prior to enabling versioning will have version "null"

## S3 Encryption for Objects
* 4 methods for encrypting objects in s3:
    * SSE-S3: encrypts s3 objects using keys handled and managed by AWS
    * SSE-KMS: leverage AWS Key Management Service to manage encryption keys
    * SSE-C: when you want to manage your own encryption keys
    * Client side encryption
* It's important to understand which ones are adapted to which situation for the exam

## SSE-S3
* SSE-S3: Encryption keys are handled and managed by s3
* Object is encrypted server side
* AES-256 encryption type
* MUST set header: *"x-amz-server-side-encryption":"AES256"*
* AWS S3 provides the encryption key
                                    
                                    S3
                                    ---------------------------
Object --- (HTTP/S + Header) --->   | Object
                                    |  +            --- (encryption) ---> Bucket
                                    | S3 Managed Data Key
                                    |
                                    |

## SSE-KMS
* SSE-KMS: Encryption using keys handled and managed by KMS
* KMS advantages:
    * user control
    * audit trail
* Object is encrypted server side
* MUST set header: *"x-amz-server-side-encryption":"aws:kms"*
                                    
                                    S3
                                    ---------------------------
Object --- (HTTP/S + Header) --->   | Object
                                    |  +            --- (encryption) ---> Bucket
                                    | KMS Customer Master Key
                                    | (CMK)
                                    |

## SSE-C
* SSE-C: Encryption using data keys fully managed by the customer outside of AWS
* Amazon S3 does not store the encryption key you provide
* *HTTPS must be used*
* Encryption key must be provided in HTTP headers, for every HTTP request made
* Client provides the key and S3 uses it to encrypt the data but throws away the key afterwards
                                                    S3
Object                                              ________________________________-
+       --- ( HTTPS only + Data key in Header) ---> | Object
Client side data key                                |  +            --- (encryption) ---> Bucket
                                                    | Client-provided data key

## Client Side Encryption
* Client library such as Amazon S3 Encryption Client
* Clients must encrypt data themselves before sending to s3
* Clients must decrypt data themselves when retrieving from s3
* Customer fully manages the keys and encryption cycle

Client - s3 encryption SDK                                      S3
-----------------------------------------                       -------------------
Object
+   -- (encryption) --> Encrypted Object    --- (HTTP/S) --->   Bucket
Client side data key

## Encryption in Transit (SSL)
* AWS s3 exposes
    * HTTP endpoint: not encrypted
    * HTTPS endpoint: encryption in flight
* You're free to use the endpoint you want, but HTTPS is recommended
* HTTPS is required for SSE-C because the encryption key is transmitted over the network
* Encryption in-flight is also called SSL / TLS

## S3 Security
* User based
    * IAM policies - which API calls should be allowed for a specific user from IAM console
* Resource based
    * Bucket Policies - bucket-wide rules from s3 console - allow cross-account
    * Object Access Control List - ACL - finer grain
    * Bucket Access Control List - ACL - less common

## S3 Bucket Policies
    * JSON-based policies
        * Resources: buckets and objects
        * Actions: set of API to allow or deny
        * Effect: Allow / Deny
        * Principal: The account / user to apply policy to.
    * Use s3 bucket for policy to:
        * grant public access to public
        * force objects to be encrypted at upload
        * grant access to another account (cross account)

## S3 Security - Other
* Networking
    * Supports VPC endpoints (for instances in VPC without www internet)
* Logging and Audit
    * S3 access logs can be stored in other S3 bucket
    * API calls can be logged in AWS CloudTrail
* User Security
    * MFA (multi factor authentication) can be required in versioned buckets to delete objects
    * Signed URLs: URLs that are valid only for a limited time (ex: premium video for logged-in users)

## S3 Websites
* s3 can host static websites and have them accessible on the www
* Website url will be:
    * <bucket-name>.s3-website-<AWS-region>.amazonaws.com
    * OR
    * <bucket-name>.s3-website.<AWS-region>.amazonaws.com
* If you get a 403 (Forbidden) error make sure the bucket policy allows for public reads!

## S3 CORS
* If you request data from another s3 bucket, you will need to enable CORS
* Cross Origin Resource Sharing allows you to limit the number of websites that can request your files in s3 (and limit your costs)
* It's a popular exam question

Client --- (GET index.html) ---> mybucket
       <------------------------     

        GET coffee.jpg
        ORIGIN: http://mybucket.s3-website.eu-west-3.amazonaws
        ----------------------------------------------------------------> my-image-bucket
        <--- (Access-Control-Allow-Origin: <domain> ---------------------                 

* my-image-bucket says I'm not giving you coffee.jpg unless your origin (mybucket...) has been approved
* Need to enable CORS
* Allow the origins you want to approve, deny the rest

## AWS S3 Consistency Model
* Read after write consistency for PUTs of new objects
    * As soon as an object is written, we can retrieve it (ex: PUT 200 -> GET 200)
    * This is true, *except* if we did a GET before to see if the object existed
      (ex: GET 404 -> PUT 200 -> GET 404) - eventually consistent, because previous result (get 404) was cached
* Eventual consistency for DELETEs and PUTs of existing objects
    * If we read an object after updating, we might get the older version
      (ex: PUT 200 -> PUT 200 -> GET 200 -- might be older version)