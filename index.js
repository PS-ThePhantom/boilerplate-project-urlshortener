require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;
const urls = [];

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(bodyParser.urlencoded({extended: false}));

app.post('/api/shorturl', function(req, res) {
  let original_url = req.body.url;
  if (!original_url || !original_url.match(/^(http|https):\/\/[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/)) {
    return res.json({ 'error': 'invalid URL' });
  }

  let short_url = urls.length + 1;
  if (urls.includes(original_url)) short_url = urls.indexOf(original_url) + 1;
  else urls.push(original_url);

  res.json({ 'original_url': original_url, 'short_url': short_url });
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const short_url = req.params.short_url;
  
  if (!short_url || isNaN(short_url) || short_url < 1 || short_url > urls.length) {
    return res.json({ 'error': 'invalid URL' });
  }
  
  res.redirect(urls[short_url - 1]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
