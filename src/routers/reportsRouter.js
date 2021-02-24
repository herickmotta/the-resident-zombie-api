const router = require('express').Router();
const reportsController = require('../controllers/reportsController');

router.get('/survivors', async (req, res) => {
  const survivors = await reportsController.getSurvivorsInfo();
  res.send({ survivors });
});

router.get('/resources', async (req, res) => {
  const resources = await reportsController.getResourcesInfo();
  res.send(resources);
});

router.get('/points', (req, res) => {

});
module.exports = router;
