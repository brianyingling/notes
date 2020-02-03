# An Introduction to Helm, the Package Manager for Kubernetes
https://www.digitalocean.com/community/tutorials/an-introduction-to-helm-the-package-manager-for-kubernetes
___

## Introduction
1. Kubernetes has many different resources -- pods, services, deployments, replica sets, etc.
2. Each requires a detailed YAML manifest file
3. Helm - K8s package manager that allows developers to more easily package, configure and deploy applications and servivces on K8s.

## An Overview of Helm
1. Helm can:
    * Install and upgrade software
    * Automatically install software dependencies
    * Configure software deployments
    * Fetch software packages from repositories
2. Helm provides this functionality using these:
    * Helm CLI
    * Tiller - server component that runs on your cluster and listens to commands from Helm, & handles config
    * Charts - Helm packaging format
    * Curated charts repository with prepackaged charts for open source projects

## Charts
1. Helm packages are called Charts
2. A chart consists of:
    * YAML configuration files
    * Templates that render into K8s manifest files
3. A chart's directory structure:
    ```
    package-name/
    charts/
    templates/
    Chart.yaml
    LICENSE
    README.md
    requirements.yaml
    values.yaml
    ```
4. A chart's directory structure:
    * `charts/`
        * Manually managed Chart dependencies are placed here
        * Can also use `requirements.yaml` to dynamically link dependencies
    * `templates/`
        * Contains template files that are combined with `values.yaml` and command line args
        * These are rendered in K8s manifests
    * `Chart.yaml`
        * Contains metadata about the chart
        * example info: name, version, maintainer info
    * `LICENSE` - plaintext license
    * `README.md` - Standard readme file in Markdown
    * `requirements.yaml` - Lists the chart's dependencies
    * `values.yaml` - default configuration values for the chart
5. Installation
    * `helm` command can install a chart from a local directory or from a packaged tar
    * Tars can be automatically downloaded and installed from chart repos

## Chart Repositories
1. chart repo - Simple HTTP site that includes a:
    * `index.yaml`
    * `.tar.gz` packaged charts
2. `helm` command can help package these charts
3. Files can be served by any web server, object storage server, or a static site like Github Pages
4. `helm` comes preconfigured with a default chart repo called a stable.
5. default stable:
    * Points to a Google storage bucket - `https://kubernetes-charts.storage.googleapis.com.`
6. alternative repos:
    * can be added with the `helm repo add` command
    * incubator
    * Bitnami Helm Charts
7. Charts need to be configured for your setup, regardless if it was developed locally or downloaded from a repo

## Chart Configuration
1. Charts come with a default configuration in `values.yaml`
2. You'll likely need to override at least some of the default config
3. Values that are exposed for use are determined by the chart's author
4. How to override values:
    * Write your own YAML file and run `helm install`
    * Use the `--set` flag

## Releases
1. Chart installation combines Chart templates with user's specific config and defaults in `values.yaml`. 
2. These are then rendeed in K8s manifests that are then deployed using the k8s API. This creates a:
3. release - a Helm chart deployed with a particular configuration
4. Important because you may want to deploy the same app more than once
5. Can upgrade different instances of a chart
6. Each upgrade creates a new revision of a release
7. Helm allows for users to easily roll back to a previous version.

## Creating Charts
1. `helm create <chart-name>` - outputs the scaffolding of a chart directory
2. Then need to fill out chart's metadata in `Chart.yaml`
3. K8s manifest files belong in the `templates` directory
4. Need to then extract relevant config variables out of manifests and place them in `values.yaml`
5. use the templating system to return those values back in manifest templates
6. `helm` has many subcommands to help test, package, and serve charts

## Conclusion
1. We reviewed Helm, k8s package manager
2. We overviewed the Helm architecture and `helm` and `tiller` components
3. Detailed the chart format and its repositories
4. Explored how to configure a Helm chart and how they are configured for release
5. Talked about creating a new Helm chart when one wasn't available





