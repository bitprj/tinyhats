const express = require("express")
const multer = require('multer')
const fetch = require('node-fetch')
const FormData = require('form-data')
const FileType = require('file-type')
const upload = multer()
const app = express()
var router = express.Router();
const PORT = 31337

// for testing locally: node -r dotenv/config index.js  
// https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get


app.use('/', router)

app.listen(PORT, () => {
    console.log(`API Gateway started on port ${PORT}`)
})

router.post('/add', upload.any(), async(req, res) => {
    let image = req.files[0].buffer
    let name = req.body.name
    // parse from body

    // hit the upload endpoint to upload image and retrieve unique image id
    let filemime = (await FileType.fromBuffer(image)).mime
    console.log(`Mime Type: ${filemime}`)
    let formData = new FormData()
    formData.append('file', image, {filename: "baby", mimetype: filemime, data: image})
    formData.append('name', name)
    formData.append('mimeType', filemime)
    const formHeaders = formData.getHeaders();
    
    const uploadResp = await fetch("/upload", {
        method: 'POST',
        body: formData,
            headers: {
            ...formHeaders,
            },        
    });

    var result = await uploadResp.json()
    console.log(`Received from /upload: ${JSON.stringify(result)}`)
    let id = result.key
    let imgLink = result.url


    let html = `<h2>Review this image</h2>
    <h3><img src="${imgLink}" alt="" /></h3>
    <h3>Be sure to consider:</h3>
    <ul>
    <li>Is this appropriate?</li>
    <li>Does this picture contain a baby?</li>
    <li>Could a hat be easily overlayed on the head?</li>
    </ul>
    <p>Click <a href="uwuaas.com/moderate?approve=true&id=${id}">here</a> to approve.</p>
    <p>Click <a href="uwuaas.com/moderate?approve=false&id=${id}">here</a> to disapprove.</p>`
    
    let modEmail = "emilychen@bitproject.org"

    let sendEmail = await fetch(`/email?send=${modEmail}`, {
        method: "POST",
        body: html
    })

    var emailResp = await sendEmail.json()
    console.log(`Received from /email: ${JSON.stringify(emailResp)}`)
    res.send({response: emailResp}) 
  }); 