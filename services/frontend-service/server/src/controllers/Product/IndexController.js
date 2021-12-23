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

        let result = await fetch('http://aecd4af3f5b31453e901f0e4fd885a63-1647978061.us-west-2.elb.amazonaws.com/catalog')
        let products = await result.json()
        console.log(products)

        for (const product of products) {
            var { description } = product;
            var { hat } = hatData;
            var { preview1 } = preview1Data
            var { preview2 } = preview2Data
            await this.redisClientService.jsonSet(`product:${description}`, '.', JSON.stringify(product));

            productList.push({product});
        }

        return res.send(productList);
    }
}

module.exports = ProductIndexController;
