const fetch = require('node-fetch')
class ProductCustomController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        console.log(req.body)
        const response = await fetch(
            `http://gateway-service:80/mockup/${req.query.name}`,
            {
                method: 'POST',
                body: req.body
            }
        );
        return res.send(response);
    }
}

module.exports = ProductCustomController;
