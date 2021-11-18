const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const proxy = require('express-http-proxy');
const app = express();

const PORT = process.env.PORT || 4000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(morgan('dev'));

app.use((req, res, next) => {
  if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
    next();
  } else {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  }
});
app.use(express.static(path.join(__dirname, 'build')));

app.use('/roku', proxy('192.168.1.226:8060'));
app.use('/coffee', proxy('pi3.local:5000'));
app.use('/printer', proxy('pi2.local:5555'));

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
