import express from 'express'
import multer from 'multer'

import { getSpecificHat, requestManipulate } from './src/helpers.js'
const upload = multer()
const app = express()
var router = express.Router();
const PORT = 1337

app.use('/', router)

app.listen(PORT, () => {
    console.log(`API Gateway started on port ${PORT}`)
})

router.post('/', upload.any(), async(req, res) => {
    let style = req.query.style
    let face = req.files[0].buffer
    let b64Result = ''

    let hat = await getSpecificHat(style)
    b64Result = await requestManipulate(face, hat)

    res.send(b64Result)
}); 