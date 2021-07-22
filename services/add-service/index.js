const express = require("express")
const multer = require('multer')
const fetch = require('node-fetch')
const FormData = require('form-data')
const FileType = require('file-type')
const upload = multer()
const app = express()
var router = express.Router();
const PORT = 3000

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

    // binary to base64 for html
    console.log("Image received")
    let base64Image = Buffer.from(image).toString("base64")
    console.log(base64Image)

    // hit the upload endpoint to upload image and retrieve unique image id
    let filemime = await FileType.fromBuffer(image)
    let formData = new FormData()
    formData.append('file', content, {filename: "baby", type: filemime, data: image})
    formData.append('data', {"name": name})
    const formHeaders = formData.getHeaders();
    
    const resp = await fetch(uri, {
        method: 'POST',
        body: formData,
            headers: {
            ...formHeaders,
            },        
    });

    var result = await resp.json()
    let id = result.key


    let html = `<h2>Review this image</h2>
    <h3><img src="data:${filemime};base64,${base64Image}" alt="" /></h3>
    <h3>Be sure to consider:</h3>
    <ul>
    <li>Is this appropriate?</li>
    <li>Does this picture contain a baby?</li>
    <li>Could a hat be easily overlayed on the head?</li>
    </ul>
    <p>Click <a href="uwuaas.com/moderate?approve=true&id=${id}">here</a> to approve.</p>
    <p>Click <a href="uwuaas.com/moderate?approve=false&id=${id}">here</a> to disapprove.</p>`
    
    let resp = fetch("/email", {
        method: "POST",
        body: {
            "send": "ganning@bitproject.org",
            "html": html
        }
    })
    res.send({name: name}) 
  }); 