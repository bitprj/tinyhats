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

router.post('/', upload.any(), async (req, res) => {
    let formData = new FormData()
    formData.append('file', req.files[0].buffer, {filename: "face", data: req.files[0].buffer})
    const formHeaders = formData.getHeaders();
    const fetchResp = await fetch(`http://${process.env.FETCH_ENDPOINT}/fetch`, {
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

router.post('/:apiName', upload.any(), async (req, res) => {
    console.log(`[!] ${req.params.apiName} was accessed.`)
    let route = req.params.apiName

    if (route == "add") {
        let image = req.files[0].buffer
        let name = req.body.name
        console.log("Requesting moderation and uploading image...")
    
        // hit the add endpoint to add image and begin approval process
        let formData = new FormData()
        formData.append('file', image, {filename: "baby", data: image})
        formData.append('name', name)
        const formHeaders = formData.getHeaders();
    
        console.log(process.env.ADD_ENDPOINT)
        
        const addResp = await fetch(`http://${process.env.ADD_ENDPOINT}/add`, {
            method: 'POST',
            body: formData,
                headers: {
                ...formHeaders,
                },        
        });
    
        var result = await addResp.json()
        console.log(`Received from /add: ${JSON.stringify(result)}`)
        res.send({result})
    } else {
        let formData = new FormData()
        formData.append('file', req.files[0].buffer, {filename: "face", data: req.files[0].buffer})
        const formHeaders = formData.getHeaders();
        const fetchResp = await fetch(`http://${process.env.FETCH_ENDPOINT}/fetch?style=${route}`, {
            method: 'POST',
            body: formData,
            headers: {
            ...formHeaders,
            },  
        });

        console.log("Fetching base64 image")
    
        var result = await fetchResp.json()
        res.send({result}) 
    }
})

router.get('/', upload.any(), async (req, res) => {
    const addResp = await fetch(`http://${process.env.FETCH_ENDPOINT}/fetch`, {
        method: 'GET',      
    });

    console.log("Fetching base64 image")

    var result = await addResp.json()
    res.send({result}) 
})

router.get('/:apiName', upload.any(), async (req, res) => {
    console.log(`[!] ${req.params.apiName} was accessed.`)

    let route = req.params.apiName;
    if (route == "moderate") {
        let approve = req.query.approve;
        let id = req.query.id;
        const moderateResp = await fetch(`http://${process.env.MODERATE_ENDPOINT}/moderate?approve=${approve}&id=${id}`, {
            method: 'GET'
        })
    
        var result = await moderateResp.text()
        res.send({result})
    } else {
        const addResp = await fetch(`http://${process.env.FETCH_ENDPOINT}/fetch?style=${route}`, {
            method: 'GET',      
        });
    
        console.log("Fetching base64 image")
    
        var result = await addResp.json()
        res.send({result}) 
}
})

app.use('/', router)

app.listen(PORT, () => {
    console.log(`API Gateway started on port ${PORT}`)
})