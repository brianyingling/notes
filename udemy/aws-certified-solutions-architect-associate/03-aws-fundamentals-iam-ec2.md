# AWS Certified Solutions Architect - Associate

## Section 3 - AWS Fundamentals - IAM and EC2

### Introduction

### AWS Regions

Regions exist all around the world - us-east-1, etc.

Each region has multiple availability zones: us-east-1a, us-east-1b

Availability zones are recognized with a letter, a through f.

Each availability zone is a physical data center in the region, but separate from the others so they are isolated from disasters

AWS consoles are region scoped (except IAM and S3)

https://aws.amazon.com/about-aws/global-infrastructure

### IAM introduction

* IAM ( Identity and Access Management )
* Your whole AWS security is there:
    * Users
    * Groups
    * Roles
* Root account should never be used (and shared)
* Users must be created with proper permissions
* IAM is at the center of AWS
* Policies are written in JSON

Users
- Usually a typical person

Groups
- functions (admins, devops)
- teams (engineering, design)
- contains users

Roles
- Internal usage within AWS resources
- Roles are what we give to internal machines

Policies (JSON docs)
- defines what each can and cannot do

* IAM has a *global* view
* Permissions are governed by Policies
* MFA (multifactor authentication) can be setup
* IAM has predefined managed policies
* least privilege principles - give users the minimal amount of permissions they need to perform their job


### IAM Federation

* Big enterprises usually integrate their own repository of users with IAM
* This way one can login to AWS using their company credentials
* Identity Federation uses the SAML standard (Active Directory)

### IAM 101 Brain Dump
* One IAM user per Physical Person
* One IAM Role per Application
* IAM credentials should NEVER BE SHARED
* Never write IAM credentials in code
* Never use the Root account except for initial setup
* Never use Root IAM credentials

### EC2 Introduction

What is EC2?
* One of AWS's most popular offerings
* Mainly:
    * rents virtual machines
    * storing data on virtual drives (EBS)
    * distributing load across machines (ELB)
    * scaling services using an auto-scaling group (ASG)

### SSH Summary Table

Use Putty for Windows less than v. 10
EC2 Instance Connect allows users to connect to your instance on any OS using your browser

### How to SSH into EC2 instance

SSH allows you to control a machine remotely

Computer will access port 22 of your ec2 instance

Need to use the key .pem file to access our instance via SSH

To access:

`ssh -i EC2Tutorial.pem ec2-user@xx.xx.xx.xx`

When downloaded, PEM files have a permisssion of 0644 and that is too open. Since the key is available to other users, it cannot be used and the terminal will not allow you to ssh into the machine.

To fix, use chmod:

`chmod 0400 EC2Tutorial.pem`

Amazon EC2 Instance connect (browser-based) only works with Amazon Linux 2 instances

### Introduction to Security Groups

* Security groups are fundamental to network security in AWS
* Control how traffic is allowed into and out of our EC2 instances
* It is a very fundamental skill to learn to troubleshoot networking issues
* Will learn to use inbound and outbound ports
* Security Groups have name, description, inbound, outbound, and tags
* Inbound - all the rules that will allow traffic into our instance (we added SSH as a rule)
* Outbound - all traffic allowed out of the instance (by default all our allowed)
* Timeout - attempting to ssh into an instance without an ssh inbound rule will cause a timeout

### Security Groups Deep Dive
* Basically act as a "firewall" on ec2 instances
* They regulate:
    * access to ports
    * Authorized IP ranges - IPv4 and IPv6
    * Control of inbound to network (from other to the instance)
    * Control of outbound from network (from instance to the other)
* Things to Know:
    * Can be attached to multiple instances (many-to-many relationship -- one instance can belong to many security groups and one security group can have many instances)
    * Locked down to region / VPC combination, switching to another region or VPC requires creating another security group for that region or VPC
    * Does live outside the EC2 - if traffic is blocked the EC2 instance won't see it
    * It's good to maintain one separate security group just for SSH access
    * If your application is not accessible via timeout, it's likely a security group issue
    * If you receive a "connection refused" error then it's an application error or it's not launched
* How to reference Security Groups from other Security Groups?
    * EC2 instances can allow for other security groups to have access to it, say inbound traffic is permitted from Security Group 1 and 2, but not 3; any instance with Security Group 3 will not be able to access the other instance.

### Private v Public v Elastic IP
* Private v Public IP (IPv4)
    * Networking has two types of IPs: IPv4 and IPv6
        * IPv4: 1.160.10.240
        * IPv6: -- very long string ---
    * We're only using IPv4
    * IPv4 allows for 3.7 billion addresses in the public space
    * IPv4: [0-255].[0-255].[0-255].[0-255]
    * Private network has a series of servers / computers that can talk to one another within the network but not outside directly
    * Internet gateway (public) - computers in the private network communicate outside via the Internet Gateway, which is publicly accessible
    * Public IP - accessible publicly over the internet
    * Private IP - only accessible from within the network
* Fundamental differences:
    * Public IP
        * can be identified on the internet
        * must be unique across the internet
        * can be geolocated easily
    * Private IP
        * can only be identified on the private network
        * must be unique within the private network
        * TWO different private networks can have the same IP because they are only accessible from within the private network
        * Machines connect to the internet via internet gateway (a proxy)
        * Only a specified range of IPs can be used as private IPs
    * Elastic IP
        * When you start and stop an EC2 instance, it can change its public IP
        * If you need a fixed public IP for your instance, you need an elastic IP
        * An elastic IP is a public IPv4 you own as long as you don't delete it
        * You can attach it to one instance at a time
        * With an Elastic IP address, you can mask the failure of an instance or software by rapidly remapping the address to another instance in your account
        * You can only have 5 Elastic IP in your account (you can ask AWS to increase this)
        * Overall, try to avoid using Elastic IP
            * Reflect poor architectural decisions
            * Instead use a random public IP and register a DNS name to it
            * Or, use a Load Balancer and don't use a public IP
    * By default, our EC2 machine comes with:
        * a private IP for the internal AWS network
        * a public IP address
    * When we are doing SSH into our ec2 instances:
        * we can't use a private IP because we are not in the same network
        * we can only use the public IP
    * If your machine stopped and started, the public IP can change

### Launching an Apache Server on EC2
* Use Apache to display a web page
* Create an index.html that shows the hostname of our machine

* SSH into the machine
* run `sudo su` to get superuser controls
* run `yum update -y` to update the packages
* run `yum install -y httpd` to install Apache
* run `systemctl start httpd.service` to start the Apache service
* run `systemctl enable httpd.service` to enable the service on restarts
* curl `localhost:80` should result in returning an html page

Going to the browser and attempting to access Apache server through the instance's IP address results in a timeout, we need to configure security group to allow for HTTP inbound requests

After adding an HTTP inbound rule to our security group on port 80, we can now see the default Apache test page. We would need to add content to `/var/www/html`

### EC2 User Data
* It is possible to bootstrap our instances using an EC2 User Data script
* Bootstrapping means launching commands when the machine starts
* That script is only run once at the instance first start
* EC2 user data is used to automate boot tasks such as:
    * Installing updates
    * Installing software
    * Downloading common files from the internet
    * Anything you can think of :-)
* EC2 Data Script runs with the root user
* Hands on: What are we going to do?
    * We want to make sure this ec2 instance has Apache HTTP server installed to display a simple page
    * We will write a User Data script




