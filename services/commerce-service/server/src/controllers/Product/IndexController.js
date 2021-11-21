const fetch = require('node-fetch')
class ProductIndexController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        const productKeys = await this.redisClientService.scan('product:*');
        const productList = [];

        if (productKeys.length) {
            for (const key of productKeys) {
                const product = await this.redisClientService.jsonGet(key);

                productList.push(JSON.parse(product));
            }

            return res.send(productList);
        }

        let result = await fetch('https://api.tinyhat.me/api/hats')
        let products = await result.json()

        for (const product of products) {
            const { url } = product;
            url = url.replace("https://tinyhats.s3.amazonaws.com/", "")
            url = url.replace(".png", "")
            await this.redisClientService.jsonSet(`product:${url}`, '.', JSON.stringify(product));
            
            productList.push(product);
        }

        return res.send(productList);
    }
}

module.exports = ProductIndexController;
