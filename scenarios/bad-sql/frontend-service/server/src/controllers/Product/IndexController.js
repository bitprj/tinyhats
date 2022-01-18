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

        let result = await fetch('http://gateway-service:80/catalog')
        let products = await result.json()
        products = products.result

        for (const product of products) {
            console.log(product.Description)
            await this.redisClientService.jsonSet(`product:${product.Description}`, '.', JSON.stringify(product));
            productList.push({product});
        }

        return res.send(productList);
    }
}

module.exports = ProductIndexController;