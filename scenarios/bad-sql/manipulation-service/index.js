const express = require('express')
const multer = require('multer')
const upload = multer()
const app = express()
const image = require('./src/image.js')
var router = express.Router();
const PORT = 80

// for testing locally: node -r dotenv/config index.js  
// https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get

app.use('/', router)

app.listen(PORT, () => {
    console.log(`API Gateway started on port ${PORT}`)
})

router.post('/', upload.any(), async(req, res) => {
    let hat = req.files[0].buffer
    let face = req.files[1].buffer
    
    try {
        result = await image.findFace(face)
    } catch (e) {
        res.send("Invalid image")
        console.log(e)
    }

    let preview = await image.overlayHat(hat, result, face)

    res.send({preview}) 
  });