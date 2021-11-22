const { StatusCodes } = require('http-status-codes');
// const { Analytics } = require('analytics')
const kafka = require('../../kafka-plugin.js')

// const analytics = Analytics({
//   app: 'app-name',
//   plugins: [
//     kafka.kafkaPlugin
//   ]
// })

class CartEmptyController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        const { cartId } = req.session;

        await kafka.kafkaPlugin(JSON.stringify({'event':'emptied_cart', 'cartId': cartId}))
        // analytics.track('emptied_cart', {
        //     cart_id: cartId
        //   })

        const cartList = await this.redisClientService.hgetall(`cart:${cartId}`);

        if (!cartList) {
            return res.sendStatus(StatusCodes.NO_CONTENT);
        }

        for (const key of Object.keys(cartList)) {
            await this.redisClientService.hdel(`cart:${cartId}`, key);

            let productInStore = await this.redisClientService.jsonGet(key);

            productInStore = JSON.parse(productInStore);
            productInStore.stock += parseInt(cartList[key]);

            await this.redisClientService.jsonSet(key, '.', JSON.stringify(productInStore));
        }

        return res.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = CartEmptyController;
