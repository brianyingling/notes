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

