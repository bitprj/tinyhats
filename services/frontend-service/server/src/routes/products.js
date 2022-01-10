const express = require('express');
const router = express.Router();
const multer = require('multer')
const upload = multer()
const checkSession = require('../middleware/checkSession');
const IndexController = require('../controllers/Product/IndexController');
const ResetController = require('../controllers/Product/ResetController');
const CustomController = require('../controllers/Product/CustomController');

module.exports = app => {
    const redisClientService = app.get('redisClientService');

    const indexController = new IndexController(redisClientService);
    const resetController = new ResetController(redisClientService);
    const customController = new CustomController(redisClientService);

    router.get('/', [checkSession], (...args) => indexController.index(...args));
    router.post('/reset', (...args) => resetController.index(...args));
    router.post('/custom', upload.any(), (...args) => customController.index(...args));

    return router;
};
