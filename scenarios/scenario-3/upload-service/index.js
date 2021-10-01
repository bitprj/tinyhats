import express from 'express'
import multer from 'multer'
const upload = multer()
const app = express()
import { uniqueId, fileExt, push2RDS } from './src/helpers.js'
var router = express.Router();
const PORT = 8080

// for testing locally: node -r dotenv/config index.js  
// https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get


app.use('/', router)

app.listen(PORT, () => {
    console.log(`API Gateway started on port ${PORT}`)
})

router.post('/upload', upload.any(), async(req, res) => {
    console.log("Started")
    let image = req.files[0].buffer
    let name = req.body.name
    let fileName = uniqueId()
    // parse from body
    console.log(fileName, name, image)

    // determine file extension
    let ext = fileExt(req.body.mimeType)

    // binary to base64
    console.log("Image received")
    let imageData = Buffer.from(image).toString("base64")

    // push to rds
    let data = await push2RDS(fileName, ext, name, imageData)
    res.send(data) 
  });