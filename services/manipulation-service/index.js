const express = require('express')
const multer = require('multer')
const upload = multer()
const app = express()
const image = require('./src/image.js')
var router = express.Router();
const PORT = 3000

// for testing locally: node -r dotenv/config index.js  
// https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get


app.use('/', router)

app.listen(PORT, () => {
    console.log(`API Gateway started on port ${PORT}`)
})

router.post('/manipulate', upload.any(), async(req, res) => {
    let cat = req.files[0].buffer
    let hat = req.files[1].buffer

    return image.findCat(cat)
    // push to lowdb
    res.send(await pushDB(fileName + ext, name, link, category)) 
  });