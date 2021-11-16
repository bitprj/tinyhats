![image](https://user-images.githubusercontent.com/69332964/128773669-a4c000e4-bd8b-4e29-8498-f7f9d88027cd.png)

<h4 align="center">Click <a href="https://github.com/bitprj/tinyhats/tree/readme-update/scenarios">here</a> to see the "buggy" versions 🐛</h4>

# The Scenario
TinyHat.Me is an up and coming startup that provides an API to allow users to try on tiny hats via a REST API. The startup is looking to you to ship some awesome new features! While we have a frontend working to serve tiny hats from a database, the startup is looking to add some exciting new features. Today, as the newest backend engineer at TinyHat.Me, you are going to be learning how the microservices work, as well as fix a few outstanding bugs from our customers!

<img src="https://user-images.githubusercontent.com/69332964/128766963-f2cce4f8-076c-4cff-a4a7-67be99ea6616.png" width=429 height=217></img>

## Featured In
* [New Relic One and Pixie AWS Workshop](https://newrelic.awsworkshop.io/pixie/prereqs/)
* [New Relic Pixie Tutorial](https://developer.newrelic.com/collect-data/pixie/)

## Run `tinyhats` Locally without S3
### Download `minikube`
Follow instructions [here](https://v1-18.docs.kubernetes.io/docs/tasks/tools/install-minikube/) to install minikube.

### Deploy Cluster
```
minikube start
```
### Download Kubernetes Manifests
Clone this repository and `cd` into root directory.
```
kubectl apply -f kube-local
```
### Test Cluster
To test the API directly:
```
minikube service -n default --url gateway-service
```
To interact with the API through the frontend:
```
minikube service -n default --url frontend-service
```
### Cleaning Up
```
minikube delete
```

## Deploying `tinyhats` with EKS and S3
### S3 Bucket
Click [here](https://console.aws.amazon.com/s3/home) to access the S3 console.

#### Creating the bucket
Click `Create bucket`.

1. Name your bucket in the `Bucket name` field. (Example: `tinyhats`)
2. Edit the Public Access settings to match the configuration below:

![](https://i.imgur.com/u6ZrfvH.png)
3. Leave all other settings as defult and click `Create bucket`.

#### Allowing public access
On the S3 console, click on the newly created S3 bucket by identifying it with the name you assigned it to. (Example: `tinyhats`)

1. Click on `Permissions` and scroll down to `Bucket policy`.
2. Click `Edit` and paste the below policy in the editor, **remembering to replace `tinyhats` with your bucket name**
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AddPerm",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::tinyhats/*"
        }
    ]
}
```
3. Click `Save changes`. If you configured your bucket correctly, you should see the labels `Publicly accessible` and Access labeled as `Public`.
![](https://i.imgur.com/cYq2MYc.png)

### Deploying the Cluster
> Ensure you have a running cluster and `kubectl` configured.
Obtain your AWS ID and Secret. Export these into environment variables.
```
export S3_ID=[your S3 ID]
export S3_SECRET=[your S3 secret]
```
Clone this directory. Change directory (`cd`) into the `kube` folder and run the below command to apply your S3 secrets and deploy the Kubernetes resources.
```
for f in *.yaml; do envsubst < $f | kubectl apply -f -; done
```
## API Documentation
[![Run in Postman](https://run.pstmn.io/button.svg)](https://god.gw.postman.com/run-collection/13335676-7e8c1f75-79bc-4cfa-aa5f-58ca98530a85?action=collection%2Ffork&collection-url=entityId%3D13335676-7e8c1f75-79bc-4cfa-aa5f-58ca98530a85%26entityType%3Dcollection%26workspaceId%3D98a973b2-634a-4c12-8263-bcdb4ab93659)
#### Parameters
> `api.tinyhat.me?number=2`
`?number` (optional): How many hats you want!
### `[GET] /`
> `api.tinyhat.me`
Returns a random tinyhat on Bob Ross.

### `[GET] /${hat style}`
> `api.tinyhat.me/santa`
Returns a specific hat style on Bob Ross.

### `[GET] /api/hats`
> `api.tinyhat.me/api/hats`
Returns a JSON object of all hats' image links and style identifiers.

### `[POST] /`
> `api.tinyhat.me` POST with multipart/form-data: image with face

Returns a random tinyhat on your POSTed image.

### `[POST] /${hat style}`
> `api.tinyhat.me/santa` POST with multipart/form-data: image with face

Returns a specific hat style on your POSTed image.
### `[POST] /add`
> `api.tinyhat.me/add` POST with multipart/form-data: image with hat and `name` attribute

Adds the image to the `admin` page to queue for approval.

### Flowchart
![flowchart](https://user-images.githubusercontent.com/69332964/141996439-d990abde-91b1-4720-afe7-5f38eb3ef9e0.png)

