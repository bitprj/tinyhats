import express from 'express'
import multer from 'multer'
import fetch from 'node-fetch'
import FormData from 'form-data'
import { listPictures, downloadBuffer } from './src/helpers.js'
const upload = multer()
const app = express()
var router = express.Router();
const PORT = 1337

// for testing locally: node -r dotenv/config index.js  
// https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get


app.use('/', router)

app.listen(PORT, () => {
    console.log(`API Gateway started on port ${PORT}`)
})

router.get('/fetch', upload.any(), async(req, res) => {
    // get random baby picture
    let babies = await listPictures()
    let babiesList = babies[0]
    console.log(babiesList)

    let randNum = Math.floor(Math.random() * babiesList.length)
    let babyLink = babiesList[randNum].url
    console.log(babyLink)

    let image = await downloadBuffer(babyLink)
    image = Buffer.from(image)
    console.log(image)

    // hit the upload endpoint to upload image and retrieve unique image id
    let formData = new FormData()
    formData.append('file', image, {filename: "baby", data: image})
    const formHeaders = formData.getHeaders();
    
    const manipulateRequest = await fetch("/manipulate", {
        method: 'POST',
        body: formData,
            headers: {
            ...formHeaders,
            },        
    });

    var b64Result = await manipulateRequest.json()
    console.log(`Received response from /manipuate`)

    res.send(b64Result)
  }); 