# AWS Certified Solutions Architect

## Section 6: AWS Fundamentals - RDS + Aurora + ElastiCache

## AWS RDS Overview
* RDS - Relational Database Service
* It's a managed DB service for DB use with SQL as the query language
* Allows you to create databases in the cloud that are managed by AWS
* Databases:
    * Postgres
    * MySQL
    * MariaDB
    * Oracle
    * Microsoft SQL Server
    * Aurora (AWS Proprietary DB)

## Advantage Over Using RDS Versus Deploying DB on EC2
* RDS is a managed service:
    * automated provisioning, OS patching
    * continuous backups and restore to specific timestamps (Point in Time restore!)
    * Monitoring dashboards
    * Read replicas for improved read performance
    * Multi availability zone setup for DR (Disaster Recovery)
    * Maintenance windows for upgrades
    * Scaling capability (vertical and horizontal)
    * Storage backed by EBS (gp2 or io1)
* But you CAN'T SSH into your instances

## RDS Backups
* Backups are automatically enabled in RDS
* Automated backups:
    * Daily full backup of the database (during the maintenance window)
    * Transaction logs are backed up by RDS every 5 minutes
    * -> ability to restore to any point in time (from oldest backup to 5 mins ago)
    * 7 days retention (can be increased to 35 days)
* DB snapshots
    * backups that are manually triggered by the user
    * Retention of backup for as long as you want

## RDS Read Replicas for Read Scalability
* Can create up to 5 read replicas
* With same AZ, cross AZ, or cross region
* Replication is asynchronous, so reads are eventually consistent
--- application ---
    (reads)
        |
        v
 --- main rds db ---
/                   \
(async replication)  (async replication)
-- RDS DB               --- RDS DB instance Read Replica
    instance
    read     
    replica

* eventually consistent - here reads may read old data because there's a chance a request for data may come in before the change has replicated to the RDS instance from which you're reading
* Replicas can be promoted to their own DB
* Applications must update the connection string to leverage read replicas

## RDS Read Replicas - Use Cases
* You have a production database that is taking on normal load
-- Prod Application --
V ^ (reads, writes)
-- M (RDS DB instance)
* You want to run a reporting application and some analytics
* This reporting application may overload and potentially slow down the application
* You create a Read Replica to run the new workload there

-- Prod Application --
V ^ (reads, writes)
-- M (RDS DB instance) ---> (async replication) -- R RDS instance read replica -- --> reporting application reads from the read replica
* The production application is unaffected
* Read replicas are used for `SELECT`, (=read) only kinds of statements (not `INSERT`, `UPDATE`, `DELETE`)

## RDS Read Replicas - Network Cost
* In AWS, there's a network cost when data goes from one availability zone to another


--- Availability Zone ---           --- Availability Zone ---
(us-east-1a)                        (us-east-1b)
M - RDS DB instance                 R - RDS DB instance read replica
--- > Asynchronous replication going from `us-east-1a` to `us-east-1b` is going to cost more because you're crossing AZs

* To reduce cost, have your read replicas in the same Availability Zone

                --- Availability Zone ---           
                    (us-east-1a)                        
M - RDS DB instance                 R - RDS DB instance read replica
--- > Asynchronous replication is free because it's in the same AZ

## RDS Multi-Availability-Zone - Disaster Recovery (DR)
* Sync replication
* One DNS name - automatic app failover to standby
* increase availability
* Failover in case we lose the AZ, loss of network, instance or storage failure 
* No manual intervention in apps
* Not used for scaling
* NOTE: The Read Replicas be setup as multi-AZ for Disaster Recovery (DR)

-- Application --
^ v, reads, writes
One DNS name - automatic failover
M - RDS Master DB instance (AZ A)  ----> (sync replication) S - RDS instance Standby (AZ B)
* Common Exam Question: You can setup your Read Replicas to be Multi-AZ for Disaster Recovery

## RDS Security - Encryption
* At rest encryption
    * Possibility to encrypt the master and read replicas with AWS KMS - AES-256 encryption
    * Encryption has to be defined at launch time
    * *If the master is not encrypted, the read replicas also cannot be encrypted!* - exam question
    * Transparent Data Encryption (TDE) available for Oracle and SQL Server

* In-flight Encryption
    * SSL certificates to encrypt data to RDS in-flight
    * Provide SSL options with trust certificate when connecting to database
    * To enforce SSL:
        * PostgreSQL - `rds.force_ssl = 1` in the AWS RDS Console (Parameter Group)
        * MySQL: Within the DB: `GRANT USAGE ON *.* TO 'mysqluser'@'%' REQUIRE SSL;`

## RDS Security - Network and IAM
* Network Security
    * RDS databases are usually deployed within a public subnet, not in a public one
    * RDS security works by leveraging security groups (the same concept as for EC2 instances) - it controls with IP / security group can communicate with RDS
* Access Management
    * IAM policies help control who can manage AWS RDS (through the RDS API)
    * Traditional Username and Password can be used to login to the database
    * IAM-based authentication can be used to login to RDS MySQL and PostgreSQL

## RDS - IAM Authentication
* IAM database authentication works with MySQL and PostgreSQL
* You don't need a password, just an authentication token obtained through IAM and RDS API calls
* Auth token has a lifetime of 15 minutes
* Benefits:
    * Network in/out must be encrypted using SSL
    * IAM to centrally manage users instead of within the db
    * Can leverage IAM roles and EC2 instance profiles for easy integration

--- EC2 Security Group ---
IAM role
ec2 instance   <--- API Call to get authorization token ---> RDS Service
|
|
|  SSL encryption (pass authentication token)
v
--- RDS Security Group ---
MySQL db

## RDS Security
* Encryption at rest
    * Is done when you first create the DB instance
    * or: unencrypted DB -> snapshot -> copy snapshot as encrypted -> create DB from snapshot
* Your responsibility
    * Check the ports / IP / security group inbound rules in DB's Security Group
    * In-database user creation and permissions or manage through IAM
    * Create a database with or without public access
    * Ensure parameter groups or DB is configured to only allow SSL connections
* AWS responsibility:
    * No SSH access
    * No manual DB patching
    * No manual OS patching
    * No way to audit the underlying instance
    

