const { StatusCodes } = require('http-status-codes');
const { Analytics } = require('analytics')
const kafka = require('../../kafka-plugin')

const analytics = Analytics({
  app: 'app-name',
  plugins: [
    kafka
  ]
})
class CartDeleteItemController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        analytics.track('deleted', {
            hat_id: productId
          })
        const { cartId } = req.session;
        const { id: productId } = req.params;

        const quantityInCart =
            parseInt(await this.redisClientService.hget(`cart:${cartId}`, `product:${productId}`)) || 0;

        if (quantityInCart) {
            await this.redisClientService.hdel(`cart:${cartId}`, `product:${productId}`);

            let productInStore = await this.redisClientService.jsonGet(`product:${productId}`);

            productInStore = JSON.parse(productInStore);
            productInStore.stock += quantityInCart;

            await this.redisClientService.jsonSet(`product:${productId}`, '.', JSON.stringify(productInStore));
        }

        return res.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = CartDeleteItemController;
