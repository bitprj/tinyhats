import express from 'express'
import multer from 'multer'
const upload = multer()
const app = express()
import { uniqueId, uploadFile, fileExt } from './src/helpers.js'
import pushDB from './src/lowdb.js'
var router = express.Router();
const PORT = 3000

// for testing locally: node -r dotenv/config index.js  
// https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get


app.use('/', router)

app.listen(PORT, () => {
    console.log(`API Gateway started on port ${PORT}`)
})

router.post('/upload', upload.any(), async(req, res) => {
    let image = req.files[0].buffer
    let category = req.body.category
    let name = req.body.name
    let fileName = uniqueId()
    // parse from body

    // determine file extension
    let ext = fileExt(req.files[0].mimetype)

    // base64 image to binary data
    console.log("Image received")
    let imageData = Buffer.from(image, 'base64')

    // upload to s3
    let link = await uploadFile(fileName + ext, imageData, category)

    // push to lowdb
    res.send(await pushDB(fileName + ext, name, link, category)) 
  });