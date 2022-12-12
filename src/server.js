const express = require('express');
const fileUpload = require('express-fileupload');
const body_parser = require('body-parser');
const url = require('url');
const app = express();

database = require("./database");

app.use(fileUpload());
app.use('/documents', express.static('documents'));
app.use('/scripts', express.static('scripts'));
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());

const PORT = 8080; 

app.get('/', function(req, res) {
  res.sendFile('/html/index.html' , { root : __dirname});
})

app.post('/upload', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
  }
  let file = req.files.file;
  file_name = file.name;
  file.mv('./documents/' + file_name, function(err) {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      }

  database.query("insert into storage (filename, times_rated) VALUES (?, ?)", [file_name, 0], function(err, rows) {
    if (err) {
      console.log(err);
      return;
    }
  })

  res.send('Файл '  + file_name +  ' успешно загружен');
  })
});

app.get('/clicked', function(req, res) {
  database.query("select * from storage order by times_rated desc limit 3", function(err, rows) {
    if (err) {
      console.log(err);
      return;
    }
    res.send(rows);
  })
})

app.post('/submit', function(req, res) {

  console.log('Got body:', req.body);

  up = url.parse(req.body.filename);
  
  filename_arr = up.path.split("/");
  filename = filename_arr[2];

  database.query("insert into reviews (filename, rate, review) VALUES (?, ?, ?)", [filename, req.body.rate, req.body.review]);
  database.query("update storage set times_rated = times_rated + 1 where filename = ?", [filename]);
})

app.get('/show', function(req, res) {
  database.query("select * from reviews order by filename", function(err, rows) {
    if (err) {
      console.log(err);
      return;
    }

    res.send(rows);
    console.log(rows);
  })
})

app.listen(PORT, function () {
  console.log('Server is listening on port ' + PORT);
})