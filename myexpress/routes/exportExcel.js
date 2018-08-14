var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.download('./config/deploy_tmp_blank.xlsx','deploy_tmp_blank.xlsx');
});

module.exports = router;
