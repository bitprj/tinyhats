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
    // get random hat picture
    let hats = await listPictures()
    let hatList = hats[0]
    console.log(hatList)

    let randNum = Math.floor(Math.random() * hatList.length)
    let hatLink = hatList[randNum].url
    console.log(hatLink)

    let image = await downloadBuffer(hatLink)
    image = Buffer.from(image)
    console.log(image)

    //my fav boss ever
    let johnKinmonth = await downloadBuffer("https://pbs.twimg.com/profile_images/812363965095235584/hfniQLSk_400x400.jpg");
    johnKinmonth = Buffer.from(johnKinmonth)
    console.log(johnKinmonth)

    // hit the upload endpoint to upload image and retrieve unique image id
    let formData = new FormData()
    formData.append('file', johnKinmonth, {filename: "johnKinmonth", data: johnKinmonth})
    formData.append('file', image, {filename: "hat", data: image})
    const formHeaders = formData.getHeaders();
    
    const manipulateRequest = await fetch(`http://${process.env.MANIPULATE_ENDPOINT}/manipulate`, {
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