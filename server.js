const express = require('express');
const app = express();
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = express.json();

const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use('/public', express.static('public'));

let taskInfo = [];

app.get('/', function(req, res) {
    if (taskInfo.length === 0)
        res.render("index", { taskAdded: false });
    else
        res.render("index", {
            taskAdded: true,
            taskInfo
        });
    console.log('server.js render index.ejs');
});

app.post('/', urlencodedParser, function(req, res) { //console.log('req.files >>>', req.files);     // console.log(req.body);
    req.files.myFile.name = req.files.myFile.name.split(' ').join('_');
    let myFile = req.files.myFile;
    let uploadPath = __dirname + '/public/downloadfiles/' + myFile.name;
    myFile.mv(uploadPath);

    let downloadPath = '/public/downloadfiles/' + myFile.name;
    taskInfo.push({ task: req.body.task, status: req.body.status, efdate: req.body.fdate, filename: myFile.name, filepath: downloadPath });
    res.render("index", {
        taskAdded: true,
        taskInfo
    });
    console.log('post success');

});

app.put('/', urlencodedParser, function(req, res) { //console.log('req.files >>>', req.files); 
    req.files.myFile.name = req.files.myFile.name.split(' ').join('_');
    let myFile = req.files.myFile;
    let uploadPath = __dirname + '/public/downloadfiles/' + myFile.name;
    myFile.mv(uploadPath);

    let downloadPath = '/public/downloadfiles/' + myFile.name;
    taskInfo.splice(req.body.tasknum, 1, { task: req.body.task, status: req.body.status, efdate: req.body.fdate, filename: myFile.name, filepath: downloadPath });
    res.render("index", {
        taskAdded: true,
        taskInfo
    });
    console.log('put success');

});

app.listen(8000, function() {
    console.log('server.js listening on port 8000!');
});