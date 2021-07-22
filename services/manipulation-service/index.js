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
    const hatLinks = ["https://user-images.githubusercontent.com/69332964/126653629-e831e99b-d76a-456c-bc83-fb3b484f75ef.png", "https://user-images.githubusercontent.com/69332964/126653667-2f70b5ad-5d54-48cd-b4ef-040d1d675b87.png", "https://user-images.githubusercontent.com/69332964/126653737-24fa9f18-d3d9-41aa-83f5-142024a33d0c.png", "https://user-images.githubusercontent.com/69332964/126653777-a853ecae-5a79-4d25-9de9-0173c73c498c.png", "https://user-images.githubusercontent.com/69332964/126653847-cf0c6f9e-46b6-409b-abab-3b845d7358ee.png"]
    let randNum = Math.floor(Math.random() * hatLinks.length)

    let baby = req.files[0].buffer
    let hat = hatLinks[randNum]

    let result = await image.findBaby(baby)
    // push to lowdb
    res.send(result) 
  });