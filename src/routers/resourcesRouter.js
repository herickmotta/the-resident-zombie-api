const router = require('express').Router();
const resourcesController = require('../controllers/resourcesController');

router.get('/', async (req, res) => {
  const resources = await resourcesController.getAll();
  res.send(resources);
});

module.exports = router;
