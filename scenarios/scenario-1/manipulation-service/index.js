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

router.post('/manipulate', upload.any(), async(req, res) => {
    var result;
    console.log(req.files)
    let baby = req.files[0].buffer
    let hat = req.files[1].buffer
    let rotate = parseInt(req.query.rotate)
    let translate = parseInt(req.query.translate)

    try {
        // send to AWS SDK
        console.log(baby)
        result = await image.findBaby(baby)
    } catch (e) {
        res.send("Invalid image")
        console.log(e)
    }

    let finalBaby = await image.overlayHat(hat, result, baby, translate, rotate)
    res.send({finalBaby}) 
  });