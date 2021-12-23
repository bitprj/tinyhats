const { StatusCodes } = require('http-status-codes');
const fetch = require('node-fetch')
class ProductResetController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        const cartKeys = await this.redisClientService.scan('cart:*');

        for (const key of cartKeys) {
            await this.redisClientService.del(key);
        }

        let result = await fetch('https://api.tinyhat.me/api/hats')
        let products = await result.json()
        console.log(products)
        for (const product of products) {
            var { url } = product;
            url = url.replace("https://tinyhats.s3.amazonaws.com/", "")
            url = url.replace(".png", "")
            await this.redisClientService.jsonSet(`product:${url}`, '.', JSON.stringify(product));
        }

        return res.sendStatus(StatusCodes.OK);
    }
}

module.exports = ProductResetController;
