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

function getNumber(req) {
    let param = ""
    if (req.query.number != undefined) {
        param = `number=${req.query.number}`
    }

    return param
}

router.post('/', upload.any(), async (req, res) => {
    let param = getNumber(req)
    let formData = new FormData()
    formData.append('file', req.files[0].buffer, {filename: "face", data: req.files[0].buffer})
    const formHeaders = formData.getHeaders();
    const fetchResp = await fetch(`http://${process.env.FETCH_ENDPOINT}/fetch?` + param, {
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
        formData.append('photo', image, {filename: "baby", data: image})
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
        let param = getNumber(req)
        let formData = new FormData()
        formData.append('file', req.files[0].buffer, {filename: "face", data: req.files[0].buffer})
        const formHeaders = formData.getHeaders();
        const fetchResp = await fetch(`http://${process.env.FETCH_ENDPOINT}/fetch?style=${route}&` + param, {
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
    let param = getNumber(req)
    const addResp = await fetch(`http://${process.env.FETCH_ENDPOINT}/fetch?` + param, {
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
    } else if (route == "admin") {
        const adminResp = await fetch(`http://admin-service:80/admin`, {
            method: 'GET'
        })
    
        var result = await adminResp.json()
        res.send({result})
    } else {
        let param = getNumber(req)
        const addResp = await fetch(`http://${process.env.FETCH_ENDPOINT}/fetch?style=${route}&` + param, {
            method: 'GET',      
        });
    
        console.log("Fetching base64 image")
        
        let responseCode = addResp.status
    
        var result = await addResp.json()
        res.status(responseCode).send({result}) 
}
})

router.get('/api/:apiName', upload.any(), async (req, res) => {
    console.log(`[!] /api/${req.params.apiName} was accessed.`)
    let route = req.params.apiName;
    
    if (route == "hats") {
        const addResp = await fetch(`http://${process.env.FETCH_ENDPOINT}/fetch?hats=true`, {
            method: 'GET',      
        });

        console.log("Fetching hat list")

        var result = await addResp.json()
        res.send(result)
    }
})

app.use('/', router)

app.listen(PORT, () => {
    console.log(`API Gateway started on port ${PORT}`)
})
