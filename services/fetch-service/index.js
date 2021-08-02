import express from 'express'
import multer from 'multer'

import { defaultBoss, getRandomHat, getSpecificHat, requestManipulate } from './src/helpers.js'
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
    let style = req.query.style
    let face = defaultBoss()
    let b64Result = ''

    if (style != "") {
        let hat = getSpecificHat(style)
        b64Result = await requestManipulate(face, hat)
    } else {
        let hat = getRandomHat()
        b64Result = await requestManipulate(face, hat)
    }


    res.send(b64Result)
});

router.post('/fetch', upload.any(), async(req, res) => {
    let style = req.query.style
    let face = req.files[0].buffer
    let b64Result = ''

    if (style != "") {
        let hat = getSpecificHat(style)

        b64Result = await requestManipulate(face, hat)
    } else {
        let hat = getRandomHat()

        b64Result = await requestManipulate(face, hat)
    }

    res.send(b64Result)
}); 