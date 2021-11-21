const { StatusCodes } = require('http-status-codes');
const { Analytics } = require('analytics')
const kafka = require('../../kafka-plugin')

const analytics = Analytics({
  app: 'app-name',
  plugins: [
    kafka
  ]
})

class CartEmptyController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        const { cartId } = req.session;

        analytics.track('emptied_cart', {
            cart_id: cartId
          })

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
