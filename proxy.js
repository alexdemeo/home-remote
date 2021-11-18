const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path')
const proxy = require('express-http-proxy');
const app = express();

const PORT = process.env.PORT || 4000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(morgan('dev'));

app.use('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/roku', proxy('192.168.1.226:8060'));
app.use('/coffee', proxy('pi3.local:5000'));
app.use('/printer', proxy('pi2.local:5555'));


app.use(express.static(path.join(__dirname, 'build')))

app.get('/*', (req, res) => {
  console.log('response static to', req.hostname, 'ip', req.ip, 'path', req.path)
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
