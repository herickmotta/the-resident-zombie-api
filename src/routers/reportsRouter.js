const reportsController = require('../controllers/reportsController');

const router = require('express').Router();

router.get('/survivors', async (req, res) => {
  const survivors = await reportsController.getSurvivorsInfo();
  res.send({ survivors });
});

router.get('/resources', (req, res) => {

});

router.get('/points', (req, res) => {

});
module.exports = router;
