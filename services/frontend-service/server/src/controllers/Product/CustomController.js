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
            `http://gateway-service:80/mockup/${req.query.name}`,
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
