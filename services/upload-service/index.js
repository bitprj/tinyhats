const express = require('express')
const bodyParser = require('body-parser')
const app = express()
var router = express.Router();
const PORT = 3000

// https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get

app.use(express.json())
app.use(bodyParser.json({
    extended: true
}));

app.use('/', router)

app.listen(PORT, () => {
    console.log(`API Gateway started on port ${PORT}`)
})

router.post('/upload', function(req, res){
    console.log("Image received")
    res.send("Your body is: " + JSON.stringify(req.body))
  });