const express = require('express');
const router = express.Router();
const assetsController = require('../controllers/assets.controller');

router.get('/', assetsController.getAssets);
router.post('/', assetsController.createAsset);
router.put('/:id', assetsController.updateAsset);
router.delete('/:id', assetsController.deleteAsset);

module.exports = router;
