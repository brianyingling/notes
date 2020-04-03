# AWS Certified Solutions Architect - Associate

## Section 11 - Advanced S3 and Athena

## S3 MFA-Delete
* MFA (Multi Factor Authentication) forces a user to generate a code on a device (usually a mobile phone or hardware) before doing important operations on S3
* To use MFA-Delete, enable Versioning on the S3 Bucket
* You will need MFA for:
    * permanently delete an object version
    * suspend versioning on the bucket
* You won't need MFA for:
    * enabling versioning
    * Listing deleted versions
* Only the bucket owner (root account) can enabled/disable MFA-Delete
* MFA-Delete currently can only be enabled using the CLI

## S3 Default Encryption v. Bucket Policies
* The old way to enable default encryption was to use a bucket policy and refuse any HTTP command without the proper headers
* The new way is to use the "default encryption" option in s3
* Note: Bucket policies are evaluated before "default encryption."

## S3 Access Logs
* For audit purposes, you may want to log all access to s3 buckets
* Any request made to s3, from any account, authorized or denied, will be logged into another s3 bucket
* That data can be analyzed using data analysis tools
* Or Amazon Athena  as we'll see later in the section
* Log format: https://docs.aws.amazon.com/AmazonS3/latest/dev/LogFormat.html

user <--- (requests/response) ---> my-bucket --- (log all requests) ---> logging-bucket 

## S3 Cross-Region Replication
* eu-west-1 --- asynchronous replication ---> us-east-1
* Must enable versioning (source and destination)
* Must be in different regions
* Can be in different accountsaws s3 presign s3://original-bucket-byingling/coffee.jpg --region us-east-2
* Copy is asynchronous
* Must give proper IAM permissions to s3
* Use cases: compliance, lower latency access, replication across accounts

## S3 Pre-Signed URLs
* Can generate pre-signed URLs using SDK or CLI
    * For downloads (easy, can use CLI)
    * For uploads (harder, must use SDK)
* Valid for a default of 3600 seconds, can change timeout with `--expires-in-[TIME_BY_SECONDS]` argument
* Users given a pre-signed URL and will inherit the permissions of the person who generated the URL for GET / PUT
* Examples:
    * Allow only logged-in users to download a premium video from your S3 bucket
    * Ever changing list of users to download files by generating URLs dynamically
    * Allow temporarily a user to upload a file to a precise location in our bucket.

## S3 Storage Classes
* Amazon S3 Standard - General Purpose
* Amazon S3 Standard - Infrequent Access
* Amazon S3 One Zone-Infrequent Access
* Amazon S3 Intelligent Tiering
* Amazon Glacier
* Amazon Glacier Deep Dive
* Amazon S3 Reduced Redundancy Storage (deprecated - omitted)

## S3 Standard - General Purpose
* High durability - 99.999999999% of objects across multiple AZ
* If you store 10,000,000 objects with S3, you can on average expect to incur a loss of a single object once every 10000 years
* 99.99% availability over a given year
* Sustain concurrent 2 AZ disasters
* Use cases: big data analytics, mobile and gaming applications, content distribution

## S3 Standard - Infrequent Access
* Suitable for data that is less frequently accessed, but requires rapid access when needed
* High durability - 99.999999999% of objects across multiple AZ
* 99.9% availability
* Low cost compared to Amazon s3 standard
* Sustain concurrent 2 AZ disasters
* Use cases: as a datastore for disaster recovery, backups, ...

## S3 One Zone - Infrequent Access
* Same as IA but data is stored in a single AZ
* High durability - 99.999999999% of objects in a single AZ; data lost when AZ is destroyed
* 99.5% availability
* Low latency and high throughput performance
* Supports SSL for data at transit and encryption at rest
* Low cost compared to IA by 20%
* Use case: Storing secondary backup copies of on-premise data or storing data you can recreate

## S3 Intelligent Tiering
* Same low latency and high throughput performance of s3 standard
* Small monthly monitoring and auto-tiering fee
* Automatically moves objects between two access tiers based on changing access patterns
* Designed for durability of 99.999999999% of objects across multiple AZs
* Resilient against events that impact an entire AZ
* Designed for 99.9% availability over a given year

## Amazon Glacier
* Low cost object storage meant for archiving / backup
* Data is retained for the longer term (10s of years)
* Alternative to on-premise magnetic tape storage
* Average annual durability is 99.999999999%
* Cost per storage per month ($0.004 / GB) + retrieval cost
* Each item in Glacier is called "Archive" (up to 40TB)
* Archives are stored in Vaults

## Amazon Glacier and Glacier Deep Dive
* Amazon Glacier - 3 retrieval options
    * Expedited (1 to 5 mins)
    * Standard (3 to 5 hours)
    * Bulk (5 to 12 hours)
    * Min storage duration of 90 days
* Amazon Glacier Deep Dive - for longer term storage - cheaper:
    * Standard (12 hours)
    * Bulk (48 hours)
    * Min storage duration of 180 days

## S3 - Moving Between Storage Classes
* You can transition objects between storage classes
* For infrequently accessed object, move them to STANDARD_IA
* For archived objects, you don't need in real-time, GLACIER or DEEP_ARCHIVE
* Moving objects can be automated using a *lifecycle configuration*

## S3 Lifecycle Rules
* *Transition actions:* It defines when objects are transitioned to another storage class
    * Move objects to Standard IA class 60 days after creation
    * Move to Glacier for archiving after 6 months
* *Expiration actions:* configure objects to expire (delete) after some time
    * Access log files can be set to delete after 365 days
    * Can be used to delete old versions of files (if versioning is enabled)
    * Can be used to delete incomplete multipart uploads
* Rules can be created for a certain prefix (ex: s3://mybucket/mp3/*)
* Rules can be created for certain object tags (ex: Department: Finance)

## S3 Lifecycle Rules - Scenario 1
* Your application on ec2 creates image thumbnails after profile photos are uploaded to s3. These thumbnails can be easily recreated and only need to be kept for 45 days. The source images should be able to be immediately retrieved for these 45 days and afterwards, the user can wait up to 6 hours. How would you design this?
* s3 source images can be on STANDARD with a lifecycle configuration to transition them to GLACIER after 45 days
* s3 thumbnails can be on ONEZONE_IA with a lifecycle configuration to expire them (delete them) after 45 days

## S3 Lifecycle Rules - Scenario 2
* A rule in your company states that you should be able to recover your deleted s3 objects immediately for 15 days, although this may happen rarely. After this time, and for up to 365 days, deleted objects should be recoverable within 48 hours.
* You need to enable "versioning" in order to have object versions so that "deleted objects" are in fact hidden by a delete marker and can be recovered
* You can transition these "noncurrent versions" of the object to S3_IA
* You can transition afterwards these "noncurrent versions" to DEEP_ARCHIVE

## S3 Baseline Performance
* S3 automatically scales to high request rates, latency 100-200ms
* Your application can achieve at least 3500 PUT/COPY/POST/DELETE and 5500 GET/HEAD requests per second per prefix in a bucket
* No limits to the number of prefixes in a bucket
* Example (object path => prefix)
    * bucket/folder1/sub1/file -> /folder1/sub1
    * bucket/folder1/sub2/file -> /folder1/sub2
    * bucket/1/file -> /1/
    * bucket/2/file -> /2/
* If you spread reads across all four prefixes evenly, you can achieve 22000 request per second for HEAD and GET

## S3 KMS Limitation to Performance
* If you use SSE-KMS you may be impacted by the KMS limits
* When you upload, it calls the GenerateDataKey KMS API
* When you download, it calls the Decrypt KMS API
* Count toward the KMS quota per second (5500, 10000, 30000 req/s based on region)
* As of today you cannot request a quota increase for KMS
users <--- upload/download SSE-KMS ---> S3 bucket <--- API call ---> KMS key

## S3 Performance
* Multi-part upload
    * recommended for files -> 100MB
    * must use for files > 5GB
    * helps parallelize uploads (speed up transfers)
    * Big file --- (uploaded in parts, parallelized) ---> S3
* S3 Transfer Acceleration (upload only)
    * Increase transfer speed by transferring file to an AWS edge location which will forward the data to the S3 bucket in the target region
    * Compatible with multi-part upload
    * Minimizes the amount of public Internet we go through, maximize AWS network we go through
    * File in USA --- (public www ) ---> Edge Location, USA --- (private AWS) ---> S3 Bucket in Australia

## S3 Performance -- S3 Byte-Range Fetches
* Parallelize GETs by requesting specific byte ranges
* Better resilience in case of failures
* Can be used to speed up downloads

## S3 Select & Glacier Select
* Retrieve less data using SQL by performing server side filtering
* Can filter by rows and columns (simple SQL statements)
* Less network transfer, less CPU cost client side
user --- Get CSV with S3 select (only gettting rows/columns) ---> S3 (performs filter server side)
        <--- Send filtered dataset ---

## Athena Overview
* Serverless service to perform analytics directly against s3 files
* Use SQL language to query files
* Has a JDBC / ODBC driver
* Charged per query and amount of data scanned
* Supports CSV, JSON, ORC, Avro, and Parquet (built on Presto)
* Use cases: Business intelligence / analytics / reporting, analyze & query VPC Flow Logs, ELB Logs, CloudTrail trails, etc.
* Exam Tip: Analyze data directly on S3 -> use Athena

## S3 Object Lock and Glacier Vault Lock
* S3 Object Lock
    * Adopt a WORM (Write Once Read Many) model
    * Block an object version deletion for a specified amount of time
* Glacier Vault Lock
    * Adopt a WORM (Write Once Read Many) model
    * Lock the policy for future edits (can no longer be changed)
    * Helpful for compliance and data retention
