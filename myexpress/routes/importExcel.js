var express = require('express');
var path = require('path');
var router = express.Router();
var multipart = require('connect-multiparty');
var xlsx = require('node-xlsx');
var ejsExcel = require('ejsexcel');
var fs = require('fs');
var multipartMiddleware = multipart();

/* GET users listing. */
router.post('/config',multipartMiddleware, function(req, res, next) {
  // console.log(req.files);y
  var files = req.files;
  var tmp_path = files.config.path;
  var obj = xlsx.parse(tmp_path);
  var host = obj[0].data;
  var info =  obj[1].data;

  // console.log(host,info);
  var hostdata = [];
  for(var i=1;i<host.length;i++){
    var item = host[i];
    console.log(item[1]);
    var obj ={
      'name':item[1],
      'ip':item[2],
      'password':item[3],
      'info':item[4],
    }
    hostdata.push(obj);
  }
  var data ={};
  data.hosts = hostdata;
  data.base = info[0][1];
  data.rgw = info[1][1];
  data.cell = info[2][1];
  data.web = info[3][1];
  
  //copyexcel文件
  var deploy_tmp = path.join(__dirname,'../model.xlsx');
  var target_path = path.join(__dirname,'../target.xlsx');
  var exlBuf = fs.readFileSync(deploy_tmp);
  ejsExcel.renderExcel(exlBuf, data).then(function(exlBuf2) { //输出EXCEL文件
    fs.writeFileSync(target_path, exlBuf2);
    console.error('success');
  }).catch(function(err) {
      console.error(err);
  });
  //copyexcel文件
});
/* GET users listing. */
router.get('/',multipartMiddleware, function(req, res, next) {
  res.render('import', { title: 'import' });
});

module.exports = router;
