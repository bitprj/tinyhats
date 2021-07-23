const express = require('express')
const multer = require('multer')
const FormData = require('form-data')
const upload = multer()
const fetch = require("node-fetch")
const app = express()
var router = express.Router();
const PORT = 4444

// for testing locally: node -r dotenv/config index.js  
// https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get


app.use('/', router)

app.listen(PORT, () => {
    console.log(`API Gateway started on port ${PORT}`)
})

router.post('/add', upload.any(), async(req, res) => {
    let image = req.files[0].buffer
    let name = req.body.name
    console.log("Requesting moderation and uploading image...")

    // hit the add endpoint to add image and begin approval process
    let formData = new FormData()
    formData.append('file', image, {filename: "baby", data: image})
    formData.append('name', name)
    const formHeaders = formData.getHeaders();
    
    const addResp = await fetch("http://localhost:31337/add", {
        method: 'POST',
        body: formData,
            headers: {
            ...formHeaders,
            },        
    });

    var result = await addResp.json()
    console.log(`Received from /add: ${JSON.stringify(result)}`)
    res.send({result}) 
});

router.get('/fetch', upload.any(), async(req, res) => {
    const addResp = await fetch("http://localhost:1337/fetch", {
        method: 'GET',      
    });

    console.log("Fetching base64 image")

    var result = await addResp.json()
    res.send({result}) 
});