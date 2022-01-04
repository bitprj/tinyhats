const express = require('express')
const multer = require('multer')
const upload = multer()
const app = express()
const helpers = require('./src/helpers.js')
var router = express.Router();
const PORT = 80

// for testing locally: node -r dotenv/config index.js  
// https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get

app.use('/', router)

app.listen(PORT, () => {
    console.log(`API Gateway started on port ${PORT}`)
})

router.post('/', upload.any(), async(req, res) => {
    var previews = []
    console.log(req.files)
    let name = req.body.name
    let hat = req.files[0].buffer
    const models = ["https://image.freepik.com/free-photo/close-up-shot-pretty-woman-with-perfect-teeth-dark-clean-skin-having-rest-indoors-smiling-happily-after-received-good-positive-news_273609-1248.jpg", "https://media.istockphoto.com/photos/handsome-young-man-on-white-background-picture-id523478288?k=20&m=523478288&s=612x612&w=0&h=Fg8yDwFhbB4XljB1aCclYbjJpUlRwB-jcPPFfd1Iteg="]

    for (const model of models) {
        let finalImage = await helpers.callManipulate(model, hat)
        previews.push(finalImage)
    }

    let uploadRes = await helpers.uploadPreview(name, hat, Buffer.from(previews[0]), Buffer.from(previews[1]))
    console.log(uploadRes)

    res.send({"response": `Your hat with a description of '${name}' was added."`}) 
  });