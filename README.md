# Introduction to Kubernetes


# The Scenario
UWUaaS (UWU as a Service) is an up and coming startup that provides an API to serve cute images to its users via a REST API. The startup is looking to you to ship some awesome new features! While we have a frontend working to serve cute images from a database, the startup is looking to add some exciting new features. Today, as the newest backend engineer at UWUaaS, you are going to be adding a new microservice, as well as fix a few outstanding bugs from our customers!

![image](https://user-images.githubusercontent.com/69332964/126816456-d5c5e4b5-243b-457a-a9e1-e643c0ffbd35.png)

## The Outline
- Deploying containers to AWS 
- Installing Pixie 
- Why is the API so slow? Let's figure that out?
- Why are the images being returned cats? and cats only?
- Let's create a new service!
- dogs and cats?
- [Implementing the new feature] Adding filters to the cats? 
- Modifying yaml to deploy the service

## The Services

### `/email`
#### Input
Send in request body:
```json
....your html
```
Send email in a parameter named `send`

