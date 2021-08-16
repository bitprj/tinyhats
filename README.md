![image](https://user-images.githubusercontent.com/69332964/128773669-a4c000e4-bd8b-4e29-8498-f7f9d88027cd.png)

<h4 align="center">Click <a href="https://github.com/bitprj/intro-to-k8s/tree/bugs">here</a> to see the "buggy" version 🐛</h4>

# The Scenario
TinyHat.Me is an up and coming startup that provides an API to allow users to try on tiny hats via a REST API. The startup is looking to you to ship some awesome new features! While we have a frontend working to serve tiny hats from a database, the startup is looking to add some exciting new features. Today, as the newest backend engineer at TinyHat.Me, you are going to be learning how the microservices work, as well as fix a few outstanding bugs from our customers!

<img src="https://user-images.githubusercontent.com/69332964/128766963-f2cce4f8-076c-4cff-a4a7-67be99ea6616.png" width=429 height=217></img>

## The Outline
### 🔨 Building
- What are Microservices?
- Let's write the `/email` and `/moderate` services!
- Hello? Are you there? How do the pods communicate?
### 🚀 Deploying
- What even is Kubernetes, the whale, and containers?
- Containerizing with Docker
- EKS: it does not stand for Ecstatic Kittens Surfing
- Let's spring into action: Deploying Continuously with Github
- Routing traffic with Route53 and DNS configuration
### 🐛 Debugging
- Yikes! Innappropriate hats are on the website!
- We have complaints about the `fetch` feature...
- The moderate can't moderate?

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

Emails moderator with your proposed hat for moderation.

### Flowchart
![image](https://user-images.githubusercontent.com/69332964/126816456-d5c5e4b5-243b-457a-a9e1-e643c0ffbd35.png)

