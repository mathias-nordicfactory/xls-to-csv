var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'temp/uploads/' })
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/convert', upload.single('xls'), function(req, res, next){
    var workbook = XLSX.readFile('temp/uploads/'+req.file.filename);
    var sheet_name_list = workbook.SheetNames;
    var index, prevIndex;
    var csv="";
    sheet_name_list.forEach(function(y) {
        var worksheet = workbook.Sheets[y];
        for (z in worksheet) {
            prevIndex = z.replace(/^[A-Z]/gi, '')
            if(prevIndex != undefined && prevIndex != index && index != undefined && prevIndex.indexOf('!') != 0)
                csv += '\n<br/>'
            index = z.replace(/^[A-Z]/gi, '')
            if(z[0] === '!') continue;

            if(worksheet[z].v.indexOf(' ') >= 0)
                csv += '"';
                csv += worksheet[z].v;
            if(worksheet[z].v.indexOf(' ') >= 0)
                csv += '"';
                csv += ",";
        }
    });
    res.json({data: csv, name: req.file.originalname.substr(0, req.file.originalname.lastIndexOf('.'))})
    var filePath = 'temp/uploads/'+req.file.filename;
    fs.unlink(filePath);
})

module.exports = router;
