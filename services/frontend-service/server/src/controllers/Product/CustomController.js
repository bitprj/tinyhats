const fetch = require('node-fetch')
class ProductCustomController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        console.log(req.body)
        const response = await fetch(
            `http://aecd4af3f5b31453e901f0e4fd885a63-1647978061.us-west-2.elb.amazonaws.com/mockup/${req.query.name}`,
            {
                method: 'POST',
                body: req.body
            }
        );
        return res.send(response);
    }
}

module.exports = ProductCustomController;
