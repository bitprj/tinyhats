const express = require('express')
const multer = require('multer')
const FormData = require('form-data')
const upload = multer()
const fetch = require("node-fetch")
const rateLimit = require("express-rate-limit");
const cors = require('cors')
const app = express()
var router = express.Router();
const PORT = 4444

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests - we don't have any more hats left! Please try again later."
});
  
//  apply to all requests
app.use(limiter);

app.use(cors());

// for testing locally: node -r dotenv/config index.js  
// https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get

router.post('/mockup/:apiName', upload.any(), async (req, res) => {
    console.log(`[!] /mockup/${apiName} was accessed.`)
    let param = req.params.apiName
    let formData = new FormData()
    formData.append('file', req.files[0].buffer, {filename: "face", data: req.files[0].buffer})
    const formHeaders = formData.getHeaders();
    const fetchResp = await fetch(`http://mockup-service:80?` + `style=${param}`, {
        method: 'POST',
        body: formData,
        headers: {
        ...formHeaders,
        },  
    });

    console.log("Fetching base64 image")

    var result = await fetchResp.json()
    res.send({result}) 
})

router.post('/admin', upload.any(), async (req, res) => {
    console.log(`[!] /admin was accessed.`)

    let image = req.files[0].buffer
    let name = req.body.name
    console.log("Uploading new product...")

    // hit the add endpoint to add image and begin approval process
    let formData = new FormData()
    formData.append('photo', image, {filename: "face", data: image})
    formData.append('name', name)
    const formHeaders = formData.getHeaders();
        
    const addResp = await fetch(`http://admin-service:80`, {
        method: 'POST',
        body: formData,
            headers: {
            ...formHeaders,
            },        
    });

    var result = await addResp.json()
    console.log(`Received from admin-service: ${JSON.stringify(result)}`)
    res.send({result})
})

router.get('/catalog', upload.any(), async (req, res) => {
    console.log(`[!] /catalog was accessed.`)

    const adminResp = await fetch(`http://product-service:80`, {
        method: 'GET'
    })

    var result = await adminResp.json()
    res.send({result})
})

app.use('/', router)

app.listen(PORT, () => {
    console.log(`API Gateway started on port ${PORT}`)
})
