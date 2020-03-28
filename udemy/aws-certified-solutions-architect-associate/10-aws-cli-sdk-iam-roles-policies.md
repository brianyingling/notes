# # AWS Certified Solutions Architect - Associate

## Section 10 - AWS CLI SDK IAM Roles and Policies

## Introduction
* So far we've interacted with services manually and they exposed standard info for clients
    * ec2 exposes a standard Linux machine we can use any way we want
    * rds exposes a standard database we can connect to using a URL
    * ElastiCache exposes a cache URL we can connect to using a URL
    * ASG / ELB are automated and we don't have to program against them
    * Route 53 setup was manual
* Developing with AWS has two components:
    * How to perform interactions with AWS without using the online console?
    * How to interact with AWS proprietary services (s3, DynamoDB, etc)
* Developing and performing AWS tasks against AWS can be done in several ways:
    * Use AWS CLI on our local computer
    * Use AWS CLI on our ec2 instances
    * Use AWS SDK on our local computer
    * Use AWS SDK on our ec2 instances
    * Use AWS Instance Metadata Service for ec2
* In this section, we'll learn:
    * How to do all of those
    * In the right and most secure way, adhering to best practices

## AWS CLI Configuration
* Let's learn how to properly configure the CLI
* We'll learn how to get our access credentials and protect them
* Don't share AWS Access Key and Secret key!
* `aws configure` command:
    * enter AWS Access Key ID:
    * enter AWS Secret Access Key
    * enter region name
    * enter output format
    * saves these in `~/.aws` folder

## AWS CLI on EC2 ... THE *BAD* WAY
* We could run `aws configure` on ec2 just like we did (and it'll work)
* But it's VERY INSECURE
* NEVER EVER EVER PUT YOUR PERSONAL CREDENTIALS ON EC2
* Your PERSONAL credentials are PERSONAL and only belong on your PERSONAL computer
* If your ec2 instance is compromised, so is your account
* If the ec2 instance is shared, people may perform AWS actions while impersonating you
* For ec2 there is a better way ... IAM roles

## AWS CLI on EC2 ... THE RIGHT WAY
* IAM roles can be attached to ec2 instances
* IAM roles can come with a policy authorizing exactly what the ec2 instance should be able to do

AWS NETWORK
----------------------------
ec2 instance   --- (CLI) ---> AWS Account
IAM Role                      checks credentials and permissions of the role

* ec2 instances can then use these profiles automatically without any additional configurations
* This is the best practice on AWS and you should do this 100% of the time
* Always always always use IAM roles for ec2 instances when they need to do something
* role - any service can have its own set of permissions
* When applying a policy, it doesn't immediately take effect, it can take time

* AWS CLI S3 documentation:
    * https://docs.aws.amazon.com/cli/latest/reference/s3/

## AWS EC2 Instance Metadata
* Is powerful but one of the least known features
* Allows EC2 instances to learn about themselves without using an IAM role for that purpose
* URL for it is `http://169.254.169.254/latest/meta-data`
* You can retrieve the IAM role name from the metadata but you cannot retrieve the IAM policy
* Metadata = info about ec2 instance
* Userdata = launch script of the ec2 instance
* Let's practice!

## AWS SDK Overview
* What if you want to perform actions on AWS directly from your applications code? (without using CLI)
* You can use an SDK (software dev kit)
* Official SDKs are:
    * Java
    * .NET
    * Node.js
    * PHP
    * Python (named boto3/botocore)
    * Go
    * Ruby
    * C++
* We have to use the AWS SDK when coding against AWS Services such as DynamoDB
* Fun fact...the AWS CLI uses the Python SDK (boto3) -- it's a wrapper around the SDK
* We'll practice AWS SDK when we get to Lambda functions
* Good to know -- if you don't specify or configure a default region, then `us-east-1` will be chosen by default

## AWS SDK Credentials Security
* It's recommended to use the default credential provider chain
* The default credential provider chain works seamlessly with:
    * AWS credentials at ~/.aws/credentials (only on our computers or premise)
    * Instance Profile Credentials using IAM roles (for ec2 machines)
    * Environment variables (AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY)
* Overall, *NEVER EVER STORE AWS CREDENTIALS IN YOUR CODE*
* Best practice is for credentials to be inherited from mechanisms above and 100% IAM roles if working from with AWS services

## Exponential Backoff
* Any API that fails because of too many calls needs to be retried with Exponential Backoff
* These apply to Rate limited API
* Retry mechanism included in SDK API calls