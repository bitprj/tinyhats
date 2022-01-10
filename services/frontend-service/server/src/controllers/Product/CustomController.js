const fetch = require('node-fetch')
const FormData = require('form-data')
class ProductCustomController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        console.log("Customize!")
        let face = req.files[0].buffer
        console.log(face)

        const formData = new FormData();
        formData.append('file', face, {filename: "face", data: face});

        console.log(req.query.name)
        const formHeaders = formData.getHeaders();
        const response = await fetch(
            `http://aecd4af3f5b31453e901f0e4fd885a63-1647978061.us-west-2.elb.amazonaws.com/mockup/${req.query.name}`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    ...formHeaders,
                    },    
            }
        );
        
        let data = await response.json()
        return res.send(data);
    }
}

module.exports = ProductCustomController;
