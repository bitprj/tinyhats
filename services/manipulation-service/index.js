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

router.post('/add', upload.any(), async(req, res) => {
    var result;
    var previews = []
    console.log(req.files)
    let name = req.params("description")
    let hat = req.files[0].buffer
    const models = ["https://image.freepik.com/free-photo/close-up-shot-pretty-woman-with-perfect-teeth-dark-clean-skin-having-rest-indoors-smiling-happily-after-received-good-positive-news_273609-1248.jpg", "https://media.istockphoto.com/photos/handsome-young-man-on-white-background-picture-id523478288?k=20&m=523478288&s=612x612&w=0&h=Fg8yDwFhbB4XljB1aCclYbjJpUlRwB-jcPPFfd1Iteg="]

    for (const model of models) {
        try {
            result = await image.findFace(model)
        } catch (e) {
            res.send("Invalid image")
            console.log(e)
        }

        let finalImage = await image.overlayHat(hat, result, model)
        previews.push(finalImage)
    }

    let uploadRes = await image.uploadPreview(name, Buffer.from(hat).toString("base64"), previews[0], previews[1])
    console.log(uploadRes)

    res.send({"response": `Your hat with a description of '${name}' was added."`}) 
  });